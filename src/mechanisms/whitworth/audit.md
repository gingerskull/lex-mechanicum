# Audit: Whitworth quick-return (whitworth)
standard: 2.3 · date: 2026-10-18 · result: pass · detail: full · pass: build

## Summary
PASS 119 · FAIL 0 · N/A 2 · open: none

## Requirements
| Id | Status | Evidence / action |
|---|---|---|
| S1 | PASS | DATA · the standard carries version 2.3 and its changelog |
| S2 | PASS | HAND · header with standard, date, result, detail, pass |
| S3 | PASS | AUTO · tools/conformance reads this header and runs in npm run check |
| S4 | PASS | SITE · #42 holds only this mechanism's decisions and open items |
| P1 | PASS | DATA · record complete; model.ts, polish.ts, audit.md present |
| P2 | PASS | DATA · catalogue validator clean (unit tests pass) |
| P3 | PASS | DATA / SITE · ratio (stroke, cut:return 1.59:1, stroke 64 mm), axes, output character, backdrivable, other names, family, motion, level, dof, motorised drive |
| P4 | PASS | DATA · tags grouped Function, Property, Application, keywords underneath |
| P5 | PASS | DATA · motion, forces, benefits, limits; three uses with one line each |
| P6 | PASS | DATA · Wikipedia (two), a guide and course notes; videos and a photo page. Real world: two YouTube videos of an Atlas Rhodes shaper in action, both checked live (oEmbed) and on topic (the Whitworth motion on a real shaper); kept |
| P7 | PASS | HAND / SITE · no prose in model.ts or polish.ts; lint-style clean |
| P8 | PASS | SITE · no parts list, build or joint sections on the page |
| P9 | PASS | HAND · solve() gives stroke 64.00 mm (x 68 to 132), cut 221.0° and return 139.0°, ratio 1.590: as the catalogue text |
| P10 | PASS | HAND · paths of B and the crank pin, velocity at C and B, rod force line, input spin on the pinion, lever angle, ram position plot |
| P11 | PASS | DATA · plain, short sentences, no em dashes, mm and degrees |
| K1 | PASS | HAND · check: link error 4.3e-14 mm; the polish changes heights, hardware and the cabling position only |
| K2 | PASS | HAND · check: finite, continuous, periodic over 720 samples |
| K3 | PASS | HAND · disc (hub), gears, slotLink, link, slider, plate (ram cap), rails, caps; at, between and fixed placement |
| K4 | PASS | HAND · roles driver (pinion), link, output, ground, pin; accent only on the pinion shaft cap pPn |
| K5 | PASS | HAND · check clean. Layers: hub -1; gears 0 (plated 3 mm low); lever 1 (plated 1.5 mm up); ram and rails 2; rod 3; ram cap 4. Plating by `dz` in model.ts, the rules build every stack on it (K1) |
| K6 | PASS | DATA · r 40, e 14, R 32, Lr 100, 50T and 16T module 2, centre distance 66, pinion at 200°, ram line y -14, pinion phased to mesh (a tooth meets a gap on the line of centres): as the catalogue. Deliberate additions: the bull gear is a ring on a hub; the rails start at x 54 (were 68) so the ram never leaves them (see Variants) |
| K7 | PASS | HAND · input rotary on the pinion |
| D1 | PASS | HAND · tapered rod (R8.5 and R8), slotted lever with stadium slot, involute gears, slider with square ends on twin stadium rails, squircle base |
| D2 | PASS | HAND · bosses round every pin; the bull gear is a ring where the load runs (rim, bore ring); the lever keeps constant 22 mm width: its load runs the whole length. No windows |
| D3 | PASS | STYLE · roles told apart by pattern and tone in both sheets |
| D4 | PASS | AUTO · feet concentric with the corner arcs |
| D5 | PASS | AUTO / HAND · rails on ground pads; the hub on two posts with dowels; the ram cap on one shaped post |
| D6 | PASS | HAND / STYLE · hub hardware, slide hardware and leads read quieter than lever, rod and ram |
| D7 | PASS | HAND · lever, rod, ram, rails and base carry only load shape and manufacturing marks |
| A1 | PASS | AUTO · pPn J2, pO3 J1, pA J4, pB J3, pC J3, slide-ram J5, mesh J6; the bull gear on its hub is written by hand (O2, J1 form) |
| A2 | PASS | AUTO · live pinion shaft, dead axle at O3, track roller at A, shoulder bolts at B and C, slide on the rails, mesh hardware |
| A3 | PASS | AUTO · 6800-2RS on the Ø10 pinion shaft, F6800 at O3, F686ZZ at B and C, track roller on a Ø8 stud at A; spacers in every gap |
| A4 | PASS | AUTO · stepped shoulder bolts and axle with undercut threads; keyed pinion shaft with end retainer |
| A5 | PASS | AUTO · feather key 3 x 3 on the Ø10 pinion shaft |
| A6 | PASS | AUTO · rails on three ground steel pads each (32 mm high), countersunk M3 into the base, two dowels each; the hub on two Ø10 standoffs (placed by hand: the rule's pair fell on the pivot bore) |
| A7 | PASS | AUTO · 8 mm base, counterbored corners, feet, paths engraved, front scale, clearance holes for the pinion shaft and the pivot axle |
| A8 | PASS | AUTO · every head has its shank; holes cut by stage 3 (retainer plate and hub included) |
| A9 | PASS | HAND · C a clevis (ram below the rod, cap above on a post): double shear. A, B, O3 and the pinion are single shear because a part sweeps over each: the lever over the gear (A) and under the rod (B), the rod over the pivot (O3), the lever tip over the pinion hub (0.9 mm). A runs 1.5 mm over the gear on a roller stud; the pinion has no straddle bridge for the same reason and sits on two housing bearings 15 mm apart |
| A10 | PASS | HAND · planes follow the sweeps: gears share one, lever over them, ram and rails over the lever's tip, rod over the ram. The ram sits high (z 20) only because the lever tip sweeps under it; no plate is stacked only to clear |
| A11 | PASS | HAND · pinion to key to shaft to housing (screwed and dowelled); roller stud to bull gear to bushing to hub to posts, dowels and base; lever to bearing to axle to hub and base (nyloc under the base); rod pins to lever and ram, ram to rails, keeper, gib and pads, pads screwed and dowelled |
| A12 | PASS | AUTO · clamp check clean |
| A13 | PASS | AUTO / HAND · every solid named with catalogue sizes, sets counted; the bull bushing, thrust washers and retainer plate named by hand |
| A14 | PASS | HAND · margins at the extremes: lever over pinion shaft end 0.9 mm, hub screw heads under the lever 1.3 mm, rod over the keeper 0.7 mm, pivot axle head under the rod 3.9 mm, cap post clear of the rod's big end by 2 mm; rails start 54 mm from O3 so the ram (C from 68 to 132, 28 wide) is on them at both ends of the stroke, the lever passing under their near end and the first pad 14 mm along, past its 66 mm sweep; clearance 0 |
| A15 | PASS | AUTO · clearance: 0 clashes over the cycle |
| A16 | PASS | HAND · a note and a badge on every joint, five build rules |
| A17 | PASS | HAND · housing, pinion shaft, pinion; hub on its posts and dowels, flange, thrust washer, bull gear with bushing, thrust washer, retainer and screws; pivot axle, lever; rail pads, rails, ram, keeper; rod on B then C; cap post and cap; wrist pin last |
| E1 | PASS | AUTO · one level per solid |
| E2 | PASS | AUTO · screws, bolts with their shims, shafts and bought units are groups |
| E3 | PASS | AUTO · pins and cap screw upward, housing, hub and drive screws downward |
| E4 | PASS | HAND · retainer plate and its screws leave before the bull gear; lever before the gear; wrist pin and cap above the rod, rod above ram: last fitted goes furthest |
| E5 | PASS | AUTO · bearings, bushing and circlips stay in their parts |
| E6 | PASS | AUTO · motor with its bracket, bearings whole |
| E7 | PASS | AUTO · spacers midway |
| E8 | PASS | AUTO · pinion hub and key keep their order on the shaft |
| E9 | PASS | HAND · looked at: readable at full explode at 28° and 70°, both sheets, nothing leaves the frame |
| J1 | PASS | AUTO / HAND · pivot O3: shouldered axle through hub and base to a nyloc, bearing in the lever, spacers, thrust washer, circlip. No bridge: the rod sweeps over the pivot, so the head sits 1 mm over the bearing (variant). Bull gear on its hub: bronze bushing, hub flange, thrust washers, retainer plate, oil sinks (by hand) |
| J2 | PASS | AUTO · pinion: housing with two sealed bearings, sleeve, wave washer, circlips, screwed and dowelled; keyed shaft, pulley hub with two set screws, end retainer, thrust washer, home flag. No straddle (the lever sweeps over it) |
| J3 | PASS | AUTO · B and C: shoulder bolts, bearings in the rod, inner-race spacers, threadlocker; clevis at C (variant) |
| J4 | PASS | AUTO · A: track roller on the stud in the lever's slot, hardened wear strips in both walls, felt oiler, slot cut for the full 26 to 54 mm run |
| J5 | PASS | AUTO · rails, keeper, bronze gib with adjusting screws and lock nuts, wipers, nipple, one end stop (far end; the rule drops the near end's stop, the lever sweeps there) |
| J6 | PASS | AUTO · pinion hub with key and set screw, eccentric bushing under the housing, timing marks on the meshing teeth |
| J7 | N/A | no cam |
| J8 | PASS | AUTO · flanged motor pulley, mount slotted for tension |
| F1 | PASS | AUTO · housing, hub (two dowels) and rails (end pads dowelled) located; the lever and rod carry bearings but are not removable plates |
| F2 | PASS | AUTO · bearings held by circlip and flange; bull gear by the retainer plate; keeper holds the ram; shaft end retainer |
| F3 | PASS | AUTO · feather key and set screw on the pinion; the bull gear takes torque at its teeth only, no key |
| F4 | PASS | AUTO · bronze thrust washers under and over the bull gear, at O3 and the pinion; wave washer preloading the pinion shaft |
| F5 | PASS | AUTO / HAND · one end stop with a neoprene pad just past the far end of the stroke; the near end has none (the lever sweeps there and the rule drops it): the rod and lever limit the ram on that side. The lever turns fully, nothing to limit |
| F6 | N/A | driven through the gears; no rest position to hold |
| F7 | PASS | AUTO · eccentric on the pinion shaft sets backlash; bronze gib on the ram; belt tension at the motor mount. The time ratio depends on e/r only and is fixed by the dowelled hub |
| F8 | PASS | AUTO / HAND · bull bushing oiled from two sinks in the retainer; felt oiler on the slot; wipers and nipple on the slide; sealed and shielded bearings elsewhere |
| F9 | PASS | AUTO · timing marks at the meshing teeth |
| F10 | PASS | AUTO / HAND · pulley flanges, home flag and fork sensor; no slip clutch: the stops are never touched in running |
| M1 | PASS | AUTO · edge breaks on every top face |
| M2 | PASS | HAND · the bull gear is a rim ring (no hub, it is carried on the hub bushing); pinion hub; no wheel that starts, stops or reverses |
| M3 | PASS | AUTO · bore entry chamfers on every seat and through hole |
| M4 | PASS | AUTO / HAND · counterbored housing screws and base corners, countersinks for rail screws; the retainer plate sits flat under button heads |
| M5 | PASS | AUTO / HAND · no milled pockets or windows |
| M6 | PASS | AUTO · edge distance and walls clean |
| M7 | PASS | HAND · lever and rod are stadiums and tapered hulls; no inside corner |
| M8 | PASS | AUTO · undercuts on every shoulder bolt and axle thread |
| M9 | PASS | AUTO / HAND · pins into the bronze or steel parts over full thickness; the cap screw 3 mm into the ram (1 d, M3); the axle through the base to a nyloc; standard lengths |
| M10 | PASS | AUTO / HAND · steel and bronze by role, hardened ground rails, bronze bushing and thrust washers |
| M11 | PASS | AUTO · centre holes and chamfered ends on the shafts |
| M12 | PASS | HAND · hub screws reached with the lever swung clear; every other head reachable; bearings pressed out past their circlips |
| M13 | PASS | AUTO / HAND · threadlocker on every screw, lock nuts on the gib screws, nyloc on the axle |
| M14 | PASS | AUTO / HAND · wear strips in the lever slot; hardened rails and the bronze gib; bronze bushing and thrust washers under the bull gear |
| V1 | PASS | AUTO · pancake outrunner Ø50 x 18 under the base, GT2 32:16 |
| V2 | PASS | AUTO · one-piece bracket, flange screws up into the base |
| V3 | PASS | AUTO / HAND · belt and pulleys clear; the terminal block moved along the base edge clear of the bracket wall (variant: the cabling rule put it under the wall); clearance 0 |
| V4 | PASS | AUTO · flanges, set screws, slotted mount |
| V5 | PASS | AUTO · rotary: belt to the pinion's input pulley |
| V6 | PASS | AUTO · home flag, fork sensor on the housing, leads to the terminal block, one P-clip |
| L1 | PASS | STYLE · lint-style clean |
| L2 | PASS | HAND · the model and polish carry geometry, roles, marks and materials only |
| L3 | PASS | HAND · pinion driver, bull gear and lever and rod link, ram and cap output, hub and rails ground, hardware hw |
| L4 | PASS | HAND / STYLE · accent on the pinion shaft only |
| L5 | PASS | AUTO / HAND · screws, bearings, bushing and roller are real solids in real holes; the retainer plate lets the bushing and hub show through the dashed hidden lines |
| L6 | PASS | AUTO · depth order right at plan, 28°, side and explode |
| L7 | PASS | STYLE · tilt 0° to 88°, no shear |
| L8 | PASS | AUTO / HAND · engraved paths and scale are marks |
| R1 | PASS | HAND · the polish reuses H.plate, H.bushing, H.thrustWasher, H.standoff, H.dowel, H.screw, H.lead; plating, the clevis twin and the ring gear are the model's; no inline standard part |
| R2 | PASS | HAND · threads M2, M2.5, M3, M4, M5, M6, M8; joints Ø6, 8, 10; bearings 6800-2RS, F686ZZ, F6800ZZ; GT2 16T and 32T |
| R3 | PASS | AUTO · housing, eccentric, slide and drive from their subassemblies |
| R4 | PASS | AUTO · package built at build time, 35.9 KB |
| R5 | PASS | HAND · states only what differs; no sampling; rules 0.26 s, polish 1 ms |
| R6 | PASS | FLAG · Node CPU bench at DPR 1.5 (not the browser bench): plan 356, 28° 323, side 246, explode 243 ms at full detail; 45 ms at dial H. Heavier than the slider-crank: 208 solids, a 50-tooth gear and a 16-tooth gear. Browser numbers to be taken with the browser bench |
| R7 | PASS | HAND · model.ts + polish.ts 17.4 KB |
| R8 | PASS | AUTO / SITE · pre-rendered thumbnails; the stage draws on change only |
| DL1 | PASS | AUTO / HAND · every solid and mark on a rung; the polish moves nothing |
| DL2 | PASS | HAND · default dial full |
| DL3 | PASS | AUTO · DL-D drawn when exploded, DL-B skipped at side elevation |
| DL4 | PASS | SITE · adaptive dial and the detail entry in the title block |
| DL5 | PASS | FLAG · rung counts and frame times in the detail ladder below |
| Q1 | PASS | check, clamp and edge distance clean |
| Q2 | PASS | 0 clashes |
| Q3 | PASS | package written, 35.9 KB; site build and site tests pass |
| Q4 | PASS | plan, 28°, side, explode at 28° and 70°, both sheets, overlays on; all looked at |
| Q5 | PASS | Node CPU bench; flags under R6 |
| Q6 | PASS | every row judged |
| Q7 | PASS | conformance: whitworth at 2.3, pass |

## Joints
| Joint | Type | F1 locate | F2 retain | F3 torque | F4 thrust | F5 limit | F6 hold | F7 adjust | F8 lube | F9 timing | F10 protect |
|---|---|---|---|---|---|---|---|---|---|---|---|
| pPn | J2 | 2 x Dowel pin Ø3 x 10 h6, housing to base | 2 x Internal circlip DIN 472, Ø19; External circlip DIN 471, Ø10; Socket head M5 x 10 (ISO 4762), into the shaft end | Feather key 3 x 3 x 7 (DIN 6885) | Wave washer 14.5x18.8, spring steel; Thrust washer 10.2x16, bronze | – driven, turns fully | – driven through the belt | Eccentric bushing Ø26, 0.3 mm offset bore Ø12, flanged | – sealed bearings | – marks at the mesh (J6) | – see drive |
| pO3 | J1 | 2 x Axle, shoulder bolt Ø10 x 70, M8 (ISO 7379), through the base, M8 nyloc underneath | Internal circlip DIN 472, Ø19; Bearing F6800ZZ (10x19x5) | – no keyed part | Thrust washer 10.2x13.1, bronze | – the lever turns fully | – driven | – the hub is dowelled; the time ratio is fixed | – shielded bearing | – no phase of its own | – none needed |
| pA | J4 | – no removable plate on a moving pin | head | – no keyed part | Track roller located by its stud shoulder | – limited by the linkage | – driven | – no adjustable length | Felt oiler, oil-soaked wool felt | – no phase of its own | – none needed |
| pB | J3 | – no removable plate on a moving pin | Internal circlip DIN 472, Ø13; Bearing F686ZZ (6x13x5); head | – no keyed part | F686ZZ located by flange and circlip, inner race clamped | – limited by the linkage | – driven | – no adjustable length | – shielded bearing, greased for life | – no phase of its own | – none needed |
| pC | J3 | – no removable plate on a moving pin | Internal circlip DIN 472, Ø13; Bearing F686ZZ (6x13x5); head | – the cap is clamped on the shoulder; no keyed part | F686ZZ located by flange and circlip, inner race clamped | – limited by the slide's stops | – driven | – no adjustable length | – shielded bearing, greased for life | – no phase of its own | – none needed |
| slide-ram | J5 | – the rails are dowelled to the base | Keeper plate, holds the slider down | – prismatic, no torque | – the keeper takes the lift, the base the weight | End stop block, hardened | – driven | Gib strip 3 x 6 x 96, bronze | 2 x wiper; Grease nipple M6 (DIN 71412) | – no phase to keep | – stops never touched in running |
| mesh-bull-pinion | J6 | – located by the housing and the hub | – each shaft retained at its own joint | Gear hub Ø22, set screw M3 on the key; Set screw M3 (DIN 916), threadlocked | – thrust at each shaft | – turn fully | – driven | Eccentric bushing Ø26, 0.3 mm offset bore Ø12, flanged | – greased open gears | Bull gear, 50 teeth; Pinion, 16 teeth | – none needed |
| raila-seat | post | 2 x Dowel pin Ø3 h6 (ISO 8734), rail to base | – screwed down through rail and pad at each pad | – static | – static | – static | – static | – the gib on the other rail adjusts the fit | – static | – static | – static |
| railb-seat | post | 2 x Dowel pin Ø3 h6 (ISO 8734), rail to base | – screwed down through rail and pad at each pad | – static | – static | – static | – static | – the gib on this rail adjusts the fit | – static | – static | – static |
| drive | drive | – bracket screwed up into the base | – pulley hub set screws (pPn) | Pulley hub, 2 x M3 set screws at 90° | – motor bearings | – motor turns freely | – motor holds when powered | bracket | – belt runs dry | Home flag read by the fork sensor | Home flag, 1 mm steel vane; 3 x Fork sensor, slotted optical, 5 mm gap; Pulley flanges |
| hub-post | post | 2 x Dowel pin Ø3 h6 (ISO 8734), hub to base | – M5 screws from both sides | – static | – static | – static | – static | – the dowels fix the pivot's offset | – static | – static | – static |
| O2 | J1 | Pivot hub; Hub flange Ø68, steel, pressed on and pinned | Bull gear retainer plate Ø62 x 2 | – torque at the teeth, no key | 2 x Thrust washer Ø48 x Ø62 x 1.5, bronze | – turns fully | – driven | – none: the ring is a bushing fit | Bronze bushing Ø48 x Ø52 x 7, oil-impregnated; Bull gear retainer plate Ø62 x 2 | – marks on the teeth (J6) | – none needed |

## Variants and overrides
| Joint or part | Rule result | Chosen | Why |
|---|---|---|---|
| bull gear | gear on a shaft at O2 | ring gear (Ø52 bore) on a fixed Ø48 hub, in the model | O3 lies 14 mm from O2, inside the gear: a shaft at O2 cannot carry the pivot. The hub carries the pivot stud |
| O2 | no rule for a ring on a hub | bronze bushing, hub flange, two thrust washers, retainer plate screwed to the hub, oil sinks (polish) | nothing in the rules builds this; see promotion candidates |
| hub posts | two posts on the outline's far points | two posts at (±15, 11), two dowels | the rule's pair fell on the pivot bore (edge distance) |
| pO3 | dead axle with a bridge on spigoted posts | axle head 1 mm over the bearing, no bridge; held in the hub and the base | the rod sweeps over the pivot: a bridge or a tall axle would meet it (clearance 8 mm) |
| gears | layer 0, z 0 to 7 | plated 3 mm low (`dz`), z -3 to 4 | the lever tip sweeps over the pinion hub and circlip |
| ram, rails, rod, cap | layers 0 and 1 | ram and rails layer 2, rod layer 3, cap layer 4 | the lever tip (66 mm) sweeps under the ram's whole left end; the rod's pin B sits above the lever; the rails start 54 mm from O3, the first pad stands past the lever's sweep |
| pC | wrist pin through ram and rod, single shear | ram cap twinned with the ram in the model, on a post at x 14 | A9: double shear |
| terminal block | on the base edge below the motor, under the bracket wall | moved 28 mm along the edge, leads re-run, clip moved | V3: the screw cut the bracket wall |
| pPn, pA, pB, pO3 | single shear | kept | sweeps forbid a bridge or plate (A9) |

## Detail ladder
| Rung | Solids | Marks | Frame ms at this dial position |
|---|---|---|---|
| DL-A | 12 | 0 | 262.5 |
| DL-B | 0 | 267 | 261.6 |
| DL-C | 0 | 0 | 70.2 |
| DL-D | 29 | 0 | 59.8 |
| DL-E | 12 | 6 | 57.1 |
| DL-F | 0 | 0 | 55.0 |
| DL-G | 0 | 0 | 51.4 |
| DL-H | 25 | 0 | 44.9 |
| never | 130 | 156 | 325.1 (full) |

## Promotion candidates
Hand fixes that should become rules or primitives.

- Ring gear on a hub (hub flange, bushing, thrust washers, retainer plate, oil sinks): a joint type for a part that turns on a fixed hub round another pivot. First occurrence; wait for a second before promoting.
- Cabling (`cabling()` in src/hardware/sub/drive.ts): the terminal block is put at the base edge nearest the motor lead without testing the motor bracket. Here the base grew to carry the bracket and the block, at 22 mm from the bracket centre, landed under the wall (hole wall -0.58 mm). Patch: try candidate points along the edge and keep the first whose block (±10 x ±4) clears the bracket circle by 3 mm.
- Standoff rule (`standoffs.ts`): posts on the two farthest points of a disc's polygon outline fall on a pivot bore through the plate. Patch: skip a candidate within a hole's wall distance (M6) of a hole in the plate.
- Dead axle bridge (`j1-dead-axle.ts`): a bridge is built at any height above the stack; it is not checked against parts that sweep over the axle column (here the rod, 8 mm of clash). A rule that tests the axle column against sweeps, and otherwise uses a head 1 mm over the bearing, would replace the hand override.

## Verification
check: clean · clearance: 0 clashes · clamp: clean · edge distance: clean · package: 36.0 KB
screenshots: plan, 28°, side, explode at 28° and 70°, both sheets (local .scratch, baselines in tests/visual/__baselines__) · bench: Node CPU, DPR 1.5, 2026-10-18; full detail 325 ms, dial H 45 ms (flag, R6)
