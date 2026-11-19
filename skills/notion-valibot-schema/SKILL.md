---
name: notion-valibot-schema
description: >
  Use whenever writing TypeScript code that fetches or parses data from Notion —
  querying databases, retrieving pages, or typing Notion API responses — even if the
  library is not mentioned. NOT for writing to Notion or modifying database schemas.
---

# notion-valibot-schema

`@nakanoaas/notion-valibot-schema` (peer dependency: `valibot`) provides valibot
schemas that turn a Notion property value into a plain value. Put them under
`properties` in a page schema:

```ts
const TaskSchema = v.object({
  id: v.string(),
  properties: v.object({
    Name: TitleSchema,                                       // key = exact Notion property name
    Status: StatusSchema(v.picklist(["Todo", "Done"])),
    Due: NullableDateSchema,
  }),
});
const { results } = await notion.dataSources.query({ data_source_id });
const tasks = v.parse(v.array(TaskSchema), results);
```

## Schemas by Notion `type`

`[Nullable]X` means both `X` (fails on an empty value) and `NullableX` (returns `null`) exist. Use the non-null one unless the property can be empty.

| `type` | Schema → output |
|---|---|
| `title`, `rich_text` | `[Nullable]TitleSchema`, `[Nullable]RichTextSchema` → `string` |
| `number`, `url`, `email`, `phone_number` | `[Nullable]NumberSchema`, `[Nullable]UrlSchema`, `[Nullable]EmailSchema`, `[Nullable]PhoneNumberSchema` |
| `checkbox` | `CheckboxSchema` → `boolean` |
| `select`, `status` | `[Nullable]SelectSchema(s)`, `[Nullable]StatusSchema(s)` → output of `s` (`v.picklist([...])` or `v.string()`) |
| `multi_select` | `MultiSelectSchema(s)` → `s[]` |
| `date` | `[Nullable]DateSchema` → `Date` (start only); `[Nullable]FullDateSchema` → `{ start, end \| null, time_zone }`; `[Nullable]DateRangeSchema` → end required |
| `created_time`, `last_edited_time` | `CreatedTimeSchema`, `LastEditedTimeSchema` → `Date` |
| `relation` | `RelationSchema` → page IDs; `SingleRelationSchema` / `NullableSingleRelationSchema` → one ID |
| `files` | `FilesSchema` → URLs; `SingleFileSchema` / `NullableSingleFileSchema` → one URL |
| `people` | `PeopleIdSchema` → user IDs; `SinglePeopleIdSchema` / `NullableSinglePeopleIdSchema`; `PeopleSchema(s)` / `SinglePeopleSchema(s)` / `NullableSinglePeopleSchema(s)` with `s` = `UserOrGroupSchema`, `UserSchema`, `UserOrGroupIdSchema`, `PersonSchema`, `BotSchema` |
| `created_by`, `last_edited_by` | `CreatedByIdSchema`, `LastEditedByIdSchema` → ID; `NullableCreatedByNameSchema`, `NullableLastEditedByNameSchema` → name; `CreatedBySchema(s)`, `LastEditedBySchema(s)` |
| `formula` | `FormulaSchema(s)`, `s` = `[Nullable]StringFormulaSchema`, `[Nullable]NumberSchema`, `[Nullable]BooleanFormulaSchema`, `[Nullable]DateSchema` |
| `rollup` | `RollupScalarSchema(NumberSchema \| DateSchema)` for sum/date rollups; array rollups: `RollupSchema(s)` → `s[]`, `SingleRollupSchema(s)`, `NullableSingleRollupSchema(s)`, where `s` is a property schema such as `TitleSchema` |
| `unique_id` | `UniqueIdSchema` → `number`; `PrefixedUniqueIdSchema` → `"PREFIX-123"`; `FullUniqueIdSchema` → `{ prefix, number }` |
| `place` | `[Nullable]PlaceSchema` → `{ lat, lon, name?, address? }` |
| `verification` | `[Nullable]VerificationSchema` → `{ state, date, verified_by }` |

## Partial responses

`dataSources.query` and `pages.retrieve` can return partial values:

- `PersonSchema` and `BotSchema` need full user objects and fail on partial ones. Use `PeopleIdSchema`, `UserOrGroupSchema` or `UserSchema` instead.
- Relation, people and file lists, and mentions in text, stop at 25 items. For the full list, use `pages.properties.retrieve`.
- Rollup schemas fail on rollups of type `"incomplete"` or `"unsupported"`.
