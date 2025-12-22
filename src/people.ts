import * as v from "valibot";

export const PersonSchema = v.object({
	id: v.string(),
	object: v.picklist(["user", "bot", "group"]),
	name: v.nullish(v.string(), null),
});

export const PeopleSchema = v.pipe(
	v.object({
		people: v.array(PersonSchema),
	}),
	v.transform((v) => v.people),
);
