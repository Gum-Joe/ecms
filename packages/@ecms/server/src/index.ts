/**
 * Entry point for ECMS - starts ECMS up
 * @packageDocumentation
 */
import Koa from "koa";
import Router from "@koa/router";
import KoaLogger from "koa-logger";
import dotenv from "dotenv";

import "@ecms/core/src/config";

/** Intitalise our config into environmntal variables */
dotenv.config();


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

// Make use of the router so it can be used to route requests
app
	.use(router.routes())
	.use(router.allowedMethods());

app.listen(process.env.ECMS_PORT || 9090, () => {
	console.log("Server started.");
});


