import { z } from "zod";

const physicistSchema = z.array(
    z.object({
        id: z.number(),
        name: z.string(),
        nationality: z.string(),
        description: z.string(),
        date_of_birth: z.string().date(),
        date_of_death: z.string().date().nullable(),
        discoveries: z.array(z.string()),
        nobel_prize: z.array(z.object({
            category: z.string(),
            year: z.number().gte(1901, { message: "Nobel prizes started being awarded in the year 1901" }),
            study: z.string()
        })),
        other_awards: z.array(z.string())
    })
);


export const physicistsData = [


    // Albert Einstein
    {
        id: 3,
        name: "Albert Einstein",
        nationality: "German",
        description: "A very short description about Albert Einstein",
        date_of_birth: "1879-04-21",
        date_of_death: "1959-06-21",
        discoveries: [
            "Theory of relativity and the resulting E = mc2",
            "Provided powerful evidence that atoms and molecules actually exist, through his analysis of Brownian motion",
            "Explained the photoelectric effect",
            "Rewrote the law of gravitation:  showed that matter causes space to curve, which produces gravity"
        ],
        nobel_prize: [
            {
                category: "Physics",
                year: 1921,
                study: ";jdhvhfejbhwkefygjwhbejfbwebjhbfjgwjefbhjwf"
            }
        ],
        other_awards: ["Copley medal (1925)"]
    }
    
]

physicistSchema.parse(physicistsData);