import { assertEquals } from "@std/assert/equals";
import { describe, it } from "@std/testing/bdd";
import { assertType, type IsExact } from "@std/testing/types";
import * as v from "valibot";

import { NullableNumberSchema, NumberSchema } from "./number.ts";
import type {
	Extends,
	NonNullableValues,
	SelectNotionProperty,
} from "./test-utils.ts";

type TargetType = SelectNotionProperty<"number">;

describe("number", () => {
	describe("NumberSchema", () => {
		describe("type checking", () => {
			it("should accept non-nullable number property input type", () => {
				assertType<
					Extends<
						NonNullableValues<TargetType>,
						v.InferInput<typeof NumberSchema>
					>
				>(true);
			});

			it("should have correct output type", () => {
				assertType<IsExact<v.InferOutput<typeof NumberSchema>, number>>(true);
			});
		});

		describe("parsing", () => {
			it("should parse number property and extract number value", () => {
				const result = v.parse(NumberSchema, {
					number: 42,
				} satisfies TargetType);

				assertEquals(result, 42);
				assertEquals(typeof result, "number");
			});

			it("should reject null for non-nullable number schema", () => {
				assertEquals(
					v.safeParse(NumberSchema, { number: null } satisfies TargetType)
						.success,
					false,
				);
			});
		});
	});

	describe("NullableNumberSchema", () => {
		describe("type checking", () => {
			it("should accept number property or null input type", () => {
				assertType<
					Extends<TargetType, v.InferInput<typeof NullableNumberSchema>>
				>(true);
			});

			it("should have correct output type", () => {
				assertType<
					IsExact<v.InferOutput<typeof NullableNumberSchema>, number | null>
				>(true);
			});
		});

		describe("parsing", () => {
			it("should parse number property and return number value", () => {
				const result = v.parse(NullableNumberSchema, {
					number: 42,
				} satisfies TargetType);

				assertEquals(result, 42);
				assertEquals(typeof result, "number");
			});

			it("should parse null number property and return null", () => {
				assertEquals(
					v.parse(NullableNumberSchema, { number: null } satisfies TargetType),
					null,
				);
			});
		});
	});
});
