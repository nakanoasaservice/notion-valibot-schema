import * as v from "valibot";
import { describe, expect, expectTypeOf, it } from "vitest";

import {
	CreatedByIdSchema,
	CreatedBySchema,
	NullableCreatedByNameSchema,
} from "./created-by.ts";
import { UserOrGroupSchema, UserSchema } from "./people.ts";
import type { SelectNotionProperty } from "./test-utils.ts";

type TargetType = SelectNotionProperty<"created_by">;

describe("created-by", () => {
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

	describe("NullableCreatedByNameSchema", () => {
		describe("type checking", () => {
			it("should accept created_by property input type", () => {
				expectTypeOf<TargetType>().toExtend<
					v.InferInput<typeof NullableCreatedByNameSchema>
				>();
			});

			it("should have correct output type", () => {
				expectTypeOf<
					v.InferOutput<typeof NullableCreatedByNameSchema>
				>().toEqualTypeOf<string | null>();
			});
		});

		describe("parsing", () => {
			it("should parse created_by property and extract name value", () => {
				const result = v.parse(NullableCreatedByNameSchema, {
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

				expect(result).toEqual("John Doe");
				expect(typeof result).toEqual("string");
			});

			it("should parse created_by property with null name and return null", () => {
				const result = v.parse(NullableCreatedByNameSchema, {
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

				expect(result).toBe(null);
			});
		});
	});

	describe("CreatedBySchema", () => {
		describe("type checking", () => {
			it("should accept created_by property input type", () => {
				const Schema = CreatedBySchema(
					v.object({
						id: v.string(),
						object: v.picklist(["user", "group"]),
					}),
				);

				expectTypeOf<TargetType>().toExtend<v.InferInput<typeof Schema>>();
			});

			it("should have correct output type", () => {
				const Schema = CreatedBySchema(UserSchema);
				type SchemaType = v.InferOutput<typeof Schema>;

				expectTypeOf<v.InferOutput<typeof Schema>>().toEqualTypeOf<{
					id: string;
					object: "user";
					name: string | null;
					avatar_url: string | null;
				}>();
			});
		});

		describe("parsing", () => {
			it("should parse created_by property and extract name value", () => {
				const result = v.parse(CreatedBySchema(UserOrGroupSchema), {
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
				const result = v.parse(CreatedBySchema(UserOrGroupSchema), {
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
});
