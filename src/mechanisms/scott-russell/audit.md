# Audit: Scott Russell linkage (scott-russell)
standard: 2.6 · date: 2026-10-19 · result: pass · detail: full · pass: build

## Summary
PASS 112 · FAIL 0 · N/A 9 · open: none

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
| P9 | PASS | HAND · explain matches solve(): P runs y 31.2 to 98.0 on x 0 exactly while B runs x 95 to 20 (measured) |
| P10 | PASS | HAND · paths (first with the comet), vel, forces, angles, plot declared and drawn |
| P11 | PASS | DATA · record prose read; short sentences, no em dashes |
| K1 | PASS | HAND · check: max link error 2.8e-14 mm · link error ~0; plating and hardware never move a centre |
| K2 | PASS | HAND · check: finite, continuous, periodic over 720 samples |
| K3 | PASS | HAND · link, plate, cap and tracer only; placement by between, fixed, at |
| K4 | PASS | HAND · roles driver, output, link, pin, trace; accent on the input pin only |
| K5 | PASS | HAND · check: no INTERFERE, OVERLAP or WARN · layers: slider and rails 0, crank 1, beam 2; ground pivot layer -1 radius 7, moving pins 5.5; no INTERFERE, OVERLAP or WARN |
| K6 | PASS | DATA · a 50, beam 2a 100, slider x 95 to 20 (φ 18° to 78°) as the catalogue build; the slider is 22 mm long so it clears the ground axle at the near end |
| K7 | PASS | HAND · input linear on slider · input linear on slider; drive is the belt loop with a carriage |
| D1 | PASS | HAND · tapered links with boss rings, flush caps, squircle base |
| D2 | PASS | HAND · bosses round every pin; crank and beam are plain bars, no window |
| D3 | PASS | STYLE · style only |
| D4 | PASS | AUTO · fired: base (1 solid), feet (3 solids) · base corners and feet by rule |
| D5 | PASS | AUTO / HAND · bridge over the ground axle on two spigoted posts; rails on ground risers |
| D6 | PASS | HAND / STYLE · screenshots: nothing cosmetic |
| D7 | PASS | HAND · big parts plain; richness in the hardware |
| A1 | PASS | AUTO · pO J1, pM J3, pB J3, slide-slider J5; fired: classify (no solids) · joint types read correctly from the model |
| A2 | PASS | AUTO · pO J1, pM J3, pB J3, slide-slider J5 · dead axle at O, shoulder bolts at M and B, slide at the slider |
| A3 | PASS | AUTO · fired: classify (no solids) · catalogue bearings and spacers by rule |
| A4 | PASS | AUTO · fired: j1-dead-axle (28 solids) · stepped shafts by rule |
| A5 | N/A | AUTO · fired: j2-live-shaft (no solids) · no keyed part: the input is a slider |
| A6 | PASS | AUTO · fired: standoffs (12 solids) · the track rails sit on risers screwed down into the base, the reference rail dowelled |
| A7 | PASS | AUTO · fired: base (1 solid), feet (3 solids) · base, feet, scale and clearance hole by rule |
| A8 | PASS | AUTO · fired: fasteners (stage 3) · stage 3 fasteners fired |
| A9 | PASS | AUTO / HAND · fired: j2-straddle (no solids) · O held by the base below and the bridge above (both ends); M and B single shear, forced: the beam crosses over the crank and swings over the slider, so nothing fits above |
| A10 | PASS | HAND · slider and rails share layer 0; the crank sweeps over the rails so it sits on layer 1, the beam on layer 2; nothing is stacked only to clear something |
| A11 | PASS | AUTO / HAND · fired: j1-dead-axle (28 solids) · O via axle and bridge into the base, M and B via the bars, the slider via the track rails and keeper into the base |
| A12 | PASS | AUTO · clamp check clean |
| A13 | PASS | AUTO / HAND · 133 solids, 62 unnamed (further items of a listed set) · named catalogue hardware; unnamed items are further parts of a listed set |
| A14 | PASS | HAND · bridge posts, stops and the idler clear of every sweep (clearance 0); the idler is stepped out along the track clear of the O nut |
| A15 | PASS | AUTO · clearance: 0 clashes over the cycle |
| A16 | PASS | HAND · 5 build rules; no note: none; no badge: none · joint notes, badges and 5 build rules |
| A17 | PASS | HAND · goes together bottom to top: base, rails, slider, axle, crank, beam, bridge; every screw reachable from above or below |
| E1 | PASS | AUTO · every solid has one explode level; levels -8 to 3.5 · one level per solid |
| E2 | PASS | AUTO · 32 rigid groups; fired: explode · fastener groups rigid |
| E3 | PASS | AUTO · fired: explode · screws leave to the head side |
| E4 | PASS | HAND · levels follow A17 |
| E5 | PASS | AUTO · fired: explode · bearings and clips stay with their part |
| E6 | PASS | AUTO · fired: explode · motor and bracket move as one |
| E7 | PASS | AUTO · fired: explode · spacers sit midway |
| E8 | N/A | AUTO · fired: explode · no keyed parts stacked on one shaft |
| E9 | PASS | HAND · explode looked at in the screenshots |
| J1 | PASS | AUTO · fired: j1-dead-axle (28 solids) · dead axles built by rule |
| J2 | N/A | AUTO · fired: j2-live-shaft (no solids), j2-straddle (no solids) · no live shaft: the input is a slider on a track |
| J3 | PASS | AUTO · fired: j3-moving-pin (24 solids) · shoulder bolts at the moving pins |
| J4 | N/A | AUTO · fired: j4-slot-roller (no solids) · no pin in a slot |
| J5 | PASS | AUTO · fired: j5-slide (13 solids) · one reference rail, a gib strip clamped under the keeper, wipers, nipple, an end stop block at each end of the travel |
| J6 | N/A | AUTO · fired: j6-mesh (no solids) · no gear mesh |
| J7 | N/A | AUTO · fired: j7-cam (no solids) · no cam |
| J8 | PASS | AUTO · fired: j8-belt (2 solids) · belt loop under the base with a slotted tensioner arm on the idler |
| F1 | PASS | AUTO · served at pO, pO-bridge-post, railb-seat; fired: j2-live-shaft (no solids) · spigots and dowels at the O bridge; the reference rail dowelled |
| F2 | PASS | AUTO · served at pO, pM, pB, slide-slider, crank-adjust; fired: j2-live-shaft (no solids) · circlips and retainers on every bearing |
| F3 | N/A | AUTO · served at no joint; fired: j2-live-shaft (no solids) · no keyed part |
| F4 | PASS | AUTO / HAND · served at pO; fired: j2-live-shaft (no solids) · bronze thrust washer at O |
| F5 | PASS | AUTO / HAND · served at pO, slide-slider; fired: j5-slide (13 solids), stops (3 solids) · end stop blocks with pads just past each end of the slider's travel (rule); a stop bumper by the O axle |
| F6 | N/A | AUTO / HAND · served at no joint; fired: j7-cam (no solids) · driven through the drive link; no rest position to hold |
| F7 | PASS | AUTO / HAND · served at slide-slider, drive, crank-adjust; fired: j6-mesh (no solids), j5-slide (13 solids) · crank made adjustable by H.turnbuckle at its set point (O to M = half the beam, Appendix A); gib clamped under the keeper and the belt tensioner arm adjust the slide and the belt; centres exact |
| F8 | PASS | AUTO · served at pO, slide-slider; fired: lubrication (no solids) · wipers and a grease nipple on the slide; bearings shielded, oil sink on the O bridge |
| F9 | PASS | AUTO / HAND · served at crank-adjust; fired: timing-marks (no solids) · stroke scale on the base with an index on the slider, beam end height scale beside its line |
| F10 | PASS | AUTO / HAND · served at drive; fired: drive (35 solids) · pulley flanges, home flag, fork sensor, leads |
| M1 | PASS | AUTO · fired: hardware primitives · outer edges chamfered by rule |
| M2 | PASS | HAND · no wheel; short bars need no lightening |
| M3 | PASS | AUTO · fired: j3-moving-pin (24 solids), hardware primitives · bore entry chamfers by rule |
| M4 | PASS | AUTO / HAND · fired: base (1 solid), fasteners (stage 3) · counterbores and countersinks by rule |
| M5 | PASS | AUTO / HAND · fired: hardware primitives · no pockets |
| M6 | PASS | AUTO · edge distance and walls clean |
| M7 | N/A | HAND · no bracket or plate with a loaded corner |
| M8 | PASS | AUTO · fired: j1-dead-axle (28 solids) · thread undercuts by rule |
| M9 | PASS | AUTO / HAND · fired: j1-dead-axle (28 solids) · ISO coarse threads, engagement by rule |
| M10 | PASS | AUTO / HAND · 133 of 133 solids name a material · every solid names a material |
| M11 | PASS | AUTO · fired: j1-dead-axle (28 solids), hardware primitives · turned-part marks by rule |
| M12 | PASS | HAND · every screw reachable from above or below; the turnbuckle's jam nuts reached from above with the beam off; bearings removable once the bars are off |
| M13 | PASS | AUTO / HAND · 53 threaded, 0 without a locking method · every threaded fastener has a locking method |
| M14 | PASS | AUTO / HAND · fired: j4-slot-roller (no solids) · the gib strip and the rails are the replaceable wear parts of the slide |
| V1 | PASS | AUTO · fired: drive (35 solids) · pancake motor under the base |
| V2 | PASS | AUTO · fired: drive (35 solids) · one-piece bracket |
| V3 | PASS | AUTO / HAND · fired: drive (35 solids) · belt and pulleys clear (clearance 0) |
| V4 | PASS | AUTO · fired: j8-belt (2 solids) · pulley flanges, slotted tensioner arm on the idler |
| V5 | PASS | AUTO · fired: drive (35 solids) · linear: belt loop along the stroke with a carriage clamped to the slider, tensioner on the far pulley |
| V6 | PASS | AUTO · fired: drive (35 solids) · home flag, fork sensor, leads, terminal block |
| L1 | PASS | STYLE · style only |
| L2 | PASS | HAND · records carry geometry, roles, materials and marks only |
| L3 | PASS | HAND · roles right |
| L4 | PASS | HAND / STYLE · accent on the input only |
| L5 | PASS | AUTO / HAND · fired: see-through · transparency by rule |
| L6 | PASS | AUTO · depth order by the renderer |
| L7 | PASS | STYLE · style only |
| L8 | PASS | AUTO / HAND · centrelines and dimensions automatic; marks are fine lines |
| R1 | PASS | HAND · no inline outlines in the polish |
| R2 | PASS | HAND · threads M3, M4, M5, M6; joint Ø 8; bearings F688ZZ (8x16x5), F688 (8x16x5) · sizes from the series, listed above |
| R3 | PASS | AUTO · fired: hardware primitives · shared subassemblies called, not copied |
| R4 | PASS | AUTO · package 19.5 KB · package built |
| R5 | PASS | HAND · no sampling in the polish |
| R6 | PASS | FLAG · FLAG: see Verification |
| R7 | PASS | HAND · model.ts + polish.ts 6.5 KB |
| R8 | PASS | AUTO / SITE · site behaviour |
| DL1 | PASS | AUTO / HAND · 47 of 133 solids on a dropping rung · rungs by selectors |
| DL2 | PASS | HAND · model detail full · model detail full |
| DL3 | PASS | AUTO · view-aware exceptions by table |
| DL4 | PASS | SITE · site behaviour |
| DL5 | PASS | FLAG · FLAG: rungs counted in the ladder below |
| Q1 | PASS | check, clamp and edge distance clean |
| Q2 | PASS | 0 clashes |
| Q3 | PASS | package written, 19.5 KB; site build not checked here · package written; site build run in CI |
| Q4 | PASS | local: tools/shot · tools/shot: plan, 28°, side, explode, both sheets, looked at |
| Q5 | PASS | local: tools/bench · tools/bench run, flags noted |
| Q6 | PASS | this sheet |
| Q7 | PASS | tools/conformance |

## Joints
| Joint | Type | F1 locate | F2 retain | F3 torque | F4 thrust | F5 limit | F6 hold | F7 adjust | F8 lube | F9 timing | F10 protect |
|---|---|---|---|---|---|---|---|---|---|---|---|
| pO | J1 | 2 x spigot | Internal circlip DIN 472, Ø16; Bearing F688 (8x16x5) | – no keyed part; the crank turns on a bearing | Thrust washer 8.2x10.8, bronze | Stop bumper, neoprene sleeve Ø12 | – driven, no rest position | – the crank length is set at its turnbuckle | Bridge over the pivot, on two spigoted posts | – no phase to mark at the pivot | – none needed |
| pM | J3 | – no removable plate on a moving pin | Internal circlip DIN 472, Ø16; Bearing F688ZZ (8x16x5); head | – no keyed part | – bearing located by its flange and circlip, inner race clamped | – limited by the linkage and the stops at the pivots | – driven, no rest position | – the length is set at the adjustable joint | – shielded bearing, greased for life | – no phase between the links | – none needed |
| pB | J3 | – no removable plate on a moving pin | Internal circlip DIN 472, Ø16; Bearing F688ZZ (8x16x5); head | – no keyed part | – bearing located by its flange and circlip, inner race clamped | – limited by the linkage and the stops at the pivots | – driven, no rest position | – the length is set at the adjustable joint | – shielded bearing, greased for life | – no phase between the links | – none needed |
| slide-slider | J5 | – the reference rail dowelled (railb-seat) | Keeper plate, holds the slider down | – no rotating part | – sliding faces: bronze gib and hardened rails | 2 x End stop block, hardened | – the belt holds it when powered | Gib strip 105 x 7 x 2.3, bronze, slotted, clamped under the keeper | 2 x wiper; Grease nipple M6 (DIN 71412) | – the stroke scale is on the base | – none needed |
| pO-bridge-post | post | 2 x spigot | – static | – static | – static | – static | – static | – static | – static | – static | – static |
| raila-seat | post | – static | – static | – static | – static | – static | – static | – static | – static | – static | – static |
| railb-seat | post | 2 x Dowel pin Ø3 h6 (ISO 8734), rail to base | – static | – static | – static | – static | – static | – static | – static | – static | – static |
| drive | drive | – bracket screwed up into the base | – set screws on the motor pulley hub | – pulley clamped on the motor shaft | – motor bearings | – end stops just past the travel | – motor holds when powered | Tensioner arm, slotted, 2 x M4 | – dry steel joints, no sliding | – home flag on the carriage, read by the fork sensor | Home flag, 1 mm steel vane; 3 x Fork sensor, slotted optical, 5 mm gap; Pulley flanges |
| crank-adjust | post | – static | 2 x Jam nut M3 (DIN 439), one left hand and one right hand | – static | – static | – static | – static | Turnbuckle body 12 x 6 x 15, milled flat, M3 left and right hand; 2 x Jam nut M3 (DIN 439), one left hand and one right hand; 2 x Stud M3 x 13.8, one left hand and one right hand, threadlocked into the halves | – static | Turnbuckle body 12 x 6 x 15, milled flat, M3 left and right hand | – static |

## Variants and overrides
| Joint or part | Rule result | Chosen | Why |
|---|---|---|---|
| slider | first try: 36 mm long | 22 mm long, 20 mm across | the slider comes within 9 mm of the ground axle at the near end of the stroke (K5) |
| crank | one bar, layer 0 | layer 1, over the track and the slider | the crank sweeps over the rails (K5) |
| crank | one bar | cut in two halves joined by `H.turnbuckle` at its midpoint | F7: the exact length equality |
| belt idler | at the slider's end of the stroke less 12 mm, on the axis | stepped out along the track until clear of the O axle and nut (`drive.ts`, rule) | the pivot sits on the track axis; the idler met its nut (shared code, see below) |
| end stops | – | by the rule only | the rule's end stop blocks at the slide serve F5; nothing added by hand |

## Detail ladder
| Rung | Solids | Marks | Frame ms at this dial position |
|---|---|---|---|
| DL-A | 8 | 0 | 2.24 |
| DL-B | 0 | 136 | 1.71 |
| DL-C | 0 | 0 | 1.66 |
| DL-D | 14 | 0 | 1.65 |
| DL-E | 11 | 2 | 1.55 |
| DL-F | 0 | 0 | 1.64 |
| DL-G | 0 | 0 | 1.42 |
| DL-H | 14 | 0 | 1.29 |
| never | 86 | 125 | 2.4 |

## Promotion candidates
- `H.drive` linear put the idler on the slide axis a fixed 12 mm past the slider's near end, so a ground pivot on the track axis (here O) met it. The loop now steps the idler out along the axis until it is clear.

## Verification
check: clean · clearance: 0 clashes · clamp: clean · edge distance: clean · package: 19.5 KB
screenshots: plan, 28°, side, explode at 28° and 70°, both sheets, looked at (kept outside the repo; attached to the issue by David) · bench: browser, local Chrome on GPU, DPR 1.5, 2026-10-19; plan 2.1 ms, 28° 2.7 ms, side 1.9 ms, explode 2.2 ms at full detail; setup 7 ms; targets met (8 ms desktop)
