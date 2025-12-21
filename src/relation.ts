import * as v from "valibot";

export const RelationSchema = v.pipe(
  v.object({
    relation: v.array(
      v.object({ id: v.string() }),
    ),
  }),
  v.transform((v) => v.relation.map((r) => r.id)),
);
