# Audit: Eccentric sheave and strap (eccentric-sheave)
standard: 2.6 · date: 2026-10-19 · result: pass · detail: full · pass: build

## Summary
PASS 113 · FAIL 0 · N/A 8 · open: none

## Requirements
| Id | Status | Evidence / action |
|---|---|---|
| S1 | PASS | DATA · the standard carries version 2.0 and its changelog |
| S2 | PASS | HAND · header with standard, date, result, detail, pass |
| S3 | PASS | AUTO · tools/conformance reads this header and runs in npm run check |
| S4 | PASS | SITE · #13 holds only this mechanism's decisions and open items |
| P1 | PASS | DATA · record complete; model.ts, polish.ts, audit.md present |
| P2 | PASS | DATA · catalogue validator clean |
| P3 | PASS | DATA / SITE · page shows ratio (stroke 2e), axes, output character, backdrivable, other names, family, motion, level, dof and the motorised drive |
| P4 | PASS | DATA · tags grouped Function, Property, Application, keywords underneath |
| P5 | PASS | DATA · motion, forces, benefits, limits; four uses with one line each |
| P6 | PASS | DATA · Wikipedia and a textbook; two videos and a photo page |
| P7 | PASS | HAND / SITE · no prose in model.ts or polish.ts; lint-style clean |
| P8 | PASS | SITE · no parts list, build or joint sections on the page |
| P9 | PASS | HAND · checked against solve(): the rod moves 24 mm (x 138 to 162, twice the throw of 12), its obliquity peaks at 4.6°; motion is near-harmonic, as the catalogue says. The catalogue's angular advance is a phase against a main crank this model does not have; the sheave angle is the cycle phase |
| P10 | PASS | HAND · sheave centre path traced, velocity at V and E, rod force line, input spin, obliquity angle, valve rod position plot |
| P11 | PASS | DATA · plain, short sentences, no em dashes, mm and degrees |
| K1 | PASS | HAND · check: link error 0; the polish adds hardware and changes no centre |
| K2 | PASS | HAND · check: finite, continuous, periodic over 720 samples |
| K3 | PASS | HAND · custom (sheave, strap), slider, plate (valve rod cap), rails, caps; between, at and fixed placement |
| K4 | PASS | HAND · roles driver, link, output, ground, pin; accent only on the input cap pO |
| K5 | PASS | HAND · check clean: valve rod block and rails layer 0, sheave and strap layer 1 (one plane), cap layer 2 plated 2.5 mm down; the strap's bore clears the sheave. The shaft cap spans layers -1 to 1 |
| K6 | PASS | DATA · e 12, R 40, l 150: travel 24 mm from x 138 to 162, obliquity 4.6°, as the catalogue; the strap's bore is the sheave's bearing, so there is no pin at E (the catalogue counts it as the crank pin) |
| K7 | PASS | HAND · input rotary on the sheave |
| D1 | PASS | HAND · the strap is a tapered link (R55 round the sheave to R8.5 at the wrist pin), the sheave a plain disc with an engraved ring, slider with square ends on two stadium rails |
| D2 | PASS | HAND · material round the strap's big end where the rubbing load runs, tapering to the rod; bosses round the wrist pin; no windows |
| D3 | PASS | STYLE · roles told apart by pattern and tone in both sheets |
| D4 | PASS | AUTO · feet concentric with the corner arcs |
| D5 | PASS | AUTO / HAND · rails seated on ground risers on the base; the cap on a single shaped post |
| D6 | PASS | HAND / STYLE · slide hardware, stops and leads read quieter than sheave, strap and block |
| D7 | PASS | HAND · sheave, strap, valve rod block, rails and base carry only load shape and manufacturing marks |
| A1 | PASS | AUTO · pO J2, pV J3, slide J5; E, the strap on the sheave, is built by hand (the rules read it as a shaft in a slot and build nothing) |
| A2 | PASS | AUTO · live input shaft, shoulder bolt at V, slide on the rails |
| A3 | PASS | AUTO · 6800-2RS on the Ø10 input, F686ZZ on the Ø6 wrist pin; spacers in every gap. HAND at E: bronze liner Ø80.2 x Ø84 x 6 in the strap's bore |
| A4 | PASS | AUTO · stepped shoulder bolts with undercut threads; keyed input shaft with end retainer |
| A5 | PASS | AUTO · feather key 3 x 3 on the Ø10 input shaft |
| A6 | PASS | AUTO · each rail sits on a 2 mm ground steel riser, countersunk M3 screws down through rail and riser into the base (on the gib rail through keeper and gib); the reference rail dowelled by its end screws |
| A7 | PASS | AUTO · 8 mm base 2 mm under the block, counterbored corners, feet, sheave centre path engraved, front scale, clearance hole for the input shaft |
| A8 | PASS | AUTO · every head has its shank; holes cut by stage 3 |
| A9 | PASS | HAND · V a clevis (block and cap): double shear. E: the journal is the full 6 mm thickness, flanges on both faces. O single shear: nothing sweeps over the shaft end, but a bridge would need posts outside the strap's R55 sweep, so the shaft is carried by two housing bearings 15 mm apart |
| A10 | PASS | HAND · block and rails near the base; sheave and strap in one plane, 10 mm over; cap 1.5 mm over the strap's rod end |
| A11 | PASS | HAND · strap to liner to sheave to key to shaft to the housing (screwed and dowelled); wrist pin to block and cap to the rails, keeper and gib; rails screwed through their risers into the base, the reference rail dowelled |
| A12 | PASS | AUTO · clamp check clean |
| A13 | PASS | AUTO / HAND · every solid named with catalogue sizes, sets counted |
| A14 | PASS | HAND · flanges 0.5 mm clear of the strap faces, nipple and cap post clear of every sweep; clearance tool: 0 clashes over the cycle; the cable clip moved clear of the motor bracket's rim (M6) |
| A15 | PASS | AUTO · clearance: 0 clashes over the cycle |
| A16 | PASS | HAND · a note and a badge on every joint, five build rules |
| A17 | PASS | HAND · housing and shaft, sheave; strap over the disc, then the flange rings and their screws; rail risers, rails and dowels, gib, block, keeper; wrist pin and cap last |
| E1 | PASS | AUTO · one level per solid |
| E2 | PASS | AUTO · screws, bolts with their shims, shafts and bought units are groups |
| E3 | PASS | AUTO · pins and cap screw upward, housing and drive screws downward |
| E4 | PASS | HAND · flange rings off first, then the strap; wrist pin and cap above the strap's rod end: the last part fitted goes furthest |
| E5 | PASS | AUTO · bearings and circlips stay in their parts |
| E6 | PASS | AUTO · motor with its bracket, bearings whole |
| E7 | PASS | AUTO · spacers midway |
| E8 | PASS | AUTO · sheave and key keep their order on the input shaft |
| E9 | PASS | HAND · readable at full explode at 28° and 70° |
| J1 | N/A | no dead axle |
| J2 | PASS | AUTO · input: housing with two sealed bearings, sleeve, wave washer, circlips, screwed and dowelled; keyed shaft, pulley hub with two set screws, end retainer, thrust washer, home flag |
| J3 | PASS | AUTO · V: shoulder bolt threaded into the block, bearing in the strap, inner-race spacers, threadlocked; clevis (variant). E: by hand, see the joints table |
| J4 | N/A | the shaft inside the strap's bore is read as a pin in a slot by the rules, but it is the sheave's bearing: built by hand as a bronze liner, no roller |
| J5 | PASS | AUTO / HAND · a few blocks: the dowelled reference rail, a bronze gib clamped under the keeper by the other rail's screws, felt wipers at both ends, grease nipple, an end stop block with a neoprene pad at each end |
| J6 | N/A | no gear mesh |
| J7 | N/A | no cam |
| J8 | PASS | AUTO · flanged motor pulley, mount slotted for tension |
| F1 | PASS | AUTO · housing dowelled; the reference rail located by two dowels by its end screws (the gib on the other takes up the fit); no removable bearing plate on a moving pin |
| F2 | PASS | AUTO · bearings held by a circlip and their flange; keeper holds the block down; shaft end retainer; two flange rings screwed to the sheave hold the strap on the disc |
| F3 | PASS | AUTO · feather key at the input |
| F4 | PASS | AUTO · bronze thrust washer on the base under the sheave, wave washer preloading the input; the liner takes the strap's side thrust against the flange rings |
| F5 | PASS | AUTO / HAND · end stops with neoprene pads just past both ends of the stroke |
| F6 | N/A | driven; no rest position to hold |
| F7 | N/A | HAND · the stroke is fixed by the sheave's offset and the guide line by the dowelled rail; the strap's length sets no ratio the model needs exact; gib and belt tension are adjustable |
| F8 | PASS | AUTO / HAND · felt wipers at both ends of the block, grease nipple on the keeper; grease nipple on the strap's ring feeding the liner; shielded and sealed bearings |
| F9 | N/A | one input and nothing else in phase with it |
| F10 | PASS | AUTO / HAND · pulley flanges, home flag and fork sensor; no slip clutch: the stops are never touched in running |
| M1 | PASS | AUTO · edge breaks on every top face |
| M2 | N/A | HAND · the sheave turns at constant speed and never starts, stops or reverses; a plain disc, no lightening. Balancing its offset mass is a matter for the engine's crankshaft, outside this model |
| M3 | PASS | AUTO · bore entry chamfers on every seat and through hole |
| M4 | PASS | AUTO / HAND · counterbored housing screws and base corners, countersinks for the keeper and rail screws |
| M5 | PASS | AUTO / HAND · no milled pockets or windows |
| M6 | PASS | AUTO · edge distance and walls clean |
| M7 | PASS | HAND · the strap is a hull of circles; no inside corner |
| M8 | PASS | AUTO · undercuts on every shoulder bolt thread |
| M9 | PASS | AUTO / HAND · wrist pin into the bronze block over full thickness; the cap screw 3.5 mm into the bronze block (over 1 d); flange screws M3 into the sheave; standard lengths |
| M10 | PASS | AUTO / HAND · steel sheave and strap, bronze liner, bronze block, hardened ground rails, bronze gib |
| M11 | PASS | AUTO · centre holes and chamfered ends on the shafts |
| M12 | PASS | HAND · every head reachable; bearings pressed out past their circlips |
| M13 | PASS | AUTO / HAND · threadlocker on every screw; the gib is held by the keeper's clamp, no lock nuts |
| M14 | PASS | AUTO · the sliding pair is hardened screwed rails against a bronze crosshead, with a bronze gib: rails and gib are the replaceable wear parts |
| V1 | PASS | AUTO · pancake outrunner Ø50 x 18 under the base, GT2 32:16 |
| V2 | PASS | AUTO · one-piece bracket, flange screws up into the base |
| V3 | PASS | AUTO / HAND · belt and pulleys clear of feet and housing; clearance 0 |
| V4 | PASS | AUTO · flanges, set screws, slotted mount |
| V5 | PASS | AUTO · rotary: belt to the input pulley |
| V6 | PASS | AUTO · home flag, fork sensor on the housing, leads laid round the housing to the terminal block, one P-clip |
| L1 | PASS | STYLE · lint-style clean |
| L2 | PASS | HAND · the polish carries geometry, roles, marks and materials only |
| L3 | PASS | HAND · sheave driver, strap link, block and cap output, rails ground, hardware hw |
| L4 | PASS | HAND / STYLE · accent on the input only |
| L5 | PASS | AUTO / HAND · screws, bearings and the roller are real solids in real holes |
| L6 | PASS | AUTO · depth order right at plan, 28°, side and explode |
| L7 | PASS | STYLE · tilt 0° to 88°, no shear |
| L8 | PASS | AUTO / HAND · engraved sheave centre path and scale are marks |
| R1 | PASS | HAND · the polish reuses H.bushing, H.plate, H.screw, H.nipple, H.standoff; plating and the clevis twin are the model's; no inline standard part |
| R2 | PASS | HAND · threads M3, M4, M5, M6 (nipple); joints Ø6 and Ø10; two bearing sizes (6800-2RS, F686ZZ) |
| R3 | PASS | AUTO · housing, bridge and drive from their subassemblies |
| R4 | PASS | AUTO · package built at build time |
| R5 | PASS | HAND · states only what differs; no sampling; rules 0.08 s, polish 1 ms |
| R6 | PASS | FLAG · browser bench (RTX 5090, ANGLE, DPR 1.5): plan 2.1, side 2.0, explode 70° 2.3, 28° 2.7 ms at full detail; every dial position under 3 ms; runs vary by up to 25 % |
| R7 | PASS | HAND · model.ts + polish.ts 9.4 KB |
| R8 | PASS | AUTO / SITE · pre-rendered thumbnails; the stage draws on change only |
| DL1 | PASS | AUTO / HAND · every solid and mark on a rung; the polish moves nothing |
| DL2 | PASS | HAND · default dial full |
| DL3 | PASS | AUTO · DL-D drawn when exploded, DL-B skipped at side elevation |
| DL4 | PASS | SITE · adaptive dial and the detail entry in the title block |
| DL5 | PASS | FLAG · rung counts and frame times in the detail ladder below |
| Q1 | PASS | check, clamp and edge distance clean |
| Q2 | PASS | 0 clashes |
| Q3 | PASS | package written; site build and site tests pass |
| Q4 | PASS | plan, 28°, side, explode at 28° and 70°, both sheets viewed locally with tools/shot |
| Q5 | PASS | browser bench at DPR 1.5; flags under R6 |
| Q6 | PASS | every row judged |
| Q7 | PASS | conformance: eccentric-sheave at 2.6, pass |

## Joints
| Joint | Type | F1 locate | F2 retain | F3 torque | F4 thrust | F5 limit | F6 hold | F7 adjust | F8 lube | F9 timing | F10 protect |
|---|---|---|---|---|---|---|---|---|---|---|---|
| pO | J2 | 2 x Dowel pin Ø3 x 10 h6, housing to base | 2 x Internal circlip DIN 472, Ø19; Countersunk M5 x 12 (ISO 10642), into the shaft end, flush; Socket head M5 x 10 (ISO 4762), into the shaft end | Feather key 3 x 3 x 6 (DIN 6885) | Wave washer 14.5x18.8, spring steel; Thrust washer 10.2x16, bronze | – turns fully | – driven through the belt | – belt tension at the motor mount (drive) | – sealed bearings | – one input, nothing in phase | – see drive |
| pV | J3 | – no removable plate on a moving pin | Internal circlip DIN 472, Ø13; Bearing F686ZZ (6x13x5); head | – the cap is clamped on the shoulder; no keyed part | F686ZZ located by flange and circlip, inner race clamped | – limited by the slide's stops | – driven | – no adjustable length | – shielded bearing, greased for life | – no phase to keep | – none needed |
| slide-block | J5 | – the reference rail is dowelled to the base | Keeper plate, holds the slider down | – prismatic, no torque | – the keeper takes the lift, the base the weight | 2 x End stop block, hardened | – driven | Gib strip 82 x 7 x 2.3, bronze, slotted, clamped under the keeper | 2 x wiper; Grease nipple M6 (DIN 71412) | – no phase to keep | – stops never touched in running |
| raila-seat | post | – not dowelled: the gib on it takes up the fit against the reference rail | – screwed down through keeper, gib, rail and riser | – static | – static | – static | – static | – the gib on this rail adjusts the fit | – static | – static | – static |
| railb-seat | post | 2 x Dowel pin Ø3 h6 (ISO 8734), rail to base | – screwed down through rail and riser | – static | – static | – static | – static | – the gib on the other rail adjusts the fit | – static | – static | – static |
| drive | drive | – bracket screwed up into the base | – pulley hub set screws (pO) | Pulley hub, 2 x M3 set screws at 90° | – motor bearings | – motor turns freely | – motor holds when powered | bracket | – belt runs dry | Home flag read by the fork sensor | Home flag, 1 mm steel vane; 3 x Fork sensor, slotted optical, 5 mm gap; Pulley flanges |
| E | J3 | Bronze liner Ø80.2 x Ø84 x 6 | 2 x Sheave flange ring Ø86 x 1.5, screwed to the sheave | Feather key 3 x 3 x 6 (DIN 6885) | Bronze liner Ø80.2 x Ø84 x 6 | – turns fully | – driven | – no adjustable length | Bronze liner Ø80.2 x Ø84 x 6; Grease nipple DIN 71412 M6, feeding the strap liner | – no phase to keep | – none needed |

## Variants and overrides
| Joint or part | Rule result | Chosen | Why |
|---|---|---|---|
| pV | wrist pin through block and strap, single shear | block clevis: the cap twinned with the block in the model, 1.5 mm over the strap's rod end, on a post at x 14 screwed into the block | A9: double shear |
| E (sheave in strap) | none: no pin is declared there, the rules read the shaft in the strap's bore as a slot | bronze liner, two screwed flange rings, a grease nipple, built by hand | the strap's bore is the sheave's bearing; the catalogue's crank pin |
| strap | straight stadium | ring R55 round E tapering to R8.5, in the model | D1 |
| drive-clip, its screw | P-clip on the middle of the motor lead's longest run | moved 3 mm along and 5 mm down the lead | M6: the clip's screw hole would break the bracket flange's rim |

## Detail ladder
| Rung | Solids | Marks | Frame ms at this dial position |
|---|---|---|---|
| DL-A | 8 | 0 | 2.57 |
| DL-B | 0 | 146 | 1.85 |
| DL-C | 0 | 0 | 1.62 |
| DL-D | 13 | 0 | 1.68 |
| DL-E | 12 | 0 | 1.49 |
| DL-F | 0 | 0 | 1.62 |
| DL-G | 0 | 0 | 1.44 |
| DL-H | 11 | 0 | 1.33 |
| never | 91 | 120 | 2.78 (full) |

## Promotion candidates
- A strap on a disc (a sheave in its strap): liner, flange rings and nipple as one subassembly. One mechanism so far, so not yet.
- The cable clip rule puts its screw on the motor bracket's flange when the motor sits near the base edge (offset-slider-crank has the same fix; whitworth moves the terminal block): the cabling rule should keep clip and terminal block clear of the bracket.

## Verification
check: clean · clearance: 0 clashes · clamp: clean · edge distance: clean · package: 23.5 KB
screenshots: plan, 28°, side, explode at 28° and 70°, both sheets (viewed locally; the shot tool output is not committed) · bench: browser, DPR 1.5, RTX 5090, 2026-10-19; 28° frame 2.7 ms at full detail (flag, R6)
