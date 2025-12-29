# Notion Valibot Schema

[![npm version](https://img.shields.io/npm/v/%40nakanoaas%2Fnotion-valibot-schema)](https://www.npmjs.com/package/@nakanoaas/notion-valibot-schema)
[![JSR version](https://jsr.io/badges/@nakanoaas/notion-valibot-schema)](https://jsr.io/@nakanoaas/notion-valibot-schema)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Turn Notion's nested API responses into clean, typed JavaScript values.**

This library provides a collection of [Valibot](https://github.com/fabian-hiller/valibot) schemas specifically designed to handle Notion API objects. It doesn't just validate; it **transforms** deeply nested Notion properties into simple, usable primitives like `string`, `number`, `Date`, and `boolean`.

## The Problem

When you fetch a page from Notion, properties are deeply nested. To access them type-safely, you end up writing **verbose type guards for every single property**.

```ts
// 😫 The "Native" Way (Boilerplate Hell)

// 1. Get the property
const statusProp = page.properties["Status"];

// 2. Check if it exists and has the correct type
if (statusProp?.type === "status" && statusProp.status) {
  // 3. Finally access the value
  console.log(statusProp.status.name); // "In Progress"
}

// Repeat this for every property... 
const tagsProp = page.properties["Tags"];
if (tagsProp?.type === "multi_select") {
  console.log(tagsProp.multi_select.map(t => t.name)); 
}
```

## The Solution

With `@nakanoaas/notion-valibot-schema`, you get this:

```ts
// After parsing
{
  Status: "In Progress",
  Tags: ["Urgent", "Work"],
  DueDate: new Date("2023-12-25")
}
```

No more checking for `property.type === 'date'`, handling `null`, or digging through 3 layers of objects just to get a string.

## Features

- 🧩 **Composable**: Works seamlessly with standard Valibot schemas (`v.object`, `v.array`, etc.).
- ✨ **Transformative**: Automatically extracts values (e.g., `RichText[]` -> `string`).
- 🔒 **Type-Safe**: Full TypeScript support with inferred types.
- ✅ **Well Tested**: Backed by a comprehensive test suite covering edge cases.
- 🛠 **Comprehensive**: Supports complex properties like Rollups, Formulas, and Relations.

## Installation

### Node.js (npm / pnpm / yarn / bun)

```bash
npm install @nakanoaas/notion-valibot-schema valibot
```

```bash
pnpm add @nakanoaas/notion-valibot-schema valibot
```

### Deno / JSR

```bash
deno add @nakanoaas/notion-valibot-schema @valibot/valibot
```

## Usage

### Basic Example

Here is how to validate and transform a Notion page retrieved from the API.

```ts
import * as v from "valibot";
import {
  TitleSchema,
  RichTextSchema,
  StatusSchema,
  MultiSelectSchema,
  NullableSingleDateSchema,
  CheckboxSchema,
} from "@nakanoaas/notion-valibot-schema";

// 1. Define your schema based on your Data Source properties
const TaskPageSchema = v.object({
  id: v.string(),
  properties: v.object({
    // Map "Name" property -> string
    Name: TitleSchema,
    
    // Map "Description" property -> string
    Description: RichTextSchema,
    
    // Map "Status" property -> "ToDo" | "Doing" | "Done"
    Status: StatusSchema(v.picklist(["ToDo", "Doing", "Done"])),
    
    // Map "Tags" -> string[]
    Tags: MultiSelectSchema(v.string()),
    
    // Map "Due Date" -> Date | null
    DueDate: NullableSingleDateSchema,
    
    // Map "IsUrgent" -> boolean
    IsUrgent: CheckboxSchema,
  }),
});

// 2. Fetch data from Notion
const page = await notion.pages.retrieve({ page_id: "..." });

// 3. Parse and transform
const task = v.parse(TaskPageSchema, page);

// 4. Use your clean data
console.log(task.properties.Name);       // "Buy Milk" (string)
console.log(task.properties.DueDate);    // Date object or null
console.log(task.properties.Tags);       // ["Personal", "Shopping"] (string[])
```

### Handling Lists (Query Results)

To parse the results of a data source query:

```ts
const TaskListSchema = v.array(TaskPageSchema);

const { results } = await notion.dataSources.query({ data_source_id: "..." });
const tasks = v.parse(TaskListSchema, results);
```

## Schema Reference

> 📚 **For complete API documentation, including all available schemas and types, please visit the [JSR Documentation](https://jsr.io/@nakanoaas/notion-valibot-schema/doc).**

| Notion Property | Schema | Transformed Output (Type) |
| :--- | :--- | :--- |
| **Text** / Title | `TitleSchema` / `RichTextSchema` | `string` |
| **Number** | `NumberSchema` / `NullableNumberSchema` | `number` / `number \| null` |
| **Checkbox** | `CheckboxSchema` | `boolean` |
| **Select** | `SelectSchema(schema)` | `Inferred<schema>` |
| **Multi-Select** | `MultiSelectSchema(schema)` | `Inferred<schema>[]` |
| **Status** | `StatusSchema(schema)` | `Inferred<schema>` |
| **Date** (Single) | `SingleDateSchema` / `NullableSingleDateSchema` | `Date` / `Date \| null` |
| **Date** (Range) | `RangeDateSchema` / `NullableRangeDateSchema` | `{ start: Date; end: Date; time_zone: string \| null }` / `{ start: Date; end: Date; time_zone: string \| null } \| null` |
| **Date** (Full) | `FullDateSchema` / `NullableFullDateSchema` | `{ start: Date; end: Date \| null; time_zone: string \| null }` / `{ start: Date; end: Date \| null; time_zone: string \| null } \| null` |
| **Relation** | `RelationSchema` | `string[]` (Page IDs) |
| **Relation** (Single) | `SingleRelationSchema` | `string` (Page ID) |
| **URL** | `UrlSchema` | `string` |
| **Email** | `EmailSchema` | `string` |
| **Phone** | `PhoneNumberSchema` | `string` |
| **Files** | `FilesSchema` | `string[]` (URLs) |
| **Created/Edited By** | `CreatedBySchema` / `LastEditedBySchema` | `string` (User ID) |
| **Created/Edited Time**| `CreatedTimeSchema` / `LastEditedTimeSchema` | `Date` |
| **People** | `PeopleSchema` / `PeopleIdSchema` | `Array<{ id: string; object: "user" \| "bot" \| "group"; name: string \| null }>` / `string[]` |
| **Place** | `PlaceSchema` / `NullablePlaceSchema` | `{ lat: number; lon: number; name?: string \| null; address?: string \| null }` / `{ lat: number; lon: number; name?: string \| null; address?: string \| null } \| null` |
| **Unique ID** | `UniqueIdNumberSchema` / `NullableUniqueIdSchema` | `number` / `{ prefix: string \| null; number: number \| null }` |
| **Verification** | `VerificationSchema` / `NullableVerificationSchema` | `{ state: "unverified" \| "verified" \| "expired"; date: DateObject \| null; verified_by: Person \| null }` / `{ state: "unverified" \| "verified" \| "expired"; date: DateObject \| null; verified_by: Person \| null } \| null` |

### Advanced Schemas

#### Formulas
Formulas in Notion can return different types (string, number, boolean, date). Use `FormulaSchema` with a specific inner schema to handle this.

```ts
import { FormulaSchema, RichTextSchema } from "@nakanoaas/notion-valibot-schema";

const MySchema = v.object({
  // If your formula returns text
  MyFormula: FormulaSchema(RichTextSchema), 
});
```

#### Rollups
Rollups are powerful but complex. We provide helpers for common rollup types.

```ts
import { 
  RollupNumberSchema, 
  RollupDateSchema, 
  RollupArraySchema 
} from "@nakanoaas/notion-valibot-schema";

const MySchema = v.object({
  // Sum/Average rollup (returns number)
  TotalCost: RollupNumberSchema,
  
  // Date rollup (returns Date)
  LatestMeeting: RollupDateSchema,
  
  // Array rollup (e.g., pulling tags from related items)
  AllTags: RollupArraySchema(v.string())
});
```

## License

MIT © [Nakano as a Service](https://github.com/nakanoasaservice)
