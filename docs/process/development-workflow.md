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
8. Delete the merged topic branch.

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
- `wip/*` is reserved for temporary work that is not ready to become a pull
  request. It is not a merge-target naming convention.
- Emergency or recovery branches may deviate only when the reason is recorded
  in the pull request.

The current workflow-baseline branch follows this policy as
`feature/ph-001-product-foundation-baseline`.
