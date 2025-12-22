import * as v from "valibot";

/**
 * Schema to extract the `checkbox` property from a Notion page property.
 *
 * **Input:**
 * ```
 * {
 *   checkbox: boolean;
 * }
 * ```
 *
 * **Output:** `boolean`
 *
 * @example
 * ```ts
 * import * as v from "valibot";
 * import { CheckboxSchema } from "@nakanoaas/notion-valibot-utils";
 *
 * const PageSchema = v.object({
 *   id: v.string(),
 *   properties: v.object({
 *     Checkbox: CheckboxSchema,
 *   }),
 * });
 *
 * const page = await notion.pages.retrieve({ page_id: "..." });
 * const parsed = v.parse(PageSchema, page);
 * // parsed.properties.Checkbox: boolean
 * ```
 */
export const CheckboxSchema = v.pipe(
	v.object({
		checkbox: v.boolean(),
	}),
	v.transform((v) => v.checkbox),
);
