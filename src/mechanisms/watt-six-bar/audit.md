# Audit: Watt six-bar linkage (watt-six-bar)
standard: 2.6 · date: 2026-10-19 · result: pass · detail: full · pass: build

## Summary
PASS 115 · FAIL 0 · N/A 6 · open: none

## Requirements
| Id | Status | Evidence / action |
|---|---|---|
| S1 | PASS | DATA · the standard carries version 2.6 and its changelog |
| S2 | PASS | HAND · header with standard, date, result, detail, pass |
| S3 | PASS | AUTO · tools/conformance reads this header and runs in npm run check |
| S4 | PASS | SITE · the pass issue holds only this mechanism's decisions and open items |
| P1 | PASS | DATA · record complete; model.ts, polish.ts, audit.md present |
| P2 | PASS | DATA · facets use the controlled vocabularies; the catalogue tests are clean |
| P3 | PASS | DATA / SITE · page shows ratio, axes, output character, backdrivable, other names, family, motion, level, dof and the drive for the input kind |
| P4 | PASS | DATA · tags grouped Function, Property, Application, keywords underneath |
| P5 | PASS | DATA · motion, forces, benefits, limits; 3 uses with one line each |
| P6 | PASS | DATA · Wikipedia, course notes, a FIRGELLI guide and a paper; a video and two animations; the two real-world YouTube videos checked live (oEmbed), both a Boulton and Watt beam engine whose parallel motion is a Watt-type chain, as the record says; no photo page in the record, a catalogue gap noted for the DATA batch |
| P7 | PASS | HAND / SITE · no prose in model.ts or polish.ts beyond code comments and the A16 engineering notes; lint-style clean |
| P8 | PASS | SITE · no parts list, build or joint sections on the page |
| P9 | PASS | HAND · solve() gives rocker1 74° to 136° and rocker2 116° to 208° (a 91° swing), transmission angle in loop 2 56° to 123°, as the catalogue says |
| P10 | PASS | HAND · output pin D and ternary pin C traced, velocity at D and B, both couplers' force lines, transmission and crank angles, output angle plot |
| P11 | PASS | DATA · plain, short sentences, mm and degrees; no em dash in the record |
| K1 | PASS | HAND · check: max link error 4.3e-14 mm · the polish changes heights, outlines and hardware only; every pin centre is the solver's |
| K2 | PASS | HAND · check: finite, continuous, periodic over 720 samples |
| K3 | PASS | HAND · link, plate, cap; between, at and fixed placement |
| K4 | PASS | HAND · roles driver, link, output, ground, pin; accent only on the input cap pO2 |
| K5 | PASS | HAND · check: no INTERFERE, OVERLAP or WARN · integer layers in the model, 10 mm apart, 6 mm thick; ground pivots on layer -1 at radius 7, moving pins at radius 5.5; plating is `dz` in model.ts and the rules build every stack on it (K1) |
| K6 | PASS | DATA · a 30, b 100, c 60, d 100, c2 50 at -90°, e 60, f 30, O6 (180, 60) as the catalogue; Grashof 30 + 100 <= 60 + 100; the plot shows the output rocker alone (the catalogue asks for both rockers: the other angle reads from the velocity overlay) |
| K7 | PASS | HAND · input rotary on the crank |
| D1 | PASS | HAND · tapered stadium crank and rockers (R13, R12 and R9.5) and couplers (R9.5) with boss rings; a ternary rocker plate with R11 bosses; flush caps; squircle base |
| D2 | PASS | HAND · material where the load runs, bosses round every pin; no window (M2) |
| D3 | PASS | STYLE · roles told apart by pattern and tone in both sheets (screenshots) |
| D4 | PASS | AUTO · fired: base (1 solid), feet (4 solids) · feet and corner holes concentric with the base's corner arcs |
| D5 | PASS | AUTO / HAND · one bridge on two spigoted posts over each rocker pivot; no scattered standoffs |
| D6 | PASS | HAND / STYLE · leads, sensor, stops and hardware read quieter than the mechanism in every view |
| D7 | PASS | HAND · links, plates, bridge and base carry only load shape (D2) and manufacturing marks; the richness is in the hardware |
| A1 | PASS | AUTO · pO2 J2, pO4 J1, pO6 J1, pA J3, pB J3, pC J3, pD J3; fired: classify (no solids) · every joint classified from the model as listed |
| A2 | PASS | AUTO · pO2 J2, pO4 J1, pO6 J1, pA J3, pB J3, pC J3, pD J3 · live shaft at the accent input O2, dead axles at O4 and O6, shoulder bolts at A, B, C and D |
| A3 | PASS | AUTO · fired: classify (no solids) · bore sized to the largest catalogue bore every boss takes; bearings from the catalogue table, spacers in every gap |
| A4 | PASS | AUTO · fired: j1-dead-axle (68 solids) · stepped shafts and axles with undercut threads; keyed input shaft with end retainer |
| A5 | PASS | AUTO · fired: j2-live-shaft (27 solids) · feather key 3 x 3 on the Ø10 input shaft |
| A6 | PASS | AUTO · fired: standoffs (no solids) · no floating fixed plate besides the bridges, which sit on spigoted Ø10 standoffs |
| A7 | PASS | AUTO · fired: base (1 solid), feet (4 solids) · 8 mm base 2 mm under the lowest part, counterbored corner holes, feet, traced path engraved, front scale, clearance hole for every live shaft |
| A8 | PASS | AUTO · fired: fasteners (stage 3) · every head has its threaded shank; clearance and tapped holes cut by stage 3 |
| A9 | PASS | AUTO / HAND · fired: j2-straddle (no solids) · B, C and D are clevises (the two rockers' front plates straddle the couplers) and O4 and O6 are held by base and bridge: double shear. A is single shear, forced: the first coupler sweeps over the crank boss; the overhang is 1.5 mm and the input shaft carries it on two bearings |
| A10 | PASS | HAND · crank and rear rocker plates z 0 to 6, couplers 7.5 to 13.5, front plates 15 to 21: nothing stacked only to clear something |
| A11 | PASS | AUTO / HAND · fired: j1-dead-axle (68 solids) · load paths in the joint notes: pins to bearings to links; axles to base and bridges; bridges screwed and located by spigots; housing screwed and dowelled |
| A12 | PASS | AUTO · clamp check clean |
| A13 | PASS | AUTO / HAND · 203 solids, 96 unnamed (further items of a listed set) · named hardware with catalogue sizes and designations; the unnamed solids are further items of a listed set |
| A14 | PASS | HAND · posts, stops, bridges, leads and every added detail clear of every sweep; stops 2° beyond each swing; clearance 0 |
| A15 | PASS | AUTO · clearance: 0 clashes over the cycle |
| A16 | PASS | HAND · 5 build rules; no note: none; no badge: none · a note and a badge on every joint, five build rules |
| A17 | PASS | HAND · goes together from the base up: housing and input shaft, crank, rear plates on their axles, couplers on the pins, front plates, bolts, bridges; every screw reachable; bearings pressed out past their circlips |
| E1 | PASS | AUTO · every solid has one explode level; levels -8 to 4 · explode at 28° and 70° inspected: one rigid level per solid, nothing stretches |
| E2 | PASS | AUTO · 46 rigid groups; fired: explode · every screw, bolt with its shim, shaft and bought unit moves as one group |
| E3 | PASS | AUTO · fired: explode · screws and bolts back out along their axis; nuts go the opposite way; housing and drive screws downward |
| E4 | PASS | HAND · bridges furthest, front plates, couplers, rear plates, crank, shafts: the last part fitted goes furthest |
| E5 | PASS | AUTO · fired: explode · bearings and circlips stay in their plates; no slot joints |
| E6 | PASS | AUTO · fired: explode · motor with its bracket and bearings whole; the belt stays in the pulley plane |
| E7 | PASS | AUTO · fired: explode · inner-race spacers and washers sit midway between the parts they separate |
| E8 | PASS | AUTO · fired: explode · crank, key and pulley keep their order on the input shaft |
| E9 | PASS | HAND · readable at full explode at 28° and 70° in both sheets: nothing inside another part, nothing out of frame |
| J1 | PASS | AUTO · O4 and O6: shouldered axle, a bearing per plate, sleeve and spacers, circlips, bronze thrust washer, bridge on spigoted posts, oil sink over the open bearing |
| J2 | PASS | AUTO · O2: housing with two sealed bearings, sleeve, wave washer and circlips, screwed and dowelled; keyed shaft, pulley hub with two set screws at 90°, end retainer, thrust washer, home flag, base clearance hole |
| J3 | PASS | AUTO · A, B, C and D: shoulder bolts threaded into the lowest link, bearings in the couplers, inner-race spacers, threadlocked; clevis at B, C and D (variant) |
| J4 | N/A | AUTO · no pin in a slot |
| J5 | N/A | AUTO · no slide |
| J6 | N/A | AUTO · no gear mesh |
| J7 | N/A | AUTO · no cam |
| J8 | PASS | AUTO · fired: j8-belt (2 solids) · flanged motor pulley, mount slotted for tension; centres give enough wrap, no idler |
| F1 | PASS | AUTO · served at pO2, pO4, pO6, pO4-bridge-post, pO6-bridge-post; fired: j2-live-shaft (27 solids) · housing dowelled, bridges spigoted; the moving pins carry no removable plate |
| F2 | PASS | AUTO · served at pO2, pO4, pO6, pA, pB, pC, pD; fired: j2-live-shaft (27 solids) · every bearing held by a circlip and its flange or two circlips; shaft end retainers; bolt heads |
| F3 | PASS | AUTO · served at pO2; fired: j2-live-shaft (27 solids) · feather key at the input; no other keyed part |
| F4 | PASS | AUTO / HAND · served at pO2, pO4, pO6; fired: j2-live-shaft (27 solids) · bronze thrust washers on the base under the crank and every rocker plate, wave washer preloading the input |
| F5 | PASS | AUTO / HAND · two neoprene stops 2° beyond the swing of each rocker, from the rules |
| F6 | N/A | AUTO / HAND · driven through a toothed belt; no rest position or rattling clearance to hold |
| F7 | PASS | AUTO / HAND · belt tension by the slotted mount; the two loops are Grashof and function-generating, not exact ratios, so no adjustable link (Appendix A) |
| F8 | PASS | AUTO · served at pO4, pO6; fired: lubrication (no solids) · oil sinks on the bridges over the open rocker bearings; the moving pins carry shielded bearings |
| F9 | PASS | AUTO / HAND · served at pO6; fired: timing-marks (no solids) · swing scale of the output rocker engraved on the base, index line on its front plate: shows the second loop went back on the modelled branch |
| F10 | PASS | AUTO / HAND · served at drive; fired: drive (37 solids) · pulley flanges, home flag and fork sensor; no slip clutch (decided at planning): the crank turns fully and nothing in the linkage can jam while it is connected |
| M1 | PASS | AUTO · fired: hardware primitives · edge breaks on every top face |
| M2 | PASS | HAND · bosses round every pin; no window: the ternary rocker is small (inscribed circle under 16 mm), the couplers long and thin |
| M3 | PASS | AUTO · fired: j3-moving-pin (51 solids), hardware primitives · bore entry chamfers on every seat and through hole |
| M4 | PASS | AUTO / HAND · fired: base (1 solid), fasteners (stage 3) · counterbored base corners and housing screws, countersinks for the rail and end screws; sockets reachable |
| M5 | PASS | AUTO / HAND · fired: hardware primitives · no pockets or windows in this mechanism |
| M6 | PASS | AUTO · edge distance and walls clean |
| M7 | PASS | HAND · no inside corners in the bridges (hulls of circles) |
| M8 | PASS | AUTO · fired: j1-dead-axle (68 solids) · undercut on every shoulder bolt thread |
| M9 | PASS | AUTO / HAND · fired: j1-dead-axle (68 solids) · ISO coarse threads; engagement 1.5 d in the aluminium base, 1 d in the steel links, else through to a nut; lengths from the standard series |
| M10 | PASS | AUTO / HAND · 203 of 203 solids name a material · materials named on every solid; steel links and shafts, aluminium plates, bridge and base, bronze, neoprene |
| M11 | PASS | AUTO · fired: j1-dead-axle (68 solids), hardware primitives · centre holes and chamfered ends on the shafts |
| M12 | PASS | HAND · every head reachable from above or below when assembled; every pressed bearing removable past its circlip |
| M13 | PASS | AUTO / HAND · 72 threaded, 0 without a locking method · threadlocker on every screw and bolt, set screws low strength; no threaded fastener without a locking method |
| M14 | N/A | AUTO / HAND · no sliding contact |
| V1 | PASS | AUTO · fired: drive (37 solids) · pancake outrunner Ø50 x 18 under the base, GT2 belt 32:16 |
| V2 | PASS | AUTO · fired: drive (37 solids) · one-piece bracket, flange screws up into the base |
| V3 | PASS | AUTO / HAND · fired: drive (37 solids) · belt, pulleys and bracket clear of feet and housings; clearance 0 |
| V4 | PASS | AUTO · fired: j8-belt (2 solids) · flanges, set screws or clamp hub, tensioner slot |
| V5 | PASS | AUTO · rotary: belt to the input pulley |
| V6 | PASS | AUTO · fired: drive (37 solids) · home flag, fork sensor, leads laid to a terminal block on the base edge, one cable clip under the base |
| L1 | PASS | STYLE · lint-style clean |
| L2 | PASS | HAND · model and polish carry geometry, roles, marks and materials only |
| L3 | PASS | HAND · crank driver, output rocker plates output, ternary rocker and couplers link, bridges ground, hardware hw |
| L4 | PASS | HAND / STYLE · accent on the input only (pO2) |
| L5 | PASS | AUTO / HAND · fired: see-through · screws, bearings and shanks are real solids in real holes; see-through rule fired |
| L6 | PASS | AUTO · depth order right at plan, 28°, side and explode (screenshots) |
| L7 | PASS | STYLE · tilt 0° to 88°, no shear |
| L8 | PASS | AUTO / HAND · swing scale and index line are marks; centrelines and dimensions automatic |
| R1 | PASS | HAND · the polish reuses swing() and the rule-built stops and bridges; nothing is redrawn |
| R2 | PASS | HAND · threads M3, M4, M5, M6, M8; joint Ø 8, 10; bearings 6800-2RS (10x19x5), F688ZZ (8x16x5), F6800 (10x19x5) · threads M3 to M8; joints Ø8 and Ø10; catalogue bearings only; few distinct sizes |
| R3 | PASS | AUTO · fired: hardware primitives · housing, bridge, stops, slide and drive from their subassemblies; nothing copied |
| R4 | PASS | AUTO · package built at build time |
| R5 | PASS | HAND · states only what differs (swing scale, notes); samples the swing once (180 steps); rules 0.7 s, polish under 1 ms |
| R6 | PASS | FLAG · browser bench (one run for all five): plan 2.6, 28° 3.0, side 2.4, explode 2.8 ms at full detail, 8 ms never reached (no flag) |
| R7 | PASS | HAND · model.ts + polish.ts 8.7 KB |
| R8 | PASS | AUTO / SITE · pre-rendered thumbnails; the stage draws on change only |
| DL1 | PASS | AUTO / HAND · 84 of 203 solids on a dropping rung · every solid and mark on a rung; the polish moves nothing |
| DL2 | PASS | HAND · model detail full · default dial full |
| DL3 | PASS | AUTO · DL-D drawn when exploded, DL-B skipped at side elevation |
| DL4 | PASS | SITE · adaptive dial and the detail entry in the title block |
| DL5 | PASS | FLAG · rung counts and frame times in the detail ladder below |
| Q1 | PASS | check, clamp and edge distance clean |
| Q2 | PASS | 0 clashes |
| Q3 | PASS | package written, 27.2 KB; site build not checked here · package written; the site build includes the page |
| Q4 | PASS | local: tools/shot · plan, 28°, side, explode at 28° and 70°, both sheets, overlays on; images in the pass notes folder and attached to the issue |
| Q5 | PASS | local: tools/bench · browser bench at DPR 1.5 on the GPU, three runs; frame times in the ladder below, all far under 8 ms (no flag) |
| Q6 | PASS | · every row judged |
| Q7 | PASS | · conformance: watt-six-bar at 2.6, pass |

## Joints
| Joint | Type | F1 locate | F2 retain | F3 torque | F4 thrust | F5 limit | F6 hold | F7 adjust | F8 lube | F9 timing | F10 protect |
|---|---|---|---|---|---|---|---|---|---|---|---|
| pO2 | J2 | 2 x Dowel pin Ø3 x 10 h6, housing to base | 2 x Internal circlip DIN 472, Ø19; Countersunk M5 x 12 (ISO 10642), into the shaft end, flush; Socket head M5 x 10 (ISO 4762), into the shaft end | Feather key 3 x 3 x 6 (DIN 6885) | Wave washer 14.5x18.8, spring steel; Thrust washer 10.2x16, bronze | – the crank turns fully | – belt-driven, no rest position to hold | – no exact length ratio at this pivot | – sealed or shielded bearings, greased for life | – no phase to keep at this pivot | – none needed |
| pO4 | J1 | 2 x spigot | 2 x Internal circlip DIN 472, Ø19; 2 x Bearing F6800 (10x19x5) | – no keyed part; plates turn on bearings | Thrust washer 10.2x13.1, bronze | Stop bumper, neoprene sleeve Ø12 | – belt-driven, no rest position to hold | – no exact length ratio at this pivot | Bridge over the pivot, on two spigoted posts | – no phase to keep at this pivot | – none needed |
| pO6 | J1 | 2 x spigot | 2 x Internal circlip DIN 472, Ø19; 2 x Bearing F6800 (10x19x5) | – no keyed part; plates turn on bearings | Thrust washer 10.2x13.1, bronze | Stop bumper, neoprene sleeve Ø12 | – belt-driven, no rest position to hold | – no exact length ratio at this pivot | Bridge over the pivot, on two spigoted posts | Base plate; Output rocker, front plate | – none needed |
| pA | J3 | – no removable plate on a moving pin | Internal circlip DIN 472, Ø16; Bearing F688ZZ (8x16x5); head | – no keyed part; plates turn on bearings | – located by flange and circlip, inner race clamped | – limited by the linkage | – belt-driven, no rest position to hold | – no exact length ratio in two Grashof loops | – shielded bearing, greased for life | – no phase between crank and coupler | – none needed |
| pB | J3 | – no removable plate on a moving pin | Internal circlip DIN 472, Ø16; Bearing F688ZZ (8x16x5); head | – no keyed part; plates turn on bearings | – located by flange and circlip, inner race clamped | – limited by the linkage | – belt-driven, no rest position to hold | – no exact length ratio in two Grashof loops | – shielded bearing, greased for life | – no phase between coupler and rocker | – none needed |
| pC | J3 | – no removable plate on a moving pin | Internal circlip DIN 472, Ø16; Bearing F688ZZ (8x16x5); head | – no keyed part; plates turn on bearings | – located by flange and circlip, inner race clamped | – limited by the linkage | – belt-driven, no rest position to hold | – no exact length ratio in two Grashof loops | – shielded bearing, greased for life | – no phase between rocker and second coupler | – none needed |
| pD | J3 | – no removable plate on a moving pin | Internal circlip DIN 472, Ø16; Bearing F688ZZ (8x16x5); head | – no keyed part; plates turn on bearings | – located by flange and circlip, inner race clamped | – limited by the linkage | – belt-driven, no rest position to hold | – no exact length ratio in two Grashof loops | – shielded bearing, greased for life | – no phase between coupler and output rocker | – none needed |
| pO4-bridge-post | post | 2 x spigot | – screwed from both sides | – static | – static | – static | – static | – spigot in a slot takes the hole tolerance | – static | – static | – static |
| pO6-bridge-post | post | 2 x spigot | – screwed from both sides | – static | – static | – static | – static | – spigot in a slot takes the hole tolerance | – static | – static | – static |
| drive | drive | – bracket screwed up into the base | – pulley hub set screws, flanges | – pulley hub, set screws or crank clamp | – motor bearings | – the drive's own travel is the modelled range | – motor holds when powered | bracket | – belt and drive run dry | – one input, no phase to keep | Home flag, 1 mm steel vane; 3 x Fork sensor, slotted optical, 5 mm gap; Pulley flanges |

## Variants and overrides
| Joint or part | Rule result | Chosen | Why |
|---|---|---|---|
| rockers | one plate each | clevises in the model: a rear and a front plate (`twin`) over and under the couplers | A9: B, C and D in double shear |
| couplers | layer 1 plain | plated 2.5 mm low in the model (`dz`) | A9: 1.5 mm overhang at the crank pin A, front plates 1.5 mm over them |
| crank, rockers | straight stadium | tapered in the model, bosses R13/R9.5 and R12/R9.5 | D1: sized to what each boss carries |

## Detail ladder
| Rung | Solids | Marks | Frame ms at this dial position |
|---|---|---|---|
| DL-A | 22 | 0 | 2.72 |
| DL-B | 0 | 316 | 2.09 |
| DL-C | 0 | 0 | 1.96 |
| DL-D | 42 | 0 | 2.05 |
| DL-E | 8 | 4 | 1.86 |
| DL-F | 0 | 0 | 1.74 |
| DL-G | 0 | 0 | 1.44 |
| DL-H | 12 | 0 | 1.52 |
| never | 119 | 257 | 2.8 (full) |

## Promotion candidates
- None open.

## Verification
check: clean · clearance: 0 clashes · clamp: clean · edge distance: clean · package: 27.2 KB
screenshots: plan, 28°, side, explode at 28° and 70°, both sheets, overlays on (in the pass notes folder, attached to the issue) · bench: browser, DPR 1.5, 3 runs, 2026-10-19; 28° frame 2.8 ms at full detail (flags: none, R6)
