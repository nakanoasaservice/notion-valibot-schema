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
 * import { RichTextItemArraySchema } from "@nakanoaas/notion-valibot-utils";
 *
 * const PageSchema = v.object({
 *   id: v.string(),
 *   properties: v.object({
 *     Text: v.object({
 *       rich_text: RichTextItemArraySchema,
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
const RichTextItemArraySchema = v.array(
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
 * **Output:** `string` (non-empty)
 *
 * This schema validates that the resulting string is non-empty. Empty arrays or arrays with only empty `plain_text` values will be rejected.
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
		title: RichTextItemArraySchema,
	}),
	v.transform((v) => v.title.map((v) => v.plain_text).join("")),
	v.nonEmpty(),
);

/**
 * Schema to extract the `title` property from a Notion page property and transform it to a string or `null`.
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
 * **Output:** `string | null`
 *
 * If the `title` array is empty or all `plain_text` values are empty strings, this schema returns `null`. Otherwise, it joins all `plain_text` values into a single string.
 *
 * @example
 * ```ts
 * import * as v from "valibot";
 * import { NullableTitleSchema } from "@nakanoaas/notion-valibot-utils";
 *
 * const PageSchema = v.object({
 *   id: v.string(),
 *   properties: v.object({
 *     Title: NullableTitleSchema,
 *   }),
 * });
 *
 * const page = await notion.pages.retrieve({ page_id: "..." });
 * const parsed = v.parse(PageSchema, page);
 * // parsed.properties.Title: string | null
 * ```
 */
export const NullableTitleSchema = v.pipe(
	v.object({
		title: RichTextItemArraySchema,
	}),
	v.transform((v) => v.title.map((v) => v.plain_text).join("") || null),
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
 * **Output:** `string` (non-empty)
 *
 * This schema validates that the resulting string is non-empty. Empty arrays or arrays with only empty `plain_text` values will be rejected.
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
		rich_text: RichTextItemArraySchema,
	}),
	v.transform((v) => v.rich_text.map((v) => v.plain_text).join("")),
	v.nonEmpty(),
);

/**
 * Schema to extract the `rich_text` property from a Notion page property and transform it to a string or `null`.
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
 * **Output:** `string | null`
 *
 * If the `rich_text` array is empty or all `plain_text` values are empty strings, this schema returns `null`. Otherwise, it joins all `plain_text` values into a single string.
 *
 * @example
 * ```ts
 * import * as v from "valibot";
 * import { NullableRichTextSchema } from "@nakanoaas/notion-valibot-utils";
 *
 * const PageSchema = v.object({
 *   id: v.string(),
 *   properties: v.object({
 *     Description: NullableRichTextSchema,
 *   }),
 * });
 *
 * const page = await notion.pages.retrieve({ page_id: "..." });
 * const parsed = v.parse(PageSchema, page);
 * // parsed.properties.Description: string | null
 * ```
 */
export const NullableRichTextSchema = v.pipe(
	v.object({
		rich_text: RichTextItemArraySchema,
	}),
	v.transform((v) => v.rich_text.map((v) => v.plain_text).join("") || null),
);
