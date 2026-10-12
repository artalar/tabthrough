# Plan: rewrite the guide-writing skill so an average human can read the words

Status: plan only. Implementer: a later agent. Nothing in this document is applied yet.

## TL;DR

- **The problem is translation, not register.** Agents follow the current skill and still write insider prose. They fill the fields with names they learned while coding (`leftoverFinishNotice`, "range phase", "last-in-win"). The skill tells them *how to sound*. It never tells them *what to translate from and into*.
- **The fix is a three-move recipe borrowed from Anatomy's caption craft.** First, what a person would notice (or what stays true). Second, the part on screen and its job. Third, only then, the identifier in backticks. Each rule sits next to the real fault that taught it.
- **The skill describes the sidebar wrongly, and that misdirects agents.** In reality, notes render *first* under the title, unlabeled, cut to 480 characters. The rationale comes second as "Why this comes here", and is reused as the "Up next" preview and in the status bar. The summary is a *collapsed* "Guide overview" at the bottom. Fix the skill to match; do not change the UI.
- **Scope of the change:** one Words section rewrite, a truthful sidebar diagram, a reworded worked example, two prompt strings, three golden guides, and synced docs. No new JSON fields, no UI change, no invented machines.
- **Tests:** the existing prompt assertions keep passing if the pinned phrases are kept (they are, below). Add three new phrase assertions. The JSON examples must still validate. Finish with `pnpm ext:install`.

---

## 1. The new writing contract (≤ 1 page)

**One rule:** *the highlighted code is the object; your words are its caption.* Do not invent a second machine. Name the thought, say why to look at it now, and say what stays true. The code shows how.

**Reader:** someone who uses the product and can read the language, but has never opened this module and was not in your session. Every name you coined or picked up while coding is unknown to them until it is on screen. That includes real identifiers.

**Where each field is read, and its job:**

| Field | Where a human reads it | Job |
|---|---|---|
| `title` | Sidebar heading; "Up next" preview; screen-reader announcement | Names the thought in the words a user of the product would use |
| `notes` | **First prose under the title**, unlabeled; 480 characters visible, the rest behind "Show full notes" | What a person would notice, what stays true, or what breaks without it |
| `rationale` | "Why this comes here" under the notes; **"Up next" preview before the code is visible**; status bar | Why look at this now: one plain sentence that still makes sense before the code is shown |
| `summary` | Collapsed "Guide overview" at the bottom | The outcome in one glance, for someone who never expands a step |

**Translation recipe (notes):** `[What changes for a person / what stays true]. [The part on screen] is [its job]. [Identifier in backticks, only if they will search for it.]`

**Translation recipe (rationale):** `[What this step gives the reader][, plain link to the step before or after].` No identifiers, and no "above" or "below": the same line appears in "Up next" before the code is visible.

**Two failure modes** (Anatomy's own words):

- **Too abstract:** the words do not read as anything. Session nouns, identifiers in a row, mechanism chains ("A sets B before C so D").
- **Too flat:** there is nothing to discover. Restating the diff, repeating the title, or packing two thoughts into one panel.

**Before → after:** when the old behaviour matters, describe it as two states of the same thing. "Finish used to close without a word; now it shows the warning." Never open with a denial.

**What not to steal from Anatomy:**

- Invented physical metaphors as the explanation of a diff.
- Organ or dissection vocabulary.
- Quizzes.
- The "naive version fails first" voice, which collides with the no-antithesis rule.

---

## 2. `SKILL.md` edits (canonical: `res/skill/tabthrough/SKILL.md`)

Apply every edit to the canonical file, then copy it byte-for-byte to `.cursor/skills/tabthrough/SKILL.md` and `.agents/skills/tabthrough/SKILL.md`. Verify with `cmp`.

### 2.1 Replace "What the reviewer sees" (current diagram plus its "Consequences" list)

Replace everything from `## What the reviewer sees` up to (not including) `## Words: title, rationale, notes, summary` with:

````markdown
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
````

### 2.2 Replace the whole Words section

Replace from `## Words: title, rationale, notes, summary` up to (not including) `## Procedure (gates — do not skip)` with:

````markdown
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
````

Notes on this section:

- The old `Graduate literacy in the stack; zero session vocabulary.` line is deliberately gone. Agents read it as permission to use Reatom and git internals.
- The "IEEE Software / Nature" line is dropped. It sets the register too high and gives no translation task.
- The old good title `Only stash@{0} counts` is dropped, because it only works for readers who know git stash refs.

### 2.3 Worked example: keep the retry domain, rewrite the words

Keep the structure, ids, ranges, paths, `order`, `dependsOn`, and significance exactly as they are, so it still validates. Replace only these strings:

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

Replace the intro line above the example with:

`Bug fix: retries treated client errors like 404 as worth retrying. The test leads (the heuristic would sort it last), the rule follows, then the one loop that uses it; docs are a footnote.`

Replace the closing paragraph below the example with:

`Read the titles top to bottom: a table of contents a user would understand. Read the rationales: a story that still makes sense in "Up next". Read the notes: what changes for a person, then the part that does it. Nothing in the words needs the session to decode.`

### 2.4 Field cheatsheet rows

Replace these four rows:

```markdown
| `summary` | ≤ 600 chars, aim ≤ 300. Collapsed "Guide overview"; outcome first |
| `steps[].title` | ≤ 60 chars. Names the thought in the product's words. Every step |
| `steps[].rationale` | Required, ≤ 120 chars, one plain sentence: why look now. Also the "Up next" preview and status bar, so no identifiers |
| `steps[].notes` | ≤ 2000 chars, aim ≤ 480 (the visible preview). Plain text, shown first under the title, only where a person would miss what changes |
```

### 2.5 "Never" list

Replace the existing forward-reference and secrets bullets with these three, and add the session-vocabulary bullet right after "No telegram notes":

```markdown
- **No session vocabulary.** A name you coined or learned while coding (`leftoverFinishNotice`, "range phase", "last-in-win") is not a word the reader knows. Translate it into what it does for a person; add the identifier after, in backticks, only if they will search for it.
- **No forward references.** You may say a later step exists ("the next step shows it"). You may not name or explain a symbol the reader has not seen yet.
- **No secrets, tokens, or absolute paths.**
```

The secrets bullet loses "session-private codenames" because the new bullet covers it.

### 2.6 "Before you emit": replace the Words gate

```markdown
**Words gate**

- Titles read top to bottom as a table of contents a user of the product would understand.
- Every rationale makes sense on its own in "Up next", before its code is shown: no identifiers, no "above".
- Every note's first sentence says what a person would notice, or what stays true. The identifier, if any, comes after.
- Read each sentence aloud to a teammate who joined today. Anything they would ask "what's X?" about is translated.
- No mechanism chains (too abstract). No restating the lines or repeating the title (too flat). No antithesis.
- Notes fit the 480-character preview unless the step is `critical`.
- `summary` leads with the outcome for a person, then names the walk order and what is skipped.
```

Replace the last line ("Real test") with:

`**Real test:** could someone who uses the product, but never opened this code, read only the titles and first sentences and explain the change correctly — one thought per Tab?`

### 2.7 Leave unchanged

Leave Contract, Procedure, One thought per Tab, Order recipes, the Patch gate, the Granularity gate, and the Mechanical gate as they are. They solve granularity, which already works.

---

## 3. Prompt strings in `src/model/setup.ts`

### 3.1 `COMMAND_BODY` (currently around line 106)

```ts
export const COMMAND_BODY = `Follow the Tabthrough skill and write a \`.tabthrough.{topic}.guide.json\` for the review target in this chat.

Study the real git patch first. One thought per Tab step; \`ranges\` when a file has more than one thought, anchored with new-file line numbers from \`git diff -U0\` hunk headers. Every step gets a \`title\` that names the thought, a \`rationale\` that says why to look at it now, and \`notes\` only where the code cannot explain itself (plain text).

Write for someone who uses the product and reads the language but has never opened this module and was not in your session. Say what a person would notice first (what changes for the user, or what stays true), then the part on screen and its job, then the identifier in backticks only if they will search for it. Names you coined or learned while coding are not words the reader knows. State what is true; never "it's not A, it's B". No quizzes, no restating the diff.
`
```

### 3.2 `agentPromptFor()` bullets (currently lines 720–723)

Replace three lines. The pinned test phrases `` `title` names the thought `` and `` `notes` only for the why that is not in the code `` are kept on purpose.

```ts
    '- every step: `title` names the thought in the product\'s words (≤ 60 chars); `rationale` says why to look at it now in one plain sentence that also reads as the "Up next" preview (≤ 120 chars, no identifiers); `notes` only for the why that is not in the code (plain text, ≤ 3 sentences: what a user would notice or what stays true, then the part on screen and its job, then the name)',
    '- `summary`: 1–2 sentences, collapsed as the guide overview — the outcome for a person first, then the walk order',
```

Keep the line for demoting lockfiles, generated files, and mechanical fallout via `files` unchanged.

```ts
    '- reader: uses the product and reads the language, never opened this module, was not in your session; translate every coined or internal name into what it does for a person; affirmative claims (what is true, never "it\'s not A, it\'s B"); no mechanism chains',
```

---

## 4. Golden examples: rewrite a few, leave the rest

Agents copy whatever looks good. The minimum golden set is the guides an agent is likely to open. Change **words only** in each; never change `id`, `path`, `ranges`, `order`, `dependsOn`, `scope`, or `cursor`.

| File | Action | Why |
|---|---|---|
| Skill worked example (§2.3) | Rewrite | The first thing every agent copies |
| `test/fixtures/guides/helper-consumer.guide.json` | Rewrite words | Linked from the authoring guide as the "correct" sample |
| `.tabthrough.session-idle-git.guide.json` | Rewrite all words | Holds three of the quoted failures; makes the best before/after |
| `.tabthrough.idle-home.guide.json` | Rewrite only the rationales of the "History follows the listed branch", "Clicks become the review target", and "Review starts the walk" steps (ids per file) | Already holds the best note; its neighbouring rationales (`log-rev`, `pendingEntry then startSession`) undercut it |
| `test/fixtures/guides/helper-consumer-merged.guide.json` | Leave | A negative sample about structure; its bad words are part of the anti-pattern |
| `test/fixtures/guides/helper-consumer.dogfood.guide.json` | Leave | A record of one real agent attempt; rewriting it falsifies the record |
| `.guide.json`, `.tabthrough-guide.json`, `.tabthrough.readme.guide.json`, `.tabthrough.guide-topic.guide.json`, `.tabthrough.home-review-type.guide.json` | Leave | Legacy or low-traffic. Optional later pass on `home-review-type` rationales such as `First consumer — generate versus start, …` |
| `valid`, `replace`, `forward-compatible`, `invalid`, `unsupported-version` fixtures | Leave | Schema tests, not writing samples |

**`helper-consumer.guide.json`: new words**

- `summary`: `Event call sites now share one rule for listener names. The rule comes first, then the first call site that uses it.`
- Step `event-action-name`:
  - title: `One rule for event listener names`
  - rationale: `The naming rule every event call site will share; read it on its own first`
  - notes: `Every event binding turns an event type into a listener name the same way, for example click into onClick. Keeping that rule in one helper, \`eventActionName\`, stops call sites from drifting apart.`
- Step `jsx-event-adopts`:
  - title: `JSX events use the shared rule`
  - rationale: `The first call site to switch to that rule`

**`.tabthrough.session-idle-git.guide.json`: new words.** Use §2.2's rewrites for the two notes. Titles and rationales:

| Step (current title) | New title | New rationale |
|---|---|---|
| Leftover stash keeps the autostash sentence | `Finish warns when your stash is left behind` | `Where the warning text comes from; the next step shows it to the user` |
| Finish forwards that leftover notice | `Finish shows the warning` | `Finish used to close without a word in this case; now it shows the warning` |
| Home phase is empty while a session is open | `Home stops reading git during a review` | `Why background git work stops once a review starts` |
| Home queries subscribe only while idle | `Home reads git only when no review is open` | `The same rule for the remotes and history lists` |

- `summary`: `Finish now warns when a rebase leaves your stash behind, and the home screen stops reading git while a review is open. The warning comes first, then the home change; formatting-only test edits are skipped.`
- File rationales:
  - `Coverage for leftoverFinishNotice and the autostash Finish case` → `Tests for the stash-left-behind warning`
  - `Named-import sort only` → `Import order only`

**Optional, cheap: a words lint for goldens only.** This is not a product validator. Add `test/unit/golden-words.test.ts`, which loads the skill example, `helper-consumer.guide.json`, and `.tabthrough.session-idle-git.guide.json`, then asserts:

- No rationale contains a backtick, a camelCase token (`/\b[a-z]+[A-Z]\w*/`), or the word "above".
- No note exceeds 480 characters.
- No title, rationale, or note matches `/\bnot\b[^.]*\bbut\b|it'?s not\b/i`.

This answers "nothing validates words" for the examples agents copy, without touching the reader or the schema.

---

## 5. Docs

| Doc | Action |
|---|---|
| `work-docs/guides/agent-guide-authoring.md` | **Sync, do not slim.** Retitle §2.3 "The rationale is about position, not content" to "The rationale says why to look now", and add that it is reused in "Up next" and the status bar. Replace the notes paragraphs (around lines 95–99) with §2.2's reader, translation moves, and two failure modes. Keep the bad-example sections (around lines 284–331) as faults, and add the §2.2 rewrite next to each, so the rule carries its fault. Sync the helper example notes (around lines 255–270) with the new fixture words. Add one line at the top: SKILL.md's Words section is canonical; this guide explains it. Every ```` ```json ```` block must still parse and validate. |
| `work-docs/architecture/guide-schema.md` | **Small sync.** Field table: change `rationale` to "One line, ≤ 120 chars. Why look at this now, in plain words; also the Up next preview and status bar". Change `notes` to "shown first under the title; the first 480 chars are visible". In §10 (around lines 389–390), change "Rationale is about order, not content" to "Rationale says why to look now; it is not a description of the code". The example note at around line 318 (`` `significance` is a teaching weight, not a severity.``) is an antithesis; replace it with `How much attention a step gets in the walk. Every later step reads this weight, so it comes first.` and keep the JSON valid. |
| `README.md` | **Small sync.** Its three example rationales (`The contract before its consumers` and the two after it) are shop talk. Replace them with `The shape of an order, which the next two files use`, `How the price is worked out from that order`, and `Checkout, the last place that builds an order`. |
| `work-docs/guides/llm-guide-generation.md` | **One phrase.** On line 84, change "position-not-content rationales" to "plain why-look-now rationales". |
| `work-docs/specs/product.md` | **Leave.** It specifies product behaviour, not writing rules. |
| `test/fixtures/README.md` | **Leave.** |

---

## 6. Non-goals

- **No invented machines, metaphors, or diagrams** standing in for the diff. The hunk is the object.
- **No organs, dissection, or quiz vocabulary.**
- **No new JSON fields** (`description`, `verify`, `risk`, `audience`, `checks`). Before/after, what to verify, and what stays true all fit in `notes` as the first sentence. The v2 decision to leave `audience` and `checks` out stands.
- **No UI change.** In particular, do not reorder notes and rationale. The skill adapts to the real order: notes lead, so their first sentence must stand alone. Leave the internal label `Implementation notes` in `src/model/sidebar.ts` alone, because the HTML does not render it.
- **No rewrite of procedure, granularity, anchoring, or order recipes.**
- **No product-side words validator.** The optional lint in §4 checks golden examples only.

---

## 7. Ordered file list

1. `res/skill/tabthrough/SKILL.md`: apply §2.1–§2.6.
2. `.cursor/skills/tabthrough/SKILL.md` and `.agents/skills/tabthrough/SKILL.md`: byte copies of step 1. Verify with `cmp`.
3. `src/model/setup.ts`: apply §3.1 to `COMMAND_BODY` and §3.2 to `agentPromptFor()`.
4. `test/unit/serialize.test.ts`: in the "spells out the words contract" case, add:
   - `expect(prompt).toContain('what a user would notice')`
   - `expect(prompt).toContain('was not in your session')`
   - `expect(prompt).toContain('"Up next" preview')`

   Keep the existing assertions.
5. `test/fixtures/guides/helper-consumer.guide.json`: new words from §4.
6. `.tabthrough.session-idle-git.guide.json`: new words from §4.
7. `.tabthrough.idle-home.guide.json`: three rationales, written with the §2.2 rationale recipe.
8. `work-docs/guides/agent-guide-authoring.md`: §5 sync.
9. `work-docs/architecture/guide-schema.md`: §5 sync.
10. `README.md`: §5 sync.
11. `work-docs/guides/llm-guide-generation.md`: §5, one phrase.
12. Optional: `test/unit/golden-words.test.ts` (§4).

---

## 8. Tests and install

- `pnpm test:ci` must pass. The tests that could be affected:
  - **`serialize.test.ts`:** passes unchanged, because the pinned phrases are kept. The three new assertions from step 4 are additions.
  - **`published-schema.test.ts`:** extracts every ```` ```json ```` block that has `version` from the skill, `agent-guide-authoring.md`, and `guide-schema.md`, and validates it against the schema. A typo in a rewritten example fails here. It also requires the skill to contain the `$schema` URL; keep it.
  - **`helper-consumer-fixture.test.ts`:** checks ids, order, and ranges, not words. It should pass; rerun it anyway.
  - **`setup.test.ts`:** writes a custom skill and checks that it is not overwritten. Unaffected.
- Run `cmp` on the three skill copies before running the tests.
- **Install:** `SKILL.md` ships in the VSIX and `setup.ts` builds the prompt, so finish with `pnpm ext:install` (Node 24 via mise; `vsce` crashes on Node 25).
- After install, run Setup in a scratch repo. Confirm that `.cursor/commands/tabthrough.md` holds the new `COMMAND_BODY` and that the installed skill matches `res/skill/tabthrough/SKILL.md`.

---

## 9. Success criteria

These are measured on fresh agent output, not on the edited examples.

1. **Dogfood:**
   - Ask a fresh agent, without showing it any golden guide, to write guides for two real recent changes: the session-idle-git commit and one other.
   - Then give the titles plus the first sentence of each note, with no code, to someone who uses Tabthrough but has not read the source.
   - **Pass:** they can say in their own words what changed for a user, for every `critical` and `high` step.
   - **Fail:** they ask "what's X?" about anything other than a name that is on screen.
2. **Mechanical checks on that output:**
   - Zero rationales contain a backtick or camelCase token.
   - At least 80% of notes are 480 characters or fewer.
   - Zero antithesis matches.
   - Every note's first sentence contains no identifier, or names one only after a plain clause.
3. **"Up next" check:** each rationale is read alone, the way the preview shows it. The reader can say why they would look at that step next.
4. **Granularity does not regress:** the P0-G3 dogfood in `test/fixtures/README.md` still yields at least two steps, splitting helper and consumer.
5. **Summary check:** its first sentence names a user-visible outcome. It fits in about 300 characters.
