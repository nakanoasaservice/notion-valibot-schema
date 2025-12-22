import * as v from "valibot";

/**
 * Schema for a Notion place object structure.
 *
 * **Input:**
 * ```
 * {
 *   lat: number;
 *   lon: number;
 *   name?: string | null;
 *   address?: string | null;
 * }
 * ```
 *
 * **Output:**
 * ```
 * {
 *   lat: number;
 *   lon: number;
 *   name?: string | null;
 *   address?: string | null;
 * }
 * ```
 *
 * @example
 * ```ts
 * import * as v from "valibot";
 * import { PlaceObjectSchema } from "@nakanoaas/notion-valibot-utils";
 *
 * const PageSchema = v.object({
 *   id: v.string(),
 *   properties: v.object({
 *     Location: v.object({
 *       place: PlaceObjectSchema,
 *     }),
 *   }),
 * });
 *
 * const page = await notion.pages.retrieve({ page_id: "..." });
 * const parsed = v.parse(PageSchema, page);
 * // parsed.properties.Location.place: { lat: number; lon: number; name?: string | null; address?: string | null }
 * ```
 *
 * @internal
 */
const PlaceObjectSchema = v.object({
	lat: v.number(),
	lon: v.number(),
	name: v.nullish(v.string()),
	address: v.nullish(v.string()),
});

/**
 * Schema to extract the `place` property from a Notion page property.
 *
 * **Input:**
 * ```
 * {
 *   place: {
 *     lat: number;
 *     lon: number;
 *     name?: string | null;
 *     address?: string | null;
 *   };
 * }
 * ```
 *
 * **Output:**
 * ```
 * {
 *   lat: number;
 *   lon: number;
 *   name?: string | null;
 *   address?: string | null;
 * }
 * ```
 *
 * @example
 * ```ts
 * import * as v from "valibot";
 * import { PlaceSchema } from "@nakanoaas/notion-valibot-utils";
 *
 * const PageSchema = v.object({
 *   id: v.string(),
 *   properties: v.object({
 *     Location: PlaceSchema,
 *   }),
 * });
 *
 * const page = await notion.pages.retrieve({ page_id: "..." });
 * const parsed = v.parse(PageSchema, page);
 * // parsed.properties.Location: { lat: number; lon: number; name?: string | null; address?: string | null }
 * ```
 */
export const PlaceSchema = v.pipe(
	v.object({
		place: PlaceObjectSchema,
	}),
	v.transform((v) => v.place),
);

/**
 * Schema to extract the `place` property from a Notion page property or `null`.
 *
 * **Input:**
 * ```
 * {
 *   place: {
 *     lat: number;
 *     lon: number;
 *     name?: string | null;
 *     address?: string | null;
 *   } | null;
 * }
 * ```
 *
 * **Output:**
 * ```
 * {
 *   lat: number;
 *   lon: number;
 *   name?: string | null;
 *   address?: string | null;
 * } | null
 * ```
 *
 * @example
 * ```ts
 * import * as v from "valibot";
 * import { NullablePlaceSchema } from "@nakanoaas/notion-valibot-utils";
 *
 * const PageSchema = v.object({
 *   id: v.string(),
 *   properties: v.object({
 *     Location: NullablePlaceSchema,
 *   }),
 * });
 *
 * const page = await notion.pages.retrieve({ page_id: "..." });
 * const parsed = v.parse(PageSchema, page);
 * // parsed.properties.Location: { lat: number; lon: number; name?: string | null; address?: string | null } | null
 * ```
 */
export const NullablePlaceSchema = v.pipe(
	v.object({
		place: v.nullable(PlaceObjectSchema),
	}),
	v.transform((v) => v.place),
);
