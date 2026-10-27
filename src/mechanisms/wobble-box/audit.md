# Audit: Wobble box (wobble-box)
standard: 3.11 · date: 2026-10-27 · result: pass · detail: full · pass: build
teaching: keep · decisions in the record

## Summary
PASS 147 · FAIL 0 · N/A 20 · open: none

## Requirements
| Id | Status | Evidence / action |
|---|---|---|
| S1 | PASS | DATA · the standard carries its version header and changelog (3.11) |
| S2 | PASS | HAND · header with standard, date, result, detail, pass and the teaching: line |
| S3 | PASS | AUTO · filled by the generator: the pipeline holds it for every built mechanism |
| S4 | PASS | SITE · the pass issue #253 holds only this mechanism's decisions; plan and status in #252 |
| S5 | PASS | SITE · no engine mark on the sheet or the card (shots) |
| S6 | PASS | AUTO · filled by the generator: the pipeline holds it for every built mechanism |
| P1 | PASS | DATA · record v3 complete (kin and teaching blocks); no polish, audit.md present |
| P2 | PASS | DATA · catalogue validator clean: family Spatial linkage, Rotary to Oscillating, Perpendicular intersecting |
| P3 | PASS | DATA / SITE · the page reads ratio, axes, character, backdrivable, aka, family, motion, level, dof and the drive from the record |
| P4 | PASS | DATA · tags grouped Function, Property, Application, keywords |
| P5 | PASS | DATA · explanation in four parts; two real-world uses (header knife drives, sickle bar mowers) |
| P6 | PASS | DATA · Wikipedia (spherical four-bar), Cornell Reuleaux C3 and three patents; two videos of the real thing, a photo page, an animation; one real_world video; every link found and confirmed this session |
| P7 | PASS | HAND / SITE · no polish; labels come from the record |
| P8 | PASS | SITE · the page has no parts list or joint sections (site) |
| P9 | PASS | AUTO / HAND · every number of the explanation is a claim and agrees: ±α (±20°), 41.0 mm stroke, tan α = 0.36 at mid-swing |
| P10 | PASS | HAND · arm tip traced with 15-degree ticks, a rim point of the ring traced (the nod), the four axes as centrelines, the common centre, the journal angle arc and the stroke dimension (two labels only, owner's review); swing and speed ratio plotted |
| P11 | PASS | DATA · plain language, mm and degrees, no em dashes |
| P12 | PASS | AUTO / DATA · validate clean; every point, control and claim maps to kin |
| P13 | PASS | HAND · teaching review run on the record before the build and again on the finished drawing (teaching: line) |
| K1 | PASS | AUTO · K1 residual 1.4e-14 (tolerance 1e-9) over 360 samples, reference 0.0e+0 |
| K2 | PASS | AUTO · check: finite, continuous, periodic over 360 samples |
| K3 | PASS | AUTO / HAND · 1 block (spherical-four-bar); no numeric fallback · composed from the new spherical-four-bar block (closed form, src/kin/steps/spherical.ts); no numeric fallback |
| K4 | PASS | HAND · the wobble hub (input) carries the accent; ring link, yoke and arm outputs |
| K6 | PASS | DATA · psi = atan(tan(alpha) sin(theta)) matched to 2e-14 at 5, 15 and 25 degrees (tests/kin/spherical.test.ts); alpha 20 degrees; stroke 2 L sin(alpha) = 41.0 mm |
| K7 | PASS | DATA · drivers input (rotary) · drivers input (rotary) on S1 |
| K8 | PASS | AUTO / DATA · every joint declared with type, bodies, origin and axis; the journal and trunnion axes as expressions of alpha |
| K9 | PASS | DATA · one rotary driver; the journal angle is machined on the hub (a record parameter, 20 degrees, not a control: owner's review) |
| K10 | PASS | AUTO / DATA · one closure: the root through the reference pose, followed by the branch tracker; no toggle over the cycle (crank-rocker on the sphere) |
| K11 | PASS | AUTO · mobility counted -1, dof 1 |
| K12 | PASS | DATA · every traced, overlaid and claimed point and quantity is named in kin |
| T1 | PASS | HAND · mechanics first: the four axes meeting, the inclined journal in the ring and the rocking arm read at the default view; no use context in the drawing |
| T2 | PASS | HAND · review before the build and again on the finished build's phases (record, PLAN, SIDE, ISOMETRIC, explode); decisions in the record |
| T3 | PASS | DATA · principle: the input hub with its journal, ring, yoke, arm, the centre and the arm tip |
| T4 | PASS | DATA · fired: trace-marks (1 solid) · arm tip traced with equal-time ticks (bunched at the stroke ends) and the ring's rim point (its nod) |
| T5 | PASS | DATA · four axes as unlabelled centrelines, a circle at the common centre (ALL FOUR AXES MEET HERE), the journal angle arc (JOURNAL ANGLE α), the stroke dimension |
| T6 | PASS | HAND / DATA · 20 degrees (was 15, owner's review) gives a 40 degree swing and a 41.0 mm stroke on a 60 mm arm: the nod and the swing read at a glance |
| T7 | PASS | DATA · ISOMETRIC: all four axes and the ring's nod read at once, no support in front of the meeting point (the far input block stands clear at x 48); DIMETRIC likewise; PLAN shows the journal angle true at the start |
| T8 | PASS | DATA · section A-A through the input and journal axes shows the inclined journal, one piece with the hub, on its double-row bearing inside the ring |
| T9 | PASS | AUTO / DATA · claim table: 4 ok, 0 off, 0 uncheckable of 4 |
| T10 | PASS | AUTO · 7 solids drawn see-through: S1-pb-b1-foot, S1-pb-b1, S1-pb-b1-brg, S1-pb-b1-brg-balls, S1-pb-b1-brg-cage, S1-pb-b1-sc1, S1-pb-b1-dw1 · filled by the generator: a rule built solids for it |
| T11 | PASS | AUTO · 2 supports routed, 1 moved off a sweep · filled by the generator: a rule built solids for it |
| T12 | PASS | HAND · 15 support solids; dropped by the polish: none |
| T13 | N/A | DATA · nothing goes by in a blink: a smooth near-sinusoidal swing |
| T14 | PASS | HAND / DATA · the input only: the journal angle is machined on the hub, so it is not a control (owner's review); the record keeps it as a parameter |
| T15 | PASS | HAND · labels state the mechanism, never its use |
| T16 | N/A | HAND / STYLE · no two like parts of one role to tell apart |
| T17 | PASS | AUTO · filled by the generator: the pipeline holds it for every built mechanism |
| D1 | PASS | HAND · fired: wheels (no solids) · ring as one solid, a housing bored for its bearing with two trunnions on boss pads; the hub one solid, a shank faced square to the journal as the bearing's shoulder (turned to a boss behind it, ending 3.8 mm clear of the ring's flank) with the journal machined on it at α; yoke as the universal joint's (hub, bar, arms bored for cups) |
| D2 | PASS | HAND · material round the bearing bore and the trunnion roots; bosses round the cup bores |
| D3 | PASS | STYLE · STYLE: roles by pattern and tone (both sheets) |
| D4 | PASS | AUTO · fired: base (3 solids), feet (4 solids) · filled by the generator: a rule built solids for it |
| D5 | PASS | AUTO / HAND · two pillow blocks per shaft, one motor bracket |
| D6 | PASS | HAND / STYLE · hardware quieter than the parts, still readable (both sheets) |
| D8 | PASS | AUTO / HAND · every solid a profile, an operation and a frame; the hub (shank, journal and collar added, the shaft's bore cut) and the ring (pads and trunnions added) are each one boolean solid (a mesh); no layers |
| D9 | N/A | AUTO / HAND · fired: j12-cvt (no solids) · no member changes shape |
| D10 | PASS | AUTO · filled by the generator: the pipeline holds it for every built mechanism |
| D11 | PASS | AUTO · SOLID: 0 of 116 solids unsound |
| D7 | PASS | HAND · ring, yoke and arm plain; richness in the bearings, circlips, cups and stacks |
| A1 | PASS | AUTO · S1 J10, S2 J10, T cross-pin, J oblique-journal, drive drive · filled by the generator: the pipeline holds it for every built mechanism |
| A2 | PASS | AUTO · S1 J10, S2 J10, T cross-pin, J oblique-journal, drive drive · filled by the generator: the pipeline holds it for every built mechanism |
| A3 | PASS | AUTO · fired: classify (5 solids), axial stack builder · filled by the generator: a rule built solids for it |
| A4 | PASS | AUTO · fired: j1-dead-axle (no solids), axial stack builder · stepped live shafts with collars, keyways and chamfered ends (H.shaft) |
| A5 | PASS | AUTO · fired: j2-live-shaft (no solids), j10-shaft-in-plan (58 solids), axial stack builder · filled by the generator: a rule built solids for it |
| A6 | N/A | AUTO · fired: j5-slide (no solids), j13-compliant (no solids), standoffs (no solids) · no slide and no floating plate |
| A7 | PASS | AUTO · fired: base (3 solids), posts (no solids), feet (4 solids) · filled by the generator: a rule built solids for it |
| A8 | PASS | AUTO · fired: fasteners (32 solids) · filled by the generator: a rule built solids for it |
| A9 | PASS | AUTO / HAND · fired: placement solver · the input straddle mounted, a pillow block each side of the wobble hub; the output's two blocks far apart behind the yoke and arm (overhung like the universal joint's yoke); each trunnion in its own needle cup across the ring (double support) |
| A10 | PASS | HAND · fired: placement (18 solids), placement solver · the ring and yoke stand where the joints put them on the centre, the journal on the hub; the arm placed on the output shaft clear of the yoke's hub |
| A11 | PASS | AUTO / HAND · fired: j12-flexible (no solids), strap-sheave (no solids), j1-dead-axle (no solids) · trunnion load: cups, yoke, output shaft, its pillow blocks, base; journal load: ring, bearing, journal, hub, input shaft, its pillow blocks, base (joint notes) |
| A12 | PASS | AUTO · clamp check clean |
| A13 | PASS | AUTO / HAND · 124 solids, 76 unnamed (further items of a listed set) · named hardware with catalogue sizes: double-row angular-contact 3804-2RS (20x32x10) on the journal, 6801-2RS and 6800-2RS in the blocks, needle cups Ø14, DIN 471 and 472 circlips, M5 and M4 screws |
| A14 | PASS | AUTO / HAND · fired: support router · supports routed against the sweeps (least gap 1.5 mm); details checked by A15 |
| A15 | PASS | AUTO · clearance in 3D over 72 phases: 0 clashes; hand allow: 1 named, 0 unnecessary |
| A16 | PASS | HAND · 5 joint notes; no note: none; no badge: none · a note and a badge per joint; build rules: the axes meet at one centre, the journal is machined on the keyed hub, the ring's double-row bearing takes the trunnion loads, the arm keyed on the output shaft |
| A17 | PASS | HAND · assembles in the explode order: the bearing into the ring and its circlips, the spacer onto the journal, the ring onto it and the journal's circlip, the hub onto the shaft, the cups over the trunnions; every screw reachable |
| A18 | PASS | AUTO · placement: 2 slabs in the tallest stack (80.0 mm), 0 clevises; stack per joint in the Joints table · filled by the generator: the pipeline holds it for every built mechanism |
| A19 | PASS | AUTO · 2 supports routed (2 moved), least gap 1.5 mm; still covering a principle part, drawn see-through: S1-pb, S2-pb · both pairs of blocks routed off the sweeps; the input's far block drawn see-through where it covers the ring |
| A20 | PASS | AUTO · support per joint: S1 pillow, S2 pillow · pillow blocks chosen for both shafts in plan |
| A21 | PASS | AUTO · kit per joint: S1 J10, S2 J10, T cross-pin, drive drive |
| A22 | PASS | AUTO · fired: stops (no solids), adjustable-length (no solids), cable-clip (2 solids) · filled by the generator: a rule built solids for it |
| E1 | PASS | AUTO · every solid has one explode level; levels 0 to 22.91 · filled by the generator: the pipeline holds it for every built mechanism |
| E2 | PASS | AUTO · fired: explode (1 solid) · filled by the generator: a rule built solids for it |
| E3 | PASS | AUTO · fired: explode (1 solid) · filled by the generator: a rule built solids for it |
| E4 | PASS | HAND · last fitted goes furthest (explode shots, both sheets) |
| E5 | PASS | AUTO · fired: explode (1 solid) · filled by the generator: a rule built solids for it |
| E6 | PASS | AUTO · fired: explode (1 solid) · filled by the generator: a rule built solids for it |
| E7 | PASS | AUTO · fired: explode (1 solid) · filled by the generator: a rule built solids for it |
| E8 | PASS | AUTO · fired: explode (1 solid) · filled by the generator: a rule built solids for it |
| E9 | PASS | HAND · full explode readable in the default view on both sheets, nothing leaves the frame |
| E10 | PASS | AUTO · fired: explode (1 solid) · filled by the generator: a rule built solids for it |
| J1 | N/A | AUTO · fired: trunnion (no solids), hub (no solids), j1-dead-axle (no solids) · filled by the generator: no joint of this type |
| J2 | N/A | AUTO · fired: j2-live-shaft (no solids) · filled by the generator: no joint of this type |
| J3 | PASS | AUTO · fired: j3-moving-pin (no solids), cross-bearings (8 solids), oblique-journal (8 solids), eccentric-bearing (no solids), spider-pin (no solids), ball-socket (no solids), ring-hub (no solids), eccentric (no solids) · filled by the generator: a rule built its kit |
| J4 | N/A | AUTO · fired: pin-hole (no solids), j4-slot-roller (no solids), pin-lobe (no solids), fork-pin (no solids), die (no solids) · filled by the generator: no joint of this type |
| J5 | N/A | AUTO · fired: tongue-slot (no solids), integrator-carriage (no solids), piston-bore (no solids), j5-slide (no solids), leg-bore (no solids) · filled by the generator: no joint of this type |
| J6 | N/A | AUTO · fired: j6-mesh (no solids), friction-contact (no solids), ring-carrier (no solids), pin-ring (no solids), ring-rollers (no solids) · filled by the generator: no joint of this type |
| J7 | N/A | AUTO · fired: ball-socket (no solids), groove-cam (no solids), j7-cam (no solids), pallet-contact (no solids), pawl-tooth (no solids) · filled by the generator: no joint of this type |
| J8 | N/A | AUTO · fired: j12-flexible (no solids), j8-belt (no solids) · filled by the generator: no joint of this type |
| J9 | N/A | AUTO · fired: j9-crossed-mesh (no solids) · filled by the generator: no joint of this type |
| J10 | PASS | AUTO · fired: j12-cvt (no solids), j10-shaft-in-plan (58 solids), j11-screw (no solids) · filled by the generator: a rule built its kit |
| J12 | N/A | AUTO · fired: j12-flexible (no solids), j12-cvt (no solids), j12-other (no solids), strap-sheave (no solids) · filled by the generator: no joint of this type |
| J13 | N/A | AUTO · fired: j13-compliant (no solids) · filled by the generator: no joint of this type |
| J11 | N/A | AUTO · fired: j11-screw (no solids) · filled by the generator: no joint of this type |
| F1 | PASS | AUTO · served at S1, S2; fired: posts (no solids), integrator-carriage (no solids), j2-live-shaft (no solids), j10-shaft-in-plan (58 solids), ring-carrier (no solids), pin-ring (no solids), hub (no solids), strap-sheave (no solids), j13-compliant (no solids), covers (no solids) · filled by the generator: a rule built solids for it |
| F2 | PASS | AUTO · served at S1, S2, T, J; fired: wheels (no solids), j12-flexible (no solids), j2-live-shaft (no solids), j10-shaft-in-plan (58 solids), cross-bearings (8 solids), oblique-journal (8 solids), trunnion (no solids), ring-carrier (no solids), eccentric-bearing (no solids), pin-ring (no solids), spider-pin (no solids), fork-pin (no solids), ring-hub (no solids), eccentric (no solids), hub (no solids), leg-bore (no solids), ring-rollers (no solids), strap-sheave (no solids), j11-screw (no solids), j13-compliant (no solids), covers (no solids) · filled by the generator: a rule built solids for it |
| F3 | PASS | AUTO · served at S1, S2; fired: j12-flexible (no solids), j2-live-shaft (no solids), j10-shaft-in-plan (58 solids), j11-screw (no solids) · filled by the generator: a rule built solids for it |
| F4 | PASS | AUTO / HAND · served at S1, S2; fired: j9-crossed-mesh (no solids), j2-live-shaft (no solids), j10-shaft-in-plan (58 solids), trunnion (no solids), spider-pin (no solids), j11-screw (no solids) · shaft collars locate both live shafts in their blocks; the ring's bearings are held both ways by circlips |
| F5 | N/A | AUTO / HAND · served at no joint; fired: integrator-carriage (no solids), j5-slide (no solids), pawl-tooth (no solids), j11-screw (no solids), j13-compliant (no solids), stops (no solids) · the output's swing is bounded by the linkage itself (±α at every input angle), so it cannot over-travel with the drive off |
| F6 | N/A | AUTO / HAND · served at no joint; fired: friction-contact (no solids), j12-flexible (no solids), j12-cvt (no solids), trunnion (no solids), j7-cam (no solids), pallet-contact (no solids), pawl-tooth (no solids) · no rest position to hold: the drive positions every part |
| F7 | N/A | AUTO / HAND · served at no joint; fired: j6-mesh (no solids), friction-contact (no solids), j9-crossed-mesh (no solids), j12-flexible (no solids), j12-cvt (no solids), j5-slide (no solids), j12-other (no solids), adjustable-length (no solids), covers (no solids) · no adjustable length: the axes meet by the turned parts and the located blocks; a shim at the output's located block is an open question for the owner |
| F8 | PASS | AUTO · served at T; fired: tongue-slot (no solids), j12-flexible (no solids), cross-bearings (8 solids), ball-socket (no solids), eccentric (no solids), leg-bore (no solids), j11-screw (no solids), lubrication (no solids) · filled by the generator: a rule built solids for it |
| F9 | PASS | AUTO / HAND · served at no joint; fired: j6-mesh (no solids), j9-crossed-mesh (no solids), timing-marks (1 solid) · zero line on the input and on the base (timing marks) |
| F10 | PASS | AUTO / HAND · served at drive; fired: j12-flexible (no solids), drive (30 solids) · home flag and fork sensor on the input (drive) |
| M1 | PASS | AUTO · fired: hardware primitives · top-face chamfers by part kind (primitives) |
| M2 | PASS | HAND · boss pads round the trunnion roots; material round the yoke's cup bores |
| M3 | PASS | AUTO · fired: j3-moving-pin (no solids), hardware primitives · bore entry chamfers |
| M4 | PASS | AUTO / HAND · fired: base (3 solids), fasteners (32 solids) · counterbores for the block and base heads |
| M5 | PASS | AUTO / HAND · fired: hardware primitives · cutter radii on the yoke bar and arm outlines |
| M6 | PASS | AUTO · edge distance and walls clean |
| M7 | N/A | HAND · no bracket corner turns a load |
| M8 | PASS | AUTO · fired: j1-dead-axle (no solids) · thread undercuts on stepped shafts where threaded |
| M9 | PASS | AUTO / HAND · fired: j1-dead-axle (no solids) · ISO coarse threads, engagement in the tapped base |
| M10 | PASS | AUTO / HAND · 119 of 124 solids name a material · materials named by kind and role (the bodies' own parts take their role's default) |
| M11 | PASS | AUTO · fired: j1-dead-axle (no solids), hardware primitives · centre holes and chamfered ends on the turned shafts |
| M12 | PASS | HAND · every screw reachable by its key in the explode; the journal bearing pulls from the ring once the circlips are out |
| M13 | PASS | AUTO / HAND · 14 threaded · threadlocker on every block and bracket screw (14 threaded) |
| M14 | N/A | AUTO / HAND · fired: tongue-slot (no solids), piston-bore (no solids), pin-hole (no solids), j4-slot-roller (no solids), pin-lobe (no solids), groove-cam (no solids), pallet-contact (no solids), eccentric (no solids), die (no solids), hub (no solids) · no sliding contact: every joint runs on rolling bearings or needles |
| V1 | PASS | AUTO · fired: drive (30 solids) · filled by the generator: a rule built solids for it |
| V2 | PASS | AUTO · fired: drive (30 solids) · filled by the generator: a rule built solids for it |
| V3 | PASS | AUTO / HAND · fired: drive (30 solids) · belt and pulleys clear of feet and housings (A15) |
| V4 | PASS | AUTO · fired: j8-belt (no solids) · flanged pulleys, belt in one plane |
| V5 | PASS | AUTO · fired: drive (30 solids) · filled by the generator: a rule built solids for it |
| V6 | PASS | AUTO · fired: drive (30 solids), cable-clip (2 solids) · filled by the generator: a rule built solids for it |
| L1 | PASS | STYLE · STYLE: no look values in the record |
| L2 | PASS | HAND · record carries no look |
| L3 | PASS | HAND · roles right on every solid (both sheets) |
| L4 | PASS | HAND / STYLE · one accent: the input hub, the traces |
| L5 | PASS | AUTO / HAND · fired: see-through (6 solids) · transparency and hidden lines show the one bearing in the ring and the shaft through the hub; fewer nested layers at the centre (one bearing, one-solid hub and ring) |
| L6 | PASS | AUTO · filled by the generator: the pipeline holds it for every built mechanism |
| L7 | PASS | STYLE · STYLE: turntable orbit, named views, no perspective |
| L8 | PASS | AUTO / HAND · fired: trace-marks (1 solid) · centrelines on every joint axis; trace marks on the base |
| L9 | PASS | AUTO / DATA · section A-A declared in teaching.views and drawn by the renderer |
| L10 | PASS | AUTO / STYLE · overlays drawn by the overlay rules in the sheet's look |
| R1 | PASS | HAND · the yoke and cups reuse the universal joint's shapes and the cross-pin kit; bearings, circlips and stacks from the primitives |
| R2 | PASS | HAND · shafts Ø10 (input and output), bearings 3804 (double-row table), 6801, 6800 from the tables, M5 and M4 screws |
| R3 | PASS | AUTO · fired: hardware primitives · shared subassemblies: pillow blocks, drive, sensor |
| R4 | PASS | AUTO · package v2 26.4 KB · filled by the generator: the pipeline holds it for every built mechanism |
| R5 | PASS | HAND · no polish |
| R6 | PASS | FLAG · FLAG: bench run on the desktop with three heavy jobs on the machine, numbers indicative: frames 1.2 to 2.2 ms (under 8 ms); setup 83.8 ms over the 20 ms target, 79 ms of it the GPU first frame under load; the phone is measured by David |
| R7 | PASS | HAND / FLAG · polish none; 0 solids added, 0 overrides by the polish |
| R8 | PASS | AUTO / SITE · SITE: thumbnails pre-rendered; the stage draws on change |
| R9 | PASS | AUTO / SITE · SITE: setup shared and shipped by operation |
| R10 | PASS | FLAG · FLAG: the bench page is built for the phone measurement |
| DL1 | PASS | AUTO / HAND · 44 of 124 solids on a dropping rung · every solid on a rung by kind and role |
| DL2 | PASS | HAND · default dial: full |
| DL3 | PASS | AUTO · filled by the generator: the pipeline holds it for every built mechanism |
| DL4 | PASS | SITE · SITE: adaptive dial in the site |
| DL6 | PASS | AUTO · filled by the generator: the pipeline holds it for every built mechanism |
| DL5 | PASS | FLAG · FLAG: rungs and frame times in the bench report |
| Q1 | PASS | check, clamp and edge distance clean |
| Q2 | PASS | 0 clashes, 0 unnecessary allows |
| Q3 | PASS | package v2 written, 23.5 KB; site build not checked here · package v2 written; site build at the integration branch |
| Q4 | PASS | local: tools/shot · record view, PLAN, FRONT, SIDE, ISOMETRIC, section A-A and full explode, both sheets, looked at |
| Q5 | PASS | local: tools/bench · bench report written (flags in R6) |
| Q6 | PASS | every row judged |
| Q7 | PASS | at 3.11 |
| Q8 | PASS | teaching review: keep (2026-10-27); the six phases of the finished build are looked at by eye · teaching review recorded in the record and on the teaching: line; the finished build's phases looked at |

## Joints
| Joint | Kit | Block | Support | Stack | F1 locate | F2 retain | F3 torque | F4 thrust | F5 limit | F6 hold | F7 adjust | F8 lube | F9 timing | F10 protect |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| S1 | J10 | spherical-four-bar | pillow | – | 4 x Dowel pin Ø4 x 14 h6, block to base | 2 x Internal circlip DIN 472, Ø19 | Feather key 3 x 3 x 25 (DIN 6885) | 2 x Shaft collar 10x18, set screw | none | none | none | none | none | none |
| S2 | J10 | spherical-four-bar | pillow (moved) | – | 4 x Dowel pin Ø4 x 14 h6, block to base | 2 x Internal circlip DIN 472, Ø19 | Feather key 3 x 3 x 13 (DIN 6885); Feather key 3 x 3 x 7 (DIN 6885) | Inner-race spacer 10.2x13; 2 x Shaft collar 10x18, set screw | none | none | none | none | none | none |
| T | cross-pin | spherical-four-bar | – | – | none | 2 x Internal circlip DIN 472, Ø14 | none | none | none | none | none | Grease nipple M6 (DIN 71412) | none | none |
| J | oblique-journal | spherical-four-bar | – | – | none | 2 x Internal circlip DIN 472, Ø32; External circlip DIN 471, Ø20; Inner-race spacer 20x24x3.5, from the hub's shoulder to the bearing | none | none | none | none | none | none | none | none |
| drive | drive | – | – | – | none | none | none | none | none | none | none | none | none | Home flag, 1 mm steel vane; Fork sensor, slotted optical, 5 mm gap |

## Supports
| Support | Joint | Kind | Route | Least gap mm | Covers | T10 |
|---|---|---|---|---|---|---|
| S1-pb | S1 | pillow | first choice | 1.5 | input, ring, yoke-out | – |
| S2-pb | S2 | pillow | moved | 1.5 | yoke-out, arm | – |

## Variants and overrides
| Joint or part | Rule result | Chosen | Why |
|---|---|---|---|
| input | a plain shaft body | the wobble hub, one solid: a Ø22 shank keyed on the Ø10 live shaft, faced square to the journal 3.5 mm behind the seat (an inner-race spacer between), with the journal machined on it at α (record: `shape.journal`), its planned length spanning the shaft's run on to the far block | the stack sizes the shaft from the shank (A3), keys it (F3) and straddles the hub; the shank is cut off at the shoulder plane by the shape and the key trimmed to the solid shank by the oblique-journal kit |
| ring nipple | on the rim toward the yoke | on the rim away from the yoke | it stood alone between the yoke's arms, out of a grease gun's reach |
| arm | a link on the output shaft, running free | keyed on the output shaft (record: `shape.keyed`) | the arm must turn with the output to give the stroke |
| J | two deep-groove bearings | one double-row angular-contact bearing 3804-2RS | owner's review: fewer see-through layers at the centre; it also carries the thrust along the journal both ways |

## Detail ladder
| Rung | Solids | Marks | Frame ms at this dial position |
|---|---|---|---|
| DL-A | 11 | 0 | 1.74 |
| DL-B | 0 | 272 | 1.85 |
| DL-C | 0 | 0 | 1.77 |
| DL-D | 10 | 0 | 2.08 |
| DL-E | 9 | 0 | 2.03 |
| DL-F | 0 | 0 | 2.19 |
| DL-G | 0 | 0 | 1.76 |
| DL-H | 13 | 0 | 2.13 |
| never | 73 | 151 | 1.99 (full) |

## Promotion candidates
Promoted in this pass: the `spherical-four-bar` block (closed form, any link angles; the Hooke joint is its 90 degree case,
checked in tests/kin/spherical.test.ts), the `wobble-ring` shape and the shaft's `journal` (the wobble hub, one solid),
the oblique-journal kit with the double-row bearing table, the cross-pin kit for a trunnion ring, `shape.keyed` for a
second keyed part on a live shaft, and the key-in-keyway allow for it in the stack builder.
Candidates: a shim pack at a located pillow block where axes must meet (F7, the wobble box and the universal joints);
a shank length of its own for a hub whose shaft runs on past it, in the stack builder instead of the kit's trim.

## Verification
check: clean · K1 residual: 1.4e-14 · claims: 4 of 4 ok · clearance: 0 clashes · clamp: clean · edge distance: clean · package: 26.4 KB
screenshots: .local/n1-shots/wobble-box/rework (record view, PLAN, FRONT, SIDE, ISOMETRIC, section A-A, explode; both sheets; centre crops at 2x) · bench: frame times of the first build (desktop under load from parallel passes, numbers indicative); setup 83.8 ms flagged over the 20 ms target (GPU first frame 79 ms)
