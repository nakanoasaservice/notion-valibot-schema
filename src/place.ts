import * as v from "valibot";

const PlaceObjectSchema = v.object({
  lat: v.number(),
  lon: v.number(),
  name: v.nullish(v.string()),
  address: v.nullish(v.string()),
});

export const PlaceSchema = v.pipe(
  v.object({
    place: PlaceObjectSchema,
  }),
  v.transform((v) => v.place),
);

export const NullablePlaceSchema = v.pipe(
  v.object({
    place: v.nullable(PlaceObjectSchema),
  }),
  v.transform((v) => v.place),
);
