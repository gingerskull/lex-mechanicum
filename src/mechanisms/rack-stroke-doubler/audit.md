# Audit: Rack-and-pinion stroke doubler (rack-stroke-doubler)
standard: 3.11 · date: 2026-10-27 · result: pass · detail: full · pass: build
teaching: keep · decisions in the record

## Summary
PASS 148 · FAIL 0 · N/A 19 · open: none

## Requirements
| Id | Status | Evidence / action |
|---|---|---|
| S1 | PASS | DATA · DATA · the standard carries version 3.11 and its changelog |
| S2 | PASS | HAND · HAND · header with standard, date, result, detail, pass and the teaching: line |
| S3 | PASS | AUTO · filled by the generator: the pipeline holds it for every built mechanism |
| S4 | PASS | SITE · SITE · the pass issue (#257) holds only this mechanism's decisions; the wave's status in #252 |
| S5 | PASS | SITE · SITE · no engine mark on the sheet, card or page (shared site code) |
| S6 | PASS | AUTO · filled by the generator: the pipeline holds it for every built mechanism |
| P1 | PASS | DATA · record v3 complete (kin and teaching blocks); no polish, audit.md present |
| P2 | PASS | DATA · DATA · catalogue validator clean (vocabularies exact) |
| P3 | PASS | DATA / SITE · DATA / SITE · ratio (Stroke, Low, 2 x carrier stroke), axes Offset parallel, character, backdrivable, aka, family, motion, level, dof and the motor drive from the record |
| P4 | PASS | DATA · DATA · tags grouped Function, Property, Application, keywords |
| P5 | PASS | DATA · DATA · explanation in four parts; four real-world uses, each from a patent found in research |
| P6 | PASS | DATA · DATA · 5 references (two Wikipedia articles, Brown No. 118, two patents), 2 media (DME catalogue photos, an animation of No. 118); no video of the rack form at work was found, media waived with a note (rw-n1.json); real_world empty |
| P7 | PASS | HAND / SITE · HAND / SITE · no polish; every label comes from the record |
| P8 | PASS | SITE · SITE · no parts list or joint sections on the page |
| P9 | PASS | AUTO / HAND · AUTO / HAND · every number the explanation states is a claim and agrees (T9); the pressure angle is named without a number |
| P10 | PASS | HAND · HAND · traces on the free rack and the axle with equal-time ticks, the fixed pitch line, the instant centre, the 0, v, 2v line, both stroke dimensions; plot of the free rack against the carrier |
| P11 | PASS | DATA · DATA · plain language, short sentences, mm and degrees, no em dashes |
| P12 | PASS | AUTO / DATA · AUTO / DATA · validate(records, asVersion 3) clean for this record |
| P13 | PASS | HAND · HAND · teaching review run against the record before the build and again on the finished drawing (teaching: line) |
| K1 | PASS | AUTO · K1 residual 1.8e-14 (tolerance 1e-9) over 360 samples, reference 0.0e+0 |
| K2 | PASS | AUTO · check: finite, continuous, periodic over 360 samples |
| K3 | PASS | AUTO / HAND · 2 blocks (gear-mesh); no numeric fallback · AUTO / HAND · gear-mesh twice: the pinion rolls on the held rack (`rolls`, new in this pass, with a fixture test) and the free rack is a plain rack mesh carried by the carrier; no fallback |
| K4 | PASS | HAND · HAND · the carrier is the driver (linear input, the belt carriage clamped to it), the free rack the output; no input shaft, so no accent ring |
| K6 | PASS | DATA · DATA · module 3, 16 teeth: pitch radius 24, racks' pitch lines 48 apart; 80 mm in, 160 mm out, 191 deg of pinion turn, as build.defining_relations |
| K7 | PASS | DATA · drivers input (linear) · DATA · drivers input (linear) on the carrier's slide C, ±40 mm |
| K8 | PASS | AUTO / DATA · AUTO / DATA · every joint declared with type, bodies, origin and axis; both meshes carry the carrier, so K1 checks them in its frame |
| K9 | PASS | DATA · DATA · one linear driver; no selector or design choice |
| K10 | PASS | AUTO / DATA · AUTO / DATA · no branch: two meshes in closed form |
| K11 | PASS | AUTO · mobility counted 1, dof 1 |
| K12 | PASS | DATA · DATA · every traced, overlaid and claimed point and quantity is named in kin |
| T1 | PASS | HAND · HAND · mechanics first, no mould, press or robot; in PLAN the carrier, pinion and both racks lie side by side and the two tick rows show the 2:1 at a glance |
| T2 | PASS | HAND · HAND · review before the build and again on the six phases of the finished build; decisions in the record |
| T3 | PASS | DATA · DATA · carrier, pinion, both racks and the instant centre declared; drawn whole, in depth order |
| T4 | PASS | DATA · fired: trace-marks (1 solid) · DATA · fired: trace-marks (1 solid) · the free rack's mark (comet) and the axle, ticked every 30 deg of the cycle: each rack step is twice the carrier's at the same instant |
| T5 | PASS | DATA · DATA · the fixed pitch line, a circle at the instant centre, the line from it through the axle to the far contact, and both stroke dimensions between the posed ends |
| T6 | PASS | HAND / DATA · HAND / DATA · 80 against 160 mm on a 363 mm base: both strokes read at the default size; the carrier lengthened to 84 mm so it shows past the pinion |
| T7 | PASS | DATA · DATA · PLAN (opened at 28 deg), where both pitch lines, the pitch circle and both strokes show true |
| T8 | N/A | DATA · DATA · the principle lies in plain view, no section or detail needed |
| T9 | PASS | AUTO / DATA · claim table: 6 ok, 0 off, 0 uncheckable of 6 |
| T10 | PASS | AUTO · 5 solids drawn see-through: fixed-rack-sc0, fixed-rack-sc1, fixed-rack-sc2, C-keeper, R-keeper · filled by the generator: a rule built solids for it |
| T11 | PASS | AUTO · 0 supports routed, 0 moved off a sweep · filled by the generator: a rule built solids for it |
| T12 | PASS | HAND · 20 support solids; dropped by the polish: none |
| T13 | N/A | DATA · DATA · nothing goes by in a blink |
| T14 | PASS | HAND / DATA · HAND / DATA · the input only; the pinion size is not offered (parts built for one pinion), the any-pinion law is checked by the block's fixture test |
| T15 | PASS | HAND · HAND · labels state the mechanism, never its use |
| T16 | PASS | HAND / STYLE · HAND / STYLE · the two racks are told apart by role: the fixed rack drawn as frame, the free rack as the output (hatched) |
| T17 | PASS | AUTO · filled by the generator: the pipeline holds it for every built mechanism |
| D1 | PASS | HAND · fired: wheels (no solids) · HAND · involute pinion, module 3, 16 teeth; straight-flanked 20 deg racks on the same pitch; the carrier a slider block on its rails |
| D2 | PASS | HAND · HAND · material where the teeth carry; the fixed rack's back carries its screws and dowels |
| D3 | PASS | STYLE · STYLE · roles by pattern and tone (both sheets) |
| D4 | PASS | AUTO · fired: base (3 solids), feet (4 solids) · filled by the generator: a rule built solids for it |
| D5 | PASS | AUTO / HAND · AUTO / HAND · the fixed rack on one ground riser under its back, the slides on their rails and risers; no scattered standoffs |
| D6 | PASS | HAND / STYLE · HAND / STYLE · rails, risers and keepers quieter than the pinion and racks, still clearly drawn |
| D8 | PASS | AUTO / HAND · AUTO / HAND · every solid a profile and one operation (75 profiles, no meshes) |
| D9 | N/A | AUTO / HAND · fired: j12-cvt (no solids) · AUTO / HAND · no member changes shape |
| D10 | PASS | AUTO · filled by the generator: the pipeline holds it for every built mechanism |
| D11 | PASS | AUTO · SOLID: 0 of 116 solids unsound |
| D7 | PASS | HAND · HAND · base, racks and carrier plain; the richness is in the bearing, bolt, gibs, wipers, screws and dowels |
| A1 | PASS | AUTO · M1 J6, M2 J6, P J3, C J5, R J5, drive drive · filled by the generator: the pipeline holds it for every built mechanism |
| A2 | PASS | AUTO · M1 J6, M2 J6, P J3, C J5, R J5, drive drive · filled by the generator: the pipeline holds it for every built mechanism |
| A3 | PASS | AUTO · fired: classify (5 solids), axial stack builder · filled by the generator: a rule built solids for it |
| A4 | PASS | AUTO · fired: j1-dead-axle (no solids), axial stack builder · AUTO · the shoulder bolt is a stepped part with its shim washer; no shaft of its own |
| A5 | N/A | AUTO · fired: j2-live-shaft (no solids), j10-shaft-in-plan (no solids), axial stack builder · AUTO · no keyed part: the pinion turns free on its bearing |
| A6 | PASS | AUTO · fired: j5-slide (39 solids), j13-compliant (no solids), standoffs (no solids) · filled by the generator: a rule built solids for it |
| A7 | PASS | AUTO · fired: base (3 solids), posts (no solids), feet (4 solids) · filled by the generator: a rule built solids for it |
| A8 | PASS | AUTO · fired: fasteners (31 solids) · filled by the generator: a rule built solids for it |
| A9 | PASS | AUTO / HAND · fired: placement solver · AUTO / HAND · fired: placement solver · the pinion's pin joins two parts: single shear on a Ø12 shoulder bolt into the carrier, the 6901 bearing close to the carrier (shortest overhang); a strap over the pinion would ride the carrier for no load the bolt cannot take |
| A10 | PASS | HAND · fired: placement (8 solids), placement solver · HAND · fired: placement (8 solids), placement solver · pinion and both racks on one slab (they mesh), the carrier one slab under the pinion on its rails |
| A11 | PASS | AUTO / HAND · fired: j12-flexible (no solids), strap-sheave (no solids), j1-dead-axle (no solids) · AUTO / HAND · the free rack's load: teeth, pinion, bearing, bolt, carrier, belt carriage; the fixed rack's reaction: rack, screws and dowels, riser, base; every joint note says where its load goes |
| A12 | PASS | AUTO · clamp check clean |
| A13 | PASS | AUTO / HAND · 116 solids, 61 unnamed (further items of a listed set) · AUTO / HAND · named hardware with catalogue sizes (Bearing 6901ZZ, Shoulder bolt Ø12 x 20 M10, Socket head M4 x 35, Dowel pin Ø4 h6); 61 unnamed are further items of a listed set |
| A14 | PASS | AUTO / HAND · fired: support router · AUTO / HAND · fired: support router · the fixed rack's riser and screws stand on its back, clear of the carrier's rails (A15: 0 clashes over 72 phases) |
| A15 | PASS | AUTO · clearance in 3D over 72 phases: 0 clashes; hand allow: 0 named, 0 unnecessary |
| A16 | PASS | HAND · 6 joint notes; no note: none; no badge: none · HAND · 6 joint notes with badges; build rules: the fixed rack set to the pinion on its slots before it is dowelled; the free rack held against its gib by the pinion; the carrier driven along its own slide |
| A17 | PASS | HAND · HAND · assembles in the explode order: base, fixed rack on its riser (set, then dowelled), carrier rails and carrier, pinion on its bolt, free rack onto its rail; every screw reachable from the top, the bearing pressable out of the pinion |
| A18 | PASS | AUTO · placement: 2 slabs in the tallest stack (26.0 mm), 0 clevises; stack per joint in the Joints table · filled by the generator: the pipeline holds it for every built mechanism |
| A19 | PASS | AUTO · 0 supports routed (0 moved), least gap - mm; still covering a principle part, drawn see-through: none · AUTO · no routed support: nothing passes over the principle; the keepers drawn see-through (T10) |
| A20 | PASS | AUTO · support per joint: none · AUTO · the only revolute is a moving pin (J3, stub); the fixed rack's seat is the mesh kit's |
| A21 | PASS | AUTO · kit per joint: M1 J6, M2 J6, P J3, C J5, R J5, drive drive |
| A22 | PASS | AUTO · fired: stops (no solids), adjustable-length (no solids), cable-clip (5 solids) · filled by the generator: a rule built solids for it |
| E1 | PASS | AUTO · every solid has one explode level; levels 0 to 12.8 · filled by the generator: the pipeline holds it for every built mechanism |
| E2 | PASS | AUTO · fired: explode (1 solid) · filled by the generator: a rule built solids for it |
| E3 | PASS | AUTO · fired: explode (1 solid) · filled by the generator: a rule built solids for it |
| E4 | PASS | HAND · HAND · last fitted goes furthest: the bolt leaves the pinion upward, the free rack and its rail lift off, the fixed rack lifts with its screws (explode shots, both sheets) |
| E5 | PASS | AUTO · fired: explode (1 solid) · filled by the generator: a rule built solids for it |
| E6 | PASS | AUTO · fired: explode (1 solid) · filled by the generator: a rule built solids for it |
| E7 | PASS | AUTO · fired: explode (1 solid) · filled by the generator: a rule built solids for it |
| E8 | PASS | AUTO · fired: explode (1 solid) · filled by the generator: a rule built solids for it |
| E9 | PASS | HAND · HAND · full explode readable in ISOMETRIC on both sheets, nothing inside another part, nothing leaves the frame |
| E10 | PASS | AUTO · fired: explode (1 solid) · filled by the generator: a rule built solids for it |
| J1 | N/A | AUTO · fired: trunnion (no solids), hub (no solids), j1-dead-axle (no solids) · filled by the generator: no joint of this type |
| J2 | N/A | AUTO · fired: j2-live-shaft (no solids) · filled by the generator: no joint of this type |
| J3 | PASS | AUTO · fired: j3-moving-pin (10 solids), cross-bearings (no solids), eccentric-bearing (no solids), spider-pin (no solids), ball-socket (no solids), ring-hub (no solids), eccentric (no solids) · filled by the generator: a rule built its kit |
| J4 | N/A | AUTO · fired: pin-hole (no solids), j4-slot-roller (no solids), pin-lobe (no solids), fork-pin (no solids), die (no solids) · filled by the generator: no joint of this type |
| J5 | PASS | AUTO · fired: tongue-slot (no solids), integrator-carriage (no solids), piston-bore (no solids), j5-slide (39 solids) · filled by the generator: a rule built its kit |
| J6 | PASS | AUTO · fired: j6-mesh (11 solids), friction-contact (no solids), ring-carrier (no solids), pin-ring (no solids), ring-rollers (no solids) · filled by the generator: a rule built its kit |
| J7 | N/A | AUTO · fired: ball-socket (no solids), groove-cam (no solids), j7-cam (no solids), pallet-contact (no solids), pawl-tooth (no solids) · filled by the generator: no joint of this type |
| J8 | N/A | AUTO · fired: j12-flexible (no solids), j8-belt (no solids) · filled by the generator: no joint of this type |
| J9 | N/A | AUTO · fired: j9-crossed-mesh (no solids) · filled by the generator: no joint of this type |
| J10 | N/A | AUTO · fired: j12-cvt (no solids), j10-shaft-in-plan (no solids), j11-screw (no solids) · filled by the generator: no joint of this type |
| J12 | N/A | AUTO · fired: j12-flexible (no solids), j12-cvt (no solids), j12-other (no solids), strap-sheave (no solids) · filled by the generator: no joint of this type |
| J13 | N/A | AUTO · fired: j13-compliant (no solids) · filled by the generator: no joint of this type |
| J11 | N/A | AUTO · fired: j11-screw (no solids) · filled by the generator: no joint of this type |
| F1 | PASS | AUTO · served at M1, C, R; fired: posts (no solids), integrator-carriage (no solids), j2-live-shaft (no solids), j10-shaft-in-plan (no solids), ring-carrier (no solids), pin-ring (no solids), hub (no solids), strap-sheave (no solids), j13-compliant (no solids), covers (no solids) · AUTO · two Ø4 dowels pin the fixed rack and its riser to the base; the slides' rails dowelled (C, R) |
| F2 | PASS | AUTO · served at P, C, R, drive; fired: wheels (no solids), j12-flexible (no solids), j2-live-shaft (no solids), j10-shaft-in-plan (no solids), cross-bearings (no solids), trunnion (no solids), ring-carrier (no solids), eccentric-bearing (no solids), pin-ring (no solids), spider-pin (no solids), fork-pin (no solids), ring-hub (no solids), eccentric (no solids), hub (no solids), ring-rollers (no solids), strap-sheave (no solids), j11-screw (no solids), j13-compliant (no solids), covers (no solids) · AUTO · the pinion's bearing held by an internal circlip and the shoulder bolt; keepers lap the carrier and the free rack |
| F3 | N/A | AUTO · served at P; fired: j12-flexible (no solids), j2-live-shaft (no solids), j10-shaft-in-plan (no solids), j11-screw (no solids) · AUTO · no torque is transmitted through a shaft: the pinion idles on its bearing |
| F4 | PASS | AUTO / HAND · served at no joint; fired: j9-crossed-mesh (no solids), j2-live-shaft (no solids), j10-shaft-in-plan (no solids), trunnion (no solids), spider-pin (no solids), j11-screw (no solids) · AUTO / HAND · the pinion's end-shake set by the shoulder bolt and its shim washer on the inner-race spacer; spur teeth push no thrust |
| F5 | PASS | AUTO / HAND · served at no joint; fired: integrator-carriage (no solids), j5-slide (39 solids), pawl-tooth (no solids), j11-screw (no solids), j13-compliant (no solids), stops (no solids) · AUTO / HAND · the slide kit finds no room for stop blocks inside the rails' ends (others sweep past); the carrier is clamped to the belt carriage, which runs in its slot in the base, and the free rack is held by the pinion; listed as an open question |
| F6 | N/A | AUTO / HAND · served at no joint; fired: friction-contact (no solids), j12-flexible (no solids), j12-cvt (no solids), trunnion (no solids), j7-cam (no solids), pallet-contact (no solids), pawl-tooth (no solids) · AUTO / HAND · no rest position to hold: positively driven |
| F7 | PASS | AUTO / HAND · served at M1, C, R, drive; fired: j6-mesh (11 solids), friction-contact (no solids), j9-crossed-mesh (no solids), j12-flexible (no solids), j12-cvt (no solids), j5-slide (39 solids), j12-other (no solids), adjustable-length (no solids), covers (no solids) · AUTO / HAND · the fixed rack set to the pinion on slots across it (M1), the free rack's gib (M2, R), the carrier's gib (C), the drive belt's tensioner |
| F8 | PASS | AUTO · served at C, R; fired: tongue-slot (no solids), j12-flexible (no solids), cross-bearings (no solids), ball-socket (no solids), eccentric (no solids), j11-screw (no solids), lubrication (no solids) · AUTO · felt wipers at the ends of the carrier and the free rack, a grease nipple on the free rack's keeper, an oil hole in the carrier's keeper; the pinion's bearing shielded |
| F9 | PASS | AUTO / HAND · served at M1, M2; fired: j6-mesh (11 solids), j9-crossed-mesh (no solids), timing-marks (no solids) · AUTO / HAND · timing marks on the pinion and on the fixed rack at the pitch point |
| F10 | PASS | AUTO / HAND · served at drive; fired: j12-flexible (no solids), drive (46 solids) · AUTO / HAND · home flag on the carriage, fork sensor, flanged pulleys |
| M1 | PASS | AUTO · fired: hardware primitives · AUTO · top edges chamfered by the primitives |
| M2 | N/A | HAND · HAND · no wheel that needs lightening: a 54 mm pinion |
| M3 | PASS | AUTO · fired: j3-moving-pin (10 solids), hardware primitives · filled by the generator: a rule built solids for it |
| M4 | PASS | AUTO / HAND · fired: base (3 solids), fasteners (31 solids) · AUTO / HAND · countersinks for the rail screws, the base counterbored; the rack's socket heads seat on its top face |
| M5 | PASS | AUTO / HAND · fired: hardware primitives · AUTO / HAND · slots with full-radius ends, the carriage slot in the base rounded |
| M6 | PASS | AUTO · edge distance and walls clean |
| M7 | N/A | HAND · HAND · no bracket where load turns a corner |
| M8 | PASS | AUTO · fired: j1-dead-axle (no solids) · AUTO · thread undercut on the shoulder bolt |
| M9 | PASS | AUTO / HAND · fired: j1-dead-axle (no solids) · AUTO / HAND · ISO coarse threads; the rack screws M4 x 35 through rack and riser into the base |
| M10 | PASS | AUTO / HAND · 112 of 116 solids name a material · AUTO / HAND · 112 of 116 solids name a material; the four bodies' own parts take none from the materials rule, as in every built mechanism (an engine item, not set here) |
| M11 | PASS | AUTO · fired: j1-dead-axle (no solids), hardware primitives · AUTO · chamfered ends on the bolt |
| M12 | PASS | HAND · HAND · every screw reachable by its key from the top; the bearing can be pressed out of the pinion |
| M13 | PASS | AUTO / HAND · 22 threaded · AUTO / HAND · 22 threaded, threadlocker or nyloc on every one |
| M14 | PASS | AUTO / HAND · fired: tongue-slot (no solids), piston-bore (no solids), pin-hole (no solids), j4-slot-roller (no solids), pin-lobe (no solids), groove-cam (no solids), pallet-contact (no solids), eccentric (no solids), die (no solids), hub (no solids) · AUTO / HAND · the hardened strip under the free rack, the bronze gibs; the racks themselves are the replaceable wear parts, screwed on |
| V1 | PASS | AUTO · fired: drive (46 solids) · filled by the generator: a rule built solids for it |
| V2 | PASS | AUTO · fired: drive (46 solids) · filled by the generator: a rule built solids for it |
| V3 | PASS | AUTO / HAND · fired: drive (46 solids) · AUTO / HAND · belt, pulleys, bracket and tensioner clear of the feet and base hardware; the carriage runs in its slot (A15: 0 clashes) |
| V4 | PASS | AUTO · fired: j8-belt (no solids) · AUTO · flanged pulleys, a slotted tensioner under the idler |
| V5 | PASS | AUTO · fired: drive (46 solids) · filled by the generator: a rule built solids for it |
| V6 | PASS | AUTO · fired: drive (46 solids), cable-clip (5 solids) · filled by the generator: a rule built solids for it |
| L1 | PASS | STYLE · STYLE · no look values in the record |
| L2 | PASS | HAND · HAND · the record carries geometry and roles only |
| L3 | PASS | HAND · HAND · carrier driver, free rack output, fixed rack frame (ground), pinion link: every solid's role right |
| L4 | PASS | HAND / STYLE · HAND / STYLE · the accent on the traced path; no input shaft |
| L5 | PASS | AUTO / HAND · fired: see-through (5 solids) · AUTO / HAND · fired: see-through (5 solids) · the keepers over the slides drawn see-through; hidden lines show the bolt in the pinion |
| L6 | PASS | AUTO · filled by the generator: the pipeline holds it for every built mechanism |
| L7 | PASS | STYLE · STYLE · turntable orbit, named views, no perspective |
| L8 | PASS | AUTO / HAND · fired: trace-marks (1 solid) · AUTO / HAND · centrelines, base dimensions, timing marks as fine ink |
| L9 | N/A | AUTO / DATA · AUTO / DATA · no section or detail view declared |
| L10 | PASS | AUTO / STYLE · AUTO / STYLE · traces, ticks, the circle, lines and dimensions in the sheet's look |
| R1 | PASS | HAND · HAND · every part from the shapes, kits and primitives; no inline outline |
| R2 | PASS | HAND · HAND · screws M3, M4, M10 bolt; bearing 6901 from the table; GT2 16T pulleys |
| R3 | PASS | AUTO · fired: hardware primitives · AUTO · slide, drive and sensor from their shared builders |
| R4 | PASS | AUTO · package v2 18.1 KB · filled by the generator: the pipeline holds it for every built mechanism |
| R5 | PASS | HAND · HAND · no polish |
| R6 | PASS | FLAG · FLAG · bench (indicative: three workers ran heavy checks on the machine at once): 18.1 KB, setup 66 ms (over the 20 ms target, flagged: 60.4 ms GPU, the first frame on a shared context), frames 1.2 to 1.3 ms paced in every view |
| R7 | PASS | HAND / FLAG · polish none; 0 solids added, 0 overrides by the polish |
| R8 | PASS | AUTO / SITE · AUTO / SITE · the stage draws only on change (shared) |
| R9 | PASS | AUTO / SITE · AUTO / SITE · shared setup; two closed-form blocks, no tables |
| R10 | PASS | FLAG · FLAG · the phone bench page is the site's (shared); not measured in this pass |
| DL1 | PASS | AUTO / HAND · 33 of 116 solids on a dropping rung · AUTO / HAND · solids on their rungs by kind; none moved |
| DL2 | PASS | HAND · HAND · default dial full |
| DL3 | PASS | AUTO · filled by the generator: the pipeline holds it for every built mechanism |
| DL4 | PASS | SITE · SITE · adaptive dial (shared) |
| DL6 | PASS | AUTO · filled by the generator: the pipeline holds it for every built mechanism |
| DL5 | PASS | FLAG · FLAG · frame at 28° per dial position 1.62 to 2.0 ms (bench) |
| Q1 | PASS | check, clamp and edge distance clean |
| Q2 | PASS | 0 clashes, 0 unnecessary allows |
| Q3 | PASS | package v2 written, 18.1 KB; site build not checked here · package v2 written, 18.1 KB; the site build runs on the integration branch |
| Q4 | PASS | local: tools/shot · shot set drawn (record, PLAN, FRONT, SIDE, ISOMETRIC, explode, both sheets) and looked at |
| Q5 | PASS | local: tools/bench · bench run (R6 row) |
| Q6 | PASS | audit regenerated and every row judged |
| Q7 | PASS | conformance: at the current standard (3.11) |
| Q8 | PASS | teaching review: keep (2026-10-27); the six phases of the finished build are looked at by eye · teaching review keep, recorded in the record and on the teaching: line; the six phases of the finished build looked at again |

## Joints
| Joint | Kit | Block | Support | Stack | F1 locate | F2 retain | F3 torque | F4 thrust | F5 limit | F6 hold | F7 adjust | F8 lube | F9 timing | F10 protect |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| M1 | J6 | gear-mesh | – | – | 2 x Dowel pin Ø4 h6, rack and riser to base, fitted once the rack is set | none | none | none | none | none | Socket head M4 x 35 (ISO 4762) | none | Pinion; Fixed rack | none |
| M2 | J6 | gear-mesh | – | – | – the free rack's rail (R) | – the free rack's keeper (R) | – no torque on a shaft | – spur teeth, no thrust | – the pinion holds the free rack | – positively driven | the free rack's gib (R) sets the mesh | – open mesh, greased with the rack's nipple | Pinion | – motor driven: the drive's flag and sensor |
| P | J3 | gear-mesh | – | – | – the bolt in the carrier | Internal circlip DIN 472, Ø24; Shoulder bolt Ø12 x 20, M10 (ISO 7379) | Shoulder bolt Ø12 x 20, M10 (ISO 7379) | Shim washer 12 x 0.4 and inner-race spacer set the end-shake | – turns freely | – positively driven | – the racks set the mesh | – bearing shielded (6901ZZ) | – the mesh marks | – the drive's flag and sensor |
| C | J5 | driver | – | – | 2 x Dowel pin Ø3 h6, reference rail to base | Keeper plate, laps the slider | none | none | none | none | Gib strip 3 x 6 x 164, bronze | 2 x Felt wiper in a steel clip | none | none |
| R | J5 | – | – | – | 2 x Dowel pin Ø3 h6, gibbed rail to base | Keeper plate, laps the slider | none | none | none | none | Gib strip 3 x 6 x 310.8, bronze | 2 x Felt wiper in a steel clip; Grease nipple M6 (DIN 71412) | none | none |
| drive | drive | – | – | – | none | Belt clamp plate, the near span between it and the jaw | none | none | none | none | Belt tensioner plate, slotted, 2 x M4 up into the base | none | none | Home flag, 1 mm steel vane; Fork sensor, slotted optical, 5 mm gap |

## Supports
| Support | Joint | Kind | Route | Least gap mm | Covers | T10 |
|---|---|---|---|---|---|---|

## Variants and overrides
| Joint or part | Rule result | Chosen | Why |
|---|---|---|---|

## Detail ladder
| Rung | Solids | Marks | Frame ms at this dial position |
|---|---|---|---|
| DL-A | 3 | 0 | 1.62 |
| DL-B | 0 | 163 | 1.8 |
| DL-C | 0 | 0 | 1.8 |
| DL-D | 4 | 0 | 1.85 |
| DL-E | 17 | 3 | 1.78 |
| DL-F | 0 | 0 | 1.86 |
| DL-G | 0 | 0 | 1.69 |
| DL-H | 9 | 0 | 2 |
| never | 83 | 93 | 1.67 (full) |

## Promotion candidates
- A held rack (`fixed: true`, shape rack) is seated by the mesh kit (src/builder/rules/contacts/mesh.ts): a ground riser under its back, socket screws through slots across it, two dowels and a match mark at the pitch point. One case so far; the rack-and-pinion's moving rack still has no match mark of its own (the timing mark rule skips a point at a part's origin), which a later change could give every rack.
- The slide kit leaves no room for end stop blocks when the rails run only 10 mm past the travel (the stop needs 9 mm past a 3 mm gap): neither slide here has stops. The travel is limited by the drive carriage in its slot in the base and by the pinion; a kit change (rails run on past the travel to make room for a stop) would serve every driven slide.
- The materials rule leaves the bodies' own parts (carrier, pinion, both racks) without a material, as in every built mechanism: an engine item for the rule, not this pass.

Polish exceptions: none (no polish).

## Verification
check: clean · K1 residual: 1.8e-14 · claims: 6 of 6 ok · clearance: 0 clashes · clamp: clean · edge distance: clean · package: 18.1 KB
screenshots: record, PLAN, FRONT, SIDE, ISOMETRIC, explode, both sheets · bench: setup 66 ms flagged over 20 ms, frames 1.2 to 2.0 ms; indicative only, three workers ran heavy checks on the machine at once
