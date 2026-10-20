# Audit: Block and tackle (block-and-tackle)
standard: 2.9 · date: 2026-10-20 · result: pass · detail: full · pass: build

## Summary
PASS 114 · FAIL 0 · N/A 14 · open: none

## Requirements
| Id | Status | Evidence / action |
|---|---|---|
| S1 | PASS | DATA · the standard carries version 2.9 and its changelog |
| S2 | PASS | HAND · header with standard, date, result, detail, pass |
| S3 | PASS | AUTO · tools/conformance reads this header and runs in npm run check |
| S4 | PASS | SITE · #136 holds only this mechanism's decisions and open items |
| P1 | PASS | DATA · record complete; model.ts, polish.ts, audit.md present |
| P2 | PASS | DATA · catalogue validator clean |
| P3 | PASS | DATA / SITE · ratio (force amplification, low, 4:1 default), axes same line, continuous output, backdrivable, other names, family, motion, level, dof and the motorised drive |
| P4 | PASS | DATA · tags grouped Function, Property, Application, keywords underneath |
| P5 | PASS | DATA · motion, forces, benefits, limits; three uses with one line each |
| P6 | PASS | DATA · two Wikipedia pages, API RP 9B and an engineering guide; two videos, a photo page and a simulation; the real-world video checked (oEmbed: it exists, a gin pole lifting logs with a block and tackle, real footage) |
| P7 | PASS | HAND / SITE · no prose in model.ts or polish.ts; lint-style clean |
| P8 | PASS | SITE · no parts list, build or joint sections on the page |
| P9 | PASS | HAND · four parts carry the block, so the load rises a quarter of the fall's pull: solve() gives a 25 mm rise for 99.8 mm of fall (ratio 3.99 with the small fleet); the catalogue's 1000 mm / 250 mm range is scaled to the bench (K6) |
| P10 | PASS | HAND · hook path traced, velocity at the hook and the fall's end, load and fall pull force lines, load rise plot |
| P11 | PASS | DATA · plain, short sentences, no em dashes, mm and degrees |
| K1 | PASS | HAND · check: max link error 0.0e+0 mm; tangent points, rope lengths and sheave angles are solved; the polish changes outlines (spokes) and hardware only |
| K2 | PASS | HAND · check: finite, continuous, periodic over 720 samples |
| K3 | PASS | HAND · custom (block, rope parts and wraps), plate (top cheek), rails, disc (sheaves), slider (carriage), caps; stretched rope parts placed between solved points |
| K4 | PASS | HAND · roles: driver (carriage), output (block and its cheek), link (sheaves and rope), ground (guide bars and track), pin; accent on the carriage pin pF only, the input of a linear mechanism |
| K5 | PASS | HAND · check clean: block and guide layer 0, sheaves A layer 1, sheaves B layer 3, top cheek layer 4, carriage and track layer 3 plated 7 mm down; the rope on layers 2 and 5 plated into its planes (z 12, 22 and 32) so no rope part shares a layer with a sheave; ground pivot layer -1, radius 7, moving pins 5.5 |
| K6 | PASS | DATA · sheaves 60 mm and n = 4 as the catalogue; the 400 mm block spacing is scaled to 120 to 95 mm and the fall stroke to 99.8 mm for the bench; the lower pin is 8 mm right of the upper so the fall clears the lower sheaves (a fleet of 3.8° to 4.8°); both said in a code comment |
| K7 | PASS | HAND · input linear on the carriage |
| D1 | PASS | HAND · sheaves are discs with an engraved groove line and spoked webs; the block a square-ended slider on two stadium rails; the carriage a slider on its track; the cheek a plate with a boss at each pin |
| D2 | PASS | HAND · bosses round every pin; spokes in the sheaves only (they start, stop and reverse every stroke) |
| D3 | PASS | STYLE · roles told apart by pattern and tone in both sheets |
| D4 | PASS | AUTO · base corners from the form style, feet concentric with the corner arcs |
| D5 | PASS | AUTO / HAND · bridge over the upper pin on two spigoted posts; rails on ground risers; the becket on its own post |
| D6 | PASS | HAND / STYLE · slide hardware, guards, stops, drive and leads read quieter than the sheaves and the rope |
| D8 | N/A | AUTO / HAND · every part lies on z: the tackle works in one plane |
| D9 | PASS | AUTO / HAND · the four parts and the fall are stretched parts between solved tangent points (bench: 5 stretched solids, 50 items); the wraps are fixed arcs on the blocks; nothing deforms |
| D7 | PASS | HAND · sheaves, block, cheek, carriage, rails and base carry only load shape and manufacturing marks |
| A1 | PASS | AUTO · pU J1, pL J3, pK J3, pF J3, slide-block J5, slide-carriage J5, flex-rope-0 J12 |
| A2 | PASS | AUTO · dead axle at the upper pin, shoulder bolts at the lower pin, the distance bolt and the carriage pin, two slides, the rope as a flexible member |
| A3 | PASS | AUTO · F6800 (10x19x5) in the upper sheaves, F688ZZ (8x16x5) in the lower; spacers in every gap |
| A4 | PASS | AUTO · stepped shoulder axle through the base to a nyloc at pU |
| A5 | N/A | AUTO · no keyed part: every sheave turns on its own bearing, the motor pulley is a D-bore on a D-flat shaft |
| A6 | PASS | AUTO · bridge posts Ø10 spigoted and screwed from both sides; both slides' rails on one ground riser each, screwed down, the reference rails dowelled |
| A7 | PASS | AUTO · 8 mm base, counterbored corners, feet, the hook path engraved, front scale, the carriage slot |
| A8 | PASS | AUTO · every head has its shank; holes cut by stage 3 |
| A9 | PASS | HAND · the lower block is a clevis: the top cheek is the bottom cheek's twin, so pL holds both sheaves in double shear and the distance bolt pK ties the cheeks below them; the upper axle is held by the base and the bridge; pF is single shear (the fall's eye on a short pin standing in the carriage, flagged) |
| A10 | PASS | HAND · the two sheave planes are 20 mm apart, the gap the crossing part needs between them; the guide and the block share layer 0; the carriage is plated down 7 mm, so the fall clears its end stop, not to clear a sweep |
| A11 | PASS | HAND · load to hook and swivel, block cheeks, pL, the rope's four parts, the upper sheaves, the dead axle, base and bridge; the dead end to the becket, its pin and post, the base; the block's side load to its slide; the fall's pull to the carriage, its slide and the belt |
| A12 | PASS | AUTO · clamp check clean |
| A13 | PASS | AUTO / HAND · every solid named with catalogue sizes, sets counted |
| A14 | PASS | HAND · the fall clears the lower sheaves by 4.8 mm in plan; the becket clears upper sheave A by 5.4 mm and the crossing part runs 4 mm over it; the guards stand 2 mm off the sheave rims; clearance 0 |
| A15 | PASS | AUTO · clearance: 0 clashes over the cycle |
| A16 | PASS | HAND · a note and a badge on every joint; five build rules |
| A17 | PASS | HAND · base, guide and track on their risers; becket post; upper axle, sheave A, spacer, sheave B, bridge; block on its slide, sheave A, sheave B, top cheek, pL and pK; carriage and its pin; then the rope is reeved and the becket pinned; heads last; belt drive from below |
| E1 | PASS | AUTO · one level per solid; levels -8 to 6.5 |
| E2 | PASS | AUTO · screws, bolts with their shims, shafts and bought units are groups |
| E3 | PASS | AUTO · bolts and bridge screws upward, drive and becket post screws downward |
| E4 | PASS | HAND · rope in plane A over sheave A, the crossing part with it, rope in plane B above sheave B and the top cheek: the rope comes off before the sheaves; heads last |
| E5 | PASS | AUTO · bearings and circlips stay in their parts |
| E6 | PASS | AUTO · motor with its bracket, bearings whole, belt in the pulley plane |
| E7 | PASS | AUTO · spacers midway |
| E8 | N/A | AUTO · no keyed shaft stack |
| E9 | PASS | HAND · readable at full explode at 28° and 70° in both sheets: each rope plane lifts as one loop above its sheaves; nothing inside another part; nothing leaves the frame |
| J1 | PASS | AUTO · pU: stepped axle through the base to a washer and nyloc, a bearing and circlip in each sheave, spacer sleeve between them, thrust washer, bridge on spigoted posts, oil sink |
| J2 | N/A | no live shaft |
| J3 | PASS | AUTO / HAND · pL threaded into the bottom cheek, a shielded bearing in each sheave, spacers, the top cheek on the shoulder (clevis variant); pK a distance bolt with its sleeve; pF the carriage pin, locked |
| J4 | N/A | no slot |
| J5 | PASS | AUTO · both slides: dowelled reference rail, keeper plate, bronze gib clamped under the keeper by the rail screws, felt wipers, grease nipple, end stops with neoprene pads |
| J6 | N/A | no gear mesh |
| J7 | N/A | no cam |
| J8 | PASS | AUTO · flanged motor pulley, idler on a slotted tensioner arm |
| J9 | N/A | no crossed-axis mesh |
| J10 | N/A | no shaft in plan |
| J12 | PASS | AUTO / HAND · rope: parts stretched between tangent points, dead end on a becket with a thimble, hook on a swivel; the guards over the upper sheaves are added in the polish (AUTO-TODO: the rule places them only over sheaves that are fixed parts) |
| J13 | N/A | no compliant joint |
| J11 | N/A | no screw |
| F1 | PASS | AUTO · bridge on spigots; both reference rails dowelled; the becket located by its pin in the post |
| F2 | PASS | AUTO / HAND · every bearing held by a flange and an internal circlip; heads on the inner races; keepers hold the block and the carriage down; the becket pin split-pinned; a guard over each upper sheave (polish) |
| F3 | PASS | AUTO · the hook turns on its swivel, so the rope never twists; no keyed part |
| F4 | PASS | AUTO · bronze thrust washer under sheave A on the upper axle; the moving pins clamp their bearings through inner-race spacers |
| F5 | PASS | AUTO · end stops with neoprene pads just past both ends of the block's and the carriage's travel; the sheaves need none, the rope turns them |
| F6 | N/A | driven: the motor holds the load; the tackle is backdrivable (the catalogue's limits say a cleat or brake is needed by hand) |
| F7 | PASS | AUTO · both gibs set on slotted holes under their keepers; belt tension at the idler arm; the rope's length is set at the becket splice |
| F8 | PASS | AUTO · upper bearings oiled from the sink in the bridge, lower bearings shielded and greased for life, wipers and a nipple on each slide |
| F9 | N/A | no phase to keep: any sheave angle and any rope position work |
| F10 | PASS | AUTO · pulley flanges, home flag and fork sensor at the motor end of the stroke, leads to the terminal block |
| M1 | PASS | AUTO · edge breaks on every top face |
| M2 | PASS | HAND · the sheaves reverse every stroke: a hub round the bearing and five spokes to the grooved rim; bosses round every loaded hole |
| M3 | PASS | AUTO · bore entry chamfers on every seat and through hole |
| M4 | PASS | AUTO / HAND · counterbored base corners, countersinks for the rail screws |
| M5 | PASS | AUTO / HAND · filleted spoke windows; no pockets |
| M6 | PASS | AUTO · edge distance and walls clean |
| M7 | N/A | HAND · no bracket or plate with a load-turning corner |
| M8 | PASS | AUTO · undercuts on every shoulder bolt thread |
| M9 | PASS | AUTO / HAND · bolts into the steel cheek and carriage over full thickness; the upper axle through the base to a nut; standard lengths |
| M10 | PASS | AUTO / HAND · materials named on every solid |
| M11 | PASS | AUTO · centre holes and chamfered ends on the shafts |
| M12 | PASS | HAND · every head reachable from above or below; bearings pressed out past their circlips; the becket post screw from under the base |
| M13 | PASS | AUTO / HAND · threadlocker or nyloc on every threaded part; the becket post screw threadlocked (polish) |
| M14 | PASS | AUTO · hardened rails and a bronze gib on each slide |
| V1 | PASS | AUTO · pancake outrunner Ø50 x 18 under the base, GT2 16T pulleys |
| V2 | PASS | AUTO · one-piece bracket, flange screws up into the base |
| V3 | PASS | AUTO / HAND · belt and pulleys clear of feet and housings; clearance 0 |
| V4 | PASS | AUTO · flanges, slotted tensioner with an idler |
| V5 | PASS | AUTO · linear: belt loop under the base along the 99.8 mm stroke, carriage through a slot in the base clamped to the fall's carriage, tensioner on the far pulley |
| V6 | PASS | AUTO · home flag, fork sensor at the motor end of the stroke, leads to the terminal block, one P-clip |
| L1 | PASS | STYLE · lint-style clean |
| L2 | PASS | HAND · the model and polish carry geometry, roles, marks and materials only |
| L3 | PASS | HAND · carriage driver, block and cheek output, sheaves and rope link, guide and track ground, hardware hw |
| L4 | PASS | HAND / STYLE · accent on the carriage pin only, with the traced path and forces |
| L5 | PASS | AUTO / HAND · bearings, screws and the becket pin are real solids in real holes |
| L6 | PASS | AUTO · depth order right at plan, 28°, side and explode: the three rope heights on the left side stay apart |
| L7 | PASS | STYLE · tilt 0° to 88°, no shear |
| L8 | PASS | AUTO / HAND · engraved path, scale and the sheaves' groove lines are marks |
| R1 | PASS | HAND · the polish uses H.standoff, H.screw and H.spokes; the guard repeats the rope rule's band (AUTO-TODO, listed below) |
| R2 | PASS | HAND · threads M3, M4, M5, M6, M8; joints Ø8, 10; bearings F688ZZ (8x16x5), F6800 (10x19x5) |
| R3 | PASS | AUTO · slides, bridge and drive from their subassemblies |
| R4 | PASS | AUTO · package 23.9 KB |
| R5 | PASS | HAND · states only what differs; no sampling; rules about 0.8 s, polish 1 ms |
| R6 | PASS | FLAG · browser bench, DPR 1.5: plan 2.41, 28° 3.15, side 2.48, explode 70° 2.93 ms; setup 12.5 ms; under every target |
| R7 | PASS | HAND · model.ts + polish.ts 14.0 KB |
| R8 | PASS | AUTO / SITE · pre-rendered thumbnails; the stage draws on change only |
| DL1 | PASS | AUTO / HAND · every solid and mark on a rung; the polish moves nothing |
| DL2 | PASS | HAND · default dial full |
| DL3 | PASS | AUTO · DL-D drawn when exploded, DL-B skipped at side elevation |
| DL4 | PASS | SITE · adaptive dial and the detail entry in the title block |
| DL5 | PASS | FLAG · rung counts and frame times in the detail ladder below |
| Q1 | PASS | check, clamp and edge distance clean |
| Q2 | PASS | 0 clashes |
| Q3 | PASS | package written, 23.9 KB; site build passes |
| Q4 | PASS | plan, 28°, side, explode at 28° and 70°, both sheets, looked at (dist/shots, local) |
| Q5 | PASS | browser bench; no flag |
| Q6 | PASS | every row judged; no FAIL |
| Q7 | PASS | conformance: block-and-tackle at 2.9, pass |

## Joints
| Joint | Type | F1 locate | F2 retain | F3 torque | F4 thrust | F5 limit | F6 hold | F7 adjust | F8 lube | F9 timing | F10 protect |
|---|---|---|---|---|---|---|---|---|---|---|---|
| pU | J1 | 2 x spigot | 2 x Internal circlip DIN 472, Ø19; 2 x Bearing F6800 (10x19x5) | – no keyed part: the rope turns the sheaves | Thrust washer 10.2x13.1, bronze | – the rope turns the sheaves, no stop needed | – driven | – fixed centre | Bridge over the pivot, on two spigoted posts | – no phase to keep | – guards over the sheaves (rope joint) |
| pL | J3 | – no removable plate on a moving pin | 2 x Internal circlip DIN 472, Ø16; 2 x Bearing F688ZZ (8x16x5); head | – no keyed part | – bearings located by flange and circlip, inner race clamped | – limited by the block's slide stops | – driven | – fixed centre | – shielded bearings, greased for life | – no phase to keep | – none needed |
| pK | J3 | – no removable plate on a moving pin | head | – static in the block | – the sleeve sets the cheek spacing | – static | – static | – static | – static | – static | – static |
| pF | J3 | – no removable plate on a moving pin | head | – static in the carriage | – the rope pulls across the pin | – limited by the carriage stops | – driven | – the rope's length is set at the becket | – static | – no phase to keep | – none needed |
| slide-block | J5 | – the reference rail is dowelled to the base | Keeper plate, holds the slider down | – prismatic, no torque | – the keeper takes the lift, the base the weight | 2 x End stop block, hardened | – driven | Gib strip 113 x 7 x 2.3, bronze, slotted, clamped under the keeper | 2 x wiper; Grease nipple M6 (DIN 71412) | – no phase to keep | – stops never touched in running |
| slide-carriage | J5 | – the reference rail is dowelled to the base | Keeper plate, holds the slider down | – prismatic, no torque | – the keeper takes the lift, the base the weight | 2 x End stop block, hardened | – driven | Gib strip 144.8 x 7 x 2.3, bronze, slotted, clamped under the keeper | 2 x wiper; Grease nipple M6 (DIN 71412) | – no phase to keep | – stops never touched in running |
| flex-rope-0 | J12 | Becket with a thimble, the rope's dead end spliced round it | Becket pin Ø6, split-pinned; 2 x Rope guard over the sheave, steel strip | Hook swivel on a thrust bearing | – the sheaves carry the rope's thrust on their bearings | – limited by the slides' stops | – driven | – rope length set at the becket splice | – rope runs dry in the grooves | – no phase to keep | – the guards keep a slack rope in its grooves |
| pU-bridge-post | post | 2 x spigot | – static | – static | – static | – static | – static | – static | – static | – static | – static |
| guidea-seat | post | – not dowelled: the gib on it takes up the fit against the reference rail | – screwed down through keeper, gib, rail and riser | – static | – static | – static | – static | – the gib on this rail adjusts the fit | – static | – static | – static |
| guideb-seat | post | 2 x Dowel pin Ø3 h6 (ISO 8734), rail to base | – screwed down through rail and riser | – static | – static | – static | – static | – the gib on the other rail adjusts the fit | – static | – static | – static |
| tracka-seat | post | – not dowelled: the gib on it takes up the fit against the reference rail | – screwed down through keeper, gib, rail and riser | – static | – static | – static | – static | – the gib on this rail adjusts the fit | – static | – static | – static |
| trackb-seat | post | 2 x Dowel pin Ø3 h6 (ISO 8734), rail to base | – screwed down through rail and riser | – static | – static | – static | – static | – the gib on the other rail adjusts the fit | – static | – static | – static |
| drive | drive | – bracket screwed up into the base | – pulleys on D-flat shaft and bearing | – motor pulley, D-bore on a D-flat shaft | – motor bearings | – motor turns freely | – motor holds when powered | Tensioner arm, slotted, 2 x M4 | – belt runs dry | – home flag read by the fork sensor | Home flag, 1 mm steel vane; 3 x Fork sensor, slotted optical, 5 mm gap; Pulley flanges |

## Variants and overrides
| Joint or part | Rule result | Chosen | Why |
|---|---|---|---|
| upper sheave guards | none: the rope rule guards only sheaves that are fixed parts | a guard over each upper sheave in the polish | J12, F2: these sheaves turn on a fixed pin (AUTO-TODO) |
| becket | a ground plate with its pin, standing free | the pin threaded into a Ø10 post screwed up from under the base | A11: the dead end's load reaches the base |
| sheaves | plain discs | five spokes round the bearing hub | M2: they reverse every stroke; the spokes show them turn |
| lower block | single cheek, the sheaves in single shear | a top cheek as the bottom cheek's clevis twin, and a distance bolt below the sheaves, in the model | A9 |
| carriage and track | layer 3 | plated 7 mm down in the model | the fall runs over the end stop's screw head and takes the carriage pin above the carriage |
| rope contacts | wraps clash with their sheaves and the straight parts | allowed in the polish; the fall's eye allowed round the carriage pin | the rope lies in the grooves and meets itself at the tangent points by design |
| block spacing | catalogue 400 mm | 120 to 95 mm in the model | K6: bench size |

## Detail ladder
| Rung | Solids | Marks | Frame ms at this dial position |
|---|---|---|---|
| DL-A | 10 | 0 | 2.88 |
| DL-B | 0 | 195 | 2.18 |
| DL-C | 0 | 0 | 2.08 |
| DL-D | 19 | 0 | 1.88 |
| DL-E | 14 | 2 | 1.92 |
| DL-F | 0 | 0 | 1.78 |
| DL-G | 0 | 0 | 1.68 |
| DL-H | 21 | 0 | 1.34 |
| never | 125 | 96 | 3.14 (full) |

## Promotion candidates
- J12 rope guards: `src/rules/j12-flexible.ts` guards only sheaves that are fixed parts. A sheave that turns on a fixed pin (every real upper block) gets none; the polish adds the same band. The rule should guard every sheave whose centre does not move.
- Rope wraps over the sheaves: each pass builds the same fixed arcs and allows them against their sheaves and the parts they meet. A rope helper could make the wraps from the reeving and set those contacts.
- Flexible drives, rope: a reeving with the dead end on the upper block and the fall from an upper sheave puts three rope lines on one side. Two sheaves per pin give two planes; the part that changes plane is drawn between them, and the lower block is set off the upper pin so the fall runs past the lower sheaves.
- Flexible drives, rope: sheave angles follow the rope paid past each sheave over its pitch radius (no slip); the fall follows the rope length, so the ratio stays exact with a fleet.
- The model check's same-layer OVERLAP test (`src/model/check.ts`, line 272) reads the unit outline of a stretched part, so it sees only a 1 mm stub at its first point; the rope parts were put on their own layers to keep that stub clear.

## Verification
check: clean · clearance: 0 clashes · clamp: clean · edge distance: clean · package: 23.9 KB
screenshots: plan, 28°, side, explode at 28° and 70°, both sheets, looked at (dist/shots, local) · bench: browser, RTX 5090, DPR 1.5, 2026-10-20; 28° frame 3.15 ms at full detail, no flag
