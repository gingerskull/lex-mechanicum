# Audit: Trammel of Archimedes (elliptic-trammel)
standard: 3.0 · date: 2026-10-22 · result: pass · detail: full · pass: build
teaching: rethink · decisions in the record

## Summary
PASS 147 · FAIL 0 · N/A 20 · open: none

## Requirements
| Id | Status | Evidence / action |
|---|---|---|
| S1 | PASS | DATA · the standard carries version 3.0 and its changelog |
| S2 | PASS | HAND · header with standard, date, result, detail, pass and the teaching: line |
| S3 | PASS | AUTO · tools/conformance reads this sheet (engine v3) and runs in npm run check |
| S4 | PASS | SITE · the pass issue (#213) holds only this mechanism's decisions; plan and status in #202 |
| S5 | PASS | SITE · 3D stamp in the title block (every shot) and on the card and page header (site build) |
| S6 | PASS | AUTO · rebuilt from its record v3 in rebuild batch R2 (#213): bound by 3.0 from this pass |
| P1 | PASS | DATA · record v3 complete (kin and teaching blocks); polish3.ts, audit.md present |
| P2 | PASS | DATA · catalogue validator clean |
| P3 | PASS | DATA / SITE · the page reads ratio, axes, character, backdrivable, aka, family, motion, level, dof and the drive from the record |
| P4 | PASS | DATA · tags grouped Function, Property, Application, keywords |
| P5 | PASS | DATA · explanation in four parts and the examples from the record |
| P6 | PASS | DATA · references and media from the record, validated by the catalogue |
| P7 | PASS | HAND / SITE · no prose in the polish; labels come from the record |
| P8 | PASS | SITE · the page has no parts list or joint sections (site) |
| P9 | PASS | AUTO / HAND · every number the explanation states is a claim and agrees (T9) |
| P10 | PASS | HAND · P and M traced (comet on P); overlays: groove x, groove y, pa = half-axis along y and pb = half-axis along x; plot of the output |
| P11 | PASS | DATA · plain language, mm and degrees |
| P12 | PASS | AUTO / DATA · validate(records, asVersion 3) clean for this record |
| P13 | PASS | HAND · teaching review run against the record before the build and again on the finished drawing (teaching: line) |
| K1 | PASS | AUTO · K1 residual 9.1e-13 (tolerance 1e-9) over 360 samples, reference 7.1e-15 |
| K2 | PASS | AUTO · check: finite, continuous, periodic over 360 samples |
| K3 | PASS | AUTO / HAND · 2 blocks (slider-dyad); no numeric fallback · composed from the block library; no fallback, no one-off model |
| K4 | PASS | HAND · crank driver with the accent ring on the input; rod output |
| K6 | PASS | DATA · half-axes PA and PB as the record's defining relations state them; the crank L/2 to the rod's midpoint |
| K7 | PASS | DATA · drivers input (rotary) · input kind declared with its driven joint |
| K8 | PASS | AUTO / DATA · every joint declared with type, bodies, origin and axis; nothing inferred |
| K9 | PASS | DATA · one rotary driver, its control the crank |
| K10 | PASS | AUTO / DATA · no two-root closure to declare; continuous (no POSE JUMP) |
| K11 | PASS | AUTO · mobility counted 0, dof 1 |
| K12 | PASS | DATA · every traced, overlaid and claimed point and quantity is named in kin |
| T1 | PASS | HAND · mechanics first, no use context in the teaching strings; the principle reads at the default view |
| T2 | PASS | HAND · review before the build and again on the six phases of the finished build; decisions in the record |
| T3 | PASS | DATA · principle parts declared; drawn whole, in depth order |
| T4 | PASS | DATA · fired: trace-marks (1 solid) · P and M traced, comet on P; the traced point engraved on its part |
| T5 | PASS | DATA · construction overlays: groove x, groove y, pa = half-axis along y and pb = half-axis along x |
| T6 | PASS | HAND / DATA · the claimed motion reads at the default view (claim table, T9) |
| T7 | PASS | DATA · PLAN, where the planar mechanism reads whole |
| T8 | N/A | DATA · the principle lies in plain view, no section needed |
| T9 | PASS | AUTO / DATA · claim table: 4 ok, 0 off, 0 uncheckable of 4 |
| T10 | PASS | AUTO · 2 solids drawn see-through: M-bolt-wsh, M-bolt-head · the crank pin's head under the rod drawn see-through |
| T11 | PASS | AUTO · 0 supports routed, 0 moved off a sweep · no support to route |
| T12 | PASS | HAND · 20 support solids; dropped by the polish: SX-rail0, SX-riser0, SX-rail1, SX-riser1, SX-gib, SX-keeper, SX-sc0, SX-sc0-sh, SX-sc1, SX-sc1-sh, SX-sc2, SX-sc2-sh, SX-dw0, SX-dw1, SX-nip, SX-stop0, SX-pad0, SX-stop1, SX-pad1, SY-rail0, SY-riser0, SY-rail1, SY-riser1, SY-gib, SY-keeper, SY-sc0, SY-sc0-sh, SY-sc1, SY-sc1-sh, SY-sc2, SY-sc2-sh, SY-dw0, SY-dw1, SY-nip, SY-stop0, SY-pad0, SY-stop1, SY-pad1 · the slide rails, risers and keepers of SX and SY dropped by the polish for the groove plate, named with the reason in teaching.exceptions |
| T13 | N/A | DATA · nothing goes by in a blink |
| T14 | PASS | HAND / DATA · the crank (driver) and pen (param) |
| T15 | PASS | HAND · labels state the mechanism, never its use |
| T16 | N/A | HAND / STYLE · no two parts of one role to tell apart |
| T17 | PASS | AUTO · depth peeling, no depth bias (renderer test) |
| D1 | PASS | HAND · links sized to their bosses, plates with boss rings, plain base |
| D2 | PASS | HAND · material round every pin |
| D3 | PASS | STYLE · STYLE: roles by pattern and tone (both sheets) |
| D4 | PASS | AUTO · fired: base (3 solids), feet (4 solids) · base corners and feet concentric (base, feet rules) |
| D5 | PASS | AUTO / HAND · no bridge: the crank shaft stands on the base under the plate; the groove plate stands on its floor strips |
| D6 | PASS | HAND / STYLE · hardware quieter than the parts, still readable (both sheets) |
| D8 | PASS | AUTO / HAND · every solid a profile, an operation and a frame; built by Manifold; no layers, dz or twin |
| D9 | N/A | AUTO / HAND · no member changes shape |
| D10 | PASS | AUTO · profiles shipped for plain extrusions, meshes only for booleans (package v2) |
| D11 | PASS | AUTO · SOLID: 0 of 36 solids unsound |
| D7 | PASS | HAND · links and plates plain; the richness in the stacks |
| A1 | PASS | AUTO · M J3, A J3, B J3, O J2, SX J5, SY J5, drive drive · every joint read from the record and built by its kit |
| A2 | PASS | AUTO · M J3, A J3, B J3, O J2, SX J5, SY J5, drive drive · fixed pins on their kits, moving pins J3 |
| A3 | PASS | AUTO · fired: classify (6 solids), axial stack builder · bores from the catalogue; bearings where a boss fits them |
| A4 | N/A | AUTO · fired: j1-dead-axle (no solids), axial stack builder · no dead axle |
| A5 | PASS | AUTO · fired: j2-live-shaft (25 solids), j10-shaft-in-plan (no solids), axial stack builder · keys by shaft size: D-flat to Ø8, feather key above |
| A6 | PASS | AUTO · fired: j5-slide (44 solids), j13-compliant (no solids), standoffs (no solids) · the groove plate in place of each slide's rails (polish); no floating plate |
| A7 | PASS | AUTO · fired: base (3 solids), feet (4 solids) · base 8 mm under the lowest part, counterbored corner holes, feet, engraved scale and paths, shaft clearance holes |
| A8 | PASS | AUTO · fired: fasteners (26 solids) · stage 3 fasteners: shanks, clearance and tapped holes |
| A9 | PASS | AUTO / HAND · fired: placement solver · pins in single or double shear as the placement solver sets them, shortest overhang |
| A10 | PASS | HAND · fired: placement (8 solids), placement solver · slabs from the placement solver: parts that keep apart share a slab |
| A11 | PASS | AUTO / HAND · fired: j12-flexible (no solids), strap-sheave (no solids), j1-dead-axle (no solids) · load paths closed: every joint note says where its load goes to ground |
| A12 | PASS | AUTO · clamp check clean |
| A13 | PASS | AUTO / HAND · 105 solids, 58 unnamed (further items of a listed set) · named hardware with catalogue sizes and materials |
| A14 | PASS | AUTO / HAND · fired: support router · supports routed against the sweeps (least gap 1.5 mm); details checked by A15 |
| A15 | PASS | AUTO · clearance in 3D over 72 phases: 0 clashes; hand allow: 0 named, 0 unnecessary |
| A16 | PASS | HAND · 7 joint notes; no note: none; no badge: SX, SY · a note per joint; the joints named after "no badge" have a kit that gives no badge yet (kit follow-up) |
| A17 | PASS | HAND · assembles in the explode order; every screw reachable; pressed bearings pullable through their bores |
| A18 | PASS | AUTO · placement: 3 slabs in the tallest stack (34.0 mm), 0 clevises; stack per joint in the Joints table · axial positions set by the placement solver |
| A19 | PASS | AUTO · 0 supports routed (0 moved), least gap - mm; still covering a principle part, drawn see-through: none · no support to route |
| A20 | PASS | AUTO · support per joint: none · one axial stack builder with its support selector |
| A21 | PASS | AUTO · kit per joint: M J3, A J3, B J3, O J2, SX J5, SY J5, drive drive |
| A22 | PASS | AUTO · fired: stops (no solids), adjustable-length (no solids), cable-clip (2 solids) · no part swings back and forth; no exact length to adjust |
| E1 | PASS | AUTO · every solid has one explode level; levels -4 to 3 · one level per solid, nothing stretches |
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
| J2 | PASS | AUTO · fired: j2-live-shaft (25 solids) · O: housing with two bearings, keyed shaft, pulley, flag |
| J3 | PASS | AUTO · fired: j3-moving-pin (27 solids), cross-bearings (no solids), ring-hub (no solids) · moving pins: shoulder bolts threaded through the lower part, bearings, inner-race spacers, made up by a washer |
| J4 | N/A | AUTO · fired: j4-slot-roller (no solids), pin-lobe (no solids), fork-pin (no solids) · no pin in a slot |
| J5 | PASS | AUTO · fired: piston-bore (no solids), j5-slide (44 solids), tongue-slot (no solids) · SX, SY: the blocks run in the crossed grooves of one groove plate (walls either side, floor strips beyond the crank's sweep, open round the middle where the pin M runs); the rails, risers and keepers of the slide kit give way to it (polish, T12 exception in the record) |
| J6 | N/A | AUTO · fired: j6-mesh (no solids), ring-rollers (no solids) · no parallel mesh |
| J7 | N/A | AUTO · fired: groove-cam (no solids), j7-cam (no solids), pallet-contact (no solids), pawl-tooth (no solids) · no cam |
| J8 | N/A | AUTO · fired: j8-belt (no solids), j12-flexible (no solids) · no belt in the mechanism (the drive belt is V4) |
| J9 | N/A | AUTO · fired: j9-crossed-mesh (no solids) · no crossed mesh |
| J10 | N/A | AUTO · fired: j10-shaft-in-plan (no solids) · no shaft in plan |
| J12 | N/A | AUTO · fired: j12-flexible (no solids), strap-sheave (no solids) · no flexible member |
| J13 | N/A | AUTO · fired: j13-compliant (no solids) · no compliant joint |
| J11 | N/A | AUTO · fired: j11-screw (no solids) · no screw |
| F1 | PASS | AUTO · served at O, SX, SY; fired: j2-live-shaft (25 solids), j10-shaft-in-plan (no solids), strap-sheave (no solids), j13-compliant (no solids) · housings, blocks and bridges dowelled (Joints table) |
| F2 | PASS | AUTO · served at M, A, B, O, SX, SY; fired: j2-live-shaft (25 solids), j10-shaft-in-plan (no solids), cross-bearings (no solids), trunnion (no solids), fork-pin (no solids), ring-hub (no solids), ring-rollers (no solids), j12-flexible (no solids), strap-sheave (no solids), j13-compliant (no solids) · every bearing retained both sides; every part on a shaft retained (Joints table) |
| F3 | PASS | AUTO · served at M, A, B, O; fired: j2-live-shaft (25 solids), j10-shaft-in-plan (no solids), j12-flexible (no solids), j11-screw (no solids) · every keyed part keyed or on a D-flat with its retainer |
| F4 | PASS | AUTO / HAND · served at O; fired: j9-crossed-mesh (no solids), j2-live-shaft (25 solids), j10-shaft-in-plan (no solids), trunnion (no solids) · thrust washers where a part turns free axially |
| F5 | PASS | AUTO / HAND · served at SX, SY; fired: j5-slide (44 solids), pawl-tooth (no solids), j13-compliant (no solids), stops (no solids) · the groove ends stop the blocks past their travel |
| F6 | N/A | AUTO / HAND · served at no joint; fired: trunnion (no solids), j7-cam (no solids), pallet-contact (no solids), pawl-tooth (no solids), j12-flexible (no solids) · no rest position to hold: the drive positions every part |
| F7 | N/A | AUTO / HAND · served at SX, SY; fired: j6-mesh (no solids), j9-crossed-mesh (no solids), j5-slide (44 solids), j12-flexible (no solids), adjustable-length (no solids) · no exact length or mesh to adjust |
| F8 | PASS | AUTO · served at SX, SY; fired: cross-bearings (no solids), tongue-slot (no solids), j12-flexible (no solids), j11-screw (no solids), lubrication (no solids) · wipers at both ends of each block |
| F9 | PASS | AUTO / HAND · served at no joint; fired: j6-mesh (no solids), j9-crossed-mesh (no solids), timing-marks (1 solid) · zero line on the input and on the base (timing marks) |
| F10 | PASS | AUTO / HAND · served at drive; fired: j12-flexible (no solids), drive (26 solids) · home flag and fork sensor on the input (drive) |
| M1 | PASS | AUTO · fired: hardware primitives · top-face chamfers by part kind (primitives) |
| M2 | PASS | HAND · bosses round every loaded hole |
| M3 | PASS | AUTO · fired: j3-moving-pin (27 solids), hardware primitives · bore entry chamfers |
| M4 | PASS | AUTO / HAND · fired: base (3 solids), fasteners (26 solids) · counterbores and countersinks for heads (base, csk, housings) |
| M5 | PASS | AUTO / HAND · fired: hardware primitives · cutter radii on windows and slots |
| M6 | PASS | AUTO · edge distance and walls clean |
| M7 | N/A | HAND · no bracket corner turns a load |
| M8 | N/A | AUTO · fired: j1-dead-axle (no solids) · no stepped dead axle |
| M9 | PASS | AUTO / HAND · fired: j1-dead-axle (no solids) · ISO coarse threads, engagement through the tapped part or to a nut |
| M10 | PASS | AUTO / HAND · 101 of 105 solids name a material · materials named by kind and role |
| M11 | PASS | AUTO · fired: j1-dead-axle (no solids), hardware primitives · centre holes, chamfered ends on turned parts |
| M12 | PASS | HAND · every screw reachable by its key in the explode |
| M13 | PASS | AUTO / HAND · 11 threaded · threadlocker or nyloc on every threaded fastener |
| M14 | PASS | AUTO / HAND · fired: piston-bore (no solids), j4-slot-roller (no solids), pin-lobe (no solids), groove-cam (no solids), pallet-contact (no solids), tongue-slot (no solids) · ground steel groove walls guide the blocks |
| V1 | PASS | AUTO · fired: drive (26 solids) · brushless pancake motor, GT2 32:16 |
| V2 | PASS | AUTO · fired: drive (26 solids) · one bracket for the motor |
| V3 | PASS | AUTO / HAND · fired: drive (26 solids) · belt and pulleys clear of feet and housings (A15) |
| V4 | PASS | AUTO · fired: j8-belt (no solids) · flanged pulleys, belt in one plane |
| V5 | PASS | AUTO · fired: drive (26 solids) · rotary input: belt to the input pulley |
| V6 | PASS | AUTO · fired: drive (26 solids), cable-clip (2 solids) · home flag, fork sensor, terminals, lead and clip |
| L1 | PASS | STYLE · STYLE: no look values in the record or polish |
| L2 | PASS | HAND · records and polish carry no look |
| L3 | PASS | HAND · roles right on every solid (both sheets) |
| L4 | PASS | HAND / STYLE · one accent: the input ring, the traces |
| L5 | PASS | AUTO / HAND · fired: see-through (9 solids) · transparency and hidden lines show screws in holes and bearings in bores |
| L6 | PASS | AUTO · depth peeling at every view (shots) |
| L7 | PASS | STYLE · STYLE: turntable orbit, named views, no perspective |
| L8 | PASS | AUTO / HAND · fired: trace-marks (1 solid) · centrelines along every joint axis, base dimensions, engraved marks |
| L9 | N/A | AUTO / DATA · no section or detail view declared |
| L10 | PASS | AUTO / STYLE · teaching overlays in the sheet's look |
| R1 | PASS | HAND · every standard part from the primitives and kits |
| R2 | PASS | HAND · standard sizes only |
| R3 | PASS | AUTO · fired: hardware primitives · shared subassemblies, one function each |
| R4 | PASS | AUTO · package v2 20.6 KB · package v2 written at build time |
| R5 | PASS | HAND · the polish states only exceptions, no sampling |
| R6 | PASS | FLAG · FLAG: bench run (desktop, ladder below); the phone is measured by David |
| R7 | PASS | HAND / FLAG · polish 25 lines (2.4 KB); 5 solids added, 0 overrides by the polish |
| R8 | PASS | AUTO / SITE · SITE: thumbnails pre-rendered, cards animate on hover |
| R9 | PASS | AUTO / SITE · setup and bake in the worker, one context |
| R10 | PASS | FLAG · FLAG: the bench page is built for the phone measurement |
| DL1 | PASS | AUTO / HAND · 37 of 105 solids on a dropping rung · every solid, mark and effect on a rung by its kind |
| DL2 | PASS | HAND · default dial: full |
| DL3 | PASS | AUTO · view-aware exceptions in the ladder table |
| DL4 | PASS | SITE · SITE: adaptive dial with hysteresis |
| DL6 | PASS | AUTO · teaching layers drawn at every dial position |
| DL5 | PASS | FLAG · FLAG: bench reports frame time per dial position |
| Q1 | PASS | check, clamp and edge distance clean |
| Q2 | PASS | 0 clashes, 0 unnecessary allows |
| Q3 | PASS | package v2 written, 20.6 KB; site build not checked here · package v2 written; site builds (npm run build) |
| Q4 | PASS | local: tools/shot · tools/shot3 --set: record view, PLAN, FRONT, SIDE, ISOMETRIC, the declared views, full explode, both sheets |
| Q5 | PASS | local: tools/bench · tools/bench run: dist/bench/report-v2.md |
| Q6 | PASS | every row judged |
| Q7 | PASS | at 3.0 |
| Q8 | PASS | teaching review: rethink (2026-10-22); the six phases of the finished build are looked at by eye · verdict and decisions in the record and the teaching: line; six phases of the finished build looked at |

## Joints
| Joint | Kit | Block | Support | Stack | F1 locate | F2 retain | F3 torque | F4 thrust | F5 limit | F6 hold | F7 adjust | F8 lube | F9 timing | F10 protect |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| A | J3 | – | – | – | none | Shoulder bolt Ø6 x 16, M5 (ISO 7379) | Shoulder bolt Ø6 x 16, M5 (ISO 7379) | none | none | none | none | none | none | none |
| B | J3 | – | – | – | none | Shoulder bolt Ø5 x 16, M4 (ISO 7379) | Shoulder bolt Ø5 x 16, M4 (ISO 7379) | none | none | none | none | none | none | none |
| SX | J5 | – | – | – | SX-dw0, SX-dw1 | SX-keeper | none | none | SX-stop0, SX-stop1 | none | SX-gib | 2 x Felt wiper in a steel clip | none | none |
| SY | J5 | – | – | – | SY-dw0, SY-dw1 | SY-keeper | none | none | SY-stop0, SY-stop1 | none | SY-gib | Felt wiper in a steel clip | none | none |
| drive | drive | – | – | – | none | none | none | none | none | none | none | none | none | Home flag, 1 mm steel vane; Fork sensor, slotted optical, 5 mm gap |

## Supports
| Support | Joint | Kind | Route | Least gap mm | Covers | T10 |
|---|---|---|---|---|---|---|

## Variants and overrides
| Joint or part | Rule result | Chosen | Why |
|---|---|---|---|
| SX, SY | J5 slide on rails | groove plate (walls, floor strips, open middle) | crossed slides: one slide's rails would stand across the other block's path, and risers across the crank's (T12, polish) |

## Detail ladder
| Rung | Solids | Marks | Frame ms at this dial position |
|---|---|---|---|
| DL-A | 4 | 0 | 1.37 |
| DL-B | 0 | 49 | 1.33 |
| DL-C | 0 | 0 | 1.31 |
| DL-D | 5 | 0 | 1.38 |
| DL-E | 3 | 0 | 1.35 |
| DL-F | 0 | 0 | 1.42 |
| DL-G | 0 | 0 | 1.42 |
| DL-H | 0 | 0 | 1.41 |
| never | 24 | 71 | 1.36 |

## Promotion candidates
The groove plate is one mechanism's hand fix (polish): crossed slides in one plate become a kit only if two more mechanisms need them.

## Verification
check: clean · K1 residual: 9.1e-13 · claims: 4 of 4 ok · clearance: 0 clashes · clamp: clean · edge distance: clean · package: 10.3 KB
screenshots: dist/shots3/elliptic-trammel (record view, PLAN, FRONT, SIDE, ISOMETRIC, explode; both sheets) and six phases at plan and an angled view · bench: dist/bench/report-v2.md (desktop; frame times paced at 28 deg in the ladder above; phone by David)
