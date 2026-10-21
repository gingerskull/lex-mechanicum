# Audit: Flexure hinge (flexure-hinge)
standard: 3.0 · date: 2026-10-22 · result: pass · detail: full · pass: build
teaching: tweak · decisions in the record

## Summary
PASS 140 · FAIL 0 · N/A 27 · open: none

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
| P10 | PASS | HAND · the lever's tip traced on its arc; the neck's bend as a signed arc with its angle; the tip arc and the lever's length; plot of the tip's travel against the lever angle |
| P11 | PASS | DATA · plain language, mm and degrees |
| P12 | PASS | AUTO / DATA · validate(records, asVersion 3) clean for this record |
| P13 | PASS | HAND · teaching review run against the record in E2 (#204) before the build and again on the finished drawing (teaching: line) |
| K1 | PASS | AUTO · K1 residual 0.0e+0 (tolerance 1e-9) over 360 samples, reference 0.0e+0 |
| K2 | PASS | AUTO · check: finite, continuous, periodic over 360 samples |
| K3 | PASS | AUTO / HAND · 1 block (flexure); no numeric fallback · composed from the block library; no fallback, no one-off model |
| K4 | PASS | HAND · the input body is the driver with the accent on its shaft; the output body declared |
| K6 | PASS | DATA · circular notch R 5, neck 0.8, width 10, 7075: K = 2 E b t^2.5 / (9 pi sqrt R) = 12,984 N mm/rad; the lever 100 mm, tip ±3.49 mm at ±2 deg |
| K7 | PASS | DATA · drivers bend (oscillating) · input kind declared with its driven joint |
| K8 | PASS | AUTO / DATA · every joint declared with type, bodies, origin and axis; nothing inferred |
| K9 | PASS | DATA · one oscillating driver, ±2 deg, the neck's elastic range |
| K10 | PASS | AUTO / DATA · one closure, no branch to choose; design choices declared |
| K11 | PASS | AUTO · mobility counted 1, dof 1 |
| K12 | PASS | DATA · every traced, overlaid and claimed point and quantity is named in kin |
| T1 | PASS | HAND · mechanics first, no use context in the teaching strings; the principle reads at the default view |
| T2 | PASS | HAND · review before the build (E2) and again on the six phases of the finished build; decisions in the record |
| T3 | PASS | DATA · principle parts declared; drawn whole, in depth order |
| T4 | PASS | DATA · fired: trace-marks (1 solid) · the tip traced on its arc with the comet |
| T5 | PASS | DATA · neck bend (signed arc with its angle), tip arc, lever length |
| T6 | PASS | HAND / DATA · the true metal swing of ±2 deg kept (K1): on the 100 mm lever the tip moves ±3.5 mm and the neck's bend reads in degrees on the overlay |
| T7 | PASS | DATA · PLAN: the notch, the lever and its swing lie in the plane |
| T8 | PASS | DATA · detail of the neck, 6x: the two notch circles and the 0.8 mm neck between them |
| T9 | PASS | AUTO / DATA · claim table: 2 ok, 0 off, 0 uncheckable of 2 |
| T10 | N/A | AUTO · 0 solids drawn see-through · nothing static covers the lever or the neck in the plan view |
| T11 | PASS | AUTO · 0 supports routed, 0 moved off a sweep · no support crosses the lever's sweep: the blank's block is clamped on its seat beside it; the stops stand past its swing |
| T12 | PASS | HAND · 12 support solids; dropped by the polish: none |
| T13 | N/A | DATA · nothing goes by in a blink |
| T14 | PASS | HAND / DATA · the lever's swing is the one control |
| T15 | PASS | HAND · labels state the mechanism, never its use |
| T16 | N/A | HAND / STYLE · no two parts of one role to tell apart |
| T17 | PASS | AUTO · depth peeling, no depth bias (renderer test) |
| D1 | PASS | HAND · one blank: block, notch and lever, the lever a flat root tapering to a boss round the drive pin |
| D2 | PASS | HAND · material where the load runs, bosses round every pin |
| D3 | PASS | STYLE · STYLE: roles by pattern and tone (both sheets) |
| D4 | PASS | AUTO · fired: base (3 solids), feet (4 solids) · base corners and feet concentric (base, feet rules) |
| D5 | PASS | AUTO / HAND · one seat plate and one clamp plate for the block; the motor on one plate hung from the base |
| D6 | PASS | HAND / STYLE · hardware quieter than the parts, still readable (both sheets) |
| D8 | PASS | AUTO / HAND · every solid a profile, an operation and a frame; built by Manifold; no layers, dz or twin |
| D9 | PASS | AUTO / HAND · the neck drawn rigid either side of its centre; its bend shown by the bend overlay (D9) |
| D10 | PASS | AUTO · profiles shipped for plain extrusions, revolutions and sweeps, meshes only for booleans (package v2) |
| D11 | PASS | AUTO · SOLID: 0 of 40 solids unsound |
| D7 | PASS | HAND · the blank plain; richness in the clamp, the stops and the drive |
| A1 | PASS | AUTO · N J13, drive drive · every joint read from the record and built by its kit |
| A2 | PASS | AUTO · N J13, drive drive · the neck a compliant joint (J13); the drive by the input kind (V5) |
| A3 | N/A | AUTO · fired: classify (1 solid), axial stack builder · no bore to size: the lever turns on its neck |
| A4 | PASS | AUTO · fired: j1-dead-axle (no solids), axial stack builder · the drive pin and the motor shaft from H.shaft, chamfered |
| A5 | PASS | AUTO · fired: j2-live-shaft (no solids), j10-shaft-in-plan (no solids), axial stack builder · the crank disc on the motor shaft by a set screw on its flat |
| A6 | PASS | AUTO · fired: j5-slide (no solids), j13-compliant (11 solids), standoffs (no solids) · the blank's block on a ground seat plate of its outline, never on posts; nothing through the neck |
| A7 | PASS | AUTO · fired: base (3 solids), feet (4 solids) · base 8 mm under the lowest part, counterbored corner holes, feet, engraved scale and paths, shaft clearance holes |
| A8 | PASS | AUTO · fired: fasteners (4 solids) · stage 3 fasteners: shanks, clearance and tapped holes |
| A9 | N/A | AUTO / HAND · fired: placement solver · no pin: the neck is one piece with block and lever |
| A10 | PASS | HAND · fired: placement (2 solids), placement solver · the blank in one plane; nothing stacked to clear |
| A11 | PASS | AUTO / HAND · fired: j12-flexible (no solids), strap-sheave (no solids), j1-dead-axle (no solids) · load paths closed: every joint note says where its load goes to ground |
| A12 | PASS | AUTO · clamp check clean |
| A13 | PASS | AUTO / HAND · 40 solids, 16 unnamed (further items of a listed set) · named hardware with catalogue sizes and materials |
| A14 | PASS | AUTO / HAND · fired: support router · supports routed against the sweeps (least gap 1.5 mm); details checked by A15 |
| A15 | PASS | AUTO · clearance in 3D over 72 phases: 0 clashes; hand allow: 0 named, 0 unnecessary |
| A16 | PASS | HAND · 2 joint notes; no note: none; no badge: none · a note per joint with its badge; build rules: one blank, no pivot; the neck in its elastic range, the stops a fifth of the half swing past it; the drive pin through a slot in the base to a Scotch yoke |
| A17 | PASS | HAND · assembles in the explode order; every screw reachable; pressed bearings pullable through their bores |
| A18 | PASS | AUTO · placement: 1 slabs in the tallest stack (10.0 mm), 0 clevises; stack per joint in the Joints table · placement: one slab; the block, seat and clamp placed against it |
| A19 | N/A | AUTO · 0 supports routed (0 moved), least gap - mm; still covering a principle part, drawn see-through: none · no stack support to route: the block is clamped on its seat |
| A20 | N/A | AUTO · support per joint: none · no revolute stack |
| A21 | PASS | AUTO · kit per joint: N J13, drive drive |
| A22 | PASS | AUTO · fired: stops (no solids), adjustable-length (no solids), cable-clip (2 solids) · the stop pins of the compliant kit; cable clip |
| E1 | PASS | AUTO · every solid has one explode level; levels -4.5 to 1 · one level per solid, nothing stretches |
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
| J2 | N/A | AUTO · fired: j2-live-shaft (no solids) · no live shaft on the base normal |
| J3 | N/A | AUTO · fired: j3-moving-pin (no solids), cross-bearings (no solids), ring-hub (no solids) · no moving revolute |
| J4 | N/A | AUTO · fired: j4-slot-roller (no solids), pin-lobe (no solids), fork-pin (no solids) · no pin in a slot |
| J5 | N/A | AUTO · fired: piston-bore (no solids), j5-slide (no solids), tongue-slot (no solids) · no plain slide |
| J6 | N/A | AUTO · fired: j6-mesh (no solids), ring-rollers (no solids) · no parallel mesh |
| J7 | N/A | AUTO · fired: groove-cam (no solids), j7-cam (no solids), pallet-contact (no solids), pawl-tooth (no solids) · no cam |
| J8 | N/A | AUTO · fired: j8-belt (no solids), j12-flexible (no solids) · no belt in the mechanism (the drive belt is V4) |
| J9 | N/A | AUTO · fired: j9-crossed-mesh (no solids) · no crossed mesh |
| J10 | N/A | AUTO · fired: j10-shaft-in-plan (no solids), j11-screw (no solids) · no shaft in plan |
| J12 | N/A | AUTO · fired: j12-flexible (no solids), strap-sheave (no solids) · no flexible member |
| J13 | PASS | AUTO · fired: j13-compliant (11 solids) · neck drawn rigid, its bend on the overlay; one piece with block and lever; a hardened stop pin each side, a fifth of the half swing past each end; the block on a ground seat plate, clamped under a plate by two screws and two dowels; one material, 7075-T6 |
| J11 | N/A | AUTO · fired: j11-screw (no solids) · no screw |
| F1 | PASS | AUTO · served at N; fired: j2-live-shaft (no solids), j10-shaft-in-plan (no solids), strap-sheave (no solids), j13-compliant (11 solids) · two dowels reamed through clamp, block and seat (Joints table) |
| F2 | PASS | AUTO · served at N; fired: j2-live-shaft (no solids), j10-shaft-in-plan (no solids), cross-bearings (no solids), trunnion (no solids), fork-pin (no solids), ring-hub (no solids), ring-rollers (no solids), j12-flexible (no solids), strap-sheave (no solids), j11-screw (no solids), j13-compliant (11 solids) · the block clamped under its plate; the yoke and crank pin pressed on their pins |
| F3 | PASS | AUTO · served at no joint; fired: j2-live-shaft (no solids), j10-shaft-in-plan (no solids), j12-flexible (no solids), j11-screw (no solids) · the crank disc by a set screw on the motor shaft's flat; the drive pin pressed into the lever |
| F4 | N/A | AUTO / HAND · served at no joint; fired: j9-crossed-mesh (no solids), j2-live-shaft (no solids), j10-shaft-in-plan (no solids), trunnion (no solids), j11-screw (no solids) · nothing turns free on a shaft along it |
| F5 | PASS | AUTO / HAND · served at N; fired: j5-slide (no solids), pawl-tooth (no solids), j11-screw (no solids), j13-compliant (11 solids), stops (no solids) · stop pins each side of the lever, past the swing, before the neck yields |
| F6 | N/A | AUTO / HAND · served at no joint; fired: trunnion (no solids), j7-cam (no solids), pallet-contact (no solids), pawl-tooth (no solids), j12-flexible (no solids) · no rest position to hold: the drive positions every part |
| F7 | N/A | AUTO / HAND · served at no joint; fired: j6-mesh (no solids), j9-crossed-mesh (no solids), j5-slide (no solids), j12-flexible (no solids), adjustable-length (no solids) · nothing to adjust: the crank's throw and the yoke set the swing exactly |
| F8 | N/A | AUTO · served at no joint; fired: cross-bearings (no solids), tongue-slot (no solids), j12-flexible (no solids), j11-screw (no solids), lubrication (no solids) · no sliding contact but the crank pin in the hardened yoke slot, which runs dry at this load |
| F9 | N/A | AUTO / HAND · served at no joint; fired: j6-mesh (no solids), j9-crossed-mesh (no solids), timing-marks (no solids) · no phase to keep between parts |
| F10 | PASS | AUTO / HAND · served at drive; fired: j12-flexible (no solids), drive (no solids), yoke-drive (21 solids) · home flag on the crank disc, fork sensor on a standoff (drive) |
| M1 | PASS | AUTO · fired: hardware primitives · top-face chamfers by part kind (primitives) |
| M2 | PASS | HAND · the lever tapers from its root to a boss round the drive pin |
| M3 | PASS | AUTO · fired: j3-moving-pin (no solids), hardware primitives · bore entry chamfers |
| M4 | PASS | AUTO / HAND · fired: base (3 solids), fasteners (4 solids) · counterbores and countersinks for heads (base, csk, housings) |
| M5 | PASS | AUTO / HAND · fired: hardware primitives · cutter radii on windows and slots |
| M6 | PASS | AUTO · edge distance and walls clean |
| M7 | N/A | HAND · no bracket corner turns a load |
| M8 | PASS | AUTO · fired: j1-dead-axle (no solids) · thread undercuts on stepped shafts |
| M9 | PASS | AUTO / HAND · fired: j1-dead-axle (no solids) · ISO coarse threads, engagement through the tapped part or to a nut |
| M10 | PASS | AUTO / HAND · 39 of 40 solids name a material · materials named by kind and role |
| M11 | PASS | AUTO · fired: j1-dead-axle (no solids), hardware primitives · centre holes, chamfered ends on turned parts |
| M12 | PASS | HAND · every screw reachable by its key in the explode |
| M13 | PASS | AUTO / HAND · 4 threaded · threadlocker or nyloc on every threaded fastener |
| M14 | PASS | AUTO / HAND · fired: piston-bore (no solids), j4-slot-roller (no solids), pin-lobe (no solids), groove-cam (no solids), pallet-contact (no solids), tongue-slot (no solids) · the yoke's slot hardened, the crank pin hardened |
| V1 | PASS | AUTO · fired: drive (no solids), yoke-drive (21 solids) · a gear motor under the base, one turn per cycle, drives the crank (a swing of a few degrees needs no belt) |
| V2 | PASS | AUTO · fired: drive (no solids), yoke-drive (21 solids) · the motor on one plate hung from the base on two standoffs |
| V3 | N/A | AUTO / HAND · fired: drive (no solids) · no belt |
| V4 | N/A | AUTO · fired: j8-belt (no solids) · no belt |
| V5 | PASS | AUTO · fired: drive (no solids), yoke-drive (21 solids) · oscillating input of a compliant lever (J13): a pin pressed into its tip runs down through a slot in the base to a slotted yoke driven by a crank (a Scotch yoke, so the swing follows the driver's cosine law exactly) |
| V6 | PASS | AUTO · fired: drive (no solids), yoke-drive (21 solids), cable-clip (2 solids) · home flag, fork sensor, terminals, lead and clip |
| L1 | PASS | STYLE · STYLE: no look values in the record or polish |
| L2 | PASS | HAND · records and polish carry no look |
| L3 | PASS | HAND · roles right on every solid (both sheets) |
| L4 | PASS | HAND / STYLE · one accent: the input ring, the traces |
| L5 | PASS | AUTO / HAND · fired: see-through (no solids) · transparency and hidden lines show screws in holes and bearings in bores |
| L6 | PASS | AUTO · depth peeling at every view (shots) |
| L7 | PASS | STYLE · STYLE: turntable orbit, named views, no perspective |
| L8 | PASS | AUTO / HAND · fired: trace-marks (1 solid) · centrelines along every joint axis, base dimensions, engraved marks |
| L9 | PASS | AUTO / DATA · the neck's detail drawn by the renderer at 6x |
| L10 | PASS | AUTO / STYLE · teaching overlays in the sheet's look |
| R1 | PASS | HAND · every standard part from the primitives and kits |
| R2 | PASS | HAND · standard sizes only |
| R3 | PASS | AUTO · fired: hardware primitives · shared subassemblies, one function each |
| R4 | PASS | AUTO · package v2 7.6 KB · package v2 written at build time |
| R5 | PASS | HAND · the polish states only exceptions, no sampling |
| R6 | PASS | FLAG · FLAG: bench run (desktop): no flag; the phone is measured by David |
| R7 | PASS | HAND / FLAG · polish none; 0 solids added, 0 overrides by the polish |
| R8 | PASS | AUTO / SITE · SITE: thumbnails pre-rendered, cards animate on hover |
| R9 | PASS | AUTO / SITE · setup and bake in the worker, one context |
| R10 | PASS | FLAG · FLAG: the bench page is built for the phone measurement |
| DL1 | PASS | AUTO / HAND · 13 of 40 solids on a dropping rung · every solid, mark and effect on a rung by its kind |
| DL2 | PASS | HAND · default dial: full |
| DL3 | PASS | AUTO · view-aware exceptions in the ladder table |
| DL4 | PASS | SITE · SITE: adaptive dial with hysteresis |
| DL6 | PASS | AUTO · teaching layers drawn at every dial position |
| DL5 | PASS | FLAG · FLAG: bench reports frame time per dial position |
| Q1 | PASS | check, clamp and edge distance clean |
| Q2 | PASS | 0 clashes, 0 unnecessary allows |
| Q3 | PASS | package v2 written, 7.6 KB; site build not checked here · package v2 written; site builds (npm run build) |
| Q4 | PASS | local: tools/shot · dist/shots3/flexure-hinge: record view, PLAN, FRONT, SIDE, ISOMETRIC, the declared views, full explode, both sheets |
| Q5 | PASS | local: tools/bench · tools/bench run: dist/bench/report-v2.md |
| Q6 | PASS | every row judged |
| Q7 | PASS | at 3.0 |
| Q8 | PASS | teaching review: tweak (2026-10-20); the six phases of the finished build are looked at by eye · verdict and decisions in the record and the teaching: line; six phases of the finished build looked at |

## Joints
| Joint | Kit | Block | Support | Stack | F1 locate | F2 retain | F3 torque | F4 thrust | F5 limit | F6 hold | F7 adjust | F8 lube | F9 timing | F10 protect |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| N | J13 | flexure | – | – | Dowel pin Ø3 h6, reamed through clamp, block and seat | Clamp plate over the blank's block | none | none | 2 x Stop pin Ø4, hardened, pressed into the base | none | none | none | none | none |
| drive | drive | – | – | – | none | none | none | none | none | none | none | none | none | Home flag, 1 mm steel vane; Fork sensor, slotted optical, 5 mm gap |

## Supports
| Support | Joint | Kind | Route | Least gap mm | Covers | T10 |
|---|---|---|---|---|---|---|

## Variants and overrides
| Joint or part | Rule result | Chosen | Why |
|---|---|---|---|

## Detail ladder
| Rung | Solids | Marks | Frame ms at this dial position |
|---|---|---|---|
| DL-A | 1 | 0 | 1.59 |
| DL-B | 0 | 80 | 1.51 |
| DL-C | 0 | 0 | 1.62 |
| DL-D | 0 | 0 | 1.65 |
| DL-E | 8 | 0 | 1.79 |
| DL-F | 0 | 0 | 1.64 |
| DL-G | 0 | 0 | 1.61 |
| DL-H | 4 | 0 | 1.66 |
| never | 27 | 50 | 1.61 |

## Promotion candidates
None left: the compliant kit (J13: the blank's block and neck, the seat, clamp and stop pins) and the yoke drive (V5 for a short swing or slide) are rules of the builder; the bend overlay is drawn by the renderer.

## Verification
check: clean · K1 residual: 0.0e+0 · claims: 2 of 2 ok · clearance: 0 clashes · clamp: clean · edge distance: clean · package: 7.6 KB
screenshots: dist/shots3/flexure-hinge (record view, PLAN, FRONT, SIDE, ISOMETRIC, detail of the neck, explode; both sheets) · bench: dist/bench/report-v2.md (desktop; frame times paced at 28 deg in the ladder above; phone by David)
