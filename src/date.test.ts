import { assertEquals } from "@std/assert/equals";
import { describe, it } from "@std/testing/bdd";
import { assertType, type IsExact } from "@std/testing/types";
import * as v from "valibot";

import {
	DateSchema,
	FullDateSchema,
	NullableDateSchema,
	NullableFullDateSchema,
} from "./date.ts";
import type {
	Extends,
	NonNullableValues,
	SelectNotionProperty,
} from "./test-utils.ts";

type TargetType = SelectNotionProperty<"date">;

describe("date", () => {
	describe("DateSchema", () => {
		describe("type checking", () => {
			it("should accept non-nullable date property input type", () => {
				assertType<
					Extends<
						NonNullableValues<TargetType>,
						v.InferInput<typeof DateSchema>
					>
				>(true);
			});

			it("should have correct output type", () => {
				assertType<IsExact<v.InferOutput<typeof DateSchema>, Date>>(true);
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

				assertEquals(result instanceof Date, true);
				assertEquals(result.toISOString(), "2024-01-15T00:00:00.000Z");
			});

			it("should reject null for non-nullable date schema", () => {
				assertEquals(
					v.safeParse(DateSchema, { date: null } satisfies TargetType).success,
					false,
				);
			});
		});
	});

	describe("NullableDateSchema", () => {
		describe("type checking", () => {
			it("should accept date property or null input type", () => {
				assertType<
					Extends<TargetType, v.InferInput<typeof NullableDateSchema>>
				>(true);
			});

			it("should have correct output type", () => {
				assertType<
					IsExact<v.InferOutput<typeof NullableDateSchema>, Date | null>
				>(true);
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

				assertEquals(result instanceof Date, true);
				assertEquals(result?.toISOString(), "2024-01-15T00:00:00.000Z");
			});

			it("should parse null date property and return null", () => {
				assertEquals(
					v.parse(NullableDateSchema, { date: null } satisfies TargetType),
					null,
				);
			});
		});
	});

	describe("FullDateSchema", () => {
		describe("type checking", () => {
			it("should have correct output type", () => {
				assertType<
					IsExact<
						v.InferOutput<typeof FullDateSchema>,
						{ start: Date; end: Date }
					>
				>(true);
			});
		});

		describe("parsing", () => {
			it("should parse full date property and convert to Date objects", () => {
				const result = v.parse(FullDateSchema, {
					date: {
						start: "2024-01-15T00:00:00.000Z",
						end: "2024-01-20T00:00:00.000Z",
						time_zone: null,
					},
				} satisfies TargetType);

				assertEquals(result.start instanceof Date, true);
				assertEquals(result.end instanceof Date, true);
				assertEquals(result.start.toISOString(), "2024-01-15T00:00:00.000Z");
				assertEquals(result.end.toISOString(), "2024-01-20T00:00:00.000Z");
			});

			it("should reject null for non-nullable full date schema", () => {
				assertEquals(
					v.safeParse(FullDateSchema, { date: null } satisfies TargetType)
						.success,
					false,
				);
			});
		});
	});

	describe("NullableFullDateSchema", () => {
		describe("type checking", () => {
			it("should accept date property or null input type", () => {
				assertType<
					Extends<TargetType, v.InferInput<typeof NullableFullDateSchema>>
				>(true);
			});

			it("should have correct output type", () => {
				assertType<
					IsExact<
						v.InferOutput<typeof NullableFullDateSchema>,
						{ start: Date; end: Date | null } | null
					>
				>(true);
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

				assertEquals(result?.start instanceof Date, true);
				assertEquals(result?.end instanceof Date, true);
				assertEquals(result?.start.toISOString(), "2024-01-15T00:00:00.000Z");
				assertEquals(result?.end?.toISOString(), "2024-01-20T00:00:00.000Z");
			});

			it("should parse date property with null end date", () => {
				const result = v.parse(NullableFullDateSchema, {
					date: {
						start: "2024-01-15T00:00:00.000Z",
						end: null,
						time_zone: null,
					},
				} satisfies TargetType);

				assertEquals(result?.start instanceof Date, true);
				assertEquals(result?.end, null);
				assertEquals(result?.start.toISOString(), "2024-01-15T00:00:00.000Z");
			});

			it("should parse null date property and return null", () => {
				assertEquals(
					v.parse(NullableFullDateSchema, { date: null } satisfies TargetType),
					null,
				);
			});
		});
	});
});
