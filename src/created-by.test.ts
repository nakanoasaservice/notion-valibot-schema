import * as v from "valibot";
import { describe, expect, expectTypeOf, it } from "vitest";

import { CreatedByIdSchema, CreatedBySchema } from "./created-by.ts";
import type { SelectNotionProperty } from "./test-utils.ts";

type TargetType = SelectNotionProperty<"created_by">;

describe("created-by", () => {
	describe("CreatedBySchema", () => {
		describe("type checking", () => {
			it("should accept created_by property input type", () => {
				expectTypeOf<TargetType>().toExtend<
					v.InferInput<typeof CreatedBySchema>
				>();
			});

			it("should have correct output type", () => {
				expectTypeOf<v.InferOutput<typeof CreatedBySchema>>().toEqualTypeOf<{
					id: string;
					object: "user" | "bot" | "group";
					name: string | null;
				}>();
			});
		});

		describe("parsing", () => {
			it("should parse created_by property and extract name value", () => {
				const result = v.parse(CreatedBySchema, {
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
				} satisfies TargetType);

				expect(result).toEqual({
					id: "user-123",
					object: "user",
					name: "John Doe",
				});
			});

			it("should parse created_by property with null name and return null", () => {
				const result = v.parse(CreatedBySchema, {
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
				} satisfies TargetType);

				expect(result).toEqual({ id: "user-123", object: "user", name: null });
			});
		});
	});

	describe("CreatedByIdSchema", () => {
		describe("type checking", () => {
			it("should accept created_by property input type", () => {
				expectTypeOf<TargetType>().toExtend<
					v.InferInput<typeof CreatedByIdSchema>
				>();
			});

			it("should have correct output type", () => {
				expectTypeOf<
					v.InferOutput<typeof CreatedByIdSchema>
				>().toEqualTypeOf<string>();
			});
		});

		describe("parsing", () => {
			it("should parse created_by property and extract id value", () => {
				const result = v.parse(CreatedByIdSchema, {
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
				} satisfies TargetType);

				expect(result).toEqual("user-123");
				expect(typeof result).toEqual("string");
			});
		});
	});
});
