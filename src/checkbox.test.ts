import { assertEquals } from "@std/assert/equals";
import { describe, it } from "@std/testing/bdd";
import { assertType, type IsExact } from "@std/testing/types";
import * as v from "valibot";

import { CheckboxSchema } from "./checkbox.ts";
import type { Extends, SelectNotionProperty } from "./test-utils.ts";

type TargetType = SelectNotionProperty<"checkbox">;

describe("checkbox", () => {
	describe("CheckboxSchema", () => {
		describe("type checking", () => {
			it("should accept checkbox property input type", () => {
				assertType<Extends<TargetType, v.InferInput<typeof CheckboxSchema>>>(
					true,
				);
			});

			it("should have correct output type", () => {
				assertType<IsExact<v.InferOutput<typeof CheckboxSchema>, boolean>>(
					true,
				);
			});
		});

		describe("parsing", () => {
			it("should parse checkbox property and return boolean value", () => {
				const result = v.parse(CheckboxSchema, {
					checkbox: true,
				} satisfies TargetType);

				assertEquals(result, true);
				assertEquals(typeof result, "boolean");
			});

			it("should parse false checkbox property", () => {
				const result = v.parse(CheckboxSchema, {
					checkbox: false,
				} satisfies TargetType);

				assertEquals(result, false);
				assertEquals(typeof result, "boolean");
			});
		});
	});
});
