import * as v from "valibot";

/**
 * Schema to extract the `last_edited_time` property from a Notion page and transform it to a `Date` object.
 *
 * **Input:**
 * ```
 * {
 *   last_edited_time: string;
 * }
 * ```
 *
 * **Output:** `Date`
 *
 * @example
 * ```ts
 * import * as v from "valibot";
 * import { LastEditedTimeSchema } from "@nakanoaas/notion-valibot-utils";
 *
 * const PageSchema = v.object({
 *   id: v.string(),
 *   last_edited_time: LastEditedTimeSchema,
 * });
 *
 * const page = await notion.pages.retrieve({ page_id: "..." });
 * const parsed = v.parse(PageSchema, page);
 * // parsed.last_edited_time: Date
 * ```
 */
export const LastEditedTimeSchema = v.pipe(
	v.object({
		last_edited_time: v.string(),
	}),
	v.transform((v) => new Date(v.last_edited_time)),
);
