/**
 * Contains the React Context used to store state between setup screen
 * @packageDocumentation
 */
import { Reducer } from "@reduxjs/toolkit";
import { SetupActions, SetupActionsList as Actions } from "../actions/setup";
import { SetupState } from "../constants/interfaces";

const initialState: SetupState = {
	state: "pending",
};

/**
 * Handles storage of setup state for us
 */
export const setupReducer: Reducer<SetupState, SetupActions> = (state = initialState, action) => {
	switch (action.type) {
		//case Actions.SETUP_BASIC_DETAILS:
		//	return {};
		case Actions.SETUP_FAILED:
			if (action.payload instanceof Error) {
				return {
					...state,
					error: {
						message: action.payload.message,
						name: action.payload.name,
						stack: action.payload.stack,
					},
				};
			} else {
				return {
					...state,
					error: {
						message: action.payload,
						name: "Unknown error"
					},
				};
			}
		case Actions.START_SETUP:
			return {
				type: action.payload.type,
				setupID: action.payload.setupID,
				state: "in progress",
			};
		case Actions.UPDATE_SETUP:
			return {
				...state,
				...action.payload,
			};
		case Actions.SET_TEAMS:
			return {
				...state,
				teams: action.payload,
			};
		case Actions.ADD_MATCH:
			return {
				...state,
				matches: (state.matches || []).concat([
					{
						team_1: -1,
						team_2: -1,
					},
				]),
			};
		case Actions.UPDATE_MATCH:
			// eslint-disable-next-line no-case-declarations
			const newMatches = [...(state.matches || [])];
			if (action.payload.setMatchPart === 0) {
				newMatches[action.payload.id] = {
					team_1: action.payload.team,
					team_2: newMatches[action.payload.id].team_2,
				};
			} else if (action.payload.setMatchPart === 1) {
				newMatches[action.payload.id] = {
					team_1: newMatches[action.payload.id].team_1,
					team_2: action.payload.team,
				};
			}
			
			return {
				...state,
				matches: newMatches
			};
		case Actions.DELETE_MATCH:
			// eslint-disable-next-line no-case-declarations
			return {
				...state,
				matches: ((state.matches || []).filter((_, i) => i !== action.payload)), // Filter from GitHub CoPilot
			};
		case Actions.SET_COMPETITOR_IMPORT_TYPE:
			if (action.payload === "discrete") {
				return {
					...state,
					competitor_settings: {
						...state.competitor_settings,
						competitor_import_id: "doesn't matter", // HACK: Remove once also can set a list of them
						type: "discrete",
					}
				};
			} else {
				return state;
			}
		case Actions.CSV_MAP_TEAM:
			const newTeamMap = {};
			newTeamMap[action.payload[0]] = action.payload[1];
			return {
				...state,
				competitor_settings: {
					...state.competitor_settings,
					competitor_import_id: "doesn't matter", // CSV only
					teamsMap: {
						...(state?.competitor_settings?.teamsMap || {}),
						...newTeamMap,
					}

				}
			};
		case Actions.SET_DATA_UNIT:
			return {
				...state,
				event_settings: {
					...state.event_settings,
					unit: action.payload,
				}
			};
		case Actions.UPDATE_COMPETITOR_FILTERS:
			return {
				...state,
				competitor_settings: {
					...state.competitor_settings,
					type: "filter_parent",
					filters: action.payload,
				}
			};
		case Actions.SET_POINTS_SYSTEM:
			return {
				...state,
				points: {
					...state.points,
					module_id: action.payload,
					config: {},
				}
			};
		case Actions.SET_POINTS_CONFIG:
			return {
				...state,
				points: {
					...state.points,
					config: action.payload,
				}
			};
		default:
			console.warn("INVALID ACTION RECEIVED TO SETUP CONTEXT.");
			return state;
	}
};