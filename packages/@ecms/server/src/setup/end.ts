import { TaskStatus } from "@ecms/api/common";
import SetupEventOrGroup, { ImportCompetitors, ReqUploadCompetitorsCSV, SetupStates } from "@ecms/api/setup";
import { competitorsInitializer, events_and_groupsInitializer, event_only_settings, event_only_settingsInitializer, join_events_groups_teams, teams, teamsId, teamsInitializer } from "@ecms/models";
import type { Pool, PoolClient } from "pg";
import postgresPromise from "pg-promise";
import * as uuid from "uuid";
import { COMPETITOR_IMPORT_REDIS_KEY_PREFIX, SETUP_REDIS_KEY_PREFIX } from "../utils/constants";
import type connectToDB from "../utils/db";
import { connectToDBKnex } from "../utils/db";
import followInheritance from "../utils/followInheritance";
import { getTeamsMapForEventGroup } from "../utils/getTeamsMapForEventGroup";
import { PartialSetup, RedisCompetitorImport } from "../utils/interfaces";
import createLogger from "../utils/logger";
import type connectToRedis from "../utils/redis";
import filterCompetitorFrom from "./filter";

//const logger = createLogger("setup:end");
const pgp = postgresPromise();
const knex = connectToDBKnex();


/**
 * Used to handle redis status messages for long running tasks
 */
class RedisStateHandler {
	protected logger: ReturnType<typeof createLogger>;

	constructor(protected redisClient: ReturnType<typeof connectToRedis>, protected redisKey: string) {
		this.logger = createLogger("redis:state");
	}
	
	public setRedisDone() {
		return this.redisClient.HSET(this.redisKey, "status", "done");
	}

	public setRedisError(err: unknown) {
		let errorMessage = `Unknown error encountered. Error object was ${err}.`;
		if (typeof err === "object") {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore: error handling
			errorMessage = err?.message || `Unknown error encountered. Error object was ${err}.`;
		}
		const status: TaskStatus & Record<string, string> = {
			status: "error",
			error: errorMessage,
		};
		return this.redisClient.HSET(this.redisKey, status);
	}
}

export default class SetupHandler extends RedisStateHandler {
	protected client!: PoolClient;
	protected logger: ReturnType<typeof createLogger>;

	protected setupInfoRedis!: PartialSetup;
	protected setupInfo!: Partial<SetupEventOrGroup>;

	/** Set to true once teams have been processed and added to the DB (if there are any) */
	protected hasTeams = false;
	/** Map UUIDs of teams to data on them. Index is index from {@link this.setupInfo.teams} */
	protected teamIdMaps: [string, teamsInitializer][] = [];

	/** Start time */
	protected startTime = Date.now();
 

	constructor(public readonly setupID: string, protected pool: ReturnType<typeof connectToDB>, protected redis: ReturnType<typeof connectToRedis>) {
		super(redis, SETUP_REDIS_KEY_PREFIX + setupID);
		this.logger = createLogger(`setup:end:${setupID}`);
	}

	/**
	 * Finalise setup, but do so in the background.
	 * This run finalise and stores the result in redis, for picking up by the client from there later
	 */
	public async finaliseHandOff() {
		this.logger.info(`Ending setup with ID ${this.setupID}, but storing state in Redis...`);
		try {
			await this.finalise();
			await this.setRedisDone();
		} catch (err) {
			this.logger.error("Error detected in setup handoff mode!");
			this.setRedisError(err)
				.catch(err => this.logger.error(`Error setting setup error state: ${err?.message}`));
		}
	}

	/**
	 * Error 
	 */

	/**
	 * Starts finalising setup.
	 * Call this function first - it sets us the database connection and gets data from Redis
	 */
	public async finalise(): Promise<void> {
		this.logger.info(`Ending setup with ID ${this.setupID}...`);
		// 1: *9-retrieve from redis
		this.logger.info("Marking setup as being finalised...");
		await this.redis.HSET(SETUP_REDIS_KEY_PREFIX + this.setupID, "status", "finalising");
		this.logger.debug("Retrieiving setup from redis...");
		this.setupInfoRedis = (await this.redis.HGETALL(SETUP_REDIS_KEY_PREFIX + this.setupID)) as unknown as PartialSetup;
		this.logger.debug("Parsing information...");
		this.setupInfo = JSON.parse(this.setupInfoRedis.data) as Partial<SetupEventOrGroup>;
		this.logger.debug("Setup retrieved.");

		// 2: start inserting data into DB

		// 2a: Validate.
		this.logger.info("Validating basic setup information...");
		if (!this.setupInfo.name || !this.setupInfo.type) {
			this.logger.error("Name or type properties missing in setup!");
			throw new Error("E_INVALID_SETUP: Name or type properties missing in setup!");
		}
		if (this.setupInfo.inheritance && !this.setupInfo.parent_id) {
			throw new Error("E_INVALID_SETUP: Parent ID missing but inheritance set!");
		}
		// 2b: insert into event_and_groups
		this.logger.debug("Getting DB client...");
		this.client = await this.pool.connect();
		this.logger.debug("Starting SQL transaction...");
		await this.client.query("BEGIN");

		try {
			let settingsID = null;
			if (this.setupInfo.type === "event") {
	
				// Event specific stuff
	
				this.logger.info("Handling event specific information first...");
	
				// 2c: insert event data if required
				this.logger.info("Adding event specific info...");
				this.logger.debug("Validating...");
				if (!this.setupInfo.event_settings) {
					this.logger.error("No event settings found, despite this being an event!");
					throw new Error("E_INVALID_SETUP: No event settings found, despite this being an event!");
				} else if (!this.setupInfo.event_settings.data_tracked) {
					this.logger.error("Data tracked for this event not specified!");
					throw new Error("E_INVALID_SETUP: Data tracked for this event not specified!");
				} else if (this.setupInfo.event_settings.data_tracked === "individual" && !this.setupInfo.event_settings.unit) {
					this.logger.error("No unit provided depsite 'individual' tracking set!");
					throw new Error("E_INVALID_SETUP: No unit provided depsite 'individual' tracking set!");
				}


				const event_settings: event_only_settingsInitializer = {
					data_tracked: this.setupInfo.event_settings.data_tracked
				};

				if (this.setupInfo.event_settings.data_tracked === "individual") {
					this.logger.debug("Also adding a unit.");
					const res = await this.client.query(`
					WITH theUnit AS (
						INSERT INTO data_units(unit_name, unit, decimal_places)
						VALUES ($1, $2, $3)
						RETURNING unit_id
					)
					INSERT INTO event_only_settings(data_tracked, unit_id)
						VALUES (
							$4,
							( SELECT unit_id FROM theUnit )
						) RETURNING *;
					`, [
						this.setupInfo.event_settings.unit?.unit_name,
						this.setupInfo.event_settings.unit?.unit,
						this.setupInfo.event_settings.unit?.decimal_places,
						event_settings.data_tracked,
					]);
					settingsID = res.rows[0].event_settings_id;
				} else {
					const res = await this.client.query<event_only_settings>("INSERT INTO event_only_settings(data_tracked) VALUES ($1) RETURNING *;", [event_settings.data_tracked]);
					settingsID = res.rows[0].event_settings_id;
				}
				
	
			}

			// Add points if necessary
			const pointsID = await this.setPoints();

			this.logger.info("Creating event_and_groups entry...");
			// Use setupID as the ID so we know it
			const event_and_groups: events_and_groupsInitializer = {
				event_group_id: this.setupID,
				name: this.setupInfo.name,
				description: this.setupInfo.description,
				enable_teams: this.setupInfo.enable_teams === true ? true : false,
				enable_charity: this.setupInfo.enable_charity === true ? true : false,
				inheritance: this.setupInfo.inheritance === true ? true : false,
				type: this.setupInfo.type,
				parent_id: this.setupInfo.parent_id || null,
				event_settings_id: settingsID,
				points_settings_id: pointsID,
			};
			// From https://stackoverflow.com/questions/37313571/omiting-column-names-inserting-objects-directly-into-node-postgres
			const queryTxt = pgp.helpers.insert(event_and_groups, null, "events_and_groups");
			await this.client.query(queryTxt);
	
			
			

			// Next: check teams
			await this.checkTeams();
			// Then matches (function checks if needs to run!)
			await this.processMatches();
			// Now competitors
			await this.processCompetitors();
			// Done!
			await this.endSetup();
		} catch (err) {
			await this.endSetupWithError();
			const castError = err as Error;
			this.logger.error(`Stopped setup due to error ${castError.message || castError || "UNKNOWN"}`);
			if (process.env.NODE_ENV === "development" && "stack" in castError) {
				this.logger.error(castError.stack);
			}
			throw castError;
		}
	} 

	/**
	 * Adds points settings
	 */
	protected async setPoints(): Promise<null | string> {
		if (!this.setupInfo.points) {
			this.logger.warn("No points settings found, so skipping adding points settings...");
			return null;
		} else {
			this.logger.info(`Adding points settings for system ${this.setupInfo.points.module_id}...`);
			const pointsID = uuid.v4();
			await this.client.query(`
				INSERT INTO points_settings(
					config,
					module_id,
					points_settings_id
				) VALUES (
					$1,
					$2,
					$3
				)
			`, [this.setupInfo.points.config, this.setupInfo.points.module_id, pointsID]);
			return pointsID;
		}
	}

	public async endSetup(): Promise<void> {
		await this.client.query("COMMIT");
		this.client.release();
		this.logger.info(`Done in ${(Date.now() - this.startTime) / 1000} seconds. Client released.`);
		return;
	}

	/**
	 * Inserts teams into the database. Will check if this needs to be done.
	 */
	protected async checkTeams() {
		if (this.setupInfo.enable_teams) {
			this.logger.info("Preparing teams to create...");
			if (!Array.isArray(this.setupInfo.teams)) {
				this.logger.error("Bad type provided for teams array in setup info.");
				throw new Error("E_INVALID_SETUP: Bad type provided for teams array in setup info!");
			}
			// Generate ids of teams and map to their info, so we can refer back to the IDs
			if (!this.setupInfo.inheritance) {
				this.logger.debug("No teams to inherit. Preparing teams with new IDs...");
				this.teamIdMaps = this.setupInfo.teams?.map(teamInfo => {
					if (typeof teamInfo.name !== "string" || typeof teamInfo.colour !== "string") {
						throw new Error(`E_INVALID_SETUP: Type of name or colour incorrect! Expected string, got ${teamInfo.name} and ${teamInfo.colour}`); 
					}
					return [uuid.v4(), teamInfo];
				});
			} else {
				this.logger.debug("Using teams from parent event. Retrieving these manually.");
				// NOTE: Expecting team IDs provided to be the in the parent.
				const teamIDFetches = this.setupInfo.teams?.map(async (teamInfo): Promise<[string, teams]> => {
					// For inheritance, expecting team IDs from the client of the teams to use.
					if (typeof teamInfo.team_id !== "string") {
						throw new Error(`E_INVALID_SETUP: Team ID for an inherited team not provided in teams entry! Expected string, got ${teamInfo.team_id}`); 
					}
					const teamInfoDB = (await knex.select<teams[]>("*").from("teams").where("team_id", teamInfo.team_id))[0];
					if (!teamInfoDB) {
						throw new Error("ENONENT: Team ID provided does not exist in database!");
					}
					// Validate team to make sure it is in the parent
					this.logger.debug(`Validating team with ID ${teamInfo.team_id} is in parent of ID ${this.setupInfo.parent_id}`);
					const isInParent = await knex
						.select("*")
						.from("join_events_groups_teams")
						.where("event_group_id", this.setupInfo.parent_id);
					if (isInParent.length === 0) {
						throw new Error(`EINVALID: Team provided of ID ${teamInfo.team_id} is not in parent of ID ${this.setupInfo.parent_id}!`);
					}
					// Else if no errors, return its ID and info
					return [teamInfo.team_id as string, teamInfoDB];
				});
				this.logger.debug("Waiting for DB fetches to finish...");
				this.teamIdMaps = await Promise.all(teamIDFetches);
			}
			
			// Insert!
			for (const team of this.teamIdMaps) {
				
				// We only need to insert if it doesn't exist, i.e. no inheritance
				if (!this.setupInfo.inheritance) {
					this.logger.info(`Inserting team with ID ${team[0]}, name ${team[1].name}`);
					await this.client.query(`
						INSERT INTO teams(team_id, name, colour) VALUES ($1, $2, $3);
					`, [team[0], team[1].name, team[1].colour]);
				}
				
				// Add the join.
				this.logger.info(`Joining team ${team[0]} to this event/group`);
				await this.client.query(`
					INSERT INTO join_events_groups_teams(event_group_id, team_id) VALUES ($1, $2)
				`, [ this.setupID,  team[0] ]);
			}

			this.logger.info("Teams processed.");
			this.hasTeams = true;
		}
	}

	/**
	 * Process matches, adding them to the database
	 */
	protected async processMatches() {
		// Whilst we have access to the list of IDs, process matches
		if (this.setupInfo.event_settings && this.setupInfo.event_settings.data_tracked === "matches") {
			this.logger.info("Processing matches...");
			if (!this.hasTeams) {
				// TODO: Could be inheritance
				this.logger.error("Error: no teams in this event! Skipping matches processing...");
				return;
			}
			if (!Array.isArray(this.setupInfo.matches) || this.setupInfo.matches.length === 0) {
				// Adding no matches is a valid move, so just emit a warning
				this.logger.warn("No matches given in event config, skipping match processing...");
			}
			for (const match of (this.setupInfo.matches || [])) {
				
				const team_1 = this.teamIdMaps[match.team_1];
				const team_2 = this.teamIdMaps[match.team_2];
				this.logger.info(`Inserting match between ${team_1[1].name} and ${team_2[1].name}`);
				await this.client.query("INSERT INTO matches(team_1, team_2, parent_event) VALUES ($1, $2, $3)", [team_1[0], team_2[0],  this.setupID]);
			}
		}
	}

	/**
	 * Process competitors if there are any.
	 * Decides what to do for the different competitor_setting types (discrete, filter from parent, etc) and calls the appropriate method
	 */
	protected async processCompetitors(): Promise<void> {
		try {
			this.logger.info("Processing competitors to import...");
			// Validate info present
			if (!this.setupInfo.competitor_settings) {
				this.logger.warn("No competitor settings found in setup info! Skipping....");
				return;
			}

			const settingsID = uuid.v4();
			if (this.setupInfo.competitor_settings.type === "discrete") {
				this.logger.info("Using discretely set competitors, either import or list");
				if ("competitor_import_id" in this.setupInfo.competitor_settings) {
					this.logger.info("Setting competitor metatdata in the DB...");
					await this.client.query(`
							INSERT INTO competitor_settings(competitor_settings_id, type) VALUES ($1, 'discrete');
						`, [settingsID]);
					await this.client.query(`
							UPDATE events_and_groups SET competitor_settings_id = $1 WHERE event_group_id = $2;
						`, [settingsID, this.setupID]);
					await this.importCompetitors(this.setupInfo.competitor_settings, settingsID);
				} else {
					this.logger.warn("Explicitly set competitors not yet supported. Skipping...");
				}
			} else if (this.setupInfo.competitor_settings.type === "inherit")  {
				this.logger.info("Asked to inherit competitors from parent.");
				this.logger.debug("Setting the type to \"inherit\"");
				await this.client.query(`
							INSERT INTO competitor_settings(competitor_settings_id, type) VALUES ($1, 'inherit');
						`, [settingsID]);
				await this.client.query(`
							UPDATE events_and_groups SET competitor_settings_id = $1 WHERE event_group_id = $2;
						`, [settingsID, this.setupID]);

			} else if (this.setupInfo.competitor_settings.type === "filter_parent") {
				this.logger.info(`Filtering competitors from ID ${this.setupInfo.parent_id}`);
				if (!this.setupInfo.parent_id) {
					this.logger.error("parent_id not found!");
					throw new Error("Parent ID not provided!");
				}

				if (!this.setupInfo.competitor_settings.filters) {
					this.logger.error("No filters provided!");
					throw new Error("No filters provided!");
				}

				this.logger.debug("Setting the type to \"filter_parent\"");
				await this.client.query(`
							INSERT INTO competitor_settings(competitor_settings_id, type) VALUES ($1, 'filter_parent');
						`, [settingsID]);
				await this.client.query(`
							UPDATE events_and_groups SET competitor_settings_id = $1 WHERE event_group_id = $2;
						`, [settingsID, this.setupID]);

				this.logger.info("Inserting filters...");
				for (const filter of this.setupInfo.competitor_settings.filters) {
					await this.client.query(`
						INSERT INTO competitor_filters(
							type,
							field,
							matcher,
							value,
							competitor_settings_id
						)	VALUES (
							$1,
							$2,
							$3,
							$4,
							$5
						);
					`, [
						filter.type,
						filter.field,
						filter.matcher,
						filter.value,
						settingsID
					]);
				}
				

				// Run it
				// TODO: Team Map
				this.logger.debug("Generating teams map...");
				const teamsMap = await getTeamsMapForEventGroup((await followInheritance(this.setupInfo.parent_id, knex)).event_group_id, knex);
				const IDs = await filterCompetitorFrom(this.setupInfo.parent_id, this.setupInfo.competitor_settings.filters, knex, teamsMap);

				// JOIN!
				this.logger.info("Processing competitors into join table...");
				for (const competitor of IDs) {
					this.logger.debug(`Processing competitor with ID ${competitor.competitor_id}`);
					await this.client.query(`
						INSERT INTO join_competitor_events_group(competitor_id, competitor_settings_id) VALUES (
						$1,
						$2
					);`, [competitor.competitor_id, settingsID]);
				}

				this.logger.info("Done.");

			} else {
				this.logger.warn("No other competitor import types currently supported. Skipping...");
			}
		} catch (err) {
			this.logger.error("Error importing competitors!");
			throw err;
		}
		
	}

	/**
	 * Import competitors from a CSV - retrieves the CSV data to import from redis (note the CSV data is already parsed before being put into Redis!)
	 * @param settings a object mathcing {@link ImportCompetitors} that specifies the settings to use when importing the competitor from the CSV.
	 * @param settingsID ID of the record in the `competitor_settings` table so we can link competitor to it via `join_competitor_events_group`
	 */
	protected async importCompetitors(settings: ImportCompetitors, settingsID: string): Promise<void> {
		this.logger.info("Importing competitors from CSV...");
		if (!settings.competitor_import_id) {
			throw new Error("No competitor import ID found - competitors may not have been uploaded to the server!");
		}
		

		// Grab from Redis
		this.logger.debug("Grabbing from redis and validating...");
		const importData = await this.redis.HGETALL(COMPETITOR_IMPORT_REDIS_KEY_PREFIX + this.setupID) as unknown as Partial<RedisCompetitorImport>;
		if (!importData) {
			throw new Error("Imported competitor data not found in redis!");
		}
		if (!importData.csvData || !importData.csvMetadata) {
			throw new Error("CSV Data or Metadata not found in redis when importing competitors!");
		}

		this.logger.debug("Preparing CSV data...");
		this.logger.debug("Parsing import data...");
		this.logger.warn("Using first part of name for firstname");
		const parsedImportData: ReqUploadCompetitorsCSV = {
			csvData: JSON.parse(importData.csvData),
			csvMetadata: JSON.parse(importData.csvMetadata),
			setupID: this.setupID,
		};
		const processedList: competitorsInitializer[] = parsedImportData.csvData.data
			.filter((data, index) => {
				if (typeof data?.[parsedImportData.csvMetadata.teamIndex] === "undefined") {
					this.logger.warn(`Skipping entry ${index} of ${parsedImportData.csvData.data.length} as missing teamIndex column`);
					return false;
				} else if (typeof data?.[parsedImportData.csvMetadata.nameIndex] === "undefined") {
					this.logger.warn(`Skipping entry ${index} of ${parsedImportData.csvData.data.length} as missing nameIndex column`);
					return false;
				} else {
					return true;
				}
			})
			.map((data, index) => { 
				this.logger.debug(`Preparing entry ${index} of ${parsedImportData.csvData.data.length}`);
				const name = data[parsedImportData.csvMetadata.nameIndex].split(" ");
				let team_id = null;
				if (this.hasTeams) {
				// Teams already in the list aren't mapped, so check for those!
					const teamsCheckIndex = this.setupInfo.teams?.findIndex(team => team.name === data[parsedImportData.csvMetadata.teamIndex]);
					if (teamsCheckIndex !== -1 && (teamsCheckIndex || teamsCheckIndex === 0)) {
						team_id = this.teamIdMaps[teamsCheckIndex][0];
					} else {
					// Find in map
						const teamIndex = settings.teamsMap[data[parsedImportData.csvMetadata.teamIndex]];
						team_id = this.teamIdMaps[teamIndex][0];
					}
				
				}
				// Remove columns we don't want
				const filteredData = data.filter((value, index) => index !== parsedImportData.csvMetadata.nameIndex && index !== parsedImportData.csvMetadata.teamIndex);
				const dataAsObject: Record<string, string> = {};
				for (const [index, datum] of data.entries()) {
					if (index !== parsedImportData.csvMetadata.nameIndex && index !== parsedImportData.csvMetadata.teamIndex) {
						dataAsObject[parsedImportData.csvData.headers[index]] = datum;
					} else {
						continue;
					}
				}
				return {
					id: uuid.v4(),
					firstname: name[0],
					lastname: name.slice(1).join(" "),
					/** Index: fkidx_90 */
					team_id,
					data: dataAsObject,
				};
			});

		this.logger.debug("Data parsed. Now inserting into database...");
		const numberCompetitors = processedList.length;
		
		try {
			for (const [compIndex, competitor] of processedList.entries()) {
				this.logger.info(`Importing ID ${competitor.id} (${compIndex + 1}/${numberCompetitors})`);
				// We also need to handle jopining, hence the query
				await this.client.query(`
				WITH competitor AS (
					INSERT INTO competitors (
						id,
						firstname,
						lastname,
						team_id,
						data
					) VALUES (
						$1,
						$2,
						$3,
						$4,
						$5
					) RETURNING competitor_id
				)
				INSERT INTO join_competitor_events_group(competitor_id, competitor_settings_id) VALUES (
					(SELECT competitor_id FROM competitor),
					$6
				);
				`, [
					competitor.id,
					competitor.firstname,
					competitor.lastname,
					competitor.team_id,
					competitor.data,
					settingsID
				]);
			}
		} catch (err) {
			this.logger.error("Error during DB insertion of competitors!");
			throw err;
		}	
		this.logger.info("Data imported.");
	}

	public async rollback() {
		this.logger.error("Rolling back...");
		await this.client.query("ROLLBACK");
	}


	/** Use this to end a currently running transaction when there's an error */
	protected async endSetupWithError() {
		await this.rollback();
		this.client.release();
	}

}