import { describe, expect, test } from "vitest";
import { Hono } from "hono";

const app = new Hono();
app.get("/", (c) => c.text("Welcome to the scientists API!"));

describe("home route test", () => {
	test("GET /", async () => {
		const res = await app.request("/");
		expect(res.status).toBe(200);
		expect(await res.text()).toBe("Welcome to the scientists API!");
	});
});

describe(" /scientist route test", () => { });
