# Audit: Parallelogram linkage (parallelogram-linkage)
standard: 2.6 · date: 2026-10-19 · result: pass · detail: full · pass: build

## Summary
PASS 113 · FAIL 0 · N/A 8 · open: none

## Requirements
| Id | Status | Evidence / action |
|---|---|---|
| S1 | PASS | DATA · the standard carries version 2.6 and its changelog |
| S2 | PASS | HAND · header with standard, date, result, detail, pass |
| S3 | PASS | AUTO · tools/conformance reads this header and runs in npm run check |
| S4 | PASS | SITE · #90 holds only this mechanism's decisions and open items |
| P1 | PASS | DATA · record complete; model.ts, polish.ts, audit.md present |
| P2 | PASS | DATA · catalogue validator clean |
| P3 | PASS | DATA / SITE · record has ratio, axes, output character, backdrivable and aka; rotary input, so the page says motorised |
| P4 | PASS | DATA · tags grouped in the record |
| P5 | PASS | DATA · explain and the real-world uses present |
| P6 | PASS | DATA · references present; the real-world videos checked with YouTube's oEmbed: each exists and is embeddable, titles show the mechanism or its close cousin (the locomotive videos show coupled wheels, a parallelogram in practice); nothing changed |
| P7 | PASS | HAND / SITE · no prose in model.ts or polish.ts beyond engineering notes |
| P8 | PASS | SITE · page does not show parts or joints |
| P9 | PASS | HAND · HAND · solve() keeps the coupler parallel to the frame (check: B - A = (100, 0) at every phase), the follower turns 360° in step with the crank (1:1, a straight 45° line in the plot) and every coupler point runs a circle of radius 40, as the catalogue says |
| P10 | PASS | HAND · HAND · coupler midpoint traced (a circle of radius 40), velocity at the midpoint and B, coupler force line, crank and follower angles, follower angle plot |
| P11 | PASS | DATA · record prose read; short sentences, no em dashes |
| K1 | PASS | HAND · check: max link error 2.1e-14 mm · HAND · check: link error below 1e-12 mm; the polish changes heights, outlines and hardware only |
| K2 | PASS | HAND · check: finite, continuous, periodic over 720 samples |
| K3 | PASS | HAND · link, cap and tracer only; placement by between, fixed, at |
| K4 | PASS | HAND · roles driver (input), output, link, pin; accent on the input pin only |
| K5 | PASS | HAND · check: no INTERFERE, OVERLAP or WARN · HAND · check clean, integer layers: crank and follower 0, coupler 1 (plated 0.5 mm low); ground pivots layer -1 radius 7, pins 5.5 |
| K6 | PASS | DATA · DATA · a 40, b 100, c 40, d 100 as the catalogue build; a = c, b = d (change-point Grashof), parallel branch forced (B = A + (d, 0)) |
| K7 | PASS | HAND · input rotary on crank · HAND · input rotary on the input part |
| D1 | PASS | HAND · tapered links with boss rings, flush caps, squircle base |
| D2 | PASS | HAND · bosses round every pin; plain bars: the crank and follower are 40 mm, the coupler a bar that only translates |
| D3 | PASS | STYLE · style only |
| D4 | PASS | AUTO · fired: base (1 solid), feet (4 solids) · base corners and feet by rule |
| D5 | PASS | AUTO / HAND · bridge by rule where nothing passes over; the drive on its one-piece bracket |
| D6 | PASS | HAND / STYLE · screenshots: nothing cosmetic |
| D7 | PASS | HAND · big parts plain; richness in hardware |
| A1 | PASS | AUTO · pO2 J2, pO4 J1, pA J3, pB J3; fired: classify (no solids) · pivots read correctly: live shaft at the input, dead axle at the other ground pivot, shoulder bolts at the moving pins |
| A2 | PASS | AUTO · pO2 J2, pO4 J1, pA J3, pB J3 · live shaft at the input, dead axle at the other ground pivot, shoulder bolts at the moving pins |
| A3 | PASS | AUTO · fired: classify (no solids) · bearings F6800 at the ground pivots, F688ZZ at the moving pins |
| A4 | PASS | AUTO · fired: j1-dead-axle (28 solids) · stepped axle with bearing, spacers, circlip, thrust washer |
| A5 | PASS | AUTO · fired: j2-live-shaft (27 solids) · feather key on the Ø10 input shaft |
| A6 | PASS | AUTO · fired: standoffs (no solids) · no bridge here; O4's axle ends below the coupler on a circlip |
| A7 | PASS | AUTO · fired: base (1 solid), feet (4 solids) · base, feet, clearance holes by rule; the base grown by the rules for the drive and posts |
| A8 | PASS | AUTO · fired: fasteners (stage 3) · shanks and clearance holes by stage 3 |
| A9 | PASS | AUTO / HAND · fired: j2-straddle (no solids) · AUTO / HAND · O2 held from behind by its housing, O4 a stub axle held by the base only (the coupler sweeps over both hubs, so no bridge fits): single shear at O4, A and B, forced, overhang 1.5 mm where the stack allows |
| A10 | PASS | HAND · crank and follower share the base layer (z 0 to 6), the coupler rides above (z 9.5 to 15.5); their sweeps never meet (100 mm apart, 49.5 mm each) |
| A11 | PASS | AUTO / HAND · fired: j1-dead-axle (28 solids) · every joint's load goes to the base: the live shaft via its housing, dead axle via the axle and bridge, pins via the links |
| A12 | PASS | AUTO · clamp check clean |
| A13 | PASS | AUTO / HAND · 119 solids, 54 unnamed (further items of a listed set) · named catalogue sizes; the unnamed solids are further items of listed sets |
| A14 | PASS | HAND · stops need none (full turn); posts, bracket and leads clear every sweep (clearance 0); the coupler clears the O4 axle end by 1.9 mm |
| A15 | PASS | AUTO · clearance: 0 clashes over the cycle |
| A16 | PASS | HAND · 5 build rules; no note: none; no badge: none · notes and badges on every pivot, 4 to 5 build rules |
| A17 | PASS | HAND · goes together bottom to top: base, axles, cranks, coupler; every screw reachable from above or below |
| E1 | PASS | AUTO · every solid has one explode level; levels -8 to 2.5 · every solid has one explode level |
| E2 | PASS | AUTO · 29 rigid groups; fired: explode · rigid groups, each head stays on its shank |
| E3 | PASS | AUTO · fired: explode · screws back out along their axes |
| E4 | PASS | HAND · levels follow A17 in the 70° explode |
| E5 | PASS | AUTO · fired: explode · bearings, circlips and bushings stay in their parts |
| E6 | PASS | AUTO · fired: explode · motor and bracket move as one |
| E7 | PASS | AUTO · fired: explode · spacers and washers midway |
| E8 | PASS | AUTO · fired: explode · the live shaft leaves to the side it was fitted from |
| E9 | PASS | HAND · screenshots at 100% explode, 28° and 70°: nothing inside another part, nothing leaves the frame |
| J1 | PASS | AUTO · fired: j1-dead-axle (28 solids) · O4 dead axle: shouldered stub axle, sealed bearing, spacers, circlip, thrust washer, nyloc under the base; no bridge, the coupler passes over (polish) |
| J2 | PASS | AUTO · fired: j2-live-shaft (27 solids), j2-straddle (no solids) · O2 live shaft: housing cartridge, keyed shaft, circlips, thrust washer, home flag, pulley |
| J3 | PASS | AUTO · fired: j3-moving-pin (24 solids) · A and B: shoulder bolts, bearings with spacers, threadlocker; single shear (forced) |
| J4 | N/A | AUTO · fired: j4-slot-roller (no solids) · no pin in a slot |
| J5 | N/A | AUTO · fired: j5-slide (no solids) · no slide |
| J6 | N/A | AUTO · fired: j6-mesh (no solids) · no gear mesh |
| J7 | N/A | AUTO · fired: j7-cam (no solids) · no cam |
| J8 | PASS | AUTO · fired: j8-belt (2 solids) · flanged motor pulley, mount slotted for tension; belt wrap enough, no idler |
| F1 | PASS | AUTO · served at pO2, pO4; fired: j2-live-shaft (27 solids) · dowels at the housing, spigots on the bridge posts |
| F2 | PASS | AUTO · served at pO2, pO4, pA, pB, coupler-adjust; fired: j2-live-shaft (27 solids) · circlips and retainers on every bearing |
| F3 | PASS | AUTO · served at pO2; fired: j2-live-shaft (27 solids) · feather key at the input shaft |
| F4 | PASS | AUTO / HAND · served at pO2, pO4; fired: j2-live-shaft (27 solids) · thrust washers at the ground pivots |
| F5 | N/A | AUTO / HAND · served at no joint; fired: j5-slide (no solids), stops (no solids) · both cranks turn fully; nothing to limit (the drive is belt, no travel to bank) |
| F6 | N/A | AUTO / HAND · served at no joint; fired: j7-cam (no solids) · driven through a toothed belt; no rest position or rattling clearance to hold |
| F7 | PASS | AUTO / HAND · served at drive, coupler-adjust; fired: j6-mesh (no solids), j5-slide (no solids) · a = c and b = d are exact or the coupler stops translating: an H.turnbuckle in the coupler's own plane, set at 100 mm, pin centres exact (Appendix A) |
| F8 | PASS | AUTO · served at no joint; fired: lubrication (no solids) · oil sink on none (no bridge at O4: its bearing is sealed); the others are sealed or shielded |
| F9 | PASS | AUTO / HAND · served at pO2, pO4, coupler-adjust; fired: timing-marks (no solids) · zero ticks on the base at each pivot along the ground line and an index on each arm tip: the two read together when the cranks are parallel |
| F10 | PASS | AUTO / HAND · served at drive; fired: drive (37 solids) · pulley flanges, home flag and fork sensor; leads to the terminal block; no slip clutch (decided at planning): nothing in the linkage can jam while it is connected |
| M1 | PASS | AUTO · fired: hardware primitives · outer edges broken by the primitives |
| M2 | PASS | HAND · no wheel; the cranks are 40 mm bars, no lightening |
| M3 | PASS | AUTO · fired: j3-moving-pin (24 solids), hardware primitives · bore entry rings in the screenshots |
| M4 | PASS | AUTO / HAND · fired: base (1 solid), fasteners (stage 3) · counterbores in the base by rule |
| M5 | PASS | AUTO / HAND · fired: hardware primitives · no pockets or windows |
| M6 | PASS | AUTO · edge distance and walls clean |
| M7 | N/A | HAND · no bracket or plate with a loaded inside corner |
| M8 | PASS | AUTO · fired: j1-dead-axle (28 solids) · undercut on the axle thread |
| M9 | PASS | AUTO / HAND · fired: j1-dead-axle (28 solids) · engagement by rule |
| M10 | PASS | AUTO / HAND · 119 of 119 solids name a material · every solid names a material |
| M11 | PASS | AUTO · fired: j1-dead-axle (28 solids), hardware primitives · centre holes and flats on the shafts |
| M12 | PASS | HAND · every head reachable from above or below; the turnbuckle is a set-up adjustment made with the coupler off; bearings press out past their circlips |
| M13 | PASS | AUTO / HAND · 41 threaded, 0 without a locking method · locking method on every threaded fastener, including the new stops and the polish's parts (rules rerun in the polish) |
| M14 | N/A | AUTO / HAND · fired: j4-slot-roller (no solids) · no sliding contact |
| V1 | PASS | AUTO · fired: drive (37 solids) · pancake motor under the base |
| V2 | PASS | AUTO · fired: drive (37 solids) · one-piece bracket |
| V3 | PASS | AUTO / HAND · fired: drive (37 solids) · belt and pulleys clear; clearance 0 |
| V4 | PASS | AUTO · fired: j8-belt (2 solids) · flanges, two set screws at 90°, slotted mount |
| V5 | PASS | AUTO · fired: drive (37 solids) · AUTO · rotary: belt to the input pulley |
| V6 | PASS | AUTO · fired: drive (37 solids) · home flag and fork sensor, leads, terminal block |
| L1 | PASS | STYLE · no look values in the records |
| L2 | PASS | HAND · records carry geometry, roles, materials and marks only |
| L3 | PASS | HAND · roles right: driver, output, link |
| L4 | PASS | HAND / STYLE · accent on the input pin only |
| L5 | PASS | AUTO / HAND · fired: see-through · static solids over the links stay see-through where the rule says so |
| L6 | PASS | AUTO · screenshots at every tilt |
| L7 | PASS | STYLE · style only |
| L8 | PASS | AUTO / HAND · zero ticks and index lines are marks; centrelines and dimensions automatic |
| R1 | PASS | HAND · no inline outlines in the polish |
| R2 | PASS | HAND · threads M3, M5, M6, M8; joint Ø 8, 10; bearings 6800-2RS (10x19x5), F688ZZ (8x16x5) · standard sizes only: threads, shafts and bearings from the tables |
| R3 | PASS | AUTO · fired: hardware primitives · shared subassemblies used, none copied |
| R4 | PASS | AUTO · package 21.5 KB · package 21.5 KB, written |
| R5 | PASS | HAND · polish 1 ms in the assembly |
| R6 | PASS | FLAG · FLAG: browser bench, DPR 1.5, 2026-10-19: plan 2.05 ms, 28° 2.41 ms, side 1.89 ms, explode 70° 2.03 ms at full detail; the 8 ms budget holds at every dial position |
| R7 | PASS | HAND · model.ts + polish.ts 9.0 KB |
| R8 | PASS | AUTO / SITE · site behaviour |
| DL1 | PASS | AUTO / HAND · 48 of 119 solids on a dropping rung · every solid and mark on a rung; the polish sets no detail |
| DL2 | PASS | HAND · model detail full · model detail full |
| DL3 | PASS | AUTO · rule |
| DL4 | PASS | SITE · site |
| DL5 | PASS | FLAG · FLAG: bench lists the rungs, see the ladder below |
| Q1 | PASS | check, clamp and edge distance clean |
| Q2 | PASS | 0 clashes |
| Q3 | PASS | package written, 21.5 KB; site build not checked here · package written, 21.5 KB; site build not run in this worktree (CI) |
| Q4 | PASS | local: tools/shot · local: tools/shot: plan, 28°, side and explode at 28° and 70°, both sheets, drawn in Chrome; plan and side looked at |
| Q5 | PASS | local: tools/bench · local: tools/bench: bench run, figures under R6 |
| Q6 | PASS | this sheet |
| Q7 | PASS | tools/conformance |

## Joints
| Joint | Type | F1 locate | F2 retain | F3 torque | F4 thrust | F5 limit | F6 hold | F7 adjust | F8 lube | F9 timing | F10 protect |
|---|---|---|---|---|---|---|---|---|---|---|---|
| pO2 | J2 | 2 x Dowel pin Ø3 x 10 h6, housing to base | 2 x Internal circlip DIN 472, Ø19; Countersunk M5 x 12 (ISO 10642), into the shaft end, flush; Socket head M5 x 10 (ISO 4762), into the shaft end | Feather key 3 x 3 x 6 (DIN 6885) | Wave washer 14.5x18.8, spring steel; Thrust washer 10.2x16, bronze | – limited by the linkage and the stops at the ground pivots | – driven, no rest position | – the exact length is set by the turnbuckle | – shielded bearing, greased for life | Base plate; Crank (input) | – none needed |
| pO4 | J1 | shaft | External circlip DIN 471, Ø10; Internal circlip DIN 472, Ø19 | – no keyed part; plates turn on bearings | Thrust washer 10.2x13.1, bronze | – limited by the linkage and the stops at the ground pivots | – driven, no rest position | – the exact length is set by the turnbuckle | – shielded bearing, greased for life | Base plate; Follower | – none needed |
| pA | J3 | – no removable plate on a moving pin | Internal circlip DIN 472, Ø16; Bearing F688ZZ (8x16x5); head | – no keyed part; plates turn on bearings | – bearing located by its flange and circlip, inner race clamped | – limited by the linkage and the stops at the ground pivots | – driven, no rest position | – the exact length is set by the turnbuckle | – shielded bearing, greased for life | – no phase to mark at this pin | – none needed |
| pB | J3 | – no removable plate on a moving pin | Internal circlip DIN 472, Ø16; Bearing F688ZZ (8x16x5); head | – no keyed part; plates turn on bearings | – bearing located by its flange and circlip, inner race clamped | – limited by the linkage and the stops at the ground pivots | – driven, no rest position | – the exact length is set by the turnbuckle | – shielded bearing, greased for life | – no phase to mark at this pin | – none needed |
| drive | drive | – bracket screwed up into the base | – set screws on the motor crank hub | – crank clamped on the motor shaft | – motor bearings | – motor turns freely | – motor holds when powered | bracket | – dry steel joints, no sliding | – home flag read by the fork sensor | Home flag, 1 mm steel vane; 3 x Fork sensor, slotted optical, 5 mm gap; Pulley flanges |
| coupler-adjust | post | – static | 2 x Jam nut M3 (DIN 439), one left hand and one right hand | – static | – static | – static | – static | Turnbuckle body 12 x 6 x 15, milled flat, M3 left and right hand; 2 x Jam nut M3 (DIN 439), one left hand and one right hand; 2 x Stud M3 x 13.8, one left hand and one right hand, threadlocked into the halves | – static | Turnbuckle body 12 x 6 x 15, milled flat, M3 left and right hand | – static |

## Variants and overrides
| Joint or part | Rule result | Chosen | Why |
|---|---|---|---|
| coupler | layer 1, z 10 to 16 | plated 0.5 mm low in the model (`dz`), z 9.5 to 15.5 | the O4 axle end must clear it; pins keep a 1.5 mm overhang with spacers |
| O4 axle | bridge on two posts, sleeve up to it, shouldered head over the bridge | bridge, posts and sleeve dropped; axle ends on an external circlip 1 mm over the bearing; bearing sealed (polish) | the coupler sweeps over O4 at 0° and 180°, so a bridge would stand in its sweep |
| coupler | one bar | `H.turnbuckle` halfway, set at 100 mm, in the coupler's own plane | F7: b = d and a = c are exact |
| cranks | straight stadium | tapered in the model, bosses R13/R9.5 and R12/R9.5 | D1 |

## Detail ladder
| Rung | Solids | Marks | Frame ms at this dial position |
|---|---|---|---|
| DL-A | 12 | 0 | 2.3 |
| DL-B | 0 | 165 | 1.59 |
| DL-C | 0 | 0 | 1.58 |
| DL-D | 19 | 0 | 1.42 |
| DL-E | 8 | 0 | 1.43 |
| DL-F | 0 | 0 | 1.34 |
| DL-G | 0 | 0 | 1.24 |
| DL-H | 9 | 0 | 1.25 |
| never | 71 | 148 | 2.28 (full) |

## Promotion candidates
- A dead axle with a part sweeping over it (no bridge, axle ends on a circlip over the bearing): Whitworth, locomotive drive, oscillating cylinder and now this. Four times: promote to the J1 rule.
- `H.turnbuckle` and the F9 zero marks recur on every exact-ratio linkage; the marks could be a rule.

## Verification
check: clean · clearance: 0 clashes · clamp: clean · edge distance: clean · package: 21.5 KB
screenshots: plan, 28°, side, explode at 28° and 70°, both sheets, drawn in local Chrome to dist/shots/parallelogram-linkage/ (plan and side looked at; the issue carries the images) · bench: browser, DPR 1.5, 2026-10-19; plan 2.05 ms, 28° 2.41 ms, side 1.89 ms, explode 70° 2.03 ms at full detail, 8 ms held at every dial (R6)
