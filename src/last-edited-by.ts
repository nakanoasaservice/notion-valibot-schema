import * as v from "valibot";

import { PersonSchema } from "./people";

/**
 * Schema to extract the `last_edited_by` person name from a Notion page.
 *
 * **Input:**
 * ```
 * {
 *   last_edited_by: {
 *     id: string;
 *     object: "user" | "bot" | "group";
 *     name: string | null;
 *     ...
 *   }
 * }
 * ```
 *
 * **Output:** `string | null`
 *
 * @example
 * ```ts
 * import * as v from "valibot";
 * import { NullableLastEditedByNameSchema } from "@nakanoaas/notion-valibot-schema";
 *
 * const PageSchema = v.object({
 *   id: v.string(),
 *   properties: v.object({
 *     LastEditedByName: NullableLastEditedByNameSchema,
 *   }),
 * });
 *
 * const page = await notion.pages.retrieve({ page_id: "..." });
 * const parsed = v.parse(PageSchema, page);
 * // parsed.properties.LastEditedByName: string | null
 * ```
 */
export const NullableLastEditedByNameSchema = v.pipe(
	v.object({
		last_edited_by: PersonSchema,
	}),
	v.transform((v) => v.last_edited_by.name),
);

/**
 * Schema to extract the `last_edited_by` person ID from a Notion page.
 *
 * **Input:**
 * ```
 * {
 *   last_edited_by: {
 *     id: string;
 *     object: "user" | "bot" | "group";
 *     name: string | null;
 *     ...
 *   }
 * }
 * ```
 *
 * **Output:** `string`
 *
 * @example
 * ```ts
 * import * as v from "valibot";
 * import { LastEditedByIdSchema } from "@nakanoaas/notion-valibot-schema";
 *
 * const PageSchema = v.object({
 *   id: v.string(),
 *   properties: v.object({
 *     LastEditedById: LastEditedByIdSchema,
 *   }),
 * });
 *
 * const page = await notion.pages.retrieve({ page_id: "..." });
 * const parsed = v.parse(PageSchema, page);
 * // parsed.properties.LastEditedById: string
 * ```
 */
export const LastEditedByIdSchema = v.pipe(
	v.object({
		last_edited_by: PersonSchema,
	}),
	v.transform((v) => v.last_edited_by.id),
);
