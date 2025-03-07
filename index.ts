import { Hono } from "hono";
import scientistRouter from "./routes/physicists";

const app = new Hono();

app.route("/", scientistRouter);

Bun.serve({
	fetch: app.fetch,
});
