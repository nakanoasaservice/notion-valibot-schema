import * as v from "valibot";

export function SelectSchema<T extends v.GenericSchema<string>>(
  schema: T,
) {
  return v.pipe(
    v.object({
      select: v.object({
        name: schema,
      }),
    }),
    v.transform((v) => v.select.name!),
  );
}

export function NullableSelectSchema<T extends v.GenericSchema<string>>(
  schema: T,
) {
  return v.pipe(
    v.object({
      select: v.nullable(
        v.object({
          name: schema,
        }),
      ),
    }),
    v.transform((v) => v.select?.name ?? null),
  );
}
