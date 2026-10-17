# Mechanism catalogue: record spec for research workers

You are researching a batch of mechanical mechanisms for an online mechanism library (a site that animates each
mechanism in 2D/pseudo-3D in one house style). Each mechanism becomes one JSON record. The records must later be
enough to BUILD the mechanism in the app: kinematic geometry, members, joints, ground/input/output, parameters
with sensible default values, motion range, and which overlays make sense.

Existing site code (read-only reference, do not edit): mechanism-site/src/mechanisms/*.js
If a mechanism in your batch is marked IN-SITE, read its file there and reuse its geometry/dimensions where possible
(the `build()` function holds the real link lengths) and set "in_site": true.

## Output

Write ONE JSON file (an array of records, in the order given) to the path you are told. Valid JSON, UTF-8, no comments.
Use plain prose in text fields (no em-dashes; use commas or "to"). Units: mm, degrees.

## Record schema

```json
{
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
    "ground": "what is fixed",
    "input": "member id and how it is driven (e.g. 'crank, continuous rotation about O2' or 'rocker oscillating ±30°')",
    "output": "member id and what is read off (e.g. 'slider position x', 'coupler point P path')",
    "members": [ { "id": "crank", "role": "driver|link|output|ground|slider|gear|cam|follower|pawl|spring|belt", "def": "geometry in words+numbers: 'O2→A, length a'" } ],
    "joints": [ { "id": "A", "type": "revolute|prismatic|pin-in-slot|gear mesh|cam contact|rolling|belt|screw|spherical|universal", "between": ["crank", "coupler"] } ],
    "params": [ { "name": "a", "value": 40, "unit": "mm", "note": "crank length" } ],
    "defining_relations": "the equations / constraints that make it work (e.g. Grashof s+l<=p+q; Hoekens ratios 1:2.5:2.5:2; Geneva c = r/sin(pi/n)); gear ratio formulas; cam law",
    "range": "motion range of input and output with default params (e.g. 'crank 360° continuous; rocker swings 41°')",
    "overlays": ["subset of: paths, velocity, forces, angles, plot"],
    "plot": "what output-vs-input plot to show, e.g. 'slider position vs crank angle'",
    "notes": "anything tricky for an animator: branch choice, singular positions, dwell, toggle, tooth counts that mesh"
  },
  "examples": [ { "use": "short real-world use", "detail": "where/how, 1 sentence" } ],
  "references": [ { "title": "...", "url": "https://...", "kind": "ONE of wikipedia|textbook|kmoddl|paper|standard|patent|museum|engineering-guide|calculator" } ],
  "media": [ { "title": "...", "url": "https://...", "kind": "ONE of video|photos|animation|interactive" } ],
  "related": ["ids of related mechanisms (from the master list below)"]
}
```

Counts: examples 2 to 4 real-world uses (industry or practical). references 2 to 5 (prefer Wikipedia + one hard
source: KMODDL/Cornell, university course page, textbook page, paper, standard (ISO/AGMA/DIN), patent, or a
manufacturer engineering guide). media 2 to 4: at least one VIDEO of the real thing in use or a real build, and at
least one page with PHOTOS of a real one (Wikimedia Commons category, museum page, manufacturer page). Animations
(e.g. Wikimedia gif pages, 507movements, Purdue, firgelliauto) are welcome but do not replace the real-use video.

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

## real_world (added 2026-10-16)

2 to 3 concrete products or machines that contain the mechanism, each linked:
`{ "product": "Genie GS-1930 scissor lift", "maker": "Genie", "use": "one sentence", "url": "https://...",
   "kind": "product|in-product|museum|real-video|case-study", "checked": true, "note": "optional caveat" }`
`checked` = the page was opened and shows the part; false = picked from a search result only.
Patch files sources/rw*.json (and gap*.json) are merged by `npm run catalog` (tools/catalog.ts): their `media`,
`references` and `real_world` entries are added by URL. Where research found no more than the minimum allows, the
patch entry says so with `"waive": ["real_world"]` (or `"media"`, `"references"`) and a `note`; the validator then
skips that count for the record.
