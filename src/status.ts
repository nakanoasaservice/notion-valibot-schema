import * as v from "valibot";

/**
 * Schema factory to extract the `status` property from a Notion page property.
 *
 * This is a generic schema factory that accepts another schema as a parameter,
 * allowing you to combine it with other schemas in this library to extract
 * typed status values. The status property in Notion contains an object with
 * a `name` field that can be validated using the provided schema.
 *
 * **Input:**
 * ```
 * {
 *   status: {
 *     name: string;
 *   };
 * }
 * ```
 *
 * **Output:** The output type depends on the schema passed as a parameter.
 * For example, if `v.string()` is passed, the output will be `string`.
 *
 * @param schema - A schema that validates the status option name.
 *                  Must accept a string value.
 *
 * @example
 * ```ts
 * import * as v from "valibot";
 * import { StatusSchema } from "@nakanoaas/notion-valibot-utils";
 *
 * const PageSchema = v.object({
 *   id: v.string(),
 *   properties: v.object({
 *     Status: StatusSchema(v.string()),
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
 * import { StatusSchema } from "@nakanoaas/notion-valibot-utils";
 *
 * // Custom schema for enum values
 * const StatusOptionSchema = v.picklist(["not-started", "in-progress", "completed"]);
 *
 * const PageSchema = v.object({
 *   id: v.string(),
 *   properties: v.object({
 *     Status: StatusSchema(StatusOptionSchema),
 *   }),
 * });
 *
 * const page = await notion.pages.retrieve({ page_id: "..." });
 * const parsed = v.parse(PageSchema, page);
 * // parsed.properties.Status: "not-started" | "in-progress" | "completed"
 * ```
 */
export function StatusSchema<S extends v.GenericSchema<string>>(schema: S) {
	return v.pipe(
		v.object({
			status: v.object({
				name: schema,
			}),
		}),
		// biome-ignore lint/style/noNonNullAssertion: valibot inference is not working correctly
		v.transform((v) => v.status.name!),
	);
}

/**
 * Schema factory to extract the `status` property from a Notion page property or `null`.
 *
 * This is a generic schema factory that accepts another schema as a parameter,
 * allowing you to combine it with other schemas in this library to extract
 * typed status values. The status property in Notion contains an object with
 * a `name` field that can be validated using the provided schema, or `null` if not set.
 *
 * **Input:**
 * ```
 * {
 *   status: {
 *     name: string;
 *   } | null;
 * }
 * ```
 *
 * **Output:** The output type depends on the schema passed as a parameter, or `null`.
 * For example, if `v.string()` is passed, the output will be `string | null`.
 *
 * @param schema - A schema that validates the status option name.
 *                  Must accept a string value.
 *
 * @example
 * ```ts
 * import * as v from "valibot";
 * import { NullableStatusSchema } from "@nakanoaas/notion-valibot-utils";
 *
 * const PageSchema = v.object({
 *   id: v.string(),
 *   properties: v.object({
 *     Status: NullableStatusSchema(v.string()),
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
 * import { NullableStatusSchema } from "@nakanoaas/notion-valibot-utils";
 *
 * // Custom schema for enum values
 * const StatusOptionSchema = v.picklist(["not-started", "in-progress", "completed"]);
 *
 * const PageSchema = v.object({
 *   id: v.string(),
 *   properties: v.object({
 *     Status: NullableStatusSchema(StatusOptionSchema),
 *   }),
 * });
 *
 * const page = await notion.pages.retrieve({ page_id: "..." });
 * const parsed = v.parse(PageSchema, page);
 * // parsed.properties.Status: "not-started" | "in-progress" | "completed" | null
 * ```
 */
export function NullableStatusSchema<S extends v.GenericSchema<string>>(
	schema: S,
) {
	return v.pipe(
		v.object({
			status: v.nullable(
				v.object({
					name: schema,
				}),
			),
		}),
		v.transform((v) => v.status?.name ?? null),
	);
}
