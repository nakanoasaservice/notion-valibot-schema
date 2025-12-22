import * as v from "valibot";

/**
 * Schema to extract the `url` property from a Notion page property or `null`.
 *
 * **Input:**
 * ```
 * {
 *   url: string | null;
 * }
 * ```
 *
 * **Output:** `string | null`
 *
 * @example
 * ```ts
 * import * as v from "valibot";
 * import { NullableUrlSchema } from "@nakanoaas/notion-valibot-utils";
 *
 * const PageSchema = v.object({
 *   id: v.string(),
 *   properties: v.object({
 *     Website: NullableUrlSchema,
 *   }),
 * });
 *
 * const page = await notion.pages.retrieve({ page_id: "..." });
 * const parsed = v.parse(PageSchema, page);
 * // parsed.properties.Website: string | null
 * ```
 */
export const NullableUrlSchema = v.pipe(
	v.object({
		url: v.nullable(v.string()),
	}),
	v.transform((v) => v.url),
);

/**
 * Schema to extract the `url` property from a Notion page property.
 *
 * **Input:**
 * ```
 * {
 *   url: string;
 * }
 * ```
 *
 * **Output:** `string`
 *
 * @example
 * ```ts
 * import * as v from "valibot";
 * import { UrlSchema } from "@nakanoaas/notion-valibot-utils";
 *
 * const PageSchema = v.object({
 *   id: v.string(),
 *   properties: v.object({
 *     Website: UrlSchema,
 *   }),
 * });
 *
 * const page = await notion.pages.retrieve({ page_id: "..." });
 * const parsed = v.parse(PageSchema, page);
 * // parsed.properties.Website: string
 * ```
 */
export const UrlSchema = v.pipe(
	v.object({
		url: v.string(),
	}),
	v.transform((v) => v.url),
);
