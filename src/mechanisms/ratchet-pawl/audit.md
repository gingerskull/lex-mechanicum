# Audit: Ratchet and pawl (ratchet-pawl)
standard: 3.0 · date: 2026-10-22 · result: pass · detail: full · pass: build
teaching: keep · decisions in the record

## Summary
PASS 148 · FAIL 0 · N/A 19 · open: none

## Requirements
| Id | Status | Evidence / action |
|---|---|---|
| S1 | PASS | DATA · the standard carries version 3.0 and its changelog |
| S2 | PASS | HAND · header with standard, date, result, detail, pass and the teaching: line |
| S3 | PASS | AUTO · tools/conformance reads this sheet (engine v3) and runs in npm run check |
| S4 | PASS | SITE · the pass issue holds only this mechanism's decisions; batch status in #216 |
| S5 | PASS | SITE · 3D stamp in the title block (every shot) and on the card and page header (site build) |
| S6 | PASS | AUTO · rebuilt from its record v3 in rebuild batch R5 (#216): bound by 3.0 from this pass |
| P1 | PASS | DATA · record v3 complete (kin and teaching blocks); no polish, audit.md present |
| P2 | PASS | DATA · catalogue validator clean |
| P3 | PASS | DATA / SITE · the page reads ratio, axes, character, backdrivable, aka, family, motion, level, dof and the drive from the record |
| P4 | PASS | DATA · tags grouped Function, Property, Application, keywords |
| P5 | PASS | DATA · explanation in four parts and the examples from the record |
| P6 | PASS | DATA · references and media from the record, validated by the catalogue |
| P7 | PASS | HAND / SITE · no prose in a polish; labels come from the record |
| P8 | PASS | SITE · the page has no parts list or joint sections (site) |
| P9 | PASS | AUTO / HAND · every number the explanation states is a claim and agrees (T9) |
| P10 | PASS | HAND · the driving pawl's tip traced (its stroke, its ride back over the teeth); the root circle, the pawl line, the stroke arc; plot of wheel angle |
| P11 | PASS | DATA · plain language, mm and degrees |
| P12 | PASS | AUTO / DATA · validate(records, asVersion 3) clean for this record |
| P13 | PASS | HAND · teaching review run against the record before the build and again on the finished drawing (teaching: line) |
| K1 | PASS | AUTO · K1 residual 2.8e-14 (tolerance 1e-9) over 360 samples, reference 2.4e-7 |
| K2 | PASS | AUTO · check: finite, continuous, periodic over 360 samples |
| K3 | PASS | AUTO / HAND · 1 block (ratchet); no numeric fallback · composed from the block library; no fallback, no one-off model |
| K4 | PASS | HAND · the lever carries the accent on its shaft; the wheel is the output, the pawls ride |
| K6 | PASS | DATA · 12 teeth, root 50, tip 62, face 3 and back 27 degrees; pawls 56 at 75.07 (tangent to the root circle at engagement); the ratchet block: lever stroke 36, lost motion 6, 30 degrees per stroke, the wheel at rest 228.2 degrees of the cycle; both pawls ride the teeth (shared ride solver) |
| K7 | PASS | DATA · drivers input (oscillating) · input kind declared with its driven joint |
| K8 | PASS | AUTO / DATA · every joint declared with type, bodies, origin and axis; nothing inferred |
| K9 | PASS | DATA · one oscillating driver, 62 to 98 degrees, its cycle starting as the pawl meets a face (phase 48.19; the block reads the same phase) |
| K10 | PASS | AUTO / DATA · one closure, continuous over the cycle |
| K11 | PASS | AUTO · mobility counted 2, dof 1 |
| K12 | PASS | DATA · every traced, overlaid and claimed point and quantity is named in kin |
| T1 | PASS | HAND · mechanics first, no use context in the teaching strings; the principle reads at the default view |
| T2 | PASS | HAND · review before the build and again on the six phases of the finished build; decisions in the record |
| T3 | PASS | DATA · principle parts declared; drawn whole, in depth order |
| T4 | PASS | DATA · fired: trace-marks (no solids) · the driving pawl's tip: its push with the wheel, its ride back over the back slopes |
| T5 | PASS | DATA · root circle, the pawl line (tangent to it at the tip), the lever's stroke arc |
| T6 | PASS | HAND / DATA · one tooth per 36-degree stroke, the 6 degrees of lost motion visible |
| T7 | PASS | DATA · PLAN |
| T8 | N/A | DATA · everything lies in one plane in plain view |
| T9 | PASS | AUTO / DATA · claim table: 3 ok, 0 off, 0 uncheckable of 3 |
| T10 | PASS | AUTO · 4 solids drawn see-through: T2-spring, H-ecl, H-axle-s4, H-axle-s5 · nothing static covers the teeth |
| T11 | PASS | AUTO · 0 supports routed, 0 moved off a sweep · the holding pawl on a stub from the base, the wheel and lever on one live shaft in a housing under the base: no bridge |
| T12 | PASS | HAND · 8 support solids; dropped by the polish: none |
| T13 | N/A | DATA · nothing goes by in a blink |
| T14 | PASS | HAND / DATA · the crank's turn (see K9) |
| T15 | PASS | HAND · labels state the mechanism, never its use |
| T16 | N/A | HAND / STYLE · no two parts of one role to tell apart |
| T17 | PASS | AUTO · depth peeling, no depth bias (renderer test) |
| D1 | PASS | HAND · a sawtooth wheel; solid pawls: a round boss, an arm bowed outside the tip circle, a finger into the V with its leading edge along the steep face (review: solider pawl shapes) |
| D2 | PASS | HAND · the pawls' arms carry the push round the teeth, the boss round the pin |
| D3 | PASS | STYLE · STYLE: roles by pattern and tone (both sheets) |
| D4 | PASS | AUTO · fired: base (3 solids), feet (4 solids) · base corners and feet concentric (base, feet rules) |
| D5 | PASS | AUTO / HAND · one housing for the shaft, one stub for the holding pawl, stop pins |
| D6 | PASS | HAND / STYLE · hardware quieter than the parts, still readable (both sheets) |
| D8 | PASS | AUTO / HAND · every solid a profile, an operation and a frame |
| D9 | N/A | AUTO / HAND · no member changes shape |
| D10 | PASS | AUTO · profiles only |
| D11 | PASS | AUTO · SOLID: 0 of 109 solids unsound |
| D7 | PASS | HAND · wheel, lever and pawls plain; richness in the stacks, springs and stops |
| A1 | PASS | AUTO · D J3, OW J2, T1 pawl-tooth, T2 pawl-tooth, H J1, OW-lever-stops stops, H-holdPawl-stops stops, drive drive · every joint read from the record and built by its kit |
| A2 | PASS | AUTO · D J3, OW J2, T1 pawl-tooth, T2 pawl-tooth, H J1, OW-lever-stops stops, H-holdPawl-stops stops, drive drive · wheel and lever on one live shaft (J2: the lever keyed, the wheel on its bearing), the driving pawl on a shoulder bolt in the lever (J3), the holding pawl on a stub (J1), pawl and tooth contacts |
| A3 | PASS | AUTO · fired: classify (6 solids), axial stack builder · bores from the catalogue; bearings where a boss fits them |
| A4 | PASS | AUTO · fired: j1-dead-axle (11 solids), axial stack builder · stepped shafts with shoulders, grooves and chamfered ends (H.shaft) |
| A5 | PASS | AUTO · fired: j2-live-shaft (32 solids), j10-shaft-in-plan (no solids), axial stack builder · keys by shaft size: D-flat to Ø8, feather key above |
| A6 | N/A | AUTO · fired: j5-slide (no solids), j13-compliant (no solids), standoffs (no solids) · no slide and no floating plate |
| A7 | PASS | AUTO · fired: base (3 solids), feet (4 solids) · base under the lowest part, counterbored corner holes, feet, engraved scale and paths, shaft clearance holes |
| A8 | PASS | AUTO · fired: fasteners (7 solids) · stage 3 fasteners: shanks, clearance and tapped holes |
| A9 | PASS | AUTO / HAND · fired: placement solver · the shaft in its housing, the lever keyed above the wheel |
| A10 | PASS | HAND · fired: placement (8 solids), placement solver · wheel and pawls in one plane, the lever a slab above |
| A11 | PASS | AUTO / HAND · fired: j12-flexible (no solids), strap-sheave (no solids), j1-dead-axle (11 solids) · load paths closed: every joint note says where its load goes to ground |
| A12 | PASS | AUTO · clamp check clean |
| A13 | PASS | AUTO / HAND · 109 solids, 55 unnamed (further items of a listed set) · named hardware with catalogue sizes and materials |
| A14 | PASS | AUTO / HAND · fired: support router · supports routed against the sweeps; details checked by A15 |
| A15 | PASS | AUTO · clearance in 3D over 72 phases: 0 clashes; hand allow: 0 named, 0 unnecessary |
| A16 | PASS | HAND · 8 joint notes; no note: none; no badge: none · a note per joint; build rules: the holding pawl's pivot at -22 so it seats; the pawls bowed round the teeth; springs round their pivots |
| A17 | PASS | HAND · assembles in the explode order; every screw reachable; pressed bearings pullable through their bores |
| A18 | PASS | AUTO · placement: 2 slabs in the tallest stack (18.0 mm), 0 clevises; stack per joint in the Joints table · axial positions set by the placement solver |
| A19 | PASS | AUTO · 0 supports routed (0 moved), least gap - mm; still covering a principle part, drawn see-through: none · supports placed off the principle's sweep where the router could |
| A20 | PASS | AUTO · support per joint: none · one axial stack builder with its support selector |
| A21 | PASS | AUTO · kit per joint: D J3, OW J2, T1 pawl-tooth, T2 pawl-tooth, H J1, OW-lever-stops stops, H-holdPawl-stops stops, drive drive |
| A22 | PASS | AUTO · fired: stops (12 solids), adjustable-length (no solids), cable-clip (5 solids) · stop pins for the lever's and the holding pawl's swings; cable clips |
| E1 | PASS | AUTO · every solid has one explode level; levels -5 to 2.5 · one level per solid |
| E2 | PASS | AUTO · fired: explode (1 solid) · heads, shanks, washers and nuts move as one |
| E3 | PASS | AUTO · fired: explode (1 solid) · screws back out along their axes |
| E4 | PASS | HAND · last fitted goes furthest (explode shots, both sheets) |
| E5 | PASS | AUTO · fired: explode (1 solid) · pressed bearings, bushings and clips stay with their parts |
| E6 | PASS | AUTO · fired: explode (1 solid) · motor, bearings and pulley pair whole |
| E7 | PASS | AUTO · fired: explode (1 solid) · loose spacers midway |
| E8 | PASS | AUTO · fired: explode (1 solid) · keyed parts keep their order on their shaft |
| E9 | PASS | HAND · full explode readable in ISOMETRIC on both sheets, nothing leaves the frame |
| E10 | PASS | AUTO · fired: explode (1 solid) · each stack explodes along its joint axis, with trail lines |
| J1 | PASS | AUTO · fired: trunnion (no solids), j1-dead-axle (11 solids) · built by its kit (Joints table) |
| J2 | PASS | AUTO · fired: j2-live-shaft (32 solids) · built by its kit (Joints table) |
| J3 | PASS | AUTO · fired: j3-moving-pin (9 solids), cross-bearings (no solids), ring-hub (no solids) · built by its kit (Joints table) |
| J4 | N/A | AUTO · fired: j4-slot-roller (no solids), pin-lobe (no solids), fork-pin (no solids) · no pin in a slot |
| J5 | N/A | AUTO · fired: piston-bore (no solids), j5-slide (no solids), tongue-slot (no solids) · no slide |
| J6 | N/A | AUTO · fired: j6-mesh (no solids), ring-rollers (no solids) · no parallel mesh |
| J7 | PASS | AUTO · fired: groove-cam (no solids), j7-cam (no solids), pallet-contact (no solids), pawl-tooth (4 solids) · built by its kit (Joints table) |
| J8 | N/A | AUTO · fired: j8-belt (no solids), j12-flexible (no solids) · no belt in the mechanism (the drive belt is V4) |
| J9 | N/A | AUTO · fired: j9-crossed-mesh (no solids) · no crossed mesh |
| J10 | N/A | AUTO · fired: j10-shaft-in-plan (no solids) · no shaft in plan |
| J12 | N/A | AUTO · fired: j12-flexible (no solids), strap-sheave (no solids) · no flexible member |
| J13 | N/A | AUTO · fired: j13-compliant (no solids) · no compliant joint |
| J11 | N/A | AUTO · fired: j11-screw (no solids) · no screw |
| F1 | PASS | AUTO · served at OW, H; fired: j2-live-shaft (32 solids), j10-shaft-in-plan (no solids), strap-sheave (no solids), j13-compliant (no solids) · housings, blocks and bridges dowelled (Joints table) |
| F2 | PASS | AUTO · served at D, OW, H, drive; fired: wheels (no solids), j2-live-shaft (32 solids), j10-shaft-in-plan (no solids), cross-bearings (no solids), trunnion (no solids), fork-pin (no solids), ring-hub (no solids), ring-rollers (no solids), j12-flexible (no solids), strap-sheave (no solids), j13-compliant (no solids) · every bearing retained both sides; every part on a shaft retained (Joints table) |
| F3 | PASS | AUTO · served at D, OW, drive; fired: j2-live-shaft (32 solids), j10-shaft-in-plan (no solids), j12-flexible (no solids), j11-screw (no solids) · every keyed part keyed or on a D-flat with its retainer |
| F4 | PASS | AUTO / HAND · served at OW, H; fired: j9-crossed-mesh (no solids), j2-live-shaft (32 solids), j10-shaft-in-plan (no solids), trunnion (no solids) · thrust washers where a part turns free axially |
| F5 | PASS | AUTO / HAND · served at OW-lever-stops, H-holdPawl-stops; fired: j5-slide (no solids), pawl-tooth (4 solids), j13-compliant (no solids), stops (12 solids) · hardened stop pins at both ends of the lever's swing and the holding pawl's |
| F6 | PASS | AUTO / HAND · served at T1, T2; fired: trunnion (no solids), j7-cam (no solids), pallet-contact (no solids), pawl-tooth (4 solids), j12-flexible (no solids) · a torsion spring round each pawl's pivot holds it on the teeth |
| F7 | N/A | AUTO / HAND · served at no joint; fired: j6-mesh (no solids), j9-crossed-mesh (no solids), j5-slide (no solids), j12-flexible (no solids), adjustable-length (no solids) · nothing to adjust: the slots and arcs are cut to the centre distance |
| F8 | PASS | AUTO · served at no joint; fired: cross-bearings (no solids), tongue-slot (no solids), j12-flexible (no solids), j11-screw (no solids), lubrication (no solids) · sealed bearings need none; open contacts oiled or greased where they occur |
| F9 | N/A | AUTO / HAND · served at no joint; fired: j6-mesh (no solids), j9-crossed-mesh (no solids), timing-marks (2 solids) · any tooth takes the pawl |
| F10 | PASS | AUTO / HAND · served at drive; fired: j12-flexible (no solids), drive (32 solids) · home flag and fork sensor on the input (drive); no belt to flange |
| M1 | PASS | AUTO · fired: hardware primitives · top-face chamfers by part kind (primitives) |
| M2 | PASS | HAND · bosses round every loaded hole |
| M3 | PASS | AUTO · fired: j3-moving-pin (9 solids), hardware primitives · bore entry chamfers |
| M4 | PASS | AUTO / HAND · fired: base (3 solids), fasteners (7 solids) · counterbores and countersinks for heads (base, csk, housings) |
| M5 | PASS | AUTO / HAND · fired: hardware primitives · cutter radii on windows and slots |
| M6 | PASS | AUTO · edge distance and walls clean |
| M7 | N/A | HAND · no bracket corner turns a load |
| M8 | PASS | AUTO · fired: j1-dead-axle (11 solids) · thread undercuts on stepped shafts |
| M9 | PASS | AUTO / HAND · fired: j1-dead-axle (11 solids) · ISO coarse threads, engagement through the tapped part or to a nut |
| M10 | PASS | AUTO / HAND · 105 of 109 solids name a material · materials named by kind and role |
| M11 | PASS | AUTO · fired: j1-dead-axle (11 solids), hardware primitives · centre holes, chamfered ends on turned parts |
| M12 | PASS | HAND · every screw reachable by its key in the explode |
| M13 | PASS | AUTO / HAND · 12 threaded · threadlocker or nyloc on every threaded fastener |
| M14 | N/A | AUTO / HAND · fired: piston-bore (no solids), j4-slot-roller (no solids), pin-lobe (no solids), groove-cam (no solids), pallet-contact (no solids), tongue-slot (no solids) · the roller rolls in the slots; the locking surfaces are oiled |
| V1 | PASS | AUTO · fired: drive (32 solids) · brushless pancake motor Ø50 x 18 under the base; the oscillating input is motorised through a crank and link (V5) |
| V2 | PASS | AUTO · fired: drive (32 solids) · one flange for the motor, screwed up into the base from inside; nothing of the drive shows on top of the base |
| V3 | PASS | AUTO / HAND · fired: drive (32 solids) · motor, flange, crank, link and lever laid out clear of the feet, the housings and the base hardware (A15: 0 clashes over 72 phases) |
| V4 | PASS | AUTO · fired: j8-belt (no solids) · no belt in an oscillating drive; drive detail: crank clamped on the motor shaft's flat, bushings in the link, circlips on both pins, lever keyed or set-screwed on the input shaft |
| V5 | PASS | AUTO · fired: drive (32 solids) · oscillating: the motor turns a 6.5 mm crank, a 44.1 mm link swings a lever keyed on the input shaft's low end through exactly the modelled 36° (dead centres at the ends of the swing); the crank belongs to the drive |
| V6 | PASS | AUTO · fired: drive (32 solids), cable-clip (5 solids) · home flag on the input lever's hub, fork sensor on a post, motor and sensor leads to a terminal block, cable clips |
| L1 | PASS | STYLE · STYLE: no look values in the record or polish |
| L2 | PASS | HAND · records and polish carry no look |
| L3 | PASS | HAND · roles right on every solid (both sheets) |
| L4 | PASS | HAND / STYLE · one accent: the input ring, the traces |
| L5 | PASS | AUTO / HAND · fired: see-through (4 solids) · transparency and hidden lines show screws in holes and bearings in bores |
| L6 | PASS | AUTO · depth peeling at every view (shots) |
| L7 | PASS | STYLE · STYLE: turntable orbit, named views, no perspective |
| L8 | PASS | AUTO / HAND · fired: trace-marks (no solids) · centrelines along every joint axis, base dimensions, engraved marks |
| L9 | N/A | AUTO / DATA · no section or detail view declared |
| L10 | PASS | AUTO / STYLE · teaching overlays in the sheet's look |
| R1 | PASS | HAND · every standard part from the primitives and kits |
| R2 | PASS | HAND · standard sizes only |
| R3 | PASS | AUTO · fired: hardware primitives · shared subassemblies, one function each |
| R4 | PASS | AUTO · package v2 23.4 KB · package v2 written at build time |
| R5 | PASS | HAND · no polish, no sampling |
| R6 | PASS | FLAG · FLAG: bench run (desktop, below); the phone is measured by David |
| R7 | PASS | HAND / FLAG · polish none; 0 solids added, 0 overrides by the polish |
| R8 | PASS | AUTO / SITE · SITE: thumbnails pre-rendered, cards animate on hover |
| R9 | PASS | AUTO / SITE · setup and bake in the worker, one context |
| R10 | PASS | FLAG · FLAG: the bench page is built for the phone measurement |
| DL1 | PASS | AUTO / HAND · 50 of 109 solids on a dropping rung · every solid, mark and effect on a rung by its kind |
| DL2 | PASS | HAND · default dial: full |
| DL3 | PASS | AUTO · view-aware exceptions in the ladder table |
| DL4 | PASS | SITE · SITE: adaptive dial with hysteresis |
| DL6 | PASS | AUTO · teaching layers drawn at every dial position |
| DL5 | PASS | FLAG · FLAG: bench reports frame time per dial position |
| Q1 | PASS | check, clamp and edge distance clean |
| Q2 | PASS | 0 clashes, 0 unnecessary allows |
| Q3 | PASS | package v2 written, 23.4 KB; site build not checked here · package v2 written; site builds (npm run build) |
| Q4 | PASS | local: tools/shot · dist/shots3/<id>: record view, PLAN, FRONT, SIDE, ISOMETRIC, the declared views, full explode, both sheets |
| Q5 | PASS | local: tools/bench · tools/bench run: dist/bench/report-v2.md |
| Q6 | PASS | every row judged |
| Q7 | PASS | at 3.0 |
| Q8 | PASS | teaching review: keep (2026-10-20); the six phases of the finished build are looked at by eye · verdict and decisions in the record and the teaching: line; six phases of the finished build looked at |

## Joints
| Joint | Kit | Block | Support | Stack | F1 locate | F2 retain | F3 torque | F4 thrust | F5 limit | F6 hold | F7 adjust | F8 lube | F9 timing | F10 protect |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| D | J3 | ratchet | – | – | none | Shoulder bolt Ø6 x 16, M5 (ISO 7379) | Shoulder bolt Ø6 x 16, M5 (ISO 7379) | none | none | none | none | none | none | none |
| OW | J2 | ratchet | – | – | 2 x Dowel pin Ø3 x 10 h6, housing to base | 2 x Internal circlip DIN 472, Ø21; External circlip DIN 471, Ø12 | Feather key 4 x 4 x 5 (DIN 6885); Clamp hub Ø12x22, two set screws at 90°; Set screw M4 (DIN 916), threadlocked | Inner-race spacer 12.2x16.2; Thrust washer 12.2x20, bronze; Wave washer 16.5x20.8, spring steel | none | none | none | none | none | none |
| T1 | pawl-tooth | – | – | – | none | none | none | none | none | Torsion spring Ø15, wire 0.8: holds the pawl on the teeth | none | none | none | none |
| T2 | pawl-tooth | – | – | – | none | none | none | none | none | Torsion spring Ø13, wire 0.8: holds the pawl on the teeth | none | none | none | none |
| H | J1 | ratchet | – | – | Dead axle Ø6, shouldered, M5 end | External circlip DIN 471, Ø6 | none | Thrust washer 6.2x14, bronze | none | none | none | none | none | none |
| OW-lever-stops | stops | – | – | – | none | none | none | none | 2 x Stop pin Ø6, hardened, on the lever's edge | none | none | none | none | none |
| H-holdPawl-stops | stops | – | – | – | none | none | none | none | stop | none | none | none | none | none |
| drive | drive | – | – | – | none | External circlip DIN 471, Ø12; 2 x External circlip DIN 471, Ø4 | Feather key 4 x 4 x 9 (DIN 6885) | none | none | none | none | none | none | Home flag, 1 mm steel vane; Fork sensor, slotted optical, 5 mm gap |

## Supports
| Support | Joint | Kind | Route | Least gap mm | Covers | T10 |
|---|---|---|---|---|---|---|

## Variants and overrides
| Joint or part | Rule result | Chosen | Why |
|---|---|---|---|

## Detail ladder
| Rung | Solids | Marks | Frame ms at this dial position |
|---|---|---|---|
| DL-A | 11 | 0 | 1.95 |
| DL-B | 0 | 143 | 1.91 |
| DL-C | 0 | 0 | 1.92 |
| DL-D | 9 | 0 | 1.8 |
| DL-E | 12 | 0 | 1.88 |
| DL-F | 0 | 0 | 1.72 |
| DL-G | 0 | 0 | 1.82 |
| DL-H | 18 | 0 | 1.71 |
| never | 59 | 153 | 1.94 |

## Promotion candidates
None yet.

## Verification
check: clean · K1 residual: 2.8e-14 · claims: 3 of 3 ok · clearance: 0 clashes · clamp: clean · edge distance: clean · package: 22.9 KB
screenshots: dist/shots3/ratchet-pawl (record view, PLAN, FRONT, SIDE, ISOMETRIC, declared views, explode; both sheets) · bench: dist/bench/report-v2.md (desktop; frame times paced at 28 deg in the ladder above; phone by David)
