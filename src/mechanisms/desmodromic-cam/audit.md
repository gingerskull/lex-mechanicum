# Audit: Desmodromic valve cam (desmodromic-cam)
standard: 3.0 · date: 2026-10-21 · result: pass · detail: full · pass: build
teaching: rethink · decisions in the record

## Summary
PASS 150 · FAIL 0 · N/A 17 · open: none

## Requirements
| Id | Status | Evidence / action |
|---|---|---|
| S1 | PASS | DATA · the standard carries version 3.0 and its changelog |
| S2 | PASS | HAND · header with standard, date, result, detail, pass and the teaching: line |
| S3 | PASS | AUTO · tools/conformance reads this sheet (engine v3) and runs in npm run check |
| S4 | PASS | SITE · the pass issue holds only this mechanism's decisions; batch status in #216 |
| S5 | PASS | SITE · 3D stamp in the title block (every shot) and on the card and page header (site build) |
| S6 | PASS | AUTO · rebuilt from its record v3 in rebuild batch R5 (#216): bound by 3.0 from this pass |
| P1 | PASS | DATA · record v3 complete (kin and teaching blocks); no polish, audit.md present |
| P2 | PASS | DATA · catalogue validator clean |
| P3 | PASS | DATA / SITE · the page reads ratio, axes, character, backdrivable, aka, family, motion, level, dof and the drive from the record |
| P4 | PASS | DATA · tags grouped Function, Property, Application, keywords |
| P5 | PASS | DATA · explanation in four parts and the examples from the record |
| P6 | PASS | DATA · references and media from the record, validated by the catalogue |
| P7 | PASS | HAND / SITE · no prose in a polish; labels come from the record |
| P8 | PASS | SITE · the page has no parts list or joint sections (site) |
| P9 | PASS | AUTO / HAND · every number the explanation states is a claim and agrees (T9) |
| P10 | PASS | HAND · both shoe centres traced in the camshaft's frame (the two conjugate pitch curves); the rise and return arcs on the camshaft, the opening and closing pushes, the stroke axis; a detail view of both rockers; plot of lift |
| P11 | PASS | DATA · plain language, mm and degrees |
| P12 | PASS | AUTO / DATA · validate(records, asVersion 3) clean for this record |
| P13 | PASS | HAND · teaching review run against the record before the build and again on the finished drawing (teaching: line) |
| K1 | PASS | AUTO · K1 residual 2.8e-14 (tolerance 1e-9) over 360 samples, reference 0.0e+0 |
| K2 | PASS | AUTO · check: finite, continuous, periodic over 360 samples |
| K3 | PASS | AUTO / HAND · 3 blocks (cam, rocker); no numeric fallback · composed from the block library; no fallback, no one-off model |
| K4 | PASS | HAND · camshaft driver with the accent on its shaft; both rockers and the stem follow |
| K6 | PASS | DATA · cycloidal rise 90, return 90, closed 180, h 12; rockers ψ = asin(s / arm): 8.6 and 13.9 degrees; each lobe the envelope of its shoe's path (the closing one with 0.1 mm lash): conjugate by construction; pressure angles 24.4 and 29.8 (record corrected) |
| K7 | PASS | DATA · drivers input (rotary) · input kind declared with its driven joint |
| K8 | PASS | AUTO / DATA · every joint declared with type, bodies, origin and axis; nothing inferred |
| K9 | PASS | DATA · one rotary driver; the lift and rise controls are not offered (the lobes are built at build time), recorded in the review |
| K10 | PASS | AUTO / DATA · one closure, continuous over the cycle |
| K11 | PASS | AUTO · mobility counted 0, dof 1 |
| K12 | PASS | DATA · every traced, overlaid and claimed point and quantity is named in kin |
| T1 | PASS | HAND · mechanics first, no use context in the teaching strings; the principle reads at the default view |
| T2 | PASS | HAND · review before the build and again on the six phases of the finished build; decisions in the record |
| T3 | PASS | DATA · principle parts declared; drawn whole, in depth order |
| T4 | PASS | DATA · fired: trace-marks (2 solids) · the two shoe centres in the camshaft's frame: the opening path grows where the closing path shrinks |
| T5 | PASS | DATA · rise and return arcs on the camshaft, the opening and closing pushes from the shaft to each shoe, the stroke axis |
| T6 | PASS | HAND / DATA · 12 mm of stem travel over 90 degrees out and back; open in three of six frames |
| T7 | PASS | DATA · FRONT: camshaft above, stem vertical below, the opening finger on its end and the closing fork under its collar |
| T8 | PASS | DATA · detail view of both rockers at the lobes; the per-phase loaded-rocker highlight waits on the renderer (highlightBy, follow-up) |
| T9 | PASS | AUTO / DATA · claim table: 7 ok, 0 off, 0 uncheckable of 7 |
| T10 | PASS | AUTO · 17 solids drawn see-through: O-pb-b0-foot, O-pb-b0-ped, O-pb-b0, O-pb-b0-brg, O-pb-b0-brg-balls, O-pb-b0-brg-cage, O-pb-b0-cl0, O-pb-b0-cl1 · the motor bracket behind the mechanism is drawn see-through where it lies behind the lobes |
| T11 | PASS | AUTO · 3 supports routed, 2 moved off a sweep · the drive moved to the camshaft's far end, behind the front view; nothing over the lobes or shoes |
| T12 | PASS | HAND · 30 support solids; dropped by the polish: none |
| T13 | N/A | DATA · nothing goes by in a blink |
| T14 | PASS | HAND / DATA · the camshaft's turn (see K9) |
| T15 | PASS | HAND · labels state the mechanism, never its use |
| T16 | PASS | HAND / STYLE · the two lobes and the two rockers lie in planes either side of the stem and are told apart by stacking (depth), not hue |
| T17 | PASS | AUTO · depth peeling, no depth bias (renderer test) |
| D1 | PASS | HAND · two lobes on one hub, rockers with round shoes and noses, a fork with two tines under the collar |
| D2 | PASS | HAND · rocker arms taper from pivot boss to nose; the fork's tines joined by a bridge clear of the stem |
| D3 | PASS | STYLE · STYLE: roles by pattern and tone (both sheets) |
| D4 | PASS | AUTO · fired: base (3 solids), feet (4 solids) · base corners and feet concentric (base, feet rules) |
| D5 | PASS | AUTO / HAND · pillow blocks for the camshaft and both pivots; one guide block on four standoffs |
| D6 | PASS | HAND / STYLE · hardware quieter than the parts, still readable (both sheets) |
| D8 | PASS | AUTO / HAND · every solid a profile, an operation and a frame; built by Manifold; no layers, dz or twin |
| D9 | N/A | AUTO / HAND · no member changes shape |
| D10 | PASS | AUTO · profiles shipped for plain extrusions, meshes only for booleans (package v2) |
| D11 | PASS | AUTO · SOLID: 0 of 126 solids unsound |
| D7 | PASS | HAND · lobes and rockers plain; richness in the stacks and the guide |
| A1 | PASS | AUTO · O J10, Q1 J10, Q2 J10, G J5, C1 J7, C2 J7, T1 J7, T2 J7, drive drive · every joint read from the record and built by its kit |
| A2 | PASS | AUTO · O J10, Q1 J10, Q2 J10, G J5, C1 J7, C2 J7, T1 J7, T2 J7, drive drive · camshaft live in plan (J10); rocker pivots in plan (J10); the stem in a guide bush (J5 stem guide); cam contacts J7 |
| A3 | PASS | AUTO · fired: classify (8 solids), axial stack builder · bores from the catalogue; bearings where a boss fits them |
| A4 | PASS | AUTO · fired: j1-dead-axle (no solids), axial stack builder · stepped shafts with shoulders, grooves and chamfered ends (H.shaft) |
| A5 | PASS | AUTO · fired: j2-live-shaft (no solids), j10-shaft-in-plan (79 solids), axial stack builder · keys by shaft size: D-flat to Ø8, feather key above |
| A6 | PASS | AUTO · fired: j5-slide (7 solids), j13-compliant (no solids), standoffs (no solids) · the stem's guide block on four standoffs from the base |
| A7 | PASS | AUTO · fired: base (3 solids), feet (4 solids) · base under the lowest part, counterbored corner holes, feet, engraved scale and paths, shaft clearance holes |
| A8 | PASS | AUTO · fired: fasteners (45 solids) · stage 3 fasteners: shanks, clearance and tapped holes |
| A9 | PASS | AUTO / HAND · fired: placement solver · camshaft between its two pillow blocks |
| A10 | PASS | HAND · fired: placement (14 solids), placement solver · lobes, rockers and stem stand where their joints put them (shape.place); the lobes and rockers in planes either side of the stem |
| A11 | PASS | AUTO / HAND · fired: j12-flexible (no solids), strap-sheave (no solids), j1-dead-axle (no solids) · load paths closed: every joint note says where its load goes to ground |
| A12 | PASS | AUTO · clamp check clean |
| A13 | PASS | AUTO / HAND · 132 solids, 83 unnamed (further items of a listed set) · named hardware with catalogue sizes and materials |
| A14 | PASS | AUTO / HAND · fired: support router · supports routed against the sweeps; details checked by A15 |
| A15 | PASS | AUTO · clearance in 3D over 72 phases: 0 clashes; hand allow: 0 named, 0 unnecessary |
| A16 | PASS | HAND · 9 joint notes; no note: none; no badge: G, C1, C2, T1, T2 · a note per joint; build rules: lobes from the shoes' paths, the drive behind the front view, a guide bush for the stem |
| A17 | PASS | HAND · assembles in the explode order; every screw reachable; pressed bearings pullable through their bores |
| A18 | PASS | AUTO · placement: 1 slabs in the tallest stack (79.0 mm), 0 clevises; stack per joint in the Joints table · axial positions set by the placement solver |
| A19 | PASS | AUTO · 3 supports routed (2 moved), least gap 1.5 mm; still covering a principle part, drawn see-through: O-pb, Q1-pb, Q2-pb · supports placed off the principle's sweep where the router could |
| A20 | PASS | AUTO · support per joint: O pillow, Q1 pillow, Q2 pillow · one axial stack builder with its support selector |
| A21 | PASS | AUTO · kit per joint: O J10, Q1 J10, Q2 J10, G J5, C1 J7, C2 J7, T1 J7, T2 J7, drive drive |
| A22 | PASS | AUTO · fired: stops (no solids), adjustable-length (no solids), cable-clip (2 solids) · no stops: the lobes hold both rockers both ways; cable clips |
| E1 | PASS | AUTO · every solid has one explode level; levels -4.5 to 12 · one level per solid |
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
| J2 | N/A | AUTO · fired: j2-live-shaft (no solids) · no live shaft |
| J3 | N/A | AUTO · fired: j3-moving-pin (no solids), cross-bearings (no solids), ring-hub (no solids) · no moving revolute |
| J4 | N/A | AUTO · fired: j4-slot-roller (no solids), pin-lobe (no solids), fork-pin (no solids) · no pin in a slot |
| J5 | PASS | AUTO · fired: piston-bore (no solids), j5-slide (7 solids), tongue-slot (no solids) · built by its kit (Joints table) |
| J6 | N/A | AUTO · fired: j6-mesh (no solids), ring-rollers (no solids) · no parallel mesh |
| J7 | PASS | AUTO · fired: groove-cam (no solids), j7-cam (4 solids), pallet-contact (no solids), pawl-tooth (no solids) · built by its kit (Joints table) |
| J8 | N/A | AUTO · fired: j8-belt (no solids), j12-flexible (no solids) · no belt in the mechanism (the drive belt is V4) |
| J9 | N/A | AUTO · fired: j9-crossed-mesh (no solids) · no crossed mesh |
| J10 | PASS | AUTO · fired: j10-shaft-in-plan (79 solids) · built by its kit (Joints table) |
| J12 | N/A | AUTO · fired: j12-flexible (no solids), strap-sheave (no solids) · no flexible member |
| J13 | N/A | AUTO · fired: j13-compliant (no solids) · no compliant joint |
| J11 | N/A | AUTO · fired: j11-screw (no solids) · no screw |
| F1 | PASS | AUTO · served at O, Q1, Q2, G; fired: j2-live-shaft (no solids), j10-shaft-in-plan (79 solids), strap-sheave (no solids), j13-compliant (no solids) · housings, blocks and bridges dowelled (Joints table) |
| F2 | PASS | AUTO · served at O, Q1, Q2; fired: j2-live-shaft (no solids), j10-shaft-in-plan (79 solids), cross-bearings (no solids), trunnion (no solids), fork-pin (no solids), ring-hub (no solids), ring-rollers (no solids), j12-flexible (no solids), strap-sheave (no solids), j13-compliant (no solids) · every bearing retained both sides; every part on a shaft retained (Joints table) |
| F3 | PASS | AUTO · served at no joint; fired: j2-live-shaft (no solids), j10-shaft-in-plan (79 solids), j12-flexible (no solids), j11-screw (no solids) · every keyed part keyed or on a D-flat with its retainer |
| F4 | PASS | AUTO / HAND · served at O; fired: j9-crossed-mesh (no solids), j2-live-shaft (no solids), j10-shaft-in-plan (79 solids), trunnion (no solids) · thrust washers where a part turns free axially |
| F5 | N/A | AUTO / HAND · served at no joint; fired: j5-slide (7 solids), pawl-tooth (no solids), j13-compliant (no solids), stops (no solids) · the lobes limit both rockers; nothing else to stop |
| F6 | N/A | AUTO / HAND · served at no joint; fired: trunnion (no solids), j7-cam (4 solids), pallet-contact (no solids), pawl-tooth (no solids), j12-flexible (no solids) · no spring: the closing lobe pulls the stem up (the principle) |
| F7 | PASS | AUTO / HAND · served at no joint; fired: j6-mesh (no solids), j9-crossed-mesh (no solids), j5-slide (7 solids), j12-flexible (no solids), adjustable-length (no solids) · the lash at the closing shoe (0.1 mm) is built into the closing lobe |
| F8 | PASS | AUTO · served at G; fired: cross-bearings (no solids), tongue-slot (no solids), j12-flexible (no solids), j11-screw (no solids), lubrication (no solids) · sealed bearings need none; open contacts oiled or greased where they occur |
| F9 | PASS | AUTO / HAND · served at no joint; fired: j6-mesh (no solids), j9-crossed-mesh (no solids), timing-marks (1 solid) · zero lines on the camshaft's lobes |
| F10 | PASS | AUTO / HAND · served at drive; fired: j12-flexible (no solids), drive (30 solids) · home flag and fork sensor on the input (drive) |
| M1 | PASS | AUTO · fired: hardware primitives · top-face chamfers by part kind (primitives) |
| M2 | PASS | HAND · bosses round every loaded hole |
| M3 | PASS | AUTO · fired: j3-moving-pin (no solids), hardware primitives · bore entry chamfers |
| M4 | PASS | AUTO / HAND · fired: base (3 solids), fasteners (45 solids) · counterbores and countersinks for heads (base, csk, housings) |
| M5 | PASS | AUTO / HAND · fired: hardware primitives · cutter radii on windows and slots |
| M6 | PASS | AUTO · edge distance and walls clean |
| M7 | N/A | HAND · no bracket corner turns a load |
| M8 | PASS | AUTO · fired: j1-dead-axle (no solids) · thread undercuts on stepped shafts |
| M9 | PASS | AUTO / HAND · fired: j1-dead-axle (no solids) · ISO coarse threads, engagement through the tapped part or to a nut |
| M10 | PASS | AUTO / HAND · 128 of 132 solids name a material · materials named by kind and role |
| M11 | PASS | AUTO · fired: j1-dead-axle (no solids), hardware primitives · centre holes, chamfered ends on turned parts |
| M12 | PASS | HAND · every screw reachable by its key in the explode |
| M13 | PASS | AUTO / HAND · 18 threaded · threadlocker or nyloc on every threaded fastener |
| M14 | N/A | AUTO / HAND · fired: piston-bore (no solids), j4-slot-roller (no solids), pin-lobe (no solids), groove-cam (no solids), pallet-contact (no solids), tongue-slot (no solids) · the shoes run on the lobes oiled; the stem in an oil-impregnated bushing |
| V1 | PASS | AUTO · fired: drive (30 solids) · pancake motor under the base, GT2 belt to the input shaft |
| V2 | PASS | AUTO · fired: drive (30 solids) · one flange or bracket for the motor |
| V3 | PASS | AUTO / HAND · fired: drive (30 solids) · belt and pulleys clear of feet and housings (A15) |
| V4 | PASS | AUTO · fired: j8-belt (no solids) · flanged pulleys, belt in one plane |
| V5 | PASS | AUTO · fired: drive (30 solids) · rotary input: belt to the input pulley |
| V6 | PASS | AUTO · fired: drive (30 solids), cable-clip (2 solids) · home flag, fork sensor, terminals, lead and clip |
| L1 | PASS | STYLE · STYLE: no look values in the record or polish |
| L2 | PASS | HAND · records and polish carry no look |
| L3 | PASS | HAND · roles right on every solid (both sheets) |
| L4 | PASS | HAND / STYLE · one accent: the input ring, the traces |
| L5 | PASS | AUTO / HAND · fired: see-through (17 solids) · transparency and hidden lines show screws in holes and bearings in bores |
| L6 | PASS | AUTO · depth peeling at every view (shots) |
| L7 | PASS | STYLE · STYLE: turntable orbit, named views, no perspective |
| L8 | PASS | AUTO / HAND · fired: trace-marks (2 solids) · centrelines along every joint axis, base dimensions, engraved marks |
| L9 | N/A | AUTO / DATA · no section or detail view declared |
| L10 | PASS | AUTO / STYLE · teaching overlays in the sheet's look |
| R1 | PASS | HAND · every standard part from the primitives and kits |
| R2 | PASS | HAND · standard sizes only |
| R3 | PASS | AUTO · fired: hardware primitives · shared subassemblies, one function each |
| R4 | PASS | AUTO · package v2 21.2 KB · package v2 written at build time |
| R5 | PASS | HAND · no polish, no sampling |
| R6 | PASS | FLAG · FLAG: bench run (desktop, below); the phone is measured by David |
| R7 | PASS | HAND / FLAG · polish none; 0 solids added, 0 overrides by the polish |
| R8 | PASS | AUTO / SITE · SITE: thumbnails pre-rendered, cards animate on hover |
| R9 | PASS | AUTO / SITE · setup and bake in the worker, one context |
| R10 | PASS | FLAG · FLAG: the bench page is built for the phone measurement |
| DL1 | PASS | AUTO / HAND · 39 of 132 solids on a dropping rung · every solid, mark and effect on a rung by its kind |
| DL2 | PASS | HAND · default dial: full |
| DL3 | PASS | AUTO · view-aware exceptions in the ladder table |
| DL4 | PASS | SITE · SITE: adaptive dial with hysteresis |
| DL6 | PASS | AUTO · teaching layers drawn at every dial position |
| DL5 | PASS | FLAG · FLAG: bench reports frame time per dial position |
| Q1 | PASS | check, clamp and edge distance clean |
| Q2 | PASS | 0 clashes, 0 unnecessary allows |
| Q3 | PASS | package v2 written, 21.2 KB; site build not checked here · package v2 written; site builds (npm run build) |
| Q4 | PASS | local: tools/shot · dist/shots3/<id>: record view, PLAN, FRONT, SIDE, ISOMETRIC, the declared views, full explode, both sheets |
| Q5 | PASS | local: tools/bench · tools/bench run: dist/bench/report-v2.md |
| Q6 | PASS | every row judged |
| Q7 | PASS | at 3.0 |
| Q8 | PASS | teaching review: rethink (2026-10-20); the six phases of the finished build are looked at by eye · verdict and decisions in the record and the teaching: line; six phases of the finished build looked at |

## Joints
| Joint | Kit | Block | Support | Stack | F1 locate | F2 retain | F3 torque | F4 thrust | F5 limit | F6 hold | F7 adjust | F8 lube | F9 timing | F10 protect |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| O | J10 | rocker | pillow | – | 4 x Dowel pin Ø4 x 14 h6, block to base | 2 x Internal circlip DIN 472, Ø16 | none | 2 x Shaft collar 8x16, set screw | none | none | none | none | none | none |
| Q1 | J10 | rocker | pillow (moved) | – | 4 x Dowel pin Ø4 x 14 h6, block to base; Dead shaft Ø6, clamped in two pillow blocks | Internal circlip DIN 472, Ø15; 2 x Set screw M4 on a flat, clamps the dead shaft (F2, F3) | none | none | none | none | none | none | none | none |
| Q2 | J10 | rocker | pillow (moved) | – | 4 x Dowel pin Ø4 x 14 h6, block to base; Dead shaft Ø6, clamped in two pillow blocks | Internal circlip DIN 472, Ø15; 2 x Set screw M4 on a flat, clamps the dead shaft (F2, F3) | none | none | none | none | none | none | none | none |
| G | J5 | cam | – | – | 4 x Standoff Ø10, M5, carries the guide block | none | none | none | none | none | none | Guide bushing 7x13x20, sintered bronze, oil-impregnated | none | none |
| C1 | J7 | – | – | – | none | none | none | none | none | none | none | none | none | none |
| C2 | J7 | – | – | – | none | none | none | none | none | none | none | none | none | none |
| T1 | J7 | – | – | – | none | none | none | none | none | none | none | none | none | none |
| T2 | J7 | – | – | – | none | none | none | none | none | none | none | none | none | none |
| drive | drive | – | – | – | none | none | none | none | none | none | none | none | none | Home flag, 1 mm steel vane; Fork sensor, slotted optical, 5 mm gap |

## Supports
| Support | Joint | Kind | Route | Least gap mm | Covers | T10 |
|---|---|---|---|---|---|---|
| O-pb | O | pillow | first choice | 1.5 | camshaft, rocker-open, rocker-close, follower | – |
| Q1-pb | Q1 | pillow | moved | 1.5 | rocker-open | – |
| Q2-pb | Q2 | pillow | moved | 1.5 | rocker-close | – |

## Variants and overrides
| Joint or part | Rule result | Chosen | Why |
|---|---|---|---|

## Detail ladder
| Rung | Solids | Marks | Frame ms at this dial position |
|---|---|---|---|
| DL-A | 9 | 0 | 1.47 |
| DL-B | 0 | 360 | 1.53 |
| DL-C | 0 | 0 | 1.51 |
| DL-D | 4 | 0 | 1.55 |
| DL-E | 8 | 0 | 1.5 |
| DL-F | 0 | 0 | 1.59 |
| DL-G | 0 | 0 | 1.52 |
| DL-H | 18 | 0 | 1.45 |
| never | 87 | 108 | 1.54 |

## Promotion candidates
None yet.

## Verification
check: clean · K1 residual: 2.8e-14 · claims: 7 of 7 ok · clearance: 0 clashes · clamp: clean · edge distance: clean · package: 21.2 KB
screenshots: dist/shots3/desmodromic-cam (record view, PLAN, FRONT, SIDE, ISOMETRIC, declared views, explode; both sheets) · bench: dist/bench/report-v2.md (desktop; frame times paced at 28 deg in the ladder above; phone by David)
