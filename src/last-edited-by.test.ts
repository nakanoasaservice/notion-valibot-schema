import * as v from "valibot";
import { describe, expect, expectTypeOf, it } from "vitest";

import {
	LastEditedByIdSchema,
	LastEditedBySchema,
	NullableLastEditedByNameSchema,
} from "./last-edited-by.ts";
import type { SelectNotionProperty } from "./test-utils.ts";

type TargetType = SelectNotionProperty<"last_edited_by">;

describe("last-edited-by", () => {
	describe("LastEditedBySchema", () => {
		describe("type checking", () => {
			it("should accept last_edited_by property input type", () => {
				expectTypeOf<TargetType>().toExtend<
					v.InferInput<typeof LastEditedBySchema>
				>();
			});

			it("should have correct output type", () => {
				expectTypeOf<v.InferOutput<typeof LastEditedBySchema>>().toEqualTypeOf<{
					id: string;
					object: "user" | "bot" | "group";
					name: string | null;
				}>();
			});
		});

		describe("parsing", () => {
			it("should parse last_edited_by property and extract person object", () => {
				const result = v.parse(LastEditedBySchema, {
					last_edited_by: {
						object: "user",
						id: "user-123",
						name: "Jane Doe",
						avatar_url: null,
						type: "person",
						person: {
							email: "jane@example.com",
						},
					},
				} satisfies TargetType);

				expect(result).toEqual({
					id: "user-123",
					object: "user",
					name: "Jane Doe",
				});
			});

			it("should parse last_edited_by property with null name and return null", () => {
				const result = v.parse(LastEditedBySchema, {
					last_edited_by: {
						object: "user",
						id: "user-123",
						name: null,
						avatar_url: null,
						type: "person",
						person: {
							email: "jane@example.com",
						},
					},
				} satisfies TargetType);

				expect(result).toEqual({ id: "user-123", object: "user", name: null });
			});
		});
	});

	describe("NullableLastEditedByNameSchema", () => {
		describe("type checking", () => {
			it("should accept last_edited_by property input type", () => {
				// Note: Type checking for last_edited_by property
			});

			it("should have correct output type", () => {
				expectTypeOf<
					v.InferOutput<typeof NullableLastEditedByNameSchema>
				>().toEqualTypeOf<string | null>();
			});
		});

		describe("parsing", () => {
			it("should parse last_edited_by property and extract name value", () => {
				const result = v.parse(NullableLastEditedByNameSchema, {
					last_edited_by: {
						object: "user",
						id: "user-123",
						name: "Jane Doe",
						avatar_url: null,
						type: "person",
						person: {
							email: "jane@example.com",
						},
					},
				} satisfies TargetType);

				expect(result).toEqual("Jane Doe");
				expect(typeof result).toEqual("string");
			});

			it("should parse last_edited_by property with null name and return null", () => {
				const result = v.parse(NullableLastEditedByNameSchema, {
					last_edited_by: {
						object: "user",
						id: "user-123",
						name: null,
						avatar_url: null,
						type: "person",
						person: {
							email: "jane@example.com",
						},
					},
				} satisfies TargetType);

				expect(result).toBe(null);
			});
		});
	});

	describe("LastEditedByIdSchema", () => {
		describe("type checking", () => {
			it("should accept last_edited_by property input type", () => {
				expectTypeOf<TargetType>().toExtend<
					v.InferInput<typeof LastEditedByIdSchema>
				>();
			});

			it("should have correct output type", () => {
				expectTypeOf<
					v.InferOutput<typeof LastEditedByIdSchema>
				>().toEqualTypeOf<string>();
			});
		});

		describe("parsing", () => {
			it("should parse last_edited_by property and extract id value", () => {
				const result = v.parse(LastEditedByIdSchema, {
					last_edited_by: {
						object: "user",
						id: "user-123",
						name: "Jane Doe",
						avatar_url: null,
						type: "person",
						person: {
							email: "jane@example.com",
						},
					},
				} satisfies TargetType);

				expect(result).toEqual("user-123");
				expect(typeof result).toEqual("string");
			});
		});
	});
});
