# Notion Valibot Schema

A small collection of **[Valibot](https://github.com/fabian-hiller/valibot)** schemas for the Notion API.

It helps you **validate and transform** Notion `properties` into plain JavaScript values (e.g. `string`, `number`, `Date`, `string[]`) so you can work with the results without dealing with Notion’s nested property shapes.

## Install

### npm / pnpm / yarn

```bash
npm i @nakanoaas/notion-valibot-schema valibot
```

```bash
pnpm add @nakanoaas/notion-valibot-schema valibot
```

```bash
yarn add @nakanoaas/notion-valibot-schema valibot
```

### JSR

```bash
deno add @nakanoaas/notion-valibot-schema @valibot/valibot
```

## Usage

### Parse a Notion database page (common pattern)

This example shows how to parse a page returned by `notion.pages.retrieve()` (or an item from `notion.databases.query().results`) and turn its `properties` into plain values.

```ts
import * as v from "valibot";
import {
	CheckboxSchema,
	FilesSchema,
	MultiSelectSchema,
	NullableDateSchema,
	NullableNumberSchema,
	NullableStatusSchema,
	NullableUrlSchema,
	RelationSchema,
	RichTextSchema,
	TitleSchema,
} from "@nakanoaas/notion-valibot-schema";

// Property keys must match your database property names exactly.
const NotionTaskPageSchema = v.object({
	id: v.string(),
	properties: v.object({
		Name: TitleSchema, // -> string
		Notes: RichTextSchema, // -> string
		Status: NullableStatusSchema(v.string()), // -> string | null
		Tags: MultiSelectSchema(v.string()), // -> string[]
		Due: NullableDateSchema, // -> Date | null
		Points: NullableNumberSchema, // -> number | null
		Done: CheckboxSchema, // -> boolean
		Website: NullableUrlSchema, // -> string | null
		Attachments: FilesSchema, // -> string[] (URLs)
		Related: RelationSchema, // -> string[] (page IDs)
	}),
});

// Fetch a page with the Notion SDK
// const page = await notion.pages.retrieve({ page_id: "..." });

// Validate + transform
const task = v.parse(NotionTaskPageSchema, page);

// task.properties is now easy to use
task.properties.Name; // string
task.properties.Due; // Date | null
task.properties.Tags; // string[]
```

### Parse query results

```ts
import * as v from "valibot";

const NotionTaskListSchema = v.array(NotionTaskPageSchema);

// const { results } = await notion.dataSources.query({ data_source_id: "..." });
const tasks = v.parse(NotionTaskListSchema, results);
```

## Exports

This package re-exports all schemas from `src/index.ts`.

- **Text**
  - `TitleSchema`: `{ title: RichText[] }` → `string`
  - `RichTextSchema`: `{ rich_text: RichText[] }` → `string`
- **Numbers**
  - `NumberSchema`: `{ number: number }` → `number`
  - `NullableNumberSchema`: `{ number: number | null }` → `number | null`
- **Dates**
  - `DateSchema`: `{ date: { start: string } }` → `Date`
  - `NullableDateSchema`: `{ date: { start: string } | null }` → `Date | null`
  - `FullDateSchema`: `{ date: { start: string; end: string } }` → `{ start: Date; end: Date }`
  - `NullableFullDateSchema`: `{ date: { start: string; end: string | null } | null }` → `{ start: Date; end: Date | null } | null`
- **Select-like**
  - `SelectSchema(schema)`: `{ select: { name: ... } }` → inferred
  - `NullableSelectSchema(schema)`: `{ select: { name: ... } | null }` → inferred | `null`
  - `StatusSchema(schema)`: `{ status: { name: ... } }` → inferred
  - `NullableStatusSchema(schema)`: `{ status: { name: ... } | null }` → inferred | `null`
  - `MultiSelectSchema(schema)`: `{ multi_select: { name: ... }[] }` → inferred[]
- **Other common property types**
  - `CheckboxSchema`: `{ checkbox: boolean }` → `boolean`
  - `EmailSchema` / `NullableEmailSchema`
  - `PhoneNumberSchema` / `NullablePhoneNumberSchema`
  - `UrlSchema` / `NullableUrlSchema`
  - `RelationSchema`: `{ relation: { id: string }[] }` → `string[]`
  - `FilesSchema`: `{ files: (file | external)[] }` → `string[]` (URLs)

And more: created/last-edited fields, rollup, formula, unique_id, people, place, verification, etc.

## Notes

- **Property names are user-defined** in Notion. In your schema, keys like `Name` / `Status` must match the names in your database.
- These schemas focus on **parsing property values**, so you can embed them in your own page/database schemas.

## License

MIT
