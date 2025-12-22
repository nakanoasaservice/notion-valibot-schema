import * as v from "valibot";

export const NumberSchema = v.pipe(
	v.object({
		number: v.number(),
	}),
	v.transform((v) => v.number),
);

export const NullableNumberSchema = v.pipe(
	v.object({
		number: v.nullable(v.number()),
	}),
	v.transform((v) => v.number),
);
