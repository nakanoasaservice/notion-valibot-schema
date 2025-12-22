import * as v from "valibot";

export function StatusSchema<T extends v.GenericSchema<string>>(schema: T) {
	return v.pipe(
		v.object({
			status: v.object({
				name: schema,
			}),
		}),
		// biome-ignore lint/style/noNonNullAssertion: valibot inference is not working correctly
		v.transform((v) => v.status.name!),
	);
}

export function NullableStatusSchema<T extends v.GenericSchema<string>>(
	schema: T,
) {
	return v.pipe(
		v.object({
			status: v.nullable(
				v.object({
					name: schema,
				}),
			),
		}),
		v.transform((v) => v.status?.name ?? null),
	);
}
