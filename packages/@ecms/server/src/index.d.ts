/**
 * External type defs so the the module can use them
 * @packageDocumentation
 */
/** Grab type definitons of environment config variables (so they appear in IDE autocomplete) */
import "@ecms/core/src/config";
import { users } from "./models";

/** Override Express.User */
declare namespace Express {
	export interface Request {
		user?: users | undefined;
	}
}