# Audit: Walschaerts valve gear (walschaerts-valve-gear)
standard: 2.6 · date: 2026-10-19 · result: pass · detail: full · pass: build

## Summary
PASS 115 · FAIL 0 · N/A 6 · open: none

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
| P9 | PASS | HAND · solve(): valve travel 24 mm at die 0, 49 at 0.8, 58 at 1.0; the die slips 18.9° to 20.8° along the slot; matches explain (lap and lead from the crosshead, variable part from the link) |
| P10 | PASS | HAND · valve pin and crosshead traced, velocities at both, rod forces, plot of the valve position |
| P11 | PASS | DATA |
| K1 | PASS | HAND · check: max link error 1.1e-13 mm · check: link error 1.1e-13 mm; the polish adds hardware and marks only |
| K2 | PASS | HAND · check: finite, continuous, periodic over 720 samples |
| K3 | PASS | HAND |
| K4 | PASS | HAND |
| K5 | PASS | HAND · check: no INTERFERE, OVERLAP or WARN · layers 0 to 6; eccentric rod plated 3.5 mm up (dz), centres untouched; twins for return crank, crosshead arm, inner bar and cover |
| K6 | PASS | DATA · r 60, rr 25 at 90°, main rod 260, eccentric rod 220, slot radius = radius rod 180, lever 110, union 60, die 0.8; deviations stated in model.ts: spindle pin 22 below the lever top (catalogue 15; 15 gives 16 mm mid-gear travel, not the catalogue's 24), lifting link on the die pin, wheel drawn as its crank web |
| K7 | PASS | HAND · input rotary on wheel |
| D1 | PASS | HAND |
| D2 | PASS | HAND · no windows: the rods are slender; the foot's ear carries material where the eccentric rod pulls |
| D3 | PASS | STYLE |
| D4 | PASS | AUTO · fired: base (1 solid), feet (4 solids) |
| D5 | PASS | AUTO / HAND · one bridge over the trunnion, straps and posts on the link |
| D6 | PASS | HAND / STYLE |
| D7 | PASS | HAND |
| A1 | PASS | AUTO · pO J2, pCp J3, pRc J3, pXh J3, pLf J3, pLt J1, pD J3, pRt J3, pVs J3, pUb J3, pUc J3, pLr J1, slide-crosshead J5, slide-spindle J5; fired: classify (no solids) |
| A2 | PASS | AUTO · pO J2, pCp J3, pRc J3, pXh J3, pLf J3, pLt J1, pD J3, pRt J3, pVs J3, pUb J3, pUc J3, pLr J1, slide-crosshead J5, slide-spindle J5 |
| A3 | PASS | AUTO · fired: classify (no solids) |
| A4 | PASS | AUTO · fired: j1-dead-axle (40 solids) |
| A5 | PASS | AUTO · fired: j2-live-shaft (27 solids) |
| A6 | PASS | AUTO · fired: standoffs (28 solids) |
| A7 | PASS | AUTO · fired: base (1 solid), feet (4 solids) |
| A8 | PASS | AUTO · fired: fasteners (stage 3) |
| A9 | PASS | AUTO / HAND · fired: j2-straddle (no solids) · double shear at the crank pin (return crank outside the main rod) and the gudgeon pin (crosshead arm); the rest single shear, forced: rods and bars sweep over each stack |
| A10 | PASS | HAND · crank web 0, main rod 1, return crank and crosshead arm 2, eccentric and radius rods 3, link bars and lever 4, cover and union 5, valve spindle 6: each pin joins layers whose sweeps never meet it (from the conflict table, not stacked only to clear) |
| A11 | PASS | AUTO / HAND · fired: j1-dead-axle (40 solids) · pins to bearings to rods; axle to housing to base; trunnion stud to bridge to posts to base; reverse arm axle into the base |
| A12 | PASS | AUTO · clamp check clean |
| A13 | PASS | AUTO / HAND · 348 solids, 187 unnamed (further items of a listed set) |
| A14 | PASS | HAND · posts, straps, stops and leads clear every sweep; clearance 0 |
| A15 | PASS | AUTO · clearance: 0 clashes over the cycle |
| A16 | PASS | HAND · 5 build rules; no note: none; no badge: none · a note and a badge on every moving joint, five build rules |
| A17 | PASS | HAND · goes together from the base up: housing and axle, crank web, main rod, return crank, crosshead, slides, lifting link and stud, radius rod, die, bars with strips, end blocks and straps, cover, bridge; every screw reachable from above |
| E1 | PASS | AUTO · every solid has one explode level; levels -8 to 8 |
| E2 | PASS | AUTO · 80 rigid groups; fired: explode |
| E3 | PASS | AUTO · fired: explode |
| E4 | PASS | HAND |
| E5 | PASS | AUTO · fired: explode |
| E6 | PASS | AUTO · fired: explode |
| E7 | PASS | AUTO · fired: explode |
| E8 | PASS | AUTO · fired: explode |
| E9 | PASS | HAND |
| J1 | PASS | AUTO · fired: j1-dead-axle (40 solids) · Lt hung from a bridge into the cover only; Lr a base axle with no bridge (the link sweeps over it, single shear) |
| J2 | PASS | AUTO · fired: j2-live-shaft (27 solids), j2-straddle (no solids) · O: housing, keyed shaft, drive |
| J3 | PASS | AUTO · fired: j3-moving-pin (110 solids) · every moving pin a shoulder bolt; D a stud carrying the die (variant) |
| J4 | N/A | AUTO · fired: j4-slot-roller (no solids) · no pin in a slot the rules see; the die in the link's slot is built by hand (see J3 and M14) |
| J5 | PASS | AUTO · fired: j5-slide (22 solids) · crosshead and valve spindle slides: reference rail, gib under keeper, wipers, nipple, end stops |
| J6 | N/A | AUTO · fired: j6-mesh (no solids) · no gear mesh |
| J7 | N/A | AUTO · fired: j7-cam (no solids) · no cam |
| J8 | N/A | AUTO · fired: j8-belt (2 solids) · no belt besides the drive's (V4) |
| F1 | PASS | AUTO · served at pO, pLt, pLt-bridge-post, guideb-seat, vrailb-seat; fired: j2-live-shaft (27 solids) |
| F2 | PASS | AUTO · served at pO, pCp, pRc, pXh, pLf, pLt, pD, pRt, pVs, pUb, pUc, pLr, slide-crosshead, slide-spindle; fired: j2-live-shaft (27 solids) · every bearing held by circlips or flange and circlip; die and stud by external circlips; strips screwed |
| F3 | PASS | AUTO · served at pO; fired: j2-live-shaft (27 solids) |
| F4 | PASS | AUTO / HAND · served at pO, pLr; fired: j2-live-shaft (27 solids) |
| F5 | PASS | AUTO / HAND · served at pD, pLr, slide-crosshead, slide-spindle; fired: j5-slide (22 solids), stops (6 solids) · slide end stops by the rule; slot end blocks 3.5 mm past the die's travel; stops at the lifting link by the rule |
| F6 | N/A | AUTO / HAND · served at no joint; fired: j7-cam (no solids) · driven, no rest position |
| F7 | PASS | AUTO / HAND · served at pLr, slide-crosshead, slide-spindle, drive; fired: j6-mesh (no solids), j5-slide (22 solids) · eccentric bushing at the reverse arm sets the die's place; gibs on both slides |
| F8 | PASS | AUTO · served at pD, slide-crosshead, slide-spindle; fired: lubrication (no solids) · oil sink on the bronze die; the others shielded or sealed |
| F9 | PASS | AUTO / HAND · served at pCp; fired: timing-marks (no solids) · match marks for the return crank's 90° on the crank web and the return crank |
| F10 | PASS | AUTO / HAND · served at drive; fired: drive (37 solids) · home flag and fork sensor on the input; no slip clutch |
| M1 | PASS | AUTO · fired: hardware primitives |
| M2 | PASS | HAND · crank web with a balance tail opposite the pin |
| M3 | PASS | AUTO · fired: j3-moving-pin (110 solids), hardware primitives |
| M4 | PASS | AUTO / HAND · fired: base (1 solid), fasteners (stage 3) |
| M5 | N/A | AUTO / HAND · fired: hardware primitives · no pocket or window; bars and ends full radius |
| M6 | PASS | AUTO · edge distance and walls clean |
| M7 | PASS | HAND |
| M8 | PASS | AUTO · fired: j1-dead-axle (40 solids) |
| M9 | PASS | AUTO / HAND · fired: j1-dead-axle (40 solids) |
| M10 | PASS | AUTO / HAND · 348 of 348 solids name a material |
| M11 | PASS | AUTO · fired: j1-dead-axle (40 solids), hardware primitives |
| M12 | PASS | HAND |
| M13 | PASS | AUTO / HAND · 147 threaded, 0 without a locking method |
| M14 | PASS | AUTO / HAND · fired: j4-slot-roller (no solids) · hardened curved wear strips on both slot faces, 4 x M2 csk each, and a bronze die block, as at the Whitworth lever |
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
| R1 | PASS | HAND · reuses H.shaft, H.wearStrip, H.plate, H.tube, H.screw, H.eccentricMount; curved bars and strips from the model's arc helper |
| R2 | PASS | HAND · threads M2, M3, M4, M5, M6; joint Ø 4, 6, 8, 10; bearings 6800-2RS (10x19x5), F688ZZ (8x16x5), F686ZZ (6x13x5), F696ZZ (6x15x5), 684ZZ (4x9x4), F686 (6x13x5) |
| R3 | PASS | AUTO · fired: hardware primitives |
| R4 | PASS | AUTO · package 39.3 KB |
| R5 | PASS | HAND |
| R6 | PASS | FLAG · plan 3.31, 28° 4.57, side 3.53, explode 4.27 ms at full detail, under the 8 ms desktop target |
| R7 | PASS | HAND · model.ts + polish.ts 20.0 KB |
| R8 | PASS | AUTO / SITE |
| DL1 | PASS | AUTO / HAND · 131 of 348 solids on a dropping rung |
| DL2 | PASS | HAND · model detail full |
| DL3 | PASS | AUTO |
| DL4 | PASS | SITE |
| DL5 | PASS | FLAG · rung counts and frame times in the detail ladder below |
| Q1 | PASS | check, clamp and edge distance clean |
| Q2 | PASS | 0 clashes |
| Q3 | PASS | package written, 39.3 KB; site build not checked here |
| Q4 | PASS | local: tools/shot · plan and 28° looked at locally in both sheets |
| Q5 | PASS | browser bench run; no flag |
| Q6 | PASS | · every row judged |
| Q7 | PASS | · conformance run at the end |

## Joints
| Joint | Type | F1 locate | F2 retain | F3 torque | F4 thrust | F5 limit | F6 hold | F7 adjust | F8 lube | F9 timing | F10 protect |
|---|---|---|---|---|---|---|---|---|---|---|---|
| pO | J2 | 2 x Dowel pin Ø3 x 10 h6, housing to base | 2 x Internal circlip DIN 472, Ø19; Countersunk M5 x 12 (ISO 10642), into the shaft end, flush; Socket head M5 x 10 (ISO 4762), into the shaft end | Feather key 3 x 3 x 6 (DIN 6885) | Wave washer 14.5x18.8, spring steel; Thrust washer 10.2x16, bronze | – limited by the linkage | – driven, no rest position | – lengths fixed; the die's place is set at the reverse arm | – shielded bearings, greased for life | – phase held by the linkage; return crank marked at Cp | – no overload path beyond the wheel's drive |
| pCp | J3 | – no removable plate on a moving pin | Internal circlip DIN 472, Ø16; Bearing F688ZZ (8x16x5); head | – no keyed part | – bearings located by flange and circlip, inner races clamped | – limited by the linkage | – driven, no rest position | – lengths fixed; the die's place is set at the reverse arm | – shielded bearings, greased for life | Crank web of the driving wheel; Return crank | – no overload path beyond the wheel's drive |
| pRc | J3 | – no removable plate on a moving pin | Internal circlip DIN 472, Ø13; Bearing F686ZZ (6x13x5); head | – no keyed part | – bearings located by flange and circlip, inner races clamped | – limited by the linkage | – driven, no rest position | – lengths fixed; the die's place is set at the reverse arm | – shielded bearings, greased for life | – phase held by the linkage; return crank marked at Cp | – no overload path beyond the wheel's drive |
| pXh | J3 | – no removable plate on a moving pin | Internal circlip DIN 472, Ø16; Bearing F688ZZ (8x16x5); head | – no keyed part | – bearings located by flange and circlip, inner races clamped | – limited by the linkage | – driven, no rest position | – lengths fixed; the die's place is set at the reverse arm | – shielded bearings, greased for life | – phase held by the linkage; return crank marked at Cp | – no overload path beyond the wheel's drive |
| pLf | J3 | – no removable plate on a moving pin | Internal circlip DIN 472, Ø16; Bearing F688ZZ (8x16x5); head | – no keyed part | – bearings located by flange and circlip, inner races clamped | – limited by the linkage | – driven, no rest position | – lengths fixed; the die's place is set at the reverse arm | – shielded bearings, greased for life | – phase held by the linkage; return crank marked at Cp | – no overload path beyond the wheel's drive |
| pLt | J1 | 2 x spigot | Internal circlip DIN 472, Ø15; Bearing F696ZZ (6x15x5); External circlip DIN 471, Ø6 | – no keyed part | – bearings located by flange and circlip, inner races clamped | – limited by the linkage | – driven, no rest position | – lengths fixed; the die's place is set at the reverse arm | – shielded bearings, greased for life | – phase held by the linkage; return crank marked at Cp | – no overload path beyond the wheel's drive |
| pD | J3 | – no removable plate on a moving pin | Internal circlip DIN 472, Ø15; Bearing F696ZZ (6x15x5); External circlip DIN 471, Ø6; 2 x Wear strip, curved R180, hardened, 4 x M2 csk | – no keyed part | – bearings located by flange and circlip, inner races clamped | 2 x Slot end block, hardened, screwed from the strap | – driven, no rest position | – lengths fixed; the die's place is set at the reverse arm | Die block Ø11.5, bronze, turning on the stud | – phase held by the linkage; return crank marked at Cp | – no overload path beyond the wheel's drive |
| pRt | J3 | – no removable plate on a moving pin | Internal circlip DIN 472, Ø15; Bearing F696ZZ (6x15x5); head | – no keyed part | – bearings located by flange and circlip, inner races clamped | – limited by the linkage | – driven, no rest position | – lengths fixed; the die's place is set at the reverse arm | – shielded bearings, greased for life | – phase held by the linkage; return crank marked at Cp | – no overload path beyond the wheel's drive |
| pVs | J3 | – no removable plate on a moving pin | 2 x Internal circlip DIN 472, Ø9; Bearing 684ZZ (4x9x4); head | – no keyed part | – bearings located by flange and circlip, inner races clamped | – limited by the linkage | – driven, no rest position | – lengths fixed; the die's place is set at the reverse arm | – shielded bearings, greased for life | – phase held by the linkage; return crank marked at Cp | – no overload path beyond the wheel's drive |
| pUb | J3 | – no removable plate on a moving pin | Internal circlip DIN 472, Ø13; Bearing F686ZZ (6x13x5); head | – no keyed part | – bearings located by flange and circlip, inner races clamped | – limited by the linkage | – driven, no rest position | – lengths fixed; the die's place is set at the reverse arm | – shielded bearings, greased for life | – phase held by the linkage; return crank marked at Cp | – no overload path beyond the wheel's drive |
| pUc | J3 | – no removable plate on a moving pin | Internal circlip DIN 472, Ø13; Bearing F686ZZ (6x13x5); head | – no keyed part | – bearings located by flange and circlip, inner races clamped | – limited by the linkage | – driven, no rest position | – lengths fixed; the die's place is set at the reverse arm | – shielded bearings, greased for life | – phase held by the linkage; return crank marked at Cp | – no overload path beyond the wheel's drive |
| pLr | J1 | – no removable plate on a moving pin | Internal circlip DIN 472, Ø13; Bearing F686ZZ (6x13x5) | – no keyed part | Thrust washer 6.2x8.4, bronze | 2 x Stop bumper, neoprene sleeve Ø12 | – driven, no rest position | Eccentric bushing Ø14, 0.3 mm offset bore Ø6, flanged | – shielded bearings, greased for life | – phase held by the linkage; return crank marked at Cp | – no overload path beyond the wheel's drive |
| slide-crosshead | J5 | – no removable plate on a moving pin | Keeper plate, holds the slider down | – no keyed part | – bearings located by flange and circlip, inner races clamped | 2 x End stop block, hardened | – driven, no rest position | Gib strip 195 x 7 x 2.3, bronze, slotted, clamped under the keeper | 2 x wiper; Grease nipple M6 (DIN 71412) | – phase held by the linkage; return crank marked at Cp | – no overload path beyond the wheel's drive |
| slide-spindle | J5 | – no removable plate on a moving pin | Keeper plate, holds the slider down | – no keyed part | – bearings located by flange and circlip, inner races clamped | End stop block, hardened | – driven, no rest position | Gib strip 115 x 7 x 2.3, bronze, slotted, clamped under the keeper | 2 x wiper; Grease nipple M6 (DIN 71412) | – phase held by the linkage; return crank marked at Cp | – no overload path beyond the wheel's drive |
| pLt-bridge-post | post | 2 x spigot | – n/a | – no keyed part | – bearings located by flange and circlip, inner races clamped | – limited by the linkage | – driven, no rest position | – lengths fixed; the die's place is set at the reverse arm | – shielded bearings, greased for life | – phase held by the linkage; return crank marked at Cp | – no overload path beyond the wheel's drive |
| guidea-seat | post | – no removable plate on a moving pin | – n/a | – no keyed part | – bearings located by flange and circlip, inner races clamped | – limited by the linkage | – driven, no rest position | – lengths fixed; the die's place is set at the reverse arm | – shielded bearings, greased for life | – phase held by the linkage; return crank marked at Cp | – no overload path beyond the wheel's drive |
| guideb-seat | post | 2 x Dowel pin Ø3 h6 (ISO 8734), rail to base | – n/a | – no keyed part | – bearings located by flange and circlip, inner races clamped | – limited by the linkage | – driven, no rest position | – lengths fixed; the die's place is set at the reverse arm | – shielded bearings, greased for life | – phase held by the linkage; return crank marked at Cp | – no overload path beyond the wheel's drive |
| vraila-seat | post | – no removable plate on a moving pin | – n/a | – no keyed part | – bearings located by flange and circlip, inner races clamped | – limited by the linkage | – driven, no rest position | – lengths fixed; the die's place is set at the reverse arm | – shielded bearings, greased for life | – phase held by the linkage; return crank marked at Cp | – no overload path beyond the wheel's drive |
| vrailb-seat | post | 2 x Dowel pin Ø3 h6 (ISO 8734), rail to base | – n/a | – no keyed part | – bearings located by flange and circlip, inner races clamped | – limited by the linkage | – driven, no rest position | – lengths fixed; the die's place is set at the reverse arm | – shielded bearings, greased for life | – phase held by the linkage; return crank marked at Cp | – no overload path beyond the wheel's drive |
| drive | drive | – no removable plate on a moving pin | – n/a | – no keyed part | – bearings located by flange and circlip, inner races clamped | – limited by the linkage | – driven, no rest position | bracket | – shielded bearings, greased for life | – phase held by the linkage; return crank marked at Cp | Home flag, 1 mm steel vane; 3 x Fork sensor, slotted optical, 5 mm gap; Pulley flanges |

## Variants and overrides
| Joint or part | Rule result | Chosen | Why |
|---|---|---|---|
| pD, die pin | shoulder bolt with a head over the radius rod | stud on to a bronze die block, circlip | the die runs in the slot between the bars; a head would stand in the slot |
| expansion link | one plate with a slot | two curved bars, tied by the cover and two end straps on posts | the die passes the trunnion's place, so no plate may cross the slot there |
| pLt, trunnion | dead axle from the base | hung stud from a bridge into the cover (J1, hung rule) | the die, radius rod and lifting link pass under it |
| pLr, reverse arm | axle with a bridge over it | no bridge, single shear (J1 rule change in this branch) | the link sweeps over the axle above the lifting link |
| eccentric rod | layer 3 | plated 3.5 mm up (dz) | the crank pin's head stands to z 32.7 |
| pLr | fixed axle | eccentric bushing in the base (H.eccentricMount) | F7: the die's place in the slot |
| wheel | disc | crank web with a balance tail | a disc would hold the return crank pin (K5) |

## Detail ladder
| Rung | Solids | Marks | Frame ms at this dial position |
|---|---|---|---|
| DL-A | 28 | 0 | 3.95 |
| DL-B | 0 | 435 | 2.95 |
| DL-C | 0 | 0 | 3.09 |
| DL-D | 61 | 0 | 2.29 |
| DL-E | 14 | 2 | 2.43 |
| DL-F | 0 | 0 | 2.35 |
| DL-G | 0 | 0 | 2.11 |
| DL-H | 28 | 0 | 1.82 |
| never | 217 | 359 | 4.52 (full) |

## Promotion candidates
Hand fixes that should become rules or primitives.

- Curved slots: the classifier reads a slot from its hole's box, so a curved slot is not seen; here the slot is a gap between two bars and the die, strips and ends are by hand. A curved-slot J4 (arc strips, die block) would make this a rule.
- The J1 bridge is now skipped when a part sweeps over the axle above its stack (rule change in this branch).

## Verification
check: clean · clearance: 0 clashes · clamp: clean · edge distance: clean · package: 39.3 KB
screenshots: plan and 28°, dark and light, looked at locally (not attached) · bench: browser, 2026-10-19, RTX 5090, plan 3.31, 28° 4.57, side 3.53, explode 4.27 ms at full detail, setup 13.7 ms, package 39.3 KB; under the 8 ms target
