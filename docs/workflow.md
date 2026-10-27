# Workflow

How work on this repository is tracked, branched, versioned and checked. Plans, batches, decisions and completion
notes live on the project board, never in repository files. The repository holds code, data, this changelog and
evergreen "how it works" documents.

## Board

Project: **Lex Mechanicum** (GitHub project, owner `gingerskull`; link in `.github/ISSUE_TEMPLATE/config.yml`).

Fields: Status (Inbox, Ready, In progress, In review, Done, Deferred, Won't do), Kind, Area, Size, Version.
Board automations (set in the project's Workflows settings): new issues go to Inbox; an issue with a linked PR goes to
In review; a closed or merged item goes to Done; a reopened item goes to In progress.

Kinds of work, each with an issue template:

- **Batch of fixes:** one issue whose body is a task list; small changes in one area go in together, in one PR.
- **Feature or rework (plan):** a parent issue with goal, scope, design and decisions, and one sub-issue per step
  with acceptance criteria. The plan is reviewed in the issue before code.
- **Bug, Idea, Decision.** A decision lists the options with the recommended one first and is answered in a comment.

Areas: Mechanisms, Rules & hardware, Renderer & style, Site, Catalogue, Tooling & tests, CI & process, Docs.

Mechanism work follows `docs/mechanism-standard.md`: an issue per conformance pass points at requirement ids and
lists only that mechanism's decisions and open items. No requirement text, style values or rule descriptions in
issues: those live in the standard, the style reference and the code.

## Branches, commits, PRs

- Branches `<type>/<short-kebab-summary>` with types `feat`, `fix`, `tech`, `perf`, `design`, `docs`.
- Conventional Commits (`feat:`, `fix:`, `docs:`, `tech:`, `perf:`, `design:`).
- Few, outcome-sized PRs, squash-merged. Each PR says `Closes #N`, bumps the version and adds its CHANGELOG line.
  Docs-only and test-only PRs are cheap and need no batching.
- Open PRs as drafts; mark ready once, after the local checks below pass.
- Merge only on green CI for real failures. Timing or transient noise is triaged, reported as low severity, and may
  be merged past by decision.

## Versions

- `version` in `package.json` is bumped in every PR that merges to main: pre-1.0, MINOR for features, PATCH for the
  rest. The CHANGELOG gets a `## <x.y.z>, <codename> — <date>` heading. The merge commit is tagged `v<version>`.
- The release step does the bump: `npm run release -- minor` (or `patch`). It writes the version into `package.json`
  and the lock file, the CHANGELOG heading and `data/codenames.json`. Lines written under an `## Unreleased` heading
  move under the new one; otherwise write them under it.
- **Codenames.** Each minor release takes the next unused name of `data/release-names.json`, in file order; its
  patches keep it. When the list runs out, it comes round again with a numeral (Graia II). Nobody picks a name by
  hand. Releases from before the first codename keep their `## <x.y.z> — <date>` headings and have none. The footer
  shows the codename next to the version.
- The version is shown on the site (footer) once there is a site.

## Checks: local first

Heavy checks run locally; CI runs what takes seconds.

| Check | Where | When |
|---|---|---|
| Typecheck, style lint (no colour or font literal outside the style files, no style in mechanism records) | pre-push hook and CI | always |
| Unit tests: geometry, meshing, bearing sizing, each rule on its fixture | pre-push and CI | module changed |
| Per-mechanism headless checks from the record: kinematics (K1 residual), claims, SOLID, record completeness | pre-push and CI | that mechanism changed; all mechanisms when `src/` outside `src/mechanisms/` changed |
| Clearance in 3D (penetration depth by Manifold, hand `allow` audit): CI samples 8 phases and caches on the solids, their poses and the checks' code; the full 72 phases run for the mechanisms the push changes | CI (sampled), pre-push (full) | mechanism, rules, hardware or checks changed |
| Conformance report (standard version per mechanism) | pre-push and CI | always |
| Site build | CI | `site/`, catalogue or packages changed |
| Thumbnails: stale ones redrawn in local Chrome; the push stops until `site/thumbs` is committed | pre-push hook | their fingerprint changed (package, record blocks and polish, renderer, style or view) |
| Thumbnail fingerprints compared with the manifest (no drawing) | CI, in the site build | `site/`, catalogue or packages changed |
| Social cards (`site/cards`): stale ones redrawn in local Chrome like the thumbnails, compared in the site build | pre-push hook, CI (compare only) | as the thumbnails, or a mechanism's name, family or level changed |
| Visual snapshots (local Chrome, both sheets, four views per mechanism, against our own baselines) | local only | mechanism, renderer, style or rules changed |
| Browser bench, audit screenshots | local, on demand | |

Snapshot baselines are regenerated once, when the look is final, never to make a run pass. Everything that draws
needs Google Chrome installed locally (`tools/chrome3.ts`); CI never draws.

While working, `npm run test:changed` runs only the tests the uncommitted changes touch, and `conformance` and
`clearance` take the ids of the mechanisms in hand (or `changed`); the full suite runs at the push. Builds are cached
per mechanism (`dist/cache`, keyed on its own sources), locally and between CI runs, so a change to one mechanism
builds that one again and a change to shared code every one.

### What needs local tools

Everything that does not draw runs in Node anywhere, so a session in the cloud can do it: records and the catalogue,
kinematics, rules and hardware, the headless checks and clearance, site code, docs. Work that draws needs a checkout
with Google Chrome and WebGL2:

- a change that makes thumbnails or social cards stale (a mechanism's package, record blocks or polish, the
  renderer, the style, a thumbnail view, or a mechanism's name, family or level): the pre-push hook redraws them,
  and the site build fails while they are stale;
- visual snapshots and their baselines, the browser bench, `compare`, `shot3` and `pilots3`;
- the verify step of a conformance pass, which looks at the drawn views (standard section 1).

Every other input a session needs is in the repository or on the board: the standard, the style reference, the
catalogue and its sources, and the original teaching review (`docs/teaching-review.md`).

## CI

One workflow for pull requests. Drafts run nothing. A cheap "what changed" job selects the rest by paths; no browser
job; `concurrency` cancels superseded runs; no CI on pushes to main (the PR already checked its merge ref); a weekly
run on main is the safety net. Time limits sit at about twice the observed run; reports are uploaded on failure only,
with short retention. CI changes that save minutes are proposals, made in an issue.

The `Pages` workflow publishes the site to GitHub Pages (https://gingerskull.github.io/lex-mechanicum/) when a
merge to main changes what the site is built from, or on demand. It builds with `SITE_BASE=/lex-mechanicum/`, so
every link and asset path in the site goes through `site/src/url.ts`; local builds keep `/`.

Before pushing a fix for a CI failure, reproduce it locally under CI-like conditions and fix plausible sibling
failures in the same push. One push per round. Rerun only failed jobs, only after triage.

## Mechanism work

A mechanism is added or upgraded through the conformance pass in `docs/mechanism-standard.md` (section 1):
generate the audit, fix what fails, verify, record. One issue and one PR per pass. Promoting a hand fix to a rule is
its own PR, because it reruns every mechanism's checks.

The audit generator fills the rows the rules' output or the pipeline decides and leaves `?` on the rest. Those are
judged with `npm run judge`, into the sheet itself: one row on one or more sheets, or a file of judgements for rows a
family judges alike; `npm run judge -- --open <id>` lists what is left.

### Batch passes

When several passes run at once (a family, a wave of new records):

- **Readiness gate.** Every record of the batch validates and solves (`npm run kin-check -- <id>`, `tools/check.ts
  <id> --no-solids`), and a stub build and conformance run on all of them; a requirement row that fails in three or more
  mechanisms for engine reasons becomes an engine task first. The first passes are pilots that cover every input kind
  and kit family in the batch.
- **Shared work first.** The kits, blocks and rules several passes need land on the batch's integration branch before
  the passes start. Each shared file has one owner; a pass that finds a gap posts it on the plan issue before touching
  shared code. A family's blocks, shapes and contact kits each live in a file of their own (`src/kin/steps/`,
  `src/builder/shapes/`, `src/builder/rules/contacts/`), registered by one line, so passes on different families do not
  edit the same file.
- **Small passes.** A few mechanisms each, the hard ones first or alone.
- **Merges.** The integrator merges each finished pass right away, one at a time, and runs the whole-library checks
  once per merge. Pass branches never commit generated files or thumbnails.
