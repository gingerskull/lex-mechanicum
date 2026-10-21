# Audit: Compound gear train (gear-train)
standard: 3.0 · date: 2026-10-21 · result: pass · detail: full · pass: build
teaching: keep · decisions in the record

## Summary
PASS 146 · FAIL 0 · N/A 21 · open: none

## Requirements
| Id | Status | Evidence / action |
|---|---|---|
| S1 | PASS | DATA · the standard carries version 3.0 and its changelog |
| S2 | PASS | HAND · header with standard, date, result, detail, pass and the teaching: line |
| S3 | PASS | AUTO · tools/conformance reads this sheet (engine v3) and runs in npm run check |
| S4 | PASS | SITE · the batch issue (#215) holds only this mechanism's decisions; plan and status in #202 |
| S5 | PASS | SITE · 3D stamp in the title block (every shot) and on the card and page header (site build) |
| S6 | PASS | AUTO · rebuilt from its record v3 in rebuild batch R4 (#215): bound by 3.0 from this pass |
| P1 | PASS | DATA · record v3 complete (kin and teaching blocks); no polish, audit.md present |
| P2 | PASS | DATA · catalogue validator clean |
| P3 | PASS | DATA / SITE · the page reads ratio, axes, character, backdrivable, aka, family, motion, level, dof and the drive from the record |
| P4 | PASS | DATA · tags grouped Function, Property, Application, keywords |
| P5 | PASS | DATA · explanation in four parts and the examples from the record |
| P6 | PASS | DATA · references and media from the record, validated by the catalogue |
| P7 | PASS | HAND / SITE · no prose in a polish; labels come from the record |
| P8 | PASS | SITE · the page has no parts list or joint sections (site) |
| P9 | PASS | AUTO / HAND · every number the explanation states about the motion is a claim and agrees (T9) |
| P10 | PASS | HAND · input-pinion and output-gear marks traced, ticks every 45 deg; both stage centre lines labelled 3:1; plot of output angle |
| P11 | PASS | DATA · plain language, mm and degrees |
| P12 | PASS | AUTO / DATA · validate(records, asVersion 3) clean for this record |
| P13 | PASS | HAND · teaching review run against the record before the build and again on the finished drawing (teaching: line) |
| K1 | PASS | AUTO · K1 residual 1.4e-14 (tolerance 1e-9) over 360 samples, reference 0.0e+0 |
| K2 | PASS | AUTO · check: finite, continuous, periodic over 360 samples |
| K3 | PASS | AUTO / HAND · 2 blocks (gear-mesh); no numeric fallback · composed from the block library (two gear-mesh steps, the second driven by the first's output); no fallback, no one-off model |
| K4 | PASS | HAND · input pinion driver with the accent on its shaft, output gear last |
| K6 | PASS | DATA · module 3: 12/36 twice, centre distances 72 and 72; the second stage at 62 deg to the first |
| K7 | PASS | DATA · drivers input (rotary) · input kind declared with its driven joint |
| K8 | PASS | AUTO / DATA · every joint declared with type, bodies, origin and axis; nothing inferred |
| K9 | PASS | DATA · one rotary driver; the tooth-count design choices are not offered as controls (parts built for 12/36, 12/36) |
| K10 | PASS | AUTO / DATA · two closures; tooth counts in both mesh joints; the cluster's 12-tooth level named by its tooth count |
| K11 | PASS | AUTO · mobility counted 1, dof 1 |
| K12 | PASS | DATA · every traced, overlaid and claimed point and quantity is named in kin |
| T1 | PASS | HAND · mechanics first, no use context in the teaching strings; the principle reads at the default view |
| T2 | PASS | HAND · review before the build and again on the six phases of the finished build; decisions in the record |
| T3 | PASS | DATA · principle parts declared; drawn whole, in depth order |
| T4 | PASS | DATA · fired: trace-marks (1 solid) · a mark on the input pinion and one on the output gear traced, ticks every 45 deg: 8 ticks round a full circle against 8 inside 40 deg |
| T5 | PASS | DATA · the two stage centre lines, labelled 3:1 |
| T6 | PASS | HAND / DATA · nine turns in, one out, same sense: the bunched ticks on the output read the 9:1 |
| T7 | PASS | DATA · PLAN, where both stages and the cluster's two levels show |
| T8 | N/A | DATA · the principle lies in plain view, no section needed |
| T9 | PASS | AUTO / DATA · claim table: 3 ok, 0 off, 0 uncheckable of 3 |
| T10 | PASS | AUTO · 6 solids drawn see-through: A-bb, A-bridge, B-bb, B-bridge, D-bb, D-bridge · the bridges over the three gears drawn see-through with their stacks (A19) |
| T11 | PASS | AUTO · 3 supports routed, 3 moved off a sweep · three bridges moved off the meshes; still over their gears, drawn see-through |
| T12 | PASS | HAND · 25 support solids; dropped by the polish: none |
| T13 | N/A | DATA · nothing goes by in a blink |
| T14 | PASS | HAND / DATA · the input; no other control (K9) |
| T15 | PASS | HAND · labels state the mechanism, never its use |
| T16 | N/A | HAND / STYLE · no two parts of one role to tell apart |
| T17 | PASS | AUTO · depth peeling, no depth bias (renderer test) |
| D1 | PASS | HAND · involute teeth, module 3, plain discs; the cluster is one body of two keyed levels |
| D2 | PASS | HAND · material where the teeth carry; plain gear discs on keyed hubs |
| D3 | PASS | STYLE · STYLE: roles by pattern and tone (both sheets) |
| D4 | PASS | AUTO · fired: base (3 solids), feet (4 solids) · base corners and feet concentric (base, feet rules) |
| D5 | PASS | AUTO / HAND · one bridge over each gear on two posts; motor bracket |
| D6 | PASS | HAND / STYLE · hardware quieter than the parts, still readable (both sheets) |
| D8 | PASS | AUTO / HAND · every solid a profile, an operation and a frame; built by Manifold; no layers, dz or twin |
| D9 | N/A | AUTO / HAND · no member changes shape |
| D10 | PASS | AUTO · profiles shipped for plain extrusions, meshes only for booleans (package v2) |
| D11 | PASS | AUTO · SOLID: 0 of 170 solids unsound |
| D7 | PASS | HAND · gears plain; richness in the stacks |
| A1 | PASS | AUTO · M1 J6, M2 J6, A J2, B J2, D J2, drive drive · every joint read from the record and built by its kit |
| A2 | PASS | AUTO · M1 J6, M2 J6, A J2, B J2, D J2, drive drive · three gears on live shafts (J2), each straddled by a bridge; two parallel meshes J6 |
| A3 | PASS | AUTO · fired: classify (5 solids), axial stack builder · bores from the catalogue; bearings where a boss fits them |
| A4 | PASS | AUTO · fired: j1-dead-axle (no solids), axial stack builder · stepped shafts with shoulders, grooves, flats and chamfered ends (H.shaft) |
| A5 | PASS | AUTO · fired: j2-live-shaft (133 solids), j10-shaft-in-plan (no solids), axial stack builder · keys by shaft size: D-flat to Ø8, feather key above |
| A6 | N/A | AUTO · fired: j5-slide (no solids), j13-compliant (no solids), standoffs (no solids) · no slide and no floating plate |
| A7 | PASS | AUTO · fired: base (3 solids), feet (4 solids) · base 8 mm under the lowest part, counterbored corner holes, feet, engraved scale and paths, shaft clearance holes |
| A8 | PASS | AUTO · fired: fasteners (18 solids) · stage 3 fasteners: shanks, clearance and tapped holes |
| A9 | PASS | AUTO / HAND · fired: placement solver · every gear straddle mounted (housing under, bridge over) |
| A10 | PASS | HAND · fired: placement (8 solids), placement solver · the cluster's 12-tooth level and the output one slab above the first stage; nothing else stacked |
| A11 | PASS | AUTO / HAND · fired: j12-flexible (no solids), strap-sheave (no solids), j1-dead-axle (no solids) · load paths closed: every joint note says where its load goes to ground |
| A12 | PASS | AUTO · clamp check clean |
| A13 | PASS | AUTO / HAND · 170 solids, 91 unnamed (further items of a listed set) · named hardware with catalogue sizes and materials |
| A14 | PASS | AUTO / HAND · fired: support router · supports routed against the sweeps; details checked by A15 |
| A15 | PASS | AUTO · clearance in 3D over 72 phases: 0 clashes; hand allow: 0 named, 0 unnecessary |
| A16 | PASS | HAND · 6 joint notes; no note: none; no badge: M1, M2 · a note per joint (the meshes' badges are not shear cases); build rules: an eccentric bushing per mesh, the cluster's two levels keyed to one shaft with a spacer between |
| A17 | PASS | HAND · assembles in the explode order; every screw reachable; pressed bearings pullable through their bores |
| A18 | PASS | AUTO · placement: 2 slabs in the tallest stack (20.0 mm), 0 clevises; stack per joint in the Joints table · axial positions set by the placement solver; the compound gear's level one slab above its part |
| A19 | PASS | AUTO · 3 supports routed (3 moved), least gap 1.5 mm; still covering a principle part, drawn see-through: A-bridge, B-bridge, D-bridge · bridge first choice, moved off the meshes; least gap 1.5 mm |
| A20 | PASS | AUTO · support per joint: A bridge, B bridge, D bridge · one axial stack builder with its support selector |
| A21 | PASS | AUTO · kit per joint: M1 J6, M2 J6, A J2, B J2, D J2, drive drive |
| A22 | PASS | AUTO · fired: stops (no solids), adjustable-length (no solids), cable-clip (2 solids) · no stops (the gears turn on through the cycle); cable clip |
| E1 | PASS | AUTO · every solid has one explode level; levels -4 to 5 · one level per solid, nothing stretches |
| E2 | PASS | AUTO · fired: explode (1 solid) · heads, shanks, washers and nuts move as one |
| E3 | PASS | AUTO · fired: explode (1 solid) · screws back out along their axes |
| E4 | PASS | HAND · last fitted goes furthest (explode shots, both sheets) |
| E5 | PASS | AUTO · fired: explode (1 solid) · pressed bearings, bushings and clips stay with their parts |
| E6 | PASS | AUTO · fired: explode (1 solid) · motor, bearings and pulley pair whole |
| E7 | PASS | AUTO · fired: explode (1 solid) · loose spacers midway |
| E8 | PASS | AUTO · fired: explode (1 solid) · keyed parts keep their order on their shaft |
| E9 | PASS | HAND · full explode readable in ISOMETRIC on both sheets, nothing leaves the frame |
| E10 | PASS | AUTO · fired: explode (1 solid) · each stack explodes along its joint axis, with trail lines |
| J1 | N/A | AUTO · fired: trunnion (no solids), j1-dead-axle (no solids) · no dead axle |
| J2 | PASS | AUTO · fired: j2-live-shaft (133 solids) · three gear shafts: housing, keyed with clamp hubs (two on the cluster's shaft), bridge over the top |
| J3 | N/A | AUTO · fired: j3-moving-pin (no solids), cross-bearings (no solids), ring-hub (no solids) · no moving revolute |
| J4 | N/A | AUTO · fired: j4-slot-roller (no solids), pin-lobe (no solids), fork-pin (no solids) · no pin in a slot |
| J5 | N/A | AUTO · fired: piston-bore (no solids), j5-slide (no solids), tongue-slot (no solids) · no slide |
| J6 | PASS | AUTO · fired: j6-mesh (2 solids), ring-rollers (no solids) · two parallel meshes: an eccentric bushing each for the centre distance, timing marks at both meshes |
| J7 | N/A | AUTO · fired: groove-cam (no solids), j7-cam (no solids), pallet-contact (no solids), pawl-tooth (no solids) · no cam |
| J8 | N/A | AUTO · fired: j8-belt (no solids), j12-flexible (no solids) · no belt in the mechanism (the drive belt is V4) |
| J9 | N/A | AUTO · fired: j9-crossed-mesh (no solids) · no crossed mesh |
| J10 | N/A | AUTO · fired: j10-shaft-in-plan (no solids) · no shaft in plan |
| J12 | N/A | AUTO · fired: j12-flexible (no solids), strap-sheave (no solids) · no flexible member |
| J13 | N/A | AUTO · fired: j13-compliant (no solids) · no compliant joint |
| J11 | N/A | AUTO · fired: j11-screw (no solids) · no screw |
| F1 | PASS | AUTO · served at A, B, D; fired: j2-live-shaft (133 solids), j10-shaft-in-plan (no solids), strap-sheave (no solids), j13-compliant (no solids) · housings, blocks and bridges dowelled (Joints table) |
| F2 | PASS | AUTO · served at A, B, D; fired: j2-live-shaft (133 solids), j10-shaft-in-plan (no solids), cross-bearings (no solids), trunnion (no solids), fork-pin (no solids), ring-hub (no solids), ring-rollers (no solids), j12-flexible (no solids), strap-sheave (no solids), j13-compliant (no solids) · every bearing retained both sides; every part on a shaft retained (Joints table) |
| F3 | PASS | AUTO · served at A, B, D; fired: j2-live-shaft (133 solids), j10-shaft-in-plan (no solids), j12-flexible (no solids), j11-screw (no solids) · every keyed part keyed or on a D-flat with its retainer |
| F4 | PASS | AUTO / HAND · served at A, B, D; fired: j9-crossed-mesh (no solids), j2-live-shaft (133 solids), j10-shaft-in-plan (no solids), trunnion (no solids) · thrust washers where a part turns free axially |
| F5 | N/A | AUTO / HAND · served at no joint; fired: j5-slide (no solids), pawl-tooth (no solids), j13-compliant (no solids), stops (no solids) · the gears turn continuously |
| F6 | N/A | AUTO / HAND · served at no joint; fired: trunnion (no solids), j7-cam (no solids), pallet-contact (no solids), pawl-tooth (no solids), j12-flexible (no solids) · no rest position to hold: the drive positions every part |
| F7 | PASS | AUTO / HAND · served at M1, M2; fired: j6-mesh (2 solids), j9-crossed-mesh (no solids), j5-slide (no solids), j12-flexible (no solids), adjustable-length (no solids) · eccentric bushing sets the centre distance and backlash |
| F8 | PASS | AUTO · served at no joint; fired: cross-bearings (no solids), tongue-slot (no solids), j12-flexible (no solids), j11-screw (no solids), lubrication (3 solids) · sealed bearings need none; open contacts oiled or greased where they occur |
| F9 | PASS | AUTO / HAND · served at M1, M2; fired: j6-mesh (2 solids), j9-crossed-mesh (no solids), timing-marks (1 solid) · timing marks at the mesh |
| F10 | PASS | AUTO / HAND · served at drive; fired: j12-flexible (no solids), drive (26 solids) · home flag and fork sensor on the input (drive) |
| M1 | PASS | AUTO · fired: hardware primitives · top-face chamfers by part kind (primitives) |
| M2 | PASS | HAND · bosses round every loaded hole |
| M3 | PASS | AUTO · fired: j3-moving-pin (no solids), hardware primitives · bore entry chamfers |
| M4 | PASS | AUTO / HAND · fired: base (3 solids), fasteners (18 solids) · counterbores and countersinks for heads (base, csk, housings) |
| M5 | PASS | AUTO / HAND · fired: hardware primitives · cutter radii on windows and slots |
| M6 | PASS | AUTO · edge distance and walls clean |
| M7 | N/A | HAND · no bracket corner turns a load |
| M8 | PASS | AUTO · fired: j1-dead-axle (no solids) · thread undercuts on stepped shafts |
| M9 | PASS | AUTO / HAND · fired: j1-dead-axle (no solids) · ISO coarse threads, engagement through the tapped part or to a nut |
| M10 | PASS | AUTO / HAND · 166 of 170 solids name a material · materials named by kind and role |
| M11 | PASS | AUTO · fired: j1-dead-axle (no solids), hardware primitives · centre holes, chamfered ends on turned parts |
| M12 | PASS | HAND · every screw reachable by its key in the explode |
| M13 | PASS | AUTO / HAND · 25 threaded · threadlocker or nyloc on every threaded fastener |
| M14 | N/A | AUTO / HAND · fired: piston-bore (no solids), j4-slot-roller (no solids), pin-lobe (no solids), groove-cam (no solids), pallet-contact (no solids), tongue-slot (no solids) · no sliding contact needing a liner |
| V1 | PASS | AUTO · fired: drive (26 solids) · pancake motor on the input, belted to the input shaft |
| V2 | PASS | AUTO · fired: drive (26 solids) · one bracket for the motor |
| V3 | PASS | AUTO / HAND · fired: drive (26 solids) · belt and pulleys clear of feet and housings (A15) |
| V4 | PASS | AUTO · fired: j8-belt (no solids) · flanged pulleys, belt in one plane |
| V5 | PASS | AUTO · fired: drive (26 solids) · rotary input: belt to the input pulley |
| V6 | PASS | AUTO · fired: drive (26 solids), cable-clip (2 solids) · home flag, fork sensor, terminals, lead and clip |
| L1 | PASS | STYLE · STYLE: no look values in the record or polish |
| L2 | PASS | HAND · records and polish carry no look |
| L3 | PASS | HAND · roles right on every solid (both sheets) |
| L4 | PASS | HAND / STYLE · one accent: the input ring, the traces |
| L5 | PASS | AUTO / HAND · fired: see-through (6 solids) · transparency and hidden lines show screws in holes and bearings in bores |
| L6 | PASS | AUTO · depth peeling at every view (shots) |
| L7 | PASS | STYLE · STYLE: turntable orbit, named views, no perspective |
| L8 | PASS | AUTO / HAND · fired: trace-marks (1 solid) · centrelines along every joint axis, base dimensions, engraved marks |
| L9 | N/A | AUTO / DATA · no section or detail view declared |
| L10 | PASS | AUTO / STYLE · teaching overlays in the sheet's look |
| R1 | PASS | HAND · every standard part from the primitives and kits |
| R2 | PASS | HAND · standard sizes only |
| R3 | PASS | AUTO · fired: hardware primitives · shared subassemblies, one function each |
| R4 | PASS | AUTO · package v2 24.2 KB · package v2 written at build time |
| R5 | PASS | HAND · no polish; nothing sampled by hand |
| R6 | PASS | FLAG · FLAG: bench run (desktop, below); the phone is measured by David |
| R7 | PASS | HAND / FLAG · polish none; 0 solids added, 0 overrides by the polish |
| R8 | PASS | AUTO / SITE · SITE: thumbnails pre-rendered, cards animate on hover |
| R9 | PASS | AUTO / SITE · setup and bake in the worker, one context |
| R10 | PASS | FLAG · FLAG: the bench page is built for the phone measurement |
| DL1 | PASS | AUTO / HAND · 66 of 170 solids on a dropping rung · every solid, mark and effect on a rung by its kind |
| DL2 | PASS | HAND · default dial: full |
| DL3 | PASS | AUTO · view-aware exceptions in the ladder table |
| DL4 | PASS | SITE · SITE: adaptive dial with hysteresis |
| DL6 | PASS | AUTO · teaching layers drawn at every dial position |
| DL5 | PASS | FLAG · FLAG: bench reports frame time per dial position |
| Q1 | PASS | check, clamp and edge distance clean |
| Q2 | PASS | 0 clashes, 0 unnecessary allows |
| Q3 | PASS | package v2 written, 24.2 KB; site build not checked here · package v2 written; site builds (npm run build) |
| Q4 | PASS | local: tools/shot · dist/shots3/gear-train: record view, PLAN, FRONT, SIDE, ISOMETRIC, the declared views, full explode, both sheets |
| Q5 | PASS | local: tools/bench · tools/bench3 run (desktop) |
| Q6 | PASS | every row judged |
| Q7 | PASS | at 3.0 |
| Q8 | PASS | teaching review: keep (2026-10-20); the six phases of the finished build are looked at by eye · verdict and decisions in the record and the teaching: line; six phases of the finished build looked at |

## Joints
| Joint | Kit | Block | Support | Stack | F1 locate | F2 retain | F3 torque | F4 thrust | F5 limit | F6 hold | F7 adjust | F8 lube | F9 timing | F10 protect |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| M1 | J6 | gear-mesh | – | – | none | none | none | none | none | none | Eccentric bushing Ø28, 0.3 mm offset bore Ø14, flanged | none | A; Cluster | none |
| M2 | J6 | gear-mesh | – | – | none | none | none | none | none | none | Eccentric bushing Ø28, 0.3 mm offset bore Ø14, flanged | none | Cluster; D | none |
| A | J2 | driver | bridge (moved) | – | 2 x Dowel pin Ø3 x 10 h6, housing to base; Bridge over the pivot, on two spigoted posts | 2 x Internal circlip DIN 472, Ø21; External circlip DIN 471, Ø12 | Feather key 4 x 4 x 12 (DIN 6885); Clamp hub Ø12x22, two set screws at 90°; Set screw M4 (DIN 916), threadlocked | Thrust washer 12.2x20, bronze; Wave washer 16.5x20.8, spring steel | none | none | none | none | none | none |
| B | J2 | – | bridge (moved) | – | 2 x Dowel pin Ø3 x 10 h6, housing to base; Bridge over the pivot, on two spigoted posts | 2 x Internal circlip DIN 472, Ø21; External circlip DIN 471, Ø12 | 2 x Feather key 4 x 4 x 12 (DIN 6885); 2 x Clamp hub Ø12x22, two set screws at 90°; 2 x Set screw M4 (DIN 916), threadlocked | Inner-race spacer 12.2x15; Thrust washer 12.2x20, bronze; Wave washer 16.5x20.8, spring steel | none | none | none | none | none | none |
| D | J2 | – | bridge (moved) | – | 2 x Dowel pin Ø3 x 10 h6, housing to base; Bridge over the pivot, on two spigoted posts | 2 x Internal circlip DIN 472, Ø21; External circlip DIN 471, Ø12 | Feather key 4 x 4 x 12 (DIN 6885); Clamp hub Ø12x22, two set screws at 90°; Set screw M4 (DIN 916), threadlocked | Thrust washer 12.2x20, bronze; Wave washer 16.5x20.8, spring steel | none | none | none | none | none | none |
| drive | drive | – | – | – | none | none | none | none | none | none | none | none | none | Home flag, 1 mm steel vane; Fork sensor, slotted optical, 5 mm gap |

## Supports
| Support | Joint | Kind | Route | Least gap mm | Covers | T10 |
|---|---|---|---|---|---|---|
| A-bridge | A | bridge | moved | 1.5 | a | see-through |
| B-bridge | B | bridge | moved | 1.5 | cluster | see-through |
| D-bridge | D | bridge | moved | 1.5 | d | see-through |

## Variants and overrides
| Joint or part | Rule result | Chosen | Why |
|---|---|---|---|
| cluster | one gear per body | two toothed levels on one body, keyed to one live shaft, a spacer between | the record's compound gear (`cluster`): promoted to the builder (shape levels, one slab apart in the placement solver) |

## Detail ladder
| Rung | Solids | Marks | Frame ms at this dial position |
|---|---|---|---|
| DL-A | 13 | 0 | – |
| DL-B | 0 | 226 | – |
| DL-C | 0 | 0 | 1.07 |
| DL-D | 16 | 0 | – |
| DL-E | 8 | 7 | – |
| DL-F | 0 | 0 | – |
| DL-G | 0 | 0 | 1.26 |
| DL-H | 29 | 0 | – |
| never | 104 | 195 | 0.82 (full) |

## Promotion candidates
None left: the compound gear (a gear with cluster levels) is a shape of the builder, placed by the placement solver one slab per level.

## Verification
check: clean · K1 residual: 1.4e-14 · claims: 3 of 3 ok · clearance: 0 clashes · clamp: clean · edge distance: clean · package: 24.2 KB
screenshots: dist/shots3/gear-train (record view, PLAN, FRONT, SIDE, ISOMETRIC, explode; both sheets) · bench: tools/bench3 (desktop; 28 deg paced 0.82 ms full, 1.07 at C, 1.26 at G; phone by David)
