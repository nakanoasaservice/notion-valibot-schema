import * as v from "valibot";

const InnerRelationSchema = v.object({ id: v.string() });

export const RelationSchema = v.pipe(
	v.object({
		relation: v.array(InnerRelationSchema),
	}),
	v.transform((v) => v.relation.map((r) => r.id)),
);

export const SingleRelationSchema = v.pipe(
	v.object({
		relation: v.tuple([InnerRelationSchema]),
	}),
	v.transform((v) => v.relation[0].id),
);

export const NullableSingleRelationSchema = v.pipe(
	v.object({
		relation: v.array(InnerRelationSchema),
	}),
	v.transform((v) => v.relation[0]?.id ?? null),
);
