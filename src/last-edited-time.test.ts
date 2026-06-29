import * as v from "valibot";
import { describe, expect, expectTypeOf, it } from "vitest";

import { LastEditedTimeSchema } from "./last-edited-time.ts";
import type {
	PartialNotionPropertyValue,
	SelectNotionProperty,
} from "./test-utils.ts";

type TargetType = SelectNotionProperty<"last_edited_time">;

describe("last-edited-time", () => {
	describe("LastEditedTimeSchema", () => {
		describe("type checking", () => {
			it("should accept last_edited_time property input type", () => {
				expectTypeOf<TargetType>().toExtend<
					v.InferInput<typeof LastEditedTimeSchema>
				>();
			});

			it("should have correct output type", () => {
				expectTypeOf<
					v.InferOutput<typeof LastEditedTimeSchema>
				>().toEqualTypeOf<Date>();
			});
		});

		describe("parsing", () => {
			it("should parse last_edited_time property and convert to Date object", () => {
				const result = v.parse(LastEditedTimeSchema, {
					last_edited_time: "2024-01-15T00:00:00.000Z",
				} satisfies TargetType);

				expect(result instanceof Date).toBe(true);
				expect(result.toISOString()).toBe("2024-01-15T00:00:00.000Z");
			});
		});

		describe("partial response", () => {
			describe("type checking", () => {
				it("should accept partial Notion property value", () => {
					expectTypeOf<
						PartialNotionPropertyValue<"last_edited_time">
					>().toExtend<v.InferInput<typeof LastEditedTimeSchema>>();
				});
			});

			describe("parsing", () => {
				it("should parse partial Notion property value", () => {
					const result = v.parse(LastEditedTimeSchema, {
						last_edited_time: "2024-01-15T00:00:00.000Z",
					} satisfies PartialNotionPropertyValue<"last_edited_time">);

					expect(result.toISOString()).toBe("2024-01-15T00:00:00.000Z");
				});
			});
		});
	});
});
