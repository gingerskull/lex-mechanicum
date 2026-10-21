# Audit: Toggle clamp (toggle-clamp)
standard: 3.0 · date: 2026-10-21 · result: open · detail: full · pass: build
teaching: keep · decisions in the record

## Summary
PASS 13 · FAIL 0 · N/A 0 · open: 154 unjudged

## Requirements
| Id | Status | Evidence / action |
|---|---|---|
| S1 | ? | DATA |
| S2 | ? | HAND |
| S3 | ? | AUTO |
| S4 | ? | SITE |
| S5 | ? | SITE |
| S6 | ? | AUTO |
| P1 | PASS | DATA · record v3 complete (kin and teaching blocks); polish3.ts, audit.md present |
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
| K1 | PASS | AUTO · K1 residual 2.8e-14 (tolerance 1e-9) over 360 samples, reference 0.0e+0 |
| K2 | PASS | AUTO · check: finite, continuous, periodic over 360 samples |
| K3 | ? | AUTO / HAND · 1 block (slider-dyad); no numeric fallback |
| K4 | ? | HAND |
| K6 | ? | DATA |
| K7 | ? | DATA · drivers handle (oscillating) |
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
| T9 | PASS | AUTO / DATA · claim table: 5 ok, 0 off, 0 uncheckable of 5 |
| T10 | ? | AUTO · 1 solid drawn see-through: slide-keeper |
| T11 | ? | AUTO · 0 supports routed, 0 moved off a sweep |
| T12 | ? | HAND · 13 support solids; dropped by the polish: slide-stop0, slide-pad0 |
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
| D11 | PASS | AUTO · SOLID: 0 of 92 solids unsound |
| D7 | ? | HAND |
| A1 | ? | AUTO · A J3, B J3, O J2, slide J5, O-handle-stops stops |
| A2 | ? | AUTO · A J3, B J3, O J2, slide J5, O-handle-stops stops |
| A3 | ? | AUTO · fired: classify (4 solids), axial stack builder |
| A4 | ? | AUTO · fired: j1-dead-axle (no solids), axial stack builder |
| A5 | ? | AUTO · fired: j2-live-shaft (27 solids), j10-shaft-in-plan (no solids), axial stack builder |
| A6 | ? | AUTO · fired: j5-slide (22 solids), j13-compliant (no solids), standoffs (12 solids) |
| A7 | ? | AUTO · fired: base (3 solids), feet (4 solids) |
| A8 | ? | AUTO · fired: fasteners (14 solids) |
| A9 | ? | AUTO / HAND · fired: placement solver |
| A10 | ? | HAND · fired: placement (8 solids), placement solver |
| A11 | ? | AUTO / HAND · fired: j12-flexible (no solids), strap-sheave (no solids), j1-dead-axle (no solids) |
| A12 | PASS | AUTO · clamp check clean |
| A13 | ? | AUTO / HAND · 92 solids, 49 unnamed (further items of a listed set) |
| A14 | ? | AUTO / HAND · fired: support router |
| A15 | PASS | AUTO · clearance in 3D over 72 phases: 0 clashes; hand allow: 0 named, 0 unnecessary |
| A16 | ? | HAND · 5 joint notes; no note: none; no badge: slide |
| A17 | ? | HAND |
| A18 | ? | AUTO · placement: 3 slabs in the tallest stack (30.0 mm), 0 clevises; stack per joint in the Joints table |
| A19 | ? | AUTO · 0 supports routed (0 moved), least gap - mm; still covering a principle part, drawn see-through: none |
| A20 | ? | AUTO · support per joint: none |
| A21 | PASS | AUTO · kit per joint: A J3, B J3, O J2, slide J5, O-handle-stops stops |
| A22 | ? | AUTO · fired: stops (8 solids), adjustable-length (no solids), cable-clip (no solids) |
| E1 | ? | AUTO · every solid has one explode level; levels -3.5 to 4 |
| E2 | ? | AUTO · fired: explode (1 solid) |
| E3 | ? | AUTO · fired: explode (1 solid) |
| E4 | ? | HAND |
| E5 | ? | AUTO · fired: explode (1 solid) |
| E6 | ? | AUTO · fired: explode (1 solid) |
| E7 | ? | AUTO · fired: explode (1 solid) |
| E8 | ? | AUTO · fired: explode (1 solid) |
| E9 | ? | HAND |
| E10 | ? | AUTO · fired: explode (1 solid) |
| J1 | ? | AUTO · fired: trunnion (no solids), j1-dead-axle (no solids) |
| J2 | ? | AUTO · fired: j2-live-shaft (27 solids) |
| J3 | ? | AUTO · fired: j3-moving-pin (18 solids), cross-bearings (no solids), ring-hub (no solids) |
| J4 | ? | AUTO · fired: j4-slot-roller (no solids), pin-lobe (no solids), fork-pin (no solids) |
| J5 | ? | AUTO · fired: piston-bore (no solids), j5-slide (22 solids), tongue-slot (no solids) |
| J6 | ? | AUTO · fired: j6-mesh (no solids), ring-rollers (no solids) |
| J7 | ? | AUTO · fired: groove-cam (no solids), j7-cam (no solids), pallet-contact (no solids), pawl-tooth (no solids) |
| J8 | ? | AUTO · fired: j8-belt (no solids), j12-flexible (no solids) |
| J9 | ? | AUTO · fired: j9-crossed-mesh (no solids) |
| J10 | ? | AUTO · fired: j10-shaft-in-plan (no solids) |
| J12 | ? | AUTO · fired: j12-flexible (no solids), strap-sheave (no solids) |
| J13 | ? | AUTO · fired: j13-compliant (no solids) |
| J11 | ? | AUTO · fired: j11-screw (no solids) |
| F1 | ? | AUTO · served at O, slide; fired: j2-live-shaft (27 solids), j10-shaft-in-plan (no solids), strap-sheave (no solids), j13-compliant (no solids) |
| F2 | ? | AUTO · served at A, B, O, slide; fired: wheels (no solids), j2-live-shaft (27 solids), j10-shaft-in-plan (no solids), cross-bearings (no solids), trunnion (no solids), fork-pin (no solids), ring-hub (no solids), ring-rollers (no solids), j12-flexible (no solids), strap-sheave (no solids), j13-compliant (no solids) |
| F3 | ? | AUTO · served at A, B, O; fired: j2-live-shaft (27 solids), j10-shaft-in-plan (no solids), j12-flexible (no solids), j11-screw (no solids) |
| F4 | ? | AUTO / HAND · served at O; fired: j9-crossed-mesh (no solids), j2-live-shaft (27 solids), j10-shaft-in-plan (no solids), trunnion (no solids) |
| F5 | ? | AUTO / HAND · served at slide, O-handle-stops; fired: j5-slide (22 solids), pawl-tooth (no solids), j13-compliant (no solids), stops (8 solids) |
| F6 | ? | AUTO / HAND · served at no joint; fired: trunnion (no solids), j7-cam (no solids), pallet-contact (no solids), pawl-tooth (no solids), j12-flexible (no solids) |
| F7 | ? | AUTO / HAND · served at slide; fired: j6-mesh (no solids), j9-crossed-mesh (no solids), j5-slide (22 solids), j12-flexible (no solids), adjustable-length (no solids) |
| F8 | ? | AUTO · served at slide; fired: cross-bearings (no solids), tongue-slot (no solids), j12-flexible (no solids), j11-screw (no solids), lubrication (no solids) |
| F9 | ? | AUTO / HAND · served at no joint; fired: j6-mesh (no solids), j9-crossed-mesh (no solids), timing-marks (1 solid) |
| F10 | ? | AUTO / HAND · served at no joint; fired: j12-flexible (no solids), drive (no solids) |
| M1 | ? | AUTO · fired: hardware primitives |
| M2 | ? | HAND |
| M3 | ? | AUTO · fired: j3-moving-pin (18 solids), hardware primitives |
| M4 | ? | AUTO / HAND · fired: base (3 solids), fasteners (14 solids) |
| M5 | ? | AUTO / HAND · fired: hardware primitives |
| M6 | PASS | AUTO · edge distance and walls clean |
| M7 | ? | HAND |
| M8 | ? | AUTO · fired: j1-dead-axle (no solids) |
| M9 | ? | AUTO / HAND · fired: j1-dead-axle (no solids) |
| M10 | ? | AUTO / HAND · 88 of 92 solids name a material |
| M11 | ? | AUTO · fired: j1-dead-axle (no solids), hardware primitives |
| M12 | ? | HAND |
| M13 | ? | AUTO / HAND · 14 threaded |
| M14 | ? | AUTO / HAND · fired: piston-bore (no solids), j4-slot-roller (no solids), pin-lobe (no solids), groove-cam (no solids), pallet-contact (no solids), tongue-slot (no solids) |
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
| L5 | ? | AUTO / HAND · fired: see-through (1 solid) |
| L6 | ? | AUTO |
| L7 | ? | STYLE |
| L8 | ? | AUTO / HAND · fired: trace-marks (1 solid) |
| L9 | ? | AUTO / DATA |
| L10 | ? | AUTO / STYLE |
| R1 | ? | HAND |
| R2 | ? | HAND |
| R3 | ? | AUTO · fired: hardware primitives |
| R4 | ? | AUTO · package v2 16.5 KB |
| R5 | ? | HAND |
| R6 | ? | FLAG |
| R7 | PASS | HAND / FLAG · polish 14 lines (1.4 KB); 3 solids added, 0 overrides by the polish |
| R8 | ? | AUTO / SITE |
| R9 | ? | AUTO / SITE |
| R10 | ? | FLAG |
| DL1 | ? | AUTO / HAND · 35 of 92 solids on a dropping rung |
| DL2 | ? | HAND |
| DL3 | ? | AUTO |
| DL4 | ? | SITE |
| DL6 | ? | AUTO |
| DL5 | ? | FLAG |
| Q1 | PASS | check, clamp and edge distance clean |
| Q2 | PASS | 0 clashes, 0 unnecessary allows |
| Q3 | ? | package v2 written, 16.5 KB; site build not checked here |
| Q4 | ? | local: tools/shot |
| Q5 | ? | local: tools/bench |
| Q6 | ? |  |
| Q7 | ? |  |
| Q8 | ? | teaching review: keep (2026-10-20); the six phases of the finished build are looked at by eye |

## Joints
| Joint | Kit | Block | Support | Stack | F1 locate | F2 retain | F3 torque | F4 thrust | F5 limit | F6 hold | F7 adjust | F8 lube | F9 timing | F10 protect |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| A | J3 | slider-dyad | – | – | none | Shoulder bolt Ø6 x 12, M5 (ISO 7379) | Shoulder bolt Ø6 x 12, M5 (ISO 7379) | none | none | none | none | none | none | none |
| B | J3 | – | – | – | none | Shoulder bolt Ø6 x 16, M5 (ISO 7379) | Shoulder bolt Ø6 x 16, M5 (ISO 7379) | none | none | none | none | none | none | none |
| O | J2 | driver | – | – | 2 x Dowel pin Ø3 x 10 h6, housing to base | 2 x Internal circlip DIN 472, Ø13; External circlip DIN 471, Ø6 | Clamp hub Ø6x16, two set screws at 90°; Set screw M4 (DIN 916), threadlocked | Thrust washer 6.2x14, bronze; Wave washer 9.5x12.8, spring steel | none | none | none | none | none | none |
| slide | J5 | – | – | – | 2 x Dowel pin Ø3 h6, reference rail to base | Keeper plate, laps the slider | none | none | stop | none | Gib strip 3 x 6 x 119.3, bronze | Felt wiper in a steel clip; Grease nipple M6 (DIN 71412) | none | none |
| O-handle-stops | stops | – | – | – | none | none | none | none | 2 x Stop pin Ø6, hardened, on the lever's edge | none | none | none | none | none |

## Supports
| Support | Joint | Kind | Route | Least gap mm | Covers | T10 |
|---|---|---|---|---|---|---|

## Variants and overrides
| Joint or part | Rule result | Chosen | Why |
|---|---|---|---|

## Detail ladder
| Rung | Solids | Marks | Frame ms at this dial position |
|---|---|---|---|
| DL-A | 8 | 0 | ? |
| DL-B | 0 | 112 | ? |
| DL-C | 0 | 0 | ? |
| DL-D | 9 | 0 | ? |
| DL-E | 3 | 0 | ? |
| DL-F | 0 | 0 | ? |
| DL-G | 0 | 0 | ? |
| DL-H | 15 | 0 | ? |
| never | 57 | 153 | ? |

## Promotion candidates
None yet.

## Verification
check: clean · K1 residual: 2.8e-14 · claims: 5 of 5 ok · clearance: 0 clashes · clamp: clean · edge distance: clean · package: 16.5 KB
screenshots: ? · bench: ?
