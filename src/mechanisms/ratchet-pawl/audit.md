# Audit: Ratchet and pawl (ratchet-pawl)
standard: 2.3 · date: 2026-10-18 · result: pass · detail: full · pass: audit+fix

## Summary
PASS 111 · FAIL 0 · N/A 8 · open: none

## Requirements
| Id | Status | Evidence / action |
|---|---|---|
| S1 | PASS | DATA · the standard carries version 2.3 and its changelog |
| S2 | PASS | HAND · header with standard, date, result, detail, pass |
| S3 | PASS | AUTO · tools/conformance reads this header and runs in npm run check |
| S4 | PASS | SITE · #36 holds only this mechanism's decisions and open items |
| P1 | PASS | DATA · record complete; model.ts, polish.ts, audit.md present |
| P2 | PASS | DATA · catalogue validator clean (npm run catalog); facets in the controlled vocabularies |
| P3 | PASS | DATA / SITE · page shows ratio (index step), coaxial axes, intermittent and one-way output, backdrivable "No (self-locking)", other names, family, motion, level, dof and the motorised drive |
| P4 | PASS | DATA · tags grouped Function, Property, Application, keywords underneath |
| P5 | PASS | DATA · motion, forces, benefits, limits; three uses with one line each. The forces text was corrected to match the build (pawl line tangent to the root circle, not an undercut face) |
| P6 | PASS | DATA · Wikipedia (two articles), a textbook, Britannica; a photo page and one video; the one real-world video (Coffing LSB-C ratchet lever hoist) and the media video both answer on YouTube oEmbed and are on topic |
| P7 | PASS | HAND / SITE · no prose in model.ts or polish.ts; lint-style clean |
| P8 | PASS | SITE · no parts list, build or joint sections on the page |
| P9 | PASS | HAND · solve(): the lever swings 62° to 98°; the first 6° are lost motion, the next 30° push the wheel one tooth, the return rides back over the slopes while the holding pawl keeps the wheel (backlash 10°, under one pitch), as the text says |
| P10 | PASS | HAND · driving pawl tip traced, tip velocity, input spin and pawl push force while driving, stroke angle, staircase plot of wheel angle |
| P11 | PASS | DATA · plain, short sentences, no em dashes, mm and degrees |
| K1 | PASS | HAND · check: max link error 2.8e-14 mm · the springs, spokes, bridge and posts are placed round the modelled tooth profile, pivot centres and pawl lengths; the pawl outline is cut round the wheel but its tip is the solved contact point; the pawl corner rounding in the polish leaves the tip alone |
| K2 | PASS | HAND · check: finite, continuous, periodic over 720 samples |
| K3 | PASS | HAND · custom wheel and pawls, links for the lever plates, caps; between, at and fixed placement |
| K4 | PASS | HAND · roles output (wheel), driver (lever plates), link (pawls), pin; accent only on the input cap pO |
| K5 | PASS | HAND · check: no INTERFERE, OVERLAP or WARN · rear lever plate layer -1, wheel and both pawls layer 0, front lever plate layer 1; check clean |
| K6 | PASS | DATA · N 12, root 50, tip 62, steep face 3° and back slope 27°, pawl 56, Rp = hypot(50, 56) = 75.07, lever 128, stroke 62° to 98°, holding pivot at 75.1 and -32°: as the catalogue. Choices where the catalogue is silent: both pawls are pushers; the nose bevel is 32° off the finger axis; the holding pawl rests 10° behind its face |
| K7 | PASS | HAND · input oscillating on lever · input oscillating on the lever |
| D1 | PASS | HAND · tapered lever plates (R12 at the shaft, R8 at the free end) with boss rings; flush caps; one bridge shaped as a part; squircle base |
| D2 | PASS | HAND · six spokes only in the wheel, the indexed member that starts and stops each stroke; bosses round every pin; the pawl arm bows outside the tip circle where the load does not run |
| D3 | PASS | STYLE · roles told apart by pattern and tone in both sheets (screenshots) |
| D4 | PASS | AUTO · fired: base (1 solid), feet (4 solids) · feet concentric with the corner arcs |
| D5 | PASS | AUTO / HAND · one bridge over the holding pawl's axle on two spigoted posts; the base carries the drive housing |
| D6 | PASS | HAND / STYLE · springs, posts, stops, marks and leads read quieter than the wheel, lever and pawls |
| D7 | PASS | HAND · wheel, lever plates, pawls and bridge carry only load shape and manufacturing marks |
| A1 | PASS | AUTO · pO J2, pD J3, pH J1; fired: classify (no solids) · pO J2, pD J3, pH J1 found; no slots or meshes |
| A2 | PASS | AUTO · pO J2, pD J3, pH J1 · live shaft at the accent input, shoulder bolt at the pawl pivot on the lever, dead axle for the holding pawl |
| A3 | PASS | AUTO · fired: classify (no solids) · Ø8 input in 688-2RS housing bearings and an F688ZZ in the wheel; F685ZZ in the driving pawl and F685 in the holding pawl on Ø5 pivots |
| A4 | PASS | AUTO · fired: j1-dead-axle (26 solids) · stepped D-flat input shaft with end retainer; shouldered pawl axle and bolt with undercut threads |
| A5 | PASS | AUTO · fired: j2-live-shaft (33 solids) · D-flat on the Ø8 input for both lever plates; the wheel is not keyed, it runs on its bearing |
| A6 | PASS | AUTO · fired: standoffs (no solids) · no floating fixed plate besides the bridge, on spigoted Ø10 standoffs |
| A7 | PASS | AUTO · fired: base (1 solid), feet (4 solids) · 8 mm base 2 mm under the lowest part, counterbored corners, feet, scale along the front edge, clearance hole for the input shaft; the base grew to carry the drive |
| A8 | PASS | AUTO · fired: fasteners (stage 3) · every head has its shank; holes cut and tapped by stage 3, including the spring posts |
| A9 | PASS | AUTO / HAND · fired: j2-straddle (no solids) · the lever is a clevis round the pawl: the pivot bolt is in double shear; the holding axle is held by base and bridge. The input shaft is carried by the housing cartridge as in the Geneva: the lever sweeps over it, so no bridge goes over it (recorded as single shear, warn) |
| A10 | PASS | HAND · wheel and both pawls work in z 0 to 6; the lever plates sit one layer below and above, symmetric about the pawl |
| A11 | PASS | AUTO / HAND · fired: j1-dead-axle (26 solids) · pawl push to pivot bolt to both lever plates to the keyed shaft to the housing to the base; holding pawl to its axle to the base and the bridge to its posts and the base; spring posts to lever or base; housing screwed and dowelled |
| A12 | PASS | AUTO · clamp check clean |
| A13 | PASS | AUTO / HAND · 132 solids, 65 unnamed (further items of a listed set) · every solid named with catalogue sizes, sets counted |
| A14 | PASS | HAND · spring posts and leaf springs stand clear of every sweep (0.5 mm at the pawl's highest lift is measured by the clearance run), bridge posts outside the wheel and pawls, stops outside the lever's swing; clearance 0 |
| A15 | PASS | AUTO · clearance: 0 clashes over the cycle |
| A16 | PASS | HAND · 5 build rules; no note: none; no badge: none · a note and a badge on every joint (pO, pD, pH, the bridge posts, the drive), five build rules |
| A17 | PASS | HAND · housing and shaft up through the base, thrust washer, rear lever plate, spacer, wheel on its bearing, spacer, front lever plate, end screw; pawl between the plates on its bolt from above; holding pawl on its axle from the base, bridge last; springs on their posts after the pawls |
| E1 | PASS | AUTO · one level per solid; seen at full explode |
| E2 | PASS | AUTO · screws, bolts with their shims, shafts and bought units are groups; seen at full explode |
| E3 | PASS | AUTO · bolts and screws leave upward, housing screws downward; seen at full explode |
| E4 | PASS | HAND · wheel and pawls level 1, front lever plate 2, bolt heads and bridge 3, rear lever plate 0: the last part fitted goes furthest |
| E5 | PASS | AUTO · fired: explode · bearings and circlips stay in their parts |
| E6 | PASS | AUTO · fired: explode · motor with its bracket, bearings whole |
| E7 | PASS | AUTO · fired: explode · spacers midway |
| E8 | PASS | AUTO · fired: explode · lever plates keep their order on the shaft, the wheel between them on its bearing |
| E9 | PASS | HAND · readable at full explode at 28° and 70° in both sheets (screenshots); nothing leaves the frame |
| J1 | PASS | AUTO · fired: j1-dead-axle (26 solids) · pH: shouldered axle into the base, bearing with circlip and flange, spacers, thrust washer, bridge on spigoted posts, oil sink |
| J2 | PASS | AUTO · fired: j2-live-shaft (33 solids), j2-straddle (no solids) · pO: housing with two sealed bearings, spacer sleeve, wave washer, circlips, screwed and dowelled; D-flat shaft, end retainer, thrust washer, home flag on the drive crank |
| J3 | PASS | AUTO · fired: j3-moving-pin (13 solids) · pD: shoulder bolt threaded into the rear lever plate, bearing in the pawl, inner-race spacers, locked; clevis (A9) |
| J4 | N/A | AUTO · fired: j4-slot-roller (no solids) · no pin in a slot |
| J5 | N/A | AUTO · fired: j5-slide (no solids) · no slide |
| J6 | N/A | AUTO · fired: j6-mesh (no solids) · no gear mesh |
| J7 | N/A | AUTO · fired: j7-cam (no solids) · the pawl tip on a tooth is a pawl and tooth contact, not a cam with a roller follower train; the pawl springs serve F6. Promotion candidate |
| J8 | N/A | AUTO · fired: j8-belt (no solids) · the oscillating drive is a motor crank and link: no belt |
| F1 | PASS | AUTO · served at pO, pH, pH-bridge-post; fired: j2-live-shaft (33 solids) · housing dowelled, bridge spigoted |
| F2 | PASS | AUTO · served at pO, pD, pH; fired: j2-live-shaft (33 solids) · bearings held by circlips and flanges; shaft end retainer; pawl bearings between inner spacers |
| F3 | PASS | AUTO · served at pO; fired: j2-live-shaft (33 solids) · D-flat on the input for both lever plates |
| F4 | PASS | AUTO / HAND · served at pO, pH; fired: j2-live-shaft (33 solids) · bronze thrust washers under the rear lever plate and under the holding pawl; wave washer preloading the input |
| F5 | PASS | AUTO / HAND · served at pO, pH; fired: j5-slide (no solids), stops (9 solids) · stops 2° beyond both ends of the lever's swing, and one beyond the holding pawl's lift (no room for the other end) |
| F6 | PASS | AUTO / HAND · served at pD, pH; fired: j7-cam (no solids) · a leaf spring on each pawl, 24 x 6 x 0.8, screwed to its own post (on the lever for the driving pawl, on the base for the holding pawl); the wheel is locked by the holding pawl, so no drag pack. Limit: the leaf is a rigid solid, drawn standing off the pawl by its working lift (see promotion candidates) |
| F7 | N/A | AUTO / HAND · served at no joint; fired: j6-mesh (no solids), j5-slide (no solids) · no mesh, belt or slide, and no length ratio to tune: pivot centres are dowel-located and the engagement depth is set by them. An eccentric on the holding axle is possible but not required |
| F8 | PASS | AUTO · served at pH; fired: lubrication (no solids) · oil sink on the bridge over the open holding-pawl bearing; the other bearings are shielded or sealed |
| F9 | PASS | HAND · an index dot on tooth 8 of the wheel and a line on the base: after a stroke the marked tooth sits on the line |
| F10 | PASS | AUTO / HAND · served at drive; fired: drive (33 solids) · home flag on the drive crank read by a fork sensor, leads to the terminal block; no slip clutch needed: the crank and link stop at their dead centres inside the lever stops |
| M1 | PASS | AUTO · fired: hardware primitives · top edges chamfered by the form style |
| M2 | PASS | HAND · six filleted spokes in the wheel, web 8 mm round the bearing flange and under the roots |
| M3 | PASS | AUTO · fired: j3-moving-pin (13 solids), hardware primitives · bore entry rings on the bearing seats and through holes |
| M4 | PASS | AUTO / HAND · fired: base (1 solid), fasteners (stage 3) · counterbores in the base, spot seats by stage 3 |
| M5 | PASS | AUTO / HAND · fired: hardware primitives · spoke windows carry a 3 mm radius, the pawls' inside corners 1.5 mm; the tooth roots are the modelled working profile (K1), a wire-cut hardened wheel |
| M6 | PASS | AUTO · edge distance and walls clean |
| M7 | PASS | HAND · the pawl's inside corners at the arm and finger are rounded to 1.5 mm |
| M8 | PASS | AUTO · fired: j1-dead-axle (26 solids) · thread undercuts on the shouldered bolt and axle |
| M9 | PASS | AUTO / HAND · fired: j1-dead-axle (26 solids) · M3, M4, M5 screws in standard lengths with engagement from the tables |
| M10 | PASS | AUTO / HAND · 132 of 132 solids name a material · every solid names a material; wheel and pawls Steel 42CrMo4, hardened and ground |
| M11 | PASS | AUTO · fired: j1-dead-axle (26 solids), hardware primitives · centre holes, wrench flats and chamfered ends on the shafts |
| M12 | PASS | HAND · every screw reachable from above or below; the pawl bearings can be pulled through the lever plates' bore side; the bridge comes off first |
| M13 | PASS | AUTO / HAND · 50 threaded, 0 without a locking method · every threaded fastener names its locking method |
| M14 | N/A | AUTO / HAND · fired: j4-slot-roller (no solids) · no slot, slide or cam track: the wearing faces are the whole hardened wheel and pawls, and a pawl is one bolt to change |
| V1 | PASS | AUTO · fired: drive (33 solids) · motor with its bracket under the base (oscillating build, pancake outrunner) |
| V2 | PASS | AUTO · fired: drive (33 solids) · one-piece bracket with the flange screwed up into the base |
| V3 | PASS | AUTO / HAND · fired: drive (33 solids) · drive clear of feet and housings; clearance 0 |
| V4 | N/A | AUTO · fired: j8-belt (no solids) · no belt or pulleys in the oscillating drive |
| V5 | PASS | AUTO · fired: drive (33 solids) · motor turns a 6.8 mm crank, a 44 mm link swings a 22 mm lever on the input shaft through exactly the modelled 36° |
| V6 | PASS | AUTO · fired: drive (33 solids) · home flag on the drive crank, fork sensor, leads to the terminal block, one clip |
| L1 | PASS | STYLE · no look value in model.ts or polish.ts; lint-style clean |
| L2 | PASS | HAND · geometry, roles, materials, marks and accent only |
| L3 | PASS | HAND · roles right on every solid; looked at in both sheets |
| L4 | PASS | HAND / STYLE · accent only on the input cap, the traced path and the forces |
| L5 | PASS | AUTO / HAND · fired: see-through · screws, bearings and shanks are real solids in real holes and show through |
| L6 | PASS | AUTO · depth order correct at plan, 28°, 70° and side in both sheets |
| L7 | PASS | STYLE · tilt 0° to 88°, no shear |
| L8 | PASS | AUTO / HAND · engraved scale, index line and dot are marks |
| R1 | PASS | HAND · H.spring, H.standoff, H.screw, H.spokes, the bridge and drive subassemblies; the pawl outline is a custom part, not a standard one; one small inline helper (rounding concave corners) is a promotion candidate |
| R2 | PASS | HAND · threads M3, M4, M5; joint Ø 5, 8; bearings 688-2RS (8x16x5), F688ZZ (8x16x5), F685ZZ (5x11x5), F685 (5x11x5) · threads M3, M4, M5; shafts Ø8 and pivots Ø5; bearings from the table; leaf 24 x 6 x 0.8 |
| R3 | PASS | AUTO · fired: hardware primitives · housing, bridge, stops and drive are the shared functions |
| R4 | PASS | AUTO · package 20.6 KB · package 20.6 KB |
| R5 | PASS | HAND · polish 6 ms; one 180-step sample for the spring placement |
| R6 | FLAG | FLAG · bench: package 20.6 KB, setup 1.4 ms; frame 238 ms plan, 237 ms 28°, 256 ms side, 233 ms explode 70° (Node CPU raster, as for the other mechanisms; the site measures its own). Dial H 28 ms |
| R7 | PASS | HAND · model.ts + polish.ts 16.2 KB |
| R8 | PASS | AUTO / SITE · site behaviour, unchanged |
| DL1 | PASS | AUTO / HAND · 48 of 132 solids on a dropping rung · 48 of 132 solids on a dropping rung; nothing moved |
| DL2 | PASS | HAND · model detail full · default dial full |
| DL3 | PASS | AUTO · AUTO, unchanged |
| DL4 | PASS | SITE · SITE, unchanged |
| DL5 | FLAG | FLAG · bench rung table written: A 12 solids, B 151 marks, D 19, E 8 and 4 marks, H 9, never 84 |
| Q1 | PASS | check, clamp and edge distance clean |
| Q2 | PASS | 0 clashes |
| Q3 | PASS | package written, 20.6 KB; site build not checked here · package written, 20.6 KB; page builds from the registry |
| Q4 | PASS | local: tools/shot · plan, 28°, side, full explode at 28° and 70°, both sheets, overlays on, looked at; baselines written |
| Q5 | PASS | local: tools/bench · bench report written; flags noted above |
| Q6 | PASS | every requirement judged; joints table complete |
| Q7 | PASS | tools/conformance: current at 2.3 |

## Joints
| Joint | Type | F1 locate | F2 retain | F3 torque | F4 thrust | F5 limit | F6 hold | F7 adjust | F8 lube | F9 timing | F10 protect |
|---|---|---|---|---|---|---|---|---|---|---|---|
| pO | J2 | 2 x Dowel pin Ø3 x 10 h6, housing to base | 3 x Internal circlip DIN 472, Ø16; Bearing F688ZZ (8x16x5); Countersunk M4 x 10 (ISO 10642), into the shaft end, flush; Socket head M4 x 8 (ISO 4762), into the shaft end | Input shaft Ø8 h6, D-flat | Wave washer 12x15.8, spring steel; Thrust washer 8.2x14, bronze | 2 x Stop bumper, neoprene sleeve Ø12 | none (the lever is driven through its whole swing) | – no adjustable length | none (sealed bearings) | – drive has its own flag, see drive | none |
| pD | J3 | – located by its bolt shoulder in the lever plates | Internal circlip DIN 472, Ø11; Bearing F685ZZ (5x11x5); head | – free pivot, no torque path | – spacers set the end float | – limited by the wheel profile and the spring | Leaf spring 24 x 6 x 0.8, driving pawl | – fixed centres | – shielded bearing | – | – moves with the lever |
| pH | J1 | 2 x spigot | Internal circlip DIN 472, Ø11; Bearing F685 (5x11x5) | – free pivot | Thrust washer 5.2x7.1, bronze | bumper | Leaf spring 24 x 6 x 0.8, holding pawl | – fixed centres | Bridge over the pivot, on two spigoted posts | Index line on the base and dot on tooth 8 of the wheel | – |
| pH-bridge-post | post | 2 x spigot | – screwed both ends | – | – | – | – | – | – | – | – |
| drive | drive | none | none | none | none | none | none | none | none | none | Home flag on the drive crank; 3 x Fork sensor, slotted optical, 5 mm gap |

## Variants and overrides
| Joint or part | Rule result | Chosen | Why |
|---|---|---|---|
| Wheel | plain disc | six spokes, web 8 mm | M2: the wheel starts and stops every stroke |
| Pawl springs | none | leaf spring on a post, one per pawl | F6: a ratchet holds position by spring; screwed down as the standard asks |
| Wheel and pawls | aluminium default | hardened steel 42CrMo4 | M10: tooth faces and tips are contact surfaces |
| Pawl outline | as modelled | inside corners rounded 1.5 mm | M5, M7; the tip is untouched |
| Spring clearance | n/a | 3 mm short of the pawl at its highest lift | the clearance test forbids contact with a rigid drawn leaf |
| Index marks | none | dot on tooth 8, line on the base at the rest position | F9: phase for reassembly |

## Detail ladder
| Rung | Solids | Marks | Frame ms at this dial position |
|---|---|---|---|
| DL-A | 12 | 0 | 193.57 |
| DL-B | 0 | 151 | 185.16 |
| DL-C | 0 | 0 | 48.65 |
| DL-D | 19 | 0 | 38.28 |
| DL-E | 8 | 4 | 32.75 |
| DL-F | 0 | 0 | 33.82 |
| DL-G | 0 | 0 | 33.22 |
| DL-H | 9 | 0 | 28.01 |
| never | 84 | 122 | 233.66 (full) |

## Promotion candidates
- A flexing solid for springs: a rigid drawn leaf cannot touch a moving pawl (clash), so the spring stands off by the pawl's lift. A spring that is drawn at the pawl's pose, or a "bears on" contact exempt from the clash, would let it press (F6, AUTO `H.spring`).
- `H.filletPoly` option that rounds concave corners only (here a local `roundInside` in the polish) (M5, M7).
- A J-type for pawl and tooth contacts (J7 assumes a cam and roller): pawl, spring, stop and its tooth as one subassembly, with the holding pawl and the stop (F6).

## Verification
check: clean · clearance: 0 clashes · clamp: clean · edge distance: clean · package: 20.6 KB
screenshots: plan, 28°, side, full explode at 28° and 70°, dark and light, overlays on (dist/shots/f-*.png, local); baselines in tests/visual/__baselines__/ratchet-pawl-*
bench: package 20.6 KB, setup 1.4 ms, frame 238 / 237 / 256 / 233 ms at plan / 28° / side / explode 70° (Node CPU), dial H 28 ms; flag only
open items: none blocking. Spring stands off the pawl (see promotion candidates); no eccentric on the holding axle (F7 N/A)
