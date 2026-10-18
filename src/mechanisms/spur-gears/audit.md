# Audit: Spur gear pair (spur-gears)
standard: 2.5 · date: 2026-10-18 · result: pass · detail: full · pass: audit+fix

## Summary
PASS 113 · FAIL 0 · N/A 8 · open: none

## Requirements
| Id | Status | Evidence / action |
|---|---|---|
| S1 | PASS | DATA · the standard carries version 2.0 and its changelog |
| S2 | PASS | HAND · header with standard, date, result, detail, pass |
| S3 | PASS | AUTO · tools/conformance reads this header and runs in npm run check |
| S4 | PASS | SITE · #12 holds only this mechanism's decisions and open items |
| P1 | PASS | DATA · record complete; model.ts, polish.ts, audit.md present |
| P2 | PASS | DATA · catalogue validator clean |
| P3 | PASS | DATA / SITE · page shows ratio (reduction 2:1), axes, output character, backdrivable, other names, family, motion, level, dof and the motorised drive |
| P4 | PASS | DATA · tags grouped Function, Property, Application, keywords underneath |
| P5 | PASS | DATA · motion, forces, benefits, limits; three uses with one line each |
| P6 | PASS | DATA · Wikipedia, KMODDL and an engineering guide; two videos, a photo page, an animation |
| P7 | PASS | HAND / SITE · no prose in model.ts or polish.ts; lint-style clean |
| P8 | PASS | SITE · no parts list, build or joint sections on the page |
| P9 | PASS | HAND · solve(): the gear turns half as fast and the other way, ratio exact; the pressure angle of 20° as the text says |
| P10 | PASS | HAND · velocity on the pinion pitch circle, input and output spin, pressure angle, gear angle plot (slope -0.5) |
| P11 | PASS | DATA · plain, short sentences, no em dashes, mm and degrees |
| K1 | PASS | HAND · centres exact; hubs, spokes, bridge and flange are cut round the model's teeth and pitch circles |
| K2 | PASS | HAND · check: finite, continuous, periodic over 720 samples |
| K3 | PASS | HAND · two gears and two caps; at placement with spin |
| K4 | PASS | HAND · roles driver, output, pin; accent only on the input cap p1 |
| K5 | PASS | HAND · check clean: both gears on layer 0, they mesh and never overlap |
| K6 | PASS | DATA · m 4, z 14 and 28, 20°, centre distance 84, half-tooth phase: as the catalogue; no undercut drawn on the 14-tooth pinion (code comment) |
| K7 | PASS | HAND · input rotary on the pinion |
| D1 | PASS | HAND · involute teeth, hubs with set screws, keyed bores; the gear with hub and six spokes |
| D2 | PASS | HAND · rim two modules under the roots, hub 8 mm round the bore, spokes 8 mm wide |
| D3 | PASS | STYLE · roles told apart by pattern and tone in both sheets |
| D4 | PASS | AUTO · feet concentric with the corner arcs |
| D5 | PASS | AUTO / HAND · one bridge over both shafts on two spigoted posts in the waist between the tip circles |
| D6 | PASS | HAND / STYLE · bridge, eccentrics and screws read quieter than the gears; the gears show through the bridge |
| D7 | PASS | HAND · gears, bridge and flange carry only load shape and manufacturing marks |
| A1 | PASS | AUTO · p1 J2, p2 J2, mesh J6 |
| A2 | PASS | AUTO · both shafts live (the accent input, and the output with its keyed gear) |
| A3 | PASS | AUTO · 6800 on the Ø10 input, 6801 on the Ø12 output, in the housings and the bridge |
| A4 | PASS | AUTO · stepped keyed shafts with circlip grooves over the hubs, end retainers below |
| A5 | PASS | AUTO · feather keys on Ø10 and Ø12; the output flange keyed too |
| A6 | PASS | AUTO · no floating fixed plate besides the bridge, on spigoted Ø10 standoffs |
| A7 | PASS | AUTO · 8 mm base, counterbored corners, feet, front scale, clearance holes for both shafts |
| A8 | PASS | AUTO · every head has its shank; holes cut by stage 3 |
| A9 | PASS | HAND · nothing sweeps over the gears, so both shafts are straddle mounted: housing pair below, floating bearing in the bridge above |
| A10 | PASS | HAND · both gears and their hubs share one plane; the bridge above both |
| A11 | PASS | HAND · gears to keyed shafts to housings (screwed and dowelled) and bridge (screwed, spigot-located); eccentrics clamped by their screws |
| A12 | PASS | AUTO · clamp check clean |
| A13 | PASS | AUTO / HAND · every solid named with catalogue sizes, sets counted |
| A14 | PASS | HAND · bridge posts in the waist between the tip circles, clear of both gears; clearance 0 |
| A15 | PASS | AUTO · clearance: 0 clashes over the cycle |
| A16 | PASS | HAND · a note and a badge on every joint, five build rules |
| A17 | PASS | HAND · housings and shafts from below, gears, keys, hubs and circlips, bridge with its bearings and the top eccentric, spacer, flange and end screw; every screw reachable |
| E1 | PASS | AUTO · one level per solid |
| E2 | PASS | AUTO · screws, shafts and bought units are groups; the top eccentric and its flange one group |
| E3 | PASS | AUTO · bridge and flange screws upward, housing screws and shafts downward |
| E4 | PASS | HAND · flange above the bridge and its bearings, gears below: the last part fitted goes furthest |
| E5 | PASS | AUTO · bearings and circlips stay in their housings and the bridge |
| E6 | PASS | AUTO · motor with its bracket, bearings whole |
| E7 | PASS | AUTO · spacers midway |
| E8 | PASS | AUTO · gear, key and hub keep their order on each shaft |
| E9 | PASS | HAND · readable at full explode at 28° and 70° |
| J1 | N/A | no dead axle |
| J2 | PASS | AUTO · both shafts: housing with two sealed bearings, sleeve, wave washer, circlips, screwed and dowelled; keyed shafts, end retainers; the input's pulley hub and home flag |
| J3 | N/A | no moving pin |
| J4 | N/A | no pin in a slot |
| J5 | N/A | no slide |
| J6 | PASS | AUTO / HAND · hubs with key and set screw; eccentric for backlash under the output housing and, here, in the bridge too; timing marks at the mesh; thrust washers and retaining rings on both shafts |
| J7 | N/A | no cam |
| J8 | PASS | AUTO · flanged motor pulley, mount slotted for tension |
| F1 | PASS | AUTO · housings dowelled, bridge spigoted |
| F2 | PASS | AUTO / HAND · housing bearings on circlips; bridge bearings flanged with a circlip below; circlips over the hubs; end retainers, flange end screw |
| F3 | PASS | AUTO · feather keys and hub set screws on both gears; keyed output flange |
| F4 | PASS | AUTO · bronze thrust washers under both gears, wave washers preloading the housing pairs |
| F5 | N/A | both shafts turn fully, nothing to over-travel |
| F6 | N/A | driven through the mesh; no rest position to hold |
| F7 | PASS | AUTO / HAND · eccentric bushings at both ends of the output shaft set the backlash; belt tension at the motor mount |
| F8 | PASS | AUTO · open gears greased at assembly; sealed and shielded bearings |
| F9 | PASS | AUTO · match marks on the two teeth that meet at the line of centres |
| F10 | PASS | AUTO / HAND · pulley flanges, home flag and fork sensor; no slip clutch (none planned): nothing in a single mesh can jam |
| M1 | PASS | AUTO · edge breaks on every top face |
| M2 | PASS | HAND · hub and six spokes on the 28-tooth gear; the pinion solid |
| M3 | PASS | AUTO · bore entry chamfers on every seat and through hole |
| M4 | PASS | AUTO / HAND · counterbored housing screws and base corners, countersink for the flange end screw |
| M5 | PASS | AUTO / HAND · spoke windows filleted R3 |
| M6 | PASS | AUTO · edge distance and walls clean |
| M7 | PASS | HAND · the bridge is a hull of circles, no inside corner; spoke roots filleted |
| M8 | PASS | AUTO · thread undercuts on the shaft ends |
| M9 | PASS | AUTO / HAND · housing screws M3 6 mm into the base; post screws 1.5 d; standard lengths |
| M10 | PASS | AUTO / HAND · steel gears with induction-hardened teeth, aluminium bridge, bronze eccentrics |
| M11 | PASS | AUTO · centre holes and chamfered ends on the shafts |
| M12 | PASS | HAND · every head reachable; bearings pressed out past their circlips |
| M13 | PASS | AUTO / HAND · threadlocker on every screw, set screws low strength |
| M14 | N/A | no sliding wear surface besides the teeth, which are hardened |
| V1 | PASS | AUTO · pancake outrunner Ø50 x 18 under the base, GT2 32:16 |
| V2 | PASS | AUTO · one-piece bracket, flange screws up into the base |
| V3 | PASS | AUTO / HAND · belt and pulleys clear of feet, housings and the post screws under the base; clearance 0 |
| V4 | PASS | AUTO · flanges, set screws, slotted mount |
| V5 | PASS | AUTO · rotary: belt to the input pulley |
| V6 | PASS | AUTO · home flag, fork sensor on the housing, leads laid round the housing to the terminal block, one P-clip |
| L1 | PASS | STYLE · lint-style clean |
| L2 | PASS | HAND · the polish carries geometry, roles, marks and materials only |
| L3 | PASS | HAND · pinion driver, gear and flange output, bridge ground, hardware hw |
| L4 | PASS | HAND / STYLE · accent on the input only |
| L5 | PASS | AUTO / HAND · screws, bearings and the roller are real solids in real holes |
| L6 | PASS | AUTO · depth order right at plan, 28°, side and explode |
| L7 | PASS | STYLE · tilt 0° to 88°, no shear |
| L8 | PASS | AUTO / HAND · match marks and tapped-hole rings are marks |
| R1 | PASS | HAND · the polish reuses H.outputCoupling and H.spokes; the straddle bridge and the top eccentric are the rules'; no inline standard part |
| R2 | PASS | HAND · threads M3, M4, M5, M6; shafts Ø10 and 12; two bearing sizes |
| R3 | PASS | AUTO · housing, bridge and drive from their subassemblies |
| R4 | PASS | AUTO · package built at build time |
| R5 | PASS | HAND · states only what differs; rules 0.07 s, polish under 1 ms |
| R6 | PASS | FLAG · browser bench (one run for all four): plan 50.5, 28° 75.6, side 39.3, explode 27.9 ms at full detail; 8 ms reached at dial D; runs on this machine vary by up to half (look at in #14) |
| R7 | PASS | HAND · model.ts + polish.ts 4.6 KB |
| R8 | PASS | AUTO / SITE · pre-rendered thumbnails; the stage draws on change only |
| DL1 | PASS | AUTO / HAND · every solid and mark on a rung; the polish moves nothing |
| DL2 | PASS | HAND · default dial full |
| DL3 | PASS | AUTO · DL-D drawn when exploded, DL-B skipped at side elevation |
| DL4 | PASS | SITE · adaptive dial and the detail entry in the title block |
| DL5 | PASS | FLAG · rung counts and frame times in the detail ladder below |
| Q1 | PASS | check, clamp and edge distance clean |
| Q2 | PASS | 0 clashes |
| Q3 | PASS | package written; site build and site tests pass |
| Q4 | PASS | plan, 28°, side, explode at 28° and 70°, both sheets; attached to #12 |
| Q5 | PASS | browser bench at DPR 1.5; flags under R6 |
| Q6 | PASS | every row judged |
| Q7 | PASS | conformance: spur-gears at 2.0, pass |

## Joints
| Joint | Type | F1 locate | F2 retain | F3 torque | F4 thrust | F5 limit | F6 hold | F7 adjust | F8 lube | F9 timing | F10 protect |
|---|---|---|---|---|---|---|---|---|---|---|---|
| p1 | J2 | 2 x Dowel pin Ø3 x 10 h6, housing to base | 3 x Internal circlip DIN 472, Ø19; External circlip DIN 471, Ø10; Socket head M5 x 10 (ISO 4762), into the shaft end; Bearing F6800ZZ (10x19x5), floating | Feather key 3 x 3 x 7 (DIN 6885) | Wave washer 14.5x18.8, spring steel; Thrust washer 10.2x16, bronze | – turns fully | – driven through the belt | – backlash set on the output shaft | – sealed and shielded bearings | Match mark on the pinion tooth at the line of centres | – see drive |
| p2 | J2 | 2 x Dowel pin Ø3 x 10 h6, housing to base | 3 x Internal circlip DIN 472, Ø21; External circlip DIN 471, Ø12; Shaft collar 12x22, set screw; Bearing F6801ZZ (12x21x5), floating; Countersunk M6 x 14 (ISO 10642), into the shaft end, flush | Feather key 4 x 4 x 7 (DIN 6885); Feather key 4 x 4 x 6 (DIN 6885) | Wave washer 16.5x20.8, spring steel; Thrust washer 12.2x18, bronze | – turns fully | – driven through the mesh | Eccentric bushing Ø28, 0.3 mm offset bore Ø14, flanged; Eccentric bushing Ø27, 0.3 mm offset bore Ø21, flanged, top of the shaft | – sealed and shielded bearings | Match mark on the gear gap at the line of centres | – none needed |
| mesh-pinion-gear | J6 | – the shafts locate the gears | – circlips over the hubs (p1, p2) | Gear hub Ø22, set screw M3 on the key; 2 x Set screw M3 (DIN 916), threadlocked; Gear hub Ø24, set screw M3 on the key | – thrust washers under the gears (p1, p2) | – continuous rotation | – driven | Eccentric bushing Ø28, 0.3 mm offset bore Ø14, flanged; Eccentric bushing Ø27, 0.3 mm offset bore Ø21, flanged, top of the shaft | Open gears, greased at assembly | Pinion, 14 teeth; Gear, 28 teeth | – none needed |
| drive | drive | – bracket screwed up into the base | – pulley hub set screws (p1) | Pulley hub, 2 x M3 set screws at 90° | – motor bearings | – motor turns freely | – motor holds when powered | bracket | – belt runs dry | Home flag read by the fork sensor | Home flag, 1 mm steel vane; 3 x Fork sensor, slotted optical, 5 mm gap; Pulley flanges |
| p1-p2-bridge-post | post | 2 x spigot | – screwed from both sides | – static | – static | – static | – static | – spigot in a slot takes the hole tolerance | – static | – static | – static |

## Variants and overrides
| Joint or part | Rule result | Chosen | Why |
|---|---|---|---|
| p2 | shaft ends in its bridge bearing | runs on above the bridge to a keyed output flange with 4 x M4 tapped holes (H.outputCoupling) | where the load is coupled |
| gear | solid web | hub and six spokes, windows filleted R3 (H.spokes) | M2 |

## Detail ladder
| Rung | Solids | Marks | Frame ms at this dial position |
|---|---|---|---|
| DL-A | 14 | 0 | 59.4 |
| DL-B | 0 | 169 | 58.1 |
| DL-C | 0 | 0 | 10.4 |
| DL-D | 15 | 0 | 7.3 |
| DL-E | 8 | 2 | 6.2 |
| DL-F | 0 | 0 | 15.6 |
| DL-G | 0 | 0 | 8.0 |
| DL-H | 17 | 0 | 6.1 |
| never | 88 | 164 | 73.2 (full) |

## Promotion candidates
Hand fixes that should become rules or primitives.

- None open. The straddle bridge for live gear shafts with the eccentric at both ends, the output coupling, the
  spoked-wheel helper and a cheaper bridge post search were promoted in standard 2.1.

## Verification
check: clean · clearance: 0 clashes · clamp: clean · edge distance: clean · package: 24.4 KB
screenshots: plan, 28°, side, explode at 28° and 70°, both sheets (attached to #12) · bench: browser, DPR 1.5, 2026-10-18; 28° frame 75.6 ms at full detail, 8 ms reached at dial D (flag, R6)
