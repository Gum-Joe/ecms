/** 
 * Contains all the routes for user management.
 * 
 * Mounted under /user
 * @packageDocumentation
 */

import { Router } from "express";

const router = Router();

/**
 * Handle Google OAuth (Sign in with Google)
 */
router.get("/login/google", async (req, res) => {	
	res.json({
		message: "hi",
	});
});

export default router;