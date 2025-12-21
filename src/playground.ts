import * as v from "valibot";

export const NullableUrlSchema = v.pipe(
  v.object({
    url: v.nullable(v.string()),
  }),
  v.transform((v) => v.url),
);

export const UrlSchema = v.pipe(
  v.object({
    url: v.string(),
  }),
  v.transform((v) => v.url),
);

export const NullableStatusSchema = v.pipe(
  v.object({
    status: v.nullable(
      v.object({
        name: v.string(),
      }),
    ),
  }),
  v.transform((v) => v.status?.name),
);

export const NullableEmailSchema = v.pipe(
  v.object({
    email: v.nullable(v.string()),
  }),
  v.transform((v) => v.email),
);

export const NullablePhoneNumberSchema = v.pipe(
  v.object({
    phone_number: v.nullable(v.string()),
  }),
  v.transform((v) => v.phone_number),
);

export const NullableCheckboxSchema = v.pipe(
  v.object({
    checkbox: v.boolean(),
  }),
  v.transform((v) => v.checkbox),
);

export const NullableFilesSchema = v.pipe(
  v.object({
    files: v.array(
      v.object({
        file: v.object({
          url: v.string(),
        }),
      }),
    ),
  }),
  v.transform((v) => v.files.map((v) => v.file.url)),
);

export const NullableCreatedByNameSchema = v.pipe(
  v.object({
    created_by: v.object({
      name: v.nullish(v.string(), null),
    }),
  }),
  v.transform((v) => v.created_by.name),
);

export const NullableCreatedByIdSchema = v.pipe(
  v.object({
    created_by: v.object({
      id: v.string(),
    }),
  }),
  v.transform((v) => v.created_by.id),
);

export const NullableCreatedTimeSchema = v.pipe(
  v.object({
    created_time: v.pipe(
      v.string(),
      v.transform((v) => new Date(v)),
    ),
  }),
  v.transform((v) => v.created_time),
);

export const NullableLastEditedByNameSchema = v.pipe(
  v.object({
    last_edited_by: v.object({
      name: v.nullish(v.string(), null),
    }),
  }),
  v.transform((v) => v.last_edited_by.name),
);

export const LastEditedByIdSchema = v.pipe(
  v.object({
    last_edited_by: v.object({
      id: v.string(),
    }),
  }),
  v.transform((v) => v.last_edited_by.id),
);

export const LastEditedTimeSchema = v.pipe(
  v.object({
    last_edited_time: v.pipe(
      v.string(),
      v.transform((v) => new Date(v)),
    ),
  }),
  v.transform((v) => v.last_edited_time),
);

export const FormulaSchema = v.pipe(
  v.object({
    formula: v.variant("type", [
      v.object({
        type: v.literal("string"),
        string: v.string(),
      }),
      v.object({
        type: v.literal("date"),
        date: v.nullable(
          v.object({
            start: v.pipe(
              v.string(),
              v.transform((v) => new Date(v)),
            ),
            end: v.nullable(
              v.pipe(
                v.string(),
                v.transform((v) => new Date(v)),
              ),
            ),
          }),
        ),
      }),
      v.object({
        type: v.literal("number"),
        number: v.number(),
      }),
      v.object({
        type: v.literal("boolean"),
        boolean: v.nullable(v.boolean(), false),
      }),
    ]),
  }),
  v.transform((v) => {
    switch (v.formula.type) {
      case "string":
        return v.formula.string;
      case "date":
        return v.formula.date;
      case "number":
        return v.formula.number;
      case "boolean":
        return v.formula.boolean;
    }
  }),
);

export const UniqueIdSchema = v.pipe(
  v.object({
    unique_id: v.object({
      prefix: v.nullish(v.string(), null),
      number: v.nullish(v.number(), null),
    }),
  }),
  v.transform((v) => v.unique_id),
);

const RichTextArraySchema = v.pipe(
  v.array(
    v.object({
      plain_text: v.string(),
    }),
  ),
  v.transform((v) => v.map((v) => v.plain_text).join("")),
);

export const TitleSchema = v.pipe(
  v.object({
    title: RichTextArraySchema,
  }),
  v.transform((v) => v.title),
);

export const RichTextSchema = v.pipe(
  v.object({
    rich_text: RichTextArraySchema,
  }),
  v.transform((v) => v.rich_text),
);

export const PeopleSchema = v.pipe(
  v.object({
    people: v.array(
      v.object({
        id: v.string(),
        name: v.nullish(v.string(), null),
      }),
    ),
  }),
  v.transform((v) => v.people),
);

export const RelationSchema = v.pipe(
  v.object({
    relation: v.array(
      v.pipe(
        v.object({ id: v.string() }),
        v.transform((v) => v.id),
      ),
    ),
  }),
  v.transform((v) => v.relation),
);
