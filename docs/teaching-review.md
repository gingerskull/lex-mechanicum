# Mechanism teaching review (2026-10-19, updated for 0.24.0)

The library's original teaching review, kept as an engineering record. It judged the 2.5D models of 0.20.0 to
0.24.0, whose `model.ts` files are gone since the 3D rebuild. Its decisions were carried into the rebuild issues
(#212 to #218), each record's `teaching` block and the audits; Appendix C of `docs/mechanism-standard.md` gives each
kind of decision its requirement id. Its method is now the standard's T2, which every conformance pass runs. This
file is not updated: later verdicts go in the record and the audit's `teaching:` line.

**The question:** does each mechanism's arrangement, proportions and motion teach its core principle the way textbooks, Wikipedia animations and 507 Mechanisms show it? Real-world context is out of scope.

**Method:** All 60 mechanisms in the repo were reviewed: 45 at 0.20.0, the 11 added in 0.21.0 and the 4 added in 0.22.0 to 0.24.0 (sections below). None of the earlier mechanisms changed in those releases. For each one, six phases were rendered in plan view with the site's own renderer, the catalogue text and `model.ts` were read, and `solve()` was run to check the claimed numbers (strokes, ratios, straightness, dwell).

**Result:** 26 keep, 25 tweak and 9 rethink across all 60 (the original 45: 23 / 17 / 5; 0.21.0's 11: 2 / 6 / 3; 0.22.0 to 0.24.0's 4: 1 / 2 / 1). Most of the numbers in the text are correct. The problems come from what the drawing hides or makes too small.

## Patterns that recur

1. **Fixed hardware covers the principle.** Bridges, hangers and opaque plates from the polish stage sit on top of the defining parts, or look like extra links. This affects:
   - Scott Russell: the bridge hides the crank O–M.
   - Elliptic trammel: the rod runs under the cross plate.
   - Oldham: the output hub covers the disc and its tongues.
   - Rhombic drive: the guides cover the rhombus.
   - Double-crank and antiparallelogram: the O4 bridge reads as a third arm.
   - Scissor lift: the ground bridge reads as a wrong-length scissor bar.
   - Geneva: a bar crosses the wheel.
   - Cam, intermittent gear, Hart, Whitworth and oscillating cylinder are affected in the same way.
   - Added in 0.22.0 to 0.24.0: lever escapement (the bridges cover the pallet stones) and desmodromic cam (the bridges cover both lobes).
   - Added in 0.21.0: face-groove cam, Schmidt coupling, star wheel, cycloidal drive (flange over the disc), Wankel (rotor web over the gears), non-circular gears and sun-and-planet.

   **Suggested global rule:** parts that carry the principle are always drawn on top. Frame bridges either stay outside the swept area or are drawn ghosted, as frame.
2. **The wrong point is traced.** The trace should show the phenomenon:
   - Double-crank: show B's uneven progress.
   - Planetary: trace a point on a planet, which draws the cycloid.
   - Intermittent gear: trace a point on the driven gear (stop and go).
   - Drag-link: trace both crank circles, A and B.
   - Hart: also trace g's input circle.
   - Watt: draw the whole figure eight.
3. **The effect is too small to see.**
   - Offset slider-crank: the time ratio is 1.09, so it looks the same as the plain slider-crank.
   - Whitworth: the 14 mm offset of O2 from O3 is hidden.
   - Stephenson six-bar: it is meant to show a dwell but has none.
   - Cam: it has no dwell at all.
4. **Construction geometry is missing.** Textbook figures teach with these lines:
   - Ackermann: wheel axis lines meeting at the turning centre.
   - Offset slider-crank: the two dead-centre lines.
   - Crank-shaper: the lever's tangent lines and the cut and return arcs.

## Rethink (needs a different representation)

| Mechanism | Problem | Proposal |
|---|---|---|
| **Five-bar** | A gear pair couples the two cranks into one input. The tip just runs along a 47 mm line, which any four-bar can do. The principle (two inputs reach any x-y point) is lost. The text says ±30° cranks and a 62 × 59 mm loop. | Drop the gears. Drive the tip round a closed shape by inverse kinematics, as the pantograph does, so both cranks visibly move on their own. Optionally outline the reachable workspace. |
| **Ackermann steering** | There are no wheels, axis lines or turning centre. You see two levers turning by different amounts (29.7° against 24.7°) with nothing to explain why. The catalogue's own note asks for the axis lines. | Add a wheel on each knuckle, dashed axis lines and the rear-axle line, so they visibly meet near one point. Shorten the wheelbase so that point is on the plate, and lengthen the 30 mm arms so the trapezoid reads. |
| **Elliptic trammel** | The rod runs under the opaque cross plate. The two blocks look like independent slides, and the ellipse is faint. | Use the canonical layout: the rod on top, with the blocks pinned up into it and the pen at its end. Drive from above, or drive block X directly. Fallback: make the groove plate an outline. |
| **Oldham coupling** | The output hub is a solid disc that hides the floating disc and both crossed tongues, which are the whole point. | Make the output hub a slotted bar or yoke, or an outline, so the disc, both tongues and both slots show at once. Draw the disc centre's orbit (diameter e, at twice shaft speed) as a full circle. |
| **Intermittent gear** | The locking plate and disc sit under the gears, so in plan it looks like an ordinary gear pair. A diamond bridge covers the mesh. | Use the textbook single-plane form. The driven wheel has tooth groups separated by concave locking arcs, and the driver has its teeth plus a convex locking rim. Move the bridge off the mesh and trace a point on the driven gear. |

## Tweak (same arrangement, a change that matters for teaching)

**Walschaerts valve gear** is close to a rethink. Without the locomotive, the linkage still reads as the standard textbook diagram, and that part is right. But the die is fixed at 0.8 forward (`model.ts:26`), so the animation cannot show what makes this gear worth teaching: moving the die changes cut-off and reverses the engine, while the lead stays constant. The catalogue's plot spec asks for several die settings, but the code plots one.

Proposal: slowly sweep the reverser across cycles (+0.8 → 0 → −0.8), or add a die slider. Show ghost valve traces for +1, 0 and −1 so the variable part reads against the constant lap-and-lead part.

| Mechanism | Change |
|---|---|
| Cam-follower | Use the textbook rise, dwell, return, dwell profile (120/60/120/60, h 22; pressure angle about 23°). Move the bridge off the cam face. Fix the metadata, which says "Dwell" and "Harmonic" although the motion is cycloidal with no dwell. |
| Stephenson six-bar | It is meant to demonstrate a dwell, but the output just rocks 54° with ordinary reversal. Re-synthesise it as the classic dwell six-bar: a coupler curve with a near-circular arc, the dyad length equal to that arc's radius, and D at its centre, giving 60–90° of visible standstill. Enlarge the tiny 20 mm crank. |
| Double-rocker | The output reverses partway through each input swing (133° → 106° → 136°), so it reads as a double wobble. Re-proportion so the output extremes coincide with the input toggles, mark the toggles, and trace B. |
| Offset slider-crank | The time ratio of 1.09 is invisible. Use e about 40 with l about 90 (r 30), which gives about 1.28. Draw the two dead-centre lines through O. |
| Whitworth | O2 is hidden under the hub. Mark O2 and draw the crank line O2–A. Raise e from 14 to about 20, giving a 2:1 ratio. Optionally draw the chord that splits the cut and return arcs. |
| Drag-link quick return | It reads as five bars piled round one spot. Trace A and B (two full circles round two centres) instead of E and D. Drop the counterweight lobe so the two ground pivots read. |
| Double-crank | Trace B with equal-time ticks so the 0.5× to 2× speed variation shows. De-emphasise the O4 bridge. |
| Antiparallelogram | De-emphasise the O4 bridge so the crossed bowtie reads. Optionally show the second ellipse, which makes the elliptical-gear link explicit. |
| Oscillating cylinder | The ports, which are the point ("the swing is the valve"), are hidden under the cylinder. Show the port face in cutaway and highlight the open port. Slim the trunnion strap. |
| Rhombic drive | The rails on top hide the rhombus. Put the guides outboard or underneath. The text says about 70° phase lag; the measured value is 64°. |
| Hart inversor | Cut the swing from ±80° to about ±65°, because the bars flatten into a bundle at the ends. Trace g's circle as well as p's line, as Peaucellier does. Slim the hanger that covers CE. |
| Scott Russell | The bridge over O hides the crank O–M at both ends of the stroke. Route it away. (`motion.axes` says "Same line"; input and output are actually perpendicular.) |
| Watt linkage | The text promises the figure eight but only the straight part is drawn. Add the full lemniscate as a dashed ghost, or drop the claim. |
| Planetary | Trace a point on planet 0, as the catalogue notes say, instead of the planet centre, which only draws a plain circle. |
| Geneva | The large windows in the wheel and a bar across it make the wheel read as a lattice. Use a solid slotted disc with clear locking arcs. |
| Scissor lift | Shorten or move the ground bridge that reads as a wrong-length bar. |

## Added in 0.22.0 to 0.24.0 (4 mechanisms)

**Rethink**

| Mechanism | Problem | Proposal |
|---|---|---|
| **Desmodromic cam** | What you can see looks the same as a spring-return valve. The valve lies horizontal along the top, with both rockers side by side turning the same way. The camshaft bridge and two rocker hangers cover the opening lobe and both shoe contacts. The valve moves only 10 mm in a scene about 250 mm wide, over 120° of cam, so four of the six frames show it closed. The model drives both directions correctly, but the driven closing can't be seen. | Use the standard side view: camshaft on top and the valve vertical below it. The opening rocker pushes down on the stem tip, and a forked closing rocker under the collar pulls up. Draw the two lobe profiles clearly distinct, with nothing over the lobes or shoes, and highlight whichever rocker is carrying the load. Use a longer rise and return (about 90° each) or a bigger lift relative to the scene. |

**Tweak**

| Mechanism | Change |
|---|---|
| Lever escapement | The V-shaped wheel bridge runs straight over the pallet stones, the lever bridge covers the lever and horns, and the balance rim covers the fork and impulse pin. You can't see the stones meeting the teeth, which is the whole show. Also, the balance swings ±270° and the pin is in the fork for only about 5% of the cycle, so each tick goes by in a blink. Keep the stones, horns, fork and pin clear of hardware, and draw the balance as a thin rim. Make the engagement at least 15% of the cycle, either by cutting the swing to ±90–120° or by slowing time near the centre. The text says the wheel moves only while the lever flips; in fact a third of one beat is a drop after the lever has banked. Say "unlock, impulse, drop". |
| Anchor escapement | The tick sequence is there and the wheel is stop-go (12° per period), but at ±3° of swing the pallets move about 2.6 mm, so the six frames look almost identical. The recoil on one beat is 0.26° (0.2 mm). The pendulum points up, which reads as an inverted pendulum. Hang the pendulum down past the wheel, as every textbook figure does. Exaggerate the swing to about ±6–8°, re-fitting the pallets and possibly using 20–24 teeth, so the drop and recoil show at several mm. Aim for an even recoil of at least 1.5° on both pallets; the text's "about 1°" holds on only one beat. |

**Keep:** internal Geneva. The wheel turns the same way as the crank, it moves for 270° of crank turn (five of six frames, against one for the external Geneva), and its peak speed is a gentle 0.41× against about 2.4× for the external one. That contrast reads well. Optionally make the crank bridge an outline so the locking sector shows during the dwell.

## Added in 0.21.0 (11 mechanisms)

**Rethink**

| Mechanism | Problem | Proposal |
|---|---|---|
| **Ravigneaux** | Only first gear is shown, with the carrier held. Every gear spins on a fixed axis, so it is an ordinary gear train: nothing orbits and only one ratio appears. The large sun (on top) completely hides the small sun, which is the input. Six pinion bridges crowd the view. The text describes ratio selection by brakes, which the animation never shows. | Animate a gear in which the carrier turns. Second gear works: hold the large sun, and the carrier runs at about 0.45 and the ring at 0.649 of the input, so the pinions orbit and spin. Ideally cycle through 1st, 2nd, 3rd and reverse, since that is the principle. Make the small sun visible (large sun as an outline) and reduce the bridges to one carrier outline. |
| **Sprag clutch** | Both races, the spider and all 16 sprags turn together as one rigid body, so nothing moves relative to anything else. Neither lock nor freewheel is shown, and the spider covers most of the sprags. The sprags are stadium shapes rather than figure-eights. Their drawn grip angle (about 10–14°) would slip by the text's own rule (below 5.7°). | Use the textbook view: an enlarged sector with 3–5 figure-eight sprags between two race arcs, with nothing over them. For the first half of the cycle the inner race drives, the sprags stand up and lock, and the outer race follows. For the second half the inner race reverses, the sprags lean and slide, and the outer race stays still. Plot outer speed against inner speed. |
| **Schmidt coupling** | Three opaque discs of radius 53, with centres only 50–60 apart, overlap so much that you can't tell them apart. The output disc on top hides most of link set B, and a bridge over it looks like a moving part. You can't see either teaching point: the parallel links in each set, or all three discs keeping the same orientation. The kinematics are correct. | Draw the discs as see-through rings, each with one bold index mark, so three parallel marks turn together. Draw the two link sets in distinct tones, on top. Trace the midpoint of one link, which draws a circle while the link never turns. Optional: slowly vary the offset while it runs, since the text's main benefit is exactly that. |

**Tweak**

| Mechanism | Change |
|---|---|
| Cycloidal drive | The lobes are about 4 mm deep on a 100 mm disc (eN/R = 0.48), so the disc reads as nearly round and the wobble can't be seen. The output flange covers it. Raise e to about 3.5–3.8 (or use N = 10 with e = 4), as textbook animations do. Put the flange underneath or draw it as an outline. Trace a point on the disc instead of the hidden 2 mm eccentric circle, as the catalogue asks. |
| Non-circular gears | At e = 0.3 the ellipses are 95% round, so they read as round gears mounted off-centre. Use e of about 0.5 with fewer, coarser teeth, and move the bridge off the mesh. Add the speed-ratio plot the catalogue promises; the code plots only the output angle. |
| Star wheel | The snap isn't a snap. The finger pushes the star 22.8°, then the star waits past the jumper's crest (which is physically impossible), then drifts to 36° over 30° of driver. Hand the star to the jumper at the crest (18°) and snap it over about 5–8° of driver. Clear the bridge off the teeth and crop or scale up the mechanism, which sits small in one corner. The leaf spring sticks out past the base plate, which looks like a build bug. The exported `pushed` value (36°) is wrong; the push is 22.8°. |
| Face-groove cam | The follower arm covers the roller in its groove, which is the one contact that shows the cam is form-closed. End the arm in a fork at the roller or draw it see-through, and show which wall is carrying the load. The "groove push" arrow points sideways (`model.ts:111`); it should follow the groove normal. |
| Wankel | The rotor web hides the fixed gear and the eccentric, so the 3:1 relation can't be seen. Put the web underneath or draw it as an outline. Draw the eccentric crank line O–E and trace E instead of apex A0, whose trace only redraws the bore. |
| Sun-and-planet | The link that holds the planet in mesh is under the gears and invisible. Bring it to the top. Add a mark on the sun or flywheel so "two turns per orbit" can be counted. |

**Keep:**
- Internal gear pair. Optionally add a mark on the ring so its slow turn in the same direction reads.
- Flat-faced cam. The contact point's sweep across the face is shown well.

## Keep (23 of the original 45)

Four-bar, parallelogram, bell crank, Watt six-bar, pantograph, slider-crank, Scotch yoke, eccentric sheave, crank-shaper, toggle clamp, locomotive drive, spur gears, gear train, rack and pinion, ratchet and pawl, Chebyshev, Hoekens, Roberts, Evans, Peaucellier, Tusi couple, Jansen, Klann.

Small optional improvements:
- Crank-shaper: draw the tangent lines.
- Toggle clamp: add a workpiece block.
- Ratchet: use more solid pawl shapes.
- Tusi: use bolder tracers, or a bar from X to Y.
- Parallelogram: trace both coupler ends.
- Bell crank: add moment-arm dimensions.

## Text that doesn't match the motion (small fixes)

- **Hoekens:** `output_character` lists "Dwell" but there is none. The tip speed varies about 21% on the straight run.
- **Watt six-bar:** it has an unadvertised near-dwell (within 1° for 51° of crank rotation), which is worth mentioning.
- **Evans:** "O2 at the middle of B's travel" is inaccurate.
- **Tusi:** the build spec says Y is "90° round" from X; the model uses the opposite tooth.
- **Ackermann:** the text says ±40°; the model swings −30° to +40°.
- **Double-rocker:** the text says the output range is 105.6–146.2°; it actually reaches only 136.3°.
