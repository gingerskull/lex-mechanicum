# Audit: Tusi couple (tusi-couple)
standard: 2.3 · date: 2026-10-18 · result: pass · detail: full · pass: build

## Summary
PASS 107 · FAIL 0 · N/A 12 · open: none

## Requirements
| Id | Status | Evidence / action |
|---|---|---|
| S1 | PASS | DATA · the standard carries version 2.3 and its changelog |
| S2 | PASS | HAND · header with standard, date, result, detail, pass |
| S3 | PASS | AUTO · tools/conformance reads this header and runs in npm run check |
| S4 | PASS | SITE · #40 holds only this mechanism's open items |
| P1 | PASS | DATA · record complete; model.ts, polish.ts, audit.md present |
| P2 | PASS | DATA · catalogue validator clean (npm run catalog: vocab OK) |
| P3 | PASS | DATA / SITE · ratio (stroke), axes Rotary-to-in-plane, output Reciprocating and Harmonic, partly backdrivable, other names, family, motion, level, dof 1 and the motorised drive are in the record |
| P4 | PASS | DATA · tags grouped Function, Property, Application, keywords underneath |
| P5 | PASS | DATA · motion, forces, benefits, limits; three uses with one line each |
| P6 | PASS | DATA · three Wikipedia pages, a UNLV physics page and an engineering guide; two videos and a Commons photo page of the Thinktank Murray engine (added; the dead animation link 1apwd5X5EC0 was removed); the three real_world YouTube videos of Murray engine models answer oEmbed today with titles on topic (Hypocycloidal steam engine; Matthew Murray's hypocycloidal steam engine; Murray hypocycloidal engine), none kept blind. Playing was not watched |
| P7 | PASS | HAND / SITE · no prose in model.ts or polish.ts; lint-style clean |
| P8 | PASS | SITE · no parts list, build or joint sections on the page; nothing changed in the site |
| P9 | PASS | HAND · solve(): the planet turns back once per arm turn, each tracer runs 128 mm (-64 to +64) on a straight diameter, X and Y at right angles, as the text says |
| P10 | PASS | HAND · paths of both tracers (X first, with the comet), tracer velocity, input spin and the tooth force at the mesh, arm angle, plot of tracer X against arm angle (a cosine) |
| P11 | PASS | DATA · plain, short sentences, no em dashes, mm and degrees |
| K1 | PASS | HAND · max link error 7.1e-15 mm; posts, pins, bearing, marks and the ring plating are cut round the model's centres and pitch circles |
| K2 | PASS | HAND · check: finite, continuous, periodic over 720 samples |
| K3 | PASS | HAND · ringGear, link, gear, caps and tracers; fixed, between and at placement with spin |
| K4 | PASS | HAND · roles ground, driver, output, pin, trace; accent only on the input cap pO |
| K5 | PASS | HAND · check clean: arm on layer 0 (its sweep, radius 42, never reaches the ring teeth at 60); planet and tracers on layer 1; ring on layer 0 plated 10 mm up (RING_DZ) so its teeth are in the planet's plane, because the planet covers the input axis and the input cap must stay under it |
| K6 | PASS | DATA · m 4, ring 32T R 64, planet 16T r 32, arm 32, stroke 128: as the catalogue. Tracer Y is the planet tooth opposite X (it crosses the input axis), the catalogue's '90 degrees round' read on the ring (code comment) |
| K7 | PASS | HAND · input rotary on the arm |
| D1 | PASS | HAND · tapered carrier arm with boss rings, true involute teeth on ring and planet, flush caps, squircle base |
| D2 | PASS | HAND · bosses round the keyed input and the planet pin; no windows: the gears are small and turn at constant speed |
| D3 | PASS | STYLE · roles told apart by pattern and tone in both sheets |
| D4 | PASS | AUTO · feet and corner holes concentric with the base arcs |
| D5 | N/A | AUTO / HAND · no bridge is possible: the planet covers the input axis, so nothing can stand over it; the ring is held by four posts |
| D6 | PASS | HAND / STYLE · posts, screws, pins and marks read quieter than the ring, planet and arm; the ring is see-through over the mesh |
| D7 | PASS | HAND · ring, planet and arm carry only teeth, boss rings and the 15 degree scale |
| A1 | PASS | AUTO · pO J2, pC J3, mesh J6 (internal); no slot, slide or cam |
| A2 | PASS | AUTO · live shaft at the accent input, shoulder bolt at the planet pin, mesh hardware at the teeth |
| A3 | PASS | AUTO · Ø8 pin joint: F698ZZ flanged bearing in the planet; Ø8 input shaft on 688-2RS in the housing |
| A4 | PASS | AUTO · stepped Ø8 h6 input shaft with D-flat, circlip grooves and end retainer; no dead axle here |
| A5 | PASS | AUTO · D-flat on the Ø8 input shaft, D-bored arm |
| A6 | PASS | AUTO · the ring floats over the base on four Ø10 x 12 standoffs, M5 button heads from both sides (the rule built two, the polish adds two), spigoted |
| A7 | PASS | AUTO · 8 mm base, 200 mm, counterbored corners, feet, scale, hole for the input shaft, both tracer lines engraved |
| A8 | PASS | AUTO · every head has its shank; holes cut by stage 3 |
| A9 | PASS | AUTO / HAND · single shear at the input and at the planet pin, both forced: the planet's pitch circle passes through the input axis, so it always covers it and no bridge or second carrier plate can reach over; the input shaft rides two housing bearings 15 mm apart and the planet pin has a short overhang on a flanged bearing |
| A10 | PASS | HAND · arm alone below; ring, planet and tracers in one plane above it |
| A11 | PASS | AUTO / HAND · tooth force to planet bearing to bolt to arm to keyed shaft to housing bearings (screwed, dowelled) to base; ring to four posts, screws both sides, two spigots; tracer pins pressed into planet teeth |
| A12 | PASS | AUTO · clamp check clean |
| A13 | PASS | AUTO / HAND · named hardware with catalogue sizes; the unnamed solids are further items of a listed set |
| A14 | PASS | HAND · ring posts' inner edge 71 mm from the axis, 3 mm outside the planet's tooth tips (68); the ring screw heads clear the tracers by 4 mm; arm sweep radius 42; clearance tool 0 |
| A15 | PASS | AUTO · clearance: 0 clashes over the cycle |
| A16 | PASS | HAND · notes and badges on pO, pC, mesh, ring posts and tracers; five build rules |
| A17 | PASS | HAND · base, housing, input shaft, arm on its D-flat, ring on its posts, planet on its bearing and spacer, bolt, tracer pins; screws reached from above and below, bearings pulled after their circlips |
| E1 | PASS | AUTO · every solid rigid, one level; checked at full explode |
| E2 | PASS | AUTO · heads stay on their shanks at full explode |
| E3 | PASS | AUTO · screws and bolt back out along their axes |
| E4 | PASS | HAND · bolt, planet and bearing, spacer, then the ring on its posts and the arm; walked at 70 degrees |
| E5 | PASS | AUTO · bearings, circlips and tracer pins stay in their parts |
| E6 | PASS | AUTO · motor and bracket move as one |
| E7 | PASS | AUTO · spacers and washers sit midway |
| E8 | PASS | AUTO · keyed arm and thrust washer keep their order on the input shaft |
| E9 | PASS | HAND · full explode at 28 and 70 degrees, both sheets: nothing inside another part, nothing leaves the frame |
| J1 | N/A | AUTO · no ground dead axle: the ring is fixed, the planet pin is a moving pin |
| J2 | PASS | AUTO · input: housing cartridge with two bearings, sleeve, wave washer, circlips, dowels, keyed shaft, thrust washer, end retainer, home flag. Not straddled: nothing can stand over the shaft (A9) |
| J3 | PASS | AUTO · shoulder bolt Ø8 into the arm, flanged bearing in the planet with circlip, inner-race spacer, washer under the head, threadlocker |
| J4 | N/A | AUTO · no slot or roller |
| J5 | N/A | AUTO · no slide |
| J6 | PASS | AUTO · internal mesh, timing marks (corrected by hand), circlip and flanged bearing on the planet. N/A lines: hub with set screw (neither gear is keyed), eccentric for backlash (centre distance is the arm, exact), see F7 |
| J7 | N/A | AUTO · no cam |
| J8 | PASS | AUTO · belt of the drive: GT2 32:16, flanged pulleys, tension slot |
| F1 | PASS | AUTO · housing dowels at the input; round and slotted spigots on the ring posts; tracer pins pressed into the teeth |
| F2 | PASS | AUTO · circlips and end retainer on the input shaft, circlip and flange on the planet bearing, screws on the ring posts |
| F3 | PASS | AUTO · D-flat Ø8 on the input shaft and the arm bore |
| F4 | PASS | AUTO / HAND · wave and thrust washers at the input; bearing flange and inner-race spacer at the planet, which never touches the arm |
| F5 | N/A | AUTO / HAND · continuous rotary input, nothing to over-travel |
| F6 | N/A | AUTO / HAND · positive drive, no rest position to hold |
| F7 | N/A | AUTO / HAND · the centre distance R - r is the arm and exact (K1); backlash comes from the cut tooth thickness. No eccentric can sit on the planet pin without changing a modelled length. Promotion candidate noted. The drive's bracket slot adjusts the belt |
| F8 | N/A | AUTO · shielded bearings, no sliding contact; the open teeth are greased at assembly (in the mesh note) |
| F9 | PASS | AUTO / HAND · match line on the ring space and on the planet tooth that meet at arm angle 0, an index on the arm, a 15 degree scale on the ring face |
| F10 | PASS | AUTO / HAND · drive by the rule: home flag, fork sensor, pulley flanges; no slip clutch (nothing can jam: the load is a free tracer) |
| M1 | PASS | AUTO · top edges chamfered by the primitives |
| M2 | N/A | HAND · both gears are small and run at constant speed, they do not start, stop or reverse |
| M3 | PASS | AUTO · bore entry rings on the planet bearing seat and the arm |
| M4 | PASS | AUTO / HAND · counterbores in the base, button heads on the ring's flat face |
| M5 | PASS | AUTO / HAND · the one cut-out beyond the teeth, the ring's spigot slot, has full-radius ends |
| M6 | PASS | AUTO · edge distance and walls clean |
| M7 | N/A | HAND · no bracket or plate turns a load round a corner |
| M8 | PASS | AUTO · ISO 7379 shoulder bolt carries its undercut; the shaft's threaded end by A4 |
| M9 | PASS | AUTO / HAND · ISO coarse threads M3 to M6 with lengths from the standard series |
| M10 | PASS | AUTO / HAND · every solid names a material |
| M11 | PASS | AUTO · chamfers and centre holes on the input shaft by A4 |
| M12 | PASS | HAND · ring screws reached from above and from under the base, planet bolt from above, housing screws under the base; planet bearing pulled after its circlip |
| M13 | PASS | AUTO / HAND · no threaded fastener without a locking method |
| M14 | N/A | AUTO / HAND · no sliding contact to wear |
| V1 | PASS | AUTO · pancake outrunner under the base, 32:16 belt |
| V2 | PASS | AUTO · one bracket, flange screws up into the base |
| V3 | PASS | AUTO / HAND · belt and pulleys clear of feet and housings; clearance 0 |
| V4 | PASS | AUTO · pulley flanges, set screws, tension slot |
| V5 | PASS | AUTO · rotary: belt to the input pulley |
| V6 | PASS | AUTO · home flag, fork sensor, leads, terminal block, cable clip |
| L1 | PASS | STYLE · no look value in the mechanism files; lint-style clean |
| L2 | PASS | HAND · model and polish carry geometry, roles, materials, marks and accent only |
| L3 | PASS | HAND · arm driver stipple, planet output hatching, ring ground dashes, base dot grid, hardware plain |
| L4 | PASS | HAND / STYLE · accent only on the input cap; the accent shows on the shaft ring, the traced paths and the forces |
| L5 | PASS | AUTO / HAND · the ring over the pitch point is drawn see-through; the hidden-share test passes |
| L6 | PASS | AUTO · depth order right at plan, 28, 70 and side elevation |
| L7 | PASS | STYLE · tilt 0 to 88 degrees, no shear |
| L8 | PASS | AUTO / HAND · chain centrelines automatic; tracer lines and the scale engraved; match marks as fine ink lines |
| R1 | PASS | HAND · polish uses H.disc, H.spigot, H.dowel and clones the rules' own post solids; the only outline made is the spigot slot, from core geometry |
| R2 | PASS | HAND · threads M3, M4, M5, M6; bearings 688-2RS, F698ZZ; Ø10 standoffs; Ø6 spigots; Ø2 and Ø3 pins; GT2 16T and 32T |
| R3 | PASS | AUTO · no part copied: the two added posts are the rule's post duplicated |
| R4 | PASS | AUTO · package 22.1 KB |
| R5 | PASS | HAND · polish 1 ms, no sampling |
| R6 | FLAG | FLAG · bench in Node (CPU canvas, DPR 1.5, 1393 x 870): 254 ms plan, 241 ms 28 degrees, 274 ms side, 239 ms explode 70 degrees at full detail; 50 ms at dial C, 33 ms at dial H. The Node canvas runs far slower than the browser; flag only |
| R7 | PASS | HAND · model.ts + polish.ts 11.7 KB |
| R8 | PASS | AUTO / SITE · site behaviour, unchanged |
| DL1 | PASS | AUTO / HAND · 35 of 111 solids on a dropping rung; no solid moved on the ladder |
| DL2 | PASS | HAND · model detail full |
| DL3 | PASS | AUTO · table-driven |
| DL4 | PASS | SITE · site |
| DL5 | FLAG | FLAG · bench reports the rungs: see the detail ladder |
| Q1 | PASS | check, clamp and edge distance clean |
| Q2 | PASS | 0 clashes |
| Q3 | PASS | package written, 22.2 KB; site build not checked here · package written, 22.1 KB; the site page reads the catalogue by id |
| Q4 | PASS | local: tools/shot · tools/shot: plan, 28, side, explode at 28 and 70 degrees, dark and light, overlays on; looked at every one |
| Q5 | PASS | local: tools/bench · bench run: Node numbers in R6 (flag) |
| Q6 | PASS | every requirement PASS, N/A with reason, or FLAG; ten-function table filled for every joint |
| Q7 | PASS | tools/conformance at 2.3 |

## Joints
| Joint | Type | F1 locate | F2 retain | F3 torque | F4 thrust | F5 limit | F6 hold | F7 adjust | F8 lube | F9 timing | F10 protect |
|---|---|---|---|---|---|---|---|---|---|---|---|
| pO | J2 | 2 x Dowel pin Ø3 x 10 h6, housing to base | 2 x Internal circlip DIN 472, Ø16; Countersunk M4 x 10 (ISO 10642), into the shaft end, flush; Socket head M4 x 8 (ISO 4762), into the shaft end | Input shaft Ø8 h6, D-flat | Wave washer 12x15.8, spring steel; Thrust washer 8.2x14, bronze | – continuous rotation | – positive drive | – belt slot at the drive; no gear on this shaft | – sealed bearings | – arm index mark, zero at +x | – see drive |
| pC | J3 | – the shoulder of the bolt seats in the arm; no plate to locate | Internal circlip DIN 472, Ø19; Bearing F698ZZ (8x19x6); head | – bearing carries the planet, no key | Bearing F698ZZ (8x19x6); Inner-race spacer sleeve 8.2x11.9 | – continuous rotation | – positive mesh | – centre distance is the arm, exact | – shielded bearing | – match marks at the mesh | – nothing can jam |
| mesh-ring-planet | J6 | – the arm and the posts fix the centres | – the planet's circlip and bearing flange hold it | – neither gear is keyed: the planet turns free on its bearing | – the planet does not touch the arm (4 mm gap, spacer and flange carry the thrust) | – continuous rotation | – positive mesh | – N/A: centre distance fixed by the arm (promotion candidate: eccentric planet pin) | – open teeth greased at assembly (noted) | Ring gear, 32 teeth; Planet, 16 teeth; Carrier arm | – nothing can jam |
| ring-post | post | 2 x Spigot Ø6 h7 on the standoff, one round, one in a slot | 4 x Button head M5 x 16 (ISO 7380) | – static | – static | – static | – static | – static | – none | – none | – none |
| drive | drive | – by the rule | – by the rule | – by the rule | – by the rule | – n/a | – n/a | bracket | – n/a | – home flag | Home flag, 1 mm steel vane; 3 x Fork sensor, slotted optical, 5 mm gap; Pulley flanges |
| tracers | post | 2 x Tracer pin Ø2 h6, pressed in the planet tooth | 2 x Tracer pin Ø2 h6, pressed in the planet tooth | – friction fit, no torque | – the head sits 1 mm over the planet face | – n/a | – n/a | – n/a | – none | – X and Y on opposite teeth | – n/a |

## Variants and overrides
| Joint or part | Rule result | Chosen | Why |
|---|---|---|---|
| ring posts | two posts at the farthest points, no spigot | four posts, round spigot and slotted spigot | A ring 168 mm across on two posts is not held or located; spigots put it back centred (F1, A11) |
| ring rim | rim 80 | rim 84 (model) | the posts stand outside the planet's tooth tips (68) with 3 mm to spare |
| ring plating | layer plane | layer 0, plated +10 mm (model) | the planet covers the input axis, so the arm sits under it and the ring must lie in the planet's plane |
| timing marks | marks at the mesh point | replaced by a line on the ring space and the planet tooth that meet at arm angle 0 | the rule puts an internal mesh's marks on the far side of the ring (promotion candidate) |
| tracers | marker only | a Ø2 pin pressed into the planet tooth under each head | a tracer is a real part on the pitch circle |
| pO, pC | single shear, warn | kept | the planet always covers the input axis, so nothing can reach over it |

## Detail ladder
| Rung | Solids | Marks | Frame ms at this dial position |
|---|---|---|---|
| DL-A | 8 | 0 | 221.2 |
| DL-B | 0 | 136 | 197.8 |
| DL-C | 0 | 0 | 49.7 |
| DL-D | 11 | 0 | 39.0 |
| DL-E | 8 | 2 | 35.8 |
| DL-F | 0 | 0 | 38.2 |
| DL-G | 0 | 0 | 36.3 |
| DL-H | 8 | 0 | 32.8 |
| never | 76 | 116 | 257.1 (full) |

## Promotion candidates
Hand fixes that should become rules or primitives.

- `classify` (src/rules/classify.ts, `meshes`): the mesh point of an internal pair has the wrong sign (`ringA ? -ra : ra` puts it on the far side of the ring when the ring is the first gear, and on the ring centre when the planet is). It should be `ringA ? ra : -ra`. It misplaces the F9 timing marks and the mesh joint's position; the polish replaces the marks.
- `check` (src/model/check.ts): a fixed pin inside a ring gear's big opening counts as rigid with the ring and warns when the ring's layer is out of its range, although the rule's classify ignores big openings. Worked round by plating the ring into layer 0 (RING_DZ); a check that skips holes big enough to clear the pin would let the ring sit on the planet's own layer.
- `j6-mesh`: F7 for a planet carried on an arm: an eccentric planet pin (or shims) to set backlash; no live shaft to put the eccentric on.
- `standoffs`: a round plate of radius above 40 mm gets two posts; four posts at 90 degrees with a round and a slotted spigot (done here by cloning) would be the rule for large rings.

## Verification
check: clean · clearance: 0 clashes · clamp: clean · edge distance: clean · package: 22.2 KB
screenshots: plan, 28°, side, explode at 28° and 70°, dark and light, overlays on (tools/shot, looked at every one; attach to #40) · bench: Node CPU, 254 ms plan, 241 ms 28°, 274 ms side, 239 ms explode 70° at full detail; 50 ms at dial C (flag, R6)
