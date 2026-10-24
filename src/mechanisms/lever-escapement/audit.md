# Audit: Lever escapement (lever-escapement)
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
| P10 | PASS | HAND · the impulse pin traced with 10-degree ticks; the line of centres, the lever's lift arc; a detail view of the stones; plots of wheel and lever angle |
| P11 | PASS | DATA · plain language, mm and degrees |
| P12 | PASS | AUTO / DATA · validate(records, asVersion 3) clean for this record |
| P13 | PASS | HAND · teaching review run against the record before the build and again on the finished drawing (teaching: line) |
| K1 | PASS | AUTO · K1 residual 2.4e-14 (tolerance 1e-9) over 360 samples, reference 0.0e+0 |
| K2 | PASS | AUTO · check: finite, continuous, periodic over 360 samples |
| K3 | PASS | AUTO / HAND · 1 block (escape); no numeric fallback · composed from the block library; no fallback, no one-off model |
| K4 | PASS | HAND · the balance's arbor carries the accent (the drive); the escape wheel is the output, the lever its pallets |
| K6 | PASS | DATA · 15 club teeth, tip 40, lever pivot at 46.19 (stones 60 degrees apart on tangents), fork 60, roller 16, window ±20, banking ±5.13; the escape block with the fork law and a speed limit: 12.21 and 11.79 degrees per beat, 24 per balance period; the fork checked by K1 while the pin is in it |
| K7 | PASS | DATA · drivers input (oscillating) · input kind declared with its driven joint |
| K8 | PASS | AUTO / DATA · every joint declared with type, bodies, origin and axis; nothing inferred |
| K9 | PASS | DATA · one oscillating driver, the balance's ±270 degrees |
| K10 | PASS | AUTO / DATA · one closure; the wheel's instant drops declared (drops: true), so its points may jump by design |
| K11 | PASS | AUTO · mobility counted 1, dof 1 |
| K12 | PASS | DATA · every traced, overlaid and claimed point and quantity is named in kin |
| T1 | PASS | HAND · mechanics first, no use context in the teaching strings; the principle reads at the default view |
| T2 | PASS | HAND · review before the build and again on the six phases of the finished build; decisions in the record |
| T3 | PASS | DATA · principle parts declared; drawn whole, in depth order |
| T4 | PASS | DATA · fired: trace-marks (1 solid) · the impulse pin with equal-time ticks: its quick pass through the fork |
| T5 | PASS | DATA · the line of centres, the lever's lift between its bankings |
| T6 | PASS | HAND / DATA · bench scale (wheel radius 40), the lever's 10.3-degree flip and the stones read |
| T7 | PASS | DATA · PLAN: the three arbors on one line |
| T8 | PASS | DATA · detail view of the stones on the teeth, lever and wheel highlighted |
| T9 | PASS | AUTO / DATA · claim table: 3 ok, 0 off, 0 uncheckable of 3 |
| T10 | PASS | AUTO · 7 solids drawn see-through: pallet-spring, W-ecl, W-axle-s4, W-axle-s5, L-ecl, L-axle-s4, L-axle-s5 · nothing static covers the stones, horns, fork or pin |
| T11 | PASS | AUTO · 0 supports routed, 0 moved off a sweep · the wheel and the lever on stub axles from the base (no bridges over them), the balance on its live arbor |
| T12 | PASS | HAND · 9 support solids; dropped by the polish: none |
| T13 | PASS | DATA · teaching.timeMap slows playback 3 times while the balance is within 35 degrees of its centre (both beats); the plot keeps the true input |
| T14 | PASS | HAND / DATA · the crank's turn (see K9) |
| T15 | PASS | HAND · labels state the mechanism, never its use |
| T16 | N/A | HAND / STYLE · no two parts of one role to tell apart |
| T17 | PASS | AUTO · depth peeling, no depth bias (renderer test) |
| D1 | PASS | HAND · club-toothed wheel; a lever with two stones reaching into the wheel's plane, a fork with horns; a thin-rimmed balance on four arms, its impulse pin on a narrow roller arm |
| D2 | PASS | HAND · the lever's arms carry the stones from a round pivot boss; the balance's mass in its rim |
| D3 | PASS | STYLE · STYLE: roles by pattern and tone (both sheets) |
| D4 | PASS | AUTO · fired: base (3 solids), feet (4 solids) · base corners and feet concentric (base, feet rules) |
| D5 | PASS | AUTO / HAND · pillow blocks for both arbors, a motor bracket |
| D6 | PASS | HAND / STYLE · hardware quieter than the parts, still readable (both sheets) |
| D8 | PASS | AUTO / HAND · every solid a profile, an operation and a frame |
| D9 | N/A | AUTO / HAND · no member changes shape |
| D10 | PASS | AUTO · profiles only |
| D11 | PASS | AUTO · SOLID: 0 of 99 solids unsound |
| D7 | PASS | HAND · wheel, anchor and pendulum plain; richness in the stacks |
| A1 | PASS | AUTO · B J2, fork fork-pin, pallet pawl-tooth, W J1, L J1, drive drive · every joint read from the record and built by its kit |
| A2 | PASS | AUTO · B J2, fork fork-pin, pallet pawl-tooth, W J1, L J1, drive drive · wheel and lever on dead stub axles (J1), the balance on a live arbor (J2, driven); the pallet contact (J7) and the fork and pin (J4) |
| A3 | PASS | AUTO · fired: classify (5 solids), axial stack builder · bores from the catalogue; bearings where a boss fits them |
| A4 | PASS | AUTO · fired: j1-dead-axle (23 solids), axial stack builder · stepped shafts with shoulders, grooves and chamfered ends (H.shaft) |
| A5 | PASS | AUTO · fired: j2-live-shaft (20 solids), j10-shaft-in-plan (no solids), axial stack builder · keys by shaft size: D-flat to Ø8, feather key above |
| A6 | N/A | AUTO · fired: j5-slide (no solids), j13-compliant (no solids), standoffs (no solids) · no slide and no floating plate |
| A7 | PASS | AUTO · fired: base (3 solids), feet (4 solids) · base under the lowest part, counterbored corner holes, feet, engraved scale and paths, shaft clearance holes |
| A8 | PASS | AUTO · fired: fasteners (4 solids) · stage 3 fasteners: shanks, clearance and tapped holes |
| A9 | PASS | AUTO / HAND · fired: placement solver · wheel and lever on stubs, the balance's arbor in a housing |
| A10 | PASS | HAND · fired: placement (10 solids), placement solver · the wheel and the stones in one plane; the lever above; the balance above the lever, its pin down into the fork |
| A11 | PASS | AUTO / HAND · fired: j12-flexible (no solids), strap-sheave (no solids), j1-dead-axle (23 solids) · load paths closed: every joint note says where its load goes to ground |
| A12 | PASS | AUTO · clamp check clean |
| A13 | PASS | AUTO / HAND · 99 solids, 47 unnamed (further items of a listed set) · named hardware with catalogue sizes and materials |
| A14 | PASS | AUTO / HAND · fired: support router · supports routed against the sweeps; details checked by A15 |
| A15 | PASS | AUTO · clearance in 3D over 72 phases: 0 clashes; hand allow: 0 named, 0 unnecessary |
| A16 | PASS | HAND · 6 joint notes; no note: none; no badge: none · a note per joint; build rules: wheel and lever on stubs, the balance windowed down to a small hub, the pin on a roller arm |
| A17 | PASS | HAND · assembles in the explode order; every screw reachable; pressed bearings pullable through their bores |
| A18 | PASS | AUTO · placement: 2 slabs in the tallest stack (11.0 mm), 0 clevises; stack per joint in the Joints table · axial positions set by the placement solver |
| A19 | PASS | AUTO · 0 supports routed (0 moved), least gap - mm; still covering a principle part, drawn see-through: none · supports placed off the principle's sweep where the router could |
| A20 | PASS | AUTO · support per joint: none · one axial stack builder with its support selector |
| A21 | PASS | AUTO · kit per joint: B J2, fork fork-pin, pallet pawl-tooth, W J1, L J1, drive drive |
| A22 | PASS | AUTO · fired: stops (no solids), adjustable-length (no solids), cable-clip (5 solids) · stop pins (banking) for the lever's swing; cable clips |
| E1 | PASS | AUTO · every solid has one explode level; levels -5 to 1.5 · one level per solid |
| E2 | PASS | AUTO · fired: explode (1 solid) · heads, shanks, washers and nuts move as one |
| E3 | PASS | AUTO · fired: explode (1 solid) · screws back out along their axes |
| E4 | PASS | HAND · last fitted goes furthest (explode shots, both sheets) |
| E5 | PASS | AUTO · fired: explode (1 solid) · pressed bearings, bushings and clips stay with their parts |
| E6 | PASS | AUTO · fired: explode (1 solid) · motor, bearings and pulley pair whole |
| E7 | PASS | AUTO · fired: explode (1 solid) · loose spacers midway |
| E8 | PASS | AUTO · fired: explode (1 solid) · keyed parts keep their order on their shaft |
| E9 | PASS | HAND · full explode readable in ISOMETRIC on both sheets, nothing leaves the frame |
| E10 | PASS | AUTO · fired: explode (1 solid) · each stack explodes along its joint axis, with trail lines |
| J1 | PASS | AUTO · fired: trunnion (no solids), j1-dead-axle (23 solids) · built by its kit (Joints table) |
| J2 | PASS | AUTO · fired: j2-live-shaft (20 solids) · built by its kit (Joints table) |
| J3 | N/A | AUTO · fired: j3-moving-pin (no solids), cross-bearings (no solids), ring-hub (no solids) · no moving revolute |
| J4 | PASS | AUTO · fired: j4-slot-roller (no solids), pin-lobe (no solids), fork-pin (3 solids) · built by its kit (Joints table) |
| J5 | N/A | AUTO · fired: piston-bore (no solids), j5-slide (no solids), tongue-slot (no solids) · no slide |
| J6 | N/A | AUTO · fired: j6-mesh (no solids), ring-rollers (no solids) · no parallel mesh |
| J7 | PASS | AUTO · fired: groove-cam (no solids), j7-cam (no solids), pallet-contact (no solids), pawl-tooth (2 solids) · built by its kit (Joints table) |
| J8 | N/A | AUTO · fired: j8-belt (no solids), j12-flexible (no solids) · no belt in the mechanism (the drive belt is V4) |
| J9 | N/A | AUTO · fired: j9-crossed-mesh (no solids) · no crossed mesh |
| J10 | N/A | AUTO · fired: j10-shaft-in-plan (no solids) · no shaft in plan |
| J12 | N/A | AUTO · fired: j12-flexible (no solids), strap-sheave (no solids) · no flexible member |
| J13 | N/A | AUTO · fired: j13-compliant (no solids) · no compliant joint |
| J11 | N/A | AUTO · fired: j11-screw (no solids) · no screw |
| F1 | PASS | AUTO · served at B, W, L; fired: j2-live-shaft (20 solids), j10-shaft-in-plan (no solids), strap-sheave (no solids), j13-compliant (no solids) · housings, blocks and bridges dowelled (Joints table) |
| F2 | PASS | AUTO · served at B, fork, W, L, drive; fired: wheels (no solids), j2-live-shaft (20 solids), j10-shaft-in-plan (no solids), cross-bearings (no solids), trunnion (no solids), fork-pin (3 solids), ring-hub (no solids), ring-rollers (no solids), j12-flexible (no solids), strap-sheave (no solids), j13-compliant (no solids) · every bearing retained both sides; every part on a shaft retained (Joints table) |
| F3 | PASS | AUTO · served at drive; fired: j2-live-shaft (20 solids), j10-shaft-in-plan (no solids), j12-flexible (no solids), j11-screw (no solids) · every keyed part keyed or on a D-flat with its retainer |
| F4 | PASS | AUTO / HAND · served at B, W, L; fired: j9-crossed-mesh (no solids), j2-live-shaft (20 solids), j10-shaft-in-plan (no solids), trunnion (no solids) · thrust washers where a part turns free axially |
| F5 | PASS | AUTO / HAND · served at no joint; fired: j5-slide (no solids), pawl-tooth (2 solids), j13-compliant (no solids), stops (no solids) · banking stop pins at both ends of the lever's swing |
| F6 | N/A | AUTO / HAND · served at pallet; fired: trunnion (no solids), j7-cam (no solids), pallet-contact (no solids), pawl-tooth (2 solids), j12-flexible (no solids) · the train urges the wheel; no spring |
| F7 | N/A | AUTO / HAND · served at no joint; fired: j6-mesh (no solids), j9-crossed-mesh (no solids), j5-slide (no solids), j12-flexible (no solids), adjustable-length (no solids) · nothing to adjust: the slots and arcs are cut to the centre distance |
| F8 | PASS | AUTO · served at no joint; fired: cross-bearings (no solids), tongue-slot (no solids), j12-flexible (no solids), j11-screw (no solids), lubrication (no solids) · sealed bearings need none; open contacts oiled or greased where they occur |
| F9 | N/A | AUTO / HAND · served at no joint; fired: j6-mesh (no solids), j9-crossed-mesh (no solids), timing-marks (1 solid) · no timing to set |
| F10 | PASS | AUTO / HAND · served at drive; fired: j12-flexible (no solids), drive (36 solids) · home flag and fork sensor on the input (drive); no belt to flange |
| M1 | PASS | AUTO · fired: hardware primitives · top-face chamfers by part kind (primitives) |
| M2 | PASS | HAND · bosses round every loaded hole |
| M3 | PASS | AUTO · fired: j3-moving-pin (no solids), hardware primitives · bore entry chamfers |
| M4 | PASS | AUTO / HAND · fired: base (3 solids), fasteners (4 solids) · counterbores and countersinks for heads (base, csk, housings) |
| M5 | PASS | AUTO / HAND · fired: hardware primitives · cutter radii on windows and slots |
| M6 | PASS | AUTO · edge distance and walls clean |
| M7 | N/A | HAND · no bracket corner turns a load |
| M8 | PASS | AUTO · fired: j1-dead-axle (23 solids) · thread undercuts on stepped shafts |
| M9 | PASS | AUTO / HAND · fired: j1-dead-axle (23 solids) · ISO coarse threads, engagement through the tapped part or to a nut |
| M10 | PASS | AUTO / HAND · 96 of 99 solids name a material · materials named by kind and role |
| M11 | PASS | AUTO · fired: j1-dead-axle (23 solids), hardware primitives · centre holes, chamfered ends on turned parts |
| M12 | PASS | HAND · every screw reachable by its key in the explode |
| M13 | PASS | AUTO / HAND · 10 threaded · threadlocker or nyloc on every threaded fastener |
| M14 | N/A | AUTO / HAND · fired: piston-bore (no solids), j4-slot-roller (no solids), pin-lobe (no solids), groove-cam (no solids), pallet-contact (no solids), tongue-slot (no solids) · the roller rolls in the slots; the locking surfaces are oiled |
| V1 | PASS | AUTO · fired: drive (36 solids) · brushless pancake motor Ø50 x 18 under the base; the oscillating input is motorised through a crank and link (V5) |
| V2 | PASS | AUTO · fired: drive (36 solids) · one flange for the motor, screwed up into the base from inside; nothing of the drive shows on top of the base |
| V3 | PASS | AUTO / HAND · fired: drive (36 solids) · motor, flange, crank, link and sector laid out clear of the feet, the housings and the base hardware (A15: 0 clashes over 72 phases) |
| V4 | PASS | AUTO · fired: j8-belt (no solids) · no belt in an oscillating drive; drive detail: crank clamped on the motor shaft's flat, bushings in the link, circlips on both pins, pinion set-screwed on the input shaft, the sector on a bushing on a shoulder screw into a post |
| V5 | PASS | AUTO · fired: drive (36 solids) · oscillating: the motor turns a 17.4 mm crank, a 56.3 mm link swings a gear sector that turns a pinion on the input 5 times as far (a swing wider than a crank and link can give) through exactly the modelled 540° (dead centres at the ends of the swing); the crank belongs to the drive |
| V6 | PASS | AUTO · fired: drive (36 solids), cable-clip (5 solids) · home flag on the input pinion's hub, fork sensor on a post, motor and sensor leads to a terminal block, cable clips |
| L1 | PASS | STYLE · STYLE: no look values in the record or polish |
| L2 | PASS | HAND · records and polish carry no look |
| L3 | PASS | HAND · roles right on every solid (both sheets) |
| L4 | PASS | HAND / STYLE · one accent: the input ring, the traces |
| L5 | PASS | AUTO / HAND · fired: see-through (7 solids) · transparency and hidden lines show screws in holes and bearings in bores |
| L6 | PASS | AUTO · depth peeling at every view (shots) |
| L7 | PASS | STYLE · STYLE: turntable orbit, named views, no perspective |
| L8 | PASS | AUTO / HAND · fired: trace-marks (1 solid) · centrelines along every joint axis, base dimensions, engraved marks |
| L9 | N/A | AUTO / DATA · no section or detail view declared |
| L10 | PASS | AUTO / STYLE · teaching overlays in the sheet's look |
| R1 | PASS | HAND · every standard part from the primitives and kits |
| R2 | PASS | HAND · standard sizes only |
| R3 | PASS | AUTO · fired: hardware primitives · shared subassemblies, one function each |
| R4 | PASS | AUTO · package v2 22.9 KB · package v2 written at build time |
| R5 | PASS | HAND · no polish, no sampling |
| R6 | PASS | FLAG · FLAG: bench run (desktop, below); the phone is measured by David |
| R7 | PASS | HAND / FLAG · polish none; 0 solids added, 0 overrides by the polish |
| R8 | PASS | AUTO / SITE · SITE: thumbnails pre-rendered, cards animate on hover |
| R9 | PASS | AUTO / SITE · setup and bake in the worker, one context |
| R10 | PASS | FLAG · FLAG: the bench page is built for the phone measurement |
| DL1 | PASS | AUTO / HAND · 38 of 99 solids on a dropping rung · every solid, mark and effect on a rung by its kind |
| DL2 | PASS | HAND · default dial: full |
| DL3 | PASS | AUTO · view-aware exceptions in the ladder table |
| DL4 | PASS | SITE · SITE: adaptive dial with hysteresis |
| DL6 | PASS | AUTO · teaching layers drawn at every dial position |
| DL5 | PASS | FLAG · FLAG: bench reports frame time per dial position |
| Q1 | PASS | check, clamp and edge distance clean |
| Q2 | PASS | 0 clashes, 0 unnecessary allows |
| Q3 | PASS | package v2 written, 22.9 KB; site build not checked here · package v2 written; site builds (npm run build) |
| Q4 | PASS | local: tools/shot · dist/shots3/<id>: record view, PLAN, FRONT, SIDE, ISOMETRIC, the declared views, full explode, both sheets |
| Q5 | PASS | local: tools/bench · tools/bench run: dist/bench/report-v2.md |
| Q6 | PASS | every row judged |
| Q7 | PASS | at 3.0 |
| Q8 | PASS | teaching review: tweak (2026-10-20); the six phases of the finished build are looked at by eye · verdict and decisions in the record and the teaching: line; six phases of the finished build looked at |

## Joints
| Joint | Kit | Block | Support | Stack | F1 locate | F2 retain | F3 torque | F4 thrust | F5 limit | F6 hold | F7 adjust | F8 lube | F9 timing | F10 protect |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| B | J2 | escape | – | – | 2 x Dowel pin Ø3 x 10 h6, housing to base | 2 x Internal circlip DIN 472, Ø7; External circlip DIN 471, Ø3 | none | Thrust washer 3.2x11, bronze; Wave washer 5x6.8, spring steel | none | none | none | none | none | none |
| fork | fork-pin | escape | – | – | none | Impulse pin Ø5, jewelled, on the balance | none | none | none | none | none | none | none | none |
| pallet | pawl-tooth | – | – | – | none | none | none | none | none | Torsion spring Ø13, wire 0.8: holds the pawl on the teeth | none | none | none | none |
| W | J1 | escape | – | – | Dead axle Ø5, shouldered, M4 end | External circlip DIN 471, Ø5 | none | Thrust washer 5.2x13, bronze | none | none | none | none | none | none |
| L | J1 | escape | – | – | Dead axle Ø5, shouldered, M4 end | External circlip DIN 471, Ø5 | none | Thrust washer 5.2x13, bronze | none | none | none | none | none | none |
| drive | drive | – | – | – | none | External circlip DIN 471, Ø3; 2 x External circlip DIN 471, Ø4 | Set screw M3 (DIN 916) on the shaft's flat, threadlocked | none | none | none | none | none | none | Home flag, 1 mm steel vane; Fork sensor, slotted optical, 5 mm gap |

## Supports
| Support | Joint | Kind | Route | Least gap mm | Covers | T10 |
|---|---|---|---|---|---|---|

## Variants and overrides
| Joint or part | Rule result | Chosen | Why |
|---|---|---|---|

## Detail ladder
| Rung | Solids | Marks | Frame ms at this dial position |
|---|---|---|---|
| DL-A | 5 | 0 | 1.71 |
| DL-B | 0 | 137 | 1.78 |
| DL-C | 0 | 0 | 1.76 |
| DL-D | 8 | 0 | 1.76 |
| DL-E | 12 | 0 | 1.8 |
| DL-F | 0 | 0 | 1.79 |
| DL-G | 0 | 0 | 1.77 |
| DL-H | 13 | 0 | 1.73 |
| never | 61 | 88 | 1.77 |

## Promotion candidates
None yet.

## Verification
check: clean · K1 residual: 2.4e-14 · claims: 3 of 3 ok · clearance: 0 clashes · clamp: clean · edge distance: clean · package: 22.1 KB
screenshots: dist/shots3/lever-escapement (record view, PLAN, FRONT, SIDE, ISOMETRIC, declared views, explode; both sheets) · bench: dist/bench/report-v2.md (desktop; frame times paced at 28 deg in the ladder above; phone by David)
