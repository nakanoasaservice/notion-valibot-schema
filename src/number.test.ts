import { describe, it } from "@std/testing/bdd";
import { assertType } from "@std/testing/types";
import type * as v from "valibot";
import type { NullableNumberSchema, NumberSchema } from "./number.ts";
import type {
  Extends,
  NonNullableValues,
  SelectNotionProperty,
} from "./test-utils.ts";

type TargetType = SelectNotionProperty<"number">;

describe("number", () => {
  describe("NullableNumberSchema", () => {
    it("should accept a number or null", () => {
      assertType<
        Extends<
          TargetType,
          v.InferInput<typeof NullableNumberSchema>
        >
      >(true);
    });
  });

  describe("NumberSchema", () => {
    it("should accept a number", () => {
      assertType<
        Extends<
          NonNullableValues<TargetType>,
          v.InferInput<typeof NumberSchema>
        >
      >(true);
    });
  });
});
