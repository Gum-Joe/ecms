import { Logger } from "@ecms/core";
import { PassportStatic } from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Pool } from "pg";
import bcrypt from "bcrypt";
import { USERS_TABLE } from "../utils/constants";
import { users } from "@ecms/models";

/**
 * Hash a password
 * Saved for later, so we have a consistent number of bcrypt rounds
 */
export async function hashPassword(password: string): Promise<string> {
	return await bcrypt.hash(password, 10);
}

/**
 * Sets up authentication based on email & password combo.
 */
export function useLocalAuth(passport: PassportStatic, logger: Logger, dbPool: Pool): void {
	logger.debug("Setting up local authentication...");

	passport.use(new LocalStrategy({
		usernameField: "email",
	},
	async function(email, password, cb) {
		logger.info("Authenticating a local auth user...");
		// Here, find the user's email and check type is local (if error, fail)
		logger.debug("Grabbing connection...");
		const client = await dbPool.connect();
		try {

			const users = await client.query<users>(
				`SELECT user_id, name, auth_type, email, password FROM ${USERS_TABLE} WHERE email = $1 AND auth_type = 'local';`,
				[email]
			);

			if (users.rows.length === 0) {
				logger.error("No user found!");
				return cb(null, false, { message: "Incorrect username or password." });
			}

			// Unique constraints mean we can guarentee we only get one user.
			const theUser = users.rows[0];
			logger.debug("Checking Password...");
			const match = await bcrypt.compare(password, theUser.password);

			if (!match) {
				logger.error("Password did not match!");
				return cb(null, false, { message: "Incorrect username or password." });
			}

			logger.info("Authentication Success!");
			return cb(null, { ...theUser, password: undefined }); // Hide password
		} catch (err) {
			logger.error("Error querying database!");
			cb(err as Error);
		} finally {
			logger.debug("Freeing client...");
			client.release();
		}
	}
	));
}