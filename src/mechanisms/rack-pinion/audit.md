# Audit: Rack and pinion (rack-pinion)
standard: 2.3 · date: 2026-10-18 · result: pass · detail: full · pass: build

## Summary
PASS 112 · FAIL 0 · N/A 9 · open: none

## Requirements
| Id | Status | Evidence / action |
|---|---|---|
| S1 | PASS | DATA · the standard carries version 2.3 and its changelog |
| S2 | PASS | HAND · header with standard, date, result, detail, pass |
| S3 | PASS | AUTO · tools/conformance reads this header and runs in npm run check |
| S4 | PASS | SITE · issue #35 holds the mechanism-specific points only |
| P1 | PASS | DATA · record complete; model.ts, polish.ts, audit.md present |
| P2 | PASS | DATA · npm run catalog: vocabularies OK |
| P3 | PASS | DATA / SITE · facts come from the record; drive reads motorised (rotary input kind) |
| P4 | PASS | DATA · tags grouped Function, Property, Application with keywords |
| P5 | PASS | DATA · explain (motion, forces, benefits, limits) and four real-world uses present |
| P6 | PASS | DATA · Wikipedia, Cornell KMODDL and SDP/SI references; photo page and video in media; two YouTube real-world videos added (Pilatus Railway cab ride, Avid CNC gantry on rack and pinion), found by search, confirmed to exist by oEmbed, checked by title and channel only (not watched in full) |
| P7 | PASS | HAND / SITE · no prose in model.ts or polish.ts beyond part and joint names and notes (engineering record) |
| P8 | PASS | SITE · no parts list or joint sections on the page; notes and rules live in the audit record |
| P9 | PASS | HAND · explain says the pinion swings and the rack moves pitch radius times the angle, 83.8 mm each way: matches solve() (x = p/2 + 32 θ, ±150°) and the plot |
| P10 | PASS | HAND · overlays checked in the plan screenshot: path of the rack (first path, comet), rack velocity, tooth force along the line of action (flips with the swing direction), 20° pressure angle, plot of rack travel |
| P11 | PASS | DATA · record prose unchanged in this pass; plain language, mm and degrees |
| K1 | PASS | HAND · pitch radius 32, pitch line y = -32, half pitch phasing from model.ts; the polish adds hardware only; check link error 0 |
| K2 | PASS | HAND · check: finite, continuous, periodic over 720 samples |
| K3 | PASS | HAND · P.gear, P.rack, P.cap only |
| K4 | PASS | HAND · roles driver (pinion), output (rack), pin; accent on the input cap pO only |
| K5 | PASS | HAND · pinion and rack share layer 0 (they mesh in one plane); ground pivot cap layer -1 radius 7; check clean |
| K6 | PASS | DATA · z 16, m 4, rp 32, p 12.566, 20°, ±150°, 17 teeth (k -8 to 8), half pitch offset: as the build spec. Deviation, commented in model.ts: the input kind is declared rotary (a reversing servo through the belt) where the spec says oscillating; see K7 |
| K7 | PASS | HAND · input rotary on the pinion. The spec says oscillating, but the oscillating drive (crank and link, V5) cannot give a 300° swing: the link would have to cross the shaft (clash with the housing parts, and a lever tip circling the shaft). A reversing servo through the standard belt gives exactly the modelled swing. Decision for the owner, listed in the issue |
| D1 | PASS | HAND · true involute pinion with keyed bore, rack from P.rack, plain bars and plates in the one family of forms |
| D2 | PASS | HAND · material where the load runs: pinion and rack are solid at 7 mm; guide bars, keepers and stops are plain load-driven bars |
| D3 | PASS | STYLE · roles by surface pattern (driver stipple, output hatching, ground bars plain) |
| D4 | PASS | AUTO · base and feet from the rules |
| D5 | PASS | AUTO / HAND · the pinion bridge is H.bridge on two spigoted Ø10 posts |
| D6 | PASS | HAND / STYLE · screenshots: supporting hardware quieter than the rack and pinion, nothing distracts |
| D7 | PASS | HAND · rack, pinion, bars and base are plain; the richness is in gib, keeper, wipers, stops, roller, bridge and bearings |
| A1 | PASS | AUTO · pO J2, mesh J6 (rack form) classified; the slide and the backing roller are not found by the rules (rack guide, see variants), so the polish adds them as joints rack-slide (J5) and rack-yoke (J4) |
| A2 | PASS | AUTO · pO live shaft; mesh hardware; slide and roller built by hand |
| A3 | PASS | AUTO · Ø10 shaft, 6800 bearings in the housing, 6800 floating in the bridge |
| A4 | PASS | AUTO · the live shaft is a stepped profile with grooves, key seat, chamfers; no dead axle on this mechanism |
| A5 | PASS | AUTO · Ø10 shaft, 3 x 3 feather key, hub with set screws |
| A6 | PASS | AUTO · the bridge posts are Ø10 standoffs screwed from both sides with spigots. No plate floats on standoffs and no J5 rail exists, so the pads of 2.2 do not apply: guide bars and bed bear on the base over their whole length, screwed and dowelled |
| A7 | PASS | AUTO · 8 mm base, counterbored corner holes, rubber feet, engraved path of the rack pitch line, scale, clearance hole for the live shaft |
| A8 | PASS | AUTO · stage 3 fasteners: every screw has its shank, clearance holes through keepers, bars and bed, tapped in the base |
| A9 | PASS | AUTO / HAND · pinion straddle mounted (floating flanged bearing in a bridge on the side away from the rack): the straddle rule skips rack meshes, so the polish calls it (AUTO-TODO, promotion candidate). The rack is guided on both sides |
| A10 | PASS | HAND · pinion and rack in one plane, guides in one plane with the rack, keepers one level above; nothing stacked only to clear something |
| A11 | PASS | AUTO / HAND · pinion: tooth force into the shaft, then bearings, housing, base; separating force into the backing roller, its stud and the base; rack load through the bed into the base. Housing, bridge, guides screwed and dowelled |
| A12 | PASS | AUTO · clamp check clean |
| A13 | PASS | AUTO / HAND · names with real sizes (6800, 624, M3 to M5, DIN 916, DIN 6885); the unnamed solids are further items of a listed set |
| A14 | PASS | HAND · stops 1.5 mm past the rack ends at full travel; front guide 0.5 mm off the tooth tips; roller 0.1 mm off the back face; bridge above the pinion; clearance tool 0 |
| A15 | PASS | AUTO · clearance: 0 clashes over the cycle |
| A16 | PASS | HAND · joint notes and badges for pO, rack-slide, rack-yoke; five build rules |
| A17 | PASS | HAND · order: base, housing, shaft and pinion, bed, rack, guide bars with gib, keepers, wipers, stops, roller on its eccentric, bridge. Every screw reachable from the top, gib screws from behind the bars, pressed bearings pull from the housing and bridge |
| E1 | PASS | AUTO · every solid one explode level |
| E2 | PASS | AUTO · screws and the stud move as one body (checked at full explode) |
| E3 | PASS | AUTO · screws lift out along their axes (screenshots at 28 and 70 degrees) |
| E4 | PASS | HAND · levels follow the order of A17: bed under the rack, keepers and bridge above it, screws furthest |
| E5 | PASS | AUTO · bearings and dowels stay in their parts |
| E6 | PASS | AUTO · motor and bracket move as one |
| E7 | PASS | AUTO · spacers midway |
| E8 | PASS | AUTO · keyed parts keep their order on the shaft |
| E9 | PASS | HAND · screenshots at 100 percent, 28 and 70 degrees: nothing inside another part, nothing leaves the frame |
| J1 | N/A | AUTO · no dead axle on this mechanism |
| J2 | PASS | AUTO · pO: housing cartridge, keyed shaft, circlips, thrust washer, wave washer, home flag; straddled by the bridge |
| J3 | N/A | AUTO · no moving pins |
| J4 | N/A | AUTO · no pin in a slot. The backing roller (rack-yoke) is a track roller on an eccentric stud built by hand; it runs on the rack back face, so it has no wear strips or felt |
| J5 | PASS | HAND · built by hand because the slide rule needs rails either side of the slider and the pinion sits on the rack tooth side: bed strip (hardened, replaceable), rear guide bars with bronze gib, adjusting screws and lock nuts, keepers, felt wipers, grease nipple, front guide, end stops with pads |
| J6 | PASS | AUTO · hubs with key and set screws, timing marks at the mesh; no eccentric on the pinion shaft (rack form): the backlash adjuster is the roller on its eccentric stud |
| J7 | N/A | AUTO · no cam |
| J8 | PASS | AUTO · drive belt: flanged pulleys, slotted mount |
| F1 | PASS | AUTO / HAND · dowels in housing and bridge posts; bed and every guide bar have two dowels |
| F2 | PASS | AUTO / HAND · circlips and retainers on the shaft and bearings; keepers hold the rack down; roller stud screw and spacers retain the roller |
| F3 | PASS | AUTO · feather key and set-screw hub on the pinion |
| F4 | PASS | AUTO / HAND · thrust washer under the pinion, wave washer; roller between spacers |
| F5 | PASS | AUTO / HAND · hard stops with neoprene pads 1.5 mm past each rack end. The pinion is limited by the drive and by the rack stops (the stops rule skips the input) |
| F6 | N/A | AUTO / HAND · positive tooth drive, no rest position to hold |
| F7 | PASS | AUTO / HAND · backlash: the roller on an eccentric flange; guide play: bronze gib with three adjusting screws a side; belt tension slot |
| F8 | PASS | AUTO · open mesh greased through felt wipers at both ends of the gibs and a nipple on the right keeper; sealed bearings need none |
| F9 | PASS | AUTO / HAND · match marks on the pinion tooth and the rack gap at the mesh |
| F10 | PASS | AUTO · home flag and fork sensor, pulley flanges, leads to the terminal block |
| M1 | PASS | AUTO · edge breaks |
| M2 | N/A | HAND · the pinion is small (root radius 27, shaft hub radius 14): no room for spokes with the walls the standard asks for; the rack is a plain bar |
| M3 | PASS | AUTO · bore entry chamfers on bearing seats |
| M4 | PASS | AUTO / HAND · counterbored holes in the base and housing; countersunk heads flush in the bed and keepers (countersinks drawn) |
| M5 | N/A | AUTO / HAND · no pockets or windows built |
| M6 | PASS | AUTO · edge distance and walls clean |
| M7 | N/A | HAND · no bracket with an inside corner |
| M8 | N/A | AUTO · no shoulder with a thread |
| M9 | PASS | AUTO / HAND · ISO coarse threads; screw lengths from the standard series, engagement into the 8 mm base |
| M10 | PASS | AUTO / HAND · every solid names a material (steel C45 guides, bronze gib, hardened bed, neoprene pads) |
| M11 | PASS | AUTO · turned-part marks on the shaft |
| M12 | PASS | HAND · gib screws are reached from behind the bars; every other screw from above (bar screws once the keeper is off); bearings pull out of housing and bridge |
| M13 | PASS | AUTO / HAND · locking on every threaded fastener (jam nuts on the gib screws) |
| M14 | PASS | AUTO / HAND · bed strip and gib are separate replaceable hard parts where the rack slides; no slots or cams here |
| V1 | PASS | AUTO · pancake motor under the base, GT2 belt 32:16 |
| V2 | PASS | AUTO · one-piece bracket |
| V3 | PASS | AUTO / HAND · belt clear; the drive rule placed the cable clip over the motor bracket flange (edge distance fault), so the polish moves it along the lead |
| V4 | PASS | AUTO · pulley flanges, set screws, tension slot |
| V5 | PASS | AUTO · rotary kind: belt to the input pulley (see K7) |
| V6 | PASS | AUTO · home flag, fork sensor, terminal block, cable clip |
| L1 | PASS | STYLE · npm run lint clean; no look values in the mechanism |
| L2 | PASS | HAND · the model and the polish carry geometry, roles, materials, marks and accent only |
| L3 | PASS | HAND · roles right: pinion driver, rack output, guides ground, bearings |
| L4 | PASS | HAND / STYLE · accent on the input shaft ring and the traced path and forces only |
| L5 | PASS | AUTO / HAND · see-through stage fired; the mesh stays in view in plan and at 28 degrees (the bridge arms point away from the rack) |
| L6 | PASS | AUTO · depth order correct at 28, 70 and 88 degrees in the screenshots |
| L7 | PASS | STYLE · tilt 0 to 88 |
| L8 | PASS | AUTO / HAND · chain lines, dimensions, engraved scale and path |
| R1 | PASS | HAND · primitives and subassemblies throughout; the guide solids are plain rectangles from H.plate, H.gib, H.wiper, H.stop. The horizontal gib screws are drawn by their plan outline (a promotion candidate for a guide primitive) |
| R2 | PASS | HAND · screws M3, M4, M5, Ø10 shaft, bearings 6800 and 624 from the table, dowels Ø3, standoffs Ø10 |
| R3 | PASS | AUTO · housing, bridge, drive and sensor are single subassemblies |
| R4 | PASS | AUTO · package 23.7 KB |
| R5 | PASS | HAND · polish 25 ms, no sampling in the polish |
| R6 | PASS | FLAG · Node CPU bench, DPR 1.5: 268 ms at 28 degrees at full detail (spur gears in the same tool: 360 ms), 37 ms at dial H; not comparable with the browser figures of other audits. Browser bench not run in this session |
| R7 | PASS | HAND · model.ts + polish.ts 16.4 KB |
| R8 | PASS | AUTO / SITE · site draws on change only |
| DL1 | PASS | AUTO / HAND · every solid on a rung; no hand moves up the ladder |
| DL2 | PASS | HAND · default dial position full |
| DL3 | PASS | AUTO · table-driven |
| DL4 | PASS | SITE · site behaviour |
| DL5 | PASS | FLAG · rung counts and Node frame times in the ladder below |
| Q1 | PASS | check, clamp and edge distance clean |
| Q2 | PASS | 0 clashes |
| Q3 | PASS | package written, 23.7 KB; npm run build builds the page |
| Q4 | PASS | plan, 28, side, full explode at 28 and 70 degrees, both sheets, overlays on: all looked at |
| Q5 | PASS | tools/bench run (Node, see R6 and the ladder) |
| Q6 | PASS | every requirement judged; ten-function table filled for every joint |
| Q7 | PASS | tools/conformance at 2.3 |

## Joints
| Joint | Type | F1 locate | F2 retain | F3 torque | F4 thrust | F5 limit | F6 hold | F7 adjust | F8 lube | F9 timing | F10 protect |
|---|---|---|---|---|---|---|---|---|---|---|---|
| pO | J2 | 2 x Dowel pin Ø3 x 10 h6, housing to base | 3 x Internal circlip DIN 472, Ø19; External circlip DIN 471, Ø10; Socket head M5 x 10 (ISO 4762), into the shaft end; Bearing F6800ZZ (10x19x5), floating | Feather key 3 x 3 x 7 (DIN 6885) | Wave washer 14.5x18.8, spring steel; Thrust washer 10.2x16, bronze | – the drive limits the pinion; the rack stops (rack-slide) end the travel | – positive tooth drive, no rest position | – backlash is set at the backing roller (rack-yoke) | – sealed bearings | – marks sit at the mesh (mesh-rack-pinion) | – the sensor belongs to the drive (drive) |
| mesh-rack-pinion | J6 | – the shaft locates the pinion; the guide locates the rack | – circlips on the shaft (pO); keepers on the rack (rack-slide) | Gear hub Ø22, set screw M3 on the key; Set screw M3 (DIN 916), threadlocked | – thrust washer under the pinion (pO) | – the rack stops (rack-slide) | – positive tooth drive | Eccentric flange of the backing roller (rack-yoke) | Felt wipers and grease nipple (rack-slide) | Rack, 17 teeth; Pinion, 16 teeth | – limited by the drive |
| drive | drive | – bracket screwed up into the base | – pulley hub set screws (pO) | Pulley hub, 2 x M3 set screws at 90° on the keyed shaft | – motor bearings | – the motor reverses; the rack stops end the travel | – motor holds when powered | bracket | – belt runs dry | – marks sit at the mesh | Home flag, 1 mm steel vane; 3 x Fork sensor, slotted optical, 5 mm gap; Pulley flanges |
| pO-bridge-post | post | 2 x spigot | – screwed from both sides | – static | – static | – static | – static | – spigot in a slot takes the hole tolerance | – static | – static | – static |
| rack-slide | J5 | Bed strip, hardened and ground, 2 mm, screwed to the base; 2 x Rear guide bar, ground steel, screwed and dowelled; 2 x Front guide bar, ground steel, screwed and dowelled | 2 x Keeper plate, holds the rack down | – nothing turns | – the rack runs on its bed, no thrust | 2 x End stop block, hardened; 2 x Stop pad, neoprene 2 mm | – positive tooth drive, nothing to hold | 2 x Gib strip 3 x 6, bronze, against the rack's back face | 4 x wiper; Grease nipple M6 (DIN 71412) | – the match marks are at the mesh | – the drive limits the rack |
| rack-yoke | J4 | – the stud is screwed into the base; the flange is clamped by two screws | spacer | – the roller turns freely | Inner-race spacer 4.2x6 | – the roller is no limit | – the roller bears on the rack with no rest position | Eccentric flange Ø18, 0.5 mm offset bore Ø4, arc slots, index line | – sealed roller; the rack back face is wiped by the gib wipers | – no phase | – none needed |

## Variants and overrides
| Joint or part | Rule result | Chosen | Why |
|---|---|---|---|
| input kind | oscillating: motor, crank and link on a lever | rotary: reversing servo through the belt (model.ts) | a 300 degree swing cannot come from a crank and link: the link crosses the shaft and clashed with the housing parts (3 clashes) |
| pO shaft top | no bridge: the straddle rule leaves rack meshes out | straddle(ctx, pO) called from the polish | nothing sweeps over the pinion; the bridge stands on the side away from the rack |
| rack guide | no J5: the slide rule needs twin rails round the slider | hand-built guide: bed, rear bars with gib, keepers, wipers, nipple, front bars, stops | the pinion sits on the rack's tooth side; every J5 line of the canonical build is present |
| backing roller | none | 624 track roller on an eccentric flange stud behind the rack | takes the separating force and sets the backlash (F7); no eccentric on the pinion shaft for a rack |
| drive cable clip | clip over the motor bracket flange (edge distance fault) | clip moved along the lead | rule bug, worked around in the polish |
| pinion | solid web | solid web, no spokes | M2: too small for windows (N/A) |

## Detail ladder
| Rung | Solids | Marks | Frame ms at this dial position |
|---|---|---|---|
| DL-A | 8 | 0 | 205.5 |
| DL-B | 0 | 195 | 225.9 |
| DL-C | 0 | 0 | 56.6 |
| DL-D | 10 | 0 | 52.7 |
| DL-E | 13 | 2 | 51.3 |
| DL-F | 0 | 0 | 49.1 |
| DL-G | 0 | 0 | 43.7 |
| DL-H | 38 | 0 | 37.6 |
| never | 122 | 151 | 286.9 (full) |

## Promotion candidates
None yet.

## Verification
check: clean · clearance: 0 clashes · clamp: clean · edge distance: clean · package: 23.7 KB
screenshots: plan, 28°, side, explode at 28° and 70°, both sheets (attached to #35) · baselines: tests/visual/__baselines__/rack-pinion-* · bench: Node CPU canvas, DPR 1.5, 2026-10-18; 28° frame 268 ms at full detail (spur gears in the same tool 360 ms), 37.6 ms at dial H (flag, R6)
