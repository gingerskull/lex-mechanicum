# Audit: Face groove cam (face-groove-cam)
standard: 2.6 · date: 2026-10-19 · result: pass · detail: full · pass: build

## Summary
PASS 112 · FAIL 0 · N/A 9 · open: none

## Requirements
| Id | Status | Evidence / action |
|---|---|---|
| S1 | PASS | DATA · the standard carries version 2.6 and its changelog |
| S2 | PASS | HAND · header with standard, date, result, detail, pass |
| S3 | PASS | AUTO · tools/conformance reads this header and runs in npm run check |
| S4 | PASS | SITE · #126 holds only this mechanism's decisions and open items |
| P1 | PASS | DATA · record complete; model.ts, polish.ts, audit.md present |
| P2 | PASS | DATA · catalogue validator clean (tests/catalog) |
| P3 | PASS | DATA / SITE · ratio none (a radial travel of 20 mm), skew motion to linear, continuous reciprocating output with dwells, not backdrivable by the follower, other names, family, motion, level, dof 1, motorised drive: all in the record |
| P4 | PASS | DATA · tags grouped Function, Property, Application, keywords underneath |
| P5 | PASS | DATA · motion, forces, benefits, limits; uses with one line each |
| P6 | PASS | DATA · Wikipedia and engineering references, a video, an animation, a photo page; real world: the record's YouTube videos checked live through oEmbed on 2026-10-19; the titles cannot show that the groove cam is on screen: look at them when convenient |
| P7 | PASS | HAND / SITE · no prose in model.ts or polish.ts besides names, notes and build rules (engineering record, not on the page); lint-style clean |
| P8 | PASS | SITE · no parts list, build or joint sections on the page |
| P9 | PASS | HAND · solve(): the disc turns u, the roller rises 20 mm over 120° (3-4-5 law), dwells 60°, returns over 120°, dwells 60°; the record says the same; the pressure angle at most about 24° |
| P10 | PASS | HAND · the path of the roller centre (a radial line), velocity of it, input spin, the groove's push, the pressure angle, a plot of the follower lift over the cam angle |
| P11 | PASS | DATA · plain, short sentences, no em dashes, mm and degrees |
| K1 | PASS | HAND · the pitch curve r = 35 + s, the groove width 10.2 and the walls offset ±5.1 are the model's; screws, spacer, roller and marks are fitted round them (check: max link error 0.0e+0 mm) (check: max link error 0.0e+0 mm) |
| K2 | PASS | HAND · check: finite, continuous, periodic over 720 samples |
| K3 | PASS | HAND · only the part family: custom outlines, rails, caps; fixed or at placement with spin |
| K4 | PASS | HAND · roles driver (disc plates), output (follower), ground (rails), pin; accent only on the input cap pO |
| K5 | PASS | HAND · base disc on layer 0 (10 thick), ring and island on layer 1, follower and rails on layer 2; check clean: no INTERFERE, OVERLAP or WARN (check: no INTERFERE, OVERLAP or WARN) |
| K6 | PASS | DATA · rb 35, h 20, R 75, β 120/60/120/60, 3-4-5 law, groove 10.2, roller Ø10: as the catalogue. Deliberate differences, commented in model.ts: the groove is cut as a ring and an island on a base disc (a blind groove cannot be one outline); the roller is the polish's, Ø9.7 in the groove; the follower is an arm over the disc |
| K7 | PASS | HAND · input rotary on the base disc (input rotary on camBase) |
| D1 | PASS | HAND · a disc with a groove between a ring and an island, a keyed bore, a follower arm and carriage on twin rails; the one family of forms |
| D2 | PASS | HAND · the disc is a base plate with two hardened plates on it: material where the groove is cut; the follower's arm is a tapered bar |
| D3 | PASS | STYLE · roles told apart by pattern and tone in both sheets (screenshots) |
| D4 | PASS | AUTO · feet and corner holes concentric with the base corner arcs (fired: base (1 solid), feet (4 solids)) |
| D5 | PASS | AUTO / HAND · a bridge over the cam's shaft, shaped by H.bridge on spigoted posts (the cam straddle mounted); nothing sweeps over the cam |
| D6 | PASS | HAND / STYLE · the bridge, oiler, spring and screws read quieter than the cam; the bridge is see-through over the profile |
| D7 | PASS | HAND · cam and follower carry only load shape and marks; the richness is in the shaft, bearings, ring, spring, keeper and marks |
| A1 | PASS | AUTO · pO J2, slide-follower J5; the roller rides on the follower with no model pin (pO J2, slide-follower J5; fired: classify (no solids)) |
| A2 | PASS | AUTO · pO a live shaft (accent input, keyed base disc); the follower on rails (pO J2, slide-follower J5) |
| A3 | PASS | AUTO · 6800 on the Ø8 shaft in the housing and in the bridge (fired: classify (no solids)) |
| A4 | PASS | AUTO · stepped D-flat input shaft with circlip grooves (fired: j1-dead-axle (no solids)) |
| A5 | PASS | AUTO · the Ø8 shaft D-flat for the cam bore (fired: j2-live-shaft (26 solids)) |
| A6 | PASS | AUTO · the rails sit on risers screwed to the base; the housing and the bridge as the rules (fired: standoffs (12 solids)) |
| A7 | PASS | AUTO · 8 mm base, counterbored corners, feet, front scale, clearance hole for every live shaft (fired: base (1 solid), feet (4 solids)) |
| A8 | PASS | AUTO · every head has its shank; holes cut by stage 3 (fired: fasteners (stage 3)) |
| A9 | PASS | AUTO / HAND · the shaft straddle mounted: housing below, a floating bearing in a bridge over the disc above (the follower's arm runs along the +x axis, clear of the bridge); the follower slides between rails with a keeper over it (fired: j2-straddle (no solids)) |
| A10 | PASS | HAND · cam and follower in one plane, the bridge above; nothing stacked only to clear |
| A11 | PASS | AUTO / HAND · the groove's push: roller, bearing, stud, arm, rails, risers, base; the disc's torque: key, shaft, two bearings, housing, bridge posts, base (fired: j1-dead-axle (no solids)) |
| A12 | PASS | AUTO · clamp check clean |
| A13 | PASS | AUTO / HAND · every solid named with catalogue sizes, sets counted (137 solids, 72 unnamed (further items of a listed set)) |
| A14 | PASS | HAND · posts outside the disc's sweep (radius 75); clearance 0 |
| A15 | PASS | AUTO · clearance: 0 clashes over the cycle |
| A16 | PASS | HAND · a note and a badge on every joint, five build rules (5 build rules; no note: none; no badge: none) |
| A17 | PASS | HAND · housing and shaft from below, the base disc with its key, the island and the ring screwed on, the follower between the rails with the roller in the groove, the bridge last; every screw reachable, bearings pressed out past their circlips |
| E1 | PASS | AUTO · one level per solid (every solid has one explode level; levels -8 to 3.5) |
| E2 | PASS | AUTO · screws, shafts and bought units are groups (39 rigid groups; fired: explode) |
| E3 | PASS | AUTO · screws leave along their axis to the head side, nuts the other way (screenshots at 28° and 70°) (fired: explode) |
| E4 | PASS | HAND · the bridge and its screws go furthest up, cam and follower in the middle, housing and shaft below: reverse of assembly |
| E5 | PASS | AUTO · bearings and circlips stay in their parts (fired: explode) |
| E6 | PASS | AUTO · motor with its bracket, bearings whole (fired: explode) |
| E7 | PASS | AUTO · spacers midway (fired: explode) |
| E8 | PASS | AUTO · keyed parts keep their order on the shaft (fired: explode) |
| E9 | PASS | HAND · looked at full explode at 28° and 70°, both sheets: nothing inside another part, nothing leaves the frame |
| J1 | N/A | AUTO · no dead axle: the cam turns on a live shaft (fired: j1-dead-axle (no solids)) |
| J2 | PASS | AUTO · input: housing with two bearings, sleeve, wave washer, circlips, dowelled; D-flat shaft, thrust washer, home flag; straddle mounted in the bridge (fired: j2-live-shaft (26 solids), j2-straddle (no solids)) |
| J3 | N/A | AUTO · no moving pin (fired: j3-moving-pin (no solids)) |
| J4 | N/A | AUTO · no pin in a slot: the roller in the groove is the cam contact, and its walls are the screwed hardened plates (M14) (fired: j4-slot-roller (no solids)) |
| J5 | PASS | AUTO · the follower between two rails: a reference rail dowelled, a keeper with a gib on the other, wipers, a nipple, end stops (fired: j5-slide (9 solids)) |
| J6 | N/A | AUTO · no gear mesh (fired: j6-mesh (no solids)) |
| J7 | N/A | AUTO · no J7 follower train: form-closed (the groove), so no spring, guide or preload screw; the roller is the polish's (fired: j7-cam (no solids)) |
| J8 | PASS | AUTO · flanged motor pulley, mount slotted for tension (fired: j8-belt (2 solids)) |
| F1 | PASS | AUTO · housing dowelled; the reference rail dowelled; the bridge on two spigoted posts (served at pO, railb-seat, pO-bridge-post; fired: j2-live-shaft (26 solids)) |
| F2 | PASS | AUTO · housing bearings on circlips; the keeper holds the slider down; the ring and island screwed to the disc; the roller on its stud with the screw head and a spacer; end retainer (served at pO, slide-follower; fired: j2-live-shaft (26 solids)) |
| F3 | PASS | AUTO · the base disc keyed to a D-flat shaft with a set screw; the follower guided by the rails; the roller turns free on its bearing (served at pO; fired: j2-live-shaft (26 solids)) |
| F4 | PASS | AUTO / HAND · bronze thrust washers on the shaft, wave washers in the housing; straight faces carry no axial thrust (served at pO; fired: j2-live-shaft (26 solids)) |
| F5 | PASS | AUTO / HAND · end stop blocks with neoprene at each end of the follower's travel (J5) (served at slide-follower; fired: j5-slide (9 solids), stops (no solids)) |
| F6 | N/A | AUTO / HAND · form-closed: the groove holds the follower at every angle, no spring needed (served at no joint; fired: j7-cam (no solids)) |
| F7 | PASS | AUTO / HAND · the gib clamped by the keeper's screws sets the follower's side play; belt tension at the motor mount; the roller runs 0.15 mm clear in the groove (served at slide-follower, drive; fired: j6-mesh (no solids), j5-slide (9 solids)) |
| F8 | PASS | AUTO · wipers and a nipple on the slide; the groove greased at assembly; bearings sealed or shielded; the bridge's oil sinks (served at slide-follower; fired: lubrication (no solids)) |
| F9 | PASS | AUTO / HAND · a zero line on the base disc and an index on the base (polish): the disc goes back in phase at the start of the rise (served at pO; fired: timing-marks (no solids)) |
| F10 | PASS | AUTO / HAND · pulley flanges, home flag, fork sensor; no slip clutch (none planned) (served at drive; fired: drive (37 solids)) |
| M1 | PASS | AUTO · edge breaks on every top face (fired: hardware primitives) |
| M2 | N/A | HAND · the disc turns at a steady speed (no start, stop or reversal) and its plates are screwed down on a solid base: lightening would take the screw seats; its mass is small |
| M3 | PASS | AUTO · bore entry chamfers on every seat and through hole (fired: j3-moving-pin (no solids), hardware primitives) |
| M4 | PASS | AUTO / HAND · counterbored base corners and housing screws; button heads on the plates need no seat (fired: base (1 solid), fasteners (stage 3)) |
| M5 | N/A | AUTO / HAND · no pockets or windows (fired: hardware primitives) |
| M6 | PASS | AUTO · edge distance and walls clean |
| M7 | N/A | HAND · no bracket or plate with a loaded inside corner |
| M8 | PASS | AUTO · thread undercut on the shoulder bolts and axles (fired: j1-dead-axle (no solids)) |
| M9 | PASS | AUTO / HAND · plate screws M3 into 6 mm of steel base disc (2 d); roller screw M4 through the arm into the roller's stud; post screws as the rules (fired: j1-dead-axle (no solids)) |
| M10 | PASS | AUTO / HAND · case-hardened steel base disc, hardened tool steel ring and island, hardened roller, bronze spacer and gib, aluminium base (137 of 137 solids name a material) |
| M11 | PASS | AUTO · centre holes and chamfered ends on the shafts (fired: j1-dead-axle (no solids), hardware primitives) |
| M12 | PASS | HAND · every head reachable; bearings pressed out past their circlips |
| M13 | PASS | AUTO / HAND · threadlocker on every screw, nyloc where a nut, set screws low strength (62 threaded, 0 without a locking method) |
| M14 | PASS | AUTO / HAND · the groove's walls are the hardened ring and island, screwed on and replaceable; the roller and the slide's gib and rails are the other wear parts (fired: j4-slot-roller (no solids)) |
| V1 | PASS | AUTO · pancake outrunner Ø50 x 18 under the base, GT2 32:16 (fired: drive (37 solids)) |
| V2 | PASS | AUTO · one-piece bracket, flange screws up into the base (fired: drive (37 solids)) |
| V3 | PASS | AUTO / HAND · belt and pulleys clear of feet and housing; clearance 0 (fired: drive (37 solids)) |
| V4 | PASS | AUTO · flanges, set screws, slotted mount (fired: j8-belt (2 solids)) |
| V5 | PASS | AUTO · rotary: belt to the input pulley on the cam's shaft (fired: drive (37 solids)) |
| V6 | PASS | AUTO · home flag, fork sensor, leads to the terminal block, P-clip (fired: drive (37 solids)) |
| L1 | PASS | STYLE · lint-style clean |
| L2 | PASS | HAND · model and polish carry geometry, roles, marks and materials only |
| L3 | PASS | HAND · cam driver, follower output, rails ground, hardware hw |
| L4 | PASS | HAND / STYLE · accent on the input cap only |
| L5 | PASS | AUTO / HAND · screws, bearings and the ring are real solids in real holes; the bridge is drawn see-through over the cam (fired: see-through) |
| L6 | PASS | AUTO · depth order right at plan, 28°, side and explode in both sheets |
| L7 | PASS | STYLE · tilt 0° to 88°, no shear |
| L8 | PASS | AUTO / HAND · match marks and tapped-hole rings are marks |
| R1 | PASS | HAND · the polish reuses H.roller, H.tube, H.screw and straddle; no inline standard part |
| R2 | PASS | HAND · threads M3, M4, M5; shaft Ø8; bearings from the table (threads M3, M4, M5; joint Ø 8; bearings 688-2RS (8x16x5), F688ZZ (8x16x5), floating) |
| R3 | PASS | AUTO · housing, bridge and drive from their subassemblies (fired: hardware primitives) |
| R4 | PASS | AUTO · package built at build time (package 22.2 KB) |
| R5 | PASS | HAND · states only what differs; polish about 1 ms |
| R6 | PASS | FLAG · FLAG: browser bench 2026-10-19: plan 2.17, 28° 2.94, side 1.92, explode 2.45 ms at full detail; setup 8.8 ms; under the 8 ms target at every dial position |
| R7 | PASS | HAND · model.ts + polish.ts 10.8 KB |
| R8 | PASS | AUTO / SITE · pre-rendered thumbnails; the stage draws on change only |
| DL1 | PASS | AUTO / HAND · every solid and mark on a rung (40 of 137 solids on a dropping rung) |
| DL2 | PASS | HAND · default dial full (model detail full) |
| DL3 | PASS | AUTO · DL-D drawn when exploded, DL-B skipped at side elevation |
| DL4 | PASS | SITE · adaptive dial and the detail entry in the title block |
| DL5 | PASS | FLAG · FLAG: rung counts and frame times in the detail ladder below |
| Q1 | PASS | check, clamp and edge distance clean |
| Q2 | PASS | 0 clashes |
| Q3 | PASS | package written, 22.2 KB; site build not checked here · package written; site build left to CI |
| Q4 | PASS | local: tools/shot · plan, 28°, side, explode at 28° and 70°, both sheets, overlays on, all looked at; attach to #126 |
| Q5 | PASS | local: tools/bench · browser bench run; flags under Verification |
| Q6 | PASS | · every row judged |
| Q7 | PASS | · conformance: face-groove-cam at 2.6, pass |

## Joints
| Joint | Type | F1 locate | F2 retain | F3 torque | F4 thrust | F5 limit | F6 hold | F7 adjust | F8 lube | F9 timing | F10 protect |
|---|---|---|---|---|---|---|---|---|---|---|---|
| pO | J2 | 2 x Dowel pin Ø3 x 10 h6, housing to base | 3 x Internal circlip DIN 472, Ø16; Socket head M4 x 8 (ISO 4762), into the shaft end; External circlip DIN 471, Ø8; Bearing F688ZZ (8x16x5), floating | Input shaft Ø8 h6, D-flat | Wave washer 12x15.8, spring steel; Thrust washer 8.2x14, bronze | – turns fully | – driven through the belt | – belt tension at the motor mount | – sealed and shielded bearings | Cam disc, base plate; Base plate | – see drive |
| slide-follower | J5 | Reference rail dowelled | Keeper plate, holds the slider down | – guided by the rails | – no axial thrust | End stop block, hardened | – driven through the mesh; no rest position to hold | Gib strip 71 x 7 x 1.3, bronze, slotted, clamped under the keeper | 2 x wiper; Grease nipple M6 (DIN 71412) | – no phase | – nothing to protect |
| raila-seat | post | – | – | – | – | – | – | – | – | – | – |
| railb-seat | post | 2 x Dowel pin Ø3 h6 (ISO 8734), rail to base | – | – | – | – | – | – | – | – | – |
| drive | drive | – | – | – | – | – | – | bracket | – | – | Home flag, 1 mm steel vane; 3 x Fork sensor, slotted optical, 5 mm gap; Pulley flanges |
| pO-bridge-post | post | 2 x spigot | – | – | – | – | – | – | – | – | – |

## Variants and overrides
| Joint or part | Rule result | Chosen | Why |
|---|---|---|---|
| disc | one part with a groove | a base disc, a ring (the outer wall) and an island (the inner wall) screwed on it (model, polish) | a groove in a face is blind: one outline cannot hold an island (K6) |
| roller | a part | the polish's track roller on a stud in the follower's arm, on a spacer (polish) | a Ø10 roller has no room for the rules' bearing in a part of its size (A3) |
| cam shaft | cantilevered, the cam over its end | straddle mounted, a bridge over the disc (polish) | nothing sweeps over the axis (A9) |
| follower train | spring, guide, key by the J7 rule | none: the cam is form-closed and declares no contact | the groove holds the roller both ways |

## Detail ladder
| Rung | Solids | Marks | Frame ms at this dial position |
|---|---|---|---|
| DL-A | 8 | 0 | 2.53 |
| DL-B | 0 | 136 | 1.90 |
| DL-C | 0 | 0 | 1.75 |
| DL-D | 9 | 0 | 1.62 |
| DL-E | 11 | 2 | 1.60 |
| DL-F | 0 | 0 | 1.86 |
| DL-G | 0 | 0 | 1.38 |
| DL-H | 12 | 0 | 1.34 |
| never | 97 | 108 | 2.88 (full) |

## Promotion candidates
- A form-closed groove cam is two or three plates on a base: a primitive `H.groovePlates` (outer wall, inner wall, base, screws) would remove the by-hand split.
- The roller in a groove is the polish's solid: a model part of a size the rules can bear is needed for a roller under 12 mm.

## Verification
check: clean · clearance: 0 clashes · clamp: clean · edge distance: clean · package: 22.2 KB
screenshots: plan, 28°, side, explode at 28° and 70°, both sheets, drawn in local Chrome to dist/shots/face-groove-cam/ (plan, 28° and the explode looked at) · bench: browser, DPR 1.5, 2026-10-19; plan 2.17 ms, 28° 2.94 ms, side 1.92 ms, explode 70° 2.45 ms at full detail, 8 ms held at every dial (R6)
