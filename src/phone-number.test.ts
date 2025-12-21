import { describe, it } from "@std/testing/bdd";
import { assertType, type IsExact } from "@std/testing/types";
import * as v from "valibot";
import {
  NullablePhoneNumberSchema,
  PhoneNumberSchema,
} from "./phone-number.ts";
import type {
  Extends,
  NonNullableValues,
  SelectNotionProperty,
} from "./test-utils.ts";
import { assertEquals } from "@std/assert/equals";

type TargetType = SelectNotionProperty<"phone_number">;

describe("phone-number", () => {
  describe("PhoneNumberSchema", () => {
    describe("type checking", () => {
      it("should accept non-nullable phone_number property input type", () => {
        assertType<
          Extends<
            NonNullableValues<TargetType>,
            v.InferInput<typeof PhoneNumberSchema>
          >
        >(true);
      });

      it("should have correct output type", () => {
        assertType<
          IsExact<v.InferOutput<typeof PhoneNumberSchema>, string>
        >(true);
      });
    });

    describe("parsing", () => {
      it("should parse phone_number property and extract phone_number value", () => {
        const result = v.parse(
          PhoneNumberSchema,
          {
            phone_number: "+81-90-1234-5678",
          } satisfies TargetType,
        );

        assertEquals(result, "+81-90-1234-5678");
        assertEquals(typeof result, "string");
      });

      it("should reject null for non-nullable phone_number schema", () => {
        assertEquals(
          v.safeParse(
            PhoneNumberSchema,
            { phone_number: null } satisfies TargetType,
          ).success,
          false,
        );
      });
    });
  });

  describe("NullablePhoneNumberSchema", () => {
    describe("type checking", () => {
      it("should accept phone_number property or null input type", () => {
        assertType<
          Extends<
            TargetType,
            v.InferInput<typeof NullablePhoneNumberSchema>
          >
        >(true);
      });

      it("should have correct output type", () => {
        assertType<
          IsExact<
            v.InferOutput<typeof NullablePhoneNumberSchema>,
            string | null
          >
        >(true);
      });
    });

    describe("parsing", () => {
      it("should parse phone_number property and return phone_number value", () => {
        const result = v.parse(
          NullablePhoneNumberSchema,
          {
            phone_number: "+81-90-1234-5678",
          } satisfies TargetType,
        );

        assertEquals(result, "+81-90-1234-5678");
        assertEquals(typeof result, "string");
      });

      it("should parse null phone_number property and return null", () => {
        assertEquals(
          v.parse(
            NullablePhoneNumberSchema,
            { phone_number: null } satisfies TargetType,
          ),
          null,
        );
      });
    });
  });
});
