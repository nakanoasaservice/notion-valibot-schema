import * as v from "valibot";

export const DateSchema = v.pipe(
	v.object({
		date: v.object({
			start: v.string(),
		}),
	}),
	v.transform((v) => new Date(v.date.start)),
);

export const NullableDateSchema = v.pipe(
	v.object({
		date: v.nullable(
			v.object({
				start: v.string(),
			}),
		),
	}),
	v.transform((v) => (v.date?.start ? new Date(v.date.start) : null)),
);

export const FullDateSchema = v.pipe(
	v.object({
		date: v.object({
			start: v.string(),
			end: v.string(),
		}),
	}),
	v.transform((v) => ({
		start: new Date(v.date.start),
		end: new Date(v.date.end),
	})),
);

export const NullableFullDateSchema = v.pipe(
	v.object({
		date: v.nullable(
			v.object({
				start: v.string(),
				end: v.nullable(v.string()),
			}),
		),
	}),
	v.transform((v) =>
		v.date
			? {
					start: new Date(v.date.start),
					end: v.date.end ? new Date(v.date.end) : null,
				}
			: null,
	),
);
