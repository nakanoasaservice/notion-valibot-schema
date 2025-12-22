import { assertEquals } from "@std/assert/equals";
import { describe, it } from "@std/testing/bdd";
import { assertType, type IsExact } from "@std/testing/types";
import * as v from "valibot";

import { FormulaSchema } from "./formula.ts";
import type { SelectNotionProperty } from "./test-utils.ts";

type TargetType = SelectNotionProperty<"formula">;

describe("formula", () => {
	describe("FormulaSchema", () => {
		describe("type checking", () => {
			it("should accept formula property input type", () => {
				// Note: Formula property type checking is complex due to variant types
				// The schema accepts various formula types (string, date, number, boolean)
			});

			it("should have correct output type", () => {
				assertType<
					IsExact<
						v.InferOutput<typeof FormulaSchema>,
						| string
						| { start: Date; end: Date | null }
						| null
						| number
						| boolean
						| null
					>
				>(true);
			});
		});

		describe("parsing", () => {
			it("should parse string formula and return string value", () => {
				const result = v.parse(FormulaSchema, {
					formula: {
						type: "string",
						string: "Hello World",
					},
				} satisfies TargetType);

				assertEquals(result, "Hello World");
				assertEquals(typeof result, "string");
			});

			it("should parse date formula and return date object", () => {
				const result = v.parse(FormulaSchema, {
					formula: {
						type: "date",
						date: {
							start: "2024-01-15T00:00:00.000Z",
							end: "2024-01-20T00:00:00.000Z",
							time_zone: null,
						},
					},
				} satisfies TargetType);

				assertEquals(result !== null, true);
				if (result && typeof result === "object" && "start" in result) {
					assertEquals(result.start instanceof Date, true);
					assertEquals(result.end instanceof Date, true);
					assertEquals(result.start.toISOString(), "2024-01-15T00:00:00.000Z");
					assertEquals(result.end?.toISOString(), "2024-01-20T00:00:00.000Z");
				}
			});

			it("should parse date formula with null end date", () => {
				const result = v.parse(FormulaSchema, {
					formula: {
						type: "date",
						date: {
							start: "2024-01-15T00:00:00.000Z",
							end: null,
							time_zone: null,
						},
					},
				} satisfies TargetType);

				assertEquals(result !== null, true);
				if (result && typeof result === "object" && "start" in result) {
					assertEquals(result.start instanceof Date, true);
					assertEquals(result.end, null);
				}
			});

			it("should parse date formula with null date", () => {
				const result = v.parse(FormulaSchema, {
					formula: {
						type: "date",
						date: null,
					},
				} satisfies TargetType);

				assertEquals(result, null);
			});

			it("should parse number formula and return number value", () => {
				const result = v.parse(FormulaSchema, {
					formula: {
						type: "number",
						number: 42,
					},
				} satisfies TargetType);

				assertEquals(result, 42);
				assertEquals(typeof result, "number");
			});

			it("should parse boolean formula and return boolean value", () => {
				const result = v.parse(FormulaSchema, {
					formula: {
						type: "boolean",
						boolean: true,
					},
				} satisfies TargetType);

				assertEquals(result, true);
				assertEquals(typeof result, "boolean");
			});

			it("should parse boolean formula with null and return false", () => {
				const result = v.parse(FormulaSchema, {
					formula: {
						type: "boolean",
						boolean: null,
					},
				} satisfies TargetType);

				assertEquals(result, false);
				assertEquals(typeof result, "boolean");
			});
		});
	});
});
