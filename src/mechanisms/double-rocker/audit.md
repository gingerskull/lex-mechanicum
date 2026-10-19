# Audit: Double-rocker linkage (double-rocker)
standard: 2.6 · date: 2026-10-19 · result: pass · detail: full · pass: build

## Summary
PASS 111 · FAIL 0 · N/A 10 · open: none

## Requirements
| Id | Status | Evidence / action |
|---|---|---|
| S1 | PASS | DATA · the standard carries version 2.6 and its changelog |
| S2 | PASS | HAND · header with standard, date, result, detail, pass |
| S3 | PASS | AUTO · tools/conformance reads this header and runs in npm run check |
| S4 | PASS | SITE · #94 holds only this mechanism's decisions and open items |
| P1 | PASS | DATA · record complete; model.ts, polish.ts, audit.md present |
| P2 | PASS | DATA · catalogue validator clean |
| P3 | PASS | DATA / SITE · record has ratio, axes, output character, backdrivable and aka; oscillating input, so the page says motorised |
| P4 | PASS | DATA · tags grouped in the record |
| P5 | PASS | DATA · explain and the real-world uses present |
| P6 | PASS | DATA · references present; the real-world videos checked with YouTube's oEmbed: each exists and is embeddable, titles show the mechanism or its close cousin (the locomotive videos show coupled wheels, a parallelogram in practice); nothing changed |
| P7 | PASS | HAND / SITE · no prose in model.ts or polish.ts beyond engineering notes |
| P8 | PASS | SITE · page does not show parts or joints |
| P9 | PASS | HAND · HAND · solve() drives the input 20° to 86° (inside the toggles at 18.2° and 87.9°); the output rocker swings 105.6° to 136.3°, about 31°. The catalogue's 'about 41°' is the full toggle-to-toggle swing (to 146.2°) and was corrected in the record's typical line; transmission angle 12° to 158° (flagged at the ends) |
| P10 | PASS | HAND · HAND · coupler midpoint traced, velocity at the midpoint and B, coupler force line, transmission and input angles, output rocker angle plot |
| P11 | PASS | DATA · record prose read; short sentences, no em dashes |
| K1 | PASS | HAND · check: max link error 2.8e-14 mm · HAND · check: link error below 1e-12 mm; the polish changes heights, outlines and hardware only |
| K2 | PASS | HAND · check: finite, continuous, periodic over 720 samples |
| K3 | PASS | HAND · link, cap and tracer only; placement by between, fixed, at |
| K4 | PASS | HAND · roles driver (input), output, link, pin; accent on the input pin only |
| K5 | PASS | HAND · check: no INTERFERE, OVERLAP or WARN · HAND · check clean, integer layers: input rocker 0, coupler 1 (plated 2.5 mm low), output rocker 2 (plated 2 mm up); ground pivots layer -1 radius 7, pins 5.5 |
| K6 | PASS | DATA · DATA · a 70, b 40, c 80, d 100 as the catalogue build; Grashof 40 + 100 = 140 <= 150 with the coupler shortest; one branch (+1); driven 20° to 86° as the catalogue note says |
| K7 | PASS | HAND · input oscillating on rockerIn · HAND · input oscillating on the input part |
| D1 | PASS | HAND · tapered links with boss rings, flush caps, squircle base |
| D2 | PASS | HAND · bosses round every pin; the rockers are plain bars, each swings only about 30° to 66°; no window needed |
| D3 | PASS | STYLE · style only |
| D4 | PASS | AUTO · fired: base (1 solid), feet (4 solids) · base corners and feet by rule |
| D5 | PASS | AUTO / HAND · bridge on two spigoted posts by rule; housing at the live shaft |
| D6 | PASS | HAND / STYLE · screenshots: nothing cosmetic |
| D7 | PASS | HAND · big parts plain; richness in hardware |
| A1 | PASS | AUTO · pO2 J2, pO4 J1, pA J3, pB J3; fired: classify (no solids) · pivots read correctly: live shaft at the input, dead axle at the other ground pivot, shoulder bolts at the moving pins |
| A2 | PASS | AUTO · pO2 J2, pO4 J1, pA J3, pB J3 · live shaft at the input, dead axle at the other ground pivot, shoulder bolts at the moving pins |
| A3 | PASS | AUTO · fired: classify (no solids) · bearings F6800 at the ground pivots, F688ZZ at the moving pins |
| A4 | PASS | AUTO · fired: j1-dead-axle (28 solids) · stepped axle with bearing, spacers, circlip, thrust washer |
| A5 | PASS | AUTO · fired: j2-live-shaft (27 solids) · feather key on the Ø10 input shaft |
| A6 | PASS | AUTO · fired: standoffs (no solids) · bridge posts spigoted at O4; no floating plate needs more |
| A7 | PASS | AUTO · fired: base (1 solid), feet (4 solids) · base, feet, clearance holes by rule; the base grown by the rules for the drive and posts |
| A8 | PASS | AUTO · fired: fasteners (stage 3) · shanks and clearance holes by stage 3 |
| A9 | PASS | AUTO / HAND · fired: j2-straddle (no solids) · AUTO / HAND · O2 straddled by its housing, O4 held by the base and a bridge: both ends held. A and B single shear, forced: the output rocker lies along the input rocker at the lower toggle, so they stack (coupler between) and nothing fits above B; overhang 1.5 mm at A |
| A10 | PASS | HAND · three layers, none stacked only to clear: at the lower toggle O4, A and B are collinear, so the rockers cannot share a layer (input z 0 to 6, coupler 7.5 to 13.5, output 22 to 28) |
| A11 | PASS | AUTO / HAND · fired: j1-dead-axle (28 solids) · every joint's load goes to the base: the live shaft via its housing, dead axle via the axle and bridge, pins via the links |
| A12 | PASS | AUTO · clamp check clean |
| A13 | PASS | AUTO / HAND · 130 solids, 66 unnamed (further items of a listed set) · named catalogue sizes; the unnamed solids are further items of listed sets |
| A14 | PASS | HAND · bridge, posts and stops cleared by the sweeps (clearance 0); the head of A stays 1.3 mm under the output rocker |
| A15 | PASS | AUTO · clearance: 0 clashes over the cycle |
| A16 | PASS | HAND · 5 build rules; no note: none; no badge: none · notes and badges on every pivot, 4 to 5 build rules |
| A17 | PASS | HAND · goes together bottom to top: base, axles, input rocker, coupler, output rocker; bridge last; every screw reachable from above or below |
| E1 | PASS | AUTO · every solid has one explode level; levels -8 to 4 · every solid has one explode level |
| E2 | PASS | AUTO · 33 rigid groups; fired: explode · rigid groups, each head stays on its shank |
| E3 | PASS | AUTO · fired: explode · screws back out along their axes |
| E4 | PASS | HAND · levels follow A17 in the 70° explode |
| E5 | PASS | AUTO · fired: explode · bearings, circlips and bushings stay in their parts |
| E6 | PASS | AUTO · fired: explode · motor and bracket move as one |
| E7 | PASS | AUTO · fired: explode · spacers and washers midway |
| E8 | PASS | AUTO · fired: explode · the live shaft leaves to the side it was fitted from |
| E9 | PASS | HAND · screenshots at 100% explode, 28° and 70°: nothing inside another part, nothing leaves the frame |
| J1 | PASS | AUTO · fired: j1-dead-axle (28 solids) · O4 dead axle: shouldered axle, bearing, spacers, circlip, thrust washer, spigoted bridge, nyloc under the base, oil sink |
| J2 | PASS | AUTO · fired: j2-live-shaft (27 solids), j2-straddle (no solids) · O2 live shaft: housing cartridge, keyed shaft, circlips, thrust washer, home flag |
| J3 | PASS | AUTO · fired: j3-moving-pin (24 solids) · A and B: shoulder bolts, bearings with spacers, threadlocker; single shear (forced) |
| J4 | N/A | AUTO · fired: j4-slot-roller (no solids) · no pin in a slot |
| J5 | N/A | AUTO · fired: j5-slide (no solids) · no slide |
| J6 | N/A | AUTO · fired: j6-mesh (no solids) · no gear mesh |
| J7 | N/A | AUTO · fired: j7-cam (no solids) · no cam |
| J8 | N/A | AUTO · fired: j8-belt (no solids) · the drive is a crank and link, no belt |
| F1 | PASS | AUTO · served at pO2, pO4, pO4-bridge-post; fired: j2-live-shaft (27 solids) · dowels at the housing, spigots on the bridge posts |
| F2 | PASS | AUTO · served at pO2, pO4, pA, pB; fired: j2-live-shaft (27 solids) · circlips and retainers on every bearing |
| F3 | PASS | AUTO · served at pO2; fired: j2-live-shaft (27 solids) · feather key at the input shaft |
| F4 | PASS | AUTO / HAND · served at pO2, pO4; fired: j2-live-shaft (27 solids) · thrust washers at the ground pivots |
| F5 | PASS | AUTO / HAND · served at pO2, pO4; fired: j5-slide (no solids), stops (3 solids) · stops 2° outside both rockers' travel: the output pair by the rule, the input pair by hand (the rule skips the input rocker) |
| F6 | N/A | AUTO / HAND · served at no joint; fired: j7-cam (no solids) · driven through the drive link; no rest position or rattling clearance to hold |
| F7 | N/A | AUTO / HAND · served at no joint; fired: j6-mesh (no solids), j5-slide (no solids) · a Grashof inequality, not an exact ratio: no link needs adjusting (Appendix A) |
| F8 | PASS | AUTO · served at pO4; fired: lubrication (no solids) · oil sink on the bridge over the open bearing; the others are sealed or shielded |
| F9 | PASS | AUTO / HAND · served at pO2, pO4; fired: timing-marks (no solids) · swing scales on the base round both pivots with an index line on each rocker's tip: shows it went back together on the modelled branch |
| F10 | PASS | AUTO / HAND · served at drive; fired: drive (33 solids) · home flag and fork sensor; leads to the terminal block; no slip clutch on a lever drive |
| M1 | PASS | AUTO · fired: hardware primitives · outer edges broken by the primitives |
| M2 | PASS | HAND · no wheel; the rockers are plain bars, no lightening |
| M3 | PASS | AUTO · fired: j3-moving-pin (24 solids), hardware primitives · bore entry rings in the screenshots |
| M4 | PASS | AUTO / HAND · fired: base (1 solid), fasteners (stage 3) · counterbores in the base by rule |
| M5 | PASS | AUTO / HAND · fired: hardware primitives · no pockets or windows |
| M6 | PASS | AUTO · edge distance and walls clean |
| M7 | N/A | HAND · the bridge is a hull of circles, no inside corner |
| M8 | PASS | AUTO · fired: j1-dead-axle (28 solids) · undercut on the axle thread |
| M9 | PASS | AUTO / HAND · fired: j1-dead-axle (28 solids) · engagement by rule |
| M10 | PASS | AUTO / HAND · 130 of 130 solids name a material · every solid names a material |
| M11 | PASS | AUTO · fired: j1-dead-axle (28 solids), hardware primitives · centre holes and flats on the shafts |
| M12 | PASS | HAND · every head reachable from above or below; bearings press out past their circlips |
| M13 | PASS | AUTO / HAND · 51 threaded, 0 without a locking method · locking method on every threaded fastener, including the new stops and the polish's parts (rules rerun in the polish) |
| M14 | N/A | AUTO / HAND · fired: j4-slot-roller (no solids) · no sliding contact |
| V1 | PASS | AUTO · fired: drive (33 solids) · pancake motor under the base |
| V2 | PASS | AUTO · fired: drive (33 solids) · one-piece bracket |
| V3 | PASS | AUTO / HAND · fired: drive (33 solids) · belt and pulleys clear; clearance 0 |
| V4 | N/A | AUTO · fired: j8-belt (no solids) · crank-and-link drive, no belt |
| V5 | PASS | AUTO · fired: drive (33 solids) · AUTO · oscillating: motor, short crank and link swing a 22 mm lever on the input shaft through exactly the modelled 66° |
| V6 | PASS | AUTO · fired: drive (33 solids) · home flag and fork sensor, leads, terminal block |
| L1 | PASS | STYLE · no look values in the records |
| L2 | PASS | HAND · records carry geometry, roles, materials and marks only |
| L3 | PASS | HAND · roles right: driver, output, link |
| L4 | PASS | HAND / STYLE · accent on the input pin only |
| L5 | PASS | AUTO / HAND · fired: see-through · static solids over the links stay see-through where the rule says so |
| L6 | PASS | AUTO · screenshots at every tilt |
| L7 | PASS | STYLE · style only |
| L8 | PASS | AUTO / HAND · swing scales as marks on the base and an index on each rocker; centrelines and dimensions automatic |
| R1 | PASS | HAND · no inline outlines in the polish |
| R2 | PASS | HAND · threads M3, M4, M5, M6, M8; joint Ø 8, 10; bearings 6800-2RS (10x19x5), F688ZZ (8x16x5), F6800 (10x19x5) · standard sizes only: threads, shafts and bearings from the tables |
| R3 | PASS | AUTO · fired: hardware primitives · shared subassemblies used, none copied |
| R4 | PASS | AUTO · package 22.2 KB · package 22.2 KB, written |
| R5 | PASS | HAND · polish 53 ms in the assembly |
| R6 | PASS | FLAG · FLAG: browser bench, DPR 1.5, 2026-10-19: plan 1.95 ms, 28° 2.47 ms, side 1.63 ms, explode 70° 2.18 ms at full detail; the 8 ms budget holds at every dial position |
| R7 | PASS | HAND · model.ts + polish.ts 8.1 KB |
| R8 | PASS | AUTO / SITE · site behaviour |
| DL1 | PASS | AUTO / HAND · 48 of 130 solids on a dropping rung · every solid and mark on a rung; the polish sets no detail |
| DL2 | PASS | HAND · model detail full · model detail full |
| DL3 | PASS | AUTO · rule |
| DL4 | PASS | SITE · site |
| DL5 | PASS | FLAG · FLAG: bench lists the rungs, see the ladder below |
| Q1 | PASS | check, clamp and edge distance clean |
| Q2 | PASS | 0 clashes |
| Q3 | PASS | package written, 22.2 KB; site build not checked here · package written, 22.2 KB; site build not run in this worktree (CI) |
| Q4 | PASS | local: tools/shot · local: tools/shot: plan, 28°, side and explode at 28° and 70°, both sheets, drawn in Chrome; plan and side looked at |
| Q5 | PASS | local: tools/bench · local: tools/bench: bench run, figures under R6 |
| Q6 | PASS | this sheet |
| Q7 | PASS | tools/conformance |

## Joints
| Joint | Type | F1 locate | F2 retain | F3 torque | F4 thrust | F5 limit | F6 hold | F7 adjust | F8 lube | F9 timing | F10 protect |
|---|---|---|---|---|---|---|---|---|---|---|---|
| pO2 | J2 | 2 x Dowel pin Ø3 x 10 h6, housing to base | 2 x Internal circlip DIN 472, Ø19; Countersunk M5 x 12 (ISO 10642), into the shaft end, flush; Socket head M5 x 10 (ISO 4762), into the shaft end | Feather key 3 x 3 x 6 (DIN 6885) | Wave washer 14.5x18.8, spring steel; Thrust washer 10.2x16, bronze | 2 x Stop bumper, neoprene sleeve Ø12 | – driven, no rest position | – no exact length ratio here | – shielded bearing, greased for life | Base plate; Input rocker | – none needed |
| pO4 | J1 | 2 x spigot | Internal circlip DIN 472, Ø19; Bearing F6800 (10x19x5) | – no keyed part; plates turn on bearings | Thrust washer 10.2x13.1, bronze | bumper | – driven, no rest position | – no exact length ratio here | Bridge over the pivot, on two spigoted posts | Base plate; Output rocker | – none needed |
| pA | J3 | – no removable plate on a moving pin | Internal circlip DIN 472, Ø16; Bearing F688ZZ (8x16x5); head | – no keyed part; plates turn on bearings | – bearing located by its flange and circlip, inner race clamped | – limited by the linkage and the stops at the ground pivots | – driven, no rest position | – no exact length ratio here | – shielded bearing, greased for life | – no phase to mark at this pin | – none needed |
| pB | J3 | – no removable plate on a moving pin | Internal circlip DIN 472, Ø16; Bearing F688ZZ (8x16x5); head | – no keyed part; plates turn on bearings | – bearing located by its flange and circlip, inner race clamped | – limited by the linkage and the stops at the ground pivots | – driven, no rest position | – no exact length ratio here | – shielded bearing, greased for life | – no phase to mark at this pin | – none needed |
| pO4-bridge-post | post | 2 x spigot | – static | – static | – static | – static | – static | – static | – static | – static | – static |
| drive | drive | – bracket screwed up into the base | – set screws on the motor crank hub | – crank clamped on the motor shaft | – motor bearings | – the lever dead centres sit at the ends of the swing | – motor holds when powered | – bracket slots | – dry steel joints, no sliding | – home flag read by the fork sensor | Home flag on the drive crank; 3 x Fork sensor, slotted optical, 5 mm gap |

## Variants and overrides
| Joint or part | Rule result | Chosen | Why |
|---|---|---|---|
| layers | rockers alike on layer 0, coupler 1 | input rocker 0, coupler 1 (plated 2.5 mm low), output rocker 2 (plated 2 mm up) in the model | O4, A, B are collinear at the lower toggle, so the rockers overlap in plan |
| input rocker stops | skipped by the rule (the drive limits the input) | `H.stops` pair 2° outside the swing | F5: with the drive off it would over-travel |
| rockers | straight stadium | tapered in the model, bosses R13/R9.5 and R12/R9.5 | D1 |
| input swing | catalogue range 18.2° to 87.9° (the toggles) | 20° to 86°, as the catalogue note says | inside both toggles, no branch flip |

## Detail ladder
| Rung | Solids | Marks | Frame ms at this dial position |
|---|---|---|---|
| DL-A | 12 | 0 | 2.12 |
| DL-B | 0 | 204 | 1.63 |
| DL-C | 0 | 0 | 1.73 |
| DL-D | 20 | 0 | 1.36 |
| DL-E | 8 | 2 | 1.38 |
| DL-F | 0 | 0 | 1.43 |
| DL-G | 0 | 0 | 1.22 |
| DL-H | 8 | 0 | 1.17 |
| never | 82 | 163 | 2.3 (full) |

## Promotion candidates
- Hand-built input rocker stops and swing scales again (Watt, Chebyshev, Ackermann, here): promote to rules.

## Verification
check: clean · clearance: 0 clashes · clamp: clean · edge distance: clean · package: 22.2 KB
screenshots: plan, 28°, side, explode at 28° and 70°, both sheets, drawn in local Chrome to dist/shots/double-rocker/ (plan and side looked at; the issue carries the images) · bench: browser, DPR 1.5, 2026-10-19; plan 1.95 ms, 28° 2.47 ms, side 1.63 ms, explode 70° 2.18 ms at full detail, 8 ms held at every dial (R6)
