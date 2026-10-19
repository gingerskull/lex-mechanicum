# Audit: Lever escapement (lever-escapement)
standard: 2.6 · date: 2026-10-20 · result: pass · detail: full · pass: build

## Summary
PASS 113 · FAIL 0 · N/A 6 · open: none

## Requirements
| Id | Status | Evidence / action |
|---|---|---|
| S1 | PASS | DATA · the standard carries version 2.6 and its changelog |
| S2 | PASS | HAND · header with standard, date, result, detail, pass |
| S3 | PASS | AUTO · tools/conformance reads this header and runs in npm run check |
| S4 | PASS | SITE · #143 holds only this mechanism's decisions and open items |
| P1 | PASS | DATA · record complete; model.ts, polish.ts, audit.md present |
| P2 | PASS | DATA · catalogue validator clean (npm run catalog) |
| P3 | PASS | DATA / SITE · page shows ratio (index step), parallel axes, intermittent and dwell output, other names, family, motion, level, dof and the motorised drive |
| P4 | PASS | DATA · tags grouped Function, Property, Application |
| P5 | PASS | DATA · motion, forces, benefits, limits; uses listed with one line each |
| P6 | PASS | DATA · references and media as in the catalogue record, unchanged in this pass |
| P7 | PASS | HAND / SITE · no prose in model.ts or polish.ts; lint-style clean |
| P8 | PASS | SITE · no parts list, build or joint sections on the page |
| P9 | PASS | HAND · solve(): the balance swings ±270°; the pin is in the fork only within 20° of rest, where the lever flips 5.1° either side; the wheel is locked while the lever is banked and advances about 12° each beat, 24° per balance period, as the text says (detached balance, impulse at mid swing) |
| P10 | PASS | HAND · impulse pin traced with its velocity, input spin at the balance and the train's torque on the wheel, the lever angle, a staircase plot of the wheel angle |
| P11 | PASS | DATA · unchanged record prose: plain, short sentences, mm and degrees |
| K1 | PASS | HAND · check: max link error 0.0e+0 mm · the wheel angle comes only from the simulation in the anchor escapement's escape.ts; tooth form, stones, fork and centres are the model's; the polish adds the hairspring, arms, an eccentric and marks round them |
| K2 | PASS | HAND · check: finite, continuous, periodic over 720 samples |
| K3 | PASS | HAND · custom wheel, lever and stones, discs for pin, roller and balance, caps; at and fixed placement |
| K4 | PASS | HAND · roles output (wheel), driver (roller, balance), link (lever, stones, pin), pin; accent only on the input cap pB |
| K5 | PASS | HAND · check: no INTERFERE, OVERLAP or WARN · wheel and stones layer 0 (the stones 10 mm tall, up into the lever), lever and impulse pin layer 1, roller layer 2, balance layer 3 (a clevis twin of the roller on the staff); check clean |
| K6 | PASS | DATA · 15 club teeth, lift 10.3° (banking 5.1° each side), fork 30 and roller 8 from the catalogue, scaled 2x for the bench (wheel radius 40, fork 60, roller 16, balance 50), balance ±270°, 12° per beat, window |
| K7 | PASS | HAND · input rotary on balance · input rotary on the balance: the motor turns the balance staff back and forth through the belt (±270° is more than a crank and link can swing, V5); the escapement's coupling is time-driven as the catalogue says |
| D1 | PASS | HAND · lever with the stones' seat and the fork, a boss round its pivot; balance as rim and arms; flush caps; bridges shaped as parts; squircle base |
| D2 | PASS | HAND · arms only in the balance, whose inertia is in the rim; bosses round every arbor |
| D3 | PASS | STYLE · roles told apart by pattern and tone in both sheets (screenshots) |
| D4 | PASS | AUTO · fired: base (1 solid), feet (3 solids) · feet concentric with the corner arcs |
| D5 | PASS | AUTO / HAND · a bridge over each dead axle (wheel and lever) on spigoted posts; the base carries the staff housing |
| D6 | PASS | HAND / STYLE · hairspring, stud, stops, marks and leads read quieter than the wheel, lever and balance |
| D7 | PASS | HAND · wheel, lever, balance and bridges carry only load shape and manufacturing marks |
| A1 | PASS | AUTO · pW J1, pL J1, pB J2, fork J4, pallets J7; fired: classify (no solids) · pW J1, pL J1, pB J2 found; the fork and the stones are recorded by hand as their own joints |
| A2 | PASS | AUTO · pW J1, pL J1, pB J2, fork J4, pallets J7 · live shaft at the accent staff, dead axles for the wheel and the lever |
| A3 | PASS | AUTO · fired: classify (no solids) · Ø8 staff in 688-2RS housing bearings; Ø10 wheel axle with an F6800, Ø8 lever axle with an F688 |
| A4 | PASS | AUTO · fired: j1-dead-axle (55 solids) · stepped D-flat staff with end retainer; shouldered axles with undercut threads |
| A5 | PASS | AUTO · fired: j2-live-shaft (28 solids) · D-flat on the Ø8 staff for the roller and the balance; wheel and lever run on their bearings |
| A6 | PASS | AUTO · fired: standoffs (no solids) · no floating fixed plate besides the bridges, on spigoted Ø10 standoffs |
| A7 | PASS | AUTO · fired: base (1 solid), feet (3 solids) · 8 mm base, counterbored corners, feet, scale, clearance hole for the staff |
| A8 | PASS | AUTO · fired: fasteners (stage 3) · every head has its shank; holes cut and tapped by stage 3 |
| A9 | PASS | AUTO / HAND · fired: j2-straddle (no solids) · wheel and lever axles held by base and bridge; the staff is carried by its housing cartridge with the balance sweeping over it (single shear, warn) |
| A10 | PASS | HAND · wheel and stones in one plane, lever and pin above, roller and balance above that; nothing stacked only to clear |
| A11 | PASS | AUTO / HAND · fired: j1-dead-axle (55 solids) · stone load to the lever, its axle, the base and bridge; pin load to the roller, staff, housing, base; hairspring to its stud post and the base |
| A12 | PASS | AUTO · clamp check clean |
| A13 | PASS | AUTO / HAND · 145 solids, 68 unnamed (further items of a listed set) · every solid named with catalogue sizes, sets counted |
| A14 | PASS | HAND · bridge posts and the stud post clear of the balance, lever and wheel sweeps; lever stops by H.stops; clearance 0 |
| A15 | PASS | AUTO · clearance: 0 clashes over the cycle |
| A16 | PASS | HAND · 5 build rules; no note: none; no badge: none · a note and a badge on every joint (pW, pL, pB, both bridge posts, the drive, the fork, the stones), five build rules |
| A17 | PASS | HAND · housing and staff up through the base; wheel axle into its eccentric, wheel, bridge; lever axle, lever with its stones set in shellac, bridge; stud post, hairspring, roller with its pin, balance, end screw |
| E1 | PASS | AUTO · every solid has one explode level; levels -8 to 4.5 · one level per solid; seen at full explode |
| E2 | PASS | AUTO · 38 rigid groups; fired: explode · screws, bolts, shafts and bought units are groups; seen at full explode |
| E3 | PASS | AUTO · fired: explode · screws leave along their axes to the head side |
| E4 | PASS | HAND · wheel and stones low, lever, roller, balance and bridges above: the last fitted goes furthest |
| E5 | PASS | AUTO · fired: explode · bearings and circlips stay in their parts |
| E6 | PASS | AUTO · fired: explode · motor with its bracket, bearings whole |
| E7 | PASS | AUTO · fired: explode · spacers midway |
| E8 | PASS | AUTO · fired: explode · roller and balance keep their order on the staff |
| E9 | PASS | HAND · readable at full explode at 28° and 70° in both sheets |
| J1 | PASS | AUTO · fired: j1-dead-axle (55 solids) · pW and pL: shouldered axles into the base (pW on an eccentric bushing), bearing with circlip, thrust washer, bridge on spigoted posts, oil sink |
| J2 | PASS | AUTO · fired: j2-live-shaft (28 solids), j2-straddle (no solids) · pB: housing with two sealed bearings, spacer sleeve, wave washer, circlips, screwed and dowelled; D-flat staff, end retainer, thrust washer, belt drive |
| J3 | N/A | AUTO · fired: j3-moving-pin (no solids) · no moving pin |
| J4 | N/A | AUTO · fired: j4-slot-roller (no solids) · the impulse pin in the fork is a free pin entering an open slot only within the window, not a track roller on a stud; recorded as the fork joint (promotion candidate) |
| J5 | N/A | AUTO · fired: j5-slide (no solids) · no slide |
| J6 | N/A | AUTO · fired: j6-mesh (no solids) · no gear mesh |
| J7 | N/A | AUTO · fired: j7-cam (no solids) · the stone on a tooth is a sliding contact of hardened faces, not a cam with a roller follower; recorded as the stones joint (promotion candidate) |
| J8 | PASS | AUTO · fired: j8-belt (2 solids) · the drive's belt: flanged small pulley, slotted mount for tension |
| F1 | PASS | AUTO · served at pW, pL, pB, pW-bridge-post, pL-bridge-post; fired: j2-live-shaft (28 solids) · housing dowelled, bridge spigoted |
| F2 | PASS | AUTO · served at pW, pL, pB; fired: j2-live-shaft (28 solids) · bearings held by circlips; staff end retainer and end screw |
| F3 | PASS | AUTO · served at pB; fired: j2-live-shaft (28 solids) · D-flat on the staff for roller and balance |
| F4 | PASS | AUTO / HAND · served at pW, pL, pB; fired: j2-live-shaft (28 solids) · bronze thrust washers under the wheel, the lever and the roller; wave washer preloading the staff |
| F5 | PASS | AUTO / HAND · served at pL; fired: j5-slide (no solids), stops (3 solids) · the rule's stops 2° beyond each of the lever's rests; the balance is driven through its whole swing and the hairspring returns it |
| F6 | PASS | AUTO / HAND · served at pB; fired: j7-cam (no solids) · the hairspring (flat spiral, 4 turns, stud on a post) returns the balance; the lever is held on its rest by the draw of the locking faces. Limit: the spiral is a rigid solid drawn at rest (promotion candidate) |
| F7 | PASS | AUTO / HAND · served at pW, drive; fired: j6-mesh (no solids), j5-slide (no solids) · the stones' depth is set by an eccentric bushing under the wheel's axle (H.eccentricMount), drawn at its set point |
| F8 | PASS | AUTO · served at pW, pL; fired: lubrication (no solids) · oil sinks on the bridges over the open bearings; the stones are named as oiled in the stones note; sealed staff bearings |
| F9 | PASS | AUTO / HAND · served at no joint; fired: timing-marks (no solids) · beat dot on the balance rim and its line on the base, together at rest |
| F10 | PASS | AUTO / HAND · served at drive; fired: drive (37 solids) · home flag on the staff hub read by a fork sensor, pulley flanges, leads to the terminal block |
| M1 | PASS | AUTO · fired: hardware primitives · top edges chamfered by the form style |
| M2 | PASS | HAND · three filleted arms in the balance, the inertia in the rim |
| M3 | PASS | AUTO · fired: j3-moving-pin (no solids), hardware primitives · bore entry rings on the bearing seats and through holes |
| M4 | PASS | AUTO / HAND · fired: base (1 solid), fasteners (stage 3) · counterbores in the base, spot seats by stage 3 |
| M5 | PASS | AUTO / HAND · fired: hardware primitives · arm windows carry a 3 mm radius, the fork's slot a full radius end; tooth roots are the modelled working profile (K1) |
| M6 | PASS | AUTO · edge distance and walls clean |
| M7 | PASS | HAND · the lever's arms run into the boss and the stones' seat on wide straight runs |
| M8 | PASS | AUTO · fired: j1-dead-axle (55 solids) · thread undercuts on the shouldered axles |
| M9 | PASS | AUTO / HAND · fired: j1-dead-axle (55 solids) · M2 to M8 screws in standard lengths with engagement from the tables |
| M10 | PASS | AUTO / HAND · 145 of 145 solids name a material · every solid names a material; steel wheel, ruby stones and pin, hardened lever, brass balance, alloy hairspring |
| M11 | PASS | AUTO · fired: j1-dead-axle (55 solids), hardware primitives · centre holes, wrench flats and chamfered ends on the shafts |
| M12 | PASS | HAND · every screw reachable from above or below; bearings pull through after the bridges come off |
| M13 | PASS | AUTO / HAND · 60 threaded, 0 without a locking method · every threaded fastener names its locking method |
| M14 | N/A | AUTO / HAND · fired: j4-slot-roller (no solids) · no slot liner, slide or cam track; the wearing faces are the ruby stones and pin, separate parts set in the lever and roller |
| V1 | PASS | AUTO · fired: drive (37 solids) · pancake motor with its bracket under the base, GT2 belt 32:16 to the staff pulley |
| V2 | PASS | AUTO · fired: drive (37 solids) · one-piece bracket with the flange screwed up into the base |
| V3 | PASS | AUTO / HAND · fired: drive (37 solids) · belt and pulleys clear of feet and housings; clearance 0 |
| V4 | PASS | AUTO · fired: j8-belt (2 solids) · pulley flanges, hub set screws, belt tension slot |
| V5 | PASS | AUTO · fired: drive (37 solids) · rotary drive by belt to the staff; the motor follows the balance back and forth (a servo motion), because ±270° is beyond a crank and link (see K7) |
| V6 | PASS | AUTO · fired: drive (37 solids) · home flag on the staff hub, fork sensor on the housing, leads to the terminal block, one clip |
| L1 | PASS | STYLE · no look value in model.ts or polish.ts; lint-style clean |
| L2 | PASS | HAND · geometry, roles, materials, marks and accent only |
| L3 | PASS | HAND · roles right on every solid; looked at in both sheets |
| L4 | PASS | HAND / STYLE · accent only on the input cap, the traced path and the forces |
| L5 | PASS | AUTO / HAND · fired: see-through · screws, bearings and shanks are real solids in real holes and show through |
| L6 | PASS | AUTO · depth order correct at plan, 28°, 70° and side in both sheets |
| L7 | PASS | STYLE · tilt 0° to 88°, no shear |
| L8 | PASS | AUTO / HAND · engraved scale and beat marks are marks |
| R1 | PASS | HAND · H.spring, H.standoff, H.screw, H.spokes, H.eccentricMount, bridge and drive subassemblies; the anchor's escape.ts reused for the wheel; the spiral outline is generated in the polish |
| R2 | PASS | HAND · threads M2, M3, M4, M5, M6, M8; joint Ø 8, 10; bearings 688-2RS (8x16x5), F6800 (10x19x5), F688 (8x16x5) · threads M2 to M8; shafts Ø8 and Ø10; bearings from the table |
| R3 | PASS | AUTO · fired: hardware primitives · housing, bridges, stops, eccentric and drive are the shared functions |
| R4 | PASS | AUTO · package 26.8 KB · package written |
| R5 | PASS | HAND · polish 1 ms; no sampling. The model simulates its wheel once at load (7200 steps) |
| R6 | FLAG | FLAG · bench: package 26.7 KB, setup 8.7 ms; frame 2.16 ms plan, 2.73 ms 28°, 1.95 ms side, 2.4 ms explode 70° (local Chrome, RTX 5090) |
| R7 | PASS | HAND · model.ts + polish.ts 14.0 KB |
| R8 | PASS | AUTO / SITE · site behaviour, unchanged |
| DL1 | PASS | AUTO / HAND · 51 of 145 solids on a dropping rung · nothing moved |
| DL2 | PASS | HAND · model detail full · default dial full |
| DL3 | PASS | AUTO · AUTO, unchanged |
| DL4 | PASS | SITE · SITE, unchanged |
| DL5 | FLAG | FLAG · bench rung table written: A 10 solids, B 178 marks, D 20, E 8 and 4 marks, H 13, never 94 and 101 marks |
| Q1 | PASS | check, clamp and edge distance clean |
| Q2 | PASS | 0 clashes |
| Q3 | PASS | package written, 26.8 KB; site build not checked here · page builds from the registry |
| Q4 | PASS | local: tools/shot · plan, 28°, side, full explode at 28° and 70°, both sheets, overlays on, looked at; baselines written |
| Q5 | PASS | local: tools/bench · bench report written; flags noted above |
| Q6 | PASS | every requirement judged; joints table complete |
| Q7 | PASS | tools/conformance: current at 2.6 |

## Joints
| Joint | Type | F1 locate | F2 retain | F3 torque | F4 thrust | F5 limit | F6 hold | F7 adjust | F8 lube | F9 timing | F10 protect |
|---|---|---|---|---|---|---|---|---|---|---|---|
| pW | J1 | 2 x spigot | Internal circlip DIN 472, Ø19; Bearing F6800 (10x19x5) | – free wheel, its torque comes from the train | Thrust washer 10.2x13.1, bronze | – the stones stop it | – held by the stones | Eccentric bushing Ø18, 0.3 mm offset bore Ø10, flanged | Bridge over the pivot, on two spigoted posts | – any tooth serves | – |
| pL | J1 | 2 x spigot | Internal circlip DIN 472, Ø16; Bearing F688 (8x16x5) | – free pivot | Thrust washer 8.2x10.8, bronze | Stop bumper, neoprene sleeve Ø12 | – held on its rest by the draw | – depth set at pW | Bridge over the pivot, on two spigoted posts | – | – |
| pB | J2 | 2 x Dowel pin Ø3 x 10 h6, housing to base | 2 x Internal circlip DIN 472, Ø16; Countersunk M4 x 10 (ISO 10642), into the shaft end, flush; Socket head M4 x 8 (ISO 4762), into the shaft end | Input shaft Ø8 h6, D-flat | Wave washer 12x15.8, spring steel; Thrust washer 8.2x14, bronze | – driven through its whole swing | Hairspring, flat spiral, 4 turns, 1 mm strip | – | none (sealed bearings) | Beat dot on the rim, line on the base | – drive has its own flag |
| pW-bridge-post | post | 2 x spigot | – screwed both ends | – | – | – | – | – | – | – | – |
| pL-bridge-post | post | 2 x spigot | – screwed both ends | – | – | – | – | – | – | – | – |
| drive | drive | – bracket screwed to the base | – | hub set screws | – | – | – | bracket | – | – | Home flag, 1 mm steel vane; 3 x Fork sensor, slotted optical, 5 mm gap; Pulley flanges |
| fork | J4 | – pin pressed into the roller | – | – | – | – window, then free | – | – | – dry | – | – |
| pallets | J7 | – stones set in the lever's slots | shellac | – | – | – | – the locked tooth rests on a stone | Eccentric at pW sets the depth | Escapement oil on the stones | – | – |

## Variants and overrides
| Joint or part | Rule result | Chosen | Why |
|---|---|---|---|
| Balance | plain disc | rim on three arms | M2: the inertia in the rim |
| Hairspring | none | flat spiral under the balance, stud on a post | F6: the balance's return |
| Wheel axle pW | plain seat in the base | eccentric bushing, 0.3 mm | F7: the stones' depth is the one dimension to set |
| Wheel, stones, balance | aluminium default | steel, ruby, brass | M10: contact faces hard, balance dense |
| Beat marks | none | dot on the rim, line on the base | F9: setting in beat |

## Detail ladder
| Rung | Solids | Marks | Frame ms at this dial position |
|---|---|---|---|
| DL-A | 10 | 0 | 2.54 |
| DL-B | 0 | 178 | 2.15 |
| DL-C | 0 | 0 | 2.28 |
| DL-D | 20 | 0 | 2.13 |
| DL-E | 8 | 6 | 2.05 |
| DL-F | 0 | 0 | 2.07 |
| DL-G | 0 | 0 | 1.97 |
| DL-H | 13 | 0 | 1.7 |
| never | 94 | 101 | 2.59 (full) |

## Promotion candidates
- Escapement family playbook for Appendix A (proposed in the PR): as in the anchor escapement's audit, plus the balance's hairspring as a part (F6) and the fork-and-pin window.
- A hairspring primitive that winds with the balance (here a rigid spiral drawn at rest).
- The fork and pin as a joint kind of its own (a pin in an open slot for part of the cycle), and the stones' contact (J7 is a cam with a roller follower).
- A drive for an oscillation wider than a crank can make (here the rotary belt drive turned back and forth).
- A train torque source on the escape wheel is not modelled.

## Verification
check: clean · clearance: 0 clashes · clamp: clean · edge distance: clean · package: 26.8 KB
screenshots: plan, 28°, side, explode 28° and 70°, both sheets (local, looked at) · bench: written, no frame over target
