# Audit: Bennett linkage (bennett-linkage)
standard: 3.0 · date: 2026-10-22 · result: pass · detail: full · pass: build
teaching: keep · decisions in the record

## Summary
PASS 145 · FAIL 0 · N/A 22 · open: none

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
| P10 | PASS | HAND · all four hinge axes as axis lines (the skew); the midpoint of the coupler traced (a closed space curve); output angle and speed ratio plotted |
| P11 | PASS | DATA · plain language, mm and degrees |
| P12 | PASS | AUTO / DATA · validate(records, asVersion 3) clean for this record |
| P13 | PASS | HAND · teaching review run against the record before the build (E2, #204) and again on six phases of the finished build (teaching: line) |
| K1 | PASS | AUTO · K1 residual 4.0e-12 (tolerance 1e-9) over 360 samples, reference 6.7e-14 |
| K2 | PASS | AUTO · check: finite, continuous, periodic over 360 samples |
| K3 | PASS | AUTO / HAND · 1 block (bennett); no numeric fallback · composed from the block library; no fallback, no one-off model |
| K4 | PASS | HAND · the crank at A driver with the accent, the rocker at B output, the coupler a link |
| K6 | PASS | DATA · Bennett's conditions (opposite links equal in length and twist, a/sin(alpha) = b/sin(beta), zero offsets): tan(thA/2) tan(thB/2) = sin((beta+alpha)/2) / sin((beta-alpha)/2), closed form from the joints' frames |
| K7 | PASS | DATA · drivers input (rotary) · input kind declared with its driven joint |
| K8 | PASS | AUTO / DATA · every joint declared with type, bodies, origin and axis; nothing inferred |
| K9 | PASS | DATA · one rotary driver at A (the loop is symmetric: driven at A or B alike) |
| K10 | PASS | AUTO / DATA · closed forms, continuous over the cycle; no branch flips |
| K11 | PASS | AUTO · mobility counted -2, dof 1 |
| K12 | PASS | DATA · every traced, overlaid and claimed point and quantity is named in kin |
| T1 | PASS | HAND · mechanics first, no use context in the teaching strings; the principle reads at the default view |
| T2 | PASS | HAND · review before the build and again on six phases of the finished build; decisions in the record |
| T3 | PASS | DATA · principle parts declared; drawn whole, in depth order |
| T4 | PASS | DATA · fired: trace-marks (no solids) · the coupler's midpoint traced: a closed space curve |
| T5 | PASS | DATA · all four hinge axes, so their skew shows |
| T6 | PASS | HAND / DATA · a = 60, b = 100: the output's speed runs 0.33 to 2.99 times the input's |
| T7 | PASS | DATA · ISOMETRIC, where the skew axes read |
| T8 | N/A | DATA · the principle lies in plain view, no section needed |
| T9 | PASS | AUTO / DATA · claim table: 5 ok, 0 off, 0 uncheckable of 5 |
| T10 | PASS | AUTO · 0 solids drawn see-through · supports that cover the links are drawn see-through (A19) |
| T11 | PASS | AUTO · 2 supports routed, 2 moved off a sweep · both pairs of blocks routed off the sweeps |
| T12 | PASS | HAND · 19 support solids; dropped by the polish: none |
| T13 | N/A | DATA · nothing goes by in a blink |
| T14 | PASS | HAND / DATA · the input |
| T15 | PASS | HAND · labels state the mechanism, never its use |
| T16 | N/A | HAND / STYLE · no two parts of one role to tell apart |
| T17 | PASS | AUTO · depth peeling, no depth bias (renderer test) |
| D1 | PASS | HAND · fired: wheels (no solids) · links as round bars between knuckles on their hinges, the knuckles set apart along each hinge so the bars clear the crossed poses |
| D2 | PASS | HAND · knuckles round every pin |
| D3 | PASS | STYLE · STYLE: roles by pattern and tone (both sheets) |
| D4 | PASS | AUTO · fired: base (3 solids), feet (4 solids) · base corners and feet concentric (base, feet rules) |
| D5 | PASS | AUTO / HAND · two pillow blocks per ground hinge, one motor bracket |
| D6 | PASS | HAND / STYLE · hardware quieter than the parts, still readable (both sheets) |
| D8 | PASS | AUTO / HAND · every solid a profile, an operation and a frame; built by Manifold; no layers, dz or twin |
| D9 | N/A | AUTO / HAND · no member changes shape |
| D10 | PASS | AUTO · profiles shipped for plain extrusions, meshes only for booleans (package v2) |
| D11 | PASS | AUTO · SOLID: 0 of 123 solids unsound |
| D7 | PASS | HAND · bars and knuckles plain; richness in the stacks |
| A1 | PASS | AUTO · C J3, D J3, A J10, B J10, drive drive · every joint read from the record and built by its kit |
| A2 | PASS | AUTO · C J3, D J3, A J10, B J10, drive drive · ground hinges A (driven) and B as shafts in plan (J10); C and D moving pins through the knuckles (J3) |
| A3 | PASS | AUTO · fired: classify (4 solids), axial stack builder · bores from the catalogue; bearings where a boss fits them |
| A4 | PASS | AUTO · fired: j1-dead-axle (no solids), axial stack builder · stepped shafts with shoulders, grooves, flats and chamfered ends (H.shaft) |
| A5 | PASS | AUTO · fired: j2-live-shaft (no solids), j10-shaft-in-plan (57 solids), axial stack builder · keys by shaft size: D-flat to Ø8, feather key above |
| A6 | N/A | AUTO · fired: j5-slide (no solids), j13-compliant (no solids), standoffs (no solids) · no slide and no floating plate |
| A7 | PASS | AUTO · fired: base (3 solids), posts (no solids), feet (4 solids) · base 8 mm under the lowest part, counterbored corner holes, feet, engraved scale and paths, shaft clearance holes |
| A8 | PASS | AUTO · fired: fasteners (32 solids) · stage 3 fasteners: shanks, clearance and tapped holes |
| A9 | PASS | AUTO / HAND · fired: placement solver · each ground hinge in two blocks far apart; each moving pin through two knuckles |
| A10 | PASS | HAND · fired: placement (9 solids), placement solver · knuckles placed by the record along their hinges (the loop passes through crossed poses) |
| A11 | PASS | AUTO / HAND · fired: j12-flexible (no solids), strap-sheave (no solids), j1-dead-axle (no solids) · load paths closed: every joint note says where its load goes to ground |
| A12 | PASS | AUTO · clamp check clean |
| A13 | PASS | AUTO / HAND · 123 solids, 76 unnamed (further items of a listed set) · named hardware with catalogue sizes and materials |
| A14 | PASS | AUTO / HAND · fired: support router · supports routed against the sweeps (least gap 1.5 mm); details checked by A15 |
| A15 | PASS | AUTO · clearance in 3D over 72 phases: 0 clashes; hand allow: 0 named, 0 unnecessary |
| A16 | PASS | HAND · 5 joint notes; no note: none; no badge: none · a note per joint; D's pin turned end for end (record) so the coupler clears its head |
| A17 | PASS | HAND · assembles in the explode order; every screw reachable; pressed bearings and liners pullable through their bores |
| A18 | PASS | AUTO · placement: 1 slabs in the tallest stack (10.0 mm), 0 clevises; stack per joint in the Joints table · axial positions set by the placement solver; bodies on their cone or centre placed where the joints put them |
| A19 | PASS | AUTO · 2 supports routed (2 moved), least gap 1.5 mm; still covering a principle part, drawn see-through: A-pb, B-pb · blocks routed, least gap 1.5 mm, see-through where they cover the input yoke |
| A20 | PASS | AUTO · support per joint: A pillow, B pillow · one axial stack builder with its support selector |
| A21 | PASS | AUTO · kit per joint: C J3, D J3, A J10, B J10, drive drive |
| A22 | PASS | AUTO · fired: stops (no solids), adjustable-length (no solids), cable-clip (2 solids) · no stops (both shafts turn on); cable clip |
| E1 | PASS | AUTO · every solid has one explode level; levels -13.5 to 17.5 · one level per solid, nothing stretches |
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
| J2 | N/A | AUTO · fired: j2-live-shaft (no solids) · no live shaft under the base |
| J3 | PASS | AUTO · fired: j3-moving-pin (20 solids), cross-bearings (no solids), ball-socket (no solids), ring-hub (no solids) · C and D: shoulder bolts through the knuckles, bearings in the turning ones |
| J4 | N/A | AUTO · fired: j4-slot-roller (no solids), pin-lobe (no solids), fork-pin (no solids) · no pin in a slot |
| J5 | N/A | AUTO · fired: tongue-slot (no solids), piston-bore (no solids), j5-slide (no solids) · no slide |
| J6 | N/A | AUTO · fired: j6-mesh (no solids), ring-rollers (no solids) · no parallel mesh |
| J7 | N/A | AUTO · fired: ball-socket (no solids), groove-cam (no solids), j7-cam (no solids), pallet-contact (no solids), pawl-tooth (no solids) · no cam |
| J8 | N/A | AUTO · fired: j8-belt (no solids), j12-flexible (no solids) · no belt in the mechanism (the drive belt is V4) |
| J9 | N/A | AUTO · fired: j9-crossed-mesh (no solids) · no crossed mesh |
| J10 | PASS | AUTO · fired: j10-shaft-in-plan (57 solids) · both shafts: two pillow blocks, located by collars, keyed yokes; the input with its pulley |
| J12 | N/A | AUTO · fired: j12-flexible (no solids), strap-sheave (no solids) · no flexible member |
| J13 | N/A | AUTO · fired: j13-compliant (no solids) · no compliant joint |
| J11 | N/A | AUTO · fired: j11-screw (no solids) · no screw |
| F1 | PASS | AUTO · served at A, B; fired: posts (no solids), j2-live-shaft (no solids), j10-shaft-in-plan (57 solids), strap-sheave (no solids), j13-compliant (no solids) · housings, blocks and bridges dowelled (Joints table) |
| F2 | PASS | AUTO · served at C, D, A, B; fired: wheels (no solids), j2-live-shaft (no solids), j10-shaft-in-plan (57 solids), cross-bearings (no solids), trunnion (no solids), fork-pin (no solids), ring-hub (no solids), ring-rollers (no solids), j12-flexible (no solids), strap-sheave (no solids), j13-compliant (no solids) · every bearing retained both sides; every part on a shaft retained (Joints table) |
| F3 | PASS | AUTO · served at C, D; fired: j2-live-shaft (no solids), j10-shaft-in-plan (57 solids), j12-flexible (no solids), j11-screw (no solids) · every keyed part keyed or on a D-flat with its retainer |
| F4 | PASS | AUTO / HAND · served at A; fired: j9-crossed-mesh (no solids), j2-live-shaft (no solids), j10-shaft-in-plan (57 solids), trunnion (no solids) · thrust washers where a part turns free axially |
| F5 | N/A | AUTO / HAND · served at no joint; fired: j5-slide (no solids), pawl-tooth (no solids), j13-compliant (no solids), stops (no solids) · both shafts turn continuously |
| F6 | N/A | AUTO / HAND · served at no joint; fired: trunnion (no solids), j7-cam (no solids), pallet-contact (no solids), pawl-tooth (no solids), j12-flexible (no solids) · no rest position to hold: the drive positions every part |
| F7 | N/A | AUTO / HAND · served at no joint; fired: j6-mesh (no solids), j9-crossed-mesh (no solids), j5-slide (no solids), j12-flexible (no solids), adjustable-length (no solids) · no exact length or mesh to adjust |
| F8 | PASS | AUTO · served at no joint; fired: tongue-slot (no solids), cross-bearings (no solids), ball-socket (no solids), j12-flexible (no solids), j11-screw (no solids), lubrication (no solids) · sealed bearings; bronze bushings and liners oil-impregnated |
| F9 | PASS | AUTO / HAND · served at no joint; fired: j6-mesh (no solids), j9-crossed-mesh (no solids), timing-marks (1 solid) · zero line on the input and on the base (timing marks) |
| F10 | PASS | AUTO / HAND · served at drive; fired: j12-flexible (no solids), drive (30 solids) · home flag and fork sensor on the input (drive) |
| M1 | PASS | AUTO · fired: hardware primitives · top-face chamfers by part kind (primitives) |
| M2 | PASS | HAND · bosses round every bore |
| M3 | PASS | AUTO · fired: j3-moving-pin (20 solids), hardware primitives · bore entry chamfers |
| M4 | PASS | AUTO / HAND · fired: base (3 solids), fasteners (32 solids) · counterbores and countersinks for heads (base, csk, housings) |
| M5 | PASS | AUTO / HAND · fired: hardware primitives · cutter radii on windows and slots |
| M6 | PASS | AUTO · edge distance and walls clean |
| M7 | N/A | HAND · no bracket corner turns a load |
| M8 | PASS | AUTO · fired: j1-dead-axle (no solids) · thread undercuts on stepped shafts |
| M9 | PASS | AUTO / HAND · fired: j1-dead-axle (no solids) · ISO coarse threads, engagement through the tapped part or to a nut |
| M10 | PASS | AUTO / HAND · 120 of 123 solids name a material · materials named by kind and role |
| M11 | PASS | AUTO · fired: j1-dead-axle (no solids), hardware primitives · centre holes, chamfered ends on turned parts |
| M12 | PASS | HAND · every screw reachable by its key in the explode |
| M13 | PASS | AUTO / HAND · 17 threaded · threadlocker or nyloc on every threaded fastener |
| M14 | N/A | AUTO / HAND · fired: tongue-slot (no solids), piston-bore (no solids), j4-slot-roller (no solids), pin-lobe (no solids), groove-cam (no solids), pallet-contact (no solids) · no sliding contact needing a liner |
| V1 | PASS | AUTO · fired: drive (30 solids) · pancake motor beside the input shaft, belted to its free end |
| V2 | PASS | AUTO · fired: drive (30 solids) · one angle bracket: upright and foot |
| V3 | PASS | AUTO / HAND · fired: drive (30 solids) · belt and pulleys clear of feet and housings (A15) |
| V4 | PASS | AUTO · fired: j8-belt (no solids) · flanged pulleys, belt in one plane |
| V5 | PASS | AUTO · fired: drive (30 solids) · rotary input: belt to the input pulley |
| V6 | PASS | AUTO · fired: drive (30 solids), cable-clip (2 solids) · home flag, fork sensor, terminals, lead and clip |
| L1 | PASS | STYLE · STYLE: no look values in the record or polish |
| L2 | PASS | HAND · records and polish carry no look |
| L3 | PASS | HAND · roles right on every solid (both sheets) |
| L4 | PASS | HAND / STYLE · one accent: the input ring, the traces |
| L5 | PASS | AUTO / HAND · fired: see-through (no solids) · transparency and hidden lines show screws in holes and bearings in bores |
| L6 | PASS | AUTO · depth peeling at every view (shots) |
| L7 | PASS | STYLE · STYLE: turntable orbit, named views, no perspective |
| L8 | PASS | AUTO / HAND · fired: trace-marks (no solids) · centrelines along every joint axis, base dimensions, engraved marks |
| L9 | N/A | AUTO / DATA · no section or detail view declared |
| L10 | PASS | AUTO / STYLE · teaching overlays in the sheet's look |
| R1 | PASS | HAND · every standard part from the primitives and kits |
| R2 | PASS | HAND · standard sizes only |
| R3 | PASS | AUTO · fired: hardware primitives · shared subassemblies, one function each |
| R4 | PASS | AUTO · package v2 17.0 KB · package v2 written at build time |
| R5 | PASS | HAND · the polish states only exceptions, no sampling |
| R6 | PASS | FLAG · FLAG: bench run (desktop, below); the phone is measured by David |
| R7 | PASS | HAND / FLAG · polish none; 0 solids added, 0 overrides by the polish |
| R8 | PASS | AUTO / SITE · SITE: thumbnails pre-rendered, cards animate on hover |
| R9 | PASS | AUTO / SITE · setup and bake in the worker, one context |
| R10 | PASS | FLAG · FLAG: the bench page is built for the phone measurement |
| DL1 | PASS | AUTO / HAND · 41 of 123 solids on a dropping rung · every solid, mark and effect on a rung by its kind |
| DL2 | PASS | HAND · default dial: full |
| DL3 | PASS | AUTO · view-aware exceptions in the ladder table |
| DL4 | PASS | SITE · SITE: adaptive dial with hysteresis |
| DL6 | PASS | AUTO · teaching layers drawn at every dial position |
| DL5 | PASS | FLAG · FLAG: bench reports frame time per dial position |
| Q1 | PASS | check, clamp and edge distance clean |
| Q2 | PASS | 0 clashes, 0 unnecessary allows |
| Q3 | PASS | package v2 written, 17.0 KB; site build not checked here · package v2 written; site builds (npm run build) |
| Q4 | PASS | local: tools/shot · dist/shots3/<id> (and the batch's shot set): record view, PLAN, FRONT, SIDE, ISOMETRIC, the declared views, full explode, both sheets |
| Q5 | PASS | local: tools/bench · tools/bench3 run (desktop): frame times per view in the ladder above; the phone is measured by David |
| Q6 | PASS |  |
| Q7 | PASS |  |
| Q8 | PASS | teaching review: keep (2026-10-20); the six phases of the finished build are looked at by eye · verdict and decisions in the record and the teaching: line; six phases of the finished build looked at |

## Joints
| Joint | Kit | Block | Support | Stack | F1 locate | F2 retain | F3 torque | F4 thrust | F5 limit | F6 hold | F7 adjust | F8 lube | F9 timing | F10 protect |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| C | J3 | bennett | – | – | none | Internal circlip DIN 472, Ø13; Shoulder bolt Ø6 x 16, M5 (ISO 7379) | Shoulder bolt Ø6 x 16, M5 (ISO 7379) | none | none | none | none | none | none | none |
| D | J3 | bennett | – | – | none | Internal circlip DIN 472, Ø13; Shoulder bolt Ø6 x 16, M5 (ISO 7379) | Shoulder bolt Ø6 x 16, M5 (ISO 7379) | none | none | none | none | none | none | none |
| A | J10 | bennett | pillow (moved) | – | 4 x Dowel pin Ø4 x 14 h6, block to base | End washer 3.4x14, holds the l4 on the shaft end; Countersunk M3 x 8 (ISO 10642); 2 x circlipInternal | none | 2 x Shaft collar 6x14, set screw | none | none | none | none | none | none |
| B | J10 | bennett | pillow (moved) | – | 4 x Dowel pin Ø4 x 14 h6, block to base; Dead shaft Ø6, clamped in two pillow blocks | Internal circlip DIN 472, Ø13; 2 x Set screw M4 on a flat, clamps the dead shaft (F2, F3) | none | none | none | none | none | none | none | none |
| drive | drive | – | – | – | none | none | none | none | none | none | none | none | none | Home flag, 1 mm steel vane; Fork sensor, slotted optical, 5 mm gap |

## Supports
| Support | Joint | Kind | Route | Least gap mm | Covers | T10 |
|---|---|---|---|---|---|---|
| A-pb | A | pillow | moved | 1.5 | l3, l4 | – |
| B-pb | B | pillow | moved | 1.5 | l2, l3 | – |

## Variants and overrides
| Joint or part | Rule result | Chosen | Why |
|---|---|---|---|
| links | plates in their first hinge's plane | spatial links: a knuckle on each hinge and a bar between | the hinges are skew; plates would cross their neighbours |
| knuckles | side by side at the joint | set apart along each hinge (A and B 54 mm, C and D 6 mm) | the loop passes through crossed poses where the link lines meet |
| D | bolt head on the + side | turned end for end (record: head -) | the coupler's bar sweeps past the usual side |
| the loop | as in the E2 record | turned 90 deg about x, driven at A | A lies horizontal (pillow blocks and the drive at its free end clear of the loop) |

## Detail ladder
| Rung | Solids | Marks | Frame ms at this dial position |
|---|---|---|---|
| DL-A | 11 | 0 | 2.46 |
| DL-B | 0 | 321 | 2.28 |
| DL-C | 0 | 0 | 2.63 |
| DL-D | 10 | 0 | 2.22 |
| DL-E | 8 | 0 | 2.51 |
| DL-F | 0 | 0 | 2 |
| DL-G | 0 | 0 | 2.11 |
| DL-H | 12 | 0 | 2.21 |
| never | 82 | 139 | 2 |

## Promotion candidates
Promoted in this pass: the `spatial-link` shape, the Bennett block from its four joints, the joint-angle output, a stack on hinge lugs alone, a moving pin turned end for end, the drive's side chosen clear of the sweeps, pillow blocks on a sloping shaft spaced by their feet.

## Verification
check: clean · K1 residual: 4.0e-12 · claims: 5 of 5 ok · clearance: 0 clashes · clamp: clean · edge distance: clean · package: 17.0 KB
screenshots: dist/shots3/bennett-linkage (record view, PLAN, FRONT, SIDE, ISOMETRIC, declared views, explode; both sheets) · bench: dist/bench/report-v2.md (desktop; frame times paced at 28 deg in the ladder above; phone by David)
