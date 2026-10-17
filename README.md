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
src/              engine, rules, hardware, renderer, mechanisms (to come)
site/             the static site (to come)
tools/            command-line tools: catalogue build, checks, packaging, audit, bench (to come)
```

Work is tracked on the project board (see `docs/workflow.md`).
