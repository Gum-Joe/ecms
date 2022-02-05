/**
 * All the types and code for actions related to the setup context,
 * which is used to store data about the event/group being setup
 * 
 * Many types from https://medium.com/hackernoon/finally-the-typescript-redux-hooks-events-blog-you-were-looking-for-c4663d823b01
 * @packageDocumentation
 */
import { ResStartSetup } from "@ecms/api/setup";
import { PointsSystems } from "@ecms/api/points";
import { competitor_filtersInitializer, competitor_setting_types, data_units, data_unitsInitializer } from "@ecms/models";
import { StagingTeam } from "../../components/setup/util";
import { SetupState } from "../../constants/interfaces";
import { createGeneralAction } from "../createGeneralAction";

/**
 * Enum of actions
 * Used as it makes it easier to do type checking on action contents in reducers
 */
export enum SetupActionsList {
	SETUP_BASIC_DETAILS = "SETUP_BASIC_DETAILS",
	START_SETUP = "SETUP_START",
	UPDATE_SETUP = "UPDATE_SETUP",
	SETUP_FAILED = "SETUP_FAILED",
	SET_TEAMS = "SET_TEAMS",
	/** Adds a match */
	ADD_MATCH = "ADD_MATCH",
	/** Updates a Match */
	UPDATE_MATCH = "UPDATE_MATCH",
	/** Deletes a match */
	DELETE_MATCH = "DELETE_MATCH",
	/** Maps a team in the CSV to a team in {@link SetupState.teams} */
	CSV_MAP_TEAM = "CSV_MAP_TEAM",
	/** Add unit information for event type individual */
	SET_DATA_UNIT = "SET_DATA_UNIT",
	/** Set competitor upload type */
	SET_COMPETITOR_IMPORT_TYPE = "SET_COMPETITOR_IMPORT_TYPE",
	/** Update filters (please provide list of all filters, not just ones to add!) */
	UPDATE_COMPETITOR_FILTERS = "UPDATE_COMPETITOR_FILTERS",
	/** Set points system - just set it */
	SET_POINTS_SYSTEM = "SET_POINTS_SYSTEM",
	/** Set a new config for the points system */
	SET_POINTS_CONFIG = "SET_POINTS_CONFIG",
}

/**
 * Interface to start setup
 * 
 * Specify whether we're setting up an event or group
 */
export interface StartSetup {
	/** Are we setting up an event or group? */
	type: "event" | "group",
	/** Id for the setup from server */
	setupID: ResStartSetup["setupID"],
}

/**
 * Use this when updating a match
 */
export interface UpdateMatch {
	/** Index of match in {@link SetupState.matches} array being updated */
	id: number;
	/** Are we setting the first part or second part of a match? */
	setMatchPart: number;
	/** Index of team in the {@link SetupState.teams} that that part of the match is set to */
	team: number;
}

/**
 * Type for mapping Action payloads
 * Used for type checking
 */
export type SetupActionPayloads = {
	[SetupActionsList.START_SETUP]: StartSetup
	[SetupActionsList.UPDATE_SETUP]: Omit<SetupState, "state">,
	[SetupActionsList.SETUP_FAILED]: Error | unknown,
	[SetupActionsList.SET_TEAMS]: StagingTeam[]
	[SetupActionsList.ADD_MATCH]: null;
	[SetupActionsList.UPDATE_MATCH]: UpdateMatch;
	//[SetupActionsList.SETUP_BASIC_DETAILS]: any;
	[SetupActionsList.DELETE_MATCH]: number;
	/** First param is name of team in the CSV, second is index of team in {@link SetupState.teams} to map to */
	[SetupActionsList.CSV_MAP_TEAM]: [string, number];
	[SetupActionsList.SET_DATA_UNIT]: data_unitsInitializer;
	[SetupActionsList.SET_COMPETITOR_IMPORT_TYPE]: competitor_setting_types,
	[SetupActionsList.UPDATE_COMPETITOR_FILTERS]: Omit<competitor_filtersInitializer, "competitor_settings_id" | "filter_id">[];
	[SetupActionsList.SET_POINTS_SYSTEM]: typeof PointsSystems;
	[SetupActionsList.SET_POINTS_CONFIG]: Record<string, unknown>;

}

/**
 * Use this to trigger setup actions
 * 
 * @example ```ts
 * 	dispatch(setupAction(SetupActionsList.START_SETUP, { type: "event" }))
 * ```
 */
export const setupAction = createGeneralAction<SetupActionPayloads>();
/**
 * Maps actions into a union of payloads, for narrowing via switch...case
 */
export type ActionMap<M extends Record<string, any>> = {
	[Key in keyof M]: M[Key] extends undefined ? {
		type: Key;
	} : {
		type: Key,
		payload: M[Key]
	}
}

/**
 * And finally, map our setup actions - use this for a function that can accept any setup action
 */
export type SetupActions = ActionMap<SetupActionPayloads>[keyof ActionMap<SetupActionPayloads>];

export default SetupActionsList;



