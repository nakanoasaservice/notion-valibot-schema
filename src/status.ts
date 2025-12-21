import * as v from "valibot";

export const NullableStatusSchema = v.pipe(
  v.object({
    status: v.nullable(
      v.object({
        name: v.string(),
      }),
    ),
  }),
  v.transform((v) => v.status?.name),
);
