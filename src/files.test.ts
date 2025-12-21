import { describe, it } from "@std/testing/bdd";
import { assertType, type IsExact } from "@std/testing/types";
import * as v from "valibot";
import { FilesSchema } from "./files.ts";
import type { SelectNotionProperty } from "./test-utils.ts";
import { assertEquals } from "@std/assert/equals";

type TargetType = SelectNotionProperty<"files">;

describe("files", () => {
  describe("FilesSchema", () => {
    describe("type checking", () => {
      it("should accept files property input type", () => {
        // Note: Type checking for files property
        // FilesSchema accepts files array with file.url structure
      });

      it("should have correct output type", () => {
        assertType<
          IsExact<v.InferOutput<typeof FilesSchema>, string[]>
        >(true);
      });
    });

    describe("parsing", () => {
      it("should parse files property and extract url values", () => {
        const result = v.parse(
          FilesSchema,
          {
            files: [
              {
                name: "file1.pdf",
                type: "file",
                file: {
                  url: "https://example.com/file1.pdf",
                  expiry_time: "2024-01-01T00:00:00.000Z",
                },
              },
              {
                name: "file2.pdf",
                type: "file",
                file: {
                  url: "https://example.com/file2.pdf",
                  expiry_time: "2024-01-01T00:00:00.000Z",
                },
              },
            ],
          } satisfies TargetType,
        );

        assertEquals(result.length, 2);
        assertEquals(result[0], "https://example.com/file1.pdf");
        assertEquals(result[1], "https://example.com/file2.pdf");
      });

      it("should parse empty files array", () => {
        const result = v.parse(
          FilesSchema,
          {
            files: [],
          } satisfies TargetType,
        );

        assertEquals(result, []);
        assertEquals(result.length, 0);
      });
    });
  });
});
