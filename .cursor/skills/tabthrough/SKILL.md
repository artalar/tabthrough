---
name: tabthrough
description: Emits a Tabthrough `.tabthrough.{topic}.guide.json` v1 sidecar alongside a PR, commit, or working-tree change, so a human can unfold the diff step by step in order that builds understanding. Use whenever you finish producing a code change that another person will review, or when asked to write, fix, or validate a `.tabthrough.*.guide.json`.
---

# Tabthrough sidecar

`.tabthrough.{topic}.guide.json` is the script for a guided diff walk. The reviewer presses Tab; each press reveals **one thought** of your change in a diff editor and shows your words for it in a sidebar. You decide two things: **the order** and **the words for each step**. It is not a review, a changelog, or a quiz.

Write one whenever you hand a non-trivial change to a human. Skip it for a one-file, one-hunk, one-thought change — there is no order to convey.

## Contract

- **Schema:** `$schema` is `https://raw.githubusercontent.com/artalar/tabthrough/main/schema/guide-v1.json`. `additionalProperties: false` — only the fields in the cheatsheet exist.
- **Location:** `.tabthrough.{topic}.guide.json` at repo root, kebab topic in the filename (`my-feature` → `.tabthrough.my-feature.guide.json`). Include `"topic"` to match. Legacy `.tabthrough-guide.json` and `.guide.json` are still read. Skill install adds `.tabthrough*` to `.gitignore`. The extension writes `"cursor"` as the reviewer walks — do not invent it.
- **Guarantee:** a broken guide never breaks a session — heuristic fallback + one warning. Nobody else will catch your merges or misplaced anchors; check them yourself.

## What the reviewer sees

Write for this surface. Nothing else exists.

```
Editor    Diff: before ⟷ file-so-far. Only the current step's lines are highlighted
          and scrolled into view; lines from later steps are not on screen yet.
Sidebar   k of n        ◀ Previous   Next ▶
          TITLE                 ← title (falls back to the path — a bad headline)
          path
          notes                 ← plain text, unlabeled, first 480 chars; "Show full notes" for the rest
          Why this comes here   ← rationale
          Open real file
          Up next               ← next title + next rationale, before its code is shown
          ▸ Guide overview      ← summary, collapsed
Status    k of n · file · rationale
```

Consequences:

- The reviewer is looking at the code. Do not describe what the lines do. Say what they **mean for a person** and **why to look now**.
- When a step has `notes`, they are the first sentence read after the title. That sentence must stand on its own.
- The `rationale` is read three times: under the notes, in "Up next" before its code is visible, and in the status bar. It must make sense in all three places, so it carries no identifiers and no "above".
- `notes` are plain text; markdown shows as raw characters. Past 480 characters, the reader has to click.
- `summary` is collapsed by default. Most reviewers read it only if they open it, so it gets one or two sentences.

## Words: title, notes, rationale, summary

The highlighted code is the object. Your words are its caption. Do not invent a second machine or a metaphor: name the thought, say why to look now, and say what stays true. The code shows how.

**Reader:** someone who uses the product and reads the language, but has never opened this module and was not in your session. Every name you coined or picked up while coding is unknown to them until it is on screen. That includes real identifiers.

**Translate, in three moves:**

1. **What a person would notice.** What changes for the user (before → after), or the guarantee that now holds, or what breaks without this.
2. **The part on screen and its job.** "This check is the guard." "This loop is the only place requests are retried."
3. **Then the name**, in backticks, only if the reader will search for it.

Read every sentence aloud to a teammate who joined today. If they would ask "what's X?", translate X.

| Field | Job | Recipe | Good | Bad — the fault that taught it |
|---|---|---|---|---|
| `title` ≤ 60 | Names the thought, in the words a user of the product would use | Short claim or noun phrase. An identifier only when the thought *is* that name | `Finish warns when your stash is left behind` · `Home stops reading git during a review` · `Review defaults to asking the agent` | `Leftover stash keeps the autostash sentence` (session name) · `Range phase carries bounds` (internal noun) · `Update setup.ts` |
| `notes` ≤ 2000, aim ≤ 480 | Shown first. What a person would notice, what stays true, or what breaks without it | `[What changes / what stays true]. [Part on screen] is [its job]. [Name, if needed.]` 1–3 sentences, blank line between points | `Working changes are selected only when the listed branch is the dirty checkout. Viewing another ref while main is dirty leaves the selection empty, so Review does not walk local work in progress.` | `Reading gitRemotes.data from a live computed keeps the async query connected.` (too abstract: a mechanism chain) · `Carriage-return progress keeps the last segment.` (true, but nobody knows why they should care) · restating the diff (too flat) |
| `rationale` ≤ 120 | Why look at this now. Also the "Up next" preview and the status bar | `[What this step gives the reader][, plain link to the step before or after].` One sentence, no identifiers, no "above" | `Where the warning text comes from; the next step shows it to the user` · `The failure this change fixes, written as a test` | `First consumer — silent close, then the leftoverFinishNotice warn` (shop talk plus two thoughts) · `Last-in-win after 80ms` (telegram) · `Adds a null check` (restates the diff) |
| `summary` ≤ 600, aim ≤ 300 | Collapsed overview: the outcome in one glance | Sentence 1: what changes for a person. Sentence 2: the walk order in plain strands, and what is skipped | `Finish now warns when a rebase leaves your stash behind, and the home screen stops reading git while a review is open. The warning comes first, then the home change; formatting-only test edits are skipped.` | `Leftover autostash moves under the actions. Range phase carries bounds.` · a bullet list of everything you did |

**Two ways to fail.**

- *Too abstract:* the words do not read as anything. Session nouns, identifiers in a row, "A sets B before C so D".
- *Too flat:* there is nothing to discover. Restating the lines, repeating the title, or two thoughts in one panel.

The cure for both: one recognisable thought, built from parts that each do a job, captioned with what stays true.

**Affirmative claims.** State what is true now. Do not open by denying the alternative: "It's not A, it's B", "not X but Y", "this is no longer X". When the old behaviour matters, describe it as the other state of the same thing: "Finish used to close without a word; now it shows the warning."

**Rewrites from real guides.** Keep these pairs in mind; agents produced the left column while following an earlier version of this skill.

| Written | Rewritten |
|---|---|
| notes: `Carriage-return progress keeps the last segment. A leftover stash still gets Applying autostash resulted in conflicts.` | `When a rebase finishes but git cannot put your stashed changes back, Finish now says so instead of closing silently. Git rewrites its progress line in place, so this reads only the last version of that line, the one a terminal would show.` |
| notes: `Reading gitRemotes.data from a live computed keeps the async query connected. The empty home is the disconnect.` | `While a review is open, the home screen stops asking git for remotes and history. Before, those reads kept running for the whole walk. Returning an empty home here is what lets them stop.` |
| notes: `A repo-scoped bump sets a flag before the 200ms abortable sleep, so a following index event still promotes HEAD.` | `Saving a file while a branch switch is still refreshing used to leave the sidebar on the old branch. The refresh now waits briefly and remembers the switch, so the sidebar ends on the branch you are on.` |

**Speed is title plus first sentence in three seconds.** Spend words by significance:

| Significance | Words | When |
|---|---|---|
| `critical` (≤ 3) | title + rationale + notes | The one or two steps that make the rest legible |
| `high` | title + rationale, notes if a person would miss what changes | Contracts, first users of a new rule, the fix |
| `normal` | title + rationale | Everything the reviewer should still look at |
| `low` | title + short rationale; may bundle the mechanical rest | Fallout, remaining call sites, docs |
| `skip` via `files` | a rationale that says **why** it can be skipped, in plain words | Lockfiles, generated files, snapshots, formatting |

Voice: calm, precise, active prose for a colleague. Occasionally opinionated about your own code. Never testing the reader. Never telegram. Never pompous.

## Procedure (gates — do not skip)

1. Make the change.
2. **Study the real patch** before writing any step. Never emit from your plan or memory of the edit:

   ```bash
   git status --porcelain=v1 --untracked-files=all
   git -c core.quotepath=false diff --no-color --no-ext-diff -M -U3 --patch <base> <after>
   ```

   For a working-tree review, include untracked files — Start captures with `git add -A`. **Omit `scope.diffDigest`** on working-tree guides: the sidecar is written into the tree it describes, so also list it in `files` as `skip` or the walk will step through the guide itself.
3. List the **whiteboard thoughts** in the patch (helper vs consumer, type vs caller, failure vs fix, contract vs wiring). Distinct thoughts → distinct steps.
4. Decide order: *what would I draw first at a whiteboard?* Use the recipes below.
5. **Anchor with new-file line numbers.** `-U0` hunk headers give them directly:

   ```bash
   git -c core.quotepath=false diff --no-color --no-ext-diff -M -U0 <base> <after> | grep -E '^(\+\+\+ |@@ )'
   ```

   `@@ -a,b +c,d @@` → the changed new-side lines are `c..c+d-1` (a missing count means 1). `d = 0` is a pure deletion: anchor it with `"side": "old"` on `a..a+b-1`. Ranges **intersect** changed lines, so the enclosing function's span is enough — the hunk header is your check that the range hits something.

   A contiguous run of changed lines is **atomic**: a range cannot split it, and two runs separated by a single unchanged line count as one run. Two steps aimed at one run → the second is dropped as `range-overlap`. When two thoughts share a run, write one step: the title names the block, `notes` names the second thought.
6. Write `.tabthrough.{topic}.guide.json`. Use **`ranges` whenever one file has more than one thought**; a whole-file claim is only correct when the whole file is one thought.
7. Run **Before you emit**.

## One thought per Tab

A step is one unit of understanding the reader can absorb, then press Tab. **If the rationale needs "and", split.** Textual proximity in a hunk is not a meaning boundary.

| Distinct thoughts (always split) | One thought (may stay together) |
|---|---|
| New helper / contract, then its consumer refactor | Mechanical rename across many call sites (`low` bundle after one pattern step) |
| Type / invariant, then first caller | Long uniform table or similar edits (`grouping: "split"`) |
| Failing test / bug statement, then the fix | Import reordering + lockfile (`skip` via `files`) |

Canonical anti-pattern: a helper and its consumer in one panel. Two thoughts → two steps, even in one file or one hunk, whenever they are separate runs of changed lines — separate `ranges`, helper first, `dependsOn`.

**One screen per step.** The highlighted lines should fit one editor screen (~40 lines). Larger → it is two thoughts, or a uniform region that wants `grouping: "split"`.

**File switches cost attention.** Keep consecutive steps in one file when the story allows. When you must return to a file, say so in the rationale.

## Worked example

Bug fix: retries treated client errors like 404 as worth retrying. The test leads (the heuristic would sort it last), the rule follows, then the one loop that uses it; docs are a footnote.

```json
{
  "$schema": "https://raw.githubusercontent.com/artalar/tabthrough/main/schema/guide-v1.json",
  "version": 1,
  "scope": { "kind": "commit", "base": "9f2c1ab", "head": "4d81e30" },
  "summary": "A request that fails with a client error such as 404 or 429 now fails at once instead of retrying three times. The walk shows the failing case, the rule, then the loop that uses it; lockfile churn is skipped.",
  "files": {
    "pnpm-lock.yaml": { "significance": "skip", "rationale": "Lockfile churn from the same install; nothing to read" }
  },
  "steps": [
    {
      "id": "the-bug",
      "order": 10,
      "path": "test/http/retry.test.ts",
      "ranges": [{ "start": 41, "end": 58 }],
      "significance": "critical",
      "title": "A 404 must fail at once",
      "rationale": "The failure this change fixes, written as a test; read it before the fix",
      "notes": "On the old code a 404 or a rate-limit answer was retried three times before the caller saw it. Asking again cannot change those answers, so the retries only made real failures slower to notice."
    },
    {
      "id": "retry-rule",
      "order": 20,
      "path": "src/http/retry.ts",
      "ranges": [{ "start": 12, "end": 24 }],
      "significance": "high",
      "title": "Only server errors and lost connections retry",
      "rationale": "The one rule that decides whether a request is tried again",
      "dependsOn": ["the-bug"]
    },
    {
      "id": "client-adopts",
      "order": 30,
      "path": "src/http/client.ts",
      "ranges": [{ "start": 88, "end": 101 }],
      "significance": "high",
      "title": "The request loop asks the rule",
      "rationale": "The loop that used to retry every failure now checks the rule first",
      "notes": "This loop is the only place requests are retried, so every caller of the client gets the new behaviour.",
      "dependsOn": ["retry-rule"]
    },
    {
      "id": "readme",
      "order": 40,
      "path": "README.md",
      "significance": "low",
      "title": "Retry behaviour in the README",
      "rationale": "The same rule, stated for people who use the client"
    }
  ]
}
```

Read the titles top to bottom: a table of contents a user would understand. Read the rationales: a story that still makes sense in "Up next". Read the notes: what changes for a person, then the part that does it. Nothing in the words needs the session to decode.

## Field cheatsheet

| Field | Notes |
|---|---|
| `version` | Must be `1`. Anything else → whole document ignored |
| `summary` | ≤ 600 chars, aim ≤ 300. Collapsed "Guide overview"; outcome first |
| `files` | path → `{ significance, rationale }`. Lockfiles, generated, snapshots → `"skip"` |
| `steps[].id` | Unique, `^[A-Za-z0-9._:-]{1,64}$` |
| `steps[].path` | Repo-relative POSIX, post-image. Must exist in the patch |
| `steps[].title` | ≤ 60 chars. Names the thought in the product's words. Every step |
| `steps[].rationale` | Required, ≤ 120 chars, one plain sentence: why look now. Also the "Up next" preview and status bar, so no identifiers |
| `steps[].notes` | ≤ 2000 chars, aim ≤ 480 (the visible preview). Plain text, shown first under the title, only where a person would miss what changes |
| `steps[].order` | Sparse: 10, 20, 30 |
| `steps[].ranges` | New-file line numbers (not hunk offsets). Intersect changed lines; coarse is fine; a contiguous run cannot be split. `"side": "old"` for pure deletions. **Required when one file has multiple thoughts** |
| `steps[].significance` | `critical` / `high` / `normal` / `low` / `skip` |
| `steps[].grouping` | `atomic` (default) / `split` (long *uniform* region) / `mergeWithNext` (genuinely inseparable adjacent hunks — never to glue two thoughts) |
| `steps[].dependsOn` | Earlier step ids; refines `order`; a cycle drops all edges |
| `topic` | Kebab label matching the filename (`.tabthrough.{topic}.guide.json`) |
| `cursor` | Extension-owned walk position. Omit when writing; the reviewer’s Tab updates it |
| `scope` | `workingTree` / `commit` / `range` with `base` / `head`. Omit `diffDigest` for working-tree guides |

## Order recipes

| Change shape | Order | Trap |
|---|---|---|
| New capability | model → core → wiring → entry → tests | Call site of something not introduced yet |
| Bug fix | failure (often regression test) → fix → fallout | One-line fix with no context |
| Refactor | new shape → one representative call site → rest `low` | Walking all forty call sites |
| Helper + consumer (same file OK) | helper/contract → consumer refactor (`ranges` each) | One panel for both |
| Mixed refactor + feature | refactor block, then feature; name both in `summary` | Interleaving by file |
| Dependency upgrade | manifest → adaptations by breakage kind | Lockfile as content |
| Removal / revert | what goes → callers → cleanup | Deletions need `"side": "old"` or whole-file |
| Codemod / rename | pattern step → `low` rest | Hand-fixes hiding in noise |
| Config / CI | behaviour change → file expressing it | Assuming small = unimportant |

## Never

- **No exam.** No questions, "make sure you understand", scores, difficulty, reading-time, or gates.
- **No restating the diff.** The reviewer sees the code.
- **No telegram notes.** No stacked implementation tokens without a human-visible outcome.
- **No session vocabulary.** A name you coined or learned while coding (`leftoverFinishNotice`, "range phase", "last-in-win") is not a word the reader knows. Translate it into what it does for a person; add the identifier after, in backticks, only if they will search for it.
- **No antithesis.** No "It's not A, it's B", "not X but Y", or a title that is a denial plus a correction.
- **No multi-thought panels.** Helper + consumer in one step is the named defect.
- **No forward references.** You may say a later step exists ("the next step shows it"). You may not name or explain a symbol the reader has not seen yet.
- **No markdown in `notes`.** Plain sentences; backticks around identifiers only.
- **No steps for files not in the patch.**
- **No secrets, tokens, or absolute paths.**

## Before you emit

**Patch gate**

- Studied the real patch; every step matches it, not the plan. Working-tree walks include untracked files.

**Words gate**

- Titles read top to bottom as a table of contents a user of the product would understand.
- Every rationale makes sense on its own in "Up next", before its code is shown: no identifiers, no "above".
- Every note's first sentence says what a person would notice, or what stays true. The identifier, if any, comes after.
- Read each sentence aloud to a teammate who joined today. Anything they would ask "what's X?" about is translated.
- No mechanism chains (too abstract). No restating the lines or repeating the title (too flat). No antithesis.
- Notes fit the 480-character preview unless the step is `critical`.
- `summary` leads with the outcome for a person, then names the walk order and what is skipped.

**Granularity gate**

- No step merges two whiteboard thoughts; multi-thought files use `ranges`; `mergeWithNext` glues nothing distinct.
- Each step fits one screen or is `split`.
- ≤ 3 `critical`; noise demoted via `files`, never hidden.

**Mechanical gate**

- Every `path` is in `git diff --name-status`.
- Every range intersects a `-U0` hunk on its side; no two steps aim at one contiguous run; deletions use `"side": "old"`.
- Ids unique; `order` sparse; `dependsOn` acyclic and pointing backwards.
- Only schema fields; valid JSON; working-tree scope has no `diffDigest`.

**Real test:** could someone who uses the product, but never opened this code, read only the titles and first sentences and explain the change correctly — one thought per Tab?
