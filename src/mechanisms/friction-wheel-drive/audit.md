# Audit: Friction wheel drive (friction-wheel-drive)
standard: 2.11 · date: 2026-10-20 · result: pass · detail: full · pass: build

## Summary
PASS 118 · FAIL 0 · N/A 10 · open: none

## Requirements
| Id | Status | Evidence / action |
|---|---|---|
| S1 | PASS | DATA · the standard carries version 2.10 and its changelog |
| S2 | PASS | HAND · header with standard, date, result, detail, pass |
| S3 | PASS | AUTO · tools/conformance reads this header and runs in npm run check |
| S4 | PASS | SITE · #139 holds only this mechanism's decisions and open items |
| P1 | PASS | DATA · record complete; model.ts, polish.ts, audit.md present |
| P2 | PASS | DATA · catalogue validator clean (npm run check) |
| P3 | PASS | DATA / SITE · ratio (continuously variable, R / r_w), perpendicular intersecting axes, output character (continuous, variable speed, reversing), backdrivable, other names, family, motion, level, dof and the motorised drive |
| P4 | PASS | DATA · tags grouped Function, Property, Application, keywords underneath |
| P5 | PASS | DATA · motion, forces, benefits, limits; three uses (snowblowers, early cars, railway trolleys) with one line each |
| P6 | PASS | DATA · Wikipedia, a museum glossary and a patent; two videos, an animation, a photo page; two real-world videos (playback not rechecked in this pass) |
| P7 | PASS | HAND / SITE · no prose in model.ts or polish.ts; lint clean |
| P8 | PASS | SITE · no parts list, build or joint sections on the page |
| P9 | PASS | HAND · solve(): the wheel turns at R / r_w times the disc, through zero and backward past the centre, as the text says; disc springs keep the disc pressed on the tyre (forces text: a spring keeps the wheel pressed on); the tyre slips past mu N r_w |
| P10 | PASS | HAND · velocity of the tyre's tread point that starts at the contact (its speed follows R), the disc's spin, the shift along the slide (push / pull), plot of wheel speed over disc speed (3.0 to -1.0 over the cycle). No paths: nothing traces a curve. The catalogue's scrub arrows need a one-way arrow item the model overlays lack (promotion candidate) |
| P11 | PASS | DATA · plain, short sentences, no em dashes, mm and degrees |
| K1 | PASS | HAND · check: max link error 0.0e+0 mm; disc and tread radii, the shaft 30 over the face and the contact radius are the model's; the polish splits the wheel into centre and tyre at the model's tread radius |
| K2 | PASS | HAND · check: finite, continuous, periodic over 720 samples |
| K3 | PASS | HAND · disc, disc (wheel), custom (hex sleeve, fork), slider and rails (shift), two caps; at placement with spin; wheel and fork posed by frame W |
| K4 | PASS | HAND · roles driver (disc), output (wheel, sleeve), link (carriage, fork), ground (rails), pin; accent only on the disc's cap pD, the input |
| K5 | PASS | HAND · check: no INTERFERE, OVERLAP or WARN; the disc on layer 1 over the shift slide on layer 0; wheel, sleeve and fork layers are their explode levels |
| K6 | PASS | DATA · disc 100, wheel 30, shaft axis 30 over the face crossing the disc axis, R from -30 to 90: as the catalogue. The setting R sweeps its range over the cycle (R = 30 + 60 cos u, the catalogue's note: animate the shift); its R = 60 is passed at u = 1.23 and 5.05 (code comment). The disc makes two turns per cycle |
| K7 | PASS | HAND · input rotary on the disc, as the catalogue |
| D1 | PASS | HAND · a plain ground disc, a wheel on a hub and five arms with a bonded tyre, a hex sleeve keyed to its shaft, a slider on two rails |
| D2 | PASS | HAND · hub Ø30 round the hex bore, shoulders either side of the fork's groove, the fork a 12 mm bar to a half ring 7 mm deep; the disc solid (the tyre runs over its whole face) |
| D3 | PASS | STYLE · roles told apart by pattern and tone in both sheets |
| D4 | PASS | AUTO · feet on the grown base, concentric with the corner arcs |
| D5 | PASS | AUTO / HAND · two pillow blocks on foot plates, one housing, one bracket for the motor; the fork on a post machined with the carriage |
| D6 | PASS | HAND / STYLE · blocks, slide and post read quieter than the disc and the wheel |
| D8 | PASS | AUTO / HAND · the sleeve and its shaft on axis x with along; the wheel and fork on a posed frame W (axis x, origin at x = R), since they slide along the shaft; check reports no AXIS |
| D9 | N/A | no member changes shape; the tyre is drawn rigid |
| D7 | PASS | HAND · disc, wheel, blocks and slide carry only load shape and manufacturing marks |
| A1 | PASS | AUTO · pD J2, pW J10, slide-carriage J5 (the generator's list skips two-digit types); the friction contact has no joint type and is a hand joint (promotion candidate) |
| A2 | PASS | AUTO · pD live (the accent input, keyed disc), pW a live shaft in plan (keyed sleeve), the shift slide J5 |
| A3 | PASS | AUTO · 6801 on the Ø12 disc shaft in the housing, 6800 on the Ø10 wheel shaft in the blocks |
| A4 | PASS | AUTO · stepped keyed shafts, chamfered ends, circlip grooves |
| A5 | PASS | AUTO · feather keys 4 x 4 on Ø12 and 3 x 3 on Ø10 (the sleeve's shortened to 40 at the middle) |
| A6 | PASS | AUTO · both shift rails on ground risers screwed into the base, the reference rail dowelled |
| A7 | PASS | AUTO · 8 mm base, counterbored corners, feet, front scale, clearance hole for the disc shaft; grown under the blocks |
| A8 | PASS | AUTO · every head has its shank; holes cut by stage 3 |
| A9 | PASS | AUTO / HAND · the wheel between two blocks 244 mm apart (J10); the disc single shear on its housing, since the wheel sweeps over its centre (badge warn) |
| A10 | PASS | HAND · the shift slide on layer 0 beside the disc, the disc on layer 1, the wheel and fork on the shaft over it |
| A11 | PASS | HAND · tyre to disc to keyed shaft to housing (screwed, dowelled); the contact force from the springs through the seat collar into the shaft and its bearings; wheel to hex sleeve to keyed shaft to two blocks (screwed, dowelled); fork to post to carriage to the slide |
| A12 | PASS | AUTO · clamp check clean |
| A13 | PASS | AUTO / HAND · 153 solids, 79 unnamed (further items of a listed set) |
| A14 | PASS | HAND · blocks 5 mm past the hub flange at R = 90; slide and post beyond the disc's rim; fork 11 mm over the disc face; clearance 0 |
| A15 | PASS | AUTO · clearance: 0 clashes over the cycle |
| A16 | PASS | HAND · 5 build rules; every joint noted and badged |
| A17 | PASS | HAND · housing and disc shaft from below, seat collar, shim, springs, disc and end screw; blocks on the base, shaft with collars, sleeve and its circlips, wheel slid on before the far block; carriage on its rails, knob through the fork; every screw reachable |
| E1 | PASS | AUTO · every solid has one explode level; levels -8 to 5 |
| E2 | PASS | AUTO · 36 rigid groups; screws, shafts and the motor pulley set each one body |
| E3 | PASS | AUTO · block, rail and stop screws upward, housing screws downward |
| E4 | PASS | HAND · knob, then fork, then wheel, then shaft with sleeve and blocks lift off above the disc; the carriage stays on its slide |
| E5 | PASS | AUTO · bearings and circlips stay in the housing and the blocks |
| E6 | PASS | AUTO · motor and bracket on one level; the belt in the pulley plane |
| E7 | PASS | AUTO · spacers midway |
| E8 | PASS | AUTO · collar, shim, springs and disc keep their order on the disc shaft; collars and sleeve on the wheel shaft |
| E9 | PASS | HAND · readable at full explode at 28° and 70°: nothing inside another part, nothing leaves the frame |
| J1 | N/A | no dead axle |
| J2 | PASS | AUTO · housing with two sealed bearings, sleeve, wave washer, circlips, screwed and dowelled; keyed shaft; flush end screw; thrust washer on the base; the rule's spacer under the disc replaced by the spring stack (polish) |
| J3 | N/A | no moving pin |
| J4 | N/A | no pin in a slot |
| J5 | PASS | AUTO · dowelled reference rail, gib clamped under the keeper, wipers, nipple, an end stop at each end of the shift |
| J6 | N/A | no parallel mesh |
| J7 | N/A | no cam |
| J8 | PASS | AUTO · motor pulley flanged, the bracket slotted for tension |
| J9 | N/A | no crossed mesh; the crossed-axis contact is a friction contact, built by hand (promotion candidate) |
| J10 | PASS | AUTO · two pillow blocks past either end of the sleeve, sealed bearings, located in the nearer by two collars, floating in the other; screwed and dowelled foot plates |
| J12 | N/A | no flexible member |
| J13 | N/A | no compliant joint |
| J11 | N/A | no screw |
| F1 | PASS | AUTO · housing, blocks and reference rail dowelled |
| F2 | PASS | AUTO / HAND · bearings on circlips; collars on the wheel shaft; the sleeve between two circlips (polish); the wheel held along the sleeve by the fork in its hub's groove |
| F3 | PASS | AUTO / HAND · feather keys in the disc and the sleeve; the wheel driven by its hex bore; the tyre bonded |
| F4 | PASS | AUTO / HAND · wave washer preloading the housing pair, thrust washer on the base; the contact force carried by the seat collar into the shaft and bearings (polish); collars locating the wheel shaft |
| F5 | PASS | AUTO · the slide's end stops are the ends of the ratio range; both shafts turn fully |
| F6 | PASS | HAND · four disc springs hold the disc on the tyre (AUTO-TODO); the gib's drag holds the setting |
| F7 | PASS | AUTO / HAND · the shim under the springs sets the contact force (AUTO-TODO); the gib; belt tension by the bracket's slots |
| F8 | PASS | AUTO / HAND · the slide greased by its nipple beyond the disc's rim; the friction faces and the hex sleeve kept dry on purpose; sealed bearings |
| F9 | PASS | HAND · ratio stations engraved on the base beside the reference rail (3, 2, 1, 0, -1 x), a pointer on the carriage; no phase to time |
| F10 | PASS | AUTO / HAND · motor pulley flanges, home flag and fork sensor; the tyre slips past mu N r_w, the contact its own overload clutch |
| M1 | PASS | AUTO · edge breaks on every top face |
| M2 | PASS | HAND · hub and five arms in the wheel centre (it reverses); the disc solid, the tyre runs over its whole face |
| M3 | PASS | AUTO · bore entry chamfers on every seat and through hole |
| M4 | PASS | AUTO / HAND · counterbored housing screws and base corners, countersinks for the rail screws and the disc's end screw |
| M5 | PASS | AUTO / HAND · arm windows filleted R1.5, the post's corners R1.5 |
| M6 | PASS | AUTO · edge distance and walls clean |
| M7 | PASS | HAND · arm roots filleted; the fork's half ring blends into its bar |
| M8 | PASS | AUTO · thread undercuts on the shaft ends |
| M9 | PASS | AUTO / HAND · standard lengths; block screws M5 into the base; the knob's M4 stud 8 mm into the post |
| M10 | PASS | AUTO / HAND · 153 of 153 solids name a material; steel disc with a ground face, nitrile tyre, aluminium wheel centre, cast-iron blocks, bronze carriage |
| M11 | PASS | AUTO · centre holes and chamfered ends on the shafts |
| M12 | PASS | HAND · every head reachable; bearings pressed out past their circlips |
| M13 | PASS | AUTO / HAND · 55 threaded, 0 without a locking method; the knob's stud threadlocked |
| M14 | PASS | HAND · the tyre is the replaceable wear part of the contact; the slide's rails and gib (J5) |
| V1 | PASS | AUTO · brushless pancake motor Ø50 x 18 under the base, GT2 32:16 to the disc shaft |
| V2 | PASS | AUTO · one-piece bracket under the base, flange screws up into it |
| V3 | PASS | HAND · belt and pulleys clear of the feet and the housing; clearance 0 |
| V4 | PASS | AUTO · flanged motor pulley, the input pulley on a hub with set screws, slotted bracket |
| V5 | PASS | HAND · rotary: belt to the input pulley on the disc shaft, the catalogue's input kept; the shift is a hand setting by the knob |
| V6 | PASS | AUTO · home flag on the input hub, fork sensor on the housing, leads to a terminal block on the base edge, one P-clip |
| L1 | PASS | STYLE · lint-style clean |
| L2 | PASS | HAND · the polish carries geometry, roles, marks and materials only |
| L3 | PASS | HAND · disc driver, wheel, tyre, hub and sleeve output, carriage, post and fork link, rails and blocks ground, hardware hw |
| L4 | PASS | HAND / STYLE · accent on the input only |
| L5 | PASS | AUTO / HAND · screws, bearings and springs are real solids in real holes; the springs show through the disc |
| L6 | PASS | AUTO · depth order right at plan, 28°, side and explode across the z, x and posed solids |
| L7 | PASS | STYLE · tilt 0° to 88°, no shear |
| L8 | PASS | AUTO / HAND · ratio stations and the pointer are index marks |
| R1 | PASS | HAND · blocks, housing, slide and drive from the rules; the polish adds the hub pieces, tyre, post and springs with H.solid, H.collar, H.washer, H.waveWasher, H.circlip, H.screw and H.spokes |
| R2 | PASS | HAND · threads M3, M4, M5, M6; shafts Ø10 and 12; bearings 6800 and 6801; GT2 16T and 32T |
| R3 | PASS | AUTO · housing, pillow blocks, slide and drive from their subassemblies |
| R4 | PASS | AUTO · package 22.9 KB |
| R5 | PASS | HAND · states only what differs; no sampling in the polish; polish under 5 ms |
| R6 | PASS | FLAG · browser bench: plan 3.08, 28° 3.28, side 2.43, explode 2.83 ms at full detail, setup 8.8 ms; under the 8 ms target |
| R7 | PASS | HAND · model.ts + polish.ts 16.1 KB |
| R8 | PASS | AUTO / SITE · pre-rendered thumbnails; the stage draws on change only |
| DL1 | PASS | AUTO / HAND · every solid and mark on a rung; the disc springs moved up from DL-D to DL-H (without them the contact reads unloaded) |
| DL2 | PASS | HAND · default dial full |
| DL3 | PASS | AUTO · DL-D drawn when exploded, DL-B skipped at side elevation |
| DL4 | PASS | SITE · adaptive dial and the detail entry in the title block |
| DL5 | PASS | FLAG · rung counts and frame times in the detail ladder below |
| Q1 | PASS | check, clamp and edge distance clean |
| Q2 | PASS | 0 clashes |
| Q3 | PASS | package written, 22.9 KB; the site build waits for the thumbnail, which the lead draws on the family branch (site/thumbs untouched here) |
| Q4 | PASS | plan, 28°, side, explode at 0°, 28°, 70° and 88°, both sheets |
| Q5 | PASS | browser bench at DPR 1.5; under target |
| Q6 | PASS | every row judged |
| Q7 | PASS | conformance: friction-wheel-drive at 2.10, pass |

## Joints
| Joint | Type | F1 locate | F2 retain | F3 torque | F4 thrust | F5 limit | F6 hold | F7 adjust | F8 lube | F9 timing | F10 protect |
|---|---|---|---|---|---|---|---|---|---|---|---|
| pD | J2 | 2 x Dowel pin Ø3 x 10 h6, housing to base | 2 x Internal circlip DIN 472, Ø21; Countersunk M6 x 14 (ISO 10642), into the shaft end, flush; Socket head M6 x 12 (ISO 4762), into the shaft end | Feather key 4 x 4 x 8 (DIN 6885) | Wave washer 16.5x20.8, spring steel; Thrust washer 12.2x18, bronze | – turns fully | – see contact | – contact force by the shim (contact) | – sealed bearings | – no phase | – see drive |
| pW | J10 | 4 x Dowel pin Ø4 x 14 h6, block to base | 2 x Shaft collar Ø10 x Ø20 x 6, set screw M3; 2 x Pillow block, bored for a 6800-2RS | Feather key 3 x 3 x 40 (DIN 6885), sleeve to shaft | 2 x Shaft collar Ø10 x Ø20 x 6, set screw M3 | – turns fully | – driven through the contact | – none needed: the blocks set the shaft's height | – sealed bearings; the hex sleeve runs dry | – no phase | – the contact slips |
| slide-carriage | J5 | – the reference rail is dowelled (shiftb-seat) | Keeper plate, holds the slider down | – no torque | – no thrust | 2 x End stop block, hardened | – the gib's drag holds a setting | Gib strip 181 x 7 x 2.3, bronze, slotted, clamped under the keeper | 2 x wiper; Grease nipple M6 (DIN 71412) | Ratio stations engraved on the base, pointer on the carriage | – hand setting |
| shifta-seat | post | – the gib takes up the fit against the reference rail | 3 x countersunk M3 down into the base | – static | – static | – static | – static | – the gib on it | – static | – static | – static |
| shiftb-seat | post | 2 x Dowel pin Ø3 h6 (ISO 8734), rail to base | 3 x countersunk M3 down into the base | – static | – static | – static | – static | – the reference | – static | – static | – static |
| drive | drive | – bracket screwed to the base | – pulley hub set screws | Pulley hub, 2 x M3 set screws at 90° | – motor bearings | – motor turns freely | – motor holds when powered | bracket | – belt runs dry | Home flag read by the fork sensor | Home flag, 1 mm steel vane; 3 x Fork sensor, slotted optical, 5 mm gap; Pulley flanges |
| contact-wheel-disc | post | – the shafts locate the wheel and the disc | Shift fork | Tyre Ø60 x Ø52 x 12, nitrile rubber, bonded to the centre | Spring seat collar Ø12 x Ø24 x 4.5, set screw M4 | – the slide's end stops end the ratio range | 4 x Disc spring DIN 2093 C 25 (25 x 12.2 x 0.7), 4 in series, 200 N on the tyre | Shim 12.2 x 25 x 0.5, sets the contact force | – kept dry on purpose: oil makes it slip | – ratio stations at the slide (slide-carriage) | Tyre Ø60 x Ø52 x 12, nitrile rubber, bonded to the centre |

## Variants and overrides
| Joint or part | Rule result | Chosen | Why |
|---|---|---|---|
| wheel | one part, the tread radius | aluminium centre on a hub and five arms, bonded nitrile tyre, hub with the fork's groove | M2 (it reverses), M10 (rubber on steel); K1 kept: the tyre's outside is the model's tread |
| pD-tw-sp | spacer from the thrust washer to the disc | seat collar, shim and four disc springs | the contact force (F4, F6, F7): the disc slides on its key onto the tyre |
| pW-sleeve-key | key the sleeve's length (226) | 40 at the middle; the sleeve held by two circlips | a key the sleeve's length is no real part |
| pD | two bearings, single shear | kept, badge warn | the wheel sweeps over the disc's centre; nothing can stand over it |
| pD-dspr0..3 | DL-D (stack hardware) | DL-H | without them the contact reads unloaded |
| wheel, tyre, hub, fork | box test against the shaft and sleeve | allowed round them | the posed wheel and fork are boxed whole; in their own plane the hex bore clears the sleeve by 0.1 mm a side and the fork rides 0.5 mm round the hub's neck |

## Detail ladder
| Rung | Solids | Marks | Frame ms at this dial position |
|---|---|---|---|
| DL-A | 10 | 0 | 2.97 |
| DL-B | 0 | 241 | 2.21 |
| DL-C | 0 | 0 | 2.05 |
| DL-D | 10 | 0 | 2.15 |
| DL-E | 11 | 0 | 2.19 |
| DL-F | 0 | 0 | 1.87 |
| DL-G | 0 | 0 | 1.84 |
| DL-H | 27 | 0 | 1.44 |
| never | 95 | 154 | 3.14 (full) |

## Promotion candidates
Hand fixes that should become rules or primitives.

- **AUTO-TODO, a friction contact joint (J14, or J9 with form "friction").** No joint type knows a rolling friction contact between two parts, so it is a hand joint (type `post`, the polish API's default) in `src/mechanisms/friction-wheel-drive/polish.ts`. Smallest change: a model declaration `contacts: [{ a, b, form: "friction" }]`, classified in `src/rules/classify.ts`, its rule building the preload below and serving F4, F6, F7, F10; and the clearance (`src/assemble/clearance.ts`) treating it as a contact, as cams and crossed meshes are.
- **AUTO-TODO, contact preload.** `src/mechanisms/friction-wheel-drive/polish.ts`: the rule's spacer under the pressed part replaced by a seat collar, a shim and a disc-spring stack, the part sliding on its key. As a rule of the contact joint, or an `H.discSprings` primitive (DIN 2093 sizes in `src/hardware/tables.ts`).
- **Engine: a posed solid's bore is boxed whole.** The wheel, its hub, the tyre and the fork are allowed round the shaft and sleeve because the clearance compares solids on different planes by their boxes. Cheapest fix: compare a posed solid with an x or y solid of the same axis direction in its own plane (`src/assemble/clearance.ts`), so no allow is needed.
- **Engine: a member sliding along its own axis needs a posed frame.** Axis x or y parts have a fixed `along`; the wheel and fork translate along x and are posed by frame W only for that. A solved `along` (a key into the solved state) on x and y parts would do it and keep J10 seeing the wheel on its shaft.
- **Overlays: one-way arrows.** The catalogue asks for the scrub across the tyre's width as small arrows; model overlays have only push / pull (`axial`), spin, angle and bend. An `arrow` item (the renderer's internal `force`) in `src/model/types.ts` would draw it.
- **Audit generator:** the A1 / A2 joint list matches `^J\d$`, so J10 to J13 are left out (`src/audit/generate.ts`).

Proposed Appendix A playbook, **Friction drives** (friction wheel and disc, ball and disc, cone drives):
- Declare the contact (once the joint exists); the working radii and the shaft's height from the model, the tread the model's outline.
- Contact preload: the pressed part slides on its key and a disc-spring stack (or a compression spring on a lever) presses it on, reacting into its own shaft and bearings, never a sliding face; the force follows from the torque (T = mu N r) and holds as the rubber wears (F4, F6).
- Adjust: a shim under the spring stack sets the force (F7); a ratio setting has stops at its ends (F5) and engraved stations (F9).
- Slip: the contact is its own overload clutch (F10); no shear pin. Faces kept dry: no grease or nipple within reach of the faces (F8).
- Materials: rubber, fibre or leather tread bonded to an aluminium centre against a hard, ground steel face; the tread is the replaceable wear part (M10, M14).
- A wheel that slides to change the ratio runs on a hex or splined sleeve keyed to its shaft, moved by a fork in a groove in its hub; the shaft's blocks stand past the disc's rim, so the wheel can cross the centre and reverse.

## Verification
check: clean · clearance: 0 clashes · clamp: clean · edge distance: clean · package: 22.9 KB
screenshots: plan, 28°, side, full explode at 0°, 28°, 70° and 88°, both sheets (dist/shots-friction-wheel-drive) · bench: browser, DPR 1.5, 2026-10-20; package 22.9 KB, setup 8.8 ms, plan 3.08, 28° 3.28, side 2.43, explode 70° 2.83 ms at full detail, under target
