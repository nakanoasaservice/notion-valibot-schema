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
  DueDate: new Date("2023-12-25"),
  Assignee: ["user-id-1", "user-id-2"]
}
```

No more checking for `property.type === 'date'`, handling `null`, or digging through 3 layers of objects just to get a string.

## Features

- 🧩 **Composable**: Works seamlessly with standard Valibot schemas (`v.object`, `v.array`, etc.).
- ✨ **Transformative**: Automatically extracts values (e.g., `RichText[]` -> `string`).
- 🔒 **Type-Safe**: Full TypeScript support with inferred types.
- ✅ **Well Tested**: Backed by a comprehensive test suite covering edge cases.
- 🛠 **Comprehensive**: Supports complex properties like Rollups, Formulas, and Relations.
- 📋 **Partial-aware**: Each schema documents whether it accepts partial `pages.retrieve` / `databases.query` responses via `@notionPartial` JSDoc tags.

## AI Agent Skill

Install the skill so your AI agent automatically uses this library when writing Notion data-fetching code:

```bash
npx skills add nakanoaas/notion-valibot-schema
```

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
  NullableDateSchema,
  CheckboxSchema,
  PeopleIdSchema,
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
    DueDate: NullableDateSchema,
    
    // Map "IsUrgent" -> boolean
    IsUrgent: CheckboxSchema,

    // Map "Assignee" -> string[] (User IDs)
    Assignee: PeopleIdSchema,
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
console.log(task.properties.Assignee);   // ["user-id-1", "user-id-2"] (string[])
```

### Handling Lists (Query Results)

To parse the results of a data source query:

```ts
const TaskListSchema = v.array(TaskPageSchema);

const { results } = await notion.dataSources.query({ data_source_id: "..." });
const tasks = v.parse(TaskListSchema, results);
```

### Partial API Responses

When you fetch pages with [`pages.retrieve`](https://developers.notion.com/reference/retrieve-a-page) or list them with [`databases.query`](https://developers.notion.com/reference/query-a-data-source), Notion may return **partial** property values. This happens when a property has many references (relations, people, rollups, inline mentions, and so on). The API returns at most **25** page/person references per property; beyond that, lists can be truncated (`relation.has_more: true`) or entries may be incomplete.

Each exported schema includes JSDoc tags so you can tell at a glance whether it works with these partial shapes:

| Tag | Meaning |
| :--- | :--- |
| `@notionPartial supported` | Typical partial responses from `pages.retrieve` / `databases.query` parse successfully |
| `@notionPartial not-supported` | Partial responses are missing required fields and `v.parse` will fail |
| `@notionPartialNote` | Optional caveat (truncated lists, required inner schema, recommended alternative) |

**Examples of `supported` schemas** (scalar properties, ID extraction, and schemas that only read fields present in partial responses):

- `CheckboxSchema`, `NumberSchema`, `TitleSchema`, `SelectSchema`, `RelationSchema`, `PeopleIdSchema`, `RollupScalarSchema`, …

**`supported`, but data may still be incomplete** — parsing succeeds, but you may not get every referenced item. Use [`pages.properties.retrieve`](https://developers.notion.com/reference/retrieve-a-page-property) when you need the full list or accurate rollup:

- `RelationSchema`, `PeopleIdSchema`, `FilesSchema`, `RollupSchema`, `TitleSchema` / `RichTextSchema` (inline mentions)

**`not-supported` — choose a different schema for partial responses:**

| Schema | Why | Use instead |
| :--- | :--- | :--- |
| `PersonSchema`, `BotSchema` | Require full user objects (`type: "person"`, `person`, …) | `UserOrGroupSchema`, `UserSchema`, or `PeopleIdSchema` |
| `PeopleSchema(PersonSchema)` / `CreatedBySchema(PersonSchema)` | Inner schema requires full person | `PeopleSchema(UserOrGroupSchema)`, `CreatedByIdSchema`, … |
| Rollup schemas + `type: "incomplete"` / `"unsupported"` | Calculation not finished or unsupported | Wait and retry, or use `pages.properties.retrieve` |

Factory schemas (`PeopleSchema`, `RollupSchema`, `CreatedBySchema`, …) document partial support on the factory itself and on `@param schema` — passing `PersonSchema` or `BotSchema` as the inner schema is **not supported** for partial responses.

```ts
import * as v from "valibot";
import {
  PeopleIdSchema,
  PeopleSchema,
  PersonSchema,
  RelationSchema,
  UserOrGroupSchema,
} from "@nakanoaas/notion-valibot-schema";

const PageSchema = v.object({
  id: v.string(),
  properties: v.object({
    // ✅ IDs only — works with partial people responses
    AssigneeIds: PeopleIdSchema,

    // ✅ Minimal user objects ({ id, object }) — works with partial responses
    Assignees: PeopleSchema(UserOrGroupSchema),

    // ❌ Full person details — fails when API returns partial user objects
    // Owners: PeopleSchema(PersonSchema),

    // ✅ Relation IDs — works; list may be truncated when has_more is true
    RelatedTasks: RelationSchema,
  }),
});

const page = await notion.pages.retrieve({ page_id: "..." });
const parsed = v.parse(PageSchema, page);
```

See each schema's JSDoc on [JSR](https://jsr.io/@nakanoaas/notion-valibot-schema/doc) for its `@notionPartial` status and notes.

## Schema Reference

> 📚 **For complete API documentation, including all available schemas, `@notionPartial` tags, and types, please visit the [JSR Documentation](https://jsr.io/@nakanoaas/notion-valibot-schema/doc).**

| Notion Property | Schema | Output Type | Partial |
| :--- | :--- | :--- | :--- |
| **Text** / Title | `TitleSchema` / `NullableTitleSchema` | `string` / `string \| null` | supported¹ |
| **Rich Text** | `RichTextSchema` / `NullableRichTextSchema` | `string` / `string \| null` | supported¹ |
| **Number** | `NumberSchema` / `NullableNumberSchema` | `number` / `number \| null` | supported |
| **Checkbox** | `CheckboxSchema` | `boolean` | supported |
| **Select** | `SelectSchema(schema)` / `NullableSelectSchema(schema)` | `Inferred<schema>` / `Inferred<schema> \| null` | supported |
| **Multi-Select** | `MultiSelectSchema(schema)` | `Inferred<schema>[]` | supported |
| **Status** | `StatusSchema(schema)` / `NullableStatusSchema(schema)` | `Inferred<schema>` / `Inferred<schema> \| null` | supported |
| **Date** | `DateSchema` / `NullableDateSchema` | `Date` / `Date \| null` | supported |
| **Date** (full object) | `FullDateSchema` / `NullableFullDateSchema` | `{ start: Date; end: Date \| null; time_zone: string \| null }` / same `\| null` | supported |
| **Date** (range, end required) | `DateRangeSchema` / `NullableDateRangeSchema` | `{ start: Date; end: Date; time_zone: string \| null }` / same `\| null` | supported |
| **Relation** | `RelationSchema` / `SingleRelationSchema` / `NullableSingleRelationSchema` | `string[]` / `string` / `string \| null` | supported¹ |
| **Rollup** (array) | `RollupSchema(schema)` | `Inferred<schema>[]` | supported¹² |
| **Rollup** (array, single) | `SingleRollupSchema(schema)` / `NullableSingleRollupSchema(schema)` | `Inferred<schema>` / `Inferred<schema> \| null` | supported¹² |
| **Rollup** (scalar) | `RollupScalarSchema(schema)` | `Inferred<schema>` | supported² |
| **Formula** | `FormulaSchema(schema)` | `Inferred<schema>` | supported¹ |
| **URL** | `UrlSchema` / `NullableUrlSchema` | `string` / `string \| null` | supported |
| **Email** | `EmailSchema` / `NullableEmailSchema` | `string` / `string \| null` | supported |
| **Phone** | `PhoneNumberSchema` / `NullablePhoneNumberSchema` | `string` / `string \| null` | supported |
| **Files** | `FilesSchema` / `SingleFileSchema` / `NullableSingleFileSchema` | `string[]` / `string` / `string \| null` | supported¹ |
| **People** (building blocks) | `UserOrGroupIdSchema` / `UserOrGroupSchema` / `UserSchema` / `PersonSchema` / `BotSchema` | Building-block object types | supported / supported / supported / **not-supported** / **not-supported** |
| **People** (generic) | `PeopleSchema(schema)` / `SinglePeopleSchema(schema)` / `NullableSinglePeopleSchema(schema)` | `Inferred<schema>[]` / `Inferred<schema>` / `Inferred<schema> \| null` | depends on inner schema³ |
| **People** (IDs only) | `PeopleIdSchema` / `SinglePeopleIdSchema` / `NullableSinglePeopleIdSchema` | `string[]` / `string` / `string \| null` | supported¹ |
| **Created By** | `CreatedBySchema(schema)` / `CreatedByIdSchema` / `NullableCreatedByNameSchema` | `Inferred<schema>` / `string` / `string \| null` | depends on inner schema³ / supported / supported |
| **Last Edited By** | `LastEditedBySchema(schema)` / `LastEditedByIdSchema` / `NullableLastEditedByNameSchema` | `Inferred<schema>` / `string` / `string \| null` | depends on inner schema³ / supported / supported |
| **Created / Edited Time** | `CreatedTimeSchema` / `LastEditedTimeSchema` | `Date` | supported |
| **Place** | `PlaceSchema` / `NullablePlaceSchema` | `{ lat: number; lon: number; name?: string \| null; address?: string \| null }` / same `\| null` | supported |
| **Unique ID** | `UniqueIdSchema` / `PrefixedUniqueIdSchema` / `FullUniqueIdSchema` | `number` / `string` (e.g. `"PREFIX-123"`) / `{ prefix: string \| null; number: number \| null }` | supported |
| **Verification** | `VerificationSchema` / `NullableVerificationSchema` | `{ state: "unverified" \| "verified" \| "expired"; date: DateObject \| null; verified_by: UserObject \| null }` / same `\| null` | supported |

¹ Parsing succeeds, but lists or inline mentions may be **truncated** beyond 25 references. Use `pages.properties.retrieve` for complete data.

² Does not accept rollup `type: "incomplete"` or `type: "unsupported"`.

³ Use `UserOrGroupSchema` or `UserSchema` for partial responses. `PersonSchema` / `BotSchema` inner schemas are **not supported**.

### Advanced Schemas

#### Date variants

The Date property has three levels of detail depending on how much you need:

```ts
import {
  DateSchema,          // start only → Date
  NullableDateSchema,  // start only → Date | null

  FullDateSchema,          // start + optional end → { start: Date; end: Date | null; time_zone }
  NullableFullDateSchema,  // → same | null

  DateRangeSchema,          // start + required end → { start: Date; end: Date; time_zone }
  NullableDateRangeSchema,  // → same | null
} from "@nakanoaas/notion-valibot-schema";
```

#### Formulas

Formulas in Notion can return different types (string, number, boolean, date). Use `FormulaSchema` with the matching inner schema for each formula property.

```ts
import * as v from "valibot";
import {
  BooleanFormulaSchema,
  FormulaSchema,
  NumberSchema,
  DateSchema,
  StringFormulaSchema,
} from "@nakanoaas/notion-valibot-schema";

const PageSchema = v.object({
  id: v.string(),
  properties: v.object({
    FormulaText:    FormulaSchema(StringFormulaSchema),
    FormulaNumber:  FormulaSchema(NumberSchema),
    FormulaBoolean: FormulaSchema(BooleanFormulaSchema),
    FormulaDate:    FormulaSchema(DateSchema),
  }),
});

const page = await notion.pages.retrieve({ page_id: "..." });
const parsed = v.parse(PageSchema, page);
// parsed.properties.FormulaText:    string
// parsed.properties.FormulaNumber:  number
// parsed.properties.FormulaBoolean: boolean
// parsed.properties.FormulaDate:    Date
```

#### Rollups

```ts
import {
  RollupSchema,              // array rollup → Inferred<schema>[]
  SingleRollupSchema,        // array rollup, first item → Inferred<schema>
  NullableSingleRollupSchema, // array rollup, first item or null → Inferred<schema> | null
  RollupScalarSchema,        // scalar rollup (number / date) → Inferred<schema>
  NumberSchema,
  DateSchema,
} from "@nakanoaas/notion-valibot-schema";

const MySchema = v.object({
  // Sum/Average rollup (returns number)
  TotalCost: RollupScalarSchema(NumberSchema),

  // Date rollup (returns Date)
  LatestMeeting: RollupScalarSchema(DateSchema),

  // Array rollup (e.g., pulling tags from related items)
  AllTags: RollupSchema(v.string()),

  // Single-element array rollup (returns the one item, not an array)
  PrimaryTag: SingleRollupSchema(v.string()),

  // Single-element or empty array rollup (returns item or null)
  OptionalPrimaryTag: NullableSingleRollupSchema(v.string()),
});
```

#### People & Created/Edited By

People-related schemas are organized into **building blocks**, **generic factories**, and **convenience schemas**:

- **Building blocks** (`UserOrGroupIdSchema`, `UserOrGroupSchema`, `UserSchema`, `PersonSchema`, `BotSchema`) validate individual user/group objects.
- **Generic factories** (`PeopleSchema`, `SinglePeopleSchema`, `NullableSinglePeopleSchema`, `CreatedBySchema`, `LastEditedBySchema`) accept a building-block schema and extract the property value.
- **Convenience schemas** (`PeopleIdSchema`, `CreatedByIdSchema`, etc.) require no generic parameter and extract common primitives like IDs or names.

```ts
import * as v from "valibot";
import {
  CreatedByIdSchema,
  CreatedBySchema,
  PeopleIdSchema,
  PeopleSchema,
  PersonSchema,
  UserSchema,
} from "@nakanoaas/notion-valibot-schema";

const PageSchema = v.object({
  id: v.string(),
  properties: v.object({
    // Full person details
    People: PeopleSchema(PersonSchema),

    // IDs only
    AssigneeIds: PeopleIdSchema,

    // created_by ID
    CreatedById: CreatedByIdSchema,

    // created_by full user object
    CreatedBy: CreatedBySchema(UserSchema),
  }),
});
```

#### Unique ID

```ts
import {
  UniqueIdSchema,          // → number  (e.g. 123)
  PrefixedUniqueIdSchema,  // → string  (e.g. "TASK-123"; requires prefix to be non-null)
  FullUniqueIdSchema,      // → { prefix: string | null; number: number | null }
} from "@nakanoaas/notion-valibot-schema";
```

## License

MIT © [Nakano as a Service](https://github.com/nakanoasaservice)
