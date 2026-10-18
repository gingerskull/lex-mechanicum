# Audit: Oscillating cylinder engine (oscillating-cylinder)
standard: 2.3 · date: 2026-10-18 · result: pass · detail: full · pass: build

## Summary
PASS 116 · FAIL 0 · N/A 5 · open: none

## Requirements
| Id | Status | Evidence / action |
|---|---|---|
| S1 | PASS | DATA · the standard carries version 2.3 and its changelog |
| S2 | PASS | HAND · header with standard, date, result, detail, pass |
| S3 | PASS | AUTO · tools/conformance reads this header and runs in npm run check |
| S4 | PASS | SITE · #31 holds only this mechanism's decisions and open items |
| P1 | PASS | DATA · record complete; model.ts, polish.ts, audit.md present |
| P2 | PASS | DATA · catalogue validator clean; record unchanged |
| P3 | PASS | DATA / SITE · ratio (stroke 70 mm), axes, output character, backdrivable, other names, family, motion, level, dof and the motorised drive come from the record |
| P4 | PASS | DATA · tags grouped Function, Property, Application, keywords underneath |
| P5 | PASS | DATA · motion, forces, benefits, limits; four uses with one line each, three real-world videos |
| P6 | PASS | DATA · Wikipedia pages, a hard source, two videos and two photo pages; the three real-world YouTube videos checked: each id resolves to a video titled for an oscillating steam engine (Diesbar paddle steamer, large model first run, five small models); playback not watched end to end here |
| P7 | PASS | HAND / SITE · no prose in model.ts or polish.ts; lint-style clean |
| P8 | PASS | SITE · no parts list, build or joint sections on the page |
| P9 | PASS | HAND · explain matches solve(): swing ±17.0° (plot), piston stroke 70 mm, torque nil at the dead centres, port switch at the dead centres |
| P10 | PASS | HAND · crank pin and piston centre paths traced, velocity at both, piston thrust line, input spin, swing angle at the trunnion, cylinder swing plot |
| P11 | PASS | DATA · record unchanged; plain, short sentences, no em dashes |
| K1 | PASS | HAND · check: link error 0 mm; the polish changes heights and outlines only; the model's bore corners are sharp in model.ts and filleted in the polish (cutter radius, M5) |
| K2 | PASS | HAND · check: finite, continuous, periodic over 720 samples |
| K3 | PASS | HAND · custom (crank, rod, cylinder floor, frame, cover), disc (standard), caps; placement by between, at and fixed |
| K4 | PASS | HAND · roles driver (crank), link (rod), output (cylinder block), ground (standard), pin; accent only on the input cap pO2 |
| K5 | PASS | HAND · check clean. Layers: crank 0 (plated up), floor 0, frame and piston 1, cover 2, standard and ground pivots -1; `dz` plating in model.ts keeps the block contiguous (floor 12, frame 10, piston 9, cover 6 thick); ground pivots R7, moving pin R5.5 |
| K6 | PASS | DATA · r 35, d 120, Lp 120, bore 90, ports ±11° on R13, standard R24, swing ±17.0°, stroke 70: as the catalogue. Bore, piston and block widths, the port hole size (Ø3) and the notch are the site's own (a comment in model.ts) |
| K7 | PASS | HAND · input rotary on the crank, as the catalogue note says the crank is animated as the driver; the catalogue's physical input (steam on the piston) is shown by the piston thrust overlay. Decision for David: motor drive stays rotary |
| D1 | PASS | HAND · counterweighted crank as the slider-crank's, stadium-ended rod with a bored boss, block of squircle-cornered plates, round standard |
| D2 | PASS | HAND · bosses round every pin; counterweight where it balances the pin and the big end; no windows needed |
| D3 | PASS | STYLE · roles told apart by pattern and tone in both sheets (seen) |
| D4 | PASS | AUTO · feet concentric with the corner arcs (seen at plan) |
| D5 | PASS | AUTO / HAND · one shaped bridge on two spigoted posts over the trunnion; the standard on two standoffs |
| D6 | PASS | HAND / STYLE · stops, bridge, nipple and drive read quieter than crank, rod and block |
| D7 | PASS | HAND · crank, rod, block plates and standard carry only load shape and manufacturing marks |
| A1 | PASS | AUTO · pO2 J2, pA J3, pO3 J4 (a fixed stud in the piston's open notch, built as a dead axle with a track roller) |
| A2 | PASS | AUTO · live input shaft at O2, shoulder bolt at A, trunnion axle with a roller in the notch |
| A3 | PASS | AUTO · 6800-2RS on the Ø10 input, 688ZZ on the Ø8 crank pin, F6800 and 6000 on the Ø10 trunnion; spacers in every gap |
| A4 | PASS | AUTO · stepped shouldered axle and bolt with undercut threads; keyed input shaft with end retainer |
| A5 | PASS | AUTO · feather key 3 x 3 on the Ø10 input shaft |
| A6 | PASS | AUTO · the standard sits on two Ø10 standoffs screwed from both sides; its top screws are countersunk flush so the port face runs clear (polish, see variants) |
| A7 | PASS | AUTO · 8 mm base 2 mm under the lowest part, counterbored corners, feet, clearance holes for the input shaft and the trunnion axle |
| A8 | PASS | AUTO · every head has its shank; stage 3 holes cut. The block's own screws and dowels have their clearance holes cut in the polish, because floor, frame and cover are separate bodies and stage 3 treats bodies apart (promotion candidate) |
| A9 | PASS | HAND · A is single shear and forced: the rod sweeps over the input shaft at the far end of the stroke (a front crank plate collides with the shaft, tried and rejected); the crank is plated up to shorten the overhang. The trunnion stud is held top and bottom (base and bridge). Input shaft on two bearings in its housing |
| A10 | PASS | HAND · crank, floor and standard low, frame and piston in one plane, cover on top; nothing stacked only to clear something |
| A11 | PASS | HAND · crank pin to crank to keyed input to the housing (screwed and dowelled); piston to rod to the crank pin; cylinder block to floor and cover bearings to the axle to the base and the bridge; block screwed and dowelled |
| A12 | PASS | AUTO · clamp check clean |
| A13 | PASS | AUTO / HAND · every solid named with catalogue sizes, sets counted |
| A14 | PASS | HAND · bridge posts and stops clear the block's sweep, the nipple clears the bridge arms; clearance 0 over the cycle |
| A15 | PASS | AUTO · clearance: 0 clashes over the cycle |
| A16 | PASS | HAND · a note and a badge on every pin joint, five build rules |
| A17 | PASS | HAND · housing, shaft, crank, rod on the crank pin; standard, thrust washer, floor on its bearing, frame with the piston, cover, then the four block screws and two dowels; roller and strips on the piston notch; spring, washer and bridge last, axle head on top; stops on the base |
| E1 | PASS | AUTO · one level per solid |
| E2 | PASS | AUTO · screws, bolts with their shims, shafts and bought units are groups (seen exploded) |
| E3 | PASS | AUTO · block screws and bridge screws up, housing and drive screws down |
| E4 | PASS | HAND · cover above frame above floor, bridge and axle head last; seen at full explode |
| E5 | PASS | AUTO · bearings and circlips stay in their plates |
| E6 | PASS | AUTO · motor with its bracket, bearings whole |
| E7 | PASS | AUTO · spacers and the spring washer midway |
| E8 | PASS | AUTO · crank and key keep their order on the input shaft |
| E9 | PASS | HAND · seen at full explode at 70° and 28°: nothing inside another part, nothing leaves the frame |
| J1 | N/A | the trunnion is a fixed stud in a slot: classified J4 and built as a dead axle by the J4 rule |
| J2 | PASS | AUTO · input: housing with two bearings, sleeve, wave washer, circlips, screwed and dowelled; keyed shaft, pulley hub with set screws, end retainer, thrust washer, home flag |
| J3 | PASS | AUTO · A: shoulder bolt threaded into the crank, bearing in the rod, inner-race spacers, threadlocked |
| J4 | PASS | AUTO · O3: Ø10 axle through standard, floor and cover with bearings and a Ø14.7 track roller in the piston notch between two hardened wear strips, a felt oiler, thrust washer on the base, bridge on top |
| J5 | N/A | no rails and slider in the rule's sense; the piston slides in the frame's bore, which the polish lines with wear strips (M14); no gib or keeper: the bore walls and the cover and floor guide it on all sides |
| J6 | N/A | no gear mesh |
| J7 | N/A | no cam |
| J8 | PASS | AUTO · flanged motor pulley, mount slotted for tension |
| F1 | PASS | AUTO / HAND · housing and bridge dowelled and spigoted; the block's frame and cover located on the floor by two dowels |
| F2 | PASS | AUTO · bearings held by circlips and flanges; shaft end retainers; crank pin head |
| F3 | PASS | AUTO · feather key at the input |
| F4 | PASS | AUTO · bronze thrust washer under the standard on the axle, wave washer preloading the input, bronze washer under the spring |
| F5 | PASS | AUTO · rubber-faced stops just beyond the ±17° swing |
| F6 | PASS | HAND · compression spring Ø18 x 10 on the trunnion sleeve, through a bronze washer on the cover bearing's flange, holds the port face on the standard (Appendix A) |
| F7 | N/A | no exact length ratio and no slide or gear mesh to set; belt tension at the motor mount (drive) |
| F8 | PASS | AUTO / HAND · felt oiler and wear strips at the trunnion roller, grease nipple on the cover feeding the bore; sealed and shielded bearings; the port face is oiled by the steam in service (not modelled) |
| F9 | PASS | HAND · swing scale engraved on the base round the trunnion with an index line on the cover's head end: shows the cylinder went back on the modelled phase |
| F10 | PASS | AUTO / HAND · pulley flanges, home flag and fork sensor; no slip clutch: the stops are never touched in running |
| M1 | PASS | AUTO · edge breaks on every top face |
| M2 | PASS | HAND · counterweight lobe on the crank balancing the pin, big end and part of the rod; the block is plain, the cylinder is not inertia-critical |
| M3 | PASS | AUTO · bore entry chamfers on every seat and through hole |
| M4 | PASS | AUTO / HAND · counterbored housing screws and base corners, countersunk standard screws; the block's M3 socket heads sit on the plain cover face |
| M5 | PASS | AUTO / HAND · bore and neck corners rounded to a 2 mm cutter radius |
| M6 | PASS | AUTO · edge distance and walls clean |
| M7 | PASS | HAND · inside corners of the bore filleted; the crank is a hull of circles |
| M8 | PASS | AUTO · undercuts on the shoulder bolt and axle threads |
| M9 | PASS | AUTO / HAND · bolt and axle thread lengths from the rules; the block's M3 x 25 screws go 9 mm into the 12 mm aluminium floor (over 1.5 d) |
| M10 | PASS | AUTO / HAND · materials named on every solid |
| M11 | PASS | AUTO · centre holes and chamfered ends on the shafts |
| M12 | PASS | HAND · every head reachable when assembled; the bearings can be pressed out past their circlips |
| M13 | PASS | AUTO / HAND · threadlocker on every screw, nyloc nut on the axle |
| M14 | PASS | AUTO / HAND · hardened wear strips screwed into the piston notch where the roller runs (rule); two hardened wear strips screwed into the bore walls where the piston slides (polish) |
| V1 | PASS | AUTO · pancake outrunner Ø50 x 18 under the base, GT2 32:16 |
| V2 | PASS | AUTO · one-piece bracket, flange screws up into the base |
| V3 | PASS | AUTO / HAND · belt and pulleys clear of feet and housing; clearance 0 |
| V4 | PASS | AUTO · flanges, set screws, slotted mount |
| V5 | PASS | AUTO · rotary: belt to the input pulley |
| V6 | PASS | AUTO · home flag, fork sensor, leads to the terminal block, one P-clip |
| L1 | PASS | STYLE · lint-style clean |
| L2 | PASS | HAND · model and polish carry geometry, roles, marks and materials only |
| L3 | PASS | HAND · crank driver, rod link, block output, standard ground, hardware hw |
| L4 | PASS | HAND / STYLE · accent on the input only |
| L5 | PASS | AUTO / HAND · screws, bearings, roller and spring are real solids in real holes; the see-through test in the clearance suite passes |
| L6 | PASS | AUTO · depth order right at plan, 28°, side and explode (seen) |
| L7 | PASS | STYLE · tilt 0° to 88°, no shear |
| L8 | PASS | AUTO / HAND · the swing scale and index line are marks |
| R1 | PASS | HAND · the polish reuses H.screw, H.dowel, H.spring, H.thrustWasher, H.tube, H.nipple, H.filletPoly; no inline standard part |
| R2 | PASS | HAND · threads M2 to M8; joints Ø8, 10; four bearing sizes (the F6000 on the trunnion floor is the one the 12 mm plate takes) |
| R3 | PASS | AUTO · housing, bridge, stops and drive from their subassemblies |
| R4 | PASS | AUTO · package built at build time |
| R5 | PASS | HAND · states only what differs; no sampling; polish about 1 ms |
| R6 | PASS | FLAG · Node CPU canvas, DPR 1.5, 2026-10-18: plan 335, 28° 358, side 226, explode 210 ms at full detail; ladder below. Browser numbers not measured in this pass (flag, to look at) |
| R7 | PASS | HAND · model.ts + polish.ts 15.8 KB |
| R8 | PASS | AUTO / SITE · pre-rendered thumbnails; the stage draws on change only |
| DL1 | PASS | AUTO / HAND · every solid and mark on a rung; the polish moves nothing |
| DL2 | PASS | HAND · default dial full |
| DL3 | PASS | AUTO · DL-D drawn when exploded, DL-B skipped at side elevation |
| DL4 | PASS | SITE · adaptive dial and the detail entry in the title block |
| DL5 | PASS | FLAG · rung counts and frame times in the detail ladder below |
| Q1 | PASS | check, clamp and edge distance clean |
| Q2 | PASS | 0 clashes |
| Q3 | PASS | package written, 28.4 KB; site build run by CI |
| Q4 | PASS | plan, 28°, side, explode at 28° and 70°, both sheets rendered and looked at (dist/shots); to attach to #31 |
| Q5 | PASS | Node bench run; flags under R6 |
| Q6 | PASS | every row judged |
| Q7 | PASS | conformance: oscillating-cylinder at 2.3, pass |

## Joints
| Joint | Type | F1 locate | F2 retain | F3 torque | F4 thrust | F5 limit | F6 hold | F7 adjust | F8 lube | F9 timing | F10 protect |
|---|---|---|---|---|---|---|---|---|---|---|---|
| pO2 | J2 | 2 x Dowel pin Ø3 x 10 h6, housing to base | 2 x Internal circlip DIN 472, Ø19; Countersunk M5 x 12 (ISO 10642), into the shaft end, flush; Socket head M5 x 10 (ISO 4762), into the shaft end | Feather key 3 x 3 x 6 (DIN 6885) | Wave washer 14.5x18.8, spring steel; Thrust washer 10.2x16, bronze | – turns fully | – driven through the belt | – belt tension at the motor mount (drive) | – sealed bearings | – one input, the swing scale on the base shows the cylinder's phase | – see drive |
| pO3 | J4 | 2 x spigot | 2 x Internal circlip DIN 472, Ø26; Bearing 6000 (10x26x8); Internal circlip DIN 472, Ø19; Bearing F6800 (10x19x5) | – plain stud, no keyed part | Thrust washer 10.2x13.1, bronze | 2 x Stop bumper, neoprene sleeve Ø12 | Compression spring Ø18 x 10, wire 1.2, port-face preload | – the swing is exact by the geometry; no adjuster | Felt oiler in the slot end, oil-soaked wool felt; Bridge over the pivot, on two spigoted posts; Grease nipple DIN 71412 M6, feeding the bore | Swing scale on the base, index line on the cover | – stops are never touched in running |
| pA | J3 | – no removable plate on a moving pin | 2 x Internal circlip DIN 472, Ø16; Bearing 688ZZ (8x16x5); head | – no keyed part | – inner race clamped between spacers; no free end float | – limited by the linkage | – driven | – no adjustable length: the stroke is set by the crank radius | – shielded bearing, greased for life | – no phase to keep | – none needed |
| pO3-bridge-post | post | 2 x spigot | – screwed both ends | – static | – static | – static | – static | – static | – static | – static | – static |
| standard-post | post | – the standard is located by the axle through it and held by two screws | – screwed up from below, countersunk flush on top | – static | – static | – static | – static | – static | – static | – static | – static |
| drive | drive | – bracket screwed up into the base | – pulley hub set screws (pO2) | Pulley hub, 2 x M3 set screws at 90° | – motor bearings | – motor turns freely | – motor holds when powered | bracket | – belt runs dry | Home flag read by the fork sensor | Home flag, 1 mm steel vane; 3 x Fork sensor, slotted optical, 5 mm gap; Pulley flanges |

## Variants and overrides
| Joint or part | Rule result | Chosen | Why |
|---|---|---|---|
| crank | layer 0, z 0 to 6 | plated up 5.4 mm in the model (`dz`) | A9: the rod rides over the crank, the big end's overhang as short as the stack allows |
| cylinder | one plate with a bore | three plates: floor with the port face, frame whose walls are the bore, cover, screwed and dowelled | the trunnion axle must not pass through the bore it shares with the piston; the block is the cylinder |
| piston and rod | slotted or solid piston on the stud | open notch from the piston face to the closest trunnion position, a track roller on the stud between wear strips | the stroke crosses the trunnion line (K6: Lp = d), so the stud passes between the piston's prongs |
| standard top screws | button head | countersunk, flush | A14: the port face of the floor runs 0.4 mm above them |
| trunnion bridge | zMin over the cover bearing flange | lifted 11 mm with its posts, axle and sleeve | F6: room for the port-face spring on a bronze washer |
| bore | sharp T cut | corners filleted at 2 mm; walls relieved 1.5 mm behind hardened wear strips | M5, M14 |
| block fasteners | stage 3 holes in plates of the same body | clearance holes cut in the polish | floor, frame and cover are separate bodies |

## Detail ladder
| Rung | Solids | Marks | Frame ms at this dial position |
|---|---|---|---|
| DL-A | 12 | 0 | 238.58 |
| DL-B | 0 | 267 | 231.15 |
| DL-C | 0 | 0 | 62.33 |
| DL-D | 25 | 0 | 51.43 |
| DL-E | 10 | 2 | 45.48 |
| DL-F | 0 | 0 | 45.98 |
| DL-G | 0 | 0 | 43.47 |
| DL-H | 16 | 0 | 39.39 |
| never | 114 | 157 | 366.05 (full) |

## Promotion candidates
Hand fixes that should become rules or primitives.

- Stage 3 (A8) cuts clearance holes only through plates of the same body. A built-up block of plates that share one pose (a cylinder floor, frame and cover) needs them cut by hand: treat bodies that share a pose and a clamp as one.
- A fixed stud in a rod's open notch (J4) builds the bridge at the lowest height; a spring on the stud (F6) had to lift the bridge, its posts, the axle and the sleeve by hand. A `spring` option on `H.bridge` or on the J1/J4 axle would do it.
- Bore wear strips (M14) on a sliding piston, the same as the slot roller's strips but on a through bore.

## Verification
check: clean · clearance: 0 clashes · clamp: clean · edge distance: clean · package: 28.8 KB
screenshots: plan, 28°, side, explode at 28° and 70°, dark and light (dist/shots; to attach to #31); baselines: 8 written once · bench: Node CPU canvas, DPR 1.5, 2026-10-18; plan 335, 28° 358, side 226, explode 210 ms at full detail; browser numbers not measured (flag, R6)
