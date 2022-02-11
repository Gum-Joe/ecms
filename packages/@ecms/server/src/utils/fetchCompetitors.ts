import { ReqCompetitors, ResCompetitors } from "@ecms/api/events";
import { competitor_settingsId } from "@ecms/models";
import filterCompetitorFrom from "../setup/filter";
import { getTeamsMapForEventGroup } from "./getTeamsMapForEventGroup";
import { logger, knex, CombineEventsAndGroups } from "../routes/common";

/**
 * Retrieves competitor from a group/event.
 *
 * How it works:
 * 1. If the competitor type is discrete, query it directly
 * 2. If copy, run this algorithm again on the parent
 * 3. If filter_parent, run the filter alogirthm!
 *
 * @param event_group_id ID of event/group to fetch from
 * @param inheritedChildID Optional ID of a child event/group to use for the data columns of the fetched competitors. Please specify the `competitor_settings_id` of the child event in question.
 */
export async function fetchCompetitors(event_group_id: string, team_id: string, inheritedChildID?: competitor_settingsId, allowInternalIDs = false): Promise<ResCompetitors> {
	logger.info(`Getting competitors from ${event_group_id}`);
	// Check settings
	const eventSettings = await knex
		.select("events_and_groups.competitor_settings_id")
		.select("events_and_groups.parent_id")
		.select<CombineEventsAndGroups>("competitor_settings.*")
		.from("events_and_groups")
		.where("events_and_groups.event_group_id", event_group_id)
		.join("competitor_settings", "events_and_groups.competitor_settings_id", "competitor_settings.competitor_settings_id")
		.first();
	if (!eventSettings) {
		throw new Error("No competitor settings found for this event! Please check competitors have been set.");
	}

	// Now check type
	if (eventSettings.type === "discrete") {
		logger.info("Querying directly as of type discrete...");
		// Retrieve 
		const dbres = await knex
			.select("competitors.id")
			.select("competitors.lastname")
			.select("competitors.firstname")
			.select("competitors.data")
			.select("competitors.team_id")
			.select(allowInternalIDs ? "competitors.competitor_id" : "")
			.select("competitor_data.competitor_data_id")
			.select("competitor_data.stored_data")
			.select("competitor_data.points")
			.select("competitor_data.additional_data")
			.select("competitor_data.overriden")
			.select("competitor_data.dnf")
			.select("competitor_data.competitor_settings_id")
			.from("competitors")
			// TODO: Order messed up!
			.where("competitors.team_id", team_id)
			// Get any prestored data using the competitor_settings_id
			// anything beyond the above for competitor_settings_id may result in data for a different event being returned!
			.leftJoin("competitor_data", function () {
				this.on("competitors.competitor_id", "=", "competitor_data.competitor_id")
					.andOnVal("competitor_data.competitor_settings_id", inheritedChildID ?? eventSettings.competitor_settings_id);
			})
			.orderBy("competitors.firstname", "asc")
			.orderBy("competitors.lastname", "asc");
		logger.info("Done.");
		return dbres;

	} else if (eventSettings.type === "inherit") {
		logger.debug("Inherited competitors detected. Calling recursivly...");
		if (!eventSettings.parent_id) {
			logger.error("No parent_id found!");
			throw new Error("Asked to inherit competitors but no parent_id found!");
		}
		return fetchCompetitors(eventSettings.parent_id, team_id, inheritedChildID, allowInternalIDs);
	} else if (eventSettings.type === "filter_parent") {
		// Filters
		logger.debug("Getting filtered IDs of competitors...");
		const filteredIDs = await filterCompetitorFrom(event_group_id, null, knex, await getTeamsMapForEventGroup(event_group_id, knex));
		// Transform
		const IDsList = filteredIDs.map(x => x.competitor_id);
		// Now query based on it!
		logger.debug(`Querying records for ${IDsList.length} competitors...`);
		const dbres = await knex
			.select("competitors.id")
			.select("competitors.lastname")
			.select("competitors.firstname")
			.select("competitors.data")
			.select("competitors.team_id")
			.select(allowInternalIDs ? "competitors.competitor_id" : "competitors.id")
			.select("competitor_data.competitor_data_id")
			.select("competitor_data.stored_data")
			.select("competitor_data.points")
			.select("competitor_data.additional_data")
			.select("competitor_data.overriden")
			.select("competitor_data.dnf")
			.select("competitor_data.competitor_settings_id")
			.from("competitors")
			// TODO: Order messed up!
			.where("competitors.team_id", team_id)
			.whereIn("competitors.competitor_id", IDsList)
			// Get any prestored data using the competitor_settings_id
			// anything beyond the above for competitor_settings_id may result in data for a different event being returned!
			.leftJoin("competitor_data", function () {
				this.on("competitors.competitor_id", "=", "competitor_data.competitor_id")
					.andOnVal("competitor_data.competitor_settings_id", inheritedChildID ?? eventSettings.competitor_settings_id);
			})
			.orderBy("competitors.firstname", "asc")
			.orderBy("competitors.lastname", "asc");
		logger.info("Done.");
		return dbres;
	} else {
		logger.error(`Unreognised competitor_settings type: ${eventSettings.type}`);
		throw new Error(`Unrecognised competitor_settings type: ${eventSettings.type}`);
	}



}
