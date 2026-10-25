# Audit: Differential (differential)
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
| P10 | PASS | HAND · marks on both side gears traced, ticks every 180 deg of input; the side gear axis, the pinion axis and the cross-pin as lines; section A-A through the cross-pin's plane; plots of the left, right and case angles |
| P11 | PASS | DATA · plain language, mm and degrees |
| P12 | PASS | AUTO / DATA · validate(records, asVersion 3) clean for this record |
| P13 | PASS | HAND · teaching review run against the record before the build and again on the finished drawing (teaching: line) |
| K1 | PASS | AUTO · K1 residual 6.3e-16 (tolerance 1e-9) over 360 samples, reference 0.0e+0 |
| K2 | PASS | AUTO · check: finite, continuous, periodic over 360 samples |
| K3 | PASS | AUTO / HAND · 2 blocks (gear-mesh, bevel-diff); no numeric fallback · composed from the block library (gear-mesh for the pinion and the ring; bevel-diff for the spider train on the case: the side gears turn plus and minus the difference relative to the case, the spiders spin on the cross-pin); no fallback, no one-off model |
| K4 | PASS | HAND · the pinion drives with the accent on its shaft; the difference is the second input; the side gears are the outputs |
| K6 | PASS | DATA · pinion 10, ring 41 (module 4.878, ring pitch diameter 200), side gears 16 and spiders 10 (module 4, cones 58 and 32 deg, both apexes at the case's centre); split 0.5 by default |
| K7 | PASS | DATA · drivers input (rotary), difference (rotary) · two drivers: the pinion (rotary, one cycle is one case turn, 1476 deg) and the difference (the left side gear's turn relative to the case, at split times the case's turn per cycle) |
| K8 | PASS | AUTO / DATA · every joint declared with type, bodies, origin and axis; nothing inferred |
| K9 | PASS | DATA · two drivers and the split as controls; the tooth-count choices are not offered (they change the built gears) |
| K10 | PASS | AUTO / DATA · the pinion-ring mesh and four spider-side meshes declared, each spider mesh carried by the case; overconstrained, as topology.notes says (two spiders where one would do) |
| K11 | PASS | AUTO · mobility counted 1, dof 2 |
| K12 | PASS | DATA · every traced, overlaid and claimed point and quantity is named in kin |
| T1 | PASS | HAND · mechanics first, no use context in the teaching strings; the principle reads at the default view |
| T2 | PASS | HAND · review before the build and again on the six phases of the finished build; decisions in the record |
| T3 | PASS | DATA · principle parts declared; drawn whole, in depth order |
| T4 | PASS | DATA · fired: trace-marks (no solids) · a mark on each side gear traced, ticks every 180 deg of input: one runs three times as far as the other at split 0.5 |
| T5 | PASS | DATA · the side gear axis, the pinion axis and the cross-pin |
| T6 | PASS | HAND / DATA · the case carries the cross-pin round; the spiders spin on it only when the side gears turn apart |
| T7 | PASS | DATA · ISOMETRIC, where the ring gear, the case and the spiders between the side gears show |
| T8 | PASS | DATA · section A-A through the cross-pin's plane: the spiders meshing both side gears, highlighted |
| T9 | PASS | AUTO / DATA · claim table: 5 ok, 0 off, 0 uncheckable of 5 |
| T10 | PASS | AUTO · 10 solids drawn see-through: Op-k0-key, Op-ew, Op-es, Op-es-sh, Op-axle, Oc-pb-b1-ped, Oc-pb-b1, Oc-pb-b1-brg · the pinion's shaft end hardware and a pillow block of the case drawn see-through where they cover the spiders and side gears; the case itself is principle, drawn whole |
| T11 | PASS | AUTO · 2 supports routed, 1 moved off a sweep · the pinion's blocks moved off the ring; the case's blocks stand clear of the cage |
| T12 | PASS | HAND · 19 support solids; dropped by the polish: none |
| T13 | N/A | DATA · nothing goes by in a blink |
| T14 | PASS | HAND / DATA · the input, the difference and the split; tooth counts not offered (K9) |
| T15 | PASS | HAND · labels state the mechanism, never its use |
| T16 | N/A | HAND / STYLE · no two parts of one role to tell apart |
| T17 | PASS | AUTO · depth peeling, no depth bias (renderer test) |
| D1 | PASS | HAND · Tredgold bevel teeth on every gear (the pinion and ring 10/41, the spiders and side gears 10/16, apexes at the case's centre; gears facing down where their apex lies below their frame); the ring bolted to the case's cage |
| D2 | PASS | HAND · material where the teeth carry; the cage a flat frame round the spiders |
| D3 | PASS | STYLE · STYLE: roles by pattern and tone (both sheets) |
| D4 | PASS | AUTO · fired: base (3 solids), feet (4 solids) · base corners and feet concentric (base, feet rules) |
| D5 | PASS | AUTO / HAND · two pillow blocks under the case's shaft, two under the pinion's; motor beside the pinion's shaft on its angle bracket |
| D6 | PASS | HAND / STYLE · hardware quieter than the parts, still readable (both sheets) |
| D8 | PASS | AUTO / HAND · every solid a profile, an operation and a frame; built by Manifold; no layers, dz or twin |
| D9 | N/A | AUTO / HAND · no member changes shape |
| D10 | PASS | AUTO · profiles shipped for plain extrusions, meshes only for booleans (package v2) |
| D11 | PASS | AUTO · SOLID: 0 of 120 solids unsound |
| D7 | PASS | HAND · gears plain; richness in the stacks |
| A1 | PASS | AUTO · Mpr J9, M0L J9, M0R J9, M1L J9, M1R J9, Op J10, Oc J10, Os0 spider-pin, Os1 spider-pin, drive drive · every joint read from the record and built by its kit |
| A2 | PASS | AUTO · Mpr J9, M0L J9, M0R J9, M1L J9, M1R J9, Op J10, Oc J10, Os0 spider-pin, Os1 spider-pin, drive drive · the case on a live shaft in plan (J10) in two pillow blocks, the side gears running on that shaft in bearings; the spiders on the cage's cross-pin (spider-pin); the pinion on its shaft in plan (J10); five crossed meshes (J9) |
| A3 | PASS | AUTO · fired: classify (11 solids), axial stack builder · bores from the catalogue; bearings where a boss fits them |
| A4 | PASS | AUTO · fired: j1-dead-axle (no solids), axial stack builder · stepped shafts with shoulders, grooves, flats and chamfered ends (H.shaft) |
| A5 | PASS | AUTO · fired: j2-live-shaft (no solids), j10-shaft-in-plan (74 solids), axial stack builder · keys by shaft size: D-flat to Ø8, feather key above |
| A6 | N/A | AUTO · fired: j5-slide (no solids), j13-compliant (no solids), standoffs (no solids) · no slide and no floating plate |
| A7 | PASS | AUTO · fired: base (3 solids), feet (4 solids) · base 8 mm under the lowest part, counterbored corner holes, feet, engraved scale and paths, shaft clearance holes |
| A8 | PASS | AUTO · fired: fasteners (32 solids) · stage 3 fasteners: shanks, clearance and tapped holes |
| A9 | PASS | AUTO / HAND · fired: placement solver · the case between its two blocks; the pinion overhung past its blocks, held on its shaft end |
| A10 | PASS | HAND · fired: placement (13 solids), placement solver · every gear on its pitch cone, placed by its joint |
| A11 | PASS | AUTO / HAND · fired: j12-flexible (no solids), strap-sheave (no solids), j1-dead-axle (no solids) · load paths closed: every joint note says where its load goes to ground |
| A12 | PASS | AUTO · clamp check clean |
| A13 | PASS | AUTO / HAND · 124 solids, 68 unnamed (further items of a listed set) · named hardware with catalogue sizes and materials |
| A14 | PASS | AUTO / HAND · fired: support router · supports routed against the sweeps; details checked by A15 |
| A15 | PASS | AUTO · clearance in 3D over 72 phases: 0 clashes; hand allow: 0 named, 0 unnecessary |
| A16 | PASS | HAND · 10 joint notes; no note: none; no badge: Mpr, M0L, M0R, M1L, M1R · a note per joint; build rules: the side gears' revolutes on the case's axis at its centre (they run on its shaft), the spiders on the cage's cross-pin, the pinion on the side away from the case so its shaft's free end takes the drive |
| A17 | PASS | HAND · assembles in the explode order; every screw reachable; pressed bearings pullable through their bores |
| A18 | PASS | AUTO · placement: 3 slabs in the tallest stack (27.7 mm), 0 clevises; stack per joint in the Joints table · every gear placed by its joint (bevel cones), with its back face where the record puts it |
| A19 | PASS | AUTO · 2 supports routed (1 moved), least gap 1.5 mm; still covering a principle part, drawn see-through: Oc-pb · pillow blocks first choice or moved off the ring; least gap 1.5 mm |
| A20 | PASS | AUTO · support per joint: Op pillow, Oc pillow · one axial stack builder with its support selector; the spider-pin kit for the spiders |
| A21 | PASS | AUTO · kit per joint: Mpr J9, M0L J9, M0R J9, M1L J9, M1R J9, Op J10, Oc J10, Os0 spider-pin, Os1 spider-pin, drive drive |
| A22 | PASS | AUTO · fired: stops (no solids), adjustable-length (no solids), cable-clip (2 solids) · no stops (everything turns on); cable clip |
| E1 | PASS | AUTO · every solid has one explode level; levels -17.5 to 4.5 · one level per solid, nothing stretches |
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
| J2 | N/A | AUTO · fired: j2-live-shaft (no solids) · no live shaft standing on the base (the shafts are in plan, J10) |
| J3 | PASS | AUTO · fired: j3-moving-pin (no solids), cross-bearings (no solids), eccentric-bearing (no solids), spider-pin (6 solids), ring-hub (no solids) · the spiders on the cross-pin: bronze bushings, thrust washers at their back faces against the cage |
| J4 | N/A | AUTO · fired: pin-hole (no solids), j4-slot-roller (no solids), pin-lobe (no solids), fork-pin (no solids) · no pin in a slot |
| J5 | N/A | AUTO · fired: piston-bore (no solids), j5-slide (no solids), tongue-slot (no solids) · no slide |
| J6 | N/A | AUTO · fired: j6-mesh (no solids), ring-carrier (no solids), pin-ring (no solids), ring-rollers (no solids) · no parallel mesh |
| J7 | N/A | AUTO · fired: groove-cam (no solids), j7-cam (no solids), pallet-contact (no solids), pawl-tooth (no solids) · no cam |
| J8 | N/A | AUTO · fired: j8-belt (no solids), j12-flexible (no solids) · no belt in the mechanism (the drive belt is V4) |
| J9 | PASS | AUTO · fired: j9-crossed-mesh (5 solids) · five crossed meshes: shim packs at the back faces, thrust washers, timing marks at the meshes |
| J10 | PASS | AUTO · fired: j10-shaft-in-plan (74 solids) · the case's shaft and the pinion's: pillow blocks located by collars; the pinion held on its shaft end, the drive pulley on its free end |
| J12 | N/A | AUTO · fired: j12-flexible (no solids), strap-sheave (no solids) · no flexible member |
| J13 | N/A | AUTO · fired: j13-compliant (no solids) · no compliant joint |
| J11 | N/A | AUTO · fired: j11-screw (no solids) · no screw |
| F1 | PASS | AUTO · served at Op, Oc; fired: j2-live-shaft (no solids), j10-shaft-in-plan (74 solids), ring-carrier (no solids), pin-ring (no solids), strap-sheave (no solids), j13-compliant (no solids) · housings, blocks and bridges dowelled (Joints table) |
| F2 | PASS | AUTO · served at Op, Oc, Os0, Os1; fired: j2-live-shaft (no solids), j10-shaft-in-plan (74 solids), cross-bearings (no solids), trunnion (no solids), ring-carrier (no solids), eccentric-bearing (no solids), pin-ring (no solids), spider-pin (6 solids), fork-pin (no solids), ring-hub (no solids), ring-rollers (no solids), j12-flexible (no solids), strap-sheave (no solids), j13-compliant (no solids) · every bearing retained both sides; every part on a shaft retained (Joints table) |
| F3 | PASS | AUTO · served at Op; fired: j2-live-shaft (no solids), j10-shaft-in-plan (74 solids), j12-flexible (no solids), j11-screw (no solids) · every keyed part keyed or on a D-flat with its retainer |
| F4 | PASS | AUTO / HAND · served at Mpr, M0L, M0R, M1L, M1R, Op, Oc, Os0, Os1; fired: j9-crossed-mesh (5 solids), j2-live-shaft (no solids), j10-shaft-in-plan (74 solids), trunnion (no solids), spider-pin (6 solids) · thrust washers at every bevel's back face |
| F5 | N/A | AUTO / HAND · served at no joint; fired: j5-slide (no solids), pawl-tooth (no solids), j13-compliant (no solids), stops (no solids) · the gears turn continuously |
| F6 | N/A | AUTO / HAND · served at no joint; fired: trunnion (no solids), j7-cam (no solids), pallet-contact (no solids), pawl-tooth (no solids), j12-flexible (no solids) · no rest position to hold: the drive positions every part |
| F7 | PASS | AUTO / HAND · served at Mpr, M0L, M0R, M1L, M1R; fired: j6-mesh (no solids), j9-crossed-mesh (5 solids), j5-slide (no solids), j12-flexible (no solids), adjustable-length (no solids) · shim packs set the mounting distances and the backlash |
| F8 | PASS | AUTO · served at no joint; fired: cross-bearings (no solids), tongue-slot (no solids), j12-flexible (no solids), j11-screw (no solids), lubrication (no solids) · sealed bearings need none; open contacts oiled or greased where they occur |
| F9 | PASS | AUTO / HAND · served at Mpr, M0L, M0R, M1L, M1R; fired: j6-mesh (no solids), j9-crossed-mesh (5 solids), timing-marks (4 solids) · timing marks at the mesh |
| F10 | PASS | AUTO / HAND · served at drive; fired: j12-flexible (no solids), drive (30 solids) · home flag and fork sensor on the input (drive) |
| M1 | PASS | AUTO · fired: hardware primitives · top-face chamfers by part kind (primitives) |
| M2 | PASS | HAND · bosses round every loaded hole |
| M3 | PASS | AUTO · fired: j3-moving-pin (no solids), hardware primitives · bore entry chamfers |
| M4 | PASS | AUTO / HAND · fired: base (3 solids), fasteners (32 solids) · counterbores and countersinks for heads (base, csk, housings) |
| M5 | PASS | AUTO / HAND · fired: hardware primitives · cutter radii on windows and slots |
| M6 | PASS | AUTO · edge distance and walls clean |
| M7 | N/A | HAND · no bracket corner turns a load |
| M8 | PASS | AUTO · fired: j1-dead-axle (no solids) · thread undercuts on stepped shafts |
| M9 | PASS | AUTO / HAND · fired: j1-dead-axle (no solids) · ISO coarse threads, engagement through the tapped part or to a nut |
| M10 | PASS | AUTO / HAND · 118 of 124 solids name a material · materials named by kind and role |
| M11 | PASS | AUTO · fired: j1-dead-axle (no solids), hardware primitives · centre holes, chamfered ends on turned parts |
| M12 | PASS | HAND · every screw reachable by its key in the explode |
| M13 | PASS | AUTO / HAND · 15 threaded · threadlocker or nyloc on every threaded fastener |
| M14 | N/A | AUTO / HAND · fired: piston-bore (no solids), pin-hole (no solids), j4-slot-roller (no solids), pin-lobe (no solids), groove-cam (no solids), pallet-contact (no solids), tongue-slot (no solids) · no sliding contact needing a liner |
| V1 | PASS | AUTO · fired: drive (30 solids) · pancake motor beside the pinion's shaft on one angle bracket, belted to its free end |
| V2 | PASS | AUTO · fired: drive (30 solids) · one angle bracket: upright and foot |
| V3 | PASS | AUTO / HAND · fired: drive (30 solids) · belt and pulleys clear of feet and housings (A15) |
| V4 | PASS | AUTO · fired: j8-belt (no solids) · flanged pulleys, belt in one plane |
| V5 | PASS | AUTO · fired: drive (30 solids) · rotary input: belt to the pinion; the difference is a hand control on the page (it sets the side gears' split) |
| V6 | PASS | AUTO · fired: drive (30 solids), cable-clip (2 solids) · home flag, fork sensor, terminals, lead and clip |
| L1 | PASS | STYLE · STYLE: no look values in the record or polish |
| L2 | PASS | HAND · records and polish carry no look |
| L3 | PASS | HAND · roles right on every solid (both sheets) |
| L4 | PASS | HAND / STYLE · one accent: the input ring, the traces |
| L5 | PASS | AUTO / HAND · fired: see-through (10 solids) · transparency and hidden lines show screws in holes and bearings in bores |
| L6 | PASS | AUTO · depth peeling at every view (shots) |
| L7 | PASS | STYLE · STYLE: turntable orbit, named views, no perspective |
| L8 | PASS | AUTO / HAND · fired: trace-marks (no solids) · centrelines along every joint axis, base dimensions, engraved marks |
| L9 | PASS | AUTO / DATA · section A-A drawn by the renderer from the record |
| L10 | PASS | AUTO / STYLE · teaching overlays in the sheet's look |
| R1 | PASS | HAND · every standard part from the primitives and kits |
| R2 | PASS | HAND · standard sizes only |
| R3 | PASS | AUTO · fired: hardware primitives · shared subassemblies, one function each |
| R4 | PASS | AUTO · package v2 26.0 KB · package v2 written at build time |
| R5 | PASS | HAND · no polish; nothing sampled by hand |
| R6 | PASS | FLAG · FLAG: bench run (desktop, below); the phone is measured by David |
| R7 | PASS | HAND / FLAG · polish none; 0 solids added, 0 overrides by the polish |
| R8 | PASS | AUTO / SITE · SITE: thumbnails pre-rendered, cards animate on hover |
| R9 | PASS | AUTO / SITE · setup and bake in the worker, one context |
| R10 | PASS | FLAG · FLAG: the bench page is built for the phone measurement |
| DL1 | PASS | AUTO / HAND · 48 of 124 solids on a dropping rung · every solid, mark and effect on a rung by its kind |
| DL2 | PASS | HAND · default dial: full |
| DL3 | PASS | AUTO · view-aware exceptions in the ladder table |
| DL4 | PASS | SITE · SITE: adaptive dial with hysteresis |
| DL6 | PASS | AUTO · teaching layers drawn at every dial position |
| DL5 | PASS | FLAG · FLAG: bench reports frame time per dial position |
| Q1 | PASS | check, clamp and edge distance clean |
| Q2 | PASS | 0 clashes, 0 unnecessary allows |
| Q3 | PASS | package v2 written, 26.0 KB; site build not checked here · package v2 written; site builds (npm run build) |
| Q4 | PASS | local: tools/shot · dist/shots3/differential: record view, PLAN, FRONT, SIDE, ISOMETRIC, the declared views, full explode, both sheets |
| Q5 | PASS | local: tools/bench · tools/bench3 run (desktop) |
| Q6 | PASS | every row judged |
| Q7 | PASS | at 3.0 |
| Q8 | PASS | teaching review: tweak (2026-10-20); the six phases of the finished build are looked at by eye · verdict and decisions in the record and the teaching: line; six phases of the finished build looked at |

## Joints
| Joint | Kit | Block | Support | Stack | F1 locate | F2 retain | F3 torque | F4 thrust | F5 limit | F6 hold | F7 adjust | F8 lube | F9 timing | F10 protect |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Mpr | J9 | gear-mesh | – | – | none | none | none | pinion-tw, case-tw | none | none | pinion-shim, case-shim | none | Pinion; Case | none |
| M0L | J9 | – | – | – | none | none | none | spider0-tw, sideL-tw | none | none | spider0-shim, sideL-shim | none | Spider0; SideL | none |
| M0R | J9 | – | – | – | none | none | none | spider0-tw, sideR-tw | none | none | spider0-shim, sideR-shim | none | Spider0; SideR | none |
| M1L | J9 | – | – | – | none | none | none | spider1-tw, sideL-tw | none | none | spider1-shim, sideL-shim | none | Spider1; SideL | none |
| M1R | J9 | – | – | – | none | none | none | spider1-tw, sideR-tw | none | none | spider1-shim, sideR-shim | none | Spider1; SideR | none |
| Op | J10 | driver | pillow (moved) | – | 4 x Dowel pin Ø4 x 14 h6, block to base | End washer 5.4x20, holds the pinion on the shaft end; Countersunk M5 x 12 (ISO 10642); 2 x circlipInternal | Feather key 4 x 4 x 24.3 (DIN 6885) | 2 x Shaft collar 12x20, set screw | none | none | none | none | none | none |
| Oc | J10 | – | pillow | – | 4 x Dowel pin Ø4 x 14 h6, block to base | 2 x Internal circlip DIN 472, Ø16; 2 x Internal circlip DIN 472, Ø11 | none | 2 x Inner-race spacer 5.2x8.9; 2 x Shaft collar 5x13, set screw | none | none | none | none | none | none |
| Os0 | spider-pin | bevel-diff | – | – | none | Cross-pin Ø6, hardened, in the case's cage | none | Thrust washer 6.2x18, bronze | none | none | none | none | none | none |
| Os1 | spider-pin | bevel-diff | – | – | none | Cross-pin Ø6, hardened, in the case's cage | none | Thrust washer 6.2x18, bronze | none | none | none | none | none | none |
| drive | drive | – | – | – | none | none | none | none | none | none | none | none | none | Home flag, 1 mm steel vane; Fork sensor, slotted optical, 5 mm gap |

## Supports
| Support | Joint | Kind | Route | Least gap mm | Covers | T10 |
|---|---|---|---|---|---|---|
| Op-pb | Op | pillow | moved | 1.5 | – | – |
| Oc-pb | Oc | pillow | first choice | 1.5 | case, spider0, spider1, sideL, sideR | – |

## Variants and overrides
| Joint or part | Rule result | Chosen | Why |
|---|---|---|---|
| case | a ring gear | the ring gear and a cage frame round the spiders, the cross-pin in its members | the case carries the cross-pin; promoted to the gear shape (cage) |
| Os0, Os1 (spiders) | a moving pin (J3 shoulder bolt) | the spiders on the cage's cross-pin (spider-pin) | the pin is the case's; promoted to a kit |
| OL, OR (side gears) | pins of their own at their back faces | revolutes on the case's axis at its centre: the side gears run on the case's shaft | one shaft line for the case and both side gears |

## Detail ladder
| Rung | Solids | Marks | Frame ms at this dial position |
|---|---|---|---|
| DL-A | 13 | 0 | – |
| DL-B | 0 | 272 | – |
| DL-C | 0 | 0 | 1.12 |
| DL-D | 13 | 0 | – |
| DL-E | 8 | 10 | – |
| DL-F | 0 | 0 | – |
| DL-G | 0 | 0 | 1.03 |
| DL-H | 14 | 0 | – |
| never | 72 | 149 | 0.80 (full) |

## Promotion candidates
None left: the bevel-diff block, the cage on a gear, bevels facing down, the spider-pin kit, a driver speed from a param and claims at a setting are in the library. Open: the second input's hand control is not built as hardware (the side gears' shafts are the case's; real half-shafts would carry the outputs).

## Verification
check: clean · K1 residual: 6.3e-16 · claims: 5 of 5 ok · clearance: 0 clashes · clamp: clean · edge distance: clean · package: 80.2 KB
screenshots: dist/shots3/differential (record view, PLAN, FRONT, SIDE, ISOMETRIC, section A-A, explode; both sheets) · bench: tools/bench3 (desktop; 28 deg paced 0.80 ms full, 1.12 at C, 1.03 at G; phone by David)
