import * as v from "valibot";

export const UniqueIdSchema = v.pipe(
  v.object({
    unique_id: v.object({
      prefix: v.nullish(v.string(), null),
      number: v.nullish(v.number(), null),
    }),
  }),
  v.transform((v) => v.unique_id),
);
