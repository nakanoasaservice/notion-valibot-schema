import * as v from "valibot";

/**
 * Schema for a Notion person object (user, bot, or group).
 *
 * **Input:**
 * ```
 * {
 *   id: string;
 *   object: "user" | "bot" | "group";
 *   name: string | null;
 *   ...
 * }
 * ```
 *
 * **Output:**
 * ```
 * {
 *   id: string;
 *   object: "user" | "bot" | "group";
 *   name: string | null;
 * }
 * ```
 *
 * @example
 * ```ts
 * import * as v from "valibot";
 * import { PersonSchema } from "@nakanoaas/notion-valibot-schema";
 *
 * const PageSchema = v.object({
 *   id: v.string(),
 *   created_by: PersonSchema,
 * });
 *
 * const page = await notion.pages.retrieve({ page_id: "..." });
 * const parsed = v.parse(PageSchema, page);
 * // parsed.created_by: { id: string; object: "user" | "bot" | "group"; name: string | null }
 * ```
 *
 * @internal
 */
export const PersonSchema = v.object({
	id: v.string(),
	object: v.picklist(["user", "bot", "group"]),
	name: v.nullish(v.string(), null),
});

/**
 * Schema to extract the `people` array from a Notion property.
 *
 * **Input:**
 * ```
 * {
 *   people: [
 *     {
 *       id: string;
 *       object: "user" | "bot" | "group";
 *       name: string | null;
 *       ...
 *     }
 *   ]
 * }
 * ```
 *
 * **Output:**
 * ```
 * [
 *   {
 *     id: string;
 *     object: "user" | "bot" | "group";
 *     name: string | null;
 *   }
 * ]
 * ```
 *
 * @example
 * ```ts
 * import * as v from "valibot";
 * import { PeopleSchema } from "@nakanoaas/notion-valibot-schema";
 *
 * const PageSchema = v.object({
 *   id: v.string(),
 *   properties: v.object({
 *     People: PeopleSchema,
 *   }),
 * });
 *
 * const page = await notion.pages.retrieve({ page_id: "..." });
 * const parsed = v.parse(PageSchema, page);
 * // parsed.properties.People: Array<{ id: string; object: "user" | "bot" | "group"; name: string | null }>
 * ```
 */
export const PeopleSchema = v.pipe(
	v.object({
		people: v.array(PersonSchema),
	}),
	v.transform((v) => v.people),
);

/**
 * Schema to extract the `people` array from a Notion property and transform it to a single person.
 *
 * This is useful when you configure a People property to contain exactly one person,
 * but the Notion API still returns it as an array.
 *
 * **Input:**
 * ```
 * {
 *   people: [
 *     {
 *       id: string;
 *       object: "user" | "bot" | "group";
 *       name: string | null;
 *       ...
 *     }
 *   ]
 * }
 * ```
 *
 * **Output:**
 * ```
 * {
 *   id: string;
 *   object: "user" | "bot" | "group";
 *   name: string | null;
 * }
 * ```
 *
 * @example
 * ```ts
 * import * as v from "valibot";
 * import { SinglePeopleSchema } from "@nakanoaas/notion-valibot-schema";
 *
 * const PageSchema = v.object({
 *   id: v.string(),
 *   properties: v.object({
 *     Owner: SinglePeopleSchema,
 *   }),
 * });
 *
 * const page = await notion.pages.retrieve({ page_id: "..." });
 * const parsed = v.parse(PageSchema, page);
 * // parsed.properties.Owner: { id: string; object: "user" | "bot" | "group"; name: string | null }
 * ```
 */
export const SinglePeopleSchema = v.pipe(
	v.object({
		people: v.tuple([PersonSchema]),
	}),
	v.transform((v) => v.people[0]),
);

/**
 * Schema to extract the `people` array from a Notion property and transform it to a single person or `null`.
 *
 * **Input:**
 * ```
 * {
 *   people: Array<{
 *     id: string;
 *     object: "user" | "bot" | "group";
 *     name: string | null;
 *     ...
 *   }>;
 * }
 * ```
 *
 * **Output:** `{ id: string; object: "user" | "bot" | "group"; name: string | null } | null`
 *
 * @example
 * ```ts
 * import * as v from "valibot";
 * import { NullableSinglePeopleSchema } from "@nakanoaas/notion-valibot-schema";
 *
 * const PageSchema = v.object({
 *   id: v.string(),
 *   properties: v.object({
 *     Owner: NullableSinglePeopleSchema,
 *   }),
 * });
 *
 * const page = await notion.pages.retrieve({ page_id: "..." });
 * const parsed = v.parse(PageSchema, page);
 * // parsed.properties.Owner: { id: string; object: "user" | "bot" | "group"; name: string | null } | null
 * ```
 */
export const NullableSinglePeopleSchema = v.pipe(
	v.object({
		people: v.array(PersonSchema),
	}),
	v.transform((v) => v.people[0] ?? null),
);

/**
 * Schema to extract the `people` array of IDs from a Notion property.
 *
 * **Input:**
 * ```
 * {
 *   people: [
 *     {
 *       id: string;
 *       object: "user" | "bot" | "group";
 *       name: string | null;
 *       ...
 *     }
 *   ]
 * }
 * ```
 *
 * **Output:**
 * ```
 * [string]
 * ```
 *
 * @example
 * ```ts
 * import * as v from "valibot";
 * import { PeopleIdSchema } from "@nakanoaas/notion-valibot-schema";
 *
 * const PageSchema = v.object({
 *   id: v.string(),
 *   properties: v.object({
 *     People: PeopleIdSchema,
 *   }),
 * });
 *
 * const page = await notion.pages.retrieve({ page_id: "..." });
 * const parsed = v.parse(PageSchema, page);
 * // parsed.properties.People: [string]
 * ```
 */
export const PeopleIdSchema = v.pipe(
	v.object({
		people: v.array(PersonSchema),
	}),
	v.transform((v) => v.people.map((p) => p.id)),
);
