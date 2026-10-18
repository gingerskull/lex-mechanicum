# Audit: Pantograph (pantograph)
standard: 2.3 · date: 2026-10-18 · result: open · detail: full · pass: audit+fix

## Summary
PASS 101 · FAIL 1 · N/A 19 · open: FAIL F7

## Requirements
| Id | Status | Evidence / action |
|---|---|---|
| S1 | PASS | DATA · the standard carries version 2.3 and its changelog |
| S2 | PASS | HAND · header with standard, date, result, detail, pass |
| S3 | PASS | AUTO · tools/conformance reads this header and runs in npm run check |
| S4 | PASS | SITE · #32 holds only this mechanism's decisions and open items |
| P1 | PASS | DATA · record complete; model.ts, polish.ts, audit.md present |
| P2 | PASS | DATA · catalogue validator clean |
| P3 | PASS | DATA / SITE · ratio (scaling, 2:1), axes, output character, backdrivable, other names, family, motion, level, dof and the drive (hand operated) |
| P4 | PASS | DATA · tags grouped Function, Property, Application, keywords underneath |
| P5 | PASS | DATA · motion, forces, benefits, limits; four uses with one line each |
| P6 | PASS | DATA · Wikipedia and the Galileo Project page on Scheiner; two videos, a photo page, an animation; both real-world videos (Gorton engraver) checked: found, on topic, embeddable (YouTube oEmbed), kept |
| P7 | PASS | HAND / SITE · no prose in model.ts or polish.ts; lint-style clean |
| P8 | PASS | SITE · no parts list, build or joint sections on the page |
| P9 | PASS | HAND · solve(): E = 2T exactly, plot constant 2; the elbow stays under 150° (max about 140°) as the text says |
| P10 | PASS | HAND · paths for the pen (comet) and the stylus, velocity on both, arm and bar forces, elbow angle, scale plot (constant 2) |
| P11 | PASS | DATA · plain, short sentences, no em dashes, mm and degrees |
| K1 | PASS | HAND · centres exact (link error 4e-14 mm); plating and hardware never move a pin |
| K2 | PASS | HAND · check: finite, continuous, periodic over 720 samples |
| K3 | PASS | HAND · four tapered links, two custom plates (one the short front plate), caps and the pen tracer |
| K4 | PASS | HAND · roles driver, link, output, pin, trace; accent only on the input cap pO |
| K5 | PASS | HAND · layers 0 to 2 at 10 mm; check clean, no INTERFERE, OVERLAP or WARN; ground pivot at -1, moving pins at 5.5 |
| K6 | PASS | DATA · arms 110, bars 55, k 2, flower centre (72, 14), r 25 + 5 cos 5u; elbow branch +1; as the catalogue |
| K7 | PASS | HAND · input manual on armO. The catalogue input is the stylus path; the model drives the stylus round it and the hand knob sits on the arm O-A, which is the part with the ground pivot the stops and the drive rule read (decision for David, see open items) |
| D1 | PASS | HAND · tapered links sized to their bearings, boss rings, flush caps, ground pivot larger; same forms as the four-bar |
| D2 | PASS | HAND · material in the web between bosses, bosses round every pin |
| D3 | PASS | STYLE · roles told apart by pattern and tone in both sheets |
| D4 | PASS | AUTO · feet concentric with the corner arcs |
| D5 | N/A | AUTO / HAND · one ground pivot with a housing behind the base; nothing needs a bridge or post pair |
| D6 | PASS | HAND / STYLE · knob, stops and scale read quieter than the linkage |
| D7 | PASS | HAND · arms and bars carry only load shape and manufacturing marks |
| A1 | PASS | AUTO · pO J2, pA, pM1, pM2, pT J3 |
| A2 | PASS | AUTO · pO live shaft (accent input, keyed arm); the four moving pins shoulder bolts |
| A3 | PASS | AUTO · 6800 on the Ø10 input, F688ZZ in all four moving joints |
| A4 | PASS | AUTO · stepped keyed shaft with circlip grooves; shoulder bolts with undercut |
| A5 | PASS | AUTO · feather key 3 x 3 on the Ø10 input |
| A6 | N/A | AUTO · no floating fixed plate |
| A7 | PASS | AUTO · 8 mm base, counterbored corners, feet, front scale, clearance hole for the input shaft, both paths engraved |
| A8 | PASS | AUTO · every head has its shank; holes cut by stage 3 |
| A9 | PASS | HAND · every moving joint is a clevis: the arm O-A and the bar T-M2 are middle plates, the arm A-E and the bar M1-T pairs round them (twins in the model, 1.5 mm clear); the input is carried from behind. The pen end is a single plate, carrying a pen, not a pin |
| A10 | PASS | HAND · three layers only: the two middle plates share layer 1, the two pairs layers 0 and 2; nothing is stacked only to clear something |
| A11 | PASS | HAND · knob and pull to the keyed arm, the shaft, the housing (screwed and dowelled) and the base; every moving pin carries its load in double shear through bearings to the bolt threaded into the rear plate |
| A12 | PASS | AUTO · clamp check clean |
| A13 | PASS | AUTO / HAND · named catalogue sizes; the 45 unnamed solids are further items of a listed set |
| A14 | PASS | HAND · stop posts found outside every sweep of the whole linkage (clearance 1 mm or more); the knob clear of the bars over the whole range |
| A15 | PASS | AUTO · clearance: 0 clashes over the cycle |
| A16 | PASS | HAND · a note and a badge on every joint, five build rules |
| A17 | PASS | HAND · housing and shaft from below; arm, rear plates, middle plates, front plates, bolts from the top, knob last; every head reachable |
| E1 | PASS | AUTO · one level per solid |
| E2 | PASS | AUTO · 18 rigid groups: bolts, stop screws, shaft stack |
| E3 | PASS | AUTO · bolts and stop screws up, housing screws down |
| E4 | PASS | HAND · front plates and bolts go first, then middle plates, then rear plates; checked in explode at 28° and 70° |
| E5 | PASS | AUTO · bearings and circlips stay in their plates |
| E6 | N/A | AUTO · no bought unit besides the bearings (hand operated, no motor) |
| E7 | PASS | AUTO · spacers midway |
| E8 | PASS | AUTO · arm and key keep their order on the input shaft |
| E9 | PASS | HAND · readable at full explode at 28° and 70°; nothing leaves the frame |
| J1 | N/A | no dead axle |
| J2 | PASS | AUTO · input: housing with two sealed bearings, sleeve, wave washer, circlips, screwed and dowelled; keyed shaft, end retainer, thrust washer |
| J3 | PASS | AUTO · A, M1, M2, T: shoulder bolts threaded into the rear plates, bearings in the middle plates, inner-race spacers, threadlocked; clevis everywhere (model) |
| J4 | N/A | no pin in a slot |
| J5 | N/A | no slide |
| J6 | N/A | no gear mesh |
| J7 | N/A | no cam |
| J8 | N/A | no belt (hand operated) |
| F1 | PASS | AUTO · housing dowelled to the base; no removable bearing plate on a moving pin |
| F2 | PASS | AUTO · bearings held by a circlip and their flange; bolt heads; shaft end retainer |
| F3 | PASS | AUTO · feather key at the input |
| F4 | PASS | AUTO · bronze thrust washer on the base under the arm, wave washer preloading the input |
| F5 | PASS | AUTO / HAND · rubber-faced stops either side of the arm's swing (28° to 92°): the upper from the rule, the lower placed by hand because the rule's spot is inside the working zone |
| F6 | N/A | hand held; a position is held by the hand, and friction in the sealed bearings keeps it |
| F7 | FAIL | HAND · the scale depends on M1 and M2 being at the exact midpoints, but they are free pins on the arms and the exact dimension is not at a ground pivot, so H.eccentricMount does not apply. No adjuster is built (a slotted pivot or an adjustable bar end would need a model change); the pins are drilled to centre. Open item |
| F8 | PASS | AUTO · shielded bearings greased for life, sealed bearings in the input |
| F9 | PASS | HAND · the arm's swing engraved on the base as a scale, with an index line on the arm tip |
| F10 | N/A | hand operated: no pulley, flag or sensor; the stops protect the linkage's end of travel |
| M1 | PASS | AUTO · edge breaks on every top face |
| M2 | N/A | HAND · slow hand-driven parts of small mass; no window or hub needed |
| M3 | PASS | AUTO · bore entry chamfers on every seat and through hole |
| M4 | PASS | AUTO / HAND · counterbored housing screws and base corners |
| M5 | N/A | AUTO / HAND · no milled pockets or windows |
| M6 | PASS | AUTO · edge distance and walls clean |
| M7 | PASS | HAND · every plate is a hull of circles; no inside corner |
| M8 | PASS | AUTO · undercuts on every shoulder bolt thread |
| M9 | PASS | AUTO / HAND · bolts into the steel rear plates over full thickness; standard lengths |
| M10 | PASS | AUTO / HAND · every solid names its material |
| M11 | PASS | AUTO · centre holes and chamfered ends on the shaft |
| M12 | PASS | HAND · every head reachable; bearings pressed out past their circlips |
| M13 | PASS | AUTO / HAND · threadlocker on every screw, including the added stop screw |
| M14 | N/A | no sliding contact |
| V1 | N/A | hand operated (manual input): no motor |
| V2 | N/A | hand operated: no bracket |
| V3 | N/A | hand operated: no belt |
| V4 | N/A | hand operated: no pulleys |
| V5 | PASS | AUTO · manual: a knob Ø12 on the input arm and stops at both ends of its swing; the page says hand operated (the knob was moved by hand onto the arm's axis: the rule put it off the narrow link) |
| V6 | N/A | hand operated: no sensor or cable |
| L1 | PASS | STYLE · lint-style clean |
| L2 | PASS | HAND · the polish carries geometry, roles, marks and materials only |
| L3 | PASS | HAND · arm O-A driver, other plates output, bars link, hardware hw |
| L4 | PASS | HAND / STYLE · accent on the input only |
| L5 | PASS | AUTO / HAND · screws, bearings and the pen are real solids in real holes |
| L6 | PASS | AUTO · depth order right at plan, 28°, side and explode |
| L7 | PASS | STYLE · tilt 0° to 88°, no shear |
| L8 | PASS | AUTO / HAND · engraved paths and the swing scale are marks |
| R1 | PASS | HAND · the polish reuses H.bumper, H.screw, locking and materials; the custom front plate uses the part family; no inline standard part |
| R2 | PASS | HAND · threads M3, M4, M5, M6; joints Ø8, Ø10; two bearing sizes |
| R3 | PASS | AUTO · housing and drive from their subassemblies |
| R4 | PASS | AUTO · package built at build time |
| R5 | PASS | HAND · states only what differs; one stop search (about 30 clearance probes), polish under 40 ms |
| R6 | PASS | FLAG · Node CPU bench, DPR 1.5: plan 234, 28° 280, side 184, explode 211 ms at full detail; no dial position reaches 8 ms on this CPU bench (20 ms at dial H, 75 at C). Slower than the browser figures of other audits; flag, to look at in #14 |
| R7 | PASS | HAND · model.ts + polish.ts 9.6 KB |
| R8 | PASS | AUTO / SITE · pre-rendered thumbnails; the stage draws on change only |
| DL1 | PASS | AUTO / HAND · every solid and mark on a rung; the polish moves nothing |
| DL2 | PASS | HAND · default dial full |
| DL3 | PASS | AUTO · DL-D drawn when exploded, DL-B skipped at side elevation |
| DL4 | PASS | SITE · adaptive dial and the detail entry in the title block |
| DL5 | PASS | FLAG · rung counts and frame times in the detail ladder below |
| Q1 | PASS | check, clamp and edge distance clean |
| Q2 | PASS | 0 clashes |
| Q3 | PASS | package written, 17.0 KB; site build and site tests pass |
| Q4 | PASS | plan, 28°, side, explode at 28° and 70°, both sheets, looked at one by one |
| Q5 | PASS | Node CPU bench at DPR 1.5; flags under R6 |
| Q6 | PASS | every row judged; F7 listed as open |
| Q7 | PASS | conformance: pantograph at 2.3, pass |

## Joints
| Joint | Type | F1 locate | F2 retain | F3 torque | F4 thrust | F5 limit | F6 hold | F7 adjust | F8 lube | F9 timing | F10 protect |
|---|---|---|---|---|---|---|---|---|---|---|---|
| pO | J2 | 2 x Dowel pin Ø3 x 10 h6, housing to base | 2 x Internal circlip DIN 472, Ø19; Countersunk M5 x 12 (ISO 10642), into the shaft end, flush; Socket head M5 x 10 (ISO 4762), into the shaft end | Feather key 3 x 3 x 6 (DIN 6885) | Wave washer 14.5x18.8, spring steel; Thrust washer 10.2x16, bronze | – stops on the arm (drive) | – held by the hand | – no adjustable length | – sealed bearings | Index line on the arm tip, swing scale on the base | – hand operated, nothing to protect |
| pA | J3 | – no removable plate on a moving pin | Internal circlip DIN 472, Ø16; Bearing F688ZZ (8x16x5); head | – the front plate is clamped on the shoulder; no keyed part | F688ZZ located by flange and circlip, inner race clamped | – limited by the linkage and the stops | – held by the hand | – none: pin centre drilled exact (F7 open) | – shielded bearing, greased for life | – no phase to keep | – none needed |
| pM1 | J3 | – no removable plate on a moving pin | Internal circlip DIN 472, Ø16; Bearing F688ZZ (8x16x5); head | – the front plate is clamped on the shoulder; no keyed part | F688ZZ located by flange and circlip, inner race clamped | – limited by the linkage | – held by the hand | – none: the midpoint is drilled exact (F7 open) | – shielded bearing, greased for life | – no phase to keep | – none needed |
| pM2 | J3 | – no removable plate on a moving pin | Internal circlip DIN 472, Ø16; Bearing F688ZZ (8x16x5); head | – the front plate is clamped on the shoulder; no keyed part | F688ZZ located by flange and circlip, inner race clamped | – limited by the linkage | – held by the hand | – none: the midpoint is drilled exact (F7 open) | – shielded bearing, greased for life | – no phase to keep | – none needed |
| pT | J3 | – no removable plate on a moving pin | Internal circlip DIN 472, Ø16; Bearing F688ZZ (8x16x5); head | – the front plate is clamped on the shoulder; no keyed part | F688ZZ located by flange and circlip, inner race clamped | – limited by the linkage | – held by the hand | – no adjustable length | – shielded bearing, greased for life | – no phase to keep | – none needed |
| drive | drive | – knob on a shoulder screw in the arm | – shoulder screw M4 | – hand torque on the knob | – the arm rides on its thrust washer | Stop bumper, neoprene sleeve Ø12 | – held by the hand | – none | – no sliding contact | – the swing scale | – hand operated: no flag, sensor or cable |

## Variants and overrides
| Joint or part | Rule result | Chosen | Why |
|---|---|---|---|
| drive knob | Ø12 knob on the arm at 85% of its reach, off the link's axis (local y 101) | moved onto the axis at x 30, between the input boss and the M1 boss | the rule's offsets assume a broad part; on a 19 mm link the knob hung beside the arm. Promotion candidate |
| drive stops | upper stop placed, lower one dropped (no clear spot at the rule's fixed radius 84) | lower stop added by hand at r 31 from the pivot, outside every sweep | F5; the working zone fills the base round the rule's radius |
| elbow arm A-E | clevis pair over the full length | front plate 90 mm, 20 mm short of the pen | the pen is a tracer on the rear plate; the check treats a tracer inside a twin as a pin out of range |
| pen | n/a | tracer on the rear plate at layer 0 | as above |
| arms and bars | middle plates single, pairs round them | in the model (twin, dz) | A9: double shear at every moving joint |

## Detail ladder
| Rung | Solids | Marks | Frame ms at this dial position |
|---|---|---|---|
| DL-A | 12 | 0 | 170.6 |
| DL-B | 0 | 210 | 197.8 |
| DL-C | 0 | 0 | 75.4 |
| DL-D | 28 | 0 | 32.7 |
| DL-E | 0 | 0 | 23.3 |
| DL-F | 0 | 0 | 21.0 |
| DL-G | 0 | 0 | 23.0 |
| DL-H | 4 | 0 | 20.2 |
| never | 56 | 171 | 271.0 (full) |

## Promotion candidates
Hand fixes that should become rules or primitives.

- Manual drive (`drive.ts`, `manual()`): the knob candidates are offset from the link's axis by `reach * f` at four
  angles, so a narrow link gets a knob beside it; try the part's own axis first, between its bosses. Seen here
  (pantograph arm O-A).
- `stops()` uses one fixed radius per stop (`max(20, 0.7 * reach)`) and gives up when the working zone covers it. Let it
  search over radius as well, as this polish does; the lower stop here came from a radius search.
- A tracer that falls inside a clevis twin (a pen at the end of a clevis plate) is flagged WARN by `checkModel` unless the
  twin is cut short. Either the check should skip twins of the tracer's host, or the tracer should take a `span`.
- F7 for free mid-link pins (parallelogram, pantograph, scissor): a slotted-pivot or adjustable-bar-end primitive that
  keeps the drawn centres exact.

## Verification
check: clean · clearance: 0 clashes · clamp: clean · edge distance: clean · package: 17.0 KB
screenshots: plan, 28°, side, explode at 28° and 70°, both sheets (scratch PNGs, looked at; attach to #32) · bench: Node CPU at DPR 1.5, 2026-10-18; 28° frame 280 ms at full detail, 8 ms not reached at any dial position (flag, R6)
open: F7 (adjuster at the exact midpoints, see the row)
