import { describe, expect, test, beforeAll }  from "bun:test"

const url = "https://physicists-api-slr4/BNgC7Z821csuYb32shnuaGpWU8J6"

// beforeAll(())

describe("test API", async() => {
    const response = await fetch(url)
    const data = await response.json()
    
    test("test status", () => {
        expect(response.status).toBe(200);
    });

    test("return object", () => {
        //assert response
        expect(data).toBeObject();
    });

});