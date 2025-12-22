import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

type NotionProperty = PageObjectResponse["properties"][string];

export type NonNullableValues<T> = { [K in keyof T]: NonNullable<T[K]> };

export type SelectNotionProperty<T extends NotionProperty["type"]> = Omit<
	Extract<NotionProperty, { type: T }>,
	"id" | "type"
>;
