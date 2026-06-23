# Operations Guidelines

## File Editing

When editing files:

- Preserve existing formatting where reasonable.
- Do not reorder imports unnecessarily.
- Do not rename files without a clear reason.
- Do not move files unless the requested task requires it.
- Do not delete code unless it is clearly unused or explicitly requested.
- Do not modify generated files unless necessary.
- Do not modify environment files or secrets.
- Do not introduce placeholder code into production paths.

## Environment And Secrets

Do not commit secrets.

Do not expose:

- API keys
- access tokens
- private credentials
- `.env` values
- deployment secrets

If environment variables are needed, use example names and document them without real values.

## Private Context Handling

`.contexts/` is a private, gitignored context store.

- Do not publish `.contexts/` contents into public docs, website copy, commit messages, pull request text, or reports unless the user explicitly requests that exact disclosure.
- When using company or private-project material as source context, write public-facing summaries that avoid confidential implementation details.
- Before finishing work that touches private context, check that `.contexts/` files are not shown as tracked or untracked public changes.

## Temporary Artifact Lifecycle

Keep repository resources only while they have an active purpose.

- Treat `tmp/` and everything below it as user-managed source material. Preserve
  it unless the user explicitly requests an exact cleanup or move.
- Create a file under `.agents/handoffs/` only for unresolved work that is
  expected to resume in a later session. Keep project-specific handoffs in this
  gitignored workspace directory rather than substituting global memory.
- Keep durable project-specific context in `AGENTS.md`, `.agents/guidelines/`,
  or the relevant project document. Native Codex Memories may provide automatic
  recall, but they are not the source of truth and should not require routine
  per-thread curation.
- When a handoff is resolved or superseded, move any durable decision to the
  appropriate guideline, ADR, architecture document, or planning source of
  truth; then remove the handoff and its references.
- Reserve `.codex/` for active repository-local Codex runtime configuration,
  hooks, or state.
- Established destination directories such as `.agents/handoffs/` and `.codex/`
  may remain empty so future content has a predictable location. Do not add
  placeholder files or speculative structure solely to make an empty directory
  trackable by Git.
- Remove obsolete scratch files and temporary diagnostic artifacts created
  during the task before finishing. Remove an empty directory only when it has
  no established or anticipated role.
- Before removing an artifact, confirm whether it is tracked, ignored, generated,
  private source material, or still referenced. Do not delete user source files,
  dependency installations, build outputs, or caches merely for cosmetic cleanup.
- Report any temporary artifact that must remain and the reason it was retained.
