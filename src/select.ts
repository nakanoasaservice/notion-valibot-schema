import * as v from "valibot";

/**
 * Schema factory to extract the `select` property from a Notion page property.
 *
 * This is a generic schema factory that accepts another schema as a parameter,
 * allowing you to combine it with other schemas in this library to extract
 * typed select values. The select property in Notion contains an object with
 * a `name` field that can be validated using the provided schema.
 *
 * **Input:**
 * ```
 * {
 *   select: {
 *     name: string;
 *   };
 * }
 * ```
 *
 * **Output:** The output type depends on the schema passed as a parameter.
 * For example, if `v.string()` is passed, the output will be `string`.
 *
 * @param schema - A schema that validates the select option name.
 *                  Must accept a string value.
 *
 * @example
 * ```ts
 * import * as v from "valibot";
 * import { SelectSchema } from "@nakanoaas/notion-valibot-utils";
 *
 * const PageSchema = v.object({
 *   id: v.string(),
 *   properties: v.object({
 *     Status: SelectSchema(v.string()),
 *   }),
 * });
 *
 * const page = await notion.pages.retrieve({ page_id: "..." });
 * const parsed = v.parse(PageSchema, page);
 * // parsed.properties.Status: string
 * ```
 *
 * @example
 * ```ts
 * import * as v from "valibot";
 * import { SelectSchema } from "@nakanoaas/notion-valibot-utils";
 *
 * // Custom schema for enum values
 * const StatusSchema = v.picklist(["todo", "in-progress", "done"]);
 *
 * const PageSchema = v.object({
 *   id: v.string(),
 *   properties: v.object({
 *     Status: SelectSchema(StatusSchema),
 *   }),
 * });
 *
 * const page = await notion.pages.retrieve({ page_id: "..." });
 * const parsed = v.parse(PageSchema, page);
 * // parsed.properties.Status: "todo" | "in-progress" | "done"
 * ```
 */
export function SelectSchema<S extends v.GenericSchema<string>>(schema: S) {
	return v.pipe(
		v.object({
			select: v.object({
				name: schema,
			}),
		}),
		// biome-ignore lint/style/noNonNullAssertion: valibot inference is not working correctly
		v.transform((v) => v.select.name!),
	);
}

/**
 * Schema factory to extract the `select` property from a Notion page property or `null`.
 *
 * This is a generic schema factory that accepts another schema as a parameter,
 * allowing you to combine it with other schemas in this library to extract
 * typed select values. The select property in Notion contains an object with
 * a `name` field that can be validated using the provided schema, or `null` if not set.
 *
 * **Input:**
 * ```
 * {
 *   select: {
 *     name: string;
 *   } | null;
 * }
 * ```
 *
 * **Output:** The output type depends on the schema passed as a parameter, or `null`.
 * For example, if `v.string()` is passed, the output will be `string | null`.
 *
 * @param schema - A schema that validates the select option name.
 *                  Must accept a string value.
 *
 * @example
 * ```ts
 * import * as v from "valibot";
 * import { NullableSelectSchema } from "@nakanoaas/notion-valibot-utils";
 *
 * const PageSchema = v.object({
 *   id: v.string(),
 *   properties: v.object({
 *     Status: NullableSelectSchema(v.string()),
 *   }),
 * });
 *
 * const page = await notion.pages.retrieve({ page_id: "..." });
 * const parsed = v.parse(PageSchema, page);
 * // parsed.properties.Status: string | null
 * ```
 *
 * @example
 * ```ts
 * import * as v from "valibot";
 * import { NullableSelectSchema } from "@nakanoaas/notion-valibot-utils";
 *
 * // Custom schema for enum values
 * const StatusSchema = v.picklist(["todo", "in-progress", "done"]);
 *
 * const PageSchema = v.object({
 *   id: v.string(),
 *   properties: v.object({
 *     Status: NullableSelectSchema(StatusSchema),
 *   }),
 * });
 *
 * const page = await notion.pages.retrieve({ page_id: "..." });
 * const parsed = v.parse(PageSchema, page);
 * // parsed.properties.Status: "todo" | "in-progress" | "done" | null
 * ```
 */
export function NullableSelectSchema<S extends v.GenericSchema<string>>(
	schema: S,
) {
	return v.pipe(
		v.object({
			select: v.nullable(
				v.object({
					name: schema,
				}),
			),
		}),
		v.transform((v) => v.select?.name ?? null),
	);
}
