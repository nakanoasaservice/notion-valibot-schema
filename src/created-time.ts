import * as v from "valibot";

/**
 * Schema to extract the `created_time` property from a Notion page and transform it to a `Date` object.
 *
 * **Input:**
 * ```
 * {
 *   created_time: string;
 * }
 * ```
 *
 * **Output:** `Date`
 *
 * @example
 * ```ts
 * import * as v from "valibot";
 * import { CreatedTimeSchema } from "@nakanoaas/notion-valibot-utils";
 *
 * const PageSchema = v.object({
 *   id: v.string(),
 *   created_time: CreatedTimeSchema,
 * });
 *
 * const page = await notion.pages.retrieve({ page_id: "..." });
 * const parsed = v.parse(PageSchema, page);
 * // parsed.created_time: Date
 * ```
 */
export const CreatedTimeSchema = v.pipe(
	v.object({
		created_time: v.string(),
	}),
	v.transform((v) => new Date(v.created_time)),
);
