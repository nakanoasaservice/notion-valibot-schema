import * as v from "valibot";

export const FilesSchema = v.pipe(
	v.object({
		files: v.array(
			v.variant("type", [
				v.object({
					type: v.literal("file"),
					file: v.object({
						url: v.string(),
					}),
				}),
				v.object({
					type: v.literal("external"),
					external: v.object({
						url: v.string(),
					}),
				}),
			]),
		),
	}),
	v.transform((v) =>
		v.files.map((v) => (v.type === "file" ? v.file.url : v.external.url)),
	),
);
