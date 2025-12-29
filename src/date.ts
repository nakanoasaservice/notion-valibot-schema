import * as v from "valibot";

/**
 * Schema for a Notion date object structure.
 *
 * **Input:**
 * ```
 * {
 *   start: string;
 *   end: string | null;
 *   time_zone: string | null;
 * }
 * ```
 *
 * **Output:**
 * ```
 * {
 *   start: string;
 *   end: string | null;
 *   time_zone: string | null;
 * }
 * ```
 *
 * @example
 * ```ts
 * import * as v from "valibot";
 * import { DateObjectSchema } from "@nakanoaas/notion-valibot-utils";
 *
 * const PageSchema = v.object({
 *   id: v.string(),
 *   properties: v.object({
 *     Date: v.object({
 *       date: DateObjectSchema,
 *     }),
 *   }),
 * });
 *
 * const page = await notion.pages.retrieve({ page_id: "..." });
 * const parsed = v.parse(PageSchema, page);
 * // parsed.properties.Date.date: { start: string; end: string | null; time_zone: string | null }
 * ```
 *
 * @internal
 */
export const DateObjectSchema = v.object({
	start: v.string(),
	end: v.nullable(v.string()),
	time_zone: v.nullable(v.string()),
});

/**
 * Schema for a Notion date object structure with required end date.
 *
 * **Input:**
 * ```
 * {
 *   start: string;
 *   end: string;
 *   time_zone: string | null;
 * }
 * ```
 *
 * **Output:**
 * ```
 * {
 *   start: string;
 *   end: string;
 *   time_zone: string | null;
 * }
 * ```
 *
 * @internal
 */
const DateRangeObjectSchema = v.object({
	start: v.string(),
	end: v.string(),
	time_zone: v.nullable(v.string()),
});

/**
 * Schema to extract the `date` property from a Notion page property and transform it to a `Date` object or `null`.
 *
 * **Input:**
 * ```
 * {
 *   date: {
 *     start: string;
 *     end: string | null;
 *     time_zone: string | null;
 *   } | null
 * }
 * ```
 *
 * **Output:** `Date | null`
 *
 * @example
 * ```ts
 * import * as v from "valibot";
 * import { NullableSingleDateSchema } from "@nakanoaas/notion-valibot-utils";
 *
 * const PageSchema = v.object({
 *   id: v.string(),
 *   properties: v.object({
 *     Date: NullableSingleDateSchema,
 *   }),
 * });
 *
 * const page = await notion.pages.retrieve({ page_id: "..." });
 * const parsed = v.parse(PageSchema, page);
 * // parsed.properties.Date: Date | null
 * ```
 */
export const NullableSingleDateSchema = v.pipe(
	v.object({
		date: v.nullable(DateObjectSchema),
	}),
	v.transform((v) => (v.date?.start ? new Date(v.date.start) : null)),
);

/**
 * Schema to extract the `date` property from a Notion page property and transform it to a `Date` object.
 *
 * **Input:**
 * ```
 * {
 *   date: {
 *     start: string;
 *     end: string | null;
 *     time_zone: string | null;
 *   }
 * }
 * ```
 *
 * **Output:** `Date`
 *
 * @example
 * ```ts
 * import * as v from "valibot";
 * import { SingleDateSchema } from "@nakanoaas/notion-valibot-utils";
 *
 * const PageSchema = v.object({
 *   id: v.string(),
 *   properties: v.object({
 *     Date: SingleDateSchema,
 *   }),
 * });
 *
 * const page = await notion.pages.retrieve({ page_id: "..." });
 * const parsed = v.parse(PageSchema, page);
 * // parsed.properties.Date: Date
 * ```
 */
export const SingleDateSchema = v.pipe(
	v.object({
		date: DateObjectSchema,
	}),
	v.transform((v) => new Date(v.date.start)),
);

/**
 * Schema to extract the `date` property from a Notion page property and transform it to a date range object or `null`.
 * Requires both start and end dates.
 *
 * **Input:**
 * ```
 * {
 *   date: {
 *     start: string;
 *     end: string;
 *     time_zone: string | null;
 *   } | null
 * }
 * ```
 *
 * **Output:**
 * ```
 * {
 *   start: Date;
 *   end: Date;
 *   time_zone: string | null;
 * } | null
 * ```
 *
 * @example
 * ```ts
 * import * as v from "valibot";
 * import { NullableRangeDateSchema } from "@nakanoaas/notion-valibot-utils";
 *
 * const PageSchema = v.object({
 *   id: v.string(),
 *   properties: v.object({
 *     DateRange: NullableRangeDateSchema,
 *   }),
 * });
 *
 * const page = await notion.pages.retrieve({ page_id: "..." });
 * const parsed = v.parse(PageSchema, page);
 * // parsed.properties.DateRange: { start: Date; end: Date; time_zone: string | null } | null
 * ```
 */
export const NullableRangeDateSchema = v.pipe(
	v.object({
		date: v.nullable(DateRangeObjectSchema),
	}),
	v.transform((v) =>
		v.date
			? {
					start: new Date(v.date.start),
					end: new Date(v.date.end),
					time_zone: v.date.time_zone,
				}
			: null,
	),
);

/**
 * Schema to extract the `date` property from a Notion page property and transform it to a date range object.
 * Requires both start and end dates.
 *
 * **Input:**
 * ```
 * {
 *   date: {
 *     start: string;
 *     end: string;
 *     time_zone: string | null;
 *   }
 * }
 * ```
 *
 * **Output:**
 * ```
 * {
 *   start: Date;
 *   end: Date;
 *   time_zone: string | null;
 * }
 * ```
 *
 * @example
 * ```ts
 * import * as v from "valibot";
 * import { RangeDateSchema } from "@nakanoaas/notion-valibot-utils";
 *
 * const PageSchema = v.object({
 *   id: v.string(),
 *   properties: v.object({
 *     DateRange: RangeDateSchema,
 *   }),
 * });
 *
 * const page = await notion.pages.retrieve({ page_id: "..." });
 * const parsed = v.parse(PageSchema, page);
 * // parsed.properties.DateRange: { start: Date; end: Date; time_zone: string | null }
 * ```
 */
export const RangeDateSchema = v.pipe(
	v.object({
		date: DateRangeObjectSchema,
	}),
	v.transform((v) => ({
		start: new Date(v.date.start),
		end: new Date(v.date.end),
		time_zone: v.date.time_zone,
	})),
);

/**
 * Schema to extract the `date` property from a Notion page property and transform it to a date range object or `null`.
 * End date is optional.
 *
 * **Input:**
 * ```
 * {
 *   date: {
 *     start: string;
 *     end: string | null;
 *     time_zone: string | null;
 *   } | null
 * }
 * ```
 *
 * **Output:**
 * ```
 * {
 *   start: Date;
 *   end: Date | null;
 *   time_zone: string | null;
 * } | null
 * ```
 *
 * @example
 * ```ts
 * import * as v from "valibot";
 * import { NullableFullDateSchema } from "@nakanoaas/notion-valibot-utils";
 *
 * const PageSchema = v.object({
 *   id: v.string(),
 *   properties: v.object({
 *     DateRange: NullableFullDateSchema,
 *   }),
 * });
 *
 * const page = await notion.pages.retrieve({ page_id: "..." });
 * const parsed = v.parse(PageSchema, page);
 * // parsed.properties.DateRange: { start: Date; end: Date | null; time_zone: string | null } | null
 * ```
 */
export const NullableFullDateSchema = v.pipe(
	v.object({
		date: v.nullable(DateObjectSchema),
	}),
	v.transform((v) =>
		v.date
			? {
					start: new Date(v.date.start),
					end: v.date.end ? new Date(v.date.end) : null,
					time_zone: v.date.time_zone,
				}
			: null,
	),
);

/**
 * Schema to extract the `date` property from a Notion page property and transform it to a date range object.
 * End date is optional.
 *
 * **Input:**
 * ```
 * {
 *   date: {
 *     start: string;
 *     end: string | null;
 *     time_zone: string | null;
 *   }
 * }
 * ```
 *
 * **Output:**
 * ```
 * {
 *   start: Date;
 *   end: Date | null;
 *   time_zone: string | null;
 * }
 * ```
 *
 * @example
 * ```ts
 * import * as v from "valibot";
 * import { FullDateSchema } from "@nakanoaas/notion-valibot-utils";
 *
 * const PageSchema = v.object({
 *   id: v.string(),
 *   properties: v.object({
 *     DateRange: FullDateSchema,
 *   }),
 * });
 *
 * const page = await notion.pages.retrieve({ page_id: "..." });
 * const parsed = v.parse(PageSchema, page);
 * // parsed.properties.DateRange: { start: Date; end: Date | null; time_zone: string | null }
 * ```
 */
export const FullDateSchema = v.pipe(
	v.object({
		date: DateObjectSchema,
	}),
	v.transform((v) => ({
		start: new Date(v.date.start),
		end: v.date.end ? new Date(v.date.end) : null,
		time_zone: v.date.time_zone,
	})),
);
