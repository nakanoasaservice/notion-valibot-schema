import * as v from "valibot";

/**
 * Schema for a Notion file object structure.
 *
 * **Input:**
 * ```
 * {
 *   type: "file";
 *   file: {
 *     url: string;
 *   };
 * } | {
 *   type: "external";
 *   external: {
 *     url: string;
 *   };
 * }
 * ```
 *
 * @internal
 */
const InnerFileSchema = v.variant("type", [
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
]);

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
 * @notionPartial supported
 * @notionPartialNote File lists may be truncated beyond 25 entries. Use `pages.properties.retrieve` for complete data.
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
		files: v.array(InnerFileSchema),
	}),
	v.transform((v) =>
		v.files.map((v) => (v.type === "file" ? v.file.url : v.external.url)),
	),
);

/**
 * Schema to extract the `files` property from a Notion page property and transform it to a single URL.
 *
 * **Input:**
 * ```
 * {
 *   files: [{
 *     type: "file";
 *     file: {
 *       url: string;
 *     };
 *   } | {
 *     type: "external";
 *     external: {
 *       url: string;
 *     };
 *   }];
 * }
 * ```
 *
 * **Output:** `string`
 *
 * @notionPartial supported
 * @notionPartialNote File lists may be truncated beyond 25 entries.
 *
 * @example
 * ```ts
 * import * as v from "valibot";
 * import { SingleFileSchema } from "@nakanoaas/notion-valibot-utils";
 *
 * const PageSchema = v.object({
 *   id: v.string(),
 *   properties: v.object({
 *     Attachment: SingleFileSchema,
 *   }),
 * });
 *
 * const page = await notion.pages.retrieve({ page_id: "..." });
 * const parsed = v.parse(PageSchema, page);
 * // parsed.properties.Attachment: string
 * ```
 */
export const SingleFileSchema = v.pipe(
	v.object({
		files: v.tuple([InnerFileSchema]),
	}),
	v.transform((v) => {
		const file = v.files[0];
		return file.type === "file" ? file.file.url : file.external.url;
	}),
);

/**
 * Schema to extract the `files` property from a Notion page property and transform it to a single URL or `null`.
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
 * **Output:** `string | null`
 *
 * @notionPartial supported
 * @notionPartialNote File lists may be truncated beyond 25 entries.
 *
 * @example
 * ```ts
 * import * as v from "valibot";
 * import { NullableSingleFileSchema } from "@nakanoaas/notion-valibot-utils";
 *
 * const PageSchema = v.object({
 *   id: v.string(),
 *   properties: v.object({
 *     Attachment: NullableSingleFileSchema,
 *   }),
 * });
 *
 * const page = await notion.pages.retrieve({ page_id: "..." });
 * const parsed = v.parse(PageSchema, page);
 * // parsed.properties.Attachment: string | null
 * ```
 */
export const NullableSingleFileSchema = v.pipe(
	v.object({
		files: v.array(InnerFileSchema),
	}),
	v.transform((v) => {
		const file = v.files[0];
		if (!file) {
			return null;
		}
		return file.type === "file" ? file.file.url : file.external.url;
	}),
);
