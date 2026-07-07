# Document Lifecycle Guidelines

Use this guide when the user asks for documentation cleanup, stale document
review, end-of-life judgment, handoff retirement, or a short workflow-like
request such as:

- `docs cleanup 확인해줘`
- `obsolete 문서 정리해줘`
- `handoff 정리해줘`
- `끝난 handoff 제거해도 되는지 봐줘`

## Cleanup Triggers

Run a document lifecycle review at these points:

- before a session-close, end-of-day wrap-up, or handoff response when
  unresolved context, handoffs, or temporary notes were created during the
  session;
- after a PBI, phase, disclosure review, or planning task reaches a durable
  source-of-truth state;
- before committing documentation work that may have left scratch guidance,
  superseded handoffs, or duplicate planning notes behind;
- when a newer handoff, guideline, ADR, planning document, or public content
  source replaces an older continuation artifact;
- when a document's stated purpose, reader, or next action no longer exists.

## Classification

Before deleting, moving, or rewriting a document, classify it:

| Class                   | Default Handling                                                            |
| ----------------------- | --------------------------------------------------------------------------- |
| Public source of truth  | Keep and update unless explicitly replaced by a reviewed public document    |
| ADR or decision record  | Keep for history; append supersession context rather than deleting          |
| Planning/backlog source | Keep while referenced by active PBIs, requirements, phases, or roadmap work |
| Agent guideline         | Keep if it encodes reusable behavior; merge or remove if it duplicates      |
| Handoff                 | Keep only while unresolved continuation context remains useful              |
| Private context         | Keep under `.contexts/` unless the user requests exact cleanup              |
| Generated/scratch file  | Remove after the needed result is captured elsewhere                        |

## End-Of-Life Test

A document is an end-of-life cleanup candidate only when all of these are true:

- its original purpose is complete, cancelled, or superseded;
- durable decisions have been migrated to the right public doc, guideline, ADR,
  planning source, or private context file;
- no active PBI, requirement, owner question, resume task, disclosure review, or
  implementation step still depends on it;
- references to the document can be removed or updated without breaking the
  current navigation model;
- deleting or rewriting it will not erase useful history, user source material,
  legal/security context, or private evidence.

If any condition is uncertain, keep the document and report the uncertainty
instead of deleting it.

## Handoff Retirement

Treat `.agents/handoffs/` files as temporary continuation context. A handoff has
done its job when:

- the target session resumed and read it, or a newer handoff superseded it;
- the next actions are completed, cancelled, or transferred into backlog/docs;
- durable decisions and tool caveats were migrated to a reusable guideline,
  public planning document, or private context note where appropriate;
- the current working tree, latest commit, and active backlog state no longer
  require the handoff to reconstruct the task.

Do not retire a handoff merely because it is old. Retire it because its purpose
has ended and its useful content has a better home or no longer matters.

## Cleanup Procedure

1. Check `git status --short` and whether the target file is tracked, ignored,
   generated, or private source material.
2. Search references with `rg` before removing or renaming the document.
3. Migrate durable decisions to the right source of truth before deleting the
   temporary artifact.
4. Remove or update references in navigation docs, guidelines, and handoff
   prompts.
5. Run the smallest relevant check, usually `pnpm.cmd check:docs` for
   documentation-only cleanup.
6. Report what was removed, what was retained, and why.

## Commit Boundary

Commit cleanup only when it forms a complete concern:

- the obsolete document or references were removed;
- surviving decisions were migrated;
- docs navigation and references are consistent;
- relevant checks pass.

Keep cleanup separate from unrelated feature or content changes unless the
cleanup is a direct same-concern follow-up to those changes.
