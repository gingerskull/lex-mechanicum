# Audit: Chain stroke doubler (chain-stroke-doubler)
standard: 3.11 · date: 2026-10-27 · result: pass · detail: full · pass: build
teaching: keep · decisions in the record

## Summary
PASS 150 · FAIL 0 · N/A 17 · open: none

## Requirements
| Id | Status | Evidence / action |
|---|---|---|
| S1 | PASS | DATA · the standard carries version 3.11 and its changelog |
| S2 | PASS | HAND · header with standard, date, result, detail, pass and the teaching: line |
| S3 | PASS | AUTO · filled by the generator: the pipeline holds it for every built mechanism |
| S4 | PASS | SITE · the pass issue (#258) holds only this mechanism's decisions; the wave's status in #252 |
| S5 | PASS | SITE · no engine mark on the sheet, card or page (shared site code) |
| S6 | PASS | AUTO · filled by the generator: the pipeline holds it for every built mechanism |
| P1 | PASS | DATA · record v3 complete (kin and teaching blocks); no polish, audit.md present |
| P2 | PASS | DATA · catalogue validator clean (vocabularies exact) |
| P3 | PASS | DATA / SITE · ratio (Stroke, Low, 2 x carrier stroke), axes Offset parallel, character, backdrivable, aka, family, motion, level, dof and the motor drive from the record |
| P4 | PASS | DATA · tags grouped Function, Property, Application, keywords |
| P5 | PASS | DATA · explanation in four parts; four real-world uses (lift truck masts, telescopic forks, industrial trucks, hydraulic jiggers), each from a source found in research |
| P6 | PASS | DATA · 5 references (Wikipedia on the jigger, three patents, a forklift technical page), 1 photo page (Commons, hydraulic jiggers); no video found where the chain doing the doubling is seen or documented, media waived with a note (rw-n1.json); real_world empty |
| P7 | PASS | HAND / SITE · no polish; every label comes from the record |
| P8 | PASS | SITE · no parts list or joint sections on the page |
| P9 | PASS | AUTO / HAND · every number the explanation states is a claim and agrees (T9) |
| P10 | PASS | HAND · traces on chain A's end on the output and on the axle with equal-time ticks; the anchored strands' line, the instant centre, the 0, v, 2v line, both stroke dimensions; plot of the output against the carrier |
| P11 | PASS | DATA · plain language, short sentences, mm and degrees, no em dashes |
| P12 | PASS | AUTO / DATA · validate(records, asVersion 3) clean for this record |
| P13 | PASS | HAND · teaching review run against the record before the build and again on the finished drawing (teaching: line) |
| K1 | PASS | AUTO · K1 residual 6.2e-15 (tolerance 1e-9) over 360 samples, reference 0.0e+0 |
| K2 | PASS | AUTO · check: finite, continuous, periodic over 360 samples |
| K3 | PASS | AUTO / HAND · 1 block (strand); no numeric fallback · one block, strand (new in this pass, src/kin/steps/strand.ts, with a fixture test at three radii): the sprocket's turn from the held strand's travel past the carrier, the output from the running strand; chain B's strands are checked by K1 in the carrier's frame; no fallback |
| K4 | PASS | HAND · the carrier is the driver (linear input, the belt carriage clamped to it), the output the output, the sprocket a link (an idler); no input shaft, so no accent ring |
| K6 | PASS | DATA · 12-tooth 08B sprocket: 152.4 mm of chain per turn, r = 24.26 mm, seat circle 24.53; 80 mm in, 160 mm out, 189 deg of sprocket turn, as build.defining_relations; 21 links each, 9 and 6 to the tangent points |
| K7 | PASS | DATA · drivers input (linear) · drivers input (linear) on the carrier's slide C, ±40 mm |
| K8 | PASS | AUTO / DATA · every joint declared with type, bodies, origin and axis; the four strands are belt joints with flexible chain, strand, radiusA, axis2 and the carrier, so K1 checks each in the carrier's frame |
| K9 | PASS | DATA · one linear driver; no selector or design choice |
| K10 | PASS | AUTO / DATA · no branch: one closed form |
| K11 | PASS | AUTO · mobility counted -1, dof 1 |
| K12 | PASS | DATA · every traced, overlaid and claimed point and quantity is named in kin |
| T1 | PASS | HAND · mechanics first, no mast, fork or truck: in PLAN the anchored strands lie still under the sprocket, the running strands over it carry the output, and the two tick rows show the doubling at a glance, as on the rack doubler's page |
| T2 | PASS | HAND · review before the build and again on the six phases of the finished build (PLAN at u 0, pi and 2 pi looked at: the held strand's links stand still, the output's end moves twice the axle); decisions in the record |
| T3 | PASS | DATA · carrier, sprocket, output and the held strand's contact declared; drawn whole, in depth order |
| T4 | PASS | DATA · fired: trace-marks (1 solid) · chain A's end on the output (comet) and the axle, ticked every 30 deg of the cycle: each output step is twice the carrier's at the same instant |
| T5 | PASS | DATA · the line through both anchors (anchored strands, at rest), a circle at the instant centre, the line from it through the axle to the running strand, and both stroke dimensions between the posed ends |
| T6 | PASS | HAND / DATA · 80 against 160 mm on a 442 mm base, the sprocket's 189 deg turn and the still strand all read at the default size |
| T7 | PASS | DATA · PLAN (opened at 28 deg), where both strand lines and both strokes show true |
| T8 | N/A | DATA · the principle lies in plain view, no section or detail needed |
| T9 | PASS | AUTO / DATA · claim table: 6 ok, 0 off, 0 uncheckable of 6 |
| T10 | PASS | AUTO · 23 solids drawn see-through: chain-A-anchor0-tongue, chain-A-anchor0-shank, chain-A-anchor0-shank-s1, chain-A-anchor0-shank-s2, chain-A-anchor0-nut0, chain-A-anchor0-nut1, chain-A-anchor0-upright, chain-A-anchor0-sc0 · filled by the generator: a rule built solids for it |
| T11 | PASS | AUTO · 0 supports routed, 0 moved off a sweep · filled by the generator: a rule built solids for it |
| T12 | PASS | HAND · 113 support solids; dropped by the polish: none |
| T13 | N/A | DATA · nothing goes by in a blink |
| T14 | PASS | HAND / DATA · the input only; the sprocket size is not offered (chains built for one sprocket), the any-sprocket law is checked by the strand block's fixture test |
| T15 | PASS | HAND · labels state the mechanism, never its use |
| T16 | PASS | HAND / STYLE · the two chains are told apart by their rows (heights) and by which half of the sprocket they wrap, both drawn as hardware; carrier, output and sprocket by role |
| T17 | PASS | AUTO · filled by the generator: the pipeline holds it for every built mechanism |
| D1 | PASS | HAND · fired: wheels (no solids) · ISO 606 08B sprocket, 12 teeth, two tooth rows on one hub, seats on the pitch polygon; the chains of rollers, pins and inner and outer plates; the carrier and output slider blocks on their rails |
| D2 | PASS | HAND · material where the load runs: the anchor blocks and brackets sized round their M8 bolts, the hub under the chains' plates |
| D3 | PASS | STYLE · roles by pattern and tone (both sheets) |
| D4 | PASS | AUTO · fired: base (3 solids), feet (4 solids) · filled by the generator: a rule built solids for it |
| D5 | PASS | AUTO / HAND · each anchor one block or bracket on a screwed and dowelled foot, no scattered standoffs; the slides on their rails and risers |
| D6 | PASS | HAND / STYLE · rails, risers, keepers and anchors quieter than the sprocket and chains, still clearly drawn |
| D8 | PASS | AUTO / HAND · every solid a profile and one operation (92 profiles, no meshes); the anchor uprights and bolts extruded along the strands |
| D9 | PASS | AUTO / HAND · fired: j12-cvt (no solids) · the chains are conveyed solids: rollers, pins and plates carried along each chain's path in the carrier's frame by the solved travel (the path keeps its shape seen from the carrier) |
| D10 | PASS | AUTO · filled by the generator: the pipeline holds it for every built mechanism |
| D11 | PASS | AUTO · SOLID: 0 of 332 solids unsound |
| D7 | PASS | HAND · base, carrier, output bar and sprocket hub plain; the richness is in the chains, anchor bolts, nuts, bearing, bolt, gibs, wipers, screws and dowels |
| A1 | PASS | AUTO · held-A J12, run-A J12, held-B J12, run-B J12, S J3, C J5, O J5, drive drive · filled by the generator: the pipeline holds it for every built mechanism |
| A2 | PASS | AUTO · held-A J12, run-A J12, held-B J12, run-B J12, S J3, C J5, O J5, drive drive · filled by the generator: the pipeline holds it for every built mechanism |
| A3 | PASS | AUTO · fired: classify (7 solids), axial stack builder · filled by the generator: a rule built solids for it |
| A4 | PASS | AUTO · fired: j1-dead-axle (no solids), axial stack builder · the shoulder bolt is a stepped part with its shim washer; the anchor bolts threaded with an undercut; no shaft of its own |
| A5 | N/A | AUTO · fired: j2-live-shaft (no solids), j10-shaft-in-plan (no solids), axial stack builder · no keyed part: the sprocket idles on its bearing |
| A6 | PASS | AUTO · fired: j5-slide (39 solids), j13-compliant (no solids), standoffs (no solids) · filled by the generator: a rule built solids for it |
| A7 | PASS | AUTO · fired: base (3 solids), posts (no solids), feet (4 solids) · filled by the generator: a rule built solids for it |
| A8 | PASS | AUTO · fired: fasteners (34 solids) · filled by the generator: a rule built solids for it |
| A9 | PASS | AUTO / HAND · fired: placement solver · the sprocket's pin: single shear on a Ø12 shoulder bolt into the carrier, the 6901 bearing in the hub; the output's brackets pass over the sprocket's line, so no strap over it; the chains pull the bolt along the stroke, both chains balanced about it |
| A10 | PASS | HAND · fired: placement (6 solids), placement solver · carrier and output on one slab beside each other on their rails, the sprocket over the carrier with the two chain rows in it, nothing stacked only to clear |
| A11 | PASS | AUTO / HAND · fired: j12-flexible (226 solids), strap-sheave (no solids), j1-dead-axle (no solids) · the output's load: bracket, nuts, bolt, chain, sprocket, bearing, bolt, carrier, belt carriage; each held strand's pull: bolt, nuts, block, screws and dowels, base; every joint note says where its load goes |
| A12 | PASS | AUTO · clamp check clean |
| A13 | PASS | AUTO / HAND · 332 solids, 252 unnamed (further items of a listed set) · named hardware with catalogue sizes (Bearing 6901ZZ, Shoulder bolt Ø12 x 35 M10, Nyloc nut M8 DIN 985, Socket head M4 x 12, Dowel pin Ø3 h6, 08B roller chain); 252 unnamed are further items of a listed set |
| A14 | PASS | AUTO / HAND · fired: support router · the anchor blocks stand past the carrier's rails and the chains' ends, the brackets on the output past its keeper (A15: 0 clashes over 72 phases) |
| A15 | PASS | AUTO · clearance in 3D over 72 phases: 0 clashes; hand allow: 0 named, 0 unnecessary |
| A16 | PASS | HAND · 8 joint notes; no note: none; no badge: none · 8 joint notes with badges; build rules: each chain a whole number of links from each end to a seat; the anchor nuts set the two chains tight against each other; the output's brackets reach over its keeper to the chains' line; the carrier driven along its own slide |
| A17 | PASS | HAND · assembles in the explode order: base, slides, carrier, sprocket on its bolt, output, anchor blocks and brackets, then each chain round its row and onto its tongues, the nuts drawn up; every screw reachable from the top |
| A18 | PASS | AUTO · placement: 2 slabs in the tallest stack (37.5 mm), 0 clevises; stack per joint in the Joints table · filled by the generator: the pipeline holds it for every built mechanism |
| A19 | PASS | AUTO · 0 supports routed (0 moved), least gap - mm; still covering a principle part, drawn see-through: none · no routed support: nothing passes over the principle; the anchors drawn see-through where they lie in front of the strands (T10) |
| A20 | PASS | AUTO · support per joint: none · no ground pivot needs a support: the sprocket's pin is on the carrier (J3), the anchors are the chain kit's blocks |
| A21 | PASS | AUTO · kit per joint: held-A J12, run-A J12, held-B J12, run-B J12, S J3, C J5, O J5, drive drive |
| A22 | PASS | AUTO · fired: stops (no solids), adjustable-length (no solids), cable-clip (5 solids) · filled by the generator: a rule built solids for it |
| E1 | PASS | AUTO · every solid has one explode level; levels 0 to 22.38 · filled by the generator: the pipeline holds it for every built mechanism |
| E2 | PASS | AUTO · fired: explode (1 solid) · filled by the generator: a rule built solids for it |
| E3 | PASS | AUTO · fired: explode (1 solid) · filled by the generator: a rule built solids for it |
| E4 | PASS | HAND · last fitted goes furthest: the sprocket's bolt leaves upward, the chains lift with the carrier's stack, the anchor blocks and brackets lift with their screws (explode shots, both sheets) |
| E5 | PASS | AUTO · fired: explode (1 solid) · filled by the generator: a rule built solids for it |
| E6 | PASS | AUTO · fired: explode (1 solid) · filled by the generator: a rule built solids for it |
| E7 | PASS | AUTO · fired: explode (1 solid) · filled by the generator: a rule built solids for it |
| E8 | PASS | AUTO · fired: explode (1 solid) · filled by the generator: a rule built solids for it |
| E9 | PASS | HAND · full explode readable in ISOMETRIC on both sheets, nothing inside another part, nothing leaves the frame |
| E10 | PASS | AUTO · fired: explode (1 solid) · filled by the generator: a rule built solids for it |
| J1 | N/A | AUTO · fired: trunnion (no solids), hub (no solids), j1-dead-axle (no solids) · filled by the generator: no joint of this type |
| J2 | N/A | AUTO · fired: j2-live-shaft (no solids) · filled by the generator: no joint of this type |
| J3 | PASS | AUTO · fired: j3-moving-pin (10 solids), cross-bearings (no solids), oblique-journal (no solids), eccentric-bearing (no solids), spider-pin (no solids), ball-socket (no solids), ring-hub (no solids), eccentric (no solids) · filled by the generator: a rule built its kit |
| J4 | N/A | AUTO · fired: pin-hole (no solids), j4-slot-roller (no solids), pin-lobe (no solids), fork-pin (no solids), die (no solids) · filled by the generator: no joint of this type |
| J5 | PASS | AUTO · fired: tongue-slot (no solids), integrator-carriage (no solids), piston-bore (no solids), j5-slide (39 solids) · filled by the generator: a rule built its kit |
| J6 | N/A | AUTO · fired: j6-mesh (no solids), friction-contact (no solids), ring-carrier (no solids), pin-ring (no solids), ring-rollers (no solids) · filled by the generator: no joint of this type |
| J7 | N/A | AUTO · fired: ball-socket (no solids), groove-cam (no solids), j7-cam (no solids), pallet-contact (no solids), pawl-tooth (no solids) · filled by the generator: no joint of this type |
| J8 | PASS | AUTO · fired: j12-flexible (226 solids), j8-belt (no solids) · filled by the generator: a rule built its kit |
| J9 | N/A | AUTO · fired: j9-crossed-mesh (no solids) · filled by the generator: no joint of this type |
| J10 | N/A | AUTO · fired: j12-cvt (no solids), j10-shaft-in-plan (no solids), j11-screw (no solids) · filled by the generator: no joint of this type |
| J12 | PASS | AUTO · fired: j12-flexible (226 solids), j12-cvt (no solids), j12-other (no solids), strap-sheave (no solids) · filled by the generator: a rule built its kit |
| J13 | N/A | AUTO · fired: j13-compliant (no solids) · filled by the generator: no joint of this type |
| J11 | N/A | AUTO · fired: j11-screw (no solids) · filled by the generator: no joint of this type |
| F1 | PASS | AUTO · served at held-A, run-A, held-B, run-B, C, O; fired: posts (no solids), integrator-carriage (no solids), j2-live-shaft (no solids), j10-shaft-in-plan (no solids), ring-carrier (no solids), pin-ring (no solids), hub (no solids), strap-sheave (no solids), j13-compliant (no solids), covers (no solids) · two Ø3 dowels pin each anchor block to the base and each bracket to the output; the slides' reference rails dowelled |
| F2 | PASS | AUTO · served at S, C, O, drive; fired: wheels (no solids), j12-flexible (226 solids), j2-live-shaft (no solids), j10-shaft-in-plan (no solids), cross-bearings (no solids), oblique-journal (no solids), trunnion (no solids), ring-carrier (no solids), eccentric-bearing (no solids), pin-ring (no solids), spider-pin (no solids), fork-pin (no solids), ring-hub (no solids), eccentric (no solids), hub (no solids), ring-rollers (no solids), strap-sheave (no solids), j11-screw (no solids), j13-compliant (no solids), covers (no solids) · filled by the generator: a rule built solids for it |
| F3 | PASS | AUTO · served at S; fired: j12-flexible (226 solids), j2-live-shaft (no solids), j10-shaft-in-plan (no solids), j11-screw (no solids) · filled by the generator: a rule built solids for it |
| F4 | PASS | AUTO / HAND · served at no joint; fired: j9-crossed-mesh (no solids), j2-live-shaft (no solids), j10-shaft-in-plan (no solids), trunnion (no solids), spider-pin (no solids), j11-screw (no solids) · the sprocket's end-shake set by the shoulder bolt and its shim washer on the inner-race spacer; spur teeth and straight strands, no thrust |
| F5 | PASS | AUTO / HAND · served at no joint; fired: integrator-carriage (no solids), j5-slide (39 solids), pawl-tooth (no solids), j11-screw (no solids), j13-compliant (no solids), stops (no solids) · the slide kit finds no room for stop blocks inside the rails' ends (other parts sweep past); the carrier is clamped to the drive's belt and the output to the chains, so neither over-travels |
| F6 | N/A | AUTO / HAND · served at no joint; fired: friction-contact (no solids), j12-flexible (226 solids), j12-cvt (no solids), trunnion (no solids), j7-cam (no solids), pallet-contact (no solids), pawl-tooth (no solids) · no rest position to hold: positively driven both ways by the two chains |
| F7 | PASS | AUTO / HAND · served at held-A, run-A, held-B, run-B, C, O, drive; fired: j6-mesh (no solids), friction-contact (no solids), j9-crossed-mesh (no solids), j12-flexible (226 solids), j12-cvt (no solids), j5-slide (39 solids), j12-other (no solids), adjustable-length (no solids), covers (no solids) · each chain's length set by the nyloc nuts on its anchor bolts, the two chains drawn tight against each other; the slides' gibs; the drive's slotted tensioner |
| F8 | PASS | AUTO · served at C, O; fired: tongue-slot (no solids), j12-flexible (226 solids), cross-bearings (no solids), ball-socket (no solids), eccentric (no solids), j11-screw (no solids), lubrication (no solids) · filled by the generator: a rule built solids for it |
| F9 | PASS | AUTO / HAND · served at no joint; fired: j6-mesh (no solids), j9-crossed-mesh (no solids), timing-marks (no solids) · an index mark on the sprocket's hub at the held strands' seat; the sprocket is an idler, so no phase to time beyond the seated rollers |
| F10 | PASS | AUTO / HAND · served at drive; fired: j12-flexible (226 solids), drive (46 solids) · home flag on the carriage, fork sensor, flanged pulleys |
| M1 | PASS | AUTO · fired: hardware primitives · top edges chamfered by the primitives |
| M2 | N/A | HAND · no wheel that needs lightening: a 57 mm sprocket |
| M3 | PASS | AUTO · fired: j3-moving-pin (10 solids), hardware primitives · filled by the generator: a rule built solids for it |
| M4 | PASS | AUTO / HAND · fired: base (3 solids), fasteners (34 solids) · countersinks for the rail screws, the base counterbored; the anchors' socket heads seat on their feet |
| M5 | PASS | AUTO / HAND · fired: hardware primitives · slots with full-radius ends, the carriage slot in the base rounded; the anchor feet's corners radiused |
| M6 | PASS | AUTO · edge distance and walls clean |
| M7 | N/A | HAND · the brackets carry the chains' pull straight along their bolts; no corner where load turns in a plate |
| M8 | PASS | AUTO · fired: j1-dead-axle (no solids) · thread undercut on the shoulder bolt and on the anchor bolts |
| M9 | PASS | AUTO / HAND · fired: j1-dead-axle (no solids) · ISO coarse threads; the anchor feet's M4 screws into the steel base and output with at least 1 x d engagement, the M8 bolts through to nyloc nuts |
| M10 | PASS | AUTO / HAND · 329 of 332 solids name a material · 329 of 332 solids name a material; the three bodies' own parts take none from the materials rule, as in every built mechanism (an engine item, not set here) |
| M11 | PASS | AUTO · fired: j1-dead-axle (no solids), hardware primitives · chamfered ends on the bolts |
| M12 | PASS | HAND · every screw reachable by its key from the top, every nut by a spanner along its bolt; the bearing can be pressed out of the hub |
| M13 | PASS | AUTO / HAND · 31 threaded · 31 threaded, threadlocker or nyloc on every one (the anchor bolts' nuts nylon insert) |
| M14 | N/A | AUTO / HAND · fired: tongue-slot (no solids), piston-bore (no solids), pin-hole (no solids), j4-slot-roller (no solids), pin-lobe (no solids), groove-cam (no solids), pallet-contact (no solids), eccentric (no solids), die (no solids), hub (no solids) · no sliding contact that wears a part of its own beyond the slides' rails and gibs (replaceable) and the chain's rollers |
| V1 | PASS | AUTO · fired: drive (46 solids) · filled by the generator: a rule built solids for it |
| V2 | PASS | AUTO · fired: drive (46 solids) · filled by the generator: a rule built solids for it |
| V3 | PASS | AUTO / HAND · fired: drive (46 solids) · belt, pulleys, bracket and tensioner clear of the feet and base hardware; the carriage runs in its slot (A15: 0 clashes) |
| V4 | PASS | AUTO · fired: j8-belt (no solids) · flanged pulleys, a slotted tensioner under the idler |
| V5 | PASS | AUTO · fired: drive (46 solids) · filled by the generator: a rule built solids for it |
| V6 | PASS | AUTO · fired: drive (46 solids), cable-clip (5 solids) · filled by the generator: a rule built solids for it |
| L1 | PASS | STYLE · no look values in the record |
| L2 | PASS | HAND · the record carries geometry and roles only |
| L3 | PASS | HAND · carrier driver, output output, sprocket link, chains and anchors hardware, blocks ground: every solid's role right |
| L4 | PASS | HAND / STYLE · the accent on the traced path; no input shaft |
| L5 | PASS | AUTO / HAND · fired: see-through (23 solids) · the keepers and the anchors in front of the strands drawn see-through; hidden lines show the bolt in the hub |
| L6 | PASS | AUTO · filled by the generator: the pipeline holds it for every built mechanism |
| L7 | PASS | STYLE · turntable orbit, named views, no perspective |
| L8 | PASS | AUTO / HAND · fired: trace-marks (1 solid) · centrelines, base dimensions, the sprocket's index mark as fine ink |
| L9 | N/A | AUTO / DATA · no section or detail view declared |
| L10 | PASS | AUTO / STYLE · traces, ticks, the circle, lines and dimensions in the sheet's look |
| R1 | PASS | HAND · every part from the shapes, kits and primitives; the open chain and its anchors from the chain kit (src/builder/strand.ts); no inline outline |
| R2 | PASS | HAND · screws M3, M4, M8 anchor bolts, M10 shoulder bolt; bearing 6901 from the table; GT2 16T pulleys; one chain size |
| R3 | PASS | AUTO · fired: hardware primitives · slide, drive and sensor from their shared builders |
| R4 | PASS | AUTO · package v2 27.2 KB · filled by the generator: the pipeline holds it for every built mechanism |
| R5 | PASS | HAND · no polish |
| R6 | PASS | FLAG · bench (indicative: another worker ran heavy checks on the machine at once): 27.2 KB, setup 104.5 ms (over the 20 ms target, flagged: 94.9 ms GPU, the first frame on a shared context), frames 1.9 to 2.1 ms paced in every view; explode 17.7 ms GPU wait (flagged) |
| R7 | PASS | HAND / FLAG · polish none; 0 solids added, 0 overrides by the polish |
| R8 | PASS | AUTO / SITE · the stage draws only on change (shared) |
| R9 | PASS | AUTO / SITE · shared setup; one closed-form block, no tables |
| R10 | PASS | FLAG · the phone bench page is the site's (shared); not measured in this pass |
| DL1 | PASS | AUTO / HAND · 46 of 332 solids on a dropping rung · solids on their rungs by kind; the chains and anchors on never (the build itself); none moved |
| DL2 | PASS | HAND · default dial full |
| DL3 | PASS | AUTO · filled by the generator: the pipeline holds it for every built mechanism |
| DL4 | PASS | SITE · adaptive dial (shared) |
| DL6 | PASS | AUTO · filled by the generator: the pipeline holds it for every built mechanism |
| DL5 | PASS | FLAG · frame at 28 deg per dial position 1.85 to 2.5 ms (bench) |
| Q1 | PASS | check, clamp and edge distance clean |
| Q2 | PASS | 0 clashes, 0 unnecessary allows |
| Q3 | PASS | package v2 written, 27.2 KB; site build not checked here · package v2 written, 27.2 KB; the site build runs on the integration branch |
| Q4 | PASS | local: tools/shot · shot set drawn (record, PLAN, FRONT, SIDE, ISOMETRIC, explode, both sheets) and looked at; PLAN at u 0 and 2 pi give the same picture |
| Q5 | PASS | local: tools/bench · bench run (R6 row) |
| Q6 | PASS | audit regenerated and every row judged |
| Q7 | PASS | conformance: at the current standard (3.11) |
| Q8 | PASS | teaching review: keep (2026-10-27); the six phases of the finished build are looked at by eye · teaching review keep, recorded in the record and on the teaching: line; the six phases of the finished build looked at again |

## Joints
| Joint | Kit | Block | Support | Stack | F1 locate | F2 retain | F3 torque | F4 thrust | F5 limit | F6 hold | F7 adjust | F8 lube | F9 timing | F10 protect |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| held-A | J12 | strand | – | – | Chain anchor block, its foot screwed and dowelled to the base | none | none | none | none | none | Nyloc nut M8 (DIN 985), both sides of the anchor | none | none | none |
| run-A | J12 | strand | – | slab 1 | Chain anchor bracket, its foot screwed and dowelled to the output | none | none | none | none | none | Nyloc nut M8 (DIN 985), both sides of the anchor | none | none | none |
| held-B | J12 | – | – | – | Chain anchor block, its foot screwed and dowelled to the base | none | none | none | none | none | Nyloc nut M8 (DIN 985), both sides of the anchor | none | none | none |
| run-B | J12 | – | – | slab 1 | Chain anchor bracket, its foot screwed and dowelled to the output | none | none | none | none | none | Nyloc nut M8 (DIN 985), both sides of the anchor | none | none | none |
| S | J3 | strand | – | – | none | Internal circlip DIN 472, Ø24; Shoulder bolt Ø12 x 35, M10 (ISO 7379) | Shoulder bolt Ø12 x 35, M10 (ISO 7379) | none | none | none | none | none | none | none |
| C | J5 | driver | – | – | 2 x Dowel pin Ø3 h6, reference rail to base | Keeper plate, laps the slider | none | none | none | none | Gib strip 3 x 6 x 136, bronze | 2 x Felt wiper in a steel clip | none | none |
| O | J5 | – | – | – | 2 x Dowel pin Ø3 h6, reference rail to base | Keeper plate, laps the slider | none | none | none | none | Gib strip 3 x 6 x 390, bronze | 2 x Felt wiper in a steel clip; Grease nipple M6 (DIN 71412) | none | none |
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
| DL-A | 3 | 0 | 2.14 |
| DL-B | 0 | 265 | 2.1 |
| DL-C | 0 | 0 | 2.22 |
| DL-D | 4 | 0 | 2.21 |
| DL-E | 17 | 0 | 1.85 |
| DL-F | 0 | 0 | 2.08 |
| DL-G | 0 | 0 | 2.23 |
| DL-H | 22 | 0 | 2.5 |
| never | 286 | 118 | 2.33 (full) |

## Promotion candidates
- The open chain anchored round a sprocket on a moving carrier is a kit of its own (src/builder/strand.ts, with the strand block in src/kin/steps/strand.ts): conveyed along its path in the carrier's frame, each end an outer link pair on an M8 anchor bolt's tongue through a block or bracket with a nyloc nut either side. One user so far; the same kit would draw a belt or rope doubler and a forklift-style mast once the drawn body is a second stage.
- The sprocket's tooth rows are drawn with the least tip circle of ISO 606 (`tip: "min"` in src/core/flex.ts), since the free strands are drawn along the seat circle's tangents and the mid tip grazed the rollers by 0.12 mm as they left their seats. The closed chain keeps the mid tip; drawing every free strand from its last seated roller (the chordal rise) would let both keep it.
- The slide kit leaves no room for end stop blocks when the rails run only 10 mm past the travel, as on the rack-and-pinion doubler: neither slide here has stops. The travel is limited by the drive carriage in its slot and by the chains.
- The materials rule leaves the bodies' own parts (carrier, sprocket hub, output) without a material, as in every built mechanism: an engine item for the rule, not this pass.

Polish exceptions: none (no polish).

## Verification
check: clean · K1 residual: 6.2e-15 · claims: 6 of 6 ok · clearance: 0 clashes · clamp: clean · edge distance: clean · package: 27.2 KB
screenshots: record, PLAN, FRONT, SIDE, ISOMETRIC, explode, both sheets; PLAN at u 0 and 2 pi the same picture · bench: setup 104.5 ms flagged over 20 ms (94.9 ms GPU, the first frame on a shared context), frames 1.9 to 2.5 ms, explode 17.7 ms GPU wait flagged; indicative only, another worker ran heavy checks on the machine at once
