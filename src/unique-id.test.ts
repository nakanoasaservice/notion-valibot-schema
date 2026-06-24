import * as v from "valibot";
import { describe, expect, expectTypeOf, it } from "vitest";

import type { NonNullableValues, SelectNotionProperty } from "./test-utils.ts";
import {
	FullUniqueIdSchema,
	PrefixedUniqueIdSchema,
	UniqueIdSchema,
} from "./unique-id.ts";

type TargetType = SelectNotionProperty<"unique_id">;

describe("unique-id", () => {
	describe("UniqueIdSchema", () => {
		describe("type checking", () => {
			it("should accept non-nullable unique_id number property input type", () => {
				expectTypeOf<
					NonNullableValues<TargetType> & { unique_id: { number: number } }
				>().toExtend<v.InferInput<typeof UniqueIdSchema>>();
			});

			it("should have correct output type", () => {
				expectTypeOf<
					v.InferOutput<typeof UniqueIdSchema>
				>().toEqualTypeOf<number>();
			});
		});

		describe("parsing", () => {
			it("should parse unique_id property and extract number value", () => {
				const result = v.parse(UniqueIdSchema, {
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
					v.safeParse(UniqueIdSchema, {
						unique_id: {
							prefix: null,
							number: null,
						},
					} satisfies TargetType).success,
				).toBe(false);
			});
		});
	});

	describe("PrefixedUniqueIdSchema", () => {
		describe("type checking", () => {
			it("should accept non-nullable unique_id prefixed property input type", () => {
				expectTypeOf<
					NonNullableValues<TargetType> & {
						unique_id: { prefix: string; number: number };
					}
				>().toExtend<v.InferInput<typeof PrefixedUniqueIdSchema>>();
			});

			it("should have correct output type", () => {
				expectTypeOf<
					v.InferOutput<typeof PrefixedUniqueIdSchema>
				>().toEqualTypeOf<string>();
			});
		});

		describe("parsing", () => {
			it("should parse unique_id property and return prefixed string", () => {
				const result = v.parse(PrefixedUniqueIdSchema, {
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
					v.safeParse(PrefixedUniqueIdSchema, {
						unique_id: {
							prefix: null,
							number: null,
						},
					} satisfies TargetType).success,
				).toBe(false);
			});
		});
	});

	describe("FullUniqueIdSchema", () => {
		describe("type checking", () => {
			it("should accept unique_id property input type", () => {
				expectTypeOf<TargetType>().toExtend<
					v.InferInput<typeof FullUniqueIdSchema>
				>();
			});

			it("should have correct output type", () => {
				expectTypeOf<
					v.InferOutput<typeof FullUniqueIdSchema>
				>().toEqualTypeOf<{
					prefix: string | null;
					number: number | null;
				}>();
			});
		});

		describe("parsing", () => {
			it("should parse unique_id property and return unique_id object", () => {
				const result = v.parse(FullUniqueIdSchema, {
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
				const result = v.parse(FullUniqueIdSchema, {
					unique_id: {
						prefix: null,
						number: null,
					},
				} satisfies TargetType);

				expect(result.prefix).toBe(null);
				expect(result.number).toBe(null);
			});

			it("should parse unique_id property with prefix only", () => {
				const result = v.parse(FullUniqueIdSchema, {
					unique_id: {
						prefix: "PREFIX",
						number: null,
					},
				} satisfies TargetType);

				expect(result.prefix).toBe("PREFIX");
				expect(result.number).toBe(null);
			});

			it("should parse unique_id property with number only", () => {
				const result = v.parse(FullUniqueIdSchema, {
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
