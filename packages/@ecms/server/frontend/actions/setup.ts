/**
 * All the types and code for actions related to the setup context,
 * which is used to store data about the event/group being setup
 * 
 * Many types from https://medium.com/hackernoon/finally-the-typescript-redux-hooks-events-blog-you-were-looking-for-c4663d823b01
 * @packageDocumentation
 */
import { SetupState } from "../constants/interfaces";
import { createGeneralAction } from "./createGeneralAction";

/**
 * Enum of actions
 * Used as it makes it easier to do type checking on action contents in reducers
 */
export enum SetupActionsList {
	SETUP_BASIC_DETAILS = "SETUP_BASIC_DETAILS",
	START_SETUP = "SETUP_START",
}

/**
 * Interface to start setup
 * 
 * Specify whether we're setting up an event or group
 */
export interface StartSetup {
	/** Are we setting up an event or group? */
	type: "event" | "group",
}

/**
 * Type for mapping Action payloads
 * Used for type checking
 */
export type SetupActionPayloads = {
	[SetupActionsList.START_SETUP]: StartSetup,
	//[SetupActionsList.SETUP_BASIC_DETAILS]: any;
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



