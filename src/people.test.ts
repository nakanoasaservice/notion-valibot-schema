import * as v from "valibot";
import { describe, expect, expectTypeOf, it } from "vitest";

import { PeopleIdSchema, PeopleSchema } from "./people.ts";
import type { SelectNotionProperty } from "./test-utils.ts";

type TargetType = SelectNotionProperty<"people">;

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
