import { Hono } from "hono";
import { physicistsData } from "./data";

const physicist = new Hono();

// get all physicist
physicist.get("/", (c) => {
    return c.json(physicistsData)
});

// get random physicist
physicist.get("/random", (c) => {
    return c.json(physicistsData[Math.floor(Math.random() * physicistsData.length)])
});


export default physicist;