# ADR-0002: Separate Public Docs And Agent Guidelines

## Status

Accepted

## Context

The repository must be readable by humans and LLM agents. However, public project
documentation and agent operating instructions serve different purposes.

## Decision

Use `docs/` for public project documentation. Use `.agents/` for agent-only
guidelines, harness rules, operational notes, and handoffs.

## Consequences

- Recruiters and reviewers can read `docs/` without seeing internal work rules.
- Agents still have a dedicated place for behavior and workflow constraints.
- Documents that look like general project artifacts stay in `docs/`; documents
  that instruct agents how to work stay in `.agents/`.
