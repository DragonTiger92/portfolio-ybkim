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

## Consequences

- Reviewers can understand what code rights are granted.
- Personal portfolio material remains protected from reuse by default.
- GitHub may detect the repository as MIT licensed, so `NOTICE.md` and README
  must stay clear about the narrower license scope.
- The SBOM records the repository-level mixed licensing intent with a custom
  `LicenseRef`.
