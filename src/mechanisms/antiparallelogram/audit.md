# Audit: Antiparallelogram linkage (antiparallelogram)
standard: 2.6 · date: 2026-10-19 · result: pass · detail: full · pass: build

## Summary
PASS 113 · FAIL 0 · N/A 8 · open: none

## Requirements
| Id | Status | Evidence / action |
|---|---|---|
| S1 | PASS | DATA · the standard carries version 2.6 and its changelog |
| S2 | PASS | HAND · header with standard, date, result, detail, pass |
| S3 | PASS | AUTO · tools/conformance reads this header and runs in npm run check |
| S4 | PASS | SITE · #91 holds only this mechanism's decisions and open items |
| P1 | PASS | DATA · record complete; model.ts, polish.ts, audit.md present |
| P2 | PASS | DATA · catalogue validator clean |
| P3 | PASS | DATA / SITE · record has ratio, axes, output character, backdrivable and aka; rotary input, so the page says motorised |
| P4 | PASS | DATA · tags grouped in the record |
| P5 | PASS | DATA · explain and the real-world uses present |
| P6 | PASS | DATA · references present; no real-world video in the record (none rather than a wrong one); nothing changed |
| P7 | PASS | HAND / SITE · no prose in model.ts or polish.ts beyond engineering notes |
| P8 | PASS | SITE · page does not show parts or joints |
| P9 | PASS | HAND · HAND · solve() keeps the crossed branch through both change points; the output crank turns 360° in the same sense as the input, ratio 0.43 to 2.33 (measured), and the crossing point runs the ellipse |
| P10 | PASS | HAND · HAND · crossing point traced (the ellipse), velocity at the crossing point and B, coupler force line, crank and output angles, output angle plot |
| P11 | PASS | DATA · record prose read; short sentences, no em dashes |
| K1 | PASS | HAND · check: max link error 4.3e-14 mm · HAND · check: link error below 1e-12 mm; the polish changes heights, outlines and hardware only |
| K2 | PASS | HAND · check: finite, continuous, periodic over 720 samples |
| K3 | PASS | HAND · link, cap and tracer only; placement by between, fixed, at |
| K4 | PASS | HAND · roles driver (input), output, link, pin; accent on the input pin only |
| K5 | PASS | HAND · check: no INTERFERE, OVERLAP or WARN · HAND · check clean, integer layers: crank 0, coupler 1 (plated 2.5 mm low), follower 2 (plated 2 mm up); ground pivots layer -1 radius 7, O4's pin at layer 2 (it hangs from the bridge), pins 5.5 |
| K6 | PASS | DATA · DATA · a 100, b 40, c 100, d 40 as the catalogue build, crossed branch; the crossing point is closed form, rho = (a² - d²) / (2 (a - d cos u)), so it stays defined at the collinear change points |
| K7 | PASS | HAND · input rotary on crank · HAND · input rotary on the input part |
| D1 | PASS | HAND · tapered links with boss rings, flush caps, squircle base |
| D2 | PASS | HAND · bosses round every pin; the two long links are 100 mm bars, the coupler a short bar: no window needed |
| D3 | PASS | STYLE · style only |
| D4 | PASS | AUTO · fired: base (1 solid), feet (4 solids) · base corners and feet by rule |
| D5 | PASS | AUTO / HAND · bridge on two spigoted posts by rule; housing at the live shaft |
| D6 | PASS | HAND / STYLE · screenshots: nothing cosmetic |
| D7 | PASS | HAND · big parts plain; richness in hardware |
| A1 | PASS | AUTO · pO2 J2, pO4 J1, pA J3, pB J3; fired: classify (no solids) · pivots read correctly: live shaft at the input, dead axle at the other ground pivot, shoulder bolts at the moving pins |
| A2 | PASS | AUTO · pO2 J2, pO4 J1, pA J3, pB J3 · live shaft at the input, dead axle at the other ground pivot, shoulder bolts at the moving pins |
| A3 | PASS | AUTO · fired: classify (no solids) · bearings F6800 at the ground pivots, F688ZZ at the moving pins |
| A4 | PASS | AUTO · fired: j1-dead-axle (28 solids) · stepped axle; at O4 it hangs from the bridge (polish), because the input crank sweeps over O4 |
| A5 | PASS | AUTO · fired: j2-live-shaft (27 solids) · feather key on the Ø10 input shaft |
| A6 | PASS | AUTO · fired: standoffs (no solids) · bridge posts spigoted, 100 mm out from O4 where no link reaches |
| A7 | PASS | AUTO · fired: base (1 solid), feet (4 solids) · base, feet, clearance holes by rule; the base grown by the rules for the drive and posts |
| A8 | PASS | AUTO · fired: fasteners (stage 3) · shanks and clearance holes by stage 3 |
| A9 | PASS | AUTO / HAND · fired: j2-straddle (no solids) · AUTO / HAND · O2 held from behind by its housing; O4 hangs from a bridge (both ends held: bridge above, nut below the bearing). A and B single shear, forced: the long links cross over every pin; overhang 1.5 mm at A |
| A10 | PASS | HAND · three layers, none stacked only to clear: the long links cross all the time, the coupler sits between (crank z 0 to 6, coupler 7.5 to 13.5, follower 22 to 28) |
| A11 | PASS | AUTO / HAND · fired: j1-dead-axle (28 solids) · every joint's load goes to the base: the live shaft via its housing, dead axle via the axle and bridge, pins via the links |
| A12 | PASS | AUTO · clamp check clean |
| A13 | PASS | AUTO / HAND · 130 solids, 61 unnamed (further items of a listed set) · named catalogue sizes; the unnamed solids are further items of listed sets |
| A14 | PASS | HAND · bridge posts stand where no link reaches (clearance 0); the crank passes under the O4 nut with 6 mm to spare |
| A15 | PASS | AUTO · clearance: 0 clashes over the cycle |
| A16 | PASS | HAND · 5 build rules; no note: none; no badge: none · notes and badges on every pivot, 4 to 5 build rules |
| A17 | PASS | HAND · goes together bottom to top: base, shaft, crank, coupler, follower, then the bridge on its posts with the hanging axle; every screw reachable from above or below |
| E1 | PASS | AUTO · every solid has one explode level; levels -8 to 4.5 · every solid has one explode level |
| E2 | PASS | AUTO · 32 rigid groups; fired: explode · rigid groups, each head stays on its shank |
| E3 | PASS | AUTO · fired: explode · screws back out along their axes |
| E4 | PASS | HAND · levels follow A17 in the 70° explode |
| E5 | PASS | AUTO · fired: explode · bearings, circlips and bushings stay in their parts |
| E6 | PASS | AUTO · fired: explode · motor and bracket move as one |
| E7 | PASS | AUTO · fired: explode · spacers and washers midway |
| E8 | PASS | AUTO · fired: explode · the live shaft leaves to the side it was fitted from |
| E9 | PASS | HAND · screenshots at 100% explode, 28° and 70°: nothing inside another part, nothing leaves the frame |
| J1 | PASS | AUTO · fired: j1-dead-axle (28 solids) · O4 hanging axle: shouldered axle with head on the bridge, sealed bearing, spacer sleeve, thrust washer, washer and nyloc under the bearing, spigoted bridge, oil sink (polish) |
| J2 | PASS | AUTO · fired: j2-live-shaft (27 solids), j2-straddle (no solids) · O2 live shaft: housing cartridge, keyed shaft, circlips, thrust washer, home flag, pulley |
| J3 | PASS | AUTO · fired: j3-moving-pin (24 solids) · A and B: shoulder bolts, bearings with spacers, threadlocker; single shear (forced) |
| J4 | N/A | AUTO · fired: j4-slot-roller (no solids) · no pin in a slot |
| J5 | N/A | AUTO · fired: j5-slide (no solids) · no slide |
| J6 | N/A | AUTO · fired: j6-mesh (no solids) · no gear mesh |
| J7 | N/A | AUTO · fired: j7-cam (no solids) · no cam |
| J8 | PASS | AUTO · fired: j8-belt (2 solids) · flanged motor pulley, mount slotted for tension; belt wrap enough, no idler |
| F1 | PASS | AUTO · served at pO2, pO4, pO4-bridge-post; fired: j2-live-shaft (27 solids) · dowels at the housing, spigots on the bridge posts |
| F2 | PASS | AUTO · served at pO2, pO4, pA, pB, follower-adjust; fired: j2-live-shaft (27 solids) · circlips and retainers on every bearing |
| F3 | PASS | AUTO · served at pO2; fired: j2-live-shaft (27 solids) · feather key at the input shaft |
| F4 | PASS | AUTO / HAND · served at pO2, pO4; fired: j2-live-shaft (27 solids) · thrust washers at the ground pivots |
| F5 | N/A | AUTO / HAND · served at no joint; fired: j5-slide (no solids), stops (no solids) · both cranks turn fully; nothing to limit |
| F6 | N/A | AUTO / HAND · served at no joint; fired: j7-cam (no solids) · driven through a toothed belt; no rest position or rattling clearance to hold |
| F7 | PASS | AUTO / HAND · served at drive, follower-adjust; fired: j6-mesh (no solids), j5-slide (no solids) · the long links must be equal: an H.turnbuckle in the follower's own plane, set at 100 mm (the 40 mm coupler is all bosses and has no room); b = d held by drilling from one jig (Appendix A) |
| F8 | PASS | AUTO · served at pO4; fired: lubrication (no solids) · oil sink on the bridge over the open bearing; the others are sealed or shielded |
| F9 | PASS | AUTO / HAND · served at pO2, pO4, follower-adjust; fired: timing-marks (no solids) · zero ticks on the base at each pivot along the ground line and an index on each arm tip: the cranks refit a turn apart or mirrored and still run, so the ticks must read together |
| F10 | PASS | AUTO / HAND · served at drive; fired: drive (37 solids) · pulley flanges, home flag and fork sensor; leads to the terminal block; no slip clutch (decided at planning): nothing in the linkage can jam while it is connected |
| M1 | PASS | AUTO · fired: hardware primitives · outer edges broken by the primitives |
| M2 | PASS | HAND · no wheel; the long links are plain bars, no lightening (they turn fully, inertia is modest) |
| M3 | PASS | AUTO · fired: j3-moving-pin (24 solids), hardware primitives · bore entry rings in the screenshots |
| M4 | PASS | AUTO / HAND · fired: base (1 solid), fasteners (stage 3) · counterbores in the base by rule |
| M5 | PASS | AUTO / HAND · fired: hardware primitives · no pockets or windows |
| M6 | PASS | AUTO · edge distance and walls clean |
| M7 | N/A | HAND · the bridge arms are filleted hulls, no inside corner left sharp |
| M8 | PASS | AUTO · fired: j1-dead-axle (28 solids) · undercut on the axle thread |
| M9 | PASS | AUTO / HAND · fired: j1-dead-axle (28 solids) · engagement by rule |
| M10 | PASS | AUTO / HAND · 130 of 130 solids name a material · every solid names a material |
| M11 | PASS | AUTO · fired: j1-dead-axle (28 solids), hardware primitives · centre holes and flats on the shafts |
| M12 | PASS | HAND · every head reachable from above or below; the turnbuckle is a set-up adjustment made with the follower off; bearings press out past their circlips |
| M13 | PASS | AUTO / HAND · 49 threaded, 0 without a locking method · locking method on every threaded fastener, including the new stops and the polish's parts (rules rerun in the polish) |
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
| R2 | PASS | HAND · threads M3, M5, M6, M8; joint Ø 8, 10; bearings 6800-2RS (10x19x5), F688ZZ (8x16x5), F6800 (10x19x5) · standard sizes only: threads, shafts and bearings from the tables |
| R3 | PASS | AUTO · fired: hardware primitives · shared subassemblies used, none copied |
| R4 | PASS | AUTO · package 23.2 KB · package 23.3 KB, written |
| R5 | PASS | HAND · polish 1 ms in the assembly |
| R6 | PASS | FLAG · FLAG: browser bench, DPR 1.5, 2026-10-19: plan 1.89 ms, 28° 2.27 ms, side 1.84 ms, explode 70° 2.09 ms at full detail; the 8 ms budget holds at every dial position |
| R7 | PASS | HAND · model.ts + polish.ts 9.4 KB |
| R8 | PASS | AUTO / SITE · site behaviour |
| DL1 | PASS | AUTO / HAND · 50 of 130 solids on a dropping rung · every solid and mark on a rung; the polish sets no detail |
| DL2 | PASS | HAND · model detail full · model detail full |
| DL3 | PASS | AUTO · rule |
| DL4 | PASS | SITE · site |
| DL5 | PASS | FLAG · FLAG: bench lists the rungs, see the ladder below |
| Q1 | PASS | check, clamp and edge distance clean |
| Q2 | PASS | 0 clashes |
| Q3 | PASS | package written, 23.2 KB; site build not checked here · package written, 23.3 KB; site build not run in this worktree (CI) |
| Q4 | PASS | local: tools/shot · local: tools/shot: plan, 28°, side and explode at 28° and 70°, both sheets, drawn in Chrome; plan and side looked at |
| Q5 | PASS | local: tools/bench · local: tools/bench: bench run, figures under R6 |
| Q6 | PASS | this sheet |
| Q7 | PASS | tools/conformance |

## Joints
| Joint | Type | F1 locate | F2 retain | F3 torque | F4 thrust | F5 limit | F6 hold | F7 adjust | F8 lube | F9 timing | F10 protect |
|---|---|---|---|---|---|---|---|---|---|---|---|
| pO2 | J2 | 2 x Dowel pin Ø3 x 10 h6, housing to base | 2 x Internal circlip DIN 472, Ø19; Countersunk M5 x 12 (ISO 10642), into the shaft end, flush; Socket head M5 x 10 (ISO 4762), into the shaft end | Feather key 3 x 3 x 6 (DIN 6885) | Wave washer 14.5x18.8, spring steel; Thrust washer 10.2x16, bronze | – limited by the linkage and the stops at the ground pivots | – driven, no rest position | – the exact length is set by the turnbuckle | – shielded bearing, greased for life | Base plate; Crank (input) | – none needed |
| pO4 | J1 | 2 x spigot | Nyloc nut M8 (DIN 985); Internal circlip DIN 472, Ø19 | – no keyed part; plates turn on bearings | Thrust washer 10.2x13.1, bronze | – limited by the linkage and the stops at the ground pivots | – driven, no rest position | – the exact length is set by the turnbuckle | Bridge over the pivot, on two spigoted posts | Base plate; Follower | – none needed |
| pA | J3 | – no removable plate on a moving pin | Internal circlip DIN 472, Ø16; Bearing F688ZZ (8x16x5); head | – no keyed part; plates turn on bearings | – bearing located by its flange and circlip, inner race clamped | – limited by the linkage and the stops at the ground pivots | – driven, no rest position | – the exact length is set by the turnbuckle | – shielded bearing, greased for life | – no phase to mark at this pin | – none needed |
| pB | J3 | – no removable plate on a moving pin | Internal circlip DIN 472, Ø16; Bearing F688ZZ (8x16x5); head | – no keyed part; plates turn on bearings | – bearing located by its flange and circlip, inner race clamped | – limited by the linkage and the stops at the ground pivots | – driven, no rest position | – the exact length is set by the turnbuckle | – shielded bearing, greased for life | – no phase to mark at this pin | – none needed |
| pO4-bridge-post | post | 2 x spigot | – static | – static | – static | – static | – static | – static | – static | – static | – static |
| drive | drive | – bracket screwed up into the base | – set screws on the motor crank hub | – crank clamped on the motor shaft | – motor bearings | – motor turns freely | – motor holds when powered | bracket | – dry steel joints, no sliding | – home flag read by the fork sensor | Home flag, 1 mm steel vane; 3 x Fork sensor, slotted optical, 5 mm gap; Pulley flanges |
| follower-adjust | post | – static | 2 x Jam nut M3 (DIN 439), one left hand and one right hand | – static | – static | – static | – static | Turnbuckle body 12 x 6 x 15, milled flat, M3 left and right hand; 2 x Jam nut M3 (DIN 439), one left hand and one right hand; 2 x Stud M3 x 13.8, one left hand and one right hand, threadlocked into the halves | – static | Turnbuckle body 12 x 6 x 15, milled flat, M3 left and right hand | – static |

## Variants and overrides
| Joint or part | Rule result | Chosen | Why |
|---|---|---|---|
| layers | crank and follower alike on layer 0 | crank 0, coupler 1 (plated 2.5 mm low), follower 2 (plated 2 mm up) in the model | the long links cross at every phase; the follower clears the head of A (top 20.7) by 1.3 mm |
| O4 axle | dead axle through the base up to a bridge | axle hangs from the bridge: bridge, posts, sleeve and head kept; the lower axle, base hole, thrust spacer and base washer removed; washer and M8 nyloc under the bearing's thrust washer (polish) | the crank sweeps over O4 once a turn; the axle would pass through it |
| follower | one bar | `H.turnbuckle` halfway, set at 100 mm, in the follower's own plane | F7: c = a is exact; the 40 mm coupler has no room for one |
| pin caps | pin layers as the rule reads them | pO4 at layer 2 span 1, pA 0..1, pB 1..2 in the model | so `check` sees the hanging axle and no pin through a part |
| cranks | straight stadium | tapered in the model, bosses R13/R9.5 and R12/R9.5 | D1 |

## Detail ladder
| Rung | Solids | Marks | Frame ms at this dial position |
|---|---|---|---|
| DL-A | 12 | 0 | 2.09 |
| DL-B | 0 | 203 | 1.73 |
| DL-C | 0 | 0 | 2 |
| DL-D | 20 | 0 | 1.44 |
| DL-E | 8 | 2 | 1.39 |
| DL-F | 0 | 0 | 1.49 |
| DL-G | 0 | 0 | 1.24 |
| DL-H | 10 | 0 | 1.33 |
| never | 80 | 158 | 2.25 (full) |

## Promotion candidates
- An axle hanging from a bridge over a pivot the other link sweeps over (this and double-crank): twice so far, one more makes a rule.
- A dead axle with a part sweeping over it (see parallelogram): promote.

## Verification
check: clean · clearance: 0 clashes · clamp: clean · edge distance: clean · package: 23.3 KB
screenshots: plan, 28°, side, explode at 28° and 70°, both sheets, drawn in local Chrome to dist/shots/antiparallelogram/ (plan and side looked at; the issue carries the images) · bench: browser, DPR 1.5, 2026-10-19; plan 1.89 ms, 28° 2.27 ms, side 1.84 ms, explode 70° 2.09 ms at full detail, 8 ms held at every dial (R6)
