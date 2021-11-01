/**
 * All the interfaces ECMS uses
 * @packageDocumentation
 */
import SetupEventOrGroup from "@ecms/api/setup";
export type SetupState = Partial<SetupEventOrGroup> & {
	error?: {
		message: string;
		name: string;
		stack?: any;
	},
	/** Setup state  - pending means not yet started */
	state: "pending" | "in progress" | "done",
};
