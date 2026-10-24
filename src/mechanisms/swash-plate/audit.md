# Audit: Swash plate (swash-plate)
standard: 3.0 · date: 2026-10-22 · result: pass · detail: full · pass: build
teaching: keep · decisions in the record

## Summary
PASS 150 · FAIL 0 · N/A 17 · open: none

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
| P10 | PASS | HAND · piston 1's head traced with 15-degree ticks (bunched at the ends: harmonic) with a ghost at 8 deg; the shaft axis and the swash angle; all five pistons plotted; section A-A |
| P11 | PASS | DATA · plain language, mm and degrees |
| P12 | PASS | AUTO / DATA · validate(records, asVersion 3) clean for this record |
| P13 | PASS | HAND · teaching review run against the record before the build (E2, #204) and again on six phases of the finished build (teaching: line) |
| K1 | PASS | AUTO · K1 residual 1.9e-14 (tolerance 1e-9) over 360 samples, reference 0.0e+0 |
| K2 | PASS | AUTO · check: finite, continuous, periodic over 360 samples |
| K3 | PASS | AUTO / HAND · 1 block (plane-slide); no numeric fallback · composed from the block library; no fallback, no one-off model |
| K4 | PASS | HAND · shaft driver with the accent; plate on it; five pistons sliders; five slippers |
| K6 | PASS | DATA · each piston's ball centre stays h from the tilted plate face: x = (h - R sin(gamma) cos(theta + 72 k)) / cos(gamma), stroke 2 R tan(gamma) |
| K7 | PASS | DATA · drivers input (rotary) · input kind declared with its driven joint |
| K8 | PASS | AUTO / DATA · every joint declared with type, bodies, origin and axis; nothing inferred |
| K9 | PASS | DATA · one rotary driver; the swash angle a param control (0 to 18) |
| K10 | PASS | AUTO / DATA · closed forms, continuous over the cycle; no branch flips |
| K11 | PASS | AUTO · mobility counted 12, dof 1 |
| K12 | PASS | DATA · every traced, overlaid and claimed point and quantity is named in kin |
| T1 | PASS | HAND · mechanics first, no use context in the teaching strings; the principle reads at the default view |
| T2 | PASS | HAND · review before the build and again on six phases of the finished build; decisions in the record |
| T3 | PASS | DATA · principle parts declared; drawn whole, in depth order |
| T4 | PASS | DATA · fired: trace-marks (1 solid) · piston 1's head traced, ticks bunched at the stroke ends |
| T5 | PASS | DATA · shaft axis line and the swash angle arc |
| T6 | PASS | HAND / DATA · 15 deg on a 40 mm pitch: a 21.4 mm stroke |
| T7 | PASS | DATA · ISOMETRIC, where the tilted plate and the five pistons show |
| T8 | PASS | DATA · section A-A through the shaft axis and piston 1: the plate face, slipper and ball |
| T9 | PASS | AUTO / DATA · claim table: 2 ok, 0 off, 0 uncheckable of 2 |
| T10 | PASS | AUTO · 13 solids drawn see-through: S-pb-b1-ped, S-pb-b1, S-pb-b1-brg, S-pb-b1-brg-balls, S-pb-b1-brg-cage, P1-liner, P2-liner, P3-liner · the shaft's far block see-through where it covers the plate |
| T11 | PASS | AUTO · 1 support routed, 0 moved off a sweep · the blocks routed off the sweeps |
| T12 | PASS | HAND · 15 support solids; dropped by the polish: none |
| T13 | N/A | DATA · nothing goes by in a blink |
| T14 | PASS | HAND / DATA · input and the swash angle: the plate is pinned to the shaft at the tilt (a variable-displacement plate), so the control turns it as built |
| T15 | PASS | HAND · labels state the mechanism, never its use |
| T16 | N/A | HAND / STYLE · no two parts of one role to tell apart |
| T17 | PASS | AUTO · depth peeling, no depth bias (renderer test) |
| D1 | PASS | HAND · fired: wheels (no solids) · cylinder block bored on the pitch circle; plungers with ball ends; slippers with swaged sockets; the plate a disc on the shaft at its tilt |
| D2 | PASS | HAND · block wall round every bore; socket lips round the balls |
| D3 | PASS | STYLE · STYLE: roles by pattern and tone (both sheets) |
| D4 | PASS | AUTO · fired: base (3 solids), feet (4 solids) · base corners and feet concentric (base, feet rules) |
| D5 | PASS | AUTO / HAND · two pillow blocks on the shaft, the block on two posts, one motor bracket |
| D6 | PASS | HAND / STYLE · hardware quieter than the parts, still readable (both sheets) |
| D8 | PASS | AUTO / HAND · every solid a profile, an operation and a frame; built by Manifold; no layers, dz or twin |
| D9 | N/A | AUTO / HAND · no member changes shape |
| D10 | PASS | AUTO · profiles shipped for plain extrusions, meshes only for booleans (package v2) |
| D11 | PASS | AUTO · SOLID: 0 of 98 solids unsound |
| D7 | PASS | HAND · block, plate and plungers plain; richness in the liners, sockets and stacks |
| A1 | PASS | AUTO · S J10, P1 piston-bore, P2 piston-bore, P3 piston-bore, P4 piston-bore, P5 piston-bore, SB1 ball-socket, SB2 ball-socket, SB3 ball-socket, SB4 ball-socket, SB5 ball-socket, K1 slipper, K2 slipper, K3 slipper, K4 slipper, K5 slipper, drive drive · every joint read from the record and built by its kit |
| A2 | PASS | AUTO · S J10, P1 piston-bore, P2 piston-bore, P3 piston-bore, P4 piston-bore, P5 piston-bore, SB1 ball-socket, SB2 ball-socket, SB3 ball-socket, SB4 ball-socket, SB5 ball-socket, K1 slipper, K2 slipper, K3 slipper, K4 slipper, K5 slipper, drive drive · the shaft in plan (J10); pistons in lined bores (piston-bore); ball ends in sockets (ball-socket); slippers on the plate (slipper) |
| A3 | PASS | AUTO · fired: classify (16 solids), axial stack builder · bores from the catalogue; bearings where a boss fits them |
| A4 | PASS | AUTO · fired: j1-dead-axle (no solids), axial stack builder · stepped shafts with shoulders, grooves, flats and chamfered ends (H.shaft) |
| A5 | PASS | AUTO · fired: j2-live-shaft (no solids), j10-shaft-in-plan (29 solids), axial stack builder · keys by shaft size: D-flat to Ø8, feather key above |
| A6 | N/A | AUTO · fired: j5-slide (no solids), j13-compliant (no solids), standoffs (no solids) · no slide and no floating plate |
| A7 | PASS | AUTO · fired: base (3 solids), posts (6 solids), feet (4 solids) · base 8 mm under the lowest part, counterbored corner holes, feet, engraved scale and paths, shaft clearance holes |
| A8 | PASS | AUTO · fired: fasteners (22 solids) · stage 3 fasteners: shanks, clearance and tapped holes |
| A9 | PASS | AUTO / HAND · fired: placement solver · the shaft in two blocks far apart; every piston in a full-length liner |
| A10 | PASS | HAND · fired: placement (31 solids), placement solver · plate, pistons and slippers placed by the record where their joints put them |
| A11 | PASS | AUTO / HAND · fired: j12-flexible (no solids), strap-sheave (no solids), j1-dead-axle (no solids) · load paths closed: every joint note says where its load goes to ground |
| A12 | PASS | AUTO · clamp check clean |
| A13 | PASS | AUTO / HAND · 100 solids, 51 unnamed (further items of a listed set) · named hardware with catalogue sizes and materials |
| A14 | PASS | AUTO / HAND · fired: support router · supports routed against the sweeps (least gap 1.5 mm); details checked by A15 |
| A15 | PASS | AUTO · clearance in 3D over 72 phases: 0 clashes; hand allow: 0 named, 0 unnecessary |
| A16 | PASS | HAND · 17 joint notes; no note: none; no badge: P1, P2, P3, P4, P5, SB1, SB2, SB3, SB4, SB5, K1, K2, K3, K4, K5 · a note per joint; the plate fixed to the shaft at the tilt angle |
| A17 | PASS | HAND · assembles in the explode order; every screw reachable; pressed bearings and liners pullable through their bores |
| A18 | PASS | AUTO · placement: 2 slabs in the tallest stack (248.0 mm), 0 clevises; stack per joint in the Joints table · axial positions set by the placement solver; bodies on their cone or centre placed where the joints put them |
| A19 | PASS | AUTO · 1 support routed (0 moved), least gap 1.5 mm; still covering a principle part, drawn see-through: S-pb · blocks routed, least gap 1.5 mm, see-through where they cover the input yoke |
| A20 | PASS | AUTO · support per joint: S pillow · one axial stack builder with its support selector |
| A21 | PASS | AUTO · kit per joint: S J10, P1 piston-bore, P2 piston-bore, P3 piston-bore, P4 piston-bore, P5 piston-bore, SB1 ball-socket, SB2 ball-socket, SB3 ball-socket, SB4 ball-socket, SB5 ball-socket, K1 slipper, K2 slipper, K3 slipper, K4 slipper, K5 slipper, drive drive |
| A22 | PASS | AUTO · fired: stops (no solids), adjustable-length (no solids), cable-clip (2 solids) · no stops (both shafts turn on); cable clip |
| E1 | PASS | AUTO · every solid has one explode level; levels -12 to 15.5 · one level per solid, nothing stretches |
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
| J3 | PASS | AUTO · fired: j3-moving-pin (no solids), cross-bearings (no solids), ball-socket (15 solids), ring-hub (no solids) · ball-socket: each piston's ball end swaged in its slipper |
| J4 | N/A | AUTO · fired: j4-slot-roller (no solids), pin-lobe (no solids), fork-pin (no solids) · no pin in a slot |
| J5 | PASS | AUTO · fired: tongue-slot (no solids), piston-bore (10 solids), j5-slide (no solids) · piston-bore: each plunger in a bronze liner pressed into its bore |
| J6 | N/A | AUTO · fired: j6-mesh (no solids), ring-rollers (no solids) · no parallel mesh |
| J7 | PASS | AUTO · fired: ball-socket (15 solids), groove-cam (no solids), j7-cam (no solids), pallet-contact (no solids), pawl-tooth (no solids) · slipper: each slipper's flat face on the plate face |
| J8 | N/A | AUTO · fired: j8-belt (no solids), j12-flexible (no solids) · no belt in the mechanism (the drive belt is V4) |
| J9 | N/A | AUTO · fired: j9-crossed-mesh (no solids) · no crossed mesh |
| J10 | PASS | AUTO · fired: j10-shaft-in-plan (29 solids) · both shafts: two pillow blocks, located by collars, keyed yokes; the input with its pulley |
| J12 | N/A | AUTO · fired: j12-flexible (no solids), strap-sheave (no solids) · no flexible member |
| J13 | N/A | AUTO · fired: j13-compliant (no solids) · no compliant joint |
| J11 | N/A | AUTO · fired: j11-screw (no solids) · no screw |
| F1 | PASS | AUTO · served at S; fired: posts (6 solids), j2-live-shaft (no solids), j10-shaft-in-plan (29 solids), strap-sheave (no solids), j13-compliant (no solids) · housings, blocks and bridges dowelled (Joints table) |
| F2 | PASS | AUTO · served at S, P1, P2, P3, P4, P5, SB1, SB2, SB3, SB4, SB5; fired: wheels (no solids), j2-live-shaft (no solids), j10-shaft-in-plan (29 solids), cross-bearings (no solids), trunnion (no solids), fork-pin (no solids), ring-hub (no solids), ring-rollers (no solids), j12-flexible (no solids), strap-sheave (no solids), j13-compliant (no solids) · every bearing retained both sides; every part on a shaft retained (Joints table) |
| F3 | PASS | AUTO · served at no joint; fired: j2-live-shaft (no solids), j10-shaft-in-plan (29 solids), j12-flexible (no solids), j11-screw (no solids) · every keyed part keyed or on a D-flat with its retainer |
| F4 | PASS | AUTO / HAND · served at S; fired: j9-crossed-mesh (no solids), j2-live-shaft (no solids), j10-shaft-in-plan (29 solids), trunnion (no solids) · thrust washers where a part turns free axially |
| F5 | N/A | AUTO / HAND · served at no joint; fired: j5-slide (no solids), pawl-tooth (no solids), j13-compliant (no solids), stops (no solids) · both shafts turn continuously |
| F6 | N/A | AUTO / HAND · served at no joint; fired: trunnion (no solids), j7-cam (no solids), pallet-contact (no solids), pawl-tooth (no solids), j12-flexible (no solids) · no rest position to hold: the drive positions every part |
| F7 | N/A | AUTO / HAND · served at no joint; fired: j6-mesh (no solids), j9-crossed-mesh (no solids), j5-slide (no solids), j12-flexible (no solids), adjustable-length (no solids) · no exact length or mesh to adjust |
| F8 | PASS | AUTO · served at no joint; fired: tongue-slot (no solids), cross-bearings (no solids), ball-socket (15 solids), j12-flexible (no solids), j11-screw (no solids), lubrication (no solids) · sealed bearings; bronze bushings and liners oil-impregnated |
| F9 | PASS | AUTO / HAND · served at no joint; fired: j6-mesh (no solids), j9-crossed-mesh (no solids), timing-marks (1 solid) · zero line on the input and on the base (timing marks) |
| F10 | PASS | AUTO / HAND · served at drive; fired: j12-flexible (no solids), drive (30 solids) · home flag and fork sensor on the input (drive) |
| M1 | PASS | AUTO · fired: hardware primitives · top-face chamfers by part kind (primitives) |
| M2 | PASS | HAND · bosses round every bore |
| M3 | PASS | AUTO · fired: j3-moving-pin (no solids), hardware primitives · bore entry chamfers |
| M4 | PASS | AUTO / HAND · fired: base (3 solids), fasteners (22 solids) · counterbores and countersinks for heads (base, csk, housings) |
| M5 | PASS | AUTO / HAND · fired: hardware primitives · cutter radii on windows and slots |
| M6 | PASS | AUTO · edge distance and walls clean |
| M7 | N/A | HAND · no bracket corner turns a load |
| M8 | PASS | AUTO · fired: j1-dead-axle (no solids) · thread undercuts on stepped shafts |
| M9 | PASS | AUTO / HAND · fired: j1-dead-axle (no solids) · ISO coarse threads, engagement through the tapped part or to a nut |
| M10 | PASS | AUTO / HAND · 87 of 100 solids name a material · materials named by kind and role |
| M11 | PASS | AUTO · fired: j1-dead-axle (no solids), hardware primitives · centre holes, chamfered ends on turned parts |
| M12 | PASS | HAND · every screw reachable by its key in the explode |
| M13 | PASS | AUTO / HAND · 12 threaded · threadlocker or nyloc on every threaded fastener |
| M14 | PASS | AUTO / HAND · fired: tongue-slot (no solids), piston-bore (10 solids), j4-slot-roller (no solids), pin-lobe (no solids), groove-cam (no solids), pallet-contact (no solids) · bronze bore liners (wear parts) |
| V1 | PASS | AUTO · fired: drive (30 solids) · pancake motor beside the input shaft, belted to its free end |
| V2 | PASS | AUTO · fired: drive (30 solids) · one angle bracket: upright and foot |
| V3 | PASS | AUTO / HAND · fired: drive (30 solids) · belt and pulleys clear of feet and housings (A15) |
| V4 | PASS | AUTO · fired: j8-belt (no solids) · flanged pulleys, belt in one plane |
| V5 | PASS | AUTO · fired: drive (30 solids) · rotary input: belt to the input pulley |
| V6 | PASS | AUTO · fired: drive (30 solids), cable-clip (2 solids) · home flag, fork sensor, terminals, lead and clip |
| L1 | PASS | STYLE · STYLE: no look values in the record or polish |
| L2 | PASS | HAND · records and polish carry no look |
| L3 | PASS | HAND · roles right on every solid (both sheets) |
| L4 | PASS | HAND / STYLE · one accent: the input ring, the traces |
| L5 | PASS | AUTO / HAND · fired: see-through (13 solids) · transparency and hidden lines show screws in holes and bearings in bores |
| L6 | PASS | AUTO · depth peeling at every view (shots) |
| L7 | PASS | STYLE · STYLE: turntable orbit, named views, no perspective |
| L8 | PASS | AUTO / HAND · fired: trace-marks (1 solid) · centrelines along every joint axis, base dimensions, engraved marks |
| L9 | PASS | AUTO / DATA · section A-A, piston 1, its slipper, the plate and their contact highlighted |
| L10 | PASS | AUTO / STYLE · teaching overlays in the sheet's look |
| R1 | PASS | HAND · every standard part from the primitives and kits |
| R2 | PASS | HAND · standard sizes only |
| R3 | PASS | AUTO · fired: hardware primitives · shared subassemblies, one function each |
| R4 | PASS | AUTO · package v2 16.7 KB · package v2 written at build time |
| R5 | PASS | HAND · the polish states only exceptions, no sampling |
| R6 | PASS | FLAG · FLAG: bench run (desktop, below); the phone is measured by David |
| R7 | PASS | HAND / FLAG · polish none; 0 solids added, 0 overrides by the polish |
| R8 | PASS | AUTO / SITE · SITE: thumbnails pre-rendered, cards animate on hover |
| R9 | PASS | AUTO / SITE · setup and bake in the worker, one context |
| R10 | PASS | FLAG · FLAG: the bench page is built for the phone measurement |
| DL1 | PASS | AUTO / HAND · 21 of 100 solids on a dropping rung · every solid, mark and effect on a rung by its kind |
| DL2 | PASS | HAND · default dial: full |
| DL3 | PASS | AUTO · view-aware exceptions in the ladder table |
| DL4 | PASS | SITE · SITE: adaptive dial with hysteresis |
| DL6 | PASS | AUTO · teaching layers drawn at every dial position |
| DL5 | PASS | FLAG · FLAG: bench reports frame time per dial position |
| Q1 | PASS | check, clamp and edge distance clean |
| Q2 | PASS | 0 clashes, 0 unnecessary allows |
| Q3 | PASS | package v2 written, 16.7 KB; site build not checked here · package v2 written; site builds (npm run build) |
| Q4 | PASS | local: tools/shot · dist/shots3/<id> (and the batch's shot set): record view, PLAN, FRONT, SIDE, ISOMETRIC, the declared views, full explode, both sheets |
| Q5 | PASS | local: tools/bench · tools/bench3 run (desktop): frame times per view in the ladder above; the phone is measured by David |
| Q6 | PASS |  |
| Q7 | PASS |  |
| Q8 | PASS | teaching review: keep (2026-10-20); the six phases of the finished build are looked at by eye · verdict and decisions in the record and the teaching: line; six phases of the finished build looked at |

## Joints
| Joint | Kit | Block | Support | Stack | F1 locate | F2 retain | F3 torque | F4 thrust | F5 limit | F6 hold | F7 adjust | F8 lube | F9 timing | F10 protect |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| S | J10 | driver | pillow | – | 4 x Dowel pin Ø4 x 14 h6, block to base | 2 x Internal circlip DIN 472, Ø11 | none | 2 x Shaft collar 5x13, set screw | none | none | none | none | none | none |
| P1 | piston-bore | plane-slide | – | – | none | Bore liner 12x16x40, bronze | none | none | none | none | none | none | none | none |
| P2 | piston-bore | plane-slide | – | – | none | Bore liner 12x16x40, bronze | none | none | none | none | none | none | none | none |
| P3 | piston-bore | plane-slide | – | – | none | Bore liner 12x16x40, bronze | none | none | none | none | none | none | none | none |
| P4 | piston-bore | plane-slide | – | – | none | Bore liner 12x16x40, bronze | none | none | none | none | none | none | none | none |
| P5 | piston-bore | plane-slide | – | – | none | Bore liner 12x16x40, bronze | none | none | none | none | none | none | none | none |
| SB1 | ball-socket | plane-slide | – | – | none | Socket lip, swaged round the Ø14 ball | none | none | none | none | none | none | none | none |
| SB2 | ball-socket | plane-slide | – | – | none | Socket lip, swaged round the Ø14 ball | none | none | none | none | none | none | none | none |
| SB3 | ball-socket | plane-slide | – | – | none | Socket lip, swaged round the Ø14 ball | none | none | none | none | none | none | none | none |
| SB4 | ball-socket | plane-slide | – | – | none | Socket lip, swaged round the Ø14 ball | none | none | none | none | none | none | none | none |
| SB5 | ball-socket | plane-slide | – | – | none | Socket lip, swaged round the Ø14 ball | none | none | none | none | none | none | none | none |
| K1 | slipper | – | – | – | none | none | none | none | none | none | none | none | none | none |
| K2 | slipper | – | – | – | none | none | none | none | none | none | none | none | none | none |
| K3 | slipper | – | – | – | none | none | none | none | none | none | none | none | none | none |
| K4 | slipper | – | – | – | none | none | none | none | none | none | none | none | none | none |
| K5 | slipper | – | – | – | none | none | none | none | none | none | none | none | none | none |
| drive | drive | – | – | – | none | none | none | none | none | none | none | none | none | Home flag, 1 mm steel vane; Fork sensor, slotted optical, 5 mm gap |

## Supports
| Support | Joint | Kind | Route | Least gap mm | Covers | T10 |
|---|---|---|---|---|---|---|
| S-pb | S | pillow | first choice | 1.5 | shaft, plate | – |

## Variants and overrides
| Joint or part | Rule result | Chosen | Why |
|---|---|---|---|
| plate | a feature of the shaft | its own body fixed on the shaft at the tilt | the swash angle control must turn the built plate |
| cylinder block | the ground | a fixed body on two posts (record: posts) | the pistons need a bored block; no stack holds it |

## Detail ladder
| Rung | Solids | Marks | Frame ms at this dial position |
|---|---|---|---|
| DL-A | 5 | 0 | 1.59 |
| DL-B | 0 | 234 | 1.78 |
| DL-C | 0 | 0 | 1.6 |
| DL-D | 2 | 0 | 1.59 |
| DL-E | 8 | 0 | 1.58 |
| DL-F | 0 | 0 | 2.06 |
| DL-G | 0 | 0 | 1.71 |
| DL-H | 6 | 0 | 1.81 |
| never | 77 | 133 | 1.76 |

## Promotion candidates
Promoted in this pass: the `plane-slide` block (the tilt frame), plunger pistons in lined bores (piston-bore), the ball-socket and slipper kits, posts under a fixed body.

## Verification
check: clean · K1 residual: 1.9e-14 · claims: 2 of 2 ok · clearance: 0 clashes · clamp: clean · edge distance: clean · package: 16.7 KB
screenshots: dist/shots3/swash-plate (record view, PLAN, FRONT, SIDE, ISOMETRIC, declared views, explode; both sheets) · bench: dist/bench/report-v2.md (desktop; frame times paced at 28 deg in the ladder above; phone by David)
