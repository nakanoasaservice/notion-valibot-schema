import * as v from "valibot";
import { describe, expect, expectTypeOf, it } from "vitest";

import {
	DateRangeSchema,
	DateSchema,
	NullableDateRangeSchema,
	NullableDateSchema,
} from "./date.ts";
import type { NonNullableValues, SelectNotionProperty } from "./test-utils.ts";

type TargetType = SelectNotionProperty<"date">;

describe("date", () => {
	describe("DateSchema", () => {
		describe("type checking", () => {
			it("should accept non-nullable date property input type", () => {
				expectTypeOf<NonNullableValues<TargetType>>().toExtend<
					v.InferInput<typeof DateSchema>
				>();
			});

			it("should have correct output type", () => {
				expectTypeOf<v.InferOutput<typeof DateSchema>>().toEqualTypeOf<Date>();
			});
		});

		describe("parsing", () => {
			it("should parse date property and convert to Date object", () => {
				const result = v.parse(DateSchema, {
					date: {
						start: "2024-01-15T00:00:00.000Z",
						end: null,
						time_zone: null,
					},
				} satisfies TargetType);

				expect(result instanceof Date).toBe(true);
				expect(result.toISOString()).toBe("2024-01-15T00:00:00.000Z");
			});

			it("should reject null for non-nullable date schema", () => {
				expect(
					v.safeParse(DateSchema, { date: null } satisfies TargetType).success,
				).toBe(false);
			});
		});
	});

	describe("NullableDateSchema", () => {
		describe("type checking", () => {
			it("should accept date property or null input type", () => {
				expectTypeOf<TargetType>().toExtend<
					v.InferInput<typeof NullableDateSchema>
				>();
			});

			it("should have correct output type", () => {
				expectTypeOf<
					v.InferOutput<typeof NullableDateSchema>
				>().toEqualTypeOf<Date | null>();
			});
		});

		describe("parsing", () => {
			it("should parse date property and convert to Date object", () => {
				const result = v.parse(NullableDateSchema, {
					date: {
						start: "2024-01-15T00:00:00.000Z",
						end: null,
						time_zone: null,
					},
				} satisfies TargetType);

				expect(result instanceof Date).toBe(true);
				expect(result?.toISOString()).toBe("2024-01-15T00:00:00.000Z");
			});

			it("should parse null date property and return null", () => {
				expect(
					v.parse(NullableDateSchema, { date: null } satisfies TargetType),
				).toBe(null);
			});
		});
	});

	describe("DateRangeSchema", () => {
		describe("type checking", () => {
			it("should accept non-nullable date property input type", () => {
				expectTypeOf<NonNullableValues<TargetType>>().toExtend<
					v.InferInput<typeof DateRangeSchema>
				>();
			});

			it("should have correct output type", () => {
				expectTypeOf<v.InferOutput<typeof DateRangeSchema>>().toEqualTypeOf<{
					start: Date;
					end: Date | null;
					time_zone: string | null;
				}>();
			});
		});

		describe("parsing", () => {
			it("should parse full date property and convert to Date objects", () => {
				const result = v.parse(DateRangeSchema, {
					date: {
						start: "2024-01-15T00:00:00.000Z",
						end: "2024-01-20T00:00:00.000Z",
						time_zone: null,
					},
				} satisfies TargetType);

				expect(result.start instanceof Date).toBe(true);
				expect(result.end instanceof Date).toBe(true);
				expect(result.start.toISOString()).toBe("2024-01-15T00:00:00.000Z");
				expect(result.end?.toISOString()).toBe("2024-01-20T00:00:00.000Z");
				expect(result.time_zone).toBe(null);
			});

			it("should parse date property with null end date", () => {
				const result = v.parse(DateRangeSchema, {
					date: {
						start: "2024-01-15T00:00:00.000Z",
						end: null,
						time_zone: null,
					},
				} satisfies TargetType);

				expect(result.start instanceof Date).toBe(true);
				expect(result.end).toBe(null);
				expect(result.start.toISOString()).toBe("2024-01-15T00:00:00.000Z");
			});

			it("should reject null for non-nullable date range schema", () => {
				expect(
					v.safeParse(DateRangeSchema, {
						date: null,
					} satisfies TargetType).success,
				).toBe(false);
			});
		});
	});

	describe("NullableDateRangeSchema", () => {
		describe("type checking", () => {
			it("should accept date property or null input type", () => {
				expectTypeOf<TargetType>().toExtend<
					v.InferInput<typeof NullableDateRangeSchema>
				>();
			});

			it("should have correct output type", () => {
				expectTypeOf<
					v.InferOutput<typeof NullableDateRangeSchema>
				>().toEqualTypeOf<{
					start: Date;
					end: Date | null;
					time_zone: string | null;
				} | null>();
			});
		});

		describe("parsing", () => {
			it("should parse full date property with both start and end dates", () => {
				const result = v.parse(NullableDateRangeSchema, {
					date: {
						start: "2024-01-15T00:00:00.000Z",
						end: "2024-01-20T00:00:00.000Z",
						time_zone: null,
					},
				} satisfies TargetType);

				expect(result?.start instanceof Date).toBe(true);
				expect(result?.end instanceof Date).toBe(true);
				expect(result?.start.toISOString()).toBe("2024-01-15T00:00:00.000Z");
				expect(result?.end?.toISOString()).toBe("2024-01-20T00:00:00.000Z");
				expect(result?.time_zone).toBe(null);
			});

			it("should parse date property with null end date", () => {
				const result = v.parse(NullableDateRangeSchema, {
					date: {
						start: "2024-01-15T00:00:00.000Z",
						end: null,
						time_zone: null,
					},
				} satisfies TargetType);

				expect(result?.start instanceof Date).toBe(true);
				expect(result?.end).toBe(null);
				expect(result?.start.toISOString()).toBe("2024-01-15T00:00:00.000Z");
				expect(result?.time_zone).toBe(null);
			});

			it("should parse null date property and return null", () => {
				expect(
					v.parse(NullableDateRangeSchema, { date: null } satisfies TargetType),
				).toBe(null);
			});
		});
	});
});
