# Audit: Sarrus linkage (sarrus-linkage)
standard: 3.0 · date: 2026-10-22 · result: pass · detail: full · pass: build
teaching: keep · decisions in the record

## Summary
PASS 145 · FAIL 0 · N/A 22 · open: none

## Requirements
| Id | Status | Evidence / action |
|---|---|---|
| S1 | PASS | DATA · the standard carries version 3.0 and its changelog |
| S2 | PASS | HAND · header with standard, date, result, detail, pass and the teaching: line |
| S3 | PASS | AUTO · tools/conformance reads this sheet (engine v3) and runs in npm run check |
| S4 | PASS | SITE · SITE · the pass issue holds only this mechanism's decisions; plan and status in #217 |
| S5 | PASS | SITE · 3D stamp in the title block (every shot) and on the card and page header (site build) |
| S6 | PASS | AUTO · rebuilt from its record v3 in batch R6 (#217): bound by 3.0 from this pass |
| P1 | PASS | DATA · record v3 complete (kin and teaching blocks); no polish, audit.md present |
| P2 | PASS | DATA · catalogue validator clean |
| P3 | PASS | DATA / SITE · the page reads ratio, axes, character, backdrivable, aka, family, motion, level, dof and the drive from the record |
| P4 | PASS | DATA · tags grouped Function, Property, Application, keywords |
| P5 | PASS | DATA · explanation in four parts and the examples from the record |
| P6 | PASS | DATA · references and media from the record, validated by the catalogue |
| P7 | PASS | HAND / SITE · no prose in the polish; labels come from the record |
| P8 | PASS | SITE · the page has no parts list or joint sections (site) |
| P9 | PASS | AUTO / HAND · every number the explanation states is a claim and agrees (T9) |
| P10 | PASS | HAND · top plate centre traced with 5-degree ticks (bunched near the top), both knees traced, the straight line and both limbs' hinge axes; plate height plotted |
| P11 | PASS | DATA · plain language, mm and degrees |
| P12 | PASS | AUTO / DATA · validate(records, asVersion 3) clean for this record |
| P13 | PASS | HAND · teaching review run against the record before the build (E2, #204) and again on six phases of the finished build (teaching: line) |
| K1 | PASS | AUTO · K1 residual 4.3e-14 (tolerance 1e-9) over 360 samples, reference 0.0e+0 |
| K2 | PASS | AUTO · check: finite, continuous, periodic over 360 samples |
| K3 | PASS | AUTO / HAND · 1 block (sarrus); no numeric fallback · composed from the block library; no fallback, no one-off model |
| K4 | PASS | HAND · limb 1's lower leaf driver with the accent, the top plate output, three more leaves |
| K6 | PASS | DATA · each limb folds in its own vertical plane at 90 deg to the other: the upper leaf's angle equals the lower's, so the top hinge stays over the base hinge and the plate rises along a straight line |
| K7 | PASS | DATA · drivers input (oscillating) · input kind declared with its driven joint |
| K8 | PASS | AUTO / DATA · every joint declared with type, bodies, origin and axis; nothing inferred |
| K9 | PASS | DATA · one oscillating driver, 10 to 80 deg from vertical |
| K10 | PASS | AUTO / DATA · closed forms, continuous over the cycle; no branch flips |
| K11 | PASS | AUTO · mobility counted 0, dof 1 |
| K12 | PASS | DATA · every traced, overlaid and claimed point and quantity is named in kin |
| T1 | PASS | HAND · mechanics first, no use context in the teaching strings; the principle reads at the default view |
| T2 | PASS | HAND · review before the build and again on six phases of the finished build; decisions in the record |
| T3 | PASS | DATA · principle parts declared; drawn whole, in depth order |
| T4 | PASS | DATA · fired: trace-marks (1 solid) · the plate centre's straight path with uneven ticks; both knees |
| T5 | PASS | DATA · the straight line and the two limbs' hinge axes, at right angles |
| T6 | PASS | HAND / DATA · 60 mm leaves: a 97 mm straight stroke |
| T7 | PASS | DATA · ISOMETRIC, where both limbs' planes show |
| T8 | N/A | DATA · the principle lies in plain view, no section needed |
| T9 | PASS | AUTO / DATA · claim table: 5 ok, 0 off, 0 uncheckable of 5 |
| T10 | PASS | AUTO · 3 solids drawn see-through: H1-pb-b0-col0, H2-pb-b1, H2-pb-b1-ss · the input blocks drawn see-through where they cover the yoke |
| T11 | PASS | AUTO · 2 supports routed, 1 moved off a sweep · the base hinges' blocks routed off the sweeps |
| T12 | PASS | HAND · 17 support solids; dropped by the polish: none |
| T13 | N/A | DATA · nothing goes by in a blink |
| T14 | PASS | HAND / DATA · the input lever's swing |
| T15 | PASS | HAND · labels state the mechanism, never its use |
| T16 | N/A | HAND / STYLE · no two parts of one role to tell apart |
| T17 | PASS | AUTO · depth peeling, no depth bias (renderer test) |
| D1 | PASS | HAND · fired: wheels (no solids) · leaves as wide hinged bars side by side on their hinges; the top plate on two lugs |
| D2 | PASS | HAND · bosses round every pin; lugs as webs into the plate |
| D3 | PASS | STYLE · STYLE: roles by pattern and tone (both sheets) |
| D4 | PASS | AUTO · fired: base (3 solids), feet (4 solids) · base corners and feet concentric (base, feet rules) |
| D5 | PASS | AUTO / HAND · two pillow blocks per base hinge |
| D6 | PASS | HAND / STYLE · hardware quieter than the parts, still readable (both sheets) |
| D8 | PASS | AUTO / HAND · every solid a profile, an operation and a frame; built by Manifold; no layers, dz or twin |
| D9 | N/A | AUTO / HAND · no member changes shape |
| D10 | PASS | AUTO · profiles shipped for plain extrusions, meshes only for booleans (package v2) |
| D11 | PASS | AUTO · SOLID: 0 of 143 solids unsound |
| D7 | PASS | HAND · leaves and plates plain; richness in the stacks |
| A1 | PASS | AUTO · K1 J3, T1 J3, K2 J3, T2 J3, H1 J10, H2 J10 · every joint read from the record and built by its kit |
| A2 | PASS | AUTO · K1 J3, T1 J3, K2 J3, T2 J3, H1 J10, H2 J10 · the base hinges as shafts in plan in pillow blocks (J10); knees and top hinges moving pins (J3) through the leaves and the plate's lugs |
| A3 | PASS | AUTO · fired: classify (6 solids), axial stack builder · bores from the catalogue; bearings where a boss fits them |
| A4 | PASS | AUTO · fired: j1-dead-axle (no solids), axial stack builder · stepped shafts with shoulders, grooves, flats and chamfered ends (H.shaft) |
| A5 | PASS | AUTO · fired: j2-live-shaft (no solids), j10-shaft-in-plan (54 solids), axial stack builder · keys by shaft size: D-flat to Ø8, feather key above |
| A6 | N/A | AUTO · fired: j5-slide (no solids), j13-compliant (no solids), standoffs (no solids) · no slide and no floating plate |
| A7 | PASS | AUTO · fired: base (3 solids), posts (no solids), feet (4 solids) · base 8 mm under the lowest part, counterbored corner holes, feet, engraved scale and paths, shaft clearance holes |
| A8 | PASS | AUTO · fired: fasteners (24 solids) · stage 3 fasteners: shanks, clearance and tapped holes |
| A9 | PASS | AUTO / HAND · fired: placement solver · every hinge through two parts; base hinges in two blocks each |
| A10 | PASS | HAND · fired: placement (10 solids), placement solver · leaves placed by the record side by side along their hinges; the plate's lugs beside the upper leaves |
| A11 | PASS | AUTO / HAND · fired: j12-flexible (no solids), strap-sheave (no solids), j1-dead-axle (no solids) · load paths closed: every joint note says where its load goes to ground |
| A12 | PASS | AUTO · clamp check clean |
| A13 | PASS | AUTO / HAND · 106 solids, 61 unnamed (further items of a listed set) · named hardware with catalogue sizes and materials |
| A14 | PASS | AUTO / HAND · fired: support router · supports routed against the sweeps (least gap 1.5 mm); details checked by A15 |
| A15 | PASS | AUTO · clearance in 3D over 72 phases: 0 clashes; hand allow: 0 named, 0 unnecessary |
| A16 | PASS | HAND · 6 joint notes; no note: none; no badge: none · a note per joint; the top plate meets its hinges through lugs (record) |
| A17 | PASS | HAND · assembles in the explode order; every screw reachable; pressed bearings and liners pullable through their bores |
| A18 | PASS | AUTO · placement: 2 slabs in the tallest stack (42.0 mm), 0 clevises; stack per joint in the Joints table · axial positions set by the placement solver; bodies on their cone or centre placed where the joints put them |
| A19 | PASS | AUTO · 2 supports routed (1 moved), least gap 1.5 mm; still covering a principle part, drawn see-through: H1-pb, H2-pb · blocks routed, least gap 1.5 mm, see-through where they cover the input yoke |
| A20 | PASS | AUTO · support per joint: H1 pillow, H2 pillow · one axial stack builder with its support selector |
| A21 | PASS | AUTO · kit per joint: K1 J3, T1 J3, K2 J3, T2 J3, H1 J10, H2 J10 |
| A22 | PASS | AUTO · fired: stops (no solids), adjustable-length (no solids), cable-clip (5 solids) · no hand fixes; the cable clip by its rule; no stops (the drive bounds the swing, F5) |
| E1 | PASS | AUTO · every solid has one explode level; levels -4 to 1.5 · one level per solid, nothing stretches |
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
| J2 | N/A | AUTO · fired: j2-live-shaft (no solids) · no live shaft under the base |
| J3 | PASS | AUTO · fired: j3-moving-pin (40 solids), cross-bearings (no solids), ball-socket (no solids), ring-hub (no solids) · cross-pin kit: needle cups in the arms, internal circlips, grease nipple on the cross |
| J4 | N/A | AUTO · fired: j4-slot-roller (no solids), pin-lobe (no solids), fork-pin (no solids) · no pin in a slot |
| J5 | N/A | AUTO · fired: tongue-slot (no solids), piston-bore (no solids), j5-slide (no solids) · no slide |
| J6 | N/A | AUTO · fired: j6-mesh (no solids), ring-rollers (no solids) · no parallel mesh |
| J7 | N/A | AUTO · fired: ball-socket (no solids), groove-cam (no solids), j7-cam (no solids), pallet-contact (no solids), pawl-tooth (no solids) · no cam |
| J8 | N/A | AUTO · fired: j8-belt (no solids), j12-flexible (no solids) · no belt in the mechanism (the drive belt is V4) |
| J9 | N/A | AUTO · fired: j9-crossed-mesh (no solids) · no crossed mesh |
| J10 | PASS | AUTO · fired: j10-shaft-in-plan (54 solids) · both base hinges: shafts in two pillow blocks |
| J12 | N/A | AUTO · fired: j12-flexible (no solids), strap-sheave (no solids) · no flexible member |
| J13 | N/A | AUTO · fired: j13-compliant (no solids) · no compliant joint |
| J11 | N/A | AUTO · fired: j11-screw (no solids) · no screw |
| F1 | PASS | AUTO · served at H1, H2; fired: posts (no solids), j2-live-shaft (no solids), j10-shaft-in-plan (54 solids), strap-sheave (no solids), j13-compliant (no solids) · housings, blocks and bridges dowelled (Joints table) |
| F2 | PASS | AUTO · served at K1, T1, K2, T2, H1, H2; fired: wheels (no solids), j2-live-shaft (no solids), j10-shaft-in-plan (54 solids), cross-bearings (no solids), trunnion (no solids), fork-pin (no solids), ring-hub (no solids), ring-rollers (no solids), j12-flexible (no solids), strap-sheave (no solids), j13-compliant (no solids) · every bearing retained both sides; every part on a shaft retained (Joints table) |
| F3 | PASS | AUTO · served at K1, T1, K2, T2; fired: j2-live-shaft (no solids), j10-shaft-in-plan (54 solids), j12-flexible (no solids), j11-screw (no solids) · every keyed part keyed or on a D-flat with its retainer |
| F4 | PASS | AUTO / HAND · served at H1; fired: j9-crossed-mesh (no solids), j2-live-shaft (no solids), j10-shaft-in-plan (54 solids), trunnion (no solids) · thrust washers where a part turns free axially |
| F5 | N/A | AUTO / HAND · served at no joint; fired: integrator-carriage (no solids), j5-slide (no solids), pawl-tooth (no solids), j11-screw (no solids), j13-compliant (no solids), stops (no solids) · the crank and link bound limb 1's swing to the modelled 10 to 80 deg (a dead centre at each end), with the drive on or off: no stop to fit |
| F6 | N/A | AUTO / HAND · served at no joint; fired: trunnion (no solids), j7-cam (no solids), pallet-contact (no solids), pawl-tooth (no solids), j12-flexible (no solids) · no rest position to hold: the drive positions every part |
| F7 | N/A | AUTO / HAND · served at no joint; fired: j6-mesh (no solids), j9-crossed-mesh (no solids), j5-slide (no solids), j12-flexible (no solids), adjustable-length (no solids) · no exact length or mesh to adjust |
| F8 | PASS | AUTO · served at no joint; fired: tongue-slot (no solids), cross-bearings (no solids), ball-socket (no solids), j12-flexible (no solids), j11-screw (no solids), lubrication (no solids) · sealed bearings; bronze bushings and liners oil-impregnated |
| F9 | PASS | AUTO / HAND · served at no joint; fired: j6-mesh (no solids), j9-crossed-mesh (no solids), timing-marks (1 solid) · zero line on the input and on the base (timing marks) |
| F10 | PASS | AUTO / HAND · served at drive; fired: j12-flexible (no solids), drive (36 solids) · home flag and fork sensor on the input (drive); no belt to flange |
| M1 | PASS | AUTO · fired: hardware primitives · top-face chamfers by part kind (primitives) |
| M2 | PASS | HAND · bosses round every bore |
| M3 | PASS | AUTO · fired: j3-moving-pin (40 solids), hardware primitives · bore entry chamfers |
| M4 | PASS | AUTO / HAND · fired: base (3 solids), fasteners (24 solids) · counterbores and countersinks for heads (base, csk, housings) |
| M5 | PASS | AUTO / HAND · fired: hardware primitives · cutter radii on windows and slots |
| M6 | PASS | AUTO · edge distance and walls clean |
| M7 | N/A | HAND · no bracket corner turns a load |
| M8 | PASS | AUTO · fired: j1-dead-axle (no solids) · thread undercuts on stepped shafts |
| M9 | PASS | AUTO / HAND · fired: j1-dead-axle (no solids) · ISO coarse threads, engagement through the tapped part or to a nut |
| M10 | PASS | AUTO / HAND · 101 of 106 solids name a material · materials named by kind and role |
| M11 | PASS | AUTO · fired: j1-dead-axle (no solids), hardware primitives · centre holes, chamfered ends on turned parts |
| M12 | PASS | HAND · every screw reachable by its key in the explode |
| M13 | PASS | AUTO / HAND · 12 threaded · threadlocker or nyloc on every threaded fastener |
| M14 | N/A | AUTO / HAND · fired: tongue-slot (no solids), piston-bore (no solids), j4-slot-roller (no solids), pin-lobe (no solids), groove-cam (no solids), pallet-contact (no solids) · no sliding contact needing a liner |
| V1 | PASS | AUTO · fired: drive (36 solids) · brushless pancake motor Ø50 x 18 beside limb 1's base hinge shaft (J10), its axis along the shaft; the oscillating input is motorised through a crank and link (V5) |
| V2 | PASS | AUTO · fired: drive (36 solids) · one angle bracket: the motor's face on its upright, its foot screwed to the base top |
| V3 | PASS | AUTO / HAND · fired: drive (36 solids) · motor, bracket, crank, link and lever laid out clear of the feet, the blocks and the base hardware (A15: 0 clashes over 72 phases) |
| V4 | PASS | AUTO · fired: j8-belt (no solids) · no belt in an oscillating drive; drive detail: crank clamped on the motor shaft's flat, bushings in the link, circlips on both pins, lever set-screwed on the shaft's flat |
| V5 | PASS | AUTO · fired: drive (36 solids) · oscillating: the motor turns a 12.6 mm crank, a 44 mm link swings a 22 mm lever on the shaft's free end through exactly the modelled 70 deg (dead centres at the ends of the swing); the crank belongs to the drive. The shaft stands low over the base, so the fork sits beside the lever's hub on its post |
| V6 | PASS | AUTO · fired: drive (36 solids), cable-clip (5 solids) · home flag on the input lever's hub, fork sensor on a post, motor and sensor leads to a terminal block, cable clips |
| L1 | PASS | STYLE · STYLE: no look values in the record or polish |
| L2 | PASS | HAND · records and polish carry no look |
| L3 | PASS | HAND · roles right on every solid (both sheets) |
| L4 | PASS | HAND / STYLE · one accent: the input ring, the traces |
| L5 | PASS | AUTO / HAND · fired: see-through (3 solids) · transparency and hidden lines show screws in holes and bearings in bores |
| L6 | PASS | AUTO · depth peeling at every view (shots) |
| L7 | PASS | STYLE · STYLE: turntable orbit, named views, no perspective |
| L8 | PASS | AUTO / HAND · fired: trace-marks (1 solid) · centrelines along every joint axis, base dimensions, engraved marks |
| L9 | N/A | AUTO / DATA · no section or detail view declared |
| L10 | PASS | AUTO / STYLE · teaching overlays in the sheet's look |
| R1 | PASS | HAND · every standard part from the primitives and kits |
| R2 | PASS | HAND · standard sizes only |
| R3 | PASS | AUTO · fired: hardware primitives · shared subassemblies, one function each |
| R4 | PASS | AUTO · package v2 11.1 KB · package v2 written at build time |
| R5 | PASS | HAND · the polish states only exceptions, no sampling |
| R6 | PASS | FLAG · FLAG: bench run (desktop, below); the phone is measured by David |
| R7 | PASS | HAND / FLAG · polish none; 0 solids added, 0 overrides by the polish |
| R8 | PASS | AUTO / SITE · SITE: thumbnails pre-rendered, cards animate on hover |
| R9 | PASS | AUTO / SITE · setup and bake in the worker, one context |
| R10 | PASS | FLAG · FLAG: the bench page is built for the phone measurement |
| DL1 | PASS | AUTO / HAND · 41 of 106 solids on a dropping rung · every solid, mark and effect on a rung by its kind |
| DL2 | PASS | HAND · default dial: full |
| DL3 | PASS | AUTO · view-aware exceptions in the ladder table |
| DL4 | PASS | SITE · SITE: adaptive dial with hysteresis |
| DL6 | PASS | AUTO · teaching layers drawn at every dial position |
| DL5 | PASS | FLAG · FLAG: bench reports frame time per dial position |
| Q1 | PASS | check, clamp and edge distance clean |
| Q2 | PASS | 0 clashes, 0 unnecessary allows |
| Q3 | PASS | package v2 written, 11.1 KB; site build not checked here · package v2 written; site builds (npm run build) |
| Q4 | PASS | local: tools/shot · dist/shots3/<id> (and the batch's shot set): record view, PLAN, FRONT, SIDE, ISOMETRIC, the declared views, full explode, both sheets |
| Q5 | PASS | local: tools/bench · tools/bench3 run (desktop): frame times per view in the ladder above; the phone is measured by David |
| Q6 | PASS |  |
| Q7 | PASS |  |
| Q8 | PASS | teaching review: keep (2026-10-20); the six phases of the finished build are looked at by eye · verdict and decisions in the record and the teaching: line; six phases of the finished build looked at |

## Joints
| Joint | Kit | Block | Support | Stack | F1 locate | F2 retain | F3 torque | F4 thrust | F5 limit | F6 hold | F7 adjust | F8 lube | F9 timing | F10 protect |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| K1 | J3 | sarrus | – | – | none | Internal circlip DIN 472, Ø11; Shoulder bolt Ø5 x 25, M4 (ISO 7379) | Shoulder bolt Ø5 x 25, M4 (ISO 7379) | none | none | none | none | none | none | none |
| T1 | J3 | – | – | – | none | Internal circlip DIN 472, Ø11; Shoulder bolt Ø5 x 25, M4 (ISO 7379) | Shoulder bolt Ø5 x 25, M4 (ISO 7379) | none | none | none | none | none | none | none |
| K2 | J3 | sarrus | – | – | none | Internal circlip DIN 472, Ø11; Shoulder bolt Ø5 x 25, M4 (ISO 7379) | Shoulder bolt Ø5 x 25, M4 (ISO 7379) | none | none | none | none | none | none | none |
| T2 | J3 | – | – | – | none | Internal circlip DIN 472, Ø11; Shoulder bolt Ø5 x 25, M4 (ISO 7379) | Shoulder bolt Ø5 x 25, M4 (ISO 7379) | none | none | none | none | none | none | none |
| H1 | J10 | sarrus | pillow | – | 4 x Dowel pin Ø4 x 14 h6, block to base | 2 x Internal circlip DIN 472, Ø11 | none | 2 x Shaft collar 5x13, set screw | none | none | none | none | none | none |
| H2 | J10 | sarrus | pillow (moved) | – | 4 x Dowel pin Ø4 x 14 h6, block to base; Dead shaft Ø5, clamped in two pillow blocks | Internal circlip DIN 472, Ø11; 2 x Set screw M4 on a flat, clamps the dead shaft (F2, F3) | none | none | none | none | none | none | none | none |
| drive | drive | – | – | – | none | External circlip DIN 471, Ø5; 2 x External circlip DIN 471, Ø4 | Set screw M3 (DIN 916) on the shaft's flat, threadlocked | none | none | none | none | none | none | Home flag, 1 mm steel vane; Fork sensor, slotted optical, 5 mm gap |

## Supports
| Support | Joint | Kind | Route | Least gap mm | Covers | T10 |
|---|---|---|---|---|---|---|
| H1-pb | H1 | pillow | first choice | 1.5 | l1a, l1b, top | – |
| H2-pb | H2 | pillow | moved | 1.5 | l1a, l1b, l2a, top, l2b | – |

## Variants and overrides
| Joint or part | Rule result | Chosen | Why |
|---|---|---|---|
| leaves | parts on solver slabs | placed by the record side by side along their hinges | each limb's two leaves share one plane's hinges |
| top plate | no member of its hinges' stacks | two lugs on its underside (record: lugs) | its plane is square to its hinges |

## Detail ladder
| Rung | Solids | Marks | Frame ms at this dial position |
|---|---|---|---|
| DL-A | 15 | 0 | 2.07 |
| DL-B | 0 | 357 | 2.3 |
| DL-C | 0 | 0 | 2.37 |
| DL-D | 15 | 0 | 2.38 |
| DL-E | 12 | 0 | 2.22 |
| DL-F | 0 | 0 | 2.37 |
| DL-G | 0 | 0 | 2.31 |
| DL-H | 18 | 0 | 1.93 |
| never | 83 | 155 | 2.26 |

## Promotion candidates
Promoted in this pass: hinge lugs (`lugs` on a shape, the lugs rule), record-placed parts (`axial`), a link's `thickness`.

## Verification
check: clean · K1 residual: 4.3e-14 · claims: 5 of 5 ok · clearance: 0 clashes · clamp: clean · edge distance: clean · package: 17.2 KB
screenshots: dist/shots3/sarrus-linkage (record view, PLAN, FRONT, SIDE, ISOMETRIC, declared views, explode; both sheets) · bench: dist/bench/report-v2.md (desktop; frame times paced at 28 deg in the ladder above; phone by David)
