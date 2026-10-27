# Audit: Walking-beam transfer (walking-beam)
standard: 3.11 · date: 2026-10-27 · result: pass · detail: full · pass: build
teaching: keep · decisions in the record

## Summary
PASS 147 · FAIL 0 · N/A 20 · open: none

## Requirements
| Id | Status | Evidence / action |
|---|---|---|
| S1 | PASS | DATA · standard 3.11 carries its version header and changelog |
| S2 | PASS | HAND · header standard 3.11, date, result, detail and the teaching line written by this pass |
| S3 | PASS | AUTO · filled by the generator: the pipeline holds it for every built mechanism |
| S4 | PASS | SITE · issue #254 holds only this mechanism's decisions and open items |
| S5 | PASS | SITE · no engine mark on the page or card |
| S6 | PASS | AUTO · filled by the generator: the pipeline holds it for every built mechanism |
| P1 | PASS | DATA · record v3 complete (kin and teaching blocks); no polish, audit.md present |
| P2 | PASS | DATA · facets from the controlled vocabularies; the catalogue validates |
| P3 | PASS | DATA / SITE · ratio Index step, axes Rotary-to-in-plane, character Intermittent and Dwell, backdrivable No, aka, family, level, dof, motorised |
| P4 | PASS | DATA · tags grouped as function, property and application, keywords underneath |
| P5 | PASS | DATA · explain motion, forces, benefits, limits; four real-world uses with one line each |
| P6 | PASS | DATA · Wikipedia and four hard sources (three patents, an engineering guide); Tenova and Wirco photo pages, two videos; real_world two maker or plant videos confirmed by oEmbed |
| P7 | PASS | HAND / SITE · no polish; all prose and teaching labels from the record |
| P8 | PASS | SITE · no parts list, build section or joint sections on the page |
| P9 | PASS | AUTO / HAND · every number in explain.motion is a claim: 40 mm circle, 38.4 mm along, 11.2 mm up, half a turn at rest |
| P10 | PASS | HAND · seat trace with 30 degree ticks, notch line, station and crank radius overlays, plot of a ball's step against the beam's travel |
| P11 | PASS | DATA · plain language, short sentences, no em dashes, mm and degrees |
| P12 | PASS | AUTO / DATA · record v3 validates: catalogue and kin-check clean |
| P13 | PASS | HAND · teaching review T2 run on the record before the build and recorded in teaching.review |
| K1 | PASS | AUTO · K1 residual 8.5e-14 (tolerance 1e-9) over 360 samples, reference 0.0e+0 |
| K2 | PASS | AUTO · check: finite, continuous, periodic over 360 samples |
| K3 | PASS | AUTO / HAND · 2 blocks (parallel-cranks, walking-beam); no numeric fallback · parallel-cranks for the beam, the new walking-beam block (src/kin/steps/transfer.ts) for the balls; closed form, no numeric fallback |
| K4 | PASS | HAND · roles: crank1 driver with the accent, crank2 link, beam and balls output, rails and tracks frame, ground |
| K6 | PASS | DATA · pitch 2r cos a = 38.4 and rise 2r sin a = 11.2 with r = 20, sin a = 0.28, as build.defining_relations; crank spacing equals the beam's pin spacing (80 mm) |
| K7 | PASS | DATA · drivers input (rotary) · input rotary on O1 |
| K8 | PASS | AUTO / DATA · every joint declared with type, bodies, origin and axis; the balls' contacts are pin-in-slot joints with driver windows to construction datums of the seats and the tracks |
| K9 | PASS | DATA · one rotary driver, a control |
| K10 | PASS | AUTO / DATA · the parallelogram held on its parallel branch through the change points at 0 and 180 degrees; no design choice |
| K11 | PASS | AUTO · mobility counted 19, dof 1 |
| K12 | PASS | DATA · stations, track points, the seat and the crank pin named; advance, rise, beam travel and the seat path are outputs |
| T1 | PASS | HAND · mechanics first: rails, beam, two cranks, balls and a return lane, no furnace or press; the stepwise advance and the beam's circle read in the default view |
| T2 | PASS | HAND · review keep 2026-10-27; six phases looked at again on the finished build (n1-shots/walking-beam/t2): lift at 0, carry high at 120, beam below and balls at rest at 240 |
| T3 | PASS | DATA · principle: beam, both cranks, all thirteen balls and the seat point |
| T4 | PASS | DATA · fired: trace-marks (no solids) · the seat at S2 traces the beam's 40 mm circle with equal-time ticks and the comet |
| T5 | PASS | DATA · notch line, station 2r dimension and crank radius dimension |
| T6 | PASS | HAND / DATA · 40 mm circle against a 12 mm ball: the lift and the half-turn rest read at the default size |
| T7 | PASS | DATA · VIEW 32 31 (the owner's stage view after the model was turned 180 degrees about z): the walking plate, both cranks and the seat's circle in front, the return lane behind; ISOMETRIC and DIMETRIC look at the same side |
| T8 | PASS | DATA · detail hand-over at S1, highlighting the beam and the front rail; drawn in both sheets |
| T9 | PASS | AUTO / DATA · claim table: 4 ok, 0 off, 0 uncheckable of 4 |
| T10 | PASS | AUTO · 31 solids drawn see-through: rail-back-post0, rail-back-post1, O1-pb-b0, O1-pb-b0-brg, O1-pb-b0-brg-balls, O1-pb-b0-brg-cage, O1-pb-b0-sc0, O1-pb-b1-foot · filled by the generator: a rule built solids for it |
| T11 | PASS | AUTO · 2 supports routed, 2 moved off a sweep · filled by the generator: a rule built solids for it |
| T12 | PASS | HAND · 24 support solids; dropped by the polish: none |
| T13 | N/A | DATA · no fast feature: every hand-over spans tens of degrees |
| T14 | PASS | HAND / DATA · the crank driver is the only control; at fixed controls the turn repeats (K2 by the balls' next) |
| T15 | PASS | HAND · labels NOTCH LINE, STATION 2r, r, BALL ADVANCE, BEAM TRAVEL: mechanics only |
| T16 | PASS | HAND / STYLE · like balls share one role and pattern; told apart by place, not hue |
| T17 | PASS | AUTO · filled by the generator: the pipeline holds it for every built mechanism |
| D1 | PASS | HAND · fired: wheels (no solids) · cranks are tapered links with bosses; beam and rails are plates with V notches; tracks are V-groove bars |
| D2 | PASS | HAND · material round both beam pins and along the seats; the beam's depth carries the row between the pins |
| D3 | PASS | STYLE · STYLE: roles by pattern and tone |
| D4 | PASS | AUTO · fired: base (3 solids), feet (4 solids) · filled by the generator: a rule built solids for it |
| D5 | PASS | AUTO / HAND · pillow block pairs on the base for both crank shafts; rails and tracks on round posts |
| D6 | PASS | HAND / STYLE · posts and pillow blocks quieter than the beam and the balls |
| D8 | PASS | AUTO / HAND · every part a profile, an operation and a frame: plates extruded across y, the tracks along their own axes, the balls revolved |
| D9 | N/A | AUTO / HAND · fired: j12-cvt (no solids) · no stretched, conveyed or deforming member: the balls are rigid bodies posed by the block |
| D10 | PASS | AUTO · filled by the generator: the pipeline holds it for every built mechanism |
| D11 | PASS | AUTO · SOLID: 0 of 167 solids unsound |
| D7 | PASS | HAND · the beam, rails and tracks carry only their notches, grooves and bores |
| A1 | PASS | AUTO · A1 J3, A2 J3, O1 J10, O2 J10, drive drive · filled by the generator: the pipeline holds it for every built mechanism |
| A2 | PASS | AUTO · A1 J3, A2 J3, O1 J10, O2 J10, drive drive · filled by the generator: the pipeline holds it for every built mechanism |
| A3 | PASS | AUTO · fired: classify (4 solids), axial stack builder · filled by the generator: a rule built solids for it |
| A4 | PASS | AUTO · fired: j1-dead-axle (no solids), axial stack builder · stepped live shaft with D-flat at O1, dead shaft clamped at O2, collars and circlips |
| A5 | PASS | AUTO · fired: j2-live-shaft (no solids), j10-shaft-in-plan (52 solids), axial stack builder · filled by the generator: a rule built solids for it |
| A6 | PASS | AUTO · fired: j5-slide (no solids), j13-compliant (no solids), standoffs (no solids) · rails and tracks on Ø10 posts screwed up through the base (posts rule); pillow blocks screwed and dowelled |
| A7 | PASS | AUTO · fired: base (3 solids), posts (39 solids), feet (4 solids) · filled by the generator: a rule built solids for it |
| A8 | PASS | AUTO · fired: fasteners (45 solids) · filled by the generator: a rule built solids for it |
| A9 | PASS | AUTO / HAND · fired: placement solver · each crank overhung on its shaft end with the shortest overhang: the beam sweeps past the far end, so no clevis or bridge can stand there; two blocks far apart on the near side |
| A10 | PASS | HAND · fired: placement (42 solids), placement solver · two slabs: cranks behind the beam; parts whose sweeps never meet share a plane |
| A11 | PASS | AUTO / HAND · fired: j12-flexible (no solids), strap-sheave (no solids), j1-dead-axle (no solids) · beam pin, bearing in the crank, crank on the shaft, two pillow blocks, base; rails and tracks to posts to base |
| A12 | PASS | AUTO · clamp check clean |
| A13 | PASS | AUTO / HAND · 164 solids, 93 unnamed (further items of a listed set) · named hardware: bearings 686ZZ and 688-2RS, shoulder bolts Ø6 M5, M5 and M6 screws, collars; unnamed rows are further items of a named set |
| A14 | PASS | AUTO / HAND · fired: support router · router least gap 1.5 mm; clearance 0 over 72 phases |
| A15 | PASS | AUTO · clearance in 3D over 72 phases: 0 clashes; hand allow: 0 named, 0 unnecessary |
| A16 | PASS | HAND · 5 joint notes; no note: none; no badge: none · five joint notes with badges; build rules: hand-overs at the diameter's ends, return lane beside the beam, queue moves on the beam's return half, posts clear of the crank sweeps |
| A17 | PASS | HAND · balls off, tracks and rails off their posts, beam off its shoulder bolts, cranks off the shaft ends, blocks off the base; every screw reachable |
| A18 | PASS | AUTO · placement: 2 slabs in the tallest stack (19.0 mm), 0 clevises; stack per joint in the Joints table · filled by the generator: the pipeline holds it for every built mechanism |
| A19 | PASS | AUTO · 2 supports routed (2 moved), least gap 1.5 mm; still covering a principle part, drawn see-through: O1-pb, O2-pb · both pillow block pairs moved behind the beam; still in front of a crank they are drawn see-through |
| A20 | PASS | AUTO · support per joint: O1 pillow, O2 pillow · pillow blocks chosen for both shafts in plan |
| A21 | PASS | AUTO · kit per joint: A1 J3, A2 J3, O1 J10, O2 J10, drive drive |
| A22 | PASS | AUTO · fired: stops (no solids), adjustable-length (no solids), cable-clip (2 solids) · filled by the generator: a rule built solids for it |
| E1 | PASS | AUTO · every solid has one explode level; levels 0 to 15.73 · filled by the generator: the pipeline holds it for every built mechanism |
| E2 | PASS | AUTO · fired: explode (1 solid) · filled by the generator: a rule built solids for it |
| E3 | PASS | AUTO · fired: explode (1 solid) · filled by the generator: a rule built solids for it |
| E4 | PASS | HAND · balls and tracks first, then rails, beam, cranks, shafts and blocks |
| E5 | PASS | AUTO · fired: explode (1 solid) · filled by the generator: a rule built solids for it |
| E6 | PASS | AUTO · fired: explode (1 solid) · filled by the generator: a rule built solids for it |
| E7 | PASS | AUTO · fired: explode (1 solid) · filled by the generator: a rule built solids for it |
| E8 | PASS | AUTO · fired: explode (1 solid) · filled by the generator: a rule built solids for it |
| E9 | PASS | HAND · full explode readable in both sheets; nothing leaves the frame |
| E10 | PASS | AUTO · fired: explode (1 solid) · filled by the generator: a rule built solids for it |
| J1 | N/A | AUTO · fired: trunnion (no solids), hub (no solids), j1-dead-axle (no solids) · filled by the generator: no joint of this type |
| J2 | N/A | AUTO · fired: j2-live-shaft (no solids) · filled by the generator: no joint of this type |
| J3 | PASS | AUTO · fired: j3-moving-pin (18 solids), cross-bearings (no solids), oblique-journal (no solids), eccentric-bearing (no solids), spider-pin (no solids), ball-socket (no solids), ring-hub (no solids), eccentric (no solids) · filled by the generator: a rule built its kit |
| J4 | N/A | AUTO · fired: pin-hole (no solids), j4-slot-roller (no solids), pin-lobe (no solids), fork-pin (no solids), die (no solids) · filled by the generator: no joint of this type |
| J5 | N/A | AUTO · fired: tongue-slot (no solids), integrator-carriage (no solids), piston-bore (no solids), j5-slide (no solids), leg-bore (no solids) · filled by the generator: no joint of this type |
| J6 | N/A | AUTO · fired: j6-mesh (no solids), friction-contact (no solids), ring-carrier (no solids), pin-ring (no solids), ring-rollers (no solids) · filled by the generator: no joint of this type |
| J7 | N/A | AUTO · fired: ball-socket (no solids), groove-cam (no solids), j7-cam (no solids), pallet-contact (no solids), pawl-tooth (no solids) · filled by the generator: no joint of this type |
| J8 | N/A | AUTO · fired: j12-flexible (no solids), j8-belt (no solids) · filled by the generator: no joint of this type |
| J9 | N/A | AUTO · fired: j9-crossed-mesh (no solids) · filled by the generator: no joint of this type |
| J10 | PASS | AUTO · fired: j12-cvt (no solids), j10-shaft-in-plan (52 solids), j11-screw (no solids) · filled by the generator: a rule built its kit |
| J12 | N/A | AUTO · fired: j12-flexible (no solids), j12-cvt (no solids), j12-other (no solids), strap-sheave (no solids) · filled by the generator: no joint of this type |
| J13 | N/A | AUTO · fired: j13-compliant (no solids) · filled by the generator: no joint of this type |
| J11 | N/A | AUTO · fired: j11-screw (no solids) · filled by the generator: no joint of this type |
| F1 | PASS | AUTO · served at O1, O2; fired: posts (39 solids), integrator-carriage (no solids), j2-live-shaft (no solids), j10-shaft-in-plan (52 solids), ring-carrier (no solids), pin-ring (no solids), hub (no solids), strap-sheave (no solids), j13-compliant (no solids), covers (no solids) · filled by the generator: a rule built solids for it |
| F2 | PASS | AUTO · served at A1, A2, O1, O2; fired: wheels (no solids), j12-flexible (no solids), j2-live-shaft (no solids), j10-shaft-in-plan (52 solids), cross-bearings (no solids), oblique-journal (no solids), trunnion (no solids), ring-carrier (no solids), eccentric-bearing (no solids), pin-ring (no solids), spider-pin (no solids), fork-pin (no solids), ring-hub (no solids), eccentric (no solids), hub (no solids), leg-bore (no solids), ring-rollers (no solids), strap-sheave (no solids), j11-screw (no solids), j13-compliant (no solids), covers (no solids) · filled by the generator: a rule built solids for it |
| F3 | PASS | AUTO · served at A1, A2; fired: j12-flexible (no solids), j2-live-shaft (no solids), j10-shaft-in-plan (52 solids), j11-screw (no solids) · filled by the generator: a rule built solids for it |
| F4 | PASS | AUTO / HAND · served at O1; fired: j9-crossed-mesh (no solids), j2-live-shaft (no solids), j10-shaft-in-plan (49 solids), trunnion (no solids), spider-pin (no solids), j11-screw (no solids) · shaft collars locate the live shaft; the dead shaft is clamped |
| F5 | N/A | AUTO / HAND · served at no joint; fired: integrator-carriage (no solids), j5-slide (no solids), pawl-tooth (no solids), j11-screw (no solids), j13-compliant (no solids), stops (no solids) · the cranks turn fully; nothing swings to a limit |
| F6 | N/A | AUTO / HAND · served at no joint; fired: friction-contact (no solids), j12-flexible (no solids), j12-cvt (no solids), trunnion (no solids), j7-cam (no solids), pallet-contact (no solids), pawl-tooth (no solids) · each ball is held in a notch or a groove by its weight; nothing else rests between moves |
| F7 | N/A | AUTO / HAND · served at no joint; fired: j6-mesh (no solids), friction-contact (no solids), j9-crossed-mesh (no solids), j12-flexible (no solids), j12-cvt (no solids), j5-slide (no solids), j12-other (no solids), adjustable-length (no solids), covers (no solids) · the parallelogram's lengths are cut as one plate and one pair of blocks; no mesh or belt to adjust beyond the drive's own tension slot |
| F8 | PASS | AUTO · served at no joint; fired: tongue-slot (no solids), j12-flexible (no solids), cross-bearings (no solids), ball-socket (no solids), eccentric (no solids), j11-screw (no solids), lubrication (no solids) · sealed and shielded bearings; the balls roll dry in hardened grooves |
| F9 | PASS | AUTO / HAND · served at no joint; fired: j6-mesh (no solids), j9-crossed-mesh (no solids), timing-marks (1 solid) · zero line on the input from the timing-marks rule; the cranks are kept in phase by the beam itself |
| F10 | PASS | AUTO / HAND · served at drive; fired: j12-flexible (no solids), drive (30 solids) · home flag and fork sensor on the drive, pulley flanges |
| M1 | PASS | AUTO · fired: hardware primitives · edge breaks from the primitives |
| M2 | PASS | HAND · bosses round every loaded hole; the beam kept plain (open question on lightening windows) |
| M3 | PASS | AUTO · fired: j3-moving-pin (18 solids), hardware primitives · filled by the generator: a rule built solids for it |
| M4 | PASS | AUTO / HAND · fired: base (3 solids), fasteners (46 solids) · counterbores for the base screws, csk end screws on the shaft ends |
| M5 | PASS | AUTO / HAND · fired: hardware primitives · the V notches are cut with a full root by the extrusion; windows none |
| M6 | PASS | AUTO · edge distance and walls clean |
| M7 | N/A | HAND · no bracket corner carries load; the plates are straight |
| M8 | N/A | AUTO · fired: j1-dead-axle (no solids) · no thread meets a shoulder outside the shoulder bolts' own undercuts |
| M9 | PASS | AUTO / HAND · fired: j1-dead-axle (no solids) · ISO coarse threads, standard lengths: M5 x 16, M6 x 16 |
| M10 | PASS | AUTO / HAND · 143 of 164 solids name a material · 143 of 164 solids name a material; the rest are bearing balls and cages of a named bearing |
| M11 | PASS | AUTO · fired: j1-dead-axle (no solids), hardware primitives · chamfered and centred shaft ends from the primitives |
| M12 | PASS | HAND · every screw reachable by its key; pressed bearings pull from their bores |
| M13 | PASS | AUTO / HAND · 29 threaded · 29 threaded fasteners with their locking named |
| M14 | N/A | AUTO / HAND · fired: tongue-slot (no solids), piston-bore (no solids), pin-hole (no solids), j4-slot-roller (no solids), pin-lobe (no solids), groove-cam (no solids), pallet-contact (no solids), eccentric (no solids), die (no solids), hub (no solids) · no sliding contact: the balls roll and the hand-overs are vertical lifts |
| V1 | PASS | AUTO · fired: drive (30 solids) · filled by the generator: a rule built solids for it |
| V2 | PASS | AUTO · fired: drive (30 solids) · filled by the generator: a rule built solids for it |
| V3 | PASS | AUTO / HAND · fired: drive (30 solids) · belt clear of feet, housings and base hardware (clearance 0) |
| V4 | PASS | AUTO · fired: j8-belt (no solids) · flanged pulleys, slotted bracket for tension |
| V5 | PASS | AUTO · fired: drive (30 solids) · filled by the generator: a rule built solids for it |
| V6 | PASS | AUTO · fired: drive (30 solids), cable-clip (2 solids) · filled by the generator: a rule built solids for it |
| L1 | PASS | STYLE · STYLE: no look in the record |
| L2 | PASS | HAND · no colour, weight or font in the record |
| L3 | PASS | HAND · roles right: driver, link, output, frame and ground |
| L4 | PASS | HAND / STYLE · accent only on the input crank |
| L5 | PASS | AUTO / HAND · fired: see-through (6 solids) · covering rails, tracks and posts drawn see-through |
| L6 | PASS | AUTO · filled by the generator: the pipeline holds it for every built mechanism |
| L7 | PASS | STYLE · STYLE: turntable orbit and named views |
| L8 | PASS | AUTO / HAND · fired: trace-marks (no solids) · centrelines on every joint axis, base dimensions |
| L9 | PASS | AUTO / DATA · the detail view drawn by the renderer from the record |
| L10 | PASS | AUTO / STYLE · overlays and trace in the sheet's look |
| R1 | PASS | HAND · no polish; every part from the kits, primitives and the record's plates |
| R2 | PASS | HAND · two bearings, two screw sizes, Ø8 shafts, Ø10 posts, GT2 32:16 |
| R3 | PASS | AUTO · fired: hardware primitives · shared subassemblies: pillow blocks, drive, sensor |
| R4 | PASS | AUTO · package v2 19.2 KB · filled by the generator: the pipeline holds it for every built mechanism |
| R5 | N/A | HAND · no polish |
| R6 | PASS | FLAG · FLAG: bench run, numbers in the verification section (indicative: three workers on one machine) |
| R7 | PASS | HAND / FLAG · polish none; 0 solids added, 0 overrides by the polish |
| R8 | PASS | AUTO / SITE · SITE: thumbnails and redraw on change |
| R9 | PASS | AUTO / SITE · SITE: one context, edges in a worker; the walking-beam block solves each phase once |
| R10 | PASS | FLAG · FLAG: phone numbers come with the bench page at release |
| DL1 | PASS | AUTO / HAND · 37 of 164 solids on a dropping rung · 37 of 164 solids on a dropping rung by their kinds; nothing moved on the ladder |
| DL2 | PASS | HAND · default dial full |
| DL3 | PASS | AUTO · filled by the generator: the pipeline holds it for every built mechanism |
| DL4 | PASS | SITE · SITE |
| DL6 | PASS | AUTO · filled by the generator: the pipeline holds it for every built mechanism |
| DL5 | PASS | FLAG · FLAG: the bench reports the rungs |
| Q1 | PASS | check, clamp and edge distance clean |
| Q2 | PASS | 0 clashes, 0 unnecessary allows |
| Q3 | PASS | package v2 written, 18.7 KB; site build not checked here · package v2 written, 18.8 KB, 164 solids, no SOLID fault |
| Q4 | PASS | local: tools/shot · shot set drawn in both sheets after the turn (n1-shots/walking-beam/turned): record view, PLAN, FRONT, SIDE, ISOMETRIC, DIMETRIC, detail, full explode; looked at by eye; u = 0 and u = 2 pi give the same picture |
| Q5 | PASS | local: tools/bench · bench run (indicative under load) |
| Q6 | PASS | audit regenerated and every row judged |
| Q7 | PASS | conformance: at standard 3.11 |
| Q8 | PASS | teaching review: keep (2026-10-27); the six phases of the finished build are looked at by eye · verdict and decisions in teaching.review and on the teaching line; six phases looked at again |

## Joints
| Joint | Kit | Block | Support | Stack | F1 locate | F2 retain | F3 torque | F4 thrust | F5 limit | F6 hold | F7 adjust | F8 lube | F9 timing | F10 protect |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| A1 | J3 | parallel-cranks | – | – | none | Shoulder bolt Ø6 x 12, M5 (ISO 7379) | Shoulder bolt Ø6 x 12, M5 (ISO 7379) | none | none | none | none | none | none | none |
| A2 | J3 | – | – | – | none | Shoulder bolt Ø6 x 12, M5 (ISO 7379) | Shoulder bolt Ø6 x 12, M5 (ISO 7379) | none | none | none | none | none | none | none |
| O1 | J10 | parallel-cranks | pillow (moved) | – | 4 x Dowel pin Ø4 x 14 h6, block to base | End washer 4.4x16, holds the crank1 on the shaft end; Countersunk M4 x 10 (ISO 10642); 2 x circlipInternal | none | 2 x Shaft collar 8x16, set screw | none | none | none | none | none | none |
| O2 | J10 | parallel-cranks | pillow (moved) | – | 4 x Dowel pin Ø4 x 14 h6, block to base; Dead shaft Ø8, clamped in two pillow blocks | 2 x Set screw M4 on a flat, clamps the dead shaft (F2, F3) | none | none | none | none | none | none | none | none |
| drive | drive | – | – | – | none | none | none | none | none | none | none | none | none | Home flag, 1 mm steel vane; Fork sensor, slotted optical, 5 mm gap |

## Supports
| Support | Joint | Kind | Route | Least gap mm | Covers | T10 |
|---|---|---|---|---|---|---|
| O1-pb | O1 | pillow | moved | 1.5 | beam, crank1 | – |
| O2-pb | O2 | pillow | moved | 1.5 | beam, crank2 | – |

## Variants and overrides
| Joint or part | Rule result | Chosen | Why |
|---|---|---|---|

## Detail ladder
| Rung | Solids | Marks | Frame ms at this dial position |
|---|---|---|---|
| DL-A | 11 | 0 | 1.69 |
| DL-B | 0 | 646 | 1.61 |
| DL-C | 0 | 0 | 1.84 |
| DL-D | 7 | 0 | 2 |
| DL-E | 8 | 0 | 2.07 |
| DL-F | 0 | 0 | 1.92 |
| DL-G | 0 | 0 | 1.85 |
| DL-H | 12 | 0 | 1.98 |
| never | 129 | 120 | 1.92 |

## Promotion candidates
None: no polish, no hand fix. Engine work of this pass, in the library: the walking-beam block (src/kin/steps/transfer.ts:
like parts handed on one slot a turn round a closed circuit, each on the beam while it is above its rails, resting or
rolling on its track otherwise) and the bodies' `next` (K2: after one turn each part stands where the next one stood).
The balls' contacts are pin-in-slot joints with driver windows to two construction datums (the seats, riding the beam,
and the notches and tracks), so K1 checks every ball where it touches and no kit builds hardware for them. Polish
exceptions (R7): none.

## Verification
check: clean · K1 residual: 8.5e-14 · claims: 4 of 4 ok · clearance: 0 clashes · clamp: clean · edge distance: clean · package: 19.2 KB
screenshots: .local/n1-shots/walking-beam/turned (record view VIEW 32 31, PLAN, FRONT, SIDE, ISOMETRIC, DIMETRIC, detail hand-over, full explode; both sheets; loop-u0 and loop-u2pi the same picture; the six phases of the first build in t2) · bench: desktop, frames at 28 deg 1.92 ms paced, setup 50.9 ms (over the 20 ms target, a flag), indicative only: three workers ran heavy checks on the machine at once
