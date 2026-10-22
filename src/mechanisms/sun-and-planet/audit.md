# Audit: Sun and planet gear (sun-and-planet)
standard: 3.0 · date: 2026-10-22 · result: open · detail: full · pass: build
teaching: tweak · decisions in the record

## Summary
PASS 9 · FAIL 5 · N/A 0 · open: FAIL K1, A15, M6, Q1, Q2; 153 unjudged

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
| K1 | FAIL | AUTO · K1 residual 5.5e-4 (tolerance 1e-9) over 360 samples, reference 6.4e+2; residual 5.5e-4 at P (tolerance 1e-9); the declared branch does not reproduce the reference geometry (6.4e+2) |
| K2 | PASS | AUTO · check: finite, continuous, periodic over 360 samples |
| K3 | ? | AUTO / HAND · 2 blocks (dyad, gear-mesh); no numeric fallback |
| K4 | ? | HAND |
| K6 | ? | DATA |
| K7 | ? | DATA · drivers orbit (rotary) |
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
| T9 | PASS | AUTO / DATA · claim table: 4 ok, 0 off, 0 uncheckable of 4 |
| T10 | ? | AUTO · 0 solids drawn see-through |
| T11 | ? | AUTO · 1 support routed, 0 moved off a sweep |
| T12 | PASS | HAND · 13 support solids; dropped by the polish: none |
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
| D11 | PASS | AUTO · SOLID: 0 of 134 solids unsound |
| D7 | ? | HAND |
| A1 | ? | AUTO · M J6, B J3, P J3, Os J2, Ob J1, Ob-beam-stops stops, drive drive |
| A2 | ? | AUTO · M J6, B J3, P J3, Os J2, Ob J1, Ob-beam-stops stops, drive drive |
| A3 | ? | AUTO · fired: classify (6 solids), axial stack builder |
| A4 | ? | AUTO · fired: j1-dead-axle (27 solids), axial stack builder |
| A5 | ? | AUTO · fired: j2-live-shaft (39 solids), j10-shaft-in-plan (no solids), axial stack builder |
| A6 | ? | AUTO · fired: j5-slide (no solids), j13-compliant (no solids), standoffs (no solids) |
| A7 | ? | AUTO · fired: base (3 solids), feet (4 solids) |
| A8 | ? | AUTO · fired: fasteners (12 solids) |
| A9 | ? | AUTO / HAND · fired: placement solver |
| A10 | ? | HAND · fired: placement (12 solids), placement solver |
| A11 | ? | AUTO / HAND · fired: j12-flexible (no solids), strap-sheave (no solids), j1-dead-axle (27 solids) |
| A12 | PASS | AUTO · clamp check clean |
| A13 | ? | AUTO / HAND · 134 solids, 68 unnamed (further items of a listed set) |
| A14 | ? | AUTO / HAND · fired: support router |
| A15 | FAIL | AUTO · clearance in 3D over 72 phases: 8 clashes: Os-k0-hub x retainer 2.21 mm; Os-k1-key x Os-axle 1.52 mm; Os-k0-hub x Os-k1-key 1.27 mm; Os-1-sp x Os-k1-hub 1.19 mm; hand allow: 0 named, 0 unnecessary |
| A16 | ? | HAND · 7 joint notes; no note: none; no badge: M |
| A17 | ? | HAND |
| A18 | ? | AUTO · placement: 4 slabs in the tallest stack (54.0 mm), 0 clevises; stack per joint in the Joints table |
| A19 | ? | AUTO · 1 support routed (0 moved), least gap 1.5 mm; still covering a principle part, drawn see-through: none |
| A20 | ? | AUTO · support per joint: Ob bridge |
| A21 | PASS | AUTO · kit per joint: M J6, B J3, P J3, Os J2, Ob J1, Ob-beam-stops stops, drive drive |
| A22 | ? | AUTO · fired: stops (8 solids), adjustable-length (no solids), cable-clip (2 solids) |
| E1 | ? | AUTO · every solid has one explode level; levels -4.5 to 7.5 |
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
| J2 | ? | AUTO · fired: j2-live-shaft (39 solids) |
| J3 | ? | AUTO · fired: j3-moving-pin (23 solids), cross-bearings (no solids), ring-hub (no solids) |
| J4 | ? | AUTO · fired: j4-slot-roller (no solids), pin-lobe (no solids), fork-pin (no solids) |
| J5 | ? | AUTO · fired: piston-bore (no solids), j5-slide (no solids), tongue-slot (no solids) |
| J6 | ? | AUTO · fired: j6-mesh (1 solid), ring-carrier (no solids), ring-rollers (no solids) |
| J7 | ? | AUTO · fired: groove-cam (no solids), j7-cam (no solids), pallet-contact (no solids), pawl-tooth (no solids) |
| J8 | ? | AUTO · fired: j8-belt (no solids), j12-flexible (no solids) |
| J9 | ? | AUTO · fired: j9-crossed-mesh (no solids) |
| J10 | ? | AUTO · fired: j10-shaft-in-plan (no solids) |
| J12 | ? | AUTO · fired: j12-flexible (no solids), strap-sheave (no solids) |
| J13 | ? | AUTO · fired: j13-compliant (no solids) |
| J11 | ? | AUTO · fired: j11-screw (no solids) |
| F1 | ? | AUTO · served at Os, Ob; fired: j2-live-shaft (39 solids), j10-shaft-in-plan (no solids), ring-carrier (no solids), strap-sheave (no solids), j13-compliant (no solids) |
| F2 | ? | AUTO · served at B, P, Os, Ob; fired: j2-live-shaft (39 solids), j10-shaft-in-plan (no solids), cross-bearings (no solids), trunnion (no solids), ring-carrier (no solids), fork-pin (no solids), ring-hub (no solids), ring-rollers (no solids), j12-flexible (no solids), strap-sheave (no solids), j13-compliant (no solids) |
| F3 | ? | AUTO · served at B, P, Os; fired: j2-live-shaft (39 solids), j10-shaft-in-plan (no solids), j12-flexible (no solids), j11-screw (no solids) |
| F4 | ? | AUTO / HAND · served at P, Os, Ob; fired: j9-crossed-mesh (no solids), j2-live-shaft (39 solids), j10-shaft-in-plan (no solids), trunnion (no solids) |
| F5 | ? | AUTO / HAND · served at Ob-beam-stops; fired: j5-slide (no solids), pawl-tooth (no solids), j13-compliant (no solids), stops (8 solids) |
| F6 | ? | AUTO / HAND · served at no joint; fired: trunnion (no solids), j7-cam (no solids), pallet-contact (no solids), pawl-tooth (no solids), j12-flexible (no solids) |
| F7 | ? | AUTO / HAND · served at M; fired: j6-mesh (1 solid), j9-crossed-mesh (no solids), j5-slide (no solids), j12-flexible (no solids), adjustable-length (no solids) |
| F8 | ? | AUTO · served at no joint; fired: cross-bearings (no solids), tongue-slot (no solids), j12-flexible (no solids), j11-screw (no solids), lubrication (1 solid) |
| F9 | ? | AUTO / HAND · served at M; fired: j6-mesh (1 solid), j9-crossed-mesh (no solids), timing-marks (2 solids) |
| F10 | ? | AUTO / HAND · served at drive; fired: j12-flexible (no solids), drive (26 solids) |
| M1 | ? | AUTO · fired: hardware primitives |
| M2 | ? | HAND |
| M3 | ? | AUTO · fired: j3-moving-pin (23 solids), hardware primitives |
| M4 | ? | AUTO / HAND · fired: base (3 solids), fasteners (12 solids) |
| M5 | ? | AUTO / HAND · fired: hardware primitives |
| M6 | FAIL | AUTO · edge distance: drive-flange: wall 1.07 mm round the Ø3.0 hole at (6.7, -13.4), needs 1.5 |
| M7 | ? | HAND |
| M8 | ? | AUTO · fired: j1-dead-axle (27 solids) |
| M9 | ? | AUTO / HAND · fired: j1-dead-axle (27 solids) |
| M10 | ? | AUTO / HAND · 128 of 134 solids name a material |
| M11 | ? | AUTO · fired: j1-dead-axle (27 solids), hardware primitives |
| M12 | ? | HAND |
| M13 | ? | AUTO / HAND · 16 threaded |
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
| L5 | ? | AUTO / HAND · fired: see-through (no solids) |
| L6 | ? | AUTO |
| L7 | ? | STYLE |
| L8 | ? | AUTO / HAND · fired: trace-marks (no solids) |
| L9 | ? | AUTO / DATA |
| L10 | ? | AUTO / STYLE |
| R1 | ? | HAND |
| R2 | ? | HAND |
| R3 | ? | AUTO · fired: hardware primitives |
| R4 | ? | AUTO · package v2 26.5 KB |
| R5 | ? | HAND |
| R6 | ? | FLAG |
| R7 | PASS | HAND / FLAG · polish none; 0 solids added, 0 overrides by the polish |
| R8 | ? | AUTO / SITE |
| R9 | ? | AUTO / SITE |
| R10 | ? | FLAG |
| DL1 | ? | AUTO / HAND · 55 of 134 solids on a dropping rung |
| DL2 | ? | HAND |
| DL3 | ? | AUTO |
| DL4 | ? | SITE |
| DL6 | ? | AUTO |
| DL5 | ? | FLAG |
| Q1 | FAIL | 2 findings, 0 clamp, 1 edge |
| Q2 | FAIL | 8 clashes, 0 unnecessary allows |
| Q3 | ? | package v2 written, 26.5 KB; site build not checked here |
| Q4 | ? | local: tools/shot |
| Q5 | ? | local: tools/bench |
| Q6 | ? |  |
| Q7 | ? |  |
| Q8 | ? | teaching review: tweak (2026-10-20); the six phases of the finished build are looked at by eye |

## Joints
| Joint | Kit | Block | Support | Stack | F1 locate | F2 retain | F3 torque | F4 thrust | F5 limit | F6 hold | F7 adjust | F8 lube | F9 timing | F10 protect |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| M | J6 | gear-mesh | – | – | none | none | none | none | none | none | Eccentric bushing Ø28, 0.3 mm offset bore Ø14, flanged | none | Rod; Sun | none |
| B | J3 | gear-mesh | – | – | none | Shoulder bolt Ø12 x 12, M10 (ISO 7379) | Shoulder bolt Ø12 x 12, M10 (ISO 7379) | none | none | none | none | none | none | none |
| P | J3 | dyad | – | – | none | Internal circlip DIN 472, Ø24; Shoulder bolt Ø12 x 30, M10 (ISO 7379) | Shoulder bolt Ø12 x 30, M10 (ISO 7379) | Inner-race spacer 12.2x16.2 | none | none | none | none | none | none |
| Os | J2 | – | – | – | 2 x Dowel pin Ø3 x 10 h6, housing to base | 2 x Internal circlip DIN 472, Ø21; External circlip DIN 471, Ø12 | Feather key 4 x 4 x 18 (DIN 6885); 3 x Clamp hub Ø12x22, two set screws at 90°; 3 x Set screw M4 (DIN 916), threadlocked; Feather key 4 x 4 x 10 (DIN 6885); Feather key 4 x 4 x 16 (DIN 6885) | 2 x Inner-race spacer 12.2x15; Thrust washer 12.2x20, bronze; Wave washer 16.5x20.8, spring steel | none | none | none | none | none | none |
| Ob | J1 | dyad | bridge | – | Bridge over the pivot, on two spigoted posts; Dead axle Ø12, shouldered, M10 end | External circlip DIN 471, Ø12 | none | Thrust washer 12.2x20, bronze | none | none | none | none | none | none |
| Ob-beam-stops | stops | – | – | – | none | none | none | none | 2 x Stop pin Ø6, hardened, on the lever's edge | none | none | none | none | none |
| drive | drive | – | – | – | none | none | none | none | none | none | none | none | none | Home flag, 1 mm steel vane; Fork sensor, slotted optical, 5 mm gap |

## Supports
| Support | Joint | Kind | Route | Least gap mm | Covers | T10 |
|---|---|---|---|---|---|---|
| Ob-bridge | Ob | bridge | first choice | 1.5 | – | – |

## Variants and overrides
| Joint or part | Rule result | Chosen | Why |
|---|---|---|---|

## Detail ladder
| Rung | Solids | Marks | Frame ms at this dial position |
|---|---|---|---|
| DL-A | 13 | 0 | ? |
| DL-B | 0 | 209 | ? |
| DL-C | 0 | 0 | ? |
| DL-D | 16 | 0 | ? |
| DL-E | 8 | 3 | ? |
| DL-F | 0 | 0 | ? |
| DL-G | 0 | 0 | ? |
| DL-H | 18 | 0 | ? |
| never | 79 | 277 | ? |

## Promotion candidates
None yet.

## Verification
check: 2 findings · K1 residual: 5.5e-4 · claims: 4 of 4 ok · clearance: 8 clashes · clamp: clean · edge distance: findings · package: 26.5 KB
screenshots: ? · bench: ?
