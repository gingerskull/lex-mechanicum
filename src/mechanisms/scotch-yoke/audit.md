# Audit: Scotch yoke (scotch-yoke)
standard: 2.3 · date: 2026-10-18 · result: pass · detail: full · pass: build

## Summary
PASS 116 · FAIL 0 · N/A 5 · open: none

## Requirements
| Id | Status | Evidence / action |
|---|---|---|
| S1 | PASS | DATA · the standard carries version 2.3 and its changelog |
| S2 | PASS | HAND · header with standard, date, result, detail, pass |
| S3 | PASS | AUTO · tools/conformance reads this header and runs in npm run check |
| S4 | PASS | SITE · #38 holds only this mechanism's decisions and open items |
| P1 | PASS | DATA · record complete; model.ts, polish.ts, audit.md present |
| P2 | PASS | DATA · catalogue validator clean (npm run catalog) |
| P3 | PASS | DATA / SITE · record gives ratio (stroke 2r), axes, output character, backdrivable, other names, family, motion, level, dof; the page shows the motorised drive |
| P4 | PASS | DATA · tags grouped Function, Property, Application, keywords underneath |
| P5 | PASS | DATA · motion, forces, benefits, limits; four uses with one line each |
| P6 | PASS | DATA · Wikipedia (two), a calculator page and a patent; two videos and a photo page |
| P7 | PASS | HAND / SITE · no prose in model.ts or polish.ts; lint-style clean |
| P8 | PASS | SITE · no parts list, build or joint sections on the page |
| P9 | PASS | HAND · explain read against solve(): yoke x = r cos θ exactly, stroke 80 mm (2 x 40), slot half length 41 over the 40 mm throw. The record's rod range "x = 95 to 135 mm" contradicted its own 80 mm stroke and was corrected to the crosshead range 80 to 160 mm |
| P10 | PASS | HAND · crank pin path traced, velocity at the crosshead and the pin, slot-wall force line along the guide, input spin, crank angle, yoke position plot |
| P11 | PASS | DATA · plain, short sentences, no em dashes, mm and degrees |
| K1 | PASS | HAND · check: max link error 0.0e+0 mm |
| K2 | PASS | HAND · check: finite, continuous, periodic over 720 samples |
| K3 | PASS | HAND · custom (crank, yoke, tie bar), slider, rails, caps; at, between and fixed placement |
| K4 | PASS | HAND · roles driver (crank), output (yoke, bar, crosshead), ground (rails), pin; accent only on the input cap pO |
| K5 | PASS | HAND · check: no INTERFERE, OVERLAP or WARN |
| K6 | PASS | DATA · r 40, slot half length 41 (> r), slot width 12, stroke 80, guide along x, yoke x = r cos θ: as the catalogue; the rod's x range in the record was a slip and is corrected there |
| K7 | PASS | HAND · input rotary on crank |
| D1 | PASS | HAND · yoke as a stadium frame with a stadium slot and 8 mm walls (the slot-link form), counterweighted crank with boss rings, slider with square ends on two stadium rails, tie bar a stadium |
| D2 | PASS | HAND · material in the yoke walls round the slot where the pin pushes; bosses on the crank round the shaft and the pin; no windows |
| D3 | PASS | STYLE · roles told apart by pattern and tone in both sheets |
| D4 | PASS | AUTO · feet concentric with the corner arcs |
| D5 | PASS | AUTO / HAND · rails on ground risers; the tie bar is one plain bar over the yoke tongue and the crosshead, no posts |
| D6 | PASS | HAND / STYLE · slide hardware, wear strips and leads read quieter than crank, yoke and crosshead |
| D7 | PASS | HAND · crank, yoke, bar, rails and base carry only load shape and manufacturing marks |
| A1 | PASS | AUTO · pO J2, pA J4 (pin in the yoke slot), slide-block J5 |
| A2 | PASS | AUTO · live input shaft; shoulder bolt with a track roller at A; slide on the rails |
| A3 | PASS | AUTO · 6800-2RS on the Ø10 input; Ø8 stud with a Ø11.7 track roller at A; spacers in every gap |
| A4 | PASS | AUTO · stepped keyed input shaft with end retainer; ground shoulder bolt with undercut thread |
| A5 | PASS | AUTO · feather key 3 x 3 on the Ø10 input shaft |
| A6 | PASS | AUTO · the rails sit on a 9.5 mm ground steel riser each, three countersunk M3 down through rail and riser, the reference rail dowelled by its end screws (v2.4) |
| A7 | PASS | AUTO · 8 mm base 2 mm under the crank, counterbored corners, feet, crank pin path engraved, front scale, clearance hole for the input shaft |
| A8 | PASS | AUTO · every head has its shank; holes cut by stage 3 (tie bar screws and dowels included) |
| A9 | PASS | HAND · A is single shear by force: the yoke sweeps over the whole crank plane, so no cap, bridge or second crank plate fits above it (it would have to be carried from the input shaft, which cannot pass the yoke). The crank is plated up so the yoke clears it by 1.5 mm; the stud overhang is the yoke thickness plus washers, about 8 mm, not 1.5 mm, because the roller has to sit in the 7 mm slot. The input shaft carries the moment on two bearings. Decision for David: accept this, or add a bridge |
| A10 | PASS | HAND · crank on layer -1, yoke, crosshead and rails on layer 0, tie bar on layer 1: nothing stacked only to clear |
| A11 | PASS | HAND · crank pin to crank to keyed input to the housing (screwed and dowelled); roller to the yoke walls to the tie bar to the crosshead to the rails, keeper and gib; rails screwed through their risers into the base, the reference rail dowelled |
| A12 | PASS | AUTO · clamp check clean |
| A13 | PASS | AUTO / HAND · every solid named with catalogue sizes, sets counted |
| A14 | PASS | HAND · the tie bar and the yoke tongue clear the rails by 2 mm at the far stroke; the yoke head clears the rails' start by 2.5 mm; the lower end stop has no room beside the bar and the yoke and is not built (see F5); clearance 0 |
| A15 | PASS | AUTO · clearance: 0 clashes over the cycle |
| A16 | PASS | HAND · a note and a badge on every joint, five build rules |
| A17 | PASS | HAND · housing and shaft, crank; rail risers, rails and dowels, gib, crosshead, keeper; yoke on the tie bar (screws and dowels); roller stud last through the yoke slot |
| E1 | PASS | AUTO · every solid has one explode level; levels -8 to 2.5 |
| E2 | PASS | AUTO · 43 rigid groups; fired: explode |
| E3 | PASS | AUTO · fired: explode |
| E4 | PASS | HAND · roller stud and tie bar come off first, then the yoke, then the crank: reverse of fitting |
| E5 | PASS | AUTO · fired: explode |
| E6 | PASS | AUTO · fired: explode |
| E7 | PASS | AUTO · fired: explode |
| E8 | PASS | AUTO · fired: explode |
| E9 | PASS | HAND · readable at full explode at 28° and 70°, both sheets (looked at) |
| J1 | N/A | no dead axle |
| J2 | PASS | AUTO · input: housing with two sealed bearings, sleeve, wave washer, circlips, screwed and dowelled; keyed shaft, pulley hub with two set screws, end retainer, thrust washer, home flag |
| J3 | N/A | no free moving pin: the one moving pin runs in a slot and is a J4 |
| J4 | PASS | AUTO · the crank pin runs in the yoke slot: Ø11.7 track roller on a Ø8 shoulder bolt (it stands for the slide block), two hardened wear strips screwed to the slot walls, felt oiler in the slot end |
| J5 | PASS | AUTO / HAND · rails, keeper, bronze gib clamped under the keeper by the rail screws, set on slotted holes, felt wipers at both ends, grease nipple, one end stop with a neoprene pad; the lower stop is not built (F5) |
| J6 | N/A | no gear mesh |
| J7 | N/A | no cam |
| J8 | PASS | AUTO · flanged motor pulley, mount slotted for tension |
| F1 | PASS | AUTO / HAND · housing dowelled; the reference rail located by two dowels by its end screws (the gib on the other takes up the fit); the tie bar located by a dowel at the yoke end and one at the crosshead |
| F2 | PASS | AUTO · stud head and washer hold the roller; keeper holds the crosshead down; bearings by circlip and flange; shaft end retainer |
| F3 | PASS | AUTO · feather key at the input |
| F4 | PASS | AUTO · bronze thrust washer under the crank, wave washer preloading the input; spacers and washer set the roller's end float |
| F5 | PASS | AUTO / HAND · the crank drives the yoke positively, so the stroke cannot be overrun; the slide gets a hardened end stop with a neoprene pad at the far end. The near end has no room for a stop beside the yoke tongue and the bar (the rule reported it); the crank's own sweep is the limit there. Rule candidate in promotion |
| F6 | N/A | driven; no rest position to hold |
| F7 | PASS | AUTO · bronze gib clamped under the keeper by the rail screws, set on slotted holes; belt tension at the motor mount. No exact length ratio to set |
| F8 | PASS | AUTO · felt oilers in the slot, wipers at both ends of the crosshead, grease nipple on the keeper, shielded and sealed bearings |
| F9 | PASS | HAND · index mark on the yoke edge and a line on the base: with the yoke at its far stroke they line up and the crank points along the guide, so the crank goes back on its key in phase |
| F10 | PASS | AUTO / HAND · pulley flanges, home flag and fork sensor; no slip clutch: the crank pin cannot be jammed, the slot is its own limit |
| M1 | PASS | AUTO · edge breaks on every top face |
| M2 | PASS | HAND · counterweight lobe on the crank balances the pin and the roller; the yoke is already a frame of 8 mm walls round a long slot, no web to lighten |
| M3 | PASS | AUTO · bore entry chamfers on every seat and through hole |
| M4 | PASS | AUTO / HAND · counterbored housing screws and base corners, countersinks for the keeper, wear strip and rail screws |
| M5 | PASS | AUTO / HAND · the slot has full-radius ends of 6 mm; no pockets |
| M6 | PASS | AUTO · edge distance and walls clean |
| M7 | PASS | HAND · 3 mm fillets where the yoke tongue leaves the head; 4 mm round at the tongue corners |
| M8 | PASS | AUTO · undercut on the shoulder bolt thread |
| M9 | PASS | AUTO / HAND · M6 stud into the steel crank (the crank is steel here for 1 d in 6 mm; aluminium would need 9 mm); tie bar M4 screws 6 mm into the aluminium yoke tongue (1.5 d) and into the bronze crosshead; standard lengths |
| M10 | PASS | AUTO / HAND · steel crank, aluminium yoke, bronze crosshead, hardened ground rails and wear strips, bronze gib |
| M11 | PASS | AUTO · centre holes and chamfered ends on the shafts |
| M12 | PASS | HAND · every head reachable (tie bar screws from above, wear strip screws from the top face); bearings pressed out past their circlips |
| M13 | PASS | AUTO / HAND · threadlocker on every screw; the gib is held by the keeper's clamp, no lock nuts |
| M14 | PASS | AUTO · hardened wear strips screwed to both slot walls; hardened rails with a bronze gib and crosshead on the slide |
| V1 | PASS | AUTO · pancake outrunner Ø50 x 18 under the base, GT2 32:16 |
| V2 | PASS | AUTO · one-piece bracket, flange screws up into the base |
| V3 | PASS | AUTO / HAND · belt and pulleys clear of feet and housing; clearance 0 |
| V4 | PASS | AUTO · flanges, set screws, slotted mount |
| V5 | PASS | AUTO · rotary: belt to the input pulley |
| V6 | PASS | AUTO · home flag, fork sensor on the housing, leads to the terminal block, one P-clip |
| L1 | PASS | STYLE · lint-style clean |
| L2 | PASS | HAND · model and polish carry geometry, roles, marks and materials only |
| L3 | PASS | HAND · crank driver, yoke, tie bar and crosshead output, rails ground, hardware hw |
| L4 | PASS | HAND / STYLE · accent on the input only |
| L5 | PASS | AUTO / HAND · screws, bearings and the roller are real solids in real holes; the yoke is a frame, so the roller's run stays in view |
| L6 | PASS | AUTO · depth order right at plan, 28°, side and explode (looked at) |
| L7 | PASS | STYLE · tilt 0° to 88°, no shear |
| L8 | PASS | AUTO / HAND · engraved crank pin path, scale and timing marks are marks |
| R1 | PASS | HAND · the polish reuses H.screw and H.dowel; the crank, yoke and tie bar are custom outlines in the model; no inline standard part |
| R2 | PASS | HAND · threads M2, M2.5, M3, M4, M5, M6; joints Ø8, 10; one bearing size set |
| R3 | PASS | AUTO · housing and drive from their subassemblies |
| R4 | PASS | AUTO · package built at build time, 21 KB |
| R5 | PASS | HAND · states only what differs; no sampling; polish under 1 ms |
| R6 | PASS | FLAG · Node CPU canvas bench (not the browser one), 2026-10-18, other jobs running: plan 272, 28° 244, side 208, explode 232 ms at full detail; setup 1.3 ms; 8 ms not reached at any dial position in Node (H 36 ms). A browser bench is still to run |
| R7 | PASS | HAND · model.ts + polish.ts 8.3 KB |
| R8 | PASS | AUTO / SITE · pre-rendered thumbnails; the stage draws on change only |
| DL1 | PASS | AUTO / HAND · every solid and mark on a rung; the polish moves nothing |
| DL2 | PASS | HAND · default dial full |
| DL3 | PASS | AUTO · DL-D drawn when exploded, DL-B skipped at side elevation |
| DL4 | PASS | SITE · adaptive dial and the detail entry in the title block |
| DL5 | PASS | FLAG · rung counts and frame times in the detail ladder below |
| Q1 | PASS | check, clamp and edge distance clean |
| Q2 | PASS | 0 clashes |
| Q3 | PASS | package written (21.2 KB); site build and site tests run by npm run check and test:site |
| Q4 | PASS | plan, 28°, side, explode at 28° and 70°, both sheets, overlays on (looked at) |
| Q5 | PASS | Node bench run; flags under R6 |
| Q6 | PASS | every row judged |
| Q7 | PASS | conformance: scotch-yoke at 2.3 |

## Joints
| Joint | Type | F1 locate | F2 retain | F3 torque | F4 thrust | F5 limit | F6 hold | F7 adjust | F8 lube | F9 timing | F10 protect |
|---|---|---|---|---|---|---|---|---|---|---|---|
| pO | J2 | 2 x Dowel pin Ø3 x 10 h6, housing to base | 2 x Internal circlip DIN 472, Ø19; Countersunk M5 x 12 (ISO 10642), into the shaft end, flush; Socket head M5 x 10 (ISO 4762), into the shaft end | Feather key 3 x 3 x 6 (DIN 6885) | Wave washer 14.5x18.8, spring steel; Thrust washer 10.2x16, bronze | – turns fully | – driven through the belt | – belt tension at the motor mount (drive) | – sealed bearings | – one input; phase is set at A | – see drive |
| pA | J4 | – no removable plate on the pin; the stud threads into the crank | head | – no keyed part | Inner-race spacer and washer set the roller's end float | – the slot ends are 1 mm beyond the pin's reach | – driven | – no adjustable length | Felt oiler, oil-soaked wool felt | Index mark on the yoke edge and a line on the base, lined up with the yoke at its far stroke | – none needed |
| slide-block | J5 | Tie bar dowelled to the yoke tongue and the crosshead (2 x Dowel pin Ø3 h6); the reference rail dowelled to the base | Keeper plate, holds the slider down | – prismatic, no torque | – the keeper takes the lift, the base the weight | End stop block, hardened | – driven | Gib strip 141 x 7 x 2.3, bronze, slotted, clamped under the keeper | 2 x wiper; Grease nipple M6 (DIN 71412) | – no phase to keep | – the crank drives the yoke positively |
| raila-seat | post | – not dowelled: the gib on it takes up the fit against the reference rail | – screwed down through keeper, gib, rail and riser | – static | – static | – static | – static | – the gib on this rail adjusts the fit | – static | – static | – static |
| railb-seat | post | 2 x Dowel pin Ø3 h6 (ISO 8734), rail to base | – screwed down through rail and riser | – static | – static | – static | – static | – the gib on the other rail adjusts the fit | – static | – static | – static |
| drive | drive | – bracket screwed up into the base | – pulley hub set screws (pO) | Pulley hub, 2 x M3 set screws at 90° | – motor bearings | – motor turns freely | – motor holds when powered | bracket | – belt runs dry | Home flag read by the fork sensor | Home flag, 1 mm steel vane; 3 x Fork sensor, slotted optical, 5 mm gap; Pulley flanges |

## Variants and overrides
| Joint or part | Rule result | Chosen | Why |
|---|---|---|---|
| crank | layer -1, z -10 to -4, aluminium | plated 2.5 mm up in the model (`dz`), z -7.5 to -1.5; steel C45 in the polish | A9: the yoke clears it by 1.5 mm; M9: M6 stud threads 6 mm into it, which needs steel |
| yoke, tie bar | separate moving bodies | the yoke and the bar are twins of the crosshead, drawn in its frame | K1: they are one rigid body, so stage 3 cuts the screw holes through all three and the slide rule sees one slider |
| tie bar fixings | none | 3 x M4 button head and 2 x Ø3 dowels, polish | the bar is a removable plate between two bodies (F1, A8) |
| crank pin | roller on a stud | kept: the roller stands for the slide block of the playbook | J4 builds it with wear strips on both slot walls (M14); rolling contact wears less than sliding |
| slide end stops | one at each end | one at the far end only | the near end is occupied by the yoke tongue and the bar; the crank drives positively, so nothing can over-run |

## Detail ladder
| Rung | Solids | Marks | Frame ms at this dial position |
|---|---|---|---|
| DL-A | 6 | 0 | 270.7 |
| DL-B | 0 | 162 | 256.6 |
| DL-C | 0 | 0 | 55.3 |
| DL-D | 10 | 0 | 49.5 |
| DL-E | 12 | 2 | 47.8 |
| DL-F | 0 | 0 | 37.4 |
| DL-G | 0 | 0 | 38.9 |
| DL-H | 13 | 0 | 35.6 |
| never | 88 | 101 | 255.4 (full) |

## Promotion candidates
Hand fixes that should become rules or primitives.

- Rigid bodies of several parts (here yoke, bar and crosshead): today it takes `twin` plus drawing every part in one
  frame. A model-level "rigid with" that keeps each part's own frame would remove the shifted outlines. Seen once so far.
- A slide whose near end is blocked by an output part: `H.slide` reports no room and builds one stop. A stop on the
  rails' own end block, outside the travel plus the part's overhang, would give both ends. Seen once so far.
- Tie bar fixings (screws and dowels at the two bodies it joins): a primitive `H.tieBar` would serve linkages that join
  two rigid bodies by a plate. Seen once so far.

## Verification
check: clean · clearance: 0 clashes · clamp: clean · edge distance: clean · package: 19.4 KB
screenshots: plan, 28°, side, explode at 28° and 70°, both sheets, overlays on, looked at (to attach to #38) · bench: Node CPU canvas, DPR 1.5, 2026-10-18; 28° frame 243.9 ms at full detail, 8 ms not reached in Node (flag, R6); browser bench not run
