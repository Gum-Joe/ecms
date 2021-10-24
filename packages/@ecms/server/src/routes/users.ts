/** 
 * Contains all the routes for user management.
 * 
 * Mounted under /user
 * @packageDocumentation
 */

import { Express, Router, Response } from "express";
import { StatusCodes } from "http-status-codes";
import passport from "passport";
import { assertHasUser } from "../utils/check_has_user";
import connectToDB from "../utils/db";
import { RequestWithBody } from "../utils/interfaces";
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
			message: "Expected a logged in user.",
		});
	} else {
		assertHasUser(req);
		res.json(req.user);
	}
});


/**
 * Do a role check
 * 
 * Expects:
 * 1. Logged in
 * 2. param in req.body.rolesToCheck
 * 
 * Returns:
 * 1. hasPermission: boolean - whether the user has the roles requested or their parents
 */
interface ReqGetCurrentUser {
	rolesToCheck: string[],
}
router.get("/current/checkRoles", async (req: RequestWithBody<ReqGetCurrentUser>, res, next) => {
	if (!req.isAuthenticated) {
		res.statusCode = 401;
		res.json({
			message: "Expected a logged in user"
		});
	} else {
		
		if (!req.query.rolesToCheck || !Array.isArray(req.query.rolesToCheck)) {
			logger.error("Did not get a rolesToCheck param of the correct type. Expected an array");
			res.statusCode = 400;
			res.json({
				message: "Did not get a rolesToCheck param of the correct type. Expected an array."
			});
			return;
		}
		const client = await pool.connect();
		try {
			assertHasUser(req);

			logger.info(`Checking roles for user ${req.user?.user_id}`);

			// How many matching roles does the user have
			// if 0, no permissions
			// if >0, has permissions
			const numberOfRoles = await pool.query(`
				SELECT COUNT(*) FROM roles
				WHERE role_id IN (
					SELECT role_id FROM join_roles_users
					WHERE user_id = $1
				)
				AND path @> $2::ltree[];
				`,
			[req.user.user_id, req.query.rolesToCheck]);


			if (parseInt(numberOfRoles.rows[0].count) === 0) {
				logger.error("Roles required not found.");
				res.statusCode = StatusCodes.OK;
				res.json({
					hasPermission: false,
				});
			} else {
				logger.info("Roles found!");
				res.statusCode = StatusCodes.OK;
				res.json({
					hasPermission: true,
				});
			}
		} catch (err) {
			return next(err);
		} finally {
			client.release();
		}
		
		
	}
});

export default router;
