
/**
 * Function to help get parent events of events
 */
import { FilterCompetitors, ImportCompetitors, ExplicitCompetitorList, InheritCompetitors } from "@ecms/api/setup";
import { competitor_filters, competitor_settings, events_and_groups, events_and_groupsId } from "@ecms/models";
import type { connectToDBKnex } from "./db";
import createLogger from "./logger";

const logger = createLogger("followInheritance");

export interface EventLinkedList {
	event_group_id: events_and_groupsId;
	competitor_settings: (competitor_settings & (FilterCompetitors | InheritCompetitors | { type: "discrete" })) | null;
	parent: EventLinkedList | null;
}

/**
 * Given an event_group_id, follow it's parent events until we reach one where competitors are not set by one of the inheritance options,
 * 
 * Generates a linked list of events with competitor setting for each. For convinience the root node of it is the event_group_id passed in, and the terminal node is the parent furtherest up the tree.
 * 
 * The inheritance options we want to avoid are copying from parent and filtering from parent
 */
export async function followInheritanceCompetitors(event_group_id: events_and_groupsId, knex: ReturnType<typeof connectToDBKnex>): Promise<EventLinkedList> {
	logger.info(`Following inheritance for competitors from ${event_group_id}...`);
	// Query each event_group_id until we find one without inheritance
	logger.debug(`Getting event ${event_group_id} settings...`);
	const event_settings = await knex
		.select<events_and_groups>("*")
		.from("events_and_groups")
		.where("event_group_id", event_group_id)
		.first();
	logger.debug(`Getting competitor_settings from ${event_group_id}`);
	if (!event_settings?.competitor_settings_id) {
		logger.warn(`Stopped at ${event_group_id} as no competitor_settings found!`);
		return {
			event_group_id: event_group_id,
			competitor_settings: null,
			parent: null,
		};
	}

	// Else, inspect the settings:
	const competitor_settings = await knex
		.select<competitor_settings>("*")
		.from("competitor_settings")
		.where("competitor_settings_id", event_settings.competitor_settings_id)
		.first();
	
	if (!competitor_settings) {
		throw new Error(`No competitor settings found for ${event_group_id} - was expected some! This may indicate a problem with the DB or orphanned records.`);
	}
	
	// Now follow the tree:
	// 1: If it's discrete, mark as such
	// 2: If it's inherit, also mark as such
	// 3: If it's filter,  and get the filters
	if (competitor_settings?.type === "filter_parent") {
		if (!event_settings.parent_id) {
			logger.error("Got event with filter type set for competitors - yet no parent_id provided to inherit from!");
			throw new Error(`Expected a parent_id for event of ID ${event_group_id} but none was found!`);
		}
		// Fetch filters
		const filters = await knex
			.select<competitor_filters[]>("*")
			.from("competitor_filters")
			.where("competitor_settings_id", competitor_settings.competitor_settings_id);
		return {
			event_group_id,
			competitor_settings: {
				...competitor_settings,
				type: "filter_parent",
				filters,
			},
			parent: await followInheritanceCompetitors(event_settings.parent_id, knex)
		};
	} else if (competitor_settings?.type === "inherit") {
		return {
			event_group_id: event_group_id,
			competitor_settings: {
				...competitor_settings,
				type: "inherit"
			},
			parent: event_settings.parent_id ? await followInheritanceCompetitors(event_settings.parent_id, knex) : null,
		};
	} else if (competitor_settings?.type === "discrete") {
		return {
			event_group_id: event_group_id,
			competitor_settings: {
				...competitor_settings,
				type: "discrete"
			},
			parent: event_settings.parent_id ? await followInheritanceCompetitors(event_settings.parent_id, knex) : null,
		};
	} else {
		logger.warn(`Stopped/skipped ${event_group_id} with competitor settings type ${competitor_settings?.type}`);
		return {
			event_group_id: event_group_id,
			competitor_settings: null,
			parent: null
		};
	}
	
}

/**
 * Given an event_group_id, follow it's parent events until we reach one without inheritance - this is the one we want to use when querying teams & competitors
 */
/*export default async function followInheritance(event_group_id: events_and_groupsId): Promise<events_and_groupsId> {
	logger.debug(`Following inheritance from ${event_group_id}...`);
	// Query each event_group_id until we find one without inheritance
	
}*/