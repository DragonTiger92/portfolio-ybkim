# ADR-0001: Use Static Vite And Vanilla TypeScript

## Status

Superseded by
[ADR-0009](0009-adopt-astro-static-component-architecture.md). Hosting-provider
details were separately superseded by
[ADR-0007](0007-use-cloudflare-pages-delivery.md).

## Context

This portfolio is intended to show disciplined web development in a small static
project. The project contract already uses Vite, Vanilla TypeScript, HTML, pure
CSS, pnpm, and Git. GitHub Pages was the original hosting assumption.

## Decision

Keep the portfolio as a static Vite application using Vanilla TypeScript and
pure CSS.

## Consequences

- The project remains lightweight and suitable for static edge hosting.
- Frontend fundamentals stay visible in the implementation.
- React or another UI framework requires a future ADR and explicit user request.
