import { describe, it } from "@std/testing/bdd";
import { assertType, type IsExact } from "@std/testing/types";
import * as v from "valibot";
import { MultiSelectSchema } from "./multi-select.ts";
import type { Extends, NotionProperty } from "./test-utils.ts";
import { assertEquals } from "@std/assert/equals";

type ExpectedInput = Extract<NotionProperty, { type: "multi_select" }>;

describe("multi-select", () => {
  describe("MultiSelectSchema", () => {
    it("should accept non-nullable multi-select property input type", () => {
      const Schema = MultiSelectSchema(v.string());

      assertType<
        Extends<
          ExpectedInput,
          v.InferInput<typeof Schema>
        >
      >(true);
    });

    it("should parse multi-select property and extract name values", () => {
      const Schema = MultiSelectSchema(v.picklist(["Green", "Red", "Blue"]));

      assertEquals(
        v.parse(Schema, { multi_select: [{ name: "Green" }, { name: "Red" }] }),
        ["Green", "Red"],
      );
    });

    it("should have correct output type", () => {
      const Schema = MultiSelectSchema(v.picklist(["Green", "Red", "Blue"]));

      assertType<
        IsExact<v.InferOutput<typeof Schema>, ("Green" | "Red" | "Blue")[]>
      >(true);
    });

    it("should parse empty multi-select array", () => {
      const Schema = MultiSelectSchema(v.picklist(["Green", "Red", "Blue"]));

      assertEquals(v.parse(Schema, { multi_select: [] }), []);
    });
  });
});
