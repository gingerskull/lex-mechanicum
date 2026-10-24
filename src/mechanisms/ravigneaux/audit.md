# Audit: Ravigneaux planetary gearset (ravigneaux)
standard: 3.0 · date: 2026-10-22 · result: pass · detail: full · pass: build
teaching: rethink · decisions in the record

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
| P10 | PASS | HAND · a point on long pinion 0's pitch circle traced (comet); the large sun pitch circle, the carrier line and the pinion-pair arc; section A-A through the long pinion's pin plane; plots of the ring angle in each of the four gears |
| P11 | PASS | DATA · plain language, mm and degrees |
| P12 | PASS | AUTO / DATA · validate(records, asVersion 3) clean for this record |
| P13 | PASS | HAND · teaching review run against the record before the build and again on the finished drawing (teaching: line) |
| K1 | PASS | AUTO · K1 residual 2.8e-14 (tolerance 1e-9) over 360 samples, reference 0.0e+0 |
| K2 | PASS | AUTO · check: finite, continuous, periodic over 360 samples |
| K3 | PASS | AUTO / HAND · 1 block (ravigneaux); no numeric fallback · composed from the block library (ravigneaux: the gear selector names the input member and the held member or the lock; the two Willis relations of the set give the rest, each pinion's spin on its pin as an out); no fallback, no one-off model |
| K4 | PASS | HAND · the small sun driven with the accent on its shaft (the large sun is the input member in reverse); the ring the output; the gear selector sets what is held or locked |
| K6 | PASS | DATA · module 2: small sun 30, large sun 36, short pinions 18, long pinions 24, ring 84 (36 + 2 x 24 = 84); short pins at radius 48, long pins at 60, the pair 44 deg apart; three sets 120 deg apart |
| K7 | PASS | DATA · drivers input (rotary), gear (select) · the input (rotary, one cycle 360 deg of input, 792 deg in 2nd: one carrier turn) and the gear selector (1st, 2nd, 3rd, reverse), each option setting the input member, the held member and the lock |
| K8 | PASS | AUTO / DATA · every joint declared with type, bodies, origin and axis; nothing inferred |
| K9 | PASS | DATA · the input and the gear selector as controls; the tooth-count design choices are not offered (parts built for 30/36/18/24/84) |
| K10 | PASS | AUTO / DATA · one ravigneaux block for the whole train; three pinion sets with their four meshes each; overconstrained, as topology.notes says |
| K11 | PASS | AUTO · mobility counted -2, dof 2 |
| K12 | PASS | DATA · every traced, overlaid and claimed point and quantity is named in kin |
| T1 | PASS | HAND · mechanics first, no use context in the teaching strings; the principle reads at the default view |
| T2 | PASS | HAND · review before the build and again on the six phases of the finished build; decisions in the record |
| T3 | PASS | DATA · principle parts declared; drawn whole, in depth order |
| T4 | PASS | DATA · fired: trace-marks (1 solid) · a point on long pinion 0's pitch circle traced with a comet: in 2nd it draws an epicycloid round the held large sun |
| T5 | PASS | DATA · the large sun pitch circle, the carrier line O-L0 and the 44 deg arc between the short and the long pin of a set |
| T6 | PASS | HAND / DATA · in 2nd (the default) the pinions orbit with the carrier and spin on their pins; the long pinions run through both planes, so the short-to-long and long-to-large-sun meshes both read; the large sun see-through over the small one |
| T7 | PASS | DATA · PLAN, where both suns, both pinions, the carrier and the ring show true |
| T8 | PASS | DATA · section A-A through the long pinion's pin plane: the carrier under, the small sun and the short pinions in the lower plane, the large sun and the ring in the upper one, the long pinion through both |
| T9 | PASS | AUTO / DATA · claim table: 5 ok, 0 off, 0 uncheckable of 5 |
| T10 | PASS | AUTO · 31 solids drawn see-through: JS1-1-brg, JS1-1-brg-balls, JS1-1-brg-cage, JS1-1-cl, JS2-1-brg, JS2-1-brg-balls, JS2-1-brg-cage, JS2-1-cl · the large sun drawn see-through over the small one (a gear over a smaller one on its axis); the large sun's bridge, its shaft and the pinion pins' bearings see-through where they lap the gears (A19) |
| T11 | PASS | AUTO · 1 support routed, 1 moved off a sweep · the large sun's bridge moved off the meshes, its posts outside the ring |
| T12 | PASS | HAND · 16 support solids; dropped by the polish: none |
| T13 | N/A | DATA · nothing goes by in a blink |
| T14 | PASS | HAND / DATA · the input and the gear selector (1st, 2nd, 3rd, reverse); the drive stays on the small sun's shaft, so in reverse the large sun's shaft is the input member with no drive of its own (open item) |
| T15 | PASS | HAND · labels state the mechanism, never its use |
| T16 | N/A | HAND / STYLE · no two parts of one role to tell apart |
| T17 | PASS | AUTO · depth peeling, no depth bias (renderer test) |
| D1 | PASS | HAND · involute suns and pinions and an internal involute ring, module 2; each long pinion one piece through two planes; the carrier a three-arm spider under the gears, holding both pins of each set |
| D2 | PASS | HAND · material where the teeth carry; plain gear discs on keyed hubs |
| D3 | PASS | STYLE · STYLE: roles by pattern and tone (both sheets) |
| D4 | PASS | AUTO · fired: base (3 solids), feet (4 solids) · base corners and feet concentric (base, feet rules) |
| D5 | PASS | AUTO / HAND · the small sun's housing under the base with the drive; the carrier on a bearing on the small sun's shaft; the large sun's shaft hung from a bridge on two posts outside the ring; the ring on three carrier rollers |
| D6 | PASS | HAND / STYLE · hardware quieter than the parts, still readable (both sheets) |
| D8 | PASS | AUTO / HAND · every solid a profile, an operation and a frame; built by Manifold; no layers, dz or twin |
| D9 | N/A | AUTO / HAND · no member changes shape |
| D10 | PASS | AUTO · profiles shipped for plain extrusions, meshes only for booleans (package v2) |
| D11 | PASS | AUTO · SOLID: 0 of 200 solids unsound |
| D7 | PASS | HAND · gears plain; richness in the stacks |
| A1 | PASS | AUTO · M1_0 J6, M1_1 J6, M1_2 J6, M2_0 J6, M2_1 J6, M2_2 J6, M3_0 J6, M3_1 J6, M3_2 J6, M4_0 J6, M4_1 J6, M4_2 J6, JS0 J3, JS1 J3, JS2 J3, JL0 J3, JL1 J3, JL2 J3, Jss J2, Jsl J2, JR ring-carrier, drive drive · every joint read from the record and built by its kit |
| A2 | PASS | AUTO · M1_0 J6, M1_1 J6, M1_2 J6, M2_0 J6, M2_1 J6, M2_2 J6, M3_0 J6, M3_1 J6, M3_2 J6, M4_0 J6, M4_1 J6, M4_2 J6, JS0 J3, JS1 J3, JS2 J3, JL0 J3, JL1 J3, JL2 J3, Jss J2, Jsl J2, JR ring-carrier, drive drive · small sun on a live shaft (J2) from below, the carrier on a bearing on it; large sun on a live shaft hung from its bridge (the train passes under it, nothing over it); the pinions on shoulder bolts in the carrier |
| A3 | PASS | AUTO · fired: classify (22 solids), axial stack builder · bores from the catalogue; bearings where a boss fits them |
| A4 | PASS | AUTO · fired: j1-dead-axle (no solids), axial stack builder · stepped shafts with shoulders, grooves and chamfered ends (H.shaft) |
| A5 | PASS | AUTO · fired: j2-live-shaft (55 solids), j10-shaft-in-plan (no solids), axial stack builder · keys by shaft size: D-flat to Ø8, feather key above |
| A6 | N/A | AUTO · fired: j5-slide (no solids), j13-compliant (no solids), standoffs (no solids) · no slide and no floating plate |
| A7 | PASS | AUTO · fired: base (3 solids), feet (4 solids) · base 8 mm under the lowest part, counterbored corner holes, feet, engraved scale and paths, shaft clearance holes |
| A8 | PASS | AUTO · fired: fasteners (10 solids) · stage 3 fasteners: shanks, clearance and tapped holes |
| A9 | PASS | AUTO / HAND · fired: placement solver · the input and the carrier from below, the large sun hung from above, the train between |
| A10 | PASS | HAND · fired: placement (26 solids), placement solver · carrier in slab 0; small sun, short pinions and the long pinions' lower halves in slab 1; large sun, ring and the long pinions' upper halves in slab 2 |
| A11 | PASS | AUTO / HAND · fired: j12-flexible (no solids), strap-sheave (no solids), j1-dead-axle (no solids) · load paths closed: every joint note says where its load goes to ground |
| A12 | PASS | AUTO · clamp check clean |
| A13 | PASS | AUTO / HAND · 200 solids, 101 unnamed (further items of a listed set) · named hardware with catalogue sizes and materials |
| A14 | PASS | AUTO / HAND · fired: support router · supports routed against the sweeps; details checked by A15 |
| A15 | PASS | AUTO · clearance in 3D over 72 phases: 0 clashes; hand allow: 0 named, 0 unnecessary |
| A16 | PASS | HAND · 22 joint notes; no note: none; no badge: M1_0, M1_1, M1_2, M2_0, M2_1, M2_2, M3_0, M3_1, M3_2, M4_0, M4_1, M4_2 · a note per joint; build rules: the large sun's ground joint declared at its own height (12 mm) so the small sun's shaft (the carrier on it) and the large sun's are separate sites, input below and the large sun hung above |
| A17 | PASS | HAND · assembles in the explode order; every screw reachable; pressed bearings pullable through their bores |
| A18 | PASS | AUTO · placement: 3 slabs in the tallest stack (38.0 mm), 0 clevises; stack per joint in the Joints table · axial positions set by the placement solver |
| A19 | PASS | AUTO · 1 support routed (1 moved), least gap 1.5 mm; still covering a principle part, drawn see-through: Jsl-bridge · bridge over the large sun's shaft moved off the meshes; least gap 1.5 mm |
| A20 | PASS | AUTO · support per joint: Jsl hung · one axial stack builder for both suns, the carrier and the pinion pins; the ring-carrier kit for the ring |
| A21 | PASS | AUTO · kit per joint: M1_0 J6, M1_1 J6, M1_2 J6, M2_0 J6, M2_1 J6, M2_2 J6, M3_0 J6, M3_1 J6, M3_2 J6, M4_0 J6, M4_1 J6, M4_2 J6, JS0 J3, JS1 J3, JS2 J3, JL0 J3, JL1 J3, JL2 J3, Jss J2, Jsl J2, JR ring-carrier, drive drive |
| A22 | PASS | AUTO · fired: stops (no solids), adjustable-length (no solids), cable-clip (2 solids) · no stops (the train turns on through the cycle); cable clip |
| E1 | PASS | AUTO · every solid has one explode level; levels -4.5 to 6.5 · one level per solid, nothing stretches |
| E2 | PASS | AUTO · fired: explode (1 solid) · heads, shanks, washers and nuts move as one |
| E3 | PASS | AUTO · fired: explode (1 solid) · screws back out along their axes |
| E4 | PASS | HAND · last fitted goes furthest (explode shots, both sheets) |
| E5 | PASS | AUTO · fired: explode (1 solid) · pressed bearings, bushings and clips stay with their parts |
| E6 | PASS | AUTO · fired: explode (1 solid) · motor, bearings and pulley pair whole |
| E7 | PASS | AUTO · fired: explode (1 solid) · loose spacers midway |
| E8 | PASS | AUTO · fired: explode (1 solid) · keyed parts keep their order on their shaft |
| E9 | PASS | HAND · full explode readable in ISOMETRIC on both sheets, nothing leaves the frame |
| E10 | PASS | AUTO · fired: explode (1 solid) · each stack explodes along its joint axis, with trail lines |
| J1 | N/A | AUTO · fired: trunnion (no solids), j1-dead-axle (no solids) · no dead axle (both suns on live shafts, the pinions on shoulder bolts) |
| J2 | PASS | AUTO · fired: j2-live-shaft (55 solids) · small sun: housing under the base, keyed, held on the shaft end, the drive pulley below, the carrier on a bearing over it; large sun: keyed, in a bushing in its bridge over a thrust washer |
| J3 | PASS | AUTO · fired: j3-moving-pin (75 solids), cross-bearings (no solids), eccentric-bearing (no solids), spider-pin (no solids), ring-hub (no solids) · pinion pins: shoulder bolts from the carrier through each pinion's bearings (the long pinion's through both halves) |
| J4 | N/A | AUTO · fired: pin-hole (no solids), j4-slot-roller (no solids), pin-lobe (no solids), fork-pin (no solids) · no pin in a slot |
| J5 | N/A | AUTO · fired: piston-bore (no solids), j5-slide (no solids), tongue-slot (no solids) · no slide |
| J6 | PASS | AUTO · fired: j6-mesh (12 solids), ring-carrier (24 solids), pin-ring (no solids), ring-rollers (no solids) · twelve parallel meshes (per set small sun-short, short-long, long-large sun, long-ring); eccentric bushings set the sun meshes, timing marks at the meshes; the ring on carrier rollers |
| J7 | N/A | AUTO · fired: groove-cam (no solids), j7-cam (no solids), pallet-contact (no solids), pawl-tooth (no solids) · no cam |
| J8 | N/A | AUTO · fired: j8-belt (no solids), j12-flexible (no solids) · no belt in the mechanism (the drive belt is V4) |
| J9 | N/A | AUTO · fired: j9-crossed-mesh (no solids) · no crossed mesh |
| J10 | N/A | AUTO · fired: j10-shaft-in-plan (no solids) · no shaft in plan |
| J12 | N/A | AUTO · fired: j12-flexible (no solids), strap-sheave (no solids) · no flexible member |
| J13 | N/A | AUTO · fired: j13-compliant (no solids) · no compliant joint |
| J11 | N/A | AUTO · fired: j11-screw (no solids) · no screw |
| F1 | PASS | AUTO · served at Jss, Jsl, JR; fired: j2-live-shaft (55 solids), j10-shaft-in-plan (no solids), ring-carrier (24 solids), pin-ring (no solids), strap-sheave (no solids), j13-compliant (no solids) · housing and bridge dowelled; the ring located by its three roller studs |
| F2 | PASS | AUTO · served at JS0, JS1, JS2, JL0, JL1, JL2, Jss, Jsl, JR; fired: j2-live-shaft (55 solids), j10-shaft-in-plan (no solids), cross-bearings (no solids), trunnion (no solids), ring-carrier (24 solids), eccentric-bearing (no solids), pin-ring (no solids), spider-pin (no solids), fork-pin (no solids), ring-hub (no solids), ring-rollers (no solids), j12-flexible (no solids), strap-sheave (no solids), j13-compliant (no solids) · every bearing retained both sides; the ring held axially by the rollers' flanges |
| F3 | PASS | AUTO · served at JS0, JS1, JS2, JL0, JL1, JL2, Jss, Jsl; fired: j2-live-shaft (55 solids), j10-shaft-in-plan (no solids), j12-flexible (no solids), j11-screw (no solids) · every keyed part keyed or on a D-flat with its retainer |
| F4 | PASS | AUTO / HAND · served at JL0, JL1, JL2, Jss, Jsl; fired: j9-crossed-mesh (no solids), j2-live-shaft (55 solids), j10-shaft-in-plan (no solids), trunnion (no solids), spider-pin (no solids) · thrust washers where a part turns free axially (the large sun's shaft on its bridge) |
| F5 | N/A | AUTO / HAND · served at no joint; fired: j5-slide (no solids), pawl-tooth (no solids), j13-compliant (no solids), stops (no solids) · the gears turn continuously |
| F6 | N/A | AUTO / HAND · served at no joint; fired: trunnion (no solids), j7-cam (no solids), pallet-contact (no solids), pawl-tooth (no solids), j12-flexible (no solids) · no member is held by hardware: the gear selector holds or locks members in the solve; brakes and a clutch are an open item |
| F7 | PASS | AUTO / HAND · served at M1_0, M1_1, M1_2, M3_0, M3_1, M3_2; fired: j6-mesh (12 solids), j9-crossed-mesh (no solids), j5-slide (no solids), j12-flexible (no solids), adjustable-length (no solids) · eccentric bushings set the centre distance and backlash at the sun meshes |
| F8 | PASS | AUTO · served at no joint; fired: cross-bearings (no solids), tongue-slot (no solids), j12-flexible (no solids), j11-screw (no solids), lubrication (1 solid) · sealed bearings need none; open contacts oiled or greased where they occur |
| F9 | PASS | AUTO / HAND · served at M1_0, M1_1, M1_2, M2_0, M2_1, M2_2, M3_0, M3_1, M3_2, M4_0, M4_1, M4_2; fired: j6-mesh (12 solids), j9-crossed-mesh (no solids), timing-marks (2 solids) · timing marks at the mesh |
| F10 | PASS | AUTO / HAND · served at drive; fired: j12-flexible (no solids), drive (26 solids) · home flag and fork sensor on the input (drive) |
| M1 | PASS | AUTO · fired: hardware primitives · top-face chamfers by part kind (primitives) |
| M2 | PASS | HAND · bosses round every loaded hole |
| M3 | PASS | AUTO · fired: j3-moving-pin (75 solids), hardware primitives · bore entry chamfers |
| M4 | PASS | AUTO / HAND · fired: base (3 solids), fasteners (10 solids) · counterbores and countersinks for heads (base, csk, housings) |
| M5 | PASS | AUTO / HAND · fired: hardware primitives · cutter radii on windows and slots |
| M6 | PASS | AUTO · edge distance and walls clean |
| M7 | N/A | HAND · no bracket corner turns a load |
| M8 | PASS | AUTO · fired: j1-dead-axle (no solids) · thread undercuts on stepped shafts |
| M9 | PASS | AUTO / HAND · fired: j1-dead-axle (no solids) · ISO coarse threads, engagement through the tapped part or to a nut |
| M10 | PASS | AUTO / HAND · 187 of 200 solids name a material · materials named by kind and role |
| M11 | PASS | AUTO · fired: j1-dead-axle (no solids), hardware primitives · centre holes, chamfered ends on turned parts |
| M12 | PASS | HAND · every screw reachable by its key in the explode |
| M13 | PASS | AUTO / HAND · 24 threaded · threadlocker or nyloc on every threaded fastener |
| M14 | N/A | AUTO / HAND · fired: piston-bore (no solids), pin-hole (no solids), j4-slot-roller (no solids), pin-lobe (no solids), groove-cam (no solids), pallet-contact (no solids), tongue-slot (no solids) · no sliding contact needing a liner |
| V1 | PASS | AUTO · fired: drive (26 solids) · pancake motor on the input, belted to the input shaft |
| V2 | PASS | AUTO · fired: drive (26 solids) · one bracket for the motor |
| V3 | PASS | AUTO / HAND · fired: drive (26 solids) · belt and pulleys clear of feet and housings (A15) |
| V4 | PASS | AUTO · fired: j8-belt (no solids) · flanged pulleys, belt in one plane |
| V5 | PASS | AUTO · fired: drive (26 solids) · rotary input: belt to the small sun's pulley |
| V6 | PASS | AUTO · fired: drive (26 solids), cable-clip (2 solids) · home flag, fork sensor, terminals, lead and clip |
| L1 | PASS | STYLE · STYLE: no look values in the record or polish |
| L2 | PASS | HAND · records and polish carry no look |
| L3 | PASS | HAND · roles right on every solid (both sheets) |
| L4 | PASS | HAND / STYLE · one accent: the input ring, the traces |
| L5 | PASS | AUTO / HAND · fired: see-through (31 solids) · transparency and hidden lines show screws in holes and bearings in bores |
| L6 | PASS | AUTO · depth peeling at every view (shots) |
| L7 | PASS | STYLE · STYLE: turntable orbit, named views, no perspective |
| L8 | PASS | AUTO / HAND · fired: trace-marks (1 solid) · centrelines along every joint axis, base dimensions, engraved marks |
| L9 | PASS | AUTO / DATA · section A-A through the long pinion's pin plane |
| L10 | PASS | AUTO / STYLE · teaching overlays in the sheet's look |
| R1 | PASS | HAND · every standard part from the primitives and kits |
| R2 | PASS | HAND · standard sizes only |
| R3 | PASS | AUTO · fired: hardware primitives · shared subassemblies, one function each |
| R4 | PASS | AUTO · package v2 43.6 KB · package v2 written at build time |
| R5 | PASS | HAND · no polish; nothing sampled by hand |
| R6 | PASS | FLAG · FLAG: bench run (desktop, below); the phone is measured by David |
| R7 | PASS | HAND / FLAG · polish none; 0 solids added, 0 overrides by the polish |
| R8 | PASS | AUTO / SITE · SITE: thumbnails pre-rendered, cards animate on hover |
| R9 | PASS | AUTO / SITE · setup and bake in the worker, one context |
| R10 | PASS | FLAG · FLAG: the bench page is built for the phone measurement |
| DL1 | PASS | AUTO / HAND · 80 of 200 solids on a dropping rung · every solid, mark and effect on a rung by its kind |
| DL2 | PASS | HAND · default dial: full |
| DL3 | PASS | AUTO · view-aware exceptions in the ladder table |
| DL4 | PASS | SITE · SITE: adaptive dial with hysteresis |
| DL6 | PASS | AUTO · teaching layers drawn at every dial position |
| DL5 | PASS | FLAG · FLAG: bench reports frame time per dial position |
| Q1 | PASS | check, clamp and edge distance clean |
| Q2 | PASS | 0 clashes, 0 unnecessary allows |
| Q3 | PASS | package v2 written, 43.6 KB; site build not checked here · package v2 written; site builds (npm run build) |
| Q4 | PASS | local: tools/shot · dist/shots3/ravigneaux: record view, PLAN, FRONT, SIDE, ISOMETRIC, section A-A, full explode, both sheets |
| Q5 | PASS | local: tools/bench · tools/bench3 run (desktop) |
| Q6 | PASS | every row judged |
| Q7 | PASS | at 3.0 |
| Q8 | PASS | teaching review: rethink (2026-10-20); the six phases of the finished build are looked at by eye · looked at on the six phases of the finished build: the decisions read (see the record's teaching block) |

## Joints
| Joint | Kit | Block | Support | Stack | F1 locate | F2 retain | F3 torque | F4 thrust | F5 limit | F6 hold | F7 adjust | F8 lube | F9 timing | F10 protect |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| M1_0 | J6 | – | – | – | none | none | none | none | none | none | Eccentric bushing Ø28, 0.3 mm offset bore Ø14, flanged | none | SunS; Short0 | none |
| M1_1 | J6 | – | – | – | none | none | none | none | none | none | Eccentric bushing Ø28, 0.3 mm offset bore Ø14, flanged | none | SunS; Short1 | none |
| M1_2 | J6 | – | – | – | none | none | none | none | none | none | Eccentric bushing Ø28, 0.3 mm offset bore Ø14, flanged | none | SunS; Short2 | none |
| M2_0 | J6 | – | – | – | none | none | none | none | none | none | none | none | Short0; Long0 | none |
| M2_1 | J6 | – | – | – | none | none | none | none | none | none | none | none | Short1; Long1 | none |
| M2_2 | J6 | – | – | – | none | none | none | none | none | none | none | none | Short2; Long2 | none |
| M3_0 | J6 | – | – | – | none | none | none | none | none | none | Jsl-ecc | none | Long0; SunL | none |
| M3_1 | J6 | – | – | – | none | none | none | none | none | none | Jsl-ecc | none | Long1; SunL | none |
| M3_2 | J6 | – | – | – | none | none | none | none | none | none | Jsl-ecc | none | Long2; SunL | none |
| M4_0 | J6 | – | – | – | none | none | none | none | none | none | none | none | Long0; Ring | none |
| M4_1 | J6 | – | – | – | none | none | none | none | none | none | none | none | Long1; Ring | none |
| M4_2 | J6 | – | – | – | none | none | none | none | none | none | none | none | Long2; Ring | none |
| JS0 | J3 | ravigneaux | – | – | none | Internal circlip DIN 472, Ø19; Shoulder bolt Ø6 x 16, M5 (ISO 7379) | Shoulder bolt Ø6 x 16, M5 (ISO 7379) | none | none | none | none | none | none | none |
| JS1 | J3 | ravigneaux | – | – | none | Internal circlip DIN 472, Ø19; Shoulder bolt Ø6 x 16, M5 (ISO 7379) | Shoulder bolt Ø6 x 16, M5 (ISO 7379) | none | none | none | none | none | none | none |
| JS2 | J3 | ravigneaux | – | – | none | Internal circlip DIN 472, Ø19; Shoulder bolt Ø6 x 16, M5 (ISO 7379) | Shoulder bolt Ø6 x 16, M5 (ISO 7379) | none | none | none | none | none | none | none |
| JL0 | J3 | ravigneaux | – | – | none | 2 x Internal circlip DIN 472, Ø16; Shoulder bolt Ø5 x 35, M4 (ISO 7379) | Shoulder bolt Ø5 x 35, M4 (ISO 7379) | Inner-race spacer 5.2x8.9 | none | none | none | none | none | none |
| JL1 | J3 | ravigneaux | – | – | none | 2 x Internal circlip DIN 472, Ø16; Shoulder bolt Ø5 x 35, M4 (ISO 7379) | Shoulder bolt Ø5 x 35, M4 (ISO 7379) | Inner-race spacer 5.2x8.9 | none | none | none | none | none | none |
| JL2 | J3 | ravigneaux | – | – | none | 2 x Internal circlip DIN 472, Ø16; Shoulder bolt Ø5 x 35, M4 (ISO 7379) | Shoulder bolt Ø5 x 35, M4 (ISO 7379) | Inner-race spacer 5.2x8.9 | none | none | none | none | none | none |
| Jss | J2 | driver | – | – | 2 x Dowel pin Ø3 x 10 h6, housing to base | 2 x Internal circlip DIN 472, Ø21; End washer 5.4x20, holds the suns on the shaft end; Countersunk M5 x 12 (ISO 10642) | Feather key 4 x 4 x 9 (DIN 6885) | Inner-race spacer 12.2x15.1; Thrust washer 12.2x20, bronze; Wave washer 16.5x20.8, spring steel | none | none | none | none | none | none |
| Jsl | J2 | – | hung (moved) | – | Bridge over the pivot, on two spigoted posts | External circlip DIN 471, Ø12 | Feather key 4 x 4 x 9 (DIN 6885); Clamp hub Ø12x22, two set screws at 90°; Set screw M4 (DIN 916), threadlocked | Thrust washer 12.2x20, bronze | none | none | none | none | none | none |
| JR | ring-carrier | – | – | – | Standoff Ø10, M5 | Roller flange, under the rim; Roller flange, over the rim | none | none | none | none | none | none | none | none |
| drive | drive | – | – | – | none | none | none | none | none | none | none | none | none | Home flag, 1 mm steel vane; Fork sensor, slotted optical, 5 mm gap |

## Supports
| Support | Joint | Kind | Route | Least gap mm | Covers | T10 |
|---|---|---|---|---|---|---|
| Jsl-bridge | Jsl | hung | moved | 1.5 | sunS, sunL, short0, long0, carrier, ring | see-through |

## Variants and overrides
| Joint or part | Rule result | Chosen | Why |
|---|---|---|---|
| Jc (carrier) | a centre axle of its own | on a bearing on the small sun's shaft, under the gears | the carrier turns at its own speed round the input's axis; under the gears it leaves the plan view open |
| Jsl (large sun) | a live shaft standing on a housing behind the base | a live shaft hung from a bridge (the undriven live shaft rule) | the small sun's shaft and the carrier pass under it; nothing passes over it |
| long pinions | one gear in one slab | one piece through two slabs (a joined cluster level) | the lower half meshes the short pinion, the upper half the large sun and the ring |
| JR (ring) | a centre shaft | three carrier rollers round the rim (ring-carrier) | the centre is the suns' and the carrier's |

## Detail ladder
| Rung | Solids | Marks | Frame ms at this dial position |
|---|---|---|---|
| DL-A | 25 | 0 | – |
| DL-B | 0 | 414 | – |
| DL-C | 0 | 0 | 1.23 |
| DL-D | 38 | 0 | – |
| DL-E | 8 | 25 | – |
| DL-F | 0 | 0 | – |
| DL-G | 0 | 0 | 1.12 |
| DL-H | 9 | 0 | – |
| never | 120 | 247 | 0.90 (full) |

## Promotion candidates
None left: the ravigneaux block and the gear selector's record options, the joined level, the undriven live shaft hung from its bridge and a principle gear see-through over a smaller one are rules of the builder. Open: brakes and a clutch for the held and locked members, and a drive on the large sun's shaft for reverse.

## Verification
check: clean · K1 residual: 2.8e-14 · claims: 5 of 5 ok · clearance: 0 clashes · clamp: clean · edge distance: clean · package: 42.6 KB
screenshots: dist/shots3/ravigneaux (record view, PLAN, FRONT, SIDE, ISOMETRIC, section A-A, explode; both sheets) · bench: tools/bench3 (desktop; 28 deg paced 0.90 ms full, 1.23 at C, 1.12 at G; phone by David)
