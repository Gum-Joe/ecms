/**
 * Entry point for ECMS - starts ECMS up
 * @packageDocumentation
 */
import Koa from "koa";
import Router from "@koa/router";
import KoaLogger from "koa-logger";

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

app.listen(9090, () => {
	console.log("Server started.");
});


