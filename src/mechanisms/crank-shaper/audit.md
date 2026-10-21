# Audit: Crank and slotted lever quick-return (crank-shaper)
standard: 3.0 · date: 2026-10-21 · result: open · detail: full · pass: build
teaching: keep · decisions in the record

## Summary
PASS 9 · FAIL 5 · N/A 0 · open: FAIL A12, A15, M6, Q1, Q2; 153 unjudged

## Requirements
| Id | Status | Evidence / action |
|---|---|---|
| S1 | ? | DATA |
| S2 | ? | HAND |
| S3 | ? | AUTO |
| S4 | ? | SITE |
| S5 | ? | SITE |
| S6 | ? | AUTO |
| P1 | PASS | DATA · record v3 complete (kin and teaching blocks); no polish, audit.md present |
| P2 | ? | DATA |
| P3 | ? | DATA / SITE |
| P4 | ? | DATA |
| P5 | ? | DATA |
| P6 | ? | DATA |
| P7 | ? | HAND / SITE |
| P8 | ? | SITE |
| P9 | ? | AUTO / HAND |
| P10 | ? | HAND |
| P11 | ? | DATA |
| P12 | ? | AUTO / DATA |
| P13 | ? | HAND |
| K1 | PASS | AUTO · K1 residual 7.1e-14 (tolerance 1e-9) over 360 samples, reference 5.7e-14 |
| K2 | PASS | AUTO · check: finite, continuous, periodic over 360 samples |
| K3 | ? | AUTO / HAND · 2 blocks (slider-dyad); no numeric fallback |
| K4 | ? | HAND |
| K6 | ? | DATA |
| K7 | ? | DATA · drivers input (rotary) |
| K8 | ? | AUTO / DATA |
| K9 | ? | DATA |
| K10 | ? | AUTO / DATA |
| K11 | PASS | AUTO · mobility counted 1, dof 1 |
| K12 | ? | DATA |
| T1 | ? | HAND |
| T2 | ? | HAND |
| T3 | ? | DATA |
| T4 | ? | DATA · fired: trace-marks (no solids) |
| T5 | ? | DATA |
| T6 | ? | HAND / DATA |
| T7 | ? | DATA |
| T8 | ? | DATA |
| T9 | PASS | AUTO / DATA · claim table: 5 ok, 0 off, 0 uncheckable of 5 |
| T10 | ? | AUTO · 18 solids drawn see-through: B-0-sp, B-bolt-wsh, B-bolt-s1, B-bolt-s2, B-bolt-head, C-1-brg, C-1-brg-balls, C-1-brg-cage |
| T11 | ? | AUTO · 1 support routed, 1 moved off a sweep |
| T12 | PASS | HAND · 23 support solids; dropped by the polish: none |
| T13 | ? | DATA |
| T14 | ? | HAND / DATA |
| T15 | ? | HAND |
| T16 | ? | HAND / STYLE |
| T17 | ? | AUTO |
| D1 | ? | HAND |
| D2 | ? | HAND |
| D3 | ? | STYLE |
| D4 | ? | AUTO · fired: base (3 solids), feet (4 solids) |
| D5 | ? | AUTO / HAND |
| D6 | ? | HAND / STYLE |
| D8 | ? | AUTO / HAND |
| D9 | ? | AUTO / HAND |
| D10 | ? | AUTO |
| D11 | PASS | AUTO · SOLID: 0 of 169 solids unsound |
| D7 | ? | HAND |
| A1 | ? | AUTO · A J3, B J3, C J3, O2 J2, slot J5, rails J5, O3 J1, O3-lever-stops stops, drive drive |
| A2 | ? | AUTO · A J3, B J3, C J3, O2 J2, slot J5, rails J5, O3 J1, O3-lever-stops stops, drive drive |
| A3 | ? | AUTO · fired: classify (7 solids), axial stack builder |
| A4 | ? | AUTO · fired: j1-dead-axle (27 solids), axial stack builder |
| A5 | ? | AUTO · fired: j2-live-shaft (24 solids), j10-shaft-in-plan (no solids), axial stack builder |
| A6 | ? | AUTO · fired: j5-slide (44 solids), j13-compliant (no solids), standoffs (no solids) |
| A7 | ? | AUTO · fired: base (3 solids), feet (4 solids) |
| A8 | ? | AUTO · fired: fasteners (21 solids) |
| A9 | ? | AUTO / HAND · fired: placement solver |
| A10 | ? | HAND · fired: placement (12 solids), placement solver |
| A11 | ? | AUTO / HAND · fired: j12-flexible (no solids), strap-sheave (no solids), j1-dead-axle (27 solids) |
| A12 | FAIL | AUTO · clamp: slot-riser0 (turning) touches the ground face of base; slot-riser1 (turning) touches the ground face of base; slot-gib (turning) touches the ground face of rails-keeper; slot-dw0 (turning) touches the ground face of base; slot-dw1 (turning) touches the ground face of base; slot-wip0 (turning) touches the ground face of rails-keeper; ram (turning) touches the ground face of rails-riser0; slot-wip0 (turning) touches the ground face of rails-sc0 |
| A13 | ? | AUTO / HAND · 169 solids, 88 unnamed (further items of a listed set) |
| A14 | ? | AUTO / HAND · fired: support router |
| A15 | FAIL | AUTO · clearance in 3D over 8 phases: 86 clashes: slot-riser1 x crank 3.26 mm; slot-riser0 x crank 3.25 mm; slot-riser0 x rails-rail1 2.92 mm; slot-riser1 x rails-rail1 2.91 mm; hand allow: 0 named, 0 unnecessary |
| A16 | ? | HAND · 9 joint notes; no note: none; no badge: slot, rails |
| A17 | ? | HAND |
| A18 | ? | AUTO · placement: 3 slabs in the tallest stack (32.0 mm), 1 clevis; stack per joint in the Joints table |
| A19 | ? | AUTO · 1 support routed (1 moved), least gap 1.5 mm; still covering a principle part, drawn see-through: O3-bridge |
| A20 | ? | AUTO · support per joint: O3 bridge |
| A21 | PASS | AUTO · kit per joint: A J3, B J3, C J3, O2 J2, slot J5, rails J5, O3 J1, O3-lever-stops stops, drive drive |
| A22 | ? | AUTO · fired: stops (8 solids), adjustable-length (no solids), cable-clip (2 solids) |
| E1 | ? | AUTO · every solid has one explode level; levels -4 to 5 |
| E2 | ? | AUTO · fired: explode (1 solid) |
| E3 | ? | AUTO · fired: explode (1 solid) |
| E4 | ? | HAND |
| E5 | ? | AUTO · fired: explode (1 solid) |
| E6 | ? | AUTO · fired: explode (1 solid) |
| E7 | ? | AUTO · fired: explode (1 solid) |
| E8 | ? | AUTO · fired: explode (1 solid) |
| E9 | ? | HAND |
| E10 | ? | AUTO · fired: explode (1 solid) |
| J1 | ? | AUTO · fired: trunnion (no solids), j1-dead-axle (27 solids) |
| J2 | ? | AUTO · fired: j2-live-shaft (24 solids) |
| J3 | ? | AUTO · fired: j3-moving-pin (31 solids), cross-bearings (no solids), ring-hub (no solids) |
| J4 | ? | AUTO · fired: j4-slot-roller (no solids), pin-lobe (no solids), fork-pin (no solids) |
| J5 | ? | AUTO · fired: piston-bore (no solids), j5-slide (44 solids), tongue-slot (no solids) |
| J6 | ? | AUTO · fired: j6-mesh (no solids), ring-rollers (no solids) |
| J7 | ? | AUTO · fired: groove-cam (no solids), j7-cam (no solids), pallet-contact (no solids), pawl-tooth (no solids) |
| J8 | ? | AUTO · fired: j8-belt (no solids), j12-flexible (no solids) |
| J9 | ? | AUTO · fired: j9-crossed-mesh (no solids) |
| J10 | ? | AUTO · fired: j10-shaft-in-plan (no solids) |
| J12 | ? | AUTO · fired: j12-flexible (no solids), strap-sheave (no solids) |
| J13 | ? | AUTO · fired: j13-compliant (no solids) |
| J11 | ? | AUTO · fired: j11-screw (no solids) |
| F1 | ? | AUTO · served at O2, slot, rails, O3; fired: j2-live-shaft (24 solids), j10-shaft-in-plan (no solids), strap-sheave (no solids), j13-compliant (no solids) |
| F2 | ? | AUTO · served at A, B, C, O2, slot, rails, O3; fired: j2-live-shaft (24 solids), j10-shaft-in-plan (no solids), cross-bearings (no solids), trunnion (no solids), fork-pin (no solids), ring-hub (no solids), ring-rollers (no solids), j12-flexible (no solids), strap-sheave (no solids), j13-compliant (no solids) |
| F3 | ? | AUTO · served at A, B, C; fired: j2-live-shaft (24 solids), j10-shaft-in-plan (no solids), j12-flexible (no solids), j11-screw (no solids) |
| F4 | ? | AUTO / HAND · served at C, O2, O3; fired: j9-crossed-mesh (no solids), j2-live-shaft (24 solids), j10-shaft-in-plan (no solids), trunnion (no solids) |
| F5 | ? | AUTO / HAND · served at slot, rails, O3-lever-stops; fired: j5-slide (44 solids), pawl-tooth (no solids), j13-compliant (no solids), stops (8 solids) |
| F6 | ? | AUTO / HAND · served at no joint; fired: trunnion (no solids), j7-cam (no solids), pallet-contact (no solids), pawl-tooth (no solids), j12-flexible (no solids) |
| F7 | ? | AUTO / HAND · served at slot, rails; fired: j6-mesh (no solids), j9-crossed-mesh (no solids), j5-slide (44 solids), j12-flexible (no solids), adjustable-length (no solids) |
| F8 | ? | AUTO · served at slot, rails; fired: cross-bearings (no solids), tongue-slot (no solids), j12-flexible (no solids), j11-screw (no solids), lubrication (1 solid) |
| F9 | ? | AUTO / HAND · served at no joint; fired: j6-mesh (no solids), j9-crossed-mesh (no solids), timing-marks (1 solid) |
| F10 | ? | AUTO / HAND · served at drive; fired: j12-flexible (no solids), drive (26 solids) |
| M1 | ? | AUTO · fired: hardware primitives |
| M2 | ? | HAND |
| M3 | ? | AUTO · fired: j3-moving-pin (31 solids), hardware primitives |
| M4 | ? | AUTO / HAND · fired: base (3 solids), fasteners (21 solids) |
| M5 | ? | AUTO / HAND · fired: hardware primitives |
| M6 | FAIL | AUTO · edge distance: rails-keeper: wall -0.15 mm round the Ø3.6 hole at (-59.2, -20.4), needs 1.5 |
| M7 | ? | HAND |
| M8 | ? | AUTO · fired: j1-dead-axle (27 solids) |
| M9 | ? | AUTO / HAND · fired: j1-dead-axle (27 solids) |
| M10 | ? | AUTO / HAND · 163 of 169 solids name a material |
| M11 | ? | AUTO · fired: j1-dead-axle (27 solids), hardware primitives |
| M12 | ? | HAND |
| M13 | ? | AUTO / HAND · 24 threaded |
| M14 | ? | AUTO / HAND · fired: piston-bore (no solids), j4-slot-roller (no solids), pin-lobe (no solids), groove-cam (no solids), pallet-contact (no solids), tongue-slot (no solids) |
| V1 | ? | AUTO · fired: drive (26 solids) |
| V2 | ? | AUTO · fired: drive (26 solids) |
| V3 | ? | AUTO / HAND · fired: drive (26 solids) |
| V4 | ? | AUTO · fired: j8-belt (no solids) |
| V5 | ? | AUTO · fired: drive (26 solids) |
| V6 | ? | AUTO · fired: drive (26 solids), cable-clip (2 solids) |
| L1 | ? | STYLE |
| L2 | ? | HAND |
| L3 | ? | HAND |
| L4 | ? | HAND / STYLE |
| L5 | ? | AUTO / HAND · fired: see-through (18 solids) |
| L6 | ? | AUTO |
| L7 | ? | STYLE |
| L8 | ? | AUTO / HAND · fired: trace-marks (no solids) |
| L9 | ? | AUTO / DATA |
| L10 | ? | AUTO / STYLE |
| R1 | ? | HAND |
| R2 | ? | HAND |
| R3 | ? | AUTO · fired: hardware primitives |
| R4 | ? | AUTO · package v2 27.8 KB |
| R5 | ? | HAND |
| R6 | ? | FLAG |
| R7 | PASS | HAND / FLAG · polish none; 0 solids added, 0 overrides by the polish |
| R8 | ? | AUTO / SITE |
| R9 | ? | AUTO / SITE |
| R10 | ? | FLAG |
| DL1 | ? | AUTO / HAND · 66 of 169 solids on a dropping rung |
| DL2 | ? | HAND |
| DL3 | ? | AUTO |
| DL4 | ? | SITE |
| DL6 | ? | AUTO |
| DL5 | ? | FLAG |
| Q1 | FAIL | 0 findings, 8 clamp, 1 edge |
| Q2 | FAIL | 86 clashes, 0 unnecessary allows |
| Q3 | ? | package v2 written, 27.8 KB; site build not checked here |
| Q4 | ? | local: tools/shot |
| Q5 | ? | local: tools/bench |
| Q6 | ? |  |
| Q7 | ? |  |
| Q8 | ? | teaching review: keep (2026-10-20); the six phases of the finished build are looked at by eye |

## Joints
| Joint | Kit | Block | Support | Stack | F1 locate | F2 retain | F3 torque | F4 thrust | F5 limit | F6 hold | F7 adjust | F8 lube | F9 timing | F10 protect |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| A | J3 | slider-dyad | – | – | none | Shoulder bolt Ø5 x 16, M4 (ISO 7379) | Shoulder bolt Ø5 x 16, M4 (ISO 7379) | none | none | none | none | none | none | none |
| B | J3 | slider-dyad | – | – | none | Shoulder bolt Ø6 x 16, M5 (ISO 7379) | Shoulder bolt Ø6 x 16, M5 (ISO 7379) | none | none | none | none | none | none | none |
| C | J3 | – | – | – | none | Shoulder bolt Ø6 x 30, M5 (ISO 7379) | Shoulder bolt Ø6 x 30, M5 (ISO 7379) | Inner-race spacer 6.2x8.4 | none | none | none | none | none | none |
| O2 | J2 | driver | – | – | 2 x Dowel pin Ø3 x 10 h6, housing to base | 2 x Internal circlip DIN 472, Ø16; End washer 4.4x16, holds the crank on the shaft end; Countersunk M4 x 10 (ISO 10642) | none | Thrust washer 8.2x16, bronze; Wave washer 12x15.8, spring steel | none | none | none | none | none | none |
| slot | J5 | – | – | slab 2 | 2 x Dowel pin Ø3 h6, reference rail to base | Keeper plate, laps the slider | none | none | 2 x Stop block | none | Gib strip 3 x 6 x 98.3, bronze | Felt wiper in a steel clip; Grease nipple M6 (DIN 71412) | none | none |
| rails | J5 | – | – | – | 2 x Dowel pin Ø3 h6, reference rail to base | Keeper plate, laps the slider | none | none | 2 x Stop block | none | Gib strip 3 x 6 x 164, bronze | Felt wiper in a steel clip; Grease nipple M6 (DIN 71412) | none | none |
| O3 | J1 | slider-dyad | bridge (moved) | – | Bridge over the pivot, on two spigoted posts; Dead axle Ø12, shouldered, M10 end | External circlip DIN 471, Ø12 | none | Thrust washer 12.2x20, bronze | none | none | none | none | none | none |
| O3-lever-stops | stops | – | – | – | none | none | none | none | 2 x Stop pin Ø6, hardened, on the lever's edge | none | none | none | none | none |
| drive | drive | – | – | – | none | none | none | none | none | none | none | none | none | Home flag, 1 mm steel vane; Fork sensor, slotted optical, 5 mm gap |

## Supports
| Support | Joint | Kind | Route | Least gap mm | Covers | T10 |
|---|---|---|---|---|---|---|
| O3-bridge | O3 | bridge | moved | 1.5 | lever | see-through |

## Variants and overrides
| Joint or part | Rule result | Chosen | Why |
|---|---|---|---|

## Detail ladder
| Rung | Solids | Marks | Frame ms at this dial position |
|---|---|---|---|
| DL-A | 15 | 0 | ? |
| DL-B | 0 | 194 | ? |
| DL-C | 0 | 0 | ? |
| DL-D | 16 | 0 | ? |
| DL-E | 14 | 1 | ? |
| DL-F | 0 | 0 | ? |
| DL-G | 0 | 0 | ? |
| DL-H | 21 | 0 | ? |
| never | 103 | 195 | ? |

## Promotion candidates
None yet.

## Verification
check: clean · K1 residual: 7.1e-14 · claims: 5 of 5 ok · clearance: 86 clashes · clamp: faults · edge distance: findings · package: 27.8 KB
screenshots: ? · bench: ?
