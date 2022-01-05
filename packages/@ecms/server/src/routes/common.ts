/**
 * Common API routes for events and group
 * @packageDocumentation
 */
import { ResEventsGroupsList } from "@ecms/api/common";
import { events_and_groups, teams } from "@ecms/models";
import { Router } from "express";
import { connectToDBKnex } from "../utils/db";
import { ECMSResponse } from "../utils/interfaces";
import createLogger from "../utils/logger";

const router = Router();
const logger = createLogger("api:setup");


// Use Knex - easier to query with!
const knex = connectToDBKnex();

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
		logger.error((err as Error)?.message);
		res.status(500).json({
			message: `Internal Server Error - ${(err as Error)?.message}`,
		});
	}
});

/**
 * Retrieve teams associated with an event/group
 */
router.get("/:id/teams", async (req, res: ECMSResponse<teams>, next) => {
	const eventID = req.params.id;
	logger.info(`Retrieving teams for ${eventID}...`);
	try {
		const teams = await knex
			.select<teams>("*")
			.from("join_events_groups_teams")
			.where("event_group_id", eventID)
			.join("teams", "join_events_groups_teams.team_id", "teams.team_id");

		res.json(teams);
	} catch (err) {
		logger.error(`Error getting matches for event ${eventID}!`);
		logger.error((err as Error)?.message);
		res.status(500).json({
			message: `Internal Server Error - ${(err as Error)?.message}`,
		});
	}
	
});


/**
 * Retrieve general info about an event/group
 */
 router.get("/:id/info", async (req, res: ECMSResponse<events_and_groups>, next) => {
	const eventID = req.params.id;
	logger.info(`Retrieving information for event/group ${eventID}...`);
	try {
		const info = await knex
			.select<events_and_groups[]>("*")
			.from("events_and_groups")
			.where("event_group_id", eventID);

		res.json(info[0]);
	} catch (err) {
		logger.error(`Error getting info for event ${eventID}!`);
		logger.error((err as Error)?.message);
		res.status(500).json({
			message: `Internal Server Error - ${(err as Error)?.message}`,
		});
	}
	
});

export default router;