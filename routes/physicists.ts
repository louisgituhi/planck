import { Hono } from "hono";
import { physicistsData } from "./data";

const physicist = new Hono();

// get all physicist
physicist.get("/", (c) => {
    return c.json(physicistsData)
});
// /physicist/v1/scientists

// get random physicist
physicist.get("/random", (c) => {
    return c.json(physicistsData[Math.floor(Math.random() * physicistsData.length)])
});
// /physicist/v1/random


// pass an id and return scientist
// physicist.get("/:id", (c) => {
//     const id = c.params.id; // Extract the ID from the request parameters
//     const physicist = physicistsData.find(p => p.id === id); // Find physicist by ID
//     if (!physicist) {
//         return c.status(404).json({ error: "Physicist not found" });
//     }
//     return c.json(physicist);
// });
// /physicist/v1/:id


export default physicist;