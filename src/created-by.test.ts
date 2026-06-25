import * as v from "valibot";
import { describe, expect, expectTypeOf, it } from "vitest";

import {
	CreatedByIdSchema,
	CreatedBySchema,
	NullableCreatedByNameSchema,
} from "./created-by.ts";
import { PersonSchema, UserOrGroupSchema, UserSchema } from "./people.ts";
import type {
	PartialCreatedByPropertyValue,
	SelectNotionProperty,
} from "./test-utils.ts";

type TargetType = SelectNotionProperty<"created_by">;

const partialCreatedBy = {
	object: "user" as const,
	id: "user-123",
};

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

		describe("partial response", () => {
			describe("type checking", () => {
				it("should accept partial Notion property value", () => {
					expectTypeOf<PartialCreatedByPropertyValue>().toExtend<
						v.InferInput<typeof CreatedByIdSchema>
					>();
				});
			});

			describe("parsing", () => {
				it("should parse partial Notion property value", () => {
					const result = v.parse(CreatedByIdSchema, {
						created_by: partialCreatedBy,
					} satisfies PartialCreatedByPropertyValue);

					expect(result).toBe("user-123");
				});
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

		describe("partial response", () => {
			describe("type checking", () => {
				it("should accept partial Notion property value", () => {
					expectTypeOf<PartialCreatedByPropertyValue>().toExtend<
						v.InferInput<typeof NullableCreatedByNameSchema>
					>();
				});
			});

			describe("parsing", () => {
				it("should parse partial Notion property value", () => {
					expect(
						v.parse(NullableCreatedByNameSchema, {
							created_by: partialCreatedBy,
						} satisfies PartialCreatedByPropertyValue),
					).toBe(null);
				});
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

		describe("partial response", () => {
			describe("type checking", () => {
				it("should accept partial Notion property value", () => {
					const Schema = CreatedBySchema(UserOrGroupSchema);

					expectTypeOf<PartialCreatedByPropertyValue>().toExtend<
						v.InferInput<typeof Schema>
					>();
				});
			});

			describe("parsing", () => {
				it("should parse partial Notion property value", () => {
					const result = v.parse(CreatedBySchema(UserOrGroupSchema), {
						created_by: partialCreatedBy,
					} satisfies PartialCreatedByPropertyValue);

					expect(result).toEqual({
						id: "user-123",
						object: "user",
						name: null,
					});
				});
			});
		});
	});

	describe("CreatedBySchema with PersonSchema", () => {
		const Schema = CreatedBySchema(PersonSchema);

		describe("partial response", () => {
			describe("type checking", () => {
				it("should not accept partial Notion property value", () => {
					expectTypeOf<PartialCreatedByPropertyValue>().not.toExtend<
						v.InferInput<typeof Schema>
					>();
				});
			});

			describe("parsing", () => {
				it("should reject partial Notion property value", () => {
					expect(
						v.safeParse(Schema, {
							created_by: partialCreatedBy,
						} satisfies PartialCreatedByPropertyValue).success,
					).toBe(false);
				});
			});
		});
	});
});
