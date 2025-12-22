import * as v from "valibot";
import { describe, expect, expectTypeOf, it } from "vitest";

import { RelationSchema } from "./relation.ts";
import type { SelectNotionProperty } from "./test-utils.ts";

type TargetType = SelectNotionProperty<"relation">;

describe("relation", () => {
	describe("RelationSchema", () => {
		describe("type checking", () => {
			it("should accept relation property input type", () => {
				expectTypeOf<TargetType>().toExtend<
					v.InferInput<typeof RelationSchema>
				>();
			});

			it("should have correct output type", () => {
				expectTypeOf<v.InferOutput<typeof RelationSchema>>().toEqualTypeOf<
					string[]
				>();
			});
		});

		describe("parsing", () => {
			it("should parse relation property and extract id array", () => {
				const result = v.parse(RelationSchema, {
					relation: [
						{
							id: "page-1",
						},
						{
							id: "page-2",
						},
					],
				} satisfies TargetType);

				expect(result.length).toBe(2);
				expect(result[0]).toBe("page-1");
				expect(result[1]).toBe("page-2");
				expect(typeof result[0]).toBe("string");
				expect(typeof result[1]).toBe("string");
			});

			it("should parse empty relation array", () => {
				const result = v.parse(RelationSchema, {
					relation: [],
				} satisfies TargetType);

				expect(result).toEqual([]);
				expect(result.length).toBe(0);
			});
		});
	});
});
