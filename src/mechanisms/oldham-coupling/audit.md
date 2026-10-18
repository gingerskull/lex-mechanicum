# Audit: Oldham coupling (oldham-coupling)
standard: 2.3 · date: 2026-10-18 · result: pass · detail: full · pass: build

## Summary
PASS 110 · FAIL 0 · N/A 11 · open: none

## Requirements
| Id | Status | Evidence / action |
|---|---|---|
| S1 | PASS | DATA · the standard carries version 2.3 and its changelog |
| S2 | PASS | HAND · header with standard, date, result, detail, pass |
| S3 | PASS | AUTO · tools/conformance reads this header and runs in npm run check |
| S4 | PASS | SITE · #30 holds only this mechanism's decisions and open items |
| P1 | PASS | DATA · record complete; model.ts, polish.ts, audit.md present |
| P2 | PASS | DATA · catalogue validator clean |
| P3 | PASS | DATA / SITE · page shows ratio (unity, 1:1), axes (offset parallel), output character, backdrivable, other names, family, motion, level, dof and the motorised drive |
| P4 | PASS | DATA · tags grouped Function, Property, Application, keywords underneath |
| P5 | PASS | DATA · motion, forces, benefits, limits; four uses with one line each |
| P6 | PASS | DATA · Wikipedia and a manufacturer data sheet; four videos and a photo page; the two real-world videos (Printrbot Go Z lead screw, CraftBot Z lead screw) checked by YouTube oEmbed: both exist and are titled for an Oldham coupler on a real printer; the footage itself was not watched, so what is on screen is not confirmed |
| P7 | PASS | HAND / SITE · no prose in model.ts or polish.ts; lint-style clean |
| P8 | PASS | SITE · no parts list, build or joint sections on the page |
| P9 | PASS | HAND · explain read against solve(): output angle equals input angle; the disc centre runs a 28 mm circle twice per turn; each tongue strokes ±28 mm once per turn; the plot is the disc centre angle, a line of slope 2 |
| P10 | PASS | HAND · disc centre path (comet) on the 28 mm circle, velocity at the disc centre, tongue force across the slot wall, input spin, input angle, disc centre angle plot |
| P11 | PASS | DATA · plain, short sentences, no em dashes, mm and degrees |
| K1 | PASS | HAND · check: link error 0 mm; slot widths, tongue sizes, e, R, Rm and the disc position are exported from model.ts; the polish relieves the slots behind the strips so the strip faces are the modelled 18 mm walls |
| K2 | PASS | HAND · check: finite, continuous, periodic over 720 samples |
| K3 | PASS | HAND · disc, custom, cap; fixed and at placement; the hub plates, disc and tongues are twins so each rides one body |
| K4 | PASS | HAND · roles driver (input hub), link (disc, tongues), output (output hub), pin; accent only on the input cap pO1 |
| K5 | PASS | HAND · check clean. Heights are plated with `dz` to the stack the sliding faces need: back plate 0..6, slot plate 6..12, disc 12.5..18.5 with tongues 6.5..12.5 and 18.5..24.5, output slot plate 19..25, back plate 25..31 (0.5 mm running gaps). The input pin reaches no higher than the back plate so the rules do not take the slot plate for a slot joint |
| K6 | PASS | DATA · e 28, R 68, Rm 50, ws 18, wr 16, Lt 48 as the catalogue; slot half-length e + Lt/2 + 1 = 53; the tongues have full-radius ends (a deliberate simplification of the 16 x 48 bar, so they sit concentric in the slot ends) |
| K7 | PASS | HAND · input rotary on the input back plate |
| D1 | PASS | HAND · hubs and disc plain plates; tongues as stadiums concentric with the slot ends; keyed bores; engraved ring marks |
| D2 | PASS | HAND · material where the load runs: a 15 mm wall past each slot end; no windows on constant-speed plates |
| D3 | PASS | STYLE · roles told apart by pattern and tone in both sheets |
| D4 | PASS | AUTO · base grown for the bridge posts; mounting holes and feet moved to the new corner arcs |
| D5 | PASS | AUTO / HAND · output cartridge on H.bridge, two spigoted posts; hub slot plates on dowels and screws |
| D6 | PASS | HAND / STYLE · strips, felts, dowels and the drive read quieter than the hubs and disc |
| D7 | PASS | HAND · hubs, disc, bridge and base carry only load shape and manufacturing marks |
| A1 | PASS | AUTO · pO1 J2; the output shaft O2 and the tongue joints T1, T2 are built by hand (see promotion candidates) |
| A2 | PASS | AUTO · live input shaft at O1 |
| A3 | PASS | AUTO · 6800-2RS on the Ø10 shafts, both cartridges; spacers in every gap |
| A4 | PASS | AUTO · stepped keyed input shaft with end retainer; the output shaft through H.shaft with its keyway and flush end screw |
| A5 | PASS | AUTO · feather key 3 x 3 on both Ø10 shafts |
| A6 | PASS | AUTO · the bridge's standoffs Ø10, spigoted, screwed from both sides; no other fixed plate floats |
| A7 | PASS | AUTO · 8 mm base 2 mm under the input hub, counterbored corners, feet, disc centre path engraved, front scale, clearance hole for the input shaft; grown 20 mm for the bridge posts |
| A8 | PASS | AUTO · every head has its shank; holes cut by stage 3 |
| A9 | PASS | HAND · no pin joint. Each hub is overhung on one cartridge of two bearings 10 mm apart: nothing can reach the far side of a hub, because the disc and the other hub fill it. One support per shaft, accepted |
| A10 | PASS | HAND · one plane per sliding pair; nothing is stacked only to clear something |
| A11 | PASS | HAND · key, back plate, dowels and screws, slot plate, wear strip, acetal tongue, disc, the other tongue, strip, slot plate, dowels and screws, back plate, key, output shaft, cartridge bearings, housing (screwed and dowelled), bridge, spigoted posts, base; the input side runs the same way down to its housing and the base |
| A12 | PASS | AUTO · clamp check clean |
| A13 | PASS | AUTO / HAND · every solid named with catalogue sizes, sets counted |
| A14 | PASS | HAND · bridge 1.0 mm over the output back plate; posts 3 mm outside both hub sweeps; tongue 1 mm clear of each wall and slot end; felts 0.2 mm off the tongue; clearance 0 |
| A15 | PASS | AUTO · clearance: 0 clashes over the cycle |
| A16 | PASS | HAND · a note and a badge on every joint, five build rules |
| A17 | PASS | HAND · input housing and shaft with its back plate, key and end screw; slot plate on dowels and four screws; disc with tongues; output hub subassembly (shaft, key, end screw, back plate, slot plate) lowered with its tongue into the slot; bridge and cartridge over the shaft top onto the posts; thrust washer, spacer and collar last. The end screws are reached through the slots |
| E1 | PASS | AUTO · one level per solid |
| E2 | PASS | AUTO · screws, shafts and bought units are groups |
| E3 | PASS | AUTO · screws leave along their axis to the head side |
| E4 | PASS | HAND · level 0 back plate, 1 slot plate, 2 disc and tongues, 3 output slot plate, 4 output back plate and shaft, 5 bridge, 6 cartridge, 7 collar: the last fitted goes furthest |
| E5 | PASS | AUTO · bearings, circlips, dowels stay in their parts |
| E6 | PASS | AUTO · motor with its bracket, bearings whole |
| E7 | PASS | AUTO · spacers and washers midway |
| E8 | PASS | AUTO · back plate and key keep their order on each shaft |
| E9 | PASS | HAND · readable at full explode at 28° and 70° in both sheets; nothing leaves the frame |
| J1 | N/A | no dead axle |
| J2 | PASS | AUTO / HAND · input: housing with two sealed bearings, sleeve, wave washer, circlips, screwed and dowelled; keyed shaft, pulley hub, end retainer, thrust washer, home flag. Output: the same cartridge turned over on the bridge (H.housing, mirrored in the polish), keyed shaft, thrust washer, spacer, collar with set screw |
| J3 | N/A | no moving pin |
| J4 | N/A | no pin in a slot: the tongue is a bar (T1, T2) |
| J5 | N/A | the rule needs rails and a block; each tongue in its slot is built by hand to the same pattern (strips, felt, screws, hub fixing): promotion candidate |
| J6 | N/A | no gear mesh |
| J7 | N/A | no cam |
| J8 | PASS | AUTO · flanged motor pulley, mount slotted for tension |
| F1 | PASS | AUTO / HAND · input housing dowelled; slot plates dowelled to their back plates; cartridge dowelled to the bridge; bridge on spigots; the disc is located by its tongues |
| F2 | PASS | AUTO / HAND · bearings held by circlips; input end retainer; output end screw, spacer and collar; the disc floats between the hubs, held by its 0.5 mm gaps |
| F3 | PASS | AUTO / HAND · feather keys at both shafts; the tongue torque goes through the wear strips |
| F4 | PASS | AUTO / HAND · bronze thrust washers under the input hub (on the base) and over the output hub (under the bridge), wave washers preloading both cartridges; the disc runs 0.5 mm clear of both hubs |
| F5 | N/A | continuous rotation; nothing to limit |
| F6 | N/A | driven; no rest position to hold |
| F7 | N/A | the offset is set by the dowelled housing and bridge; the tongue fit is the ground strip face; backlash is a limit named in the record |
| F8 | PASS | HAND · oil-soaked felt in the relieved wall of every slot, two per slot; sealed bearings |
| F9 | PASS | HAND · a match line on each slot plate rim along its slot and on the disc rim along the input tongue: with the lines in a row the parts go back in phase |
| F10 | PASS | AUTO / HAND · pulley flanges, home flag, fork sensor; the acetal disc is the torque fuse |
| M1 | PASS | AUTO · edge breaks on every top face |
| M2 | N/A | hubs and disc run at constant speed; no start, stop or reversal to lighten for |
| M3 | PASS | AUTO · bore entry chamfers on every seat and through hole |
| M4 | PASS | AUTO / HAND · counterbored housing screws and base corners, countersinks for the hub and strip screws |
| M5 | PASS | AUTO / HAND · slots have full-radius ends; no pockets |
| M6 | PASS | AUTO · edge distance and walls clean |
| M7 | PASS | HAND · the bridge crotch is filleted by H.bridge; no other bracket |
| M8 | N/A | no shoulder bolt or axle |
| M9 | PASS | AUTO / HAND · M2.5 4 mm into the aluminium plate (1.6 d), M2 strip screws 3 mm, cartridge screws M3 4.5 mm into the bridge (1.5 d); standard lengths |
| M10 | PASS | AUTO / HAND · hard anodised aluminium hubs, acetal disc and tongues, hardened tool-steel strips, bronze washers, steel shafts |
| M11 | PASS | AUTO · centre holes and chamfered ends on the shafts |
| M12 | PASS | HAND · every head reachable; the end screws through the slots; bearings pressed out past their circlips |
| M13 | PASS | AUTO / HAND · threadlocker on every screw and set screw |
| M14 | PASS | HAND · hardened strips screwed into both slot walls, replaceable; the acetal tongue is the other wearing part |
| V1 | PASS | AUTO · pancake outrunner Ø50 x 18 under the base, GT2 32:16 |
| V2 | PASS | AUTO · one-piece bracket, flange screws up into the base |
| V3 | PASS | AUTO / HAND · belt and pulleys clear of feet and housing; clearance 0 |
| V4 | PASS | AUTO · flanges, set screws, slotted mount |
| V5 | PASS | AUTO · rotary: belt to the input pulley |
| V6 | PASS | AUTO · home flag, fork sensor, leads to the terminal block, one P-clip |
| L1 | PASS | STYLE · lint-style clean |
| L2 | PASS | HAND · the polish carries geometry, roles, marks and materials only |
| L3 | PASS | HAND · hubs driver and output, disc and tongues link, bridge and posts ground, hardware hw |
| L4 | PASS | HAND / STYLE · accent on the input only |
| L5 | PASS | AUTO / HAND · screws, bearings and strips are real solids in real holes; the output back plate and the bridge are drawn see-through so the tongues' working zone stays in view |
| L6 | PASS | AUTO · depth order right at plan, 28°, side and explode |
| L7 | PASS | STYLE · tilt 0° to 88°, no shear |
| L8 | PASS | AUTO / HAND · disc centre path and scale engraved; match lines are marks |
| R1 | PASS | HAND · the polish uses H.bridge, H.housing (turned over), H.shaft, H.screw, H.wearStrip, H.felt; the strip lining and the slot plate fixing are written inline (promotion candidates); no standard part redrawn |
| R2 | PASS | HAND · threads M2, M2.5, M3, M5; shafts Ø10; one bearing size 6800-2RS |
| R3 | PASS | AUTO · housing, bridge and drive from their subassemblies |
| R4 | PASS | AUTO · package built at build time |
| R5 | PASS | HAND · states only what differs; no sampling of its own; polish about 50 ms, nearly all of it H.bridge's post search |
| R6 | PASS | FLAG · Node bench at DPR 1.5, median of 24: plan 381, 28° 332, side 245, explode 198 ms at full detail; the other mechanisms measure 250 to 360 ms the same way, so nothing specific to this one; browser bench not run |
| R7 | PASS | HAND · model.ts + polish.ts 18.4 KB |
| R8 | PASS | AUTO / SITE · pre-rendered thumbnails; the stage draws on change only |
| DL1 | PASS | AUTO / HAND · every solid and mark on a rung; the polish moves nothing |
| DL2 | PASS | HAND · default dial full |
| DL3 | PASS | AUTO · DL-D drawn when exploded, DL-B skipped at side elevation |
| DL4 | PASS | SITE · adaptive dial and the detail entry in the title block |
| DL5 | PASS | FLAG · rung counts and frame times in the detail ladder below |
| Q1 | PASS | check, clamp and edge distance clean |
| Q2 | PASS | 0 clashes |
| Q3 | PASS | package written, 21.1 KB; site build not run here |
| Q4 | PASS | plan, 28°, side, full explode at 28° and 70°, both sheets, overlays on, all looked at; nothing clips |
| Q5 | PASS | Node bench at DPR 1.5; no flag |
| Q6 | PASS | every row judged |
| Q7 | PASS | conformance: oldham-coupling at 2.3, pass |

## Joints
| Joint | Type | F1 locate | F2 retain | F3 torque | F4 thrust | F5 limit | F6 hold | F7 adjust | F8 lube | F9 timing | F10 protect |
|---|---|---|---|---|---|---|---|---|---|---|---|
| pO1 | J2 | 2 x Dowel pin Ø3 x 10 h6, housing to base | 2 x Internal circlip DIN 472, Ø19; Countersunk M5 x 12 (ISO 10642), into the shaft end, flush; Socket head M5 x 10 (ISO 4762), into the shaft end | Feather key 3 x 3 x 6 (DIN 6885) | Wave washer 14.5x18.8, spring steel; Thrust washer 10.2x16, bronze | – continuous rotation | – driven through the belt | – offset set by the dowelled housing | – sealed bearings | – match line on the slot plate rim (see T1) | – see drive |
| drive | drive | – bracket screwed up into the base | – pulley hub set screws (pO1) | Pulley hub, 2 x M3 set screws at 90° | – motor bearings | – motor turns freely | – motor holds when powered | bracket | – belt runs dry | Home flag read by the fork sensor | Home flag, 1 mm steel vane; 3 x Fork sensor, slotted optical, 5 mm gap; Pulley flanges |
| O2-bridge-post | post | 2 x spigot | – screwed from both sides | – static | – static | – static | – static | – static | – static | – static | – static |
| O2 | J2 | 2 x Dowel pin Ø3 x 10 h6, housing to bridge | 2 x Internal circlip DIN 472, Ø19 | Feather key 3 x 3 x 6 (DIN 6885); Set screw M3 (DIN 916) | Wave washer 14.5x18.8, spring steel | – continuous rotation | – driven by the disc | – offset set by the dowelled housing and bridge | – sealed bearings | – match line on the slot plate rim (see T2) | – none needed; the disc is the torque fuse |
| T1 | J5 | Hardened wear strips: their faces are the modelled 18 mm walls the tongue is located in | – the disc floats between the hubs on its 0.5 mm gaps | Hardened wear strips take the side force from the tongue | – the disc runs 0.5 mm clear of both hubs | – continuous rotation | – driven | – the tongue fit is the ground strip face | 2 x Felt oiler 10 x 2.3, oil-soaked wool felt, in the relieved wall | Input hub, slot plate; Floating disc | – the acetal disc is the torque fuse |
| T2 | J5 | Hardened wear strips: their faces are the modelled 18 mm walls the tongue is located in | – the disc floats between the hubs on its 0.5 mm gaps | Hardened wear strips take the side force from the tongue | – the disc runs 0.5 mm clear of both hubs | – continuous rotation | – driven | – the tongue fit is the ground strip face | 2 x Felt oiler 10 x 2.3, oil-soaked wool felt, in the relieved wall | Output hub, slot plate; Floating disc | – the acetal disc is the torque fuse |
| hubIn-fix | post | 2 x Dowel pin Ø4 x 8 h6, slot plate to back plate | – screws hold the plates together | 4 x Countersunk M2.5 x 10 (ISO 10642); 4 x shank; 2 x Dowel pin Ø4 x 8 h6, slot plate to back plate | – static | – static | – static | – static | – static | – static | – static |
| hubOut-fix | post | 2 x Dowel pin Ø4 x 8 h6, slot plate to back plate | – screws hold the plates together | 4 x Countersunk M2.5 x 10 (ISO 10642); 4 x shank; 2 x Dowel pin Ø4 x 8 h6, slot plate to back plate | – static | – static | – static | – static | – static | – static | – static |

## Variants and overrides
| Joint or part | Rule result | Chosen | Why |
|---|---|---|---|
| output shaft O2 | no pin declared at O2, so no joint; a live shaft would put the housing behind the base, under a shaft that cannot pass the input hub | second J2 cartridge, H.housing turned over onto a bridge over the stack, keyed shaft down into the output back plate | the shafts of a coupling meet from opposite sides; the output hub's plan area holds the input shaft's sweep and the other way round |
| base | rounded rectangle 16 mm round the sweep | grown 20 mm to the right, mounting holes and feet moved with it | the bridge posts must stand outside both hub sweeps and inside the base |
| hubs | one part each | back plate and slot plate, twins, fixed by dowels and four countersunk screws | a blind groove cannot be an extruded outline; the shaft would show in a through slot |
| disc | one body | body with a tongue on each face, twins | the tongues sit in the hub plates' z range |
| slot walls | bare 18 mm slot | slot relieved 1.5 mm behind hardened strips, felt in each wall | M14, F8 |
| bridge, output back plate | opaque | drawn see-through | L5, the tongues' working zone |
| disc, tongues | aluminium default | acetal | named torque fuse and low-friction faces |

## Detail ladder
| Rung | Solids | Marks | Frame ms at this dial position |
|---|---|---|---|
| DL-A | 10 | 0 | 238.9 |
| DL-B | 0 | 219 | 225.5 |
| DL-C | 0 | 0 | 65.6 |
| DL-D | 13 | 0 | 55.7 |
| DL-E | 12 | 3 | 53.5 |
| DL-F | 0 | 0 | 53.2 |
| DL-G | 0 | 0 | 53.7 |
| DL-H | 22 | 0 | 41.6 |
| never | 125 | 123 | 357.7 (full) |

## Promotion candidates
Hand fixes that should become rules or primitives.

- A shaft entering from above: a J2 cartridge on a bridge (H.housing turned over, spacer, collar, thrust washer under the bridge) as a rule for a keyed part with no room under the base. Done by mirroring the housing in the polish. Also useful for the Schmidt coupling and the universal joints.
- A blind-groove hub: a slot plate on a back plate, fixed by dowels and countersunk screws (one primitive, with the plates as twins).
- A tongue or bar in a slot as a joint type: relieved slot, hardened strips with their screws, felt in the wall (the T1, T2 code, a cousin of J4 and J5). The Scotch yoke and the elliptic trammel will want it.
- `growBase` should move the feet and `H.bridge` should grow the base itself when no post place is left inside it.
- A moving solid that covers a working zone (here a back plate over the tongue) drawn see-through by the see-through stage, instead of a flag set in the polish.

Rule or tool findings, no change made here: `tools/check` reads a pin's layer range (layers) while the rules read its height in mm, so a slot plate plated into the next layer's height needs the pin kept low (see K5); `growBase` leaves the feet at the old corners (worked around by moving them in the polish).

## Verification
check: clean · clearance: 0 clashes · clamp: clean · edge distance: clean · package: 21.1 KB
screenshots: plan, 28°, side, full explode at 28° and 70°, dark and light, overlays on (looked at; baselines in tests/visual/__baselines__) · bench: Node, DPR 1.5, 2026-10-18; plan 381, 28° 332, side 245, explode 198 ms at full detail; other mechanisms 250 to 360 ms the same way; browser bench not run
