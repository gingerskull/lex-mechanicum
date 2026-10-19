# Audit: Rhombic drive (rhombic-drive)
standard: 2.6 · date: 2026-10-19 · result: pass · detail: full · pass: build

## Summary
PASS 114 · FAIL 0 · N/A 7 · open: none

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
| K1 | PASS | HAND · check: max link error 2.1e-14 mm · check: link error 2.1e-14 mm; the polish adds notes only |
| K2 | PASS | HAND · check: finite, continuous, periodic over 720 samples |
| K3 | PASS | HAND |
| K4 | PASS | HAND |
| K5 | PASS | HAND · check: no INTERFERE, OVERLAP or WARN · layers 0, 1, 2 and 4; rods plated 4 mm up (dz) in the model, centres untouched |
| K6 | PASS | DATA · e 30, r 20, L 60, z 30 module 2, as the catalogue; piston 26.5 to 74.2, displacer -74.2 to -26.5, yokes at least 66 apart |
| K7 | PASS | HAND · input rotary on gear1 |
| D1 | PASS | HAND |
| D2 | N/A | HAND · see text |
| D3 | PASS | STYLE |
| D4 | PASS | AUTO · fired: base (1 solid), feet (4 solids) |
| D5 | PASS | AUTO / HAND · housing pairs and rail pads; no scattered standoffs |
| D6 | PASS | HAND / STYLE |
| D7 | PASS | HAND |
| A1 | PASS | AUTO · pG1 J2, pG2 J2, pPL J3, pPR J3, pT J3, pBt J3, slide-piston J5, slide-displacer J5, mesh-gear1-gear2 J6; fired: classify (no solids) |
| A2 | PASS | AUTO · pG1 J2, pG2 J2, pPL J3, pPR J3, pT J3, pBt J3, slide-piston J5, slide-displacer J5, mesh-gear1-gear2 J6 |
| A3 | PASS | AUTO · fired: classify (no solids) |
| A4 | PASS | AUTO · fired: j1-dead-axle (no solids) |
| A5 | PASS | AUTO · fired: j2-live-shaft (56 solids) |
| A6 | PASS | AUTO · fired: standoffs (24 solids) |
| A7 | PASS | AUTO · fired: base (1 solid), feet (4 solids) |
| A8 | PASS | AUTO · fired: fasteners (stage 3) |
| A9 | PASS | AUTO / HAND · fired: j2-straddle (no solids) · single shear forced: the rods sweep over the gears and over each other, no clevis fits; each pin carries bearings in every rod, spaced on inner races |
| A10 | PASS | HAND · gears z 0 to 7, rods 14 to 20 and 24 to 30, yokes 40 to 46: the rods on one layer are always apart; nothing stacked only to clear |
| A11 | PASS | AUTO / HAND · fired: j1-dead-axle (no solids) · pins to bearings to rods; shafts to housings to base; rails dowelled and screwed to the base |
| A12 | PASS | AUTO · clamp check clean |
| A13 | PASS | AUTO / HAND · 230 solids, 105 unnamed (further items of a listed set) |
| A14 | PASS | HAND · rails on pads clear of every sweep; clearance 0 |
| A15 | PASS | AUTO · clearance: 0 clashes over the cycle |
| A16 | PASS | HAND · 5 build rules; no note: none; no badge: none · a note and a badge on every moving joint, five build rules |
| A17 | PASS | HAND · goes together from the base up: housings and shafts, gears, crank pins, rods, yokes on their pins, rails and keepers; every screw reachable |
| E1 | PASS | AUTO · every solid has one explode level; levels -8 to 4.5 |
| E2 | PASS | AUTO · 47 rigid groups; fired: explode |
| E3 | PASS | AUTO · fired: explode |
| E4 | PASS | HAND |
| E5 | PASS | AUTO · fired: explode |
| E6 | PASS | AUTO · fired: explode |
| E7 | PASS | AUTO · fired: explode |
| E8 | PASS | AUTO · fired: explode |
| E9 | PASS | HAND |
| J1 | PASS | AUTO · fired: j1-dead-axle (no solids) · no dead axle: both gears are keyed on live shafts (J2) |
| J2 | PASS | AUTO · fired: j2-live-shaft (56 solids), j2-straddle (no solids) |
| J3 | PASS | AUTO · fired: j3-moving-pin (72 solids) |
| J4 | N/A | AUTO · fired: j4-slot-roller (no solids) · no pin in a slot |
| J5 | PASS | AUTO · fired: j5-slide (18 solids) · piston and displacer slides: dowelled reference rail, gib under the keeper, wipers, nipple, end stops |
| J6 | PASS | AUTO · fired: j6-mesh (4 solids) · gear mesh: hubs with set screws, eccentric, marks, thrust washers and circlips |
| J7 | N/A | AUTO · fired: j7-cam (no solids) · no cam |
| J8 | N/A | AUTO · fired: j8-belt (2 solids) · no belt between the gears; the belt of the drive is V4 |
| F1 | PASS | AUTO · served at pG1, pG2, prailb-seat, drailb-seat; fired: j2-live-shaft (56 solids) |
| F2 | PASS | AUTO · served at pG1, pG2, pPL, pPR, pT, pBt, slide-piston, slide-displacer; fired: j2-live-shaft (56 solids) · every bearing held by circlips or flange and circlip; hubs by set screws |
| F3 | PASS | AUTO · served at pG1, pG2, mesh-gear1-gear2; fired: j2-live-shaft (56 solids) |
| F4 | PASS | AUTO / HAND · served at pG1, pG2; fired: j2-live-shaft (56 solids) |
| F5 | PASS | AUTO / HAND · served at slide-piston, slide-displacer; fired: j5-slide (18 solids), stops (no solids) · slide end stops by the rule; the gears' mesh limits nothing else |
| F6 | N/A | AUTO / HAND · served at no joint; fired: j7-cam (no solids) · driven, no rest position |
| F7 | PASS | AUTO / HAND · served at pG2, slide-piston, slide-displacer, mesh-gear1-gear2, drive; fired: j6-mesh (4 solids), j5-slide (18 solids) · backlash eccentric under gear 2's housing; gibs on both slides |
| F8 | PASS | AUTO · served at slide-piston, slide-displacer; fired: lubrication (no solids) |
| F9 | PASS | AUTO / HAND · served at mesh-gear1-gear2; fired: timing-marks (no solids) · match marks at the mesh and the half-tooth phase (rule) |
| F10 | PASS | AUTO / HAND · served at drive; fired: drive (37 solids) · home flag and fork sensor on the input pulley; no slip clutch |
| M1 | PASS | AUTO · fired: hardware primitives |
| M2 | PASS | HAND · constant-speed gears: hubs on both gears; no spokes (see D2) |
| M3 | PASS | AUTO · fired: j3-moving-pin (72 solids), hardware primitives |
| M4 | PASS | AUTO / HAND · fired: base (1 solid), fasteners (stage 3) |
| M5 | N/A | AUTO / HAND · fired: hardware primitives · no pocket or window |
| M6 | PASS | AUTO · edge distance and walls clean |
| M7 | PASS | HAND |
| M8 | PASS | AUTO · fired: j1-dead-axle (no solids) |
| M9 | PASS | AUTO / HAND · fired: j1-dead-axle (no solids) |
| M10 | PASS | AUTO / HAND · 230 of 230 solids name a material |
| M11 | PASS | AUTO · fired: j1-dead-axle (no solids), hardware primitives |
| M12 | PASS | HAND |
| M13 | PASS | AUTO / HAND · 69 threaded, 0 without a locking method |
| M14 | N/A | AUTO / HAND · fired: j4-slot-roller (no solids) · no wear strip beyond the slides' gib and rails (J5 AUTO) |
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
| R1 | PASS | HAND · nothing drawn inline: every part from the family or the rules |
| R2 | PASS | HAND · threads M3, M4, M5; joint Ø 6, 10; bearings 6800-2RS (10x19x5), F686ZZ (6x13x5), F696ZZ (6x15x5) |
| R3 | PASS | AUTO · fired: hardware primitives |
| R4 | PASS | AUTO · package 30.0 KB |
| R5 | PASS | HAND |
| R6 | PASS | FLAG · plan 2.93, 28° 3.79, side 2.78, explode 3.52 ms at full detail, under the 8 ms desktop target |
| R7 | PASS | HAND · model.ts + polish.ts 7.0 KB |
| R8 | PASS | AUTO / SITE |
| DL1 | PASS | AUTO / HAND · 99 of 230 solids on a dropping rung |
| DL2 | PASS | HAND · model detail full |
| DL3 | PASS | AUTO |
| DL4 | PASS | SITE |
| DL5 | PASS | FLAG · rung counts and frame times in the detail ladder below |
| Q1 | PASS | check, clamp and edge distance clean |
| Q2 | PASS | 0 clashes |
| Q3 | PASS | package written, 30.0 KB; site build not checked here |
| Q4 | PASS | local: tools/shot · plan and 28° looked at locally in both sheets |
| Q5 | PASS | browser bench run; no flag |
| Q6 | PASS | · every row judged |
| Q7 | PASS | · conformance run at the end |

## Joints
| Joint | Type | F1 locate | F2 retain | F3 torque | F4 thrust | F5 limit | F6 hold | F7 adjust | F8 lube | F9 timing | F10 protect |
|---|---|---|---|---|---|---|---|---|---|---|---|
| pG1 | J2 | 2 x Dowel pin Ø3 x 10 h6, housing to base | 2 x Internal circlip DIN 472, Ø19; External circlip DIN 471, Ø10; Socket head M5 x 10 (ISO 4762), into the shaft end | Feather key 3 x 3 x 7 (DIN 6885) | Wave washer 14.5x18.8, spring steel; Thrust washer 10.2x16, bronze | – limited by the linkage | – driven, no rest position | – lengths fixed by the rods; the mesh backlash is set at gear 2 | – shielded bearings, greased for life | – phase held by the mesh and its marks | – no overload path: the gear mesh drives the load |
| pG2 | J2 | 2 x Dowel pin Ø3 x 10 h6, housing to base | 2 x Internal circlip DIN 472, Ø19; External circlip DIN 471, Ø10; Shaft collar 10x20, set screw | Feather key 3 x 3 x 7 (DIN 6885) | Wave washer 14.5x18.8, spring steel; Thrust washer 10.2x16, bronze | – limited by the linkage | – driven, no rest position | Eccentric bushing Ø26, 0.3 mm offset bore Ø12, flanged | – shielded bearings, greased for life | – phase held by the mesh and its marks | – no overload path: the gear mesh drives the load |
| pPL | J3 | – no removable plate on a moving pin | 2 x Internal circlip DIN 472, Ø13; 2 x Bearing F686ZZ (6x13x5); head | – no keyed part | – bearings located by flange and circlip, inner races clamped | – limited by the linkage | – driven, no rest position | – lengths fixed by the rods; the mesh backlash is set at gear 2 | – shielded bearings, greased for life | – phase held by the mesh and its marks | – no overload path: the gear mesh drives the load |
| pPR | J3 | – no removable plate on a moving pin | 2 x Internal circlip DIN 472, Ø13; 2 x Bearing F686ZZ (6x13x5); head | – no keyed part | – bearings located by flange and circlip, inner races clamped | – limited by the linkage | – driven, no rest position | – lengths fixed by the rods; the mesh backlash is set at gear 2 | – shielded bearings, greased for life | – phase held by the mesh and its marks | – no overload path: the gear mesh drives the load |
| pT | J3 | – no removable plate on a moving pin | Internal circlip DIN 472, Ø13; Bearing F686ZZ (6x13x5); Internal circlip DIN 472, Ø15; Bearing F696ZZ (6x15x5); head | – no keyed part | – bearings located by flange and circlip, inner races clamped | – limited by the linkage | – driven, no rest position | – lengths fixed by the rods; the mesh backlash is set at gear 2 | – shielded bearings, greased for life | – phase held by the mesh and its marks | – no overload path: the gear mesh drives the load |
| pBt | J3 | – no removable plate on a moving pin | Internal circlip DIN 472, Ø13; Bearing F686ZZ (6x13x5); Internal circlip DIN 472, Ø15; Bearing F696ZZ (6x15x5); head | – no keyed part | – bearings located by flange and circlip, inner races clamped | – limited by the linkage | – driven, no rest position | – lengths fixed by the rods; the mesh backlash is set at gear 2 | – shielded bearings, greased for life | – phase held by the mesh and its marks | – no overload path: the gear mesh drives the load |
| slide-piston | J5 | – no removable plate on a moving pin | Keeper plate, holds the slider down | – no keyed part | – bearings located by flange and circlip, inner races clamped | End stop block, hardened | – driven, no rest position | Gib strip 100 x 7 x 1.3, bronze, slotted, clamped under the keeper | 2 x wiper; Grease nipple M6 (DIN 71412) | – phase held by the mesh and its marks | – no overload path: the gear mesh drives the load |
| slide-displacer | J5 | – no removable plate on a moving pin | Keeper plate, holds the slider down | – no keyed part | – bearings located by flange and circlip, inner races clamped | End stop block, hardened | – driven, no rest position | Gib strip 100 x 7 x 1.3, bronze, slotted, clamped under the keeper | 2 x wiper; Grease nipple M6 (DIN 71412) | – phase held by the mesh and its marks | – no overload path: the gear mesh drives the load |
| mesh-gear1-gear2 | J6 | – no removable plate on a moving pin | – n/a | 2 x Gear hub Ø22, set screw M3 on the key; 2 x Set screw M3 (DIN 916), threadlocked | – bearings located by flange and circlip, inner races clamped | – limited by the linkage | – driven, no rest position | Eccentric bushing Ø26, 0.3 mm offset bore Ø12, flanged | – shielded bearings, greased for life | Gear 1, 30 teeth; Gear 2, 30 teeth | – no overload path: the gear mesh drives the load |
| praila-seat | post | – no removable plate on a moving pin | – n/a | – no keyed part | – bearings located by flange and circlip, inner races clamped | – limited by the linkage | – driven, no rest position | – lengths fixed by the rods; the mesh backlash is set at gear 2 | – shielded bearings, greased for life | – phase held by the mesh and its marks | – no overload path: the gear mesh drives the load |
| prailb-seat | post | 2 x Dowel pin Ø3 h6 (ISO 8734), rail to base | – n/a | – no keyed part | – bearings located by flange and circlip, inner races clamped | – limited by the linkage | – driven, no rest position | – lengths fixed by the rods; the mesh backlash is set at gear 2 | – shielded bearings, greased for life | – phase held by the mesh and its marks | – no overload path: the gear mesh drives the load |
| draila-seat | post | – no removable plate on a moving pin | – n/a | – no keyed part | – bearings located by flange and circlip, inner races clamped | – limited by the linkage | – driven, no rest position | – lengths fixed by the rods; the mesh backlash is set at gear 2 | – shielded bearings, greased for life | – phase held by the mesh and its marks | – no overload path: the gear mesh drives the load |
| drailb-seat | post | 2 x Dowel pin Ø3 h6 (ISO 8734), rail to base | – n/a | – no keyed part | – bearings located by flange and circlip, inner races clamped | – limited by the linkage | – driven, no rest position | – lengths fixed by the rods; the mesh backlash is set at gear 2 | – shielded bearings, greased for life | – phase held by the mesh and its marks | – no overload path: the gear mesh drives the load |
| drive | drive | – no removable plate on a moving pin | – n/a | – no keyed part | – bearings located by flange and circlip, inner races clamped | – limited by the linkage | – driven, no rest position | bracket | – shielded bearings, greased for life | – phase held by the mesh and its marks | Home flag, 1 mm steel vane; 3 x Fork sensor, slotted optical, 5 mm gap; Pulley flanges |

## Variants and overrides
| Joint or part | Rule result | Chosen | Why |
|---|---|---|---|
| rods | layer 1 and 2, z 10 to 16 and 20 to 26 | plated 4 mm up in the model (dz) | gear hubs and shaft ends stand to z 13.6: the rods must pass over them |
| yokes and rails | layer 3 | layer 4 | the pin heads at the crank pins stand to z 36 and pass under the rails |
| rail gap | 20 | 26 | the yoke bearing's flange (Ø17) must stay clear of the keeper's lap |
| gears | spoked or windowed | plain webs | crank pin bosses and hubs fill the 30-tooth gears (D2) |

## Detail ladder
| Rung | Solids | Marks | Frame ms at this dial position |
|---|---|---|---|
| DL-A | 26 | 0 | 3.73 |
| DL-B | 0 | 284 | 2.5 |
| DL-C | 0 | 0 | 2.22 |
| DL-D | 36 | 0 | 2.07 |
| DL-E | 14 | 2 | 1.97 |
| DL-F | 0 | 0 | 2.02 |
| DL-G | 0 | 0 | 1.61 |
| DL-H | 23 | 0 | 1.41 |
| never | 131 | 245 | 3.69 (full) |

## Promotion candidates
Hand fixes that should become rules or primitives.

- `H.slide` rails on layer 4 over the gears: pads only on the free runs, as the rule does; no change needed.
- Bearing anchor: the J3 rule threads the bolt into the lowest part, so the flange of the yoke bearing sits where the keeper laps; solved here by a wider rail gap. A rule option to anchor in the topmost part would avoid it.

## Verification
check: clean · clearance: 0 clashes · clamp: clean · edge distance: clean · package: 30.0 KB
screenshots: plan and 28°, dark and light, looked at locally (not attached) · bench: browser, 2026-10-19, RTX 5090, plan 2.93, 28° 3.79, side 2.78, explode 3.52 ms at full detail, setup 11.7 ms, package 30 KB; under the 8 ms target
