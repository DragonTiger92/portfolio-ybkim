# Execution Integrity And Budget Guidelines

## Purpose

Use this guideline when an agent prepares machine-consumed payloads, transfers
files or encoded data, sets command timeouts, or evaluates project size and
quality budgets.

The goal is to preserve exact inputs and leave enough operating headroom without
turning budgets into limits that silently grow whenever a check becomes
inconvenient.

## Machine Payload Integrity

Treat these values as atomic machine data:

- Base64 and other encoded binary payloads;
- hashes, signatures, checksums, and integrity fingerprints;
- signed or presigned URLs;
- tokens, credentials, cookies, and authorization headers;
- opaque IDs, cursors, upload keys, and idempotency keys; and
- serialized JSON, certificates, patches, archives, and generated manifests.

Never replace any part of an atomic value with `...`, `…`, a prose placeholder,
a shortened preview, or a copied display excerpt. Human-readable summaries may
be shortened; machine-consumed fields may not.

Before a tool call containing atomic data:

1. Identify whether the destination accepts a file, URL, upload key, stream, or
   encoded string.
2. Prefer the documented file or presigned-upload flow for nontrivial binary
   data. Do not place a full-resolution image in a model-authored Base64 field
   when an upload flow exists.
3. Obtain the value from the authoritative file or previous tool response. Do
   not retype it from a rendered or truncated display.
4. Validate the complete value locally where possible:
   - confirm source byte length and MIME type;
   - decode Base64 strictly and compare decoded length or hash;
   - parse JSON before transmission; and
   - preserve an opaque value byte-for-byte without normalization.
5. If the available interface would expose a secret or signed URL in agent logs,
   use an approved redacting wrapper or stop and choose a supported safe
   transfer method.
6. If completeness cannot be proven, do not call the destination with a
   placeholder. Report the blocked transfer instead.

After transmission, distinguish transport acceptance from downstream success.
Do not claim that a file was uploaded merely because an upload URL was created.

## Output Truncation

Tool-output truncation is a display constraint, not permission to reconstruct
missing content.

- Use targeted reads, hashes, counts, or ranges for human inspection.
- Use files, upload tools, or direct tool-to-tool references for complete
  machine data.
- Never copy a visibly truncated tool result into another command or API call.
- When output says it was truncated, reacquire the exact value through a
  non-display channel or stop.

## Command Time Budgets

Set an outer command timeout from the entire command graph, not only its final
stage. A timeout is an execution allowance, not a product quality budget.

Before running a composite command:

1. Inspect its package script or command chain.
2. Account for builds, validators, browser startup, test workers, teardown, and
   slower Windows process cleanup.
3. Use recent measured duration when available, then add at least 50% headroom
   for a stable local check and more for first runs or cold caches.
4. For this repository, use at least 240 seconds for `pnpm.cmd check` unless a
   newer measured run supports another value. Use focused commands during the
   edit loop.
5. Do not describe an outer timeout as a test failure. Record the last completed
   stage, whether any failure appeared, and what remained unverified.
6. After an outer timeout, rerun the unfinished stage with an adequate timeout;
   do not automatically repeat already completed expensive stages.

Never shorten exact inputs or skip required checks merely to fit a token,
elapsed-time, or command-time allowance.

## Project Budget Policy

Keep performance and maintainability budgets as reviewable engineering
boundaries:

- Hard limits remain blocking gates.
- Reaching 80% of a hard limit starts a headroom review.
- Reaching 90% requires an explicit plan: reduce usage, split a cohesive
  responsibility, or prepare an evidence-backed rebaseline before adding
  substantial content.
- Crossing a limit must fail until the regression is removed or a reviewed
  rebaseline is documented and tested.

Evaluate each metric independently. Aggregate growth does not justify weakening
per-file, CSS, JavaScript, individual-asset, or PDF safeguards.

Raise a hard limit only when all of these are true:

1. The growth is legitimate product content or a deliberate architecture
   decision, not accidental duplication or generated noise.
2. The relevant artifact was inspected and optimized first.
3. The proposed limit includes sustainable headroom rather than matching the
   new measurement exactly.
4. Independent safeguards remain capable of catching concentrated regressions.
5. The public requirement or architecture source and its tests are updated in
   the same coherent change.

File-line limits are responsibility-review triggers, not targets. Prefer a
cohesive refactor when responsibilities are mixed. Keep a cohesive registry or
guideline intact when splitting would reduce readability; document a narrow
exception or evidence-backed category rebaseline instead of creating arbitrary
fragments.

## Current Repository Assessment

As reviewed on 2026-08-05, the `v1.0.0` discovery baseline uses:

- largest HTML: 31.43 / 40 KiB;
- aggregate HTML: 63.49 / 80 KiB;
- CSS: 30.44 / 32 KiB, explicit review band;
- JavaScript: 5.92 / 8 KiB;
- non-download output: 241.36 / 320 KiB;
- largest non-download file: 36.17 / 64 KiB; and
- PDF: 217.58 / 600 KiB.

The HTML and aggregate non-download rebaseline preserves complete launch
metadata and returns those metrics below the 80% review band. Do not increase
CSS without a separate measured disposition, and do not raise any limit
preemptively. Inspect affected artifacts early rather than discovering a
headroom issue only at the completion gate.

The current content-line limits also remain suitable for this small static
portfolio. Session handoffs use a dedicated 350-line ceiling because a
self-contained fresh-session contract intentionally combines current state,
safety boundaries, next gates, and a paste-ready prompt. This ceiling is not a
target: 280 lines starts a headroom review, and 315 lines requires an explicit
compression or replacement plan before substantial additions. When any file is
already near its category limit, budget a boundary review as part of the task
rather than forcing the requested work into the remaining lines or mechanically
splitting the file.
