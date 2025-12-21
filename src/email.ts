import * as v from "valibot";

export const EmailSchema = v.pipe(
  v.object({
    email: v.string(),
  }),
  v.transform((v) => v.email),
);

export const NullableEmailSchema = v.pipe(
  v.object({
    email: v.nullable(v.string()),
  }),
  v.transform((v) => v.email),
);
