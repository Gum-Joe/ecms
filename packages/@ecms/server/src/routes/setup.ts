/**
 * Routes for setup
 * @packageDocumentation
 */

import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import safeStringify from "fast-safe-stringify";
import { ReqPartialSetup, ReqUploadCompetitorsCSV, ResStartSetup, SetupStates } from "@ecms/api/setup";
import connectToDB from "../utils/db";
import createLogger from "../utils/logger";
import connectToRedis from "../utils/redis";
import { ECMSResponse } from "../utils/interfaces";

import { RequestWithBody as Request } from "../utils/interfaces";

const router = Router();
const logger = createLogger("api:setup");

const pool = connectToDB();
const redis = connectToRedis();
/** Allows setup information to remain in redis for up to an hour */
const SETUP_REDIS_EXPIRE_TTL = 60 * 60;

router.post("/start", async (req, res: ECMSResponse<ResStartSetup>, next) => {
	logger.info("Starting a new setup...");

	const setupID = uuidv4();

	try {
		// TODO: Check Roles
		await redis.HSET(`transactions:create_event_group:${setupID}`, {
			status: "pending",
			data: safeStringify({}),
		});

		await redis.EXPIRE(`transactions:create_event_group:${setupID}`, SETUP_REDIS_EXPIRE_TTL); // Keep in DB for 1 hr

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

/**
 * Update the status of a setup
 */
router.put("/partial", async (req: Request<ReqPartialSetup>, res: ECMSResponse<SetupStates>, next) => {
	logger.info(`Updating setup for ${req.body.setupID}...`);

	try {
		// TODO: Check Roles
		await redis.HSET(`transactions:create_event_group:${req.body.setupID}`, {
			status: "in progress",
			data: safeStringify(req.body),
		});

		await redis.EXPIRE(`transactions:create_event_group:${req.body.setupID}`, SETUP_REDIS_EXPIRE_TTL); 

		res.json({
			message: "Setup updated",
		});
		res.end();

		logger.info("Setup updated.");
	} catch (err) {
		logger.error("Error creating new setup!");
		logger.error(err);
		res.status(500).json({
			message: `Internal Server Error - ${(err as Error)?.message}`,
		});
	}
	//res.send("Setup started");
});

/**
 * Allow a setup to upload a CSV of competitors - the CSV must have be parsed beforehand though as the API describes.
 * 
 * Setting for team mappings etc are stored with setuip.
 */
router.post("/partial/uploadCSV", async (req: Request<ReqUploadCompetitorsCSV>, res: ECMSResponse, next) => {
	logger.info("Received CSV upload. Adding to redis...");
	logger.debug("Checking request body...");
	if (typeof req.body === "undefined") {
		res.status(400).json({
			message: "No request data provided",
		});
		return;
	} else if (!req.body.setupID) {
		res.status(400).json({
			message: "No setup ID provided.",
		});
		return;
	} else if (!req.body.csvData) {
		res.status(400).json({
			message: "No CSV data provided.",
		});
		return;
	} else if (!req.body.csvMetadata) {
		res.status(400).json({
			message: "No CSV Metadata provided.",
		});
		return;
	}

	const toPutIntoRedis: Record<keyof ReqUploadCompetitorsCSV, string | number> = {
		csvMetadata: safeStringify(req.body.csvMetadata),
		csvData: safeStringify(req.body.csvData),
		setupID: req.body.setupID,
	};

	try  {
		// Here, we insert the CSV data and metadata into a different Redis key
		// This is to prevent having to retrieve this if we just want to access the partial setup
		// We then set a flag (hasImportedCompetitors) on the record in transactions:imported_competitors:<setupID> to indicate a competitors CSV has been uploaded
		logger.debug("Adding CSV to redis...");
		await redis.HSET(`transactions:imported_competitors:${req.body.setupID}`, toPutIntoRedis);
		await redis.EXPIRE(`transactions:imported_competitors:${req.body.setupID}`, SETUP_REDIS_EXPIRE_TTL);
		logger.debug("Updating partial setup record (key)...");
		await redis.HSET(`transactions:create_event_group:${req.body.setupID}`, {
			hasImportedCompetitors: "true", // flag in effect
		});
		await redis.EXPIRE(`transactions:create_event_group:${req.body.setupID}`, SETUP_REDIS_EXPIRE_TTL);

		logger.debug("Done.");

		// reset expire
		res.json({
			message: "Setup updated",
		});
		res.end();
	} catch (err) {
		logger.error("Error updating CSV!");
		logger.error(err);
		res.status(500).json({
			message: `Internal Server Error - ${(err as Error)?.message}`,
		});
	}
});

export default router;
