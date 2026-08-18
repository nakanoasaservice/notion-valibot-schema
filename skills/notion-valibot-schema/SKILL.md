---
name: notion-valibot-schema
description: >
  Use whenever writing TypeScript code that fetches or parses data from Notion —
  querying databases, retrieving pages, or typing Notion API responses — even if the
  library is not mentioned. NOT for writing to Notion or modifying database schemas.
---

# notion-valibot-schema

`@nakanoaas/notion-valibot-schema` transforms Notion's deeply nested API responses
into clean, typed JS values using valibot. Instead of manually checking
`property.type === "status"`, you define a schema once and get a typed value out.

## Workflow

### Step 1 — Discover the database schema

**Try Notion MCP first.** Use `ToolSearch` with query `"notion"` to find available Notion tools. If tools like `notion_query_database`, `notion_retrieve_database`, or similar appear:
1. Ask the user: "What's the database ID or URL?" (if not already provided)
2. Call the appropriate tool to retrieve the database properties
3. Extract the `properties` map from the response — each key is the property name, each value has a `type` field

**Fallback (no Notion MCP or user prefers not to share ID):**
Ask the user to either:
- Paste the Notion API JSON for the database or a page, OR
- Describe their properties as `PropertyName (notion_type)`, e.g. "Status (status), DueDate (date)"

### Step 2 — Map each property to the right schema

Use this table. For factory schemas marked with `(schema)`, see the factory guide below.

| Notion `type`    | Schema                                              | Output type                        |
|------------------|-----------------------------------------------------|------------------------------------|
| `title`          | `TitleSchema`                                       | `string`                           |
| `rich_text`      | `RichTextSchema` / `NullableRichTextSchema`         | `string` / `string \| null`        |
| `number`         | `NumberSchema` / `NullableNumberSchema`             | `number` / `number \| null`        |
| `checkbox`       | `CheckboxSchema`                                    | `boolean` (never null)             |
| `select`         | `SelectSchema(schema)` / `NullableSelectSchema(schema)` | `T` / `T \| null`             |
| `multi_select`   | `MultiSelectSchema(schema)`                         | `T[]` (empty array if none)        |
| `status`         | `StatusSchema(schema)` / `NullableStatusSchema(schema)` | `T` / `T \| null`             |
| `date`           | `NullableDateSchema` / `DateSchema`                 | `Date \| null` / `Date`            |
| `date` (w/ end)  | `NullableFullDateSchema` / `FullDateSchema`         | `{ start, end, time_zone } \| null`|
| `date` (range)   | `NullableDateRangeSchema` / `DateRangeSchema`       | `{ start, end (required), time_zone } \| null` |
| `relation`       | `RelationSchema`                                    | `string[]` (page IDs)              |
| `relation` (1)   | `NullableSingleRelationSchema` / `SingleRelationSchema` | `string \| null` / `string`    |
| `rollup` (array) | `RollupSchema(schema)`                              | `T[]`                              |
| `rollup` (1)     | `SingleRollupSchema(schema)` / `NullableSingleRollupSchema(schema)` | `T` / `T \| null` |
| `rollup` (scalar)| `RollupScalarSchema(schema)`                        | `T`                                |
| `formula`        | `FormulaSchema(schema)`                             | inferred from inner schema         |
| `url`            | `UrlSchema` / `NullableUrlSchema`                   | `string` / `string \| null`        |
| `email`          | `EmailSchema` / `NullableEmailSchema`               | `string` / `string \| null`        |
| `phone_number`   | `PhoneNumberSchema` / `NullablePhoneNumberSchema`   | `string` / `string \| null`        |
| `files`          | `FilesSchema`                                       | `string[]` (URLs)                  |
| `files` (1)      | `SingleFileSchema` / `NullableSingleFileSchema`     | `string` / `string \| null`        |
| `people`         | `PeopleIdSchema`                                    | `string[]` (user IDs, partial-safe)|
| `people` (full)  | `PeopleSchema(UserOrGroupSchema)`                   | user objects (partial-safe)        |
| `created_by`     | `CreatedByIdSchema`                                 | `string` (user ID, partial-safe)   |
| `last_edited_by` | `LastEditedByIdSchema`                              | `string` (user ID, partial-safe)   |
| `created_time`   | `CreatedTimeSchema`                                 | `Date`                             |
| `last_edited_time`| `LastEditedTimeSchema`                             | `Date`                             |
| `unique_id`      | `UniqueIdSchema` / `PrefixedUniqueIdSchema`         | `number` / `"PREFIX-123"`          |
| `verification`   | `VerificationSchema` / `NullableVerificationSchema` | `{ state, date, verified_by } \| null` |

**Nullable decision rule:**
- Default to the **non-nullable** schema (`DateSchema`, `SelectSchema`, etc.) for cleaner, more direct code.
- Switch to `Nullable*` only when the user explicitly says the property can be empty, or when the Notion database clearly allows blank values for that property.
- Properties that are structurally always non-null regardless: `checkbox`, `title`, `multi_select`, `relation`, `people`, `created_time`, `last_edited_time`, `created_by`, `last_edited_by`, `unique_id`.

### Factory schema guide

**Select / Status** — pass a `v.picklist` of known values, or `v.string()` if unknown:
```ts
Status: StatusSchema(v.picklist(["Todo", "In Progress", "Done"])),
Category: NullableSelectSchema(v.picklist(["Work", "Personal"])),
```

**MultiSelect** — usually `v.string()` unless you want to restrict to known options:
```ts
Tags: MultiSelectSchema(v.string()),
Priority: MultiSelectSchema(v.picklist(["High", "Medium", "Low"])),
```

**Formula** — match the formula's return type:
```ts
import { FormulaSchema, StringFormulaSchema, BooleanFormulaSchema } from "@nakanoaas/notion-valibot-schema";
FormulaText:    FormulaSchema(StringFormulaSchema),
FormulaNumber:  FormulaSchema(NumberSchema),
FormulaBoolean: FormulaSchema(BooleanFormulaSchema),
FormulaDate:    FormulaSchema(DateSchema),
```

**People / CreatedBy / LastEditedBy** — for partial API safety, prefer ID-only schemas:
```ts
Assignees: PeopleIdSchema,          // string[] — always partial-safe
Author: CreatedByIdSchema,          // string   — always partial-safe
// Full objects only when you need name/email and call pages.properties.retrieve:
Assignees: PeopleSchema(UserOrGroupSchema),
```
> ⚠️ `PersonSchema` / `BotSchema` as inner schemas are **not** partial-safe — they fail when `dataSources.query` returns truncated user objects.

**Rollup** — pass a schema matching what each rolled-up item evaluates to:
```ts
TotalPrice: RollupScalarSchema(NumberSchema),   // scalar number rollup
ItemNames:  RollupSchema(TitleSchema),          // array rollup of titles
```

### Step 3 — Generate the code

> **⚠️ API name — common mistake**: Notion's SDK uses `notion.dataSources.query({ data_source_id })`, **not** `notion.databases.query`. Do not use `databases.query` or `database_id` — these are from the old API and will not work. Always use `dataSources.query` with `data_source_id`.

Produce a complete, ready-to-paste TypeScript snippet:

```ts
import * as v from "valibot";
import {
  // Import only what you use
  TitleSchema,
  NullableDateSchema,
  StatusSchema,
  MultiSelectSchema,
  CheckboxSchema,
  PeopleIdSchema,
} from "@nakanoaas/notion-valibot-schema";

// Replace property keys with the exact Notion display names
const TaskPageSchema = v.object({
  id: v.string(),
  properties: v.object({
    Name:      TitleSchema,
    Status:    StatusSchema(v.picklist(["Todo", "In Progress", "Done"])),
    DueDate:   NullableDateSchema,
    Tags:      MultiSelectSchema(v.string()),
    IsUrgent:  CheckboxSchema,
    Assignees: PeopleIdSchema,
  }),
});

type TaskPage = v.InferOutput<typeof TaskPageSchema>;

// For dataSources.query (listing pages in a database):
const { results } = await notion.dataSources.query({ data_source_id: "YOUR_DB_ID" });
const tasks = results.map(page => v.parse(TaskPageSchema, page));

// For pages.retrieve:
const page = await notion.pages.retrieve({ page_id: "YOUR_PAGE_ID" });
const task = v.parse(TaskPageSchema, page);
```

**Always include:**
- Only the imports actually used
- `type X = v.InferOutput<typeof XSchema>` for the TypeScript type
- The correct property display names (exact string keys from Notion)
- Installation note if the user hasn't set up the library:

```bash
npm install @nakanoaas/notion-valibot-schema valibot
# or: pnpm add @nakanoaas/notion-valibot-schema valibot
```

## Partial API response reminders

Most schemas work with `dataSources.query` and `pages.retrieve` partial responses.
Surface these edge cases when relevant:
- **Relation / People lists truncated at 25**: mention that `pages.properties.retrieve` is needed for the full list
- **`PersonSchema` / `BotSchema` not partial-safe**: guide toward `UserOrGroupSchema` or ID schemas
- **Rollup `"incomplete"` / `"unsupported"` types**: `RollupSchema` will throw — advise retry or `pages.properties.retrieve`
