import * as v from "valibot";

import { PersonSchema } from "./people";

export const NullableLastEditedByNameSchema = v.pipe(
	v.object({
		last_edited_by: PersonSchema,
	}),
	v.transform((v) => v.last_edited_by.name),
);

export const LastEditedByIdSchema = v.pipe(
	v.object({
		last_edited_by: PersonSchema,
	}),
	v.transform((v) => v.last_edited_by.id),
);
