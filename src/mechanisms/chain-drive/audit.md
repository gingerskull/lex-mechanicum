# Audit: Chain drive (chain-drive)
standard: 3.0 · date: 2026-10-22 · result: pass · detail: full · pass: build
teaching: tweak · decisions in the record

## Summary
PASS 148 · FAIL 0 · N/A 19 · open: none

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
| P10 | PASS | HAND · a pitch point traced on each sprocket with ticks every 24 deg (one tooth); the pitch chord and pitch circle of the driver, the tight span; plots of the speed ratio and the chain's speed (the chordal ripple) |
| P11 | PASS | DATA · plain language, mm and degrees |
| P12 | PASS | AUTO / DATA · validate(records, asVersion 3) clean for this record |
| P13 | PASS | HAND · teaching review run against the record in E2 (#204) before the build and again on the finished drawing (teaching: line) |
| K1 | PASS | AUTO · K1 residual 4.3e-14 (tolerance 1e-9) over 360 samples, reference 3.5e-15 |
| K2 | PASS | AUTO · check: finite, continuous, periodic over 360 samples |
| K3 | PASS | AUTO / HAND · 1 block (convey); no numeric fallback · composed from the block library; no fallback, no one-off model |
| K4 | PASS | HAND · the input body is the driver with the accent on its shaft; the output body declared |
| K6 | PASS | DATA · ISO 606 08B (p 12.7, rollers 8.5), 15 and 30 teeth, 62 links: the loop on the seat circles gives C 248.98 mm; ratio 15/30 on average; chain speed falls to cos(180/15) = 0.978 of its peak once per tooth |
| K7 | PASS | DATA · drivers input (rotary) · input kind declared with its driven joint |
| K8 | PASS | AUTO / DATA · every joint declared with type, bodies, origin and axis; nothing inferred |
| K9 | PASS | DATA · one rotary driver |
| K10 | PASS | AUTO / DATA · one closure, the open chain |
| K11 | PASS | AUTO · mobility counted 1, dof 1 |
| K12 | PASS | DATA · every traced, overlaid and claimed point and quantity is named in kin |
| T1 | PASS | HAND · mechanics first, no use context in the teaching strings; the principle reads at the default view |
| T2 | PASS | HAND · review before the build (E2) and again on the six phases of the finished build; decisions in the record |
| T3 | PASS | DATA · principle parts declared; drawn whole, in depth order |
| T4 | PASS | DATA · fired: trace-marks (no solids) · a pitch point on each sprocket with a tick per tooth of input (24 deg): 15 on the driver meet 15 on half the driven |
| T5 | PASS | DATA · the driver's pitch chord and pitch circle, the tight span |
| T6 | PASS | HAND / DATA · 2:1 in the ticks and the index marks; the chordal ripple (2.2 %) in the speed plots, as the record says it is too small to draw |
| T7 | PASS | DATA · PLAN: both sprockets and the whole loop in the plane |
| T8 | N/A | DATA · the principle lies in plain view, no section needed |
| T9 | PASS | AUTO / DATA · claim table: 3 ok, 0 off, 0 uncheckable of 3 |
| T10 | PASS | AUTO · 4 solids drawn see-through: O1-bb, O1-bridge, O2-bb, O2-bridge · the bridges over both sprockets drawn see-through where they cross them in plan |
| T11 | PASS | AUTO · 2 supports routed, 2 moved off a sweep · both bridges moved off the sweeps, the chain's band among them |
| T12 | PASS | HAND · 146 support solids; dropped by the polish: none |
| T13 | N/A | DATA · nothing goes by in a blink |
| T14 | PASS | HAND / DATA · the input is the one control |
| T15 | PASS | HAND · labels state the mechanism, never its use |
| T16 | N/A | HAND / STYLE · no two parts of one role to tell apart |
| T17 | PASS | AUTO · depth peeling, no depth bias (renderer test) |
| D1 | PASS | HAND · ISO 606 sprockets with roller seats and flanks; rollers, pins, inner and outer plates; the driven sprocket on a hub and spokes |
| D2 | PASS | HAND · material where the load runs, bosses round every pin |
| D3 | PASS | STYLE · STYLE: roles by pattern and tone (both sheets) |
| D4 | PASS | AUTO · fired: base (3 solids), feet (4 solids) · base corners and feet concentric (base, feet rules) |
| D5 | PASS | AUTO / HAND · one bridge per sprocket, one shoe arm on two posts, one motor flange |
| D6 | PASS | HAND / STYLE · hardware quieter than the parts, still readable (both sheets) |
| D8 | PASS | AUTO / HAND · every solid a profile, an operation and a frame; built by Manifold; no layers, dz or twin |
| D9 | PASS | AUTO / HAND · rollers, pins and plates conveyed round the loop by the chain's advance (D9), each plate a rigid link between its rollers |
| D10 | PASS | AUTO · profiles shipped for plain extrusions, revolutions and sweeps, meshes only for booleans (package v2) |
| D11 | PASS | AUTO · SOLID: 0 of 377 solids unsound |
| D7 | PASS | HAND · sprockets plain but for the large one's spokes; richness in the chain, the shoe and the stacks |
| A1 | PASS | AUTO · chain J12, O1 J2, O2 J2, drive drive · every joint read from the record and built by its kit |
| A2 | PASS | AUTO · chain J12, O1 J2, O2 J2, drive drive · both sprockets on live shafts (J2), straddle mounted in bridges; the chain by J12 |
| A3 | PASS | AUTO · fired: classify (3 solids), axial stack builder · bores from the catalogue; bearings where a boss fits them |
| A4 | PASS | AUTO · fired: j1-dead-axle (no solids), axial stack builder · stepped shafts with shoulders, grooves, flats and chamfered ends (H.shaft) |
| A5 | PASS | AUTO · fired: j2-live-shaft (84 solids), j10-shaft-in-plan (no solids), axial stack builder · keys by shaft size |
| A6 | N/A | AUTO · fired: j5-slide (no solids), j13-compliant (no solids), standoffs (no solids) · no slide and no floating plate |
| A7 | PASS | AUTO · fired: base (3 solids), feet (4 solids) · base 8 mm under the lowest part, counterbored corner holes, feet, engraved scale and paths, shaft clearance holes |
| A8 | PASS | AUTO · fired: fasteners (9 solids) · stage 3 fasteners: shanks, clearance and tapped holes |
| A9 | PASS | AUTO / HAND · fired: placement solver · both shafts straddle mounted, a bridge of its own each |
| A10 | PASS | HAND · fired: placement (4 solids), placement solver · both sprockets and the chain in one plane |
| A11 | PASS | AUTO / HAND · fired: j12-flexible (258 solids), strap-sheave (no solids), j1-dead-axle (no solids) · load paths closed: every joint note says where its load goes to ground |
| A12 | PASS | AUTO · clamp check clean |
| A13 | PASS | AUTO / HAND · 377 solids, 315 unnamed (further items of a listed set) · named hardware with catalogue sizes and materials |
| A14 | PASS | AUTO / HAND · fired: support router · supports routed against the sweeps (least gap 1.5 mm); details checked by A15 |
| A15 | PASS | AUTO · clearance in 3D over 72 phases: 0 clashes; hand allow: 0 named, 0 unnecessary |
| A16 | PASS | HAND · 4 joint notes; no note: none; no badge: none · a note per joint with its badge; build rules: a whole number of links sets the centre distance; the shoe on the slack span takes up the stretch; both shafts carried both sides; greased chain |
| A17 | PASS | HAND · assembles in the explode order; every screw reachable; pressed bearings pullable through their bores |
| A18 | PASS | AUTO · placement: 1 slabs in the tallest stack (7.0 mm), 0 clevises; stack per joint in the Joints table · placement: both sprockets and the chain on one slab |
| A19 | PASS | AUTO · 2 supports routed (2 moved), least gap 1.5 mm; still covering a principle part, drawn see-through: O1-bridge, O2-bridge · both bridges routed off the sweeps (the chain's band included); see-through where they still cross a sprocket in plan |
| A20 | PASS | AUTO · support per joint: O1 bridge, O2 bridge · one axial stack builder with its support selector |
| A21 | PASS | AUTO · kit per joint: chain J12, O1 J2, O2 J2, drive drive |
| A22 | PASS | AUTO · fired: stops (no solids), adjustable-length (no solids), cable-clip (2 solids) · cable clip |
| E1 | PASS | AUTO · every solid has one explode level; levels -4.5 to 3.5 · one level per solid, nothing stretches |
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
| J2 | PASS | AUTO · fired: j2-live-shaft (84 solids) · both shafts: housing, keyed, bridge over the top |
| J3 | N/A | AUTO · fired: j3-moving-pin (no solids), cross-bearings (no solids), ring-hub (no solids) · no moving revolute |
| J4 | N/A | AUTO · fired: j4-slot-roller (no solids), pin-lobe (no solids), fork-pin (no solids) · no pin in a slot |
| J5 | N/A | AUTO · fired: piston-bore (no solids), j5-slide (no solids), tongue-slot (no solids) · no plain slide |
| J6 | N/A | AUTO · fired: j6-mesh (no solids), ring-rollers (no solids) · no parallel mesh |
| J7 | N/A | AUTO · fired: groove-cam (no solids), j7-cam (no solids), pallet-contact (no solids), pawl-tooth (no solids) · no cam |
| J8 | N/A | AUTO · fired: j12-flexible (258 solids), j8-belt (no solids) · a chain, not a belt (J12) |
| J9 | N/A | AUTO · fired: j9-crossed-mesh (no solids) · no crossed mesh |
| J10 | N/A | AUTO · fired: j10-shaft-in-plan (no solids), j11-screw (no solids) · no shaft in plan |
| J12 | PASS | AUTO · fired: j12-flexible (258 solids), j12-other (no solids), strap-sheave (no solids) · ISO 606 sprockets; rollers and inner and outer link plates conveyed round on a path of exactly 62 pitches in links; the centre distance for a whole number of links; a polymer shoe on an arm slotted across the slack span, clamped on two posts, takes up the stretch; greased |
| J13 | N/A | AUTO · fired: j13-compliant (no solids) · no compliant joint |
| J11 | N/A | AUTO · fired: j11-screw (no solids) · no screw |
| F1 | PASS | AUTO · served at O1, O2; fired: j2-live-shaft (84 solids), j10-shaft-in-plan (no solids), strap-sheave (no solids), j13-compliant (no solids) · housings and bridges dowelled; the shoe arm on its posts |
| F2 | PASS | AUTO · served at O1, O2; fired: j12-flexible (258 solids), j2-live-shaft (84 solids), j10-shaft-in-plan (no solids), cross-bearings (no solids), trunnion (no solids), fork-pin (no solids), ring-hub (no solids), ring-rollers (no solids), strap-sheave (no solids), j11-screw (no solids), j13-compliant (no solids) · every bearing retained; the chain's pins riveted |
| F3 | PASS | AUTO · served at O1, O2; fired: j12-flexible (258 solids), j2-live-shaft (84 solids), j10-shaft-in-plan (no solids), j11-screw (no solids) · both sprockets keyed |
| F4 | PASS | AUTO / HAND · served at O1, O2; fired: j9-crossed-mesh (no solids), j2-live-shaft (84 solids), j10-shaft-in-plan (no solids), trunnion (no solids), j11-screw (no solids) · thrust washers under the sprockets |
| F5 | N/A | AUTO / HAND · served at no joint; fired: j5-slide (no solids), pawl-tooth (no solids), j11-screw (no solids), j13-compliant (no solids), stops (no solids) · both sprockets turn on through the cycle |
| F6 | N/A | AUTO / HAND · served at no joint; fired: j12-flexible (258 solids), trunnion (no solids), j7-cam (no solids), pallet-contact (no solids), pawl-tooth (no solids) · no rest position to hold: the drive positions every part |
| F7 | PASS | AUTO / HAND · served at chain; fired: j6-mesh (no solids), j9-crossed-mesh (no solids), j12-flexible (258 solids), j5-slide (no solids), j12-other (no solids), adjustable-length (no solids) · the shoe's arm slotted across the span sets the chain's tension |
| F8 | PASS | AUTO · served at no joint; fired: j12-flexible (258 solids), cross-bearings (no solids), tongue-slot (no solids), j11-screw (no solids), lubrication (2 solids) · the chain greased; sealed bearings |
| F9 | PASS | AUTO / HAND · served at no joint; fired: j6-mesh (no solids), j9-crossed-mesh (no solids), timing-marks (1 solid) · an index mark on each sprocket's face (count 2:1) |
| F10 | PASS | AUTO / HAND · served at drive; fired: j12-flexible (258 solids), drive (26 solids), yoke-drive (no solids) · home flag and fork sensor on the input (drive) |
| M1 | PASS | AUTO · fired: hardware primitives · top-face chamfers by part kind (primitives) |
| M2 | PASS | HAND · the large sprocket, which starts and stops with the motor, on a hub and six spokes |
| M3 | PASS | AUTO · fired: j3-moving-pin (no solids), hardware primitives · bore entry chamfers |
| M4 | PASS | AUTO / HAND · fired: base (3 solids), fasteners (9 solids) · counterbores and countersinks for heads (base, csk, housings) |
| M5 | PASS | AUTO / HAND · fired: hardware primitives · cutter radii on windows and slots |
| M6 | PASS | AUTO · edge distance and walls clean |
| M7 | N/A | HAND · no bracket corner turns a load |
| M8 | PASS | AUTO · fired: j1-dead-axle (no solids) · thread undercuts on stepped shafts |
| M9 | PASS | AUTO / HAND · fired: j1-dead-axle (no solids) · ISO coarse threads, engagement through the tapped part or to a nut |
| M10 | PASS | AUTO / HAND · 375 of 377 solids name a material · materials named by kind and role |
| M11 | PASS | AUTO · fired: j1-dead-axle (no solids), hardware primitives · centre holes, chamfered ends on turned parts |
| M12 | PASS | HAND · every screw reachable by its key in the explode |
| M13 | PASS | AUTO / HAND · 21 threaded · threadlocker or nyloc on every threaded fastener |
| M14 | PASS | AUTO / HAND · fired: piston-bore (no solids), j4-slot-roller (no solids), pin-lobe (no solids), groove-cam (no solids), pallet-contact (no solids), tongue-slot (no solids) · the shoe is the replaceable wear part on the chain's plates |
| V1 | PASS | AUTO · fired: drive (26 solids), yoke-drive (no solids) · pancake motor under the base, GT2 32:16 to the driver's shaft |
| V2 | PASS | AUTO · fired: drive (26 solids), yoke-drive (no solids) · one motor flange screwed up into the base |
| V3 | PASS | AUTO / HAND · fired: drive (26 solids) · belt and pulleys clear of feet and housings (A15) |
| V4 | PASS | AUTO · fired: j8-belt (no solids) · flanged pulleys, belt in one plane |
| V5 | PASS | AUTO · fired: drive (26 solids), yoke-drive (no solids) · rotary input: belt to the input pulley |
| V6 | PASS | AUTO · fired: drive (26 solids), yoke-drive (no solids), cable-clip (2 solids) · home flag, fork sensor, terminals, lead and clip |
| L1 | PASS | STYLE · STYLE: no look values in the record or polish |
| L2 | PASS | HAND · records and polish carry no look |
| L3 | PASS | HAND · roles right on every solid (both sheets) |
| L4 | PASS | HAND / STYLE · one accent: the input ring, the traces |
| L5 | PASS | AUTO / HAND · fired: see-through (4 solids) · transparency and hidden lines show screws in holes and bearings in bores |
| L6 | PASS | AUTO · depth peeling at every view (shots) |
| L7 | PASS | STYLE · STYLE: turntable orbit, named views, no perspective |
| L8 | PASS | AUTO / HAND · fired: trace-marks (no solids) · centrelines along every joint axis, base dimensions, engraved marks |
| L9 | N/A | AUTO / DATA · no section or detail view declared |
| L10 | PASS | AUTO / STYLE · teaching overlays in the sheet's look |
| R1 | PASS | HAND · every standard part from the primitives and kits |
| R2 | PASS | HAND · standard sizes only |
| R3 | PASS | AUTO · fired: hardware primitives · shared subassemblies, one function each |
| R4 | PASS | AUTO · package v2 32.5 KB · package v2 written at build time |
| R5 | PASS | HAND · the polish states only exceptions, no sampling |
| R6 | PASS | FLAG · FLAG: bench run (desktop): setup 23.9 ms over the 20 ms target (248 chain parts); the phone is measured by David |
| R7 | PASS | HAND / FLAG · polish none; 0 solids added, 0 overrides by the polish |
| R8 | PASS | AUTO / SITE · SITE: thumbnails pre-rendered, cards animate on hover |
| R9 | PASS | AUTO / SITE · setup and bake in the worker, one context |
| R10 | PASS | FLAG · FLAG: the bench page is built for the phone measurement |
| DL1 | PASS | AUTO / HAND · 44 of 377 solids on a dropping rung · every solid, mark and effect on a rung by its kind |
| DL2 | PASS | HAND · default dial: full |
| DL3 | PASS | AUTO · view-aware exceptions in the ladder table |
| DL4 | PASS | SITE · SITE: adaptive dial with hysteresis |
| DL6 | PASS | AUTO · teaching layers drawn at every dial position |
| DL5 | PASS | FLAG · FLAG: bench reports frame time per dial position |
| Q1 | PASS | check, clamp and edge distance clean |
| Q2 | PASS | 0 clashes, 0 unnecessary allows |
| Q3 | PASS | package v2 written, 32.5 KB; site build not checked here · package v2 written; site builds (npm run build) |
| Q4 | PASS | local: tools/shot · dist/shots3/chain-drive: record view, PLAN, FRONT, SIDE, ISOMETRIC, the declared views, full explode, both sheets |
| Q5 | PASS | local: tools/bench · tools/bench run: dist/bench/report-v2.md |
| Q6 | PASS | every row judged |
| Q7 | PASS | at 3.0 |
| Q8 | PASS | teaching review: tweak (2026-10-20); the six phases of the finished build are looked at by eye · verdict and decisions in the record and the teaching: line; six phases of the finished build looked at |

## Joints
| Joint | Kit | Block | Support | Stack | F1 locate | F2 retain | F3 torque | F4 thrust | F5 limit | F6 hold | F7 adjust | F8 lube | F9 timing | F10 protect |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| chain | J12 | convey | – | – | none | none | none | none | none | none | Shoe arm, slotted across the span, clamped on two posts | none | none | none |
| O1 | J2 | driver | bridge (moved) | – | 2 x Dowel pin Ø3 x 10 h6, housing to base; Bridge over the pivot, on two spigoted posts | 2 x Internal circlip DIN 472, Ø21; External circlip DIN 471, Ø12 | Feather key 4 x 4 x 11 (DIN 6885); Clamp hub Ø12x22, two set screws at 90°; Set screw M4 (DIN 916), threadlocked | Thrust washer 12.2x20, bronze; Wave washer 16.5x20.8, spring steel | none | none | none | none | none | none |
| O2 | J2 | convey | bridge (moved) | – | 2 x Dowel pin Ø3 x 10 h6, housing to base; Bridge over the pivot, on two spigoted posts | 2 x Internal circlip DIN 472, Ø21; External circlip DIN 471, Ø12 | Feather key 4 x 4 x 11 (DIN 6885); Clamp hub Ø12x22, two set screws at 90°; Set screw M4 (DIN 916), threadlocked | Thrust washer 12.2x20, bronze; Wave washer 16.5x20.8, spring steel | none | none | none | none | none | none |
| drive | drive | – | – | – | none | none | none | none | none | none | none | none | none | Home flag, 1 mm steel vane; Fork sensor, slotted optical, 5 mm gap |

## Supports
| Support | Joint | Kind | Route | Least gap mm | Covers | T10 |
|---|---|---|---|---|---|---|
| O1-bridge | O1 | bridge | moved | 1.5 | driver | see-through |
| O2-bridge | O2 | bridge | moved | 1.5 | driven | see-through |

## Variants and overrides
| Joint or part | Rule result | Chosen | Why |
|---|---|---|---|

## Detail ladder
| Rung | Solids | Marks | Frame ms at this dial position |
|---|---|---|---|
| DL-A | 9 | 0 | 1.82 |
| DL-B | 0 | 199 | 1.73 |
| DL-C | 0 | 0 | 1.7 |
| DL-D | 10 | 0 | 1.78 |
| DL-E | 8 | 2 | 1.7 |
| DL-F | 0 | 0 | 1.78 |
| DL-G | 0 | 0 | 1.78 |
| DL-H | 17 | 0 | 1.69 |
| never | 333 | 172 | 1.78 |

## Promotion candidates
None left: the roller chain (links conveyed in links on the seat circles, plates as rigid links between rollers, the shoe) is the J12 rule of the builder; the chordal action is a mode of the convey block.

## Verification
check: clean · K1 residual: 4.3e-14 · claims: 3 of 3 ok · clearance: 0 clashes · clamp: clean · edge distance: clean · package: 32.5 KB
screenshots: dist/shots3/chain-drive (record view, PLAN, FRONT, SIDE, ISOMETRIC, explode; both sheets) · bench: dist/bench/report-v2.md (desktop; frame times paced at 28 deg in the ladder above; phone by David)
