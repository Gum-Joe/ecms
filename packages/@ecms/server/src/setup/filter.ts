import { competitorsId, competitor_filters, events_and_groups, events_and_groupsId, filter_types, teamsId } from "@ecms/models";
import createLogger from "../utils/logger";
import type makeKnex from "knex";
import { COMPETITOR_RESERVED_FIELDS } from "@ecms/models/lib/competitor_filters";

const logger = createLogger("competitors:filter");

/**
 * Logic to handle filtering of competitors!
 * @param eventGroupID ID of event/group to filter from 
 * @param filters Array of filters to apply to the event/group's competitors, in the order to apply them.
 * 	I.e. this assumes the first filter has the `base` property set for its {@link competitor_filters.type}
 * @param knex Knex instance to use for database queries
 * @param teamsMap Map of Team names to team IDs in the DB
 * @see competitor_filters
 * @see filter_types
 * @returns List of competitor IDs that match the filters, which can then be linked to the event/group being setup.
 */
// TODO: Follow inheritance
async function filterCompetitorFrom(eventGroupID: events_and_groupsId, filters: competitor_filters[], knex: ReturnType<typeof makeKnex>, teamMap: Map<string, teamsId>): Promise<competitorsId[]> {
	logger.info(`Filtering competitors from ${eventGroupID}...`);
	logger.debug("Getting settings for parent event/group...");
	const competitorSettings = (await knex
		.select<events_and_groups[]>("competitor_settings_id")
		.from("events_and_groups")
		.where("events_and_groups.event_group_id", eventGroupID))?.[0];
	if (!competitorSettings) {
		throw new Error(`Event/group ${eventGroupID} not found!`);
	} else if (!competitorSettings.competitor_settings_id) {
		throw new Error(`Event/group ${eventGroupID} has no competitor settings!`);
	}

	// Ok so we're good!

	// Construct the SQL query
	logger.debug("Running query...");
	const query = await knex
		.select<competitorsId[]>("competitors.competitor_id")
		.from("competitors")
		.leftJoin("join_competitor_events_group", "competitors.competitor_id", "join_competitor_events_group.competitor_id")
		.where("join_competitor_events_group.competitor_settings_id", competitorSettings.competitor_settings_id)
		.andWhere(function (builder) {
			// Then, create it!
			filters.forEach((filter, index) => {
				logger.debug(`Processing filter ${index}/${filters.length}...`);
				let functionRef: keyof typeof builder;
				let operator = "=";
				if (filter.type === "base") {
					functionRef = "whereRaw";
				} else if (filter.type === "or") {
					functionRef = "orWhereRaw";
				} else if (filter.type === "and") {
					functionRef = "andWhereRaw";
				} else if (filter.type === "not") {
					functionRef = "andWhereRaw";
					operator = "!=";
				} else {
					logger.warn(`Skipping filter of type ${filter.type} as unsupported!`);
					return;
				}
				// Handle special case of teams
				if (filter.field === COMPETITOR_RESERVED_FIELDS.teams) {
					return this[functionRef]("competitors.team_id", teamMap.get(filter.value));
				}
				// Else, just use the normal filter from the json data
				this[functionRef](`competitors.data->? ${operator} ?`, [filter.field, filter.value]);
			});
		});
	
	// Run it!
	logger.info("Done.");
	return query;

		

}

export default filterCompetitorFrom;