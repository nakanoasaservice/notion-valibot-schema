import * as v from "valibot";
import { describe, expect, expectTypeOf, it } from "vitest";

import type { SelectNotionProperty } from "./test-utils.ts";
import { UniqueIdSchema } from "./unique-id.ts";

type TargetType = SelectNotionProperty<"unique_id">;

describe("unique-id", () => {
	describe("UniqueIdSchema", () => {
		describe("type checking", () => {
			it("should accept unique_id property input type", () => {
				expectTypeOf<TargetType>().toExtend<
					v.InferInput<typeof UniqueIdSchema>
				>();
			});

			it("should have correct output type", () => {
				expectTypeOf<v.InferOutput<typeof UniqueIdSchema>>().toEqualTypeOf<{
					prefix: string | null;
					number: number | null;
				}>();
			});
		});

		describe("parsing", () => {
			it("should parse unique_id property and return unique_id object", () => {
				const result = v.parse(UniqueIdSchema, {
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
				const result = v.parse(UniqueIdSchema, {
					unique_id: {
						prefix: null,
						number: null,
					},
				} satisfies TargetType);

				expect(result.prefix).toBe(null);
				expect(result.number).toBe(null);
			});

			it("should parse unique_id property with prefix only", () => {
				const result = v.parse(UniqueIdSchema, {
					unique_id: {
						prefix: "PREFIX",
						number: null,
					},
				} satisfies TargetType);

				expect(result.prefix).toBe("PREFIX");
				expect(result.number).toBe(null);
			});

			it("should parse unique_id property with number only", () => {
				const result = v.parse(UniqueIdSchema, {
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
