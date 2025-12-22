import { assertEquals } from "@std/assert/equals";
import { describe, it } from "@std/testing/bdd";
import { assertType, type IsExact } from "@std/testing/types";
import * as v from "valibot";

import { RelationSchema } from "./relation.ts";
import type { Extends, SelectNotionProperty } from "./test-utils.ts";

type TargetType = SelectNotionProperty<"relation">;

describe("relation", () => {
	describe("RelationSchema", () => {
		describe("type checking", () => {
			it("should accept relation property input type", () => {
				assertType<Extends<TargetType, v.InferInput<typeof RelationSchema>>>(
					true,
				);
			});

			it("should have correct output type", () => {
				assertType<IsExact<v.InferOutput<typeof RelationSchema>, string[]>>(
					true,
				);
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

				assertEquals(result.length, 2);
				assertEquals(result[0], "page-1");
				assertEquals(result[1], "page-2");
				assertEquals(typeof result[0], "string");
				assertEquals(typeof result[1], "string");
			});

			it("should parse empty relation array", () => {
				const result = v.parse(RelationSchema, {
					relation: [],
				} satisfies TargetType);

				assertEquals(result, []);
				assertEquals(result.length, 0);
			});
		});
	});
});
