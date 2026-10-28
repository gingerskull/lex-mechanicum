# Seasonal mechanism catalogue

Companion to the master catalogue (`data/catalog`): fictional mechanisms for holidays and special days, written to
the record spec (`data/catalog/record-spec.md`) so they can be filtered, compared and built in Lex Mechanicum
alongside the library. Each one is a real mechanism, with true kinematics, dressed for its occasion: an invented
name, story, uses and scenery.

Edition: autumn 2026, revised 28 October 2026. The year runs from 15 October 2026 to 14 October 2027. Six records are
complete in this edition; the rest are scheduled and listed with their working names.

## Contents

1. [How a seasonal record differs](#how-a-seasonal-record-differs)
2. [The year at a glance](#the-year-at-a-glance)
3. [Index by family](#index-by-family)
4. [Find by motion](#find-by-motion)
5. [Mechanisms](#mechanisms)
   - [Nosferatu crypt-lid quick-return](#nosferatu-crypt-lid-quick-return) · Halloween
   - [Plymouth straight-cut carving linkage](#plymouth-straight-cut-carving-linkage) · Thanksgiving
   - [Maccabee eight-night indexer](#maccabee-eight-night-indexer) · Hanukkah
   - [Drosselmeyer toggle jaw](#drosselmeyer-toggle-jaw) · Christmas
   - [Nguzo Saba seven-gear planetary](#nguzo-saba-seven-gear-planetary) · Kwanzaa
   - [Resolution ratchet with mid-January release](#resolution-ratchet-with-mid-january-release) · New Year

## How a seasonal record differs

A seasonal mechanism is a record v3 like any other (record spec) and is built by the conformance pass of the mechanism
standard (`docs/mechanism-standard.md`, section 1), to the current standard. This catalogue holds what the research
step gives: the prose, the facets and the design. The build pass writes the `kin` and `teaching` blocks from it. Only
the differences are listed here.

- **Fictional, on purpose.** The names, stories and uses are invented; the mechanics are real. A seasonal mechanism is
  a fictional mechanism under the standard's P14, which says what that lifts and what still holds: here, the text
  keeps its jokes and invented uses, and the model shows its themed scenery (a coffin, a soldier, a row of candles).
- **Festive decoration, unlike the library.** Where a library mechanism is plain, a seasonal one is decorated (P14):
  seasonally appropriate, festive and intricate, on its scenery and themed parts. Carved panels, mouldings, handles,
  turned legs and linings; figures made like a detailed wooden or moulded figurine, with real features and costume.
- **Room for interpretation.** Each record's *Interpretation and hand-crafted parts* lists what is particular to it:
  the themed scenery and its decoration, the hand-crafted components no rule makes (a floating sun, a stop short of
  dead centre, a bistable release) and the marks. They are suggestions for the pass, not a fixed design. Everything else comes from
  the rules; a hand-crafted part that departs from a rule is a polish exception with its reason (R7).
- **Generated images instead of links.** There is nothing real to link to, so a seasonal record has no `references`,
  `media` or `real_world`. In their place it carries 2 to 4 generated images of the mechanism in real life, made from
  the record's prompts: the mechanism at work in its invented setting. The stage draws the mechanism itself, so a
  prompt never asks for a drawing of it. The fields are in the record spec ("Seasonal records").
- **Three extra facets**, in a `season` block, beside the dates of each year's occurrence (record spec):

| Facet | Field | Values |
|---|---|---|
| Occasion | `season.occasion` | the holiday or special day the mechanism was developed for |
| Date rule | `season.date_rule` | how the date is found each year (fixed date, "fourth Thursday in November", lunar or lunisolar) |
| Festive duty class | `season.duty` | **Domestic** (one household, one season), **Community** (hall, school, congregation; daily use through the season), **Commercial** (retail and hospitality, opening hours for the whole season), **Municipal** (outdoors, public, unattended, weather and crowds) |

Duty is part of the story. Every class is built to the standard; a class may suggest a hand-crafted choice (sealed
bearings outdoors, a slot liner in commercial use).

Each complete record has: the summary and facet table; how it moves, forces, why use it and limits (`explain`); in
industry (`examples`, invented); build (the `build` prose, plus the members, joints and parameters the build pass
writes as `kin`); teaching suggestions (for the teaching review, T2); interpretation and hand-crafted parts; generated
images; and related mechanisms (ids from the master list).

## The year at a glance

Chronological from the start of the edition. **Major** occasions get a full record first; special days follow in later
editions. Dates of lunar and lunisolar holidays are the expected dates for the 2026 to 2027 cycle and can move by a day
with local sighting or custom.

| Date | Occasion | Tier | Mechanism (working name) | Concept | Record |
|---|---|---|---|---|---|
| 31 Oct 2026 | Halloween | Major | [Nosferatu crypt-lid quick-return](#nosferatu-crypt-lid-quick-return) | Crank and slotted lever: the lid creaks open over two-thirds of a turn and slams in the last third | **Complete** |
| 1 to 2 Nov | Día de los Muertos | Major | Ofrenda tiered scissor lift | Three-stage scissor lift raising the altar tiers in sequence, marigold garland kept taut by a constant-length cable | Scheduled |
| 5 Nov | Bonfire Night | Special day | Catherine-wheel escapement | A verge-type escapement that lets a pinwheel advance in measured bursts rather than all at once | Scheduled |
| 8 Nov | Diwali | Major | Rangoli hypotrochoid drawing engine | Planetary pen carrier that lays down rangoli rosettes in coloured powder, ratio sets the petal count | Scheduled |
| 26 Nov | Thanksgiving (US) | Major | [Plymouth straight-cut carving linkage](#plymouth-straight-cut-carving-linkage) | Twin Hoekens linkages give a level knife a straight saw stroke and a lift-out return | **Complete** |
| 27 Nov | Black Friday | Special day | Doorbuster turnstile | Bistable over-centre gate that admits exactly one shopper per half-turn, regardless of pressure | Scheduled |
| 4 to 12 Dec | Hanukkah | Major | [Maccabee eight-night indexer](#maccabee-eight-night-indexer) | Eight-slot Geneva driving a rack: one candle station per night, right to left | **Complete** |
| 21 Dec | Winter solstice | Special day | Solstice sun-sight cam | Barrel cam that tracks the noon sun's height through the year; the follower dwells at the solstices | Scheduled |
| 25 Dec | Christmas | Major | [Drosselmeyer toggle jaw](#drosselmeyer-toggle-jaw) | Nutcracker whose coat-tail lever drives the jaw through a toggle, force rising toward dead centre | **Complete** |
| 26 Dec to 1 Jan | Kwanzaa | Major | [Nguzo Saba seven-gear planetary](#nguzo-saba-seven-gear-planetary) | Sun and six planets, seven gears in all, sharing the load equally on a carrier called the kinara | **Complete** |
| 31 Dec to 1 Jan | New Year | Major | [Resolution ratchet with mid-January release](#resolution-ratchet-with-mid-january-release) | 31-tooth daily ratchet that winds a spring with every day kept and trips back to zero on 17 January | **Complete** |
| 6 Jan 2027 | Epiphany / Three Kings | Special day | Magi star-following mount | Parallelogram equatorial mount that holds a star in view while the base turns | Scheduled |
| 2 Feb | Groundhog Day | Special day | Punxsutawney shadow-detect bistable | Bistable flap that latches "six more weeks" if a shadow-casting vane reaches its sensor | Scheduled |
| 6 Feb | Lunar New Year (Year of the Goat) | Major | Dragon-dance wave camshaft | Multi-throw crankshaft with phased throws that sends a travelling wave down a segmented dragon | Scheduled |
| 9 Feb | Mardi Gras | Major | Krewe bead-throw catapult | Spring-loaded arm with a cam-timed release and a ratchet wind, rated in beads per float-minute | Scheduled |
| 14 Feb | Valentine's Day | Major | Cupid cardioid cam | Heart-shaped cam giving a follower exactly uniform velocity both ways, as used in bobbin winders | Scheduled |
| ~10 Mar | Eid al-Fitr | Major | Fanous lantern slow-turn worm drive | Self-locking worm stage that turns a lantern one revolution per hour after sunset | Scheduled |
| 14 Mar | Pi Day | Special day | Archimedes rolling-pi rack | Wheel of diameter 1 rolling on a rack calibrated in units of pi | Scheduled |
| 17 Mar | St Patrick's Day | Major | Shamrock three-lobe Geneva | Three-slot Geneva, the longest dwell in the family and the quickest index, wheel shaped as a trefoil | Scheduled |
| 20 Mar | Nowruz (spring equinox) | Major | Equinox Roberval balance | Parallelogram balance that reads true wherever the load sits on the pan: day and night held level | Scheduled |
| ~22 Mar | Holi | Major | Gulal colour-burst bellows | Oscillating-cylinder pump with a quick exhaust that throws a measured cloud of colour | Scheduled |
| 28 Mar | Easter | Major | Paschal egg trammel | Trammel of Archimedes with unequal arms, set to the classic hen's-egg proportions for decorating | Scheduled |
| 1 Apr | April Fools' Day | Special day | Null differential screw | Two equal-pitch threads in opposition: a beautifully made screw that advances nothing | Scheduled |
| 22 to 29 Apr | Passover | Major | Eighteen-minute dough escapement | Anchor-escapement timer that runs exactly eighteen minutes from mixing to oven | Scheduled |
| 22 Apr | Earth Day | Special day | Hand-crank dynamo epicyclic | Step-up planetary for a crank generator, 1:12 in one stage | Scheduled |
| 9 May | Mother's Day (US) | Major | Breakfast-tray parallelogram leveller | Parallelogram arm that keeps a breakfast tray level from bedside to lap | Scheduled |
| 20 Jun | Father's Day (US) | Major | Recliner six-bar | Stephenson six-bar that raises the footrest and tilts the back in one handle stroke | Scheduled |
| 21 Jun | Midsummer | Major | Maypole horn-gear braider | Horn gears passing ribbon carriers in figure-eights round a pole: the braiding machine named after the dance | Scheduled |
| 4 Jul | Independence Day (US) | Major | Liberty bell-crank striker | Bell crank with an over-travel spring so the clapper strikes once and stands clear | Scheduled |
| 6 Sep | Labor Day (US) | Special day | Labour-saving block and tackle | Four-fall tackle with a ratchet sheave, so the holiday involves a quarter of the effort | Scheduled |
| ~15 Sep | Mid-Autumn Festival | Major | Mooncake moon-phase differential | Differential that subtracts the solar from the lunar train to show the moon's phase on the press | Scheduled |
| 18 Sep to 3 Oct | Oktoberfest | Major | Masskrug stein hoist | Parallel-link lift that raises ten steins without tilting a single one | Scheduled |
| ~2 Oct | Rosh Hashanah | Major | Apple-and-honey gear pump | External gear pump metering honey in exact doses per apple slice | Scheduled |

## Index by family

Complete records only. Families and columns match the master catalogue.

| Mechanism | Family | Level | Motion | Ratio | Occasion |
|---|---|---|---|---|---|
| [Nosferatu crypt-lid quick-return](#nosferatu-crypt-lid-quick-return) | Quick-return | Intermediate | Rotary → Oscillating | Stroke | Halloween |
| [Plymouth straight-cut carving linkage](#plymouth-straight-cut-carving-linkage) | Straight-line linkage | Advanced | Rotary → Straight line | Stroke | Thanksgiving |
| [Maccabee eight-night indexer](#maccabee-eight-night-indexer) | Intermittent | Intermediate | Rotary → Intermittent linear | Index step | Hanukkah |
| [Drosselmeyer toggle jaw](#drosselmeyer-toggle-jaw) | Linkage | Basic | Oscillating → Linear | Force amplification | Christmas |
| [Nguzo Saba seven-gear planetary](#nguzo-saba-seven-gear-planetary) | Gears | Intermediate | Rotary → Rotary | Low (<5:1) | Kwanzaa |
| [Resolution ratchet with mid-January release](#resolution-ratchet-with-mid-january-release) | Clutch & ratchet | Intermediate | Oscillating → Intermittent rotary | Index step | New Year |

## Find by motion

| Input \ Output | Rotary | Oscillating | Linear | Intermittent rotary | Intermittent linear | Straight line |
|---|---|---|---|---|---|---|
| **Rotary** | [Nguzo Saba planetary](#nguzo-saba-seven-gear-planetary) | [Crypt-lid quick-return](#nosferatu-crypt-lid-quick-return) |  |  | [Maccabee indexer](#maccabee-eight-night-indexer) | [Plymouth carving linkage](#plymouth-straight-cut-carving-linkage) |
| **Oscillating** |  |  | [Drosselmeyer toggle jaw](#drosselmeyer-toggle-jaw) | [Resolution ratchet](#resolution-ratchet-with-mid-january-release) |  |  |

The Maccabee indexer joins `walking-beam` as the only mechanisms with an Intermittent linear output.

## Mechanisms

### Nosferatu crypt-lid quick-return

*Also called: Stoker motion, creak-and-slam drive, coffin-lid slotted lever, Transylvanian quick-return*

A crank and slotted lever that eases a coffin lid open over two-thirds of a turn, then slams it shut in the remaining third, while a cam on the same crank sits the vampire up to face you.

| | |
|---|---|
| id | `crypt-lid-quick-return` |
| Occasion · Date rule · Duty | Halloween · fixed, 31 October · Commercial |
| Family · Level | Quick-return · Intermediate |
| Motion | Rotary → Oscillating (Quick-return, Reciprocating, Non-uniform) |
| Axes · Plane | Offset parallel · Planar |
| Ratio | Stroke, n/a: lid swing 73.7°; open-to-slam time ratio 2.39:1; the occupant rises 72° |
| DOF · Topology | 1 · 7 links, 7 R, 1 P, 1 higher (ground, crank with cam, slider block, slotted lever with lid, rocker, link, occupant on the hip shaft; the slider is a track roller in the slot, the rocker rides the cam on a roller) |
| Backdrivable | Partly |
| Function | Quick return, Motion conversion, Timing & regulation |
| Property | Exact, Few parts, Singular positions, Shock at engagement |
| Application | Toys & kinetic art, Packaging & automation, Consumer products |
| Keywords | quick-return, slotted lever, cam, coffin, crypt, vampire, figurine, haunted attraction, slam, animatronic |

**How it moves.** A crank turning steadily about C carries a roller in a slot cut along the lid lever, which pivots at O below it. The lever rocks between two extremes, reached when the crank is square to the slot. Because the crank pin is far from O while it travels the long way round and close to O on the short way, the lever swings slowly one way and fast the other. The lid is fixed to the lever, so it rises over 254° of crank and falls over 106°. A cam on the crank shaft swings a rocker, and a link carries the swing to the occupant's hip shaft: he sits up 72° while the lid is high, holds, and lies back down before the slam.

**Forces.** Drive torque reaches the lever as a roller force square to the slot, so the lever sees the most force per unit torque on the slam stroke, when the roller is only 20 mm from O. The lid's own weight assists the slam; on the opening stroke the crank lifts it through the long lever arm, so the motor works hardest just after the lid leaves the frame.

**Why use it.** One continuously running motor produces the full theatrical sequence: a slow, suspenseful opening, a moment of hesitation at full height, and a fast close. No controller, limit switch or second motor is involved, and the timing never drifts.

**Limits.** There is no true dwell; the lid lingers within 2° of fully open for only 35° of crank, so any occupant must sit up promptly. The slam reverses the roller's load in the slot at speed, which wears the slot flanks first; the Commercial build adds a polymer slot liner rather than relying on the patron's screams to mask the noise.

**In industry**

- **Haunted attractions and dark rides**: the standard lid drive for coffins, crypt doors and sarcophagi, where a 20 rpm gearmotor gives a 2.1 s open and a 0.9 s slam, a rhythm scare designers call "the long breath in".
- **Confectionery packaging**: the same quick-return snaps hinged lids on seasonal chocolate boxes, giving the operator time to place the tray on the slow stroke.
- **Consumer products**: motorised trick-or-treat bowls, where the lid stays near closed for most of the cycle and the quick-return gives children a fair but brief window.
- **Theatre and opera**: trapdoor and casket effects, run quietly on the slow stroke and allowed to bang on the fast one because the orchestra covers it.

**Build**

- Ground: x along the coffin from the hinge end (the occupant's head end), y up, z toward the drive side. The lid hinge and lever pivot O at (0, 0), on the top edge of the head end; crank centre C at (0, −50), below it; rocker pivot G at (−34, −80); hip shaft H at (−100, −40). The frame is the coffin, its legs and a side frame for the drive.
- Input: crank, continuous rotation about C, direction chosen so the long arc is the opening stroke.
- Output: lid angle about O; lid tip P traces the opening arc. Second output: the occupant's angle about H.
- Members: `crank` (driver) C→A, radius r = 30, carrying the cam; `lever` (output) slotted lever pivoted at O, slot from 14 to 86 mm along it, carrying the lid (tip 160 mm out), which lies flat along −x with the lever at −53.13°, its shut extreme; `rocker` at G, a roller arm of 28 mm to a 5 mm roller on the cam and an arm of 38 mm at 120° from it to E; `link` E→F, 43.6 mm; `occupant` on the hip shaft H, with a hip arm of 20 mm to F; `frame` (ground).
- Joints: C revolute (ground–crank); A, the crank pin with a track roller, pin-in-slot in the lever; O revolute (ground–lever); cam contact (cam–rocker roller); G revolute (ground–rocker); E revolute (rocker–link); F revolute (link–occupant); H revolute (ground–occupant).
- Default parameters: d = 50 mm (O to C); r = 30 mm (crank radius); L = 160 mm (lever to lid tip); cam base radius 14 mm, lift 18.3 mm; crank speed 20 rpm.
- Defining relations: lever extremes where the crank is square to the slot, cos β = r/d, β = 53.13°. Slam stroke spans 2β = 106.3° of crank, opening stroke 360° − 2β = 253.7°, time ratio 2.39:1. Lever swing 2 asin(r/d) = 73.74°. Peak lever speed per unit crank speed: r/(d − r) = 1.5 on the slam, r/(d + r) = 0.375 on the opening, a factor of 4. Cam, in crank degrees from shut: cycloidal rise from 140° to 212°, dwell to 240°, cycloidal return by 262°; the four-bar G, E, F, H turns 18.3 mm of lift into 72° at the hip, its transmission angle never under 63°.
- Range: crank 360° continuous; lever between −53.13° and −126.87° from horizontal; lid from 0° (shut) to 73.7° open; occupant from 0° (lying) to 72° (up), fully up while the lid goes from 66° to 73°, and down again before the slam.
- Notes: lever angle = atan2(−d + r sin θ, r cos θ); lid open = −53.13° − lever angle. Pick the crank direction that puts the long arc on the opening. The roller is nearest O at mid-slam, so the slot must reach 14 mm from O. The drive sits outboard of the drive-side wall; the hip shaft passes through it.

**Teaching suggestions.** Trace the lid tip P (with the comet), the crank pin A and the top of the occupant's head. The two lines where the crank is square to the slot split the crank circle into the slam and opening arcs; label β = 53.1° at the extremes. Velocity at P; the roller force square to the slot. Plot lid angle against crank angle, a long gentle rise and a steep fall, a sawtooth that has thought about it, with the occupant's angle as a second line sitting inside the lid's slow last stretch.

**Interpretation and hand-crafted parts**

- Layout: the hinge at the occupant's head end; the drive outboard on one side behind a see-through side frame. Seen from the foot end, the lid opens away and the occupant sits up facing you, the open lid behind him.
- The coffin, decorated: six-sided, wide at the shoulders; carved panels with rosettes, scrolls and corner fans; bead rows and rope mouldings; a rim moulding; bar handles; turned legs; quilted satin lining and mattress. The lid: a raised panel with a carved border, rosettes and a carved bat; quilted underneath.
- The occupant, a figurine like a carved wooden or moulded toy, layered front to back: slicked hair with a widow's peak, pointed ears, angled brows, eyes, nose and fangs; a high-collared cape with its lining showing and a scalloped hem; bow, lapels, vest buttons, sash and medallion; arms crossed on the chest with clawed hands; trousers and pointed shoes lying on the mattress.
- Clearance: the concept keeps 13 mm between the figure and the lid while he rises with the lid about 56° open; the build should widen it (the hip shaft a little further from the hinge, or the rise a little later).
- A rubber bump stop on the frame where the lid lands, since every real coffin lid drive has one.
- The slam loads O hardest; the lever sweeps over C, so the crank is overhung.
- Marks: a protractor arc on the side frame behind the lid hinge, stop marks at 0° and 73.7°, "SHUT" and "OPEN".

**Generated images**

1. *In use.* "Behind-the-scenes photo in a haunted house attraction workshop, a coffin with its lid half open on a steel lever, gearmotor and timing belt visible underneath, cobwebs, work lights, technician with a torque wrench, realistic, shallow depth of field."
2. *Product shot.* "Exploded view of a precision coffin-lid drive like a premium consumer product, anodised dark grey plates, polished shoulder bolts, bearings floating in line, soft studio light on white, premium product photography."
3. *Museum automaton.* "A richly carved wooden coffin automaton in a museum display case, the lid swinging open behind a painted wooden vampire figurine sitting up with arms crossed, high-collared cape, fangs and widow's peak, brass handles, quilted satin lining, the crank and lever drive visible on one side, warm spotlight, realistic photograph."

**Related**: `crank-shaper`, `whitworth`, `four-bar`, `cam-follower`

---

### Plymouth straight-cut carving linkage

*Also called: Rockwell carver, twin Hoekens slicer, level-knife carving linkage, the drumstick-safe linkage*

Two identical Hoekens linkages, belted in step, carry a level knife along a straight saw stroke and lift it clear of the bird on the way back.

| | |
|---|---|
| id | `plymouth-carving-linkage` |
| Occasion · Date rule · Duty | Thanksgiving (US) · fourth Thursday in November · Domestic (Commercial variant for carveries) |
| Family · Level | Straight-line linkage · Advanced |
| Motion | Rotary → Straight line (Reciprocating, Constant velocity, Quick-return) |
| Axes · Plane | Rotary-to-in-plane · Planar |
| Ratio | Stroke, n/a: 108 mm straight stroke from a 25 mm crank, 4.3 x the crank diameter |
| DOF · Topology | 1 · 8 links, 10 R, 0 P, 1 higher (ground, two cranks, two couplers, two rockers, knife bar; one timing belt phasing the cranks) |
| Backdrivable | Partly |
| Function | Straight-line generation, Motion conversion, Path generation |
| Property | Approximate, Balanced, Singular positions, Positive drive |
| Application | Consumer products, Packaging & automation, Agriculture, Machine tools |
| Keywords | hoekens, chebyshev lambda, carving, turkey, slicer, saw stroke, carvery, coupler curve |

**How it moves.** Each half is a Hoekens four-bar: crank 25, ground 50, coupler 62.5, rocker 62.5, with the coupler extended to a point P 125 mm from the crank pin. Over 200° of crank, P runs along a straight line, at nearly constant speed through the middle of it; over the remaining 160° it swings up in an arch and comes back faster. A second, identical linkage 140 mm along is driven in phase by a 1:1 timing belt behind the back plate, so its point P' moves exactly like P. The knife bar is pinned to both points and therefore translates without rotating: the blade stays level through the whole stroke and lifts out of the meat on the return.

**Forces.** Cutting resistance acts along the stroke at P, a long way out on the coupler, and returns through the rocker and crank in roughly equal shares. The two halves share the cut, and the phasing belt only has to carry the difference between them, which is small while the build is accurate. The rockers come near their stationary positions at the ends of the straight stroke, where crank torque per unit of cutting force rises.

**Why use it.** A carving stroke wants a straight line at constant speed with a level blade and a clean lift at the end; a single Hoekens gives the first two, and twinning it gives the third without a slide or guide that would collect gravy. The 1.25:1 time ratio returns the blade a little faster than it cut, which carvers find encouraging.

**Limits.** The straight segment is approximate, deviating ±0.12 mm over 108 mm, which is finer than any turkey can detect but rules the linkage out for prosciutto. The speed is even only through the middle of the stroke and falls away toward its ends, where the rockers slow. Twinned linkages are overconstrained (Gruebler gives 0); they run because the halves are identical, so pin centre errors above about 0.1 mm show up as binding at the ends of the stroke. Slice thickness is set by moving the platter by hand, a deliberate concession to tradition.

**In industry**

- **Carveries and hotel buffets**: Commercial variant at 30 rpm gives a 97 mm/s saw stroke, inside the range professional carvers use, without the forearm.
- **Poultry processing**: twinned straight-line linkages are used where a blade must stay level on a conveyor; the Thanksgiving pattern is the domestic adaptation, scaled for one bird and one family argument.
- **Bakery slicing**: the same level-knife linkage slices pies and sheet cakes, where the arched return is valued because it clears the meringue.
- **Consumer appliances**: countertop carving stands, typically with a folding knife bar and a guard that the user removes within the first year.

**Build**

- Ground: crank pivots O2 at (0, 0) and O2' at (140, 0); rocker pivots O4 at (50, 0) and O4' at (190, 0); a back plate standing behind the platter.
- Input: crank, continuous rotation about O2 (crank' follows through the phasing belt, same direction, 1:1).
- Output: knife bar, translating; P and P' trace identical coupler curves.
- Members: `crank` (driver) O2→A, a = 25; `coupler` A→B, 62.5, extended to P, AP = 125; `rocker` O4→B, 62.5; the same three primed at +140 in x; `knife` (output) bar P→P', 140, carrying the blade 30 mm below; `pulley1`, `pulley2` 24-tooth pulleys keyed to each crank shaft behind the back plate; `belt` (belt) 1:1 phasing belt between them.
- Joints: O2, O4, A, B revolute (and the same four primed); P revolute (coupler–knife); P' revolute (coupler'–knife); belt pulley1–pulley2.
- Default parameters: a = 25 mm (crank); b = 50 mm (ground); c = 62.5 mm (coupler A to B); d = 62.5 mm (rocker); AP = 125 mm (coupler point); s = 140 mm (twin spacing); crank speed 30 rpm.
- Defining relations: Hoekens proportions a : b : c : d : AP = 1 : 2 : 2.5 : 2.5 : 5; Grashof crank-rocker (25 + 62.5 ≤ 50 + 62.5). The twins stay in phase because both pulleys have 24 teeth and an open belt turns them the same way. Knife bar length must equal s exactly, or the parallelogram fights the belt.
- Range: crank 360°; straight stroke y between 100 and 100.24 mm for crank 80° to 280°, x from 104 to −4 mm (108 mm), its speed within 4% for crank 120° to 240°; return arch rises to 122.5 mm, lifting the blade 22.5 mm; coupler rocks from 37° to 101°, which the knife bar does not see.
- Notes: B closes the dyad on A and O4 on the branch above the ground line; P = A + 2 (B − A). The second half is the first shifted by s. The twins are overconstrained, which `topology.notes` says (K11).

**Teaching suggestions.** Trace P with ticks at equal time, so the even spacing along the straight run shows the constant speed and the arch shows the faster return. Show the coupler's rock as an angle, since the knife bar hides it. Plot knife x and knife height against crank angle, showing the flat 200° stroke.

**Interpretation and hand-crafted parts**

- Scenery, optional: a platter under the stroke. The first edition left the bird out because it would be the only part without a bearing; the build may keep that ruling.
- The blade as a separate plate on the knife bar, screwed on with three countersunk screws, so it reads as replaceable.
- The cut enters at P and P': the knife bar forks round each coupler tip.
- The phasing belt behind the back plate, out of the gravy, with an eccentric tensioner.
- Locating dowels at both rocker pivots, since twin linkages live or die by their pivot spacing.
- Marks: a straight scale under the stroke from 0 to 108 mm in 10 mm divisions, "CUT" under the straight run and "LIFT" under the arch.

**Generated images**

1. *Mid-century advertisement.* "1950s magazine advertisement in the style of a household appliance ad, family at a Thanksgiving table admiring a chrome carving machine with visible linkages slicing a roast turkey, cheerful painted illustration, headline space left blank."
2. *Commercial kitchen.* "Hotel carvery station photographed for a trade catalogue, stainless steel linkage carving machine slicing a roast turkey under heat lamps, chef in whites supervising, warm light, realistic."

**Related**: `hoekens-linkage`, `chebyshev-linkage`, `parallelogram-linkage`, `locomotive-drive`, `belt-drive`

---

### Maccabee eight-night indexer

*Also called: menorah Geneva, shamash carriage drive, octal Geneva rack, eight-night stepper*

An eight-slot Geneva drive turning a pinion on a rack, so a candle carriage advances exactly one station per night and holds perfectly still in between.

| | |
|---|---|
| id | `eight-night-indexer` |
| Occasion · Date rule · Duty | Hanukkah · lunisolar, 25 Kislev for eight nights (from the evening of 4 December 2026) · Community (Municipal variant for public menorahs) |
| Family · Level | Intermittent · Intermediate |
| Motion | Rotary → Intermittent linear (Intermittent, Dwell, Non-uniform) |
| Axes · Plane | Rotary-to-in-plane · Planar |
| Ratio | Index step, n/a: 45° of wheel, 20.03 mm of carriage per drive turn |
| DOF · Topology | 1 · 4 links, 2 R, 1 P, 3 higher (ground, driver with locking disc, Geneva wheel with pinion, rack carriage; pin-in-slot, locking arc, gear mesh) |
| Backdrivable | No (self-locking) |
| Function | Indexing, Dwell, Positioning, Locking |
| Property | Exact, Positive drive, Shock at engagement, Precision |
| Application | Packaging & automation, Clocks & watches, Film & optics, Consumer products |
| Keywords | geneva, maltese cross, menorah, hanukkiah, shamash, eight slots, index, dwell, rack |

**How it moves.** A driver turning once per day carries a pin that enters one of the wheel's eight radial slots, turns the wheel 45° and leaves. For the rest of the turn a locking disc on the driver sits in a concave arc on the wheel and holds it still. A 34-tooth pinion on the wheel shaft drives a rack, so every 45° index moves the carriage 20.03 mm, one candle station. The rack is mounted to run right to left, in keeping with the custom of placing candles from the right, which makes it the only mirrored rack in either catalogue.

**Forces.** Load passes from pin to slot flank, and the wheel is accelerated from rest at entry and stopped at exit, with the peak wheel speed at mid-index (0.62 times driver speed for eight slots). At one turn per day these inertial effects are negligible: the carriage averages 0.62 µm/s while indexing, about 130 times the speed of beard growth, which is the comparison clients ask for. In the dwell the locking arc carries any load on the carriage straight to ground, so pushing the carriage does nothing, by design.

**Why use it.** Exact, repeatable steps with a positive lock between them and no controller, from one motor running continuously. The index is phased away from the evening, so the carriage is always at rest when the candles are lit.

**Limits.** Each index occupies 135° of the driver, nine hours at one turn per day, and must be phased to fall between 01:00 and 10:00. After the eighth night the drive is switched off and the carriage returned by lifting the rack out of mesh, a once-a-year operation. Candle pitch is fixed at 20.03 mm by the pinion; standard candles fit, but the holder spacing is not adjustable without changing the pinion, and the Municipal variant uses a 1:12 rack lever to reach street-scale spacing.

**In industry**

- **Public menorahs**: Municipal variant drives an illuminated carriage along a large outdoor menorah in civic squares, sealed bearings, stainless fasteners, with a lockable hand crank for the annual return.
- **Synagogues, schools and community centres**: Community variant on a tabletop menorah, showing at a glance which night it is to anyone who arrives late.
- **Bakery lines**: the same eight-station Geneva and rack, run at 60 rpm instead of one turn per day, indexes trays through filling and glazing stations on doughnut lines during the season's peak demand.
- **Projection and display**: Geneva steppers are the traditional drive for film and slide advance; seasonal shop-window displays use this one to advance a scene one panel per day.

**Build**

- Ground: driver centre D at (0, 0), wheel centre W at (60, 0); rack guide along y = −25.5 below W; a base frame.
- Input: driver, continuous rotation about D (one turn per day; demonstration speed 10 rpm).
- Output: rack carriage position x; the wheel angle is the intermediate output.
- Members: `driver` (driver) disc at D with drive pin at radius r = 22.96 and a locking disc radius 16, cut away round the pin; `wheel` (gear) eight-slot Geneva wheel at W, outer radius R = 55.43, slots 8.2 wide to radius 33, concave locking arcs radius 17 between slots; `pinion` (gear) 34 teeth module 1.5 (pitch radius 25.5) fixed to the wheel; `rack` (slider) module 1.5 rack on the carriage, 9 candle holders at 20.03 mm pitch with the shamash raised at the left end.
- Joints: D revolute (ground–driver); W revolute (ground–wheel); pin-in-slot (driver pin–wheel slot); the locking disc in the wheel's arcs; gear mesh (pinion–rack); prismatic (ground–rack).
- Default parameters: n = 8 slots; c = 60 mm (centre distance); r = 22.96 mm (pin radius, c sin(π/n)); R = 55.43 mm (wheel radius, c cos(π/n)); z = 34 teeth, m = 1.5 mm (pinion); pitch = 20.03 mm (carriage step).
- Defining relations: r = c sin(π/n), R = c cos(π/n); the pin enters each slot radially, so there is no impact along the slot. Index angle 2π/n = 45°; drive angle during index π − 2π/n = 135°, dwell 225°. Carriage step = (2π/n) × m z / 2 = 20.03 mm. Peak wheel to driver speed ratio r/(c − r) = 0.62.
- Range: driver 360° per night; wheel 45° per night; carriage 7 steps, 140.2 mm, from night 1 to night 8.
- Notes: the locking arc is in contact for |driver angle| > 67.5° from the line of centres. The pin enters the slot tangentially; if it hits the wheel tip, r or c is wrong.

**Teaching suggestions.** One driver turn is one night. Trace the drive pin; mark the 45° index and the 135° drive window. Plot carriage position against driver angle: a smooth S-step and a long flat. Showing all eight nights in one cycle takes a driver range of eight turns; the teaching review decides.

**Interpretation and hand-crafted parts**

- Scenery: nine candle holders on the carriage, the shamash raised 12 mm at the left end and set slightly forward of the row, as is customary.
- The roller is the only part that ever pushes the wheel: a thin cover disc on the driver holds its pin on both sides of the wheel.
- The rack must stay in mesh for 140 mm and lift out of mesh once a year: two rails and a light leaf spring pressing it into mesh do both. Stop pins at both rack ends.
- Marks: night numbers 1 to 8 under each carriage station, right to left; index marks on the wheel face every 45°.

**Generated images**

1. *Civic installation.* "Large stainless steel public menorah in a city square at dusk with a visible precision rack-and-Geneva mechanism in a glass housing at its base, people gathered, warm candlelight and cool blue evening sky, realistic photograph."
2. *Product shot.* "Tabletop menorah built as a premium mechanical object, brushed aluminium and dark anodised parts, an eight-slot Geneva wheel visible through a clear side panel, soft studio light, premium product photography, white background."

**Related**: `geneva`, `internal-geneva`, `rack-pinion`, `intermittent-gear`, `star-wheel`

---

### Drosselmeyer toggle jaw

*Also called: Drosselmeyer pattern, toggle nutcracker, soldier toggle, Mouse King breaker*

A nutcracker whose coat-tail lever drives the jaw through a toggle, so the closing force rises toward dead centre and the shell gives way at the moment the soldier is strongest.

| | |
|---|---|
| id | `nutcracker-toggle-jaw` |
| Occasion · Date rule · Duty | Christmas · fixed, 25 December · Domestic (Commercial variant for nut processors) |
| Family · Level | Linkage · Basic |
| Motion | Oscillating → Linear (Toggle, Non-uniform) |
| Axes · Plane | Rotary-to-in-plane · Planar |
| Ratio | Force amplification, Variable: jaw force / hand force 4.5 at 60°, 19 at 10°, 38 at 5°, 64 at 3° from dead centre |
| DOF · Topology | 1 · 4 links, 3 R, 1 P, 0 higher (soldier body with jaw guide and upper teeth, coat-tail lever, toggle link, jaw block) |
| Backdrivable | Partly |
| Function | Force amplification, Clamping, Motion conversion |
| Property | Exact, Singular positions, High load, Few parts |
| Application | Consumer products, Toys & kinetic art, Agriculture, Machine tools |
| Keywords | nutcracker, toggle, knee lever, dead centre, walnut, hazelnut, soldier, Drosselmeyer |

**How it moves.** The coat-tail lever pivots at O inside the soldier's body. Its short inner arm OA (30 mm) is joined by a 60 mm toggle link to the jaw block, which slides straight up a guide toward the fixed upper teeth. Pulling the coat-tail down swings OA toward the guide line; as OA and the link line up, the jaw rises less and less for each degree of lever, which is the toggle at work. A hard stop halts the lever 3° short of dead centre.

**Forces.** Hand force on the 150 mm coat-tail makes a torque about O; the link converts it into jaw force by the ratio L cos φ / (r sin(θ + φ)). With a 40 N squeeze, the jaw pushes 181 N at the start of travel, 771 N at 10° and 1.5 kN at 5°. The lever pivot and the link pins carry the full jaw force, not the hand force, so they are sized like a press, not a toy.

**Why use it.** A traditional soldier nutcracker is a simple lever with a fixed advantage near 4; it either needs a strong hand or breaks the kernel along with the shell. The toggle gives a light, fast close when nothing is in the way and a very large force over the last millimetre, so the shell fails cleanly and the jaw has almost no travel left to crush the kernel.

**Limits.** Force rises without limit toward dead centre, so the stop is essential: a toggle allowed past centre locks shut, keeping the nut, which the domestic standard classes as a retention event rather than cracking. The useful high-force zone is only the last few millimetres of travel, so the anvil height must suit the nut; this is set with the soldier's hat. Brazil nuts require the hardened jaw pin.

**In industry**

- **Christmas tableware**: the Domestic soldier, in painted beech with a steel mechanism inside the tunic, displayed for most of December and used, by survey, mainly on the 25th.
- **Nut processing**: the Commercial variant cracks walnuts and pecans on an indexing line, one soldier per lane, with the coat-tail driven by a cam instead of a hand; a row of 24 is known in the trade as a regiment.
- **Toggle presses and clamps**: the same geometry is the basis of riveting presses and hold-down clamps, which are nutcrackers that have chosen a different career.
- **Ballet and theatre props**: stage nutcrackers use the toggle so the jaw can be worked with one finger in a white glove, while still looking convincingly strong from the circle.

**Build**

- Ground: soldier body with lever pivot O at (0, 0); jaw guide along the y axis above O; upper teeth (anvil) at y = 104, adjustable ±6 mm by the hat screw; lever stop at θ = 3°.
- Input: coat-tail lever, oscillating θ from 60° to 3° (θ measured from the guide line), worked by hand on the 150 mm tail: a `manual` driver, so the drive is a lever and a stop with no motor (standard V5).
- Output: jaw block height y and jaw gap to the anvil.
- Members: `lever` (driver) bell-shaped lever at O: inner arm O→A, r = 30, coat-tail arm 150 at 165° from it, out the back of the tunic; `link` (link) A→B, l = 60; `jaw` (slider) block with lower teeth, B on its centre line, sliding on the guide; `body` (ground) frame, guide rails, anvil, hat screw.
- Joints: O revolute (body–lever); A revolute (lever–link); B revolute (link–jaw); prismatic (body–jaw).
- Default parameters: r = 30 mm (lever inner arm); l = 60 mm (toggle link); L = 150 mm (coat-tail); θ from 60° to 3°; anvil at 104 mm; jaw block top 10 mm above B.
- Defining relations: y_B = r cos θ + √(l² − r² sin² θ); sin φ = r sin θ / l; jaw force F_j = F_h L cos φ / (r sin(θ + φ)). Jaw travel 69.1 mm to 89.9 mm, 20.8 mm in all; gap at the anvil 24.9 mm open, 4.1 mm at the stop.
- Range: lever 57° of swing; jaw rises 20.8 mm, of which the last 0.6 mm takes the final 7° of lever before the stop.
- Notes: never let θ reach 0 (the jaw force goes to infinity and the page looks alarmed).

**Teaching suggestions.** Forces: the hand force at the tail tip, the axial force in the link and the jaw force at B, which grows with F_j (clipped at 2 kN) and is tagged "toggle" below 10°. A dead-centre line along the guide. Plot jaw force for a 40 N hand against lever angle (log scale), with jaw height as a second line. A time map slowing the last 7° before the stop, where the toggle does its work.

**Interpretation and hand-crafted parts**

- Scenery: the soldier's body as front and back body plates round the mechanism; the hat a knurled cylinder over the anvil screw; the buttons down the tunic are the heads of the body-plate screws; a grip sleeve on the end of the coat-tail.
- A hardened stop pin with a rubber sleeve where the inner arm lands at θ = 3°: the toggle never goes over.
- The anvil screw, M10 x 1 fine pitch through the hat with a lock nut under the brim, sets the anvil height to the nut.
- This is a small press (pins up to 2.5 kN): every pin forked, the mechanism symmetric about its own mid-plane so the jaw cannot twist in its guide.
- Marks: a force scale on the body plate beside the lever arc (200 N, 500 N, 1 kN, 2 kN for a 40 N hand) and a "SET" arrow on the hat.

**Generated images**

1. *Victorian catalogue.* "Victorian hardware catalogue engraving of a mechanical nutcracker soldier with a cutaway showing the toggle mechanism, fine line engraving, ornate border, product number and price in shillings, black ink on aged paper."
2. *Festive table.* "Christmas dinner table photographed from above, a painted wooden nutcracker soldier with a visible steel mechanism through a small window in his tunic, cracked walnut shells, clementines, candles and pine, warm natural light."
3. *Factory line.* "Industrial nut processing line with a row of twenty-four stainless steel nutcracker soldiers on an indexing conveyor, each with a cam-driven lever, walnuts feeding from a hopper, clean factory lighting, realistic photograph."

**Related**: `toggle-clamp`, `slider-crank`, `bell-crank`, `offset-slider-crank`

---

### Nguzo Saba seven-gear planetary

*Also called: kinara carrier planetary, Umoja sun drive, Ujima load-sharing planetary, six-planet harvest drive*

A planetary set of seven gears, one sun and six planets, in which the planets share the load equally on a carrier known in the trade as the kinara.

| | |
|---|---|
| id | `nguzo-saba-planetary` |
| Occasion · Date rule · Duty | Kwanzaa · fixed, 26 December to 1 January · Community |
| Family · Level | Gears · Intermediate |
| Motion | Rotary → Rotary (Continuous, Constant velocity) |
| Axes · Plane | Coaxial · Planar |
| Ratio | Reduction, Low (<5:1): 3:1 sun to carrier with the ring held |
| DOF · Topology | 1 · 9 links, 8 R, 0 P, 12 higher (ring and frame, sun, carrier, six planets; six sun meshes and six ring meshes) |
| Backdrivable | Yes |
| Function | Speed reduction, Torque multiplication, Power splitting |
| Property | Coaxial, Compact, Balanced, High load, Positive drive |
| Application | Agriculture, Energy, Construction & lifting, Consumer products |
| Keywords | planetary, epicyclic, six planets, load sharing, floating sun, kinara, kwanzaa, harvest |

**How it moves.** The sun gear (24 teeth) at the centre drives six planets (12 teeth each), which also mesh with a fixed internal ring (48 teeth). The planets roll round the inside of the ring and carry the carrier with them at one third of sun speed. Each planet spins at exactly sun speed in the opposite direction, a property of this tooth set that is pleasing to watch and has no other use.

**Forces.** Input torque at the sun divides between six meshes; output torque at the carrier is three times the input, gathered from six planet pins. In a perfect build each planet carries one sixth. In a real build tolerances favour some planets, so the sun is left floating, located only by the planets themselves, and moves until the six mesh forces are equal. The design load-sharing factor is 1.15, which is to say each planet carries no more than 15% over its share.

**Why use it.** Six planets carry six times the torque of one in almost the same diameter, the radial forces cancel so the bearings carry only weight, and input and output share one axis. The tooth counts were chosen for the occasion and turn out to be good engineering: seven gears for seven principles, a central sun for Umoja (unity), and six planets sharing the work equally for Ujima (collective work and responsibility).

**Limits.** Six planets is the most this ratio allows: adjacent planet tips clear by only 8 mm, and a seventh planet will not fit. Twelve-tooth planets would be undercut at the standard 20° pressure angle, so this set is cut at 25°. Gruebler gives −4, because five of the six planets are redundant constraints; the build depends on the floating sun, and a sun clamped rigidly in bearings will let two planets do all the work.

**In industry**

- **Harvest machinery**: Kwanzaa takes its name from the Swahili for "first fruits", and six-planet final drives of this pattern turn combine harvester wheels and grain auger gearboxes, where torque is high and space beside the wheel is short.
- **Community-scale wind turbines**: the first stage of the gearbox, where a slow, heavily loaded rotor shaft needs many planets to spread the torque.
- **Karamu feast turntables**: Community halls use the set, run slowly from a small motor, to turn a large round serving table, the carrier carrying the tabletop and the ring fixed in the pedestal; the 3:1 reduction and the floating sun give a smooth, quiet turn under an unevenly loaded table.
- **Slewing drives**: cranes and solar trackers use multi-planet stages where a small motor must hold a large, uneven load still.

**Build**

- Ground: ring gear and frame, centre at (0, 0).
- Input: sun, continuous rotation about (0, 0).
- Output: carrier (kinara), continuous rotation about (0, 0) at one third of sun speed.
- Members: `sun` (driver) 24 teeth, module 2, pitch Ø48, floating; `p1` to `p6` (gear) 12 teeth, module 2, pitch Ø24, on carrier pins at radius 36, every 60°; `ring` (ground) internal, 48 teeth, pitch Ø96; `carrier` (output) two cheek plates joined by three posts between planets, six planet pins.
- Joints: sun revolute (ground–sun, floating, centred by the planets); carrier revolute (ground–carrier); six revolutes (carrier–planet); six gear meshes sun–planet; six gear meshes planet–ring.
- Default parameters: m = 2 mm; Zs = 24; Zp = 12; Zr = 48; N = 6 planets; a = 36 mm (carrier radius, m (Zs + Zp) / 2); pressure angle 25°; face width 8 mm.
- Defining relations: Zr = Zs + 2 Zp (48 = 24 + 24). Equal spacing requires (Zs + Zr) / N to be a whole number: 72 / 6 = 12. Adjacent tips clear when 2a sin(π/N) > m (Zp + 2): 36 > 28. Ratio with ring fixed: ωs / ωc = 1 + Zr / Zs = 3. Planet absolute speed ωp = ωc (1 − Zr / Zp) = −3 ωc = −ωs.
- Range: sun 360° continuous; carrier 120° per sun turn; planets one turn each, opposite to the sun, per sun turn.
- Notes: planet spin relative to the carrier = −(Zs/Zp)(θs − θc); each planet's tooth phase is offset by the assembly condition so all twelve meshes are right at the start. Five of the six planets are redundant constraints, which `topology.notes` says (K11). A full carrier turn takes three sun turns.

**Teaching suggestions.** Trace one planet's centre (a circle) and a point on a planet. Velocity at the sun's pitch point. The six tangential mesh forces on the sun, equal in length, tagged K = 1.15. Plot carrier angle against sun angle, a straight line of slope 1/3, with the six mesh forces as bars.

**Interpretation and hand-crafted parts**

- Scenery: the carrier cheeks as rounded hexagons, the front cheek carrying seven marks, one at the centre and six at the planet positions, three on the left and three on the right, as the candles stand on a kinara. Planets 1 to 3 on the left half, 4 to 6 on the right, told apart by pattern, never colour (T16).
- The floating sun: no bearings of its own, driven through a short splined coupling, so the planets centre it and share the load. This is the one exception the record turns on.
- Three carrier posts between alternate planets, at 30°, 150° and 270°, clear of every planet tip; the carrier runs on one thin-section bearing in the ring housing.
- Marks: "3 : 1" and an arc showing the carrier's 120° per sun turn on the base; assembly marks on the ring and on planet 1 (the ring tooth and the planet tooth that must meet).

**Generated images**

1. *Community hall.* "A community hall set for a Karamu feast, a large round wooden table turning slowly on a pedestal with a visible planetary gear mechanism under a glass panel, kinara with seven candles on the table, kente cloth runners, fruit and vegetables, warm festive light, realistic photograph."
2. *Harvest machinery.* "Cutaway of a combine harvester wheel hub final drive showing a six-planet planetary gearbox, golden wheat field behind, technical cutaway illustration style with clean line work and soft shading."
3. *Exploded view.* "Exploded view of a six-planet planetary gearbox, parts floating in line along the axis: ring housing, front carrier cheek, six planets with needle bearings, floating sun on a spline, rear cheek, studio product photography, soft light, white background."

**Related**: `planetary`, `internal-gear-pair`, `ravigneaux`, `differential`, `sun-and-planet`

---

### Resolution ratchet with mid-January release

*Also called: January ratchet, habit pawl, self-releasing count ratchet, Quitter's Day trip*

A 31-tooth ratchet advanced one tooth for every day a resolution is kept, winding a spring as it goes, which trips its own pawls on the seventeenth day and returns to zero under a fan-fly brake.

| | |
|---|---|
| id | `resolution-ratchet` |
| Occasion · Date rule · Duty | New Year · fixed, 1 January (trip set for 17 January) · Domestic |
| Family · Level | Clutch & ratchet · Intermediate |
| Motion | Oscillating → Intermittent rotary (One-way, Intermittent, Reversing) |
| Axes · Plane | Coaxial · Planar |
| Ratio | Index step, n/a: 11.61° per stroke (31 teeth); trips at 17 teeth, 197.4° |
| DOF · Topology | 1 · 7 links, 6 R, 0 P, 5 higher (ground, ratchet wheel, drive lever, drive pawl, holding pawl, release bar, fan fly; two pawl–tooth contacts, wheel–fly mesh, trip pin, home pin) plus a spiral spring |
| Backdrivable | No (self-locking) |
| Function | One-way drive, Indexing, Energy storage, Locking |
| Property | Positive drive, Self-locking, Over-centre, Shock at engagement |
| Application | Consumer products, Instruments, Packaging & automation, Clocks & watches |
| Keywords | ratchet, pawl, resolution, new year, count wheel, predetermining counter, fan fly, reset, January 17 |

**How it moves.** A drive lever on the wheel axis swings 14° once a day and its pawl pushes the wheel on by one tooth; a holding pawl on the frame stops it slipping back. Each tooth gained winds a spiral spring a little further. On the seventeenth stroke a trip pin on the wheel knocks a release bar over centre, and the bar lifts both pawls clear of the teeth together. The spring then unwinds the wheel to zero, slowed by a fan fly, and at zero a home pin knocks the release bar back so the pawls drop in, ready to start again.

**Forces.** The pawls carry the spring torque, which rises with every tooth: 0.028 N·m to make the first day's stroke and 0.158 N·m by the seventeenth, so day 17 takes 5.6 times the effort of day 1, a figure the habit literature arrived at independently. The release bar is bistable, so the trip needs only a light push from the pin and the bar then holds the pawls up by itself against their springs for the whole unwind.

**Why use it.** It records progress positively, never loses a day by slipping, makes effort visible as stored energy, and resets itself with no action from the user, who may not be in a position to take one. Every element is a standard ratchet, latch and governor part.

**Limits.** The release is set by the trip pin, not by the user's character; moving the pin is a two-screw job and the 31-tooth setting is offered as the "Committed" accessory. At 31 teeth the wheel reaches a solid stop pending February, which is sold separately with 28 teeth (29 in leap years). The fan fly runs only on the unwind, through a sprag; if the sprag is fitted backwards the fly runs on the winding strokes instead and January becomes noticeably harder.

**In industry**

- **Fitness clubs**: a turnstile-mounted variant counts a member's January visits and releases its tag on the seventeenth, at which point the membership office is notified that the member is now on the standard plan.
- **Predetermining counters**: the same trip-and-reset ratchet counts items into a carton and dumps the batch at a preset count, then resets; packaging lines have run this logic in mechanical form for most of a century.
- **Consumer habit trackers**: a desk-sized Domestic version with a lever the user presses each morning. Reviews note that the reset is quiet and dignified, thanks to the fly.
- **Clock striking work**: the count-wheel and release lever of a striking clock are the direct ancestors of this mechanism, which differs mainly in counting days instead of hours and in being less forgiving.

**Build**

- Ground: wheel axis W at (0, 0); holding pawl pivot H at (−28, 46); release bar pivot R at (30, 52); fly pivot F at (0, −36); spring anchored to the frame.
- Input: drive lever, oscillating 14° about W (one stroke per kept day; demonstration 1 stroke per second), pressed by hand: a `manual` driver (standard V5).
- Output: wheel angle, intermittent one-way, with the unwind as a separate event.
- Members: `wheel` (output) 31 teeth, tip radius 40, tooth depth 4, trip pin at tooth 17 and home pin at tooth 0 on its face, 62-tooth module 1 gear ring on its back; `lever` (driver) arm on W, length 60, with the drive pawl pivot at 46 mm; `dpawl` (pawl) on the lever, 22 mm, spring-loaded into the teeth; `hpawl` (pawl) on H, 24 mm, spring-loaded; `bar` (link) bistable release bar on R with a toggle spring and two lift pins under the pawl tails; `fly` (link) two-vane fan on F with a 10-tooth pinion via a sprag; `spring` (spring) spiral spring wheel to frame, preload 0.02 N·m, rate 0.04 N·m per radian.
- Joints: W revolute (ground–wheel and ground–lever, coaxial); drive pawl revolute (lever–dpawl); H revolute (ground–hpawl); R revolute (ground–bar); F revolute (ground–fly); pawl–tooth contacts ×2; gear mesh (wheel ring–fly pinion, through the sprag); trip pin contact (wheel–bar); home pin contact (wheel–bar).
- Default parameters: z = 31 teeth; tooth pitch 11.61°; lever swing 14° (2.4° overtravel); trip at tooth 17; spring 0.02 N·m + 0.04 N·m/rad; fly step-up 6.2:1; fly vanes 30 x 12 mm.
- Defining relations: one tooth per stroke when lever swing exceeds 360/z and is less than 2 × 360/z. Spring torque T = T0 + k θ, θ = n × 2π/z. Release bar bistable about its centre spring line; trip pin moves it over centre at tooth 17; home pin moves it back at tooth 0. Unwind speed limited by fly drag, about 4 s from tooth 17 to 0.
- Range: lever ±7° each stroke; wheel 0 to 197.4° in 17 steps, then back to 0 in one smooth unwind.
- Notes: one cycle is 18 strokes: 17 steps plus the unwind, a single smooth return over the time of the eighteenth stroke, with the lever still swinging uselessly during it, which is accurate. The pawls lift together when the bar flips and drop together at home.

**Teaching suggestions.** Trace the trip pin. Label the 11.61° tooth pitch and, on stroke 17, a "17 Jan" tag. Spring torque growing with each tooth; the pawl reaction. Plot wheel angle against day: a staircase of 17 steps and a smooth fall, with spring torque as a second line. A time map slowing the trip, so the bar's flip and the pawls' lift can be seen.

**Interpretation and hand-crafted parts**

- The bistable release bar: a toggle spring between a post and the bar, its line crossing R at mid-travel, two stable positions. The trip pin pushes it over; the home pin pushes it back.
- The fan fly behind the base plate, driven through a sprag so it turns only on the unwind, seen through the base.
- The spiral spring over the wheel hub.
- Wheel and lever share one axle but not a bearing: the lever swings, the wheel steps.
- The pawls on bushings, not bearings: lightly loaded, they need a little friction so they do not bounce.
- Scenery: a round grip button on the lever; a solid stop at tooth 31 for users of the Committed accessory.
- Marks: day numbers 1 to 31 at the tooth positions round the wheel with a small star at 17; "RESET" on the release bar.

**Generated images**

1. *New Year's Eve.* "A sleek mechanical desk object with a ratchet wheel and lever on a dark walnut desk beside a glass of champagne and a notebook titled Resolutions, confetti, city fireworks through the window at midnight, cinematic warm light."
2. *Gym turnstile.* "Fitness club entrance turnstile with a brushed steel housing and a small window showing a ratchet counter at tooth 16, a slightly tired person in a January winter coat swiping a card, realistic photograph, gentle humour."

**Related**: `ratchet-pawl`, `sprag-clutch`, `bistable-compliant`, `anchor-escapement`, `centrifugal-governor`
