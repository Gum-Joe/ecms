/**
 * Connects to the Database for us.
 * 
 * It uses the fact that in node, modules are only loaded ONCE,
 * meaning an internal variable here will always be the same Pool instance for all files,
 * no matter what loads this file!
 * @packageDocumentation
 */

import { Pool } from "pg";
import createLogger from "./logger";
import makeKnex from "knex";

/** Store the pool itself to distribute out when requested */
let thePool: Pool;
let theKnexPool: ReturnType<typeof makeKnex>;

/**
 * Get the connection params for the DB client
 * @returns Parameters to pass to the DB client
 */
export function getDBParams() {
	return {
		host: process.env.ECMS_DB_HOSTNAME,
		port: parseInt(process.env.ECMS_DB_PORT || "5434", 10),
		user: process.env.ECMS_DB_USERNAME,
		password: process.env.ECMS_DB_PASSWORD,
		database: process.env.ECMS_DB_DB,
	};
}

/**
 * Creates a connection to the DB based on the ECMS config, that used the Knex library
 * 
 * Make sure the ECMS config (the .env file) is loaded!
 * 
 * Prefer using a provided pool instead.
 * 
 * @returns knex object to interacty with the DB
 */
 export function connectToDBKnex(): ReturnType<typeof makeKnex> {
	const logger = createLogger("db");
	
	if (typeof theKnexPool !== "undefined") {
		logger.info("Asked for a DB connection: Reusing already created Knex object...");
		return theKnexPool;
	}
	logger.info("Creating new DB connection with knex...");
	theKnexPool = makeKnex({
		connection: getDBParams(),
		client: "pg",
	});

	logger.info("Connected.");
	return theKnexPool;
}

/**
 * Creates a connection to the DB based on the ECMS config.
 * 
 * Make sure the ECMS config (the .env file) is loaded!
 * 
 * Prefer using a provided pool instead.
 * 
 * @returns a pg pool (A object that let's us create and free connection to the DB)
 */
export default function connectToDB(): Pool {
	const logger = createLogger("db");
	
	if (typeof thePool !== "undefined") {
		logger.info("Asked for new DB connection: reusing already created Postgres Pool...");
		return thePool;
	}
	logger.info("Creating new DB connection...");
	thePool = new Pool(getDBParams());
	
	// Setup error handling
	logger.debug("Setting up error handling...");
	// the pool will emit an error on behalf of any idle clients
	// it contains if a backend error or network partition happens
	// From https://node-postgres.com/features/pooling
	thePool.on("error", (err) => {
		logger.error("Unexpected error on idle client", err);
		process.exit(-1);
	});

	logger.info("Connected.");
	return thePool;
}