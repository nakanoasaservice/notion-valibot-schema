import * as v from "valibot";

/**
 * Schema for a Notion rich text array structure.
 *
 * **Input:**
 * ```
 * Array<{
 *   plain_text: string;
 * }>
 * ```
 *
 * **Output:**
 * ```
 * Array<{
 *   plain_text: string;
 * }>
 * ```
 *
 * @example
 * ```ts
 * import * as v from "valibot";
 * import { RichTextArraySchema } from "@nakanoaas/notion-valibot-utils";
 *
 * const PageSchema = v.object({
 *   id: v.string(),
 *   properties: v.object({
 *     Text: v.object({
 *       rich_text: RichTextArraySchema,
 *     }),
 *   }),
 * });
 *
 * const page = await notion.pages.retrieve({ page_id: "..." });
 * const parsed = v.parse(PageSchema, page);
 * // parsed.properties.Text.rich_text: Array<{ plain_text: string }>
 * ```
 *
 * @internal
 */
const RichTextArraySchema = v.array(
	v.object({
		plain_text: v.string(),
	}),
);

/**
 * Schema to extract the `title` property from a Notion page property and transform it to a string.
 *
 * **Input:**
 * ```
 * {
 *   title: Array<{
 *     plain_text: string;
 *   }>;
 * }
 * ```
 *
 * **Output:** `string`
 *
 * @example
 * ```ts
 * import * as v from "valibot";
 * import { TitleSchema } from "@nakanoaas/notion-valibot-utils";
 *
 * const PageSchema = v.object({
 *   id: v.string(),
 *   properties: v.object({
 *     Title: TitleSchema,
 *   }),
 * });
 *
 * const page = await notion.pages.retrieve({ page_id: "..." });
 * const parsed = v.parse(PageSchema, page);
 * // parsed.properties.Title: string
 * ```
 */
export const TitleSchema = v.pipe(
	v.object({
		title: RichTextArraySchema,
	}),
	v.transform((v) => v.title.map((v) => v.plain_text).join("")),
);

/**
 * Schema to extract the `rich_text` property from a Notion page property and transform it to a string.
 *
 * **Input:**
 * ```
 * {
 *   rich_text: Array<{
 *     plain_text: string;
 *   }>;
 * }
 * ```
 *
 * **Output:** `string`
 *
 * @example
 * ```ts
 * import * as v from "valibot";
 * import { RichTextSchema } from "@nakanoaas/notion-valibot-utils";
 *
 * const PageSchema = v.object({
 *   id: v.string(),
 *   properties: v.object({
 *     Description: RichTextSchema,
 *   }),
 * });
 *
 * const page = await notion.pages.retrieve({ page_id: "..." });
 * const parsed = v.parse(PageSchema, page);
 * // parsed.properties.Description: string
 * ```
 */
export const RichTextSchema = v.pipe(
	v.object({
		rich_text: RichTextArraySchema,
	}),
	v.transform((v) => v.rich_text.map((v) => v.plain_text).join("")),
);
