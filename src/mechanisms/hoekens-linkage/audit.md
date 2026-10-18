# Audit: Hoekens linkage (hoekens-linkage)
standard: 2.3 · date: 2026-10-18 · result: open · detail: full · pass: build

## Summary
PASS 114 · FAIL 1 · N/A 6 · open: FAIL F7

## Requirements
| Id | Status | Evidence / action |
|---|---|---|
| S1 | PASS | DATA · the standard carries version 2.3 and its changelog |
| S2 | PASS | HAND · header with standard, date, result, detail, pass |
| S3 | PASS | AUTO · tools/conformance reads this header and runs in npm run check |
| S4 | PASS | SITE · #26 holds only this mechanism's decisions and open items |
| P1 | PASS | DATA · record complete; model.ts, polish.ts, audit.md present |
| P2 | PASS | DATA · catalogue validator clean |
| P3 | PASS | DATA / SITE · page shows ratio, axes, output character, backdrivable, other names, family, motion, level, dof and the motorised drive |
| P4 | PASS | DATA · tags grouped Function, Property, Application, keywords underneath |
| P5 | PASS | DATA · motion, forces, benefits, limits; three uses with one line each |
| P6 | PASS | DATA · Wikipedia plus the UC Davis calculator and a FIRGELLI guide; two videos (both answer on YouTube oEmbed) and a GeoGebra applet; no real-world video found, so the section stays empty |
| P7 | PASS | HAND / SITE · no prose in model.ts or polish.ts; lint-style clean |
| P8 | PASS | SITE · no parts list, build or joint sections on the page |
| P9 | PASS | HAND · solve() puts the tip on y = 160 to 160.39 for crank 90° to 270° from x 160 to 0, x -14.1 to 174.1 overall, highest point y 196, rocker swing 78.5° to 143.1° (64.7°), as the catalogue says |
| P10 | PASS | HAND · tip T traced (the comet), velocity at T and B, coupler force line, transmission and crank angles, tip speed plot |
| P11 | PASS | DATA · plain, short sentences, no em dashes, mm and degrees |
| K1 | PASS | HAND · check: max link error 4.3e-14 mm; the polish changes heights and outlines only |
| K2 | PASS | HAND · check: finite, continuous, periodic over 720 samples |
| K3 | PASS | HAND · link, plate, cap, tracer; between and fixed placement |
| K4 | PASS | HAND · roles driver, output, pin, trace; accent only on the input cap pO2 |
| K5 | PASS | HAND · check clean, integer layers in the model; the coupler is plated 2.5 mm low and the front rocker plate 5 mm low with `dz` in model.ts (K1) |
| K6 | PASS | DATA · s 40, a 40, d 80, b 100, c 100, tip 200 from A along AB, ratios 1 : 2 : 2.5 : 2.5 : 5, crank shortest (Grashof 1 + 2.5 <= 2 + 2.5); plot is tip speed as a percentage of its mean over the whole turn (the catalogue note says "on the line"; the label says what is drawn) |
| K7 | PASS | HAND · input rotary on the crank |
| D1 | PASS | HAND · tapered stadium links sized to their bearings (crank bosses R13 and R9.5, rocker R12 and R9.5), one coupler plate through A, B and the tip with boss rings; flush caps; squircle base |
| D2 | PASS | HAND · bosses round every pin; the coupler is a long slender bar with no room for a window, so it stays plain |
| D3 | PASS | STYLE · roles told apart by pattern and tone in both sheets |
| D4 | PASS | AUTO · feet concentric with the corner arcs |
| D5 | PASS | AUTO / HAND · one bridge on two spigoted posts over O4, no scattered standoffs |
| D6 | PASS | HAND / STYLE · leads, sensor and stops read quieter than the linkage in every view |
| D7 | PASS | HAND · links, coupler, bridge and base carry only load shape and manufacturing marks |
| A1 | PASS | AUTO · pO2 J2, pO4 J1, pA J3, pB J3 |
| A2 | PASS | AUTO · live shaft at the accent input, dead axle at O4, shoulder bolts at A and B |
| A3 | PASS | AUTO · 6800-2RS on the Ø10 input, F688ZZ on the Ø8 pins, F6800 on the Ø10 axle; spacers in every gap |
| A4 | PASS | AUTO · stepped shoulder bolts with undercut threads; keyed input shaft with end retainer |
| A5 | PASS | AUTO · feather key 3 x 3 on the Ø10 input shaft |
| A6 | PASS | AUTO · no floating fixed plate besides the bridge, which sits on spigoted Ø10 standoffs |
| A7 | PASS | AUTO · 8 mm base 2 mm under the crank, counterbored corner holes, feet, tip path engraved, front scale, clearance hole for the input shaft |
| A8 | PASS | AUTO · every head has its shank; clearance and tapped holes cut by stage 3 |
| A9 | PASS | HAND · B a clevis and O4 held by base and bridge: double shear. A single shear (the coupler sweeps over the input boss), overhang 1.5 mm; the input shaft carries it on two bearings with centres 15 mm apart. The 100 mm of coupler past B carries no pin |
| A10 | PASS | HAND · crank and rear rocker share z 0 to 6, coupler 7.5 to 13.5, front rocker plate 15 to 21 |
| A11 | PASS | HAND · load paths in the joint notes: pins to bearings to links; axle to base and bridge; bridge screwed and located by spigots; housing screwed and dowelled |
| A12 | PASS | AUTO · clamp check clean |
| A13 | PASS | AUTO / HAND · every solid named with catalogue sizes (shoulder lengths, bearing designations); sets counted |
| A14 | PASS | HAND · posts, stops and leads clear every sweep; stops 2° beyond the swing; clearance 0 |
| A15 | PASS | AUTO · clearance: 0 clashes over the cycle |
| A16 | PASS | HAND · a note and a badge on every joint, five build rules |
| A17 | PASS | HAND · goes together from the base up: housing and shaft, crank, rear rocker on the axle, coupler on both pins, front plate, B bolt, bridge, axle; every screw reachable; bearings pressed out past their circlips |
| E1 | PASS | AUTO · one level per solid |
| E2 | PASS | AUTO · every screw, shoulder bolt with its shim, shaft and bought unit is one group |
| E3 | PASS | AUTO · bolts and axle leave upward, housing and drive screws downward |
| E4 | PASS | HAND · axle, B bolt, bridge, front plate, coupler, rear plate: the last part fitted goes furthest |
| E5 | PASS | AUTO · bearings and circlips stay in their plates |
| E6 | PASS | AUTO · motor with its bracket, bearings whole |
| E7 | PASS | AUTO · spacers midway |
| E8 | PASS | AUTO · crank, key and pulley keep their order on the input shaft |
| E9 | PASS | HAND · readable at full explode at 28° and 70°: nothing inside another part, nothing out of frame |
| J1 | PASS | AUTO · O4: shouldered axle, a bearing per rocker plate, sleeve and spacers, circlips, bronze thrust washer, bridge on spigoted posts, axle into the base, oil sink over the open bearing |
| J2 | PASS | AUTO · O2: housing with two sealed bearings, sleeve, wave washer and circlips, screwed and dowelled; keyed shaft, pulley hub, end retainer, thrust washer, home flag, base clearance hole |
| J3 | PASS | AUTO · A and B: shoulder bolts threaded into the lowest link, bearings in the coupler, inner-race spacers, threadlocked; clevis at B (variant) |
| J4 | N/A | no pin in a slot |
| J5 | N/A | no slide |
| J6 | N/A | no gear mesh |
| J7 | N/A | no cam |
| J8 | PASS | AUTO · flanged motor pulley, mount slotted for tension |
| F1 | PASS | AUTO · housing dowelled, bridge spigoted; the moving pins carry no removable plate |
| F2 | PASS | AUTO · every bearing held by a circlip and its flange, or two circlips; shaft end retainer; bolt heads |
| F3 | PASS | AUTO · feather key at the input; no other keyed part |
| F4 | PASS | AUTO / HAND · bronze thrust washers on the base under crank and rocker, wave washer preloading the input; no drag needed |
| F5 | PASS | AUTO / HAND · neoprene stops 2° beyond the rocker's swing; the input turns fully |
| F6 | N/A | driven through a toothed belt; no rest position or rattling clearance to hold |
| F7 | FAIL | AUTO / HAND · belt tension by the slotted mount, but Appendix A asks for one link adjustable at the exact ratio (this is an exact-ratio linkage) and none is: no turnbuckle or slotted-clamp link primitive exists and the swept stack leaves no room for a hand-built clamp on the rocker, crank or coupler. Needs a design decision (see Promotion candidates and #26) |
| F8 | PASS | AUTO · oil sink on the bridge over the open front O4 bearing; the others are sealed or shielded |
| F9 | PASS | HAND · swing scale engraved on the base, index line on the rocker: shows it went back together on the modelled branch |
| F10 | PASS | AUTO / HAND · pulley flanges, home flag and fork sensor; no slip clutch: the crank turns fully and nothing in the linkage can jam while it is connected |
| M1 | PASS | AUTO · edge breaks on every top face |
| M2 | PASS | HAND · bosses round every pin; no window (slender bars) |
| M3 | PASS | AUTO · bore entry chamfers on every seat and through hole |
| M4 | PASS | AUTO / HAND · counterbored base corners and housing screws, countersink for the crank end screw |
| M5 | PASS | AUTO / HAND · no pockets or windows; slots have full-radius ends |
| M6 | PASS | AUTO · edge distance and walls clean |
| M7 | PASS | HAND · the bridge is a hull of circles, no inside corner |
| M8 | PASS | AUTO · undercut on every shoulder bolt thread |
| M9 | PASS | AUTO / HAND · M6 into the steel links over their full 6 mm (1 d); axle into the base 1.5 d; lengths from the standard series |
| M10 | PASS | AUTO / HAND · materials named on every solid |
| M11 | PASS | AUTO · centre holes and chamfered ends on the shafts |
| M12 | PASS | HAND · every head reachable from above or below when assembled; bearings pressed out past their circlips |
| M13 | PASS | AUTO / HAND · threadlocker on every screw and bolt, set screws low strength |
| M14 | N/A | no sliding contact |
| V1 | PASS | AUTO · pancake outrunner Ø50 x 18 under the base, GT2 32:16 |
| V2 | PASS | AUTO · one-piece bracket, flange screws up into the base |
| V3 | PASS | AUTO / HAND · belt and pulleys clear of feet and housing; clearance 0 |
| V4 | PASS | AUTO · flanges, two set screws at 90°, slotted mount |
| V5 | PASS | AUTO · rotary: belt to the input pulley |
| V6 | PASS | AUTO · home flag, fork sensor on the housing, leads to the terminal block, one P-clip |
| L1 | PASS | STYLE · lint-style clean |
| L2 | PASS | HAND · the polish carries geometry, roles, marks and materials only |
| L3 | PASS | HAND · front plate output like the rear, coupler output, bridge ground, hardware hw |
| L4 | PASS | HAND / STYLE · accent on the input only |
| L5 | PASS | AUTO / HAND · screws, bearings and shanks are real solids in real holes |
| L6 | PASS | AUTO · depth order right at plan, 28°, side and explode |
| L7 | PASS | STYLE · tilt 0° to 88°, no shear |
| L8 | PASS | AUTO / HAND · swing scale and index line are marks; centrelines and dimensions automatic |
| R1 | PASS | HAND · the polish reuses the swing of H.stops and bearingName; plating, the clevis twin and the tapered links are the model's; no inline standard part |
| R2 | PASS | HAND · threads M3, M4, M5, M6, M8; joints Ø8, 10; bearings 6800-2RS, F688ZZ, F6800 |
| R3 | PASS | AUTO · housing, bridge, stops and drive from their subassemblies |
| R4 | PASS | AUTO · package built at build time, 23.1 KB |
| R5 | PASS | HAND · states only what differs; one swing sample; rules 0.18 s, polish under 1 ms |
| R6 | PASS | FLAG · Node canvas (CPU) at DPR 1.5: plan 231.5, 28° 265.9, side 288.0, explode at 70° 285.9 ms at full detail; 44.7 ms at dial C and 27.1 ms at dial H; a CPU canvas is far slower than a browser, so these are for comparing rungs, not against the 8 ms target; session setup 1.5 ms |
| R7 | PASS | HAND · model.ts + polish.ts 8.3 KB |
| R8 | PASS | AUTO / SITE · pre-rendered thumbnails; the stage draws on change only |
| DL1 | PASS | AUTO / HAND · every solid and mark on a rung; the polish moves nothing |
| DL2 | PASS | HAND · default dial full |
| DL3 | PASS | AUTO · DL-D drawn when exploded, DL-B skipped at side elevation |
| DL4 | PASS | SITE · adaptive dial and the detail entry in the title block |
| DL5 | PASS | FLAG · rung counts and frame times in the detail ladder below |
| Q1 | PASS | check, clamp and edge distance clean |
| Q2 | PASS | 0 clashes |
| Q3 | PASS | package written, 23.1 KB; site build not run in this pass |
| Q4 | PASS | plan, 28°, side, explode at 28° and 70°, both sheets, rendered with tools/shot |
| Q5 | PASS | bench run; flags under R6 |
| Q6 | PASS | every row judged; F7 listed as open |
| Q7 | PASS | conformance: hoekens-linkage at 2.3, open on F7 |

## Joints
| Joint | Type | F1 locate | F2 retain | F3 torque | F4 thrust | F5 limit | F6 hold | F7 adjust | F8 lube | F9 timing | F10 protect |
|---|---|---|---|---|---|---|---|---|---|---|---|
| pO2 | J2 | 2 x Dowel pin Ø3 x 10 h6, housing to base | 2 x Internal circlip DIN 472, Ø19; Countersunk M5 x 12 (ISO 10642), into the shaft end, flush; Socket head M5 x 10 (ISO 4762), into the shaft end | Feather key 3 x 3 x 6 (DIN 6885) | Wave washer 14.5x18.8, spring steel; Thrust washer 10.2x16, bronze | – the input turns fully | – driven through the belt, nothing to hold | – belt tension at the motor mount (drive) | – sealed bearings | – one input, no phase to keep | – see drive |
| pO4 | J1 | 2 x spigot | 2 x Internal circlip DIN 472, Ø19; Bearing F6800-2RS (10x19x5); Bearing F6800 (10x19x5) | – no keyed part; plates turn on bearings | Thrust washer 10.2x13.1, bronze | bumper | – belt-driven, no rest position | none (open, F7) | Bridge over the pivot, on two spigoted posts | Swing scale engraved on the base, index line on the rocker | – protected by the stops (F5) |
| pA | J3 | – no removable plate on a moving pin | Internal circlip DIN 472, Ø16; Bearing F688ZZ (8x16x5); head | – no keyed part | F688ZZ located by flange and circlip, inner race clamped | – limited by the linkage | – belt-driven, no rest position | none (open, F7) | – shielded bearing, greased for life | – no phase between crank and coupler | – none needed |
| pB | J3 | – no removable plate on a moving pin | Internal circlip DIN 472, Ø16; Bearing F688ZZ (8x16x5); head | – front plate clamped on the shoulder; no keyed part | F688ZZ located by flange and circlip, inner race clamped | – limited by the linkage | – belt-driven, no rest position | none (open, F7) | – shielded bearing, greased for life | – no phase between coupler and rocker | – none needed |
| pO4-bridge-post | post | 2 x spigot | – screwed from both sides | – static | – static | – static | – static | – spigot in a slot takes the hole tolerance | – static | – static | – static |
| drive | drive | – bracket screwed up into the base | – pulley hub set screws (pO2) | Pulley hub, 2 x M3 set screws at 90° | – motor bearings | – motor turns freely | – motor holds when powered | bracket | – belt runs dry | Home flag read by the fork sensor | Home flag, 1 mm steel vane; 3 x Fork sensor, slotted optical, 5 mm gap; Pulley flanges |

## Variants and overrides
| Joint or part | Rule result | Chosen | Why |
|---|---|---|---|
| coupler | layer 1, z 10 to 16 | plated 2.5 mm low in the model (`dz`), z 7.5 to 13.5 | A9: 1.5 mm overhang at the single-shear pin A |
| rocker | one plate | clevis: a front plate twinned with the rear one in the model (`twin`), z 15 to 21 | A9: B in double shear |
| crank, rocker | straight stadium | tapered in the model, bosses R13/R9.5 and R12/R9.5 | D1: sized to what each boss carries |
| pO4, rear bearing | open, oiled from the bridge | sealed (2RS) | the bridge's oil sink cannot reach it under the front plate |

## Detail ladder
| Rung | Solids | Marks | Frame ms at this dial position |
|---|---|---|---|
| DL-A | 14 | 0 | 189.4 |
| DL-B | 0 | 205 | 185.8 |
| DL-C | 0 | 0 | 44.7 |
| DL-D | 24 | 0 | 35.6 |
| DL-E | 8 | 2 | 33.4 |
| DL-F | 0 | 0 | 31.9 |
| DL-G | 0 | 0 | 30.9 |
| DL-H | 8 | 0 | 27.1 |
| never | 84 | 180 | 271.4 (full) |

## Promotion candidates
Hand fixes that should become rules or primitives.

- F7 for exact-ratio linkages: a turnbuckle or slotted-clamp link (or an eccentric pivot) as a part or primitive that fits inside the swept stack, so Hoekens, Chebyshev, Watt and similar linkages can show one adjustable link at its set point with the drawn length exact. Without it no hand fix is possible here.
- The swing scale and index line (F9) now appear in four-bar and this mechanism: a rule or `H.stops` option for a rocker's swing scale is due at three.

## Verification
check: clean · clearance: 0 clashes · clamp: clean · edge distance: clean · package: 23.1 KB
screenshots: plan, 28°, side, explode at 28° and 70°, both sheets (tools/shot) · bench: Node canvas, DPR 1.5, 2026-10-18; 28° frame 265.9 ms at full detail (CPU canvas, flag only, R6)
