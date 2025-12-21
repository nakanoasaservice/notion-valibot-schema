import * as v from "valibot";

export const NullableLastEditedByNameSchema = v.pipe(
  v.object({
    last_edited_by: v.object({
      name: v.nullish(v.string(), null),
    }),
  }),
  v.transform((v) => v.last_edited_by.name),
);

export const LastEditedByIdSchema = v.pipe(
  v.object({
    last_edited_by: v.object({
      id: v.string(),
    }),
  }),
  v.transform((v) => v.last_edited_by.id),
);
