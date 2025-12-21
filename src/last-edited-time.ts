import * as v from "valibot";

export const LastEditedTimeSchema = v.pipe(
  v.object({
    last_edited_time: v.pipe(
      v.string(),
      v.transform((v) => new Date(v)),
    ),
  }),
  v.transform((v) => v.last_edited_time),
);
