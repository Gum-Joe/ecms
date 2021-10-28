/**
 * Contains the React Context used to store state between setup screen
 * @packageDocumentation
 */
import React, { ChildContextProvider, Reducer, useContext, useReducer } from "react";
import { SetupState, SetupAction } from "../constants/interfaces";
import { SETUP_BASIC_DETAILS } from "../constants/setup";
const intialSetupState: SetupState = {};

const SetupContext = React.createContext<SetupState>(intialSetupState);
SetupContext.displayName = "SetupContext";


const setupReducer: Reducer<SetupState, SetupAction> = (state, action) => {
	switch (action.type) {
		case SETUP_BASIC_DETAILS:
			return {};
		default:
			console.error("INVALID ACTION RECEIVED TO SETUP CONTEXT.");
			return state;
			break;
	}
};

export const SetupContextProvider: React.FC = ({ children }) => {
	const [state, dispatch] = useReducer(setupReducer, {});

	return (
		<SetupContext.Provider value={{ state, dispatch }}>
			{children}
		</SetupContext.Provider>
	);

};

export default SetupContext;
