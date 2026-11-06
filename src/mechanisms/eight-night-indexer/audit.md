# Audit: Maccabee eight-night indexer (eight-night-indexer)
standard: 3.13 · date: 2026-11-06 · result: pass · detail: full · pass: build
teaching: tweak · decisions in the record

## Summary
PASS 161 · FAIL 0 · N/A 8 · open: none

## Requirements
| Id | Status | Evidence / action |
|---|---|---|
| S1 | PASS | DATA · standard 3.13 carries its version header and changelog, P14 included |
| S2 | PASS | HAND · header standard 3.13, date, result, detail and the teaching line written by this pass |
| S3 | PASS | AUTO · filled by the generator: the pipeline holds it for every built mechanism |
| S4 | PASS | SITE · issue 283 holds only this mechanism's decisions and hand-over notes; the seasonal plan's decisions are in issue 263 |
| S5 | PASS | SITE · no engine mark on the page or card |
| S6 | PASS | AUTO · filled by the generator: the pipeline holds it for every built mechanism |
| P1 | PASS | DATA · record v3 complete (kin and teaching blocks); polish3.ts, audit.md present |
| P2 | PASS | DATA · facets from the controlled vocabularies; the catalogue validates |
| P3 | PASS | DATA / SITE · ratio Index step (45° of wheel and 20.03 mm of carriage per driver turn, 140.2 mm from the first night to the eighth), motion Rotary to Intermittent linear, Intermittent, Dwell and Non-uniform, plane Planar, backdrivable No, four other names, family Intermittent, level Intermediate, dof 1, motorised |
| P4 | PASS | DATA · tags grouped as function, property and application, ten keywords underneath |
| P5 | PASS | DATA · explain motion, forces, benefits, limits; four invented uses with one line each, as P14 allows |
| P6 | PASS | DATA · a seasonal mechanism links nothing (P14): no references, media or real_world; generated-image prompts take their place |
| P7 | PASS | HAND / SITE · the polish names materials, a drop and two joint notes only; all prose and teaching labels come from the record |
| P8 | PASS | SITE · no parts list, build section or joint sections on the page |
| P9 | PASS | AUTO / HAND · the claims hold the 45° index, the 225° dwell, 20.03 mm a night, 140.2 mm over the eight nights, the 0.62 peak speed ratio and the flames from 1 to 8; the 135° drive window is 360° less the claimed dwell, nine hours and the 01:00 to 10:00 phasing are that window at one turn a day, 0.62 µm/s is 20.03 mm in nine hours, and the 1:12 lever belongs to the invented Municipal variant, not to this model |
| P10 | PASS | HAND · the pin's path with the comet and 15° ticks, the shamash's path traced, the LINE OF CENTRES and the SLOT LINE; the plot gives CARRIAGE TRAVEL against the driver (seven steps with long flats and the yearly return) and FLAMES UP |
| P11 | PASS | DATA · plain language, short sentences, no em dashes, mm and degrees |
| P12 | PASS | AUTO / DATA · record v3 validates: catalogue and kin-check clean |
| P13 | PASS | HAND · teaching review T2 run on the record before the build and recorded in teaching.review (tweak, 2026-11-05), updated with the owner's decisions of 5 and 6 Nov |
| P14 | PASS | HAND / DATA · a seasonal record (season: Hanukkah, 25 Kislev for eight nights, dates 2026 to 2031; duty Community): invented uses, themed scenery and labels, festive carving and chasing on the menorah, the shamash's slider, the crest and the plinth, dreidels and gelt; no links, generated-image prompts; the kinematics and every check hold |
| K1 | PASS | AUTO · K1 residual 1.2e-13 (tolerance 1e-9) over 360 samples, reference 0.0e+0 |
| K2 | PASS | AUTO · check: finite, continuous, periodic over 360 samples |
| K3 | PASS | AUTO / HAND · 18 blocks (indexer, follow, rack-release, strand, gear-mesh, trip); no numeric fallback · indexer for the Geneva, follow for the pinion on the wheel's shaft, rack-release for the mesh that is out on the eighth turn, strand and gear-mesh (ratio ±1) for the tape's runs round its six pulleys, trip for the eight flames; closed form, no numeric fallback; the tape's closing run TB4 checked by K1 |
| K4 | PASS | HAND · roles: driver with the accent, wheel as output, pinion gear, carriage and shamash's slider sliders, flames and pulleys links; back plate, menorah and plinth ground frames |
| K6 | PASS | DATA · c 60, n 8, r = c sin(π/8) = 22.96, R = c cos(π/8) = 55.43, pinion z 34 m 1.5 (pitch radius 25.5), station pitch 20.03, as build.defining_relations states |
| K7 | PASS | DATA · drivers input (rotary) · input rotary on the driver D, speed 8: eight turns a cycle |
| K8 | PASS | AUTO / DATA · every joint declared with type, bodies, origin and axis: the driver and wheel revolutes, the pin-in-slot S and the locking contact L, the pinion's revolute, the rack mesh M, the carriage's and the slider's prismatics Sc and Ss, the eight flame hinges and trip contacts, the six pulley revolutes and the tape's eight belt runs |
| K9 | PASS | DATA · one rotary driver, a control; a time map |
| K10 | PASS | AUTO / DATA · the mesh's active window repeats with a period of eight turns (out on the eighth); the solved branch is continuous over the cycle and every cycle plays like the first |
| K11 | PASS | AUTO · mobility counted 0, dof 1 |
| K12 | PASS | DATA · points R, Sh, Wc and Dc named; wheel angle, wheel speed, carriage, flames up and the pin's path are outputs |
| T1 | PASS | HAND · the Geneva's pin entering, turning and leaving the wheel and the carriage stepping one station a night read first; the shamash on the bar riding with it and the flames tipping up second; the menorah, crest and plinth are the seasonal scenery the waiver allows (P14) and nothing crosses over the candles |
| T2 | PASS | HAND · review tweak 2026-11-05 (eight-night cycle, the eighth index as the yearly return, the reset tab, the shamash on a slider run by the tape, time map 4x per index and 10x on the return, 18 s cycle); six phases looked at again on the finished build in FRONT: the first night's evening, mid first index, the third night's dwell, mid fifth index, mid return and home again; the pin enters each slot radially, the carriage and the shamash step together, the flame tips up as the shamash arrives, and the return folds flames 8 to 2 with the first left up; the verdict holds |
| T3 | PASS | DATA · principle: driver, wheel, pinion, carriage and the pin's point R |
| T4 | PASS | DATA · fired: trace-marks (no solids) · the pin R carries the comet and 15° ticks; the shamash's point Sh traced as well |
| T5 | PASS | DATA · the LINE OF CENTRES and the SLOT LINE, the construction a textbook Geneva figure draws |
| T6 | PASS | HAND / DATA · a 20 mm step a night and 140 mm over the eight nights read at the default size; one more flame up each night |
| T7 | PASS | DATA · VIEW 30 20: from the front right, a little above, so the wheel, the rack, the menorah and the shamash read together; the shot set includes it |
| T8 | PASS | DATA · section flame-trip at x 46.5 through the second flame's lever, magnified 4 times, highlighting f2; drawn in both sheets |
| T9 | PASS | AUTO / DATA · claim table: 7 ok, 0 off, 0 uncheckable of 7 |
| T10 | PASS | AUTO · 198 solids drawn see-through: backplate-foot, backplate-way, backplate-lip, backplate-screen, menorah-wick1, menorah-cheek1, menorah-wick2, menorah-cheek2 · filled by the generator: a rule built solids for it |
| T11 | PASS | AUTO · 0 supports routed, 0 moved off a sweep · filled by the generator: a rule built solids for it |
| T12 | PASS | HAND · 15 support solids; dropped by the polish: Sc-rail1, Sc-riser1, Sc-way, Sc-strip, Sc-gib, Sc-keeper, Sc-sc0, Sc-sc0-sh, Sc-sc1, Sc-sc1-sh, Sc-sc2, Sc-sc2-sh, Sc-sc3, Sc-sc3-sh, Sc-sc4, Sc-sc4-sh, Sc-dw0, Sc-dw1, Sc-wip0, Sc-wip1, Sc-nip, Ss-rail0, Ss-riser0, Ss-rail1, Ss-riser1, Ss-gib, Ss-keeper, Ss-sc0, Ss-sc0-sh, Ss-sc1, Ss-sc1-sh, Ss-sc2, Ss-sc2-sh, Ss-dw0, Ss-dw1, Ss-wip0, Ss-wip1, Ss-nip · the support solids the polish leaves out are named in teaching.exceptions with their reasons: the slide rule's rails, risers and keepers for the carriage (it runs on the back plate's way and keeper lip) and for the shamash's slider (it rides the menorah's rail); the rest dropped with them is the slide kit's hardware (gibs, screws, dowels, wipers, nipples); the tape's hiding is the third exception |
| T13 | PASS | DATA · the time map slows each night's index 4 times and the yearly return 10 times, in an 18 s cycle; the kinematics and the plot's input axis are unchanged |
| T14 | PASS | HAND / DATA · the driver is the only control; at fixed controls the eight nights repeat, every cycle like the first |
| T15 | PASS | HAND · labels LINE OF CENTRES, SLOT LINE, CARRIAGE TRAVEL and FLAMES UP: mechanics, with the seasonal names the waiver allows |
| T16 | PASS | HAND / STYLE · the eight flames are told apart by their station and the night's medallion under each; carriage and slider by their own shapes and places; no hue |
| T17 | PASS | AUTO · filled by the generator: the pipeline holds it for every built mechanism |
| T18 | PASS | HAND / DATA · fired: focus (no solids) · no part to watch named: the Geneva and the rack are large; the small flame trip has its own section view, and the tape is hidden on purpose (exception) |
| D1 | PASS | HAND · fired: wheels (no solids) · the wheel with its eight radial slots and concave locking arcs, the driver's lock disc and pin carrier, the pinion and rack as gears, the slider a plate on its rail |
| D2 | PASS | HAND · the wheel's hub round its shaft, the pin on a stud in the carrier, the lug's arm, leg and foot carry the tape's pull from the carriage |
| D3 | PASS | STYLE · STYLE: roles by pattern and tone |
| D4 | PASS | AUTO · fired: base (3 solids), feet (4 solids) · filled by the generator: a rule built solids for it |
| D5 | PASS | AUTO / HAND · the shafts in two bearing housings screwed and dowelled to the back plate, the back plate on its foot and a post, the motor on a one-piece slotted bracket, the plinth on its posts |
| D6 | PASS | HAND / STYLE · the decoration sits on the scenery (menorah, slider, crest, plinth, dreidels, gelt) as the seasonal waiver asks, and drops first on the detail ladder; the works stay plain behind the clear back plate |
| D8 | PASS | AUTO / HAND · every part a profile, an operation and a frame: plates and links extruded, the stems, cups, candles, pulleys, finials and buns turned |
| D9 | PASS | AUTO / HAND · fired: j12-cvt (no solids) · the tape is drawn as a fixed band where it runs, the lug and the slider clamped to it, as the belt kit draws a belt; it is mostly hidden on purpose (exception); nothing else changes shape |
| D10 | PASS | AUTO · filled by the generator: the pipeline holds it for every built mechanism |
| D11 | PASS | AUTO · SOLID: 0 of 426 solids unsound |
| D7 | PASS | HAND · the works carry only load shape and marks; the wheel's hub rosette with its index marks, the driver's engraved hub face and the gadrooned cover disc are the festive touches on the works the owner asked for (rich decoration, decisions of 5 and 6 Nov), small and on hubs |
| A1 | PASS | AUTO · M J6, D J10, W J10, S J4, Sc J5, Ss J5, L J7, T1 J7, T2 J7, T3 J7, T4 J7, T5 J7, T6 J7, T7 J7, T8 J7, drive drive, Sc J5, Ss J5 · filled by the generator: the pipeline holds it for every built mechanism |
| A2 | PASS | AUTO · M J6, D J10, W J10, S J4, Sc J5, Ss J5, L J7, T1 J7, T2 J7, T3 J7, T4 J7, T5 J7, T6 J7, T7 J7, T8 J7, drive drive, Sc J5, Ss J5 · filled by the generator: the pipeline holds it for every built mechanism |
| A3 | PASS | AUTO · fired: classify (38 solids), axial stack builder · filled by the generator: a rule built solids for it |
| A4 | PASS | AUTO · fired: j1-dead-axle (no solids), axial stack builder · the live Ø12 shafts stepped and keyed, end washers and countersunk screws, the pin's Ø5 stud pressed into the carrier |
| A5 | PASS | AUTO · fired: j2-live-shaft (no solids), j10-shaft-in-plan (55 solids), axial stack builder · filled by the generator: a rule built solids for it |
| A6 | PASS | AUTO · fired: j5-slide (40 solids), j13-compliant (no solids), standoffs (12 solids) · filled by the generator: a rule built solids for it |
| A7 | PASS | AUTO · fired: base (3 solids), posts (12 solids), feet (4 solids) · filled by the generator: a rule built solids for it |
| A8 | PASS | AUTO · fired: fasteners (39 solids) · filled by the generator: a rule built solids for it |
| A9 | PASS | AUTO / HAND · fired: column-slide (no solids), placement solver · the driver's and the wheel's shafts each in two bearings in a housing on the back plate; the pin on a stud in single shear with its roller, as the Geneva needs the slot's sweep clear; the tape's pulleys on pins in the stems' pockets and in the plinth |
| A10 | PASS | HAND · fired: placement (332 solids), placement solver · the placement solver's slabs: two slabs in the tallest stack (18 mm); the wheel and the driver in one plane, the pinion behind the wheel; nothing stacked only to clear something |
| A11 | PASS | AUTO / HAND · fired: j12-flexible (no solids), strap-sheave (no solids), j1-dead-axle (no solids) · driver and wheel: shaft, bearings, housings screwed and dowelled to the back plate, its foot and post, base; carriage: the way and keeper lip on the back plate; slider: the rail, its ends in the stems, the plinth, its posts, base; flames: wick pin, cheek, candle, cup, bar, stems; pulleys: pins in the stems and plinth |
| A12 | PASS | AUTO · clamp check clean |
| A13 | PASS | AUTO / HAND · 426 solids, 67 unnamed (further items of a listed set) · named hardware: bearings 6801, Ø12 live shafts, feather keys, M3 to M6 screws, dowels, circlips, wave and thrust washers, the eccentric bushing, the GT2 32:16 drive, the motor, sensor, lead and clip, the tape 2.5 x 0.3 and its pulleys; unnamed rows are further items of a named set |
| A14 | PASS | AUTO / HAND · fired: support router · no supports routed; 3D clearance 0 clashes over 72 phases, the yearly return included |
| A15 | PASS | AUTO · clearance in 3D over 72 phases: 0 clashes; hand allow: 0 named, 0 unnecessary |
| A16 | PASS | HAND · 18 joint notes; no note: none; no badge: none · joint notes with badges; the polish's notes for Sc (held into mesh by the pinion) and Ss (guided on the menorah's rail) describe what is built |
| A17 | PASS | HAND · order: the base and the plinth's posts; the plinth with its turnaround pulleys; the back plate on its foot, the housings, shafts, wheel, pinion and driver; the carriage lifted over the keeper lip onto the way; the menorah on the plinth, the slider on its rail, the bar-end and stem-foot pulleys in their pockets; the tape threaded and its ends clamped in the lug's foot; the flames on their wick pins; every housing screw reached from the back plate's back, every bearing pressed out of its housing |
| A18 | PASS | AUTO · placement: 2 slabs in the tallest stack (18.0 mm), 0 clevises; stack per joint in the Joints table · filled by the generator: the pipeline holds it for every built mechanism |
| A19 | PASS | AUTO · 0 supports routed (0 moved), least gap - mm; still covering a principle part, drawn see-through: none · no supports routed; the back plate holds the shafts and the carriage's way, the menorah the slider, nothing covering a principle part |
| A20 | PASS | AUTO · support per joint: none · the shafts held by housings on the back plate; the slides' supports replaced by the back plate's way and the menorah's rail (exceptions in the record) |
| A21 | PASS | AUTO · kit per joint: M J6, D J10, W J10, S J4, Sc J5, Ss J5, L J7, T1 J7, T2 J7, T3 J7, T4 J7, T5 J7, T6 J7, T7 J7, T8 J7, drive drive, Sc J5, Ss J5 |
| A22 | PASS | AUTO · fired: stops (no solids), adjustable-length (no solids), cable-clip (2 solids) · filled by the generator: a rule built solids for it |
| E1 | PASS | AUTO · every solid has one explode level; levels 0 to 28.42 · filled by the generator: the pipeline holds it for every built mechanism |
| E2 | PASS | AUTO · fired: explode (1 solid) · filled by the generator: a rule built solids for it |
| E3 | PASS | AUTO · fired: explode (1 solid) · filled by the generator: a rule built solids for it |
| E4 | PASS | HAND · the flames, candles and cups come off first, then the slider and the menorah off the plinth, the driver and the shafts out of their housings, the carriage off its way, the back plate and the plinth off the base |
| E5 | PASS | AUTO · fired: explode (1 solid) · filled by the generator: a rule built solids for it |
| E6 | PASS | AUTO · fired: explode (1 solid) · filled by the generator: a rule built solids for it |
| E7 | PASS | AUTO · fired: explode (1 solid) · filled by the generator: a rule built solids for it |
| E8 | PASS | AUTO · fired: explode (1 solid) · filled by the generator: a rule built solids for it |
| E9 | PASS | HAND · full explode readable in both sheets: the candles and their pieces leave upward in columns, the works along their shafts, nothing inside another part, nothing leaves the frame |
| E10 | PASS | AUTO · fired: explode (1 solid) · filled by the generator: a rule built solids for it |
| J1 | N/A | AUTO · fired: trunnion (no solids), hub (no solids), j1-dead-axle (no solids) · filled by the generator: no joint of this type |
| J2 | N/A | AUTO · fired: j2-live-shaft (no solids) · filled by the generator: no joint of this type |
| J3 | N/A | AUTO · fired: j3-moving-pin (no solids), cross-bearings (no solids), oblique-journal (no solids), eccentric-bearing (no solids), spider-pin (no solids), ball-socket (no solids), ring-hub (no solids), eccentric (no solids) · filled by the generator: no joint of this type |
| J4 | PASS | AUTO · fired: pin-hole (no solids), j4-slot-roller (3 solids), pin-lobe (no solids), fork-pin (no solids), die (no solids) · filled by the generator: a rule built its kit |
| J5 | PASS | AUTO · fired: tongue-slot (no solids), integrator-carriage (no solids), piston-bore (no solids), j5-slide (40 solids), leg-bore (no solids), column-slide (no solids) · filled by the generator: a rule built its kit |
| J6 | PASS | AUTO · fired: j6-mesh (1 solid), friction-contact (no solids), ring-carrier (no solids), pin-ring (no solids), ring-rollers (no solids) · filled by the generator: a rule built its kit |
| J7 | PASS | AUTO · fired: ball-socket (no solids), groove-cam (no solids), j7-cam (9 solids), pallet-contact (no solids), pawl-tooth (no solids), sole-pad (no solids) · filled by the generator: a rule built its kit |
| J8 | N/A | AUTO · fired: j12-flexible (no solids), j8-belt (no solids), flat-belt (no solids) · filled by the generator: no joint of this type |
| J9 | N/A | AUTO · fired: j9-crossed-mesh (no solids) · filled by the generator: no joint of this type |
| J10 | PASS | AUTO · fired: j12-cvt (no solids), j10-shaft-in-plan (55 solids), j11-screw (no solids) · filled by the generator: a rule built its kit |
| J12 | N/A | AUTO · fired: j12-flexible (no solids), j12-cvt (no solids), j12-other (no solids), strap-sheave (no solids), flat-belt (no solids) · filled by the generator: no joint of this type |
| J13 | N/A | AUTO · fired: j13-compliant (no solids) · filled by the generator: no joint of this type |
| J11 | N/A | AUTO · fired: j11-screw (no solids) · filled by the generator: no joint of this type |
| F1 | PASS | AUTO · served at D, W, Sc, Ss, Sc, Ss; fired: bend-slots (no solids), posts (12 solids), integrator-carriage (no solids), j2-live-shaft (no solids), j10-shaft-in-plan (55 solids), ring-carrier (no solids), pin-ring (no solids), hub (no solids), strap-sheave (no solids), j13-compliant (no solids), covers (no solids) · filled by the generator: a rule built solids for it |
| F2 | PASS | AUTO · served at D, W, Sc, Ss; fired: wheels (no solids), j12-flexible (no solids), j2-live-shaft (no solids), j10-shaft-in-plan (55 solids), cross-bearings (no solids), oblique-journal (no solids), trunnion (no solids), ring-carrier (no solids), eccentric-bearing (no solids), pin-ring (no solids), spider-pin (no solids), fork-pin (no solids), ring-hub (no solids), eccentric (no solids), hub (no solids), leg-bore (no solids), ring-rollers (no solids), strap-sheave (no solids), j11-screw (no solids), j13-compliant (no solids), covers (no solids) · filled by the generator: a rule built solids for it |
| F3 | PASS | AUTO · served at D, W; fired: j12-flexible (no solids), j2-live-shaft (no solids), j10-shaft-in-plan (55 solids), column-slide (no solids), j11-screw (no solids) · filled by the generator: a rule built solids for it |
| F4 | PASS | AUTO / HAND · served at D, W; fired: j9-crossed-mesh (no solids), j2-live-shaft (no solids), j10-shaft-in-plan (55 solids), trunnion (no solids), spider-pin (no solids), j11-screw (no solids) · bronze thrust washers and wave washers on the driver's and the wheel's shafts, inner-race spacers between the bearings |
| F5 | PASS | AUTO / HAND · served at no joint; fired: integrator-carriage (no solids), j5-slide (40 solids), pawl-tooth (no solids), j11-screw (no solids), j13-compliant (no solids), stops (no solids) · with the drive off the locking arc holds the wheel, so the carriage cannot run; out of mesh for the return the slider is stopped by the stems where the rail's ends sit; each flame turns only between its two spring-held rests |
| F6 | PASS | AUTO / HAND · served at no joint; fired: friction-contact (no solids), j12-flexible (no solids), j12-cvt (no solids), trunnion (no solids), j7-cam (9 solids), pallet-contact (no solids), pawl-tooth (no solids) · the locking disc holds the wheel between indexes; each flame held up or folded by a toggle spring round its knuckle (wire Ø0.15, named on the knuckle, too fine to draw, L8) |
| F7 | PASS | AUTO / HAND · served at M, Sc, Ss, Sc, Ss; fired: bend-slots (no solids), j6-mesh (1 solid), friction-contact (no solids), j9-crossed-mesh (no solids), j12-flexible (no solids), j12-cvt (no solids), j5-slide (40 solids), j12-other (no solids), adjustable-length (no solids), covers (no solids) · the pinion's mesh set by an eccentric bushing; the carriage's mesh set by the keeper lip; the tape's tension set where its two ends are clamped in the lug's foot; the motor's bracket slotted for the belt |
| F8 | PASS | AUTO · served at Sc, Ss; fired: tongue-slot (no solids), j12-flexible (no solids), cross-bearings (no solids), ball-socket (no solids), eccentric (no solids), leg-bore (no solids), column-slide (no solids), j11-screw (no solids), lubrication (no solids) · sealed bearings need none; the slide kit's wipers and nipples are dropped with its rails (exception): the carriage moves 20 mm a day on the back plate's way and the slider runs brass on brass, both dry; the locking surfaces oiled |
| F9 | PASS | AUTO / HAND · served at M; fired: j6-mesh (1 solid), j9-crossed-mesh (no solids), timing-marks (1 solid) · the index marks every 45° on the wheel's hub; the pinion keyed on the wheel's shaft; the mesh served by the pinion and the carriage |
| F10 | PASS | AUTO / HAND · served at drive; fired: j12-flexible (no solids), drive (30 solids) · flanged GT2 pulleys; a home flag on the driver read by a fork sensor |
| M1 | PASS | AUTO · fired: hardware primitives · top-face edges chamfered by the primitives |
| M2 | PASS | HAND · bosses round every loaded hole; the wheel, which starts and stops every night, is a hub with eight arms between its slots |
| M3 | PASS | AUTO · fired: j3-moving-pin (no solids), hardware primitives · bore entry chamfers by the rules |
| M4 | PASS | AUTO / HAND · fired: base (3 solids), fasteners (39 solids) · counterbores and countersinks for the heads; countersunk end screws on the live shafts |
| M5 | PASS | AUTO / HAND · fired: hardware primitives · slots full-radius ended; the wheel's slots and the motor bracket's slot rounded |
| M6 | PASS | AUTO · edge distance and walls clean |
| M7 | PASS | HAND · the motor's bracket from the drive rule; the lug's arm, leg and foot carry only the tape's light pull; no other bracket or plate turns a load round an inside corner |
| M8 | PASS | AUTO · fired: j1-dead-axle (no solids) · thread undercuts on the stepped shafts by the rules |
| M9 | PASS | AUTO / HAND · fired: j1-dead-axle (no solids) · ISO coarse threads, lengths from the series |
| M10 | PASS | AUTO / HAND · 415 of 426 solids name a material · materials named: the menorah, slider and crest in cast and chased brass, the candles in beeswax, the flames and gelt gilt, the plinth in walnut, the dreidels in boxwood and the tape in spring steel, by the polish; the rest by the rules; the unnamed are the kinematic bodies' own parts, as on every sheet of the library |
| M11 | PASS | AUTO · fired: j1-dead-axle (no solids), hardware primitives · centre holes, chamfered ends and flats on the turned shafts |
| M12 | PASS | HAND · every screw reachable by its key from the back plate's back or with the menorah off; bearings pressed out of their housings |
| M13 | PASS | AUTO / HAND · 22 threaded · threadlocker or nyloc on every threaded fastener (the rules' defaults) |
| M14 | PASS | AUTO / HAND · fired: tongue-slot (no solids), piston-bore (no solids), pin-hole (no solids), j4-slot-roller (3 solids), pin-lobe (no solids), groove-cam (no solids), pallet-contact (no solids), eccentric (no solids), die (no solids), hub (no solids), leg-bore (no solids), sole-pad (no solids) · the pin's track roller rolls in the slots; the locking surfaces are oiled; the slide kit's strips go with its rails (exception), the carriage moving 20 mm a day |
| V1 | PASS | AUTO · fired: drive (30 solids) · filled by the generator: a rule built solids for it |
| V2 | PASS | AUTO · fired: drive (30 solids) · filled by the generator: a rule built solids for it |
| V3 | PASS | AUTO / HAND · fired: drive (30 solids) · belt and pulleys behind the back plate, clear of everything moving; clearance 0 |
| V4 | PASS | AUTO · fired: j8-belt (no solids) · flanged pulleys, belt in one plane, the bracket slotted for the belt's tension |
| V5 | PASS | AUTO · fired: drive (30 solids) · filled by the generator: a rule built solids for it |
| V6 | PASS | AUTO · fired: drive (30 solids), cable-clip (2 solids) · filled by the generator: a rule built solids for it |
| L1 | PASS | STYLE · STYLE: no look values in the record or polish |
| L2 | PASS | HAND · the record and polish carry geometry, roles, materials and groups only |
| L3 | PASS | HAND · roles right: driver, wheel output, pinion gear, carriage and slider sliders, flames and pulleys links, back plate, menorah and plinth frames |
| L4 | PASS | HAND / STYLE · accent on the driver only |
| L5 | PASS | AUTO / HAND · fired: see-through (20 solids) · the back plate with its way and lip, the wicks and cheeks among the solids drawn see-through where they hide a principle part or a working zone; the tape and its pulleys seen through the slots in the stems and along the bar's foot |
| L6 | PASS | AUTO · filled by the generator: the pipeline holds it for every built mechanism |
| L7 | PASS | STYLE · STYLE: turntable orbit, named views |
| L8 | PASS | AUTO / HAND · fired: trace-marks (no solids) · the chasing, carving, rays and letters drawn as fine ink marks on their faces; the toggle springs below the floor are named, not drawn |
| L9 | PASS | AUTO / DATA · the flame-trip section cuts and hatches the parts it meets, the second flame highlighted |
| L10 | PASS | AUTO / STYLE · overlays in the sheet's look |
| R1 | PASS | HAND · parts from the builder's kits and primitives; the decoration through the shared pieces |
| R2 | PASS | HAND · one bearing size (6801), Ø12 shafts, M3 to M6 screws, GT2 32:16; the tape's pulleys Ø2.4 on Ø0.8 pins, small to fit inside the stems (exception) |
| R3 | PASS | AUTO · fired: hardware primitives · shared subassemblies from the rules and primitives |
| R4 | PASS | AUTO · package v2 69.8 KB · filled by the generator: the pipeline holds it for every built mechanism |
| R5 | PASS | HAND · the polish states the exceptions listed at its top, with no sampling |
| R6 | PASS | FLAG · FLAG: bench on the desktop: frames 1.4 to 1.9 ms paced (under 8 ms), the GPU 1.5 to 2.1 ms and 9.8 ms in the full explode (over the 8 ms target, a flag); setup 73.3 ms on the bench page, 55 ms of it the GPU's first frame (23.1 ms in the renderer's own bench), over the 20 ms target; the phone is measured by the owner |
| R7 | PASS | HAND / FLAG · polish 17 lines (2.4 KB); 0 solids added, 259 overrides by the polish |
| R8 | PASS | AUTO / SITE · SITE: thumbnails and cards pre-rendered |
| R9 | PASS | AUTO / SITE · SITE: one context, edges in the worker |
| R10 | PASS | FLAG · FLAG: the phone bench page is the owner's to run |
| DL1 | PASS | AUTO / HAND · 61 of 426 solids on a dropping rung · every solid on a rung by kind and role; the decoration (ornament pieces, carved marks) on DL-A, so it drops first; nothing moved on the ladder |
| DL2 | PASS | HAND · default dial full |
| DL3 | PASS | AUTO · filled by the generator: the pipeline holds it for every built mechanism |
| DL4 | PASS | SITE · SITE: adaptive dial |
| DL6 | PASS | AUTO · filled by the generator: the pipeline holds it for every built mechanism |
| DL5 | PASS | FLAG · FLAG: rungs and frame times in the bench report and the Detail ladder table |
| Q1 | PASS | check, clamp and edge distance clean |
| Q2 | PASS | 0 clashes, 0 unnecessary allows |
| Q3 | PASS | package v2 written, 69.8 KB; site build not checked here · package v2 written; the site build runs at PR time with the thumbnails (the page needs LM_SEASON=open out of season) |
| Q4 | PASS | local: tools/shot · shot set drawn in both sheets (record view VIEW 30 20, PLAN, FRONT, SIDE, ISOMETRIC, the flame-trip section, full explode) and the six phases in FRONT, looked at by eye |
| Q5 | PASS | local: tools/bench · bench run; flags in R6 |
| Q6 | PASS | regenerated, every hand row judged; R7 decided by the tools, the polish under 30 lines |
| Q7 | PASS | whole-library conformance run at standard 3.13 with this pass |
| Q8 | PASS | teaching review: tweak (2026-11-05); the six phases of the finished build are looked at by eye · teaching review tweak recorded in the record and on the teaching line; the six phases of the finished build looked at again |

## Joints
| Joint | Kit | Block | Support | Stack | F1 locate | F2 retain | F3 torque | F4 thrust | F5 limit | F6 hold | F7 adjust | F8 lube | F9 timing | F10 protect |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| M | J6 | rack-release | – | – | none | none | none | none | none | none | Eccentric bushing Ø28, 0.3 mm offset bore Ø14, flanged | none | Pinion; Carriage | none |
| D | J10 | driver | – | – | 2 x Dowel pin Ø3 x 10 h6, housing to backplate | 2 x Internal circlip DIN 472, Ø21; End washer 5.4x20, holds the driver on the shaft end; Countersunk M5 x 12 (ISO 10642) | Feather key 4 x 4 x 4 (DIN 6885) | Thrust washer 12.2x20, bronze; Wave washer 16.5x20.8, spring steel | none | none | none | none | none | none |
| W | J10 | – | – | – | 2 x Dowel pin Ø3 x 10 h6, housing to backplate | 2 x Internal circlip DIN 472, Ø21; End washer 5.4x20, holds the pinion on the shaft end; Countersunk M5 x 12 (ISO 10642) | Feather key 4 x 4 x 5 (DIN 6885) | Inner-race spacer 12.2x15.1; Thrust washer 12.2x20, bronze; Wave washer 16.5x20.8, spring steel | none | none | none | none | none | none |
| S | J4 | – | – | – | none | none | none | none | none | none | none | none | none | none |
| Sc | J5 | – | – | – | Sc-dw0, Sc-dw1 | Sc-keeper | none | none | none | none | Sc-gib | Sc-wip0, Sc-wip1, Sc-nip | none | none |
| Ss | J5 | – | – | – | Ss-dw0, Ss-dw1 | Ss-keeper | none | none | none | none | Ss-gib | Ss-wip0, Ss-wip1, Ss-nip | none | none |
| L | J7 | – | – | – | none | none | none | none | none | none | none | none | none | none |
| T1 | J7 | – | – | – | none | none | none | none | none | none | none | none | none | none |
| T2 | J7 | – | – | – | none | none | none | none | none | none | none | none | none | none |
| T3 | J7 | – | – | – | none | none | none | none | none | none | none | none | none | none |
| T4 | J7 | – | – | – | none | none | none | none | none | none | none | none | none | none |
| T5 | J7 | – | – | – | none | none | none | none | none | none | none | none | none | none |
| T6 | J7 | – | – | – | none | none | none | none | none | none | none | none | none | none |
| T7 | J7 | – | – | – | none | none | none | none | none | none | none | none | none | none |
| T8 | J7 | – | – | – | none | none | none | none | none | none | none | none | none | none |
| drive | drive | – | – | – | none | none | none | none | none | none | none | none | none | Home flag, 1 mm steel vane; Fork sensor, slotted optical, 5 mm gap |
| Sc | J5 | – | – | – | Way under the rack; Keeper lip before the rack | none | none | none | none | none | Keeper lip before the rack | none | none | none |
| Ss | J5 | – | – | – | Rail under the bar's front, its ends in the stems | none | none | none | none | none | Slider; Tongue into the bar's channel, clamped to the tape | none | none | none |

## Supports
| Support | Joint | Kind | Route | Least gap mm | Covers | T10 |
|---|---|---|---|---|---|---|

## Variants and overrides
| Joint or part | Rule result | Chosen | Why |
|---|---|---|---|
| Sc (carriage) | the slide rule's two rails on risers from the base, with gib, keeper, wipers and nipple | the rack's carriage on a way and a keeper lip on the see-through back plate, held down into mesh by the pinion; it lifts out over the lip for the yearly return | J5, T12: for a rack in an upright plane the risers would stand in front of the works and through the menorah's stems; named in `teaching.exceptions` (polish) |
| Ss (shamash's slider) | the slide rule's two rails on risers from the base, with gib, keeper, screws, dowels, wipers and nipple | the slider on the menorah's brass rail under the bar's front, its lip under the rail and its tongue in the bar's channel; no slide hardware | J5, T12, F8, M14: rails on risers would stand in front of the menorah and cross the candles; the slider runs brass on brass, dry, 20 mm a day; owner's decision, 6 Nov; named in `teaching.exceptions` (polish) |
| steel tape and its six pulleys | a belt drawn in the open on pulleys from the kit's sizes | a closed steel tape 2.5 x 0.3, hidden inside the hollow stems, the bar's channel and the plinth, shown through a slot down each stem, the channel's slot and the pockets at the bar's ends; pulleys Ø2.4 on Ø0.8 pins, to fit inside the stems | T10, R2: "a bit of cheating is acceptable", so that nothing of the drive crosses over the candles (owner's decision, 6 Nov); named in `teaching.exceptions`; two turnarounds in the plinth make the top run go the carriage's way, hidden, so nothing visible differs from the decision |
| menorah, slider, crest, candles, flames, plinth, dreidels, gelt, tape | steel and aluminium | cast and chased brass, ivory beeswax, gilt brass, carved walnut, boxwood, spring steel for the tape | M10: the seasonal scenery (P14) is made as a menorah and its stand, not as machine parts (polish) |
| flames' reset | a separate reset bar under the bar | a reset tab on the shamash's slider, 10 mm ahead of the shamash, folding flames 8 to 2 on the return; the first flame stays up | owner's decision, 5 Nov: no motion of its own, and the tab never meets a flame on the way out |
| stage cycle | the drive's own cycle, one turn | eight driver turns, the eight nights; the eighth index is the yearly return, compressed into the cycle with the rack out of mesh (rack-release block), slowed 10 times by the time map in an 18 s cycle | T13, T14: the real return is made by hand with the drive off once a year; owner's decisions, 5 and 6 Nov |
| flames' toggle springs | a spring drawn as a part | named on each flame's knuckle, not drawn | L8, F6: a wire of Ø0.15 is under the drawing's floor |

## Detail ladder
| Rung | Solids | Marks | Frame ms at this dial position |
|---|---|---|---|
| DL-A | 35 | 1455 | 1.8 |
| DL-B | 0 | 302 | 1.87 |
| DL-C | 0 | 0 | 1.88 |
| DL-D | 13 | 0 | 1.78 |
| DL-E | 8 | 2 | 1.84 |
| DL-F | 0 | 0 | 1.81 |
| DL-G | 0 | 0 | 1.85 |
| DL-H | 5 | 0 | 1.78 |
| never | 365 | 176 | 1.83 |

## Promotion candidates
From a hand fix: a slide for a rack in an upright plane, running on a plate's way under a keeper lip instead of rails on
risers from the base (J5; used here twice, for the carriage and the shamash's slider). For the builder: `contactOf`
accepts an anti-parallel extent, so a plate whose frame normal lies along an axis got dead shafts in pillow blocks on the
tape's pulleys until their own parts were made raised index ribs. Engine work of this pass, in the library: the
rack-release and trip blocks (src/kin/steps/trip.ts); a joint's active window with a period; claims counted in the
driver's own degrees for a driver of several turns a cycle; `teaching.cycleTime` (a record's own cycle length on the
stage); a time map span with its own slow factor; a strand on a small pulley read modulo its circumference. Polish
exceptions (R7): the two slides and the materials (above); the polish is 17 lines, under the plan's 30.

## Verification
check: clean · K1 residual: 1.2e-13 · claims: 7 of 7 ok · clearance: 0 clashes · clamp: clean · edge distance: clean · package: 69.8 KB
screenshots: the shot set in both sheets (record view VIEW 30 20, PLAN, FRONT, SIDE, ISOMETRIC, section flame-trip, full explode) in dist/shots3/eight-night-indexer, and six phases in FRONT (the first night's evening, mid first index, the third night, mid fifth index, mid return, home again), looked at by eye (out of the repository, in the pass's PR) ·
bench: desktop, frames at 28 deg 1.43 ms paced, explode 1.6 ms (GPU 9.8 ms, a flag), setup 73.3 ms on the bench page (over the 20 ms target, a flag; 55 ms of it the GPU's first frame)
