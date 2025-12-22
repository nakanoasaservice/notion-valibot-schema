import * as v from "valibot";
import { describe, expect, expectTypeOf, it } from "vitest";

import type { NonNullableValues, SelectNotionProperty } from "./test-utils.ts";
import { NullableUrlSchema, UrlSchema } from "./url.ts";

type TargetType = SelectNotionProperty<"url">;

describe("url", () => {
	describe("UrlSchema", () => {
		describe("type checking", () => {
			it("should accept non-nullable url property input type", () => {
				expectTypeOf<NonNullableValues<TargetType>>().toExtend<
					v.InferInput<typeof UrlSchema>
				>();
			});

			it("should have correct output type", () => {
				expectTypeOf<v.InferOutput<typeof UrlSchema>>().toEqualTypeOf<string>();
			});
		});

		describe("parsing", () => {
			it("should parse url property and extract url value", () => {
				const result = v.parse(UrlSchema, {
					url: "https://example.com",
				} satisfies TargetType);

				expect(result).toEqual("https://example.com");
				expect(typeof result).toEqual("string");
			});

			it("should reject null for non-nullable url schema", () => {
				expect(
					v.safeParse(UrlSchema, { url: null } satisfies TargetType).success,
				).toBe(false);
			});
		});
	});

	describe("NullableUrlSchema", () => {
		describe("type checking", () => {
			it("should accept url property or null input type", () => {
				expectTypeOf<TargetType>().toExtend<
					v.InferInput<typeof NullableUrlSchema>
				>();
			});

			it("should have correct output type", () => {
				expectTypeOf<v.InferOutput<typeof NullableUrlSchema>>().toEqualTypeOf<
					string | null
				>();
			});
		});

		describe("parsing", () => {
			it("should parse url property and return url value", () => {
				const result = v.parse(NullableUrlSchema, {
					url: "https://example.com",
				} satisfies TargetType);

				expect(result).toEqual("https://example.com");
				expect(typeof result).toEqual("string");
			});

			it("should parse null url property and return null", () => {
				expect(
					v.parse(NullableUrlSchema, { url: null } satisfies TargetType),
				).toBe(null);
			});
		});
	});
});
