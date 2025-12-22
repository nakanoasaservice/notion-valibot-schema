import { assertEquals } from "@std/assert/equals";
import { describe, it } from "@std/testing/bdd";
import { assertType, type IsExact } from "@std/testing/types";
import * as v from "valibot";

import type { Extends, SelectNotionProperty } from "./test-utils.ts";
import { UniqueIdSchema } from "./unique-id.ts";

type TargetType = SelectNotionProperty<"unique_id">;

describe("unique-id", () => {
	describe("UniqueIdSchema", () => {
		describe("type checking", () => {
			it("should accept unique_id property input type", () => {
				assertType<Extends<TargetType, v.InferInput<typeof UniqueIdSchema>>>(
					true,
				);
			});

			it("should have correct output type", () => {
				assertType<
					IsExact<
						v.InferOutput<typeof UniqueIdSchema>,
						{ prefix: string | null; number: number | null }
					>
				>(true);
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

				assertEquals(result.prefix, "PREFIX");
				assertEquals(result.number, 123);
				assertEquals(typeof result.prefix, "string");
				assertEquals(typeof result.number, "number");
			});

			it("should parse unique_id property with null prefix and number", () => {
				const result = v.parse(UniqueIdSchema, {
					unique_id: {
						prefix: null,
						number: null,
					},
				} satisfies TargetType);

				assertEquals(result.prefix, null);
				assertEquals(result.number, null);
			});

			it("should parse unique_id property with prefix only", () => {
				const result = v.parse(UniqueIdSchema, {
					unique_id: {
						prefix: "PREFIX",
						number: null,
					},
				} satisfies TargetType);

				assertEquals(result.prefix, "PREFIX");
				assertEquals(result.number, null);
			});

			it("should parse unique_id property with number only", () => {
				const result = v.parse(UniqueIdSchema, {
					unique_id: {
						prefix: null,
						number: 456,
					},
				} satisfies TargetType);

				assertEquals(result.prefix, null);
				assertEquals(result.number, 456);
			});
		});
	});
});
