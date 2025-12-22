import * as v from "valibot";

/**
 * Schema factory to extract the `multi_select` property from a Notion page property.
 *
 * This is a generic schema factory that accepts another schema as a parameter,
 * allowing you to combine it with other schemas in this library to extract
 * typed multi-select values. The multi-select property in Notion contains an
 * array of objects with a `name` field that can be validated using the provided schema.
 *
 * **Input:**
 * ```
 * {
 *   multi_select: Array<{
 *     name: string;
 *   }>;
 * }
 * ```
 *
 * **Output:** The output type depends on the schema passed as a parameter.
 * For example, if `v.string()` is passed, the output will be `string[]`.
 *
 * @param schema - A schema that validates the multi-select option name.
 *                  Must accept a string value.
 *
 * @example
 * ```ts
 * import * as v from "valibot";
 * import { MultiSelectSchema } from "@nakanoaas/notion-valibot-utils";
 *
 * const PageSchema = v.object({
 *   id: v.string(),
 *   properties: v.object({
 *     Tags: MultiSelectSchema(v.string()),
 *   }),
 * });
 *
 * const page = await notion.pages.retrieve({ page_id: "..." });
 * const parsed = v.parse(PageSchema, page);
 * // parsed.properties.Tags: string[]
 * ```
 *
 * @example
 * ```ts
 * import * as v from "valibot";
 * import { MultiSelectSchema } from "@nakanoaas/notion-valibot-utils";
 *
 * // Custom schema for enum values
 * const TagSchema = v.picklist(["urgent", "important", "normal"]);
 *
 * const PageSchema = v.object({
 *   id: v.string(),
 *   properties: v.object({
 *     Tags: MultiSelectSchema(TagSchema),
 *   }),
 * });
 *
 * const page = await notion.pages.retrieve({ page_id: "..." });
 * const parsed = v.parse(PageSchema, page);
 * // parsed.properties.Tags: ("urgent" | "important" | "normal")[]
 * ```
 */
export function MultiSelectSchema<T extends v.GenericSchema<string>>(
	schema: T,
) {
	return v.pipe(
		v.object({
			multi_select: v.array(
				v.object({
					name: schema,
				}),
			),
		}),
		// biome-ignore lint/style/noNonNullAssertion: valibot inference is not working correctly
		v.transform((v) => v.multi_select.map((v) => v.name!)),
	);
}
