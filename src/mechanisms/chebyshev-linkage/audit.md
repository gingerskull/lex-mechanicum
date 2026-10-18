# Audit: Chebyshev linkage (chebyshev-linkage)
standard: 2.3 · date: 2026-10-18 · result: pass · detail: full · pass: build

## Summary
PASS 112 · FAIL 0 · N/A 9 · open: none

## Requirements
| Id | Status | Evidence / action |
|---|---|---|
| S1 | PASS | DATA · the standard carries version 2.3 and its changelog |
| S2 | PASS | HAND · header with standard, date, result, detail, pass |
| S3 | PASS | AUTO · tools/conformance reads this header and runs in npm run check |
| S4 | PASS | SITE · #22 holds only this mechanism's decisions and open items |
| P1 | PASS | DATA · record complete; model.ts, polish.ts, audit.md present |
| P2 | PASS | DATA · catalogue validator clean; no record change needed |
| P3 | PASS | DATA / SITE · page shows ratio (stroke), axes, output character, backdrivable, other names, family, motion, level, dof and the motorised drive (oscillating: crank and link) |
| P4 | PASS | DATA · tags grouped Function, Property, Application, keywords underneath |
| P5 | PASS | DATA · motion, forces, benefits, limits; three uses with one line each |
| P6 | PASS | DATA · Wikipedia plus the NITK virtual lab and lecture notes; two videos and a Cornell KMODDL photo page; real-world videos checked (see Verification) |
| P7 | PASS | HAND / SITE · no prose in model.ts or polish.ts; lint-style clean |
| P8 | PASS | SITE · no parts list, build or joint sections on the page |
| P9 | PASS | HAND · solve(): left rocker 36.87° to 90° (53.1°), midpoint x 0 to 120, y within 0.293 mm of 120 (catalogue 0.29); transmission angle 0° to 127° with the warning band lit; matches explain and range |
| P10 | PASS | HAND · midpoint M traced (comet), velocity at M and B, rocker and coupler force lines, transmission and input angles, plot of the offset from y = 120 |
| P11 | PASS | DATA · plain, short sentences, no em dashes, mm and degrees |
| K1 | PASS | HAND · check: max link error 5.7e-14 mm; the polish changes heights, hardware and marks only |
| K2 | PASS | HAND · check: finite, continuous, periodic over 720 samples |
| K3 | PASS | HAND · link (tapered), cap, tracer; between, at and fixed placement |
| K4 | PASS | HAND · roles driver (left rocker), output (right rocker), link (coupler), pin, trace; accent only on the input cap pO1 |
| K5 | PASS | HAND · check clean, integer layers 0, 1, 2; coupler plated 2.5 mm low and right rocker 1.5 mm up with `dz` in model.ts (K1: centres untouched) |
| K6 | PASS | DATA · ground 4s = 120, rockers 5s = 150, coupler 2s = 60, s = 30, as the catalogue; input limits acos(d/r) = 36.87° to 90°; code comment states the ratios |
| K7 | PASS | HAND · input oscillating on rockerL, via osc(lo, hi) |
| D1 | PASS | HAND · tapered stadium rockers sized to their bearings (R13/R9.5 and R12/R9.5), stadium coupler, flush caps, squircle base |
| D2 | PASS | HAND · bosses round every pin; no lightening window: 150 mm rockers and a 60 mm coupler are slender and the coupler is light, so a window would leave less than 6 mm of web (M5 edge rule) |
| D3 | PASS | STYLE · STYLE · roles told apart by pattern and tone in both sheets |
| D4 | PASS | AUTO · feet concentric with the corner arcs |
| D5 | PASS | AUTO / HAND · one bridge on two spigoted posts over O2; no scattered standoffs |
| D6 | PASS | HAND / STYLE · stops, leads and the scale read quieter than the linkage in every view |
| D7 | PASS | HAND · rockers, coupler, bridge and base carry only load shape and manufacturing marks |
| A1 | PASS | AUTO · pO1 J2, pO2 J1, pB J3, pA J3 |
| A2 | PASS | AUTO · live shaft at the accent input O1, dead axle at O2, shoulder bolts at B and A |
| A3 | PASS | AUTO · 6800-2RS on the Ø10 input, F6800 on the Ø10 axle, F688ZZ on the Ø8 pins; spacers in every gap |
| A4 | PASS | AUTO · stepped shoulder bolts with undercut threads; keyed input shaft; the shaft end is plain (see Variants) |
| A5 | PASS | AUTO · feather key 3 x 3 on the Ø10 input shaft |
| A6 | PASS | AUTO · no floating fixed plate besides the bridge, on spigoted Ø10 standoffs |
| A7 | PASS | AUTO · 8 mm base 2 mm under the lowest part, counterbored corner holes, feet, midpoint path and the swing scale engraved, front scale, clearance hole for the input shaft |
| A8 | PASS | AUTO · every head has its shank; clearance and tapped holes cut by stage 3 |
| A9 | PASS | AUTO / HAND · O1 and O2 held by housing or base and bridge. B and A are single shear and forced: the other rocker sweeps over B and under A at the ends of the stroke, so no clevis or bridge fits. Overhang at B 1.5 mm (coupler plated low); at A the bolt carries the right rocker on a bearing 14 mm from the coupler's, two bearings far apart |
| A10 | PASS | HAND · left rocker z 0 to 6, coupler 7.5 to 13.5, right rocker 21.5 to 27.5: three planes because the rockers cross; nothing stacked only to clear something |
| A11 | PASS | AUTO / HAND · load paths in the joint notes: pins to bearings to links; O1 shaft to housing to base; O2 axle to base and bridge; bridge screwed and located by spigots |
| A12 | PASS | AUTO · clamp check clean |
| A13 | PASS | AUTO / HAND · every solid named with catalogue sizes (shoulder bolt lengths, bearing designations); 66 further items belong to listed sets |
| A14 | PASS | HAND · posts, stops and leads clear every sweep; stops 2° beyond the swing; clearance 0 |
| A15 | PASS | AUTO · clearance: 0 clashes over the cycle |
| A16 | PASS | HAND · a note and a badge on every moving joint, five build rules |
| A17 | PASS | HAND · goes together from the base up: housing, shaft and lever, left rocker, coupler on B, B bolt, right rocker on the O2 axle, A bolt, bridge, axle; every screw reachable; bearings pressed out past their circlips; the eccentric is set before the axle is clamped |
| E1 | PASS | AUTO · one level per solid |
| E2 | PASS | AUTO · every screw, shoulder bolt with its shim, shaft and bought unit is one group |
| E3 | PASS | AUTO · bolts and axle leave upward, housing and drive screws downward |
| E4 | PASS | HAND · A bolt, right rocker, B bolt, coupler, left rocker: the last part fitted goes furthest |
| E5 | PASS | AUTO · bearings and circlips stay in their plates |
| E6 | PASS | AUTO · motor with its bracket, bearings whole |
| E7 | PASS | AUTO · spacers midway |
| E8 | PASS | AUTO · rocker, key, lever and circlip keep their order on the input shaft |
| E9 | PASS | HAND · readable at full explode at 28° and 70°: nothing inside another part, nothing out of frame |
| J1 | PASS | AUTO · O2: shouldered axle, bearing in the right rocker, circlips, spacers, bronze thrust washer, bridge on spigoted posts, axle into the base, oil sink on the open bearing, eccentric bushing at the base (variant) |
| J2 | PASS | AUTO · O1: housing with two sealed bearings, sleeve, wave washer, circlips, dowelled and screwed; keyed shaft, thrust washer, base clearance hole, drive lever; the end retainer is replaced by a circlip above the lever (variant, rule bug) |
| J3 | PASS | AUTO · B and A: shoulder bolts threaded into the lowest link, bearings in the upper links, inner-race spacers, threadlocked; single shear forced (A9) |
| J4 | N/A | AUTO · no pin in a slot |
| J5 | N/A | AUTO · no slide |
| J6 | N/A | AUTO · no gear mesh |
| J7 | N/A | AUTO · no cam |
| J8 | N/A | AUTO · oscillating input: the drive is a crank and link, no belt (V5) |
| F1 | PASS | AUTO · housing dowelled, bridge spigoted; the moving pins carry no removable plate |
| F2 | PASS | AUTO · every bearing held by a circlip and its flange, or two circlips; lever held by a circlip; bolt heads |
| F3 | PASS | AUTO · feather key at the input; no other keyed part |
| F4 | PASS | AUTO / HAND · bronze thrust washers under the left rocker and at O2, wave washer preloading the input; no drag needed |
| F5 | PASS | AUTO / HAND · H.stops added for the left rocker (the rule skips the input), 2° beyond both ends; the right rocker keeps the rule's single stop (no room beyond its other end, inside the linkage's sweep); the input's dead centres limit it while driven |
| F6 | N/A | AUTO / HAND · driven through a crank and link; no rest position or rattling clearance to hold |
| F7 | PASS | AUTO / HAND · the ground length 4s is the adjustable dimension: eccentric bushing at O2, two clamp screws, shown at its set point; drawn length exact (Appendix A) |
| F8 | PASS | AUTO · oil sink on the bridge over the open O2 bearing; the others are sealed or shielded |
| F9 | PASS | AUTO / HAND · swing scale of the left rocker engraved on the base with an index line on its tip: shows it went back together on the modelled crossed branch |
| F10 | PASS | AUTO / HAND · home flag and fork sensor on the drive crank; no slip clutch: the dead centres of the drive crank bound the load and nothing can jam while connected (as four-bar, decided at planning) |
| M1 | PASS | AUTO · edge breaks on every top face |
| M2 | PASS | HAND · bosses round every pin; no window (see D2) |
| M3 | PASS | AUTO · bore entry chamfers on every seat and through hole |
| M4 | PASS | AUTO / HAND · counterbored base corners and housing screws |
| M5 | N/A | AUTO / HAND · no pocket or window; slots and bosses are full radius |
| M6 | PASS | AUTO · edge distance and walls clean |
| M7 | PASS | HAND · the bridge is a hull of circles, no inside corner |
| M8 | PASS | AUTO · undercut on every shoulder bolt thread |
| M9 | PASS | AUTO / HAND · M6 into the steel links over their full 6 mm (1 d); axle M5 into the base (1.5 d); lengths from the standard series |
| M10 | PASS | AUTO / HAND · materials named on every solid; steel rockers and coupler, aluminium bridge |
| M11 | PASS | AUTO · centre holes and chamfered ends on the shafts |
| M12 | PASS | HAND · every head reachable from above or below when assembled; bearings pressed out past their circlips |
| M13 | PASS | AUTO / HAND · threadlocker on every screw and bolt; the polish reruns the locking and materials rules for the added screws and stops |
| M14 | N/A | AUTO / HAND · no sliding contact |
| V1 | PASS | AUTO · pancake outrunner Ø50 x 18 under the base |
| V2 | PASS | AUTO · one-piece bracket, flange screws up into the base |
| V3 | PASS | AUTO / HAND · motor and bracket clear of feet and housing; clearance 0 |
| V4 | N/A | AUTO · no belt; oscillating drive |
| V5 | PASS | AUTO · oscillating: motor, 5.4 mm crank and 121 mm link swinging a 22 mm lever on the input shaft through the modelled 53° |
| V6 | PASS | AUTO · home flag on the drive crank, fork sensor, leads to a terminal block, one P-clip |
| L1 | PASS | STYLE · lint-style clean |
| L2 | PASS | HAND · the polish carries geometry, roles, marks and materials only |
| L3 | PASS | HAND · roles set in the model; bridge ground, hardware hw |
| L4 | PASS | HAND / STYLE · accent on the input only |
| L5 | PASS | AUTO / HAND · screws, bearings and shanks are real solids in real holes |
| L6 | PASS | AUTO · depth order right at plan, 28°, side and explode |
| L7 | PASS | STYLE · tilt 0° to 88°, no shear |
| L8 | PASS | AUTO / HAND · swing scale and index line are marks; centrelines and dimensions automatic |
| R1 | PASS | HAND · the polish reuses H.eccentricMount, H.stops, H.circlip and the swing of H.stops; the one inline outline is the lever widened to a full wall (override of a rule result, see Variants) |
| R2 | PASS | HAND · threads M3, M4, M5, M6, M8; joints Ø8, 10; three bearing sizes |
| R3 | PASS | AUTO · housing, bridge, stops, eccentric and drive from their subassemblies |
| R4 | PASS | AUTO · package built at build time, 22.2 KB |
| R5 | PASS | HAND · states only what differs; samples the swing twice (180 steps); rules 0.18 s, polish 12 ms |
| R6 | PASS | FLAG · FLAG · Node CPU bench (browser bench not run here): plan 236, 28° 203, side 243, explode 230 ms at full detail, far over the 8 ms desktop target as for the other mechanisms in Node; look at in the browser bench |
| R7 | PASS | HAND · model.ts + polish.ts 9.7 KB |
| R8 | PASS | AUTO / SITE · pre-rendered thumbnails; the stage draws on change only |
| DL1 | PASS | AUTO / HAND · every solid and mark on a rung; the polish moves nothing |
| DL2 | PASS | HAND · default dial full |
| DL3 | PASS | AUTO · DL-D drawn when exploded, DL-B skipped at side elevation |
| DL4 | PASS | SITE · SITE · adaptive dial and the detail entry in the title block |
| DL5 | PASS | FLAG · FLAG · rung counts and frame times in the detail ladder below |
| Q1 | PASS | check, clamp and edge distance clean |
| Q2 | PASS | 0 clashes |
| Q3 | PASS | package written, 22.2 KB; page build covered by site tests in CI |
| Q4 | PASS | plan, 28°, side, explode at 28° and 70°, both sheets, overlays on; looked at locally |
| Q5 | PASS | Node bench; flags under R6 |
| Q6 | PASS | every row judged |
| Q7 | PASS | conformance: chebyshev-linkage at 2.3, pass |

## Joints
| Joint | Type | F1 locate | F2 retain | F3 torque | F4 thrust | F5 limit | F6 hold | F7 adjust | F8 lube | F9 timing | F10 protect |
|---|---|---|---|---|---|---|---|---|---|---|---|
| pO1 | J2 | 2 x Dowel pin Ø3 x 10 h6, housing to base | 2 x Internal circlip DIN 472, Ø19; Countersunk M5 x 12 (ISO 10642), into the shaft end, flush; External circlip DIN 471, Ø10 | Feather key 3 x 3 x 6 (DIN 6885) | Wave washer 14.5x18.8, spring steel; Thrust washer 10.2x16, bronze | 2 x Stop bumper, neoprene sleeve Ø12 | – driven through a crank and link, nothing to hold | – the adjustable dimension is the ground length at O2 | – sealed bearings | Base plate; Left rocker (input) | – see drive |
| pO2 | J1 | 2 x spigot | Internal circlip DIN 472, Ø19; Bearing F6800 (10x19x5) | – no keyed part; the rocker turns on a bearing | Thrust washer 10.2x13.1, bronze | Stop bumper, neoprene sleeve Ø12 | – driven, no rest position | Eccentric bushing Ø18, 0.3 mm offset bore Ø10, flanged | Bridge over the pivot, on two spigoted posts | – the scale and index at O1 serve the whole linkage | – protected by the stops (F5) |
| pB | J3 | – no removable plate on a moving pin | Internal circlip DIN 472, Ø16; Bearing F688ZZ (8x16x5); head | – no keyed part | F688ZZ located by flange and circlip, inner race clamped | – limited by the linkage | – driven, no rest position | – the exact ratio is set at O2 | – shielded bearing, greased for life | – one input, no phase to keep | – none needed |
| pA | J3 | – no removable plate on a moving pin | Internal circlip DIN 472, Ø16; Bearing F688ZZ (8x16x5); head | – no keyed part | F688ZZ located by flange and circlip, inner race clamped | – limited by the linkage | – driven, no rest position | – the exact ratio is set at O2 | – shielded bearing, greased for life | – one input, no phase to keep | – none needed |
| pO2-bridge-post | post | 2 x spigot | – screwed from both sides | – static | – static | – static | – static | – spigot in a slot takes the hole tolerance | – static | – static | – static |
| drive | drive | – bracket screwed up into the base | – lever retained by the circlip at pO1 | – lever clamped by the shaft and circlip, link and crank pinned | – motor bearings | – the crank's dead centres bound the swing | – motor holds when powered | – bracket slots | – links on plain pins | Home flag read by the fork sensor | Home flag on the drive crank; 3 x Fork sensor, slotted optical, 5 mm gap |

## Variants and overrides
| Joint or part | Rule result | Chosen | Why |
|---|---|---|---|
| coupler | layer 1, z 10 to 16 | plated 2.5 mm low in the model (`dz`), z 7.5 to 13.5 | A9: 1.5 mm overhang at the single-shear pin B |
| right rocker | layer 2, z 20 to 26 | plated 1.5 mm up in the model (`dz`), z 21.5 to 27.5 | the B bolt head stands to z 20.7: clear by 0.8 mm (a clash of 0.7 mm otherwise) |
| rockers | straight stadium | tapered in the model, bosses R13/R9.5 and R12/R9.5 | D1: sized to what each boss carries |
| pO2, ground length | fixed axle | axle in an eccentric bushing on the base (H.eccentricMount) | F7: exact length ratio 4 : 5 : 2 (Appendix A); drawn at the set point, centre exact |
| pO1 end retainer | washer and socket screw under the shaft end | dropped; external circlip above the drive lever | the drive link passes under the shaft end and fouled the retainer (rule bug, below) |
| drive lever | stadium radius 6 round the Ø10 bore | radius 7 | wall was 0.95 mm, rule needs 1.5 mm (M6) |
| left rocker stops | none (the rule skips the input) | H.stops, 2° beyond both ends | F5, Appendix A: a drive off over-travels |
| right rocker stop | one stop with no bill of materials name or quantity | named, quantity 1 | rule bug below |

## Detail ladder
| Rung | Solids | Marks | Frame ms at this dial position |
|---|---|---|---|
| DL-A | 12 | 0 | 190.8 |
| DL-B | 0 | 187 | 178.9 |
| DL-C | 0 | 0 | 40.7 |
| DL-D | 19 | 0 | 36.4 |
| DL-E | 8 | 2 | 38.0 |
| DL-F | 0 | 0 | 35.0 |
| DL-G | 0 | 0 | 30.9 |
| DL-H | 10 | 0 | 64.0 |
| never | 83 | 143 | 224.8 (full) |

## Promotion candidates
Hand fixes that should become rules or primitives. None done here; shared code is out of scope for a pass.

- Rule bug, oscillating drive (`H.drive`, V5): the motor is placed on the far side of the input shaft from the lever, so the link passes under the shaft end and fouls the end retainer (washer and screw, A15). The drive should keep its link clear of the shaft end retainer, or the retainer should sit above the lever. Worked round here with a circlip above the lever.
- Rule bug, same drive: the lever is a stadium of radius 6 round a Ø10 bore, a 0.95 mm wall (M6). Its radius should come from the shaft diameter (j.d / 2 + 2).
- Rule bug, `stops`: when only one of the two stops finds room, the surviving one is the one with no name and quantity 0 (`k = 1`), so the bill of materials loses the stop; the note still says "2° beyond each end". Name and count should follow the stops placed.
- `H.stops` for the input part: the rule skips the input because its drive limits it; an oscillating input that is not driven by a dead-centre crank (or is driven off) still over-travels. A polish had to add it by hand; the rule could add input stops when the input is oscillating.
- `H.adjustableLink` candidate: straight-line linkages (Watt, Hoekens, Roberts, Chebyshev) need an exact length ratio. Here the adjuster is the existing eccentric at the ground pivot, which only works when a ground pivot carries the exact dimension; a turnbuckle for a moving link has no primitive yet.

## Verification
check: clean · clearance: 0 clashes · clamp: clean · edge distance: clean · package: 22.2 KB
screenshots: plan, 28°, side, explode at 28° and 70°, dark and light sheets, overlays on (local, `.local/shots`); not attached to the issue by this pass · bench: Node CPU, 2026-10-18, plan 236, 28° 203, side 243, explode 230 ms at full detail (flag, R6), session setup 1.4 ms
real-world videos: oW5yTjMCQ2w (clockwork plantigrade walker, Chebyshev lambda linkage) and C-rhtAeIHt0 (LEGO walker) resolve through YouTube oEmbed and are on topic; media video _KWfkewD0Rg (Levers and linkages, Chebyshev straight-line motion model) also resolves. No record change. Playback was not watched frame by frame.
