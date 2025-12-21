import * as v from "valibot";

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
            start: v.string(),
            end: v.nullable(v.string()),
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
        return v.formula.date
          ? {
            start: new Date(v.formula.date.start),
            end: v.formula.date.end ? new Date(v.formula.date.end) : null,
          }
          : null;
      case "number":
        return v.formula.number;
      case "boolean":
        return v.formula.boolean;
    }
  }),
);
