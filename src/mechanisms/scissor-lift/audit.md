# Audit: Scissor lift (scissor-lift)
standard: 3.0 · date: 2026-10-21 · result: open · detail: full · pass: build
teaching: tweak · decisions in the record

## Summary
PASS 14 · FAIL 0 · N/A 0 · open: 153 unjudged

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
| K1 | PASS | AUTO · K1 residual 5.7e-14 (tolerance 1e-9) over 360 samples, reference 4.0e-14 |
| K2 | PASS | AUTO · check: finite, continuous, periodic over 360 samples |
| K3 | ? | AUTO / HAND · 10 blocks (dyad, lerp, slider-dyad); no numeric fallback |
| K4 | ? | HAND |
| K6 | ? | DATA |
| K7 | ? | DATA · drivers carriage (linear) |
| K8 | ? | AUTO / DATA |
| K9 | ? | DATA |
| K10 | ? | AUTO / DATA |
| K11 | PASS | AUTO · mobility counted 1, dof 1 |
| K12 | ? | DATA |
| T1 | ? | HAND |
| T2 | ? | HAND |
| T3 | ? | DATA |
| T4 | ? | DATA · fired: trace-marks (1 solid) |
| T5 | ? | DATA |
| T6 | ? | HAND / DATA |
| T7 | ? | DATA |
| T8 | ? | DATA |
| T9 | PASS | AUTO / DATA · claim table: 6 ok, 0 off, 0 uncheckable of 6 |
| T10 | ? | AUTO · 8 solids drawn see-through: R0-bolt-wsh, R0-bolt-head, L0-slv, L0-bb, L0-ecl, L0-axle-s4, L0-axle-s5, L0-bridge |
| T11 | ? | AUTO · 1 support routed, 1 moved off a sweep |
| T12 | PASS | HAND · 15 support solids; dropped by the polish: none |
| T13 | ? | DATA |
| T14 | ? | HAND / DATA |
| T15 | ? | HAND |
| T16 | ? | HAND / STYLE |
| T17 | ? | AUTO |
| D1 | ? | HAND · fired: wheels (no solids) |
| D2 | ? | HAND |
| D3 | ? | STYLE |
| D4 | ? | AUTO · fired: base (3 solids), feet (4 solids) |
| D5 | ? | AUTO / HAND |
| D6 | ? | HAND / STYLE |
| D8 | ? | AUTO / HAND |
| D9 | ? | AUTO / HAND |
| D10 | ? | AUTO |
| D11 | PASS | AUTO · SOLID: 0 of 145 solids unsound |
| D7 | ? | HAND |
| A1 | ? | AUTO · R0 J3, M0 J3, L1 J3, R1 J3, M1 J3, L2 J3, R2 J3, M2 J3, L3 J3, R3 J4, carriage-slide J5, L0 J1, L0-a0-stops stops |
| A2 | ? | AUTO · R0 J3, M0 J3, L1 J3, R1 J3, M1 J3, L2 J3, R2 J3, M2 J3, L3 J3, R3 J4, carriage-slide J5, L0 J1, L0-a0-stops stops |
| A3 | ? | AUTO · fired: classify (12 solids), axial stack builder |
| A4 | ? | AUTO · fired: j1-dead-axle (27 solids), axial stack builder |
| A5 | ? | AUTO · fired: j2-live-shaft (no solids), j10-shaft-in-plan (no solids), axial stack builder |
| A6 | ? | AUTO · fired: j5-slide (20 solids), j13-compliant (no solids), standoffs (no solids) |
| A7 | ? | AUTO · fired: base (3 solids), feet (4 solids) |
| A8 | ? | AUTO · fired: fasteners (10 solids) |
| A9 | ? | AUTO / HAND · fired: placement solver |
| A10 | ? | HAND · fired: placement (16 solids), placement solver |
| A11 | ? | AUTO / HAND · fired: j12-flexible (no solids), strap-sheave (no solids), j1-dead-axle (27 solids) |
| A12 | PASS | AUTO · clamp check clean |
| A13 | ? | AUTO / HAND · 145 solids, 72 unnamed (further items of a listed set) |
| A14 | ? | AUTO / HAND · fired: support router |
| A15 | PASS | AUTO · clearance in 3D over 72 phases: 0 clashes; hand allow: 0 named, 0 unnecessary |
| A16 | ? | HAND · 13 joint notes; no note: none; no badge: R3, carriage-slide |
| A17 | ? | HAND |
| A18 | ? | AUTO · placement: 3 slabs in the tallest stack (34.0 mm), 0 clevises; stack per joint in the Joints table |
| A19 | ? | AUTO · 1 support routed (1 moved), least gap 1.5 mm; still covering a principle part, drawn see-through: L0-bridge |
| A20 | ? | AUTO · support per joint: L0 bridge |
| A21 | PASS | AUTO · kit per joint: R0 J3, M0 J3, L1 J3, R1 J3, M1 J3, L2 J3, R2 J3, M2 J3, L3 J3, R3 J4, carriage-slide J5, L0 J1, L0-a0-stops stops |
| A22 | ? | AUTO · fired: stops (no solids), adjustable-length (no solids), cable-clip (no solids) |
| E1 | ? | AUTO · every solid has one explode level; levels -2 to 5.5 |
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
| J2 | ? | AUTO · fired: j2-live-shaft (no solids) |
| J3 | ? | AUTO · fired: j3-moving-pin (81 solids), cross-bearings (no solids), ring-hub (no solids) |
| J4 | ? | AUTO · fired: j4-slot-roller (6 solids), pin-lobe (no solids), fork-pin (no solids) |
| J5 | ? | AUTO · fired: piston-bore (no solids), j5-slide (20 solids), tongue-slot (no solids) |
| J6 | ? | AUTO · fired: j6-mesh (no solids), ring-rollers (no solids) |
| J7 | ? | AUTO · fired: groove-cam (no solids), j7-cam (no solids), pallet-contact (no solids), pawl-tooth (no solids) |
| J8 | ? | AUTO · fired: j8-belt (no solids), j12-flexible (no solids) |
| J9 | ? | AUTO · fired: j9-crossed-mesh (no solids) |
| J10 | ? | AUTO · fired: j10-shaft-in-plan (no solids) |
| J12 | ? | AUTO · fired: j12-flexible (no solids), strap-sheave (no solids) |
| J13 | ? | AUTO · fired: j13-compliant (no solids) |
| J11 | ? | AUTO · fired: j11-screw (no solids) |
| F1 | ? | AUTO · served at carriage-slide, L0; fired: j2-live-shaft (no solids), j10-shaft-in-plan (no solids), strap-sheave (no solids), j13-compliant (no solids) |
| F2 | ? | AUTO · served at R0, M0, L1, R1, M1, L2, R2, M2, L3, carriage-slide, L0; fired: wheels (no solids), j2-live-shaft (no solids), j10-shaft-in-plan (no solids), cross-bearings (no solids), trunnion (no solids), fork-pin (no solids), ring-hub (no solids), ring-rollers (no solids), j12-flexible (no solids), strap-sheave (no solids), j13-compliant (no solids) |
| F3 | ? | AUTO · served at R0, M0, L1, R1, M1, L2, R2, M2, L3; fired: j2-live-shaft (no solids), j10-shaft-in-plan (no solids), j12-flexible (no solids), j11-screw (no solids) |
| F4 | ? | AUTO / HAND · served at L0; fired: j9-crossed-mesh (no solids), j2-live-shaft (no solids), j10-shaft-in-plan (no solids), trunnion (no solids) |
| F5 | ? | AUTO / HAND · served at carriage-slide; fired: j5-slide (20 solids), pawl-tooth (no solids), j13-compliant (no solids), stops (no solids) |
| F6 | ? | AUTO / HAND · served at no joint; fired: trunnion (no solids), j7-cam (no solids), pallet-contact (no solids), pawl-tooth (no solids), j12-flexible (no solids) |
| F7 | ? | AUTO / HAND · served at carriage-slide; fired: j6-mesh (no solids), j9-crossed-mesh (no solids), j5-slide (20 solids), j12-flexible (no solids), adjustable-length (no solids) |
| F8 | ? | AUTO · served at R3, carriage-slide; fired: cross-bearings (no solids), tongue-slot (no solids), j12-flexible (no solids), j11-screw (no solids), lubrication (1 solid) |
| F9 | ? | AUTO / HAND · served at no joint; fired: j6-mesh (no solids), j9-crossed-mesh (no solids), timing-marks (no solids) |
| F10 | ? | AUTO / HAND · served at no joint; fired: j12-flexible (no solids), drive (no solids) |
| M1 | ? | AUTO · fired: hardware primitives |
| M2 | ? | HAND |
| M3 | ? | AUTO · fired: j3-moving-pin (81 solids), hardware primitives |
| M4 | ? | AUTO / HAND · fired: base (3 solids), fasteners (10 solids) |
| M5 | ? | AUTO / HAND · fired: hardware primitives |
| M6 | PASS | AUTO · edge distance and walls clean |
| M7 | ? | HAND |
| M8 | ? | AUTO · fired: j1-dead-axle (27 solids) |
| M9 | ? | AUTO / HAND · fired: j1-dead-axle (27 solids) |
| M10 | ? | AUTO / HAND · 137 of 145 solids name a material |
| M11 | ? | AUTO · fired: j1-dead-axle (27 solids), hardware primitives |
| M12 | ? | HAND |
| M13 | ? | AUTO / HAND · 16 threaded |
| M14 | ? | AUTO / HAND · fired: piston-bore (no solids), j4-slot-roller (6 solids), pin-lobe (no solids), groove-cam (no solids), pallet-contact (no solids), tongue-slot (no solids) |
| V1 | ? | AUTO · fired: drive (no solids) |
| V2 | ? | AUTO · fired: drive (no solids) |
| V3 | ? | AUTO / HAND · fired: drive (no solids) |
| V4 | ? | AUTO · fired: j8-belt (no solids) |
| V5 | ? | AUTO · fired: drive (no solids) |
| V6 | ? | AUTO · fired: drive (no solids), cable-clip (no solids) |
| L1 | ? | STYLE |
| L2 | ? | HAND |
| L3 | ? | HAND |
| L4 | ? | HAND / STYLE |
| L5 | ? | AUTO / HAND · fired: see-through (8 solids) |
| L6 | ? | AUTO |
| L7 | ? | STYLE |
| L8 | ? | AUTO / HAND · fired: trace-marks (1 solid) |
| L9 | ? | AUTO / DATA |
| L10 | ? | AUTO / STYLE |
| R1 | ? | HAND |
| R2 | ? | HAND |
| R3 | ? | AUTO · fired: hardware primitives |
| R4 | ? | AUTO · package v2 15.9 KB |
| R5 | ? | HAND |
| R6 | ? | FLAG |
| R7 | PASS | HAND / FLAG · polish none; 0 solids added, 0 overrides by the polish |
| R8 | ? | AUTO / SITE |
| R9 | ? | AUTO / SITE |
| R10 | ? | FLAG |
| DL1 | ? | AUTO / HAND · 57 of 145 solids on a dropping rung |
| DL2 | ? | HAND |
| DL3 | ? | AUTO |
| DL4 | ? | SITE |
| DL6 | ? | AUTO |
| DL5 | ? | FLAG |
| Q1 | PASS | check, clamp and edge distance clean |
| Q2 | PASS | 0 clashes, 0 unnecessary allows |
| Q3 | ? | package v2 written, 15.9 KB; site build not checked here |
| Q4 | ? | local: tools/shot |
| Q5 | ? | local: tools/bench |
| Q6 | ? |  |
| Q7 | ? |  |
| Q8 | ? | teaching review: tweak (2026-10-20); the six phases of the finished build are looked at by eye |

## Joints
| Joint | Kit | Block | Support | Stack | F1 locate | F2 retain | F3 torque | F4 thrust | F5 limit | F6 hold | F7 adjust | F8 lube | F9 timing | F10 protect |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| R0 | J3 | dyad | – | – | none | Shoulder bolt Ø8 x 16, M6 (ISO 7379) | Shoulder bolt Ø8 x 16, M6 (ISO 7379) | none | none | none | none | none | none | none |
| M0 | J3 | lerp | – | – | none | Shoulder bolt Ø8 x 16, M6 (ISO 7379) | Shoulder bolt Ø8 x 16, M6 (ISO 7379) | none | none | none | none | none | none | none |
| L1 | J3 | dyad | – | – | none | Shoulder bolt Ø8 x 16, M6 (ISO 7379) | Shoulder bolt Ø8 x 16, M6 (ISO 7379) | none | none | none | none | none | none | none |
| R1 | J3 | dyad | – | – | none | Shoulder bolt Ø8 x 16, M6 (ISO 7379) | Shoulder bolt Ø8 x 16, M6 (ISO 7379) | none | none | none | none | none | none | none |
| M1 | J3 | lerp | – | – | none | Shoulder bolt Ø8 x 16, M6 (ISO 7379) | Shoulder bolt Ø8 x 16, M6 (ISO 7379) | none | none | none | none | none | none | none |
| L2 | J3 | dyad | – | – | none | Shoulder bolt Ø8 x 16, M6 (ISO 7379) | Shoulder bolt Ø8 x 16, M6 (ISO 7379) | none | none | none | none | none | none | none |
| R2 | J3 | dyad | – | – | none | Shoulder bolt Ø8 x 16, M6 (ISO 7379) | Shoulder bolt Ø8 x 16, M6 (ISO 7379) | none | none | none | none | none | none | none |
| M2 | J3 | lerp | – | – | none | Shoulder bolt Ø8 x 16, M6 (ISO 7379) | Shoulder bolt Ø8 x 16, M6 (ISO 7379) | none | none | none | none | none | none | none |
| L3 | J3 | slider-dyad | – | – | none | Shoulder bolt Ø8 x 16, M6 (ISO 7379) | Shoulder bolt Ø8 x 16, M6 (ISO 7379) | none | none | none | none | none | none | none |
| R3 | J4 | slider-dyad | – | – | none | none | none | none | none | none | none | Felt oiler, oil-soaked wool felt | none | none |
| carriage-slide | J5 | driver | – | – | 2 x Dowel pin Ø3 h6, reference rail to base | Keeper plate, laps the slider | none | none | 2 x Stop block | none | Gib strip 3 x 6 x 83, bronze | Felt wiper in a steel clip; Grease nipple M6 (DIN 71412) | none | none |
| L0 | J1 | dyad | bridge (moved) | – | Bridge over the pivot, on two spigoted posts; Dead axle Ø8, shouldered, M6 end | External circlip DIN 471, Ø8 | none | Thrust washer 8.2x16, bronze | none | none | none | none | none | none |
| L0-a0-stops | stops | – | – | – | none | none | none | none | none | none | none | none | none | none |

## Supports
| Support | Joint | Kind | Route | Least gap mm | Covers | T10 |
|---|---|---|---|---|---|---|
| L0-bridge | L0 | bridge | moved | 1.5 | a0 | see-through |

## Variants and overrides
| Joint or part | Rule result | Chosen | Why |
|---|---|---|---|

## Detail ladder
| Rung | Solids | Marks | Frame ms at this dial position |
|---|---|---|---|
| DL-A | 20 | 0 | ? |
| DL-B | 0 | 267 | ? |
| DL-C | 0 | 0 | ? |
| DL-D | 21 | 0 | ? |
| DL-E | 4 | 1 | ? |
| DL-F | 0 | 0 | ? |
| DL-G | 0 | 0 | ? |
| DL-H | 12 | 0 | ? |
| never | 88 | 216 | ? |

## Promotion candidates
None yet.

## Verification
check: clean · K1 residual: 5.7e-14 · claims: 6 of 6 ok · clearance: 0 clashes · clamp: clean · edge distance: clean · package: 15.9 KB
screenshots: ? · bench: ?
