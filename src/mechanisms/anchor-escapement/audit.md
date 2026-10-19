# Audit: Anchor escapement (anchor-escapement)
standard: 2.6 · date: 2026-10-20 · result: pass · detail: full · pass: build

## Summary
PASS 110 · FAIL 0 · N/A 9 · open: none

## Requirements
| Id | Status | Evidence / action |
|---|---|---|
| S1 | PASS | DATA · the standard carries version 2.6 and its changelog |
| S2 | PASS | HAND · header with standard, date, result, detail, pass |
| S3 | PASS | AUTO · tools/conformance reads this header and runs in npm run check |
| S4 | PASS | SITE · #141 holds only this mechanism's decisions and open items |
| P1 | PASS | DATA · record complete; model.ts, polish.ts, audit.md present |
| P2 | PASS | DATA · catalogue validator clean (npm run catalog) |
| P3 | PASS | DATA / SITE · page shows ratio (index step), parallel axes, intermittent, reversing and dwell output, other names, family, motion, level, dof and the motorised drive |
| P4 | PASS | DATA · tags grouped Function, Property, Application |
| P5 | PASS | DATA · motion, forces, benefits, limits; uses listed with one line each |
| P6 | PASS | DATA · references and media as in the catalogue record, unchanged in this pass |
| P7 | PASS | HAND / SITE · no prose in model.ts or polish.ts; lint-style clean |
| P8 | PASS | SITE · no parts list, build or joint sections on the page |
| P9 | PASS | HAND · solve(): the anchor swings ±3°, the wheel is locked most of the period, is pushed back about 1° while a pallet goes in, and drops forward twice per period, 12° in all, as the text says (one tooth per period, recoil) |
| P10 | PASS | HAND · bob centre traced with its velocity, input spin at the arbor and the train's torque on the wheel, the swing angle, a staircase plot of the wheel angle with the recoil dips |
| P11 | PASS | DATA · unchanged record prose: plain, short sentences, mm and degrees |
| K1 | PASS | HAND · check: max link error 0.0e+0 mm · the wheel angle comes only from the simulation in escape.ts; tooth form, pallet faces and centres are the model's; the polish adds spokes, an eccentric and marks round them |
| K2 | PASS | HAND · check: finite, continuous, periodic over 720 samples |
| K3 | PASS | HAND · custom wheel, anchor and pendulum, caps; at and fixed placement |
| K4 | PASS | HAND · roles output (wheel), driver (anchor), link (pendulum), pin; accent only on the input cap pA |
| K5 | PASS | HAND · check: no INTERFERE, OVERLAP or WARN · pendulum layer -1 (a clevis twin of the anchor on one arbor), wheel and anchor layer 0, the pallets working in the wheel's plane; check clean |
| K6 | PASS | DATA · N 30, tip 50, root 44, span 7.5 teeth (90°), d = r / cos 45° = 70.7, amplitude ±3°, 12° per period with about 1° recoil as the catalogue. Deliberate differences, commented in model.ts: the pendulum is drawn 120 mm long (catalogue L = 994) and points away from the wheel, the bench plan being flat; pallet faces are turned 35° off the dead line and give about 3° of lift (catalogue 3° to 4°); pallet places found by search |
| K7 | PASS | HAND · input oscillating on anchor · input oscillating on the anchor: the drive swings the arbor through the pendulum's ±3° |
| D1 | PASS | HAND · anchor bowed outside the teeth with a boss round the arbor; flush caps; one bridge shaped as a part; squircle base |
| D2 | PASS | HAND · spokes only in the wheel, which starts and stops every beat; bosses round both arbors; the anchor arms bow where the teeth are not |
| D3 | PASS | STYLE · roles told apart by pattern and tone in both sheets (screenshots) |
| D4 | PASS | AUTO · fired: base (1 solid), feet (3 solids) · feet concentric with the corner arcs |
| D5 | PASS | AUTO / HAND · one bridge over the wheel's axle on two spigoted posts; the base carries the arbor housing |
| D6 | PASS | HAND / STYLE · stops, marks, eccentric and leads read quieter than the wheel, anchor and pendulum |
| D7 | PASS | HAND · wheel, anchor, pendulum and bridge carry only load shape and manufacturing marks |
| A1 | PASS | AUTO · pE J1, pA J2, escapement J7; fired: classify (no solids) · pE J1, pA J2 found; the pallet contact is recorded by hand as its own joint (escapement) |
| A2 | PASS | AUTO · pE J1, pA J2, escapement J7 · live shaft at the accent arbor, dead axle for the wheel |
| A3 | PASS | AUTO · fired: classify (no solids) · Ø8 arbor in 688-2RS housing bearings; Ø10 wheel axle with an F6800 in the wheel |
| A4 | PASS | AUTO · fired: j1-dead-axle (28 solids) · stepped D-flat arbor with end retainer; shouldered wheel axle with undercut thread |
| A5 | PASS | AUTO · fired: j2-live-shaft (27 solids) · D-flat on the Ø8 arbor for the anchor and the pendulum; the wheel runs on its bearing |
| A6 | PASS | AUTO · fired: standoffs (no solids) · no floating fixed plate besides the bridge, on spigoted Ø10 standoffs |
| A7 | PASS | AUTO · fired: base (1 solid), feet (3 solids) · 8 mm base, counterbored corners, feet, scale, clearance hole for the arbor; the base grew to carry the pendulum and the drive |
| A8 | PASS | AUTO · fired: fasteners (stage 3) · every head has its shank; holes cut and tapped by stage 3 |
| A9 | PASS | AUTO / HAND · fired: j2-straddle (no solids) · the wheel axle is held by base and bridge; the anchor arbor is carried by its housing cartridge and the anchor sweeps over it, so no bridge (single shear, warn, as the ratchet's input) |
| A10 | PASS | HAND · wheel and anchor share z 0 to 6, the pendulum one layer under the anchor, outside the wheel |
| A11 | PASS | AUTO / HAND · fired: j1-dead-axle (28 solids) · pallet load to the anchor, its keyed arbor, the housing, the base; wheel to its axle, base and bridge; housing screwed and dowelled |
| A12 | PASS | AUTO · clamp check clean |
| A13 | PASS | AUTO / HAND · 106 solids, 54 unnamed (further items of a listed set) · every solid named with catalogue sizes, sets counted |
| A14 | PASS | HAND · bridge posts outside the wheel and the anchor's sweep; pendulum stops placed by H.stops beyond its swing; clearance 0 |
| A15 | PASS | AUTO · clearance: 0 clashes over the cycle |
| A16 | PASS | HAND · 5 build rules; no note: none; no badge: none · a note and a badge on every joint (pE, pA, the bridge posts, the drive, the escapement), five build rules |
| A17 | PASS | HAND · housing and arbor up through the base, thrust washer, pendulum, spacer, anchor, end screw; wheel axle into its eccentric, wheel on its bearing, bridge last |
| E1 | PASS | AUTO · every solid has one explode level; levels -8 to 3 · one level per solid; seen at full explode |
| E2 | PASS | AUTO · 30 rigid groups; fired: explode · screws, bolts, shafts and bought units are groups; seen at full explode |
| E3 | PASS | AUTO · fired: explode · screws leave along their axes to the head side |
| E4 | PASS | HAND · pendulum under the anchor, wheel and anchor on their layer, bridge and heads above: the last fitted goes furthest |
| E5 | PASS | AUTO · fired: explode · bearings and circlips stay in their parts |
| E6 | PASS | AUTO · fired: explode · motor with its bracket, bearings whole |
| E7 | PASS | AUTO · fired: explode · spacers midway |
| E8 | PASS | AUTO · fired: explode · pendulum and anchor keep their order on the arbor |
| E9 | PASS | HAND · readable at full explode at 28° and 70° in both sheets |
| J1 | PASS | AUTO · fired: j1-dead-axle (28 solids) · pE: shouldered axle into the base on an eccentric bushing, bearing with circlip, thrust washer, bridge on spigoted posts, oil sink |
| J2 | PASS | AUTO · fired: j2-live-shaft (27 solids), j2-straddle (no solids) · pA: housing with two sealed bearings, spacer sleeve, wave washer, circlips, screwed and dowelled; D-flat arbor, end retainer, thrust washer |
| J3 | N/A | AUTO · fired: j3-moving-pin (no solids) · no moving pin |
| J4 | N/A | AUTO · fired: j4-slot-roller (no solids) · no pin in a slot |
| J5 | N/A | AUTO · fired: j5-slide (no solids) · no slide |
| J6 | N/A | AUTO · fired: j6-mesh (no solids) · no gear mesh |
| J7 | N/A | AUTO · fired: j7-cam (no solids) · the pallet on a tooth is a sliding contact of hardened faces, not a cam with a roller follower; recorded as the escapement joint (promotion candidate) |
| J8 | N/A | AUTO · fired: j8-belt (no solids) · the oscillating drive is a crank and link: no belt |
| F1 | PASS | AUTO · served at pE, pA, pE-bridge-post; fired: j2-live-shaft (27 solids) · housing dowelled, bridge spigoted |
| F2 | PASS | AUTO · served at pE, pA; fired: j2-live-shaft (27 solids) · bearings held by circlips; arbor end retainer and end screw |
| F3 | PASS | AUTO · served at pA; fired: j2-live-shaft (27 solids) · D-flat on the arbor for anchor and pendulum |
| F4 | PASS | AUTO / HAND · served at pE, pA; fired: j2-live-shaft (27 solids) · bronze thrust washers under the pendulum and the wheel; wave washer preloading the arbor |
| F5 | PASS | AUTO / HAND · served at pA; fired: j5-slide (no solids), stops (no solids) · stops 2° beyond both ends of the pendulum's swing beside its rod (polish, H.stops); the wheel needs none, the pallets hold it |
| F6 | N/A | AUTO / HAND · served at no joint; fired: j7-cam (no solids) · the wheel is held by the pallets at every phase; nothing rattles free |
| F7 | PASS | AUTO / HAND · served at pE; fired: j6-mesh (no solids), j5-slide (no solids) · the depth of engagement is set by an eccentric bushing under the wheel's axle (H.eccentricMount), drawn at its set point |
| F8 | PASS | AUTO · served at pE; fired: lubrication (no solids) · oil sink on the bridge over the wheel's bearing; the pallet faces are named as oiled in the escapement note; sealed arbor bearings |
| F9 | PASS | AUTO / HAND · served at no joint; fired: timing-marks (no solids) · beat line on the base past the bob and two ticks at the ends of the swing |
| F10 | PASS | AUTO / HAND · served at drive; fired: drive (33 solids) · home flag on the drive crank read by a fork sensor, leads to the terminal block; the crank stops at its dead centres inside the pendulum stops |
| M1 | PASS | AUTO · fired: hardware primitives · top edges chamfered by the form style |
| M2 | PASS | HAND · six filleted spokes in the wheel, web 7 mm round the bearing and under the roots |
| M3 | PASS | AUTO · fired: j3-moving-pin (no solids), hardware primitives · bore entry rings on the bearing seats and through holes |
| M4 | PASS | AUTO / HAND · fired: base (1 solid), fasteners (stage 3) · counterbores in the base, spot seats by stage 3 |
| M5 | PASS | AUTO / HAND · fired: hardware primitives · spoke windows carry a 3 mm radius; the tooth roots are the modelled working profile (K1) |
| M6 | PASS | AUTO · edge distance and walls clean |
| M7 | PASS | HAND · the anchor's arms run into the boss on wide straight runs; no loaded inside corner left sharp |
| M8 | PASS | AUTO · fired: j1-dead-axle (28 solids) · thread undercut on the shouldered axle |
| M9 | PASS | AUTO / HAND · fired: j1-dead-axle (28 solids) · M3, M4, M5, M8 screws in standard lengths with engagement from the tables |
| M10 | PASS | AUTO / HAND · 106 of 106 solids name a material · every solid names a material; wheel brass, anchor hardened steel with ground pallet faces, pendulum steel rod and brass bob |
| M11 | PASS | AUTO · fired: j1-dead-axle (28 solids), hardware primitives · centre holes, wrench flats and chamfered ends on the shafts |
| M12 | PASS | HAND · every screw reachable from above or below; the wheel bearing pulls through after the bridge comes off |
| M13 | PASS | AUTO / HAND · 45 threaded, 0 without a locking method · every threaded fastener names its locking method |
| M14 | N/A | AUTO / HAND · fired: j4-slot-roller (no solids) · no slot, slide or cam track; the wearing faces are the hardened pallets, a part of the anchor (separate jewelled pallets are a promotion candidate) |
| V1 | PASS | AUTO · fired: drive (33 solids) · motor with its bracket under the base (oscillating build, pancake outrunner) |
| V2 | PASS | AUTO · fired: drive (33 solids) · one-piece bracket with the flange screwed up into the base |
| V3 | PASS | AUTO / HAND · fired: drive (33 solids) · drive clear of feet and housings; clearance 0 |
| V4 | N/A | AUTO · fired: j8-belt (no solids) · no belt or pulleys in the oscillating drive |
| V5 | PASS | AUTO · fired: drive (33 solids) · motor turns a 2 mm crank, a 94 mm link swings a 39 mm lever on the arbor through exactly the modelled 6° (the drive's long lever for small swings, see promotion candidates) |
| V6 | PASS | AUTO · fired: drive (33 solids) · home flag on the drive crank, fork sensor, leads to the terminal block, one clip |
| L1 | PASS | STYLE · no look value in model.ts or polish.ts; lint-style clean |
| L2 | PASS | HAND · geometry, roles, materials, marks and accent only |
| L3 | PASS | HAND · roles right on every solid; looked at in both sheets |
| L4 | PASS | HAND / STYLE · accent only on the input cap, the traced path and the forces |
| L5 | PASS | AUTO / HAND · fired: see-through · screws, bearings and shanks are real solids in real holes and show through |
| L6 | PASS | AUTO · depth order correct at plan, 28°, 70° and side in both sheets |
| L7 | PASS | STYLE · tilt 0° to 88°, no shear |
| L8 | PASS | AUTO / HAND · engraved scale and beat marks are marks |
| R1 | PASS | HAND · H.spokes, H.eccentricMount, H.stops, bridge and drive subassemblies; the wheel, anchor and pendulum are custom parts |
| R2 | PASS | HAND · threads M3, M4, M5, M8; joint Ø 8, 10; bearings 688-2RS (8x16x5), F6800 (10x19x5) · threads M3, M4, M5, M8; shafts Ø8 and Ø10; bearings from the table |
| R3 | PASS | AUTO · fired: hardware primitives · housing, bridge, stops, eccentric and drive are the shared functions |
| R4 | PASS | AUTO · package 20.0 KB · package written |
| R5 | PASS | HAND · polish 1 ms; no sampling in the polish. The model simulates its wheel once at load (about 60 ms in Node, 7200 steps) |
| R6 | FLAG | FLAG · bench: package 20 KB, setup 9.9 ms; frame 1.67 ms plan, 2.04 ms 28°, 2.13 ms side, 2.41 ms explode 70° (local Chrome, RTX 5090) |
| R7 | PASS | HAND · model.ts + polish.ts 12.2 KB |
| R8 | PASS | AUTO / SITE · site behaviour, unchanged |
| DL1 | PASS | AUTO / HAND · 37 of 106 solids on a dropping rung · nothing moved |
| DL2 | PASS | HAND · model detail full · default dial full |
| DL3 | PASS | AUTO · AUTO, unchanged |
| DL4 | PASS | SITE · SITE, unchanged |
| DL5 | FLAG | FLAG · bench rung table written: A 8 solids, B 140 marks, D 13, E 8 and 5 marks, H 8, never 69 and 85 marks |
| Q1 | PASS | check, clamp and edge distance clean |
| Q2 | PASS | 0 clashes |
| Q3 | PASS | package written, 20.0 KB; site build not checked here · page builds from the registry |
| Q4 | PASS | local: tools/shot · plan, 28°, side, full explode at 28° and 70°, both sheets, overlays on, looked at; baselines written |
| Q5 | PASS | local: tools/bench · bench report written; flags noted above |
| Q6 | PASS | every requirement judged; joints table complete |
| Q7 | PASS | tools/conformance: current at 2.6 |

## Joints
| Joint | Type | F1 locate | F2 retain | F3 torque | F4 thrust | F5 limit | F6 hold | F7 adjust | F8 lube | F9 timing | F10 protect |
|---|---|---|---|---|---|---|---|---|---|---|---|
| pE | J1 | 2 x spigot | Internal circlip DIN 472, Ø19; Bearing F6800 (10x19x5) | – free wheel, its torque comes from the train | Thrust washer 10.2x13.1, bronze | – the pallets stop it | – held by the pallets | Eccentric bushing Ø18, 0.3 mm offset bore Ø10, flanged | Bridge over the pivot, on two spigoted posts | – the wheel has no phase to keep: any tooth serves | – |
| pA | J2 | 2 x Dowel pin Ø3 x 10 h6, housing to base | 2 x Internal circlip DIN 472, Ø16; Countersunk M4 x 10 (ISO 10642), into the shaft end, flush; Socket head M4 x 8 (ISO 4762), into the shaft end | Input shaft Ø8 h6, D-flat | Wave washer 12x15.8, spring steel; Thrust washer 8.2x14, bronze | 2 x Stop bumper, neoprene sleeve Ø12 | – driven through its whole swing | – the centre distance is adjusted at pE | none (sealed bearings) | Beat line on the base | – drive has its own flag, see drive |
| pE-bridge-post | post | 2 x spigot | – screwed both ends | – | – | – | – | – | – | – | – |
| drive | drive | – bracket screwed to the base | – | – | – | – crank dead centres | – | – | – | – | Home flag on the drive crank; 3 x Fork sensor, slotted optical, 5 mm gap |
| escapement | J7 | – pallets are part of the anchor | – | – | – | – | – the locked tooth rests on a pallet | Eccentric at pE sets the depth | Clock oil on the pallet faces | – | – |

## Variants and overrides
| Joint or part | Rule result | Chosen | Why |
|---|---|---|---|
| Wheel | plain disc | six spokes, web 7 mm | M2: the wheel starts and stops every beat |
| Wheel axle pE | plain seat in the base | eccentric bushing, 0.3 mm | F7: the depth of engagement is the one dimension to set |
| Pendulum | no stops (input skipped by the rule) | stops 2° beyond its swing beside the rod | F5: with the drive off the pendulum would swing on |
| Wheel, anchor | aluminium default | brass wheel, hardened steel anchor | M10: the pallet faces are the contact surfaces |
| Beat marks | none | line past the bob, ticks at the swing ends | F9: setting the clock in beat |

## Detail ladder
| Rung | Solids | Marks | Frame ms at this dial position |
|---|---|---|---|
| DL-A | 8 | 0 | 1.84 |
| DL-B | 0 | 140 | 1.88 |
| DL-C | 0 | 0 | 1.64 |
| DL-D | 13 | 0 | 1.46 |
| DL-E | 8 | 5 | 1.32 |
| DL-F | 0 | 0 | 1.49 |
| DL-G | 0 | 0 | 1.3 |
| DL-H | 8 | 0 | 1.13 |
| never | 69 | 85 | 1.99 (full) |

## Promotion candidates
- Escapement family playbook for Appendix A (proposed in the PR, not in the standard yet): wheel found by simulation in the model (escape.ts: pushed forward at a limited speed, pushed back by the pallets); the pendulum or balance as the oscillating input, the drive swinging it through exactly the modelled range; the depth of engagement adjustable by an eccentric under the wheel axle (F7); stops beside the pendulum or banking pins (F5); beat marks (F9); oiled, hardened pallet faces (F8, M10).
- The pallet contact as a joint type of its own (J7 is a cam with a roller follower); separate screwed or jewelled pallets as replaceable wear parts (M14).
- A train torque source on the escape wheel (weight or spring barrel) is not modelled: the bench wheel is shown urged forward by its train (force overlay).
- Oscillating drive for small swings: a lever long enough for a 2 mm crank (shared change in this PR, src/hardware/sub/drive.ts; every existing mechanism swings 34° or more and is unchanged).

## Verification
check: clean · clearance: 0 clashes · clamp: clean · edge distance: clean · package: 20.0 KB
screenshots: plan, 28°, side, explode 28° and 70°, both sheets (local, looked at) · bench: written, no frame over target
