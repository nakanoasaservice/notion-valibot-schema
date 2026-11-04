import { readFile, writeFile } from "node:fs/promises";

import { defineConfig } from "vite-plus";

export default defineConfig({
	staged: {
		"*": "vp check --fix",
	},
	fmt: {
		// Match the previous Biome formatter: tabs and an 80-column width.
		// Markdown examples keep their hand-aligned layout.
		printWidth: 80,
		sortImports: true,
		ignorePatterns: ["dist/**", "**/*.md"],
		overrides: [
			{
				files: ["**/*.{js,jsx,ts,tsx,mjs,cjs,json,jsonc}"],
				options: {
					useTabs: true,
				},
			},
		],
	},
	lint: {
		ignorePatterns: ["dist/**"],
		jsPlugins: [{ name: "vite-plus", specifier: "vite-plus/oxlint-plugin" }],
		rules: {
			"vite-plus/prefer-vite-plus-imports": "error",
			"typescript/no-non-null-assertion": "error",
		},
		// Type-aware lint rules only. Compiler diagnostics stay on
		// `vp test --typecheck`: oxlint's type checker reports passing
		// `expectTypeOf` assertions as TS2344.
		options: { typeAware: true },
	},
	pack: {
		entry: "src/index.ts",
		format: ["cjs", "esm"],
		unbundle: true,
		exports: true,
		dts: true,
		sourcemap: true,
		clean: true,
		hooks: {
			"build:done": async () => {
				const packageJson = JSON.parse(
					await readFile("package.json", "utf-8"),
				) as {
					name: string;
					version: string;
					license: string;
					peerDependencies: {
						valibot: string;
					};
				};

				await writeFile(
					"jsr.jsonc",
					JSON.stringify(
						{
							name: packageJson.name,
							version: packageJson.version,
							license: packageJson.license,
							exports: "./src/index.ts",
							publish: {
								include: ["src", "README.md", "LICENSE"],
								exclude: ["**/*.test.ts", "test-utils.ts"],
							},
							imports: {
								valibot: `jsr:@valibot/valibot@${packageJson.peerDependencies.valibot}`,
							},
						},
						null,
						2,
					),
				);
			},
		},
	},
});
