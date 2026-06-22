import * as v from "valibot";

import { UserOrGroupIdSchema, UserOrGroupSchema } from "./people";

/**
 * Schema to extract the `created_by` person ID from a Notion page.
 *
 * **Input:**
 * ```
 * {
 *   created_by: {
 *     id: string;
 *     object: "user" | "group";
 *     name: string | null;
 *     ...
 *   }
 * }
 * ```
 *
 * **Output:** `string`
 *
 * @example
 * ```ts
 * import * as v from "valibot";
 * import { CreatedByIdSchema } from "@nakanoaas/notion-valibot-schema";
 *
 * const PageSchema = v.object({
 *   id: v.string(),
 *   properties: v.object({
 *     CreatedById: CreatedByIdSchema,
 *   }),
 * });
 *
 * const page = await notion.pages.retrieve({ page_id: "..." });
 * const parsed = v.parse(PageSchema, page);
 * // parsed.properties.CreatedById: string
 * ```
 */
export const CreatedByIdSchema = v.pipe(
	v.object({
		created_by: UserOrGroupIdSchema,
	}),
	v.transform((v) => v.created_by.id),
);

/**
 * Schema to extract the `created_by` person name from a Notion page.
 *
 * **Input:**
 * ```
 * {
 *   created_by: {
 *     id: string;
 *     object: "user" | "group";
 *     name: string | null;
 *     ...
 *   }
 * }
 * ```
 *
 * **Output:** `string | null`
 *
 * @example
 * ```ts
 * import * as v from "valibot";
 * import { NullableCreatedByNameSchema } from "@nakanoaas/notion-valibot-schema";
 *
 * const PageSchema = v.object({
 *   id: v.string(),
 *   properties: v.object({
 *     CreatedByName: NullableCreatedByNameSchema,
 *   }),
 * });
 *
 * const page = await notion.pages.retrieve({ page_id: "..." });
 * const parsed = v.parse(PageSchema, page);
 * // parsed.properties.CreatedByName: string | null
 * ```
 */
export const NullableCreatedByNameSchema = v.pipe(
	v.object({
		created_by: UserOrGroupSchema,
	}),
	v.transform((v) => v.created_by.name),
);

/**
 * Schema factory to extract the `created_by` person object from a Notion page.
 *
 * This is a generic schema factory that accepts another schema as a parameter,
 * allowing you to combine it with building-block schemas such as
 * `UserOrGroupSchema`, `UserSchema`, or `PersonSchema`.
 *
 * **Input:**
 * ```
 * {
 *   created_by: {
 *     id: string;
 *     object: "user" | "group";
 *     name?: string | null;
 *     ...
 *   }
 * }
 * ```
 *
 * **Output:** The output type depends on the schema passed as a parameter.
 *
 * @param schema - A schema that validates the `created_by` user or group object.
 *
 * @example
 * ```ts
 * import * as v from "valibot";
 * import {
 *   CreatedBySchema,
 *   UserOrGroupSchema,
 * } from "@nakanoaas/notion-valibot-schema";
 *
 * const PageSchema = v.object({
 *   id: v.string(),
 *   properties: v.object({
 *     CreatedBy: CreatedBySchema(UserOrGroupSchema),
 *   }),
 * });
 *
 * const page = await notion.pages.retrieve({ page_id: "..." });
 * const parsed = v.parse(PageSchema, page);
 * // parsed.properties.CreatedBy: { id: string; object: "user" | "group"; name: string | null }
 * ```
 */
export function CreatedBySchema<
	S extends v.GenericSchema<{ id: string; object: "user" | "group" }, unknown>,
>(
	schema: S,
): v.GenericSchema<{ created_by: v.InferInput<S> }, v.InferOutput<S>> {
	return v.pipe(
		v.object({
			created_by: schema,
		}),
		v.transform((v) => v.created_by),
	) as v.GenericSchema<{ created_by: v.InferInput<S> }, v.InferOutput<S>>;
}
