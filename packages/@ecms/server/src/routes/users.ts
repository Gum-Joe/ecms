/** 
 * Contains all the routes for user management.
 * 
 * Mounted under /user
 * @packageDocumentation
 */

import { Router } from "express";
import passport from "passport";
import connectToDB from "../utils/db";
import createLogger from "../utils/logger";

const router = Router();
const logger = createLogger("api:user");

const pool = connectToDB();

/**
 * Handle Google OAuth (Sign in with Google)
 */
router.get(
	"/login/google",
	passport.authenticate("google", {
		scope: ["https://www.googleapis.com/auth/userinfo.email"]
	})
);
router.get(
	"/google/callback",
	passport.authenticate("google", { failureRedirect: "/" }),
	function (req, res) {
		// Success!
		res.redirect("/login/postlogin");
	}
);

/** 
 * Handle Local Authentication
 */
router.post(
	"/login/local",
	passport.authenticate("local", { failureRedirect: "/" }),
	function (req, res) {
		// Success!
		res.redirect("/login/postlogin");
	}
);

/** Get info about the current user */
router.get("/current", (req, res, next) => {
	logger.info("Asked for user info");
	if (!req.isAuthenticated) {
		logger.error("401: asked for info on user when not logged in!");
		res.statusCode = 401;
		res.json({
			message: "Expected a logged in user.”",
		});
	} else {
		res.json(req.user);
	}
});

export default router;
