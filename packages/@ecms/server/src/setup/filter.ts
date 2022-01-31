import { competitors, competitorsId, competitor_filters, competitor_settings, events_and_groups, events_and_groupsId, filter_types, teamsId } from "@ecms/models";
import createLogger from "../utils/logger";
import type makeKnex from "knex";
import { competitor_filtersInitializer, COMPETITOR_RESERVED_FIELDS } from "@ecms/models/lib/competitor_filters";
import { EventLinkedList, followInheritanceCompetitors } from "../utils/followInheritance";
import { FilterCompetitors } from "@ecms/api/setup";
import { Knex } from "knex";

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
async function filterCompetitorFrom(
	eventGroupID: events_and_groupsId,
	filters: Omit<competitor_filtersInitializer, "competitor_settings_id">[],
	knex: ReturnType<typeof makeKnex>,
	teamMap: Map<string, teamsId>
): Promise<Pick<competitors, "competitor_id">[]> {
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
	/**
	 * To generate it we:
	 * 1. Run an algorithm to backtrack to the last event in the tree with "discrete" set for its competitors. This is the ID we want to use in the join table
	 * 2. From the other events in the tree, we walk the tree until we get a filter. We apply that filter first, in tree order with an AND
	 * 3. We then apply the filters in the order they were given to us for this event
	 * 4. Return list of competitor IDs
	 */
	const eventLinkedList = await followInheritanceCompetitors(eventGroupID, knex);
	// We stepped through it one by one, noting each time we come accross a filter in the above list
	// If we hit a "inherit" we skip it, and if we hit a "discrete" we stop as that's where we need to starty filtering from
	/**
	 * 
	 * @param settings 
	 * @returns Array of filters to apply - the first item is what to apply to, and then listed in order of application
	 */
	function examineSettings(settings: EventLinkedList): Array<FilterCompetitors["filters"] | competitor_settings> {
		logger.debug(`Examining settings for ${settings.event_group_id}`);
		if (!settings.competitor_settings) {
			// If no competitor settings, have hit root!
			return [];
		} else if (settings.competitor_settings?.type === "discrete") {
			/// STOP.
			return [settings.competitor_settings];
		} else if (settings.competitor_settings?.type === "inherit") {
			if (!settings.parent) {
				logger.warn(`No parent event/group information provided for event/group ${settings.event_group_id}, despite inherit being set as competitor type!`);
				throw new Error(`Invalid settings for event/group ${settings.event_group_id}! No parent event/group information provided for event/group, despite inherit being set as competitor type!`);
			}
			// Skip
			return examineSettings(settings.parent);
		} else if (settings.competitor_settings?.type === "filter_parent") {
			if (!settings.parent) {
				logger.warn(`No parent event/group information provided for event/group ${settings.event_group_id}, despite filter_parent being set!`);
				throw new Error(`Invalid settings for event/group ${settings.event_group_id}! No parent event/group information provided for event/group, despite filter_parent being set`);
			}
			return [
				// Examine the parent first, as filters from it are applied first
				...examineSettings(settings.parent),
				settings.competitor_settings.filters,
			];
		} else {
			return [];
		}
	}

	const filtersApplicationList = examineSettings(eventLinkedList);
	// Add any filters we've been provided with to the list
	if (filters) {
		logger.debug("Adding user provided filters");
		filtersApplicationList.push(filters);
	}

	const rootEvent = filtersApplicationList[0];
	if (Array.isArray(rootEvent)) {
		throw new Error("No root event with `discrete` set found!");
	}
	
	// We use root event to query from!
	logger.debug("Building and running query...");
	const query = await knex
		.select<Pick<competitors, "competitor_id">[]>("competitors.competitor_id")
		.from("competitors")
		.leftJoin("join_competitor_events_group", "competitors.competitor_id", "join_competitor_events_group.competitor_id")
		.where("join_competitor_events_group.competitor_settings_id", rootEvent.competitor_settings_id)
		.andWhere(function (builder) {
			// Loop through, apply filters
			filtersApplicationList.slice(1).forEach((filters, index) => {
				if (Array.isArray(filters)) {
					if (index === 0) {
						this.where(buildFilters(filters, teamMap));
					} else {
						this.andWhere(buildFilters(filters, teamMap));
					}
					
				} else {
					logger.warn(`Skipping filter application of index ${index} as it is not an array.`);
				}
			});
		})
		.andWhere(buildFilters(filters, teamMap));
	
	// Run it!
	logger.info("Done.");
	return query;
}

export default filterCompetitorFrom;

function buildFilters(filters: Omit<competitor_filtersInitializer, "competitor_settings_id">[], teamMap: Map<string, teamsId>) {
	return function (this: Knex.QueryBuilder<any, Pick<competitors, "competitor_id">[]>, builder: Knex.QueryBuilder<any, Pick<competitors, "competitor_id">[]>) {
		// Then, create it!
		filters.forEach((filter, index) => {
			logger.debug(`Processing filter ${index + 1}/${filters.length}...`);
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
				logger.debug("Detected teams filter!");
				return this.where("competitors.team_id", teamMap.get(filter.value));
			}
			// Else, just use the normal filter from the json data
			this[functionRef](`competitors.data ->> ? ${operator} ?`, [filter.field, filter.value]);
		});
	};
}
