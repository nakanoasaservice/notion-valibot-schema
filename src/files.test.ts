import * as v from "valibot";
import { describe, expect, expectTypeOf, it } from "vitest";

import {
	FileSchema,
	NullableSingleFileSchema,
	SingleFileSchema,
} from "./files.ts";
import type { SelectNotionProperty } from "./test-utils.ts";

type TargetType = SelectNotionProperty<"files">;

describe("files", () => {
	describe("FileSchema", () => {
		describe("type checking", () => {
			it("should accept files property input type", () => {
				expectTypeOf<TargetType>().toExtend<v.InferInput<typeof FileSchema>>();
			});

			it("should have correct output type", () => {
				expectTypeOf<v.InferOutput<typeof FileSchema>>().toEqualTypeOf<
					string[]
				>();
			});
		});

		describe("parsing", () => {
			it("should parse files property and extract url values", () => {
				const result = v.parse(FileSchema, {
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
				} satisfies TargetType);

				expect(result.length).toBe(2);
				expect(result[0]).toBe("https://example.com/file1.pdf");
				expect(result[1]).toBe("https://example.com/file2.pdf");
			});

			it("should parse empty files array", () => {
				const result = v.parse(FileSchema, {
					files: [],
				} satisfies TargetType);

				expect(result).toEqual([]);
				expect(result.length).toBe(0);
			});
		});
	});

	describe("SingleFileSchema", () => {
		describe("type checking", () => {
			it("should accept files property input type", () => {
				expectTypeOf<
					TargetType & {
						files: [
							{
								name: string;
								type: "file";
								file: {
									url: string;
									expiry_time: string;
								};
							},
						];
					}
				>().toExtend<v.InferInput<typeof SingleFileSchema>>();
			});

			it("should have correct output type", () => {
				expectTypeOf<
					v.InferOutput<typeof SingleFileSchema>
				>().toEqualTypeOf<string>();
			});
		});

		describe("parsing", () => {
			it("should parse single file property and extract url", () => {
				const result = v.parse(SingleFileSchema, {
					files: [
						{
							name: "file1.pdf",
							type: "file",
							file: {
								url: "https://example.com/file1.pdf",
								expiry_time: "2024-01-01T00:00:00.000Z",
							},
						},
					],
				} satisfies TargetType);

				expect(result).toBe("https://example.com/file1.pdf");
				expect(typeof result).toBe("string");
			});

			it("should parse single external file property and extract url", () => {
				const result = v.parse(SingleFileSchema, {
					files: [
						{
							name: "external-file",
							type: "external",
							external: {
								url: "https://example.com/external-file.pdf",
							},
						},
					],
				} satisfies TargetType);

				expect(result).toBe("https://example.com/external-file.pdf");
			});

			it("should reject empty files array", () => {
				expect(
					v.safeParse(SingleFileSchema, {
						files: [],
					} satisfies TargetType).success,
				).toBe(false);
			});
		});
	});

	describe("NullableSingleFileSchema", () => {
		describe("type checking", () => {
			it("should accept files property input type", () => {
				expectTypeOf<TargetType>().toExtend<
					v.InferInput<typeof NullableSingleFileSchema>
				>();
			});

			it("should have correct output type", () => {
				expectTypeOf<
					v.InferOutput<typeof NullableSingleFileSchema>
				>().toEqualTypeOf<string | null>();
			});
		});

		describe("parsing", () => {
			it("should parse single file property and extract url", () => {
				const result = v.parse(NullableSingleFileSchema, {
					files: [
						{
							name: "file1.pdf",
							type: "file",
							file: {
								url: "https://example.com/file1.pdf",
								expiry_time: "2024-01-01T00:00:00.000Z",
							},
						},
					],
				} satisfies TargetType);

				expect(result).toBe("https://example.com/file1.pdf");
				expect(typeof result).toBe("string");
			});

			it("should parse empty files array and return null", () => {
				const result = v.parse(NullableSingleFileSchema, {
					files: [],
				} satisfies TargetType);

				expect(result).toBe(null);
			});
		});
	});
});
