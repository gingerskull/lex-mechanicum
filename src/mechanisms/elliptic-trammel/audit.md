# Audit: Trammel of Archimedes (elliptic-trammel)
standard: 2.3 · date: 2026-10-18 · result: pass · detail: full · pass: build

## Summary
PASS 114 · FAIL 0 · N/A 7 · open: F7 adjustable pen distance (Open)

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
| P9 | PASS | HAND · explain read against solve(): blocks on x and y, crank O to rod midpoint, ellipse half-axes 40 and 100, midpoint circle, crank and rod opposite senses; the cut-back sentence fits the build |
| P10 | PASS | HAND · pen path (comet) and midpoint circle traced, velocity at P, A and B, groove reactions at the blocks, input spin, crank angle, pen height plot |
| P11 | PASS | DATA · plain, short sentences, no em dashes, mm and degrees |
| K1 | PASS | HAND · check: link error 2.8e-14 mm; the polish changes heights, outlines and hardware only |
| K2 | PASS | HAND · check: finite, continuous, periodic over 720 samples |
| K3 | PASS | HAND · link (crank, rod), slider (blocks), rails, caps, tracer; between, at and fixed placement |
| K4 | PASS | HAND · roles driver (crank), output (blocks), link (rod), ground (rails), pin, trace; accent only on pO |
| K5 | PASS | HAND · check clean: crank layer 0 (plated 3 mm up), blocks and rails layer 1, rod layer 2; pins join the layers they pass |
| K6 | PASS | DATA · L 60, p 40, crank 30, ellipse half-axes 40 and 100, midpoint circle 30; DIFFERS in the groove cut-back, 40 mm not 19: the crank pin circle forbids a wall nearer; commented in model.ts and the record updated (c 40, ext 91) |
| K7 | PASS | HAND · input rotary on the crank |
| D1 | PASS | HAND · tapered crank and rod, sliders with square ends on twin stadium rails |
| D2 | PASS | HAND · bosses round every pin; no windows: the parts are light and slow |
| D3 | PASS | STYLE · roles told apart by pattern and tone in both sheets |
| D4 | PASS | AUTO · feet and corner standoffs concentric with the corner arcs |
| D5 | PASS | AUTO / HAND · rails on ground pads; no bridge needed |
| D6 | PASS | HAND / STYLE · slide hardware, pads and leads read quieter than crank, rod and blocks |
| D7 | PASS | HAND · crank, rod, blocks, rails and base carry only load shape and manufacturing marks |
| A1 | PASS | AUTO · pO J2, pM, pA, pB J3, four J5 (one per groove pair) |
| A2 | PASS | AUTO · live input shaft, shoulder bolts at M, A and B, slides on the rails |
| A3 | PASS | AUTO · 6800-2RS on the Ø10 input, F686ZZ at M, F696ZZ at A, F685ZZ at B; spacers in every gap |
| A4 | PASS | AUTO · keyed input shaft with end retainer; stepped shoulder bolts |
| A5 | PASS | AUTO · feather key 3 x 3 on the Ø10 input |
| A6 | PASS | AUTO · every rail on ground steel pads, a countersunk M3 at each and two dowels; the left and lower pairs by hand (AUTO-TODO, see promotion candidates) |
| A7 | PASS | AUTO · 8 mm base, counterbored corners, feet, pen ellipse and midpoint circle engraved, front scale, clearance hole for the input shaft |
| A8 | PASS | AUTO · every head has its shank; holes cut by stage 3 |
| A9 | PASS | AUTO / HAND · single shear at M, A and B, forced: rod and crank each turn a full circle, so no cap or post reaches over a pin; the rod rides 3 mm over the blocks, two bearings far apart at the input |
| A10 | PASS | HAND · crank under the blocks, rod over them; parts whose sweeps meet are on different planes, nothing stacked only to clear |
| A11 | PASS | AUTO / HAND · pen to rod to bolts to blocks to rails, keepers and gib to pads to base; crank to keyed input to housing (screwed, dowelled); rails screwed through pads and dowelled |
| A12 | PASS | AUTO · clamp check clean |
| A13 | PASS | AUTO / HAND · 266 solids, 142 unnamed (further items of a listed set); every named item has catalogue sizes, sets counted |
| A14 | PASS | HAND · pads clear the crank sweep (radius 39.5) by more than 1 mm; rail inner ends at 40.5 clear the crank pin circle (35.5); clearance 0 |
| A15 | PASS | AUTO · clearance: 0 clashes over the cycle |
| A16 | PASS | HAND · a note on every joint, badges on the pins, five build rules |
| A17 | PASS | HAND · housing and shaft, crank; pads, rails, dowels, gib, blocks, keepers; rod over both block pins and the crank pin; bolts last |
| E1 | PASS | AUTO · one level per solid |
| E2 | PASS | AUTO · screws, bolts with their shims, shafts and bought units are groups |
| E3 | PASS | AUTO · pins and rail screws upward, housing and drive screws downward |
| E4 | PASS | HAND · rod above blocks and crank: the last part fitted goes furthest |
| E5 | PASS | AUTO · bearings and circlips stay in their parts |
| E6 | PASS | AUTO · motor with its bracket, bearings whole |
| E7 | PASS | AUTO · spacers midway |
| E8 | PASS | AUTO · crank and key keep their order on the input shaft |
| E9 | PASS | HAND · readable at full explode at 28° and 70° in both sheets |
| J1 | N/A | AUTO · no dead axle |
| J2 | PASS | AUTO · input: housing with two sealed bearings, sleeve, wave washer, circlips, screwed and dowelled; keyed shaft, pulley hub with set screws, end retainer, thrust washer, home flag |
| J3 | PASS | AUTO · M, A and B: shoulder bolts into the lower part, bearings in the rod, inner-race spacers, threadlocker; no clevis (full-circle sweeps) |
| J4 | N/A | AUTO · no pin in a slot: the blocks are slides |
| J5 | PASS | AUTO · four groove pairs: rails, keeper, bronze gib with three adjusting screws and lock nuts, grease nipple, felt wipers and neoprene-padded end stops on the first pair of each axis |
| J6 | N/A | AUTO · no gear mesh |
| J7 | N/A | AUTO · no cam |
| J8 | PASS | AUTO · flanged motor pulley, mount slotted for tension |
| F1 | PASS | AUTO · housing dowelled; each rail located by two dowels through its end pads into the base |
| F2 | PASS | AUTO · bearings by circlip and flange; keepers hold the blocks down; shaft end retainer |
| F3 | PASS | AUTO · feather key at the input |
| F4 | PASS | AUTO / HAND · bronze thrust washer on the base under the crank, wave washer preloading the input |
| F5 | PASS | AUTO / HAND · end stops with neoprene pads just past both ends of each block's travel |
| F6 | N/A | AUTO / HAND · driven; no rest position to hold |
| F7 | PASS | AUTO / HAND · bronze gib with adjusting screws and lock nuts at every groove pair; belt tension at the motor mount. L 60 and p 40 are fixed pin centres: no adjustable link is built (see open) |
| F8 | PASS | AUTO · felt wipers at both ends of each block, grease nipples on the keepers; shielded and sealed bearings |
| F9 | N/A | AUTO / HAND · one input; the blocks and rod are fixed by their pins, so the build cannot go together out of phase |
| F10 | PASS | AUTO / HAND · pulley flanges, home flag and fork sensor; no slip clutch: the stops are never touched in running |
| M1 | PASS | AUTO · edge breaks on every top face |
| M2 | PASS | HAND · no inertia-critical wheel; the crank and rod turn slowly |
| M3 | PASS | AUTO · bore entry chamfers on every seat and through hole |
| M4 | PASS | AUTO / HAND · counterbored housing screws and base corners, countersinks for the rail and keeper screws |
| M5 | PASS | AUTO / HAND · no milled pockets or windows |
| M6 | PASS | AUTO · edge distance and walls clean |
| M7 | PASS | HAND · crank and rod are hulls of circles; no inside corner |
| M8 | N/A | AUTO · no dead axle; shoulder bolts carry their undercuts (A4) |
| M9 | PASS | AUTO / HAND · bolts into the steel crank and the bronze blocks over full thickness; standard lengths |
| M10 | PASS | AUTO / HAND · steel crank and rod, bronze blocks, hardened ground rails and pads, bronze gib |
| M11 | PASS | AUTO · centre holes and chamfered ends on the shafts |
| M12 | PASS | HAND · every head reachable; bearings pressed out past their circlips |
| M13 | PASS | AUTO / HAND · threadlocker on every screw, lock nuts on the gib screws; the hand-built seats call the locking rule |
| M14 | PASS | AUTO / HAND · hardened screwed rails against bronze blocks, bronze gib: the replaceable wear parts |
| V1 | PASS | AUTO · pancake outrunner Ø50 x 18 under the base, GT2 32:16 |
| V2 | PASS | AUTO · one-piece bracket, flange screws up into the base |
| V3 | PASS | AUTO / HAND · belt and pulleys clear of feet and housing; clearance 0 |
| V4 | PASS | AUTO · flanges, set screws, slotted mount |
| V5 | PASS | AUTO · rotary: belt to the input pulley |
| V6 | PASS | AUTO · home flag, fork sensor on the housing, leads to the terminal block, one P-clip |
| L1 | PASS | STYLE · lint-style clean |
| L2 | PASS | HAND · the model and polish carry geometry, roles, marks and materials only |
| L3 | PASS | HAND · crank driver, rod link, blocks output, rails ground, hardware hw |
| L4 | PASS | HAND / STYLE · accent on the input only |
| L5 | PASS | AUTO / HAND · screws, bearings and bolts are real solids in real holes |
| L6 | PASS | AUTO · depth order right at plan, 28°, side and explode |
| L7 | PASS | STYLE · tilt 0° to 88°, no shear |
| L8 | PASS | AUTO / HAND · engraved pen ellipse, midpoint circle and scale are marks |
| R1 | PASS | HAND · H.standoff, H.screw, H.dowel, H.slide reused; the seat code for the second groove pairs repeats the rule's unexported railSeat (promotion candidate) |
| R2 | PASS | HAND · threads M2.5, M3, M4, M5; joint Ø 5, 6, 10; bearings 6800-2RS (10x19x5), F686ZZ (6x13x5), F696ZZ (6x15x5), F685ZZ (5x11x5) |
| R3 | PASS | AUTO · housing, slide and drive from their subassemblies |
| R4 | PASS | AUTO · package built at build time, 31.9 KB |
| R5 | PASS | HAND · states only what differs; no sampling; polish 4 ms |
| R6 | PASS | FLAG · FLAG: Node CPU bench, not the browser: plan 276, 28° 312, side 269, explode 227 ms at full detail; 42 ms at dial H; setup 1.7 ms |
| R7 | PASS | HAND · model.ts + polish.ts 11.1 KB |
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
| pO | J2 | 2 x Dowel pin Ø3 x 10 h6, housing to base | 2 x Internal circlip DIN 472, Ø19; Countersunk M5 x 12 (ISO 10642), into the shaft end, flush; Socket head M5 x 10 (ISO 4762), into the shaft end | Feather key 3 x 3 x 6 (DIN 6885) | Wave washer 14.5x18.8, spring steel; Thrust washer 10.2x16, bronze | none | none | – turns fully | – driven through the belt | – belt tension at the motor mount (drive) | – sealed bearings | – one input, nothing in phase | – see drive |
| pM | J3 | – no removable plate on a moving pin | Internal circlip DIN 472, Ø13; Bearing F686ZZ (6x13x5); head | – no keyed part | F686ZZ located by flange and circlip, inner race clamped | – limited by the linkage | – driven | – no adjustable length | – shielded bearing, greased for life | – no phase to keep | – none needed |
| pA | J3 | – no removable plate on a moving pin | Internal circlip DIN 472, Ø15; Bearing F696ZZ (6x15x5); head | – no keyed part | F696ZZ located by flange and circlip, inner race clamped | – limited by the slide's stops | – driven | – no adjustable length | – shielded bearing, greased for life | – no phase to keep | – none needed |
| pB | J3 | – no removable plate on a moving pin | Internal circlip DIN 472, Ø11; Bearing F685ZZ (5x11x5); head | – no keyed part | F685ZZ located by flange and circlip, inner race clamped | – limited by the slide's stops | – driven | – no adjustable length | – shielded bearing, greased for life | – no phase to keep | – none needed |
| slide-blockX | J5 | – the rails are dowelled to the base | Keeper plate, holds the slider down | – prismatic, no torque | – the keeper takes the lift, the base the weight | 2 x End stop block, hardened (whole travel) | – driven | Gib strip 3 x 6 x 44, bronze | 2 x wiper; Grease nipple M6 (DIN 71412) | – no phase to keep | – stops never touched in running |
| slide-blockY | J5 | – the rails are dowelled to the base | Keeper plate, holds the slider down | – prismatic, no torque | – the keeper takes the lift, the base the weight | 2 x End stop block, hardened (whole travel) | – driven | Gib strip 3 x 6 x 44, bronze | 2 x wiper; Grease nipple M6 (DIN 71412) | – no phase to keep | – stops never touched in running |
| slide-blockX-left | J5 | – the rails are dowelled to the base | Keeper plate, holds the slider down | – prismatic, no torque | – the keeper takes the lift, the base the weight | – the stops of the first pair serve the whole travel | – driven | Gib strip 3 x 6 x 44, bronze | Grease nipple M6 (DIN 71412); wipers on the slider | – no phase to keep | – stops never touched in running |
| slide-blockY-lower | J5 | – the rails are dowelled to the base | Keeper plate, holds the slider down | – prismatic, no torque | – the keeper takes the lift, the base the weight | – the stops of the first pair serve the whole travel | – driven | Gib strip 3 x 6 x 44, bronze | Grease nipple M6 (DIN 71412); wipers on the slider | – no phase to keep | – stops never touched in running |
| xra-seat | post | 2 x Dowel pin Ø3 h6 (ISO 8734), rail to base | – screwed down through rail and pad at each pad | – static | – static | – static | – static | – the gib on the other rail adjusts the fit | – static | – static | – static |
| xrb-seat | post | 2 x Dowel pin Ø3 h6 (ISO 8734), rail to base | – screwed down through rail and pad at each pad | – static | – static | – static | – static | – the gib on this rail adjusts the fit | – static | – static | – static |
| xla-seat | post | 2 x Dowel pin Ø3 h6 (ISO 8734), rail to base | – screwed down through rail and pad at each pad | – static | – static | – static | – static | – the gib on the other rail adjusts the fit | – static | – static | – static |
| xlb-seat | post | 2 x Dowel pin Ø3 h6 (ISO 8734), rail to base | – screwed down through rail and pad at each pad | – static | – static | – static | – static | – the gib on this rail adjusts the fit | – static | – static | – static |
| yua-seat | post | 2 x Dowel pin Ø3 h6 (ISO 8734), rail to base | – screwed down through rail and pad at each pad | – static | – static | – static | – static | – the gib on the other rail adjusts the fit | – static | – static | – static |
| yub-seat | post | 2 x Dowel pin Ø3 h6 (ISO 8734), rail to base | – screwed down through rail and pad at each pad | – static | – static | – static | – static | – the gib on this rail adjusts the fit | – static | – static | – static |
| yda-seat | post | 2 x Dowel pin Ø3 h6 (ISO 8734), rail to base | – screwed down through rail and pad at each pad | – static | – static | – static | – static | – the gib on the other rail adjusts the fit | – static | – static | – static |
| ydb-seat | post | 2 x Dowel pin Ø3 h6 (ISO 8734), rail to base | – screwed down through rail and pad at each pad | – static | – static | – static | – static | – the gib on this rail adjusts the fit | – static | – static | – static |
| drive | drive | none | none | none | none | none | none | bracket | none | none | Home flag, 1 mm steel vane; 3 x Fork sensor, slotted optical, 5 mm gap; Pulley flanges |

## Variants and overrides
| Joint or part | Rule result | Chosen | Why |
|---|---|---|---|
| xl, yd rails (left and lower pairs) | posts and no slide: the rules find a slide only where the block stands at the build phase | pads, dowels, screws and H.slide by hand, no second set of wipers and stops | each groove pair needs the same seat and slide hardware as the first (A6, J5) |
| Crank and rod plating | none | crank dz +3, rod on its layer | crank 1 mm under the blocks; rod 3 mm over the blocks so the keepers run under it |

## Detail ladder
| Rung | Solids | Marks | Frame ms at this dial position |
|---|---|---|---|
| DL-A | 12 | 0 | 219 |
| DL-B | 0 | 263 | 207 |
| DL-C | 0 | 0 | 84 |
| DL-D | 23 | 0 | 65 |
| DL-E | 14 | 0 | 60 |
| DL-F | 0 | 0 | 61 |
| DL-G | 0 | 0 | 58 |
| DL-H | 56 | 0 | 42 |
| never | 161 | 147 | 42 |

## Promotion candidates
- Slide detection per groove pair: `slides()` in `rules/classify.ts` finds a slider only where it stands in the pair's span at the build phase (U0), so a block that crosses between pairs gets one slide. Export `railSeat` from `rules/standoffs.ts` and let one slider own several rail pairs; then the hand seats and the second `H.slide` calls in this polish go away. A 45 degree phase offset in the model is the current workaround.
- Blocks that cross the input pivot: the crank sits under them, the rod over them, the grooves cut back to the crank pin circle. A rule or recipe for this layout would serve the Tusi couple and the do-nothing family.
- Wipers and end stops once per slider when it runs on several rail pairs.

## Open
- F7 (Appendix A): the pen distance p and the block distance L are fixed pin centres; no adjustable slider pin or sleeve is built. Decision for David: add an adjustable pen sleeve on the rod?
- The blocks cross the cut-back opening (under 20 mm from the crossing) on the rod's guidance only; the catalogue's cut-back is 19 mm and the build's 40 mm (K6, record updated).
- Single shear at M, A and B: forced by full-circle sweeps; flagged.
- Bench numbers are Node CPU, not the browser.

## Verification
check: clean (720 samples) · clearance: 0 clashes · clamp: clean · edge distance: clean · package: 31.9 KB
screenshots: plan, 28 degrees, side, explode at 28 and 70 degrees in both sheets, made with tools/shot (to attach to #24) · bench (Node CPU, median of 24, ms): plan 275.7, 28 degrees 312.4, side 269.3, explode 226.7; setup 1.69; dial full 294.6 to H 41.7
