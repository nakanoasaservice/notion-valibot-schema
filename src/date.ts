import * as v from "valibot";

const InnerDateSchema = v.object({
	start: v.string(),
	end: v.nullable(v.string()),
	time_zone: v.nullable(v.string()),
});

export const DateSchema = v.pipe(
	v.object({
		date: InnerDateSchema,
	}),
	v.transform((v) => new Date(v.date.start)),
);

export const NullableDateSchema = v.pipe(
	v.object({
		date: v.nullable(InnerDateSchema),
	}),
	v.transform((v) => (v.date?.start ? new Date(v.date.start) : null)),
);

export const DateRangeSchema = v.pipe(
	v.object({
		date: InnerDateSchema,
	}),
	v.transform((v) => ({
		start: new Date(v.date.start),
		end: v.date.end ? new Date(v.date.end) : null,
		time_zone: v.date.time_zone,
	})),
);

export const NullableDateRangeSchema = v.pipe(
	v.object({
		date: v.nullable(InnerDateSchema),
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
