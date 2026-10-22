# Audit: Friction wheel drive (friction-wheel-drive)
standard: 3.0 · date: 2026-10-22 · result: pass · detail: full · pass: build
teaching: tweak · decisions in the record

## Summary
PASS 146 · FAIL 0 · N/A 21 · open: none

## Requirements
| Id | Status | Evidence / action |
|---|---|---|
| S1 | PASS | DATA · the standard carries version 3.0 and its changelog |
| S2 | PASS | HAND · header with standard, date, result, detail, pass and the teaching: line |
| S3 | PASS | AUTO · tools/conformance reads this sheet (engine v3) and runs in npm run check |
| S4 | PASS | SITE · the pass issue holds only this mechanism's decisions; plan and status in #218 |
| S5 | PASS | SITE · 3D stamp in the title block (every shot) and on the card and page header (site) |
| S6 | PASS | AUTO · rebuilt from its record v3 in rebuild batch R7 (#218): bound by 3.0 from this pass |
| P1 | PASS | DATA · record v3 complete (kin and teaching blocks); no polish, audit.md present |
| P2 | PASS | DATA · catalogue validator clean |
| P3 | PASS | DATA / SITE · the page reads ratio, axes, character, backdrivable, aka, family, motion, level, dof and the drive from the record |
| P4 | PASS | DATA · tags grouped Function, Property, Application, keywords |
| P5 | PASS | DATA · explanation in four parts and the examples from the record |
| P6 | PASS | DATA · references and media from the record, validated by the catalogue |
| P7 | PASS | HAND / SITE · no prose in a polish; labels come from the record |
| P8 | PASS | SITE · the page has no parts list or joint sections (site) |
| P9 | PASS | AUTO / HAND · every number the explanation states that the motion can check is a claim and agrees (T9) |
| P10 | PASS | HAND · a point of the tyre traced with ticks every 15 deg of input, ghost tread paths at R 30 (1:1) and R -30 (reverse); the contact circle, the contact radius R and the wheel axis; plot of the wheel's angle |
| P11 | PASS | DATA · plain language, mm and degrees |
| P12 | PASS | AUTO / DATA · validate(records, asVersion 3) clean for this record |
| P13 | PASS | HAND · teaching review run against the record in E2 (#204) before the build and again on the finished drawing (teaching: line) |
| K1 | PASS | AUTO · K1 residual 7.1e-15 (tolerance 1e-9) over 360 samples, reference 0.0e+0 |
| K2 | PASS | AUTO · check: finite, continuous, periodic over 360 samples |
| K3 | PASS | AUTO / HAND · 1 block (gear-mesh); no numeric fallback · composed from the block library; no fallback, no one-off model |
| K4 | PASS | HAND · the input body is the driver with the accent on its shaft; the output body declared |
| K6 | PASS | DATA · disc 100, wheel 30 with its tyre, shaft 30 over the face crossing the disc's axis: the wheel turns R / rw of the disc, sign with R (3.0 at R 90, still at the centre, -1.0 at R -30) |
| K7 | PASS | DATA · drivers disc (rotary) · input kind declared with its driven joint |
| K8 | PASS | AUTO / DATA · every joint declared with type, bodies, origin and axis; nothing inferred |
| K9 | PASS | DATA · one rotary driver; the contact radius R a param control (T14) |
| K10 | PASS | AUTO / DATA · one closure |
| K11 | PASS | AUTO · mobility counted 1, dof 1 |
| K12 | PASS | DATA · every traced, overlaid and claimed point and quantity is named in kin |
| T1 | PASS | HAND · mechanics first, no use context in the teaching strings; the principle reads at the default view |
| T2 | PASS | HAND · review before the build (E2) and again on the six phases of the finished build; decisions in the record |
| T3 | PASS | DATA · principle parts declared; drawn whole, in depth order |
| T4 | PASS | DATA · fired: trace-marks (no solids) · the tread traced with equal-time ticks; ghosts at R 30 and R -30 |
| T5 | PASS | DATA · the contact circle on the disc, the contact radius R as a dimension, the wheel axis |
| T6 | PASS | HAND / DATA · at R 60 the wheel turns twice per disc turn; the R control moves the wheel along its shaft, the ghosts show 1:1 and reverse |
| T7 | PASS | DATA · ISOMETRIC: the disc's face, the wheel on edge and its shaft across the disc |
| T8 | N/A | DATA · the principle lies in plain view, no section needed |
| T9 | PASS | AUTO / DATA · claim table: 2 ok, 0 off, 0 uncheckable of 2 |
| T10 | N/A | AUTO · 0 solids drawn see-through · nothing static covers the disc or the wheel in the default view |
| T11 | PASS | AUTO · 1 support routed, 1 moved off a sweep · the wheel shaft's pillow blocks routed past the disc's rim on both sides and past the wheel's whole range |
| T12 | PASS | HAND · 14 support solids; dropped by the polish: none |
| T13 | N/A | DATA · nothing goes by in a blink |
| T14 | PASS | HAND / DATA · the input and the contact radius R (a param, its range -30 to 90); the R control moves the built wheel along its shaft |
| T15 | PASS | HAND · labels state the mechanism, never its use |
| T16 | N/A | HAND / STYLE · no two parts of one role to tell apart |
| T17 | PASS | AUTO · depth peeling, no depth bias (renderer test) |
| D1 | PASS | HAND · a plain ground disc; the wheel a hub under its rubber tyre on a live shaft in plan |
| D2 | PASS | HAND · material where the load runs, bosses round every pin |
| D3 | PASS | STYLE · STYLE: roles by pattern and tone (both sheets) |
| D4 | PASS | AUTO · fired: base (3 solids), feet (4 solids) · base corners and feet concentric (base, feet rules) |
| D5 | PASS | AUTO / HAND · two pillow blocks, the disc's housing, one motor flange |
| D6 | PASS | HAND / STYLE · hardware quieter than the parts, still readable (both sheets) |
| D8 | PASS | AUTO / HAND · every solid a profile, an operation and a frame; built by Manifold; no layers, dz or twin |
| D9 | N/A | AUTO / HAND · no member changes shape |
| D10 | PASS | AUTO · profiles shipped for plain extrusions, revolutions and sweeps, meshes only for booleans (package v2) |
| D11 | PASS | AUTO · SOLID: 0 of 97 solids unsound |
| D7 | PASS | HAND · disc and wheel plain; richness in the stacks and the tyre |
| A1 | PASS | AUTO · contact J6, Od J2, Ow J10, drive drive · every joint read from the record and built by its kit |
| A2 | PASS | AUTO · contact J6, Od J2, Ow J10, drive drive · the disc on a live shaft (J2), the wheel on a live shaft in plan (J10); the friction contact (J6 recorded) by its rule |
| A3 | PASS | AUTO · fired: classify (3 solids), axial stack builder · bores from the catalogue; bearings where a boss fits them |
| A4 | PASS | AUTO · fired: j1-dead-axle (no solids), axial stack builder · stepped shafts with shoulders, grooves, flats and chamfered ends (H.shaft) |
| A5 | PASS | AUTO · fired: j2-live-shaft (28 solids), j10-shaft-in-plan (33 solids), axial stack builder · keys by shaft size; the wheel's hub clamped where it is set |
| A6 | N/A | AUTO · fired: j5-slide (no solids), j13-compliant (no solids), standoffs (no solids) · no slide and no floating plate |
| A7 | PASS | AUTO · fired: base (3 solids), feet (4 solids) · base 8 mm under the lowest part, counterbored corner holes, feet, engraved scale and paths, shaft clearance holes |
| A8 | PASS | AUTO · fired: fasteners (16 solids) · stage 3 fasteners: shanks, clearance and tapped holes |
| A9 | PASS | AUTO / HAND · fired: placement solver · the wheel shaft held at both ends past the disc's rim; the disc's shaft in its housing |
| A10 | PASS | HAND · fired: placement (4 solids), placement solver · disc and wheel on their own axes; nothing stacked to clear |
| A11 | PASS | AUTO / HAND · fired: j12-flexible (no solids), strap-sheave (no solids), j1-dead-axle (no solids) · load paths closed: every joint note says where its load goes to ground |
| A12 | PASS | AUTO · clamp check clean |
| A13 | PASS | AUTO / HAND · 97 solids, 54 unnamed (further items of a listed set) · named hardware with catalogue sizes and materials |
| A14 | PASS | AUTO / HAND · fired: support router · supports routed against the sweeps (least gap 1.5 mm); details checked by A15 |
| A15 | PASS | AUTO · clearance in 3D over 72 phases: 0 clashes; hand allow: 0 named, 0 unnecessary |
| A16 | PASS | HAND · 4 joint notes; no note: none; no badge: none · a note per joint with its badge; build rules: a friction contact with no teeth, preloaded by the tyre; the wheel set along its shaft by the ratio control and clamped; the wheel shaft spans the disc |
| A17 | PASS | HAND · assembles in the explode order; every screw reachable; pressed bearings pullable through their bores |
| A18 | PASS | AUTO · placement: 1 slabs in the tallest stack (12.0 mm), 0 clevises; stack per joint in the Joints table · placement: the disc on its slab, the wheel on its shaft in plan |
| A19 | PASS | AUTO · 1 support routed (1 moved), least gap 1.5 mm; still covering a principle part, drawn see-through: Ow-pb · the pillow blocks routed past the disc's sweep; least gap 1.5 mm |
| A20 | PASS | AUTO · support per joint: Ow pillow · one axial stack builder with its support selector |
| A21 | PASS | AUTO · kit per joint: contact J6, Od J2, Ow J10, drive drive |
| A22 | PASS | AUTO · fired: stops (no solids), adjustable-length (no solids), cable-clip (2 solids) · cable clip |
| E1 | PASS | AUTO · every solid has one explode level; levels -11.5 to 11 · one level per solid, nothing stretches |
| E2 | PASS | AUTO · fired: explode (1 solid) · heads, shanks, washers and nuts move as one |
| E3 | PASS | AUTO · fired: explode (1 solid) · screws back out along their axes |
| E4 | PASS | HAND · last fitted goes furthest (explode shots, both sheets) |
| E5 | PASS | AUTO · fired: explode (1 solid) · pressed bearings, bushings and clips stay with their parts |
| E6 | PASS | AUTO · fired: explode (1 solid) · motor, bearings and pulley pair whole |
| E7 | PASS | AUTO · fired: explode (1 solid) · loose spacers midway |
| E8 | PASS | AUTO · fired: explode (1 solid) · keyed parts keep their order on their shaft |
| E9 | PASS | HAND · full explode readable in ISOMETRIC on both sheets, nothing leaves the frame |
| E10 | PASS | AUTO · fired: explode (1 solid) · each stack explodes along its joint axis, with trail lines |
| J1 | N/A | AUTO · fired: trunnion (no solids), j1-dead-axle (no solids) · no dead axle |
| J2 | PASS | AUTO · fired: j2-live-shaft (28 solids) · the disc's shaft: housing, keyed |
| J3 | N/A | AUTO · fired: j3-moving-pin (no solids), cross-bearings (no solids), ring-hub (no solids) · no moving revolute |
| J4 | N/A | AUTO · fired: j4-slot-roller (no solids), pin-lobe (no solids), fork-pin (no solids) · no pin in a slot |
| J5 | N/A | AUTO · fired: piston-bore (no solids), j5-slide (no solids), tongue-slot (no solids) · no plain slide |
| J6 | PASS | AUTO · fired: j6-mesh (no solids), friction-contact (1 solid), ring-rollers (no solids) · a friction contact: the rubber tyre on the disc's face, preloaded; no timing marks or backlash eccentric (no teeth) |
| J7 | N/A | AUTO · fired: groove-cam (no solids), j7-cam (no solids), pallet-contact (no solids), pawl-tooth (no solids) · no cam |
| J8 | N/A | AUTO · fired: j12-flexible (no solids), j8-belt (no solids) · no belt in the mechanism (the drive belt is V4) |
| J9 | N/A | AUTO · fired: j9-crossed-mesh (no solids) · no crossed mesh |
| J10 | PASS | AUTO · fired: j10-shaft-in-plan (33 solids), j11-screw (no solids) · the wheel's shaft in two pillow blocks past the disc's rim on both sides, located by collars at one end, floating at the other |
| J12 | N/A | AUTO · fired: j12-flexible (no solids), j12-other (no solids), strap-sheave (no solids) · no flexible member |
| J13 | N/A | AUTO · fired: j13-compliant (no solids) · no compliant joint |
| J11 | N/A | AUTO · fired: j11-screw (no solids) · no screw |
| F1 | PASS | AUTO · served at Od, Ow; fired: j2-live-shaft (28 solids), j10-shaft-in-plan (33 solids), strap-sheave (no solids), j13-compliant (no solids) · housing and blocks dowelled (Joints table) |
| F2 | PASS | AUTO · served at Od, Ow; fired: j12-flexible (no solids), j2-live-shaft (28 solids), j10-shaft-in-plan (33 solids), cross-bearings (no solids), trunnion (no solids), fork-pin (no solids), ring-hub (no solids), ring-rollers (no solids), strap-sheave (no solids), j11-screw (no solids), j13-compliant (no solids) · every bearing retained; the wheel's hub clamped on its shaft |
| F3 | PASS | AUTO · served at Od, Ow; fired: j12-flexible (no solids), j2-live-shaft (28 solids), j10-shaft-in-plan (33 solids), j11-screw (no solids) · both keyed |
| F4 | PASS | AUTO / HAND · served at Od, Ow; fired: j9-crossed-mesh (no solids), j2-live-shaft (28 solids), j10-shaft-in-plan (33 solids), trunnion (no solids), j11-screw (no solids) · thrust washer under the disc; collars on the wheel shaft |
| F5 | N/A | AUTO / HAND · served at no joint; fired: j5-slide (no solids), pawl-tooth (no solids), j11-screw (no solids), j13-compliant (no solids), stops (no solids) · both turn on through the cycle |
| F6 | PASS | AUTO / HAND · served at contact; fired: friction-contact (1 solid), j12-flexible (no solids), trunnion (no solids), j7-cam (no solids), pallet-contact (no solids), pawl-tooth (no solids) · the tyre's rubber, pressed onto the face by the blocks' height, holds the contact's preload |
| F7 | PASS | AUTO / HAND · served at no joint; fired: j6-mesh (no solids), friction-contact (1 solid), j9-crossed-mesh (no solids), j12-flexible (no solids), j5-slide (no solids), j12-other (no solids), adjustable-length (no solids) · the wheel's hub, loosened and slid to set the contact radius, clamped by its set screws; a scale on the base reads the setting |
| F8 | N/A | AUTO · served at no joint; fired: j12-flexible (no solids), cross-bearings (no solids), tongue-slot (no solids), j11-screw (no solids), lubrication (no solids) · sealed bearings; the contact runs dry by design |
| F9 | N/A | AUTO / HAND · served at no joint; fired: j6-mesh (no solids), j9-crossed-mesh (no solids), timing-marks (1 solid) · no phase to keep: a friction pair has no teeth |
| F10 | PASS | AUTO / HAND · served at drive; fired: j12-flexible (no solids), drive (26 solids), yoke-drive (no solids) · home flag and fork sensor on the input (drive) |
| M1 | PASS | AUTO · fired: hardware primitives · top-face chamfers by part kind (primitives) |
| M2 | PASS | HAND · bosses round every loaded hole |
| M3 | PASS | AUTO · fired: j3-moving-pin (no solids), hardware primitives · bore entry chamfers |
| M4 | PASS | AUTO / HAND · fired: base (3 solids), fasteners (16 solids) · counterbores and countersinks for heads (base, csk, housings) |
| M5 | PASS | AUTO / HAND · fired: hardware primitives · cutter radii on windows and slots |
| M6 | PASS | AUTO · edge distance and walls clean |
| M7 | N/A | HAND · no bracket corner turns a load |
| M8 | PASS | AUTO · fired: j1-dead-axle (no solids) · thread undercuts on stepped shafts |
| M9 | PASS | AUTO / HAND · fired: j1-dead-axle (no solids) · ISO coarse threads, engagement through the tapped part or to a nut |
| M10 | PASS | AUTO / HAND · 95 of 97 solids name a material · materials named by kind and role |
| M11 | PASS | AUTO · fired: j1-dead-axle (no solids), hardware primitives · centre holes, chamfered ends on turned parts |
| M12 | PASS | HAND · every screw reachable by its key in the explode |
| M13 | PASS | AUTO / HAND · 11 threaded · threadlocker or nyloc on every threaded fastener |
| M14 | PASS | AUTO / HAND · fired: piston-bore (no solids), j4-slot-roller (no solids), pin-lobe (no solids), groove-cam (no solids), pallet-contact (no solids), tongue-slot (no solids) · the tyre is the replaceable wear part of the contact |
| V1 | PASS | AUTO · fired: drive (26 solids), yoke-drive (no solids) · pancake motor under the base, GT2 32:16 to the disc's shaft |
| V2 | PASS | AUTO · fired: drive (26 solids), yoke-drive (no solids) · one motor flange screwed up into the base |
| V3 | PASS | AUTO / HAND · fired: drive (26 solids) · belt and pulleys clear of feet and housings (A15) |
| V4 | PASS | AUTO · fired: j8-belt (no solids) · flanged pulleys, belt in one plane |
| V5 | PASS | AUTO · fired: drive (26 solids), yoke-drive (no solids) · rotary input: belt to the input pulley |
| V6 | PASS | AUTO · fired: drive (26 solids), yoke-drive (no solids), cable-clip (2 solids) · home flag, fork sensor, terminals, lead and clip |
| L1 | PASS | STYLE · STYLE: no look values in the record or polish |
| L2 | PASS | HAND · records and polish carry no look |
| L3 | PASS | HAND · roles right on every solid (both sheets) |
| L4 | PASS | HAND / STYLE · one accent: the input ring, the traces |
| L5 | PASS | AUTO / HAND · fired: see-through (no solids) · transparency and hidden lines show screws in holes and bearings in bores |
| L6 | PASS | AUTO · depth peeling at every view (shots) |
| L7 | PASS | STYLE · STYLE: turntable orbit, named views, no perspective |
| L8 | PASS | AUTO / HAND · fired: trace-marks (no solids) · centrelines along every joint axis, base dimensions, engraved marks |
| L9 | N/A | AUTO / DATA · no section or detail view declared |
| L10 | PASS | AUTO / STYLE · teaching overlays in the sheet's look |
| R1 | PASS | HAND · every standard part from the primitives and kits |
| R2 | PASS | HAND · standard sizes only |
| R3 | PASS | AUTO · fired: hardware primitives · shared subassemblies, one function each |
| R4 | PASS | AUTO · package v2 17.8 KB · package v2 written at build time |
| R5 | PASS | HAND · the polish states only exceptions, no sampling |
| R6 | PASS | FLAG · FLAG: bench run (desktop): no flag; the phone is measured by David |
| R7 | PASS | HAND / FLAG · polish none; 0 solids added, 0 overrides by the polish |
| R8 | PASS | AUTO / SITE · SITE: thumbnails pre-rendered, cards animate on hover |
| R9 | PASS | AUTO / SITE · setup and bake in the worker, one context |
| R10 | PASS | FLAG · FLAG: the bench page is built for the phone measurement |
| DL1 | PASS | AUTO / HAND · 39 of 97 solids on a dropping rung · every solid, mark and effect on a rung by its kind |
| DL2 | PASS | HAND · default dial: full |
| DL3 | PASS | AUTO · view-aware exceptions in the ladder table |
| DL4 | PASS | SITE · SITE: adaptive dial with hysteresis |
| DL6 | PASS | AUTO · teaching layers drawn at every dial position |
| DL5 | PASS | FLAG · FLAG: bench reports frame time per dial position |
| Q1 | PASS | check, clamp and edge distance clean |
| Q2 | PASS | 0 clashes, 0 unnecessary allows |
| Q3 | PASS | package v2 written, 17.8 KB; site build not checked here · package v2 written; site builds (npm run build) |
| Q4 | PASS | local: tools/shot · dist/shots3/friction-wheel-drive: record view, PLAN, FRONT, SIDE, ISOMETRIC, the declared views, full explode, both sheets |
| Q5 | PASS | local: tools/bench · tools/bench run: dist/bench/report-v2.md |
| Q6 | PASS | every row judged |
| Q7 | PASS | at 3.0 |
| Q8 | PASS | teaching review: tweak (2026-10-20); the six phases of the finished build are looked at by eye · verdict and decisions in the record and the teaching: line; six phases of the finished build looked at |

## Joints
| Joint | Kit | Block | Support | Stack | F1 locate | F2 retain | F3 torque | F4 thrust | F5 limit | F6 hold | F7 adjust | F8 lube | F9 timing | F10 protect |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| contact | J6 | gear-mesh | – | – | none | none | none | none | none | Tyre, rubber 4 mm, vulcanised to the hub: the contact's grip | none | none | none | none |
| Od | J2 | driver | – | – | 2 x Dowel pin Ø3 x 10 h6, housing to base | 2 x Internal circlip DIN 472, Ø21; External circlip DIN 471, Ø12 | Feather key 4 x 4 x 12 (DIN 6885); Clamp hub Ø12x22, two set screws at 90°; Set screw M4 (DIN 916), threadlocked | Thrust washer 12.2x20, bronze; Wave washer 16.5x20.8, spring steel | none | none | none | none | none | none |
| Ow | J10 | – | pillow (moved) | – | 4 x Dowel pin Ø4 x 14 h6, block to base | 2 x Internal circlip DIN 472, Ø21 | Feather key 4 x 4 x 16 (DIN 6885); Clamp hub Ø12x22, two set screws at 90°; Set screw M4 (DIN 916), threadlocked | 2 x Shaft collar 12x20, set screw | none | none | none | none | none | none |
| drive | drive | – | – | – | none | none | none | none | none | none | none | none | none | Home flag, 1 mm steel vane; Fork sensor, slotted optical, 5 mm gap |

## Supports
| Support | Joint | Kind | Route | Least gap mm | Covers | T10 |
|---|---|---|---|---|---|---|
| Ow-pb | Ow | pillow | moved | 1.5 | disc | – |

## Variants and overrides
| Joint or part | Rule result | Chosen | Why |
|---|---|---|---|

## Detail ladder
| Rung | Solids | Marks | Frame ms at this dial position |
|---|---|---|---|
| DL-A | 9 | 0 | 1.48 |
| DL-B | 0 | 201 | 1.47 |
| DL-C | 0 | 0 | 1.41 |
| DL-D | 7 | 0 | 1.45 |
| DL-E | 8 | 0 | 1.33 |
| DL-F | 0 | 0 | 1.34 |
| DL-G | 0 | 0 | 1.4 |
| DL-H | 15 | 0 | 1.38 |
| never | 58 | 151 | 1.39 |

## Promotion candidates
None left: the friction contact (tyre, preload, the setting clamped and read on a scale) is a rule of the builder; pillow blocks reach the range of a part set along its shaft.

## Verification
check: clean · K1 residual: 7.1e-15 · claims: 2 of 2 ok · clearance: 0 clashes · clamp: clean · edge distance: clean · package: 17.8 KB
screenshots: dist/shots3/friction-wheel-drive (record view, PLAN, FRONT, SIDE, ISOMETRIC, explode; both sheets) · bench: dist/bench/report-v2.md (desktop; frame times paced at 28 deg in the ladder above; phone by David)
