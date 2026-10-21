# Audit: Ackermann steering linkage (ackermann-steering)
standard: 3.0 · date: 2026-10-21 · result: open · detail: full · pass: build
teaching: rethink · decisions in the record

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
| K1 | PASS | AUTO · K1 residual 6.4e-14 (tolerance 1e-9) over 360 samples, reference 1.7e-14 |
| K2 | PASS | AUTO · check: finite, continuous, periodic over 360 samples |
| K3 | ? | AUTO / HAND · 1 block (dyad); no numeric fallback |
| K4 | ? | HAND |
| K6 | ? | DATA |
| K7 | ? | DATA · drivers steer (oscillating) |
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
| T10 | ? | AUTO · 6 solids drawn see-through: KR-slv, KR-bb, KR-ecl, KR-axle-s4, KR-axle-s5, KR-bridge |
| T11 | ? | AUTO · 1 support routed, 1 moved off a sweep |
| T12 | PASS | HAND · 11 support solids; dropped by the polish: none |
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
| D11 | PASS | AUTO · SOLID: 0 of 93 solids unsound |
| D7 | ? | HAND |
| A1 | ? | AUTO · PL J3, PR J3, KL J2, KR J1, KL-knuckle-left-stops stops, KR-knuckle-right-stops stops |
| A2 | ? | AUTO · PL J3, PR J3, KL J2, KR J1, KL-knuckle-left-stops stops, KR-knuckle-right-stops stops |
| A3 | ? | AUTO · fired: classify (4 solids), axial stack builder |
| A4 | ? | AUTO · fired: j1-dead-axle (27 solids), axial stack builder |
| A5 | ? | AUTO · fired: j2-live-shaft (28 solids), j10-shaft-in-plan (no solids), axial stack builder |
| A6 | ? | AUTO · fired: j5-slide (no solids), j13-compliant (no solids), standoffs (no solids) |
| A7 | ? | AUTO · fired: base (3 solids), feet (4 solids) |
| A8 | ? | AUTO · fired: fasteners (6 solids) |
| A9 | ? | AUTO / HAND · fired: placement solver |
| A10 | ? | HAND · fired: placement (6 solids), placement solver |
| A11 | ? | AUTO / HAND · fired: j12-flexible (no solids), strap-sheave (no solids), j1-dead-axle (27 solids) |
| A12 | PASS | AUTO · clamp check clean |
| A13 | ? | AUTO / HAND · 93 solids, 54 unnamed (further items of a listed set) |
| A14 | ? | AUTO / HAND · fired: support router |
| A15 | PASS | AUTO · clearance in 3D over 72 phases: 0 clashes; hand allow: 0 named, 0 unnecessary |
| A16 | ? | HAND · 6 joint notes; no note: none; no badge: none |
| A17 | ? | HAND |
| A18 | ? | AUTO · placement: 2 slabs in the tallest stack (16.0 mm), 0 clevises; stack per joint in the Joints table |
| A19 | ? | AUTO · 1 support routed (1 moved), least gap 1.5 mm; still covering a principle part, drawn see-through: KR-bridge |
| A20 | ? | AUTO · support per joint: KR bridge |
| A21 | PASS | AUTO · kit per joint: PL J3, PR J3, KL J2, KR J1, KL-knuckle-left-stops stops, KR-knuckle-right-stops stops |
| A22 | ? | AUTO · fired: stops (16 solids), adjustable-length (no solids), cable-clip (no solids) |
| E1 | ? | AUTO · every solid has one explode level; levels -3 to 3.5 |
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
| J2 | ? | AUTO · fired: j2-live-shaft (28 solids) |
| J3 | ? | AUTO · fired: j3-moving-pin (18 solids), cross-bearings (no solids), ring-hub (no solids) |
| J4 | ? | AUTO · fired: j4-slot-roller (no solids), pin-lobe (no solids), fork-pin (no solids) |
| J5 | ? | AUTO · fired: piston-bore (no solids), j5-slide (no solids), tongue-slot (no solids) |
| J6 | ? | AUTO · fired: j6-mesh (no solids), ring-rollers (no solids) |
| J7 | ? | AUTO · fired: groove-cam (no solids), j7-cam (no solids), pallet-contact (no solids), pawl-tooth (no solids) |
| J8 | ? | AUTO · fired: j8-belt (no solids), j12-flexible (no solids) |
| J9 | ? | AUTO · fired: j9-crossed-mesh (no solids) |
| J10 | ? | AUTO · fired: j10-shaft-in-plan (no solids) |
| J12 | ? | AUTO · fired: j12-flexible (no solids), strap-sheave (no solids) |
| J13 | ? | AUTO · fired: j13-compliant (no solids) |
| J11 | ? | AUTO · fired: j11-screw (no solids) |
| F1 | ? | AUTO · served at KL, KR; fired: j2-live-shaft (28 solids), j10-shaft-in-plan (no solids), strap-sheave (no solids), j13-compliant (no solids) |
| F2 | ? | AUTO · served at PL, PR, KL, KR; fired: j2-live-shaft (28 solids), j10-shaft-in-plan (no solids), cross-bearings (no solids), trunnion (no solids), fork-pin (no solids), ring-hub (no solids), ring-rollers (no solids), j12-flexible (no solids), strap-sheave (no solids), j13-compliant (no solids) |
| F3 | ? | AUTO · served at PL, PR, KL; fired: j2-live-shaft (28 solids), j10-shaft-in-plan (no solids), j12-flexible (no solids), j11-screw (no solids) |
| F4 | ? | AUTO / HAND · served at KL, KR; fired: j9-crossed-mesh (no solids), j2-live-shaft (28 solids), j10-shaft-in-plan (no solids), trunnion (no solids) |
| F5 | ? | AUTO / HAND · served at KL-knuckle-left-stops, KR-knuckle-right-stops; fired: j5-slide (no solids), pawl-tooth (no solids), j13-compliant (no solids), stops (16 solids) |
| F6 | ? | AUTO / HAND · served at no joint; fired: trunnion (no solids), j7-cam (no solids), pallet-contact (no solids), pawl-tooth (no solids), j12-flexible (no solids) |
| F7 | ? | AUTO / HAND · served at no joint; fired: j6-mesh (no solids), j9-crossed-mesh (no solids), j5-slide (no solids), j12-flexible (no solids), adjustable-length (no solids) |
| F8 | ? | AUTO · served at no joint; fired: cross-bearings (no solids), tongue-slot (no solids), j12-flexible (no solids), j11-screw (no solids), lubrication (1 solid) |
| F9 | ? | AUTO / HAND · served at no joint; fired: j6-mesh (no solids), j9-crossed-mesh (no solids), timing-marks (1 solid) |
| F10 | ? | AUTO / HAND · served at no joint; fired: j12-flexible (no solids), drive (no solids) |
| M1 | ? | AUTO · fired: hardware primitives |
| M2 | ? | HAND |
| M3 | ? | AUTO · fired: j3-moving-pin (18 solids), hardware primitives |
| M4 | ? | AUTO / HAND · fired: base (3 solids), fasteners (6 solids) |
| M5 | ? | AUTO / HAND · fired: hardware primitives |
| M6 | PASS | AUTO · edge distance and walls clean |
| M7 | ? | HAND |
| M8 | ? | AUTO · fired: j1-dead-axle (27 solids) |
| M9 | ? | AUTO / HAND · fired: j1-dead-axle (27 solids) |
| M10 | ? | AUTO / HAND · 90 of 93 solids name a material |
| M11 | ? | AUTO · fired: j1-dead-axle (27 solids), hardware primitives |
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
| L5 | ? | AUTO / HAND · fired: see-through (6 solids) |
| L6 | ? | AUTO |
| L7 | ? | STYLE |
| L8 | ? | AUTO / HAND · fired: trace-marks (no solids) |
| L9 | ? | AUTO / DATA |
| L10 | ? | AUTO / STYLE |
| R1 | ? | HAND |
| R2 | ? | HAND |
| R3 | ? | AUTO · fired: hardware primitives |
| R4 | ? | AUTO · package v2 18.0 KB |
| R5 | ? | HAND |
| R6 | ? | FLAG |
| R7 | PASS | HAND / FLAG · polish none; 0 solids added, 0 overrides by the polish |
| R8 | ? | AUTO / SITE |
| R9 | ? | AUTO / SITE |
| R10 | ? | FLAG |
| DL1 | ? | AUTO / HAND · 35 of 93 solids on a dropping rung |
| DL2 | ? | HAND |
| DL3 | ? | AUTO |
| DL4 | ? | SITE |
| DL6 | ? | AUTO |
| DL5 | ? | FLAG |
| Q1 | PASS | check, clamp and edge distance clean |
| Q2 | PASS | 0 clashes, 0 unnecessary allows |
| Q3 | ? | package v2 written, 18.0 KB; site build not checked here |
| Q4 | ? | local: tools/shot |
| Q5 | ? | local: tools/bench |
| Q6 | ? |  |
| Q7 | ? |  |
| Q8 | ? | teaching review: rethink (2026-10-20); the six phases of the finished build are looked at by eye |

## Joints
| Joint | Kit | Block | Support | Stack | F1 locate | F2 retain | F3 torque | F4 thrust | F5 limit | F6 hold | F7 adjust | F8 lube | F9 timing | F10 protect |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| PL | J3 | dyad | – | – | none | Shoulder bolt Ø8 x 12, M6 (ISO 7379) | Shoulder bolt Ø8 x 12, M6 (ISO 7379) | none | none | none | none | none | none | none |
| PR | J3 | – | – | – | none | Shoulder bolt Ø8 x 12, M6 (ISO 7379) | Shoulder bolt Ø8 x 12, M6 (ISO 7379) | none | none | none | none | none | none | none |
| KL | J2 | driver | – | – | 2 x Dowel pin Ø3 x 10 h6, housing to base | 2 x Internal circlip DIN 472, Ø21; External circlip DIN 471, Ø12 | Feather key 4 x 4 x 10 (DIN 6885); Clamp hub Ø12x22, two set screws at 90°; Set screw M4 (DIN 916), threadlocked | Thrust washer 12.2x20, bronze; Wave washer 16.5x20.8, spring steel | none | none | none | none | none | none |
| KR | J1 | dyad | bridge (moved) | – | Bridge over the pivot, on two spigoted posts; Dead axle Ø12, shouldered, M10 end | External circlip DIN 471, Ø12 | none | Thrust washer 12.2x20, bronze | none | none | none | none | none | none |
| KL-knuckle-left-stops | stops | – | – | – | none | none | none | none | 2 x Stop pin Ø6, hardened, on the lever's edge | none | none | none | none | none |
| KR-knuckle-right-stops | stops | – | – | – | none | none | none | none | 2 x Stop pin Ø6, hardened, on the lever's edge | none | none | none | none | none |

## Supports
| Support | Joint | Kind | Route | Least gap mm | Covers | T10 |
|---|---|---|---|---|---|---|
| KR-bridge | KR | bridge | moved | 1.5 | knuckle-right | see-through |

## Variants and overrides
| Joint or part | Rule result | Chosen | Why |
|---|---|---|---|

## Detail ladder
| Rung | Solids | Marks | Frame ms at this dial position |
|---|---|---|---|
| DL-A | 10 | 0 | ? |
| DL-B | 0 | 121 | ? |
| DL-C | 0 | 0 | ? |
| DL-D | 12 | 0 | ? |
| DL-E | 0 | 1 | ? |
| DL-F | 0 | 0 | ? |
| DL-G | 0 | 0 | ? |
| DL-H | 13 | 0 | ? |
| never | 58 | 166 | ? |

## Promotion candidates
None yet.

## Verification
check: clean · K1 residual: 6.4e-14 · claims: 5 of 5 ok · clearance: 0 clashes · clamp: clean · edge distance: clean · package: 18.0 KB
screenshots: ? · bench: ?
