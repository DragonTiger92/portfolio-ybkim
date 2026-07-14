# Scribble Intake Guidelines

Use this guideline when the user pastes Markdown-style notes, native-editor
scribbles, review memos, or loosely structured context and asks the agent to
extract the intended work.

The goal is to turn informal notes into the smallest safe next action: answer,
brief a plan, implement the obvious scoped change, or ask for clarification only
when proceeding would risk changing the wrong thing.

## Trigger Phrases

Apply this workflow when the user says or implies:

- they wrote notes, scribbles, memo, or review feedback in Notepad or another
  editor;
- the pasted text is Markdown-style and should be interpreted for requirements;
- the agent should find the core content, 요구 사항, 문제 제기, or next work;
- the agent should continue the current task based on review comments.

## Structured Calendar Exports

Treat a pasted calendar export as structured intake when the user identifies the
following field order, even when the export has no field labels:

```txt
{body}
{planned time range}
{planned date}
{memo}
```

- Preserve the original text as intake evidence, but normalize the four fields
  before deciding what work to do.
- Preserve `body` and `memo` as separate input fields, but do not assume that
  they are semantically independent. Determine their relationship from the
  wording and relevant repository context before mapping work.
- Classify the memo relationship as one or more of:
  - `Independent`: a separate request, question, constraint, or suggestion;
  - `Elaboration`: rationale, examples, or clarification of the body;
  - `Subordinate`: a child requirement, acceptance condition, or execution
    constraint under the body;
  - `Mixed`: multiple memo passages have different relationships to the body.
- For a mixed memo, split it into meaningful units and preserve each unit's
  relationship instead of assigning one classification to the whole field.
- Inspect the repository surfaces named or implied by the export before deciding
  the relationship. Existing requirements, handoffs, code, and configuration
  can show whether the memo extends an active concern or introduces another one.
- Treat the time range and date as schedule metadata by default. They do not by
  themselves impose an execution time budget, authorize risky work, require the
  agent to wait until that time, or narrow the requested scope.
- Use the repository or user timezone when it is known. If the written weekday,
  date, or time range conflicts, report the mismatch and rely on neither value
  for a consequential action until it is resolved.
- Preserve inline Markdown and backticks in `body` and `memo` as meaningful
  notation. Do not mistake them for extra export fields.
- If `body` and `memo` conflict materially, or their relationship remains
  ambiguous after a scoped repository check and would change the work, ask for
  clarification. Otherwise, preserve both field origin and semantic hierarchy
  in the intake summary and resulting work.
- Do not copy the raw export into public project documentation unless the user
  explicitly requests publication. Route only durable requirements to the
  appropriate repository surface.

## Intake Procedure

1. Identify any declared input schema before interpreting free-form prose. For a
   structured calendar export, separate `body`, schedule metadata, and `memo`
   without presuming that `body` and `memo` are independent.
2. Preserve the user's heading and nested-list structure while reading. Nested
   bullets often encode subordinate conditions, examples, or constraints.
3. Classify each meaningful unit, rather than an entire field by default, as one
   of:
   - `Context`: background, rationale, or examples;
   - `Requirement`: a requested change or acceptance condition;
   - `Question`: something to answer directly;
   - `Constraint`: privacy, scope, naming, technology, timing, or process limit;
   - `Suggestion`: optional direction that needs agent judgment.
4. Determine relationships between units: independent, explanatory, subordinate,
   conflicting, or mixed. Use nearby wording and a scoped check of relevant
   repository sources; preserve parent-child relationships in the work model.
5. Map requirements to repository surfaces before editing:
   - public product truth -> `docs/`;
   - future-agent workflow -> `.agents/guidelines/`;
   - temporary continuation state -> `.agents/handoffs/`;
   - private evidence -> `.contexts/`, never public docs by default;
   - source implementation -> `src/` and related project files.
6. Decide whether to execute or brief first:
   - execute when the requested change is scoped, reversible, and clearly tied
     to existing files;
   - brief first when the note creates a new workflow, changes public taxonomy,
     moves phase boundaries, renames entities, or could affect several docs;
   - ask only when no safe assumption would preserve the user's likely intent.
7. When executing, keep the diff focused on the extracted requirements and avoid
   converting every contextual note into project text.
8. After executing, report the normalized fields and their relationships when
   structured input was used, interpreted requirements, changed files, checks,
   unresolved questions, and any suggestion that was intentionally deferred.

## Review-Feedback Handling

When the pasted note reviews agent-created output, treat it as correction input,
not as a request to defend the previous output.

- Identify inaccurate claims, over-claims, unclear hierarchy, bad naming, and
  missing publication boundaries.
- Fix the source of truth that generated the reviewed output when possible.
- If the reviewed output is a generated artifact, update its editable source or
  content source first, then regenerate only when the task calls for it.
- Preserve reviewer-approved sections unless they conflict with the new
  requirement.

## Briefing Template

Use this compact structure when a plan is needed before execution:

```txt
Interpreted:
- ...

Proposed changes:
- ...

Will not change:
- ...

Checks:
- ...
```

## User Command Shortcut

The user can invoke this workflow with a short instruction such as:

```txt
Scribble intake:
<paste Markdown-style notes here>
```

or:

```txt
Review scribble 반영해줘:
<paste notes here>
```

For a structured calendar export, the user can choose one of these modes:

```txt
Calendar scribble intake:
<paste raw calendar export here>
```

Use the default intake procedure: inspect relevant repository context, then
execute a scoped and reversible change or brief first according to the decision
rules above.

```txt
Calendar scribble 해결:
<paste raw calendar export here>
```

Prefer resolving the identified problem in the same turn when the change is
safe, scoped, and authorized. Still brief first when the export would create a
new workflow or taxonomy, cross several sources of truth, require a material
owner decision, or authorize consequential external action.

```txt
Calendar scribble 브리핑:
<paste raw calendar export here>
```

Normalize and analyze the export, inspect relevant repository context, and
provide a proposed change set without editing files or external state.

When the shortcut is used, do not ask the user to reformat the notes unless a
specific ambiguity blocks safe progress.
