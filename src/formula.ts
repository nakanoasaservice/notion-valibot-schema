import * as v from "valibot";

/**
 * Schema factory to extract the `formula` property result from a Notion page property.
 *
 * This is a generic schema factory that accepts another schema as a parameter,
 * allowing you to combine it with the formula, number, and date schemas in this library
 * to extract typed formula results (e.g. string, number, boolean, or date formulas).
 *
 * **Input:**
 * ```
 * {
 *   formula: {
 *     type: "string" | "number" | "boolean" | "date";
 *     string?: string | null;
 *     number?: number | null;
 *     boolean?: boolean | null;
 *     date?: {
 *       start: string;
 *       end: string | null;
 *       time_zone: string | null;
 *     } | null;
 *   }
 * }
 * ```
 *
 * **Output:** The output type depends on the schema passed as a parameter.
 * For example, if `StringFormulaSchema` is passed, the output will be `string`.
 *
 * @param schema - A schema that validates the formula result object.
 *                  Use the pre-built `*FormulaSchema` helpers for string, number, and boolean,
 *                  or the date schemas from this library for date formulas.
 *
 * @example
 * ```ts
 * import * as v from "valibot";
 * import {
 *   BooleanFormulaSchema,
 *   FormulaSchema,
 *   NumberFormulaSchema,
 *   SingleDateSchema,
 *   StringFormulaSchema,
 * } from "@nakanoaas/notion-valibot-schema";
 *
 * const PageSchema = v.object({
 *   id: v.string(),
 *   properties: v.object({
 *     FormulaText: FormulaSchema(StringFormulaSchema),
 *     FormulaNumber: FormulaSchema(NumberFormulaSchema),
 *     FormulaBoolean: FormulaSchema(BooleanFormulaSchema),
 *     FormulaDate: FormulaSchema(SingleDateSchema),
 *   }),
 * });
 *
 * const page = await notion.pages.retrieve({ page_id: "..." });
 * const parsed = v.parse(PageSchema, page);
 * // parsed.properties.FormulaText: string
 * // parsed.properties.FormulaNumber: number
 * // parsed.properties.FormulaBoolean: boolean
 * // parsed.properties.FormulaDate: Date
 * ```
 */
export function FormulaSchema<
	S extends v.GenericSchema<
		| { boolean: boolean | null }
		| {
				date: {
					start: string;
					end: string | null;
					time_zone: string | null;
				} | null;
		  }
		| { number: number | null }
		| { string: string | null },
		unknown
	>,
>(schema: S) {
	return v.pipe(
		v.object({
			formula: schema,
		}),
		// biome-ignore lint/style/noNonNullAssertion: valibot inference is not working correctly
		v.transform((v) => v.formula!),
	);
}

/**
 * Pre-built inner schema for a non-nullable string formula result.
 *
 * Validates `{ string: string }` and extracts the `string` value.
 * Use with {@link FormulaSchema} when the formula is guaranteed to return a string.
 *
 * **Input:** `{ string: string }`
 * **Output:** `string`
 *
 * @example
 * ```ts
 * import * as v from "valibot";
 * import { FormulaSchema, StringFormulaSchema } from "@nakanoaas/notion-valibot-schema";
 *
 * const PageSchema = v.object({
 *   id: v.string(),
 *   properties: v.object({
 *     MyFormula: FormulaSchema(StringFormulaSchema),
 *   }),
 * });
 *
 * const page = await notion.pages.retrieve({ page_id: "..." });
 * const parsed = v.parse(PageSchema, page);
 * // parsed.properties.MyFormula: string
 * ```
 */
export const StringFormulaSchema = v.pipe(
	v.object({
		string: v.string(),
	}),
	v.transform((v) => v.string),
);

/**
 * Pre-built inner schema for a nullable string formula result.
 *
 * Validates `{ string: string | null }` and extracts the `string` value.
 * Use with {@link FormulaSchema} when the string formula result may be null.
 *
 * **Input:** `{ string: string | null }`
 * **Output:** `string | null`
 *
 * @example
 * ```ts
 * import * as v from "valibot";
 * import { FormulaSchema, NullableStringFormulaSchema } from "@nakanoaas/notion-valibot-schema";
 *
 * const PageSchema = v.object({
 *   id: v.string(),
 *   properties: v.object({
 *     MyFormula: FormulaSchema(NullableStringFormulaSchema),
 *   }),
 * });
 *
 * const page = await notion.pages.retrieve({ page_id: "..." });
 * const parsed = v.parse(PageSchema, page);
 * // parsed.properties.MyFormula: string | null
 * ```
 */
export const NullableStringFormulaSchema = v.pipe(
	v.object({
		string: v.nullable(v.string()),
	}),
	v.transform((v) => v.string),
);

/**
 * Pre-built inner schema for a non-nullable number formula result.
 *
 * Validates `{ number: number }` and extracts the `number` value.
 * Use with {@link FormulaSchema} when the formula is guaranteed to return a number.
 *
 * **Input:** `{ number: number }`
 * **Output:** `number`
 *
 * @example
 * ```ts
 * import * as v from "valibot";
 * import { FormulaSchema, NumberFormulaSchema } from "@nakanoaas/notion-valibot-schema";
 *
 * const PageSchema = v.object({
 *   id: v.string(),
 *   properties: v.object({
 *     MyFormula: FormulaSchema(NumberFormulaSchema),
 *   }),
 * });
 *
 * const page = await notion.pages.retrieve({ page_id: "..." });
 * const parsed = v.parse(PageSchema, page);
 * // parsed.properties.MyFormula: number
 * ```
 */
export const NumberFormulaSchema = v.pipe(
	v.object({
		number: v.number(),
	}),
	v.transform((v) => v.number),
);

/**
 * Pre-built inner schema for a nullable number formula result.
 *
 * Validates `{ number: number | null }` and extracts the `number` value.
 * Use with {@link FormulaSchema} when the number formula result may be null.
 *
 * **Input:** `{ number: number | null }`
 * **Output:** `number | null`
 *
 * @example
 * ```ts
 * import * as v from "valibot";
 * import { FormulaSchema, NullableNumberFormulaSchema } from "@nakanoaas/notion-valibot-schema";
 *
 * const PageSchema = v.object({
 *   id: v.string(),
 *   properties: v.object({
 *     MyFormula: FormulaSchema(NullableNumberFormulaSchema),
 *   }),
 * });
 *
 * const page = await notion.pages.retrieve({ page_id: "..." });
 * const parsed = v.parse(PageSchema, page);
 * // parsed.properties.MyFormula: number | null
 * ```
 */
export const NullableNumberFormulaSchema = v.pipe(
	v.object({
		number: v.nullable(v.number()),
	}),
	v.transform((v) => v.number),
);

/**
 * Pre-built inner schema for a non-nullable boolean formula result.
 *
 * Validates `{ boolean: boolean }` and extracts the `boolean` value.
 * Use with {@link FormulaSchema} when the formula is guaranteed to return a boolean.
 *
 * **Input:** `{ boolean: boolean }`
 * **Output:** `boolean`
 *
 * @example
 * ```ts
 * import * as v from "valibot";
 * import { FormulaSchema, BooleanFormulaSchema } from "@nakanoaas/notion-valibot-schema";
 *
 * const PageSchema = v.object({
 *   id: v.string(),
 *   properties: v.object({
 *     MyFormula: FormulaSchema(BooleanFormulaSchema),
 *   }),
 * });
 *
 * const page = await notion.pages.retrieve({ page_id: "..." });
 * const parsed = v.parse(PageSchema, page);
 * // parsed.properties.MyFormula: boolean
 * ```
 */
export const BooleanFormulaSchema = v.pipe(
	v.object({
		boolean: v.boolean(),
	}),
	v.transform((v) => v.boolean),
);

/**
 * Pre-built inner schema for a nullable boolean formula result.
 *
 * Validates `{ boolean: boolean | null }` and extracts the `boolean` value.
 * Use with {@link FormulaSchema} when the boolean formula result may be null.
 *
 * **Input:** `{ boolean: boolean | null }`
 * **Output:** `boolean | null`
 *
 * @example
 * ```ts
 * import * as v from "valibot";
 * import { FormulaSchema, NullableBooleanFormulaSchema } from "@nakanoaas/notion-valibot-schema";
 *
 * const PageSchema = v.object({
 *   id: v.string(),
 *   properties: v.object({
 *     MyFormula: FormulaSchema(NullableBooleanFormulaSchema),
 *   }),
 * });
 *
 * const page = await notion.pages.retrieve({ page_id: "..." });
 * const parsed = v.parse(PageSchema, page);
 * // parsed.properties.MyFormula: boolean | null
 * ```
 */
export const NullableBooleanFormulaSchema = v.pipe(
	v.object({
		boolean: v.nullable(v.boolean()),
	}),
	v.transform((v) => v.boolean),
);
