import { Hono } from "hono";
import { logger } from "hono/logger";
import { scientistsData } from "./data";

const app = new Hono();
app.use(logger());

app.get("/", (c) => {
	logger();
	return c.text("Welcome to the planck");
});

app.get("/scientists", (c) => {
	return c.json(scientistsData);
});

app.get("/scientists/random", (c) => {
	return c.json(
		scientistsData[Math.floor(Math.random() * scientistsData.length)],
	);
});

app.get("/scientists/:scientist", (c) => {
	if (!c.req.param("scientist")) {
		return c.text("No scientist name provided");
	}
	const scientist = scientistsData.find((person) =>
		person.name.toLowerCase().includes(c.req.param("scientist").toLowerCase()),
	);
	return scientist ? c.json(scientist) : c.notFound();
});

export default app;
