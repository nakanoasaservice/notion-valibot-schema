import * as v from "valibot";

/**
 * Minimal schema for a Notion user or group ID.
 *
 * Use this when only the `id` field is needed, such as in ID-extraction
 * convenience schemas (`PeopleIdSchema`, `CreatedByIdSchema`, etc.).
 *
 * **Input:**
 * ```
 * {
 *   id: string;
 *   ...
 * }
 * ```
 *
 * **Output:**
 * ```
 * {
 *   id: string;
 * }
 * ```
 *
 * @notionPartial supported
 */
export const UserOrGroupIdSchema = v.object({
	id: v.string(),
});

/**
 * Schema for a Notion user or group object.
 *
 * Validates `id`, `object` (`"user"` | `"group"`), and `name`.
 * Bots in the Notion API use `object: "user"` with `type: "bot"`, so they
 * are accepted by this schema as well.
 *
 * **Input:**
 * ```
 * {
 *   id: string;
 *   object: "user" | "group";
 *   name?: string | null;
 *   ...
 * }
 * ```
 *
 * **Output:**
 * ```
 * {
 *   id: string;
 *   object: "user" | "group";
 *   name: string | null;
 * }
 * ```
 *
 * @example
 * ```ts
 * import * as v from "valibot";
 * import { PeopleSchema, UserOrGroupSchema } from "@nakanoaas/notion-valibot-schema";
 *
 * const PageSchema = v.object({
 *   id: v.string(),
 *   properties: v.object({
 *     Assignees: PeopleSchema(UserOrGroupSchema),
 *   }),
 * });
 *
 * const page = await notion.pages.retrieve({ page_id: "..." });
 * const parsed = v.parse(PageSchema, page);
 * // parsed.properties.Assignees: Array<{ id: string; object: "user" | "group"; name: string | null }>
 * ```
 *
 * @notionPartial supported
 */
export const UserOrGroupSchema = v.object({
	id: v.string(),
	object: v.picklist(["user", "group"]),
	name: v.nullish(v.string(), null),
});

/**
 * Schema for a Notion user object.
 *
 * **Input:**
 * ```
 * {
 *   id: string;
 *   object: "user";
 *   name?: string | null;
 *   avatar_url?: string | null;
 *   ...
 * }
 * ```
 *
 * **Output:**
 * ```
 * {
 *   id: string;
 *   object: "user";
 *   name: string | null;
 *   avatar_url: string | null;
 * }
 * ```
 *
 * @notionPartial supported
 */
export const UserSchema = v.object({
	id: v.string(),
	object: v.literal("user"),
	name: v.nullish(v.string(), null),
	avatar_url: v.nullish(v.string(), null),
});

/**
 * Schema for a Notion person user object.
 *
 * Validates a user with `type: "person"` and the nested `person.email` field.
 * Use with `PeopleSchema`, `SinglePeopleSchema`, or `CreatedBySchema` when
 * full person details are needed.
 *
 * **Input:**
 * ```
 * {
 *   id: string;
 *   object: "user";
 *   name?: string | null;
 *   avatar_url?: string | null;
 *   type: "person";
 *   person: {
 *     email?: string;
 *   };
 *   ...
 * }
 * ```
 *
 * **Output:**
 * ```
 * {
 *   id: string;
 *   object: "user";
 *   name: string | null;
 *   avatar_url: string | null;
 *   type: "person";
 *   person: {
 *     email?: string;
 *   };
 * }
 * ```
 *
 * @example
 * ```ts
 * import * as v from "valibot";
 * import { PeopleSchema, PersonSchema } from "@nakanoaas/notion-valibot-schema";
 *
 * const PageSchema = v.object({
 *   id: v.string(),
 *   properties: v.object({
 *     People: PeopleSchema(PersonSchema),
 *   }),
 * });
 *
 * const page = await notion.pages.retrieve({ page_id: "..." });
 * const parsed = v.parse(PageSchema, page);
 * // parsed.properties.People: Array<{ id: string; object: "user"; name: string | null; ... }>
 * ```
 *
 * @notionPartial not-supported
 * @notionPartialNote Requires full person object (`type: "person"`). Use `UserOrGroupSchema` or `PeopleIdSchema` for partial responses.
 */
export const PersonSchema = v.object({
	id: v.string(),
	object: v.literal("user"),
	name: v.nullish(v.string(), null),
	avatar_url: v.nullish(v.string(), null),

	type: v.literal("person"),
	person: v.object({
		email: v.optional(v.string()),
	}),
});

/**
 * Schema for a Notion bot user object.
 *
 * **Input:**
 * ```
 * {
 *   id: string;
 *   object: "bot";
 *   name?: string | null;
 *   avatar_url?: string | null;
 *   type: "bot";
 *   bot: unknown;
 *   ...
 * }
 * ```
 *
 * **Output:**
 * ```
 * {
 *   id: string;
 *   object: "bot";
 *   name: string | null;
 *   avatar_url: string | null;
 *   type: "bot";
 *   bot: unknown;
 * }
 * ```
 *
 * @notionPartial not-supported
 * @notionPartialNote Requires full bot object (`object: "bot"`, `type: "bot"`). Use `UserOrGroupSchema` or `PeopleIdSchema` for partial responses.
 */
export const BotSchema = v.object({
	id: v.string(),
	object: v.literal("bot"),
	name: v.nullish(v.string(), null),
	avatar_url: v.nullish(v.string(), null),

	type: v.literal("bot"),
	bot: v.any(),
});

/**
 * Schema to extract the `people` array of IDs from a Notion property.
 *
 * **Input:**
 * ```
 * {
 *   people: [
 *     {
 *       id: string;
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
 *
 * @notionPartial supported
 * @notionPartialNote People lists may be truncated beyond 25 entries. Use `pages.properties.retrieve` for complete data.
 */
export const PeopleIdSchema = v.pipe(
	v.object({
		people: v.array(UserOrGroupIdSchema),
	}),
	v.transform((v) => v.people.map((p) => p.id)),
);

/**
 * Schema to extract a single person ID from a Notion `people` property.
 *
 * Expects exactly one entry in the `people` array.
 *
 * **Input:**
 * ```
 * {
 *   people: [{ id: string; ... }]
 * }
 * ```
 *
 * **Output:** `string`
 *
 * @example
 * ```ts
 * import * as v from "valibot";
 * import { SinglePeopleIdSchema } from "@nakanoaas/notion-valibot-schema";
 *
 * const PageSchema = v.object({
 *   id: v.string(),
 *   properties: v.object({
 *     Owner: SinglePeopleIdSchema,
 *   }),
 * });
 *
 * const page = await notion.pages.retrieve({ page_id: "..." });
 * const parsed = v.parse(PageSchema, page);
 * // parsed.properties.Owner: string
 * ```
 *
 * @notionPartial supported
 * @notionPartialNote People lists may be truncated beyond 25 entries. Use `pages.properties.retrieve` for complete data.
 */
export const SinglePeopleIdSchema = v.pipe(
	v.object({
		people: v.tuple([UserOrGroupIdSchema]),
	}),
	v.transform((v) => v.people[0].id),
);

/**
 * Schema to extract a single person ID or `null` from a Notion `people` property.
 *
 * Returns the first entry's ID, or `null` when the array is empty.
 *
 * **Input:**
 * ```
 * {
 *   people: Array<{ id: string; ... }>
 * }
 * ```
 *
 * **Output:** `string | null`
 *
 * @example
 * ```ts
 * import * as v from "valibot";
 * import { NullableSinglePeopleIdSchema } from "@nakanoaas/notion-valibot-schema";
 *
 * const PageSchema = v.object({
 *   id: v.string(),
 *   properties: v.object({
 *     Owner: NullableSinglePeopleIdSchema,
 *   }),
 * });
 *
 * const page = await notion.pages.retrieve({ page_id: "..." });
 * const parsed = v.parse(PageSchema, page);
 * // parsed.properties.Owner: string | null
 * ```
 *
 * @notionPartial supported
 * @notionPartialNote People lists may be truncated beyond 25 entries. Use `pages.properties.retrieve` for complete data.
 */
export const NullableSinglePeopleIdSchema = v.pipe(
	v.object({
		people: v.array(UserOrGroupIdSchema),
	}),
	v.transform((v) => v.people[0]?.id ?? null),
);

/**
 * Schema factory to extract the `people` array from a Notion property.
 *
 * **Input:**
 * ```
 * {
 *   people: Array<InferredInput<schema>>
 * }
 * ```
 *
 * **Output:** `InferredOutput<schema>[]`
 *
 * @notionPartial supported
 * @notionPartialNote Supported with `UserOrGroupSchema` or `UserSchema`. Not supported with `PersonSchema` or `BotSchema`. People lists may be truncated beyond 25 entries.
 *
 * @param schema - A schema that validates each person object in the `people` array.
 *                  Use `UserOrGroupSchema` or `UserSchema` for partial responses.
 *
 * @example
 * ```ts
 * import * as v from "valibot";
 * import { PeopleSchema, PersonSchema } from "@nakanoaas/notion-valibot-schema";
 *
 * const PageSchema = v.object({
 *   id: v.string(),
 *   properties: v.object({
 *     People: PeopleSchema(PersonSchema),
 *   }),
 * });
 *
 * const page = await notion.pages.retrieve({ page_id: "..." });
 * const parsed = v.parse(PageSchema, page);
 * // parsed.properties.People: InferredOutput<typeof PersonSchema>[]
 * ```
 */
export function PeopleSchema<S extends v.GenericSchema<object, unknown>>(
	schema: S,
): v.GenericSchema<{ people: v.InferInput<S>[] }, v.InferOutput<S>[]> {
	return v.pipe(
		v.object({
			people: v.array(schema),
		}),
		v.transform((v) => v.people),
	);
}

/**
 * Schema factory to extract a single person from a Notion `people` property.
 *
 * Expects exactly one entry in the `people` array.
 *
 * **Input:**
 * ```
 * {
 *   people: [InferredInput<schema>]
 * }
 * ```
 *
 * **Output:** `InferredOutput<schema>`
 *
 * @notionPartial supported
 * @notionPartialNote Supported with `UserOrGroupSchema` or `UserSchema`. Not supported with `PersonSchema` or `BotSchema`.
 *
 * @param schema - A schema that validates the person object in the `people` array.
 *                  Use `UserOrGroupSchema` or `UserSchema` for partial responses.
 *
 * @example
 * ```ts
 * import * as v from "valibot";
 * import { PersonSchema, SinglePeopleSchema } from "@nakanoaas/notion-valibot-schema";
 *
 * const PageSchema = v.object({
 *   id: v.string(),
 *   properties: v.object({
 *     Owner: SinglePeopleSchema(PersonSchema),
 *   }),
 * });
 *
 * const page = await notion.pages.retrieve({ page_id: "..." });
 * const parsed = v.parse(PageSchema, page);
 * // parsed.properties.Owner: InferredOutput<typeof PersonSchema>
 * ```
 */
export function SinglePeopleSchema<S extends v.GenericSchema<object, unknown>>(
	schema: S,
): v.GenericSchema<{ people: [v.InferInput<S>] }, v.InferOutput<S>> {
	return v.pipe(
		v.object({
			people: v.tuple([schema]),
		}),
		v.transform((v) => v.people[0]),
	);
}

/**
 * Schema factory to extract a single person or `null` from a Notion `people` property.
 *
 * Returns the first entry, or `null` when the array is empty.
 *
 * **Input:**
 * ```
 * {
 *   people: Array<InferredInput<schema>>
 * }
 * ```
 *
 * **Output:** `InferredOutput<schema> | null`
 *
 * @notionPartial supported
 * @notionPartialNote Supported with `UserOrGroupSchema` or `UserSchema`. Not supported with `PersonSchema` or `BotSchema`.
 *
 * @param schema - A schema that validates each person object in the `people` array.
 *                  Use `UserOrGroupSchema` or `UserSchema` for partial responses.
 *
 * @example
 * ```ts
 * import * as v from "valibot";
 * import {
 *   NullableSinglePeopleSchema,
 *   UserOrGroupSchema,
 * } from "@nakanoaas/notion-valibot-schema";
 *
 * const PageSchema = v.object({
 *   id: v.string(),
 *   properties: v.object({
 *     Owner: NullableSinglePeopleSchema(UserOrGroupSchema),
 *   }),
 * });
 *
 * const page = await notion.pages.retrieve({ page_id: "..." });
 * const parsed = v.parse(PageSchema, page);
 * // parsed.properties.Owner: { id: string; object: "user" | "group"; name: string | null } | null
 * ```
 */
export function NullableSinglePeopleSchema<
	S extends v.GenericSchema<object, unknown>,
>(
	schema: S,
): v.GenericSchema<{ people: v.InferInput<S>[] }, v.InferOutput<S> | null> {
	return v.pipe(
		v.object({
			people: v.array(schema),
		}),
		v.transform((v) => v.people[0] ?? null),
	);
}
