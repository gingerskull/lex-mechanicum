# Audit: Bevel gear pair (bevel-gears)
standard: 3.0 · date: 2026-10-21 · result: open · detail: full · pass: build
teaching: tweak · decisions in the record

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
| P1 | PASS | DATA · record v3 complete (kin and teaching blocks); polish.ts, audit.md present |
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
| K1 | PASS | AUTO · K1 residual 7.1e-15 (tolerance 1e-9) over 360 samples, reference 0.0e+0 |
| K2 | PASS | AUTO · check: finite, continuous, periodic over 360 samples |
| K3 | ? | AUTO / HAND · 1 block (gear-mesh); no numeric fallback |
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
| T4 | ? | DATA · fired: trace-marks (2 solids) |
| T5 | ? | DATA |
| T6 | ? | HAND / DATA |
| T7 | ? | DATA |
| T8 | ? | DATA |
| T9 | PASS | AUTO / DATA · claim table: 1 ok, 0 off, 0 uncheckable of 1 |
| T10 | ? | AUTO · 0 solids drawn see-through |
| T11 | ? | AUTO · 2 supports routed, 1 moved off a sweep |
| T12 | PASS | HAND · 17 support solids; dropped by the polish: none |
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
| D11 | PASS | AUTO · SOLID: 0 of 90 solids unsound |
| D7 | ? | HAND |
| A1 | ? | AUTO · M J9, O2 J2, O1 J10, O2-gear-stops stops |
| A2 | ? | AUTO · M J9, O2 J2, O1 J10, O2-gear-stops stops |
| A3 | ? | AUTO · fired: classify (3 solids), axial stack builder |
| A4 | ? | AUTO · fired: j1-dead-axle (no solids), axial stack builder |
| A5 | ? | AUTO · fired: j2-live-shaft (43 solids), j10-shaft-in-plan (34 solids), axial stack builder |
| A6 | ? | AUTO · fired: j5-slide (no solids), j13-compliant (no solids), standoffs (no solids) |
| A7 | ? | AUTO · fired: base (3 solids), feet (4 solids) |
| A8 | ? | AUTO · fired: fasteners (17 solids) |
| A9 | ? | AUTO / HAND · fired: placement solver |
| A10 | ? | HAND · fired: placement (4 solids), placement solver |
| A11 | ? | AUTO / HAND · fired: j12-flexible (no solids), strap-sheave (no solids), j1-dead-axle (no solids) |
| A12 | PASS | AUTO · clamp check clean |
| A13 | ? | AUTO / HAND · 90 solids, 54 unnamed (further items of a listed set) |
| A14 | ? | AUTO / HAND · fired: support router |
| A15 | FAIL | AUTO · clearance in 3D over 72 phases: 4 clashes: O1-axle x O1-pb-b0-ped 2.74 mm; O1-axle x O1-pb-b1-ped 2.74 mm; O2-gear-stop1 x gear 2.58 mm; O2-gear-stop0 x gear 2.58 mm; hand allow: 0 named, 0 unnecessary |
| A16 | ? | HAND · 4 joint notes; no note: none; no badge: M |
| A17 | ? | HAND |
| A18 | ? | AUTO · placement: 1 slabs in the tallest stack (20.0 mm), 0 clevises; stack per joint in the Joints table |
| A19 | ? | AUTO · 2 supports routed (1 moved), least gap 1.5 mm; still covering a principle part, drawn see-through: none |
| A20 | ? | AUTO · support per joint: O2 bridge, O1 pillow |
| A21 | PASS | AUTO · kit per joint: M J9, O2 J2, O1 J10, O2-gear-stops stops |
| A22 | ? | AUTO · fired: stops (8 solids), adjustable-length (no solids), cable-clip (no solids) |
| E1 | ? | AUTO · every solid has one explode level; levels -10 to 7 |
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
| J2 | ? | AUTO · fired: j2-live-shaft (43 solids) |
| J3 | ? | AUTO · fired: j3-moving-pin (no solids), ring-hub (no solids) |
| J4 | ? | AUTO · fired: j4-slot-roller (no solids), pin-lobe (no solids), fork-pin (no solids) |
| J5 | ? | AUTO · fired: j5-slide (no solids), tongue-slot (no solids) |
| J6 | ? | AUTO · fired: j6-mesh (no solids), ring-rollers (no solids) |
| J7 | ? | AUTO · fired: groove-cam (no solids), j7-cam (no solids), pallet-contact (no solids), pawl-tooth (no solids) |
| J8 | ? | AUTO · fired: j8-belt (no solids), j12-flexible (no solids) |
| J9 | ? | AUTO · fired: j9-crossed-mesh (1 solid) |
| J10 | ? | AUTO · fired: j10-shaft-in-plan (34 solids) |
| J12 | ? | AUTO · fired: j12-flexible (no solids), strap-sheave (no solids) |
| J13 | ? | AUTO · fired: j13-compliant (no solids) |
| J11 | ? | AUTO · fired: j11-screw (no solids) |
| F1 | ? | AUTO · served at O2, O1; fired: j2-live-shaft (43 solids), j10-shaft-in-plan (34 solids), strap-sheave (no solids), j13-compliant (no solids) |
| F2 | ? | AUTO · served at O2, O1; fired: j2-live-shaft (43 solids), j10-shaft-in-plan (34 solids), fork-pin (no solids), ring-hub (no solids), ring-rollers (no solids), j12-flexible (no solids), strap-sheave (no solids), j13-compliant (no solids) |
| F3 | ? | AUTO · served at O2, O1; fired: j2-live-shaft (43 solids), j10-shaft-in-plan (34 solids), j12-flexible (no solids), j11-screw (no solids) |
| F4 | ? | AUTO / HAND · served at M, O2, O1; fired: j9-crossed-mesh (1 solid), j2-live-shaft (43 solids), j10-shaft-in-plan (34 solids) |
| F5 | ? | AUTO / HAND · served at O2-gear-stops; fired: j5-slide (no solids), pawl-tooth (no solids), j13-compliant (no solids), stops (8 solids) |
| F6 | ? | AUTO / HAND · served at no joint; fired: j7-cam (no solids), pallet-contact (no solids), pawl-tooth (no solids), j12-flexible (no solids) |
| F7 | ? | AUTO / HAND · served at M; fired: j6-mesh (no solids), j9-crossed-mesh (1 solid), j5-slide (no solids), j12-flexible (no solids), adjustable-length (no solids) |
| F8 | ? | AUTO · served at no joint; fired: tongue-slot (no solids), j12-flexible (no solids), j11-screw (no solids), lubrication (1 solid) |
| F9 | ? | AUTO / HAND · served at M; fired: j6-mesh (no solids), j9-crossed-mesh (1 solid), timing-marks (1 solid) |
| F10 | ? | AUTO / HAND · served at no joint; fired: j12-flexible (no solids), drive (no solids) |
| M1 | ? | AUTO · fired: hardware primitives |
| M2 | ? | HAND |
| M3 | ? | AUTO · fired: j3-moving-pin (no solids), hardware primitives |
| M4 | ? | AUTO / HAND · fired: base (3 solids), fasteners (17 solids) |
| M5 | ? | AUTO / HAND · fired: hardware primitives |
| M6 | PASS | AUTO · edge distance and walls clean |
| M7 | ? | HAND |
| M8 | ? | AUTO · fired: j1-dead-axle (no solids) |
| M9 | ? | AUTO / HAND · fired: j1-dead-axle (no solids) |
| M10 | ? | AUTO / HAND · 88 of 90 solids name a material |
| M11 | ? | AUTO · fired: j1-dead-axle (no solids), hardware primitives |
| M12 | ? | HAND |
| M13 | ? | AUTO / HAND · 13 threaded |
| M14 | ? | AUTO / HAND · fired: j4-slot-roller (no solids), pin-lobe (no solids), groove-cam (no solids), pallet-contact (no solids), tongue-slot (no solids) |
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
| L5 | ? | AUTO / HAND · fired: see-through (no solids) |
| L6 | ? | AUTO |
| L7 | ? | STYLE |
| L8 | ? | AUTO / HAND · fired: trace-marks (2 solids) |
| L9 | ? | AUTO / DATA |
| L10 | ? | AUTO / STYLE |
| R1 | ? | HAND |
| R2 | ? | HAND |
| R3 | ? | AUTO · fired: hardware primitives |
| R4 | ? | AUTO · package v2 19.4 KB |
| R5 | ? | HAND |
| R6 | ? | FLAG |
| R7 | ? | HAND / FLAG · polish 2.4 KB; 0 solids added, 0 overrides by the polish |
| R8 | ? | AUTO / SITE |
| R9 | ? | AUTO / SITE |
| R10 | ? | FLAG |
| DL1 | ? | AUTO / HAND · 36 of 90 solids on a dropping rung |
| DL2 | ? | HAND |
| DL3 | ? | AUTO |
| DL4 | ? | SITE |
| DL6 | ? | AUTO |
| DL5 | ? | FLAG |
| Q1 | PASS | check, clamp and edge distance clean |
| Q2 | FAIL | 4 clashes, 0 unnecessary allows |
| Q3 | ? | package v2 written, 19.4 KB; site build not checked here |
| Q4 | ? | local: tools/shot |
| Q5 | ? | local: tools/bench |
| Q6 | ? |  |
| Q7 | ? |  |
| Q8 | ? | teaching review: tweak (2026-10-20); the six phases of the finished build are looked at by eye |

## Joints
| Joint | Kit | Block | Support | Stack | F1 locate | F2 retain | F3 torque | F4 thrust | F5 limit | F6 hold | F7 adjust | F8 lube | F9 timing | F10 protect |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| M | J9 | gear-mesh | – | – | none | none | none | pinion-tw, gear-tw | none | none | pinion-shim, gear-shim | none | Pinion; Gear | none |
| O2 | J2 | – | bridge | – | 2 x Dowel pin Ø3 x 10 h6, housing to base; Bridge over the pivot, on two spigoted posts | 2 x Internal circlip DIN 472, Ø21; External circlip DIN 471, Ø12 | Feather key 4 x 4 x 24 (DIN 6885); Clamp hub Ø12x22, two set screws at 90°; Set screw M4 (DIN 916), threadlocked | Thrust washer 12.2x20, bronze; Wave washer 16.5x20.8, spring steel | none | none | none | none | none | none |
| O1 | J10 | driver | pillow (moved) | – | 4 x Dowel pin Ø4 x 14 h6, block to base | 2 x circlipInternal | Feather key 4 x 4 x 24 (DIN 6885); Clamp hub Ø12x22, two set screws at 90°; Set screw M4 (DIN 916), threadlocked | 2 x Shaft collar 12x20, set screw | none | none | none | none | none | none |
| O2-gear-stops | stops | – | – | – | none | none | none | none | 2 x Stop pin Ø6, hardened, on the lever's edge | none | none | none | none | none |

## Supports
| Support | Joint | Kind | Route | Least gap mm | Covers | T10 |
|---|---|---|---|---|---|---|
| O2-bridge | O2 | bridge | first choice | 1.5 | – | – |
| O1-pb | O1 | pillow | moved | 1.5 | – | – |

## Variants and overrides
| Joint or part | Rule result | Chosen | Why |
|---|---|---|---|

## Detail ladder
| Rung | Solids | Marks | Frame ms at this dial position |
|---|---|---|---|
| DL-A | 8 | 0 | ? |
| DL-B | 0 | 149 | ? |
| DL-C | 0 | 0 | ? |
| DL-D | 9 | 0 | ? |
| DL-E | 0 | 3 | ? |
| DL-F | 0 | 0 | ? |
| DL-G | 0 | 0 | ? |
| DL-H | 19 | 0 | ? |
| never | 54 | 166 | ? |

## Promotion candidates
None yet.

## Verification
check: clean · K1 residual: 7.1e-15 · claims: 1 of 1 ok · clearance: 4 clashes · clamp: clean · edge distance: clean · package: 19.4 KB
screenshots: ? · bench: ?
