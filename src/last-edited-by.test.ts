import * as v from "valibot";
import { describe, expect, expectTypeOf, it } from "vitest";

import {
	LastEditedByIdSchema,
	LastEditedBySchema,
	NullableLastEditedByNameSchema,
} from "./last-edited-by.ts";
import { PersonSchema, UserOrGroupSchema, UserSchema } from "./people.ts";
import type {
	PartialLastEditedByPropertyValue,
	SelectNotionProperty,
} from "./test-utils.ts";

type TargetType = SelectNotionProperty<"last_edited_by">;

const lastEditedByUser = {
	object: "user" as const,
	id: "user-123",
	name: "Jane Doe",
	avatar_url: null,
	type: "person" as const,
	person: {
		email: "jane@example.com",
	},
};

const partialLastEditedBy = {
	object: "user" as const,
	id: "user-123",
};

describe("last-edited-by", () => {
	describe("LastEditedBySchema", () => {
		describe("type checking", () => {
			it("should accept last_edited_by property input type", () => {
				const Schema = LastEditedBySchema(
					v.object({
						id: v.string(),
						object: v.picklist(["user", "group"]),
					}),
				);

				expectTypeOf<TargetType>().toExtend<v.InferInput<typeof Schema>>();
			});

			it("should have correct output type", () => {
				const Schema = LastEditedBySchema(UserSchema);

				expectTypeOf<v.InferOutput<typeof Schema>>().toEqualTypeOf<{
					id: string;
					object: "user";
					name: string | null;
					avatar_url: string | null;
				}>();
			});
		});

		describe("parsing", () => {
			it("should parse last_edited_by property and extract person object", () => {
				const result = v.parse(LastEditedBySchema(UserOrGroupSchema), {
					last_edited_by: lastEditedByUser,
				} satisfies TargetType);

				expect(result).toEqual({
					id: "user-123",
					object: "user",
					name: "Jane Doe",
				});
			});

			it("should parse last_edited_by property with null name", () => {
				const result = v.parse(LastEditedBySchema(UserOrGroupSchema), {
					last_edited_by: { ...lastEditedByUser, name: null },
				} satisfies TargetType);

				expect(result).toEqual({
					id: "user-123",
					object: "user",
					name: null,
				});
			});
		});

		describe("partial response", () => {
			describe("type checking", () => {
				it("should accept partial Notion property value", () => {
					const Schema = LastEditedBySchema(UserOrGroupSchema);

					expectTypeOf<PartialLastEditedByPropertyValue>().toExtend<
						v.InferInput<typeof Schema>
					>();
				});
			});

			describe("parsing", () => {
				it("should parse partial Notion property value", () => {
					const result = v.parse(LastEditedBySchema(UserOrGroupSchema), {
						last_edited_by: partialLastEditedBy,
					} satisfies PartialLastEditedByPropertyValue);

					expect(result).toEqual({
						id: "user-123",
						object: "user",
						name: null,
					});
				});
			});
		});
	});

	describe("LastEditedBySchema with PersonSchema", () => {
		const Schema = LastEditedBySchema(PersonSchema);

		describe("partial response", () => {
			describe("type checking", () => {
				it("should not accept partial Notion property value", () => {
					expectTypeOf<PartialLastEditedByPropertyValue>().not.toExtend<
						v.InferInput<typeof Schema>
					>();
				});
			});

			describe("parsing", () => {
				it("should reject partial Notion property value", () => {
					expect(
						v.safeParse(Schema, {
							last_edited_by: partialLastEditedBy,
						} satisfies PartialLastEditedByPropertyValue).success,
					).toBe(false);
				});
			});
		});
	});

	describe("NullableLastEditedByNameSchema", () => {
		describe("type checking", () => {
			it("should accept last_edited_by property input type", () => {
				expectTypeOf<TargetType>().toExtend<
					v.InferInput<typeof NullableLastEditedByNameSchema>
				>();
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
					last_edited_by: lastEditedByUser,
				} satisfies TargetType);

				expect(result).toEqual("Jane Doe");
				expect(typeof result).toEqual("string");
			});

			it("should parse last_edited_by property with null name and return null", () => {
				const result = v.parse(NullableLastEditedByNameSchema, {
					last_edited_by: { ...lastEditedByUser, name: null },
				} satisfies TargetType);

				expect(result).toBe(null);
			});
		});

		describe("partial response", () => {
			describe("type checking", () => {
				it("should accept partial Notion property value", () => {
					expectTypeOf<PartialLastEditedByPropertyValue>().toExtend<
						v.InferInput<typeof NullableLastEditedByNameSchema>
					>();
				});
			});

			describe("parsing", () => {
				it("should parse partial Notion property value", () => {
					expect(
						v.parse(NullableLastEditedByNameSchema, {
							last_edited_by: partialLastEditedBy,
						} satisfies PartialLastEditedByPropertyValue),
					).toBe(null);
				});
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
					last_edited_by: lastEditedByUser,
				} satisfies TargetType);

				expect(result).toEqual("user-123");
				expect(typeof result).toEqual("string");
			});
		});

		describe("partial response", () => {
			describe("type checking", () => {
				it("should accept partial Notion property value", () => {
					expectTypeOf<PartialLastEditedByPropertyValue>().toExtend<
						v.InferInput<typeof LastEditedByIdSchema>
					>();
				});
			});

			describe("parsing", () => {
				it("should parse partial Notion property value", () => {
					const result = v.parse(LastEditedByIdSchema, {
						last_edited_by: partialLastEditedBy,
					} satisfies PartialLastEditedByPropertyValue);

					expect(result).toBe("user-123");
				});
			});
		});
	});
});
