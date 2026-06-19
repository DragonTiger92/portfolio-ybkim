# Development Workflow

This project uses GitHub Flow with issue-linked topic branches. The workflow is
kept explicit so a single maintainer, reviewers, and automation can trace each
change from planning through integration.

## Standard Flow

1. Create or identify the GitHub issue that owns the work.
2. Update local `main` from `origin/main`.
3. Create a short-lived topic branch from the latest `main`.
4. Implement and verify the scoped work.
5. Open a pull request that uses a closing keyword such as `Closes #123`.
6. Merge only after required checks and review are complete.
7. Delete the merged topic branch.

## Branch Name Format

Use this format for human-created branches intended for pull requests:

```text
<type>/<issue-number>-<short-kebab-description>
```

Rules:

- Use one of the approved lowercase type prefixes.
- Use the GitHub issue number without `#` or leading zeroes.
- Use a short ASCII kebab-case description.
- Name a phase-sized integration branch after its primary tracking issue. The
  pull request may still close multiple related PBI issues.
- Create the branch from the latest `main` unless a documented recovery or
  stacked-work exception applies.

Examples:

```text
feature/42-project-showcase
fix/57-mobile-navigation-overflow
docs/61-release-runbook
infra/73-cloudflare-pages-baseline
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
  in the issue or pull request.

The current workflow-baseline branch follows this policy as
`feature/1-project-workflow-baseline`.
