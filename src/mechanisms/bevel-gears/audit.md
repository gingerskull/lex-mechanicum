# Audit: Bevel gear pair (bevel-gears)
standard: 2.10 · date: 2026-10-20 · result: pass · detail: full · pass: build

## Summary
PASS 114 · FAIL 0 · N/A 14 · open: none

## Requirements
| Id | Status | Evidence / action |
|---|---|---|
| S1 | PASS | DATA · the standard carries version 2.10 and its changelog |
| S2 | PASS | HAND · header with standard, date, result, detail, pass |
| S3 | PASS | AUTO · tools/conformance reads this header and runs in npm run check |
| S4 | PASS | SITE · #107 holds only this mechanism's decisions and open items |
| P1 | PASS | DATA · record complete; model.ts, polish.ts, audit.md present |
| P2 | PASS | DATA · catalogue validator clean |
| P3 | PASS | DATA / SITE · ratio (reduction 2:1), perpendicular intersecting axes, output character, backdrivable, other names, family, motion, level, dof and the motorised drive |
| P4 | PASS | DATA · tags grouped Function, Property, Application, keywords underneath |
| P5 | PASS | DATA · motion, forces, benefits, limits; three uses with one line each |
| P6 | PASS | DATA · Wikipedia and two engineering guides; two videos, a photo page; one real-world video |
| P7 | PASS | HAND / SITE · no prose in model.ts or polish.ts; lint clean |
| P8 | PASS | SITE · no parts list, build or joint sections on the page |
| P9 | PASS | HAND · solve(): the gear turns half as fast, ratio exact; cone angles 26.57° and 63.43° from the tooth counts, as the text says; both gears pushed away from the apex onto their thrust washers |
| P10 | PASS | HAND · velocity of the pinion's outer pitch point, output spin, the pinion's thrust along its shaft, the pinion pitch cone angle in plan (26.6°), gear angle plot (slope -0.5) |
| P11 | PASS | DATA · plain, short sentences, no em dashes, mm and degrees |
| K1 | PASS | HAND · check: max link error 0.0e+0 mm; cones, back-cone teeth and the apex are the model's; spokes, hub and shims are cut round them |
| K2 | PASS | HAND · check: finite, continuous, periodic over 720 samples |
| K3 | PASS | HAND · two custom gear parts (Tredgold outlines from src/core/spatial.ts) with taper, two caps; at placement with spin |
| K4 | PASS | HAND · roles driver, output, pin; accent only on the pinion's cap pQ, the input |
| K5 | PASS | HAND · check: no INTERFERE, OVERLAP or WARN; the gear on layer 1, the pinion's layer only its explode level (axis x) |
| K6 | PASS | DATA · z 16 and 32, m 4, 20°, Σ 90°, Re 71.55, b 20, apex shared: as the catalogue. The catalogue lays the pinion along x and the gear along y with the apex at the origin; here the base is the plan plane, so the gear lies on it on a z axis and the apex stands over its centre at the pinion's height (code comment). The gear is phased half a tooth so the teeth interleave at the mesh |
| K7 | PASS | HAND · input rotary on the pinion, as the catalogue |
| D1 | PASS | HAND · back-cone teeth on toothed frustums, keyed bores, the gear with hub and six arms |
| D2 | PASS | HAND · rim two modules under the roots, hub 8 mm round the bore, arms 10 mm wide |
| D3 | PASS | STYLE · roles told apart by pattern and tone in both sheets |
| D4 | PASS | AUTO · feet rerun on the grown base, concentric with the corner arcs |
| D5 | PASS | AUTO / HAND · pillow blocks on foot plates, one bridge over the gear shaft, one angle bracket for the motor |
| D6 | PASS | HAND / STYLE · blocks, bridge and bracket read quieter than the gears; the gears show through the bridge |
| D8 | PASS | AUTO / HAND · the pinion on axis x with along, taper the inner end's scale; the gear on z with taper; check reports no AXIS |
| D9 | N/A | no member changes shape |
| D7 | PASS | HAND · gears, blocks, bridge and bracket carry only load shape and manufacturing marks |
| A1 | PASS | AUTO · pG J2, pQ J10, mesh-pinion-gear J9 |
| A2 | PASS | AUTO · pG live (keyed gear), pQ a live shaft in plan (the accent input), the declared bevel mesh J9 |
| A3 | PASS | AUTO · 6801 on the Ø12 gear shaft in the housing and the bridge, 6800 on the Ø10 pinion shaft in the blocks |
| A4 | PASS | AUTO · stepped keyed shafts, chamfered ends, circlip grooves |
| A5 | PASS | AUTO · feather keys 4 x 4 on Ø12 and 3 x 3 on Ø10 |
| A6 | N/A | no floating fixed plate besides the bridge, which stands on spigoted Ø10 standoffs |
| A7 | PASS | AUTO · 8 mm base, counterbored corners, feet, front scale, clearance hole for the gear shaft; the base grows under the outer block (J10) and the drive (V2) |
| A8 | PASS | AUTO · every head has its shank; holes cut by stage 3 |
| A9 | PASS | AUTO / HAND · the pinion overhangs the gear, so both blocks stand behind it 36 mm apart (J10); the gear shaft straddle mounted: housing pair below, floating bearing in the bridge above, its box clear of the pinion (J2 straddle) |
| A10 | PASS | HAND · the gear alone on its plane; the pinion stands out of it on its own axis; the bridge above the gear |
| A11 | PASS | HAND · gear to keyed shaft to housing (screwed, dowelled) and bridge (screwed, spigoted); pinion to keyed shaft to two blocks (screwed, dowelled); motor to bracket to base |
| A12 | PASS | AUTO · clamp check clean |
| A13 | PASS | AUTO / HAND · 125 solids, 64 unnamed (further items of a listed set) |
| A14 | PASS | HAND · bridge posts on the open side of the gear, sensor post between the blocks, bracket clear of the belt; clearance 0 |
| A15 | PASS | AUTO · clearance: 0 clashes over the cycle |
| A16 | PASS | HAND · 5 build rules; no note: none; no badge: none |
| A17 | PASS | HAND · housing and gear shaft from below, gear with shim and thrust washer, bridge; blocks on the base, pinion shaft with collars through them, pinion with shim and thrust washer, end washer and screw; pulley, motor and bracket, belt; every screw reachable |
| E1 | PASS | AUTO · every solid has one explode level; levels -4 to 2.5 |
| E2 | PASS | AUTO · 29 rigid groups; screws, shafts, the motor pulley set and the bracket each one body |
| E3 | PASS | AUTO · bridge, block and bracket screws upward, housing screws downward |
| E4 | PASS | HAND · the bridge and its screws above the gear; the pinion's shaft, blocks and drive lift as one unit, as the shaft in plan comes off with its blocks |
| E5 | PASS | AUTO · bearings and circlips stay in the housing, the blocks and the bridge |
| E6 | PASS | AUTO / HAND · motor and bracket on one level; the belt stays in the pulley plane, on the shaft's level |
| E7 | PASS | AUTO · spacers midway |
| E8 | PASS | AUTO · gear, key and spacer keep their order on the gear shaft; collars, pinion and pulley on the pinion shaft |
| E9 | PASS | HAND · readable at full explode at 28° and 70°: nothing inside another part, nothing leaves the frame |
| J1 | N/A | no dead axle |
| J2 | PASS | AUTO · housing with two sealed bearings, sleeve, wave washer, circlips, screwed and dowelled; keyed shaft; straddle bridge with a floating flanged bearing |
| J3 | N/A | no moving pin |
| J4 | N/A | no pin in a slot |
| J5 | N/A | no slide |
| J6 | N/A | no parallel mesh |
| J7 | N/A | no cam |
| J8 | PASS | AUTO · motor pulley flanged, the bracket's upright slotted for tension |
| J9 | PASS | AUTO · each gear keyed on its shaft; a shim pack at each back face sets the mounting distance (F7); a bronze thrust washer behind each, where the mesh pushes away from the apex (F4); timing marks on tooth 0 of each gear (F9) |
| J10 | PASS | AUTO · two pillow blocks behind the overhung pinion, sealed bearings, located in the nearer by two collars, floating in the other; screwed and dowelled foot plates |
| J12 | N/A | no flexible member |
| J13 | N/A | no compliant joint |
| J11 | N/A | no screw |
| F1 | PASS | AUTO · housing, blocks dowelled; bridge spigoted |
| F2 | PASS | AUTO · bearings on circlips; collars on the pinion shaft; the pinion held by an end washer and a countersunk M4 into the shaft end (J10) |
| F3 | PASS | AUTO · feather keys in both gears; the input pulley on a hub with two set screws |
| F4 | PASS | AUTO · bronze thrust washers behind both gears (J9), the gear's J2 spacer stopping at its washer; wave washer preloading the housing pair; collars locating the pinion shaft |
| F5 | N/A | both shafts turn fully, nothing to over-travel |
| F6 | N/A | driven through the mesh; no rest position to hold |
| F7 | PASS | AUTO / HAND · shim packs at both back faces set the mounting distance and the backlash; belt tension by the bracket's slots |
| F8 | PASS | AUTO / HAND · open teeth greased at assembly (mesh note); sealed and shielded bearings |
| F9 | PASS | AUTO / HAND · timing marks on tooth 0 of each gear; the model's phase puts the marked teeth side by side at the mesh |
| F10 | PASS | AUTO / HAND · motor pulley flanges, home flag and fork sensor; no slip clutch: nothing in a single mesh can jam |
| M1 | PASS | AUTO · edge breaks on every top face |
| M2 | PASS | HAND · hub and six arms in the 32-tooth gear; the pinion solid |
| M3 | PASS | AUTO · bore entry chamfers on every seat and through hole |
| M4 | PASS | AUTO / HAND · counterbored housing screws and base corners, countersink for the pinion's end screw |
| M5 | PASS | AUTO / HAND · arm windows filleted R3, bracket slots full radius |
| M6 | PASS | AUTO · edge distance and walls clean |
| M7 | PASS | HAND · the bridge is a hull of circles; arm roots filleted; the upright's top corners chamfered |
| M8 | PASS | AUTO · thread undercuts on the shaft ends |
| M9 | PASS | AUTO / HAND · standard lengths; block screws M5 into the base |
| M10 | PASS | AUTO / HAND · 125 of 125 solids name a material; cast-iron blocks, aluminium bracket and bridge, bronze thrust washers |
| M11 | PASS | AUTO · centre holes and chamfered ends on the shafts |
| M12 | PASS | HAND · every head reachable; bearings pressed out past their circlips |
| M13 | PASS | AUTO / HAND · 41 threaded, 0 without a locking method |
| M14 | N/A | no sliding wear surface besides the teeth, which are hardened |
| V1 | PASS | AUTO · brushless pancake motor Ø50 x 18, GT2 32:16, beside the pinion's shaft (axis x), its bell turning at the belt ratio (H.drive, rotary input on a shaft in plan) |
| V2 | PASS | AUTO · one angle bracket, a foot on the base and an upright the motor screws to; beside the shaft on the base top, not under it, since the motor's axis lies in plan |
| V3 | PASS | HAND · belt and pulleys clear of the blocks, the bracket and the base; clearance 0 |
| V4 | PASS | AUTO · motor pulley flanged both sides, the input pulley on a hub with two set screws at 90°, slots in the bracket's foot and upright for tension |
| V5 | PASS | HAND · rotary: belt to the input pulley on the pinion's free shaft end, the catalogue's input kept |
| V6 | PASS | AUTO · home flag on the located collar, fork sensor on a post between the blocks, leads to a terminal block on the base edge, one P-clip |
| L1 | PASS | STYLE · lint-style clean |
| L2 | PASS | HAND · the polish carries geometry, roles, marks and materials only |
| L3 | PASS | HAND · pinion and pulleys driver, gear output, blocks, bridge and bracket ground, hardware hw |
| L4 | PASS | HAND / STYLE · accent on the input only |
| L5 | PASS | AUTO / HAND · screws, bearings and shims are real solids in real holes; the gear shows through the bridge |
| L6 | PASS | AUTO · depth order right at plan, 28°, side and explode across the x and z solids |
| L7 | PASS | STYLE · tilt 0° to 88°, no shear |
| L8 | PASS | AUTO / HAND · timing marks are marks |
| R1 | PASS | HAND · bridge, drive, end retainer and base growth from the rules; the polish adds only the spokes (H.spokes) and the notes |
| R2 | PASS | HAND · threads M3, M4, M5; shafts Ø10 and 12; bearings 6800 and 6801; GT2 16T and 32T |
| R3 | PASS | AUTO · housing, pillow blocks and bridge from their subassemblies |
| R4 | PASS | AUTO · package 20 KB |
| R5 | PASS | HAND · states only what differs; no sampling in the polish; polish under 50 ms |
| R6 | PASS | FLAG · browser bench: plan 2.4, 28° 2.77, side 2.3, explode 2.84 ms at full detail, setup 7.8 ms; under the 8 ms target |
| R7 | PASS | HAND · model.ts + polish.ts 5.9 KB |
| R8 | PASS | AUTO / SITE · pre-rendered thumbnails; the stage draws on change only |
| DL1 | PASS | AUTO / HAND · every solid and mark on a rung; the polish moves nothing up or down |
| DL2 | PASS | HAND · default dial full |
| DL3 | PASS | AUTO · DL-D drawn when exploded, DL-B skipped at side elevation |
| DL4 | PASS | SITE · adaptive dial and the detail entry in the title block |
| DL5 | PASS | FLAG · rung counts and frame times in the detail ladder below |
| Q1 | PASS | check, clamp and edge distance clean |
| Q2 | PASS | 0 clashes |
| Q3 | PASS | package written; site build passes in npm run check |
| Q4 | PASS | plan, 28°, side, explode at 28° and 70°, both sheets |
| Q5 | PASS | browser bench at DPR 1.5; under target |
| Q6 | PASS | every row judged |
| Q7 | PASS | conformance: bevel-gears at 2.9, pass |

## Joints
| Joint | Type | F1 locate | F2 retain | F3 torque | F4 thrust | F5 limit | F6 hold | F7 adjust | F8 lube | F9 timing | F10 protect |
|---|---|---|---|---|---|---|---|---|---|---|---|
| pG | J2 | 2 x Dowel pin Ø3 x 10 h6, housing to base | 3 x Internal circlip DIN 472, Ø21; Shaft collar 12x22, set screw; External circlip DIN 471, Ø12; Bearing F6801ZZ (12x21x5), floating | Feather key 4 x 4 x 8.9 (DIN 6885) | Wave washer 16.5x20.8, spring steel; Thrust washer 12.2x18, bronze | – turns fully | – driven through the mesh | – mounting distance by the shim pack (mesh) | – sealed and shielded bearings | – see mesh | – none needed |
| pQ | J10 | 4 x Dowel pin Ø4 x 14 h6, block to base | 2 x Shaft collar Ø10 x Ø20 x 6, set screw M3; End washer Ø16 x 2, steel; Countersunk M4 x 10 (ISO 10642), into the shaft end; 2 x Pillow block, bored for a 6800-2RS | Feather key 3 x 3 x 17.9 (DIN 6885) | 2 x Shaft collar Ø10 x Ø20 x 6, set screw M3 | – turns fully | – driven through the belt | – mounting distance by the shim pack (mesh) | – sealed bearings | – see mesh | – see drive |
| mesh-pinion-gear | J9 | – the shafts locate the gears | – end washer (pQ), circlip over the gear (pG) | – keys (pG, pQ) | Thrust washer 10.2x20, bronze; Thrust washer 12.2x22, bronze | – continuous rotation | – driven | Shim pack Ø10.2 x Ø18, 0.5 mm, sets the pinion's mounting distance; Shim pack Ø12.2 x Ø20, 0.5 mm, sets the gear's mounting distance | Open teeth, greased at assembly | Bevel pinion, 16 teeth; Bevel gear, 32 teeth | – none needed |
| drive | drive | – bracket screwed to the base | – pulley hub set screws | Pulley hub, 2 x M3 set screws at 90° | – motor bearings | – motor turns freely | – motor holds when powered | Motor bracket, one-piece angle, slotted for belt tension | – belt runs dry | Home flag read by the fork sensor | Home flag, 1 mm steel vane; 3 x Fork sensor, slotted optical, 5 mm gap; Pulley flanges |
| pG-bridge-post | post | 2 x spigot | – screwed from both sides | – static | – static | – static | – static | – spigot in a slot takes the hole tolerance | – static | – static | – static |

## Variants and overrides
| Joint or part | Rule result | Chosen | Why |
|---|---|---|---|
| gear | solid web | hub and six arms (H.spokes) | M2 |

## Detail ladder
| Rung | Solids | Marks | Frame ms at this dial position |
|---|---|---|---|
| DL-A | 11 | 0 | 2.41 |
| DL-B | 0 | 208 | 1.89 |
| DL-C | 0 | 0 | 1.88 |
| DL-D | 14 | 0 | 1.62 |
| DL-E | 9 | 2 | 1.57 |
| DL-F | 0 | 0 | 1.66 |
| DL-G | 0 | 0 | 1.47 |
| DL-H | 17 | 0 | 1.28 |
| never | 74 | 138 | 2.98 (full) |

## Promotion candidates
Hand fixes that should become rules or primitives.

- None: the drive, the base growth, the straddle bridge, the spacer at the thrust washer and the end retainer are rules since standard 2.10.

## Verification
check: clean · clearance: 0 clashes · clamp: clean · edge distance: clean · package: 20.1 KB
screenshots: plan, 28°, side, explode at 28° and 70°, both sheets (dist/shots) · bench: browser, DPR 1.5, 2026-10-20; 28° frame 2.77 ms at full detail, under target
