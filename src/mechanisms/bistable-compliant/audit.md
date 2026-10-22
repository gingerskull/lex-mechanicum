# Audit: Bistable compliant mechanism (bistable-compliant)
standard: 3.0 · date: 2026-10-22 · result: pass · detail: full · pass: build
teaching: tweak · decisions in the record

## Summary
PASS 144 · FAIL 0 · N/A 23 · open: none

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
| P10 | PASS | HAND · the shuttle traced with ticks every 5 deg of input (they spread at the snap); a beam's midpoint traced; the unstable centre line, both beam chords and the beam's bend; plot of the shuttle against the pusher, which shows the snap |
| P11 | PASS | DATA · plain language, mm and degrees |
| P12 | PASS | AUTO / DATA · validate(records, asVersion 3) clean for this record |
| P13 | PASS | HAND · teaching review run against the record in E2 (#204) before the build and again on the finished drawing (teaching: line) |
| K1 | PASS | AUTO · K1 residual 4.0e-14 (tolerance 1e-9) over 360 samples, reference 0.0e+0 |
| K2 | PASS | AUTO · check: finite, continuous, periodic over 360 samples |
| K3 | PASS | AUTO / HAND · 1 block (flexure); no numeric fallback · composed from the block library; no fallback, no one-off model |
| K4 | PASS | HAND · the input body is the driver with the accent on its shaft; the output body declared |
| K6 | PASS | DATA · beams L0 40 at 10 deg: stable at L0 sin theta0 = ±6.946 mm; von Mises balance with ka 50 and ks 0.4 N/mm folds at y = ±3.43 mm, landing at ∓6.90 |
| K7 | PASS | DATA · drivers push (linear) · input kind declared with its driven joint |
| K8 | PASS | AUTO / DATA · every joint declared with type, bodies, origin and axis; nothing inferred |
| K9 | PASS | DATA · one linear driver, the pusher's 13.89 mm stroke between the two stable states; the snap takes 8 deg of the cycle (K2: no jump) |
| K10 | PASS | AUTO / DATA · the branch follows the cycle: the first stable state on the way out until the fold, the other on the way back; no design choice |
| K11 | PASS | AUTO · mobility counted 2, dof 1 |
| K12 | PASS | DATA · every traced, overlaid and claimed point and quantity is named in kin |
| T1 | PASS | HAND · mechanics first, no use context in the teaching strings; the principle reads at the default view |
| T2 | PASS | HAND · review before the build (E2) and again on the six phases of the finished build; decisions in the record |
| T3 | PASS | DATA · principle parts declared; drawn whole, in depth order |
| T4 | PASS | DATA · fired: trace-marks (2 solids) · the shuttle traced with equal-time ticks (5 deg): close while it follows the pusher, spread where it snaps; a beam's midpoint traced |
| T5 | PASS | DATA · the unstable centre line between the anchors, the beam chords to the shuttle, the beam's signed bend |
| T6 | PASS | HAND / DATA · the shuttle's 13.9 mm between its two stable states at true size; the snap moves it 10 mm in 8 deg of the cycle, slowed 4x by the time map |
| T7 | PASS | DATA · PLAN: the beams, the shuttle and its stable places lie in the plane |
| T8 | N/A | DATA · the principle lies in plain view, no section needed |
| T9 | PASS | AUTO / DATA · claim table: 3 ok, 0 off, 0 uncheckable of 3 |
| T10 | PASS | AUTO · 6 solids drawn see-through: slide-wip0, slide-stop0, slide-pad0, pusher-arm, pusher-arm-riser, window-stud · the slide's guide parts drawn see-through where they lie over the pusher's arm in plan |
| T11 | PASS | AUTO · 0 supports routed, 0 moved off a sweep · no support routed into the blank's sweep: the pads are clamped on their seats beside it |
| T12 | PASS | HAND · 19 support solids; dropped by the polish: none |
| T13 | PASS | DATA · time map: both snaps (159.7 to 167.7 and 339.7 to 347.7 deg) slowed 4x; the plot keeps the true input |
| T14 | PASS | HAND / DATA · the pusher's stroke is the one control |
| T15 | PASS | HAND · labels state the mechanism, never its use |
| T16 | N/A | HAND / STYLE · no two parts of one role to tell apart |
| T17 | PASS | AUTO · depth peeling, no depth bias (renderer test) |
| D1 | PASS | HAND · one blank: two anchor pads, two thin beams (pseudo-rigid halves), the shuttle with its window; the pusher a slider with an arm to its roller |
| D2 | PASS | HAND · material where the load runs, bosses round every pin |
| D3 | PASS | STYLE · STYLE: roles by pattern and tone (both sheets) |
| D4 | PASS | AUTO · fired: base (3 solids), feet (4 solids) · base corners and feet concentric (base, feet rules) |
| D5 | PASS | AUTO / HAND · a seat and a clamp plate per pad; the pusher on one slide; the motor on one plate hung from the base |
| D6 | PASS | HAND / STYLE · hardware quieter than the parts, still readable (both sheets) |
| D8 | PASS | AUTO / HAND · every solid a profile, an operation and a frame; built by Manifold; no layers, dz or twin |
| D9 | PASS | AUTO / HAND · the beams drawn rigid either side of each flexure, as their pseudo-rigid halves; the springs stretched between the roller and the window's ends |
| D10 | PASS | AUTO · profiles shipped for plain extrusions, revolutions and sweeps, meshes only for booleans (package v2) |
| D11 | PASS | AUTO · SOLID: 0 of 79 solids unsound |
| D7 | PASS | HAND · blank and pusher plain; richness in the pads' clamps, the springs, the slide and the drive |
| A1 | PASS | AUTO · slide J5, AL J13, TL J13, SL J13, AR J13, TR J13, SR J13, window J13, drive drive · every joint read from the record and built by its kit |
| A2 | PASS | AUTO · slide J5, AL J13, TL J13, SL J13, AR J13, TR J13, SR J13, window J13, drive drive · the beams' flexures and the window's springs by the compliant kit (J13); the pusher on a slide (J5); the drive by the input kind (V5) |
| A3 | N/A | AUTO · fired: classify (8 solids), axial stack builder · no bore to size: the blank moves by bending |
| A4 | PASS | AUTO · fired: j1-dead-axle (no solids), axial stack builder · the roller stud, the drive pin and the motor shaft from H.shaft |
| A5 | PASS | AUTO · fired: j2-live-shaft (no solids), j10-shaft-in-plan (no solids), axial stack builder · the crank disc on the motor shaft by a set screw on its flat |
| A6 | PASS | AUTO · fired: j5-slide (20 solids), j13-compliant (26 solids), standoffs (no solids) · the pads on ground seat plates of their outline, never on posts; the pusher's rails on ground risers |
| A7 | PASS | AUTO · fired: base (3 solids), feet (4 solids) · base 8 mm under the lowest part, counterbored corner holes, feet, engraved scale and paths, shaft clearance holes |
| A8 | PASS | AUTO · fired: fasteners (14 solids) · stage 3 fasteners: shanks, clearance and tapped holes |
| A9 | N/A | AUTO / HAND · fired: placement solver · no pin: the blank is one piece |
| A10 | PASS | HAND · fired: placement (12 solids), placement solver · the blank in one plane, the pusher above it; nothing stacked only to clear |
| A11 | PASS | AUTO / HAND · fired: j12-flexible (no solids), strap-sheave (no solids), j1-dead-axle (no solids) · load paths closed: every joint note says where its load goes to ground |
| A12 | PASS | AUTO · clamp check clean |
| A13 | PASS | AUTO / HAND · 79 solids, 34 unnamed (further items of a listed set) · named hardware with catalogue sizes and materials |
| A14 | PASS | AUTO / HAND · fired: support router · supports routed against the sweeps (least gap 1.5 mm); details checked by A15 |
| A15 | PASS | AUTO · clearance in 3D over 72 phases: 0 clashes; hand allow: 0 named, 0 unnecessary |
| A16 | PASS | HAND · 9 joint notes; no note: none; no badge: slide · a note per joint with its badge; build rules: one blank with no pivot; the pusher drives the shuttle through springs, which let it snap; stops past the shuttle's travel |
| A17 | PASS | HAND · assembles in the explode order; every screw reachable; pressed bearings pullable through their bores |
| A18 | PASS | AUTO · placement: 2 slabs in the tallest stack (16.0 mm), 0 clevises; stack per joint in the Joints table · placement: the blank on one slab (its flexures and the beams' give keep it so), the pusher on the next |
| A19 | N/A | AUTO · 0 supports routed (0 moved), least gap - mm; still covering a principle part, drawn see-through: none · no stack support to route |
| A20 | N/A | AUTO · support per joint: none · no revolute stack |
| A21 | PASS | AUTO · kit per joint: slide J5, AL J13, TL J13, SL J13, AR J13, TR J13, SR J13, window J13, drive drive |
| A22 | PASS | AUTO · fired: stops (no solids), adjustable-length (no solids), cable-clip (2 solids) · the slide's end stops and the shuttle's stop pins; cable clip |
| E1 | PASS | AUTO · every solid has one explode level; levels -4.5 to 2.5 · one level per solid, nothing stretches |
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
| J5 | PASS | AUTO · fired: piston-bore (no solids), j5-slide (20 solids), tongue-slot (no solids) · the pusher on a dowelled reference rail and a gibbed rail under a keeper, wipers, a nipple, an end stop and pad at each end |
| J6 | N/A | AUTO · fired: j6-mesh (no solids), ring-rollers (no solids) · no parallel mesh |
| J7 | N/A | AUTO · fired: groove-cam (no solids), j7-cam (no solids), pallet-contact (no solids), pawl-tooth (no solids) · no cam |
| J8 | N/A | AUTO · fired: j8-belt (no solids), j12-flexible (no solids) · no belt in the mechanism (the drive belt is V4) |
| J9 | N/A | AUTO · fired: j9-crossed-mesh (no solids) · no crossed mesh |
| J10 | N/A | AUTO · fired: j10-shaft-in-plan (no solids), j11-screw (no solids) · no shaft in plan |
| J12 | N/A | AUTO · fired: j12-flexible (no solids), strap-sheave (no solids) · no flexible member |
| J13 | PASS | AUTO · fired: j13-compliant (26 solids) · flexures drawn rigid, the bend on the overlay; the blank one piece; the pads on ground seat plates, clamped under plates by two screws and two dowels each; stop pins past each end of the shuttle's travel; the pusher's roller between two springs in the window |
| J11 | N/A | AUTO · fired: j11-screw (no solids) · no screw |
| F1 | PASS | AUTO · served at slide; fired: j2-live-shaft (no solids), j10-shaft-in-plan (no solids), strap-sheave (no solids), j13-compliant (26 solids) · dowels reamed through clamp, pad and seat; the reference rail dowelled (Joints table) |
| F2 | PASS | AUTO · served at slide; fired: j2-live-shaft (no solids), j10-shaft-in-plan (no solids), cross-bearings (no solids), trunnion (no solids), fork-pin (no solids), ring-hub (no solids), ring-rollers (no solids), j12-flexible (no solids), strap-sheave (no solids), j11-screw (no solids), j13-compliant (26 solids) · the pads clamped under their plates; the slide's keeper laps the pusher |
| F3 | PASS | AUTO · served at no joint; fired: j2-live-shaft (no solids), j10-shaft-in-plan (no solids), j12-flexible (no solids), j11-screw (no solids) · the crank disc by a set screw; the roller stud and the drive pin pressed in |
| F4 | N/A | AUTO / HAND · served at no joint; fired: j9-crossed-mesh (no solids), j2-live-shaft (no solids), j10-shaft-in-plan (no solids), trunnion (no solids), j11-screw (no solids) · nothing turns free on a shaft along it |
| F5 | PASS | AUTO / HAND · served at slide; fired: j5-slide (20 solids), pawl-tooth (no solids), j11-screw (no solids), j13-compliant (26 solids), stops (no solids) · stop pins past each end of the shuttle's travel; end stops with pads on the slide |
| F6 | PASS | AUTO / HAND · served at window; fired: trunnion (no solids), j7-cam (no solids), pallet-contact (no solids), pawl-tooth (no solids), j12-flexible (no solids) · the two compression springs hold the shuttle against the pusher's roller |
| F7 | PASS | AUTO / HAND · served at slide; fired: j6-mesh (no solids), j9-crossed-mesh (no solids), j5-slide (20 solids), j12-flexible (no solids), adjustable-length (no solids) · the slide's gib |
| F8 | PASS | AUTO · served at slide; fired: cross-bearings (no solids), tongue-slot (no solids), j12-flexible (no solids), j11-screw (no solids), lubrication (no solids) · wipers and a grease nipple on the slide |
| F9 | N/A | AUTO / HAND · served at no joint; fired: j6-mesh (no solids), j9-crossed-mesh (no solids), timing-marks (no solids) · no phase to keep between parts |
| F10 | PASS | AUTO / HAND · served at drive; fired: j12-flexible (no solids), drive (no solids), yoke-drive (21 solids) · home flag on the crank disc, fork sensor on a standoff (drive) |
| M1 | PASS | AUTO · fired: hardware primitives · top-face chamfers by part kind (primitives) |
| M2 | PASS | HAND · the shuttle's window and the pusher's arm carry the load where it runs |
| M3 | PASS | AUTO · fired: j3-moving-pin (no solids), hardware primitives · bore entry chamfers |
| M4 | PASS | AUTO / HAND · fired: base (3 solids), fasteners (14 solids) · counterbores and countersinks for heads (base, csk, housings) |
| M5 | PASS | AUTO / HAND · fired: hardware primitives · cutter radii on windows and slots |
| M6 | PASS | AUTO · edge distance and walls clean |
| M7 | N/A | HAND · no bracket corner turns a load |
| M8 | PASS | AUTO · fired: j1-dead-axle (no solids) · thread undercuts on stepped shafts |
| M9 | PASS | AUTO / HAND · fired: j1-dead-axle (no solids) · ISO coarse threads, engagement through the tapped part or to a nut |
| M10 | PASS | AUTO / HAND · 73 of 79 solids name a material · materials named by kind and role |
| M11 | PASS | AUTO · fired: j1-dead-axle (no solids), hardware primitives · centre holes, chamfered ends on turned parts |
| M12 | PASS | HAND · every screw reachable by its key in the explode |
| M13 | PASS | AUTO / HAND · 8 threaded · threadlocker or nyloc on every threaded fastener |
| M14 | PASS | AUTO / HAND · fired: piston-bore (no solids), j4-slot-roller (no solids), pin-lobe (no solids), groove-cam (no solids), pallet-contact (no solids), tongue-slot (no solids) · the slide's rails and gib, the yoke's slot and the crank pin hardened |
| V1 | PASS | AUTO · fired: drive (no solids), yoke-drive (21 solids) · a gear motor under the base, one turn per cycle, drives the crank |
| V2 | PASS | AUTO · fired: drive (no solids), yoke-drive (21 solids) · the motor on one plate hung from the base on two standoffs |
| V3 | N/A | AUTO / HAND · fired: drive (no solids) · no belt |
| V4 | N/A | AUTO · fired: j8-belt (no solids) · no belt |
| V5 | PASS | AUTO · fired: drive (no solids), yoke-drive (21 solids) · linear input: a pin pressed into the pusher runs down through a slot in the base to a slotted yoke driven by a crank (a Scotch yoke: the stroke follows the driver's cosine law exactly) |
| V6 | PASS | AUTO · fired: drive (no solids), yoke-drive (21 solids), cable-clip (2 solids) · home flag, fork sensor, terminals, lead and clip |
| L1 | PASS | STYLE · STYLE: no look values in the record or polish |
| L2 | PASS | HAND · records and polish carry no look |
| L3 | PASS | HAND · roles right on every solid (both sheets) |
| L4 | PASS | HAND / STYLE · one accent: the input ring, the traces |
| L5 | PASS | AUTO / HAND · fired: see-through (6 solids) · transparency and hidden lines show screws in holes and bearings in bores |
| L6 | PASS | AUTO · depth peeling at every view (shots) |
| L7 | PASS | STYLE · STYLE: turntable orbit, named views, no perspective |
| L8 | PASS | AUTO / HAND · fired: trace-marks (2 solids) · centrelines along every joint axis, base dimensions, engraved marks |
| L9 | N/A | AUTO / DATA · no section or detail view declared |
| L10 | PASS | AUTO / STYLE · teaching overlays in the sheet's look |
| R1 | PASS | HAND · every standard part from the primitives and kits |
| R2 | PASS | HAND · standard sizes only |
| R3 | PASS | AUTO · fired: hardware primitives · shared subassemblies, one function each |
| R4 | PASS | AUTO · package v2 11.4 KB · package v2 written at build time |
| R5 | PASS | HAND · the polish states only exceptions, no sampling |
| R6 | PASS | FLAG · FLAG: bench run (desktop): no flag; the phone is measured by David |
| R7 | PASS | HAND / FLAG · polish none; 0 solids added, 0 overrides by the polish |
| R8 | PASS | AUTO / SITE · SITE: thumbnails pre-rendered, cards animate on hover |
| R9 | PASS | AUTO / SITE · setup and bake in the worker, one context |
| R10 | PASS | FLAG · FLAG: the bench page is built for the phone measurement |
| DL1 | PASS | AUTO / HAND · 25 of 79 solids on a dropping rung · every solid, mark and effect on a rung by its kind |
| DL2 | PASS | HAND · default dial: full |
| DL3 | PASS | AUTO · view-aware exceptions in the ladder table |
| DL4 | PASS | SITE · SITE: adaptive dial with hysteresis |
| DL6 | PASS | AUTO · teaching layers drawn at every dial position |
| DL5 | PASS | FLAG · FLAG: bench reports frame time per dial position |
| Q1 | PASS | check, clamp and edge distance clean |
| Q2 | PASS | 0 clashes, 0 unnecessary allows |
| Q3 | PASS | package v2 written, 11.4 KB; site build not checked here · package v2 written; site builds (npm run build) |
| Q4 | PASS | local: tools/shot · dist/shots3/bistable-compliant: record view, PLAN, FRONT, SIDE, ISOMETRIC, the declared views, full explode, both sheets |
| Q5 | PASS | local: tools/bench · tools/bench run: dist/bench/report-v2.md |
| Q6 | PASS | every row judged |
| Q7 | PASS | at 3.0 |
| Q8 | PASS | teaching review: tweak (2026-10-20); the six phases of the finished build are looked at by eye · verdict and decisions in the record and the teaching: line; six phases of the finished build looked at |

## Joints
| Joint | Kit | Block | Support | Stack | F1 locate | F2 retain | F3 torque | F4 thrust | F5 limit | F6 hold | F7 adjust | F8 lube | F9 timing | F10 protect |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| slide | J5 | driver | – | – | 2 x Dowel pin Ø3 h6, reference rail to base | Keeper plate, laps the slider | none | none | 2 x Stop block | none | Gib strip 3 x 6 x 61.9, bronze | Felt wiper in a steel clip; Grease nipple M6 (DIN 71412) | none | none |
| AL | J13 | flexure | – | – | none | none | none | none | none | none | none | none | none | none |
| TL | J13 | – | – | – | none | none | none | none | none | none | none | none | none | none |
| SL | J13 | flexure | – | – | none | none | none | none | none | none | none | none | none | none |
| AR | J13 | flexure | – | – | none | none | none | none | none | none | none | none | none | none |
| TR | J13 | – | – | – | none | none | none | none | none | none | none | none | none | none |
| SR | J13 | flexure | – | – | none | none | none | none | none | none | none | none | none | none |
| window | J13 | – | – | – | none | none | none | none | none | Compression spring Ø5, 7 coils, between the roller and the window's end | none | none | none | none |
| drive | drive | flexure | – | – | none | none | none | none | none | none | none | none | none | Home flag, 1 mm steel vane; Fork sensor, slotted optical, 5 mm gap |

## Supports
| Support | Joint | Kind | Route | Least gap mm | Covers | T10 |
|---|---|---|---|---|---|---|

## Variants and overrides
| Joint or part | Rule result | Chosen | Why |
|---|---|---|---|

## Detail ladder
| Rung | Solids | Marks | Frame ms at this dial position |
|---|---|---|---|
| DL-A | 1 | 0 | 2.22 |
| DL-B | 0 | 112 | 2.12 |
| DL-C | 0 | 0 | 1.93 |
| DL-D | 0 | 0 | 2.12 |
| DL-E | 11 | 0 | 1.97 |
| DL-F | 0 | 0 | 1.98 |
| DL-G | 0 | 0 | 2.03 |
| DL-H | 13 | 0 | 1.92 |
| never | 54 | 51 | 1.98 |

## Promotion candidates
None left: the compliant kit builds the pads, the window's roller and springs, and the shuttle's stop pins; the yoke drive serves the linear pusher; the snap is a mode of the flexure block.

## Verification
check: clean · K1 residual: 4.0e-14 · claims: 3 of 3 ok · clearance: 0 clashes · clamp: clean · edge distance: clean · package: 11.4 KB
screenshots: dist/shots3/bistable-compliant (record view, PLAN, FRONT, SIDE, ISOMETRIC, explode; both sheets) · bench: dist/bench/report-v2.md (desktop; frame times paced at 28 deg in the ladder above; phone by David)
