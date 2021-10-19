/* eslint-disable @typescript-eslint/no-var-requires */
/**
 * Entry point for ECMS - starts ECMS up
 * @packageDocumentation
 */
import dotenv from "dotenv";
import { join } from "path";
import userRouter from "./routes/users";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - get weird error since package.json outside src/ (and therefore rootDir)
import packageJSON from "../package.json";
import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import session from "express-session";
import configurePassport from "./auth";
import createLogger from "./utils/logger";

// Preable log line
console.log(`ECMS v${packageJSON.version}`);
console.log("Starting ECMS...");

/** Intitalise our config into environmntal variables */
dotenv.config();

const logger = createLogger("server");

logger.debug("ECMS Logger Loaded.");

/** Initiale Express */
const app = express();

// TEST ROUTE
app.get("/heartbeat", (req, res, next) => {
	res.json({
		message: "Server alive",
	});
});

// Baseline middleware
//app.use(helmet()); // Security
app.use(express.json());
app.use(express.urlencoded());
// Setup logging here
app.use(morgan("dev"));

// Init session for login
// TODO: Use Redis Session store
app.use(session({
	secret: process.env.ECMS_SESSION_SECRET || "987&^%%$j*a)s;m*)aMwL&^*LKJaKH*hujhnliuHG",
	cookie: {
		// TODO: set this once HTTPS working!
		// secure: true
		// TODO: set an expiry time
	}
}));

// Initialise passport & logon
const passport = configurePassport();
app.use(passport.initialize());
app.use(passport.session());



// If in dev, setup hot reload of frontend
// From https://github.com/shellscape/koa-webpack
if (process.env.NODE_ENV === "development") {
	logger.info("Initialising Webpack Hot Reloading...");
	const WebpackDevMiddleware = require("webpack-dev-middleware");
	const WebpackHotMiddleware = require("webpack-hot-middleware");
	const webpack = require("webpack");
	const webpackConfig = require("../webpack.config.js");
	const compiler = webpack(webpackConfig);
	app.use(WebpackDevMiddleware(compiler, {
		publicPath: webpackConfig.output.publicPath
	}));
	app.use(WebpackHotMiddleware(compiler));
}

// Server HTML
app.use(express.static(join(__dirname, "../public")));

// Setup routes
app.use("/api/user", userRouter);

app.listen(process.env.ECMS_PORT || 9090, () => {
	logger.info("Server started.");
});


