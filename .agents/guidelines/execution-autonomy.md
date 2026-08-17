# Execution Autonomy Guidelines

## Purpose

Use this guideline for provider, Terraform, account-backed infrastructure, Git
publication, pull-request readiness, and post-merge synchronization. The
machine-readable contract is `.agents/policies/execution-autonomy.json`; keep
this explanation and that contract aligned.

The goal is to reserve owner prompts for decisions. A verification checkpoint
is not an approval checkpoint when the operation is already inside an approved,
decision-complete execution envelope and every required condition is true.

## Classification

Before each operation:

1. Revalidate the current branch, head, target, provider, account, and pull
   request facts that can drift.
2. Confirm the operation is listed in `autonomousOperations` and that all global
   invariants and operation-specific preconditions are true.
3. Proceed without another owner prompt, recording only secret-safe evidence.
4. Verify every postcondition before continuing. Stop before mutation, or before
   the next operation, if a condition is false, unknown, or maps to an
   `ownerDecisionGates` entry.

The default disposition is `owner_decision`. Do not infer autonomy for an
unlisted operation merely because a neighboring operation is autonomous.

## Autonomous Provider Lifecycle

Inside an approved envelope, the following are ordinary verification gates:

- read-only provider inventory and Terraform state projection;
- an import that binds exactly one uniquely matched remote object to one
  declared, currently unbound Terraform address;
- a Terraform plan whose output is reduced to expected address/action counts;
- applying the exact validated plan artifact when its actions match the approved
  allowlist and contain no replace, destroy, cost, contract, or deployment
  surprise;
- a bounded, predeclared transient alert test through expected DOWN and recovery;
- removal when the plan destroys exactly that transient resource and touches no
  steady resource; and
- the required post-import, post-apply, and post-removal no-op plans.

Import is a state binding, not permission to alter the remote object. Never
associate one remote object with multiple Terraform addresses. Stop on duplicate
matches, ownership ambiguity, resource-type mismatch, an occupied address,
orphan state, or a provider/backend conflict.

An exact-plan apply is autonomous only when the intended resource outcome was
already approved in the task envelope. Generate and consume the plan in the
same controlled run, bind it to the current commit, configuration, workspace,
and protected-input presence, and never reveal the plan artifact or its raw
contents. Any changed input, head, plan, or remote state invalidates it.

For a controlled alert test, verify the path is same-origin and genuinely
nonexistent before creation. Keep the destination and owner-managed alert policy
unchanged. Record only event kind, KST timestamp, and success status. Stop on an
unexpected redirect, TLS behavior, notification target, availability impact,
timeout, or resource action.

## Secret-Safe Evidence

Inspect credential-bearing commands and wrappers before execution. Use protected
files, standard input, or scoped environment variables without printing values.
Validate redaction with synthetic canaries before a wrapper handles real input.

Allowed projections are limited to facts such as booleans, counts, Terraform
resource types and source addresses, expected action classes, current commit
identities, check conclusions, and bounded event timestamps. Do not emit raw
provider responses, state payloads, plan contents, remote object identifiers,
credentials, account values, email destinations, headers, cookies, connection
strings, or environment values.

## Owner Decision Gates

Stop and ask for an owner decision when the work would change the agreed scope,
provider or dependency selection, lockfile, credentials, backend/workspace,
account identity, billing, entitlement, contract, alert destination, or alert
policy. Also stop for duplicate inventory, ownership/state reconciliation,
unexpected plan actions, a steady-resource replace/destroy, or any unplanned
cost or production-deployment effect.

Merge and auto-merge always remain owner decisions because they can trigger
downstream integration or production procedures. History rewriting, force-push,
discarding work, branch deletion, and destructive cleanup also remain separate
owner decisions.

## Git And Pull-Request Lifecycle

Within the envelope, review the focused staged diff, commit, push only the named
topic branch, create or update the Draft PR, and observe checks for the current
head without repeated approval. Mark the PR Ready automatically when acceptance
evidence is complete, current-head required checks are terminal and successful,
no required change or unresolved review remains, and head/scope have not drifted.
Ready is a review-state transition, not merge authority.

After an owner-approved merge, verify the merged commit or squash/patch
equivalence and fast-forward a clean local `main` without another prompt. Do not
bundle branch deletion or other cleanup into synchronization.

When one open PR depends on a governance PR, merge the governance PR first.
Allow `Sync Open PR Branches` to merge the new `main` into eligible same-repo PR
branches, then verify the resulting head and current checks. Do not manually
bulk-update branches or rerun historical workflows.
