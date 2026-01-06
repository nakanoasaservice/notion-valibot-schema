import * as v from "valibot";
import { describe, expect, expectTypeOf, it } from "vitest";

import type { SelectNotionProperty } from "./test-utils.ts";
import {
	NullableRichTextSchema,
	NullableTitleSchema,
	RichTextSchema,
	TitleSchema,
} from "./text.ts";

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

			it("should reject empty title array", () => {
				type TargetType = SelectNotionProperty<"title">;
				expect(
					v.safeParse(TitleSchema, { title: [] } satisfies TargetType).success,
				).toBe(false);
			});

			it("should reject title array with only empty plain_text", () => {
				type TargetType = SelectNotionProperty<"title">;
				expect(
					v.safeParse(TitleSchema, {
						title: [
							{
								type: "text",
								text: {
									content: "",
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
								plain_text: "",
								href: null,
							},
						],
					} satisfies TargetType).success,
				).toBe(false);
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

			it("should reject empty rich_text array", () => {
				type TargetType = SelectNotionProperty<"rich_text">;
				expect(
					v.safeParse(RichTextSchema, {
						rich_text: [],
					} satisfies TargetType).success,
				).toBe(false);
			});

			it("should reject rich_text array with only empty plain_text", () => {
				type TargetType = SelectNotionProperty<"rich_text">;
				expect(
					v.safeParse(RichTextSchema, {
						rich_text: [
							{
								type: "text",
								text: {
									content: "",
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
								plain_text: "",
								href: null,
							},
						],
					} satisfies TargetType).success,
				).toBe(false);
			});
		});
	});

	describe("NullableTitleSchema", () => {
		describe("type checking", () => {
			it("should accept title property or null input type", () => {
				type TargetType = SelectNotionProperty<"title">;
				expectTypeOf<TargetType>().toExtend<
					v.InferInput<typeof NullableTitleSchema>
				>();
			});

			it("should have correct output type", () => {
				expectTypeOf<v.InferOutput<typeof NullableTitleSchema>>().toEqualTypeOf<
					string | null
				>();
			});
		});

		describe("parsing", () => {
			it("should parse title property and return string value", () => {
				type TargetType = SelectNotionProperty<"title">;
				const result = v.parse(NullableTitleSchema, {
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

			it("should parse null title property and return null", () => {
				type TargetType = SelectNotionProperty<"title">;
				expect(
					v.parse(NullableTitleSchema, { title: null } as TargetType & {
						title: null;
					}),
				).toBe(null);
			});

			it("should parse empty title array and return null", () => {
				type TargetType = SelectNotionProperty<"title">;
				const result = v.parse(NullableTitleSchema, {
					title: [],
				} satisfies TargetType);

				expect(result).toBe(null);
			});
		});
	});

	describe("NullableRichTextSchema", () => {
		describe("type checking", () => {
			it("should accept rich_text property or null input type", () => {
				type TargetType = SelectNotionProperty<"rich_text">;
				expectTypeOf<TargetType>().toExtend<
					v.InferInput<typeof NullableRichTextSchema>
				>();
			});

			it("should have correct output type", () => {
				expectTypeOf<
					v.InferOutput<typeof NullableRichTextSchema>
				>().toEqualTypeOf<string | null>();
			});
		});

		describe("parsing", () => {
			it("should parse rich_text property and return string value", () => {
				type TargetType = SelectNotionProperty<"rich_text">;
				const result = v.parse(NullableRichTextSchema, {
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

			it("should parse null rich_text property and return null", () => {
				type TargetType = SelectNotionProperty<"rich_text">;
				expect(
					v.parse(NullableRichTextSchema, { rich_text: null } as TargetType & {
						rich_text: null;
					}),
				).toBe(null);
			});

			it("should parse empty rich_text array and return null", () => {
				type TargetType = SelectNotionProperty<"rich_text">;
				const result = v.parse(NullableRichTextSchema, {
					rich_text: [],
				} satisfies TargetType);

				expect(result).toBe(null);
			});
		});
	});
});
