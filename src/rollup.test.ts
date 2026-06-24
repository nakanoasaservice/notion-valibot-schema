import * as v from "valibot";
import { describe, expect, expectTypeOf, it } from "vitest";

import { DateSchema } from "./date.ts";
import { NumberSchema } from "./number.ts";
import {
	NullableSingleRollupSchema,
	RollupScalarSchema,
	RollupSchema,
	SingleRollupSchema,
} from "./rollup.ts";
import type { NonNullableValues, SelectNotionProperty } from "./test-utils.ts";

type TargetType = SelectNotionProperty<"rollup">;

type RollupTypeOf<T> = {
	rollup: T;
};

type RollupArrayType = RollupTypeOf<
	NonNullableValues<Extract<TargetType["rollup"], { type: "array" }>>
>;

type SimpleRollupType = RollupTypeOf<
	NonNullableValues<Extract<TargetType["rollup"], { type: "number" | "date" }>>
>;

describe("rollup", () => {
	describe("RollupScalarSchema", () => {
		describe("type checking", () => {
			it("should accept rollup property input type", () => {
				const Schema = RollupScalarSchema(
					v.union([
						v.object({
							type: v.literal("number"),
							number: v.unknown(),
						}),
						v.object({
							type: v.literal("date"),
							date: v.unknown(),
						}),
					]),
				);

				expectTypeOf<SimpleRollupType>().toExtend<
					v.InferInput<typeof Schema>
				>();
			});

			it("should return the correct output type for number schema", () => {
				const Schema = RollupScalarSchema(NumberSchema);
				expectTypeOf<v.InferOutput<typeof Schema>>().toEqualTypeOf<number>();
			});

			it("should return the correct output type for date schema", () => {
				const Schema = RollupScalarSchema(DateSchema);
				expectTypeOf<v.InferOutput<typeof Schema>>().toEqualTypeOf<Date>();
			});
		});

		describe("parsing", () => {
			it("should parse rollup number property and extract number value", () => {
				const result = v.parse(RollupScalarSchema(NumberSchema), {
					rollup: {
						function: "sum",
						type: "number",
						number: 42,
					},
				} satisfies SimpleRollupType);

				expect(result).toEqual(42);
				expect(typeof result).toEqual("number");
			});

			it("should parse rollup date property and convert to Date object", () => {
				const result = v.parse(RollupScalarSchema(DateSchema), {
					rollup: {
						function: "latest_date",
						type: "date",
						date: {
							start: "2024-01-15T00:00:00.000Z",
							end: null,
							time_zone: null,
						},
					},
				} satisfies SimpleRollupType);

				expect(result instanceof Date).toBe(true);
				expect(result.toISOString()).toBe("2024-01-15T00:00:00.000Z");
			});
		});
	});

	describe("RollupSchema", () => {
		describe("type checking", () => {
			it("should accept rollup array property input type", () => {
				const Schema = RollupSchema(
					v.object({
						type: v.string(),
					}),
				);

				expectTypeOf<RollupArrayType>().toExtend<v.InferInput<typeof Schema>>();
			});

			it("should have correct output type for string array", () => {
				const Schema = RollupSchema(
					v.pipe(
						v.object({
							type: v.literal("number"),
							number: v.number(),
						}),
						v.transform((v) => v.number),
					),
				);

				expectTypeOf<v.InferOutput<typeof Schema>>().toEqualTypeOf<number[]>();
			});

			it("should have correct output type for number array", () => {
				const Schema = RollupSchema(
					v.object({
						type: v.literal("number"),
						number: v.number(),
					}),
				);

				expectTypeOf<v.InferOutput<typeof Schema>>().toEqualTypeOf<
					{ type: "number"; number: number }[]
				>();
			});
		});

		describe("parsing", () => {
			it("should parse rollup array property with string array and extract array", () => {
				const Schema = RollupSchema(NumberSchema);
				const result = v.parse(Schema, {
					rollup: {
						function: "sum",
						type: "array",
						array: [
							{
								type: "number",
								number: 42,
							},
						],
					},
				} satisfies RollupArrayType);

				expect(result).toEqual([42]);
				expect(Array.isArray(result)).toBe(true);
			});

			it("should parse empty rollup array", () => {
				const Schema = RollupSchema(
					v.object({
						number: v.number(),
					}),
				);
				const result = v.parse(Schema, {
					rollup: {
						function: "sum",
						type: "array",
						array: [],
					},
				} satisfies RollupArrayType);

				expect(result).toEqual([]);
			});

			it("should reject invalid values not matching schema", () => {
				const Schema = RollupSchema(
					v.object({
						string: v.string(),
					}),
				);
				expect(
					v.safeParse(Schema, {
						rollup: {
							function: "sum",
							type: "array",
							array: [
								{
									type: "number",
									number: 42,
								},
							],
						},
					} satisfies RollupArrayType).success,
				).toBe(false);
			});
		});
	});

	describe("SingleRollupSchema", () => {
		describe("type checking", () => {
			it("should accept rollup array property input type", () => {
				const Schema = SingleRollupSchema(
					v.object({
						type: v.string(),
					}),
				);
				expectTypeOf<
					RollupArrayType & {
						rollup: {
							array: [{ type: string }];
						};
					}
				>().toExtend<v.InferInput<typeof Schema>>();
			});

			it("should have correct output type", () => {
				const Schema = SingleRollupSchema(NumberSchema);
				expectTypeOf<v.InferOutput<typeof Schema>>().toEqualTypeOf<number>();
			});
		});

		describe("parsing", () => {
			it("should parse rollup array with single element and extract that element", () => {
				const Schema = SingleRollupSchema(NumberSchema);
				const result = v.parse(Schema, {
					rollup: {
						function: "sum",
						type: "array",
						array: [
							{
								type: "number",
								number: 42,
							},
						],
					},
				} satisfies RollupArrayType);

				expect(result).toEqual(42);
				expect(typeof result).toEqual("number");
			});

			it("should reject empty rollup array", () => {
				const Schema = SingleRollupSchema(NumberSchema);
				expect(
					v.safeParse(Schema, {
						rollup: {
							function: "sum",
							type: "array",
							array: [],
						},
					} satisfies RollupArrayType).success,
				).toBe(false);
			});

			it("should reject invalid values not matching schema", () => {
				const Schema = SingleRollupSchema(
					v.object({
						string: v.string(),
					}),
				);
				expect(
					v.safeParse(Schema, {
						rollup: {
							function: "sum",
							type: "array",
							array: [
								{
									type: "number",
									number: 42,
								},
							],
						},
					} satisfies RollupArrayType).success,
				).toBe(false);
			});
		});
	});

	describe("NullableSingleRollupSchema", () => {
		describe("type checking", () => {
			it("should accept rollup array property input type", () => {
				const Schema = NullableSingleRollupSchema(
					v.object({
						type: v.string(),
					}),
				);
				expectTypeOf<RollupArrayType>().toExtend<v.InferInput<typeof Schema>>();
			});

			it("should have correct output type", () => {
				const Schema = NullableSingleRollupSchema(NumberSchema);
				expectTypeOf<v.InferOutput<typeof Schema>>().toEqualTypeOf<
					number | null
				>();
			});
		});

		describe("parsing", () => {
			it("should parse rollup array with single element and extract that element", () => {
				const Schema = NullableSingleRollupSchema(NumberSchema);
				const result = v.parse(Schema, {
					rollup: {
						function: "sum",
						type: "array",
						array: [
							{
								type: "number",
								number: 42,
							},
						],
					},
				} satisfies RollupArrayType);

				expect(result).toEqual(42);
				expect(typeof result).toEqual("number");
			});

			it("should parse empty rollup array and return null", () => {
				const Schema = NullableSingleRollupSchema(NumberSchema);
				expect(
					v.parse(Schema, {
						rollup: {
							function: "sum",
							type: "array",
							array: [],
						},
					} satisfies RollupArrayType),
				).toBe(null);
			});

			it("should reject invalid values not matching schema", () => {
				const Schema = NullableSingleRollupSchema(
					v.object({
						string: v.string(),
					}),
				);
				expect(
					v.safeParse(Schema, {
						rollup: {
							function: "sum",
							type: "array",
							array: [
								{
									type: "number",
									number: 42,
								},
							],
						},
					} satisfies RollupArrayType).success,
				).toBe(false);
			});
		});
	});
});
