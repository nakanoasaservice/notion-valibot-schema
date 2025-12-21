import { describe, it } from "@std/testing/bdd";
import { assertType, type IsExact } from "@std/testing/types";
import * as v from "valibot";
import { MultiSelectSchema } from "./multi-select.ts";
import type {
  Extends,
  NonNullableValues,
  SelectNotionProperty,
} from "./test-utils.ts";
import { assertEquals } from "@std/assert/equals";

type TargetType = SelectNotionProperty<"multi_select">;

describe("multi-select", () => {
  describe("MultiSelectSchema", () => {
    describe("type checking", () => {
      it("should accept non-nullable multi-select property input type", () => {
        const Schema = MultiSelectSchema(v.string());

        assertType<
          Extends<
            NonNullableValues<TargetType>,
            v.InferInput<typeof Schema>
          >
        >(true);
      });

      it("should have correct output type", () => {
        const Schema = MultiSelectSchema(v.picklist(["Green", "Red", "Blue"]));

        assertType<
          IsExact<v.InferOutput<typeof Schema>, ("Green" | "Red" | "Blue")[]>
        >(true);
      });
    });

    describe("parsing", () => {
      it("should parse multi-select property and extract name values", () => {
        const Schema = MultiSelectSchema(v.picklist(["Green", "Red", "Blue"]));

        assertEquals(
          v.parse(
            Schema,
            {
              multi_select: [
                { id: "123", color: "green", name: "Green" },
                { id: "456", color: "red", name: "Red" },
              ],
            } satisfies TargetType,
          ),
          ["Green", "Red"],
        );
      });

      it("should parse empty multi-select array", () => {
        const Schema = MultiSelectSchema(v.picklist(["Green", "Red", "Blue"]));

        assertEquals(
          v.parse(Schema, { multi_select: [] } satisfies TargetType),
          [],
        );
      });

      it("should reject invalid values not in picklist", () => {
        const Schema = MultiSelectSchema(v.picklist(["Green", "Red", "Blue"]));

        assertEquals(
          v.safeParse(
            Schema,
            {
              multi_select: [
                { id: "123", color: "green", name: "Green" },
                { id: "456", color: "yellow", name: "Yellow" },
              ],
            } satisfies TargetType,
          ).success,
          false,
        );
      });
    });
  });
});
