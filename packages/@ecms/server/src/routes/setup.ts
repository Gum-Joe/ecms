/**
 * Routes for setup
 * @packageDocumentation
 */

import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import safeStringify from "fast-safe-stringify";
import { ReqPartialSetup, ReqUploadCompetitorsCSV, ResSetupStatus, ResStartSetup, SetupStates } from "@ecms/api/setup";
import connectToDB from "../utils/db";
import createLogger from "../utils/logger";
import connectToRedis from "../utils/redis";
import { ECMSResponse, PartialSetup, RedisCompetitorImport } from "../utils/interfaces";

import { RequestWithBody as Request } from "../utils/interfaces";
import { COMPETITOR_IMPORT_REDIS_KEY_PREFIX, SETUP_REDIS_KEY_PREFIX } from "../utils/constants";
import SetupHandler from "../setup/end";

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
		await redis.HSET(`${SETUP_REDIS_KEY_PREFIX}${setupID}`, {
			status: "pending",
			data: safeStringify({}),
		});

		await redis.EXPIRE(`${SETUP_REDIS_KEY_PREFIX}${setupID}`, SETUP_REDIS_EXPIRE_TTL); // Keep in DB for 1 hr

		res.json({
			setupID,
		});
		res.end();

		logger.info("Setup started.");
	} catch (err) {
		logger.error("Error creating new setup!");
		logger.error((err as Error)?.message);
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
		const partialUpdate: PartialSetup = {
			status: "in progress" as unknown as SetupStates,
			data: safeStringify(req.body),
		};
		await redis.HSET(`${SETUP_REDIS_KEY_PREFIX}${req.body.setupID}`, partialUpdate as unknown as Record<string, string>);

		await redis.EXPIRE(`${SETUP_REDIS_KEY_PREFIX}${req.body.setupID}`, SETUP_REDIS_EXPIRE_TTL); 

		res.json({
			message: "Setup updated",
		});
		res.end();

		logger.info("Setup updated.");
	} catch (err) {
		logger.error("Error creating new setup!");
		logger.error((err as Error)?.message);
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

	const toPutIntoRedis: RedisCompetitorImport = {
		csvMetadata: safeStringify(req.body.csvMetadata),
		csvData: safeStringify(req.body.csvData),
		setupID: req.body.setupID,
	};

	try  {
		// Here, we insert the CSV data and metadata into a different Redis key
		// This is to prevent having to retrieve this if we just want to access the partial setup
		// We then set a flag (hasImportedCompetitors) on the record in transactions:imported_competitors:<setupID> to indicate a competitors CSV has been uploaded
		logger.debug("Adding CSV to redis...");
		await redis.HSET(`${COMPETITOR_IMPORT_REDIS_KEY_PREFIX}${req.body.setupID}`, toPutIntoRedis);
		await redis.EXPIRE(`${COMPETITOR_IMPORT_REDIS_KEY_PREFIX}${req.body.setupID}`, SETUP_REDIS_EXPIRE_TTL);
		logger.debug("Updating partial setup record (key)...");
		await redis.HSET(`${SETUP_REDIS_KEY_PREFIX}${req.body.setupID}`, {
			hasImportedCompetitors: "true", // flag in effect
		});
		await redis.EXPIRE(`${SETUP_REDIS_KEY_PREFIX}${req.body.setupID}`, SETUP_REDIS_EXPIRE_TTL);

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

/** Finalise a setup, placing setup info. into the database to create the event/group. Literally just needs a `setupID` */
router.post("/end", async (req, res, next) => {
	logger.debug("Got request to end setup...");
	if (!req.body.setupID) {
		res.statusCode = 400;
		res.json({
			message: "Please provide a setupID.",
		});
		return;
	}
	logger.debug("Checking setup exists...");
	try {
		const isExists = await redis.EXISTS(SETUP_REDIS_KEY_PREFIX + req.body.setupID);
		if (!isExists) {
			res.statusCode = 404;
			res.json({
				message: "setupID not found",
			});
			return;
		}
		logger.debug("Found setupID! Proceeding with ending setup...");
		const setupHandler = new SetupHandler(req.body.setupID, pool, redis);
		// HAND-OFF - runs async, don't care about result.
		setupHandler.finaliseHandOff();
		res.statusCode = 202;
		res.json({
			message: "Response accepted. Finalising setup...",
		});
	} catch (err) {
		logger.error("Error starting the process of ending setup!");
		const errorCast = err as Error;
		logger.error("message" in errorCast ? errorCast.message : errorCast);
		res.status(500).json({
			message: `Internal Server Error - ${(err as Error)?.message}`,
		});
	}
});

/** Returns setup state */
router.get("/state/:setupID", async (req, res: ECMSResponse<ResSetupStatus>, next) => {
	try {
		const state: SetupStates["status"] | string | undefined = await redis.HGET(SETUP_REDIS_KEY_PREFIX + req.params.setupID, "status");
		if (typeof state === "undefined") {
			res.statusCode = 404;
			res.json({
				message: "Setup not found, or ID couldn't be retrieved."
			});
		} else {
			res.statusCode = 200;
			res.json({
				status: state as SetupStates["status"],
				error: await redis.HGET(SETUP_REDIS_KEY_PREFIX + req.params.setupID, "error"),
			});
		}
	} catch (err) {
		logger.error("Error getting setup state!");
		const errorCast = err as Error;
		logger.error("message" in errorCast ? errorCast.message : errorCast);
		res.status(500).json({
			message: `Internal Server Error - ${(err as Error)?.message}`,
		});
	}
})

export default router;
