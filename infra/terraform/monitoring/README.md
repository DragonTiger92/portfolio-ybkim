# Legacy Production Monitoring Terraform

This root is a frozen Better Stack foundation retained only as migration input.
The owner deleted the Better Stack account and selected Checkly for `PBI-032`.
Do not use this configuration for live monitoring or supply credentials until
the provider, resources, variables, lockfile, and documentation are migrated to
the owner-approved Checkly contract.

`PBI-032` remains open until the Checkly monitors and a controlled DOWN/recovery
notification test are verified. The durable implementation contract is recorded
in [Production Readiness](../../../docs/operations/production-readiness.md).

## Future HCP Terraform Workspace

- organization: `dragontiger92`
- project: `portfolio-ybkim-infrastructure`
- workspace: `portfolio-ybkim-monitoring`
- execution mode: Remote
- Terraform version: `1.15.6`
- automatic apply: disabled

Do not configure this workspace with Better Stack credentials. The future
Checkly variables must follow the reviewed HCP Terraform contract after the
migration is version-controlled and its exact provider pin is separately
approved.

## Historical Monitor Contract

The frozen root currently declares two Better Stack HTTPS status monitors:

- the canonical homepage; and
- `/assets/brand/logo-mark.svg` as a stable critical asset.

This historical declaration is not the selected steady state and must not be
planned or applied. The Checkly migration replaces its interval, locations,
alert subscription, credential inputs, and provider resources.

## Migration Hold

Repository CI may continue credential-free formatting and static validation of
the frozen root until the migration lands. That validation is not approval for
live provider use. Outside the existing CI contract, do not initialize or update
the provider lockfile without the separately approved migration.

Do not run refresh, plan, apply, import, destroy, or any Better Stack API command.
Do not create, replace, or destroy Checkly resources until the migration diff,
inventory, exact provider version, and remote plan pass owner review.
