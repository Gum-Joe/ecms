/* eslint-disable @typescript-eslint/no-empty-interface */
/**
 * External type defs so the the module can use them
 * @packageDocumentation
 */
/** Grab type definitons of environment config variables (so they appear in IDE autocomplete) */
import "@ecms/core/src/config";
import { users } from "../models";

type UserNew = users & Express.User;

/** Override Express.User. From https://stackoverflow.com/questions/66614337/typescript-req-user-is-possibly-undefined-express-and-passport-js */
declare global {
	namespace Express {
		interface User extends users { }
	}
}
