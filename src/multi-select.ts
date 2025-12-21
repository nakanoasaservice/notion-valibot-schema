import * as v from "valibot";

export function MultiSelectSchema<T extends v.GenericSchema<string>>(
  schema: T,
) {
  return v.pipe(
    v.object({
      multi_select: v.array(
        v.object({
          name: schema,
        }),
      ),
    }),
    v.transform((v) => v.multi_select.map((v) => v.name!)),
  );
}
