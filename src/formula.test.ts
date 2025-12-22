import * as v from "valibot";
import { describe, expect, expectTypeOf, it } from "vitest";

import { FormulaSchema } from "./formula.ts";
import type { SelectNotionProperty } from "./test-utils.ts";

type TargetType = SelectNotionProperty<"formula">;

describe("formula", () => {
	describe("FormulaSchema", () => {
		describe("type checking", () => {
			it("should accept formula property input type", () => {
				const Schema = FormulaSchema(
					v.variant("type", [
						v.object({
							type: v.literal("string"),
							string: v.any(),
						}),
						v.object({
							type: v.literal("number"),
							number: v.any(),
						}),
						v.object({
							type: v.literal("boolean"),
							boolean: v.any(),
						}),
						v.object({
							type: v.literal("date"),
							date: v.any(),
						}),
					]),
				);

				expectTypeOf<TargetType>().toExtend<v.InferInput<typeof Schema>>();
			});

			it("should have correct output type", () => {
				const Schema = FormulaSchema(
					v.pipe(
						v.object({
							type: v.literal("string"),
							string: v.string(),
						}),
						v.transform((v) => v.string),
					),
				);

				expectTypeOf<v.InferOutput<typeof Schema>>().toEqualTypeOf<string>();
			});
		});

		describe("parsing", () => {
			it("should parse string formula and return string value", () => {
				const Schema = FormulaSchema(
					v.pipe(
						v.object({
							type: v.literal("string"),
							string: v.string(),
						}),
						v.transform((v) => v.string),
					),
				);

				const result = v.parse(Schema, {
					formula: {
						type: "string",
						string: "Hello World",
					},
				} satisfies TargetType);

				expect(result).toEqual("Hello World");
			});

			it("should parse date formula and return date object", () => {
				const Schema = FormulaSchema(
					v.pipe(
						v.object({
							type: v.literal("date"),
							date: v.object({
								start: v.string(),
								end: v.nullable(v.string()),
								time_zone: v.nullable(v.string()),
							}),
						}),
						v.transform((v) => new Date(v.date.start)),
					),
				);

				const result = v.parse(Schema, {
					formula: {
						type: "date",
						date: {
							start: "2024-01-15T00:00:00.000Z",
							end: "2024-01-20T00:00:00.000Z",
							time_zone: null,
						},
					},
				} satisfies TargetType);

				expect(result instanceof Date).toBe(true);
			});

			it("should parse date formula with null end date", () => {
				const Schema = FormulaSchema(
					v.pipe(
						v.object({
							type: v.literal("date"),
							date: v.object({
								start: v.string(),
								end: v.nullable(v.string()),
								time_zone: v.nullable(v.string()),
							}),
						}),
						v.transform((v) => new Date(v.date.start)),
					),
				);

				const result = v.parse(Schema, {
					formula: {
						type: "date",
						date: {
							start: "2024-01-15T00:00:00.000Z",
							end: null,
							time_zone: null,
						},
					},
				} satisfies TargetType);

				expect(result !== null).toBe(true);
				expect(result instanceof Date).toBe(true);
			});

			it("should parse date formula with null date", () => {
				const Schema = FormulaSchema(
					v.pipe(
						v.object({
							type: v.literal("date"),
							date: v.nullable(
								v.object({
									start: v.string(),
									end: v.nullable(v.string()),
									time_zone: v.nullable(v.string()),
								}),
							),
						}),
						v.transform((v) => (v.date ? new Date(v.date.start) : null)),
					),
				);
				const result = v.parse(Schema, {
					formula: {
						type: "date",
						date: null,
					},
				} satisfies TargetType);

				expect(result).toBe(null);
			});

			it("should parse number formula and return number value", () => {
				const Schema = FormulaSchema(
					v.pipe(
						v.object({
							type: v.literal("number"),
							number: v.number(),
						}),
						v.transform((v) => v.number),
					),
				);

				const result = v.parse(Schema, {
					formula: {
						type: "number",
						number: 42,
					},
				} satisfies TargetType);

				expect(result).toEqual(42);
				expect(typeof result).toEqual("number");
			});

			it("should parse boolean formula and return boolean value", () => {
				const Schema = FormulaSchema(
					v.pipe(
						v.object({
							type: v.literal("boolean"),
							boolean: v.boolean(),
						}),
						v.transform((v) => v.boolean),
					),
				);

				const result = v.parse(Schema, {
					formula: {
						type: "boolean",
						boolean: true,
					},
				} satisfies TargetType);

				expect(result).toEqual(true);
				expect(typeof result).toEqual("boolean");
			});
		});
	});
});
