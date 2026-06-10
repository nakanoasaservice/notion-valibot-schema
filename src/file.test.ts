import * as v from "valibot";
import { describe, expect, expectTypeOf, it } from "vitest";

import { FileSchema } from "./file.ts";
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
});
