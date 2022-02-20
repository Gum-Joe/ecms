/* eslint-disable no-case-declarations */
/* eslint-disable @typescript-eslint/no-unused-vars */


import { PointsMatches, PointsThresholds } from "@ecms/api/points";
import { LoggerFactory } from "@ecms/core";
import { events_and_groupsId, points_settings } from "@ecms/models";
import scoreMatches from "../points/matches";
import scoreThresholds from "../points/thresholds";
import { connectToDBKnex } from "./db";
import createLogger from "./logger";

const logger = createLogger("points");

/**
 * Calculates points for a event/group
 * TODO: Use PG client instead!
 */
export default async function calculatePoints(event_group_id: events_and_groupsId, knex: ReturnType<typeof connectToDBKnex>): Promise<void> {
	logger.info(`Calculating points for event_group_id: ${event_group_id}`);
	logger.debug("Getting points settings...");
	const settings = await knex
		.select<points_settings>("points_settings.*")
		.from("points_settings")
		.join("events_and_groups", "events_and_groups.points_settings_id", "points_settings.points_settings_id")
		.where("events_and_groups.event_group_id", event_group_id)
		.first();
	if (!settings) {
		logger.warn(`No points settings found for event_group_id: ${event_group_id}. Skipping calculations...`);
		return;
	}
	// Select the appropriate system
	switch (settings.module_id) {
		case "thresholds":
			logger.debug("Using thresholds points system...");
			try {
				await scoreThresholds(event_group_id, knex, settings.config as PointsThresholds, settings.points_settings_id);
			} catch (err) {
				logger.error("ERROR Calculating and storing thresholds!");
				throw err;
			}
			
			break;
		case "matches":
			logger.debug("Using matches scoring system...");
			const points = await scoreMatches(event_group_id, knex, settings.config as PointsMatches);
			// From https://stackoverflow.com/questions/22957032/knex-transaction-with-promises
			await knex.transaction(function (t) {
				// Now for each team, record points!
				const promises: Promise<any>[] = [];
				for (const [ team, pointsForTeam ] of points.entries()) {
					logger.debug(`Inserting points for ${team}...`);
					promises.push(knex("store_overall_points")
						.transacting(t)
						.insert({
							points_settings_id: settings.points_settings_id,
							team_id: team,
							points: pointsForTeam.points,
							sum_points: pointsForTeam.points,
							data: pointsForTeam,
						})
						// https://www.postgresqltutorial.com/postgresql-upsert/
						.onConflict(["points_settings_id", "team_id"])
						.merge()
						.catch(function (e) {
							logger.error(e);
							logger.error("Rolling back changes!");
							t.rollback();
							throw e;
						}));

				}
				return Promise.all(promises)
					.then(() => {
						logger.debug("Done.");
						t.commit();
					})
					.catch(function (err) {
						logger.error("Error waiting for insertions to finish!");
						logger.error(err);
					});
			});
			
			break;

	}
}