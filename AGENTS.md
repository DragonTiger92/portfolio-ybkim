# AGENTS.md

## Project Contract

This repository contains `portfolio-ybkim`, a personal portfolio website built with Vite, Vanilla TypeScript, HTML, pure CSS, pnpm, Git, and GitHub.

Do not introduce React or another UI framework unless the user explicitly requests it.

## Required Reading

Before changing files, inspect the current code and read the guideline files relevant to the task:

- `.agents/guidelines/project.md`
- `.agents/guidelines/engineering.md`
- `.agents/guidelines/tooling.md`
- `.agents/guidelines/supply-chain-security.md`
- `.agents/guidelines/ui.md`
- `.agents/guidelines/git-quality.md`
- `.agents/guidelines/operations.md`
- `.agents/guidelines/reporting.md`

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
