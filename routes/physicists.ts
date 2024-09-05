import { Hono } from "hono";
import { scientistsData } from "./data";

const physicist = new Hono();

// get all physicist
physicist.get("/", (c) => {
    return c.json(scientistsData)
});

// get random physicist
physicist.get("/random", (c) => {
    return c.json(scientistsData[Math.floor(Math.random() * scientistsData.length)])
});

// pass id and get a scientist
physicist.get("/:id", (c) => {
    const scientistId = c.req.param("id");
    const responseData  = scientistsData.find((scientist) => scientist.id == scientistId)
    return c.json(responseData)
})


export default physicist;