import { assertEquals } from "@std/assert/equals";
import { describe, it } from "@std/testing/bdd";
import { assertType, type IsExact } from "@std/testing/types";
import * as v from "valibot";

import { CreatedTimeSchema } from "./created-time.ts";
import type { Extends, SelectNotionProperty } from "./test-utils.ts";

type TargetType = SelectNotionProperty<"created_time">;

describe("created-time", () => {
	describe("CreatedTimeSchema", () => {
		describe("type checking", () => {
			it("should accept created_time property input type", () => {
				assertType<Extends<TargetType, v.InferInput<typeof CreatedTimeSchema>>>(
					true,
				);
			});

			it("should have correct output type", () => {
				assertType<IsExact<v.InferOutput<typeof CreatedTimeSchema>, Date>>(
					true,
				);
			});
		});

		describe("parsing", () => {
			it("should parse created_time property and convert to Date object", () => {
				const result = v.parse(CreatedTimeSchema, {
					created_time: "2024-01-15T00:00:00.000Z",
				} satisfies TargetType);

				assertEquals(result instanceof Date, true);
				assertEquals(result.toISOString(), "2024-01-15T00:00:00.000Z");
			});
		});
	});
});
