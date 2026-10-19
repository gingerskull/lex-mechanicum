# Audit: Drag-link quick-return (drag-link-quick-return)
standard: 2.6 · date: 2026-10-19 · result: pass · detail: full · pass: build

## Summary
PASS 113 · FAIL 0 · N/A 8 · open: none

## Requirements
| Id | Status | Evidence / action |
|---|---|---|
| S1 | PASS | DATA |
| S2 | PASS | HAND |
| S3 | PASS | AUTO |
| S4 | PASS | SITE |
| P1 | PASS | DATA · record complete; model.ts, polish.ts, audit.md present |
| P2 | PASS | DATA |
| P3 | PASS | DATA / SITE |
| P4 | PASS | DATA |
| P5 | PASS | DATA |
| P6 | PASS | DATA |
| P7 | PASS | HAND / SITE |
| P8 | PASS | SITE |
| P9 | PASS | HAND · solve(): stroke 100 mm, 216.5° and 143.5°, 1.51:1, as explain and range |
| P10 | PASS | HAND · ram and arm pin traced, velocities at the ram and B, rod force, transmission angle with its warning, plot of ram position |
| P11 | PASS | DATA |
| K1 | PASS | HAND · check: max link error 5.7e-14 mm · check: link error 5.7e-14 mm; the polish changes hardware and holes only |
| K2 | PASS | HAND · check: finite, continuous, periodic over 720 samples |
| K3 | PASS | HAND |
| K4 | PASS | HAND |
| K5 | PASS | HAND · check: no INTERFERE, OVERLAP or WARN · layers 0 to 6; the ram arm plated 1.5 mm up (dz) so the bridge fits under it; centres untouched |
| K6 | PASS | DATA · d 25, a 60, b 70, c 60, r 50, L 180 as the catalogue; the ram arm in line with the follower on the far side of O4 (catalogue: beside B), stated in model.ts: stroke 100, slow 216.5°, fast 143.5°, 1.51:1 unchanged, extremes at input 54.5° and 271° (the catalogue's 305.5° and 89° mirrored by the branch) |
| K7 | PASS | HAND · input rotary on crank |
| D1 | PASS | HAND |
| D2 | PASS | HAND · no windows: the links are short and slender |
| D3 | PASS | STYLE |
| D4 | PASS | AUTO · fired: base (1 solid), feet (4 solids) |
| D5 | PASS | AUTO / HAND · one bridge between the plates on two spigoted posts |
| D6 | PASS | HAND / STYLE |
| D7 | PASS | HAND |
| A1 | PASS | AUTO · pO2 J2, pO4 J1, pA J3, pB J3, pD J3, pE J3, slide-ram J5; fired: classify (no solids) |
| A2 | PASS | AUTO · pO2 J2, pO4 J1, pA J3, pB J3, pD J3, pE J3, slide-ram J5 |
| A3 | PASS | AUTO · fired: classify (no solids) |
| A4 | PASS | AUTO · fired: j1-dead-axle (33 solids) |
| A5 | PASS | AUTO · fired: j2-live-shaft (27 solids) |
| A6 | PASS | AUTO · fired: standoffs (16 solids) |
| A7 | PASS | AUTO · fired: base (1 solid), feet (4 solids) |
| A8 | PASS | AUTO · fired: fasteners (stage 3) |
| A9 | PASS | AUTO / HAND · fired: j2-straddle (no solids) · double shear at the ram (cap clevis); A, B and D single shear, forced: the follower, the rod and the coupler sweep over them; O4 carried in the bridge between its two plates |
| A10 | PASS | HAND · crank 0, coupler 1, follower 2, bridge, ram arm 4, rod 5, ram cap 6: the rod passes over every pin and O4 is circled by the crank, coupler and rod, so the output crank is split round the bridge |
| A11 | PASS | AUTO / HAND · fired: j1-dead-axle (33 solids) · O2: shaft to housing to base; O4: shaft to bearing to bridge to spigoted posts to base; pins to bearings to links |
| A12 | PASS | AUTO · clamp check clean |
| A13 | PASS | AUTO / HAND · 184 solids, 93 unnamed (further items of a listed set) |
| A14 | PASS | HAND · posts and stops clear every sweep; clearance 0 |
| A15 | PASS | AUTO · clearance: 0 clashes over the cycle |
| A16 | PASS | HAND · 5 build rules; no note: none; no badge: none · a note and a badge on every moving joint, five build rules |
| A17 | PASS | HAND · goes together from the base up: housing and input shaft, crank, coupler, follower on the shaft, bridge and posts, ram arm on the shaft, circlips, rod, ram and cap; every screw reachable |
| E1 | PASS | AUTO · every solid has one explode level; levels -8 to 6.5 |
| E2 | PASS | AUTO · 42 rigid groups; fired: explode |
| E3 | PASS | AUTO · fired: explode |
| E4 | PASS | HAND |
| E5 | PASS | AUTO · fired: explode |
| E6 | PASS | AUTO · fired: explode |
| E7 | PASS | AUTO · fired: explode |
| E8 | PASS | AUTO · fired: explode |
| E9 | PASS | HAND |
| J1 | PASS | AUTO · fired: j1-dead-axle (33 solids) · O4: built by hand as a shaft turning in a bridge bearing between the two plates (the rule's hung pivot would pass through the rod's plane) |
| J2 | PASS | AUTO · fired: j2-live-shaft (27 solids), j2-straddle (no solids) · O2: housing, keyed shaft, drive |
| J3 | PASS | AUTO · fired: j3-moving-pin (49 solids) · A, B, D, E shoulder bolts; the ram and its cap a clevis at E |
| J4 | N/A | AUTO · fired: j4-slot-roller (no solids) · no pin in a slot |
| J5 | PASS | AUTO · fired: j5-slide (13 solids) · ram slide: reference rail, gib under keeper, wipers, nipple, end stops |
| J6 | N/A | AUTO · fired: j6-mesh (no solids) · no gear mesh |
| J7 | N/A | AUTO · fired: j7-cam (no solids) · no cam |
| J8 | N/A | AUTO · fired: j8-belt (2 solids) · no belt besides the drive's (V4) |
| F1 | PASS | AUTO · served at pO2, pO4, railb-seat, pO4-bridge-post; fired: j2-live-shaft (27 solids) |
| F2 | PASS | AUTO · served at pO2, pO4, pA, pB, pD, pE, slide-ram; fired: j2-live-shaft (27 solids) · every bearing held by circlips or flange and circlip; the output shaft by circlips outside both plates |
| F3 | PASS | AUTO · served at pO2, pO4; fired: j2-live-shaft (27 solids) · keyed input shaft; the output shaft's D-flat in both plates |
| F4 | PASS | AUTO / HAND · served at pO2, pO4; fired: j2-live-shaft (27 solids) · bronze thrust washer at the input; the output shaft's stack clamped through inner-race sleeves |
| F5 | PASS | AUTO / HAND · served at slide-ram; fired: j5-slide (13 solids), stops (no solids) · slide end stops by the rule; the cranks turn fully |
| F6 | N/A | AUTO / HAND · served at no joint; fired: j7-cam (no solids) · driven, no rest position |
| F7 | N/A | AUTO / HAND · served at slide-ram, drive; fired: j6-mesh (no solids), j5-slide (13 solids) · no exact length ratio: a quick-return's timing follows the fixed lengths (Appendix A asks F7 of straight-line linkages) |
| F8 | PASS | AUTO · served at slide-ram; fired: lubrication (no solids) · shielded and sealed bearings; grease nipple and wipers on the slide |
| F9 | PASS | AUTO / HAND · served at pO4; fired: timing-marks (no solids) · match marks for the arm's 180° on the follower and the arm |
| F10 | PASS | AUTO / HAND · served at drive; fired: drive (37 solids) · home flag and fork sensor on the input; no slip clutch |
| M1 | PASS | AUTO · fired: hardware primitives |
| M2 | PASS | HAND · counterweighted input crank |
| M3 | PASS | AUTO · fired: j3-moving-pin (49 solids), hardware primitives |
| M4 | PASS | AUTO / HAND · fired: base (1 solid), fasteners (stage 3) |
| M5 | N/A | AUTO / HAND · fired: hardware primitives · no pocket or window |
| M6 | PASS | AUTO · edge distance and walls clean |
| M7 | PASS | HAND |
| M8 | PASS | AUTO · fired: j1-dead-axle (33 solids) |
| M9 | PASS | AUTO / HAND · fired: j1-dead-axle (33 solids) |
| M10 | PASS | AUTO / HAND · 184 of 184 solids name a material |
| M11 | PASS | AUTO · fired: j1-dead-axle (33 solids), hardware primitives |
| M12 | PASS | HAND |
| M13 | PASS | AUTO / HAND · 66 threaded, 0 without a locking method |
| M14 | N/A | AUTO / HAND · fired: j4-slot-roller (no solids) · the slide's rails and gib are the wear parts (J5, AUTO); no other sliding contact |
| V1 | PASS | AUTO · fired: drive (37 solids) |
| V2 | PASS | AUTO · fired: drive (37 solids) |
| V3 | PASS | AUTO / HAND · fired: drive (37 solids) |
| V4 | PASS | AUTO · fired: j8-belt (2 solids) |
| V5 | PASS | AUTO · fired: drive (37 solids) |
| V6 | PASS | AUTO · fired: drive (37 solids) |
| L1 | PASS | STYLE |
| L2 | PASS | HAND |
| L3 | PASS | HAND |
| L4 | PASS | HAND / STYLE |
| L5 | PASS | AUTO / HAND · fired: see-through |
| L6 | PASS | AUTO |
| L7 | PASS | STYLE |
| L8 | PASS | AUTO / HAND |
| R1 | PASS | HAND · reuses H.bridge, H.bearing, H.shaft, H.tube, H.circlip; nothing drawn inline but the keyed bores |
| R2 | PASS | HAND · threads M3, M4, M5, M6; joint Ø 6, 8, 10; bearings 6800-2RS (10x19x5), F688ZZ (8x16x5), F696ZZ (6x15x5), F686ZZ (6x13x5), 688ZZ (8x16x5) |
| R3 | PASS | AUTO · fired: hardware primitives |
| R4 | PASS | AUTO · package 29.1 KB |
| R5 | PASS | HAND |
| R6 | PASS | FLAG · plan 2.45, 28° 3.05, side 2.18, explode 2.77 ms at full detail, under the 8 ms desktop target |
| R7 | PASS | HAND · model.ts + polish.ts 11.1 KB |
| R8 | PASS | AUTO / SITE |
| DL1 | PASS | AUTO / HAND · 69 of 184 solids on a dropping rung |
| DL2 | PASS | HAND · model detail full |
| DL3 | PASS | AUTO |
| DL4 | PASS | SITE |
| DL5 | PASS | FLAG · rung counts and frame times in the detail ladder below |
| Q1 | PASS | check, clamp and edge distance clean |
| Q2 | PASS | 0 clashes |
| Q3 | PASS | package written, 29.1 KB; site build not checked here |
| Q4 | PASS | local: tools/shot · 28° and the explode at 70° looked at locally in both sheets |
| Q5 | PASS | browser bench run; no flag |
| Q6 | PASS | · every row judged |
| Q7 | PASS | · conformance run at the end |

## Joints
| Joint | Type | F1 locate | F2 retain | F3 torque | F4 thrust | F5 limit | F6 hold | F7 adjust | F8 lube | F9 timing | F10 protect |
|---|---|---|---|---|---|---|---|---|---|---|---|
| pO2 | J2 | 2 x Dowel pin Ø3 x 10 h6, housing to base | 2 x Internal circlip DIN 472, Ø19; Countersunk M5 x 12 (ISO 10642), into the shaft end, flush; Socket head M5 x 10 (ISO 4762), into the shaft end | Feather key 3 x 3 x 6 (DIN 6885) | Wave washer 14.5x18.8, spring steel; Thrust washer 10.2x16, bronze | – limited by the linkage | – driven, no rest position | – no exact ratio to set: the quick-return timing follows the fixed lengths | – shielded bearings, greased for life | – phase held by the linkage; the arm is marked on the follower at O4 | – no overload path beyond the input's drive |
| pO4 | J1 | 2 x spigot | Internal circlip DIN 472, Ø16; 2 x External circlip DIN 471, Ø8 | Output shaft Ø8 h6, D-flat, circlip grooves | 2 x Inner-race spacer sleeve 8.2x10.8 | – limited by the linkage | – driven, no rest position | – no exact ratio to set: the quick-return timing follows the fixed lengths | – shielded bearings, greased for life | Output crank; Ram arm | – no overload path beyond the input's drive |
| pA | J3 | – no removable plate on a moving pin | Internal circlip DIN 472, Ø16; Bearing F688ZZ (8x16x5); head | – no keyed part | – bearings located by flange and circlip, inner races clamped | – limited by the linkage | – driven, no rest position | – no exact ratio to set: the quick-return timing follows the fixed lengths | – shielded bearings, greased for life | – phase held by the linkage; the arm is marked on the follower at O4 | – no overload path beyond the input's drive |
| pB | J3 | – no removable plate on a moving pin | Internal circlip DIN 472, Ø16; Bearing F688ZZ (8x16x5); head | – no keyed part | – bearings located by flange and circlip, inner races clamped | – limited by the linkage | – driven, no rest position | – no exact ratio to set: the quick-return timing follows the fixed lengths | – shielded bearings, greased for life | – phase held by the linkage; the arm is marked on the follower at O4 | – no overload path beyond the input's drive |
| pD | J3 | – no removable plate on a moving pin | Internal circlip DIN 472, Ø15; Bearing F696ZZ (6x15x5); head | – no keyed part | – bearings located by flange and circlip, inner races clamped | – limited by the linkage | – driven, no rest position | – no exact ratio to set: the quick-return timing follows the fixed lengths | – shielded bearings, greased for life | – phase held by the linkage; the arm is marked on the follower at O4 | – no overload path beyond the input's drive |
| pE | J3 | – no removable plate on a moving pin | Internal circlip DIN 472, Ø13; Bearing F686ZZ (6x13x5); head | – no keyed part | – bearings located by flange and circlip, inner races clamped | – limited by the linkage | – driven, no rest position | – no exact ratio to set: the quick-return timing follows the fixed lengths | – shielded bearings, greased for life | – phase held by the linkage; the arm is marked on the follower at O4 | – no overload path beyond the input's drive |
| slide-ram | J5 | – no removable plate on a moving pin | Keeper plate, holds the slider down | – no keyed part | – bearings located by flange and circlip, inner races clamped | 2 x End stop block, hardened | – driven, no rest position | Gib strip 175 x 7 x 2.3, bronze, slotted, clamped under the keeper | 2 x wiper; Grease nipple M6 (DIN 71412) | – phase held by the linkage; the arm is marked on the follower at O4 | – no overload path beyond the input's drive |
| raila-seat | post | – no removable plate on a moving pin | – n/a | – no keyed part | – bearings located by flange and circlip, inner races clamped | – limited by the linkage | – driven, no rest position | – no exact ratio to set: the quick-return timing follows the fixed lengths | – shielded bearings, greased for life | – phase held by the linkage; the arm is marked on the follower at O4 | – no overload path beyond the input's drive |
| railb-seat | post | 2 x Dowel pin Ø3 h6 (ISO 8734), rail to base | – n/a | – no keyed part | – bearings located by flange and circlip, inner races clamped | – limited by the linkage | – driven, no rest position | – no exact ratio to set: the quick-return timing follows the fixed lengths | – shielded bearings, greased for life | – phase held by the linkage; the arm is marked on the follower at O4 | – no overload path beyond the input's drive |
| drive | drive | – no removable plate on a moving pin | – n/a | – no keyed part | – bearings located by flange and circlip, inner races clamped | – limited by the linkage | – driven, no rest position | bracket | – shielded bearings, greased for life | – phase held by the linkage; the arm is marked on the follower at O4 | Home flag, 1 mm steel vane; 3 x Fork sensor, slotted optical, 5 mm gap; Pulley flanges |
| pO4-bridge-post | post | 2 x spigot | – n/a | – no keyed part | – bearings located by flange and circlip, inner races clamped | – limited by the linkage | – driven, no rest position | – no exact ratio to set: the quick-return timing follows the fixed lengths | – shielded bearings, greased for life | – phase held by the linkage; the arm is marked on the follower at O4 | – no overload path beyond the input's drive |

## Variants and overrides
| Joint or part | Rule result | Chosen | Why |
|---|---|---|---|
| pO4 | hung stud from a bridge over everything (J1, hung) | output shaft keyed in the follower and the ram arm, in a bearing in a bridge between them | the rod, crank and coupler all turn round O4: nothing may cross O4 above or below the output plates |
| output crank | one plate O4 to B with D on it | two plates on one shaft: follower below the bridge, ram arm above | the bridge must sit between them |
| ram arm | D beside B, 10 mm apart | in line on the far side of O4 | two rigid plates at different layers would each hold the other's pin (K5); timing unchanged |
| ram arm | layer 4 | plated 1.5 mm up (dz) | the bridge fits between the B bolt's head and the arm |

## Detail ladder
| Rung | Solids | Marks | Frame ms at this dial position |
|---|---|---|---|
| DL-A | 16 | 0 | 2.77 |
| DL-B | 0 | 242 | 1.92 |
| DL-C | 0 | 0 | 1.86 |
| DL-D | 27 | 0 | 1.66 |
| DL-E | 11 | 0 | 1.6 |
| DL-F | 0 | 0 | 1.72 |
| DL-G | 0 | 0 | 1.43 |
| DL-H | 15 | 0 | 1.4 |
| never | 115 | 215 | 3.16 (full) |

## Promotion candidates
Hand fixes that should become rules or primitives.

- A live shaft carried in a bridge between two keyed plates (a split crank) is built by hand here; a J1 variant (hung pivot with keyed parts on both sides of its bridge) would make it a rule if another mechanism needs it.

## Verification
check: clean · clearance: 0 clashes · clamp: clean · edge distance: clean · package: 29.1 KB
screenshots: plan and 28°, dark and light, looked at locally (not attached) · bench: browser, 2026-10-19, RTX 5090, plan 2.45, 28° 3.05, side 2.18, explode 2.77 ms at full detail, setup 11.7 ms, package 29.1 KB; under the 8 ms target
