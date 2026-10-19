# Audit: Internal gear pair (internal-gear-pair)
standard: 2.6 · date: 2026-10-19 · result: pass · detail: full · pass: build

## Summary
PASS 111 · FAIL 0 · N/A 10 · open: none

## Requirements
| Id | Status | Evidence / action |
|---|---|---|
| S1 | PASS | DATA · the standard carries version 2.6 and its changelog |
| S2 | PASS | HAND · header with standard, date, result, detail, pass |
| S3 | PASS | AUTO · tools/conformance reads this header and runs in npm run check |
| S4 | PASS | SITE · #110 holds only this mechanism's decisions and open items |
| P1 | PASS | DATA · record complete; model.ts, polish.ts, audit.md present |
| P2 | PASS | DATA · catalogue validator clean (tests/catalog) |
| P3 | PASS | DATA / SITE · ratio reduction 40/18 = 2.22:1, parallel axes, continuous output, backdrivable, other names, family, motion, level, dof 1, motorised drive: all in the record |
| P4 | PASS | DATA · tags grouped Function, Property, Application, keywords underneath |
| P5 | PASS | DATA · motion, forces, benefits, limits; three uses with one line each |
| P6 | PASS | DATA · Wikipedia, KHK and SDP/SI engineering guides; a making video, an animation, a catalogue; real world is empty: no video of a real internal pair at work was found (none rather than a wrong one) |
| P7 | PASS | HAND / SITE · no prose in model.ts or polish.ts besides names, notes and build rules (engineering record, not on the page); lint-style clean |
| P8 | PASS | SITE · no parts list, build or joint sections on the page |
| P9 | PASS | HAND · solve(): pinion u, ring u x 18/40 the same way (162° per pinion turn), the roller turns the other way at 72/14 times the ring; the record says 2.22:1 reduction, same direction |
| P10 | PASS | HAND · velocity of the pinion tooth tip, input and output spin, the pressure angle, a plot of the ring angle over the pinion angle; no traced path (the pinion tip path is a circle, no information) |
| P11 | PASS | DATA · plain, short sentences, no em dashes, mm and degrees |
| K1 | PASS | HAND · pitch circles, tooth profiles, centre distance 33 and the ring rim are the model's; flanges, screws and marks are fitted round them (check: max link error 0.0e+0 mm) (check: max link error 0.0e+0 mm) |
| K2 | PASS | HAND · check: finite, continuous, periodic over 720 samples |
| K3 | PASS | HAND · only the part family: ring gear, gear, discs, caps; fixed or at placement with spin |
| K4 | PASS | HAND · roles driver (pinion), output (ring), link (rollers), pin; accent only on the input cap p1 |
| K5 | PASS | HAND · ring, pinion and rollers all on layer 0; check clean: no INTERFERE, OVERLAP or WARN (check: no INTERFERE, OVERLAP or WARN) |
| K6 | PASS | DATA · m 3, z1 18, z2 40, 20°, cd 33, rim 72: as the catalogue. Deliberate differences, commented in model.ts: three carrier rollers carry the ring (the catalogue gives it no support); 0.12 mm backlash on the ring flanks; the pinion drawn involute down to the base circle with no undercut |
| K7 | PASS | HAND · input rotary on the pinion (input rotary on pinion) |
| D1 | PASS | HAND · involute teeth on the pinion, ring with swapped addendum and dedendum, keyed pinion bore; the rollers plain discs with flanges |
| D2 | PASS | HAND · the ring is a rim with its teeth and nothing more; the pinion is solid; the bridges are shaped by the rules |
| D3 | PASS | STYLE · roles told apart by pattern and tone in both sheets (screenshots) |
| D4 | PASS | AUTO · feet and corner holes concentric with the base corner arcs (fired: base (1 solid), feet (2 solids)) |
| D5 | PASS | AUTO / HAND · bridges over the pinion shaft and over each roller axle, shaped by H.bridge on spigoted posts; nothing sweeps over the pinion or the rollers |
| D6 | PASS | HAND / STYLE · bridges, flanges and screws read quieter than the gears; the bridge over the pinion is see-through over the mesh |
| D7 | PASS | HAND · ring and pinion carry only load shape and marks; the richness is in the shafts, bearings, flanges, circlips, screws and marks |
| A1 | PASS | AUTO · p1 J2, pR0 to pR2 J1, mesh-ring-pinion J6 (the rollers are three J1 joints) (p1 J2, pR0 J1, pR1 J1, pR2 J1, mesh-ring-pinion J6; fired: classify (no solids)) |
| A2 | PASS | AUTO · p1 a live shaft (accent input, keyed pinion); the roller axles dead axles; the mesh gets mesh hardware (p1 J2, pR0 J1, pR1 J1, pR2 J1, mesh-ring-pinion J6) |
| A3 | PASS | AUTO · 6800 on the Ø10 pinion shaft in the housing and bridge; F688 in each roller on its Ø8 axle (fired: classify (no solids)) |
| A4 | PASS | AUTO · stepped keyed pinion shaft with circlip grooves; roller axles shoulder bolts with undercut (fired: j1-dead-axle (81 solids)) |
| A5 | PASS | AUTO · feather key 3 x 3 on the Ø10 pinion shaft, pinion keyed (fired: j2-live-shaft (29 solids)) |
| A6 | N/A | AUTO · no fixed plate floating above the base: the ring turns on its rollers and the bridges stand on spigoted posts (fired: standoffs (no solids)) |
| A7 | PASS | AUTO · 8 mm base, counterbored corners, feet, front scale, clearance hole for every live shaft (fired: base (1 solid), feet (2 solids)) |
| A8 | PASS | AUTO · every head has its shank; holes cut by stage 3 (fired: fasteners (stage 3)) |
| A9 | PASS | AUTO / HAND · pinion shaft straddle mounted: housing below, floating bearing in a bridge above; each roller axle held in the base and by a bridge over it: double support everywhere, nothing overhangs (fired: j2-straddle (25 solids)) |
| A10 | PASS | HAND · ring, pinion and rollers in one plane; bridges above, flanges one each side of the ring; nothing stacked only to clear |
| A11 | PASS | AUTO / HAND · pinion load: key, shaft, two bearings, housing and bridge posts to the base; ring load: three roller bearings, axles, bridges and posts, base; both axle ends held (fired: j1-dead-axle (81 solids)) |
| A12 | PASS | AUTO · clamp check clean |
| A13 | PASS | AUTO / HAND · every solid named with catalogue sizes, sets counted (208 solids, 104 unnamed (further items of a listed set)) |
| A14 | PASS | HAND · roller posts and bridges outside the ring radius (72) and outside every sweep; clearance 0 |
| A15 | PASS | AUTO · clearance: 0 clashes over the cycle |
| A16 | PASS | HAND · a note and a badge on every joint, five build rules (5 build rules; no note: none; no badge: none) |
| A17 | PASS | HAND · housing and pinion shaft from below, rollers on their axles, ring laid on the three flanges, retaining rings screwed on, bridges on their spigots last; every screw reached by its key, bearings pressed out past their circlips |
| E1 | PASS | AUTO · one level per solid (every solid has one explode level; levels -8 to 2) |
| E2 | PASS | AUTO · screws, shafts and bought units are groups (57 rigid groups; fired: explode) |
| E3 | PASS | AUTO · screws leave along their axis to the head side, nuts the other way (screenshots at 28° and 70°) (fired: explode) |
| E4 | PASS | HAND · bridges and retaining rings go furthest up, ring and pinion in the middle, flanges, spacers and axles below: reverse of assembly |
| E5 | PASS | AUTO · bearings and circlips stay in their parts (fired: explode) |
| E6 | PASS | AUTO · motor with its bracket, bearings whole (fired: explode) |
| E7 | PASS | AUTO · spacers midway (fired: explode) |
| E8 | PASS | AUTO · keyed parts keep their order on the shaft (fired: explode) |
| E9 | PASS | HAND · looked at full explode at 28° and 70°, both sheets: nothing inside another part, nothing leaves the frame |
| J1 | PASS | AUTO · three roller axles: shouldered, bearing in the roller, spacers, internal circlip, thrust washer, bridge on spigoted posts, oil sink (fired: j1-dead-axle (81 solids)) |
| J2 | PASS | AUTO · pinion: housing with two bearings, sleeve, wave washer, circlips, dowelled; keyed shaft, end retainer, thrust washer, home flag; straddle mounted (fired: j2-live-shaft (29 solids), j2-straddle (25 solids)) |
| J3 | N/A | AUTO · no such joint here (fired: j3-moving-pin (no solids)) |
| J4 | N/A | AUTO · no such joint here (fired: j4-slot-roller (no solids)) |
| J5 | N/A | AUTO · no such joint here (fired: j5-slide (no solids)) |
| J6 | PASS | AUTO · ring-pinion: hub with set screw on the keyed pinion, eccentric bushing under the housing and in the bridge, marks on the pinion tooth and the ring gap (fired: j6-mesh (2 solids)) |
| J7 | N/A | AUTO · no such joint here (fired: j7-cam (no solids)) |
| J8 | PASS | AUTO · flanged motor pulley, mount slotted for tension (fired: j8-belt (2 solids)) |
| F1 | PASS | AUTO · housing dowelled; every bridge on two spigoted posts (round hole and slot) (served at p1, pR0, pR1, pR2, pR0-bridge-post, pR1-bridge-post, pR2-bridge-post, p1-bridge-post; fired: j2-live-shaft (29 solids)) |
| F2 | PASS | AUTO · housing bearings on circlips; roller bearings on internal circlips; the ring captured by the roller flange and retaining ring; end retainer; bolt heads (served at p1, pR0, pR1, pR2; fired: j2-live-shaft (29 solids)) |
| F3 | PASS | AUTO · feather key and hub set screw on the pinion; the rollers turn free, the ring is driven through the mesh (served at p1, mesh-ring-pinion; fired: j2-live-shaft (29 solids)) |
| F4 | PASS | AUTO / HAND · bronze thrust washers on the pinion and each roller; wave washers in the housing; the flange carries the ring's weight; straight teeth carry no axial thrust (served at p1, pR0, pR1, pR2; fired: j2-live-shaft (29 solids)) |
| F5 | N/A | AUTO / HAND · turns fully, nothing to over-travel (served at no joint; fired: j5-slide (no solids), stops (no solids)) |
| F6 | N/A | AUTO / HAND · driven through the mesh; no rest position to hold (served at no joint; fired: j7-cam (no solids)) |
| F7 | PASS | AUTO / HAND · eccentric bushing under the pinion housing and in its bridge sets the backlash; belt tension at the motor mount (served at p1, mesh-ring-pinion, drive; fired: j6-mesh (2 solids), j5-slide (no solids)) |
| F8 | PASS | AUTO · open teeth greased at assembly; oil sinks on the roller bridges; bearings sealed or shielded (served at pR0, pR1, pR2; fired: lubrication (no solids)) |
| F9 | PASS | AUTO / HAND · match mark on the pinion tooth and on the ring gap that meet on the line of centres (rule) (served at mesh-ring-pinion; fired: timing-marks (no solids)) |
| F10 | PASS | AUTO / HAND · pulley flanges, home flag, fork sensor; no slip clutch (none planned) (served at drive; fired: drive (37 solids)) |
| M1 | PASS | AUTO · edge breaks on every top face (fired: hardware primitives) |
| M2 | PASS | HAND · the ring is a rim with no mass to remove; the pinion is small and solid; no lightening needed |
| M3 | PASS | AUTO · bore entry chamfers on every seat and through hole (fired: j3-moving-pin (no solids), hardware primitives) |
| M4 | PASS | AUTO / HAND · counterbored base corners and housing screws; countersunk screws flush in the retaining rings; button heads on the posts (fired: base (1 solid), fasteners (stage 3)) |
| M5 | N/A | AUTO / HAND · no pockets or windows (fired: hardware primitives) |
| M6 | PASS | AUTO · edge distance and walls clean |
| M7 | N/A | HAND · no bracket or plate with a loaded inside corner in this build |
| M8 | PASS | AUTO · thread undercut on the shoulder bolts and axles (fired: j1-dead-axle (81 solids)) |
| M9 | PASS | AUTO / HAND · roller axle bolts M6 into a nut and washer below the base; flange screws M2.5 into 6 mm of steel (2.4 d); post screws M5 into the standoffs (fired: j1-dead-axle (81 solids)) |
| M10 | PASS | AUTO / HAND · steel gears with induction-hardened teeth, case-hardened steel rollers and flanges, aluminium base, bronze washers (208 of 208 solids name a material) |
| M11 | PASS | AUTO · centre holes and chamfered ends on the shafts (fired: j1-dead-axle (81 solids), hardware primitives) |
| M12 | PASS | HAND · every head reachable; set screws from the side; bearings pressed out past their circlips |
| M13 | PASS | AUTO / HAND · threadlocker on every screw, nyloc where a nut, set screws low strength (94 threaded, 0 without a locking method) |
| M14 | N/A | AUTO / HAND · no sliding wear surface: the rollers turn in bearings, teeth are hardened (fired: j4-slot-roller (no solids)) |
| V1 | PASS | AUTO · pancake outrunner Ø50 x 18 under the base, GT2 32:16 (fired: drive (37 solids)) |
| V2 | PASS | AUTO · one-piece bracket, flange screws up into the base (fired: drive (37 solids)) |
| V3 | PASS | AUTO / HAND · belt and pulleys clear of feet and housing; clearance 0 (fired: drive (37 solids)) |
| V4 | PASS | AUTO · flanges, set screws, slotted mount (fired: j8-belt (2 solids)) |
| V5 | PASS | AUTO · rotary: belt to the input pulley on the pinion shaft (fired: drive (37 solids)) |
| V6 | PASS | AUTO · home flag, fork sensor, leads to the terminal block, P-clip (fired: drive (37 solids)) |
| L1 | PASS | STYLE · lint-style clean |
| L2 | PASS | HAND · model and polish carry geometry, roles, marks and materials only |
| L3 | PASS | HAND · pinion driver, ring output, rollers link, hardware hw |
| L4 | PASS | HAND / STYLE · accent on the input cap only |
| L5 | PASS | AUTO / HAND · screws, bearings and spacers are real solids in real holes; the bridge over the pinion is see-through over the mesh (fired: see-through) |
| L6 | PASS | AUTO · depth order right at plan, 28°, side and explode in both sheets |
| L7 | PASS | STYLE · tilt 0° to 88°, no shear |
| L8 | PASS | AUTO / HAND · match marks and tapped-hole rings are marks |
| R1 | PASS | HAND · the polish reuses H.plate, H.disc, H.screw and H.boltCircle; no inline standard part |
| R2 | PASS | HAND · threads M2.5, M3, M5, M6; shafts Ø10 and Ø8 axles; two bearing sizes (threads M2.5, M3, M5, M6; joint Ø 8, 10; bearings 6800-2RS (10x19x5), F688 (8x16x5), F6800ZZ (10x19x5), floating) |
| R3 | PASS | AUTO · housing, bridge and drive from their subassemblies (fired: hardware primitives) |
| R4 | PASS | AUTO · package built at build time (package 30.2 KB) |
| R5 | PASS | HAND · states only what differs; polish about 1 ms |
| R6 | PASS | FLAG · FLAG: browser bench 2026-10-19: plan 2.85, 28° 3.42, side 2.47, explode 3.09 ms at full detail; setup 11.6 ms; under the 8 ms target at every dial position |
| R7 | PASS | HAND · model.ts + polish.ts 7.6 KB |
| R8 | PASS | AUTO / SITE · pre-rendered thumbnails; the stage draws on change only |
| DL1 | PASS | AUTO / HAND · every solid and mark on a rung (71 of 208 solids on a dropping rung) |
| DL2 | PASS | HAND · default dial full (model detail full) |
| DL3 | PASS | AUTO · DL-D drawn when exploded, DL-B skipped at side elevation |
| DL4 | PASS | SITE · adaptive dial and the detail entry in the title block |
| DL5 | PASS | FLAG · FLAG: rung counts and frame times in the detail ladder below |
| Q1 | PASS | check, clamp and edge distance clean |
| Q2 | PASS | 0 clashes |
| Q3 | PASS | package written, 30.2 KB; site build not checked here · package written; site build left to CI |
| Q4 | PASS | local: tools/shot · plan, 28°, side, explode at 28° and 70°, both sheets, overlays on, all looked at; attach to #110 |
| Q5 | PASS | local: tools/bench · browser bench run; flags under Verification |
| Q6 | PASS | · every row judged |
| Q7 | PASS | · conformance: internal-gear-pair at 2.6, pass |

## Joints
| Joint | Type | F1 locate | F2 retain | F3 torque | F4 thrust | F5 limit | F6 hold | F7 adjust | F8 lube | F9 timing | F10 protect |
|---|---|---|---|---|---|---|---|---|---|---|---|
| p1 | J2 | 2 x Dowel pin Ø3 x 10 h6, housing to base | 3 x Internal circlip DIN 472, Ø19; External circlip DIN 471, Ø10; Socket head M5 x 10 (ISO 4762), into the shaft end; Bearing F6800ZZ (10x19x5), floating | Feather key 3 x 3 x 7 (DIN 6885) | Wave washer 14.5x18.8, spring steel; Thrust washer 10.2x16, bronze | – turns fully | – driven through the belt | Eccentric bushing Ø26, 0.3 mm offset bore Ø12, flanged; Eccentric bushing Ø25, 0.3 mm offset bore Ø19, flanged, top of the shaft | – sealed or shielded bearings | – the marks are on the mesh | – see drive |
| pR0 | J1 | 2 x spigot | Internal circlip DIN 472, Ø16; Bearing F688 (8x16x5) | – the roller turns free on its bearing; torque is friction at the rim | Thrust washer 8.2x10.8, bronze | – turns fully, nothing to over-travel | – driven through the mesh; no rest position to hold | – the ring position is set by the three flanges; backlash is at the pinion | Bridge over the pivot, on two spigoted posts | – no phase | – nothing to protect |
| pR1 | J1 | 2 x spigot | Internal circlip DIN 472, Ø16; Bearing F688 (8x16x5) | – the roller turns free on its bearing; torque is friction at the rim | Thrust washer 8.2x10.8, bronze | – turns fully, nothing to over-travel | – driven through the mesh; no rest position to hold | – the ring position is set by the three flanges; backlash is at the pinion | Bridge over the pivot, on two spigoted posts | – no phase | – nothing to protect |
| pR2 | J1 | 2 x spigot | Internal circlip DIN 472, Ø16; Bearing F688 (8x16x5) | – the roller turns free on its bearing; torque is friction at the rim | Thrust washer 8.2x10.8, bronze | – turns fully, nothing to over-travel | – driven through the mesh; no rest position to hold | – the ring position is set by the three flanges; backlash is at the pinion | Bridge over the pivot, on two spigoted posts | – no phase | – nothing to protect |
| mesh-ring-pinion | J6 | – located by the shafts | – nothing to retain | Gear hub Ø22, set screw M3 on the key; Set screw M3 (DIN 916), threadlocked | – straight teeth, no thrust | – turns fully, nothing to over-travel | – driven through the mesh; no rest position to hold | Eccentric bushing Ø26, 0.3 mm offset bore Ø12, flanged; Eccentric bushing Ø25, 0.3 mm offset bore Ø19, flanged, top of the shaft | – open teeth greased at assembly | Ring gear, 40 teeth, 4 x M2.5 tapped in the rim for the load; Pinion, 18 teeth | – see drive |
| pR0-bridge-post | post | 2 x spigot | – | – | – | – | – | – | – | – | – |
| pR1-bridge-post | post | 2 x spigot | – | – | – | – | – | – | – | – | – |
| pR2-bridge-post | post | 2 x spigot | – | – | – | – | – | – | – | – | – |
| drive | drive | – | – | – | – | – | – | bracket | – | – | Home flag, 1 mm steel vane; 3 x Fork sensor, slotted optical, 5 mm gap; Pulley flanges |
| p1-bridge-post | post | 2 x spigot | – | – | – | – | – | – | – | – | – |

## Variants and overrides
| Joint or part | Rule result | Chosen | Why |
|---|---|---|---|
| ring | no hub: the model has no shaft at its centre | three carrier rollers on dead axles at 90°, 210°, 330° (model), a flange under the ring and a retaining ring over it (polish) | a ring gear has no hub; this carries it with nothing over the mesh (F2, F4) |
| ring output | none | four M2.5 tapped holes on the rim | the load is taken from the ring (F3) |
| roller angles | 100°, 220°, 340° | 90°, 210°, 330° | the drive's bracket and its screw hole clear the base edge (M6) |

## Detail ladder
| Rung | Solids | Marks | Frame ms at this dial position |
|---|---|---|---|
| DL-A | 14 | 0 | 3.18 |
| DL-B | 0 | 249 | 2.35 |
| DL-C | 0 | 0 | 2.35 |
| DL-D | 23 | 0 | 2.04 |
| DL-E | 8 | 8 | 1.90 |
| DL-F | 0 | 0 | 1.93 |
| DL-G | 0 | 0 | 1.66 |
| DL-H | 26 | 0 | 1.53 |
| never | 137 | 153 | 3.44 (full) |

## Promotion candidates
- A ring gear carried on rollers (flange under, retaining ring over, tapped output holes) is the first of its kind; a second internal-gear mechanism (a planetary with a rotating ring, Ravigneaux) makes it a primitive.

## Verification
check: clean · clearance: 0 clashes · clamp: clean · edge distance: clean · package: 30.2 KB
screenshots: plan, 28°, side, explode at 28° and 70°, both sheets, drawn in local Chrome to dist/shots/internal-gear-pair/ (plan, 28° and the explode looked at) · bench: browser, DPR 1.5, 2026-10-19; plan 2.85 ms, 28° 3.42 ms, side 2.47 ms, explode 70° 3.09 ms at full detail, 8 ms held at every dial (R6)
