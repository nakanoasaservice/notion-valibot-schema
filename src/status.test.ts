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
        const Schema = StatusSchema(v.string());

        assertType<
          Extends<
            NonNullableValues<TargetType>,
            v.InferInput<typeof Schema>
          >
        >(true);
      });

      it("should have correct output type", () => {
        const Schema = StatusSchema(v.string());

        assertType<IsExact<v.InferOutput<typeof Schema>, string>>(true);
      });
    });

    describe("parsing", () => {
      it("should parse status property and extract name value", () => {
        const Schema = StatusSchema(
          v.picklist(["Done", "In Progress", "Todo"]),
        );

        assertEquals(
          v.parse(
            Schema,
            {
              status: {
                id: "123",
                name: "Done",
                color: "green",
              },
            } satisfies TargetType,
          ),
          "Done",
        );
      });

      it("should reject null for non-nullable status schema", () => {
        const Schema = StatusSchema(v.string());

        assertEquals(
          v.safeParse(Schema, { status: null } satisfies TargetType).success,
          false,
        );
      });
    });
  });

  describe("NullableStatusSchema", () => {
    describe("type checking", () => {
      it("should accept status property or null input type", () => {
        const Schema = NullableStatusSchema(v.string());
        assertType<
          Extends<
            TargetType,
            v.InferInput<typeof Schema>
          >
        >(true);
      });

      it("should have correct output type", () => {
        const Schema = NullableStatusSchema(v.string());

        assertType<
          IsExact<
            v.InferOutput<typeof Schema>,
            string | null
          >
        >(true);
      });
    });

    describe("parsing", () => {
      it("should parse status property and return name value", () => {
        const Schema = NullableStatusSchema(
          v.picklist(["Done", "In Progress", "Todo"]),
        );

        assertEquals(
          v.parse(
            Schema,
            {
              status: {
                id: "123",
                name: "Done",
                color: "green",
              },
            } satisfies TargetType,
          ),
          "Done",
        );
      });

      it("should parse null status property and return null", () => {
        const Schema = NullableStatusSchema(
          v.picklist(["Done", "In Progress", "Todo"]),
        );

        assertEquals(
          v.parse(Schema, { status: null } satisfies TargetType),
          null,
        );
      });
    });
  });
});
