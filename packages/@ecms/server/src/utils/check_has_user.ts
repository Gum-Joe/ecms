import { users } from "../models";
import { Request } from "express";


/**
 * The following type is required to tell Express req.users exist, since by default it is undefined
 * From https://stackoverflow.com/questions/66614337/typescript-req-user-is-possibly-undefined-express-and-passport-js
 */
type RequestWithUser = Request & { user: Omit<users, "password"> };
export function assertHasUser(req: Request): asserts req is RequestWithUser {

	if (!("user" in req)) {
		throw new Error("Server error - user logged in but not user found in session.");
	}
	
}