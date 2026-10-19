# Audit: Bell crank (bell-crank)
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
| P5 | PASS | DATA · motion, forces, benefits, limits; 4 uses with one line each |
| P6 | PASS | DATA · two Wikipedia pages, two videos and a photo page; the real-world section is empty; no hard (non-Wikipedia) reference in the record, a catalogue gap noted for the DATA batch |
| P7 | PASS | HAND / SITE · no prose in model.ts or polish.ts beyond code comments and the A16 engineering notes; lint-style clean |
| P8 | PASS | SITE · no parts list, build or joint sections on the page |
| P9 | PASS | HAND · solve() gives 41.0 mm of input travel and 27.4 mm of output for the ±20° swing, arm ratio 1.5, as the record says; small-angle statement matches the 2.4 mm and 3.6 mm of cosine error at the ends |
| P10 | PASS | HAND · pin B traced, velocity at both sliders, rod force lines, lever angle, output position plot |
| P11 | PASS | DATA · plain, short sentences, mm and degrees; no em dash in the record |
| K1 | PASS | HAND · check: max link error 4.3e-14 mm · the polish changes heights, outlines and hardware only; every pin centre is the solver's |
| K2 | PASS | HAND · check: finite, continuous, periodic over 720 samples |
| K3 | PASS | HAND · plate, link, slider, rails, cap; between, at and fixed placement |
| K4 | PASS | HAND · roles driver, output, link, ground, pin; accent only on the input cap pS |
| K5 | PASS | HAND · check: no INTERFERE, OVERLAP or WARN · integer layers in the model, 10 mm apart, 6 mm thick; ground pivots on layer -1 at radius 7, moving pins at radius 5.5; plating is `dz` in model.ts and the rules build every stack on it (K1) |
| K6 | PASS | DATA · arms 60 and 40, 90° apart, rods 120 and 100, ±20° swing, guide on x = 40, as the catalogue; the input rod is carried by a slider on y = -60 |
| K7 | PASS | HAND · input linear on the carriage |
| D1 | PASS | HAND · tapered stadium rods sized to their bearings (bosses R9.5) with boss rings; a plate lever with R12 bosses; flush caps; sliders and twin rails in the slider and rail form; squircle base |
| D2 | PASS | HAND · material where the load runs, bosses round every pin; the lever is small, so no window (M2) |
| D3 | PASS | STYLE · roles told apart by pattern and tone in both sheets (screenshots) |
| D4 | PASS | AUTO · fired: base (1 solid), feet (4 solids) · feet and corner holes concentric with the base's corner arcs |
| D5 | PASS | AUTO / HAND · one bridge on two spigoted posts over O; each guide sits on ground risers, no scattered standoffs |
| D6 | PASS | HAND / STYLE · leads, sensor, stops and hardware read quieter than the mechanism in every view |
| D7 | PASS | HAND · links, plates, bridge and base carry only load shape (D2) and manufacturing marks; the richness is in the hardware |
| A1 | PASS | AUTO · pO J1, pA J3, pB J3, pS J3, pG J3, slide-carriage J5, slide-slide-out J5; fired: classify (no solids) · every joint classified from the model as listed |
| A2 | PASS | AUTO · pO J1, pA J3, pB J3, pS J3, pG J3, slide-carriage J5, slide-slide-out J5 · dead axle at O, shoulder bolts at A, B, S and G; no live shaft (the input is linear) |
| A3 | PASS | AUTO · fired: classify (no solids) · bore sized to the largest catalogue bore every boss takes; bearings from the catalogue table, spacers in every gap |
| A4 | PASS | AUTO · fired: j1-dead-axle (34 solids) · stepped axle and shoulder bolts with undercut threads |
| A5 | N/A | AUTO · no keyed part: the input is a slider, so there is no shaft |
| A6 | PASS | AUTO · fired: standoffs (24 solids) · rails on ground steel risers with countersunk screws, the reference rail of each slide dowelled; the bridge on spigoted Ø10 standoffs |
| A7 | PASS | AUTO · fired: base (1 solid), feet (4 solids) · 8 mm base 2 mm under the lowest part, counterbored corner holes, feet, traced path engraved, front scale, clearance hole for every live shaft |
| A8 | PASS | AUTO · fired: fasteners (stage 3) · every head has its threaded shank; clearance and tapped holes cut by stage 3 |
| A9 | PASS | AUTO / HAND · fired: j2-straddle (no solids) · A and B are clevises: the front lever plate straddles each rod end (double shear). S and G are single shear, forced: the keepers lap both sliders, so no plate can sit above a rod's end; the rods ride 1.5 mm over the keepers and the bearings sit on inner-race spacers. O is held by base and bridge |
| A10 | PASS | HAND · sliders and guide bars share z 5 to 12, the lever's rear plate 7.5 to 13.5, the rods 15 to 21, the lever's front plate 22.5 to 28.5: nothing stacked only to clear something |
| A11 | PASS | AUTO / HAND · fired: j1-dead-axle (34 solids) · load paths in the joint notes: rod, bearing, bolt, lever plates; plates to the axle, bridge and base; slider to rail, riser and base; bridge screwed and located by spigots; housing-free (no live shaft) |
| A12 | PASS | AUTO · clamp check clean |
| A13 | PASS | AUTO / HAND · 189 solids, 90 unnamed (further items of a listed set) · named hardware with catalogue sizes and designations; the unnamed solids are further items of a listed set |
| A14 | PASS | HAND · posts, stops, bridge, leads and every added detail clear of every sweep; clearance 0 over the cycle |
| A15 | PASS | AUTO · clearance: 0 clashes over the cycle |
| A16 | PASS | HAND · 5 build rules; no note: none; no badge: none · a note and a badge on every pin, five build rules |
| A17 | PASS | HAND · goes together from the base up: rails and sliders, lever rear plate on the axle, rods on their pins, front plate, bridge; every screw reachable; bearings pressed out past their circlips |
| E1 | PASS | AUTO · every solid has one explode level; levels -8 to 4 · explode at 28° and 70° inspected: one rigid level per solid, nothing stretches |
| E2 | PASS | AUTO · 41 rigid groups; fired: explode · every screw, bolt with its shim, shaft and bought unit moves as one group |
| E3 | PASS | AUTO · fired: explode · screws and bolts back out along their axis; nuts go the opposite way; housing and drive screws downward |
| E4 | PASS | HAND · axle and bridge furthest, front lever plate, rods, rear plate, then sliders and rails: the last part fitted goes furthest |
| E5 | PASS | AUTO · fired: explode · bearings and circlips stay in their plates; no slot joints |
| E6 | PASS | AUTO · fired: explode · motor with its bracket and bearings whole; the belt stays in the pulley plane |
| E7 | PASS | AUTO · fired: explode · inner-race spacers and washers sit midway between the parts they separate |
| E8 | PASS | AUTO · fired: explode · no keyed parts on a common shaft |
| E9 | PASS | HAND · readable at full explode at 28° and 70° in both sheets: nothing inside another part, nothing out of frame |
| J1 | PASS | AUTO · O: shouldered axle, a bearing in each lever plate, spacers, circlips, bronze thrust washer, bridge on spigoted posts, axle through the base to a washer and nyloc, oil sink over the open bearing |
| J2 | N/A | AUTO · no live shaft: the input is linear |
| J3 | PASS | AUTO · A, B, S and G: shoulder bolts threaded into the lowest plate, bearings in the rods, inner-race spacers, threadlocked; clevis at A and B (variant) |
| J4 | N/A | AUTO · no pin in a slot |
| J5 | PASS | AUTO · two slides, input carriage and output slider: dowelled reference rail, bronze gib clamped under the keeper by the rail's screws, two wipers, a nipple, an end stop block with a pad at each end |
| J6 | N/A | AUTO · no gear mesh |
| J7 | N/A | AUTO · no cam |
| J8 | PASS | AUTO · fired: j8-belt (2 solids) · belt along the carriage's stroke, flanged motor pulley, slotted tensioner arm on the far pulley; no idler needed |
| F1 | PASS | AUTO · served at pO, pO-bridge-post, in-guideb-seat, out-guideb-seat; fired: j2-live-shaft (no solids) · reference rails dowelled, bridge spigoted; the moving pins carry no removable plate |
| F2 | PASS | AUTO · served at pO, pA, pB, pS, pG, slide-carriage, slide-slide-out; fired: j2-live-shaft (no solids) · every bearing held by a circlip and its flange or two circlips; shaft end retainers; bolt heads |
| F3 | PASS | AUTO · served at no joint; fired: j2-live-shaft (no solids) · no keyed part: the input is a slider, so nothing turns on a shaft |
| F4 | PASS | AUTO / HAND · served at pO; fired: j2-live-shaft (no solids) · bronze thrust washers on the base under the lever plates; no drag needed |
| F5 | PASS | AUTO / HAND · end stop blocks at both ends of each slide, two neoprene stops 2° beyond the lever's swing |
| F6 | N/A | AUTO / HAND · a belt-driven carriage and two keeper-held sliders: no rest position to hold, no rattling clearance |
| F7 | PASS | AUTO / HAND · belt tension by the slotted tensioner; both slides adjust by their gib; the rods are long against the arms, so no length needs an exact trim (Appendix A: no exact length ratio) |
| F8 | PASS | AUTO · served at pO, slide-carriage, slide-slide-out; fired: lubrication (no solids) · oil sink on the bridge over the open O bearing; two wipers and a nipple on each slide |
| F9 | PASS | AUTO / HAND · served at pO; fired: timing-marks (no solids) · swing scale engraved on the base, index line on the lever's front plate: shows the rods went back on at the modelled angle |
| F10 | PASS | AUTO / HAND · served at drive; fired: drive (35 solids) · pulley flanges, home flag and fork sensor; no slip clutch (decided at planning): the lever's stops and both end stops limit the travel and nothing in the linkage can jam while the carriage is held by the belt |
| M1 | PASS | AUTO · fired: hardware primitives · edge breaks on every top face |
| M2 | PASS | HAND · bosses round every pin; no lightening window: the lever's inscribed circle leaves no web at R12 bosses |
| M3 | PASS | AUTO · fired: j3-moving-pin (50 solids), hardware primitives · bore entry chamfers on every seat and through hole |
| M4 | PASS | AUTO / HAND · fired: base (1 solid), fasteners (stage 3) · counterbored base corners and housing screws, countersinks for the rail and end screws; sockets reachable |
| M5 | PASS | AUTO / HAND · fired: hardware primitives · gib strips and keepers have full-radius ends; no pockets |
| M6 | PASS | AUTO · edge distance and walls clean |
| M7 | PASS | HAND · no inside corners in the bridge (hull of circles) or the lever (hull of bosses) |
| M8 | PASS | AUTO · fired: j1-dead-axle (34 solids) · undercut on every shoulder bolt thread |
| M9 | PASS | AUTO / HAND · fired: j1-dead-axle (34 solids) · ISO coarse threads; engagement 1.5 d in the aluminium base, 1 d in the steel links, else through to a nut; lengths from the standard series |
| M10 | PASS | AUTO / HAND · 189 of 189 solids name a material · materials named on every solid; steel links and shafts, aluminium plates, bridge and base, bronze, neoprene |
| M11 | PASS | AUTO · fired: j1-dead-axle (34 solids), hardware primitives · centre holes and chamfered ends on the shafts |
| M12 | PASS | HAND · every head reachable from above or below when assembled; every pressed bearing removable past its circlip |
| M13 | PASS | AUTO / HAND · 69 threaded, 0 without a locking method · threadlocker on every screw and bolt, set screws low strength; no threaded fastener without a locking method |
| M14 | PASS | AUTO / HAND · fired: j4-slot-roller (no solids) · bronze gib strip under each keeper and hardened end stop blocks are the replaceable wear parts of the two slides |
| V1 | PASS | AUTO · fired: drive (35 solids) · pancake outrunner Ø50 x 18 under the base, GT2 belt 32:16 |
| V2 | PASS | AUTO · fired: drive (35 solids) · one-piece bracket, flange screws up into the base |
| V3 | PASS | AUTO / HAND · fired: drive (35 solids) · belt, pulleys and bracket clear of feet and housings; clearance 0 |
| V4 | PASS | AUTO · fired: j8-belt (2 solids) · flanges, set screws or clamp hub, tensioner slot |
| V5 | PASS | AUTO · linear: belt loop along the stroke with a carriage clamped to the input slider, tensioner on the far pulley |
| V6 | PASS | AUTO · fired: drive (35 solids) · home flag, fork sensor, leads laid to a terminal block on the base edge, one cable clip under the base |
| L1 | PASS | STYLE · lint-style clean |
| L2 | PASS | HAND · model and polish carry geometry, roles, marks and materials only |
| L3 | PASS | HAND · lever and rods carry their roles (rods driver and output ends, lever link), bridge and rails ground, hardware hw |
| L4 | PASS | HAND / STYLE · accent on the input only (pS) |
| L5 | PASS | AUTO / HAND · fired: see-through · screws, bearings and shanks are real solids in real holes; see-through rule fired |
| L6 | PASS | AUTO · depth order right at plan, 28°, side and explode (screenshots) |
| L7 | PASS | STYLE · tilt 0° to 88°, no shear |
| L8 | PASS | AUTO / HAND · swing scale and index line are marks; centrelines and dimensions automatic |
| R1 | PASS | HAND · the polish reuses swing() and the rule-built stops, bridge and slides; nothing is redrawn |
| R2 | PASS | HAND · threads M3, M4, M5, M6, M8; joint Ø 8, 10; bearings F688ZZ (8x16x5), F6800 (10x19x5) · threads M3 to M8; joints Ø8 and Ø10; catalogue bearings only; few distinct sizes |
| R3 | PASS | AUTO · fired: hardware primitives · housing, bridge, stops, slide and drive from their subassemblies; nothing copied |
| R4 | PASS | AUTO · package built at build time |
| R5 | PASS | HAND · states only what differs (swing scale, notes); no sampling in the polish; rules 0.2 s, polish under 1 ms |
| R6 | PASS | FLAG · browser bench (one run for all five): plan 2.7, 28° 3.0, side 2.4, explode 2.9 ms at full detail, 8 ms never reached (no flag) |
| R7 | PASS | HAND · model.ts + polish.ts 8.2 KB |
| R8 | PASS | AUTO / SITE · pre-rendered thumbnails; the stage draws on change only |
| DL1 | PASS | AUTO / HAND · 72 of 189 solids on a dropping rung · every solid and mark on a rung; the polish moves nothing |
| DL2 | PASS | HAND · model detail full · default dial full |
| DL3 | PASS | AUTO · DL-D drawn when exploded, DL-B skipped at side elevation |
| DL4 | PASS | SITE · adaptive dial and the detail entry in the title block |
| DL5 | PASS | FLAG · rung counts and frame times in the detail ladder below |
| Q1 | PASS | check, clamp and edge distance clean |
| Q2 | PASS | 0 clashes |
| Q3 | PASS | package written, 22.8 KB; site build not checked here · package written; the site build includes the page |
| Q4 | PASS | local: tools/shot · plan, 28°, side, explode at 28° and 70°, both sheets, overlays on; images in the pass notes folder and attached to the issue |
| Q5 | PASS | local: tools/bench · browser bench at DPR 1.5 on the GPU, three runs; frame times in the ladder below, all far under 8 ms (no flag) |
| Q6 | PASS | · every row judged |
| Q7 | PASS | · conformance: bell-crank at 2.6, pass |

## Joints
| Joint | Type | F1 locate | F2 retain | F3 torque | F4 thrust | F5 limit | F6 hold | F7 adjust | F8 lube | F9 timing | F10 protect |
|---|---|---|---|---|---|---|---|---|---|---|---|
| pO | J1 | 2 x spigot | 2 x Internal circlip DIN 472, Ø19; 2 x Bearing F6800 (10x19x5) | – no keyed part; plates turn on bearings | Thrust washer 10.2x13.1, bronze | Stop bumper, neoprene sleeve Ø12 | – no rest position to hold | – no exact length ratio at this pivot | Bridge over the pivot, on two spigoted posts | Base plate; Bell crank, front plate | – none needed |
| pA | J3 | – no removable plate on a moving pin | Internal circlip DIN 472, Ø16; Bearing F688ZZ (8x16x5); head | – no keyed part; plates turn on bearings | – located by flange and circlip, inner race clamped | – limited by the linkage | – no rest position to hold | – rod lengths are not critical (rods long against the arms) | – shielded bearing, greased for life | – no phase to keep at this pin | – none needed |
| pB | J3 | – no removable plate on a moving pin | Internal circlip DIN 472, Ø16; Bearing F688ZZ (8x16x5); head | – no keyed part; plates turn on bearings | – located by flange and circlip, inner race clamped | – limited by the linkage | – no rest position to hold | – rod lengths are not critical (rods long against the arms) | – shielded bearing, greased for life | – no phase to keep at this pin | – none needed |
| pS | J3 | – no removable plate on a moving pin | Internal circlip DIN 472, Ø16; Bearing F688ZZ (8x16x5); head | – no keyed part; plates turn on bearings | – located by flange and circlip, inner race clamped | – limited by the linkage | – no rest position to hold | – rod lengths are not critical (rods long against the arms) | – shielded bearing, greased for life | – the carriage is the phase reference | – none needed |
| pG | J3 | – no removable plate on a moving pin | Internal circlip DIN 472, Ø16; Bearing F688ZZ (8x16x5); head | – no keyed part; plates turn on bearings | – located by flange and circlip, inner race clamped | – limited by the linkage | – no rest position to hold | – rod lengths are not critical (rods long against the arms) | – shielded bearing, greased for life | – no phase to keep at this pin | – none needed |
| slide-carriage | J5 | – reference rail dowelled (rail seats) | Keeper plate, holds the slider down | – no keyed part | – sliding on the bronze gib and the rails | 2 x End stop block, hardened | – belt-held or linkage-held, no rattling clearance | Gib strip 105 x 7 x 2.3, bronze, slotted, clamped under the keeper | 2 x wiper; Grease nipple M6 (DIN 71412) | – no phase on a slide | – end stops protect the travel |
| slide-slide-out | J5 | – reference rail dowelled (rail seats) | Keeper plate, holds the slider down | – no keyed part | – sliding on the bronze gib and the rails | 2 x End stop block, hardened | – belt-held or linkage-held, no rattling clearance | Gib strip 105 x 7 x 2.3, bronze, slotted, clamped under the keeper | 2 x wiper; Grease nipple M6 (DIN 71412) | – no phase on a slide | – end stops protect the travel |
| pO-bridge-post | post | 2 x spigot | – screwed from both sides | – static | – static | – static | – static | – spigot in a slot takes the hole tolerance | – static | – static | – static |
| in-guidea-seat | post | – spigots and dowels listed where they exist | – screwed from both sides | – static | – static | – static | – static | – spigot in a slot takes the hole tolerance | – static | – static | – static |
| in-guideb-seat | post | 2 x Dowel pin Ø3 h6 (ISO 8734), rail to base | – screwed from both sides | – static | – static | – static | – static | – spigot in a slot takes the hole tolerance | – static | – static | – static |
| out-guidea-seat | post | – spigots and dowels listed where they exist | – screwed from both sides | – static | – static | – static | – static | – spigot in a slot takes the hole tolerance | – static | – static | – static |
| out-guideb-seat | post | 2 x Dowel pin Ø3 h6 (ISO 8734), rail to base | – screwed from both sides | – static | – static | – static | – static | – spigot in a slot takes the hole tolerance | – static | – static | – static |
| drive | drive | – bracket screwed up into the base | – pulley hub set screws, flanges | – pulley hub, set screws or crank clamp | – motor bearings | – the drive's own travel is the modelled range | – motor holds when powered | Tensioner arm, slotted, 2 x M4 | – belt and drive run dry | – one input, no phase to keep | Home flag, 1 mm steel vane; 3 x Fork sensor, slotted optical, 5 mm gap; Pulley flanges |

## Variants and overrides
| Joint or part | Rule result | Chosen | Why |
|---|---|---|---|
| lever | one plate, layer 1 | a clevis in the model: a rear and a front plate (`twin`), z 7.5 to 13.5 and 22.5 to 28.5, over and under the rods | A9: A and B in double shear |
| rods, sliders, guide bars | layer 1 and 2 at their layers | plated 5 mm low in the model (`dz`), the rods clear over the keepers | A9 and K5: single shear at the sliders, forced by the keepers; the rods run 1.5 mm over the keepers |
| lever, rods | straight stadium, plate | tapered rods, a plate lever with R12 bosses in the model | D1: sized to what each boss carries |

## Detail ladder
| Rung | Solids | Marks | Frame ms at this dial position |
|---|---|---|---|
| DL-A | 14 | 0 | 2.78 |
| DL-B | 0 | 221 | 2.02 |
| DL-C | 0 | 0 | 1.87 |
| DL-D | 26 | 0 | 1.77 |
| DL-E | 14 | 2 | 1.91 |
| DL-F | 0 | 0 | 1.78 |
| DL-G | 0 | 0 | 1.65 |
| DL-H | 18 | 0 | 1.47 |
| never | 117 | 176 | 3.02 (full) |

## Promotion candidates
- None open. The slide, stops, bridge and drive were all the rules'; the one hand input was the lever's clevis, which the model carries (`twin`).

## Verification
check: clean · clearance: 0 clashes · clamp: clean · edge distance: clean · package: 22.8 KB
screenshots: plan, 28°, side, explode at 28° and 70°, both sheets, overlays on (in the pass notes folder, attached to the issue) · bench: browser, DPR 1.5, 3 runs, 2026-10-19; 28° frame 3.02 ms at full detail (flags: none, R6)
