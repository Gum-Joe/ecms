import SetupEventOrGroup, { ImportCompetitors, ReqUploadCompetitorsCSV, SetupStates } from "@ecms/api/setup";
import { competitorsInitializer, events_and_groupsInitializer, event_only_settings, event_only_settingsInitializer, teamsInitializer } from "@ecms/models";
import type { Pool, PoolClient } from "pg";
import postgresPromise from "pg-promise";
import uuid from "uuid";
import { COMPETITOR_IMPORT_REDIS_KEY_PREFIX, SETUP_REDIS_KEY_PREFIX } from "../utils/constants";
import type connectToDB from "../utils/db";
import { PartialSetup, RedisCompetitorImport } from "../utils/interfaces";
import createLogger from "../utils/logger";
import type connectToRedis from "../utils/redis";

//const logger = createLogger("setup:end");
const pgp = postgresPromise();




export default class SetupHandler {
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
		this.logger = createLogger(`setup:end:${setupID}`);
	}

	/**
	 * Starts finalising setup
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
		// 2b: insert into event_and_groups
		this.logger.debug("Getting DB client...");
		this.client = await this.pool.connect();
		this.logger.debug("Starting SQL transaction...");
		await this.client.query("BEGIN");

		try {
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
			};
			// From https://stackoverflow.com/questions/37313571/omiting-column-names-inserting-objects-directly-into-node-postgres
			const queryTxt = pgp.helpers.insert(event_and_groups, null, "event_and_groups");
			await this.client.query(queryTxt);
	
			if (this.setupInfo.type === "event") {
	
				// Event specific stuff
	
				this.logger.info("Handling event specific information...");
	
				// 2c: insert event data if required
				this.logger.info("Adding event specific info...");
				if (!this.setupInfo.event_settings) {
					this.logger.error("No event settings found, despite this being an event!");
					throw new Error("E_INVALID_SETUP: No event settings found, despite this being an event!");
				} else if (!this.setupInfo.event_settings.data_tracked) {
					this.logger.error("Data tracked for this event not specified!");
					throw new Error("E_INVALID_SETUP: Data tracked for this event not specified!");
				}
	
				/// TODO: Add data unit
				this.logger.warn("Event unit currently not stored!");
				const event_settings: event_only_settingsInitializer = {
					data_tracked: this.setupInfo.event_settings.data_tracked
				};
				// RETURNING * from https://github.com/brianc/node-postgres/issues/1269|
				const res = await this.client.query<event_only_settings>("INSERT INTO event_only_settings(data_tracked) VALUES ($1) RETURNING *", [event_settings.data_tracked]);
				const settingsID = res.rows[0].event_settings_id;
				this.logger.debug("Updating event_and_groups entry...");
				await this.client.query("UPDATE event_and_groups SET event_settings_id = $1 WHERE event_group_id = $2;", [settingsID, this.setupInfo]);
	
			}


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
			throw err;
		}
	} 

	public async endSetup(): Promise<void> {
		await this.client.query("COMMIT");
		this.client.release();
		this.logger.info(`Done in ${(Date.now() - this.startTime) / 1000} seconds. Client released.`);
		return;
	}

	/**
	 * Inserts teams
	 */
	protected async checkTeams() {
		if (this.setupInfo.enable_teams && !(this.setupInfo.inheritance === true)) {
			this.logger.debug("Preparing teams to creates...");
			if (!Array.isArray(this.setupInfo.teams)) {
				this.logger.error("Bad type provided for teams array in setup info.");
				throw new Error("E_INVALID_SETUP: Bad type provided for teams array in setup info!");
			}
			// Generate ids of teams and map to their info, so we can refer back to the IDs 
			this.teamIdMaps = this.setupInfo.teams?.map(teamInfo => {
				if (typeof teamInfo.name !== "string" || typeof teamInfo.colour !== "string") {
					throw new Error(`E_INVALID_SETUP: Type of name or colour incorrect! Expected string, got ${teamInfo.name} and ${teamInfo.colour}`); 
				}
				return [uuid.v4(), teamInfo];
			});

			// Insert!
			for (const team of this.teamIdMaps) {
				this.logger.debug(`Inserting team with ID ${team[0]}, name ${team[1].name}`);
				await this.client.query(`
					INSERT INTO teams(team_id, name, colour) VALUES ($1, $2, $3);
					INSERT INTO join_events_groups_teams(event_group_id, team_id) VALUES ($4, $1)
				`, [team[0], team[1].name, team[1].colour, this.setupID]);
			}

			this.logger.debug("Teams processed.");
			this.hasTeams = true;
		}
	}

	/**
	 * Process matches
	 */
	protected async processMatches() {
		// Whilst we have access to the list of IDs, process matches
		if (this.setupInfo.event_settings && this.setupInfo.event_settings.data_tracked === "matches") {
			this.logger.info("Processing matches...");
			if (!this.hasTeams) {
				// TODO: Could be inheritance
				this.logger.error("Error: no teams in this event! Skipping matches processing...");
				this.logger.warn("Could be inheritance.");
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
	 * Process competitors if there are any
	 */
	protected async processCompetitors(): Promise<void> {
		try {
			if (this.setupInfoRedis.hasImportedCompetitors) {
				this.logger.info("Processing competitors to import...");
				// Validate info present
				if (!this.setupInfo.competitor_settings) {
					throw new Error("No competitor settings found in setup info!");
				}
	
				if (this.setupInfo.competitor_settings.type === "discrete") {
					this.logger.info("Using discretely set competitors, either import or list");
					if ("competitor_import_id" in this.setupInfo.competitor_settings) {
						this.logger.info("Setting competitor metatdata in the DB...");
						const settingsID = uuid.v4();
						await this.client.query(`
							INSERT INTO competitor_settings(competitor_settings_id, type) VALUES ($1, 'discrete');
							UPDATE event_and_groups SET competitor_settings_id = $1 WHERE event_group_id = $2;
						`, [settingsID, this.setupID]);
						await this.importCompetitors(this.setupInfo.competitor_settings, settingsID);
					} else {
						this.logger.warn("Explicitly set competitors not yet supported. Skipping...");
					}
				} else {
					this.logger.warn("No other competitor import types currently supported. Skipping...");
				}
			}
		} catch (err) {
			this.logger.error("Error importing competitors!");
			throw err;
		}
		
	}

	/** Import competitors from a CSV */
	protected async importCompetitors(settings: ImportCompetitors, settingsID: string): Promise<void> {
		this.logger.info("Importing competitors from CSV...");
		if (!settings.competitor_import_id) {
			throw new Error("No competitor import ID found - competitors may not have been uploaded to the server!");
		}
		

		// Grab from Redis
		this.logger.debug("Grabbing from redis and validating...");
		const importData = this.redis.HGETALL(COMPETITOR_IMPORT_REDIS_KEY_PREFIX + this.setupID) as unknown as Partial<RedisCompetitorImport>;
		if (!importData) {
			throw new Error("Imported competitor data not found in redis!");
		}
		if (!importData.csvData || !importData.csvMetadata) {
			throw new Error("CSV Data or Metedata not found in redis when importing competitors!");
		}

		this.logger.debug("Preparing CSV data...");
		this.logger.debug("Parsing import data...");
		this.logger.warn("Using first part of name for firstname");
		const parsedImportData: ReqUploadCompetitorsCSV = {
			csvData: JSON.parse(importData.csvData),
			csvMetadata: JSON.parse(importData.csvMetadata),
			setupID: this.setupID,
		};
		const processedList: competitorsInitializer[] = parsedImportData.csvData.data.map((data, index) => {
			this.logger.debug(`Preparing entry ${index} of ${parsedImportData.csvData.data.length}`);
			const name = data[parsedImportData.csvMetadata.nameIndex].split(" ");
			let team_id = null;
			if (this.hasTeams) {
				const teamIndex = settings.teamsMap[data[parsedImportData.csvMetadata.nameIndex]];
				team_id = this.teamIdMaps[teamIndex][0];
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
				this.logger.debug(`Importing ID ${competitor.id} (${compIndex + 1}/${numberCompetitors})`);
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
		this.logger.info("Rolling back...");
		await this.client.query("ROLLBACK");
	}


	/** Use this to end a currently running transaction when there's an error */
	protected async endSetupWithError() {
		await this.rollback();
		this.client.release();
	}

}