import { describe, it } from "@std/testing/bdd";
import { assertType, type IsExact } from "@std/testing/types";
import * as v from "valibot";
import { NullableStatusSchema } from "./status.ts";
import type { Extends, SelectNotionProperty } from "./test-utils.ts";
import { assertEquals } from "@std/assert/equals";

type TargetType = SelectNotionProperty<"status">;

describe("status", () => {
  describe("NullableStatusSchema", () => {
    describe("type checking", () => {
      it("should accept status property or null input type", () => {
        assertType<
          Extends<
            TargetType,
            v.InferInput<typeof NullableStatusSchema>
          >
        >(true);
      });

      it("should have correct output type", () => {
        assertType<
          IsExact<
            v.InferOutput<typeof NullableStatusSchema>,
            string | undefined
          >
        >(true);
      });
    });

    describe("parsing", () => {
      it("should parse status property and extract name value", () => {
        const result = v.parse(
          NullableStatusSchema,
          {
            status: {
              id: "123",
              name: "Done",
              color: "green",
            },
          } satisfies TargetType,
        );

        assertEquals(result, "Done");
        assertEquals(typeof result, "string");
      });

      it("should parse null status property and return undefined", () => {
        assertEquals(
          v.parse(NullableStatusSchema, { status: null } satisfies TargetType),
          undefined,
        );
      });
    });
  });
});
