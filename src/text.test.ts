import { describe, it } from "@std/testing/bdd";
import { assertType, type IsExact } from "@std/testing/types";
import * as v from "valibot";
import { RichTextSchema, TitleSchema } from "./text.ts";
import type { Extends, SelectNotionProperty } from "./test-utils.ts";
import { assertEquals } from "@std/assert/equals";

describe("text", () => {
  describe("TitleSchema", () => {
    describe("type checking", () => {
      it("should accept title property input type", () => {
        type TargetType = SelectNotionProperty<"title">;
        assertType<
          Extends<
            TargetType,
            v.InferInput<typeof TitleSchema>
          >
        >(true);
      });

      it("should have correct output type", () => {
        assertType<IsExact<v.InferOutput<typeof TitleSchema>, string>>(true);
      });
    });

    describe("parsing", () => {
      it("should parse title property and extract joined plain_text", () => {
        type TargetType = SelectNotionProperty<"title">;
        const result = v.parse(
          TitleSchema,
          {
            title: [
              {
                type: "text",
                text: {
                  content: "My Title",
                  link: null,
                },
                annotations: {
                  bold: false,
                  italic: false,
                  strikethrough: false,
                  underline: false,
                  code: false,
                  color: "default",
                },
                plain_text: "My Title",
                href: null,
              },
            ],
          } satisfies TargetType,
        );

        assertEquals(result, "My Title");
        assertEquals(typeof result, "string");
      });
    });
  });

  describe("RichTextSchema", () => {
    describe("type checking", () => {
      it("should accept rich_text property input type", () => {
        type TargetType = SelectNotionProperty<"rich_text">;
        assertType<
          Extends<
            TargetType,
            v.InferInput<typeof RichTextSchema>
          >
        >(true);
      });

      it("should have correct output type", () => {
        assertType<IsExact<v.InferOutput<typeof RichTextSchema>, string>>(true);
      });
    });

    describe("parsing", () => {
      it("should parse rich_text property and extract joined plain_text", () => {
        type TargetType = SelectNotionProperty<"rich_text">;
        const result = v.parse(
          RichTextSchema,
          {
            rich_text: [
              {
                type: "text",
                text: {
                  content: "Rich ",
                  link: null,
                },
                annotations: {
                  bold: false,
                  italic: false,
                  strikethrough: false,
                  underline: false,
                  code: false,
                  color: "default",
                },
                plain_text: "Rich ",
                href: null,
              },
              {
                type: "text",
                text: {
                  content: "Text",
                  link: null,
                },
                annotations: {
                  bold: false,
                  italic: false,
                  strikethrough: false,
                  underline: false,
                  code: false,
                  color: "default",
                },
                plain_text: "Text",
                href: null,
              },
            ],
          } satisfies TargetType,
        );

        assertEquals(result, "Rich Text");
        assertEquals(typeof result, "string");
      });
    });
  });
});
