import * as v from "valibot";

export const StatusSchema = v.pipe(
  v.object({
    status: v.object({
      name: v.string(),
    }),
  }),
  v.transform((v) => v.status.name),
);

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
