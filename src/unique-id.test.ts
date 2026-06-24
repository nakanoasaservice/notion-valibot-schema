import * as v from "valibot";
import { describe, expect, expectTypeOf, it } from "vitest";

import type { NonNullableValues, SelectNotionProperty } from "./test-utils.ts";
import {
	NullableUniqueIdSchema,
	PrefixedUniqueIdStringSchema,
	UniqueIdNumberSchema,
} from "./unique-id.ts";

type TargetType = SelectNotionProperty<"unique_id">;

describe("unique-id", () => {
	describe("UniqueIdNumberSchema", () => {
		describe("type checking", () => {
			it("should accept non-nullable unique_id number property input type", () => {
				expectTypeOf<
					NonNullableValues<TargetType> & { unique_id: { number: number } }
				>().toExtend<v.InferInput<typeof UniqueIdNumberSchema>>();
			});

			it("should have correct output type", () => {
				expectTypeOf<
					v.InferOutput<typeof UniqueIdNumberSchema>
				>().toEqualTypeOf<number>();
			});
		});

		describe("parsing", () => {
			it("should parse unique_id property and extract number value", () => {
				const result = v.parse(UniqueIdNumberSchema, {
					unique_id: {
						prefix: "PREFIX",
						number: 123,
					},
				} satisfies TargetType);

				expect(result).toEqual(123);
				expect(typeof result).toEqual("number");
			});

			it("should reject null for non-nullable unique_id number schema", () => {
				expect(
					v.safeParse(UniqueIdNumberSchema, {
						unique_id: {
							prefix: null,
							number: null,
						},
					} satisfies TargetType).success,
				).toBe(false);
			});
		});
	});

	describe("PrefixedUniqueIdStringSchema", () => {
		describe("type checking", () => {
			it("should accept non-nullable unique_id prefixed property input type", () => {
				expectTypeOf<
					NonNullableValues<TargetType> & {
						unique_id: { prefix: string; number: number };
					}
				>().toExtend<v.InferInput<typeof PrefixedUniqueIdStringSchema>>();
			});

			it("should have correct output type", () => {
				expectTypeOf<
					v.InferOutput<typeof PrefixedUniqueIdStringSchema>
				>().toEqualTypeOf<string>();
			});
		});

		describe("parsing", () => {
			it("should parse unique_id property and return prefixed string", () => {
				const result = v.parse(PrefixedUniqueIdStringSchema, {
					unique_id: {
						prefix: "PREFIX",
						number: 123,
					},
				} satisfies TargetType);

				expect(result).toEqual("PREFIX-123");
				expect(typeof result).toEqual("string");
			});

			it("should reject null for non-nullable unique_id prefixed schema", () => {
				expect(
					v.safeParse(PrefixedUniqueIdStringSchema, {
						unique_id: {
							prefix: null,
							number: null,
						},
					} satisfies TargetType).success,
				).toBe(false);
			});
		});
	});

	describe("NullableUniqueIdSchema", () => {
		describe("type checking", () => {
			it("should accept unique_id property input type", () => {
				expectTypeOf<TargetType>().toExtend<
					v.InferInput<typeof NullableUniqueIdSchema>
				>();
			});

			it("should have correct output type", () => {
				expectTypeOf<
					v.InferOutput<typeof NullableUniqueIdSchema>
				>().toEqualTypeOf<{
					prefix: string | null;
					number: number | null;
				}>();
			});
		});

		describe("parsing", () => {
			it("should parse unique_id property and return unique_id object", () => {
				const result = v.parse(NullableUniqueIdSchema, {
					unique_id: {
						prefix: "PREFIX",
						number: 123,
					},
				} satisfies TargetType);

				expect(result.prefix).toBe("PREFIX");
				expect(result.number).toBe(123);
				expect(typeof result.prefix).toBe("string");
				expect(typeof result.number).toBe("number");
			});

			it("should parse unique_id property with null prefix and number", () => {
				const result = v.parse(NullableUniqueIdSchema, {
					unique_id: {
						prefix: null,
						number: null,
					},
				} satisfies TargetType);

				expect(result.prefix).toBe(null);
				expect(result.number).toBe(null);
			});

			it("should parse unique_id property with prefix only", () => {
				const result = v.parse(NullableUniqueIdSchema, {
					unique_id: {
						prefix: "PREFIX",
						number: null,
					},
				} satisfies TargetType);

				expect(result.prefix).toBe("PREFIX");
				expect(result.number).toBe(null);
			});

			it("should parse unique_id property with number only", () => {
				const result = v.parse(NullableUniqueIdSchema, {
					unique_id: {
						prefix: null,
						number: 456,
					},
				} satisfies TargetType);

				expect(result.prefix).toBe(null);
				expect(result.number).toBe(456);
			});
		});
	});
});
