import * as v from "valibot";

/**
 * Schema to extract the `email` property from a Notion page property.
 *
 * **Input:**
 * ```
 * {
 *   email: string;
 * }
 * ```
 *
 * **Output:** `string`
 *
 * @example
 * ```ts
 * import * as v from "valibot";
 * import { EmailSchema } from "@nakanoaas/notion-valibot-utils";
 *
 * const PageSchema = v.object({
 *   id: v.string(),
 *   properties: v.object({
 *     Email: EmailSchema,
 *   }),
 * });
 *
 * const page = await notion.pages.retrieve({ page_id: "..." });
 * const parsed = v.parse(PageSchema, page);
 * // parsed.properties.Email: string
 * ```
 */
export const EmailSchema = v.pipe(
	v.object({
		email: v.string(),
	}),
	v.transform((v) => v.email),
);

/**
 * Schema to extract the `email` property from a Notion page property or `null`.
 *
 * **Input:**
 * ```
 * {
 *   email: string | null;
 * }
 * ```
 *
 * **Output:** `string | null`
 *
 * @example
 * ```ts
 * import * as v from "valibot";
 * import { NullableEmailSchema } from "@nakanoaas/notion-valibot-utils";
 *
 * const PageSchema = v.object({
 *   id: v.string(),
 *   properties: v.object({
 *     Email: NullableEmailSchema,
 *   }),
 * });
 *
 * const page = await notion.pages.retrieve({ page_id: "..." });
 * const parsed = v.parse(PageSchema, page);
 * // parsed.properties.Email: string | null
 * ```
 */
export const NullableEmailSchema = v.pipe(
	v.object({
		email: v.nullable(v.string()),
	}),
	v.transform((v) => v.email),
);
