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
import { ECMSResponse, RequestWithBody } from "../utils/interfaces";
import createLogger from "../utils/logger";
import type { ReqCheckRoles, ResCheckRoles } from "@ecms/api/user";



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

/**
 * Logout
 */
router.get("/logout", (req, res) => {
	logger.info("Logging user out...");
	req.logout();
	req.session.destroy(() => {
		res.redirect("/");
	});
});

/** Get info about the current user */
router.get("/current", (req, res, next) => {
	logger.info("Asked for user info");
	if (!req.isAuthenticated()) {
		logger.error("401: asked for info on user when not logged in!");
		res.statusCode = 401;
		res.json({
			message: "Expected a logged in user.",
		});
	} else if (!req.user) {
		logger.error("401: User authenticated but no user found in session!");
		res.statusCode = 401;
		res.json({
			message: "No user found in session - please login again.",
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
router.get("/current/checkRoles", async (req: RequestWithBody<ReqCheckRoles>, res: ECMSResponse<ResCheckRoles>, next) => {
	if (!req.isAuthenticated()) {
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
