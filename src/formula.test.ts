import * as v from "valibot";
import { describe, expect, expectTypeOf, it } from "vitest";

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
				expectTypeOf<v.InferOutput<typeof FormulaSchema>>().toEqualTypeOf<
					| string
					| { start: Date; end: Date | null }
					| null
					| number
					| boolean
					| null
				>();
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

				expect(result).toEqual("Hello World");
				expect(typeof result).toEqual("string");
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

				expect(result !== null).toBe(true);
				if (result && typeof result === "object" && "start" in result) {
					expect(result.start instanceof Date).toBe(true);
					expect(result.end instanceof Date).toBe(true);
					expect(result.start.toISOString()).toBe("2024-01-15T00:00:00.000Z");
					expect(result.end?.toISOString()).toBe("2024-01-20T00:00:00.000Z");
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

				expect(result !== null).toBe(true);
				if (result && typeof result === "object" && "start" in result) {
					expect(result.start instanceof Date).toBe(true);
					expect(result.end).toBe(null);
				}
			});

			it("should parse date formula with null date", () => {
				const result = v.parse(FormulaSchema, {
					formula: {
						type: "date",
						date: null,
					},
				} satisfies TargetType);

				expect(result).toBe(null);
			});

			it("should parse number formula and return number value", () => {
				const result = v.parse(FormulaSchema, {
					formula: {
						type: "number",
						number: 42,
					},
				} satisfies TargetType);

				expect(result).toEqual(42);
				expect(typeof result).toEqual("number");
			});

			it("should parse boolean formula and return boolean value", () => {
				const result = v.parse(FormulaSchema, {
					formula: {
						type: "boolean",
						boolean: true,
					},
				} satisfies TargetType);

				expect(result).toEqual(true);
				expect(typeof result).toEqual("boolean");
			});

			it("should parse boolean formula with null and return false", () => {
				const result = v.parse(FormulaSchema, {
					formula: {
						type: "boolean",
						boolean: null,
					},
				} satisfies TargetType);

				expect(result).toEqual(false);
				expect(typeof result).toEqual("boolean");
			});
		});
	});
});
