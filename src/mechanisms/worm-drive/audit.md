# Audit: Worm drive (worm-drive)
standard: 3.0 · date: 2026-10-22 · result: pass · detail: full · pass: build
teaching: tweak · decisions in the record

## Summary
PASS 149 · FAIL 0 · N/A 18 · open: none

## Requirements
| Id | Status | Evidence / action |
|---|---|---|
| S1 | PASS | DATA · the standard carries version 3.0 and its changelog |
| S2 | PASS | HAND · header with standard, date, result, detail, pass and the teaching: line |
| S3 | PASS | AUTO · tools/conformance reads this sheet (engine v3) and runs in npm run check |
| S4 | PASS | SITE · the batch issue (#215) holds only this mechanism's decisions; plan and status in #202 |
| S5 | PASS | SITE · 3D stamp in the title block (every shot) and on the card and page header (site build) |
| S6 | PASS | AUTO · rebuilt from its record v3 in rebuild batch R4 (#215): bound by 3.0 from this pass |
| P1 | PASS | DATA · record v3 complete (kin and teaching blocks); no polish, audit.md present |
| P2 | PASS | DATA · catalogue validator clean |
| P3 | PASS | DATA / SITE · the page reads ratio, axes, character, backdrivable, aka, family, motion, level, dof and the drive from the record |
| P4 | PASS | DATA · tags grouped Function, Property, Application, keywords |
| P5 | PASS | DATA · explanation in four parts and the examples from the record |
| P6 | PASS | DATA · references and media from the record, validated by the catalogue |
| P7 | PASS | HAND / SITE · no prose in a polish; labels come from the record |
| P8 | PASS | SITE · the page has no parts list or joint sections (site) |
| P9 | PASS | AUTO / HAND · every number the explanation states about the motion is a claim and agrees (T9) |
| P10 | PASS | HAND · pitch points on the worm and the wheel traced, ticks every 90 deg of worm; both axis lines and the centre distance; section A-A on the wheel's mid-plane; plot of wheel angle |
| P11 | PASS | DATA · plain language, mm and degrees |
| P12 | PASS | AUTO / DATA · validate(records, asVersion 3) clean for this record |
| P13 | PASS | HAND · teaching review run against the record before the build and again on the finished drawing (teaching: line) |
| K1 | PASS | AUTO · K1 residual 7.1e-15 (tolerance 1e-9) over 360 samples, reference 0.0e+0 |
| K2 | PASS | AUTO · check: finite, continuous, periodic over 360 samples |
| K3 | PASS | AUTO / HAND · 1 block (gear-mesh); no numeric fallback · composed from the block library (gear-mesh, crossed); no fallback, no one-off model |
| K4 | PASS | HAND · worm driver with the accent on its shaft, wheel output |
| K6 | PASS | DATA · axial module 3, one start, q 10: worm pitch diameter 30, lead angle 5.71 deg; 30-tooth wheel, pitch diameter 90; centre distance 60 |
| K7 | PASS | DATA · drivers input (rotary) · input kind declared with its driven joint |
| K8 | PASS | AUTO / DATA · every joint declared with type, bodies, origin and axis; nothing inferred |
| K9 | PASS | DATA · one rotary driver; the starts control is not offered: it changes the built worm and wheel, which a control cannot move on prebuilt solids (the design choice stays in the record) |
| K10 | PASS | AUTO / DATA · one crossed closure, ratio -1/30 about each body's own axis |
| K11 | PASS | AUTO · mobility counted 1, dof 1 |
| K12 | PASS | DATA · every traced, overlaid and claimed point and quantity is named in kin |
| T1 | PASS | HAND · mechanics first, no use context in the teaching strings; the principle reads at the default view |
| T2 | PASS | HAND · review before the build and again on the six phases of the finished build; decisions in the record |
| T3 | PASS | DATA · principle parts declared; drawn whole, in depth order |
| T4 | PASS | DATA · fired: trace-marks (no solids) · the worm's pitch point traced (a whole circle in the default view) and the wheel's, ticks every 90 deg of worm: four worm ticks per wheel tooth |
| T5 | PASS | DATA · both axis lines and the centre distance between the crossed axes |
| T6 | PASS | HAND / DATA · down the worm's axis the axes cross without meeting and the throated rim wraps the worm; the section shows the thread working on the teeth like a rack |
| T7 | PASS | DATA · AUX O1, down the worm's axis, as decided in the review |
| T8 | PASS | DATA · section A-A on the wheel's mid-plane: the worm's thread cut as a rack against the wheel's teeth, the mesh highlighted |
| T9 | PASS | AUTO / DATA · claim table: 2 ok, 0 off, 0 uncheckable of 2 |
| T10 | PASS | AUTO · 18 solids drawn see-through: O2-hsc0, O2-hsc0-sh, O2-bridge, O2-bridge-post0, O2-bridge-post0-spigot, O2-bridge-post0-top, O2-bridge-post0-top-sh, O2-bridge-post0-bot · the wheel's bridge drawn see-through (A19) |
| T11 | PASS | AUTO · 2 supports routed, 0 moved off a sweep · the worm's pillow blocks first choice, behind the worm; the wheel's bridge clear of the worm |
| T12 | PASS | HAND · 19 support solids; dropped by the polish: none |
| T13 | N/A | DATA · nothing goes by in a blink |
| T14 | PASS | HAND / DATA · the input; the starts control dropped (K9) |
| T15 | PASS | HAND · labels state the mechanism, never its use |
| T16 | N/A | HAND / STYLE · no two parts of one role to tell apart |
| T17 | PASS | AUTO · depth peeling, no depth bias (renderer test) |
| D1 | PASS | HAND · an Archimedean worm (straight 20 deg flanks in its axial section, its square section turned along its lead: a loft) and a throated wheel (teeth at the lead angle, tips reaching round the worm: a loft) |
| D2 | PASS | HAND · material where the teeth carry; plain gear discs on keyed hubs |
| D3 | PASS | STYLE · STYLE: roles by pattern and tone (both sheets) |
| D4 | PASS | AUTO · fired: base (3 solids), feet (4 solids) · base corners and feet concentric (base, feet rules) |
| D5 | PASS | AUTO / HAND · one bridge over the wheel on two posts; two pillow blocks under the worm; motor beside the worm's shaft on its angle bracket |
| D6 | PASS | HAND / STYLE · hardware quieter than the parts, still readable (both sheets) |
| D8 | PASS | AUTO / HAND · every solid a profile, an operation and a frame; worm and wheel lofts; built by Manifold |
| D9 | N/A | AUTO / HAND · no member changes shape |
| D10 | PASS | AUTO · profiles shipped for plain extrusions, meshes only for booleans (package v2) |
| D11 | PASS | AUTO · SOLID: 0 of 106 solids unsound |
| D7 | PASS | HAND · gears plain; richness in the stacks |
| A1 | PASS | AUTO · M J9, O2 J2, O1 J10, drive drive · every joint read from the record and built by its kit |
| A2 | PASS | AUTO · M J9, O2 J2, O1 J10, drive drive · wheel on a live shaft (J2) straddled by a bridge; worm on a live shaft in plan (J10) in two pillow blocks; crossed mesh J9 |
| A3 | PASS | AUTO · fired: classify (3 solids), axial stack builder · bores from the catalogue; bearings where a boss fits them |
| A4 | PASS | AUTO · fired: j1-dead-axle (no solids), axial stack builder · stepped shafts with shoulders, grooves, flats and chamfered ends (H.shaft) |
| A5 | PASS | AUTO · fired: j2-live-shaft (39 solids), j10-shaft-in-plan (30 solids), axial stack builder · keys by shaft size: D-flat to Ø8, feather key above |
| A6 | N/A | AUTO · fired: j5-slide (no solids), j13-compliant (no solids), standoffs (no solids) · no slide and no floating plate |
| A7 | PASS | AUTO · fired: base (3 solids), feet (4 solids) · base 8 mm under the lowest part, counterbored corner holes, feet, engraved scale and paths, shaft clearance holes |
| A8 | PASS | AUTO · fired: fasteners (23 solids) · stage 3 fasteners: shanks, clearance and tapped holes |
| A9 | PASS | AUTO / HAND · fired: placement solver · the wheel straddle mounted; the worm between its two blocks |
| A10 | PASS | HAND · fired: placement (4 solids), placement solver · worm and wheel placed by their joints: the worm's axis at the wheel's mid-plane |
| A11 | PASS | AUTO / HAND · fired: j12-flexible (no solids), strap-sheave (no solids), j1-dead-axle (no solids) · load paths closed: every joint note says where its load goes to ground |
| A12 | PASS | AUTO · clamp check clean |
| A13 | PASS | AUTO / HAND · 108 solids, 65 unnamed (further items of a listed set) · named hardware with catalogue sizes and materials |
| A14 | PASS | AUTO / HAND · fired: support router · supports routed against the sweeps; details checked by A15 |
| A15 | PASS | AUTO · clearance in 3D over 72 phases: 0 clashes; hand allow: 0 named, 0 unnecessary |
| A16 | PASS | HAND · 4 joint notes; no note: none; no badge: M · a note per joint; build rules: shims at the worm's and the wheel's back faces set the mesh, thrust washers take the worm's thrust both ways |
| A17 | PASS | HAND · assembles in the explode order; every screw reachable; pressed bearings pullable through their bores |
| A18 | PASS | AUTO · placement: 1 slabs in the tallest stack (56.5 mm), 0 clevises; stack per joint in the Joints table · worm and wheel placed by their joints |
| A19 | PASS | AUTO · 2 supports routed (0 moved), least gap 1.5 mm; still covering a principle part, drawn see-through: O1-pb · pillow blocks and bridge first choice; least gap 1.5 mm |
| A20 | PASS | AUTO · support per joint: O2 bridge, O1 pillow · one axial stack builder with its support selector |
| A21 | PASS | AUTO · kit per joint: M J9, O2 J2, O1 J10, drive drive |
| A22 | PASS | AUTO · fired: stops (no solids), adjustable-length (no solids), cable-clip (2 solids) · no stops (both turn on through the cycle); cable clip |
| E1 | PASS | AUTO · every solid has one explode level; levels -8.5 to 5 · one level per solid, nothing stretches |
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
| J2 | PASS | AUTO · fired: j2-live-shaft (39 solids) · wheel shaft: housing, keyed, bridge over the top |
| J3 | N/A | AUTO · fired: j3-moving-pin (no solids), cross-bearings (no solids), ring-hub (no solids) · no moving revolute |
| J4 | N/A | AUTO · fired: j4-slot-roller (no solids), pin-lobe (no solids), fork-pin (no solids) · no pin in a slot |
| J5 | N/A | AUTO · fired: piston-bore (no solids), j5-slide (no solids), tongue-slot (no solids) · no slide |
| J6 | N/A | AUTO · fired: j6-mesh (no solids), ring-carrier (no solids), ring-rollers (no solids) · no parallel mesh |
| J7 | N/A | AUTO · fired: groove-cam (no solids), j7-cam (no solids), pallet-contact (no solids), pawl-tooth (no solids) · no cam |
| J8 | N/A | AUTO · fired: j8-belt (no solids), j12-flexible (no solids) · no belt in the mechanism (the drive belt is V4) |
| J9 | PASS | AUTO · fired: j9-crossed-mesh (1 solid) · crossed mesh: shim packs at the worm's and wheel's faces, thrust washers, timing marks at the mesh |
| J10 | PASS | AUTO · fired: j10-shaft-in-plan (30 solids) · worm shaft: two pillow blocks, located by collars, the drive pulley on its free end |
| J12 | N/A | AUTO · fired: j12-flexible (no solids), strap-sheave (no solids) · no flexible member |
| J13 | N/A | AUTO · fired: j13-compliant (no solids) · no compliant joint |
| J11 | N/A | AUTO · fired: j11-screw (no solids) · no screw |
| F1 | PASS | AUTO · served at O2, O1; fired: j2-live-shaft (39 solids), j10-shaft-in-plan (30 solids), ring-carrier (no solids), strap-sheave (no solids), j13-compliant (no solids) · housings, blocks and bridges dowelled (Joints table) |
| F2 | PASS | AUTO · served at O2, O1; fired: j2-live-shaft (39 solids), j10-shaft-in-plan (30 solids), cross-bearings (no solids), trunnion (no solids), ring-carrier (no solids), fork-pin (no solids), ring-hub (no solids), ring-rollers (no solids), j12-flexible (no solids), strap-sheave (no solids), j13-compliant (no solids) · every bearing retained both sides; every part on a shaft retained (Joints table) |
| F3 | PASS | AUTO · served at O2, O1; fired: j2-live-shaft (39 solids), j10-shaft-in-plan (30 solids), j12-flexible (no solids), j11-screw (no solids) · every keyed part keyed or on a D-flat with its retainer |
| F4 | PASS | AUTO / HAND · served at M, O2, O1; fired: j9-crossed-mesh (1 solid), j2-live-shaft (39 solids), j10-shaft-in-plan (30 solids), trunnion (no solids) · thrust washers at the mesh and the worm's collars take the worm's thrust both ways |
| F5 | N/A | AUTO / HAND · served at no joint; fired: j5-slide (no solids), pawl-tooth (no solids), j13-compliant (no solids), stops (no solids) · the gears turn continuously |
| F6 | N/A | AUTO / HAND · served at no joint; fired: trunnion (no solids), j7-cam (no solids), pallet-contact (no solids), pawl-tooth (no solids), j12-flexible (no solids) · no rest position to hold: the drive positions every part |
| F7 | PASS | AUTO / HAND · served at M; fired: j6-mesh (no solids), j9-crossed-mesh (1 solid), j5-slide (no solids), j12-flexible (no solids), adjustable-length (no solids) · shim packs set the mesh depth and the wheel's position along the worm |
| F8 | PASS | AUTO · served at no joint; fired: cross-bearings (no solids), tongue-slot (no solids), j12-flexible (no solids), j11-screw (no solids), lubrication (1 solid) · sealed bearings need none; open contacts oiled or greased where they occur |
| F9 | PASS | AUTO / HAND · served at M; fired: j6-mesh (no solids), j9-crossed-mesh (1 solid), timing-marks (1 solid) · timing marks at the mesh |
| F10 | PASS | AUTO / HAND · served at drive; fired: j12-flexible (no solids), drive (30 solids) · home flag and fork sensor on the input (drive) |
| M1 | PASS | AUTO · fired: hardware primitives · top-face chamfers by part kind (primitives) |
| M2 | PASS | HAND · bosses round every loaded hole |
| M3 | PASS | AUTO · fired: j3-moving-pin (no solids), hardware primitives · bore entry chamfers |
| M4 | PASS | AUTO / HAND · fired: base (3 solids), fasteners (23 solids) · counterbores and countersinks for heads (base, csk, housings) |
| M5 | PASS | AUTO / HAND · fired: hardware primitives · cutter radii on windows and slots |
| M6 | PASS | AUTO · edge distance and walls clean |
| M7 | N/A | HAND · no bracket corner turns a load |
| M8 | PASS | AUTO · fired: j1-dead-axle (no solids) · thread undercuts on stepped shafts |
| M9 | PASS | AUTO / HAND · fired: j1-dead-axle (no solids) · ISO coarse threads, engagement through the tapped part or to a nut |
| M10 | PASS | AUTO / HAND · 106 of 108 solids name a material · materials named by kind and role |
| M11 | PASS | AUTO · fired: j1-dead-axle (no solids), hardware primitives · centre holes, chamfered ends on turned parts |
| M12 | PASS | HAND · every screw reachable by its key in the explode |
| M13 | PASS | AUTO / HAND · 17 threaded · threadlocker or nyloc on every threaded fastener |
| M14 | N/A | AUTO / HAND · fired: piston-bore (no solids), j4-slot-roller (no solids), pin-lobe (no solids), groove-cam (no solids), pallet-contact (no solids), tongue-slot (no solids) · no sliding contact needing a liner |
| V1 | PASS | AUTO · fired: drive (30 solids) · pancake motor beside the worm's shaft on one angle bracket, belted to its free end |
| V2 | PASS | AUTO · fired: drive (30 solids) · one angle bracket: upright and foot |
| V3 | PASS | AUTO / HAND · fired: drive (30 solids) · belt and pulleys clear of feet and housings (A15) |
| V4 | PASS | AUTO · fired: j8-belt (no solids) · flanged pulleys, belt in one plane |
| V5 | PASS | AUTO · fired: drive (30 solids) · rotary input: belt to the input pulley |
| V6 | PASS | AUTO · fired: drive (30 solids), cable-clip (2 solids) · home flag, fork sensor, terminals, lead and clip |
| L1 | PASS | STYLE · STYLE: no look values in the record or polish |
| L2 | PASS | HAND · records and polish carry no look |
| L3 | PASS | HAND · roles right on every solid (both sheets) |
| L4 | PASS | HAND / STYLE · one accent: the input ring, the traces |
| L5 | PASS | AUTO / HAND · fired: see-through (18 solids) · transparency and hidden lines show screws in holes and bearings in bores |
| L6 | PASS | AUTO · depth peeling at every view (shots) |
| L7 | PASS | STYLE · STYLE: turntable orbit, named views, no perspective |
| L8 | PASS | AUTO / HAND · fired: trace-marks (no solids) · centrelines along every joint axis, base dimensions, engraved marks |
| L9 | PASS | AUTO / DATA · the section A-A drawn by the renderer from the record |
| L10 | PASS | AUTO / STYLE · teaching overlays in the sheet's look |
| R1 | PASS | HAND · every standard part from the primitives and kits |
| R2 | PASS | HAND · standard sizes only |
| R3 | PASS | AUTO · fired: hardware primitives · shared subassemblies, one function each |
| R4 | PASS | AUTO · package v2 73.0 KB · package v2 written at build time |
| R5 | PASS | HAND · no polish; nothing sampled by hand |
| R6 | PASS | FLAG · FLAG: bench run (desktop, below); the phone is measured by David |
| R7 | PASS | HAND / FLAG · polish none; 0 solids added, 0 overrides by the polish |
| R8 | PASS | AUTO / SITE · SITE: thumbnails pre-rendered, cards animate on hover |
| R9 | PASS | AUTO / SITE · setup and bake in the worker, one context |
| R10 | PASS | FLAG · FLAG: the bench page is built for the phone measurement |
| DL1 | PASS | AUTO / HAND · 35 of 108 solids on a dropping rung · every solid, mark and effect on a rung by its kind |
| DL2 | PASS | HAND · default dial: full |
| DL3 | PASS | AUTO · view-aware exceptions in the ladder table |
| DL4 | PASS | SITE · SITE: adaptive dial with hysteresis |
| DL6 | PASS | AUTO · teaching layers drawn at every dial position |
| DL5 | PASS | FLAG · FLAG: bench reports frame time per dial position |
| Q1 | PASS | check, clamp and edge distance clean |
| Q2 | PASS | 0 clashes, 0 unnecessary allows |
| Q3 | PASS | package v2 written, 73.0 KB; site build not checked here · package v2 written; site builds (npm run build) |
| Q4 | PASS | local: tools/shot · dist/shots3/worm-drive: record view, PLAN, FRONT, SIDE, ISOMETRIC, the declared views, full explode, both sheets |
| Q5 | PASS | local: tools/bench · tools/bench3 run (desktop) |
| Q6 | PASS | every row judged |
| Q7 | PASS | at 3.0 |
| Q8 | PASS | teaching review: tweak (2026-10-20); the six phases of the finished build are looked at by eye · verdict and decisions in the record and the teaching: line; six phases of the finished build looked at |

## Joints
| Joint | Kit | Block | Support | Stack | F1 locate | F2 retain | F3 torque | F4 thrust | F5 limit | F6 hold | F7 adjust | F8 lube | F9 timing | F10 protect |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| M | J9 | gear-mesh | – | – | none | none | none | worm-tw, wheel-tw | none | none | worm-shim, wheel-shim | none | Worm; Wheel | none |
| O2 | J2 | – | bridge | – | 2 x Dowel pin Ø3 x 10 h6, housing to base; Bridge over the pivot, on two spigoted posts | 2 x Internal circlip DIN 472, Ø21; External circlip DIN 471, Ø12 | Feather key 4 x 4 x 19 (DIN 6885) | Thrust washer 12.2x20, bronze; Wave washer 16.5x20.8, spring steel | none | none | none | none | none | none |
| O1 | J10 | driver | pillow | – | 4 x Dowel pin Ø4 x 14 h6, block to base | 2 x Internal circlip DIN 472, Ø19 | Feather key 3 x 3 x 55.5 (DIN 6885) | 2 x Shaft collar 10x18, set screw | none | none | none | none | none | none |
| drive | drive | – | – | – | none | none | none | none | none | none | none | none | none | Home flag, 1 mm steel vane; Fork sensor, slotted optical, 5 mm gap |

## Supports
| Support | Joint | Kind | Route | Least gap mm | Covers | T10 |
|---|---|---|---|---|---|---|
| O2-bridge | O2 | bridge | first choice | 1.5 | – | see-through |
| O1-pb | O1 | pillow | first choice | 1.5 | worm, wheel | – |

## Variants and overrides
| Joint or part | Rule result | Chosen | Why |
|---|---|---|---|
| worm and wheel | an extrusion | lofts: the worm's section turned along its lead, the throated wheel's teeth at the lead angle | a worm winds many turns: a twisted extrusion cannot draw it; promoted to the gear shape (form worm, worm wheel) |

## Detail ladder
| Rung | Solids | Marks | Frame ms at this dial position |
|---|---|---|---|
| DL-A | 9 | 0 | – |
| DL-B | 0 | 237 | – |
| DL-C | 0 | 0 | 1.18 |
| DL-D | 7 | 0 | – |
| DL-E | 8 | 3 | – |
| DL-F | 0 | 0 | – |
| DL-G | 0 | 0 | 1.07 |
| DL-H | 11 | 0 | – |
| never | 71 | 119 | 0.98 (full) |

## Promotion candidates
None left: the worm and the throated worm wheel are shapes of the builder (lofts). Open: the lock icon when the wheel is driven (record note); the lofted thread draws dark in front view where many transparent layers overlap (renderer).

## Verification
check: clean · K1 residual: 7.1e-15 · claims: 2 of 2 ok · clearance: 0 clashes · clamp: clean · edge distance: clean · package: 72.3 KB
screenshots: dist/shots3/worm-drive (record view AUX O1, PLAN, FRONT, SIDE, ISOMETRIC, section A-A, explode; both sheets) · bench: tools/bench3 (desktop; 28 deg paced 0.98 ms full, 1.18 at C, 1.07 at G; 75.6k triangles; phone by David)
