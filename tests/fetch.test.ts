import { describe, expect, test } from "bun:test";

const url = "http://localhost:3000";

describe("test API", async () => {
	const response = await fetch(url);
	const data = await response.json();

	test("test status", () => {
		expect(response.status).toBe(200);
	});

	test("return object", () => {
		//assert response
		expect(data).toBeObject();
	});
});
