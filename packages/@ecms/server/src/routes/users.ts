/** 
 * Contains all the routes for user management.
 * 
 * Mounted under /user
 * @packageDocumentation
 */

import Router from "@koa/router";

const router = new Router({ prefix: "/user" });

/**
 * Handle Google OAuth (Sign in with Google)
 */
router.get("/login/google", async (ctx, next) => {	
	ctx.body = {
		message: "hi",
	};
	return;
});

export default router;