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
			return {
				...state,
				error: {
					message: action.payload.message,
					name: action.payload.name,
					stack: action.payload.stack,
				},
			};
		case Actions.START_SETUP:
			return {
				...state,
				type: action.payload.type,
				setupID: action.payload.setupID,
				state: "in progress",
			};
		case Actions.UPDATE_SETUP:
			return {
				...state,
				...action.payload,
			};
		default:
			console.warn("INVALID ACTION RECEIVED TO SETUP CONTEXT.");
			return state;
	}
};