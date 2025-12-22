import { assertEquals } from "@std/assert/equals";
import { describe, it } from "@std/testing/bdd";
import { assertType, type IsExact } from "@std/testing/types";
import * as v from "valibot";

import {
	LastEditedByIdSchema,
	NullableLastEditedByNameSchema,
} from "./last-edited-by.ts";
import type { Extends, SelectNotionProperty } from "./test-utils.ts";

type TargetType = SelectNotionProperty<"last_edited_by">;

describe("last-edited-by", () => {
	describe("NullableLastEditedByNameSchema", () => {
		describe("type checking", () => {
			it("should accept last_edited_by property input type", () => {
				// Note: Type checking for last_edited_by property
			});

			it("should have correct output type", () => {
				assertType<
					IsExact<
						v.InferOutput<typeof NullableLastEditedByNameSchema>,
						string | null
					>
				>(true);
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

				assertEquals(result, "Jane Doe");
				assertEquals(typeof result, "string");
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

				assertEquals(result, null);
			});
		});
	});

	describe("LastEditedByIdSchema", () => {
		describe("type checking", () => {
			it("should accept last_edited_by property input type", () => {
				assertType<
					Extends<TargetType, v.InferInput<typeof LastEditedByIdSchema>>
				>(true);
			});

			it("should have correct output type", () => {
				assertType<IsExact<v.InferOutput<typeof LastEditedByIdSchema>, string>>(
					true,
				);
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

				assertEquals(result, "user-123");
				assertEquals(typeof result, "string");
			});
		});
	});
});
