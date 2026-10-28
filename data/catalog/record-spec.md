# Mechanism catalogue: record spec

```
record spec: v3 (record_version 3)
date: 2026-10-20
supersedes: v2 (records with a hand-written model, joints inferred from outlines)
```

You are researching a batch of mechanical mechanisms for an online mechanism library (a site that animates each
mechanism as true 3D parts, drawn in one house style). Each mechanism becomes one JSON record. In v3 the record is
enough to BUILD the mechanism with no hand-written model: its structured `kin` block (bodies, joints with 3D axes,
drivers, parameters and ranges, the named points and outputs) and its `teaching` block (the principle parts, traces,
construction overlays, default view, controls, time map) are described under "Record v3" below. The prose fields stay
prose. Research workers fill the prose, the facets and the links; the kin and teaching blocks are written with the
mechanism's build pass against the mechanism standard 3.0.

Existing site code (read-only reference, do not edit): mechanism-site/src/mechanisms/*.js
If a mechanism in your batch is marked IN-SITE, read its file there and reuse its geometry/dimensions where possible
(the `build()` function holds the real link lengths) and set "in_site": true.

## Output

Write ONE JSON file (an array of records, in the order given) to the path you are told. Valid JSON, UTF-8, no comments.
Use plain prose in text fields (no em-dashes; use commas or "to"). Units: mm, degrees.

## Record schema

```json
{
  "record_version": 3,
  "id": "kebab-case, must equal the id given to you",
  "name": "Display name",
  "aka": ["other names people search for"],
  "in_site": false,
  "family": "ONE value from FAMILY",
  "level": "Basic | Intermediate | Advanced",
  "summary": "One sentence, what it does, plain language, <= 160 chars.",
  "motion": {
    "input": "ONE value from MOTION",
    "output": "ONE value from MOTION",
    "label": "Input → Output (exactly like the site, e.g. \"Rotary → Linear\")",
    "output_character": ["values from CHARACTER"],
    "axes": "ONE value from AXES",
    "plane": "Planar | Spatial"
  },
  "ratio": {
    "kind": "ONE value from RATIO_KIND",
    "class": "ONE value from RATIO_CLASS",
    "typical": "human text, e.g. \"10:1 to 300:1 per stage\", \"stroke = 2 x crank radius\", \"90° per index (4-slot)\""
  },
  "dof": 1,
  "topology": { "links": 4, "revolute": 4, "prismatic": 0, "higher_pairs": 0, "notes": "count includes ground; higher pairs = gear mesh, cam contact, pin-in-slot, belt, rolling" },
  "backdrivable": "Yes | No (self-locking) | Partly | n/a",
  "tags": {
    "function": ["values from FUNCTION"],
    "property": ["values from PROPERTY"],
    "application": ["values from APPLICATION"],
    "keywords": ["free-form search words: historical names, inventors, key terms, 3 to 8 items, lower case unless proper noun"]
  },
  "explain": {
    "motion": "2 to 4 sentences: how it moves.",
    "forces": "1 to 3 sentences: how loads/torque flow, mechanical advantage, where it is weak.",
    "benefits": "1 to 2 sentences.",
    "limits": "1 to 2 sentences: drawbacks, failure modes, when not to use it."
  },
  "build": {
    "ground": "what is fixed, one line",
    "defining_relations": "the equations / constraints that make it work (e.g. Grashof s+l<=p+q; Hoekens ratios 1:2.5:2.5:2; Geneva c = r/sin(pi/n)); gear ratio formulas; cam law",
    "range": "motion range of input and output with default params (e.g. 'crank 360° continuous; rocker swings 41°')",
    "notes": "anything tricky for an animator: branch choice, singular positions, dwell, toggle, tooth counts that mesh"
  },
  "kin": { "...": "the kinematic model, see Record v3" },
  "teaching": { "...": "what makes the drawing teach, see Record v3" },
  "examples": [ { "use": "short real-world use", "detail": "where/how, 1 sentence" } ],
  "references": [ { "title": "...", "url": "https://...", "kind": "ONE of wikipedia|textbook|kmoddl|paper|standard|patent|museum|engineering-guide|calculator" } ],
  "media": [ { "title": "...", "url": "https://...", "kind": "ONE of video|photos|animation|interactive" } ],
  "related": ["ids of related mechanisms (from the master list below)"],
  "origin": { "date": "1781-10-25", "precision": "day | year | period", "note": "what the date is. Source: https://..." },
  "added": "2026-10-22"
}
```

`build.members`, `build.joints`, `build.input`, `build.output`, `build.params`, `build.overlays` and `build.plot` of v2 are
retired: they are the `kin` and `teaching` blocks. Records at `record_version` 2 stay valid until the 2.5D engine is
removed at cut-over.

Counts: examples 2 to 4 real-world uses (industry or practical). references 2 to 5 (prefer Wikipedia + one hard
source: KMODDL/Cornell, university course page, textbook page, paper, standard (ISO/AGMA/DIN), patent, or a
manufacturer engineering guide). media 2 to 4: at least one VIDEO of the real thing in use or a real build, and at
least one page with PHOTOS of a real one (Wikimedia Commons category, museum page, manufacturer page). Animations
(e.g. Wikimedia gif pages, 507movements, Purdue, firgelliauto) are welcome but do not replace the real-use video.

A seasonal record (a fictional mechanism for a holiday) adds a `season` block and an `images` list and has no
`references`, `media` or `real_world`: see "Seasonal records" below.

## Record v3: the `kin` and `teaching` blocks

Record v3 (`"record_version": 3`) adds two blocks to the record and retires two fields. The catalogue is what the app
builds from: the `kin` block is the kinematic model (it replaces the hand-written `model.ts`), and the `teaching` block
holds what makes the drawing teach (it replaces the polish's overlays and the review's notes). The mechanism standard
(3.0) says what each field must achieve (K, T and P rows); this section says what the fields are.

**Units and frame.** Millimetres and degrees. The base plate lies in the xy plane, z up; angles about an axis follow the
right-hand rule; an angle in the plane is counter-clockwise from +x seen from +z. Every position is `[x, y, z]` (z may
be omitted in a planar mechanism and is then 0). A **body frame** is an origin and an orientation (`"rot": [rx, ry, rz]`
in degrees, applied x then y then z, default none); points and axes given "in a body" are in its frame.

**What changed from v2.**
- `build.members` and `build.joints` are **retired**: bodies and joints live in `kin`, and nothing infers a joint from
  outlines any more. The validator rejects both in a v3 record.
- `build.input`, `output`, `ground`, `params`, `range`, `overlays` and `plot` are replaced by `kin` (drivers, outputs,
  params, ranges) and `teaching` (overlays, plot, traces). What stays in `build` is prose for a human reader:
  `defining_relations`, `notes` and a one-line `ground`.
- `explain`, `summary`, `examples`, `real_world`, `references`, `media` and the facets are unchanged.

### `kin`

```json
"kin": {
  "bodies":  [ { "id": "crank", "role": "driver", "shape": { "type": "link", "length": 40, "boss": [9, 7] },
                 "at": { "joint": "O2" } } ],
  "joints":  [ { "id": "O2", "type": "revolute", "a": "ground", "b": "crank",
                 "at": [0, 0, 0], "axis": [0, 0, 1] } ],
  "params":  [ { "id": "a", "value": 40, "unit": "mm", "min": 20, "max": 70, "note": "crank length" } ],
  "design":  [ { "id": "branch", "options": ["elbow-up", "elbow-down"], "value": "elbow-up" } ],
  "drivers": [ { "id": "input", "joint": "O2", "kind": "rotary", "range": [0, 360], "default": 0 } ],
  "solve":   [ { "block": "dyad", "id": "coupler", "in": { "a": "A", "b": "O4", "ra": "b", "rb": "c" },
                 "branch": "elbow-up", "out": "B" } ],
  "points":  [ { "id": "A", "body": "crank", "local": [40, 0, 0] } ],
  "outputs": [ { "id": "rocker-angle", "of": "rocker", "kind": "angle", "unit": "deg" } ],
  "fallback": null
}
```

| Field | Content |
|---|---|
| `bodies` | Every rigid member: `id`, `role` (`ground`, `driver`, `link`, `output`, `slider`, `gear`, `cam`, `follower`, `pawl`, `spring`, `belt`, `frame`), a typed `shape`, and where it sits (`at`: a joint or point it is pinned to, or a fixed `frame`). `ground` is always present. |
| `shape` types | `link` (length, boss radii), `plate` (outline points or `rect`), `slotLink` (length, slot length, slot width), `slider` (length, width), `gear` (`z` teeth, `module`, `face`, `bore`; `helix`, `cone` half-angle, `hand` for helical, bevel and worm), `rack`, `ringGear`, `cam` (base radius, `law` reference), `disc` (radius, thickness), `shaft` (diameter, length), `sprocket` (`z`, ISO 606 pitch), `pulley` (`z`, HTD pitch, or diameter), `rope`, `cage`, `cross`, `tracer`, `custom` (a profile and an operation: `extrude`, `revolve`, `sweep`, `loft`). |
| `joints` | Declared, with a 3D origin and axis: `id`, `type`, `a`, `b` (bodies), `at` (point or position), `axis`, `limits` `[lo, hi]` where it has them. **Types:** `revolute`, `prismatic`, `cylindrical`, `screw` (`lead`, `hand`, `ball`), `pin-in-slot` (the slot's body and path), `gear-mesh` (`ratio` or the two bodies' tooth counts; `crossed` axes angle, `offset` for hypoid), `cam-contact` (follower kind: roller, flat, knife), `belt` (a `flexible` member: `belt`, `chain`, `rope`, `cvt`), `rolling`, `spherical`, `universal`, `planar`, `flexure` (neck, width, length, thickness). Every joint belongs to exactly one block of `solve`, or to `fallback`. |
| `params` | Named dimensions: `id`, `value`, `unit`, `min`, `max` (the **ranges** used by controls and by the validator), `note`. |
| `design` | Discrete **design choices** that change the build but not the motion law: tooth counts, which arrangement, which side a part is on. `options` and the chosen `value`. |
| `drivers` | The inputs. One or several (differential, ball-disc integrator): `id`, the `joint` driven, `kind` (`rotary`, `oscillating`, `linear`, `manual`), `range` (degrees or mm), `default`. An oscillating driver also gives `lo`, `hi`; a `manual` driver that gives them is a hand stroke, worked through that range by the cycle and built with no motor. A **selector** is a driver of `kind: "select"` with named `options` (`"1st"`, `"reverse"`), each setting the values of other drivers or params; in the record form an option is `{ id, set, cycle }`: `set` gives design choices (the input member, the held member) and `cycle` the input degrees after which the motion repeats at that option (it replaces the rotary driver's range). The selector's `default` is an option's id. |
| `solve` | The composition: a list of block instances in solve order. A **block** is one of `dyad`, `slider-dyad`, `five-bar`, `gear-mesh`, `willis`, `hooke`, `homokinetic`, `bennett`, `cam`, `screw`, `convey`, `flexure`, `escapement`, `lerp`, `line-crossing`, `target-path`, `ravigneaux`; `in` names the bodies, points and params it reads; `out` names the points and angles it produces; `branch` names the design choice that picks its root. Block inputs and outputs are the only names later blocks may read. |
| `points` | Named points: a body and a local position. Every point a trace, overlay, dimension or plot uses is here (standard K12). |
| `outputs` | Quantities read off: `id`, `of` (a body or point), `kind` (`angle`, `position`, `speed-ratio`, `path`), `unit`. Plots and claims read these. |
| `fallback` | `null`, or `{ "numeric": true, "loops": [...] }` when a loop does not decompose into blocks. The audit names it; K1 verifies it. |

The **generic loop-closure solver** is not in the record: it runs at build time on `bodies` and `joints` and its
residual is the K1 check. The blocks' closed forms drive the animation (K1).

**Body frames.** A point's `local` position and a body's `shape` are given in the body's own frame, which the kinematics
and the hardware builder read the same way (`bodyFrameOf` in `src/kin/compose.ts`):
- a `frame` object (`origin` or `o`, and `rot`) wins;
- otherwise the origin is the body's `at` joint, z is that joint's axis (its sign fixed so its largest component is
  positive) and x points toward the first other joint of the body that lies off that axis, so a link's x runs along it
  and a coupler's from its first joint to its second; a body with no such joint (a shaft, a cross) keeps the world x, or
  on an axis in plan the world z, made square to its axis;
- the `ground`'s frame is always the world: its `frame` only places the plate its shape draws, and its points are world
  positions;
- a body no joint reaches stands at its own `frame`, fixed (a port face, a fixed plate): it is part of the ground in the
  mobility count.

**Positions and axes** may be parameter expressions (`["60*cos(beta)", "60*sin(beta)", 55]`), so a `param` control moves
the geometry; the drawing carries every built solid from its built frame to the new one. A point's `local` coordinates and a block's
inputs may be expressions too (`["L+p", 0, 0]`, `"-input"`). A body may name the bodies it lies `above` in its stack (a rod
pinned down onto blocks): a hint the placement solver keeps.

**Outputs.** An `angle` of a body is its turn about its joint to the ground (else its first joint). An `angle` with `from`
and `to` points is the angle at `of` between the rays to them (a transmission angle, a rod's obliquity from a point on
the slide line); one with `minus` is that output less another angle output, wrapped to ±180° (a lead or lag). An `angle`
whose `of` is a driver reads that driver's value (absolute). A `position` of a prismatic joint is its slide. A `position`
of a point with `axis` `x`, `y` or `z` (or `-x`, `-y`, `-z`, a mirrored part read the same way round) is that component,
with `axis: "radius"` its distance from `relativeTo` (the origin without one), and with `relativeTo` alone the distance
between the two points; with `axis: [x, y, z]` its coordinate along that direction; with `from` (and no `to`) its
distance from that point. A `speed-ratio` is computed with the pose: a body's turn per unit of the primary driver, or
with `over` (a point) the speed of the point `of` over the speed of `over` (a mechanical advantage, a scale). A point a
block makes (a crossing, a target) may be traced and read like a named point. `datum` is subtracted from any scalar
output. An `angle` with `absolute: true` is measured from the world x axis (the link's own direction) instead of from the
reference pose. A `speed-ratio` of a point with no `over` is its speed per unit of input, or with `unit: "%"` its speed
as a share of its mean over the cycle (the claim checker reads it off the poses).

**Drivers.** The reference configuration (the joints' positions) is the drivers' `default`s; a control that holds a
driver at another value moves its joint from there. `scale` is the joint's motion per unit of the driver's value (a die
position from -1 to +1 that turns a reverse arm -20° per unit: `scale: -20`).

**Bodies.** `fixed: true` fixes a body that a joint names (a stationary gear in mesh): it never moves and counts as
ground. A shape's `level: { with, part, gap }` places a body at another body's slab: its `lower` or `upper` plate, `all`
of it, or `above` it (an engine's housing round its rotor, its side cover, a stationary gear in the rotor's gear ring).
`link` may carry `bore` (a ring round a sheave with a slim rod: an eccentric strap) or `upper` ({ length, boss, angle,
gap }: a second arm on the same hub `gap` above, an output crank split round a bridge), and `arm` ({ at, joints, boss }:
an outboard arm fixed on the pin `at`, carrying `joints`, on a slab of its own: a return crank on a main crank pin's
end). `slotLink` may carry `arm` (a length back past its pivot). `plate` with `rect` and `center` is centred on that
point of its frame. `slider` lies along its prismatic joint; a body that is more than its sliding block names the block
with `slider: [length, width]`. `custom` profiles: `slotArc` (a curved slotted link of two cheeks: { center, radius,
from, to, width, wall } and `foot`), `rotor` with `internalGear` (a rotary engine's rotor) and `housing` with `bore`
(its epitrochoid housing).

**Joints.** A revolute with a journal `radius` (over 12) is an eccentric between two moving parts (the sheave in its
strap) or, to the ground, a fixed hub the part turns on. A `pin-in-slot` slot is `from`/`to` (straight) or `arc` ({ center,
radius }: a curved slot, the die kit).

**Shapes the builder places where the joints put them** (not on a slab): a bevel `gear` (with `cone`, its pitch cone
half-angle) on its pitch cone; a `shaft` with a `yoke` ({ radius, arm }, a universal joint's yoke) and a `cross`
({ arm, diameter }); a `cylinder` that swings on a trunnion ({ bore, wall, span, face, pad, port, rod, axis }) and its
`piston` ({ length, rod, eye, head, axis }). A `disc` or `plate` may carry `holes` ([x, y, r] in its frame).

**Blocks in their record forms.** `gear-mesh` reads a `gear-mesh` joint (`za`, `zb` or `ratio`, `crossed`, `axis2` the
second gear's axis, `cb` its centre). `hooke` reads either a `universal` joint or, with the cross as a body,
`{ input, cross, joints: { in, out, a, b } }`: the two shafts' ground revolutes and the two yoke pins into the cross.
`slider-dyad` with `kind: "rpr"` is the swinging block: `a` the slotted body's pivot, `p` the pin, `body` the slotted body;
a body joined to it by a prismatic joint keeps its turn. `kind: "rrp"` (the default) is a link and a slide: `a`, `r`, `p`
and `d` (a point and direction of the slide). `kind: "rpp"` is a pin in a straight slot square to the slide (a Scotch
yoke): `a` the pin, `p`, `d`; out the slotted body's point on the slide. `dyad` may name the `body` of its link from
`a`, posed by its turn, so a later block can read that body's other points; its `branch` is a design choice, one of its
options, or a plain `left` / `right` of a to b. A block's `in` may be an expression of names (`"-input"`). A block's
`out` may be keyed (`{ "angle": "gear-turn" }`).
`ravigneaux` solves a set of two suns, short and long pinions on one carrier and a ring: `zSs`, `zSl`, `zPs`, `zPl`, `zR`,
`center`, `axis`, `input` (the input member's angle), `inputMember`, `held` and `locked` (design choices a selector sets:
a member's name, `"none"`, or two members joined by `+`), `bodies` { sunS, sunL, carrier, ring } and `short`, `long`
([{ body, joint }]); out { sunS, sunL, carrier, ring, short, long }.

**A gear through two planes.** A `gear`'s `cluster` level with `joined: true` is one piece with the gear under it, in the
very next slab (a long pinion: its lower half meshes one gear, its upper half others). Where two levels have the same
tooth count, a mesh joint names the level it meets: `level: { <body>: 1 }`.

`lerp` (`a`, `b`, `t`) makes the point a + t (b − a): a scissor bar's far pin. `line-crossing` (`a1`, `a2`, `b1`, `b2`,
optional `sum`) makes the point where two lines cross; where they run together it is the point on the first line whose
distances to `a1` and `b1` add up to `sum` (an antiparallelogram's change points). `target-path` (`shape`
`rounded-square` with `cx`, `cy`, `side`, `corner`, or `flower` with `cx`, `cy`, `r0`, `lobe`, `lobes`) moves a point
once round a closed curve per cycle, from the cycle phase; the linkage follows it by inverse kinematics (`five-bar` with
`mode: "ik"`, dyads). A driver with `cycle: { from }` is set by the cycle through such a block: it is not applied as a
joint motion, its value is read back off the pose, and it needs no control. Block inputs may be parameter expressions.
A body's `shape` may carry a `wheel` ({ diameter, width, stub }): a wheel on a stub axle along the line from its pivot to
the body's point at the stub's distance (a steering knuckle). A `slider` may start at `from` along its x. Every point the
record names on the ground lies on the base.

**Couplings and spatial linkages (R6).**
- *Body frames by axes:* a `frame` may give `z` (the axis) and `x` (made square to it), either as expressions, so a
  control can turn the frame (a fork clamped at a phase angle). A body with `fixed: true` stands where it is although it
  has joints (a cylinder block the pistons slide in).
- *Placed by the record:* `place` (mm along the body's frame z, the field every shape may carry, below) puts the part
  there instead of on a slab (a hinge leaf beside its partner, an arm beside a spindle head); such a `link` takes its
  own `thickness`.
- *Construction lines to the plate:* an `axis-line` overlay with `extend: "plate"` runs both ways to the base plate's
  edges; a `line` with `clip: "plate"` is drawn only over the plate. A ground point with `construction: true` (an aim
  point off the plate) is not on the base, so the plate is not grown to hold it.
- *Construction bodies:* `construction: true` on a body keeps it in the kinematics but out of the build: a body the
  motion is defined by but a hand stands in for (a hand-worked trammel's crank, whose pin is the rod's midpoint). A
  driver on one of its joints is worked by hand at a knob on the built body it carries (a `grip` point there places it).
- *Shape features:* `lugs: [{ joint, span: [w0, w1], r }]`, a hinge lug on the joint's axis joined by a web to a part
  whose plane is not square to the hinge (a plate's edge hinge, a spindle head), its span along the hinge overlapping
  the part there (the web runs within the span: a lug beyond the part, with the mate's part between, would stand in
  the air); `posts: [{ at: [x, y], top, r, turned? }]`,
  columns from the base into a fixed body (`turned: true`: a turned leg, its largest radius r; a body on posts takes no
  standoffs); `bars: [{ from, to, width, z: [z0, z1] }]`, straight bars on a part's face
  (slot jaws, tongues; the slotted body names its `slot: { width, length }`); `ring: { inner, spokes, hub }` on a `disc`
  (a rim, spoked to a hub or bare); `indexMark: { at: [x, y] }`, a raised arrow that stays opaque on a see-through part;
  `ball: { diameter }` on a `link` (at its far end) or a `shaft` (at its start: a plunger's ball end); `plunger: true` on
  a `shaft` that slides in a bore of a fixed body.
- *Shapes:* `spatial-link` (a link between skew hinges: `knuckle` radius, `bar` radius, `span` on its own hinge,
  `far: { joint, span }`, `barAt` where the bar leaves each knuckle along its hinge); `ball` (`diameter`); `race`
  (`center` joint, `sphere`, `width`, `pitch`, `ballDiameter`, groove `phases` about its axis from its frame's x, `hub`);
  `bell` (as the race, with `outer`, `mouth`, `back`); `cage` (`inner`, `outer`, `width`, `window`; a window at each ball
  joined to it by a `planar` joint).
- *Joints:* `support` (`hung`, `bridge`, `stub`, `housing`, `pillow`) names a fixed site's support where the selector
  would choose one that cannot be built (an output shaft that cannot come up through the input side); `head: "-"`
  turns a moving pin end for end. A body with `set: "B"` (a second set of like links) is drawn in a pattern of its own.
- *Blocks:* `bennett` with only `joints` [j1..j4] (round the loop, j1 the driven ground joint) reads its lengths, twists
  and reference angle from them; `hooke` takes `shafts: { in | out: { body, axis } }` for a shaft with no ground joint (a
  centre yoke); `cross-slide` (`input`, `joints: { in, out }`, `slide`, `body`, `center`; out `orbit`); `parallel-cranks`
  (`input`, `discs: [{ body, center }]`, `links: [{ body, pin, disc }]`; out `turn`); `plane-slide` (`plate`, `rides`,
  `point`, `normal`, `pistons: [{ body, joint, at, out }]`, `shoes: [{ body, at }]`); `rzeppa` (`input`,
  `joints: { in, out }`, `center`, `cage`, `balls: [{ body, phase }]`, `rp`; out `tilt`); `conical-pendulum` (`speed`, `l`,
  `g`, `spindle`, `arms: [{ body, joint, down, tip }]`; out `angle`); `sarrus` (`l1`, `l2`, `input`, `theta0`, `top`,
  `legs`). A manual driver with no `joint` moves nothing itself: a block reads its value (a governor's speed).
- *Outputs:* an `angle` whose `of` is a joint is its hinge angle, from the direction body `a` arrives along to the one
  body `b` leaves along (list a loop's joints round it); an output may read a block's value. A claim with `over` a
  driver takes its statistic over that driver's range; a `path`'s `range` is its extent (an orbit's diameter).
- *Teaching:* `seeThrough: [bodies]` draws those principle parts see-through on purpose (a hub that would hide the
  disc and slots, a bell round a cage). Selector `options` are a list of `{ id, params, drivers }` with a `default`.

**Claims.** `span: [a, b]` takes the statistic over the input values in that window (a rotary input's degrees, which may
wrap past 360); `abs: true` takes it on the absolute value. A `dwell` with `band: [lo, hi]` is the longest stretch of the cycle with the output inside that range (a port
open while the swing is in a range); with a number it is the longest stretch the output holds within that much.
`time-ratio` is a reciprocating output's slow stroke over its quick one. `phase` with `from` and `to` (`max`, `min`) is
the cycle degrees from the one extreme forward to the other; with `against` (another output) the lag of the output's
first harmonic behind that one's, signed. `at` takes `at` or `input`. `when: { control, value }` checks the claim at
that setting of one of the teaching controls (a die position).

**Cams, indexers and escapements.**
- `cam` reads a joint carrying `cam` (`schedule`, `lift`, `rb`, `theta0`, `form: barrel` for a groove along a drum's
  axis); `follower` may list the bodies the follower carries, `rr` or `flat: true` places the contact point (`out.contact`,
  a point the record names on the cam), and a cam-contact joint whose `cam` sits on a prismatic joint drives a stem by
  the law. Laws: cycloidal, harmonic, poly345, uniform, modsine.
- `rocker` turns a rocker whose round nose sits on a translating follower (ψ = asin(s / arm)), with the pressure angle
  at its shoe; `indexer` has `internal: true` (internal Geneva), `mode: "mutilated"` (window, ratio) and `mode: "cam"`
  (law, index, step); `star`, `ratchet`, `one-way`, `escape` (planar: anchor, lever with a `fork`) and `verge` are the
  timed blocks, each documented over its code in `src/kin/registry.ts`.
- `cam-rocker` swings a roller follower on a rocker (in: `joint`, the cam-contact joint with its `ca`; `input`; `cam`, the
  cam body it turns; `pivot`, the rocker's ground revolute; `follower`, the rocker and its roller): the roller centre
  stands at the pitch radius rb + s from the cam's centre on the arc of the rocker's arm, the joint's `at` being the
  roller centre at the reference; out { s, angle, pressure }. Its cam is a `cam` with `form: "rocker"`, the roller's
  envelope on that path.
- A joint with `active` (a driver window) is checked by K1 only while engaged, its motion relation too. A body with
  `drops: true` moves by instant drops (an escape wheel): its points are not checked for jumps.
- An output whose id a block wrote as a value is that value (a pressure angle, an advance).

**Shapes the builder makes from a joint's law or the record's numbers.** `cam` (a plate cam: the roller's or the
face's envelope; `form: face-groove`, `barrel`, `lobes` (conjugate lobes from shoe paths), `globoid` (a rib cut by the
rollers' poses)), `genevaWheel`, `genevaCrank`, `intermittentDriver`, `intermittentDriven`, `star`, `ratchetWheel`,
`escapeWheel` (pointed teeth or a `tooth` polygon; `tip0` the simulated phase at the reference), `crownWheel`, `verge`.
Any shape may carry `place` (its part starts there along its frame's z, where the joints put it), `pieces` (more
plates of the body, each with `origin`, `rot` or the axes `x` and `z`, `thick`, `outline`, `holes`; or a turned piece,
`op: "revolve"` with its half section `profile` [r, z] about the frame's z; any of them with `marks` on its top face
([{ kind: "carve" | "quilt", pts }]), a fill `pattern` there ("quilt", "hatch", or { kind, angle, pitch, inset }), and
`ornament: true` for decoration on a seasonal mechanism's scenery, or a solid `kind` of its own) and, on a plate, `exact` (its outline as
drawn), `windows` (polygon holes) and `guide` ([s0, s1] along a slide's axis: the length its rails hold). A disc may
carry `rollers` (a turret's radial rollers). A ground joint may ask for its `support` (`stub`, `hung`, ...) and a shaft
in plan for one `side` (both pillow blocks on it: +1 along the axis, −1 against), and with `overhung: true` the shaft runs on
past the blocks to the parts it carries there (a crank overhung on its shaft's end), a washer and a screw holding them. A fixed joint with
`heldBy` (a fixed body's plate square to its axis, a side frame) is held by that plate instead of a support of its own: a
dead axle stands in it on its shoulder, a live shaft runs in a housing cartridge on its other side, the parts on one side.

### `teaching`

```json
"teaching": {
  "review": { "verdict": "keep", "date": "2026-10-20", "note": "..." },
  "principle": [ { "body": "coupler" }, { "point": "P" } ],
  "traces":   [ { "id": "p-path", "point": "P", "ticks": { "every": 15 }, "ghosts": [ { "control": "die", "value": 1 } ] } ],
  "overlays": [ { "id": "dead-centre", "kind": "line", "from": "O", "to": "A", "label": "DEAD CENTRE" } ],
  "view":     "ISOMETRIC",
  "views":    [ { "id": "A-A", "kind": "section", "plane": { "origin": [0, 0, 0], "normal": [0, 1, 0] }, "highlight": ["port"] } ],
  "controls": [ { "id": "offset", "kind": "param", "param": "e" } ],
  "timeMap":  { "feature": "engagement", "slow": 3, "span": [160, 200] },
  "plot":     { "x": "input", "y": "rocker-angle", "label": "ROCKER ANGLE" },
  "claims":   [ { "text": "the rocker swings 41 degrees", "output": "rocker-angle", "stat": "range", "value": 41, "tol": 0.5 } ],
  "exceptions": []
}
```

| Field | Content |
|---|---|
| `review` | The teaching review's verdict (`keep`, `tweak`, `rethink`), the date, and a note on what was decided (standard T2). The audit's `teaching:` line repeats the verdict. |
| `principle` | The bodies and points that carry the principle (T3). They are drawn on top and whole; the visibility rule (T10 to T12) protects them. |
| `traces` | Teaching traces: a named `point`, optional `ticks` (equal time, every n degrees of the cycle: 360/n ticks per cycle, so a driver run past 360° spaces them by its own range), `ghosts` for settings not selected (`control` and `value`), and `comet: true` on the first. A trace can be a point on a moving body (a point on a planet). |
| `overlays` | Construction overlays: `kind` is `line` (through two named points), `arc`, `circle`, `chord`, `dimension` (a moment arm, a length), `axis-line`, `workspace` (an outline traced by a named point over a range) or `bend` (a flexure's state). Each names its points and a short mechanics-only `label`. A posed overlay is drawn where an output reaches an extreme: `pose: { output, stat: "max" \| "min" }` for all its points, `fromPose` / `toPose` for each end (a dead-centre line, a stroke dimension); an `arc` with both runs on its point's own circle (`sweep: "cw"` or counter-clockwise: a cut or return arc). A `dimension` may measure one `component` (`x`, `y`, `z`: an offset) and reads the kinematic points' true distance. A `line` with `pose: { driver, value }` is drawn with that driver held at the value (a toggle, an aim line at neutral). A `dimension` with `line: [P, Q]` runs from its point square to that line (a moment arm) and reads in plan. An `arc` with `radius` and `range` (degrees) spans those angles, carried by the body `frame` if it names one. An `axis-line` with `from` and `through` is a line through two points, carried on to where it meets the line `extend` names or to a circle's meeting point; a `circle` with `meet: [line, line]` stands where those lines cross (a turning centre). A `workspace` with `frame: <body>` is the point's path seen from that body, carried by it (a rolling centrode, drawn as a ghost); with `over: [driver, driver]` it is the outline a five-bar's tip reaches over both drivers' ranges. |
| `view` | The default named view (T7): `PLAN`, `FRONT`, `SIDE`, `ISOMETRIC`, `DIMETRIC`, `AUX <joint-id>`, or `VIEW az el` in degrees. |
| `frame` | Optional: `{ "zoom": z, "pan": [x, y] }`, a manual frame of the default view (T7) where the plain fit leaves it small or low. `zoom` (0.5 to 2) multiplies the fitted scale; `pan` shifts the drawing by fractions of the stage (x right, y down, each within 0.25). It holds only in the record's own view, assembled (the opening view, Reset view, stills, thumbnails, cards); other views, an orbit, an explode and a detail keep the plain fit, and a zoom never widens the drawing past the room across a narrow stage. |
| `views` | Section and detail views (T8): `kind` `section` (a cut `plane` of origin and normal) or `detail` (a window `center` and `scale`); `highlight` names bodies or points to draw with the highlight. |
| `controls` | The controls the page shows (T14): `kind` `driver`, `param`, `design` or `selector`, and the id it maps to. A mechanism's controls are only these. |
| `timeMap` | A playback rate near a feature (T13): the `span` of input degrees and the `slow` factor. It never changes `solve`. |
| `plot` | What the side panel plots: `x`, `y` (output ids) and a label, or a list: the first is the plot, `ghosts` on it draw the same output at other control settings (a family of curves), and a further entry in the same unit and range is drawn with it. |
| `claims` | Every number the explanation states, with the `output` and `stat` (`range`, `max`, `min`, `mean`, `ratio`, `time-ratio`, `phase`, `dwell`, `at`) it comes from, the stated `value` and a tolerance (standard T9). `text` is the sentence it supports. |
| `seeThrough` | Principle bodies drawn see-through on purpose (T10, transparency first): a part that would hide the principle behind it. |
| `exceptions` | The rare individual cases where a different construction is used instead of seeing through or moving a support (T12), each with its reason; the decision is made in the mechanism's issue. |

Teaching strings (labels, trace names, captions) state the mechanism, never its use (T15). Real-world context belongs
in `examples` and `real_world`.

### What stays prose

`summary`, `explain` (motion, forces, benefits, limits), `examples`, `build.defining_relations` and `build.notes` stay
prose. Anything a number in that prose depends on is a `teaching.claims` entry. Anything that the drawing needs
(a trace, an overlay, a view, a control) is structured, never prose.

### Validation (the catalogue validator)

- Every `a` and `b` of a joint is a body; every `in` of a block is a body, point, param or an earlier `out`; every
  point named by a trace, overlay, view highlight, plot or claim exists; every control maps to a driver, a param or a
  design choice; every `value` is within its `min` and `max`.
- The mobility counted from `bodies` and `joints` equals `dof` (K11). A mechanism with an overconstrained loop says so
  in `topology.notes`.
- `build.members` and `build.joints` are rejected; a `kin` block and a `teaching` block are required of every record at
  `record_version` 3; the old fields are accepted at version 2 until the cut-over removes the 2.5D engine.
- The vocabularies of the facets are unchanged. The new vocabularies are the joint types, block names, shape types,
  overlay kinds and view names above.

## Origin date

`origin` is the date of the mechanism's invention, its first patent or the earliest verifiable use or description,
whichever is earliest and can be found. It lives in the patch file `sources/origin.json` (keyed by id, `{ "origin":
{...} }`), which `npm run catalog` merges into each record; the validator fails a record without one.

- `date`: `YYYY-MM-DD` with a four-digit year. Years before the year 1 are negative (`-0250-12-16` is in 250 BC);
  there is no year 0.
- `precision`: `day` when the full date is known; `year` when only the year is known; `period` when only a period is
  known (for example "3rd century BC"), with a best-guess year in it. For `year` and `period` the month and day come
  from the id (`fillDate` in `src/catalog/origin.ts`), so a rerun gives the same date and the validator can check it.
- `note`: what the date is and its source URL, or "Best guess:" and why where nothing solid was found. A `period`
  note names the period.

## Added date

`added` is the day the mechanism's sheet went live, `YYYY-MM-DD`. It lives in the patch file `sources/added.json`
(keyed by id, `{ "added": "..." }`), which `npm run catalog` merges into each record. A record gets it in the change
that draws its mechanism; a test fails a drawn mechanism without one, and the validator fails one that is not a date.
The sheets drawn before the field existed have the day they first reached main, from the git history (and the first
Pages release, 2026-10-18, for the ones that were on main before it). The site reads it for the library's New order
and the Recovered badge a sheet wears for its first 7 days.

## Seasonal records

A seasonal record is a fictional mechanism for a holiday or special day (mechanism standard P14, which says what it may
do that other records may not): a record v3 like any other, with true kinematics, plus a `season` block and an
`images` list. The seasonal records themselves, their prose, design and image prompts, and what a duty class means
are in the seasonal catalogue (`data/catalog/holiday-catalogue.md`); their batch files are `sources/s*.json`.

```json
"season": {
  "occasion": "Halloween",
  "date_rule": "fixed, 31 October",
  "duty": "Commercial",
  "dates": [ { "start": "2026-10-31", "end": "2026-10-31" }, { "start": "2027-10-31", "end": "2027-10-31" } ]
},
"images": [
  { "prompt": "Behind-the-scenes photo in a haunted house attraction workshop, ...", "alt": "A coffin with its lid half open on a steel lever in a workshop", "file": "" }
]
```

| Field | Content |
|---|---|
| `season.occasion` | The holiday or special day the mechanism was made for. |
| `season.date_rule` | Prose: how the date is found each year (fixed date, "fourth Thursday in November", lunar or lunisolar). |
| `season.duty` | ONE value from DUTY. |
| `season.dates` | Each year's occurrence, `{ "start", "end" }` as `YYYY-MM-DD` (the same day for a one-day holiday), in order, written a few years ahead. A test fails once none starts within the next 13 months: add the next years then. |
| `images` | 2 to 4 generated images of the mechanism at work in its invented setting, never a drawing of it (the stage draws it): `prompt` (what the image is made from), `alt` (one plain sentence for the page), `file` (the WebP's name in `site/seasonal/`, `<id>-<n>.webp`; empty until the image is made and reviewed). |

The page shows the images that have a `file`, in place of references, photos and video and "In the real world". The
site lists a seasonal mechanism from 3 days before each occurrence's start to the end of the 2nd day after its end, by
the visitor's local date; out of its window the mechanism's page stays reachable and says when it comes back.

The validator checks the `season` block (an occasion and a date rule, the duty from DUTY, every date a real day, each
end on or after its start, the occurrences in order) and the images (2 to 4, each with a prompt and an alt, a `file`
that is a `.webp` name), and skips the minimum counts of `references`, `media` and `real_world`: a seasonal record
has none of them. `images` belong to a seasonal record only.

## LINKS MUST BE REAL

Every URL must come from a WebSearch result or a page you successfully fetched with WebFetch in this session.
Never type a URL from memory or guess a path. Shell curl is blocked; use the WebSearch / WebFetch tools.
For YouTube, use video URLs that appeared in search results (search e.g. "<mechanism> youtube"). If you cannot find
a solid link for a slot, give fewer links rather than an invented one. Wikipedia article URLs found via search are fine.

Do NOT call any mcp__hearthbot__ tools. Do not write anywhere except your output file.

## Controlled vocabularies (use exact spelling)

FAMILY: Linkage, Straight-line linkage, Quick-return, Gears, Intermittent, Cam, Coupling, Screw, Flexible drive,
  Friction drive, Escapement, Clutch & ratchet, Spatial linkage, Compliant
  (Intermittent = Geneva/mutilated gear/indexers; Clutch & ratchet = ratchets, sprags, freewheels, brakes;
   Coupling = shaft couplings & joints and coupled-wheel drives; Flexible drive = belt/chain/cable/rope;
   Spatial linkage = non-planar linkages like Sarrus, Bennett, wobble/swash plates when linkage-like.)

MOTION (input and output): Rotary, Oscillating, Linear, Intermittent rotary, Intermittent linear, Straight line, Path, Helical
  (Linear = to-and-fro or one-way translation of a slider; Straight line = a point of a linkage traces a straight
   line without a slide; Path = a point traces a curve, the curve is the product; Oscillating = rocking back and forth
   about an axis.)

CHARACTER (output_character, 1-3): Continuous, Reciprocating, Intermittent, Dwell, One-way, Variable speed,
  Quick-return, Harmonic, Constant velocity, Non-uniform, Reversing, Self-locking, Toggle

AXES (input vs output axis relation): Parallel, Coaxial, Perpendicular intersecting, Perpendicular skew,
  Angled intersecting, Offset parallel, Rotary-to-in-plane, Rotary-to-along-axis, Same line, n/a
  (Rotary-to-in-plane = linear output in the plane of rotation, e.g. slider-crank; Rotary-to-along-axis = linear
   output along the rotation axis, e.g. lead screw, barrel cam.)

RATIO_KIND: Reduction, Step-up, Unity, Selectable, Variable, Continuously variable, Stroke, Index step,
  Force amplification, Scaling, None

RATIO_CLASS: 1:1, Low (<5:1), Medium (5:1 to 50:1), High (50:1 to 500:1), Very high (>500:1), Variable, n/a

FUNCTION (1-4): Motion conversion, Speed reduction, Speed increase, Torque multiplication, Force amplification,
  Straight-line generation, Path generation, Function generation, Indexing, Dwell, Quick return, One-way drive,
  Locking, Clamping, Lifting, Walking, Scaling & copying, Drawing curves, Shaft coupling, Misalignment compensation,
  Differential & summing, Power splitting, Timing & regulation, Energy storage, Reversing, Positioning, Steering,
  Valve timing, Pumping & compression

PROPERTY (1-5): Exact, Approximate, Compact, Coaxial, High ratio, Low backlash, Self-locking, Backdrivable,
  Smooth (harmonic), Shock at engagement, Positive drive, Friction-based, Over-centre, Grashof, Non-Grashof,
  Singular positions, Balanced, Few parts, Precision, High load, Historic

APPLICATION (1-4): Automotive, Machine tools, Robotics, Clocks & watches, Packaging & automation, Aerospace,
  Agriculture, Printing & textiles, Film & optics, Steam & engines, Railways, Toys & kinetic art, Medical,
  Consumer products, Construction & lifting, Marine, Instruments, Energy, Education

PRECISION (origin.precision): day, year, period

DUTY (season.duty, seasonal records only): Domestic, Community, Commercial, Municipal

## Master list (ids, for "related")

four-bar, slider-crank, scotch-yoke, oscillating-cylinder, double-crank, double-rocker, parallelogram-linkage,
antiparallelogram, bell-crank, toggle-clamp, scissor-lift, pantograph, watt-six-bar, stephenson-six-bar, five-bar,
klann-linkage, jansen-linkage, ackermann-steering, rhombic-drive, elliptic-trammel,
watt-linkage, chebyshev-linkage, hoekens-linkage, roberts-linkage, evans-grasshopper, scott-russell, peaucellier-lipkin,
hart-inversor, sarrus-linkage, tusi-couple, crank-shaper, whitworth, drag-link-quick-return, offset-slider-crank,
walschaerts-valve-gear, bennett-linkage, wobble-box, walking-beam,
spur-gears, gear-train, internal-gear-pair, helical-gears, herringbone-gears, bevel-gears, hypoid-gears, worm-drive,
crossed-helical-gears, rack-pinion, rack-stroke-doubler, planetary, differential, harmonic-drive, cycloidal-drive,
non-circular-gears, sun-and-planet, wankel, ravigneaux,
cam-follower, flat-faced-cam, barrel-cam, face-groove-cam, desmodromic-cam, swash-plate, geneva, internal-geneva,
intermittent-gear, roller-gear-indexer, ratchet-pawl, sprag-clutch, anchor-escapement, lever-escapement,
verge-escapement, centrifugal-governor, star-wheel,
lead-screw, ball-screw, differential-screw, self-reversing-screw, belt-drive, chain-drive, chain-stroke-doubler,
block-and-tackle, oldham-coupling, universal-joint, double-cardan, hobsons-joint, rzeppa-cv-joint, schmidt-coupling,
friction-wheel-drive, cvt-belt, ball-disc-integrator, eccentric-sheave, locomotive-drive, flexure-hinge,
bistable-compliant

## real_world (YouTube videos since 2026-10-18)

0 to 3 YouTube videos of real footage of a named product or machine using the mechanism at work: a vehicle, engine,
machine tool, clock, industrial device, museum machine or a physical working build. No animations, CAD renders,
simulations or explainer graphics; a video that is mostly animation with a few seconds of footage does not count.
Different products per entry rather than three videos of one thing.
`{ "product": "Genie GS-1930 scissor lift", "maker": "Genie", "use": "one sentence on how the mechanism works in it",
   "url": "https://www.youtube.com/watch?v=<id>", "note": "optional caveat" }`
URLs are `https://www.youtube.com/watch?v=<id>`, `https://www.youtube.com/shorts/<id>` or `https://youtu.be/<id>`;
the validator rejects any other link here. Each video is found by search and confirmed to exist (its YouTube oEmbed
answers with the title) before it is added. Where nothing solid is found the list stays empty and the page shows no
"In the real world" section: no video is better than a wrong one.
Patch files sources/rw*.json (and gap*.json) are merged by `npm run catalog` (tools/catalog.ts): their `media`,
`references` and `real_world` entries are added by URL; sources/origin.json sets `origin` (see "Origin date"). Where research found fewer media or references than the
minimum allows, the patch entry says so with `"waive": ["media"]` (or `"references"`) and a `note`; the validator
then skips that count for the record.
