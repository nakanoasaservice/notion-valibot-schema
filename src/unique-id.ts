import * as v from "valibot";

export const UniqueIdNumberSchema = v.pipe(
	v.object({
		unique_id: v.object({
			number: v.number(),
		}),
	}),
	v.transform((v) => v.unique_id.number),
);

export const NullableUniqueIdSchema = v.pipe(
	v.object({
		unique_id: v.object({
			prefix: v.nullable(v.string()),
			number: v.nullable(v.number()),
		}),
	}),
	v.transform((v) => v.unique_id),
);
