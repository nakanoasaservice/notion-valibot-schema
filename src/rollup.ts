import * as v from "valibot";

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
			date: v.nullable(
				v.object({
					start: v.string(),
					end: v.nullable(v.string()),
					time_zone: v.nullable(v.string()),
				}),
			),
		}),
	}),
	v.transform((v) => (v.rollup.date ? new Date(v.rollup.date.start) : null)),
);

export const RollupDateSchema = v.pipe(
	v.object({
		rollup: v.object({
			type: v.literal("date"),
			date: v.object({
				start: v.string(),
				end: v.nullable(v.string()),
				time_zone: v.nullable(v.string()),
			}),
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
