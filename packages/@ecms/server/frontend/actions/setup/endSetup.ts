import { ResStartSetup } from "@ecms/api/setup";
import { Action, ActionCreator, AsyncThunk, createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { ThunkAction } from "redux-thunk";
import { setupAction, SetupActions, SetupActionsList, StartSetup } from ".";
import { SetupState } from "../../constants/interfaces";
import { RootState } from "../../reducers";


/**
 * Thunk function to end setup, telling server to commit the event/group to the DB. 
 * 
 * Types from updateSetup
 */
const endSetup: () => ThunkAction<Promise<SetupActions>, RootState, void, SetupActions> = () => async (dispatch, getState) => {
	console.debug("Ending setup in the server...");
	// Now send
	try {
		await axios.post("/api/setup/end", { setupID: getState().setup.setupID });
	} catch (err) {
		console.error("Error updating (ending) setup on the server:", err);
		// TODO: Handle error
		return dispatch(setupAction(SetupActionsList.SETUP_FAILED, err));
		
	}

	// Do something to end setup (remove from state etc.)
	return dispatch(setupAction(SetupActionsList.UPDATE_SETUP, {}));
	
};

export default endSetup; 