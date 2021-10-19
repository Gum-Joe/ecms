/**
 * Handles Passport setup
 * Returns the passport objcts, configured with all the login strategies
 * @packageDocumentation
 */
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import urljoin from "url-join";
import type { LoggerFactory } from "@ecms/core";

// Add return type of passport
export default function setupPassport(loggerFactory: LoggerFactory) {
  const logger = loggerFactory.createLogger("auth")
  // Setup google
  if (!process.env.ECMS_GOOGLE_CLIENT_ID || !process.env.ECMS_GOOGLE_CLIENT_SECRET || !process.env.ECMS_GOOGLE_CALLBACK_DOMAIN) {
    throw new Error("Error! Required environment variables not specified - please check your server config");
  }
  // From http://www.passportjs.org/packages/passport-google-oauth20/
  passport.use(new GoogleStrategy({
      clientID: process.env.ECMS_GOOGLE_CLIENT_ID,
      clientSecret: process.env.ECMS_GOOGLE_CLIENT_SECRET,
      callbackURL: urljoin(process.env.ECMS_GOOGLE_CALLBACK_DOMAIN, "/api/user/google/callback") // TODO: Check URL
    },
    function(accessToken, refreshToken, profile, cb) {
      logger.info("Got Google login request. Authentication...");
      // Here, find the user's email and check type is google (if error, fail)
    }
  ));
  return passport;
}