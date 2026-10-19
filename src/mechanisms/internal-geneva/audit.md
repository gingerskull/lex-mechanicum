# Audit: Internal Geneva drive (internal-geneva)
standard: 2.6 · date: 2026-10-19 · result: pass · detail: full · pass: build

## Summary
PASS 105 · FAIL 0 · N/A 16 · open: none

## Requirements
| Id | Status | Evidence / action |
|---|---|---|
| S1 | PASS | DATA · the standard carries version 2.6 and its changelog |
| S2 | PASS | HAND · header with standard, date, result, detail, pass |
| S3 | PASS | AUTO · tools/conformance reads this header and runs in npm run check |
| S4 | PASS | SITE · #122 holds only this mechanism's decisions and open items |
| P1 | PASS | DATA · record complete; model.ts, polish.ts, audit.md present |
| P2 | PASS | DATA · catalogue validator clean; vocabularies exact |
| P3 | PASS | DATA / SITE · page shows ratio (index step), parallel axes, intermittent output with dwell, not backdrivable (self-locking), other names, family, motion, level, dof 1, and that the drive is hand operated |
| P4 | PASS | DATA · tags grouped Function, Property, Application, keywords underneath |
| P5 | PASS | DATA · motion, forces, benefits, limits; three uses with one line each |
| P6 | PASS | DATA · Wikipedia, Engineers Edge, FIRGELLI and a patent; two videos and an animation; the three YouTube links checked with oEmbed (all exist, titles match, real footage in the day-of-week clock); the real-world section holds that clock. No photo page in the record: the Commons category for the internal Geneva holds only diagrams and animations, so none is added (catalogue gap for the DATA batch) |
| P7 | PASS | HAND / SITE · no prose in model.ts or polish.ts; lint-style clean |
| P8 | PASS | SITE · no parts list, build or joint sections on the page |
| P9 | PASS | HAND · solve(): the wheel turns 90° the crank's way during 270° of crank and is held for 90°; the pin enters on the slot axis (tangential entry, a unit test holds it); the text's cup is the ring wheel, the crank is overhung as it says |
| P10 | PASS | HAND · pin circle traced, pin velocity, input spin and pin force while engaged, wheel angle while engaged, staircase plot of the wheel angle |
| P11 | PASS | DATA · plain, short sentences, no em dashes, mm and degrees |
| K1 | PASS | HAND · check: max link error 0; slot walls, mouths, crank, sector and the locking plate's opening are the model's; strips, segment, windows, spacers and screws are cut behind or round them |
| K2 | PASS | HAND · check: finite, continuous, periodic over 720 samples |
| K3 | PASS | HAND · custom plates and crank, discs for rollers and knob, caps; at placement and spin |
| K4 | PASS | HAND · roles driver (crank, knob), output (slot plate, locking plate), link (rollers), pin; the accent is on the hand knob, the input: the crank pivot is a hung stud, not a live shaft, so its cap carries none |
| K5 | PASS | HAND · check clean: rollers and slot plate layer 0, crank and locking plate layer 1, knob layer 2 plated down 4 mm onto the crank, caps below and through |
| K6 | PASS | DATA · n 4, c 40, a = c sin(π/4) = 28.28 (28.3), mouth radius 28.28, slot 8.2 wide, pin Ø8, roots at 72.4 (beyond 72), sector R16 opposite the pin, 270° engaged and 90° dwell, same sense, plate R88. Deliberate differences: the cup is a ring carried on three flanged rollers and the crank hangs above it from a bridge (the crank axis lies in the wheel's material); the wheel is two plates turning as one, the locking plate in the crank's plane with its opening cut from the crank's sweep 1 mm clear, so the concave locking arcs come from the sector, which spans 140°; a 1.2 mm lead-in at each slot mouth; the input is hand operated, because a motor needs a shaft from the base at the crank axis, through the wheel; the catalogue's rim inner radius 76 is not kept, the slots end at 72.4 and the rim is 15 mm wide there |
| K7 | PASS | HAND · input manual on the crank; the knob is the handle, the crank turns fully (V5 manual) |
| D1 | PASS | HAND · crank tapered between its bosses (R12 at the shaft, R7 at the pin) with engraved boss rings; flush pivot cap; ring plates; squircle base; bridge as two arms |
| D2 | PASS | HAND · material where the load runs: bosses round the shaft and the pin, the locking plate whole round its arcs, lobe windows only in the slot plate, the indexed member |
| D3 | PASS | STYLE · roles told apart by pattern and tone in both sheets |
| D4 | PASS | AUTO · base corners and feet concentric |
| D5 | PASS | AUTO / HAND · one bridge over the crank's stud as two arms, its posts in the wheel's central opening; a bridge over each roller axle |
| D6 | PASS | HAND / STYLE · strips, felts, screws, flanges and windows read quieter than the plates and the crank |
| D7 | PASS | HAND · plates and crank carry only load shape and manufacturing marks; the richness is in the stud, strips, segment, flanges and joins |
| A1 | PASS | AUTO · pO J1 (hung), pR0 to pR2 J1; pP J3: the rules cannot read a roller in the slot plate's opening as a slot (it is one big hole), so its stud is built by hand and the rules' bolt dropped |
| A2 | PASS | AUTO · hung stud at pO, dead axles at the rollers; the roller stud by hand |
| A3 | PASS | AUTO · F6800ZZ (10x19x5) in the crank on the Ø10 hung stud, F688 (8x16x5) in each roller on a Ø8 axle; roller Ø7.9 on the Ø4 stud (a hardened sleeve roller) |
| A4 | PASS | AUTO · stepped hung stud and axles with undercut threads and circlip grooves; roller stud with collar, M3 thread with undercut and a groove |
| A5 | N/A | nothing is keyed: the crank turns on a bearing, the knob is threaded |
| A6 | PASS | AUTO · no floating fixed plate besides the bridges, on spigoted Ø10 standoffs |
| A7 | PASS | AUTO · 8 mm base grown round the rollers and bridges, counterbored corners, feet, roller path engraved, front scale; no live shaft, so no clearance hole |
| A8 | PASS | AUTO · every head has its shank; holes cut by stage 3, strip screws tapped half in the plate |
| A9 | PASS | HAND · the crank hangs overhung from the hung stud (the catalogue's overhung crank: the stud is held at one end by the bridge, nothing can sit under the crank); the roller stud is clamped between its collar and the knob; the roller axles are held by base and bridge |
| A10 | PASS | HAND · slot plate and rollers z 0 to 6, crank and locking plate z 10 to 16, knob 16 to 28: the parts that meet share a plane, nothing is stacked only to clear something |
| A11 | PASS | HAND · pin to roller stud to crank to the hung stud to its bearing, bridge, posts and base; plate to flanges and rollers to axles to the base; bridges screwed and spigoted |
| A12 | PASS | AUTO · clamp check clean |
| A13 | PASS | AUTO / HAND · every solid named with catalogue sizes, sets counted |
| A14 | PASS | HAND · the bridge's posts stand in the wheel's opening at radius 22, outside every sweep (the rule keeps 2 mm); strips, felts and screws lie inside the plate outlines; clearance 0 |
| A15 | PASS | AUTO · clearance: 0 clashes over the cycle |
| A16 | PASS | HAND · a note and a badge on every joint, five build rules |
| A17 | PASS | HAND · base and roller axles with bearings, flanges and rollers; slot plate on the three flanges, retaining rings over; locking plate on its spacers and dowels; the bridge's posts up through the wheel's opening; crank with its bearing and segment, roller stud and knob; the bridge, nut last. The strips are reached through the locking plate's wedges |
| E1 | PASS | AUTO · one level per solid |
| E2 | PASS | AUTO · screws, bolts, the roller stud with its roller, shafts and bought units are groups |
| E3 | PASS | AUTO · stud and axles leave upward, the roller stud downward from the crank, base screws downward |
| E4 | PASS | HAND · rollers and plates, crank, knob, bridge and its nut: the last part fitted goes furthest |
| E5 | PASS | AUTO · bearings, circlips, strips and felts stay in their parts |
| E6 | PASS | AUTO · bearings and rollers whole |
| E7 | PASS | AUTO · spacers midway |
| E8 | N/A | no keyed parts on a shaft |
| E9 | PASS | HAND · readable at full explode at 28° and 70° |
| J1 | PASS | AUTO · pO: hung stud with bearing, circlip, sleeve and nyloc under the bridge; pR: shouldered axle through the base to a nyloc, bearing with circlips, thrust washer, bridge on spigoted posts, oil sink |
| J2 | N/A | no live shaft: nothing may rise from the base at the crank axis |
| J3 | PASS | HAND · the roller stud is the one moving pin; built by hand (see A1) |
| J4 | PASS | HAND · track roller on its stud, hardened wear strips screwed to every slot wall with the slots relieved behind them, a felt in every slot end |
| J5 | N/A | no slide |
| J6 | N/A | no gear mesh |
| J7 | N/A | the locking sector and arcs are a clearance fit, not a cam with a follower |
| J8 | N/A | hand operated: no belt |
| F1 | PASS | AUTO / HAND · bridges spigoted, plates dowelled (round hole and slot) |
| F2 | PASS | AUTO / HAND · bearings held by circlips and flanges; roller circlipped on its stud; roller flanges and retaining rings |
| F3 | PASS | HAND · the roller stud clamps the crank between its collar and the threadlocked knob; nothing is keyed |
| F4 | PASS | AUTO / HAND · bronze thrust washers under the roller bearings, flanges carrying the plate, a spacer sleeve on the roller stud |
| F5 | N/A | the crank turns fully and the wheel indexes one way: nothing to over-travel |
| F6 | N/A | the sector holds the wheel to about 2° in the dwell: a positive lock, no detent |
| F7 | N/A | no adjustable length: the centre distance is set by the dowelled bridge, the entry by the mouth lead-ins |
| F8 | PASS | AUTO / HAND · a felt in every slot end brushing the roller; oil sinks on the roller bridges |
| F9 | PASS | HAND · station dots 1 to 4 on the locking plate, an index line on the base |
| F10 | N/A | hand operated: no motor, belt or sensor to protect |
| M1 | PASS | AUTO · edge breaks on every top face |
| M2 | PASS | HAND · four lobe windows take about 19% of the slot plate's area, 8 mm from every working surface |
| M3 | PASS | AUTO · bore entry chamfers on every seat and through hole |
| M4 | PASS | AUTO / HAND · countersinks for strip, segment, join and cap screws; counterbored base corners and post screws |
| M5 | PASS | AUTO / HAND · windows R3, slot ends full radius, the locking opening has no inside radius under 2 mm |
| M6 | PASS | AUTO · edge distance and walls clean |
| M7 | PASS | HAND · the bridge arms run into the pivot boss; the opening's inside corners are the swept shape, radius 2 mm or more |
| M8 | PASS | AUTO · undercuts on every thread that meets a shoulder |
| M9 | PASS | AUTO / HAND · M3 roller stud into the knob insert over 12 mm; axle M6 through the base to a nyloc; standard lengths |
| M10 | PASS | AUTO / HAND · hard-anodised plates, steel crank, hardened strips and segment, bronze washers, phenolic knob |
| M11 | PASS | AUTO · centre holes and chamfered ends on the studs and axles |
| M12 | PASS | HAND · every head reachable from above or below; strip screws through the locking plate's wedges; bearings pressed out past their circlips |
| M13 | PASS | AUTO / HAND · threadlocker on every screw, nyloc on the studs and axles, the knob threadlocked |
| M14 | PASS | HAND · wear strips on every slot wall; the locking arc is a replaceable hardened segment on 4 x M3 on the crank |
| V1 | N/A | hand operated (manual input): no motor |
| V2 | N/A | hand operated: no bracket |
| V3 | N/A | hand operated: no belt |
| V4 | N/A | hand operated: no drive detail |
| V5 | PASS | HAND · manual: the knob on the roller stud turns the crank; no stop, it turns fully; the page says hand operated |
| V6 | N/A | hand operated: no motor, no sensor |
| L1 | PASS | STYLE · lint-style clean |
| L2 | PASS | HAND · the polish carries geometry, roles, marks and materials only |
| L3 | PASS | HAND · crank and knob driver, plates output, rollers link, hardware hw |
| L4 | PASS | HAND / STYLE · accent on the input knob only |
| L5 | PASS | AUTO / HAND · screws, bearings, studs and the roller are real solids in real holes |
| L6 | PASS | AUTO · depth order right at plan, 28°, side and explode |
| L7 | PASS | STYLE · tilt 0° to 88°, no shear |
| L8 | PASS | AUTO / HAND · station dots and the base index line are timing marks |
| R1 | PASS | HAND · the polish reuses H.lockingSegment, H.window, H.wearStrip, H.felt, H.roller and the rules' bridges; nothing standard is drawn inline |
| R2 | PASS | HAND · threads M2, M3, M4, M5, M6, M8; joints Ø 4, 8, 10; two bearing sizes and one roller |
| R3 | PASS | AUTO · bridges from their subassembly |
| R4 | PASS | AUTO · package built at build time, 25.8 KB |
| R5 | PASS | HAND · states only what differs; rules 0.3 s, polish a few ms; the locking opening is swept once at 720 poses |
| R6 | PASS | FLAG · browser bench at DPR 1.5: plan 3.2, 28° 3.2, side 2.2, explode 3.0 ms at full detail, setup 11.8 ms; the 8 ms target is met at full detail |
| R7 | PASS | HAND · model.ts + polish.ts 19.7 KB |
| R8 | PASS | AUTO / SITE · pre-rendered thumbnails; the stage draws on change only |
| DL1 | PASS | AUTO / HAND · every solid and mark on a rung; the polish moves nothing |
| DL2 | PASS | HAND · default dial full |
| DL3 | PASS | AUTO · DL-D drawn when exploded, DL-B skipped at side elevation |
| DL4 | PASS | SITE · adaptive dial and the detail entry in the title block |
| DL5 | PASS | FLAG · rung counts and frame times in the detail ladder below |
| Q1 | PASS | check, clamp and edge distance clean |
| Q2 | PASS | 0 clashes |
| Q3 | PASS | package written, 25.8 KB; site build and site tests pass |
| Q4 | PASS | plan, 28°, side, explode at 28° and 70°, both sheets, overlays on |
| Q5 | PASS | browser bench at DPR 1.5, 2026-10-19; no flags |
| Q6 | PASS | every row judged |
| Q7 | PASS | conformance: internal-geneva at 2.6, pass |

## Joints
| Joint | Type | F1 locate | F2 retain | F3 torque | F4 thrust | F5 limit | F6 hold | F7 adjust | F8 lube | F9 timing | F10 protect |
|---|---|---|---|---|---|---|---|---|---|---|---|
| pO | J1 | 2 x spigot | Internal circlip DIN 472, Ø19; Bearing F6800ZZ (10x19x5); External circlip DIN 471, Ø10 | – the crank turns on its bearing, nothing keyed | Circlip under the bearing sets the height, the sleeve to the bridge carries the crank | – turns fully | – the sector holds the wheel, not the crank | – the dowelled bridge sets the centre distance | – sealed bearing | – crank and plate marks, see pP | – none needed |
| pP | J3 | – no removable plate on the stud | External circlip DIN 471, Ø4; Roller stud Ø4, collar Ø6.5, M3 thread, circlip groove | – the knob clamps the stud on the crank | Spacer sleeve 4.2x6.5 | – the slot ends lie beyond the roller's deepest point | – held by the locking sector in the dwell | – the mouth lead-ins take the entry tolerance | 4 x Felt oiler, oil-soaked wool felt; Track roller Ø7.9 on Ø4 stud, sealed | – phase fixed by the stud's position on the crank | – none needed |
| pR0 | J1 | 2 x spigot | Internal circlip DIN 472, Ø16; Bearing F688 (8x16x5) | – the roller turns on its bearing, nothing keyed | Thrust washer 8.2x10.8, bronze | – turns with the plate | – held by the plate's weight and the locking sector | – none: the plate floats on its three rollers | Bridge over the pivot, on two spigoted posts | – the plate's station dots | – none needed |
| pR1 | J1 | 2 x spigot | Internal circlip DIN 472, Ø16; Bearing F688 (8x16x5) | – the roller turns on its bearing, nothing keyed | Thrust washer 8.2x10.8, bronze | – turns with the plate | – held by the plate's weight and the locking sector | – none: the plate floats on its three rollers | Bridge over the pivot, on two spigoted posts | – the plate's station dots | – none needed |
| pR2 | J1 | 2 x spigot | Internal circlip DIN 472, Ø16; Bearing F688 (8x16x5) | – the roller turns on its bearing, nothing keyed | Thrust washer 8.2x10.8, bronze | – turns with the plate | – held by the plate's weight and the locking sector | – none: the plate floats on its three rollers | Bridge over the pivot, on two spigoted posts | – the plate's station dots | – none needed |
| pO-bridge-post | post | 2 x spigot | – screwed from both sides | – static | – static | – static | – static | – spigot in a slot takes the hole tolerance | – static | – static | – static |
| pR0-bridge-post | post | 2 x spigot | – screwed from both sides | – static | – static | – static | – static | – spigot in a slot takes the hole tolerance | – static | – static | – static |
| pR1-bridge-post | post | 2 x spigot | – screwed from both sides | – static | – static | – static | – static | – spigot in a slot takes the hole tolerance | – static | – static | – static |
| pR2-bridge-post | post | 2 x spigot | – screwed from both sides | – static | – static | – static | – static | – spigot in a slot takes the hole tolerance | – static | – static | – static |
| drive | drive | – no bracket | – knob threadlocked on the roller stud | Handle knob Ø14, accent ring | – turns freely | – the crank turns fully | – hand holds | – none | – belt-free | – no flag | – hand operated: no motor, belt or sensor |
| pW-join | post | 2 x Dowel pin Ø4 h6 (ISO 8734) | Countersunk M4 x 16 (ISO 10642) | – the plates turn as one | – 4 spacer sleeves keep the 4 mm gap | – static | – static | – static | – static | Station dots 1 to 4 on the locking plate, index line on the base | – static |

## Variants and overrides
| Joint or part | Rule result | Chosen | Why |
|---|---|---|---|
| pP | J3 shoulder bolt with a bearing in the knob | roller stud with collar, circlip and spacer, M3 end into the threaded knob | the roller sits under the crank in the slot plate; the rules cannot read a roller in the plate's one big opening as a slot |
| slot plate | plain opening | slots relieved 1.5 mm behind 8 hardened wear strips on 16 x M2 csk, a felt in each slot end, 4 lobe windows (19%) | M14, F8, M2 |
| crank | one piece | locking arc as a screwed, hardened segment (H.lockingSegment) | M14 |
| locking plate | none | second plate in the crank's plane, opening cut from the crank's sweep 1 mm clear, joined by 4 spacers, 4 csk M4 and 2 dowels | the locking sector must lie in the crank's plane (no shaft may cross the wheel plane); A11, F1 |
| hung pivot bridge | rule bridge over the rule's own pin head | lowered 7.5 mm onto the knob once the rule's bolt is dropped | the bridge cleared a head that is no longer there |
| roller flange and cap | none | flange under the plate and retaining ring over it, as the internal gear pair; the ring's bore clears the bearing flange (R9.1) | F2, F4 |
| input | belt drive to a live shaft | manual: knob on the roller stud | a motor needs a shaft from the base at the crank axis, through the wheel |

## Detail ladder
| Rung | Solids | Marks | Frame ms at this dial position |
|---|---|---|---|
| DL-A | 8 | 0 | 3.4 |
| DL-B | 0 | 237 | 2.6 |
| DL-C | 0 | 0 | 2.5 |
| DL-D | 23 | 0 | 2.5 |
| DL-E | 4 | 17 | 2.4 |
| DL-F | 0 | 0 | 2.3 |
| DL-G | 0 | 0 | 2.1 |
| DL-H | 31 | 0 | 1.8 |
| never | 153 | 117 | 3.6 (full) |

## Promotion candidates
Hand fixes that should become rules or primitives.

- A pin in one big opening of a plate (a Geneva slot plate whose slots open into a central hole): classify would need to
  read radial slots cut into a hole's boundary, so J4 (roller, strips, felts) came for free. Done by hand here.
- A driven input on a hung pivot: the drive rule needs a live shaft rising from the base, so a crank carried from a bridge
  can only be hand operated. A belt or gear transfer from a base shaft to a pulley at bridge height would lift that.
- `retainerPlate` caps over a ring on a flanged bearing: the cap's bore must clear the bearing flange (R9.1 for the
  F688). The internal gear pair's caps (bore R8.6, flange R8.96) share 0.1 mm of height with that flange; the
  clearance test skips pairs on one body, so it does not see it.
- The envelope of a swept part as a plate's opening (the locking plate here): a `lockOpening`-style helper in `src/core`
  if a second mechanism needs one.

## Verification
check: clean · clearance: 0 clashes · clamp: clean · edge distance: clean · package: 25.8 KB
screenshots: plan, 28°, side, explode at 28° and 70°, both sheets (dist/shots) · bench: browser, DPR 1.5, 2026-10-19; 28° frame 3.2 ms at full detail, setup 11.8 ms
