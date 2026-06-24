import * as v from "valibot";

/**
 * Schema factory to extract the `rollup` property with a simple (non-array) type from a Notion page property.
 *
 * This is a generic schema factory that accepts another schema as a parameter,
 * allowing you to combine it with the number and date schemas in this library
 * to extract typed rollup results (e.g. number or date rollups).
 *
 * **Input:**
 * ```
 * {
 *   rollup: InferInput<S>; // e.g. { number: number } or { date: { start: string; ... } }
 * }
 * ```
 *
 * **Output:** The output type depends on the schema passed as a parameter.
 * For example, if `NumberSchema` is passed, the output will be `number`.
 *
 * @param schema - A schema that validates the rollup value.
 *                  Must accept an object with a `number` or `date` field.
 *
 * @example
 * ```ts
 * import * as v from "valibot";
 * import { RollupSimpleSchema, NumberSchema } from "@nakanoaas/notion-valibot-utils";
 *
 * const PageSchema = v.object({
 *   id: v.string(),
 *   properties: v.object({
 *     Sum: RollupSimpleSchema(NumberSchema),
 *   }),
 * });
 *
 * const page = await notion.pages.retrieve({ page_id: "..." });
 * const parsed = v.parse(PageSchema, page);
 * // parsed.properties.Sum: number
 * ```
 *
 * @example
 * ```ts
 * import * as v from "valibot";
 * import { RollupSimpleSchema, SingleDateSchema } from "@nakanoaas/notion-valibot-utils";
 *
 * const PageSchema = v.object({
 *   id: v.string(),
 *   properties: v.object({
 *     LatestDate: RollupSimpleSchema(SingleDateSchema),
 *   }),
 * });
 *
 * const page = await notion.pages.retrieve({ page_id: "..." });
 * const parsed = v.parse(PageSchema, page);
 * // parsed.properties.LatestDate: Date
 * ```
 */
export function RollupSimpleSchema<
	S extends v.GenericSchema<{ number: unknown } | { date: unknown }, unknown>,
>(
	schema: S,
): v.GenericSchema<
	{
		rollup: v.InferInput<S>;
	},
	v.InferOutput<S>
> {
	return v.pipe(
		v.object({
			rollup: schema,
		}),
		v.transform((v) => v.rollup),
	) as v.GenericSchema<{ rollup: v.InferInput<S> }, v.InferOutput<S>>;
}

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
export function RollupArraySchema<S extends v.GenericSchema<object, unknown>>(
	schema: S,
) {
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

/**
 * Schema factory to extract the single element from the `rollup` property with array type.
 *
 * This is similar to {@link RollupArraySchema} but expects exactly one element in the array
 * and returns that element directly instead of an array. Useful when the rollup is configured
 * to return a single value (e.g., `show_unique_values` with one relation).
 *
 * **Input:**
 * ```
 * {
 *   rollup: {
 *     type: "array";
 *     array: [T];  // exactly one element
 *   };
 * }
 * ```
 *
 * **Output:** The output type of the schema passed as a parameter (single element, not array).
 * For example, if a schema for number properties is passed, the output will be `number`.
 *
 * @param schema - A schema that validates the single element in the rollup array.
 *                  Must accept an object with a `type` field.
 *
 * @example
 * ```ts
 * import * as v from "valibot";
 * import { SingleRollupArraySchema, NumberSchema } from "@nakanoaas/notion-valibot-utils";
 *
 * const PageSchema = v.object({
 *   id: v.string(),
 *   properties: v.object({
 *     SingleRollupNumber: SingleRollupArraySchema(NumberSchema),
 *   }),
 * });
 *
 * const page = await notion.pages.retrieve({ page_id: "..." });
 * const parsed = v.parse(PageSchema, page);
 * // parsed.properties.SingleRollupNumber: number
 * ```
 *
 * @example
 * ```ts
 * import * as v from "valibot";
 * import { SingleRollupArraySchema } from "@nakanoaas/notion-valibot-utils";
 *
 * const RelationItemSchema = v.object({
 *   type: v.literal("relation"),
 *   relation: v.array(v.object({ id: v.string() })),
 * });
 *
 * const PageSchema = v.object({
 *   id: v.string(),
 *   properties: v.object({
 *     SingleRelation: SingleRollupArraySchema(RelationItemSchema),
 *   }),
 * });
 *
 * const page = await notion.pages.retrieve({ page_id: "..." });
 * const parsed = v.parse(PageSchema, page);
 * // parsed.properties.SingleRelation: { type: "relation"; relation: Array<{ id: string }> }
 * ```
 */
export function SingleRollupArraySchema<
	S extends v.GenericSchema<object, unknown>,
>(
	schema: S,
): v.GenericSchema<
	{
		rollup: {
			type: "array";
			array: v.InferInput<S>[];
		};
	},
	v.InferOutput<S>
> {
	return v.pipe(
		v.object({
			rollup: v.object({
				type: v.literal("array"),
				array: v.tuple([schema]),
			}),
		}),
		v.transform((v) => v.rollup.array[0]),
	);
}

/**
 * Schema factory to extract the single element from the `rollup` property with array type, or `null` when the array is empty.
 *
 * This is similar to {@link SingleRollupArraySchema} but accepts empty arrays and returns `null` instead of requiring
 * exactly one element. Useful when the rollup may return zero or one value.
 *
 * **Input:**
 * ```
 * {
 *   rollup: {
 *     type: "array";
 *     array: Array<T>;  // zero or one element
 *   };
 * }
 * ```
 *
 * **Output:** The output type of the schema passed as a parameter, or `null`.
 * For example, if a schema for number properties is passed, the output will be `number | null`.
 *
 * @param schema - A schema that validates each element in the rollup array.
 *                  Must accept an object with a `type` field.
 *
 * @example
 * ```ts
 * import * as v from "valibot";
 * import { NullableSingleRollupArraySchema, NumberSchema } from "@nakanoaas/notion-valibot-utils";
 *
 * const PageSchema = v.object({
 *   id: v.string(),
 *   properties: v.object({
 *     SingleRollupNumber: NullableSingleRollupArraySchema(NumberSchema),
 *   }),
 * });
 *
 * const page = await notion.pages.retrieve({ page_id: "..." });
 * const parsed = v.parse(PageSchema, page);
 * // parsed.properties.SingleRollupNumber: number | null
 * ```
 *
 * @example
 * ```ts
 * import * as v from "valibot";
 * import { NullableSingleRollupArraySchema } from "@nakanoaas/notion-valibot-utils";
 *
 * const RelationItemSchema = v.object({
 *   type: v.literal("relation"),
 *   relation: v.array(v.object({ id: v.string() })),
 * });
 *
 * const PageSchema = v.object({
 *   id: v.string(),
 *   properties: v.object({
 *     SingleRelation: NullableSingleRollupArraySchema(RelationItemSchema),
 *   }),
 * });
 *
 * const page = await notion.pages.retrieve({ page_id: "..." });
 * const parsed = v.parse(PageSchema, page);
 * // parsed.properties.SingleRelation: { type: "relation"; relation: Array<{ id: string }> } | null
 * ```
 */
export function NullableSingleRollupArraySchema<
	S extends v.GenericSchema<object, unknown>,
>(
	schema: S,
): v.GenericSchema<
	{
		rollup: {
			type: "array";
			array: v.InferInput<S>[];
		};
	},
	v.InferOutput<S> | null
> {
	return v.pipe(
		v.object({
			rollup: v.object({
				type: v.literal("array"),
				array: v.array(schema),
			}),
		}),
		v.transform((v) => (v.rollup.array[0] ?? null) as v.InferOutput<S> | null),
	);
}
