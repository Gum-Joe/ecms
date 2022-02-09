

import { LoggerFactory } from "@ecms/core";
import { events_and_groupsId, points_settings } from "@ecms/models";
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
	}
}