# Audit: Bistable compliant mechanism (bistable-compliant)
standard: 2.13 · date: 2026-10-20 · result: pass · detail: full · pass: build

## Summary
PASS 113 · FAIL 0 · N/A 15 · open: none

## Requirements
| Id | Status | Evidence / action |
|---|---|---|
| S1 | PASS | DATA · the standard carries version 2.13 and its changelog |
| S2 | PASS | HAND · header with standard, date, result, detail, pass |
| S3 | PASS | AUTO · tools/conformance reads this header and runs in npm run check |
| S4 | PASS | SITE · #149 holds only this mechanism's decisions and open items |
| P1 | PASS | DATA · record complete; model.ts, polish.ts, audit.md present |
| P2 | PASS | DATA · catalogue validator clean |
| P3 | PASS | DATA / SITE · ratio (none, two stable positions at ±6.95 mm), axes same line, toggle and dwell output, backdrivable, other names, family, motion, level, dof and the motorised drive |
| P4 | PASS | DATA · tags grouped Function, Property, Application, keywords underneath |
| P5 | PASS | DATA · motion, forces, benefits, limits; three uses with one line each |
| P6 | PASS | DATA · two Wikipedia pages, a BYU engineering page and a BYU thesis; two videos and a photo page; real_world empty (none rather than a wrong one) |
| P7 | PASS | HAND / SITE · no prose in model.ts or polish.ts; lint-style clean |
| P8 | PASS | SITE · no parts list, build or joint sections on the page |
| P9 | PASS | HAND · solve() holds the shuttle at +6.95 and -6.95 mm (L0 sin θ0), the beams' force F(y) = 2 ka (L0 - L) y / L is zero there and at the centre and peaks at 4.09 N at y = ±3.99 mm; the shuttle follows the pusher through the springs, snaps across near the peak and dwells at each end, as explain says |
| P10 | PASS | HAND · shuttle centre and the left beam's midpoint traced (the beam's bend shows in its path), velocity at the shuttle, the beams' and the pusher's lines of action, the bend at both ends of each beam, push force plot (the springs' force: the beams' S curve on each branch, a fast swing at the snap) |
| P11 | PASS | DATA · plain, short sentences, no em dashes, mm and degrees |
| K1 | PASS | HAND · check: max link error 0.0e+0 mm; beam chords, the shuttle's balance against the springs, the snap and the springs' lengths are solved; the beams' outline is drawn from the solved state; the polish changes materials, two solid kinds and notes only |
| K2 | PASS | HAND · check: finite, continuous, periodic over 720 samples |
| K3 | PASS | HAND · custom (anchor pads, beams, shuttle, pusher, springs), rails, cap; the beams are deforming parts placed at their anchors (48 points each, fixed count); the springs stretched between the window's ends and the roller's rim |
| K4 | PASS | HAND · roles: driver (pusher), output (shuttle), link (beams, springs), ground (pads, guide bars), pin; accent on the pusher's pin pQ only, the input of a linear mechanism |
| K5 | PASS | HAND · check clean: the blank (pads, beams, shuttle) on layer 0, the pusher and its guide on layer 1; pQ spans both; moving pin radius 5.5 |
| K6 | PASS | DATA · L0 40 mm, θ0 10°, ka 50 N/mm, anchors at ±39.4 mm, stable states ±6.95 mm as the catalogue; the snap at the force peak as the build note says (decided on #149): the pusher drives the shuttle through two preloaded springs, 0.4 N/mm together, so the shuttle snaps where the beams' force falls faster than the springs' rate, at y = ±3.43 mm and 3.98 N, 97 % of the 4.09 N peak at ±3.99 mm (a softer spring snaps closer to it, with a longer stroke); the range's "snaps at y = 0" is the stiff-pusher limit; the shuttle's guide is the pusher's slide through the roller in its window; all said in a code comment |
| K7 | PASS | HAND · input linear on the pusher |
| D1 | PASS | HAND · the blank's pads and shuttle are plain blocks, the beams thin bands, the shuttle's window square-ended for the springs; the pusher a slider with square ends on two stadium rails and a tapered arm to the boss round its pin |
| D2 | PASS | HAND · material where the load runs: the pusher's arm tapers from the block to the boss; the beams are the only thin sections, as the function needs; no windows |
| D3 | PASS | STYLE · roles told apart by pattern and tone in both sheets |
| D4 | PASS | AUTO · base corners from the form style, feet concentric with the corner arcs |
| D5 | PASS | AUTO / HAND · each pad clamped on a ground seat under one clamp plate; rails on ground risers |
| D6 | PASS | HAND / STYLE · slide hardware, clamps, stops, drive and leads read quieter than the blank and the pusher |
| D8 | N/A | AUTO / HAND · every part lies on z: the mechanism works in one plane |
| D9 | PASS | AUTO / HAND · the two beams are deforming outlines from the solved state and the two springs stretched between the window's ends and the roller (bench: 4 changing solids, 1000 items); each beam is a fixed-guided beam, straight as made and an S in the far state, the catalogue's 'bend the beams visually'; the bend overlay marks the stress zone at each end |
| D7 | PASS | HAND · pads, shuttle, pusher, rails and base carry only load shape and manufacturing marks |
| A1 | PASS | AUTO · pQ J4, slide-pusher J5, flexure-beamL and flexure-beamR J13 |
| A2 | PASS | AUTO · a roller stud in the shuttle's window, the pusher's slide, two compliant joints at the anchors (the shuttle end of each beam is the same beam, cut into the shuttle: no joint of its own) |
| A3 | PASS | AUTO · Ø8 roller stud: the largest bore the 12 mm window takes with its walls; Ø11.7 track roller |
| A4 | PASS | AUTO · ground shoulder on the roller stud, undercut thread; no axle |
| A5 | N/A | AUTO · no keyed part: the motor pulley is a D-bore on a D-flat shaft |
| A6 | PASS | AUTO · both rails on one ground riser each, screwed down, the reference rail dowelled; each anchor pad on a 2 mm ground seat plate of its outline (J13), no posts under the blank |
| A7 | PASS | AUTO · 8 mm base, counterbored corners, feet, the shuttle's and the beam's paths engraved, front scale, the carriage slot |
| A8 | PASS | AUTO · every head has its shank; holes cut by stage 3, through clamp plate, pad and seat; the dowels' reamed holes by J13 |
| A9 | PASS | HAND · pQ is single shear (badge warn): the roller hangs under the pusher in the shuttle's window, and the blank runs 2 mm over the base, so there is no room for a plate under it; the overhang is the roller's own length over a ground shoulder; the pads are clamped from above and seated below (both sides held) |
| A10 | PASS | HAND · the whole blank on one layer (it is one part); the pusher one layer over it, because it crosses the shuttle |
| A11 | PASS | HAND · push: pusher, roller stud, roller, a spring, the shuttle's window end, the beams in compression, the pads, the clamp plates, seats and dowels, the base; the pusher's side load to its slide; over-travel: the shuttle's ends onto the banking pins pressed into the base |
| A12 | PASS | AUTO · clamp check clean |
| A13 | PASS | AUTO / HAND · every solid named with catalogue sizes, sets counted |
| A14 | PASS | HAND · the banking pins stand 1.4 mm past the shuttle's ends at each end of its travel; the pusher's arm passes 3 mm over the north pins (z 7 to 10); the rails' risers start 4 mm north of the north pins; the springs keep 1.8 mm over their solid length and stay preloaded; clearance 0 |
| A15 | PASS | AUTO · clearance: 0 clashes over the cycle |
| A16 | PASS | HAND · a note and a badge on every joint; five build rules |
| A17 | PASS | HAND · base, rail risers and rails, seats; the blank on the seats, dowels, clamp plates and screws; banking pins pressed in first; the springs into the window; pusher on its slide with the keeper and gib; roller stud from above between the springs; belt drive from below |
| E1 | PASS | AUTO · one level per solid; levels -8 to 2 |
| E2 | PASS | AUTO · screws, the roller stud with its shim, and bought units are groups |
| E3 | PASS | AUTO · clamp screws, rail screws and the stud upward, drive screws downward |
| E4 | PASS | HAND · stud and clamp screws off first, then clamp plates, pusher and keeper, then the blank whole off its seats and dowels; seats midway to the base |
| E5 | PASS | AUTO · wear strips and felt stay in the shuttle, the roller on its stud |
| E6 | PASS | AUTO · motor with its bracket, roller whole, belt in the pulley plane |
| E7 | PASS | AUTO · the stud's spacer and the pads' seats midway |
| E8 | N/A | AUTO · no keyed shaft stack |
| E9 | PASS | HAND · readable at full explode at 28° and 70° in both sheets: the blank lifts whole between its seats and clamps; nothing inside another part; nothing leaves the frame |
| J1 | N/A | no fixed pin |
| J2 | N/A | no live shaft |
| J3 | N/A | no moving pin between links |
| J4 | PASS | AUTO · pQ: shoulder bolt M6 through the pusher, Ø11.7 track roller in the shuttle's window between two hardened wear strips (2 x M2 csk each), felt oiler, inner-race spacer |
| J5 | PASS | AUTO · dowelled reference rail, keeper plate, bronze gib clamped under the keeper by the rail screws, felt wipers, grease nipple, the end stop at the motor end; the arm end stop dropped by the rule (the arm passes there): past the drive's stroke the shuttle's banking pins hold the shuttle and the springs take the pusher |
| J6 | N/A | no gear mesh |
| J7 | N/A | no cam |
| J8 | PASS | AUTO · flanged motor pulley, idler on a slotted tensioner arm |
| J9 | N/A | no crossed-axis mesh |
| J10 | N/A | no shaft in plan |
| J12 | N/A | no flexible member: the beams bend, they are not a chain, rope or belt |
| J13 | PASS | AUTO · both anchors: the beam drawn from the solved state with its bend overlay; the pad on a ground seat plate, clamped under a plate, two M4 screws, two Ø3 dowels reamed through pad, plate and seat; the stop pins bank the shuttle (it moves without turning) 1.4 mm past each end of its travel |
| J11 | N/A | no screw |
| F1 | PASS | AUTO · two dowels per anchor pad set the 78.8 mm span that makes the blank bistable; the reference rail dowelled |
| F2 | PASS | AUTO · pads clamped under plates; the roller stud's head and the keeper hold the pusher; the roller's own bearing is sealed |
| F3 | N/A | AUTO · no keyed part: the slide holds the pusher from turning, the beams hold the shuttle |
| F4 | PASS | AUTO · the roller's inner race is clamped through its spacer; the keeper takes the pusher's lift |
| F5 | PASS | AUTO · four hardened Ø5 pins bank the shuttle's ends 1.4 mm past each end of its travel (J13); the slide's end stop at the motor end |
| F6 | PASS | HAND · the beams hold the shuttle in either state with no power; two preloaded compression springs couple the pusher to the shuttle, so the shuttle can snap ahead of it |
| F7 | PASS | AUTO · gib set on slotted holes under the keeper; belt tension at the idler arm; the span is fixed by dowels on purpose, the blank's as-made geometry sets the states |
| F8 | PASS | AUTO · felt oiler on the roller's window, wipers and a nipple on the slide; the blank's flexures need none |
| F9 | N/A | no phase to keep: the springs leave the shuttle on the pusher's side after one stroke whatever the start |
| F10 | PASS | AUTO · pulley flanges, home flag and fork sensor at the motor end of the stroke, leads to the terminal block |
| M1 | PASS | AUTO · edge breaks on every top face |
| M2 | PASS | HAND · nothing heavy reverses but the pusher, whose arm is tapered to its load; bosses round every loaded hole |
| M3 | PASS | AUTO · bore entry chamfers on every seat and through hole |
| M4 | PASS | AUTO / HAND · counterbored base corners, countersinks for the rail and wear strip screws |
| M5 | PASS | AUTO / HAND · the window has square ends for the springs, small corner radii; no pockets |
| M6 | PASS | AUTO · edge distance and walls clean |
| M7 | N/A | HAND · no bracket or plate with a load-turning corner; the beams join pad and shuttle at their faces |
| M8 | PASS | AUTO · undercut on the roller stud's thread |
| M9 | PASS | AUTO / HAND · the stud through the 6 mm bronze pusher (1 d); clamp screws through the base; wear strip screws M2 into the acetal shuttle over 3.8 mm (1.9 d); standard lengths |
| M10 | PASS | AUTO / HAND · materials named on every solid; the blank one acetal part (override of J13's 7075), pads seated on ground steel, hardened banking pins, spring steel springs |
| M11 | PASS | AUTO · chamfered stud end |
| M12 | PASS | HAND · every head reachable from above or below; the roller comes out with its stud; the banking pins pressed out from under the base |
| M13 | PASS | AUTO · threadlocker or nyloc on every threaded part |
| M14 | PASS | AUTO · hardened wear strips in the shuttle's window walls, hardened rails and a bronze gib on the slide |
| V1 | PASS | AUTO · pancake outrunner Ø50 x 18 under the base, GT2 16T pulleys |
| V2 | PASS | AUTO · one-piece bracket, flange screws up into the base |
| V3 | PASS | AUTO / HAND · belt and pulleys clear of feet and the clamp screws; clearance 0 |
| V4 | PASS | AUTO · flanges, slotted tensioner with an idler |
| V5 | PASS | AUTO · linear: belt loop under the base along the 15 mm stroke, carriage through a slot in the base clamped to the pusher, tensioner on the far pulley |
| V6 | PASS | AUTO · home flag, fork sensor at the motor end of the stroke, leads to the terminal block, one P-clip |
| L1 | PASS | STYLE · lint-style clean |
| L2 | PASS | HAND · the model and polish carry geometry, roles, marks and materials only |
| L3 | PASS | HAND · pusher driver, shuttle output, beams link, pads and guide ground, hardware hw |
| L4 | PASS | HAND / STYLE · accent on the pusher's pin only, with the traced path and forces |
| L5 | PASS | AUTO / HAND · the roller, its stud, the springs, screws and dowels are real solids in real holes; the shuttle's window shows past the pusher |
| L6 | PASS | AUTO · depth order right at plan, 28°, side and explode, the deforming beams included |
| L7 | PASS | STYLE · tilt 0° to 88°, no shear |
| L8 | PASS | AUTO / HAND · engraved paths and scale are marks |
| R1 | PASS | HAND · every standard part from the rules and H; the polish adds no solid |
| R2 | PASS | HAND · threads M2, M3, M4, M6; stud Ø8; no bearings but the bought track roller |
| R3 | PASS | AUTO · slide and drive from their subassemblies |
| R4 | PASS | AUTO · package 15.4 KB |
| R5 | PASS | HAND · states only what differs: the blank's material, the springs' kind and material, notes; no sampling |
| R6 | PASS | FLAG · browser bench, DPR 1.5: plan 1.87, 28° 2.45, side 1.85, explode 70° 2.22 ms; setup 6 ms; under every target |
| R7 | PASS | HAND · model.ts + polish.ts 14.9 KB |
| R8 | PASS | AUTO / SITE · pre-rendered thumbnails; the stage draws on change only |
| DL1 | PASS | AUTO / HAND · every solid and mark on a rung; the polish moves nothing |
| DL2 | PASS | HAND · default dial full |
| DL3 | PASS | AUTO · DL-D drawn when exploded, DL-B skipped at side elevation |
| DL4 | PASS | SITE · adaptive dial and the detail entry in the title block |
| DL5 | PASS | FLAG · rung counts and frame times in the detail ladder below |
| Q1 | PASS | check, clamp and edge distance clean |
| Q2 | PASS | 0 clashes |
| Q3 | PASS | package written, 15.4 KB; npm run check passes |
| Q4 | PASS | plan, 28°, side, explode at 28° and 70°, both sheets, looked at (dist/shots-bistable-compliant, local) |
| Q5 | PASS | browser bench; no flag |
| Q6 | PASS | every row judged; no FAIL |
| Q7 | PASS | conformance: bistable-compliant at 2.13, pass |

## Joints
| Joint | Type | F1 locate | F2 retain | F3 torque | F4 thrust | F5 limit | F6 hold | F7 adjust | F8 lube | F9 timing | F10 protect |
|---|---|---|---|---|---|---|---|---|---|---|---|
| pQ | J4 | – no removable plate on a moving pin | head | – the slide holds the pusher, the beams the shuttle | – the roller's inner race clamped through its spacer | – the shuttle's banking pins and the slide's stop | – driven; the beams hold the shuttle | – fixed centre | Felt oiler, oil-soaked wool felt | – no phase to keep | – none needed |
| slide-pusher | J5 | – the reference rail is dowelled to the base | Keeper plate, holds the slider down | – prismatic, no torque | – the keeper takes the lift, the base the weight | End stop block, hardened | – driven | Gib strip 66 x 7 x 1.3, bronze, slotted, clamped under the keeper | 2 x wiper; Grease nipple M6 (DIN 71412) | – no phase to keep | – stops never touched in running |
| flexure-beamL | J13 | 2 x Dowel pin Ø3, blank to base | Clamp plate 18 x 26 x 4 over the blank's block | – no torque: the pad is clamped | – the seat and clamp take the pad both ways | 2 x Stop pin Ø5, hardened, banking the shuttle just past each end of its travel | – the beams hold both states: the function | – the span fixed by the dowels, on purpose | – a flexure needs none | – no phase to keep | – banking pins keep the beams in their range |
| flexure-beamR | J13 | 2 x Dowel pin Ø3, blank to base | Clamp plate 18 x 26 x 4 over the blank's block | – no torque: the pad is clamped | – the seat and clamp take the pad both ways | 2 x Stop pin Ø5, hardened, banking the shuttle just past each end of its travel | – the beams hold both states: the function | – the span fixed by the dowels, on purpose | – a flexure needs none | – no phase to keep | – banking pins keep the beams in their range |
| guidea-seat | post | – not dowelled: the gib on it takes up the fit against the reference rail | – screwed down through keeper, gib, rail and riser | – static | – static | – static | – static | – the gib on this rail adjusts the fit | – static | – static | – static |
| guideb-seat | post | 2 x Dowel pin Ø3 h6 (ISO 8734), rail to base | – screwed down through rail and riser | – static | – static | – static | – static | – the gib on the other rail adjusts the fit | – static | – static | – static |
| drive | drive | – bracket screwed up into the base | – pulleys on D-flat shaft and bearing | – motor pulley, D-bore on a D-flat shaft | – motor bearings | – the shuttle's banking pins and the slide's stop | – motor holds when powered | Tensioner arm, slotted, 2 x M4 | – belt runs dry | – home flag read by the fork sensor | Home flag, 1 mm steel vane; 3 x Fork sensor, slotted optical, 5 mm gap; Pulley flanges |

## Variants and overrides
| Joint or part | Rule result | Chosen | Why |
|---|---|---|---|
| blank | one material, 7075-T6 (J13) | acetal POM-C | a plastic blank snaps at a finger's force; the beams' 50 N/mm is the catalogue's |
| springs | stretched parts with the materials rule's aluminium | compression springs, spring steel | they are the drive's coupling, not a link |
| snap | catalogue range: at the centre; build note: at the force peak | at 97 % of the force peak, through the springs | K6, decided on #149 |

## Detail ladder
| Rung | Solids | Marks | Frame ms at this dial position |
|---|---|---|---|
| DL-A | 2 | 0 | 2.26 |
| DL-B | 0 | 147 | 1.97 |
| DL-C | 0 | 0 | 1.65 |
| DL-D | 2 | 0 | 1.54 |
| DL-E | 12 | 0 | 1.51 |
| DL-F | 0 | 0 | 1.45 |
| DL-G | 0 | 0 | 1.37 |
| DL-H | 15 | 0 | 1.31 |
| never | 80 | 35 | 2.4 (full) |

## Promotion candidates
- None. The seats, the reamed dowels, the stops banking a guided shuttle, fixed bending parts swept rather than ground and the blank's one material were promoted to rules in standard 2.13.

## Verification
check: clean · clearance: 0 clashes · clamp: clean · edge distance: clean · package: 15.4 KB
screenshots: plan, 28°, side, explode at 28° and 70°, both sheets, looked at (dist/shots-bistable-compliant, local) · bench: browser, RTX 5090, DPR 1.5, 2026-10-20; 28° frame 2.4 ms at full detail, no flag
