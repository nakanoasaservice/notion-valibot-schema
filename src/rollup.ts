import * as v from "valibot";

import { DateObjectSchema } from "./date";

/**
 * Schema to extract the `rollup` property with number type from a Notion page property or `null`.
 *
 * **Input:**
 * ```
 * {
 *   rollup: {
 *     type: "number";
 *     number: number | null;
 *   };
 * }
 * ```
 *
 * **Output:** `number | null`
 *
 * @example
 * ```ts
 * import * as v from "valibot";
 * import { NullableRollupNumberSchema } from "@nakanoaas/notion-valibot-utils";
 *
 * const PageSchema = v.object({
 *   id: v.string(),
 *   properties: v.object({
 *     Sum: NullableRollupNumberSchema,
 *   }),
 * });
 *
 * const page = await notion.pages.retrieve({ page_id: "..." });
 * const parsed = v.parse(PageSchema, page);
 * // parsed.properties.Sum: number | null
 * ```
 */
export const NullableRollupNumberSchema = v.pipe(
	v.object({
		rollup: v.object({
			type: v.literal("number"),
			number: v.nullable(v.number()),
		}),
	}),
	v.transform((v) => v.rollup.number),
);

/**
 * Schema to extract the `rollup` property with number type from a Notion page property.
 *
 * **Input:**
 * ```
 * {
 *   rollup: {
 *     type: "number";
 *     number: number;
 *   };
 * }
 * ```
 *
 * **Output:** `number`
 *
 * @example
 * ```ts
 * import * as v from "valibot";
 * import { RollupNumberSchema } from "@nakanoaas/notion-valibot-utils";
 *
 * const PageSchema = v.object({
 *   id: v.string(),
 *   properties: v.object({
 *     Sum: RollupNumberSchema,
 *   }),
 * });
 *
 * const page = await notion.pages.retrieve({ page_id: "..." });
 * const parsed = v.parse(PageSchema, page);
 * // parsed.properties.Sum: number
 * ```
 */
export const RollupNumberSchema = v.pipe(
	v.object({
		rollup: v.object({
			type: v.literal("number"),
			number: v.number(),
		}),
	}),
	v.transform((v) => v.rollup.number),
);

/**
 * Schema to extract the `rollup` property with date type from a Notion page property and transform it to a `Date` object or `null`.
 *
 * **Input:**
 * ```
 * {
 *   rollup: {
 *     type: "date";
 *     date: {
 *       start: string;
 *       end: string | null;
 *       time_zone: string | null;
 *     } | null;
 *   };
 * }
 * ```
 *
 * **Output:** `Date | null`
 *
 * @example
 * ```ts
 * import * as v from "valibot";
 * import { NullableRollupDateSchema } from "@nakanoaas/notion-valibot-utils";
 *
 * const PageSchema = v.object({
 *   id: v.string(),
 *   properties: v.object({
 *     LatestDate: NullableRollupDateSchema,
 *   }),
 * });
 *
 * const page = await notion.pages.retrieve({ page_id: "..." });
 * const parsed = v.parse(PageSchema, page);
 * // parsed.properties.LatestDate: Date | null
 * ```
 */
export const NullableRollupDateSchema = v.pipe(
	v.object({
		rollup: v.object({
			type: v.literal("date"),
			date: v.nullable(DateObjectSchema),
		}),
	}),
	v.transform((v) => (v.rollup.date ? new Date(v.rollup.date.start) : null)),
);

/**
 * Schema to extract the `rollup` property with date type from a Notion page property and transform it to a `Date` object.
 *
 * **Input:**
 * ```
 * {
 *   rollup: {
 *     type: "date";
 *     date: {
 *       start: string;
 *       end: string | null;
 *       time_zone: string | null;
 *     };
 *   };
 * }
 * ```
 *
 * **Output:** `Date`
 *
 * @example
 * ```ts
 * import * as v from "valibot";
 * import { RollupDateSchema } from "@nakanoaas/notion-valibot-utils";
 *
 * const PageSchema = v.object({
 *   id: v.string(),
 *   properties: v.object({
 *     LatestDate: RollupDateSchema,
 *   }),
 * });
 *
 * const page = await notion.pages.retrieve({ page_id: "..." });
 * const parsed = v.parse(PageSchema, page);
 * // parsed.properties.LatestDate: Date
 * ```
 */
export const RollupDateSchema = v.pipe(
	v.object({
		rollup: v.object({
			type: v.literal("date"),
			date: DateObjectSchema,
		}),
	}),
	v.transform((v) => new Date(v.rollup.date.start)),
);

/**
 * Schema factory to extract the `rollup` property with array type from a Notion page property.
 *
 * This is a generic schema factory that accepts another schema as a parameter,
 * allowing you to combine it with other schemas in this library to extract
 * typed rollup array results. The rollup property in Notion can return an
 * array of different types of values depending on the rollup configuration.
 *
 * **Input:**
 * ```
 * {
 *   rollup: {
 *     type: "array";
 *     array: Array<{ type: string; ... }>;
 *   };
 * }
 * ```
 *
 * **Output:** The output type depends on the schema passed as a parameter.
 * For example, if a schema for number properties is passed, the output will be `Array<number>`.
 *
 * @param schema - A schema that validates each element in the rollup array.
 *                  Must accept an object with a `type` field.
 *
 * @example
 * ```ts
 * import * as v from "valibot";
 * import { RollupArraySchema, NumberSchema } from "@nakanoaas/notion-valibot-utils";
 *
 * const PageSchema = v.object({
 *   id: v.string(),
 *   properties: v.object({
 *     RollupNumbers: RollupArraySchema(NumberSchema),
 *   }),
 * });
 *
 * const page = await notion.pages.retrieve({ page_id: "..." });
 * const parsed = v.parse(PageSchema, page);
 * // parsed.properties.RollupNumbers: number[]
 * ```
 *
 * @example
 * ```ts
 * import * as v from "valibot";
 * import { RollupArraySchema } from "@nakanoaas/notion-valibot-utils";
 *
 * // Custom schema for relation rollup
 * const RelationItemSchema = v.object({
 *   type: v.literal("relation"),
 *   relation: v.array(v.object({ id: v.string() })),
 * });
 *
 * const PageSchema = v.object({
 *   id: v.string(),
 *   properties: v.object({
 *     RollupRelations: RollupArraySchema(RelationItemSchema),
 *   }),
 * });
 *
 * const page = await notion.pages.retrieve({ page_id: "..." });
 * const parsed = v.parse(PageSchema, page);
 * // parsed.properties.RollupRelations: Array<{ type: "relation"; relation: Array<{ id: string }> }>
 * ```
 */
export function RollupArraySchema<
	S extends v.GenericSchema<{ type: string }, unknown>,
>(schema: S) {
	return v.pipe(
		v.object({
			rollup: v.object({
				type: v.literal("array"),
				array: v.array(schema),
			}),
		}),
		v.transform((v) => v.rollup.array),
	);
}
