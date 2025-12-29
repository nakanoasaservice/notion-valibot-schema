import * as v from "valibot";
import { describe, expect, expectTypeOf, it } from "vitest";

import {
	FullDateSchema,
	NullableFullDateSchema,
	NullableRangeDateSchema,
	NullableSingleDateSchema,
	RangeDateSchema,
	SingleDateSchema,
} from "./date.ts";
import type { NonNullableValues, SelectNotionProperty } from "./test-utils.ts";

type TargetType = SelectNotionProperty<"date">;

describe("date", () => {
	describe("NullableSingleDateSchema", () => {
		describe("type checking", () => {
			it("should accept date property or null input type", () => {
				expectTypeOf<TargetType>().toExtend<
					v.InferInput<typeof NullableSingleDateSchema>
				>();
			});

			it("should have correct output type", () => {
				expectTypeOf<
					v.InferOutput<typeof NullableSingleDateSchema>
				>().toEqualTypeOf<Date | null>();
			});
		});

		describe("parsing", () => {
			it("should parse date property and convert to Date object", () => {
				const result = v.parse(NullableSingleDateSchema, {
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
					v.parse(NullableSingleDateSchema, {
						date: null,
					} satisfies TargetType),
				).toBe(null);
			});
		});
	});

	describe("SingleDateSchema", () => {
		describe("type checking", () => {
			it("should accept non-nullable date property input type", () => {
				expectTypeOf<NonNullableValues<TargetType>>().toExtend<
					v.InferInput<typeof SingleDateSchema>
				>();
			});

			it("should have correct output type", () => {
				expectTypeOf<
					v.InferOutput<typeof SingleDateSchema>
				>().toEqualTypeOf<Date>();
			});
		});

		describe("parsing", () => {
			it("should parse date property and convert to Date object", () => {
				const result = v.parse(SingleDateSchema, {
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
					v.safeParse(SingleDateSchema, { date: null } satisfies TargetType)
						.success,
				).toBe(false);
			});
		});
	});

	describe("NullableRangeDateSchema", () => {
		describe("type checking", () => {
			it("should accept date property or null input type", () => {
				expectTypeOf<TargetType & { date: { end: string } | null }>().toExtend<
					v.InferInput<typeof NullableRangeDateSchema>
				>();
			});

			it("should have correct output type", () => {
				expectTypeOf<
					v.InferOutput<typeof NullableRangeDateSchema>
				>().toEqualTypeOf<{
					start: Date;
					end: Date;
					time_zone: string | null;
				} | null>();
			});
		});

		describe("parsing", () => {
			it("should parse full date property with both start and end dates", () => {
				const result = v.parse(NullableRangeDateSchema, {
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

			it("should reject date property with null end date", () => {
				expect(
					v.safeParse(NullableRangeDateSchema, {
						date: {
							start: "2024-01-15T00:00:00.000Z",
							end: null,
							time_zone: null,
						},
					} satisfies TargetType).success,
				).toBe(false);
			});

			it("should parse null date property and return null", () => {
				expect(
					v.parse(NullableRangeDateSchema, { date: null } satisfies TargetType),
				).toBe(null);
			});
		});
	});

	describe("RangeDateSchema", () => {
		describe("type checking", () => {
			it("should accept non-nullable date property input type", () => {
				expectTypeOf<
					NonNullableValues<TargetType> & { date: { end: string } }
				>().toExtend<v.InferInput<typeof RangeDateSchema>>();
			});

			it("should have correct output type", () => {
				expectTypeOf<v.InferOutput<typeof RangeDateSchema>>().toEqualTypeOf<{
					start: Date;
					end: Date;
					time_zone: string | null;
				}>();
			});
		});

		describe("parsing", () => {
			it("should parse full date property and convert to Date objects", () => {
				const result = v.parse(RangeDateSchema, {
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

			it("should reject date property with null end date", () => {
				expect(
					v.safeParse(RangeDateSchema, {
						date: {
							start: "2024-01-15T00:00:00.000Z",
							end: null,
							time_zone: null,
						},
					} satisfies TargetType).success,
				).toBe(false);
			});

			it("should reject null for non-nullable date range schema", () => {
				expect(
					v.safeParse(RangeDateSchema, {
						date: null,
					} satisfies TargetType).success,
				).toBe(false);
			});
		});
	});

	describe("NullableFullDateSchema", () => {
		describe("type checking", () => {
			it("should accept date property or null input type", () => {
				expectTypeOf<TargetType>().toExtend<
					v.InferInput<typeof NullableFullDateSchema>
				>();
			});

			it("should have correct output type", () => {
				expectTypeOf<
					v.InferOutput<typeof NullableFullDateSchema>
				>().toEqualTypeOf<{
					start: Date;
					end: Date | null;
					time_zone: string | null;
				} | null>();
			});
		});

		describe("parsing", () => {
			it("should parse full date property with both start and end dates", () => {
				const result = v.parse(NullableFullDateSchema, {
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
				const result = v.parse(NullableFullDateSchema, {
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
					v.parse(NullableFullDateSchema, { date: null } satisfies TargetType),
				).toBe(null);
			});
		});
	});

	describe("FullDateSchema", () => {
		describe("type checking", () => {
			it("should accept non-nullable date property input type", () => {
				expectTypeOf<NonNullableValues<TargetType>>().toExtend<
					v.InferInput<typeof FullDateSchema>
				>();
			});

			it("should have correct output type", () => {
				expectTypeOf<v.InferOutput<typeof FullDateSchema>>().toEqualTypeOf<{
					start: Date;
					end: Date | null;
					time_zone: string | null;
				}>();
			});
		});

		describe("parsing", () => {
			it("should parse full date property with both start and end dates", () => {
				const result = v.parse(FullDateSchema, {
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
				const result = v.parse(FullDateSchema, {
					date: {
						start: "2024-01-15T00:00:00.000Z",
						end: null,
						time_zone: null,
					},
				} satisfies TargetType);

				expect(result.start instanceof Date).toBe(true);
				expect(result.end).toBe(null);
				expect(result.start.toISOString()).toBe("2024-01-15T00:00:00.000Z");
				expect(result.time_zone).toBe(null);
			});

			it("should reject null for non-nullable date schema", () => {
				expect(
					v.safeParse(FullDateSchema, { date: null } satisfies TargetType)
						.success,
				).toBe(false);
			});
		});
	});
});
