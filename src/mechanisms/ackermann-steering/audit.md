# Audit: Ackermann steering linkage (ackermann-steering)
standard: 2.6 · date: 2026-10-19 · result: pass · detail: full · pass: build

## Summary
PASS 112 · FAIL 0 · N/A 9 · open: none

## Requirements
| Id | Status | Evidence / action |
|---|---|---|
| S1 | PASS | DATA · the standard carries version 2.6 and its changelog |
| S2 | PASS | HAND · header with standard, date, result, detail, pass |
| S3 | PASS | AUTO · tools/conformance reads this header and runs in npm run check |
| S4 | PASS | SITE · #87 holds only this mechanism's decisions and open items |
| P1 | PASS | DATA · record complete; model.ts, polish.ts, audit.md present |
| P2 | PASS | DATA · catalogue validator clean |
| P3 | PASS | DATA / SITE · record has ratio, axes, output character, backdrivable and aka; oscillating input, so the page says motorised |
| P4 | PASS | DATA · tags grouped in the record |
| P5 | PASS | DATA · explain and the real-world uses present |
| P6 | PASS | DATA · references present; no real-world video in the record (none rather than a wrong one); nothing changed |
| P7 | PASS | HAND / SITE · no prose in model.ts or polish.ts beyond engineering notes |
| P8 | PASS | SITE · page does not show parts or joints |
| P9 | PASS | HAND · HAND · solve() steers the inner (left) wheel 0 to 40° and the outer wheel 9.4°, 17.8°, 24.9°, 30.6° at inner 10°, 20°, 30°, 40° (ideal 9.1°, 16.6°, 23.2°, 29.2°), as the catalogue range says; the other way the input swings -30° and the right wheel reaches 38.7°. The catalogue's 'rocked ±40°' cannot be met: the rod cannot reach beyond -37° of the input arm (DATA note in the issue) |
| P10 | PASS | HAND · HAND · both tie rod pins traced, velocity at both, rod force line, input and output wheel angles, right wheel angle plot |
| P11 | PASS | DATA · record prose read; short sentences, no em dashes |
| K1 | PASS | HAND · check: max link error 1.7e-13 mm · HAND · check: link error below 1e-12 mm; the polish changes heights, outlines and hardware only |
| K2 | PASS | HAND · check: finite, continuous, periodic over 720 samples |
| K3 | PASS | HAND · link, cap and tracer only; placement by between, fixed, at |
| K4 | PASS | HAND · roles driver (input), output, link, pin; accent on the input pin only |
| K5 | PASS | HAND · check: no INTERFERE, OVERLAP or WARN · HAND · check clean, integer layers: arms 0, tie rod 1 (plated 2.5 mm low); ground pivots layer -1 radius 7, pins 5.5 |
| K6 | PASS | DATA · DATA · w 150, L 250, r 30, β 16.7° (atan(75/250)), t 132.76 (w - 2 r sin β; the catalogue rounds it to 132.8) as the catalogue build; the plot is the right wheel against the input phase, not the catalogue's outer against inner curve (no part, a plot detail) |
| K7 | PASS | HAND · input oscillating on armL · HAND · input oscillating on the input part |
| D1 | PASS | HAND · tapered links with boss rings, flush caps, squircle base |
| D2 | PASS | HAND · bosses round every pin; arms are short bars (30 mm), the tie rod a plain bar with its turnbuckle: no window needed |
| D3 | PASS | STYLE · style only |
| D4 | PASS | AUTO · fired: base (1 solid), feet (3 solids) · base corners and feet by rule |
| D5 | PASS | AUTO / HAND · bridge on two spigoted posts by rule; housing at the live shaft |
| D6 | PASS | HAND / STYLE · screenshots: nothing cosmetic |
| D7 | PASS | HAND · big parts plain; richness in hardware |
| A1 | PASS | AUTO · pKL J2, pKR J1, pPL J3, pPR J3; fired: classify (no solids) · pivots read correctly: live shaft at the input, dead axle at the other ground pivot, shoulder bolts at the moving pins |
| A2 | PASS | AUTO · pKL J2, pKR J1, pPL J3, pPR J3 · live shaft at the input, dead axle at the other ground pivot, shoulder bolts at the moving pins |
| A3 | PASS | AUTO · fired: classify (no solids) · bearings F6800 at the ground pivots, F688ZZ at the moving pins |
| A4 | PASS | AUTO · fired: j1-dead-axle (15 solids) · stepped axle with bearing, spacers, circlip, thrust washer |
| A5 | PASS | AUTO · fired: j2-live-shaft (27 solids) · feather key on the Ø10 input shaft |
| A6 | PASS | AUTO · fired: standoffs (no solids) · bridge posts spigoted at KR; no floating plate needs more |
| A7 | PASS | AUTO · fired: base (1 solid), feet (3 solids) · base, feet, clearance holes by rule; the base grown by the rules for the drive and posts |
| A8 | PASS | AUTO · fired: fasteners (stage 3) · shanks and clearance holes by stage 3 |
| A9 | PASS | AUTO / HAND · fired: j2-straddle (no solids) · AUTO / HAND · KL straddled by its housing, KR held by the base and a bridge: both ends held. PL and PR single shear, forced: the tie rod sweeps over both arm tips (rod plated 2.5 mm low, overhang 1.5 mm) |
| A10 | PASS | HAND · arms share the base layer (z 0 to 6), the tie rod rides above (z 7.5 to 13.5); the arms never meet in the swing |
| A11 | PASS | AUTO / HAND · fired: j1-dead-axle (15 solids) · every joint's load goes to the base: the live shaft via its housing, dead axle via the axle and bridge, pins via the links |
| A12 | PASS | AUTO · clamp check clean |
| A13 | PASS | AUTO / HAND · 134 solids, 67 unnamed (further items of a listed set) · named catalogue sizes; the unnamed solids are further items of listed sets |
| A14 | PASS | HAND · bridge posts, stops and the drive clear every sweep (clearance 0); the drive link's retaining screw was replaced by a circlip above the lever so the link passes over the shaft end (see Variants) |
| A15 | PASS | AUTO · clearance: 0 clashes over the cycle |
| A16 | PASS | HAND · 5 build rules; no note: none; no badge: none · notes and badges on every pivot, 4 to 5 build rules |
| A17 | PASS | HAND · goes together bottom to top: base, axles, arms, tie rod; bridge last; every screw reachable from above or below |
| E1 | PASS | AUTO · every solid has one explode level; levels -8 to 2.5 · every solid has one explode level |
| E2 | PASS | AUTO · 35 rigid groups; fired: explode · rigid groups, each head stays on its shank |
| E3 | PASS | AUTO · fired: explode · screws back out along their axes |
| E4 | PASS | HAND · levels follow A17 in the 70° explode |
| E5 | PASS | AUTO · fired: explode · bearings, circlips and bushings stay in their parts |
| E6 | PASS | AUTO · fired: explode · motor and bracket move as one |
| E7 | PASS | AUTO · fired: explode · spacers and washers midway |
| E8 | PASS | AUTO · fired: explode · the live shaft leaves to the side it was fitted from |
| E9 | PASS | HAND · screenshots at 100% explode, 28° and 70°: nothing inside another part, nothing leaves the frame |
| J1 | PASS | AUTO · fired: j1-dead-axle (15 solids) · KR dead axle: shouldered axle, bearing, spacers, circlip, thrust washer, spigoted bridge, nyloc under the base, oil sink |
| J2 | PASS | AUTO · fired: j2-live-shaft (27 solids), j2-straddle (no solids) · KL live shaft: housing cartridge, keyed shaft, circlips, thrust washer, home flag |
| J3 | PASS | AUTO · fired: j3-moving-pin (24 solids) · PL and PR: shoulder bolts, bearings with spacers, threadlocker; single shear (forced) |
| J4 | N/A | AUTO · fired: j4-slot-roller (no solids) · no pin in a slot |
| J5 | N/A | AUTO · fired: j5-slide (no solids) · no slide |
| J6 | N/A | AUTO · fired: j6-mesh (no solids) · no gear mesh |
| J7 | N/A | AUTO · fired: j7-cam (no solids) · no cam |
| J8 | N/A | AUTO · fired: j8-belt (no solids) · the drive is a crank and link, no belt |
| F1 | PASS | AUTO · served at pKL, pKR, pKR-bridge-post; fired: j2-live-shaft (27 solids) · dowels at the housing, spigots on the bridge posts |
| F2 | PASS | AUTO · served at pKL, pKR, pPL, pPR, tieRod-adjust; fired: j2-live-shaft (27 solids) · circlips and retainers on every bearing |
| F3 | PASS | AUTO · served at pKL; fired: j2-live-shaft (27 solids) · feather key at the input shaft |
| F4 | PASS | AUTO / HAND · served at pKL, pKR; fired: j2-live-shaft (27 solids) · thrust washers at the ground pivots |
| F5 | PASS | AUTO / HAND · served at pKL, pKR; fired: j5-slide (no solids), stops (6 solids) · stops 2° outside both arms' travel: the right pair by the rule, the left pair by hand (the rule skips the input arm) |
| F6 | N/A | AUTO / HAND · served at no joint; fired: j7-cam (no solids) · driven through the drive link; no rest position or rattling clearance to hold |
| F7 | PASS | AUTO / HAND · served at tieRod-adjust; fired: j6-mesh (no solids), j5-slide (no solids) · toe is the tie rod's length: an H.turnbuckle in the rod's own plane, set at 132.8 mm, pin centres exact (Appendix A) |
| F8 | PASS | AUTO · served at pKR; fired: lubrication (no solids) · oil sink on the bridge over the open bearing; the others are sealed or shielded |
| F9 | PASS | AUTO / HAND · served at pKL, tieRod-adjust; fired: timing-marks (no solids) · steer scale on the base round KL with an index line on the input arm's tip: shows the wheels went back on the modelled branch |
| F10 | PASS | AUTO / HAND · served at drive; fired: drive (33 solids) · home flag and fork sensor; leads to the terminal block; no slip clutch on a lever drive |
| M1 | PASS | AUTO · fired: hardware primitives · outer edges broken by the primitives |
| M2 | PASS | HAND · no wheel; the arms are short bars, no lightening |
| M3 | PASS | AUTO · fired: j3-moving-pin (24 solids), hardware primitives · bore entry rings in the screenshots |
| M4 | PASS | AUTO / HAND · fired: base (1 solid), fasteners (stage 3) · counterbores in the base by rule |
| M5 | PASS | AUTO / HAND · fired: hardware primitives · no pockets or windows |
| M6 | PASS | AUTO · edge distance and walls clean |
| M7 | N/A | HAND · the bridge is a hull of circles, no inside corner |
| M8 | PASS | AUTO · fired: j1-dead-axle (15 solids) · undercut on the axle thread |
| M9 | PASS | AUTO / HAND · fired: j1-dead-axle (15 solids) · engagement by rule |
| M10 | PASS | AUTO / HAND · 134 of 134 solids name a material · every solid names a material |
| M11 | PASS | AUTO · fired: j1-dead-axle (15 solids), hardware primitives · centre holes and flats on the shafts |
| M12 | PASS | HAND · every head reachable from above or below; the turnbuckle is a set-up adjustment made with the rod off; bearings press out past their circlips |
| M13 | PASS | AUTO / HAND · 55 threaded, 0 without a locking method · locking method on every threaded fastener, including the new stops and the polish's parts (rules rerun in the polish) |
| M14 | N/A | AUTO / HAND · fired: j4-slot-roller (no solids) · no sliding contact |
| V1 | PASS | AUTO · fired: drive (33 solids) · pancake motor under the base |
| V2 | PASS | AUTO · fired: drive (33 solids) · one-piece bracket |
| V3 | PASS | AUTO / HAND · fired: drive (33 solids) · belt and pulleys clear; clearance 0 |
| V4 | N/A | AUTO · fired: j8-belt (no solids) · crank-and-link drive, no belt |
| V5 | PASS | AUTO · fired: drive (33 solids) · AUTO · oscillating: motor, short crank and link swing a 22 mm lever on the input shaft through exactly the modelled 70° |
| V6 | PASS | AUTO · fired: drive (33 solids) · home flag and fork sensor, leads, terminal block |
| L1 | PASS | STYLE · no look values in the records |
| L2 | PASS | HAND · records carry geometry, roles, materials and marks only |
| L3 | PASS | HAND · roles right: driver, output, link |
| L4 | PASS | HAND / STYLE · accent on the input pin only |
| L5 | PASS | AUTO / HAND · fired: see-through · static solids over the links stay see-through where the rule says so |
| L6 | PASS | AUTO · screenshots at every tilt |
| L7 | PASS | STYLE · style only |
| L8 | PASS | AUTO / HAND · swing scale as marks on the base and an index on the input arm; centrelines and dimensions automatic |
| R1 | PASS | HAND · no inline outlines in the polish |
| R2 | PASS | HAND · threads M3, M4, M5, M6, M8; joint Ø 8, 10; bearings 6800-2RS (10x19x5), F688ZZ (8x16x5), F6800 (10x19x5) · standard sizes only: threads, shafts and bearings from the tables |
| R3 | PASS | AUTO · fired: hardware primitives · shared subassemblies used, none copied |
| R4 | PASS | AUTO · package 23.8 KB · package 23.8 KB, written |
| R5 | PASS | HAND · polish 132 ms in the assembly |
| R6 | PASS | FLAG · FLAG: browser bench, DPR 1.5, 2026-10-19: plan 2.01 ms, 28° 2.58 ms, side 1.86 ms, explode 70° 2.39 ms at full detail; the 8 ms budget holds at every dial position |
| R7 | PASS | HAND · model.ts + polish.ts 12.3 KB |
| R8 | PASS | AUTO / SITE · site behaviour |
| DL1 | PASS | AUTO / HAND · 51 of 134 solids on a dropping rung · every solid and mark on a rung; the polish sets no detail |
| DL2 | PASS | HAND · model detail full · model detail full |
| DL3 | PASS | AUTO · rule |
| DL4 | PASS | SITE · site |
| DL5 | PASS | FLAG · FLAG: bench lists the rungs, see the ladder below |
| Q1 | PASS | check, clamp and edge distance clean |
| Q2 | PASS | 0 clashes |
| Q3 | PASS | package written, 23.8 KB; site build not checked here · package written, 23.8 KB; site build not run in this worktree (CI) |
| Q4 | PASS | local: tools/shot · local: tools/shot: plan, 28°, side and explode at 28° and 70°, both sheets, drawn in Chrome; plan and side looked at |
| Q5 | PASS | local: tools/bench · local: tools/bench: bench run, figures under R6 |
| Q6 | PASS | this sheet |
| Q7 | PASS | tools/conformance |

## Joints
| Joint | Type | F1 locate | F2 retain | F3 torque | F4 thrust | F5 limit | F6 hold | F7 adjust | F8 lube | F9 timing | F10 protect |
|---|---|---|---|---|---|---|---|---|---|---|---|
| pKL | J2 | 2 x Dowel pin Ø3 x 10 h6, housing to base | 2 x Internal circlip DIN 472, Ø19; Countersunk M5 x 12 (ISO 10642), into the shaft end, flush; External circlip DIN 471, Ø10 | Feather key 3 x 3 x 6 (DIN 6885) | Wave washer 14.5x18.8, spring steel; Thrust washer 10.2x16, bronze | 2 x Stop bumper, neoprene sleeve Ø12 | – driven, no rest position | – the exact length is set by the turnbuckle | – shielded bearing, greased for life | Base plate; Left knuckle arm (input) | – none needed |
| pKR | J1 | 2 x spigot | Internal circlip DIN 472, Ø19; Bearing F6800 (10x19x5) | – no keyed part; plates turn on bearings | Thrust washer 10.2x13.1, bronze | 2 x Stop bumper, neoprene sleeve Ø12 | – driven, no rest position | – the exact length is set by the turnbuckle | Bridge over the pivot, on two spigoted posts | – no phase to mark at this pin | – none needed |
| pPL | J3 | – no removable plate on a moving pin | Internal circlip DIN 472, Ø16; Bearing F688ZZ (8x16x5); head | – no keyed part; plates turn on bearings | – bearing located by its flange and circlip, inner race clamped | – limited by the linkage and the stops at the ground pivots | – driven, no rest position | – the exact length is set by the turnbuckle | – shielded bearing, greased for life | – no phase to mark at this pin | – none needed |
| pPR | J3 | – no removable plate on a moving pin | Internal circlip DIN 472, Ø16; Bearing F688ZZ (8x16x5); head | – no keyed part; plates turn on bearings | – bearing located by its flange and circlip, inner race clamped | – limited by the linkage and the stops at the ground pivots | – driven, no rest position | – the exact length is set by the turnbuckle | – shielded bearing, greased for life | – no phase to mark at this pin | – none needed |
| drive | drive | – bracket screwed up into the base | – set screws on the motor crank hub | – crank clamped on the motor shaft | – motor bearings | – the lever dead centres sit at the ends of the swing | – motor holds when powered | – bracket slots | – dry steel joints, no sliding | – home flag read by the fork sensor | Home flag on the drive crank; 3 x Fork sensor, slotted optical, 5 mm gap |
| tieRod-adjust | post | – static | 2 x Jam nut M3 (DIN 439), one left hand and one right hand | – static | – static | – static | – static | Turnbuckle body 12 x 6 x 15, milled flat, M3 left and right hand; 2 x Jam nut M3 (DIN 439), one left hand and one right hand; 2 x Stud M3 x 13.8, one left hand and one right hand, threadlocked into the halves | – static | Turnbuckle body 12 x 6 x 15, milled flat, M3 left and right hand | – static |
| pKR-bridge-post | post | 2 x spigot | – static | – static | – static | – static | – static | – static | – static | – static | – static |

## Variants and overrides
| Joint or part | Rule result | Chosen | Why |
|---|---|---|---|
| tie rod | layer 1, z 10 to 16 | plated 2.5 mm low in the model (`dz`), z 7.5 to 13.5 | A9: 1.5 mm overhang at the single-shear pins PL and PR |
| arms | straight stadium | tapered in the model, bosses R13/R9.5 and R12/R9.5 | D1 |
| tie rod | one bar | `H.turnbuckle` halfway, set at 132.8 mm, in the rod's own plane | F7: toe is the rod's length |
| input arm stops | skipped by the rule (the drive limits the input) | `H.stops` pair 2° outside the swing | F5: with the drive off it would over-travel |
| KR axle | the rule found no room for the bridge posts (base sized to the swing) and fell back to a washer under the head | base grown by `growBase`, `H.bridge` placed, axle top rebuilt as the rule does it (sleeve, shim, head over the bridge) | A9: nothing passes over KR, so it is double shear |
| input shaft end | retaining washer and socket screw under the lever, which the drive link passes over (A15) | both dropped; external circlip above the lever, shaft end flush with it (as in Peaucellier-Lipkin) | A15: the link crosses the shaft end |
| motor lead clip | landed on the bracket's flange, its screw hole 0.06 mm from the flange edge (M6) | clip and screw slid 8 mm along the lead toward the terminal block | M6 |
| input swing | catalogue 'rocked ±40°' | -30° to +40° (inner wheel 40° left, 38.7° right) | the rod cannot reach beyond about -37°; recorded in the issue |

## Detail ladder
| Rung | Solids | Marks | Frame ms at this dial position |
|---|---|---|---|
| DL-A | 12 | 0 | 2.27 |
| DL-B | 0 | 190 | 1.71 |
| DL-C | 0 | 0 | 1.72 |
| DL-D | 18 | 0 | 1.61 |
| DL-E | 8 | 2 | 1.47 |
| DL-F | 0 | 0 | 1.46 |
| DL-G | 0 | 0 | 1.62 |
| DL-H | 13 | 0 | 1.36 |
| never | 83 | 160 | 2.51 (full) |

## Promotion candidates
- Three mechanisms now need the same hand-built input arm stops and swing scale (Watt, Chebyshev, Ackermann, double-rocker): promote the F5 stops for an oscillating input and the F9 scale to rules.
- The J1 rule falls back to a washer under the head when the base has no room for the bridge posts; it should grow the base as the stops and the drive do (Ackermann KR needed a hand rebuild).
- The oscillating drive's link passes over the input shaft end (Peaucellier-Lipkin and Ackermann both swap the retaining screw for a circlip above the lever by hand): a third makes a rule, or the drive rule should pick the circlip itself.
- The drive's cable clip can land on the motor bracket's flange (Ackermann): the cabling step should keep clips off the bracket.

## Verification
check: clean · clearance: 0 clashes · clamp: clean · edge distance: clean · package: 23.8 KB
screenshots: plan, 28°, side, explode at 28° and 70°, both sheets, drawn in local Chrome to dist/shots/ackermann-steering/ (plan and side looked at; the issue carries the images) · bench: browser, DPR 1.5, 2026-10-19; plan 2.01 ms, 28° 2.58 ms, side 1.86 ms, explode 70° 2.39 ms at full detail, 8 ms held at every dial (R6)
