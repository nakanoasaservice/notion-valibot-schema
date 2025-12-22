import * as v from "valibot";

/**
 * Schema to extract the `unique_id` property number from a Notion page property.
 *
 * **Input:**
 * ```
 * {
 *   unique_id: {
 *     number: number;
 *   };
 * }
 * ```
 *
 * **Output:** `number`
 *
 * @example
 * ```ts
 * import * as v from "valibot";
 * import { UniqueIdNumberSchema } from "@nakanoaas/notion-valibot-utils";
 *
 * const PageSchema = v.object({
 *   id: v.string(),
 *   properties: v.object({
 *     ID: UniqueIdNumberSchema,
 *   }),
 * });
 *
 * const page = await notion.pages.retrieve({ page_id: "..." });
 * const parsed = v.parse(PageSchema, page);
 * // parsed.properties.ID: number
 * ```
 */
export const UniqueIdNumberSchema = v.pipe(
	v.object({
		unique_id: v.object({
			number: v.number(),
		}),
	}),
	v.transform((v) => v.unique_id.number),
);

/**
 * Schema to extract the `unique_id` property from a Notion page property.
 *
 * **Input:**
 * ```
 * {
 *   unique_id: {
 *     prefix: string | null;
 *     number: number | null;
 *   };
 * }
 * ```
 *
 * **Output:**
 * ```
 * {
 *   prefix: string | null;
 *   number: number | null;
 * }
 * ```
 *
 * @example
 * ```ts
 * import * as v from "valibot";
 * import { NullableUniqueIdSchema } from "@nakanoaas/notion-valibot-utils";
 *
 * const PageSchema = v.object({
 *   id: v.string(),
 *   properties: v.object({
 *     ID: NullableUniqueIdSchema,
 *   }),
 * });
 *
 * const page = await notion.pages.retrieve({ page_id: "..." });
 * const parsed = v.parse(PageSchema, page);
 * // parsed.properties.ID: { prefix: string | null; number: number | null }
 * ```
 */
export const NullableUniqueIdSchema = v.pipe(
	v.object({
		unique_id: v.object({
			prefix: v.nullable(v.string()),
			number: v.nullable(v.number()),
		}),
	}),
	v.transform((v) => v.unique_id),
);
