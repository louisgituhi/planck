# Planck a Scientist API

This API provides information about scientists, their discoveries, and awards.

# Features

+ Retrieve a list of scientists and their details

+ Includes information on discoveries, Nobel Prizes, and other awards

+ Uses Zod for schema validation

+ Supports modern dates but does not support BC and AD era dates

# Schema

The API follows the below schema for scientist data validation:

```ts
const scientistSchema = z.array(
    z.object({
        id: z.number({ message: "Id should be a number" }),
        name: z.string(),
        nationality: z.string(),
	category: z.nativeEnum(CategoryEnum),
        description: z.string(),
        date_of_birth: z
            .string()
            .date("Date should follow the format of YYYY-MM-DD"),
        date_of_death: z
            .string()
            .date("Date should follow the format of YYYY-MM-DD")
            .nullable(),
        discoveries: z.array(
            z.string({ message: "Array items should be strings" })
        ),
        nobel_prize: z
            .array(
                z.object({
                    category: z.string(),
                    year: z.number().gte(1901, {
                        message: "Nobel prizes started being awarded in the year 1901",
                    }),
                    study: z.string(),
                })
            )
            .nullable(),
        other_awards: z.array(z.string()).nullable(),
    })
);
```

# Getting Started

## Install dependencies
```
bun install
```
This should install all the dependencies

Once installed run:

```
bun --watch index.ts
```
You should now access it on port 3000 🎉
## Development
+ Home ```http://localhost:3000/```
+ All scientists ```http://localhost:3000/scientists```
+ Random scientist ```http://localhost:3000/scientists/random```
+ Pass a name to get specific scientist ```http://localhost:3000/scientists/albert```

**Response**
```ts
{
		id: 3,
		name: "Albert Einstein",
		nationality: "German",
		category: "physicist",
		description:
			"German-born theoretical physicist who is widely held as one of the most influential scientists. Best known for developing the theory of relativity",
		date_of_birth: "1879-03-14",
		date_of_death: "1955-04-18",
		discoveries: [
			"General relativity and the equivalence principle",
			"Provided powerful evidence that atoms and molecules actually exist, through his analysis of Brownian motion",
			"Explained the photoelectric effect",
			"Hole argument and Entwurf theory",
			"Gravitational waves",
			"Wormholes",
			"Special relativity",
			"Unified field theory",
			"Equations of motion",
			"Bose–Einstein statistics",
			"Wave–particle duality",
			"Quantum mechanics",
			"Bose–Einstein condensate",
			"EPR paradox",
			"E=hf (Planck–Einstein relation)",
			"E=mc2 (mass–energy equivalence)",
			"Rewrote the law of gravitation:  showed that matter causes space to curve, which produces gravity",
		],
		nobel_prize: [
			{
				category: "Physics",
				year: 1921,
				study: "discovery of the law of the photoelectric effect",
			},
		],
		other_awards: [
			"Copley medal (1925)",
			"Max Planck Medal (1929)",
			"Barnard Medal for Meritorious Service to Science (1920)",
			"Matteucci Medal (1921)",
			"ForMemRS (1921)",
			"Gold Medal of RAS (1926)",
			"Time Person of the Century (1999)",
			"Membership of NAS (1942)",
		],
	},
```

You can access the deployed api endpoint here
[planck](https://zonal-dorisa-louisgituhi-a992d867.koyeb.app/)

