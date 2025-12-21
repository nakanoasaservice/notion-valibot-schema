import { describe, it } from "@std/testing/bdd";
import { assertType, type IsExact } from "@std/testing/types";
import * as v from "valibot";
import { CreatedByIdSchema, CreatedBySchema } from "./created-by.ts";
import type { Extends, SelectNotionProperty } from "./test-utils.ts";
import { assertEquals } from "@std/assert/equals";

type TargetType = SelectNotionProperty<"created_by">;

describe("created-by", () => {
  describe("CreatedBySchema", () => {
    describe("type checking", () => {
      it("should accept created_by property input type", () => {
        // Note: Type checking for created_by property
      });

      it("should have correct output type", () => {
        assertType<
          IsExact<
            v.InferOutput<typeof CreatedBySchema>,
            { id: string; object: "user"; name: string | null }
          >
        >(true);
      });
    });

    describe("parsing", () => {
      it("should parse created_by property and extract name value", () => {
        const result = v.parse(
          CreatedBySchema,
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

        assertEquals(result, {
          id: "user-123",
          object: "user",
          name: "John Doe",
        });
      });

      it("should parse created_by property with null name and return null", () => {
        const result = v.parse(
          CreatedBySchema,
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

        assertEquals(result, { id: "user-123", object: "user", name: null });
      });
    });
  });

  describe("CreatedByIdSchema", () => {
    describe("type checking", () => {
      it("should accept created_by property input type", () => {
        assertType<
          Extends<
            TargetType,
            v.InferInput<typeof CreatedByIdSchema>
          >
        >(true);
      });

      it("should have correct output type", () => {
        assertType<
          IsExact<v.InferOutput<typeof CreatedByIdSchema>, string>
        >(true);
      });
    });

    describe("parsing", () => {
      it("should parse created_by property and extract id value", () => {
        const result = v.parse(
          CreatedByIdSchema,
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
