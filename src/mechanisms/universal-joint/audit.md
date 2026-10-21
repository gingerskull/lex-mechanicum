# Audit: Universal joint (universal-joint)
standard: 3.0 · date: 2026-10-21 · result: open · detail: full · pass: build
teaching: keep · decisions in the record

## Summary
PASS 11 · FAIL 2 · N/A 0 · open: FAIL A15, Q2; 154 unjudged

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
| K1 | PASS | AUTO · K1 residual 2.1e-14 (tolerance 1e-9) over 360 samples, reference 0.0e+0 |
| K2 | PASS | AUTO · check: finite, continuous, periodic over 360 samples |
| K3 | ? | AUTO / HAND · 1 block (hooke); no numeric fallback |
| K4 | ? | HAND |
| K6 | ? | DATA |
| K7 | ? | DATA · drivers input (rotary) |
| K8 | ? | AUTO / DATA |
| K9 | ? | DATA |
| K10 | ? | AUTO / DATA |
| K11 | PASS | AUTO · mobility counted -2, dof 1 |
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
| T10 | ? | AUTO · 12 solids drawn see-through: B2-pb-b0, B2-pb-b0-brg, B2-pb-b0-brg-balls, B2-pb-b0-brg-cage, B2-pb-b0-cl0, B2-pb-b0-cl1, B2-pb-b0-col0, B2-pb-b0-col1 |
| T11 | ? | AUTO · 2 supports routed, 2 moved off a sweep |
| T12 | PASS | HAND · 19 support solids; dropped by the polish: none |
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
| D11 | PASS | AUTO · SOLID: 0 of 130 solids unsound |
| D7 | ? | HAND |
| A1 | ? | AUTO · B1 J10, B2 J10, C1 cross-pin, C2 cross-pin, drive drive |
| A2 | ? | AUTO · B1 J10, B2 J10, C1 cross-pin, C2 cross-pin, drive drive |
| A3 | ? | AUTO · fired: classify (4 solids), axial stack builder |
| A4 | ? | AUTO · fired: j1-dead-axle (no solids), axial stack builder |
| A5 | ? | AUTO · fired: j2-live-shaft (no solids), j10-shaft-in-plan (69 solids), axial stack builder |
| A6 | ? | AUTO · fired: j5-slide (no solids), j13-compliant (no solids), standoffs (no solids) |
| A7 | ? | AUTO · fired: base (3 solids), feet (4 solids) |
| A8 | ? | AUTO · fired: fasteners (32 solids) |
| A9 | ? | AUTO / HAND · fired: placement solver |
| A10 | ? | HAND · fired: placement (14 solids), placement solver |
| A11 | ? | AUTO / HAND · fired: j12-flexible (no solids), strap-sheave (no solids), j1-dead-axle (no solids) |
| A12 | PASS | AUTO · clamp check clean |
| A13 | ? | AUTO / HAND · 130 solids, 82 unnamed (further items of a listed set) |
| A14 | ? | AUTO / HAND · fired: support router |
| A15 | FAIL | AUTO · clearance in 3D over 72 phases: 1 clash: B2-k0-hub x B2-pb-b0-col0 0.80 mm; hand allow: 0 named, 0 unnecessary |
| A16 | ? | HAND · 5 joint notes; no note: none; no badge: none |
| A17 | ? | HAND |
| A18 | ? | AUTO · placement: 1 slabs in the tallest stack (60.0 mm), 0 clevises; stack per joint in the Joints table |
| A19 | ? | AUTO · 2 supports routed (2 moved), least gap 1.5 mm; still covering a principle part, drawn see-through: B1-pb |
| A20 | ? | AUTO · support per joint: B1 pillow, B2 pillow |
| A21 | PASS | AUTO · kit per joint: B1 J10, B2 J10, C1 cross-pin, C2 cross-pin, drive drive |
| A22 | ? | AUTO · fired: stops (no solids), adjustable-length (no solids), cable-clip (2 solids) |
| E1 | ? | AUTO · every solid has one explode level; levels -13.5 to 10 |
| E2 | ? | AUTO · fired: explode (1 solid) |
| E3 | ? | AUTO · fired: explode (1 solid) |
| E4 | ? | HAND |
| E5 | ? | AUTO · fired: explode (1 solid) |
| E6 | ? | AUTO · fired: explode (1 solid) |
| E7 | ? | AUTO · fired: explode (1 solid) |
| E8 | ? | AUTO · fired: explode (1 solid) |
| E9 | ? | HAND |
| E10 | ? | AUTO · fired: explode (1 solid) |
| J1 | ? | AUTO · fired: j1-dead-axle (no solids) |
| J2 | ? | AUTO · fired: j2-live-shaft (no solids) |
| J3 | ? | AUTO · fired: j3-moving-pin (no solids), cross-bearings (15 solids), ring-hub (no solids) |
| J4 | ? | AUTO · fired: j4-slot-roller (no solids), pin-lobe (no solids), fork-pin (no solids) |
| J5 | ? | AUTO · fired: j5-slide (no solids), tongue-slot (no solids) |
| J6 | ? | AUTO · fired: j6-mesh (no solids), ring-rollers (no solids) |
| J7 | ? | AUTO · fired: groove-cam (no solids), j7-cam (no solids), pallet-contact (no solids), pawl-tooth (no solids) |
| J8 | ? | AUTO · fired: j8-belt (no solids), j12-flexible (no solids) |
| J9 | ? | AUTO · fired: j9-crossed-mesh (no solids) |
| J10 | ? | AUTO · fired: j10-shaft-in-plan (69 solids) |
| J12 | ? | AUTO · fired: j12-flexible (no solids), strap-sheave (no solids) |
| J13 | ? | AUTO · fired: j13-compliant (no solids) |
| J11 | ? | AUTO · fired: j11-screw (no solids) |
| F1 | ? | AUTO · served at B1, B2; fired: j2-live-shaft (no solids), j10-shaft-in-plan (69 solids), strap-sheave (no solids), j13-compliant (no solids) |
| F2 | ? | AUTO · served at B1, B2, C1, C2; fired: j2-live-shaft (no solids), j10-shaft-in-plan (69 solids), cross-bearings (15 solids), fork-pin (no solids), ring-hub (no solids), ring-rollers (no solids), j12-flexible (no solids), strap-sheave (no solids), j13-compliant (no solids) |
| F3 | ? | AUTO · served at B1, B2; fired: j2-live-shaft (no solids), j10-shaft-in-plan (69 solids), j12-flexible (no solids), j11-screw (no solids) |
| F4 | ? | AUTO / HAND · served at B1, B2; fired: j9-crossed-mesh (no solids), j2-live-shaft (no solids), j10-shaft-in-plan (69 solids) |
| F5 | ? | AUTO / HAND · served at no joint; fired: j5-slide (no solids), pawl-tooth (no solids), j13-compliant (no solids), stops (no solids) |
| F6 | ? | AUTO / HAND · served at no joint; fired: j7-cam (no solids), pallet-contact (no solids), pawl-tooth (no solids), j12-flexible (no solids) |
| F7 | ? | AUTO / HAND · served at no joint; fired: j6-mesh (no solids), j9-crossed-mesh (no solids), j5-slide (no solids), j12-flexible (no solids), adjustable-length (no solids) |
| F8 | ? | AUTO · served at C1, C2; fired: cross-bearings (15 solids), tongue-slot (no solids), j12-flexible (no solids), j11-screw (no solids), lubrication (no solids) |
| F9 | ? | AUTO / HAND · served at no joint; fired: j6-mesh (no solids), j9-crossed-mesh (no solids), timing-marks (1 solid) |
| F10 | ? | AUTO / HAND · served at drive; fired: j12-flexible (no solids), drive (30 solids) |
| M1 | ? | AUTO · fired: hardware primitives |
| M2 | ? | HAND |
| M3 | ? | AUTO · fired: j3-moving-pin (no solids), hardware primitives |
| M4 | ? | AUTO / HAND · fired: base (3 solids), fasteners (32 solids) |
| M5 | ? | AUTO / HAND · fired: hardware primitives |
| M6 | PASS | AUTO · edge distance and walls clean |
| M7 | ? | HAND |
| M8 | ? | AUTO · fired: j1-dead-axle (no solids) |
| M9 | ? | AUTO / HAND · fired: j1-dead-axle (no solids) |
| M10 | ? | AUTO / HAND · 127 of 130 solids name a material |
| M11 | ? | AUTO · fired: j1-dead-axle (no solids), hardware primitives |
| M12 | ? | HAND |
| M13 | ? | AUTO / HAND · 15 threaded |
| M14 | ? | AUTO / HAND · fired: j4-slot-roller (no solids), pin-lobe (no solids), groove-cam (no solids), pallet-contact (no solids), tongue-slot (no solids) |
| V1 | ? | AUTO · fired: drive (30 solids) |
| V2 | ? | AUTO · fired: drive (30 solids) |
| V3 | ? | AUTO / HAND · fired: drive (30 solids) |
| V4 | ? | AUTO · fired: j8-belt (no solids) |
| V5 | ? | AUTO · fired: drive (30 solids) |
| V6 | ? | AUTO · fired: drive (30 solids), cable-clip (2 solids) |
| L1 | ? | STYLE |
| L2 | ? | HAND |
| L3 | ? | HAND |
| L4 | ? | HAND / STYLE |
| L5 | ? | AUTO / HAND · fired: see-through (12 solids) |
| L6 | ? | AUTO |
| L7 | ? | STYLE |
| L8 | ? | AUTO / HAND · fired: trace-marks (no solids) |
| L9 | ? | AUTO / DATA |
| L10 | ? | AUTO / STYLE |
| R1 | ? | HAND |
| R2 | ? | HAND |
| R3 | ? | AUTO · fired: hardware primitives |
| R4 | ? | AUTO · package v2 15.8 KB |
| R5 | ? | HAND |
| R6 | ? | FLAG |
| R7 | ? | HAND / FLAG · polish 0.0 KB; 0 solids added, 0 overrides by the polish |
| R8 | ? | AUTO / SITE |
| R9 | ? | AUTO / SITE |
| R10 | ? | FLAG |
| DL1 | ? | AUTO / HAND · 45 of 130 solids on a dropping rung |
| DL2 | ? | HAND |
| DL3 | ? | AUTO |
| DL4 | ? | SITE |
| DL6 | ? | AUTO |
| DL5 | ? | FLAG |
| Q1 | PASS | check, clamp and edge distance clean |
| Q2 | FAIL | 1 clash, 0 unnecessary allows |
| Q3 | ? | package v2 written, 15.8 KB; site build not checked here |
| Q4 | ? | local: tools/shot |
| Q5 | ? | local: tools/bench |
| Q6 | ? |  |
| Q7 | ? |  |
| Q8 | ? | teaching review: keep (2026-10-20); the six phases of the finished build are looked at by eye |

## Joints
| Joint | Kit | Block | Support | Stack | F1 locate | F2 retain | F3 torque | F4 thrust | F5 limit | F6 hold | F7 adjust | F8 lube | F9 timing | F10 protect |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| B1 | J10 | hooke | pillow (moved) | – | 4 x Dowel pin Ø4 x 14 h6, block to base | End washer 5.4x18, holds the yoke in on the shaft end; Countersunk M5 x 12 (ISO 10642); 2 x circlipInternal | Feather key 3 x 3 x 18 (DIN 6885); Clamp hub Ø10x20, two set screws at 90°; Set screw M4 (DIN 916), threadlocked | 2 x Shaft collar 10x18, set screw | none | none | none | none | none | none |
| B2 | J10 | hooke | pillow (moved) | – | 4 x Dowel pin Ø4 x 14 h6, block to base | 2 x Internal circlip DIN 472, Ø19 | Feather key 3 x 3 x 18 (DIN 6885); Clamp hub Ø10x20, two set screws at 90°; Set screw M4 (DIN 916), threadlocked | 2 x Shaft collar 10x18, set screw | none | none | none | none | none | none |
| C1 | cross-pin | hooke | – | – | none | 2 x Internal circlip DIN 472, Ø14 | none | none | none | none | none | Grease nipple M6 (DIN 71412) | none | none |
| C2 | cross-pin | hooke | – | – | none | 2 x Internal circlip DIN 472, Ø14 | none | none | none | none | none | Grease nipple M6 (DIN 71412) | none | none |
| drive | drive | – | – | – | none | none | none | none | none | none | none | none | none | Home flag, 1 mm steel vane; Fork sensor, slotted optical, 5 mm gap |

## Supports
| Support | Joint | Kind | Route | Least gap mm | Covers | T10 |
|---|---|---|---|---|---|---|
| B1-pb | B1 | pillow | moved | 1.5 | yoke-in | – |
| B2-pb | B2 | pillow | moved | 1.5 | – | – |

## Variants and overrides
| Joint or part | Rule result | Chosen | Why |
|---|---|---|---|

## Detail ladder
| Rung | Solids | Marks | Frame ms at this dial position |
|---|---|---|---|
| DL-A | 9 | 0 | ? |
| DL-B | 0 | 277 | ? |
| DL-C | 0 | 0 | ? |
| DL-D | 9 | 0 | ? |
| DL-E | 9 | 0 | ? |
| DL-F | 0 | 0 | ? |
| DL-G | 0 | 0 | ? |
| DL-H | 18 | 0 | ? |
| never | 85 | 142 | ? |

## Promotion candidates
None yet.

## Verification
check: clean · K1 residual: 2.1e-14 · claims: 5 of 5 ok · clearance: 1 clash · clamp: clean · edge distance: clean · package: 15.8 KB
screenshots: ? · bench: ?
