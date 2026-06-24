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
 * import { UniqueIdSchema } from "@nakanoaas/notion-valibot-utils";
 *
 * const PageSchema = v.object({
 *   id: v.string(),
 *   properties: v.object({
 *     ID: UniqueIdSchema,
 *   }),
 * });
 *
 * const page = await notion.pages.retrieve({ page_id: "..." });
 * const parsed = v.parse(PageSchema, page);
 * // parsed.properties.ID: number
 * ```
 */
export const UniqueIdSchema = v.pipe(
	v.object({
		unique_id: v.object({
			number: v.number(),
		}),
	}),
	v.transform((v) => v.unique_id.number),
);

/**
 * Schema to extract the `unique_id` property as a prefixed string from a Notion page property.
 *
 * **Input:**
 * ```
 * {
 *   unique_id: {
 *     prefix: string;
 *     number: number;
 *   };
 * }
 * ```
 *
 * **Output:** `string` (e.g. `"PREFIX-123"`)
 *
 * @example
 * ```ts
 * import * as v from "valibot";
 * import { PrefixedUniqueIdSchema } from "@nakanoaas/notion-valibot-utils";
 *
 * const PageSchema = v.object({
 *   id: v.string(),
 *   properties: v.object({
 *     ID: PrefixedUniqueIdSchema,
 *   }),
 * });
 *
 * const page = await notion.pages.retrieve({ page_id: "..." });
 * const parsed = v.parse(PageSchema, page);
 * // parsed.properties.ID: string (e.g. "PREFIX-123")
 * ```
 */
export const PrefixedUniqueIdSchema = v.pipe(
	v.object({
		unique_id: v.object({
			prefix: v.string(),
			number: v.number(),
		}),
	}),
	v.transform((v) => `${v.unique_id.prefix}-${v.unique_id.number}`),
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
 * import { FullUniqueIdSchema } from "@nakanoaas/notion-valibot-utils";
 *
 * const PageSchema = v.object({
 *   id: v.string(),
 *   properties: v.object({
 *     ID: FullUniqueIdSchema,
 *   }),
 * });
 *
 * const page = await notion.pages.retrieve({ page_id: "..." });
 * const parsed = v.parse(PageSchema, page);
 * // parsed.properties.ID: { prefix: string | null; number: number | null }
 * ```
 */
export const FullUniqueIdSchema = v.pipe(
	v.object({
		unique_id: v.object({
			prefix: v.nullable(v.string()),
			number: v.nullable(v.number()),
		}),
	}),
	v.transform((v) => v.unique_id),
);
