import * as v from "valibot";
import { describe, expect, expectTypeOf, it } from "vitest";

import { NullableSelectSchema, SelectSchema } from "./select.ts";
import type { NonNullableValues, SelectNotionProperty } from "./test-utils.ts";

type TargetType = SelectNotionProperty<"select">;

describe("select", () => {
	describe("SelectSchema", () => {
		describe("type checking", () => {
			it("should accept non-nullable select property input type", () => {
				const Schema = SelectSchema(v.string());

				expectTypeOf<NonNullableValues<TargetType>>().toExtend<
					v.InferInput<typeof Schema>
				>();
			});

			it("should have correct output type", () => {
				const Schema = SelectSchema(v.string());

				expectTypeOf<v.InferOutput<typeof Schema>>().toEqualTypeOf<string>();
			});
		});

		describe("parsing", () => {
			it("should parse select property and extract name value", () => {
				const Schema = SelectSchema(v.picklist(["Green", "Red", "Blue"]));

				expect(
					v.parse(Schema, {
						select: { id: "123", color: "green", name: "Green" },
					} satisfies TargetType),
				).toEqual("Green");
			});

			it("should reject null for non-nullable select schema", () => {
				const Schema = SelectSchema(v.string());

				expect(
					v.safeParse(Schema, { select: null } satisfies TargetType).success,
				).toBe(false);
			});
		});
	});

	describe("NullableSelectSchema", () => {
		describe("type checking", () => {
			it("should accept select property or null input type", () => {
				const Schema = NullableSelectSchema(v.string());
				expectTypeOf<TargetType>().toExtend<v.InferInput<typeof Schema>>();
			});

			it("should have correct output type", () => {
				const Schema = NullableSelectSchema(v.string());

				expectTypeOf<v.InferOutput<typeof Schema>>().toEqualTypeOf<
					string | null
				>();
			});
		});

		describe("parsing", () => {
			it("should parse select property and return name value", () => {
				const Schema = NullableSelectSchema(
					v.picklist(["Green", "Red", "Blue"]),
				);

				expect(
					v.parse(Schema, {
						select: { id: "123", color: "green", name: "Green" },
					} satisfies TargetType),
				).toEqual("Green");
			});

			it("should parse null select property and return null", () => {
				const Schema = NullableSelectSchema(
					v.picklist(["Green", "Red", "Blue"]),
				);

				expect(v.parse(Schema, { select: null } satisfies TargetType)).toBe(
					null,
				);
			});
		});
	});
});
