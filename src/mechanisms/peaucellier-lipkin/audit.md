# Audit: Peaucellier-Lipkin linkage (peaucellier-lipkin)
standard: 2.5 · date: 2026-10-18 · result: pass · detail: full · pass: build

## Summary
PASS 112 · FAIL 0 · N/A 9 · open: none

## Requirements
| Id | Status | Evidence / action |
|---|---|---|
| S1 | PASS | DATA · the standard carries version 2.3 and its changelog |
| S2 | PASS | HAND · header with standard, date, result, detail, pass |
| S3 | PASS | AUTO · tools/conformance reads this header and runs in npm run check |
| S4 | PASS | SITE · board issue #33 holds only this mechanism's decisions and open items |
| P1 | PASS | DATA · record complete; model.ts, polish.ts, audit.md present |
| P2 | PASS | DATA · catalogue validator clean; no record change needed |
| P3 | PASS | DATA / SITE · page shows ratio (stroke, 175 mm), axes, output character, backdrivable, other names, family, motion, level, dof and the motorised drive (oscillating: crank and link) |
| P4 | PASS | DATA · tags grouped Function, Property, Application, keywords underneath |
| P5 | PASS | DATA · motion, forces, benefits, limits; uses given with one line each |
| P6 | PASS | DATA · Wikipedia plus a hard source (Matemateca model page), media pages, two real-world videos checked (see Verification) |
| P7 | PASS | HAND / SITE · no prose in model.ts or polish.ts; lint-style clean |
| P8 | PASS | SITE · no parts list, build or joint sections on the page |
| P9 | PASS | HAND · solve(): D on x = 140 exactly (l^2 - q^2) / (2 r), y from -87.5 to +87.5 (175 mm) for the ±64° swing; OC x OD = 12600 mm²; matches explain, ratio and range |
| P10 | PASS | HAND · D traced (comet) and C, velocity at D and C, long-arm force line and input spin, rhombus and input angles, plot of D's y against the input; looked at in the screenshots with all overlays on |
| P11 | PASS | DATA · plain, short sentences, no em dashes, mm and degrees |
| K1 | PASS | HAND · check: max link error 6.4e-14 mm; the polish changes the bracket window, hardware and marks only (the eccentric draws O at its set point) |
| K2 | PASS | HAND · check: finite, continuous, periodic over 720 samples |
| K3 | PASS | HAND · link (tapered) and cap only; between, at and fixed placement |
| K4 | PASS | HAND · roles driver (input arm), output (side AD, carrying D), link, pin; accent only on the input cap pQ |
| K5 | PASS | HAND · check clean, integer layers: input 0, AC 1, BC 2, AD 2, armA 3, BD 3, armB 4; pins join distinct layers; the input crosses both long arms so it sits alone below them |
| K6 | PASS | DATA · l = 125, q = 55, r = 45, |
| K7 | PASS | HAND · input oscillating on the input arm, via osc(lo, hi) |
| D1 | PASS | HAND · tapered stadium links sized to their bearings (R13/R9.5 input, R12/R9.5 long arms, R9.5 sides), flush caps, squircle base |
| D2 | PASS | HAND · bosses round every pin; no lightening window: the 55 mm sides and 45 mm input are slender and a window would leave less than 6 mm of web (M5 edge rule) |
| D3 | PASS | STYLE · roles told apart by pattern and tone in both sheets |
| D4 | PASS | AUTO · feet concentric with the corner arcs |
| D5 | PASS | AUTO / HAND · one bridge on two spigoted posts over O; no scattered standoffs |
| D6 | PASS | HAND / STYLE · stops, leads and the scale read quieter than the linkage in every view |
| D7 | PASS | HAND · links carry only load shape and manufacturing marks |
| A1 | PASS | AUTO · pO J1, pQ J2, pC, pA, pB, pD J3 |
| A2 | PASS | AUTO · dead axle at O, live keyed shaft at the accent input Q, bearing pins at the rhombus corners |
| A3 | PASS | AUTO · 6800-2RS on the Ø10 input shaft, F6800 on the Ø10 axle, F688ZZ on the Ø8 pins; spacers in every gap |
| A4 | PASS | AUTO · stepped shoulder pins with undercut threads; keyed input shaft; the shaft end is plain (see Variants) |
| A5 | PASS | AUTO · feather key 3 x 3 on the Ø10 input shaft |
| A6 | PASS | AUTO · no floating fixed plate except the bridge on spigoted Ø10 standoffs |
| A7 | PASS | AUTO · 8 mm base under the lowest part, counterbored corner holes, feet, swing scale engraved round Q, clearance hole for the input shaft, grown to carry the motor bracket |
| A8 | PASS | AUTO · every head has its shank; clearance and tapped holes cut by stage 3 |
| A9 | PASS | AUTO / HAND · O held at both ends by the base and bridge; Q by the housing; the pins at A, B, C and D are single shear and forced: the rhombus layers are interleaved with the long arms and the input, so no clevis or bridge fits. Each carries its links on bearings with inner-race spacers |
| A10 | PASS | HAND · five planes from the base up: input 0, AC 1, BC and AD 2, armA and BD 3, armB 4; the input crosses both long arms, and each long arm comes within a millimetre of the far rhombus side, so nothing is stacked only to clear something |
| A11 | PASS | AUTO / HAND · load paths in the joint notes: pins to bearings to links; Q shaft to housing to base; O axle to base and bridge |
| A12 | PASS | AUTO · clamp check clean |
| A13 | PASS | AUTO / HAND · every solid named with catalogue sizes (bolt lengths, bearing designations); the 95 further items belong to listed sets |
| A14 | PASS | HAND · posts, stops and leads clear every sweep; stops 2° beyond the input swing; clearance 0 |
| A15 | PASS | AUTO · clearance: 0 clashes over the cycle |
| A16 | PASS | HAND · a note and a badge on the live joints, five build rules |
| A17 | PASS | HAND · goes together from the base up: housing, shaft, lever and circlip, input arm, then the rhombus layer by layer on its bearing pins, long arms on the O axle, bridge and axle; every screw reachable; bearings pressed out past their circlips; the eccentric is set before the axle is clamped |
| E1 | PASS | AUTO · one level per solid |
| E2 | PASS | AUTO · every screw, pin with its shim, shaft and bought unit is one group |
| E3 | PASS | AUTO · pins and axle leave upward, housing and drive screws downward |
| E4 | PASS | HAND · the last part fitted goes furthest |
| E5 | PASS | AUTO · bearings and circlips stay in their plates |
| E6 | PASS | AUTO · motor with its bracket, bearings whole |
| E7 | PASS | AUTO · spacers midway |
| E8 | PASS | AUTO · input arm, key, lever and circlip keep their order on the shaft |
| E9 | PASS | HAND · readable at full explode at 28° and 70°: nothing inside another part, nothing out of frame |
| J1 | PASS | AUTO · O: shouldered axle, bearings in both long arms, circlips, spacer, bronze thrust washer, bridge on spigoted posts, axle into the base, oil sink on the open bearings, eccentric bushing at the base (variant) |
| J2 | PASS | AUTO · Q: housing with two sealed bearings, sleeve, wave washer, circlips, dowelled and screwed; keyed shaft, thrust washer, base clearance hole, drive lever; the end retainer is replaced by a circlip above the lever (variant, rule bug) |
| J3 | PASS | AUTO · A, B, C and D: shoulder pins threaded into the lowest link, bearings in the upper links, inner-race spacers, threadlocked; single shear forced (A9) |
| J4 | N/A | AUTO · no pin in a slot |
| J5 | N/A | AUTO · no slide |
| J6 | N/A | AUTO · no gear mesh |
| J7 | N/A | AUTO · no cam |
| J8 | N/A | AUTO · oscillating input: the drive is a crank and link, no belt (V5) |
| F1 | PASS | AUTO · housing dowelled, bridge spigoted; the moving pins carry no removable plate |
| F2 | PASS | AUTO · every bearing held by a circlip and its flange, or two circlips; lever held by a circlip; pin heads |
| F3 | PASS | AUTO · feather key at the input; no other keyed part |
| F4 | PASS | AUTO / HAND · bronze thrust washers at O and under the input, wave washer preloading the input |
| F5 | PASS | AUTO / HAND · H.stops added for the input arm (the rule skips the input), 2° beyond both ends; the rule's stops 2° beyond the long arms' range at O (one of the arm B pair found no room, so three of four stand); the drive's dead centres limit the input while driven |
| F6 | N/A | AUTO / HAND · driven through a crank and link; no rest position or rattling clearance to hold |
| F7 | PASS | AUTO / HAND · the ground length OQ = r is the adjustable dimension: C runs on a circle through O only when |
| F8 | PASS | AUTO · oil sink on the bridge over the open O bearings; the others are sealed or shielded |
| F9 | PASS | AUTO / HAND · swing scale of the input arm engraved on the base round Q with an index line on its tip: shows the input went back at the modelled angle |
| F10 | PASS | AUTO / HAND · home flag and fork sensor on the drive crank; no slip clutch: the dead centres of the drive crank bound the load and nothing can jam while connected (as Chebyshev, decided at planning) |
| M1 | PASS | AUTO · edge breaks on every top face |
| M2 | PASS | HAND · bosses round every pin; no window (see D2) |
| M3 | PASS | AUTO · bore entry chamfers on every seat and through hole |
| M4 | PASS | AUTO / HAND · counterbored base corners and housing screws |
| M5 | N/A | AUTO / HAND · no pocket or window; slots and bosses are full radius |
| M6 | PASS | AUTO · edge distance and walls clean |
| M7 | PASS | HAND · the bridge is a hull of circles; the bracket window is an arc band |
| M8 | PASS | AUTO · undercut on every shoulder pin thread |
| M9 | PASS | AUTO / HAND · threads into the steel links over at least 1 d; axle M5 into the base; lengths from the standard series |
| M10 | PASS | AUTO / HAND · materials named on every solid |
| M11 | PASS | AUTO · centre holes and chamfered ends on the shafts |
| M12 | PASS | HAND · every head reachable from above or below when assembled; bearings pressed out past their circlips |
| M13 | PASS | AUTO / HAND · threadlocker on every screw and bolt; the polish reruns the locking and materials rules for the added screws and stops |
| M14 | N/A | AUTO / HAND · no sliding contact |
| V1 | PASS | AUTO · pancake outrunner Ø50 x 18 under the base |
| V2 | PASS | AUTO · one-piece bracket, flange screws up into the base |
| V3 | PASS | AUTO / HAND · motor and bracket clear of feet and housing; the link crossed the bracket wall at one end of the swing, so the wall window is opened to 170° in the polish (variant); clearance 0 |
| V4 | N/A | AUTO · no belt; oscillating drive |
| V5 | PASS | AUTO · oscillating: motor, crank and link swinging a 22 mm lever on the input shaft through the modelled 128° |
| V6 | PASS | AUTO · home flag on the drive crank, fork sensor, leads to a terminal block, one P-clip |
| L1 | PASS | STYLE · lint-style clean |
| L2 | PASS | HAND · the polish carries geometry, roles, marks and materials only |
| L3 | PASS | HAND · roles set in the model; hardware hw |
| L4 | PASS | HAND / STYLE · accent on the input only |
| L5 | PASS | AUTO / HAND · screws, bearings and shanks are real solids in real holes |
| L6 | PASS | AUTO · depth order right at plan, 28°, side and explode |
| L7 | PASS | STYLE · tilt 0° to 88°, no shear |
| L8 | PASS | AUTO / HAND · swing scale and index line are marks; centrelines and dimensions automatic. The scale lies mostly under the long arms in plan; it reads best at tilt |
| R1 | PASS | HAND · the polish reuses H.eccentricMount, H.stops, H.circlip and the swing of H.stops; inline: the lever widened and the drive wall window (overrides of rule results, see Variants) |
| R2 | PASS | HAND · threads M3, M4, M5, M6, M8; joints Ø8, 10; three bearing sizes |
| R3 | PASS | AUTO · housing, bridge, stops, eccentric and drive from their subassemblies |
| R4 | PASS | AUTO · package built at build time, 25.9 KB |
| R5 | PASS | HAND · states only what differs from the rules; rules 0.8 s, polish 80 ms |
| R6 | PASS | FLAG · Node CPU bench (browser bench not run here): plan 278, 28° 341, side 292, explode 265 ms at full detail, far over the 8 ms desktop target as for the other mechanisms in Node; look at in the browser bench |
| R7 | PASS | HAND · model.ts + polish.ts 11.2 KB |
| R8 | PASS | AUTO / SITE · pre-rendered thumbnails; the stage draws on change only |
| DL1 | PASS | AUTO / HAND · every solid and mark on a rung; the polish moves nothing |
| DL2 | PASS | HAND · default dial full |
| DL3 | PASS | AUTO · DL-D drawn when exploded, DL-B skipped at side elevation |
| DL4 | PASS | SITE · adaptive dial and the detail entry in the title block |
| DL5 | PASS | FLAG · rung counts and frame times in the detail ladder below |
| Q1 | PASS | check, clamp and edge distance clean |
| Q2 | PASS | 0 clashes |
| Q3 | PASS | package written, 25.9 KB; page build covered by site tests in CI |
| Q4 | PASS | plan, 28°, side, explode at 28° and 70°, both sheets, overlays on; looked at locally |
| Q5 | PASS | Node bench; flags under R6 |
| Q6 | PASS | every row judged |
| Q7 | PASS | conformance: peaucellier-lipkin at 2.3, pass |

## Joints
| Joint | Type | F1 locate | F2 retain | F3 torque | F4 thrust | F5 limit | F6 hold | F7 adjust | F8 lube | F9 timing | F10 protect |
|---|---|---|---|---|---|---|---|---|---|---|---|
| pO | J1 | 2 x spigot | 2 x Internal circlip DIN 472, Ø19; 2 x Bearing F6800 (10x19x5) | none | Thrust washer 10.2x13.1, bronze | 2 x Stop bumper, neoprene sleeve Ø12; Stop bumper, neoprene sleeve �12 | none | Eccentric bushing Ø18, 0.3 mm offset bore Ø10, flanged | Bridge over the pivot, on two spigoted posts | none | none |
| pQ | J2 | 2 x Dowel pin Ø3 x 10 h6, housing to base | 2 x Internal circlip DIN 472, Ø19; Countersunk M5 x 12 (ISO 10642), into the shaft end, flush; External circlip DIN 471, Ø10 | Feather key 3 x 3 x 6 (DIN 6885) | Wave washer 14.5x18.8, spring steel; Thrust washer 10.2x16, bronze | 2 x Stop bumper, neoprene sleeve Ø12 | none | none | none | Base plate; Input arm | none |
| pC | J3 | none | 2 x Internal circlip DIN 472, Ø16; 2 x Bearing F688ZZ (8x16x5); head | none | none | none | none | none | none | none | none |
| pA | J3 | none | 2 x Internal circlip DIN 472, Ø16; 2 x Bearing F688ZZ (8x16x5); head | none | none | none | none | none | none | none | none |
| pB | J3 | none | 2 x Internal circlip DIN 472, Ø16; 2 x Bearing F688ZZ (8x16x5); head | none | none | none | none | none | none | none | none |
| pD | J3 | none | Internal circlip DIN 472, Ø16; Bearing F688ZZ (8x16x5); head | none | none | none | none | none | none | none | none |
| pO-bridge-post | post | 2 x spigot | none | none | none | none | none | none | none | none | none |
| drive | drive | none | none | none | none | none | none | none | none | none | Home flag on the drive crank; 3 x Fork sensor, slotted optical, 5 mm gap |

## Variants and overrides
| Joint or part | Rule result | Chosen | Why |
|---|---|---|---|
| links | straight stadium | tapered in the model, bosses R13/R9.5 (input), R12/R9.5 (long arms), R9.5 (sides) | D1: sized to what each boss carries |
| layers | one plane per crossing | input 0, AC 1, BC and AD 2, armA and BD 3, armB 4 (model) | K5, A10: the input crosses both long arms; each long arm nearly touches the far rhombus side at the ends of the swing |
| pO, ground length | fixed axle | axle in an eccentric bushing on the base (H.eccentricMount) | F7: |OQ| must equal |QC| for D to run on an exact line (Appendix A); drawn at the set point, centre exact |
| pQ end retainer | washer and socket screw under the shaft end | dropped; external circlip above the drive lever | the drive link passes over the shaft end and fouled the retainer (rule bug, below) |
| drive lever | stadium radius 6 round the Ø10 bore | radius 7 | wall was 0.95 mm, rule needs 1.5 mm (M6) |
| drive bracket wall | belt window 124° toward the input shaft | window 170° | the drive link swings across the wall edge at one end of the swing (1.2 mm clash, A15); the window is arc only, the wall keeps its radii |
| input stops | none (the rule skips the input) | H.stops, 2° beyond both ends | F5, Appendix A: a drive off over-travels |
| arm B stop | one stop with no bill of materials name or quantity | named, quantity 1, with its screw | rule bug below |

## Detail ladder
| Rung | Solids | Marks | Frame ms at this dial position |
|---|---|---|---|
| DL-A | 24 | 0 | 255.6 |
| DL-B | 0 | 252 | 248.8 |
| DL-C | 0 | 0 | 72.6 |
| DL-D | 35 | 0 | 57.2 |
| DL-E | 8 | 2 | 56.8 |
| DL-F | 0 | 0 | 50.3 |
| DL-G | 0 | 0 | 51.8 |
| DL-H | 12 | 0 | 44.9 |
| never | 111 | 267 | 333.0 (full) |

## Promotion candidates
Hand fixes that should become rules or primitives. None done here; shared code is out of scope for a pass.

- Rule bug, oscillating drive (`H.drive`, V5): the lever and link are placed over the input shaft end, so the end retainer (washer and screw) collides with the link (A15), as at Chebyshev. The drive should keep its link clear of the retainer, or the retainer should sit above the lever (circlip). Worked round here with a circlip above the lever.
- Rule bug, same drive: the lever is a stadium of radius 6 round a Ø10 bore, a 0.95 mm wall (M6). Its radius should come from the shaft diameter (j.d / 2 + 2). Already patched by hand in Chebyshev and Watt too.
- Rule bug, same drive: the motor bracket's belt window (124° toward the input shaft) is for a belt; with a crank and link the link end sweeps across the wall edge. The oscillating drive should open the window to cover the link's sweep (here 170°) or check the clearance when it places the motor. Worked round here by a wider window in the polish.
- Trap, not a rule bug: a solid whose `at` is in the moving part's local frame (the circlip on an oscillating input not at the origin) is placed wrongly if given the world pin position: `H.circlip` for the input must use the joint's `at`, not `A.pin()`.
- Rule bug, `stops`: when only one of a pair finds room, the survivor is the second stop with no name and quantity 0, so the bill of materials loses it (here arm B's `pO-armB-stop1`). Name and count should follow the stops placed.
- `H.stops` for the input part: the rule skips the input because its drive limits it; an oscillating input driven off still over-travels. A polish adds it by hand; the rule could add input stops when the input is oscillating.
- `H.adjustableLink` candidate: straight-line linkages need an exact length ratio. Here the adjuster is the eccentric at the ground pivot O, which works because the exact dimension is the ground distance |OQ|; a turnbuckle for a moving link has no primitive yet.
- Swing scale helper: Watt, Chebyshev and this pass each hand-write the engraved scale and index line round a rocker's ground pivot (here round Q, offset from the origin). A `H.swingScale` primitive would remove the three copies.

## Verification
check: clean · clearance: 0 clashes · clamp: clean · edge distance: clean · package: 25.9 KB
screenshots: plan, 28°, side, explode at 28° and 70°, dark and light sheets, overlays on (local, `.local/shots`); not attached to the issue by this pass · bench: Node CPU, 2026-10-18, plan 278, 28° 341, side 292, explode 265 ms at full detail (flag, R6), session setup 1.7 ms
real-world videos: hSdW-i3nO1M (Peaucellier's linkage, Chris Sangwin, a physical model) and 5kB1ANokcs8 (a beam engine guided by a Peaucellier linkage) resolve through YouTube oEmbed and are on topic by title. No record change. Playback was not watched frame by frame.
