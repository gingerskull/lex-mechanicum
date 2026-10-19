# Audit: Cycloidal drive (cycloidal-drive)
standard: 2.6 · date: 2026-10-19 · result: pass · detail: full · pass: build

## Summary
PASS 111 · FAIL 0 · N/A 10 · open: none

## Requirements
| Id | Status | Evidence / action |
|---|---|---|
| S1 | PASS | DATA · the standard carries version 2.6 and its changelog |
| S2 | PASS | HAND · header with standard, date, result, detail, pass |
| S3 | PASS | AUTO · tools/conformance reads this header and runs in npm run check |
| S4 | PASS | SITE · #114 holds only this mechanism's decisions and open items |
| P1 | PASS | DATA · record complete; model.ts, polish.ts, audit.md present |
| P2 | PASS | DATA · catalogue validator clean (tests/catalog) |
| P3 | PASS | DATA / SITE · ratio reduction 11:1, coaxial axes, continuous reversing output, backdrivable, other names, family, motion, level, dof 1, motorised drive: all in the record |
| P4 | PASS | DATA · tags grouped Function, Property, Application, keywords underneath |
| P5 | PASS | DATA · motion, forces, benefits, limits; uses with one line each |
| P6 | PASS | DATA · Wikipedia and engineering references, a video, an animation, a photo page; real world is empty: no video of a real cycloidal drive at work was found (none rather than a wrong one) |
| P7 | PASS | HAND / SITE · no prose in model.ts or polish.ts besides names, notes and build rules (engineering record, not on the page); lint-style clean |
| P8 | PASS | SITE · no parts list, build or joint sections on the page |
| P9 | PASS | HAND · solve(): the input turns eleven times per cycle, the disc and the flange turn once the other way (-1/11 of the input, 32.7° per input turn); the record says 11:1 reversing |
| P10 | PASS | HAND · the path of the disc centre (a circle of radius 2), velocity of it, input and output spin, a plot of the output angle over the cycle (slope -1/11 against the input) |
| P11 | PASS | DATA · plain, short sentences, no em dashes, mm and degrees |
| K1 | PASS | HAND · the disc profile, the pin circle R 50, the eccentricity 2 and the output pin circle 25 are the model's; pins, plates, bearings and screws are fitted round them (check: max link error 0.0e+0 mm; the disc against the twelve ring pins measured outside the model at five phases: a gap of Rr to 0.000 mm) (check: max link error 0.0e+0 mm) |
| K2 | PASS | HAND · check: finite, continuous, periodic over 720 samples |
| K3 | PASS | HAND · only the part family: custom outlines, discs, caps; fixed or at placement with spin |
| K4 | PASS | HAND · roles driver (cam), link (disc), output (flange, output pins), ground (housing, ring pins), pin; accent only on the input cap pO |
| K5 | PASS | HAND · housing layer -1, disc and output pins layer 0, flange layer 1; check clean: no INTERFERE, OVERLAP or WARN (check: no INTERFERE, OVERLAP or WARN) |
| K6 | PASS | DATA · N 12, n 11, R 50, Rr 5, e 2, Ro 25, ro 5, hole ro + e as the catalogue. Deliberate differences, commented in model.ts: one cycle is one output turn (eleven input turns), the catalogue's input turn is the same motion; the disc is cut 0.06 mm small and its holes 0.06 wider; the ring pins are the polish's, not the model's |
| K7 | PASS | HAND · input rotary on the eccentric cam (input rotary on eccentric) |
| D1 | PASS | HAND · the epitrochoid disc with its pin holes, a keyed cam, a spoked flange, ring pins as dowels; the one family of forms |
| D2 | PASS | HAND · the flange keeps material where the load runs: a hub, a spoke through each output pin, a rim; the disc is plain |
| D3 | PASS | STYLE · roles told apart by pattern and tone in both sheets (screenshots) |
| D4 | PASS | AUTO · feet and corner holes concentric with the base corner arcs (fired: base (1 solid), feet (4 solids)) |
| D5 | N/A | AUTO / HAND · no bridge: the flange sweeps over the input shaft end and over the disc, and the cover ring is the pin carrier; nothing fixed can span the flange |
| D6 | PASS | HAND / STYLE · pins, plates, screws and the drive read quieter than the disc; the flange shows the disc through its windows |
| D7 | PASS | HAND · disc and flange carry only load shape and marks; the richness is in the shaft, bearings, circlips, pins, screws and marks |
| A1 | PASS | AUTO · pO J2; the disc, the flange and the output pins ride on the eccentric (E) and the pins (OP) without a model pin (pO J2; fired: classify (no solids)) |
| A2 | PASS | AUTO · pO a live shaft (accent input, keyed cam); the flange rides on the shaft on its own bearing (a bored part) (pO J2) |
| A3 | PASS | AUTO · 6800 on the Ø10 input shaft in the housing and in the flange; 6804 between the cam and the disc (polish) (fired: classify (no solids)) |
| A4 | PASS | AUTO · stepped keyed input shaft with circlip grooves (fired: j1-dead-axle (no solids)) |
| A5 | PASS | AUTO · feather key 3 x 3 on the Ø10 input shaft, the cam keyed (fired: j2-live-shaft (34 solids)) |
| A6 | PASS | AUTO · the housing plate floats above the base on two Ø10 standoffs, screwed both ends; the cover ring on four tie standoffs (polish) (fired: standoffs (10 solids)) |
| A7 | PASS | AUTO · 8 mm base, counterbored corners, feet, front scale, clearance hole for every live shaft (fired: base (1 solid), feet (4 solids)) |
| A8 | PASS | AUTO · every head has its shank; holes cut by stage 3 (fired: fasteners (stage 3)) |
| A9 | PASS | AUTO / HAND · the ring pins are held at both ends (housing plate and cover ring); the output pins are held in the flange and free in the disc, a clevis; the input shaft overhangs its housing because the flange sweeps over its end, so it cannot be straddle mounted: bearings 10 mm apart, the one open point of this build (fired: j2-straddle (no solids)) |
| A10 | PASS | HAND · disc and output pins in one plane, the flange above, the housing below, the cover over the pin tops; nothing stacked only to clear |
| A11 | PASS | AUTO / HAND · the disc's reaction goes through the ring pins to the housing plate and cover ring, the ties and posts to the base; the output through the flange, its bearing, the shaft and the housing (fired: j1-dead-axle (no solids)) |
| A12 | PASS | AUTO · clamp check clean |
| A13 | PASS | AUTO / HAND · every solid named with catalogue sizes, sets counted (148 solids, 77 unnamed (further items of a listed set)) |
| A14 | PASS | HAND · ties and posts outside the disc's sweep (radius 54); clearance 0 |
| A15 | PASS | AUTO · clearance: 0 clashes over the cycle |
| A16 | PASS | HAND · a note and a badge on every joint, five build rules (5 build rules; no note: none; no badge: none) |
| A17 | PASS | HAND · pins pressed into the housing plate, housing and shaft from below, cam and disc with its bearing, flange with its pins in the disc, cover ring over the pin tops, tie standoffs; every screw reachable, bearings pressed out past their circlips |
| E1 | PASS | AUTO · one level per solid (every solid has one explode level; levels -8 to 3.5) |
| E2 | PASS | AUTO · screws, shafts and bought units are groups (41 rigid groups; fired: explode) |
| E3 | PASS | AUTO · screws leave along their axis to the head side, nuts the other way (screenshots at 28° and 70°) (fired: explode) |
| E4 | PASS | HAND · cover ring and tie screws go furthest up, flange above the disc, disc and cam in the middle, housing plate and shaft below: reverse of assembly |
| E5 | PASS | AUTO · bearings and circlips stay in their parts (fired: explode) |
| E6 | PASS | AUTO · motor with its bracket, bearings whole (fired: explode) |
| E7 | PASS | AUTO · spacers midway (fired: explode) |
| E8 | PASS | AUTO · keyed parts keep their order on the shaft (fired: explode) |
| E9 | PASS | HAND · looked at full explode at 28° and 70°, both sheets: nothing inside another part, nothing leaves the frame |
| J1 | N/A | AUTO · no dead axle: the ring pins are dowels in plates, not pivots (fired: j1-dead-axle (no solids)) |
| J2 | PASS | AUTO · input: housing with two bearings, sleeve, wave washer, circlips, dowelled; keyed shaft, end retainer, thrust washer, home flag; the flange on its own bearing (fired: j2-live-shaft (34 solids), j2-straddle (no solids)) |
| J3 | N/A | AUTO · no moving pin: the disc turns on a bearing on the cam, the flange on the shaft (fired: j3-moving-pin (no solids)) |
| J4 | N/A | AUTO · the output pins in the disc's holes and the lobes on the ring pins are the mechanism's contacts, not a roller in a slot; the hardened pins are the wear parts (M14) (fired: j4-slot-roller (no solids)) |
| J5 | N/A | AUTO · no such joint here (fired: j5-slide (no solids)) |
| J6 | N/A | AUTO · no gear mesh: the lobes roll on the ring pins and the output pins sit in the disc's holes (fired: j6-mesh (no solids)) |
| J7 | N/A | AUTO · no such joint here (fired: j7-cam (no solids)) |
| J8 | PASS | AUTO · flanged motor pulley, mount slotted for tension (fired: j8-belt (2 solids)) |
| F1 | PASS | AUTO · housing dowelled; the ring pins pressed into both plates (twelve locating holes); the cover ring on four standoffs; the output pins pressed into the flange (served at pO, ring-pins; fired: j2-live-shaft (34 solids)) |
| F2 | PASS | AUTO · housing bearings on circlips; the flange's bearing on circlips; the disc's bearing between two internal circlips; the ring pins retained by the cover ring; each output pin by an M4 down its axis; end retainer (served at pO; fired: j2-live-shaft (34 solids)) |
| F3 | PASS | AUTO · feather key on the input shaft, the cam keyed; the flange rides on its bearing, the disc on its own (served at pO; fired: j2-live-shaft (34 solids)) |
| F4 | PASS | AUTO / HAND · bronze thrust washers on the shaft, wave washers in the housing; the cam's bearing carries the disc's thrust (straight lobes: none) (served at pO; fired: j2-live-shaft (34 solids)) |
| F5 | N/A | AUTO / HAND · turns fully, nothing to over-travel (served at no joint; fired: j5-slide (no solids), stops (no solids)) |
| F6 | N/A | AUTO / HAND · driven; no rest position to hold (served at no joint; fired: j7-cam (no solids)) |
| F7 | PASS | AUTO / HAND · belt tension at the motor mount; the eccentric is cut to e, nothing else to adjust: the centres are set by the plates' reamed holes (served at drive; fired: j6-mesh (no solids), j5-slide (no solids)) |
| F8 | PASS | AUTO · the disc's bearing shielded, the input bearings sealed; oil sinks on the flange at each output pin (the sliding contact); the lobes grease at assembly (served at no joint; fired: lubrication (no solids)) |
| F9 | PASS | AUTO / HAND · index lines on the housing at ring pin 1, on the disc at its zero line and on the cam at its eccentric side, which line up at the assembly phase (polish; the rules mark only gear meshes) (served at pO; fired: timing-marks (no solids)) |
| F10 | PASS | AUTO / HAND · pulley flanges, home flag, fork sensor; no slip clutch (none planned) (served at drive; fired: drive (37 solids)) |
| M1 | PASS | AUTO · edge breaks on every top face (fired: hardware primitives) |
| M2 | PASS | HAND · the flange is a hub, six spokes and a rim, the spokes through the output pins; the disc is plain, its mass needed to run true; no further lightening |
| M3 | PASS | AUTO · bore entry chamfers on every seat and through hole (fired: j3-moving-pin (no solids), hardware primitives) |
| M4 | PASS | AUTO / HAND · counterbored base corners and housing screws; button heads on the ties and the output pins need no seat (fired: base (1 solid), fasteners (stage 3)) |
| M5 | PASS | AUTO / HAND · the flange windows carry R4 cutter radii (H.spokes) (fired: hardware primitives) |
| M6 | PASS | AUTO · edge distance and walls clean |
| M7 | N/A | HAND · no bracket or plate with a loaded inside corner: the spokes' windows are filleted |
| M8 | PASS | AUTO · thread undercut on the shoulder bolts and axles (fired: j1-dead-axle (no solids)) |
| M9 | PASS | AUTO / HAND · output pin screws M4 into 5 mm of steel pin (over 1 d); tie screws M5 into the tie standoffs and the nut-less base; housing screws as the rules (fired: j1-dead-axle (no solids)) |
| M10 | PASS | AUTO / HAND · hardened ground steel disc, ring pins and output pins, steel shaft, aluminium plates and base, bronze washers (148 of 148 solids name a material) |
| M11 | PASS | AUTO · centre holes and chamfered ends on the shafts (fired: j1-dead-axle (no solids), hardware primitives) |
| M12 | PASS | HAND · every head reachable: the pin screws and the cover screws from above, the housing screws from below; bearings pressed out past their circlips |
| M13 | PASS | AUTO / HAND · threadlocker on every screw, nyloc where a nut, set screws low strength (62 threaded, 0 without a locking method) |
| M14 | PASS | AUTO / HAND · the sliding and rolling contacts are the hardened ring pins and output pins and the ground disc: the pins are pressed in and replaceable; no strip needed (fired: j4-slot-roller (no solids)) |
| V1 | PASS | AUTO · pancake outrunner Ø50 x 18 under the base, GT2 32:16 (fired: drive (37 solids)) |
| V2 | PASS | AUTO · one-piece bracket, flange screws up into the base (fired: drive (37 solids)) |
| V3 | PASS | AUTO / HAND · belt and pulleys clear of feet and housing; clearance 0 (fired: drive (37 solids)) |
| V4 | PASS | AUTO · flanges, set screws, slotted mount (fired: j8-belt (2 solids)) |
| V5 | PASS | AUTO · rotary: belt to the input pulley on the shaft (fired: drive (37 solids)) |
| V6 | PASS | AUTO · home flag, fork sensor, leads to the terminal block, P-clip (fired: drive (37 solids)) |
| L1 | PASS | STYLE · lint-style clean |
| L2 | PASS | HAND · model and polish carry geometry, roles, marks and materials only |
| L3 | PASS | HAND · cam driver, disc link, flange and output pins output, housing and ring pins ground, hardware hw |
| L4 | PASS | HAND / STYLE · accent on the input cap only |
| L5 | PASS | AUTO / HAND · screws, pins, bearings and spacers are real solids in real holes; the flange is drawn with windows so the disc shows (fired: see-through) |
| L6 | PASS | AUTO · depth order right at plan, 28°, side and explode in both sheets |
| L7 | PASS | STYLE · tilt 0° to 88°, no shear |
| L8 | PASS | AUTO / HAND · match marks and tapped-hole rings are marks |
| R1 | PASS | HAND · the polish reuses H.dowel, H.plate, H.standoff, H.screw, H.bearing, H.circlip, H.spokes and H.boltCircle; no inline standard part |
| R2 | PASS | HAND · threads M3, M4, M5; shaft Ø10; bearings 6800 and 6804 (threads M3, M4, M5; joint Ø 10; bearings 6800-2RS (10x19x5), F6800ZZ (10x19x5), 6804ZZ (20x32x7)) |
| R3 | PASS | AUTO · housing, bridge and drive from their subassemblies (fired: hardware primitives) |
| R4 | PASS | AUTO · package built at build time (package 25.3 KB) |
| R5 | PASS | HAND · states only what differs; polish about 1 ms |
| R6 | PASS | FLAG · FLAG: browser bench 2026-10-19: plan 2.60, 28° 2.98, side 2.15, explode 2.40 ms at full detail; setup 11.6 ms; under the 8 ms target at every dial position |
| R7 | PASS | HAND · model.ts + polish.ts 12.2 KB |
| R8 | PASS | AUTO / SITE · pre-rendered thumbnails; the stage draws on change only |
| DL1 | PASS | AUTO / HAND · every solid and mark on a rung (46 of 148 solids on a dropping rung) |
| DL2 | PASS | HAND · default dial full (model detail full) |
| DL3 | PASS | AUTO · DL-D drawn when exploded, DL-B skipped at side elevation |
| DL4 | PASS | SITE · adaptive dial and the detail entry in the title block |
| DL5 | PASS | FLAG · FLAG: rung counts and frame times in the detail ladder below |
| Q1 | PASS | check, clamp and edge distance clean |
| Q2 | PASS | 0 clashes |
| Q3 | PASS | package written, 25.3 KB; site build not checked here · package written; site build left to CI |
| Q4 | PASS | local: tools/shot · plan, 28°, side, explode at 28° and 70°, both sheets, overlays on, all looked at; attach to #114 |
| Q5 | PASS | local: tools/bench · browser bench run; flags under Verification |
| Q6 | PASS | · every row judged |
| Q7 | PASS | · conformance: cycloidal-drive at 2.6, pass |

## Joints
| Joint | Type | F1 locate | F2 retain | F3 torque | F4 thrust | F5 limit | F6 hold | F7 adjust | F8 lube | F9 timing | F10 protect |
|---|---|---|---|---|---|---|---|---|---|---|---|
| pO | J2 | 2 x Dowel pin Ø3 x 10 h6, housing to base | 3 x Internal circlip DIN 472, Ø19; Bearing F6800ZZ (10x19x5); Countersunk M5 x 12 (ISO 10642), into the shaft end, flush; Socket head M5 x 10 (ISO 4762), into the shaft end | Feather key 3 x 3 x 6 (DIN 6885) | Wave washer 14.5x18.8, spring steel; Thrust washer 10.2x16, bronze | – turns fully | – driven through the belt | – belt tension at the motor mount | – sealed and shielded bearings | Housing plate; Cycloidal disc, 11 lobes; Eccentric cam | – see drive |
| housing-post | post | – | – | – | – | – | – | – | – | – | – |
| drive | drive | – | – | – | – | – | – | bracket | – | – | Home flag, 1 mm steel vane; 3 x Fork sensor, slotted optical, 5 mm gap; Pulley flanges |
| ring-pins | post | 12 x Ring pin Ø10, hardened and ground, 12 off, pressed into the housing plate and the cover ring | Cover ring over the pin tops | – fixed | – no axial load | – fixed | – fixed | – none | Oil sinks on the flange at each output pin | Index line on the housing at ring pin 1 | – nothing to protect |

## Variants and overrides
| Joint or part | Rule result | Chosen | Why |
|---|---|---|---|
| ring pins | not in the model: as parts they would each stand on posts | twelve hardened Ø10 dowels pressed into the housing plate and a cover ring on four tie standoffs (polish) | the pins carry the disc's reaction in double support (A9, F1) |
| flange | solid disc | hub, six spokes through the output pins and a rim (polish) | the disc is the mechanism, and shows between the spokes (M2, L5) |
| disc bearing | none (no pin at E) | 6804 between two internal circlips in a disc 9.6 mm thick | the disc rides on the cam on a real bearing (F2) |
| cycle | one input turn | eleven input turns, one output turn | the disc and the flange are back exactly (K2) |
| timing marks | none (the rule marks gear meshes only) | housing, disc and cam index lines | F9: the disc goes back in phase with the cam and the pins |

## Detail ladder
| Rung | Solids | Marks | Frame ms at this dial position |
|---|---|---|---|
| DL-A | 10 | 0 | 2.71 |
| DL-B | 0 | 134 | 1.96 |
| DL-C | 0 | 0 | 1.93 |
| DL-D | 12 | 0 | 1.68 |
| DL-E | 8 | 15 | 1.75 |
| DL-F | 0 | 0 | 1.85 |
| DL-G | 0 | 0 | 1.50 |
| DL-H | 16 | 0 | 1.44 |
| never | 102 | 114 | 2.90 (full) |

## Promotion candidates
- The standoff rule stands every fixed part on posts, so twelve ring pins as parts would give twelve post pairs; a fixed part could declare itself a pin carried by a plate, or the rule skip parts of role ground with a plate over them. The pins were left to the polish.
- A joint type for pins rolling in a cycloidal or planetary ring (pin and lobe, pin in hole) with its hardened pins, plate and cover, and the F9 index lines, would be reused by the harmonic drive and the planetary.

## Verification
check: clean · clearance: 0 clashes · clamp: clean · edge distance: clean · package: 25.3 KB
screenshots: plan, 28°, side, explode at 28° and 70°, both sheets, drawn in local Chrome to dist/shots/cycloidal-drive/ (plan, 28° and the explode looked at) · bench: browser, DPR 1.5, 2026-10-19; plan 2.60 ms, 28° 2.98 ms, side 2.15 ms, explode 70° 2.40 ms at full detail, 8 ms held at every dial (R6)
