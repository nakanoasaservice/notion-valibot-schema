import * as v from "valibot";
import { describe, expect, expectTypeOf, it } from "vitest";

import { CreatedTimeSchema } from "./created-time.ts";
import type { SelectNotionProperty } from "./test-utils.ts";

type TargetType = SelectNotionProperty<"created_time">;

describe("created-time", () => {
	describe("CreatedTimeSchema", () => {
		describe("type checking", () => {
			it("should accept created_time property input type", () => {
				expectTypeOf<TargetType>().toExtend<
					v.InferInput<typeof CreatedTimeSchema>
				>();
			});

			it("should have correct output type", () => {
				expectTypeOf<
					v.InferOutput<typeof CreatedTimeSchema>
				>().toEqualTypeOf<Date>();
			});
		});

		describe("parsing", () => {
			it("should parse created_time property and convert to Date object", () => {
				const result = v.parse(CreatedTimeSchema, {
					created_time: "2024-01-15T00:00:00.000Z",
				} satisfies TargetType);

				expect(result instanceof Date).toBe(true);
				expect(result.toISOString()).toBe("2024-01-15T00:00:00.000Z");
			});
		});
	});
});
