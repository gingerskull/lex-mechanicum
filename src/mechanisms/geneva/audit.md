# Audit: Geneva drive (geneva)
standard: 2.5 · date: 2026-10-18 · result: pass · detail: full · pass: audit+fix

## Summary
PASS 116 · FAIL 0 · N/A 5 · open: none

## Requirements
| Id | Status | Evidence / action |
|---|---|---|
| S1 | PASS | DATA · the standard carries version 2.0 and its changelog |
| S2 | PASS | HAND · header with standard, date, result, detail, pass |
| S3 | PASS | AUTO · tools/conformance reads this header and runs in npm run check |
| S4 | PASS | SITE · #11 holds only this mechanism's decisions and open items |
| P1 | PASS | DATA · record complete; model.ts, polish.ts, audit.md present |
| P2 | PASS | DATA · catalogue validator clean; "Reversing" stands for the wheel turning against the crank, as on the spur pair |
| P3 | PASS | DATA / SITE · page shows ratio (index step), axes, output character, backdrivable, other names, family, motion, level, dof and the motorised drive |
| P4 | PASS | DATA · tags grouped Function, Property, Application, keywords underneath |
| P5 | PASS | DATA · motion, forces, benefits, limits; four uses with one line each |
| P6 | PASS | DATA · Wikipedia, a textbook, an engineering guide and KMODDL; two videos, a photo page, an animation |
| P7 | PASS | HAND / SITE · no prose in model.ts or polish.ts; lint-style clean |
| P8 | PASS | SITE · no parts list, build or joint sections on the page |
| P9 | PASS | HAND · solve(): the wheel turns 90° during 90° of crank and dwells 270°, against the crank, zero speed at entry and exit, as the text says |
| P10 | PASS | HAND · roller circle traced, roller velocity, input spin and roller force while engaged, wheel angle while engaged, staircase plot of wheel angle |
| P11 | PASS | DATA · plain, short sentences, no em dashes, mm and degrees |
| K1 | PASS | HAND · check: max link error 1.4e-14 mm; strips, segment and windows are cut behind the modelled slot walls, locking arc and relief |
| K2 | PASS | HAND · check: finite, continuous, periodic over 720 samples |
| K3 | PASS | HAND · custom disc and wheel, links for the arm plates, caps; between and at placement |
| K4 | PASS | HAND · roles driver, output, pin; accent only on the input cap pD |
| K5 | PASS | HAND · check clean: rear arm layer -1, disc and wheel layer 0, front arm layer 1 |
| K6 | PASS | DATA · n 4, c 110, a = c sin(π/4) = 77.8, R = c cos(π/4) = 77.8, slot half-width 7, locking disc 0.65 a, relief Rw + 3: as the catalogue |
| K7 | PASS | HAND · input rotary on the arm |
| D1 | PASS | HAND · tapered arm plates (R12 at the input, R8 at the stud) with boss rings; flush caps; squircle base |
| D2 | PASS | HAND · bosses round every pin; windows only in the wheel, the inertia-critical indexed member |
| D3 | PASS | STYLE · roles told apart by pattern and tone in both sheets |
| D4 | PASS | AUTO · feet concentric with the corner arcs |
| D5 | PASS | AUTO / HAND · one bridge over W on two spigoted posts, built as two arms because its posts stand outside the wheel |
| D6 | PASS | HAND / STYLE · strips, felts, screws and leads read quieter than the wheel, disc and arm |
| D7 | PASS | HAND · wheel, disc, arm and bridge carry only load shape and manufacturing marks |
| A1 | PASS | AUTO · pD J2, pW J1; pR J4, the open slots found over the four cycles the wheel takes to index round |
| A2 | PASS | AUTO · live shaft at the accent input, dead axle at W, shoulder bolt with a track roller at R |
| A3 | PASS | AUTO · 688-2RS on the Ø8 input, F6800 in the wheel; track roller Ø13.7 on the Ø8 stud |
| A4 | PASS | AUTO · stepped D-flat input shaft with end retainer; shouldered axle and stud with undercut threads |
| A5 | PASS | AUTO · D-flat on the Ø8 input for both arm plates and the disc |
| A6 | PASS | AUTO · no floating fixed plate besides the bridge, on spigoted Ø10 standoffs |
| A7 | PASS | AUTO · 8 mm base 2 mm under the rear arm, counterbored corners, feet, roller path engraved, front scale, clearance hole for the input shaft |
| A8 | PASS | AUTO · every head has its shank; holes cut by stage 3, the strip and segment screws tapped half in the wheel or disc |
| A9 | PASS | HAND · the arm is a clevis: the roller stud works in double shear; W held by base and bridge |
| A10 | PASS | HAND · disc and wheel share z 0 to 6; arm plates one layer below and above, symmetric about the roller |
| A11 | PASS | HAND · stud to both arm plates to the keyed input; axle to base (nyloc) and bridge; housing screwed and dowelled; bridge screwed and located by spigots |
| A12 | PASS | AUTO · clamp check clean |
| A13 | PASS | AUTO / HAND · every solid named with catalogue sizes, sets counted |
| A14 | PASS | HAND · bridge posts outside the wheel tip circle and the arm's sweep; strips and felts inside the wheel outline; clearance 0 |
| A15 | PASS | AUTO · clearance: 0 clashes over the cycle |
| A16 | PASS | HAND · a note and a badge on every joint, five build rules |
| A17 | PASS | HAND · housing and shaft, rear arm, spacer, disc with its segment, spacer, front arm, end screw; wheel with strips and felts on its bearing, axle up through the base, drag pack, bridge, nut; the stud last through the front arm |
| E1 | PASS | AUTO · one level per solid |
| E2 | PASS | AUTO · screws, bolts with their shims, the stud with its roller, shafts and bought units are groups |
| E3 | PASS | AUTO · stud and axle leave upward, the axle nut and housing screws downward |
| E4 | PASS | HAND · stud 3, bridge 3, front arm 2, disc and wheel 1, rear arm 0: the last part fitted goes furthest |
| E5 | PASS | AUTO · bearings, circlips, strips and felts stay in their parts |
| E6 | PASS | AUTO · motor with its bracket, bearings and roller whole |
| E7 | PASS | AUTO · spacers midway |
| E8 | PASS | AUTO · arm plates and disc keep their order on the input shaft |
| E9 | PASS | HAND · readable at full explode at 28° and 70° |
| J1 | PASS | AUTO · W: shouldered axle through the base to a nyloc, bearing with circlip and flange, spacers, thrust washer, bridge on spigoted posts, oil sink over the open bearing |
| J2 | PASS | AUTO · D: housing with two sealed bearings, sleeve, wave washer, circlips, screwed and dowelled; D-flat shaft, pulley hub with two set screws, end retainer, thrust washer, home flag |
| J3 | N/A | no plain moving pin; the stud is J4 |
| J4 | PASS | AUTO · track roller on the stud, hardened wear strips screwed to every slot wall with the slots relieved behind them, felt oiler in every slot end |
| J5 | N/A | no slide |
| J6 | N/A | no gear mesh |
| J7 | N/A | the locking disc and wheel are a clearance fit, not a cam with a follower |
| J8 | PASS | AUTO · flanged motor pulley, mount slotted for tension |
| F1 | PASS | AUTO · housing dowelled, bridge spigoted |
| F2 | PASS | AUTO · bearings held by circlips and flanges; shaft end retainer; roller between inner spacers under the stud head |
| F3 | PASS | AUTO · D-flat on the input for arm plates and disc |
| F4 | PASS | AUTO / HAND · bronze thrust washers on the base under the arm and the wheel, wave washer preloading the input |
| F5 | N/A | the input turns fully and the wheel indexes in one direction: nothing to over-travel |
| F6 | PASS | HAND · drag pack on the wheel: bronze disc on the outer ring flange, wave washer under the bridge, taking up the 1.5 mm locking clearance |
| F7 | PASS | AUTO · belt tension by the slotted mount; the Geneva has no adjustable length |
| F8 | PASS | AUTO / HAND · felt oiler in every slot end; oil sink on the bridge over the open wheel bearing |
| F9 | PASS | HAND · station dots 1 to 4 on the wheel, index line on the base |
| F10 | PASS | AUTO / HAND · pulley flanges, home flag and fork sensor; no slip clutch (decided at planning) |
| M1 | PASS | AUTO · edge breaks on every top face |
| M2 | PASS | HAND · four lobe windows take 30% of the wheel's area, 8 mm from every working surface and the bearing seat |
| M3 | PASS | AUTO · bore entry chamfers on every seat and through hole |
| M4 | PASS | AUTO / HAND · countersinks for every strip, segment and end screw; counterbored housing screws and base corners |
| M5 | PASS | AUTO / HAND · window cutter radius 3 mm; slot ends full radius |
| M6 | PASS | AUTO · edge distance and walls clean |
| M7 | PASS | HAND · the bridge arms run into the pivot boss: their crotch falls inside it, so there is no inside corner to fillet |
| M8 | PASS | AUTO · undercuts on the stud and axle threads |
| M9 | PASS | AUTO / HAND · stud M5 into the steel rear arm over 6 mm (1 d); axle through the base to a nyloc (M8 would sit short in 8 mm of aluminium); standard lengths |
| M10 | PASS | AUTO / HAND · steel arm plates, hard-anodised wheel and disc, hardened strips and segment, bronze drag disc |
| M11 | PASS | AUTO · centre holes and chamfered ends on the shafts |
| M12 | PASS | HAND · every head reachable from above or below when assembled; bearings pressed out past their circlips |
| M13 | PASS | AUTO / HAND · threadlocker on every screw and bolt, nyloc on the axle |
| M14 | PASS | AUTO / HAND · wear strips on every slot wall; the locking arc is a replaceable hardened segment on 4 x M3 |
| V1 | PASS | AUTO · pancake outrunner Ø50 x 18 under the base, GT2 32:16 |
| V2 | PASS | AUTO · one-piece bracket, flange screws up into the base |
| V3 | PASS | AUTO / HAND · belt and pulleys clear of feet and housing; clearance 0 |
| V4 | PASS | AUTO · flanges, set screws, slotted mount |
| V5 | PASS | AUTO · rotary: belt to the input pulley |
| V6 | PASS | AUTO · home flag, fork sensor on the housing, leads laid round the housing to the terminal block, one P-clip |
| L1 | PASS | STYLE · lint-style clean |
| L2 | PASS | HAND · the polish carries geometry, roles, marks and materials only |
| L3 | PASS | HAND · arm and disc driver, wheel output, segment driver, hardware hw |
| L4 | PASS | HAND / STYLE · accent on the input only |
| L5 | PASS | AUTO / HAND · screws, bearings and the roller are real solids in real holes |
| L6 | PASS | AUTO · depth order right at plan, 28°, side and explode |
| L7 | PASS | STYLE · tilt 0° to 88°, no shear |
| L8 | PASS | AUTO / HAND · station dots and the base index line are timing marks |
| R1 | PASS | HAND · the polish reuses H.lockingSegment, H.dragPack and H.window; the roller stud, strips and felts are the rules'; no inline standard part |
| R2 | PASS | HAND · threads M2, M3, M4, M5, M8; joints Ø6, 8, 10; two bearing sizes and one roller |
| R3 | PASS | AUTO · housing, bridge and drive from their subassemblies |
| R4 | PASS | AUTO · package built at build time |
| R5 | PASS | HAND · states only what differs; rules 0.13 s, polish 0.07 s, the window search the largest part |
| R6 | PASS | FLAG · browser bench (one run for all four): plan 10.7, 28° 50.3, side 12.6, explode 32.1 ms at full detail; 8 ms reached at dial E; runs on this machine vary by up to half (look at in #14) |
| R7 | PASS | HAND · model.ts + polish.ts 12.2 KB |
| R8 | PASS | AUTO / SITE · pre-rendered thumbnails; the stage draws on change only |
| DL1 | PASS | AUTO / HAND · every solid and mark on a rung; the polish moves nothing |
| DL2 | PASS | HAND · default dial full |
| DL3 | PASS | AUTO · DL-D drawn when exploded, DL-B skipped at side elevation |
| DL4 | PASS | SITE · adaptive dial and the detail entry in the title block |
| DL5 | PASS | FLAG · rung counts and frame times in the detail ladder below |
| Q1 | PASS | check, clamp and edge distance clean |
| Q2 | PASS | 0 clashes |
| Q3 | PASS | package written; site build and site tests pass |
| Q4 | PASS | plan, 28°, side, explode at 28° and 70°, both sheets; attached to #11 |
| Q5 | PASS | browser bench at DPR 1.5; flags under R6 |
| Q6 | PASS | every row judged |
| Q7 | PASS | conformance: geneva at 2.0, pass |

## Joints
| Joint | Type | F1 locate | F2 retain | F3 torque | F4 thrust | F5 limit | F6 hold | F7 adjust | F8 lube | F9 timing | F10 protect |
|---|---|---|---|---|---|---|---|---|---|---|---|
| pD | J2 | 2 x Dowel pin Ø3 x 10 h6, housing to base | 2 x Internal circlip DIN 472, Ø16; Countersunk M4 x 10 (ISO 10642), into the shaft end, flush; Socket head M4 x 8 (ISO 4762), into the shaft end | Input shaft Ø8 h6, D-flat | Wave washer 12x15.8, spring steel; Thrust washer 8.2x14, bronze | – the input turns fully | – driven through the belt | – belt tension at the motor mount (drive) | – sealed bearings | – arm plates and disc on one D-flat: one way on | – see drive |
| pW | J1 | 2 x spigot | Internal circlip DIN 472, Ø19; Bearing F6800 (10x19x5) | – the wheel turns on its bearing, nothing keyed | Thrust washer 10.2x13.1, bronze | – indexes in one direction, nothing to over-travel | Drag pack: bronze friction disc 17.0x21.3, on the outer ring flange; Drag pack: wave washer, preloaded by the bridge | – no adjustable length | Bridge over the pivot, on two spigoted posts | Station dots 1 to 4 on the wheel, index line on the base | – none needed |
| pR | J4 | – no removable plate on the stud | head | – the roller turns freely on the stud | Roller between inner spacers, clamped by the stud | – the slot ends lie beyond the roller's deepest point | – held by the drag pack at W | – no adjustable length | 4 x Felt oiler in the slot end, oil-soaked wool felt | – phase fixed by the D-flat at the input | – none needed |
| pW-bridge-post | post | 2 x spigot | – screwed from both sides | – static | – static | – static | – static | – spigot in a slot takes the hole tolerance | – static | – static | – static |
| drive | drive | – bracket screwed up into the base | – pulley hub set screws (pD) | Pulley hub, 2 x M3 set screws at 90° | – motor bearings | – motor turns freely | – motor holds when powered | bracket | – belt runs dry | Home flag read by the fork sensor | Home flag, 1 mm steel vane; 3 x Fork sensor, slotted optical, 5 mm gap; Pulley flanges |

## Variants and overrides
| Joint or part | Rule result | Chosen | Why |
|---|---|---|---|
| disc | one piece | locking arc as a screwed, hardened segment (H.lockingSegment) | M14 |
| pW | rigid bearing stack | drag pack on the outer ring flange under the bridge (H.dragPack) | F6: the locking arcs run with 1.5 mm clearance |
| wheel | plain | four lobe windows, 30% of its area | M2 |
| arm plates | straight stadium | tapered in the model, bosses R12 and R8; the front plate twinned with the rear one | D1, A9 |

## Detail ladder
| Rung | Solids | Marks | Frame ms at this dial position |
|---|---|---|---|
| DL-A | 8 | 0 | 40.9 |
| DL-B | 0 | 224 | 39.4 |
| DL-C | 0 | 0 | 17.4 |
| DL-D | 21 | 0 | 12.7 |
| DL-E | 12 | 13 | 5.9 |
| DL-F | 0 | 0 | 14.1 |
| DL-G | 0 | 0 | 6.2 |
| DL-H | 16 | 0 | 9.3 |
| never | 111 | 124 | 44.9 (full) |

## Promotion candidates
Hand fixes that should become rules or primitives.

- None open. J4 for open slots, pins classified over the cycle, the clevis twin, H.dragPack sizes and the locking
  segment primitive were promoted in standard 2.1.

## Verification
check: clean · clearance: 0 clashes · clamp: clean · edge distance: clean · package: 25.8 KB
screenshots: plan, 28°, side, explode at 28° and 70°, both sheets (attached to #11) · bench: browser, DPR 1.5, 2026-10-18; 28° frame 50.3 ms at full detail, 8 ms reached at dial E (flag, R6)
