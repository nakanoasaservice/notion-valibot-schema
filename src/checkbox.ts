import * as v from "valibot";

export const NullableCheckboxSchema = v.pipe(
  v.object({
    checkbox: v.boolean(),
  }),
  v.transform((v) => v.checkbox),
);
