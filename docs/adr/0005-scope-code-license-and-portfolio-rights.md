# ADR-0005: Scope Code License And Portfolio Rights

## Status

Accepted

## Context

The repository will be public so recruiters can inspect the portfolio source.
The project should allow ordinary code review, fork, and clone access, while
protecting portfolio content, documentation, personal descriptions, images, and
other non-code materials.

## Decision

Use the standard MIT License for source code and build/configuration files.
Use root `NOTICE.md` to state that portfolio content, documentation, personal
text, visual design content, images, and other non-code materials are All Rights
Reserved unless otherwise stated.

Do not accept external contributions, pull requests, issue-based suggestions, or
unsolicited project proposals.

Describe the repository precisely rather than calling every published file open
source:

- Public repository visibility allows inspection and GitHub-hosted access, but
  it does not itself grant copyright permissions.
- Publishing material without a license leaves ordinary copyright restrictions
  in place; it does not create an open-source license by implication.
- Open-source software grants rights to use, study, modify, and redistribute
  source under an open-source license. It does not require the maintainer to
  accept outside issues, pull requests, or governance participation.
- This project therefore contains MIT-licensed open-source code alongside
  non-open-source portfolio materials that are publicly viewable but All Rights
  Reserved.

The MIT License is preferred over leaving the code unlicensed because it gives
reviewers an unambiguous, familiar permission set for code inspection and reuse,
keeps the project easy to fork for technical evaluation, and includes warranty
and liability disclaimers. Its tradeoff is that permitted code reuse cannot be
restricted to portfolio-review purposes. The separate NOTICE boundary is
therefore required so those permissions are not mistakenly applied to personal
content and visual materials.

## Consequences

- Reviewers can understand what code rights are granted.
- Personal portfolio material remains protected from reuse by default.
- GitHub may detect the repository as MIT licensed, so `NOTICE.md` and README
  must stay clear about the narrower license scope.
- The SBOM records the repository-level mixed licensing intent with a custom
  `LicenseRef`.
- Repository visibility, code licensing, and contribution governance remain
  three independent decisions.

## References

- [GitHub Docs: Licensing a repository](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/licensing-a-repository)
- [Open Source Initiative: The Open Source Definition](https://opensource.org/osd)
