/**
 * Common API routes for events and group
 * @packageDocumentation
 */
import { ResEventsGroupsList } from "@ecms/api/common";
import { Router } from "express";
import makeKnex from "knex";
import connectToDB, { getDBParams } from "../utils/db";
import { ECMSResponse } from "../utils/interfaces";
import createLogger from "../utils/logger";
import connectToRedis from "../utils/redis";

const router = Router();
const logger = createLogger("api:setup");
 
const pool = connectToDB();
const redis = connectToRedis();

// Use Knex - easier to query with!
const knex = makeKnex({
	client: "pg",
	connection: getDBParams(),
});

/**
 * Returns a list of events/groups, by default those not in a group
 */
router.get("/list", async (req, res: ECMSResponse<ResEventsGroupsList>) => {
	try {
		logger.info("Getting list of events and group...");
		const theList = await knex
			.select("name")
			.select("event_group_id")
			.select("description")
			.select("type")
			.select("parent_id")
			.select("complete")
			.select("archived")
			.from("events_and_groups")
			.where("parent_id", null);
		res.json(theList);
	} catch (err) {
		logger.error("Error getting list of events!");
		logger.error(err);
		res.status(500).json({
			message: `Internal Server Error - ${(err as Error)?.message}`,
		});
	}
});

export default router;