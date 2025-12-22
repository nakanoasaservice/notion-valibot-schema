import * as v from "valibot";

/**
 * Schema factory to extract the `formula` property result from a Notion page property.
 *
 * This is a generic schema factory that accepts another schema as a parameter,
 * allowing you to combine it with other schemas in this library to extract
 * typed formula results. The formula property in Notion can return different
 * types of values (string, number, boolean, or date) depending on the formula
 * configuration.
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
 * For example, if `RichTextSchema` is passed, the output will be `string`.
 *
 * @param schema - A schema that validates the formula result type.
 *                  Must accept one of: string, number, boolean, or date formula results.
 *
 * @example
 * ```ts
 * import * as v from "valibot";
 * import { FormulaSchema, RichTextSchema } from "@nakanoaas/notion-valibot-utils";
 *
 * const PageSchema = v.object({
 *   id: v.string(),
 *   properties: v.object({
 *     FormulaText: FormulaSchema(RichTextSchema),
 *   }),
 * });
 *
 * const page = await notion.pages.retrieve({ page_id: "..." });
 * const parsed = v.parse(PageSchema, page);
 * // parsed.properties.FormulaText: string
 * ```
 *
 * @example
 * ```ts
 * import * as v from "valibot";
 * import { FormulaSchema } from "@nakanoaas/notion-valibot-utils";
 *
 * // Custom schema for number formula
 * const NumberFormulaSchema = v.object({
 *   type: v.literal("number"),
 *   number: v.nullable(v.number()),
 * });
 *
 * const PageSchema = v.object({
 *   id: v.string(),
 *   properties: v.object({
 *     FormulaNumber: FormulaSchema(NumberFormulaSchema),
 *   }),
 * });
 *
 * const page = await notion.pages.retrieve({ page_id: "..." });
 * const parsed = v.parse(PageSchema, page);
 * // parsed.properties.FormulaNumber: { type: "number"; number: number | null }
 * ```
 */
export function FormulaSchema<
	S extends v.GenericSchema<
		| { type: "string"; string: string | null }
		| { type: "number"; number: number | null }
		| { type: "boolean"; boolean: boolean | null }
		| {
				type: "date";
				date: {
					start: string;
					end: string | null;
					time_zone: string | null;
				} | null;
		  },
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
