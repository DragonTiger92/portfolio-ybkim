# AGENTS.md

## Project Contract

This repository contains `portfolio-ybkim`, a statically generated personal portfolio website built with Astro, TypeScript, semantic HTML, pure CSS, pnpm, Git, and GitHub.

Do not introduce React or another UI framework unless the user explicitly requests it.

## Required Reading

Before changing files, inspect the current code and read only the guideline files
that match the task. Do not load every guideline by default.

- `.agents/guidelines/project.md`: repository structure, documentation boundaries,
  deployment, build, or routing behavior
- `.agents/guidelines/engineering.md`: source code, configuration, or scripts
- `.agents/guidelines/tooling.md`: external tools, command execution, or output handling
- `.agents/guidelines/execution-integrity-and-budgets.md`: machine payloads,
  truncation, command timeouts, static budgets, or file-line headroom
- `.agents/guidelines/supply-chain-security.md`: dependencies, lockfiles, audits, or
  package-manager policy
- `.agents/guidelines/ui.md`: HTML, CSS, DOM rendering, responsiveness, or accessibility
- `.agents/guidelines/discoverability.md`: SEO, AEO, GEO, metadata, canonical URLs,
  robots, sitemap, structured data, or social previews
- `DESIGN.md`: visual design intent, token vocabulary, coherence, or UI pattern
  decisions
- `.agents/guidelines/git-quality.md`: Git, branches, commits, hooks, CI, or completion
  checks
- `.agents/guidelines/session-handoff.md`: session-close, end-of-day wrap-up,
  handoff, heatup prompt, restart, or short workflow-like continuation requests
- `.agents/guidelines/scribble-intake.md`: Markdown-style user notes, Notepad
  review scribbles, requirement extraction, review feedback intake, or
  note-driven planning/execution requests
- `.agents/guidelines/document-lifecycle.md`: document cleanup, end-of-life
  review, or handoff retirement
- `.agents/guidelines/operations.md`: any file edit or environment-sensitive operation
- `.agents/guidelines/reporting.md`: final work report

For active continuation notes, check `.agents/handoffs/` when the user asks to resume prior work.

## Always Follow

- Use `pnpm` only. On Windows PowerShell, prefer `pnpm.cmd`.
- Do not install, add, update, import, or execute dependency packages unless the user explicitly approves the exact action.
- Keep direct dependency versions exact in `package.json`.
- Keep changes scoped to the user's request and avoid unrelated refactors.
- Preserve static Cloudflare Pages compatibility.
- Do not create commits unless the user explicitly requests a commit.
- Do not expose secrets or modify environment files.
- Run available checks before claiming completion when feasible.

## Instruction Priority

When instructions conflict, follow this priority:

1. User's explicit request
2. Existing codebase conventions
3. This `AGENTS.md` and the guideline files it references
4. General best practices

If the correct action is unclear and a broad or risky change would be required, stop and ask for clarification.
