/**
 * We use a series of asserts to check parts of the setup state (see {@link SetupState}) are present for steps that rely on them being there.
 * 
 * By calling them, we also tell TS that the properties are there and so we can use them without errors about the properties being undefined
 * @packageDocumentation
 */

import SetupEventOrGroup from "@ecms/api/setup";
import { event_or_group } from "@ecms/models";
import { SetupState } from "../../constants/interfaces";

/** Asserts the type field is set */
export function assertHasTypeField(setup: Omit<SetupState, "state">): asserts setup is { type: event_or_group | undefined } {
	if (typeof setup.type === undefined) {
		throw new Error("Setup type is not set!");
	}
}