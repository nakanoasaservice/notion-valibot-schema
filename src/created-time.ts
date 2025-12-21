import * as v from "valibot";

export const NullableCreatedTimeSchema = v.pipe(
  v.object({
    created_time: v.pipe(
      v.string(),
      v.transform((v) => new Date(v)),
    ),
  }),
  v.transform((v) => v.created_time),
);
