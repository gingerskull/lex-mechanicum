# Audit: Roberts linkage (roberts-linkage)
standard: 2.6 · date: 2026-10-19 · result: pass · detail: full · pass: build

## Summary
PASS 110 · FAIL 0 · N/A 11 · open: none

## Requirements
| Id | Status | Evidence / action |
|---|---|---|
| S1 | PASS | DATA · changelog in the standard carries ids and tiers |
| S2 | PASS | HAND · header present |
| S3 | PASS | AUTO · tools/conformance reads this header |
| S4 | PASS | SITE · the pass issue holds only this mechanism's open items |
| P1 | PASS | DATA · record complete; model.ts, polish.ts, audit.md present |
| P2 | PASS | DATA · catalogue validator clean |
| P3 | PASS | DATA / SITE · record has ratio, axes, output character, backdrivable, aka; the input kind decides the drive line |
| P4 | PASS | DATA · tags grouped in the record |
| P5 | PASS | DATA · explain and real-world uses present |
| P6 | PASS | DATA · Wikipedia and further sources, a video and a photo page in the record; links not replayed in this session |
| P7 | PASS | HAND / SITE · no prose in model.ts or polish.ts beyond engineering notes |
| P8 | PASS | SITE · page does not show parts or joints |
| P9 | PASS | HAND · explain matches solve(): apex runs x -40.5 to 39.6 on y 0 to -0.38 over the 34° swing (measured) |
| P10 | PASS | HAND · paths (first with the comet), vel, forces, angles, plot declared and drawn |
| P11 | PASS | DATA · record prose read; short sentences, no em dashes |
| K1 | PASS | HAND · check: max link error 2.8e-14 mm · link error ~0; plating and hardware never move a centre |
| K2 | PASS | HAND · check: finite, continuous, periodic over 720 samples |
| K3 | PASS | HAND · link, plate, cap and tracer only; placement by between, fixed, at |
| K4 | PASS | HAND · roles driver, output, link, pin, trace; accent on the input pin only |
| K5 | PASS | HAND · check: no INTERFERE, OVERLAP or WARN · layers integer, ground pivots layer -1 radius 7, moving pins radius 5.5; no INTERFERE, OVERLAP or WARN |
| K6 | PASS | DATA · b 50, a 70, ground 2b 100, isosceles coupler, apex on the ground side, rocker swing 50° to 84° as the catalogue build |
| K7 | PASS | HAND · input oscillating on rockerL · oscillating on rockerL via osc(50°, 84°) |
| D1 | PASS | HAND · tapered links with boss rings, flush caps, squircle base |
| D2 | PASS | HAND · bosses round every pin; rockers plain bars; the coupler is a 50 by 65 mm triangle, no window |
| D3 | PASS | STYLE · style only |
| D4 | PASS | AUTO · fired: base (1 solid), feet (3 solids) · base corners and feet by rule |
| D5 | PASS | AUTO / HAND · housing at O1; no bridge at O2 because the coupler apex sweeps over it (see the joint note) |
| D6 | PASS | HAND / STYLE · screenshots: nothing cosmetic |
| D7 | PASS | HAND · big parts plain; richness in the hardware |
| A1 | PASS | AUTO · pO1 J2, pO2 J1, pB1 J3, pC1 J3; fired: classify (no solids) · joint types read correctly from the model |
| A2 | PASS | AUTO · pO1 J2, pO2 J1, pB1 J3, pC1 J3 · live shaft at the input, dead axles at ground pivots, shoulder bolts at moving pins |
| A3 | PASS | AUTO · fired: classify (no solids) · catalogue bearings and spacers by rule |
| A4 | PASS | AUTO · fired: j1-dead-axle (28 solids) · stepped shafts by rule |
| A5 | PASS | AUTO · fired: j2-live-shaft (27 solids) · feather key on the Ø10 input shaft |
| A6 | N/A | AUTO · fired: standoffs (no solids) · no fixed plate floating over the base, no slide |
| A7 | PASS | AUTO · fired: base (1 solid), feet (3 solids) · base, feet, scale and clearance hole by rule |
| A8 | PASS | AUTO · fired: fasteners (stage 3) · stage 3 fasteners fired |
| A9 | PASS | AUTO / HAND · fired: j2-straddle (no solids) · B1 and C1 single shear, forced: the coupler sweeps over both rocker tips and nothing fits above; O1 straddled by the housing; O2 held by the base and eccentric only, the apex sweeps over it |
| A10 | PASS | HAND · rockers share the base layer (the right one 2 mm up, for the eccentric flange); the coupler rides above (1.7 mm up, to clear the O2 circlip) |
| A11 | PASS | AUTO / HAND · fired: j1-dead-axle (28 solids) · O1 via the housing, O2 via the axle and eccentric into the base (no top bridge, flagged held at the base), pins via the rockers |
| A12 | PASS | AUTO · clamp check clean |
| A13 | PASS | AUTO / HAND · 125 solids, 62 unnamed (further items of a listed set) · named catalogue hardware; unnamed items are further parts of a listed set |
| A14 | PASS | HAND · stops 2° outside the swing; the coupler apex clears the O2 circlip (clearance 0) |
| A15 | PASS | AUTO · clearance: 0 clashes over the cycle |
| A16 | PASS | HAND · 5 build rules; no note: none; no badge: none · joint notes, badges and 5 build rules |
| A17 | PASS | HAND · goes together bottom to top: base, axles, rockers, coupler; every screw reachable from above or below |
| E1 | PASS | AUTO · every solid has one explode level; levels -8 to 2.5 · one level per solid |
| E2 | PASS | AUTO · 32 rigid groups; fired: explode · fastener groups rigid |
| E3 | PASS | AUTO · fired: explode · screws leave to the head side |
| E4 | PASS | HAND · levels follow A17 |
| E5 | PASS | AUTO · fired: explode · bearings and clips stay with their part |
| E6 | PASS | AUTO · fired: explode · motor and bracket move as one |
| E7 | PASS | AUTO · fired: explode · spacers sit midway |
| E8 | N/A | AUTO · fired: explode · no keyed parts stacked on one shaft |
| E9 | PASS | HAND · explode looked at in the screenshots |
| J1 | PASS | AUTO · fired: j1-dead-axle (28 solids) · dead axles built by rule |
| J2 | PASS | AUTO · fired: j2-live-shaft (27 solids), j2-straddle (no solids) · live shaft cartridge at the input |
| J3 | PASS | AUTO · fired: j3-moving-pin (24 solids) · shoulder bolts at the moving pins |
| J4 | N/A | AUTO · fired: j4-slot-roller (no solids) · no pin in a slot |
| J5 | N/A | AUTO · fired: j5-slide (no solids) · no slide |
| J6 | N/A | AUTO · fired: j6-mesh (no solids) · no gear mesh |
| J7 | N/A | AUTO · fired: j7-cam (no solids) · no cam |
| J8 | N/A | AUTO · fired: j8-belt (no solids) · crank-and-link drive, no belt |
| F1 | PASS | AUTO · served at pO1, pO2; fired: j2-live-shaft (27 solids) · dowels at the housing, spigots where a bridge stands |
| F2 | PASS | AUTO · served at pO1, pO2, pB1, pC1; fired: j2-live-shaft (27 solids) · circlips and retainers on every bearing |
| F3 | PASS | AUTO · served at pO1; fired: j2-live-shaft (27 solids) · feather key on the input shaft |
| F4 | PASS | AUTO / HAND · served at pO1, pO2; fired: j2-live-shaft (27 solids) · thrust washers at the ground pivots |
| F5 | PASS | AUTO / HAND · served at pO1, pO2; fired: j5-slide (no solids), stops (6 solids) · stops 2° outside the input rocker's swing, by hand (the rule skips the input) |
| F6 | N/A | AUTO / HAND · served at no joint; fired: j7-cam (no solids) · driven through the drive link; no rest position to hold |
| F7 | PASS | AUTO / HAND · served at pO2; fired: j6-mesh (no solids), j5-slide (no solids) · eccentric bushing at O2 sets the ground length 2b = 100 (Appendix A); drawn at its set point, centres exact |
| F8 | PASS | AUTO · served at no joint; fired: lubrication (no solids) · bearings shielded, greased for life (no bridge at O2 to carry an oil sink); housing bearings sealed |
| F9 | PASS | AUTO / HAND · served at pO1; fired: timing-marks (no solids) · swing scale on the base and an index on the input link |
| F10 | PASS | AUTO / HAND · served at drive; fired: drive (33 solids) · pulley flanges, home flag, fork sensor, leads |
| M1 | PASS | AUTO · fired: hardware primitives · outer edges chamfered by rule |
| M2 | PASS | HAND · no wheel; short bars need no lightening |
| M3 | PASS | AUTO · fired: j3-moving-pin (24 solids), hardware primitives · bore entry chamfers by rule |
| M4 | PASS | AUTO / HAND · fired: base (1 solid), fasteners (stage 3) · counterbores and countersinks by rule |
| M5 | PASS | AUTO / HAND · fired: hardware primitives · no pockets |
| M6 | PASS | AUTO · edge distance and walls clean |
| M7 | N/A | HAND · no bracket or plate with a loaded corner |
| M8 | PASS | AUTO · fired: j1-dead-axle (28 solids) · thread undercuts by rule |
| M9 | PASS | AUTO / HAND · fired: j1-dead-axle (28 solids) · ISO coarse threads, engagement by rule |
| M10 | PASS | AUTO / HAND · 125 of 125 solids name a material · every solid names a material |
| M11 | PASS | AUTO · fired: j1-dead-axle (28 solids), hardware primitives · turned-part marks by rule |
| M12 | PASS | HAND · every screw reachable from above or below; the eccentric's clamp screws sit under the right rocker, reached with the rocker off; bearings removable once the plates are off |
| M13 | PASS | AUTO / HAND · 47 threaded, 0 without a locking method · every threaded fastener has a locking method |
| M14 | N/A | AUTO / HAND · fired: j4-slot-roller (no solids) · no sliding contact |
| V1 | PASS | AUTO · fired: drive (33 solids) · pancake motor under the base |
| V2 | PASS | AUTO · fired: drive (33 solids) · one-piece bracket |
| V3 | PASS | AUTO / HAND · fired: drive (33 solids) · belt and pulleys clear (clearance 0) |
| V4 | N/A | AUTO · fired: j8-belt (no solids) · crank-and-link drive, no belt |
| V5 | PASS | AUTO · fired: drive (33 solids) · oscillating: motor, short crank and link swing the lever through the modelled range |
| V6 | PASS | AUTO · fired: drive (33 solids) · home flag, fork sensor, leads, terminal block |
| L1 | PASS | STYLE · style only |
| L2 | PASS | HAND · records carry geometry, roles, materials and marks only |
| L3 | PASS | HAND · roles right |
| L4 | PASS | HAND / STYLE · accent on the input only |
| L5 | PASS | AUTO / HAND · fired: see-through · transparency by rule |
| L6 | PASS | AUTO · depth order by the renderer |
| L7 | PASS | STYLE · style only |
| L8 | PASS | AUTO / HAND · centrelines and dimensions automatic; marks are fine lines |
| R1 | PASS | HAND · no inline outlines in the polish |
| R2 | PASS | HAND · threads M3, M4, M5, M6, M8; joint Ø 8, 10; bearings 6800-2RS (10x19x5), F688ZZ (8x16x5), F6800 (10x19x5) · sizes from the series, listed above |
| R3 | PASS | AUTO · fired: hardware primitives · shared subassemblies called, not copied |
| R4 | PASS | AUTO · package 21.3 KB · package built |
| R5 | PASS | HAND · one swing sample in the polish |
| R6 | PASS | FLAG · FLAG: see Verification |
| R7 | PASS | HAND · model.ts + polish.ts 11.1 KB |
| R8 | PASS | AUTO / SITE · site behaviour |
| DL1 | PASS | AUTO / HAND · 48 of 125 solids on a dropping rung · rungs by selectors |
| DL2 | PASS | HAND · model detail full · model detail full |
| DL3 | PASS | AUTO · view-aware exceptions by table |
| DL4 | PASS | SITE · site behaviour |
| DL5 | PASS | FLAG · FLAG: rungs counted in the ladder below |
| Q1 | PASS | check, clamp and edge distance clean |
| Q2 | PASS | 0 clashes |
| Q3 | PASS | package written, 21.3 KB; site build not checked here · package written; site build run in CI |
| Q4 | PASS | local: tools/shot · tools/shot: plan, 28°, side, explode, both sheets, looked at |
| Q5 | PASS | local: tools/bench · tools/bench run, flags noted |
| Q6 | PASS | this sheet |
| Q7 | PASS | tools/conformance |

## Joints
| Joint | Type | F1 locate | F2 retain | F3 torque | F4 thrust | F5 limit | F6 hold | F7 adjust | F8 lube | F9 timing | F10 protect |
|---|---|---|---|---|---|---|---|---|---|---|---|
| pO1 | J2 | 2 x Dowel pin Ø3 x 10 h6, housing to base | 2 x Internal circlip DIN 472, Ø19; Countersunk M5 x 12 (ISO 10642), into the shaft end, flush; Socket head M5 x 10 (ISO 4762), into the shaft end | Feather key 3 x 3 x 6 (DIN 6885) | Wave washer 14.5x18.8, spring steel; Thrust washer 10.2x16, bronze | 2 x Stop bumper, neoprene sleeve Ø12 | – driven by the crank and link, nothing to hold | – the length is set at O2 | – sealed housing bearings, greased for life | Base plate; Left rocker (input) | – no slip clutch needed on a lever drive |
| pO2 | J1 | 2 x Axle, shoulder bolt Ø10 x 30, M8 (ISO 7379), through the base, M8 nyloc underneath | Internal circlip DIN 472, Ø19; Bearing F6800 (10x19x5); External circlip DIN 471, Ø10 | – no keyed part; the rocker turns on bearings | Thrust washer 10.2x13.1, bronze | 2 x Stop bumper, neoprene sleeve Ø12 | – driven, no rest position | Eccentric bushing Ø18, 0.3 mm offset bore Ø10, flanged | – shielded bearings, greased for life; no bridge to carry an oil sink | – no phase to mark at the pivot (the swing scale is on pO1) | – none needed |
| pB1 | J3 | – no removable plate on a moving pin | Internal circlip DIN 472, Ø16; Bearing F688ZZ (8x16x5); head | – no keyed part | – bearing located by its flange and circlip, inner race clamped | – limited by the linkage and the stops at the pivots | – driven, no rest position | – the length is set at the adjustable joint | – shielded bearing, greased for life | – no phase between the links | – none needed |
| pC1 | J3 | – no removable plate on a moving pin | Internal circlip DIN 472, Ø16; Bearing F688ZZ (8x16x5); head | – no keyed part | – bearing located by its flange and circlip, inner race clamped | – limited by the linkage and the stops at the pivots | – driven, no rest position | – the length is set at the adjustable joint | – shielded bearing, greased for life | – no phase between the links | – none needed |
| drive | drive | – bracket screwed up into the base | – set screws on the motor crank hub | – crank clamped on the motor shaft | – motor bearings | – the lever dead centres sit at the ends of the swing | – motor holds when powered | – bracket slots | – dry steel joints, no sliding | – home flag read by the fork sensor | Home flag on the drive crank; 3 x Fork sensor, slotted optical, 5 mm gap |

## Variants and overrides
| Joint or part | Rule result | Chosen | Why |
|---|---|---|---|
| right rocker | layer 0 | raised 2 mm in the model (`dz`), z 2 to 8 | the base follows the lowest part, so the right rocker rises over the O2 eccentric's flange and clamp screws (F7); the left rocker stays low |
| coupler | layer 1, z 10 to 16 | plated 1.7 mm up (`dz`), z 11.7 to 17.7 | clears the circlip that ends the O2 axle under the apex's sweep (A14) |
| rockers | straight stadium | tapered in the model, bosses R13/R9.5 and R12/R9.5 | D1 |
| O2 axle | shoulder bolt with a bridge on two spigoted posts | no bridge; axle stops 1.6 mm over the bearing flange in an external circlip; bearings shielded | the apex sweeps over O2 at the end of the stroke, so nothing fits over it (A11 held at the base, A14) |
| pO2 | dead axle straight in the base | eccentric bushing in the base, two clamp screws (`H.eccentricMount`) | F7: the ground length must meet the model exactly |
| left rocker stops | skipped by the rule (the drive limits the input) | `H.stops` pair 2° outside the swing | F5: with the drive off it would over-travel |
| drive lever | tip radius 6, wall 0.95 mm round the Ø10 bore | tip radius 7, wall 2 mm | M6 |

## Detail ladder
| Rung | Solids | Marks | Frame ms at this dial position |
|---|---|---|---|
| DL-A | 12 | 0 | 2.33 |
| DL-B | 0 | 171 | 1.84 |
| DL-C | 0 | 0 | 1.8 |
| DL-D | 19 | 0 | 1.62 |
| DL-E | 8 | 0 | 1.5 |
| DL-F | 0 | 0 | 1.56 |
| DL-G | 0 | 0 | 1.4 |
| DL-H | 9 | 0 | 1.46 |
| never | 77 | 154 | 2.31 |

## Promotion candidates
- A dead axle whose pivot is swept over by a moving part (here the coupler apex; Whitworth O3, locomotive-drive wheels): the bridge rule does not look at sweeps and the polish drops it by hand. The rule could skip the bridge, keep the circlip end and mark the joint single-ended when a sweep passes over the pivot.
- Shared with Watt and Chebyshev: the drive lever wall (M6), `H.eccentricMount` flange raising the rocker, the F5 input stops and the F9 swing scale.

## Verification
check: clean · clearance: 0 clashes · clamp: clean · edge distance: clean · package: 21.3 KB
screenshots: plan, 28°, side, explode at 28° and 70°, both sheets, looked at (kept outside the repo; attached to the issue by David) · bench: browser, local Chrome on GPU, DPR 1.5, 2026-10-19; plan 2.1 ms, 28° 2.6 ms, side 1.8 ms, explode 2.3 ms at full detail; setup 10 ms; targets met (8 ms desktop)
