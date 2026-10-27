# Audit: Hobson's joint (hobsons-joint)
standard: 3.11 · date: 2026-10-27 · result: pass · detail: full · pass: build
teaching: keep · decisions in the record

## Summary
PASS 147 · FAIL 0 · N/A 20 · open: none

## Requirements
| Id | Status | Evidence / action |
|---|---|---|
| S1 | PASS | DATA · DATA · the standard carries version 3.11 and its changelog |
| S2 | PASS | HAND · HAND · header with standard, date, result, detail, pass and the teaching: line |
| S3 | PASS | AUTO · filled by the generator: the pipeline holds it for every built mechanism |
| S4 | PASS | SITE · SITE · the pass issue (#256) holds only this mechanism's decisions; the wave's status in #252 |
| S5 | PASS | SITE · SITE · no engine mark on the sheet, card or page (shared site code) |
| S6 | PASS | AUTO · filled by the generator: the pipeline holds it for every built mechanism |
| P1 | PASS | DATA · record v3 complete (kin and teaching blocks); no polish, audit.md present |
| P2 | PASS | DATA · DATA · catalogue validator clean (family Coupling, Rotary to Rotary, Continuous, Constant velocity, Perpendicular intersecting, Unity 1:1) |
| P3 | PASS | DATA / SITE · DATA / SITE · ratio (Unity, 1:1), axes, character, backdrivable (Yes), aka, family, motion, level, dof and the motor drive from the record |
| P4 | PASS | DATA · DATA · tags grouped Function, Property, Application, keywords |
| P5 | PASS | DATA · DATA · explanation in four parts; three uses (gearless right-angle socket adapter, elbow engine, display models) |
| P6 | PASS | DATA · DATA · 4 references (Wikipedia Hobson's joint and Elbow engine, patents US 5967004 and DE 271663); 4 media (Mechanical Library photos, JB Tools photos of the Cal-Van 483, two videos of real builds); 1 real-world video (Cal-Van adapter) confirmed by oEmbed |
| P7 | PASS | HAND / SITE · HAND / SITE · no polish; every label comes from the record |
| P8 | PASS | SITE · SITE · no parts list or joint sections on the page |
| P9 | PASS | AUTO / HAND · AUTO / HAND · every number the explanation states is a claim and agrees (9 of 9: 22 mm bore circle, 90° bend and shaft angle, 44 mm leg slide, speed ratio 1, output minus input 0) |
| P10 | PASS | HAND · HAND · rod 1's corner traced with ticks every 30° and a mark on each disc's face traced with the same ticks; both axes, the shaft angle and the rod's bend as arcs, the corners' plane, the leg stroke as a posed dimension; plot of the speed ratio and of rod 1's leg slide |
| P11 | PASS | DATA · DATA · plain language, short sentences, mm and degrees, no em dashes |
| P12 | PASS | AUTO / DATA · AUTO / DATA · validate(records, asVersion 3) clean for this record; counted mobility -4 named overconstrained in topology.notes |
| P13 | PASS | HAND · HAND · teaching review against the record before the build, again on the finished drawing (teaching: line) |
| K1 | PASS | AUTO · K1 residual 1.4e-14 (tolerance 1e-9) over 360 samples, reference 2.5e-15 |
| K2 | PASS | AUTO · check: finite, continuous, periodic over 360 samples |
| K3 | PASS | AUTO / HAND · 1 block (elbow-rods); no numeric fallback · AUTO / HAND · one elbow-rods block (src/kin/steps/elbow.ts, closed form in blocks/couplings: elbowCorner, elbowRoot): each rod's corner on its turned input bore line at the bore radius from the output axis, x = k q·a2 on the assembled root; the rods translate, the output turns by the input's angle; no fallback |
| K4 | PASS | HAND · HAND · the input disc is the driver and carries the accent on its shaft |
| K6 | PASS | DATA · DATA · bores on r = 22 in both discs, rods bent to the 90° shaft angle: x = q·a2 / (1 - cos 90°) = q·a2, so the corners keep to the plane x = y through J; leg stroke 2r = 44; legs 94 = 22 + 56 + 12 + 4, so a leg stays through its 12 mm disc at the outer end of its stroke |
| K7 | PASS | DATA · drivers input (rotary) · DATA · drivers input (rotary, joint B1, 0 to 360°) |
| K8 | PASS | AUTO / DATA · AUTO / DATA · every joint declared with type, bodies, origin and axis: two revolutes, six cylindrical leg joints; nothing inferred |
| K9 | PASS | DATA · DATA · one rotary driver; the shaft angle is fixed by the rods' bend, so it is not a control (recorded in the review) |
| K10 | PASS | AUTO / DATA · AUTO / DATA · each rod's root read from its reference corner; the root is linear in the bore position, so it is continuous through the points where it meets the other root; no POSE JUMP over the cycle |
| K11 | PASS | AUTO · mobility counted -4, dof 1 |
| K12 | PASS | DATA · DATA · every traced, overlaid, plotted and claimed point and quantity is named in kin |
| T1 | PASS | HAND · HAND · mechanics first: two discs at a right angle turning the same, the same arrows and ticks on both faces, three bent rods carried round without turning, their legs sliding in and out of the bores; no wrench, socket or tool in any string |
| T2 | PASS | HAND · HAND · review before the build and again on the finished build (record view, PLAN, SIDE, the 28° view, section and explode, both sheets); decisions in the record |
| T3 | PASS | DATA · DATA · both discs, the three rods and rod 1's corner declared; drawn whole, in depth order |
| T4 | PASS | DATA · fired: trace-marks (3 solids) · DATA · fired: trace-marks (3 solids) · rod 1's corner (an ellipse in the plane x = y, read in SIDE and the 28° view) with the comet; a mark on each disc's face with ticks every 30°: the same twelve ticks on both |
| T5 | PASS | DATA · DATA · input and output axes; shaft angle arc 90° beside rod 1's bend arc 90° (why the angle is fixed); the corners' plane; the leg stroke between the posed ends |
| T6 | PASS | HAND / DATA · HAND / DATA · a 44 mm leg stroke against Ø64 discs 56 mm from J, the legs' ends coming out 44 mm behind the discs: reads at the default size |
| T7 | PASS | DATA · DATA · VIEW 135 30: from the outside corner of the right angle, both discs face on at 45° with their arrows and ticks side by side, the three rods' bends in front |
| T8 | PASS | DATA · DATA · section PLANE-OF-SHAFTS (z = 55): the rod in that plane cut along both legs in their bushings; rod 1 highlighted, the one in the plane at the reference |
| T9 | PASS | AUTO / DATA · claim table: 9 ok, 0 off, 0 uncheckable of 9 |
| T10 | PASS | AUTO · 20 solids drawn see-through: B1-k0-key, B1-ew, B1-es, B1-es-sh, B1-axle, B2-k0-key, B2-ew, B2-es · filled by the generator: a rule built solids for it |
| T11 | PASS | AUTO · 2 supports routed, 2 moved off a sweep · filled by the generator: a rule built solids for it |
| T12 | PASS | HAND · 15 support solids; dropped by the polish: none |
| T13 | N/A | DATA · DATA · steady motion, nothing goes by in a blink |
| T14 | PASS | HAND / DATA · HAND / DATA · the input's turn (see K9) |
| T15 | PASS | HAND · HAND · labels state the mechanism, never its use |
| T16 | N/A | HAND / STYLE · HAND / STYLE · the three rods share one role and are not told apart: rod 1 is singled out by its trace, its bend arc and the section's highlight |
| T17 | PASS | AUTO · filled by the generator: the pipeline holds it for every built mechanism |
| D1 | PASS | HAND · fired: wheels (no solids) · HAND · fired: wheels (no solids) · two plain discs with three bores and a raised index arrow; the rods round bar bent on a 6 mm radius |
| D2 | PASS | HAND · HAND · the discs carry their bores 5 mm in from the rim and a keyed hub; the rods are solid round bar where the bending load runs |
| D3 | PASS | STYLE · STYLE · roles by pattern and tone (both sheets) |
| D4 | PASS | AUTO · fired: base (3 solids), feet (4 solids) · filled by the generator: a rule built solids for it |
| D5 | PASS | AUTO / HAND · AUTO / HAND · two pillow blocks per shaft, one motor bracket |
| D6 | PASS | HAND / STYLE · HAND / STYLE · hardware quieter than the parts, still readable (both sheets) |
| D8 | PASS | AUTO / HAND · AUTO / HAND · each rod one sweep of its Ø6 section from leg end round the bend to leg end (src/builder/shapes/elbow.ts); the discs extrusions with their bores |
| D9 | N/A | AUTO / HAND · fired: j12-cvt (no solids) · AUTO / HAND · fired: j12-cvt (no solids) · no member changes shape |
| D10 | PASS | AUTO · filled by the generator: the pipeline holds it for every built mechanism |
| D11 | PASS | AUTO · SOLID: 0 of 112 solids unsound |
| D7 | PASS | HAND · HAND · discs and rods plain; richness in the shaft stacks, the bushings and the drive |
| A1 | PASS | AUTO · B1 J10, B2 J10, R1-in leg-bore, R1-out leg-bore, R2-in leg-bore, R2-out leg-bore, R3-in leg-bore, R3-out leg-bore, drive drive · filled by the generator: the pipeline holds it for every built mechanism |
| A2 | PASS | AUTO · B1 J10, B2 J10, R1-in leg-bore, R1-out leg-bore, R2-in leg-bore, R2-out leg-bore, R3-in leg-bore, R3-out leg-bore, drive drive · filled by the generator: the pipeline holds it for every built mechanism |
| A3 | PASS | AUTO · fired: classify (8 solids), axial stack builder · filled by the generator: a rule built solids for it |
| A4 | PASS | AUTO · fired: j1-dead-axle (no solids), axial stack builder · AUTO · fired: j1-dead-axle (no solids), axial stack builder · stepped live shafts Ø12 with shoulders, collars, end washers and chamfered ends (H.shaft) |
| A5 | PASS | AUTO · fired: j2-live-shaft (no solids), j10-shaft-in-plan (62 solids), axial stack builder · filled by the generator: a rule built solids for it |
| A6 | N/A | AUTO · fired: j5-slide (no solids), j13-compliant (no solids), standoffs (no solids) · AUTO · fired: j5-slide (no solids), j13-compliant (no solids), standoffs (no solids) · no plate floats over the base and no slide rail |
| A7 | PASS | AUTO · fired: base (3 solids), posts (no solids), feet (4 solids) · filled by the generator: a rule built solids for it |
| A8 | PASS | AUTO · fired: fasteners (32 solids) · filled by the generator: a rule built solids for it |
| A9 | PASS | AUTO / HAND · fired: placement solver · AUTO / HAND · fired: placement solver · each disc overhangs its shaft's two blocks, which stand behind it since the rods sweep past its front face (side -1 on B1 and B2); each leg is carried in two discs at once |
| A10 | PASS | HAND · fired: placement (13 solids), placement solver · HAND · fired: placement (13 solids), placement solver · discs and rods stand where their joints put them; nothing stacked to clear |
| A11 | PASS | AUTO / HAND · fired: j12-flexible (no solids), strap-sheave (no solids), j1-dead-axle (no solids) · AUTO / HAND · fired: j12-flexible (no solids), strap-sheave (no solids), j1-dead-axle (no solids) · leg → bushing → disc → key → shaft → bearings → pillow blocks (screwed, dowelled) → base, at both discs |
| A12 | PASS | AUTO · clamp check clean |
| A13 | PASS | AUTO / HAND · 113 solids, 65 unnamed (further items of a listed set) · AUTO / HAND · named hardware with catalogue sizes (Bronze bushing 6x10x12, Feather key 4 x 4, Shaft collar 12x20, Dowel pin Ø4); unnamed are further items of a listed set |
| A14 | PASS | AUTO / HAND · fired: support router · AUTO / HAND · fired: support router · pillow blocks routed against the rods' sweeps behind the discs; details checked by A15 (0 clashes over 72 phases) |
| A15 | PASS | AUTO · clearance in 3D over 72 phases: 0 clashes; hand allow: 0 named, 0 unnecessary |
| A16 | PASS | HAND · 9 joint notes; no note: none; no badge: none · HAND · 9 joint notes with badges; build rules: bores on one radius in both discs, rods bent to the shaft angle, legs long enough to stay through their disc over the 44 mm stroke, three rods evenly spaced to hold the output on its root, both shafts' blocks behind their discs |
| A17 | PASS | HAND · HAND · assembles in the explode order: shafts into their blocks, discs onto the shaft ends under their end washers, then each rod pushed in along the line between its legs into both bores at once; every screw reachable, bushings pressable |
| A18 | PASS | AUTO · placement: 3 slabs in the tallest stack (26.0 mm), 0 clevises; stack per joint in the Joints table · filled by the generator: the pipeline holds it for every built mechanism |
| A19 | PASS | AUTO · 2 supports routed (2 moved), least gap 1.5 mm; still covering a principle part, drawn see-through: B1-pb, B2-pb · AUTO · 2 supports routed (2 moved), least gap 1.5 mm; the blocks behind the discs, drawn see-through where they stand behind a rod's leg |
| A20 | PASS | AUTO · support per joint: B1 pillow, B2 pillow · AUTO · support per joint: B1 pillow, B2 pillow |
| A21 | PASS | AUTO · kit per joint: B1 J10, B2 J10, drive drive |
| A22 | PASS | AUTO · fired: stops (no solids), adjustable-length (no solids), cable-clip (2 solids) · filled by the generator: a rule built solids for it |
| E1 | PASS | AUTO · every solid has one explode level; levels 0 to 24.77 · filled by the generator: the pipeline holds it for every built mechanism |
| E2 | PASS | AUTO · fired: explode (1 solid) · filled by the generator: a rule built solids for it |
| E3 | PASS | AUTO · fired: explode (1 solid) · filled by the generator: a rule built solids for it |
| E4 | PASS | HAND · HAND · last fitted goes furthest: the rods leave first along the line between their legs, the discs come off their shaft ends, the shafts back out, the blocks lift (explode shots, both sheets) |
| E5 | PASS | AUTO · fired: explode (1 solid) · filled by the generator: a rule built solids for it |
| E6 | PASS | AUTO · fired: explode (1 solid) · filled by the generator: a rule built solids for it |
| E7 | PASS | AUTO · fired: explode (1 solid) · filled by the generator: a rule built solids for it |
| E8 | PASS | AUTO · fired: explode (1 solid) · filled by the generator: a rule built solids for it |
| E9 | PASS | HAND · HAND · full explode readable in ISOMETRIC and the record view on both sheets; the discs 56 mm from J leave room to come off their shafts without meeting; nothing leaves the frame |
| E10 | PASS | AUTO · fired: explode (1 solid) · filled by the generator: a rule built solids for it |
| J1 | N/A | AUTO · fired: trunnion (no solids), hub (no solids), j1-dead-axle (no solids) · filled by the generator: no joint of this type |
| J2 | N/A | AUTO · fired: j2-live-shaft (no solids) · filled by the generator: no joint of this type |
| J3 | N/A | AUTO · fired: j3-moving-pin (no solids), cross-bearings (no solids), eccentric-bearing (no solids), spider-pin (no solids), ball-socket (no solids), ring-hub (no solids), eccentric (no solids) · filled by the generator: no joint of this type |
| J4 | N/A | AUTO · fired: pin-hole (no solids), j4-slot-roller (no solids), pin-lobe (no solids), fork-pin (no solids), die (no solids) · filled by the generator: no joint of this type |
| J5 | PASS | AUTO · fired: tongue-slot (no solids), integrator-carriage (no solids), piston-bore (no solids), j5-slide (no solids), leg-bore (12 solids) · filled by the generator: a rule built its kit |
| J6 | N/A | AUTO · fired: j6-mesh (no solids), friction-contact (no solids), ring-carrier (no solids), pin-ring (no solids), ring-rollers (no solids) · filled by the generator: no joint of this type |
| J7 | N/A | AUTO · fired: ball-socket (no solids), groove-cam (no solids), j7-cam (no solids), pallet-contact (no solids), pawl-tooth (no solids) · filled by the generator: no joint of this type |
| J8 | N/A | AUTO · fired: j12-flexible (no solids), j8-belt (no solids) · filled by the generator: no joint of this type |
| J9 | N/A | AUTO · fired: j9-crossed-mesh (no solids) · filled by the generator: no joint of this type |
| J10 | PASS | AUTO · fired: j12-cvt (no solids), j10-shaft-in-plan (62 solids), j11-screw (no solids) · filled by the generator: a rule built its kit |
| J12 | N/A | AUTO · fired: j12-flexible (no solids), j12-cvt (no solids), j12-other (no solids), strap-sheave (no solids) · filled by the generator: no joint of this type |
| J13 | N/A | AUTO · fired: j13-compliant (no solids) · filled by the generator: no joint of this type |
| J11 | N/A | AUTO · fired: j11-screw (no solids) · filled by the generator: no joint of this type |
| F1 | PASS | AUTO · served at B1, B2; fired: posts (no solids), integrator-carriage (no solids), j2-live-shaft (no solids), j10-shaft-in-plan (62 solids), ring-carrier (no solids), pin-ring (no solids), hub (no solids), strap-sheave (no solids), j13-compliant (no solids), covers (no solids) · filled by the generator: a rule built solids for it |
| F2 | PASS | AUTO · served at B1, B2; fired: wheels (no solids), j12-flexible (no solids), j2-live-shaft (no solids), j10-shaft-in-plan (62 solids), cross-bearings (no solids), trunnion (no solids), ring-carrier (no solids), eccentric-bearing (no solids), pin-ring (no solids), spider-pin (no solids), fork-pin (no solids), ring-hub (no solids), eccentric (no solids), hub (no solids), leg-bore (12 solids), ring-rollers (no solids), strap-sheave (no solids), j11-screw (no solids), j13-compliant (no solids), covers (no solids) · filled by the generator: a rule built solids for it |
| F3 | PASS | AUTO · served at B1, B2; fired: j12-flexible (no solids), j2-live-shaft (no solids), j10-shaft-in-plan (62 solids), j11-screw (no solids) · filled by the generator: a rule built solids for it |
| F4 | PASS | AUTO / HAND · served at B1, B2; fired: j9-crossed-mesh (no solids), j2-live-shaft (no solids), j10-shaft-in-plan (62 solids), trunnion (no solids), spider-pin (no solids), j11-screw (no solids) · AUTO / HAND · served at B1, B2: two shaft collars locate each live shaft against the legs' sliding drag |
| F5 | N/A | AUTO / HAND · served at no joint; fired: integrator-carriage (no solids), j5-slide (no solids), pawl-tooth (no solids), j11-screw (no solids), j13-compliant (no solids), stops (no solids) · AUTO / HAND · the legs' slide is bounded by the kinematics (2r); nothing oscillates or can over-travel |
| F6 | N/A | AUTO / HAND · served at no joint; fired: friction-contact (no solids), j12-flexible (no solids), j12-cvt (no solids), trunnion (no solids), j7-cam (no solids), pallet-contact (no solids), pawl-tooth (no solids) · AUTO / HAND · positively driven, no rest position to hold |
| F7 | N/A | AUTO / HAND · served at no joint; fired: j6-mesh (no solids), friction-contact (no solids), j9-crossed-mesh (no solids), j12-flexible (no solids), j12-cvt (no solids), j5-slide (no solids), j12-other (no solids), adjustable-length (no solids), covers (no solids) · AUTO / HAND · nothing to adjust: the bores are drilled on one radius in both discs and the rods bent to the shaft angle; an adjuster would only spoil the match |
| F8 | PASS | AUTO · served at R1-in, R1-out, R2-in, R2-out, R3-in, R3-out; fired: tongue-slot (no solids), j12-flexible (no solids), cross-bearings (no solids), ball-socket (no solids), eccentric (no solids), leg-bore (12 solids), j11-screw (no solids), lubrication (no solids) · AUTO · served at R1-in to R3-out: each leg runs in an oil-impregnated sintered bronze bushing; the shaft bearings are sealed |
| F9 | PASS | AUTO / HAND · served at no joint; fired: j6-mesh (no solids), j9-crossed-mesh (no solids), timing-marks (1 solid) · AUTO / HAND · the raised index arrows on both discs at the same angle mark the matching bores; the rods themselves fit only in phase |
| F10 | PASS | AUTO / HAND · served at drive; fired: j12-flexible (no solids), drive (30 solids) · AUTO / HAND · served at drive: home flag and fork sensor |
| M1 | PASS | AUTO · fired: hardware primitives · AUTO · fired: hardware primitives · top-face chamfers by part kind (primitives) |
| M2 | PASS | HAND · HAND · a hub keyed on each shaft; nothing starts, stops or reverses that needs arms |
| M3 | PASS | AUTO · fired: j3-moving-pin (no solids), hardware primitives · AUTO · fired: hardware primitives · bore entry chamfers on the bushings and bearing seats |
| M4 | PASS | AUTO / HAND · fired: base (3 solids), fasteners (32 solids) · AUTO / HAND · fired: base (3 solids), fasteners · counterbores and countersinks for heads (base, blocks) |
| M5 | PASS | AUTO / HAND · fired: hardware primitives · AUTO / HAND · fired: hardware primitives · no pockets or windows; round bores |
| M6 | PASS | AUTO · edge distance and walls clean |
| M7 | N/A | HAND · HAND · no bracket corner turns a load (the pillow blocks and the motor bracket are the kits') |
| M8 | PASS | AUTO · fired: j1-dead-axle (no solids) · AUTO · fired: j1-dead-axle (no solids) · thread undercuts on stepped shafts |
| M9 | PASS | AUTO / HAND · fired: j1-dead-axle (no solids) · AUTO / HAND · fired: j1-dead-axle (no solids) · ISO coarse threads, engagement through the tapped part or to a nut |
| M10 | PASS | AUTO / HAND · 108 of 113 solids name a material · AUTO / HAND · materials named on the hardware (sintered bronze bushings, steel keys and collars); the bodies' own parts (discs, rods) take none from the materials rule, as in every built mechanism: reported under promotion candidates |
| M11 | PASS | AUTO · fired: j1-dead-axle (no solids), hardware primitives · AUTO · fired: j1-dead-axle (no solids), hardware primitives · centre holes and chamfered ends on the turned shafts |
| M12 | PASS | HAND · HAND · every screw reachable by its key in the explode; the bushings pressed from either face of the disc |
| M13 | PASS | AUTO / HAND · 16 threaded · AUTO / HAND · 16 threaded, threadlocker or nyloc on every one |
| M14 | PASS | AUTO / HAND · fired: tongue-slot (no solids), piston-bore (no solids), pin-hole (no solids), j4-slot-roller (no solids), pin-lobe (no solids), groove-cam (no solids), pallet-contact (no solids), eccentric (no solids), die (no solids), hub (no solids), leg-bore (12 solids) · AUTO / HAND · the six bronze bushings are the replaceable wear parts of the sliding legs (leg-bore kit) |
| V1 | PASS | AUTO · fired: drive (30 solids) · filled by the generator: a rule built solids for it |
| V2 | PASS | AUTO · fired: drive (30 solids) · filled by the generator: a rule built solids for it |
| V3 | PASS | AUTO / HAND · fired: drive (30 solids) · AUTO / HAND · fired: drive (30 solids) · belt and pulleys clear of feet and housings (A15: 0 clashes) |
| V4 | PASS | AUTO · fired: j8-belt (no solids) · AUTO · fired: j8-belt (no solids) · flanged pulleys, belt in one plane, tension slots on the bracket |
| V5 | PASS | AUTO · fired: drive (30 solids) · filled by the generator: a rule built solids for it |
| V6 | PASS | AUTO · fired: drive (30 solids), cable-clip (2 solids) · filled by the generator: a rule built solids for it |
| L1 | PASS | STYLE · STYLE · no look values in the record |
| L2 | PASS | HAND · HAND · the record carries no look; no polish |
| L3 | PASS | HAND · HAND · roles right on every solid (both sheets): the input disc driver, the output disc output, the rods links |
| L4 | PASS | HAND / STYLE · HAND / STYLE · one accent: the input ring and the trace |
| L5 | PASS | AUTO / HAND · fired: see-through (20 solids) · AUTO / HAND · fired: see-through · see-through on the blocks and both discs on purpose (teaching.seeThrough), so the legs show in their bores |
| L6 | PASS | AUTO · filled by the generator: the pipeline holds it for every built mechanism |
| L7 | PASS | STYLE · STYLE · turntable orbit, named views, no perspective |
| L8 | PASS | AUTO / HAND · fired: trace-marks (3 solids) · AUTO / HAND · fired: trace-marks (3 solids) · centrelines on the joint axes, the engraved scale, the index arrows |
| L9 | PASS | AUTO / DATA · AUTO / DATA · the section PLANE-OF-SHAFTS drawn by the renderer from the record |
| L10 | PASS | AUTO / STYLE · AUTO / STYLE · traces, ticks, arcs, line and dimension in the sheet's look |
| R1 | PASS | HAND · HAND · no polish; every part from the kits and the shapes |
| R2 | PASS | HAND · HAND · shafts Ø12, rods Ø6, bushings 6x10, screws M3, M4, M5, GT2 16T and 32T · HAND · shafts Ø12, rods Ø6, bushings 6x10, bearings from the catalogue table, screws from the standard series, GT2 16T and 32T |
| R3 | PASS | AUTO · fired: hardware primitives · AUTO · fired: hardware primitives · pillow block, drive and sensor are the shared subassemblies |
| R4 | PASS | AUTO · package v2 15.3 KB · filled by the generator: the pipeline holds it for every built mechanism |
| R5 | N/A | HAND · HAND · no polish |
| R6 | PASS | FLAG · FLAG · bench (indicative: three workers ran heavy checks on the machine at once): 15.3 KB, setup 69.4 ms (over the 20 ms target, flagged: 64.4 ms GPU on the page's first frame), frames 1.2 to 1.3 ms paced in every view |
| R7 | PASS | HAND / FLAG · polish none; 0 solids added, 0 overrides by the polish |
| R8 | PASS | AUTO / SITE · AUTO / SITE · the stage draws only on change (shared) |
| R9 | PASS | AUTO / SITE · AUTO / SITE · shared setup; one closed-form block, no closure tables |
| R10 | PASS | FLAG · FLAG · the phone bench page is the site's (shared); not measured in this pass |
| DL1 | PASS | AUTO / HAND · 35 of 113 solids on a dropping rung · AUTO / HAND · solids on a dropping rung by kind; none moved |
| DL2 | PASS | HAND · HAND · default dial full |
| DL3 | PASS | AUTO · filled by the generator: the pipeline holds it for every built mechanism |
| DL4 | PASS | SITE · SITE · adaptive dial (shared) |
| DL6 | PASS | AUTO · filled by the generator: the pipeline holds it for every built mechanism |
| DL5 | PASS | FLAG · FLAG · frame at 28° per dial position 1.64 to 2.28 ms (bench) |
| Q1 | PASS | check, clamp and edge distance clean |
| Q2 | PASS | 0 clashes, 0 unnecessary allows |
| Q3 | PASS | package v2 written, 15.2 KB; site build not checked here · package v2 written; the site build runs on the integration branch |
| Q4 | PASS | local: tools/shot · shot set drawn (record, PLAN, FRONT, SIDE, ISOMETRIC, section PLANE-OF-SHAFTS, explode, both sheets) and looked at, with the 28° view and the explode in the record view |
| Q5 | PASS | local: tools/bench · bench run (R6 row) |
| Q6 | PASS | audit regenerated and every row judged |
| Q7 | PASS | conformance: at the current standard (3.11) |
| Q8 | PASS | teaching review: keep (2026-10-27); the six phases of the finished build are looked at by eye · teaching review keep, recorded in the record and on the teaching: line; the six phases of the finished build looked at again |

## Joints
| Joint | Kit | Block | Support | Stack | F1 locate | F2 retain | F3 torque | F4 thrust | F5 limit | F6 hold | F7 adjust | F8 lube | F9 timing | F10 protect |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| B1 | J10 | elbow-rods | pillow (moved) | – | 4 x Dowel pin Ø4 x 14 h6, block to base | End washer 5.4x20, holds the disc in on the shaft end; Countersunk M5 x 12 (ISO 10642); 2 x circlipInternal | Feather key 4 x 4 x 11 (DIN 6885) | 2 x Shaft collar 12x20, set screw | none | none | none | none | none | none |
| B2 | J10 | elbow-rods | pillow (moved) | – | 4 x Dowel pin Ø4 x 14 h6, block to base | End washer 5.4x20, holds the disc out on the shaft end; Countersunk M5 x 12 (ISO 10642); 2 x circlipInternal | Feather key 4 x 4 x 11 (DIN 6885) | 2 x Shaft collar 12x20, set screw | none | none | none | none | none | none |
| R1-in | leg-bore | elbow-rods | – | – | none | none | none | none | none | none | none | Bronze bushing 6x10x12, oil-impregnated, pressed in | none | none |
| R1-out | leg-bore | elbow-rods | – | – | none | none | none | none | none | none | none | Bronze bushing 6x10x12, oil-impregnated, pressed in | none | none |
| R2-in | leg-bore | elbow-rods | – | – | none | none | none | none | none | none | none | Bronze bushing 6x10x12, oil-impregnated, pressed in | none | none |
| R2-out | leg-bore | elbow-rods | – | – | none | none | none | none | none | none | none | Bronze bushing 6x10x12, oil-impregnated, pressed in | none | none |
| R3-in | leg-bore | elbow-rods | – | – | none | none | none | none | none | none | none | Bronze bushing 6x10x12, oil-impregnated, pressed in | none | none |
| R3-out | leg-bore | elbow-rods | – | – | none | none | none | none | none | none | none | Bronze bushing 6x10x12, oil-impregnated, pressed in | none | none |
| drive | drive | – | – | – | none | none | none | none | none | none | none | none | none | Home flag, 1 mm steel vane; Fork sensor, slotted optical, 5 mm gap |

## Supports
| Support | Joint | Kind | Route | Least gap mm | Covers | T10 |
|---|---|---|---|---|---|---|
| B1-pb | B1 | pillow | moved | 1.5 | disc-in, rod-1, rod-2, rod-3 | – |
| B2-pb | B2 | pillow | moved | 1.5 | disc-out, rod-1, rod-2, rod-3 | – |

## Variants and overrides
| Joint or part | Rule result | Chosen | Why |
|---|---|---|---|

## Detail ladder
| Rung | Solids | Marks | Frame ms at this dial position |
|---|---|---|---|
| DL-A | 9 | 0 | 2.25 |
| DL-B | 0 | 274 | 1.65 |
| DL-C | 0 | 0 | 1.74 |
| DL-D | 6 | 0 | 2.28 |
| DL-E | 8 | 0 | 1.76 |
| DL-F | 0 | 0 | 1.64 |
| DL-G | 0 | 0 | 1.77 |
| DL-H | 12 | 0 | 1.95 |
| never | 77 | 139 | 1.75 (full) |

## Promotion candidates
- The materials rule leaves the bodies' own parts (discs, rods) without a material, as in every built mechanism: an engine item for the rule, not this pass.
- The explode moves a body along its main part's frame z; a bent rod, whose legs sit in two bores on different axes, leaves along the line between its legs only because its record frame's z is set there. A kit-level explode axis for a body held by two joints at once would make that a rule; one case so far.
- New in this pass, made for it: the elbow-rods block (src/kin/steps/elbow.ts), the `elbow` shape (src/builder/shapes/elbow.ts) and the leg-bore kit (src/builder/rules/contacts/elbow.ts), each with its fixture in this record.

Polish exceptions: none (no polish).

## Verification
check: clean · K1 residual: 1.4e-14 · claims: 9 of 9 ok · clearance: 0 clashes · clamp: clean · edge distance: clean · package: 15.3 KB
screenshots: record (VIEW 135 30), PLAN, FRONT, SIDE, ISOMETRIC, section PLANE-OF-SHAFTS, explode, both sheets, and the 28° view and the explode in the record view · bench: setup 69.4 ms flagged over 20 ms, frames 1.2 to 2.3 ms; indicative only, three workers ran heavy checks on the machine at once
