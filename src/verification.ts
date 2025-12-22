import * as v from "valibot";

import { PersonSchema } from "./people";

const InnerVerificationSchema = v.variant("state", [
	v.object({
		state: v.literal("unverified"),
		date: v.null_(),
		verified_by: v.null_(),
	}),
	v.object({
		state: v.union([v.literal("verified"), v.literal("expired")]),
		date: v.nullable(
			v.object({
				start: v.string(),
				end: v.nullable(v.string()),
				time_zone: v.nullable(v.string()),
			}),
		),
		verified_by: v.nullable(PersonSchema),
	}),
]);

export const VerificationSchema = v.pipe(
	v.object({
		verification: InnerVerificationSchema,
	}),
	v.transform((v) => v.verification),
);

export const NullableVerificationSchema = v.pipe(
	v.object({
		verification: v.nullable(InnerVerificationSchema),
	}),
	v.transform((v) => v.verification),
);
