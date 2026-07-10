# Session Handoff Guidelines

Use this guide when the user asks for a session-close workflow, end-of-day
wrap-up, heatup prompt, restart guide, resume guide, or a short workflow-like
request such as:

- `EOD 정리해줘`
- `오늘 작업 마감해줘`
- `resume heatup 만들어줘`
- `handoff 남겨줘`
- `내일 이어받기 좋게 정리해줘`

## Terminology

Use `EOD` in its conventional sense: `End Of Day`. It is a time-oriented phrase
for the end of a working day, not a repository-specific workflow name.

Use `session-close workflow` for the broader stop-point routine that can happen
at the end of a day, before a long pause, before a fresh session, or before a
handoff.

When the user writes something like `EOD 정리해줘`, infer the requested work from
the whole phrase and surrounding context. The word `정리` or the current
conversation may request the session-close workflow; the acronym `EOD` itself
does not carry that workflow definition.

The session-close workflow is the regulated stopping-point routine:

- inspect the current Git and artifact state;
- separate tracked public work from ignored private/context artifacts;
- run the smallest relevant checks;
- review commit-ready concern groups;
- review document cleanup and handoff end-of-life candidates;
- create or update a handoff and heatup prompt when continuation context is
  still needed;
- report next actions and known caveats.

Do not treat `EOD` by itself as permission to commit, delete, publish, or expose
private context. Those actions still require an explicit user request or an
existing repo rule that clearly permits them.

In repository documents, prefer:

- `end-of-day` or `EOD` only for the literal working-day timing;
- `session-close workflow` for the regulated stopping-point routine;
- `resume timing`, `handoff time`, `stop point`, or an absolute date/time when
  the text needs calendar precision.

## Default Session-Close Workflow

When a session-close request appears, or when an end-of-day request clearly asks
for work wrap-up:

1. Confirm the active branch, latest commit, and `git status --short`.
2. Summarize the active concern and separate tracked public changes from
   ignored private/context artifacts.
3. Determine whether the next continuation is likely to happen in the same
   session, a fresh session, or an unknown session context.
4. Determine whether the resume time is exact, approximate, unknown, or far
   enough away that context loss is likely.
5. Review commit-ready concern groups and end-of-life document cleanup
   candidates.
6. Run the smallest relevant checks that are safe and already available.
7. Create or update a focused `.agents/handoffs/YYYY-MM-DD-<topic>-handoff.md`
   file when unresolved work is expected to resume in a later session.
8. Include copy-ready heatup prompt variants in the final response when more
   than one continuation mode is plausible.
9. Do not create a commit unless the user explicitly asks for one.

## Continuation Context

Classify the expected continuation mode:

| Mode          | Use When                                                                                                    | Handoff Behavior                                                                                                |
| ------------- | ----------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Same session  | The user explicitly says they will resume this thread/session                                               | Write a compact reheating prompt that assumes conversational carryover may remain, but still names source files |
| Fresh session | The user says they will start a new session, or the current work is committed and the next task is separate | Write a self-contained start prompt with repo, branch, latest commit, clean/dirty state, and source material    |
| Unknown       | The user is unsure, timing is long, or session retention is uncertain                                       | Provide both same-session and fresh-session heatup prompts                                                      |

If the user gives a relative continuation time, convert it to an absolute date
and local time in the handoff and final response.

## Resume Timing

The time between the stop point and continuation can vary. Treat it as an input
to the handoff depth:

| Timing                     | Recommended Depth                                                                     |
| -------------------------- | ------------------------------------------------------------------------------------- |
| Same day or next few hours | Short status, changed files, next command                                             |
| Next day                   | Normal handoff with decisions, checks, and next task list                             |
| Multiple days or unknown   | Fuller handoff with file map, tool caveats, owner questions, and both heatup variants |

If timing or continuation mode is missing and knowing it would improve the
handoff, ask a concise interactive question before finalizing when the user is
still present. If the user is leaving or asks to proceed quickly, assume
`Unknown` and include both prompt variants.

## Handoff File Shape

Keep handoffs short enough to read at session start. Include:

- repo, branch, latest commit, and working tree status;
- the exact user intent and next scheduled resume time when provided;
- changed tracked files;
- important ignored private files or generated artifacts;
- checks run and known tool caveats;
- current decisions;
- next actions and owner questions;
- copy-ready heatup prompt.

## Public And Private Boundaries

- Keep `.agents/handoffs/` agent-only and gitignored.
- Do not copy `.contexts/` contents into public docs or final reports.
- In final user reports, mention private file paths only when the user needs to
  open them locally.
- Never include private contact details, recommendation-letter contents, private
  repository paths, endpoints, credentials, or internal implementation detail in
  public docs or commit messages.

## Commit Candidate Handling

During session-close and handoff work, identify commit-ready concern groups. A
concern is commit-ready when:

- it has a clear single purpose and can be reviewed as one unit;
- it does not depend on unresolved owner feedback to be coherent;
- it excludes private ignored artifacts, generated previews, and temporary
  source material that should stay local;
- public docs, guidelines, and references are internally consistent;
- the smallest relevant checks pass or the remaining risk is explicitly
  reported.

Examples of commit-ready concerns:

- a completed content-source or planning boundary update;
- a reusable agent guideline or harness update;
- a docs cleanup where obsolete files and references were handled together;
- a same-interest follow-up that belongs in the previous commit by amend or
  fixup.

If the user asks whether anything is commit-ready:

- Identify completed concern groups.
- Prefer one commit per completed concern.
- If private ignored artifacts are part of the work, mention that they remain
  outside git and should not be staged.
- If the user asks to commit, follow `.agents/guidelines/git-quality.md`.
- If the user does not ask to commit, report the candidate commit groups and
  stop before staging.

## Document Cleanup Handling

During session-close and handoff work, check whether any handoff, scratch note,
or temporary document has reached end of life. Use
`.agents/guidelines/document-lifecycle.md` for the cleanup test and procedure.

For handoffs, the usual retirement point is after their target task has resumed,
their durable decisions have moved into the right source of truth, and the
handoff is no longer needed to reconstruct active work.

## Heatup Prompt Requirements

The heatup prompt should be directly pasteable. Generate the variant that fits
the continuation mode.

Every variant should name:

- repo path;
- branch;
- latest known commit;
- handoff file path;
- first files to read;
- first command to run;
- exact next objective.

For same-session resume prompts:

- mention that the thread is being resumed;
- still instruct the agent to read the handoff first, because context may have
  compacted;
- keep the prompt shorter and point to the newest owner feedback.

For fresh-session prompts:

- make the prompt self-contained;
- include clean/dirty working-tree expectations;
- include the exact source files to read before acting;
- include private context paths only when the user needs that local material for
  the task.

Use absolute dates when the user references relative dates.
