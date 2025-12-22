import * as v from "valibot";

export function FormulaSchema<
	S extends v.GenericSchema<
		| { type: "string"; string: string | null }
		| { type: "number"; number: number | null }
		| { type: "boolean"; boolean: boolean | null }
		| {
				type: "date";
				date: {
					start: string;
					end: string | null;
					time_zone: string | null;
				} | null;
		  },
		unknown
	>,
>(schema: S) {
	return v.pipe(
		v.object({
			formula: schema,
		}),
		// biome-ignore lint/style/noNonNullAssertion: valibot inference is not working correctly
		v.transform((v) => v.formula!),
	);
}
