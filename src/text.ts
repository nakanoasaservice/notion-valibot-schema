import * as v from "valibot";

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
