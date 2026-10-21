# Audit: Walschaerts valve gear (walschaerts-valve-gear)
standard: 3.0 · date: 2026-10-21 · result: open · detail: full · pass: build
teaching: tweak · decisions in the record

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
| K1 | PASS | AUTO · K1 residual 9.9e-13 (tolerance 1e-9) over 360 samples, reference 1.6e-12; numeric fallback in fallback:radiusrod, fallback:comblever, fallback:union, fallback:spindle |
| K2 | PASS | AUTO · check: finite, continuous, periodic over 360 samples |
| K3 | ? | AUTO / HAND · 3 blocks (slider-dyad, dyad); numeric fallback: fallback:radiusrod, fallback:comblever, fallback:union, fallback:spindle |
| K4 | ? | HAND |
| K6 | ? | DATA |
| K7 | ? | DATA · drivers input (rotary), die (manual) |
| K8 | ? | AUTO / DATA |
| K9 | ? | DATA |
| K10 | ? | AUTO / DATA |
| K11 | PASS | AUTO · mobility counted 2, dof 1 |
| K12 | ? | DATA |
| T1 | ? | HAND |
| T2 | ? | HAND |
| T3 | ? | DATA |
| T4 | ? | DATA · fired: trace-marks (1 solid) |
| T5 | ? | DATA |
| T6 | ? | HAND / DATA |
| T7 | ? | DATA |
| T8 | ? | DATA |
| T9 | PASS | AUTO / DATA · claim table: 7 ok, 0 off, 0 uncheckable of 7 |
| T10 | ? | AUTO · 30 solids drawn see-through: Lf-1-brg, Lf-1-brg-balls, Lf-1-brg-cage, Dl-1-brg, Dl-1-brg-balls, Dl-1-brg-cage, Uc-1-brg, Uc-1-brg-balls |
| T11 | ? | AUTO · 1 support routed, 1 moved off a sweep |
| T12 | PASS | HAND · 24 support solids; dropped by the polish: none |
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
| D11 | PASS | AUTO · SOLID: 0 of 299 solids unsound |
| D7 | ? | HAND |
| A1 | ? | AUTO · Cp J3, Xh J3, Rc J3, Lf J3, Dl J3, Lr J3, Rt J3, Vs J3, Ub J3, Uc J3, O J2, Rs J2, slot J4, guide J5, vguide J5, Lt J1, Lt-link-stops stops, drive drive |
| A2 | ? | AUTO · Cp J3, Xh J3, Rc J3, Lf J3, Dl J3, Lr J3, Rt J3, Vs J3, Ub J3, Uc J3, O J2, Rs J2, slot J4, guide J5, vguide J5, Lt J1, Lt-link-stops stops, drive drive |
| A3 | ? | AUTO · fired: classify (16 solids), axial stack builder |
| A4 | ? | AUTO · fired: j1-dead-axle (27 solids), axial stack builder |
| A5 | ? | AUTO · fired: j2-live-shaft (56 solids), j10-shaft-in-plan (no solids), axial stack builder |
| A6 | ? | AUTO · fired: j5-slide (44 solids), j13-compliant (no solids), standoffs (no solids) |
| A7 | ? | AUTO · fired: base (3 solids), feet (4 solids) |
| A8 | ? | AUTO · fired: fasteners (29 solids) |
| A9 | ? | AUTO / HAND · fired: placement solver |
| A10 | ? | HAND · fired: placement (30 solids), placement solver |
| A11 | ? | AUTO / HAND · fired: j12-flexible (no solids), strap-sheave (no solids), j1-dead-axle (27 solids) |
| A12 | FAIL | AUTO · clamp: Rt-bolt (turning) touches the ground face of vguide-riser1; crosshead (turning) touches the ground face of guide-riser0; link (turning) touches the ground face of guide-riser1; radiusrod (turning) touches the ground face of vguide-riser1; spindle (turning) touches the ground face of vguide-riser0; comblever (turning) touches the ground face of guide-riser1 |
| A13 | ? | AUTO / HAND · 299 solids, 153 unnamed (further items of a listed set) |
| A14 | ? | AUTO / HAND · fired: support router |
| A15 | FAIL | AUTO · clearance in 3D over 8 phases: 46 clashes: guide-riser0 x mainrod 3.50 mm; O-axle x mainrod 2.99 mm; guide-rail1 x link 2.78 mm; guide-rail1 x comblever 2.74 mm; hand allow: 0 named, 0 unnecessary |
| A16 | ? | HAND · 18 joint notes; no note: none; no badge: slot, guide, vguide |
| A17 | ? | HAND |
| A18 | ? | AUTO · placement: 3 slabs in the tallest stack (36.0 mm), 4 clevises; stack per joint in the Joints table |
| A19 | ? | AUTO · 1 support routed (1 moved), least gap 1.5 mm; still covering a principle part, drawn see-through: Lt-bridge |
| A20 | ? | AUTO · support per joint: Lt bridge |
| A21 | PASS | AUTO · kit per joint: Cp J3, Xh J3, Rc J3, Lf J3, Dl J3, Lr J3, Rt J3, Vs J3, Ub J3, Uc J3, O J2, Rs J2, slot J4, guide J5, vguide J5, Lt J1, Lt-link-stops stops, drive drive |
| A22 | ? | AUTO · fired: stops (8 solids), adjustable-length (no solids), cable-clip (2 solids) |
| E1 | ? | AUTO · every solid has one explode level; levels -4 to 5.5 |
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
| J2 | ? | AUTO · fired: j2-live-shaft (56 solids) |
| J3 | ? | AUTO · fired: j3-moving-pin (115 solids), cross-bearings (no solids), ring-hub (no solids) |
| J4 | ? | AUTO · fired: j4-slot-roller (6 solids), pin-lobe (no solids), fork-pin (no solids) |
| J5 | ? | AUTO · fired: piston-bore (no solids), j5-slide (44 solids), tongue-slot (no solids) |
| J6 | ? | AUTO · fired: j6-mesh (no solids), ring-rollers (no solids) |
| J7 | ? | AUTO · fired: groove-cam (no solids), j7-cam (no solids), pallet-contact (no solids), pawl-tooth (no solids) |
| J8 | ? | AUTO · fired: j8-belt (no solids), j12-flexible (no solids) |
| J9 | ? | AUTO · fired: j9-crossed-mesh (no solids) |
| J10 | ? | AUTO · fired: j10-shaft-in-plan (no solids) |
| J12 | ? | AUTO · fired: j12-flexible (no solids), strap-sheave (no solids) |
| J13 | ? | AUTO · fired: j13-compliant (no solids) |
| J11 | ? | AUTO · fired: j11-screw (no solids) |
| F1 | ? | AUTO · served at O, Rs, guide, vguide, Lt; fired: j2-live-shaft (56 solids), j10-shaft-in-plan (no solids), strap-sheave (no solids), j13-compliant (no solids) |
| F2 | ? | AUTO · served at Cp, Xh, Rc, Lf, Dl, Lr, Rt, Vs, Ub, Uc, O, Rs, guide, vguide, Lt; fired: j2-live-shaft (56 solids), j10-shaft-in-plan (no solids), cross-bearings (no solids), trunnion (no solids), fork-pin (no solids), ring-hub (no solids), ring-rollers (no solids), j12-flexible (no solids), strap-sheave (no solids), j13-compliant (no solids) |
| F3 | ? | AUTO · served at Cp, Xh, Rc, Lf, Dl, Lr, Rt, Vs, Ub, Uc, O, Rs; fired: j2-live-shaft (56 solids), j10-shaft-in-plan (no solids), j12-flexible (no solids), j11-screw (no solids) |
| F4 | ? | AUTO / HAND · served at Dl, Lr, Rt, Vs, Ub, Uc, O, Rs, Lt; fired: j9-crossed-mesh (no solids), j2-live-shaft (56 solids), j10-shaft-in-plan (no solids), trunnion (no solids) |
| F5 | ? | AUTO / HAND · served at guide, vguide, Lt-link-stops; fired: j5-slide (44 solids), pawl-tooth (no solids), j13-compliant (no solids), stops (8 solids) |
| F6 | ? | AUTO / HAND · served at no joint; fired: trunnion (no solids), j7-cam (no solids), pallet-contact (no solids), pawl-tooth (no solids), j12-flexible (no solids) |
| F7 | ? | AUTO / HAND · served at guide, vguide; fired: j6-mesh (no solids), j9-crossed-mesh (no solids), j5-slide (44 solids), j12-flexible (no solids), adjustable-length (no solids) |
| F8 | ? | AUTO · served at slot, guide, vguide; fired: cross-bearings (no solids), tongue-slot (no solids), j12-flexible (no solids), j11-screw (no solids), lubrication (1 solid) |
| F9 | ? | AUTO / HAND · served at no joint; fired: j6-mesh (no solids), j9-crossed-mesh (no solids), timing-marks (2 solids) |
| F10 | ? | AUTO / HAND · served at drive; fired: j12-flexible (no solids), drive (26 solids) |
| M1 | ? | AUTO · fired: hardware primitives |
| M2 | ? | HAND |
| M3 | ? | AUTO · fired: j3-moving-pin (115 solids), hardware primitives |
| M4 | ? | AUTO / HAND · fired: base (3 solids), fasteners (29 solids) |
| M5 | ? | AUTO / HAND · fired: hardware primitives |
| M6 | FAIL | AUTO · edge distance: drive-flange: wall 0.35 mm round the Ø3.6 hole at (-13.0, -7.5), needs 1.5 |
| M7 | ? | HAND |
| M8 | ? | AUTO · fired: j1-dead-axle (27 solids) |
| M9 | ? | AUTO / HAND · fired: j1-dead-axle (27 solids) |
| M10 | ? | AUTO / HAND · 284 of 299 solids name a material |
| M11 | ? | AUTO · fired: j1-dead-axle (27 solids), hardware primitives |
| M12 | ? | HAND |
| M13 | ? | AUTO / HAND · 34 threaded |
| M14 | ? | AUTO / HAND · fired: piston-bore (no solids), j4-slot-roller (6 solids), pin-lobe (no solids), groove-cam (no solids), pallet-contact (no solids), tongue-slot (no solids) |
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
| L5 | ? | AUTO / HAND · fired: see-through (30 solids) |
| L6 | ? | AUTO |
| L7 | ? | STYLE |
| L8 | ? | AUTO / HAND · fired: trace-marks (1 solid) |
| L9 | ? | AUTO / DATA |
| L10 | ? | AUTO / STYLE |
| R1 | ? | HAND |
| R2 | ? | HAND |
| R3 | ? | AUTO · fired: hardware primitives |
| R4 | ? | AUTO · package v2 37.3 KB |
| R5 | ? | HAND |
| R6 | ? | FLAG |
| R7 | PASS | HAND / FLAG · polish none; 0 solids added, 0 overrides by the polish |
| R8 | ? | AUTO / SITE |
| R9 | ? | AUTO / SITE |
| R10 | ? | FLAG |
| DL1 | ? | AUTO / HAND · 132 of 299 solids on a dropping rung |
| DL2 | ? | HAND |
| DL3 | ? | AUTO |
| DL4 | ? | SITE |
| DL6 | ? | AUTO |
| DL5 | ? | FLAG |
| Q1 | FAIL | 0 findings, 6 clamp, 1 edge |
| Q2 | FAIL | 46 clashes, 0 unnecessary allows |
| Q3 | ? | package v2 written, 37.3 KB; site build not checked here |
| Q4 | ? | local: tools/shot |
| Q5 | ? | local: tools/bench |
| Q6 | ? |  |
| Q7 | ? |  |
| Q8 | ? | teaching review: tweak (2026-10-20); the six phases of the finished build are looked at by eye |

## Joints
| Joint | Kit | Block | Support | Stack | F1 locate | F2 retain | F3 torque | F4 thrust | F5 limit | F6 hold | F7 adjust | F8 lube | F9 timing | F10 protect |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Cp | J3 | slider-dyad | – | – | none | Shoulder bolt Ø8 x 20, M6 (ISO 7379) | Shoulder bolt Ø8 x 20, M6 (ISO 7379) | none | none | none | none | none | none | none |
| Xh | J3 | – | – | – | none | Shoulder bolt Ø6 x 20, M5 (ISO 7379) | Shoulder bolt Ø6 x 20, M5 (ISO 7379) | none | none | none | none | none | none | none |
| Rc | J3 | dyad | – | – | none | Shoulder bolt Ø6 x 16, M5 (ISO 7379) | Shoulder bolt Ø6 x 16, M5 (ISO 7379) | none | none | none | none | none | none | none |
| Lf | J3 | – | – | – | none | Shoulder bolt Ø6 x 16, M5 (ISO 7379) | Shoulder bolt Ø6 x 16, M5 (ISO 7379) | none | none | none | none | none | none | none |
| Dl | J3 | – | – | – | none | Shoulder bolt Ø6 x 35, M5 (ISO 7379) | Shoulder bolt Ø6 x 35, M5 (ISO 7379) | Inner-race spacer 6.2x8.4 | none | none | none | none | none | none |
| Lr | J3 | dyad | – | – | none | Shoulder bolt Ø6 x 35, M5 (ISO 7379) | Shoulder bolt Ø6 x 35, M5 (ISO 7379) | Inner-race spacer 6.2x8.4 | none | none | none | none | none | none |
| Rt | J3 | – | – | – | none | Shoulder bolt Ø6 x 35, M5 (ISO 7379) | Shoulder bolt Ø6 x 35, M5 (ISO 7379) | Inner-race spacer 6.2x9.1 | none | none | none | none | none | none |
| Vs | J3 | – | – | – | none | Internal circlip DIN 472, Ø9; Shoulder bolt Ø4 x 35, M3 (ISO 7379) | Shoulder bolt Ø4 x 35, M3 (ISO 7379) | Inner-race spacer 4.2x7.1 | none | none | none | none | none | none |
| Ub | J3 | – | – | – | none | Shoulder bolt Ø6 x 35, M5 (ISO 7379) | Shoulder bolt Ø6 x 35, M5 (ISO 7379) | Inner-race spacer 6.2x9.1 | none | none | none | none | none | none |
| Uc | J3 | – | – | – | none | Shoulder bolt Ø6 x 35, M5 (ISO 7379) | Shoulder bolt Ø6 x 35, M5 (ISO 7379) | Inner-race spacer 6.2x9.1 | none | none | none | none | none | none |
| O | J2 | slider-dyad | – | – | 2 x Dowel pin Ø3 x 10 h6, housing to base | 2 x Internal circlip DIN 472, Ø21; End washer 5.4x20, holds the wheel on the shaft end; Countersunk M5 x 12 (ISO 10642) | Feather key 4 x 4 x 10 (DIN 6885) | Thrust washer 12.2x20, bronze; Wave washer 16.5x20.8, spring steel | none | none | none | none | none | none |
| Rs | J2 | driver | – | – | 2 x Dowel pin Ø3 x 10 h6, housing to base | 2 x Internal circlip DIN 472, Ø13; External circlip DIN 471, Ø6 | 2 x Clamp hub Ø6x16, two set screws at 90°; 2 x Set screw M4 (DIN 916), threadlocked | Inner-race spacer 6.2x9; Thrust washer 6.2x14, bronze; Wave washer 9.5x12.8, spring steel | none | none | none | none | none | none |
| slot | J4 | – | – | – | none | none | none | none | none | none | none | Felt oiler, oil-soaked wool felt | none | none |
| guide | J5 | – | – | – | 2 x Dowel pin Ø3 h6, reference rail to base | Keeper plate, laps the slider | none | none | 2 x Stop block | none | Gib strip 3 x 6 x 235.1, bronze | Felt wiper in a steel clip; Grease nipple M6 (DIN 71412) | none | none |
| vguide | J5 | – | – | – | 2 x Dowel pin Ø3 h6, reference rail to base | Keeper plate, laps the slider | none | none | 2 x Stop block | none | Gib strip 3 x 6 x 67.6, bronze | Felt wiper in a steel clip; Grease nipple M6 (DIN 71412) | none | none |
| Lt | J1 | dyad | bridge (moved) | – | Bridge over the pivot, on two spigoted posts; Dead axle Ø8, shouldered, M6 end | External circlip DIN 471, Ø8 | none | Thrust washer 8.2x16, bronze | none | none | none | none | none | none |
| Lt-link-stops | stops | – | – | – | none | none | none | none | 2 x Stop pin Ø6, hardened, on the lever's edge | none | none | none | none | none |
| drive | drive | – | – | – | none | none | none | none | none | none | none | none | none | Home flag, 1 mm steel vane; Fork sensor, slotted optical, 5 mm gap |

## Supports
| Support | Joint | Kind | Route | Least gap mm | Covers | T10 |
|---|---|---|---|---|---|---|
| Lt-bridge | Lt | bridge | moved | 1.5 | link | see-through |

## Variants and overrides
| Joint or part | Rule result | Chosen | Why |
|---|---|---|---|

## Detail ladder
| Rung | Solids | Marks | Frame ms at this dial position |
|---|---|---|---|
| DL-A | 43 | 0 | ? |
| DL-B | 0 | 416 | ? |
| DL-C | 0 | 0 | ? |
| DL-D | 42 | 0 | ? |
| DL-E | 15 | 1 | ? |
| DL-F | 0 | 0 | ? |
| DL-G | 0 | 0 | ? |
| DL-H | 32 | 0 | ? |
| never | 167 | 463 | ? |

## Promotion candidates
None yet.

## Verification
check: clean · K1 residual: 9.9e-13 · claims: 7 of 7 ok · clearance: 46 clashes · clamp: faults · edge distance: findings · package: 37.3 KB
screenshots: ? · bench: ?
