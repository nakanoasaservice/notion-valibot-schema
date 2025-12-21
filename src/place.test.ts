import { describe, it } from "@std/testing/bdd";
import { assertType, type IsExact } from "@std/testing/types";
import * as v from "valibot";
import { NullablePlaceSchema, PlaceSchema } from "./place.ts";
import type {
  Extends,
  NonNullableValues,
  SelectNotionProperty,
} from "./test-utils.ts";
import { assertEquals } from "@std/assert/equals";

type TargetType = SelectNotionProperty<"place">;

describe("place", () => {
  describe("PlaceSchema", () => {
    describe("type checking", () => {
      it("should accept non-nullable place property input type", () => {
        assertType<
          Extends<
            NonNullableValues<TargetType>,
            v.InferInput<typeof PlaceSchema>
          >
        >(true);
      });

      it("should have correct output type", () => {
        assertType<
          IsExact<
            v.InferOutput<typeof PlaceSchema>,
            {
              lat: number;
              lon: number;
              name?: string | null;
              address?: string | null;
            }
          >
        >(true);
      });
    });

    describe("parsing", () => {
      it("should parse place property and extract place value", () => {
        const result = v.parse(
          PlaceSchema,
          {
            place: {
              lat: 35.6762,
              lon: 139.6503,
              name: "Tokyo",
              address: "Tokyo, Japan",
            },
          } satisfies TargetType,
        );

        assertEquals(result.lat, 35.6762);
        assertEquals(result.lon, 139.6503);
        assertEquals(result.name, "Tokyo");
        assertEquals(result.address, "Tokyo, Japan");
      });

      it("should parse place property with nullish name and address", () => {
        const result = v.parse(
          PlaceSchema,
          {
            place: {
              lat: 35.6762,
              lon: 139.6503,
              name: null,
              address: null,
            },
          } satisfies TargetType,
        );

        assertEquals(result.lat, 35.6762);
        assertEquals(result.lon, 139.6503);
        assertEquals(result.name, null);
        assertEquals(result.address, null);
      });

      it("should reject null for non-nullable place schema", () => {
        assertEquals(
          v.safeParse(
            PlaceSchema,
            { place: null } satisfies TargetType,
          ).success,
          false,
        );
      });
    });
  });

  describe("NullablePlaceSchema", () => {
    describe("type checking", () => {
      it("should accept place property or null input type", () => {
        assertType<
          Extends<
            TargetType,
            v.InferInput<typeof NullablePlaceSchema>
          >
        >(true);
      });

      it("should have correct output type", () => {
        assertType<
          IsExact<
            v.InferOutput<typeof NullablePlaceSchema>,
            {
              lat: number;
              lon: number;
              name?: string | null;
              address?: string | null;
            } | null
          >
        >(true);
      });
    });

    describe("parsing", () => {
      it("should parse place property and return place value", () => {
        const result = v.parse(
          NullablePlaceSchema,
          {
            place: {
              lat: 35.6762,
              lon: 139.6503,
              name: "Tokyo",
              address: "Tokyo, Japan",
            },
          } satisfies TargetType,
        );

        assertEquals(result?.lat, 35.6762);
        assertEquals(result?.lon, 139.6503);
        assertEquals(result?.name, "Tokyo");
        assertEquals(result?.address, "Tokyo, Japan");
      });

      it("should parse null place property and return null", () => {
        assertEquals(
          v.parse(
            NullablePlaceSchema,
            { place: null } satisfies TargetType,
          ),
          null,
        );
      });
    });
  });
});
