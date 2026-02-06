import * as v from "valibot";
import { describe, expect, expectTypeOf, it } from "vitest";

import {
	NullableSinglePeopleSchema,
	PeopleIdSchema,
	PeopleSchema,
	SinglePeopleSchema,
} from "./people.ts";
import type { SelectNotionProperty } from "./test-utils.ts";

type TargetType = SelectNotionProperty<"people">;
type TargetPerson = TargetType["people"][number];

describe("people", () => {
	describe("PeopleSchema", () => {
		describe("type checking", () => {
			it("should accept people property input type", () => {
				expectTypeOf<TargetType>().toExtend<
					v.InferInput<typeof PeopleSchema>
				>();
			});

			it("should have correct output type", () => {
				expectTypeOf<v.InferOutput<typeof PeopleSchema>>().toEqualTypeOf<
					Array<{
						id: string;
						object: "user" | "bot" | "group";
						name: string | null;
					}>
				>();
			});
		});

		describe("parsing", () => {
			it("should parse people property and return people array", () => {
				const result = v.parse(PeopleSchema, {
					people: [
						{
							object: "user",
							id: "user-1",
							name: "John Doe",
							avatar_url: null,
							type: "person",
							person: {
								email: "john@example.com",
							},
						},
						{
							object: "user",
							id: "user-2",
							name: "Jane Doe",
							avatar_url: null,
							type: "person",
							person: {
								email: "jane@example.com",
							},
						},
					],
				} satisfies TargetType);

				expect(result.length).toBe(2);
				const first = result[0];
				const second = result[1];
				expect(first?.id).toBe("user-1");
				expect(first?.name).toBe("John Doe");
				expect(second?.id).toBe("user-2");
				expect(second?.name).toBe("Jane Doe");
			});

			it("should parse people property with null names", () => {
				const result = v.parse(PeopleSchema, {
					people: [
						{
							object: "user",
							id: "user-1",
							name: null,
							avatar_url: null,
							type: "person",
							person: {
								email: "john@example.com",
							},
						},
					],
				} satisfies TargetType);

				expect(result.length).toBe(1);
				const first = result[0];
				expect(first?.id).toBe("user-1");
				expect(first?.name).toBe(null);
			});

			it("should parse empty people array", () => {
				const result = v.parse(PeopleSchema, {
					people: [],
				} satisfies TargetType);

				expect(result).toEqual([]);
				expect(result.length).toBe(0);
			});
		});
	});

	describe("SinglePeopleSchema", () => {
		describe("type checking", () => {
			it("should accept people property input type", () => {
				expectTypeOf<TargetType & { people: [TargetPerson] }>().toExtend<
					v.InferInput<typeof SinglePeopleSchema>
				>();
			});

			it("should have correct output type", () => {
				expectTypeOf<
					v.InferOutput<typeof SinglePeopleSchema>
				>().toEqualTypeOf<{
					id: string;
					object: "user" | "bot" | "group";
					name: string | null;
				}>();
			});
		});

		describe("parsing", () => {
			it("should parse people property and return single person", () => {
				const result = v.parse(SinglePeopleSchema, {
					people: [
						{
							object: "user",
							id: "user-1",
							name: "John Doe",
							avatar_url: null,
							type: "person",
							person: {
								email: "john@example.com",
							},
						},
					],
				} satisfies TargetType);

				expect(result.id).toBe("user-1");
				expect(result.name).toBe("John Doe");
			});

			it("should reject empty people array", () => {
				expect(
					v.safeParse(SinglePeopleSchema, {
						people: [],
					} satisfies TargetType).success,
				).toBe(false);
			});

			it("should reject multiple people", () => {
				expect(
					v.safeParse(SinglePeopleSchema, {
						people: [
							{
								object: "user",
								id: "user-1",
								name: "John Doe",
								avatar_url: null,
								type: "person",
								person: {
									email: "john@example.com",
								},
							},
							{
								object: "user",
								id: "user-2",
								name: "Jane Doe",
								avatar_url: null,
								type: "person",
								person: {
									email: "jane@example.com",
								},
							},
						],
					} satisfies TargetType).success,
				).toBe(false);
			});
		});
	});

	describe("NullableSinglePeopleSchema", () => {
		describe("type checking", () => {
			it("should accept people property input type", () => {
				expectTypeOf<TargetType>().toExtend<
					v.InferInput<typeof NullableSinglePeopleSchema>
				>();
			});

			it("should have correct output type", () => {
				expectTypeOf<
					v.InferOutput<typeof NullableSinglePeopleSchema>
				>().toEqualTypeOf<{
					id: string;
					object: "user" | "bot" | "group";
					name: string | null;
				} | null>();
			});
		});

		describe("parsing", () => {
			it("should parse people property and return single person", () => {
				const result = v.parse(NullableSinglePeopleSchema, {
					people: [
						{
							object: "user",
							id: "user-1",
							name: "John Doe",
							avatar_url: null,
							type: "person",
							person: {
								email: "john@example.com",
							},
						},
					],
				} satisfies TargetType);

				expect(result?.id).toBe("user-1");
				expect(result?.name).toBe("John Doe");
			});

			it("should parse empty people array and return null", () => {
				const result = v.parse(NullableSinglePeopleSchema, {
					people: [],
				} satisfies TargetType);

				expect(result).toBe(null);
			});

			it("should take first person when multiple people are set", () => {
				const result = v.parse(NullableSinglePeopleSchema, {
					people: [
						{
							object: "user",
							id: "user-1",
							name: "John Doe",
							avatar_url: null,
							type: "person",
							person: {
								email: "john@example.com",
							},
						},
						{
							object: "user",
							id: "user-2",
							name: "Jane Doe",
							avatar_url: null,
							type: "person",
							person: {
								email: "jane@example.com",
							},
						},
					],
				} satisfies TargetType);

				expect(result?.id).toBe("user-1");
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
					people: [
						{
							object: "user",
							id: "user-1",
							name: "John Doe",
							avatar_url: null,
							type: "person",
							person: {
								email: "john@example.com",
							},
						},
						{
							object: "user",
							id: "user-2",
							name: "Jane Doe",
							avatar_url: null,
							type: "person",
							person: {
								email: "jane@example.com",
							},
						},
					],
				} satisfies TargetType);

				expect(result).toEqual(["user-1", "user-2"]);
				expect(result.length).toBe(2);
				expect(typeof result[0]).toEqual("string");
				expect(typeof result[1]).toEqual("string");
			});

			it("should parse people property with null names and extract id array", () => {
				const result = v.parse(PeopleIdSchema, {
					people: [
						{
							object: "user",
							id: "user-1",
							name: null,
							avatar_url: null,
							type: "person",
							person: {
								email: "john@example.com",
							},
						},
					],
				} satisfies TargetType);

				expect(result).toEqual(["user-1"]);
				expect(result.length).toBe(1);
				expect(typeof result[0]).toEqual("string");
			});

			it("should parse empty people array and return empty array", () => {
				const result = v.parse(PeopleIdSchema, {
					people: [],
				} satisfies TargetType);

				expect(result).toEqual([]);
				expect(result.length).toBe(0);
			});
		});
	});
});
