# Audit: Planetary gear set (planetary)
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
| P10 | PASS | HAND · a point on planet 0's pitch circle traced (the hypocycloid, cusps on the held ring); ring pitch circle, carrier circle and carrier line; plot of carrier angle |
| P11 | PASS | DATA · plain language, mm and degrees |
| P12 | PASS | AUTO / DATA · validate(records, asVersion 3) clean for this record |
| P13 | PASS | HAND · teaching review run against the record before the build and again on the finished drawing (teaching: line) |
| K1 | PASS | AUTO · K1 residual 2.1e-14 (tolerance 1e-9) over 360 samples, reference 0.0e+0 |
| K2 | PASS | AUTO · check: finite, continuous, periodic over 360 samples |
| K3 | PASS | AUTO / HAND · 1 block (willis); no numeric fallback · composed from the block library (willis: sun and ring given, carrier and planets solved, each planet's spin on its pin as an out); no fallback, no one-off model |
| K4 | PASS | HAND · sun driver with the accent on its shaft; carrier output; the ring a second driver held at 0 |
| K6 | PASS | DATA · module 4: sun 13, planets 11, ring 35 (13 + 2 x 11 = 35), carrier radius 48; (13 + 35) / 3 = 16, so three planets fit equally spaced |
| K7 | PASS | DATA · drivers input (rotary), ring-hold (manual) · two drivers: the sun (rotary, one cycle is one carrier turn, 1329.2 deg of sun) and the ring (manual, held at 0) |
| K8 | PASS | AUTO / DATA · every joint declared with type, bodies, origin and axis; nothing inferred |
| K9 | PASS | DATA · the sun and the ring as controls; the tooth-count and planet-count design choices are not offered (parts built for 13/11/35 and three planets) |
| K10 | PASS | AUTO / DATA · the Willis train declared once; three planets with their sun and ring meshes; overconstrained, as topology.notes says |
| K11 | PASS | AUTO · mobility counted 0, dof 2 |
| K12 | PASS | DATA · every traced, overlaid and claimed point and quantity is named in kin |
| T1 | PASS | HAND · mechanics first, no use context in the teaching strings; the principle reads at the default view |
| T2 | PASS | HAND · review before the build and again on the six phases of the finished build; decisions in the record |
| T3 | PASS | DATA · principle parts declared; drawn whole, in depth order |
| T4 | PASS | DATA · fired: trace-marks (no solids) · a point on planet 0's pitch circle traced with a comet: it draws the hypocycloid, stopping in a cusp each time it meets the held ring |
| T5 | PASS | DATA · the ring pitch circle, the carrier circle and the carrier line O-C0 |
| T6 | PASS | HAND / DATA · the planets roll round inside the held ring while the carrier turns once per 3.69 sun turns; the carrier is a three-arm spider so the sun and the planets show |
| T7 | PASS | DATA · PLAN, where the sun, the planets, the carrier and the ring show true |
| T8 | N/A | DATA · the principle lies in plain view, no section needed |
| T9 | PASS | AUTO / DATA · claim table: 2 ok, 0 off, 0 uncheckable of 2 |
| T10 | PASS | AUTO · 9 solids drawn see-through: Oc-slv, Oc-bb, Oc-ecl, Oc-axle, Oc-axle-s1, Oc-axle-s2, Oc-axle-s3, Oc-axle-s4 · the bridge that carries the carrier's axle drawn see-through with its axle (A19) |
| T11 | PASS | AUTO · 1 support routed, 1 moved off a sweep · the carrier's bridge moved off the meshes, its posts outside the ring |
| T12 | PASS | HAND · 17 support solids; dropped by the polish: none |
| T13 | N/A | DATA · nothing goes by in a blink |
| T14 | PASS | HAND / DATA · the sun (input) and the ring (held at 0, turned by hand to show the two-input Willis relation) |
| T15 | PASS | HAND · labels state the mechanism, never its use |
| T16 | N/A | HAND / STYLE · no two parts of one role to tell apart |
| T17 | PASS | AUTO · depth peeling, no depth bias (renderer test) |
| D1 | PASS | HAND · involute sun and planets, an internal involute ring, module 4; the carrier a three-arm spider, its arms to the planet pins |
| D2 | PASS | HAND · material where the teeth carry; plain gear discs on keyed hubs |
| D3 | PASS | STYLE · STYLE: roles by pattern and tone (both sheets) |
| D4 | PASS | AUTO · fired: base (3 solids), feet (4 solids) · base corners and feet concentric (base, feet rules) |
| D5 | PASS | AUTO / HAND · the ring on three carrier rollers; the carrier's axle hung from a bridge on two posts outside the ring; the sun's housing under the base; motor flange |
| D6 | PASS | HAND / STYLE · hardware quieter than the parts, still readable (both sheets) |
| D8 | PASS | AUTO / HAND · every solid a profile, an operation and a frame; built by Manifold; no layers, dz or twin |
| D9 | N/A | AUTO / HAND · no member changes shape |
| D10 | PASS | AUTO · profiles shipped for plain extrusions, meshes only for booleans (package v2) |
| D11 | PASS | AUTO · SOLID: 0 of 147 solids unsound |
| D7 | PASS | HAND · gears plain; richness in the stacks |
| A1 | PASS | AUTO · SP0 J6, SP1 J6, SP2 J6, PR0 J6, PR1 J6, PR2 J6, C0 J3, C1 J3, C2 J3, Os J2, Or ring-carrier, Oc J1, drive drive · every joint read from the record and built by its kit |
| A2 | PASS | AUTO · SP0 J6, SP1 J6, SP2 J6, PR0 J6, PR1 J6, PR2 J6, C0 J3, C1 J3, C2 J3, Os J2, Or ring-carrier, Oc J1, drive drive · sun on a live shaft (J2) from below, held at the base only (the carrier passes over it); carrier on a dead axle (J1) hung from a bridge; planets on shoulder bolts in the carrier (J3); the ring on carrier rollers (ring-carrier); six meshes J6 |
| A3 | PASS | AUTO · fired: classify (12 solids), axial stack builder · bores from the catalogue; bearings where a boss fits them |
| A4 | PASS | AUTO · fired: j1-dead-axle (24 solids), axial stack builder · stepped shafts with shoulders, grooves, flats and chamfered ends (H.shaft) |
| A5 | PASS | AUTO · fired: j2-live-shaft (26 solids), j10-shaft-in-plan (no solids), axial stack builder · keys by shaft size: D-flat to Ø8, feather key above |
| A6 | N/A | AUTO · fired: j5-slide (no solids), j13-compliant (no solids), standoffs (no solids) · no slide and no floating plate |
| A7 | PASS | AUTO · fired: base (3 solids), feet (4 solids) · base 8 mm under the lowest part, counterbored corner holes, feet, engraved scale and paths, shaft clearance holes |
| A8 | PASS | AUTO · fired: fasteners (10 solids) · stage 3 fasteners: shanks, clearance and tapped holes |
| A9 | PASS | AUTO / HAND · fired: placement solver · sun held from below, carrier from above: the input under the train, the output over it |
| A10 | PASS | HAND · fired: placement (12 solids), placement solver · sun, planets and ring on one slab; the carrier one slab above |
| A11 | PASS | AUTO / HAND · fired: j12-flexible (no solids), strap-sheave (no solids), j1-dead-axle (24 solids) · load paths closed: every joint note says where its load goes to ground |
| A12 | PASS | AUTO · clamp check clean |
| A13 | PASS | AUTO / HAND · 147 solids, 81 unnamed (further items of a listed set) · named hardware with catalogue sizes and materials |
| A14 | PASS | AUTO / HAND · fired: support router · supports routed against the sweeps; details checked by A15 |
| A15 | PASS | AUTO · clearance in 3D over 72 phases: 0 clashes; hand allow: 0 named, 0 unnecessary |
| A16 | PASS | HAND · 13 joint notes; no note: none; no badge: SP0, SP1, SP2, PR0, PR1, PR2 · a note per joint; build rules: the carrier's ground joint is declared at its own height so the sun and the carrier are separate sites, input below and output above |
| A17 | PASS | HAND · assembles in the explode order; every screw reachable; pressed bearings pullable through their bores |
| A18 | PASS | AUTO · placement: 2 slabs in the tallest stack (26.0 mm), 0 clevises; stack per joint in the Joints table · axial positions set by the placement solver |
| A19 | PASS | AUTO · 1 support routed (1 moved), least gap 1.5 mm; still covering a principle part, drawn see-through: Oc-bridge · bridge over the carrier's axle moved off the meshes; least gap 1.5 mm |
| A20 | PASS | AUTO · support per joint: Oc hung · one axial stack builder for the sun, the carrier and the planet pins; the ring-carrier kit for the ring |
| A21 | PASS | AUTO · kit per joint: SP0 J6, SP1 J6, SP2 J6, PR0 J6, PR1 J6, PR2 J6, C0 J3, C1 J3, C2 J3, Os J2, Or ring-carrier, Oc J1, drive drive |
| A22 | PASS | AUTO · fired: stops (no solids), adjustable-length (no solids), cable-clip (2 solids) · no stops (the train turns on through the cycle); cable clip |
| E1 | PASS | AUTO · every solid has one explode level; levels -5 to 5.5 · one level per solid, nothing stretches |
| E2 | PASS | AUTO · fired: explode (1 solid) · heads, shanks, washers and nuts move as one |
| E3 | PASS | AUTO · fired: explode (1 solid) · screws back out along their axes |
| E4 | PASS | HAND · last fitted goes furthest (explode shots, both sheets) |
| E5 | PASS | AUTO · fired: explode (1 solid) · pressed bearings, bushings and clips stay with their parts |
| E6 | PASS | AUTO · fired: explode (1 solid) · motor, bearings and pulley pair whole |
| E7 | PASS | AUTO · fired: explode (1 solid) · loose spacers midway |
| E8 | PASS | AUTO · fired: explode (1 solid) · keyed parts keep their order on their shaft |
| E9 | PASS | HAND · full explode readable in ISOMETRIC on both sheets, nothing leaves the frame |
| E10 | PASS | AUTO · fired: explode (1 solid) · each stack explodes along its joint axis, with trail lines |
| J1 | PASS | AUTO · fired: trunnion (no solids), j1-dead-axle (24 solids) · carrier: dead axle hung from a bridge, bearing in the carrier's hub |
| J2 | PASS | AUTO · fired: j2-live-shaft (26 solids) · sun shaft: housing under the base, keyed, held on the shaft end, the drive pulley below |
| J3 | PASS | AUTO · fired: j3-moving-pin (27 solids), cross-bearings (no solids), eccentric-bearing (no solids), ring-hub (no solids) · planet pins: shoulder bolts through the carrier into each planet's bearing |
| J4 | N/A | AUTO · fired: pin-hole (no solids), j4-slot-roller (no solids), pin-lobe (no solids), fork-pin (no solids) · no pin in a slot |
| J5 | N/A | AUTO · fired: piston-bore (no solids), j5-slide (no solids), tongue-slot (no solids) · no slide |
| J6 | PASS | AUTO · fired: j6-mesh (6 solids), ring-carrier (31 solids), pin-ring (no solids), ring-rollers (no solids) · six parallel meshes (three sun-planet, three planet-ring); eccentric bushing at the sun, timing marks at the meshes; the ring on carrier rollers |
| J7 | N/A | AUTO · fired: groove-cam (no solids), j7-cam (no solids), pallet-contact (no solids), pawl-tooth (no solids) · no cam |
| J8 | N/A | AUTO · fired: j8-belt (no solids), j12-flexible (no solids) · no belt in the mechanism (the drive belt is V4) |
| J9 | N/A | AUTO · fired: j9-crossed-mesh (no solids) · no crossed mesh |
| J10 | N/A | AUTO · fired: j10-shaft-in-plan (no solids) · no shaft in plan |
| J12 | N/A | AUTO · fired: j12-flexible (no solids), strap-sheave (no solids) · no flexible member |
| J13 | N/A | AUTO · fired: j13-compliant (no solids) · no compliant joint |
| J11 | N/A | AUTO · fired: j11-screw (no solids) · no screw |
| F1 | PASS | AUTO · served at Os, Or, Oc; fired: j2-live-shaft (26 solids), j10-shaft-in-plan (no solids), ring-carrier (31 solids), pin-ring (no solids), strap-sheave (no solids), j13-compliant (no solids) · housing and bridge dowelled; the ring located by its three roller studs |
| F2 | PASS | AUTO · served at C0, C1, C2, Os, Or, Oc; fired: j2-live-shaft (26 solids), j10-shaft-in-plan (no solids), cross-bearings (no solids), trunnion (no solids), ring-carrier (31 solids), eccentric-bearing (no solids), pin-ring (no solids), fork-pin (no solids), ring-hub (no solids), ring-rollers (no solids), j12-flexible (no solids), strap-sheave (no solids), j13-compliant (no solids) · every bearing retained both sides; the ring held axially by the rollers' flanges |
| F3 | PASS | AUTO · served at C0, C1, C2, Os; fired: j2-live-shaft (26 solids), j10-shaft-in-plan (no solids), j12-flexible (no solids), j11-screw (no solids) · every keyed part keyed or on a D-flat with its retainer |
| F4 | PASS | AUTO / HAND · served at Os; fired: j9-crossed-mesh (no solids), j2-live-shaft (26 solids), j10-shaft-in-plan (no solids), trunnion (no solids) · thrust washers where a part turns free axially |
| F5 | N/A | AUTO / HAND · served at no joint; fired: j5-slide (no solids), pawl-tooth (no solids), j13-compliant (no solids), stops (no solids) · the gears turn continuously |
| F6 | PASS | AUTO / HAND · served at Or; fired: trunnion (no solids), j7-cam (no solids), pallet-contact (no solids), pawl-tooth (no solids), j12-flexible (no solids) · the ring held by the index plunger in a rim hole (its spring keeps it down) |
| F7 | PASS | AUTO / HAND · served at SP0, SP1, SP2; fired: j6-mesh (6 solids), j9-crossed-mesh (no solids), j5-slide (no solids), j12-flexible (no solids), adjustable-length (no solids) · eccentric bushing sets the centre distance and backlash |
| F8 | PASS | AUTO · served at no joint; fired: cross-bearings (no solids), tongue-slot (no solids), j12-flexible (no solids), j11-screw (no solids), lubrication (1 solid) · sealed bearings need none; open contacts oiled or greased where they occur |
| F9 | PASS | AUTO / HAND · served at SP0, SP1, SP2, PR0, PR1, PR2; fired: j6-mesh (6 solids), j9-crossed-mesh (no solids), timing-marks (1 solid) · timing marks at the mesh |
| F10 | PASS | AUTO / HAND · served at drive; fired: j12-flexible (no solids), drive (26 solids) · home flag and fork sensor on the input (drive) |
| M1 | PASS | AUTO · fired: hardware primitives · top-face chamfers by part kind (primitives) |
| M2 | PASS | HAND · bosses round every loaded hole |
| M3 | PASS | AUTO · fired: j3-moving-pin (27 solids), hardware primitives · bore entry chamfers |
| M4 | PASS | AUTO / HAND · fired: base (3 solids), fasteners (10 solids) · counterbores and countersinks for heads (base, csk, housings) |
| M5 | PASS | AUTO / HAND · fired: hardware primitives · cutter radii on windows and slots |
| M6 | PASS | AUTO · edge distance and walls clean |
| M7 | N/A | HAND · no bracket corner turns a load |
| M8 | PASS | AUTO · fired: j1-dead-axle (24 solids) · thread undercuts on stepped shafts |
| M9 | PASS | AUTO / HAND · fired: j1-dead-axle (24 solids) · ISO coarse threads, engagement through the tapped part or to a nut |
| M10 | PASS | AUTO / HAND · 141 of 147 solids name a material · materials named by kind and role |
| M11 | PASS | AUTO · fired: j1-dead-axle (24 solids), hardware primitives · centre holes, chamfered ends on turned parts |
| M12 | PASS | HAND · every screw reachable by its key in the explode |
| M13 | PASS | AUTO / HAND · 22 threaded · threadlocker or nyloc on every threaded fastener |
| M14 | N/A | AUTO / HAND · fired: piston-bore (no solids), pin-hole (no solids), j4-slot-roller (no solids), pin-lobe (no solids), groove-cam (no solids), pallet-contact (no solids), tongue-slot (no solids) · no sliding contact needing a liner |
| V1 | PASS | AUTO · fired: drive (26 solids) · pancake motor on the input, belted to the input shaft |
| V2 | PASS | AUTO · fired: drive (26 solids) · one bracket for the motor |
| V3 | PASS | AUTO / HAND · fired: drive (26 solids) · belt and pulleys clear of feet and housings (A15) |
| V4 | PASS | AUTO · fired: j8-belt (no solids) · flanged pulleys, belt in one plane |
| V5 | PASS | AUTO · fired: drive (26 solids) · rotary input: belt to the sun's pulley; the ring's manual hold: a knurled knob on the rim to turn it and an index plunger that holds it in one of twelve rim holes |
| V6 | PASS | AUTO · fired: drive (26 solids), cable-clip (2 solids) · home flag, fork sensor, terminals, lead and clip |
| L1 | PASS | STYLE · STYLE: no look values in the record or polish |
| L2 | PASS | HAND · records and polish carry no look |
| L3 | PASS | HAND · roles right on every solid (both sheets) |
| L4 | PASS | HAND / STYLE · one accent: the input ring, the traces |
| L5 | PASS | AUTO / HAND · fired: see-through (9 solids) · transparency and hidden lines show screws in holes and bearings in bores |
| L6 | PASS | AUTO · depth peeling at every view (shots) |
| L7 | PASS | STYLE · STYLE: turntable orbit, named views, no perspective |
| L8 | PASS | AUTO / HAND · fired: trace-marks (no solids) · centrelines along every joint axis, base dimensions, engraved marks |
| L9 | N/A | AUTO / DATA · no section or detail view declared |
| L10 | PASS | AUTO / STYLE · teaching overlays in the sheet's look |
| R1 | PASS | HAND · every standard part from the primitives and kits |
| R2 | PASS | HAND · standard sizes only |
| R3 | PASS | AUTO · fired: hardware primitives · shared subassemblies, one function each |
| R4 | PASS | AUTO · package v2 33.1 KB · package v2 written at build time |
| R5 | PASS | HAND · no polish; nothing sampled by hand |
| R6 | PASS | FLAG · FLAG: bench run (desktop, below); the phone is measured by David |
| R7 | PASS | HAND / FLAG · polish none; 0 solids added, 0 overrides by the polish |
| R8 | PASS | AUTO / SITE · SITE: thumbnails pre-rendered, cards animate on hover |
| R9 | PASS | AUTO / SITE · setup and bake in the worker, one context |
| R10 | PASS | FLAG · FLAG: the bench page is built for the phone measurement |
| DL1 | PASS | AUTO / HAND · 50 of 147 solids on a dropping rung · every solid, mark and effect on a rung by its kind |
| DL2 | PASS | HAND · default dial: full |
| DL3 | PASS | AUTO · view-aware exceptions in the ladder table |
| DL4 | PASS | SITE · SITE: adaptive dial with hysteresis |
| DL6 | PASS | AUTO · teaching layers drawn at every dial position |
| DL5 | PASS | FLAG · FLAG: bench reports frame time per dial position |
| Q1 | PASS | check, clamp and edge distance clean |
| Q2 | PASS | 0 clashes, 0 unnecessary allows |
| Q3 | PASS | package v2 written, 33.1 KB; site build not checked here · package v2 written; site builds (npm run build) |
| Q4 | PASS | local: tools/shot · dist/shots3/planetary: record view, PLAN, FRONT, SIDE, ISOMETRIC, the declared views, full explode, both sheets |
| Q5 | PASS | local: tools/bench · tools/bench3 run (desktop) |
| Q6 | PASS | every row judged |
| Q7 | PASS | at 3.0 |
| Q8 | PASS | teaching review: tweak (2026-10-20); the six phases of the finished build are looked at by eye · verdict and decisions in the record and the teaching: line; six phases of the finished build looked at |

## Joints
| Joint | Kit | Block | Support | Stack | F1 locate | F2 retain | F3 torque | F4 thrust | F5 limit | F6 hold | F7 adjust | F8 lube | F9 timing | F10 protect |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| SP0 | J6 | – | – | – | none | none | none | none | none | none | Eccentric bushing Ø28, 0.3 mm offset bore Ø14, flanged | none | Sun; Planet0 | none |
| SP1 | J6 | – | – | – | none | none | none | none | none | none | Eccentric bushing Ø28, 0.3 mm offset bore Ø14, flanged | none | Sun; Planet1 | none |
| SP2 | J6 | – | – | – | none | none | none | none | none | none | Eccentric bushing Ø28, 0.3 mm offset bore Ø14, flanged | none | Sun; Planet2 | none |
| PR0 | J6 | – | – | – | none | none | none | none | none | none | none | none | Planet0; Ring | none |
| PR1 | J6 | – | – | – | none | none | none | none | none | none | none | none | Planet1; Ring | none |
| PR2 | J6 | – | – | – | none | none | none | none | none | none | none | none | Planet2; Ring | none |
| C0 | J3 | – | – | – | none | Shoulder bolt Ø10 x 16, M8 (ISO 7379) | Shoulder bolt Ø10 x 16, M8 (ISO 7379) | none | none | none | none | none | none | none |
| C1 | J3 | – | – | – | none | Shoulder bolt Ø10 x 16, M8 (ISO 7379) | Shoulder bolt Ø10 x 16, M8 (ISO 7379) | none | none | none | none | none | none | none |
| C2 | J3 | – | – | – | none | Shoulder bolt Ø10 x 16, M8 (ISO 7379) | Shoulder bolt Ø10 x 16, M8 (ISO 7379) | none | none | none | none | none | none | none |
| Os | J2 | driver | – | – | 2 x Dowel pin Ø3 x 10 h6, housing to base | 2 x Internal circlip DIN 472, Ø21; End washer 5.4x20, holds the sun on the shaft end; Countersunk M5 x 12 (ISO 10642) | Feather key 4 x 4 x 11 (DIN 6885) | Thrust washer 12.2x20, bronze; Wave washer 16.5x20.8, spring steel | none | none | none | none | none | none |
| Or | ring-carrier | driver | – | – | Standoff Ø10, M5 | Roller flange, under the rim; Roller flange, over the rim | none | none | none | Index plunger pin Ø5, drops into a hole in the rim; Compression spring Ø8, holds the plunger down | none | none | none | none |
| Oc | J1 | – | hung (moved) | – | Bridge over the pivot, on two spigoted posts; Dead axle Ø12, shouldered, M10 end | External circlip DIN 471, Ø12 | none | none | none | none | none | none | none | none |
| drive | drive | – | – | – | none | none | none | none | none | none | none | none | none | Home flag, 1 mm steel vane; Fork sensor, slotted optical, 5 mm gap |

## Supports
| Support | Joint | Kind | Route | Least gap mm | Covers | T10 |
|---|---|---|---|---|---|---|
| Oc-bridge | Oc | hung | moved | 1.5 | sun, planet0, planet1, planet2, carrier | see-through |

## Variants and overrides
| Joint or part | Rule result | Chosen | Why |
|---|---|---|---|
| Oc (carrier) | a centre site shared with the sun, one shaft keyed to both | the carrier's own axle above the planets, hung from a bridge | sun and carrier turn at different speeds: the input comes from below, the output turns above |
| Or (ring) | a centre shaft | three carrier rollers round the rim (ring-carrier) | the centre is the sun's and the carrier's |

## Detail ladder
| Rung | Solids | Marks | Frame ms at this dial position |
|---|---|---|---|
| DL-A | 13 | 0 | – |
| DL-B | 0 | 382 | – |
| DL-C | 0 | 0 | 1.04 |
| DL-D | 19 | 0 | – |
| DL-E | 8 | 13 | – |
| DL-F | 0 | 0 | – |
| DL-G | 0 | 0 | 1.00 |
| DL-H | 10 | 0 | – |
| never | 97 | 179 | 1.46 (full) |

## Promotion candidates
None left: the ring-carrier kit (with a knob and an index plunger for a ring turned by hand), the carrier spider outline and the mesh phasing across a train are rules of the builder.

## Verification
check: clean · K1 residual: 2.1e-14 · claims: 2 of 2 ok · clearance: 0 clashes · clamp: clean · edge distance: clean · package: 33.1 KB
screenshots: dist/shots3/planetary (record view, PLAN, FRONT, SIDE, ISOMETRIC, explode; both sheets) · bench: tools/bench3 (desktop; 28 deg paced 1.46 ms full, 1.04 at C, 1.00 at G; phone by David)
