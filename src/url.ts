import * as v from "valibot";

export const NullableUrlSchema = v.pipe(
  v.object({
    url: v.nullable(v.string()),
  }),
  v.transform((v) => v.url),
);

export const UrlSchema = v.pipe(
  v.object({
    url: v.string(),
  }),
  v.transform((v) => v.url),
);
