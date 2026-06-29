import * as v from "valibot";
import { describe, expect, expectTypeOf, it } from "vitest";

import { NullablePlaceSchema, PlaceSchema } from "./place.ts";
import type {
	NonemptyPartialNotionPropertyValue,
	NonNullableValues,
	PartialNotionPropertyValue,
	SelectNotionProperty,
} from "./test-utils.ts";

type TargetType = SelectNotionProperty<"place">;

describe("place", () => {
	describe("PlaceSchema", () => {
		describe("type checking", () => {
			it("should accept non-nullable place property input type", () => {
				expectTypeOf<NonNullableValues<TargetType>>().toExtend<
					v.InferInput<typeof PlaceSchema>
				>();
			});

			it("should have correct output type", () => {
				expectTypeOf<v.InferOutput<typeof PlaceSchema>>().toEqualTypeOf<{
					lat: number;
					lon: number;
					name?: string | null;
					address?: string | null;
				}>();
			});
		});

		describe("parsing", () => {
			it("should parse place property and extract place value", () => {
				const result = v.parse(PlaceSchema, {
					place: {
						lat: 35.6762,
						lon: 139.6503,
						name: "Tokyo",
						address: "Tokyo, Japan",
					},
				} satisfies TargetType);

				expect(result.lat).toBe(35.6762);
				expect(result.lon).toBe(139.6503);
				expect(result.name).toBe("Tokyo");
				expect(result.address).toBe("Tokyo, Japan");
			});

			it("should parse place property with nullish name and address", () => {
				const result = v.parse(PlaceSchema, {
					place: {
						lat: 35.6762,
						lon: 139.6503,
						name: null,
						address: null,
					},
				} satisfies TargetType);

				expect(result.lat).toBe(35.6762);
				expect(result.lon).toBe(139.6503);
				expect(result.name).toBe(null);
				expect(result.address).toBe(null);
			});

			it("should reject null for non-nullable place schema", () => {
				expect(
					v.safeParse(PlaceSchema, { place: null } satisfies TargetType)
						.success,
				).toBe(false);
			});
		});

		describe("partial response", () => {
			describe("type checking", () => {
				it("should accept partial Notion property value", () => {
					expectTypeOf<NonemptyPartialNotionPropertyValue<"place">>().toExtend<
						v.InferInput<typeof PlaceSchema>
					>();
				});
			});

			describe("parsing", () => {
				it("should parse partial Notion property value", () => {
					const result = v.parse(PlaceSchema, {
						place: { lat: 35.6762, lon: 139.6503 },
					} satisfies NonemptyPartialNotionPropertyValue<"place">);

					expect(result.lat).toBe(35.6762);
					expect(result.lon).toBe(139.6503);
				});
			});
		});
	});

	describe("NullablePlaceSchema", () => {
		describe("type checking", () => {
			it("should accept place property or null input type", () => {
				expectTypeOf<TargetType>().toExtend<
					v.InferInput<typeof NullablePlaceSchema>
				>();
			});

			it("should have correct output type", () => {
				expectTypeOf<
					v.InferOutput<typeof NullablePlaceSchema>
				>().toEqualTypeOf<{
					lat: number;
					lon: number;
					name?: string | null;
					address?: string | null;
				} | null>();
			});
		});

		describe("parsing", () => {
			it("should parse place property and return place value", () => {
				const result = v.parse(NullablePlaceSchema, {
					place: {
						lat: 35.6762,
						lon: 139.6503,
						name: "Tokyo",
						address: "Tokyo, Japan",
					},
				} satisfies TargetType);

				expect(result?.lat).toBe(35.6762);
				expect(result?.lon).toBe(139.6503);
				expect(result?.name).toBe("Tokyo");
				expect(result?.address).toBe("Tokyo, Japan");
			});

			it("should parse null place property and return null", () => {
				expect(
					v.parse(NullablePlaceSchema, { place: null } satisfies TargetType),
				).toBe(null);
			});
		});

		describe("partial response", () => {
			describe("type checking", () => {
				it("should accept partial Notion property value", () => {
					expectTypeOf<PartialNotionPropertyValue<"place">>().toExtend<
						v.InferInput<typeof NullablePlaceSchema>
					>();
				});
			});

			describe("parsing", () => {
				it("should parse partial Notion property value", () => {
					expect(
						v.parse(NullablePlaceSchema, {
							place: null,
						} satisfies PartialNotionPropertyValue<"place">),
					).toBe(null);
				});
			});
		});
	});
});
