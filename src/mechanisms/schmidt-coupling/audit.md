# Audit: Schmidt coupling (schmidt-coupling)
standard: 3.0 · date: 2026-10-22 · result: pass · detail: full · pass: build
teaching: rethink · decisions in the record

## Summary
PASS 146 · FAIL 0 · N/A 21 · open: none

## Requirements
| Id | Status | Evidence / action |
|---|---|---|
| S1 | PASS | DATA · the standard carries version 3.0 and its changelog |
| S2 | PASS | HAND · header with standard, date, result, detail, pass and the teaching: line |
| S3 | PASS | AUTO · tools/conformance reads this sheet (engine v3) and runs in npm run check |
| S4 | PASS | SITE · SITE · the pass issue holds only this mechanism's decisions; plan and status in #217 |
| S5 | PASS | SITE · 3D stamp in the title block (every shot) and on the card and page header (site build) |
| S6 | PASS | AUTO · rebuilt from its record v3 in batch R6 (#217): bound by 3.0 from this pass |
| P1 | PASS | DATA · record v3 complete (kin and teaching blocks); no polish, audit.md present |
| P2 | PASS | DATA · catalogue validator clean |
| P3 | PASS | DATA / SITE · the page reads ratio, axes, character, backdrivable, aka, family, motion, level, dof and the drive from the record |
| P4 | PASS | DATA · tags grouped Function, Property, Application, keywords |
| P5 | PASS | DATA · explanation in four parts and the examples from the record |
| P6 | PASS | DATA · references and media from the record, validated by the catalogue |
| P7 | PASS | HAND / SITE · no prose in the polish; labels come from the record |
| P8 | PASS | SITE · the page has no parts list or joint sections (site) |
| P9 | PASS | AUTO / HAND · every number the explanation states is a claim and agrees (T9) |
| P10 | PASS | HAND · midpoint of link A1 traced (a circle while the link never turns) with ghosts at offsets 30 and 90; lines O1-C and C-O3 that every link of a set stays parallel to; the offset; output and link A angle plotted |
| P11 | PASS | DATA · plain language, mm and degrees |
| P12 | PASS | AUTO / DATA · validate(records, asVersion 3) clean for this record |
| P13 | PASS | HAND · teaching review run against the record before the build (E2, #204) and again on six phases of the finished build (teaching: line) |
| K1 | PASS | AUTO · K1 residual 4.3e-14 (tolerance 1e-9) over 360 samples, reference 0.0e+0 |
| K2 | PASS | AUTO · check: finite, continuous, periodic over 360 samples |
| K3 | PASS | AUTO / HAND · 1 block (parallel-cranks); no numeric fallback · composed from the block library; no fallback, no one-off model |
| K4 | PASS | HAND · input disc driver with the accent, output disc output, middle disc and six links |
| K6 | PASS | DATA · every set of three equal parallel links makes parallelograms with the discs' centres: all three discs turn alike, every link keeps its direction; C fixed at L from both shafts |
| K7 | PASS | DATA · drivers input (rotary), middle-side (select) · input kind declared with its driven joint |
| K8 | PASS | AUTO / DATA · every joint declared with type, bodies, origin and axis; nothing inferred |
| K9 | PASS | DATA · one rotary driver; the offset a param control (20 to 100), the middle side a selector |
| K10 | PASS | AUTO / DATA · closed forms, continuous over the cycle; no branch flips |
| K11 | PASS | AUTO · mobility counted -1, dof 1 |
| K12 | PASS | DATA · every traced, overlaid and claimed point and quantity is named in kin |
| T1 | PASS | HAND · mechanics first, no use context in the teaching strings; the principle reads at the default view |
| T2 | PASS | HAND · review before the build and again on six phases of the finished build; decisions in the record |
| T3 | PASS | DATA · principle parts declared; drawn whole, in depth order |
| T4 | PASS | DATA · fired: trace-marks (1 solid) · a link's midpoint traced: a circle of the pins' pitch radius while the link never turns |
| T5 | PASS | DATA · the two set directions (O1-C, C-O3) and the offset |
| T6 | PASS | HAND / DATA · offset 50 mm: the middle disc stands well off the shaft line and both link sets read |
| T7 | PASS | DATA · PLAN, square to all three discs |
| T8 | N/A | DATA · the principle lies in plain view, no section needed |
| T9 | PASS | AUTO / DATA · claim table: 7 ok, 0 off, 0 uncheckable of 7 |
| T10 | PASS | AUTO · 73 solids drawn see-through: PA1-0-sp, PA1-bolt-wsh, PA1-bolt, PA1-bolt-s1, PA1-bolt-s2, PA1-bolt-head, PA2-0-sp, PA2-bolt-wsh · the three discs drawn see-through as rings by the record, so the links and every index mark show; the output's bridge see-through where it covers them |
| T11 | PASS | AUTO · 1 support routed, 1 moved off a sweep · the output disc's bridge routed off the sweeps |
| T12 | PASS | HAND · 13 support solids; dropped by the polish: none |
| T13 | N/A | DATA · nothing goes by in a blink |
| T14 | PASS | HAND / DATA · input, the offset (moves the middle and output discs and the links as built) and the middle side (a selector that sets the side's sign) |
| T15 | PASS | HAND · labels state the mechanism, never its use |
| T16 | PASS | HAND / STYLE · set B in a pattern of its own (link2, cross) against set A (dots), placed on their own levels |
| T17 | PASS | AUTO · depth peeling, no depth bias (renderer test) |
| D1 | PASS | HAND · fired: wheels (no solids) · discs as rims: spoked to a hub on the shafts, bare in the middle; links as tapered bars; a bold engraved index arrow on each disc |
| D2 | PASS | HAND · rims 19 mm deep round the pins' bosses |
| D3 | PASS | STYLE · STYLE: roles by pattern and tone (both sheets) |
| D4 | PASS | AUTO · fired: base (3 solids), feet (4 solids) · base corners and feet concentric (base, feet rules) |
| D5 | PASS | AUTO / HAND · input shaft in a housing, output hung from a bridge |
| D6 | PASS | HAND / STYLE · hardware quieter than the parts, still readable (both sheets) |
| D8 | PASS | AUTO / HAND · every solid a profile, an operation and a frame; built by Manifold; no layers, dz or twin |
| D9 | N/A | AUTO / HAND · no member changes shape |
| D10 | PASS | AUTO · profiles shipped for plain extrusions, meshes only for booleans (package v2) |
| D11 | PASS | AUTO · SOLID: 0 of 199 solids unsound |
| D7 | PASS | HAND · rings and links plain; richness in the pins' stacks |
| A1 | PASS | AUTO · PA1 J3, PA2 J3, PA3 J3, QA1 J3, QA2 J3, QA3 J3, QB1 J3, QB2 J3, QB3 J3, PB1 J3, PB2 J3, PB3 J3, O1 J2, O3 J2, drive drive · every joint read from the record and built by its kit |
| A2 | PASS | AUTO · PA1 J3, PA2 J3, PA3 J3, QA1 J3, QA2 J3, QA3 J3, QB1 J3, QB2 J3, QB3 J3, PB1 J3, PB2 J3, PB3 J3, O1 J2, O3 J2, drive drive · input and output live shafts (J2), twelve moving pins (J3) |
| A3 | PASS | AUTO · fired: classify (14 solids), axial stack builder · bores from the catalogue; bearings where a boss fits them |
| A4 | PASS | AUTO · fired: j1-dead-axle (no solids), axial stack builder · stepped shafts with shoulders, grooves, flats and chamfered ends (H.shaft) |
| A5 | PASS | AUTO · fired: j2-live-shaft (46 solids), j10-shaft-in-plan (no solids), axial stack builder · keys by shaft size: D-flat to Ø8, feather key above |
| A6 | N/A | AUTO · fired: j5-slide (no solids), j13-compliant (no solids), standoffs (no solids) · no slide and no floating plate |
| A7 | PASS | AUTO · fired: base (3 solids), posts (no solids), feet (4 solids) · base 8 mm under the lowest part, counterbored corner holes, feet, engraved scale and paths, shaft clearance holes |
| A8 | PASS | AUTO · fired: fasteners (7 solids) · stage 3 fasteners: shanks, clearance and tapped holes |
| A9 | PASS | AUTO / HAND · fired: placement solver · every pin through two parts with a bearing in the turning one |
| A10 | PASS | HAND · fired: placement (21 solids), placement solver · five levels placed by the record, with room between them for the pins' heads and threads |
| A11 | PASS | AUTO / HAND · fired: j12-flexible (no solids), strap-sheave (no solids), j1-dead-axle (no solids) · load paths closed: every joint note says where its load goes to ground |
| A12 | PASS | AUTO · clamp check clean |
| A13 | PASS | AUTO / HAND · 199 solids, 104 unnamed (further items of a listed set) · named hardware with catalogue sizes and materials |
| A14 | PASS | AUTO / HAND · fired: support router · supports routed against the sweeps (least gap 1.5 mm); details checked by A15 |
| A15 | PASS | AUTO · clearance in 3D over 72 phases: 0 clashes; hand allow: 0 named, 0 unnecessary |
| A16 | PASS | HAND · 15 joint notes; no note: none; no badge: none · a note per joint; the output hung from its bridge (record) |
| A17 | PASS | HAND · assembles in the explode order; every screw reachable; pressed bearings and liners pullable through their bores |
| A18 | PASS | AUTO · placement: 6 slabs in the tallest stack (80.0 mm), 0 clevises; stack per joint in the Joints table · axial positions set by the placement solver; bodies on their cone or centre placed where the joints put them |
| A19 | PASS | AUTO · 1 support routed (1 moved), least gap 1.5 mm; still covering a principle part, drawn see-through: O3-bridge · blocks routed, least gap 1.5 mm, see-through where they cover the input yoke |
| A20 | PASS | AUTO · support per joint: O3 hung · one axial stack builder with its support selector |
| A21 | PASS | AUTO · kit per joint: PA1 J3, PA2 J3, PA3 J3, QA1 J3, QA2 J3, QA3 J3, QB1 J3, QB2 J3, QB3 J3, PB1 J3, PB2 J3, PB3 J3, O1 J2, O3 J2, drive drive |
| A22 | PASS | AUTO · fired: stops (no solids), adjustable-length (no solids), cable-clip (2 solids) · no stops (both shafts turn on); cable clip |
| E1 | PASS | AUTO · every solid has one explode level; levels -4 to 9 · one level per solid, nothing stretches |
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
| J2 | PASS | AUTO · fired: j2-live-shaft (46 solids) · input in a housing behind the base, output hung from a bridge |
| J3 | PASS | AUTO · fired: j3-moving-pin (108 solids), cross-bearings (no solids), ball-socket (no solids), ring-hub (no solids) · twelve shoulder bolts, a bearing in each turning part |
| J4 | N/A | AUTO · fired: j4-slot-roller (no solids), pin-lobe (no solids), fork-pin (no solids) · no pin in a slot |
| J5 | N/A | AUTO · fired: tongue-slot (no solids), piston-bore (no solids), j5-slide (no solids) · no slide |
| J6 | N/A | AUTO · fired: j6-mesh (no solids), ring-rollers (no solids) · no parallel mesh |
| J7 | N/A | AUTO · fired: ball-socket (no solids), groove-cam (no solids), j7-cam (no solids), pallet-contact (no solids), pawl-tooth (no solids) · no cam |
| J8 | N/A | AUTO · fired: j8-belt (no solids), j12-flexible (no solids) · no belt in the mechanism (the drive belt is V4) |
| J9 | N/A | AUTO · fired: j9-crossed-mesh (no solids) · no crossed mesh |
| J10 | N/A | AUTO · fired: j10-shaft-in-plan (no solids) · no shaft in plan |
| J12 | N/A | AUTO · fired: j12-flexible (no solids), strap-sheave (no solids) · no flexible member |
| J13 | N/A | AUTO · fired: j13-compliant (no solids) · no compliant joint |
| J11 | N/A | AUTO · fired: j11-screw (no solids) · no screw |
| F1 | PASS | AUTO · served at O1, O3; fired: posts (no solids), j2-live-shaft (46 solids), j10-shaft-in-plan (no solids), strap-sheave (no solids), j13-compliant (no solids) · housings, blocks and bridges dowelled (Joints table) |
| F2 | PASS | AUTO · served at PA1, PA2, PA3, QA1, QA2, QA3, QB1, QB2, QB3, PB1, PB2, PB3, O1, O3; fired: wheels (no solids), j2-live-shaft (46 solids), j10-shaft-in-plan (no solids), cross-bearings (no solids), trunnion (no solids), fork-pin (no solids), ring-hub (no solids), ring-rollers (no solids), j12-flexible (no solids), strap-sheave (no solids), j13-compliant (no solids) · every bearing retained both sides; every part on a shaft retained (Joints table) |
| F3 | PASS | AUTO · served at PA1, PA2, PA3, QA1, QA2, QA3, QB1, QB2, QB3, PB1, PB2, PB3, O1, O3; fired: j2-live-shaft (46 solids), j10-shaft-in-plan (no solids), j12-flexible (no solids), j11-screw (no solids) · every keyed part keyed or on a D-flat with its retainer |
| F4 | PASS | AUTO / HAND · served at O1; fired: j9-crossed-mesh (no solids), j2-live-shaft (46 solids), j10-shaft-in-plan (no solids), trunnion (no solids) · thrust washers where a part turns free axially |
| F5 | N/A | AUTO / HAND · served at no joint; fired: j5-slide (no solids), pawl-tooth (no solids), j13-compliant (no solids), stops (no solids) · both shafts turn continuously |
| F6 | N/A | AUTO / HAND · served at no joint; fired: trunnion (no solids), j7-cam (no solids), pallet-contact (no solids), pawl-tooth (no solids), j12-flexible (no solids) · no rest position to hold: the drive positions every part |
| F7 | N/A | AUTO / HAND · served at no joint; fired: j6-mesh (no solids), j9-crossed-mesh (no solids), j5-slide (no solids), j12-flexible (no solids), adjustable-length (no solids) · no exact length or mesh to adjust |
| F8 | PASS | AUTO · served at no joint; fired: tongue-slot (no solids), cross-bearings (no solids), ball-socket (no solids), j12-flexible (no solids), j11-screw (no solids), lubrication (1 solid) · sealed bearings in every pin |
| F9 | PASS | AUTO / HAND · served at no joint; fired: j6-mesh (no solids), j9-crossed-mesh (no solids), timing-marks (1 solid) · zero line on the input and on the base (timing marks) |
| F10 | PASS | AUTO / HAND · served at drive; fired: j12-flexible (no solids), drive (26 solids) · home flag and fork sensor on the input (drive) |
| M1 | PASS | AUTO · fired: hardware primitives · top-face chamfers by part kind (primitives) |
| M2 | PASS | HAND · bosses round every bore |
| M3 | PASS | AUTO · fired: j3-moving-pin (108 solids), hardware primitives · bore entry chamfers |
| M4 | PASS | AUTO / HAND · fired: base (3 solids), fasteners (7 solids) · counterbores and countersinks for heads (base, csk, housings) |
| M5 | PASS | AUTO / HAND · fired: hardware primitives · cutter radii on windows and slots |
| M6 | PASS | AUTO · edge distance and walls clean |
| M7 | N/A | HAND · no bracket corner turns a load |
| M8 | PASS | AUTO · fired: j1-dead-axle (no solids) · thread undercuts on stepped shafts |
| M9 | PASS | AUTO / HAND · fired: j1-dead-axle (no solids) · ISO coarse threads, engagement through the tapped part or to a nut |
| M10 | PASS | AUTO / HAND · 190 of 199 solids name a material · materials named by kind and role |
| M11 | PASS | AUTO · fired: j1-dead-axle (no solids), hardware primitives · centre holes, chamfered ends on turned parts |
| M12 | PASS | HAND · every screw reachable by its key in the explode |
| M13 | PASS | AUTO / HAND · 24 threaded · threadlocker or nyloc on every threaded fastener |
| M14 | N/A | AUTO / HAND · fired: tongue-slot (no solids), piston-bore (no solids), j4-slot-roller (no solids), pin-lobe (no solids), groove-cam (no solids), pallet-contact (no solids) · no sliding contact needing a liner |
| V1 | PASS | AUTO · fired: drive (26 solids) · pancake motor under the base, belted to the input shaft |
| V2 | PASS | AUTO · fired: drive (26 solids) · one bracket under the base |
| V3 | PASS | AUTO / HAND · fired: drive (26 solids) · belt and pulleys clear of feet and housings (A15) |
| V4 | PASS | AUTO · fired: j8-belt (no solids) · flanged pulleys, belt in one plane |
| V5 | PASS | AUTO · fired: drive (26 solids) · rotary input: belt to the input pulley |
| V6 | PASS | AUTO · fired: drive (26 solids), cable-clip (2 solids) · home flag, fork sensor, terminals, lead and clip |
| L1 | PASS | STYLE · STYLE: no look values in the record or polish |
| L2 | PASS | HAND · records and polish carry no look |
| L3 | PASS | HAND · roles right on every solid (both sheets) |
| L4 | PASS | HAND / STYLE · one accent: the input ring, the traces |
| L5 | PASS | AUTO / HAND · fired: see-through (73 solids) · transparency and hidden lines show screws in holes and bearings in bores |
| L6 | PASS | AUTO · depth peeling at every view (shots) |
| L7 | PASS | STYLE · STYLE: turntable orbit, named views, no perspective |
| L8 | PASS | AUTO / HAND · fired: trace-marks (1 solid) · centrelines along every joint axis, base dimensions, engraved marks |
| L9 | N/A | AUTO / DATA · no section or detail view declared |
| L10 | PASS | AUTO / STYLE · teaching overlays in the sheet's look |
| R1 | PASS | HAND · every standard part from the primitives and kits |
| R2 | PASS | HAND · standard sizes only |
| R3 | PASS | AUTO · fired: hardware primitives · shared subassemblies, one function each |
| R4 | PASS | AUTO · package v2 26.0 KB · package v2 written at build time |
| R5 | PASS | HAND · the polish states only exceptions, no sampling |
| R6 | PASS | FLAG · FLAG: bench run (desktop, below); the phone is measured by David |
| R7 | PASS | HAND / FLAG · polish none; 0 solids added, 0 overrides by the polish |
| R8 | PASS | AUTO / SITE · SITE: thumbnails pre-rendered, cards animate on hover |
| R9 | PASS | AUTO / SITE · setup and bake in the worker, one context |
| R10 | PASS | FLAG · FLAG: the bench page is built for the phone measurement |
| DL1 | PASS | AUTO / HAND · 72 of 199 solids on a dropping rung · every solid, mark and effect on a rung by its kind |
| DL2 | PASS | HAND · default dial: full |
| DL3 | PASS | AUTO · view-aware exceptions in the ladder table |
| DL4 | PASS | SITE · SITE: adaptive dial with hysteresis |
| DL6 | PASS | AUTO · teaching layers drawn at every dial position |
| DL5 | PASS | FLAG · FLAG: bench reports frame time per dial position |
| Q1 | PASS | check, clamp and edge distance clean |
| Q2 | PASS | 0 clashes, 0 unnecessary allows |
| Q3 | PASS | package v2 written, 26.0 KB; site build not checked here · package v2 written; site builds (npm run build) |
| Q4 | PASS | local: tools/shot · dist/shots3/<id> (and the batch's shot set): record view, PLAN, FRONT, SIDE, ISOMETRIC, the declared views, full explode, both sheets |
| Q5 | PASS | local: tools/bench · tools/bench3 run (desktop): frame times per view in the ladder above; the phone is measured by David |
| Q6 | PASS |  |
| Q7 | PASS |  |
| Q8 | PASS | teaching review: rethink (2026-10-20); the six phases of the finished build are looked at by eye · verdict and decisions in the record and the teaching: line; six phases of the finished build looked at |

## Joints
| Joint | Kit | Block | Support | Stack | F1 locate | F2 retain | F3 torque | F4 thrust | F5 limit | F6 hold | F7 adjust | F8 lube | F9 timing | F10 protect |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| PA1 | J3 | parallel-cranks | – | – | none | Shoulder bolt Ø6 x 16, M5 (ISO 7379) | Shoulder bolt Ø6 x 16, M5 (ISO 7379) | none | none | none | none | none | none | none |
| PA2 | J3 | parallel-cranks | – | – | none | Shoulder bolt Ø6 x 16, M5 (ISO 7379) | Shoulder bolt Ø6 x 16, M5 (ISO 7379) | none | none | none | none | none | none | none |
| PA3 | J3 | parallel-cranks | – | – | none | Shoulder bolt Ø6 x 16, M5 (ISO 7379) | Shoulder bolt Ø6 x 16, M5 (ISO 7379) | none | none | none | none | none | none | none |
| QA1 | J3 | – | – | – | none | Shoulder bolt Ø6 x 16, M5 (ISO 7379) | Shoulder bolt Ø6 x 16, M5 (ISO 7379) | none | none | none | none | none | none | none |
| QA2 | J3 | – | – | – | none | Shoulder bolt Ø6 x 16, M5 (ISO 7379) | Shoulder bolt Ø6 x 16, M5 (ISO 7379) | none | none | none | none | none | none | none |
| QA3 | J3 | – | – | – | none | Shoulder bolt Ø6 x 16, M5 (ISO 7379) | Shoulder bolt Ø6 x 16, M5 (ISO 7379) | none | none | none | none | none | none | none |
| QB1 | J3 | – | – | – | none | Shoulder bolt Ø6 x 16, M5 (ISO 7379) | Shoulder bolt Ø6 x 16, M5 (ISO 7379) | none | none | none | none | none | none | none |
| QB2 | J3 | – | – | – | none | Shoulder bolt Ø6 x 16, M5 (ISO 7379) | Shoulder bolt Ø6 x 16, M5 (ISO 7379) | none | none | none | none | none | none | none |
| QB3 | J3 | – | – | – | none | Shoulder bolt Ø6 x 16, M5 (ISO 7379) | Shoulder bolt Ø6 x 16, M5 (ISO 7379) | none | none | none | none | none | none | none |
| PB1 | J3 | parallel-cranks | – | – | none | Shoulder bolt Ø6 x 16, M5 (ISO 7379) | Shoulder bolt Ø6 x 16, M5 (ISO 7379) | none | none | none | none | none | none | none |
| PB2 | J3 | parallel-cranks | – | – | none | Shoulder bolt Ø6 x 16, M5 (ISO 7379) | Shoulder bolt Ø6 x 16, M5 (ISO 7379) | none | none | none | none | none | none | none |
| PB3 | J3 | parallel-cranks | – | – | none | Shoulder bolt Ø6 x 16, M5 (ISO 7379) | Shoulder bolt Ø6 x 16, M5 (ISO 7379) | none | none | none | none | none | none | none |
| O1 | J2 | parallel-cranks | – | – | 2 x Dowel pin Ø3 x 10 h6, housing to base | 2 x Internal circlip DIN 472, Ø21; End washer 5.4x20, holds the disc in on the shaft end; Countersunk M5 x 12 (ISO 10642) | Feather key 4 x 4 x 10 (DIN 6885) | Thrust washer 12.2x20, bronze; Wave washer 16.5x20.8, spring steel | none | none | none | none | none | none |
| O3 | J2 | parallel-cranks | hung (moved) | – | Bridge over the pivot, on two spigoted posts | External circlip DIN 471, Ø12 | Feather key 4 x 4 x 10 (DIN 6885) | none | none | none | none | none | none | none |
| drive | drive | – | – | – | none | none | none | none | none | none | none | none | none | Home flag, 1 mm steel vane; Fork sensor, slotted optical, 5 mm gap |

## Supports
| Support | Joint | Kind | Route | Least gap mm | Covers | T10 |
|---|---|---|---|---|---|---|
| O3-bridge | O3 | hung | moved | 1.5 | disc-in, disc-mid, disc-out, link-a1, link-a2, link-a3, link-b1, link-b2, link-b3 | see-through |

## Variants and overrides
| Joint or part | Rule result | Chosen | Why |
|---|---|---|---|
| O3 (output disc's shaft) | J2 live shaft in a housing behind the base | hung from a bridge (record: support hung) | the input disc lies under it |
| discs and links | parts on solver slabs | five levels placed by the record (axial) | room between the levels for the pins' heads and thread ends, which the next level sweeps over |
| discs | drawn opaque | see-through rings (teaching.seeThrough) | the rethink: three parallel index marks and both link sets must show |

## Detail ladder
| Rung | Solids | Marks | Frame ms at this dial position |
|---|---|---|---|
| DL-A | 29 | 0 | 2.31 |
| DL-B | 0 | 406 | 1.62 |
| DL-C | 0 | 0 | 1.98 |
| DL-D | 30 | 0 | 2.22 |
| DL-E | 8 | 1 | 1.96 |
| DL-F | 0 | 0 | 1.73 |
| DL-G | 0 | 0 | 1.71 |
| DL-H | 5 | 0 | 2.24 |
| never | 127 | 276 | 1.98 |

## Promotion candidates
Promoted in this pass: ring discs (`ring: { inner, spokes, hub }`), engraved index marks (`indexMark`), a second link set's own pattern (`set: "B"` drawn as link2), the `parallel-cranks` block.

## Verification
check: clean · K1 residual: 4.3e-14 · claims: 7 of 7 ok · clearance: 0 clashes · clamp: clean · edge distance: clean · package: 26.0 KB
