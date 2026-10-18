# Audit: Watt's linkage (watt-linkage)
standard: 2.5 · date: 2026-10-18 · result: pass · detail: full · pass: build

## Summary
PASS 112 · FAIL 0 · N/A 9 · open: none

## Requirements
| Id | Status | Evidence / action |
|---|---|---|
| S1 | PASS | changelog in the standard carries ids and tiers |
| S2 | PASS | header present |
| S3 | PASS | tools/conformance reads this header |
| S4 | PASS | issue #41 holds only this mechanism's open items |
| P1 | PASS | DATA · record complete; model.ts, polish.ts, audit.md present |
| P2 | PASS | catalogue validator clean |
| P3 | PASS | DATA / SITE · record has ratio, axes, output character, backdrivable, aka; oscillating input so the page says motorised |
| P4 | PASS | tags grouped in the record |
| P5 | PASS | explain and three real-world uses present |
| P6 | PASS | Wikipedia, Cut The Knot and Wikipedia straight-line page; two videos and a photo page in media; no changes needed |
| P7 | PASS | HAND / SITE · no prose in model.ts or polish.ts beyond engineering notes |
| P8 | PASS | page does not show parts or joints |
| P9 | PASS | explain matches solve(): 74 mm of travel, x within 0.6 mm over the ±24° swing (measured: M y -35.7 to 37.8, x -0.40 to 0.55) |
| P10 | PASS | paths (midpoint, comet), vel, forces on rocker and coupler, angles (transmission, input), plot of midpoint offset against input |
| P11 | PASS | record prose read; short sentences, no em dashes |
| K1 | PASS | HAND · check: max link error 2.8e-14 mm · link error 3e-14 mm; plating and hardware never move a centre |
| K2 | PASS | HAND · check: finite, continuous, periodic over 720 samples |
| K3 | PASS | link, cap and tracer only; placement by between, fixed, at |
| K4 | PASS | roles driver (left rocker), output (right rocker, both plates), link (coupler), pin; accent on pO1 only |
| K5 | PASS | HAND · check: no INTERFERE, OVERLAP or WARN · layers 0 (rockers), 1 (coupler), 2 (front plate); ground pivots layer -1 radius 7; moving pins radius 5.5; no INTERFERE or OVERLAP |
| K6 | PASS | r 90, c 60, O1 (-90,30), O2 (90,-30) as the catalogue build; the catalogue's ghost figure-eight tracer is not drawn (a site solve detail, no part) |
| K7 | PASS | HAND · input oscillating on rockerL · input oscillating on rockerL via osc(-24°, 24°) |
| D1 | PASS | tapered links with boss rings, flush caps, squircle base |
| D2 | PASS | bosses round every pin; rockers are plain bars, no window: both oscillate through 48° only and the coupler is 60 mm long |
| D3 | PASS | style only |
| D4 | PASS | AUTO · fired: base (1 solid), feet (4 solids) · base corners and feet by rule |
| D5 | PASS | AUTO / HAND · bridge over O2 on two spigoted posts; housing at O1 |
| D6 | PASS | HAND / STYLE · screenshots: nothing cosmetic |
| D7 | PASS | big parts plain; richness in hardware |
| A1 | PASS | AUTO · pO1 J2, pO2 J1, pA J3, pB J3; fired: classify (no solids) · pO1 J2, pO2 J1, pA and pB J3 read correctly |
| A2 | PASS | AUTO · pO1 J2, pO2 J1, pA J3, pB J3 · live shaft at O1, dead axle at O2, shoulder bolts at A and B |
| A3 | PASS | AUTO · fired: classify (no solids) · bearings F6800 at the rockers, F688ZZ at A and B |
| A4 | PASS | AUTO · fired: j1-dead-axle (34 solids) · stepped axle at O2, live shaft at O1 |
| A5 | PASS | AUTO · fired: j2-live-shaft (27 solids) · feather key on the Ø10 input shaft |
| A6 | PASS | AUTO · fired: standoffs (no solids) · bridge posts spigoted at O2; no floating plate needs more |
| A7 | PASS | AUTO · fired: base (1 solid), feet (4 solids) · base, feet, scale and clearance hole by rule |
| A8 | PASS | AUTO · fired: fasteners (stage 3) · shanks and clearance holes by stage 3 |
| A9 | PASS | AUTO / HAND · fired: j2-straddle (no solids) · B is a clevis (rear and front right-rocker plates, twin in the model); A single shear because the coupler sweeps over the left rocker tip, forced; O2 held by base and bridge; O1 straddled by the housing |
| A10 | PASS | left rocker and right rear plate share the base layer (the right one 2 mm up, only to pass over the eccentric flange); the coupler rides above them; stated in the rules |
| A11 | PASS | AUTO / HAND · fired: j1-dead-axle (34 solids) · every joint's load goes to the base: O1 via the housing, O2 via the axle and bridge, pins via the rockers |
| A12 | PASS | AUTO · clamp check clean |
| A13 | PASS | AUTO / HAND · 146 solids, 73 unnamed (further items of a listed set) · named catalogue sizes; the unnamed solids are further items of listed sets |
| A14 | PASS | stops 2° outside the swings; bridge, posts and stops cleared by the sweeps (clearance 0) |
| A15 | PASS | AUTO · clearance: 0 clashes over the cycle |
| A16 | PASS | HAND · 5 build rules; no note: none; no badge: none · notes and badges on pO1, pO2, pA, pB; 5 build rules |
| A17 | PASS | goes together bottom to top: base, axles, rear plates, coupler, front plate, bridge; every screw reachable from above or below |
| E1 | PASS | AUTO · every solid has one explode level; levels -8 to 4 · rigid solids in the explode screenshots |
| E2 | PASS | AUTO · 37 rigid groups; fired: explode · each head stays on its shank |
| E3 | PASS | AUTO · fired: explode · screws back out along their axes |
| E4 | PASS | levels follow A17 in the 70° explode |
| E5 | PASS | AUTO · fired: explode · bearings, circlips and bushings stay in their parts |
| E6 | PASS | AUTO · fired: explode · motor and bracket move as one |
| E7 | PASS | AUTO · fired: explode · spacers and washers midway |
| E8 | PASS | AUTO · fired: explode · the live shaft leaves to the side it was fitted from |
| E9 | PASS | screenshots at 100% explode, 28° and 70°: nothing inside another part, nothing leaves the frame |
| J1 | PASS | AUTO · fired: j1-dead-axle (34 solids) · O2 dead axle: shouldered axle, bearings, spacers, circlip, thrust washer, spigoted bridge, nyloc under the base, oil sink; plus the eccentric bushing |
| J2 | PASS | AUTO · fired: j2-live-shaft (27 solids), j2-straddle (no solids) · O1 live shaft: housing cartridge, keyed shaft, circlips, thrust washer, home flag; the shaft end is retained by the rule's screw and washer (no clash: the drive link does not cross it here) |
| J3 | PASS | AUTO · fired: j3-moving-pin (25 solids) · A and B: shoulder bolts, bearings with spacers, threadlocker; B in clevis |
| J4 | N/A | AUTO · fired: j4-slot-roller (no solids) · no pin in a slot |
| J5 | N/A | AUTO · fired: j5-slide (no solids) · no slide |
| J6 | N/A | AUTO · fired: j6-mesh (no solids) · no gear mesh |
| J7 | N/A | AUTO · fired: j7-cam (no solids) · no cam |
| J8 | N/A | AUTO · fired: j8-belt (no solids) · the drive is a crank and link, no belt |
| F1 | PASS | AUTO · served at pO1, pO2, pO2-bridge-post; fired: j2-live-shaft (27 solids) · dowels at the housing, spigots on the bridge |
| F2 | PASS | AUTO · served at pO1, pO2, pA, pB; fired: j2-live-shaft (27 solids) · circlips and retainers on every bearing |
| F3 | PASS | AUTO · served at pO1; fired: j2-live-shaft (27 solids) · feather key at O1 |
| F4 | PASS | AUTO / HAND · served at pO1, pO2; fired: j2-live-shaft (27 solids) · thrust washers at O1 and O2 |
| F5 | PASS | AUTO / HAND · served at pO1, pO2; fired: j5-slide (no solids), stops (6 solids) · stops 2 degrees outside both rockers' travel; the left pair added by hand (the rule skips the input rocker) |
| F6 | N/A | AUTO / HAND · served at no joint; fired: j7-cam (no solids) · driven through the drive link; no rest position or rattling clearance to hold |
| F7 | PASS | AUTO / HAND · served at pO2; fired: j6-mesh (no solids), j5-slide (no solids) · O2 eccentric bushing with two clamp screws sets the pivot offset (Appendix A); drawn at its set point, pin centres exact |
| F8 | PASS | AUTO · served at pO2; fired: lubrication (no solids) · oil sink on the O2 bridge; sealed or shielded bearings elsewhere |
| F9 | PASS | AUTO / HAND · served at pO1; fired: timing-marks (no solids) · swing scale on the base and index mark on the left rocker |
| F10 | PASS | AUTO / HAND · served at drive; fired: drive (33 solids) · pulley flanges, home flag and fork sensor; leads to the terminal block |
| M1 | PASS | AUTO · fired: hardware primitives · outer edges broken by the primitives |
| M2 | PASS | no wheel; rockers are short bars, no lightening needed |
| M3 | PASS | AUTO · fired: j3-moving-pin (25 solids), hardware primitives · bore entry rings in the screenshots |
| M4 | PASS | AUTO / HAND · fired: base (1 solid), fasteners (stage 3) · counterbores in the base by rule |
| M5 | PASS | AUTO / HAND · fired: hardware primitives · no pockets or windows |
| M6 | PASS | AUTO · edge distance and walls clean |
| M7 | N/A | no bracket or plate with a loaded corner |
| M8 | PASS | AUTO · fired: j1-dead-axle (34 solids) · undercut on the axle thread |
| M9 | PASS | AUTO / HAND · fired: j1-dead-axle (34 solids) · engagement by rule |
| M10 | PASS | AUTO / HAND · 146 of 146 solids name a material · every solid names a material |
| M11 | PASS | AUTO · fired: j1-dead-axle (34 solids), hardware primitives · centre holes and flats on the shafts |
| M12 | PASS | HAND · every screw reachable from above or below; the eccentric's clamp screws sit under the right rocker, reached with the rocker off (a bench set-up adjustment, so no day-to-day need); bearings removable once the plates are off |
| M13 | PASS | AUTO / HAND · 57 threaded, 0 without a locking method · locking method on every threaded fastener, including the eccentric screws and the new stops (rules rerun in the polish) |
| M14 | N/A | AUTO / HAND · fired: j4-slot-roller (no solids) · no sliding contact |
| V1 | PASS | AUTO · fired: drive (33 solids) · pancake motor under the base |
| V2 | PASS | AUTO · fired: drive (33 solids) · one-piece bracket |
| V3 | PASS | AUTO / HAND · fired: drive (33 solids) · belt and pulleys clear (clearance 0) |
| V4 | N/A | AUTO · fired: j8-belt (no solids) · crank-and-link drive, no belt |
| V5 | PASS | AUTO · fired: drive (33 solids) · oscillating: motor, short crank and link swing a 22 mm lever on the input shaft through exactly the modelled 48 degrees |
| V6 | PASS | AUTO · fired: drive (33 solids) · home flag and fork sensor, leads, terminal block |
| L1 | PASS | no look values in the records |
| L2 | PASS | records carry geometry, roles, materials and marks only |
| L3 | PASS | roles right: driver, output, link |
| L4 | PASS | HAND / STYLE · accent on the input shaft ring only |
| L5 | PASS | AUTO / HAND · fired: see-through · static solids over the rockers stay see-through where the rule says so |
| L6 | PASS | screenshots at every tilt |
| L7 | PASS | style only |
| L8 | PASS | AUTO / HAND · swing scale as marks on the base and an index on the rocker |
| R1 | PASS | no inline outlines in the polish |
| R2 | PASS | HAND · threads M3, M4, M5, M6, M8; joint Ø 8, 10; bearings 6800-2RS (10x19x5), F688ZZ (8x16x5), F6800 (10x19x5) · standard sizes only |
| R3 | PASS | AUTO · fired: hardware primitives · shared subassemblies used, none copied |
| R4 | PASS | AUTO · package 23.7 KB · package written |
| R5 | PASS | polish 46 ms in the assembly, one swing sample |
| R6 | PASS | FLAG: Node CPU bench, 28 deg frame 239 ms at full detail; setup 1.4 ms; browser figures not measured here |
| R7 | PASS | HAND · model.ts + polish.ts 9.3 KB |
| R8 | PASS | AUTO / SITE · site behaviour |
| DL1 | PASS | AUTO / HAND · 55 of 146 solids on a dropping rung · all solids tagged by the rules; no polish overrides |
| DL2 | PASS | HAND · model detail full · full |
| DL3 | PASS | rule |
| DL4 | PASS | site |
| DL5 | PASS | FLAG: bench lists rungs A 14, B 0, D 23, E 8, H 10 solids |
| Q1 | PASS | check, clamp and edge distance clean |
| Q2 | PASS | 0 clashes |
| Q3 | PASS | package written, 23.7 KB; site build not checked here · package written 23 KB; site build not run in this worktree (CI) |
| Q4 | PASS | local: tools/shot · dist/shots: plan, 28 deg, side, explode at 28 and 70 deg, both sheets, looked at |
| Q5 | PASS | local: tools/bench · bench run, flags noted |
| Q6 | PASS | this sheet |
| Q7 | PASS | tools/conformance |

## Joints
| Joint | Type | F1 locate | F2 retain | F3 torque | F4 thrust | F5 limit | F6 hold | F7 adjust | F8 lube | F9 timing | F10 protect |
|---|---|---|---|---|---|---|---|---|---|---|---|
| pO1 | J2 | 2 x Dowel pin Ø3 x 10 h6, housing to base | 2 x Internal circlip DIN 472, Ø19; Countersunk M5 x 12 (ISO 10642), into the shaft end, flush; Socket head M5 x 10 (ISO 4762), into the shaft end | Feather key 3 x 3 x 6 (DIN 6885) | Wave washer 14.5x18.8, spring steel; Thrust washer 10.2x16, bronze | 2 x Stop bumper, neoprene sleeve Ø12 | – driven by the crank and link, nothing to hold | – the offset is set at O2 | – sealed housing bearings, greased for life | Base plate; Left rocker (input) | – no slip clutch needed on a lever drive |
| pO2 | J1 | 2 x spigot | 2 x Internal circlip DIN 472, Ø19; 2 x Bearing F6800 (10x19x5) | – no keyed part; plates turn on bearings | Thrust washer 10.2x13.1, bronze | 2 x Stop bumper, neoprene sleeve Ø12 | – driven, no rest position | Eccentric bushing Ø18, 0.3 mm offset bore Ø10, flanged | Bridge over the pivot, on two spigoted posts | – no phase to mark at the pivot (the swing scale is on pO1) | – – none needed |
| pA | J3 | – no removable plate on a moving pin | Internal circlip DIN 472, Ø16; Bearing F688ZZ (8x16x5); head | – no keyed part | – bearing located by its flange and circlip, inner race clamped | – limited by the linkage and the stops at the pivots | – driven, no rest position | – the length ratio is set at O2 | – shielded bearing, greased for life | – no phase between rocker and coupler | – none needed |
| pB | J3 | – no removable plate on a moving pin | Internal circlip DIN 472, Ø16; Bearing F688ZZ (8x16x5); head | – front plate clamped on the shoulder; no keyed part | – bearing located by its flange and circlip, inner race clamped | – limited by the linkage and the stops at the pivots | – driven, no rest position | – the length ratio is set at O2 | – shielded bearing, greased for life | – no phase between coupler and rocker | – none needed |
| pO2-bridge-post | post | 2 x spigot | – screwed from both sides | – static | – static | – static | – static | – spigot in a slot takes the hole tolerance | – static | – static | – static |
| drive | drive | – bracket screwed up into the base | – set screws on the motor crank hub | – crank clamped on the motor shaft | – motor bearings | – the lever dead centres sit at the ends of the swing | – motor holds when powered | – bracket slots | – dry steel joints, no sliding | – home flag read by the fork sensor | Home flag on the drive crank; 3 x Fork sensor, slotted optical, 5 mm gap |

## Variants and overrides
| Joint or part | Rule result | Chosen | Why |
|---|---|---|---|
| right rocker | one plate, layer 0 | raised 2 mm in the model (`dz`), z 2 to 8 | the base follows the lowest part, so the right rocker rises over the O2 eccentric's flange and clamp screws instead (F7); the left rocker stays low |
| right rocker | one plate | clevis: a front plate twinned with the rear one in the model (`twin`) | A9: B in double shear |
| coupler | layer 1, z 10 to 16 | plated 0.5 mm low (`dz`), z 9.5 to 15.5 | 1.5 mm over the raised rear plate at B; 3.5 mm over the left rocker at A (forced: single shear there) |
| rockers | straight stadium | tapered in the model, bosses R13/R9.5 and R12/R9.5 | D1 |
| pO2 | dead axle straight in the base | eccentric bushing in the base, two clamp screws (`H.eccentricMount`) | F7: the pivot offset must meet the model exactly |
| left rocker stops | skipped by the rule (the drive limits the input) | `H.stops` pair 2 deg outside the swing | F5: with the drive off it would over-travel |
| drive lever | tip radius 6, wall 0.95 mm round the Ø10 bore | tip radius 7, wall 2 mm | M6 (the rule's lever failed the wall check; see promotion candidates) |

## Detail ladder
| Rung | Solids | Marks | Frame ms at this dial position |
|---|---|---|---|
| DL-A | 14 | 0 | 213.1 |
| DL-B | 0 | 213 | 210.0 |
| DL-C | 0 | 0 | 53.5 |
| DL-D | 23 | 0 | 35.1 |
| DL-E | 8 | 2 | 33.3 |
| DL-F | 0 | 0 | 31.1 |
| DL-G | 0 | 0 | 30.0 |
| DL-H | 10 | 0 | 28.5 |
| never | 91 | 170 | 235.1 (full) |

## Promotion candidates
- The rule's oscillating-drive lever (`drive.ts`, tip radius 6) leaves 0.95 mm of wall round the Ø10 input bore (M6 fails); radius 7 fixes it. Chebyshev hit the same.
- `H.eccentricMount` puts the flange and clamp screws on the base top, so a rocker on the base layer clashes with them; the polish raised the rocker 2 mm. A variant that seats the flange in the base or puts the screws at 90 degrees to the rocker would remove the raise (shared code, not changed here).
- Shared with Chebyshev: the F5 stops for the input rocker of an oscillating mechanism (`H.stops` call) and the F9 swing scale on the base.

## Verification
check: clean · clearance: 0 clashes · clamp: clean · edge distance: clean · package: 23.7 KB
screenshots: plan, 28°, side, explode at 28° and 70°, both sheets, in dist/shots (looked at; attached to #41 by David) · bench: Node CPU canvas, DPR 1.5, 2026-10-18; plan 270 ms, 28° 239 ms, side 253 ms, explode 233 ms at full detail; 8 ms is not reached on CPU Node at any dial (flag, R6; browser figures not measured)
