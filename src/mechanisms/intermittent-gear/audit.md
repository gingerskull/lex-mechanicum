# Audit: Intermittent gear (intermittent-gear)
standard: 2.5 · date: 2026-10-18 · result: pass · detail: full · pass: build

## Summary
PASS 111 · FAIL 0 · N/A 10 · open: none

## Requirements
| Id | Status | Evidence / action |
|---|---|---|
| S1 | PASS | DATA · the standard carries version 2.3 and its changelog |
| S2 | PASS | HAND · header with standard, date, result, detail, pass |
| S3 | PASS | AUTO · tools/conformance reads this header and runs in npm run check |
| S4 | PASS | SITE · #27 holds only this mechanism's decisions and open items |
| P1 | PASS | DATA · record complete; model.ts, polish.ts, audit.md present |
| P2 | PASS | DATA · catalogue validator clean |
| P3 | PASS | DATA / SITE · ratio, axes, output character, backdrivable, other names, family, motion, level, dof and the motorised drive come from the record and the drive rule |
| P4 | PASS | DATA · tags grouped Function, Property, Application, keywords underneath |
| P5 | PASS | DATA · motion, forces, benefits, limits; three uses with one line each |
| P6 | PASS | DATA · three references (a textbook, two engineering guides) and three videos found and checked live with the YouTube oEmbed endpoint, all on topic; real world has no YouTube video of real footage yet, so the section stays empty |
| P7 | PASS | HAND / SITE · no prose in model.ts or polish.ts; lint-style clean |
| P8 | PASS | SITE · no parts list, build or joint sections on the page |
| P9 | PASS | HAND · solve() gives 5 of 20 teeth in mesh, 90° of driver turn per 90° of driven turn (ratio 1, driven opposite), dwell 270°, 4 stops per driven turn, as the catalogue says |
| P10 | PASS | HAND · driver pitch point traced and its velocity, line of action and pressure angle while the teeth mesh, input spin, driven angle plot as a staircase of 4 steps |
| P11 | PASS | DATA · plain, short sentences, no em dashes, mm and degrees |
| K1 | PASS | HAND · teeth, pitch circles, centre distance 80, disc radius 36 and arc radius 36.5 are the model's; the polish changes heights, spokes and hardware only. The end teeth are shortened in the model (see K6) |
| K2 | PASS | HAND · check: finite, continuous, periodic over 720 samples |
| K3 | PASS | HAND · gear, custom (disc, plate), cap; at and fixed placement |
| K4 | PASS | HAND · roles driver, output, pin; accent only on the input cap p1 |
| K5 | PASS | HAND · check clean; discs and plates on layer 0, gears on layer 1, ground pivots on layer -1 with radius 7 |
| K6 | PASS | DATA · m 4, z 20 and 20 with 5 teeth cut, cd 80, RL 36, RC 36.5 as the catalogue. Deliberate differences, commented in model.ts: the first and last teeth are cut down to tip radii 39.5 and 38.8 (the catalogue notes real designs shorten them; at full height they clash with the stopped gear's teeth); the plate lobes between the arcs are cut to radius 45; the disc is relieved to clear them |
| K7 | PASS | HAND · input rotary on driver |
| D1 | PASS | HAND · involute gears, keyed bores, flush caps, engraved base circles on the discs, same form family as spur-gears |
| D2 | PASS | HAND · material where the load runs; the driven gear is spoked, the plate and disc are plain |
| D3 | PASS | STYLE, roles driver and output tell the parts apart |
| D4 | PASS | AUTO · base corners, feet and standoffs by rule |
| D5 | PASS | AUTO / HAND · one bridge over both shafts on two spigoted posts in the waist between the tip circles |
| D6 | PASS | HAND / STYLE · screenshots: nothing decorative |
| D7 | PASS | HAND · gears, disc, plate and base carry only load-driven shape (spokes) and manufacturing marks |
| A1 | PASS | AUTO · two live shafts and the mesh classified |
| A2 | PASS | AUTO · p1 and p2 live shafts J2, mesh J6 |
| A3 | PASS | AUTO · Ø8 shafts, bearings 688 on the catalogue table |
| A4 | N/A | AUTO · no dead axle; live shafts are stepped profiles from J2 |
| A5 | PASS | AUTO · Ø8 shafts on D-flats, set screws in the hubs. Ø10 or Ø12 with feather keys was tried and gave false key-against-shaft clashes (see Promotion candidates) |
| A6 | N/A | AUTO · no fixed plate floating above the base besides the bridge, whose posts are the standoffs |
| A7 | PASS | AUTO · base plate, feet, scale and clearance holes by rule |
| A8 | PASS | AUTO · stage 3 fasteners fired; clearance and edge checks clean |
| A9 | PASS | AUTO / HAND · nothing sweeps over the stacks, so both shafts are straddle mounted: housing pair below, floating bearing in the bridge above |
| A10 | PASS | HAND · disc with plate and gear stack on one shaft each, in two planes; nothing stacked only to clear something |
| A11 | PASS | AUTO / HAND · shaft, bearing pair, housing, dowels and screws to the base; top bearing in the bridge on spigoted posts |
| A12 | PASS | AUTO · clamp check clean |
| A13 | PASS | AUTO / HAND · named hardware with catalogue sizes; unnamed items are further pieces of listed sets |
| A14 | PASS | HAND · bridge posts in the waist between the tip circles and clear of both stacks; clearance 0 |
| A15 | PASS | AUTO · clearance: 0 clashes over the cycle |
| A16 | PASS | HAND · joint notes on p1 and p2, badges from the rules, 5 build rules |
| A17 | PASS | HAND · housings and shafts from below, disc and spacer, gear with hub, set screws and circlip, bridge with its bearings and top eccentric; the drag pack goes in under the bridge; every screw reachable |
| E1 | PASS | AUTO · explode screenshots |
| E2 | PASS | AUTO · explode screenshots |
| E3 | PASS | AUTO · explode screenshots |
| E4 | PASS | HAND · bridge and its screws lift first, then hubs and gears, then plates, housings last |
| E5 | PASS | AUTO · explode screenshots |
| E6 | PASS | AUTO · explode screenshots |
| E7 | PASS | AUTO · explode screenshots |
| E8 | PASS | AUTO · disc, spacer, gear and hub keep their order on each shaft |
| E9 | PASS | HAND · screenshots at 100% explode, 28 and 70 degrees, both sheets: nothing inside another part, nothing leaves the frame |
| J1 | N/A | AUTO · no dead axle |
| J2 | PASS | AUTO · two live shafts, straddle mounted |
| J3 | N/A | AUTO · no moving pin |
| J4 | N/A | AUTO · no slot |
| J5 | N/A | AUTO · no slide |
| J6 | PASS | AUTO · hubs with set screws, eccentric bushing at the bottom and the top of p2, timing marks |
| J7 | N/A | AUTO · the disc and plate contact is a locking pair; its hardened segment is M14 |
| J8 | PASS | AUTO · motor belt, flanged pulleys, tension slot |
| F1 | PASS | AUTO · dowels on housings, spigots on bridge posts |
| F2 | PASS | AUTO · circlips and retainers on both shafts |
| F3 | PASS | AUTO · D-flats and set screws |
| F4 | PASS | AUTO / HAND · bronze thrust washers, wave washers |
| F5 | N/A | AUTO / HAND · both shafts turn fully; nothing to over-travel |
| F6 | PASS | HAND · the disc locks the plate both ways from about 40° to 250° of the 9° to 279° dwell; near the ends the lock is one-way or none, so a drag pack (bronze disc on the driven hub, wave washer under the bridge) holds the plate |
| F7 | PASS | AUTO / HAND · eccentric bushings at p2 for backlash, belt tension slot |
| F8 | PASS | AUTO · open gears greased at assembly; sealed and shielded bearings |
| F9 | PASS | AUTO / HAND · match marks at the mesh and home flag on the input |
| F10 | PASS | AUTO / HAND · pulley flanges, home flag and fork sensor |
| M1 | PASS | AUTO · edge chamfers by rule |
| M2 | PASS | HAND · driven gear on six spokes; the driver, disc and plate are solid and turn at constant speed or are plates |
| M3 | PASS | AUTO · bore chamfers by rule |
| M4 | PASS | AUTO / HAND · counterbores and countersinks by rule |
| M5 | PASS | AUTO / HAND · spoke windows with 3 mm fillets |
| M6 | PASS | AUTO · edge distance and walls clean |
| M7 | N/A | HAND · no bracket with a loaded corner |
| M8 | N/A | AUTO · no threaded dead axle |
| M9 | PASS | AUTO / HAND · thread engagement by rule |
| M10 | PASS | AUTO / HAND · gears, disc and plate aluminium 6061-T6 hard anodised; hardened steel segment |
| M11 | PASS | AUTO · centre holes and chamfers on the shafts |
| M12 | PASS | HAND · every screw reachable by its key; bearings removable from the housing and the bridge |
| M13 | PASS | AUTO / HAND · every threaded fastener has a locking method |
| M14 | PASS | AUTO / HAND · the locking rim of the disc is a replaceable hardened segment on countersunk screws. The plate's arcs are not a separate part |
| V1 | PASS | AUTO · pancake motor under the base |
| V2 | PASS | AUTO · side view: one bracket |
| V3 | PASS | AUTO / HAND · clearance 0 |
| V4 | PASS | AUTO · flanges and tension slot |
| V5 | PASS | AUTO · rotary: belt to the input pulley |
| V6 | PASS | AUTO · home flag, fork sensor, terminal block, clip |
| L1 | PASS | STYLE · no look values in the folder |
| L2 | PASS | HAND · records carry geometry only |
| L3 | PASS | HAND · roles driver and output right on every solid |
| L4 | PASS | HAND / STYLE · accent only on the input cap |
| L5 | PASS | AUTO / HAND · see-through fired; screws and bearings show through the parts |
| L6 | PASS | AUTO · screenshots at every tilt |
| L7 | PASS | STYLE |
| L8 | PASS | AUTO / HAND · timing marks engraved |
| R1 | PASS | HAND · part family, H.spokes, H.dragPack, H.lockingSegment; the disc relief and the plate are custom outlines, generated |
| R2 | PASS | HAND · sizes as listed |
| R3 | PASS | AUTO |
| R4 | PASS | AUTO · package 23.6 KB |
| R5 | PASS | HAND · polish under 2 ms, rules about 0.1 s |
| R6 | PASS | FLAG · Node CPU canvas bench at DPR 1.5, 2026-10-18: plan 420, 28° 394, side 275, explode 261 ms at full detail; dial D 57, H 39 ms. Setup 1.7 ms. Over the 8 ms target on this canvas, which is far slower than the browser (spur-gears reads 50 to 75 ms there); to look at in the browser bench |
| R7 | PASS | HAND · model.ts + polish.ts 10.9 KB |
| R8 | PASS | SITE |
| DL1 | PASS | AUTO / HAND · no solid moved on the ladder |
| DL2 | PASS | HAND · default dial position full |
| DL3 | PASS | AUTO |
| DL4 | PASS | SITE |
| DL5 | PASS | FLAG · bench rungs below |
| Q1 | PASS | check, clamp and edge distance clean |
| Q2 | PASS | 0 clashes |
| Q3 | PASS | package written, 23.6 KB; the site build is checked in CI |
| Q4 | PASS | plan, 28°, side, explode at 28° and 70°, both sheets, overlays on, looked at |
| Q5 | PASS | node bench run; flags under R6 |
| Q6 | PASS | every requirement judged; ten-function table complete |
| Q7 | PASS | tools/conformance current at 2.3 |

## Joints
| Joint | Type | F1 locate | F2 retain | F3 torque | F4 thrust | F5 limit | F6 hold | F7 adjust | F8 lube | F9 timing | F10 protect |
|---|---|---|---|---|---|---|---|---|---|---|---|
| p1 | J2 | 2 x Dowel pin Ø3 x 10 h6, housing to base | 3 x Internal circlip DIN 472, Ø16; External circlip DIN 471, Ø8; Socket head M4 x 8 (ISO 4762), into the shaft end; Bearing F688ZZ (8x16x5), floating | Input shaft Ø8 h6, D-flat | Wave washer 12x15.8, spring steel; Thrust washer 8.2x14, bronze | – both shafts turn fully, no end of travel | – the disc holds the plate; the input needs no detent | – torque and position held by the disc and gear themselves | – sealed bearings, no sliding contact | – the match marks are on the mesh row | – the drive row carries the protection |
| p2 | J2 | 2 x Dowel pin Ø3 x 10 h6, housing to base | 3 x Internal circlip DIN 472, Ø16; External circlip DIN 471, Ø8; Shaft collar 8x18, set screw; Bearing F688ZZ (8x16x5), floating | Drive shaft Ø8 h6, D-flat | Wave washer 12x15.8, spring steel; Thrust washer 8.2x14, bronze | – both shafts turn fully, no end of travel | Drag pack: bronze friction disc 14.0x19.0, on the driven hub; Drag pack: wave washer, preloaded by the bridge | Eccentric bushing Ø23, 0.3 mm offset bore Ø10, flanged; Eccentric bushing Ø22, 0.3 mm offset bore Ø16, flanged, top of the shaft | – sealed bearings, no sliding contact | – the match marks are on the mesh row | – the drive row carries the protection |
| mesh-driver-driven | J6 | – located by the two shafts' dowelled housings | – retained on each shaft (p1, p2) | 2 x Gear hub Ø20, set screw M3 on the D-flat; 2 x Set screw M3 (DIN 916), threadlocked | – thrust on each shaft (p1, p2) | – nothing to over-travel | – the drag pack is on p2 | Eccentric bushing Ø23, 0.3 mm offset bore Ø10, flanged; Eccentric bushing Ø22, 0.3 mm offset bore Ø16, flanged, top of the shaft | – open teeth greased at assembly | Driver, 5 of 20 teeth; Driven gear, 20 teeth | – protection is on the drive |
| drive | drive | – the bracket is screwed to the base | – retained by set screws and flanges | – set screws on the pulleys (J2 shaft D-flat) | – thrust on the shafts | – belt drive, no end of travel | – nothing rests unlocked | bracket | – sealed motor | – the home flag marks phase | Home flag, 1 mm steel vane; 3 x Fork sensor, slotted optical, 5 mm gap; Pulley flanges |
| p1-p2-bridge-post | post | 2 x spigot | – fixed by the spigot and screw | – fixed | – fixed | – fixed | – fixed | – fixed | – fixed | – fixed | – fixed |

## Variants and overrides
| Joint or part | Rule result | Chosen | Why |
|---|---|---|---|
| shaft and bores | Ø10 or Ø12 shafts with feather keys, by the bore sizes | Ø8 on D-flats | the load is light and a stack with two keyed parts on a feather-keyed shaft raises false key clashes |
| driver end teeth | full teeth | first and last of the five cut to tip radius 38.8 and 39.5 (in the model) | the full teeth meet the stopped gear's teeth on the way in and out |
| driven gear | plain web | six spokes | the driven gear starts and stops every turn (M2) |
| disc rim | plain rim | replaceable hardened segment on countersunk screws | hard where it wears (M14) |
| driven hub | none | drag pack under the bridge | the disc locks only one way near the ends of the dwell (F6) |

## Detail ladder
| Rung | Solids | Marks | Frame ms at this dial position |
|---|---|---|---|
| DL-A | 14 | 0 | 254 |
| DL-B | 0 | 165 | 230 |
| DL-C | 0 | 0 | 64 |
| DL-D | 18 | 0 | 57 |
| DL-E | 8 | 2 | 49 |
| DL-F | 0 | 0 | 49 |
| DL-G | 0 | 0 | 46 |
| DL-H | 18 | 0 | 39 |
| never | 92 | 157 | 350 (full) |

## Promotion candidates
- Clearance treats each keyed part of a shaft as its own body. On a feather-keyed shaft (over Ø8) with two keyed parts on one shaft, every key not hosted by the shaft's anchor part clashes with the shaft (false, 1.4 to 1.9 mm). The key and shaft should be one group, or share a motion key. Worked round with D-flats here.
- Shortened end teeth for a mutilated gear (`teeth` plus a tip radius for the first and last tooth) would be a part-family option once a second mutilated gear is built.
- A locking disc with relief swept from the mating plate's real outline (`discOutline` in model.ts) is a candidate helper once another disc-and-lobe mechanism appears.

## Verification
check: clean · clearance: 0 clashes · clamp: clean · edge distance: clean · package: 23.6 KB
screenshots: plan, 28°, side, explode at 28° and 70°, both sheets, all overlays (looked at; attached to #27) · bench: Node canvas, DPR 1.5, 2026-10-18; 28° frame 394 ms at full detail, flag under R6
