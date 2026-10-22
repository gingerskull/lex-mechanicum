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
  "related": ["ids of related mechanisms (from the master list below)"]
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
| `drivers` | The inputs. One or several (differential, ball-disc integrator): `id`, the `joint` driven, `kind` (`rotary`, `oscillating`, `linear`, `manual`), `range` (degrees or mm), `default`. An oscillating driver also gives `lo`, `hi`. A **selector** is a driver of `kind: "select"` with named `options` (`"1st"`, `"reverse"`), each setting the values of other drivers or params. |
| `solve` | The composition: a list of block instances in solve order. A **block** is one of `dyad`, `slider-dyad`, `gear-mesh`, `willis`, `hooke`, `homokinetic`, `bennett`, `cam`, `screw`, `convey`, `flexure`, `escapement`; `in` names the bodies, points and params it reads; `out` names the points and angles it produces; `branch` names the design choice that picks its root. Block inputs and outputs are the only names later blocks may read. |
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
the geometry; the drawing carries every built solid from its built frame to the new one.

**Outputs.** An `angle` of a body is its turn about its joint to the ground (else its first joint). An `angle` with `from`
and `to` points is the angle at `of` between the rays to them (a transmission angle, a rod's obliquity from a point on
the slide line); one with `minus` is that output less another angle output, wrapped to ±180° (a lead or lag). A
`position` of a prismatic joint is its slide. A `position` of a point with `axis` `x`, `y` or `z` (or `-x`, `-y`, `-z`,
a mirrored part read the same way round) is that component, with `axis: "radius"` its distance from `relativeTo` (the
origin without one), and with `relativeTo` alone the distance between the two points. A `speed-ratio` of a body is read
from its angle output.

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

**Claims.** A `dwell` with `band: [lo, hi]` is the longest stretch of the cycle with the output inside that range (a port
open while the swing is in a range); with a number it is the longest stretch the output holds within that much.
`time-ratio` is a reciprocating output's slow stroke over its quick one. `phase` with `from` and `to` (`max`, `min`) is
the cycle degrees from the one extreme forward to the other; with `against` (another output) the lag of the output's
first harmonic behind that one's, signed. `at` takes `at` or `input`. `when: { control, value }` checks the claim at
that setting of one of the teaching controls (a die position).

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
| `traces` | Teaching traces: a named `point`, optional `ticks` (every n degrees of input, equal time), `ghosts` for settings not selected (`control` and `value`), and `comet: true` on the first. A trace can be a point on a moving body (a point on a planet). |
| `overlays` | Construction overlays: `kind` is `line` (through two named points), `arc`, `circle`, `chord`, `dimension` (a moment arm, a length), `axis-line`, `workspace` (an outline traced by a named point over a range) or `bend` (a flexure's state). Each names its points and a short mechanics-only `label`. A posed overlay is drawn where an output reaches an extreme: `pose: { output, stat: "max" \| "min" }` for all its points, `fromPose` / `toPose` for each end (a dead-centre line, a stroke dimension); an `arc` with both runs on its point's own circle (`sweep: "cw"` or counter-clockwise: a cut or return arc). A `dimension` may measure one `component` (`x`, `y`, `z`: an offset) and reads the kinematic points' true distance. |
| `view` | The default named view (T7): `PLAN`, `FRONT`, `SIDE`, `ISOMETRIC`, `DIMETRIC`, `AUX <joint-id>`, or `VIEW az el` in degrees. |
| `views` | Section and detail views (T8): `kind` `section` (a cut `plane` of origin and normal) or `detail` (a window `center` and `scale`); `highlight` names bodies or points to draw with the highlight. |
| `controls` | The controls the page shows (T14): `kind` `driver`, `param`, `design` or `selector`, and the id it maps to. A mechanism's controls are only these. |
| `timeMap` | A playback rate near a feature (T13): the `span` of input degrees and the `slow` factor. It never changes `solve`. |
| `plot` | What the side panel plots: `x`, `y` (output ids) and a label, or a list: the first is the plot, `ghosts` on it draw the same output at other control settings (a family of curves), and a further entry in the same unit and range is drawn with it. |
| `claims` | Every number the explanation states, with the `output` and `stat` (`range`, `max`, `min`, `mean`, `ratio`, `time-ratio`, `phase`, `dwell`, `at`) it comes from, the stated `value` and a tolerance (standard T9). `text` is the sentence it supports. |
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

## Master list (ids, for "related")

four-bar, slider-crank, scotch-yoke, oscillating-cylinder, double-crank, double-rocker, parallelogram-linkage,
antiparallelogram, bell-crank, toggle-clamp, scissor-lift, pantograph, watt-six-bar, stephenson-six-bar, five-bar,
klann-linkage, jansen-linkage, ackermann-steering, rhombic-drive, elliptic-trammel,
watt-linkage, chebyshev-linkage, hoekens-linkage, roberts-linkage, evans-grasshopper, scott-russell, peaucellier-lipkin,
hart-inversor, sarrus-linkage, tusi-couple, crank-shaper, whitworth, drag-link-quick-return, offset-slider-crank,
walschaerts-valve-gear, bennett-linkage,
spur-gears, gear-train, internal-gear-pair, helical-gears, herringbone-gears, bevel-gears, hypoid-gears, worm-drive,
crossed-helical-gears, rack-pinion, planetary, differential, harmonic-drive, cycloidal-drive, non-circular-gears,
sun-and-planet, wankel, ravigneaux,
cam-follower, flat-faced-cam, barrel-cam, face-groove-cam, desmodromic-cam, swash-plate, geneva, internal-geneva,
intermittent-gear, roller-gear-indexer, ratchet-pawl, sprag-clutch, anchor-escapement, lever-escapement,
verge-escapement, centrifugal-governor, star-wheel,
lead-screw, ball-screw, differential-screw, belt-drive, chain-drive, block-and-tackle, oldham-coupling,
universal-joint, double-cardan, rzeppa-cv-joint, schmidt-coupling, friction-wheel-drive, cvt-belt, ball-disc-integrator,
eccentric-sheave, locomotive-drive, flexure-hinge, bistable-compliant

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
`references` and `real_world` entries are added by URL. Where research found fewer media or references than the
minimum allows, the patch entry says so with `"waive": ["media"]` (or `"references"`) and a `note`; the validator
then skips that count for the record.
