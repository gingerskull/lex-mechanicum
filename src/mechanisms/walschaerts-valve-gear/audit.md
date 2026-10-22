# Audit: Walschaerts valve gear (walschaerts-valve-gear)
standard: 3.0 · date: 2026-10-22 · result: pass · detail: full · pass: build
teaching: tweak · decisions in the record

## Summary
PASS 151 · FAIL 0 · N/A 16 · open: none

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
| P10 | PASS | HAND · die and lever top traced with ghosts; plot of valve displacement with ghost curves at die +1, 0, -1; the piston position plot is in the record but not drawn (the page draws a further plot only in the first plot's unit and range) |
| P11 | PASS | DATA · plain language, mm and degrees |
| P12 | PASS | AUTO / DATA · validate(records, asVersion 3) clean for this record |
| P13 | PASS | HAND · teaching review run on the record (E2, #204) and again on the six phases of the finished build (teaching: line) |
| K1 | PASS | AUTO · K1 residual 5.1e-13 (tolerance 1e-9) over 360 samples, reference 2.0e-12 |
| K2 | PASS | AUTO · check: finite, continuous, periodic over 360 samples |
| K3 | PASS | AUTO / HAND · 4 blocks (slider-dyad, dyad, triad); no numeric fallback · composed from the block library; no fallback, no one-off model |
| K4 | PASS | HAND · the crank web the driver with the accent, main rod, crosshead, eccentric rod, expansion link, radius rod, lifting link, reverse arm, combination lever, union link, valve spindle the output |
| K6 | PASS | DATA · resynthesised by E2: constant lead (valve 12 off centre at the dead centre at every die), travel 24 mid gear, 50.4 at +1, 44.9 at -1, 39.6 at 0.8, return crank 102.3° ahead |
| K7 | PASS | DATA · drivers input (rotary), die (manual) · input kind declared with its driven joint |
| K8 | PASS | AUTO / DATA · every joint declared with type, bodies, origin and axis; nothing inferred |
| K9 | PASS | DATA · the crank (rotary) and the die (manual, -1 to +1, default 0.8, -20° of reverse arm per unit), never swept |
| K10 | PASS | AUTO / DATA · the declared closures, continuous over the cycle (no POSE JUMP) |
| K11 | PASS | AUTO · mobility counted 2, dof 1 |
| K12 | PASS | DATA · every traced, overlaid and claimed point and quantity is named in kin |
| T1 | PASS | HAND · the die control moves the die along the curved slot; the ghosts at +1, 0 and -1 show the travel change while the lead stays: the lesson reads; mechanics only, no locomotive |
| T2 | PASS | HAND · review before the build (E2) and again on the six phases of the finished build; decisions in the record |
| T3 | PASS | DATA · link, radius rod, combination lever, union, spindle, D, Rt and Vs declared |
| T4 | PASS | DATA · fired: trace-marks (1 solid) · the die D and the lever top Rt traced with ghosts at die +1, 0 and -1 |
| T5 | PASS | DATA · the slot radius arc (= radius rod) about the slot centre, the die offset dimension |
| T6 | PASS | HAND / DATA · travel 24 mid gear to 50 at full gear: the family of valve curves differs plainly |
| T7 | PASS | DATA · PLAN |
| T8 | N/A | DATA · the principle reads in plan; no section or detail view declared |
| T9 | PASS | AUTO / DATA · claim table: 7 ok, 0 off, 0 uncheckable of 7 |
| T10 | PASS | AUTO · 13 solids drawn see-through: Lf-1-brg, Lf-1-brg-balls, Lf-1-brg-cage, Dl-1-brg, Dl-1-brg-balls, Dl-1-brg-cage, Uc-1-sp, Uc-bolt-wsh · the static solids over the principle in plan are drawn see-through (listed) |
| T11 | N/A | AUTO · 0 supports routed, 0 moved off a sweep · no routed support near the principle |
| T12 | PASS | HAND · 18 support solids; dropped by the polish: none |
| T13 | N/A | DATA · nothing goes by in a blink |
| T14 | PASS | HAND / DATA · the crank driver and the die (a slider), held at its setting; the cycle repeats at any setting |
| T15 | PASS | HAND · labels state the mechanism, never its use |
| T16 | N/A | HAND / STYLE · no two parts of one role to tell apart by hue |
| T17 | PASS | AUTO · depth peeling, no depth bias (renderer test) |
| D1 | PASS | HAND · crank web with the return crank fixed on the main crank pin's end, rods, a curved expansion link of two cheeks (the lower solid on its trunnion, the upper slotted for the die), crosshead with its arm, combination lever, valve spindle on ways |
| D2 | PASS | HAND · bosses round every pin; the link's walls 10 mm either side of the slot |
| D3 | PASS | STYLE · STYLE: roles by pattern and tone (both sheets) |
| D4 | PASS | AUTO · fired: base (3 solids), feet (4 solids) · base corners and feet concentric (base, feet rules) |
| D5 | PASS | AUTO / HAND · ways on risers; the trunnion stands on the base under the link's groove |
| D6 | PASS | HAND / STYLE · hardware quieter than the parts, still readable (both sheets) |
| D8 | PASS | AUTO / HAND · every solid a profile, an operation and a frame; built by Manifold; no layers, dz or twin |
| D9 | N/A | AUTO / HAND · no member changes shape |
| D10 | PASS | AUTO · profiles shipped for plain extrusions, meshes only for booleans (package v2) |
| D11 | PASS | AUTO · SOLID: 0 of 258 solids unsound |
| D7 | PASS | HAND · plain rods and levers; richness in the link, die and stacks |
| A1 | PASS | AUTO · Cp J3, Xh J3, Rc J3, Lf J3, Dl J3, Lr J3, Rt J3, Vs J3, Ub J3, Uc J3, O J2, Rs J2, guide J5, vguide J5, slot die, Lt J1, Lt-link-stops stops, drive drive · every joint read from the record and built by its kit |
| A2 | PASS | AUTO · Cp J3, Xh J3, Rc J3, Lf J3, Dl J3, Lr J3, Rt J3, Vs J3, Ub J3, Uc J3, O J2, Rs J2, guide J5, vguide J5, slot die, Lt J1, Lt-link-stops stops, drive drive · pins and shafts by kit and stack; slides by J5; the kits listed |
| A3 | PASS | AUTO · fired: classify (17 solids), axial stack builder · bores from the catalogue; bearings where a boss fits them, bushings or liners elsewhere |
| A4 | PASS | AUTO · fired: j1-dead-axle (12 solids), axial stack builder · stepped shafts with shoulders, grooves, flats and chamfered ends (H.shaft) |
| A5 | PASS | AUTO · fired: j2-live-shaft (55 solids), j10-shaft-in-plan (no solids), axial stack builder · keys by shaft size: D-flat to Ø8, feather key above |
| A6 | PASS | AUTO · fired: j5-slide (32 solids), j13-compliant (no solids), standoffs (no solids) · ways on ground risers; fixed plates posted or screwed down |
| A7 | PASS | AUTO · fired: base (3 solids), feet (4 solids) · base under the lowest part, counterbored corner holes, feet, engraved scale and paths, shaft clearance holes |
| A8 | PASS | AUTO · fired: fasteners (20 solids) · stage 3 fasteners: shanks, clearance and tapped holes |
| A9 | PASS | AUTO / HAND · fired: placement solver · pins single shear except the double-shear clevises at Rt and Ub; the return crank clamped on the main crank pin |
| A10 | PASS | HAND · fired: placement (29 solids), placement solver · crosshead lowest on its ways, main rod over it, the return crank over the main rod, the eccentric rod over that; link, radius rod over the link (die from above), lifting link; combination lever and union with their clevises |
| A11 | PASS | AUTO / HAND · fired: j12-flexible (no solids), strap-sheave (no solids), j1-dead-axle (12 solids) · die to spigot to pin to lifting link and radius rod; link to trunnion to base; spindle and crosshead to ways to base |
| A12 | PASS | AUTO · clamp check clean |
| A13 | PASS | AUTO / HAND · 258 solids, 128 unnamed (further items of a listed set) · named hardware with catalogue sizes and materials |
| A14 | PASS | AUTO / HAND · fired: support router · supports routed against the sweeps; details checked by A15 |
| A15 | PASS | AUTO · clearance in 3D over 72 phases: 0 clashes; hand allow: 0 named, 0 unnecessary |
| A16 | PASS | HAND · 18 joint notes; no note: none; no badge: guide, vguide, slot · a note per joint; build rules: the return crank sits outboard of the main rod on the main crank pin's end; the die runs in the link's groove over the trunnion |
| A17 | PASS | HAND · base, housings, crank web, main rod, return crank, eccentric rod, link on its trunnion, die and radius rod, lifting link and reverse arm, lever, union, spindle, ways |
| A18 | PASS | AUTO · placement: 5 slabs in the tallest stack (71.0 mm), 2 clevises; stack per joint in the Joints table · axial positions set by the placement solver (order kept: a slider's partners over it, a die's carrier over its link) |
| A19 | N/A | AUTO · 0 supports routed (0 moved), least gap - mm; still covering a principle part, drawn see-through: none · no routed support |
| A20 | PASS | AUTO · support per joint: none · one axial stack builder with its support selector |
| A21 | PASS | AUTO · kit per joint: Cp J3, Xh J3, Rc J3, Lf J3, Dl J3, Lr J3, Rt J3, Vs J3, Ub J3, Uc J3, O J2, Rs J2, guide J5, vguide J5, slot die, Lt J1, Lt-link-stops stops, drive drive |
| A22 | PASS | AUTO · fired: stops (8 solids), adjustable-length (no solids), cable-clip (2 solids) · stops on the swinging part; cable clip |
| E1 | PASS | AUTO · every solid has one explode level; levels -4 to 7 · one level per solid, nothing stretches |
| E2 | PASS | AUTO · fired: explode (1 solid) · heads, shanks, washers and nuts move as one |
| E3 | PASS | AUTO · fired: explode (1 solid) · screws back out along their axes |
| E4 | PASS | HAND · the outer rods and clevis halves furthest (explode shots) |
| E5 | PASS | AUTO · fired: explode (1 solid) · pressed bearings, bushings and clips stay with their parts |
| E6 | PASS | AUTO · fired: explode (1 solid) · motor, bearings and pulley pair whole |
| E7 | PASS | AUTO · fired: explode (1 solid) · loose spacers midway |
| E8 | PASS | AUTO · fired: explode (1 solid) · keyed parts keep their order on their shaft |
| E9 | PASS | HAND · full explode readable in ISOMETRIC on both sheets, nothing leaves the frame |
| E10 | PASS | AUTO · fired: explode (1 solid) · each stack explodes along its joint axis, with trail lines |
| J1 | PASS | AUTO · fired: trunnion (no solids), hub (no solids), j1-dead-axle (12 solids) · fixed pivots: dead axle, hub or between-bridge as the Joints table says |
| J2 | PASS | AUTO · fired: j2-live-shaft (55 solids) · live shafts: housing, key or D-flat, part held on the shaft end where something sweeps over |
| J3 | PASS | AUTO · fired: j3-moving-pin (105 solids), cross-bearings (no solids), ring-hub (no solids), eccentric (no solids) · moving pins: shoulder bolts with bearings or bushings; eccentrics on liners |
| J4 | PASS | AUTO · fired: j4-slot-roller (no solids), pin-lobe (no solids), fork-pin (no solids), die (3 solids) · the die in the curved link's groove |
| J5 | PASS | AUTO · fired: piston-bore (no solids), j5-slide (32 solids), tongue-slot (no solids) · slides: ways on risers with a gib under a keeper, wipers where they clear |
| J6 | N/A | AUTO · fired: j6-mesh (no solids), ring-rollers (no solids) · no parallel mesh |
| J7 | N/A | AUTO · fired: groove-cam (no solids), j7-cam (no solids), pallet-contact (no solids), pawl-tooth (no solids) · no cam |
| J8 | N/A | AUTO · fired: j8-belt (no solids), j12-flexible (no solids) · no belt in the mechanism (the drive belt is V4) |
| J9 | N/A | AUTO · fired: j9-crossed-mesh (no solids) · no crossed mesh |
| J10 | N/A | AUTO · fired: j10-shaft-in-plan (no solids) · no shaft in plan |
| J12 | N/A | AUTO · fired: j12-flexible (no solids), strap-sheave (no solids) · no flexible member |
| J13 | N/A | AUTO · fired: j13-compliant (no solids) · no compliant joint |
| J11 | N/A | AUTO · fired: j11-screw (no solids) · no screw |
| F1 | PASS | AUTO · served at O, Rs, guide, vguide, Lt; fired: j2-live-shaft (55 solids), j10-shaft-in-plan (no solids), hub (no solids), strap-sheave (no solids), j13-compliant (no solids), covers (no solids) · housings, hubs, bridges and ways dowelled (Joints table) |
| F2 | PASS | AUTO · served at Cp, Xh, Rc, Lf, Dl, Lr, Rt, Vs, Ub, Uc, O, Rs, guide, vguide, Lt; fired: j2-live-shaft (55 solids), j10-shaft-in-plan (no solids), cross-bearings (no solids), trunnion (no solids), fork-pin (no solids), ring-hub (no solids), eccentric (no solids), hub (no solids), ring-rollers (no solids), j12-flexible (no solids), strap-sheave (no solids), j13-compliant (no solids), covers (no solids) · every bearing retained; every part on a shaft or pin retained (Joints table) |
| F3 | PASS | AUTO · served at Cp, Xh, Rc, Lf, Dl, Lr, Rt, Vs, Ub, Uc, O, Rs; fired: j2-live-shaft (55 solids), j10-shaft-in-plan (no solids), j12-flexible (no solids), j11-screw (no solids) · every keyed part keyed or on a D-flat with its retainer |
| F4 | PASS | AUTO / HAND · served at Cp, Rt, Vs, Ub, Uc, O, Rs, Lt; fired: j9-crossed-mesh (no solids), j2-live-shaft (55 solids), j10-shaft-in-plan (no solids), trunnion (no solids) · thrust washers and spacers locate every stack (Joints table) |
| F5 | PASS | AUTO / HAND · served at Lt-link-stops; fired: j5-slide (32 solids), pawl-tooth (no solids), j13-compliant (no solids), stops (8 solids) · stop pins either side of the expansion link's swing (stops rule); the sliders are driven |
| F6 | PASS | AUTO / HAND · served at Rs; fired: trunnion (no solids), j7-cam (no solids), pallet-contact (no solids), pawl-tooth (no solids), j12-flexible (no solids) · the reverse shaft held at the die setting by a split clamp collar with a thumb screw under its housing |
| F7 | PASS | AUTO / HAND · served at guide, vguide; fired: j6-mesh (no solids), j9-crossed-mesh (no solids), j5-slide (32 solids), j12-flexible (no solids), adjustable-length (no solids), covers (no solids) · gibs on the ways |
| F8 | PASS | AUTO · served at guide, vguide; fired: cross-bearings (no solids), tongue-slot (no solids), eccentric (no solids), j12-flexible (no solids), j11-screw (no solids), lubrication (no solids) · grease nipples or oil holes on the ways, felt wipers; sealed bearings elsewhere |
| F9 | PASS | AUTO / HAND · served at no joint; fired: j6-mesh (no solids), j9-crossed-mesh (no solids), timing-marks (2 solids) · zero line on the input and on the base (timing marks) |
| F10 | PASS | AUTO / HAND · served at drive; fired: j12-flexible (no solids), drive (26 solids) · home flag and fork sensor on the input (drive) |
| M1 | PASS | AUTO · fired: hardware primitives · top-face chamfers by part kind (primitives) |
| M2 | PASS | HAND · bosses round every loaded hole |
| M3 | PASS | AUTO · fired: j3-moving-pin (105 solids), hardware primitives · bore entry chamfers |
| M4 | PASS | AUTO / HAND · fired: base (3 solids), fasteners (20 solids) · counterbores and countersinks for heads (base, csk, housings) |
| M5 | PASS | AUTO / HAND · fired: hardware primitives · cutter radii on windows and slots |
| M6 | PASS | AUTO · edge distance and walls clean |
| M7 | N/A | HAND · no bracket corner turns a load |
| M8 | PASS | AUTO · fired: j1-dead-axle (12 solids) · thread undercuts on stepped shafts |
| M9 | PASS | AUTO / HAND · fired: j1-dead-axle (12 solids) · ISO coarse threads, engagement through the tapped part or to a nut |
| M10 | PASS | AUTO / HAND · 244 of 258 solids name a material · materials named by kind and role |
| M11 | PASS | AUTO · fired: j1-dead-axle (12 solids), hardware primitives · centre holes, chamfered ends on turned parts |
| M12 | PASS | HAND · every screw reachable by its key in the explode |
| M13 | PASS | AUTO / HAND · 30 threaded · threadlocker or nyloc on every threaded fastener |
| M14 | PASS | AUTO / HAND · fired: piston-bore (no solids), j4-slot-roller (no solids), pin-lobe (no solids), groove-cam (no solids), pallet-contact (no solids), tongue-slot (no solids), eccentric (no solids), die (3 solids), hub (no solids) · the bronze die is the replaceable wear part |
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
| L5 | PASS | AUTO / HAND · fired: see-through (13 solids) · transparency and hidden lines show screws in holes and bearings in bores |
| L6 | PASS | AUTO · depth peeling at every view (shots) |
| L7 | PASS | STYLE · STYLE: turntable orbit, named views, no perspective |
| L8 | PASS | AUTO / HAND · fired: trace-marks (1 solid) · centrelines along every joint axis, base dimensions, engraved marks |
| L9 | N/A | AUTO / DATA · no section or detail view declared |
| L10 | PASS | AUTO / STYLE · teaching overlays in the sheet's look |
| R1 | PASS | HAND · every standard part from the primitives and kits |
| R2 | PASS | HAND · standard sizes only |
| R3 | PASS | AUTO · fired: hardware primitives · shared subassemblies, one function each |
| R4 | PASS | AUTO · package v2 39.9 KB · package v2 written at build time |
| R5 | PASS | HAND · no polish |
| R6 | PASS | FLAG · FLAG: bench run (desktop, below); the phone is measured by David |
| R7 | PASS | HAND / FLAG · polish none; 0 solids added, 0 overrides by the polish |
| R8 | PASS | AUTO / SITE · SITE: thumbnails pre-rendered, cards animate on hover |
| R9 | PASS | AUTO / SITE · setup and bake in the worker, one context |
| R10 | PASS | FLAG · FLAG: the bench page is built for the phone measurement |
| DL1 | PASS | AUTO / HAND · 108 of 258 solids on a dropping rung · every solid, mark and effect on a rung by its kind |
| DL2 | PASS | HAND · default dial: full |
| DL3 | PASS | AUTO · view-aware exceptions in the ladder table |
| DL4 | PASS | SITE · SITE: adaptive dial with hysteresis |
| DL6 | PASS | AUTO · teaching layers drawn at every dial position |
| DL5 | PASS | FLAG · FLAG: bench reports frame time per dial position |
| Q1 | PASS | check, clamp and edge distance clean |
| Q2 | PASS | 0 clashes, 0 unnecessary allows |
| Q3 | PASS | package v2 written, 39.9 KB; site build not checked here · package v2 written; site builds (npm run build) |
| Q4 | PASS | local: tools/shot · dist/shots3/<id>: record view, PLAN, FRONT, SIDE, ISOMETRIC, full explode, both sheets |
| Q5 | PASS | local: tools/bench · tools/bench3 run (desktop) |
| Q6 | PASS | every row judged |
| Q7 | PASS | at 3.0 |
| Q8 | PASS | teaching review: tweak (2026-10-20); the six phases of the finished build are looked at by eye · verdict and decisions in the record and the teaching: line; six phases of the finished build looked at |

## Joints
| Joint | Kit | Block | Support | Stack | F1 locate | F2 retain | F3 torque | F4 thrust | F5 limit | F6 hold | F7 adjust | F8 lube | F9 timing | F10 protect |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Cp | J3 | slider-dyad | – | – | none | Shoulder bolt Ø8 x 35, M6 (ISO 7379) | Shoulder bolt Ø8 x 35, M6 (ISO 7379) | Inner-race spacer 8.2x10.8 | none | none | none | none | none | none |
| Xh | J3 | – | – | – | none | Shoulder bolt Ø6 x 16, M5 (ISO 7379) | Shoulder bolt Ø6 x 16, M5 (ISO 7379) | none | none | none | none | none | none | none |
| Rc | J3 | dyad | – | – | none | Shoulder bolt Ø6 x 30, M5 (ISO 7379) | Shoulder bolt Ø6 x 30, M5 (ISO 7379) | none | none | none | none | none | none | none |
| Lf | J3 | – | – | – | none | Shoulder bolt Ø6 x 25, M5 (ISO 7379) | Shoulder bolt Ø6 x 25, M5 (ISO 7379) | none | none | none | none | none | none | none |
| Dl | J3 | triad | – | – | none | Shoulder bolt Ø6 x 12, M5 (ISO 7379) | Shoulder bolt Ø6 x 12, M5 (ISO 7379) | none | none | none | none | none | none | none |
| Lr | J3 | dyad | – | – | none | Shoulder bolt Ø6 x 12, M5 (ISO 7379) | Shoulder bolt Ø6 x 12, M5 (ISO 7379) | none | none | none | none | none | none | none |
| Rt | J3 | triad | – | – | none | Shoulder bolt Ø6 x 40, M5 (ISO 7379) | Shoulder bolt Ø6 x 40, M5 (ISO 7379) | Inner-race spacer 6.2x9.1 | none | none | none | none | none | none |
| Vs | J3 | triad | – | – | none | Shoulder bolt Ø4 x 55, M3 (ISO 7379) | Shoulder bolt Ø4 x 55, M3 (ISO 7379) | Inner-race spacer 4.2x7.1 | none | none | none | none | none | none |
| Ub | J3 | triad | – | – | none | Shoulder bolt Ø6 x 55, M5 (ISO 7379) | Shoulder bolt Ø6 x 55, M5 (ISO 7379) | 2 x Inner-race spacer 6.2x9.1 | none | none | none | none | none | none |
| Uc | J3 | triad | – | – | none | Shoulder bolt Ø6 x 60, M5 (ISO 7379) | Shoulder bolt Ø6 x 60, M5 (ISO 7379) | Inner-race spacer 6.2x8.4 | none | none | none | none | none | none |
| O | J2 | slider-dyad | – | – | 2 x Dowel pin Ø3 x 10 h6, housing to base | 2 x Internal circlip DIN 472, Ø21; End washer 5.4x20, holds the wheel on the shaft end; Countersunk M5 x 12 (ISO 10642) | Feather key 4 x 4 x 10 (DIN 6885) | Thrust washer 12.2x20, bronze; Wave washer 16.5x20.8, spring steel | none | none | none | none | none | none |
| Rs | J2 | driver | – | – | 2 x Dowel pin Ø3 x 10 h6, housing to base | 2 x Internal circlip DIN 472, Ø13; External circlip DIN 471, Ø6 | Clamp hub Ø6x16, two set screws at 90°; Set screw M4 (DIN 916), threadlocked | Thrust washer 6.2x14, bronze; Wave washer 9.5x12.8, spring steel | none | Split clamp collar 6x18 with a thumb screw: holds the setting | none | none | none | none |
| guide | J5 | – | – | – | 2 x Dowel pin Ø3 h6, riser to base | Keeper plate, laps the slider | none | none | none | none | Gib strip 3 x 6 x 146, bronze | 2 x Felt wiper in a steel clip; Grease nipple M6 (DIN 71412) | none | none |
| vguide | J5 | triad | – | – | 2 x Dowel pin Ø3 h6, reference rail to base | Keeper plate, laps the slider | none | none | none | none | Gib strip 3 x 6 x 67.6, bronze | 2 x Felt wiper in a steel clip | none | none |
| slot | die | – | – | – | none | none | none | none | none | none | none | none | none | none |
| Lt | J1 | dyad | – | – | Dead axle Ø12, shouldered, M10 end | Internal circlip DIN 472, Ø24; External circlip DIN 471, Ø12 | none | Thrust washer 12.2x20, bronze | none | none | none | none | none | none |
| Lt-link-stops | stops | – | – | – | none | none | none | none | 2 x Stop pin Ø6, hardened, on the lever's edge | none | none | none | none | none |
| drive | drive | – | – | – | none | none | none | none | none | none | none | none | none | Home flag, 1 mm steel vane; Fork sensor, slotted optical, 5 mm gap |

## Supports
| Support | Joint | Kind | Route | Least gap mm | Covers | T10 |
|---|---|---|---|---|---|---|

## Variants and overrides
| Joint or part | Rule result | Chosen | Why |
|---|---|---|---|
| wheel | one crank web with both pins | return crank as an outboard arm fixed on the main crank pin's end | the main and eccentric rods each passed over the other's pin; on its own slab the return crank clears both (arms, promoted) |
| link | slot link | two-cheek curved link, die kit | the die passes the trunnion at mid gear: it runs in a groove over the solid lower cheek (promoted) |

## Detail ladder
| Rung | Solids | Marks | Frame ms at this dial position |
|---|---|---|---|
| DL-A | 37 | 0 | 1.8 |
| DL-B | 0 | 410 | 1.78 |
| DL-C | 0 | 0 | 1.73 |
| DL-D | 40 | 0 | 1.8 |
| DL-E | 13 | 0 | 1.85 |
| DL-F | 0 | 0 | 1.79 |
| DL-G | 0 | 0 | 1.8 |
| DL-H | 18 | 0 | 1.8 |
| never | 150 | 418 | 1.88 |

## Promotion candidates
None left: outboard arms, the curved link and die kit, the slider placement order and the manual-driver hold are in the builder.

## Verification
check: clean · K1 residual: 5.1e-13 · claims: 7 of 7 ok · clearance: 0 clashes · clamp: clean · edge distance: clean · package: 39.9 KB
screenshots: dist/shots3/walschaerts-valve-gear (record view, PLAN, FRONT, SIDE, ISOMETRIC, explode; both sheets) · bench: dist/bench/report-v3.json (tools/bench3) (desktop; frame times paced at 28° in the ladder above; phone by David)
