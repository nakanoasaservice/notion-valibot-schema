import * as v from "valibot";

import { PersonSchema } from "./people";

/**
 * Schema to extract the `created_by` person object from a Notion page.
 *
 * **Input:**
 * ```
 * {
 *   created_by: {
 *     id: string;
 *     object: "user" | "bot" | "group";
 *     name: string | null;
 *     ...
 *   }
 * }
 * ```
 *
 * **Output:**
 * ```
 * {
 *   id: string;
 *   object: "user" | "bot" | "group";
 *   name: string | null;
 * }
 * ```
 *
 * @example
 * ```ts
 * import * as v from "valibot";
 * import { CreatedBySchema } from "@nakanoaas/notion-valibot-schema";
 *
 * const PageSchema = v.object({
 *   id: v.string(),
 *   properties: v.object({
 *     CreatedBy: CreatedBySchema,
 *   }),
 * });
 *
 * const page = await notion.pages.retrieve({ page_id: "..." });
 * const parsed = v.parse(PageSchema, page);
 * // parsed.properties.CreatedBy: { id: string; object: "user" | "bot" | "group"; name: string | null }
 * ```
 */
export const CreatedBySchema = v.pipe(
	v.object({
		created_by: PersonSchema,
	}),
	v.transform((v) => v.created_by),
);

/**
 * Schema to extract the `created_by` person ID from a Notion page.
 *
 * **Input:**
 * ```
 * {
 *   created_by: {
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
 * import { CreatedByIdSchema } from "@nakanoaas/notion-valibot-schema";
 *
 * const PageSchema = v.object({
 *   id: v.string(),
 *   properties: v.object({
 *     CreatedById: CreatedByIdSchema,
 *   }),
 * });
 *
 * const page = await notion.pages.retrieve({ page_id: "..." });
 * const parsed = v.parse(PageSchema, page);
 * // parsed.properties.CreatedById: string
 * ```
 */
export const CreatedByIdSchema = v.pipe(
	v.object({
		created_by: PersonSchema,
	}),
	v.transform((v) => v.created_by.id),
);
