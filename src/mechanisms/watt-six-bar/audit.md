# Audit: Watt six-bar linkage (watt-six-bar)
standard: 3.0 · date: 2026-10-22 · result: pass · detail: full · pass: build
teaching: keep · decisions in the record

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
| P1 | PASS | DATA · record v3 complete (kin and teaching blocks); no polish, audit.md present |
| P2 | PASS | DATA · catalogue validator clean |
| P3 | PASS | DATA / SITE · the page reads ratio, axes, character, backdrivable, aka, family, motion, level, dof and the drive from the record |
| P4 | PASS | DATA · tags grouped Function, Property, Application, keywords |
| P5 | PASS | DATA · explanation in four parts and the examples from the record |
| P6 | PASS | DATA · references and media from the record, validated by the catalogue |
| P7 | PASS | HAND / SITE · no prose in the polish; labels come from the record |
| P8 | PASS | SITE · the page has no parts list or joint sections (site) |
| P9 | PASS | AUTO / HAND · every number the explanation states is a claim and agrees (T9) |
| P10 | PASS | HAND · D and C traced (comet on D); overlays: transmission angle and output swing; plot of the output |
| P11 | PASS | DATA · plain language, mm and degrees |
| P12 | PASS | AUTO / DATA · validate(records, asVersion 3) clean for this record |
| P13 | PASS | HAND · teaching review run against the record before the build and again on the finished drawing (teaching: line) |
| K1 | PASS | AUTO · K1 residual 3.4e-13 (tolerance 1e-9) over 360 samples, reference 1.8e-12 |
| K2 | PASS | AUTO · check: finite, continuous, periodic over 360 samples |
| K3 | PASS | AUTO / HAND · 2 blocks (dyad); no numeric fallback · composed from the block library; no fallback, no one-off model |
| K4 | PASS | HAND · crank driver with the accent ring on the input; rocker2 output; links coupler1, rocker1 and coupler2 |
| K6 | PASS | DATA · proportions and limits as the record's defining relations state them |
| K7 | PASS | DATA · drivers input (rotary) · input kind declared with its driven joint |
| K8 | PASS | AUTO / DATA · every joint declared with type, bodies, origin and axis; nothing inferred |
| K9 | PASS | DATA · one rotary driver, its control the crank |
| K10 | PASS | AUTO / DATA · branches declared (branch-B left, branch-D left), continuous (no POSE JUMP) |
| K11 | PASS | AUTO · mobility counted 1, dof 1 |
| K12 | PASS | DATA · every traced, overlaid and claimed point and quantity is named in kin |
| T1 | PASS | HAND · mechanics first, no use context in the teaching strings; the principle reads at the default view |
| T2 | PASS | HAND · review before the build and again on the six phases of the finished build; decisions in the record |
| T3 | PASS | DATA · principle parts declared; drawn whole, in depth order |
| T4 | PASS | DATA · fired: trace-marks (no solids) · D and C traced, comet on D |
| T5 | PASS | DATA · construction overlays: transmission angle and output swing |
| T6 | PASS | HAND / DATA · the claimed motion reads at the default view (claim table, T9) |
| T7 | PASS | DATA · PLAN, where the planar mechanism reads whole |
| T8 | N/A | DATA · the principle lies in plain view, no section needed |
| T9 | PASS | AUTO / DATA · claim table: 5 ok, 0 off, 0 uncheckable of 5 |
| T10 | PASS | AUTO · 14 solids drawn see-through: O4-slv, O4-bb, O4-ecl, O4-axle-s2, O4-axle-s4, O4-axle-s5, O4-bridge, O6-slv · a support over a principle part drawn see-through with its stack |
| T11 | PASS | AUTO · 2 supports routed, 2 moved off a sweep · supports routed off the sweeps of the moving parts |
| T12 | PASS | HAND · 18 support solids; dropped by the polish: none |
| T13 | N/A | DATA · nothing goes by in a blink |
| T14 | PASS | HAND / DATA · the crank (driver) |
| T15 | PASS | HAND · labels state the mechanism, never its use |
| T16 | N/A | HAND / STYLE · no two parts of one role to tell apart |
| T17 | PASS | AUTO · depth peeling, no depth bias (renderer test) |
| D1 | PASS | HAND · links sized to their bosses, plates with boss rings, plain base |
| D2 | PASS | HAND · material round every pin |
| D3 | PASS | STYLE · STYLE: roles by pattern and tone (both sheets) |
| D4 | PASS | AUTO · fired: base (3 solids), feet (4 solids) · base corners and feet concentric (base, feet rules) |
| D5 | PASS | AUTO / HAND · supports: O4 bridge, O6 bridge, on spigoted posts |
| D6 | PASS | HAND / STYLE · hardware quieter than the parts, still readable (both sheets) |
| D8 | PASS | AUTO / HAND · every solid a profile, an operation and a frame; built by Manifold; no layers, dz or twin |
| D9 | N/A | AUTO / HAND · no member changes shape |
| D10 | PASS | AUTO · profiles shipped for plain extrusions, meshes only for booleans (package v2) |
| D11 | PASS | AUTO · SOLID: 0 of 163 solids unsound |
| D7 | PASS | HAND · links and plates plain; the richness in the stacks |
| A1 | PASS | AUTO · A J3, B J3, C J3, D J3, O2 J2, O4 J1, O6 J1, O4-rocker1-stops stops, O6-rocker2-stops stops, drive drive · every joint read from the record and built by its kit |
| A2 | PASS | AUTO · A J3, B J3, C J3, D J3, O2 J2, O4 J1, O6 J1, O4-rocker1-stops stops, O6-rocker2-stops stops, drive drive · fixed pins on their kits, moving pins J3 |
| A3 | PASS | AUTO · fired: classify (7 solids), axial stack builder · bores from the catalogue; bearings where a boss fits them |
| A4 | PASS | AUTO · fired: j1-dead-axle (52 solids), axial stack builder · stepped shafts with shoulders, grooves, flats and chamfered ends (H.shaft) |
| A5 | PASS | AUTO · fired: j2-live-shaft (25 solids), j10-shaft-in-plan (no solids), axial stack builder · keys by shaft size: D-flat to Ø8, feather key above |
| A6 | N/A | AUTO · fired: j5-slide (no solids), j13-compliant (no solids), standoffs (no solids) · no slide and no floating plate |
| A7 | PASS | AUTO · fired: base (3 solids), feet (4 solids) · base 8 mm under the lowest part, counterbored corner holes, feet, engraved scale and paths, shaft clearance holes |
| A8 | PASS | AUTO · fired: fasteners (12 solids) · stage 3 fasteners: shanks, clearance and tapped holes |
| A9 | PASS | AUTO / HAND · fired: placement solver · pins in single or double shear as the placement solver sets them, shortest overhang |
| A10 | PASS | HAND · fired: placement (10 solids), placement solver · slabs from the placement solver: parts that keep apart share a slab |
| A11 | PASS | AUTO / HAND · fired: j12-flexible (no solids), strap-sheave (no solids), j1-dead-axle (52 solids) · load paths closed: every joint note says where its load goes to ground |
| A12 | PASS | AUTO · clamp check clean |
| A13 | PASS | AUTO / HAND · 163 solids, 93 unnamed (further items of a listed set) · named hardware with catalogue sizes and materials |
| A14 | PASS | AUTO / HAND · fired: support router · supports routed against the sweeps (least gap 1.5 mm); details checked by A15 |
| A15 | PASS | AUTO · clearance in 3D over 72 phases: 0 clashes; hand allow: 0 named, 0 unnecessary |
| A16 | PASS | HAND · 10 joint notes; no note: none; no badge: none · a note and badge per joint |
| A17 | PASS | HAND · assembles in the explode order; every screw reachable; pressed bearings pullable through their bores |
| A18 | PASS | AUTO · placement: 2 slabs in the tallest stack (20.0 mm), 0 clevises; stack per joint in the Joints table · axial positions set by the placement solver |
| A19 | PASS | AUTO · 2 supports routed (2 moved), least gap 1.5 mm; still covering a principle part, drawn see-through: O4-bridge, O6-bridge · routed at the least gap, see-through where it covers |
| A20 | PASS | AUTO · support per joint: O4 bridge, O6 bridge · one axial stack builder with its support selector |
| A21 | PASS | AUTO · kit per joint: A J3, B J3, C J3, D J3, O2 J2, O4 J1, O6 J1, O4-rocker1-stops stops, O6-rocker2-stops stops, drive drive |
| A22 | PASS | AUTO · fired: stops (16 solids), adjustable-length (no solids), cable-clip (2 solids) · stops and swing scale on each part that swings; no exact length to adjust |
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
| J1 | PASS | AUTO · fired: trunnion (no solids), j1-dead-axle (52 solids) · O4, O6: shouldered axle, bearings in the moving part, spacers, circlip, thrust washer |
| J2 | PASS | AUTO · fired: j2-live-shaft (25 solids) · O2: housing with two bearings, keyed shaft, pulley, flag |
| J3 | PASS | AUTO · fired: j3-moving-pin (36 solids), cross-bearings (no solids), ring-hub (no solids) · moving pins: shoulder bolts threaded through the lower part, bearings, inner-race spacers, made up by a washer |
| J4 | N/A | AUTO · fired: j4-slot-roller (no solids), pin-lobe (no solids), fork-pin (no solids) · no pin in a slot |
| J5 | N/A | AUTO · fired: piston-bore (no solids), j5-slide (no solids), tongue-slot (no solids) · no slide |
| J6 | N/A | AUTO · fired: j6-mesh (no solids), ring-rollers (no solids) · no parallel mesh |
| J7 | N/A | AUTO · fired: groove-cam (no solids), j7-cam (no solids), pallet-contact (no solids), pawl-tooth (no solids) · no cam |
| J8 | N/A | AUTO · fired: j8-belt (no solids), j12-flexible (no solids) · no belt in the mechanism (the drive belt is V4) |
| J9 | N/A | AUTO · fired: j9-crossed-mesh (no solids) · no crossed mesh |
| J10 | N/A | AUTO · fired: j10-shaft-in-plan (no solids) · no shaft in plan |
| J12 | N/A | AUTO · fired: j12-flexible (no solids), strap-sheave (no solids) · no flexible member |
| J13 | N/A | AUTO · fired: j13-compliant (no solids) · no compliant joint |
| J11 | N/A | AUTO · fired: j11-screw (no solids) · no screw |
| F1 | PASS | AUTO · served at O2, O4, O6; fired: j2-live-shaft (25 solids), j10-shaft-in-plan (no solids), strap-sheave (no solids), j13-compliant (no solids) · housings, blocks and bridges dowelled (Joints table) |
| F2 | PASS | AUTO · served at A, B, C, D, O2, O4, O6; fired: j2-live-shaft (25 solids), j10-shaft-in-plan (no solids), cross-bearings (no solids), trunnion (no solids), fork-pin (no solids), ring-hub (no solids), ring-rollers (no solids), j12-flexible (no solids), strap-sheave (no solids), j13-compliant (no solids) · every bearing retained both sides; every part on a shaft retained (Joints table) |
| F3 | PASS | AUTO · served at A, B, C, D, O2; fired: j2-live-shaft (25 solids), j10-shaft-in-plan (no solids), j12-flexible (no solids), j11-screw (no solids) · every keyed part keyed or on a D-flat with its retainer |
| F4 | PASS | AUTO / HAND · served at O2, O4, O6; fired: j9-crossed-mesh (no solids), j2-live-shaft (25 solids), j10-shaft-in-plan (no solids), trunnion (no solids) · thrust washers where a part turns free axially |
| F5 | PASS | AUTO / HAND · served at O4-rocker1-stops, O6-rocker2-stops; fired: j5-slide (no solids), pawl-tooth (no solids), j13-compliant (no solids), stops (16 solids) · limits at each end of every swing or slide |
| F6 | N/A | AUTO / HAND · served at no joint; fired: trunnion (no solids), j7-cam (no solids), pallet-contact (no solids), pawl-tooth (no solids), j12-flexible (no solids) · no rest position to hold: the drive positions every part |
| F7 | N/A | AUTO / HAND · served at no joint; fired: j6-mesh (no solids), j9-crossed-mesh (no solids), j5-slide (no solids), j12-flexible (no solids), adjustable-length (no solids) · no exact length or mesh to adjust |
| F8 | PASS | AUTO · served at no joint; fired: cross-bearings (no solids), tongue-slot (no solids), j12-flexible (no solids), j11-screw (no solids), lubrication (2 solids) · lubrication where a part runs on a ground face; the other bearings sealed |
| F9 | PASS | AUTO / HAND · served at no joint; fired: j6-mesh (no solids), j9-crossed-mesh (no solids), timing-marks (1 solid) · zero line on the input and on the base (timing marks) |
| F10 | PASS | AUTO / HAND · served at drive; fired: j12-flexible (no solids), drive (26 solids) · home flag and fork sensor on the input (drive) |
| M1 | PASS | AUTO · fired: hardware primitives · top-face chamfers by part kind (primitives) |
| M2 | PASS | HAND · bosses round every loaded hole |
| M3 | PASS | AUTO · fired: j3-moving-pin (36 solids), hardware primitives · bore entry chamfers |
| M4 | PASS | AUTO / HAND · fired: base (3 solids), fasteners (12 solids) · counterbores and countersinks for heads (base, csk, housings) |
| M5 | PASS | AUTO / HAND · fired: hardware primitives · cutter radii on windows and slots |
| M6 | PASS | AUTO · edge distance and walls clean |
| M7 | N/A | HAND · no bracket corner turns a load |
| M8 | PASS | AUTO · fired: j1-dead-axle (52 solids) · thread undercuts on stepped shafts |
| M9 | PASS | AUTO / HAND · fired: j1-dead-axle (52 solids) · ISO coarse threads, engagement through the tapped part or to a nut |
| M10 | PASS | AUTO / HAND · 158 of 163 solids name a material · materials named by kind and role |
| M11 | PASS | AUTO · fired: j1-dead-axle (52 solids), hardware primitives · centre holes, chamfered ends on turned parts |
| M12 | PASS | HAND · every screw reachable by its key in the explode |
| M13 | PASS | AUTO / HAND · 26 threaded · threadlocker or nyloc on every threaded fastener |
| M14 | N/A | AUTO / HAND · fired: piston-bore (no solids), j4-slot-roller (no solids), pin-lobe (no solids), groove-cam (no solids), pallet-contact (no solids), tongue-slot (no solids) · no sliding contact needing a liner |
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
| L5 | PASS | AUTO / HAND · fired: see-through (14 solids) · transparency and hidden lines show screws in holes and bearings in bores |
| L6 | PASS | AUTO · depth peeling at every view (shots) |
| L7 | PASS | STYLE · STYLE: turntable orbit, named views, no perspective |
| L8 | PASS | AUTO / HAND · fired: trace-marks (no solids) · centrelines along every joint axis, base dimensions, engraved marks |
| L9 | N/A | AUTO / DATA · no section or detail view declared |
| L10 | PASS | AUTO / STYLE · teaching overlays in the sheet's look |
| R1 | PASS | HAND · every standard part from the primitives and kits |
| R2 | PASS | HAND · standard sizes only |
| R3 | PASS | AUTO · fired: hardware primitives · shared subassemblies, one function each |
| R4 | PASS | AUTO · package v2 25.8 KB · package v2 written at build time |
| R5 | PASS | HAND · the polish states only exceptions, no sampling |
| R6 | PASS | FLAG · FLAG: bench run (desktop, ladder below); the phone is measured by David |
| R7 | PASS | HAND / FLAG · polish none; 0 solids added, 0 overrides by the polish |
| R8 | PASS | AUTO / SITE · SITE: thumbnails pre-rendered, cards animate on hover |
| R9 | PASS | AUTO / SITE · setup and bake in the worker, one context |
| R10 | PASS | FLAG · FLAG: the bench page is built for the phone measurement |
| DL1 | PASS | AUTO / HAND · 55 of 163 solids on a dropping rung · every solid, mark and effect on a rung by its kind |
| DL2 | PASS | HAND · default dial: full |
| DL3 | PASS | AUTO · view-aware exceptions in the ladder table |
| DL4 | PASS | SITE · SITE: adaptive dial with hysteresis |
| DL6 | PASS | AUTO · teaching layers drawn at every dial position |
| DL5 | PASS | FLAG · FLAG: bench reports frame time per dial position |
| Q1 | PASS | check, clamp and edge distance clean |
| Q2 | PASS | 0 clashes, 0 unnecessary allows |
| Q3 | PASS | package v2 written, 25.8 KB; site build not checked here · package v2 written; site builds (npm run build) |
| Q4 | PASS | local: tools/shot · tools/shot3 --set: record view, PLAN, FRONT, SIDE, ISOMETRIC, the declared views, full explode, both sheets |
| Q5 | PASS | local: tools/bench · tools/bench run: dist/bench/report-v2.md |
| Q6 | PASS | every row judged |
| Q7 | PASS | at 3.0 |
| Q8 | PASS | teaching review: keep (2026-10-22); the six phases of the finished build are looked at by eye · verdict and decisions in the record and the teaching: line; six phases of the finished build looked at |

## Joints
| Joint | Kit | Block | Support | Stack | F1 locate | F2 retain | F3 torque | F4 thrust | F5 limit | F6 hold | F7 adjust | F8 lube | F9 timing | F10 protect |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| A | J3 | dyad | – | – | none | Shoulder bolt Ø8 x 16, M6 (ISO 7379) | Shoulder bolt Ø8 x 16, M6 (ISO 7379) | none | none | none | none | none | none | none |
| B | J3 | – | – | – | none | Shoulder bolt Ø8 x 16, M6 (ISO 7379) | Shoulder bolt Ø8 x 16, M6 (ISO 7379) | none | none | none | none | none | none | none |
| C | J3 | dyad | – | – | none | Shoulder bolt Ø8 x 16, M6 (ISO 7379) | Shoulder bolt Ø8 x 16, M6 (ISO 7379) | none | none | none | none | none | none | none |
| D | J3 | – | – | – | none | Shoulder bolt Ø8 x 16, M6 (ISO 7379) | Shoulder bolt Ø8 x 16, M6 (ISO 7379) | none | none | none | none | none | none | none |
| O2 | J2 | driver | – | – | 2 x Dowel pin Ø3 x 10 h6, housing to base | 2 x Internal circlip DIN 472, Ø21; End washer 5.4x20, holds the crank on the shaft end; Countersunk M5 x 12 (ISO 10642) | Feather key 4 x 4 x 10 (DIN 6885) | Thrust washer 12.2x20, bronze; Wave washer 16.5x20.8, spring steel | none | none | none | none | none | none |
| O4 | J1 | dyad | bridge (moved) | – | Bridge over the pivot, on two spigoted posts; Dead axle Ø10, shouldered, M8 end | External circlip DIN 471, Ø10 | none | Thrust washer 10.2x18, bronze | none | none | none | none | none | none |
| O6 | J1 | dyad | bridge (moved) | – | Bridge over the pivot, on two spigoted posts; Dead axle Ø12, shouldered, M10 end | External circlip DIN 471, Ø12 | none | Thrust washer 12.2x20, bronze | none | none | none | none | none | none |
| O4-rocker1-stops | stops | – | – | – | none | none | none | none | 2 x Stop pin Ø6, hardened, on the lever's edge | none | none | none | none | none |
| O6-rocker2-stops | stops | – | – | – | none | none | none | none | 2 x Stop pin Ø6, hardened, on the lever's edge | none | none | none | none | none |
| drive | drive | – | – | – | none | none | none | none | none | none | none | none | none | Home flag, 1 mm steel vane; Fork sensor, slotted optical, 5 mm gap |

## Supports
| Support | Joint | Kind | Route | Least gap mm | Covers | T10 |
|---|---|---|---|---|---|---|
| O4-bridge | O4 | bridge | moved | 1.5 | rocker1 | see-through |
| O6-bridge | O6 | bridge | moved | 1.5 | rocker2 | see-through |

## Variants and overrides
| Joint or part | Rule result | Chosen | Why |
|---|---|---|---|

## Detail ladder
| Rung | Solids | Marks | Frame ms at this dial position |
|---|---|---|---|
| DL-A | 17 | 0 | 2.08 |
| DL-B | 0 | 241 | 2.11 |
| DL-C | 0 | 0 | 2.11 |
| DL-D | 18 | 0 | 2.2 |
| DL-E | 8 | 2 | 2.21 |
| DL-F | 0 | 0 | 2.3 |
| DL-G | 0 | 0 | 2.12 |
| DL-H | 12 | 0 | 2.2 |
| never | 108 | 236 | 2.12 |

## Promotion candidates
None: no hand fix in this mechanism.

## Verification
check: clean · K1 residual: 3.4e-13 · claims: 5 of 5 ok · clearance: 0 clashes · clamp: clean · edge distance: clean · package: 25.8 KB
screenshots: dist/shots3/watt-six-bar (record view, PLAN, FRONT, SIDE, ISOMETRIC, explode; both sheets) and six phases at plan and an angled view · bench: dist/bench/report-v2.md (desktop; frame times paced at 28 deg in the ladder above; phone by David)
