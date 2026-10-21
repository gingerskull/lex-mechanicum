# Mechanism standard

```
version: 3.0
date: 2026-10-20
supersedes: 2.14 (the 2.5D engine; 1.0 was the hand-off standard of 2026-10-16)
```

This is the one document that says what every mechanism in the library must be: its record and page content, its
kinematic model, how well it teaches its principle, its part design, how it is built as a physical assembly, the
mechanical detail it carries, its drive, how it is drawn, and how its detail is scaled for performance. Where this document and the code disagree on
a rule, the document wins and the code is the bug. Where they disagree on a value (a size, a weight), the code's
style or hardware table wins and the document is updated.

**The ideal is a watch movement.** Every screw, jewel, spring, bridge and pin in a movement exists because something
must be located, held, carried, limited, adjusted, oiled, timed or protected. A mechanism here is complete when it
would really work on a bench: not when it looks finished. Nothing is decorative; the big parts stay plain; the
richness is in what makes the mechanism move and hold together.

**The v3 pipeline.** A mechanism is no longer a hand-written model and polish. It is its **catalogue record v3**
(`data/catalog`, spec in `data/catalog/record-spec.md`) with a structured `kin` block (bodies, joints with 3D axes,
drivers, branch, points, outputs, design choices, ranges) and a `teaching` block (principle parts, traces, construction
overlays, default view, controls, time map). From the record the pipeline runs:

```
record v3 → kinematic blocks (closed form, verified by a loop-closure residual)
          → hardware builder (joint kits, axial stacks, support router, placement solver)
          → polish (true exceptions only) → 3D solids (Manifold, Node, build time)
          → 3D checks → package v2 (profiles and meshes) → depth-buffer drafting renderer → site stage
```

Parts are true 3D solids, the camera is free and orthographic, and sections, details and explodes along each joint
axis are views of the same solids. The code layout is in `docs/architecture.md`; the look is in
`docs/style-reference.md` (3.0).

**The teaching test.** Every mechanism is also judged on one question: the motion and the mechanism must be easy to
understand and good for teaching the principle, mechanics first, with no real-world usage context (the Walschaerts
gear without the locomotive). How textbooks, 507 Mechanisms and common animations show it is a reference to compare
against, not a requirement: an artistic interpretation is welcome when the principle reads at least as well. It is a
review judgement, not a hard check (section 3a, T1).

**One procedure for everything.** There is no separate "new mechanism" and "upgrade" workflow. An agent given a
mechanism runs a **conformance pass** (section 1): generate the audit, fix what fails, verify, record. A mechanism
that does not exist yet is one that fails everything, and the first fix is to create its model from the catalogue.

**Two kinds of rule.** Most requirements are met by code: the rules engine builds every joint from its type
(section 5b), stage 3 adds fasteners, the style is global. The rest depend on the particular mechanism's loads,
sweeps and geometry and can only be decided by hand. Every requirement says which it is. Automatic does not mean
unchecked: the audit confirms the rule fired and did the right thing for this mechanism.

| Tier | Meaning | What the agent does |
|---|---|---|
| **AUTO** | Done by the rules engine (`src/rules`), the hardware primitives (`src/hardware`), stage 3, the packager or the renderer, for every mechanism. | Verify it fired and fits. Never re-implement it by hand. If it is wrong for this mechanism, override it in the polish and say why in the audit. |
| **HAND** | Depends on this mechanism. No rule can decide it. | Decide and build it per the standard. This is the craft. |
| **STYLE** | Global look, `src/style` only. | Never set per mechanism. Report a problem; do not patch it locally. |
| **DATA** | Catalogue content (`data/catalog`). | Fill or correct the catalogue record; the page and the model read it by id. |
| **SITE** | Page or app behaviour shared by all mechanisms. | Report if failing; fix in the site, not in a record. |
| **FLAG** | Measured and reported, never pass or fail. | Note it in the audit; look at it when convenient. |

A requirement marked AUTO whose rule does not exist yet in the code is audited as **AUTO-TODO**: apply it by hand in
the polish, mark it in the audit, and list it under promotion candidates. The rule gets written as its own change
(section 0).

**Promotion.** When the same hand fix appears in three mechanisms, or a joint type recurs, it becomes a rule module
or an `H.*` primitive with a fixture test, then every mechanism's checks are rerun. That is a change of its own, never
folded into a mechanism's conformance pass.

Requirement ids (P1, K2, A9, J3, T1, DL2 ...) are stable: audits, notes, issues and commit messages refer to them.
3.0 retires K5 (layers, `dz` and `twin` are gone; the placement solver, A18, sets every axial position) and replaces
the text of D8, K1, K3, A15, L6 and L7; their ids stay. The ids of the plan's decisions are traced in Appendix C.

---

## 0. Versioning and conformance

| Id | Requirement | Tier |
|---|---|---|
| S1 | This document carries a `version` header and a changelog. Every changelog entry names the requirement ids it touches and its tier: **AUTO** or **STYLE** (code; every mechanism picks it up on rebuild), **HAND** (a mechanism meets it only when rebuilt or re-polished), **DATA**, **SITE**. | DATA |
| S2 | Every mechanism's audit sheet (`src/mechanisms/<id>/audit.md`) starts with a header: `standard: <version>`, `date`, `result: pass | open`, `detail: full | <rung>`. It is the only per-mechanism record of conformance. From 3.0 the audit also records the teaching review's verdict (T2) on a `teaching:` line under the header. | HAND |
| S3 | `tools/conformance` reads every audit header and this changelog and reports, per mechanism: the audited version, the HAND changes since, the current check results (K1 residual, A15, A12). It runs as a test: a mechanism behind a HAND change fails until its audit is redone or the item is deferred in the report with a reason. AUTO and STYLE changes never require a re-audit; they rerun every mechanism's checks. | AUTO |
| S4 | Board issues hold mechanism-specific decisions and open items only, pointing at requirement ids. No requirement text, style values or rule descriptions live in issues. | SITE |
| S5 | **Transition mark.** Between the first and the last pull request to main of the v3 plan, a page drawn by the v3 engine carries a visible 3D stamp in its title block and on its library card. At cut-over the stamp, the 2.5D engine, v1 packages and the old polishes are removed together. | SITE |
| S6 | **3.0 binds a mechanism at its rebuild.** The HAND requirements new or changed in 3.0 bind a mechanism from the pass that rebuilds it from its record v3 (section 1). The audits of the 2.5D pipeline are replaced by that pass, never re-audited against 3.0, so their conformance entry reads as current until then. | AUTO |

---

## 1. The conformance pass

Run this for any mechanism, whatever state it is in. Every mechanism is built **from scratch** from its catalogue record
v3, the shared blocks and kits, and the rules. A model, polish or audit left from the 2.5D pipeline is at most a loose
before/after comparison and never a template.

1. **Locate.** `data/catalog/sources` holds the record v3 (`kin` and `teaching` blocks, spec in
   `data/catalog/record-spec.md`); `src/mechanisms/<id>/` holds `audit.md` and, only where the mechanism has true
   exceptions to the rules, `polish.ts`. A mechanism that does not exist yet has a record and nothing else.
2. **Teaching review of the record** (T2). Before building, answer "does this teach its principle well?" for the
   mechanism as the record describes it: six phases drawn from the solved kinematics, the solve checks (strokes,
   ratios, dwell, straightness), and the text read against the motion. A mechanism built after the original review
   gets the same method here; so does every mechanism that lands later. Record the verdict and every decision in the
   record's `teaching` block (principle parts, traces, overlays, view, controls, time map, changed parameters).
3. **Build.** `tools/package <id>` runs the pipeline of the standard's introduction. Nothing is registered; the
   registry reads the record and the folder.
4. **Generate the audit.** `tools/audit <id>` writes `audit.md` from the template (section 11): one row per requirement
   with the evidence the tool can collect (check results, clearance, solid lists, sizes, which kit and block served
   which joint), and the ten-function table per joint. Rows the tool cannot judge are left `?`.
5. **Judge.** Replace every `?` with PASS, FAIL or N/A and one line of evidence or reason. For section 6 go through
   every joint and every part. For section 3a, look at the six phases again, now drawn with the finished build, and
   compare against the verdict of step 2.
6. **Fix, in this order:** DATA and kinematics (P, K) → teaching (T) → assembly structure (A, J) → explode (E) → part
   design (D) → functional completeness (F) → manufacturing evidence (M) → drive (V) → detail levels (DL) → reuse and
   performance (R). STYLE and SITE items are reported, not fixed in the record. A fix that belongs in a rule, a kit
   or a block is made there (promotion), not in this mechanism's polish. Everything that is not global and not
   deferred with a reason gets fixed.
7. **Verify** (section 10): every tool clean, screenshots in the named views, the section and detail views the record
   declares, and full explode in both sheets, bench run.
8. **Record.** Regenerate the audit (the tool keeps judged rows), finish it, set the header and the `teaching:` line.
   List promotion candidates and the polish's exceptions with their reasons (R7). Before and after shots go in the
   pull request, not in the audit.

---

## 2. Record and page content (P)

Source of truth for facts: the master catalogue (`data/catalog`, schema and vocabularies in
`data/catalog/record-spec.md`). A mechanism in the code is a folder; its prose, tags, references and media come
from the catalogue entry with the same id.

| Id | Requirement | Tier | Verify |
|---|---|---|---|
| P1 | The catalogue has a complete **record v3** for the id: `name, aka, family, level, summary, motion, ratio, dof, topology, backdrivable, tags, explain {motion, forces, benefits, limits}, build, kin, teaching, examples, references, media`, and `real_world` (YouTube videos of real footage; may be empty). The folder has `audit.md`, and `polish.ts` only where the mechanism has true exceptions to the rules (R7). | DATA | `tools/check <id>` prints no `MISSING` |
| P2 | Facets use the controlled vocabularies of the record spec, exact spelling. | DATA | catalogue validator |
| P3 | **At a glance:** ratio (kind, class, typical), axis relation, output character, backdrivable, other names, plus family, motion, level, dof, and the drive (motorised or hand operated, section 8). | DATA / SITE | page |
| P4 | **Tags grouped** into Function, Property and Application, keywords underneath. | DATA | page |
| P5 | **Explanation:** how it moves, forces, benefits, limits; then where you'll find it: 2 to 4 real-world uses, each with one line. | DATA | page |
| P6 | **Links:** references (Wikipedia plus at least one hard source) and photos and video (at least one video of the real thing, one photo page). In the real world: YouTube videos of real products or machines at work, never animations or renders; none rather than a wrong one. Only URLs that were actually found. | DATA | page |
| P7 | The page reads the catalogue by id at build time. No prose in `polish.ts`; the page's prose and the teaching labels come from the record. | SITE / HAND | lint: no text fields in polishes |
| P8 | **Not on the page:** no parts list, no "how it is built" section, no joint sections. | SITE | page |
| P9 | Explanation text matches what the code does (dwell, ratio, swing, stroke). The numbers it states are `teaching.claims`, checked by T9. | AUTO check / HAND | claim table; read `explain` against `solve()` and the plot |
| P10 | Overlays are meaningful for this mechanism: teaching traces (T4), `vel`, `forces`, `angles`, construction overlays (T5), and a `plot` of output against input (or the plot the record names, such as speed ratio or several settings). | HAND | screenshots with overlays |
| P11 | Prose: plain language, short sentences, no em dashes, mm and degrees. | DATA | read |
| P12 | **Record v3 validates.** The `kin` block (bodies, joints with 3D axes, drivers, branch, points, outputs, design, ranges) and the `teaching` block (principle, traces, overlays, views, controls, time map, claims, exceptions) pass the schema and the cross-checks of the record spec: every joint's bodies exist, every point a trace or overlay names exists, every control maps to a driver or a design parameter. | DATA / AUTO (validator) | catalogue validator |
| P13 | **The unbuilt and the late get the teaching review first.** A mechanism not yet built, and one that landed after the original review, passes the review of T2 against its record, with its decisions written into the record, before it is built or rebuilt. | HAND | `teaching:` line of the audit |

Joint notes, badges and build rules (A16) are still written, as part of the polish's reasons or the audit: they are the
engineering record the audit reads and they explain the build to whoever works on it next. They are not shown on the page.

---

## 3. Kinematic model (K)

The kinematics are the truth. Everything else is built around them and may never change them. In 3.0 they are not
hand-written: they are the record's `kin` block (bodies, joints, drivers, branch, points, outputs, design, ranges)
composed from a library of closed-form blocks, with a numeric fallback and a generic verifier.

| Block | Solves | Typical users |
|---|---|---|
| dyad | Two links closing on a point (circle-circle intersection, branch chosen) | four-bar and every planar linkage built of dyads |
| slider dyad | A link and a slide closing on a point | slider-crank, trammel, Scott Russell |
| gear mesh | Two bodies on parallel or crossed axes: ratio, phase, centre distance, hand | spur, helical, bevel, hypoid, worm, crossed helical, rack |
| Willis train | Sun, ring, planets and carrier with several inputs and a selector | planetary, Ravigneaux, differential, sun-and-planet |
| Hooke | Cardan joint: output angle from input angle and bend | universal joint, double Cardan |
| homokinetic | Constant-velocity joint: the bisecting plane | Rzeppa |
| Bennett | Overconstrained spatial four-bar, closed form | Bennett linkage |
| cam | Follower from a motion law (rise, dwell, return, dwell) and the cam's profile, with the pressure angle | cams, barrel cam, face-groove cam, desmodromic |
| screw | Helical pair: turn and advance at the lead, ball or lead | lead screw, ball screw, differential screw |
| convey | Small rigid solids carried along a closed path by a travel | chain, belt teeth |
| flexure | Pseudo-rigid-body model of a neck or a guided beam, with its bend state | flexure hinge, bistable compliant, harmonic drive |
| escapement | Time-stepped engagement of a wheel and a pallet or fork, with drop and recoil | anchor, lever, verge |

A block is added to the library only when no existing block, and no composition of them, solves the mechanism (K3).

| Id | Requirement | Tier | Verify |
|---|---|---|---|
| K1 | **Kinematics exact, and verified.** Pin centres, link lengths, slot widths, gear meshes, cam and locking profiles come from the blocks. A generic loop-closure solver runs at build time on every model and its **residual** (the K1 residual) stays within the tolerance in `src/core`. The solver verifies; it never drives `solve(u)`. Styling, hardware and detail never alter a working surface or a centre. | AUTO | `tools/check`: residual in the report |
| K2 | `solve(u)`: u is 0..2π per cycle, continuous, periodic, finite. Oscillating drivers use `osc(lo, hi)(u)`. At the default controls the cycle repeats: no control sweeps by itself (T14). | AUTO check | `tools/check`: no NaN, periodicity none, no `POSE JUMP` |
| K3 | **Kinematics only from `kin`.** Bodies, joints and drivers composed from the block library. A loop that does not decompose uses the numeric fallback, continuing from the previous pose; the audit names it, and K1 checks it like any other. A mechanism that needs a joint or block the library lacks adds it to the library with a fixture (promotion), never as a one-off model. | AUTO / HAND | audit lists block per joint |
| K4 | Roles `driver, link, output, ground, pin, trace`. The input shaft's body carries `accent: true`, the only colour accent in the drawing. | HAND | code |
| K6 | Dimensions and defining relations agree with the record's `build.defining_relations` and `kin.design` (Geneva c = r / sin(π/n), Grashof, Hoekens ratios); where the record deliberately differs, its note says so. | DATA | compare |
| K7 | **Input kind declared** for each driver: `"rotary" | "oscillating" | "linear" | "manual"`, with the driven body named. The drive rule (section 8) and the stop rule (F5) read it. | DATA | validator |
| K8 | **Joints are declared, never inferred.** Every joint in `kin` names its type (revolute, prismatic, cylindrical, screw, gear mesh, pin-in-slot, cam contact, belt, spherical, universal ...), the two bodies, and its origin and axis in 3D, with limits where it has them. Classification (A1) reads these and nothing else. The catalogue's old `build.joints` list is retired. | AUTO (validator) / DATA | record validator |
| K9 | **Drivers.** A mechanism has one or several drivers (a differential, a ball-disc integrator), each with a range and a default; a **selector** for discrete settings (a Ravigneaux gear, a Walschaerts die position class); and optionally a **time map** (T13). Every driver is a control (T14). | DATA | validator |
| K10 | **Branch and design choices declared.** The assembly branch (which side a dyad closes) and the design choices (tooth counts, which arrangement) are in the record, with parameter ranges. The solved branch is continuous over the cycle; a branch flip is a `POSE JUMP`. | AUTO check / DATA | `tools/check` |
| K11 | **Mobility accounted.** The mobility counted from `kin` equals the record's `dof`; an overconstrained mechanism (parallelogram, Sarrus, Bennett) says so and is solved in closed form. | AUTO | `tools/check` |
| K12 | **Named points and outputs.** Every point a trace, overlay, plot or dimension refers to is named in `kin.points`; every quantity read off (slider position, output angle, tip path) is in `kin.outputs`. Nothing downstream recomputes geometry. | DATA | validator |

---

## 3a. Teaching (T)

What turns a correct mechanism into one that teaches. These are judged in the pass of section 1 (steps 2 and 5), and
recorded in the record's `teaching` block so the text, the parameters and the drawing cannot drift apart.

| Id | Requirement | Tier | Verify |
|---|---|---|---|
| T1 | **The teaching test.** The motion and the mechanism must be easy to understand and good for teaching the principle: mechanics first, with no real-world usage context (the Walschaerts gear without the locomotive). How textbooks, 507 Mechanisms and common animations show it is a reference to compare against, **not a requirement**: artistic interpretation is welcome when the principle reads at least as well. It is a review judgement, never a hard check. | HAND | the review of T2 |
| T2 | **A teaching review runs in every conformance pass**, before the build and again on the finished drawing, with a verdict of keep, tweak or rethink and every decision written into the record. The method: six phases drawn from the solved motion, the solve checks (strokes, ratios, dwell, straightness), and the text read against the motion (T9). Mechanisms that landed after the original review, and every later one, get the same method. | HAND | `teaching:` line of the audit |
| T3 | **Principle parts are declared.** The record's `teaching.principle` lists the bodies and points that carry the principle. They are drawn on top, whole and in depth order, whatever hardware surrounds them (T10 to T12). | DATA | validator |
| T4 | **Teaching traces** show the phenomenon: the point whose path is the principle (the cycloid of a planet point, both ends of a coupler, both crank circles, the full figure eight), with ticks at equal time where the speed variation is the lesson, and ghost paths for settings the viewer does not have selected. The first trace gets the comet. A wrong point traced is a teaching defect. | DATA | review |
| T5 | **Construction overlays** carry the geometry a textbook figure draws as construction: dead-centre lines, tangent lines, axis lines meeting at a turning centre, moment-arm dimensions, the chord that splits cut and return, a workspace outline, the line O–E of an eccentric. Each is a labelled element of `teaching.overlays` with the points it joins, drawn by the overlay rules (SD22 of the style reference). | DATA | review |
| T6 | **The effect is large enough to see.** Parameters are chosen so the lesson is visible at the default size (a time ratio that differs from the plain slider-crank, a cam with real dwells, lobes deep enough that the wobble reads). Where the review changes a parameter, the change is made in the record and noted there. | DATA / HAND | six phases |
| T7 | **A default named view** is declared for each mechanism (PLAN, FRONT, SIDE, ISOMETRIC, DIMETRIC, AUX ⟂ a joint, or VIEW az/el) and it is the one the principle reads in (a valve gear in front elevation, a worm down its axis). The site opens in it; the shot set always includes it. | DATA | `tools/shot` |
| T8 | **Section and detail views** are declared where a principle lives inside a part or between small parts: a section through a port face or a nut, a detail of a sector. Each is a named entry of `teaching.views`, with its cut plane or window, and highlights the part that matters (the open port, the loaded rocker, the load-carrying groove wall). | DATA | `tools/shot` |
| T9 | **The text matches the motion.** Every number the explanation states (stroke, ratio, swing, time ratio, dwell, tip-speed variation, phase lag, range) is listed in `teaching.claims` with the output it comes from and a tolerance, and checked against `solve()` at build time. | AUTO check / DATA | `tools/check`: claim table |
| T10 | **Principle visibility, first: transparency.** Any static solid that covers a principle part in the current view is drawn see-through, automatically, at the view being drawn: not only for a mesh's pitch point or a slot's run (L5) but for every principle part. | AUTO | audit lists solids drawn see-through per view |
| T11 | **Principle visibility, second: supports are moved.** The support router (A19) places posts, bridges, hangers and plates outside the principle's swept volume when it can. | AUTO | audit lists supports moved |
| T12 | **Posts and plates are never removed** to uncover the principle. A different construction (a fork end, a part drawn underneath) is allowed only in rare, individual cases, decided in that mechanism's issue and recorded in `teaching.exceptions` with its reason. | HAND | audit: solid count of support parts unchanged |
| T13 | **A time map** re-parametrises playback near a feature that would otherwise go by in a blink (an escapement's engagement, a snap). It changes the speed of the animation only, never the kinematics (K1) or the swing, and the plot's horizontal axis stays the true input. | DATA | `teaching.timeMap`, shots |
| T14 | **Controls.** Every driver, selector and design parameter the lesson turns on is a declared control with range and default (a die position, a gear selector, a bend angle, the offset). A control never sweeps by itself: at fixed controls the cycle repeats (K2). Ghost traces show the settings that are not selected. | DATA / HAND | `teaching.controls` |
| T15 | **Mechanics first.** The record's teaching strings (labels, trace names, overlay captions) state the mechanism, never its use. Real-world context lives only in `examples` and `real_world`. | HAND | read |
| T16 | **Same-role parts are told apart by pattern and stacking, never by hue** (the Schmidt coupling's two link sets): a role pattern variant or an index mark, not a colour. | STYLE / HAND | theme switch |
| T17 | **Principle parts are never drawn out of depth order.** No effect that favours them may break the depth buffer (SD1 of the style reference): visibility comes from T10 to T12, never from a depth bias. | AUTO | renderer test |

---

## 4. Part design language (D)

Minimal, monochrome industrial design: parts that look as if a careful company designed and sold them. One family of
forms, reused everywhere.

| Id | Requirement | Tier | Verify |
|---|---|---|---|
| D1 | **One element, one form, everywhere.** Link: tapered stadium sized to its bearings, engraved boss rings. Pivot: flush cap, ground larger. Slider and rail: link profile with square ends on two thin stadium rails. Slot link: stadium slot with walls as wide as the end radius. Gear: true involute teeth, plain web or hub and arms, keyed bore. Cam: profile with one engraved base circle, roller follower. Base plate: squircle slab, paths engraved, corner holes. A tapered link is a profile with boss radii, so the rules and the checks see its real outline. | HAND | screenshot against other mechanisms |
| D2 | Shapes follow load: material where the load runs, bosses round every pin, lightening windows only on big plates and inertia-critical parts. | HAND | review |
| D3 | Roles told apart by surface pattern and tone, never hue. | STYLE | theme switch |
| D4 | Consistent radii: base-plate corners from the form style; feet and corner standoffs concentric with the corner arcs. | AUTO | screenshot |
| D5 | **Solid, designed mounts** over scattered standoffs: one bracket, bridge or post pair, shaped as a part. | HAND (shape) / AUTO (`H.bridge`) | review |
| D6 | **Nothing cosmetic distracts.** Supporting elements read quieter than the mechanism but stay clearly visible. | HAND + STYLE | screenshots |
| D8 | **A part is a profile, an operation and a 3D frame.** Its outline (the profile, with its holes) is swept by one operation: **extrude** (a plate, a link, a rail), **revolve** (a shaft, a disc on edge, a cone), **sweep** (a helix, a thread, a rope groove, a chain path), or **loft** (a bevel or hypoid tooth, a tapered form), with a taper or twist where the operation allows. The 3D frame places the part: its origin and axes in the base's coordinates, fixed, or posed each phase by a solved body or frame. A part on an x or y axis, or on none (a universal joint's cross, a swash plate, a Rzeppa cage), is simply a part whose frame says so; no axis flag, no plane. Holes and grooves are subtractions; the solid is built by Manifold in Node at build time, watertight, with hole walls tagged. Layers, `dz` and `twin` do not exist. | AUTO (the builders, `tools/check` reports `SOLID`) / HAND (which operation a part needs) | `tools/check` |
| D9 | **Members that change shape**, cheapest first: a **stretched** solid between two solved points, its profile given at unit length (a rope span, a spring); **conveyed** small rigid solids carried along a fixed closed path by a solved travel (chain rollers and links, belt teeth); a **deforming** profile regenerated each frame from the solved state, with the same point count per ring and its holes deforming with it (a flexspline, a CVT's V-belt band), extruded or revolved only, never boolean, for a few solids only. A flexure's neck is drawn rigid; its bend and stress zone are a `bend` overlay of the flexure block. | AUTO (the placements; the bench counts deforming solids) / HAND (which a mechanism needs) | screenshot, bench |
| D10 | **Geometry is shipped by operation.** Package v2 carries the **profile and operation** for a plain extrusion or revolution (the browser turns it into triangles) and a **mesh** only for a boolean result (a bored gear, a grooved cylinder), quantised to 1/64 mm. A part that could be a profile is never shipped as a mesh. | AUTO | `tools/package`: sizes per kind |
| D11 | **Solids are sound.** Every solid is a closed manifold of non-zero volume, every hole wall belongs to its hole, no part is a zero-thickness sheet. | AUTO check | `tools/check`: `SOLID` |
| D7 | **The big parts stay plain.** Bars, plates, wheels, brackets and the base carry only load-driven shape (D2) and manufacturing evidence (section 7). All richness is in what makes the mechanism move and hold: shafts, bearings, clips, spacers, keys, screws, nuts, springs, stops, adjusters, oilers, marks, sensors. | HAND | review |

---

## 5. Assembly: how it is built (A)

Every mechanism is drawn as the bench assembly it would really be. The hardware builder makes it: a **joint kit** per
joint type, one **axial stack builder** that works along any joint axis with a **support selector**, a **support
router** and a **placement solver**. Three stages: the builder and the rules, the polish (true exceptions only), the
fasteners; then the rigid explode pass.

### 5.1 Stage 1: the rules (AUTO)

The builder reads the record's declared joints (K8) once, with the solved sweeps, and builds every joint from its kit
(section 5b): the axial stack along the joint's axis, its supports chosen and routed against the real swept volumes,
every position set by the placement solver. Then the base, standoffs, feet, lubrication, timing marks, materials and
the drive. Nothing is inferred from overlapping outlines.

| Id | Rule | Tier |
|---|---|---|
| A1 | Every joint is **read from the record** (K8) and classified by type (J1 to J13): fixed or moving pin, keyed or bored part, slot (closed, or open at the rim), slide, mesh (parallel or crossed), cam contact, belt, screw, flexible member, compliant joint, on any 3D axis. Slots and intermittent contacts are found over the whole cycle, and over as many cycles as an indexing part takes to come round. The canonical build of that type, its kit, is generated in full. | AUTO |
| A2 | A fixed revolute that drives (the accent input, or one with a keyed part) is a **live shaft** (J2); any other fixed revolute is a **dead axle** (J1); a moving revolute is a **shoulder bolt** joint (J3); a pin in a slot carries a **track roller** (J4); a prismatic pair carries a **slide** (J5); meshing gears get **mesh hardware** (J6); a cam gets its **follower train** (J7); a declared flexible member gets **J12** and a compliant joint **J13**. A fixed revolute whose axis lies in the base plane is a **shaft in plan** (J10), live or dead; a crossed-axis mesh gets **J9** and a screw **J11**. A moving joint on any axis is built in its own frame like any J3 or J4. | AUTO |
| A3 | **Catalogue sizing:** bore = largest catalogue bore every boss on the joint can take; each part gets the largest bearing its boss fits with a 1.2 mm wall, else a bronze bushing; gaps get inner-race spacers. | AUTO |
| A4 | **Shafts are stepped profiles** (`H.shaft`): shoulders at every seat, circlip grooves, set-screw flats, thread with undercut, chamfered ends, wrench flats where tightened without a head, centre holes on turned ends. | AUTO |
| A5 | **Keys by shaft size:** D-flat to Ø8; feather key and keyway above Ø8; taper pin on cross-pinned small parts. Every keyed part gets the matching bore. | AUTO |
| A6 | Fixed plates floating above the base sit on Ø10 **standoffs**, screwed from both sides; **spigoted** when the plate holds a bearing. A slide rail sits on the base on a **ground steel riser** along its straight run, split into pads on the free runs where a moving part passes under the rail; a countersunk screw at each fixing, near each end of a riser and at most 100 mm apart, down through rail and riser into the base; the reference rail of the slide dowelled by its end screws (F1). | AUTO |
| A7 | **Base plate** 8 mm thick, 2 mm under the lowest part, four counterbored mounting holes on the corner-arc centres, rubber feet unless a housing hangs there, traced paths engraved, 5 mm engraved scale along the front edge, a clearance hole for every live shaft. | AUTO |
| A8 | **Stage 3 fasteners** (after the polish): every head gets its threaded shank from `thread` (never along a shoulder), including heads seated over a pre-drilled hole or in a counterbore; every plate a shank passes gets a clearance hole, tapped where it ends; blind tapped holes are marks, not through holes; two screws meeting in a standoff stop short of the middle. | AUTO |

The rules run in registry order (`src/rules/registry.ts`). Which rule or stage serves which AUTO requirement,
generated from `autoTable()` by `tools/standard-table.ts`:

<!-- auto-table:start (generated, do not edit) -->
| Rule or stage | Serves |
|---|---|
| `classify` | A1, A2, A3 |
| `placement` | A10, A18 |
| `base` | A7, D4, M4 |
| `j6-mesh` | J6, F7, F9 |
| `j9-crossed-mesh` | J9, F4, F7, F9 |
| `j3-moving-pin` | J3, A12, M3 |
| `j2-live-shaft` | J2, A5, F1, F2, F3, F4 |
| `j10-shaft-in-plan` | J10, A5, F1, F2, F3, F4 |
| `cross-bearings` | J3, F2, F8 |
| `trunnion` | J1, F2, F4, F6 |
| `piston-bore` | J5, M14 |
| `j4-slot-roller` | J4, M14 |
| `pin-lobe` | J4, M14 |
| `groove-cam` | J7, M14 |
| `j5-slide` | J5, F5, F7, A6 |
| `j7-cam` | J7, F6 |
| `pallet-contact` | J7, F6, M14 |
| `fork-pin` | J4, F2 |
| `pawl-tooth` | J7, F6, F5 |
| `tongue-slot` | J5, F8, M14 |
| `ring-hub` | J3, F2 |
| `ring-rollers` | J6, F2 |
| `j8-belt` | J8, V4 |
| `j12-flexible` | J12, J8, A11, F2, F3, F6, F7, F8, F10 |
| `strap-sheave` | J12, F1, F2, A11 |
| `j11-screw` | J11, F3, F8 |
| `j13-compliant` | J13, A6, F1, F2, F5 |
| `j1-dead-axle` | J1, A4, A11, M8, M9, M11 |
| `stops` | F5, A22 |
| `drive` | V1, V2, V3, V5, V6, F10 |
| `adjustable-length` | F7, A22 |
| `cable-clip` | A22, V6 |
| `standoffs` | A6 |
| `feet` | A7, D4 |
| `lubrication` | F8 |
| `timing-marks` | F9 |
| `trace-marks` | T4, L8 |
| `locking` | M13 |
| `materials` | M10 |
| `fasteners` | A8, M4 |
| `headroom` | A13 |
| `see-through` | L5, T10, T11, T12 |
| `explode` | E1, E2, E3, E5, E6, E7, E8, E10 |
| `axial stack builder` | A20, A12, A3, A4, A5 |
| `support router` | A14, A19, T11, T12 |
| `placement solver` | A10, A18, A9 |
| `hardware primitives` | A13, M1, M3, M5, M11, R3 |
| `checks (clearance, clamp, edge distance)` | A15, M6 |
<!-- auto-table:end -->

### 5.2 Stage 2: hand polish (HAND, mandatory for every mechanism)

The rules know nothing about loads or sweeps. The polish (`polish.ts`, API `A` and `H`) states only what differs
from the generated assembly: overrides, variant choices, additions, notes. It never re-describes a joint. It must
meet:

| Id | Requirement | Tier | Verify |
|---|---|---|---|
| A9 | **Double shear wherever the sweeps allow** (clevis pairs, a bridge over a ground pivot, a fork end). Single shear only where a part sweeps over the joint, then with the shortest overhang (1 to 1.5 mm) and two bearings far apart. A clevis is chosen by the kit where the sweeps allow, its axial positions set by the placement solver (A18); a live gear shaft, or a live shaft carrying a pulley or sprocket of a declared chain or belt, with nothing over it is straddle mounted by the rules. | HAND (choice) / AUTO (clevis, plating, straddle J2) | joint note + badge |
| A10 | **Balanced stack:** parts whose sweeps never meet share one plane; nothing is stacked only to clear something. | HAND | side view |
| A11 | **Load path closed:** for every joint you can say where its load goes to ground (bolt → bearing → housing → base). Both ends of a dead axle held. Every housing and bridge screwed and dowelled. | HAND (choice) / AUTO (parts) | joint note |
| A12 | **Bearings clamped through inner-race spacers**, so tightening never squeezes a moving part. A rotating stack never touches a ground face. | AUTO (spacers) / AUTO check | `tools/check` clamp check |
| A13 | **Named hardware** with real catalogue sizes ("Shoulder bolt Ø6 x 15, M5", "Bearing 6900-2RS (10x22x6)") and materials (M10). | AUTO (defaults) / HAND (variants) | names in the solid list |
| A14 | **Sweep clearance:** posts, standoffs, brackets, stops, sensors and every added detail clear of every moving part's swept volume (not its swept outline); state the margin in the note. The support router (A19) does this by construction; a detail added by hand is checked by A15. | AUTO (router) / HAND (details) | `tools/clearance` |
| A15 | **Zero clashes in true 3D** over the full cycle. Pairs are intersected with Manifold over sampled phases after a world-box filter, and judged by **penetration depth** (2 × volume ÷ area) against a 0.1 mm tolerance, so a shaft in its own faceted bore is not a clash. A hand `allow` exemption names the pair and its reason, and is flagged **unnecessary** when the pair does not overlap in 3D at any phase. | AUTO check | `tools/clearance <id>` = 0, no unnecessary `allow` |
| A16 | **Engineering record:** a joint note for every joint saying why it is built that way, a badge (`["double shear","ok"]`, `["single shear","warn"]`, `["both ends held","ok"]`), and 3 to 5 build rules specific to this mechanism. Not on the page (P8). | HAND | code |
| A17 | **Assemblable and serviceable:** there is an order in which it goes together; every fastener can be reached by a tool when assembled; every pressed bearing can be pulled; nothing is trapped. | HAND | walk the explode |
| A18 | **The placement solver sets every axial position.** Along each joint axis it orders the parts of the stack by their swept volumes (parts whose sweeps never meet share one plane, A10), sizes the gaps for the hardware (washers, spacers, bearings), and places clevis halves and plating. There are no layers, no `dz`, no `twin`, and no search for them. | AUTO | audit: stack per joint |
| A19 | **The support router** places posts, standoffs, bridges, hangers and plates against the real swept volumes (Manifold hull of sampled poses, then minimum gap), keeping them outside the swept volume of the principle parts (T3) when it can, and at least the clearance of A14 from every other moving part. What it cannot move is drawn see-through by T10; it is never removed (T12). | AUTO | audit: supports routed, moved, see-through |
| A20 | **One axial stack builder, with a support selector.** The stack along any axis (bearing, spacer, retainer, thrust washer, hub, key) is one builder; the selector chooses housing (J2), pillow block (J10) or bridge (J1) from where the sweeps leave room and what the load needs. | AUTO | audit: support per joint |
| A21 | **One kit per joint type.** A kit holds the joint's kinematic block, its hardware rule, its explode axis, its see-through zone and its detail rungs. A joint type that appears in a record without a kit gets a new kit (promotion), not hand hardware. | AUTO | audit: kit per joint |
| A22 | **Recurring hand fixes are rules.** Rocker stops and swing scale, adjustable length, one hub per keyed gear, and the cable clip are generated by the builder, not placed by hand. A fix that recurs in three mechanisms is promoted to a rule or kit. | AUTO | promotion candidates |

### 5a. Explode (E)

The explode view pulls the assembly apart **along each stack's joint axis**, in the order a fitter would take it apart,
every part whole, every screw out of its hole as one piece, with a trail line from each part to its place. Explode is
encoded per solid as a stack level and an axis; the renderer moves a level by a fixed gap along that axis at full
explode. Stacks on different axes (a bevel pair, a worm and its wheel) explode in their own directions.

| Id | Requirement | Tier | Verify |
|---|---|---|---|
| E1 | **Nothing stretches.** Every solid is rigid: one explode level. Shafts, bolts, axles, shanks and standoffs included. | AUTO | explode at 100%: no part longer than at 0% |
| E2 | **A fastener is one body.** Head, shank, the washer under the head and the nut on the far end move together. | AUTO | each head stays on its shank |
| E3 | **Screws back out the way they went in**, along their axis, to the head side, half a level clear of the topmost part they pass. A nut goes the opposite way. | AUTO | explode |
| E4 | **Reverse assembly order:** the last part fitted goes furthest; a bridge and its screws come off before the parts they clamp. | HAND (levels follow A17) | walk the explode |
| E5 | **Pressed and bonded parts stay put:** bearings, bushings, dowels, inserts, circlips and wear strips move with the part they sit in; track rollers stay on their stud. | AUTO | explode |
| E6 | **Bought units stay whole:** motor, bearing, track roller, sensor, pulley pair. Motor and bracket move as one; the belt stays in the pulley plane. | AUTO | explode |
| E7 | **Loose spacers and washers sit midway** between the parts they separate. | AUTO | explode |
| E8 | **Keyed parts on one shaft keep their order**; the shaft leaves to the side it was fitted from. | AUTO | explode |
| E9 | **Readable at full explode:** nothing inside another part, labels attached, nothing leaves the frame. | HAND | screenshots at 100% in ISOMETRIC and the default view |
| E10 | **Explode axes and trails.** Each stack carries its joint axis; a part moves only along it; a trail line joins every part to its assembled position. | AUTO | explode |

### 5b. Joint-type catalogue (J)

The canonical full build per joint kind, which is the hardware rule of that joint type's kit (A21). The kits generate it; the polish picks variants (open or sealed, key or
D-flat, clevis or single, which side the bridge goes) and overrides what the sweeps forbid. A joint is not done until
every line of its row exists or is marked N/A with a reason in the audit.

| Id | Joint kind | Canonical build |
|---|---|---|
| J1 | **Ground revolute, dead axle** | Shouldered axle (A4); a bearing in every turning part; inner-race spacers; circlip or retainer plate on both sides of each bearing (F2); thrust washer against the base (F4); bridge over the top on spigoted posts, dowelled (F1); axle through the base to a washer and nyloc, or threaded with an undercut where the base is thick enough (M9); oil sink on the bridge over an open bearing (F8). |
| J2 | **Ground revolute, live shaft** | Housing cartridge behind the base: two bearings, spacer sleeve, wave-washer preload, circlips, shield or seal (F2, F4); housing screwed and dowelled to the base (F1, A11); keyed shaft (A5) with pulley on a hub with two set screws at 90° or a clamp hub (F3); end retainer on the shaft end (F2); thrust washer under the first part (F4); home flag on the pulley or shaft (F10); clearance hole in the base (A7). A gear shaft with nothing sweeping over it is straddle mounted, in a parallel mesh or a crossed one (J9): a bridge over the shafts of the mesh, its box clear of the swept box of any part on an axis in plan, a floating flanged bearing in it per shaft, the backlash eccentric at the top as well as the bottom (A9, F7). A shaft carrying a pulley or sprocket of a declared chain, belt or CVT is straddle mounted the same way, in a bridge of its own (one bridge over both would span the loop), since the member pulls it sideways (A9). |
| J3 | **Moving revolute** (pin between links) | Shoulder bolt threaded into the lowest part, bearing in every other part, inner-race spacers, threadlocker or nyloc (M13), clevis where the sweeps allow (A9), bore chamfers (M3). |
| J4 | **Pin in slot** | Track roller on a stud; hardened wear strips screwed into the walls of every slot the roller runs in (M14); felt oiler per slot, in the relieved end where the roller leaves room (F8); relief at the slot ends. |
| J5 | **Prismatic slide** | A few blocks. One rail is the plain reference, dowelled (F1); on the other a bronze gib bears on the slider's side and a keeper plate over it laps the slider (F2); the gib is slotted, set across against the slider and clamped by the keeper's screws, which are the rail's own fixing screws, down through keeper, gib, rail and riser (F7, A6, M13). A felt wiper at each end of the slider, a grease nipple on the keeper (F8); one end stop block with a neoprene pad just past each end of the travel (F5). No separate shim, gib adjusting screws or lock nuts. |
| J6 | **Gear mesh** | Hubs with key or D-flat and set screw (F3); eccentric bushing with flange, arc slots and clamp screws on one shaft for backlash (F7); timing marks at the mesh (F9); thrust washers and retaining rings on each shaft (F2, F4). |
| J7 | **Cam contact** | Roller follower on a stud; return spring with seat, guide and preload screw, or form closure (F6); follower guide bushing with circlip (F2); anti-rotation key on flat followers (F3); felt oiler on the track (F8); zero line (F9); hardened cam (M10). |
| J8 | **Belt** | Flanged small pulley (F10); slotted mount for tension (F7); idler on a slotted arm where the wrap is short; belt guard only if see-through. A timing belt declared in `flexible` is built by J12 and recorded as J8. |
| J9 | **Crossed-axis mesh** (bevel, hypoid, worm, crossed helical; declared in `meshes`) | Each gear keyed on its shaft (J2 or J10) and located on it (F2); a shim pack at its back face sets its mounting distance, and so the backlash and the contact pattern (F7); a bronze thrust washer wherever the mesh pushes along a shaft: toward a bevel or hypoid gear's back face (away from the apex), both ways on a worm and on crossed helical gears (F4), the shaft's own spacer under the gear stopping at it; timing marks at the mesh (F9). Pitch cones, the back-cone teeth (Tredgold), lead and lead angle from `src/core/spatial.ts`. |
| J10 | **Shaft in plan** (a fixed pin on an x or y axis) | Two pillow blocks on the base past either end of what the shaft carries, or both behind it where something sweeps past its far end, far apart (A9): a cast housing on the shaft's axis on a foot plate, two screws down into the base and two dowels (F1, A11). Live: a sealed bearing in each block, located in the nearer by two shaft collars against its inner race, floating in the other (F2, F4); keyed parts as J2 (A5, F3). Dead: the shaft clamped in both blocks by set screws, every part on its own bearing (F2). A part overhung on a live shaft's free end is held there by a washer and a countersunk screw into the shaft end (F2). The base drops under the shaft until its blocks fit, and grows under a block that stands past it (base growth). A hand-turned input takes a handwheel on the free shaft end, a motor-driven one its pulley (V5). |
| J12 | **Flexible member** (extends J8; declared in `flexible`) | Timing belt (recorded as J8): HTD timing pulleys (`P.pulley`), the centre distance for a whole number of teeth; its back a fixed band round the pitch path, on no posts; its teeth conveyed round the pulleys by the solved travel (D9); flanges on the small pulley (F10); a flat flanged idler on the belt's back takes up the stretch (F7, F10); dry (no F8). Chain: ISO 606 sprockets (`P.sprocket`); rollers and inner and outer link plates conveyed round the sprockets by the solved travel (D9) on a path exactly a whole number of pitches long; the centre distance for a whole number of links; an idler sprocket of a whole number of teeth outside the chain, its pitch circle on the rollers' line and its seats phased to them, turning at one tooth per pitch of travel, takes up the stretch (F7); greased (F8). Chain and belt: the idler on the slack span near the small wheel, on a sealed bearing on a stud through an arm slotted across the span and clamped on two posts (F7). Rope: its spans stretched between the sheaves (D9), its wraps fixed arcs in the sheaves' grooves (`P.ropeSpan`, `P.ropeWrap`); the dead end on a becket with a thimble, its pin in a post screwed to the base (F1, F2, A11); the hook on a swivel (F3); becket and hook at their own sheaves' heights; a guard over each sheave whose centre stands still keeps the rope in its groove (F2); the note counts the parts that carry the load. CVT (`{ form: "cvt", pairs: [{ fixed, sliding, spring? }], belt }`): per shaft a fixed sheave half on the live shaft and a sliding half posed by a frame that slides along it; each sliding half on a feather key sized from the shaft (DIN 6885), or on the shaft's D-flat to Ø8, its shaft's spacers cut short of its travel and the shaft run on past it (F3); where the pair asks, a compression spring round the shaft from the half's back to a seat collar fixed on the shaft, its length following the half (F6, F2); the belt runs in the grooves by design. |
| J13 | **Compliant joint** (declared in `compliant`) | The neck drawn rigid, its bend and stress zone by the model's `bend` overlay; the neck one piece with its block and its lever (no clash, no overlap between them); a hardened stop pin each side so the neck never leaves its elastic range (F5): on the lever's edge at 70 % of its reach, a fifth of the half swing past each end, or, for a body that moves without turning (a shuttle guided between necks), at each end of its solved travel, past its end face by a fifth of the half travel; the blank's ground block on a ground seat plate of its own outline, never on posts, and nothing through a neck (A6); clamped to the base under a plate, two screws and two dowels reamed through block, clamp plate and seat (F1, F2); the blank one material (M10). |
| J11 | **Screw** (lead or ball; declared in `screws`) | The screw on its shaft in plan (J10: one end located, one floating, F2, F4); its thread drawn by its helix at the lead; the nut a block on the carriage: a flanged bronze nut, or a preloaded ball nut with its ball return and a wiper at each end (F8); the flange screwed to the carriage; anti-rotation from the carriage's slide (J5) or a key in a guide slot (F3). |

---

## 6. Functional completeness (F)

What turns a correct assembly into a believable machine. Every joint and every part is run through the ten
functions. This section replaces the earlier "detail budget": there is no cap on functional detail, only a floor on
readability.

### 6.0 Complete, then readable

A joint is **complete** when the assembly would really work:

- every bearing is retained axially on both sides, and either located or preloaded;
- every rotating part is located, keyed and retained;
- every fastener has its thread engagement (M9) and a locking method (M13);
- every sliding pair has its guide, keeper, wipers and lubrication;
- every adjustable fit has its adjuster and its clamp;
- every phase has its mark;
- every motorised input has its sensor and its cable.

A detail is **admitted** only if it passes all four: (1) function: you can finish "without it, ___ would happen" with a
physical consequence; (2) kinematics untouched (K1); (3) zero clashes (A15); (4) readable at our scale: a feature under
about 1 mm on screen with no outline of its own becomes one mark or nothing.

**Excluded on sight**, even though watches have them: Côtes de Genève, perlage, decorative anglage, blued screws as
colour, sunburst finishes, engraved names or logos, skeletonising for looks.

Every admitted solid carries a **detail level** (section 9b) so the drawing can be scaled on slow devices without
changing what the mechanism is.

### 6.1 The ten functions

| Id | Function | Watch analogue | Our hardware | Applies when | Tier |
|---|---|---|---|---|---|
| F1 | **Locate** a part so it goes back in the same place | Bridge steady pins | 2 dowels per removable plate (one round hole, one slot), spigots, shaft shoulders | Any removable plate that carries a bearing (bridges, housings, brackets) | AUTO (J1, J2, A6) |
| F2 | **Retain axially** | Screwed chatons, cap jewels | External circlip on shafts, internal circlip or shoulder + retainer plate in bores, E-clips on small pins, shaft collars, end retainers | Every bearing; every part on a shaft that is not clamped | AUTO (J1 to J7) |
| F3 | **Transmit torque** | Squared arbors, cannon pinion | D-flat, feather key, clamp hub, set screw on a flat, taper or shear pin | Every keyed part | AUTO (A5) |
| F4 | **Carry thrust, set end-shake** | Endstones | Bronze thrust washer, shims, wave or Belleville washer for preload or drag | Every rotating part free axially | AUTO (J1, J2, J6) / HAND (drag) |
| F5 | **Limit travel** | Banking pins | Hard stop with elastomer bumper, stop pin, end-of-stroke block, just outside the working range | Oscillating or linear outputs that could over-travel with the drive off | AUTO (`H.stops` from the solved range; slide end stops shortened to clear a sweep before they are dropped) / HAND (placement check) |
| F6 | **Hold a position** | Click and click spring, jumper | Spring ball or roller detent, pawl spring, drag pack (wave washer + bronze disc) | Rest positions not positively locked; ratchets; anything that rattles in a clearance | HAND (call) / AUTO (`H.dragPack`, `H.spring`) |
| F7 | **Adjust** so made parts meet the exact model | Regulator, eccentric bankings | Slotted holes + clamp, eccentric bushing, shims, gib strip, idler on an eccentric, turnbuckle | Every belt drive, every gear mesh, every slide, every exact length ratio | AUTO (J5, J6, J8, J12) / HAND (links: call `H.eccentricMount` where a ground pivot carries the exact dimension, `H.turnbuckle` on a moving link) |
| F8 | **Lubricate** | Oil sinks, oil cups | Oil sink at an exposed pivot, oil hole and groove to a bushing, grease nipple on a slide, felt wiper on a sliding surface | Sliding contacts, plain bushings, open bearings. Not sealed bearings | AUTO by joint type |
| F9 | **Time and reference** for reassembly in phase | Beat marks, wheel index dots | Match marks at meshing teeth, zero line, index station marks, timing dowel | Anything with phase: gears, cams, Geneva, indexers, multi-crank linkages | AUTO (J6, J7, Geneva stations) / HAND (linkages) |
| F10 | **Protect and sense** | Shock protection, case | Pulley flanges, slip clutch or shear pin, home flag + fork sensor, see-through guard | Motor-driven builds | AUTO (flanges, sensor) / HAND (clutch) |

### 6.2 Detail on components

- **Shafts and axles** (A4): shoulders at every seat; circlip grooves where a part relies on friction; set-screw
  flats; thread undercuts; chamfered ends; centre holes; wrench flats.
- **Bearings:** closure chosen and drawn per joint: open (balls visible, oiled from a sink), shield (one extra
  ring), seal (flush). Retained by a shoulder on one side and a circlip or retainer plate on the other. Preloaded by a
  wave washer where floating. Bore entry chamfers on every seat.
- **Fasteners:** a screw in every hole drawn for one; washers under heads on aluminium; a locking method on every
  one (M13); head type by access: socket where a key reaches, button on thin plates, countersunk where something
  sweeps over.
- **Plates, bridges, brackets:** dowels or spigots (F1), spot faces and counterbores (M4), jack-screw holes beside
  dowels on tight plates, slotted holes where adjustable (F7), inside fillets where load turns a corner (M7).
- **Gears, wheels, discs:** hub and arms on anything that starts, stops or reverses (M2); hub with key or clamp
  (F3); tooth edge chamfers; timing marks (F9); replaceable locking segment on an indexing disc (M14).
- **Links and arms:** bosses proud of the web on both faces; oil hole to a plain bushing (F8); clamp where keyed.
- **Pulleys and belts:** flanges on the small pulley, two set screws at 90° or a clamp hub, tension slot, idler.
- **Springs** (`H.spring`): compression (seat, guide pin or bore, preload screw), torsion (post and tail stop), leaf
  (screwed at one end, bearing on a hardened pad). Drawn as the coil or leaf outline with its seat as a real part.
- **Slides** (J5): a few blocks, each guide function carried by one of them. A dowelled reference rail; a gib clamped
  under the keeper by the rail's screws, set on its slotted holes; a wiper at each end of the slider, a nipple, one end
  stop block at each end. The hardened, screwed rails and the gib are the replaceable wear parts (M14).
- **Sensing and cabling** (motorised builds): 1 mm vane on the input pulley or shaft collar, fork sensor on the
  bracket or a post, leads from motor and sensor to a terminal block on the base edge, one cable clip under the base.

### 6.3 Ancillary parts and sizes

| Part | Size at our scale | Functions | Drawing notes |
|---|---|---|---|
| Dowel pin | Ø3 to 4, flush or 1 mm proud | F1 | Plain disc, no head; pairs placed diagonally |
| Spigot | Ø6 h7 turned on a standoff | F1 | Fits a reamed hole or a slot in the bridge |
| External circlip DIN 471 | shaft Ø6 to 12, 0.8 to 1.2 thick | F2 | Ring with two ears and holes |
| Internal circlip DIN 472 | bore Ø19 to 28 | F2 | Ears inward |
| E-clip | Ø6 pins | F2 | Open-sided |
| Shaft collar with set screw | Ø10 shaft, Ø20 x 8 | F2, F3 | Set screw shows in side view |
| Bearing retainer plate | ring, 3 x M2.5 | F2 | Fully functional, very watch-like |
| Feather key DIN 6885 | 3 x 3 on Ø10, 4 x 4 on Ø12 | F3 | Keyway drawn as a mark on shaft and hub |
| Set screw DIN 916 | M3 or M4 on a flat | F3 | Two at 90° on hubs |
| Wave or Belleville washer | bearing OD, 0.3 to 0.5 | F4, F6 | Wave drawn as marks |
| Stop block + bumper | 6 to 10 mm, neoprene pad | F5 | Outside sweeps except at end of travel |
| Stop pin | Ø4 in base | F5 | Simplest banking pin |
| Ball detent plunger | M6 | F6 | Threaded body, spring and ball (faint), V notch |
| Compression spring | Ø6 to 10 wire 0.8 | F6 | Seat and guide as parts |
| Leaf or pawl spring | 0.8 wire or thin leaf | F6 | Thin curved plate screwed at one end |
| Eccentric bushing | Ø16 with offset Ø10 bore, flanged | F7 | Arc slots, two clamp screws, spanner holes, index line |
| Gib strip | the rail's width, as thick as the slider stands over the rail, slotted at each rail screw | F7 | On the keeper rail of every slide, clamped under the keeper by the rail's screws |
| Jack screw + slots | M4 | F7 | Slots in a mount flange, screw against a lug |
| Turnbuckle (`H.turnbuckle`) | M3 studs in a 6 mm link, body 5d long, as wide as the link allows (2d + 2 to 4d), milled flat to the link's thickness; DIN 439 jam nuts | F7, M13 | The link cut in two halves on one body, left and right hand studs threadlocked into the half ends, the body and the nuts flush in the link's plane; index line on the body |
| Idler pulley | bearing on a stud | F7 | On a slotted arm |
| Oil sink | Ø3 to 4 countersink at a pivot | F8 | One ring round an axle end on a bridge |
| Grease nipple DIN 71412 | M6, hex 7 | F8 | On a boss feeding a slide; reachable |
| Felt wiper | 3 x 6 pad in a clip | F8 | Against a sliding surface |
| Match marks, zero line, station dots | engraved line or dot | F9 | One mark per part |
| Wear strip | 1.5 x slot depth, hardened, 2 screws | M14 | In slot walls and cam tracks |
| Slip clutch | Belleville stack + nut on a pulley | F10 | Pulley on a bushing between friction discs |
| Shear pin | Ø2 brass through hub and shaft | F10 | One visible pin |
| Home flag + fork sensor | 1 mm vane, 12 x 25 sensor | F10 | Vane on a rotating part, sensor off the base |
| Terminal block + cable clip | 4-way block on the base edge, P-clip under the base | F10 | Leads as thin rounded strips |

---

## 7. Evidence of manufacture (M)

Every real part shows how it was made and how it is assembled. These features pass the admission test by
definition, as long as they are readable.

| Id | Requirement | Tier | Verify |
|---|---|---|---|
| M1 | **Outer edge breaks:** every top-face edge chamfered (sizes per part kind in the form style). | AUTO | screenshot |
| M2 | **Load- and inertia-driven shaping:** bosses round every loaded hole; hub and arms on wheels that start, stop or reverse; webs or ribs on long brackets; lightening windows (`H.window`, `H.spokes`, filleted) only where mass or inertia matters. | HAND | review |
| M3 | **Bore entry chamfers** on every bearing seat and through hole, drawn as a second ring. | AUTO | screenshot |
| M4 | **Seats for heads:** counterbores for socket heads, countersinks for countersunk screws, spot faces on rough or curved faces. | AUTO (base, csk, housings) / HAND (others) | screenshot |
| M5 | **No sharp inside corners on milled parts:** pockets, windows and slots carry a cutter radius ≥ 1.5 mm; slots have full-radius ends. | AUTO (`H.window`) / HAND | outline review |
| M6 | **Edge distance and walls:** hole centres ≥ 1.5 × hole Ø from any edge; ≥ 1.2 mm wall round bearings; no feature thinner than 1.5 mm in a plate. | AUTO check | `tools/check` |
| M7 | **Inside fillets** where load turns a corner in a bracket or plate. | HAND | review |
| M8 | **Thread undercut** where a thread meets a shoulder. | AUTO (A4) | section |
| M9 | **Thread realism:** ISO coarse pitch; engagement ≥ 1.5 × d in aluminium, ≥ 1 × d in steel, else through to a nut; screw lengths from standard series. | AUTO (rule) / HAND (variant) | names |
| M10 | **Materials and finishes named** per part: aluminium 6061 anodised or bead-blasted for plates; case-hardened steel for contact surfaces; bronze for bushings and thrust washers; neoprene for feet and bumpers; spring steel for clips and springs. Contact surfaces are hard. | AUTO (defaults by kind and role) / HAND (overrides) | `mat` on solids |
| M11 | **Turned-part marks:** centre holes on shaft ends, wrench flats, chamfered shaft ends. | AUTO (A4) | screenshot |
| M12 | **Tool access** (with A17): every screw reachable by its key; every pressed bearing removable (a hole or slot behind it). | HAND | explode |
| M13 | **Locking on every threaded fastener:** nyloc nut, threadlocker (named), spring washer, tab washer or wire. Drawn where it is a part (nut insert ring, washer); named otherwise. | AUTO (default per joint type) / HAND (variant) | names |
| M14 | **Replaceable wear parts** where there is sliding contact: slot liners, locking segments, cam track inserts, slide strips, as separate screwed solids of hard material. | AUTO (J4, J5, J7) / HAND (call `H.lockingSegment` for a locking arc, special surfaces) | solids |

---

## 8. Drive (V)

| Id | Requirement | Tier | Verify |
|---|---|---|---|
| V1 | **Standard prime mover:** brushless pancake outrunner Ø50 x 18 under the base, faint internals turning at belt ratio, GT2 belt, default 32:16. An input on a shaft in plan (J10) has the motor beside the shaft on a one-piece angle bracket, belted in the plane across the shaft to a pulley on its free end. Brushed Ø36 DC motor as the alternative setting. Every mechanism with a rotary, oscillating or linear input is motorised. | AUTO (`H.drive`) | screenshot |
| V2 | **One solid bracket:** top flange against the base, floor for the motor, full-height window for the belt; flange screws go up into the base from inside; nothing shows on top of the base. A motor beside a shaft in plan stands on one angle bracket instead: an upright its face screws to and a foot screwed to the base top, both slotted for the belt's tension. | AUTO | side view |
| V3 | Belt and pulleys clear of feet, housings and base hardware; where the belt passes under a post, its lower screw becomes a flush countersunk screw. | AUTO (rule) / HAND (motor position) | `tools/clearance` |
| V4 | Drive detail: pulley flanges, set screws or clamp hub, belt tension slot, idler where needed (J8). | AUTO | screenshot |
| V5 | **Drive by input kind** (K7): `rotary`: belt to the input pulley. `oscillating`: motor, short crank and connecting link swinging the rocker through exactly the modelled range; the crank belongs to the drive. A compliant joint's lever (J13) has no shaft: a pin pressed into its tip runs down through an arc slot in the base to the link, the rocker's pivot the joint's centre, the motor on the line of the tip's chord. `linear`: belt loop along the stroke with a carriage clamped to the input slider, tensioner on the far pulley. `manual`: no motor; a handle, knob or lever on the input and a stop at the end of the range; the page says hand operated. | AUTO | screenshot, page |
| V6 | **Sensing and cabling:** home flag on the input and a fork sensor on the bracket or a post; motor and sensor leads to a terminal block on the base edge, one cable clip under the base (on the base top for a motor beside a shaft in plan). | AUTO | underside view |

---

## 9. Look and rendering (L)

The look is the blueprint / drafting scheme: dark Blueprint and light Drafting sheets, now drawn from true 3D solids
by a depth-buffer renderer with a free orthographic camera. Full styling lives in `docs/style-reference.md` (3.0); this
section keeps the rules a mechanism build depends on.

| Id | Requirement | Tier |
|---|---|---|
| L1 | **Every look value is global**, in `src/style`. A mechanism never carries colours, line weights, opacities, patterns or fonts. | STYLE |
| L2 | **Records carry no look.** A model and a polish supply geometry, roles, materials, marks, detail levels and `accent: true` on the input; the renderer decides how they look. | HAND (don't break it) |
| L3 | **Roles carry the look.** Each role has its own surface, registered to the part's local coordinates so it moves, turns and foreshortens with the part: driver fine stipple, link sparse dots, output hatching, ground soft dashes, base a faint dot grid, bearings cross-hatch, hardware plain; walls shade by stepped facing. Every solid's `role` must be right. | HAND |
| L4 | **One accent colour** for the input shaft ring, the traced path and the forces. `accent: true` goes on the input only. | HAND (flag) / STYLE |
| L5 | **Transparency stays.** Surfaces are semi-transparent and a covered edge becomes a dashed hidden line, so screws in holes, bearings in bores and shanks through plates show. Model them as real solids with real holes, never as a mark on a top face. A static solid that hides a working zone (the pitch point of a mesh, the run of a slot roller) is drawn see-through, so the zone stays in view. | AUTO (stage 3, see-through) / HAND |
| L6 | **Correct depth at every view.** The renderer peels depth layers and composites them front to back: nothing paints in front of what it sits behind, at any camera, section or explode. There is no slicing, no painter's order, and no depth bias (T17). | AUTO |
| L7 | **View:** a turntable orbit (yaw and tilt) in an orthographic camera, snapping to the named views PLAN, FRONT, SIDE, ISOMETRIC, DIMETRIC, AUX ⟂ joint and VIEW az/el. No perspective. A mechanism declares its default view (T7). | STYLE |
| L8 | **Drawing conventions the mechanism feeds:** centrelines along every joint axis (by the angle of the axis to the view) and base-plate dimensions in the named views are automatic. Engraved scales, index marks and match marks are `marks` and draw as fine ink lines. Fill patterns never get finer than the on-screen floor; a detail under about 1 mm becomes one mark or nothing. | AUTO / HAND |
| L9 | **Section views, detail views and phantom positions** are views of the same solids. A section cuts at a plane the record names, hatches the cut faces at 45° and shows the cut outlines; a detail view magnifies a window; a phantom shows the part at an extreme position as a thin outline. They are declared in `teaching.views` (T8) and drawn by the renderer; a mechanism never draws them itself. | AUTO / DATA |
| L10 | **Teaching overlays use the sheet's look:** construction overlays, ghost traces, equal-time ticks and highlights come from the record's teaching block and are drawn by the overlay rules (style reference SD22 to SD24, SD26); they never change the drawing beneath. | AUTO / STYLE |

### 9a. Reuse and performance (R)

| Id | Requirement | Tier | Verify |
|---|---|---|---|
| R1 | **Reuse before you draw.** If the part family, `H.*` or a subassembly already makes the part, use it. Never redraw a standard part inline in a polish. A part needed by two mechanisms becomes an `H.*` primitive first. | HAND | read the polish for inline outlines |
| R2 | **Standard size series.** Bearings only from the catalogue table; screws M2, M2.5, M3, M4, M5, M6, M8; shafts Ø6, 8, 10, 12; standoffs Ø10; GT2 pulleys 16T and 32T; circlips, keys and springs from their tables. As few distinct sizes per mechanism as the loads allow. | HAND | sizes listed in the audit |
| R3 | **Shared subassemblies are one function, never copied:** housing, bridge, slide, eccentric, stops, drag pack, belt drive, sensor. | AUTO | code |
| R4 | **Pre-built packages (package v2).** The assembled mechanism (profiles and operations, meshes for boolean results, traces, bounds, plot, joints, teaching block) is packaged at build time; the browser loads the package, `solve(u)` and the renderer. Manifold, the rules, the hardware library and the polish are never shipped. | AUTO | `tools/package` |
| R5 | **Polish states only what differs** from the rules. No heavy sampling inside a polish; when it needs the swept range, sample once (≤ 180 steps). | HAND | polish ms in the bench |
| R6 | **Load time and frame time are measured, not gated.** `tools/bench` reports package size, session setup split into decode, tessellate, edges and GPU, and frame time at each named view and dial position, on the detail stage and a thumbnail, against the targets in the design (8 ms desktop frame, 16 ms phone, 20 ms setup). Over target is a flag to look at (section 9b), never a reason to cut function. | FLAG | bench report |
| R7 | **Small records, small polishes.** A polish states only true exceptions to the rules and kits, each with its reason in the audit; the share of the build the pipeline generates is reported (the plan's expectation: about three quarters of the model and three fifths of the polish are generated), and a polish that grows is a promotion candidate (A22). No stored point lists where geometry can be generated. | HAND / FLAG | polish size, audit |
| R8 | **Draw only what is seen.** Thumbnails are pre-rendered images; cards animate on hover only; the stage draws only when u, view or theme changed. | SITE / AUTO | profile |
| R9 | **Setup is shared and shipped cheap.** One GPU context serves a page; edges are shipped with the package or extracted in a worker; plain extrusions and revolutions turn into triangles in the browser (D10). | AUTO / SITE | bench: setup split |
| R10 | **Phone measurement.** Startup and frame time on a mid-range phone are acceptance criteria of the engine's package and renderer steps. Method: a bench page published with each measured build; the owner opens it on the phone and sends the numbers back. Setup is split into decode, tessellate, edges and GPU, with frame time per view and dial position. | FLAG | bench page |

### 9b. Detail levels (DL)

Richness is never traded against performance in the model: a mechanism is audited and packaged at full detail. What
can be scaled is the drawing, through one dial with a ladder of rungs. Each rung names the things that stop being
drawn when the dial passes it: solids, marks and render effects alike. **The ladder is ordered by what a viewer
notices, from least to most, never by what costs most to draw.** A rung that removes a part of the build sits near
the top because the build then reads as incomplete, however cheap or expensive that part is to draw.

The ladder is data, not code: one ordered table in `src/style/detail.ts`, each rung with an id, a description and
the selectors it drops (solid kinds, roles, mark kinds, render effects). Re-ranking a rung from measurements is a
one-line change there and nowhere else. The order below is the starting point, to be validated by dedicated
performance and perception tests later.

| Rung | Dropped | What stops being drawn | Why it sits here |
|---|---|---|---|
| DL-A | first | Paper grain; bearing balls and cages; motor internals (stator, windings, magnets, commutator) | Faint by design; nothing about the build is lost |
| DL-B | | Manufacturing marks: chamfer lines, bore-entry rings, head flutes, hex sockets, knurls, keyway marks, thread helices | Texture of the parts, not their presence |
| DL-C | | Wall shading steps (walls flat), silhouette lines on the layers behind the nearest (kept on the nearest) | Softens the drawing without removing a line that carries meaning |
| DL-D | | Stack hardware hidden inside a joint: inner-race spacers, thrust and plain washers, sleeves, shims, internal circlips | Invisible inside the stack unless exploded; drawn again whenever explode > 0 |
| DL-E | | Service and sensing parts: oil sinks, nipples, felts, wipers, home flag, sensor, terminal block, cable clip, leads, timing marks | Small distinct parts off the load path; the build still reads complete |
| DL-F | | Role surface patterns (roles then read by tone and outline only) | Large areas change; roles get harder to tell apart |
| DL-G | | Hidden lines (the dashed copies of covered edges); device pixel ratio capped at 1 | A drafting convention the whole look leans on; a soft image is seen at once |
| DL-H | last | Retention and adjustment parts: external circlips, retainer plates, nuts, set screws, eccentric bushings, gib strips, stops, springs, wear strips, dowels, spigots | Without these the build reads as incomplete |
| never | | The mechanism's parts, base plate, every joint's main hardware (shaft or bolt, head, bearings, housing, bridge, standoffs), motor, bracket, belt, pulleys, teaching traces, construction overlays, section and detail views | The build itself and what the page is for |

| Id | Requirement | Tier |
|---|---|---|
| DL1 | Every solid, mark and render effect maps to one rung through the selectors in `detail.ts`; primitives and rules tag what they make (kind, role, mark kind); a polish may move a specific solid up the ladder (toward "never") and says why in the audit, never down. | AUTO / HAND |
| DL2 | A mechanism may declare a **default dial position** in the model (full unless the audit finds a reason); the audit header records it. The package stores everything; the dial is applied when drawing, never at packaging. | HAND |
| DL3 | **View-aware exceptions live in the table too:** DL-D is drawn whenever explode > 0; DL-B marks are skipped at side elevation (tilt ≥ 80°) because they are edge-on. | AUTO |
| DL4 | **Adaptive:** the site measures frame time on the stage and moves the dial one rung at a time with hysteresis, never past DL-G on its own, never on a thumbnail or a screenshot. The visitor can pin full detail. The dial position shows in the title block ("DETAIL A-H" or "FULL") so a screenshot is never mistaken for the full build. | SITE |
| DL6 | **Teaching content is never on the ladder.** Traces, construction overlays, ghost paths, ticks and the views of `teaching.views` are drawn at every dial position; the dial drops only build detail. | AUTO |
| DL5 | **Measured:** the bench reports, per mechanism, the solids and marks on each rung and the frame time at each dial position, so the ladder can be re-ranked from evidence and the cost of each rung is known. | FLAG |

---

## 10. Verification (Q)

| Id | Check | Pass |
|---|---|---|
| Q1 | `tools/check <id>` | no `MISSING`, `NaN`, `POSE JUMP`, `SOLID`, or clamp or edge-distance fault; K1 residual within tolerance; the claim table (T9) agrees with `solve()`; periodicity none |
| Q2 | `tools/clearance <id>` | 0 clashes in 3D over the full cycle, no unnecessary `allow` |
| Q3 | `tools/package <id>` and the site build | package v2 written, page builds |
| Q4 | `tools/shot <id>`: the default view, PLAN, FRONT, SIDE and ISOMETRIC, every section and detail view of the record, full explode, both sheets, overlays on | nothing clips, details readable, nothing distracts, the principle reads (T1), E1 to E10 hold |
| Q5 | `tools/bench <id>` | report written; flags noted in the audit (not a failure) |
| Q6 | `tools/audit <id>` regenerated and judged | every requirement PASS or N/A with reason, or FAIL listed as open with a reason; ten-function table complete for every joint |
| Q7 | `tools/conformance` | the mechanism is at the current standard version |
| Q8 | Teaching review recorded | the verdict and every decision of T2 are in the record and the audit's `teaching:` line, and the six phases of the finished build were looked at again (a judgement; not a failing check) |

Checks Q1, Q2, Q6 and Q7 run as tests for the changed mechanism; all mechanisms when the rules, hardware, style or
renderer change. Q4 and Q5 run locally.

---

## 11. Audit sheet template

`tools/audit <id>` writes this. A row the tools decide outright (P1, K1, K2, K11, T9, D11, A12, A15, M6, Q1, Q2) is
filled and regenerated every time; every other row gets its tier and the evidence the tools collect (rule firing, kits,
supports, names, sizes, materials, locking, rungs) and a `?` to judge. The evidence of K1 is the K1 residual, of T9 the
claim table, of A15 the 3D clashes and the unnecessary `allow` exemptions. Judged rows, hand entries in the joints
table, the header, the `teaching:` line, deferrals, variants, promotion candidates and measured frame times survive
regeneration. A sheet audited below 3.0 is a 2.5D sheet: it has no `teaching:` line, no Kit, Block, Support and Stack
columns and no Supports section, and stays current until its mechanism is rebuilt (S6). A deferral is a line
`defer: <ids or version> · <reason>`; no reason, no deferral.

```markdown
# Audit: <name> (<id>)
standard: 3.0 · date: YYYY-MM-DD · result: pass | open · detail: full · pass: build | audit+fix
teaching: keep | tweak | rethink · decisions in the record

## Summary
PASS n · FAIL n · N/A n · open: ...

## Requirements
| Id | Status | Evidence / action |
|---|---|---|
| P1 | PASS | DATA · record complete; model.ts, polish.ts, audit.md present |
| ... | | |

## Joints
| Joint | Kit | Block | Support | Stack | F1 locate | F2 retain | F3 torque | F4 thrust | F5 limit | F6 hold | F7 adjust | F8 lube | F9 timing | F10 protect |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| <joint> | J3 | dyad | bridge (moved) | slab 1 | component / none / – reason | | | | | | | | | |

## Supports
| Support | Joint | Kind | Route | Least gap mm | Covers | T10 |
|---|---|---|---|---|---|---|
| <support> | <joint> | bridge | moved / first choice | 1.5 | principle bodies still covered | see-through / – |

## Variants and overrides
| Joint or part | Rule result | Chosen | Why |
|---|---|---|---|

## Detail ladder
| Rung | Solids | Marks | Frame ms at this dial position |
|---|---|---|---|

## Promotion candidates
Hand fixes that should become rules or primitives.

## Verification
check (K1 residual, claims) · clearance (3D, unnecessary allow) · clamp · edge distance · package
screenshots (paths) · bench (flags)
```

---

## Appendix A. Family playbooks

Start here, then run the full ten-function audit and the teaching review (T2). Each playbook names the kinematic
blocks and joint kits a family uses, what its records declare, and the hardware choices that recur. A fix that recurs
in three mechanisms becomes a rule or a kit (A22).

**Linkages** (four-bar and the planar family, straight-line linkages, six-bars, pantograph, scissor lift)
- Blocks: dyad, slider dyad. Kits: J3 on every moving pin, J1 or J2 on the ground pivots, J5 on a slide.
- Teaching: trace the point that carries the principle (both coupler ends of a parallelogram, B with equal-time ticks on
  a double crank, the full figure eight of a Watt linkage as a ghost path, g's circle with p's line on a Hart
  inversor); construction overlays for dead-centre lines, moment arms and workspace outlines; mark the toggles.
  A bridge over a ground pivot that would read as a bar is moved by the router or drawn see-through (T10 to T12).
- F5 stops just outside the rocker's range, generated from the solved range with the swing scaled (A22); F2 circlips or
  shoulder bolts on every moving pin.
- F7 where the record depends on an exact length ratio, one length is adjustable, shown at its set point, drawn length
  exact (the kit generates the eccentric mount or the turnbuckle, in the link's own plane).
- Scissor lift and pantograph: `manual` input with a handle and stops, or `linear` with a belt carriage. Five-bar:
  two driven cranks, the tip by inverse kinematics, the workspace as a construction overlay.

**Gears** (spur, gear train, planetary and compound trains, rack and pinion, non-circular, cycloidal)
- Blocks: gear mesh, Willis train (several drivers, a selector for Ravigneaux). Kit: J6 on every mesh; one hub per
  keyed gear (A22).
- M2 hub and arms on large wheels; F8 open gears are greased, oil sinks on bridge pivots. Planetary and compound trains:
  marks for planet phase, a trace on a planet point (the cycloid), a mark on a sun or ring so a turn can be counted.
  A gear that covers a smaller one is drawn see-through (T10), never removed.
- Rack: screwed and dowelled to the base, F5 end stops, F8 felt wiper.

**Intermittent** (Geneva, internal Geneva, intermittent gear, star wheel, ratchet and pawl, sprag clutch, indexers)
- Blocks: cam (locking and indexing laws), gear mesh with a time map where a snap is the lesson. Kits: J7, J4 with
  wear strips, J6.
- M2 lighten the indexed member, smaller windows rather than none; F6 drag pack where locking is not positive; M14 a
  screwed locking segment; ratchet: real pawl spring screwed down, a second holding pawl if the record has one; F10 home
  sensor. Show the locking arcs clear of hardware; the crank bridge see-through so the locking sector shows.
- A sprag clutch shows lock and overrun as timed phases and a detail view of a sector.

**Quick-return and slider** (slider-crank, offset slider-crank, scotch yoke, crank shaper, Whitworth, drag link,
oscillating cylinder, locomotive drive, Walschaerts, Wankel, toggle clamp)
- Blocks: dyad, slider dyad, cam for valve gears. Kits: J5 on every slide (reference rail, gib under the keeper, wipers,
  nipple, an end stop at each end); J4 in every slot with wear strips.
- Teaching: dead-centre and tangent lines and the chord splitting cut and return as construction overlays; a die control
  with ghost traces for its other settings, never an automatic sweep (T14); a section view through a port face with the
  open port highlighted.
- Scotch yoke: slide block in the slot (M14 liners). Toggle clamp: `manual`, over-centre stop visible (F5), adjustable
  spindle with lock nut (F7), a workpiece block. Oscillating cylinder: pivot pin retained (F2); spring holding the port
  face (F6).

**Cam and escapement** (cam follower, flat-faced, face-groove, desmodromic, barrel cam, anchor, lever, verge)
- Blocks: cam, escapement. Kit: J7 complete: return spring with seat and preload, guide bushing with circlip,
  anti-rotation key on flat followers, felt oiler, zero line; hardened cam and a replaceable track insert (M14).
- Teaching: the true orientation and a default view that shows it (an escapement's pendulum hanging down in front
  elevation, a desmodromic valve vertical under its camshaft); the loaded wall or rocker highlighted; a time map slows
  playback near an engagement (T13) and the swing stays true.

**Couplings** (Oldham, Schmidt, universal joint, double Cardan, Rzeppa, flexible couplings)
- Blocks: Hooke, homokinetic, and the dyad for the Oldham and Schmidt families. Each shaft on its own support (J2 or J10);
  the cross of a universal joint in needle cups held by circlips (F2), a grease nipple on the cross (F8); clamp hubs or
  keyed yokes on the shaft ends (F3); F8 lubrication of sliding tongues.
- A member that tilts as it turns (the cross, a cage, a swash plate) is a part whose frame is a solved body; the cross's
  arms lie along the two yokes' pins.
- Teaching: discs and hubs see-through so tongues, slots and index marks show; the disc-centre orbit as a full circle;
  parts of one role told apart by pattern (T16); a bend or phase control (T14); a section through a cage.

**Spatial gears** (bevel, hypoid, worm, helical, herringbone, crossed helical)
- Blocks: gear mesh on crossed axes. Kits: J9 on every crossed mesh, J10 on a shaft in plan, J2 for the rest. The
  geometry comes from `src/core/spatial.ts` (pitch cones from the tooth counts and shaft angle, Tredgold back-cone teeth
  as lofts, lead and lead angle of a worm, a helical gear's transverse profile turned by its helix).
- A bevel pinion overhangs its wheel, so its blocks stand behind it; a worm runs between two blocks, never overhung,
  the located one taking its thrust both ways (F4), the wheel's shim setting its mid-plane on the worm's axis (F7). A
  rotary input on a shaft in plan is driven by a motor beside it (V1).
- F7 by the shim packs; F4 where the mesh pushes; F9 marks at the mesh; herringbone: one shaft located, the other free
  to float. Where the lead angle is below the friction angle the record says it is self-locking, never a substitute
  for a brake. The AUX view down the worm axis is the worm's default teaching view.

**Flexible drives** (belt, chain, rope and tackle, CVT, harmonic drive)
- Block: convey for belts and chains, a stretched solid for rope spans, a deforming profile for a flexspline or a belt's
  wrap, the flexure block for the harmonic drive's flexspline. Kit: J8 and J12.
- Chain: ISO 606 sprockets (pitch radius p / (2 sin(π/z))); the centre distance for a whole number of links; the
  travel is the driving sprocket's angle times z1·p / 2π; the driven sprocket turns z1/z2 of it; each sprocket phased so
  a seat meets a roller at mid-wrap; the path exactly N pitches long; an idler sprocket of a whole number of teeth on
  the rollers' line, phased and geared to the mean chain speed. Toothed belt: HTD pulleys, a whole number of teeth, the
  band fixed round the pitch path and the teeth conveyed. Rope: spans stretched between solved tangent points, wraps
  as fixed arcs in the sheaves' grooves, the hook on the load block.
- CVT: each sheave half a frustum, the fixed halves diagonal, the sliding halves on a frame sliding along the shaft;
  the input's wrap radius r1 swept while r2 is solved from the constant belt length, the output angle integrated and
  trimmed to a whole number of turns so the cycle closes; the belt a deforming band; the ratio is a control.
- F7 by the idler or the slotted mount; F8 grease on a chain, a belt dry; F2 guards over the sheaves whose centres
  stand still. Chain and belt: both shafts straddle mounted (A9), the idler on the slack span near the small wheel;
  flanges on a belt's small pulley and idler (F10).

**Compliant mechanisms** (flexure hinge, bistable, compliant gripper)
- Block: flexure. Kit: J13. The neck is rigid in `solve()` (its pseudo-rigid chord) and the model gives the `bend`
  overlay of each neck; the lever's swing is the range.
- F5 stops just past the swing; the blank clamped and dowelled to the base (F1, F2). The blank is one part in one
  material: block, necks and levers, its block on a seat plate so the lever moves clear of the base.
- A fixed-guided beam is a deforming profile from the solved state (the cubic clamped at both ends); one J13 per anchor,
  none at the shuttle; the stops bank the shuttle, not the beam. A snap-through mechanism is driven by a motor through
  a spring (the roller between two preloaded springs in a window of the output), the output snapping ahead of the
  input near the force peak; the snap is a short transfer.

**Screws** (lead screw, ball screw, differential screw)
- Block: screw. Kit: J11, the screw on a shaft in plan (J10: one end located, one floating), its thread swept at the
  lead.
- The nut on a carriage that slides (J5), so the slide holds it from turning; a ball nut's return and wipers (F8); end
  stops just past the travel (F5). Ball screw: a section view through the nut shows the balls.

**Friction drives and integrators** (friction wheel, ball-disc integrator)
- Blocks: gear mesh (rolling, no slip), Willis train for the integrator's two drivers. Hardware as J6 without teeth: a
  preload spring or an adjustable mount (F7).

**Curve generators** (Tusi couple, elliptic trammel)
- Trammel: the rod on top, the blocks pinned up into it, the pen at its end; F7 adjustable slider pins at the record's
  lengths; J5 on the slots, the groove plate see-through where it covers. Tusi: F9 marks for the planet's phase, bold
  tracers or a bar from X to Y.

---

## Appendix B. Hardware primitives, builders and subassemblies

Primitives (`H.*`): `plate, shaft (stepped profile), bearing (open / shield / seal), roller, bushing, washer, wave
washer, tube, shank, head (socket / button / csk), nut, standoff, spigot, dowel, circlip (internal / external),
retainer plate, key, set screw, collar, spring (compression / torsion / leaf), stop, bumper, nipple, felt, oil sink
(marks), wear strip, eccentric bushing, gib, wiper, flag, sensor, terminal block, cable clip, lead`, helpers
`disc, hex, taper, boltCircle, hullOf, window, filletPoly, spokes, boreChamfers`.

Builders (A18 to A21): the **joint kits** (one per joint type, J1 to J13), the **axial stack builder** with its support
selector, the **support router** and the **placement solver**.

Subassemblies: `H.housing` (J2 cartridge), `H.bridge` (posts, spigots, dowels, lobes), `H.slide` (J5, a few
blocks) with `seatRail` and `railLayout` (A6: the rail's riser, or pads clear of what passes under it, and its screws),
`H.eccentric` (J6 backlash), `H.eccentricMount` (F7 at a ground pivot), `H.turnbuckle` (F7 on a moving link: the
link in two halves joined in its own plane by left and right hand studs, a flat body and jam nuts), `H.stops` (F5 from
the solved range), `H.dragPack` (F6, sized to the face it bears on), `H.lockingSegment` (M14), `H.outputCoupling` (a
keyed flange on a straddle-mounted output), `H.followerTrain` (J7), `H.drive` (V1 to V6 by input kind, a rotary input
on a shaft in plan included), `H.sensor` (V6), `H.pillowBlock` (J10: a bearing block for a shaft in plan, a housing on
its axis on a foot plate, screwed and dowelled), `H.crossBearings` (the four needle
cups and circlips of a universal joint's cross).

Every primitive has real catalogue sizes, a default material, a default locking method where threaded, and a
default detail level.

---

## Appendix C. Traceability of the plan's decisions

Every decision of the engine plan (#202) and every teaching-review decision of the rebuild issues (#212 to #218) has a
requirement id here. A decision about one mechanism sits in that mechanism's rebuild issue and in its record's
`teaching` block; this table gives each kind of decision its id and how it is enforced. **AUTO** is done or checked by
the pipeline, **HAND** is built and judged in the pass, **DATA** is a record field.

| Decision (plan #202) | Ids | Enforcement |
|---|---|---|
| Hardware covering the principle: never remove posts or plates; see-through first, supports moved second, a different construction only rarely; principle parts never out of depth order | T10, T11, T12, T17, A19, L5, L6 | AUTO (T10, T11, T17, A19), HAND (T12) |
| Teaching content lives in the record's teaching block | T3 to T9, T13, T14, P12 | DATA |
| Kinematics: closed-form blocks, numeric fallback, the solver verifies and does not drive | K1, K3, K8 to K12 | AUTO, DATA |
| Transition: a 3D stamp until cut-over; old engine removed entirely | S5, S6 | SITE, AUTO |
| Delivery, parallel work, main frozen during the plan | `docs/workflow.md` (process, not a requirement of a mechanism) | none |
| Phone measurement by a published bench page | R6, R10, Q5 | FLAG |
| Teaching test | T1, T2, T15, Q8, section 1 step 2 | HAND |
| Mechanisms built after the review get the review's method; the 20 unbuilt get the review against their record | T2, P13 | HAND |
| From scratch: every mechanism rebuilt from record v3, blocks and kits, the old model only a loose comparison | section 1, K3, A21, R7, S6 | HAND, AUTO |
| Open conformance passes retargeted to the rebuild batches | S4, section 1 | process (board, #219) |
| Review pattern 2: wrong point traced | T4 | DATA, review |
| Review pattern 3: effect too small | T6 | DATA, HAND |
| Review pattern 4: missing construction geometry | T5, L10 | DATA |
| Pushed back: Walschaerts die slider with ghost traces, not an automatic sweep | T14, K2, K9 | DATA, AUTO (cycle repeats at fixed controls) |
| Pushed back: Wankel keeps the apex trace and traces E too | T4 | DATA |
| Pushed back: Geneva smaller windows, not none; drag-link counterweight stays | M2, D2 | HAND |
| Pushed back: Schmidt told apart by patterns, not colours | T16, D3, L3 | STYLE, HAND |
| Pushed back: lever escapement a time map, not a cut amplitude | T13 | DATA |

| Decision kind in #212 to #218 | Ids | Enforcement |
|---|---|---|
| Trace this point, trace both ends, equal-time ticks, ghost path, trace a point on a gear, trace E as well | T4, P10, L10 | DATA |
| Construction overlays: dead-centre lines, tangent lines and arcs, axis lines meeting at a centre, moment-arm dimensions, workspace outline, chord, crank line O–E, speed-ratio plot, plot for several settings | T5, P10, L10 | DATA |
| A bridge, hanger, flange, rail, guide or cover becomes see-through or is moved off the principle (O4 bridge, scissor-lift bridge, hart hanger, Scott Russell bridge, Geneva bar, rhombic guides, groove plate, rotor web, large sun, pin cover ring, spider, output hub, lever bridges) | T10, T11, T12, A19 | AUTO |
| The part goes on top or underneath (trammel rod on top, output flange underneath, planet's link on top, disc on top of the pins) | T3, T17, A18 | AUTO (placement), DATA |
| Re-proportion, change a parameter, change a number in the text (double-rocker, offset slider-crank, Whitworth, Hart swing, cam profile, star-wheel hand-off, cycloidal lobes, anchor swing and recoil, text fixes of the review) | T6, T9, K6, K10, P9 | DATA, AUTO check |
| Rethink the representation (five-bar, Ackermann, elliptic trammel, Oldham, Ravigneaux, desmodromic, intermittent gear, sprag clutch, Schmidt) | T1, T2, T3, T7, K9 | HAND |
| A default view or orientation (desmodromic and anchor in front elevation, worm AUX down its axis, a slight default tilt) | T7, L7 | DATA |
| A section or detail view (oscillating cylinder port face, Rzeppa cage, ball-screw nut, sprag sector) and a highlighted part | T8, L9 | DATA |
| A control: die position, gear selector, offset, bend, phase, ratio, tilt; two drivers (differential, integrator) | T14, K9 | DATA |
| A time map (lever escapement; star wheel snap) | T13 | DATA |
| Marks that let a viewer count (mark on the ring, the sun, the flywheel; one bold index mark per disc) | F9, L8, T16 | HAND |
| A workpiece block, a thinner rim, a slimmer strap, a solider pawl, bolder tracers, a leaf spring inside the base | D1, D2, D6, M2 | HAND |
| A new block or kit for a new joint or generator (loft teeth for hypoid, groove by boolean for a barrel cam, escapement block, flexure block, Bennett block, homokinetic block, tilt frame, two orthogonal dyads) | K3, A21, D8, D10 | AUTO (library), HAND (which) |
| The placement solver replaces searched layers (Jansen); block-and-tackle drops 141 of 154 `allow` exemptions | A18, A15 | AUTO |
| The mechanism's explode and detail rungs follow its joints | E10, A21, DL1 | AUTO |

---

## Changelog

- **3.0 (2026-10-20).** True 3D parts and a record-driven build; the 2.5D engine is replaced at cut-over. The pipeline
  is catalogue record v3 (a `kin` block and a `teaching` block), closed-form kinematic blocks verified by a loop-closure
  residual, a hardware builder (joint kits, one axial stack builder, a support router, a placement solver), true 3D
  solids built by Manifold at build time, package v2 (profiles and meshes), 3D checks and a depth-buffer renderer with
  a free orthographic camera [K1, K2, K8, K10, K11, D8, D10, D11, A1, A2, A14, A15, A18, A19, A20, A21, A22, E10, L5,
  L6, L7, L9, L10, R4, R6, R9, R10, Q1 to Q4, AUTO]. Joints are declared with 3D axes, drivers include several
  inputs, selectors and a time map, and the branch, points, outputs, design choices and ranges are in the record [K3,
  K7, K9, K12, P12, DATA]. Parts are a profile, an operation and a 3D frame; layers, `dz` and `twin` are gone and K5
  is retired. Explode runs along each stack's joint axis with trail lines. A15 is penetration depth in 3D. Section 3a
  is new: the teaching test and its tools, the principle-visibility rule (transparency first, supports moved second,
  posts and plates never removed, principle parts never out of depth order), traces, construction overlays, default
  view, section and detail views, controls, time map and a checked claim table; the conformance pass gains a teaching
  review; Appendix C traces every decision of the plan [P1, P9, P10, T9, T10, T11, T17, AUTO]. The rest of the new and
  changed HAND requirements (T1 to T8, T12 to T16, P13, S2, R7, Q8, D8 and the pass of section 1) bind a mechanism at
  its rebuild from record v3, so the 2.5D audits are not behind a HAND change; `tools/conformance` learns the split in
  the engine's tools step [S5, S6, SITE]. The style reference is 3.0 [L3, L8, SD, STYLE]. Playbooks rewritten as
  blocks, kits and teaching tools.
- **2.14 (2026-10-20).** A shaft in plan's far block stands past the parts unless a moving part's sweep outline meets
  the block's area in plan (the housing's, or the foot's for a sweep that reaches down to it), so a worm runs between
  its two blocks and a bevel pinion stays overhung [J10, A9, AUTO]. Clearance between a z solid and one on an x or y
  axis tests the z solid's posed outline against the other's plan footprint where their boxes meet, never deeper than
  the box test [A15, Q2, AUTO]. The spatial gears playbook gains the worm.
- **2.13 (2026-10-20).** Hand fixes of the first compliant passes (flexure hinge, bistable) promoted to rules. J13 seats
  the clamped block on a ground plate of its own outline and the standoffs rule posts no compliant block or neck
  [J13, A6, AUTO]; the clamp dowels are reamed through block, clamp plate and seat [J13, F1, AUTO]; the stop pins stand
  on the lever's edge a fifth of the half swing past each end, and bank a body that moves without turning at the ends
  of its solved travel [J13, F5, AUTO]. A neck is one piece with its block and its lever in the clearance and the model
  check [A15, K5, AUTO]; a fixed part that stretches or deforms is swept, not ground [A14, A15, AUTO]. An oscillating
  input on a compliant joint's lever is driven by a pin in its tip, down through an arc slot in the base [V5, F2,
  AUTO]. The blank takes one material [M10, AUTO]. The compliant playbook gains the blank, the guided beam and the
  spring drive of a snap-through mechanism.
- **2.12 (2026-10-20).** The engine for the belt CVT, and the chain drive's hand fixes promoted. Posed solids honour
  `taper` (boxed, sliced and drawn to the far end) and slide along their own axis with their frame; a posed solid may
  `reach` a point that stays, so a spring keeps its seat as the part it presses moves [D8, L6, AUTO]. Deforming
  outlines on any axis, posed too, and with their holes (`deform` returns `{ outer, holes }`), the checks reading the
  solved rings; the model check reports a ring whose point count changes [D9, Q1, AUTO]. A posed part fixed in a
  moving frame moves with it in the checks and the sweeps; a posed solid standing along z is checked against the z
  solids by its outline in plan [A15, AUTO]. CVT declared by sheave pairs: the sliding halves on feather keys sized
  from the shaft, a spring and seat collar only where the pair asks, the shaft run on past the travel, its spacers cut
  short of it [J12, F2, F3, F6, AUTO]. Chain: `P.sprocket` (ISO 606), the path conveyed exactly N pitches long, the
  idler a whole-tooth sprocket on the rollers' line, phased to them and geared at the mean chain speed [J12, F7, AUTO].
  The flexible drives playbook gains the CVT and the chain's travel at z1·p / 2π.
- **2.11 (2026-10-20).** Hand fixes of the belt drive promoted to rules. Timing belts: a toothed belt declared in
  `flexible` over two timing pulleys (`P.pulley`) is recorded as J8; its band stands on no posts, its teeth are
  conveyed round the pitch path, the small pulley is flanged, a flat flanged idler sits on the belt's back on the
  slack span near the small pulley, and it runs dry [J8, J12, D9, A6, F10, AUTO]. Chain and belt share the idler: on
  the slack span near the small wheel, on a sealed bearing on a stud through an arm slotted across the span and clamped
  on two posts [J12, F7, AUTO]. Live shafts carrying a pulley or sprocket of a chain, belt or CVT are straddle mounted,
  a bridge each [A9, J2, AUTO]. The flexible drives playbook gains the belt.
- **2.10 (2026-10-20).** Hand fixes of the spatial-engine pilots promoted to rules. A rotary input on a shaft in plan
  is motorised: the motor beside the shaft on an angle bracket, belted across it to a pulley on its free end, home flag
  and sensor, leads to the terminal block [V1, V2, V4, V6, AUTO]. The base grows under a pillow block that stands past
  it; a part overhung on a live shaft's free end is held by a washer and a countersunk screw [J10, F2, AUTO]. Live gear
  shafts in a crossed mesh are straddle mounted, the bridge kept clear of parts on axes in plan; the J2 spacer under a
  gear's back face stops at its J9 thrust washer [A9, J2, J9, F4, AUTO]. Ropes: a guard over every sheave whose centre
  stands still, becket and hook at their own sheaves' heights, the becket on a post, the parts carrying the load
  counted, the rope primitives `P.ropeSpan` and `P.ropeWrap` [J12, F2, A11, AUTO]. The model check and classify read
  stretched and deforming parts at their solved outline [K5, A1, AUTO].
- **2.9 (2026-10-20).** Posed axes: a member whose axis is none of x, y, z is posed each phase by a solved frame, drawn
  by one affine per face and ordered by its box [D8, L6, AUTO]. The shaft couplings playbook poses the universal
  joint's cross and yokes.
- **2.8 (2026-10-20).** Members that change shape over the cycle: stretched, conveyed and deforming, and the bend
  overlay for flexures; every existing part keeps its shape [D9, AUTO]. Flexible members (chain, rope, CVT) and compliant
  joints, declared in the model [A2, J12 to J13, AUTO]. Playbooks for flexible drives and compliant mechanisms.
- **2.7 (2026-10-20).** Spatial mechanisms. A part may stand out of the plan plane on an x or y axis, with solid forms
  along it (taper, helix); every existing part is on z and meets it unchanged [D8, AUTO]. Joint classification covers
  pins on x or y axes and declared crossed meshes and screws [A1, A2, AUTO]. New joint rows: crossed-axis mesh,
  shaft in plan with its pillow blocks and the base growth under it, screw [J9 to J11, AUTO]. Depth order across
  axes [L6, AUTO]. The model check reports `AXIS` [Q1, AUTO]. Playbooks for spatial gears, shaft couplings and
  screws; `H.pillowBlock` and `H.crossBearings` in Appendix B.
- **2.6 (2026-10-18).** The device pixel ratio cap moves from DL-C to DL-G: a soft drawing is seen at once, and on the
  GPU renderer a frame's cost hardly follows its pixel count (browser bench, DL5), so it goes last of the effects
  [DL-C, DL-G, AUTO].
- **2.5 (2026-10-18).** An F7 adjuster for moving links: `H.turnbuckle` makes a link adjustable at its set point in its
  own plane (two halves on one body, left and right hand studs, a body milled flat to the link's thickness, jam nuts), so
  an exact length that sits between free pins, or on a link with no room above or below in the swept stack, can be
  trimmed with the drawn length exact. A polish calls it on the link that carries the exact dimension; the Linkages
  playbook says which adjuster goes where [F7, HAND].
- **2.4 (2026-10-18).** Linear guides are a few blocks with retaining screws and end stops. A slide is a dowelled
  reference rail and a rail carrying a bronze gib clamped under the keeper; the keeper's screws are the rail's fixing
  screws, so the shim, the separate keeper screws, the gib adjusting screws and their lock nuts go: the gib is set on
  slotted holes and clamped (adjust kept, by the clamp). One end stop block with a pad at each end, a wiper at each end
  of the slider, one nipple [J5, F2, F5, F7, F8, M13, AUTO]. Rails sit on one ground riser each, split into pads only on
  the runs where nothing passes under the rail, screws near each riser end and at most 100 mm apart; only the reference
  rail is dowelled [A6, F1, AUTO].
- **2.3 (2026-10-18).** Real-world examples are YouTube videos of real footage, never product pages, animations or
  renders, and may be none [P1, P6, DATA].
- **2.2 (2026-10-18).** Slide rails sit on ground steel pads, screwed through into the base and dowelled at the ends,
  instead of on posts [A6, F1, AUTO].
- **2.1 (2026-10-18).** Hand fixes from the first four conformance passes promoted to rules and primitives, and one new
  stage. Working zones stay in view: a static solid over a mesh pitch point or a slot roller's run is drawn see-through
  [L5, AUTO]. Plating offsets (`dz`) and clevis twins (`twin`) in the model contract, read by the rules [K1, A9, AUTO].
  Tapered links in the part family [D1, AUTO]. Open slots, and pins classified over the cycle [A1, J4, M14, AUTO].
  Straddle-mounted live gear shafts with the top eccentric [J2, F7, AUTO]. `H.dragPack` sized to the face it bears on,
  `H.lockingSegment`, `H.outputCoupling`, `H.spokes` [F6, M14, M2, AUTO]. Slide end stops shortened before they are
  dropped [F5, AUTO]. Shoulder bolt headroom: a lifted head that would meet a solid gets a shoulder ground to length,
  a clear one is reported [A13, AUTO].
- **2.0 (2026-10-17).** Rewritten for the rebuilt engine. Section 0 added (versioning, conformance tool, audit
  generator) [S1 to S4, DATA/AUTO]. Detail budget of 6.0 replaced by functional completeness [F, HAND → mostly AUTO by
  joint type]. Joint-type catalogue added [J1 to J8, AUTO]. Shafts as stepped profiles, keys by size, locking on every
  fastener, replaceable wear parts, springs, lubrication and timing marks by joint type, sensing and cabling
  [A4, A5, M13, M14, F6, F8, F9, V6, AUTO]. Input kind and drive by input kind [K7, V5, HAND + AUTO]. Detail levels
  [DL, AUTO/SITE]. Pre-built packages [R4, AUTO]. Glow renderer and second-renderer requirement removed [L2, SQ7].
  Status table and hand-time logs removed (the board holds status). File layout changed to `src/mechanisms/<id>/`.
- **1.0 (2026-10-16).** The hand-off standard: conformance pass, tiers, P K D A E F M V L R Q, audit template,
  family playbooks.
