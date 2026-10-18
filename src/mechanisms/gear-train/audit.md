# Audit: Compound gear train (gear-train)
standard: 2.3 · date: 2026-10-18 · result: pass · detail: full · pass: build

## Summary
PASS 113 · FAIL 0 · N/A 8 · open: none

## Requirements
| Id | Status | Evidence / action |
|---|---|---|
| S1 | PASS | DATA · the standard carries version 2.3 and its changelog |
| S2 | PASS | HAND · header with standard, date, result, detail, pass |
| S3 | PASS | AUTO · tools/conformance reads this header |
| S4 | PASS | SITE · #25 holds only this mechanism's decisions and open items |
| P1 | PASS | DATA · record complete; model.ts, polish.ts, audit.md present |
| P2 | PASS | DATA · catalogue validator clean |
| P3 | PASS | DATA / SITE · page shows ratio (reduction, 9:1 product of stages), axes, output character, backdrivable, other names, family, motion, level, dof and the motorised drive |
| P4 | PASS | DATA · tags grouped Function, Property, Application, keywords underneath |
| P5 | PASS | DATA · motion, forces, benefits, limits; three uses with one line each; two real-world videos |
| P6 | PASS | DATA · Wikipedia, KMODDL and a textbook; two videos, two photo pages; the two real-world videos checked live with oEmbed (dial train, compound-gear clock build) and kept |
| P7 | PASS | HAND / SITE · no prose in model.ts or polish.ts |
| P8 | PASS | SITE · no parts list, build or joint sections on the page |
| P9 | PASS | HAND · solve(): 12/36 then 12/36, output turns once per nine input turns in the input's sense, second centre line at 62°; plot slope 1/9 |
| P10 | PASS | HAND · velocity on the input pinion, input and output spin, a line of action per mesh, output angle plot (slope 1/9) |
| P11 | PASS | DATA · plain, short sentences, no em dashes |
| K1 | PASS | HAND · check: max link error 0.0e+0 mm · centres 72 mm apart, second line at 62°; hubs, spokes, bridge and flange are cut round the model's teeth and pitch circles |
| K2 | PASS | HAND · check: finite, continuous, periodic over 720 samples |
| K3 | PASS | HAND · four gears and three caps; placed at points with spin |
| K4 | PASS | HAND · roles driver, link, output, pin; accent only on the input cap pA |
| K5 | PASS | HAND · check: no INTERFERE, OVERLAP or WARN · a and b on layer 0, c and d on layer 1; each mesh within a layer, no overlap |
| K6 | PASS | DATA · m 3, 12/36/12/36, 20°, cd 72, phi 62°, ratio 9, per-mesh phasing: as the catalogue; no undercut drawn on the 12-tooth pinions (code comment) |
| K7 | PASS | HAND · input rotary on a · input rotary on the pinion a |
| D1 | PASS | HAND · involute teeth, keyed bores, hubs with set screws, spoked 36-tooth gears |
| D2 | PASS | HAND · rim two modules under the roots, hub 8 mm round the bore, spokes 8 mm wide |
| D3 | PASS | STYLE · roles told apart by pattern and tone in both sheets |
| D4 | PASS | AUTO · fired: base (1 solid), feet (4 solids) · feet concentric with the corner arcs |
| D5 | PASS | AUTO / HAND · one bridge over the three shafts on spigoted posts |
| D6 | PASS | HAND / STYLE · bridge, eccentrics and screws read quieter than the gears; the gears show through the bridge |
| D7 | PASS | HAND · gears, bridge and flange carry only load shape and manufacturing marks |
| A1 | PASS | AUTO · pA J2, pB J2, pD J2, mesh-a-b J6, mesh-c-d J6; fired: classify (no solids) |
| A2 | PASS | AUTO · pA J2, pB J2, pD J2, mesh-a-b J6, mesh-c-d J6 · three live shafts (input, cluster, output) |
| A3 | PASS | AUTO · fired: classify (no solids) · 6800 on the Ø10 input, 6801 on the Ø12 cluster and output, in housings and bridge |
| A4 | PASS | AUTO · fired: j1-dead-axle (no solids) · stepped keyed shafts with circlip grooves, end retainers below |
| A5 | PASS | AUTO · fired: j2-live-shaft (87 solids) · feather keys on Ø10 and Ø12; the output flange keyed |
| A6 | PASS | AUTO · fired: standoffs (no solids) · no floating plate besides the bridge, on spigoted standoffs |
| A7 | PASS | AUTO · fired: base (1 solid), feet (4 solids) · 8 mm base, counterbored corners, feet, scale, clearance holes for the three shafts |
| A8 | PASS | AUTO · fired: fasteners (stage 3) · every head has its shank; holes cut by stage 3 |
| A9 | PASS | AUTO / HAND · fired: j2-straddle (43 solids) · nothing sweeps over the gears, so all three shafts are straddle mounted: housing below, floating bearing in the bridge above |
| A10 | PASS | HAND · first stage on layer 0, second stage one layer up, bridge above all |
| A11 | PASS | AUTO / HAND · fired: j1-dead-axle (no solids) · gears to keyed shafts to housings (screwed, dowelled) and bridge (screwed, spigot-located) |
| A12 | PASS | AUTO · clamp check clean |
| A13 | PASS | AUTO / HAND · 189 solids, 90 unnamed (further items of a listed set) · every solid carries catalogue sizes; sets counted |
| A14 | PASS | HAND · bridge posts clear of every gear; clearance 0 |
| A15 | PASS | AUTO · clearance: 0 clashes over the cycle |
| A16 | PASS | HAND · 5 build rules; no note: none; no badge: none · a note and badge on every joint, five build rules |
| A17 | PASS | HAND · housings and shafts from below, b with key, sleeve, c with key, d, hubs and circlips, bridge with its bearings and top eccentrics, flange; every screw reachable |
| E1 | PASS | AUTO · every solid has one explode level; levels -8 to 3.5 |
| E2 | PASS | AUTO · 45 rigid groups; fired: explode |
| E3 | PASS | AUTO · fired: explode |
| E4 | PASS | HAND · flange and bridge above the gears: the last part fitted goes furthest |
| E5 | PASS | AUTO · fired: explode |
| E6 | PASS | AUTO · fired: explode |
| E7 | PASS | AUTO · fired: explode |
| E8 | PASS | AUTO · fired: explode · gear, key, sleeve, pinion keep their order on the cluster shaft |
| E9 | PASS | HAND · readable at full explode at 28° and 70° |
| J1 | N/A | AUTO · fired: j1-dead-axle (no solids) · no dead axle |
| J2 | PASS | AUTO · fired: j2-live-shaft (87 solids), j2-straddle (43 solids) · three live shafts: housing with two sealed bearings, sleeve, wave washer, circlips; keyed shafts, end retainers; the input's pulley hub and home flag |
| J3 | N/A | AUTO · fired: j3-moving-pin (no solids) · no moving pin |
| J4 | N/A | AUTO · fired: j4-slot-roller (no solids) · no pin in a slot |
| J5 | N/A | AUTO · fired: j5-slide (no solids) · no slide |
| J6 | PASS | AUTO · fired: j6-mesh (8 solids) · hubs with key and set screw; eccentric bushings for backlash; timing marks at both meshes; thrust washers and retaining rings. The cluster gear's own hub is dropped in the polish (the pinion sits on it) |
| J7 | N/A | AUTO · fired: j7-cam (no solids) · no cam |
| J8 | PASS | AUTO · fired: j8-belt (2 solids) · flanged motor pulley, mount slotted for tension |
| F1 | PASS | AUTO · served at pA, pB, pD, pA-pB-pD-bridge-post; fired: j2-live-shaft (87 solids) · housings dowelled, bridge spigoted |
| F2 | PASS | AUTO · served at pA, pB, pD; fired: j2-live-shaft (87 solids) · housing bearings on circlips; bridge bearings flanged with a circlip below; circlips over hubs; end retainers |
| F3 | PASS | AUTO · served at pA, pB, pD, mesh-a-b, mesh-c-d; fired: j2-live-shaft (87 solids) · feather keys and hub set screws; keyed output flange |
| F4 | PASS | AUTO / HAND · served at pA, pB, pD; fired: j2-live-shaft (87 solids) · bronze thrust washers, wave washers preloading the housings |
| F5 | N/A | AUTO / HAND · served at no joint; fired: j5-slide (no solids), stops (no solids) · all shafts turn fully, nothing to over-travel |
| F6 | N/A | AUTO / HAND · served at no joint; fired: j7-cam (no solids) · driven through the meshes; no rest position |
| F7 | PASS | AUTO / HAND · served at pB, pD, mesh-a-b, mesh-c-d, drive; fired: j6-mesh (8 solids), j5-slide (no solids) · eccentric bushings at the driven shafts set the backlash of each mesh; belt tension at the motor mount |
| F8 | PASS | AUTO · served at no joint; fired: lubrication (no solids) · open gears greased at assembly; sealed and shielded bearings |
| F9 | PASS | AUTO / HAND · served at mesh-a-b, mesh-c-d; fired: timing-marks (no solids) · match marks at the line of centres of both meshes |
| F10 | PASS | AUTO / HAND · served at drive; fired: drive (37 solids) · pulley flanges, home flag and fork sensor; no slip clutch: nothing in a train of two meshes can jam |
| M1 | PASS | AUTO · fired: hardware primitives |
| M2 | PASS | HAND · six spokes in each 36-tooth gear; the pinions solid |
| M3 | PASS | AUTO · fired: j3-moving-pin (no solids), hardware primitives |
| M4 | PASS | AUTO / HAND · fired: base (1 solid), fasteners (stage 3) · counterbored housing screws and base corners, countersink for the end screws |
| M5 | PASS | AUTO / HAND · fired: hardware primitives · spoke windows filleted R3 |
| M6 | PASS | AUTO · edge distance and walls clean |
| M7 | PASS | HAND · bridge is a hull of circles; spoke roots filleted |
| M8 | PASS | AUTO · fired: j1-dead-axle (no solids) · thread undercuts on the shaft ends |
| M9 | PASS | AUTO / HAND · fired: j1-dead-axle (no solids) · standard lengths, engagement per the rule |
| M10 | PASS | AUTO / HAND · 189 of 189 solids name a material |
| M11 | PASS | AUTO · fired: j1-dead-axle (no solids), hardware primitives |
| M12 | PASS | HAND · every head reachable; bearings pressed out past their circlips |
| M13 | PASS | AUTO / HAND · 59 threaded, 0 without a locking method |
| M14 | N/A | AUTO / HAND · fired: j4-slot-roller (no solids) · no sliding wear surface besides the hardened teeth |
| V1 | PASS | AUTO · fired: drive (37 solids) |
| V2 | PASS | AUTO · fired: drive (37 solids) |
| V3 | PASS | AUTO / HAND · fired: drive (37 solids) · belt and pulleys clear of feet and housings; clearance 0 |
| V4 | PASS | AUTO · fired: j8-belt (2 solids) |
| V5 | PASS | AUTO · fired: drive (37 solids) · rotary: belt to the input pulley |
| V6 | PASS | AUTO · fired: drive (37 solids) |
| L1 | PASS | STYLE · lint-style clean |
| L2 | PASS | HAND · the polish carries geometry, roles, marks and materials only |
| L3 | PASS | HAND · pinion driver, cluster link, gear and flange output, bridge ground, hardware hw |
| L4 | PASS | HAND / STYLE · accent on the input only |
| L5 | PASS | AUTO / HAND · fired: see-through · screws, bearings and keys are real solids in real holes |
| L6 | PASS | AUTO · depth order right at plan, 28°, side and explode |
| L7 | PASS | STYLE · tilt 0° to 88° |
| L8 | PASS | AUTO / HAND · match marks and tapped-hole rings are marks |
| R1 | PASS | HAND · the polish reuses H.outputCoupling and H.spokes; the bridge and eccentrics are the rules'; no inline standard part |
| R2 | PASS | HAND · threads M3, M5, M6; joint Ø 10, 12; bearings 6800-2RS (10x19x5), 6801-2RS (12x21x5), F6800ZZ (10x19x5), floating, F6801ZZ (12x21x5), floating · threads M3 to M6; shafts Ø10 and 12; two bearing sizes |
| R3 | PASS | AUTO · fired: hardware primitives |
| R4 | PASS | AUTO · package 28.1 KB |
| R5 | PASS | HAND · states only what differs; rules 0.2 s, polish about 1 ms |
| R6 | PASS | FLAG · FLAG, Node CPU bench (not the browser): 28° 346.9 ms at full detail; 8 ms not reached in Node; browser bench left to David |
| R7 | PASS | HAND · model.ts + polish.ts 6.7 KB |
| R8 | PASS | AUTO / SITE |
| DL1 | PASS | AUTO / HAND · 77 of 189 solids on a dropping rung · the polish moves nothing |
| DL2 | PASS | HAND · model detail full · default dial full |
| DL3 | PASS | AUTO |
| DL4 | PASS | SITE |
| DL5 | PASS | FLAG · FLAG, rung counts and Node frame times in the detail ladder |
| Q1 | PASS | check, clamp and edge distance clean |
| Q2 | PASS | 0 clashes |
| Q3 | PASS | package written, 28.1 KB; site build not checked here · package written, 28.2 KB; site build run by CI |
| Q4 | PASS | local: tools/shot · plan, 28°, side, explode at 28° and 70°, both sheets, via tools/shot |
| Q5 | PASS | local: tools/bench · Node bench; flags under R6 |
| Q6 | PASS | every row judged |
| Q7 | PASS | conformance at 2.3, pass |

## Joints
| Joint | Type | F1 locate | F2 retain | F3 torque | F4 thrust | F5 limit | F6 hold | F7 adjust | F8 lube | F9 timing | F10 protect |
|---|---|---|---|---|---|---|---|---|---|---|---|
| pA | J2 | 2 x Dowel pin Ø3 x 10 h6, housing to base | 3 x Internal circlip DIN 472, Ø19; External circlip DIN 471, Ø10; Socket head M5 x 10 (ISO 4762), into the shaft end; Bearing F6800ZZ (10x19x5), floating | Feather key 3 x 3 x 7 (DIN 6885) | Wave washer 14.5x18.8, spring steel; Thrust washer 10.2x16, bronze | none | none | none | none | none | none |
| pB | J2 | 2 x Dowel pin Ø3 x 10 h6, housing to base | 3 x Internal circlip DIN 472, Ø21; External circlip DIN 471, Ø12; Shaft collar 12x22, set screw; Bearing F6801ZZ (12x21x5), floating | 2 x Feather key 4 x 4 x 7 (DIN 6885) | Wave washer 16.5x20.8, spring steel; Thrust washer 12.2x18, bronze | none | none | Eccentric bushing Ø28, 0.3 mm offset bore Ø14, flanged; Eccentric bushing Ø27, 0.3 mm offset bore Ø21, flanged, top of the shaft | none | none | none |
| pD | J2 | 2 x Dowel pin Ø3 x 10 h6, housing to base | 3 x Internal circlip DIN 472, Ø21; External circlip DIN 471, Ø12; Shaft collar 12x22, set screw; Bearing F6801ZZ (12x21x5), floating; Countersunk M6 x 14 (ISO 10642), into the shaft end, flush | Feather key 4 x 4 x 7 (DIN 6885); Feather key 4 x 4 x 6 (DIN 6885) | Wave washer 16.5x20.8, spring steel; Thrust washer 12.2x18, bronze | none | none | Eccentric bushing Ø28, 0.3 mm offset bore Ø14, flanged; Eccentric bushing Ø27, 0.3 mm offset bore Ø21, flanged, top of the shaft | none | none | none |
| mesh-a-b | J6 | none | none | Gear hub Ø22, set screw M3 on the key; Set screw M3 (DIN 916), threadlocked | none | none | none | Eccentric bushing Ø28, 0.3 mm offset bore Ø14, flanged; Eccentric bushing Ø27, 0.3 mm offset bore Ø21, flanged, top of the shaft | none | Input pinion, 12 teeth; Cluster gear, 36 teeth | none |
| mesh-c-d | J6 | none | none | 2 x Gear hub Ø24, set screw M3 on the key; 2 x Set screw M3 (DIN 916), threadlocked | none | none | none | Eccentric bushing Ø28, 0.3 mm offset bore Ø14, flanged; 2 x Eccentric bushing Ø27, 0.3 mm offset bore Ø21, flanged, top of the shaft | none | Cluster pinion, 12 teeth; Output gear, 36 teeth | none |
| drive | drive | none | none | none | none | none | none | bracket | none | none | Home flag, 1 mm steel vane; 3 x Fork sensor, slotted optical, 5 mm gap; Pulley flanges |
| pA-pB-pD-bridge-post | post | 2 x spigot | none | none | none | none | none | none | none | none | none |

## Variants and overrides
| Joint or part | Rule result | Chosen | Why |
|---|---|---|---|
| b, c (cluster) | hub on every keyed gear, set screw | cluster gear's hub dropped; the pinion sits above it on the same shaft and key | the hub (5 mm) would run into the pinion; a sleeve fills the gap |
| pB shaft, c solids | pinion is its own body | pinion, its key and hub moved to the shaft's body in the polish | b, c and the shaft are one rigid body, so the key and the keyway do not count as a clash |
| pD | shaft ends in its bridge bearing | runs on above the bridge to a keyed output flange with 4 x M4 tapped holes (H.outputCoupling) | where the load is coupled |
| b, d | solid web | hub and six spokes, windows filleted R3 (H.spokes) | M2 |

## Detail ladder
| Rung | Solids | Marks | Frame ms at this dial position |
|---|---|---|---|
| DL-A | 20 | 0 | 281.3 |
| DL-B | 0 | 230 | 286 |
| DL-C | 0 | 0 | 85.4 |
| DL-D | 23 | 0 | 71 |
| DL-E | 8 | 4 | 65.8 |
| DL-F | 0 | 0 | 60.4 |
| DL-G | 0 | 0 | 64.8 |
| DL-H | 26 | 0 | 54.4 |
| never | 112 | 234 | 351.7 (full) |

## Promotion candidates
Hand fixes that should become rules or primitives.

- j6-mesh: a hub is built on every keyed gear, including one with another keyed gear directly above it on the same shaft (a cluster). The hub runs into the upper gear. The rule should skip the hub, or stop it at the upper gear, when a neighbour on the shaft sits within the hub height.
- Cluster body: gears keyed on one shaft under different part ids are separate bodies for the clearance check, so the upper gear's key and hub clash with the shaft or the lower gear. The rules should treat parts that share a live shaft and a spin as one rigid body (done by hand in the polish here).

## Verification
check: clean · clearance: 0 clashes · clamp: clean · edge distance: clean · package: 28.1 KB
screenshots: plan, 28°, side, explode at 28° and 70°, both sheets (to attach to #25) · bench: Node CPU, DPR 1.5, 2026-10-18; 28° frame 346.9 ms at full detail, 54.4 ms at dial H (flag, R6); package 28.2 KB, setup 2.0 ms
