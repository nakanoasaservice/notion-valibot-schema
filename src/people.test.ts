import * as v from "valibot";
import { describe, expect, expectTypeOf, it } from "vitest";

import {
	BotSchema,
	NullableSinglePeopleIdSchema,
	NullableSinglePeopleSchema,
	PeopleIdSchema,
	PeopleSchema,
	PersonSchema,
	SinglePeopleIdSchema,
	SinglePeopleSchema,
	UserOrGroupSchema,
	UserSchema,
} from "./people.ts";
import type {
	PartialPeoplePropertyValue,
	PartialSinglePeoplePropertyValue,
	SelectNotionProperty,
} from "./test-utils.ts";

type TargetType = SelectNotionProperty<"people">;

const personUser = {
	object: "user" as const,
	id: "user-1",
	name: "John Doe",
	avatar_url: null,
	type: "person" as const,
	person: {
		email: "john@example.com",
	},
};

const personUser2 = {
	object: "user" as const,
	id: "user-2",
	name: "Jane Doe",
	avatar_url: null,
	type: "person" as const,
	person: {
		email: "jane@example.com",
	},
};

const partialUser = {
	object: "user" as const,
	id: "user-1",
};

const partialBot = {
	object: "bot" as const,
	id: "bot-1",
};

describe("people", () => {
	describe("UserOrGroupSchema", () => {
		it("should parse user object", () => {
			const result = v.parse(UserOrGroupSchema, {
				object: "user",
				id: "user-1",
				name: "John Doe",
			});

			expect(result).toEqual({
				id: "user-1",
				object: "user",
				name: "John Doe",
			});
		});

		it("should default null name", () => {
			const result = v.parse(UserOrGroupSchema, {
				object: "user",
				id: "user-1",
				name: null,
			});

			expect(result.name).toBe(null);
		});
	});

	describe("PersonSchema", () => {
		it("should parse person user object", () => {
			const result = v.parse(PersonSchema, personUser);

			expect(result.id).toBe("user-1");
			expect(result.type).toBe("person");
			expect(result.person.email).toBe("john@example.com");
		});

		describe("partial response", () => {
			describe("type checking", () => {
				it("should not accept partial user object", () => {
					expectTypeOf<
						PartialPeoplePropertyValue["people"][number]
					>().not.toExtend<v.InferInput<typeof PersonSchema>>();
				});
			});

			describe("parsing", () => {
				it("should reject partial user object", () => {
					expect(v.safeParse(PersonSchema, partialUser).success).toBe(false);
				});
			});
		});
	});

	describe("UserSchema", () => {
		it("should parse user object with avatar_url", () => {
			const result = v.parse(UserSchema, {
				object: "user",
				id: "user-1",
				name: "John Doe",
				avatar_url: "https://example.com/avatar.png",
			});

			expect(result).toEqual({
				id: "user-1",
				object: "user",
				name: "John Doe",
				avatar_url: "https://example.com/avatar.png",
			});
		});
	});

	describe("BotSchema", () => {
		it("should parse bot object", () => {
			const result = v.parse(BotSchema, {
				object: "bot",
				id: "bot-1",
				name: "My Bot",
				avatar_url: null,
				type: "bot",
				bot: {},
			});

			expect(result.id).toBe("bot-1");
			expect(result.object).toBe("bot");
			expect(result.type).toBe("bot");
		});

		describe("partial response", () => {
			describe("type checking", () => {
				it("should not accept partial bot object", () => {
					expectTypeOf<typeof partialBot>().not.toExtend<
						v.InferInput<typeof BotSchema>
					>();
				});
			});

			describe("parsing", () => {
				it("should reject partial bot object", () => {
					expect(v.safeParse(BotSchema, partialBot).success).toBe(false);
				});
			});
		});
	});

	describe("PeopleSchema", () => {
		const Schema = PeopleSchema(UserOrGroupSchema);

		describe("type checking", () => {
			it("should accept people property input type", () => {
				expectTypeOf<TargetType>().toExtend<v.InferInput<typeof Schema>>();
			});

			it("should have correct output type", () => {
				expectTypeOf<v.InferOutput<typeof Schema>>().toEqualTypeOf<
					Array<{
						id: string;
						object: "user" | "group";
						name: string | null;
					}>
				>();
			});
		});

		describe("parsing", () => {
			it("should parse people property and return people array", () => {
				const result = v.parse(Schema, {
					people: [personUser, personUser2],
				} satisfies TargetType);

				expect(result.length).toBe(2);
				expect(result[0]?.id).toBe("user-1");
				expect(result[0]?.name).toBe("John Doe");
				expect(result[1]?.id).toBe("user-2");
				expect(result[1]?.name).toBe("Jane Doe");
			});

			it("should parse people property with null names", () => {
				const result = v.parse(Schema, {
					people: [{ ...personUser, name: null }],
				} satisfies TargetType);

				expect(result.length).toBe(1);
				expect(result[0]?.id).toBe("user-1");
				expect(result[0]?.name).toBe(null);
			});

			it("should parse empty people array", () => {
				const result = v.parse(Schema, {
					people: [],
				} satisfies TargetType);

				expect(result).toEqual([]);
			});
		});

		describe("partial response", () => {
			describe("type checking", () => {
				it("should accept partial Notion property value", () => {
					expectTypeOf<PartialPeoplePropertyValue>().toExtend<
						v.InferInput<typeof Schema>
					>();
				});
			});

			describe("parsing", () => {
				it("should parse partial Notion property value", () => {
					const result = v.parse(Schema, {
						people: [partialUser],
					} satisfies PartialPeoplePropertyValue);

					expect(result).toEqual([
						{ id: "user-1", object: "user", name: null },
					]);
				});
			});
		});
	});

	describe("PeopleSchema with PersonSchema", () => {
		const Schema = PeopleSchema(PersonSchema);

		it("should parse full person objects", () => {
			const result = v.parse(Schema, {
				people: [personUser],
			} satisfies TargetType);

			expect(result[0]?.type).toBe("person");
			expect(result[0]?.person.email).toBe("john@example.com");
		});

		describe("partial response", () => {
			describe("type checking", () => {
				it("should not accept partial Notion property value", () => {
					expectTypeOf<PartialPeoplePropertyValue>().not.toExtend<
						v.InferInput<typeof Schema>
					>();
				});
			});

			describe("parsing", () => {
				it("should reject partial Notion property value", () => {
					expect(
						v.safeParse(Schema, {
							people: [partialUser],
						} satisfies PartialPeoplePropertyValue).success,
					).toBe(false);
				});
			});
		});
	});

	describe("SinglePeopleSchema", () => {
		const Schema = SinglePeopleSchema(UserOrGroupSchema);

		describe("type checking", () => {
			it("should have correct output type", () => {
				expectTypeOf<v.InferOutput<typeof Schema>>().toEqualTypeOf<{
					id: string;
					object: "user" | "group";
					name: string | null;
				}>();
			});
		});

		describe("parsing", () => {
			it("should parse single person", () => {
				const result = v.parse(Schema, {
					people: [personUser],
				} satisfies TargetType);

				expect(result.id).toBe("user-1");
				expect(result.name).toBe("John Doe");
			});
		});

		describe("partial response", () => {
			describe("type checking", () => {
				it("should accept partial Notion property value", () => {
					expectTypeOf<PartialSinglePeoplePropertyValue>().toExtend<
						v.InferInput<typeof Schema>
					>();
				});
			});

			describe("parsing", () => {
				it("should parse partial Notion property value", () => {
					const result = v.parse(Schema, {
						people: [partialUser],
					} satisfies PartialSinglePeoplePropertyValue);

					expect(result).toEqual({
						id: "user-1",
						object: "user",
						name: null,
					});
				});
			});
		});
	});

	describe("NullableSinglePeopleSchema", () => {
		const Schema = NullableSinglePeopleSchema(UserOrGroupSchema);

		describe("type checking", () => {
			it("should have correct output type", () => {
				expectTypeOf<v.InferOutput<typeof Schema>>().toEqualTypeOf<{
					id: string;
					object: "user" | "group";
					name: string | null;
				} | null>();
			});
		});

		describe("parsing", () => {
			it("should parse single person", () => {
				const result = v.parse(Schema, {
					people: [personUser],
				} satisfies TargetType);

				expect(result?.id).toBe("user-1");
			});

			it("should return null for empty array", () => {
				const result = v.parse(Schema, {
					people: [],
				} satisfies TargetType);

				expect(result).toBe(null);
			});
		});

		describe("partial response", () => {
			describe("type checking", () => {
				it("should accept partial Notion property value", () => {
					expectTypeOf<PartialPeoplePropertyValue>().toExtend<
						v.InferInput<typeof Schema>
					>();
				});
			});

			describe("parsing", () => {
				it("should parse partial Notion property value", () => {
					expect(
						v.parse(Schema, {
							people: [],
						} satisfies PartialPeoplePropertyValue),
					).toBe(null);
				});
			});
		});
	});

	describe("PeopleIdSchema", () => {
		describe("type checking", () => {
			it("should accept people property input type", () => {
				expectTypeOf<TargetType>().toExtend<
					v.InferInput<typeof PeopleIdSchema>
				>();
			});

			it("should have correct output type", () => {
				expectTypeOf<v.InferOutput<typeof PeopleIdSchema>>().toEqualTypeOf<
					string[]
				>();
			});
		});

		describe("parsing", () => {
			it("should parse people property and extract id array", () => {
				const result = v.parse(PeopleIdSchema, {
					people: [personUser, personUser2],
				} satisfies TargetType);

				expect(result).toEqual(["user-1", "user-2"]);
			});

			it("should parse empty people array and return empty array", () => {
				const result = v.parse(PeopleIdSchema, {
					people: [],
				} satisfies TargetType);

				expect(result).toEqual([]);
			});
		});

		describe("partial response", () => {
			describe("type checking", () => {
				it("should accept partial Notion property value", () => {
					expectTypeOf<PartialPeoplePropertyValue>().toExtend<
						v.InferInput<typeof PeopleIdSchema>
					>();
				});
			});

			describe("parsing", () => {
				it("should parse partial Notion property value", () => {
					const result = v.parse(PeopleIdSchema, {
						people: [partialUser, { object: "user", id: "user-2" }],
					} satisfies PartialPeoplePropertyValue);

					expect(result).toEqual(["user-1", "user-2"]);
				});
			});
		});
	});

	describe("SinglePeopleIdSchema", () => {
		describe("type checking", () => {
			it("should have correct output type", () => {
				expectTypeOf<
					v.InferOutput<typeof SinglePeopleIdSchema>
				>().toEqualTypeOf<string>();
			});
		});

		describe("parsing", () => {
			it("should extract single id", () => {
				const result = v.parse(SinglePeopleIdSchema, {
					people: [personUser],
				} satisfies TargetType);

				expect(result).toBe("user-1");
			});
		});

		describe("partial response", () => {
			describe("type checking", () => {
				it("should accept partial Notion property value", () => {
					expectTypeOf<PartialSinglePeoplePropertyValue>().toExtend<
						v.InferInput<typeof SinglePeopleIdSchema>
					>();
				});
			});

			describe("parsing", () => {
				it("should parse partial Notion property value", () => {
					const result = v.parse(SinglePeopleIdSchema, {
						people: [partialUser],
					} satisfies PartialSinglePeoplePropertyValue);

					expect(result).toBe("user-1");
				});
			});
		});
	});

	describe("NullableSinglePeopleIdSchema", () => {
		describe("type checking", () => {
			it("should have correct output type", () => {
				expectTypeOf<
					v.InferOutput<typeof NullableSinglePeopleIdSchema>
				>().toEqualTypeOf<string | null>();
			});
		});

		describe("parsing", () => {
			it("should extract single id", () => {
				const result = v.parse(NullableSinglePeopleIdSchema, {
					people: [personUser],
				} satisfies TargetType);

				expect(result).toBe("user-1");
			});

			it("should return null for empty array", () => {
				const result = v.parse(NullableSinglePeopleIdSchema, {
					people: [],
				} satisfies TargetType);

				expect(result).toBe(null);
			});
		});

		describe("partial response", () => {
			describe("type checking", () => {
				it("should accept partial Notion property value", () => {
					expectTypeOf<PartialPeoplePropertyValue>().toExtend<
						v.InferInput<typeof NullableSinglePeopleIdSchema>
					>();
				});
			});

			describe("parsing", () => {
				it("should parse partial Notion property value", () => {
					expect(
						v.parse(NullableSinglePeopleIdSchema, {
							people: [],
						} satisfies PartialPeoplePropertyValue),
					).toBe(null);
				});
			});
		});
	});
});
