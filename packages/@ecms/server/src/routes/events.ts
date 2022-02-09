/**
 * API routes for events
 * @packageDocumentation
 */
import { data_units, event_only_settings, matches } from "@ecms/models";
import { ReqCompetitors, ReqEditMatchScores, ResEventInfo } from "@ecms/api/events";
import { Router } from "express";
import connectToDB, { connectToDBKnex } from "../utils/db";
import { ECMSResponse, RequestWithBody } from "../utils/interfaces";
import createLogger from "../utils/logger";
import calculatePoints from "../utils/points";
 
const router = Router();
const logger = createLogger("api:events");
 
 
// Use Knex - easier to query with!
const knex = connectToDBKnex();
const pool = connectToDB();

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
 * Update matches - can update multiple
 */
router.patch("/:id/matches/edit/score", async (req: RequestWithBody<ReqEditMatchScores>, res, next) => {
	const eventID = req.params.id;
	logger.info("Updating matches for " + eventID);

	if (!Array.isArray(req.body)) {
		res.statusCode = 403;
		res.json({
			message: "Did not receive an array of matches",
		});
	}

	
	// Else, proceed!
	try {
		const client = await pool.connect();
		try {
			await client.query("BEGIN");

			let updated = 0;
			for (const match of req.body) {
				if (!match) {
					logger.warn("Skipping match with no data...");
					continue;
				}
				logger.info(`Updating match ${match.match_id}`);
				await client.query(
					`
						UPDATE matches
						SET team_1_score = $1, team_2_score = $2
						WHERE match_id = $3;
					`,
					[match.team_1_score, match.team_2_score, match.match_id]
				);
				updated++;
				logger.info("Match updated.");
			}

			logger.info(`Committing changes to ${updated} matches...`);
			await client.query("COMMIT");

			res.json({
				message: `Successfully updated ${updated} matches`,
			});
		} catch (err) {
			logger.error(`Error getting matches for event ${eventID}!`);
			await client.query("ROLLBACK");
			logger.error((err as Error)?.message);
			res.status(500).json({
				message: `Internal Server Error - ${(err as Error)?.message}`,
			});
		} finally {
			client.release();
		}
	} catch (err) {
		logger.error("Error connecting to DB!");
		logger.error((err as Error)?.message);
		res.status(500).json({
			message: `Internal Server Error - ${(err as Error)?.message}`,
		});
	}
	
});

/**
 * Retrieve event SPECIFIC info
 */
router.get("/:id/info", async (req, res: ECMSResponse<ResEventInfo>, next) => {
	const eventID = req.params.id;
	logger.info(`Retrieving information for event ${eventID}...`);
	try {
		const info = await knex
			.select<event_only_settings[]>("event_only_settings.*")
			.from("event_only_settings")
			.join("events_and_groups", "event_only_settings.event_settings_id", "events_and_groups.event_settings_id")
			.where("events_and_groups.event_group_id", eventID);
		
		const theEvent: ResEventInfo = info[0];

		if (theEvent.unit_id || theEvent.unit_id === 0) {
			const theUnit = await knex
				.select<data_units[]>("*")
				.from("data_units")
				.where("unit_id", theEvent.unit_id);
			
			theEvent.unit = theUnit?.[0];
		}

		res.json(theEvent);
	} catch (err) {
		logger.error(`Error getting matches for event ${eventID}!`);
		logger.error((err as Error)?.message);
		res.status(500).json({
			message: `Internal Server Error - ${(err as Error)?.message}`,
		});
	}
	
});

/**
 * Update competitor performance
 */
router.post("/:id/competitors/performance", async (req, res, next) => {
	logger.info("Updating competitor performance...");
	try {
		logger.debug("Validating...");
		if (!req.body || !req.body.competitorID || !req.body.stored_data) {
			res.statusCode = 403;
			res.json({
				message: "Did not receive any, or not all, data",
			});
		} else {
			const data = req.body.stored_data;
			const parsedData = parseFloat(data);
			const competitorID = req.body.competitorID;
			if (isNaN(parsedData) && data !== "dnf") {
				res.statusCode = 403;
				res.json({
					message: "Did not receive a valid number",
				});
				return;
			}
			logger.debug("Loading setting & competitor ID...");
			const eventSettingsID = await knex
				.select("competitor_settings_id")
				.from("events_and_groups")
				.where("event_group_id", req.params.id);
			const internalID = await knex
				.select("competitor_id")
				.from("competitors")
				.where("id", competitorID);
			if (!eventSettingsID?.[0]) {
				res.statusCode = 403;
				res.json({
					message: "Could not find competitor settings",
				});
				return;
			}
			if (!internalID?.[0]) {
				res.statusCode = 403;
				res.json({
					message: "Could not find competitor.",
				});
				return;
			}

			logger.debug("Connecting to DB...");
			const client = await pool.connect();
			if (!client) {
				res.statusCode = 500;
				res.json({
					message: "Could not connect to DB",
				});
				return;
			}
	
			if (data === "dnf") {
				// from https://devhints.io/knex
				logger.debug("Processing, DNF...");
				const res = await knex("competitor_data")
					.where({
						competitor_id: internalID[0].competitor_id,
						competitor_settings_id: eventSettingsID[0].competitor_settings_id,
					})
					.update({
						dnf: true,
					});
				try {
					await client.query("BEGIN");
					// https://www.postgresqltutorial.com/postgresql-upsert/
					await pool.query(`
							INSERT INTO competitor_data(competitor_id, competitor_settings_id, dnf)
							VALUES (
									$1,
									$2,
									TRUE
								)
							ON CONFLICT ON CONSTRAINT competitor_data_unique
							DO UPDATE
								SET stored_data = NULL, dnf = TRUE
								WHERE competitor_data.competitor_id = $1 AND competitor_data.competitor_settings_id = $2;
						`, [
						internalID[0].competitor_id,
						eventSettingsID[0].competitor_settings_id,
					]);
	
					await client.query("COMMIT");
				} catch (err) {
					await client.query("ROLLBACK");
					await client.release();
					throw err;
				}
			} else {
				logger.debug("Processing, UPDATE/INSERT...");
				try {
					await client.query("BEGIN");
					// https://www.postgresqltutorial.com/postgresql-upsert/
					await pool.query(`
						INSERT INTO competitor_data(competitor_id, stored_data, competitor_settings_id)
						VALUES (
								$1,
								$3,
								$2
							)
						ON CONFLICT ON CONSTRAINT competitor_data_unique
						DO UPDATE
							SET stored_data = $3, dnf = FALSE
							WHERE competitor_data.competitor_id = $1 AND competitor_data.competitor_settings_id = $2;
					`, [
						internalID[0].competitor_id,
						eventSettingsID[0].competitor_settings_id,
						parsedData,
					]);

					await client.query("COMMIT");

					logger.debug("Moving on to points...");
					await calculatePoints(req.params.id, knex);
				} catch (err) {
					await client.query("ROLLBACK");
					await client.release();
					throw err;
				}
				
			}
	
			res.json({
				message: "Done"
			});
			await client.release();
		}
	} catch (err) {
		logger.error(`Error updating competitor ${req.body?.competitorID} for event ${req.params.id}!`);
		logger.error((err as Error)?.message);
		res.status(500).json({
			message: `Internal Server Error - ${(err as Error)?.message}`,
		});
	}
	
});

export default router;