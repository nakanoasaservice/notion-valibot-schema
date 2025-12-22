import * as v from "valibot";
import { describe, expect, expectTypeOf, it } from "vitest";

import { MultiSelectSchema } from "./multi-select.ts";
import type { NonNullableValues, SelectNotionProperty } from "./test-utils.ts";

type TargetType = SelectNotionProperty<"multi_select">;

describe("multi-select", () => {
	describe("MultiSelectSchema", () => {
		describe("type checking", () => {
			it("should accept non-nullable multi-select property input type", () => {
				const Schema = MultiSelectSchema(v.string());

				expectTypeOf<NonNullableValues<TargetType>>().toExtend<
					v.InferInput<typeof Schema>
				>();
			});

			it("should have correct output type", () => {
				const Schema = MultiSelectSchema(v.picklist(["Green", "Red", "Blue"]));

				expectTypeOf<v.InferOutput<typeof Schema>>().toEqualTypeOf<
					("Green" | "Red" | "Blue")[]
				>();
			});
		});

		describe("parsing", () => {
			it("should parse multi-select property and extract name values", () => {
				const Schema = MultiSelectSchema(v.picklist(["Green", "Red", "Blue"]));

				expect(
					v.parse(Schema, {
						multi_select: [
							{ id: "123", color: "green", name: "Green" },
							{ id: "456", color: "red", name: "Red" },
						],
					} satisfies TargetType),
				).toEqual(["Green", "Red"]);
			});

			it("should parse empty multi-select array", () => {
				const Schema = MultiSelectSchema(v.picklist(["Green", "Red", "Blue"]));

				expect(
					v.parse(Schema, { multi_select: [] } satisfies TargetType),
				).toEqual([]);
			});

			it("should reject invalid values not in picklist", () => {
				const Schema = MultiSelectSchema(v.picklist(["Green", "Red", "Blue"]));

				expect(
					v.safeParse(Schema, {
						multi_select: [
							{ id: "123", color: "green", name: "Green" },
							{ id: "456", color: "yellow", name: "Yellow" },
						],
					} satisfies TargetType).success,
				).toBe(false);
			});
		});
	});
});
