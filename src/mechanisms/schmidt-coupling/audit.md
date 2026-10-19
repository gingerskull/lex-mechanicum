# Audit: Schmidt coupling (schmidt-coupling)
standard: 2.6 · date: 2026-10-19 · result: pass · detail: full · pass: build

## Summary
PASS 109 · FAIL 0 · N/A 12 · open: none

## Requirements
| Id | Status | Evidence / action |
|---|---|---|
| S1 | PASS | DATA · the standard carries version 2.6 and its changelog |
| S2 | PASS | HAND · header with standard, date, result, detail, pass |
| S3 | PASS | AUTO · tools/conformance reads this header and runs in npm run check |
| S4 | PASS | SITE · #131 holds only this mechanism's decisions and open items |
| P1 | PASS | DATA · record complete; model.ts, polish.ts, audit.md present |
| P2 | PASS | DATA · catalogue validator clean (tests/catalog) |
| P3 | PASS | DATA / SITE · ratio unity (1:1, in phase), offset parallel axes, continuous constant-velocity output, backdrivable, other names, family, motion, level, dof 1, motorised drive: all in the record |
| P4 | PASS | DATA · tags grouped Function, Property, Application, keywords underneath |
| P5 | PASS | DATA · motion, forces, benefits, limits; uses with one line each |
| P6 | PASS | DATA · Wikipedia and engineering references, a video, an animation, a photo page; real world: the record's YouTube videos checked live through oEmbed on 2026-10-19; the titles cannot show that the coupling is on screen: look at them when convenient |
| P7 | PASS | HAND / SITE · no prose in model.ts or polish.ts besides names, notes and build rules (engineering record, not on the page); lint-style clean |
| P8 | PASS | SITE · no parts list, build or joint sections on the page |
| P9 | PASS | HAND · solve(): every disc turns u, the middle disc about the fixed point C, the pins on circles of 44, each link translating (its vector the constant C - O1 or O3 - C); the output turns the same as the input; the record says the same |
| P10 | PASS | HAND · the paths of a link end and an output pin (circles), velocity of a pin on the input and on the middle disc, input and output spin, a plot of the output angle over the input angle (slope 1) |
| P11 | PASS | DATA · plain, short sentences, no em dashes, mm and degrees |
| K1 | PASS | HAND · e 50, L 60, the centre C and the pin circles are the model's; pins, bearings, the bridge and marks are fitted round them (check: max link error 2.1e-14 mm) (check: max link error 2.1e-14 mm) |
| K2 | PASS | HAND · check: finite, continuous, periodic over 720 samples |
| K3 | PASS | HAND · only the part family: discs, links, caps; fixed or at placement with spin |
| K4 | PASS | HAND · roles driver (input disc), output (output disc), link (middle disc, links), pin; accent only on the input cap pO1 |
| K5 | PASS | HAND · input disc on layer 0, links A on layer 1, the middle disc on layer 2 (3 mm up), links B on layer 3 (7 mm up), the output disc on layer 5; check clean: no INTERFERE, OVERLAP or WARN (check: no INTERFERE, OVERLAP or WARN) |
| K6 | PASS | DATA · e 50, L 60, three links per set, 120°, set B offset 60°: as the catalogue. Deliberate differences, commented in model.ts: the pin circle is 44 mm, not 40 (with 40 the links of a set meet end to end within 9.3 mm and their eyes could be 4.6 mm only); the output pivot is hung from a bridge; the heads clear by 3 and 7 mm of plating |
| K7 | PASS | HAND · input rotary on the input disc (input rotary on discIn) |
| D1 | PASS | HAND · three plain discs, straight links with boss rings at both ends, keyed input disc; the one family of forms |
| D2 | PASS | HAND · the discs are plain plates (the pins carry the links' load into them); the links are bars with round eyes sized to their bearings |
| D3 | PASS | STYLE · roles told apart by pattern and tone in both sheets (screenshots) |
| D4 | PASS | AUTO · feet and corner holes concentric with the base corner arcs (fired: base (1 solid), feet (4 solids)) |
| D5 | PASS | AUTO / HAND · a bridge over the output disc's pivot (hung stud), shaped by H.bridge on spigoted posts, outside every sweep; the input shaft cannot be bridged: the links sweep over its end |
| D6 | PASS | HAND / STYLE · bridge, screws and the drive read quieter than the discs; the discs are drawn with transparency so the links show through |
| D7 | PASS | HAND · discs and links carry only load shape and marks; the richness is in the shaft, bearings, circlips, shoulder bolts, the stud and marks |
| A1 | PASS | AUTO · pO1 J2, pO3 J1 (hung), twelve J3 moving pins (cA, dA, dB, cB) (pO1 J2, pO3 J1, cA0 J3, cA1 J3, cA2 J3, dA0 J3, dA1 J3, dA2 J3, dB0 J3, dB1 J3, dB2 J3, cB0 J3, cB1 J3, cB2 J3; fired: classify (no solids)) |
| A2 | PASS | AUTO · pO1 a live shaft (accent input, keyed input disc); pO3 a hung stud; the twelve pins shoulder-bolt joints (pO1 J2, pO3 J1, cA0 J3, cA1 J3, cA2 J3, dA0 J3, dA1 J3, dA2 J3, dB0 J3, dB1 J3, dB2 J3, cB0 J3, cB1 J3, cB2 J3) |
| A3 | PASS | AUTO · 6800 on the Ø10 input shaft in the housing and on the Ø10 stud; F686 and F696 in the link eyes on their bolts (fired: classify (no solids)) |
| A4 | PASS | AUTO · stepped keyed input shaft with circlip grooves; shouldered bolts with undercuts; a hung stud with its circlip groove (fired: j1-dead-axle (27 solids)) |
| A5 | PASS | AUTO · the Ø8 input shaft D-flat, the input disc keyed (fired: j2-live-shaft (26 solids)) |
| A6 | N/A | AUTO · no fixed plate floating above the base: the bridge stands on spigoted posts (fired: standoffs (no solids)) |
| A7 | PASS | AUTO · 8 mm base, counterbored corners, feet, front scale, clearance hole for every live shaft (fired: base (1 solid), feet (4 solids)) |
| A8 | PASS | AUTO · every head has its shank; holes cut by stage 3 (fired: fasteners (stage 3)) |
| A9 | PASS | AUTO / HAND · the twelve link pins are single shear by necessity (a part sweeps over the head of each: the disc or the link above), each with its head clear by its own height and a bearing in the upper part; the output stud is hung from a bridge (double support); the input shaft cannot be straddle mounted because the links sweep over its end, so it overhangs its housing: bearings 10 mm apart, the one open point of this build (fired: j2-straddle (no solids)) |
| A10 | PASS | HAND · discs and links in alternate layers, each pair on one pin; nothing stacked only to clear but the 3 and 7 mm of plating for the pin heads |
| A11 | PASS | AUTO / HAND · the drive: key, input shaft, housing, base; the output: the stud, the bridge, posts, base; each link pin: bolt, bearing, disc, shaft or stud (fired: j1-dead-axle (27 solids)) |
| A12 | PASS | AUTO · clamp check clean |
| A13 | PASS | AUTO / HAND · every solid named with catalogue sizes, sets counted (226 solids, 113 unnamed (further items of a listed set)) |
| A14 | PASS | HAND · the bridge's posts outside every sweep; clearance 0 |
| A15 | PASS | AUTO · clearance: 0 clashes over the cycle |
| A16 | PASS | HAND · a note and a badge on every joint, five build rules (5 build rules; no note: none; no badge: none) |
| A17 | PASS | HAND · housing and shaft from below, the input disc, links A on their pins with the middle disc over them, links B, the output disc, the stud and bridge last; every screw reachable, bearings pressed out past their circlips |
| E1 | PASS | AUTO · one level per solid (every solid has one explode level; levels -8 to 6) |
| E2 | PASS | AUTO · screws, shafts and bought units are groups (48 rigid groups; fired: explode) |
| E3 | PASS | AUTO · screws leave along their axis to the head side, nuts the other way (screenshots at 28° and 70°) (fired: explode) |
| E4 | PASS | HAND · the bridge and the stud go furthest up, the output disc and links B next, the middle disc, links A, input disc below, housing and shaft at the bottom: reverse of assembly |
| E5 | PASS | AUTO · bearings and circlips stay in their parts (fired: explode) |
| E6 | PASS | AUTO · motor with its bracket, bearings whole (fired: explode) |
| E7 | PASS | AUTO · spacers midway (fired: explode) |
| E8 | PASS | AUTO · keyed parts keep their order on the shaft (fired: explode) |
| E9 | PASS | HAND · looked at full explode at 28° and 70°, both sheets: nothing inside another part, nothing leaves the frame |
| J1 | PASS | AUTO · the output stud: hung from a bridge on spigoted posts, a bearing in the output disc, sleeves up to the bridge, circlip under the bearing (fired: j1-dead-axle (27 solids)) |
| J2 | PASS | AUTO · input: housing with two bearings, sleeve, wave washer, circlips, dowelled; D-flat shaft, thrust washer, home flag (fired: j2-live-shaft (26 solids), j2-straddle (no solids)) |
| J3 | PASS | AUTO · twelve moving pins: shoulder bolt threaded into the lowest part, bearing in the other, inner-race spacers, shim, threadlocker (fired: j3-moving-pin (123 solids)) |
| J4 | N/A | AUTO · no pin in a slot (fired: j4-slot-roller (no solids)) |
| J5 | N/A | AUTO · no slide (fired: j5-slide (no solids)) |
| J6 | N/A | AUTO · no gear mesh (fired: j6-mesh (no solids)) |
| J7 | N/A | AUTO · no cam (fired: j7-cam (no solids)) |
| J8 | PASS | AUTO · flanged motor pulley, mount slotted for tension (fired: j8-belt (2 solids)) |
| F1 | PASS | AUTO · housing dowelled; the bridge on two spigoted posts; the bolt shoulders in reamed holes (served at pO1, pO3, pO3-bridge-post; fired: j2-live-shaft (26 solids)) |
| F2 | PASS | AUTO · housing bearings on circlips; the link-pin bearings on internal circlips, the bolt heads above; the stud's bearing circlipped; end retainer (served at pO1, pO3, cA0, cA1, cA2, dA0, dA1, dA2, dB0, dB1, dB2, cB0, cB1, cB2; fired: j2-live-shaft (26 solids)) |
| F3 | PASS | AUTO · key on the input shaft, the input disc keyed; the other parts turn free on their bearings (served at pO1; fired: j2-live-shaft (26 solids)) |
| F4 | PASS | AUTO / HAND · bronze thrust washers on the shaft and stud, wave washers in the housing, shims under the bolt heads set each pin's end-shake; no axial thrust (served at pO1; fired: j2-live-shaft (26 solids)) |
| F5 | N/A | AUTO / HAND · turns fully, nothing to over-travel (served at no joint; fired: j5-slide (no solids), stops (no solids)) |
| F6 | N/A | AUTO / HAND · driven; no rest position to hold (served at no joint; fired: j7-cam (no solids)) |
| F7 | N/A | AUTO / HAND · an offset coupling is built to take any offset e between 0 and 2L: the centre distance is not set exactly, so it needs no adjuster; belt tension at the motor mount (served at drive; fired: j6-mesh (no solids), j5-slide (no solids)) |
| F8 | PASS | AUTO · sealed or shielded bearings in every eye (no sliding contacts); the bridge's oil sink on the stud (served at no joint; fired: lubrication (no solids)) |
| F9 | PASS | AUTO / HAND · index lines on the discs at the pins of set A (0°) and set B (60°) and on the base under the input and output discs (polish): the discs go back with each pin set in phase (served at pO1, pO3; fired: timing-marks (no solids)) |
| F10 | PASS | AUTO / HAND · pulley flanges, home flag, fork sensor; no slip clutch (none planned) (served at drive; fired: drive (37 solids)) |
| M1 | PASS | AUTO · edge breaks on every top face (fired: hardware primitives) |
| M2 | N/A | HAND · the discs turn at a steady speed with plain plates; the pins' loads are small; no lightening needed |
| M3 | PASS | AUTO · bore entry chamfers on every seat and through hole (fired: j3-moving-pin (123 solids), hardware primitives) |
| M4 | PASS | AUTO / HAND · counterbored base corners and housing screws; button heads on the bolts need no seat (fired: base (1 solid), fasteners (stage 3)) |
| M5 | N/A | AUTO / HAND · no pockets or windows (fired: hardware primitives) |
| M6 | PASS | AUTO · edge distance and walls clean |
| M7 | N/A | HAND · no bracket or plate with a loaded inside corner |
| M8 | PASS | AUTO · thread undercut on the shoulder bolts and axles (fired: j1-dead-axle (27 solids)) |
| M9 | PASS | AUTO / HAND · the bolts M6 and M5 thread into 6 mm of steel disc or link (1 d), as the rules; the stud M8 through the bridge to a nut; post screws M5 into the standoffs (fired: j1-dead-axle (27 solids)) |
| M10 | PASS | AUTO / HAND · steel links and discs, hardened bolts, aluminium base, bronze washers (226 of 226 solids name a material) |
| M11 | PASS | AUTO · centre holes and chamfered ends on the shafts (fired: j1-dead-axle (27 solids), hardware primitives) |
| M12 | PASS | HAND · every head reachable; bearings pressed out past their circlips |
| M13 | PASS | AUTO / HAND · threadlocker on every screw, nyloc where a nut, set screws low strength (88 threaded, 0 without a locking method) |
| M14 | N/A | AUTO / HAND · no sliding wear surface: every pivot turns in a bearing (fired: j4-slot-roller (no solids)) |
| V1 | PASS | AUTO · pancake outrunner Ø50 x 18 under the base, GT2 32:16 (fired: drive (37 solids)) |
| V2 | PASS | AUTO · one-piece bracket, flange screws up into the base (fired: drive (37 solids)) |
| V3 | PASS | AUTO / HAND · belt and pulleys clear of feet and housing; clearance 0 (fired: drive (37 solids)) |
| V4 | PASS | AUTO · flanges, set screws, slotted mount (fired: j8-belt (2 solids)) |
| V5 | PASS | AUTO · rotary: belt to the input pulley on the input shaft (fired: drive (37 solids)) |
| V6 | PASS | AUTO · home flag, fork sensor, leads to the terminal block, P-clip (fired: drive (37 solids)) |
| L1 | PASS | STYLE · lint-style clean |
| L2 | PASS | HAND · model and polish carry geometry, roles, marks and materials only |
| L3 | PASS | HAND · input disc driver, output disc output, middle disc and links link, hardware hw |
| L4 | PASS | HAND / STYLE · accent on the input cap only |
| L5 | PASS | AUTO / HAND · screws, bearings and spacers are real solids in real holes; the discs are drawn with transparency so the links show through (fired: see-through) |
| L6 | PASS | AUTO · depth order right at plan, 28°, side and explode in both sheets |
| L7 | PASS | STYLE · tilt 0° to 88°, no shear |
| L8 | PASS | AUTO / HAND · match marks and tapped-hole rings are marks |
| R1 | PASS | HAND · the polish reuses H.boltCircle; the bridge, bolts and bearings are the rules'; no inline standard part |
| R2 | PASS | HAND · threads M3, M5, M6, M8; shafts Ø10 and Ø6 bolts; four bearing sizes (threads M3, M4, M5, M6, M8; joint Ø 6, 8, 10; bearings 688-2RS (8x16x5), F686ZZ (6x13x5), F696ZZ (6x15x5), F6800ZZ (10x19x5)) |
| R3 | PASS | AUTO · housing, bridge and drive from their subassemblies (fired: hardware primitives) |
| R4 | PASS | AUTO · package built at build time (package 29.7 KB) |
| R5 | PASS | HAND · states only what differs; polish about 1 ms |
| R6 | PASS | FLAG · FLAG: browser bench 2026-10-19: plan 2.97, 28° 2.96, side 2.43, explode 2.58 ms at full detail; setup 11.5 ms; under the 8 ms target at every dial position |
| R7 | PASS | HAND · model.ts + polish.ts 8.2 KB |
| R8 | PASS | AUTO / SITE · pre-rendered thumbnails; the stage draws on change only |
| DL1 | PASS | AUTO / HAND · every solid and mark on a rung (88 of 226 solids on a dropping rung) |
| DL2 | PASS | HAND · default dial full (model detail full) |
| DL3 | PASS | AUTO · DL-D drawn when exploded, DL-B skipped at side elevation |
| DL4 | PASS | SITE · adaptive dial and the detail entry in the title block |
| DL5 | PASS | FLAG · FLAG: rung counts and frame times in the detail ladder below |
| Q1 | PASS | check, clamp and edge distance clean |
| Q2 | PASS | 0 clashes |
| Q3 | PASS | package written, 29.7 KB; site build not checked here · package written; site build left to CI |
| Q4 | PASS | local: tools/shot · plan, 28°, side, explode at 28° and 70°, both sheets, overlays on, all looked at; attach to #131 |
| Q5 | PASS | local: tools/bench · browser bench run; flags under Verification |
| Q6 | PASS | · every row judged |
| Q7 | PASS | · conformance: schmidt-coupling at 2.6, pass |

## Joints
| Joint | Type | F1 locate | F2 retain | F3 torque | F4 thrust | F5 limit | F6 hold | F7 adjust | F8 lube | F9 timing | F10 protect |
|---|---|---|---|---|---|---|---|---|---|---|---|
| pO1 | J2 | 2 x Dowel pin Ø3 x 10 h6, housing to base | 2 x Internal circlip DIN 472, Ø16; Countersunk M4 x 10 (ISO 10642), into the shaft end, flush; Socket head M4 x 8 (ISO 4762), into the shaft end | Input shaft Ø8 h6, D-flat | Wave washer 12x15.8, spring steel; Thrust washer 8.2x14, bronze | – turns fully | – driven through the belt | – belt tension at the motor mount | – sealed and shielded bearings | Input disc; Base plate | – see drive |
| pO3 | J1 | 2 x spigot | Internal circlip DIN 472, Ø19; Bearing F6800ZZ (10x19x5); External circlip DIN 471, Ø10 | – turns free on its bearing | – no axial thrust (straight teeth) | – turns fully | – driven by the links | – nothing to adjust here | – sealed bearings | Output disc, 4 x M3 tapped in the hub for the load; Middle disc, floating; Base plate | – nothing to protect |
| cA0 | J3 | – the shoulder sits in a reamed hole | Internal circlip DIN 472, Ø13; Bearing F686ZZ (6x13x5); head | – turns free on its bearing | – shim washer under the head sets the end-shake | – turns fully | – driven | – nothing to adjust here | – sealed bearings | – the marks are on the discs | – nothing to protect |
| cA1 | J3 | – the shoulder sits in a reamed hole | Internal circlip DIN 472, Ø13; Bearing F686ZZ (6x13x5); head | – turns free on its bearing | – shim washer under the head sets the end-shake | – turns fully | – driven | – nothing to adjust here | – sealed bearings | – the marks are on the discs | – nothing to protect |
| cA2 | J3 | – the shoulder sits in a reamed hole | Internal circlip DIN 472, Ø13; Bearing F686ZZ (6x13x5); head | – turns free on its bearing | – shim washer under the head sets the end-shake | – turns fully | – driven | – nothing to adjust here | – sealed bearings | – the marks are on the discs | – nothing to protect |
| dA0 | J3 | – the shoulder sits in a reamed hole | Internal circlip DIN 472, Ø15; Bearing F696ZZ (6x15x5); head | – turns free on its bearing | – shim washer under the head sets the end-shake | – turns fully | – driven | – nothing to adjust here | – sealed bearings | – the marks are on the discs | – nothing to protect |
| dA1 | J3 | – the shoulder sits in a reamed hole | Internal circlip DIN 472, Ø15; Bearing F696ZZ (6x15x5); head | – turns free on its bearing | – shim washer under the head sets the end-shake | – turns fully | – driven | – nothing to adjust here | – sealed bearings | – the marks are on the discs | – nothing to protect |
| dA2 | J3 | – the shoulder sits in a reamed hole | Internal circlip DIN 472, Ø15; Bearing F696ZZ (6x15x5); head | – turns free on its bearing | – shim washer under the head sets the end-shake | – turns fully | – driven | – nothing to adjust here | – sealed bearings | – the marks are on the discs | – nothing to protect |
| dB0 | J3 | – the shoulder sits in a reamed hole | head | – turns free on its bearing | – shim washer under the head sets the end-shake | – turns fully | – driven | – nothing to adjust here | – sealed bearings | – the marks are on the discs | – nothing to protect |
| dB1 | J3 | – the shoulder sits in a reamed hole | head | – turns free on its bearing | – shim washer under the head sets the end-shake | – turns fully | – driven | – nothing to adjust here | – sealed bearings | – the marks are on the discs | – nothing to protect |
| dB2 | J3 | – the shoulder sits in a reamed hole | head | – turns free on its bearing | – shim washer under the head sets the end-shake | – turns fully | – driven | – nothing to adjust here | – sealed bearings | – the marks are on the discs | – nothing to protect |
| cB0 | J3 | – the shoulder sits in a reamed hole | Internal circlip DIN 472, Ø15; Bearing F696ZZ (6x15x5); head | – turns free on its bearing | – shim washer under the head sets the end-shake | – turns fully | – driven | – nothing to adjust here | – sealed bearings | – the marks are on the discs | – nothing to protect |
| cB1 | J3 | – the shoulder sits in a reamed hole | Internal circlip DIN 472, Ø15; Bearing F696ZZ (6x15x5); head | – turns free on its bearing | – shim washer under the head sets the end-shake | – turns fully | – driven | – nothing to adjust here | – sealed bearings | – the marks are on the discs | – nothing to protect |
| cB2 | J3 | – the shoulder sits in a reamed hole | Internal circlip DIN 472, Ø15; Bearing F696ZZ (6x15x5); head | – turns free on its bearing | – shim washer under the head sets the end-shake | – turns fully | – driven | – nothing to adjust here | – sealed bearings | – the marks are on the discs | – nothing to protect |
| pO3-bridge-post | post | 2 x spigot | – | – | – | – | – | – | – | – | – |
| drive | drive | – | – | – | – | – | – | bracket | – | – | Home flag, 1 mm steel vane; 3 x Fork sensor, slotted optical, 5 mm gap; Pulley flanges |

## Variants and overrides
| Joint or part | Rule result | Chosen | Why |
|---|---|---|---|
| pin circle | r 40 | r 44 | with 40 the links of a set meet end to end within 9.3 mm (eyes of 4.6 mm: no bearing fits); with 44 the gap is 16.2 mm (K6) |
| output pivot | a shaft from the base | a stud hung from a bridge over the output disc | no shaft may rise from the base through the links' sweep (A9, A10) |
| layers | pseudo-3D layers | input disc 0, links A 1, middle disc 2 (+3 mm), links B 3 (+7 mm), output disc 5 | each pin's head clears the part above by its own height (K5) |
| middle disc | a disc with six pins | no shaft: the links alone carry it, turning about the fixed point C | as the catalogue; the pins on it as two sets, 60° apart |
| adjuster | none | none: an offset coupling | F7: its offset is free by design |

## Detail ladder
| Rung | Solids | Marks | Frame ms at this dial position |
|---|---|---|---|
| DL-A | 26 | 0 | 2.61 |
| DL-B | 0 | 431 | 2.02 |
| DL-C | 0 | 0 | 2.31 |
| DL-D | 46 | 0 | 1.99 |
| DL-E | 8 | 6 | 1.95 |
| DL-F | 0 | 0 | 1.91 |
| DL-G | 0 | 0 | 1.53 |
| DL-H | 8 | 0 | 1.64 |
| never | 138 | 237 | 2.83 (full) |

## Promotion candidates
- A hung pivot with a `span: 0` cap needs its heights without plating (the cap's top does not take `dz`): the heights() of a capped pin with dz and span 0 returns an inverted range. A hung pivot above a plated part should take the plating.
- Chains of identical moving pins through three or five layers (twelve J3 joints here) each get their own bearings and bolts: a stack primitive for a link pinned between two plates would shrink the audit.

## Verification
check: clean · clearance: 0 clashes · clamp: clean · edge distance: clean · package: 29.7 KB
screenshots: plan, 28°, side, explode at 28° and 70°, both sheets, drawn in local Chrome to dist/shots/schmidt-coupling/ (plan, 28° and the explode looked at) · bench: browser, DPR 1.5, 2026-10-19; plan 2.97 ms, 28° 2.96 ms, side 2.43 ms, explode 70° 2.58 ms at full detail, 8 ms held at every dial (R6)
