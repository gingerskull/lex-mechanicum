# Audit: Offset slider-crank (offset-slider-crank)
standard: 2.6 · date: 2026-10-19 · result: pass · detail: full · pass: build

## Summary
PASS 115 · FAIL 0 · N/A 6 · open: none

## Requirements
| Id | Status | Evidence / action |
|---|---|---|
| S1 | PASS | DATA · the standard carries version 2.0 and its changelog |
| S2 | PASS | HAND · header with standard, date, result, detail, pass |
| S3 | PASS | AUTO · tools/conformance reads this header and runs in npm run check |
| S4 | PASS | SITE · #13 holds only this mechanism's decisions and open items |
| P1 | PASS | DATA · record complete; model.ts, polish.ts, audit.md present |
| P2 | PASS | DATA · catalogue validator clean |
| P3 | PASS | DATA / SITE · page shows ratio (stroke 61.4 mm), axes, output character, backdrivable, other names, family, motion, level, dof and the motorised drive |
| P4 | PASS | DATA · tags grouped Function, Property, Application, keywords underneath |
| P5 | PASS | DATA · motion, forces, benefits, limits; four uses with one line each |
| P6 | PASS | DATA · Wikipedia and a textbook; two videos and a photo page |
| P7 | PASS | HAND / SITE · no prose in model.ts or polish.ts; lint-style clean |
| P8 | PASS | SITE · no parts list, build or joint sections on the page |
| P9 | PASS | HAND · checked against solve(): dead centres at x 67.1 and 128.5 (stroke 61.4 mm) at crank angles 196.6° and 8.8°, so the slider moves out in 172.2° and back in 187.8° (1.09:1); rod obliquity up to 30° (the return stroke) |
| P10 | PASS | HAND · crank pin path traced, velocity at B and A, rod force line, input spin, obliquity angle, slider position plot |
| P11 | PASS | DATA · plain, short sentences, no em dashes, mm and degrees |
| K1 | PASS | HAND · check: link error 2.8e-14 mm; the polish changes heights and outlines only |
| K2 | PASS | HAND · check: finite, continuous, periodic over 720 samples |
| K3 | PASS | HAND · link, slider, plate (crosshead cap), rails, caps; between, at and fixed placement |
| K4 | PASS | HAND · roles driver, link, output, ground, pin; accent only on the input cap pO |
| K5 | PASS | HAND · check clean: crank, crosshead and rails layer 0, rod layer 1, cap layer 2; the crank is plated 2.5 mm up and the cap 2.5 mm down with `dz` in model.ts, and the rules build every stack on them (K1) |
| K6 | PASS | DATA · r 30, l 100, e 20, guide on y = 20: stroke 61.4 from x 67.1 to 128.5 as the catalogue |
| K7 | PASS | HAND · input rotary on the crank |
| D1 | PASS | HAND · tapered rod (R8.5 and R8), crank with bosses and a counterweight lobe, slider with square ends on two stadium rails |
| D2 | PASS | HAND · bosses round every pin; material in the crank where it balances; no windows |
| D3 | PASS | STYLE · roles told apart by pattern and tone in both sheets |
| D4 | PASS | AUTO · feet concentric with the corner arcs |
| D5 | PASS | AUTO / HAND · rails seated on ground risers on the base; the cap on a single shaped post |
| D6 | PASS | HAND / STYLE · slide hardware, stops and leads read quieter than crank, rod and crosshead |
| D7 | PASS | HAND · crank, rod, crosshead, rails and base carry only load shape and manufacturing marks |
| A1 | PASS | AUTO · pO J2, pA J3, pB J3, slide J5 |
| A2 | PASS | AUTO · live input shaft, shoulder bolts at A and B, slide on the rails |
| A3 | PASS | AUTO · 6800-2RS on the Ø10 input, F686ZZ on the Ø6 crank pin and on the Ø6 wrist pin; spacers in every gap |
| A4 | PASS | AUTO · stepped shoulder bolts with undercut threads; keyed input shaft with end retainer |
| A5 | PASS | AUTO · feather key 3 x 3 on the Ø10 input shaft |
| A6 | PASS | AUTO · each rail sits on a 2 mm ground steel riser, countersunk M3 screws down through rail and riser into the base (on the gib rail through keeper and gib); the reference rail dowelled by its end screws |
| A7 | PASS | AUTO · 8 mm base 2 mm under the crosshead, counterbored corners, feet, crank pin path engraved, front scale, clearance hole for the input shaft |
| A8 | PASS | AUTO · every head has its shank; holes cut by stage 3 |
| A9 | PASS | HAND · B a clevis (crosshead and cap): double shear. A single shear (the rod sweeps over the input boss), overhang 1.5 mm: the crank is plated up because the rod cannot come down over the keeper; the input shaft carries it on two bearings |
| A10 | PASS | HAND · crank, crosshead and rails near the base; rod 1.5 mm over the crank; cap 1.5 mm over the rod |
| A11 | PASS | HAND · crank pin to crank to keyed input to the housing (screwed and dowelled); wrist pin to crosshead and cap to the rails, keeper and gib; rails screwed through their risers into the base, the reference rail dowelled |
| A12 | PASS | AUTO · clamp check clean |
| A13 | PASS | AUTO / HAND · every solid named with catalogue sizes, sets counted |
| A14 | PASS | HAND · posts, stops and risers clear of the crank's sweep and the rod's; clearance tool: 0 clashes over the cycle with the cap post at x 14 on the side the rod never swings to; the cable clip is moved clear of the motor bracket's rim (M6) |
| A15 | PASS | AUTO · clearance: 0 clashes over the cycle |
| A16 | PASS | HAND · a note and a badge on every joint, five build rules |
| A17 | PASS | HAND · housing and shaft, crank; rail risers, rails and dowels, gib, crosshead, keeper; rod on both pins; cap post, cap and its screw; wrist pin last |
| E1 | PASS | AUTO · one level per solid |
| E2 | PASS | AUTO · screws, bolts with their shims, shafts and bought units are groups |
| E3 | PASS | AUTO · pins and cap screw upward, housing and drive screws downward |
| E4 | PASS | HAND · wrist pin and cap above the rod, rod above crank and crosshead: the last part fitted goes furthest |
| E5 | PASS | AUTO · bearings and circlips stay in their parts |
| E6 | PASS | AUTO · motor with its bracket, bearings whole |
| E7 | PASS | AUTO · spacers midway |
| E8 | PASS | AUTO · crank and key keep their order on the input shaft |
| E9 | PASS | HAND · readable at full explode at 28° and 70° |
| J1 | N/A | no dead axle |
| J2 | PASS | AUTO · input: housing with two sealed bearings, sleeve, wave washer, circlips, screwed and dowelled; keyed shaft, pulley hub with two set screws, end retainer, thrust washer, home flag |
| J3 | PASS | AUTO · A and B: shoulder bolts threaded into the crank and the crosshead, bearings in the rod, inner-race spacers, threadlocked; clevis at B (variant) |
| J4 | N/A | no pin in a slot |
| J5 | PASS | AUTO / HAND · a few blocks: the dowelled reference rail, a bronze gib clamped under the keeper by the other rail's screws, felt wipers at both ends, grease nipple, an end stop block with a neoprene pad at each end |
| J6 | N/A | no gear mesh |
| J7 | N/A | no cam |
| J8 | PASS | AUTO · flanged motor pulley, mount slotted for tension |
| F1 | PASS | AUTO · housing dowelled; the reference rail located by two dowels by its end screws (the gib on the other takes up the fit); no removable bearing plate on a moving pin |
| F2 | PASS | AUTO · bearings held by a circlip and their flange; keeper holds the crosshead down; shaft end retainer |
| F3 | PASS | AUTO · feather key at the input |
| F4 | PASS | AUTO · bronze thrust washer on the base under the crank, wave washer preloading the input |
| F5 | PASS | AUTO / HAND · end stops with neoprene pads just past both ends of the stroke |
| F6 | N/A | driven; no rest position to hold |
| F7 | PASS | AUTO · bronze gib clamped under the keeper by the rail screws, set on slotted holes; belt tension at the motor mount |
| F8 | PASS | AUTO · felt wipers at both ends of the crosshead, grease nipple on the keeper; shielded and sealed bearings |
| F9 | N/A | one input and nothing else in phase with it |
| F10 | PASS | AUTO / HAND · pulley flanges, home flag and fork sensor; no slip clutch: the stops are never touched in running |
| M1 | PASS | AUTO · edge breaks on every top face |
| M2 | PASS | HAND · counterweight lobe on the crank balancing the pin, big end and part of the rod |
| M3 | PASS | AUTO · bore entry chamfers on every seat and through hole |
| M4 | PASS | AUTO / HAND · counterbored housing screws and base corners, countersinks for the keeper and rail screws |
| M5 | PASS | AUTO / HAND · no milled pockets or windows |
| M6 | PASS | AUTO · edge distance and walls clean |
| M7 | PASS | HAND · the crank is a hull of circles; no inside corner |
| M8 | PASS | AUTO · undercuts on every shoulder bolt thread |
| M9 | PASS | AUTO / HAND · pins into the steel crank and the bronze crosshead over full thickness; the cap screw 3.5 mm into the bronze crosshead (over 1 d); standard lengths |
| M10 | PASS | AUTO / HAND · steel crank and rod, bronze crosshead, hardened ground rails, bronze gib |
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
| L3 | PASS | HAND · crank driver, rod link, crosshead and cap output, rails ground, hardware hw |
| L4 | PASS | HAND / STYLE · accent on the input only |
| L5 | PASS | AUTO / HAND · screws, bearings and the roller are real solids in real holes |
| L6 | PASS | AUTO · depth order right at plan, 28°, side and explode |
| L7 | PASS | STYLE · tilt 0° to 88°, no shear |
| L8 | PASS | AUTO / HAND · engraved crank pin path and scale are marks |
| R1 | PASS | HAND · the polish reuses H.standoff and H.screw; plating, the clevis twin, the counterweighted crank and the tapered rod are the model's; no inline standard part |
| R2 | PASS | HAND · threads M3, M4, M5; joints Ø6 and Ø10; two bearing sizes (6800-2RS, F686ZZ) |
| R3 | PASS | AUTO · housing, bridge and drive from their subassemblies |
| R4 | PASS | AUTO · package built at build time |
| R5 | PASS | HAND · states only what differs; no sampling; rules 0.05 s, polish under 1 ms |
| R6 | PASS | FLAG · browser bench (RTX 5090, ANGLE, DPR 1.5): plan 2.5, side 1.8, explode 70° 2.5, 28° 2.5 ms at full detail; every dial position under 3 ms; runs vary by up to 22 % |
| R7 | PASS | HAND · model.ts + polish.ts 6.0 KB |
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
| Q7 | PASS | conformance: offset-slider-crank at 2.6, pass |

## Joints
| Joint | Type | F1 locate | F2 retain | F3 torque | F4 thrust | F5 limit | F6 hold | F7 adjust | F8 lube | F9 timing | F10 protect |
|---|---|---|---|---|---|---|---|---|---|---|---|
| pO | J2 | 2 x Dowel pin Ø3 x 10 h6, housing to base | 2 x Internal circlip DIN 472, Ø19; Countersunk M5 x 12 (ISO 10642), into the shaft end, flush; Socket head M5 x 10 (ISO 4762), into the shaft end | Feather key 3 x 3 x 6 (DIN 6885) | Wave washer 14.5x18.8, spring steel; Thrust washer 10.2x16, bronze | – turns fully | – driven through the belt | – belt tension at the motor mount (drive) | – sealed bearings | – one input, nothing in phase | – see drive |
| pA | J3 | – no removable plate on a moving pin | Internal circlip DIN 472, Ø13; Bearing F686ZZ (6x13x5); head | – no keyed part | F686ZZ located by flange and circlip, inner race clamped | – limited by the linkage | – driven | – no adjustable length | – shielded bearing, greased for life | – no phase to keep | – none needed |
| pB | J3 | – no removable plate on a moving pin | Internal circlip DIN 472, Ø13; Bearing F686ZZ (6x13x5); head | – the cap is clamped on the shoulder; no keyed part | F686ZZ located by flange and circlip, inner race clamped | – limited by the slide's stops | – driven | – no adjustable length | – shielded bearing, greased for life | – no phase to keep | – none needed |
| slide-block | J5 | – the reference rail is dowelled to the base | Keeper plate, holds the slider down | – prismatic, no torque | – the keeper takes the lift, the base the weight | 2 x End stop block, hardened | – driven | Gib strip 113 x 7 x 2.3, bronze, slotted, clamped under the keeper | 2 x wiper; Grease nipple M6 (DIN 71412) | – no phase to keep | – stops never touched in running |
| raila-seat | post | – not dowelled: the gib on it takes up the fit against the reference rail | – screwed down through keeper, gib, rail and riser | – static | – static | – static | – static | – the gib on this rail adjusts the fit | – static | – static | – static |
| railb-seat | post | 2 x Dowel pin Ø3 h6 (ISO 8734), rail to base | – screwed down through rail and riser | – static | – static | – static | – static | – the gib on the other rail adjusts the fit | – static | – static | – static |
| drive | drive | – bracket screwed up into the base | – pulley hub set screws (pO) | Pulley hub, 2 x M3 set screws at 90° | – motor bearings | – motor turns freely | – motor holds when powered | bracket | – belt runs dry | Home flag read by the fork sensor | Home flag, 1 mm steel vane; 3 x Fork sensor, slotted optical, 5 mm gap; Pulley flanges |

## Variants and overrides
| Joint or part | Rule result | Chosen | Why |
|---|---|---|---|
| crank | layer 0, z 0 to 6 | plated 2.5 mm up in the model (`dz`), z 2.5 to 8.5 | A9: 1.5 mm overhang under the rod at A; the rod cannot come down, the keeper runs under it |
| pB | wrist pin through crosshead and rod, single shear | crosshead clevis: the cap twinned with the crosshead in the model, 1.5 mm over the rod, on a post at x 14 screwed into the crosshead | A9: double shear |
| crank | straight stadium | counterweighted plate, in the model | M2: balance |
| rod | straight stadium | tapered in the model, bosses R8.5 and R8 | D1 |
| drive-clip, its screw | P-clip on the middle of the motor lead's longest run | moved 3 mm along and 5 mm down the lead | M6: the motor lands close to the base edge, and the clip's screw hole would break the bracket flange's rim (wall -0.6 mm) |

## Detail ladder
| Rung | Solids | Marks | Frame ms at this dial position |
|---|---|---|---|
| DL-A | 10 | 0 | 2.51 |
| DL-B | 0 | 166 | 1.87 |
| DL-C | 0 | 0 | 1.69 |
| DL-D | 17 | 0 | 1.69 |
| DL-E | 11 | 0 | 1.51 |
| DL-F | 0 | 0 | 1.62 |
| DL-G | 0 | 0 | 1.37 |
| DL-H | 11 | 0 | 1.21 |
| never | 82 | 123 | 2.63 (full) |

## Promotion candidates
- The cable clip rule puts its screw on the motor bracket's flange when the motor sits near the base edge (also the terminal block in whitworth's polish): the cabling rule should keep the clip, and the terminal block, clear of the bracket.

## Verification
check: clean · clearance: 0 clashes · clamp: clean · edge distance: clean · package: 21.6 KB
screenshots: plan, 28°, side, explode at 28° and 70°, both sheets (viewed locally; the shot tool output is not committed) · bench: browser, DPR 1.5, RTX 5090, 2026-10-19; 28° frame 2.5 ms at full detail (flag, R6)
