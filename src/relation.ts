import * as v from "valibot";

/**
 * Schema for a Notion relation object structure.
 *
 * **Input:**
 * ```
 * {
 *   id: string;
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
 * @example
 * ```ts
 * import * as v from "valibot";
 * import { InnerRelationSchema } from "@nakanoaas/notion-valibot-utils";
 *
 * const PageSchema = v.object({
 *   id: v.string(),
 *   properties: v.object({
 *     Relation: v.object({
 *       relation: v.array(InnerRelationSchema),
 *     }),
 *   }),
 * });
 *
 * const page = await notion.pages.retrieve({ page_id: "..." });
 * const parsed = v.parse(PageSchema, page);
 * // parsed.properties.Relation.relation: Array<{ id: string }>
 * ```
 *
 * @internal
 */
const InnerRelationSchema = v.object({ id: v.string() });

/**
 * Schema to extract the `relation` property from a Notion page property and transform it to an array of page IDs.
 *
 * **Input:**
 * ```
 * {
 *   relation: Array<{
 *     id: string;
 *   }>;
 * }
 * ```
 *
 * **Output:** `string[]`
 *
 * @example
 * ```ts
 * import * as v from "valibot";
 * import { RelationSchema } from "@nakanoaas/notion-valibot-utils";
 *
 * const PageSchema = v.object({
 *   id: v.string(),
 *   properties: v.object({
 *     RelatedPages: RelationSchema,
 *   }),
 * });
 *
 * const page = await notion.pages.retrieve({ page_id: "..." });
 * const parsed = v.parse(PageSchema, page);
 * // parsed.properties.RelatedPages: string[]
 * ```
 */
export const RelationSchema = v.pipe(
	v.object({
		relation: v.array(InnerRelationSchema),
	}),
	v.transform((v) => v.relation.map((r) => r.id)),
);

/**
 * Schema to extract the `relation` property from a Notion page property and transform it to a single page ID.
 *
 * **Input:**
 * ```
 * {
 *   relation: [{
 *     id: string;
 *   }];
 * }
 * ```
 *
 * **Output:** `string`
 *
 * @example
 * ```ts
 * import * as v from "valibot";
 * import { SingleRelationSchema } from "@nakanoaas/notion-valibot-utils";
 *
 * const PageSchema = v.object({
 *   id: v.string(),
 *   properties: v.object({
 *     ParentPage: SingleRelationSchema,
 *   }),
 * });
 *
 * const page = await notion.pages.retrieve({ page_id: "..." });
 * const parsed = v.parse(PageSchema, page);
 * // parsed.properties.ParentPage: string
 * ```
 */
export const SingleRelationSchema = v.pipe(
	v.object({
		relation: v.pipe(v.array(InnerRelationSchema), v.length(1)),
	}),
	v.transform((v) => v.relation[0].id),
);

/**
 * Schema to extract the `relation` property from a Notion page property and transform it to a single page ID or `null`.
 *
 * **Input:**
 * ```
 * {
 *   relation: Array<{
 *     id: string;
 *   }>;
 * }
 * ```
 *
 * **Output:** `string | null`
 *
 * @example
 * ```ts
 * import * as v from "valibot";
 * import { NullableSingleRelationSchema } from "@nakanoaas/notion-valibot-utils";
 *
 * const PageSchema = v.object({
 *   id: v.string(),
 *   properties: v.object({
 *     ParentPage: NullableSingleRelationSchema,
 *   }),
 * });
 *
 * const page = await notion.pages.retrieve({ page_id: "..." });
 * const parsed = v.parse(PageSchema, page);
 * // parsed.properties.ParentPage: string | null
 * ```
 */
export const NullableSingleRelationSchema = v.pipe(
	v.object({
		relation: v.array(InnerRelationSchema),
	}),
	v.transform((v) => v.relation[0]?.id ?? null),
);
