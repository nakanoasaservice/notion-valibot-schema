import { describe, it } from "@std/testing/bdd";
import { assertType, type IsExact } from "@std/testing/types";
import * as v from "valibot";
import { NullableStatusSchema, StatusSchema } from "./status.ts";
import type {
  Extends,
  NonNullableValues,
  SelectNotionProperty,
} from "./test-utils.ts";
import { assertEquals } from "@std/assert/equals";

type TargetType = SelectNotionProperty<"status">;

describe("status", () => {
  describe("StatusSchema", () => {
    describe("type checking", () => {
      it("should accept non-nullable status property input type", () => {
        assertType<
          Extends<
            NonNullableValues<TargetType>,
            v.InferInput<typeof StatusSchema>
          >
        >(true);
      });

      it("should have correct output type", () => {
        assertType<IsExact<v.InferOutput<typeof StatusSchema>, string>>(true);
      });
    });

    describe("parsing", () => {
      it("should parse status property and extract name value", () => {
        const result = v.parse(
          StatusSchema,
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

      it("should reject null for non-nullable status schema", () => {
        assertEquals(
          v.safeParse(StatusSchema, { status: null } satisfies TargetType)
            .success,
          false,
        );
      });
    });
  });

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
