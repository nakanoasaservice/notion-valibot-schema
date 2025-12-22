import * as v from "valibot";
import { describe, expect, expectTypeOf, it } from "vitest";

import {
	NullablePhoneNumberSchema,
	PhoneNumberSchema,
} from "./phone-number.ts";
import type { NonNullableValues, SelectNotionProperty } from "./test-utils.ts";

type TargetType = SelectNotionProperty<"phone_number">;

describe("phone-number", () => {
	describe("PhoneNumberSchema", () => {
		describe("type checking", () => {
			it("should accept non-nullable phone_number property input type", () => {
				expectTypeOf<NonNullableValues<TargetType>>().toExtend<
					v.InferInput<typeof PhoneNumberSchema>
				>();
			});

			it("should have correct output type", () => {
				expectTypeOf<
					v.InferOutput<typeof PhoneNumberSchema>
				>().toEqualTypeOf<string>();
			});
		});

		describe("parsing", () => {
			it("should parse phone_number property and extract phone_number value", () => {
				const result = v.parse(PhoneNumberSchema, {
					phone_number: "+81-90-1234-5678",
				} satisfies TargetType);

				expect(result).toEqual("+81-90-1234-5678");
				expect(typeof result).toEqual("string");
			});

			it("should reject null for non-nullable phone_number schema", () => {
				expect(
					v.safeParse(PhoneNumberSchema, {
						phone_number: null,
					} satisfies TargetType).success,
				).toBe(false);
			});
		});
	});

	describe("NullablePhoneNumberSchema", () => {
		describe("type checking", () => {
			it("should accept phone_number property or null input type", () => {
				expectTypeOf<TargetType>().toExtend<
					v.InferInput<typeof NullablePhoneNumberSchema>
				>();
			});

			it("should have correct output type", () => {
				expectTypeOf<
					v.InferOutput<typeof NullablePhoneNumberSchema>
				>().toEqualTypeOf<string | null>();
			});
		});

		describe("parsing", () => {
			it("should parse phone_number property and return phone_number value", () => {
				const result = v.parse(NullablePhoneNumberSchema, {
					phone_number: "+81-90-1234-5678",
				} satisfies TargetType);

				expect(result).toEqual("+81-90-1234-5678");
				expect(typeof result).toEqual("string");
			});

			it("should parse null phone_number property and return null", () => {
				expect(
					v.parse(NullablePhoneNumberSchema, {
						phone_number: null,
					} satisfies TargetType),
				).toBe(null);
			});
		});
	});
});
