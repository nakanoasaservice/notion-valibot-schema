import { describe, it } from "@std/testing/bdd";
import { assertType, type IsExact } from "@std/testing/types";
import * as v from "valibot";
import { NullableSelectSchema, SelectSchema } from "./select.ts";
import type {
  Extends,
  NonNullableValues,
  SelectNotionProperty,
} from "./test-utils.ts";
import { assertEquals } from "@std/assert/equals";

type TargetType = SelectNotionProperty<"select">;

describe("select", () => {
  describe("SelectSchema", () => {
    describe("type checking", () => {
      it("should accept non-nullable select property input type", () => {
        const Schema = SelectSchema(v.string());

        assertType<
          Extends<
            NonNullableValues<TargetType>,
            v.InferInput<typeof Schema>
          >
        >(true);
      });

      it("should have correct output type", () => {
        const Schema = SelectSchema(v.string());

        assertType<IsExact<v.InferOutput<typeof Schema>, string>>(true);
      });
    });

    describe("parsing", () => {
      it("should parse select property and extract name value", () => {
        const Schema = SelectSchema(v.picklist(["Green", "Red", "Blue"]));

        assertEquals(
          v.parse(
            Schema,
            {
              select: { id: "123", color: "green", name: "Green" },
            } satisfies TargetType,
          ),
          "Green",
        );
      });

      it("should reject null for non-nullable select schema", () => {
        const Schema = SelectSchema(v.string());

        assertEquals(
          v.safeParse(Schema, { select: null } satisfies TargetType).success,
          false,
        );
      });
    });
  });

  describe("NullableSelectSchema", () => {
    describe("type checking", () => {
      it("should accept select property or null input type", () => {
        const Schema = NullableSelectSchema(v.string());
        assertType<
          Extends<
            TargetType,
            v.InferInput<typeof Schema>
          >
        >(true);
      });

      it("should have correct output type", () => {
        const Schema = NullableSelectSchema(v.string());

        assertType<IsExact<v.InferOutput<typeof Schema>, string | null>>(true);
      });
    });

    describe("parsing", () => {
      it("should parse select property and return name value", () => {
        const Schema = NullableSelectSchema(
          v.picklist(["Green", "Red", "Blue"]),
        );

        assertEquals(
          v.parse(
            Schema,
            {
              select: { id: "123", color: "green", name: "Green" },
            } satisfies TargetType,
          ),
          "Green",
        );
      });

      it("should parse null select property and return null", () => {
        const Schema = NullableSelectSchema(
          v.picklist(["Green", "Red", "Blue"]),
        );

        assertEquals(
          v.parse(Schema, { select: null } satisfies TargetType),
          null,
        );
      });
    });
  });
});
