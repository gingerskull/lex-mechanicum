# Audit: Sun and planet gear (sun-and-planet)
standard: 3.0 · date: 2026-10-22 · result: pass · detail: full · pass: build
teaching: tweak · decisions in the record

## Summary
PASS 149 · FAIL 0 · N/A 18 · open: none

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
| P10 | PASS | HAND · the planet's centre P traced, ticks every 30 deg of orbit, and the beam end B; a mark on the sun traced; the arc of the rod about the retainer and the line of centres; plots of sun angle and sun speed |
| P11 | PASS | DATA · plain language, mm and degrees |
| P12 | PASS | AUTO / DATA · validate(records, asVersion 3) clean for this record |
| P13 | PASS | HAND · teaching review run against the record before the build and again on the finished drawing (teaching: line) |
| K1 | PASS | AUTO · K1 residual 2.3e-13 (tolerance 1e-9) over 360 samples, reference 0.0e+0 |
| K2 | PASS | AUTO · check: finite, continuous, periodic over 360 samples |
| K3 | PASS | AUTO / HAND · 2 blocks (dyad, gear-mesh); no numeric fallback · composed from the block library (dyad for the rod and beam, gear-mesh with the planet on a moving centre: the rod's turn from its two pins, the retainer as carrier); no fallback, no one-off model |
| K4 | PASS | HAND · the retainer (the orbit) drives with the accent on its shaft; the sun is the output; the beam rocks |
| K6 | PASS | DATA · module 5, sun and planet 24 teeth: orbit radius 120; beam 300 on a pivot at (-300, 400), 500 mm from the sun's shaft; rod 400 |
| K7 | PASS | DATA · drivers orbit (rotary) · input kind declared with its driven joint (the orbit drives the cycle, as the record allows) |
| K8 | PASS | AUTO / DATA · every joint declared with type, bodies, origin and axis; nothing inferred |
| K9 | PASS | DATA · one rotary driver; the tooth-count and branch design choices are not offered (parts built for 24/24) |
| K10 | PASS | AUTO / DATA · one closure (rod and beam) and the mesh on a moving centre; the planet fixed to the rod |
| K11 | PASS | AUTO · mobility counted 1, dof 1 |
| K12 | PASS | DATA · every traced, overlaid and claimed point and quantity is named in kin |
| T1 | PASS | HAND · mechanics first, no use context in the teaching strings; the principle reads at the default view |
| T2 | PASS | HAND · review before the build and again on the six phases of the finished build; decisions in the record |
| T3 | PASS | DATA · principle parts declared; drawn whole, in depth order |
| T4 | PASS | DATA · fired: trace-marks (no solids) · the planet's centre traced with ticks every 30 deg of orbit, the beam end traced; a mark engraved on the sun counts its two turns per orbit |
| T5 | PASS | DATA · the arc of the rod about the retainer and the line of centres sun-planet |
| T6 | PASS | HAND / DATA · the planet does not turn on its pin: it rides fixed to the rod and drives the sun round twice per orbit, its speed swinging 1.68 to 2.33 as the rod tilts |
| T7 | PASS | DATA · PLAN, where the beam, the rod, the planet, the sun and the retainer show |
| T8 | N/A | DATA · the principle lies in plain view, no section needed |
| T9 | PASS | AUTO / DATA · claim table: 4 ok, 0 off, 0 uncheckable of 4 |
| T10 | PASS | AUTO · 2 solids drawn see-through: B-bolt-wsh, B-bolt-head · nothing static covers the gears: the beam pivot's bridge stands far off |
| T11 | PASS | AUTO · 1 support routed, 0 moved off a sweep · the beam pivot's bridge first choice, off every sweep |
| T12 | PASS | HAND · 13 support solids; dropped by the polish: none |
| T13 | N/A | DATA · nothing goes by in a blink |
| T14 | PASS | HAND / DATA · the orbit (input); no other control (K9) |
| T15 | PASS | HAND · labels state the mechanism, never its use |
| T16 | N/A | HAND / STYLE · no two parts of one role to tell apart |
| T17 | PASS | AUTO · depth peeling, no depth bias (renderer test) |
| D1 | PASS | HAND · involute sun and planet, module 5; the planet fixed under the rod's end; a flywheel disc under the sun |
| D2 | PASS | HAND · material where the teeth carry; links tapered to their bosses |
| D3 | PASS | STYLE · STYLE: roles by pattern and tone (both sheets) |
| D4 | PASS | AUTO · fired: base (3 solids), feet (4 solids) · base corners and feet concentric (base, feet rules) |
| D5 | PASS | AUTO / HAND · one bridge over the beam's pivot; the sun's housing under the base; motor flange |
| D6 | PASS | HAND / STYLE · hardware quieter than the parts, still readable (both sheets) |
| D8 | PASS | AUTO / HAND · every solid a profile, an operation and a frame; built by Manifold; no layers, dz or twin |
| D9 | N/A | AUTO / HAND · no member changes shape |
| D10 | PASS | AUTO · profiles shipped for plain extrusions, meshes only for booleans (package v2) |
| D11 | PASS | AUTO · SOLID: 0 of 127 solids unsound |
| D7 | PASS | HAND · gears plain; richness in the stacks |
| A1 | PASS | AUTO · M J6, B J3, P J3, Os J2, Ob J1, Ob-beam-stops stops, drive drive · every joint read from the record and built by its kit |
| A2 | PASS | AUTO · M J6, B J3, P J3, Os J2, Ob J1, Ob-beam-stops stops, drive drive · the retainer keyed to the driven live shaft (J2), the sun and its flywheel turning free on it in bearings; rod, beam and retainer pins as shoulder bolts (J3); the beam's pivot a dead axle (J1) under a bridge; the mesh J6 |
| A3 | PASS | AUTO · fired: classify (6 solids), axial stack builder · bores from the catalogue; bearings where a boss fits them |
| A4 | PASS | AUTO · fired: j1-dead-axle (27 solids), axial stack builder · stepped shafts with shoulders, grooves, flats and chamfered ends (H.shaft) |
| A5 | PASS | AUTO · fired: j2-live-shaft (36 solids), j10-shaft-in-plan (no solids), axial stack builder · keys by shaft size: D-flat to Ø8, feather key above |
| A6 | N/A | AUTO · fired: j5-slide (no solids), j13-compliant (no solids), standoffs (no solids) · no slide and no floating plate |
| A7 | PASS | AUTO · fired: base (3 solids), feet (4 solids) · base 8 mm under the lowest part, counterbored corner holes, feet, engraved scale and paths, shaft clearance holes |
| A8 | PASS | AUTO · fired: fasteners (11 solids) · stage 3 fasteners: shanks, clearance and tapped holes |
| A9 | PASS | AUTO / HAND · fired: placement solver · the shaft held from below, its end held by a washer and screw: the rod passes over it |
| A10 | PASS | HAND · fired: placement (12 solids), placement solver · flywheel, sun and planet, retainer and beam, rod on top: the rod passes over the shaft end, the retainer above the gears, the planet fixed under the rod two slabs down |
| A11 | PASS | AUTO / HAND · fired: j12-flexible (no solids), strap-sheave (no solids), j1-dead-axle (27 solids) · load paths closed: every joint note says where its load goes to ground |
| A12 | PASS | AUTO · clamp check clean |
| A13 | PASS | AUTO / HAND · 130 solids, 68 unnamed (further items of a listed set) · named hardware with catalogue sizes and materials |
| A14 | PASS | AUTO / HAND · fired: support router · supports routed against the sweeps; details checked by A15 |
| A15 | PASS | AUTO · clearance in 3D over 72 phases: 0 clashes; hand allow: 0 named, 0 unnecessary |
| A16 | PASS | HAND · 7 joint notes; no note: none; no badge: M · a note per joint; build rules: the retainer keyed to the driven shaft, the sun free on it; the planet fixed to the rod through the P pin, the retainer between them |
| A17 | PASS | HAND · assembles in the explode order; every screw reachable; pressed bearings pullable through their bores |
| A18 | PASS | AUTO · placement: 4 slabs in the tallest stack (54.0 mm), 0 clevises; stack per joint in the Joints table · axial positions set by the placement solver; a level may stand more than one slab from its part |
| A19 | PASS | AUTO · 1 support routed (0 moved), least gap 1.5 mm; still covering a principle part, drawn see-through: none · the beam pivot's bridge first choice; least gap 1.5 mm |
| A20 | PASS | AUTO · support per joint: Ob bridge · one axial stack builder with its support selector |
| A21 | PASS | AUTO · kit per joint: M J6, B J3, P J3, Os J2, Ob J1, Ob-beam-stops stops, drive drive |
| A22 | PASS | AUTO · fired: stops (8 solids), adjustable-length (no solids), cable-clip (2 solids) · stops on the beam's swing; cable clip |
| E1 | PASS | AUTO · every solid has one explode level; levels -4.5 to 6 · one level per solid, nothing stretches |
| E2 | PASS | AUTO · fired: explode (1 solid) · heads, shanks, washers and nuts move as one |
| E3 | PASS | AUTO · fired: explode (1 solid) · screws back out along their axes |
| E4 | PASS | HAND · last fitted goes furthest (explode shots, both sheets) |
| E5 | PASS | AUTO · fired: explode (1 solid) · pressed bearings, bushings and clips stay with their parts |
| E6 | PASS | AUTO · fired: explode (1 solid) · motor, bearings and pulley pair whole |
| E7 | PASS | AUTO · fired: explode (1 solid) · loose spacers midway |
| E8 | PASS | AUTO · fired: explode (1 solid) · keyed parts keep their order on their shaft |
| E9 | PASS | HAND · full explode readable in ISOMETRIC on both sheets, nothing leaves the frame |
| E10 | PASS | AUTO · fired: explode (1 solid) · each stack explodes along its joint axis, with trail lines |
| J1 | PASS | AUTO · fired: trunnion (no solids), j1-dead-axle (27 solids) · the beam's pivot: dead axle under a bridge, bearing in the beam's boss |
| J2 | PASS | AUTO · fired: j2-live-shaft (36 solids) · the central shaft: housing under the base, the retainer keyed, the sun and the flywheel on bearings, the end held by a washer and screw |
| J3 | PASS | AUTO · fired: j3-moving-pin (22 solids), cross-bearings (no solids), ring-hub (no solids) · P and B: shoulder bolts through the rod's ends, bearings in the retainer and the beam |
| J4 | N/A | AUTO · fired: j4-slot-roller (no solids), pin-lobe (no solids), fork-pin (no solids) · no pin in a slot |
| J5 | N/A | AUTO · fired: piston-bore (no solids), j5-slide (no solids), tongue-slot (no solids) · no slide |
| J6 | PASS | AUTO · fired: j6-mesh (1 solid), ring-carrier (no solids), ring-rollers (no solids) · the mesh: eccentric bushing for the centre distance, timing marks at the mesh |
| J7 | N/A | AUTO · fired: groove-cam (no solids), j7-cam (no solids), pallet-contact (no solids), pawl-tooth (no solids) · no cam |
| J8 | N/A | AUTO · fired: j8-belt (no solids), j12-flexible (no solids) · no belt in the mechanism (the drive belt is V4) |
| J9 | N/A | AUTO · fired: j9-crossed-mesh (no solids) · no crossed mesh |
| J10 | N/A | AUTO · fired: j10-shaft-in-plan (no solids) · no shaft in plan |
| J12 | N/A | AUTO · fired: j12-flexible (no solids), strap-sheave (no solids) · no flexible member |
| J13 | N/A | AUTO · fired: j13-compliant (no solids) · no compliant joint |
| J11 | N/A | AUTO · fired: j11-screw (no solids) · no screw |
| F1 | PASS | AUTO · served at Os, Ob; fired: j2-live-shaft (36 solids), j10-shaft-in-plan (no solids), ring-carrier (no solids), strap-sheave (no solids), j13-compliant (no solids) · housings, blocks and bridges dowelled (Joints table) |
| F2 | PASS | AUTO · served at B, P, Os, Ob; fired: j2-live-shaft (36 solids), j10-shaft-in-plan (no solids), cross-bearings (no solids), trunnion (no solids), ring-carrier (no solids), fork-pin (no solids), ring-hub (no solids), ring-rollers (no solids), j12-flexible (no solids), strap-sheave (no solids), j13-compliant (no solids) · every bearing retained both sides; every part on a shaft retained (Joints table) |
| F3 | PASS | AUTO · served at B, P, Os; fired: j2-live-shaft (36 solids), j10-shaft-in-plan (no solids), j12-flexible (no solids), j11-screw (no solids) · every keyed part keyed or on a D-flat with its retainer |
| F4 | PASS | AUTO / HAND · served at P, Os, Ob; fired: j9-crossed-mesh (no solids), j2-live-shaft (36 solids), j10-shaft-in-plan (no solids), trunnion (no solids) · thrust washers where a part turns free axially |
| F5 | PASS | AUTO / HAND · served at Ob-beam-stops; fired: j5-slide (no solids), pawl-tooth (no solids), j13-compliant (no solids), stops (8 solids) · stop pins at both ends of the beam's swing |
| F6 | N/A | AUTO / HAND · served at no joint; fired: trunnion (no solids), j7-cam (no solids), pallet-contact (no solids), pawl-tooth (no solids), j12-flexible (no solids) · no rest position to hold: the drive positions every part |
| F7 | PASS | AUTO / HAND · served at M; fired: j6-mesh (1 solid), j9-crossed-mesh (no solids), j5-slide (no solids), j12-flexible (no solids), adjustable-length (no solids) · eccentric bushing sets the centre distance and backlash |
| F8 | PASS | AUTO · served at no joint; fired: cross-bearings (no solids), tongue-slot (no solids), j12-flexible (no solids), j11-screw (no solids), lubrication (1 solid) · sealed bearings need none; open contacts oiled or greased where they occur |
| F9 | PASS | AUTO / HAND · served at M; fired: j6-mesh (1 solid), j9-crossed-mesh (no solids), timing-marks (2 solids) · timing marks at the mesh |
| F10 | PASS | AUTO / HAND · served at drive; fired: j12-flexible (no solids), drive (26 solids) · home flag and fork sensor on the input (drive) |
| M1 | PASS | AUTO · fired: hardware primitives · top-face chamfers by part kind (primitives) |
| M2 | PASS | HAND · bosses round every loaded hole |
| M3 | PASS | AUTO · fired: j3-moving-pin (22 solids), hardware primitives · bore entry chamfers |
| M4 | PASS | AUTO / HAND · fired: base (3 solids), fasteners (11 solids) · counterbores and countersinks for heads (base, csk, housings) |
| M5 | PASS | AUTO / HAND · fired: hardware primitives · cutter radii on windows and slots |
| M6 | PASS | AUTO · edge distance and walls clean |
| M7 | N/A | HAND · no bracket corner turns a load |
| M8 | PASS | AUTO · fired: j1-dead-axle (27 solids) · thread undercuts on stepped shafts |
| M9 | PASS | AUTO / HAND · fired: j1-dead-axle (27 solids) · ISO coarse threads, engagement through the tapped part or to a nut |
| M10 | PASS | AUTO / HAND · 124 of 130 solids name a material · materials named by kind and role |
| M11 | PASS | AUTO · fired: j1-dead-axle (27 solids), hardware primitives · centre holes, chamfered ends on turned parts |
| M12 | PASS | HAND · every screw reachable by its key in the explode |
| M13 | PASS | AUTO / HAND · 17 threaded · threadlocker or nyloc on every threaded fastener |
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
| L5 | PASS | AUTO / HAND · fired: see-through (2 solids) · transparency and hidden lines show screws in holes and bearings in bores |
| L6 | PASS | AUTO · depth peeling at every view (shots) |
| L7 | PASS | STYLE · STYLE: turntable orbit, named views, no perspective |
| L8 | PASS | AUTO / HAND · fired: trace-marks (no solids) · centrelines along every joint axis, base dimensions, engraved marks |
| L9 | N/A | AUTO / DATA · no section or detail view declared |
| L10 | PASS | AUTO / STYLE · teaching overlays in the sheet's look |
| R1 | PASS | HAND · every standard part from the primitives and kits |
| R2 | PASS | HAND · standard sizes only |
| R3 | PASS | AUTO · fired: hardware primitives · shared subassemblies, one function each |
| R4 | PASS | AUTO · package v2 25.9 KB · package v2 written at build time |
| R5 | PASS | HAND · no polish; nothing sampled by hand |
| R6 | PASS | FLAG · FLAG: bench run (desktop, below); the phone is measured by David |
| R7 | PASS | HAND / FLAG · polish none; 0 solids added, 0 overrides by the polish |
| R8 | PASS | AUTO / SITE · SITE: thumbnails pre-rendered, cards animate on hover |
| R9 | PASS | AUTO / SITE · setup and bake in the worker, one context |
| R10 | PASS | FLAG · FLAG: the bench page is built for the phone measurement |
| DL1 | PASS | AUTO / HAND · 51 of 130 solids on a dropping rung · every solid, mark and effect on a rung by its kind |
| DL2 | PASS | HAND · default dial: full |
| DL3 | PASS | AUTO · view-aware exceptions in the ladder table |
| DL4 | PASS | SITE · SITE: adaptive dial with hysteresis |
| DL6 | PASS | AUTO · teaching layers drawn at every dial position |
| DL5 | PASS | FLAG · FLAG: bench reports frame time per dial position |
| Q1 | PASS | check, clamp and edge distance clean |
| Q2 | PASS | 0 clashes, 0 unnecessary allows |
| Q3 | PASS | package v2 written, 25.9 KB; site build not checked here · package v2 written; site builds (npm run build) |
| Q4 | PASS | local: tools/shot · dist/shots3/sun-and-planet: record view, PLAN, FRONT, SIDE, ISOMETRIC, the declared views, full explode, both sheets |
| Q5 | PASS | local: tools/bench · tools/bench3 run (desktop) |
| Q6 | PASS | every row judged |
| Q7 | PASS | at 3.0 |
| Q8 | PASS | teaching review: tweak (2026-10-20); the six phases of the finished build are looked at by eye · verdict and decisions in the record and the teaching: line; six phases of the finished build looked at |

## Joints
| Joint | Kit | Block | Support | Stack | F1 locate | F2 retain | F3 torque | F4 thrust | F5 limit | F6 hold | F7 adjust | F8 lube | F9 timing | F10 protect |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| M | J6 | gear-mesh | – | – | none | none | none | none | none | none | Eccentric bushing Ø28, 0.3 mm offset bore Ø14, flanged | none | Rod; Sun | none |
| B | J3 | gear-mesh | – | – | none | Shoulder bolt Ø12 x 16, M10 (ISO 7379) | Shoulder bolt Ø12 x 16, M10 (ISO 7379) | none | none | none | none | none | none | none |
| P | J3 | dyad | – | – | none | Shoulder bolt Ø12 x 25, M10 (ISO 7379) | Shoulder bolt Ø12 x 25, M10 (ISO 7379) | Inner-race spacer 12.2x15.1 | none | none | none | none | none | none |
| Os | J2 | – | – | – | 2 x Dowel pin Ø3 x 10 h6, housing to base | 2 x Internal circlip DIN 472, Ø24; 2 x Internal circlip DIN 472, Ø21; End washer 5.4x20, holds the retainer on the shaft end; Countersunk M5 x 12 (ISO 10642) | Feather key 4 x 4 x 5 (DIN 6885) | 2 x Inner-race spacer 12.2x16.2; Thrust washer 12.2x20, bronze; Wave washer 16.5x20.8, spring steel | none | none | none | none | none | none |
| Ob | J1 | dyad | bridge | – | Bridge over the pivot, on two spigoted posts; Dead axle Ø12, shouldered, M10 end | External circlip DIN 471, Ø12 | none | Thrust washer 12.2x20, bronze | none | none | none | none | none | none |
| Ob-beam-stops | stops | – | – | – | none | none | none | none | 2 x Stop pin Ø6, hardened, on the lever's edge | none | none | none | none | none |
| drive | drive | – | – | – | none | none | none | none | none | none | none | none | none | Home flag, 1 mm steel vane; Fork sensor, slotted optical, 5 mm gap |

## Supports
| Support | Joint | Kind | Route | Least gap mm | Covers | T10 |
|---|---|---|---|---|---|---|
| Ob-bridge | Ob | bridge | first choice | 1.5 | – | – |

## Variants and overrides
| Joint or part | Rule result | Chosen | Why |
|---|---|---|---|
| the central shaft | every gear on a live shaft keyed | the retainer keyed, the sun and its flywheel on bearings | they turn at different rates on one axis (one shaft keys only the bodies that turn together) |
| the rod's planet | a separate body on a pin | a level of the rod (a gear fixed on its end), under the rod | the planet does not turn on the rod; it meshes in the sun's slab |

## Detail ladder
| Rung | Solids | Marks | Frame ms at this dial position |
|---|---|---|---|
| DL-A | 15 | 0 | – |
| DL-B | 0 | 204 | – |
| DL-C | 0 | 0 | 1.11 |
| DL-D | 18 | 0 | – |
| DL-E | 8 | 3 | – |
| DL-F | 0 | 0 | – |
| DL-G | 0 | 0 | 1.12 |
| DL-H | 8 | 0 | – |
| never | 78 | 255 | 1.01 (full) |

## Promotion candidates
None left: a gear fixed on a link's end, a flywheel level under a gear and a shaft that keys only what turns together are rules of the builder.

## Verification
check: clean · K1 residual: 2.3e-13 · claims: 4 of 4 ok · clearance: 0 clashes · clamp: clean · edge distance: clean · package: 25.0 KB
screenshots: dist/shots3/sun-and-planet (record view, PLAN, FRONT, SIDE, ISOMETRIC, explode; both sheets) · bench: tools/bench3 (desktop; 28 deg paced 1.01 ms full, 1.11 at C, 1.12 at G; phone by David)
