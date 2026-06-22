# ADR-0008: Use Docs-Based Work Tracking

## Status

Accepted

## Context

The repository introduced GitHub Issues as execution tickets mirrored from
`product-backlog.md`, and GitHub Milestones as mirrors of roadmap phases. This
created multiple writable copies of the same work status and required API-based
synchronization.

The project has one maintainer, does not accept external feature requests or
pull requests, and already maintains recruiter-readable planning documents in
Git. Issue assignment, notifications, boards, and public discussion therefore
provide limited value compared with their synchronization and operating cost.

## Decision

Use version-controlled planning documents as the only work-tracking source of
truth:

- `roadmap.md` owns Phase outcomes and status.
- `product-backlog.md` owns PBI priority, acceptance criteria, and status.
- the requirements traceability matrix owns requirement-to-PBI relationships.
- GitHub Pull Requests provide review, CI evidence, labels, and integration
  history without owning backlog state.

Do not use GitHub Issues or GitHub Milestones for project planning. Disable the
repository Issues feature after preserving and closing the existing bootstrap
records. Remove Issue forms and Milestone synchronization automation.

Name human-created branches
`<type>/<ph-NNN|pbi-NNN>-<short-kebab-description>`. Phase integration branches
use a Phase ID; narrowly scoped branches use a PBI ID. Pull requests must
reference the branch tracking ID, select exactly one Phase, and list every
included PBI.

Update planning status in the same version-controlled branch as the work. A
draft pull request may be opened early for CI visibility, but it does not become
a second status source.

## Consequences

- Planning changes are reviewable through Git diff and commit history.
- No network request or synchronization workflow is required to inspect or
  update work state.
- GitHub Pull Requests, Actions, labels, releases, Dependabot, CodeQL, and
  private vulnerability reporting remain available.
- The project gives up issue boards, assignees, issue notifications, and closing
  keywords, which have little value under the current single-maintainer policy.
- Markdown tables are less interactive than an issue tracker, so lightweight
  validation and consistent status vocabulary remain important.
