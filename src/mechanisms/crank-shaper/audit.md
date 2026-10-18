# Audit: Crank and slotted lever quick-return (crank-shaper)
standard: 2.3 · date: 2026-10-18 · result: pass · detail: full · pass: build

## Summary
PASS 116 · FAIL 0 · N/A 5 · open: none

## Requirements
| Id | Status | Evidence / action |
|---|---|---|
| S1 | PASS | DATA · the standard carries version 2.3 and its changelog |
| S2 | PASS | HAND · header with standard, date, result, detail, pass |
| S3 | PASS | AUTO · tools/conformance reads this header |
| S4 | PASS | SITE · #23 holds only this mechanism's decisions and open items |
| P1 | PASS | DATA · record complete; model.ts, polish.ts, audit.md present |
| P2 | PASS | DATA · catalogue validator clean |
| P3 | PASS | DATA / SITE · ratio (stroke, cut:return 1.71:1), axes, output character, backdrivable, other names, family, motion, level, dof and the motorised drive on the page |
| P4 | PASS | DATA · tags grouped Function, Property, Application, keywords underneath |
| P5 | PASS | DATA · motion, forces, benefits, limits; three real-world uses with one line each |
| P6 | PASS | DATA · Wikipedia (two) plus FIRGELLI and course notes; two real videos, a photo page; real world: three YouTube videos checked by oEmbed, all live and showing a running shaper |
| P7 | PASS | HAND / SITE · no prose in model.ts or polish.ts; lint-style clean |
| P8 | PASS | SITE · no parts list, build or joint sections on the page |
| P9 | PASS | HAND · cut 227.2° and return 132.8° (1.71:1), lever swing ±23.6° and stroke 128 mm match solve(): ram x -28 to 100 |
| P10 | PASS | HAND · lever tip path traced, velocity at the ram and crank pin, link force line, input spin, lever angle, ram position plot |
| P11 | PASS | DATA · plain, short sentences, no em dashes, mm and degrees |
| K1 | PASS | HAND · check: link error 1.4e-14 mm; the polish changes notes only, the model plates the lever and the cap |
| K2 | PASS | HAND · check: finite, continuous, periodic over 720 samples |
| K3 | PASS | HAND · custom (crank), slotLink (lever), link, slider (ram), plate (cap), rails, caps; between, at and fixed placement |
| K4 | PASS | HAND · roles driver, link, output, ground, pin; accent only on the input cap pO2 |
| K5 | PASS | HAND · check clean: crank and link layer 1, lever layer 2 (dz -2.5), ram and rails layer 0, cap layer 2 (dz -2.5); overhangs 1.5 mm |
| K6 | PASS | DATA · r 40, d 100, Ll 160, l 40, yR 64 as the catalogue; beta 23.58°, stroke 128 mm |
| K7 | PASS | HAND · input rotary on the crank |
| D1 | PASS | HAND · tapered link, custom crank with counterweight lobe, slot link with stadium slot, slider on stadium rails |
| D2 | PASS | HAND · bosses round every pin; the lever is a plain bar with the slot; no windows |
| D3 | PASS | STYLE · roles told apart by pattern and tone in both sheets |
| D4 | PASS | AUTO · fired: base (1 solid), feet (4 solids) |
| D5 | PASS | AUTO / HAND · rails seated on ground pads; the cap on a single post; one bridge over the lever pivot |
| D6 | PASS | HAND / STYLE · slide hardware, stops and leads read quieter than crank, lever and ram |
| D7 | PASS | HAND · crank, lever, link, ram, rails and base carry only load shape and manufacturing marks |
| A1 | PASS | AUTO · pO2 J2, pO3 J1, pA J4, pB J3, pC J3, slide-ram J5; fired: classify (no solids) |
| A2 | PASS | AUTO · pO2 J2, pO3 J1, pA J4, pB J3, pC J3, slide-ram J5 |
| A3 | PASS | AUTO · fired: classify (no solids) |
| A4 | PASS | AUTO · fired: j1-dead-axle (28 solids) |
| A5 | PASS | AUTO · fired: j2-live-shaft (28 solids) |
| A6 | PASS | AUTO · fired: standoffs (40 solids) |
| A7 | PASS | AUTO · fired: base (1 solid), feet (4 solids) |
| A8 | PASS | AUTO · fired: fasteners (stage 3) |
| A9 | PASS | HAND · pC a clevis (ram and cap): double shear. pA single shear (the lever sweeps over the crank); pB single shear (a rear plate would sweep through the ram rails); both with a 1.5 mm overhang by plating; pO3 held at both ends by base and bridge |
| A10 | PASS | HAND · crank, link and ram near the base; lever 1.5 mm over crank and link; cap 1.5 mm over the link |
| A11 | PASS | HAND · crank pin to crank to keyed input to the housing (screwed and dowelled); lever to its axle to the base and bridge; ram to rails, keeper and gib; rails screwed through pads and dowelled |
| A12 | PASS | AUTO · clamp check clean |
| A13 | PASS | AUTO / HAND · every named solid carries catalogue sizes; unnamed items are further items of a counted set |
| A14 | PASS | HAND · stops and the pivot bridge sit outside the lever swing; clearance 0 over the cycle |
| A15 | PASS | AUTO · clearance: 0 clashes over the cycle |
| A16 | PASS | HAND · a note and a badge on every joint, five build rules |
| A17 | PASS | HAND · housing and shaft, crank; axle, lever on its bearing, bridge; rail pads and rails, dowels, gib, ram, keeper; link on both pins; cap post, cap and screw last |
| E1 | PASS | AUTO · every solid has one explode level; levels -8 to 4 |
| E2 | PASS | AUTO · 58 rigid groups; fired: explode |
| E3 | PASS | AUTO · fired: explode |
| E4 | PASS | HAND · cap above the link, link and lever above the crank: the last part fitted goes furthest |
| E5 | PASS | AUTO · fired: explode |
| E6 | PASS | AUTO · fired: explode |
| E7 | PASS | AUTO · fired: explode |
| E8 | PASS | AUTO · fired: explode |
| E9 | PASS | HAND · readable at full explode at 28° and 70° in both sheets |
| J1 | PASS | AUTO · fired: j1-dead-axle (28 solids) |
| J2 | PASS | AUTO · fired: j2-live-shaft (28 solids), j2-straddle (no solids) |
| J3 | PASS | AUTO · fired: j3-moving-pin (25 solids) |
| J4 | PASS | AUTO · fired: j4-slot-roller (19 solids) |
| J5 | PASS | AUTO · fired: j5-slide (26 solids) |
| J6 | N/A | N/A · no gear mesh |
| J7 | N/A | N/A · no cam |
| J8 | PASS | AUTO · fired: j8-belt (2 solids) |
| F1 | PASS | AUTO · served at pO2, pO3, pO3-bridge-post, raila-seat, railb-seat; fired: j2-live-shaft (28 solids) |
| F2 | PASS | AUTO · served at pO2, pO3, pA, pB, pC, slide-ram; fired: j2-live-shaft (28 solids) |
| F3 | PASS | AUTO · served at pO2; fired: j2-live-shaft (28 solids) |
| F4 | PASS | AUTO / HAND · served at pO2, pO3; fired: j2-live-shaft (28 solids) |
| F5 | PASS | AUTO / HAND · served at pO3, slide-ram; fired: j5-slide (26 solids), stops (6 solids) |
| F6 | N/A | N/A · driven; no rest position to hold |
| F7 | PASS | AUTO / HAND · served at slide-ram, drive; fired: j6-mesh (no solids), j5-slide (26 solids) |
| F8 | PASS | AUTO · served at pO3, pA, slide-ram; fired: lubrication (no solids) |
| F9 | N/A | N/A · one crank and one keyed phase; no meshing parts or multi-crank phase to mark |
| F10 | PASS | AUTO / HAND · served at drive; fired: drive (37 solids) |
| M1 | PASS | AUTO · fired: hardware primitives |
| M2 | PASS | HAND · the crank carries a counterweight lobe; the lever is a plain bar; no windows needed |
| M3 | PASS | AUTO · fired: j3-moving-pin (25 solids), hardware primitives |
| M4 | PASS | AUTO / HAND · fired: base (1 solid), fasteners (stage 3) |
| M5 | PASS | AUTO / HAND · fired: hardware primitives |
| M6 | PASS | AUTO · edge distance and walls clean |
| M7 | N/A | N/A · no bracket or plate turns a load round a corner |
| M8 | PASS | AUTO · fired: j1-dead-axle (28 solids) |
| M9 | PASS | AUTO / HAND · fired: j1-dead-axle (28 solids) |
| M10 | PASS | AUTO / HAND · 223 of 223 solids name a material |
| M11 | PASS | AUTO · fired: j1-dead-axle (28 solids), hardware primitives |
| M12 | PASS | HAND · every screw reachable; bearings can be pulled from the open side of each plate |
| M13 | PASS | AUTO / HAND · 103 threaded, 0 without a locking method |
| M14 | PASS | AUTO / HAND · fired: j4-slot-roller (19 solids) |
| V1 | PASS | AUTO · fired: drive (37 solids) |
| V2 | PASS | AUTO · fired: drive (37 solids) |
| V3 | PASS | AUTO / HAND · fired: drive (37 solids) |
| V4 | PASS | AUTO · fired: j8-belt (2 solids) |
| V5 | PASS | AUTO · fired: drive (37 solids) |
| V6 | PASS | AUTO · fired: drive (37 solids) |
| L1 | PASS | STYLE |
| L2 | PASS | HAND · model and polish hold geometry, roles and notes only |
| L3 | PASS | HAND · roles right on every solid |
| L4 | PASS | HAND / STYLE · accent on the input cap only |
| L5 | PASS | AUTO / HAND · fired: see-through |
| L6 | PASS | AUTO |
| L7 | PASS | STYLE |
| L8 | PASS | AUTO / HAND |
| R1 | PASS | HAND · no inline outlines in the polish; every part from the part family or a rule |
| R2 | PASS | HAND · threads M2, M2.5, M3, M4, M5, M6, M8; joint Ø 6, 8, 10; bearings 6800-2RS (10x19x5), F688ZZ (8x16x5), F686ZZ (6x13x5), F6800 (10x19x5) |
| R3 | PASS | AUTO · fired: hardware primitives |
| R4 | PASS | AUTO · package 29.8 KB |
| R5 | PASS | HAND · the polish only writes notes; 0 ms |
| R6 | PASS | FLAG · bench: package 29.8 KB, setup 2.1 ms; Node CPU canvas frames 231 to 311 ms (not comparable with the 8 ms browser target); dial H 38.7 ms |
| R7 | PASS | HAND · model.ts + polish.ts 6.3 KB |
| R8 | PASS | AUTO / SITE |
| DL1 | PASS | AUTO / HAND · 77 of 223 solids on a dropping rung |
| DL2 | PASS | HAND · model detail full |
| DL3 | PASS | AUTO |
| DL4 | PASS | SITE · title block shows the dial |
| DL5 | PASS | FLAG · bench reports solids, marks and frame time per rung |
| Q1 | PASS | check, clamp and edge distance clean |
| Q2 | PASS | 0 clashes |
| Q3 | PASS | package written, 29.8 KB; site build by CI |
| Q4 | PASS | local: tools/shot at plan, 28°, side and full explode at 28° and 70°, both sheets, overlays on |
| Q5 | PASS | local: tools/bench run; numbers under Verification |
| Q6 | PASS | this sheet; every row judged, joints table complete |
| Q7 | PASS | tools/conformance current at 2.3 |

## Joints
| Joint | Type | F1 locate | F2 retain | F3 torque | F4 thrust | F5 limit | F6 hold | F7 adjust | F8 lube | F9 timing | F10 protect |
|---|---|---|---|---|---|---|---|---|---|---|---|
| pO2 | J2 | 2 x Dowel pin Ø3 x 10 h6, housing to base | 2 x Internal circlip DIN 472, Ø19; Countersunk M5 x 12 (ISO 10642), into the shaft end, flush; Socket head M5 x 10 (ISO 4762), into the shaft end | Feather key 3 x 3 x 6 (DIN 6885) | Wave washer 14.5x18.8, spring steel; Thrust washer 10.2x16, bronze | – limited at the lever pivot and the rail ends | – driven, no rest position | – exact by construction | – sealed bearings | – single keyed phase | – protected at the drive |
| pO3 | J1 | 2 x spigot | Internal circlip DIN 472, Ø19; Bearing F6800 (10x19x5) | – plain pin, nothing keyed | Thrust washer 10.2x13.1, bronze | 2 x Stop bumper, neoprene sleeve Ø12 | – driven, no rest position | – exact by construction | Bridge over the pivot, on two spigoted posts | – single keyed phase | – protected at the drive |
| pA | J4 | – moving joint, no removable bearing plate | head | – plain pin, nothing keyed | – clamped stack, no free axial play | – limited at the lever pivot and the rail ends | – driven, no rest position | – exact by construction | Felt oiler, oil-soaked wool felt | – single keyed phase | – protected at the drive |
| pB | J3 | – moving joint, no removable bearing plate | Internal circlip DIN 472, Ø16; Bearing F688ZZ (8x16x5); head | – plain pin, nothing keyed | – clamped stack, no free axial play | – limited at the lever pivot and the rail ends | – driven, no rest position | – exact by construction | – sealed bearings | – single keyed phase | – protected at the drive |
| pC | J3 | – moving joint, no removable bearing plate | Internal circlip DIN 472, Ø13; Bearing F686ZZ (6x13x5); head | – plain pin, nothing keyed | – clamped stack, no free axial play | – limited at the lever pivot and the rail ends | – driven, no rest position | – exact by construction | – sealed bearings | – single keyed phase | – protected at the drive |
| slide-ram | J5 | – moving joint, no removable bearing plate | Keeper plate, holds the slider down | – plain pin, nothing keyed | – clamped stack, no free axial play | 2 x End stop block, hardened | – driven, no rest position | Gib strip 3 x 6 x 196, bronze | 2 x wiper; Grease nipple M6 (DIN 71412) | – single keyed phase | – protected at the drive |
| pO3-bridge-post | post | 2 x spigot | – n/a | – n/a | – n/a | – n/a | – n/a | – n/a | – n/a | – n/a | – n/a |
| raila-seat | post | 2 x Dowel pin Ø3 h6 (ISO 8734), rail to base | – n/a | – n/a | – n/a | – n/a | – n/a | – n/a | – n/a | – n/a | – n/a |
| railb-seat | post | 2 x Dowel pin Ø3 h6 (ISO 8734), rail to base | – n/a | – n/a | – n/a | – n/a | – n/a | – n/a | – n/a | – n/a | – n/a |
| drive | drive | – n/a | – n/a | – n/a | – n/a | – n/a | – n/a | bracket | – n/a | – n/a | Home flag, 1 mm steel vane; 3 x Fork sensor, slotted optical, 5 mm gap; Pulley flanges |

## Variants and overrides
| Joint or part | Rule result | Chosen | Why |
|---|---|---|---|

## Detail ladder
| Rung | Solids | Marks | Frame ms at this dial position |
|---|---|---|---|
| DL-A | 12 | 0 | 252.8 |
| DL-B | 0 | 295 | 207.5 |
| DL-C | 0 | 0 | 63.6 |
| DL-D | 27 | 0 | 59.0 |
| DL-E | 12 | 2 | 50.9 |
| DL-F | 0 | 0 | 46.2 |
| DL-G | 0 | 0 | 45.7 |
| DL-H | 26 | 0 | 38.7 |
| never | 146 | 147 | 38.7 (full 312.2) |

## Promotion candidates
None from the polish: it only writes notes. Observation for the rules: the lever slot gets one 80 mm wear strip, on one wall only.

## Verification
check: clean · clearance: 0 clashes · clamp: clean · edge distance: clean · package: 29.8 KB
screenshots: dist/s (plan, 28 deg, side, explode at 28 and 70 deg, both sheets) · bench: Node CPU canvas, plan 310.7, 28 deg 298.8, side 231.1, explode 70 deg 242.4 ms; setup 2.1 ms; package 29.8 KB; Node frames are not comparable with the browser targets (flag only)
