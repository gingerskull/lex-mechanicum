# Audit: Hart's inversor (hart-inversor)
standard: 2.6 · date: 2026-10-19 · result: pass · detail: full · pass: build

## Summary
PASS 110 · FAIL 0 · N/A 11 · open: none

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
| P9 | PASS | HAND |
| P10 | PASS | HAND |
| P11 | PASS | DATA |
| K1 | PASS | HAND · check: max link error 5.7e-14 mm · check: link error 5.7e-14 mm; p stays on x = 67.5 within 1e-13; the polish changes heights, hardware, a slot and marks only |
| K2 | PASS | HAND · check: finite, continuous, periodic over 720 samples |
| K3 | PASS | HAND |
| K4 | PASS | HAND |
| K5 | PASS | HAND · check: no INTERFERE, OVERLAP or WARN · layers 0 to 3, CD and CE plated 3.5 mm up in the model (dz), centres untouched |
| K6 | PASS | DATA · l 120, s 60, AB = Bg = 20, swing 80Â°, line x = 67.5 as the catalogue |
| K7 | PASS | HAND · input oscillating on crank |
| D1 | PASS | HAND |
| D2 | PASS | HAND · no lightening window: 120 mm bars are slender, 6 mm of web round every boss leaves no room (M5) |
| D3 | PASS | STYLE |
| D4 | PASS | AUTO · fired: base (1 solid), feet (4 solids) |
| D5 | PASS | AUTO / HAND · one bridge on two spigoted posts over A |
| D6 | PASS | HAND / STYLE |
| D7 | PASS | HAND |
| A1 | PASS | AUTO · pA J1, pB J2, pg J3, pE J3, pC J3, pF J3, pD J3; fired: classify (no solids) |
| A2 | PASS | AUTO · pA J1, pB J2, pg J3, pE J3, pC J3, pF J3, pD J3 |
| A3 | PASS | AUTO · fired: classify (no solids) |
| A4 | PASS | AUTO · fired: j1-dead-axle (27 solids) |
| A5 | N/A | AUTO · fired: j2-live-shaft (27 solids) · see joint table |
| A6 | PASS | AUTO · fired: standoffs (no solids) |
| A7 | PASS | AUTO · fired: base (1 solid), feet (4 solids) |
| A8 | PASS | AUTO · fired: fasteners (stage 3) |
| A9 | PASS | AUTO / HAND · fired: j2-straddle (no solids) · single shear forced at every moving pin and at A: EF, CD and CE sweep over the pins; A hung from a bridge, bearing next to it |
| A10 | PASS | HAND · crank and FD z 0 to 6, EF 10 to 16, CD 23.5 to 29.5, CE 33.5 to 39.5: the long bars cross, nothing stacked only to clear |
| A11 | PASS | AUTO / HAND · fired: j1-dead-axle (27 solids) · A: stud to bridge to posts to base; B: shaft to housing to base; bridge screwed and spigoted |
| A12 | PASS | AUTO · clamp check clean |
| A13 | PASS | AUTO / HAND · 162 solids, 81 unnamed (further items of a listed set) |
| A14 | PASS | HAND · posts, stops and leads clear every sweep; clearance 0 |
| A15 | PASS | AUTO · clearance: 0 clashes over the cycle |
| A16 | PASS | HAND · 5 build rules; no note: none; no badge: none · a note and a badge on every moving joint, five build rules |
| A17 | PASS | HAND · goes together from the base up: housing, shaft and lever, crank, FD, EF, CD, CE on the hung stud, bridge on its posts, nut; every screw reachable |
| E1 | PASS | AUTO · every solid has one explode level; levels -8 to 5 |
| E2 | PASS | AUTO · 37 rigid groups; fired: explode |
| E3 | PASS | AUTO · fired: explode |
| E4 | PASS | HAND |
| E5 | PASS | AUTO · fired: explode |
| E6 | PASS | AUTO · fired: explode |
| E7 | PASS | AUTO · fired: explode |
| E8 | PASS | AUTO · fired: explode |
| E9 | PASS | HAND |
| J1 | PASS | AUTO · fired: j1-dead-axle (27 solids) · A is the hung variant: stud, bearing in CE, circlip, sleeves, bridge on spigoted posts, nut; no thrust washer or base axle |
| J2 | PASS | AUTO · fired: j2-live-shaft (27 solids), j2-straddle (no solids) · B: housing, shaft, key, lever, circlip above the lever (variant, rule bug) |
| J3 | PASS | AUTO · fired: j3-moving-pin (60 solids) · g, E, C, F, D: shoulder bolts threaded into the lowest link, bearings in the others |
| J4 | N/A | AUTO · fired: j4-slot-roller (no solids) · no pin in a slot |
| J5 | N/A | AUTO · fired: j5-slide (no solids) · no slide |
| J6 | N/A | AUTO · fired: j6-mesh (no solids) · no gear mesh |
| J7 | N/A | AUTO · fired: j7-cam (no solids) · no cam |
| J8 | N/A | AUTO · fired: j8-belt (no solids) · oscillating input: crank and link, no belt (V5) |
| F1 | PASS | AUTO · served at pA, pB, pA-bridge-post; fired: j2-live-shaft (27 solids) |
| F2 | PASS | AUTO · served at pA, pB, pg, pE, pC, pF, pD; fired: j2-live-shaft (27 solids) · every bearing held by circlips or flange and circlip; the A stud's stack by the external circlip below and the sleeve to the bridge |
| F3 | PASS | AUTO · served at pB; fired: j2-live-shaft (27 solids) |
| F4 | PASS | AUTO / HAND · served at pB; fired: j2-live-shaft (27 solids) |
| F5 | PASS | AUTO / HAND · served at pA; fired: j5-slide (no solids), stops (6 solids) · stops for CE by the rule and H.stops for the input crank, 2Â° beyond both ends |
| F6 | N/A | AUTO / HAND · served at no joint; fired: j7-cam (no solids) · driven through a crank and link, no rest position |
| F7 | PASS | AUTO / HAND · served at pA; fired: j6-mesh (no solids), j5-slide (no solids) · the stud at A in a 3 mm slot along AB, clamped by the nut (Appendix A, a ground pivot carries the exact dimension) |
| F8 | N/A | AUTO · served at no joint; fired: lubrication (no solids) · every bearing shielded or sealed, no open bearing or sliding contact |
| F9 | PASS | AUTO / HAND · served at pB; fired: timing-marks (no solids) · swing scale of the crank engraved on the base with an index line on the crank |
| F10 | PASS | AUTO / HAND · served at drive; fired: drive (33 solids) · home flag and fork sensor on the drive crank; no slip clutch, as the other oscillating inputs |
| M1 | PASS | AUTO · fired: hardware primitives |
| M2 | PASS | HAND · bosses round every pin; no window (see D2) |
| M3 | PASS | AUTO · fired: j3-moving-pin (60 solids), hardware primitives |
| M4 | PASS | AUTO / HAND · fired: base (1 solid), fasteners (stage 3) |
| M5 | N/A | AUTO / HAND · fired: hardware primitives · no pocket or window; bosses full radius |
| M6 | PASS | AUTO · edge distance and walls clean |
| M7 | PASS | HAND |
| M8 | PASS | AUTO · fired: j1-dead-axle (27 solids) |
| M9 | PASS | AUTO / HAND · fired: j1-dead-axle (27 solids) |
| M10 | PASS | AUTO / HAND · 162 of 162 solids name a material |
| M11 | PASS | AUTO · fired: j1-dead-axle (27 solids), hardware primitives |
| M12 | PASS | HAND |
| M13 | PASS | AUTO / HAND · 60 threaded, 0 without a locking method |
| M14 | N/A | AUTO / HAND · fired: j4-slot-roller (no solids) · no sliding contact |
| V1 | PASS | AUTO · fired: drive (33 solids) |
| V2 | PASS | AUTO · fired: drive (33 solids) |
| V3 | PASS | AUTO / HAND · fired: drive (33 solids) |
| V4 | N/A | AUTO · fired: j8-belt (no solids) · no belt, oscillating drive |
| V5 | PASS | AUTO · fired: drive (33 solids) |
| V6 | PASS | AUTO · fired: drive (33 solids) |
| L1 | PASS | STYLE |
| L2 | PASS | HAND |
| L3 | PASS | HAND |
| L4 | PASS | HAND / STYLE |
| L5 | PASS | AUTO / HAND · fired: see-through |
| L6 | PASS | AUTO |
| L7 | PASS | STYLE |
| L8 | PASS | AUTO / HAND |
| R1 | PASS | HAND · the polish reuses H.stops, H.circlip, the bridge from the rule; inline: the lever widened and a slot in the bridge |
| R2 | PASS | HAND · threads M3, M4, M5, M6; joint Ø 8, 10; bearings 6800-2RS (10x19x5), F688ZZ (8x16x5) |
| R3 | PASS | AUTO · fired: hardware primitives |
| R4 | PASS | AUTO · package 22.0 KB |
| R5 | PASS | HAND |
| R6 | PASS | FLAG · plan 2.13, 28° 2.42, side 2.25, explode 2.3 ms at full detail, under the 8 ms desktop target |
| R7 | PASS | HAND · model.ts + polish.ts 11.2 KB |
| R8 | PASS | AUTO / SITE |
| DL1 | PASS | AUTO / HAND · 63 of 162 solids on a dropping rung |
| DL2 | PASS | HAND · model detail full |
| DL3 | PASS | AUTO |
| DL4 | PASS | SITE |
| DL5 | PASS | FLAG · rung counts and frame times in the detail ladder below |
| Q1 | PASS | check, clamp and edge distance clean |
| Q2 | PASS | 0 clashes |
| Q3 | PASS | package written, 22.0 KB; site build not checked here |
| Q4 | PASS | local: tools/shot · plan and 28Â° looked at locally in the dark sheet |
| Q5 | PASS | browser bench run; no flag |
| Q6 | PASS | · every row judged |
| Q7 | PASS | · conformance run at the end |

## Joints
| Joint | Type | F1 locate | F2 retain | F3 torque | F4 thrust | F5 limit | F6 hold | F7 adjust | F8 lube | F9 timing | F10 protect |
|---|---|---|---|---|---|---|---|---|---|---|---|
| pA | J1 | 2 x spigot | Internal circlip DIN 472, Ø16; Bearing F688ZZ (8x16x5); External circlip DIN 471, Ø8 | â€“ no keyed part | â€“ bearing located by flange and circlip, inner race clamped | 2 x Stop bumper, neoprene sleeve Ø12 | â€“ driven, no rest position | Bridge over the pivot, on two spigoted posts | â€“ shielded bearing, greased for life | â€“ marks on the crank swing at B | â€“ no overload path: the crank's dead centres bound the load |
| pB | J2 | 2 x Dowel pin Ø3 x 10 h6, housing to base | 2 x Internal circlip DIN 472, Ø19; Countersunk M5 x 12 (ISO 10642), into the shaft end, flush; External circlip DIN 471, Ø10 | Feather key 3 x 3 x 6 (DIN 6885) | Wave washer 14.5x18.8, spring steel; Thrust washer 10.2x16, bronze | â€“ limited by the linkage | â€“ driven, no rest position | â€“ the exact length AB is set at A | â€“ shielded bearing, greased for life | Base plate; Crank (input) | â€“ no overload path: the crank's dead centres bound the load |
| pg | J3 | â€“ no removable plate on a moving pin | Internal circlip DIN 472, Ø16; Bearing F688ZZ (8x16x5); head | â€“ no keyed part | â€“ bearing located by flange and circlip, inner race clamped | â€“ limited by the linkage | â€“ driven, no rest position | â€“ the exact length AB is set at A | â€“ shielded bearing, greased for life | â€“ marks on the crank swing at B | â€“ no overload path: the crank's dead centres bound the load |
| pE | J3 | â€“ no removable plate on a moving pin | Internal circlip DIN 472, Ø16; Bearing F688ZZ (8x16x5); head | â€“ no keyed part | â€“ bearing located by flange and circlip, inner race clamped | â€“ limited by the linkage | â€“ driven, no rest position | â€“ the exact length AB is set at A | â€“ shielded bearing, greased for life | â€“ marks on the crank swing at B | â€“ no overload path: the crank's dead centres bound the load |
| pC | J3 | â€“ no removable plate on a moving pin | Internal circlip DIN 472, Ø16; Bearing F688ZZ (8x16x5); head | â€“ no keyed part | â€“ bearing located by flange and circlip, inner race clamped | â€“ limited by the linkage | â€“ driven, no rest position | â€“ the exact length AB is set at A | â€“ shielded bearing, greased for life | â€“ marks on the crank swing at B | â€“ no overload path: the crank's dead centres bound the load |
| pF | J3 | â€“ no removable plate on a moving pin | Internal circlip DIN 472, Ø16; Bearing F688ZZ (8x16x5); head | â€“ no keyed part | â€“ bearing located by flange and circlip, inner race clamped | â€“ limited by the linkage | â€“ driven, no rest position | â€“ the exact length AB is set at A | â€“ shielded bearing, greased for life | â€“ marks on the crank swing at B | â€“ no overload path: the crank's dead centres bound the load |
| pD | J3 | â€“ no removable plate on a moving pin | Internal circlip DIN 472, Ø16; Bearing F688ZZ (8x16x5); head | â€“ no keyed part | â€“ bearing located by flange and circlip, inner race clamped | â€“ limited by the linkage | â€“ driven, no rest position | â€“ the exact length AB is set at A | â€“ shielded bearing, greased for life | â€“ marks on the crank swing at B | â€“ no overload path: the crank's dead centres bound the load |
| pA-bridge-post | post | 2 x spigot | – n/a | â€“ no keyed part | â€“ bearing located by flange and circlip, inner race clamped | â€“ limited by the linkage | â€“ driven, no rest position | â€“ the exact length AB is set at A | â€“ shielded bearing, greased for life | â€“ marks on the crank swing at B | â€“ no overload path: the crank's dead centres bound the load |
| drive | drive | â€“ no removable plate on a moving pin | – n/a | â€“ no keyed part | â€“ bearing located by flange and circlip, inner race clamped | â€“ limited by the linkage | â€“ driven, no rest position | â€“ the exact length AB is set at A | â€“ shielded bearing, greased for life | â€“ marks on the crank swing at B | Home flag on the drive crank; 3 x Fork sensor, slotted optical, 5 mm gap |

## Variants and overrides
| Joint or part | Rule result | Chosen | Why |
|---|---|---|---|
| pA, ground pivot | dead axle from the base, bridge over the top | hung stud from a bridge into CE only (J1, hung rule) | EF and CD sweep over A: nothing may rise from the base below CE |
| CD, CE | layer 2 and 3, z 20 and 30 | plated 3.5 mm up in the model (dz) | the Ã˜13 heads over EF at F and g stand to z 23.2: clear of CD by 0.3 mm |
| pA, stud hole in the bridge | round clearance hole | 3 mm slot along AB, clamped by the nut | F7: AB = Bg sets the line x = 2700 / (2 AB); drawn at the set point |
| pB end retainer | washer and socket screw under the shaft end | dropped; external circlip above the drive lever | the drive link passes under the shaft end and fouls the retainer (rule bug, see below) |
| drive lever | stadium radius 6 round the Ã˜10 bore | radius 7 | wall under 1.5 mm (M6) |
| crank stops | none (the rule skips the input) | H.stops, 2Â° beyond both ends | F5: a drive off over-travels |

## Detail ladder
| Rung | Solids | Marks | Frame ms at this dial position |
|---|---|---|---|
| DL-A | 18 | 0 | 2.13 |
| DL-B | 0 | 240 | 1.75 |
| DL-C | 0 | 0 | 1.7 |
| DL-D | 28 | 0 | 1.47 |
| DL-E | 8 | 0 | 1.4 |
| DL-F | 0 | 0 | 1.4 |
| DL-G | 0 | 0 | 1.25 |
| DL-H | 9 | 0 | 1.2 |
| never | 99 | 211 | 2.31 (full) |

## Promotion candidates
Hand fixes that should become rules or primitives.

- Rule bug, oscillating drive (`H.drive`, V5): the motor is on the far side of the input shaft from the lever, so the link passes under the shaft end and fouls the end retainer (A15). Worked round with a circlip above the lever, as at Chebyshev and Peaucellier. The lever's wall round the Ã˜10 bore is under 1.5 mm (M6) as there.
- Hung pivot is now a rule (`src/rules/hung.ts`, J1); an adjustable (slotted) bridge hole for a hung pivot that carries an exact ground length is a hand slot here and could become a `H.bridge` option.
- `H.stops` for an oscillating input is still by hand (the rule skips the input).

## Verification
check: clean · clearance: 0 clashes · clamp: clean · edge distance: clean · package: 22.0 KB
screenshots: plan and 28°, dark and light, looked at locally (not attached) · bench: browser, 2026-10-19, RTX 5090, plan 2.13, 28° 2.42, side 2.25, explode 2.3 ms at full detail, setup 12 ms, package 22 KB; under the 8 ms target
