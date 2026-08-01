# ADR-0007: Use Cloudflare Pages Delivery

## Status

Accepted

## Context

The portfolio is a statically generated Astro product with one maintainer. It needs automatic
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
- Same-repository, non-draft pull requests from `feature/`, `fix/`, and
  `content/` branches automatically use Cloudflare Pages preview deployments
  after required checks pass. Other reviewed branches can request the same path
  manually. Every remote preview remains protected by Cloudflare Access and
  serves the staging purpose without representing a separately managed staging
  machine.
- A manual formal-release workflow reuses the production deployment
  implementation, then creates the production tag and GitHub Release only after
  the deployed product passes smoke checks.
- Terraform manages long-lived Cloudflare configuration. Exact resource scope,
  Access identity policy, and the remote-state backend are selected during
  PH-003 implementation.
- Use the Cloudflare-managed Pages subdomain returned for the project as the
  canonical production host. A purchased custom domain, Cloudflare DNS zone,
  and Email Routing are not part of the portfolio baseline.
- Keep the existing portfolio Gmail address as the public contact channel.
- GitHub Pages compatibility is not maintained as a product requirement.

The deployment and release workflows should share reusable jobs or workflows so
automatic and manual entry points cannot drift into different build, deploy, or
verification behavior.

## Consequences

- Preview authentication and production delivery use one static edge platform.
- Branch names provide a deterministic, reviewable preview trigger without
  granting deployment credentials to drafts, forks, automation, or `wip/*`.
- No application server, database, or dedicated staging machine is required.
- Every `main` push can update production, but only intentional formal releases
  receive SemVer tags and GitHub Releases.
- Release orchestration is fail-fast and retryable, but it is not a literal
  transaction spanning GitHub and Cloudflare.
- Cloudflare account configuration and deployment credentials become PH-003
  operational dependencies.
- The public hostname may include a provider-assigned suffix if the preferred
  Pages project subdomain is unavailable, so live outputs rather than a guessed
  hostname determine canonical metadata and monitoring configuration.
