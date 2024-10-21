import { Hono } from "hono";
import { scientistsData } from "./data";
import { z } from "zod"

const physicist = new Hono();

// get all physicist
physicist.get("/", (c) => {
    return c.json(scientistsData)
});

// get random physicist
physicist.get("/random", (c) => {
    return c.json(scientistsData[Math.floor(Math.random() * scientistsData.length)])
});

// get scientist by id
const responseSchema = z.object({
    id: z.number(),
    name: z.string(),
    nationality: z.string(),
    date_of_birth: z.string().date(),
    date_of_death: z.string().nullable(),
    discoveries: z.array(z.string()).nullable(),
    other_awards: z.array(z.string()).nullable()
});

physicist.get("/:id", (c) => {
    const scientistId = c.req.param("id");
    const response  = scientistsData.find((scientist) => scientist.id.toString() === scientistId)
    const parsedResponse = responseSchema.parse(response)
    return c.json(parsedResponse)
});

export default physicist;