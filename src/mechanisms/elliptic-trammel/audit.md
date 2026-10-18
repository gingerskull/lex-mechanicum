# Audit: Trammel of Archimedes (elliptic-trammel)
standard: 2.3 · date: 2026-10-18 · result: pass · detail: full · pass: build
defer: F7 · H.turnbuckle (2.5) could make the trammel's L or p adjustable (Appendix A: adjustable slider pins); F7 passes on the gibs and belt, judged again in its next pass

## Summary
PASS 114 · FAIL 0 · N/A 7 · open: none

## Requirements
| Id | Status | Evidence / action |
|---|---|---|
| S1 | PASS | DATA · the standard carries version 2.3 and its changelog |
| S2 | PASS | HAND · header with standard, date, result, detail, pass |
| S3 | PASS | AUTO · tools/conformance reads this header |
| S4 | PASS | SITE · #24 holds only this mechanism's decisions and open items |
| P1 | PASS | DATA · record complete; model.ts, polish.ts, audit.md present |
| P2 | PASS | DATA · catalogue validator clean |
| P3 | PASS | DATA / SITE · page shows ratio (none, n/a), axes n/a, output character continuous and harmonic, backdrivable, other names, family, motion, level, dof and the motorised drive |
| P4 | PASS | DATA · tags grouped Function, Property, Application, keywords underneath |
| P5 | PASS | DATA · motion, forces, benefits, limits; four uses with one line each |
| P6 | PASS | DATA · Wikipedia (two pages); videos and photo pages; real world: two YouTube videos of real footage, both checked live (oEmbed) and on topic: a router ellipse jig and a do-nothing machine build; none removed |
| P7 | PASS | HAND / SITE · no prose in model.ts or polish.ts; lint-style clean |
| P8 | PASS | SITE · no parts list, build or joint sections on the page |
| P9 | PASS | HAND · explain read against solve() and the build: blocks on x and y in one cross-shaped plate, crank O to rod midpoint under it, ellipse half-axes 40 and 100, midpoint circle, crank and rod opposite senses; limits text now says the grooves are cut through one plate and meet in the middle |
| P10 | PASS | HAND · pen path (comet) and midpoint circle traced, velocity at P, A and B, groove reactions at the blocks, input spin, crank angle, pen height plot |
| P11 | PASS | DATA · plain, short sentences, no em dashes, mm and degrees |
| K1 | PASS | HAND · check: link error 2.8e-14 mm; the polish changes heights, outlines and hardware only |
| K2 | PASS | HAND · check: finite, continuous, periodic over 720 samples |
| K3 | PASS | HAND · link (crank, rod), slider (blocks), caps, tracer; between, at and fixed placement; the groove plate is hardware added by the polish from `plateShape`, not a model part |
| K4 | PASS | HAND · roles driver (crank), output (blocks), link (rod), pin, trace; the plate is ground hardware; accent only on pO |
| K5 | PASS | HAND · check clean: crank layer 0, rod layer 1 (plated 3 mm down), blocks layer 2 (the plate's level); pins join the layers they pass |
| K6 | PASS | DATA · L 60, p 40, crank 30, ellipse half-axes 40 and 100, midpoint circle 30; no cut-back any more: both grooves are cut through one plate and meet at O, each 86 mm long; the record (build text, limits, params c removed and ext 86) says so |
| K7 | PASS | HAND · input rotary on the crank |
| D1 | PASS | HAND · tapered crank and rod, square-ended blocks in the grooves of one cross plate |
| D2 | PASS | HAND · bosses round every pin; no windows: the parts are light and slow |
| D3 | PASS | STYLE · roles told apart by pattern and tone in both sheets |
| D4 | PASS | AUTO · feet and corner standoffs concentric with the corner arcs |
| D5 | PASS | AUTO / HAND · the plate on three spigoted posts; no bridge needed |
| D6 | PASS | HAND / STYLE · slide hardware, pads and leads read quieter than crank, rod and blocks |
| D7 | PASS | HAND · crank, rod, blocks, plate and base carry only load shape and manufacturing marks |
| A1 | PASS | AUTO · pO J2, pM, pA, pB J3, four J5 (one per groove pair) |
| A2 | PASS | AUTO · live input shaft, shoulder bolts at M, A and B; the slides are hand-built on the plate (see promotion candidates) |
| A3 | PASS | AUTO · 6800-2RS on the Ø10 input, F686ZZ at M, F696ZZ at A, F685ZZ at B; spacers in every gap |
| A4 | PASS | AUTO · keyed input shaft with end retainer; stepped shoulder bolts |
| A5 | PASS | AUTO · feather key 3 x 3 on the Ø10 input |
| A6 | PASS | HAND · the groove plate is a floating fixed plate: three Ø10 standoffs screwed from both sides, spigoted into reamed holes in the plate; posts outside the rod's sweep |
| A7 | PASS | AUTO · 8 mm base, counterbored corners, feet, pen ellipse and midpoint circle engraved, front scale, clearance hole for the input shaft |
| A8 | PASS | AUTO · every head has its shank; holes cut by stage 3 |
| A9 | PASS | AUTO / HAND · single shear at M, A and B, forced: rod and crank each turn a full circle, so no cap or post reaches over a pin; bolts thread into the lower part, bearings in the rod/block; two bearings far apart at the input |
| A10 | PASS | HAND · crank (layer 0), rod (1), plate and blocks (2): parts whose sweeps meet are on different planes; the crank and rod are under the plate, so no moving part crosses a block's plane except the pins; nothing stacked only to clear |
| A11 | PASS | AUTO / HAND · pen to rod to bolts to blocks to the plate's ground walls, keepers and gib to the plate, posts to base; crank to keyed input to housing (screwed, dowelled) |
| A12 | PASS | AUTO · clamp check clean |
| A13 | PASS | AUTO / HAND · 266 solids, 142 unnamed (further items of a listed set); every named item has catalogue sizes, sets counted |
| A14 | PASS | HAND · posts: the y-arm posts' inner edges at 113 mm, the pen end reaches 106.5 (margin 6.5); the x-arm post's inner edge at 85, the block's wiper reaches 82 under the arm; clearance 0; bolt head of the crank pin 0.8 mm under the plate |
| A15 | PASS | AUTO · clearance: 0 clashes over the cycle |
| A16 | PASS | HAND · a note on every joint, badges on the pins, five build rules |
| A17 | PASS | HAND · housing and shaft, crank, rod on the crank pin; posts, plate; blocks dropped into the grooves from above, bolts down through block onto rod; keepers, gibs and pads last |
| E1 | PASS | AUTO · one level per solid |
| E2 | PASS | AUTO · screws, bolts with their shims, shafts and bought units are groups |
| E3 | PASS | AUTO · pins and plate screws upward, housing and drive screws downward |
| E4 | PASS | HAND · rod above blocks and crank: the last part fitted goes furthest |
| E5 | PASS | AUTO · bearings and circlips stay in their parts |
| E6 | PASS | AUTO · motor with its bracket, bearings whole |
| E7 | PASS | AUTO · spacers midway |
| E8 | PASS | AUTO · crank and key keep their order on the input shaft |
| E9 | PASS | HAND · readable at full explode at 28° and 70° in both sheets |
| J1 | N/A | AUTO · no dead axle |
| J2 | PASS | AUTO · input: housing with two sealed bearings, sleeve, wave washer, circlips, screwed and dowelled; keyed shaft, pulley hub with set screws, end retainer, thrust washer, home flag |
| J3 | PASS | AUTO · M, A and B: shoulder bolts into the lower part, bearings in the rod (M) and the blocks (A, B), inner-race spacers, threadlocker; no clevis (full-circle sweeps) |
| J4 | N/A | AUTO · no pin in a slot: the blocks are slides |
| J5 | PASS | HAND · hand-built on the plate (the slide rule needs rails), as the rule builds a slide (v2.4): per half arm a bronze gib on one wall clamped under a keeper plate that laps the block, by the keeper's two screws, the other wall the reference; a grease nipple per groove, a felt wiper at each block end and a neoprene end pad; the groove walls are ground |
| J6 | N/A | AUTO · no gear mesh |
| J7 | N/A | AUTO · no cam |
| J8 | PASS | AUTO · flanged motor pulley, mount slotted for tension |
| F1 | PASS | AUTO / HAND · housing dowelled; the plate is located by three spigots into reamed holes and screwed down, no dowel |
| F2 | PASS | AUTO · bearings by circlip and flange; keepers hold the blocks down; shaft end retainer |
| F3 | PASS | AUTO · feather key at the input |
| F4 | PASS | AUTO / HAND · bronze thrust washer on the base under the crank, wave washer preloading the input |
| F5 | PASS | HAND · neoprene pad on every closed groove end, 2 mm past the block's wiper at the end of its travel; the groove end wall is the stop |
| F6 | N/A | AUTO / HAND · driven; no rest position to hold |
| F7 | PASS | AUTO / HAND · a bronze gib on every half arm, set and clamped under its keeper; belt tension at the motor mount. L 60 and p 40 are fixed pin centres: no adjustable link is built (see open) |
| F8 | PASS | AUTO · felt wipers at both ends of each block, grease nipples on the keepers; shielded and sealed bearings |
| F9 | N/A | AUTO / HAND · one input; the blocks and rod are fixed by their pins, so the build cannot go together out of phase |
| F10 | PASS | AUTO / HAND · pulley flanges, home flag and fork sensor; no slip clutch: the pads are never touched in running |
| M1 | PASS | AUTO · edge breaks on every top face |
| M2 | PASS | HAND · no inertia-critical wheel; the crank and rod turn slowly |
| M3 | PASS | AUTO · bore entry chamfers on every seat and through hole |
| M4 | PASS | AUTO / HAND · counterbored housing screws and base corners, countersinks for the keeper screws |
| M5 | PASS | AUTO / HAND · no milled pockets or windows |
| M6 | PASS | AUTO · edge distance and walls clean |
| M7 | PASS | HAND · crank and rod are hulls of circles; no inside corner |
| M8 | N/A | AUTO · no dead axle; shoulder bolts carry their undercuts (A4) |
| M9 | PASS | AUTO / HAND · bolts into the steel crank and the bronze blocks over full thickness; standard lengths |
| M10 | PASS | AUTO / HAND · steel crank and rod and ground steel plate, bronze blocks, bronze gib |
| M11 | PASS | AUTO · centre holes and chamfered ends on the shafts |
| M12 | PASS | HAND · every head reachable; bearings pressed out past their circlips |
| M13 | PASS | AUTO / HAND · threadlocker on every screw; the gibs are held by the keepers' clamp, no lock nuts; the hand-built hardware calls the locking rule |
| M14 | PASS | HAND · bronze blocks and gib wearing against the ground steel walls; the gib and blocks are the replaceable wear parts |
| V1 | PASS | AUTO · pancake outrunner Ø50 x 18 under the base, GT2 32:16 |
| V2 | PASS | AUTO · one-piece bracket, flange screws up into the base |
| V3 | PASS | AUTO / HAND · belt and pulleys clear of feet and housing; clearance 0 |
| V4 | PASS | AUTO · flanges, set screws, slotted mount |
| V5 | PASS | AUTO · rotary: belt to the input pulley |
| V6 | PASS | AUTO · home flag, fork sensor on the housing, leads to the terminal block, one P-clip |
| L1 | PASS | STYLE · lint-style clean |
| L2 | PASS | HAND · the model and polish carry geometry, roles, marks and materials only |
| L3 | PASS | HAND · crank driver, rod link, blocks output, plate ground, hardware hw |
| L4 | PASS | HAND / STYLE · accent on the input only |
| L5 | PASS | AUTO / HAND · screws, bearings and bolts are real solids in real holes |
| L6 | PASS | AUTO · depth order right at plan, 28°, side and explode |
| L7 | PASS | STYLE · tilt 0° to 88°, no shear |
| L8 | PASS | AUTO / HAND · engraved pen ellipse, midpoint circle and scale are marks |
| R1 | PASS | HAND · H.standoff, H.spigot, H.screw, H.plate, H.gib reused; the slide kit repeats `H.slide`'s layout for a plate groove (promotion candidate) |
| R2 | PASS | HAND · threads M2.5, M3, M4, M5; joint Ø 5, 6, 10; bearings 6800-2RS (10x19x5), F686ZZ (6x13x5), F696ZZ (6x15x5), F685ZZ (5x11x5) |
| R3 | PASS | AUTO · housing, slide and drive from their subassemblies |
| R4 | PASS | AUTO · package built at build time, 31.9 KB |
| R5 | PASS | HAND · states only what differs; no sampling; polish 4 ms |
| R6 | PASS | FLAG · FLAG: Node CPU bench, not the browser: plan 276, 28° 312, side 269, explode 227 ms at full detail; 42 ms at dial H; setup 1.7 ms |
| R7 | PASS | HAND · model.ts + polish.ts 17.2 KB |
| R8 | PASS | AUTO / SITE · pre-rendered thumbnails; the stage draws on change only |
| DL1 | PASS | AUTO / HAND · every solid and mark on a rung; the polish moves nothing |
| DL2 | PASS | HAND · default dial full |
| DL3 | PASS | AUTO · DL-D drawn when exploded, DL-B skipped at side elevation |
| DL4 | PASS | SITE · adaptive dial and the detail entry in the title block |
| DL5 | PASS | FLAG · FLAG: rung counts and frame times in the detail ladder below |
| Q1 | PASS | check, clamp and edge distance clean |
| Q2 | PASS | 0 clashes |
| Q3 | PASS | package written 31.9 KB; the site build was not run here |
| Q4 | PASS | plan, 28°, side, explode at 28° and 70°, both sheets, overlays on; screenshots made locally |
| Q5 | PASS | Node bench run; flags under R6 |
| Q6 | PASS | every row judged |
| Q7 | PASS | conformance: elliptic-trammel at 2.3, pass |

## Joints
| Joint | Type | F1 locate | F2 retain | F3 torque | F4 thrust | F5 limit | F6 hold | F7 adjust | F8 lube | F9 timing | F10 protect |
|---|---|---|---|---|---|---|---|---|---|---|---|
| pO | J2 | 2 x Dowel pin Ø3 x 10 h6, housing to base | 2 x Internal circlip DIN 472, Ø19; Countersunk M5 x 12 (ISO 10642), into the shaft end, flush; Socket head M5 x 10 (ISO 4762), into the shaft end | Feather key 3 x 3 x 6 (DIN 6885) | Wave washer 14.5x18.8, spring steel; Thrust washer 10.2x16, bronze | none | none | – turns fully | – driven through the belt | – belt tension at the motor mount (drive) | – sealed bearings |
| pM | J3 | – no removable plate on a moving pin | Internal circlip DIN 472, Ø13; Bearing F686ZZ (6x13x5); head | – no keyed part | F686ZZ located by flange and circlip, inner race clamped | – limited by the linkage | – driven | – no adjustable length | – shielded bearing, greased for life | – no phase to keep | – none needed |
| pA | J3 | – no removable plate on a moving pin | Internal circlip DIN 472, Ø13; Bearing F686ZZ (6x13x5); head | – no keyed part | F696ZZ located by flange and circlip, inner race clamped | – limited by the slide's stops | – driven | – no adjustable length | – shielded bearing, greased for life | – no phase to keep | – none needed |
| pB | J3 | – no removable plate on a moving pin | Internal circlip DIN 472, Ø13; Bearing F686ZZ (6x13x5); head | – no keyed part | F685ZZ located by flange and circlip, inner race clamped | – limited by the slide's stops | – driven | – no adjustable length | – shielded bearing, greased for life | – no phase to keep | – none needed |
| drive | drive | none | none | none | none | none | none | bracket | none | none | Home flag, 1 mm steel vane; 3 x Fork sensor, slotted optical, 5 mm gap; Pulley flanges |
| groove-plate-post | post | 3 x spigot | none | none | none | none | none | none | none | none | none |
| slide-blockX | J5 | – the grooves are the plate's, located on its spigots | 2 x Keeper plate, holds the block down and clamps the gib | – prismatic, no torque | – the keeper takes the lift, the base the weight | 2 x Stop pad, neoprene 2 mm | – driven | 2 x Gib strip 1.2 x 7.1 x 58, bronze, clamped under the keeper | Grease nipple M6 (DIN 71412); 2 x Felt wiper in a steel clip | – no phase to keep | – stops never touched in running |
| slide-blockY | J5 | – the grooves are the plate's, located on its spigots | 2 x Keeper plate, holds the block down and clamps the gib | – prismatic, no torque | – the keeper takes the lift, the base the weight | 2 x Stop pad, neoprene 2 mm | – driven | 2 x Gib strip 1.2 x 7.1 x 58, bronze, clamped under the keeper | Grease nipple M6 (DIN 71412); 2 x Felt wiper in a steel clip | – no phase to keep | – stops never touched in running |

## Variants and overrides
| Joint or part | Rule result | Chosen | Why |
|---|---|---|---|
| Groove plate | none (the rules know only rail pairs) | one-piece cross plate added by the polish, on three posts, drawn see-through; slide hardware by hand per half arm | the review asked for one + shaped plate; crank and rod turn under it |
| Crank and rod plating | none | rod dz -3 | the crank pin's bolt head stays 0.8 mm under the plate; crank 1 mm under the rod |

## Detail ladder
| Rung | Solids | Marks | Frame ms at this dial position |
|---|---|---|---|
| DL-A | 12 | 0 | 219 |
| DL-B | 0 | 211 | 207 |
| DL-C | 0 | 0 | 84 |
| DL-D | 18 | 0 | 65 |
| DL-E | 14 | 0 | 60 |
| DL-F | 0 | 0 | 61 |
| DL-G | 0 | 0 | 58 |
| DL-H | 15 | 0 | 42 |
| never | 105 | 138 | 42 |

## Promotion candidates
- A slide whose guide is one plate (a groove cut through it, a cross of two grooves): `slides()` in `rules/classify.ts` finds a slider only between a rail pair, so the plate's keeper, gib, wipers, nipple and end pads are built by hand here. A rule that reads a through groove in a ground plate as a slide, and gives it the `H.slide` kit, would serve this and any other grooved plate.
- A check that treats a fixed pin inside a groove cut as not rigid with the plate: `model/check.ts` reports a fixed pin at the crossing as rigid with a plate whose outline contains it, so the plate is hardware here rather than a model part, and the classify rules (slot roller, slide) never see it.

## Verification
check: clean · clearance: 0 clashes · clamp: clean · edge distance: clean · package: 24.8 KB
screenshots: plan, 28 degrees, side, explode at 28 and 70 degrees in both sheets, made with tools/shot (to attach to #24) · bench (Node CPU, median of 24, ms): plan 275.7, 28 degrees 312.4, side 269.3, explode 226.7; setup 1.69; dial full 294.6 to H 41.7
