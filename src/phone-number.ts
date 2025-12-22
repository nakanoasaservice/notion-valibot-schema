import * as v from "valibot";

/**
 * Schema to extract the `phone_number` property from a Notion page property.
 *
 * **Input:**
 * ```
 * {
 *   phone_number: string;
 * }
 * ```
 *
 * **Output:** `string`
 *
 * @example
 * ```ts
 * import * as v from "valibot";
 * import { PhoneNumberSchema } from "@nakanoaas/notion-valibot-utils";
 *
 * const PageSchema = v.object({
 *   id: v.string(),
 *   properties: v.object({
 *     Phone: PhoneNumberSchema,
 *   }),
 * });
 *
 * const page = await notion.pages.retrieve({ page_id: "..." });
 * const parsed = v.parse(PageSchema, page);
 * // parsed.properties.Phone: string
 * ```
 */
export const PhoneNumberSchema = v.pipe(
	v.object({
		phone_number: v.string(),
	}),
	v.transform((v) => v.phone_number),
);

/**
 * Schema to extract the `phone_number` property from a Notion page property or `null`.
 *
 * **Input:**
 * ```
 * {
 *   phone_number: string | null;
 * }
 * ```
 *
 * **Output:** `string | null`
 *
 * @example
 * ```ts
 * import * as v from "valibot";
 * import { NullablePhoneNumberSchema } from "@nakanoaas/notion-valibot-utils";
 *
 * const PageSchema = v.object({
 *   id: v.string(),
 *   properties: v.object({
 *     Phone: NullablePhoneNumberSchema,
 *   }),
 * });
 *
 * const page = await notion.pages.retrieve({ page_id: "..." });
 * const parsed = v.parse(PageSchema, page);
 * // parsed.properties.Phone: string | null
 * ```
 */
export const NullablePhoneNumberSchema = v.pipe(
	v.object({
		phone_number: v.nullable(v.string()),
	}),
	v.transform((v) => v.phone_number),
);
