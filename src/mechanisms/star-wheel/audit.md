# Audit: Star wheel and pin (star-wheel)
standard: 2.6 · date: 2026-10-19 · result: pass · detail: full · pass: build

## Summary
PASS 112 · FAIL 0 · N/A 9 · open: none

## Requirements
| Id | Status | Evidence / action |
|---|---|---|
| S1 | PASS | DATA · the standard carries version 2.6 and its changelog |
| S2 | PASS | HAND · header with standard, date, result, detail, pass |
| S3 | PASS | AUTO · tools/conformance reads this header and runs in npm run check |
| S4 | PASS | SITE · #121 holds only this mechanism's decisions and open items |
| P1 | PASS | DATA · record complete; model.ts, polish.ts, audit.md present |
| P2 | PASS | DATA · catalogue validator clean (tests/catalog) |
| P3 | PASS | DATA / SITE · ratio index step (36° per driver turn), parallel axes, intermittent dwelling one-way output, backdrivable, other names, family, motion, level, dof 1, motorised drive: all in the record |
| P4 | PASS | DATA · tags grouped Function, Property, Application, keywords underneath |
| P5 | PASS | DATA · motion, forces, benefits, limits; uses with one line each |
| P6 | PASS | DATA · Wikipedia and engineering references, a video, an animation, a photo page; real world: the record's YouTube video checked live through oEmbed on 2026-10-19; the title cannot show that the star wheel is on screen: look at it when convenient |
| P7 | PASS | HAND / SITE · no prose in model.ts or polish.ts besides names, notes and build rules (engineering record, not on the page); lint-style clean |
| P8 | PASS | SITE · no parts list, build or joint sections on the page |
| P9 | PASS | HAND · solve(): the finger pushes the star clockwise ahead of it (23.5° of the 36°), then the jumper snaps it on to the next detent over 30° of the driver; the record says 36° per driver turn, the finger engaging about 60° of driver angle with the snap |
| P10 | PASS | HAND · the path of the finger, velocity of it, input spin, a plot of the star angle over the driver angle (a step) |
| P11 | PASS | DATA · plain, short sentences, no em dashes, mm and degrees |
| K1 | PASS | HAND · the finger circle R12, the centres 28 apart, the jumper's pivot and length and the star's teeth are the model's; screws, spring, spacer and marks are fitted round them (check: max link error 3.6e-15 mm) (check: max link error 3.6e-15 mm) |
| K2 | PASS | HAND · check: finite, continuous, periodic over 720 samples |
| K3 | PASS | HAND · only the part family: custom outlines, discs, links, caps; fixed or at placement with spin |
| K4 | PASS | HAND · roles driver (driver disc), output (star), link (finger, jumper, roller), pin; accent only on the input cap pO1 |
| K5 | PASS | HAND · driver and jumper on layer -1, the star, finger and roller on layer 0; check clean: no INTERFERE, OVERLAP or WARN (check: no INTERFERE, OVERLAP or WARN) |
| K6 | PASS | DATA · N 10, c 28, rf 12, tip 20, jumper 22: as the catalogue. Deliberate differences, commented in model.ts: root radius 13 for 14 (the finger runs 16 from the star centre and needs a gap wide enough for a Ø3 pin with 0.3 mm of play); roller Ø5.6 for Ø4 (no room for its stud); the layout turned 180° so the drive's bracket clears the base edge; the two phases simulated |
| K7 | PASS | HAND · input rotary on the driver (input rotary on driver) |
| D1 | PASS | HAND · straight-flanked star teeth, a plain driver disc with its finger, a tapered jumper with boss rings, a roller on a screw; the one family of forms |
| D2 | PASS | HAND · the star is a small solid wheel; the jumper's arm is tapered from boss to boss; no lightening needed |
| D3 | PASS | STYLE · roles told apart by pattern and tone in both sheets (screenshots) |
| D4 | PASS | AUTO · feet and corner holes concentric with the base corner arcs (fired: base (1 solid), feet (3 solids)) |
| D5 | PASS | AUTO / HAND · a bridge over the star's axle and the driver's shaft (a roller tip would pass under it: the jumper pivot is left free, single support); nothing sweeps over the star |
| D6 | PASS | HAND / STYLE · bridges, spring, screws and the drive read quieter than the star; the bridge is see-through over the star |
| D7 | PASS | HAND · star and driver carry only load shape and marks; the richness is in the shafts, bearings, screws, spring and marks |
| A1 | PASS | AUTO · pO1 J2, pO2 J1, pJ J1; the finger and roller ride on their parts with no model pin (pO1 J2, pO2 J1, pJ J1; fired: classify (no solids)) |
| A2 | PASS | AUTO · pO1 a live shaft (accent input, keyed driver); the star and the jumper on dead axles (pO1 J2, pO2 J1, pJ J1) |
| A3 | PASS | AUTO · 6800 on the Ø10 driver shaft in the housing; bearings on the star's and the jumper's axles (fired: classify (no solids)) |
| A4 | PASS | AUTO · stepped keyed driver shaft with circlip grooves; axles shoulder bolts with undercut (fired: j1-dead-axle (41 solids)) |
| A5 | PASS | AUTO · feather key 3 x 3 on the Ø10 driver shaft, the driver keyed (fired: j2-live-shaft (27 solids)) |
| A6 | N/A | AUTO · no fixed plate floating above the base: the bridge stands on spigoted posts (fired: standoffs (no solids)) |
| A7 | PASS | AUTO · 8 mm base, counterbored corners, feet, front scale, clearance hole for every live shaft (fired: base (1 solid), feet (3 solids)) |
| A8 | PASS | AUTO · every head has its shank; holes cut by stage 3 (fired: fasteners (stage 3)) |
| A9 | PASS | AUTO / HAND · the star's axle held in the base and by a bridge over it (double support); the jumper's pivot single support with the roller's tip free (a bridge would meet the roller's screw as it swings), overhang 1.5 mm (fired: j2-straddle (no solids)) |
| A10 | PASS | HAND · the star, finger and roller in one plane; the driver and the jumper under them; nothing stacked only to clear |
| A11 | PASS | AUTO / HAND · the star's load: tooth, bearing, axle, bridge, posts, base; the finger's: driver, key, shaft, housing; the jumper's: arm, bearing, axle, base (fired: j1-dead-axle (41 solids)) |
| A12 | PASS | AUTO · clamp check clean |
| A13 | PASS | AUTO / HAND · every solid named with catalogue sizes, sets counted (123 solids, 56 unnamed (further items of a listed set)) |
| A14 | PASS | HAND · posts and spring post outside every sweep; clearance 0 |
| A15 | PASS | AUTO · clearance: 0 clashes over the cycle |
| A16 | PASS | HAND · a note and a badge on every joint, five build rules (5 build rules; no note: none; no badge: none) |
| A17 | PASS | HAND · housing and driver shaft from below with the driver and its finger pin, the star on its axle under the bridge, the jumper on its pivot with the roller on its screw, the spring on its post last; every screw reachable, bearings pressed out past their circlips |
| E1 | PASS | AUTO · one level per solid (every solid has one explode level; levels -8 to 3) |
| E2 | PASS | AUTO · screws, shafts and bought units are groups (31 rigid groups; fired: explode) |
| E3 | PASS | AUTO · screws leave along their axis to the head side, nuts the other way (screenshots at 28° and 70°) (fired: explode) |
| E4 | PASS | HAND · bridges, spring and the roller screw go furthest up, star and finger in the middle, driver and jumper below: reverse of assembly |
| E5 | PASS | AUTO · bearings and circlips stay in their parts (fired: explode) |
| E6 | PASS | AUTO · motor with its bracket, bearings whole (fired: explode) |
| E7 | PASS | AUTO · spacers midway (fired: explode) |
| E8 | PASS | AUTO · keyed parts keep their order on the shaft (fired: explode) |
| E9 | PASS | HAND · looked at full explode at 28° and 70°, both sheets: nothing inside another part, nothing leaves the frame |
| J1 | PASS | AUTO · star axle and jumper pivot: shouldered, bearings, spacers, circlips, thrust washers; the star's under a bridge on spigoted posts, the jumper's free (fired: j1-dead-axle (41 solids)) |
| J2 | PASS | AUTO · driver: housing with two bearings, sleeve, wave washer, circlips, dowelled; keyed shaft, end retainer, thrust washer, home flag (fired: j2-live-shaft (27 solids), j2-straddle (no solids)) |
| J3 | N/A | AUTO · no moving pin: the roller turns on a screw (hand-built) (fired: j3-moving-pin (no solids)) |
| J4 | N/A | AUTO · no such joint here (fired: j4-slot-roller (no solids)) |
| J5 | N/A | AUTO · no such joint here (fired: j5-slide (no solids)) |
| J6 | N/A | AUTO · no gear mesh: the finger and the roller work on the star's flanks (fired: j6-mesh (no solids)) |
| J7 | N/A | AUTO · no such joint here (fired: j7-cam (no solids)) |
| J8 | PASS | AUTO · flanged motor pulley, mount slotted for tension (fired: j8-belt (2 solids)) |
| F1 | PASS | AUTO · housing dowelled; the bridge on two spigoted posts; the finger pressed into the driver (served at pO1, pO2, pO2-bridge-post; fired: j2-live-shaft (27 solids)) |
| F2 | PASS | AUTO · housing bearings on circlips; the axle bearings circlipped; the roller held by the M2 screw head; the finger pressed and threadlocked; end retainer (served at pO1, pO2, pJ; fired: j2-live-shaft (27 solids)) |
| F3 | PASS | AUTO · feather key on the driver's shaft; the star turns free on its bearing; the roller turns free on the screw (served at pO1; fired: j2-live-shaft (27 solids)) |
| F4 | PASS | AUTO / HAND · bronze thrust washers on the shafts and axles, wave washers in the housing; the roller's bronze spacer; straight teeth carry no axial thrust (served at pO1, pO2, pJ; fired: j2-live-shaft (27 solids)) |
| F5 | N/A | AUTO / HAND · turns fully, nothing to over-travel (the star stops in a detent by the jumper) (served at no joint; fired: j5-slide (no solids), stops (no solids)) |
| F6 | PASS | AUTO / HAND · a leaf spring on a post presses the jumper toward the star: the roller seats in a gap, holds the detent and snaps the star on (the star's only way of holding position) (served at pJ; fired: j7-cam (no solids)) |
| F7 | PASS | AUTO / HAND · belt tension at the motor mount; the finger's circle and the star's centre are set by the base's reamed pivots (served at drive; fired: j6-mesh (no solids), j5-slide (no solids)) |
| F8 | PASS | AUTO · open flanks greased at assembly; the bridge's oil sinks; bearings sealed or shielded (served at pO2; fired: lubrication (no solids)) |
| F9 | PASS | AUTO / HAND · an index mark on a star tooth and its line on the base: at rest the marked tooth sits on the line (polish) (served at pO2; fired: timing-marks (no solids)) |
| F10 | PASS | AUTO / HAND · pulley flanges, home flag, fork sensor; no slip clutch (none planned) (served at drive; fired: drive (37 solids)) |
| M1 | PASS | AUTO · edge breaks on every top face (fired: hardware primitives) |
| M2 | PASS | HAND · the star is a small solid wheel, 10 teeth on radius 20; the driver is a disc; nothing to lighten |
| M3 | PASS | AUTO · bore entry chamfers on every seat and through hole (fired: j3-moving-pin (no solids), hardware primitives) |
| M4 | PASS | AUTO / HAND · counterbored base corners and housing screws; button heads on the posts and the roller screw need no seat (fired: base (1 solid), fasteners (stage 3)) |
| M5 | N/A | AUTO / HAND · no pockets or windows (fired: hardware primitives) |
| M6 | PASS | AUTO · edge distance and walls clean |
| M7 | N/A | HAND · no bracket or plate with a loaded inside corner |
| M8 | PASS | AUTO · thread undercut on the shoulder bolts and axles (fired: j1-dead-axle (41 solids)) |
| M9 | PASS | AUTO / HAND · roller screw M2 into 6 mm of steel jumper (3 d); spring screw M3 into the post; post screws as the rules (fired: j1-dead-axle (41 solids)) |
| M10 | PASS | AUTO / HAND · hardened steel star, finger and roller, bronze spacer and washers, spring steel leaf, aluminium base (123 of 123 solids name a material) |
| M11 | PASS | AUTO · centre holes and chamfered ends on the shafts (fired: j1-dead-axle (41 solids), hardware primitives) |
| M12 | PASS | HAND · every head reachable; bearings pressed out past their circlips |
| M13 | PASS | AUTO / HAND · threadlocker on every screw, nyloc where a nut, set screws low strength (47 threaded, 0 without a locking method) |
| M14 | PASS | AUTO / HAND · the contacts are the hardened finger, the hardened roller and the star's flanks: the finger and roller are replaceable; the star is hardened (fired: j4-slot-roller (no solids)) |
| V1 | PASS | AUTO · pancake outrunner Ø50 x 18 under the base, GT2 32:16 (fired: drive (37 solids)) |
| V2 | PASS | AUTO · one-piece bracket, flange screws up into the base (fired: drive (37 solids)) |
| V3 | PASS | AUTO / HAND · belt and pulleys clear of feet and housing; clearance 0 (fired: drive (37 solids)) |
| V4 | PASS | AUTO · flanges, set screws, slotted mount (fired: j8-belt (2 solids)) |
| V5 | PASS | AUTO · rotary: belt to the input pulley on the driver's shaft (fired: drive (37 solids)) |
| V6 | PASS | AUTO · home flag, fork sensor, leads to the terminal block, P-clip (fired: drive (37 solids)) |
| L1 | PASS | STYLE · lint-style clean |
| L2 | PASS | HAND · model and polish carry geometry, roles, marks and materials only |
| L3 | PASS | HAND · driver, star output, finger, jumper and roller link, hardware hw |
| L4 | PASS | HAND / STYLE · accent on the input cap only |
| L5 | PASS | AUTO / HAND · screws, bearings and spacers are real solids in real holes; the bridge is drawn see-through over the star (fired: see-through) |
| L6 | PASS | AUTO · depth order right at plan, 28°, side and explode in both sheets |
| L7 | PASS | STYLE · tilt 0° to 88°, no shear |
| L8 | PASS | AUTO / HAND · match marks and tapped-hole rings are marks |
| R1 | PASS | HAND · the polish reuses H.spacer, H.screw, H.spring, H.standoff and H.disc; no inline standard part |
| R2 | PASS | HAND · threads M2, M3, M5, M6; shafts Ø10; bearings from the table (threads M2, M3, M5, M8; joint Ø 6, 10; bearings 6800-2RS (10x19x5), F6800 (10x19x5), F686ZZ (6x13x5)) |
| R3 | PASS | AUTO · housing, bridge and drive from their subassemblies (fired: hardware primitives) |
| R4 | PASS | AUTO · package built at build time (package 22.1 KB) |
| R5 | PASS | HAND · states only what differs; polish about 1 ms |
| R6 | PASS | FLAG · FLAG: browser bench 2026-10-19: plan 1.96, 28° 2.32, side 1.80, explode 1.95 ms at full detail; setup 7.1 ms; under the 8 ms target at every dial position |
| R7 | PASS | HAND · model.ts + polish.ts 15.3 KB |
| R8 | PASS | AUTO / SITE · pre-rendered thumbnails; the stage draws on change only |
| DL1 | PASS | AUTO / HAND · every solid and mark on a rung (45 of 123 solids on a dropping rung) |
| DL2 | PASS | HAND · default dial full (model detail full) |
| DL3 | PASS | AUTO · DL-D drawn when exploded, DL-B skipped at side elevation |
| DL4 | PASS | SITE · adaptive dial and the detail entry in the title block |
| DL5 | PASS | FLAG · FLAG: rung counts and frame times in the detail ladder below |
| Q1 | PASS | check, clamp and edge distance clean |
| Q2 | PASS | 0 clashes |
| Q3 | PASS | package written, 22.1 KB; site build not checked here · package written; site build left to CI |
| Q4 | PASS | local: tools/shot · plan, 28°, side, explode at 28° and 70°, both sheets, overlays on, all looked at; attach to #121 |
| Q5 | PASS | local: tools/bench · browser bench run; flags under Verification |
| Q6 | PASS | · every row judged |
| Q7 | PASS | · conformance: star-wheel at 2.6, pass |

## Joints
| Joint | Type | F1 locate | F2 retain | F3 torque | F4 thrust | F5 limit | F6 hold | F7 adjust | F8 lube | F9 timing | F10 protect |
|---|---|---|---|---|---|---|---|---|---|---|---|
| pO1 | J2 | 2 x Dowel pin Ø3 x 10 h6, housing to base | 2 x Internal circlip DIN 472, Ø19; Countersunk M5 x 12 (ISO 10642), into the shaft end, flush; Socket head M5 x 10 (ISO 4762), into the shaft end | Feather key 3 x 3 x 6 (DIN 6885) | Wave washer 14.5x18.8, spring steel; Thrust washer 10.2x16, bronze | – turns fully | – driven through the belt | – nothing to adjust here | – sealed or shielded bearings | – no phase | – see drive |
| pO2 | J1 | 2 x spigot | Internal circlip DIN 472, Ø19; Bearing F6800 (10x19x5) | – turns free on its bearing | Thrust washer 10.2x13.1, bronze | – turns fully | – held by the jumper | – nothing to adjust here | Bridge over the pivot, on two spigoted posts | Star wheel, 10 teeth; Base plate | – nothing to protect |
| pJ | J1 | – located by its neighbours | Internal circlip DIN 472, Ø13; Bearing F686ZZ (6x13x5) | – turns free on its bearing | Thrust washer 6.2x8.4, bronze | – the star's detents limit it | Leaf spring 26 x 6 x 0.8, jumper | – nothing to adjust here | – sealed or shielded bearings | – no phase | – nothing to protect |
| pO2-bridge-post | post | 2 x spigot | – | – | – | – | – | – | – | – | – |
| drive | drive | – | – | – | – | – | – | bracket | – | – | Home flag, 1 mm steel vane; 3 x Fork sensor, slotted optical, 5 mm gap; Pulley flanges |

## Variants and overrides
| Joint or part | Rule result | Chosen | Why |
|---|---|---|---|
| star wheel teeth | root radius 14 | root radius 13 | the finger, 16 from the star's centre, needs a gap wide enough for a Ø3 pin with play (check, model.ts) |
| jumper roller | Ø4 | Ø5.6 on an M2 screw, a spacer under it (polish) | a Ø4 roller has no room for its stud (K6) |
| jumper pivot | bridge over it | none: the pivot is left free (top free) | a bridge would meet the roller's screw as the jumper swings (A9) |
| spring | none in the rules | a leaf on a post, drawn at the jumper's highest lift, 3.6 mm clear (polish) | F6: the jumper's detent force; a flexing leaf is not modelled |
| layout | driver at (0, 0), star at (28, 0) | turned 180° about the driver axis | the drive's bracket and its screw hole then clear the base edge (M6) |

## Detail ladder
| Rung | Solids | Marks | Frame ms at this dial position |
|---|---|---|---|
| DL-A | 10 | 0 | 2.34 |
| DL-B | 0 | 168 | 1.60 |
| DL-C | 0 | 0 | 1.49 |
| DL-D | 19 | 0 | 1.55 |
| DL-E | 8 | 4 | 1.42 |
| DL-F | 0 | 0 | 1.52 |
| DL-G | 0 | 0 | 1.34 |
| DL-H | 8 | 0 | 1.25 |
| never | 78 | 98 | 2.50 (full) |

## Promotion candidates
- The leaf spring on a post (a drawn-at-highest-lift leaf with its screw, standoff and F6 entry) is now in the ratchet and pawl and here: a third makes a primitive `H.leafOnPost`.
- The finger-and-star push and snap are simulated in the model (a signed-distance push, then an eased snap): the Geneva, the internal Geneva and the star wheel could share the push helper.

## Verification
check: clean · clearance: 0 clashes · clamp: clean · edge distance: clean · package: 22.1 KB
screenshots: plan, 28°, side, explode at 28° and 70°, both sheets, drawn in local Chrome to dist/shots/star-wheel/ (plan, 28° and the explode looked at) · bench: browser, DPR 1.5, 2026-10-19; plan 1.96 ms, 28° 2.32 ms, side 1.80 ms, explode 70° 1.95 ms at full detail, 8 ms held at every dial (R6)
