# Audit: Four-bar linkage (four-bar)
standard: 2.0 · date: 2026-10-17 · result: pass · detail: full · pass: audit+fix

## Summary
PASS 115 · FAIL 0 · N/A 6 · open: none

## Requirements
| Id | Status | Evidence / action |
|---|---|---|
| S1 | PASS | DATA · the standard carries version 2.0 and its changelog |
| S2 | PASS | HAND · header with standard, date, result, detail, pass |
| S3 | PASS | AUTO · tools/conformance reads this header and runs in npm run check |
| S4 | PASS | SITE · #10 holds only this mechanism's decisions and open items |
| P1 | PASS | DATA · record complete; model.ts, polish.ts, audit.md present |
| P2 | PASS | DATA · catalogue validator clean |
| P3 | PASS | DATA / SITE · page shows ratio, axes, output character, backdrivable, other names, family, motion, level, dof and "Motorised: brushless pancake motor, GT2 belt 32:16" |
| P4 | PASS | DATA · tags grouped Function, Property, Application, keywords underneath |
| P5 | PASS | DATA · motion, forces, benefits, limits; four uses with one line each |
| P6 | PASS | DATA · Wikipedia plus KMODDL and the Illinois dynamics reference; two videos, a Commons photo page |
| P7 | PASS | HAND / SITE · no prose in model.ts or polish.ts; lint-style clean |
| P8 | PASS | SITE · no parts list, build or joint sections on the page |
| P9 | PASS | HAND · solve() gives a 73.8° swing (54.9° to 128.7°), time ratio 1.36, transmission angle 26° to 86°, as the catalogue says |
| P10 | PASS | HAND · coupler point C traced, velocity at C and B, coupler force line, transmission and crank angles, rocker angle plot |
| P11 | PASS | DATA · plain, short sentences, no em dashes, mm and degrees |
| K1 | PASS | HAND · check: max link error 4.3e-14 mm; the polish changes heights and outlines only |
| K2 | PASS | HAND · check: finite, continuous, periodic over 720 samples |
| K3 | PASS | HAND · link, plate, cap, tracer; between and fixed placement |
| K4 | PASS | HAND · roles driver, output, link, pin, trace; accent only on the input cap pO2 |
| K5 | PASS | HAND · check clean, integer layers in the model; the coupler's 2.5 mm plating offset is declared as PLATING in model.ts and applied by the polish (K1) |
| K6 | PASS | DATA · a 40, b 120, c 80, d 100, C at 0.45 b and 43 off, as the catalogue; Grashof s + l = 160 <= p + q = 180, crank shortest |
| K7 | PASS | HAND · input rotary on the crank |
| D1 | PASS | HAND · tapered stadium links sized to their bearings (crank bosses R13 and R9.5, rocker R12 and R9.5) with boss rings; flush caps; squircle base |
| D2 | PASS | HAND · bosses round every pin; one lightening window, in the coupler (the big, oscillating plate) |
| D3 | PASS | STYLE · roles told apart by pattern and tone in both sheets |
| D4 | PASS | AUTO · feet concentric with the corner arcs |
| D5 | PASS | AUTO / HAND · one bridge on two spigoted posts over O4, no scattered standoffs |
| D6 | PASS | HAND / STYLE · leads, sensor and stops read quieter than the linkage in every view |
| D7 | PASS | HAND · links, coupler, bridge and base carry only load shape and manufacturing marks |
| A1 | PASS | AUTO · pO2 J2, pO4 J1, pA J3, pB J3 |
| A2 | PASS | AUTO · live shaft at the accent input, dead axle at O4, shoulder bolts at A and B |
| A3 | PASS | AUTO · 6800-2RS on the Ø10 input, F688ZZ on the Ø8 pins, F696 on the Ø6 axle; spacers in every gap |
| A4 | PASS | AUTO · stepped shoulder bolts with undercut threads; keyed input shaft with end retainer |
| A5 | PASS | AUTO · feather key 3 x 3 on the Ø10 input shaft |
| A6 | PASS | AUTO · no floating fixed plate besides the bridge, which sits on spigoted Ø10 standoffs |
| A7 | PASS | AUTO · 8 mm base 2 mm under the crank, counterbored corner holes, feet, coupler path engraved, front scale, clearance hole for the input shaft |
| A8 | PASS | AUTO · every head has its shank; clearance and tapped holes cut by stage 3 |
| A9 | PASS | HAND · B a clevis and O4 held by base and bridge: double shear. A single shear (the coupler sweeps over the input boss), overhang 1.5 mm; the input shaft carries it on two bearings with centres 15 mm apart |
| A10 | PASS | HAND · crank and rear rocker share z 0 to 6, coupler 7.5 to 13.5, front rocker plate 15 to 21 |
| A11 | PASS | HAND · load paths in the joint notes: pins to bearings to links; axle to base and bridge; bridge screwed and located by spigots; housing screwed and dowelled |
| A12 | PASS | AUTO · clamp check clean |
| A13 | PASS | AUTO / HAND · every solid named with catalogue sizes (ISO 7379 shoulder lengths, bearing designations); sets counted |
| A14 | PASS | HAND · posts, stops and leads clear every sweep; stops 2° beyond the swing; clearance 0 |
| A15 | PASS | AUTO · clearance: 0 clashes over the cycle |
| A16 | PASS | HAND · a note and a badge on every joint, five build rules |
| A17 | PASS | HAND · goes together from the base up: housing and shaft, crank, rear rocker on the axle, coupler on both pins, front plate, B bolt, bridge, axle; every screw reachable; bearings pressed out past their circlips |
| E1 | PASS | AUTO · one level per solid |
| E2 | PASS | AUTO · every screw, shoulder bolt with its shim, shaft and bought unit is one group |
| E3 | PASS | AUTO · bolts and axle leave upward, housing and drive screws downward |
| E4 | PASS | HAND · axle 4, B bolt 3.5, bridge 3, front plate 2, coupler 1, rear plate 0: the last part fitted goes furthest |
| E5 | PASS | AUTO · bearings and circlips stay in their plates |
| E6 | PASS | AUTO · motor with its bracket, bearings whole |
| E7 | PASS | AUTO · spacers midway |
| E8 | PASS | AUTO · crank, key and pulley keep their order on the input shaft |
| E9 | PASS | HAND · readable at full explode at 28° and 70°: nothing inside another part, nothing out of frame |
| J1 | PASS | AUTO · O4: shouldered axle, a bearing per rocker plate, sleeve and spacers, circlips, bronze thrust washer, bridge on spigoted posts, axle threaded 7.5 mm into the base (1.5 d), oil sink over the open bearing |
| J2 | PASS | AUTO · O2: housing with two sealed bearings, sleeve, wave washer and circlips, screwed and dowelled; keyed shaft, pulley hub with two set screws at 90°, end retainer, thrust washer, home flag, base clearance hole |
| J3 | PASS | AUTO · A and B: shoulder bolts threaded into the lowest link, bearings in the coupler, inner-race spacers, threadlocked; clevis at B (variant) |
| J4 | N/A | no pin in a slot |
| J5 | N/A | no slide |
| J6 | N/A | no gear mesh |
| J7 | N/A | no cam |
| J8 | PASS | AUTO · flanged motor pulley, mount slotted for tension; 47 mm centres give enough wrap, no idler |
| F1 | PASS | AUTO · housing dowelled, bridge spigoted; the moving pins carry no removable plate |
| F2 | PASS | AUTO · every bearing held by a circlip and its flange, or two circlips; shaft end retainer; bolt heads |
| F3 | PASS | AUTO · feather key at the input; no other keyed part |
| F4 | PASS | AUTO / HAND · bronze thrust washers on the base under crank and rocker, wave washer preloading the input; no drag needed |
| F5 | PASS | AUTO / HAND · two neoprene stops 2° beyond the rocker's swing, regenerated for the tapered rocker; the input turns fully |
| F6 | N/A | driven through a toothed belt; no rest position or rattling clearance to hold |
| F7 | PASS | AUTO / HAND · belt tension by the slotted mount; a crank-rocker depends on no exact length ratio, so no adjustable link (Appendix A) |
| F8 | PASS | AUTO · oil sink on the bridge over the open front O4 bearing; the others are sealed or shielded |
| F9 | PASS | HAND · swing scale engraved on the base, index line on the rocker: shows it went back together on the modelled branch |
| F10 | PASS | AUTO / HAND · pulley flanges, home flag and fork sensor; no slip clutch (decided at planning): the crank turns fully and nothing in the linkage can jam while it is connected |
| M1 | PASS | AUTO · edge breaks on every top face |
| M2 | PASS | HAND · bosses round every pin; window in the oscillating coupler only |
| M3 | PASS | AUTO · bore entry chamfers on every seat and through hole |
| M4 | PASS | AUTO / HAND · counterbored base corners and housing screws, countersink for the crank end screw |
| M5 | PASS | AUTO / HAND · coupler window cutter radius 5 mm |
| M6 | PASS | AUTO · edge distance and walls clean |
| M7 | PASS | HAND · the bridge is a hull of circles, no inside corner |
| M8 | PASS | AUTO · undercut on every shoulder bolt thread |
| M9 | PASS | AUTO / HAND · M6 into the steel links over their full 6 mm (1 d); axle M5 7.5 mm into the base (1.5 d); lengths from the standard series |
| M10 | PASS | AUTO / HAND · materials named on every solid; steel links, aluminium coupler and bridge |
| M11 | PASS | AUTO · centre holes and chamfered ends on the shafts |
| M12 | PASS | HAND · every head reachable from above or below when assembled; bearings pressed out past their circlips |
| M13 | PASS | AUTO / HAND · threadlocker on every screw and bolt, set screws low strength |
| M14 | N/A | no sliding contact |
| V1 | PASS | AUTO · pancake outrunner Ø50 x 18 under the base, GT2 32:16 |
| V2 | PASS | AUTO · one-piece bracket, flange screws up into the base |
| V3 | PASS | AUTO / HAND · belt and pulleys clear of feet and housing; clearance 0 |
| V4 | PASS | AUTO · flanges, two set screws at 90°, slotted mount |
| V5 | PASS | AUTO · rotary: belt to the input pulley |
| V6 | PASS | AUTO · home flag, fork sensor on the housing, leads laid round the housing and square into the terminal block, one P-clip |
| L1 | PASS | STYLE · lint-style clean |
| L2 | PASS | HAND · the polish carries geometry, roles, marks and materials only |
| L3 | PASS | HAND · front plate output like the rear, bridge ground, hardware hw |
| L4 | PASS | HAND / STYLE · accent on the input only |
| L5 | PASS | AUTO / HAND · screws, bearings and shanks are real solids in real holes |
| L6 | PASS | AUTO · depth order right at plan, 28°, side and explode |
| L7 | PASS | STYLE · tilt 0° to 88°, no shear |
| L8 | PASS | AUTO / HAND · swing scale and index line are marks; centrelines and dimensions automatic |
| R1 | PASS | HAND · the polish reuses H.taper, H.window, H.stops and the J1 and J3 builders; no inline standard part |
| R2 | PASS | HAND · threads M3, M4, M5, M6; joints Ø6, 8, 10; three bearing sizes |
| R3 | PASS | AUTO · housing, bridge, stops and drive from their subassemblies |
| R4 | PASS | AUTO · package built at build time |
| R5 | PASS | HAND · states only what differs; samples the swing once (180 steps); polish 0.6 s, 0.5 s of it the rebuilt bridge search (promotion candidate) |
| R6 | PASS | FLAG · browser bench: frame 8.8 ms plan, 17.0 ms at 28°, 11.6 ms side, 12.4 ms explode; the 8 ms target is met from dial C; setup 1.5 ms |
| R7 | PASS | HAND · model.ts + polish.ts 13.1 KB |
| R8 | PASS | AUTO / SITE · pre-rendered thumbnails; the stage draws on change only |
| DL1 | PASS | AUTO / HAND · every solid and mark on a rung; the polish moves nothing |
| DL2 | PASS | HAND · default dial full |
| DL3 | PASS | AUTO · DL-D drawn when exploded, DL-B skipped at side elevation |
| DL4 | PASS | SITE · adaptive dial and the detail entry in the title block |
| DL5 | PASS | FLAG · rung counts and frame times in the detail ladder below |
| Q1 | PASS | check, clamp and edge distance clean |
| Q2 | PASS | 0 clashes |
| Q3 | PASS | package written; site build and site tests pass |
| Q4 | PASS | plan, 28°, side, explode at 28° and 70°, both sheets; attached to #10 |
| Q5 | PASS | browser bench at DPR 1.5; flags under R6 |
| Q6 | PASS | every row judged |
| Q7 | PASS | conformance: four-bar at 2.0, pass |

## Joints
| Joint | Type | F1 locate | F2 retain | F3 torque | F4 thrust | F5 limit | F6 hold | F7 adjust | F8 lube | F9 timing | F10 protect |
|---|---|---|---|---|---|---|---|---|---|---|---|
| pO2 | J2 | 2 x Dowel pin Ø3 x 10 h6, housing to base | 2 x Internal circlip DIN 472, Ø19; Countersunk M5 x 12 (ISO 10642), into the shaft end, flush; Socket head M5 x 10 (ISO 4762), into the shaft end | Feather key 3 x 3 x 6 (DIN 6885) | Wave washer 14.5x18.8, spring steel; Thrust washer 10.2x16, bronze | – the input turns fully | – driven through the belt, nothing to hold | – belt tension at the motor mount (drive) | – sealed bearings | – one input, no phase to keep | – see drive |
| pO4 | J1 | 2 x spigot | 2 x Internal circlip DIN 472, Ø15; Bearing F696-2RS (6x15x5); Bearing F696 (6x15x5) | – no keyed part; plates turn on bearings | Thrust washer 6.2x9.1, bronze | 2 x Stop bumper, neoprene sleeve Ø12 | – belt-driven, no rest position | – no exact length ratio in a crank-rocker | Bridge over the pivot, on two spigoted posts | Swing scale engraved on the base, index line on the rocker | – protected by the stops (F5) |
| pA | J3 | – no removable plate on a moving pin | Internal circlip DIN 472, Ø16; Bearing F688ZZ (8x16x5); head | – no keyed part | F688ZZ located by flange and circlip, inner race clamped | – limited by the linkage | – belt-driven, no rest position | – no exact length ratio | – shielded bearing, greased for life | – no phase between crank and coupler | – none needed |
| pB | J3 | – no removable plate on a moving pin | Internal circlip DIN 472, Ø16; Bearing F688ZZ (8x16x5); head | – front plate clamped on the shoulder; no keyed part | F688ZZ located by flange and circlip, inner race clamped | – limited by the linkage | – belt-driven, no rest position | – no exact length ratio | – shielded bearing, greased for life | – no phase between coupler and rocker | – none needed |
| drive | drive | – bracket screwed up into the base | – pulley hub set screws (pO2) | Pulley hub, 2 x M3 set screws at 90° | – motor bearings | – motor turns freely | – motor holds when powered | bracket | – belt runs dry | Home flag read by the fork sensor | Home flag, 1 mm steel vane; 3 x Fork sensor, slotted optical, 5 mm gap; Pulley flanges |
| pO4-bridge-post | post | 2 x spigot | – screwed from both sides | – static | – static | – static | – static | – spigot in a slot takes the hole tolerance | – static | – static | – static |

## Variants and overrides
| Joint or part | Rule result | Chosen | Why |
|---|---|---|---|
| coupler | layer 1, z 10 to 16 | plated 2.5 mm low, z 7.5 to 13.5 | A9: 1.5 mm overhang at the single-shear pin A |
| rocker | one plate | clevis: rear plate plus a front plate at z 15 to 21 | A9: B in double shear |
| pB, front plate | a bearing, as a part turning on the bolt | plain Ø8.2 hole on the shoulder, clamped with the bolt | the front plate turns with the bolt in a clevis |
| pA, pB, pO4 stacks | built on the model's plating | rebuilt by the J1 and J3 builders on the new plating | plating and clevis |
| pO4, rear bearing | open, oiled from the bridge | sealed (2RS) | the bridge's oil sink cannot reach it under the front plate |
| crank, rocker | straight stadium from the part family | tapered, bosses R13/R9.5 and R12/R9.5 | D1: sized to the bearings |
| pO4 stops | placed for the straight rocker | placed again for the tapered rocker | A15 |
| bridge | explode level 2 | level 3 | E4: off before the front plate it caps |

## Detail ladder
| Rung | Solids | Marks | Frame ms at this dial position |
|---|---|---|---|
| DL-A | 14 | 0 | 11.9 |
| DL-B | 0 | 200 | 12.2 |
| DL-C | 0 | 0 | 6.5 |
| DL-D | 23 | 0 | 5.4 |
| DL-E | 8 | 2 | 4.7 |
| DL-F | 0 | 0 | 4.6 |
| DL-G | 0 | 0 | 4.3 |
| DL-H | 8 | 0 | 3.1 |
| never | 86 | 169 | 17.9 (full) |

## Promotion candidates
Hand fixes that should become rules or primitives.

- **Plating offsets read by the rules.** The model declares per-part z offsets from the layer grid; the rules build every stack on them. Removes this polish's strip-and-rebuild of A, B and O4, its sweeps override and the traceZ correction.
- **Clevis twin.** A part declared as the clevis partner of another: J3 treats it as turning with the bolt (plain hole on the shoulder), J1 gives each plate its bearing, the stops rule skips it. Needed again by the Geneva drive arm.
- **Tapered links in the part family (D1).** Links sized to their bearings before the rules run, so classify, sweeps, stops and the bridge see the real outline (here the stops had to be placed again).
- **Stops rule, rigid plates.** Two plates of one body on one pivot would get two stop pairs with the same ids; it should give one pair.
- **H.bridge cost.** The post search takes about 0.5 s per bridge; worth a cheaper candidate filter.

## Verification
check: clean · clearance: 0 clashes · clamp: clean · edge distance: clean · package: 24.6 KB
screenshots: plan, 28°, side, explode at 28° and 70°, both sheets (attached to #10) · bench: browser, DPR 1.5, 2026-10-18; 28° frame 17.0 ms over the 8 ms target at full detail (flag, R6)
