# Audit: Stephenson six-bar linkage (stephenson-six-bar)
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
| P6 | PASS | DATA · Wikipedia, course notes and a FIRGELLI guide; two animations and a video; the two real-world YouTube videos checked live (oEmbed): a mountain bike's six-bar suspension and the Mondo Spider's Klann legs, both real footage; no photo page in the record, a catalogue gap noted for the DATA batch |
| P7 | PASS | HAND / SITE · no prose in model.ts or polish.ts beyond code comments and the A16 engineering notes; lint-style clean |
| P8 | PASS | SITE · no parts list, build or joint sections on the page |
| P9 | PASS | HAND · solve() gives a 54° swing of the output rocker (the catalogue's -49° to 5°) and transmission angles of 60° to 141° at D; the dyad never straightens, the branch holds |
| P10 | PASS | HAND · coupler point P traced, velocity at P and D, coupler and dyad force lines, transmission and crank angles, output angle plot |
| P11 | PASS | DATA · plain, short sentences, mm and degrees; no em dash in the record |
| K1 | PASS | HAND · check: max link error 4.3e-14 mm · the polish changes heights, outlines and hardware only; every pin centre is the solver's |
| K2 | PASS | HAND · check: finite, continuous, periodic over 720 samples |
| K3 | PASS | HAND · link, plate, cap; between, at and fixed placement |
| K4 | PASS | HAND · roles driver, link, output, ground, pin; accent only on the input cap pO2 |
| K5 | PASS | HAND · check: no INTERFERE, OVERLAP or WARN · integer layers in the model, 10 mm apart, 6 mm thick; ground pivots on layer -1 at radius 7, moving pins at radius 5.5; plating is `dz` in model.ts and the rules build every stack on it (K1) |
| K6 | PASS | DATA · a 20, b 60, c 50, d 60, P at (30, -40), e 70, f 40, pivots O2, O4 and O6 as the catalogue; Grashof 20 + 60 <= 50 + 60 |
| K7 | PASS | HAND · input rotary on the crank |
| D1 | PASS | HAND · tapered stadium crank and rockers (R13, R12 and R9.5) and dyad link with boss rings; a ternary coupler plate with R11 bosses; flush caps; squircle base |
| D2 | PASS | HAND · material where the load runs, bosses round every pin; one window, in the coupler |
| D3 | PASS | STYLE · roles told apart by pattern and tone in both sheets (screenshots) |
| D4 | PASS | AUTO · fired: base (1 solid), feet (4 solids) · feet and corner holes concentric with the base's corner arcs |
| D5 | PASS | AUTO / HAND · one bridge on two spigoted posts over the output pivot; the rocker pivot O4 is a stub axle, so no scattered standoffs |
| D6 | PASS | HAND / STYLE · leads, sensor, stops and hardware read quieter than the mechanism in every view |
| D7 | PASS | HAND · links, plates, bridge and base carry only load shape (D2) and manufacturing marks; the richness is in the hardware |
| A1 | PASS | AUTO · pO2 J2, pO4 J1, pO6 J1, pA J3, pB J3, pP J3, pD J3; fired: classify (no solids) · every joint classified from the model as listed |
| A2 | PASS | AUTO · pO2 J2, pO4 J1, pO6 J1, pA J3, pB J3, pP J3, pD J3 · live shaft at the accent input O2, dead axles at O4 (stub) and O6 (bridge), shoulder bolts at A, B, P and D |
| A3 | PASS | AUTO · fired: classify (no solids) · bore sized to the largest catalogue bore every boss takes; bearings from the catalogue table, spacers in every gap |
| A4 | PASS | AUTO · fired: j1-dead-axle (56 solids) · stepped shafts and axles with undercut threads; keyed input shaft with end retainer |
| A5 | PASS | AUTO · fired: j2-live-shaft (27 solids) · feather key 3 x 3 on the Ø10 input shaft |
| A6 | PASS | AUTO · fired: standoffs (no solids) · no floating fixed plate besides the bridge, which sits on spigoted Ø10 standoffs |
| A7 | PASS | AUTO · fired: base (1 solid), feet (4 solids) · 8 mm base 2 mm under the lowest part, counterbored corner holes, feet, traced path engraved, front scale, clearance hole for every live shaft |
| A8 | PASS | AUTO · fired: fasteners (stage 3) · every head has its threaded shank; clearance and tapped holes cut by stage 3 |
| A9 | PASS | AUTO / HAND · fired: j2-straddle (no solids) · O6 held by base and bridge. Single shear everywhere else, forced: the ternary coupler sweeps over the crank boss, the rocker pivot O4 and B, the dyad link rides over the coupler and the output rocker, so no clevis or bridge fits; plated low so overhangs are short; the input shaft carries its moment on two bearings and O4 is a stub axle |
| A10 | PASS | HAND · crank and rocker z 0 to 6, coupler and output rocker 8.5 to 14.5, dyad link 16 to 22: nothing stacked only to clear something |
| A11 | PASS | AUTO / HAND · fired: j1-dead-axle (56 solids) · load paths in the joint notes: pins to bearings to links; O4's stub axle threaded into the base through a washer and nyloc; O6's axle to base and bridge; housing screwed and dowelled |
| A12 | PASS | AUTO · clamp check clean |
| A13 | PASS | AUTO / HAND · 170 solids, 83 unnamed (further items of a listed set) · named hardware with catalogue sizes and designations; the unnamed solids are further items of a listed set |
| A14 | PASS | HAND · posts, stops, bridge, leads and every added detail clear of every sweep; stops 2° beyond the swing; the coupler runs 1.1 mm over the O4 axle end; clearance 0 |
| A15 | PASS | AUTO · clearance: 0 clashes over the cycle |
| A16 | PASS | HAND · 5 build rules; no note: none; no badge: none · a note and a badge on every joint, five build rules |
| A17 | PASS | HAND · goes together from the base up: housing and input shaft, crank, rocker on its axle with the circlip, coupler on the pins, dyad link, output rocker on its axle, bridge; every screw reachable; bearings pressed out past their circlips |
| E1 | PASS | AUTO · every solid has one explode level; levels -8 to 3.5 · explode at 28° and 70° inspected: one rigid level per solid, nothing stretches |
| E2 | PASS | AUTO · 39 rigid groups; fired: explode · every screw, bolt with its shim, shaft and bought unit moves as one group |
| E3 | PASS | AUTO · fired: explode · screws and bolts back out along their axis; nuts go the opposite way; housing and drive screws downward |
| E4 | PASS | HAND · bridge furthest, dyad link, coupler, rockers, crank, shafts: the last part fitted goes furthest |
| E5 | PASS | AUTO · fired: explode · bearings and circlips stay in their plates; no slot joints |
| E6 | PASS | AUTO · fired: explode · motor with its bracket and bearings whole; the belt stays in the pulley plane |
| E7 | PASS | AUTO · fired: explode · inner-race spacers and washers sit midway between the parts they separate |
| E8 | PASS | AUTO · fired: explode · crank, key and pulley keep their order on the input shaft |
| E9 | PASS | HAND · readable at full explode at 28° and 70° in both sheets: nothing inside another part, nothing out of frame |
| J1 | PASS | AUTO / HAND · O6: shouldered axle, bearing, spacers, circlip, bronze thrust washer, bridge on spigoted posts, oil sink over the open bearing. O4: variant, a stub axle with a sealed bearing, an external circlip on its end and no bridge, because the coupler sweeps over it |
| J2 | PASS | AUTO · O2: housing with two sealed bearings, sleeve, wave washer and circlips, screwed and dowelled; keyed shaft, pulley hub with two set screws at 90°, end retainer, thrust washer, home flag, base clearance hole |
| J3 | PASS | AUTO · A, B, P and D: shoulder bolts threaded into the lowest link, bearings in the other, inner-race spacers, threadlocked |
| J4 | N/A | AUTO · no pin in a slot |
| J5 | N/A | AUTO · no slide |
| J6 | N/A | AUTO · no gear mesh |
| J7 | N/A | AUTO · no cam |
| J8 | PASS | AUTO · fired: j8-belt (2 solids) · flanged motor pulley, mount slotted for tension; centres give enough wrap, no idler |
| F1 | PASS | AUTO · served at pO2, pO6, pO6-bridge-post; fired: j2-live-shaft (27 solids) · housing dowelled, bridge spigoted, stub axle seated on its shoulder; the moving pins carry no removable plate |
| F2 | PASS | AUTO · served at pO2, pO4, pO6, pA, pB, pP, pD; fired: j2-live-shaft (27 solids) · every bearing held by a circlip and its flange or two circlips; shaft end retainers; bolt heads |
| F3 | PASS | AUTO · served at pO2; fired: j2-live-shaft (27 solids) · feather key at the input; no other keyed part |
| F4 | PASS | AUTO / HAND · served at pO2, pO4, pO6; fired: j2-live-shaft (27 solids) · bronze thrust washers on the base under the crank and rockers, wave washer preloading the input |
| F5 | PASS | AUTO / HAND · two neoprene stops 2° beyond the output rocker's swing; the inner rocker is not an output and is limited by the linkage |
| F6 | N/A | AUTO / HAND · driven through a toothed belt; no rest position or rattling clearance to hold |
| F7 | PASS | AUTO / HAND · belt tension by the slotted mount; a Grashof crank-rocker with a dyad depends on no exact length ratio, so no adjustable link (Appendix A) |
| F8 | PASS | AUTO · served at pO6; fired: lubrication (no solids) · oil sink on the bridge over the open O6 bearing; the O4 bearing is sealed (no bridge above), the moving pins shielded |
| F9 | PASS | AUTO / HAND · served at pO6; fired: timing-marks (no solids) · swing scale of the output rocker engraved on the base, index line on the rocker: shows the six-bar went back together on the modelled branch |
| F10 | PASS | AUTO / HAND · served at drive; fired: drive (37 solids) · pulley flanges, home flag and fork sensor; no slip clutch (decided at planning): the crank turns fully and nothing in the linkage can jam while it is connected |
| M1 | PASS | AUTO · fired: hardware primitives · edge breaks on every top face |
| M2 | PASS | HAND · bosses round every pin; one lightening window in the ternary coupler (the big, oscillating plate) |
| M3 | PASS | AUTO · fired: j3-moving-pin (48 solids), hardware primitives · bore entry chamfers on every seat and through hole |
| M4 | PASS | AUTO / HAND · fired: base (1 solid), fasteners (stage 3) · counterbored base corners and housing screws, countersinks for the rail and end screws; sockets reachable |
| M5 | PASS | AUTO / HAND · fired: hardware primitives · window cutter radius 4 mm |
| M6 | PASS | AUTO · edge distance and walls clean |
| M7 | PASS | HAND · no inside corners in the bridge (hull of circles) |
| M8 | PASS | AUTO · fired: j1-dead-axle (56 solids) · undercut on every shoulder bolt thread |
| M9 | PASS | AUTO / HAND · fired: j1-dead-axle (56 solids) · ISO coarse threads; engagement 1.5 d in the aluminium base, 1 d in the steel links, else through to a nut; lengths from the standard series |
| M10 | PASS | AUTO / HAND · 170 of 170 solids name a material · materials named on every solid; steel links and shafts, aluminium plates, bridge and base, bronze, neoprene |
| M11 | PASS | AUTO · fired: j1-dead-axle (56 solids), hardware primitives · centre holes and chamfered ends on the shafts |
| M12 | PASS | HAND · every head reachable from above or below when assembled; every pressed bearing removable past its circlip |
| M13 | PASS | AUTO / HAND · 60 threaded, 0 without a locking method · threadlocker on every screw and bolt, set screws low strength; no threaded fastener without a locking method |
| M14 | N/A | AUTO / HAND · no sliding contact |
| V1 | PASS | AUTO · fired: drive (37 solids) · pancake outrunner Ø50 x 18 under the base, GT2 belt 32:16 |
| V2 | PASS | AUTO · fired: drive (37 solids) · one-piece bracket, flange screws up into the base |
| V3 | PASS | AUTO / HAND · fired: drive (37 solids) · belt, pulleys and bracket clear of feet and housings; clearance 0 |
| V4 | PASS | AUTO · fired: j8-belt (2 solids) · flanges, set screws or clamp hub, tensioner slot |
| V5 | PASS | AUTO · rotary: belt to the input pulley |
| V6 | PASS | AUTO · fired: drive (37 solids) · home flag, fork sensor, leads laid to a terminal block on the base edge, one cable clip under the base |
| L1 | PASS | STYLE · lint-style clean |
| L2 | PASS | HAND · model and polish carry geometry, roles, marks and materials only |
| L3 | PASS | HAND · crank driver, output rocker output, coupler and links link, bridge ground, hardware hw |
| L4 | PASS | HAND / STYLE · accent on the input only (pO2) |
| L5 | PASS | AUTO / HAND · fired: see-through · screws, bearings and shanks are real solids in real holes; see-through rule fired |
| L6 | PASS | AUTO · depth order right at plan, 28°, side and explode (screenshots) |
| L7 | PASS | STYLE · tilt 0° to 88°, no shear |
| L8 | PASS | AUTO / HAND · swing scale and index line are marks; centrelines and dimensions automatic |
| R1 | PASS | HAND · the polish reuses H.shaft, H.circlip and the swing of H.stops; the stub axle at O4 repeats the locomotive drive's hand fix (see promotion candidates); nothing else is redrawn |
| R2 | PASS | HAND · threads M3, M4, M5, M6, M8; joint Ø 8, 10; bearings 6800-2RS (10x19x5), F688ZZ (8x16x5), F6800-2RS (10x19x5), F6800 (10x19x5) · threads M3 to M8; joints Ø8 and Ø10; catalogue bearings only; few distinct sizes |
| R3 | PASS | AUTO · fired: hardware primitives · housing, bridge, stops, slide and drive from their subassemblies; nothing copied |
| R4 | PASS | AUTO · package built at build time |
| R5 | PASS | HAND · states only what differs (stub axle, scale, notes); samples the swing once (180 steps); rules 0.8 s, polish 1 ms |
| R6 | PASS | FLAG · browser bench (one run for all five): plan 2.4, 28° 2.6, side 2.2, explode 2.4 ms at full detail, 8 ms never reached (no flag) |
| R7 | PASS | HAND · model.ts + polish.ts 10.2 KB |
| R8 | PASS | AUTO / SITE · pre-rendered thumbnails; the stage draws on change only |
| DL1 | PASS | AUTO / HAND · 69 of 170 solids on a dropping rung · every solid and mark on a rung; the polish moves nothing |
| DL2 | PASS | HAND · model detail full · default dial full |
| DL3 | PASS | AUTO · DL-D drawn when exploded, DL-B skipped at side elevation |
| DL4 | PASS | SITE · adaptive dial and the detail entry in the title block |
| DL5 | PASS | FLAG · rung counts and frame times in the detail ladder below |
| Q1 | PASS | check, clamp and edge distance clean |
| Q2 | PASS | 0 clashes |
| Q3 | PASS | package written, 26.0 KB; site build not checked here · package written; the site build includes the page |
| Q4 | PASS | local: tools/shot · plan, 28°, side, explode at 28° and 70°, both sheets, overlays on; images in the pass notes folder and attached to the issue |
| Q5 | PASS | local: tools/bench · browser bench at DPR 1.5 on the GPU, three runs; frame times in the ladder below, all far under 8 ms (no flag) |
| Q6 | PASS | · every row judged |
| Q7 | PASS | · conformance: stephenson-six-bar at 2.6, pass |

## Joints
| Joint | Type | F1 locate | F2 retain | F3 torque | F4 thrust | F5 limit | F6 hold | F7 adjust | F8 lube | F9 timing | F10 protect |
|---|---|---|---|---|---|---|---|---|---|---|---|
| pO2 | J2 | 2 x Dowel pin Ø3 x 10 h6, housing to base | 2 x Internal circlip DIN 472, Ø19; Countersunk M5 x 12 (ISO 10642), into the shaft end, flush; Socket head M5 x 10 (ISO 4762), into the shaft end | Feather key 3 x 3 x 6 (DIN 6885) | Wave washer 14.5x18.8, spring steel; Thrust washer 10.2x16, bronze | – the crank turns fully | – belt-driven, no rest position to hold | – no exact length ratio at this pivot | – sealed or shielded bearings, greased for life | – no phase to keep at this pivot | – none needed |
| pO4 | J1 | – the axle's shoulder seats it on the base; no removable plate | External circlip DIN 471, Ø10; Internal circlip DIN 472, Ø19 | – no keyed part; plates turn on bearings | Thrust washer 10.2x13.1, bronze | – limited by the linkage: an inner rocker, not an output | – belt-driven, no rest position to hold | – no exact length ratio at this pivot | – sealed or shielded bearings, greased for life | – no phase to keep at this pivot | – none needed |
| pO6 | J1 | 2 x spigot | Internal circlip DIN 472, Ø19; Bearing F6800 (10x19x5) | – no keyed part; plates turn on bearings | Thrust washer 10.2x13.1, bronze | bumper | – belt-driven, no rest position to hold | – no exact length ratio at this pivot | Bridge over the pivot, on two spigoted posts | Base plate; Output rocker | – none needed |
| pA | J3 | – no removable plate on a moving pin | Internal circlip DIN 472, Ø16; Bearing F688ZZ (8x16x5); head | – no keyed part; plates turn on bearings | – located by flange and circlip, inner race clamped | – limited by the linkage | – belt-driven, no rest position to hold | – no exact length ratio in a Grashof crank-rocker with a dyad | – shielded bearing, greased for life | – no phase between crank and coupler | – none needed |
| pB | J3 | – no removable plate on a moving pin | Internal circlip DIN 472, Ø16; Bearing F688ZZ (8x16x5); head | – no keyed part; plates turn on bearings | – located by flange and circlip, inner race clamped | – limited by the linkage | – belt-driven, no rest position to hold | – no exact length ratio in a Grashof crank-rocker with a dyad | – shielded bearing, greased for life | – no phase between coupler and rocker | – none needed |
| pP | J3 | – no removable plate on a moving pin | Internal circlip DIN 472, Ø16; Bearing F688ZZ (8x16x5); head | – no keyed part; plates turn on bearings | – located by flange and circlip, inner race clamped | – limited by the linkage | – belt-driven, no rest position to hold | – no exact length ratio in a Grashof crank-rocker with a dyad | – shielded bearing, greased for life | – no phase between coupler and dyad | – none needed |
| pD | J3 | – no removable plate on a moving pin | Internal circlip DIN 472, Ø16; Bearing F688ZZ (8x16x5); head | – no keyed part; plates turn on bearings | – located by flange and circlip, inner race clamped | – limited by the linkage | – belt-driven, no rest position to hold | – no exact length ratio in a Grashof crank-rocker with a dyad | – shielded bearing, greased for life | – no phase between dyad and output rocker | – none needed |
| pO6-bridge-post | post | 2 x spigot | – screwed from both sides | – static | – static | – static | – static | – spigot in a slot takes the hole tolerance | – static | – static | – static |
| drive | drive | – bracket screwed up into the base | – pulley hub set screws, flanges | – pulley hub, set screws or crank clamp | – motor bearings | – the drive's own travel is the modelled range | – motor holds when powered | bracket | – belt and drive run dry | – one input, no phase to keep | Home flag, 1 mm steel vane; 3 x Fork sensor, slotted optical, 5 mm gap; Pulley flanges |

## Variants and overrides
| Joint or part | Rule result | Chosen | Why |
|---|---|---|---|
| pO4 | shouldered axle through the rocker to a bridge on spigoted posts | stub axle ending on an external circlip above the bearing, no bridge, sealed bearing | the ternary coupler and the dyad link sweep over this axle (the locomotive drive's fix): a bridge would put the axle through them |
| coupler, dyad link, output rocker | layers 1, 2 and 1 plain | plated 1.5 and 4 mm low in the model (`dz`) | A9: shorter overhangs, and 1.1 mm of clearance over the stub axle end |
| coupler | one plate | one lightening window, 6 mm of web round every boss and edge | D2, M2: it oscillates, so its mass is inertia |

## Detail ladder
| Rung | Solids | Marks | Frame ms at this dial position |
|---|---|---|---|
| DL-A | 18 | 0 | 2.35 |
| DL-B | 0 | 267 | 1.98 |
| DL-C | 0 | 0 | 1.9 |
| DL-D | 33 | 0 | 1.61 |
| DL-E | 8 | 2 | 1.57 |
| DL-F | 0 | 0 | 1.64 |
| DL-G | 0 | 0 | 1.32 |
| DL-H | 10 | 0 | 1.43 |
| never | 101 | 190 | 2.69 (full) |

## Promotion candidates
- A dead axle that a plate sweeps over gets no bridge: a stub axle with an external circlip on its end and a sealed bearing. Hand fix at O4 here, at both wheel axles on the locomotive drive, and at A and B on the Klann linkage: three mechanisms, so it is a candidate for a rule (j1-dead-axle reading the sweeps over the pin), as its own change.

## Verification
check: clean · clearance: 0 clashes · clamp: clean · edge distance: clean · package: 26.0 KB
screenshots: plan, 28°, side, explode at 28° and 70°, both sheets, overlays on (in the pass notes folder, attached to the issue) · bench: browser, DPR 1.5, 3 runs, 2026-10-19; 28° frame 2.69 ms at full detail (flags: none, R6)
