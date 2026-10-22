# Audit: Scissor lift (scissor-lift)
standard: 3.0 · date: 2026-10-22 · result: pass · detail: full · pass: build
teaching: tweak · decisions in the record

## Summary
PASS 151 · FAIL 0 · N/A 16 · open: none

## Requirements
| Id | Status | Evidence / action |
|---|---|---|
| S1 | PASS | DATA · the standard carries version 3.0 and its changelog |
| S2 | PASS | HAND · header with standard, date, result, detail, pass and the teaching: line |
| S3 | PASS | AUTO · tools/conformance reads this sheet (engine v3) and runs in npm run check |
| S4 | PASS | SITE · the pass's decisions on #212; plan and status in #202 |
| S5 | PASS | SITE · 3D stamp in the title block (every shot) and on the card and page header (site build) |
| S6 | PASS | AUTO · rebuilt from its record v3 in batch R1 (#212): bound by 3.0 from this pass |
| P1 | PASS | DATA · record v3 complete (kin and teaching blocks); no polish, audit.md present |
| P2 | PASS | DATA · catalogue validator clean |
| P3 | PASS | DATA / SITE · the page reads ratio, axes, character, backdrivable, aka, family, motion, level, dof and the drive from the record |
| P4 | PASS | DATA · tags grouped Function, Property, Application, keywords |
| P5 | PASS | DATA · explanation in four parts and the examples from the record |
| P6 | PASS | DATA · references and media from the record, validated by the catalogue |
| P7 | PASS | HAND / SITE · no prose in a polish; labels come from the record |
| P8 | PASS | SITE · the page has no parts list or joint sections (site) |
| P9 | PASS | AUTO / HAND · every number the explanation states is a claim and agrees (T9) |
| P10 | PASS | HAND · platform point C traced (a vertical line), span w and stage height dimensioned, the platform level line; plots of height and lift ratio |
| P11 | PASS | DATA · plain language, mm and degrees |
| P12 | PASS | AUTO / DATA · validate(records, asVersion 3) clean for this record |
| P13 | PASS | HAND · teaching review run against the record before the build and again on the finished drawing (teaching: line) |
| K1 | PASS | AUTO · K1 residual 5.7e-14 (tolerance 1e-9) over 360 samples, reference 4.0e-14 |
| K2 | PASS | AUTO · check: finite, continuous, periodic over 360 samples |
| K3 | PASS | AUTO / HAND · 10 blocks (dyad, lerp, slider-dyad); no numeric fallback · composed from the block library; no fallback, no one-off model |
| K4 | PASS | HAND · the carriage is the driver (accent), the platform the output |
| K6 | PASS | DATA · bars 90 with middle pins at 45: stage height 2 sqrt(45^2 - (w/2)^2), three stages |
| K7 | PASS | DATA · drivers carriage (linear) · input kind declared with its driven joint |
| K8 | PASS | AUTO / DATA · every joint declared with type, bodies, origin and axis; nothing inferred |
| K9 | PASS | DATA · one linear driver, the carriage 50 to 85 mm, its control the carriage |
| K10 | PASS | AUTO / DATA · branch up declared for each stage, continuous |
| K11 | PASS | AUTO · mobility counted 1, dof 1 |
| K12 | PASS | DATA · every traced, overlaid and claimed point and quantity is named in kin or made by a block |
| T1 | PASS | HAND · mechanics first, no use context in the teaching strings; the principle reads at the default view |
| T2 | PASS | HAND · review before the build and again on the six phases of the finished build; decisions in the record |
| T3 | PASS | DATA · principle parts declared; drawn whole, in depth order |
| T4 | PASS | DATA · fired: trace-marks (1 solid) · C runs straight up and down: the platform stays level |
| T5 | PASS | DATA · span w, stage height h, the platform level line |
| T6 | PASS | HAND / DATA · height 88.7 to 224.5 mm; lift 2.0 to 8.6 mm per mm of carriage |
| T7 | PASS | DATA · PLAN, where the planar linkage reads whole |
| T8 | N/A | DATA · the principle lies in plain view, no section needed |
| T9 | PASS | AUTO / DATA · claim table: 6 ok, 0 off, 0 uncheckable of 6 |
| T10 | PASS | AUTO · 8 solids drawn see-through: R0-bolt-wsh, R0-bolt-head, L0-slv, L0-bb, L0-ecl, L0-axle-s4, L0-axle-s5, L0-bridge · the stack and support over a principle part drawn see-through |
| T11 | PASS | AUTO · 1 support routed, 1 moved off a sweep · the support routed off the principle's sweep |
| T12 | PASS | HAND · 21 support solids; dropped by the polish: none |
| T13 | N/A | DATA · nothing goes by in a blink |
| T14 | PASS | HAND / DATA · the carriage |
| T15 | PASS | HAND · labels state the mechanism, never its use |
| T16 | PASS | HAND / STYLE · the six bars share a role: told apart by their slabs and the hatch per slab, never by hue |
| T17 | PASS | AUTO · depth peeling, no depth bias (renderer test) |
| D1 | PASS | HAND · fired: wheels (no solids) · six equal bars, the platform a slotted link, slide in rails, plain base |
| D2 | PASS | HAND · material round every pin; slim bars |
| D3 | PASS | STYLE · STYLE: roles by pattern and tone (both sheets) |
| D4 | PASS | AUTO · fired: base (3 solids), feet (4 solids) · base corners and feet concentric (base, feet rules) |
| D5 | PASS | AUTO / HAND · one bridge over L0, moved off the sweep, see-through over bar a0: it no longer reads as a scissor bar |
| D6 | PASS | HAND / STYLE · hardware quieter than the parts, still readable (both sheets) |
| D8 | PASS | AUTO / HAND · every solid a profile, an operation and a frame; built by Manifold; no layers, dz or twin |
| D9 | N/A | AUTO / HAND · no member changes shape |
| D10 | PASS | AUTO · profiles shipped for plain extrusions, meshes only for booleans (package v2) |
| D11 | PASS | AUTO · SOLID: 0 of 196 solids unsound |
| D7 | PASS | HAND · links plain; the richness in the stacks |
| A1 | PASS | AUTO · R0 J3, M0 J3, L1 J3, R1 J3, M1 J3, L2 J3, R2 J3, M2 J3, L3 J3, R3 J4, carriage-slide J5, L0 J1, L0-a0-stops stops, drive drive · every joint read from the record and built by its kit |
| A2 | PASS | AUTO · R0 J3, M0 J3, L1 J3, R1 J3, M1 J3, L2 J3, R2 J3, M2 J3, L3 J3, R3 J4, carriage-slide J5, L0 J1, L0-a0-stops stops, drive drive · ground pivots by their kits (live shaft J2, dead axle J1), moving pins J3 (Joints table) |
| A3 | PASS | AUTO · fired: classify (12 solids), axial stack builder · bores from the catalogue; bearings where a boss fits them |
| A4 | PASS | AUTO · fired: j1-dead-axle (27 solids), axial stack builder · stepped shafts with shoulders, grooves, flats and chamfered ends (H.shaft) |
| A5 | PASS | AUTO · fired: j2-live-shaft (no solids), j10-shaft-in-plan (no solids), axial stack builder · keys by shaft size: D-flat to Ø8, feather key above |
| A6 | PASS | AUTO · fired: j5-slide (20 solids), j13-compliant (no solids), standoffs (no solids) · slides on a dowelled reference rail and a gibbed rail under a keeper, risers where the slide stands off the base |
| A7 | PASS | AUTO · fired: base (3 solids), feet (4 solids) · base 8 mm under the lowest part, counterbored corner holes, feet, engraved scale and paths, shaft clearance holes |
| A8 | PASS | AUTO · fired: fasteners (10 solids) · stage 3 fasteners: shanks, clearance and tapped holes |
| A9 | PASS | AUTO / HAND · fired: placement solver · shortest overhang from the placement solver; a pivot passed over is held from above in double shear or on its shaft end |
| A10 | PASS | HAND · fired: placement (16 solids), placement solver · slabs from the placement solver (Joints table) |
| A11 | PASS | AUTO / HAND · fired: j12-flexible (no solids), strap-sheave (no solids), j1-dead-axle (27 solids) · load paths closed: every joint note says where its load goes to ground |
| A12 | PASS | AUTO · clamp check clean |
| A13 | PASS | AUTO / HAND · 196 solids, 101 unnamed (further items of a listed set) · named hardware with catalogue sizes and materials |
| A14 | PASS | AUTO / HAND · fired: support router · supports routed against the sweeps (least gap 1.5 mm); details checked by A15 |
| A15 | PASS | AUTO · clearance in 3D over 72 phases: 0 clashes; hand allow: 0 named, 0 unnecessary |
| A16 | PASS | HAND · 14 joint notes; no note: none; no badge: none · a note and badge per joint; build rules: the far pins by the lerp block, the platform pin in its slot (J4), the carriage on rails |
| A17 | PASS | HAND · assembles in the explode order; every screw reachable; pressed bearings pullable through their bores |
| A18 | PASS | AUTO · placement: 3 slabs in the tallest stack (34.0 mm), 0 clevises; stack per joint in the Joints table · axial positions set by the placement solver |
| A19 | PASS | AUTO · 1 support routed (1 moved), least gap 1.5 mm; still covering a principle part, drawn see-through: L0-bridge · routed, least gap 1.5 mm; see-through where it still covers a principle part |
| A20 | PASS | AUTO · support per joint: L0 bridge · one axial stack builder with its support selector |
| A21 | PASS | AUTO · kit per joint: R0 J3, M0 J3, L1 J3, R1 J3, M1 J3, L2 J3, R2 J3, M2 J3, L3 J3, R3 J4, carriage-slide J5, L0 J1, L0-a0-stops stops, drive drive |
| A22 | PASS | AUTO · fired: stops (no solids), adjustable-length (no solids), cable-clip (5 solids) · promoted fixes fired where they apply (stops and swing scale on swinging parts, cable clip on a drive lead) |
| E1 | PASS | AUTO · every solid has one explode level; levels -3.5 to 5.5 · one level per solid, nothing stretches |
| E2 | PASS | AUTO · fired: explode (1 solid) · heads, shanks, washers and nuts move as one |
| E3 | PASS | AUTO · fired: explode (1 solid) · screws back out along their axes |
| E4 | PASS | HAND · last fitted goes furthest (explode shots, both sheets) |
| E5 | PASS | AUTO · fired: explode (1 solid) · pressed bearings, bushings and clips stay with their parts |
| E6 | PASS | AUTO · fired: explode (1 solid) · bought units whole |
| E7 | PASS | AUTO · fired: explode (1 solid) · loose spacers midway |
| E8 | PASS | AUTO · fired: explode (1 solid) · keyed parts keep their order on their shaft |
| E9 | PASS | HAND · full explode readable in ISOMETRIC on both sheets, nothing leaves the frame |
| E10 | PASS | AUTO · fired: explode (1 solid) · each stack explodes along its joint axis, with trail lines |
| J1 | PASS | AUTO · fired: trunnion (no solids), j1-dead-axle (27 solids) · dead axle: shouldered axle, bearings in the part, spacers, circlip, thrust washer |
| J2 | N/A | AUTO · fired: j2-live-shaft (no solids) · no live shaft |
| J3 | PASS | AUTO · fired: j3-moving-pin (81 solids), cross-bearings (no solids), ring-hub (no solids) · moving pins: shoulder bolts threaded through the lower part, bearings, inner-race spacers, made up by a washer |
| J4 | PASS | AUTO · fired: j4-slot-roller (6 solids), pin-lobe (no solids), fork-pin (no solids) · pin in its slot: track roller on a stud, hardened wear strips, felt oiler |
| J5 | PASS | AUTO · fired: piston-bore (no solids), j5-slide (20 solids), tongue-slot (no solids) · slide: reference and gibbed rails, keeper, gib, wipers, grease nipple, end stops |
| J6 | N/A | AUTO · fired: j6-mesh (no solids), ring-rollers (no solids) · no parallel mesh |
| J7 | N/A | AUTO · fired: groove-cam (no solids), j7-cam (no solids), pallet-contact (no solids), pawl-tooth (no solids) · no cam |
| J8 | N/A | AUTO · fired: j8-belt (no solids), j12-flexible (no solids) · no belt in the mechanism (a drive belt is V4) |
| J9 | N/A | AUTO · fired: j9-crossed-mesh (no solids) · no crossed mesh |
| J10 | N/A | AUTO · fired: j10-shaft-in-plan (no solids) · no shaft in plan |
| J12 | N/A | AUTO · fired: j12-flexible (no solids), strap-sheave (no solids) · no flexible member |
| J13 | N/A | AUTO · fired: j13-compliant (no solids) · no compliant joint |
| J11 | N/A | AUTO · fired: j11-screw (no solids) · no screw |
| F1 | PASS | AUTO · served at carriage-slide, L0; fired: j2-live-shaft (no solids), j10-shaft-in-plan (no solids), strap-sheave (no solids), j13-compliant (no solids) · housings, blocks, bridges and rails dowelled (Joints table) |
| F2 | PASS | AUTO · served at R0, M0, L1, R1, M1, L2, R2, M2, L3, carriage-slide, L0, drive; fired: wheels (no solids), j2-live-shaft (no solids), j10-shaft-in-plan (no solids), cross-bearings (no solids), trunnion (no solids), fork-pin (no solids), ring-hub (no solids), ring-rollers (no solids), j12-flexible (no solids), strap-sheave (no solids), j13-compliant (no solids) · every bearing retained both sides; every part on a shaft retained (Joints table) |
| F3 | PASS | AUTO · served at R0, M0, L1, R1, M1, L2, R2, M2, L3; fired: j2-live-shaft (no solids), j10-shaft-in-plan (no solids), j12-flexible (no solids), j11-screw (no solids) · every keyed part keyed or on a D-flat with its retainer |
| F4 | PASS | AUTO / HAND · served at L0; fired: j9-crossed-mesh (no solids), j2-live-shaft (no solids), j10-shaft-in-plan (no solids), trunnion (no solids) · thrust washers where a part turns free axially |
| F5 | PASS | AUTO / HAND · served at carriage-slide; fired: j5-slide (20 solids), pawl-tooth (no solids), j13-compliant (no solids), stops (no solids) · stop pins past each end of a swinging part; end stops with pads on the slide |
| F6 | N/A | AUTO / HAND · served at no joint; fired: trunnion (no solids), j7-cam (no solids), pallet-contact (no solids), pawl-tooth (no solids), j12-flexible (no solids) · no rest position to hold: the input positions every part |
| F7 | PASS | AUTO / HAND · served at carriage-slide, drive; fired: j6-mesh (no solids), j9-crossed-mesh (no solids), j5-slide (20 solids), j12-flexible (no solids), adjustable-length (no solids) · the drive belt's tensioner (slotted plate under the idler); the gib sets the slide's play |
| F8 | PASS | AUTO · served at R3, carriage-slide; fired: cross-bearings (no solids), tongue-slot (no solids), j12-flexible (no solids), j11-screw (no solids), lubrication (1 solid) · grease nipples, wipers and oil sinks where fitted; the other bearings sealed |
| F9 | N/A | AUTO / HAND · served at no joint; fired: j6-mesh (no solids), j9-crossed-mesh (no solids), timing-marks (no solids) · no input to time: nothing drives a rotary input |
| F10 | PASS | AUTO / HAND · served at drive; fired: j12-flexible (no solids), drive (46 solids) · home flag and fork sensor on the input (drive); pulley flanges on both pulleys |
| M1 | PASS | AUTO · fired: hardware primitives · top-face chamfers by part kind (primitives) |
| M2 | PASS | HAND · bosses round every loaded hole |
| M3 | PASS | AUTO · fired: j3-moving-pin (81 solids), hardware primitives · bore entry chamfers |
| M4 | PASS | AUTO / HAND · fired: base (3 solids), fasteners (10 solids) · counterbores and countersinks for heads (base, csk, housings) |
| M5 | PASS | AUTO / HAND · fired: hardware primitives · cutter radii on windows and slots |
| M6 | PASS | AUTO · edge distance and walls clean |
| M7 | N/A | HAND · no bracket corner turns a load |
| M8 | PASS | AUTO · fired: j1-dead-axle (27 solids) · thread undercuts on stepped shafts |
| M9 | PASS | AUTO / HAND · fired: j1-dead-axle (27 solids) · ISO coarse threads, engagement through the tapped part or to a nut |
| M10 | PASS | AUTO / HAND · 188 of 196 solids name a material · materials named by kind and role |
| M11 | PASS | AUTO · fired: j1-dead-axle (27 solids), hardware primitives · centre holes, chamfered ends on turned parts |
| M12 | PASS | HAND · every screw reachable by its key in the explode |
| M13 | PASS | AUTO / HAND · 26 threaded · threadlocker or nyloc on every threaded fastener |
| M14 | PASS | AUTO / HAND · fired: piston-bore (no solids), j4-slot-roller (6 solids), pin-lobe (no solids), groove-cam (no solids), pallet-contact (no solids), tongue-slot (no solids) · wear strips and liners where a part slides on another |
| V1 | PASS | AUTO · fired: drive (46 solids) · brushless pancake motor Ø50 x 18 under the base; the linear input is motorised through a belt loop and carriage (V5) |
| V2 | PASS | AUTO · fired: drive (46 solids) · one-piece bracket: top flange screwed up into the base from inside, a wall with a full-height belt window, a floor the motor is screwed to; nothing shows on top of the base |
| V3 | PASS | AUTO / HAND · fired: drive (46 solids) · belt, pulleys, bracket and tensioner clear of the feet, the housings and the base hardware; the carriage runs in its slot in the base (A15: 0 clashes over 72 phases) |
| V4 | PASS | AUTO · fired: j8-belt (no solids) · flanged GT2 16T pulleys, the motor pulley set-screwed on the shaft's flat, the idler on a bearing on a slotted tensioner plate (belt tension), the belt clamped between the carriage's jaw and a clamp plate on two screws |
| V5 | PASS | AUTO · fired: drive (46 solids) · linear: a belt loop under the base along the 35 mm stroke, a carriage clamped to its near span and rising through a slot in the base to the slider, the tensioner on the far pulley |
| V6 | PASS | AUTO · fired: drive (46 solids), cable-clip (5 solids) · home flag on the carriage, fork sensor on a post at the end of the stroke, motor and sensor leads to a terminal block, cable clips under the base |
| L1 | PASS | STYLE · STYLE: no look values in the record or polish |
| L2 | PASS | HAND · records and polish carry no look |
| L3 | PASS | HAND · roles right on every solid (both sheets) |
| L4 | PASS | HAND / STYLE · one accent: the input ring, the traces |
| L5 | PASS | AUTO / HAND · fired: see-through (8 solids) · transparency and hidden lines show screws in holes and bearings in bores |
| L6 | PASS | AUTO · depth peeling at every view (shots) |
| L7 | PASS | STYLE · STYLE: turntable orbit, named views, no perspective |
| L8 | PASS | AUTO / HAND · fired: trace-marks (1 solid) · centrelines along every joint axis, base dimensions, engraved marks |
| L9 | N/A | AUTO / DATA · no section or detail view declared |
| L10 | PASS | AUTO / STYLE · teaching overlays in the sheet's look |
| R1 | PASS | HAND · every standard part from the primitives and kits |
| R2 | PASS | HAND · standard sizes only |
| R3 | PASS | AUTO · fired: hardware primitives · shared subassemblies, one function each |
| R4 | PASS | AUTO · package v2 22.0 KB · package v2 written at build time |
| R5 | PASS | HAND · the polish states only exceptions, no sampling |
| R6 | PASS | FLAG · FLAG: bench run (desktop, below); the phone is measured by David |
| R7 | PASS | HAND / FLAG · polish none; 0 solids added, 0 overrides by the polish |
| R8 | PASS | AUTO / SITE · SITE: thumbnails pre-rendered, cards animate on hover |
| R9 | PASS | AUTO / SITE · setup and bake in the worker, one context |
| R10 | PASS | FLAG · FLAG: the bench page is built for the phone measurement |
| DL1 | PASS | AUTO / HAND · 71 of 196 solids on a dropping rung · every solid, mark and effect on a rung by its kind |
| DL2 | PASS | HAND · default dial: full |
| DL3 | PASS | AUTO · view-aware exceptions in the ladder table |
| DL4 | PASS | SITE · SITE: adaptive dial with hysteresis |
| DL6 | PASS | AUTO · teaching layers drawn at every dial position |
| DL5 | PASS | FLAG · FLAG: bench reports frame time per dial position |
| Q1 | PASS | check, clamp and edge distance clean |
| Q2 | PASS | 0 clashes, 0 unnecessary allows |
| Q3 | PASS | package v2 written, 22.0 KB; site build not checked here · package v2 written; site builds (npm run build) |
| Q4 | PASS | local: tools/shot · dist/shots3/<id>: record view, PLAN, FRONT, SIDE, ISOMETRIC, full explode, both sheets |
| Q5 | PASS | local: tools/bench · tools/bench run: dist/bench/report-v2.md |
| Q6 | PASS | every row judged |
| Q7 | PASS | at 3.0 |
| Q8 | PASS | teaching review: tweak (2026-10-20); the six phases of the finished build are looked at by eye · verdict and decisions in the record and the teaching: line; six phases of the finished build looked at |

## Joints
| Joint | Kit | Block | Support | Stack | F1 locate | F2 retain | F3 torque | F4 thrust | F5 limit | F6 hold | F7 adjust | F8 lube | F9 timing | F10 protect |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| R0 | J3 | dyad | – | – | none | Shoulder bolt Ø8 x 16, M6 (ISO 7379) | Shoulder bolt Ø8 x 16, M6 (ISO 7379) | none | none | none | none | none | none | none |
| M0 | J3 | lerp | – | – | none | Shoulder bolt Ø8 x 16, M6 (ISO 7379) | Shoulder bolt Ø8 x 16, M6 (ISO 7379) | none | none | none | none | none | none | none |
| L1 | J3 | dyad | – | – | none | Shoulder bolt Ø8 x 16, M6 (ISO 7379) | Shoulder bolt Ø8 x 16, M6 (ISO 7379) | none | none | none | none | none | none | none |
| R1 | J3 | dyad | – | – | none | Shoulder bolt Ø8 x 16, M6 (ISO 7379) | Shoulder bolt Ø8 x 16, M6 (ISO 7379) | none | none | none | none | none | none | none |
| M1 | J3 | lerp | – | – | none | Shoulder bolt Ø8 x 16, M6 (ISO 7379) | Shoulder bolt Ø8 x 16, M6 (ISO 7379) | none | none | none | none | none | none | none |
| L2 | J3 | dyad | – | – | none | Shoulder bolt Ø8 x 16, M6 (ISO 7379) | Shoulder bolt Ø8 x 16, M6 (ISO 7379) | none | none | none | none | none | none | none |
| R2 | J3 | dyad | – | – | none | Shoulder bolt Ø8 x 16, M6 (ISO 7379) | Shoulder bolt Ø8 x 16, M6 (ISO 7379) | none | none | none | none | none | none | none |
| M2 | J3 | lerp | – | – | none | Shoulder bolt Ø8 x 16, M6 (ISO 7379) | Shoulder bolt Ø8 x 16, M6 (ISO 7379) | none | none | none | none | none | none | none |
| L3 | J3 | slider-dyad | – | – | none | Shoulder bolt Ø8 x 16, M6 (ISO 7379) | Shoulder bolt Ø8 x 16, M6 (ISO 7379) | none | none | none | none | none | none | none |
| R3 | J4 | slider-dyad | – | – | none | none | none | none | none | none | none | Felt oiler, oil-soaked wool felt | none | none |
| carriage-slide | J5 | driver | – | – | 2 x Dowel pin Ø3 h6, reference rail to base | Keeper plate, laps the slider | none | none | 2 x Stop block | none | Gib strip 3 x 6 x 83, bronze | Felt wiper in a steel clip; Grease nipple M6 (DIN 71412) | none | none |
| L0 | J1 | dyad | bridge (moved) | – | Bridge over the pivot, on two spigoted posts; Dead axle Ø8, shouldered, M6 end | External circlip DIN 471, Ø8 | none | Thrust washer 8.2x16, bronze | none | none | none | none | none | none |
| L0-a0-stops | stops | – | – | – | none | none | none | none | none | none | none | none | none | none |
| drive | drive | – | – | – | none | Belt clamp plate, the near span between it and the jaw | none | none | none | none | Belt tensioner plate, slotted, 2 x M4 up into the base | none | none | Home flag, 1 mm steel vane; Fork sensor, slotted optical, 5 mm gap |

## Supports
| Support | Joint | Kind | Route | Least gap mm | Covers | T10 |
|---|---|---|---|---|---|---|
| L0-bridge | L0 | bridge | moved | 1.5 | a0 | see-through |

## Variants and overrides
| Joint or part | Rule result | Chosen | Why |
|---|---|---|---|

## Detail ladder
| Rung | Solids | Marks | Frame ms at this dial position |
|---|---|---|---|
| DL-A | 21 | 0 | 1.34 |
| DL-B | 0 | 322 | 1.38 |
| DL-C | 0 | 0 | 1.37 |
| DL-D | 22 | 0 | 1.32 |
| DL-E | 16 | 1 | 1.39 |
| DL-F | 0 | 0 | 1.33 |
| DL-G | 0 | 0 | 1.33 |
| DL-H | 12 | 0 | 1.38 |
| never | 125 | 220 | 1.4 |

## Promotion candidates
None: this pass needed no hand fix.

## Verification
check: clean · K1 residual: 5.7e-14 · claims: 6 of 6 ok · clearance: 0 clashes · clamp: clean · edge distance: clean · package: 22.0 KB
screenshots: dist/shots3/scissor-lift (record view, PLAN, FRONT, SIDE, ISOMETRIC, explode; both sheets) · bench: dist/bench/report-v2.md (desktop; frame times paced at 28 deg in the ladder above; phone by David)
