/** 
 * Contains all the routes for user management.
 * 
 * Mounted under /user
 * @packageDocumentation
 */

import { Router } from "express";
import passport from "passport";

const router = Router();

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
		res.send(`You are authenticated! Hello ${(req.user as any)?.name}!`);
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
		res.send(`You are authenticated! Hello ${(req.user as any)?.name}!`);
	}
);
export default router;