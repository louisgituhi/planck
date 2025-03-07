import { Hono } from "hono";
import { cloudflareRateLimiter } from "@hono-rate-limiter/cloudflare";
import { scientistsData } from "./data";

type AppType = {
	Variables: {
		rateLimit: boolean;
	};
	Bindings: {
		RATE_LIMITER: RateLimit;
	};
};

const physicist = new Hono<AppType>().use(
	cloudflareRateLimiter<AppType>({
		rateLimitBinding: (c) => c.env.RATE_LIMITER,
		keyGenerator: (c) => c.req.header("cf-connecting-ip") ?? "",
	}),
);

// Apply the rate limiting middleware to all requests.
// const phycist = new Hono<AppType>().use(
// 	cloudflareRateLimiter<AppType>({
// 	  rateLimitBinding: (c) => c.env.RATE_LIMITER,
// 	  keyGenerator: (c) => c.req.header("cf-connecting-ip") ?? "", // Method to generate custom identifiers for clients.
// 	})
//   );

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
	const scientist = scientistsData.find((person) =>
		person.name.toLowerCase().includes(c.req.param("scientist").toLowerCase()),
	);
	return scientist ? c.json(scientist) : c.notFound();
});

export default physicist;
