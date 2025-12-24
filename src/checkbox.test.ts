import * as v from "valibot";
import { describe, expect, expectTypeOf, it } from "vitest";

import { CheckboxSchema } from "./checkbox.ts";
import type { SelectNotionProperty } from "./test-utils.ts";

type TargetType = SelectNotionProperty<"checkbox">;

describe("checkbox", () => {
	describe("CheckboxSchema", () => {
		describe("type checking", () => {
			it("should accept checkbox property input type", () => {
				expectTypeOf<TargetType>().toExtend<
					v.InferInput<typeof CheckboxSchema>
				>();
			});

			it("should have correct output type", () => {
				expectTypeOf<
					v.InferOutput<typeof CheckboxSchema>
				>().toEqualTypeOf<boolean>();
			});
		});

		describe("parsing", () => {
			it("should parse checkbox property and return boolean value", () => {
				const result = v.parse(CheckboxSchema, {
					checkbox: true,
				} satisfies TargetType);

				expect(result).toEqual(true);
				expect(typeof result).toEqual("boolean");
			});

			it("should parse false checkbox property", () => {
				const result = v.parse(CheckboxSchema, {
					checkbox: false,
				} satisfies TargetType);

				expect(result).toEqual(false);
				expect(typeof result).toEqual("boolean");
			});
		});
	});
});
