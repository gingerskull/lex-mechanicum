# Audit: Nosferatu crypt-lid quick-return (crypt-lid-quick-return)
standard: 3.12 · date: 2026-10-28 · result: pass · detail: full · pass: build
teaching: tweak · decisions in the record

## Summary
PASS 156 · FAIL 0 · N/A 12 · open: none

## Requirements
| Id | Status | Evidence / action |
|---|---|---|
| S1 | PASS | DATA · standard 3.12 carries its version header and changelog, P14 included |
| S2 | PASS | HAND · header standard 3.12, date, result, detail and the teaching line written by this pass |
| S3 | PASS | AUTO · filled by the generator: the pipeline holds it for every built mechanism |
| S4 | PASS | SITE · issue #266 holds only this mechanism's decisions and open items; the plan's decisions are in #263 |
| S5 | PASS | SITE · no engine mark on the page or card |
| S6 | PASS | AUTO · filled by the generator: the pipeline holds it for every built mechanism |
| P1 | PASS | DATA · record v3 complete (kin and teaching blocks); polish3.ts, audit.md present |
| P2 | PASS | DATA · facets from the controlled vocabularies; the catalogue validates |
| P3 | PASS | DATA / SITE · ratio Stroke (lid swing 73.7°, 2.39:1, occupant 72°), axes Offset parallel, character Quick-return, Reciprocating and Non-uniform, backdrivable Partly, four other names, family, level, dof, motorised |
| P4 | PASS | DATA · tags grouped as function, property and application, ten keywords underneath |
| P5 | PASS | DATA · explain motion, forces, benefits, limits; four invented uses with one line each, as P14 allows |
| P6 | PASS | DATA · a seasonal mechanism links nothing (P14): no references, media or real_world; three generated-image prompts take their place, shown once each image is made and reviewed |
| P7 | PASS | HAND / SITE · the polish names materials and explode groups only; all prose and teaching labels from the record |
| P8 | PASS | SITE · no parts list, build section or joint sections on the page |
| P9 | PASS | AUTO / HAND · every number in explain is a claim: 73.7°, 253.7°, 106.3°, 2.39:1, 72°, 20 mm, 35°, 22°; the uses' 2.1 s and 0.9 s at 20 rpm agree with the strokes |
| P10 | PASS | HAND · lid tip trace with the comet and 15° ticks, crank pin and crown traces, the two extreme lines and the opening and slam arcs, plot of the lid and the occupant against the crank |
| P11 | PASS | DATA · plain language, short sentences, no em dashes, mm and degrees |
| P12 | PASS | AUTO / DATA · record v3 validates: catalogue and kin-check clean |
| P13 | PASS | HAND · teaching review T2 run on the record before the build and recorded in teaching.review (tweak) |
| P14 | PASS | HAND / DATA · a seasonal record (season: Halloween, 31 October; duty Commercial): invented uses, themed scenery and labels, festive decoration on the coffin, lid and figurine; no links, three generated-image prompts; the kinematics and every check hold |
| K1 | PASS | AUTO · K1 residual 4.3e-14 (tolerance 1e-9) over 360 samples, reference 5.1e-14 |
| K2 | PASS | AUTO · check: finite, continuous, periodic over 360 samples |
| K3 | PASS | AUTO / HAND · 4 blocks (slider-dyad, cam-rocker, dyad, follow); no numeric fallback · slider-dyad for the lever, cam-rocker (new, src/kin/steps/camrocker.ts, with a fixture) for the cam and rocker, dyad for the hip four-bar, follow for the figure keyed on the hip shaft; closed form, no numeric fallback |
| K4 | PASS | HAND · roles: crank driver with the accent, lever and occupant output, cam, rocker and roller followers, link, coffin frame |
| K6 | PASS | DATA · beta = acos(r/d) = 53.13° with r 30, d 50; swing 73.74°, 253.7° and 106.3° as build.defining_relations; the cam and four-bar sizes as stated there, the departures from the catalogue entry noted in build.notes |
| K7 | PASS | DATA · drivers input (rotary) · input rotary on the crank shaft C |
| K8 | PASS | AUTO / DATA · every joint declared with type, bodies, origin and axis; the crank pin in the lever's slot is a pin-in-slot, the cam roller a cam contact |
| K9 | PASS | DATA · one rotary driver, a control |
| K10 | PASS | AUTO / DATA · the hip dyad held on its declared branch over the cycle, the roller on the reference side of the rocker's arc; no design choice |
| K11 | PASS | AUTO · mobility counted 4, dof 1 |
| K12 | PASS | DATA · lid tip P, crown, crank pin A named; lid and occupant angles, the pressure angle, the pin's distance from O and the lid path are outputs |
| T1 | PASS | HAND · the quick-return reads first: crank, slotted lever with the lid on it, the extremes and the two arcs; the cam and four-bar second; the coffin and figurine are the seasonal scenery the waiver allows (P14) and never cover the drive |
| T2 | PASS | HAND · review tweak 2026-10-28 (cam and rocker redesigned, hip shaft moved); six phases looked at again on the finished build at 0, 60, 120, 180, 240 and 300 degrees: rising, high with the occupant up, high with him down before the slam, shut, opening slowly |
| T3 | PASS | DATA · principle: crank, lever, cam, rocker, roller, link, occupant, points P and A |
| T4 | PASS | DATA · fired: trace-marks (no solids) · the lid tip carries the comet and 15° ticks, spread on the opening and bunched on the slam; the crank pin and the crown traced |
| T5 | PASS | DATA · the lever's two extreme lines from O (β 53.1°) and the opening and slam arcs of the crank pin |
| T6 | PASS | HAND / DATA · a 73.7° lid swing at a 2.39:1 time ratio and a 72° sit-up read at the default size |
| T7 | PASS | DATA · VIEW 300 24: from the foot end with the drive on the right, the occupant facing the viewer as he sits up; the opening phase shows the lid high and him up |
| T8 | PASS | DATA · section cam, cut between the rocker and the crank: the cam, its roller and the swinging rocker in elevation, highlighted; drawn in both sheets |
| T9 | PASS | AUTO / DATA · claim table: 8 ok, 0 off, 0 uncheckable of 8 |
| T10 | PASS | AUTO · 84 solids drawn see-through: figure-cape, figure-collar-l, figure-collar-r, figure-body, figure-head, figure-arm-l, figure-arm-r, figure-fore-l · filled by the generator: a rule built solids for it |
| T11 | PASS | AUTO · 4 supports routed, 4 moved off a sweep · filled by the generator: a rule built solids for it |
| T12 | PASS | HAND · 27 support solids; dropped by the polish: none |
| T13 | N/A | DATA · no fast feature: the slam spans 106° |
| T14 | PASS | HAND / DATA · the crank driver is the only control; at fixed controls the turn repeats |
| T15 | PASS | HAND · labels β 53.1°, OPENING 253.7°, SLAM 106.3°, LID ANGLE, OCCUPANT ANGLE: mechanics, with the seasonal names the waiver allows |
| T16 | PASS | HAND / STYLE · no two like parts of one role need telling apart |
| T17 | PASS | AUTO · filled by the generator: the pipeline holds it for every built mechanism |
| D1 | PASS | HAND · fired: wheels (no solids) · crank, link and hip arm tapered links with bosses; slotted lever with walls as wide as its end radius; cam a profile with its zero line; rocker a plate round its three pins |
| D2 | PASS | HAND · bosses round every pin; the lever's arm and bar carry the lid's weight to the lever's hub |
| D3 | PASS | STYLE · STYLE: roles by pattern and tone |
| D4 | PASS | AUTO · fired: base (3 solids), feet (4 solids) · filled by the generator: a rule built solids for it |
| D5 | PASS | AUTO / HAND · pillow block pairs for the four shafts in plan; the coffin on four turned legs screwed through the base |
| D6 | PASS | HAND / STYLE · the decoration sits on the scenery only (coffin, lid, figurine) as the seasonal waiver asks, and drops first on the detail ladder; the drive stays plain and in front |
| D8 | PASS | AUTO / HAND · every part a profile, an operation and a frame: plates and links extruded across y, the legs, columns and roller turned, the walls, panels and linings extruded along their own normals |
| D9 | N/A | AUTO / HAND · fired: j12-cvt (no solids) · no stretched, conveyed or deforming member |
| D10 | PASS | AUTO · filled by the generator: the pipeline holds it for every built mechanism |
| D11 | PASS | AUTO · SOLID: 0 of 273 solids unsound |
| D7 | PASS | HAND · the mechanism's parts carry only load shape; the carved decoration is on the scenery, as P14 allows |
| A1 | PASS | AUTO · R J3, E J3, F J3, G J10, C J10, O J10, H J10, A J4, K J7, drive drive · filled by the generator: the pipeline holds it for every built mechanism |
| A2 | PASS | AUTO · R J3, E J3, F J3, G J10, C J10, O J10, H J10, A J4, K J7, drive drive · filled by the generator: the pipeline holds it for every built mechanism |
| A3 | PASS | AUTO · fired: classify (11 solids), axial stack builder · filled by the generator: a rule built solids for it |
| A4 | PASS | AUTO · fired: j1-dead-axle (no solids), axial stack builder · stepped shafts: live crank and hip shafts keyed, dead lid and rocker axles clamped in their blocks, end washers and countersunk screws on the overhung ends |
| A5 | PASS | AUTO · fired: j2-live-shaft (no solids), j10-shaft-in-plan (120 solids), axial stack builder · filled by the generator: a rule built solids for it |
| A6 | PASS | AUTO · fired: j5-slide (no solids), j13-compliant (no solids), standoffs (no solids) · no standoffs: the coffin stands on its four turned legs, each screwed up through the base (posts) |
| A7 | PASS | AUTO · fired: base (3 solids), posts (12 solids), feet (4 solids) · filled by the generator: a rule built solids for it |
| A8 | PASS | AUTO · fired: fasteners (61 solids) · filled by the generator: a rule built solids for it |
| A9 | PASS | AUTO / HAND · fired: placement solver · single shear throughout, shortest overhang, two blocks far apart: the lever sweeps over the crank and rocker shafts, so their blocks stand inboard and the parts overhang; the lever and hip arm are the outermost parts, their blocks outboard |
| A10 | PASS | HAND · fired: placement (82 solids), placement solver · four slabs: lever and hip arm outermost, crank and link, the rocker, cam and roller innermost; parts whose sweeps never meet share a slab |
| A11 | PASS | AUTO / HAND · fired: j12-flexible (no solids), strap-sheave (no solids), j1-dead-axle (no solids) · lid: lid, cheek, bar, lever, its bearing, the dead axle, two blocks, base; occupant: figure hub, keyed hip shaft, two blocks, base; coffin: legs to base |
| A12 | PASS | AUTO · clamp check clean |
| A13 | PASS | AUTO / HAND · 273 solids, 174 unnamed (further items of a listed set) · named hardware: bearings, shoulder bolts Ø3 to Ø5, M3 to M5 screws, Ø5 to Ø12 shafts, feather keys, collars; unnamed rows are further items of a named set |
| A14 | PASS | AUTO / HAND · fired: support router · router least gap 1.5 mm; clearance 0 over 72 phases |
| A15 | PASS | AUTO · clearance in 3D over 72 phases: 0 clashes; hand allow: 1 named, 0 unnecessary |
| A16 | PASS | HAND · 10 joint notes; no note: none; no badge: none · ten joint notes with badges; build rules: the lever sweeps over C so the crank overhangs, the lid hangs on the lever by an arm and a cheek, the figure is keyed on the hip shaft through the coffin wall, the cam's base circle sized against undercut and the rocker's axle |
| A17 | PASS | HAND · lid off the lever, figure off its hip shaft, coffin off its legs, then the drive's parts off their shaft ends and the blocks off the base; every screw reachable |
| A18 | PASS | AUTO · placement: 4 slabs in the tallest stack (47.0 mm), 0 clevises; stack per joint in the Joints table · filled by the generator: the pipeline holds it for every built mechanism |
| A19 | PASS | AUTO · 4 supports routed (4 moved), least gap 1.5 mm; still covering a principle part, drawn see-through: G-pb, C-pb, O-pb, H-pb · four pillow block pairs routed off the sweeps; the rocker's blocks stand under the coffin, past the crank's; where they still cover principle parts in the default view they are drawn see-through |
| A20 | PASS | AUTO · support per joint: G pillow, C pillow, O pillow, H pillow · pillow blocks for the four shafts in plan |
| A21 | PASS | AUTO · kit per joint: R J3, E J3, F J3, G J10, C J10, O J10, H J10, A J4, K J7, drive drive |
| A22 | PASS | AUTO · fired: stops (no solids), adjustable-length (no solids), cable-clip (2 solids) · filled by the generator: a rule built solids for it |
| E1 | PASS | AUTO · every solid has one explode level; levels 0 to 21.64 · filled by the generator: the pipeline holds it for every built mechanism |
| E2 | PASS | AUTO · fired: explode (1 solid) · filled by the generator: a rule built solids for it |
| E3 | PASS | AUTO · fired: explode (1 solid) · filled by the generator: a rule built solids for it |
| E4 | PASS | HAND · the props come off first (lid, figurine, coffin), then the overhung parts off their shafts, the shafts, the blocks |
| E5 | PASS | AUTO · fired: explode (1 solid) · filled by the generator: a rule built solids for it |
| E6 | PASS | AUTO · fired: explode (1 solid) · filled by the generator: a rule built solids for it |
| E7 | PASS | AUTO · fired: explode (1 solid) · filled by the generator: a rule built solids for it |
| E8 | PASS | AUTO · fired: explode (1 solid) · filled by the generator: a rule built solids for it |
| E9 | PASS | HAND · full explode readable in both sheets: each prop leaves whole, nothing inside another part, nothing leaves the frame |
| E10 | PASS | AUTO · fired: explode (1 solid) · filled by the generator: a rule built solids for it |
| J1 | N/A | AUTO · fired: trunnion (no solids), hub (no solids), j1-dead-axle (no solids) · filled by the generator: no joint of this type |
| J2 | N/A | AUTO · fired: j2-live-shaft (no solids) · filled by the generator: no joint of this type |
| J3 | PASS | AUTO · fired: j3-moving-pin (26 solids), cross-bearings (no solids), oblique-journal (no solids), eccentric-bearing (no solids), spider-pin (no solids), ball-socket (no solids), ring-hub (no solids), eccentric (no solids) · filled by the generator: a rule built its kit |
| J4 | PASS | AUTO · fired: pin-hole (no solids), j4-slot-roller (6 solids), pin-lobe (no solids), fork-pin (no solids), die (no solids) · filled by the generator: a rule built its kit |
| J5 | N/A | AUTO · fired: tongue-slot (no solids), integrator-carriage (no solids), piston-bore (no solids), j5-slide (no solids), leg-bore (no solids) · filled by the generator: no joint of this type |
| J6 | N/A | AUTO · fired: j6-mesh (no solids), friction-contact (no solids), ring-carrier (no solids), pin-ring (no solids), ring-rollers (no solids) · filled by the generator: no joint of this type |
| J7 | PASS | AUTO · fired: ball-socket (no solids), groove-cam (no solids), j7-cam (1 solid), pallet-contact (no solids), pawl-tooth (no solids) · filled by the generator: a rule built its kit |
| J8 | N/A | AUTO · fired: j12-flexible (no solids), j8-belt (no solids) · filled by the generator: no joint of this type |
| J9 | N/A | AUTO · fired: j9-crossed-mesh (no solids) · filled by the generator: no joint of this type |
| J10 | PASS | AUTO · fired: j12-cvt (no solids), j10-shaft-in-plan (120 solids), j11-screw (no solids) · filled by the generator: a rule built its kit |
| J12 | N/A | AUTO · fired: j12-flexible (no solids), j12-cvt (no solids), j12-other (no solids), strap-sheave (no solids) · filled by the generator: no joint of this type |
| J13 | N/A | AUTO · fired: j13-compliant (no solids) · filled by the generator: no joint of this type |
| J11 | N/A | AUTO · fired: j11-screw (no solids) · filled by the generator: no joint of this type |
| F1 | PASS | AUTO · served at G, C, O, H; fired: posts (12 solids), integrator-carriage (no solids), j2-live-shaft (no solids), j10-shaft-in-plan (120 solids), ring-carrier (no solids), pin-ring (no solids), hub (no solids), strap-sheave (no solids), j13-compliant (no solids), covers (no solids) · filled by the generator: a rule built solids for it |
| F2 | PASS | AUTO · served at R, E, F, G, C, O, H; fired: wheels (no solids), j12-flexible (no solids), j2-live-shaft (no solids), j10-shaft-in-plan (120 solids), cross-bearings (no solids), oblique-journal (no solids), trunnion (no solids), ring-carrier (no solids), eccentric-bearing (no solids), pin-ring (no solids), spider-pin (no solids), fork-pin (no solids), ring-hub (no solids), eccentric (no solids), hub (no solids), leg-bore (no solids), ring-rollers (no solids), strap-sheave (no solids), j11-screw (no solids), j13-compliant (no solids), covers (no solids) · filled by the generator: a rule built solids for it |
| F3 | PASS | AUTO · served at R, E, F, C; fired: j12-flexible (no solids), j2-live-shaft (no solids), j10-shaft-in-plan (120 solids), j11-screw (no solids) · filled by the generator: a rule built solids for it |
| F4 | PASS | AUTO / HAND · served at C, H; fired: j9-crossed-mesh (no solids), j2-live-shaft (no solids), j10-shaft-in-plan (120 solids), trunnion (no solids), spider-pin (no solids), j11-screw (no solids) · collars against the located blocks' inner races on the live shafts; the dead axles are clamped |
| F5 | PASS | AUTO / HAND · served at no joint; fired: integrator-carriage (no solids), j5-slide (no solids), pawl-tooth (no solids), j11-screw (no solids), j13-compliant (no solids), stops (no solids) · the lid is driven both ways and cannot over-travel; it lands on the neoprene bump stop at the foot end when shut |
| F6 | PASS | AUTO / HAND · served at no joint; fired: friction-contact (no solids), j12-flexible (no solids), j12-cvt (no solids), trunnion (no solids), j7-cam (1 solid), pallet-contact (no solids), pawl-tooth (no solids) · the figure's weight holds the roller on the cam through the four-bar (it falls back toward lying); no spring needed |
| F7 | N/A | AUTO / HAND · served at no joint; fired: j6-mesh (no solids), friction-contact (no solids), j9-crossed-mesh (no solids), j12-flexible (no solids), j12-cvt (no solids), j5-slide (no solids), j12-other (no solids), adjustable-length (no solids), covers (no solids) · no exact length a maker sets: the lid's swing is the crank radius and the pivot distance machined in, the sit-up a look |
| F8 | PASS | AUTO · served at A; fired: tongue-slot (no solids), j12-flexible (no solids), cross-bearings (no solids), ball-socket (no solids), eccentric (no solids), leg-bore (no solids), j11-screw (no solids), lubrication (no solids) · felt oiler on the crank pin's roller in the slot; sealed bearings elsewhere |
| F9 | PASS | AUTO / HAND · served at K; fired: j6-mesh (no solids), j9-crossed-mesh (no solids), timing-marks (2 solids) · zero line engraved on the cam; the crank and cam keyed on one shaft keep their phase |
| F10 | PASS | AUTO / HAND · served at drive; fired: j12-flexible (no solids), drive (30 solids) · home flag on the drive pulley and a fork sensor on the motor bracket |
| M1 | PASS | AUTO · fired: hardware primitives · top-face edges chamfered by the primitives |
| M2 | PASS | HAND · bosses round every loaded hole; no wheel that starts and stops needs arms |
| M3 | PASS | AUTO · fired: j3-moving-pin (26 solids), hardware primitives · filled by the generator: a rule built solids for it |
| M4 | PASS | AUTO / HAND · fired: base (3 solids), fasteners (61 solids) · counterbores and countersinks for the heads; countersunk end screws on the overhung shafts |
| M5 | PASS | AUTO / HAND · fired: hardware primitives · the slot full-radius ended; outlines filleted |
| M6 | PASS | AUTO · edge distance and walls clean |
| M7 | PASS | HAND · the lid's cheek filleted where the arm's load turns into the lid |
| M8 | PASS | AUTO · fired: j1-dead-axle (no solids) · thread undercuts on the stepped shafts |
| M9 | PASS | AUTO / HAND · fired: j1-dead-axle (no solids) · ISO coarse threads, lengths from the series |
| M10 | PASS | AUTO / HAND · 265 of 273 solids name a material · materials named; the scenery in walnut, quilted satin, carved lime wood and neoprene by the polish, the rest by the rules; the unnamed are bearing balls and cages of named bearings |
| M11 | PASS | AUTO · fired: j1-dead-axle (no solids), hardware primitives · centre holes, chamfered ends and flats on the turned shafts |
| M12 | PASS | HAND · every screw reachable by its key with the props off; bearings pressed out through their blocks' bores |
| M13 | PASS | AUTO / HAND · 33 threaded · threadlocker or nyloc on every threaded fastener (the rules' defaults) |
| M14 | PASS | AUTO / HAND · fired: tongue-slot (no solids), piston-bore (no solids), pin-hole (no solids), j4-slot-roller (6 solids), pin-lobe (no solids), groove-cam (no solids), pallet-contact (no solids), eccentric (no solids), die (no solids), hub (no solids), leg-bore (no solids) · hardened wear strips in the lever's slot; the cam hardened |
| V1 | PASS | AUTO · fired: drive (30 solids) · filled by the generator: a rule built solids for it |
| V2 | PASS | AUTO · fired: drive (30 solids) · filled by the generator: a rule built solids for it |
| V3 | PASS | AUTO / HAND · fired: drive (30 solids) · belt and pulleys on the crank shaft's free end, beyond the coffin's head end, clear of everything (clearance 0) |
| V4 | PASS | AUTO · fired: j8-belt (no solids) · flanged pulleys, set screws, slotted bracket for tension |
| V5 | PASS | AUTO · fired: drive (30 solids) · filled by the generator: a rule built solids for it |
| V6 | PASS | AUTO · fired: drive (30 solids), cable-clip (2 solids) · filled by the generator: a rule built solids for it |
| L1 | PASS | STYLE · STYLE: no look values in the record or polish; the decoration's line styles and fill spacing are global (src/style) |
| L2 | PASS | HAND · the record and polish carry geometry, roles, materials and groups only |
| L3 | PASS | HAND · roles right: driver crank, output lever and occupant, frame coffin, followers |
| L4 | PASS | HAND / STYLE · accent on the crank shaft only |
| L5 | PASS | AUTO / HAND · fired: see-through (52 solids) · covering blocks, coffin walls and props drawn see-through where they hide a principle part |
| L6 | PASS | AUTO · filled by the generator: the pipeline holds it for every built mechanism |
| L7 | PASS | STYLE · STYLE: turntable orbit, named views |
| L8 | PASS | AUTO / HAND · fired: trace-marks (no solids) · carving, quilting and hatching drawn as fine ink marks on their faces; trace marks on the base |
| L9 | PASS | AUTO / DATA · the cam section cuts and hatches the rocker and the parts it meets |
| L10 | PASS | AUTO / STYLE · overlays in the sheet's look |
| R1 | PASS | HAND · parts from the builder's kits and primitives; the decoration through the shared pieces, patterns and turned posts |
| R2 | PASS | HAND · four bearing sizes, M3 to M5 screws, Ø5 to Ø12 shafts, GT2 32:16 |
| R3 | PASS | AUTO · fired: hardware primitives · shared subassemblies from the rules |
| R4 | PASS | AUTO · package v2 40.3 KB · filled by the generator: the pipeline holds it for every built mechanism |
| R5 | PASS | HAND · the polish states materials and explode groups only, no sampling |
| R6 | PASS | FLAG · FLAG: bench on the desktop: frames 1.3 to 1.6 ms (under 8 ms), explode 1.35 ms; setup 61.3 ms over the 20 ms target, 52 ms of it the GPU's first frame, as for the other recent mechanisms; the phone is measured by the owner |
| R7 | PASS | HAND / FLAG · polish 16 lines (1.7 KB); 0 solids added, 133 overrides by the polish |
| R8 | PASS | AUTO / SITE · SITE: thumbnails and cards pre-rendered |
| R9 | PASS | AUTO / SITE · SITE: one context, edges in the worker |
| R10 | PASS | FLAG · FLAG: the phone bench page is the owner's to run |
| DL1 | PASS | AUTO / HAND · 112 of 273 solids on a dropping rung · every solid on a rung by kind and role; the decoration (ornament pieces, carve and quilt marks) on DL-A, so it drops first; nothing moved on the ladder |
| DL2 | PASS | HAND · default dial full |
| DL3 | PASS | AUTO · filled by the generator: the pipeline holds it for every built mechanism |
| DL4 | PASS | SITE · SITE: adaptive dial |
| DL6 | PASS | AUTO · filled by the generator: the pipeline holds it for every built mechanism |
| DL5 | PASS | FLAG · FLAG: rungs and frame times in the bench report |
| Q1 | PASS | check, clamp and edge distance clean |
| Q2 | PASS | 0 clashes, 0 unnecessary allows |
| Q3 | PASS | package v2 written, 40.3 KB; site build not checked here · package v2 written, 40 KB; the site build is the integrator's (the page needs the seasonal format) |
| Q4 | PASS | local: tools/shot · shot set drawn in both sheets: record view, PLAN, FRONT, SIDE, ISOMETRIC, the cam section, full explode; looked at by eye and against the concept; the six phases |
| Q5 | PASS | local: tools/bench · bench run; flags in R6 |
| Q6 | PASS | every requirement judged |
| Q7 | PASS | at standard 3.12 |
| Q8 | PASS | teaching review: tweak (2026-10-28); the six phases of the finished build are looked at by eye · teaching review tweak recorded in the record and on the teaching line; the six phases of the finished build looked at again |

## Joints
| Joint | Kit | Block | Support | Stack | F1 locate | F2 retain | F3 torque | F4 thrust | F5 limit | F6 hold | F7 adjust | F8 lube | F9 timing | F10 protect |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| R | J3 | – | – | – | none | Internal circlip DIN 472, Ø7; Shoulder bolt Ø3 x 20, M2.5 (ISO 7379) | Shoulder bolt Ø3 x 20, M2.5 (ISO 7379) | none | none | none | none | none | none | none |
| E | J3 | dyad | – | – | none | Shoulder bolt Ø5 x 16, M4 (ISO 7379) | Shoulder bolt Ø5 x 16, M4 (ISO 7379) | none | none | none | none | none | none | none |
| F | J3 | – | – | – | none | Shoulder bolt Ø5 x 12, M4 (ISO 7379) | Shoulder bolt Ø5 x 12, M4 (ISO 7379) | none | none | none | none | none | none | none |
| G | J10 | cam-rocker | pillow (moved) | – | 4 x Dowel pin Ø4 x 14 h6, block to base; Dead shaft Ø5, clamped in two pillow blocks | End washer 3.4x13, holds the rocker on the shaft end; Countersunk M3 x 8 (ISO 10642); 2 x Set screw M4 on a flat, clamps the dead shaft (F2, F3) | none | none | none | none | none | none | none | none |
| C | J10 | driver | pillow (moved) | – | 4 x Dowel pin Ø4 x 14 h6, block to base | End washer 5.4x18, holds the crank on the shaft end; Countersunk M5 x 12 (ISO 10642); 2 x Internal circlip DIN 472, Ø19 | Feather key 3 x 3 x 5 (DIN 6885); 2 x Clamp hub Ø10x20, two set screws at 90°; 2 x Set screw M4 (DIN 916), threadlocked; Feather key 3 x 3 x 7 (DIN 6885) | Inner-race spacer 10.2x13; 2 x Shaft collar 10x18, set screw | none | none | none | none | none | none |
| O | J10 | slider-dyad | pillow (moved) | – | 4 x Dowel pin Ø4 x 14 h6, block to base; Dead shaft Ø12, clamped in two pillow blocks | End washer 5.4x20, holds the lever on the shaft end; Countersunk M5 x 12 (ISO 10642); 2 x Set screw M4 on a flat, clamps the dead shaft (F2, F3) | none | none | none | none | none | none | none | none |
| H | J10 | dyad | pillow (moved) | – | 4 x Dowel pin Ø4 x 14 h6, block to base | End washer 3.4x14, holds the figure on the shaft end; Countersunk M3 x 8 (ISO 10642); 2 x circlipInternal | none | Inner-race spacer 6.2x9; 2 x Shaft collar 6x14, set screw | none | none | none | none | none | none |
| A | J4 | slider-dyad | – | – | none | none | none | none | none | none | none | Felt oiler, oil-soaked wool felt | none | none |
| K | J7 | cam-rocker | – | – | none | none | none | none | none | none | none | none | Cam | none |
| drive | drive | – | – | – | none | none | none | none | none | none | none | none | none | Home flag, 1 mm steel vane; Fork sensor, slotted optical, 5 mm gap |

## Supports
| Support | Joint | Kind | Route | Least gap mm | Covers | T10 |
|---|---|---|---|---|---|---|
| G-pb | G | pillow | moved | 1.5 | cam, rocker, link, occupant | – |
| C-pb | C | pillow | moved | 1.5 | rocker, link, occupant, lever | – |
| O-pb | O | pillow | moved | 1.5 | crank, lever | – |
| H-pb | H | pillow | moved | 1.5 | lever, cam, rocker, roller, link, occupant, crank | – |

## Variants and overrides
| Joint or part | Rule result | Chosen | Why |
|---|---|---|---|
| coffin, lid, figurine, legs | steel and aluminium | walnut, quilted satin, carved lime wood, neoprene bump stop | M10: the seasonal scenery is made as a carved wooden toy (polish) |
| coffin, lid, figurine pieces | each piece explodes as a part | each prop one explode unit | E2, E9: the carved pieces are glued to what they decorate (polish) |

## Detail ladder
| Rung | Solids | Marks | Frame ms at this dial position |
|---|---|---|---|
| DL-A | 53 | 716 | 1.63 |
| DL-B | 0 | 616 | 1.64 |
| DL-C | 0 | 0 | 1.73 |
| DL-D | 17 | 0 | 1.62 |
| DL-E | 9 | 1 | 1.6 |
| DL-F | 0 | 0 | 1.61 |
| DL-G | 0 | 0 | 1.67 |
| DL-H | 33 | 0 | 1.59 |
| never | 161 | 194 | 1.6 |

## Promotion candidates
None from a hand fix. Engine work of this pass, in the library: the cam-rocker block (src/kin/steps/camrocker.ts: a plate
cam's swinging roller follower, the roller centre at the pitch radius on the rocker's arc) and its cam's outline
(src/builder/shapes/swingcam.ts); decoration for seasonal scenery (src/builder/decor.ts: pieces turned or given by their
axes, carved marks, quilting and hatching, ornaments on DL-A; turned posts, no standoffs under a body on posts); a shaft in
plan run on to parts overhung past its blocks (`overhung`), the drive on its free end; the 3D check's rigid inverse made a
true inverse. Polish exceptions (R7): materials of the scenery and the props' explode groups (above).

## Verification
check: clean · K1 residual: 4.3e-14 · claims: 8 of 8 ok · clearance: 0 clashes · clamp: clean · edge distance: clean · package: 40.3 KB
screenshots: the shot set in both sheets (record view VIEW 300 24, PLAN, FRONT, SIDE, ISOMETRIC, section cam, full explode)
and the six phases at 0 to 300 degrees, looked at by eye against the concept sheet (out of the repository, in the pass's PR) ·
bench: desktop, frames at 28 deg 1.6 ms paced, explode 1.35 ms, setup 61.3 ms (over the 20 ms target, a flag; 52 ms of it the
GPU's first frame)
