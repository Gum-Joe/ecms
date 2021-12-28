import SetupEventOrGroup, { SetupStates } from "@ecms/api/setup";
import { events_and_groupsInitializer, event_only_settings, event_only_settingsInitializer, teamsInitializer } from "@ecms/models";
import type { Pool } from "pg";
import postgresPromise from "pg-promise";
import uuid from "uuid";
import { SETUP_REDIS_KEY_PREFIX } from "../utils/constants";
import type connectToDB from "../utils/db";
import createLogger from "../utils/logger";
import type connectToRedis from "../utils/redis";

const logger = createLogger("setup:end");
const pgp = postgresPromise();

interface PartialSetup {
	status: SetupStates,
	/** JSON setup data of form {@link SetupEventOrGroup} */
	data: string,
}



/**
 * Finalises setup, putting it into the database. Designed to be called by the api.
 */
export default async function endSetup(setupID: string, pool: ReturnType<typeof connectToDB>, redis: ReturnType<typeof connectToRedis>) {
	
	logger.info(`Ending setup with ID ${setupID}...`);
	// 1: retrieve from redis
	logger.info("Marking setup as being finalised...");
	await redis.HSET(SETUP_REDIS_KEY_PREFIX + setupID, "status", "finalising");
	logger.debug("Retrieiving setup from redis...");
	const setupInfoRedis = (await redis.HGETALL(SETUP_REDIS_KEY_PREFIX + setupID)) as unknown as PartialSetup;
	logger.debug("Parsing information...");
	const setupInfo = JSON.parse(setupInfoRedis.data) as Partial<SetupEventOrGroup>;
	logger.debug("Setup retrieved.");

	// 2: start inserting data into DB

	// 2a: Validate.
	logger.info("Validating basic setup information...");
	if (!setupInfo.name || !setupInfo.type) {
		logger.error("Name or type properties missing in setup!");
		throw new Error("E_INVALID_SETUP: Name or type properties missing in setup!");
	}
	// 2b: insert into event_and_groups
	logger.debug("Getting DB client...");
	const client = await pool.connect();
	logger.debug("Starting SQL transaction...");
	await client.query("BEGIN");

	try {
		logger.info("Creating event_and_groups entry...");
		// Use setupID as the ID so we know it
		const event_and_groups: events_and_groupsInitializer = {
			event_group_id: setupID,
			name: setupInfo.name,
			description: setupInfo.description,
			enable_teams: setupInfo.enable_teams === true ? true : false,
			enable_charity: setupInfo.enable_charity === true ? true : false,
			inheritance: setupInfo.inheritance === true ? true : false,
			type: setupInfo.type,
			parent_id: setupInfo.parent_id || null,
		};
		// From https://stackoverflow.com/questions/37313571/omiting-column-names-inserting-objects-directly-into-node-postgres
		const queryTxt = pgp.helpers.insert(event_and_groups, null, "event_and_groups");
		await client.query(queryTxt);

		// If there are teams to create, create them!
		if (setupInfo.enable_teams && !(setupInfo.inheritance === true)) {
			logger.debug("Preparing teams to creates...");
			if (!Array.isArray(setupInfo.teams)) {
				logger.error("Bad type provided for teams array in setup info.");
				throw new Error("E_INVALID_SETUP: Bad type provided for teams array in setup info!");
			}
			// Generate ids of teams and map to their info, so we can refer back to the IDs 
			const teamIdMaps: [string, teamsInitializer][] = setupInfo.teams?.map(teamInfo => {
				if (typeof teamInfo.name !== "string" || typeof teamInfo.colour !== "string") {
					throw new Error(`E_INVALID_SETUP: Type of name or colour incorrect! Expected string, got ${teamInfo.name} and ${teamInfo.colour}`); 
				}
				return [uuid.v4(), teamInfo];
			});

			// Insert!
			for (const team of teamIdMaps) {
				logger.debug(`Inserting team with ID ${team[0]}, name ${team[1].name}`);
				await client.query(`
					INSERT INTO teams(team_id, name, colour) VALUES ($1, $2, $3);
					INSERT INTO join_events_groups_teams(event_group_id, team_id) VALUES ($4, $1)
				`, [team[0], team[1].name, team[1].colour, setupID]);
			}

			logger.debug(" Teams processed.");
		}

		
		if (setupInfo.type === "event") {

			// Event specific stuff

			logger.info("Handling event specific information...");

			// 2c: insert event data if required
			logger.info("Adding event specific info...");
			if (!setupInfo.event_settings) {
				logger.error("No event settings found, despite this being an event!");
				throw new Error("E_INVALID_SETUP: No event settings found, despite this being an event!");
			} else if (!setupInfo.event_settings.data_tracked) {
				logger.error("Data tracked for this event not specified!");
				throw new Error("E_INVALID_SETUP: Data tracked for this event not specified!");
			}

			/// TODO: Add data unit
			logger.warn("Event unit currently not stored!");
			const event_settings: event_only_settingsInitializer = {
				data_tracked: setupInfo.event_settings.data_tracked
			};
			const queryTxt = pgp.helpers.insert(event_settings, null, "event_only_settings");
			// RETURNING * from https://github.com/brianc/node-postgres/issues/1269|
			const res = await client.query<event_only_settings>("INSERT INTO event_only_settings(data_tracked) VALUES ($1) RETURNING *", [event_settings.data_tracked]);
			const settingsID = res.rows[0].event_settings_id;
			logger.debug("Updating event_and_groups entry...");
			await client.query("UPDATE event_and_groups SET event_settings_id = $1 WHERE event_group_id = $2 ", [settingsID, setupInfo]);

			// Next move determined by 

		}
	} catch (err) {
		await client.query("ROLLBACK");
		throw err;
	} finally {
		client.release();
	}
	
	

	
}