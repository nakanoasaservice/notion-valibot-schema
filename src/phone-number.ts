import * as v from "valibot";

export const PhoneNumberSchema = v.pipe(
  v.object({
    phone_number: v.string(),
  }),
  v.transform((v) => v.phone_number),
);

export const NullablePhoneNumberSchema = v.pipe(
  v.object({
    phone_number: v.nullable(v.string()),
  }),
  v.transform((v) => v.phone_number),
);
