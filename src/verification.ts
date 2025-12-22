import * as v from "valibot";

import { DateObjectSchema } from "./date";
import { PersonSchema } from "./people";

const InnerVerificationSchema = v.variant("state", [
	v.object({
		state: v.literal("unverified"),
		date: v.null_(),
		verified_by: v.null_(),
	}),
	v.object({
		state: v.union([v.literal("verified"), v.literal("expired")]),
		date: v.nullable(DateObjectSchema),
		verified_by: v.nullable(PersonSchema),
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
 *     verified_by: Person | null;
 *   }
 * }
 * ```
 *
 * **Output:**
 * ```
 * {
 *   state: "unverified" | "verified" | "expired";
 *   date: DateObject | null;
 *   verified_by: Person | null;
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
 * // parsed.properties.Verification: { state: "unverified" | "verified" | "expired"; date: DateObject | null; verified_by: Person | null }
 * ```
 */
export const VerificationSchema = v.pipe(
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
 *     verified_by: Person | null;
 *   } | null
 * }
 * ```
 *
 * **Output:**
 * ```
 * {
 *   state: "unverified" | "verified" | "expired";
 *   date: DateObject | null;
 *   verified_by: Person | null;
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
 * // parsed.properties.Verification: { state: "unverified" | "verified" | "expired"; date: DateObject | null; verified_by: Person | null } | null
 * ```
 */
export const NullableVerificationSchema = v.pipe(
	v.object({
		verification: v.nullable(InnerVerificationSchema),
	}),
	v.transform((v) => v.verification),
);
