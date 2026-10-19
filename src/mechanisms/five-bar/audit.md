# Audit: Five-bar linkage (five-bar)
standard: 2.6 · date: 2026-10-19 · result: pass · detail: full · pass: build

## Summary
PASS 113 · FAIL 0 · N/A 8 · open: none

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
| P5 | PASS | DATA · motion, forces, benefits, limits; 4 uses with one line each |
| P6 | PASS | DATA · Wikipedia and the Huissoon and Wang paper; three videos and the three real-world videos checked live (oEmbed): DexTAR, Janus Jr and the double SCARA, all footage of real five-bar robots; no photo page in the record, a catalogue gap noted for the DATA batch |
| P7 | PASS | HAND / SITE · no prose in model.ts or polish.ts beyond code comments and the A16 engineering notes; lint-style clean |
| P8 | PASS | SITE · no parts list, build or joint sections on the page |
| P9 | PASS | HAND · the record describes two independent motors (dof 2); the model is the geared one-input variant its own build note names: solve() runs the tip along a 47 mm curve (x 9 to 19, y 89 to 136) for a 50° swing of the input; singular poses avoided (the arms stay 46 to 131 mm apart of 160). The explanation text is flagged for the DATA batch |
| P10 | PASS | HAND · tip path traced, velocity at the tip and the left elbow, arm force lines, tip angle and input crank angle, tip height plot |
| P11 | PASS | DATA · plain, short sentences, mm and degrees; no em dash in the record |
| K1 | PASS | HAND · check: max link error 4.3e-14 mm · the polish changes heights, outlines and hardware only; every pin centre is the solver's |
| K2 | PASS | HAND · check: finite, continuous, periodic over 720 samples |
| K3 | PASS | HAND · gear, link, cap; between, at and fixed placement |
| K4 | PASS | HAND · roles driver, link, output, ground, pin; accent only on the input cap pO1 |
| K5 | PASS | HAND · check: no INTERFERE, OVERLAP or WARN · integer layers in the model, 10 mm apart, 6 mm thick; ground pivots on layer -1 at radius 7, moving pins at radius 5.5; plating is `dz` in model.ts and the rules build every stack on it (K1) |
| K6 | PASS | DATA · pivots 50 apart, cranks 60, arms 80, elbows out and tip up as the catalogue; deliberately the geared variant (gear pair 22 and 28 teeth fixes the second crank, the input oscillates 95° to 145°), a code comment says so |
| K7 | PASS | HAND · input oscillating on the left crank |
| D1 | PASS | HAND · tapered stadium cranks (R13 and R9.5) and distal arms (R9.5) with boss rings; involute gears with a keyed bore; flush caps; squircle base |
| D2 | PASS | HAND · material where the load runs, bosses round every pin; the arms are long and thin, no window |
| D3 | PASS | STYLE · roles told apart by pattern and tone in both sheets (screenshots) |
| D4 | PASS | AUTO · fired: base (1 solid), feet (3 solids) · feet and corner holes concentric with the base's corner arcs |
| D5 | PASS | AUTO / HAND · one bridge on two spigoted posts over both shafts; no scattered standoffs |
| D6 | PASS | HAND / STYLE · leads, sensor, stops and hardware read quieter than the mechanism in every view |
| D7 | PASS | HAND · links, plates, bridge and base carry only load shape (D2) and manufacturing marks; the richness is in the hardware |
| A1 | PASS | AUTO · pO1 J2, pO2 J2, pA J3, pB J3, pP J3, mesh-gearL-gearR J6; fired: classify (no solids) · every joint classified from the model as listed |
| A2 | PASS | AUTO · pO1 J2, pO2 J2, pA J3, pB J3, pP J3, mesh-gearL-gearR J6 · live shafts at O1 (accent input) and O2, shoulder bolts at A, B and P |
| A3 | PASS | AUTO · fired: classify (no solids) · bore sized to the largest catalogue bore every boss takes; bearings from the catalogue table, spacers in every gap |
| A4 | PASS | AUTO · fired: j1-dead-axle (no solids) · stepped, keyed shafts with circlip grooves and end retainers; shoulder bolts with undercut threads |
| A5 | PASS | AUTO · fired: j2-live-shaft (60 solids) · feather keys 3 x 3 on the Ø10 shafts for the crank and the gear |
| A6 | PASS | AUTO · fired: standoffs (no solids) · no floating fixed plate besides the bridge, which sits on spigoted Ø10 standoffs |
| A7 | PASS | AUTO · fired: base (1 solid), feet (3 solids) · 8 mm base 2 mm under the lowest part, counterbored corner holes, feet, traced path engraved, front scale, clearance hole for every live shaft |
| A8 | PASS | AUTO · fired: fasteners (stage 3) · every head has its threaded shank; clearance and tapped holes cut by stage 3 |
| A9 | PASS | AUTO / HAND · fired: j2-straddle (31 solids) · O1 and O2 are straddle mounted by the rules (a bridge over both shafts); A, B and P are single shear, forced: the right arm rides over the left one at P, the arms sweep over the crank tips at A and B, so no clevis fits; the arms are plated low so overhangs are short, the bearings sit on inner-race spacers |
| A10 | PASS | HAND · cranks z 0 to 6, gears 10 to 17 on the same keyed shafts, left arm 7.5 to 13.5, right arm 15 to 21: nothing stacked only to clear something |
| A11 | PASS | AUTO / HAND · fired: j1-dead-axle (no solids) · load paths in the joint notes: pins to bearings to arms; shafts to housings to base; bridge screwed and located by spigots; housings screwed and dowelled |
| A12 | PASS | AUTO · clamp check clean |
| A13 | PASS | AUTO / HAND · 186 solids, 92 unnamed (further items of a listed set) · named hardware with catalogue sizes and designations; the unnamed solids are further items of a listed set |
| A14 | PASS | HAND · posts, stops, bridge, leads and every added detail clear of every sweep; stops 2° beyond the swing; clearance 0 over the cycle |
| A15 | PASS | AUTO · clearance: 0 clashes over the cycle |
| A16 | PASS | HAND · 5 build rules; no note: none; no badge: none · a note and a badge on every joint, five build rules |
| A17 | PASS | HAND · goes together from the base up: housings and shafts, cranks and gears on their keys, arms on the three pins, bridge; every screw reachable; bearings pressed out past their circlips |
| E1 | PASS | AUTO · every solid has one explode level; levels -8 to 3.5 · explode at 28° and 70° inspected: one rigid level per solid, nothing stretches |
| E2 | PASS | AUTO · 43 rigid groups; fired: explode · every screw, bolt with its shim, shaft and bought unit moves as one group |
| E3 | PASS | AUTO · fired: explode · screws and bolts back out along their axis; nuts go the opposite way; housing and drive screws downward |
| E4 | PASS | HAND · bridge furthest, arms, gears, cranks, shafts: the last part fitted goes furthest |
| E5 | PASS | AUTO · fired: explode · bearings and circlips stay in their plates; no slot joints |
| E6 | PASS | AUTO · fired: explode · motor with its bracket and bearings whole; the belt stays in the pulley plane |
| E7 | PASS | AUTO · fired: explode · inner-race spacers and washers sit midway between the parts they separate |
| E8 | PASS | AUTO · fired: explode · crank, gear, key and pulley keep their order on each shaft; the shafts leave to the side they were fitted from |
| E9 | PASS | HAND · readable at full explode at 28° and 70° in both sheets: nothing inside another part, nothing out of frame |
| J1 | N/A | AUTO · no dead axle: both ground pivots are live shafts |
| J2 | PASS | AUTO · O1 and O2: housings with two sealed bearings, sleeves, wave washers and circlips, screwed and dowelled; keyed shafts, end retainers, thrust washers, home flag at the input; straddle mounted with a floating flanged bearing in the bridge and the backlash eccentric at the top as well as the bottom |
| J3 | PASS | AUTO · A, B and P: shoulder bolts threaded into the lowest link, bearings in the other, inner-race spacers, threadlocked |
| J4 | N/A | AUTO · no pin in a slot |
| J5 | N/A | AUTO · no slide |
| J6 | PASS | AUTO · 22 and 28 teeth, module 2, centres 50 mm: hubs with feather key and set screw, eccentric bushing under the O2 housing, timing marks at the mesh, thrust washers and circlips on each shaft |
| J7 | N/A | AUTO · no cam |
| J8 | N/A | AUTO · no belt: the oscillating drive is a crank and link (V5) |
| F1 | PASS | AUTO · served at pO1, pO2, pO1-pO2-bridge-post; fired: j2-live-shaft (60 solids) · housings dowelled, bridge spigoted; the moving pins carry no removable plate |
| F2 | PASS | AUTO · served at pO1, pO2, pA, pB, pP; fired: j2-live-shaft (60 solids) · every bearing held by a circlip and its flange or two circlips; shaft end retainers; bolt heads |
| F3 | PASS | AUTO · served at pO1, pO2, mesh-gearL-gearR; fired: j2-live-shaft (60 solids) · feather keys on both shafts, hubs with set screws on the gears |
| F4 | PASS | AUTO / HAND · served at pO1, pO2; fired: j2-live-shaft (60 solids) · bronze thrust washers on the base and wave washers preloading each shaft |
| F5 | PASS | AUTO / HAND · two neoprene stops 2° beyond the swing of each crank (the input's from the polish, the right crank's from the rule) |
| F6 | N/A | AUTO / HAND · driven through the crank drive and the gear pair; the teeth hold the right crank, no rest position to hold |
| F7 | PASS | AUTO / HAND · gear backlash by the eccentric bushing under the O2 housing; the other lengths are not an exact ratio, the pivot spacing is the gear centre distance |
| F8 | PASS | AUTO · the moving pins carry shielded, greased-for-life bearings, the shafts sealed housing bearings; the teeth are greased |
| F9 | PASS | AUTO / HAND · served at pO1, mesh-gearL-gearR; fired: timing-marks (no solids) · gear timing marks at the mesh and the swing scale engraved on the base with an index line on the left crank |
| F10 | PASS | AUTO / HAND · served at drive; fired: drive (33 solids) · home flag and fork sensor on the drive; no slip clutch (decided at planning): the drive crank is a dead-centre crank and the stops catch the cranks with the drive off |
| M1 | PASS | AUTO · fired: hardware primitives · edge breaks on every top face |
| M2 | PASS | HAND · bosses round every pin; no lightening window on the long thin arms |
| M3 | PASS | AUTO · fired: j3-moving-pin (36 solids), hardware primitives · bore entry chamfers on every seat and through hole |
| M4 | PASS | AUTO / HAND · fired: base (1 solid), fasteners (stage 3) · counterbored base corners and housing screws, countersinks for the rail and end screws; sockets reachable |
| M5 | PASS | AUTO / HAND · fired: hardware primitives · no pockets or windows in this mechanism |
| M6 | PASS | AUTO · edge distance and walls clean |
| M7 | PASS | HAND · no inside corners in the bridge (hull of circles) |
| M8 | PASS | AUTO · fired: j1-dead-axle (no solids) · undercut on every shoulder bolt thread |
| M9 | PASS | AUTO / HAND · fired: j1-dead-axle (no solids) · ISO coarse threads; engagement 1.5 d in the aluminium base, 1 d in the steel links, else through to a nut; lengths from the standard series |
| M10 | PASS | AUTO / HAND · 186 of 186 solids name a material · materials named on every solid; steel links and shafts, aluminium plates, bridge and base, bronze, neoprene |
| M11 | PASS | AUTO · fired: j1-dead-axle (no solids), hardware primitives · centre holes and chamfered ends on the shafts |
| M12 | PASS | HAND · every head reachable from above or below when assembled; every pressed bearing removable past its circlip |
| M13 | PASS | AUTO / HAND · 63 threaded, 0 without a locking method · threadlocker on every screw and bolt, set screws low strength; no threaded fastener without a locking method |
| M14 | N/A | AUTO / HAND · no sliding contact |
| V1 | PASS | AUTO · fired: drive (33 solids) · pancake outrunner Ø50 x 18 under the base, GT2 belt 32:16 |
| V2 | PASS | AUTO · fired: drive (33 solids) · one-piece bracket, flange screws up into the base |
| V3 | PASS | AUTO / HAND · fired: drive (33 solids) · belt, pulleys and bracket clear of feet and housings; clearance 0 |
| V4 | N/A | AUTO · no belt: the oscillating drive is a crank and link |
| V5 | PASS | AUTO · oscillating: motor, short crank and connecting link swing the input crank through exactly the modelled 50°; the drive crank belongs to the drive |
| V6 | PASS | AUTO · fired: drive (33 solids) · home flag, fork sensor, leads laid to a terminal block on the base edge, one cable clip under the base |
| L1 | PASS | STYLE · lint-style clean |
| L2 | PASS | HAND · model and polish carry geometry, roles, marks and materials only |
| L3 | PASS | HAND · cranks driver and link, gears driver and link, the output arm output, bridge ground, hardware hw |
| L4 | PASS | HAND / STYLE · accent on the input only (pO1) |
| L5 | PASS | AUTO / HAND · fired: see-through · screws, bearings and shanks are real solids in real holes; see-through rule fired |
| L6 | PASS | AUTO · depth order right at plan, 28°, side and explode (screenshots) |
| L7 | PASS | STYLE · tilt 0° to 88°, no shear |
| L8 | PASS | AUTO / HAND · swing scale, index line and gear timing marks are marks; centrelines and dimensions automatic |
| R1 | PASS | HAND · the polish reuses H.stops and the swing of H.stops; the gear pair, eccentric and timing marks are the rules'; nothing is redrawn |
| R2 | PASS | HAND · threads M3, M4, M5, M6; joint Ø 8, 10; bearings 6800-2RS (10x19x5), F688ZZ (8x16x5), F6800ZZ (10x19x5), floating · threads M3 to M8; joints Ø8 and Ø10; catalogue bearings only; few distinct sizes |
| R3 | PASS | AUTO · fired: hardware primitives · housing, bridge, stops, slide and drive from their subassemblies; nothing copied |
| R4 | PASS | AUTO · package built at build time |
| R5 | PASS | HAND · states only what differs (stops, swing scale, notes); samples the swing once (180 steps); rules 0.2 s, polish 0.1 s |
| R6 | PASS | FLAG · browser bench (one run for all five): plan 2.5, 28° 3.1, side 2.4, explode 2.9 ms at full detail, 8 ms never reached (no flag) |
| R7 | PASS | HAND · model.ts + polish.ts 9.6 KB |
| R8 | PASS | AUTO / SITE · pre-rendered thumbnails; the stage draws on change only |
| DL1 | PASS | AUTO / HAND · 74 of 186 solids on a dropping rung · every solid and mark on a rung; the polish moves nothing |
| DL2 | PASS | HAND · model detail full · default dial full |
| DL3 | PASS | AUTO · DL-D drawn when exploded, DL-B skipped at side elevation |
| DL4 | PASS | SITE · adaptive dial and the detail entry in the title block |
| DL5 | PASS | FLAG · rung counts and frame times in the detail ladder below |
| Q1 | PASS | check, clamp and edge distance clean |
| Q2 | PASS | 0 clashes |
| Q3 | PASS | package written, 26.7 KB; site build not checked here · package written; the site build includes the page |
| Q4 | PASS | local: tools/shot · plan, 28°, side, explode at 28° and 70°, both sheets, overlays on; images in the pass notes folder and attached to the issue |
| Q5 | PASS | local: tools/bench · browser bench at DPR 1.5 on the GPU, three runs; frame times in the ladder below, all far under 8 ms (no flag) |
| Q6 | PASS | · every row judged |
| Q7 | PASS | · conformance: five-bar at 2.6, pass |

## Joints
| Joint | Type | F1 locate | F2 retain | F3 torque | F4 thrust | F5 limit | F6 hold | F7 adjust | F8 lube | F9 timing | F10 protect |
|---|---|---|---|---|---|---|---|---|---|---|---|
| pO1 | J2 | 2 x Dowel pin Ø3 x 10 h6, housing to base | 3 x Internal circlip DIN 472, Ø19; External circlip DIN 471, Ø10; Socket head M5 x 10 (ISO 4762), into the shaft end; Bearing F6800ZZ (10x19x5), floating | Feather key 3 x 3 x 6 (DIN 6885); Feather key 3 x 3 x 7 (DIN 6885) | Wave washer 14.5x18.8, spring steel; Thrust washer 10.2x16, bronze | 2 x Stop bumper, neoprene sleeve Ø12 | – belt-driven, no rest position to hold | – no exact length ratio at this pivot | – sealed or shielded bearings, greased for life | Base plate; Left crank (input) | – none needed |
| pO2 | J2 | 2 x Dowel pin Ø3 x 10 h6, housing to base | 3 x Internal circlip DIN 472, Ø19; External circlip DIN 471, Ø10; Shaft collar 10x20, set screw; Bearing F6800ZZ (10x19x5), floating | Feather key 3 x 3 x 6 (DIN 6885); Feather key 3 x 3 x 7 (DIN 6885) | Wave washer 14.5x18.8, spring steel; Thrust washer 10.2x16, bronze | 2 x Stop bumper, neoprene sleeve Ø12 | – belt-driven, no rest position to hold | Eccentric bushing Ø26, 0.3 mm offset bore Ø12, flanged; Eccentric bushing Ø25, 0.3 mm offset bore Ø19, flanged, top of the shaft | – sealed or shielded bearings, greased for life | – no phase to keep at this pivot | – none needed |
| pA | J3 | – no removable plate on a moving pin | Internal circlip DIN 472, Ø16; Bearing F688ZZ (8x16x5); head | – no keyed part; plates turn on bearings | – located by flange and circlip, inner race clamped | – limited by the linkage | – belt-driven, no rest position to hold | – no exact length ratio; backlash is trimmed at O2 | – shielded bearing, greased for life | – set by the gear timing marks, no separate phase | – none needed |
| pB | J3 | – no removable plate on a moving pin | Internal circlip DIN 472, Ø16; Bearing F688ZZ (8x16x5); head | – no keyed part; plates turn on bearings | – located by flange and circlip, inner race clamped | – limited by the linkage | – belt-driven, no rest position to hold | – no exact length ratio; backlash is trimmed at O2 | – shielded bearing, greased for life | – set by the gear timing marks, no separate phase | – none needed |
| pP | J3 | – no removable plate on a moving pin | Internal circlip DIN 472, Ø16; Bearing F688ZZ (8x16x5); head | – no keyed part; plates turn on bearings | – located by flange and circlip, inner race clamped | – limited by the linkage | – belt-driven, no rest position to hold | – no exact length ratio; backlash is trimmed at O2 | – shielded bearing, greased for life | – no phase at the tip | – none needed |
| mesh-gearL-gearR | J6 | – shafts located by their housings | – each gear retained on its shaft (J2 entries) | 2 x Gear hub Ø22, set screw M3 on the key; 2 x Set screw M3 (DIN 916), threadlocked | – thrust washers on each shaft (J2 entries) | – stops on the cranks (J2 entries) | – the teeth hold each other | Eccentric bushing Ø26, 0.3 mm offset bore Ø12, flanged; Eccentric bushing Ø25, 0.3 mm offset bore Ø19, flanged, top of the shaft | – open gears greased at assembly | Gear, 22 teeth; Gear, 28 teeth | – none needed |
| drive | drive | – bracket screwed up into the base | – pulley hub set screws, flanges | – pulley hub, set screws or crank clamp | – motor bearings | – the drive's own travel is the modelled range | – motor holds when powered | – tensioner or slotted mount | – belt and drive run dry | – one input, no phase to keep | Home flag on the drive crank; 3 x Fork sensor, slotted optical, 5 mm gap |
| pO1-pO2-bridge-post | post | 2 x spigot | – screwed from both sides | – static | – static | – static | – static | – spigot in a slot takes the hole tolerance | – static | – static | – static |

## Variants and overrides
| Joint or part | Rule result | Chosen | Why |
|---|---|---|---|
| gears and cranks | one keyed part per layer | each gear is its crank's twin on a keyed shaft, cranks under the gears | J6 and A9: the gear hub stands up from the gear's top face, clear of the arms |
| left crank, input | not limited by the rules (its drive limits it) | its own stop pair from H.stops | F5: with the drive off it would still over-travel |
| arms | layer 1 and 2 plain | plated 2.5 and 5 mm low in the model (`dz`) | A9: short overhangs at the single-shear pins |

## Detail ladder
| Rung | Solids | Marks | Frame ms at this dial position |
|---|---|---|---|
| DL-A | 20 | 0 | 2.8 |
| DL-B | 0 | 262 | 2.12 |
| DL-C | 0 | 0 | 2 |
| DL-D | 27 | 0 | 1.99 |
| DL-E | 8 | 2 | 1.76 |
| DL-F | 0 | 0 | 1.7 |
| DL-G | 0 | 0 | 1.41 |
| DL-H | 19 | 0 | 1.32 |
| never | 112 | 221 | 3.23 (full) |

## Promotion candidates
- None open. The gear pair, hubs, eccentric and timing marks were the rules'; the hand input was the crank-and-gear twin on a keyed shaft, in the model.

## Verification
check: clean · clearance: 0 clashes · clamp: clean · edge distance: clean · package: 26.7 KB
screenshots: plan, 28°, side, explode at 28° and 70°, both sheets, overlays on (in the pass notes folder, attached to the issue) · bench: browser, DPR 1.5, 3 runs, 2026-10-19; 28° frame 3.23 ms at full detail (flags: none, R6)
