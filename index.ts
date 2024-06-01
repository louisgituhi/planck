import { Hono } from "hono";
import physicistRouter from "./routes/physicists"

const app = new Hono();


app.route("/v1/physicists", physicistRouter)

Bun.serve({
    fetch: app.fetch,
    port: process.env.PORT || 3000,
});