import * as v from "valibot";
import { describe, expect, expectTypeOf, it } from "vitest";

import { EmailSchema, NullableEmailSchema } from "./email.ts";
import type { NonNullableValues, SelectNotionProperty } from "./test-utils.ts";

type TargetType = SelectNotionProperty<"email">;

describe("email", () => {
	describe("EmailSchema", () => {
		describe("type checking", () => {
			it("should accept non-nullable email property input type", () => {
				expectTypeOf<NonNullableValues<TargetType>>().toExtend<
					v.InferInput<typeof EmailSchema>
				>();
			});

			it("should have correct output type", () => {
				expectTypeOf<
					v.InferOutput<typeof EmailSchema>
				>().toEqualTypeOf<string>();
			});
		});

		describe("parsing", () => {
			it("should parse email property and extract email value", () => {
				const result = v.parse(EmailSchema, {
					email: "test@example.com",
				} satisfies TargetType);

				expect(result).toEqual("test@example.com");
				expect(typeof result).toEqual("string");
			});

			it("should reject null for non-nullable email schema", () => {
				expect(
					v.safeParse(EmailSchema, { email: null } satisfies TargetType)
						.success,
				).toBe(false);
			});
		});
	});

	describe("NullableEmailSchema", () => {
		describe("type checking", () => {
			it("should accept email property or null input type", () => {
				expectTypeOf<TargetType>().toExtend<
					v.InferInput<typeof NullableEmailSchema>
				>();
			});

			it("should have correct output type", () => {
				expectTypeOf<v.InferOutput<typeof NullableEmailSchema>>().toEqualTypeOf<
					string | null
				>();
			});
		});

		describe("parsing", () => {
			it("should parse email property and return email value", () => {
				const result = v.parse(NullableEmailSchema, {
					email: "test@example.com",
				} satisfies TargetType);

				expect(result).toEqual("test@example.com");
				expect(typeof result).toEqual("string");
			});

			it("should parse null email property and return null", () => {
				expect(
					v.parse(NullableEmailSchema, { email: null } satisfies TargetType),
				).toBe(null);
			});
		});
	});
});
