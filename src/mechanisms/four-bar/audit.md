# Audit: Four-bar linkage (four-bar)
standard: 2.0 · date: 2026-10-17 · result: open · detail: full · pass: build

## Summary
PASS 8 · FAIL 0 · N/A 0 · open: 113 unjudged

## Requirements
| Id | Status | Evidence / action |
|---|---|---|
| S1 | ? | DATA |
| S2 | ? | HAND |
| S3 | ? | AUTO |
| S4 | ? | SITE |
| P1 | PASS | DATA · record complete; model.ts, polish.ts, audit.md present |
| P2 | ? | DATA |
| P3 | ? | DATA / SITE |
| P4 | ? | DATA |
| P5 | ? | DATA |
| P6 | ? | DATA |
| P7 | ? | HAND / SITE |
| P8 | ? | SITE |
| P9 | ? | HAND |
| P10 | ? | HAND |
| P11 | ? | DATA |
| K1 | ? | HAND · check: max link error 4.3e-14 mm |
| K2 | PASS | HAND · check: finite, continuous, periodic over 720 samples |
| K3 | ? | HAND |
| K4 | ? | HAND |
| K5 | ? | HAND · check: no INTERFERE, OVERLAP or WARN |
| K6 | ? | DATA |
| K7 | ? | HAND · input rotary on crank |
| D1 | ? | HAND |
| D2 | ? | HAND |
| D3 | ? | STYLE |
| D4 | ? | AUTO · fired: base (1 solid), feet (4 solids) |
| D5 | ? | AUTO / HAND |
| D6 | ? | HAND / STYLE |
| D7 | ? | HAND |
| A1 | ? | AUTO · pO2 J2, pO4 J1, pA J3, pB J3; fired: classify (no solids) |
| A2 | ? | AUTO · pO2 J2, pO4 J1, pA J3, pB J3 |
| A3 | ? | AUTO · fired: classify (no solids) |
| A4 | ? | AUTO · fired: j1-dead-axle (25 solids) |
| A5 | ? | AUTO · fired: j2-live-shaft (27 solids) |
| A6 | ? | AUTO · fired: standoffs (no solids) |
| A7 | ? | AUTO · fired: base (1 solid), feet (4 solids) |
| A8 | ? | AUTO · fired: fasteners (stage 3) |
| A9 | ? | HAND |
| A10 | ? | HAND |
| A11 | ? | AUTO / HAND · fired: j1-dead-axle (25 solids) |
| A12 | PASS | AUTO · clamp check clean |
| A13 | ? | AUTO / HAND · 128 solids, 65 unnamed (further items of a listed set) |
| A14 | ? | HAND |
| A15 | PASS | AUTO · clearance: 0 clashes over the cycle |
| A16 | ? | HAND · 0 build rules; no note: none; no badge: none |
| A17 | ? | HAND |
| E1 | ? | AUTO · every solid has one explode level; levels -8 to 2.5 |
| E2 | ? | AUTO · 32 rigid groups; fired: explode |
| E3 | ? | AUTO · fired: explode |
| E4 | ? | HAND |
| E5 | ? | AUTO · fired: explode |
| E6 | ? | AUTO · fired: explode |
| E7 | ? | AUTO · fired: explode |
| E8 | ? | AUTO · fired: explode |
| E9 | ? | HAND |
| J1 | ? | AUTO · fired: j1-dead-axle (25 solids) |
| J2 | ? | AUTO · fired: j2-live-shaft (27 solids) |
| J3 | ? | AUTO · fired: j3-moving-pin (22 solids) |
| J4 | ? | AUTO · fired: j4-slot-roller (no solids) |
| J5 | ? | AUTO · fired: j5-slide (no solids) |
| J6 | ? | AUTO · fired: j6-mesh (no solids) |
| J7 | ? | AUTO · fired: j7-cam (no solids) |
| J8 | ? | AUTO · fired: j8-belt (2 solids) |
| F1 | ? | AUTO · served at pO2, pO4, pO4-bridge-post; fired: j2-live-shaft (27 solids) |
| F2 | ? | AUTO · served at pO2, pO4, pA, pB; fired: j2-live-shaft (27 solids) |
| F3 | ? | AUTO · served at pO2; fired: j2-live-shaft (27 solids) |
| F4 | ? | AUTO / HAND · served at pO2, pO4; fired: j2-live-shaft (27 solids) |
| F5 | ? | AUTO / HAND · served at pO4; fired: j5-slide (no solids), stops (6 solids) |
| F6 | ? | AUTO / HAND · served at no joint; fired: j7-cam (no solids) |
| F7 | ? | AUTO / HAND · served at drive; fired: j6-mesh (no solids), j5-slide (no solids) |
| F8 | ? | AUTO · served at pO4; fired: lubrication (no solids) |
| F9 | ? | AUTO / HAND · served at no joint; fired: timing-marks (no solids) |
| F10 | ? | AUTO / HAND · served at drive; fired: drive (37 solids) |
| M1 | ? | AUTO · fired: hardware primitives |
| M2 | ? | HAND |
| M3 | ? | AUTO · fired: j3-moving-pin (22 solids), hardware primitives |
| M4 | ? | AUTO / HAND · fired: base (1 solid), fasteners (stage 3) |
| M5 | ? | AUTO / HAND · fired: hardware primitives |
| M6 | PASS | AUTO · edge distance and walls clean |
| M7 | ? | HAND |
| M8 | ? | AUTO · fired: j1-dead-axle (25 solids) |
| M9 | ? | AUTO / HAND · fired: j1-dead-axle (25 solids) |
| M10 | ? | AUTO / HAND · 128 of 128 solids name a material |
| M11 | ? | AUTO · fired: j1-dead-axle (25 solids), hardware primitives |
| M12 | ? | HAND |
| M13 | ? | AUTO / HAND · 50 threaded, 0 without a locking method |
| M14 | ? | AUTO / HAND · fired: j4-slot-roller (no solids) |
| V1 | ? | AUTO · fired: drive (37 solids) |
| V2 | ? | AUTO · fired: drive (37 solids) |
| V3 | ? | AUTO / HAND · fired: drive (37 solids) |
| V4 | ? | AUTO · fired: j8-belt (2 solids) |
| V5 | ? | AUTO · fired: drive (37 solids) |
| V6 | ? | AUTO · fired: drive (37 solids) |
| L1 | ? | STYLE |
| L2 | ? | HAND |
| L3 | ? | HAND |
| L4 | ? | HAND / STYLE |
| L5 | ? | AUTO / HAND |
| L6 | ? | AUTO |
| L7 | ? | STYLE |
| L8 | ? | AUTO / HAND |
| R1 | ? | HAND |
| R2 | ? | HAND · threads M3, M4, M5, M6; joint Ø 6, 8, 10; bearings 6800-2RS (10x19x5), F688ZZ (8x16x5), F686 (6x13x5) |
| R3 | ? | AUTO · fired: hardware primitives |
| R4 | ? | AUTO · package 22.9 KB |
| R5 | ? | HAND |
| R6 | ? | FLAG |
| R7 | PASS | HAND · model.ts + polish.ts 2.5 KB |
| R8 | ? | AUTO / SITE |
| DL1 | ? | AUTO / HAND · 45 of 128 solids on a dropping rung |
| DL2 | ? | HAND · model detail full |
| DL3 | ? | AUTO |
| DL4 | ? | SITE |
| DL5 | ? | FLAG |
| Q1 | PASS | check, clamp and edge distance clean |
| Q2 | PASS | 0 clashes |
| Q3 | ? | package written, 22.9 KB; site build not checked here |
| Q4 | ? | local: tools/shot |
| Q5 | ? | local: tools/bench |
| Q6 | ? |  |
| Q7 | ? |  |

## Joints
| Joint | Type | F1 locate | F2 retain | F3 torque | F4 thrust | F5 limit | F6 hold | F7 adjust | F8 lube | F9 timing | F10 protect |
|---|---|---|---|---|---|---|---|---|---|---|---|
| pO2 | J2 | 2 x Dowel pin Ø3 x 10 h6, housing to base | 2 x Internal circlip DIN 472, Ø19; Countersunk M5 into the shaft end, flush; Socket head M5 x 10, into the shaft end | Feather key 3 x 3 x 6 (DIN 6885) | Wave washer 14.5x18.8, spring steel; Thrust washer 10.2x16, bronze | none | none | none | none | none | none |
| pO4 | J1 | 2 x spigot | Internal circlip DIN 472, Ø13; Bearing F686 (6x13x5) | none | Thrust washer 6.2x8.4, bronze | 2 x Stop bumper, neoprene sleeve Ø12 | none | none | Bridge over the pivot, on two spigoted posts | none | none |
| pA | J3 | none | Internal circlip DIN 472, Ø16; Bearing F688ZZ (8x16x5); head | none | none | none | none | none | none | none | none |
| pB | J3 | none | Internal circlip DIN 472, Ø16; Bearing F688ZZ (8x16x5); head | none | none | none | none | none | none | none | none |
| pO4-bridge-post | post | 2 x spigot | none | none | none | none | none | none | none | none | none |
| drive | drive | none | none | none | none | none | none | bracket | none | none | Home flag, 1 mm steel vane; 3 x Fork sensor, slotted optical, 5 mm gap; Pulley flanges |

## Variants and overrides
| Joint or part | Rule result | Chosen | Why |
|---|---|---|---|

## Detail ladder
| Rung | Solids | Marks | Frame ms at this dial position |
|---|---|---|---|
| DL-A | 12 | 0 | ? |
| DL-B | 0 | 196 | ? |
| DL-C | 0 | 0 | ? |
| DL-D | 17 | 0 | ? |
| DL-E | 8 | 2 | ? |
| DL-F | 0 | 0 | ? |
| DL-G | 0 | 0 | ? |
| DL-H | 8 | 0 | ? |
| never | 83 | 138 | ? |

## Promotion candidates
None yet.

## Verification
check: clean · clearance: 0 clashes · clamp: clean · edge distance: clean · package: 22.9 KB
screenshots: ? · bench: ?
