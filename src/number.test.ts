import * as v from "valibot";
import { describe, expect, expectTypeOf, it } from "vitest";

import { NullableNumberSchema, NumberSchema } from "./number.ts";
import type { NonNullableValues, SelectNotionProperty } from "./test-utils.ts";

type TargetType = SelectNotionProperty<"number">;

describe("number", () => {
	describe("NumberSchema", () => {
		describe("type checking", () => {
			it("should accept non-nullable number property input type", () => {
				expectTypeOf<NonNullableValues<TargetType>>().toExtend<
					v.InferInput<typeof NumberSchema>
				>();
			});

			it("should have correct output type", () => {
				expectTypeOf<
					v.InferOutput<typeof NumberSchema>
				>().toEqualTypeOf<number>();
			});
		});

		describe("parsing", () => {
			it("should parse number property and extract number value", () => {
				const result = v.parse(NumberSchema, {
					number: 42,
				} satisfies TargetType);

				expect(result).toEqual(42);
				expect(typeof result).toEqual("number");
			});

			it("should reject null for non-nullable number schema", () => {
				expect(
					v.safeParse(NumberSchema, { number: null } satisfies TargetType)
						.success,
				).toBe(false);
			});
		});
	});

	describe("NullableNumberSchema", () => {
		describe("type checking", () => {
			it("should accept number property or null input type", () => {
				expectTypeOf<TargetType>().toExtend<
					v.InferInput<typeof NullableNumberSchema>
				>();
			});

			it("should have correct output type", () => {
				expectTypeOf<
					v.InferOutput<typeof NullableNumberSchema>
				>().toEqualTypeOf<number | null>();
			});
		});

		describe("parsing", () => {
			it("should parse number property and return number value", () => {
				const result = v.parse(NullableNumberSchema, {
					number: 42,
				} satisfies TargetType);

				expect(result).toEqual(42);
				expect(typeof result).toEqual("number");
			});

			it("should parse null number property and return null", () => {
				expect(
					v.parse(NullableNumberSchema, { number: null } satisfies TargetType),
				).toBe(null);
			});
		});
	});
});
