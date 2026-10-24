# Audit: Differential screw (differential-screw)
standard: 3.0 · date: 2026-10-21 · result: pass · detail: full · pass: build
teaching: tweak · decisions in the record

## Summary
PASS 141 · FAIL 0 · N/A 26 · open: none

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
| P10 | PASS | HAND · the screw's end and the nut traced with a tick per turn (5 mm against 1 mm); the opposite-hand nut path as a ghost (9 mm a turn); screw axis; plots of both advances |
| P11 | PASS | DATA · plain language, mm and degrees |
| P12 | PASS | AUTO / DATA · validate(records, asVersion 3) clean for this record |
| P13 | PASS | HAND · teaching review run against the record in E2 (#204) before the build and again on the finished drawing (teaching: line) |
| K1 | PASS | AUTO · K1 residual 3.3e-14 (tolerance 1e-9) over 360 samples, reference 0.0e+0 |
| K2 | PASS | AUTO · check: finite, continuous, periodic over 360 samples |
| K3 | PASS | AUTO / HAND · 1 block (screw); no numeric fallback · composed from the block library; no fallback, no one-off model |
| K4 | PASS | HAND · the input body is the driver with the accent on its shaft; the output body declared |
| K6 | PASS | DATA · Tr24x5 in the fixed nut, Tr20x4 to the moving nut: the screw advances 5 mm a turn and the nut 5 - 4 = 1 mm (the record's 5:1, as 1.0/0.8) |
| K7 | PASS | DATA · drivers knob (oscillating) · input kind declared with its driven joint |
| K8 | PASS | AUTO / DATA · every joint declared with type, bodies, origin and axis; nothing inferred |
| K9 | PASS | DATA · one oscillating driver, 10 turns out and back; the hand switch is a design choice shown as a ghost (the threads are built right hand) |
| K10 | PASS | AUTO / DATA · one closure, no branch to choose; design choices declared |
| K11 | PASS | AUTO · mobility counted -3, dof 1 |
| K12 | PASS | DATA · every traced, overlaid and claimed point and quantity is named in kin |
| T1 | PASS | HAND · mechanics first, no use context in the teaching strings; the principle reads at the default view |
| T2 | PASS | HAND · review before the build (E2) and again on the six phases of the finished build; decisions in the record |
| T3 | PASS | DATA · principle parts declared; drawn whole, in depth order |
| T4 | PASS | DATA · fired: trace-marks (1 solid) · the screw's end and the nut traced, a tick per turn on each: 5 mm and 1 mm between ticks; the opposite-hand nut path as a ghost |
| T5 | PASS | DATA · the screw axis |
| T6 | PASS | HAND / DATA · 5 and 4 mm pitches at true size: 50 mm of screw travel and 10 mm of nut travel over 10 turns |
| T7 | PASS | DATA · DIMETRIC: both nuts, both threads, the knob and the rail read at once |
| T8 | PASS | DATA · section A-A on the screw axis through both nuts: the two pitches engaged |
| T9 | PASS | AUTO / DATA · claim table: 2 ok, 0 off, 0 uncheckable of 2 |
| T10 | PASS | AUTO · 8 solids drawn see-through: nut-rail, nut-stop0, nut-bump0, nut-stop1, nut-bump1, nut-post1, nut-psc1, nut-psc1-sh · the rail, its posts and stops drawn see-through where they lie over the nut |
| T11 | PASS | AUTO · 0 supports routed, 0 moved off a sweep · the rail posts past the fork's travel; the fixed nut's pedestal clear of the screw's sweep |
| T12 | PASS | HAND · 12 support solids; dropped by the polish: none |
| T13 | N/A | DATA · nothing goes by in a blink |
| T14 | PASS | HAND / DATA · the knob's turn is the one control; the hand switch would change the built thread, so it is a ghost path, not a control (the pilots' rule for design choices that change the build) |
| T15 | PASS | HAND · labels state the mechanism, never its use |
| T16 | N/A | HAND / STYLE · no two parts of one role to tell apart |
| T17 | PASS | AUTO · depth peeling, no depth bias (renderer test) |
| D1 | PASS | HAND · screw: turned core with two Tr threads swept on their helices and a plain shank between; knurled knob; carriage, flanged nuts, fork |
| D2 | PASS | HAND · material where the load runs, bosses round every pin |
| D3 | PASS | STYLE · STYLE: roles by pattern and tone (both sheets) |
| D4 | PASS | AUTO · fired: base (3 solids), feet (4 solids) · base corners and feet concentric (base, feet rules) |
| D5 | PASS | AUTO / HAND · one nut pedestal, two rail posts |
| D6 | PASS | HAND / STYLE · hardware quieter than the parts, still readable (both sheets) |
| D8 | PASS | AUTO / HAND · every solid a profile, an operation and a frame; built by Manifold; no layers, dz or twin |
| D9 | N/A | AUTO / HAND · no member changes shape |
| D10 | PASS | AUTO · profiles shipped for plain extrusions, revolutions and sweeps, meshes only for booleans (package v2) |
| D11 | PASS | AUTO · SOLID: 0 of 67 solids unsound |
| D7 | PASS | HAND · screw and carriage plain; richness in the nuts, the guide and the knob |
| A1 | PASS | AUTO · fixed-thread J11, moving-thread J11, guide J11 · every joint read from the record and built by its kit |
| A2 | PASS | AUTO · fixed-thread J11, moving-thread J11, guide J11 · the screw in its fixed nut (J11) and to the moving nut (J11); the guide by the screw kit |
| A3 | PASS | AUTO · fired: classify (3 solids), axial stack builder · bores from the catalogue; bearings where a boss fits them |
| A4 | PASS | AUTO · fired: j1-dead-axle (no solids), axial stack builder · stepped shafts with shoulders, grooves, flats and chamfered ends (H.shaft) |
| A5 | PASS | AUTO · fired: j2-live-shaft (no solids), j10-shaft-in-plan (no solids), axial stack builder · the knob taper-pinned to the screw's end |
| A6 | N/A | AUTO · fired: j5-slide (no solids), j13-compliant (no solids), standoffs (no solids) · no plain slide and no floating plate |
| A7 | PASS | AUTO · fired: base (3 solids), feet (4 solids) · base 8 mm under the lowest part, counterbored corner holes, feet, engraved scale and paths, shaft clearance holes |
| A8 | PASS | AUTO · fired: fasteners (4 solids) · stage 3 fasteners: shanks, clearance and tapped holes |
| A9 | PASS | AUTO / HAND · fired: placement solver · the screw carried by the fixed nut and the moving nut on its guided carriage, far apart |
| A10 | PASS | HAND · fired: placement (6 solids), placement solver · screw and nuts on one axis; nothing stacked to clear |
| A11 | PASS | AUTO / HAND · fired: j12-flexible (no solids), strap-sheave (no solids), j1-dead-axle (no solids) · load paths closed: every joint note says where its load goes to ground |
| A12 | PASS | AUTO · clamp check clean |
| A13 | PASS | AUTO / HAND · 67 solids, 39 unnamed (further items of a listed set) · named hardware with catalogue sizes and materials |
| A14 | PASS | AUTO / HAND · fired: support router · supports routed against the sweeps (least gap 1.5 mm); details checked by A15 |
| A15 | PASS | AUTO · clearance in 3D over 72 phases: 0 clashes; hand allow: 0 named, 0 unnecessary |
| A16 | PASS | HAND · 4 joint notes; no note: none; no badge: none · a note per joint with its badge; build rules: the screw advances through the fixed nut, hand turned at a knob; the moving nut flanged to its carriage; anti-rotation by a fork on a rail |
| A17 | PASS | HAND · assembles in the explode order; every screw reachable; pressed bearings pullable through their bores |
| A18 | PASS | AUTO · placement: 2 slabs in the tallest stack (225.0 mm), 0 clevises; stack per joint in the Joints table · screw and nuts stand on their axis where the joints put them; no slabs to place |
| A19 | PASS | AUTO · 0 supports routed (0 moved), least gap - mm; still covering a principle part, drawn see-through: none · no stack support routed: the fixed nut's pedestal and the rail posts stand clear of every sweep (A15) |
| A20 | PASS | AUTO · support per joint: none · no revolute stack: the screw is held by its nuts |
| A21 | PASS | AUTO · kit per joint: fixed-thread J11, moving-thread J11, guide J11, drive drive |
| A22 | PASS | AUTO · fired: stops (no solids), adjustable-length (no solids), cable-clip (no solids) · end stops on the rail |
| E1 | PASS | AUTO · every solid has one explode level; levels -5.5 to 16 · one level per solid, nothing stretches |
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
| J10 | N/A | AUTO · fired: j10-shaft-in-plan (no solids), j11-screw (59 solids) · no shaft in plan |
| J12 | N/A | AUTO · fired: j12-flexible (no solids), strap-sheave (no solids) · no flexible member |
| J13 | N/A | AUTO · fired: j13-compliant (no solids) · no compliant joint |
| J11 | PASS | AUTO · fired: j11-screw (59 solids) · two threads swept on their helices at 5 and 4 mm leads; a flanged bronze nut fixed in a pedestal and one screwed to the carriage, each with its ridge in the groove, felt wipers and a nipple; anti-rotation by the flag's fork on a rail |
| F1 | PASS | AUTO · served at fixed-thread, guide; fired: j2-live-shaft (no solids), j10-shaft-in-plan (no solids), strap-sheave (no solids), j13-compliant (no solids) · nut pedestal and rail posts dowelled and screwed (Joints table) |
| F2 | PASS | AUTO · served at no joint; fired: j2-live-shaft (no solids), j10-shaft-in-plan (no solids), cross-bearings (no solids), trunnion (no solids), fork-pin (no solids), ring-hub (no solids), ring-rollers (no solids), j12-flexible (no solids), strap-sheave (no solids), j11-screw (59 solids), j13-compliant (no solids) · both bronze nuts held by their flange screws; the knob by a taper pin |
| F3 | PASS | AUTO · served at fixed-thread, moving-thread, guide; fired: j2-live-shaft (no solids), j10-shaft-in-plan (no solids), j12-flexible (no solids), j11-screw (59 solids) · the moving nut kept from turning by its fork on the rail; the knob pinned |
| F4 | PASS | AUTO / HAND · served at no joint; fired: j9-crossed-mesh (no solids), j2-live-shaft (no solids), j10-shaft-in-plan (no solids), trunnion (no solids), j11-screw (59 solids) · the screw's thrust carried by the fixed nut's flanks into its pedestal |
| F5 | PASS | AUTO / HAND · served at guide; fired: j5-slide (no solids), pawl-tooth (no solids), j11-screw (59 solids), j13-compliant (no solids), stops (no solids) · an end stop with a neoprene pad on the rail past each end of the nut's travel |
| F6 | N/A | AUTO / HAND · served at no joint; fired: trunnion (no solids), j7-cam (no solids), pallet-contact (no solids), pawl-tooth (no solids), j12-flexible (no solids) · no rest position to hold: the drive positions every part |
| F7 | N/A | AUTO / HAND · served at no joint; fired: j6-mesh (no solids), friction-contact (no solids), j9-crossed-mesh (no solids), j12-flexible (no solids), j12-cvt (no solids), j5-slide (no solids), j12-other (no solids), adjustable-length (no solids) · nothing to adjust |
| F8 | PASS | AUTO · served at fixed-thread, moving-thread; fired: cross-bearings (no solids), tongue-slot (no solids), j12-flexible (no solids), j11-screw (59 solids), lubrication (no solids) · felt wipers at both ends of each nut, grease nipples on the pedestal and the carriage |
| F9 | N/A | AUTO / HAND · served at no joint; fired: j6-mesh (no solids), j9-crossed-mesh (no solids), timing-marks (no solids) · no phase to keep between parts |
| F10 | N/A | AUTO / HAND · served at no joint; fired: j12-flexible (no solids), drive (no solids) · hand turned at the knob: no motor to protect or sense |
| M1 | PASS | AUTO · fired: hardware primitives · top-face chamfers by part kind (primitives) |
| M2 | PASS | HAND · bosses round every loaded hole; the fork carries pads |
| M3 | PASS | AUTO · fired: j3-moving-pin (no solids), hardware primitives · bore entry chamfers |
| M4 | PASS | AUTO / HAND · fired: base (3 solids), fasteners (4 solids) · counterbores and countersinks for heads (base, csk, housings) |
| M5 | PASS | AUTO / HAND · fired: hardware primitives · cutter radii on windows and slots |
| M6 | PASS | AUTO · edge distance and walls clean |
| M7 | N/A | HAND · no bracket corner turns a load |
| M8 | PASS | AUTO · fired: j1-dead-axle (no solids) · thread undercuts on stepped shafts |
| M9 | PASS | AUTO / HAND · fired: j1-dead-axle (no solids) · ISO coarse threads, engagement through the tapped part or to a nut |
| M10 | PASS | AUTO / HAND · 65 of 67 solids name a material · materials named by kind and role |
| M11 | PASS | AUTO · fired: j1-dead-axle (no solids), hardware primitives · centre holes, chamfered ends on turned parts |
| M12 | PASS | HAND · every screw reachable by its key in the explode |
| M13 | PASS | AUTO / HAND · 14 threaded · threadlocker or nyloc on every threaded fastener |
| M14 | PASS | AUTO / HAND · fired: piston-bore (no solids), j4-slot-roller (no solids), pin-lobe (no solids), groove-cam (no solids), pallet-contact (no solids), tongue-slot (no solids) · bronze pads in the fork's jaws are the replaceable wear parts on the rail |
| V1 | N/A | AUTO · fired: drive (no solids) · a manual input (V5's hand stroke): the screw advances 50 mm through its fixed nut, so it is turned by hand at the knurled knob on its end; no motor |
| V2 | N/A | AUTO · fired: drive (no solids) · no motor |
| V3 | N/A | AUTO / HAND · fired: drive (no solids) · no belt |
| V4 | N/A | AUTO · fired: j8-belt (no solids) · no drive belt |
| V5 | PASS | AUTO · fired: drive (no solids) · hand drive: the screw kit's knurled knob on the screw's free end with an index line, the travel ended by the rail's stops; the cycle works the hand stroke |
| V6 | N/A | AUTO · fired: drive (no solids), cable-clip (no solids) · no motor, no sensor |
| L1 | PASS | STYLE · STYLE: no look values in the record or polish |
| L2 | PASS | HAND · records and polish carry no look |
| L3 | PASS | HAND · roles right on every solid (both sheets) |
| L4 | PASS | HAND / STYLE · one accent: the input ring, the traces |
| L5 | PASS | AUTO / HAND · fired: see-through (8 solids) · transparency and hidden lines show screws in holes and bearings in bores |
| L6 | PASS | AUTO · depth peeling at every view (shots) |
| L7 | PASS | STYLE · STYLE: turntable orbit, named views, no perspective |
| L8 | PASS | AUTO / HAND · fired: trace-marks (1 solid) · centrelines along every joint axis, base dimensions, engraved marks |
| L9 | PASS | AUTO / DATA · section A-A drawn by the renderer: cut faces hatched through both nuts |
| L10 | PASS | AUTO / STYLE · teaching overlays in the sheet's look |
| R1 | PASS | HAND · every standard part from the primitives and kits |
| R2 | PASS | HAND · standard sizes only |
| R3 | PASS | AUTO · fired: hardware primitives · shared subassemblies, one function each |
| R4 | PASS | AUTO · package v2 17.9 KB · package v2 written at build time |
| R5 | PASS | HAND · the polish states only exceptions, no sampling |
| R6 | PASS | FLAG · FLAG: bench run (desktop): setup 24.9 ms over the 20 ms target (two helices tessellated in the browser); the phone is measured by David |
| R7 | PASS | HAND / FLAG · polish none; 0 solids added, 0 overrides by the polish |
| R8 | PASS | AUTO / SITE · SITE: thumbnails pre-rendered, cards animate on hover |
| R9 | PASS | AUTO / SITE · setup and bake in the worker, one context |
| R10 | PASS | FLAG · FLAG: the bench page is built for the phone measurement |
| DL1 | PASS | AUTO / HAND · 15 of 67 solids on a dropping rung · every solid, mark and effect on a rung by its kind |
| DL2 | PASS | HAND · default dial: full |
| DL3 | PASS | AUTO · view-aware exceptions in the ladder table |
| DL4 | PASS | SITE · SITE: adaptive dial with hysteresis |
| DL6 | PASS | AUTO · teaching layers drawn at every dial position |
| DL5 | PASS | FLAG · FLAG: bench reports frame time per dial position |
| Q1 | PASS | check, clamp and edge distance clean |
| Q2 | PASS | 0 clashes, 0 unnecessary allows |
| Q3 | PASS | package v2 written, 17.8 KB; site build not checked here · package v2 written; site builds (npm run build) |
| Q4 | PASS | local: tools/shot · dist/shots3/differential-screw: record view, PLAN, FRONT, SIDE, ISOMETRIC, the declared views, full explode, both sheets |
| Q5 | PASS | local: tools/bench · tools/bench run: dist/bench/report-v2.md |
| Q6 | PASS | every row judged |
| Q7 | PASS | at 3.0 |
| Q8 | PASS | teaching review: tweak (2026-10-20); the six phases of the finished build are looked at by eye · verdict and decisions in the record and the teaching: line; six phases of the finished build looked at |

## Joints
| Joint | Kit | Block | Support | Stack | F1 locate | F2 retain | F3 torque | F4 thrust | F5 limit | F6 hold | F7 adjust | F8 lube | F9 timing | F10 protect |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| fixed-thread | J11 | driver | – | – | Dowel pin Ø4 x 12 h6, nut block to base | none | Flanged bronze nut Tr24x5, right hand, fixed; Socket head M3 x 12 (ISO 4762) | none | none | none | none | Felt wiper ring 24 x 30, at each end of the nut; Grease nipple M6 (DIN 71412) | none | none |
| moving-thread | J11 | screw | – | – | none | none | Flanged bronze nut Tr20x4, right hand; Socket head M3 x 12 (ISO 4762) | none | none | none | none | Felt wiper ring 20 x 26, at each end of the nut; Grease nipple M6 (DIN 71412) | none | none |
| guide | J11 | – | – | – | Rail post, screwed and dowelled to the base | none | Flag with a fork, keeps the nut from turning; Bronze pad, bears on the guide rail | none | 2 x End stop on the rail, screwed down | none | none | none | none | none |
| drive | drive | – | – | – | none | none | none | none | none | none | none | none | none | none |

## Supports
| Support | Joint | Kind | Route | Least gap mm | Covers | T10 |
|---|---|---|---|---|---|---|

## Variants and overrides
| Joint or part | Rule result | Chosen | Why |
|---|---|---|---|

## Detail ladder
| Rung | Solids | Marks | Frame ms at this dial position |
|---|---|---|---|
| DL-A | 0 | 0 | 1.32 |
| DL-B | 0 | 192 | 1.35 |
| DL-C | 0 | 0 | 1.36 |
| DL-D | 0 | 0 | 1.37 |
| DL-E | 6 | 0 | 1.44 |
| DL-F | 0 | 0 | 1.38 |
| DL-G | 0 | 0 | 1.38 |
| DL-H | 9 | 0 | 1.37 |
| never | 52 | 64 | 1.33 |

## Promotion candidates
None: the fixed nut and the knob are part of the screw kit (J11).

## Verification
check: clean · K1 residual: 3.3e-14 · claims: 2 of 2 ok · clearance: 0 clashes · clamp: clean · edge distance: clean · package: 17.9 KB
screenshots: dist/shots3/differential-screw (record view, PLAN, FRONT, SIDE, ISOMETRIC, section A-A, explode; both sheets) · bench: dist/bench/report-v2.md (desktop; frame times paced at 28 deg in the ladder above; phone by David)
