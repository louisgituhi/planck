import { Hono } from "hono";
import scientistRouter from "./routes/physicists";

interface ENV {
	PLANCK_RATE_LIMITER: string;
}

const app = new Hono();

app.route("/", scientistRouter);

Bun.serve({
	fetch: app.fetch,
	port: process.env.PORT || 3000,
});
