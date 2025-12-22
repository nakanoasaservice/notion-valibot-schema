import * as v from "valibot";

import { DateObjectSchema } from "./date";

export const NullableRollupNumberSchema = v.pipe(
	v.object({
		rollup: v.object({
			type: v.literal("number"),
			number: v.nullable(v.number()),
		}),
	}),
	v.transform((v) => v.rollup.number),
);

export const RollupNumberSchema = v.pipe(
	v.object({
		rollup: v.object({
			type: v.literal("number"),
			number: v.number(),
		}),
	}),
	v.transform((v) => v.rollup.number),
);

export const NullableRollupDateSchema = v.pipe(
	v.object({
		rollup: v.object({
			type: v.literal("date"),
			date: v.nullable(DateObjectSchema),
		}),
	}),
	v.transform((v) => (v.rollup.date ? new Date(v.rollup.date.start) : null)),
);

export const RollupDateSchema = v.pipe(
	v.object({
		rollup: v.object({
			type: v.literal("date"),
			date: DateObjectSchema,
		}),
	}),
	v.transform((v) => new Date(v.rollup.date.start)),
);

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
