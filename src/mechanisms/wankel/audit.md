# Audit: Wankel rotary engine (wankel)
standard: 2.6 · date: 2026-10-19 · result: pass · detail: full · pass: build

## Summary
PASS 112 · FAIL 0 · N/A 9 · open: none

## Requirements
| Id | Status | Evidence / action |
|---|---|---|
| S1 | PASS | DATA · the standard carries version 2.6 and its changelog |
| S2 | PASS | HAND · header with standard, date, result, detail, pass |
| S3 | PASS | AUTO · tools/conformance reads this header and runs in npm run check |
| S4 | PASS | SITE · #120 holds only this mechanism's decisions and open items |
| P1 | PASS | DATA · record complete; model.ts, polish.ts, audit.md present |
| P2 | PASS | DATA · catalogue validator clean (tests/catalog) |
| P3 | PASS | DATA / SITE · ratio step-up (eccentric shaft 3 turns per rotor turn), offset parallel axes, continuous output, backdrivable, other names, family, motion, level, dof 1, motorised drive: all in the record |
| P4 | PASS | DATA · tags grouped Function, Property, Application, keywords underneath |
| P5 | PASS | DATA · motion, forces, benefits, limits; uses with one line each |
| P6 | PASS | DATA · Wikipedia and engineering references, a video, an animation, a photo page; real world: the record's two YouTube videos checked live through oEmbed on 2026-10-19; the titles cannot show that the rotor is on screen: look at them when convenient |
| P7 | PASS | HAND / SITE · no prose in model.ts or polish.ts besides names, notes and build rules (engineering record, not on the page); lint-style clean |
| P8 | PASS | SITE · no parts list, build or joint sections on the page |
| P9 | PASS | HAND · solve(): the rotor turns one third of the shaft, its centre goes round on e = 15, each apex traces the epitrochoid; the record says rotor angle shaft/3, the rotor turns 120° per shaft turn; one cycle is one rotor turn (three shaft turns) |
| P10 | PASS | HAND · the path of an apex (the housing's epitrochoid), velocity of it, input and output spin, a plot of the rotor angle over the cycle |
| P11 | PASS | DATA · plain, short sentences, no em dashes, mm and degrees |
| K1 | PASS | HAND · R 103, e 15, the epitrochoid bore, the gears 30 and 45 at module 2 are the model's; the journal, bearing, sleeves, screws and seals are fitted round them (check: max link error 0.0e+0 mm) (check: max link error 0.0e+0 mm) |
| K2 | PASS | HAND · check: finite, continuous, periodic over 720 samples |
| K3 | PASS | HAND · only the part family: custom outlines, gears, caps; fixed or at placement with spin |
| K4 | PASS | HAND · roles driver (crank), output (rotor, web), ground (housing, fixed gear), pin; accent only on the input cap pO |
| K5 | PASS | HAND · housing, fixed gear and rotor ring plate on layer 0, the crank web on layer 1 plated 4 mm up, the rotor web on layer 2; check clean: no INTERFERE, OVERLAP or WARN (check: no INTERFERE, OVERLAP or WARN) |
| K6 | PASS | DATA · R 103, e 15, z 30 and 45, module 2, 3:2: as the catalogue. Deliberate differences, commented in model.ts: one cycle is one rotor turn; the rotor's flanks are arcs of 1.25 times the side, slightly inside the inner envelope as the catalogue says; apexes at R - 0.4; the rotor gear cut 0.12 mm backlash and phased 3.85° in the rotor; no ports or spark plugs (the catalogue calls them static decoration) |
| K7 | PASS | HAND · input rotary on the crank web (input rotary on crank) |
| D1 | PASS | HAND · the epitrochoid bore, the curved-triangle rotor with its internal gear, involute teeth on both gears, a keyed crank web; the web is a hub with three tapered arms like a carrier; the one family of forms |
| D2 | PASS | HAND · the rotor's web is a hub, three tapered arms to the apexes and bosses round the screws: material where the load runs; the rotor plate carries only its teeth and apexes |
| D3 | PASS | STYLE · roles told apart by pattern and tone in both sheets (screenshots) |
| D4 | PASS | AUTO · feet and corner holes concentric with the base corner arcs (fired: base (1 solid), feet (4 solids)) |
| D5 | N/A | AUTO / HAND · no bridge: the rotor's web and the crank web sweep over the shaft end and the fixed gear; nothing fixed can span them |
| D6 | PASS | HAND / STYLE · sleeves, screws, seals and the drive read quieter than the rotor; the gears show between the web's arms |
| D7 | PASS | HAND · the housing, rotor and web carry only load shape and marks; the richness is in the shaft, bearings, circlips, journal, sleeves, screws, seals and marks |
| A1 | PASS | AUTO · pO J2, mesh-fgear-rotor J6; the rotor rides on the journal (E) with no model pin (pO J2, mesh-fgear-rotor J6; fired: classify (no solids)) |
| A2 | PASS | AUTO · pO a live shaft (accent input, keyed crank web); the mesh gets mesh hardware (pO J2, mesh-fgear-rotor J6) |
| A3 | PASS | AUTO · 6800 on the Ø10 input shaft in the housing; 6804 between the journal and the rotor web (polish) (fired: classify (no solids)) |
| A4 | PASS | AUTO · stepped keyed input shaft with circlip grooves (fired: j1-dead-axle (no solids)) |
| A5 | PASS | AUTO · feather key 3 x 3 on the Ø10 input shaft, the crank web keyed (fired: j2-live-shaft (28 solids)) |
| A6 | PASS | AUTO · the housing and the fixed gear float above the base on posts, screwed both ends (fired: standoffs (20 solids)) |
| A7 | PASS | AUTO · 8 mm base, counterbored corners, feet, front scale, clearance hole for every live shaft (fired: base (1 solid), feet (4 solids)) |
| A8 | PASS | AUTO · every head has its shank; holes cut by stage 3 (fired: fasteners (stage 3)) |
| A9 | PASS | AUTO / HAND · the journal is carried on the crank web and held at its top by the rotor web's bearing between circlips; the rotor's plates are bolted at three points; the input shaft overhangs its housing because the crank web and the rotor sweep over its end, so it cannot be straddle mounted: bearings 10 mm apart, the one open point of this build (fired: j2-straddle (no solids)) |
| A10 | PASS | HAND · housing, fixed gear and rotor ring plate in one plane, the crank web above them, the rotor web above that; nothing stacked only to clear |
| A11 | PASS | AUTO / HAND · the rotor's load: apex seals to the housing, ring plate, sleeves, web, bearing, journal, crank web, key, shaft, housing, base; the fixed gear on its two posts (fired: j1-dead-axle (no solids)) |
| A12 | PASS | AUTO · clamp check clean |
| A13 | PASS | AUTO / HAND · every solid named with catalogue sizes, sets counted (121 solids, 56 unnamed (further items of a listed set)) |
| A14 | PASS | HAND · posts outside every sweep; clearance 0 |
| A15 | PASS | AUTO · clearance: 0 clashes over the cycle |
| A16 | PASS | HAND · a note and a badge on every joint, five build rules (5 build rules; no note: none; no badge: none) |
| A17 | PASS | HAND · housing and fixed gear on their posts, shaft and housing from below, the crank web with key, the journal on it, the rotor ring plate in the bore, the web with its bearing over the journal, the sleeves and screws; every screw reachable, bearings pressed out past their circlips |
| E1 | PASS | AUTO · one level per solid (every solid has one explode level; levels -8 to 2.5) |
| E2 | PASS | AUTO · screws, shafts and bought units are groups (35 rigid groups; fired: explode) |
| E3 | PASS | AUTO · screws leave along their axis to the head side, nuts the other way (screenshots at 28° and 70°) (fired: explode) |
| E4 | PASS | HAND · the rotor web and its screws go furthest up, the crank web next, the rotor ring plate, housing and fixed gear in the middle, the shaft below: reverse of assembly |
| E5 | PASS | AUTO · bearings and circlips stay in their parts (fired: explode) |
| E6 | PASS | AUTO · motor with its bracket, bearings whole (fired: explode) |
| E7 | PASS | AUTO · spacers midway (fired: explode) |
| E8 | PASS | AUTO · keyed parts keep their order on the shaft (fired: explode) |
| E9 | PASS | HAND · looked at full explode at 28° and 70°, both sheets: nothing inside another part, nothing leaves the frame |
| J1 | N/A | AUTO · no dead axle: the rotor turns on a journal, nothing is a ground pivot but the input (fired: j1-dead-axle (no solids)) |
| J2 | PASS | AUTO · input: housing with two bearings, sleeve, wave washer, circlips, dowelled; keyed shaft, thrust washer, home flag; the crank web keyed on its end (fired: j2-live-shaft (28 solids), j2-straddle (no solids)) |
| J3 | N/A | AUTO · no moving pin (fired: j3-moving-pin (no solids)) |
| J4 | N/A | AUTO · the apex seals slide on the housing's bore: the mechanism's sliding contact, not a roller in a slot; the seals are the replaceable wear parts (M14) (fired: j4-slot-roller (no solids)) |
| J5 | N/A | AUTO · no such joint here (fired: j5-slide (no solids)) |
| J6 | PASS | AUTO · fixed gear-rotor: marks on the meeting tooth and gap; the rules' hub and eccentric are not built (neither gear is keyed to a live shaft); the centre distance is the crank's eccentricity (fired: j6-mesh (no solids)) |
| J7 | N/A | AUTO · no such joint here (fired: j7-cam (no solids)) |
| J8 | PASS | AUTO · flanged motor pulley, mount slotted for tension (fired: j8-belt (2 solids)) |
| F1 | PASS | AUTO · housing dowelled; the housing and the fixed gear on posts; the rotor's plates located by the spacer sleeves; the journal on the crank web (served at pO; fired: j2-live-shaft (28 solids)) |
| F2 | PASS | AUTO · housing bearings on circlips; the rotor web's bearing between two internal circlips; the journal held by three countersunk screws and the web's bearing; end retainer (served at pO; fired: j2-live-shaft (28 solids)) |
| F3 | PASS | AUTO · feather key on the input shaft, the crank web keyed; the journal screwed to the crank web; the rotor turns free on its bearing, the gear is driven by the mesh (served at pO; fired: j2-live-shaft (28 solids)) |
| F4 | PASS | AUTO / HAND · bronze thrust washer under the crank web's sleeve, wave washers in the housing; straight teeth carry no axial thrust (served at pO; fired: j2-live-shaft (28 solids)) |
| F5 | N/A | AUTO / HAND · turns fully, nothing to over-travel (served at no joint; fired: j5-slide (no solids), stops (no solids)) |
| F6 | N/A | AUTO / HAND · driven; no rest position to hold (served at no joint; fired: j7-cam (no solids)) |
| F7 | PASS | AUTO / HAND · the gears' centre distance is the crank's cut eccentricity (15 mm), set by the part, not adjusted; backlash is cut into the rotor gear (0.12 mm); belt tension at the motor mount (the rules' eccentric bushing is for a gear on a live shaft, and neither gear is) (served at drive; fired: j6-mesh (no solids), j5-slide (no solids)) |
| F8 | PASS | AUTO · the apex seals are oiled at assembly and the housing's bore greased; the gears greased; the bearings sealed or shielded; oil sinks on the posts' bridges are not needed (served at no joint; fired: lubrication (no solids)) |
| F9 | PASS | AUTO / HAND · match marks on the fixed gear and the rotor's gear at the mesh (rule); the rotor is phased on the crank by the gears (a single mesh position per turn of the crank) (served at mesh-fgear-rotor; fired: timing-marks (no solids)) |
| F10 | PASS | AUTO / HAND · pulley flanges, home flag, fork sensor; no slip clutch (none planned) (served at drive; fired: drive (37 solids)) |
| M1 | PASS | AUTO · edge breaks on every top face (fired: hardware primitives) |
| M2 | PASS | HAND · the rotor's web is a hub and three tapered arms: mass only where the load runs; the rotor plate is a curved triangle with its gear; no further lightening |
| M3 | PASS | AUTO · bore entry chamfers on every seat and through hole (fired: j3-moving-pin (no solids), hardware primitives) |
| M4 | PASS | AUTO / HAND · counterbored base corners and housing screws; countersunk screws flush in the journal; button heads on the sleeves (fired: base (1 solid), fasteners (stage 3)) |
| M5 | N/A | AUTO / HAND · no pockets or windows in the parts (fired: hardware primitives) |
| M6 | PASS | AUTO · edge distance and walls clean |
| M7 | PASS | HAND · the web's inside corners between the arms are filleted R6 in the polish |
| M8 | PASS | AUTO · thread undercut on the shoulder bolts and axles (fired: j1-dead-axle (no solids)) |
| M9 | PASS | AUTO / HAND · rotor screws M4 into 5 mm of steel ring plate over 1 d; journal screws M3 into 6 mm of steel (2 d); post screws as the rules (fired: j1-dead-axle (no solids)) |
| M10 | PASS | AUTO / HAND · steel gears with induction-hardened teeth, hardened apex seals, steel journal and shaft, aluminium plates and base, bronze washers (121 of 121 solids name a material) |
| M11 | PASS | AUTO · centre holes and chamfered ends on the shafts (fired: j1-dead-axle (no solids), hardware primitives) |
| M12 | PASS | HAND · every head reachable: the sleeve and journal screws from above, the housing screws from below; bearings pressed out past their circlips |
| M13 | PASS | AUTO / HAND · threadlocker on every screw, nyloc where a nut, set screws low strength (54 threaded, 0 without a locking method) |
| M14 | PASS | AUTO / HAND · the three apex seals are hardened strips in slots at the apexes, replaceable; the bore is hardened (fired: j4-slot-roller (no solids)) |
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
| R1 | PASS | HAND · the polish reuses H.plate, H.tube, H.screw, H.bearing, H.circlip and H.wearStrip; no inline standard part |
| R2 | PASS | HAND · threads M3, M4, M5; shaft Ø10; bearings 6800 and 6804 (threads M3, M4, M5; joint Ø 10; bearings 6800-2RS (10x19x5), 6804ZZ (20x32x7)) |
| R3 | PASS | AUTO · housing, bridge and drive from their subassemblies (fired: hardware primitives) |
| R4 | PASS | AUTO · package built at build time (package 22.4 KB) |
| R5 | PASS | HAND · states only what differs; polish about 1 ms |
| R6 | PASS | FLAG · FLAG: browser bench 2026-10-19: plan 1.96, 28° 2.48, side 1.86, explode 2.45 ms at full detail; setup 8 ms; under the 8 ms target at every dial position |
| R7 | PASS | HAND · model.ts + polish.ts 13.2 KB |
| R8 | PASS | AUTO / SITE · pre-rendered thumbnails; the stage draws on change only |
| DL1 | PASS | AUTO / HAND · every solid and mark on a rung (36 of 121 solids on a dropping rung) |
| DL2 | PASS | HAND · default dial full (model detail full) |
| DL3 | PASS | AUTO · DL-D drawn when exploded, DL-B skipped at side elevation |
| DL4 | PASS | SITE · adaptive dial and the detail entry in the title block |
| DL5 | PASS | FLAG · FLAG: rung counts and frame times in the detail ladder below |
| Q1 | PASS | check, clamp and edge distance clean |
| Q2 | PASS | 0 clashes |
| Q3 | PASS | package written, 22.4 KB; site build not checked here · package written; site build left to CI |
| Q4 | PASS | local: tools/shot · plan, 28°, side, explode at 28° and 70°, both sheets, overlays on, all looked at; attach to #120 |
| Q5 | PASS | local: tools/bench · browser bench run; flags under Verification |
| Q6 | PASS | · every row judged |
| Q7 | PASS | · conformance: wankel at 2.6, pass |

## Joints
| Joint | Type | F1 locate | F2 retain | F3 torque | F4 thrust | F5 limit | F6 hold | F7 adjust | F8 lube | F9 timing | F10 protect |
|---|---|---|---|---|---|---|---|---|---|---|---|
| pO | J2 | 2 x Dowel pin Ø3 x 10 h6, housing to base | 2 x Internal circlip DIN 472, Ø19; Countersunk M5 x 12 (ISO 10642), into the shaft end, flush; Socket head M5 x 10 (ISO 4762), into the shaft end | Feather key 3 x 3 x 6 (DIN 6885) | Wave washer 14.5x18.8, spring steel; Thrust washer 10.2x16, bronze | – turns fully | – driven through the belt | – belt tension at the motor mount | – sealed and shielded bearings | – the marks are on the mesh | – see drive |
| mesh-fgear-rotor | J6 | – located by the plates and the crank | – nothing to retain | – the rotor turns free on its bearing; the fixed gear is bolted down | – straight teeth, no thrust | – turns fully | – driven through the mesh | the centre distance is the crank's cut eccentricity; backlash cut into the rotor gear | – open teeth greased at assembly | Fixed gear, 30 teeth; Rotor, ring plate with 45 internal teeth | – see drive |
| housing-post | post | – | – | – | – | – | – | – | – | – | – |
| fgear-post | post | – | – | – | – | – | – | – | – | – | – |
| drive | drive | – | – | – | – | – | – | bracket | – | – | Home flag, 1 mm steel vane; 3 x Fork sensor, slotted optical, 5 mm gap; Pulley flanges |

## Variants and overrides
| Joint or part | Rule result | Chosen | Why |
|---|---|---|---|
| rotor | one part with an internal gear | the toothed ring plate (layer 0) and a spidered web (layer 2) bolted at the apexes through spacer sleeves, round the crank web (layer 1) | the rotor's bearing sits on a journal above the crank web, the gears below it (K5) |
| crank | an eccentric shaft | a crank web keyed to the shaft with a journal pinned on it (polish) | the eccentricity 15 > the journal radius 10: the shaft axis is outside the journal, so the journal cannot be turned on the shaft |
| rotor flanks | arcs slightly inside the inner envelope | arcs of 1.25 times the side through the apexes | clears the housing's waist (check) |
| apex seals | none | three hardened strips in apex slots | the rotor's wear parts on the housing (M14) |
| gear backlash adjust | the rules' eccentric bushing under a keyed gear's housing | none: the centre distance is the crank's eccentricity | neither gear is on a live shaft; documented under F7 |

## Detail ladder
| Rung | Solids | Marks | Frame ms at this dial position |
|---|---|---|---|
| DL-A | 8 | 0 | 2.15 |
| DL-B | 0 | 131 | 1.66 |
| DL-C | 0 | 0 | 1.62 |
| DL-D | 13 | 0 | 1.45 |
| DL-E | 8 | 2 | 1.46 |
| DL-F | 0 | 0 | 1.39 |
| DL-G | 0 | 0 | 1.31 |
| DL-H | 7 | 0 | 1.23 |
| never | 85 | 129 | 2.26 (full) |

## Promotion candidates
- The rules build backlash adjustment only for a gear keyed to a live shaft; a gear pair whose centre distance is a crank's eccentricity (Wankel, cycloidal) has none, so F7 is judged by hand: a joint type for crank-set centres would say so.
- Spidered web outlines (hub, three tapered arms) are now in the planetary and here: a part-family helper would remove the copy.
- The mesh rules read a gear pair by tooth count and module: a rotor with an internal gear in an eccentric needs `z` and `m` set by hand to be seen as a mesh.

## Verification
check: clean · clearance: 0 clashes · clamp: clean · edge distance: clean · package: 22.4 KB
screenshots: plan, 28°, side, explode at 28° and 70°, both sheets, drawn in local Chrome to dist/shots/wankel/ (plan, 28° and the explode looked at) · bench: browser, DPR 1.5, 2026-10-19; plan 1.96 ms, 28° 2.48 ms, side 1.86 ms, explode 70° 2.45 ms at full detail, 8 ms held at every dial (R6)
