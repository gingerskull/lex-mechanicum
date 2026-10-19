# Audit: Desmodromic valve cam (desmodromic-cam)
standard: 2.6 · date: 2026-10-19 · result: pass · detail: full · pass: build

## Summary
PASS 116 · FAIL 0 · N/A 5 · open: none

## Requirements
| Id | Status | Evidence / action |
|---|---|---|
| S1 | PASS | DATA · the standard carries version 2.6 and its changelog |
| S2 | PASS | HAND · header with standard, date, result, detail, pass |
| S3 | PASS | AUTO · tools/conformance reads this header and runs in npm run check |
| S4 | PASS | SITE · #127 holds only this mechanism's decisions and open items |
| P1 | PASS | DATA · record complete; model.ts, polish.ts, audit.md present |
| P2 | PASS | DATA · catalogue validator clean (tests/catalog) |
| P3 | PASS | DATA / SITE · stroke ratio (valve lift 10 mm per cam turn), rotary to in-plane linear, reciprocating with dwell, other names, family, motion, level, dof 1, motorised drive: all in the record |
| P4 | PASS | DATA · tags grouped Function, Property, Application, keywords underneath |
| P5 | PASS | DATA · motion, forces, benefits, limits; three uses with one line each |
| P6 | PASS | DATA · references, a video, a photo page; the real-world videos are the catalogue's and were not rechecked in this pass: look at them when convenient |
| P7 | PASS | HAND / SITE · no prose in model.ts, geometry.ts or polish.ts besides names, notes and build rules (engineering record, not on the page); lint-style clean |
| P8 | PASS | SITE · no parts list, build or joint sections on the page |
| P9 | PASS | HAND · solve(): the lobes turn u, the valve rises 10 mm over 60° (cycloidal), returns over 60°, is shut for 240°; the record says the same; the opening rocker carries the valve while it is accelerated open, the closing one while it is slowed (the overlay follows); pressure angles at most 33° and 27° |
| P10 | PASS | HAND · paths of the two noses, the valve's velocity, the input spin, the push of the lobe that carries the valve, a plot of the valve lift over the cam angle |
| P11 | PASS | DATA · plain, short sentences, no em dashes, mm and degrees |
| K1 | PASS | HAND · the lobes' outlines are the offset of each shoe's path, the rockers' centres and arms 30 / 30, the noses' faces and the valve's lift are the model's; rings, pads, bolts and marks are fitted behind them (max link error 0.0e+0 mm); tests/mechanisms/desmodromic-cam.test.ts samples every angle |
| K2 | PASS | HAND · check: finite, continuous, periodic over 720 samples |
| K3 | PASS | HAND · only the part family: custom outlines, rails, caps; fixed, between or at placement with spin |
| K4 | PASS | HAND · roles driver (lobes), link (rockers), output (valve, collar halves), ground (guide strips), pin; accent only on the input cap pO |
| K5 | PASS | HAND · opening lobe, rocker, valve and strips on layer 0, closing lobe and the fork's lower plate on layer -1 plated 2.5 low, the fork's upper plate on layer 1 plated 2.5 high (plating is K1-allowed); the hung pivot's cap at its part's layer; check clean |
| K6 | PASS | DATA · valve lift 10, cycloidal 60 / 60 / 240, lash 0.1, arms 30 / 30, base circles 18 and 28, head Ø34: as the catalogue. Deliberate differences, commented in model.ts: the lobes' radial lift is 10.15 not 10 (the shoe moves on an arc); 28 is the closing lobe's smallest radius; both rockers pivot on one side and turn the same way (the catalogue's psi2 = -psi1 is a mirror sense); sliding shoes of radius 8, no rollers; lash 0.1 at each shoe, none at the noses; the cam arms cranked 6 mm away from the lobe; the valve is a flat plate 10 wide with a collar of two halves |
| K7 | PASS | HAND · input rotary on the opening lobe |
| D1 | PASS | HAND · two keyed lobes, two bell-crank rockers with round noses and shoes, a fork of two plates, a valve plate on twin strips: the one family of forms |
| D2 | PASS | HAND · bosses round every pin; the rockers narrow to their noses where nothing may touch the collar and crank away from the lobe; the big lobe has spoke windows inside its base circle |
| D3 | PASS | STYLE · roles told apart by pattern and tone in both sheets (screenshots) |
| D4 | PASS | AUTO · feet and corner holes concentric with the base corner arcs |
| D5 | PASS | AUTO / HAND · bridges (H.bridge) over the camshaft, the hung pivot and the fork's axle, on spigoted posts |
| D6 | PASS | HAND / STYLE · bridges, oilers, pads and screws read quieter than the lobes and rockers (screenshots) |
| D7 | PASS | HAND · lobes, rockers and valve carry only load shape and marks; the richness is in the shaft, bearings, rings, pads, collar, seat and marks |
| A1 | PASS | AUTO · pO J2, pQ1 and pQ2 J1, slide-valve J5, two J7 cam contacts; the shoes and noses slide on faces with no model pin |
| A2 | PASS | AUTO · pO a live shaft (accent input, two keyed lobes); pQ1 a hung stud and pQ2 a dead axle; the valve on strips |
| A3 | PASS | AUTO · 688 bearings on the Ø8 shafts and axles |
| A4 | PASS | AUTO · stepped D-flat input shaft with circlip grooves; shouldered axle and hung stud |
| A5 | PASS | AUTO · the Ø8 shaft D-flat for both lobes' bores |
| A6 | PASS | AUTO · the strips sit on risers screwed to the base; posts and housing as the rules |
| A7 | PASS | AUTO · 8 mm base, counterbored corners, feet, front scale, clearance hole for the live shaft |
| A8 | PASS | AUTO · every head has its shank; holes cut by stage 3 |
| A9 | PASS | AUTO / HAND · the fork is a clevis (two plates on one axle, the stem and collar between, double shear); the camshaft straddled between housing and bridge; the opening rocker's stud is hung from a bridge into the rocker alone, single shear forced by the 38 mm closing lobe turning 4.6 mm from the pivot, so no axle can stand there |
| A10 | PASS | HAND · the opening lobe and rocker share a plane with the valve; the closing lobe and the fork's lower plate share the plane below; nothing stacked only to clear |
| A11 | PASS | HAND · opening push: shoe, rocker, bearing, stud, bridge, posts, base; closing pull: lobe, fork plate, axle, nyloc, base and bridge; camshaft: key, shaft, bearings, housing, base |
| A12 | PASS | AUTO · clamp check clean |
| A13 | PASS | AUTO / HAND · every solid named with catalogue sizes, sets counted |
| A14 | PASS | HAND · bridge posts and oiler holders outside every moving part's sweep; clearance 0 |
| A15 | PASS | AUTO · clearance: 0 clashes over the cycle |
| A16 | PASS | HAND · a note and a badge on every joint, four build rules |
| A17 | PASS | HAND · housing and shaft from below, the closing lobe and plate, the opening lobe, the fork's lower plate on its axle, the valve through the strips with the collar's halves clamped on it, the fork's upper plate and tie, the opening rocker on its stud, bridges last; every screw reachable, bearings pressed out past their circlips |
| E1 | PASS | AUTO · one level per solid |
| E2 | PASS | AUTO · screws, shafts and bought units are groups |
| E3 | PASS | AUTO · screws leave along their axis to the head side, nuts the other way |
| E4 | PASS | HAND · bridges and their screws go furthest up, the fork's upper plate and the lobes in the middle, housing and shaft below: reverse of assembly |
| E5 | PASS | AUTO · bearings and circlips stay in their parts |
| E6 | PASS | AUTO · motor with its bracket, bearings whole |
| E7 | PASS | AUTO · spacers midway |
| E8 | PASS | AUTO · keyed parts keep their order on the shaft |
| E9 | PASS | HAND · looked at the explode at 70% and 100% at 28°, both sheets: nothing inside another part, nothing leaves the frame |
| J1 | PASS | AUTO · pQ2 a dead axle through the base to a nyloc, held by a bridge (double shear in the fork); pQ1 hung (see A9) |
| J2 | PASS | AUTO · input: housing with two bearings, sleeve, wave washer, circlips, dowelled; D-flat shaft, thrust washer, home flag; straddle mounted in the bridge |
| J3 | N/A | AUTO · no moving pin: the shoes and noses slide on faces |
| J4 | N/A | AUTO · no pin in a slot |
| J5 | PASS | AUTO · the valve between two strips: a reference strip dowelled, a keeper with a gib on the other, a wiper, a nipple, a stop at the head's end; the closing stop is the seat |
| J6 | N/A | AUTO · no gear mesh |
| J7 | PASS | AUTO · two J7 contacts declared; the rockers do not translate, so the rule builds no spring (form closure); zero line on each lobe and the index; hardened lobes, rings and shoe pads (M14) |
| J8 | PASS | AUTO · flanged motor pulley, mount slotted for tension |
| F1 | PASS | AUTO · housing dowelled; the reference strip dowelled; bridges on spigoted posts; the collar located by a cross dowel |
| F2 | PASS | AUTO · bearings on circlips; the keeper holds the valve down; rings, pads and nose pads screwed; sleeves and bolts clamp the collar |
| F3 | PASS | AUTO · the lobes keyed to a D-flat shaft; the valve guided by the strips |
| F4 | PASS | AUTO / HAND · bronze thrust washers on the shaft and axles, a wave washer in the housing |
| F5 | PASS | AUTO / HAND · a stop for the fork's swing, the slide's stop at the head's end, and two hardened seat blocks the valve shuts on |
| F6 | N/A | AUTO / HAND · form-closed: the closing rocker holds the valve shut and the opening one pushes it open; no spring (that is the mechanism) |
| F7 | PASS | AUTO / HAND · the lash is set by grinding the shoe pad; the gib sets the valve's side play; belt tension at the motor mount |
| F8 | PASS | AUTO / HAND · a felt oiler on each lobe's track; wiper and nipple on the slide; sealed or shielded bearings |
| F9 | PASS | AUTO / HAND · a zero line on each lobe and an index on the base: fit both lobes in phase with the valve shut |
| F10 | PASS | AUTO / HAND · pulley flanges, home flag, fork sensor; no slip clutch (none planned) |
| M1 | PASS | AUTO · edge breaks on every top face |
| M2 | PASS | HAND · spoke windows in the closing lobe inside its base circle; the opening lobe's body is too small for them; the rockers swing 19.5° at most and are plates |
| M3 | PASS | AUTO · bore entry chamfers on every seat and through hole |
| M4 | PASS | AUTO / HAND · counterbored base corners and housing screws; countersunk screws in the rings and pads where the rockers sweep over |
| M5 | PASS | AUTO / HAND · the lobe windows have a 3 mm cutter radius |
| M6 | PASS | AUTO · edge distance and walls clean |
| M7 | N/A | HAND · no bracket or plate with a loaded inside corner beyond the rockers' filleted crotch |
| M8 | PASS | AUTO · thread undercut on the shoulder bolts and axles |
| M9 | PASS | AUTO / HAND · collar bolts M3 into the 4.5 mm steel half; ring screws M2 into the case-hardened lobes; post screws as the rules |
| M10 | PASS | AUTO / HAND · case-hardened steel lobes, rockers, collar and valve, tool steel rings, pads and seats, bronze gib and washers, aluminium base |
| M11 | PASS | AUTO · centre holes and chamfered ends on the shafts |
| M12 | PASS | HAND · every head reachable; bearings pressed out past their circlips |
| M13 | PASS | AUTO / HAND · threadlocker on every screw, nyloc where a nut |
| M14 | PASS | AUTO / HAND · a hardened ring on each lobe's rim and a hardened pad on each shoe, screwed in and replaceable; hardened nose pads, seat blocks and the slide's gib and strips |
| V1 | PASS | AUTO · pancake outrunner Ø50 x 18 under the base, GT2 32:16 |
| V2 | PASS | AUTO · one-piece bracket, flange screws up into the base |
| V3 | PASS | AUTO / HAND · belt and pulleys clear of feet and housing; clearance 0 |
| V4 | PASS | AUTO · flanges, set screws, slotted mount |
| V5 | PASS | AUTO · rotary: belt to the input pulley on the camshaft |
| V6 | PASS | AUTO / HAND · home flag, fork sensor, leads to the terminal block, P-clip; the rule's clip landed on the bracket's flange, so the polish slides it along its lead (promotion candidate) |
| L1 | PASS | STYLE · lint-style clean |
| L2 | PASS | HAND · model and polish carry geometry, roles, marks and materials only |
| L3 | PASS | HAND · lobes driver, rockers link, valve and collar output, strips ground, hardware hw |
| L4 | PASS | HAND / STYLE · accent on the input cap only |
| L5 | PASS | AUTO / HAND · screws, bearings, rings and pads are real solids in real holes; the bridges are see-through over the lobes' sweep |
| L6 | PASS | AUTO · depth order right at plan, 28°, side and explode in both sheets |
| L7 | PASS | STYLE · tilt 0° to 88°, no shear |
| L8 | PASS | AUTO / HAND · match marks and tapped-hole rings are marks |
| R1 | PASS | HAND · the polish reuses H.wearStrip, H.screw, H.tube, H.dowel, H.standoff, H.felt, H.spokes and straddle; the rockers' outlines are generated by geometry.ts (a union of round arms), no standard part inline |
| R2 | PASS | HAND · threads M2, M3, M4, M5, M6; shafts and axles Ø8; bearings from the table |
| R3 | PASS | AUTO · housing, bridges and drive from their subassemblies |
| R4 | PASS | AUTO · package built at build time (package 35.1 KB) |
| R5 | PASS | HAND · states only what differs; one clearance search per oiler, no heavy sampling |
| R6 | PASS | FLAG · FLAG: browser bench 2026-10-19: plan 3.32, 28° 4.52, side 3.43, explode 3.86 ms at full detail; setup 16 ms; under the 8 ms target at every dial position; run spread 43 % |
| R7 | PASS | HAND · model.ts + polish.ts 19.8 KB |
| R8 | PASS | AUTO / SITE · pre-rendered thumbnails; the stage draws on change only |
| DL1 | PASS | AUTO / HAND · every solid and mark on a rung |
| DL2 | PASS | HAND · default dial full (model detail full) |
| DL3 | PASS | AUTO · DL-D drawn when exploded, DL-B skipped at side elevation |
| DL4 | PASS | SITE · adaptive dial and the detail entry in the title block |
| DL5 | PASS | FLAG · FLAG: rung counts and frame times in the detail ladder below |
| Q1 | PASS | check, clamp and edge distance clean |
| Q2 | PASS | 0 clashes |
| Q3 | PASS | package written, 35.1 KB; site build left to the local run listed under Verification |
| Q4 | PASS | local: tools/shot · plan, 28°, side, explode at 70% and 100% at 28°, both sheets, overlays on, looked at (dist/shots/desmodromic-cam) |
| Q5 | PASS | local: tools/bench · browser bench run; under Verification |
| Q6 | PASS | · every row judged |
| Q7 | PASS | · conformance: desmodromic-cam at 2.6, pass |

## Joints
| Joint | Type | F1 locate | F2 retain | F3 torque | F4 thrust | F5 limit | F6 hold | F7 adjust | F8 lube | F9 timing | F10 protect |
|---|---|---|---|---|---|---|---|---|---|---|---|
| pO | J2 | 2 x Dowel pin Ø3 x 10 h6, housing to base | 3 x Internal circlip DIN 472, Ø16; Socket head M4 x 8 (ISO 4762), into the shaft end; External circlip DIN 471, Ø8; Bearing F688ZZ (8x16x5), floating | Input shaft Ø8 h6, D-flat | Wave washer 12x15.8, spring steel; Thrust washer 8.2x14, bronze | none | none | none | none | none | none |
| pQ1 | J1 | 2 x spigot | Internal circlip DIN 472, Ø16; Bearing F688ZZ (8x16x5); External circlip DIN 471, Ø8 | none | none | none | none | none | none | none | none |
| pQ2 | J1 | 2 x spigot | 2 x Internal circlip DIN 472, Ø16; 2 x Bearing F688 (8x16x5) | none | Thrust washer 8.2x10.8, bronze | Stop bumper, neoprene sleeve Ø12 | none | none | Bridge over the pivot, on two spigoted posts | none | none |
| slide-valve | J5 | none | Keeper plate, holds the slider down | none | none | End stop block, hardened | none | Gib strip 61 x 7 x 2.3, bronze, slotted, clamped under the keeper | wiper; Grease nipple M6 (DIN 71412) | none | none |
| cam-lobeOpen | J7 | none | none | none | none | none | none | none | none | Opening lobe | none |
| cam-lobeClose | J7 | none | none | none | none | none | none | none | none | Closing lobe | none |
| pQ1-bridge-post | post | 2 x spigot | none | none | none | none | none | none | none | none | none |
| pQ2-bridge-post | post | 2 x spigot | none | none | none | none | none | none | none | none | none |
| guidea-seat | post | none | none | none | none | none | none | none | none | none | none |
| guideb-seat | post | 2 x Dowel pin Ø3 h6 (ISO 8734), rail to base | none | none | none | none | none | none | none | none | none |
| drive | drive | none | none | none | none | none | none | bracket | none | none | Home flag, 1 mm steel vane; 3 x Fork sensor, slotted optical, 5 mm gap; Pulley flanges |
| pO-bridge-post | post | 2 x spigot | none | none | none | none | none | none | none | none | none |
| valve-collar | post | Cross dowel Ø3 h6 (ISO 8734), collar to stem | Button head M3 x 16 (ISO 7380) | none | none | none | none | none | none | none | none |
| valve-seat | stop | none | none | none | none | Valve seat insert, hardened, two halves, 2 x M3 csk each | none | none | none | none | none |

## Variants and overrides
| Joint or part | Rule result | Chosen | Why |
|---|---|---|---|
| pQ1 | a dead axle from the base, bridged | a hung stud from a bridge into the opening rocker alone (model: `top: "hung"`) | the closing lobe, 38 in radius, turns 4.6 mm from the pivot, under the rocker's boss (A9) |
| pQ2 | a bearing in each plate, no tie | the rule's clevis build plus a tie post between the plates and a hardened nose pad hooking in from each plate (polish) | the rules know nothing of a fork that must stay one rigid body (A9, M14) |
| collar | none (not a part of any rule) | two model parts, bolts through sleeves and a cross dowel (polish) | a model part so the rules' sweeps keep clear of it; bolts clamp the stem between the halves (F1, F2) |
| lobes and shoes | a bare cam and follower | hardened ring on each rim, hardened pad on each shoe, oilers (polish) | M14, F8 |
| cam contacts | follower train with spring | none: the rockers do not translate, so the rule builds no spring | form closure, desmodromic by definition |
| valve seat | none | two hardened blocks screwed to the base, faces the head's cone (polish) | the closing hard stop (F5) |
| drive cable clip | at the lead's longest run | slid along the lead off the bracket's flange (polish) | it cut the flange's wall (V6) |

## Detail ladder
| Rung | Solids | Marks | Frame ms at this dial position |
|---|---|---|---|
| DL-A | 14 | 0 | 4.43 |
| DL-B | 0 | 240 | 2.73 |
| DL-C | 0 | 0 | 2.98 |
| DL-D | 22 | 0 | 2.65 |
| DL-E | 10 | 6 | 2.29 |
| DL-F | 0 | 0 | 2.68 |
| DL-G | 0 | 0 | 1.85 |
| DL-H | 27 | 0 | 1.69 |
| never | 182 | 151 | 4.55 (full) |

## Promotion candidates
- Two or more cam contacts on one shaft with no translating follower: J7 notes "form closure" but the audit's F6 row has no hook to say N/A.
- The cable clip rule (V6) should keep clear of the motor bracket's flange, as Whitworth's terminal block (a workaround there too).
- A rocker built from round arms (a smooth union with a fillet) and a lobe as the offset of a shoe path are generic: `geometry.ts` could become a `P.bellCrank` and a cam-envelope helper.
- A collar or shoulder on a slide's slider with a fork that straddles it (clevis in z) is a build the rules could offer.

## Verification
check: clean · clearance: 0 clashes · clamp: clean · edge distance: clean · package: 35.1 KB
screenshots: plan, 28°, side, explode at 70% and 100% at 28°, both sheets, overlays on, drawn in local Chrome to dist/shots/desmodromic-cam/ (looked at) · bench: browser, DPR 1.5, 2026-10-19; plan 3.32 ms, 28° 4.52 ms, side 3.43 ms, explode 70% 3.86 ms at full detail, under 8 ms at every dial (R6)
unit tests: tests/mechanisms/desmodromic-cam.test.ts samples the shoe-to-lobe gap at every 0.25° (0.0997 to 0.1006 mm against a lash of 0.1), the base circles (18.00, 28.00), the valve's faces against the noses, and each rocker against its lobe over the cycle (no overlap); pressure angle 33.0° (opening) and 27.1° (closing), from the catalogue's 10 mm in 60° on an 18 base
