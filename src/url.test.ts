import { assertEquals } from "@std/assert/equals";
import { describe, it } from "@std/testing/bdd";
import { assertType, type IsExact } from "@std/testing/types";
import * as v from "valibot";

import type {
	Extends,
	NonNullableValues,
	SelectNotionProperty,
} from "./test-utils.ts";
import { NullableUrlSchema, UrlSchema } from "./url.ts";

type TargetType = SelectNotionProperty<"url">;

describe("url", () => {
	describe("UrlSchema", () => {
		describe("type checking", () => {
			it("should accept non-nullable url property input type", () => {
				assertType<
					Extends<NonNullableValues<TargetType>, v.InferInput<typeof UrlSchema>>
				>(true);
			});

			it("should have correct output type", () => {
				assertType<IsExact<v.InferOutput<typeof UrlSchema>, string>>(true);
			});
		});

		describe("parsing", () => {
			it("should parse url property and extract url value", () => {
				const result = v.parse(UrlSchema, {
					url: "https://example.com",
				} satisfies TargetType);

				assertEquals(result, "https://example.com");
				assertEquals(typeof result, "string");
			});

			it("should reject null for non-nullable url schema", () => {
				assertEquals(
					v.safeParse(UrlSchema, { url: null } satisfies TargetType).success,
					false,
				);
			});
		});
	});

	describe("NullableUrlSchema", () => {
		describe("type checking", () => {
			it("should accept url property or null input type", () => {
				assertType<Extends<TargetType, v.InferInput<typeof NullableUrlSchema>>>(
					true,
				);
			});

			it("should have correct output type", () => {
				assertType<
					IsExact<v.InferOutput<typeof NullableUrlSchema>, string | null>
				>(true);
			});
		});

		describe("parsing", () => {
			it("should parse url property and return url value", () => {
				const result = v.parse(NullableUrlSchema, {
					url: "https://example.com",
				} satisfies TargetType);

				assertEquals(result, "https://example.com");
				assertEquals(typeof result, "string");
			});

			it("should parse null url property and return null", () => {
				assertEquals(
					v.parse(NullableUrlSchema, { url: null } satisfies TargetType),
					null,
				);
			});
		});
	});
});
