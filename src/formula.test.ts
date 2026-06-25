import * as v from "valibot";
import { describe, expect, expectTypeOf, it } from "vitest";

import {
	DateSchema,
	FullDateSchema,
	NullableDateSchema,
	NullableFullDateSchema,
} from "./date.ts";
import {
	BooleanFormulaSchema,
	FormulaSchema,
	NullableBooleanFormulaSchema,
	NullableStringFormulaSchema,
	StringFormulaSchema,
} from "./formula.ts";
import { NullableNumberSchema, NumberSchema } from "./number.ts";
import type { NonNullableValues, SelectNotionProperty } from "./test-utils.ts";

type TargetType = SelectNotionProperty<"formula">;

type PartialStringFormulaPropertyValue = {
	formula: NonNullableValues<
		Extract<TargetType["formula"], { type: "string" }>
	>;
};

describe("formula", () => {
	describe("FormulaSchema", () => {
		describe("type checking", () => {
			it("should accept formula property input type", () => {
				const Schema = FormulaSchema(
					v.union([
						NullableBooleanFormulaSchema,
						NullableFullDateSchema,
						NullableNumberSchema,
						NullableStringFormulaSchema,
					]),
				);

				expectTypeOf<TargetType>().toExtend<v.InferInput<typeof Schema>>();
			});

			it("should have correct output type", () => {
				const Schema = FormulaSchema(StringFormulaSchema);

				expectTypeOf<v.InferOutput<typeof Schema>>().toEqualTypeOf<string>();
			});
		});

		describe("parsing", () => {
			it("should parse string formula and return string value", () => {
				const Schema = FormulaSchema(StringFormulaSchema);

				const result = v.parse(Schema, {
					formula: {
						type: "string",
						string: "Hello World",
					},
				} satisfies TargetType);

				expect(result).toEqual("Hello World");
			});

			it("should parse date formula and return date object", () => {
				const Schema = FormulaSchema(FullDateSchema);

				const result = v.parse(Schema, {
					formula: {
						type: "date",
						date: {
							start: "2024-01-15T00:00:00.000Z",
							end: "2024-01-20T00:00:00.000Z",
							time_zone: null,
						},
					},
				} satisfies TargetType);

				expect(result.start.toISOString()).toBe("2024-01-15T00:00:00.000Z");
				expect(result.end instanceof Date).toBe(true);
				expect(result.end?.toISOString()).toBe("2024-01-20T00:00:00.000Z");
				expect(result.time_zone).toBe(null);
			});

			it("should parse date formula with null end date", () => {
				const Schema = FormulaSchema(DateSchema);

				const result = v.parse(Schema, {
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
				expect(result instanceof Date).toBe(true);
			});

			it("should parse date formula with null date", () => {
				const Schema = FormulaSchema(NullableDateSchema);
				const result = v.parse(Schema, {
					formula: {
						type: "date",
						date: null,
					},
				} satisfies TargetType);

				expect(result).toBe(null);
			});

			it("should parse number formula and return number value", () => {
				const Schema = FormulaSchema(NumberSchema);

				const result = v.parse(Schema, {
					formula: {
						type: "number",
						number: 42,
					},
				} satisfies TargetType);

				expect(result).toEqual(42);
				expect(typeof result).toEqual("number");
			});

			it("should parse boolean formula and return boolean value", () => {
				const Schema = FormulaSchema(BooleanFormulaSchema);

				const result = v.parse(Schema, {
					formula: {
						type: "boolean",
						boolean: true,
					},
				} satisfies TargetType);

				expect(result).toEqual(true);
				expect(typeof result).toEqual("boolean");
			});
		});

		describe("partial response", () => {
			describe("type checking", () => {
				it("should accept partial Notion property value", () => {
					const Schema = FormulaSchema(StringFormulaSchema);

					expectTypeOf<PartialStringFormulaPropertyValue>().toExtend<
						v.InferInput<typeof Schema>
					>();
				});
			});

			describe("parsing", () => {
				it("should parse partial Notion property value", () => {
					const Schema = FormulaSchema(StringFormulaSchema);

					const result = v.parse(Schema, {
						formula: {
							type: "string",
							string: "Hello World",
						},
					} satisfies PartialStringFormulaPropertyValue);

					expect(result).toBe("Hello World");
				});
			});
		});
	});
});
