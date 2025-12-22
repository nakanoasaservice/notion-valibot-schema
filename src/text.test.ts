import * as v from "valibot";
import { describe, expect, expectTypeOf, it } from "vitest";

import type { SelectNotionProperty } from "./test-utils.ts";
import { RichTextSchema, TitleSchema } from "./text.ts";

describe("text", () => {
	describe("TitleSchema", () => {
		describe("type checking", () => {
			it("should accept title property input type", () => {
				type TargetType = SelectNotionProperty<"title">;
				expectTypeOf<TargetType>().toExtend<v.InferInput<typeof TitleSchema>>();
			});

			it("should have correct output type", () => {
				expectTypeOf<
					v.InferOutput<typeof TitleSchema>
				>().toEqualTypeOf<string>();
			});
		});

		describe("parsing", () => {
			it("should parse title property and extract joined plain_text", () => {
				type TargetType = SelectNotionProperty<"title">;
				const result = v.parse(TitleSchema, {
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
				} satisfies TargetType);

				expect(result).toEqual("My Title");
				expect(typeof result).toEqual("string");
			});
		});
	});

	describe("RichTextSchema", () => {
		describe("type checking", () => {
			it("should accept rich_text property input type", () => {
				type TargetType = SelectNotionProperty<"rich_text">;
				expectTypeOf<TargetType>().toExtend<
					v.InferInput<typeof RichTextSchema>
				>();
			});

			it("should have correct output type", () => {
				expectTypeOf<
					v.InferOutput<typeof RichTextSchema>
				>().toEqualTypeOf<string>();
			});
		});

		describe("parsing", () => {
			it("should parse rich_text property and extract joined plain_text", () => {
				type TargetType = SelectNotionProperty<"rich_text">;
				const result = v.parse(RichTextSchema, {
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
				} satisfies TargetType);

				expect(result).toEqual("Rich Text");
				expect(typeof result).toEqual("string");
			});
		});
	});
});
