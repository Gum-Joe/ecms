/**
 * Contains the React Context used to store state between setup screen
 * @packageDocumentation
 */
import React, { ChildContextProvider, Reducer, useContext, useReducer } from "react";
import { SetupActions, SetupActionsList as Actions } from "../actions/setup";
import { SetupState } from "../constants/interfaces";
const intialSetupState: SetupState = {};

const initiaState = {};

// From https://dev.to/elisealcala/react-context-with-usereducer-and-typescript-4obm
const SetupContext = React.createContext<{
	state: SetupState,
	dispatch: React.Dispatch<SetupActions>,
}>({
	state: initiaState,
	dispatch: () => null,
});
SetupContext.displayName = "SetupContext";


const setupReducer: Reducer<SetupState, SetupActions> = (state, action) => {
	console.log("HI");
	switch (action.type) {
		//case Actions.SETUP_BASIC_DETAILS:
		//	return {};
		case Actions.START_SETUP:
			return {
				type: action.payload.type,
			};
		default:
			console.error("INVALID ACTION RECEIVED TO SETUP CONTEXT.");
			return state;
	}
};

export const SetupContextProvider: React.FC = ({ children }) => {
	const [state, dispatch] = useReducer(setupReducer, { });

	return (
		<SetupContext.Provider value={{ state, dispatch }}>
			{children}
		</SetupContext.Provider>
	);

};

export default SetupContext;
