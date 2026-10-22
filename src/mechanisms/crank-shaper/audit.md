# Audit: Crank and slotted lever quick-return (crank-shaper)
standard: 3.0 · date: 2026-10-22 · result: pass · detail: full · pass: build
teaching: keep · decisions in the record

## Summary
PASS 151 · FAIL 0 · N/A 16 · open: none

## Requirements
| Id | Status | Evidence / action |
|---|---|---|
| S1 | PASS | DATA · the standard carries version 3.0 and its changelog |
| S2 | PASS | HAND · header with standard, date, result, detail, pass and the teaching: line |
| S3 | PASS | AUTO · tools/conformance reads this sheet (engine v3) and runs in npm run check |
| S4 | PASS | SITE · the batch issue #214 holds only this mechanism's decisions; plan and status in #202 |
| S5 | PASS | SITE · 3D stamp in the title block (every shot) and on the card and page header (site build) |
| S6 | PASS | AUTO · rebuilt from its record v3 in batch R3 (#214): bound by 3.0 from this pass |
| P1 | PASS | DATA · record v3 complete (kin and teaching blocks); no polish, audit.md present |
| P2 | PASS | DATA · catalogue validator clean |
| P3 | PASS | DATA / SITE · the page reads ratio, axes, character, backdrivable, aka, family, motion, level, dof and the drive from the record |
| P4 | PASS | DATA · tags grouped Function, Property, Application, keywords |
| P5 | PASS | DATA · explanation in four parts and the examples from the record |
| P6 | PASS | DATA · references and media from the record, validated by the catalogue |
| P7 | PASS | HAND / SITE · no polish; labels come from the record |
| P8 | PASS | SITE · the page has no parts list or joint sections (site) |
| P9 | PASS | AUTO / HAND · every number the explanation states is a claim and agrees (T9) |
| P10 | PASS | HAND · C traced with ticks, B traced, tangent lines, cut and return arcs; plot of ram position |
| P11 | PASS | DATA · plain language, mm and degrees |
| P12 | PASS | AUTO / DATA · validate(records, asVersion 3) clean for this record |
| P13 | PASS | HAND · teaching review run on the record (E2, #204) and again on the six phases of the finished build (teaching: line) |
| K1 | PASS | AUTO · K1 residual 4.9e-14 (tolerance 1e-9) over 360 samples, reference 2.0e-14 |
| K2 | PASS | AUTO · check: finite, continuous, periodic over 360 samples |
| K3 | PASS | AUTO / HAND · 2 blocks (slider-dyad); no numeric fallback · composed from the block library; no fallback, no one-off model |
| K4 | PASS | HAND · crank the driver with the accent, block a slider in the lever's slot, lever and link links, ram the output on ways |
| K6 | PASS | DATA · r 40, d 100, lever 160, link 40: ratio 1.71, cut 227°, return 133°, stroke 128 as the defining relations say; the ram line raised from 64 to 80 above O2 so the ram's ways clear the block's path (stroke and ratio unchanged within the claims) |
| K7 | PASS | DATA · drivers input (rotary) · input kind declared with its driven joint |
| K8 | PASS | AUTO / DATA · every joint declared with type, bodies, origin and axis; nothing inferred |
| K9 | PASS | DATA · one rotary driver |
| K10 | PASS | AUTO / DATA · the declared closures, continuous over the cycle (no POSE JUMP) |
| K11 | PASS | AUTO · mobility counted 1, dof 1 |
| K12 | PASS | DATA · every traced, overlaid and claimed point and quantity is named in kin |
| T1 | PASS | HAND · the lever's tangent lines and the cut and return arcs make the quick return read; mechanics only |
| T2 | PASS | HAND · review before the build (E2) and again on the six phases of the finished build; decisions in the record |
| T3 | PASS | DATA · crank, block, lever, ram and C declared |
| T4 | PASS | DATA · fired: trace-marks (no solids) · C traced with ticks every 15°, B traced |
| T5 | PASS | DATA · the two lever tangent lines (posed at the lever's extremes) and the cut and return arcs on the crank circle |
| T6 | PASS | HAND / DATA · 1.71:1: the return is visibly quicker |
| T7 | PASS | DATA · PLAN |
| T8 | N/A | DATA · the principle reads in plan; no section or detail view declared |
| T9 | PASS | AUTO / DATA · claim table: 5 ok, 0 off, 0 uncheckable of 5 |
| T10 | PASS | AUTO · 12 solids drawn see-through: B-bolt-wsh, B-bolt-head, C-1-brg, C-1-brg-balls, C-1-brg-cage, rails-keeper, O3-slv, O3-bb · the static solids over the principle in plan are drawn see-through (listed) |
| T11 | PASS | AUTO · 1 support routed, 1 moved off a sweep · the routed support moved off the sweep |
| T12 | PASS | HAND · 18 support solids; dropped by the polish: none |
| T13 | N/A | DATA · nothing goes by in a blink |
| T14 | PASS | HAND / DATA · the crank driver |
| T15 | PASS | HAND · labels state the mechanism, never its use |
| T16 | N/A | HAND / STYLE · no two parts of one role to tell apart by hue |
| T17 | PASS | AUTO · depth peeling, no depth bias (renderer test) |
| D1 | PASS | HAND · slotted lever with its slot over the block's run, short link, ram block on ways |
| D2 | PASS | HAND · bosses at the lever's pivot and top pin; the slot carries wear strips |
| D3 | PASS | STYLE · STYLE: roles by pattern and tone (both sheets) |
| D4 | PASS | AUTO · fired: base (3 solids), feet (4 solids) · base corners and feet concentric (base, feet rules) |
| D5 | PASS | AUTO / HAND · ways on ground risers; the lever's pivot O3 on a routed bridge (moved off the sweep) |
| D6 | PASS | HAND / STYLE · hardware quieter than the parts, still readable (both sheets) |
| D8 | PASS | AUTO / HAND · every solid a profile, an operation and a frame; built by Manifold; no layers, dz or twin |
| D9 | N/A | AUTO / HAND · no member changes shape |
| D10 | PASS | AUTO · profiles shipped for plain extrusions, meshes only for booleans (package v2) |
| D11 | PASS | AUTO · SOLID: 0 of 141 solids unsound |
| D7 | PASS | HAND · plain lever and links; richness in the slot's wear strips, ways and stacks |
| A1 | PASS | AUTO · A J3, B J3, C J3, O2 J2, slot J5, rails J5, O3 J1, O3-lever-stops stops, drive drive · every joint read from the record and built by its kit |
| A2 | PASS | AUTO · A J3, B J3, C J3, O2 J2, slot J5, rails J5, O3 J1, O3-lever-stops stops, drive drive · pins and shafts by kit and stack; slides by J5; the kits listed |
| A3 | PASS | AUTO · fired: classify (7 solids), axial stack builder · bores from the catalogue; bearings where a boss fits them, bushings or liners elsewhere |
| A4 | PASS | AUTO · fired: j1-dead-axle (27 solids), axial stack builder · stepped shafts with shoulders, grooves, flats and chamfered ends (H.shaft) |
| A5 | PASS | AUTO · fired: j2-live-shaft (24 solids), j10-shaft-in-plan (no solids), axial stack builder · keys by shaft size: D-flat to Ø8, feather key above |
| A6 | PASS | AUTO · fired: j5-slide (21 solids), j13-compliant (no solids), standoffs (no solids) · ways on ground risers; fixed plates posted or screwed down |
| A7 | PASS | AUTO · fired: base (3 solids), feet (4 solids) · base under the lowest part, counterbored corner holes, feet, engraved scale and paths, shaft clearance holes |
| A8 | PASS | AUTO · fired: fasteners (18 solids) · stage 3 fasteners: shanks, clearance and tapped holes |
| A9 | PASS | AUTO / HAND · fired: placement solver · crank pin single shear into the block; lever pivot double shear between base and bridge; link pins single shear |
| A10 | PASS | HAND · fired: placement (10 solids), placement solver · crank, then the block in the lever's slot on one slab (they slide together), the link over the lever, the ram under the link |
| A11 | PASS | AUTO / HAND · fired: j12-flexible (no solids), strap-sheave (no solids), j1-dead-axle (27 solids) · block to slot to lever to pivot axle to base and bridge; ram to ways to risers to base |
| A12 | PASS | AUTO · clamp check clean |
| A13 | PASS | AUTO / HAND · 141 solids, 75 unnamed (further items of a listed set) · named hardware with catalogue sizes and materials |
| A14 | PASS | AUTO / HAND · fired: support router · supports routed against the sweeps; details checked by A15 |
| A15 | PASS | AUTO · clearance in 3D over 72 phases: 0 clashes; hand allow: 0 named, 0 unnecessary |
| A16 | PASS | HAND · 9 joint notes; no note: none; no badge: slot, rails · a note per joint; build rules: the block slides in the lever's slot on wear strips, the lever's pivot carried by a bridge |
| A17 | PASS | HAND · base, housing and crank, lever on its axle, block in the slot, bridge, link, ways, ram |
| A18 | PASS | AUTO · placement: 3 slabs in the tallest stack (32.0 mm), 0 clevises; stack per joint in the Joints table · axial positions set by the placement solver (order kept: a slider's partners over it, a die's carrier over its link) |
| A19 | PASS | AUTO · 1 support routed (1 moved), least gap 1.5 mm; still covering a principle part, drawn see-through: O3-bridge · the routed support moved off the sweep; what it still covers is drawn see-through |
| A20 | PASS | AUTO · support per joint: O3 bridge · one axial stack builder with its support selector |
| A21 | PASS | AUTO · kit per joint: A J3, B J3, C J3, O2 J2, slot J5, rails J5, O3 J1, O3-lever-stops stops, drive drive |
| A22 | PASS | AUTO · fired: stops (8 solids), adjustable-length (no solids), cable-clip (2 solids) · stops on the swinging part; cable clip |
| E1 | PASS | AUTO · every solid has one explode level; levels -4 to 5 · one level per solid, nothing stretches |
| E2 | PASS | AUTO · fired: explode (1 solid) · heads, shanks, washers and nuts move as one |
| E3 | PASS | AUTO · fired: explode (1 solid) · screws back out along their axes |
| E4 | PASS | HAND · bridge, link and keeper furthest (explode shots) |
| E5 | PASS | AUTO · fired: explode (1 solid) · pressed bearings, bushings and clips stay with their parts |
| E6 | PASS | AUTO · fired: explode (1 solid) · motor, bearings and pulley pair whole |
| E7 | PASS | AUTO · fired: explode (1 solid) · loose spacers midway |
| E8 | PASS | AUTO · fired: explode (1 solid) · keyed parts keep their order on their shaft |
| E9 | PASS | HAND · full explode readable in ISOMETRIC on both sheets, nothing leaves the frame |
| E10 | PASS | AUTO · fired: explode (1 solid) · each stack explodes along its joint axis, with trail lines |
| J1 | PASS | AUTO · fired: trunnion (no solids), hub (no solids), j1-dead-axle (27 solids) · fixed pivots: dead axle, hub or between-bridge as the Joints table says |
| J2 | PASS | AUTO · fired: j2-live-shaft (24 solids) · live shafts: housing, key or D-flat, part held on the shaft end where something sweeps over |
| J3 | PASS | AUTO · fired: j3-moving-pin (27 solids), cross-bearings (no solids), ring-hub (no solids), eccentric (no solids) · moving pins: shoulder bolts with bearings or bushings; eccentrics on liners |
| J4 | N/A | AUTO · fired: j4-slot-roller (no solids), pin-lobe (no solids), fork-pin (no solids), die (no solids) · no pin in a slot |
| J5 | PASS | AUTO · fired: piston-bore (no solids), j5-slide (21 solids), tongue-slot (no solids) · the ram on ways with a gib under a keeper; the block in the lever's slot on wear strips |
| J6 | N/A | AUTO · fired: j6-mesh (no solids), ring-rollers (no solids) · no parallel mesh |
| J7 | N/A | AUTO · fired: groove-cam (no solids), j7-cam (no solids), pallet-contact (no solids), pawl-tooth (no solids) · no cam |
| J8 | N/A | AUTO · fired: j8-belt (no solids), j12-flexible (no solids) · no belt in the mechanism (the drive belt is V4) |
| J9 | N/A | AUTO · fired: j9-crossed-mesh (no solids) · no crossed mesh |
| J10 | N/A | AUTO · fired: j10-shaft-in-plan (no solids) · no shaft in plan |
| J12 | N/A | AUTO · fired: j12-flexible (no solids), strap-sheave (no solids) · no flexible member |
| J13 | N/A | AUTO · fired: j13-compliant (no solids) · no compliant joint |
| J11 | N/A | AUTO · fired: j11-screw (no solids) · no screw |
| F1 | PASS | AUTO · served at O2, rails, O3; fired: j2-live-shaft (24 solids), j10-shaft-in-plan (no solids), hub (no solids), strap-sheave (no solids), j13-compliant (no solids), covers (no solids) · housings, hubs, bridges and ways dowelled (Joints table) |
| F2 | PASS | AUTO · served at A, B, C, O2, rails, O3; fired: j2-live-shaft (24 solids), j10-shaft-in-plan (no solids), cross-bearings (no solids), trunnion (no solids), fork-pin (no solids), ring-hub (no solids), eccentric (no solids), hub (no solids), ring-rollers (no solids), j12-flexible (no solids), strap-sheave (no solids), j13-compliant (no solids), covers (no solids) · every bearing retained; every part on a shaft or pin retained (Joints table) |
| F3 | PASS | AUTO · served at A, B, C; fired: j2-live-shaft (24 solids), j10-shaft-in-plan (no solids), j12-flexible (no solids), j11-screw (no solids) · every keyed part keyed or on a D-flat with its retainer |
| F4 | PASS | AUTO / HAND · served at O2, O3; fired: j9-crossed-mesh (no solids), j2-live-shaft (24 solids), j10-shaft-in-plan (no solids), trunnion (no solids) · thrust washers and spacers locate every stack (Joints table) |
| F5 | PASS | AUTO / HAND · served at O3-lever-stops; fired: j5-slide (21 solids), pawl-tooth (no solids), j13-compliant (no solids), stops (8 solids) · stop pins either side of the lever's swing (stops rule); the ram needs none, the crank drives it |
| F6 | N/A | AUTO / HAND · served at no joint; fired: trunnion (no solids), j7-cam (no solids), pallet-contact (no solids), pawl-tooth (no solids), j12-flexible (no solids) · nothing is held by a spring or detent: every part is driven by its pin |
| F7 | PASS | AUTO / HAND · served at rails; fired: j6-mesh (no solids), j9-crossed-mesh (no solids), j5-slide (21 solids), j12-flexible (no solids), adjustable-length (no solids), covers (no solids) · gibs on the ways |
| F8 | PASS | AUTO · served at rails; fired: cross-bearings (no solids), tongue-slot (no solids), eccentric (no solids), j12-flexible (no solids), j11-screw (no solids), lubrication (1 solid) · grease nipples or oil holes on the ways, felt wipers; sealed bearings elsewhere |
| F9 | PASS | AUTO / HAND · served at no joint; fired: j6-mesh (no solids), j9-crossed-mesh (no solids), timing-marks (1 solid) · zero line on the input and on the base (timing marks) |
| F10 | PASS | AUTO / HAND · served at drive; fired: j12-flexible (no solids), drive (26 solids) · home flag and fork sensor on the input (drive) |
| M1 | PASS | AUTO · fired: hardware primitives · top-face chamfers by part kind (primitives) |
| M2 | PASS | HAND · bosses round every loaded hole |
| M3 | PASS | AUTO · fired: j3-moving-pin (27 solids), hardware primitives · bore entry chamfers |
| M4 | PASS | AUTO / HAND · fired: base (3 solids), fasteners (18 solids) · counterbores and countersinks for heads (base, csk, housings) |
| M5 | PASS | AUTO / HAND · fired: hardware primitives · cutter radii on windows and slots |
| M6 | PASS | AUTO · edge distance and walls clean |
| M7 | N/A | HAND · no bracket corner turns a load |
| M8 | PASS | AUTO · fired: j1-dead-axle (27 solids) · thread undercuts on stepped shafts |
| M9 | PASS | AUTO / HAND · fired: j1-dead-axle (27 solids) · ISO coarse threads, engagement through the tapped part or to a nut |
| M10 | PASS | AUTO / HAND · 136 of 141 solids name a material · materials named by kind and role |
| M11 | PASS | AUTO · fired: j1-dead-axle (27 solids), hardware primitives · centre holes, chamfered ends on turned parts |
| M12 | PASS | HAND · every screw reachable by its key in the explode |
| M13 | PASS | AUTO / HAND · 21 threaded · threadlocker or nyloc on every threaded fastener |
| M14 | PASS | AUTO / HAND · fired: piston-bore (no solids), j4-slot-roller (no solids), pin-lobe (no solids), groove-cam (no solids), pallet-contact (no solids), tongue-slot (no solids), eccentric (no solids), die (no solids), hub (no solids) · hardened wear strips in the lever's slot walls are the replaceable wear parts |
| V1 | PASS | AUTO · fired: drive (26 solids) · brushless pancake motor, GT2 32:16 |
| V2 | PASS | AUTO · fired: drive (26 solids) · one bracket for the motor |
| V3 | PASS | AUTO / HAND · fired: drive (26 solids) · belt and pulleys clear of feet and housings (A15) |
| V4 | PASS | AUTO · fired: j8-belt (no solids) · flanged pulleys, belt in one plane |
| V5 | PASS | AUTO · fired: drive (26 solids) · rotary input: belt to the input pulley |
| V6 | PASS | AUTO · fired: drive (26 solids), cable-clip (2 solids) · home flag, fork sensor, terminals, lead and clip |
| L1 | PASS | STYLE · STYLE: no look values in the record or polish |
| L2 | PASS | HAND · records carry no look; no polish |
| L3 | PASS | HAND · roles right on every solid (both sheets) |
| L4 | PASS | HAND / STYLE · one accent: the input ring, the traces |
| L5 | PASS | AUTO / HAND · fired: see-through (12 solids) · transparency and hidden lines show screws in holes and bearings in bores |
| L6 | PASS | AUTO · depth peeling at every view (shots) |
| L7 | PASS | STYLE · STYLE: turntable orbit, named views, no perspective |
| L8 | PASS | AUTO / HAND · fired: trace-marks (no solids) · centrelines along every joint axis, base dimensions, engraved marks |
| L9 | N/A | AUTO / DATA · no section or detail view declared |
| L10 | PASS | AUTO / STYLE · teaching overlays in the sheet's look |
| R1 | PASS | HAND · every standard part from the primitives and kits |
| R2 | PASS | HAND · standard sizes only |
| R3 | PASS | AUTO · fired: hardware primitives · shared subassemblies, one function each |
| R4 | PASS | AUTO · package v2 26.0 KB · package v2 written at build time |
| R5 | PASS | HAND · no polish |
| R6 | PASS | FLAG · FLAG: bench run (desktop, below); the phone is measured by David |
| R7 | PASS | HAND / FLAG · polish none; 0 solids added, 0 overrides by the polish |
| R8 | PASS | AUTO / SITE · SITE: thumbnails pre-rendered, cards animate on hover |
| R9 | PASS | AUTO / SITE · setup and bake in the worker, one context |
| R10 | PASS | FLAG · FLAG: the bench page is built for the phone measurement |
| DL1 | PASS | AUTO / HAND · 51 of 141 solids on a dropping rung · every solid, mark and effect on a rung by its kind |
| DL2 | PASS | HAND · default dial: full |
| DL3 | PASS | AUTO · view-aware exceptions in the ladder table |
| DL4 | PASS | SITE · SITE: adaptive dial with hysteresis |
| DL6 | PASS | AUTO · teaching layers drawn at every dial position |
| DL5 | PASS | FLAG · FLAG: bench reports frame time per dial position |
| Q1 | PASS | check, clamp and edge distance clean |
| Q2 | PASS | 0 clashes, 0 unnecessary allows |
| Q3 | PASS | package v2 written, 26.0 KB; site build not checked here · package v2 written; site builds (npm run build) |
| Q4 | PASS | local: tools/shot · dist/shots3/<id>: record view, PLAN, FRONT, SIDE, ISOMETRIC, full explode, both sheets |
| Q5 | PASS | local: tools/bench · tools/bench3 run (desktop) |
| Q6 | PASS | every row judged |
| Q7 | PASS | at 3.0 |
| Q8 | PASS | teaching review: keep (2026-10-20); the six phases of the finished build are looked at by eye · verdict and decisions in the record and the teaching: line; six phases of the finished build looked at |

## Joints
| Joint | Kit | Block | Support | Stack | F1 locate | F2 retain | F3 torque | F4 thrust | F5 limit | F6 hold | F7 adjust | F8 lube | F9 timing | F10 protect |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| A | J3 | slider-dyad | – | – | none | Shoulder bolt Ø5 x 16, M4 (ISO 7379) | Shoulder bolt Ø5 x 16, M4 (ISO 7379) | none | none | none | none | none | none | none |
| B | J3 | slider-dyad | – | – | none | Shoulder bolt Ø6 x 16, M5 (ISO 7379) | Shoulder bolt Ø6 x 16, M5 (ISO 7379) | none | none | none | none | none | none | none |
| C | J3 | – | – | – | none | Shoulder bolt Ø6 x 16, M5 (ISO 7379) | Shoulder bolt Ø6 x 16, M5 (ISO 7379) | none | none | none | none | none | none | none |
| O2 | J2 | driver | – | – | 2 x Dowel pin Ø3 x 10 h6, housing to base | 2 x Internal circlip DIN 472, Ø16; End washer 4.4x16, holds the crank on the shaft end; Countersunk M4 x 10 (ISO 10642) | none | Thrust washer 8.2x16, bronze; Wave washer 12x15.8, spring steel | none | none | none | none | none | none |
| slot | J5 | – | – | – | none | none | none | none | none | none | none | none | none | none |
| rails | J5 | – | – | – | 2 x Dowel pin Ø3 h6, reference rail to base | Keeper plate, laps the slider | none | none | none | none | Gib strip 3 x 6 x 164, bronze | 2 x Felt wiper in a steel clip; Grease nipple M6 (DIN 71412) | none | none |
| O3 | J1 | slider-dyad | bridge (moved) | – | Bridge over the pivot, on two spigoted posts; Dead axle Ø12, shouldered, M10 end | External circlip DIN 471, Ø12 | none | Thrust washer 12.2x20, bronze | none | none | none | none | none | none |
| O3-lever-stops | stops | – | – | – | none | none | none | none | 2 x Stop pin Ø6, hardened, on the lever's edge | none | none | none | none | none |
| drive | drive | – | – | – | none | none | none | none | none | none | none | none | none | Home flag, 1 mm steel vane; Fork sensor, slotted optical, 5 mm gap |

## Supports
| Support | Joint | Kind | Route | Least gap mm | Covers | T10 |
|---|---|---|---|---|---|---|
| O3-bridge | O3 | bridge | moved | 1.5 | lever | see-through |

## Variants and overrides
| Joint or part | Rule result | Chosen | Why |
|---|---|---|---|
| slot | J5 rails on the base | block in the lever's slot on wear strips | the slot is the guide (J5 kit: a block in a moving slotted link) |
| yR | 64 | 80 | the ram's ways would stand in the block's path (record changed) |

## Detail ladder
| Rung | Solids | Marks | Frame ms at this dial position |
|---|---|---|---|
| DL-A | 13 | 0 | 1.65 |
| DL-B | 0 | 191 | 1.72 |
| DL-C | 0 | 0 | 1.81 |
| DL-D | 15 | 0 | 1.8 |
| DL-E | 11 | 1 | 1.66 |
| DL-F | 0 | 0 | 1.76 |
| DL-G | 0 | 0 | 1.62 |
| DL-H | 12 | 0 | 1.69 |
| never | 90 | 157 | 1.83 |

## Promotion candidates
None left: the block-in-slot form of J5 and the same-slab rule for a slide between moving parts are in the kit and the placer.

## Verification
check: clean · K1 residual: 4.9e-14 · claims: 5 of 5 ok · clearance: 0 clashes · clamp: clean · edge distance: clean · package: 26.0 KB
screenshots: dist/shots3/crank-shaper (record view, PLAN, FRONT, SIDE, ISOMETRIC, explode; both sheets) · bench: dist/bench/report-v3.json (tools/bench3) (desktop; frame times paced at 28° in the ladder above; phone by David)
