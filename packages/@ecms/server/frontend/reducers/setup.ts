/**
 * Contains the React Context used to store state between setup screen
 * @packageDocumentation
 */
import { Reducer } from "@reduxjs/toolkit";
import { SetupActions, SetupActionsList as Actions } from "../actions/setup";
import { SetupState } from "../constants/interfaces";

const initialState = {};

/**
 * Handles storage of setup state for us
 */
export const setupReducer: Reducer<SetupState, SetupActions> = (state = initialState, action) => {
	switch (action.type) {
		//case Actions.SETUP_BASIC_DETAILS:
		//	return {};
		case Actions.START_SETUP:
			return {
				...state,
				type: action.payload.type,
			};
		default:
			console.error("INVALID ACTION RECEIVED TO SETUP CONTEXT.");
			return state;
	}
};