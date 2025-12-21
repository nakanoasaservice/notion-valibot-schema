import { describe, it } from "@std/testing/bdd";
import { assertType, type IsExact } from "@std/testing/types";
import * as v from "valibot";
import { LastEditedTimeSchema } from "./last-edited-time.ts";
import type { Extends, SelectNotionProperty } from "./test-utils.ts";
import { assertEquals } from "@std/assert/equals";

type TargetType = SelectNotionProperty<"last_edited_time">;

describe("last-edited-time", () => {
  describe("LastEditedTimeSchema", () => {
    describe("type checking", () => {
      it("should accept last_edited_time property input type", () => {
        assertType<
          Extends<
            TargetType,
            v.InferInput<typeof LastEditedTimeSchema>
          >
        >(true);
      });

      it("should have correct output type", () => {
        assertType<
          IsExact<v.InferOutput<typeof LastEditedTimeSchema>, Date>
        >(true);
      });
    });

    describe("parsing", () => {
      it("should parse last_edited_time property and convert to Date object", () => {
        const result = v.parse(
          LastEditedTimeSchema,
          {
            last_edited_time: "2024-01-15T00:00:00.000Z",
          } satisfies TargetType,
        );

        assertEquals(result instanceof Date, true);
        assertEquals(result.toISOString(), "2024-01-15T00:00:00.000Z");
      });
    });
  });
});
