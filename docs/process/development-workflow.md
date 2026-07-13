# Development Workflow

This project uses GitHub Flow with docs-tracked topic branches. The workflow is
kept explicit so a single maintainer, reviewers, and automation can trace each
change from planning through integration without duplicating work state in
GitHub Issues.

## Standard Flow

1. Select the roadmap Phase or Product Backlog Item that owns the work.
2. Mark active work `In Progress` in the relevant planning document.
3. Update local `main` from `origin/main`.
4. Create a topic branch from the latest `main`.
5. Open a draft pull request early when CI or review visibility is useful.
6. Implement, verify, and update the tracked PBI and Phase status.
7. Merge only after acceptance criteria, required checks, and review are complete.
8. Delete the merged remote topic branch and remove its local branch after
   confirming that the branch tip is contained in `main`.

## Branch Scope

Choose branch scope by integration and review value, not by conversation or
session boundaries. A branch may continue across multiple Codex or maintainer
sessions, and one session may finish one branch before starting another.

- Use a PBI branch when the change is independently reviewable, has a distinct
  risk or rollback boundary, or can reach `main` without waiting for the rest of
  a Phase.
- Use a Phase branch when several related PBIs need one shared baseline and
  splitting them into separate pull requests would add coordination without
  materially improving review, verification, or rollback safety.
- A Phase branch may include multiple related concerns. Keep commits focused and
  list every included PBI in the pull request so the combined scope remains
  reviewable.
- Split work out of a Phase branch when it introduces an unrelated product or
  governance decision, a materially different risk profile, an independent
  release path, or a change that reviewers should be able to accept or revert
  separately.

There is no fixed branch lifetime, commit-count, or PBI-count limit. Prefer the
smallest number of branches that still preserves useful review, verification,
and rollback boundaries for this personal project.

## Branch Name Format

Use this format for human-created branches intended for pull requests:

```text
<type>/<ph-NNN|pbi-NNN>-<short-kebab-description>
```

Rules:

- Use one of the approved lowercase type prefixes.
- Use lowercase `ph-NNN` for a phase integration branch.
- Use lowercase `pbi-NNN` for a branch scoped to one Product Backlog Item.
- Use a short ASCII kebab-case description.
- A phase branch may integrate multiple PBIs; list every included PBI in the
  pull request.
- Create the branch from the latest `main` unless a documented recovery or
  stacked-work exception applies.

Examples:

```text
feature/ph-002-static-portfolio
fix/pbi-024-mobile-navigation-overflow
docs/pbi-033-release-runbook
infra/ph-003-cloudflare-delivery
```

## Approved Type Prefixes

| Prefix     | Use                                                        |
| ---------- | ---------------------------------------------------------- |
| `feature`  | User-visible capability or meaningful product enhancement  |
| `fix`      | Defect correction                                          |
| `content`  | Portfolio copy or public content change                    |
| `docs`     | Documentation-only change                                  |
| `ci`       | CI, quality gate, hook, or workflow automation             |
| `infra`    | Hosting, IaC, repository settings, or operational platform |
| `security` | Security or license-compliance remediation                 |
| `refactor` | Internal restructuring without intended behavior change    |
| `chore`    | Maintenance that does not fit a more specific prefix       |

Choose the most specific prefix that describes the primary reason for the
branch. The prefix does not replace pull request labels or release-impact
metadata.

## Exceptions

- Dependabot and other explicitly approved automation may use their generated
  branch names.
- Each open automation pull request normally retains its generated remote branch
  until that pull request is merged or closed. Review these pull requests
  individually; neither the branch count nor a failed check alone makes them
  stale.
- A merged or closed automation pull request ends the generated branch's normal
  lifecycle. Confirm the branch is removed when it no longer supports an open
  update; the Terraform-managed repository setting deletes merged branches
  automatically after PH-001 activation.
- `wip/*` is reserved for temporary work that is not ready to become a pull
  request. It is not a merge-target naming convention.
- Stacked branches are exceptional and require an actual dependency on unmerged
  work. Base the child pull request on its parent, record the parent pull request
  and merge order in `Notes`, merge from the bottom of the stack upward, and
  retarget or update the child after its parent reaches `main`.
- Emergency or recovery branches may deviate only when the reason is recorded
  in the pull request.
