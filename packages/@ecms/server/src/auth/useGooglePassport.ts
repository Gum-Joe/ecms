import { Logger } from "@ecms/core";
import type { PassportStatic } from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import type { Pool, PoolClient } from "pg";
import urljoin from "url-join";
import { users } from "../models";
import { USERS_TABLE } from "../utils/constants";

export function useGooglePassport(passport: PassportStatic, logger: Logger, dbPool: Pool): void {
	logger.debug("Setting up Google Strategy...");

	if (!process.env.ECMS_GOOGLE_CLIENT_ID || !process.env.ECMS_GOOGLE_CLIENT_SECRET || !process.env.ECMS_GOOGLE_CALLBACK_DOMAIN) {
		logger.error("Not all ECMS Config params for Google were given!");
		logger.error("Please check ECMS_GOOGLE_CLIENT_ID, ECMS_GOOGLE_CLIENT_SECRET, ECMS_GOOGLE_CALLBACK_DOMAIN have all been set.");
		throw new Error("Not all ECMS Config params for Google were set! Please check ECMS_GOOGLE_CLIENT_ID, ECMS_GOOGLE_CLIENT_SECRET, ECMS_GOOGLE_CALLBACK_DOMAIN have all been set.");
	}

	passport.use(
		// From http://www.passportjs.org/packages/passport-google-oauth20/
		new GoogleStrategy(
			{
				clientID: process.env.ECMS_GOOGLE_CLIENT_ID,
				clientSecret: process.env.ECMS_GOOGLE_CLIENT_SECRET,
				callbackURL: urljoin(process.env.ECMS_GOOGLE_CALLBACK_DOMAIN, "/api/user/google/callback") // TODO: Check URL
			},
			async function (accessToken, refreshToken, profile, cb) {
				logger.info("Got Google login request. Authentication...");
				// Check we have an email
				if (!Object.prototype.hasOwnProperty.call(profile, "emails") || !profile.emails) {
					logger.error("No email provided by Google for us to check!");
					return cb(new Error("No email provided by Google for us to check!"));
				}
				// Here, find the user's email and check type is google (if error, fail)
				logger.debug("Grabbing connection...");
				const client = await dbPool.connect();
				try {
				
					logger.debug("Extracting profile emails to check against...");
					const emails = profile.emails.map(email => email.value);
					const users = await client.query<Omit<users, "password">>(
						`SELECT user_id, name, auth_type, email FROM ${USERS_TABLE} WHERE email = ANY ($1) AND auth_type = 'oauth';`,
						[emails]
					);

					if (users.rows.length === 0) {
						logger.error("No user found!");
						cb(null, undefined, { message: "User not registered with ECMS. Ask your admin to register you." });
					} else {
						// Unique constraints mean we can guarentee we only get one user.
						logger.info("Auth success.");
						cb(null, users.rows[0]);
					}
				} catch (err) {
					logger.error("Error querying database!");
					cb(err as Error);
				} finally {
					logger.debug("Freeing client...");
					client.release();
				}
			}
		)
	);
}
