/**
 * Handles Passport setup
 * Returns the passport objcts, configured with all the login strategies
 * @packageDocumentation
 */
import passport, { PassportStatic } from "passport";
import connectToDB from "../utils/db";
import createLogger from "../utils/logger";
import { useGooglePassport } from "./useGooglePassport";
import { useLocalAuth } from "./useLocalAuth";

// Add return type of passport
export default function setupPassport(): PassportStatic {
	const logger = createLogger("auth");
	const dbPool = connectToDB();

	logger.info("Provisioning passport for login...");
	logger.debug("Setting up google OAuth...");
	// Setup google
	if (!process.env.ECMS_GOOGLE_CLIENT_ID || !process.env.ECMS_GOOGLE_CLIENT_SECRET || !process.env.ECMS_GOOGLE_CALLBACK_DOMAIN) {
		throw new Error("Error! Required environment variables not specified - please check your server config");
	}
	
	useGooglePassport(passport, logger, dbPool);
	useLocalAuth(passport, logger, dbPool);

	// Use to create session info
	// puts user ID into the session which we can use for retrival later!
	passport.serializeUser((user: any, done) => {
		logger.debug("Serialising user into session...");
		done(null, user.user_id);
	});
	// Take session and get user
	passport.deserializeUser((id, done) => {
		logger.debug("Deserialising user...");
		dbPool.connect()
			.then(client => {
				return client.query(
					"SELECT user_id, name, auth_type, email FROM users WHERE user_id = $1",
					[ id ]
				);
			})
			.then(result => {
				if (result.rows.length === 0) {
					logger.error("No user foound when getting user out of session!");
					done(null, false);
				} else {
					done(null, result.rows[0]);
				}
			})
			.catch(err => done(err));
	});

	logger.info("Done.");
	return passport;
}


