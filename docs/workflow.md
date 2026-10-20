# Workflow

How work on this repository is tracked, branched, versioned and checked. Plans, batches, decisions and completion
notes live on the project board, never in repository files. The repository holds code, data, this changelog and
evergreen "how it works" documents.

## Board

Project: **Mechanism Database** (GitHub project, owner `gingerskull`; link in `.github/ISSUE_TEMPLATE/config.yml`).

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
  rest. The CHANGELOG gets a `## <x.y.z> — <date>` heading. The merge commit is tagged `v<version>`.
- The version is shown on the site (footer) once there is a site.

## Checks: local first

Heavy checks run locally; CI runs what takes seconds.

| Check | Where | When |
|---|---|---|
| Typecheck, style lint (no colour or font literal outside the style files, no style in mechanism records) | pre-push hook and CI | always |
| Unit tests: geometry, meshing, bearing sizing, each rule on its fixture | pre-push and CI | module changed |
| Per-mechanism headless checks: kinematics, clearance, clamp, record completeness | pre-push and CI | that mechanism changed; all mechanisms when `src/` outside `src/mechanisms/` changed |
| Clearance in 3D (penetration depth by Manifold, hand `allow` audit): CI samples 8 phases and caches on the solids and their poses; the full 72 phases run for the mechanisms the push changes | CI (sampled), pre-push (full) | mechanism, rules, hardware or checks changed |
| Conformance report (standard version per mechanism) | pre-push and CI | always |
| Site build | CI | `site/`, catalogue or packages changed |
| Thumbnails: stale ones redrawn in local Chrome; the push stops until `site/thumbs` is committed | pre-push hook | their fingerprint changed (package, model, renderer, style or view) |
| Thumbnail fingerprints compared with the manifest (no drawing) | CI, in the site build | `site/`, catalogue or packages changed |
| Visual snapshots (local Chrome, both sheets, four views per mechanism, against our own baselines) | local only | mechanism, renderer, style or rules changed |
| Browser bench, audit screenshots | local, on demand | |

Snapshot baselines are regenerated once, when the look is final, never to make a run pass. Everything that draws
needs Google Chrome installed locally (`tools/chrome.ts`); CI never draws.

## CI

One workflow for pull requests. Drafts run nothing. A cheap "what changed" job selects the rest by paths; no browser
job; `concurrency` cancels superseded runs; no CI on pushes to main (the PR already checked its merge ref); a weekly
run on main is the safety net. Time limits sit at about twice the observed run; reports are uploaded on failure only,
with short retention. CI changes that save minutes are proposals, made in an issue.

The `Pages` workflow publishes the site to GitHub Pages (https://gingerskull.github.io/mechanism-database/) when a
merge to main changes what the site is built from, or on demand. It builds with `SITE_BASE=/mechanism-database/`, so
every link and asset path in the site goes through `site/src/url.ts`; local builds keep `/`.

Before pushing a fix for a CI failure, reproduce it locally under CI-like conditions and fix plausible sibling
failures in the same push. One push per round. Rerun only failed jobs, only after triage.

## Mechanism work

A mechanism is added or upgraded through the conformance pass in `docs/mechanism-standard.md` (section 1):
generate the audit, fix what fails, verify, record. One issue and one PR per pass. Promoting a hand fix to a rule is
its own PR, because it reruns every mechanism's checks.
