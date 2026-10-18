# Audit: Jansen's linkage (jansen-linkage)
standard: 2.5 · date: 2026-10-18 · result: pass · detail: full · pass: build

## Summary
PASS 115 · FAIL 0 · N/A 6 · open: none

## Requirements
| Id | Status | Evidence / action |
|---|---|---|
| S1 | PASS | DATA · the standard carries version 2.5 and its changelog |
| S2 | PASS | HAND · header with standard, date, result, detail, pass |
| S3 | PASS | AUTO · tools/conformance reads this header and runs in npm run check |
| S4 | PASS | SITE · #28 holds only this mechanism's decisions and open items |
| P1 | PASS | DATA · record complete; model.ts, polish.ts, audit.md present |
| P2 | PASS | DATA · catalogue validator clean |
| P3 | PASS | DATA / SITE · ratio (stroke), axes, output character (continuous, non-uniform), backdrivable (partly), other names, family, motion, level, dof; drive motorised |
| P4 | PASS | DATA · tags grouped Function, Property, Application, keywords underneath |
| P5 | PASS | DATA · motion, forces, benefits, limits; three uses with one line each |
| P6 | PASS | DATA · Wikipedia, FIRGELLI engineering guide and a Cleveland State paper; two videos and a photos page; real-world: the three YouTube videos (Adam Savage meets Theo Jansen, Strandbeest Walking 4K, Strandbeesten de nieuwe generatie) resolve and show Jansen legs walking, none removed |
| P7 | PASS | HAND / SITE · no prose in model.ts or polish.ts; lint-style clean |
| P8 | PASS | SITE · no parts list, build or joint sections on the page |
| P9 | PASS | HAND · solve() gives foot x -143.0 to -7.2 and y -183.7 to -138.8 (136 x 45 mm), flat stance within 3 mm of the lowest point for 48% of the turn over 124 mm, as the catalogue says |
| P10 | PASS | HAND · foot point F traced (comet), velocity at F and E, axial force line on bar f, crank angle, plot of foot height above its lowest point |
| P11 | PASS | DATA · plain, short sentences, no em dashes, mm and degrees |
| K1 | PASS | HAND · check: max link error 5.7e-14 mm; the polish changes outlines (windows, the bow of bar k is the model's) and heights only |
| K2 | PASS | HAND · check: finite, continuous, periodic over 720 samples |
| K3 | PASS | HAND · link, plate, custom (bowed bar k), cap, tracer; between and fixed placement |
| K4 | PASS | HAND · roles driver, output (foot triangle), link, pin, trace; accent only on the input cap pO |
| K5 | PASS | HAND · check clean, integer layers: crank, upper triangle and foot triangle on layer 0; bars j, c, f on 1; bar k on 2; ground pivots at -1. Every part that crosses another is on a different layer |
| K6 | PASS | DATA · holy numbers at scale 2: m 30, j 100, k 123.8, b 83, c 78.6, d 80.2, e 111.6, f 78.8, g 73.4, h 131.4, i 98, Y at (-76, -15.6); mobility 1; solve() as the catalogue notes |
| K7 | PASS | HAND · input rotary on the crank |
| D1 | PASS | HAND · tapered stadium links with boss rings (crank R13 and R9.5, bars R9.5), plates with R10 bosses, flush caps; bar k is an arc-shaped stadium (K1 exact centres) so it clears the Y axle |
| D2 | PASS | HAND · bosses round every pin; one lightening window in each triangle, the two big swinging plates; bar k bowed only to clear the axle at Y |
| D3 | PASS | STYLE · roles told apart by pattern and tone in both sheets |
| D4 | PASS | AUTO · feet concentric with the corner arcs |
| D5 | PASS | AUTO / HAND · one bridge on two spigoted posts over Y, no scattered standoffs |
| D6 | PASS | HAND / STYLE · leads, sensor, stops and the turnbuckle read quieter than the linkage in every view |
| D7 | PASS | HAND · bars, triangles, bridge and base carry only load shape and manufacturing marks; richness is in the pins, the adjuster and the marks |
| A1 | PASS | AUTO · pO J2, pY J1, pA to pE J3 |
| A2 | PASS | AUTO · live shaft at the accent input, dead axle at Y, shoulder bolts at A to E |
| A3 | PASS | AUTO · 6800-2RS on the Ø10 input, F688 bearings on the Ø8 pins and the Y axle; spacers in every gap |
| A4 | PASS | AUTO · stepped shoulder bolts with undercut threads; keyed input shaft with end retainer; Y axle shouldered |
| A5 | PASS | AUTO · feather key 3 x 3 on the Ø10 input shaft |
| A6 | PASS | AUTO · no floating fixed plate besides the bridge, which sits on spigoted Ø10 standoffs |
| A7 | PASS | AUTO · 8 mm base under the lowest part, counterbored corner holes, feet, foot path engraved, front scale, clearance hole for the input shaft |
| A8 | PASS | AUTO · every head has its shank; clearance and tapped holes cut by stage 3 |
| A9 | PASS | HAND · double shear at A (bar j between the crank and bar k), at C (bar c between the foot and bar k) and at Y (axle held at both ends); B, D and E are single shear, forced: only two parts meet there and every free plane above is crossed by another bar, so no clevis plate fits. Bearings sit on inner-race spacers and the heads clamp the stack |
| A10 | PASS | HAND · crank and both triangles share z 0 to 6, bars j, c and f z 10 to 16, bar k z 20 to 26; nothing stacked only to clear something |
| A11 | PASS | HAND · load paths in the joint notes: pins to bearings to bars; Y axle to base and bridge, bridge screwed and located by spigots; input shaft to housing to base, housing screwed and dowelled |
| A12 | PASS | AUTO · clamp check clean |
| A13 | PASS | AUTO / HAND · every solid named with catalogue sizes; sets counted; the turnbuckle named with its M3 thread and stud length |
| A14 | PASS | HAND · posts, stops and leads clear every sweep; bar k's edge stays 8.8 mm from the Y axle centre (axle spacers Ø10.8); clearance 0 |
| A15 | PASS | AUTO · clearance: 0 clashes over the cycle |
| A16 | PASS | HAND · a note and a badge on every pin and on the adjuster, five build rules |
| A17 | PASS | HAND · goes together from the base up: housing and shaft, crank, upper triangle and foot on their planes, bars j, c, f, bar k (its two halves first joined and set on the turnbuckle at 123.8 mm), the Y axle with its bridge, the pins last; every screw reachable; bearings pressed out past their circlips |
| E1 | PASS | AUTO · every solid has one explode level |
| E2 | PASS | AUTO · every screw, bolt with its shim, shaft and bought unit is one group |
| E3 | PASS | AUTO · bolts and the Y axle leave upward, housing and drive screws downward |
| E4 | PASS | HAND · the last part fitted goes furthest: pins above bar k, bridge above the bars, base-side parts below |
| E5 | PASS | AUTO · bearings and circlips stay in their bars and plates; the turnbuckle stays in bar k's plane with both halves (it is assembled along the bar, not up a pin axis) |
| E6 | PASS | AUTO · motor with its bracket, bearings whole |
| E7 | PASS | AUTO · spacers midway |
| E8 | PASS | AUTO · crank, key and pulley keep their order on the input shaft |
| E9 | PASS | HAND · readable at full explode at 28° and 70° in both sheets: nothing inside another part, nothing out of frame |
| J1 | PASS | AUTO · Y: shouldered axle, a bearing in the upper triangle and in bar c, spacers, circlips, bronze thrust washer, bridge on spigoted posts, axle through the base to a washer and nyloc, oil sink over the open bearing |
| J2 | PASS | AUTO · O: housing with two sealed bearings, sleeve, wave washer and circlips, screwed and dowelled; keyed shaft, pulley hub with two set screws, end retainer, thrust washer, home flag, base clearance hole |
| J3 | PASS | AUTO · A to E: shoulder bolts threaded into the lowest bar, bearings in the other parts, inner-race spacers, threadlocked |
| J4 | N/A | no pin in a slot |
| J5 | N/A | no slide |
| J6 | N/A | no gear mesh |
| J7 | N/A | no cam |
| J8 | PASS | AUTO · flanged motor pulley, mount slotted for tension; 47 mm centres give enough wrap, no idler |
| F1 | PASS | AUTO · housing dowelled, bridge spigoted; the moving pins carry no removable plate |
| F2 | PASS | AUTO · every bearing held by a circlip and its flange, or two circlips; shaft end retainer; bolt heads |
| F3 | PASS | AUTO · feather key at the input; no other keyed part |
| F4 | PASS | AUTO / HAND · bronze thrust washers under the first part on each ground pivot, wave washer preloading the input; no drag needed |
| F5 | PASS | AUTO / HAND · two neoprene stops beyond the 86° swing of bar c; the upper triangle's 57° swing has no room for stops (the rule finds none outside its sweep and every other plane), it is held by bar j and the closed loop; the input turns fully |
| F6 | N/A | driven through a toothed belt; no rest position or rattling clearance to hold |
| F7 | PASS | AUTO / HAND · belt tension by the slotted mount; bar k is the adjustable link: H.turnbuckle at the bow's crest, bar k in two halves joined by M3 left and right hand studs, a 12 x 6 x 15 body milled flat and two DIN 439 jam nuts, flush in the bar's plane; shown at its set point of 123.8 mm between pin centres, drawn length exact |
| F8 | PASS | AUTO · oil sink on the bridge over the open Y bearing; the others are sealed or shielded |
| F9 | PASS | HAND · index line on the crank and a zero line with 90° ticks engraved on the base: the crank goes back on the shaft in phase |
| F10 | PASS | AUTO / HAND · pulley flanges, home flag and fork sensor; no slip clutch: the crank turns fully and the loop cannot jam while it is connected |
| M1 | PASS | AUTO · edge breaks on every top face |
| M2 | PASS | HAND · bosses round every pin; windows in the two swinging triangles only, 6 mm of web to every edge and boss |
| M3 | PASS | AUTO · bore entry chamfers on every seat and through hole |
| M4 | PASS | AUTO / HAND · counterbored base corners and housing screws, countersink for the crank end screw |
| M5 | PASS | AUTO / HAND · window cutter radius 4 mm; no other pocket (bar k's halves end square at the turnbuckle) |
| M6 | PASS | AUTO · edge distance and walls clean |
| M7 | PASS | HAND · the bridge arms are filleted by H.bridge; no other bracket |
| M8 | PASS | AUTO · undercut on every shoulder bolt thread |
| M9 | PASS | AUTO / HAND · M6 into the steel crank and bars over their full 6 mm (1 d); axle through the base to a nyloc; lengths from the standard series |
| M10 | PASS | AUTO / HAND · materials named on every solid; steel bars, aluminium triangles and bridge |
| M11 | PASS | AUTO · centre holes and chamfered ends on the shafts |
| M12 | PASS | HAND · every head reachable from above or below when assembled; bearings pressed out past their circlips; jam nuts reachable from above |
| M13 | PASS | AUTO / HAND · threadlocker or nyloc on every screw and bolt, set screws low strength, turnbuckle studs threadlocked into the halves, jam nuts against the turnbuckle body |
| M14 | N/A | no sliding contact |
| V1 | PASS | AUTO · pancake outrunner Ø50 x 18 under the base, GT2 32:16 |
| V2 | PASS | AUTO · one-piece bracket, flange screws up into the base |
| V3 | PASS | AUTO / HAND · belt and pulleys clear of feet and housing; clearance 0 |
| V4 | PASS | AUTO · flanges, two set screws at 90°, slotted mount |
| V5 | PASS | AUTO · rotary: belt to the input pulley |
| V6 | PASS | AUTO · home flag, fork sensor on the housing, leads to the terminal block, one P-clip |
| L1 | PASS | STYLE · lint-style clean |
| L2 | PASS | HAND · the polish carries geometry, roles, marks and materials only |
| L3 | PASS | HAND · foot triangle output, bridge ground, hardware hw |
| L4 | PASS | HAND / STYLE · accent on the input only |
| L5 | PASS | AUTO / HAND · screws, bearings and shanks are real solids in real holes |
| L6 | PASS | AUTO · depth order right at plan, 28°, side and explode |
| L7 | PASS | STYLE · tilt 0° to 88°, no shear |
| L8 | PASS | AUTO / HAND · zero line and ticks are marks; centrelines and dimensions automatic |
| R1 | PASS | HAND · the polish reuses H.window and H.turnbuckle; the plating, tapers and clearance are the model's; no inline standard part |
| R2 | PASS | HAND · threads M3, M4, M5, M6 (the turnbuckle now M3, was M5); joints Ø8, 10; three bearing sizes |
| R3 | PASS | AUTO · housing, bridge, stops and drive from their subassemblies |
| R4 | PASS | AUTO · package built at build time |
| R5 | PASS | HAND · states only what differs; no sampling in the polish; rules 0.9 s, polish about 1 ms |
| R6 | PASS | FLAG · Node CPU canvas bench (the browser bench is not run here), DPR 1.5: plan 346, 28° 340, side 292, explode 266 ms at full detail, session setup 9.3 ms; not comparable with the browser numbers of the first four passes. 189 solids |
| R7 | PASS | HAND · model.ts + polish.ts 11.5 KB |
| R8 | PASS | AUTO / SITE · pre-rendered thumbnails; the stage draws on change only |
| DL1 | PASS | AUTO / HAND · every solid and mark on a rung; the turnbuckle body and nuts are collar and nut kinds, DL-H, the studs and bar k's second half never; the polish moves nothing |
| DL2 | PASS | HAND · default dial full |
| DL3 | PASS | AUTO · DL-D drawn when exploded, DL-B skipped at side elevation |
| DL4 | PASS | SITE · adaptive dial and the detail entry in the title block |
| DL5 | PASS | FLAG · rung counts and frame times in the detail ladder below |
| Q1 | PASS | check, clamp and edge distance clean |
| Q2 | PASS | 0 clashes |
| Q3 | PASS | package written, 26.4 KB; site build and site tests pass |
| Q4 | PASS | plan, 28°, side, explode at 28° and 70°, both sheets, overlays on at plan; attached to #28 |
| Q5 | PASS | Node bench at DPR 1.5; flags under R6 |
| Q6 | PASS | every row judged |
| Q7 | PASS | conformance: jansen-linkage at 2.5, pass |

## Joints
| Joint | Type | F1 locate | F2 retain | F3 torque | F4 thrust | F5 limit | F6 hold | F7 adjust | F8 lube | F9 timing | F10 protect |
|---|---|---|---|---|---|---|---|---|---|---|---|
| pO | J2 | 2 x Dowel pin Ø3 x 10 h6, housing to base | 2 x Internal circlip DIN 472, Ø19; Countersunk M5 x 12 (ISO 10642), into the shaft end, flush; Socket head M5 x 10 (ISO 4762), into the shaft end | Feather key 3 x 3 x 6 (DIN 6885) | Wave washer 14.5x18.8, spring steel; Thrust washer 10.2x16, bronze | – the input turns fully | – driven through the belt, nothing to hold | – belt tension at the motor mount (drive) | – sealed bearings | Crank; Base plate | – see drive |
| pY | J1 | 2 x spigot | 2 x Internal circlip DIN 472, Ø16; 2 x Bearing F688 (8x16x5) | – no keyed part; the triangle and bar c turn on bearings | Thrust washer 8.2x10.8, bronze | Stop bumper, neoprene sleeve Ø12 | – the closed loop, driven through the belt | – no exact length here; bar k carries the adjuster | Bridge over the pivot, on two spigoted posts | – the swing of both parts follows the crank | – protected by the stops (F5) |
| pA | J3 | – no removable plate on a moving pin | 2 x Internal circlip DIN 472, Ø16; 2 x Bearing F688ZZ (8x16x5); head | – no keyed part | F688ZZ located by flange and circlip, inner race clamped | – limited by the linkage | – belt-driven, no rest position | – see bar k | – shielded bearings, greased for life | – the crank index sets its phase | – none needed |
| pB | J3 | – no removable plate on a moving pin | Internal circlip DIN 472, Ø16; Bearing F688ZZ (8x16x5); head | – no keyed part | F688ZZ located by flange and circlip, inner race clamped | – limited by the linkage | – belt-driven, no rest position | – see bar k | – shielded bearing, greased for life | – no phase of its own | – none needed |
| pC | J3 | – no removable plate on a moving pin | 2 x Internal circlip DIN 472, Ø16; 2 x Bearing F688ZZ (8x16x5); head | – no keyed part | F688ZZ located by flange and circlip, inner race clamped | – limited by the linkage | – belt-driven, no rest position | – see bar k | – shielded bearings, greased for life | – no phase of its own | – none needed |
| pD | J3 | – no removable plate on a moving pin | Internal circlip DIN 472, Ø16; Bearing F688ZZ (8x16x5); head | – no keyed part | F688ZZ located by flange and circlip, inner race clamped | – limited by the linkage | – belt-driven, no rest position | – see bar k | – shielded bearing, greased for life | – no phase of its own | – none needed |
| pE | J3 | – no removable plate on a moving pin | Internal circlip DIN 472, Ø16; Bearing F688ZZ (8x16x5); head | – no keyed part | F688ZZ located by flange and circlip, inner race clamped | – limited by the linkage | – belt-driven, no rest position | – see bar k | – shielded bearing, greased for life | – no phase of its own | – none needed |
| pY-bridge-post | post | 2 x spigot | – screwed from both sides | – static | – static | – static | – static | – spigot in a slot takes the hole tolerance | – static | – static | – static |
| drive | drive | – bracket screwed up into the base | – pulley hub set screws (pO) | Pulley hub, 2 x M3 set screws at 90° | – motor bearings | – motor turns freely | – motor holds when powered | bracket | – belt runs dry | Home flag read by the fork sensor | Home flag, 1 mm steel vane; 3 x Fork sensor, slotted optical, 5 mm gap; Pulley flanges |
| bar-k-adjust | post | – the halves are located by the studs in the body | 2 x Jam nut M3 (DIN 439), one left hand and one right hand | – static: the studs are threadlocked into the halves | – static | – static | – static | Turnbuckle body 12 x 6 x 15, milled flat, M3 left and right hand; 2 x Jam nut M3 (DIN 439), one left hand and one right hand; 2 x Stud M3 x 13.8, one left hand and one right hand, threadlocked into the halves | – static | Index line across the body at the set point | – static |

## Variants and overrides
| Joint or part | Rule result | Chosen | Why |
|---|---|---|---|
| bar k | straight stadium | bowed 7 mm in the model (an arc through both pin centres, length exact) | the Y pivot lies 2.3 mm outside a straight bar k; its axle, spacers and bridge need 8.8 mm |
| bar k, middle | one bar | two halves on one body, joined by H.turnbuckle at the bow's crest | F7: the leg depends on exact lengths; bar k is the longest bar |
| upper triangle, foot triangle | solid plates | one lightening window each, 6 mm of web | D2, M2: both swing, so their mass is inertia |
| upper triangle, foot triangle | layers by hand | both on layer 0 with the crank, bars on 1 and 2 | a search over the sweeps: the fewest layers with no pin passing through a part (three planes) |
| crank, base | no marks | index line on the crank, zero line and 90° ticks on the base | F9 |

## Detail ladder
| Rung | Solids | Marks | Frame ms at this dial position |
|---|---|---|---|
| DL-A | 24 | 0 | 216.6 |
| DL-B | 0 | 294 | 187.1 |
| DL-C | 0 | 0 | 69.8 |
| DL-D | 38 | 0 | 54.0 |
| DL-E | 8 | 2 | 50.9 |
| DL-F | 0 | 0 | 41.4 |
| DL-G | 0 | 0 | 40.7 |
| DL-H | 11 | 0 | 39.9 |
| never | 111 | 261 | 306.0 (full) |

## Promotion candidates
Hand fixes that should become rules or primitives.

- `H.stops` (rules/stops): two oscillating parts on one ground pivot (the upper triangle and bar c on Y) give the same
  stop ids; it passes here only because the upper triangle finds no room for stops. A second part with room crashes the
  assembly with "duplicate solid id pY-stop0". The id needs the part's id.
- J1 bridge (`H.bridge`, rules/j1-dead-axle): the bridge is raised above every sweep under its footprint, which assumes
  those sweeps pass beneath it. A part that sweeps over the pivot at the axle itself would run through the axle. It did
  not occur here (nothing else sweeps over Y, once the layers are right) but the layer search had to find that.
- Layers by search: finding the fewest planes with no pin through a part took a script (sweeps of every part over every
  pin, same-layer overlaps, contiguous pin ranges). A `tools/layers` helper would serve every multi-bar linkage.
- Stops for large plates: `stops()` looks for room at 0.7 of the part's reach and finds none for the upper triangle.

## Verification
check: clean · clearance: 0 clashes · clamp: clean · edge distance: clean · package: 26.8 KB
screenshots: plan with overlays, 28°, side, explode at 28° and 70°, both sheets (attached to #28) · bench: Node CPU canvas, DPR 1.5, 2026-10-18; 28° frame 340 ms at full detail, 70 ms at dial C (flag, R6)
