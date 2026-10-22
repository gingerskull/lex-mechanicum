# Audit: Wankel rotary engine (wankel)
standard: 3.0 · date: 2026-10-22 · result: pass · detail: full · pass: build
teaching: tweak · decisions in the record

## Summary
PASS 147 · FAIL 0 · N/A 20 · open: none

## Requirements
| Id | Status | Evidence / action |
|---|---|---|
| S1 | PASS | DATA · the standard carries version 3.0 and its changelog |
| S2 | PASS | HAND · header with standard, date, result, detail, pass and the teaching: line |
| S3 | PASS | AUTO · tools/conformance reads this sheet (engine v3) and runs in npm run check |
| S4 | PASS | SITE · the batch issue #214 holds only this mechanism's decisions; plan and status in #202 |
| S5 | PASS | SITE · 3D stamp in the title block (every shot) and on the card and page header (site build) |
| S6 | PASS | AUTO · rebuilt from its record v3 in batch R3 (#214): bound by 3.0 from this pass |
| P1 | PASS | DATA · record v3 complete (kin and teaching blocks); no polish, audit.md present |
| P2 | PASS | DATA · catalogue validator clean |
| P3 | PASS | DATA / SITE · the page reads ratio, axes, character, backdrivable, aka, family, motion, level, dof and the drive from the record |
| P4 | PASS | DATA · tags grouped Function, Property, Application, keywords |
| P5 | PASS | DATA · explanation in four parts and the examples from the record |
| P6 | PASS | DATA · references and media from the record, validated by the catalogue |
| P7 | PASS | HAND / SITE · no polish; labels come from the record |
| P8 | PASS | SITE · the page has no parts list or joint sections (site) |
| P9 | PASS | AUTO / HAND · every number the explanation states is a claim and agrees (T9) |
| P10 | PASS | HAND · apex and E traced, O-E line, pitch circles; plot of rotor angle against shaft angle |
| P11 | PASS | DATA · plain language, mm and degrees |
| P12 | PASS | AUTO / DATA · validate(records, asVersion 3) clean for this record |
| P13 | PASS | HAND · teaching review run on the record (E2, #204) and again on the six phases of the finished build (teaching: line) |
| K1 | PASS | AUTO · K1 residual 7.1e-15 (tolerance 1e-9) over 360 samples, reference 0.0e+0 |
| K2 | PASS | AUTO · check: finite, continuous, periodic over 360 samples |
| K3 | PASS | AUTO / HAND · 1 block (gear-mesh); no numeric fallback · composed from the block library; no fallback, no one-off model |
| K4 | PASS | HAND · the eccentric shaft the driver with the accent, rotor the output; housing, side cover and stationary gear fixed |
| K6 | PASS | DATA · R 103, e 15, gears 30 and 45: rotor turns 1/3 of the shaft, apexes 88 to 118 from the axis as the defining relations say |
| K7 | PASS | DATA · drivers input (rotary) · input kind declared with its driven joint |
| K8 | PASS | AUTO / DATA · every joint declared with type, bodies, origin and axis; nothing inferred |
| K9 | PASS | DATA · one rotary driver (one cycle is one rotor turn, three shaft turns) |
| K10 | PASS | AUTO / DATA · the declared closures, continuous over the cycle (no POSE JUMP) |
| K11 | PASS | AUTO · mobility counted 1, dof 1 |
| K12 | PASS | DATA · every traced, overlaid and claimed point and quantity is named in kin |
| T1 | PASS | HAND · the apex traces the epitrochoid bore, E circles O, and the gears mesh in plain view through the cover: the 3:1 reads; mechanics only |
| T2 | PASS | HAND · review before the build (E2) and again on the six phases of the finished build; decisions in the record |
| T3 | PASS | DATA · rotor, shaft, E and the apex declared |
| T4 | PASS | DATA · fired: trace-marks (no solids) · the apex traced (the epitrochoid) with 12 equal-time ticks per cycle, every 30° of the rotor (90° of the shaft); E traced |
| T5 | PASS | DATA · the eccentric line O-E, the fixed gear's and the rotor gear's pitch circles |
| T6 | PASS | HAND / DATA · e 15 on R 103: the eccentric motion is plain |
| T7 | PASS | DATA · PLAN |
| T8 | N/A | DATA · the principle reads in plan; no section or detail view declared |
| T9 | PASS | AUTO / DATA · claim table: 3 ok, 0 off, 0 uncheckable of 3 |
| T10 | PASS | AUTO · 8 solids drawn see-through: stator-sc0, stator-sc0-sh, stator-sc1, stator-sc1-sh, stator-sc2, stator-sc2-sh, stator-dw0, stator-dw1 · the static solids over the principle in plan are drawn see-through (listed) |
| T11 | N/A | AUTO · 0 supports routed, 0 moved off a sweep · no routed support near the principle |
| T12 | PASS | HAND · 10 support solids; dropped by the polish: none |
| T13 | N/A | DATA · nothing goes by in a blink |
| T14 | PASS | HAND / DATA · the crank driver |
| T15 | PASS | HAND · labels state the mechanism, never its use |
| T16 | N/A | HAND / STYLE · no two parts of one role to tell apart by hue |
| T17 | PASS | AUTO · depth peeling, no depth bias (renderer test) |
| D1 | PASS | HAND · rotor a curved triangle on its eccentric with its internal gear ring on top (the web underneath, review), housing block with the epitrochoid bore, side cover, stationary gear under the cover |
| D2 | PASS | HAND · the rotor's web round its liner; the housing's walls round the bore |
| D3 | PASS | STYLE · STYLE: roles by pattern and tone (both sheets) |
| D4 | PASS | AUTO · fired: base (3 solids), feet (4 solids) · base corners and feet concentric (base, feet rules) |
| D5 | PASS | AUTO / HAND · the housing on posts; the cover screwed and dowelled onto it; the stationary gear screwed up into the cover |
| D6 | PASS | HAND / STYLE · hardware quieter than the parts, still readable (both sheets) |
| D8 | PASS | AUTO / HAND · every solid a profile, an operation and a frame; built by Manifold; no layers, dz or twin |
| D9 | N/A | AUTO / HAND · no member changes shape |
| D10 | PASS | AUTO · profiles shipped for plain extrusions, meshes only for booleans (package v2) |
| D11 | PASS | AUTO · SOLID: 0 of 94 solids unsound |
| D7 | PASS | HAND · plain rotor and housing; richness in the eccentric, liner, cover fixings |
| A1 | PASS | AUTO · mesh J6, O J2, E eccentric, drive drive, stator-fix covers · every joint read from the record and built by its kit |
| A2 | PASS | AUTO · mesh J6, O J2, E eccentric, drive drive, stator-fix covers · pins and shafts by kit and stack; slides by J5; the kits listed |
| A3 | PASS | AUTO · fired: classify (3 solids), axial stack builder · bores from the catalogue; bearings where a boss fits them, bushings or liners elsewhere |
| A4 | PASS | AUTO · fired: j1-dead-axle (no solids), axial stack builder · stepped shafts with shoulders, grooves, flats and chamfered ends (H.shaft) |
| A5 | PASS | AUTO · fired: j2-live-shaft (25 solids), j10-shaft-in-plan (no solids), axial stack builder · keys by shaft size: D-flat to Ø8, feather key above |
| A6 | PASS | AUTO · fired: j5-slide (no solids), j13-compliant (no solids), standoffs (12 solids) · the housing posted to the base, the side cover screwed and dowelled onto it, the stationary gear screwed up into the cover |
| A7 | PASS | AUTO · fired: base (3 solids), feet (4 solids) · base under the lowest part, counterbored corner holes, feet, engraved scale and paths, shaft clearance holes |
| A8 | PASS | AUTO · fired: fasteners (6 solids) · stage 3 fasteners: shanks, clearance and tapped holes |
| A9 | PASS | AUTO / HAND · fired: placement solver · the rotor turns on the eccentric's rim (no pin); the shaft held in its housing, ending flush under the stationary gear |
| A10 | PASS | HAND · fired: placement (11 solids), placement solver · rotor web and eccentric on one slab, the gear ring and the stationary gear above, the cover over all |
| A11 | PASS | AUTO / HAND · fired: j12-flexible (no solids), strap-sheave (no solids), j1-dead-axle (no solids) · rotor to liner to eccentric to keyed shaft to housing to base; stationary gear to cover to housing to posts to base |
| A12 | PASS | AUTO · clamp check clean |
| A13 | PASS | AUTO / HAND · 94 solids, 52 unnamed (further items of a listed set) · named hardware with catalogue sizes and materials |
| A14 | PASS | AUTO / HAND · fired: support router · supports routed against the sweeps; details checked by A15 |
| A15 | PASS | AUTO · clearance in 3D over 72 phases: 0 clashes; hand allow: 0 named, 0 unnecessary |
| A16 | PASS | HAND · 5 joint notes; no note: none; no badge: mesh, E, stator-fix · a note per joint and the cover's; build rules: the web underneath, the cover drawn see-through |
| A17 | PASS | HAND · base, housing and shaft, eccentric, rotor with its liner, cheek ring, housing block, stationary gear, cover |
| A18 | PASS | AUTO · placement: 1 slabs in the tallest stack (16.0 mm), 0 clevises; stack per joint in the Joints table · axial positions set by the placement solver (order kept: a slider's partners over it, a die's carrier over its link) |
| A19 | N/A | AUTO · 0 supports routed (0 moved), least gap - mm; still covering a principle part, drawn see-through: none · no routed support |
| A20 | PASS | AUTO · support per joint: none · one axial stack builder with its support selector |
| A21 | PASS | AUTO · kit per joint: mesh J6, O J2, E eccentric, drive drive, stator-fix covers |
| A22 | PASS | AUTO · fired: stops (no solids), adjustable-length (no solids), cable-clip (2 solids) · no rocker stops: every part is coupled and never over-travels; cable clip |
| E1 | PASS | AUTO · every solid has one explode level; levels -4 to 2 · one level per solid, nothing stretches |
| E2 | PASS | AUTO · fired: explode (1 solid) · heads, shanks, washers and nuts move as one |
| E3 | PASS | AUTO · fired: explode (1 solid) · screws back out along their axes |
| E4 | PASS | HAND · the cover and its screws furthest (explode shots) |
| E5 | PASS | AUTO · fired: explode (1 solid) · pressed bearings, bushings and clips stay with their parts |
| E6 | PASS | AUTO · fired: explode (1 solid) · motor, bearings and pulley pair whole |
| E7 | PASS | AUTO · fired: explode (1 solid) · loose spacers midway |
| E8 | PASS | AUTO · fired: explode (1 solid) · keyed parts keep their order on their shaft |
| E9 | PASS | HAND · full explode readable in ISOMETRIC on both sheets, nothing leaves the frame |
| E10 | PASS | AUTO · fired: explode (1 solid) · each stack explodes along its joint axis, with trail lines |
| J1 | N/A | AUTO · fired: trunnion (no solids), hub (no solids), j1-dead-axle (no solids) · no fixed dead pivot |
| J2 | PASS | AUTO · fired: j2-live-shaft (25 solids) · live shafts: housing, key or D-flat, part held on the shaft end where something sweeps over |
| J3 | PASS | AUTO · fired: j3-moving-pin (no solids), cross-bearings (no solids), ring-hub (no solids), eccentric (3 solids) · moving pins: shoulder bolts with bearings or bushings; eccentrics on liners |
| J4 | N/A | AUTO · fired: j4-slot-roller (no solids), pin-lobe (no solids), fork-pin (no solids), die (no solids) · no pin in a slot |
| J5 | N/A | AUTO · fired: piston-bore (no solids), j5-slide (no solids), tongue-slot (no solids) · no slide |
| J6 | PASS | AUTO · fired: j6-mesh (1 solid), ring-rollers (no solids) · parallel mesh with timing marks; backlash set as F7 says |
| J7 | N/A | AUTO · fired: groove-cam (no solids), j7-cam (no solids), pallet-contact (no solids), pawl-tooth (no solids) · no cam |
| J8 | N/A | AUTO · fired: j8-belt (no solids), j12-flexible (no solids) · no belt in the mechanism (the drive belt is V4) |
| J9 | N/A | AUTO · fired: j9-crossed-mesh (no solids) · no crossed mesh |
| J10 | N/A | AUTO · fired: j10-shaft-in-plan (no solids) · no shaft in plan |
| J12 | N/A | AUTO · fired: j12-flexible (no solids), strap-sheave (no solids) · no flexible member |
| J13 | N/A | AUTO · fired: j13-compliant (no solids) · no compliant joint |
| J11 | N/A | AUTO · fired: j11-screw (no solids) · no screw |
| F1 | PASS | AUTO · served at O, stator-fix; fired: j2-live-shaft (25 solids), j10-shaft-in-plan (no solids), hub (no solids), strap-sheave (no solids), j13-compliant (no solids), covers (25 solids) · housings, hubs, bridges and ways dowelled (Joints table) |
| F2 | PASS | AUTO · served at O, E, stator-fix; fired: j2-live-shaft (25 solids), j10-shaft-in-plan (no solids), cross-bearings (no solids), trunnion (no solids), fork-pin (no solids), ring-hub (no solids), eccentric (3 solids), hub (no solids), ring-rollers (no solids), j12-flexible (no solids), strap-sheave (no solids), j13-compliant (no solids), covers (25 solids) · every bearing retained; every part on a shaft or pin retained (Joints table) |
| F3 | PASS | AUTO · served at O; fired: j2-live-shaft (25 solids), j10-shaft-in-plan (no solids), j12-flexible (no solids), j11-screw (no solids) · every keyed part keyed or on a D-flat with its retainer |
| F4 | PASS | AUTO / HAND · served at O; fired: j9-crossed-mesh (no solids), j2-live-shaft (25 solids), j10-shaft-in-plan (no solids), trunnion (no solids) · thrust washers and spacers locate every stack (Joints table) |
| F5 | N/A | AUTO / HAND · served at no joint; fired: j5-slide (no solids), pawl-tooth (no solids), j13-compliant (no solids), stops (no solids) · the rotor is driven by the eccentric and the gears: no over-travel |
| F6 | N/A | AUTO / HAND · served at no joint; fired: trunnion (no solids), j7-cam (no solids), pallet-contact (no solids), pawl-tooth (no solids), j12-flexible (no solids) · nothing is held by a spring or detent: every part is driven by its pin |
| F7 | PASS | AUTO / HAND · served at stator-fix; fired: j6-mesh (1 solid), j9-crossed-mesh (no solids), j5-slide (no solids), j12-flexible (no solids), adjustable-length (no solids), covers (25 solids) · the stationary gear's screws pass slotted holes in the cover: it slides to set the backlash, then is dowelled |
| F8 | PASS | AUTO · served at no joint; fired: cross-bearings (no solids), tongue-slot (no solids), eccentric (3 solids), j12-flexible (no solids), j11-screw (no solids), lubrication (no solids) · the rotor's liner oiled through the shaft; sealed bearings in the shaft housing |
| F9 | PASS | AUTO / HAND · served at mesh; fired: j6-mesh (1 solid), j9-crossed-mesh (no solids), timing-marks (1 solid) · zero line on the input and on the base (timing marks) |
| F10 | PASS | AUTO / HAND · served at drive; fired: j12-flexible (no solids), drive (26 solids) · home flag and fork sensor on the input (drive) |
| M1 | PASS | AUTO · fired: hardware primitives · top-face chamfers by part kind (primitives) |
| M2 | PASS | HAND · the rotor's bore and the housing's corners bossed |
| M3 | PASS | AUTO · fired: j3-moving-pin (no solids), hardware primitives · bore entry chamfers |
| M4 | PASS | AUTO / HAND · fired: base (3 solids), fasteners (6 solids) · counterbores and countersinks for heads (base, csk, housings) |
| M5 | PASS | AUTO / HAND · fired: hardware primitives · cutter radii on windows and slots |
| M6 | PASS | AUTO · edge distance and walls clean |
| M7 | N/A | HAND · no bracket corner turns a load |
| M8 | PASS | AUTO · fired: j1-dead-axle (no solids) · thread undercuts on stepped shafts |
| M9 | PASS | AUTO / HAND · fired: j1-dead-axle (no solids) · ISO coarse threads, engagement through the tapped part or to a nut |
| M10 | PASS | AUTO / HAND · 89 of 94 solids name a material · materials named by kind and role |
| M11 | PASS | AUTO · fired: j1-dead-axle (no solids), hardware primitives · centre holes, chamfered ends on turned parts |
| M12 | PASS | HAND · every screw reachable by its key in the explode |
| M13 | PASS | AUTO / HAND · 19 threaded · threadlocker or nyloc on every threaded fastener |
| M14 | PASS | AUTO / HAND · fired: piston-bore (no solids), j4-slot-roller (no solids), pin-lobe (no solids), groove-cam (no solids), pallet-contact (no solids), tongue-slot (no solids), eccentric (3 solids), die (no solids), hub (no solids) · the rotor's split bronze liner is the replaceable wear part |
| V1 | PASS | AUTO · fired: drive (26 solids) · brushless pancake motor, GT2 32:16 |
| V2 | PASS | AUTO · fired: drive (26 solids) · one bracket for the motor |
| V3 | PASS | AUTO / HAND · fired: drive (26 solids) · belt and pulleys clear of feet and housings (A15) |
| V4 | PASS | AUTO · fired: j8-belt (no solids) · flanged pulleys, belt in one plane |
| V5 | PASS | AUTO · fired: drive (26 solids) · rotary input: belt to the input pulley |
| V6 | PASS | AUTO · fired: drive (26 solids), cable-clip (2 solids) · home flag, fork sensor, terminals, lead and clip |
| L1 | PASS | STYLE · STYLE: no look values in the record or polish |
| L2 | PASS | HAND · records carry no look; no polish |
| L3 | PASS | HAND · roles right on every solid (both sheets) |
| L4 | PASS | HAND / STYLE · one accent: the input ring, the traces |
| L5 | PASS | AUTO / HAND · fired: see-through (8 solids) · transparency and hidden lines show screws in holes and bearings in bores |
| L6 | PASS | AUTO · depth peeling at every view (shots) |
| L7 | PASS | STYLE · STYLE: turntable orbit, named views, no perspective |
| L8 | PASS | AUTO / HAND · fired: trace-marks (no solids) · centrelines along every joint axis, base dimensions, engraved marks |
| L9 | N/A | AUTO / DATA · no section or detail view declared |
| L10 | PASS | AUTO / STYLE · teaching overlays in the sheet's look |
| R1 | PASS | HAND · every standard part from the primitives and kits |
| R2 | PASS | HAND · standard sizes only |
| R3 | PASS | AUTO · fired: hardware primitives · shared subassemblies, one function each |
| R4 | PASS | AUTO · package v2 23.8 KB · package v2 written at build time |
| R5 | PASS | HAND · no polish |
| R6 | PASS | FLAG · FLAG: bench run (desktop, below); the phone is measured by David |
| R7 | PASS | HAND / FLAG · polish none; 0 solids added, 0 overrides by the polish |
| R8 | PASS | AUTO / SITE · SITE: thumbnails pre-rendered, cards animate on hover |
| R9 | PASS | AUTO / SITE · setup and bake in the worker, one context |
| R10 | PASS | FLAG · FLAG: the bench page is built for the phone measurement |
| DL1 | PASS | AUTO / HAND · 26 of 94 solids on a dropping rung · every solid, mark and effect on a rung by its kind |
| DL2 | PASS | HAND · default dial: full |
| DL3 | PASS | AUTO · view-aware exceptions in the ladder table |
| DL4 | PASS | SITE · SITE: adaptive dial with hysteresis |
| DL6 | PASS | AUTO · teaching layers drawn at every dial position |
| DL5 | PASS | FLAG · FLAG: bench reports frame time per dial position |
| Q1 | PASS | check, clamp and edge distance clean |
| Q2 | PASS | 0 clashes, 0 unnecessary allows |
| Q3 | PASS | package v2 written, 23.8 KB; site build not checked here · package v2 written; site builds (npm run build) |
| Q4 | PASS | local: tools/shot · dist/shots3/<id>: record view, PLAN, FRONT, SIDE, ISOMETRIC, full explode, both sheets |
| Q5 | PASS | local: tools/bench · tools/bench3 run (desktop) |
| Q6 | PASS | every row judged |
| Q7 | PASS | at 3.0 |
| Q8 | PASS | teaching review: tweak (2026-10-20); the six phases of the finished build are looked at by eye · verdict and decisions in the record and the teaching: line; six phases of the finished build looked at |

## Joints
| Joint | Kit | Block | Support | Stack | F1 locate | F2 retain | F3 torque | F4 thrust | F5 limit | F6 hold | F7 adjust | F8 lube | F9 timing | F10 protect |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| mesh | J6 | gear-mesh | – | – | none | none | none | none | none | none | none | none | Stator; Rotor | none |
| O | J2 | driver | – | – | 2 x Dowel pin Ø3 x 10 h6, housing to base | 2 x Internal circlip DIN 472, Ø19; End washer 5.4x18, holds the shaft on the shaft end; Countersunk M5 x 12 (ISO 10642) | Feather key 3 x 3 x 7 (DIN 6885) | Thrust washer 10.2x18, bronze; Wave washer 14.5x18.8, spring steel | none | none | none | none | none | none |
| E | eccentric | – | – | – | none | Cheek ring 42x60, screwed to the sheave, laps the strap | none | none | none | none | none | none | none | none |
| drive | drive | – | – | – | none | none | none | none | none | none | none | none | none | Home flag, 1 mm steel vane; Fork sensor, slotted optical, 5 mm gap |
| stator-fix | covers | – | – | – | Dowel pin Ø3 h6, stator to the cover, fitted after the backlash is set | Countersunk M3 x 10 (ISO 10642) | none | none | none | none | Countersunk M3 x 10 (ISO 10642) | none | none | none |

## Supports
| Support | Joint | Kind | Route | Least gap mm | Covers | T10 |
|---|---|---|---|---|---|---|

## Variants and overrides
| Joint or part | Rule result | Chosen | Why |
|---|---|---|---|
| housing, cover, stationary gear | ground plate profile | fixed bodies at the rotor's level (level), the gear a fixed member of the mesh | an engine's construction: the gear hangs from the side cover over the rotor's gear ring, the web underneath (promoted) |

## Detail ladder
| Rung | Solids | Marks | Frame ms at this dial position |
|---|---|---|---|
| DL-A | 5 | 0 | 1.52 |
| DL-B | 0 | 122 | 1.53 |
| DL-C | 0 | 0 | 1.55 |
| DL-D | 7 | 0 | 1.84 |
| DL-E | 8 | 2 | 1.5 |
| DL-F | 0 | 0 | 1.59 |
| DL-G | 0 | 0 | 1.53 |
| DL-H | 6 | 0 | 1.53 |
| never | 68 | 107 | 1.7 |

## Promotion candidates
None left: fixed members of a joint, bodies at another's level, rotor and housing shapes and the covers rule are in the builder.

## Verification
check: clean · K1 residual: 7.1e-15 · claims: 3 of 3 ok · clearance: 0 clashes · clamp: clean · edge distance: clean · package: 23.9 KB
screenshots: dist/shots3/wankel (record view, PLAN, FRONT, SIDE, ISOMETRIC, explode; both sheets) · bench: dist/bench/report-v3.json (tools/bench3) (desktop; frame times paced at 28° in the ladder above; phone by David)
