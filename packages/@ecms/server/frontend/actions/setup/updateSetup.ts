import { ResStartSetup } from "@ecms/api/setup";
import { Action, ActionCreator, AsyncThunk, createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { ThunkAction } from "redux-thunk";
import { setupAction, SetupActions, SetupActionsList, StartSetup } from ".";
import { SetupState } from "../../constants/interfaces";
import { RootState } from "../../reducers";


/**
 * Thunk function to start setup, getting a setupID for it
 * 
 * Types from updateSetup
 */
export const startSetup: ActionCreator<ThunkAction<Promise<SetupActions>, RootState, void, SetupActions>> = (type: StartSetup["type"]) => async (dispatch, getState) => {
	console.debug("Starting setup in the server...");

	/// Check if we already have a setup in session
	const currentSetup = sessionStorage.getItem("currentSetup");

	// Now send
	try {
		const setupID = await (await axios.post<ResStartSetup>("/api/setup/start")).data;
		console.debug("SetupID: ", setupID.setupID);
		return dispatch(setupAction(SetupActionsList.START_SETUP, { type: type, setupID: setupID.setupID }));
	} catch (err) {
		console.error("Error updating setup on the server: ", err);
		return dispatch(setupAction(SetupActionsList.SETUP_FAILED, new Error(`Error: Could not start setup on the server! Got error "${(err as AxiosError).message}"`)));
	}

	

};

/**
 * Thunk function to update setup state on server
 * 
 * Types from updateSetup
 */
const updateSetup: (updatedSetup: Omit<SetupState, "state">) => ThunkAction<Promise<SetupActions>, RootState, void, SetupActions>  = (updatedSetup) => async (dispatch, getState) => {
	console.debug("Updating setup in the server...");
	const fullUpdatedSetup = {
		...getState().setup,
		...updatedSetup,
	};

	// Now send
	try {
		await axios.put("/api/setup/partial", fullUpdatedSetup);
	} catch (err) {
		console.error("Error updating setup on the server:", err);
	}

	return dispatch(setupAction(SetupActionsList.UPDATE_SETUP, updatedSetup));
	
};

export default updateSetup;