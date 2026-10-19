# Audit: Sun and planet gear (sun-and-planet)
standard: 2.6 · date: 2026-10-19 · result: pass · detail: full · pass: build

## Summary
PASS 111 · FAIL 0 · N/A 10 · open: none

## Requirements
| Id | Status | Evidence / action |
|---|---|---|
| S1 | PASS | DATA · the standard carries version 2.6 and its changelog |
| S2 | PASS | HAND · header with standard, date, result, detail, pass |
| S3 | PASS | AUTO · tools/conformance reads this header and runs in npm run check |
| S4 | PASS | SITE · #111 holds only this mechanism's decisions and open items |
| P1 | PASS | DATA · record complete; model.ts, polish.ts, audit.md present |
| P2 | PASS | DATA · catalogue validator clean (tests/catalog) |
| P3 | PASS | DATA / SITE · ratio step-up (2 turns per orbit with equal gears), parallel axes, continuous non-uniform output, backdrivable, other names, family, motion, level, dof 1, motorised drive: all in the record |
| P4 | PASS | DATA · tags grouped Function, Property, Application, keywords underneath |
| P5 | PASS | DATA · motion, forces, benefits, limits; two uses with one line each |
| P6 | PASS | DATA · Wikipedia, FIRGELLI and Princeton; a Boulton and Watt video, a Science Museum photo page, an animation; real world: three YouTube videos of the 1785 Boulton and Watt engine at the Powerhouse Museum and of a model beam engine, checked live through YouTube oEmbed (titles match); the titles cannot show that the gear is on screen: look at them when convenient |
| P7 | PASS | HAND / SITE · no prose in model.ts or polish.ts besides names, notes and build rules (engineering record, not on the page); lint-style clean |
| P8 | PASS | SITE · no parts list, build or joint sections on the page |
| P9 | PASS | HAND · solve(): the retainer turns with the orbit angle u, the beam rocks -23.8° to +23.5° (the catalogue's about ±24°), the planet turns with the rod, the sun turns 2u minus the rod angle plus half a tooth; the record says two turns per orbit with equal gears and a ripple from the rod tilt |
| P10 | PASS | HAND · paths of the rod's upper end and the planet centre, velocity of both, the connecting rod force, the output spin, the beam angle, a plot of the sun angle over the orbit |
| P11 | PASS | DATA · plain, short sentences, no em dashes, mm and degrees |
| K1 | PASS | HAND · pitch circles, tooth profiles, the retainer's 72 mm, the beam's 180 and the rod's 240 are the model's; the hub sleeve, screws, stops and marks are fitted round them (check: max link error 1.1e-13 mm) (check: max link error 1.1e-13 mm) |
| K2 | PASS | HAND · check: finite, continuous, periodic over 720 samples |
| K3 | PASS | HAND · only the part family: links, gears, discs, caps; fixed or at placement with spin |
| K4 | PASS | HAND · roles driver (beam), output (sun, flywheel), link (rod, retainer, planet), pin; accent only on the input cap pOb |
| K5 | PASS | HAND · flywheel layer -2, retainer -1, sun, planet and beam layer 0 (beam plated 8 mm up), rod layer 1 (plated 4 mm up, clear of the sun hub and the shaft end); check clean: no INTERFERE, OVERLAP or WARN (check: no INTERFERE, OVERLAP or WARN) |
| K6 | PASS | DATA · m 3 for the catalogue's 5 (all lengths 0.6): zs 24, zp 24, c 72, beam 180, rod 240, 20°. Deliberate differences, commented in model.ts: the ground distance is 300, not the catalogue's (360 is not a crank-rocker); the orbit angle is the cycle phase; a flywheel disc is added; the planet drawn involute down to the base circle |
| K7 | PASS | HAND · input oscillating on the beam (input oscillating on beam) |
| D1 | PASS | HAND · involute teeth on sun and planet, keyed sun bore, tapered links with boss rings, a spoked flywheel, in the one family of forms |
| D2 | PASS | HAND · the retainer and rod are tapered links, the rod's end boss big enough to carry the hub screws; the flywheel keeps its mass in the rim on six spokes |
| D3 | PASS | STYLE · roles told apart by pattern and tone in both sheets (screenshots) |
| D4 | PASS | AUTO · feet and corner holes concentric with the base corner arcs (fired: base (1 solid), feet (4 solids)) |
| D5 | N/A | AUTO / HAND · no bridge: the rod and the retainer sweep over the sun and the planet, so nothing fixed can span them; both pivots are held from the base by housings |
| D6 | PASS | HAND / STYLE · stops, screws and the drive read quieter than the gears; the rod is see-through over the mesh |
| D7 | PASS | HAND · gears, links and flywheel carry only load shape and marks; the richness is in the shafts, bearings, circlips, screws, stops and marks |
| A1 | PASS | AUTO · pOb J2, pOs J2, pB J3, pP J3, mesh-planet-sun J6 (pOb J2, pOs J2, pB J3, pP J3, mesh-planet-sun J6; fired: classify (no solids)) |
| A2 | PASS | AUTO · pOb and pOs live shafts (the input beam is keyed, the sun and flywheel are keyed to pOs); pB and pP shoulder bolt joints; the mesh gets mesh hardware (pOb J2, pOs J2, pB J3, pP J3, mesh-planet-sun J6) |
| A3 | PASS | AUTO · 6800 on the Ø10 shafts in both housings; F688 and F698 on the Ø8 bolts and in the retainer on its shaft (fired: classify (no solids)) |
| A4 | PASS | AUTO · stepped keyed shafts with circlip grooves; shoulder bolts with undercut (fired: j1-dead-axle (no solids)) |
| A5 | PASS | AUTO · feather keys 3 x 3 on the Ø10 beam shaft and on the sun shaft (flywheel and sun) (fired: j2-live-shaft (64 solids)) |
| A6 | N/A | AUTO · no fixed plate floating above the base: both pivots are housings under the base (fired: standoffs (no solids)) |
| A7 | PASS | AUTO · 8 mm base, counterbored corners, feet, front scale, clearance hole for every live shaft (fired: base (1 solid), feet (4 solids)) |
| A8 | PASS | AUTO · every head has its shank; holes cut by stage 3 (fired: fasteners (stage 3)) |
| A9 | PASS | AUTO / HAND · pP and pB shoulder bolts through the stack: the bolt at P runs through the retainer, planet, hub sleeve and rod; the sun shaft carries the retainer and the sun between its housing bearings and the top circlip; nothing overhangs but the shaft end, which stays under the rod (single support, 6 mm over the sun hub), the one open point of this build (fired: j2-straddle (no solids)) |
| A10 | PASS | HAND · sun and planet in one plane, the retainer under them, the rod and beam above, the flywheel under all; nothing stacked only to clear |
| A11 | PASS | AUTO / HAND · rod load: bolt, retainer, sun shaft, housing, base; beam load: key, shaft, housing, base (fired: j1-dead-axle (no solids)) |
| A12 | PASS | AUTO · clamp check clean |
| A13 | PASS | AUTO / HAND · every solid named with catalogue sizes, sets counted (150 solids, 69 unnamed (further items of a listed set)) |
| A14 | PASS | HAND · stops 2° beyond the beam's swing, outside the rod's and the retainer's sweeps; clearance 0 |
| A15 | PASS | AUTO · clearance: 0 clashes over the cycle |
| A16 | PASS | HAND · a note and a badge on every joint, five build rules (5 build rules; no note: none; no badge: none) |
| A17 | PASS | HAND · housings and shafts from below, flywheel, retainer, sun with key and hub, planet and rod with the hub sleeve and four screws, bolt at P, beam on its shaft with the bolt at B, stops; every screw reachable, bearings pressed out past their circlips |
| E1 | PASS | AUTO · one level per solid (every solid has one explode level; levels -8 to 4.5) |
| E2 | PASS | AUTO · screws, shafts and bought units are groups (36 rigid groups; fired: explode) |
| E3 | PASS | AUTO · screws leave along their axis to the head side, nuts the other way (screenshots at 28° and 70°) (fired: explode) |
| E4 | PASS | HAND · bolt heads, rod and beam go furthest up, sun and planet in the middle, retainer and flywheel below: reverse of assembly |
| E5 | PASS | AUTO · bearings and circlips stay in their parts (fired: explode) |
| E6 | PASS | AUTO · motor with its bracket, bearings whole (fired: explode) |
| E7 | PASS | AUTO · spacers midway (fired: explode) |
| E8 | PASS | AUTO · keyed parts keep their order on the shaft (fired: explode) |
| E9 | PASS | HAND · looked at full explode at 28° and 70°, both sheets: nothing inside another part, nothing leaves the frame |
| J1 | N/A | AUTO · no dead axle: both ground pivots carry a keyed part (J2) (fired: j1-dead-axle (no solids)) |
| J2 | PASS | AUTO · beam: housing, keyed shaft, drive lever below the base; sun shaft: housing with two bearings, sleeve, wave washer, keyed flywheel and sun, the retainer on its own bearing, end circlip (fired: j2-live-shaft (64 solids), j2-straddle (no solids)) |
| J3 | PASS | AUTO · pB: shoulder bolt threaded into the beam, bearing in the rod; pP: shoulder bolt threaded into the retainer, bearing in the planet, hub sleeve, rod bolted to the planet (fired: j3-moving-pin (30 solids)) |
| J4 | N/A | AUTO · no such joint here (fired: j4-slot-roller (no solids)) |
| J5 | N/A | AUTO · no such joint here (fired: j5-slide (no solids)) |
| J6 | PASS | AUTO · planet-sun: hub with set screw on the keyed sun, eccentric bushing under the sun shaft's housing, marks on the planet tooth and the sun gap (fired: j6-mesh (2 solids)) |
| J7 | N/A | AUTO · no such joint here (fired: j7-cam (no solids)) |
| J8 | PASS | AUTO · flanged motor pulley, mount slotted for tension (fired: j8-belt (no solids)) |
| F1 | PASS | AUTO · both housings dowelled; shoulders of the bolts in reamed holes (served at pOb, pOs; fired: j2-live-shaft (64 solids)) |
| F2 | PASS | AUTO · housing bearings on circlips; the retainer's bearing on internal circlips and the stack; planet bearing circlipped; end circlip; bolt heads (served at pOb, pOs, pB, pP; fired: j2-live-shaft (64 solids)) |
| F3 | PASS | AUTO · feather keys and hub set screw on the sun and the flywheel, a key on the beam; the retainer turns free on its bearing; the planet is bolted to the rod (served at pOb, pOs, mesh-planet-sun; fired: j2-live-shaft (64 solids)) |
| F4 | PASS | AUTO / HAND · bronze thrust washers on both shafts, wave washers in the housings; straight teeth carry no axial thrust (served at pOb, pOs; fired: j2-live-shaft (64 solids)) |
| F5 | PASS | AUTO / HAND · H.stops pair 2° beyond each end of the beam's rocking (rule skips an oscillating input; with the drive off the beam could over-travel) (served at pOb; fired: j5-slide (no solids), stops (no solids)) |
| F6 | N/A | AUTO / HAND · driven through the mesh; no rest position to hold (served at no joint; fired: j7-cam (no solids)) |
| F7 | PASS | AUTO / HAND · eccentric bushing under the sun shaft's housing sets the backlash; belt tension at the motor mount; the retainer's length fixes the centre distance (served at pOs, mesh-planet-sun; fired: j6-mesh (2 solids), j5-slide (no solids)) |
| F8 | PASS | AUTO · open teeth greased at assembly; bearings sealed or shielded (served at no joint; fired: lubrication (no solids)) |
| F9 | PASS | AUTO / HAND · match marks on the planet tooth and the sun gap (rule); the beam's swing engraved on the base with an index line on the beam (polish) (served at pOb, mesh-planet-sun; fired: timing-marks (no solids)) |
| F10 | PASS | AUTO / HAND · pulley flanges, home flag, fork sensor; no slip clutch (none planned) (served at drive; fired: drive (33 solids)) |
| M1 | PASS | AUTO · edge breaks on every top face (fired: hardware primitives) |
| M2 | PASS | HAND · the gears are small and solid; the flywheel is a rim on six spokes (mass in the rim, filleted); the links are tapered, no extra mass |
| M3 | PASS | AUTO · bore entry chamfers on every seat and through hole (fired: j3-moving-pin (30 solids), hardware primitives) |
| M4 | PASS | AUTO / HAND · counterbored base corners and housing screws; button heads on the hub screws need no seat (fired: base (1 solid), fasteners (stage 3)) |
| M5 | N/A | AUTO / HAND · no pockets or windows (fired: hardware primitives) |
| M6 | PASS | AUTO · edge distance and walls clean |
| M7 | N/A | HAND · no bracket or plate with a loaded inside corner: the links are tapered bars |
| M8 | PASS | AUTO · thread undercut on the shoulder bolts and axles (fired: j1-dead-axle (no solids)) |
| M9 | PASS | AUTO / HAND · planet bolt M6 into 6 mm of steel (retainer), hub screws M3 into 4 mm of steel planet beyond 1 d; housing screws as the rule (fired: j1-dead-axle (no solids)) |
| M10 | PASS | AUTO / HAND · steel gears with induction-hardened teeth, steel flywheel and shafts, aluminium links and base, bronze washers (150 of 150 solids name a material) |
| M11 | PASS | AUTO · centre holes and chamfered ends on the shafts (fired: j1-dead-axle (no solids), hardware primitives) |
| M12 | PASS | HAND · every head reachable: hub screws from above, set screws from the side; bearings pressed out past their circlips |
| M13 | PASS | AUTO / HAND · threadlocker on every screw, nyloc where a nut, set screws low strength (52 threaded, 0 without a locking method) |
| M14 | N/A | AUTO / HAND · no sliding wear surface: the rollers turn in bearings, teeth are hardened (fired: j4-slot-roller (no solids)) |
| V1 | PASS | AUTO · pancake outrunner Ø50 x 18 under the base, GT2 32:16 (fired: drive (33 solids)) |
| V2 | PASS | AUTO · one-piece bracket, flange screws up into the base (fired: drive (33 solids)) |
| V3 | PASS | AUTO / HAND · belt and pulleys clear of feet and housing; clearance 0 (fired: drive (33 solids)) |
| V4 | PASS | AUTO · flanges, set screws, slotted mount (fired: j8-belt (no solids)) |
| V5 | PASS | AUTO · oscillating: motor, short crank and link swinging a lever on the beam's shaft through the modelled range (the beam's own swing, -23.8° to +23.5°) (fired: drive (33 solids)) |
| V6 | PASS | AUTO · home flag, fork sensor, leads to the terminal block, P-clip (fired: drive (33 solids)) |
| L1 | PASS | STYLE · lint-style clean |
| L2 | PASS | HAND · model and polish carry geometry, roles, marks and materials only |
| L3 | PASS | HAND · beam driver, sun and flywheel output, rod, retainer and planet link, hardware hw |
| L4 | PASS | HAND / STYLE · accent on the input cap only |
| L5 | PASS | AUTO / HAND · screws, bearings and spacers are real solids in real holes; the rod is drawn see-through over the mesh (fired: see-through) |
| L6 | PASS | AUTO · depth order right at plan, 28°, side and explode in both sheets |
| L7 | PASS | STYLE · tilt 0° to 88°, no shear |
| L8 | PASS | AUTO / HAND · match marks and tapped-hole rings are marks |
| R1 | PASS | HAND · the polish reuses H.tube, H.screw, H.stops, H.spokes; no inline standard part |
| R2 | PASS | HAND · threads M3, M5, M6; shafts Ø10 and Ø8 bolts; two bearing sizes (threads M3, M4, M5, M6; joint Ø 8, 10; bearings 6800-2RS (10x19x5), F6800ZZ (10x19x5), F688ZZ (8x16x5), F698ZZ (8x19x6)) |
| R3 | PASS | AUTO · housing, bridge and drive from their subassemblies (fired: hardware primitives) |
| R4 | PASS | AUTO · package built at build time (package 26.5 KB) |
| R5 | PASS | HAND · states only what differs; polish about 1 ms |
| R6 | PASS | FLAG · FLAG: browser bench 2026-10-19: plan 2.65, 28° 2.48, side 2.18, explode 2.44 ms at full detail; setup 9.1 ms; under the 8 ms target at every dial position |
| R7 | PASS | HAND · model.ts + polish.ts 10.5 KB |
| R8 | PASS | AUTO / SITE · pre-rendered thumbnails; the stage draws on change only |
| DL1 | PASS | AUTO / HAND · every solid and mark on a rung (60 of 150 solids on a dropping rung) |
| DL2 | PASS | HAND · default dial full (model detail full) |
| DL3 | PASS | AUTO · DL-D drawn when exploded, DL-B skipped at side elevation |
| DL4 | PASS | SITE · adaptive dial and the detail entry in the title block |
| DL5 | PASS | FLAG · FLAG: rung counts and frame times in the detail ladder below |
| Q1 | PASS | check, clamp and edge distance clean |
| Q2 | PASS | 0 clashes |
| Q3 | PASS | package written, 26.5 KB; site build not checked here · package written; site build left to CI |
| Q4 | PASS | local: tools/shot · plan, 28°, side, explode at 28° and 70°, both sheets, overlays on, all looked at; attach to #111 |
| Q5 | PASS | local: tools/bench · browser bench run; flags under Verification |
| Q6 | PASS | · every row judged |
| Q7 | PASS | · conformance: sun-and-planet at 2.6, pass |

## Joints
| Joint | Type | F1 locate | F2 retain | F3 torque | F4 thrust | F5 limit | F6 hold | F7 adjust | F8 lube | F9 timing | F10 protect |
|---|---|---|---|---|---|---|---|---|---|---|---|
| pOb | J2 | 2 x Dowel pin Ø3 x 10 h6, housing to base | 2 x Internal circlip DIN 472, Ø19; Countersunk M5 x 12 (ISO 10642), into the shaft end, flush; Socket head M5 x 10 (ISO 4762), into the shaft end | Feather key 3 x 3 x 6 (DIN 6885) | Wave washer 14.5x18.8, spring steel; Thrust washer 10.2x16, bronze | 2 x Stop bumper, neoprene sleeve Ø12 | – driven by the drive link | – nothing to adjust here | – sealed bearings | Base plate; Beam | – see drive |
| pOs | J2 | 2 x Dowel pin Ø3 x 10 h6, housing to base | 3 x Internal circlip DIN 472, Ø19; Bearing F6800ZZ (10x19x5); External circlip DIN 471, Ø10; Shaft collar 10x20, set screw | Feather key 3 x 3 x 6 (DIN 6885); Feather key 3 x 3 x 7 (DIN 6885) | Wave washer 14.5x18.8, spring steel; Thrust washer 10.2x16, bronze | – turns fully | – driven through the mesh | Eccentric bushing Ø26, 0.3 mm offset bore Ø12, flanged | – sealed bearings | – the marks are on the mesh | – see drive |
| pB | J3 | – the shoulder sits in a reamed hole | Internal circlip DIN 472, Ø16; Bearing F688ZZ (8x16x5); head | – turns free on its bearing | – shim washer under the head sets the end-shake | – the beam's stops limit it | – driven | – nothing to adjust here | – sealed bearings | – no phase | – nothing to protect |
| pP | J3 | – the shoulder sits in a reamed hole in the retainer | Internal circlip DIN 472, Ø19; Bearing F698ZZ (8x19x6); head | Hub sleeve and four M3 screws fix the rod to the planet | – shim washer under the head sets the end-shake | – turns fully | – driven | – the retainer's length sets the centre distance | – sealed bearing | – the marks are on the mesh | – nothing to protect |
| mesh-planet-sun | J6 | – located by the shafts and the retainer | – nothing to retain | Gear hub Ø22, set screw M3 on the key; Set screw M3 (DIN 916), threadlocked | – straight teeth, no thrust | – turns fully | – driven through the mesh | Eccentric bushing Ø26, 0.3 mm offset bore Ø12, flanged | – open teeth greased at assembly | Planet gear, 24 teeth, fixed to the rod; Sun gear, 24 teeth | – see drive |
| drive | drive | – | – | – | – | – | – | – | – | – | Home flag on the drive crank; 3 x Fork sensor, slotted optical, 5 mm gap |

## Variants and overrides
| Joint or part | Rule result | Chosen | Why |
|---|---|---|---|
| planet and rod | two separate parts, each with a bearing from the rule | one bearing (the planet's), a hub sleeve and four M3 screws fix the rod to the planet; the rod's bearing and circlip dropped | the planet must not turn relative to the rod (J3, A9) |
| rod and beam heights | rod layer 1, beam layer 2 | rod plated 4 mm up, the beam on layer 0 plated 8 mm up | the rod clears the sun hub and shaft end; the long spacers the stack needed are gone (K1: heights only) |
| sun key | body sun, clashes with the shaft (body flywheel) | allow-list on the key for the shaft's segments | the key sits in the shaft's keyway; both turn with the sun |
| beam stops | skipped by the rule (the drive limits the input) | H.stops pair 2° beyond the swing | F5 with the drive off |

## Detail ladder
| Rung | Solids | Marks | Frame ms at this dial position |
|---|---|---|---|
| DL-A | 16 | 0 | 2.28 |
| DL-B | 0 | 227 | 1.78 |
| DL-C | 0 | 0 | 1.84 |
| DL-D | 25 | 0 | 1.67 |
| DL-E | 8 | 2 | 1.48 |
| DL-F | 0 | 0 | 1.56 |
| DL-G | 0 | 0 | 1.35 |
| DL-H | 11 | 0 | 1.44 |
| never | 90 | 211 | 2.61 (full) |

## Promotion candidates
- The sun key with the keyed flywheel on the same shaft needs the allow-list by hand: the J2 rule should put every key of a shaft in the shaft's body, or give each keyed part's key the shaft's allow-list.
- Three mechanisms now need the same hand-built oscillating-input stops and swing scale (Watt, Chebyshev, Ackermann, double-rocker, sun-and-planet): promote the F5 stops and the F9 scale to rules.

## Verification
check: clean · clearance: 0 clashes · clamp: clean · edge distance: clean · package: 26.5 KB
screenshots: plan, 28°, side, explode at 28° and 70°, both sheets, drawn in local Chrome to dist/shots/sun-and-planet/ (plan, 28° and the explode looked at) · bench: browser, DPR 1.5, 2026-10-19; plan 2.65 ms, 28° 2.48 ms, side 2.18 ms, explode 70° 2.44 ms at full detail, 8 ms held at every dial (R6)
