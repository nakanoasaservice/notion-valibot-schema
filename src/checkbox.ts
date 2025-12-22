import * as v from "valibot";

export const CheckboxSchema = v.pipe(
	v.object({
		checkbox: v.boolean(),
	}),
	v.transform((v) => v.checkbox),
);
