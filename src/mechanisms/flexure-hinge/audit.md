# Audit: Flexure hinge (flexure-hinge)
standard: 2.13 · date: 2026-10-20 · result: pass · detail: full · pass: build

## Summary
PASS 99 · FAIL 0 · N/A 29 · open: none

## Requirements
| Id | Status | Evidence / action |
|---|---|---|
| S1 | PASS | DATA · the standard carries version 2.13 and its changelog |
| S2 | PASS | HAND · header with standard, date, result, detail, pass |
| S3 | PASS | AUTO · tools/conformance reads this header and runs in npm run check |
| S4 | PASS | SITE · #148 holds only this mechanism's decisions and open items |
| P1 | PASS | DATA · record complete; model.ts, polish.ts, audit.md present |
| P2 | PASS | DATA · catalogue validator clean |
| P3 | PASS | DATA / SITE · ratio (unity, 1:1, K about 13 N·m/rad), axes coaxial, reciprocating and harmonic output, backdrivable, other names, family, motion, level, dof and the motorised drive |
| P4 | PASS | DATA · tags grouped Function, Property, Application, keywords underneath |
| P5 | PASS | DATA · motion, forces, benefits, limits; three uses with one line each |
| P6 | PASS | DATA · two Wikipedia pages, a paper and an engineering guide; three videos and a photo page; the real-world video checked (oEmbed: it exists, Physik Instrumente's NanoCube flexure stage on the maker's own channel) |
| P7 | PASS | HAND / SITE · no prose in model.ts or polish.ts; lint-style clean |
| P8 | PASS | SITE · no parts list, build or joint sections on the page |
| P9 | PASS | HAND · the lever rocks ±2° about the neck centre (solve), the tip moves ±2.09 mm, the restoring torque is K times the angle with K = 12,984 N·mm/rad as the catalogue; 'a few degrees in metal' holds |
| P10 | PASS | HAND · tip path traced with its velocity, the tip force square to the lever, the neck's bend overlay and the lever angle, restoring torque plot (linear) |
| P11 | PASS | DATA · plain, short sentences, no em dashes, mm and degrees |
| K1 | PASS | HAND · check: max link error 0.0e+0 mm; the neck centre, lever length and angle are solved; the polish changes notes and build rules only |
| K2 | PASS | HAND · check: finite, continuous, periodic over 720 samples |
| K3 | PASS | HAND · custom outlines (block, neck, lever); no pins in the model, the joint is the declared compliant neck |
| K4 | PASS | HAND · roles: driver (lever), link (neck), ground (block); the accent on the drive pin in the lever's tip, where the input acts (a flexure has no input shaft) |
| K5 | PASS | HAND · check clean; the one blank on layer 0, 10 mm thick (the hinge width b) rather than 6, because K depends on b |
| K6 | PASS | DATA · R 5, t 0.8, b 10, E 71,700, lever 60 and ±2° as the catalogue, K = 12,984 N·mm/rad; the angle drawn true, not exaggerated (the catalogue allows it, K1 keeps it exact); the catalogue's fixed block is a 40 x 40 block clamped to the base |
| K7 | PASS | HAND · input oscillating on the lever |
| D1 | PASS | HAND · the blank: a block, a circular notch milled from both sides as two full-radius slots tangent to the block's and the lever's faces, a lever tapering to a boss round the drive pin |
| D2 | PASS | HAND · the lever widest at its root (18 mm) where the bending moment is largest, tapering to the tip boss; the neck thin only where it must bend |
| D3 | PASS | STYLE · roles told apart by pattern and tone in both sheets |
| D4 | PASS | AUTO · base corners from the form style; feet concentric with the corner arcs, none at the corner where the motor bracket hangs |
| D5 | PASS | AUTO / HAND · the block on one ground seat plate under one clamp plate; the motor in its one-piece bracket |
| D6 | PASS | HAND / STYLE · clamp, seat, stops and drive read quieter than the blank |
| D8 | N/A | AUTO / HAND · every part lies on z: the hinge works in one plane |
| D9 | PASS | AUTO / HAND · the neck drawn rigid, its bend and stress zone by the bend overlay; nothing stretches or deforms |
| D7 | PASS | HAND · blank, seat, clamp plate and base carry only load shape and manufacturing marks |
| A1 | PASS | AUTO · flexure-neck J13 (declared in compliant); no pin joints |
| A2 | PASS | AUTO · the neck as a compliant joint; no other joint in the model |
| A3 | N/A | AUTO · no bearing joint in the model; the drive link runs on two bronze bushings 4x7 |
| A4 | N/A | AUTO · no shaft or axle; the drive pins are plain hardened pins |
| A5 | N/A | AUTO · no keyed part but the drive crank, a D-bore on the motor's D-flat shaft |
| A6 | PASS | AUTO · J13 stands the block on a 2 mm ground seat plate of its own outline; the standoffs rule posts neither the block nor the neck, so nothing goes through the neck |
| A7 | PASS | AUTO · 8 mm base, counterbored corners, feet, the tip path engraved, front scale; the arc slot for the drive pin cut by the drive rule |
| A8 | PASS | AUTO · every head has its shank; holes cut by stage 3 |
| A9 | N/A | HAND · no pin joint: the neck carries the lever in one piece; the drive pins are pressed in and held by circlips |
| A10 | PASS | HAND · the blank in one plane; the drive under the base |
| A11 | PASS | HAND · lever to neck to block (one piece), block to seat and base by the clamp screws, dowels against shift; the drive's push from link to pin to lever, its reaction through crank, motor and bracket to the base |
| A12 | PASS | AUTO · clamp check clean |
| A13 | PASS | AUTO / HAND · 55 solids, 23 unnamed (further items of a listed set); catalogue sizes named: clamp screws M4 x 25, dowels Ø3, stop pins Ø5, pins Ø4, bushings 4x7, motor Ø50 x 18 |
| A14 | PASS | HAND · the stop pins clear the lever by 0.32 mm at the ends of the swing; the drive pin clears its arc slot by 1 mm; the link passes under the bracket's top flange with 1.5 mm; the terminal block clear of the bracket; clearance 0 |
| A15 | PASS | AUTO · clearance: 0 clashes over the cycle |
| A16 | PASS | HAND · a note and a badge on both joints; five build rules |
| A17 | PASS | HAND · base, seat, blank, dowels, clamp plate and screws; stop pins pressed into the base; drive pin pressed into the lever; from below: bracket, motor, crank with its pin, link over both pins, circlips; leads last |
| E1 | PASS | AUTO · one level per solid; levels -8 to 2 |
| E2 | PASS | AUTO · screws, the motor and the bracket are groups |
| E3 | PASS | AUTO · clamp screws upward, bracket and terminal screws downward |
| E4 | PASS | HAND · the clamp screws and plate come off first, then the blank with its pressed drive pin; the drive drops below the base |
| E5 | PASS | AUTO · dowels, stop pins and the drive pin stay in their parts; the bushings stay in the link |
| E6 | PASS | AUTO · motor whole with its shaft; bracket one group |
| E7 | N/A | AUTO · no loose spacer or washer |
| E8 | N/A | AUTO · no keyed shaft stack |
| E9 | PASS | HAND · readable at full explode at 0°, 28° and 88°; nothing leaves the frame |
| J1 | N/A | no dead axle |
| J2 | N/A | no live shaft |
| J3 | N/A | no moving pin in the model; the drive link's pins are the drive's |
| J4 | N/A | no slot |
| J5 | N/A | no slide |
| J6 | N/A | no gear mesh |
| J7 | N/A | no cam |
| J8 | N/A | no belt: the motor turns the crank directly |
| J9 | N/A | no crossed-axis mesh |
| J10 | N/A | no shaft in plan |
| J12 | N/A | no flexible member |
| J13 | PASS | AUTO · the neck drawn rigid with its bend overlay, one piece with block and lever; a stop pin each side on the lever's edge 0.4° past the swing; the block on a ground seat plate, clamped under a plate, two screws and two dowels reamed through block, plate and seat |
| J11 | N/A | no screw |
| F1 | PASS | AUTO · two dowels locate the blank and its clamp plate on the base |
| F2 | PASS | AUTO / HAND · the clamp plate holds the blank down; circlips under the link on the drive pin and over it on the crank pin |
| F3 | N/A | AUTO · no torque passes a joint: the neck is one piece; the crank sits on the motor's D-flat |
| F4 | N/A | AUTO / HAND · no thrust: the blank is clamped, the link sits between its circlips |
| F5 | PASS | AUTO / HAND · stop pins catch the lever 0.4° past each end of the ±2° swing, before the neck yields |
| F6 | N/A | AUTO / HAND · the neck itself is the spring that returns the lever; driven |
| F7 | N/A | AUTO / HAND · no adjustable fit: the swing is set by the crank's throw and the link's dead centres, as the oscillating drive rule sets it |
| F8 | PASS | AUTO · nothing to oil at the neck (no sliding); the link's bushings are oil-impregnated bronze |
| F9 | N/A | AUTO / HAND · no phase to keep between parts; the home flag gives the drive its zero |
| F10 | PASS | AUTO · home flag on the crank read by a fork sensor; the stops protect the neck |
| M1 | PASS | AUTO · edge breaks on every top face |
| M2 | N/A | HAND · nothing with inertia worth lightening: the lever's tip moves ±2 mm |
| M3 | PASS | AUTO · bore entry chamfers on every seat and through hole |
| M4 | PASS | AUTO / HAND · counterbored base corners, seats for the clamp screws |
| M5 | PASS | AUTO / HAND · the notch is two full-radius slots; no pockets |
| M6 | PASS | AUTO · edge distance and walls clean |
| M7 | PASS | HAND · the notch radius R 5 is the fillet where the block and the lever meet the neck |
| M8 | N/A | AUTO · no shouldered thread |
| M9 | PASS | AUTO / HAND · clamp screws M4 through plate, blank and seat into the base; standard lengths |
| M10 | PASS | AUTO · the blank one material, 7075-T6 (J13's); the seat ground C45, hardened pins, bronze bushings; materials on every solid |
| M11 | N/A | AUTO · no turned shaft but the motor's (bought) |
| M12 | PASS | HAND · clamp screws from above; bracket, terminal and clip screws from below; the circlips reachable from below |
| M13 | PASS | AUTO · 18 threaded, all with a locking method |
| M14 | N/A | AUTO / HAND · no sliding contact: the neck bends, the link turns on bushings |
| V1 | PASS | AUTO · pancake outrunner Ø50 x 18 under the base; the oscillating drive for a J13 lever |
| V2 | PASS | AUTO · one-piece bracket, top flange screwed up into the base, window toward the link |
| V3 | PASS | AUTO / HAND · crank and link clear of the bracket, the feet and the base; clearance 0 |
| V4 | N/A | AUTO · no belt: the crank is on the motor shaft, as the oscillating drive builds it |
| V5 | PASS | AUTO · oscillating through a pin pressed into the lever's tip: a 2.09 mm crank and a 30 mm link swing the lever through exactly ±2° (dead centres at the ends) |
| V6 | PASS | AUTO · home flag on the crank, fork sensor, leads to a terminal block on the base edge clear of the bracket, one P-clip |
| L1 | PASS | STYLE · lint-style clean |
| L2 | PASS | HAND · the model and polish carry geometry, roles, marks and materials only |
| L3 | PASS | HAND · lever driver, neck link, block ground, hardware hw |
| L4 | PASS | HAND / STYLE · accent on the drive pin only, with the traced path and the forces |
| L5 | PASS | AUTO / HAND · screws, dowels and pins are real solids in real holes |
| L6 | PASS | AUTO · depth order right at plan, 28°, side and explode |
| L7 | PASS | STYLE · tilt 0° to 88°, no shear |
| L8 | PASS | AUTO / HAND · engraved path and scale are marks |
| R1 | PASS | HAND · everything from the rules and H.*; the polish adds no solid |
| R2 | PASS | HAND · threads M3, M4; pins Ø4; bushings 4x7; dowels Ø3, stop pins Ø5 |
| R3 | PASS | AUTO · stops, seat and clamp from J13, the drive and sensor from H.drive |
| R4 | PASS | AUTO · package 9.7 KB |
| R5 | PASS | HAND · states only what differs: notes and build rules; no sampling |
| R6 | PASS | FLAG · browser bench, DPR 1.5: plan 1.43, 28° 1.8, side 1.3, explode 70° 1.6 ms; setup 5.6 ms; under every target |
| R7 | PASS | HAND · model.ts + polish.ts 6.9 KB |
| R8 | PASS | AUTO / SITE · pre-rendered thumbnails; the stage draws on change only |
| DL1 | PASS | AUTO / HAND · every solid and mark on a rung; the polish moves nothing |
| DL2 | PASS | HAND · default dial full |
| DL3 | PASS | AUTO · DL-D drawn when exploded, DL-B skipped at side elevation |
| DL4 | PASS | SITE · adaptive dial and the detail entry in the title block |
| DL5 | PASS | FLAG · rung counts and frame times in the detail ladder below |
| Q1 | PASS | check, clamp and edge distance clean |
| Q2 | PASS | 0 clashes |
| Q3 | PASS | package written, 9.7 KB; the site build runs on the family branch |
| Q4 | PASS | plan, 28°, side, explode at 0°, 28° and 88°, light sheet, and 28° dark, looked at (dist/shots-flexure-hinge, local) |
| Q5 | PASS | browser bench; no flag |
| Q6 | PASS | every row judged; no FAIL |
| Q7 | PASS | conformance: flexure-hinge at 2.13, pass |

## Joints
| Joint | Type | F1 locate | F2 retain | F3 torque | F4 thrust | F5 limit | F6 hold | F7 adjust | F8 lube | F9 timing | F10 protect |
|---|---|---|---|---|---|---|---|---|---|---|---|
| flexure-neck | J13 | 2 x Dowel pin Ø3, blank to base | Clamp plate 34 x 34 x 4 over the blank's block | – one piece: the neck carries the lever's torque by bending | – the blank is clamped on its seat | 2 x Stop pin Ø5, hardened, just past each end of the swing | – the neck is the spring; driven | – no fit to adjust: the notch is cut to size | – nothing slides | – no phase to keep | – the stops keep the neck in its elastic range |
| drive | drive | – bracket screwed up into the base | 2 x External circlip DIN 471, Ø4 | – crank on the motor's D-flat | – link between its circlips | – the crank turns freely; the stops limit the lever | – motor holds when powered | – swing set by the crank's throw and the dead centres | 2 x Bronze bushing 4x7, oil-impregnated | – home flag read by the fork sensor | Home flag, 1 mm steel vane; 3 x Fork sensor, slotted optical, 5 mm gap |

## Variants and overrides
| Joint or part | Rule result | Chosen | Why |
|---|---|---|---|
| blank thickness | 6 mm (K5) | 10 mm | the catalogue's hinge width b; K is proportional to it |

## Detail ladder
| Rung | Solids | Marks | Frame ms at this dial position |
|---|---|---|---|
| DL-A | 2 | 0 | 1.59 |
| DL-B | 0 | 54 | 1.57 |
| DL-C | 0 | 0 | 1.41 |
| DL-D | 0 | 0 | 1.34 |
| DL-E | 8 | 0 | 1.22 |
| DL-F | 0 | 0 | 1.31 |
| DL-G | 0 | 0 | 1.16 |
| DL-H | 8 | 0 | 1.09 |
| never | 37 | 35 | 1.73 (full) |

## Promotion candidates
- None. The seat, the reamed dowels, the stops on the lever's edge, the neck one piece with its lever, the drive through the lever's tip and the blank's material were promoted to rules in standard 2.13.

## Verification
check: clean · clearance: 0 clashes · clamp: clean · edge distance: clean · package: 9.7 KB
screenshots: plan, 28°, side, explode at 0°, 28° and 88°, light sheet; 28° dark (dist/shots-flexure-hinge, local) · bench: browser, RTX 5090, DPR 1.5, 2026-10-20; 28° frame 1.73 ms at full detail, no flag
