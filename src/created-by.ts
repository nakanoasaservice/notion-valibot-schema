import * as v from "valibot";

export const NullableCreatedByNameSchema = v.pipe(
  v.object({
    created_by: v.object({
      name: v.nullish(v.string(), null),
    }),
  }),
  v.transform((v) => v.created_by.name),
);

export const NullableCreatedByIdSchema = v.pipe(
  v.object({
    created_by: v.object({
      id: v.string(),
    }),
  }),
  v.transform((v) => v.created_by.id),
);
