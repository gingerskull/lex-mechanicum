# Audit: Plug-door hinge (plug-door-hinge)
standard: 3.13 · date: 2026-11-16 · result: pass · detail: full · pass: build
teaching: keep · decisions in the record

## Summary
PASS 152 · FAIL 0 · N/A 17 · open: none

## Requirements
| Id | Status | Evidence / action |
|---|---|---|
| S1 | PASS | DATA · the standard carries version 3.13 and its changelog |
| S2 | PASS | HAND · header with standard, date, result, detail, pass and the teaching: line |
| S3 | PASS | AUTO · filled by the generator: the pipeline holds it for every built mechanism |
| S4 | PASS | SITE · the pass's decisions on #288 (decisions of 2026-11-15); plan in #285, the track kit in #287 |
| S5 | PASS | SITE · no engine mark on the sheet or the page (site) |
| S6 | PASS | AUTO · filled by the generator: the pipeline holds it for every built mechanism |
| P1 | PASS | DATA · record v3 complete (kin and teaching blocks); polish3.ts, audit.md present |
| P2 | PASS | DATA · catalogue validator clean: Linkage, Advanced, Oscillating to Path, Non-uniform, Parallel, Planar |
| P3 | PASS | DATA / SITE · the page reads ratio, axes, character (Non-uniform; the dwell is the hinge tube's, so it stays in the prose and the claims), backdrivable, aka, family, motion, level, dof and the hand drive from the record |
| P4 | PASS | DATA · tags grouped Function, Property, Application, keywords |
| P5 | PASS | DATA · explanation in four parts and two examples from the record; the aircraft use only in examples |
| P6 | PASS | DATA · Wikipedia, EP 0 317 037 A2 and US 4,854,010, the Commons photo page; no real footage found, the video slot waived with its note (rw-n2.json) |
| P7 | PASS | HAND / SITE · no prose in the polish; labels come from the record |
| P8 | PASS | SITE · the page has no parts list or joint sections (site) |
| P9 | PASS | AUTO / HAND · every number the explanation states is a claim and agrees (T9): 26 mm dwell, about 10 degrees, 157 and 180 degrees |
| P10 | PASS | HAND · free-edge corner traced as a comet with ticks every 10, the hinge-edge corner and the follower traced; plot of door angle against hinge-tube angle, the dwell a vertical run at 0 |
| P11 | PASS | DATA · plain language, short sentences, mm and degrees, no em dashes |
| P12 | PASS | AUTO / DATA · validate(records, asVersion 3) clean for this record, the driver's hand point and the pieces' joints checked |
| P13 | PASS | HAND · teaching review run against the record before the build (round 1) and again on the finished build (round 2), recorded in the record's review note |
| P14 | N/A | HAND / DATA · not a seasonal record |
| K1 | PASS | AUTO · K1 residual 4.5e-13 (tolerance 1e-9) over 360 samples, reference 1.2e-12 |
| K2 | PASS | AUTO · check: finite, continuous, periodic over 360 samples |
| K3 | PASS | AUTO / HAND · 3 blocks (target-path, dyad); no numeric fallback · target-path on the composite track runs F; dyad H-F gives G; dyad K-D gives N; no numeric fallback |
| K4 | PASS | HAND · crank driver (accent), goose-neck and guide arm links, door output, wall frame, ground |
| K6 | PASS | DATA · build.defining_relations and notes give HG 40.6, GF 76.6, KN 74.5, ND 21.1 and the three arcs; the solve reads the same numbers |
| K7 | PASS | DATA · drivers hand (manual) · manual: the hand on the door's handle; the driver on H is read back off the pose (cycle from run) |
| K8 | PASS | AUTO / DATA · five revolutes and the pin-in-slot declared with 3D axes; nothing inferred |
| K9 | PASS | DATA · one manual driver hand on H, range -157.4 to 0, cycle from the track run, hand at the door's handle point |
| K10 | PASS | AUTO / DATA · both dyads on branch right, kept over the whole motion (least transmission 41.5 and 44.7 degrees) |
| K11 | PASS | AUTO · mobility counted 1, dof 1 |
| K12 | PASS | DATA · points free-corner, hinge-corner, handle; outputs door-angle, hinge-tube-angle, follower-travel, the two corner paths and the free corner's depth |
| T1 | PASS | HAND · a wall with an opening and a plug door with stop lips, no fuselage or aircraft parts; the motion reads at once: in out of the seat, tip, swing round flat |
| T2 | PASS | HAND · review keep (2026-11-15) on the record; looked at again on the finished build: the six phases read in the drawing, the follower roller named the part to watch and given a section |
| T3 | PASS | DATA · principle: crank, goose-neck, guide arm, door, the follower F and the free corner |
| T4 | PASS | DATA · fired: trace-marks (no solids) · three traces: the free edge (comet, ticks every 10), the hinge edge and the follower along the track |
| T5 | PASS | DATA · no construction overlay: the track itself is the construction, and the follower's trace and the plot show the dwell arc and the swing (T2 decision) |
| T6 | PASS | HAND / DATA · door turns 180 degrees for 157 of hinge tube; the 26 mm dwell turns the door about 10 degrees, visible at the default size |
| T7 | PASS | DATA · PLAN, opening tilted at 28 degrees, the patent's view |
| T8 | PASS | DATA · section follower across the track at the follower's start: the roller held both ways in the groove between the hardened liners, magnified 3 times, the guide arm highlighted |
| T9 | PASS | AUTO / DATA · claim table: 5 ok, 0 off, 0 uncheckable of 5 |
| T10 | PASS | AUTO · 8 solids drawn see-through: wall-jamb, H-slv, H-bb, H-ecl, H-axle-s2, H-axle-s4, H-axle-s5, H-bridge · filled by the generator: a rule built solids for it |
| T11 | PASS | AUTO · 1 support routed, 1 moved off a sweep · filled by the generator: a rule built solids for it |
| T12 | PASS | HAND · 17 support solids; dropped by the polish: none |
| T13 | PASS | DATA · no time map: the follower's cosine run already slows at the closed end where the dwell is, and at the open end |
| T14 | PASS | HAND / DATA · no control: the one manual driver is set by the cycle (from the track run); at fixed controls every cycle repeats the first |
| T15 | PASS | HAND · the record explains the track taking the spare freedom and the dwell arc about G before any use; the aircraft use only in examples |
| T16 | PASS | HAND / STYLE · the goose-neck and the guide arm (both links) are told apart by their levels and their hooks; the crank carries the accent |
| T17 | PASS | AUTO · filled by the generator: the pipeline holds it for every built mechanism |
| T18 | PASS | HAND / DATA · fired: focus (1 solid) · focus: the track roller on the guide arm, small and under the arm in its groove, tinted in the accent with its see-through kept |
| D1 | PASS | HAND · fired: wheels (no solids) · the three arms are one form: 9 mm bars hooked where they pass the jamb, bosses r 6.5 at every pin; plates for the wall, the door and the track plate |
| D2 | PASS | HAND · bosses round every pin, the door bracket a 12 mm block carrying N and D, a raised boss on the crank at K; the hooks follow the clearance, not ornament |
| D3 | PASS | STYLE · roles by pattern and tone from the style |
| D4 | PASS | AUTO · fired: base (3 solids), feet (4 solids) · filled by the generator: a rule built solids for it |
| D5 | PASS | AUTO / HAND · the track plate screwed and dowelled to the base, the bridge bar on spigoted posts, the wall on four posts screwed from under the base, the bumper on a threaded stud, the handle's posts screwed through the door |
| D6 | PASS | HAND / STYLE · nothing cosmetic: every added part locates, holds, carries, limits or is the hand's grip |
| D8 | PASS | AUTO / HAND · every part a profile, an operation and a frame (extrusions and revolves) |
| D9 | N/A | AUTO / HAND · fired: j12-cvt (no solids) · no member changes shape |
| D10 | PASS | AUTO · filled by the generator: the pipeline holds it for every built mechanism |
| D11 | PASS | AUTO · SOLID: 0 of 119 solids unsound |
| D7 | PASS | HAND · the wall, the door panel and the arms carry only their outline and bosses; the richness is in the pins, bearings, roller, liners, felt, stops and the handle |
| A1 | PASS | AUTO · K J3, N J3, G J3, D J3, F track, H J1, drive drive, door-stops stops · filled by the generator: the pipeline holds it for every built mechanism |
| A2 | PASS | AUTO · K J3, N J3, G J3, D J3, F track, H J1, drive drive, door-stops stops · filled by the generator: the pipeline holds it for every built mechanism |
| A3 | PASS | AUTO · fired: classify (6 solids), axial stack builder · filled by the generator: a rule built solids for it |
| A4 | PASS | AUTO · fired: j1-dead-axle (27 solids), axial stack builder · filled by the generator: a rule built solids for it |
| A5 | N/A | AUTO · fired: j2-live-shaft (no solids), j10-shaft-in-plan (no solids), axial stack builder · no keyed shaft: H is a dead axle, every other pin a shoulder bolt |
| A6 | PASS | AUTO · fired: j5-slide (no solids), j13-compliant (no solids), standoffs (no solids) · the wall stands on four posts (two under the wall, two under the jamb piece) clear of the track plate; the bridge bar on two spigoted standoffs |
| A7 | PASS | AUTO · fired: base (3 solids), posts (12 solids), feet (4 solids) · filled by the generator: a rule built solids for it |
| A8 | PASS | AUTO · fired: fasteners (8 solids) · filled by the generator: a rule built solids for it |
| A9 | PASS | AUTO / HAND · fired: column-slide (no solids), placement solver · H in double shear (dead axle from the base to the bridge); N in double shear between the door bracket and its ear over the goose-neck (the door's tipping load); K, G and D single shear because the goose-neck sweeps over G and D and the crank has no path to a fork over K past the bridge: each with a 1 to 2 mm overhang (a raised crank boss at K) and the bolt clamped through its part · H in double shear (dead axle from the base to the bridge); N in double shear between the door bracket and its ear over the goose-neck, for the door's tipping load; K, G and D single shear, as the goose-neck sweeps over G and D and the crank has no way to a fork over K past the bridge: overhangs 1 mm at K (the crank's raised boss) and 2 mm at G and D, one 684ZZ in each 6 mm plate as the J3 kit builds it |
| A10 | PASS | HAND · fired: placement (14 solids), placement solver · four levels: the guide arm over the track plate, the crank and the door bracket in one plane (their sweeps never meet), the goose-neck, then the door's ear; the gap under the goose-neck clears G's bolt head, which it passes over, and the crank's raised boss at K fills it at the pin |
| A11 | PASS | AUTO / HAND · fired: j12-flexible (no solids), strap-sheave (no solids), j1-dead-axle (27 solids) · door load: N (double shear) to the goose-neck, K to the crank, H's dead axle to the base and the bridge, both screwed and dowelled; D to the guide arm, G to the crank; the follower's side load into the hardened liners and the screwed, dowelled plate |
| A12 | PASS | AUTO · clamp check clean |
| A13 | PASS | AUTO / HAND · 119 solids, 64 unnamed (further items of a listed set) · 119 solids named by catalogue size and material where listed (shoulder bolts ISO 7379, 684ZZ, DIN 471 and 472, ISO 4762, ISO 10642, the Ø16 stud-type track roller); unnamed only further items of a listed set |
| A14 | PASS | AUTO / HAND · fired: support router · the router keeps the bridge 1.5 mm off every sweep; the hand-placed bumper and handle are judged by the clash check (0 clashes) |
| A15 | PASS | AUTO · clearance in 3D over 72 phases: 0 clashes; hand allow: 0 named, 0 unnecessary |
| A16 | PASS | HAND · 8 joint notes; no note: none; no badge: none · 8 notes with badges (6 joints, drive, door stops). Build rules: one hinge level, the guide arm lowest over the track plate; the door bracket shares the crank's plane, the ear over the goose-neck takes N's tipping load; the goose-neck stands over G's head, the crank's boss raised to it at K; D's pin turned head down; the door stops on its lips closed and on the wall's bumper open |
| A17 | PASS | HAND · order: base and feet; track plate screwed and dowelled; wall on its posts; H's axle, the crank on it, the bridge; the guide arm with its roller dropped in the groove, G; the goose-neck on K; the door hung on N (bolt down through the ear) and D (bolt up from under the guide arm); the handle and the bumper last. Every head reachable with a key, nothing trapped |
| A18 | PASS | AUTO · placement: 3 slabs in the tallest stack (41.0 mm), 0 clevises; stack per joint in the Joints table · filled by the generator: the pipeline holds it for every built mechanism |
| A19 | PASS | AUTO · 1 support routed (1 moved), least gap 1.5 mm; still covering a principle part, drawn see-through: H-bridge · the bridge over H moved off the sweeps, least gap 1.5 mm; shaped as a narrow bar from each post to a boss at H (owner, 2026-11-16), it still crosses the crank, goose-neck and guide arm and is drawn see-through |
| A20 | PASS | AUTO · support per joint: H bridge · H a bridge over a dead axle (nothing sweeps over it); the moving pins shoulder bolts on bearings |
| A21 | PASS | AUTO · kit per joint: K J3, N J3, G J3, D J3, F track, H J1, drive drive |
| A22 | PASS | AUTO · fired: stops (no solids), adjustable-length (no solids), cable-clip (no solids) · the stops rule serves levers on their pivots and skips the exact crank; the door's stops are its lips and one bumper, in the polish (F5) |
| E1 | PASS | AUTO · every solid has one explode level; levels 0 to 29.73 · filled by the generator: the pipeline holds it for every built mechanism |
| E2 | PASS | AUTO · fired: explode (1 solid) · filled by the generator: a rule built solids for it |
| E3 | PASS | AUTO · fired: explode (1 solid) · filled by the generator: a rule built solids for it |
| E4 | PASS | HAND · the bolts at N and D and the door's ear come off first, then the goose-neck, the crank with the bridge bar on its posts above it, the door and the wall pieces off their posts, the guide arm with its roller lifted out of the groove, H's axle and its spacers up out of the base, the track plate off its dowels; the bumper and its stud leave along their own axis, off the wall's outer face |
| E5 | PASS | AUTO · fired: explode (1 solid) · filled by the generator: a rule built solids for it |
| E6 | PASS | AUTO · fired: explode (1 solid) · filled by the generator: a rule built solids for it |
| E7 | PASS | AUTO · fired: explode (1 solid) · filled by the generator: a rule built solids for it |
| E8 | PASS | AUTO · fired: explode (1 solid) · filled by the generator: a rule built solids for it |
| E9 | PASS | HAND · full explode readable in both sheets: the levels leave upward in order along the pin axes, the follower roller (the accent) clear above its groove, nothing inside another part, nothing leaves the frame |
| E10 | PASS | AUTO · fired: explode (1 solid) · filled by the generator: a rule built solids for it |
| J1 | PASS | AUTO · fired: trunnion (no solids), hub (no solids), j1-dead-axle (27 solids) · filled by the generator: a rule built its kit |
| J2 | N/A | AUTO · fired: j2-live-shaft (no solids) · filled by the generator: no joint of this type |
| J3 | PASS | AUTO · fired: j3-moving-pin (37 solids), cross-bearings (no solids), oblique-journal (no solids), eccentric-bearing (no solids), spider-pin (no solids), ball-socket (no solids), ring-hub (no solids), eccentric (no solids) · filled by the generator: a rule built its kit |
| J4 | PASS | AUTO · fired: pin-hole (no solids), j4-slot-roller (no solids), pin-lobe (no solids), fork-pin (no solids), die (no solids), track-follower (21 solids) · filled by the generator: a rule built its kit |
| J5 | N/A | AUTO · fired: tongue-slot (no solids), integrator-carriage (no solids), piston-bore (no solids), j5-slide (no solids), leg-bore (no solids), column-slide (no solids) · filled by the generator: no joint of this type |
| J6 | N/A | AUTO · fired: j6-mesh (no solids), friction-contact (no solids), ring-carrier (no solids), pin-ring (no solids), ring-rollers (no solids) · filled by the generator: no joint of this type |
| J7 | PASS | AUTO · fired: ball-socket (no solids), groove-cam (no solids), j7-cam (no solids), pallet-contact (no solids), pawl-tooth (no solids), track-follower (21 solids), sole-pad (no solids) · filled by the generator: a rule built its kit |
| J8 | N/A | AUTO · fired: j12-flexible (no solids), j8-belt (no solids), flat-belt (no solids) · filled by the generator: no joint of this type |
| J9 | N/A | AUTO · fired: j9-crossed-mesh (no solids) · filled by the generator: no joint of this type |
| J10 | N/A | AUTO · fired: j12-cvt (no solids), j10-shaft-in-plan (no solids), j11-screw (no solids) · filled by the generator: no joint of this type |
| J12 | N/A | AUTO · fired: j12-flexible (no solids), j12-cvt (no solids), j12-other (no solids), strap-sheave (no solids), flat-belt (no solids) · filled by the generator: no joint of this type |
| J13 | N/A | AUTO · fired: j13-compliant (no solids) · filled by the generator: no joint of this type |
| J11 | N/A | AUTO · fired: j11-screw (no solids) · filled by the generator: no joint of this type |
| F1 | PASS | AUTO · served at F, H; fired: bend-slots (no solids), posts (12 solids), integrator-carriage (no solids), j2-live-shaft (no solids), j10-shaft-in-plan (no solids), ring-carrier (no solids), pin-ring (no solids), hub (no solids), strap-sheave (no solids), j13-compliant (no solids), covers (no solids) · filled by the generator: a rule built solids for it |
| F2 | PASS | AUTO · served at K, N, G, D, F, H; fired: wheels (no solids), j12-flexible (no solids), j2-live-shaft (no solids), j10-shaft-in-plan (no solids), cross-bearings (no solids), oblique-journal (no solids), trunnion (no solids), ring-carrier (no solids), eccentric-bearing (no solids), pin-ring (no solids), spider-pin (no solids), fork-pin (no solids), ring-hub (no solids), eccentric (no solids), hub (no solids), leg-bore (no solids), ring-rollers (no solids), strap-sheave (no solids), j11-screw (no solids), j13-compliant (no solids), covers (no solids) · every pin held: shoulder bolts clamped into their parts, circlips on H's axle and on the roller stud, bearings held by circlips in their bores · every pin held: shoulder bolts clamped into their parts with the bearings between inner-race spacers, circlips on H's axle and on the roller stud |
| F3 | PASS | AUTO · served at K, N, G, D; fired: j12-flexible (no solids), j2-live-shaft (no solids), j10-shaft-in-plan (no solids), column-slide (no solids), j11-screw (no solids) · the shoulder bolts take the joint torque by their clamp; no torque passes through H's dead axle |
| F4 | PASS | AUTO / HAND · served at K, N, F, H; fired: j9-crossed-mesh (no solids), j2-live-shaft (no solids), j10-shaft-in-plan (no solids), trunnion (no solids), spider-pin (no solids), j11-screw (no solids) · thrust washers at H and under the roller, inner-race spacers at K and N, the bearings take the axial load |
| F5 | PASS | AUTO / HAND · served at door-stops; fired: integrator-carriage (no solids), j5-slide (no solids), pawl-tooth (no solids), j11-screw (no solids), j13-compliant (no solids), stops (no solids) · closed: the stop lips on the door's inner face seat on the jambs; open: the door's outer face lands on a neoprene bumper on the wall's outer face, 0.2 mm off at the end of the run |
| F6 | N/A | AUTO / HAND · served at no joint; fired: friction-contact (no solids), j12-flexible (no solids), j12-cvt (no solids), trunnion (no solids), j7-cam (no solids), pallet-contact (no solids), pawl-tooth (no solids) · nothing is held at a setting: the hand holds the door, and closed it rests on its lips |
| F7 | N/A | AUTO / HAND · served at no joint; fired: bend-slots (no solids), j6-mesh (no solids), friction-contact (no solids), j9-crossed-mesh (no solids), j12-flexible (no solids), j12-cvt (no solids), j5-slide (no solids), j12-other (no solids), adjustable-length (no solids), covers (no solids) · nothing to adjust: the track sets the path; the open stop sits 0.2 mm off the door |
| F8 | PASS | AUTO · served at F; fired: tongue-slot (no solids), j12-flexible (no solids), cross-bearings (no solids), ball-socket (no solids), eccentric (no solids), leg-bore (no solids), column-slide (no solids), j11-screw (no solids), lubrication (1 solid) · filled by the generator: a rule built solids for it |
| F9 | N/A | AUTO / HAND · served at no joint; fired: j6-mesh (no solids), j9-crossed-mesh (no solids), timing-marks (1 solid) · no timing between members: the track and the linkage are rigid |
| F10 | PASS | AUTO / HAND · served at no joint; fired: j12-flexible (no solids), drive (7 solids) · the felt oiler and the end reliefs keep the groove clean; sealed bearings and roller |
| M1 | PASS | AUTO · fired: hardware primitives · edge breaks on every hardware primitive; plates filleted 0.5 to 1.5 |
| M2 | PASS | HAND · bosses round every loaded hole, the door bracket thick where N and D bear, the crank's boss at K |
| M3 | PASS | AUTO · fired: j3-moving-pin (37 solids), hardware primitives · filled by the generator: a rule built solids for it |
| M4 | PASS | AUTO / HAND · fired: base (3 solids), fasteners (8 solids) · counterbores for the plate's and base's screws; the handle's screws countersunk in the door's outer face |
| M5 | PASS | AUTO / HAND · fired: hardware primitives · inside corners of the plates and arms radiused (the outlines are stroked) |
| M6 | PASS | AUTO · edge distance and walls clean |
| M7 | PASS | HAND · the arms' bosses run into the bars on radii |
| M8 | PASS | AUTO · fired: j1-dead-axle (27 solids) · filled by the generator: a rule built solids for it |
| M9 | PASS | AUTO / HAND · fired: j1-dead-axle (27 solids) · threads drawn on the axle and the screws |
| M10 | PASS | AUTO / HAND · 114 of 119 solids name a material · materials named on every hardware item; the plates by role (steel arms, aluminium wall and plate, neoprene bumper, phenolic handle) |
| M11 | PASS | AUTO · fired: j1-dead-axle (27 solids), hardware primitives · filled by the generator: a rule built solids for it |
| M12 | PASS | HAND · every screw reached with a key: the posts' screws from under the base, the bridge's from above, the handle's from the door's outer face, D's pin from under the guide arm |
| M13 | PASS | AUTO / HAND · 19 threaded · 19 threaded; threadlocker or nyloc on every threaded fastener (the rules' defaults), the bumper's stud threadlocked |
| M14 | PASS | AUTO / HAND · fired: tongue-slot (no solids), piston-bore (no solids), pin-hole (no solids), j4-slot-roller (no solids), pin-lobe (no solids), groove-cam (no solids), pallet-contact (no solids), eccentric (no solids), die (no solids), track-follower (21 solids), hub (no solids), leg-bore (no solids), sole-pad (no solids) · hardened liners in both walls of the groove, the stud-type roller replaceable on its stud, bronze thrust washers |
| V1 | PASS | AUTO · fired: drive (7 solids) · filled by the generator: a rule built solids for it |
| V2 | PASS | AUTO · fired: drive (7 solids) · filled by the generator: a rule built solids for it |
| V3 | N/A | AUTO / HAND · fired: drive (7 solids) · no motor and no belt: hand operated |
| V4 | N/A | AUTO · fired: j8-belt (no solids) · no belt drive: hand operated |
| V5 | PASS | AUTO · fired: drive (7 solids) · filled by the generator: a rule built solids for it |
| V6 | PASS | AUTO · fired: drive (7 solids), cable-clip (no solids) · filled by the generator: a rule built solids for it |
| L1 | PASS | STYLE · no look value in the record or the polish |
| L2 | PASS | HAND · the record carries no colours or widths |
| L3 | PASS | HAND · roles carry the look |
| L4 | PASS | HAND / STYLE · one accent: the crank, and the focused roller in the same accent |
| L5 | PASS | AUTO / HAND · fired: see-through (8 solids) · the bridge, the jamb piece and H's upper hardware drawn see-through where they cover a principle part |
| L6 | PASS | AUTO · filled by the generator: the pipeline holds it for every built mechanism |
| L7 | PASS | STYLE · PLAN, tilted at 28 degrees on opening |
| L8 | PASS | AUTO / HAND · fired: trace-marks (no solids) · centrelines and traces from the rules; the trace ticks every 10 |
| L9 | PASS | AUTO / DATA · the follower section drawn in both sheets |
| L10 | PASS | AUTO / STYLE · the traces use the sheet's look |
| R1 | PASS | HAND · every joint from its kit; the composite track from the kit of #287; the hand grip and the fork ear from the rules |
| R2 | PASS | HAND · standard sizes: M3 and M4, 684ZZ, Ø16 x 7 track roller, Ø6 stud |
| R3 | PASS | AUTO · fired: hardware primitives · hardware primitives shared |
| R4 | PASS | AUTO · package v2 29.5 KB · filled by the generator: the pipeline holds it for every built mechanism |
| R5 | PASS | HAND · the polish adds the open bumper and its note only |
| R6 | PASS | FLAG · FLAG: bench on the desktop: frames 1.05 to 1.1 ms paced (under 8 ms), 1.42 to 1.52 ms at 28° over the dial; the GPU 1.2 to 2.5 ms and 8.41 ms in the full explode (over the 8 ms target, a flag); setup 47.3 ms on the bench page, 38.6 ms of it the GPU's first frame, over the 20 ms target; the phone is measured by the owner |
| R7 | PASS | HAND / FLAG · polish 12 lines (1.6 KB); 2 solids added, 0 overrides by the polish |
| R8 | PASS | AUTO / SITE · the renderer draws what is seen (site) |
| R9 | PASS | AUTO / SITE · the shared setup (site) |
| R10 | PASS | FLAG · FLAG: the phone bench page is the owner's to run |
| DL1 | PASS | AUTO / HAND · 33 of 119 solids on a dropping rung · every solid on a rung by kind and role; nothing moved on the ladder |
| DL2 | PASS | HAND · default dial full |
| DL3 | PASS | AUTO · filled by the generator: the pipeline holds it for every built mechanism |
| DL4 | PASS | SITE · the adaptive dial is the site's |
| DL6 | PASS | AUTO · filled by the generator: the pipeline holds it for every built mechanism |
| DL5 | PASS | FLAG · FLAG: rungs and frame times in the bench report and the Detail ladder table |
| Q1 | PASS | check, clamp and edge distance clean |
| Q2 | PASS | 0 clashes, 0 unnecessary allows |
| Q3 | PASS | package v2 written, 29.3 KB; site build not checked here · package v2 written, 29.3 KB; the site build runs at PR time |
| Q4 | PASS | local: tools/shot · shot set drawn in both sheets (record view, PLAN, FRONT, SIDE, ISOMETRIC, the follower section, full explode) and the default view at the end of the dwell, mid swing and open, looked at by eye |
| Q5 | PASS | local: tools/bench · bench run; flags in R6 |
| Q6 | PASS | regenerated, every hand row judged; R7 decided by the tools, the polish 12 lines, under the plan's 30 |
| Q7 | PASS | whole-library conformance run at standard 3.13 with this pass |
| Q8 | PASS | teaching review: keep (2026-11-15); the six phases of the finished build are looked at by eye · teaching review keep recorded in the record and on the teaching line; the six phases of the finished build looked at again |

## Joints
| Joint | Kit | Block | Support | Stack | F1 locate | F2 retain | F3 torque | F4 thrust | F5 limit | F6 hold | F7 adjust | F8 lube | F9 timing | F10 protect |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| K | J3 | dyad | – | – | none | Shoulder bolt Ø4 x 16, M3 (ISO 7379) | Shoulder bolt Ø4 x 16, M3 (ISO 7379) | Inner-race spacer 4.2x5.7 | none | none | none | none | none | none |
| N | J3 | – | – | – | none | Shoulder bolt Ø4 x 16, M3 (ISO 7379) | Shoulder bolt Ø4 x 16, M3 (ISO 7379) | Inner-race spacer 4.2x5.7 | none | none | none | none | none | none |
| G | J3 | – | – | – | none | Shoulder bolt Ø4 x 10, M3 (ISO 7379) | Shoulder bolt Ø4 x 10, M3 (ISO 7379) | none | none | none | none | none | none | none |
| D | J3 | dyad | – | – | none | Shoulder bolt Ø4 x 10, M3 (ISO 7379) | Shoulder bolt Ø4 x 10, M3 (ISO 7379) | none | none | none | none | none | none | none |
| F | track | target-path | – | – | 2 x Dowel pin Ø3 h6, through the plate into the base | External circlip DIN 471, Ø6 | none | Thrust washer 6x10, bronze | none | none | none | Felt oiler in the groove's relieved end, oil-soaked wool felt | none | none |
| H | J1 | dyad | bridge (moved) | – | Bridge bar over the pivot, bossed at the pivot, on two spigoted posts; Dead axle Ø4, shouldered, M3 end | External circlip DIN 471, Ø4 | none | Thrust washer 4.2x12, bronze | none | none | none | none | none | none |
| drive | drive | – | – | – | none | none | none | none | none | none | none | none | none | none |
| door-stops | stops | – | – | – | none | none | none | none | Stop bumper, neoprene Ø12, bonded to a steel stud: the door lands on it open; Door panel, its stop lips on the inner face | none | none | none | none | none |

## Supports
| Support | Joint | Kind | Route | Least gap mm | Covers | T10 |
|---|---|---|---|---|---|---|
| H-bridge | H | bridge | moved | 1.5 | crank, goose-neck, guide-arm | see-through |

## Variants and overrides
| Joint or part | Rule result | Chosen | Why |
|---|---|---|---|
| door stops (F5) | the stops rule's pins beside a swinging lever (it skips the exact crank and the door, which has no pivot of its own) | closed on the door's stop lips seated on the jambs; open on a neoprene bumper on the wall's outer face, 0.2 mm off the door at the end of the run | F5, V5: the door lands on the wall, not against a pin beside a pivot (polish) |
| D (guide arm to door) | the shoulder bolt's head on top of the door bracket | turned head down (`head: "-"`), under the guide arm | A14: the goose-neck sweeps over D; nothing passes under the guide arm there (record) |
| H's bridge | the router's plate over the pin and both posts, crossing over the crank | a narrow bar from each post to a boss at H (`bridge: "bar"` on the joint); the posts, spigots, screws and bushing as the router builds them | owner, 2026-11-16: the plate read heavy over the crank; A9 double shear and T12 posts kept (record) |
| N, K (pieces joined to a pin) | one member per body at a pin | the door's ear over the goose-neck and the crank's boss at K are members of their pins' stacks (`joints` on the piece) | A9: N in double shear for the door's tipping load; K's overhang 1 mm (record) |

## Detail ladder
| Rung | Solids | Marks | Frame ms at this dial position |
|---|---|---|---|
| DL-A | 10 | 0 | 1.46 |
| DL-B | 0 | 241 | 1.42 |
| DL-C | 0 | 0 | 1.52 |
| DL-D | 13 | 0 | 1.46 |
| DL-E | 1 | 1 | 1.42 |
| DL-F | 0 | 0 | 1.47 |
| DL-G | 0 | 0 | 1.49 |
| DL-H | 9 | 0 | 1.44 |
| never | 86 | 133 | 1.45 |

## Promotion candidates
Made in this pass, gated so every other build is byte-identical (the solids, notes and issues of all 98 other mechanisms hashed with and without the change): a manual driver's `hand` point on another body (a pull handle on that body's face; the joint a plain pivot); a plate piece with `joints` as a member of those pins' stacks; the track kit reads a placed arm's own faces; a fixed pin's bridge as a narrow bar from each post to a boss at the pin (`bridge: "bar"`, round 3, hashed the same way). Each is used once, here.
For the builder, its own change: `ctx.extent` returns the placement solver's slab even for a body the record places (`place`), so the headroom check reports a false head here (D's, turned under the guide arm, against the goose-neck far above) and a turned pin on a placed body spans wrong unless the body's frame gives its axes (`frame.z`, set here on the guide arm and the door). Fixing it reaches walking-beam, hobsons-joint, wobble-box, turkey-trot-walker and eight-night-indexer.

## Verification
check: clean · K1 residual: 4.5e-13 · claims: 5 of 5 ok · clearance: 0 clashes · clamp: clean · edge distance: clean · package: 29.5 KB
screenshots: the shot set in both sheets (record view, PLAN, FRONT, SIDE, ISOMETRIC, section follower, full explode) in dist/shots3/plug-door-hinge, and the default view at the end of the dwell, mid swing and open, looked at by eye (out of the repository, in the pass's PR) ·
bench: desktop, frames at 28 deg 1.05 ms paced, explode 1.1 ms (GPU 8.41 ms, a flag), setup 47.3 ms on the bench page (over the 20 ms target, a flag; 38.6 ms of it the GPU's first frame)
