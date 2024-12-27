import { Hono } from "hono";
import { scientistsData } from "./data";
import { z } from "zod";

const physicist = new Hono();

// get all physicists
physicist.get("/", (c) => {
	return c.json(scientistsData);
});

physicist.get("/random", (c) => {
	return c.json(
		scientistsData[Math.floor(Math.random() * scientistsData.length)],
	);
});

// not found error

physicist.notFound((c) => {
	return c.text("Could not find the scientist you are looking for", 404);
});

// error handling
physicist.onError((err, c) => {
	return c.text(`Error occurred ${err.message}: ${err.name}`, 500);
});

physicist.get("/:id", (c) => {
	const scientistId = c.req.param("id");
	const response = scientistsData.find(
		(scientist) => scientist.id.toString() === scientistId,
	);
	return c.json(response);
});

export default physicist;
