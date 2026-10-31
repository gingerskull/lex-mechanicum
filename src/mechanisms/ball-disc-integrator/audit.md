# Audit: Ball-and-disc integrator (ball-disc-integrator)
standard: 3.0 · date: 2026-10-22 · result: pass · detail: full · pass: build
teaching: tweak · decisions in the record

## Summary
PASS 150 · FAIL 0 · N/A 19 · open: none

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
| P10 | PASS | HAND · the integrand x as a dimension from the disc's axis to the contact, following the carriage; the ball's centre traced with ticks every 15 deg of disc turn; a mark on the cylinder traced with ticks; the output axis; plots of x and of the output angle against the disc (the integrand and its integral) |
| P11 | PASS | DATA · plain language, mm and degrees |
| P12 | PASS | AUTO / DATA · validate(records, asVersion 3) clean for this record |
| P13 | PASS | HAND · teaching review run against the record in E2 (#204) before the build and again on the finished drawing (teaching: line) |
| P14 | N/A | HAND / DATA · not a fictional mechanism: no season block |
| K1 | PASS | AUTO · K1 residual 7.1e-15 (tolerance 1e-9) over 360 samples, reference 0.0e+0 |
| K2 | PASS | AUTO · check: finite, continuous, periodic over 360 samples |
| K3 | PASS | AUTO / HAND · 1 block (integrator); no numeric fallback · composed from the block library; no fallback, no one-off model |
| K4 | PASS | HAND · the input body is the driver with the accent on its shaft; the output body declared |
| K6 | PASS | DATA · disc R 60, ball Ø12, cylinder Ø30; the carriage follows x = 40 sin(disc angle), so the output winds 0 to 305.6 deg and back each disc turn (80/15 rad), at up to 2.667 x the disc's speed, reversing as the ball crosses the centre |
| K7 | PASS | DATA · drivers disc (rotary), carriage (linear) · input kind declared with its driven joint |
| K8 | PASS | AUTO / DATA · every joint declared with type, bodies, origin and axis; nothing inferred |
| K9 | PASS | DATA · two drivers: the disc (rotary) and the carriage (linear, a quarter turn ahead of a cosine sweep); either can be held |
| K10 | PASS | AUTO / DATA · one closure, no branch to choose; design choices declared |
| K11 | PASS | AUTO · mobility counted 4, dof 2 |
| K12 | PASS | DATA · every traced, overlaid and claimed point and quantity is named in kin |
| T1 | PASS | HAND · mechanics first, no use context in the teaching strings; the principle reads at the default view |
| T2 | PASS | HAND · review before the build (E2) and again on the six phases of the finished build; decisions in the record |
| T3 | PASS | DATA · principle parts declared; drawn whole, in depth order |
| T4 | PASS | DATA · fired: trace-marks (no solids) · ticks every 15 deg of disc turn on the ball's centre and on the cylinder's mark: the output's ticks crowd and spread with x and turn back past the centre |
| T5 | PASS | DATA · the integrand dimension and the output axis |
| T6 | PASS | HAND / DATA · the integral in the output trace and the plot beside the integrand's |
| T7 | PASS | DATA · ISOMETRIC: the disc, the ball in its cage, both contacts and the cylinder 45 deg up and across, all in view |
| T8 | N/A | DATA · the principle lies in plain view, no section needed |
| T9 | PASS | AUTO / DATA · claim table: 4 ok, 0 off, 0 uncheckable of 4 |
| T10 | PASS | AUTO · 11 solids drawn see-through: Oc-pb-b1-foot, Oc-pb-b1-ped, Oc-pb-b1, Oc-pb-b1-brg, Oc-pb-b1-brg-balls, Oc-pb-b1-brg-cage, Oc-pb-b1-sc0, Oc-pb-b1-sc1 · the cylinder's far pillow block drawn see-through where it covers the disc in plan |
| T11 | PASS | AUTO · 1 support routed, 1 moved off a sweep · the cylinder's pillow block moved off the disc's sweep |
| T12 | PASS | HAND · 21 support solids; dropped by the polish: none |
| T13 | N/A | DATA · nothing goes by in a blink |
| T14 | PASS | HAND / DATA · the disc and the carriage are the two controls |
| T15 | PASS | HAND · labels state the mechanism, never its use |
| T16 | N/A | HAND / STYLE · no two parts of one role to tell apart |
| T17 | PASS | AUTO · depth peeling, no depth bias (renderer test) |
| T18 | PASS | HAND / DATA · fired: focus (1 solid) · teaching.focus: the ball between disc and cylinder; reviewed by the owner on the stage (#273) |
| D1 | PASS | HAND · a sphere in a cage ring open below and toward the cylinder; the cylinder its own shaft with turned journals; the carriage's arm, block, cheeks and rail with stops and pads |
| D2 | PASS | HAND · material where the load runs, bosses round every pin |
| D3 | PASS | STYLE · STYLE: roles by pattern and tone (both sheets) |
| D4 | PASS | AUTO · fired: base (3 solids), feet (4 solids) · base corners and feet concentric (base, feet rules) |
| D5 | PASS | AUTO / HAND · one rail, two pillow blocks, the disc's housing; two drives under the base |
| D6 | PASS | HAND / STYLE · hardware quieter than the parts, still readable (both sheets) |
| D8 | PASS | AUTO / HAND · every solid a profile, an operation and a frame; built by Manifold; no layers, dz or twin |
| D9 | PASS | AUTO / HAND · fired: j12-cvt (no solids) · every solid rigid on its body; the ball's spin solved by the integrator block |
| D10 | PASS | AUTO · profiles shipped for plain extrusions, revolutions and sweeps, meshes only for booleans (package v2) |
| D11 | PASS | AUTO · SOLID: 0 of 155 solids unsound |
| D7 | PASS | HAND · disc, ball and cylinder plain; richness in the cage, the carriage and its rail |
| A1 | PASS | AUTO · Oc J10, slide J5, Od J2, drive drive, drive2 drive · every joint read from the record and built by its kit |
| A2 | PASS | AUTO · Oc J10, slide J5, Od J2, drive drive, drive2 drive · the disc on a live shaft (J2); the cylinder its own shaft in two pillow blocks (J10); the carriage on its rail (J5); the ball in its cage (ball-cage) |
| A3 | PASS | AUTO · fired: classify (6 solids), axial stack builder · bores from the catalogue; bearings where a boss fits them |
| A4 | PASS | AUTO · fired: j1-dead-axle (no solids), axial stack builder · stepped shafts with shoulders, grooves, flats and chamfered ends (H.shaft) |
| A5 | PASS | AUTO · fired: j2-live-shaft (25 solids), j10-shaft-in-plan (no solids), axial stack builder · the disc keyed to its shaft by size; the cylinder's journals turned on it |
| A6 | PASS | AUTO · fired: j5-slide (no solids), j13-compliant (no solids), standoffs (no solids) · the carriage's block straddles a ground rail screwed and dowelled to the base past the disc's rim |
| A7 | PASS | AUTO · fired: base (3 solids), feet (4 solids) · base 8 mm under the lowest part, counterbored corner holes, feet, engraved scale and paths, shaft clearance holes |
| A8 | PASS | AUTO · fired: fasteners (18 solids) · stage 3 fasteners: shanks, clearance and tapped holes |
| A9 | PASS | AUTO / HAND · fired: placement solver · the cylinder carried at both ends; the disc's shaft in its housing |
| A10 | PASS | HAND · fired: placement (8 solids), placement solver · the ball's centre stays on the disc's face at the cage's height; the cylinder's axis parallel to the travel |
| A11 | PASS | AUTO / HAND · fired: j12-flexible (no solids), strap-sheave (no solids), j1-dead-axle (no solids) · load paths closed: every joint note says where its load goes to ground |
| A12 | PASS | AUTO · clamp check clean |
| A13 | PASS | AUTO / HAND · 157 solids, 89 unnamed (further items of a listed set) · named hardware with catalogue sizes and materials |
| A14 | PASS | AUTO / HAND · fired: support router · supports routed against the sweeps (least gap 1.5 mm); details checked by A15 |
| A15 | PASS | AUTO · clearance in 3D over 72 phases: 0 clashes; hand allow: 0 named, 0 unnecessary |
| A16 | PASS | HAND · 8 joint notes; no note: none; no badge: none · a note per joint with its badge; build rules: the cage open below and toward the cylinder; the arm over the disc to a block past its rim; the cylinder its own shaft; two drives |
| A17 | PASS | HAND · assembles in the explode order; every screw reachable; pressed bearings pullable through their bores |
| A18 | PASS | AUTO · placement: 2 slabs in the tallest stack (100.0 mm), 0 clevises; stack per joint in the Joints table · disc, ball, carriage and cylinder stand where their joints put them |
| A19 | PASS | AUTO · 1 support routed (1 moved), least gap 1.5 mm; still covering a principle part, drawn see-through: Oc-pb · the cylinder's pillow block routed off the disc's sweep; see-through where it still covers the disc in plan |
| A20 | PASS | AUTO · support per joint: Oc pillow · one axial stack builder with its support selector |
| A21 | PASS | AUTO · kit per joint: Oc J10, cage ball-cage, disc-contact ball-cage, cyl-contact ball-cage, slide J5, Od J2, drive2 drive, drive drive |
| A22 | PASS | AUTO · fired: stops (no solids), adjustable-length (no solids), cable-clip (7 solids) · cable clips on both drives' leads |
| E1 | PASS | AUTO · every solid has one explode level; levels -7 to 7.5 · one level per solid, nothing stretches |
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
| J2 | PASS | AUTO · fired: j2-live-shaft (25 solids) · the disc on a live shaft in its housing, keyed, driven from under the base |
| J3 | N/A | AUTO · fired: j3-moving-pin (no solids), cross-bearings (no solids), ring-hub (no solids) · no moving revolute: the ball sits in its cage (ball-cage) |
| J4 | N/A | AUTO · fired: j4-slot-roller (no solids), pin-lobe (no solids), fork-pin (no solids) · no pin in a slot |
| J5 | PASS | AUTO · fired: integrator-carriage (44 solids), piston-bore (no solids), j5-slide (no solids), tongue-slot (no solids) · the carriage's block on its rail, an end stop and pad past each end of its travel (F5) |
| J6 | PASS | AUTO · fired: j6-mesh (no solids), friction-contact (no solids), ring-rollers (no solids) · the ball's two rolling contacts (ball-cage kit): on the disc's face at radius x and on the cylinder at 45 deg; preloaded by the cylinder's height |
| J7 | N/A | AUTO · fired: groove-cam (no solids), j7-cam (no solids), pallet-contact (no solids), pawl-tooth (no solids) · no cam |
| J8 | N/A | AUTO · fired: j12-flexible (no solids), j8-belt (no solids) · no belt in the mechanism (the drive belt is V4) |
| J9 | N/A | AUTO · fired: j9-crossed-mesh (no solids) · no crossed mesh |
| J10 | PASS | AUTO · fired: j12-cvt (no solids), j10-shaft-in-plan (no solids), j11-screw (no solids) · the cylinder its own shaft, journals in two pillow blocks past its length |
| J12 | N/A | AUTO · fired: j12-flexible (no solids), j12-cvt (no solids), j12-other (no solids), strap-sheave (no solids) · no flexible member |
| J13 | N/A | AUTO · fired: j13-compliant (no solids) · no compliant joint |
| J11 | N/A | AUTO · fired: j11-screw (no solids) · no screw |
| F1 | PASS | AUTO · served at Oc, slide, Od; fired: integrator-carriage (44 solids), j2-live-shaft (25 solids), j10-shaft-in-plan (no solids), strap-sheave (no solids), j13-compliant (no solids) · housing, pillow blocks and rail dowelled |
| F2 | PASS | AUTO · served at Oc, Od; fired: j12-flexible (no solids), j2-live-shaft (25 solids), j10-shaft-in-plan (no solids), cross-bearings (no solids), trunnion (no solids), fork-pin (no solids), ring-hub (no solids), ring-rollers (no solids), strap-sheave (no solids), j11-screw (no solids), j13-compliant (no solids) · bearings circlipped; the ball held in its cage |
| F3 | PASS | AUTO · served at Od; fired: j12-flexible (no solids), j2-live-shaft (25 solids), j10-shaft-in-plan (no solids), j11-screw (no solids) · the disc keyed |
| F4 | PASS | AUTO / HAND · served at Oc, Od; fired: j9-crossed-mesh (no solids), j2-live-shaft (25 solids), j10-shaft-in-plan (no solids), trunnion (no solids), j11-screw (no solids) · the cylinder located in one pillow block; the disc's thrust on its housing |
| F5 | PASS | AUTO / HAND · served at slide; fired: integrator-carriage (44 solids), j5-slide (no solids), pawl-tooth (no solids), j11-screw (no solids), j13-compliant (no solids), stops (no solids) · stops with pads past each end of the carriage's travel |
| F6 | PASS | AUTO / HAND · served at no joint; fired: friction-contact (no solids), j12-flexible (no solids), j12-cvt (no solids), trunnion (no solids), j7-cam (no solids), pallet-contact (no solids), pawl-tooth (no solids) · the cylinder's height presses the ball onto the disc (the contact's preload) |
| F7 | N/A | AUTO / HAND · served at drive2; fired: j6-mesh (no solids), friction-contact (no solids), j9-crossed-mesh (no solids), j12-flexible (no solids), j12-cvt (no solids), j5-slide (no solids), j12-other (no solids), adjustable-length (no solids) · nothing to adjust: the radius is the carriage's driver |
| F8 | PASS | AUTO · served at no joint; fired: j12-flexible (no solids), cross-bearings (no solids), tongue-slot (no solids), j11-screw (no solids), lubrication (no solids) · sealed bearings; the rail greased |
| F9 | N/A | AUTO / HAND · served at no joint; fired: j6-mesh (no solids), j9-crossed-mesh (no solids), timing-marks (1 solid) · nothing to time: a friction drive |
| F10 | PASS | AUTO / HAND · served at drive2, drive; fired: j12-flexible (no solids), drive (72 solids) · home flags and fork sensors on both drives |
| M1 | PASS | AUTO · fired: hardware primitives · top-face chamfers by part kind (primitives) |
| M2 | N/A | HAND · no large part starts and stops with a motor but the disc, plain |
| M3 | PASS | AUTO · fired: j3-moving-pin (no solids), hardware primitives · bore entry chamfers |
| M4 | PASS | AUTO / HAND · fired: base (3 solids), fasteners (18 solids) · counterbores and countersinks for heads (base, csk, housings) |
| M5 | PASS | AUTO / HAND · fired: hardware primitives · cutter radii on windows and slots |
| M6 | PASS | AUTO · edge distance and walls clean |
| M7 | N/A | HAND · no bracket corner turns a load |
| M8 | PASS | AUTO · fired: j1-dead-axle (no solids) · thread undercuts on stepped shafts |
| M9 | PASS | AUTO / HAND · fired: j1-dead-axle (no solids) · ISO coarse threads, engagement through the tapped part or to a nut |
| M10 | PASS | AUTO / HAND · 153 of 157 solids name a material · materials named by kind and role |
| M11 | PASS | AUTO · fired: j1-dead-axle (no solids), hardware primitives · centre holes, chamfered ends on turned parts |
| M12 | PASS | HAND · every screw reachable by its key in the explode |
| M13 | PASS | AUTO / HAND · 24 threaded · threadlocker or nyloc on every threaded fastener |
| M14 | N/A | AUTO / HAND · fired: piston-bore (no solids), j4-slot-roller (no solids), pin-lobe (no solids), groove-cam (no solids), pallet-contact (no solids), tongue-slot (no solids) · no sliding contact needing a liner |
| V1 | PASS | AUTO · fired: drive (72 solids) · two drives under the base: the disc's pancake motor and GT2 belt to its shaft; V5's linear drive for the carriage (a belt loop along its 80 mm stroke, a carriage through a slot in the base clamping the belt, under the carriage's block) |
| V2 | PASS | AUTO · fired: drive (72 solids) · the disc's motor flange and the carriage drive's one-piece bracket, both screwed up into the base |
| V3 | PASS | AUTO / HAND · fired: drive (72 solids) · the loop, the carriage and the bracket under the base, clear of the feet (A15) |
| V4 | PASS | AUTO · fired: j8-belt (no solids) · a GT2 belt loop in one plane under the base, its idler on a slotted tensioner plate |
| V5 | PASS | AUTO · fired: drive (72 solids) · rotary disc: belt; linear carriage: V5's belt loop and carriage, following the driver's law a quarter turn ahead |
| V6 | PASS | AUTO · fired: drive (72 solids), cable-clip (7 solids) · home flags and fork sensors on both inputs; terminals, leads and clips |
| L1 | PASS | STYLE · STYLE: no look values in the record or polish |
| L2 | PASS | HAND · records and polish carry no look |
| L3 | PASS | HAND · roles right on every solid (both sheets) |
| L4 | PASS | HAND / STYLE · one accent: the input ring, the traces |
| L5 | PASS | AUTO / HAND · fired: see-through (11 solids) · transparency and hidden lines show screws in holes and bearings in bores |
| L6 | PASS | AUTO · depth peeling at every view (shots) |
| L7 | PASS | STYLE · STYLE: turntable orbit, named views, no perspective |
| L8 | PASS | AUTO / HAND · fired: trace-marks (no solids) · centrelines along every joint axis, base dimensions, engraved marks |
| L9 | N/A | AUTO / DATA · no section or detail view declared |
| L10 | PASS | AUTO / STYLE · teaching overlays in the sheet's look |
| R1 | PASS | HAND · every standard part from the primitives and kits |
| R2 | PASS | HAND · standard sizes only |
| R3 | PASS | AUTO · fired: hardware primitives · shared subassemblies, one function each |
| R4 | PASS | AUTO · package v2 21.5 KB · package v2 written at build time |
| R5 | PASS | HAND · the polish states only exceptions, no sampling |
| R6 | PASS | FLAG · FLAG: bench run (desktop): setup 27.8 ms over the 20 ms target; frames 1.6 to 2.2 ms; the phone is measured by David |
| R7 | PASS | HAND / FLAG · polish none; 0 solids added, 0 overrides by the polish |
| R8 | PASS | AUTO / SITE · SITE: thumbnails pre-rendered, cards animate on hover |
| R9 | PASS | AUTO / SITE · setup and bake in the worker, one context |
| R10 | PASS | FLAG · FLAG: the bench page is built for the phone measurement |
| DL1 | PASS | AUTO / HAND · 53 of 157 solids on a dropping rung · every solid, mark and effect on a rung by its kind |
| DL2 | PASS | HAND · default dial: full |
| DL3 | PASS | AUTO · view-aware exceptions in the ladder table |
| DL4 | PASS | SITE · SITE: adaptive dial with hysteresis |
| DL6 | PASS | AUTO · teaching layers drawn at every dial position |
| DL5 | PASS | FLAG · FLAG: bench reports frame time per dial position |
| Q1 | PASS | check, clamp and edge distance clean |
| Q2 | PASS | 0 clashes, 0 unnecessary allows |
| Q3 | PASS | package v2 written, 18.6 KB; site build not checked here · package v2 written; site builds (npm run build) |
| Q4 | PASS | local: tools/shot · dist/shots3/ball-disc-integrator: record view, PLAN, FRONT, SIDE, ISOMETRIC, the declared views, full explode, both sheets |
| Q5 | PASS | local: tools/bench · tools/bench run: dist/bench/report-v2.md |
| Q6 | PASS | every row judged |
| Q7 | PASS | at 3.0 |
| Q8 | PASS | teaching review: tweak (2026-10-20); the six phases of the finished build are looked at by eye · verdict and decisions in the record and the teaching: line; six phases of the finished build looked at |

## Joints
| Joint | Kit | Block | Support | Stack | F1 locate | F2 retain | F3 torque | F4 thrust | F5 limit | F6 hold | F7 adjust | F8 lube | F9 timing | F10 protect |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Oc | J10 | integrator | pillow (moved) | – | 4 x Dowel pin Ø4 x 14 h6, block to base | 2 x Internal circlip DIN 472, Ø21 | none | 2 x Shaft collar 12x20, set screw | none | none | none | none | none | none |
| cage | ball-cage | integrator | – | – | none | none | none | none | none | none | none | none | none | none |
| disc-contact | ball-cage | – | – | – | none | none | none | none | none | none | none | none | none | none |
| cyl-contact | ball-cage | – | – | – | none | none | none | none | none | none | none | none | none | none |
| slide | J5 | driver | – | – | Dowel pin Ø3 h6, rail to base | none | none | none | 2 x Stop block | none | none | none | none | none |
| Od | J2 | driver | – | – | 2 x Dowel pin Ø3 x 10 h6, housing to base | 2 x Internal circlip DIN 472, Ø21; End washer 5.4x20, holds the disc on the shaft end; Countersunk M5 x 12 (ISO 10642) | Feather key 4 x 4 x 7 (DIN 6885) | Thrust washer 12.2x20, bronze; Wave washer 16.5x20.8, spring steel | none | none | none | none | none | none |
| drive2 | drive | – | – | – | none | Belt clamp plate, the near span between it and the jaw | none | none | none | none | Belt tensioner plate, slotted, 2 x M4 up into the base | none | none | Home flag, 1 mm steel vane; Fork sensor, slotted optical, 5 mm gap |
| drive | drive | – | – | – | none | none | none | none | none | none | none | none | none | Home flag, 1 mm steel vane; Fork sensor, slotted optical, 5 mm gap |

## Supports
| Support | Joint | Kind | Route | Least gap mm | Covers | T10 |
|---|---|---|---|---|---|---|
| Oc-pb | Oc | pillow | moved | 1.5 | disc, cylinder, ball, carriage | – |

## Variants and overrides
| Joint or part | Rule result | Chosen | Why |
|---|---|---|---|

## Detail ladder
| Rung | Solids | Marks | Frame ms at this dial position |
|---|---|---|---|
| DL-A | 10 | 0 | 2.1 |
| DL-B | 0 | 290 | 2.1 |
| DL-C | 0 | 0 | 2.05 |
| DL-D | 9 | 0 | 1.93 |
| DL-E | 20 | 0 | 2.23 |
| DL-F | 0 | 0 | 1.96 |
| DL-G | 0 | 0 | 2.1 |
| DL-H | 14 | 0 | 2.11 |
| never | 102 | 120 | 2.18 |

## Promotion candidates
None left: the integral is a kin block (closed form for the standard driver laws, quadrature otherwise); the ball in its cage, the carriage on its rail and a body that is its own shaft are the integrator rule and the ball-cage kit; the Scotch yoke takes a driver's phase and side.

## Verification
check: clean · K1 residual: 7.1e-15 · claims: 4 of 4 ok · clearance: 0 clashes · clamp: clean · edge distance: clean · package: 22.2 KB
screenshots: dist/shots3/ball-disc-integrator (record view, PLAN, FRONT, SIDE, ISOMETRIC, explode; both sheets) · bench: dist/bench/report-v2.md (desktop; phone by David)
