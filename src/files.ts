import * as v from "valibot";

/**
 * Schema to extract the `files` property from a Notion page property and transform it to an array of URLs.
 *
 * **Input:**
 * ```
 * {
 *   files: Array<{
 *     type: "file";
 *     file: {
 *       url: string;
 *     };
 *   } | {
 *     type: "external";
 *     external: {
 *       url: string;
 *     };
 *   }>;
 * }
 * ```
 *
 * **Output:** `string[]`
 *
 * @example
 * ```ts
 * import * as v from "valibot";
 * import { FilesSchema } from "@nakanoaas/notion-valibot-utils";
 *
 * const PageSchema = v.object({
 *   id: v.string(),
 *   properties: v.object({
 *     Files: FilesSchema,
 *   }),
 * });
 *
 * const page = await notion.pages.retrieve({ page_id: "..." });
 * const parsed = v.parse(PageSchema, page);
 * // parsed.properties.Files: string[]
 * ```
 */
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
