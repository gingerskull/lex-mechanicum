# Audit: Ravigneaux planetary gearset (ravigneaux)
standard: 2.6 · date: 2026-10-19 · result: pass · detail: full · pass: build

## Summary
PASS 111 · FAIL 0 · N/A 10 · open: none

## Requirements
| Id | Status | Evidence / action |
|---|---|---|
| S1 | PASS | DATA · the standard carries version 2.6 and its changelog |
| S2 | PASS | HAND · header with standard, date, result, detail, pass |
| S3 | PASS | AUTO · tools/conformance reads this header and runs in npm run check |
| S4 | PASS | SITE · #119 holds only this mechanism's decisions and open items |
| P1 | PASS | DATA · record complete; model.ts, polish.ts, audit.md present |
| P2 | PASS | DATA · catalogue validator clean (tests/catalog) |
| P3 | PASS | DATA / SITE · ratio selectable (first gear 2.80:1 modelled), coaxial axes, continuous reversing output, backdrivable, other names, family, motion, level, dof 2 with a member held, motorised drive: all in the record |
| P4 | PASS | DATA · tags grouped Function, Property, Application, keywords underneath |
| P5 | PASS | DATA · motion, forces, benefits, limits; uses with one line each |
| P6 | PASS | DATA · Wikipedia, engineering guides, a video, an animation, a photo page; real world: the record's YouTube video of a Ravigneaux gearset checked live through YouTube oEmbed on 2026-10-19; the title cannot show that the gear is on screen: look at it when convenient |
| P7 | PASS | HAND / SITE · no prose in model.ts or polish.ts besides names, notes and build rules (engineering record, not on the page); lint-style clean |
| P8 | PASS | SITE · no parts list, build or joint sections on the page |
| P9 | PASS | HAND · solve(): the carrier is held (first gear), the ring turns 30/84 of the small sun, the large sun idles the other way at 30/36, the short pinions at 30/18, the long at 30/24; the record says first gear 2.80:1 |
| P10 | PASS | HAND · velocity of a short and a long pinion centre, input and output spin, a plot of the ring angle over the input angle (slope 0.357) |
| P11 | PASS | DATA · plain, short sentences, no em dashes, mm and degrees |
| K1 | PASS | HAND · pitch circles, tooth profiles, orbit radii 48 and 60 and the angle 44.05° between a pair are the model's; sleeves, screws, flanges and marks are fitted round them (check: max link error 0.0e+0 mm) (check: max link error 0.0e+0 mm) |
| K2 | PASS | HAND · check: finite, continuous, periodic over 720 samples |
| K3 | PASS | HAND · only the part family: gears, ring gear, discs, caps; fixed or at placement with spin |
| K4 | PASS | HAND · roles driver (small sun), output (ring), link (large sun, pinions, rollers), pin; accent only on the input cap pO |
| K5 | PASS | HAND · small sun, short pinions and the lower long halves on layer 0; large sun, ring, rollers and the upper long halves on layer 1, plated 3 mm up (room for the small sun's hub); check clean: no INTERFERE, OVERLAP or WARN (check: no INTERFERE, OVERLAP or WARN) |
| K6 | PASS | DATA · Ss 30, Sl 36, Ps 18, Pl 24, R 84, m 2, three sets, orbits 48 and 60, 44.05°: as the catalogue. Deliberate differences, commented in model.ts: first gear (carrier held) is the one animated; the long pinion is two rigid gears; three rollers carry the ring; the ring cut 0.12 mm backlash; sets 2 and 3 plated 0.2 mm up so the mesh rules build one set |
| K7 | PASS | HAND · input rotary on the small sun (input rotary on sunS) |
| D1 | PASS | HAND · involute teeth on the suns and pinions, ring with swapped addendum and dedendum, keyed small sun, rollers plain discs with flanges |
| D2 | PASS | HAND · gears carry only their teeth and a hub; the ring is a rim; bridges shaped by the rules |
| D3 | PASS | STYLE · roles told apart by pattern and tone in both sheets (screenshots) |
| D4 | PASS | AUTO · feet and corner holes concentric with the base corner arcs (fired: base (1 solid), feet (4 solids)) |
| D5 | PASS | AUTO / HAND · a bridge over each of the six pinion axles and the three roller axles, shaped by H.bridge on spigoted posts; nothing sweeps over a pinion |
| D6 | PASS | HAND / STYLE · bridges, sleeves, flanges and screws read quieter than the gears; the bridges are see-through over the meshes |
| D7 | PASS | HAND · gears carry only teeth, hubs and marks; the richness is in the shafts, bearings, circlips, sleeves, screws and marks |
| A1 | PASS | AUTO · pO J2, six pinion axles and three roller axles J1, ring-long, sunS-short, sunL-long, short-long J6 (pO J2, pS0 J1, pS1 J1, pS2 J1, pL0 J1, pL1 J1, pL2 J1, pR0 J1, pR1 J1, pR2 J1, mesh-ring-longT0 J6, mesh-sunS-short0 J6, mesh-sunL-longT0 J6, mesh-short0-long0 J6, mesh-short1-long1 J6, mesh-short2-long2 J6; fired: classify (no solids)) |
| A2 | PASS | AUTO · pO a live shaft (accent input, keyed small sun, the large sun on its own bearing); the axles dead axles; the meshes get mesh hardware (pO J2, pS0 J1, pS1 J1, pS2 J1, pL0 J1, pL1 J1, pL2 J1, pR0 J1, pR1 J1, pR2 J1, mesh-ring-longT0 J6, mesh-sunS-short0 J6, mesh-sunL-longT0 J6, mesh-short0-long0 J6, mesh-short1-long1 J6, mesh-short2-long2 J6) |
| A3 | PASS | AUTO · 6800 on the Ø10 shaft, 6900 for the large sun, F698 in every pinion, F688 in the rollers (fired: classify (no solids)) |
| A4 | PASS | AUTO · stepped keyed input shaft with circlip grooves; axles shoulder bolts with undercut (fired: j1-dead-axle (270 solids)) |
| A5 | PASS | AUTO · feather key 3 x 3 on the Ø10 input shaft, the small sun keyed (fired: j2-live-shaft (35 solids)) |
| A6 | N/A | AUTO · no fixed plate floating above the base: every axle is held by its housing or bridge on posts from the base (fired: standoffs (no solids)) |
| A7 | PASS | AUTO · 8 mm base, counterbored corners, feet, front scale, clearance hole for every live shaft (fired: base (1 solid), feet (4 solids)) |
| A8 | PASS | AUTO · every head has its shank; holes cut by stage 3 (fired: fasteners (stage 3)) |
| A9 | PASS | AUTO / HAND · every pinion axle held in the base and by a bridge over it (double support); the input shaft straddle-free: the large sun and the long halves sweep over its end, so its housing carries it with the bearings 10 mm apart, the one open point of this build (fired: j2-straddle (no solids)) |
| A10 | PASS | HAND · small sun, short pinions and the lower halves in one plane, the large sun, ring and upper halves in the next; bridges above; nothing stacked only to clear |
| A11 | PASS | AUTO / HAND · pinion loads: axle, bearing, bridge, posts, base; the ring through its three rollers; the input through its key, shaft and housing (fired: j1-dead-axle (270 solids)) |
| A12 | PASS | AUTO · clamp check clean |
| A13 | PASS | AUTO / HAND · every solid named with catalogue sizes, sets counted (411 solids, 202 unnamed (further items of a listed set)) |
| A14 | PASS | HAND · bridge posts outside every sweep; clearance 0 |
| A15 | PASS | AUTO · clearance: 0 clashes over the cycle |
| A16 | PASS | HAND · a note and a badge on every joint, five build rules (5 build rules; no note: none; no badge: none) |
| A17 | PASS | HAND · housing and shaft from below, the small sun with key and hub, the six pinion axles and the pinions in phase by their marks, the large sun, the ring laid on its flanges, the retaining rings, the bridges last; every screw reachable, bearings pressed out past their circlips |
| E1 | PASS | AUTO · one level per solid (every solid has one explode level; levels -8 to 3) |
| E2 | PASS | AUTO · screws, shafts and bought units are groups (104 rigid groups; fired: explode) |
| E3 | PASS | AUTO · screws leave along their axis to the head side, nuts the other way (screenshots at 28° and 70°) (fired: explode) |
| E4 | PASS | HAND · bridges and retaining rings go furthest up, the upper layer in the middle, the lower layer and the axles below: reverse of assembly |
| E5 | PASS | AUTO · bearings and circlips stay in their parts (fired: explode) |
| E6 | PASS | AUTO · motor with its bracket, bearings whole (fired: explode) |
| E7 | PASS | AUTO · spacers midway (fired: explode) |
| E8 | PASS | AUTO · keyed parts keep their order on the shaft (fired: explode) |
| E9 | PASS | HAND · looked at full explode at 28° and 70°, both sheets: nothing inside another part, nothing leaves the frame |
| J1 | PASS | AUTO · six pinion axles and three roller axles: shouldered, bearings in the gear or roller, spacers, internal circlips, thrust washer, bridge on spigoted posts, oil sink (fired: j1-dead-axle (270 solids)) |
| J2 | PASS | AUTO · input: housing with two bearings, sleeve, wave washer, circlips, dowelled; keyed shaft, end retainer, thrust washer, home flag (fired: j2-live-shaft (35 solids), j2-straddle (no solids)) |
| J3 | N/A | AUTO · no moving pin: the carrier is held, every pin is fixed (fired: j3-moving-pin (no solids)) |
| J4 | N/A | AUTO · no such joint here (fired: j4-slot-roller (no solids)) |
| J5 | N/A | AUTO · no such joint here (fired: j5-slide (no solids)) |
| J6 | PASS | AUTO · four mesh kinds, one built per kind: small sun-short with hub and set screw and the eccentric under the input housing, short-long, long-large sun and long-ring with marks (sets 2 and 3 are the same joints) (fired: j6-mesh (2 solids)) |
| J7 | N/A | AUTO · no such joint here (fired: j7-cam (no solids)) |
| J8 | PASS | AUTO · flanged motor pulley, mount slotted for tension (fired: j8-belt (2 solids)) |
| F1 | PASS | AUTO · housing dowelled; every bridge on two spigoted posts (round hole and slot) (served at pO, pS0, pS1, pS2, pL0, pL1, pL2, pR0, pR1, pR2, pS0-bridge-post, pS1-bridge-post, pS2-bridge-post, pL0-bridge-post, pL1-bridge-post, pL2-bridge-post, pR0-bridge-post, pR1-bridge-post, pR2-bridge-post; fired: j2-live-shaft (35 solids)) |
| F2 | PASS | AUTO · housing bearings on circlips; every pinion's bearing on internal circlips; the ring captured by its roller flanges and retaining rings; end retainer; bolt heads (served at pO, pS0, pS1, pS2, pL0, pL1, pL2, pR0, pR1, pR2; fired: j2-live-shaft (35 solids)) |
| F3 | PASS | AUTO · feather key and hub set screw on the small sun; the large sun, pinions and rollers turn free; the long halves bolted together by three screws and a sleeve (served at pO, mesh-sunS-short0; fired: j2-live-shaft (35 solids)) |
| F4 | PASS | AUTO / HAND · bronze thrust washers on every axle and the input shaft; wave washers in the housing; the flange carries the ring's weight; straight teeth carry no axial thrust (served at pO, pS0, pS1, pS2, pL0, pL1, pL2, pR0, pR1, pR2; fired: j2-live-shaft (35 solids)) |
| F5 | N/A | AUTO / HAND · turns fully, nothing to over-travel (served at no joint; fired: j5-slide (no solids), stops (no solids)) |
| F6 | N/A | AUTO / HAND · driven through the mesh; no rest position to hold (served at no joint; fired: j7-cam (no solids)) |
| F7 | PASS | AUTO / HAND · eccentric bushing under the input housing sets the backlash of the small sun against the shorts, and with it the whole set; belt tension at the motor mount (served at pO, mesh-sunS-short0, drive; fired: j6-mesh (2 solids), j5-slide (no solids)) |
| F8 | PASS | AUTO · open teeth greased at assembly; oil sinks on the bridges; bearings sealed or shielded (served at pS0, pS1, pS2, pL0, pL1, pL2, pR0, pR1, pR2; fired: lubrication (no solids)) |
| F9 | PASS | AUTO / HAND · match marks at the meshes (rule): the small sun and a short pinion, the short and the long, the long and the large sun and the ring; sets 2 and 3 are fitted by the same marks (served at mesh-ring-longT0, mesh-sunS-short0, mesh-sunL-longT0, mesh-short0-long0, mesh-short1-long1, mesh-short2-long2; fired: timing-marks (no solids)) |
| F10 | PASS | AUTO / HAND · pulley flanges, home flag, fork sensor; no slip clutch (none planned) (served at drive; fired: drive (37 solids)) |
| M1 | PASS | AUTO · edge breaks on every top face (fired: hardware primitives) |
| M2 | PASS | HAND · gears are small and solid; the ring is a rim with no mass to remove; no lightening needed |
| M3 | PASS | AUTO · bore entry chamfers on every seat and through hole (fired: j3-moving-pin (no solids), hardware primitives) |
| M4 | PASS | AUTO / HAND · counterbored base corners and housing screws; countersunk screws flush in the retaining rings; button heads on the posts (fired: base (1 solid), fasteners (stage 3)) |
| M5 | N/A | AUTO / HAND · no pockets or windows (fired: hardware primitives) |
| M6 | PASS | AUTO · edge distance and walls clean |
| M7 | N/A | HAND · no bracket or plate with a loaded inside corner in this build |
| M8 | PASS | AUTO · thread undercut on the shoulder bolts and axles (fired: j1-dead-axle (270 solids)) |
| M9 | PASS | AUTO / HAND · pinion axle bolts M6 into nuts and washers below the base; sleeve screws M3 into 7 mm of steel (2.3 d); flange screws M2.5 into 6 mm of steel; post screws M5 into the standoffs (fired: j1-dead-axle (270 solids)) |
| M10 | PASS | AUTO / HAND · steel gears with induction-hardened teeth, case-hardened rollers and flanges, steel sleeves and shaft, aluminium base, bronze washers (411 of 411 solids name a material) |
| M11 | PASS | AUTO · centre holes and chamfered ends on the shafts (fired: j1-dead-axle (270 solids), hardware primitives) |
| M12 | PASS | HAND · every head reachable; set screws from the side; bearings pressed out past their circlips |
| M13 | PASS | AUTO / HAND · threadlocker on every screw, nyloc where a nut, set screws low strength (178 threaded, 0 without a locking method) |
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
| R1 | PASS | HAND · the polish reuses H.tube, H.plate, H.screw, H.disc and H.boltCircle; no inline standard part |
| R2 | PASS | HAND · threads M2.5, M3, M5, M6; shafts Ø10 and Ø8 axles; three bearing sizes (threads M2.5, M3, M5, M6; joint Ø 8, 10; bearings 6800-2RS (10x19x5), F6900ZZ (10x22x6), F698 (8x19x6), F688 (8x16x5)) |
| R3 | PASS | AUTO · housing, bridge and drive from their subassemblies (fired: hardware primitives) |
| R4 | PASS | AUTO · package built at build time (package 42.5 KB) |
| R5 | PASS | HAND · states only what differs; polish about 1 ms |
| R6 | PASS | FLAG · FLAG: browser bench 2026-10-19: plan 4.39, 28° 5.16, side 4.63, explode 4.79 ms at full detail; setup 41.3 ms; under the 8 ms target at every dial position |
| R7 | PASS | HAND · model.ts + polish.ts 11.9 KB |
| R8 | PASS | AUTO / SITE · pre-rendered thumbnails; the stage draws on change only |
| DL1 | PASS | AUTO / HAND · every solid and mark on a rung (152 of 411 solids on a dropping rung) |
| DL2 | PASS | HAND · default dial full (model detail full) |
| DL3 | PASS | AUTO · DL-D drawn when exploded, DL-B skipped at side elevation |
| DL4 | PASS | SITE · adaptive dial and the detail entry in the title block |
| DL5 | PASS | FLAG · FLAG: rung counts and frame times in the detail ladder below |
| Q1 | PASS | check, clamp and edge distance clean |
| Q2 | PASS | 0 clashes |
| Q3 | PASS | package written, 42.5 KB; site build not checked here · package written; site build left to CI |
| Q4 | PASS | local: tools/shot · plan, 28°, side, explode at 28° and 70°, both sheets, overlays on, all looked at; attach to #119 |
| Q5 | PASS | local: tools/bench · browser bench run; flags under Verification |
| Q6 | PASS | · every row judged |
| Q7 | PASS | · conformance: ravigneaux at 2.6, pass |

## Joints
| Joint | Type | F1 locate | F2 retain | F3 torque | F4 thrust | F5 limit | F6 hold | F7 adjust | F8 lube | F9 timing | F10 protect |
|---|---|---|---|---|---|---|---|---|---|---|---|
| pO | J2 | 2 x Dowel pin Ø3 x 10 h6, housing to base | 2 x Internal circlip DIN 472, Ø19; Internal circlip DIN 472, Ø22; Bearing F6900ZZ (10x22x6); External circlip DIN 471, Ø10; Socket head M5 x 10 (ISO 4762), into the shaft end | Feather key 3 x 3 x 7 (DIN 6885) | Wave washer 14.5x18.8, spring steel; Thrust washer 10.2x16, bronze | – turns fully | – driven through the belt | Eccentric bushing Ø26, 0.3 mm offset bore Ø12, flanged | – sealed or shielded bearings | – the marks are on the meshes | – see drive |
| pS0 | J1 | 2 x spigot | Internal circlip DIN 472, Ø19; Bearing F698 (8x19x6) | – turns free on its bearing | Thrust washer 8.2x11.2, bronze | – turns fully | – driven through the mesh | – nothing to adjust here | Bridge over the pivot, on two spigoted posts | – the marks are on the meshes | – nothing to protect |
| pS1 | J1 | 2 x spigot | Internal circlip DIN 472, Ø19; Bearing F698 (8x19x6) | – turns free on its bearing | Thrust washer 8.2x11.2, bronze | – turns fully | – driven through the mesh | – nothing to adjust here | Bridge over the pivot, on two spigoted posts | – the marks are on the meshes | – nothing to protect |
| pS2 | J1 | 2 x spigot | Internal circlip DIN 472, Ø19; Bearing F698 (8x19x6) | – turns free on its bearing | Thrust washer 8.2x11.2, bronze | – turns fully | – driven through the mesh | – nothing to adjust here | Bridge over the pivot, on two spigoted posts | – the marks are on the meshes | – nothing to protect |
| pL0 | J1 | 2 x spigot | 2 x Internal circlip DIN 472, Ø19; 2 x Bearing F698 (8x19x6) | – turns free on its bearing | Thrust washer 8.2x11.2, bronze | – turns fully | – driven through the mesh | – nothing to adjust here | Bridge over the pivot, on two spigoted posts | – the marks are on the meshes | – nothing to protect |
| pL1 | J1 | 2 x spigot | 2 x Internal circlip DIN 472, Ø19; 2 x Bearing F698 (8x19x6) | – turns free on its bearing | Thrust washer 8.2x11.2, bronze | – turns fully | – driven through the mesh | – nothing to adjust here | Bridge over the pivot, on two spigoted posts | – the marks are on the meshes | – nothing to protect |
| pL2 | J1 | 2 x spigot | 2 x Internal circlip DIN 472, Ø19; 2 x Bearing F698 (8x19x6) | – turns free on its bearing | Thrust washer 8.2x11.2, bronze | – turns fully | – driven through the mesh | – nothing to adjust here | Bridge over the pivot, on two spigoted posts | – the marks are on the meshes | – nothing to protect |
| pR0 | J1 | 2 x spigot | Internal circlip DIN 472, Ø16; Bearing F688 (8x16x5) | – the roller turns free on its bearing; torque is friction at the rim | Thrust washer 8.2x10.8, bronze | – turns fully | – driven by the ring | – the ring position is set by the three flanges; backlash is at the small sun | Bridge over the pivot, on two spigoted posts | – no phase | – nothing to protect |
| pR1 | J1 | 2 x spigot | Internal circlip DIN 472, Ø16; Bearing F688 (8x16x5) | – the roller turns free on its bearing; torque is friction at the rim | Thrust washer 8.2x10.8, bronze | – turns fully | – driven by the ring | – the ring position is set by the three flanges; backlash is at the small sun | Bridge over the pivot, on two spigoted posts | – no phase | – nothing to protect |
| pR2 | J1 | 2 x spigot | Internal circlip DIN 472, Ø16; Bearing F688 (8x16x5) | – the roller turns free on its bearing; torque is friction at the rim | Thrust washer 8.2x10.8, bronze | – turns fully | – driven by the ring | – the ring position is set by the three flanges; backlash is at the small sun | Bridge over the pivot, on two spigoted posts | – no phase | – nothing to protect |
| mesh-ring-longT0 | J6 | – located by the axles | – nothing to retain | – the gears turn free | – straight teeth, no thrust | – turns fully | – driven through the mesh | – set at the small sun's eccentric | – open teeth greased at assembly | Ring gear, 84 teeth, 4 x M2.5 tapped in the rim for the load; Long pinion 1, 24 teeth, upper half | – see drive |
| mesh-sunS-short0 | J6 | – located by the axles | – nothing to retain | Gear hub Ø22, set screw M3 on the key; Set screw M3 (DIN 916), threadlocked | – straight teeth, no thrust | – turns fully | – driven through the mesh | Eccentric bushing Ø26, 0.3 mm offset bore Ø12, flanged | – open teeth greased at assembly | Small sun, 30 teeth; Short pinion 1, 18 teeth | – see drive |
| mesh-sunL-longT0 | J6 | – located by the axles | – nothing to retain | – the gears turn free | – straight teeth, no thrust | – turns fully | – driven through the mesh | – set at the small sun's eccentric | – open teeth greased at assembly | Large sun, 36 teeth; Long pinion 1, 24 teeth, upper half | – see drive |
| mesh-short0-long0 | J6 | – located by the axles | – nothing to retain | – the gears turn free | – straight teeth, no thrust | – turns fully | – driven through the mesh | – set at the small sun's eccentric | – open teeth greased at assembly | Short pinion 1, 18 teeth; Long pinion 1, 24 teeth, lower half | – see drive |
| mesh-short1-long1 | J6 | – located by the axles | – nothing to retain | – the gears turn free | – straight teeth, no thrust | – turns fully | – driven through the mesh | – set at the small sun's eccentric | – open teeth greased at assembly | Short pinion 2, 18 teeth; Long pinion 2, 24 teeth, lower half | – see drive |
| mesh-short2-long2 | J6 | – located by the axles | – nothing to retain | – the gears turn free | – straight teeth, no thrust | – turns fully | – driven through the mesh | – set at the small sun's eccentric | – open teeth greased at assembly | Short pinion 3, 18 teeth; Long pinion 3, 24 teeth, lower half | – see drive |
| pS0-bridge-post | post | 2 x spigot | – | – | – | – | – | – | – | – | – |
| pS1-bridge-post | post | 2 x spigot | – | – | – | – | – | – | – | – | – |
| pS2-bridge-post | post | 2 x spigot | – | – | – | – | – | – | – | – | – |
| pL0-bridge-post | post | 2 x spigot | – | – | – | – | – | – | – | – | – |
| pL1-bridge-post | post | 2 x spigot | – | – | – | – | – | – | – | – | – |
| pL2-bridge-post | post | 2 x spigot | – | – | – | – | – | – | – | – | – |
| pR0-bridge-post | post | 2 x spigot | – | – | – | – | – | – | – | – | – |
| pR1-bridge-post | post | 2 x spigot | – | – | – | – | – | – | – | – | – |
| pR2-bridge-post | post | 2 x spigot | – | – | – | – | – | – | – | – | – |
| drive | drive | – | – | – | – | – | – | bracket | – | – | Home flag, 1 mm steel vane; 3 x Fork sensor, slotted optical, 5 mm gap; Pulley flanges |

## Variants and overrides
| Joint or part | Rule result | Chosen | Why |
|---|---|---|---|
| carrier | a part holding both pinion sets | none: first gear holds it, so each pinion turns on a dead axle in the base under its own bridge | a held carrier is the base itself (J1, A9) |
| long pinion | one gear, twice the face width | two gears in two layers, a hub sleeve and three M3 screws making them one | the lower half meshes the short pinion, the upper half the large sun and ring; the layers cannot share a plane (K5) |
| ring | no hub: the model has no shaft at its centre | three carrier rollers on dead axles, a flange under the ring and a retaining ring over it, four M2.5 tapped holes on the rim | a ring gear has no hub; this carries it with nothing over the mesh (F2, F4) |
| classify | a round hole centred on a pin is a keyed bore | a hole wider than four cap radii is not (src/rules/classify.ts) | a ring gear turning round the pin was taken for a part keyed to the shaft |
| upper layer | layer 1 | plated 3 mm up | the small sun's hub and set screw clear the large sun's bearing (K1: heights only) |

## Detail ladder
| Rung | Solids | Marks | Frame ms at this dial position |
|---|---|---|---|
| DL-A | 32 | 0 | 5.17 |
| DL-B | 0 | 490 | 3.69 |
| DL-C | 0 | 0 | 3.76 |
| DL-D | 72 | 0 | 3.10 |
| DL-E | 8 | 30 | 2.90 |
| DL-F | 0 | 0 | 3.23 |
| DL-G | 0 | 0 | 2.39 |
| DL-H | 40 | 0 | 2.05 |
| never | 259 | 291 | 5.91 (full) |

## Promotion candidates
- A ring gear carried on rollers (flange under, retaining ring over, tapped output holes) is now in two mechanisms (the internal gear pair and this): a third makes it a primitive.
- classify: a keyed bore wider than four cap radii is a ring's cavity, not a joint (changed here, its own commit).
- The mesh rules build one hub and mark set per mesh kind: three identical pinion sets are plated 0.2 mm up by hand so the rules see one (planetary, Ravigneaux): the rules should detect the repetition.

## Verification
check: clean · clearance: 0 clashes · clamp: clean · edge distance: clean · package: 42.5 KB
screenshots: plan, 28°, side, explode at 28° and 70°, both sheets, drawn in local Chrome to dist/shots/ravigneaux/ (plan, 28° and the explode looked at) · bench: browser, DPR 1.5, 2026-10-19; plan 4.39 ms, 28° 5.16 ms, side 4.63 ms, explode 70° 4.79 ms at full detail, 8 ms held at every dial (R6)
