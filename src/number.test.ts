import { describe, it } from "@std/testing/bdd";
import { assertType } from "@std/testing/types";
import type * as v from "valibot";
import type { NullableNumberSchema, NumberSchema } from "./number.ts";
import type {
  Extends,
  NonNullableValues,
  NotionProperty,
} from "./test-utils.ts";

type ExpectedInput = Extract<NotionProperty, { type: "number" }>;

describe("number", () => {
  describe("NullableNumberSchema", () => {
    it("should accept a number or null", () => {
      assertType<
        Extends<
          ExpectedInput,
          v.InferInput<typeof NullableNumberSchema>
        >
      >(true);
    });
  });

  describe("NumberSchema", () => {
    it("should accept a number", () => {
      assertType<
        Extends<
          NonNullableValues<ExpectedInput>,
          v.InferInput<typeof NumberSchema>
        >
      >(true);
    });
  });
});
