import { describe, it } from "@std/testing/bdd";
import { assertType, type IsExact } from "@std/testing/types";
import * as v from "valibot";
import { NullableCheckboxSchema } from "./checkbox.ts";
import type { Extends, SelectNotionProperty } from "./test-utils.ts";
import { assertEquals } from "@std/assert/equals";

type TargetType = SelectNotionProperty<"checkbox">;

describe("checkbox", () => {
  describe("NullableCheckboxSchema", () => {
    describe("type checking", () => {
      it("should accept checkbox property input type", () => {
        assertType<
          Extends<
            TargetType,
            v.InferInput<typeof NullableCheckboxSchema>
          >
        >(true);
      });

      it("should have correct output type", () => {
        assertType<
          IsExact<v.InferOutput<typeof NullableCheckboxSchema>, boolean>
        >(true);
      });
    });

    describe("parsing", () => {
      it("should parse checkbox property and return boolean value", () => {
        const result = v.parse(
          NullableCheckboxSchema,
          {
            checkbox: true,
          } satisfies TargetType,
        );

        assertEquals(result, true);
        assertEquals(typeof result, "boolean");
      });

      it("should parse false checkbox property", () => {
        const result = v.parse(
          NullableCheckboxSchema,
          {
            checkbox: false,
          } satisfies TargetType,
        );

        assertEquals(result, false);
        assertEquals(typeof result, "boolean");
      });
    });
  });
});
