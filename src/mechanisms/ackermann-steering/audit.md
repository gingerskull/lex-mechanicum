# Audit: Ackermann steering linkage (ackermann-steering)
standard: 3.0 · date: 2026-10-22 · result: pass · detail: full · pass: build
teaching: rethink · decisions in the record

## Summary
PASS 147 · FAIL 0 · N/A 20 · open: none

## Requirements
| Id | Status | Evidence / action |
|---|---|---|
| S1 | PASS | DATA · the standard carries version 3.0 and its changelog |
| S2 | PASS | HAND · header with standard, date, result, detail, pass and the teaching: line |
| S3 | PASS | AUTO · tools/conformance reads this sheet (engine v3) and runs in npm run check |
| S4 | PASS | SITE · the pass's decisions on #212; plan and status in #202 |
| S5 | PASS | SITE · 3D stamp in the title block (every shot) and on the card and page header (site build) |
| S6 | PASS | AUTO · rebuilt from its record v3 in batch R1 (#212): bound by 3.0 from this pass |
| P1 | PASS | DATA · record v3 complete (kin and teaching blocks); no polish, audit.md present |
| P2 | PASS | DATA · catalogue validator clean |
| P3 | PASS | DATA / SITE · the page reads ratio, axes, character, backdrivable, aka, family, motion, level, dof and the drive from the record |
| P4 | PASS | DATA · tags grouped Function, Property, Application, keywords |
| P5 | PASS | DATA · explanation in four parts and the examples from the record |
| P6 | PASS | DATA · references and media from the record, validated by the catalogue |
| P7 | PASS | HAND / SITE · no prose in a polish; labels come from the record |
| P8 | PASS | SITE · the page has no parts list or joint sections (site) |
| P9 | PASS | AUTO / HAND · every number the explanation states is a claim and agrees (T9) |
| P10 | PASS | HAND · both arm ends traced, the wheel axis lines and the rear axle line meeting at the turning centre, the arms' aim lines at neutral; plot of the right wheel against the left |
| P11 | PASS | DATA · plain language, mm and degrees |
| P12 | PASS | AUTO / DATA · validate(records, asVersion 3) clean for this record |
| P13 | PASS | HAND · teaching review run against the record before the build and again on the finished drawing (teaching: line) |
| K1 | PASS | AUTO · K1 residual 6.4e-14 (tolerance 1e-9) over 360 samples, reference 1.7e-14 |
| K2 | PASS | AUTO · check: finite, continuous, periodic over 360 samples |
| K3 | PASS | AUTO / HAND · 1 block (dyad); no numeric fallback · composed from the block library; no fallback, no one-off model |
| K4 | PASS | HAND · the left knuckle is the input (accent), the right knuckle the output, the tie rod between |
| K6 | PASS | DATA · track 150, wheelbase 200, arms 45 at 18.5 deg inward, tie rod 121.4: the outer wheel within 2 deg of the ideal |
| K7 | PASS | DATA · drivers steer (oscillating) · input kind declared with its driven joint |
| K8 | PASS | AUTO / DATA · every joint declared with type, bodies, origin and axis; nothing inferred |
| K9 | PASS | DATA · one oscillating driver, the left knuckle -30 to +40 deg, its control the steer |
| K10 | PASS | AUTO / DATA · the tie rod behind the axle, continuous |
| K11 | PASS | AUTO · mobility counted 1, dof 1 |
| K12 | PASS | DATA · every traced, overlaid and claimed point and quantity is named in kin or made by a block |
| T1 | PASS | HAND · mechanics first, no use context in the teaching strings; the principle reads at the default view |
| T2 | PASS | HAND · review before the build and again on the six phases of the finished build; decisions in the record |
| T3 | PASS | DATA · principle parts declared; drawn whole, in depth order |
| T4 | PASS | DATA · fired: trace-marks (no solids) · both arm ends' arcs, PL with the comet |
| T5 | PASS | DATA · both wheels' axis lines carried to the rear axle line, the turning centre where they meet, the arms' aim lines at neutral |
| T6 | PASS | HAND / DATA · outer wheel 28.8 deg at inner 40 (ideal 27.3); the turning centre on the plate at full lock |
| T7 | PASS | DATA · PLAN, where the planar linkage reads whole |
| T8 | N/A | DATA · the principle lies in plain view, no section needed |
| T9 | PASS | AUTO / DATA · claim table: 5 ok, 0 off, 0 uncheckable of 5 |
| T10 | PASS | AUTO · 7 solids drawn see-through: KR-slv, KR-bb, KR-ecl, KR-axle-s2, KR-axle-s4, KR-axle-s5, KR-bridge · the stack and support over a principle part drawn see-through |
| T11 | PASS | AUTO · 1 support routed, 1 moved off a sweep · the support routed off the principle's sweep |
| T12 | PASS | HAND · 15 support solids; dropped by the polish: none |
| T13 | N/A | DATA · nothing goes by in a blink |
| T14 | PASS | HAND / DATA · the steer |
| T15 | PASS | HAND · labels state the mechanism, never its use |
| T16 | N/A | HAND / STYLE · no two parts of one role to tell apart |
| T17 | PASS | AUTO · depth peeling, no depth bias (renderer test) |
| D1 | PASS | HAND · fired: wheels (26 solids) · a wheel on each knuckle on a stub axle in an upright tube (wheels rule), tapered links, plain base |
| D2 | PASS | HAND · material round every pin |
| D3 | PASS | STYLE · STYLE: roles by pattern and tone (both sheets) |
| D4 | PASS | AUTO · fired: base (3 solids), feet (4 solids) · base corners and feet concentric (base, feet rules) |
| D5 | PASS | AUTO / HAND · one bridge over KR, moved off the sweep, see-through over the right knuckle |
| D6 | PASS | HAND / STYLE · hardware quieter than the parts, still readable (both sheets) |
| D8 | PASS | AUTO / HAND · every solid a profile, an operation and a frame; built by Manifold; no layers, dz or twin |
| D9 | N/A | AUTO / HAND · no member changes shape |
| D10 | PASS | AUTO · profiles shipped for plain extrusions, meshes only for booleans (package v2) |
| D11 | PASS | AUTO · SOLID: 0 of 154 solids unsound |
| D7 | PASS | HAND · links plain; the richness in the stacks |
| A1 | PASS | AUTO · knuckle-left-wheel wheels, knuckle-right-wheel wheels, PL J3, PR J3, KL J2, KR J1, KL-knuckle-left-stops stops, KR-knuckle-right-stops stops, drive drive · every joint read from the record and built by its kit |
| A2 | PASS | AUTO · knuckle-left-wheel wheels, knuckle-right-wheel wheels, PL J3, PR J3, KL J2, KR J1, KL-knuckle-left-stops stops, KR-knuckle-right-stops stops, drive drive · ground pivots by their kits (live shaft J2, dead axle J1), moving pins J3 (Joints table) |
| A3 | PASS | AUTO · fired: classify (4 solids), axial stack builder · bores from the catalogue; bearings where a boss fits them |
| A4 | PASS | AUTO · fired: j1-dead-axle (27 solids), axial stack builder · stepped shafts with shoulders, grooves, flats and chamfered ends (H.shaft) |
| A5 | PASS | AUTO · fired: j2-live-shaft (28 solids), j10-shaft-in-plan (no solids), axial stack builder · keys by shaft size: D-flat to Ø8, feather key above |
| A6 | N/A | AUTO · fired: j5-slide (no solids), j13-compliant (no solids), standoffs (no solids) · no slide and no floating plate |
| A7 | PASS | AUTO · fired: base (3 solids), feet (4 solids) · base 8 mm under the lowest part, counterbored corner holes, feet, engraved scale and paths, shaft clearance holes |
| A8 | PASS | AUTO · fired: fasteners (6 solids) · stage 3 fasteners: shanks, clearance and tapped holes |
| A9 | PASS | AUTO / HAND · fired: placement solver · shortest overhang from the placement solver; a pivot passed over is held from above in double shear or on its shaft end |
| A10 | PASS | HAND · fired: placement (6 solids), placement solver · slabs from the placement solver (Joints table) |
| A11 | PASS | AUTO / HAND · fired: j12-flexible (no solids), strap-sheave (no solids), j1-dead-axle (27 solids) · load paths closed: every joint note says where its load goes to ground |
| A12 | PASS | AUTO · clamp check clean |
| A13 | PASS | AUTO / HAND · 154 solids, 79 unnamed (further items of a listed set) · named hardware with catalogue sizes and materials |
| A14 | PASS | AUTO / HAND · fired: support router · supports routed against the sweeps (least gap 1.5 mm); details checked by A15 |
| A15 | PASS | AUTO · clearance in 3D over 72 phases: 0 clashes; hand allow: 0 named, 0 unnecessary |
| A16 | PASS | HAND · 9 joint notes; no note: none; no badge: none · a note and badge per joint; build rules: the wheels stand clear of the knuckles, the base holds the rear axle line and the turning centres |
| A17 | PASS | HAND · assembles in the explode order; every screw reachable; pressed bearings pullable through their bores |
| A18 | PASS | AUTO · placement: 2 slabs in the tallest stack (16.0 mm), 0 clevises; stack per joint in the Joints table · axial positions set by the placement solver |
| A19 | PASS | AUTO · 1 support routed (1 moved), least gap 1.5 mm; still covering a principle part, drawn see-through: KR-bridge · routed, least gap 1.5 mm; see-through where it still covers a principle part |
| A20 | PASS | AUTO · support per joint: KR bridge · one axial stack builder with its support selector |
| A21 | PASS | AUTO · kit per joint: knuckle-left-wheel wheels, knuckle-right-wheel wheels, PL J3, PR J3, KL J2, KR J1, KL-knuckle-left-stops stops, KR-knuckle-right-stops stops, drive drive |
| A22 | PASS | AUTO · fired: stops (16 solids), adjustable-length (no solids), cable-clip (5 solids) · promoted fixes fired where they apply (stops and swing scale on swinging parts, cable clip on a drive lead) |
| E1 | PASS | AUTO · every solid has one explode level; levels -11.5 to 12.5 · one level per solid, nothing stretches |
| E2 | PASS | AUTO · fired: explode (1 solid) · heads, shanks, washers and nuts move as one |
| E3 | PASS | AUTO · fired: explode (1 solid) · screws back out along their axes |
| E4 | PASS | HAND · last fitted goes furthest (explode shots, both sheets) |
| E5 | PASS | AUTO · fired: explode (1 solid) · pressed bearings, bushings and clips stay with their parts |
| E6 | PASS | AUTO · fired: explode (1 solid) · bought units whole |
| E7 | PASS | AUTO · fired: explode (1 solid) · loose spacers midway |
| E8 | PASS | AUTO · fired: explode (1 solid) · keyed parts keep their order on their shaft |
| E9 | PASS | HAND · full explode readable in ISOMETRIC on both sheets, nothing leaves the frame |
| E10 | PASS | AUTO · fired: explode (1 solid) · each stack explodes along its joint axis, with trail lines |
| J1 | PASS | AUTO · fired: trunnion (no solids), j1-dead-axle (27 solids) · dead axle: shouldered axle, bearings in the part, spacers, circlip, thrust washer |
| J2 | PASS | AUTO · fired: j2-live-shaft (28 solids) · live shaft: housing with two bearings, keyed shaft, part held on the shaft end by a washer and a countersunk screw |
| J3 | PASS | AUTO · fired: j3-moving-pin (18 solids), cross-bearings (no solids), ring-hub (no solids) · moving pins: shoulder bolts threaded through the lower part, bearings, inner-race spacers, made up by a washer |
| J4 | N/A | AUTO · fired: j4-slot-roller (no solids), pin-lobe (no solids), fork-pin (no solids) · no pin in a slot |
| J5 | N/A | AUTO · fired: piston-bore (no solids), j5-slide (no solids), tongue-slot (no solids) · no slide |
| J6 | N/A | AUTO · fired: j6-mesh (no solids), ring-rollers (no solids) · no parallel mesh |
| J7 | N/A | AUTO · fired: groove-cam (no solids), j7-cam (no solids), pallet-contact (no solids), pawl-tooth (no solids) · no cam |
| J8 | N/A | AUTO · fired: j8-belt (no solids), j12-flexible (no solids) · no belt in the mechanism (a drive belt is V4) |
| J9 | N/A | AUTO · fired: j9-crossed-mesh (no solids) · no crossed mesh |
| J10 | N/A | AUTO · fired: j10-shaft-in-plan (no solids) · no shaft in plan |
| J12 | N/A | AUTO · fired: j12-flexible (no solids), strap-sheave (no solids) · no flexible member |
| J13 | N/A | AUTO · fired: j13-compliant (no solids) · no compliant joint |
| J11 | N/A | AUTO · fired: j11-screw (no solids) · no screw |
| F1 | PASS | AUTO · served at KL, KR; fired: j2-live-shaft (28 solids), j10-shaft-in-plan (no solids), strap-sheave (no solids), j13-compliant (no solids) · housings, blocks, bridges and rails dowelled (Joints table) |
| F2 | PASS | AUTO · served at knuckle-left-wheel, knuckle-right-wheel, PL, PR, KL, KR, drive; fired: wheels (26 solids), j2-live-shaft (28 solids), j10-shaft-in-plan (no solids), cross-bearings (no solids), trunnion (no solids), fork-pin (no solids), ring-hub (no solids), ring-rollers (no solids), j12-flexible (no solids), strap-sheave (no solids), j13-compliant (no solids) · every bearing retained both sides; every part on a shaft retained (Joints table) |
| F3 | PASS | AUTO · served at PL, PR, KL, drive; fired: j2-live-shaft (28 solids), j10-shaft-in-plan (no solids), j12-flexible (no solids), j11-screw (no solids) · every keyed part keyed or on a D-flat with its retainer |
| F4 | PASS | AUTO / HAND · served at KL, KR; fired: j9-crossed-mesh (no solids), j2-live-shaft (28 solids), j10-shaft-in-plan (no solids), trunnion (no solids) · thrust washers where a part turns free axially |
| F5 | PASS | AUTO / HAND · served at KL-knuckle-left-stops, KR-knuckle-right-stops; fired: j5-slide (no solids), pawl-tooth (no solids), j13-compliant (no solids), stops (16 solids) · stop pins past each end of a swinging part |
| F6 | N/A | AUTO / HAND · served at no joint; fired: trunnion (no solids), j7-cam (no solids), pallet-contact (no solids), pawl-tooth (no solids), j12-flexible (no solids) · no rest position to hold: the input positions every part |
| F7 | N/A | AUTO / HAND · served at no joint; fired: j6-mesh (no solids), j9-crossed-mesh (no solids), j5-slide (no solids), j12-flexible (no solids), adjustable-length (no solids) · no exact length or mesh to adjust |
| F8 | PASS | AUTO · served at no joint; fired: cross-bearings (no solids), tongue-slot (no solids), j12-flexible (no solids), j11-screw (no solids), lubrication (1 solid) · grease nipples, wipers and oil sinks where fitted; the other bearings sealed |
| F9 | PASS | AUTO / HAND · served at no joint; fired: j6-mesh (no solids), j9-crossed-mesh (no solids), timing-marks (1 solid) · zero line on the input and on the base (timing marks) |
| F10 | PASS | AUTO / HAND · served at drive; fired: j12-flexible (no solids), drive (32 solids) · home flag and fork sensor on the input (drive); no belt to flange |
| M1 | PASS | AUTO · fired: hardware primitives · top-face chamfers by part kind (primitives) |
| M2 | PASS | HAND · bosses round every loaded hole |
| M3 | PASS | AUTO · fired: j3-moving-pin (18 solids), hardware primitives · bore entry chamfers |
| M4 | PASS | AUTO / HAND · fired: base (3 solids), fasteners (6 solids) · counterbores and countersinks for heads (base, csk, housings) |
| M5 | PASS | AUTO / HAND · fired: hardware primitives · cutter radii on windows and slots |
| M6 | PASS | AUTO · edge distance and walls clean |
| M7 | N/A | HAND · no bracket corner turns a load |
| M8 | PASS | AUTO · fired: j1-dead-axle (27 solids) · thread undercuts on stepped shafts |
| M9 | PASS | AUTO / HAND · fired: j1-dead-axle (27 solids) · ISO coarse threads, engagement through the tapped part or to a nut |
| M10 | PASS | AUTO / HAND · 151 of 154 solids name a material · materials named by kind and role |
| M11 | PASS | AUTO · fired: j1-dead-axle (27 solids), hardware primitives · centre holes, chamfered ends on turned parts |
| M12 | PASS | HAND · every screw reachable by its key in the explode |
| M13 | PASS | AUTO / HAND · 18 threaded · threadlocker or nyloc on every threaded fastener |
| M14 | N/A | AUTO / HAND · fired: piston-bore (no solids), j4-slot-roller (no solids), pin-lobe (no solids), groove-cam (no solids), pallet-contact (no solids), tongue-slot (no solids) · no sliding contact needing a liner |
| V1 | PASS | AUTO · fired: drive (32 solids) · brushless pancake motor Ø50 x 18 under the base; the oscillating input is motorised through a crank and link (V5) |
| V2 | PASS | AUTO · fired: drive (32 solids) · one flange for the motor, screwed up into the base from inside; nothing of the drive shows on top of the base |
| V3 | PASS | AUTO / HAND · fired: drive (32 solids) · motor, flange, crank, link and lever laid out clear of the feet, the housings and the base hardware (A15: 0 clashes over 72 phases) |
| V4 | PASS | AUTO · fired: j8-belt (no solids) · no belt in an oscillating drive; drive detail: crank clamped on the motor shaft's flat, bushings in the link, circlips on both pins, lever keyed or set-screwed on the input shaft |
| V5 | PASS | AUTO · fired: drive (32 solids) · oscillating: the motor turns a 12.6 mm crank, a 44 mm link swings a lever keyed on the input shaft's low end through exactly the modelled 70° (dead centres at the ends of the swing); the crank belongs to the drive |
| V6 | PASS | AUTO · fired: drive (32 solids), cable-clip (5 solids) · home flag on the input lever's hub, fork sensor on a post, motor and sensor leads to a terminal block, cable clips |
| L1 | PASS | STYLE · STYLE: no look values in the record or polish |
| L2 | PASS | HAND · records and polish carry no look |
| L3 | PASS | HAND · roles right on every solid (both sheets) |
| L4 | PASS | HAND / STYLE · one accent: the input ring, the traces |
| L5 | PASS | AUTO / HAND · fired: see-through (7 solids) · transparency and hidden lines show screws in holes and bearings in bores |
| L6 | PASS | AUTO · depth peeling at every view (shots) |
| L7 | PASS | STYLE · STYLE: turntable orbit, named views, no perspective |
| L8 | PASS | AUTO / HAND · fired: trace-marks (no solids) · centrelines along every joint axis, base dimensions, engraved marks |
| L9 | N/A | AUTO / DATA · no section or detail view declared |
| L10 | PASS | AUTO / STYLE · teaching overlays in the sheet's look |
| R1 | PASS | HAND · every standard part from the primitives and kits |
| R2 | PASS | HAND · standard sizes only |
| R3 | PASS | AUTO · fired: hardware primitives · shared subassemblies, one function each |
| R4 | PASS | AUTO · package v2 25.5 KB · package v2 written at build time |
| R5 | PASS | HAND · the polish states only exceptions, no sampling |
| R6 | PASS | FLAG · FLAG: bench run (desktop, below); the phone is measured by David |
| R7 | PASS | HAND / FLAG · polish none; 0 solids added, 0 overrides by the polish |
| R8 | PASS | AUTO / SITE · SITE: thumbnails pre-rendered, cards animate on hover |
| R9 | PASS | AUTO / SITE · setup and bake in the worker, one context |
| R10 | PASS | FLAG · FLAG: the bench page is built for the phone measurement |
| DL1 | PASS | AUTO / HAND · 68 of 154 solids on a dropping rung · every solid, mark and effect on a rung by its kind |
| DL2 | PASS | HAND · default dial: full |
| DL3 | PASS | AUTO · view-aware exceptions in the ladder table |
| DL4 | PASS | SITE · SITE: adaptive dial with hysteresis |
| DL6 | PASS | AUTO · teaching layers drawn at every dial position |
| DL5 | PASS | FLAG · FLAG: bench reports frame time per dial position |
| Q1 | PASS | check, clamp and edge distance clean |
| Q2 | PASS | 0 clashes, 0 unnecessary allows |
| Q3 | PASS | package v2 written, 25.5 KB; site build not checked here · package v2 written; site builds (npm run build) |
| Q4 | PASS | local: tools/shot · dist/shots3/<id>: record view, PLAN, FRONT, SIDE, ISOMETRIC, full explode, both sheets |
| Q5 | PASS | local: tools/bench · tools/bench run: dist/bench/report-v2.md |
| Q6 | PASS | every row judged |
| Q7 | PASS | at 3.0 |
| Q8 | PASS | teaching review: rethink (2026-10-20); the six phases of the finished build are looked at by eye · verdict and decisions in the record and the teaching: line; six phases of the finished build looked at |

## Joints
| Joint | Kit | Block | Support | Stack | F1 locate | F2 retain | F3 torque | F4 thrust | F5 limit | F6 hold | F7 adjust | F8 lube | F9 timing | F10 protect |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| knuckle-left-wheel | wheels | – | – | – | none | Nyloc nut M8 (DIN 985) | none | none | none | none | none | none | none | none |
| knuckle-right-wheel | wheels | – | – | – | none | Nyloc nut M8 (DIN 985) | none | none | none | none | none | none | none | none |
| PL | J3 | dyad | – | – | none | Shoulder bolt Ø8 x 12, M6 (ISO 7379) | Shoulder bolt Ø8 x 12, M6 (ISO 7379) | none | none | none | none | none | none | none |
| PR | J3 | – | – | – | none | Shoulder bolt Ø8 x 12, M6 (ISO 7379) | Shoulder bolt Ø8 x 12, M6 (ISO 7379) | none | none | none | none | none | none | none |
| KL | J2 | driver | – | – | 2 x Dowel pin Ø3 x 10 h6, housing to base | 2 x Internal circlip DIN 472, Ø21; External circlip DIN 471, Ø12 | Feather key 4 x 4 x 5 (DIN 6885); Clamp hub Ø12x22, two set screws at 90°; Set screw M4 (DIN 916), threadlocked | Thrust washer 12.2x20, bronze; Wave washer 16.5x20.8, spring steel | none | none | none | none | none | none |
| KR | J1 | dyad | bridge (moved) | – | Bridge over the pivot, on two spigoted posts; Dead axle Ø12, shouldered, M10 end | External circlip DIN 471, Ø12 | none | Thrust washer 12.2x20, bronze | none | none | none | none | none | none |
| KL-knuckle-left-stops | stops | – | – | – | none | none | none | none | 2 x Stop pin Ø6, hardened, on the lever's edge | none | none | none | none | none |
| KR-knuckle-right-stops | stops | – | – | – | none | none | none | none | 2 x Stop pin Ø6, hardened, on the lever's edge | none | none | none | none | none |
| drive | drive | – | – | – | none | External circlip DIN 471, Ø12; 2 x External circlip DIN 471, Ø4 | Feather key 4 x 4 x 9 (DIN 6885) | none | none | none | none | none | none | Home flag, 1 mm steel vane; Fork sensor, slotted optical, 5 mm gap |

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
| DL-A | 19 | 0 | 1.44 |
| DL-B | 0 | 184 | 1.53 |
| DL-C | 0 | 0 | 1.41 |
| DL-D | 16 | 0 | 1.43 |
| DL-E | 12 | 1 | 1.32 |
| DL-F | 0 | 0 | 1.36 |
| DL-G | 0 | 0 | 1.37 |
| DL-H | 21 | 0 | 1.37 |
| never | 86 | 235 | 1.37 |

## Promotion candidates
None: this pass needed no hand fix.

## Verification
check: clean · K1 residual: 6.4e-14 · claims: 5 of 5 ok · clearance: 0 clashes · clamp: clean · edge distance: clean · package: 25.8 KB
screenshots: dist/shots3/ackermann-steering (record view, PLAN, FRONT, SIDE, ISOMETRIC, explode; both sheets) · bench: dist/bench/report-v2.md (desktop; frame times paced at 28 deg in the ladder above; phone by David)
