# ADR-0004: Keep Portfolio Claims Public-Safe

## Status

Accepted

## Context

Some supporting material for applications may be private, applicant-only, or
unsuitable for public repository docs. The public website and public docs must
not leak company-confidential or personal sensitive information.

## Decision

Do not place private or applicant-only case-study source material in `docs/`.
Keep private evidence notes in owner-controlled storage outside the public
repository when needed.

## Consequences

- Public docs focus on this portfolio project and other public-safe material.
- Internal endpoints, private paths, detailed workflows, and recommendation
  letter contents stay out of public files.
- Portfolio copy can be credible without exposing private assets.
