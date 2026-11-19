import * as v from "valibot";

import { DateObjectSchema } from "./date";
import { UserSchema } from "./people";

const InnerVerificationSchema: v.GenericSchema<
	| { state: "unverified"; date: null; verified_by: null }
	| {
			state: "verified" | "expired";
			date: v.InferInput<typeof DateObjectSchema> | null;
			verified_by: v.InferInput<typeof UserSchema> | null;
	  },
	| { state: "unverified"; date: null; verified_by: null }
	| {
			state: "verified" | "expired";
			date: v.InferOutput<typeof DateObjectSchema> | null;
			verified_by: v.InferOutput<typeof UserSchema> | null;
	  }
> = v.variant("state", [
	v.object({
		state: v.literal("unverified"),
		date: v.null_(),
		verified_by: v.null_(),
	}),
	v.object({
		state: v.picklist(["verified", "expired"]),
		date: v.nullable(DateObjectSchema),
		verified_by: v.nullable(UserSchema),
	}),
]);

/**
 * Schema to extract the `verification` object from a Notion property.
 *
 * **Input:**
 * ```
 * {
 *   verification: {
 *     state: "unverified" | "verified" | "expired";
 *     date: DateObject | null;
 *     verified_by: { id: string; object: "user"; name?: string | null; avatar_url?: string | null; ... } | null;
 *   }
 * }
 * ```
 *
 * **Output:**
 * ```
 * {
 *   state: "unverified" | "verified" | "expired";
 *   date: DateObject | null;
 *   verified_by: { id: string; object: "user"; name: string | null; avatar_url: string | null } | null;
 * }
 * ```
 *
 * @example
 * ```ts
 * import * as v from "valibot";
 * import { VerificationSchema } from "@nakanoaas/notion-valibot-schema";
 *
 * const PageSchema = v.object({
 *   id: v.string(),
 *   properties: v.object({
 *     Verification: VerificationSchema,
 *   }),
 * });
 *
 * const page = await notion.pages.retrieve({ page_id: "..." });
 * const parsed = v.parse(PageSchema, page);
 * // parsed.properties.Verification: { state: "unverified" | "verified" | "expired"; date: DateObject | null; verified_by: { id: string; object: "user"; name: string | null; avatar_url: string | null } | null }
 * ```
 *
 * @notionPartial supported
 */
export const VerificationSchema: v.GenericSchema<
	{
		verification:
			| { state: "unverified"; date: null; verified_by: null }
			| {
					state: "verified" | "expired";
					date: v.InferInput<typeof DateObjectSchema> | null;
					verified_by: v.InferInput<typeof UserSchema> | null;
			  };
	},
	| { state: "unverified"; date: null; verified_by: null }
	| {
			state: "verified" | "expired";
			date: v.InferOutput<typeof DateObjectSchema> | null;
			verified_by: v.InferOutput<typeof UserSchema> | null;
	  }
> = v.pipe(
	v.object({
		verification: InnerVerificationSchema,
	}),
	v.transform((v) => v.verification),
);

/**
 * Schema to extract the `verification` object from a Notion property (nullable).
 *
 * **Input:**
 * ```
 * {
 *   verification: {
 *     state: "unverified" | "verified" | "expired";
 *     date: DateObject | null;
 *     verified_by: { id: string; object: "user"; name?: string | null; avatar_url?: string | null; ... } | null;
 *   } | null
 * }
 * ```
 *
 * **Output:**
 * ```
 * {
 *   state: "unverified" | "verified" | "expired";
 *   date: DateObject | null;
 *   verified_by: { id: string; object: "user"; name: string | null; avatar_url: string | null } | null;
 * } | null
 * ```
 *
 * @example
 * ```ts
 * import * as v from "valibot";
 * import { NullableVerificationSchema } from "@nakanoaas/notion-valibot-schema";
 *
 * const PageSchema = v.object({
 *   id: v.string(),
 *   properties: v.object({
 *     Verification: NullableVerificationSchema,
 *   }),
 * });
 *
 * const page = await notion.pages.retrieve({ page_id: "..." });
 * const parsed = v.parse(PageSchema, page);
 * // parsed.properties.Verification: { state: "unverified" | "verified" | "expired"; date: DateObject | null; verified_by: { id: string; object: "user"; name: string | null; avatar_url: string | null } | null } | null
 * ```
 *
 * @notionPartial supported
 */
export const NullableVerificationSchema: v.GenericSchema<
	{
		verification:
			| (
					| { state: "unverified"; date: null; verified_by: null }
					| {
							state: "verified" | "expired";
							date: v.InferInput<typeof DateObjectSchema> | null;
							verified_by: v.InferInput<typeof UserSchema> | null;
					  }
			  )
			| null;
	},
	| (
			| { state: "unverified"; date: null; verified_by: null }
			| {
					state: "verified" | "expired";
					date: v.InferOutput<typeof DateObjectSchema> | null;
					verified_by: v.InferOutput<typeof UserSchema> | null;
			  }
	  )
	| null
> = v.pipe(
	v.object({
		verification: v.nullable(InnerVerificationSchema),
	}),
	v.transform((v) => v.verification),
);
