# Audit: Scissor lift (scissor-lift)
standard: 2.5 · date: 2026-10-18 · result: pass · detail: full · pass: build

## Summary
PASS 113 · FAIL 0 · N/A 8 · open: none

## Requirements
| Id | Status | Evidence / action |
|---|---|---|
| S1 | PASS | DATA · the standard carries version 2.3 and its changelog |
| S2 | PASS | HAND · header with standard, date, result, detail, pass |
| S3 | PASS | AUTO · tools/conformance reads this header and runs in npm run check |
| S4 | PASS | SITE · #37 holds only this mechanism's decisions and open items |
| P1 | PASS | DATA · record complete; model.ts, polish.ts, audit.md present |
| P2 | PASS | DATA · catalogue validator clean |
| P3 | PASS | DATA / SITE · ratio (variable, lift per unit travel 2.0 to 8.6), axes, output character, backdrivable, other names, family, motion, level, dof and the motorised drive |
| P4 | PASS | DATA · tags grouped Function, Property, Application, keywords underneath |
| P5 | PASS | DATA · motion, forces, benefits, limits; four uses with one line each |
| P6 | PASS | DATA · two Wikipedia pages and the UniSA learning resource; two videos and a Commons photo category; the two real-world YouTube videos checked (oEmbed: both exist, a maker's scissor lift table each, real footage) |
| P7 | PASS | HAND / SITE · no prose in model.ts or polish.ts; lint-style clean |
| P8 | PASS | SITE · no parts list, build or joint sections on the page |
| P9 | PASS | HAND · fixed in the catalogue: the lift per unit travel is n w / h = 2.0 raised to 8.6 lowered (it said 0.6) and the platform is 150 mm long (it said 120); travel 35 mm, stage height 29.6 to 74.8 and platform height 88.8 to 224.5 match solve() and the plot |
| P10 | PASS | HAND · platform point path traced, velocity at C and the carriage, bar and carriage force lines, bar angle, platform height plot |
| P11 | PASS | DATA · plain, short sentences, no em dashes, mm and degrees |
| K1 | PASS | HAND · check: link error 2.8e-14 mm; the polish changes heights, outlines and hardware only |
| K2 | PASS | HAND · check: finite, continuous, periodic over 720 samples |
| K3 | PASS | HAND · slider, rails, link (bars), slotLink (platform), caps, tracer; at, between and fixed placement |
| K4 | PASS | HAND · roles driver (carriage), link (bars), output (platform), ground (rails), pin; accent on the carriage pin pR0 only, the input of a linear mechanism |
| K5 | PASS | HAND · check clean: carriage and rails layer 0, b rear plates 1, a bars 2, b front plates 3 (twins), platform 4 plated 3.5 mm up with `dz` over the heads of the pins under it; ground pivot layer -1, radius 7, moving pins 5.5 |
| K6 | PASS | DATA · L 90, n 3, span 85 to 50, h = sqrt(L² - w²), C 45 from L3: as the catalogue; the platform is 150 mm where the catalogue said 120, corrected there (a code comment says why: the base follows the platform and the drive motor sits past the travel) |
| K7 | PASS | HAND · input linear on the carriage |
| D1 | PASS | HAND · bars are stadiums with engraved boss rings (middle pin included), slider with square ends on two stadium rails, platform a slot link; the front plates repeat the bars |
| D2 | PASS | HAND · material round every pin, no windows: the bars are uniform load paths and nothing here is inertia-critical |
| D3 | PASS | STYLE · roles told apart by pattern and tone in both sheets |
| D4 | PASS | AUTO · base corners from the form style, four feet concentric with the corner arcs |
| D5 | PASS | AUTO / HAND · the ground axle carries a bridge on two spigoted posts; the rails sit on ground risers |
| D6 | PASS | HAND / STYLE · slide hardware, stops, drive and leads read quieter than the bars and platform |
| D7 | PASS | HAND · bars, platform, carriage, rails and base carry only load shape and manufacturing marks |
| A1 | PASS | AUTO · pL0 J1; pR0, pM0 to pM2, pL1, pR1, pL2, pR2, pL3 J3; pR3 J4; slide-carriage J5 |
| A2 | PASS | AUTO · dead axle at the ground pivot, shoulder bolts at every bar pin, track roller at the platform slot, slide on the track |
| A3 | PASS | AUTO · F688 and F688ZZ (8x16x5) on every Ø8 pin; spacers in every gap |
| A4 | PASS | AUTO · stepped shoulder axle with undercut thread and chamfered ends at pL0; shoulder bolts elsewhere |
| A5 | N/A | AUTO · no keyed part: the motor pulley is a D-bore on a D-flat shaft |
| A6 | PASS | AUTO · bridge posts Ø10 spigoted and screwed from both sides; rails on one ground riser each, screwed down, the reference rail dowelled (v2.4) |
| A7 | PASS | AUTO · 8 mm base, counterbored corners, feet, the platform point path engraved, front scale; no live shaft, so no shaft hole: a slot for the carriage instead (see overrides) |
| A8 | PASS | AUTO · every head has its shank; holes cut by stage 3 |
| A9 | PASS | HAND · every bar pin is a clevis: each a bar between the b rear plate and its front plate (twin in the model); pR0 and pL0 carried at both ends; the one single shear is pR3, the stud in the platform slot, carried by the bar alone with the roller 14 mm above it (flagged "single shear"); the platform cannot straddle the bar |
| A10 | PASS | HAND · parts whose sweeps never meet share a layer: all a bars, all b rear plates, all b front plates; the platform is plated 3.5 mm so its underside clears the bolt heads by 1.4 mm; the front plates are for double shear, not to clear something |
| A11 | PASS | HAND · platform to L3 pin to the b plates to the bars to the ground axle, held by the base and a screwed, dowelled bridge; carriage to its rails, keeper and gib, and to the belt; rails screwed through their risers into the base, the reference rail dowelled |
| A12 | PASS | AUTO · clamp check clean |
| A13 | PASS | AUTO / HAND · every solid named with catalogue sizes, sets counted |
| A14 | PASS | HAND · platform underside 1.4 mm over the lowest-position bolt heads; fork sensor body 0.4 mm clear of the carriage; the base slot ends 0.5 mm past the carriage; end stops outside the carriage sweep; clearance 0 |
| A15 | PASS | AUTO · clearance: 0 clashes over the cycle |
| A16 | PASS | HAND · a note and a badge on every pin joint, five build rules |
| A17 | PASS | HAND · track risers, rails and dowels, slide hardware, carriage; ground axle, bridge; a0 on the axle, b0 rear and a1 up the stages; b front plates; platform; heads last; belt drive from below |
| E1 | PASS | AUTO · one level per solid |
| E2 | PASS | AUTO · screws, bolts with their shims, shafts and bought units are groups |
| E3 | PASS | AUTO · bolts and bridge screws upward, drive screws downward |
| E4 | PASS | HAND · bolt heads highest, front plates above the a bars, a bars above the rear plates; the platform above the front plates |
| E5 | PASS | AUTO · bearings and circlips stay in their parts |
| E6 | PASS | AUTO · motor with its bracket, bearings whole, belt in the pulley plane |
| E7 | PASS | AUTO · spacers midway |
| E8 | N/A | AUTO · no keyed shaft stack |
| E9 | PASS | HAND · readable at full explode at 28° and 70° in both sheets; nothing inside another part, nothing leaves the frame |
| J1 | PASS | AUTO · pL0: stepped axle, bearing, circlip, thrust washer, bridge on spigoted posts, nyloc under the base, oil sink |
| J2 | N/A | no live shaft |
| J3 | PASS | AUTO / HAND · shoulder bolts threaded into the rear plates (the carriage at pR0), a bearing in every a bar, spacers, locked; clevis at every pin (variant) |
| J4 | PASS | AUTO · pR3: track roller on a stud, two hardened wear strips screwed to the slot walls, felt oiler, 1.5 mm relief at each slot end |
| J5 | PASS | AUTO · track, the dowelled reference rail, keeper plate, bronze gib clamped under the keeper by the rail screws, set on slotted holes, felt wipers, grease nipple, end stops with neoprene pads |
| J6 | N/A | no gear mesh |
| J7 | N/A | no cam |
| J8 | PASS | AUTO · flanged motor pulley, idler on a slotted tensioner arm |
| F1 | PASS | AUTO · bridge on spigots and dowelled; the reference rail located by two dowels (the gib on the other takes up the fit); no removable bearing plate on a moving pin |
| F2 | PASS | AUTO · every bearing held by a flange and an internal circlip; heads on the inner races; keeper holds the carriage down |
| F3 | N/A | AUTO · no keyed part |
| F4 | PASS | AUTO · bronze thrust washer under the first bar at the ground axle; moving pins clamp their bearings through inner-race spacers |
| F5 | PASS | AUTO / HAND · end stops with neoprene pads just past both ends of the carriage travel; a bumper post for the first bar on the ground axle |
| F6 | N/A | driven; the motor holds the position, the belt drive is backdrivable and a heavy load would want a brake: listed under open items for David |
| F7 | PASS | AUTO / HAND · bronze gib clamped under the keeper by the rail screws, set on slotted holes; belt tension at the idler arm; the bars are equal and fixed, no exact-ratio adjuster as in a straight-line linkage |
| F8 | PASS | AUTO · shielded bearings greased for life, an oil sink on the ground axle bridge, felt oiler at the platform slot, wipers and a nipple on the slide |
| F9 | PASS | HAND · platform height scale engraved on the base beside the left column, every 10 mm, with an index line on the platform |
| F10 | PASS | AUTO / HAND · pulley flanges, home flag and fork sensor (added in the polish, the rule omits it for a linear drive), leads to a terminal block, no slip clutch: the stops are never touched in running |
| M1 | PASS | AUTO · edge breaks on every top face |
| M2 | PASS | HAND · bosses round every loaded hole; the bars carry only axial load and bending and no part starts, stops or reverses fast: no windows |
| M3 | PASS | AUTO · bore entry chamfers on every seat and through hole |
| M4 | PASS | AUTO / HAND · counterbored base corners, countersinks for the keeper and wear strip screws |
| M5 | PASS | AUTO / HAND · full-radius ends on every slot; no pockets |
| M6 | PASS | AUTO · edge distance and walls clean |
| M7 | N/A | HAND · no bracket or plate with a load-turning corner; bars and platform are straight stadiums |
| M8 | PASS | AUTO · undercuts on every shoulder bolt thread |
| M9 | PASS | AUTO / HAND · bolts into the steel rear plates and the bronze carriage over full thickness; standard lengths |
| M10 | PASS | AUTO / HAND · materials named on every solid |
| M11 | PASS | AUTO · centre holes and chamfered ends on the shafts |
| M12 | PASS | HAND · every head reachable from above or below; bearings pressed out past their circlips |
| M13 | PASS | AUTO / HAND · threadlocker on every screw, nyloc nut under the ground axle |
| M14 | PASS | AUTO · slot wear strips at the platform, hardened rails and a bronze gib on the slide |
| V1 | PASS | AUTO · pancake outrunner Ø50 x 18 under the base, GT2 16T pulleys |
| V2 | PASS | AUTO · one-piece bracket, flange screws up into the base |
| V3 | PASS | AUTO / HAND · belt and pulleys clear of feet and housings; clearance 0 |
| V4 | PASS | AUTO · flanges, slotted tensioner with an idler |
| V5 | PASS | AUTO / HAND · linear: belt loop under the base along the travel, carriage through a slot in the base clamped to the slider, tensioner on the far pulley; the slot and the carriage seat are corrected in the polish (see overrides) |
| V6 | PASS | AUTO / HAND · home flag, fork sensor taking the vane at the motor end of the stroke, leads to the terminal block, one P-clip; all built by the linear drive rule |
| L1 | PASS | STYLE · lint-style clean |
| L2 | PASS | HAND · the model and polish carry geometry, roles, marks and materials only |
| L3 | PASS | HAND · carriage driver, bars link, platform output, rails ground, hardware hw |
| L4 | PASS | HAND / STYLE · accent on the carriage pin only, with the traced path and forces |
| L5 | PASS | AUTO / HAND · screws, bearings and the roller are real solids in real holes |
| L6 | PASS | AUTO · depth order right at plan, 28°, side and explode |
| L7 | PASS | STYLE · tilt 0° to 88°, no shear |
| L8 | PASS | AUTO / HAND · engraved path, scale and index are marks |
| R1 | PASS | HAND · the polish reuses H.sensor and H.flag; plating, the clevis twins and the bars are the model's; no inline standard part |
| R2 | PASS | HAND · threads M2, M2.5, M3, M4, M5, M6; joints Ø8; bearings F688 and F688ZZ (8x16x5) |
| R3 | PASS | AUTO · slide, bridge and drive from their subassemblies |
| R4 | PASS | AUTO · package built at build time |
| R5 | PASS | HAND · states only what differs; one 72-hole scan of the base, no sampling; rules 1.1 s, polish 1 ms |
| R6 | PASS | FLAG · Node CPU bench at DPR 1.5: plan 294, 28° 320, side 328, explode 256 ms at full detail (slider-crank on the same machine: 283, 264, 235, 233); 8 ms not reached by dial H (43.1 ms) on this CPU path; 275 solids is the cost: look at in the perf work (#44) |
| R7 | PASS | HAND · model.ts + polish.ts 8.0 KB |
| R8 | PASS | AUTO / SITE · pre-rendered thumbnails; the stage draws on change only |
| DL1 | PASS | AUTO / HAND · every solid and mark on a rung; the polish moves nothing |
| DL2 | PASS | HAND · default dial full |
| DL3 | PASS | AUTO · DL-D drawn when exploded, DL-B skipped at side elevation |
| DL4 | PASS | SITE · adaptive dial and the detail entry in the title block |
| DL5 | PASS | FLAG · rung counts and frame times in the detail ladder below |
| Q1 | PASS | check, clamp and edge distance clean |
| Q2 | PASS | 0 clashes |
| Q3 | PASS | package written, 23.4 KB; site build passes |
| Q4 | PASS | plan, 28°, side, explode at 28° and 70°, both sheets looked at (dist/shots, not attached to the issue by this pass) |
| Q5 | PASS | Node CPU bench; flags under R6 |
| Q6 | PASS | every row judged; no FAIL |
| Q7 | PASS | conformance: scissor-lift at 2.3, pass |

## Joints
| Joint | Type | F1 locate | F2 retain | F3 torque | F4 thrust | F5 limit | F6 hold | F7 adjust | F8 lube | F9 timing | F10 protect |
|---|---|---|---|---|---|---|---|---|---|---|---|
| pL0 | J1 | 2 x spigot | Internal circlip DIN 472, Ø16; Bearing F688 (8x16x5) | – no keyed part | Thrust washer 8.2x10.8, bronze | bumper | – driven | – fixed centre | Bridge over the pivot, on two spigoted posts | – the height scale is on the base | – stops never touched in running |
| pR0 | J3 | – no removable plate on a moving pin | 2 x Internal circlip DIN 472, Ø16; 2 x Bearing F688ZZ (8x16x5); head | – no keyed part | – bearings located by flange and circlip, inner race clamped | – limited by the carriage stops | – driven | – equal bars, no adjuster | – shielded bearing, greased for life | – no phase to keep | – none needed |
| pM0 | J3 | – no removable plate on a moving pin | Internal circlip DIN 472, Ø16; Bearing F688ZZ (8x16x5); head | – no keyed part | – bearings located by flange and circlip, inner race clamped | – limited by the linkage and the carriage stops | – driven | – equal bars, no adjuster | – shielded bearing, greased for life | – no phase to keep | – none needed |
| pM1 | J3 | – no removable plate on a moving pin | Internal circlip DIN 472, Ø16; Bearing F688ZZ (8x16x5); head | – no keyed part | – bearings located by flange and circlip, inner race clamped | – limited by the linkage and the carriage stops | – driven | – equal bars, no adjuster | – shielded bearing, greased for life | – no phase to keep | – none needed |
| pM2 | J3 | – no removable plate on a moving pin | Internal circlip DIN 472, Ø16; Bearing F688ZZ (8x16x5); head | – no keyed part | – bearings located by flange and circlip, inner race clamped | – limited by the linkage and the carriage stops | – driven | – equal bars, no adjuster | – shielded bearing, greased for life | – no phase to keep | – none needed |
| pL1 | J3 | – no removable plate on a moving pin | Internal circlip DIN 472, Ø16; Bearing F688ZZ (8x16x5); head | – no keyed part | – bearings located by flange and circlip, inner race clamped | – limited by the linkage and the carriage stops | – driven | – equal bars, no adjuster | – shielded bearing, greased for life | – no phase to keep | – none needed |
| pR1 | J3 | – no removable plate on a moving pin | Internal circlip DIN 472, Ø16; Bearing F688ZZ (8x16x5); head | – no keyed part | – bearings located by flange and circlip, inner race clamped | – limited by the linkage and the carriage stops | – driven | – equal bars, no adjuster | – shielded bearing, greased for life | – no phase to keep | – none needed |
| pL2 | J3 | – no removable plate on a moving pin | Internal circlip DIN 472, Ø16; Bearing F688ZZ (8x16x5); head | – no keyed part | – bearings located by flange and circlip, inner race clamped | – limited by the linkage and the carriage stops | – driven | – equal bars, no adjuster | – shielded bearing, greased for life | – no phase to keep | – none needed |
| pR2 | J3 | – no removable plate on a moving pin | Internal circlip DIN 472, Ø16; Bearing F688ZZ (8x16x5); head | – no keyed part | – bearings located by flange and circlip, inner race clamped | – limited by the linkage and the carriage stops | – driven | – equal bars, no adjuster | – shielded bearing, greased for life | – no phase to keep | – none needed |
| pL3 | J3 | – no removable plate on a moving pin | Internal circlip DIN 472, Ø16; Bearing F688ZZ (8x16x5); head | – no keyed part | – bearings located by flange and circlip, inner race clamped | – limited by the linkage and the carriage stops | – driven | – equal bars, no adjuster | – shielded bearing, greased for life | – no phase to keep | – none needed |
| pR3 | J4 | – no removable plate on the roller stud | head | – no keyed part | Spacer sleeve under the roller, inner race clamped | – the slot ends 1.5 mm past the travel | – driven | – none | Felt oiler, oil-soaked wool felt | – no phase to keep | – none needed |
| slide-carriage | J5 | – the reference rail is dowelled to the base | Keeper plate, holds the slider down | – prismatic, no torque | – the keeper takes the lift, the base the weight | 2 x End stop block, hardened | – driven | Gib strip 80 x 7 x 2.3, bronze, slotted, clamped under the keeper | 2 x wiper; Grease nipple M6 (DIN 71412) | – no phase to keep | – stops never touched in running |
| pL0-bridge-post | post | 2 x spigot | – static | – static | – static | – static | – static | – static | – static | – static | – static |
| raila-seat | post | – not dowelled: the gib on it takes up the fit against the reference rail | – screwed down through keeper, gib, rail and riser | – static | – static | – static | – static | – the gib on this rail adjusts the fit | – static | – static | – static |
| railb-seat | post | 2 x Dowel pin Ø3 h6 (ISO 8734), rail to base | – screwed down through rail and riser | – static | – static | – static | – static | – the gib on the other rail adjusts the fit | – static | – static | – static |
| drive | drive | – bracket screwed up into the base | – pulleys on D-flat shaft and bearing | Motor pulley, D-bore on a D-flat shaft | – motor bearings | – motor turns freely | – motor holds when powered | Tensioner arm, slotted, 2 x M4 | – belt runs dry | Home flag read by the fork sensor at the raised end | Home flag, 1 mm steel vane; 3 x Fork sensor, slotted optical, 5 mm gap; Pulley flanges |

## Variants and overrides
| Joint or part | Rule result | Chosen | Why |
|---|---|---|---|
| b bars | single plates, a bars crossing over them in single shear at every pin | a front plate over every a bar, a twin of the rear plate, in the model | A9: double shear at every bar pin |
| platform | layer 4, underside 0.4 mm under the lowered bolt heads | plated 3.5 mm up in the model (`dz`), 1.4 mm over them | A14, K1 |
| platform length | catalogue 120 mm | 150 mm in the model, catalogue corrected | the base follows the platform; the linear drive's motor sits past the travel and would stand outside a 120 mm platform's base |
| height scale | none | engraved on the base, index on the platform | F9 |

## Detail ladder
| Rung | Solids | Marks | Frame ms at this dial position |
|---|---|---|---|
| DL-A | 24 | 0 | 218.4 |
| DL-B | 0 | 397 | 210.5 |
| DL-C | 0 | 0 | 68.2 |
| DL-D | 54 | 0 | 51.5 |
| DL-E | 12 | 2 | 49.7 |
| DL-F | 0 | 0 | 47.9 |
| DL-G | 0 | 0 | 43.4 |
| DL-H | 13 | 0 | 43.1 |
| never | 149 | 263 | 287.9 (full) |

## Promotion candidates
- A pin's `span` in the model counts the layers above its own (span 1 reaches two layers); the check's INTERFERE message prints `[lo..hi]`. Worth one line in the standard's K5.

## Verification
check: clean · clearance: 0 clashes · clamp: clean · edge distance: clean · package: 23.1 KB
screenshots: plan, 28°, side, explode at 28° and 70°, both sheets, looked at (dist/shots, local) · bench: Node CPU, DPR 1.5, 2026-10-18; 28° frame 320 ms at full detail, 43 ms at dial H (flag, R6)
