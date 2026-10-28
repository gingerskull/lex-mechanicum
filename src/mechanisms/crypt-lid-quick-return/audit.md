# Audit: Nosferatu crypt-lid quick-return (crypt-lid-quick-return)
standard: 3.11 · date: 2026-10-28 · result: open · detail: full · pass: build
teaching: tweak · decisions in the record

## Summary
PASS 52 · FAIL 1 · N/A 9 · open: FAIL P1; 105 unjudged

## Requirements
| Id | Status | Evidence / action |
|---|---|---|
| S1 | ? | DATA |
| S2 | ? | HAND |
| S3 | PASS | AUTO · filled by the generator: the pipeline holds it for every built mechanism |
| S4 | ? | SITE |
| S5 | ? | SITE |
| S6 | PASS | AUTO · filled by the generator: the pipeline holds it for every built mechanism |
| P1 | FAIL | DATA · record missing references, media; no polish, audit.md present |
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
| K1 | PASS | AUTO · K1 residual 1.2e-13 (tolerance 1e-9) over 360 samples, reference 0.0e+0 |
| K2 | PASS | AUTO · check: finite, continuous, periodic over 360 samples |
| K3 | ? | AUTO / HAND · 4 blocks (slider-dyad, cam-rocker, dyad, follow); no numeric fallback |
| K4 | ? | HAND |
| K6 | ? | DATA |
| K7 | ? | DATA · drivers input (rotary) |
| K8 | ? | AUTO / DATA |
| K9 | ? | DATA |
| K10 | ? | AUTO / DATA |
| K11 | PASS | AUTO · mobility counted 4, dof 1 |
| K12 | ? | DATA |
| T1 | ? | HAND |
| T2 | ? | HAND |
| T3 | ? | DATA |
| T4 | ? | DATA · fired: trace-marks (no solids) |
| T5 | ? | DATA |
| T6 | ? | HAND / DATA |
| T7 | ? | DATA |
| T8 | ? | DATA |
| T9 | PASS | AUTO / DATA · claim table: 8 ok, 0 off, 0 uncheckable of 8 |
| T10 | PASS | AUTO · 85 solids drawn see-through: figure-cape, figure-collar-l, figure-collar-r, figure-body, figure-head, figure-arm-l, figure-arm-r, figure-fore-l · filled by the generator: a rule built solids for it |
| T11 | PASS | AUTO · 4 supports routed, 4 moved off a sweep · filled by the generator: a rule built solids for it |
| T12 | PASS | HAND · 27 support solids; dropped by the polish: none |
| T13 | ? | DATA |
| T14 | ? | HAND / DATA |
| T15 | ? | HAND |
| T16 | ? | HAND / STYLE |
| T17 | PASS | AUTO · filled by the generator: the pipeline holds it for every built mechanism |
| D1 | ? | HAND · fired: wheels (no solids) |
| D2 | ? | HAND |
| D3 | ? | STYLE |
| D4 | PASS | AUTO · fired: base (3 solids), feet (4 solids) · filled by the generator: a rule built solids for it |
| D5 | ? | AUTO / HAND |
| D6 | ? | HAND / STYLE |
| D8 | ? | AUTO / HAND |
| D9 | ? | AUTO / HAND · fired: j12-cvt (no solids) |
| D10 | PASS | AUTO · filled by the generator: the pipeline holds it for every built mechanism |
| D11 | PASS | AUTO · SOLID: 0 of 273 solids unsound |
| D7 | ? | HAND |
| A1 | PASS | AUTO · R J3, E J3, F J3, G J10, C J10, O J10, H J10, A J4, K J7, drive drive · filled by the generator: the pipeline holds it for every built mechanism |
| A2 | PASS | AUTO · R J3, E J3, F J3, G J10, C J10, O J10, H J10, A J4, K J7, drive drive · filled by the generator: the pipeline holds it for every built mechanism |
| A3 | PASS | AUTO · fired: classify (11 solids), axial stack builder · filled by the generator: a rule built solids for it |
| A4 | ? | AUTO · fired: j1-dead-axle (no solids), axial stack builder |
| A5 | PASS | AUTO · fired: j2-live-shaft (no solids), j10-shaft-in-plan (120 solids), axial stack builder · filled by the generator: a rule built solids for it |
| A6 | ? | AUTO · fired: j5-slide (no solids), j13-compliant (no solids), standoffs (no solids) |
| A7 | PASS | AUTO · fired: base (3 solids), posts (12 solids), feet (4 solids) · filled by the generator: a rule built solids for it |
| A8 | PASS | AUTO · fired: fasteners (61 solids) · filled by the generator: a rule built solids for it |
| A9 | ? | AUTO / HAND · fired: placement solver |
| A10 | ? | HAND · fired: placement (82 solids), placement solver |
| A11 | ? | AUTO / HAND · fired: j12-flexible (no solids), strap-sheave (no solids), j1-dead-axle (no solids) |
| A12 | PASS | AUTO · clamp check clean |
| A13 | ? | AUTO / HAND · 273 solids, 174 unnamed (further items of a listed set) |
| A14 | ? | AUTO / HAND · fired: support router |
| A15 | PASS | AUTO · clearance in 3D over 72 phases: 0 clashes; hand allow: 1 named, 0 unnecessary |
| A16 | ? | HAND · 10 joint notes; no note: none; no badge: none |
| A17 | ? | HAND |
| A18 | PASS | AUTO · placement: 4 slabs in the tallest stack (47.0 mm), 0 clevises; stack per joint in the Joints table · filled by the generator: the pipeline holds it for every built mechanism |
| A19 | ? | AUTO · 4 supports routed (4 moved), least gap 1.5 mm; still covering a principle part, drawn see-through: G-pb, C-pb, O-pb, H-pb |
| A20 | ? | AUTO · support per joint: G pillow, C pillow, O pillow, H pillow |
| A21 | PASS | AUTO · kit per joint: R J3, E J3, F J3, G J10, C J10, O J10, H J10, A J4, K J7, drive drive |
| A22 | PASS | AUTO · fired: stops (no solids), adjustable-length (no solids), cable-clip (2 solids) · filled by the generator: a rule built solids for it |
| E1 | PASS | AUTO · every solid has one explode level; levels 0 to 37.12 · filled by the generator: the pipeline holds it for every built mechanism |
| E2 | PASS | AUTO · fired: explode (1 solid) · filled by the generator: a rule built solids for it |
| E3 | PASS | AUTO · fired: explode (1 solid) · filled by the generator: a rule built solids for it |
| E4 | ? | HAND |
| E5 | PASS | AUTO · fired: explode (1 solid) · filled by the generator: a rule built solids for it |
| E6 | PASS | AUTO · fired: explode (1 solid) · filled by the generator: a rule built solids for it |
| E7 | PASS | AUTO · fired: explode (1 solid) · filled by the generator: a rule built solids for it |
| E8 | PASS | AUTO · fired: explode (1 solid) · filled by the generator: a rule built solids for it |
| E9 | ? | HAND |
| E10 | PASS | AUTO · fired: explode (1 solid) · filled by the generator: a rule built solids for it |
| J1 | N/A | AUTO · fired: trunnion (no solids), hub (no solids), j1-dead-axle (no solids) · filled by the generator: no joint of this type |
| J2 | N/A | AUTO · fired: j2-live-shaft (no solids) · filled by the generator: no joint of this type |
| J3 | PASS | AUTO · fired: j3-moving-pin (26 solids), cross-bearings (no solids), oblique-journal (no solids), eccentric-bearing (no solids), spider-pin (no solids), ball-socket (no solids), ring-hub (no solids), eccentric (no solids) · filled by the generator: a rule built its kit |
| J4 | PASS | AUTO · fired: pin-hole (no solids), j4-slot-roller (6 solids), pin-lobe (no solids), fork-pin (no solids), die (no solids) · filled by the generator: a rule built its kit |
| J5 | N/A | AUTO · fired: tongue-slot (no solids), integrator-carriage (no solids), piston-bore (no solids), j5-slide (no solids), leg-bore (no solids) · filled by the generator: no joint of this type |
| J6 | N/A | AUTO · fired: j6-mesh (no solids), friction-contact (no solids), ring-carrier (no solids), pin-ring (no solids), ring-rollers (no solids) · filled by the generator: no joint of this type |
| J7 | PASS | AUTO · fired: ball-socket (no solids), groove-cam (no solids), j7-cam (1 solid), pallet-contact (no solids), pawl-tooth (no solids) · filled by the generator: a rule built its kit |
| J8 | N/A | AUTO · fired: j12-flexible (no solids), j8-belt (no solids) · filled by the generator: no joint of this type |
| J9 | N/A | AUTO · fired: j9-crossed-mesh (no solids) · filled by the generator: no joint of this type |
| J10 | PASS | AUTO · fired: j12-cvt (no solids), j10-shaft-in-plan (120 solids), j11-screw (no solids) · filled by the generator: a rule built its kit |
| J12 | N/A | AUTO · fired: j12-flexible (no solids), j12-cvt (no solids), j12-other (no solids), strap-sheave (no solids) · filled by the generator: no joint of this type |
| J13 | N/A | AUTO · fired: j13-compliant (no solids) · filled by the generator: no joint of this type |
| J11 | N/A | AUTO · fired: j11-screw (no solids) · filled by the generator: no joint of this type |
| F1 | PASS | AUTO · served at G, C, O, H; fired: posts (12 solids), integrator-carriage (no solids), j2-live-shaft (no solids), j10-shaft-in-plan (120 solids), ring-carrier (no solids), pin-ring (no solids), hub (no solids), strap-sheave (no solids), j13-compliant (no solids), covers (no solids) · filled by the generator: a rule built solids for it |
| F2 | PASS | AUTO · served at R, E, F, G, C, O, H; fired: wheels (no solids), j12-flexible (no solids), j2-live-shaft (no solids), j10-shaft-in-plan (120 solids), cross-bearings (no solids), oblique-journal (no solids), trunnion (no solids), ring-carrier (no solids), eccentric-bearing (no solids), pin-ring (no solids), spider-pin (no solids), fork-pin (no solids), ring-hub (no solids), eccentric (no solids), hub (no solids), leg-bore (no solids), ring-rollers (no solids), strap-sheave (no solids), j11-screw (no solids), j13-compliant (no solids), covers (no solids) · filled by the generator: a rule built solids for it |
| F3 | PASS | AUTO · served at R, E, F, C; fired: j12-flexible (no solids), j2-live-shaft (no solids), j10-shaft-in-plan (120 solids), j11-screw (no solids) · filled by the generator: a rule built solids for it |
| F4 | ? | AUTO / HAND · served at C, H; fired: j9-crossed-mesh (no solids), j2-live-shaft (no solids), j10-shaft-in-plan (120 solids), trunnion (no solids), spider-pin (no solids), j11-screw (no solids) |
| F5 | ? | AUTO / HAND · served at no joint; fired: integrator-carriage (no solids), j5-slide (no solids), pawl-tooth (no solids), j11-screw (no solids), j13-compliant (no solids), stops (no solids) |
| F6 | ? | AUTO / HAND · served at no joint; fired: friction-contact (no solids), j12-flexible (no solids), j12-cvt (no solids), trunnion (no solids), j7-cam (1 solid), pallet-contact (no solids), pawl-tooth (no solids) |
| F7 | ? | AUTO / HAND · served at no joint; fired: j6-mesh (no solids), friction-contact (no solids), j9-crossed-mesh (no solids), j12-flexible (no solids), j12-cvt (no solids), j5-slide (no solids), j12-other (no solids), adjustable-length (no solids), covers (no solids) |
| F8 | ? | AUTO · served at A; fired: tongue-slot (no solids), j12-flexible (no solids), cross-bearings (no solids), ball-socket (no solids), eccentric (no solids), leg-bore (no solids), j11-screw (no solids), lubrication (no solids) |
| F9 | ? | AUTO / HAND · served at K; fired: j6-mesh (no solids), j9-crossed-mesh (no solids), timing-marks (2 solids) |
| F10 | ? | AUTO / HAND · served at drive; fired: j12-flexible (no solids), drive (30 solids) |
| M1 | ? | AUTO · fired: hardware primitives |
| M2 | ? | HAND |
| M3 | PASS | AUTO · fired: j3-moving-pin (26 solids), hardware primitives · filled by the generator: a rule built solids for it |
| M4 | ? | AUTO / HAND · fired: base (3 solids), fasteners (61 solids) |
| M5 | ? | AUTO / HAND · fired: hardware primitives |
| M6 | PASS | AUTO · edge distance and walls clean |
| M7 | ? | HAND |
| M8 | ? | AUTO · fired: j1-dead-axle (no solids) |
| M9 | ? | AUTO / HAND · fired: j1-dead-axle (no solids) |
| M10 | ? | AUTO / HAND · 264 of 273 solids name a material |
| M11 | ? | AUTO · fired: j1-dead-axle (no solids), hardware primitives |
| M12 | ? | HAND |
| M13 | ? | AUTO / HAND · 33 threaded |
| M14 | ? | AUTO / HAND · fired: tongue-slot (no solids), piston-bore (no solids), pin-hole (no solids), j4-slot-roller (6 solids), pin-lobe (no solids), groove-cam (no solids), pallet-contact (no solids), eccentric (no solids), die (no solids), hub (no solids), leg-bore (no solids) |
| V1 | PASS | AUTO · fired: drive (30 solids) · filled by the generator: a rule built solids for it |
| V2 | PASS | AUTO · fired: drive (30 solids) · filled by the generator: a rule built solids for it |
| V3 | ? | AUTO / HAND · fired: drive (30 solids) |
| V4 | ? | AUTO · fired: j8-belt (no solids) |
| V5 | PASS | AUTO · fired: drive (30 solids) · filled by the generator: a rule built solids for it |
| V6 | PASS | AUTO · fired: drive (30 solids), cable-clip (2 solids) · filled by the generator: a rule built solids for it |
| L1 | ? | STYLE |
| L2 | ? | HAND |
| L3 | ? | HAND |
| L4 | ? | HAND / STYLE |
| L5 | ? | AUTO / HAND · fired: see-through (58 solids) |
| L6 | PASS | AUTO · filled by the generator: the pipeline holds it for every built mechanism |
| L7 | ? | STYLE |
| L8 | ? | AUTO / HAND · fired: trace-marks (no solids) |
| L9 | ? | AUTO / DATA |
| L10 | ? | AUTO / STYLE |
| R1 | ? | HAND |
| R2 | ? | HAND |
| R3 | ? | AUTO · fired: hardware primitives |
| R4 | PASS | AUTO · package v2 40.2 KB · filled by the generator: the pipeline holds it for every built mechanism |
| R5 | ? | HAND |
| R6 | ? | FLAG |
| R7 | PASS | HAND / FLAG · polish none; 0 solids added, 0 overrides by the polish |
| R8 | ? | AUTO / SITE |
| R9 | ? | AUTO / SITE |
| R10 | ? | FLAG |
| DL1 | ? | AUTO / HAND · 112 of 273 solids on a dropping rung |
| DL2 | ? | HAND |
| DL3 | PASS | AUTO · filled by the generator: the pipeline holds it for every built mechanism |
| DL4 | ? | SITE |
| DL6 | PASS | AUTO · filled by the generator: the pipeline holds it for every built mechanism |
| DL5 | ? | FLAG |
| Q1 | PASS | check, clamp and edge distance clean |
| Q2 | PASS | 0 clashes, 0 unnecessary allows |
| Q3 | ? | package v2 written, 40.2 KB; site build not checked here |
| Q4 | ? | local: tools/shot |
| Q5 | ? | local: tools/bench |
| Q6 | ? |  |
| Q7 | ? |  |
| Q8 | ? | teaching review: tweak (2026-10-28); the six phases of the finished build are looked at by eye |

## Joints
| Joint | Kit | Block | Support | Stack | F1 locate | F2 retain | F3 torque | F4 thrust | F5 limit | F6 hold | F7 adjust | F8 lube | F9 timing | F10 protect |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| R | J3 | – | – | – | none | Internal circlip DIN 472, Ø7; Shoulder bolt Ø3 x 20, M2.5 (ISO 7379) | Shoulder bolt Ø3 x 20, M2.5 (ISO 7379) | none | none | none | none | none | none | none |
| E | J3 | dyad | – | – | none | Shoulder bolt Ø5 x 16, M4 (ISO 7379) | Shoulder bolt Ø5 x 16, M4 (ISO 7379) | none | none | none | none | none | none | none |
| F | J3 | – | – | – | none | Shoulder bolt Ø5 x 12, M4 (ISO 7379) | Shoulder bolt Ø5 x 12, M4 (ISO 7379) | none | none | none | none | none | none | none |
| G | J10 | cam-rocker | pillow (moved) | – | 4 x Dowel pin Ø4 x 14 h6, block to base; Dead shaft Ø5, clamped in two pillow blocks | End washer 3.4x13, holds the rocker on the shaft end; Countersunk M3 x 8 (ISO 10642); 2 x Set screw M4 on a flat, clamps the dead shaft (F2, F3) | none | none | none | none | none | none | none | none |
| C | J10 | driver | pillow (moved) | – | 4 x Dowel pin Ø4 x 14 h6, block to base | End washer 5.4x18, holds the crank on the shaft end; Countersunk M5 x 12 (ISO 10642); 2 x Internal circlip DIN 472, Ø19 | Feather key 3 x 3 x 5 (DIN 6885); 2 x Clamp hub Ø10x20, two set screws at 90°; 2 x Set screw M4 (DIN 916), threadlocked; Feather key 3 x 3 x 7 (DIN 6885) | Inner-race spacer 10.2x13; 2 x Shaft collar 10x18, set screw | none | none | none | none | none | none |
| O | J10 | slider-dyad | pillow (moved) | – | 4 x Dowel pin Ø4 x 14 h6, block to base; Dead shaft Ø12, clamped in two pillow blocks | End washer 5.4x20, holds the lever on the shaft end; Countersunk M5 x 12 (ISO 10642); 2 x Set screw M4 on a flat, clamps the dead shaft (F2, F3) | none | none | none | none | none | none | none | none |
| H | J10 | dyad | pillow (moved) | – | 4 x Dowel pin Ø4 x 14 h6, block to base | End washer 3.4x14, holds the figure on the shaft end; Countersunk M3 x 8 (ISO 10642); 2 x circlipInternal | none | Inner-race spacer 6.2x9; 2 x Shaft collar 6x14, set screw | none | none | none | none | none | none |
| A | J4 | slider-dyad | – | – | none | none | none | none | none | none | none | Felt oiler, oil-soaked wool felt | none | none |
| K | J7 | cam-rocker | – | – | none | none | none | none | none | none | none | none | Cam | none |
| drive | drive | – | – | – | none | none | none | none | none | none | none | none | none | Home flag, 1 mm steel vane; Fork sensor, slotted optical, 5 mm gap |

## Supports
| Support | Joint | Kind | Route | Least gap mm | Covers | T10 |
|---|---|---|---|---|---|---|
| G-pb | G | pillow | moved | 1.5 | cam, rocker, link, occupant | – |
| C-pb | C | pillow | moved | 1.5 | rocker, link, occupant, lever | – |
| O-pb | O | pillow | moved | 1.5 | crank, lever | – |
| H-pb | H | pillow | moved | 1.5 | lever, cam, rocker, roller, link, occupant, crank | – |

## Variants and overrides
| Joint or part | Rule result | Chosen | Why |
|---|---|---|---|

## Detail ladder
| Rung | Solids | Marks | Frame ms at this dial position |
|---|---|---|---|
| DL-A | 53 | 716 | ? |
| DL-B | 0 | 616 | ? |
| DL-C | 0 | 0 | ? |
| DL-D | 17 | 0 | ? |
| DL-E | 9 | 1 | ? |
| DL-F | 0 | 0 | ? |
| DL-G | 0 | 0 | ? |
| DL-H | 33 | 0 | ? |
| never | 161 | 194 | ? |

## Promotion candidates
None yet.

## Verification
check: clean · K1 residual: 1.2e-13 · claims: 8 of 8 ok · clearance: 0 clashes · clamp: clean · edge distance: clean · package: 40.2 KB
screenshots: ? · bench: ?
