import * as v from "valibot";

export function MultiSelectSchema<T extends v.GenericSchema<string>>(
	schema: T,
) {
	return v.pipe(
		v.object({
			multi_select: v.array(
				v.object({
					name: schema,
				}),
			),
		}),
		// biome-ignore lint/style/noNonNullAssertion: valibot inference is not working correctly
		v.transform((v) => v.multi_select.map((v) => v.name!)),
	);
}
