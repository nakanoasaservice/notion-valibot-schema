import { describe, it } from "@std/testing/bdd";
import { assertType, type IsExact } from "@std/testing/types";
import * as v from "valibot";
import { EmailSchema, NullableEmailSchema } from "./email.ts";
import type {
  Extends,
  NonNullableValues,
  SelectNotionProperty,
} from "./test-utils.ts";
import { assertEquals } from "@std/assert/equals";

type TargetType = SelectNotionProperty<"email">;

describe("email", () => {
  describe("EmailSchema", () => {
    describe("type checking", () => {
      it("should accept non-nullable email property input type", () => {
        assertType<
          Extends<
            NonNullableValues<TargetType>,
            v.InferInput<typeof EmailSchema>
          >
        >(true);
      });

      it("should have correct output type", () => {
        assertType<IsExact<v.InferOutput<typeof EmailSchema>, string>>(true);
      });
    });

    describe("parsing", () => {
      it("should parse email property and extract email value", () => {
        const result = v.parse(
          EmailSchema,
          {
            email: "test@example.com",
          } satisfies TargetType,
        );

        assertEquals(result, "test@example.com");
        assertEquals(typeof result, "string");
      });

      it("should reject null for non-nullable email schema", () => {
        assertEquals(
          v.safeParse(EmailSchema, { email: null } satisfies TargetType)
            .success,
          false,
        );
      });
    });
  });

  describe("NullableEmailSchema", () => {
    describe("type checking", () => {
      it("should accept email property or null input type", () => {
        assertType<
          Extends<
            TargetType,
            v.InferInput<typeof NullableEmailSchema>
          >
        >(true);
      });

      it("should have correct output type", () => {
        assertType<
          IsExact<v.InferOutput<typeof NullableEmailSchema>, string | null>
        >(true);
      });
    });

    describe("parsing", () => {
      it("should parse email property and return email value", () => {
        const result = v.parse(
          NullableEmailSchema,
          {
            email: "test@example.com",
          } satisfies TargetType,
        );

        assertEquals(result, "test@example.com");
        assertEquals(typeof result, "string");
      });

      it("should parse null email property and return null", () => {
        assertEquals(
          v.parse(NullableEmailSchema, { email: null } satisfies TargetType),
          null,
        );
      });
    });
  });
});
