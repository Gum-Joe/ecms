/**
 * Common API routes for events and group
 * @packageDocumentation
 */
import { ResEventsGroupsList } from "@ecms/api/common";
import { ReqCompetitors } from "@ecms/api/events";
import { events_and_groups, teams } from "@ecms/models";
import { Router } from "express";
import { connectToDBKnex } from "../utils/db";
import { ECMSResponse, RequestWithBody } from "../utils/interfaces";
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

/**
 * Retrieve competitors - currently just by team
 * Also gets data for the competitor
 * 
 * Please provide the team_id in the request PARAMETERS!
 */
router.get("/:id/competitors", async (req, res, next) => {
	const eventID = req.params.id;
	const teamID = req.query.team_id as string;
	if (req.query.team_id) {
		logger.info(`Fetching competitor from event/group ${req.params.id} for team ${teamID}...`);
		try {
			// TODO: Apply competitor_additions, etc!
			logger.debug("Getting competitor settings ID...");
			const eventSettingsID = await knex
				.select("competitor_settings_id")
				.from("events_and_groups")
				.where("event_group_id", eventID);
			if (eventSettingsID.length === 0) {
				return res.status(403).json({
					message: "No competitor settings found for this event! Please check competitors have been set.",
				});
			}
			const dbres = await knex
				.select("competitors.id")
				.select("competitors.lastname")
				.select("competitors.firstname")
				.select("competitors.data")
				.select("competitors.team_id")
				.select("competitor_data.competitor_data_id")
				.select("competitor_data.stored_data")
				.select("competitor_data.points")
				.select("competitor_data.additional_data")
				.select("competitor_data.overriden")
				.select("competitor_data.dnf")
				.from("competitors")
				// TODO: Order messed up!
				.where("competitors.team_id", teamID)
				// Get any prestored data using the competitor_settings_id
				.andWhere(function () {
					this.where("competitor_data.competitor_settings_id",
						eventSettingsID[0].competitor_settings_id
					)
						// and if non exists, resturn it (hence the OR, we allow through a NULL value for competitor_settings_id)
						.orWhere("competitor_data.competitor_settings_id", null);
				})
				// anything beyond the above for competitor_settings_id may result in data for a different event being returned!
				.leftJoin("competitor_data", "competitors.competitor_id", "competitor_data.competitor_id")
				.orderBy("competitors.firstname", "asc")
				.orderBy("competitors.lastname", "asc");
			res.json(dbres);
		} catch (err) {
			logger.error(`Error getting competitors for event/group ${eventID}!`);
			logger.error((err as Error)?.message);
			res.status(500).json({
				message: `Internal Server Error - ${(err as Error)?.message}`,
			});
		}
	}
});

export default router;