# Audit: Locomotive driving gear (locomotive-drive)
standard: 2.3 · date: 2026-10-18 · result: pass · detail: full · pass: build

## Summary
PASS 113 · FAIL 0 · N/A 8 · open: none

## Requirements
| Id | Status | Evidence / action |
|---|---|---|
| S1 | PASS | the standard carries version 2.3 and its changelog |
| S2 | PASS | header with standard, date, result, detail, pass |
| S3 | PASS | tools/conformance reads this header and runs in npm run check |
| S4 | PASS | #29 holds only this mechanism's decisions and open items |
| P1 | PASS | DATA · record complete; model.ts, polish.ts, audit.md present |
| P2 | PASS | catalogue validator clean; record untouched |
| P3 | PASS | ratio unity 1:1, axes, output character, backdrivable, other names, family, motion, level, dof and the motorised drive (linear input, belt carriage) |
| P4 | PASS | tags grouped Function, Property, Application, keywords underneath |
| P5 | PASS | motion, forces, benefits, limits; three uses with one line each |
| P6 | PASS | Wikipedia pages and a photo page; three videos |
| P7 | PASS | no prose in model.ts or polish.ts; lint-style clean |
| P8 | PASS | no parts list, build or joint sections on the page |
| P9 | PASS | explain matches solve(): stroke 34 mm (x -97 to -63), main rod angle up to 12.3°, coupled wheels 1:1, rods stay level |
| P10 | PASS | crank pin path traced, velocity at the crosshead and the crank pin, main rod force line, wheel spin, rod angle, crosshead position plot |
| P11 | PASS | catalogue prose unchanged: plain, short sentences, no em dashes |
| K1 | PASS | link error 2.8e-14 mm; polish changes windows, hardware and heights only |
| K2 | PASS | HAND · check: finite, continuous, periodic over 720 samples |
| K3 | PASS | disc (wheels), link, slider, rails, caps; at, between, fixed placement |
| K4 | PASS | roles driver (crosshead), output (wheels), link, ground (rails), pin; accent on the crosshead pin pX only |
| K5 | PASS | no INTERFERE, OVERLAP or WARN; wheels layer 0 (14 mm thick, dz -8), coupling rod layer 1, main rod layer 2, crosshead and guide bars layer 1; dz in model.ts |
| K6 | PASS | R 34, axle spacing 80, crank pin 17, main rod 80, stroke 34: as the catalogue. Deviations, commented in model.ts: crosshead and guide bars sit 5 mm under their layer; the wheels are 14 mm thick so the axle end sits below the wheel face |
| K7 | PASS | input linear on the crosshead |
| D1 | PASS | wheels, tapered main rod, coupling rod, slider with square ends on two stadium guide bars |
| D2 | PASS | rim, hub and four windows between spokes; bosses round the pins; main rod tapered to a larger big end |
| D3 | PASS | roles told apart by pattern and tone in both sheets |
| D4 | PASS | feet concentric with the corner arcs |
| D5 | PASS | guide bars on ground pads; no bridges: the rods sweep over both axles (see A9) |
| D6 | PASS | drive and slide hardware read quieter than wheels and rods |
| D7 | PASS | wheels, rods, crosshead and base carry only load shape and manufacturing marks |
| A1 | PASS | pW J1, pC and pX J3, slide J5 |
| A2 | PASS | dead axles, shoulder bolts at C1, C2 and X, slide on the guide bars |
| A3 | PASS | 6000-2RS on the Ø10 axles, F688ZZ on the Ø8 crank pins, F686ZZ on the Ø6 wrist pin |
| A4 | PASS | stepped axles with shoulders, circlip groove and undercut threads |
| A5 | N/A | no keyed part: the wheels turn on dead axles |
| A6 | PASS | guide bars on 15 mm ground steel pads, countersunk M3 at each and two dowels |
| A7 | PASS | 8 mm base 2 mm under the wheels, counterbored corners, feet, engraved path, scale, slot for the belt carriage |
| A8 | PASS | every head has its shank; holes cut by stage 3 |
| A9 | PASS | see joint table: axles are single shear by necessity (both rods sweep over them); a bridge would stand above the rods with the axle through them. X is single shear with the main rod over the crosshead, shortest overhang. C1: pin held at the wheel and clamped by its head over the main rod |
| A10 | PASS | crosshead and guide bars under the main rod; coupling rod 1.5 mm over the wheels; main rod 1.5 mm over the coupling rod |
| A11 | PASS | axle to base with nyloc; crank pin through the wheel into the thick wheel; rails screwed and dowelled to the base. Axles held at the base only (stub axles) |
| A12 | PASS | AUTO · clamp check clean |
| A13 | PASS | every solid named with catalogue sizes |
| A14 | PASS | belt clamp, sensor and lead clear of every sweep; clearance 0 |
| A15 | PASS | AUTO · clearance: 0 clashes over the cycle |
| A16 | PASS | a note and a badge on every joint, five build rules |
| A17 | PASS | axle, bearing, wheel, circlips; rails on pads, crosshead, keeper; coupling rod, then main rod on the crank pin; wrist pin last |
| E1 | PASS | one level per solid |
| E2 | PASS | screws, bolts, shafts and bought units are groups |
| E3 | PASS | pins and keeper screws upward, drive screws downward |
| E4 | PASS | main rod above coupling rod above wheel; the last part fitted goes furthest |
| E5 | PASS | bearings and circlips stay in their parts |
| E6 | PASS | motor with bracket, bearings whole |
| E7 | PASS | spacers midway |
| E8 | N/A | no keyed parts on a shaft |
| E9 | PASS | readable at full explode at 28° and 70°; axles lift out of the wheels at level 1.5, below the rods' level |
| J1 | PASS | wheels on stub axles: shoulder, sealed bearing between circlips, external circlip, bronze thrust washer, nyloc below the base. No bridge or oil sink (variant, see overrides) |
| J2 | N/A | no live shaft: the input is the crosshead |
| J3 | PASS | C1, C2 and X: shoulder bolts, bearings in the rods, inner-race spacers, threadlocker |
| J4 | N/A | no pin in a slot |
| J5 | PASS | guide bars, keeper, bronze gib with three adjusting screws, felt wipers, grease nipple, end stops with pads |
| J6 | N/A | no gear mesh |
| J7 | N/A | no cam |
| J8 | PASS | flanged motor pulley, slotted tensioner arm on the idler, carriage clamped to the belt |
| F1 | PASS | axle shoulders; guide bars dowelled to the base; no removable bearing plate |
| F2 | PASS | circlips each side of the wheel bearings, external circlip on each axle, keeper holds the crosshead down |
| F3 | N/A | no keyed part |
| F4 | PASS | bronze thrust washer under each wheel on the base |
| F5 | PASS | end stops with neoprene pads just past both ends of the stroke |
| F6 | N/A | driven; no rest position to hold |
| F7 | PASS | gib with adjusting screws; belt tension on the slotted arm. The rod lengths are fixed (see promotion candidates) |
| F8 | PASS | felt wipers and grease nipple on the slide; sealed bearings |
| F9 | PASS | a timing mark on each wheel rim at the crank pin |
| F10 | PASS | pulley flanges, home flag and fork sensor; no slip clutch: the stops are never touched in running |
| M1 | PASS | edge breaks on every top face |
| M2 | PASS | wheels carry hub, rim and four windows (two next to the crank pin left solid) |
| M3 | PASS | bore entry chamfers on every seat and through hole |
| M4 | PASS | counterbored housing screws and base corners, countersinks for keeper and rail screws |
| M5 | PASS | wheel windows filleted R3 |
| M6 | PASS | AUTO · edge distance and walls clean |
| M7 | PASS | windows filleted; no sharp inside corner |
| M8 | PASS | undercuts on every threaded shoulder |
| M9 | PASS | pins into the steel wheel over full thickness; standard lengths |
| M10 | PASS | cast steel wheels, steel rods, bronze crosshead and gib, hardened rails |
| M11 | PASS | centre holes and chamfered ends on the axles |
| M12 | PASS | every head reachable; bearings pressed out past their circlips |
| M13 | PASS | threadlocker on every screw, lock nuts on the gib screws, nyloc on the axles |
| M14 | PASS | hardened rails and bronze gib are the replaceable wear parts |
| V1 | PASS | pancake outrunner Ø50 x 18 under the base, GT2 16T pulley, belt loop |
| V2 | PASS | one-piece bracket, flange screws up into the base |
| V3 | PASS | belt and pulleys clear of feet and axle nuts; clearance 0 |
| V4 | PASS | pulley flanges, slotted tensioner arm |
| V5 | PASS | linear: belt loop along the stroke, carriage clamped to the crosshead through a slot in the base (slot lengthened and carriage clamp added in the polish, see overrides), tensioner on the far pulley |
| V6 | PASS | home flag on the carriage and a fork sensor added in the polish (the linear drive has none: promotion candidate), leads to the terminal block, one P-clip |
| L1 | PASS | lint-style clean |
| L2 | PASS | the polish carries geometry, roles, marks and materials only |
| L3 | PASS | crosshead driver, wheels output, rods link, guide bars ground, hardware hw |
| L4 | PASS | accent on the input (crosshead pin) only |
| L5 | PASS | screws, bearings and axles are real solids in real holes |
| L6 | PASS | depth order right at plan, 28°, side and explode |
| L7 | PASS | tilt 0° to 88°, no shear |
| L8 | PASS | engraved crank pin path, scale and timing marks are marks |
| R1 | PASS | the polish reuses H.shaft, H.bearing, H.circlip, H.spokes, H.sensor, H.plate, H.screw, H.lead; no inline standard part |
| R2 | PASS | threads M2.5, M3, M4, M5, M6, M8; joints Ø6, 8, 10; three bearing sizes |
| R3 | PASS | drive and slide from their subassemblies |
| R4 | PASS | package built at build time, 24 KB |
| R5 | PASS | states only what differs; no sampling; polish about 3 ms |
| R6 | PASS | Node CPU bench: plan 327, 28° 367, side 222, explode 222 ms at full detail; browser frame times not measured in this session (Node numbers rank views, not devices) |
| R7 | PASS | HAND · model.ts + polish.ts 10.1 KB |
| R8 | PASS | pre-rendered thumbnails; the stage draws on change only |
| DL1 | PASS | every solid and mark on a rung; the polish moves nothing |
| DL2 | PASS | default dial full |
| DL3 | PASS | DL-D drawn when exploded, DL-B skipped at side elevation |
| DL4 | PASS | adaptive dial and the detail entry in the title block |
| DL5 | PASS | rung counts and frame times in the detail ladder below |
| Q1 | PASS | check, clamp and edge distance clean |
| Q2 | PASS | 0 clashes |
| Q3 | PASS | package written, 24.1 KB; site build and site tests run by CI |
| Q4 | PASS | plan, 28°, side, explode at 28° and 70°, both sheets looked at; attached to #29 |
| Q5 | PASS | Node CPU bench; flags under R6 |
| Q6 | PASS | every row judged |
| Q7 | PASS | conformance: locomotive-drive at 2.3, pass |

## Joints
| Joint | Type | F1 locate | F2 retain | F3 torque | F4 thrust | F5 limit | F6 hold | F7 adjust | F8 lube | F9 timing | F10 protect |
|---|---|---|---|---|---|---|---|---|---|---|---|
| pW1 | J1 | shaft | External circlip DIN 471, Ø10; 2 x Internal circlip DIN 472, Ø26 | none | Thrust washer 10.2x14, bronze | – held by the stub axle's thrust washer | – hub carries the load | – wheel turns freely | – sealed bearing, greased for life | Driving wheel | none |
| pW2 | J1 | shaft | External circlip DIN 471, Ø10; 2 x Internal circlip DIN 472, Ø26 | none | Thrust washer 10.2x14, bronze | – held by the stub axle's thrust washer | – hub carries the load | – wheel turns freely | – sealed bearing, greased for life | Coupled wheel | none |
| pC1 | J3 | none | 2 x Internal circlip DIN 472, Ø16; 2 x Bearing F688ZZ (8x16x5); head | none | none | none | none | none | none | none | none |
| pC2 | J3 | none | Internal circlip DIN 472, Ø16; Bearing F688ZZ (8x16x5); head | none | none | none | none | none | none | none | none |
| pX | J3 | none | Internal circlip DIN 472, Ø13; Bearing F686ZZ (6x13x5); head | none | none | none | none | none | none | none | none |
| slide-crosshead | J5 | none | Keeper plate, holds the slider down | none | none | 2 x End stop block, hardened | none | Gib strip 3 x 6 x 72, bronze | 2 x wiper; Grease nipple M6 (DIN 71412) | none | none |
| guidea-seat | post | 2 x Dowel pin Ø3 h6 (ISO 8734), rail to base | none | none | none | none | none | none | none | none | none |
| guideb-seat | post | 2 x Dowel pin Ø3 h6 (ISO 8734), rail to base | none | none | none | none | none | none | none | none | none |
| drive | drive | none | none | none | none | none | none | Tensioner arm, slotted, 2 x M4 | none | none | Home flag, 1 mm steel vane; Fork sensor, slotted optical, 5 mm gap |

## Variants and overrides
| Joint or part | Rule result | Chosen | Why |
|---|---|---|---|
| pW1, pW2 axle top | shoulder bolt, bridge on two posts above every sweep, the axle running up through the rods | stub axle ending below the wheel face on an external circlip; the bridge, its posts and the sleeve removed; sealed bearing | A9, A11: both rods sweep over each axle, so a bridge above them puts the axle through the rods; the thick wheel recesses the axle end |
| wheel1, wheel2 | plain disc | four windows, rim 5 mm, hub 19 mm, none within 12 mm of the crank pin; timing mark on the rim | M2, F9 |
| drive carriage | clamped to the belt by overlapping it | carriage 0.2 mm over the belt, clamp plate and two M3 screws under it; base slot cut 5 mm longer each end | A15: the rules' slot was shorter than the carriage's travel |
| base plate | outline from the mechanism's extent only | grown 14.5 mm to the left (x -150) to hold the tensioner arm (x -142 to -116, it stood 6.5 mm outside the plate) | review finding #61: the base must contain every part fixed to it |
| drive sensor | none for a linear input | fork sensor on the home flag, lead routed round the motor | V6 |

## Detail ladder
| Rung | Solids | Marks | Frame ms at this dial position |
|---|---|---|---|
| DL-A | 14 | 0 | 242.8 (Node CPU) |
| DL-B | 0 | 151 | 222.2 |
| DL-C | 0 | 0 | 70.5 |
| DL-D | 25 | 0 | 55.2 |
| DL-E | 11 | 2 | 57.5 |
| DL-F | 0 | 0 | 115.3 |
| DL-G | 0 | 0 | 101.2 |
| DL-H | 19 | 0 | 47.5 |
| never | 103 | 165 | 367.1 (full) |

## Promotion candidates
- J1 dead axle: when a moving part sweeps over the axle above the top part, the rule builds a bridge above every sweep and runs the axle up through the sweeping parts (clashes). It should finish the axle below the sweep on an external circlip with a sealed bearing, as done here by hand.
- `P.rails` could take `dz`: here it is set by mapping over the returned parts.

## Verification
check: clean · clearance: 0 clashes · clamp: clean · edge distance: clean · package: 24.0 KB
screenshots: plan, 28°, side, explode at 28° and 70°, both sheets, overlays on, looked at (attached to #29) · bench: Node CPU, DPR 1.5, 2026-10-18; 28° frame 367 ms at full detail, 47 ms at dial H (flag, R6; browser numbers not measured)
