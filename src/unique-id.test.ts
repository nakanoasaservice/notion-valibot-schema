import * as v from "valibot";
import { describe, expect, expectTypeOf, it } from "vitest";

import type {
	NonNullableValues,
	PartialNotionPropertyValue,
	SelectNotionProperty,
} from "./test-utils.ts";
import {
	FullUniqueIdSchema,
	PrefixedUniqueIdSchema,
	UniqueIdSchema,
} from "./unique-id.ts";

type TargetType = SelectNotionProperty<"unique_id">;

type PartialUniqueIdNumberPropertyValue = {
	unique_id: {
		number: number;
	};
};

type PartialPrefixedUniqueIdPropertyValue = {
	unique_id: {
		prefix: string;
		number: number;
	};
};

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

		describe("partial response", () => {
			describe("type checking", () => {
				it("should accept partial Notion property value", () => {
					expectTypeOf<PartialUniqueIdNumberPropertyValue>().toExtend<
						v.InferInput<typeof UniqueIdSchema>
					>();
				});
			});

			describe("parsing", () => {
				it("should parse partial Notion property value", () => {
					const result = v.parse(UniqueIdSchema, {
						unique_id: { prefix: null, number: 123 },
					} satisfies PartialUniqueIdNumberPropertyValue & {
						unique_id: { prefix: null };
					});

					expect(result).toBe(123);
				});
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

		describe("partial response", () => {
			describe("type checking", () => {
				it("should accept partial Notion property value", () => {
					expectTypeOf<PartialPrefixedUniqueIdPropertyValue>().toExtend<
						v.InferInput<typeof PrefixedUniqueIdSchema>
					>();
				});
			});

			describe("parsing", () => {
				it("should parse partial Notion property value", () => {
					const result = v.parse(PrefixedUniqueIdSchema, {
						unique_id: { prefix: "PREFIX", number: 123 },
					} satisfies PartialPrefixedUniqueIdPropertyValue);

					expect(result).toBe("PREFIX-123");
				});
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
				expectTypeOf<v.InferOutput<typeof FullUniqueIdSchema>>().toEqualTypeOf<{
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

		describe("partial response", () => {
			describe("type checking", () => {
				it("should accept partial Notion property value", () => {
					expectTypeOf<PartialNotionPropertyValue<"unique_id">>().toExtend<
						v.InferInput<typeof FullUniqueIdSchema>
					>();
				});
			});

			describe("parsing", () => {
				it("should parse partial Notion property value", () => {
					const result = v.parse(FullUniqueIdSchema, {
						unique_id: { prefix: null, number: 123 },
					} satisfies PartialNotionPropertyValue<"unique_id">);

					expect(result.number).toBe(123);
					expect(result.prefix).toBe(null);
				});
			});
		});
	});
});
