# Audit: Worm drive (worm-drive)
standard: 2.14 · date: 2026-10-20 · result: pass · detail: full · pass: build

## Summary
PASS 114 · FAIL 0 · N/A 14 · open: none

## Requirements
| Id | Status | Evidence / action |
|---|---|---|
| S1 | PASS | DATA · the standard carries version 2.14 and its changelog |
| S2 | PASS | HAND · header with standard, date, result, detail, pass |
| S3 | PASS | AUTO · tools/conformance reads this header and runs in npm run check |
| S4 | PASS | SITE · #112 holds only this mechanism's decisions and open items |
| P1 | PASS | DATA · record complete; model.ts, polish.ts, audit.md present |
| P2 | PASS | DATA · catalogue validator clean |
| P3 | PASS | DATA / SITE · ratio (reduction 30:1), perpendicular skew axes, continuous and self-locking output, not backdrivable, other names, family, motion, level, dof and the motorised drive |
| P4 | PASS | DATA · tags grouped Function, Property, Application, keywords underneath |
| P5 | PASS | DATA · motion, forces, benefits, limits; three uses with one line each |
| P6 | PASS | DATA · Wikipedia and two engineering guides (RoyMech, SDP/SI); a gearbox video, a photo page |
| P7 | PASS | HAND / SITE · no page prose in model.ts or polish.ts; lint clean |
| P8 | PASS | SITE · no parts list, build or joint sections on the page |
| P9 | PASS | HAND · solve(): the wheel turns one tooth (12°) per worm turn, 30:1 as the text says; lead angle 5.71° from atan(1/10); the text's self-locking and its limit under vibration match the mesh note |
| P10 | PASS | HAND · velocity of the worm's pitch point, output spin, the worm's thrust along its shaft (push and pull), the lead angle on the worm's top in plan, wheel angle plot (one tooth per cycle) |
| P11 | PASS | DATA · plain, short sentences, no em dashes, mm and degrees |
| K1 | PASS | HAND · check: max link error 0.0e+0 mm; the worm's lead, the wheel's teeth at the lead angle and the centre distance are the model's; the arms are cut inside the rim |
| K2 | PASS | HAND · check: finite, continuous, periodic over 720 samples |
| K3 | PASS | HAND · the wheel a custom gear outline with its helix, the worm a disc on axis x with its helix at the lead, two caps |
| K4 | PASS | HAND · roles driver, output, pin; accent only on the worm's cap pW, the input |
| K5 | PASS | HAND · check: no INTERFERE, OVERLAP or WARN; the wheel on layer 1, the worm's layer only its explode level (axis x) |
| K6 | PASS | DATA · m 3, one start, q 10, z 30, 20°, centre distance 60, lead angle 5.71°: as the catalogue. The worm lies in front of the wheel (-y), not "above" it in plan, and is six leads long (56.5, the catalogue's 50) so a crest sits at its middle; the throated rim is drawn straight (code comments) |
| K7 | PASS | HAND · input rotary on the worm, as the catalogue |
| D1 | PASS | HAND · involute teeth turned at the lead angle on the wheel, a keyed bore, hub and six arms; the worm's thread by its helix |
| D2 | PASS | HAND · rim two modules under the roots, hub 8 mm round the bore, arms 10 mm wide |
| D3 | PASS | STYLE · roles told apart by pattern and tone in both sheets |
| D4 | PASS | AUTO · feet concentric with the corner arcs of the grown base |
| D5 | PASS | AUTO / HAND · pillow blocks on foot plates, one bridge over the wheel shaft, one angle bracket for the motor, one oiler block |
| D6 | PASS | HAND / STYLE · blocks, bridge, bracket and oiler block read quieter than the worm and wheel; the oiler block drawn see-through in front of the worm |
| D8 | PASS | AUTO / HAND · the worm on axis x with along and helix; the wheel on z with helix; check reports no AXIS |
| D9 | N/A | no member changes shape |
| D7 | PASS | HAND · wheel, worm, blocks, bridge, bracket and oiler block carry only load shape and manufacturing marks |
| A1 | PASS | AUTO · pG J2, pW J10, mesh-worm-wheel J9 |
| A2 | PASS | AUTO · pG live (keyed wheel), pW a live shaft in plan (the accent input), the declared worm mesh J9, the worm first |
| A3 | PASS | AUTO · 6801 on the Ø12 wheel shaft in the housing and the bridge, 6800 on the Ø10 worm shaft in the blocks |
| A4 | PASS | AUTO · stepped keyed shafts, chamfered ends, circlip grooves |
| A5 | PASS | AUTO · feather keys 4 x 4 on Ø12 and 3 x 3 on Ø10 |
| A6 | N/A | no floating fixed plate besides the bridge, which stands on spigoted Ø10 standoffs |
| A7 | PASS | AUTO · 8 mm base, counterbored corners, feet, front scale, clearance hole for the wheel shaft; the base grows under the drive (V2) |
| A8 | PASS | AUTO · every head has its shank; holes cut by stage 3, including the oiler block's |
| A9 | PASS | AUTO / HAND · the worm between its two blocks 74.5 mm apart, never overhung (J10, standard 2.14: the far block tested against the wheel's teeth, not its box); the wheel shaft straddle mounted: housing pair below, floating bearing in the bridge above (J2 straddle) |
| A10 | PASS | HAND · the wheel alone on its plane; the worm stands out of it on its own axis at the wheel's mid-plane; the bridge above the wheel |
| A11 | PASS | HAND · wheel to keyed shaft to housing (screwed, dowelled) and bridge (screwed, spigoted); worm to keyed shaft, its thrust to the located block (screwed, dowelled); motor to bracket to base; oiler block screwed to the base |
| A12 | PASS | AUTO · clamp check clean |
| A13 | PASS | AUTO / HAND · 130 solids, 65 unnamed (further items of a listed set) |
| A14 | PASS | HAND · bridge posts on the open side of the wheel, sensor post behind block A, oiler block 3 mm in front of the worm's tip and clear of block B's foot, bracket clear of the belt; the wheel's tips 7 mm from block B; clearance 0 |
| A15 | PASS | AUTO · clearance: 0 clashes over the cycle |
| A16 | PASS | HAND · 5 build rules; notes on pW and the mesh (thrust path, shim, oil, self-locking); no note: none; no badge: none |
| A17 | PASS | HAND · housing and wheel shaft from below, wheel with shim and thrust washer, bridge; blocks on the base, worm shaft with collars, worm with shim, thrust washers and circlip through them; pulley, motor and bracket, belt; oiler block last, from above; every screw reachable |
| E1 | PASS | AUTO · every solid has one explode level; levels -4 to 2.5 |
| E2 | PASS | AUTO · 31 rigid groups; screws, shafts, the motor pulley set and the bracket each one body |
| E3 | PASS | AUTO · bridge, block, bracket and oiler screws upward, housing screws downward |
| E4 | PASS | HAND · the bridge and its screws above the wheel; the worm's shaft, blocks and drive lift as one unit; the oiler block and its screws come off first |
| E5 | PASS | AUTO · bearings and circlips stay in the housing, the blocks and the bridge |
| E6 | PASS | AUTO / HAND · motor and bracket on one level; the belt stays in the pulley plane, on the shaft's level |
| E7 | PASS | AUTO · spacers midway |
| E8 | PASS | AUTO · wheel, key and spacer keep their order on the wheel shaft; collars, worm, circlip and pulley on the worm shaft |
| E9 | PASS | HAND · readable at full explode at 28° and 88°: nothing inside another part, nothing leaves the frame |
| J1 | N/A | no dead axle |
| J2 | PASS | AUTO · housing with two sealed bearings, sleeve, wave washer, circlips, screwed and dowelled; keyed shaft; straddle bridge with a floating flanged bearing |
| J3 | N/A | no moving pin |
| J4 | N/A | no pin in a slot |
| J5 | N/A | no slide |
| J6 | N/A | no parallel mesh |
| J7 | N/A | no cam |
| J8 | PASS | AUTO · motor pulley flanged, the bracket's upright slotted for tension |
| J9 | PASS | AUTO / HAND · each gear keyed on its shaft; a shim pack at each sets its place (F7); bronze thrust washers both ways on the worm, one under the wheel (F4); timing marks on tooth 0 (F9); oiled by the polish in place of grease (F8) |
| J10 | PASS | AUTO · two pillow blocks either side of the worm, sealed bearings, located in block A by two collars, floating in block B; screwed and dowelled foot plates |
| J12 | N/A | no flexible member |
| J13 | N/A | no compliant joint |
| J11 | N/A | no screw |
| F1 | PASS | AUTO · housing and blocks dowelled; bridge spigoted |
| F2 | PASS | AUTO / HAND · bearings on circlips; collars on the worm shaft; an external circlip holds the worm toward the floating block (polish) |
| F3 | PASS | AUTO · feather keys in the wheel and the worm; the input pulley on a hub with two set screws |
| F4 | PASS | AUTO / HAND · the located block takes the worm's thrust both ways: toward it through the shim, the inner thrust washer and the inner collar, away from it through the outer thrust washer, the circlip, the shaft and the outer collar; the wheel on its bronze thrust washer; wave washer preloading the housing pair |
| F5 | N/A | both shafts turn fully, nothing to over-travel |
| F6 | N/A | driven through the mesh; the wheel held at rest by the worm (self-locking at rest, noted, not a brake) |
| F7 | PASS | AUTO / HAND · shim packs set the worm's place and the wheel's mid-plane on the worm's axis; belt tension by the bracket's slots |
| F8 | PASS | HAND · the pair slides: a felt oiler in a block on the base presses on the worm's thread, fed from an oil hole on top; sealed and shielded bearings |
| F9 | PASS | AUTO / HAND · timing marks on tooth 0 of the wheel and the worm's start; the model's phase puts them together at the mesh |
| F10 | PASS | AUTO / HAND · motor pulley flanges, home flag and fork sensor; no slip clutch: nothing in a single mesh can jam |
| M1 | PASS | AUTO · edge breaks on every top face |
| M2 | PASS | HAND · hub and six arms in the 30-tooth wheel (it starts and stops with the motor); the worm solid |
| M3 | PASS | AUTO · bore entry chamfers on every seat and through hole |
| M4 | PASS | AUTO / HAND · counterbored housing screws, base corners and oiler screws |
| M5 | PASS | AUTO / HAND · arm windows filleted R3, bracket slots full radius |
| M6 | PASS | AUTO · edge distance and walls clean |
| M7 | PASS | HAND · the bridge is a hull of circles; arm roots filleted; the oiler block's corners rounded R2 |
| M8 | PASS | AUTO · thread undercuts on the shaft ends |
| M9 | PASS | AUTO / HAND · standard lengths; block screws M5 and oiler screws M4 into the base |
| M10 | PASS | AUTO / HAND · 130 of 130 solids name a material; phosphor bronze wheel, case-hardened ground 16MnCr5 worm, cast-iron blocks, wool felt |
| M11 | PASS | AUTO · centre holes and chamfered ends on the shafts |
| M12 | PASS | HAND · every head reachable; bearings pressed out past their circlips |
| M13 | PASS | AUTO / HAND · 43 threaded, 0 without a locking method; oiler screws threadlocked |
| M14 | N/A | the wear surface is the bronze wheel itself, the replaceable part of the pair |
| V1 | PASS | AUTO · brushless pancake motor Ø50 x 18, GT2 32:16, beside the worm's shaft (axis x), its bell turning at the belt ratio |
| V2 | PASS | AUTO · one angle bracket, a foot on the base and an upright the motor screws to; beside the shaft on the base top |
| V3 | PASS | HAND · belt and pulleys clear of the blocks, the bracket and the base; clearance 0 |
| V4 | PASS | AUTO · motor pulley flanged both sides, the input pulley on a hub with two set screws at 90°, slots in the bracket's foot and upright for tension |
| V5 | PASS | HAND · rotary: belt to the input pulley on the worm's free shaft end past block B, the catalogue's input kept |
| V6 | PASS | AUTO · home flag on the located collar, fork sensor on a post behind block A, leads to a terminal block on the base edge, one P-clip |
| L1 | PASS | STYLE · lint-style clean |
| L2 | PASS | HAND · the polish carries geometry, roles, marks and materials only |
| L3 | PASS | HAND · worm and pulleys driver, wheel output, blocks, bridge, bracket and oiler ground, hardware hw |
| L4 | PASS | HAND / STYLE · accent on the input only |
| L5 | PASS | AUTO / HAND · screws, bearings and shims are real solids in real holes; the oiler block see-through in front of the worm |
| L6 | PASS | AUTO · depth order right at plan, 28°, 60°, side and explode across the x and z solids |
| L7 | PASS | STYLE · tilt 0° to 88°, no shear |
| L8 | PASS | AUTO / HAND · timing marks and the oil sink are marks |
| R1 | PASS | HAND · blocks, bridge, drive and base growth from the rules; the polish adds the spokes (H.spokes), a circlip, the oiler from primitives, and the notes |
| R2 | PASS | HAND · threads M3, M4, M5; shafts Ø10 and 12; bearings 6800 and 6801; GT2 16T and 32T |
| R3 | PASS | AUTO · housing, pillow blocks and bridge from their subassemblies |
| R4 | PASS | AUTO · package 21.2 KB |
| R5 | PASS | HAND · states only what differs; no sampling in the polish; polish 1 ms |
| R6 | PASS | FLAG · browser bench: plan 2.47, 28° 2.81, side 2.26, explode 2.84 ms at full detail, setup 7.8 ms; under the 8 ms target |
| R7 | PASS | HAND · model.ts + polish.ts 10.6 KB |
| R8 | PASS | AUTO / SITE · pre-rendered thumbnails; the stage draws on change only |
| DL1 | PASS | AUTO / HAND · every solid and mark on a rung; the polish moves nothing up or down |
| DL2 | PASS | HAND · default dial full |
| DL3 | PASS | AUTO · DL-D drawn when exploded, DL-B skipped at side elevation |
| DL4 | PASS | SITE · adaptive dial and the detail entry in the title block |
| DL5 | PASS | FLAG · rung counts and frame times in the detail ladder below |
| Q1 | PASS | check, clamp and edge distance clean |
| Q2 | PASS | 0 clashes |
| Q3 | PASS | package written; site build passes in npm run check |
| Q4 | PASS | plan, 28°, side, explode at 0°, 28° and 88°, light sheet (dist/shots-worm-drive); both sheets in the visual baselines |
| Q5 | PASS | browser bench at DPR 1.5; under target |
| Q6 | PASS | every row judged |
| Q7 | PASS | conformance: worm-drive at 2.14, pass |

## Joints
| Joint | Type | F1 locate | F2 retain | F3 torque | F4 thrust | F5 limit | F6 hold | F7 adjust | F8 lube | F9 timing | F10 protect |
|---|---|---|---|---|---|---|---|---|---|---|---|
| pG | J2 | 2 x Dowel pin Ø3 x 10 h6, housing to base | 3 x Internal circlip DIN 472, Ø21; Shaft collar 12x22, set screw; External circlip DIN 471, Ø12; Bearing F6801ZZ (12x21x5), floating | Feather key 4 x 4 x 20 (DIN 6885) | Wave washer 16.5x20.8, spring steel; Thrust washer 12.2x18, bronze | – turns fully | – held by the worm at rest | – the wheel's shim pack (mesh) | – sealed and shielded bearings | – see mesh | – none needed |
| pW | J10 | 4 x Dowel pin Ø4 x 14 h6, block to base | 2 x Shaft collar Ø10 x Ø20 x 6, set screw M3; 2 x Pillow block, bored for a 6800-2RS; External circlip DIN 471, Ø10 | Feather key 3 x 3 x 56.5 (DIN 6885) | 2 x Shaft collar Ø10 x Ø20 x 6, set screw M3; External circlip DIN 471, Ø10 | – turns fully | – driven through the belt | – the worm's shim pack (mesh) | – sealed bearings | – see mesh | – see drive |
| mesh-worm-wheel | J9 | – the shafts locate the gears | – circlips (pW), circlip over the wheel (pG) | – keys (pG, pW) | 2 x Thrust washer 10.2x20, bronze; Thrust washer 12.2x22, bronze | – continuous rotation | – self-locking at rest, noted, not a brake | Shim pack Ø10.2 x Ø18, 0.5 mm, sets the worm's mounting distance; Shim pack Ø12.2 x Ø20, 0.5 mm, sets the wheel's mounting distance | Felt oiler 12 x 4 x 12, oil-soaked wool felt, pressed on the worm's thread | Worm, single start, module 3; Worm wheel, 30 teeth, hub and six arms | – none needed |
| drive | drive | – bracket screwed to the base | – pulley hub set screws | Pulley hub, 2 x M3 set screws at 90° | – motor bearings | – motor turns freely | – motor holds when powered | Motor bracket, one-piece angle, slotted for belt tension | – belt runs dry | Home flag read by the fork sensor | Home flag, 1 mm steel vane; 3 x Fork sensor, slotted optical, 5 mm gap; Pulley flanges |
| pG-bridge-post | post | 2 x spigot | – screwed from both sides | – static | – static | – static | – static | – spigot in a slot takes the hole tolerance | – static | – static | – static |

## Variants and overrides
| Joint or part | Rule result | Chosen | Why |
|---|---|---|---|
| wheel | solid web, steel | hub and six arms (H.spokes), phosphor bronze CuSn12 | M2, M10: it starts and stops; bronze on the hardened worm |
| worm | steel C45, induction-hardened | 16MnCr5, case-hardened, thread ground | M10: the hard face of a sliding pair |
| mesh-worm-wheel | greased at assembly | oiled by a felt on the worm's thread | F8: the contact slides |
| pW | collars only | an external circlip past the worm's outer thrust washer | F4: thrust away from the located block reaches it through the shaft |

## Detail ladder
| Rung | Solids | Marks | Frame ms at this dial position |
|---|---|---|---|
| DL-A | 11 | 0 | 2.3 |
| DL-B | 0 | 245 | 1.88 |
| DL-C | 0 | 0 | 1.83 |
| DL-D | 14 | 0 | 1.63 |
| DL-E | 10 | 4 | 1.57 |
| DL-F | 0 | 0 | 1.56 |
| DL-G | 0 | 0 | 1.44 |
| DL-H | 18 | 0 | 1.36 |
| never | 77 | 121 | 2.72 (full) |

## Promotion candidates
Hand fixes that should become rules or primitives.

- J9 worm (Appendix A points, standard 2.14): the worm first in meshes; the worm between two blocks, never overhung, the located block taking its thrust both ways (F4), so a circlip on the shaft past the outer thrust washer; the wheel's shim sets its mid-plane on the worm's axis (F7); bronze wheel, case-hardened ground worm (M10); oiled, not greased (F8); self-locking noted where the lead angle is below the friction angle, no substitute for a brake. The circlip, the materials and the oil belong in J9 for a worm mesh once a second worm (or a lead screw, J11) repeats them.
- A12 clamp check: a felt or wiper on a turning part is a designed contact, like a thrust washer; the clamp check should skip kinds felt and wiper, so the felt can be drawn touching the thread.
- F8 oiler block: a felt pressed on a turning part from a screwed block with an oil hole, a candidate `H.oiler` once a second mechanism needs one.

## Verification
check: clean · clearance: 0 clashes · clamp: clean · edge distance: clean · package: 21.2 KB
screenshots: plan, 28°, side, explode at 0°, 28° and 88°, light (dist/shots-worm-drive) · bench: browser, DPR 1.5, 2026-10-20; 28° frame 2.81 ms at full detail, under target
