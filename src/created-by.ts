import * as v from "valibot";

export const CreatedBySchema = v.pipe(
	v.object({
		created_by: v.object({
			id: v.string(),
			object: v.literal("user"),
			name: v.nullish(v.string(), null),
		}),
	}),
	v.transform((v) => v.created_by),
);

export const CreatedByIdSchema = v.pipe(
	v.object({
		created_by: v.object({
			id: v.string(),
		}),
	}),
	v.transform((v) => v.created_by.id),
);
