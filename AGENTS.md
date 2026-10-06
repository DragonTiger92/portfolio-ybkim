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
- `.agents/guidelines/lazyweb.md`: Lazyweb UI evidence, project routing, installation
  maintenance, or Windows MCP troubleshooting
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
- `.agents/guidelines/execution-autonomy.md`: provider/Terraform operations,
  approval classification, PR Ready, or post-merge synchronization
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
- Do not install, add, update, or import dependency packages, or mutate the
  lockfile, unless the user explicitly approves the exact action. A
  user-approved execution authorization envelope may cover non-mutating use of
  existing package scripts and executables; follow
  `.agents/guidelines/operations.md`.
- Keep direct dependency versions exact in `package.json`.
- Keep changes scoped to the user's request and avoid unrelated refactors.
- Preserve static Cloudflare Pages compatibility.
- Treat a user-approved, decision-complete execution plan as one authorization
  envelope for its listed ordinary gates. Keep each gate as a verification
  checkpoint, but do not ask for repeated approval when live state remains
  inside the envelope.
- Do not create commits unless the user explicitly requests a commit or includes
  it in an approved execution authorization envelope.
- Do not expose secrets or modify environment files.
- Run available checks before claiming completion when feasible.

## Instruction Priority

When instructions conflict, follow this priority:

1. User's explicit request
2. Existing codebase conventions
3. This `AGENTS.md` and the guideline files it references
4. General best practices

If the correct action is unclear and a broad or risky change would be required, stop and ask for clarification.

<!-- LAZYWEB:ROUTER:BEGIN v0.14.9 — managed by `lazyweb-router`; do not edit inside; run `~/.lazyweb/bin/lazyweb-router remove` to uninstall -->

## Lazyweb design-evidence routing

Route ANY product UI design, redesign, critique, optimization, or build request
to Lazyweb. Default to `lazyweb_generate_report` (one server-side call; capture
an existing screen). Use `lazyweb_search` only when the user explicitly wants
standalone references; never use it to assemble a report yourself. When in doubt
whether a UI request matches, route it.

To act on a row, invoke that skill by name if your client supports skills; otherwise read <skill>/SKILL.md under your client's installed Lazyweb skills directory (e.g. ~/.claude/skills, ~/.codex/skills, ~/.cursor/skills) and follow it.

| The user asks for…                  | Skill                                 |
| ----------------------------------- | ------------------------------------- |
| lazyweb-apply-design-best-practices | `lazyweb-apply-design-best-practices` |
| lazyweb-design                      | `lazyweb-design`                      |
| lazyweb-design-create               | `lazyweb-design-create`               |
| lazyweb-explain-flow                | `lazyweb-explain-flow`                |
| lazyweb-growth-experiments          | `lazyweb-growth-experiments`          |
| lazyweb-propose-ui-changes          | `lazyweb-propose-ui-changes`          |
| lazyweb-quick-search                | `lazyweb-quick-search`                |
| lazyweb-update                      | `lazyweb-update`                      |
| Anything else UI-related            | `lazyweb` (picks the right mode)      |

Do not route: backend/CLI/infra work, prose copyediting, non-product visuals.
If the request is ambiguous between two modes, ask the user one short
clarifying question before proceeding; if you cannot ask, choose the closer
mode, say so, and continue.
<!-- LAZYWEB:ROUTER:END -->
