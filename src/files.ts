import * as v from "valibot";

export const FilesSchema = v.pipe(
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
