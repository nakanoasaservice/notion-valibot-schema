import { assertEquals } from "@std/assert/equals";
import { describe, it } from "@std/testing/bdd";
import { assertType, type IsExact } from "@std/testing/types";
import * as v from "valibot";

import { PeopleSchema } from "./people.ts";
import type { Extends, SelectNotionProperty } from "./test-utils.ts";

type TargetType = SelectNotionProperty<"people">;

describe("people", () => {
	describe("PeopleSchema", () => {
		describe("type checking", () => {
			it("should accept people property input type", () => {
				assertType<Extends<TargetType, v.InferInput<typeof PeopleSchema>>>(
					true,
				);
			});

			it("should have correct output type", () => {
				assertType<
					IsExact<
						v.InferOutput<typeof PeopleSchema>,
						Array<{ id: string; name: string | null }>
					>
				>(true);
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

				assertEquals(result.length, 2);
				const first = result[0];
				const second = result[1];
				assertEquals(first?.id, "user-1");
				assertEquals(first?.name, "John Doe");
				assertEquals(second?.id, "user-2");
				assertEquals(second?.name, "Jane Doe");
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

				assertEquals(result.length, 1);
				const first = result[0];
				assertEquals(first?.id, "user-1");
				assertEquals(first?.name, null);
			});

			it("should parse empty people array", () => {
				const result = v.parse(PeopleSchema, {
					people: [],
				} satisfies TargetType);

				assertEquals(result, []);
				assertEquals(result.length, 0);
			});
		});
	});
});
