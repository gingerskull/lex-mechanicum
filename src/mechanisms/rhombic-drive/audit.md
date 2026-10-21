# Audit: Rhombic drive (rhombic-drive)
standard: 3.0 · date: 2026-10-21 · result: open · detail: full · pass: build
teaching: tweak · decisions in the record

## Summary
PASS 10 · FAIL 4 · N/A 0 · open: FAIL A12, A15, Q1, Q2; 153 unjudged

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
| K1 | PASS | AUTO · K1 residual 2.8e-14 (tolerance 1e-9) over 360 samples, reference 0.0e+0 |
| K2 | PASS | AUTO · check: finite, continuous, periodic over 360 samples |
| K3 | ? | AUTO / HAND · 3 blocks (gear-mesh, dyad); no numeric fallback |
| K4 | ? | HAND |
| K6 | ? | DATA |
| K7 | ? | DATA · drivers input (rotary) |
| K8 | ? | AUTO / DATA |
| K9 | ? | DATA |
| K10 | ? | AUTO / DATA |
| K11 | PASS | AUTO · mobility counted -1, dof 1 |
| K12 | ? | DATA |
| T1 | ? | HAND |
| T2 | ? | HAND |
| T3 | ? | DATA |
| T4 | ? | DATA · fired: trace-marks (2 solids) |
| T5 | ? | DATA |
| T6 | ? | HAND / DATA |
| T7 | ? | DATA |
| T8 | ? | DATA |
| T9 | PASS | AUTO / DATA · claim table: 6 ok, 0 off, 0 uncheckable of 6 |
| T10 | ? | AUTO · 25 solids drawn see-through: piston-guide-rail0, piston-guide-riser0, piston-guide-rail1, piston-guide-riser1, piston-guide-gib, piston-guide-keeper, piston-guide-sc1, piston-guide-sc1-sh |
| T11 | ? | AUTO · 0 supports routed, 0 moved off a sweep |
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
| D11 | PASS | AUTO · SOLID: 0 of 182 solids unsound |
| D7 | ? | HAND |
| A1 | ? | AUTO · mesh J6, PLa J3, PRa J3, Ta J3, Ba J3, G1 J2, G2 J2, piston-guide J5, displacer-guide J5, drive drive |
| A2 | ? | AUTO · mesh J6, PLa J3, PRa J3, Ta J3, Ba J3, G1 J2, G2 J2, piston-guide J5, displacer-guide J5, drive drive |
| A3 | ? | AUTO · fired: classify (13 solids), axial stack builder |
| A4 | ? | AUTO · fired: j1-dead-axle (no solids), axial stack builder |
| A5 | ? | AUTO · fired: j2-live-shaft (51 solids), j10-shaft-in-plan (no solids), axial stack builder |
| A6 | ? | AUTO · fired: j5-slide (40 solids), j13-compliant (no solids), standoffs (no solids) |
| A7 | ? | AUTO · fired: base (3 solids), feet (4 solids) |
| A8 | ? | AUTO · fired: fasteners (23 solids) |
| A9 | ? | AUTO / HAND · fired: placement solver |
| A10 | ? | HAND · fired: placement (16 solids), placement solver |
| A11 | ? | AUTO / HAND · fired: j12-flexible (no solids), strap-sheave (no solids), j1-dead-axle (no solids) |
| A12 | FAIL | AUTO · clamp: piston (turning) touches the ground face of piston-guide-riser0; displacer (turning) touches the ground face of displacer-guide-riser0 |
| A13 | ? | AUTO / HAND · 182 solids, 86 unnamed (further items of a listed set) |
| A14 | ? | AUTO / HAND · fired: support router |
| A15 | FAIL | AUTO · clearance in 3D over 8 phases: 115 clashes: piston-guide-riser0 x gear2 3.87 mm; displacer-guide-riser0 x gear2 3.87 mm; piston-guide-riser1 x gear1 3.79 mm; displacer-guide-riser1 x gear1 3.79 mm; hand allow: 0 named, 0 unnecessary |
| A16 | ? | HAND · 10 joint notes; no note: none; no badge: mesh, piston-guide, displacer-guide |
| A17 | ? | HAND |
| A18 | ? | AUTO · placement: 4 slabs in the tallest stack (46.0 mm), 0 clevises; stack per joint in the Joints table |
| A19 | ? | AUTO · 0 supports routed (0 moved), least gap - mm; still covering a principle part, drawn see-through: none |
| A20 | ? | AUTO · support per joint: none |
| A21 | PASS | AUTO · kit per joint: mesh J6, PLa J3, PRa J3, Ta J3, Ba J3, G1 J2, G2 J2, piston-guide J5, displacer-guide J5, drive drive |
| A22 | ? | AUTO · fired: stops (no solids), adjustable-length (no solids), cable-clip (2 solids) |
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
| J1 | ? | AUTO · fired: trunnion (no solids), j1-dead-axle (no solids) |
| J2 | ? | AUTO · fired: j2-live-shaft (51 solids) |
| J3 | ? | AUTO · fired: j3-moving-pin (52 solids), cross-bearings (no solids), ring-hub (no solids) |
| J4 | ? | AUTO · fired: j4-slot-roller (no solids), pin-lobe (no solids), fork-pin (no solids) |
| J5 | ? | AUTO · fired: piston-bore (no solids), j5-slide (40 solids), tongue-slot (no solids) |
| J6 | ? | AUTO · fired: j6-mesh (1 solid), ring-rollers (no solids) |
| J7 | ? | AUTO · fired: groove-cam (no solids), j7-cam (no solids), pallet-contact (no solids), pawl-tooth (no solids) |
| J8 | ? | AUTO · fired: j8-belt (no solids), j12-flexible (no solids) |
| J9 | ? | AUTO · fired: j9-crossed-mesh (no solids) |
| J10 | ? | AUTO · fired: j10-shaft-in-plan (no solids) |
| J12 | ? | AUTO · fired: j12-flexible (no solids), strap-sheave (no solids) |
| J13 | ? | AUTO · fired: j13-compliant (no solids) |
| J11 | ? | AUTO · fired: j11-screw (no solids) |
| F1 | ? | AUTO · served at G1, G2, piston-guide, displacer-guide; fired: j2-live-shaft (51 solids), j10-shaft-in-plan (no solids), strap-sheave (no solids), j13-compliant (no solids) |
| F2 | ? | AUTO · served at PLa, PRa, Ta, Ba, G1, G2, piston-guide, displacer-guide; fired: j2-live-shaft (51 solids), j10-shaft-in-plan (no solids), cross-bearings (no solids), trunnion (no solids), fork-pin (no solids), ring-hub (no solids), ring-rollers (no solids), j12-flexible (no solids), strap-sheave (no solids), j13-compliant (no solids) |
| F3 | ? | AUTO · served at PLa, PRa, Ta, Ba, G1, G2; fired: j2-live-shaft (51 solids), j10-shaft-in-plan (no solids), j12-flexible (no solids), j11-screw (no solids) |
| F4 | ? | AUTO / HAND · served at PLa, PRa, Ta, Ba, G1, G2; fired: j9-crossed-mesh (no solids), j2-live-shaft (51 solids), j10-shaft-in-plan (no solids), trunnion (no solids) |
| F5 | ? | AUTO / HAND · served at piston-guide, displacer-guide; fired: j5-slide (40 solids), pawl-tooth (no solids), j13-compliant (no solids), stops (no solids) |
| F6 | ? | AUTO / HAND · served at no joint; fired: trunnion (no solids), j7-cam (no solids), pallet-contact (no solids), pawl-tooth (no solids), j12-flexible (no solids) |
| F7 | ? | AUTO / HAND · served at mesh, piston-guide, displacer-guide; fired: j6-mesh (1 solid), j9-crossed-mesh (no solids), j5-slide (40 solids), j12-flexible (no solids), adjustable-length (no solids) |
| F8 | ? | AUTO · served at piston-guide, displacer-guide; fired: cross-bearings (no solids), tongue-slot (no solids), j12-flexible (no solids), j11-screw (no solids), lubrication (no solids) |
| F9 | ? | AUTO / HAND · served at mesh; fired: j6-mesh (1 solid), j9-crossed-mesh (no solids), timing-marks (1 solid) |
| F10 | ? | AUTO / HAND · served at drive; fired: j12-flexible (no solids), drive (26 solids) |
| M1 | ? | AUTO · fired: hardware primitives |
| M2 | ? | HAND |
| M3 | ? | AUTO · fired: j3-moving-pin (52 solids), hardware primitives |
| M4 | ? | AUTO / HAND · fired: base (3 solids), fasteners (23 solids) |
| M5 | ? | AUTO / HAND · fired: hardware primitives |
| M6 | PASS | AUTO · edge distance and walls clean |
| M7 | ? | HAND |
| M8 | ? | AUTO · fired: j1-dead-axle (no solids) |
| M9 | ? | AUTO / HAND · fired: j1-dead-axle (no solids) |
| M10 | ? | AUTO / HAND · 174 of 182 solids name a material |
| M11 | ? | AUTO · fired: j1-dead-axle (no solids), hardware primitives |
| M12 | ? | HAND |
| M13 | ? | AUTO / HAND · 20 threaded |
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
| L5 | ? | AUTO / HAND · fired: see-through (25 solids) |
| L6 | ? | AUTO |
| L7 | ? | STYLE |
| L8 | ? | AUTO / HAND · fired: trace-marks (2 solids) |
| L9 | ? | AUTO / DATA |
| L10 | ? | AUTO / STYLE |
| R1 | ? | HAND |
| R2 | ? | HAND |
| R3 | ? | AUTO · fired: hardware primitives |
| R4 | ? | AUTO · package v2 26.9 KB |
| R5 | ? | HAND |
| R6 | ? | FLAG |
| R7 | PASS | HAND / FLAG · polish none; 0 solids added, 0 overrides by the polish |
| R8 | ? | AUTO / SITE |
| R9 | ? | AUTO / SITE |
| R10 | ? | FLAG |
| DL1 | ? | AUTO / HAND · 82 of 182 solids on a dropping rung |
| DL2 | ? | HAND |
| DL3 | ? | AUTO |
| DL4 | ? | SITE |
| DL6 | ? | AUTO |
| DL5 | ? | FLAG |
| Q1 | FAIL | 0 findings, 2 clamp, 0 edge |
| Q2 | FAIL | 115 clashes, 0 unnecessary allows |
| Q3 | ? | package v2 written, 26.9 KB; site build not checked here |
| Q4 | ? | local: tools/shot |
| Q5 | ? | local: tools/bench |
| Q6 | ? |  |
| Q7 | ? |  |
| Q8 | ? | teaching review: tweak (2026-10-20); the six phases of the finished build are looked at by eye |

## Joints
| Joint | Kit | Block | Support | Stack | F1 locate | F2 retain | F3 torque | F4 thrust | F5 limit | F6 hold | F7 adjust | F8 lube | F9 timing | F10 protect |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| mesh | J6 | gear-mesh | – | – | none | none | none | none | none | none | Eccentric bushing Ø28, 0.3 mm offset bore Ø14, flanged | none | Gear2; Gear1 | none |
| PLa | J3 | dyad | – | – | none | Shoulder bolt Ø5 x 30, M4 (ISO 7379) | Shoulder bolt Ø5 x 30, M4 (ISO 7379) | Inner-race spacer 5.2x7.8 | none | none | none | none | none | none |
| PRa | J3 | dyad | – | – | none | Shoulder bolt Ø5 x 30, M4 (ISO 7379) | Shoulder bolt Ø5 x 30, M4 (ISO 7379) | Inner-race spacer 5.2x7.8 | none | none | none | none | none | none |
| Ta | J3 | – | – | – | none | Shoulder bolt Ø6 x 25, M5 (ISO 7379) | Shoulder bolt Ø6 x 25, M5 (ISO 7379) | Inner-race spacer 6.2x8.4 | none | none | none | none | none | none |
| Ba | J3 | – | – | – | none | Shoulder bolt Ø6 x 25, M5 (ISO 7379) | Shoulder bolt Ø6 x 25, M5 (ISO 7379) | Inner-race spacer 6.2x8.4 | none | none | none | none | none | none |
| G1 | J2 | – | – | – | 2 x Dowel pin Ø3 x 10 h6, housing to base | 2 x Internal circlip DIN 472, Ø21; End washer 5.4x20, holds the gear1 on the shaft end; Countersunk M5 x 12 (ISO 10642) | Feather key 4 x 4 x 14 (DIN 6885) | Thrust washer 12.2x20, bronze; Wave washer 16.5x20.8, spring steel | none | none | none | none | none | none |
| G2 | J2 | driver | – | – | 2 x Dowel pin Ø3 x 10 h6, housing to base | 2 x Internal circlip DIN 472, Ø21; End washer 5.4x20, holds the gear2 on the shaft end; Countersunk M5 x 12 (ISO 10642) | Feather key 4 x 4 x 14 (DIN 6885) | Thrust washer 12.2x20, bronze; Wave washer 16.5x20.8, spring steel | none | none | none | none | none | none |
| piston-guide | J5 | – | – | – | 2 x Dowel pin Ø3 h6, reference rail to base | Keeper plate, laps the slider | none | none | 2 x Stop block | none | Gib strip 3 x 6 x 73.7, bronze | Felt wiper in a steel clip; Grease nipple M6 (DIN 71412) | none | none |
| displacer-guide | J5 | – | – | – | 2 x Dowel pin Ø3 h6, reference rail to base | Keeper plate, laps the slider | none | none | 2 x Stop block | none | Gib strip 3 x 6 x 73.7, bronze | Felt wiper in a steel clip; Grease nipple M6 (DIN 71412) | none | none |
| drive | drive | – | – | – | none | none | none | none | none | none | none | none | none | Home flag, 1 mm steel vane; Fork sensor, slotted optical, 5 mm gap |

## Supports
| Support | Joint | Kind | Route | Least gap mm | Covers | T10 |
|---|---|---|---|---|---|---|

## Variants and overrides
| Joint or part | Rule result | Chosen | Why |
|---|---|---|---|

## Detail ladder
| Rung | Solids | Marks | Frame ms at this dial position |
|---|---|---|---|
| DL-A | 25 | 0 | ? |
| DL-B | 0 | 254 | ? |
| DL-C | 0 | 0 | ? |
| DL-D | 24 | 0 | ? |
| DL-E | 14 | 2 | ? |
| DL-F | 0 | 0 | ? |
| DL-G | 0 | 0 | ? |
| DL-H | 19 | 0 | ? |
| never | 100 | 241 | ? |

## Promotion candidates
None yet.

## Verification
check: clean · K1 residual: 2.8e-14 · claims: 6 of 6 ok · clearance: 115 clashes · clamp: faults · edge distance: clean · package: 26.9 KB
screenshots: ? · bench: ?
