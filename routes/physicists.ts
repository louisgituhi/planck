import { Hono } from "hono";
import { scientistsData } from "./data";

const physicist = new Hono();

// home page of scientists
physicist.get("/", (c) => {
	return c.text("Welcome to the scientists API!");
});

// get all scientists
physicist.get("/scientists", (c) => {
	return c.json(scientistsData);
});

// get random scientits
physicist.get("/scientists/random", (c) => {
	return c.json(
		scientistsData[Math.floor(Math.random() * scientistsData.length)],
	);
});

// specific scientitist
physicist.get("/scientists/:scientist", (c) => {
	if (!c.req.param("scientist")) {
		return c.text("No scientist name provided");
	}
	const scientist = scientistsData.find(
		(person) =>
			person.name.toLowerCase() === c.req.param("scientist").toLowerCase(),
	);
	return scientist ? c.json(scientist) : c.notFound();
});

export default physicist;
