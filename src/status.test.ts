import * as v from "valibot";
import { describe, expect, expectTypeOf, it } from "vitest";

import { NullableStatusSchema, StatusSchema } from "./status.ts";
import type {
	NonemptyPartialNotionPropertyValue,
	NonNullableValues,
	PartialNotionPropertyValue,
	SelectNotionProperty,
} from "./test-utils.ts";

type TargetType = SelectNotionProperty<"status">;

describe("status", () => {
	describe("StatusSchema", () => {
		describe("type checking", () => {
			it("should accept non-nullable status property input type", () => {
				const Schema = StatusSchema(v.string());

				expectTypeOf<NonNullableValues<TargetType>>().toExtend<
					v.InferInput<typeof Schema>
				>();
			});

			it("should have correct output type", () => {
				const Schema = StatusSchema(v.string());

				expectTypeOf<v.InferOutput<typeof Schema>>().toEqualTypeOf<string>();
			});
		});

		describe("parsing", () => {
			it("should parse status property and extract name value", () => {
				const Schema = StatusSchema(
					v.picklist(["Done", "In Progress", "Todo"]),
				);

				expect(
					v.parse(Schema, {
						status: {
							id: "123",
							name: "Done",
							color: "green",
						},
					} satisfies TargetType),
				).toEqual("Done");
			});

			it("should reject null for non-nullable status schema", () => {
				const Schema = StatusSchema(v.string());

				expect(
					v.safeParse(Schema, { status: null } satisfies TargetType).success,
				).toBe(false);
			});
		});

		describe("partial response", () => {
			describe("type checking", () => {
				it("should accept partial Notion property value", () => {
					const Schema = StatusSchema(v.string());

					expectTypeOf<NonemptyPartialNotionPropertyValue<"status">>().toExtend<
						v.InferInput<typeof Schema>
					>();
				});
			});

			describe("parsing", () => {
				it("should parse partial Notion property value", () => {
					const Schema = StatusSchema(
						v.picklist(["Done", "In Progress", "Todo"]),
					);

					expect(
						v.parse(Schema, {
							status: { id: "123", name: "Done", color: "green" },
						} satisfies NonemptyPartialNotionPropertyValue<"status">),
					).toEqual("Done");
				});
			});
		});
	});

	describe("NullableStatusSchema", () => {
		describe("type checking", () => {
			it("should accept status property or null input type", () => {
				const Schema = NullableStatusSchema(v.string());
				expectTypeOf<TargetType>().toExtend<v.InferInput<typeof Schema>>();
			});

			it("should have correct output type", () => {
				const Schema = NullableStatusSchema(v.string());

				expectTypeOf<v.InferOutput<typeof Schema>>().toEqualTypeOf<
					string | null
				>();
			});
		});

		describe("parsing", () => {
			it("should parse status property and return name value", () => {
				const Schema = NullableStatusSchema(
					v.picklist(["Done", "In Progress", "Todo"]),
				);

				expect(
					v.parse(Schema, {
						status: {
							id: "123",
							name: "Done",
							color: "green",
						},
					} satisfies TargetType),
				).toEqual("Done");
			});

			it("should parse null status property and return null", () => {
				const Schema = NullableStatusSchema(
					v.picklist(["Done", "In Progress", "Todo"]),
				);

				expect(v.parse(Schema, { status: null } satisfies TargetType)).toBe(
					null,
				);
			});
		});

		describe("partial response", () => {
			describe("type checking", () => {
				it("should accept partial Notion property value", () => {
					const Schema = NullableStatusSchema(v.string());

					expectTypeOf<PartialNotionPropertyValue<"status">>().toExtend<
						v.InferInput<typeof Schema>
					>();
				});
			});

			describe("parsing", () => {
				it("should parse partial Notion property value", () => {
					const Schema = NullableStatusSchema(
						v.picklist(["Done", "In Progress", "Todo"]),
					);

					expect(
						v.parse(Schema, {
							status: null,
						} satisfies PartialNotionPropertyValue<"status">),
					).toBe(null);
				});
			});
		});
	});
});
