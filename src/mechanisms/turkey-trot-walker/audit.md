# Audit: Turkey trot walker (turkey-trot-walker)
standard: 3.13 · date: 2026-11-04 · result: pass · detail: full · pass: build
teaching: tweak · decisions in the record

## Summary
PASS 162 · FAIL 0 · N/A 7 · open: none

## Requirements
| Id | Status | Evidence / action |
|---|---|---|
| S1 | PASS | DATA · standard 3.13 carries its version header and changelog, P14 included |
| S2 | PASS | HAND · header standard 3.13, date, result, detail and the teaching line written by this pass |
| S3 | PASS | AUTO · filled by the generator: the pipeline holds it for every built mechanism |
| S4 | PASS | SITE · issue #279 holds only this mechanism's decisions and open items; the seasonal plan's decisions are in #263 |
| S5 | PASS | SITE · no engine mark on the page or card |
| S6 | PASS | AUTO · filled by the generator: the pipeline holds it for every built mechanism |
| P1 | PASS | DATA · record v3 complete (kin and teaching blocks); polish3.ts, audit.md present |
| P2 | PASS | DATA · facets from the controlled vocabularies; the catalogue validates |
| P3 | PASS | DATA / SITE · ratio Stroke (94.7 mm stride and 42.5 mm step from a 25 mm crank, belt 188.4 mm per turn), motion Rotary to Path, Continuous and Non-uniform, plane Spatial, backdrivable Partly, four other names, family Linkage, level Advanced, dof 1, motorised |
| P4 | PASS | DATA · tags grouped as function, property and application, ten keywords underneath |
| P5 | PASS | DATA · explain motion, forces, benefits, limits; four invented uses with one line each, as P14 allows |
| P6 | PASS | DATA · a seasonal mechanism links nothing (P14): no references, media or real_world; three generated-image prompts take their place |
| P7 | PASS | HAND / SITE · the polish names geometry, materials, groups and joint notes only; all prose and teaching labels come from the record |
| P8 | PASS | SITE · no parts list, build section or joint sections on the page |
| P9 | PASS | AUTO / HAND · every number in explain is a claim (stance 94.7 mm, lift 42.5 mm, dip 4.0 mm, drum twice per turn, knife and fork 24 mm, fan 120° to 165°, belt 0.82 mm per degree and 0.54 mm forward at the change); the uses' 30 rpm, one step a second and 285 km in five weeks agree with 188.4 mm per turn; the record's notes now describe the fan's rod in the feathers' own slots and the toes 9 mm under the ankle pin, as built |
| P10 | PASS | HAND · the near foot's path with the comet and 15° ticks, the far foot traced, the CHANGE OF FEET line where the body is lowest, plot of both feet's heights with the body's lift |
| P11 | PASS | DATA · plain language, short sentences, no em dashes, mm and degrees |
| P12 | PASS | AUTO / DATA · record v3 validates: catalogue and kin-check clean |
| P13 | PASS | HAND · teaching review T2 run on the record before the build and recorded in teaching.review (tweak, 2026-11-03) |
| P14 | PASS | HAND / DATA · a seasonal record (season: Thanksgiving (US), fourth Thursday in November; duty Commercial): invented uses, themed scenery and labels, festive carving on the body, feathers, rails and keepers; no links, three generated-image prompts; the kinematics and every check hold |
| K1 | PASS | AUTO · K1 residual 1.1e-13 (tolerance 1e-9) over 360 samples, reference 6.0e-14 |
| K2 | PASS | AUTO · check: finite, continuous, periodic over 360 samples |
| K3 | PASS | AUTO / HAND · 27 blocks (walker, cam-rocker, carry, slider-dyad, slot-swing); no numeric fallback · walker block (new, src/kin/steps/walker.ts, its contact kits in src/builder/rules/contacts/walker.ts) for the two Klann legs, the body on its slide, the lower foot and the belt; cam-rocker, carry, slider-dyad and slot-swing for the fan and the cutlery; closed form, no numeric fallback |
| K4 | PASS | HAND · roles: crank driver with the accent, Klann links, toes and feet as outputs, the belt and drums driven, carriages and fan outputs; base, column, treadmill frame and slide block ground |
| K6 | PASS | DATA · crank 25, A (-22.2, 52.5), B (-55.4, -17.4), CE 55.9, BE 32.7, HK 77.4, AH 43.8, drums 14.99 mm (belt travel over 4π), carriage cranks 12 with rods 44 and 70, cam rise 6 mm, as build.defining_relations states |
| K7 | PASS | DATA · drivers input (rotary) · input rotary on the crank shaft O |
| K8 | PASS | AUTO / DATA · every joint declared with type, bodies, origin and axis: the legs' pins, the body's slide S, the soles Tn and Tf as planar contacts on the belt, the flat belt BT, the drums, the cutlery slides, the cam K, the slot pins Q and Q1 to Q21, the fan's pivots P1 to P21 |
| K9 | PASS | DATA · one rotary driver, a control |
| K10 | PASS | AUTO / DATA · E and H close on the library record's branches, held over the cycle; the lower foot decides the body's height and the belt, declared in the walker block |
| K11 | PASS | AUTO · mobility counted -14, dof 1 |
| K12 | PASS | DATA · points F, Ff, P, Sp, fanL, fanR and the spreader's guide named; body lift, both feet, foot path, belt travel and speed, drum ratio, both carriages, fan spread and cam pressure are outputs |
| T1 | PASS | HAND · the Klann leg and the body riding on whichever foot is lower read first; the belt, the cutlery and the fan second; the turkey, the carving and the cutlery are the seasonal scenery the waiver allows (P14) and never cover the legs |
| T2 | PASS | HAND · review tweak 2026-11-03 (reference pose at the change of feet, toes 9 mm under the ankle pin, drum radius for an exact 2:1, the fan's rod through slots in the feathers' tails); six phases looked at again on the finished build in FRONT at 0, 60, 120, 180, 240 and 300 degrees of the cycle: each foot runs back flat on the belt and swings forward high, the feet change where the body is lowest, the knife and the fork lunge in turn and the fan spreads twice a turn; the verdict holds |
| T3 | PASS | DATA · principle: both legs' crank, connector, lower and upper rockers, leg and toes, points F and Ff |
| T4 | PASS | DATA · fired: trace-marks (2 solids) · the near foot carries the comet and 15° ticks, the far foot traced as well |
| T5 | PASS | DATA · the CHANGE OF FEET line joins the two feet at the body's lowest pose |
| T6 | PASS | HAND / DATA · a 94.7 mm stance and a 42.5 mm lift read at the default size; the 4.0 mm dip is small on the drawing and is carried by the plot's BODY curve and the change-of-feet line |
| T7 | PASS | DATA · VIEW 322 22: from the near flank, a little behind and above, so both legs, the belt, the fan and the cutlery read together; the shot set includes it |
| T8 | PASS | DATA · section fan-drive, cut through the body's middle: the two-lobe cam, its roller and the lever to the spreader, highlighted; drawn in both sheets |
| T9 | PASS | AUTO / DATA · claim table: 10 ok, 0 off, 0 uncheckable of 10 |
| T10 | PASS | AUTO · 41 solids drawn see-through: body-bandN, body-bandF, body-shellN21, body-shellF21, body-shellN25, body-shellF25, body-shellN28, body-shellF28 · filled by the generator: a rule built solids for it |
| T11 | PASS | AUTO · 1 support routed, 1 moved off a sweep · filled by the generator: a rule built solids for it |
| T12 | PASS | HAND · 23 support solids; dropped by the polish: Q-stud, Q-roller, Q-wear0, Q-wear1, Q-felt, Q1-stud, Q1-roller, Q1-wear0, Q1-wear1, Q1-felt, Q2-stud, Q2-roller, Q2-wear0, Q2-wear1, Q2-felt, Q3-stud, Q3-roller, Q3-wear0, Q3-wear1, Q3-felt, Q4-stud, Q4-roller, Q4-wear0, Q4-wear1, Q4-felt, Q5-stud, Q5-roller, Q5-wear0, Q5-wear1, Q5-felt, Q6-stud, Q6-roller, Q6-wear0, Q6-wear1, Q6-felt, Q7-stud, Q7-roller, Q7-wear0, Q7-wear1, Q7-felt, Q8-stud, Q8-roller, Q8-wear0, Q8-wear1, Q8-felt, Q9-stud, Q9-roller, Q9-wear0, Q9-wear1, Q9-felt, Q10-stud, Q10-roller, Q10-wear0, Q10-wear1, Q10-felt, Q11-stud, Q11-roller, Q11-wear0, Q11-wear1, Q11-felt, Q12-stud, Q12-roller, Q12-wear0, Q12-wear1, Q12-felt, Q13-stud, Q13-roller, Q13-wear0, Q13-wear1, Q13-felt, Q14-stud, Q14-roller, Q14-wear0, Q14-wear1, Q14-felt, Q15-stud, Q15-roller, Q15-wear0, Q15-wear1, Q15-felt, Q16-stud, Q16-roller, Q16-wear0, Q16-wear1, Q16-felt, Q17-stud, Q17-roller, Q17-wear0, Q17-wear1, Q17-felt, Q18-stud, Q18-roller, Q18-wear0, Q18-wear1, Q18-felt, Q19-stud, Q19-roller, Q19-wear0, Q19-wear1, Q19-felt, Q20-stud, Q20-roller, Q20-wear0, Q20-wear1, Q20-felt, Q21-stud, Q21-roller, Q21-wear0, Q21-wear1, Q21-felt, O-1-brg, O-1-brg-balls, O-1-brg-cage, O-2-brg, O-2-brg-balls, O-2-brg-cage, O-3-brg, O-3-brg-balls, O-3-brg-cage, O-0-sp, O-1-sp, O-2-sp, O-bolt-wsh, O-bolt, O-bolt-s1, O-bolt-s2, O-bolt-head, RR-0-sp, RR-1-sp, RR-axle, RR-pb-b0-foot, RR-pb-b0, RR-pb-b0-brg, RR-pb-b0-brg-balls, RR-pb-b0-brg-cage, RR-pb-b0-cl0, RR-pb-b0-cl1, RR-pb-b0-col0, RR-pb-b0-col1, RR-pb-b0-sc0, RR-pb-b0-sc0-sh, RR-pb-b0-dw0, RR-pb-b0-sc1, RR-pb-b0-sc1-sh, RR-pb-b0-dw1, RR-pb-b1-foot, RR-pb-b1, RR-pb-b1-brg, RR-pb-b1-brg-balls, RR-pb-b1-brg-cage, RR-pb-b1-sc0, RR-pb-b1-sc0-sh, RR-pb-b1-dw0, RR-pb-b1-sc1, RR-pb-b1-sc1-sh, RR-pb-b1-dw1, RF-k0-key, RF-tw, RF-sp0, RF-housing, RF-hb0, RF-hb0-balls, RF-hb0-cage, RF-hb1, RF-hb1-balls, RF-hb1-cage, RF-hcl0, RF-hcl1, RF-hww, RF-hsc0, RF-hsc0-sh, RF-hsc1, RF-hsc1-sh, RF-hsc2, RF-hsc2-sh, RF-hdw0, RF-hdw1, RF-ew, RF-es, RF-es-sh, RF-axle, KA-1-brg, KA-0-sp, KA-bolt-wsh, KA-bolt, KA-bolt-s1, KA-bolt-s2, KA-bolt-head, P1-bolt-wsh, P1-bolt, P1-bolt-s1, P1-bolt-s2, P1-bolt-head, O-sp2, FS-riser1 · the support solids the polish leaves out are named in teaching.exceptions with their reasons: the rear drum's pillow blocks and the front drum's cartridge housing (the carved rails are the bearing housings) and the fork slide's inner riser (one block under both inner rails); the rest dropped by the polish is hardware it replaces (the slot kits' rollers, studs, wear strips and felts; the pin stacks of O, RR, RF, KA and P1) |
| T13 | N/A | DATA · no feature goes by in a blink: the change of feet is marked by its overlay and the plot |
| T14 | PASS | HAND / DATA · the crank driver is the only control; at fixed controls the turn repeats |
| T15 | PASS | HAND · labels NEAR FOOT, FAR FOOT, BODY and CHANGE OF FEET: mechanics, with the seasonal names the waiver allows |
| T16 | PASS | HAND / STYLE · the two legs are told apart by stacking, the near one in front, the far one behind the body; the knife and the fork by their own shapes |
| T17 | PASS | AUTO · filled by the generator: the pipeline holds it for every built mechanism |
| T18 | PASS | HAND / DATA · fired: focus (no solids) · no part to watch named: the legs the sheet is about are large; the fan drive inside the body has its own section view |
| D1 | PASS | HAND · fired: wheels (no solids) · links tapered with bosses round every pin, the crank and the return crank arms with bosses, drums turned, the cam a profile with its zero line |
| D2 | PASS | HAND · bosses round every pin; the leg's long bar carries the foot load to its two rocker pins; the arm runs from the sleeve into the rump's web |
| D3 | PASS | STYLE · STYLE: roles by pattern and tone |
| D4 | PASS | AUTO · fired: base (3 solids), feet (4 solids) · filled by the generator: a rule built solids for it |
| D5 | PASS | AUTO / HAND · the body on one keyed sleeve on a flanged column, the treadmill on its two carved rails and turned legs, the cutlery on one slide block with a single riser block under both inner rails; the motor face-mounted on three standoffs inside the body, the one place a moving body leaves it (V1 to V3 exception) |
| D6 | PASS | HAND / STYLE · the decoration sits on the scenery only (body shells, head, feathers, rails, keepers) as the seasonal waiver asks, and drops first on the detail ladder; the legs stay plain and in front |
| D8 | PASS | AUTO / HAND · every part a profile, an operation and a frame: links and plates extruded across their pin axes, the legs of the treadmill and the column turned, the shells extruded in layers |
| D9 | PASS | AUTO / HAND · fired: j12-cvt (no solids) · the flat belt is one band round the drums whose marks are conveyed with the drums' turn; nothing else changes shape |
| D10 | PASS | AUTO · filled by the generator: the pipeline holds it for every built mechanism |
| D11 | PASS | AUTO · SOLID: 0 of 463 solids unsound |
| D7 | PASS | HAND · the mechanism's parts carry only load shape; the carving is on the scenery, as P14 allows |
| A1 | PASS | AUTO · Cn J3, En J3, Bn J3, Kn J3, Hn J3, An J3, Fn J3, Cf J3, Ef J3, Kf J3, Hf J3, Ff J3, FA J3, KB J3, FB J3, G J3, R J3, KS J5, FS J5, S column, BT flat-belt, Tn sole, Tf sole, O J2, RR J2, RF J2, KA J3, Q J4, Q1 J4, Q2 J4, Q3 J4, Q4 J4, Q5 J4, Q6 J4, Q7 J4, Q8 J4, Q9 J4, Q10 J4, Q11 J4, Q12 J4, Q13 J4, Q14 J4, Q15 J4, Q16 J4, Q17 J4, Q18 J4, Q19 J4, Q20 J4, Q21 J4, K J7, P1 J3, drive drive · filled by the generator: the pipeline holds it for every built mechanism |
| A2 | PASS | AUTO · Cn J3, En J3, Bn J3, Kn J3, Hn J3, An J3, Fn J3, Cf J3, Ef J3, Kf J3, Hf J3, Ff J3, FA J3, KB J3, FB J3, G J3, R J3, KS J5, FS J5, S column, BT flat-belt, Tn sole, Tf sole, O J2, RR J2, RF J2, KA J3, Q J4, Q1 J4, Q2 J4, Q3 J4, Q4 J4, Q5 J4, Q6 J4, Q7 J4, Q8 J4, Q9 J4, Q10 J4, Q11 J4, Q12 J4, Q13 J4, Q14 J4, Q15 J4, Q16 J4, Q17 J4, Q18 J4, Q19 J4, Q20 J4, Q21 J4, K J7, P1 J3, drive drive · filled by the generator: the pipeline holds it for every built mechanism |
| A3 | PASS | AUTO · fired: classify (78 solids), axial stack builder · filled by the generator: a rule built solids for it |
| A4 | PASS | AUTO · fired: j1-dead-axle (no solids), axial stack builder · stepped shafts throughout: the live crank and drum shafts D-flat with end washers and countersunk screws, the knife's crank pin stepped Ø5/Ø3 and threaded, the fan's stud and the spreader's rod grooved for their circlips, shoulder bolts at the pins |
| A5 | PASS | AUTO · fired: j2-live-shaft (no solids), j10-shaft-in-plan (54 solids), axial stack builder · filled by the generator: a rule built solids for it |
| A6 | PASS | AUTO · fired: j5-slide (31 solids), j13-compliant (no solids), standoffs (12 solids) · filled by the generator: a rule built solids for it |
| A7 | PASS | AUTO · fired: base (3 solids), posts (no solids), feet (4 solids) · filled by the generator: a rule built solids for it |
| A8 | PASS | AUTO · fired: fasteners (30 solids) · filled by the generator: a rule built solids for it |
| A9 | PASS | AUTO / HAND · fired: column-slide (7 solids), placement solver · double shear at Bn and An (the rockers either side of the body), the crank shaft in a bearing in either shell and each drum in a bearing in either rail; single shear only where a link sweeps over its pin, with shoulder bolts on bearings; the fork's return crank on the knife's pin (owner's decision, 4 Nov) |
| A10 | PASS | HAND · fired: placement (129 solids), placement solver · the placement solver's slabs: the two legs on either flank, the cutlery cranks and rods in their own lanes beyond the near rail, parts whose sweeps never meet sharing a slab; nothing stacked only to clear something |
| A11 | PASS | AUTO / HAND · fired: j12-flexible (no solids), strap-sheave (no solids), j1-dead-axle (no solids) · legs: bolts, bearings, the body's web, the sleeve, the column, its flange, base; drums: shafts, bearings in eccentric bushings in the rails, turned legs, base; carriages: rails and gibs, the risers, base; fan: stud, post, web; every housing screwed and dowelled |
| A12 | PASS | AUTO · clamp check clean |
| A13 | PASS | AUTO / HAND · 452 solids, 202 unnamed (further items of a listed set) · named hardware: bearings 683 to 688, shoulder bolts Ø3 to Ø5, M2.5 to M5 screws, set screws, circlips, Ø3 to Ø16 shafts, springs, the motor, pulleys, belt, lead, ties, clip and terminal block; unnamed rows are further items of a named set |
| A14 | PASS | AUTO / HAND · fired: support router · router least gap 1.5 mm; 3D clearance 0 clashes over 72 phases; the builder's headroom notes (heads 3.5 to 4.25 mm 'from' the body) are taken in the body's reference frame and do not follow its motion against the cranks, and the 3D check finds nothing there |
| A15 | PASS | AUTO · clearance in 3D over 72 phases: 0 clashes; hand allow: 0 named, 0 unnecessary |
| A16 | PASS | HAND · 52 joint notes; no note: none; no badge: none · joint notes with badges; the polish's notes for O, RR, RF (eccentric bushings), KA (return crank), P1 (fan post), Q, Q1 to Q21 and K (spring) and the drive (slotted screws, home flag and sensor, lead) describe what is built |
| A17 | PASS | HAND · order: the web with its arm, motor, fan drive and crank shaft; each flank's shells as one cover screwed through its rim into the band, so the fan drive, the crank shaft's inner parts and the motor's screws are reached with a cover off; the legs on their bolts, the fan on its stud, the body onto its column; the treadmill on its legs, the drums in their eccentric bushings; every bearing pressed out of its shell, rail or bushing |
| A18 | PASS | AUTO · placement: 22 slabs in the tallest stack (212.0 mm), 0 clevises; stack per joint in the Joints table · filled by the generator: the pipeline holds it for every built mechanism |
| A19 | PASS | AUTO · 1 support routed (1 moved), least gap 1.5 mm; still covering a principle part, drawn see-through: none · the router moved the rear drum's pillow block off a sweep; the polish then holds both drums in the carved rails instead (J10, T12 exception in the record); nothing left covering a principle part |
| A20 | PASS | AUTO · support per joint: RR pillow · the selector chose a pillow block for RR; the record's exception replaces it by bearings in the carved rails, the front drum's in eccentric bushings |
| A21 | PASS | AUTO · kit per joint: Cn J3, En J3, Bn J3, Kn J3, Hn J3, An J3, Fn J3, Cf J3, Ef J3, Kf J3, Hf J3, Ff J3, FA J3, KB J3, FB J3, G J3, R J3, KS J5, FS J5, S column, BT flat-belt, Tn sole, Tf sole, O J2, RR J2, RF J2, KA J3, Q J4, Q1 J4, Q2 J4, Q3 J4, Q4 J4, Q5 J4, Q6 J4, Q7 J4, Q8 J4, Q9 J4, Q10 J4, Q11 J4, Q12 J4, Q13 J4, Q14 J4, Q15 J4, Q16 J4, Q17 J4, Q18 J4, Q19 J4, Q20 J4, Q21 J4, K J7, P1 J3, drive drive |
| A22 | PASS | AUTO · fired: stops (no solids), adjustable-length (no solids), cable-clip (no solids) · the cable-clip rule finds no lead of its own here (the motor is in the body); promotion candidates listed: a drive in a moving body with its slack-loop lead, live shafts in a moving frame, sprung joints between two moving parts |
| E1 | PASS | AUTO · every solid has one explode level; levels 0 to 39.73 · filled by the generator: the pipeline holds it for every built mechanism |
| E2 | PASS | AUTO · fired: explode (1 solid) · filled by the generator: a rule built solids for it |
| E3 | PASS | AUTO · fired: explode (1 solid) · filled by the generator: a rule built solids for it |
| E4 | PASS | HAND · the covers, the props and the fan come off first, then the legs off their bolts, the shafts out of their bearings, the body off its column, the carriages off the slide block and the drums out of the rails |
| E5 | PASS | AUTO · fired: explode (1 solid) · filled by the generator: a rule built solids for it |
| E6 | PASS | AUTO · fired: explode (1 solid) · filled by the generator: a rule built solids for it |
| E7 | PASS | AUTO · fired: explode (1 solid) · filled by the generator: a rule built solids for it |
| E8 | PASS | AUTO · fired: explode (1 solid) · filled by the generator: a rule built solids for it |
| E9 | PASS | HAND · full explode readable in both sheets: each prop and each cover leaves whole, nothing inside another part, nothing leaves the frame |
| E10 | PASS | AUTO · fired: explode (1 solid) · filled by the generator: a rule built solids for it |
| J1 | N/A | AUTO · fired: trunnion (no solids), hub (no solids), j1-dead-axle (no solids) · filled by the generator: no joint of this type |
| J2 | N/A | AUTO · fired: j2-live-shaft (no solids) · filled by the generator: no joint of this type |
| J3 | PASS | AUTO · fired: j3-moving-pin (203 solids), cross-bearings (no solids), oblique-journal (no solids), eccentric-bearing (no solids), spider-pin (no solids), ball-socket (no solids), ring-hub (no solids), eccentric (no solids) · filled by the generator: a rule built its kit |
| J4 | PASS | AUTO · fired: pin-hole (no solids), j4-slot-roller (132 solids), pin-lobe (no solids), fork-pin (no solids), die (no solids) · filled by the generator: a rule built its kit |
| J5 | PASS | AUTO · fired: tongue-slot (no solids), integrator-carriage (no solids), piston-bore (no solids), j5-slide (31 solids), leg-bore (no solids), column-slide (7 solids) · filled by the generator: a rule built its kit |
| J6 | N/A | AUTO · fired: j6-mesh (no solids), friction-contact (no solids), ring-carrier (no solids), pin-ring (no solids), ring-rollers (no solids) · filled by the generator: no joint of this type |
| J7 | PASS | AUTO · fired: ball-socket (no solids), groove-cam (no solids), j7-cam (1 solid), pallet-contact (no solids), pawl-tooth (no solids), sole-pad (4 solids) · filled by the generator: a rule built its kit |
| J8 | PASS | AUTO · fired: j12-flexible (no solids), j8-belt (no solids), flat-belt (2 solids) · filled by the generator: a rule built its kit |
| J9 | N/A | AUTO · fired: j9-crossed-mesh (no solids) · filled by the generator: no joint of this type |
| J10 | PASS | AUTO · fired: j12-cvt (no solids), j10-shaft-in-plan (54 solids), j11-screw (no solids) · filled by the generator: a rule built its kit |
| J12 | PASS | AUTO · fired: j12-flexible (no solids), j12-cvt (no solids), j12-other (no solids), strap-sheave (no solids), flat-belt (2 solids) · filled by the generator: a rule built its kit |
| J13 | N/A | AUTO · fired: j13-compliant (no solids) · filled by the generator: no joint of this type |
| J11 | N/A | AUTO · fired: j11-screw (no solids) · filled by the generator: no joint of this type |
| F1 | PASS | AUTO · served at KS, FS, S; fired: bend-slots (no solids), posts (no solids), integrator-carriage (no solids), j2-live-shaft (no solids), j10-shaft-in-plan (54 solids), ring-carrier (no solids), pin-ring (no solids), hub (no solids), strap-sheave (no solids), j13-compliant (no solids), covers (no solids) · filled by the generator: a rule built solids for it |
| F2 | PASS | AUTO · served at Cn, En, Bn, Kn, Hn, An, Fn, Cf, Ef, Kf, Hf, Ff, FA, KB, FB, G, R, KS, FS, Tn, Tf, O, RR, RF, KA, P1; fired: wheels (no solids), j12-flexible (no solids), j2-live-shaft (no solids), j10-shaft-in-plan (54 solids), cross-bearings (no solids), oblique-journal (no solids), trunnion (no solids), ring-carrier (no solids), eccentric-bearing (no solids), pin-ring (no solids), spider-pin (no solids), fork-pin (no solids), ring-hub (no solids), eccentric (no solids), hub (no solids), leg-bore (no solids), ring-rollers (no solids), strap-sheave (no solids), j11-screw (no solids), j13-compliant (no solids), covers (no solids) · filled by the generator: a rule built solids for it |
| F3 | PASS | AUTO · served at Cn, En, Bn, Kn, Hn, An, Fn, Cf, Ef, Kf, Hf, Ff, FA, KB, FB, G, R, S, O, RR, RF, KA, P1; fired: j12-flexible (no solids), j2-live-shaft (no solids), j10-shaft-in-plan (54 solids), column-slide (7 solids), j11-screw (no solids) · filled by the generator: a rule built solids for it |
| F4 | PASS | AUTO / HAND · served at Bn, An; fired: j9-crossed-mesh (no solids), j2-live-shaft (no solids), j10-shaft-in-plan (54 solids), trunnion (no solids), spider-pin (no solids), j11-screw (no solids) · shim washers set each shoulder bolt's end-shake, inner-race spacers at Bn and An; the live shafts clamped through inner-race spacers between their bearings; the fan's stack between the post and a washer and circlip |
| F5 | PASS | AUTO / HAND · served at no joint; fired: integrator-carriage (no solids), j5-slide (31 solids), pawl-tooth (no solids), j11-screw (no solids), j13-compliant (no solids), stops (no solids) · a stop collar on the column's top limits the body's rise, just outside its 4 mm travel; the carriages, the fan and the legs are driven both ways by their cranks and the cam and cannot over-travel |
| F6 | PASS | AUTO / HAND · served at K; fired: friction-contact (no solids), j12-flexible (no solids), j12-cvt (no solids), trunnion (no solids), j7-cam (1 solid), pallet-contact (no solids), pawl-tooth (no solids) · the toes kept level by a torsion spring on each ankle pin; the cam roller held up on the cam by the fan's weight and a torsion spring round the lever's pivot, which the weight alone does not do within about 10° of each lobe's tip; a felt pad under the belt keeps it from coasting between steps |
| F7 | PASS | AUTO / HAND · served at KS, FS, RF, drive; fired: bend-slots (no solids), j6-mesh (no solids), friction-contact (no solids), j9-crossed-mesh (no solids), j12-flexible (no solids), j12-cvt (no solids), j5-slide (31 solids), j12-other (no solids), adjustable-length (no solids), covers (no solids) · gib strips on both slides; the front drum's bearings in eccentric bushings tension the treadmill's belt; the motor's screws in slots tension the GT2 belt |
| F8 | PASS | AUTO · served at KS, FS, S; fired: tongue-slot (no solids), j12-flexible (no solids), cross-bearings (no solids), ball-socket (no solids), eccentric (no solids), leg-bore (no solids), column-slide (7 solids), j11-screw (no solids), lubrication (no solids) · filled by the generator: a rule built solids for it |
| F9 | PASS | AUTO / HAND · served at K; fired: j6-mesh (no solids), j9-crossed-mesh (no solids), timing-marks (4 solids) · zero line on the cam; the cranks and the cam keyed on one D-flat shaft keep their phase; the knife's disc keyed on the rear shaft and the fork's return crank clamped on its pin |
| F10 | PASS | AUTO / HAND · served at drive; fired: j12-flexible (no solids), drive (no solids) · flanged pulleys on both shafts; a home flag on the crank shaft's pulley, read by a fork sensor on a block screwed to the web (owner's decision, 4 Nov) |
| M1 | PASS | AUTO · fired: hardware primitives · top-face edges chamfered by the primitives |
| M2 | PASS | HAND · bosses round every loaded hole; no wheel that starts and stops needs arms |
| M3 | PASS | AUTO · fired: j3-moving-pin (203 solids), hardware primitives · filled by the generator: a rule built solids for it |
| M4 | PASS | AUTO / HAND · fired: base (3 solids), fasteners (30 solids) · counterbores and countersinks for the heads; countersunk end screws on the live shafts and the covers' rim screws |
| M5 | PASS | AUTO / HAND · fired: hardware primitives · slots full-radius ended, the motor's screw slots and the riser block's corners filleted |
| M6 | PASS | AUTO · edge distance and walls clean |
| M7 | PASS | HAND · the links, cranks and arms run tangent into their bosses; the riser block and the slots filleted |
| M8 | PASS | AUTO · fired: j1-dead-axle (no solids) · thread undercuts on the stepped shafts and the knife's crank pin |
| M9 | PASS | AUTO / HAND · fired: j1-dead-axle (no solids) · ISO coarse threads, lengths from the series |
| M10 | PASS | AUTO / HAND · 424 of 452 solids name a material · materials named: the scenery in carved and painted lime wood and walnut, the cutlery in blunted steel with rosewood handles, by the polish; the rest by the rules; the unnamed are the kinematic bodies' own parts, as on every sheet of the library, the pulleys' flanges and the motor's faint core |
| M11 | PASS | AUTO · fired: j1-dead-axle (no solids), hardware primitives · centre holes, chamfered ends and flats on the turned shafts |
| M12 | PASS | HAND · every screw reachable by its key with a cover or a prop off; bearings pressed out of their shells, rails and bushings |
| M13 | PASS | AUTO / HAND · 48 threaded · threadlocker or nyloc on every threaded fastener (the rules' defaults); the set screws threadlocked |
| M14 | PASS | AUTO / HAND · fired: tongue-slot (no solids), piston-bore (no solids), pin-hole (no solids), j4-slot-roller (132 solids), pin-lobe (no solids), groove-cam (no solids), pallet-contact (no solids), eccentric (no solids), die (no solids), hub (no solids), leg-bore (no solids), sole-pad (4 solids) · bronze gib strips on the slides and rubber sole pads, replaceable; the fan's rod runs dry in the feathers' own slots, the J4 exception (no room for a liner in a feather's tail) |
| V1 | PASS | AUTO · fired: drive (no solids) · the standard pancake motor Ø50 x 18 and a GT2 32:16 belt; it sits in the body, not under the base, because the crank shaft turns in the moving body (polish exception) |
| V2 | PASS | AUTO · fired: drive (no solids) · no bracket: the motor's face on three standoffs screwed through slots in the web, the one solid mount the moving body offers (polish exception) |
| V3 | PASS | AUTO / HAND · fired: drive (no solids) · belt and pulleys between the web and the motor, clear of the far shells (pocketed) and everything moving; clearance 0 |
| V4 | PASS | AUTO · fired: j8-belt (no solids) · flanged pulleys, belt in one plane, the motor's screws slotted for the belt's tension |
| V5 | PASS | AUTO · fired: drive (no solids) · rotary input: belt to the crank shaft's pulley |
| V6 | PASS | AUTO · fired: drive (no solids), cable-clip (no solids) · a home flag on the input (the crank shaft's pulley) and a fork sensor on a block screwed to the web; the sensor's lead joins the motor's on the web, out through the arm, a slack loop for the 4 mm bob and down the column in two ties, through the base to a terminal block on its rear edge, one P-clip under the base (owner's decisions, 4 Nov) |
| L1 | PASS | STYLE · STYLE: no look values in the record or polish; the carving's line styles and fill spacing are global (src/style) |
| L2 | PASS | HAND · the record and polish carry geometry, roles, materials and groups only |
| L3 | PASS | HAND · roles right: crank driver, legs links, toes and carriages output, frame the base, column and treadmill |
| L4 | PASS | HAND / STYLE · accent on the crank only |
| L5 | PASS | AUTO / HAND · fired: see-through (60 solids) · the body's band and shells and the treadmill's rails drawn see-through where they hide a principle part |
| L6 | PASS | AUTO · filled by the generator: the pipeline holds it for every built mechanism |
| L7 | PASS | STYLE · STYLE: turntable orbit, named views |
| L8 | PASS | AUTO / HAND · fired: trace-marks (2 solids) · carving, chevrons, hatching and the CARVE marks drawn as fine ink marks on their faces; trace marks on the feet |
| L9 | PASS | AUTO / DATA · the fan-drive section cuts and hatches the body and the parts it meets |
| L10 | PASS | AUTO / STYLE · overlays in the sheet's look |
| R1 | PASS | HAND · parts from the builder's kits and primitives; the decoration through the shared pieces and patterns |
| R2 | PASS | HAND · a few bearing sizes (683, 684, 688, 693), M2.5 to M5 screws, Ø3 to Ø16 shafts, GT2 32:16 |
| R3 | PASS | AUTO · fired: hardware primitives · shared subassemblies from the rules and primitives |
| R4 | PASS | AUTO · package v2 71.4 KB · filled by the generator: the pipeline holds it for every built mechanism |
| R5 | PASS | HAND · the polish states the exceptions listed at its top, with no sampling |
| R6 | PASS | FLAG · FLAG: bench on the desktop: frames 1.2 to 1.5 ms paced (under 8 ms), the GPU 1.4 to 2.0 ms and 11.4 ms in the full explode; setup 26.2 ms, over the 20 ms target, first frame 312 ms; the phone is measured by the owner · FLAG: bench on the desktop: frames 1.25 to 1.6 ms paced (under 8 ms), the GPU 1.4 to 2.0 ms and 12.5 ms in the full explode; setup 24.1 ms, over the 20 ms target, first frame 318 ms; the phone is measured by the owner |
| R7 | PASS | HAND / FLAG · polish 593 lines (53.1 KB); 152 solids added, 189 overrides by the polish · the polish is over the plan's 30 lines and is a promotion candidate (A22); the candidates are listed in the audit's Promotion candidates, and their promotion is planned in issue 281 (owner's decision, 4 Nov) |
| R8 | PASS | AUTO / SITE · SITE: thumbnails and cards pre-rendered |
| R9 | PASS | AUTO / SITE · SITE: one context, edges in the worker |
| R10 | PASS | FLAG · FLAG: the phone bench page is the owner's to run |
| DL1 | PASS | AUTO / HAND · 162 of 452 solids on a dropping rung · every solid on a rung by kind and role; the decoration (ornament pieces, carve marks) on DL-A, so it drops first; nothing moved on the ladder |
| DL2 | PASS | HAND · default dial full |
| DL3 | PASS | AUTO · filled by the generator: the pipeline holds it for every built mechanism |
| DL4 | PASS | SITE · SITE: adaptive dial |
| DL6 | PASS | AUTO · filled by the generator: the pipeline holds it for every built mechanism |
| DL5 | PASS | FLAG · FLAG: rungs and frame times in the bench report and the Detail ladder table |
| Q1 | PASS | check, clamp and edge distance clean |
| Q2 | PASS | 0 clashes, 0 unnecessary allows |
| Q3 | PASS | package v2 written, 71.0 KB; site build not checked here · package v2 written; the site build runs at PR time with the thumbnails (the page needs LM_SEASON=open out of season) |
| Q4 | PASS | local: tools/shot · shot set drawn in both sheets (record view, PLAN, FRONT, SIDE, ISOMETRIC, the fan-drive section, full explode) and the six phases in FRONT, looked at by eye against the concept |
| Q5 | PASS | local: tools/bench · bench run; flags in R6 |
| Q6 | PASS | every requirement judged · regenerated, every hand row judged; R7 judged by hand, the polish being over the plan's 30 lines (a promotion candidate, A22) |
| Q7 | PASS | whole-library conformance run at standard 3.13 with this pass |
| Q8 | PASS | teaching review: tweak (2026-11-03); the six phases of the finished build are looked at by eye · teaching review tweak recorded in the record and on the teaching line; the six phases of the finished build looked at again |

## Joints
| Joint | Kit | Block | Support | Stack | F1 locate | F2 retain | F3 torque | F4 thrust | F5 limit | F6 hold | F7 adjust | F8 lube | F9 timing | F10 protect |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Cn | J3 | walker | – | – | none | Shoulder bolt Ø5 x 10, M4 (ISO 7379) | Shoulder bolt Ø5 x 10, M4 (ISO 7379) | none | none | none | none | none | none | none |
| En | J3 | walker | – | – | none | Shoulder bolt Ø4 x 30, M3 (ISO 7379) | Shoulder bolt Ø4 x 30, M3 (ISO 7379) | none | none | none | none | none | none | none |
| Bn | J3 | walker | – | – | none | Shoulder bolt Ø5 x 90, M4 (ISO 7379) | Shoulder bolt Ø5 x 90, M4 (ISO 7379) | Inner-race spacer 5.2x8.9 | none | none | none | none | none | none |
| Kn | J3 | walker | – | – | none | Shoulder bolt Ø5 x 20, M4 (ISO 7379) | Shoulder bolt Ø5 x 20, M4 (ISO 7379) | none | none | none | none | none | none | none |
| Hn | J3 | walker | – | – | none | Shoulder bolt Ø4 x 25, M3 (ISO 7379) | Shoulder bolt Ø4 x 25, M3 (ISO 7379) | none | none | none | none | none | none | none |
| An | J3 | walker | – | – | none | Shoulder bolt Ø5 x 160, M4 (ISO 7379) | Shoulder bolt Ø5 x 160, M4 (ISO 7379) | Inner-race spacer 5.2x8.9 | none | none | none | none | none | none |
| Fn | J3 | walker | – | – | none | Internal circlip DIN 472, Ø7; Shoulder bolt Ø3 x 8, M2.5 (ISO 7379) | Shoulder bolt Ø3 x 8, M2.5 (ISO 7379) | none | none | none | none | none | none | none |
| Cf | J3 | walker | – | – | none | Shoulder bolt Ø5 x 10, M4 (ISO 7379) | Shoulder bolt Ø5 x 10, M4 (ISO 7379) | none | none | none | none | none | none | none |
| Ef | J3 | walker | – | – | none | Shoulder bolt Ø4 x 30, M3 (ISO 7379) | Shoulder bolt Ø4 x 30, M3 (ISO 7379) | none | none | none | none | none | none | none |
| Kf | J3 | walker | – | – | none | Shoulder bolt Ø5 x 20, M4 (ISO 7379) | Shoulder bolt Ø5 x 20, M4 (ISO 7379) | none | none | none | none | none | none | none |
| Hf | J3 | walker | – | – | none | Shoulder bolt Ø4 x 25, M3 (ISO 7379) | Shoulder bolt Ø4 x 25, M3 (ISO 7379) | none | none | none | none | none | none | none |
| Ff | J3 | walker | – | – | none | Internal circlip DIN 472, Ø7; Shoulder bolt Ø3 x 8, M2.5 (ISO 7379) | Shoulder bolt Ø3 x 8, M2.5 (ISO 7379) | none | none | none | none | none | none | none |
| FA | J3 | slider-dyad | – | – | none | Shoulder bolt Ø3 x 10, M2.5 (ISO 7379) | Shoulder bolt Ø3 x 10, M2.5 (ISO 7379) | none | none | none | none | none | none | none |
| KB | J3 | – | – | – | none | Internal circlip DIN 472, Ø7; Shoulder bolt Ø3 x 6, M2.5 (ISO 7379) | Shoulder bolt Ø3 x 6, M2.5 (ISO 7379) | none | none | none | none | none | none | none |
| FB | J3 | – | – | – | none | Internal circlip DIN 472, Ø7; Shoulder bolt Ø3 x 6, M2.5 (ISO 7379) | Shoulder bolt Ø3 x 6, M2.5 (ISO 7379) | none | none | none | none | none | none | none |
| G | J3 | cam-rocker | – | – | none | Shoulder bolt Ø4 x 8, M3 (ISO 7379) | Shoulder bolt Ø4 x 8, M3 (ISO 7379) | none | none | none | none | none | none | none |
| R | J3 | – | – | – | none | Internal circlip DIN 472, Ø7; Shoulder bolt Ø3 x 8, M2.5 (ISO 7379) | Shoulder bolt Ø3 x 8, M2.5 (ISO 7379) | none | none | none | none | none | none | none |
| KS | J5 | – | – | – | 2 x Dowel pin Ø3 h6, reference rail to base | Keeper plate, laps the slider | none | none | none | none | Gib strip 3 x 6 x 45, bronze | Felt wiper in a steel clip; Grease nipple M6 (DIN 71412) | none | none |
| FS | J5 | – | – | – | 2 x Dowel pin Ø3 h6, reference rail to base | Keeper plate, laps the slider | none | none | none | none | Gib strip 3 x 6 x 45, bronze | 2 x Felt wiper in a steel clip; Grease nipple M6 (DIN 71412) | none | none |
| S | column | walker | – | – | Column flange Ø32, four M4 screws into the base | none | Key strip along the column's flat: the sleeve slides and does not turn | none | none | none | none | Bronze bushing 16x20x40, a keyway for the strip | none | none |
| BT | flat-belt | – | – | – | none | none | none | none | none | none | none | none | none | none |
| Tn | sole | – | – | – | none | Sole pad, natural rubber 1 mm, bonded: grips the belt | none | none | none | none | none | none | none | none |
| Tf | sole | – | – | – | none | Sole pad, natural rubber 1 mm, bonded: grips the belt | none | none | none | none | none | none | none | none |
| O | J2 | walker | – | – | none | 2 x End washer 3.2x9.5 x 1.5 | Crank shaft Ø8, live, D-flat: the cranks and the cam keyed on it | none | none | none | none | none | none | none |
| RR | J2 | walker | pillow (moved) | – | none | Set screw M3 (DIN 916), threadlocked: the disc on the shaft's flat, holding the stack at that end; End washer 3.2x9.5 x 1.5 | Rear drum's shaft Ø8, live, D-flat: the drum and the knife's crank disc keyed on it | none | none | none | none | none | none | none |
| RF | J2 | walker | – | – | none | 2 x End washer 3.2x9.5 x 1.5 | Front drum's shaft Ø8, live, D-flat | none | none | none | 2 x Eccentric bushing Ø20, 1 mm offset bore Ø16, flanged | none | none | none |
| KA | J3 | slider-dyad | – | – | none | shaft; Set screw M3 (DIN 916), threadlocked: clamps the return crank on the knife's crank pin | Knife's crank pin Ø5/Ø3, stepped, screwed into the knife's disc; the fork's return crank clamped on its outer end; Set screw M3 (DIN 916), threadlocked: clamps the return crank on the knife's crank pin | none | none | none | none | none | none | none |
| Q | J4 | slider-dyad | – | – | none | none | none | none | none | none | none | none | none | none |
| Q1 | J4 | slot-swing | – | – | none | none | none | none | none | none | none | none | none | none |
| Q2 | J4 | slot-swing | – | – | none | none | none | none | none | none | none | none | none | none |
| Q3 | J4 | slot-swing | – | – | none | none | none | none | none | none | none | none | none | none |
| Q4 | J4 | slot-swing | – | – | none | none | none | none | none | none | none | none | none | none |
| Q5 | J4 | slot-swing | – | – | none | none | none | none | none | none | none | none | none | none |
| Q6 | J4 | slot-swing | – | – | none | none | none | none | none | none | none | none | none | none |
| Q7 | J4 | slot-swing | – | – | none | none | none | none | none | none | none | none | none | none |
| Q8 | J4 | slot-swing | – | – | none | none | none | none | none | none | none | none | none | none |
| Q9 | J4 | slot-swing | – | – | none | none | none | none | none | none | none | none | none | none |
| Q10 | J4 | slot-swing | – | – | none | none | none | none | none | none | none | none | none | none |
| Q11 | J4 | slot-swing | – | – | none | none | none | none | none | none | none | none | none | none |
| Q12 | J4 | slot-swing | – | – | none | none | none | none | none | none | none | none | none | none |
| Q13 | J4 | slot-swing | – | – | none | none | none | none | none | none | none | none | none | none |
| Q14 | J4 | slot-swing | – | – | none | none | none | none | none | none | none | none | none | none |
| Q15 | J4 | slot-swing | – | – | none | none | none | none | none | none | none | none | none | none |
| Q16 | J4 | slot-swing | – | – | none | none | none | none | none | none | none | none | none | none |
| Q17 | J4 | slot-swing | – | – | none | none | none | none | none | none | none | none | none | none |
| Q18 | J4 | slot-swing | – | – | none | none | none | none | none | none | none | none | none | none |
| Q19 | J4 | slot-swing | – | – | none | none | none | none | none | none | none | none | none | none |
| Q20 | J4 | slot-swing | – | – | none | none | none | none | none | none | none | none | none | none |
| Q21 | J4 | slot-swing | – | – | none | none | none | none | none | none | none | none | none | none |
| K | J7 | cam-rocker | – | – | none | none | none | none | none | Torsion spring Ø10, wire 0.6: holds the cam roller up on the cam | none | none | Cam | none |
| P1 | J3 | slot-swing | – | – | none | External circlip DIN 471, Ø6 | Fan stud Ø6 h6, pressed into the post: every feather turns on it in its bushing | none | none | none | none | none | none | none |
| drive | drive | – | – | – | none | none | none | none | none | none | Countersunk M3 x 8 (ISO 10642) | none | none | Home flag, 1 mm steel vane; Fork sensor, slotted optical, 5 mm gap |

## Supports
| Support | Joint | Kind | Route | Least gap mm | Covers | T10 |
|---|---|---|---|---|---|---|
| RR-pb | RR | pillow | moved | 1.5 | – | – |

## Variants and overrides
| Joint or part | Rule result | Chosen | Why |
|---|---|---|---|
| A18, hand placement | the placement solver's positions | some axial positions set by hand in the record (`place`) | accepted by the owner: the two legs, the cutlery lanes and the fan's stack need positions the solver does not find; the stack span fix in `rules/stacks.ts` is scoped to placed parts on their joint's frame or on axes, so every other record builds as on main (owner's decisions, 4 Nov) |
| body, shells, head, feathers, rails, legs, cutlery | steel and aluminium | carved and painted lime wood, walnut, birch ply, blunted steel with rosewood handles | M10: the seasonal scenery is made as a carved wooden toy (polish) |
| carved pieces | each piece explodes as a part | each prop one explode unit; each flank's shells one cover | E2, E9: the carved pieces are glued to what they carry; the covers are screwed through their rims into the band so the inside can be reached (A17, M12) |
| feathers, keepers | no marks | quills, chevrons and hatched bands; CARVE and the stroke ends engraved on the keepers | P14 decoration (L8): festive marks on the scenery, which the seasonal waiver allows |
| fan drive (K, G, R, Q, Q1 to Q21) | a plate spreader with tail pins | the cam roller under the cam, the lever lifting a rod that runs in a straight slot in every feather's tail | accepted by the owner: a plate cannot reach the tail pins of 21 feathers stacked on one pivot (record's review) |
| P1 to P21 | a shoulder bolt threaded into the first feather | a Ø6 stud pressed into a walnut post out of the rump's web, each feather in a bushing, a washer and a circlip behind the last | J3: the body has no solid at the pivot, so the rules' bolt left the fan hanging behind the rump (fanPivot) |
| Q1 to Q21 | the J4 kit's stud, track roller, wear strips, felt and its wider roller cut | the rod straight in each feather's own slot, ending 2 mm past the last feather in a DIN 471 circlip | J4: the roller cut is wider than a feather's tail and would cut away all its material round the slot (fanSlots, rodEnd) |
| spreader | a rod carried crosswise between two moving bodies, unguided | a Ø4 guide rod pressed into the body's arm, through a bushed boss on the spreader's web | J5: the kit builds no guide for it |
| O | shoulder bolts on bearings at the crank pins | a live Ø8 D-flat shaft, the cranks and the cam keyed on it, in a bearing in the outer layers of either shell | A5, J2: the crank shaft turns in a moving frame, which the rules do not build as a live shaft |
| RR, RF | pillow blocks under the rear drum, a cartridge housing on the near rail | each drum's shaft in a bearing in either carved rail, the front drum's in eccentric bushings | J10, T12: the carved rails are the bearing housings, as in the concept (record, `teaching.exceptions`); F7: the eccentrics tension the belt |
| KA, FA | the fork's crank on its own shaft past the knife's rod | a return crank clamped on the knife's stepped crank pin; the rear shaft ends in the knife's disc, held by a set screw in its rim; the knife slide's front end 5 mm back | A9, J3, J5: owner's decision, 4 Nov; no shaft runs through the knife rod's plane (returnCrank) |
| toes' lugs | lugs rounded past the toe plate's mid-plane | clipped at the sole | L2: on a plate thinner than the boss the rule's web runs out under the sole and into the belt |
| Fn, Ff | plain pins | a torsion spring round each ankle pin's head, a tail on the toe plate and one pressed onto the leg | F5, F7: no rule builds a sprung joint between two moving parts; tails onto the leg by the owner's decision, 4 Nov |
| G, K | the follower held by its own linkage, nothing built | a torsion spring round the lever's pivot, anchored on a pin in the web | F6: the fan's weight alone lets the roller leave the cam within about 10° of each lobe's tip (leverSpring) |
| drive | the motor under the base on a slotted bracket, home flag and fork sensor | a pancake motor on three standoffs in the body's far cavity, screwed through slots in the web, belted 16T to 32T to the crank shaft; a home flag on the crank shaft's pulley, read by a fork sensor on a block screwed to the web | V1 to V3: the crank shaft turns in the moving body, so the drive rule finds no fixed live shaft; the flag and sensor by the owner's decision, 4 Nov (homeSensor) |
| motor and sensor leads | leads under the base | the sensor's lead joining the motor's on the web, out through the arm, a slack loop hanging down the column's side for the 4 mm bob, two ties, through the base to a terminal block on its rear edge, a P-clip under the base | V6: owner's decision, 4 Nov (motorLead) |
| KS, FS inner risers | two risers lapping 1.5 mm | one ground block under both inner rails | J5, T12: owner's decision, 4 Nov; the fork's riser named in `teaching.exceptions` (riserBlock) |
| slide wipers | felt wipers 1 mm off the carriages' ends | as the rule builds them | owner's decision, 4 Nov: any change belongs to the J5 rule, for the whole library |

## Detail ladder
| Rung | Solids | Marks | Frame ms at this dial position |
|---|---|---|---|
| DL-A | 60 | 1328 | 1.69 |
| DL-B | 0 | 370 | 1.72 |
| DL-C | 0 | 0 | 1.52 |
| DL-D | 59 | 0 | 1.49 |
| DL-E | 20 | 1 | 1.51 |
| DL-F | 0 | 0 | 1.58 |
| DL-G | 0 | 0 | 1.38 |
| DL-H | 29 | 0 | 1.46 |
| never | 295 | 466 | 1.99 |

## Promotion candidates
R7 is judged by hand: the polish is about 590 lines against the plan's 30, the first in the library over it, so it is
a promotion candidate (A22), its promotion planned in issue 281. The exceptions that would become rules or kits, each
its own PR: a live shaft in a moving frame (A5, J2); a drive in a moving body, with
its sensor, slotted face mount and a slack-loop lead to the base (V1 to V3, V6, F10); sprung joints between two moving
parts and a follower's return spring (F5, F6); bearings in a part that is its own housing, with an eccentric seat for a
belt's tension (J10, F7); one riser where two slides lap (J5); removable covers over a body's inside (A17); the J4
kit's cut and stud for a rod in the slots of thin plates; a post for a pivot behind a body (J3). Engine work of this
pass, in the library: the walker block (src/kin/steps/walker.ts) and its sole and flat-belt kits
(src/builder/rules/contacts/walker.ts); `LM_SEASON=open` for a local build.

## Verification
check: clean · K1 residual: 1.1e-13 · claims: 10 of 10 ok · clearance: 0 clashes · clamp: clean · edge distance: clean · package: 71.4 KB
screenshots: the shot set in both sheets (record view VIEW 322 22, PLAN, FRONT, SIDE, ISOMETRIC, section fan-drive, full explode) in dist/shots3/turkey-trot-walker, and the six phases in FRONT, looked at by eye against the concept sheet (out of the repository, in the pass's PR) ·
bench: desktop, frames at 28 deg 1.25 ms paced, explode 1.58 ms (GPU 12.5 ms), setup 24.1 ms (over the 20 ms target, a flag), first frame 318 ms
