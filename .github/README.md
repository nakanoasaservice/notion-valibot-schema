# GitHub Actions dependencies

`.github/workflows/actions.lock` pins the actions used by this repository's
workflows, including publishing workflows and transitive action dependencies.
GitHub Actions runs the locked commits for onboarded workflows.

After adding a workflow or changing a `uses:` reference, regenerate and verify
the lockfile from the repository root:

```sh
gh extension install github/gh-actions-lock # First-time setup
gh actions-lock
gh actions-lock --verify
```

Commit the workflow changes and generated lockfile together. Do not edit the
lockfile by hand. `gh actions-lock --verify-local` is an optional offline coverage
check; `--verify` also checks the locked references against GitHub.

The Actions lockfile workflow runs `gh actions-lock --verify` on pull requests
and pushes to `main` that change `.github/workflows/**` (including `actions.lock`)
or an `action.yml` / `action.yaml` manifest. Existing Dependabot GitHub Actions
updates also refresh the corresponding entries for onboarded workflows.
