import type {
	PageObjectResponse,
	PartialUserObjectResponse,
	RollupFunction,
} from "@notionhq/client/build/src/api-endpoints";

type NotionProperty = PageObjectResponse["properties"][string];

export type NonNullableValues<T> = { [K in keyof T]: NonNullable<T[K]> };

export type SelectNotionProperty<T extends NotionProperty["type"]> = Omit<
	Extract<NotionProperty, { type: T }>,
	"id" | "type"
>;

/** Property value shape from `pages.retrieve` / `databases.query` (SDK models partial select/rollup, etc.). */
export type PartialNotionPropertyValue<T extends NotionProperty["type"]> =
	SelectNotionProperty<T>;

/** Partial property value with nullable fields narrowed (for non-nullable schema tests). */
export type NonemptyPartialNotionPropertyValue<
	T extends NotionProperty["type"],
> = NonNullableValues<PartialNotionPropertyValue<T>>;

/** Minimal `people` property value (`PartialUserObjectResponse` entries only). */
export type PartialPeoplePropertyValue = {
	people: PartialUserObjectResponse[];
};

/** Single-entry `people` partial (one-element array from API responses). */
export type PartialSinglePeoplePropertyValue = {
	people: [PartialUserObjectResponse];
};

/** `relation` property value including runtime-only `has_more` (not in SDK types). */
export type PartialRelationPropertyValue = SelectNotionProperty<"relation"> & {
	has_more?: boolean;
};

/** Single-entry `relation` partial (one-element array from API responses). */
export type PartialSingleRelationPropertyValue =
	PartialRelationPropertyValue & {
		relation: [PartialNotionPropertyValue<"relation">["relation"][number]];
	};

/** Minimal `created_by` property value. */
export type PartialCreatedByPropertyValue = {
	created_by: PartialUserObjectResponse;
};

/** Minimal `last_edited_by` property value. */
export type PartialLastEditedByPropertyValue = {
	last_edited_by: PartialUserObjectResponse;
};

/** Rollup `type: "incomplete"` (negative tests; not in SDK `PartialRollupValueResponse`). */
export type IncompleteRollupPropertyValue = {
	rollup: {
		function: RollupFunction;
		type: "incomplete";
		incomplete: Record<string, never>;
	};
};
