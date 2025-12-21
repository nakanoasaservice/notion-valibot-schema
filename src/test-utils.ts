import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

export type Extends<T, U> = T extends U ? true : false;

export type NotionProperty = PageObjectResponse["properties"][string];

export type NonNullableValues<T> = { [K in keyof T]: NonNullable<T[K]> };
