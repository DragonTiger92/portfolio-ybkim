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

## Execution Authorization Envelopes

A user may approve a decision-complete execution plan once instead of approving
each ordinary gate separately. Treat that plan as an execution authorization
envelope only when it identifies the concern and scope, target branch or
worktree, intended checks, allowed Git and publication steps, and explicit stop
conditions.

Within an approved envelope, proceed without repeated user approval for listed
ordinary actions whose live preconditions still match:

- inspect repository, worktree, remote, pull request, and current check state;
- edit and format only the approved source or documentation scope;
- run existing non-mutating package scripts, project executables, focused
  checks, and Git hooks;
- stage the focused patch and create an explicitly included commit;
- fetch the named integration branch, synchronize a clean topic branch without
  history rewriting, and verify the resulting ancestry;
- push only the named topic branch, create or update its draft pull request and
  metadata, observe current checks, and mark it ready when the plan's conditions
  are satisfied.

The gates remain verification checkpoints. Before crossing one, confirm its
preconditions and record the actual result. Stop before further mutation when
the branch, worktree, commit, changed-file set, remote or pull-request state,
check result, conflict state, or requested scope materially differs from the
approved envelope.

The following actions always remain separate explicit approval boundaries:

- merging or enabling auto-merge into an integration branch;
- installing, adding, updating, importing, or removing dependencies, or
  changing a lockfile;
- credentials, environment files, provider or Terraform state, account changes,
  and provider-side resource mutation;
- deployments, releases, tags, or other production publication;
- destructive cleanup, branch deletion, history rewriting, force-push, or
  discarding work; and
- any new source change needed after a failed gate when that change is outside
  the approved scope or would alter an agreed decision.

The user may narrow the envelope or require additional approval boundaries at
any time. A repository authorization envelope does not replace a Codex, OS, or
sandbox permission prompt; satisfy those technical controls without broadening
the approved project action.

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

## Third-Party And Generated Material

Do not add or publish creative material unless its source, permission, and reuse
terms are clear. This applies to open-source material, copied or adapted
snippets, text, images, icons, fonts, media, generated assets, and assets derived
from another person's work.

- Treat open-source or freely available material as licensed material, not
  public-domain material.
- Preserve source URLs, authors or suppliers, license terms, modification notes,
  and attribution obligations before use.
- Follow the license, provider terms, applicable law, and ordinary ethical reuse
  expectations. If permission is missing or the terms prohibit the intended use,
  do not use the material.
- Do not assume AI-generated or tool-generated assets are clean when their prompt,
  input, model, provider terms, or source material creates reuse obligations.
- Record third-party material and generated-asset decisions in the public
  license-compliance process when the material is intended to ship.

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

## Task Resource Lifecycle

Treat processes and interactive resources opened for a task as temporary unless
the user needs them after the task.

- Track resources the agent starts, opens, or claims, including development
  servers, background helpers, browser tabs, report previews, listeners, and
  temporary upload or test sessions.
- Before the final report or commit handoff, inspect task-relevant resources and
  close or stop agent-created resources that no longer serve an active purpose.
- Preserve a browser tab only when it is a user-facing deliverable or an explicit
  handoff. Close intermediate research, duplicate, report-preview, blank, and
  error tabs after their useful result has been captured.
- Stop an agent-started local server or background helper when validation is
  complete unless same-session continuation still depends on it.
- Do not terminate user-started or ambiguously owned processes merely because
  they use a familiar executable or development port. Resolve the exact process,
  command, port, and task ownership first; ask before stopping it when ownership
  or continued use is uncertain.
- Avoid broad process-name termination. Target only the exact resource created
  for the task, and report any retained resource with the reason it remains.
