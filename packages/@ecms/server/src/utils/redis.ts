/**
 * Handles setting up a connection to redis
 */

import createLogger from "./logger";
import { createClient } from "redis";
import RedisClient, { RedisClientType } from "redis/dist/lib/client";

/** Store the connection itself to distribute out when requested */
let theClient: RedisClientType<any, any>;

/**
 * Creates a connection to the DB based on the ECMS config.
 * 
 * Make sure the ECMS config (the .env file) is loaded!
 * 
 * Prefer using a provided pool instead.
 * 
 * @returns a pg pool (A object that let's us create and free connection to the DB)
 */
export default function connectToRedis(): RedisClientType<any, any> {
	const logger = createLogger("redis");
	logger.info("Creating new Redis connection...");
	if (typeof theClient !== "undefined") {
		logger.info("Reusing already created Redis Client...");
		return theClient;
	}
	theClient = createClient({
		url: process.env.ECMS_REDIS_URL,
	});

	theClient.on("error", (err) => logger.error("Redis Client Error", err));
	theClient.on("connect", () => logger.info("Redis Client Connected - event fired!"));
	theClient.connect()
		.catch((err) => logger.error("Redis Client connection error", err));

	return theClient;
}