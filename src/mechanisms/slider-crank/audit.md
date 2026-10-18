# Audit: Slider-crank (slider-crank)
standard: 2.0 · date: 2026-10-18 · result: pass · detail: full · pass: audit+fix

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
| P3 | PASS | DATA / SITE · page shows ratio (stroke 2r), axes, output character, backdrivable, other names, family, motion, level, dof and the motorised drive |
| P4 | PASS | DATA · tags grouped Function, Property, Application, keywords underneath |
| P5 | PASS | DATA · motion, forces, benefits, limits; four uses with one line each |
| P6 | PASS | DATA · Wikipedia and a textbook; two videos and a photo page |
| P7 | PASS | HAND / SITE · no prose in model.ts or polish.ts; lint-style clean |
| P8 | PASS | SITE · no parts list, build or joint sections on the page |
| P9 | PASS | HAND · fixed in the catalogue: the slider is faster in the half of the stroke farther from the crank (162° of crank, against 198° for the near half); stroke 70 mm and obliquity 18.6° match solve() |
| P10 | PASS | HAND · crank pin path traced, velocity at B and A, rod force line, input spin, obliquity angle, slider position plot |
| P11 | PASS | DATA · plain, short sentences, no em dashes, mm and degrees |
| K1 | PASS | HAND · check: link error 4.3e-14 mm; the polish changes heights and outlines only |
| K2 | PASS | HAND · check: finite, continuous, periodic over 720 samples |
| K3 | PASS | HAND · link, slider, plate (crosshead cap), rails, caps; between, at and fixed placement |
| K4 | PASS | HAND · roles driver, link, output, ground, pin; accent only on the input cap pO |
| K5 | PASS | HAND · check clean: crank, crosshead and rails layer 0, rod layer 1, cap layer 2; the crank is plated 2.5 mm up and the cap 2.5 mm down with `dz` in model.ts, and the rules build every stack on them (K1) |
| K6 | PASS | DATA · r 35, l 110, in-line, stroke 70 from x 75 to 145: as the catalogue |
| K7 | PASS | HAND · input rotary on the crank |
| D1 | PASS | HAND · tapered rod (R8.5 and R8), crank with bosses and a counterweight lobe, slider with square ends on two stadium rails |
| D2 | PASS | HAND · bosses round every pin; material in the crank where it balances; no windows |
| D3 | PASS | STYLE · roles told apart by pattern and tone in both sheets |
| D4 | PASS | AUTO · feet concentric with the corner arcs |
| D5 | PASS | AUTO / HAND · rails on posts their own width; the cap on a single shaped post |
| D6 | PASS | HAND / STYLE · slide hardware, stops and leads read quieter than crank, rod and crosshead |
| D7 | PASS | HAND · crank, rod, crosshead, rails and base carry only load shape and manufacturing marks |
| A1 | PASS | AUTO · pO J2, pA J3, pB J3, slide J5 |
| A2 | PASS | AUTO · live input shaft, shoulder bolts at A and B, slide on the rails |
| A3 | PASS | AUTO · 6800-2RS on the Ø10 input, F686ZZ on the Ø6 crank pin and on the Ø6 wrist pin; spacers in every gap |
| A4 | PASS | AUTO · stepped shoulder bolts with undercut threads; keyed input shaft with end retainer |
| A5 | PASS | AUTO · feather key 3 x 3 on the Ø10 input shaft |
| A6 | PASS | AUTO · the rails sit on 2 mm posts their own width with flush M3 |
| A7 | PASS | AUTO · 8 mm base 2 mm under the crosshead, counterbored corners, feet, crank pin path engraved, front scale, clearance hole for the input shaft |
| A8 | PASS | AUTO · every head has its shank; holes cut by stage 3 |
| A9 | PASS | HAND · B a clevis (crosshead and cap): double shear. A single shear (the rod sweeps over the input boss), overhang 1.5 mm: the crank is plated up because the rod cannot come down over the keeper; the input shaft carries it on two bearings |
| A10 | PASS | HAND · crank, crosshead and rails near the base; rod 1.5 mm over the crank; cap 1.5 mm over the rod |
| A11 | PASS | HAND · crank pin to crank to keyed input to the housing (screwed and dowelled); wrist pin to crosshead and cap to the rails, keeper and gib; rails screwed to their posts and the base |
| A12 | PASS | AUTO · clamp check clean |
| A13 | PASS | AUTO / HAND · every solid named with catalogue sizes, sets counted |
| A14 | PASS | HAND · the cap post at x 14 clears the rod's big end by 2 mm; the lower end stop shortened to clear the crank's sweep by 3 mm; clearance 0 |
| A15 | PASS | AUTO · clearance: 0 clashes over the cycle |
| A16 | PASS | HAND · a note and a badge on every joint, five build rules |
| A17 | PASS | HAND · housing and shaft, crank; rails on their posts, gib, crosshead, keeper; rod on both pins; cap post, cap and its screw; wrist pin last |
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
| J5 | PASS | AUTO / HAND · rails, keeper, bronze gib with three adjusting screws and lock nuts, felt wipers at both ends, grease nipple, end stops with neoprene pads (the lower one shortened to clear the crank) |
| J6 | N/A | no gear mesh |
| J7 | N/A | no cam |
| J8 | PASS | AUTO · flanged motor pulley, mount slotted for tension |
| F1 | PASS | AUTO · housing dowelled; the rails are located by their posts and screws; no removable bearing plate on a moving pin |
| F2 | PASS | AUTO · bearings held by a circlip and their flange; keeper holds the crosshead down; shaft end retainer |
| F3 | PASS | AUTO · feather key at the input |
| F4 | PASS | AUTO · bronze thrust washer on the base under the crank, wave washer preloading the input |
| F5 | PASS | AUTO / HAND · end stops with neoprene pads just past both ends of the stroke |
| F6 | N/A | driven; no rest position to hold |
| F7 | PASS | AUTO · bronze gib with adjusting screws and lock nuts; belt tension at the motor mount |
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
| M13 | PASS | AUTO / HAND · threadlocker on every screw, lock nuts on the gib screws |
| M14 | PASS | AUTO · the sliding pair is hardened screwed rails against a bronze crosshead, with a bronze gib: rails and gib are the replaceable wear parts |
| V1 | PASS | AUTO · pancake outrunner Ø50 x 18 under the base, GT2 32:16 |
| V2 | PASS | AUTO · one-piece bracket, flange screws up into the base |
| V3 | PASS | AUTO / HAND · belt and pulleys clear of feet, housing and post screws; clearance 0 |
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
| R2 | PASS | HAND · threads M2.5, M3, M4, M5; joints Ø5, 6, 10; three bearing sizes |
| R3 | PASS | AUTO · housing, bridge and drive from their subassemblies |
| R4 | PASS | AUTO · package built at build time |
| R5 | PASS | HAND · states only what differs; no sampling; rules 0.03 s, polish under 1 ms |
| R6 | PASS | FLAG · browser bench: plan 7.0, side 20.9, explode 17.5, 28° 62.6 ms at full detail; 8 ms reached at dial D; runs on this machine vary by up to half (look at in #14) |
| R7 | PASS | HAND · model.ts + polish.ts 5.4 KB |
| R8 | PASS | AUTO / SITE · pre-rendered thumbnails; the stage draws on change only |
| DL1 | PASS | AUTO / HAND · every solid and mark on a rung; the polish moves nothing |
| DL2 | PASS | HAND · default dial full |
| DL3 | PASS | AUTO · DL-D drawn when exploded, DL-B skipped at side elevation |
| DL4 | PASS | SITE · adaptive dial and the detail entry in the title block |
| DL5 | PASS | FLAG · rung counts and frame times in the detail ladder below |
| Q1 | PASS | check, clamp and edge distance clean |
| Q2 | PASS | 0 clashes |
| Q3 | PASS | package written; site build and site tests pass |
| Q4 | PASS | plan, 28°, side, explode at 28° and 70°, both sheets; attached to #13 |
| Q5 | PASS | browser bench at DPR 1.5; flags under R6 |
| Q6 | PASS | every row judged |
| Q7 | PASS | conformance: slider-crank at 2.0, pass |

## Joints
| Joint | Type | F1 locate | F2 retain | F3 torque | F4 thrust | F5 limit | F6 hold | F7 adjust | F8 lube | F9 timing | F10 protect |
|---|---|---|---|---|---|---|---|---|---|---|---|
| pO | J2 | 2 x Dowel pin Ø3 x 10 h6, housing to base | 2 x Internal circlip DIN 472, Ø19; Countersunk M5 x 12 (ISO 10642), into the shaft end, flush; Socket head M5 x 10 (ISO 4762), into the shaft end | Feather key 3 x 3 x 6 (DIN 6885) | Wave washer 14.5x18.8, spring steel; Thrust washer 10.2x16, bronze | – turns fully | – driven through the belt | – belt tension at the motor mount (drive) | – sealed bearings | – one input, nothing in phase | – see drive |
| pA | J3 | – no removable plate on a moving pin | Internal circlip DIN 472, Ø13; Bearing F686ZZ (6x13x5); head | – no keyed part | F686ZZ located by flange and circlip, inner race clamped | – limited by the linkage | – driven | – no adjustable length | – shielded bearing, greased for life | – no phase to keep | – none needed |
| pB | J3 | – no removable plate on a moving pin | Internal circlip DIN 472, Ø13; Bearing F686ZZ (6x13x5); head | – the cap is clamped on the shoulder; no keyed part | F686ZZ located by flange and circlip, inner race clamped | – limited by the slide's stops | – driven | – no adjustable length | – shielded bearing, greased for life | – no phase to keep | – none needed |
| slide-block | J5 | – the rails are screwed to their posts | Keeper plate, holds the slider down | – prismatic, no torque | – the keeper takes the lift, the base the weight | 2 x End stop block, hardened | – driven | Gib strip 3 x 6 x 123, bronze | 2 x wiper; Grease nipple M6 (DIN 71412) | – no phase to keep | – stops never touched in running |
| raila-post | post | – screwed through | – screwed from both sides | – static | – static | – static | – static | – the gib on the other rail adjusts the fit | – static | – static | – static |
| railb-post | post | – screwed through | – screwed from both sides | – static | – static | – static | – static | – the gib on this rail adjusts the fit | – static | – static | – static |
| drive | drive | – bracket screwed up into the base | – pulley hub set screws (pO) | Pulley hub, 2 x M3 set screws at 90° | – motor bearings | – motor turns freely | – motor holds when powered | bracket | – belt runs dry | Home flag read by the fork sensor | Home flag, 1 mm steel vane; 3 x Fork sensor, slotted optical, 5 mm gap; Pulley flanges |

## Variants and overrides
| Joint or part | Rule result | Chosen | Why |
|---|---|---|---|
| crank | layer 0, z 0 to 6 | plated 2.5 mm up in the model (`dz`), z 2.5 to 8.5 | A9: 1.5 mm overhang under the rod at A; the rod cannot come down, the keeper runs under it |
| pB | wrist pin through crosshead and rod, single shear | crosshead clevis: the cap twinned with the crosshead in the model, 1.5 mm over the rod, on a post at x 14 screwed into the crosshead | A9: double shear |
| crank | straight stadium | counterweighted plate, in the model | M2: balance |
| rod | straight stadium | tapered in the model, bosses R8.5 and R8 | D1 |

## Detail ladder
| Rung | Solids | Marks | Frame ms at this dial position |
|---|---|---|---|
| DL-A | 10 | 0 | 44.4 |
| DL-B | 0 | 186 | 41.8 |
| DL-C | 0 | 0 | 15.2 |
| DL-D | 18 | 0 | 4.9 |
| DL-E | 11 | 0 | 4.4 |
| DL-F | 0 | 0 | 4.1 |
| DL-G | 0 | 0 | 3.8 |
| DL-H | 15 | 0 | 3.2 |
| never | 98 | 130 | 54.1 (full) |

## Promotion candidates
Hand fixes that should become rules or primitives.

- **Rail standoffs.** Rails 2 mm off the base on posts their own width work, but a rail would usually sit on the base on ground pads.

Promoted in standard 2.1: plating offsets read by the rules, the clevis twin, slide end stops that shorten to fit.

## Verification
check: clean · clearance: 0 clashes · clamp: clean · edge distance: clean · package: 22.3 KB
screenshots: plan, 28°, side, explode at 28° and 70°, both sheets (attached to #13) · bench: browser, DPR 1.5, 2026-10-18; 28° frame 62.6 ms at full detail, 8 ms reached at dial D (flag, R6)
