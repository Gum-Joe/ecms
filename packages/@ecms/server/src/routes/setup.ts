/**
 * Routes for setup
 * @packageDocumentation
 */

import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import safeStringify from "fast-safe-stringify";
import { ResStartSetup } from "@ecms/api/setup";
import connectToDB from "../utils/db";
import createLogger from "../utils/logger";
import connectToRedis from "../utils/redis";
import { ECMSResponse } from "../utils/interfaces";

const router = Router();
const logger = createLogger("api:setup");

const pool = connectToDB();
const redis = connectToRedis();

router.get("/start", async (req, res: ECMSResponse<ResStartSetup>, next) => {
	logger.info("Starting a new setup...");

	const setupID = uuidv4();

	try {
		// TODO: Check Roles
		await redis.HSET(`transactions:create_event_group:${setupID}`, {
			stautus: "pending",
			data: safeStringify({}),
		});

		await redis.EXPIRE(`transactions:create_event_group:${setupID}`, 60 * 60); // Keep in DB for 1 hr

		res.json({
			setupID,
		});
		res.end();

		logger.info("Setup started.");
	} catch (err) {
		logger.error("Error creating new setup!");
		logger.error(err);
		res.status(500).json({
			message: `Internal Server Error - ${(err as Error)?.message}`,
		});
	}

	

	//res.send("Setup started");
});

export default router;
