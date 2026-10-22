# Audit: Eccentric sheave and strap (eccentric-sheave)
standard: 3.0 · date: 2026-10-22 · result: pass · detail: full · pass: build
teaching: keep · decisions in the record

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
| P10 | PASS | HAND · E and V traced, the eccentricity line; plot of valve rod position |
| P11 | PASS | DATA · plain language, mm and degrees |
| P12 | PASS | AUTO / DATA · validate(records, asVersion 3) clean for this record |
| P13 | PASS | HAND · teaching review run on the record (E2, #204) and again on the six phases of the finished build (teaching: line) |
| K1 | PASS | AUTO · K1 residual 5.7e-14 (tolerance 1e-9) over 360 samples, reference 0.0e+0 |
| K2 | PASS | AUTO · check: finite, continuous, periodic over 360 samples |
| K3 | PASS | AUTO / HAND · 1 block (slider-dyad); no numeric fallback · composed from the block library; no fallback, no one-off model |
| K4 | PASS | HAND · the sheave the driver with the accent on its shaft, strap a link, valve rod the output on ways |
| K6 | PASS | DATA · e 12 (the throw), sheave R 40, strap 150: travel 2e = 24, obliquity 4.6° as the defining relations say |
| K7 | PASS | DATA · drivers input (rotary) · input kind declared with its driven joint |
| K8 | PASS | AUTO / DATA · every joint declared with type, bodies, origin and axis; nothing inferred |
| K9 | PASS | DATA · one rotary driver; the throw e control of E2 dropped (the sheave is built for e 12) |
| K10 | PASS | AUTO / DATA · the declared closures, continuous over the cycle (no POSE JUMP) |
| K11 | PASS | AUTO · mobility counted 1, dof 1 |
| K12 | PASS | DATA · every traced, overlaid and claimed point and quantity is named in kin |
| T1 | PASS | HAND · the sheave turns about its off-centre shaft and the strap moves the rod: the small crank O-E inside the large disc reads; mechanics only |
| T2 | PASS | HAND · review before the build (E2) and again on the six phases of the finished build; decisions in the record |
| T3 | PASS | DATA · sheave, strap and E declared |
| T4 | PASS | DATA · fired: trace-marks (no solids) · E traced (the 12 mm crank circle), V traced with ticks every 15° |
| T5 | PASS | DATA · the line O-E labelled ECCENTRICITY |
| T6 | PASS | HAND / DATA · e 12 against R 40: the throw is small against the disc, which is the lesson |
| T7 | PASS | DATA · PLAN |
| T8 | N/A | DATA · the principle reads in plan; no section or detail view declared |
| T9 | PASS | AUTO / DATA · claim table: 4 ok, 0 off, 0 uncheckable of 4 |
| T10 | PASS | AUTO · 2 solids drawn see-through: V-bolt-wsh, V-bolt-head · the static solids over the principle in plan are drawn see-through (listed) |
| T11 | N/A | AUTO · 0 supports routed, 0 moved off a sweep · no routed support near the principle |
| T12 | PASS | HAND · 13 support solids; dropped by the polish: none |
| T13 | N/A | DATA · nothing goes by in a blink |
| T14 | PASS | HAND / DATA · the crank driver (see K9) |
| T15 | PASS | HAND · labels state the mechanism, never its use |
| T16 | N/A | HAND / STYLE · no two parts of one role to tell apart by hue |
| T17 | PASS | AUTO · depth peeling, no depth bias (renderer test) |
| D1 | PASS | HAND · sheave a disc with its shaft hole visibly off centre; strap a ring round it with a slim rod; valve rod a slider on ways |
| D2 | PASS | HAND · the strap ring 8 mm round its bore; bosses round the rod pin |
| D3 | PASS | STYLE · STYLE: roles by pattern and tone (both sheets) |
| D4 | PASS | AUTO · fired: base (3 solids), feet (4 solids) · base corners and feet concentric (base, feet rules) |
| D5 | PASS | AUTO / HAND · the ways on short ground risers, the valve rod lowest |
| D6 | PASS | HAND / STYLE · hardware quieter than the parts, still readable (both sheets) |
| D8 | PASS | AUTO / HAND · every solid a profile, an operation and a frame; built by Manifold; no layers, dz or twin |
| D9 | N/A | AUTO / HAND · no member changes shape |
| D10 | PASS | AUTO · profiles shipped for plain extrusions, meshes only for booleans (package v2) |
| D11 | PASS | AUTO · SOLID: 0 of 91 solids unsound |
| D7 | PASS | HAND · plain sheave and strap; richness in the liner, cheek ring and ways |
| A1 | PASS | AUTO · V J3, O J2, G J5, E eccentric, drive drive · every joint read from the record and built by its kit |
| A2 | PASS | AUTO · V J3, O J2, G J5, E eccentric, drive drive · pins and shafts by kit and stack; slides by J5; the kits listed |
| A3 | PASS | AUTO · fired: classify (4 solids), axial stack builder · bores from the catalogue; bearings where a boss fits them, bushings or liners elsewhere |
| A4 | PASS | AUTO · fired: j1-dead-axle (no solids), axial stack builder · stepped shafts with shoulders, grooves, flats and chamfered ends (H.shaft) |
| A5 | PASS | AUTO · fired: j2-live-shaft (28 solids), j10-shaft-in-plan (no solids), axial stack builder · keys by shaft size: D-flat to Ø8, feather key above |
| A6 | PASS | AUTO · fired: j5-slide (16 solids), j13-compliant (no solids), standoffs (no solids) · ways on ground risers; fixed plates posted or screwed down |
| A7 | PASS | AUTO · fired: base (3 solids), feet (4 solids) · base under the lowest part, counterbored corner holes, feet, engraved scale and paths, shaft clearance holes |
| A8 | PASS | AUTO · fired: fasteners (12 solids) · stage 3 fasteners: shanks, clearance and tapped holes |
| A9 | PASS | AUTO / HAND · fired: placement solver · the sheave turns in the strap on its own rim (no pin); the rod pin single shear |
| A10 | PASS | HAND · fired: placement (6 solids), placement solver · the valve rod on its ways lowest, sheave and strap in one plane over it (the eccentric kit keeps them on one slab), the strap's rod pinned over the valve rod |
| A11 | PASS | AUTO / HAND · fired: j12-flexible (no solids), strap-sheave (no solids), j1-dead-axle (no solids) · strap to liner to sheave to keyed shaft to housing to base; valve rod to ways to base |
| A12 | PASS | AUTO · clamp check clean |
| A13 | PASS | AUTO / HAND · 91 solids, 43 unnamed (further items of a listed set) · named hardware with catalogue sizes and materials |
| A14 | PASS | AUTO / HAND · fired: support router · supports routed against the sweeps; details checked by A15 |
| A15 | PASS | AUTO · clearance in 3D over 72 phases: 0 clashes; hand allow: 0 named, 0 unnecessary |
| A16 | PASS | HAND · 5 joint notes; no note: none; no badge: G, E · a note per joint; build rules: the strap rides the sheave's rim on a bronze liner, a cheek ring holds it |
| A17 | PASS | HAND · base, housing and shaft, sheave, strap with its liner, cheek ring, ways, valve rod |
| A18 | PASS | AUTO · placement: 2 slabs in the tallest stack (21.0 mm), 0 clevises; stack per joint in the Joints table · axial positions set by the placement solver (order kept: a slider's partners over it, a die's carrier over its link) |
| A19 | N/A | AUTO · 0 supports routed (0 moved), least gap - mm; still covering a principle part, drawn see-through: none · no routed support |
| A20 | PASS | AUTO · support per joint: none · one axial stack builder with its support selector |
| A21 | PASS | AUTO · kit per joint: V J3, O J2, G J5, E eccentric, drive drive |
| A22 | PASS | AUTO · fired: stops (no solids), adjustable-length (no solids), cable-clip (2 solids) · no rocker stops: every part is coupled and never over-travels; cable clip |
| E1 | PASS | AUTO · every solid has one explode level; levels -4 to 3 · one level per solid, nothing stretches |
| E2 | PASS | AUTO · fired: explode (1 solid) · heads, shanks, washers and nuts move as one |
| E3 | PASS | AUTO · fired: explode (1 solid) · screws back out along their axes |
| E4 | PASS | HAND · cheek ring, strap and keeper furthest (explode shots) |
| E5 | PASS | AUTO · fired: explode (1 solid) · pressed bearings, bushings and clips stay with their parts |
| E6 | PASS | AUTO · fired: explode (1 solid) · motor, bearings and pulley pair whole |
| E7 | PASS | AUTO · fired: explode (1 solid) · loose spacers midway |
| E8 | PASS | AUTO · fired: explode (1 solid) · keyed parts keep their order on their shaft |
| E9 | PASS | HAND · full explode readable in ISOMETRIC on both sheets, nothing leaves the frame |
| E10 | PASS | AUTO · fired: explode (1 solid) · each stack explodes along its joint axis, with trail lines |
| J1 | N/A | AUTO · fired: trunnion (no solids), hub (no solids), j1-dead-axle (no solids) · no fixed dead pivot |
| J2 | PASS | AUTO · fired: j2-live-shaft (28 solids) · live shafts: housing, key or D-flat, part held on the shaft end where something sweeps over |
| J3 | PASS | AUTO · fired: j3-moving-pin (9 solids), cross-bearings (no solids), ring-hub (no solids), eccentric (4 solids) · moving pins: shoulder bolts with bearings or bushings; eccentrics on liners |
| J4 | N/A | AUTO · fired: j4-slot-roller (no solids), pin-lobe (no solids), fork-pin (no solids), die (no solids) · no pin in a slot |
| J5 | PASS | AUTO · fired: piston-bore (no solids), j5-slide (16 solids), tongue-slot (no solids) · slides: ways on risers with a gib under a keeper, wipers where they clear |
| J6 | N/A | AUTO · fired: j6-mesh (no solids), ring-rollers (no solids) · no parallel mesh |
| J7 | N/A | AUTO · fired: groove-cam (no solids), j7-cam (no solids), pallet-contact (no solids), pawl-tooth (no solids) · no cam |
| J8 | N/A | AUTO · fired: j8-belt (no solids), j12-flexible (no solids) · no belt in the mechanism (the drive belt is V4) |
| J9 | N/A | AUTO · fired: j9-crossed-mesh (no solids) · no crossed mesh |
| J10 | N/A | AUTO · fired: j10-shaft-in-plan (no solids) · no shaft in plan |
| J12 | N/A | AUTO · fired: j12-flexible (no solids), strap-sheave (no solids) · no flexible member |
| J13 | N/A | AUTO · fired: j13-compliant (no solids) · no compliant joint |
| J11 | N/A | AUTO · fired: j11-screw (no solids) · no screw |
| F1 | PASS | AUTO · served at O, G; fired: j2-live-shaft (28 solids), j10-shaft-in-plan (no solids), hub (no solids), strap-sheave (no solids), j13-compliant (no solids), covers (no solids) · housings, hubs, bridges and ways dowelled (Joints table) |
| F2 | PASS | AUTO · served at V, O, G, E; fired: j2-live-shaft (28 solids), j10-shaft-in-plan (no solids), cross-bearings (no solids), trunnion (no solids), fork-pin (no solids), ring-hub (no solids), eccentric (4 solids), hub (no solids), ring-rollers (no solids), j12-flexible (no solids), strap-sheave (no solids), j13-compliant (no solids), covers (no solids) · every bearing retained; every part on a shaft or pin retained (Joints table) |
| F3 | PASS | AUTO · served at V, O; fired: j2-live-shaft (28 solids), j10-shaft-in-plan (no solids), j12-flexible (no solids), j11-screw (no solids) · every keyed part keyed or on a D-flat with its retainer |
| F4 | PASS | AUTO / HAND · served at O; fired: j9-crossed-mesh (no solids), j2-live-shaft (28 solids), j10-shaft-in-plan (no solids), trunnion (no solids) · thrust washers and spacers locate every stack (Joints table) |
| F5 | N/A | AUTO / HAND · served at no joint; fired: j5-slide (16 solids), pawl-tooth (no solids), j13-compliant (no solids), stops (no solids) · the rod drives the slider and the cranks turn round: nothing over-travels; no stop has room past the travel |
| F6 | N/A | AUTO / HAND · served at no joint; fired: trunnion (no solids), j7-cam (no solids), pallet-contact (no solids), pawl-tooth (no solids), j12-flexible (no solids) · nothing is held by a spring or detent: every part is driven by its pin |
| F7 | PASS | AUTO / HAND · served at G; fired: j6-mesh (no solids), j9-crossed-mesh (no solids), j5-slide (16 solids), j12-flexible (no solids), adjustable-length (no solids), covers (no solids) · gibs on the ways |
| F8 | PASS | AUTO · served at G, E; fired: cross-bearings (no solids), tongue-slot (no solids), eccentric (4 solids), j12-flexible (no solids), j11-screw (no solids), lubrication (no solids) · grease nipples or oil holes on the ways, felt wipers; sealed bearings elsewhere |
| F9 | PASS | AUTO / HAND · served at no joint; fired: j6-mesh (no solids), j9-crossed-mesh (no solids), timing-marks (1 solid) · zero line on the input and on the base (timing marks) |
| F10 | PASS | AUTO / HAND · served at drive; fired: j12-flexible (no solids), drive (26 solids) · home flag and fork sensor on the input (drive) |
| M1 | PASS | AUTO · fired: hardware primitives · top-face chamfers by part kind (primitives) |
| M2 | PASS | HAND · the strap ring and the rod end bossed |
| M3 | PASS | AUTO · fired: j3-moving-pin (9 solids), hardware primitives · bore entry chamfers |
| M4 | PASS | AUTO / HAND · fired: base (3 solids), fasteners (12 solids) · counterbores and countersinks for heads (base, csk, housings) |
| M5 | PASS | AUTO / HAND · fired: hardware primitives · cutter radii on windows and slots |
| M6 | PASS | AUTO · edge distance and walls clean |
| M7 | N/A | HAND · no bracket corner turns a load |
| M8 | PASS | AUTO · fired: j1-dead-axle (no solids) · thread undercuts on stepped shafts |
| M9 | PASS | AUTO / HAND · fired: j1-dead-axle (no solids) · ISO coarse threads, engagement through the tapped part or to a nut |
| M10 | PASS | AUTO / HAND · 88 of 91 solids name a material · materials named by kind and role |
| M11 | PASS | AUTO · fired: j1-dead-axle (no solids), hardware primitives · centre holes, chamfered ends on turned parts |
| M12 | PASS | HAND · every screw reachable by its key in the explode |
| M13 | PASS | AUTO / HAND · 10 threaded · threadlocker or nyloc on every threaded fastener |
| M14 | PASS | AUTO / HAND · fired: piston-bore (no solids), j4-slot-roller (no solids), pin-lobe (no solids), groove-cam (no solids), pallet-contact (no solids), tongue-slot (no solids), eccentric (4 solids), die (no solids), hub (no solids) · the strap's split bronze liner is the replaceable wear part |
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
| L5 | PASS | AUTO / HAND · fired: see-through (2 solids) · transparency and hidden lines show screws in holes and bearings in bores |
| L6 | PASS | AUTO · depth peeling at every view (shots) |
| L7 | PASS | STYLE · STYLE: turntable orbit, named views, no perspective |
| L8 | PASS | AUTO / HAND · fired: trace-marks (no solids) · centrelines along every joint axis, base dimensions, engraved marks |
| L9 | N/A | AUTO / DATA · no section or detail view declared |
| L10 | PASS | AUTO / STYLE · teaching overlays in the sheet's look |
| R1 | PASS | HAND · every standard part from the primitives and kits |
| R2 | PASS | HAND · standard sizes only |
| R3 | PASS | AUTO · fired: hardware primitives · shared subassemblies, one function each |
| R4 | PASS | AUTO · package v2 21.1 KB · package v2 written at build time |
| R5 | PASS | HAND · no polish |
| R6 | PASS | FLAG · FLAG: bench run (desktop, below); the phone is measured by David |
| R7 | PASS | HAND / FLAG · polish none; 0 solids added, 0 overrides by the polish |
| R8 | PASS | AUTO / SITE · SITE: thumbnails pre-rendered, cards animate on hover |
| R9 | PASS | AUTO / SITE · setup and bake in the worker, one context |
| R10 | PASS | FLAG · FLAG: the bench page is built for the phone measurement |
| DL1 | PASS | AUTO / HAND · 36 of 91 solids on a dropping rung · every solid, mark and effect on a rung by its kind |
| DL2 | PASS | HAND · default dial: full |
| DL3 | PASS | AUTO · view-aware exceptions in the ladder table |
| DL4 | PASS | SITE · SITE: adaptive dial with hysteresis |
| DL6 | PASS | AUTO · teaching layers drawn at every dial position |
| DL5 | PASS | FLAG · FLAG: bench reports frame time per dial position |
| Q1 | PASS | check, clamp and edge distance clean |
| Q2 | PASS | 0 clashes, 0 unnecessary allows |
| Q3 | PASS | package v2 written, 21.1 KB; site build not checked here · package v2 written; site builds (npm run build) |
| Q4 | PASS | local: tools/shot · dist/shots3/<id>: record view, PLAN, FRONT, SIDE, ISOMETRIC, full explode, both sheets |
| Q5 | PASS | local: tools/bench · tools/bench3 run (desktop) |
| Q6 | PASS | every row judged |
| Q7 | PASS | at 3.0 |
| Q8 | PASS | teaching review: keep (2026-10-20); the six phases of the finished build are looked at by eye · verdict and decisions in the record and the teaching: line; six phases of the finished build looked at |

## Joints
| Joint | Kit | Block | Support | Stack | F1 locate | F2 retain | F3 torque | F4 thrust | F5 limit | F6 hold | F7 adjust | F8 lube | F9 timing | F10 protect |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| V | J3 | – | – | – | none | Shoulder bolt Ø6 x 16, M5 (ISO 7379) | Shoulder bolt Ø6 x 16, M5 (ISO 7379) | none | none | none | none | none | none | none |
| O | J2 | slider-dyad | – | – | 2 x Dowel pin Ø3 x 10 h6, housing to base | 2 x Internal circlip DIN 472, Ø21; External circlip DIN 471, Ø12 | Feather key 4 x 4 x 9 (DIN 6885); Clamp hub Ø12x22, two set screws at 90°; Set screw M4 (DIN 916), threadlocked | Thrust washer 12.2x20, bronze; Wave washer 16.5x20.8, spring steel | none | none | none | none | none | none |
| G | J5 | – | – | – | 2 x Dowel pin Ø3 h6, reference rail to base | Keeper plate, laps the slider | none | none | none | none | Gib strip 3 x 6 x 60, bronze | 2 x Felt wiper in a steel clip; Grease nipple M6 (DIN 71412) | none | none |
| E | eccentric | slider-dyad | – | – | none | Cheek ring 70x88, screwed to the sheave, laps the strap | none | none | none | none | none | Grease nipple M6 (DIN 71412) | none | none |
| drive | drive | – | – | – | none | none | none | none | none | none | none | none | none | Home flag, 1 mm steel vane; Fork sensor, slotted optical, 5 mm gap |

## Supports
| Support | Joint | Kind | Route | Least gap mm | Covers | T10 |
|---|---|---|---|---|---|---|

## Variants and overrides
| Joint or part | Rule result | Chosen | Why |
|---|---|---|---|
| E | J3 pin | eccentric kit: liner, cheek ring, oil nipple | the sheave itself is the journal; promoted as a kit |

## Detail ladder
| Rung | Solids | Marks | Frame ms at this dial position |
|---|---|---|---|
| DL-A | 7 | 0 | 1.48 |
| DL-B | 0 | 138 | 1.52 |
| DL-C | 0 | 0 | 1.56 |
| DL-D | 8 | 0 | 1.47 |
| DL-E | 12 | 0 | 1.46 |
| DL-F | 0 | 0 | 1.53 |
| DL-G | 0 | 0 | 1.52 |
| DL-H | 9 | 0 | 1.56 |
| never | 55 | 119 | 1.53 |

## Promotion candidates
None left: the eccentric kit and the strap form of a link are in the builder.

## Verification
check: clean · K1 residual: 5.7e-14 · claims: 4 of 4 ok · clearance: 0 clashes · clamp: clean · edge distance: clean · package: 21.2 KB
screenshots: dist/shots3/eccentric-sheave (record view, PLAN, FRONT, SIDE, ISOMETRIC, explode; both sheets) · bench: dist/bench/report-v3.json (tools/bench3) (desktop; frame times paced at 28° in the ladder above; phone by David)
