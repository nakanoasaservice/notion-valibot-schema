import * as v from "valibot";

import { PersonSchema } from "./people";

export const CreatedBySchema = v.pipe(
	v.object({
		created_by: PersonSchema,
	}),
	v.transform((v) => v.created_by),
);

export const CreatedByIdSchema = v.pipe(
	v.object({
		created_by: PersonSchema,
	}),
	v.transform((v) => v.created_by.id),
);
