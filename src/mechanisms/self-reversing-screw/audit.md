# Audit: Self-reversing screw (self-reversing-screw)
standard: 3.11 · date: 2026-10-27 · result: pass · detail: full · pass: build
teaching: keep · decisions in the record

## Summary
PASS 150 · FAIL 0 · N/A 17 · open: none

## Requirements
| Id | Status | Evidence / action |
|---|---|---|
| S1 | PASS | DATA · DATA · the standard carries version 3.11 and its changelog |
| S2 | PASS | HAND · HAND · header with standard, date, result, detail, pass and the teaching: line |
| S3 | PASS | AUTO · filled by the generator: the pipeline holds it for every built mechanism |
| S4 | PASS | SITE · SITE · the pass issue (#255) holds only this mechanism's decisions; the wave's status in #252 |
| S5 | PASS | SITE · SITE · no engine mark on the sheet, card or page (shared site code) |
| S6 | PASS | AUTO · filled by the generator: the pipeline holds it for every built mechanism |
| P1 | PASS | DATA · record v3 complete (kin and teaching blocks); no polish, audit.md present |
| P2 | PASS | DATA · DATA · catalogue validator clean (family Screw, Rotary to Linear, Reciprocating, Constant velocity, Reversing, Rotary-to-along-axis) |
| P3 | PASS | DATA / SITE · DATA / SITE · ratio, axes, character, backdrivable (Partly), aka, family, motion, level, dof and the motor drive from the record |
| P4 | PASS | DATA · DATA · tags grouped Function, Property, Application, keywords |
| P5 | PASS | DATA · DATA · explanation in four parts; four uses (winch level winder, baitcasting reel, cable reels, yarn winding) |
| P6 | PASS | DATA · DATA · 5 references (Cornell Reuleaux model M6, two patents, two makers' guides; no Wikipedia article covers it, en and de checked), 3 media (lathe video, McMaster photos, Commons photo), 3 real-world videos confirmed by oEmbed |
| P7 | PASS | HAND / SITE · HAND / SITE · no polish; every label comes from the record |
| P8 | PASS | SITE · SITE · no parts list or joint sections on the page |
| P9 | PASS | AUTO / HAND · AUTO / HAND · every number the explanation states is a claim and agrees (6 of 6) |
| P10 | PASS | HAND · HAND · the shoe's centre traced with one tick per screw turn; the screw axis, a one-lead dimension and the stroke between the posed ends; plot of the shoe's position against the screw's turn (the triangle wave over 6 turns) |
| P11 | PASS | DATA · DATA · plain language, short sentences, mm and degrees, no em dashes |
| P12 | PASS | AUTO / DATA · AUTO / DATA · validate(records, asVersion 3) clean for this record |
| P13 | PASS | HAND · HAND · teaching review against the record before the build, again on the finished drawing (teaching: line) |
| K1 | PASS | AUTO · K1 residual 9.2e-14 (tolerance 1e-9) over 360 samples, reference 0.0e+0 |
| K2 | PASS | AUTO · check: finite, continuous, periodic over 360 samples |
| K3 | PASS | AUTO / HAND · 1 block (cam); no numeric fallback · AUTO / HAND · one cam block: the barrel law over 6 turns (the joint's turns), the carriage translated and the shoe swivelled by the block's shoe input; no fallback, no one-off model |
| K4 | PASS | HAND · HAND · the screw is the driver and carries the accent on its shaft end |
| K6 | PASS | DATA · DATA · lead 48 at the 14 mm pitch radius: lead angle atan(48 / 2π·14) = 28.62°; trapezoidal law over N = 3 turns, turn-round 0.5 turn each end, stroke 48 (3 − 0.5) = 120; track period 2N = 6 turns; the groove is cut from the joint's own law |
| K7 | PASS | DATA · drivers input (rotary) · DATA · drivers input (rotary, joint O, 0 to 2160°) |
| K8 | PASS | AUTO / DATA · AUTO / DATA · every joint declared with type, bodies, origin and axis; nothing inferred |
| K9 | PASS | DATA · DATA · one rotary driver; lead, turns and turn-round are built into the screw, so no control (recorded in the review) |
| K10 | PASS | AUTO / DATA · AUTO / DATA · one closure; the track repeats after 6 turns, continuous over the cycle |
| K11 | PASS | AUTO · mobility counted 2, dof 1 |
| K12 | PASS | DATA · DATA · every traced, overlaid, plotted and claimed point and quantity is named in kin |
| T1 | PASS | HAND · HAND · mechanics first; the shoe running out and back on a screw that turns one way reads in FRONT, the diamonds of the crossing grooves, the shoe swivelling at each end; no winch, reel or cable in any string |
| T2 | PASS | HAND · HAND · review before the build and again on the six phases of the finished build (shots at u 0, 1.1, 1.57 and the set); decisions in the record |
| T3 | PASS | DATA · DATA · screw, shoe, carriage and the shoe's centre declared; drawn whole, in depth order |
| T4 | PASS | DATA · fired: trace-marks (1 solid) · DATA · the shoe's centre with one tick per screw turn: ticks one lead apart in the steady runs, closer in the turn-round |
| T5 | PASS | DATA · DATA · screw axis; a one-lead dimension; the stroke between the shoe's posed ends, labelled with the 3 turns |
| T6 | PASS | HAND / DATA · HAND / DATA · 120 mm of stroke on a 170 mm screw, a 57.2° swivel at each end, 8.3 mm crossings under an 18 mm shoe: all read at the default size |
| T7 | PASS | DATA · DATA · FRONT: the screw's near side, where the grooves cross in diamonds and the shoe lies along its groove at true size |
| T8 | PASS | DATA · DATA · detail CROSSING at 4:1 where the shoe bridges a crossing at the stage's opening phase, the shoe highlighted |
| T9 | PASS | AUTO / DATA · claim table: 6 ok, 0 off, 0 uncheckable of 6 |
| T10 | PASS | AUTO · 22 solids drawn see-through: carriage-upright, O-pb-b0, O-pb-b0-brg, O-pb-b0-brg-balls, O-pb-b0-brg-cage, O-pb-b0-col0, O-pb-b0-col1, O-pb-b1 · filled by the generator: a rule built solids for it |
| T11 | PASS | AUTO · 1 support routed, 0 moved off a sweep · filled by the generator: a rule built solids for it |
| T12 | PASS | HAND · 16 support solids; dropped by the polish: none |
| T13 | N/A | DATA · DATA · the turn-round takes a sixth of the cycle (1 s at 1x); nothing goes by in a blink |
| T14 | PASS | HAND / DATA · HAND / DATA · the screw's turn (see K9) |
| T15 | PASS | HAND · HAND · labels state the mechanism, never its use |
| T16 | N/A | HAND / STYLE · HAND / STYLE · no two parts of one role to tell apart |
| T17 | PASS | AUTO · filled by the generator: the pipeline holds it for every built mechanism |
| D1 | PASS | HAND · fired: wheels (no solids) · HAND · a plain screw with its track cut by the law; the shoe a boat-shaped blade under a round boss on a pivot bolt; the carriage plate and tapered upright |
| D2 | PASS | HAND · HAND · the upright tapers from its foot to a boss at the pivot; the blade is full width where the load is, narrowing to its points |
| D3 | PASS | STYLE · STYLE · roles by pattern and tone (both sheets) |
| D4 | PASS | AUTO · fired: base (3 solids), feet (4 solids) · filled by the generator: a rule built solids for it |
| D5 | PASS | AUTO / HAND · AUTO / HAND · two pillow blocks for the screw, one rail pair for the carriage, one motor bracket |
| D6 | PASS | HAND / STYLE · HAND / STYLE · hardware quieter than the parts, still readable (both sheets) |
| D8 | PASS | AUTO / HAND · AUTO / HAND · the screw is a boolean: the track cut in 36 pieces of its section along the law (it crosses itself, so no single tube), cut 1 mm below the root and the root turned back as one core; the shoe's blade an extrusion with its underside cut round the screw's axis; every other solid a profile, an operation and a frame |
| D9 | N/A | AUTO / HAND · fired: j12-cvt (no solids) · AUTO / HAND · no member changes shape |
| D10 | PASS | AUTO · filled by the generator: the pipeline holds it for every built mechanism |
| D11 | PASS | AUTO · SOLID: 0 of 93 solids unsound |
| D7 | PASS | HAND · HAND · screw, carriage and shoe plain; richness in the stacks, the slide and the drive |
| A1 | PASS | AUTO · F J3, O J10, C groove-cam, G J5, drive drive · filled by the generator: the pipeline holds it for every built mechanism |
| A2 | PASS | AUTO · F J3, O J10, C groove-cam, G J5, drive drive · filled by the generator: the pipeline holds it for every built mechanism |
| A3 | PASS | AUTO · fired: classify (4 solids), axial stack builder · filled by the generator: a rule built solids for it |
| A4 | PASS | AUTO · fired: j1-dead-axle (no solids), axial stack builder · AUTO · stepped live shaft Ø12 with shoulders, collars and chamfered ends (H.shaft) |
| A5 | PASS | AUTO · fired: j2-live-shaft (no solids), j10-shaft-in-plan (28 solids), axial stack builder · filled by the generator: a rule built solids for it |
| A6 | PASS | AUTO · fired: j5-slide (18 solids), j13-compliant (no solids), standoffs (no solids) · filled by the generator: a rule built solids for it |
| A7 | PASS | AUTO · fired: base (3 solids), posts (no solids), feet (4 solids) · filled by the generator: a rule built solids for it |
| A8 | PASS | AUTO · fired: fasteners (30 solids) · filled by the generator: a rule built solids for it |
| A9 | PASS | AUTO / HAND · fired: placement solver · AUTO / HAND · the screw straddled by its two pillow blocks; the shoe's pivot is single shear in the upright, the only side the screw leaves free (the shoe sits in the groove) |
| A10 | PASS | HAND · fired: placement (8 solids), placement solver · HAND · the screw on its axis and the shoe in its groove stand where their joints put them; the carriage on its slab |
| A11 | PASS | AUTO / HAND · fired: j12-flexible (no solids), strap-sheave (no solids), j1-dead-axle (no solids) · AUTO / HAND · groove wall → shoe → pivot bolt → upright → carriage → gibbed rails → risers → base; the screw → bearings → pillow blocks → base |
| A12 | PASS | AUTO · clamp check clean |
| A13 | PASS | AUTO / HAND · 93 solids, 51 unnamed (further items of a listed set) · AUTO / HAND · named hardware with catalogue sizes (Shoulder bolt Ø3 x 4 M2.5, Bearing 6801-2RS, Feather key 4 x 4); 51 unnamed are further items of a listed set |
| A14 | PASS | AUTO / HAND · fired: support router · AUTO / HAND · supports routed against the sweeps; details checked by A15 (0 clashes over 72 phases) |
| A15 | PASS | AUTO · clearance in 3D over 72 phases: 0 clashes; hand allow: 0 named, 0 unnecessary |
| A16 | PASS | HAND · 5 joint notes; no note: none; no badge: none · HAND · 5 joint notes with badges; build rules: the track cut from the law in pieces, the shoe longer than a crossing, the shoe's blade narrowing to its points so it clears the twisting walls, the carriage's guide in front of and below the screw |
| A17 | PASS | HAND · HAND · assembles in the explode order: screw into its blocks, carriage onto its rails, shoe into the groove through the upright on its pivot bolt; every screw reachable, bearings pullable |
| A18 | PASS | AUTO · placement: 1 slabs in the tallest stack (170.0 mm), 0 clevises; stack per joint in the Joints table · filled by the generator: the pipeline holds it for every built mechanism |
| A19 | PASS | AUTO · 1 support routed (0 moved), least gap 1.5 mm; still covering a principle part, drawn see-through: none · AUTO · 1 support routed (pillow blocks), least gap 1.5 mm; nothing static covers a principle part in FRONT |
| A20 | PASS | AUTO · support per joint: O pillow · AUTO · support per joint: O pillow |
| A21 | PASS | AUTO · kit per joint: F J3, O J10, C groove-cam, G J5, drive drive |
| A22 | PASS | AUTO · fired: stops (no solids), adjustable-length (no solids), cable-clip (2 solids) · filled by the generator: a rule built solids for it |
| E1 | PASS | AUTO · every solid has one explode level; levels 0 to 29.91 · filled by the generator: the pipeline holds it for every built mechanism |
| E2 | PASS | AUTO · fired: explode (1 solid) · filled by the generator: a rule built solids for it |
| E3 | PASS | AUTO · fired: explode (1 solid) · filled by the generator: a rule built solids for it |
| E4 | PASS | HAND · HAND · last fitted goes furthest: the shaft leaves along its axis after the blocks lift, the rails and keeper lift off the base (explode shots, both sheets) |
| E5 | PASS | AUTO · fired: explode (1 solid) · filled by the generator: a rule built solids for it |
| E6 | PASS | AUTO · fired: explode (1 solid) · filled by the generator: a rule built solids for it |
| E7 | PASS | AUTO · fired: explode (1 solid) · filled by the generator: a rule built solids for it |
| E8 | PASS | AUTO · fired: explode (1 solid) · filled by the generator: a rule built solids for it |
| E9 | PASS | HAND · HAND · full explode readable in ISOMETRIC on both sheets, nothing leaves the frame |
| E10 | PASS | AUTO · fired: explode (1 solid) · filled by the generator: a rule built solids for it |
| J1 | N/A | AUTO · fired: trunnion (no solids), hub (no solids), j1-dead-axle (no solids) · filled by the generator: no joint of this type |
| J2 | N/A | AUTO · fired: j2-live-shaft (no solids) · filled by the generator: no joint of this type |
| J3 | PASS | AUTO · fired: j3-moving-pin (5 solids), cross-bearings (no solids), eccentric-bearing (no solids), spider-pin (no solids), ball-socket (no solids), ring-hub (no solids), eccentric (no solids) · filled by the generator: a rule built its kit |
| J4 | N/A | AUTO · fired: pin-hole (no solids), j4-slot-roller (no solids), pin-lobe (no solids), fork-pin (no solids), die (no solids) · filled by the generator: no joint of this type |
| J5 | PASS | AUTO · fired: tongue-slot (no solids), integrator-carriage (no solids), piston-bore (no solids), j5-slide (18 solids) · filled by the generator: a rule built its kit |
| J6 | N/A | AUTO · fired: j6-mesh (no solids), friction-contact (no solids), ring-carrier (no solids), pin-ring (no solids), ring-rollers (no solids) · filled by the generator: no joint of this type |
| J7 | PASS | AUTO · fired: ball-socket (no solids), groove-cam (2 solids), j7-cam (no solids), pallet-contact (no solids), pawl-tooth (no solids) · filled by the generator: a rule built its kit |
| J8 | N/A | AUTO · fired: j12-flexible (no solids), j8-belt (no solids) · filled by the generator: no joint of this type |
| J9 | N/A | AUTO · fired: j9-crossed-mesh (no solids) · filled by the generator: no joint of this type |
| J10 | PASS | AUTO · fired: j12-cvt (no solids), j10-shaft-in-plan (28 solids), j11-screw (no solids) · filled by the generator: a rule built its kit |
| J12 | N/A | AUTO · fired: j12-flexible (no solids), j12-cvt (no solids), j12-other (no solids), strap-sheave (no solids) · filled by the generator: no joint of this type |
| J13 | N/A | AUTO · fired: j13-compliant (no solids) · filled by the generator: no joint of this type |
| J11 | N/A | AUTO · fired: j11-screw (no solids) · filled by the generator: no joint of this type |
| F1 | PASS | AUTO · served at O, G; fired: posts (no solids), integrator-carriage (no solids), j2-live-shaft (no solids), j10-shaft-in-plan (28 solids), ring-carrier (no solids), pin-ring (no solids), hub (no solids), strap-sheave (no solids), j13-compliant (no solids), covers (no solids) · filled by the generator: a rule built solids for it |
| F2 | PASS | AUTO · served at F, O, G; fired: wheels (no solids), j12-flexible (no solids), j2-live-shaft (no solids), j10-shaft-in-plan (28 solids), cross-bearings (no solids), trunnion (no solids), ring-carrier (no solids), eccentric-bearing (no solids), pin-ring (no solids), spider-pin (no solids), fork-pin (no solids), ring-hub (no solids), eccentric (no solids), hub (no solids), ring-rollers (no solids), strap-sheave (no solids), j11-screw (no solids), j13-compliant (no solids), covers (no solids) · filled by the generator: a rule built solids for it |
| F3 | PASS | AUTO · served at F, O; fired: j12-flexible (no solids), j2-live-shaft (no solids), j10-shaft-in-plan (28 solids), j11-screw (no solids) · filled by the generator: a rule built solids for it |
| F4 | PASS | AUTO / HAND · served at O; fired: j9-crossed-mesh (no solids), j2-live-shaft (no solids), j10-shaft-in-plan (28 solids), trunnion (no solids), spider-pin (no solids), j11-screw (no solids) · AUTO / HAND · served at O: two shaft collars locate the screw against the near block's inner race, the far one floats; the groove's thrust goes to the located block |
| F5 | N/A | AUTO / HAND · served at no joint; fired: integrator-carriage (no solids), j5-slide (18 solids), pawl-tooth (no solids), j11-screw (no solids), j13-compliant (no solids), stops (no solids) · AUTO / HAND · the groove drives the carriage both ways and turns it round at each end, so it can never run past the travel, with the drive on or off; the slide rule finds no room for end blocks and keeps none, as for a slider its rod drives |
| F6 | N/A | AUTO / HAND · served at no joint; fired: friction-contact (no solids), j12-flexible (no solids), j12-cvt (no solids), trunnion (no solids), j7-cam (no solids), pallet-contact (no solids), pawl-tooth (no solids) · AUTO / HAND · form-closed: the groove holds the shoe both ways, no spring |
| F7 | PASS | AUTO / HAND · served at G; fired: j6-mesh (no solids), friction-contact (no solids), j9-crossed-mesh (no solids), j12-flexible (no solids), j12-cvt (no solids), j5-slide (18 solids), j12-other (no solids), adjustable-length (no solids), covers (no solids) · AUTO / HAND · served at G: the gib takes up the slide's play; the shoe runs in the groove with 0.1 mm a side |
| F8 | PASS | AUTO · served at C, G; fired: tongue-slot (no solids), j12-flexible (no solids), cross-bearings (no solids), ball-socket (no solids), eccentric (no solids), j11-screw (no solids), lubrication (no solids) · AUTO · served at C (felt oiler over the groove on the carriage) and G (two wipers and a grease nipple); sealed bearings need none |
| F9 | PASS | AUTO / HAND · served at C; fired: j6-mesh (no solids), j9-crossed-mesh (no solids), timing-marks (1 solid) · AUTO / HAND · served at C: a zero line engraved on the screw's end |
| F10 | PASS | AUTO / HAND · served at drive; fired: j12-flexible (no solids), drive (30 solids) · AUTO / HAND · served at drive: home flag on the screw's pulley end and a fork sensor |
| M1 | PASS | AUTO · fired: hardware primitives · AUTO · top-face chamfers by part kind (primitives) |
| M2 | PASS | HAND · HAND · bosses round the pivot (upright and shoe); nothing starts or stops that needs arms |
| M3 | PASS | AUTO · fired: j3-moving-pin (5 solids), hardware primitives · filled by the generator: a rule built solids for it |
| M4 | PASS | AUTO / HAND · fired: base (3 solids), fasteners (30 solids) · AUTO / HAND · counterbores and countersinks for heads (base, csk rails, housings) |
| M5 | PASS | AUTO / HAND · fired: hardware primitives · AUTO / HAND · cutter radii on windows and slots; the groove's ends are the track's own smooth turn-round |
| M6 | PASS | AUTO · edge distance and walls clean |
| M7 | N/A | HAND · HAND · no bracket corner turns a load (the upright is a tapered plate on the carriage) |
| M8 | PASS | AUTO · fired: j1-dead-axle (no solids) · AUTO · thread undercuts on stepped shafts |
| M9 | PASS | AUTO / HAND · fired: j1-dead-axle (no solids) · AUTO / HAND · ISO coarse threads, engagement through the tapped part or to a nut |
| M10 | PASS | AUTO / HAND · 90 of 93 solids name a material · AUTO / HAND · 90 of 93 solids name a material; the three bodies' own parts (screw, carriage, shoe) take none from the materials rule, as in every built mechanism (barrel cam 93 of 96): reported as an engine item, not set here |
| M11 | PASS | AUTO · fired: j1-dead-axle (no solids), hardware primitives · AUTO · centre holes and chamfered ends on the turned shaft |
| M12 | PASS | HAND · HAND · every screw reachable by its key in the explode; the pivot bolt from the upright's outer face |
| M13 | PASS | AUTO / HAND · 14 threaded · AUTO / HAND · 14 threaded, threadlocker or nyloc on every one |
| M14 | N/A | AUTO / HAND · fired: tongue-slot (no solids), piston-bore (no solids), pin-hole (no solids), j4-slot-roller (no solids), pin-lobe (no solids), groove-cam (2 solids), pallet-contact (no solids), eccentric (no solids), die (no solids), hub (no solids) · AUTO / HAND · the shoe itself is the replaceable wear part, on its pivot bolt; the screw's groove is the hardened track; the slide is gibbed and wiped |
| V1 | PASS | AUTO · fired: drive (30 solids) · filled by the generator: a rule built solids for it |
| V2 | PASS | AUTO · fired: drive (30 solids) · filled by the generator: a rule built solids for it |
| V3 | PASS | AUTO / HAND · fired: drive (30 solids) · AUTO / HAND · belt and pulleys clear of feet and housings (A15: 0 clashes) |
| V4 | PASS | AUTO · fired: j8-belt (no solids) · AUTO · flanged pulleys, belt in one plane, tension slots on the bracket |
| V5 | PASS | AUTO · fired: drive (30 solids) · filled by the generator: a rule built solids for it |
| V6 | PASS | AUTO · fired: drive (30 solids), cable-clip (2 solids) · filled by the generator: a rule built solids for it |
| L1 | PASS | STYLE · STYLE · no look values in the record |
| L2 | PASS | HAND · HAND · the record carries no look; no polish |
| L3 | PASS | HAND · HAND · roles right on every solid (both sheets): the screw driver, the carriage and shoe followers |
| L4 | PASS | HAND / STYLE · HAND / STYLE · one accent: the input ring and the trace |
| L5 | PASS | AUTO / HAND · fired: see-through (21 solids) · AUTO / HAND · see-through on 21 solids (pillow blocks, rails, keeper) and the carriage on purpose (teaching.seeThrough), so the shoe shows behind its upright in FRONT |
| L6 | PASS | AUTO · filled by the generator: the pipeline holds it for every built mechanism |
| L7 | PASS | STYLE · STYLE · turntable orbit, named views, no perspective |
| L8 | PASS | AUTO / HAND · fired: trace-marks (1 solid) · AUTO / HAND · centrelines on the joint axes, the engraved scale and the zero line as marks |
| L9 | PASS | AUTO / DATA · AUTO / DATA · the detail CROSSING drawn by the renderer from the record |
| L10 | PASS | AUTO / STYLE · AUTO / STYLE · trace, ticks, dimensions and the axis line in the sheet's look |
| R1 | PASS | HAND · HAND · no polish; every part from the kits and the shapes |
| R2 | PASS | HAND · HAND · shaft Ø12, bearings 6801-2RS, screws M2.5, M3, M4, M5, GT2 16T and 32T |
| R3 | PASS | AUTO · fired: hardware primitives · AUTO · pillow block, slide, drive and sensor are the shared subassemblies |
| R4 | PASS | AUTO · package v2 103.9 KB · filled by the generator: the pipeline holds it for every built mechanism |
| R5 | N/A | HAND · HAND · no polish |
| R6 | PASS | FLAG · FLAG · bench (indicative: three workers ran heavy checks on the machine at once): 103.9 KB, setup 53.1 ms (over the 20 ms target, flagged: 37 ms GPU, 12.8 ms edges of the two meshes), frames 1.1 to 1.3 ms paced in every view |
| R7 | PASS | HAND / FLAG · polish none; 0 solids added, 0 overrides by the polish |
| R8 | PASS | AUTO / SITE · AUTO / SITE · the stage draws only on change (shared) |
| R9 | PASS | AUTO / SITE · AUTO / SITE · shared setup; one block, no closure tables |
| R10 | PASS | FLAG · FLAG · the phone bench page is the site's (shared); not measured in this pass |
| DL1 | PASS | AUTO / HAND · 29 of 93 solids on a dropping rung · AUTO / HAND · 29 of 93 solids on a dropping rung, by kind; none moved |
| DL2 | PASS | HAND · HAND · default dial full |
| DL3 | PASS | AUTO · filled by the generator: the pipeline holds it for every built mechanism |
| DL4 | PASS | SITE · SITE · adaptive dial (shared) |
| DL6 | PASS | AUTO · filled by the generator: the pipeline holds it for every built mechanism |
| DL5 | PASS | FLAG · FLAG · frame at 28° per dial position 1.47 to 2.2 ms (bench) |
| Q1 | PASS | check, clamp and edge distance clean |
| Q2 | PASS | 0 clashes, 0 unnecessary allows |
| Q3 | PASS | package v2 written, 103.9 KB; site build not checked here · package v2 written, 103.9 KB; the site build runs on the integration branch |
| Q4 | PASS | local: tools/shot · shot set drawn (record, PLAN, FRONT, SIDE, ISOMETRIC, detail CROSSING, explode, both sheets) and looked at, with extra frames at the crossing (u 0) and the turn-round (u 1.57) |
| Q5 | PASS | local: tools/bench · bench run (R6 row) |
| Q6 | PASS | audit regenerated and every row judged |
| Q7 | PASS | conformance: at the current standard (3.11) |
| Q8 | PASS | teaching review: keep (2026-10-27); the six phases of the finished build are looked at by eye · teaching review keep, recorded in the record and on the teaching: line; the six phases of the finished build looked at again |

## Joints
| Joint | Kit | Block | Support | Stack | F1 locate | F2 retain | F3 torque | F4 thrust | F5 limit | F6 hold | F7 adjust | F8 lube | F9 timing | F10 protect |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| F | J3 | cam | – | – | none | Shoulder bolt Ø3 x 4, M2.5 (ISO 7379) | Shoulder bolt Ø3 x 4, M2.5 (ISO 7379) | none | none | none | none | none | none | none |
| O | J10 | driver | pillow | – | 4 x Dowel pin Ø4 x 14 h6, block to base | 2 x Internal circlip DIN 472, Ø21 | Feather key 4 x 4 x 169 (DIN 6885) | 2 x Shaft collar 12x20, set screw | none | none | none | none | none | none |
| C | groove-cam | cam | – | – | none | none | none | none | none | none | none | Felt oiler over the groove, oil-soaked wool felt | Screw | none |
| G | J5 | – | – | – | 2 x Dowel pin Ø3 h6, reference rail to base | Keeper plate, laps the slider | none | none | none | none | Gib strip 3 x 6 x 164, bronze | 2 x Felt wiper in a steel clip; Grease nipple M6 (DIN 71412) | none | none |
| drive | drive | – | – | – | none | none | none | none | none | none | none | none | none | Home flag, 1 mm steel vane; Fork sensor, slotted optical, 5 mm gap |

## Supports
| Support | Joint | Kind | Route | Least gap mm | Covers | T10 |
|---|---|---|---|---|---|---|
| O-pb | O | pillow | first choice | 1.5 | – | – |

## Variants and overrides
| Joint or part | Rule result | Chosen | Why |
|---|---|---|---|

## Detail ladder
| Rung | Solids | Marks | Frame ms at this dial position |
|---|---|---|---|
| DL-A | 5 | 0 | 1.61 |
| DL-B | 0 | 205 | 1.51 |
| DL-C | 0 | 0 | 1.56 |
| DL-D | 3 | 0 | 1.47 |
| DL-E | 12 | 1 | 2.2 |
| DL-F | 0 | 0 | 1.57 |
| DL-G | 0 | 0 | 1.54 |
| DL-H | 9 | 0 | 1.59 |
| never | 64 | 107 | 1.47 (full) |

## Promotion candidates
- The materials rule leaves the bodies' own parts (screw, carriage, shoe) without a material, as in every built mechanism: an engine item for the rule, not this pass.
- The groove cam kit places its felt oiler at a roller's radius (5 mm by default) for a body that has none; a shoe would want it at its blade's end. One case so far.

Polish exceptions: none (no polish).

## Verification
check: clean · K1 residual: 9.2e-14 · claims: 6 of 6 ok · clearance: 0 clashes · clamp: clean · edge distance: clean · package: 103.9 KB
screenshots: record, PLAN, FRONT, SIDE, ISOMETRIC, detail CROSSING, explode, both sheets, and frames at the crossing (u 0) and the turn-round (u 1.57) · bench: setup 53.1 ms flagged over 20 ms, frames 1.1 to 1.6 ms; indicative only, three workers ran heavy checks on the machine at once
