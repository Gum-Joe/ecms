/**
 * All the interfaces ECMS uses
 * @packageDocumentation
 */
import SetupEventOrGroup, { SetupStates } from "@ecms/api/setup";
export type SetupState = Partial<SetupEventOrGroup> & Partial<SetupStates> & {
	error?: {
		message: string;
		name: string;
		stack?: any;
	} | unknown,
	
};
