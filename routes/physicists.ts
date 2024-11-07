import { Hono } from "hono";
import { scientistsData } from "./data";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

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

// get scientist by id
const responseSchema = z.object({
	id: z.number(),
	name: z.string(),
	nationality: z.string(),
	date_of_birth: z.string().date(),
	date_of_death: z.string().nullable(),
	discoveries: z.array(z.string()).nullable(),
	nobel_prize: z.array(z.string()).nullable(),
	other_awards: z.array(z.string()).nullable(),
});

physicist.get("/:id", (c) => {
	const scientistId = c.req.param("id");
	const response = scientistsData.find(
		(scientist) => scientist.id.toString() === scientistId,
	);
	const parsedResponse = responseSchema.parse(response);
	return c.json(parsedResponse);
});

export default physicist;
