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

## Intake Procedure

1. Preserve the user's heading and nested-list structure while reading. Nested
   bullets often encode subordinate conditions, examples, or constraints.
2. Classify each note as one of:
   - `Context`: background, rationale, or examples;
   - `Requirement`: a requested change or acceptance condition;
   - `Question`: something to answer directly;
   - `Constraint`: privacy, scope, naming, technology, timing, or process limit;
   - `Suggestion`: optional direction that needs agent judgment.
3. Map requirements to repository surfaces before editing:
   - public product truth -> `docs/`;
   - future-agent workflow -> `.agents/guidelines/`;
   - temporary continuation state -> `.agents/handoffs/`;
   - private evidence -> `.contexts/`, never public docs by default;
   - source implementation -> `src/` and related project files.
4. Decide whether to execute or brief first:
   - execute when the requested change is scoped, reversible, and clearly tied
     to existing files;
   - brief first when the note creates a new workflow, changes public taxonomy,
     moves phase boundaries, renames entities, or could affect several docs;
   - ask only when no safe assumption would preserve the user's likely intent.
5. When executing, keep the diff focused on the extracted requirements and avoid
   converting every contextual note into project text.
6. After executing, report the interpreted requirements, changed files, checks,
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

When the shortcut is used, do not ask the user to reformat the notes unless a
specific ambiguity blocks safe progress.
