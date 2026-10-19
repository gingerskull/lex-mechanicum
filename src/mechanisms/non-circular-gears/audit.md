# Audit: Non-circular gears (non-circular-gears)
standard: 2.6 · date: 2026-10-19 · result: pass · detail: full · pass: build

## Summary
PASS 111 · FAIL 0 · N/A 10 · open: none

## Requirements
| Id | Status | Evidence / action |
|---|---|---|
| S1 | PASS | DATA · the standard carries version 2.6 and its changelog |
| S2 | PASS | HAND · header with standard, date, result, detail, pass |
| S3 | PASS | AUTO · tools/conformance reads this header and runs in npm run check |
| S4 | PASS | SITE · #118 holds only this mechanism's decisions and open items |
| P1 | PASS | DATA · record complete; model.ts, polish.ts, audit.md present |
| P2 | PASS | DATA · catalogue validator clean (tests/catalog) |
| P3 | PASS | DATA / SITE · ratio variable (0.54 to 1.86), offset parallel axes, continuous variable-speed output, backdrivable, other names, family, motion, level, dof 1, motorised drive: all in the record |
| P4 | PASS | DATA · tags grouped Function, Property, Application, keywords underneath |
| P5 | PASS | DATA · motion, forces, benefits, limits; uses with one line each |
| P6 | PASS | DATA · Wikipedia and engineering references, a video, an animation, a photo page; real world: the record's YouTube videos checked live through oEmbed on 2026-10-19; look at them when convenient |
| P7 | PASS | HAND / SITE · no prose in model.ts or polish.ts besides names, notes and build rules (engineering record, not on the page); lint-style clean |
| P8 | PASS | SITE · no parts list, build or joint sections on the page |
| P9 | PASS | HAND · solve(): gear 1 turns u, gear 2 follows the equal-arc rolling of the two ellipses (one turn per input turn, speed r1/r2 from 0.54 to 1.86), the ratio plotted as the output angle |
| P10 | PASS | HAND · velocity of the contact point, input and output spin, the pressure angle, a plot of the output angle over the input angle (the slope is the speed ratio) |
| P11 | PASS | DATA · plain, short sentences, no em dashes, mm and degrees |
| K1 | PASS | HAND · the pitch curves, the centre distance 80, the tooth positions along the arc are the model's; spokes, hubs, bearings and marks are cut round them (check: max link error 0.0e+0 mm) (check: max link error 0.0e+0 mm) |
| K2 | PASS | HAND · check: finite, continuous, periodic over 720 samples |
| K3 | PASS | HAND · only the part family: custom outlines, caps; fixed or at placement with spin |
| K4 | PASS | HAND · roles driver (gear 1), output (gear 2), pin; accent only on the input cap p1 |
| K5 | PASS | HAND · both gears on layer 0; check clean: no INTERFERE, OVERLAP or WARN (check: no INTERFERE, OVERLAP or WARN) |
| K6 | PASS | DATA · a = 40, e = 0.3, z = 26, centre distance 80, 20°, pitch 9.45 mm: as the catalogue. Deliberate differences, commented in model.ts: the layout is turned 180° about the middle (the driver at x = 80); teeth are straight-flanked rack teeth on the curve's normal, cut 0.22 mm thin per flank; the pair is declared as 26 teeth of module 80/26 to the mesh rules |
| K7 | PASS | HAND · input rotary on gear 1 (input rotary on gear1) |
| D1 | PASS | HAND · elliptical pitch curves with rack-shaped teeth, keyed bores, hubs; the one family of forms |
| D2 | PASS | HAND · four spokes carry the load from the hub to the rim; the mass is in the rim |
| D3 | PASS | STYLE · roles told apart by pattern and tone in both sheets (screenshots) |
| D4 | PASS | AUTO · feet and corner holes concentric with the base corner arcs (fired: base (1 solid), feet (4 solids)) |
| D5 | PASS | AUTO / HAND · one bridge over both shafts on spigoted posts (straddle mount); nothing sweeps over the gears |
| D6 | PASS | HAND / STYLE · the bridge, screws and the drive read quieter than the gears; the bridge is see-through over the mesh |
| D7 | PASS | HAND · gears carry only load shape and marks; the richness is in the shafts, bearings, circlips, screws and marks |
| A1 | PASS | AUTO · p1 J2, p2 J2, mesh-gear1-gear2 J6 (p1 J2, p2 J2, mesh-gear1-gear2 J6; fired: classify (no solids)) |
| A2 | PASS | AUTO · p1 a live shaft (accent input), p2 a live shaft (keyed output gear); the mesh gets mesh hardware (p1 J2, p2 J2, mesh-gear1-gear2 J6) |
| A3 | PASS | AUTO · 6800 on both Ø10 shafts in the housings and in the bridge (fired: classify (no solids)) |
| A4 | PASS | AUTO · stepped keyed shafts with circlip grooves (fired: j1-dead-axle (no solids)) |
| A5 | PASS | AUTO · feather key 3 x 3 on both Ø10 shafts, both gears keyed (fired: j2-live-shaft (56 solids)) |
| A6 | N/A | AUTO · no fixed plate floating above the base: the bridge stands on spigoted posts (fired: standoffs (no solids)) |
| A7 | PASS | AUTO · 8 mm base, counterbored corners, feet, front scale, clearance hole for every live shaft (fired: base (1 solid), feet (4 solids)) |
| A8 | PASS | AUTO · every head has its shank; holes cut by stage 3 (fired: fasteners (stage 3)) |
| A9 | PASS | AUTO / HAND · both shafts straddle mounted: housing below, floating bearing in the bridge above; no overhung gear (fired: j2-straddle (31 solids)) |
| A10 | PASS | HAND · both gears in one plane; bridge above, housings below |
| A11 | PASS | AUTO / HAND · key, shaft, two bearings, housing and bridge posts to the base on both shafts; both ends held (fired: j1-dead-axle (no solids)) |
| A12 | PASS | AUTO · clamp check clean |
| A13 | PASS | AUTO / HAND · every solid named with catalogue sizes, sets counted (137 solids, 68 unnamed (further items of a listed set)) |
| A14 | PASS | HAND · bridge posts outside both gears' sweeps; clearance 0 |
| A15 | PASS | AUTO · clearance: 0 clashes over the cycle |
| A16 | PASS | HAND · a note and a badge on every joint, five build rules (5 build rules; no note: none; no badge: none) |
| A17 | PASS | HAND · housings and shafts from below, gears with key and hub set screw, in phase by the marks, bridge on its spigots last; every screw reached by its key, bearings pressed out past their circlips |
| E1 | PASS | AUTO · one level per solid (every solid has one explode level; levels -8 to 1.5) |
| E2 | PASS | AUTO · screws, shafts and bought units are groups (34 rigid groups; fired: explode) |
| E3 | PASS | AUTO · screws leave along their axis to the head side, nuts the other way (screenshots at 28° and 70°) (fired: explode) |
| E4 | PASS | HAND · bridge and its screws go furthest up, gears in the middle, housings and shafts below: reverse of assembly |
| E5 | PASS | AUTO · bearings and circlips stay in their parts (fired: explode) |
| E6 | PASS | AUTO · motor with its bracket, bearings whole (fired: explode) |
| E7 | PASS | AUTO · spacers midway (fired: explode) |
| E8 | PASS | AUTO · keyed parts keep their order on the shaft (fired: explode) |
| E9 | PASS | HAND · looked at full explode at 28° and 70°, both sheets: nothing inside another part, nothing leaves the frame |
| J1 | N/A | AUTO · no dead axle: both gears are keyed to live shafts (J2) (fired: j1-dead-axle (no solids)) |
| J2 | PASS | AUTO · each shaft: housing with two bearings, sleeve, wave washer, circlips, dowelled; keyed shaft, thrust washer, end retainer; straddle mounted in the bridge (fired: j2-live-shaft (56 solids), j2-straddle (31 solids)) |
| J3 | N/A | AUTO · no moving pin (fired: j3-moving-pin (no solids)) |
| J4 | N/A | AUTO · no such joint here (fired: j4-slot-roller (no solids)) |
| J5 | N/A | AUTO · no such joint here (fired: j5-slide (no solids)) |
| J6 | PASS | AUTO · gear1-gear2: hubs with set screws, eccentric bushings under the second housing and in the bridge, marks on the meeting tooth and gap (fired: j6-mesh (4 solids)) |
| J7 | N/A | AUTO · no such joint here (fired: j7-cam (no solids)) |
| J8 | PASS | AUTO · flanged motor pulley, mount slotted for tension (fired: j8-belt (2 solids)) |
| F1 | PASS | AUTO · both housings dowelled; the bridge on two spigoted posts (served at p1, p2, p1-p2-bridge-post; fired: j2-live-shaft (56 solids)) |
| F2 | PASS | AUTO · housing bearings on circlips, the bridge bearings floating on their circlips, end retainers (served at p1, p2; fired: j2-live-shaft (56 solids)) |
| F3 | PASS | AUTO · feather keys and hub set screws on both gears (served at p1, p2, mesh-gear1-gear2; fired: j2-live-shaft (56 solids)) |
| F4 | PASS | AUTO / HAND · bronze thrust washers on both shafts, wave washers in the housings; straight teeth carry no axial thrust (served at p1, p2; fired: j2-live-shaft (56 solids)) |
| F5 | N/A | AUTO / HAND · turns fully, nothing to over-travel (served at no joint; fired: j5-slide (no solids), stops (no solids)) |
| F6 | N/A | AUTO / HAND · driven through the mesh; no rest position to hold (served at no joint; fired: j7-cam (no solids)) |
| F7 | PASS | AUTO / HAND · eccentric bushings under the second housing and in the bridge set the mean backlash; belt tension at the motor mount (served at p2, mesh-gear1-gear2, drive; fired: j6-mesh (4 solids), j5-slide (no solids)) |
| F8 | PASS | AUTO · open teeth greased at assembly; bearings sealed or shielded (served at no joint; fired: lubrication (no solids)) |
| F9 | PASS | AUTO / HAND · match marks on the meeting teeth: gear 1's long side, and gear 2's short side moved to its real mesh radius (polish) (served at mesh-gear1-gear2; fired: timing-marks (no solids)) |
| F10 | PASS | AUTO / HAND · pulley flanges, home flag, fork sensor; no slip clutch (none planned) (served at drive; fired: drive (37 solids)) |
| M1 | PASS | AUTO · edge breaks on every top face (fired: hardware primitives) |
| M2 | PASS | HAND · four spokes in each gear: the variable speed accelerates the mass every turn, so the mass is in the rim; filleted R4 |
| M3 | PASS | AUTO · bore entry chamfers on every seat and through hole (fired: j3-moving-pin (no solids), hardware primitives) |
| M4 | PASS | AUTO / HAND · counterbored base corners and housing screws (fired: base (1 solid), fasteners (stage 3)) |
| M5 | PASS | AUTO / HAND · the spoke windows carry R4 cutter radii (H.filletPoly) (fired: hardware primitives) |
| M6 | PASS | AUTO · edge distance and walls clean |
| M7 | N/A | HAND · no bracket or plate with a loaded inside corner: the spoke windows are filleted |
| M8 | PASS | AUTO · thread undercut on the shoulder bolts and axles (fired: j1-dead-axle (no solids)) |
| M9 | PASS | AUTO / HAND · housing and post screws as the rules (fired: j1-dead-axle (no solids)) |
| M10 | PASS | AUTO / HAND · steel gears with induction-hardened teeth, aluminium base, bronze washers (137 of 137 solids name a material) |
| M11 | PASS | AUTO · centre holes and chamfered ends on the shafts (fired: j1-dead-axle (no solids), hardware primitives) |
| M12 | PASS | HAND · every head reachable; set screws from the side; bearings pressed out past their circlips |
| M13 | PASS | AUTO / HAND · threadlocker on every screw, nyloc where a nut, set screws low strength (45 threaded, 0 without a locking method) |
| M14 | N/A | AUTO / HAND · no sliding wear surface: teeth are hardened (fired: j4-slot-roller (no solids)) |
| V1 | PASS | AUTO · pancake outrunner Ø50 x 18 under the base, GT2 32:16 (fired: drive (37 solids)) |
| V2 | PASS | AUTO · one-piece bracket, flange screws up into the base (fired: drive (37 solids)) |
| V3 | PASS | AUTO / HAND · belt and pulleys clear of feet and housing; clearance 0 (fired: drive (37 solids)) |
| V4 | PASS | AUTO · flanges, set screws, slotted mount (fired: j8-belt (2 solids)) |
| V5 | PASS | AUTO · rotary: belt to the input pulley on gear 1's shaft (fired: drive (37 solids)) |
| V6 | PASS | AUTO · home flag, fork sensor, leads to the terminal block, P-clip (fired: drive (37 solids)) |
| L1 | PASS | STYLE · lint-style clean |
| L2 | PASS | HAND · model and polish carry geometry, roles, marks and materials only |
| L3 | PASS | HAND · gear 1 driver, gear 2 output, hardware hw |
| L4 | PASS | HAND / STYLE · accent on the input cap only |
| L5 | PASS | AUTO / HAND · screws, bearings and spacers are real solids in real holes; the bridge is drawn see-through over the mesh (fired: see-through) |
| L6 | PASS | AUTO · depth order right at plan, 28°, side and explode in both sheets |
| L7 | PASS | STYLE · tilt 0° to 88°, no shear |
| L8 | PASS | AUTO / HAND · match marks and tapped-hole rings are marks |
| R1 | PASS | HAND · the polish reuses H.filletPoly; no inline standard part; the gear outlines are the model's own parts |
| R2 | PASS | HAND · threads M3, M5; shafts Ø10; one bearing size (threads M3, M5; joint Ø 10; bearings 6800-2RS (10x19x5), F6800ZZ (10x19x5), floating) |
| R3 | PASS | AUTO · housing, bridge and drive from their subassemblies (fired: hardware primitives) |
| R4 | PASS | AUTO · package built at build time (package 20.0 KB) |
| R5 | PASS | HAND · states only what differs; polish about 1 ms |
| R6 | PASS | FLAG · FLAG: browser bench 2026-10-19: plan 2.22, 28° 2.67, side 2.02, explode 2.21 ms at full detail; setup 10.4 ms; under the 8 ms target at every dial position |
| R7 | PASS | HAND · model.ts + polish.ts 10.5 KB |
| R8 | PASS | AUTO / SITE · pre-rendered thumbnails; the stage draws on change only |
| DL1 | PASS | AUTO / HAND · every solid and mark on a rung (53 of 137 solids on a dropping rung) |
| DL2 | PASS | HAND · default dial full (model detail full) |
| DL3 | PASS | AUTO · DL-D drawn when exploded, DL-B skipped at side elevation |
| DL4 | PASS | SITE · adaptive dial and the detail entry in the title block |
| DL5 | PASS | FLAG · FLAG: rung counts and frame times in the detail ladder below |
| Q1 | PASS | check, clamp and edge distance clean |
| Q2 | PASS | 0 clashes |
| Q3 | PASS | package written, 20.0 KB; site build not checked here · package written; site build left to CI |
| Q4 | PASS | local: tools/shot · plan, 28°, side, explode at 28° and 70°, both sheets, overlays on, all looked at; attach to #118 |
| Q5 | PASS | local: tools/bench · browser bench run; flags under Verification |
| Q6 | PASS | · every row judged |
| Q7 | PASS | · conformance: non-circular-gears at 2.6, pass |

## Joints
| Joint | Type | F1 locate | F2 retain | F3 torque | F4 thrust | F5 limit | F6 hold | F7 adjust | F8 lube | F9 timing | F10 protect |
|---|---|---|---|---|---|---|---|---|---|---|---|
| p1 | J2 | 2 x Dowel pin Ø3 x 10 h6, housing to base | 3 x Internal circlip DIN 472, Ø19; External circlip DIN 471, Ø10; Socket head M5 x 10 (ISO 4762), into the shaft end; Bearing F6800ZZ (10x19x5), floating | Feather key 3 x 3 x 6 (DIN 6885) | Wave washer 14.5x18.8, spring steel; Thrust washer 10.2x16, bronze | – turns fully | – driven through the belt | – nothing to adjust here | – sealed or shielded bearings | – the marks are on the mesh | – see drive |
| p2 | J2 | 2 x Dowel pin Ø3 x 10 h6, housing to base | 3 x Internal circlip DIN 472, Ø19; External circlip DIN 471, Ø10; Shaft collar 10x20, set screw; Bearing F6800ZZ (10x19x5), floating | Feather key 3 x 3 x 6 (DIN 6885) | Wave washer 14.5x18.8, spring steel; Thrust washer 10.2x16, bronze | – turns fully | – driven through the mesh | Eccentric bushing Ø26, 0.3 mm offset bore Ø12, flanged; Eccentric bushing Ø25, 0.3 mm offset bore Ø19, flanged, top of the shaft | – sealed or shielded bearings | – the marks are on the mesh | – see drive |
| mesh-gear1-gear2 | J6 | – located by the shafts | – nothing to retain | 2 x Gear hub Ø22, set screw M3 on the key; 2 x Set screw M3 (DIN 916), threadlocked | – straight teeth, no thrust | – turns fully | – driven through the mesh | Eccentric bushing Ø26, 0.3 mm offset bore Ø12, flanged; Eccentric bushing Ø25, 0.3 mm offset bore Ø19, flanged, top of the shaft | – open teeth greased at assembly | Elliptical gear 1, 26 teeth, hub, rim and 4 spokes; Elliptical gear 2, 26 teeth, hub, rim and 4 spokes | – see drive |
| drive | drive | – | – | – | – | – | – | bracket | – | – | Home flag, 1 mm steel vane; 3 x Fork sensor, slotted optical, 5 mm gap; Pulley flanges |
| p1-p2-bridge-post | post | 2 x spigot | – | – | – | – | – | – | – | – | – |

## Variants and overrides
| Joint or part | Rule result | Chosen | Why |
|---|---|---|---|
| gear teeth | the circular gear's involute, from `P.gear` | straight-flanked rack teeth on the curve's normal at equal arc spacing, cut 0.22 mm thin per flank (model.ts) | the pitch curve is not a circle; straight flanks on a changing curve are not exactly conjugate (K6) |
| layout | driver at F1 (0, 0) | turned 180° about the middle: the driver at x = 80 | the drive's bracket and its screw hole then clear the base edge (M6) |
| gear windows | none | four spokes per gear, R4 fillets | M2: the variable speed starts and slows the mass every turn |
| gear 2's match mark | at the mean pitch radius (rule) | on its short side, at the real mesh radius (polish) | the rule's mark fell outside the short side (F9) |

## Detail ladder
| Rung | Solids | Marks | Frame ms at this dial position |
|---|---|---|---|
| DL-A | 14 | 0 | 2.19 |
| DL-B | 0 | 162 | 1.88 |
| DL-C | 0 | 0 | 1.84 |
| DL-D | 14 | 0 | 1.44 |
| DL-E | 8 | 2 | 1.50 |
| DL-F | 0 | 0 | 1.48 |
| DL-G | 0 | 0 | 1.27 |
| DL-H | 17 | 0 | 1.19 |
| never | 84 | 160 | 2.73 (full) |

## Promotion candidates
- The mesh rules read a gear pair by tooth count and module: a non-circular pair has to be declared as a circular reference pair, and the F9 mark has to be moved by hand. A mesh joint that takes the actual contact point (and a pitch-curve outline helper for the model) would remove both.

## Verification
check: clean · clearance: 0 clashes · clamp: clean · edge distance: clean · package: 20.0 KB
screenshots: plan, 28°, side, explode at 28° and 70°, both sheets, drawn in local Chrome to dist/shots/non-circular-gears/ (plan, 28° and the explode looked at) · bench: browser, DPR 1.5, 2026-10-19; plan 2.22 ms, 28° 2.67 ms, side 2.02 ms, explode 70° 2.21 ms at full detail, 8 ms held at every dial (R6)
