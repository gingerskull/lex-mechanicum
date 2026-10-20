# Audit: Helical gear pair (helical-gears)
standard: 2.14 · date: 2026-10-20 · result: pass · detail: full · pass: build

## Summary
PASS 113 · FAIL 0 · N/A 15 · open: none

## Requirements
| Id | Status | Evidence / action |
|---|---|---|
| S1 | PASS | DATA · the standard carries version 2.11 and its changelog |
| S2 | PASS | HAND · header with standard, date, result, detail, pass |
| S3 | PASS | AUTO · tools/conformance reads this header and runs in npm run check |
| S4 | PASS | SITE · #108 holds only this mechanism's decisions and open items |
| P1 | PASS | DATA · record complete; model.ts, polish.ts, audit.md present |
| P2 | PASS | DATA · catalogue validator clean |
| P3 | PASS | DATA / SITE · ratio (reduction 2:1), offset parallel axes, output character, backdrivable, other names, family, motion, level, dof and the motorised drive |
| P4 | PASS | DATA · tags grouped Function, Property, Application, keywords underneath |
| P5 | PASS | DATA · motion, forces, benefits, limits; three uses with one line each |
| P6 | PASS | DATA · two Wikipedia pages and two SDP/SI engineering guides; two videos, a photo page; two real-world videos |
| P7 | PASS | HAND / SITE · no prose in model.ts or polish.ts; lint clean |
| P8 | PASS | SITE · no parts list, build or joint sections on the page |
| P9 | PASS | HAND · solve(): the gear turns half as fast the other way (17:34), centre distance 81.41 from mn (z1 + z2) / (2 cos β); teeth twisted at 20°, right hand on the pinion, left hand on the gear, as the text says; the thrust Ft tan β is in the notes (it runs along the shafts, out of the plan) |
| P10 | PASS | HAND · velocity of a pinion pitch point, input and output spin, the tangential tooth force at the pitch point, the transverse pressure angle 21.2° on the line of action, gear angle plot (slope -0.5). No overlay can draw the axial thrust: it runs along z (FLAG, see Promotion candidates) |
| P11 | PASS | DATA · plain, short sentences, no em dashes, mm and degrees |
| K1 | PASS | HAND · check: max link error 0.0e+0 mm; transverse profiles, helix leads, pitch circles and centre distance are the model's; hubs, bearings and the flange fit round them |
| K2 | PASS | HAND · check: finite, continuous, periodic over 720 samples |
| K3 | PASS | HAND · two P.gear parts at the transverse module with `helix` (src/core/spatial.ts helixLead), two caps; at placement with spin |
| K4 | PASS | HAND · roles driver, output, pin; accent only on the pinion's cap p1, the input |
| K5 | PASS | HAND · check: no INTERFERE, OVERLAP or WARN; both gears on layer 0, 30 thick (the face width), the caps spanning them |
| K6 | PASS | DATA · z 17 and 34, mn 3, β 20° with opposite hands, αn 20°, mt 3.193, cd 81.41, b 30: as the catalogue. The transverse profile is drawn by the part family's 20° involute, not at αt 21.17° (code comment; the difference does not show at this scale). The gear is phased half a tooth so the teeth interleave on the line of centres; the shafts are the base's z axes (the catalogue's O1, O2 on x) |
| K7 | PASS | HAND · input rotary on the pinion, as the catalogue |
| D1 | PASS | HAND · involute teeth twisted along the face by their helix, keyed bores, hubs |
| D2 | PASS | HAND · both gears solid blanks: the gear runs continuously in one direction, the hubs sized round the keys |
| D3 | PASS | STYLE · roles told apart by pattern and tone in both sheets |
| D4 | PASS | AUTO · base corners and feet concentric with the corner arcs |
| D5 | PASS | AUTO / HAND · one bridge over both shafts on two spigoted posts, one motor bracket |
| D6 | PASS | HAND / STYLE · bridge drawn see-through over the mesh; housings and bracket quieter than the gears |
| D8 | PASS | AUTO / HAND · both gears on z with `helix` (+468 mm right hand, -937 mm left hand), twist 23° and 11.5° over the face, under a quarter turn so drawn twisted; check reports no AXIS |
| D9 | N/A | no member changes shape |
| D7 | PASS | HAND · gears, bridge, housings and bracket carry only load shape and manufacturing marks |
| A1 | PASS | AUTO · p1 J2, p2 J2, mesh-pinion-gear J6 (parallel, read from the parts at the transverse module) |
| A2 | PASS | AUTO · p1 live (the accent input), p2 live (keyed gear), the parallel mesh J6 |
| A3 | PASS | AUTO · Ø10 pinion shaft, Ø12 gear shaft; 68xx-size bearings in the housings and the bridge |
| A4 | PASS | AUTO · stepped keyed shafts, chamfered ends, circlip grooves |
| A5 | PASS | AUTO · feather keys 3 x 3 on Ø10, 4 x 4 on Ø12 |
| A6 | N/A | no floating fixed plate besides the bridge, which stands on spigoted Ø10 standoffs |
| A7 | PASS | AUTO · 8 mm base, counterbored corners, feet, front scale, clearance holes for both shafts |
| A8 | PASS | AUTO · every head has its shank; holes cut by stage 3 |
| A9 | PASS | AUTO / HAND · nothing sweeps over the gears: both shafts straddle mounted, the housing pair below locating, a floating flanged bearing in the bridge above (J2 straddle) |
| A10 | PASS | HAND · both gears on one plane, the bridge above, housings and drive under the base |
| A11 | PASS | HAND · each gear to keyed shaft to housing (screwed, dowelled) and bridge (screwed, spigoted); the axial thrust through hub, circlip or thrust washer to the angular-contact pair in the housing; motor to bracket to base |
| A12 | PASS | AUTO · clamp check clean |
| A13 | PASS | AUTO / HAND · 142 solids, 69 unnamed (further items of a listed set); the housing bearings named as angular-contact 71800 and 71801 CD (variant) |
| A14 | PASS | HAND · bridge posts on the open side of the mesh, clear of both tip circles; sensor and bracket under the base; clearance 0 |
| A15 | PASS | AUTO · clearance: 0 clashes over the cycle |
| A16 | PASS | HAND · 5 build rules; every joint has a note and a badge; the mesh note names the helical form and where the thrust goes |
| A17 | PASS | HAND · housings and shafts from below, thrust washers and gears, hubs, circlips, bridge with its bearings and eccentric, output flange; pulley, motor and bracket, belt; every screw reachable |
| E1 | PASS | AUTO · every solid has one explode level; levels -8 to 2.5 |
| E2 | PASS | AUTO · 35 rigid groups; screws, shafts and the motor pulley set each one body |
| E3 | PASS | AUTO · bridge and eccentric screws upward, housing screws downward |
| E4 | PASS | HAND · the flange and the bridge come off first, then the gears, the housings and the drive below the base |
| E5 | PASS | AUTO · bearings and circlips stay in the housings and the bridge |
| E6 | PASS | AUTO · motor and bracket one level; the belt in the pulley plane |
| E7 | PASS | AUTO · spacers midway |
| E8 | PASS | AUTO · gear, key, hub and circlip keep their order on each shaft |
| E9 | PASS | HAND · readable at full explode at 28° and 88°: nothing inside another part, nothing leaves the frame |
| J1 | N/A | no dead axle |
| J2 | PASS | AUTO · housing with two sealed bearings, sleeve, wave washer, circlips, screwed and dowelled; keyed shaft; straddle bridge with a floating flanged bearing; the output's housing and top bearing on eccentrics |
| J3 | N/A | no moving pin |
| J4 | N/A | no pin in a slot |
| J5 | N/A | no slide |
| J6 | PASS | AUTO / HAND · hubs with set screws on both keyed gears (F3), eccentric bushings under the output housing and at the top of its shaft (F7), thrust washers and circlips (F2, F4), timing marks (F9); the mesh note renamed helical in the polish |
| J7 | N/A | no cam |
| J8 | PASS | AUTO · motor pulley flanged, the bracket slotted for tension |
| J9 | N/A | the mesh is parallel (J6); no crossed mesh |
| J10 | N/A | no shaft in plan |
| J12 | N/A | no flexible member besides the drive belt (J8) |
| J13 | N/A | no compliant joint |
| J11 | N/A | no screw |
| F1 | PASS | AUTO · housings dowelled; bridge spigoted |
| F2 | PASS | AUTO · bearings on circlips; circlips over both hubs; the input shaft end screw and washer; the output flange held by a countersunk screw into the shaft end |
| F3 | PASS | AUTO · feather keys in both gears and the flange; hubs with set screws; the input pulley on a hub with two set screws at 90° |
| F4 | PASS | AUTO / HAND · the mesh pushes along the shafts (Ft tan β): forward, the pinion up through its hub and circlip into the shaft, the gear down onto its bronze thrust washer; reversed, the other way. Each housing pair is an opposed pair of angular-contact bearings (71800, 71801 CD) spring preloaded by the wave washer, so the located end takes it both ways (HAND variant) |
| F5 | N/A | both shafts turn fully, nothing to over-travel |
| F6 | N/A | driven through the mesh; no rest position to hold |
| F7 | PASS | AUTO · backlash by the eccentric bushings at both ends of the output shaft, set together so the shafts stay parallel; belt tension by the bracket slots |
| F8 | PASS | AUTO · open teeth greased at assembly (mesh note); sealed and shielded bearings |
| F9 | PASS | AUTO · timing marks at the mesh on both gears; the model phase interleaves the teeth on the line of centres |
| F10 | PASS | AUTO · motor pulley flanges, home flag and fork sensor; no slip clutch: nothing in a single mesh can jam |
| M1 | PASS | AUTO · edge breaks on every top face |
| M2 | PASS | HAND · both blanks solid: the gear runs one way continuously, and arms would be twisted with the teeth by the helix modifier (see Promotion candidates); hubs on both gears |
| M3 | PASS | AUTO · bore entry chamfers on every seat and through hole |
| M4 | PASS | AUTO / HAND · counterbored housing screws and base corners, countersink for the flange end screw |
| M5 | PASS | AUTO / HAND · bracket and eccentric slots full radius |
| M6 | PASS | AUTO · edge distance and walls clean |
| M7 | PASS | HAND · the bridge is a hull of circles; nothing turns a load corner |
| M8 | PASS | AUTO · thread undercuts on the shaft ends |
| M9 | PASS | AUTO / HAND · standard lengths; housing screws M3, bridge screws M5 into the base |
| M10 | PASS | AUTO / HAND · 142 of 142 solids name a material; gears C45 induction-hardened, bronze thrust washers and eccentrics |
| M11 | PASS | AUTO · centre holes and chamfered ends on the shafts |
| M12 | PASS | HAND · every head reachable; bearings pressed out past their circlips |
| M13 | PASS | AUTO / HAND · 47 threaded, 0 without a locking method |
| M14 | N/A | no sliding wear surface besides the teeth, which are hardened |
| V1 | PASS | AUTO · brushless pancake motor Ø50 x 18 under the base, GT2 32:16 to the input shaft (H.drive) |
| V2 | PASS | AUTO · one-piece bracket, flange screwed up into the base, belt window |
| V3 | PASS | AUTO / HAND · belt and pulleys clear of the housings and feet; clearance 0 |
| V4 | PASS | AUTO · motor pulley flanged, input pulley hub with two set screws at 90°, tension slots |
| V5 | PASS | AUTO · rotary: belt to the input pulley on the pinion shaft |
| V6 | PASS | AUTO · home flag on the input hub, fork sensor on the housing, leads to a terminal block on the base edge, one P-clip |
| L1 | PASS | STYLE · lint-style clean |
| L2 | PASS | HAND · the polish carries names, notes and the output flange only |
| L3 | PASS | HAND · pinion driver, gear and flange output, housings, bridge and bracket ground, hardware hw |
| L4 | PASS | HAND / STYLE · accent on the input only |
| L5 | PASS | AUTO / HAND · bearings, keys and screws are real solids; the bridge drawn see-through over the mesh |
| L6 | PASS | AUTO · depth order right at plan, 28°, side and explode; the twisted teeth slice with their solids |
| L7 | PASS | STYLE · tilt 0° to 88°, no shear |
| L8 | PASS | AUTO / HAND · timing marks are marks |
| R1 | PASS | HAND · everything from the rules and H.outputCoupling; the polish renames the housing bearings and writes notes |
| R2 | PASS | HAND · threads M3, M4, M5, M6; shafts Ø10 and 12; bearings in the 6800 and 6801 envelopes (71800 and 71801 CD angular contact in the housings); GT2 16T and 32T |
| R3 | PASS | AUTO · housings and bridge from their subassemblies |
| R4 | PASS | AUTO · package 25.1 KB |
| R5 | PASS | HAND · states only what differs; no sampling in the polish; polish 1 ms |
| R6 | PASS | FLAG · browser bench: plan 2.46, 28° 2.81, side 2.2, explode 2.38 ms at full detail, setup 9 ms; under the 8 ms frame target, setup under 20 ms |
| R7 | PASS | HAND · model.ts + polish.ts 7.9 KB |
| R8 | PASS | AUTO / SITE · pre-rendered thumbnails; the stage draws on change only |
| DL1 | PASS | AUTO / HAND · every solid and mark on a rung; the polish moves nothing up or down |
| DL2 | PASS | HAND · default dial full |
| DL3 | PASS | AUTO · DL-D drawn when exploded, DL-B skipped at side elevation |
| DL4 | PASS | SITE · adaptive dial and the detail entry in the title block |
| DL5 | PASS | FLAG · rung counts and frame times in the detail ladder below |
| Q1 | PASS | check, clamp and edge distance clean |
| Q2 | PASS | 0 clashes |
| Q3 | PASS | package written, 25.1 KB; page build left to the family branch (registration redone there) |
| Q4 | PASS | plan, 28°, side, each assembled and fully exploded, both sheets (dist/shots-helical-gears) |
| Q5 | PASS | browser bench at DPR 1.5; under target |
| Q6 | PASS | every row judged |
| Q7 | PASS | conformance: helical-gears at 2.11, pass |

## Joints
| Joint | Type | F1 locate | F2 retain | F3 torque | F4 thrust | F5 limit | F6 hold | F7 adjust | F8 lube | F9 timing | F10 protect |
|---|---|---|---|---|---|---|---|---|---|---|---|
| p1 | J2 | 2 x Dowel pin Ø3 x 10 h6, housing to base | 3 x Internal circlip DIN 472, Ø19; External circlip DIN 471, Ø10; Socket head M5 x 10 (ISO 4762), into the shaft end; Bearing F6800ZZ (10x19x5), floating | Feather key 3 x 3 x 30 (DIN 6885) | Wave washer 14.5x18.8, spring steel; Thrust washer 10.2x16, bronze; 2 x Bearing 71800 CD (10x19x5), angular contact, opposed pair | – turns fully | – driven through the belt | – backlash set on the output shaft | – sealed and shielded bearings | – see mesh | – see drive |
| p2 | J2 | 2 x Dowel pin Ø3 x 10 h6, housing to base | 3 x Internal circlip DIN 472, Ø21; External circlip DIN 471, Ø12; Shaft collar 12x22, set screw; Bearing F6801ZZ (12x21x5), floating; Countersunk M6 x 14 (ISO 10642), into the shaft end, flush | Feather key 4 x 4 x 30 (DIN 6885); Feather key 4 x 4 x 6 (DIN 6885) | Wave washer 16.5x20.8, spring steel; Thrust washer 12.2x18, bronze; 2 x Bearing 71801 CD (12x21x5), angular contact, opposed pair | – turns fully | – driven through the mesh | Eccentric bushing Ø28, 0.3 mm offset bore Ø14, flanged; Eccentric bushing Ø27, 0.3 mm offset bore Ø21, flanged, top of the shaft | – sealed and shielded bearings | – see mesh | – none needed |
| mesh-pinion-gear | J6 | – the shafts locate the gears | – circlips over the hubs (p1, p2) | Gear hub Ø22, set screw M3 on the key; 2 x Set screw M3 (DIN 916), threadlocked; Gear hub Ø24, set screw M3 on the key | – the axial thrust Ft tan β: thrust washers under the gears and the angular-contact housing pairs (p1, p2) | – continuous rotation | – driven | Eccentric bushing Ø28, 0.3 mm offset bore Ø14, flanged; Eccentric bushing Ø27, 0.3 mm offset bore Ø21, flanged, top of the shaft | Open teeth, greased at assembly | Helical pinion, 17 teeth, right hand; Helical gear, 34 teeth, left hand | – none needed |
| drive | drive | – bracket screwed up into the base | – pulley hub set screws (p1) | Pulley hub, 2 x M3 set screws at 90° | – motor bearings | – motor turns freely | – motor holds when powered | bracket | – belt runs dry | Home flag read by the fork sensor | Home flag, 1 mm steel vane; 3 x Fork sensor, slotted optical, 5 mm gap; Pulley flanges |
| p1-p2-bridge-post | post | 2 x spigot | – screwed from both sides | – static | – static | – static | – static | – spigot in a slot takes the hole tolerance | – static | – static | – static |

## Variants and overrides
| Joint or part | Rule result | Chosen | Why |
|---|---|---|---|
| p1, p2 housings | two sealed deep-groove bearings (6800, 6801) | an opposed pair of angular-contact bearings of the same envelope (71800 CD, 71801 CD), spring preloaded by the housing's wave washer | the helical mesh pushes along both shafts, Fa = Ft tan 20° (36% of the tooth force), one way driving and the other way reversing or braking (F4) |
| p2 | shaft ends in its bridge bearing | runs on above the bridge to a keyed output flange with 4 x M4 tapped holes (H.outputCoupling) | where the load is coupled, as on the spur pair |
| mesh-pinion-gear note | "Spur mesh" | "Helical mesh", hands, overlap ratio and where the thrust goes | the J6 note does not know the form (see Promotion candidates) |
| gear | solid web | solid web kept | runs one way continuously; arms would be twisted with the teeth by the helix modifier |

## Detail ladder
| Rung | Solids | Marks | Frame ms at this dial position |
|---|---|---|---|
| DL-A | 14 | 0 | 2.48 |
| DL-B | 0 | 169 | 1.79 |
| DL-C | 0 | 0 | 1.69 |
| DL-D | 15 | 0 | 1.64 |
| DL-E | 8 | 2 | 1.82 |
| DL-F | 0 | 0 | 1.62 |
| DL-G | 0 | 0 | 1.37 |
| DL-H | 17 | 0 | 1.23 |
| never | 88 | 163 | 2.79 (full) |

## Promotion candidates
Hand fixes that should become rules or primitives.

- AUTO-TODO, `src/rules/classify.ts` and `src/rules/j6-mesh.ts`: a parallel mesh of two gears carrying `helix` is helical
  (form "helical", or "herringbone" for a double helix). Classify should check the hands are opposite and the leads
  give the same helix angle at the pitch circle (lead1 / d1 = -lead2 / d2), and J6 should write "Helical mesh" with the
  hands and say where the axial thrust goes. Here the polish renames the note. Herringbone (#109) will need the same.
- AUTO-TODO, `src/rules/j2-live-shaft.ts` / `src/hardware/sub/housing.ts`: a live shaft carrying a single-helical gear
  takes an opposed angular-contact pair in its housing (same envelope, 718xx CD), since the mesh thrust reverses with
  the drive. Here the polish renames the bearings. One mechanism so far; promote if a second parallel helical shaft
  appears (gear trains with helical stages).
- Small, `src/core/spatial.ts`: a `helicalOutline(z, mn, beta)` drawing the transverse involute at αt (21.17° here)
  instead of the part family's 20°, for helical, herringbone and crossed helical gears (K6 note in the model).
- Small, renderer (`src/render/world.ts`): `helix` twists the whole outline, holes included, so a spoked helical gear
  would get twisted arms. Twisting only the outer outline (holes straight) would allow hub and arms (M2) on large
  helical wheels.
- Small, overlays (`src/model/types.ts` OverlayItem): no item draws an arrow along z, so the axial thrust the catalogue
  asks for ("an axial thrust arrow on each shaft in opposite directions") cannot be shown; an `axial` item with a z
  extent at a plan point would do it.
- Small, `src/hardware/sub/misc.ts` (`outputCoupling`): the flange name carries a mis-encoded "Ø" ("Ã˜34"), on the
  spur pair too.

## Verification
check: clean · clearance: 0 clashes · clamp: clean · edge distance: clean · package: 25.1 KB
screenshots: plan, 28°, side, each assembled and fully exploded, both sheets; looked at (dist/shots-helical-gears, local) · bench: browser, DPR 1.5, 2026-10-20; 28° frame 2.81 ms at full detail, setup 9 ms, 142 solids, no flag
