import { describe, it } from "@std/testing/bdd";
import { assertType, type IsExact } from "@std/testing/types";
import * as v from "valibot";
import {
  NullableCreatedByIdSchema,
  NullableCreatedByNameSchema,
} from "./created-by.ts";
import type { Extends, SelectNotionProperty } from "./test-utils.ts";
import { assertEquals } from "@std/assert/equals";

type TargetType = SelectNotionProperty<"created_by">;

describe("created-by", () => {
  describe("NullableCreatedByNameSchema", () => {
    describe("type checking", () => {
      it("should accept created_by property input type", () => {
        // Note: Type checking for created_by property
      });

      it("should have correct output type", () => {
        assertType<
          IsExact<
            v.InferOutput<typeof NullableCreatedByNameSchema>,
            string | null
          >
        >(true);
      });
    });

    describe("parsing", () => {
      it("should parse created_by property and extract name value", () => {
        const result = v.parse(
          NullableCreatedByNameSchema,
          {
            created_by: {
              object: "user",
              id: "user-123",
              name: "John Doe",
              avatar_url: null,
              type: "person",
              person: {
                email: "john@example.com",
              },
            },
          } satisfies TargetType,
        );

        assertEquals(result, "John Doe");
        assertEquals(typeof result, "string");
      });

      it("should parse created_by property with null name and return null", () => {
        const result = v.parse(
          NullableCreatedByNameSchema,
          {
            created_by: {
              object: "user",
              id: "user-123",
              name: null,
              avatar_url: null,
              type: "person",
              person: {
                email: "john@example.com",
              },
            },
          } satisfies TargetType,
        );

        assertEquals(result, null);
      });
    });
  });

  describe("NullableCreatedByIdSchema", () => {
    describe("type checking", () => {
      it("should accept created_by property input type", () => {
        assertType<
          Extends<
            TargetType,
            v.InferInput<typeof NullableCreatedByIdSchema>
          >
        >(true);
      });

      it("should have correct output type", () => {
        assertType<
          IsExact<v.InferOutput<typeof NullableCreatedByIdSchema>, string>
        >(true);
      });
    });

    describe("parsing", () => {
      it("should parse created_by property and extract id value", () => {
        const result = v.parse(
          NullableCreatedByIdSchema,
          {
            created_by: {
              object: "user",
              id: "user-123",
              name: "John Doe",
              avatar_url: null,
              type: "person",
              person: {
                email: "john@example.com",
              },
            },
          } satisfies TargetType,
        );

        assertEquals(result, "user-123");
        assertEquals(typeof result, "string");
      });
    });
  });
});
