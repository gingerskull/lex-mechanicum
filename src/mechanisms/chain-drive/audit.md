# Audit: Chain drive (chain-drive)
standard: 2.12 · date: 2026-10-20 · result: pass · detail: full · pass: build

## Summary
PASS 113 · FAIL 0 · N/A 15 · open: none

## Requirements
| Id | Status | Evidence / action |
|---|---|---|
| S1 | PASS | DATA · the standard carries version 2.12 and its changelog |
| S2 | PASS | HAND · header with standard, date, result, detail, pass |
| S3 | PASS | AUTO · tools/conformance reads this header and runs in npm run check |
| S4 | PASS | SITE · #137 holds only this mechanism's decisions and open items |
| P1 | PASS | DATA · record complete; model.ts, polish.ts, audit.md present |
| P2 | PASS | DATA · catalogue validator clean |
| P3 | PASS | DATA / SITE · ratio (reduction, low, 2:1 default), offset parallel axes, continuous output, backdrivable, other names, family, motion, level, dof and the motorised drive |
| P4 | PASS | DATA · tags grouped Function, Property, Application, keywords underneath |
| P5 | PASS | DATA · motion, forces, benefits, limits; four uses with one line each |
| P6 | PASS | DATA · Wikipedia, ASME B29.1, Tsubaki guide, Britannica; three videos and a photo page; the real-world video checked (oEmbed: it exists, a chain-driven live roller conveyor at work, real footage), the three media videos exist too |
| P7 | PASS | HAND / SITE · no prose in model.ts or polish.ts; lint-style clean |
| P8 | PASS | SITE · no parts list, build or joint sections on the page |
| P9 | PASS | HAND · both sprockets turn the same way, the driven at half the driver's speed (plot slope 0.5), the chain advancing one pitch per tooth; the chordal ripple the text names (2.2 % of speed on 15 teeth) is under 0.05 mm of chain position, too small to draw, and the model carries the mean speed (code comment) |
| P10 | PASS | HAND · chain speed on the driver's pitch circle, input and output spin, tight and slack side lines on the spans, driven angle plot (slope 0.5); no traced path: no point of the drive closes a path in one cycle |
| P11 | PASS | DATA · plain, short sentences, no em dashes, mm and degrees |
| K1 | PASS | HAND · check: max link error 0.0e+0 mm; pitch circles, centre distance, chain path and travel are the model's; the rollers sit within 0.35 mm of their seats on the driver and 0.25 mm on the driven sprocket over five turns (no creep: J12 conveys the chain on a path exactly 62 pitches long); the rules convey the chain and build the hardware, the polish adds spokes only |
| K2 | PASS | HAND · check: finite, continuous, periodic over 720 samples |
| K3 | PASS | HAND · custom (two ISO 606 sprockets, outlines from the model's tooth form, tooth counts declared), caps; at placement with spin |
| K4 | PASS | HAND · roles driver (driver sprocket), output (driven sprocket), bearing (rollers), hw (link plates), link (idler), pin; accent on the input cap pO1 only |
| K5 | PASS | HAND · check clean: sprockets on layer 0, 7 mm thick, rollers the sprockets' width, plates outside them; ground pivots layer -1, radius 7 |
| K6 | PASS | DATA · the catalogue's 62 links fix the centres: C 248.5 mm, `centresFor` on the pitch circles (the catalogue's 254 mm, 20 pitches, would need 62.8 links; its own relation says round to 62 and adjust C); pitch circles 61.1 and 121.4 mm as listed; roller Ø8.5 as listed; the chain's travel is the mean chain speed (one pitch per tooth); all said in a code comment |
| K7 | PASS | HAND · input rotary on the driver sprocket |
| D1 | PASS | HAND · sprockets with the ISO 606 tooth form (roller seats, convex flanks, a tip land) and an engraved ring, keyed bores; the driven sprocket hub and spokes; the chain as rollers between inner and outer link plates; bridges and the tensioner arm shaped as parts |
| D2 | PASS | HAND · bosses round every bore; spokes only in the large sprocket; the arm's boss over the idler stud and an ear at each post |
| D3 | PASS | STYLE · roles told apart by pattern and tone in both sheets |
| D4 | PASS | AUTO · base corners from the form style, feet concentric with the corner arcs |
| D5 | PASS | AUTO / HAND · one bridge per shaft on two spigoted posts; the idler on one arm on two posts |
| D6 | PASS | HAND / STYLE · bridges, arm and hardware read quieter than the sprockets and the chain |
| D8 | N/A | AUTO / HAND · every part lies on z: the drive works in one plane |
| D9 | PASS | AUTO / HAND · 62 rollers and 124 link plates conveyed along the pitch path by the solved travel (J12 chain form); nothing deforms or stretches |
| D7 | PASS | HAND · sprockets, chain, bridges, arm and base carry only load shape and manufacturing marks |
| A1 | PASS | AUTO · pO1 J2, pO2 J2, flex-chain-0 J12 |
| A2 | PASS | AUTO · both fixed pins carry a keyed sprocket: live shafts in housings behind the base |
| A3 | PASS | AUTO · Ø10 input and Ø12 output from the keyed bores; 6800 / 6801 sealed pairs in the housings, F6800 / F6801 floating in the bridges |
| A4 | PASS | AUTO · stepped shafts with keyways, shoulders, grooves and chamfered ends |
| A5 | PASS | AUTO · feather keys 3 x 3 on Ø10 and 4 x 4 on Ø12 |
| A6 | PASS | AUTO · bridge posts Ø10 spigoted and screwed from both sides; no standoffs under the chain; the arm's posts screwed from both sides |
| A7 | PASS | AUTO · 8 mm base, counterbored corners, feet, front scale, clearance holes for both live shafts; the base drops under the chain's lower plates |
| A8 | PASS | AUTO · every head has its shank; holes cut by stage 3 |
| A9 | PASS | HAND · the chain pulls both shafts sideways and nothing sweeps over them: each runs up into a floating bearing in its own bridge (the rules' straddle for shafts joined by a chain); the idler stud is single shear on the arm with a short overhang (the idler sits right under the arm) |
| A10 | PASS | HAND · sprockets, chain and idler share one plane; bridges and arm above it, nothing stacked to clear |
| A11 | PASS | HAND · chain pull to each sprocket, key, shaft, housing pair and bridge, base; the idler's load to its stud, arm, two posts, base |
| A12 | PASS | AUTO · clamp check clean |
| A13 | PASS | AUTO / HAND · every solid named with catalogue sizes, sets counted |
| A14 | PASS | HAND · bridge posts outside the chain and the sprocket sweeps; the arm posts off the slack span; clearance 0 |
| A15 | PASS | AUTO · clearance: 0 clashes over the cycle |
| A16 | PASS | HAND · a note and a badge on every joint; five build rules |
| A17 | PASS | HAND · housings and shafts from below; sprockets keyed on; chain over both sprockets with the arm slack, closed by its connecting link; bridges, then the idler arm set and clamped; heads last; the drive from below |
| E1 | PASS | AUTO · one level per solid |
| E2 | PASS | AUTO · screws, shafts, the idler stud with its nut and bought units are groups |
| E3 | PASS | AUTO · bridge and arm screws upward, post and housing screws downward |
| E4 | PASS | HAND · bridges and the arm (with its stud, spacer and nut) come off first, then the chain, idler and sprockets; housings and drive down |
| E5 | PASS | AUTO · bearings and circlips stay in their parts |
| E6 | PASS | AUTO · motor with its bracket; the chain's rollers and plates stay in the sprockets' plane |
| E7 | PASS | AUTO · spacers midway |
| E8 | PASS | AUTO · keyed sprockets keep their order on their shafts |
| E9 | PASS | HAND · readable at full explode at 28° and 88°: bridges and arm lift clear, the chain plane stays whole; nothing leaves the frame |
| J1 | N/A | no dead axle |
| J2 | PASS | AUTO · both shafts: housing with two sealed bearings, sleeve, wave washer, circlips, dowels; keyed sprocket, thrust washer, end retainer; straddle bearing in a bridge (A9) |
| J3 | N/A | no moving pin |
| J4 | N/A | no slot |
| J5 | N/A | no slide |
| J6 | N/A | no gear mesh: the sprockets carry tooth counts and no module |
| J7 | N/A | no cam |
| J8 | PASS | AUTO · the motor belt only (flanges, slotted bracket); the roller chain is J12 |
| J9 | N/A | no crossed-axis mesh |
| J10 | N/A | no shaft in plan |
| J12 | PASS | AUTO / HAND · the declared roller chain: 62 rollers with inner and outer link plates conveyed round a path exactly 62 pitches long by the travel, a 9-tooth ISO 606 idler sprocket on the rollers' line, phased and geared to them, on its slotted arm on two posts, greased; no guard (by hand: open bench, a guard would hide the working zone) |
| J13 | N/A | no compliant joint |
| J11 | N/A | no screw |
| F1 | PASS | AUTO · housings dowelled; bridges on spigots |
| F2 | PASS | AUTO · housing circlips, end retainers, top circlips over the sprockets; the idler held by a circlip on its stud and the arm's nyloc |
| F3 | PASS | AUTO · feather keys in both sprockets; the motor pulley's set screws |
| F4 | PASS | AUTO · thrust washers under both sprockets, wave washers in the housings; the link plates straddle the teeth |
| F5 | N/A | continuous rotation, nothing to over-travel |
| F6 | N/A | driven continuously; no rest position to hold |
| F7 | PASS | AUTO · idler arm slotted across the slack span, clamped by two M5 screws on its posts (J12); motor bracket slotted (J8) |
| F8 | PASS | AUTO / HAND · the chain greased (J12 note); sealed and shielded bearings greased for life |
| F9 | N/A | no phase to keep: any roller may meet any tooth, the drive only carries speed |
| F10 | PASS | AUTO / HAND · home flag and fork sensor on the input, leads to the terminal block; the chain needs no flange: the link plates straddle the teeth |
| M1 | PASS | AUTO · edge breaks on every top face |
| M2 | PASS | HAND · the driven sprocket starts and stops with the motor: hub and six spokes inside the seat roots; the 61 mm driver stays a solid web |
| M3 | PASS | AUTO · bore entry chamfers on every seat and through hole |
| M4 | PASS | AUTO / HAND · counterbored base corners; washers under the arm's clamp screws on the slots |
| M5 | PASS | AUTO / HAND · filleted spoke windows; full-radius slots in the arm |
| M6 | PASS | AUTO · edge distance and walls clean |
| M7 | PASS | HAND · the bridges' crotches filleted (H.bridge); the arm a hull with no inside corner |
| M8 | PASS | AUTO · undercut where the idler stud's M8 thread meets its shoulder |
| M9 | PASS | AUTO / HAND · M5 screws into steel standoffs, the stud through the arm to a nut; standard lengths |
| M10 | PASS | AUTO / HAND · materials named on every solid; rollers case hardened, plates through hardened |
| M11 | PASS | AUTO · centre holes and chamfered ends on the shafts |
| M12 | PASS | HAND · every head reachable from above or below; bearings pressed out past their circlips |
| M13 | PASS | AUTO · threadlocker or nyloc on every threaded part |
| M14 | N/A | no sliding contact: the rollers roll into their seats |
| V1 | PASS | AUTO · pancake outrunner Ø50 x 18 under the base, GT2 32:16 |
| V2 | PASS | AUTO · one-piece bracket, flange screws up into the base |
| V3 | PASS | AUTO / HAND · chain and sprockets clear of feet and housings; clearance 0 |
| V4 | PASS | AUTO · flanges, slotted bracket |
| V5 | PASS | AUTO · rotary: belt to the input pulley on the driver's shaft |
| V6 | PASS | AUTO · home flag on the input hub, fork sensor, leads to the terminal block, one P-clip |
| L1 | PASS | STYLE · lint-style clean |
| L2 | PASS | HAND · the model and polish carry geometry, roles, marks and materials only |
| L3 | PASS | HAND · driver, output, bearing (rollers), hw (plates), link (idler), ground, hardware hw |
| L4 | PASS | HAND / STYLE · accent on the input cap only, with the forces |
| L5 | PASS | AUTO / HAND · bearings, screws and the stud are real solids in real holes; the rollers show as hidden lines under the plates |
| L6 | PASS | AUTO · depth order right at plan, 28°, side and explode |
| L7 | PASS | STYLE · tilt 0° to 88°, no shear |
| L8 | PASS | AUTO / HAND · scale and the sprockets' engraved rings are marks |
| R1 | PASS | HAND · no inline shapes in the polish or the model: the sprockets are `P.sprocket` (ISO 606); chain, idler set and straddle bridges from the rules; spokes from `H.spokes` |
| R2 | PASS | HAND · threads M3, M5, M8; joints Ø10, 12; bearings 6800, 6801 and their flanged versions |
| R3 | PASS | AUTO · housings, bridges and drive from their subassemblies |
| R4 | PASS | AUTO · package 35.3 KB |
| R5 | PASS | HAND · states only what differs (spokes, a note, build rules), no sampling; polish under 1 ms |
| R6 | PASS | FLAG · browser bench, DPR 1.5: plan 3.2, 28° 3.82, side 3.35, explode 70° 4.15 ms; setup 17.3 ms; under every target |
| R7 | PASS | HAND · model.ts + polish.ts 6.3 KB |
| R8 | PASS | AUTO / SITE · pre-rendered thumbnails; the stage draws on change only |
| DL1 | PASS | AUTO / HAND · every solid and mark on a rung; the polish moves nothing |
| DL2 | PASS | HAND · default dial full |
| DL3 | PASS | AUTO · DL-D drawn when exploded, DL-B skipped at side elevation |
| DL4 | PASS | SITE · adaptive dial and the detail entry in the title block |
| DL5 | PASS | FLAG · rung counts and frame times in the detail ladder below |
| Q1 | PASS | check, clamp and edge distance clean |
| Q2 | PASS | 0 clashes |
| Q3 | PASS | package written, 35.3 KB; site build not run in the worktree (built on the family branch) |
| Q4 | PASS | plan, 28°, side, each assembled and fully exploded in the light sheet, 28° in the dark sheet, looked at (dist/shots-chain-drive, local) |
| Q5 | PASS | browser bench; no flag |
| Q6 | PASS | every row judged; no FAIL |
| Q7 | PASS | conformance: chain-drive at 2.12, pass |

## Joints
| Joint | Type | F1 locate | F2 retain | F3 torque | F4 thrust | F5 limit | F6 hold | F7 adjust | F8 lube | F9 timing | F10 protect |
|---|---|---|---|---|---|---|---|---|---|---|---|
| pO1 | J2 | 2 x Dowel pin Ø3 x 10 h6, housing to base | 3 x Internal circlip DIN 472, Ø19; Socket head M5 x 10 (ISO 4762), into the shaft end; External circlip DIN 471, Ø10; Bearing F6800ZZ (10x19x5), floating | Feather key 3 x 3 x 7 (DIN 6885) | Wave washer 14.5x18.8, spring steel; Thrust washer 10.2x16, bronze | – continuous rotation | – driven | – fixed centre: the chain is tensioned at the idler | – sealed and shielded bearings, greased for life | – no phase to keep | – home flag (drive) |
| pO2 | J2 | 2 x Dowel pin Ø3 x 10 h6, housing to base | 3 x Internal circlip DIN 472, Ø21; Shaft collar 12x22, set screw; External circlip DIN 471, Ø12; Bearing F6801ZZ (12x21x5), floating | Feather key 4 x 4 x 7 (DIN 6885) | Wave washer 16.5x20.8, spring steel; Thrust washer 12.2x18, bronze | – continuous rotation | – driven | – fixed centre: the chain is tensioned at the idler | – sealed and shielded bearings, greased for life | – no phase to keep | – none needed |
| flex-chain-0 | J12 | – the idler arm is set on its slots, not located | External circlip DIN 471, Ø10; Nyloc nut M8 (DIN 985) | – the rollers drive in the tooth gaps | – the link plates straddle the teeth | – continuous rotation | – driven | Tensioner arm, steel, slotted across the span for the take-up; Idler sprocket, 9 teeth, ISO 606, on a sealed bearing | – the chain greased; the idler bearing sealed | – no phase to keep | – no guard: open bench |
| drive | drive | – bracket screwed up into the base | – pulleys on keyed and D-flat shafts | – input pulley keyed, motor pulley D-bore | – motor bearings | – motor turns freely | – motor holds when powered | bracket | – belt runs dry | – home flag read by the fork sensor | Home flag, 1 mm steel vane; 3 x Fork sensor, slotted optical, 5 mm gap; Pulley flanges |
| pO1-bridge-post | post | 2 x spigot | – static | – static | – static | – static | – static | – static | – static | – static | – static |
| pO2-bridge-post | post | 2 x spigot | – static | – static | – static | – static | – static | – static | – static | – static | – static |

## Variants and overrides
| Joint or part | Rule result | Chosen | Why |
|---|---|---|---|
| chain note | the rule's | a sentence appended: no guard | J8: a guard only if see-through; the bench is open and a guard would hide the working zone |
| driven sprocket | plain web | hub and six spokes | M2 |
| centre distance | catalogue 254 mm | 248.5 mm, `centresFor` for 62 links | K6: a whole number of links |

## Detail ladder
| Rung | Solids | Marks | Frame ms at this dial position |
|---|---|---|---|
| DL-A | 16 | 0 | 3.72 |
| DL-B | 0 | 215 | 3.12 |
| DL-C | 0 | 0 | 2.82 |
| DL-D | 20 | 0 | 3.00 |
| DL-E | 8 | 0 | 2.66 |
| DL-F | 0 | 0 | 2.62 |
| DL-G | 0 | 0 | 2.10 |
| DL-H | 16 | 0 | 1.92 |
| never | 289 | 209 | 3.83 (full) |

## Promotion candidates
- none: `P.sprocket`, the chain path exactly N pitches long, the whole-tooth idler sprocket and the chain's travel at z1·p / 2π were promoted in standard 2.12.

## Verification
check: clean · clearance: 0 clashes · clamp: clean · edge distance: clean · package: 35.3 KB
screenshots: plan, 28°, side, each assembled and fully exploded, light sheet; 28° in the dark sheet; looked at (dist/shots-chain-drive, local) · bench: browser, RTX 5090, DPR 1.5, 2026-10-20; 28° frame 3.82 ms at full detail, no flag
