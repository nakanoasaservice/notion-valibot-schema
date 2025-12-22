import * as v from "valibot";

const RichTextArraySchema = v.array(
	v.object({
		plain_text: v.string(),
	}),
);

export const TitleSchema = v.pipe(
	v.object({
		title: RichTextArraySchema,
	}),
	v.transform((v) => v.title.map((v) => v.plain_text).join("")),
);

export const RichTextSchema = v.pipe(
	v.object({
		rich_text: RichTextArraySchema,
	}),
	v.transform((v) => v.rich_text.map((v) => v.plain_text).join("")),
);
