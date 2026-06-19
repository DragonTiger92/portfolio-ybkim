# ADR-0007: Use Cloudflare Pages Delivery

## Status

Accepted

## Context

The portfolio is a static Vite product with one maintainer. It needs automatic
production delivery, occasional production-like remote QA, and access control
for non-public previews without provisioning a traditional staging server.

GitHub Pages was the original candidate, but it does not provide the desired
protected preview model without additional repositories or awkward access
control workarounds.

## Decision

Use Cloudflare Pages as the only supported production host. Deploy through
GitHub Actions and Wrangler Direct Upload rather than Cloudflare Git integration.

- Pushes to `main` automatically run the production deployment and smoke-check
  path.
- Manually requested protected previews use Cloudflare Pages preview deployments
  and Cloudflare Access. They serve the staging purpose without representing a
  separately managed staging machine.
- A manual formal-release workflow reuses the production deployment
  implementation, then creates the production tag and GitHub Release only after
  the deployed product passes smoke checks.
- Terraform manages long-lived Cloudflare configuration. Exact resource scope,
  Access identity policy, custom-domain use, and the remote-state backend are
  selected during PH-003 implementation.
- GitHub Pages compatibility is not maintained as a product requirement.

The deployment and release workflows should share reusable jobs or workflows so
automatic and manual entry points cannot drift into different build, deploy, or
verification behavior.

## Consequences

- Preview authentication and production delivery use one static edge platform.
- No application server, database, or dedicated staging machine is required.
- Every `main` push can update production, but only intentional formal releases
  receive SemVer tags and GitHub Releases.
- Release orchestration is fail-fast and retryable, but it is not a literal
  transaction spanning GitHub and Cloudflare.
- Cloudflare account configuration and deployment credentials become PH-003
  operational dependencies.
