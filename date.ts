import { z } from "zod";

// Define a regex to match BC and AD years
const yearRegex = /^(\d{1,4})\s*(BC)?$/;

// Create the Zod schema
const yearSchema = z
	.string()
	.refine((value) => yearRegex.test(value), {
		message: "Invalid format. Use 'YYYY' for AD or 'YYYY BC' for BC years.",
	})
	.transform((value) => {
		const match = value.match(yearRegex);
		if (!match) return value;

		const year = Number.parseInt(match[1], 10);
		return match[2]
			? { year: -year, original: value }
			: { year, original: value };
	});

// Test cases
const validYears = ["2024", "100 BC", "4500", "300 BC"];
const invalidYears = ["March 8, 2024", "100BC", "4500 AD", "Year 300 BC"];

// validYears.forEach((year) => {
// 	console.log("year", yearSchema.safeParse(year));
// });

// invalidYears.forEach((year) => {
// 	console.log(yearSchema.safeParse(year));
// });
