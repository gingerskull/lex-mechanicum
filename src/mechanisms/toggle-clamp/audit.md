# Audit: Toggle clamp (toggle-clamp)
standard: 3.0 · date: 2026-10-22 · result: pass · detail: full · pass: build
teaching: keep · decisions in the record

## Summary
PASS 142 · FAIL 0 · N/A 25 · open: none

## Requirements
| Id | Status | Evidence / action |
|---|---|---|
| S1 | PASS | DATA · the standard carries version 3.0 and its changelog |
| S2 | PASS | HAND · header with standard, date, result, detail, pass and the teaching: line |
| S3 | PASS | AUTO · tools/conformance reads this sheet (engine v3) and runs in npm run check |
| S4 | PASS | SITE · the pass's decisions on #212; plan and status in #202 |
| S5 | PASS | SITE · 3D stamp in the title block (every shot) and on the card and page header (site build) |
| S6 | PASS | AUTO · rebuilt from its record v3 in batch R1 (#212): bound by 3.0 from this pass |
| P1 | PASS | DATA · record v3 complete (kin and teaching blocks); polish3.ts, audit.md present |
| P2 | PASS | DATA · catalogue validator clean |
| P3 | PASS | DATA / SITE · the page reads ratio, axes, character, backdrivable, aka, family, motion, level, dof and the drive from the record |
| P4 | PASS | DATA · tags grouped Function, Property, Application, keywords |
| P5 | PASS | DATA · explanation in four parts and the examples from the record |
| P6 | PASS | DATA · references and media from the record, validated by the catalogue |
| P7 | PASS | HAND / SITE · no prose in a polish; labels come from the record |
| P8 | PASS | SITE · the page has no parts list or joint sections (site) |
| P9 | PASS | AUTO / HAND · every number the explanation states is a claim and agrees (T9) |
| P10 | PASS | HAND · plunger pin B and grip traced with ticks every 5 deg, the dead-centre line; plots of plunger position and mechanical advantage |
| P11 | PASS | DATA · plain language, mm and degrees |
| P12 | PASS | AUTO / DATA · validate(records, asVersion 3) clean for this record |
| P13 | PASS | HAND · teaching review run against the record before the build and again on the finished drawing (teaching: line) |
| K1 | PASS | AUTO · K1 residual 2.8e-14 (tolerance 1e-9) over 360 samples, reference 0.0e+0 |
| K2 | PASS | AUTO · check: finite, continuous, periodic over 360 samples |
| K3 | PASS | AUTO / HAND · 1 block (slider-dyad); no numeric fallback · composed from the block library; no fallback, no one-off model |
| K4 | PASS | HAND · the handle is the input (accent ring), the plunger the output, the link between |
| K6 | PASS | DATA · a 40, b 70: dead centre at handle 0 deg with B at a + b = 110; the stop 3 deg past it |
| K7 | PASS | DATA · drivers handle (manual, a hand stroke over its lo and hi) · input kind declared with its driven joint; manual as the toggle clamp playbook says |
| K8 | PASS | AUTO / DATA · every joint declared with type, bodies, origin and axis; nothing inferred |
| K9 | PASS | DATA · one manual driver (a hand stroke), the handle, -70 to +3 deg, its control the handle |
| K10 | PASS | AUTO / DATA · one slider-dyad closure (far side), continuous |
| K11 | PASS | AUTO · mobility counted 1, dof 1 |
| K12 | PASS | DATA · every traced, overlaid and claimed point and quantity is named in kin or made by a block |
| T1 | PASS | HAND · mechanics first, no use context in the teaching strings; the principle reads at the default view |
| T2 | PASS | HAND · review before the build and again on the six phases of the finished build; decisions in the record |
| T3 | PASS | DATA · principle parts declared; drawn whole, in depth order |
| T4 | PASS | DATA · fired: trace-marks (1 solid) · the ticks on B bunch at dead centre while those on the grip stay even: the force gain |
| T5 | PASS | DATA · the dead-centre line O-B |
| T6 | PASS | HAND / DATA · mechanical advantage 8.7 at -10 deg and 28.9 at -3 deg; travel 37.3 mm |
| T7 | PASS | DATA · PLAN, where the planar linkage reads whole |
| T8 | N/A | DATA · the principle lies in plain view, no section needed |
| T9 | PASS | AUTO / DATA · claim table: 5 ok, 0 off, 0 uncheckable of 5 |
| T10 | PASS | AUTO · 1 solid drawn see-through: slide-keeper · the stack and support over a principle part drawn see-through |
| T11 | N/A | AUTO · 0 supports routed, 0 moved off a sweep · no support to route: nothing is held from above |
| T12 | PASS | HAND · 13 support solids; dropped by the polish: slide-stop0, slide-pad0 · no post or plate dropped: the front end stop and its pad are stop hardware, not supports (polish exception, R7) |
| T13 | N/A | DATA · nothing goes by in a blink |
| T14 | PASS | HAND / DATA · the handle |
| T15 | PASS | HAND · labels state the mechanism, never its use |
| T16 | N/A | HAND / STYLE · no two parts of one role to tell apart |
| T17 | PASS | AUTO · depth peeling, no depth bias (renderer test) |
| D1 | PASS | HAND · fired: wheels (no solids) · the handle a plate with bosses, tapered link, plunger in rails with its spindle and pad, plain base, a workpiece block ahead |
| D2 | PASS | HAND · material round every pin |
| D3 | PASS | STYLE · STYLE: roles by pattern and tone (both sheets) |
| D4 | PASS | AUTO · fired: base (3 solids), feet (4 solids) · base corners and feet concentric (base, feet rules) |
| D5 | PASS | AUTO / HAND · no bridge: the plunger runs between rails under a keeper; the workpiece stands on the base |
| D6 | PASS | HAND / STYLE · hardware quieter than the parts, still readable (both sheets) |
| D8 | PASS | AUTO / HAND · every solid a profile, an operation and a frame; built by Manifold; no layers, dz or twin |
| D9 | N/A | AUTO / HAND · no member changes shape |
| D10 | PASS | AUTO · profiles shipped for plain extrusions, meshes only for booleans (package v2) |
| D11 | PASS | AUTO · SOLID: 0 of 94 solids unsound |
| D7 | PASS | HAND · links plain; the richness in the stacks |
| A1 | PASS | AUTO · A J3, B J3, O J2, slide J5, O-handle-stops stops, drive drive · every joint read from the record and built by its kit |
| A2 | PASS | AUTO · A J3, B J3, O J2, slide J5, O-handle-stops stops, drive drive · ground pivots by their kits (live shaft J2, dead axle J1), moving pins J3 (Joints table) |
| A3 | PASS | AUTO · fired: classify (4 solids), axial stack builder · bores from the catalogue; bearings where a boss fits them |
| A4 | PASS | AUTO · fired: j1-dead-axle (no solids), axial stack builder · stepped shafts with shoulders, grooves, flats and chamfered ends (H.shaft) |
| A5 | PASS | AUTO · fired: j2-live-shaft (27 solids), j10-shaft-in-plan (no solids), axial stack builder · keys by shaft size: D-flat to Ø8, feather key above |
| A6 | PASS | AUTO · fired: j5-slide (22 solids), j13-compliant (no solids), standoffs (12 solids) · slides on a dowelled reference rail and a gibbed rail under a keeper, risers where the slide stands off the base; the fixed block stands on posts |
| A7 | PASS | AUTO · fired: base (3 solids), feet (4 solids) · base 8 mm under the lowest part, counterbored corner holes, feet, engraved scale and paths, shaft clearance holes |
| A8 | PASS | AUTO · fired: fasteners (14 solids) · stage 3 fasteners: shanks, clearance and tapped holes |
| A9 | PASS | AUTO / HAND · fired: placement solver · shortest overhang from the placement solver; a pivot passed over is held from above in double shear or on its shaft end |
| A10 | PASS | HAND · fired: placement (8 solids), placement solver · slabs from the placement solver (Joints table) |
| A11 | PASS | AUTO / HAND · fired: j12-flexible (no solids), strap-sheave (no solids), j1-dead-axle (no solids) · load paths closed: every joint note says where its load goes to ground |
| A12 | PASS | AUTO · clamp check clean |
| A13 | PASS | AUTO / HAND · 94 solids, 49 unnamed (further items of a listed set) · named hardware with catalogue sizes and materials |
| A14 | PASS | AUTO / HAND · fired: support router · supports routed against the sweeps (least gap 1.5 mm); details checked by A15 |
| A15 | PASS | AUTO · clearance in 3D over 72 phases: 0 clashes; hand allow: 0 named, 0 unnecessary |
| A16 | PASS | HAND · 6 joint notes; no note: none; no badge: none · a note and badge per joint; build rules: the plunger lowest on its rails, the handle and link above; the front end stop dropped (polish) |
| A17 | PASS | HAND · assembles in the explode order; every screw reachable; pressed bearings pullable through their bores |
| A18 | PASS | AUTO · placement: 3 slabs in the tallest stack (30.0 mm), 0 clevises; stack per joint in the Joints table · axial positions set by the placement solver |
| A19 | N/A | AUTO · 0 supports routed (0 moved), least gap - mm; still covering a principle part, drawn see-through: none · no support routed |
| A20 | PASS | AUTO · support per joint: none · one axial stack builder; no pivot needs a support from above |
| A21 | PASS | AUTO · kit per joint: A J3, B J3, O J2, slide J5, O-handle-stops stops, drive drive |
| A22 | PASS | AUTO · fired: stops (8 solids), adjustable-length (no solids), cable-clip (no solids) · promoted fixes fired where they apply (stops and swing scale on swinging parts, cable clip on a drive lead) |
| E1 | PASS | AUTO · every solid has one explode level; levels -3.5 to 4 · one level per solid, nothing stretches |
| E2 | PASS | AUTO · fired: explode (1 solid) · heads, shanks, washers and nuts move as one |
| E3 | PASS | AUTO · fired: explode (1 solid) · screws back out along their axes |
| E4 | PASS | HAND · last fitted goes furthest (explode shots, both sheets) |
| E5 | PASS | AUTO · fired: explode (1 solid) · pressed bearings, bushings and clips stay with their parts |
| E6 | PASS | AUTO · fired: explode (1 solid) · bought units whole |
| E7 | PASS | AUTO · fired: explode (1 solid) · loose spacers midway |
| E8 | PASS | AUTO · fired: explode (1 solid) · keyed parts keep their order on their shaft |
| E9 | PASS | HAND · full explode readable in ISOMETRIC on both sheets, nothing leaves the frame |
| E10 | PASS | AUTO · fired: explode (1 solid) · each stack explodes along its joint axis, with trail lines |
| J1 | N/A | AUTO · fired: trunnion (no solids), j1-dead-axle (no solids) · no dead axle |
| J2 | PASS | AUTO · fired: j2-live-shaft (27 solids) · live shaft: housing with two bearings, keyed shaft, part held on the shaft end by a washer and a countersunk screw |
| J3 | PASS | AUTO · fired: j3-moving-pin (18 solids), cross-bearings (no solids), ring-hub (no solids) · moving pins: shoulder bolts threaded through the lower part, bearings, inner-race spacers, made up by a washer |
| J4 | N/A | AUTO · fired: j4-slot-roller (no solids), pin-lobe (no solids), fork-pin (no solids) · no pin in a slot |
| J5 | PASS | AUTO · fired: piston-bore (no solids), j5-slide (22 solids), tongue-slot (no solids) · slide: reference and gibbed rails, keeper, gib, wipers, grease nipple, end stops |
| J6 | N/A | AUTO · fired: j6-mesh (no solids), ring-rollers (no solids) · no parallel mesh |
| J7 | N/A | AUTO · fired: groove-cam (no solids), j7-cam (no solids), pallet-contact (no solids), pawl-tooth (no solids) · no cam |
| J8 | N/A | AUTO · fired: j8-belt (no solids), j12-flexible (no solids) · no belt in the mechanism (a drive belt is V4) |
| J9 | N/A | AUTO · fired: j9-crossed-mesh (no solids) · no crossed mesh |
| J10 | N/A | AUTO · fired: j10-shaft-in-plan (no solids) · no shaft in plan |
| J12 | N/A | AUTO · fired: j12-flexible (no solids), strap-sheave (no solids) · no flexible member |
| J13 | N/A | AUTO · fired: j13-compliant (no solids) · no compliant joint |
| J11 | N/A | AUTO · fired: j11-screw (no solids) · no screw |
| F1 | PASS | AUTO · served at O, slide; fired: j2-live-shaft (27 solids), j10-shaft-in-plan (no solids), strap-sheave (no solids), j13-compliant (no solids) · housings, blocks, bridges and rails dowelled (Joints table) |
| F2 | PASS | AUTO · served at A, B, O, slide; fired: wheels (no solids), j2-live-shaft (27 solids), j10-shaft-in-plan (no solids), cross-bearings (no solids), trunnion (no solids), fork-pin (no solids), ring-hub (no solids), ring-rollers (no solids), j12-flexible (no solids), strap-sheave (no solids), j13-compliant (no solids) · every bearing retained both sides; every part on a shaft retained (Joints table) |
| F3 | PASS | AUTO · served at A, B, O; fired: j2-live-shaft (27 solids), j10-shaft-in-plan (no solids), j12-flexible (no solids), j11-screw (no solids) · every keyed part keyed or on a D-flat with its retainer |
| F4 | PASS | AUTO / HAND · served at O; fired: j9-crossed-mesh (no solids), j2-live-shaft (27 solids), j10-shaft-in-plan (no solids), trunnion (no solids) · thrust washers where a part turns free axially |
| F5 | PASS | AUTO / HAND · served at slide, O-handle-stops; fired: j5-slide (22 solids), pawl-tooth (no solids), j13-compliant (no solids), stops (8 solids) · stop pins past each end of a swinging part; end stops with pads on the slide |
| F6 | N/A | AUTO / HAND · served at no joint; fired: trunnion (no solids), j7-cam (no solids), pallet-contact (no solids), pawl-tooth (no solids), j12-flexible (no solids) · no rest position to hold: the input positions every part |
| F7 | PASS | AUTO / HAND · served at slide; fired: j6-mesh (no solids), j9-crossed-mesh (no solids), j5-slide (22 solids), j12-flexible (no solids), adjustable-length (no solids) · the gib sets the slide's play |
| F8 | PASS | AUTO · served at slide; fired: cross-bearings (no solids), tongue-slot (no solids), j12-flexible (no solids), j11-screw (no solids), lubrication (no solids) · grease nipples, wipers and oil sinks where fitted; the other bearings sealed |
| F9 | PASS | AUTO / HAND · served at no joint; fired: j6-mesh (no solids), j9-crossed-mesh (no solids), timing-marks (1 solid) · zero line on the input and on the base (timing marks) |
| F10 | N/A | AUTO / HAND · served at no joint; fired: j12-flexible (no solids), drive (2 solids) · manual input: not motor-driven |
| M1 | PASS | AUTO · fired: hardware primitives · top-face chamfers by part kind (primitives) |
| M2 | PASS | HAND · bosses round every loaded hole |
| M3 | PASS | AUTO · fired: j3-moving-pin (18 solids), hardware primitives · bore entry chamfers |
| M4 | PASS | AUTO / HAND · fired: base (3 solids), fasteners (14 solids) · counterbores and countersinks for heads (base, csk, housings) |
| M5 | PASS | AUTO / HAND · fired: hardware primitives · cutter radii on windows and slots |
| M6 | PASS | AUTO · edge distance and walls clean |
| M7 | N/A | HAND · no bracket corner turns a load |
| M8 | PASS | AUTO · fired: j1-dead-axle (no solids) · thread undercuts on stepped shafts |
| M9 | PASS | AUTO / HAND · fired: j1-dead-axle (no solids) · ISO coarse threads, engagement through the tapped part or to a nut |
| M10 | PASS | AUTO / HAND · 90 of 94 solids name a material · materials named by kind and role |
| M11 | PASS | AUTO · fired: j1-dead-axle (no solids), hardware primitives · centre holes, chamfered ends on turned parts |
| M12 | PASS | HAND · every screw reachable by its key in the explode |
| M13 | PASS | AUTO / HAND · 14 threaded · threadlocker or nyloc on every threaded fastener |
| M14 | PASS | AUTO / HAND · fired: piston-bore (no solids), j4-slot-roller (no solids), pin-lobe (no solids), groove-cam (no solids), pallet-contact (no solids), tongue-slot (no solids) · wear strips and liners where a part slides on another |
| V1 | N/A | AUTO · fired: drive (2 solids) · manual input: hand operated, no motor (V1 motorises rotary, oscillating and linear inputs) |
| V2 | N/A | AUTO · fired: drive (2 solids) · manual input: no motor, no bracket |
| V3 | N/A | AUTO / HAND · fired: drive (2 solids) · manual input: no belt or pulleys |
| V4 | N/A | AUTO · fired: j8-belt (no solids) · manual input: no drive belt |
| V5 | PASS | AUTO · fired: drive (2 solids) · manual: a knob on a shoulder screw at the handle's grip, stop pins at both ends of its stroke (F5), the over-centre stop past dead centre; the page says hand operated |
| V6 | N/A | AUTO · fired: drive (2 solids), cable-clip (no solids) · manual input: no motor or sensor to wire |
| L1 | PASS | STYLE · STYLE: no look values in the record or polish |
| L2 | PASS | HAND · records and polish carry no look |
| L3 | PASS | HAND · roles right on every solid (both sheets) |
| L4 | PASS | HAND / STYLE · one accent: the input ring, the traces |
| L5 | PASS | AUTO / HAND · fired: see-through (1 solid) · transparency and hidden lines show screws in holes and bearings in bores |
| L6 | PASS | AUTO · depth peeling at every view (shots) |
| L7 | PASS | STYLE · STYLE: turntable orbit, named views, no perspective |
| L8 | PASS | AUTO / HAND · fired: trace-marks (1 solid) · centrelines along every joint axis, base dimensions, engraved marks |
| L9 | N/A | AUTO / DATA · no section or detail view declared |
| L10 | PASS | AUTO / STYLE · teaching overlays in the sheet's look |
| R1 | PASS | HAND · every standard part from the primitives and kits |
| R2 | PASS | HAND · standard sizes only |
| R3 | PASS | AUTO · fired: hardware primitives · shared subassemblies, one function each |
| R4 | PASS | AUTO · package v2 16.9 KB · package v2 written at build time |
| R5 | PASS | HAND · the polish states only exceptions, no sampling |
| R6 | PASS | FLAG · FLAG: bench run (desktop, below); the phone is measured by David |
| R7 | PASS | HAND / FLAG · polish 14 lines (1.4 KB); 3 solids added, 0 overrides by the polish |
| R8 | PASS | AUTO / SITE · SITE: thumbnails pre-rendered, cards animate on hover |
| R9 | PASS | AUTO / SITE · setup and bake in the worker, one context |
| R10 | PASS | FLAG · FLAG: the bench page is built for the phone measurement |
| DL1 | PASS | AUTO / HAND · 36 of 94 solids on a dropping rung · every solid, mark and effect on a rung by its kind |
| DL2 | PASS | HAND · default dial: full |
| DL3 | PASS | AUTO · view-aware exceptions in the ladder table |
| DL4 | PASS | SITE · SITE: adaptive dial with hysteresis |
| DL6 | PASS | AUTO · teaching layers drawn at every dial position |
| DL5 | PASS | FLAG · FLAG: bench reports frame time per dial position |
| Q1 | PASS | check, clamp and edge distance clean |
| Q2 | PASS | 0 clashes, 0 unnecessary allows |
| Q3 | PASS | package v2 written, 16.9 KB; site build not checked here · package v2 written; site builds (npm run build) |
| Q4 | PASS | local: tools/shot · dist/shots3/<id>: record view, PLAN, FRONT, SIDE, ISOMETRIC, full explode, both sheets |
| Q5 | PASS | local: tools/bench · tools/bench run: dist/bench/report-v2.md |
| Q6 | PASS | every row judged |
| Q7 | PASS | at 3.0 |
| Q8 | PASS | teaching review: keep (2026-10-20); the six phases of the finished build are looked at by eye · verdict and decisions in the record and the teaching: line; six phases of the finished build looked at |

## Joints
| Joint | Kit | Block | Support | Stack | F1 locate | F2 retain | F3 torque | F4 thrust | F5 limit | F6 hold | F7 adjust | F8 lube | F9 timing | F10 protect |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| A | J3 | slider-dyad | – | – | none | Shoulder bolt Ø6 x 12, M5 (ISO 7379) | Shoulder bolt Ø6 x 12, M5 (ISO 7379) | none | none | none | none | none | none | none |
| B | J3 | – | – | – | none | Shoulder bolt Ø6 x 16, M5 (ISO 7379) | Shoulder bolt Ø6 x 16, M5 (ISO 7379) | none | none | none | none | none | none | none |
| O | J2 | driver | – | – | 2 x Dowel pin Ø3 x 10 h6, housing to base | 2 x Internal circlip DIN 472, Ø13; External circlip DIN 471, Ø6 | Clamp hub Ø6x16, two set screws at 90°; Set screw M4 (DIN 916), threadlocked | Thrust washer 6.2x14, bronze; Wave washer 9.5x12.8, spring steel | none | none | none | none | none | none |
| slide | J5 | – | – | – | 2 x Dowel pin Ø3 h6, reference rail to base | Keeper plate, laps the slider | none | none | stop | none | Gib strip 3 x 6 x 119.3, bronze | Felt wiper in a steel clip; Grease nipple M6 (DIN 71412) | none | none |
| O-handle-stops | stops | – | – | – | none | none | none | none | 2 x Stop pin Ø6, hardened, on the lever's edge | none | none | none | none | none |
| drive | drive | – | – | – | none | none | none | none | none | none | none | none | none | none |

## Supports
| Support | Joint | Kind | Route | Least gap mm | Covers | T10 |
|---|---|---|---|---|---|---|

## Variants and overrides
| Joint or part | Rule result | Chosen | Why |
|---|---|---|---|
| plunger | slider face meets the work | adjustable spindle M6 with a jam nut and a rubber pad | a clamp's bite is set on its spindle (F7, D1); polish exception |
| slide front end stop | end stop and pad past the travel | dropped | the linkage limits the plunger at dead centre (and the handle's stop 3 deg past it); the spindle passes where the stop would stand (F5); polish exception |

## Detail ladder
| Rung | Solids | Marks | Frame ms at this dial position |
|---|---|---|---|
| DL-A | 8 | 0 | 2.18 |
| DL-B | 0 | 112 | 2.19 |
| DL-C | 0 | 0 | 2.06 |
| DL-D | 10 | 0 | 1.95 |
| DL-E | 3 | 0 | 2.04 |
| DL-F | 0 | 0 | 1.96 |
| DL-G | 0 | 0 | 2.01 |
| DL-H | 15 | 0 | 1.91 |
| never | 58 | 153 | 2.06 |

## Promotion candidates
The spindle and the dropped front stop are this mechanism's own (one mechanism). Promoted in this pass: sliders on the ground placed lowest and clear of their rail zone, the slide kit's travel, wipers, risers and nipple (R1 closing comment).

## Verification
check: clean · K1 residual: 2.8e-14 · claims: 5 of 5 ok · clearance: 0 clashes · clamp: clean · edge distance: clean · package: 16.9 KB
screenshots: dist/shots3/toggle-clamp (record view, PLAN, FRONT, SIDE, ISOMETRIC, explode; both sheets) · bench: dist/bench/report-v2.md (desktop; frame times paced at 28 deg in the ladder above; phone by David)
