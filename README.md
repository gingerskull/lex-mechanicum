# Mechanism Database

An online library of mechanical mechanisms. Each mechanism is drawn live as a mechanically plausible bench assembly
in one house style (blueprint and drafting sheets), with explanations, motion overlays and faceted tags from a
master catalogue of 89 mechanisms.

Status: foundations. The first release builds four mechanisms to the standard: four-bar linkage, Geneva drive, spur
gear pair, slider-crank.

## Documents

- [docs/mechanism-standard.md](docs/mechanism-standard.md): what every mechanism must be, and the one procedure for
  building or auditing one (the conformance pass).
- [docs/style-reference.md](docs/style-reference.md): how the library looks and how the style files are separated.
- [docs/architecture.md](docs/architecture.md): how the code is organised and how a mechanism gets from a kinematic
  model to a drawn page.
- [docs/workflow.md](docs/workflow.md): board, branches, versions, checks and CI.
- [data/catalog/record-spec.md](data/catalog/record-spec.md): schema and vocabularies of the catalogue.

## Layout

```
data/catalog/     catalogue sources and the generated master record
docs/             the standard, the style reference, architecture, workflow
src/              catalogue, style, geometry, model, hardware, rules, assembly, packages, audit, renderer, mechanisms
site/             the static site (Astro)
tools/            command-line tools: catalogue, checks, clearance, packaging, audit, screenshots, bench
tests/            unit, fixture and per-mechanism tests, the site build test, visual snapshots
```

## Commands

```
npm ci                    install
npm run check             typecheck, lint (with the style literal lint), unit tests, conformance
npm run build             the static site into dist/site (tokens, packages and thumbnails first)
npm run preview           serve the built site
npm run test:site         check the built site
npm run test:visual       visual snapshots against the committed baselines (local only)
npm run catalog           rebuild data/catalog/mechanisms.json from the sources
npm run audit <id>        regenerate a mechanism's audit sheet
npm run shot <id>         render one frame to a PNG
npm run bench [id]        frame times per view and detail position
```

Work is tracked on the project board (see `docs/workflow.md`).
