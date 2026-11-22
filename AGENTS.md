<!--VITE PLUS START-->

# Using Vite+, the Unified Toolchain for the Web

This project is using Vite+, a unified toolchain built on top of Vite, Rolldown, Vitest, tsdown, Oxlint, Oxfmt, and Vite Task. Vite+ wraps runtime management, package management, and frontend tooling in a single global CLI called `vp`. Vite+ is distinct from Vite, and it invokes Vite through `vp dev` and `vp build`. Run `vp help` to print a list of commands and `vp <command> --help` for information about a specific command.

Docs are local at `node_modules/vite-plus/docs` or online at https://viteplus.dev/guide/.

## Built-in Commands vs Scripts

`vp <name>` runs a built-in command. `vp run <name>` runs a `package.json` script or a `vite.config.ts` task. Scripts cannot overwrite built-ins, so `vp dev` and `vp run dev` may do different things. Check `package.json` and `vite.config.ts` first, and run `vp run <name>` when the project defines a script or task with that name.

## Running Scripts

Run TypeScript and JavaScript files with `vpx <file>`, for example `vpx ./scripts/seed.ts --dry-run`. It handles enums, decorators, JSX, and tsconfig `paths`, so do not add `tsx` or `ts-node` to run scripts. `vpx --watch <file>` reruns the file when a file it uses changes, in place of `tsx watch`. `vp node <file>` runs plain Node.js.

## Tool Versions

Run `vp toolchain` to show versions and relationships in the active Vite+
release. Add a tool name to select part of the graph. For example, run
`vp toolchain vite`. Use `--global` to ignore the local `vite-plus` package. Use
`vp why <package>` to show the package-manager dependency graph.

## Review Checklist

- [ ] Run `vp install` after pulling remote changes and before getting started.
- [ ] Run `vp check` and `vp test` to format, lint, type check and test changes.
- [ ] Check if there are `vite.config.ts` tasks or `package.json` scripts necessary for validation, run via `vp run <script>`.
- [ ] If setup, runtime, or package-manager behavior looks wrong, run `vp env doctor` and include its output when asking for help.

<!--VITE PLUS END-->

## Toolchain

- Development Node.js is pinned only in `package.json#devEngines.runtime`. `mise.toml` provides bootstrap majors; use the global Vite+ CLI with environment management enabled for exact runtime selection. Compatibility CI may override the development pin.

- Node 24 and pnpm (version from `packageManager` in `package.json`; see `mise.toml`). The Vite+ CLI `vp` is installed by `vite-plus`.
- Verify with `pnpm install --frozen-lockfile`, `vp check`, `vp run test`, `vp pack`. CI runs the same (`.github/workflows/check.yml`, required check `Check`) and fails if the build leaves uncommitted changes.

## Dependency updates

- Dependabot opens update PRs (`.github/dependabot.yml`). `.github/workflows/dependabot-triage.yml` enables auto-merge for patch/minor updates on versions >= 1.0; GitHub merges them once `Check` passes. Majors and 0.x minors are left for review.
- Not managed by Dependabot: the Vite+ toolchain (`vite-plus`, `vite`). `vite-plus` and `vite` (an npm alias for `@voidzero-dev/vite-plus-core`) are pinned in the `catalog` of `pnpm-workspace.yaml`, and `vite` is forced via `overrides`. CI and publish workflows resolve the Vite+ version from the catalog automatically. Update the toolchain entries together and run `pnpm install` to refresh `pnpm-lock.yaml`.
- Do not update `valibot` (also ignored in `dependabot.yml`): the dev dependency stays at the lowest supported peer version so tests cover it.
- This is a library published to npm and JSR. `valibot` is a peer dependency: widen or raise `peerDependencies` only deliberately (it also sets the JSR import range), and treat any change to the public API or the peer range as a release-relevant change.
- Merging to `main` publishes nothing. `.github/workflows/publish.yml` runs only on manual `workflow_dispatch` from `main`; it publishes the `package.json` version to JSR and npm and creates a GitHub release. Do not run it or any publish command.
