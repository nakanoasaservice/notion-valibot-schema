import * as v from "valibot";

export const PeopleSchema = v.pipe(
	v.object({
		people: v.array(
			v.object({
				id: v.string(),
				name: v.nullish(v.string(), null),
			}),
		),
	}),
	v.transform((v) => v.people),
);
