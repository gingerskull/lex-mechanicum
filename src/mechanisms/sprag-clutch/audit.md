# Audit: Sprag clutch (sprag-clutch)
standard: 2.6 · date: 2026-10-19 · result: pass · detail: full · pass: build

## Summary
PASS 107 · FAIL 0 · N/A 14 · open: none

## Requirements
| Id | Status | Evidence / action |
|---|---|---|
| S1 | PASS | DATA · the standard carries version 2.6 and its changelog |
| S2 | PASS | HAND · header with standard, date, result, detail, pass |
| S3 | PASS | AUTO · tools/conformance reads this header and runs in npm run check |
| S4 | PASS | SITE · #144 holds only this mechanism's decisions and open items |
| P1 | PASS | DATA · record complete; model.ts, polish.ts, audit.md present |
| P2 | PASS | DATA · catalogue validator clean (tests/catalog) |
| P3 | PASS | DATA / SITE · ratio unity (1:1 locked), coaxial axes, continuous one-way output, backdrivable only the driving way, other names, family, motion, level, dof 1 locked and 2 overrunning, motorised drive: all in the record |
| P4 | PASS | DATA · tags grouped Function, Property, Application, keywords underneath |
| P5 | PASS | DATA · motion, forces, benefits, limits; uses with one line each |
| P6 | PASS | DATA · Wikipedia and engineering references, a video, an animation, a photo page; real world: the record's YouTube videos checked live through oEmbed on 2026-10-19; the titles cannot show that a sprag clutch is on screen: look at them when convenient |
| P7 | PASS | HAND / SITE · no prose in model.ts or polish.ts besides names, notes and build rules (engineering record, not on the page); lint-style clean |
| P8 | PASS | SITE · no parts list, build or joint sections on the page |
| P9 | PASS | HAND · solve(): the inner race turns u and the outer race follows 1:1 (locked), every sprag at its locking tilt; the record's overrun state (outer race ahead, sprags tipped the other way) needs a second independent input and is not animated: the record says 1:1 in drive, free overrun the other way |
| P10 | PASS | HAND · the path of a sprag centre, velocity of it, input and output spin, a plot of the outer race angle over the inner (slope 1, the locked state) |
| P11 | PASS | DATA · plain, short sentences, no em dashes, mm and degrees |
| K1 | PASS | HAND · the race radii 20 and 28, the 16 sprags and their locking tilt (the end circles touching both races) are the model's; the spider, screws, spring and circlip are fitted round them (check: max link error 0.0e+0 mm) (check: max link error 0.0e+0 mm) |
| K2 | PASS | HAND · check: finite, continuous, periodic over 720 samples |
| K3 | PASS | HAND · only the part family: custom outlines, discs, caps; fixed or at placement with spin |
| K4 | PASS | HAND · roles driver (inner race), output (outer race, spider), link (sprags), pin; accent only on the input cap pO |
| K5 | PASS | HAND · races, sprags on layer 0; the spider on layer 1; check clean: no INTERFERE, OVERLAP or WARN (check: no INTERFERE, OVERLAP or WARN) |
| K6 | PASS | DATA · ri 20, ro 28, 16 sprags, diagonal 8.4 as the catalogue. Deliberate differences, commented in model.ts: the driving state only is animated (overrun needs a second input); a sprag is a stadium 8.4 x 4.4 for the figure-of-eight's contact arcs; the outer race hangs from a spider on the shaft |
| K7 | PASS | HAND · input rotary on the inner race (input rotary on inner) |
| D1 | PASS | HAND · plain races, stadium sprags, a three-armed spider like a carrier; the one family of forms |
| D2 | PASS | HAND · the spider carries the outer race on a hub and three tapered arms: material where the load runs; the races are plain rings |
| D3 | PASS | STYLE · roles told apart by pattern and tone in both sheets (screenshots) |
| D4 | PASS | AUTO · feet and corner holes concentric with the base corner arcs (fired: base (1 solid), feet (4 solids)) |
| D5 | N/A | AUTO / HAND · no bridge: the spider sweeps over the shaft end and the sprags; nothing fixed can span it |
| D6 | PASS | HAND / STYLE · the spring, sleeves, screws and the drive read quieter than the races; the sprags show between the spider's arms |
| D7 | PASS | HAND · races and spider carry only load shape and marks; the richness is in the shaft, bearings, circlips, sprags, spring and screws |
| A1 | PASS | AUTO · pO J2; the sprags and the spider ride on the races and the shaft with no model pin (pO J2; fired: classify (no solids)) |
| A2 | PASS | AUTO · pO a live shaft (accent input, keyed inner race); the spider bored on the shaft (a bearing) (pO J2) |
| A3 | PASS | AUTO · 6800 or F688 on the Ø8 shaft in the housing and in the spider (fired: classify (no solids)) |
| A4 | PASS | AUTO · stepped D-flat input shaft with circlip grooves, run on above the spider (polish) (fired: j1-dead-axle (no solids)) |
| A5 | PASS | AUTO · the Ø8 shaft D-flat, the inner race keyed (fired: j2-live-shaft (32 solids)) |
| A6 | N/A | AUTO · no fixed plate floating above the base: the clutch turns on the shaft (fired: standoffs (no solids)) |
| A7 | PASS | AUTO · 8 mm base, counterbored corners, feet, front scale, clearance hole for every live shaft (fired: base (1 solid), feet (4 solids)) |
| A8 | PASS | AUTO · every head has its shank; holes cut by stage 3 (fired: fasteners (stage 3)) |
| A9 | PASS | AUTO / HAND · the shaft carries the inner race and the spider on a bearing, closed by a circlip above it; the spider sweeps over the shaft end, so it cannot be straddle mounted: the housing's bearings 10 mm apart carry it, the one open point of this build (fired: j2-straddle (no solids)) |
| A10 | PASS | HAND · races and sprags in one plane, the spider above; nothing stacked only to clear |
| A11 | PASS | AUTO / HAND · torque: sprags, inner race, key, shaft, housing, base; the outer race's load: spacer sleeves, spider, bearing, shaft (fired: j1-dead-axle (no solids)) |
| A12 | PASS | AUTO · clamp check clean |
| A13 | PASS | AUTO / HAND · every solid named with catalogue sizes, sets counted (106 solids, 45 unnamed (further items of a listed set)) |
| A14 | PASS | HAND · nothing fixed within the races' sweep; clearance 0 |
| A15 | PASS | AUTO · clearance: 0 clashes over the cycle |
| A16 | PASS | HAND · a note and a badge on every joint, five build rules (5 build rules; no note: none; no badge: none) |
| A17 | PASS | HAND · housing and shaft from below, the inner race with its key, the sprags with the garter spring over them, the outer race over them, the spider on its bearing with three screws, the closing circlip; every screw reachable, bearings pressed out past their circlips |
| E1 | PASS | AUTO · one level per solid (every solid has one explode level; levels -8 to 1.5) |
| E2 | PASS | AUTO · screws, shafts and bought units are groups (24 rigid groups; fired: explode) |
| E3 | PASS | AUTO · screws leave along their axis to the head side, nuts the other way (screenshots at 28° and 70°) (fired: explode) |
| E4 | PASS | HAND · the spider and its screws go furthest up, the outer race, sprags and inner race in the middle, the shaft and housing below: reverse of assembly |
| E5 | PASS | AUTO · bearings and circlips stay in their parts (fired: explode) |
| E6 | PASS | AUTO · motor with its bracket, bearings whole (fired: explode) |
| E7 | PASS | AUTO · spacers midway (fired: explode) |
| E8 | PASS | AUTO · keyed parts keep their order on the shaft (fired: explode) |
| E9 | PASS | HAND · looked at full explode at 28° and 70°, both sheets: nothing inside another part, nothing leaves the frame |
| J1 | N/A | AUTO · no dead axle (fired: j1-dead-axle (no solids)) |
| J2 | PASS | AUTO · input: housing with two bearings, sleeve, wave washer, circlips, dowelled; D-flat shaft, thrust washer, home flag; the spider on its bearing above (fired: j2-live-shaft (32 solids), j2-straddle (no solids)) |
| J3 | N/A | AUTO · no moving pin: the sprags are free blocks between the races (fired: j3-moving-pin (no solids)) |
| J4 | N/A | AUTO · no pin in a slot: the sprags wedge by friction on the races (fired: j4-slot-roller (no solids)) |
| J5 | N/A | AUTO · no slide (fired: j5-slide (no solids)) |
| J6 | N/A | AUTO · no gear mesh (fired: j6-mesh (no solids)) |
| J7 | N/A | AUTO · no cam: the sprags' wedge is a friction contact (its hardened races are the wear faces, M14) (fired: j7-cam (no solids)) |
| J8 | PASS | AUTO · flanged motor pulley, mount slotted for tension (fired: j8-belt (2 solids)) |
| F1 | PASS | AUTO · housing dowelled; the spider located on the shaft by its bearing and on the race by the three sleeves (served at pO; fired: j2-live-shaft (32 solids)) |
| F2 | PASS | AUTO · housing bearings on circlips; the spider's bearing on its internal circlip and a circlip on the shaft above it; the spider's screws; the garter spring in place on the sprags' tops (served at pO; fired: j2-live-shaft (32 solids)) |
| F3 | PASS | AUTO · the inner race keyed to a D-flat shaft with a set screw; the outer race drives through the spider's three screws (served at pO; fired: j2-live-shaft (32 solids)) |
| F4 | PASS | AUTO / HAND · bronze thrust washer under the inner race, wave washers in the housing; no axial thrust (served at pO; fired: j2-live-shaft (32 solids)) |
| F5 | N/A | AUTO / HAND · turns fully, nothing to over-travel (served at no joint; fired: j5-slide (no solids), stops (no solids)) |
| F6 | PASS | AUTO / HAND · the garter spring round the sprags tips them toward engagement, so they wedge as soon as the inner race leads (the clutch's only way of choosing) (served at pO; fired: j7-cam (no solids)) |
| F7 | N/A | AUTO / HAND · no adjustment: the 8.00 mm gap is ground in, the sprags a matched set; belt tension at the motor mount (served at drive; fired: j6-mesh (no solids), j5-slide (no solids)) |
| F8 | PASS | AUTO · the races and sprags greased at assembly (a thin film, μ 0.1); sealed or shielded bearings (served at no joint; fired: lubrication (no solids)) |
| F9 | N/A | AUTO / HAND · no phase: the sixteen sprags are identical, so any assembly angle works (served at no joint; fired: timing-marks (no solids)) |
| F10 | PASS | AUTO / HAND · pulley flanges, home flag, fork sensor; no slip clutch (the clutch is the protection) (served at drive; fired: drive (37 solids)) |
| M1 | PASS | AUTO · edge breaks on every top face (fired: hardware primitives) |
| M2 | N/A | HAND · the races are plain rings at steady speed, and the spider is already arms; nothing to lighten |
| M3 | PASS | AUTO · bore entry chamfers on every seat and through hole (fired: j3-moving-pin (no solids), hardware primitives) |
| M4 | PASS | AUTO / HAND · counterbored base corners and housing screws; button heads on the spider need no seat (fired: base (1 solid), fasteners (stage 3)) |
| M5 | N/A | AUTO / HAND · no pockets or windows (fired: hardware primitives) |
| M6 | PASS | AUTO · edge distance and walls clean |
| M7 | N/A | HAND · no bracket or plate with a loaded inside corner: the spider's arms are tapered bars |
| M8 | PASS | AUTO · thread undercut on the shoulder bolts and axles (fired: j1-dead-axle (no solids)) |
| M9 | PASS | AUTO / HAND · spider screws M3 into 5 mm of the steel race rim (over 1 d); post screws as the rules (fired: j1-dead-axle (no solids)) |
| M10 | PASS | AUTO / HAND · hardened ground steel races and sprags, steel spider, spring steel garter, aluminium base, bronze washer (106 of 106 solids name a material) |
| M11 | PASS | AUTO · centre holes and chamfered ends on the shafts (fired: j1-dead-axle (no solids), hardware primitives) |
| M12 | PASS | HAND · every head reachable; bearings pressed out past their circlips |
| M13 | PASS | AUTO / HAND · threadlocker on every screw, nyloc where a nut, set screws low strength (30 threaded, 0 without a locking method) |
| M14 | PASS | AUTO / HAND · the sprags are a replaceable matched set of separate hardened blocks; the races are hardened and ground (fired: j4-slot-roller (no solids)) |
| V1 | PASS | AUTO · pancake outrunner Ø50 x 18 under the base, GT2 32:16 (fired: drive (37 solids)) |
| V2 | PASS | AUTO · one-piece bracket, flange screws up into the base (fired: drive (37 solids)) |
| V3 | PASS | AUTO / HAND · belt and pulleys clear of feet and housing; clearance 0 (fired: drive (37 solids)) |
| V4 | PASS | AUTO · flanges, set screws, slotted mount (fired: j8-belt (2 solids)) |
| V5 | PASS | AUTO · rotary: belt to the input pulley on the shaft (fired: drive (37 solids)) |
| V6 | PASS | AUTO · home flag, fork sensor, leads to the terminal block, P-clip (fired: drive (37 solids)) |
| L1 | PASS | STYLE · lint-style clean |
| L2 | PASS | HAND · model and polish carry geometry, roles, marks and materials only |
| L3 | PASS | HAND · inner race driver, outer race and spider output, sprags link, hardware hw |
| L4 | PASS | HAND / STYLE · accent on the input cap only |
| L5 | PASS | AUTO / HAND · screws, bearings, sleeves and the spring are real solids in real holes; the sprags show between the spider's arms (fired: see-through) |
| L6 | PASS | AUTO · depth order right at plan, 28°, side and explode in both sheets |
| L7 | PASS | STYLE · tilt 0° to 88°, no shear |
| L8 | PASS | AUTO / HAND · match marks and tapped-hole rings are marks |
| R1 | PASS | HAND · the polish reuses H.shaft, H.circlip, H.tube, H.screw, H.spring and H.boltCircle; no inline standard part |
| R2 | PASS | HAND · threads M2.5, M3, M4; shaft Ø8; bearings from the table (threads M3, M4; joint Ø 8; bearings 688-2RS (8x16x5), F688ZZ (8x16x5)) |
| R3 | PASS | AUTO · housing, bridge and drive from their subassemblies (fired: hardware primitives) |
| R4 | PASS | AUTO · package built at build time (package 17.5 KB) |
| R5 | PASS | HAND · states only what differs; polish about 1 ms |
| R6 | PASS | FLAG · FLAG: browser bench 2026-10-19: plan 1.70, 28° 2.23, side 1.60, explode 2.03 ms at full detail; setup 8.1 ms; under the 8 ms target at every dial position |
| R7 | PASS | HAND · model.ts + polish.ts 10.5 KB |
| R8 | PASS | AUTO / SITE · pre-rendered thumbnails; the stage draws on change only |
| DL1 | PASS | AUTO / HAND · every solid and mark on a rung (34 of 106 solids on a dropping rung) |
| DL2 | PASS | HAND · default dial full (model detail full) |
| DL3 | PASS | AUTO · DL-D drawn when exploded, DL-B skipped at side elevation |
| DL4 | PASS | SITE · adaptive dial and the detail entry in the title block |
| DL5 | PASS | FLAG · FLAG: rung counts and frame times in the detail ladder below |
| Q1 | PASS | check, clamp and edge distance clean |
| Q2 | PASS | 0 clashes |
| Q3 | PASS | package written, 17.5 KB; site build not checked here · package written; site build left to CI |
| Q4 | PASS | local: tools/shot · plan, 28°, side, explode at 28° and 70°, both sheets, overlays on, all looked at; attach to #144 |
| Q5 | PASS | local: tools/bench · browser bench run; flags under Verification |
| Q6 | PASS | · every row judged |
| Q7 | PASS | · conformance: sprag-clutch at 2.6, pass |

## Joints
| Joint | Type | F1 locate | F2 retain | F3 torque | F4 thrust | F5 limit | F6 hold | F7 adjust | F8 lube | F9 timing | F10 protect |
|---|---|---|---|---|---|---|---|---|---|---|---|
| pO | J2 | 2 x Dowel pin Ø3 x 10 h6, housing to base | 3 x Internal circlip DIN 472, Ø16; Bearing F688ZZ (8x16x5); Socket head M4 x 8 (ISO 4762), into the shaft end; External circlip DIN 471, Ø8 | Input shaft Ø8 h6, D-flat | Wave washer 12x15.8, spring steel; Thrust washer 8.2x14, bronze | – turns fully | Garter spring, steel wire ring Ø0.8, round the sprags | – belt tension at the motor mount | – sealed and shielded bearings | – no phase | – see drive |
| drive | drive | – | – | – | – | – | – | bracket | – | – | Home flag, 1 mm steel vane; 3 x Fork sensor, slotted optical, 5 mm gap; Pulley flanges |

## Variants and overrides
| Joint or part | Rule result | Chosen | Why |
|---|---|---|---|
| sprags | figure-of-eight blocks with contact arcs | stadiums 8.4 x 4.4, end circles touching both races, 16 at the locking tilt | the model shows the driving state (K6) |
| overrun | two-DOF: the outer race running ahead | not animated | needs a second independent input; the notes and F6 describe it |
| outer race support | none given | a three-armed spider on the shaft's own bearing, the shaft run on up through it with a closing circlip | the races must keep their 8 mm gap (A9) |
| garter spring | a spring tilting all sprags | a wire ring on the sprags' tops (polish) | F6 |

## Detail ladder
| Rung | Solids | Marks | Frame ms at this dial position |
|---|---|---|---|
| DL-A | 8 | 0 | 2.05 |
| DL-B | 0 | 102 | 1.55 |
| DL-C | 0 | 0 | 1.41 |
| DL-D | 12 | 0 | 1.41 |
| DL-E | 8 | 0 | 1.47 |
| DL-F | 0 | 0 | 1.40 |
| DL-G | 0 | 0 | 1.36 |
| DL-H | 6 | 0 | 1.17 |
| never | 72 | 81 | 2.01 (full) |

## Promotion candidates
- A model with two independent inputs (a clutch, a differential, a freewheel) has no way to show overrun: an `overrun` phase of the cycle driven by a second part's `solve` (an input kind `two`) would let the sprag clutch, the freewheel and the differential show both states.
- The shaft run-on above a bored part's bearing (the spider here, the planetary's upper carrier plate) is hand-built each time: the J2 rule should extend the shaft past a top bored part.

## Verification
check: clean · clearance: 0 clashes · clamp: clean · edge distance: clean · package: 17.5 KB
screenshots: plan, 28°, side, explode at 28° and 70°, both sheets, drawn in local Chrome to dist/shots/sprag-clutch/ (plan, 28° and the explode looked at) · bench: browser, DPR 1.5, 2026-10-19; plan 1.70 ms, 28° 2.23 ms, side 1.60 ms, explode 70° 2.03 ms at full detail, 8 ms held at every dial (R6)
