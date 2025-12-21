import * as v from "valibot";

export const NullableCreatedTimeSchema = v.pipe(
  v.object({
    created_time: v.string(),
  }),
  v.transform((v) => new Date(v.created_time)),
);
