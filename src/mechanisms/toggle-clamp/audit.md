# Audit: Toggle clamp (toggle-clamp)
standard: 2.3 · date: 2026-10-18 · result: pass · detail: full · pass: build

## Summary
PASS 108 · FAIL 0 · N/A 13 · open: none

## Requirements
| Id | Status | Evidence / action |
|---|---|---|
| S1 | PASS | DATA · the standard carries version 2.3 and its changelog |
| S2 | PASS | HAND · header with standard, date, result, detail, pass |
| S3 | PASS | AUTO · tools/conformance reads this header and runs in npm run check |
| S4 | PASS | SITE · #39 holds only this mechanism's decisions and open items |
| P1 | PASS | DATA · record complete; model.ts, polish.ts, audit.md present |
| P2 | PASS | DATA · catalogue validator clean |
| P3 | PASS | DATA / SITE · ratio (force amplification), axes, output character, backdrivable (no, self-locking), other names, family, motion, level, dof and hand operation shown |
| P4 | PASS | DATA · tags grouped Function, Property, Application, keywords underneath |
| P5 | PASS | DATA · motion, forces, benefits, limits; four uses with one line each |
| P6 | PASS | DATA · Wikipedia pages, two videos and a photo page; the two real-world YouTube videos checked live (oEmbed): both are DESTACO manual toggle clamps in fixtures, kept |
| P7 | PASS | HAND / SITE · no prose in model.ts or polish.ts; lint-style clean |
| P8 | PASS | SITE · no parts list, build or joint sections on the page |
| P9 | PASS | HAND · explain matches solve(): handle -70° to +3°, 73° swing, plunger 72.7 to 110 mm (37 mm), toggle at 0°, stop at +3° |
| P10 | PASS | HAND · grip path traced, velocity at the grip and the plunger, link force line, input spin, link obliquity and handle angle, plunger position plot |
| P11 | PASS | DATA · plain, short sentences, no em dashes, mm and degrees |
| K1 | PASS | HAND · check: max link error 2.8e-14 mm · the polish changes heights, hardware and the notch's fillets only; centres are the solver's |
| K2 | PASS | HAND · check: finite, continuous, periodic over 720 samples |
| K3 | PASS | HAND · plate (handle), link (front handle plate, toggle link), custom (plunger), plate (cap), rails, caps; between, at and fixed placement |
| K4 | PASS | HAND · roles driver, link, output, ground, pin; accent only on the input cap pO |
| K5 | PASS | HAND · check: no INTERFERE, OVERLAP or WARN · handle and plunger layer 0, link 1, front plate and cap 2; handle plated up 2.5 mm and front plate and cap down 2.5 mm with dz in model.ts |
| K6 | PASS | DATA · a 40, b 70, H 95, g 165°, open -70°, over +3°, B 72.7 to 110 mm, pad face 63 mm from B (173.2 at toggle): as the catalogue; the pad face is the spindle head, the notch is the site's addition (plunger body -15 to 55 as catalogue) |
| K7 | PASS | HAND · input manual on handle · the handle is the input; its swing is the whole range, so the drive is hand operated (V5 manual) |
| D1 | PASS | HAND · handle plates with bosses on every pin, tapered link bosses R8.5, plunger as a slider with square ends on two stadium rails |
| D2 | PASS | HAND · bosses round every pin, a notch only where the spindle sits; no lightening windows |
| D3 | PASS | STYLE · roles told apart by pattern and tone in both sheets |
| D4 | PASS | AUTO · fired: base (1 solid), feet (4 solids) · feet concentric with the corner arcs |
| D5 | PASS | AUTO / HAND · rails on ground pads on the base; the plunger cap on a single post; the handle shaft in a housing cartridge |
| D6 | PASS | HAND / STYLE · spindle, nut, stops and slide hardware read quieter than handle, link and plunger |
| D7 | PASS | HAND · handle, link, plunger, rails and base carry only load shape; the richness is spindle, nut, stops, grip and bearings |
| A1 | PASS | AUTO · pO J2, pA J3, pB J3, slide-plunger J5; fired: classify (no solids) · the notch hosts the spindle |
| A2 | PASS | AUTO · live input shaft at O (the handle is keyed to it), shoulder bolts at A and B, slide on the rails |
| A3 | PASS | AUTO · 6800-2RS on the Ø10 input, F686ZZ on the Ø6 knee and plunger pins; spacers in every gap |
| A4 | PASS | AUTO · stepped shoulder bolts with undercut threads; keyed input shaft with end retainer |
| A5 | PASS | AUTO · feather keys 3 x 3 on the Ø10 input shaft, one per handle plate |
| A6 | PASS | AUTO · both rails on ground steel pads, screwed down and dowelled |
| A7 | PASS | AUTO · fired: base (1 solid), feet (4 solids) · base covers the handle's sweep and stops; grip path engraved; clearance hole for the input shaft |
| A8 | PASS | AUTO · every head has its shank; holes cut by stage 3 |
| A9 | PASS | HAND · A: handle clevis (rear and front plates 1.5 mm either side of the link), double shear; B: plunger clevis (cap on a post at x 14 where the link never swings), double shear; O: both plates on one keyed shaft in a cartridge |
| A10 | PASS | HAND · plunger and rails at the base, link 1.5 mm over, cap and front plate 1.5 mm over the link; nothing stacked only to clear |
| A11 | PASS | HAND · knee pin to rear plate to key to shaft to housing (screwed, dowelled) to base; plunger pin to plunger to rails, keeper and gib; stops screwed into the base; spindle to the plunger's back wall |
| A12 | PASS | AUTO · clamp check clean |
| A13 | PASS | AUTO / HAND · 125 solids, 67 unnamed (further items of a listed set) · every solid named with catalogue sizes, sets counted |
| A14 | PASS | HAND · stops placed clear of the handle's swept area by the generator, rear slide stop and spindle clear of every sweep; clearance 0 |
| A15 | PASS | AUTO · clearance: 0 clashes over the cycle |
| A16 | PASS | HAND · a note and a badge on pO, pA, pB and the slide, five build rules |
| A17 | PASS | HAND · housing and shaft, handle rear plate with key, rails, gib, plunger with spindle and nut, link, front plate and cap last; grip last |
| E1 | PASS | AUTO · every solid has one explode level; levels -5 to 3.5 · the spindle and nut are rigid bodies |
| E2 | PASS | AUTO · 30 rigid groups; fired: explode · the grip screw and grip lift together |
| E3 | PASS | AUTO · pins and grip screw upward, housing screws downward |
| E4 | PASS | HAND · front plate, cap and grip above the link, link above the plates: last fitted goes furthest |
| E5 | PASS | AUTO · fired: explode · bearings and circlips stay in their parts |
| E6 | PASS | AUTO · bearings whole; no motor |
| E7 | PASS | AUTO · fired: explode · spacers midway |
| E8 | PASS | AUTO · the two handle plates and their keys keep their order on the input shaft |
| E9 | PASS | HAND · readable at 100% explode at 28° and 70°; nothing leaves the frame |
| J1 | N/A | no dead axle |
| J2 | PASS | AUTO · input: housing with two bearings, sleeve, wave washer, circlips, screwed and dowelled; keyed shaft, end retainer, thrust washer; no pulley (hand operated) |
| J3 | PASS | AUTO · A and B: shoulder bolts, bearings in the link, inner-race spacers, threadlocked; clevis at both (variant) |
| J4 | N/A | no pin in a slot |
| J5 | PASS | AUTO / HAND · rails, keeper, bronze gib with adjusting screws and lock nuts, wipers, grease nipple, rear end stop; no forward stop: the spindle tip passes there (see F5) |
| J6 | N/A | no gear mesh |
| J7 | N/A | no cam |
| J8 | N/A | no belt: hand operated |
| F1 | PASS | AUTO · served at pO, raila-seat, railb-seat; fired: j2-live-shaft (30 solids) · housing and rails dowelled; no removable bearing plate on a moving pin |
| F2 | PASS | AUTO · served at pO, pA, pB, slide-plunger; fired: j2-live-shaft (30 solids) · the spindle is retained by its thread and lock nut |
| F3 | PASS | AUTO · feather keys at the input |
| F4 | PASS | AUTO · bronze thrust washer, wave washer preload at the input |
| F5 | PASS | HAND · the over-centre stop (neoprene bumper on a screw into the base) is on the handle's grip arm and takes it at +3°, an open stop at -70°; the rear slide stop remains; the forward slide stop is dropped because the spindle tip passes where it would stand: the link, the handle stops and the work face end the plunger's travel |
| F6 | N/A | the closed position is held by the over-centre lock against its stop; the open position rests on its stop |
| F7 | PASS | HAND · clamp spindle M5 in the plunger's notch with a thin lock nut and a hardened pad head, setting the clamp height; gib strip with adjusting screws on the slide |
| F8 | PASS | AUTO · wipers, grease nipple on the keeper; sealed and shielded bearings |
| F9 | N/A | one input, nothing in phase; both ends are positive stops |
| F10 | N/A | hand operated: no motor, belt or sensor to protect; the stops take the hand's push |
| M1 | PASS | AUTO · edge breaks on every top face |
| M2 | PASS | HAND · bosses round every pin; the hand-driven handle has no inertia to lighten, so no windows |
| M3 | PASS | AUTO · bore entry chamfers on every seat and through hole |
| M4 | PASS | AUTO / HAND · counterbored base corners and housing screws, countersinks for rail and keeper screws |
| M5 | PASS | AUTO / HAND · the notch's inside corners carry a 1.5 mm cutter radius; no windows |
| M6 | PASS | AUTO · edge distance and walls clean |
| M7 | PASS | HAND · the notch corners are filleted; the plates are hulls of circles |
| M8 | PASS | AUTO · undercuts on the shoulder bolt threads |
| M9 | PASS | AUTO / HAND · bolts into the steel handle and plunger over full thickness; the spindle threaded into the notch wall (blind tapped hole along the axis, not drawn); standard lengths |
| M10 | PASS | AUTO / HAND · 125 of 125 solids name a material · phenolic grip, hardened pad face, bronze gib, hardened rails |
| M11 | PASS | AUTO · centre holes and chamfered ends on the shaft |
| M12 | PASS | HAND · every head reachable; bearings pressed out past their circlips; the nut and spindle open to a spanner in the notch |
| M13 | PASS | AUTO / HAND · 54 threaded, 0 without a locking method · jam nut on the spindle |
| M14 | PASS | AUTO · hardened screwed rails against the plunger, bronze gib: the replaceable wear parts |
| V1 | N/A | hand operated (manual input): no motor |
| V2 | N/A | hand operated: no bracket |
| V3 | N/A | hand operated: no belt |
| V4 | N/A | hand operated: no drive detail |
| V5 | PASS | AUTO / HAND · manual: no motor; the grip on the input and stops at both ends of the range (the generated knob and stops sat off the handle, so the polish places them on the grip arm); the page says hand operated |
| V6 | N/A | hand operated: no motor, no sensor |
| L1 | PASS | STYLE · lint-style clean |
| L2 | PASS | HAND · the polish carries geometry, roles, marks and materials only |
| L3 | PASS | HAND · handle driver, link link, plunger and cap output, rails ground, hardware hw |
| L4 | PASS | HAND / STYLE · accent on the input only |
| L5 | PASS | AUTO / HAND · screws, bearings, spindle and nut are real solids; the stop is a real solid on the base |
| L6 | PASS | AUTO · depth order right at plan, 28°, side and explode |
| L7 | PASS | STYLE · tilt 0° to 88°, no shear |
| L8 | PASS | AUTO / HAND · engraved grip path and scale are marks; spindle thread ticks one mark each |
| R1 | PASS | HAND · the polish reuses H.standoff, H.screw, H.stops; the spindle and its nut are drawn inline because no primitive has an axis in the plane (promotion candidate) |
| R2 | PASS | HAND · threads M2.5, M3, M4, M5; joint Ø 6, 10; bearings 6800-2RS (10x19x5), F686ZZ (6x13x5) · three bearing sizes |
| R3 | PASS | AUTO · housing and slide from their subassemblies |
| R4 | PASS | AUTO · package built at build time, 16.8 KB |
| R5 | PASS | HAND · states only what differs; no sampling beyond swing(); rules 0.07 s, polish 21 ms |
| R6 | PASS | FLAG · Node CPU bench at DPR 1.5: plan 212, 28° 271, side 172, explode 213 ms at full detail; dial D 30 ms (Node canvas, not a browser; looked at in #44) |
| R7 | PASS | HAND · model.ts + polish.ts 10.2 KB |
| R8 | PASS | AUTO / SITE · pre-rendered thumbnails; the stage draws on change only |
| DL1 | PASS | AUTO / HAND · 46 of 125 solids on a dropping rung · the polish moves nothing on the ladder |
| DL2 | PASS | HAND · default dial full |
| DL3 | PASS | AUTO · DL-D drawn when exploded, DL-B skipped at side elevation |
| DL4 | PASS | SITE · adaptive dial and the detail entry in the title block |
| DL5 | PASS | FLAG · rung counts and frame times in the detail ladder below |
| Q1 | PASS | check, clamp and edge distance clean |
| Q2 | PASS | 0 clashes |
| Q3 | PASS | package written, 16.8 KB; site build covered by the repository tests |
| Q4 | PASS | plan, 28°, side, explode at 28° and 70°, both sheets (dist/shots, looked at) |
| Q5 | PASS | Node CPU bench, flags under R6 |
| Q6 | PASS | every row judged |
| Q7 | PASS | conformance: toggle-clamp at 2.3, pass |

## Joints
| Joint | Type | F1 locate | F2 retain | F3 torque | F4 thrust | F5 limit | F6 hold | F7 adjust | F8 lube | F9 timing | F10 protect |
|---|---|---|---|---|---|---|---|---|---|---|---|
| pO | J2 | 2 x Dowel pin Ø3 x 10 h6, housing to base | 2 x Internal circlip DIN 472, Ø19; Countersunk M5 x 12 (ISO 10642), into the shaft end, flush; Socket head M5 x 10 (ISO 4762), into the shaft end | 2 x Feather key 3 x 3 x 6 (DIN 6885) | Wave washer 14.5x18.8, spring steel; Thrust washer 10.2x16, bronze | – turns by hand between its stops (drive) | – held by the over-centre lock and the stops | – no adjustable length | – sealed bearings | – both ends are stops | – hand operated |
| pA | J3 | – no removable plate on a moving pin | Internal circlip DIN 472, Ø13; Bearing F686ZZ (6x13x5); head | – no keyed part | F686ZZ located by flange and circlip, inner race clamped | – limited by the handle stops | – driven by hand | – no adjustable length | – shielded bearing, greased for life | – no phase to keep | – none needed |
| pB | J3 | – no removable plate on a moving pin | Internal circlip DIN 472, Ø13; Bearing F686ZZ (6x13x5); head | – the cap is clamped on the shoulder; no keyed part | F686ZZ located by flange and circlip, inner race clamped | – limited by the linkage | – driven by hand | – no adjustable length | – shielded bearing, greased for life | – no phase to keep | – none needed |
| slide-plunger | J5 | – the rails are dowelled to the base | Keeper plate, holds the slider down | none | – the keeper takes the lift, the base the weight | End stop block, hardened (rear); the over-centre stop on the handle | – linkage driven | Gib strip 3 x 6 x 136, bronze; Clamp spindle M5, 35 long, hardened pad head Ø12; Lock nut M5 (DIN 439, thin) | 2 x wiper; Grease nipple M6 (DIN 71412) | – no phase to keep | – hand operated |
| raila-seat | post | 2 x Dowel pin Ø3 h6 (ISO 8734), rail to base | – screwed down through rail and pad at each pad | – static | – static | – static | – static | – the gib adjusts the fit | – static | – static | – static |
| railb-seat | post | 2 x Dowel pin Ø3 h6 (ISO 8734), rail to base | – screwed down through rail and pad at each pad | – static | – static | – static | – static | – the gib adjusts the fit | – static | – static | – static |
| drive | drive | – hand operated | – the grip screw is threadlocked | Handle grip Ø16, phenolic, on an M4 screw | – hand | 2 x Stop bumper, neoprene sleeve Ø12 | – the over-centre lock holds the closed position | – no adjustment | – no sliding | – none | – hand operated, no motor |

## Variants and overrides
| Joint or part | Rule result | Chosen | Why |
|---|---|---|---|
| handle | layer 0, z 0 to 6 | plated 2.5 mm up in the model (`dz`) | A9: 1.5 mm gap under the link |
| pA | knee pin through handle and link, single shear | handle clevis: the front plate twinned with the rear one in the model, 1.5 mm over the link | A9: double shear |
| pB | pin through plunger and link, single shear | plunger clevis: cap twinned with the plunger, on a post at x 14 screwed into the plunger | A9: double shear |
| plunger | slider block | notched at the back (notch 9.4 wide from x 28), in the model | F7: holds the clamp spindle; pad face stays at 63 mm |
| drive handle and stops | knob placed off the handle, stops on the arm axis | dropped; grip standoff at the grip point, H.stops on the grip arm with margin 0 | the generator treats the arm axis as the part's reach, the toggle's handle lands on its grip arm |
| slide forward end stop | block 1.5 mm past the plunger's travel | dropped | the spindle tip passes there; the over-centre stop ends the travel |

## Detail ladder
| Rung | Solids | Marks | Frame ms at this dial position |
|---|---|---|---|
| DL-A | 8 | 0 | 182.7 |
| DL-B | 0 | 183 | 177.2 |
| DL-C | 0 | 0 | 40.8 |
| DL-D | 19 | 0 | 30.5 |
| DL-E | 3 | 0 | 35.4 |
| DL-F | 0 | 0 | 41.4 |
| DL-G | 0 | 0 | 25.4 |
| DL-H | 16 | 0 | 21.1 |
| never | 79 | 138 | 269.4 (full) |

## Promotion candidates
- An in-plane spindle primitive: a threaded rod with its axis in the drawing plane, a jam nut and a pad head (drawn inline here; needed by any clamp, turnbuckle or adjustable link, F7).
- The manual drive (`drive`, V5): place the grip on the input part's outline and its stops on the direction the part actually lands, not the arm axis; the generated knob and stops are replaced by hand here.
- Slide end stops: let a polish declare the stop is replaced (no forward stop where a part passes beyond the slider body).

## Verification
check: clean · clearance: 0 clashes · clamp: clean · edge distance: clean · package: 16.8 KB
screenshots: plan, 28°, side, explode at 28° and 70°, both sheets (local, dist/shots) · bench: Node CPU canvas, DPR 1.5; 28° 271 ms at full detail, 21 ms at dial H (flag, R6)
