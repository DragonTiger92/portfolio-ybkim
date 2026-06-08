# Project Guidelines

## Overview

This repository contains `portfolio-ybkim`, a personal portfolio website.

The project currently uses:

- Vite
- Vanilla TypeScript
- HTML
- Pure CSS
- TypeScript
- pnpm
- Git
- GitHub

Do not introduce React or another UI framework unless explicitly requested.

The portfolio should prioritize maintainability, readability, accessibility, responsive layout, and clear presentation of the developer's work.

## Deployment Awareness

This project is expected to be deployed as a static frontend site through GitHub Pages project-site hosting at a URL like `https://username.github.io/portfolio-ybkim/`.

Do not assume a custom domain or a GitHub Pages user/organization root site unless explicitly requested.

When changing build or routing behavior:

- Check Vite configuration.
- Keep Vite `base` aligned with the GitHub Pages repository path.
- Do not assume server-side runtime support.
- Avoid features that require a backend unless explicitly planned.
- Keep static deployment compatibility in mind.

## Out of Scope Unless Requested

Do not perform the following unless explicitly requested:

- Large-scale refactoring
- Full design system redesign
- Dependency migration
- Package manager migration
- Framework migration
- Deployment workflow changes
- GitHub Actions setup
- Husky/lint-staged setup
- ESLint rule changes
- Prettier setup changes
- Branch protection changes
- Commit creation
- Remote repository changes
