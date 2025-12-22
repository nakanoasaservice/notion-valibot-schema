import * as v from "valibot";
import { describe, expect, expectTypeOf, it } from "vitest";

import type { NonNullableValues, SelectNotionProperty } from "./test-utils.ts";
import {
	NullableVerificationSchema,
	VerificationSchema,
} from "./verification.ts";

type TargetType = SelectNotionProperty<"verification">;

describe("verification", () => {
	describe("VerificationSchema", () => {
		describe("type checking", () => {
			it("should accept verification property input type", () => {
				expectTypeOf<NonNullableValues<TargetType>>().toExtend<
					v.InferInput<typeof VerificationSchema>
				>();
			});
		});

		describe("parsing", () => {
			it("should parse unverified verification property and return 'unverified'", () => {
				const result = v.parse(VerificationSchema, {
					verification: {
						state: "unverified",
						date: null,
						verified_by: null,
					},
				} satisfies TargetType);

				expect(result?.state).toEqual("unverified");
			});

			it("should parse verified verification property and return 'verified'", () => {
				const result = v.parse(VerificationSchema, {
					verification: {
						state: "verified",
						date: {
							start: "2024-01-15T00:00:00.000Z",
							end: null,
							time_zone: null,
						},
						verified_by: {
							id: "user-1",
							object: "user",
						},
					},
				} satisfies TargetType);

				expect(result?.state).toEqual("verified");
			});

			it("should parse verified verification property with end date", () => {
				const result = v.parse(VerificationSchema, {
					verification: {
						state: "verified",
						date: {
							start: "2024-01-15T00:00:00.000Z",
							end: "2024-01-20T00:00:00.000Z",
							time_zone: null,
						},
						verified_by: {
							id: "user-1",
							object: "user",
						},
					},
				} satisfies TargetType);

				expect(result?.state).toEqual("verified");
			});

			it("should parse expired verification property and return 'expired'", () => {
				const result = v.parse(VerificationSchema, {
					verification: {
						state: "expired",
						date: {
							start: "2024-01-15T00:00:00.000Z",
							end: null,
							time_zone: null,
						},
						verified_by: {
							id: "user-1",
							object: "user",
						},
					},
				} satisfies TargetType);

				expect(result?.state).toEqual("expired");
			});

			it("should parse expired verification property with time zone", () => {
				const result = v.parse(VerificationSchema, {
					verification: {
						state: "expired",
						date: {
							start: "2024-01-15T00:00:00.000Z",
							end: null,
							time_zone: "Asia/Tokyo",
						},
						verified_by: {
							id: "user-1",
							object: "user",
						},
					},
				} satisfies TargetType);

				expect(result?.state).toEqual("expired");
			});
		});
	});

	describe("NullableVerificationSchema", () => {
		describe("type checking", () => {
			it("should accept verification property or null input type", () => {
				expectTypeOf<TargetType>().toExtend<
					v.InferInput<typeof NullableVerificationSchema>
				>();
			});
		});

		describe("parsing", () => {
			it("should parse unverified verification property and return 'unverified'", () => {
				const result = v.parse(NullableVerificationSchema, {
					verification: {
						state: "unverified",
						date: null,
						verified_by: null,
					},
				} satisfies TargetType);

				expect(result?.state).toEqual("unverified");
			});

			it("should parse verified verification property and return 'verified'", () => {
				const result = v.parse(NullableVerificationSchema, {
					verification: {
						state: "verified",
						date: {
							start: "2024-01-15T00:00:00.000Z",
							end: null,
							time_zone: null,
						},
						verified_by: {
							id: "user-1",
							object: "user",
						},
					},
				} satisfies TargetType);

				expect(result?.state).toEqual("verified");
			});

			it("should parse expired verification property and return 'expired'", () => {
				const result = v.parse(NullableVerificationSchema, {
					verification: {
						state: "expired",
						date: {
							start: "2024-01-15T00:00:00.000Z",
							end: null,
							time_zone: null,
						},
						verified_by: {
							id: "user-1",
							object: "user",
						},
					},
				} satisfies TargetType);

				expect(result?.state).toEqual("expired");
			});

			it("should parse null verification property and return null", () => {
				expect(
					v.parse(NullableVerificationSchema, {
						verification: null,
					} satisfies TargetType),
				).toBe(null);
			});
		});
	});
});
