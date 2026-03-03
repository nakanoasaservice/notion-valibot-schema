import * as v from "valibot";

/**
 * Schema to extract the `number` property from a Notion page property.
 *
 * **Input:**
 * ```
 * {
 *   number: number;
 * }
 * ```
 *
 * **Output:** `number`
 *
 * @example
 * ```ts
 * import * as v from "valibot";
 * import { NumberSchema } from "@nakanoaas/notion-valibot-utils";
 *
 * const PageSchema = v.object({
 *   id: v.string(),
 *   properties: v.object({
 *     Number: NumberSchema,
 *   }),
 * });
 *
 * const page = await notion.pages.retrieve({ page_id: "..." });
 * const parsed = v.parse(PageSchema, page);
 * // parsed.properties.Number: number
 * ```
 */
export const NumberSchema = v.pipe(
	v.object({
		number: v.number(),
	}),
	v.transform((v) => v.number),
);

/**
 * Schema to extract the `number` property from a Notion page property or `null`.
 *
 * **Input:**
 * ```
 * {
 *   number: number | null;
 * }
 * ```
 *
 * **Output:** `number | null`
 *
 * @example
 * ```ts
 * import * as v from "valibot";
 * import { NullableNumberSchema } from "@nakanoaas/notion-valibot-utils";
 *
 * const PageSchema = v.object({
 *   id: v.string(),
 *   properties: v.object({
 *     Number: NullableNumberSchema,
 *   }),
 * });
 *
 * const page = await notion.pages.retrieve({ page_id: "..." });
 * const parsed = v.parse(PageSchema, page);
 * // parsed.properties.Number: number | null
 * ```
 */
export const NullableNumberSchema = v.pipe(
	v.object({
		number: v.nullable(v.number()),
	}),
	v.transform((v) => v.number),
);
