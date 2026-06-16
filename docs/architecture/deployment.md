# Deployment Architecture

The intended deployment target is GitHub Pages project-site hosting.

## Build Flow

```text
pnpm.cmd build
  -> tsc
  -> vite build
  -> dist/
```

The generated `dist/` directory is the deployable artifact.

## Hosting Assumptions

- The repository path is `portfolio-ybkim`.
- Vite `base` should remain `/portfolio-ybkim/` unless the hosting model changes.
- No server-side runtime, database, or API is available from GitHub Pages.
- Content should be bundled at build time or embedded as static source.

## Release Checks

- Run `pnpm.cmd check` before treating a release candidate as ready.
- Verify built asset paths under the project-site base path.
- Review public copy for private information before publishing.
