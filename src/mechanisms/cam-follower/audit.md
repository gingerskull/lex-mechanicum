# Audit: Cam and roller follower (cam-follower)
standard: 2.5 · date: 2026-10-18 · result: pass · detail: full · pass: build

## Summary
PASS 116 · FAIL 0 · N/A 5 · open: none

## Requirements
| Id | Status | Evidence / action |
|---|---|---|
| S1 | PASS | DATA · the standard carries version 2.3 and its changelog |
| S2 | PASS | HAND · header with standard, date, result, detail, pass |
| S3 | PASS | AUTO · tools/conformance reads this header |
| S4 | PASS | SITE · #21 holds only this mechanism's decisions and open items |
| P1 | PASS | DATA · record complete; model.ts, polish.ts, audit.md present |
| P2 | PASS | DATA · catalogue validator clean |
| P3 | PASS | DATA / SITE · page facts from the record: Stroke ratio, rotary to linear, reciprocating and harmonic output, not backdrivable; motorised by the rotary drive |
| P4 | PASS | DATA · tags grouped Function, Property, Application, keywords underneath |
| P5 | PASS | DATA · motion, forces, benefits, limits; three uses with one line each |
| P6 | PASS | DATA · Wikipedia (two), Carnegie Mellon and IIT Kharagpur texts; two YouTube videos (SOHC valve train in slow motion, a classroom cam and follower demonstration) and a Cornell KMODDL photo page; both videos checked live (oEmbed answers, embeddable); real world: one real engine video |
| P7 | PASS | HAND / SITE · no prose in model.ts or polish.ts; lint-style clean |
| P8 | PASS | SITE · no parts list, build or joint sections on the page |
| P9 | PASS | HAND · solve() gives lift 0 to 22 mm and back each turn, 11.4 mm at 90° and 270°, rising over 180° and returning over 180° as the explanation says; pressure angle at most 16.1° (at 78.5°), under the 30° the text asks for |
| P10 | PASS | HAND · follower centre traced (comet), velocity at the roller, cam push along the contact normal, pressure angle (warns past 30°), lift against cam angle plot, input spin |
| P11 | PASS | DATA · plain, short sentences, no em dashes, mm and degrees |
| K1 | PASS | HAND · check: max link error 0.0e+0 mm · the cam outline is the catalogue profile sampled every degree; the lift is the roller envelope as the catalogue says; the polish cuts the body back behind the profile and the windows inside it |
| K2 | PASS | HAND · check: finite, continuous, periodic over 720 samples |
| K3 | PASS | HAND · custom (cam, follower plates), disc (roller), rails, cap; between and at placement |
| K4 | PASS | HAND · roles driver (cam), output (follower, roller), ground (rails), pin; accent only on the input cap pO |
| K5 | PASS | HAND · check: no INTERFERE, OVERLAP or WARN · check clean; integer layers: cam and roller 0, follower plate 1, rear plate -1, rails 1; ground pivot layer -1 radius 7, moving pin radius 5.5 |
| K6 | PASS | DATA · rb 30, h 22, rr 8, cycloidal 180° rise and 180° return, in-line, as the catalogue; the stem is 60 mm from roller to carriage centre and the rails run y 64 to 154 (catalogue: stem 70, guide y 70 to 100), so that the carriage keeps its guidance over the whole stroke; a code comment says so |
| K7 | PASS | HAND · input rotary on cam · input rotary on the cam |
| D1 | PASS | HAND · cam with one engraved base circle and a roller follower; slider on twin stadium rails; base squircle; tapered stadium follower plate |
| D2 | PASS | HAND · five spoke windows in the cam (M2) inside the base circle; follower plates carry only the stem and the bosses |
| D3 | PASS | STYLE · roles told apart by pattern and tone in both sheets |
| D4 | PASS | AUTO · fired: base (1 solid), feet (4 solids) · feet concentric with the corner arcs |
| D5 | PASS | AUTO / HAND · one bridge on two spigoted posts over the cam shaft; no scattered standoffs |
| D6 | PASS | HAND / STYLE · bridge, oiler and spring read quieter than the cam and follower in every view |
| D7 | PASS | HAND · cam, follower plates, base and bridge carry only load shape and manufacturing marks; the richness is in the ring, screws, spring, oiler, bearings |
| A1 | PASS | AUTO · pO J2, pF J3, slide-follower J5, cam-cam J7; fired: classify (no solids) · pO J2, pF J3, slide J5, cam contact J7 |
| A2 | PASS | AUTO · pO J2, pF J3, slide-follower J5, cam-cam J7 · live shaft at the cam, shoulder bolt at the roller, slide, follower train |
| A3 | PASS | AUTO · fired: classify (no solids) · 688-2RS on the Ø8 shaft, F686ZZ roller bearing on the Ø6 bolt; spacers in every gap |
| A4 | N/A | AUTO · fired: j1-dead-axle (no solids) · no dead axle; the live shaft and the shoulder bolt are stepped with undercut threads |
| A5 | PASS | AUTO · fired: j2-live-shaft (27 solids) · feather key by size handled by the rule: a D-flat on the Ø8 input shaft, D-bore in the cam |
| A6 | PASS | AUTO · fired: standoffs (22 solids) · the bridge sits on spigoted Ø10 standoffs; the rails on one ground steel riser each, screwed, the reference rail dowelled (A6, v2.4) |
| A7 | PASS | AUTO · fired: base (1 solid), feet (4 solids) · 8 mm base, counterbored corner holes, feet, scale, clearance hole for the input shaft; the follower path is the plan's line of travel |
| A8 | PASS | AUTO · fired: fasteners (stage 3) · every head has its shank; clearance and tapped holes by stage 3 |
| A9 | PASS | AUTO / HAND · fired: j2-straddle (no solids) · double shear: the roller pin is a clevis (front and rear plate); the cam shaft is straddle mounted, a bridge over the shaft with a floating bearing (asked for by hand, see promotion candidates); the carriage slides between rails on both sides |
| A10 | PASS | HAND · rear plate z -10 to -3, cam and roller 0 to 6, front plate 10 to 17; nothing stacked only to clear |
| A11 | PASS | AUTO / HAND · fired: j1-dead-axle (no solids) · roller push to bolt to bearing to both plates to the carriage to rails to risers to base; shaft to housing to base and to the bridge to posts to base; housing and bridge screwed and dowelled |
| A12 | PASS | AUTO · clamp check clean |
| A13 | PASS | AUTO / HAND · 177 solids, 95 unnamed (further items of a listed set) · every solid named with catalogue sizes; sets counted |
| A14 | PASS | HAND · bridge posts, oiler holder, spring block and stops clear every sweep; clearance 0 |
| A15 | PASS | AUTO · clearance: 0 clashes over the cycle |
| A16 | PASS | HAND · 5 build rules; no note: none; no badge: none · a note and a badge on every joint, five build rules |
| A17 | PASS | HAND · goes together from the base up: housing and shaft, cam with its ring, bridge, rails on risers, rear plate and roller on the bolt, front plate, spring and preload; every screw reachable; bearings pressed out past their circlips |
| E1 | PASS | AUTO · every solid has one explode level; levels -8 to 3.5 · one level per solid |
| E2 | PASS | AUTO · 48 rigid groups; fired: explode · every screw, bolt with its shim, shaft and bought unit is one group |
| E3 | PASS | AUTO · fired: explode · bolts leave upward, housing and drive screws downward |
| E4 | PASS | HAND · bridge and posts come off first, then the front plate, then the roller, cam and rear plate: the last part fitted goes furthest |
| E5 | PASS | AUTO · fired: explode · bearings and circlips stay in their parts |
| E6 | PASS | AUTO · fired: explode · motor and bracket move as one, bearings whole |
| E7 | PASS | AUTO · fired: explode · loose spacers sit midway |
| E8 | PASS | AUTO · fired: explode · cam and shaft keep their order |
| E9 | PASS | HAND · readable at full explode at 28° and 70°, nothing clips |
| J1 | N/A | AUTO · fired: j1-dead-axle (no solids) · no dead axle in this mechanism |
| J2 | PASS | AUTO · fired: j2-live-shaft (27 solids), j2-straddle (no solids) · live shaft with housing cartridge, key, retainer and clearance hole; straddle bridge on top |
| J3 | PASS | AUTO · fired: j3-moving-pin (13 solids) · shoulder bolt threaded into the rear plate, bearing in the roller, spacers, clevis |
| J4 | N/A | AUTO · fired: j4-slot-roller (no solids) · no pin in a slot |
| J5 | PASS | AUTO · fired: j5-slide (22 solids) · guide on twin rails: a few blocks (v2.4): the dowelled reference rail, a gib clamped under the keeper, wipers, nipple, upper end stop; the lower end stop has no room (the roller passes there) and the cam bounds that end |
| J6 | N/A | AUTO · fired: j6-mesh (no solids) · no gear mesh |
| J7 | PASS | AUTO · fired: j7-cam (4 solids) · roller on a bolt, spring with seat and preload screw, guide by the slide, felt oiler (placed by hand), zero line, hardened cam, track insert |
| J8 | PASS | AUTO · fired: j8-belt (2 solids) · belt of the drive, tensioned by the slotted mount |
| F1 | PASS | AUTO · served at pO, raila-seat, railb-seat, pO-bridge-post; fired: j2-live-shaft (27 solids) · dowels at the housing, the rails and the bridge spigots |
| F2 | PASS | AUTO · served at pO, pF, slide-follower; fired: j2-live-shaft (27 solids) · circlips and retainers on shaft, roller bearing and bridge bearing |
| F3 | PASS | AUTO · served at pO; fired: j2-live-shaft (27 solids) · D-flat on the cam shaft |
| F4 | PASS | AUTO / HAND · served at pO; fired: j2-live-shaft (27 solids) · thrust washers and wave washer on the shaft; inner-race spacers set the roller's end float |
| F5 | PASS | AUTO / HAND · served at slide-follower; fired: j5-slide (22 solids), stops (no solids) · upper end stop on the slide with its bumper; the lower end is held by the cam (the roller is spring-closed on it), and a stop block there would be in the roller's sweep |
| F6 | PASS | AUTO / HAND · served at cam-cam; fired: j7-cam (4 solids) · compression spring with seats and preload screw; the cam is hard |
| F7 | PASS | AUTO / HAND · served at slide-follower, drive; fired: j6-mesh (no solids), j5-slide (22 solids) · the slide's gib, set on slotted holes and clamped under the keeper, slotted belt mount; no exact length ratio |
| F8 | PASS | AUTO · served at slide-follower, cam-cam; fired: lubrication (no solids) · grease nipple and wipers on the slide; felt oiler on the cam track, in a holder screwed to the base |
| F9 | PASS | AUTO / HAND · served at cam-cam; fired: timing-marks (no solids) · zero line on the cam and index line on the base (rule); the cam goes on with the line on the index, the follower at the bottom |
| F10 | PASS | AUTO / HAND · served at drive; fired: drive (37 solids) · home flag and fork sensor, pulley flanges, terminal block, cable clip |
| M1 | PASS | AUTO · fired: hardware primitives · outer edges chamfered by the primitives |
| M2 | PASS | HAND · five spoke windows in the cam between the hub and the track, filleted R3; the follower plates are plain |
| M3 | PASS | AUTO · fired: j3-moving-pin (13 solids), hardware primitives · bore chamfers drawn on the cam bore and every seat |
| M4 | PASS | AUTO / HAND · fired: base (1 solid), fasteners (stage 3) · counterbores in the base; countersunk seats for the track screws |
| M5 | PASS | AUTO / HAND · fired: hardware primitives · windows carry R3 fillets (H.spokes) |
| M6 | PASS | AUTO · edge distance and walls clean |
| M7 | N/A | HAND · no bracket with a loaded inside corner; the spring block is a plain block |
| M8 | PASS | AUTO · fired: j1-dead-axle (no solids) · thread undercuts on the shoulder bolt |
| M9 | PASS | AUTO / HAND · fired: j1-dead-axle (no solids) · ISO coarse threads; engagement by the rule |
| M10 | PASS | AUTO / HAND · 177 of 177 solids name a material · every solid names a material; cam case-hardened 16MnCr5, track ring O1 tool steel 58 HRC |
| M11 | PASS | AUTO · fired: j1-dead-axle (no solids), hardware primitives · chamfered shaft ends, centre holes, flats |
| M12 | PASS | HAND · every screw reached from above or below; the track ring screws reach from the top; bearings have a hole behind them |
| M13 | PASS | AUTO / HAND · 81 threaded, 0 without a locking method · every threaded fastener has a locking method (0 without) |
| M14 | PASS | AUTO / HAND · fired: j4-slot-roller (no solids) · the cam track is a separate hardened ring held by 8 countersunk M2 screws; the slide gib is replaceable |
| V1 | PASS | AUTO · fired: drive (37 solids) · pancake motor, belt 32:16, under the base |
| V2 | PASS | AUTO · fired: drive (37 solids) · one solid bracket, flange screws from inside |
| V3 | PASS | AUTO / HAND · fired: drive (37 solids) · belt and pulleys clear of feet, housings and hardware |
| V4 | PASS | AUTO · fired: j8-belt (2 solids) · flanged pulley, tension slot |
| V5 | PASS | AUTO · fired: drive (37 solids) · rotary input: belt to the input pulley on the cam shaft |
| V6 | PASS | AUTO · fired: drive (37 solids) · home flag, fork sensor, terminal block and clip |
| L1 | PASS | STYLE · no look value in model.ts or polish.ts; lint-style clean |
| L2 | PASS | HAND · only geometry, roles, materials and the accent flag |
| L3 | PASS | HAND · roles right on every solid: cam driver, follower and roller output, rails ground |
| L4 | PASS | HAND / STYLE · accent on the input cap only; the path, forces and spin overlay carry it |
| L5 | PASS | AUTO / HAND · fired: see-through · bridge and plates are semi-transparent; the roller-on-cam contact stays in view under the bridge |
| L6 | PASS | AUTO · depth order right at plan, 28°, side and explode |
| L7 | PASS | STYLE · tilt 0 to 88° with no shear |
| L8 | PASS | AUTO / HAND · chain lines, dimensions and marks are automatic; zero line is a mark |
| R1 | PASS | HAND · the polish uses H.wearStrip, H.screw, H.spokes, H.felt, H.plate and the straddle subassembly; no outline drawn inline |
| R2 | PASS | HAND · threads M2, M2.5, M3, M4, M5; joint Ø 6, 8; bearings 688-2RS (8x16x5), F686ZZ (6x13x5), F688ZZ (8x16x5), floating · sizes as listed: M2 to M5 screws, Ø6 and Ø8 joints, two bearing sizes |
| R3 | PASS | AUTO · fired: hardware primitives · shared subassemblies only |
| R4 | PASS | AUTO · package 27.6 KB · package 27.6 KB, built by tools/package |
| R5 | PASS | HAND · polish 110 ms: the straddle's sweep search; no sampling in the polish itself |
| R6 | PASS | FLAG · node bench (CPU canvas, DPR 1.5): plan 238, 28° 255, side 268, explode 218 ms at full detail; on a par with the other three mechanisms in the same run; browser bench not run in this pass |
| R7 | PASS | HAND · model.ts + polish.ts 11.5 KB |
| R8 | PASS | AUTO / SITE · site behaviour, shared |
| DL1 | PASS | AUTO / HAND · 61 of 177 solids on a dropping rung · the rungs hold; the polish moves nothing down the ladder |
| DL2 | PASS | HAND · model detail full · default dial position full |
| DL3 | PASS | AUTO · DL-D drawn when exploded, DL-B skipped at side elevation |
| DL4 | PASS | SITE · site behaviour, shared |
| DL5 | PASS | FLAG · bench rungs in the detail table below |
| Q1 | PASS | check, clamp and edge distance clean |
| Q2 | PASS | 0 clashes |
| Q3 | PASS | package written, 27.6 KB; site build not checked here · package written, 27.6 KB; site build left to CI and the pre-push hook |
| Q4 | PASS | local: tools/shot · plan, 28°, side, explode at 28° and 70°, both sheets, overlays on, run locally |
| Q5 | PASS | local: tools/bench · node bench run; numbers under R6 |
| Q6 | PASS | every requirement judged; joints table complete |
| Q7 | PASS | tools/conformance current |

## Joints
| Joint | Type | F1 locate | F2 retain | F3 torque | F4 thrust | F5 limit | F6 hold | F7 adjust | F8 lube | F9 timing | F10 protect |
|---|---|---|---|---|---|---|---|---|---|---|---|
| pO | J2 | 2 x Dowel pin Ø3 x 10 h6, housing to base | 3 x Internal circlip DIN 472, Ø16; Socket head M4 x 8 (ISO 4762), into the shaft end; External circlip DIN 471, Ø8; Bearing F688ZZ (8x16x5), floating | Input shaft Ø8 h6, D-flat | Wave washer 12x15.8, spring steel; Thrust washer 8.2x14, bronze | – continuous rotation | – no rest position | – no adjustment | – sealed bearings | – the cam's marks are on the cam joint | – the drive row protects |
| pF | J3 | – the shoulder bolt locates in the rear plate; no removable bearing plate | Internal circlip DIN 472, Ø13; Bearing F686ZZ (6x13x5); head | – the bolt is clamped, nothing keyed | Inner-race spacer sleeves set the roller's end float between the plates | – the roller turns, no travel to limit | – no rest position | – no adjustment | – sealed bearing | – no phase | – no protection needed |
| slide-follower | J5 | – located by the rails, dowelled to the base | Keeper plate, holds the slider down | – no torque | – no axial load | End stop block, hardened | – held by the cam and spring | Gib strip 95 x 7 x 2.3, bronze, slotted, clamped under the keeper | 2 x wiper; Grease nipple M6 (DIN 71412) | – no phase | – no protection needed |
| cam-cam | J7 | – the cam is on its shaft | – retained on the shaft (J2); track ring held by 8 csk screws | – keyed on the shaft (J2) | – carried by the shaft's thrust washers (J2) | – the profile bounds the stroke | Compression spring Ø6, wire 0.8, 2.1 N/mm; Preload screw M5 and lock nut, sets the spring force | – no adjustment | Felt oiler, oil-soaked wool felt | Plate cam | – no protection needed |
| raila-seat | post | 2 x Dowel pin Ø3 h6 (ISO 8734), rail to base | – a fixed rail | – no torque | – no axial load | – fixed | – fixed | – fixed | – none needed | – no phase | – no protection needed |
| railb-seat | post | 2 x Dowel pin Ø3 h6 (ISO 8734), rail to base | – a fixed rail | – no torque | – no axial load | – fixed | – fixed | – fixed | – none needed | – no phase | – no protection needed |
| drive | drive | – located by its bracket flange | – bearing pressed in the bracket | – belt drive | – the shaft's thrust washers | – none needed | – none needed | bracket | – sealed | – the home flag marks the phase | Home flag, 1 mm steel vane; 3 x Fork sensor, slotted optical, 5 mm gap; Pulley flanges |
| pO-bridge-post | post | 2 x spigot | – bolted from both sides | – no torque | – no axial load | – fixed | – fixed | – fixed | – none needed | – no phase | – no protection needed |

## Variants and overrides
| Joint or part | Rule result | Chosen | Why |
|---|---|---|---|
| Cam shaft pO | single shear, cam overhung from the housing (the straddle rule serves gear meshes only) | straddle bridge asked for by hand | nothing sweeps over the cam axis, so A9 asks for double shear |
| Cam track | the rule leaves the profile as the cam's own edge | hardened ring 4 mm deep, 8 x M2 csk, body cut back behind it | M14 replaceable track insert |
| Cam felt oiler | the follower-train rule found no room (the profile moves in and out) | felt in a holder screwed to the base, 0.6 mm off the highest point of the track | F8 |
| Cam body | plain disc | five spoke windows inside the base circle | M2 |
| Roller pin pF | clevis from the model (twin plates) | as the rule built it | double shear, A9 |
| Slide lower end stop | no room: the roller sweeps there | none; the cam bounds that end and the spring closes the follower on it | F5 |

## Detail ladder
| Rung | Solids | Marks | Frame ms at this dial position |
|---|---|---|---|
| DL-A | 10 | 0 | 185.6 |
| DL-B | 0 | 177 | 185.6 |
| DL-C | 0 | 0 | 61.8 |
| DL-D | 15 | 0 | 49.8 |
| DL-E | 12 | 2 | 47.4 |
| DL-F | 0 | 0 | 45.6 |
| DL-G | 0 | 0 | 44.7 |
| DL-H | 15 | 0 | 33.2 |
| never | 102 | 103 | full detail 281.2 |

## Promotion candidates
- A9 straddle for live shafts that are not gears: `straddle()` in `src/rules/j2-straddle.ts` only runs for a gear mesh; it was called from this polish for the cam shaft. Make it apply to any live shaft with nothing sweeping over it, and reword its note ("the gear is carried").
- F8 felt oiler for a cam whose profile moves in and out: the follower-train rule skips the felt when the felt circle at the largest radius touches the cam. A felt in a base-screwed holder at the highest point (done here by hand) should be the rule's fallback.
- M14 track insert for a cam: a hardened ring let into the rim, body cut back (like `H.lockingSegment` for an arc); a likely `H.camTrack` once a second cam (flat-faced, barrel) needs it.
- A cam-follower with the roller as its own part cannot be named as the cam contact's follower (the follower train needs the translating body, the clearance skip needs the roller); the roller touches the cam within the clash tolerance. A `roller` field on the model's `cams` entry would fix both.

## Verification
check: clean · clearance: 0 clashes · clamp: clean · edge distance: clean · package: 27.3 KB
screenshots: plan, 28°, side, explode at 28° and 70°, both sheets (run locally; to be attached to #21) · bench: node, CPU canvas, DPR 1.5, 2026-10-18; 28° frame 255 ms at full detail, 33 ms at dial H; the same run gives 263 to 292 ms for the other mechanisms (flag, R6)
