# Audit: Belt CVT (variable pulley) (cvt-belt)
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
| P10 | PASS | HAND · both pitch circles drawn at the solved radii (they follow the ratio control); the centre distance; ticks every 30 deg on a mark on each fixed half; ghost traces of the output mark at both ratio limits; section A-A through both shafts shows the V of each pair closing and opening; plot of the output angle |
| P11 | PASS | DATA · plain language, mm and degrees |
| P12 | PASS | AUTO / DATA · validate(records, asVersion 3) clean for this record |
| P13 | PASS | HAND · teaching review run against the record in E2 (#204) before the build and again on the finished drawing (teaching: line) |
| K1 | PASS | AUTO · K1 residual 2.8e-14 (tolerance 1e-9) over 360 samples, reference 0.0e+0 |
| K2 | PASS | AUTO · check: finite, continuous, periodic over 360 samples |
| K3 | PASS | AUTO / HAND · 1 block (variator); no numeric fallback · composed from the block library; no fallback, no one-off model |
| K4 | PASS | HAND · the input body is the driver with the accent on its shaft; the output body declared |
| K6 | PASS | DATA · C 150, sheaves Ø132 at a half-angle of 11 deg, belt pitch length 582.743 (r1 = r2 = 45); r1 25 to 62.069 gives r2 62.069 to 25 and the output 0.40 to 2.48 x; at r1 30, r2 58.296 and 0.5146 x; each movable half closes 2 dr tan 11 deg from its open stop (14.41 over the range) |
| K7 | PASS | DATA · drivers input (rotary) · input kind declared with its driven joint |
| K8 | PASS | AUTO / DATA · every joint declared with type, bodies, origin and axis; nothing inferred |
| K9 | PASS | DATA · one rotary driver; the ratio is a param control (r1), never swept by itself |
| K10 | PASS | AUTO / DATA · one closure, no branch to choose; design choices declared |
| K11 | PASS | AUTO · mobility counted 4, dof 1 |
| K12 | PASS | DATA · every traced, overlaid and claimed point and quantity is named in kin |
| T1 | PASS | HAND · mechanics first, no use context in the teaching strings; the principle reads at the default view |
| T2 | PASS | HAND · review before the build (E2) and again on the six phases of the finished build; decisions in the record |
| T3 | PASS | DATA · principle parts declared; drawn whole, in depth order |
| T4 | PASS | DATA · fired: trace-marks (no solids) · a mark on each fixed half with a tick every 30 deg of input: the output's ticks close up at 0.515 x |
| T5 | PASS | DATA · both pitch circles at their solved radii and the centre distance |
| T6 | PASS | HAND / DATA · the ratio in the two tick rows and the pitch circles; section A-A shows the movable halves' shift |
| T7 | PASS | DATA · DIMETRIC: both pairs of sheaves, their faces and the belt; FRONT shows the radii, PLAN and A-A the V's |
| T8 | PASS | DATA · section A-A through both shaft axes, the movable halves highlighted: each V edge-on with the belt's elements at their radii |
| T9 | PASS | AUTO / DATA · claim table: 3 ok, 0 off, 0 uncheckable of 3 |
| T10 | PASS | AUTO · 26 solids drawn see-through: O1-pb-b0-ped, O1-pb-b0, O1-pb-b0-brg, O1-pb-b0-brg-balls, O1-pb-b0-brg-cage, O1-pb-b0-cl0, O1-pb-b0-cl1, O1-pb-b0-col0 · the pillow blocks drawn see-through where they cover the sheave halves in plan |
| T11 | N/A | AUTO · 2 supports routed, 0 moved off a sweep · no support moved: the pillow blocks stand past the sheaves |
| T12 | PASS | HAND · 170 support solids; dropped by the polish: none |
| T13 | N/A | DATA · nothing goes by in a blink |
| T14 | PASS | HAND / DATA · the input and the ratio (r1) are the two controls |
| T15 | PASS | HAND · labels state the mechanism, never its use |
| T16 | N/A | HAND / STYLE · no two parts of one role to tell apart |
| T17 | PASS | AUTO · depth peeling, no depth bias (renderer test) |
| D1 | PASS | HAND · conical sheave halves revolved at 11 deg, hubs and a long sleeve on each movable half (a fork groove on the input's, a spring seat on the output's); push-belt elements with flanks at the sheave angle; keys, collar, spring, fork, carriage and rail |
| D2 | PASS | HAND · material where the load runs, bosses round every pin |
| D3 | PASS | STYLE · STYLE: roles by pattern and tone (both sheets) |
| D4 | PASS | AUTO · fired: base (3 solids), feet (4 solids) · base corners and feet concentric (base, feet rules) |
| D5 | PASS | AUTO / HAND · two pillow blocks per shaft, one shift rail, one motor plate |
| D6 | PASS | HAND / STYLE · hardware quieter than the parts, still readable (both sheets) |
| D8 | PASS | AUTO / HAND · every solid a profile, an operation and a frame; built by Manifold; no layers, dz or twin |
| D9 | PASS | AUTO / HAND · fired: j12-cvt (230 solids) · 150 belt elements conveyed round a live loop whose radii and plane follow the ratio (D9); the spring's turns stretched between the movable half and its collar |
| D10 | PASS | AUTO · profiles shipped for plain extrusions, revolutions and sweeps, meshes only for booleans (package v2) |
| D11 | PASS | AUTO · SOLID: 0 of 268 solids unsound |
| D7 | PASS | HAND · the sheave halves plain cones; richness in the belt's elements, the spring and the shift |
| A1 | PASS | AUTO · O1 J10, O2 J10, shift J5, belt J12, drive drive · every joint read from the record and built by its kit |
| A2 | PASS | AUTO · O1 J10, O2 J10, shift J5, belt J12, drive drive · both shafts live in pillow blocks (J10); the movable halves slide on sliding keys; the belt by J12 |
| A3 | PASS | AUTO · fired: classify (6 solids), axial stack builder · bores from the catalogue; bearings where a boss fits them |
| A4 | PASS | AUTO · fired: j1-dead-axle (no solids), axial stack builder · stepped shafts with shoulders, grooves, flats and chamfered ends (H.shaft) |
| A5 | PASS | AUTO · fired: j2-live-shaft (no solids), j10-shaft-in-plan (no solids), axial stack builder · feather keys by shaft size (6 x 6 on Ø20), a Ø12 keyed journal for the drive pulley |
| A6 | PASS | AUTO · fired: j5-slide (no solids), j13-compliant (no solids), standoffs (no solids) · the shift carriage straddles a ground rail screwed and dowelled to the base; the movable halves are guided by the shafts |
| A7 | PASS | AUTO · fired: base (3 solids), feet (4 solids) · base 8 mm under the lowest part, counterbored corner holes, feet, engraved scale and paths, shaft clearance holes |
| A8 | PASS | AUTO · fired: fasteners (32 solids) · stage 3 fasteners: shanks, clearance and tapped holes |
| A9 | PASS | AUTO / HAND · fired: placement solver · each shaft carried both sides of its sheave pair |
| A10 | PASS | HAND · fired: placement (10 solids), placement solver · the belt's plane moves by half the movable halves' shift, the same way on both shafts (they sit on opposite sides): the belt stays in line within 0.4 mm over the range |
| A11 | PASS | AUTO / HAND · fired: j12-flexible (no solids), strap-sheave (no solids), j1-dead-axle (no solids) · load paths closed: every joint note says where its load goes to ground |
| A12 | PASS | AUTO · clamp check clean |
| A13 | PASS | AUTO / HAND · 272 solids, 221 unnamed (further items of a listed set) · named hardware with catalogue sizes and materials |
| A14 | PASS | AUTO / HAND · fired: support router · supports routed against the sweeps (least gap 1.5 mm); details checked by A15 |
| A15 | PASS | AUTO · clearance in 3D over 72 phases: 0 clashes; hand allow: 0 named, 0 unnecessary |
| A16 | PASS | HAND · 5 joint notes; no note: none; no badge: none · a note per joint with its badge; build rules: the movable halves on opposite sides keep the belt in line; the input's half set by the fork and clamped; the output's half closed by its spring |
| A17 | PASS | HAND · assembles in the explode order; every screw reachable; pressed bearings pullable through their bores |
| A18 | PASS | AUTO · placement: 3 slabs in the tallest stack (103.0 mm), 0 clevises; stack per joint in the Joints table · the sheave halves stand where their joints put them; the drive's parts on their own slabs |
| A19 | PASS | AUTO · 2 supports routed (0 moved), least gap 1.5 mm; still covering a principle part, drawn see-through: O1-pb, O2-pb · both pillow blocks routed; see-through where they cover a sheave half in plan |
| A20 | PASS | AUTO · support per joint: O1 pillow, O2 pillow · one axial stack builder with its support selector |
| A21 | PASS | AUTO · kit per joint: O1 J10, O2 J10, shift J5, belt J12, drive drive |
| A22 | PASS | AUTO · fired: stops (no solids), adjustable-length (no solids), cable-clip (2 solids) · cable clips on the drive's lead |
| E1 | PASS | AUTO · every solid has one explode level; levels -10 to 7 · one level per solid; the spring's turns stretch between their ends |
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
| J5 | PASS | AUTO · fired: piston-bore (no solids), j5-slide (no solids), tongue-slot (no solids) · the shift carriage on its rail, clamped (F7); the movable halves' slides are the shafts' sliding keys |
| J6 | N/A | AUTO · fired: j6-mesh (no solids), friction-contact (no solids), ring-rollers (no solids) · no parallel mesh |
| J7 | N/A | AUTO · fired: groove-cam (no solids), j7-cam (no solids), pallet-contact (no solids), pawl-tooth (no solids) · no cam |
| J8 | N/A | AUTO · fired: j12-flexible (no solids), j8-belt (no solids) · a push belt in V sheaves (J12); the drive belt is V4 |
| J9 | N/A | AUTO · fired: j9-crossed-mesh (no solids) · no crossed mesh |
| J10 | PASS | AUTO · fired: j12-cvt (230 solids), j10-shaft-in-plan (no solids), j11-screw (no solids) · both shafts in plan in two pillow blocks past the sheave pair and the movable half's travel; fixed halves keyed, the input's drive end a keyed journal |
| J12 | PASS | AUTO · fired: j12-flexible (no solids), j12-cvt (230 solids), j12-other (no solids), strap-sheave (no solids) · a push belt between two variable sheave pairs: the elements conveyed on a live loop; the input's V set by the shift fork, the output's closed by its spring; the belt's length held by the variator block |
| J13 | N/A | AUTO · fired: j13-compliant (no solids) · no compliant joint |
| J11 | N/A | AUTO · fired: j11-screw (no solids) · no screw |
| F1 | PASS | AUTO · served at O1, O2, shift; fired: j2-live-shaft (no solids), j10-shaft-in-plan (no solids), strap-sheave (no solids), j13-compliant (no solids) · pillow blocks and the shift rail dowelled |
| F2 | PASS | AUTO · served at O1, O2; fired: j12-flexible (no solids), j2-live-shaft (no solids), j10-shaft-in-plan (no solids), cross-bearings (no solids), trunnion (no solids), fork-pin (no solids), ring-hub (no solids), ring-rollers (no solids), strap-sheave (no solids), j11-screw (no solids), j13-compliant (no solids) · bearings circlipped in the pillow blocks; the collar pinned |
| F3 | PASS | AUTO · served at O1, O2; fired: j12-flexible (no solids), j2-live-shaft (no solids), j10-shaft-in-plan (no solids), j11-screw (no solids) · the fixed halves keyed; the movable halves turn with the shafts on sliding keys |
| F4 | PASS | AUTO / HAND · served at O1, O2; fired: j9-crossed-mesh (no solids), j2-live-shaft (no solids), j10-shaft-in-plan (no solids), trunnion (no solids), j11-screw (no solids) · the shafts located in one block each; the belt's axial push taken by the fixed halves' keys and the collar |
| F5 | PASS | AUTO / HAND · served at no joint; fired: j5-slide (no solids), pawl-tooth (no solids), j11-screw (no solids), j13-compliant (no solids), stops (no solids) · the movable halves stop at their open stops and closed limits (the variator's range); the carriage's rail ends |
| F6 | N/A | AUTO / HAND · served at belt; fired: friction-contact (no solids), j12-flexible (no solids), j12-cvt (230 solids), trunnion (no solids), j7-cam (no solids), pallet-contact (no solids), pawl-tooth (no solids) · no rest position to hold: the drive positions every part |
| F7 | PASS | AUTO / HAND · served at shift, belt; fired: j6-mesh (no solids), friction-contact (no solids), j9-crossed-mesh (no solids), j12-flexible (no solids), j12-cvt (230 solids), j5-slide (no solids), j12-other (no solids), adjustable-length (no solids) · the shift carriage clamped at its setting by a screw; a scale on the base reads r1 |
| F8 | PASS | AUTO · served at no joint; fired: j12-flexible (no solids), cross-bearings (no solids), tongue-slot (no solids), j11-screw (no solids), lubrication (no solids) · sealed bearings; the sliding keys greased |
| F9 | N/A | AUTO / HAND · served at no joint; fired: j6-mesh (no solids), j9-crossed-mesh (no solids), timing-marks (1 solid) · nothing to time: a friction drive |
| F10 | PASS | AUTO / HAND · served at drive; fired: j12-flexible (no solids), drive (30 solids), yoke-drive (no solids) · home flag and fork sensor on the input (drive) |
| M1 | PASS | AUTO · fired: hardware primitives · top-face chamfers by part kind (primitives) |
| M2 | N/A | HAND · no large part starts and stops with the motor |
| M3 | PASS | AUTO · fired: j3-moving-pin (no solids), hardware primitives · bore entry chamfers |
| M4 | PASS | AUTO / HAND · fired: base (3 solids), fasteners (32 solids) · counterbores and countersinks for heads (base, csk, housings) |
| M5 | PASS | AUTO / HAND · fired: hardware primitives · cutter radii on windows and slots |
| M6 | PASS | AUTO · edge distance and walls clean |
| M7 | N/A | HAND · no bracket corner turns a load |
| M8 | PASS | AUTO · fired: j1-dead-axle (no solids) · thread undercuts on stepped shafts |
| M9 | PASS | AUTO / HAND · fired: j1-dead-axle (no solids) · ISO coarse threads, engagement through the tapped part or to a nut |
| M10 | PASS | AUTO / HAND · 267 of 272 solids name a material · materials named by kind and role |
| M11 | PASS | AUTO · fired: j1-dead-axle (no solids), hardware primitives · centre holes, chamfered ends on turned parts |
| M12 | PASS | HAND · every screw reachable by its key in the explode |
| M13 | PASS | AUTO / HAND · 15 threaded · threadlocker or nyloc on every threaded fastener |
| M14 | N/A | AUTO / HAND · fired: piston-bore (no solids), j4-slot-roller (no solids), pin-lobe (no solids), groove-cam (no solids), pallet-contact (no solids), tongue-slot (no solids) · no sliding contact needing a liner |
| V1 | PASS | AUTO · fired: drive (30 solids), yoke-drive (no solids) · pancake motor beside the input shaft, GT2 32:16 to its keyed journal |
| V2 | PASS | AUTO · fired: drive (30 solids), yoke-drive (no solids) · one angle bracket: upright and foot |
| V3 | PASS | AUTO / HAND · fired: drive (30 solids) · belt and pulleys clear of feet and housings (A15) |
| V4 | PASS | AUTO · fired: j8-belt (no solids) · flanged pulleys, belt in one plane |
| V5 | PASS | AUTO · fired: drive (30 solids), yoke-drive (no solids) · rotary input: belt to the input's journal |
| V6 | PASS | AUTO · fired: drive (30 solids), yoke-drive (no solids), cable-clip (2 solids) · home flag, fork sensor, terminals, lead and clip |
| L1 | PASS | STYLE · STYLE: no look values in the record or polish |
| L2 | PASS | HAND · records and polish carry no look |
| L3 | PASS | HAND · roles right on every solid (both sheets) |
| L4 | PASS | HAND / STYLE · one accent: the input ring, the traces |
| L5 | PASS | AUTO / HAND · fired: see-through (26 solids) · transparency and hidden lines show screws in holes and bearings in bores |
| L6 | PASS | AUTO · depth peeling at every view (shots) |
| L7 | PASS | STYLE · STYLE: turntable orbit, named views, no perspective |
| L8 | PASS | AUTO / HAND · fired: trace-marks (no solids) · centrelines along every joint axis, base dimensions, engraved marks |
| L9 | PASS | AUTO / DATA · section A-A checked in both sheets |
| L10 | PASS | AUTO / STYLE · teaching overlays in the sheet's look |
| R1 | PASS | HAND · every standard part from the primitives and kits |
| R2 | PASS | HAND · standard sizes only |
| R3 | PASS | AUTO · fired: hardware primitives · shared subassemblies, one function each |
| R4 | PASS | AUTO · package v2 36.0 KB · package v2 written at build time |
| R5 | PASS | HAND · the polish states only exceptions, no sampling |
| R6 | PASS | FLAG · FLAG: bench run (desktop): setup 41.2 ms over the 20 ms target (272 solids, 150 belt elements); frames 1.6 to 2.4 ms; the phone is measured by David |
| R7 | PASS | HAND / FLAG · polish none; 0 solids added, 0 overrides by the polish |
| R8 | PASS | AUTO / SITE · SITE: thumbnails pre-rendered, cards animate on hover |
| R9 | PASS | AUTO / SITE · setup and bake in the worker, one context |
| R10 | PASS | FLAG · FLAG: the bench page is built for the phone measurement |
| DL1 | PASS | AUTO / HAND · 36 of 272 solids on a dropping rung · every solid, mark and effect on a rung by its kind |
| DL2 | PASS | HAND · default dial: full |
| DL3 | PASS | AUTO · view-aware exceptions in the ladder table |
| DL4 | PASS | SITE · SITE: adaptive dial with hysteresis |
| DL6 | PASS | AUTO · teaching layers drawn at every dial position |
| DL5 | PASS | FLAG · FLAG: bench reports frame time per dial position |
| Q1 | PASS | check, clamp and edge distance clean |
| Q2 | PASS | 0 clashes, 0 unnecessary allows |
| Q3 | PASS | package v2 written, 36.0 KB; site build not checked here · package v2 written; site builds (npm run build) |
| Q4 | PASS | local: tools/shot · dist/shots3/cvt-belt: record view, PLAN, FRONT, SIDE, ISOMETRIC, the declared views, full explode, both sheets |
| Q5 | PASS | local: tools/bench · tools/bench run: dist/bench/report-v2.md |
| Q6 | PASS | every row judged |
| Q7 | PASS | at 3.0 |
| Q8 | PASS | teaching review: tweak (2026-10-20); the six phases of the finished build are looked at by eye · verdict and decisions in the record and the teaching: line; six phases of the finished build looked at |

## Joints
| Joint | Kit | Block | Support | Stack | F1 locate | F2 retain | F3 torque | F4 thrust | F5 limit | F6 hold | F7 adjust | F8 lube | F9 timing | F10 protect |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| O1 | J10 | variator | pillow | – | 4 x Dowel pin Ø4 x 14 h6, block to base | 2 x Internal circlip DIN 472, Ø32 | Feather key 6 x 6, the fixed half to its shaft; Sliding feather key 6 x 6, screwed into the shaft: the movable half slides on it | 2 x Shaft collar 20x28, set screw | none | none | none | none | none | none |
| O2 | J10 | variator | pillow | – | 4 x Dowel pin Ø4 x 14 h6, block to base | 2 x Internal circlip DIN 472, Ø32 | Feather key 6 x 6, the fixed half to its shaft; Sliding feather key 6 x 6, screwed into the shaft: the movable half slides on it | 2 x Shaft collar 20x28, set screw | none | none | none | none | none | none |
| shift | J5 | – | – | – | Dowel pin Ø3 h6, rail to base | none | none | none | none | none | Clamp screw M5, locks the carriage on the rail at its setting (F7) | none | none | none |
| belt | J12 | – | – | – | none | none | none | none | none | Compression spring, wire Ø3, 7 turns round the sleeve: pushes the output's movable half closed | Clamp screw M5, locks the carriage on the rail at its setting (F7) | none | none | none |
| drive | drive | – | – | – | none | none | none | none | none | none | none | none | none | Home flag, 1 mm steel vane; Fork sensor, slotted optical, 5 mm gap |

## Supports
| Support | Joint | Kind | Route | Least gap mm | Covers | T10 |
|---|---|---|---|---|---|---|
| O1-pb | O1 | pillow | first choice | 1.5 | in-fixed, in-movable | – |
| O2-pb | O2 | pillow | first choice | 1.5 | out-fixed, out-movable | – |

## Variants and overrides
| Joint or part | Rule result | Chosen | Why |
|---|---|---|---|

## Detail ladder
| Rung | Solids | Marks | Frame ms at this dial position |
|---|---|---|---|
| DL-A | 9 | 0 | 2.18 |
| DL-B | 0 | 296 | 2.28 |
| DL-C | 0 | 0 | 2.19 |
| DL-D | 4 | 0 | 2.41 |
| DL-E | 8 | 0 | 2.2 |
| DL-F | 0 | 0 | 1.99 |
| DL-G | 0 | 0 | 2.2 |
| DL-H | 15 | 0 | 2.17 |
| never | 232 | 156 | 2.26 |

## Promotion candidates
None left: the variator (the belt's length held, the sheave shifts) is a kin block; sheave halves, the sliding keys, the spring, the shift fork and the push belt on a live loop are the J12 CVT rule of the builder.

## Verification
check: clean · K1 residual: 2.8e-14 · claims: 3 of 3 ok · clearance: 0 clashes · clamp: clean · edge distance: clean · package: 34.8 KB
screenshots: dist/shots3/cvt-belt (record view, PLAN, FRONT, SIDE, ISOMETRIC, explode, section A-A; both sheets); clearance also posed at both ratio limits (r1 25 and 62.069): 0 clashes · bench: dist/bench/report-v2.md (desktop; phone by David)
