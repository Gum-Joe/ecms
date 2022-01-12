/**
 * APIs for the setup process
 */
import {
	competitorsInitializer,
	competitor_filtersInitializer,
	competitor_settingsInitializer,
	events_and_groups,
	data_unitsInitializer,
	events_and_groupsInitializer,
	event_only_settingsInitializer,
	points_settingsInitializer,
	public_dashboardsInitializer,
	restrictionsInitializer,
	teamsInitializer,
	join_roles_user_groups,
	join_roles_usersInitializer
} from "@ecms/models";

import type { APIMessage, CSVResult, TaskStatus, TaskStatuses } from "./common";

/**
 * Exclude properties ending with _id
 */
type OmitIDKeys<T> = Omit<T, `${string}_id`>

/**
 * Base of settings for setting up competitors
 */
type BaseSetupCompetitor = Omit<competitor_settingsInitializer, "competitor_settings_id">;

interface SetupNewRecordGroup {
	name: string;
}
interface SetupUseOldRecordGroup {
	record_group_id: string;
}

/**
 * Specifies what needs to be specified when creating a new record store
 * Unit ID is inferred from unit settings, and current record holder entered with placeholder infomation
 */
interface SetupNewRecord<T extends "new" | "old"> {
	type: "createNew"
	record_name: string;
	/* Are we using a new or old record group? */
	record_group_target?: T;
	record_group?: T extends "new" ? SetupNewRecordGroup : SetupUseOldRecordGroup;
}

interface SetupUseOldRecord {
	/** The ID of the record store in the DB to link to */
	record_id: string;
	type: "createOld"
}


/**
 * Competitors defined by filtering from a parent group
 */
interface FilterCompetitors extends BaseSetupCompetitor {
	type: "filter_parent";
	filters: OmitIDKeys<competitor_filtersInitializer>[];
}

/** ECMS required columns for CSV metatdata for competitors */
export type CompetitorCSVMetadataColumns = "nameIndex" | "teamIndex" | "yearGroupIndex";
/** How columns are stored when collecting which column indices correspond to each {@link ColumnsToGet}. Use `-1` for not set. */
export type CompetitorCSVMetatdata = Record<CompetitorCSVMetadataColumns, number>;

/**
 * Competitors defined by import
 */
export interface ImportCompetitors extends BaseSetupCompetitor {
	type: "discrete";
	competitor_import_id: string;
	csvMetadata: CompetitorCSVMetatdata;
	/** Map teams in the CSV's teams column to the index of teams in {@link SetupEventOrGroup.teams} */
	teamsMap: Record<string, number>;

}

/**
 * Competitor defined by explicitly listing them
 */
interface ExplicitCompetitorList extends BaseSetupCompetitor {
	type: "discrete";
	set_competitors: Array<
		Omit<OmitIDKeys<competitorsInitializer>, "id"> & {
			data: Record<string, any>;
			/** Index of team in the teams array - see {@link SetupEventOrGroup.teams} */
			team: number;
		}
	>;
}

/**
 * Represents a event or group currently being setup.
 * 
 * This is what is passed to the createSetup API route, and stored in the redis DB during setup.
 * 
 * It is also use by the frontend to store the current state of setup.
 */
export default interface SetupEventOrGroup extends 
	// Exclude stuff we cann't set right now like foreign or primary keys, or that we include manually
	Omit<events_and_groupsInitializer, "event_group_id" | `${string}_settings_id` | "public_dashboard_id" | "complete" | "archived">
{

	setupID: string;

	/**
	 * Event ONLY settings
	 */
	event_settings?: Omit<OmitIDKeys<event_only_settingsInitializer>, "record_store"> & {
		/** Define information about the Units for data IF data_tracked is "individual" (see {@link event_only_settingsInitializer.data_tracked}) */
		unit?: OmitIDKeys<data_unitsInitializer>;
		/** Define a record store IF we are linking to one OR createing one for this event */
		record_store?: SetupNewRecord<"new" | "old"> | SetupUseOldRecord;
	}

	/**
	 * Teams to create in the event/group IF enable_teams is true.
	 * OR if inheritance is on, the teams and their IDs to use.
	 */
	teams?: teamsInitializer[];

	/**
	 * Matches to create between teams IF enable_teams is true AND event_settings.data_tracked is "matches".
	 */
	matches?: {
		/** value of this propertry here is the index in the teams array. `-1` means unset. */
		team_1: number;
		/** value of this propertry here is the index in the teams array. `-1` means unset. */
		team_2: number;
	}[];

	/** Define the point system for this event/group */
	points?: Omit<points_settingsInitializer, "points_settings_id">;

	/**
	 * Define an (optional) event dashboards to create for this event/group
	 */
	dashboard?: Omit<public_dashboardsInitializer, "public_dashboard_id">;

	/**
	 * Settings for competitors in this event/group, IF we are adding them 
	 */
	competitor_settings?: FilterCompetitors | ImportCompetitors | ExplicitCompetitorList;

	/**
	 * Groups ONLY setting: setup any restrictions on competitors and how manu sub-events they can take part in
	 */
	restrictions?: Array<
		OmitIDKeys<restrictionsInitializer> & {
			/** UUID of events (the key {@link events_and_groups.event_group_id}) that the restriction applies to */
			event_id: string[];
		}
	>;

	/** RBAC role access restrictions for group and individuals */
	access?: {
		groups: Omit<join_roles_user_groups, "param">[];
		users: Omit<join_roles_usersInitializer, "param">[];
	}

};

// Other requests

/**
 * Creates a new setup on the server in the Redis DB to track it.
 */
export interface ResStartSetup {
	setupID: SetupEventOrGroup["setupID"];
}

/**
 * Setup state
 */
export type SetupStates = TaskStatus<"finalising">;

/**
 * Updates a setup on the server in the Redis DB
 */
export type ReqPartialSetup = SetupEventOrGroup & SetupStates;

/**
 * Used to upload a CSV (parsed) of competitiors for storage for later insertion into the DB
 */
export type ReqUploadCompetitorsCSV = {
	/** Metatdata about the CSV */
	csvMetadata: CompetitorCSVMetatdata,
	/** PARSED CSV Result in the format of the type specified */
	csvData: CSVResult,
	/** ID of setup this is before */
	setupID: SetupEventOrGroup["setupID"];
}

/**
 * Response when requesting the status of a setup
 */
export type ResSetupStatus =  {
	status: SetupStates["status"],
	error?: string,
};