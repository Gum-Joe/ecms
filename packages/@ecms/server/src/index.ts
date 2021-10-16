/**
 * Entry point for ECMS - starts ECMS up
 * @packageDocumentation
 */
import Koa from "koa";
import Router from "@koa/router";
import KoaLogger from "koa-logger";
import dotenv from "dotenv";
import { LoggerFactory } from "@ecms/core";
import koaWebpack from "koa-webpack";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - get weird error since package.json outside src/ (and therefore rootDir)
import packageJSON from "../package.json";

import path, { join } from "path";

// Preable log line
console.log(`ECMS v${packageJSON.version}`);
console.log("Starting ECMS...");

/** Intitalise our config into environmntal variables */
dotenv.config();

/** Load logger */
const ECMSLoggerFactory = new LoggerFactory(
	process.env.ECMS_LOGS_LOCATION || join(process.cwd(), "logs"),
	(process.env.NODE_ENV === "development" && process.env.ECMS_LOG_SILENT !== "true") ?
		"debug" :
		((process.env.NODE_ENV === "test" || process.env.ECMS_LOG_SILENT === "true") ? "none" : "info")
);
const logger = ECMSLoggerFactory.createLogger("server");

logger.info("ECMS Logger Loaded.");

/** Initiale Koa */
const app = new Koa();
const router = new Router();

// TEST ROUTE
router.get("/heartbeat", async (ctx, next) => {
	ctx.body = {
		message: "Server alive",
	};
});

// Setup logging here
app.use(KoaLogger());

// If in dev, setup hot reload of frontend
// From https://github.com/shellscape/koa-webpack
if (process.env.NODE_ENV === "development") {
	logger.info("Initialising Webpack Hot Reloading...");
	koaWebpack({
		// @ts-ignore
		configPath: join(require.resolve("@ecms/frontend"), "webpack.config.js"),
	}).then(
		webpackHotReload => app.use(webpackHotReload)
	);
}

// Make use of the router so it can be used to route requests
app
	.use(router.routes())
	.use(router.allowedMethods());

app.listen(process.env.ECMS_PORT || 9090, () => {
	logger.info("Server started.");
});


