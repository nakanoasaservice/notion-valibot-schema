import * as v from "valibot";

import { UserOrGroupIdSchema, UserOrGroupSchema } from "./people";

/**
 * Schema factory to extract the `last_edited_by` person object from a Notion page.
 *
 * This is a generic schema factory that accepts another schema as a parameter,
 * allowing you to combine it with building-block schemas such as
 * `UserOrGroupSchema`, `UserSchema`, or `PersonSchema`.
 *
 * **Input:**
 * ```
 * {
 *   last_edited_by: {
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
 * @param schema - A schema that validates the `last_edited_by` user or group object.
 *
 * @example
 * ```ts
 * import * as v from "valibot";
 * import {
 *   LastEditedBySchema,
 *   UserOrGroupSchema,
 * } from "@nakanoaas/notion-valibot-schema";
 *
 * const PageSchema = v.object({
 *   id: v.string(),
 *   properties: v.object({
 *     LastEditedBy: LastEditedBySchema(UserOrGroupSchema),
 *   }),
 * });
 *
 * const page = await notion.pages.retrieve({ page_id: "..." });
 * const parsed = v.parse(PageSchema, page);
 * // parsed.properties.LastEditedBy: { id: string; object: "user" | "group"; name: string | null }
 * ```
 */
export function LastEditedBySchema<
	S extends v.GenericSchema<{ id: string; object: "user" | "group" }, unknown>,
>(
	schema: S,
): v.GenericSchema<{ last_edited_by: v.InferInput<S> }, v.InferOutput<S>> {
	return v.pipe(
		v.object({
			last_edited_by: schema,
		}),
		v.transform((v) => v.last_edited_by),
	) as v.GenericSchema<{ last_edited_by: v.InferInput<S> }, v.InferOutput<S>>;
}

/**
 * Schema to extract the `last_edited_by` person name from a Notion page.
 *
 * **Input:**
 * ```
 * {
 *   last_edited_by: {
 *     id: string;
 *     object: "user" | "group";
 *     name?: string | null;
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
 * import { NullableLastEditedByNameSchema } from "@nakanoaas/notion-valibot-schema";
 *
 * const PageSchema = v.object({
 *   id: v.string(),
 *   properties: v.object({
 *     LastEditedByName: NullableLastEditedByNameSchema,
 *   }),
 * });
 *
 * const page = await notion.pages.retrieve({ page_id: "..." });
 * const parsed = v.parse(PageSchema, page);
 * // parsed.properties.LastEditedByName: string | null
 * ```
 */
export const NullableLastEditedByNameSchema = v.pipe(
	v.object({
		last_edited_by: UserOrGroupSchema,
	}),
	v.transform((v) => v.last_edited_by.name),
);

/**
 * Schema to extract the `last_edited_by` person ID from a Notion page.
 *
 * **Input:**
 * ```
 * {
 *   last_edited_by: {
 *     id: string;
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
 * import { LastEditedByIdSchema } from "@nakanoaas/notion-valibot-schema";
 *
 * const PageSchema = v.object({
 *   id: v.string(),
 *   properties: v.object({
 *     LastEditedById: LastEditedByIdSchema,
 *   }),
 * });
 *
 * const page = await notion.pages.retrieve({ page_id: "..." });
 * const parsed = v.parse(PageSchema, page);
 * // parsed.properties.LastEditedById: string
 * ```
 */
export const LastEditedByIdSchema = v.pipe(
	v.object({
		last_edited_by: UserOrGroupIdSchema,
	}),
	v.transform((v) => v.last_edited_by.id),
);
