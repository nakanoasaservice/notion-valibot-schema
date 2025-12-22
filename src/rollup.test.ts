import * as v from "valibot";
import { describe, expect, expectTypeOf, it } from "vitest";

import {
	NullableRollupDateSchema,
	NullableRollupNumberSchema,
	RollupArraySchema,
	RollupDateSchema,
	RollupNumberSchema,
} from "./rollup.ts";
import type { NonNullableValues, SelectNotionProperty } from "./test-utils.ts";

type TargetType = SelectNotionProperty<"rollup">;

type RollupTypeOf<T> = {
	rollup: T;
};

type RollupNumberType = RollupTypeOf<
	NonNullableValues<Extract<TargetType["rollup"], { type: "number" }>>
>;
type NullableRollupNumberType = RollupTypeOf<
	Extract<TargetType["rollup"], { type: "number" }>
>;

type RollupDateType = RollupTypeOf<
	NonNullableValues<Extract<TargetType["rollup"], { type: "date" }>>
>;
type NullableRollupDateType = RollupTypeOf<
	Extract<TargetType["rollup"], { type: "date" }>
>;

type RollupArrayType = RollupTypeOf<
	NonNullableValues<Extract<TargetType["rollup"], { type: "array" }>>
>;

describe("rollup", () => {
	describe("RollupNumberSchema", () => {
		describe("type checking", () => {
			it("should accept non-nullable rollup number property input type", () => {
				expectTypeOf<RollupNumberType>().toExtend<
					v.InferInput<typeof RollupNumberSchema>
				>();
			});

			it("should have correct output type", () => {
				expectTypeOf<
					v.InferOutput<typeof RollupNumberSchema>
				>().toEqualTypeOf<number>();
			});
		});

		describe("parsing", () => {
			it("should parse rollup number property and extract number value", () => {
				const result = v.parse(RollupNumberSchema, {
					rollup: {
						type: "number",
						function: "sum",
						number: 42,
					},
				} satisfies RollupNumberType);

				expect(result).toEqual(42);
				expect(typeof result).toEqual("number");
			});

			it("should reject null for non-nullable rollup number schema", () => {
				expect(
					v.safeParse(RollupNumberSchema, {
						rollup: {
							type: "number",
							function: "empty",
							number: null,
						},
					} satisfies NullableRollupNumberType).success,
				).toBe(false);
			});
		});
	});

	describe("NullableRollupNumberSchema", () => {
		describe("type checking", () => {
			it("should accept rollup number property or null input type", () => {
				expectTypeOf<NullableRollupNumberType>().toExtend<
					v.InferInput<typeof NullableRollupNumberSchema>
				>();
			});

			it("should have correct output type", () => {
				expectTypeOf<
					v.InferOutput<typeof NullableRollupNumberSchema>
				>().toEqualTypeOf<number | null>();
			});
		});

		describe("parsing", () => {
			it("should parse rollup number property and return number value", () => {
				const result = v.parse(NullableRollupNumberSchema, {
					rollup: {
						type: "number",
						function: "sum",
						number: 42,
					},
				} satisfies NullableRollupNumberType);

				expect(result).toEqual(42);
				expect(typeof result).toEqual("number");
			});

			it("should parse null rollup number property and return null", () => {
				expect(
					v.parse(NullableRollupNumberSchema, {
						rollup: {
							type: "number",
							function: "empty",
							number: null,
						},
					} satisfies NullableRollupNumberType),
				).toBe(null);
			});
		});
	});

	describe("RollupDateSchema", () => {
		describe("type checking", () => {
			it("should accept non-nullable rollup date property input type", () => {
				expectTypeOf<RollupDateType>().toExtend<
					v.InferInput<typeof RollupDateSchema>
				>();
			});

			it("should have correct output type", () => {
				expectTypeOf<
					v.InferOutput<typeof RollupDateSchema>
				>().toEqualTypeOf<Date>();
			});
		});

		describe("parsing", () => {
			it("should parse rollup date property and convert to Date object", () => {
				const result = v.parse(RollupDateSchema, {
					rollup: {
						function: "latest_date",
						type: "date",
						date: {
							start: "2024-01-15T00:00:00.000Z",
							end: null,
							time_zone: null,
						},
					},
				} satisfies RollupDateType);

				expect(result instanceof Date).toBe(true);
				expect(result.toISOString()).toBe("2024-01-15T00:00:00.000Z");
			});

			it("should reject null for non-nullable rollup date schema", () => {
				expect(
					v.safeParse(RollupDateSchema, {
						rollup: {
							function: "latest_date",
							type: "date",
							date: null,
						},
					} satisfies NullableRollupDateType).success,
				).toBe(false);
			});
		});
	});

	describe("NullableRollupDateSchema", () => {
		describe("type checking", () => {
			it("should accept rollup date property or null input type", () => {
				expectTypeOf<NullableRollupDateType>().toExtend<
					v.InferInput<typeof NullableRollupDateSchema>
				>();
			});

			it("should have correct output type", () => {
				expectTypeOf<
					v.InferOutput<typeof NullableRollupDateSchema>
				>().toEqualTypeOf<Date | null>();
			});
		});

		describe("parsing", () => {
			it("should parse rollup date property and convert to Date object", () => {
				const result = v.parse(NullableRollupDateSchema, {
					rollup: {
						function: "latest_date",
						type: "date",
						date: {
							start: "2024-01-15T00:00:00.000Z",
							end: null,
							time_zone: null,
						},
					},
				} satisfies NullableRollupDateType);

				expect(result instanceof Date).toBe(true);
				expect(result?.toISOString()).toBe("2024-01-15T00:00:00.000Z");
			});

			it("should parse null rollup date property and return null", () => {
				expect(
					v.parse(NullableRollupDateSchema, {
						rollup: {
							function: "latest_date",
							type: "date",
							date: null,
						},
					} satisfies NullableRollupDateType),
				).toBe(null);
			});
		});
	});

	describe("RollupArraySchema", () => {
		describe("type checking", () => {
			it("should accept rollup array property input type", () => {
				const Schema = RollupArraySchema(
					v.object({
						type: v.string(),
					}),
				);

				expectTypeOf<RollupArrayType>().toExtend<v.InferInput<typeof Schema>>();
			});

			it("should have correct output type for string array", () => {
				const Schema = RollupArraySchema(
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
				const Schema = RollupArraySchema(
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
				const Schema = RollupArraySchema(
					v.pipe(
						v.object({
							type: v.literal("number"),
							number: v.number(),
						}),
						v.transform((v) => v.number),
					),
				);
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
				const Schema = RollupArraySchema(
					v.object({
						type: v.literal("number"),
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
				const Schema = RollupArraySchema(
					v.object({
						type: v.literal("string"),
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
