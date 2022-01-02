/**
 * API routes for events
 * @packageDocumentation
 */
import { event_only_settings, matches } from "@ecms/models";
import { Router } from "express";
import { connectToDBKnex } from "../utils/db";
import { ECMSResponse } from "../utils/interfaces";
import createLogger from "../utils/logger";
 
const router = Router();
const logger = createLogger("api:events");
 
 
// Use Knex - easier to query with!
const knex = connectToDBKnex();

/**
 * Retrieve event matches
 */
router.get("/:id/matches", async (req, res, next) => {
	const eventID = req.params.id;
	logger.info(`Retrieving matches for event ${eventID}...`);
	try {
		const matches = await knex
			.select<matches>("*")
			.from("matches")
			.where("parent_event", eventID);

		res.json(matches);
	} catch (err) {
		logger.error(`Error getting matches for event ${eventID}!`);
		logger.error((err as Error)?.message);
		res.status(500).json({
			message: `Internal Server Error - ${(err as Error)?.message}`,
		});
	}
	
});

/**
 * Retrieve event info
 */
router.get("/:id/info", async (req, res: ECMSResponse<event_only_settings>, next) => {
	const eventID = req.params.id;
	logger.info(`Retrieving information for event ${eventID}...`);
	try {
		const info = await knex
			.select<event_only_settings[]>("event_only_settings.*")
			.from("event_only_settings")
			.join("events_and_groups", "event_only_settings.event_settings_id", "events_and_groups.event_settings_id")
			.where("events_and_groups.event_group_id", eventID);

		res.json(info[0]);
	} catch (err) {
		logger.error(`Error getting matches for event ${eventID}!`);
		logger.error((err as Error)?.message);
		res.status(500).json({
			message: `Internal Server Error - ${(err as Error)?.message}`,
		});
	}
	
});

export default router;