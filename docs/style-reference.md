# Style reference (blueprint / drafting)

```
version: 3.7
date: 2026-10-23
supersedes: 2.4 (the 2.5D renderer; 1.0 was the hand-off style reference of 2026-10-16)
```

The master reference for how the library **looks**: the mechanism drawings and the site around them. Parts I to V
are the rules and the architecture; Part VI holds the reference values the style files start from; Part VII the
checks. What a mechanism **is** (parts, assembly, detail, roles, accent flag, detail ladder) is in
`docs/mechanism-standard.md`; its section 9 holds the few look rules a mechanism build depends on. This document owns
everything else about the look.

Version 3.0 restates the drawing for true 3D parts: a depth-buffer renderer, a free orthographic camera with named views,
and section, detail and exploded views. The look stays the drafting look, judged by eye (SQ2). The requirement ids that
encoded the 2.5D scheme (SP10, SD1 to SD4, SD6, SD8, SD10 to SD12, SD17, SF10) are restated under their own ids; new
entries are SD19 to SD27, SS13 and SQ10 to SQ12. Part VI is generated from `src/style`; the knobs the new entries
need (peel depth, edge angle, section hatch, overlay and ghost-trace looks, view names) land there with the renderer
step and the tables regenerate with them.

Where this document and the code disagree on a **rule**, the document wins and the code is the bug. Where they
disagree on a **value**, the style files win (values are meant to be tuned) and Part VI is updated.

Requirement ids (SP1, SA4, SD9 ...) are stable so audits, issues and commits can cite them.

| Prefix | Part |
|---|---|
| SP | I. Principles |
| SA | II. Architecture: the style files |
| SF | III. Foundations: colour, type, line, scale |
| SD | IV. The mechanism drawing |
| SS | V. The site |
| SQ | VII. Verification |

---

# Part I. Principles (SP)

The library is a **drawing set**. Every mechanism is a technical drawing on a sheet; the site is the binder those
sheets live in. The brief: bold, crisp lines, loose-lined effects used sparingly; surface effects as soft dots and
dashes; transparency so the mechanism stays understandable; dark and light; monochrome or nearly so, colour only
where it means something.

| Id | Principle |
|---|---|
| SP1 | **The mechanism is the subject.** Every style choice is judged by whether the motion reads more clearly. Supporting things (motor, bracket, base furniture, sheet frame, grid, site chrome) are quieter than the mechanism but stay clearly visible. Nothing cosmetic distracts. |
| SP2 | **Monochrome ink on paper, one accent.** One ink colour per sheet does all the work, at different strengths. One accent marks the input, the traced path, the forces and the few interactive highlights. Roles are told apart by surface pattern and line weight, never by hue. |
| SP3 | **Bold and crisp first, loose sparingly.** Visible edges are bold, clean lines. Loose, hand-drafted touches are limited to the named list in SD9 and stay faint. |
| SP4 | **Transparency keeps the mechanism legible.** Surfaces are semi-transparent paper. An edge covered by a part becomes a dashed hidden line, so bearings, shanks and parts behind parts stay readable. |
| SP5 | **Drafting conventions, used honestly.** Hidden lines, chain centrelines, dimensions, title blocks, hatching and zone marks mean what they mean on a real drawing. Nothing that is not a drafting convention dresses up as one. |
| SP6 | **Two sheets, one drawing.** Blueprint (dark) and Drafting (light) share every weight, pattern, size and rule. Only colours differ. A change that works on one sheet only is not finished. |
| SP7 | **Minimal, monochrome industrial design** carries from the parts to the page: square corners, hairline rules, technical lettering, no ornament, generous space. |
| SP8 | **Every look value is a global parameter**, named in the style files, applied to every mechanism and page at once. Nothing is styled per mechanism; no stray literal in drawing or page code. |
| SP9 | **Correct depth, always.** Nothing paints in front of what it sits behind, at any camera, section or explode. An effect that breaks depth order is wrong whatever it looks like. |
| SP10 | **Orthographic only, freely oriented.** A turntable orbit about the mechanism that snaps to named views; parallel lines stay parallel; no perspective. |
| SP11 | **Richness is drawn, not styled.** Mechanical detail comes from real solids (the standard, section 6); the style never adds detail of its own and never hides what the build has, except through the detail ladder (SD18). |
| SP12 | **The principle always reads.** What carries the lesson is never hidden by hardware: a covering static solid is drawn see-through first, supports are moved out of the way second, and posts and plates are never removed (standard T10 to T12). Teaching content (traces, construction overlays, ghost paths, views) is drawn by the same drafting conventions as the rest and never as decoration (SP5). |

---

# Part II. Architecture: the style files (SA)

```
src/style/tokens.ts   TOKENS: { themes: { dark, light }, type, size }      palettes, type families, base sizes
src/style/form.ts     FORM: { base, chamfer, thread, fasteners, explode }  shapes geometry; read by build and renderer
src/style/draft.ts    DRAFT: { lines, fill, role, minPx, sketch, path, centre, dims, sheet, overlays, plot,
                               highlight, type }                             the renderer's knobs, colour by token name
src/style/detail.ts   DETAIL: the ordered ladder of rungs with selectors    standard 9b
site/styles/tokens.css   generated from TOKENS at build time, never edited
site/styles/*.css        base, layout, components: var(--…) and color-mix() of tokens only
```

| Layer | Owns | Must not contain | Read by |
|---|---|---|---|
| **Tokens** | The two theme palettes (paper, paper edge, ink, grid, accent, velocity, warn, ok ...), the type families, the base type sizes. Semantic names only. | Renderer knobs, layout, anything mechanism-specific. | Drawing style, site style, the build step. |
| **Form** | Renderer-independent finish of the physical parts: base-plate corner radius and margin, foot and mounting-hole sizes, chamfer sizes per part kind, thread visibility and pitch floor, fastener stage switches, explode gap and clearance. | Colour, opacity, line weight. | `src/rules`, `src/hardware`, the renderer. |
| **Drawing style** | Every knob of the renderer: line hierarchy, hidden-line and centreline dashes, surface fills and occlusion, role patterns, loose touches, traced path, dimensions, sheet frame and title block, overlays, the plot. Colour by token name. | Hex literals, DOM or CSS lookups, page layout. | `src/render`. |
| **Detail** | The ladder: ordered rungs, each with the solid kinds, roles, mark kinds and render effects it drops, and the view-aware exceptions. | Anything mechanism-specific. | The renderer, the bench, the site's adaptive dial. |
| **Site style** | Page layout, components, states, breakpoints, motion. Colours and fonts only through the generated custom properties. | Hex or rgba literals, knowledge of how a mechanism is drawn. | The browser. |
| **Records** (`src/mechanisms/*`) | Geometry, roles, materials, marks, `accent: true` on the input, detail rung overrides. | Any colour, weight, opacity, pattern, font. | The build and the renderer. |
| **Site code** | Behaviour: state, routing, theme switching, the adaptive dial. | Style values. Classes and data attributes only; inline `style=` only for live geometry (canvas size). | The browser. |

| Id | Requirement |
|---|---|
| SA1 | **One source per value.** Each palette colour, font family and shared size exists once, in the tokens. |
| SA2 | **Tokens are TypeScript, CSS is generated.** The renderer draws on canvases and the GPU, and its frame is planned in Node in tests, so it cannot read CSS. The site's `tokens.css` is generated from the tokens at build time (`:root` and `:root[data-theme="light"]` blocks, plus derived ink tiers). Never the other way round: no `getComputedStyle` in a renderer. |
| SA3 | **Semantic names:** `accent`, `ink`, `paper`, `warn`, `vel`, never `orange` or `red`. A theme maps names to values; code asks for the name. |
| SA4 | **Drawing style never reaches into the site, and the site never reaches into drawing style.** The only shared thing is the tokens. A legend swatch on the page uses the same token as the canvas line it explains. |
| SA5 | **Form is separate from look.** A value that changes geometry or what the build adds lives in form and applies everywhere. A value that changes only appearance lives in the drawing style. |
| SA6 | **Live-tunable.** The style objects stay reachable in the page as `STYLE.*` so values can be tried in the console and applied with a redraw, without reload. A tuning panel, if ever added, is a temporary dev aid that writes nothing. |
| SA7 | **Theme is one setting**, set in one place together with `document.documentElement.dataset.theme`; the renderer resolves colours through `theme()` per frame; every cached raster (paper, pattern tiles, thumbnails) keys on the theme. |
| SA8 | **No literals in drawing or page code.** Numbers that are style (widths, alphas, dashes, font sizes, radii, offsets) come from the style files. Geometry constants that are not style (τ, slice maths) are fine. The build fails on a colour, `rgb(` or font string outside `src/style` (SQ1). |
| SA9 | **Comment every knob** with what it does and its unit (mm, CSS px, degrees, 0..1 alpha). Units: geometry in mm, line weights and screen spacing in CSS px, patterns in mm with a px floor. |

---

# Part III. Foundations (SF)

## Colour

| Id | Rule |
|---|---|
| SF1 | **Paper, ink, accent** carry the whole drawing. Ink is used at different alphas for every line and pattern. Grid lines use the grid colour, softer than ink. |
| SF2 | **Accent use is reserved.** On drawings: the input shaft ring, the traced paths and the comet, force arrows, the highlighted joint callout. On the page: the kicker line, sheet numbers, the Recovered badge, the play button, card hover corner ticks, focus rings, the active-filter badge, explanation markers, the scrubber. Nothing else. |
| SF3 | **Secondary semantic colours** only where they carry meaning: `vel` (velocity arrows), `warn` (always amber: a force or angle out of range, a single-shear badge), `ok` (double-shear badge). They appear only with their overlay or badge. No red anywhere. |
| SF4 | **Blueprint stays dark and desaturated:** a grey slate blue, not a saturated cyanotype. The accent is toned to sit on it. |
| SF5 | **Contrast:** body text ≥ 4.5:1 on paper, secondary text ≥ 4.5:1 at its size, lines that carry meaning ≥ 3:1. Faint text is for labels only. |
| SF6 | **Both sheets are complete.** Every token has a value in both themes. Light-sheet patterns are scaled by `patternGain` so dots and hatching read the same weight on bright paper. |

## Type

| Id | Rule |
|---|---|
| SF7 | Three families, self-hosted subsets (no third-party font service): **IBM Plex Sans Condensed** (display: titles, card names, section heads; uppercase, tracking .01 to .02 em), **IBM Plex Sans** (body), **IBM Plex Mono** (technical lettering: labels, meta, controls, title blocks, dimensions, overlay labels, axis ticks; uppercase, tracking .04 to .14 em, tabular numbers). |
| SF8 | Canvas text uses the same families and sizes from the tokens, never a font string typed in renderer code. |
| SF9 | Hierarchy by size, weight and case, not colour: display 700 condensed uppercase; labels 500 mono uppercase tracked; body 400 at 15 px / 1.55. |

## Line and scale

| Id | Rule |
|---|---|
| SF10 | **One line hierarchy** for the whole drawing, thick to thin: outlines of the plate faces nearest the viewer → base outline → outlines of other nearest faces → back outlines of plates and silhouettes → hidden lines → centrelines, dimensions, marks, chamfers, threads, construction overlays. The page reuses the idea: `--line-2` for frames, `--line` for internal rules, dashed for secondary separators. |
| SF11 | **Spacing has a floor.** Any pattern, thread or repeated mark is drawn at its real size or at the px floor, whichever is coarser, so nothing turns to grey mush on thumbnails. A detail under about 1 mm on screen becomes one mark or nothing. |
| SF12 | **The grid** is the drafting sheet: a 12 px minor square with every 5th line major, centred on the drawing. The page background uses the same pitch, derived from one token. |

---

# Part IV. The mechanism drawing (SD)

A record supplies geometry, `role`, `kind`, `marks`, `accent`, detail rungs; the renderer decides the rest.

## Paint order of one frame

1. **Paper:** radial gradient paper → paper edge, then the grid (cached per theme and size).
2. **Construction lines** of the base plate (loose touch, SD9), under everything.
3. **Solids, by depth:** up to four surface layers are peeled from the camera and composited front to back; each layer
   is paper at its surface's opacity, with the role tint and pattern on faces within the set angle of the view, and
   walls shaded in steps by facing (walls inside holes darker).
4. **Edges:** bold and solid where nothing covers them, thin and dashed through the papers in front, plus the bold line
   at what the occluders let through (SD3); chamfers, threads and engraving as fine lines; the accent ring round the
   input shaft.
5. **Section cut faces** (SD19) hatched at 45° with their cut outlines, when a section view is on.
6. **Centrelines** along each joint axis (SD6).
7. **Dimensions** of the base plate in the named view (detail stage only).
8. **Paper tooth** over the drawing.
9. **Traces:** ghost paths, teaching traces with ticks, the comet, phantom positions, construction overlays, explode
   trail lines, the joint highlight callout (SD12, SD21 to SD24).
10. **Sheet frame**, zone marks, title block (detail stage only), with the view name and the detail dial position.
11. **Overlays:** forces, velocity, angles, labels.

## Requirements

| Id | Requirement |
|---|---|
| SD1 | **Depth order is sacred.** The depth buffer decides what is in front; there is no slicing and no painter's order, and no effect uses a depth bias. A new effect is inserted into the peeled composite or drawn as an annotation (steps 5 to 11), never layered over the finished frame in a way that reorders what it covers. |
| SD2 | **Surfaces are paper.** Every solid is filled with the paper colour at a set opacity (plates, others, base, walls). Plates hide more than small hardware. The base plate is the most transparent so the underside (motor, housings, cabling) still reads, and it lets a tenth of the lines under it through. A solid drawn see-through (it covers a working zone or a principle part, standard L5 and T10) takes half the paper and half the occlusion on every face in view, so what lies behind reads through it. |
| SD3 | **Visible and hidden edges by depth.** Every edge is classified by what covers it in the depth layers. An edge seen directly is bold and solid; the same edge seen through a part is thin and dashed, with the bold line at what the occluders let through (fractional occlusion, each occluder at its opacity). Fine detail (chamfers, threads, engraving) lives only in the visible class, so it disappears behind parts instead of turning into dashes. Edges are the cap outlines, the creases and the smooth-surface silhouettes of each solid, shipped or extracted once at setup. |
| SD4 | **Roles by surface, not colour.** Each role has a pattern registered to the part's own coordinates (it moves, rotates and foreshortens with the part): driver fine stipple, link sparse soft dots, output hatching, ground soft dashes, base a faint dot grid, bearing cross-hatch, hardware plain with a light tint, trace in the accent. Patterns go on the cap and primary faces within a set angle of the view, never on walls or faces turned edge-on. |
| SD5 | **One accent in the drawing:** the ring round the input shaft, the traced paths and comet, force arrows, the highlight callout. A second accent use needs a reason written here. While the drawing is paused, the input ring breathes slowly between full strength and a part of it (`lines.accentRing.breathe`); nothing else moves, the ring holds still while the drawing plays, and it never breathes under reduced motion. |
| SD6 | **Centrelines along joint axes** (long dash, short dash) through every joint head and along its axis, overshooting a little; hidden for an axis within a set angle of the view direction (it would foreshorten to a point) and when the drawing is too small to read them. |
| SD7 | **Traced paths** are a fine dotted accent line at the trace height; the first path gets the comet (tapering trail, open circle at the current point). The base plate keeps the path engraved as a mark (that is form, not overlay). |
| SD8 | **Dimensions:** overall base-plate width and depth in mm, with extension lines, gaps and filled arrowheads, labels on a paper knock-out. Detail stage only, in the named views where the base reads true (PLAN, FRONT, SIDE) and when it is not near edge-on. A dimension is labelled true size even when foreshortened. |
| SD9 | **Loose touches, the complete list:** (a) construction lines along the base plate's straight edges, running past the rounded corners; (b) a second, slightly offset pencil pass round the base outline. Nothing else is loose; a third needs a decision issue. |
| SD10 | **Sheet frame on the detail stage:** double border, zone ticks with numbers across and letters down, a microprint between the two borders (the 8-bit ASCII of "LEX MECHANICUM" as ones and zeros, broken at each zone mark and reading clockwise round the frame: a faint dotted rule at normal size, `sheet.microprint`), a title block bottom right (TITLE, DWG number (the sheet number, ST-07), SCALE computed from the projection, VIEW, SHEET n/N, DETAIL FULL or the rung, DATE the mechanism's origin as an Imperial date: the part of the year gone in thousandths, the year within its millennium and the millennium, `800.026.M3` for 20 October 2026, with 1 to 1000 BC in M0; an origin known only to the year or the period shows its filled date, as the record does). The block is 40% of the canvas width, at least 250 and at most 270 px. The view names are PLAN, FRONT, SIDE, ISOMETRIC, DIMETRIC, AUX ⟂ joint (an auxiliary view down a joint axis, named with the joint) and VIEW az/el for any other orientation (azimuth and elevation in degrees). A section or detail view gives its name in the VIEW cell (SECTION A-A, DETAIL B). Thumbnails get no frame, no title block, no dimensions. |
| SD11 | **Camera:** orthographic, a turntable orbit (yaw and tilt) that snaps to the named views of SD10; parallel lines stay parallel; patterns foreshorten with the angle and switch off near edge-on. The default view is the mechanism's own (standard T7). |
| SD12 | **Explode is a view state, not a style.** Parts move along their stack's joint axis by the rigid explode of the form style, each with a thin trail line to its assembled position; the drawing rules apply unchanged to exploded parts. |
| SD13 | **Supporting hardware reads quieter.** Motor internals are faint; hardware has no pattern; the base is the faintest surface. Brackets and tall parts still get full outlines and silhouettes. |
| SD14 | **Overlays use the sheet's colours:** forces in accent (warn when out of range), velocity in `vel`, angles in ink, labels in mono on a paper panel with an ink hairline. Overlays never change the drawing beneath. |
| SD15 | **Output plot** (detail side panel) is drawn on the sheet: ink grid dashed, curve in ink, current point in accent, mono labels. |
| SD16 | **Thumbnails and the detail stage share one renderer and one style.** The only differences are the annotation set (SD8, SD10), scale-dependent switches (SF11, SD6) and the card rules: a card (thumbnail and hover animation) draws at detail dial A-B (`card.detail`), sharp at full pixel ratio with wall shading, and its two bold outlines, `lines.plateTop` and `lines.baseTop`, are scaled by `card.plateTopFactor` and `card.baseTopFactor`. Never a second thumbnail style. Thumbnails are drawn to images by the same renderer and committed; they are redrawn when what they are drawn from changes. |
| SD17 | **Performance is part of the style.** Paper and pattern tiles are cached per theme and size; one GPU context serves a page and a session's geometry is uploaded once; a frame sends the pose and draws in a few instanced calls per target; nothing draws unless u, view or theme changed; no per-frame blur. A new effect that costs per-frame passes is measured with the browser bench before it lands; setup is measured split into decode, tessellate, edges and GPU (standard R6, R10). |
| SD18 | **The detail ladder** (standard 9b) is the only way the drawing drops anything. Render effects sit in the ladder at the rung their noticeability earns: paper grain in the first rung, wall shading and silhouettes on the layers behind the nearest and the DPR cap in the third, role patterns in the sixth, hidden lines in the seventh. The order is data in `src/style/detail.ts`. |
| SD19 | **Section views.** The record names a cut plane; solids on the near side are removed, the cut faces are hatched at 45° in ink with the cut outlines drawn bold, and what lies behind shows as in any other view. Cut faces never show through translucent plates: a section draws the cut outline and hatching of the cut solids only. |
| SD20 | **Detail views.** A magnified window of the drawing, framed and lettered (DETAIL B), drawn by the same renderer at a larger scale with its own line weights floor (SF11); the dial position applies as in the main view. |
| SD21 | **Phantom positions.** A part at an extreme position is shown as a thin, dashed outline in ink at the alpha of the hidden lines, with no fill, so the range of motion reads without a second copy of the part. |
| SD22 | **Construction overlays** (dead-centre lines, tangent lines, axis lines meeting at a turning centre, moment-arm dimensions, a workspace outline, a chord, a crank line) are drafting construction: fine dashed ink lines with mono labels on a paper panel, their points named in the record. They never change the drawing beneath. |
| SD23 | **Ghost traces.** The path of a setting that is not selected (a Walschaerts die at +1, 0 and -1; the full lemniscate of a Watt linkage) is a fine dashed accent line at a fraction of the trace alpha, drawn under the selected trace. |
| SD24 | **Teaching traces and ticks.** A teaching trace follows SD7; equal-time ticks are small ink cross-marks along it at equal steps of the input, so uneven speed reads as uneven spacing. |
| SD25 | **Same-role parts told apart by pattern variant or an index mark**, never by hue (a Schmidt coupling's two link sets): a role has a small set of registered pattern variants, and one bold index mark on a disc is a `mark`. |
| SD26 | **Highlights.** The part a view or a setting makes the point of (the open port, the loaded rocker, the load-carrying groove wall) is drawn with the accent ring or the highlight callout (SD5), the one accent use added by the teaching block. |
| SD27 | **Time map.** Playback slows near a declared feature; the drawing and the plot do not change, only the rate at which u advances; the scrubber shows the true input. |

---

# Part V. The site (SS)

The page is a **drawing set**: a gridded sheet (blueprint when dark, drafting paper when light). Each mechanism is a
numbered sheet with a title block; the header carries the set's own title block; controls look like drafting
instruments' labels, not app widgets. Square corners, hairline rules, condensed technical lettering, one accent.

| Id | Requirement |
|---|---|
| SS1 | **Library grid:** cards in an auto-fill grid (min 290 px, 20 px gap). A card is a sheet: the drawing in a framed field (4:3, a pre-rendered image until hover) with a title block under it: name (display, uppercase) and sheet number (mono, accent) on the first row, family · motion · level meta row, two-line summary, dashed tags. For its first 7 days (from its `added` date, counted in UTC when the page is viewed) a sheet wears a "Recovered" badge in the drawing's top left corner: mono uppercase in the accent with a hairline accent border on paper, the title-block lettering. Hover: ink border plus accent corner ticks at two opposite corners, and the drawing animates at the same dial and line weights as the thumbnail (`card.*`), so the swap does not jump. |
| SS2 | **Header:** kicker (mono, accent), large condensed uppercase title, short intro, and a set title block (mono grid of label/value cells). Search field and the Filters and Sort buttons in the same row. Below 1000 px the title block is one low strip across the header, its four cells in a row with dividers, shown at every width. |
| SS3 | **Sticky bar:** on the library, search, the Filters and Sort buttons and the sheet switch on one row, the switch at the right, the row on the same left and right edges as the header and the card grid; translucent paper with blur, hairline top and bottom. The search has a clear (x) at its right end while it holds text (Escape does the same); it empties the field and keeps the focus there. Once the bar sticks, the set's name and sheet count join the row at its left (not on a phone, where the row stays search, Filters, Sort and switch, the two buttons by name only). Filters hidden behind the button; facets open as chip rows in a scrollable panel with a "Clear all filters" button. Sort opens a menu of the orders, the current one pressed and ticked (a menu button: arrow keys, Home, End, Enter, Escape), and names it on the button above 1000 px: New (most recently added first, by default), Name A to Z, Oldest origin (once records carry origin dates), Sheet number. The order applies to what the search and filters show and stays as they change; clearing the filters returns it to New. When nothing matches, the grid says "No pattern found" and the status line keeps "Clear filters". The library keeps its filters, search and order in its address (`?<facet>=<value>`, `?q=<words>`, `?sort=<order>`, the default order left out), so a page can link to a filtered set. A mechanism page has no bar at the top: its sheet switch sits at the right of its name, and once the name scrolls away a compact bar slides in with the name (one line, cut with an ellipsis) and the switch. "Back to library" returns to the library as it was left, showing the card of the mechanism the visitor is on; Previous and Next step through what the library shows, in its order. |
| SS4 | **Controls:** segmented buttons and chips are square, hairline, mono uppercase; pressed = ink fill with paper text. Tags are dashed outlines, solid on hover. The play button is the one round control (accent outline, fills on hover). Range inputs use `accent-color` (accent for the scrubber, ink for view sliders). |
| SS5 | **Mechanism page order:** crumbs (back, prev / next), header (meta with sheet number and, in its first 7 days, the Recovered badge of SS1; title, summary), the stage (drawing sheet, 16:10, 4:3 on phones) with controls (play, scrubber, speed, the view modes, the orbit and the named views, explode, detail pin, the section and detail views the record declares, and the mechanism's own controls) and overlay chips whose legend swatch uses the overlay's own token and dash style; side panels (at a glance including the drive, its family, input, output and level linking to the library filtered by them; output plot); tags in a full-width band, one column per group (function, property, application, keywords), each tag linking to the library filtered or searched by it; explanation (numbered accent markers: motion, forces, benefits, limits, where you'll find it, in the real world); references, photos and video, animations. No parts list, no "how it is built", no joint sections. |
| SS6 | **Panels:** paper fill, hairline frame, a mono uppercase header strip with a rule under it; fact lists as label/value rows with dashed separators. |
| SS7 | **Theme switch** is one square button with one icon, a cog with a half-filled disc in its bore in the sheet's ink: as drawn (filled half to the right) on Drafting, turned 180° (filled half to the left) on Blueprint, so switching sheets turns it without animation; its name and tooltip say the sheet it switches to ("Switch to Blueprint", "Switch to Drafting"). Once the hidden Forge sheet is unlocked (SS14) the switch steps through three sheets, Blueprint, Drafting, Forge, and shows the cog a quarter turn (filled half down) on Forge. The choice is remembered per visitor (local storage, wrapped in try/catch), defaulting to the visitor's light/dark preference. Switching redraws every visible canvas and the page in one step. |
| SS8 | **Real pages:** one static page per mechanism at `/mechanisms/<id>/`, prev and next from the catalogue order, the library at `/`, and a 404 page (sheet ST-404, with the way to the library) for any other address. The engine loads only on the mechanism page or on card hover. |
| SS9 | **Responsive:** works at phone width with a 16 px side gutter (respecting safe areas) and no horizontal scroll; the mechanism layout drops to one column under 1000 px; the set title block hides under 640 px. The stage has three view modes: standard; Wide (above 1000 px only, remembered: the stage across the layout, at a glance (two thirds) and the plot side by side below it, the facts in a wrapping row where a short fact never wraps and a long one is sized to run to about two lines); full screen, where a short landscape screen puts the same controls in a rail beside the drawing with upright sliders (top is more) inside the safe areas. |
| SS10 | **Accessibility:** visible focus (dashed accent outline, 3 px offset); all controls are buttons with `aria-pressed` / `aria-expanded`; `prefers-reduced-motion` stops transitions and autoplay; contrast per SF5. |
| SS11 | **Motion on the page is minimal:** short colour and border transitions (≤ .2 s). The only continuous motion is the mechanisms themselves. |
| SS12 | **No colour or font literals in CSS** outside the generated tokens block. Component CSS uses `var(--…)` and `color-mix()` of tokens. The version shows in the footer, and under it, centred, the set's mark faded in the sheet's ink (`--mark`). The favicon is the same mark in the ink of the sheet that matches the browser's scheme. |
| SS14 | **Forge, the hidden third sheet.** Oxide-red paper, bone ink, brass accent (the `forge` theme of the tokens), so the drawings recolour with the page. It is unlocked by holding the sheet switch: after a second the cog, ring and half-disc, fills with brass in one sweep over two seconds, and at full the unlock moment plays (a shorter press is a plain switch; letting go during the fill does nothing; a mouse, a finger with no long-press menu, or Space or Enter held all work). Clicking the Rev cell of the library's title block 16 times, once per law, also unlocks it. The unlock is remembered per visitor; from then on the switch has three sheets. The hints: the cog glints brass once on a visitor's third visit; the developer console says the forge sleeps; a search that is a word of its lore (`site/src/lore.ts`: Mechanicus terms, places, people, the forge-world release names) shows a sealed state in place of the cards, and the 404 page a line, each with a faint hint phrase picked at random. The unlock moment (1.5 s) flickers twice, tears bands of the page sideways, splits red from blue and bursts into noise that settles on the Forge sheet, lit by the furnace. A click or a key skips it; under reduced motion it is a plain fade. While Forge is the sheet the page lives, subtly, in fixed layers that never take a click: fine grain, scanlines split warm and cool and drifting down, a soft band rolling down the screen, text fringed warm and cool, a slow shallow dimming, the furnace glow breathing at the edges, a blip every few seconds (a strip that dims or brightens, or a thin line), and a glitch pulse every 20 to 40 s (bands shift colour, the fringe widens). On the drawing a post-process adds grain and a red and blue split that swells down the rows, and tears bands at a blip or a pulse. It goes with the paper grain (rung A), so it is the first thing dropped when the device cannot keep up, and cards never draw it. Nothing flashes more than 3 times a second; under reduced motion nothing moves. Forge has no thumbnails or stills of its own: the Blueprint images are recoloured into its paper and ink. The public sheets, their thumbnails and their snapshots never change for it. This is the one exception to SS11. The knobs are in `src/style/forge.ts` (Part VI). |
| SS13 | **No engine mark.** One engine draws every page and card, so neither the title block nor a library card marks the engine that drew it. The 3D stamp of the transition left with the 2.5D engine at cut-over. |

---

# Part VI. Reference values

The values the style files hold, generated from `src/style` by `tools/style-table.ts` (`npm run check` fails when
these tables drift). Edit the style files, never this part. Units and uses come from the comments in the source
(SA9). The values started from the hand-off's drafting proposal (its code of 16 Oct 2026, with the amber warn
applied) and are tuned there.

## Theme palettes (tokens)

<!-- style-palettes:start (generated, do not edit) -->
| Token | Blueprint (dark) | Drafting (light) | Forge (forge, hidden) | Use |
|---|---|---|---|---|
| `bg` | `#0F1A26` | `#ECE9E0` | `#1E0F0C` | page background outside sheets |
| `paper` | `#142130` | `#F3F1EA` | `#2A1411` | sheets, cards, panels, surface fill on drawings |
| `paperEdge` | `#0C151F` | `#E6E2D6` | `#1F0E0B` | outer stop of the drawing's paper gradient |
| `ink` | `#E6EDF5` | `#1C2636` | `#F0DCCB` | all lines, patterns, text |
| `grid` | `#A9BCD2` | `#5B8BC4` | `#C8634A` | sheet grid, used at low alpha |
| `accent` | `#F29A6B` | `#D4472B` | `#E0A84E` | input ring, traced paths, forces, the page's few highlights (SF2, SD5) |
| `accentInk` | `#1A0E06` | `#FFF7F2` | `#1A0E06` | text on an accent fill |
| `vel` | `#9CCFE0` | `#2B6CB0` | `#8FD0C4` | velocity overlay |
| `warn` | `#FFC46B` | `#A8620B` | `#F7D774` | amber: out-of-range forces and angles, single-shear badge |
| `ok` | `#9FE8C8` | `#1F7A55` | `#A8E0B0` | double-shear badge |
| `patternGain` | 1 | 0.8 | 1 | 0..1 |
| `grain` | 0.035 | 0.05 | 0.04 | 0..1, overlay blend (draft.paper.grainBlend) |
<!-- style-palettes:end -->

Derived page tiers: alpha of ink (the grid tiers: alpha of `grid`), turned into colour-mixes in `tokens.css`.

<!-- style-tiers:start (generated, do not edit) -->
| Tier | Dark | Light | Forge | Use |
|---|---|---|---|---|
| `--body` | 0.82 | 0.84 | 0.84 | body text |
| `--muted` | 0.62 | 0.64 | 0.64 | secondary text |
| `--faint` | 0.42 | 0.45 | 0.46 | labels only (SF5) |
| `--line` | 0.2 | 0.2 | 0.2 | internal rules |
| `--line-2` | 0.38 | 0.42 | 0.4 | frames |
| `--surface` | 0.035 | 0.025 | 0.04 | faint panel fill |
| `--surface-2` | 0.08 | 0.06 | 0.09 | hover / pressed panel fill |
| `--mark` | 0.2 | 0.16 | 0.2 | the faded mark at the foot of every page |
| `--grid-1` | 0.06 | 0.08 | 0.07 | page grid, alpha of `grid` |
| `--grid-2` | 0.11 | 0.15 | 0.13 | page grid, alpha of `grid` |
<!-- style-tiers:end -->

## Type

<!-- style-type:start (generated, do not edit) -->
| Knob | Value | Unit and use |
|---|---|---|
| `tokens.type.display` | `"IBM Plex Sans Condensed", "Arial Narrow", system-ui, sans-serif` | titles, card names, section heads |
| `tokens.type.body` | `"IBM Plex Sans", "Helvetica Neue", system-ui, sans-serif` | running text |
| `tokens.type.mono` | `"IBM Plex Mono", ui-monospace, Menlo, monospace` | technical lettering, every canvas label |
| `tokens.type.weights.display` | [500, 600, 700] | CSS font-weight values shipped in the subset |
| `tokens.type.weights.body` | [400, 500, 600] |  |
| `tokens.type.weights.mono` | [400, 500, 600] |  |
| `tokens.type.leading` | 1.55 | body line height, unitless multiple of the font size |
| `tokens.type.tracking.display` | 0.015 | em, uppercase display lettering (.01 to .02) |
| `tokens.type.tracking.mono` | 0.08 | em, default for mono labels (.04 to .14) |
| `tokens.type.tracking.monoWide` | 0.14 | em, widest mono tracking (kickers, title-block keys) |
| `tokens.type.size.body` | 15 | px, body text |
| `tokens.type.size.titleKey` | 7 | px, title-block key |
| `tokens.type.size.titleValue` | 8.5 | px, title-block value |
| `tokens.type.size.zone` | 8.5 | px, sheet zone marks |
| `tokens.type.size.micro` | 3 | px, the microprint between the sheet frame's two borders |
| `tokens.type.size.dims` | 10 | px, dimension labels |
| `tokens.type.size.callout` | 9.5 | px, joint highlight callout |
| `tokens.type.size.overlay` | 11 | px, overlay labels |
| `tokens.type.size.overlaySmall` | 10 | px, small overlay labels (lines, dims) |
| `tokens.type.size.plot` | 10 | px, output plot labels |
<!-- style-type:end -->

## Drawing (draft)

<!-- style-drawing:start (generated, do not edit) -->
| Knob | Value | Unit and use |
|---|---|---|
| `draft.paper.centre` | [0.5, 0.45] | gradient centre as a fraction of canvas width, height |
| `draft.paper.radius` | 0.75 | gradient radius as a fraction of the larger canvas side |
| `draft.paper.grainTile` | 128 | px, side of the cached noise tile |
| `draft.paper.grainBlend` | `overlay` / `multiply` / `overlay` | composite operation of the paper tooth per sheet |
| `draft.grid.minorAlpha` | 0.07 | 0..1 |
| `draft.grid.majorAlpha` | 0.14 | 0..1 |
| `draft.grid.minorWidth` | 0.5 | px |
| `draft.grid.majorWidth` | 0.8 | px |
| `draft.card.detail` | `B` | detail dial position of a card drawing (DL): sharp, with wall shading |
| `draft.card.plateTopFactor` | 0.7 | factor on lines.plateTop on a card |
| `draft.card.baseTopFactor` | 0.7 | factor on lines.baseTop on a card |
| `draft.lines.plateTop` | 1.7 | px, bold top outline of plates |
| `draft.lines.otherTop` | 1.1 | px, top outline of everything else |
| `draft.lines.baseTop` | 1.5 | px, top outline of the base plate |
| `draft.lines.plateBottom` | 0.9 | px, bottom outline of plates (back edge included) |
| `draft.lines.bottomAlpha` | 0.75 | 0..1 |
| `draft.lines.silhouette` | 0.8 | px, vertical edges down the side walls |
| `draft.lines.silhouetteAlpha` | 0.8 | 0..1 |
| `draft.lines.edge` | 0.7 | px, visible bottom edges of non-plates |
| `draft.lines.edgeAlpha` | 0.7 | 0..1 |
| `draft.lines.chamfer` | 0.45 | px |
| `draft.lines.chamferAlpha` | 0.5 | 0..1 |
| `draft.lines.chamferMinScale` | 1.5 | px per mm, chamfer lines drawn only above this projection scale |
| `draft.lines.marks` | 0.6 | px, engraved marks |
| `draft.lines.marksAlpha` | 0.55 | 0..1 |
| `draft.lines.thread` | 0.5 | px, thread helices |
| `draft.lines.threadAlpha` | 0.45 | 0..1 |
| `draft.lines.baseChamferGain` | 0.7 | factor on chamferAlpha for the base plate |
| `draft.lines.baseMarksGain` | 0.75 | factor on marksAlpha for the base plate |
| `draft.lines.hidden.dash` | [3, 2.4] | dash px, factor, factor |
| `draft.lines.hidden.width` | 0.75 | dash px, factor, factor |
| `draft.lines.hidden.alpha` | 0.85 | dash px, factor, factor |
| `draft.lines.accentRing.color` | `accent` |  |
| `draft.lines.accentRing.width` | 1.8 | px |
| `draft.lines.accentRing.radius` | 0.62 | factor on the head's projected half-size, per axis |
| `draft.lines.accentRing.alpha` | 1 | 0..1 on the lines layer |
| `draft.lines.accentRing.hiddenAlpha` | 0.7 | 0..1 on the frame (shows through covering parts) |
| `draft.lines.accentRing.segments` | 72 | straight pieces of the ring |
| `draft.lines.accentRing.breathe.period` | 5 | s, 0..1, count per s |
| `draft.lines.accentRing.breathe.low` | 0.35 | s, 0..1, count per s |
| `draft.lines.accentRing.breathe.fps` | 15 | s, 0..1, count per s |
| `draft.fill.plate` | 0.64 |  |
| `draft.fill.other` | 0.8 |  |
| `draft.fill.base` | 0.96 | laid once, on the top face (the parts under it read only through `occlude.base`) |
| `draft.fill.wall` | 0.55 |  |
| `draft.fill.baseWallGain` | 0.8 | factor on `wall` for the base plate's walls |
| `draft.fill.wallOcclude` | 0.9 | factor on the occlusion for side walls |
| `draft.fill.occlude.plate` | 1 | the base lets a tenth of what is under it show through |
| `draft.fill.occlude.other` | 0.85 | the base lets a tenth of what is under it show through |
| `draft.fill.occlude.base` | 0.9 | the base lets a tenth of what is under it show through |
| `draft.fill.seeThrough.opacity` | 0.5 |  |
| `draft.fill.wallShade.shade` | 0.045 | 0..1 ink alpha |
| `draft.fill.wallShade.steps` | 5 | count of facing buckets |
| `draft.fill.wallShade.light` | [0.75, -0.25] | screen direction the light comes from (x right, y down), the wall facing it is lightest |
| `draft.fill.wallShade.outer.from` | 0.4 | factors, outer walls |
| `draft.fill.wallShade.outer.span` | 0.9 | factors, outer walls |
| `draft.fill.wallShade.hole.from` | 1.2 | factors, walls inside holes (darker) |
| `draft.fill.wallShade.hole.span` | 1 | factors, walls inside holes (darker) |
| `draft.role.driver.pattern` | `dots` |  |
| `draft.role.driver.step` | 1.3 |  |
| `draft.role.driver.alpha` | 0.55 |  |
| `draft.role.driver.tint` | 0.05 |  |
| `draft.role.link.pattern` | `dots` |  |
| `draft.role.link.step` | 2.4 |  |
| `draft.role.link.alpha` | 0.34 |  |
| `draft.role.link.tint` | 0 |  |
| `draft.role.link2.pattern` | `cross` | a second set of like links, told apart from the first (T16) |
| `draft.role.link2.step` | 2.6 | a second set of like links, told apart from the first (T16) |
| `draft.role.link2.alpha` | 0.3 | a second set of like links, told apart from the first (T16) |
| `draft.role.link2.tint` | 0 | a second set of like links, told apart from the first (T16) |
| `draft.role.output.pattern` | `hatch` |  |
| `draft.role.output.step` | 2.1 |  |
| `draft.role.output.alpha` | 0.3 |  |
| `draft.role.output.tint` | 0.03 |  |
| `draft.role.ground.pattern` | `dash` |  |
| `draft.role.ground.step` | 3.2 |  |
| `draft.role.ground.alpha` | 0.24 |  |
| `draft.role.ground.tint` | 0 |  |
| `draft.role.base.pattern` | `dots` |  |
| `draft.role.base.step` | 4 |  |
| `draft.role.base.alpha` | 0.18 |  |
| `draft.role.base.tint` | 0 |  |
| `draft.role.bearing.pattern` | `cross` |  |
| `draft.role.bearing.step` | 0.9 |  |
| `draft.role.bearing.alpha` | 0.22 |  |
| `draft.role.bearing.tint` | 0.06 |  |
| `draft.role.hw.pattern` | `none` |  |
| `draft.role.hw.tint` | 0.12 |  |
| `draft.role.trace.pattern` | `none` |  |
| `draft.role.trace.tint` | 0.2 |  |
| `draft.minPx` | 2.2 | px, a pattern step (and any repeated mark) is never drawn finer than this on screen (SF11) |
| `draft.pattern.offBelowCos` | 0.15 | patterns switch off when cos(tilt) is below this (near edge-on, SD11) |
| `draft.pattern.tile` | 24 | px, cached tile side (tile units below) |
| `draft.pattern.dotRadius` | 3.6 | tile px, soft dot radius |
| `draft.pattern.dotMid` | [0.55, 0.8] | gradient stop position and its alpha, soft dot falloff |
| `draft.pattern.lineWidth` | 2.2 | tile px, hatch, cross and dash strokes |
| `draft.pattern.dashes` | [[3, 10, 6], [15, 22, 18]] | tile px, dash segments as [x0, x1, y] |
| `draft.sketch.overshoot` | 14 | px, construction lines run this far past the base plate's corners |
| `draft.sketch.alpha` | 0.32 | 0..1 |
| `draft.sketch.width` | 0.55 | px |
| `draft.sketch.doubleOffset` | 0.7 | px, second pencil pass offset (x; y is -0.6 of it) |
| `draft.sketch.doubleOffsetY` | -0.6 | factor on doubleOffset for the y shift |
| `draft.sketch.doubleAlpha` | 0.3 | 0..1 |
| `draft.peel.layers` | 4 | count, depth layers peeled at full detail (at most 4) |
| `draft.peel.layersLow` | 2 | count, layers once rung C is dropped (the deep layers go with the wall shading) |
| `draft.peel.edgeEps` | 0.05 | mm, an edge is covered only by a surface nearer than its depth less this |
| `draft.peel.ownEps` | 0.3 | mm, extra margin for the faces of the edge's own solid (added to ownPx / s) |
| `draft.peel.ownPx` | 2.5 | px, margin for the faces of the edge's own solid, as a screen distance |
| `draft.camera.pad` | 28 | px, margin round the drawing when a view is fitted to the sheet |
| `draft.camera.snap` | 4 | degrees, a view this close to a named view is that view (title block, orbit snapping) |
| `draft.camera.views.PLAN` | [0, 0] | [yaw, tilt] degrees |
| `draft.camera.views.FRONT` | [0, 90] | [yaw, tilt] degrees |
| `draft.camera.views.SIDE` | [90, 90] | [yaw, tilt] degrees |
| `draft.camera.views.ISOMETRIC` | [45, 54.7356] | [yaw, tilt] degrees |
| `draft.camera.views.DIMETRIC` | [20.7, 70.5288] | [yaw, tilt] degrees |
| `draft.camera.auxMinCos` | 0.02 | an AUX view down an axis that stands this close to vertical turns the drawing's up to y |
| `draft.section.hatch.pitch` | 7 | px between lines, px, 0..1 ink |
| `draft.section.hatch.width` | 1.2 | px between lines, px, 0..1 ink |
| `draft.section.hatch.alpha` | 0.45 | px between lines, px, 0..1 ink |
| `draft.section.outline.width` | 1.6 | px, 0..1: the bold outline of a cut face |
| `draft.section.outline.alpha` | 1 | px, 0..1: the bold outline of a cut face |
| `draft.detailView.frame.width` | 1 | px, 0..1, px: the window's frame in the main view |
| `draft.detailView.frame.alpha` | 0.7 | px, 0..1, px: the window's frame in the main view |
| `draft.detailView.frame.dash` | [6, 3] | px, 0..1, px: the window's frame in the main view |
| `draft.detailView.minScale` | 1.5 | factor, the least magnification a detail view is drawn at |
| `draft.ghost.alpha` | 0.4 | factor on path.alpha, px, px |
| `draft.ghost.dash` | [3, 3] | factor on path.alpha, px, px |
| `draft.ghost.width` | 1 | factor on path.alpha, px, px |
| `draft.phantom.dash` | [4, 3] | px, px, factor on the hidden lines' alpha |
| `draft.phantom.width` | 0.8 | px, px, factor on the hidden lines' alpha |
| `draft.phantom.alpha` | 0.85 | px, px, factor on the hidden lines' alpha |
| `draft.tick.half` | 3.5 | px half length of the cross mark, px, 0..1 ink |
| `draft.tick.width` | 1 | px half length of the cross mark, px, 0..1 ink |
| `draft.tick.alpha` | 0.8 | px half length of the cross mark, px, 0..1 ink |
| `draft.trail.width` | 0.7 | px, 0..1, px: explode trail lines |
| `draft.trail.alpha` | 0.55 | px, 0..1, px: explode trail lines |
| `draft.trail.dash` | [2, 3] | px, 0..1, px: explode trail lines |
| `draft.path.color` | `accent` |  |
| `draft.path.dash` | [1.5, 3.5] | px |
| `draft.path.width` | 1 | px |
| `draft.path.alpha` | 0.55 | 0..1 |
| `draft.path.otherGain` | 0.8 | factor on alpha for every path after the first |
| `draft.path.comet` | 2.6 | px, comet trail width at the head |
| `draft.path.cometMin` | 0.4 | px, comet trail width at the tail |
| `draft.path.cometAlpha` | 0.95 | 0..1 at the head, fading to 0 |
| `draft.path.cometSamples` | 80 | count, longest trail in path samples (at most half the path) |
| `draft.path.headR` | 2.6 | px, open circle at the current point |
| `draft.path.headStroke` | 1.2 | px |
| `draft.centre.dash` | [9, 2.5, 1.5, 2.5] | px, long dash, gap, short dash, gap |
| `draft.centre.width` | 0.6 | px |
| `draft.centre.alpha` | 0.5 | 0..1 |
| `draft.centre.overshoot` | 6 | px past the head |
| `draft.centre.endOnDeg` | 8 | degrees, an axis this close to the view direction is drawn as a centre cross (3D renderer) |
| `draft.centre.cross` | 6 | px, half length of the centre cross seen end-on (3D renderer) |
| `draft.centre.minScale` | 0.8 | px per mm, hidden when the drawing is smaller than this |
| `draft.dims.offset` | 18 | px, dimension line distance from the plate |
| `draft.dims.gap` | 3 | px, gap between the plate and an extension line |
| `draft.dims.ext` | 5 | px, extension line past the dimension line |
| `draft.dims.alpha` | 0.6 | 0..1 |
| `draft.dims.width` | 0.7 | px |
| `draft.dims.arrow` | 7 | px, filled arrowhead length |
| `draft.dims.arrowAngle` | 0.3 | radians, arrowhead half-angle |
| `draft.dims.labelPad` | 8 | px, extra knock-out width round a label |
| `draft.dims.labelH` | 12 | px, knock-out height |
| `draft.dims.labelPaper` | 0.95 | 0..1, paper alpha of the knock-out |
| `draft.dims.labelGain` | 0.25 | added to alpha for the label text (capped at 1) |
| `draft.dims.minDepthPx` | 40 | px, depth label only when the projected depth is at least this |
| `draft.sheet.inset` | 10 | px, outer border from the canvas edge |
| `draft.sheet.innerOffset` | 4 | px, inner border inside the outer one |
| `draft.sheet.outer.width` | 1 | px, 0..1 |
| `draft.sheet.outer.alpha` | 0.55 | px, 0..1 |
| `draft.sheet.inner.width` | 0.5 | px, 0..1 |
| `draft.sheet.inner.alpha` | 0.3 | px, 0..1 |
| `draft.sheet.zones` | true | zone ticks with numbers across and letters down |
| `draft.sheet.zonePitch` | 140 | px, target zone width (at least 2 zones each way) |
| `draft.sheet.zoneTick` | 4 | px |
| `draft.sheet.zoneAlpha` | 0.45 | 0..1, zone labels |
| `draft.sheet.zoneLabelInset` | 2.5 | px from the border |
| `draft.sheet.microprint.color` | `grid` | token, 0..1, px clear of a zone mark or a corner |
| `draft.sheet.microprint.alpha` | 0.5 | token, 0..1, px clear of a zone mark or a corner |
| `draft.sheet.microprint.gap` | 3 | token, 0..1, px clear of a zone mark or a corner |
| `draft.sheet.titleBlock` | true |  |
| `draft.sheet.titleMinCanvas` | 420 | px, title block only on canvases wider than this |
| `draft.sheet.titleMaxW` | 270 | px, block width cap |
| `draft.sheet.titleMinW` | 250 | px, block width floor, so the DATE cell holds its date on a narrow stage |
| `draft.sheet.titleWFrac` | 0.4 | fraction of canvas width, block width between the two |
| `draft.sheet.titleRow` | 15 | px, row height (4 rows) |
| `draft.sheet.titleSplit` | 0.6 | fraction of block width where the second column starts |
| `draft.sheet.titlePaper` | 0.92 | 0..1, paper alpha of the block |
| `draft.sheet.titleRule.width` | 0.8 | px, 0..1 |
| `draft.sheet.titleRule.alpha` | 0.6 | px, 0..1 |
| `draft.sheet.titleKeyAlpha` | 0.5 | 0..1 |
| `draft.sheet.titleValueAlpha` | 0.9 | 0..1 |
| `draft.sheet.titleKeyX` | 4 | px, key inset |
| `draft.sheet.titleKeyY` | 5 | px, key baseline from the row top |
| `draft.sheet.titleValueX` | 40 | px, value inset |
| `draft.sheet.titleValueMargin` | 44 | px, value truncated to the cell width less this |
| `draft.sheet.elevationTilt` | 80 | degrees, the side view of the detail ladder at or above this tilt |
| `draft.overlays.forces.color` | `accent` |  |
| `draft.overlays.forces.alpha` | 1 |  |
| `draft.overlays.forcesWarn.color` | `warn` |  |
| `draft.overlays.forcesWarn.alpha` | 1 |  |
| `draft.overlays.angles.color` | `ink` |  |
| `draft.overlays.angles.alpha` | 0.9 |  |
| `draft.overlays.velocity.color` | `vel` |  |
| `draft.overlays.velocity.alpha` | 1 |  |
| `draft.overlays.panel.color` | `paper` | label panel fill |
| `draft.overlays.panel.alpha` | 0.92 | label panel fill |
| `draft.overlays.border.color` | `ink` | label panel hairline |
| `draft.overlays.border.alpha` | 0.35 | label panel hairline |
| `draft.overlays.width` | 1.6 | px, force and velocity arrows |
| `draft.overlays.arrow` | 10 | px, force arrowhead |
| `draft.overlays.arrowDim` | 7 | px, dimension arrowheads |
| `draft.overlays.shortLine` | 70 | px, a construction line shorter than this carries its label past its far end |
| `draft.overlays.shortGap` | 8 | px, gap from that end to the label |
| `draft.overlays.arrowAngle` | 0.42 | radians, arrowhead half-angle |
| `draft.overlays.angleR` | 22 | mm, default angle arc radius |
| `draft.overlays.angleGuide.width` | 1 | px, 0..1, px, factor on radius |
| `draft.overlays.angleGuide.alpha` | 0.55 | px, 0..1, px, factor on radius |
| `draft.overlays.angleGuide.dash` | [3, 3] | px, 0..1, px, factor on radius |
| `draft.overlays.angleGuide.reach` | 1.5 | px, 0..1, px, factor on radius |
| `draft.overlays.angleArc` | 1.8 | px |
| `draft.overlays.bend.width` | 1.4 | px, 0..1, count: a flexure's bent centreline and stress zone ticks |
| `draft.overlays.bend.zoneAlpha` | 0.35 | px, 0..1, count: a flexure's bent centreline and stress zone ticks |
| `draft.overlays.bend.ticks` | 5 | px, 0..1, count: a flexure's bent centreline and stress zone ticks |
| `draft.overlays.line.width` | 1 | px, 0..1, px |
| `draft.overlays.line.alpha` | 0.6 | px, 0..1, px |
| `draft.overlays.line.dash` | [4, 4] | px, 0..1, px |
| `draft.overlays.dimWidth` | 1 | px |
| `draft.overlays.velocityLen` | 34 | px, arrow length at the point's peak speed |
| `draft.overlays.velocityMin` | 2 | px, shorter arrows are not drawn |
| `draft.overlays.labelPadX` | 6 | px, text inset in the panel |
| `draft.overlays.labelH` | 19 | px, panel height |
| `draft.overlays.labelHSmall` | 17 | px, small panel height |
| `draft.overlays.labelBorder` | 0.8 | px, panel hairline width |
| `draft.overlays.labelEdge` | 4 | px, labels kept this far inside the canvas |
| `draft.overlays.labelSpacing` | 3 | px, gap when a label is pushed below another |
| `draft.plot.margin.left` | 40 | px |
| `draft.plot.margin.right` | 8 | px |
| `draft.plot.margin.top` | 8 | px |
| `draft.plot.margin.bottom` | 22 | px |
| `draft.plot.grid.width` | 1 | px, 0..1, px |
| `draft.plot.grid.alpha` | 0.14 | px, 0..1, px |
| `draft.plot.grid.dash` | [2, 3] | px, 0..1, px |
| `draft.plot.labelAlpha` | 0.5 | 0..1, axis tick labels |
| `draft.plot.curve.width` | 1.6 | px, 0..1, ink |
| `draft.plot.curve.alpha` | 0.95 | px, 0..1, ink |
| `draft.plot.ghost.width` | 1 | px, 0..1, px: the same output at the settings not selected |
| `draft.plot.ghost.alpha` | 0.45 | px, 0..1, px: the same output at the settings not selected |
| `draft.plot.ghost.dash` | [3, 3] | px, 0..1, px: the same output at the settings not selected |
| `draft.plot.second.width` | 1.2 | px, 0..1, px: a further output in the same unit |
| `draft.plot.second.alpha` | 0.7 | px, 0..1, px: a further output in the same unit |
| `draft.plot.second.dash` | [7, 3] | px, 0..1, px: a further output in the same unit |
| `draft.plot.hatch.pitch` | 5 | px, px, 0..1, hatching under the curve |
| `draft.plot.hatch.width` | 0.7 | px, px, 0..1, hatching under the curve |
| `draft.plot.hatch.alpha` | 0.18 | px, px, 0..1, hatching under the curve |
| `draft.plot.cursorAlpha` | 0.6 | 0..1, accent cursor line |
| `draft.plot.pointR` | 4 | px, current point in accent |
| `draft.plot.pad` | 0.08 | fraction of the value range added above and below |
| `draft.plot.ticks` | 3 | count, target value gridlines |
| `draft.plot.dprMax` | 2 | device pixel ratio cap of the plot canvas |
| `draft.highlight.color` | `accent` |  |
| `draft.highlight.r` | 18 | px, dashed circle radius |
| `draft.highlight.dash` | [4, 3] | px |
| `draft.highlight.width` | 1.3 | px |
| `draft.highlight.alpha` | 0.95 | 0..1 |
| `draft.highlight.leader` | [13, 30, 52] | px, leader start (diagonal), elbow, end (horizontal) |
| `draft.highlight.labelOffset` | 32 | px, label position right of and above the head |
| `draft.type.uppercase` | true | canvas lettering is uppercase (SF7) |
| `draft.type.titleKey.family` | `mono` |  |
| `draft.type.titleKey.weight` | 500 |  |
| `draft.type.titleKey.size` | `titleKey` |  |
| `draft.type.titleValue.family` | `mono` |  |
| `draft.type.titleValue.weight` | 600 |  |
| `draft.type.titleValue.size` | `titleValue` |  |
| `draft.type.zone.family` | `mono` |  |
| `draft.type.zone.weight` | 500 |  |
| `draft.type.zone.size` | `zone` |  |
| `draft.type.micro.family` | `mono` |  |
| `draft.type.micro.weight` | 500 |  |
| `draft.type.micro.size` | `micro` |  |
| `draft.type.dims.family` | `mono` |  |
| `draft.type.dims.weight` | 500 |  |
| `draft.type.dims.size` | `dims` |  |
| `draft.type.callout.family` | `mono` |  |
| `draft.type.callout.weight` | 600 |  |
| `draft.type.callout.size` | `callout` |  |
| `draft.type.overlay.family` | `mono` |  |
| `draft.type.overlay.weight` | 500 |  |
| `draft.type.overlay.size` | `overlay` |  |
| `draft.type.overlaySmall.family` | `mono` |  |
| `draft.type.overlaySmall.weight` | 500 |  |
| `draft.type.overlaySmall.size` | `overlaySmall` |  |
| `draft.type.plot.family` | `mono` |  |
| `draft.type.plot.weight` | 500 |  |
| `draft.type.plot.size` | `plot` |  |
<!-- style-drawing:end -->

## Form values the drawing depends on

<!-- style-form:start (generated, do not edit) -->
| Knob | Value | Unit and use |
|---|---|---|
| `form.chamfer.scale` | 1.5 | factor |
| `form.chamfer.plate` | 0.8 | mm |
| `form.chamfer.standoff` | 0.6 | mm |
| `form.chamfer.washer` | 0.35 | mm |
| `form.chamfer.tube` | 0.5 | mm |
| `form.chamfer.head` | 0.45 | mm |
| `form.chamfer.button` | 0.6 | mm |
| `form.chamfer.csk` | 0 | mm, countersunk heads get none |
| `form.thread.pitch` | function (see source) | mm, ISO coarse pitch for Ø d mm |
| `form.explode.gap` | 11 | mm per explode level at full explode |
| `form.explode.clear` | 0.5 | levels, how far a screw backs out past the topmost part it passes |
<!-- style-form:end -->

## Detail ladder

The order of the rungs is the one in standard 9b; re-ranking a rung is a change to `src/style/detail.ts` only.

<!-- style-ladder:start (generated, do not edit) -->
| Rung | What stops being drawn | Selectors | Exceptions |
|---|---|---|---|
| A | Paper grain, bearing balls and cages, motor internals | kinds: bearingBalls, bearingCage, motorInternal; effects: grain |  |
| B | Manufacturing marks | marks: chamfer, boreEntry, headFlute, hexSocket, knurl, keyway, thread | atSide: skip |
| C | Wall shading, deep depth layers | effects: wallShade, deepLayers |  |
| D | Stack hardware inside a joint | kinds: spacer, washer, thrustWasher, waveWasher, sleeve, shim, circlipInternal | whenExplode: draw |
| E | Service and sensing parts, timing marks | kinds: nipple, felt, wiper, flag, sensor, terminalBlock, cableClip, lead; marks: oilSink, timing |  |
| F | Role surface patterns | effects: rolePatterns |  |
| G | Hidden lines, full pixel ratio | effects: hiddenLines, fullDpr |  |
| H | Retention and adjustment parts | kinds: circlipExternal, retainerPlate, nut, setScrew, collar, eccentric, gib, stop, bumper, spring, wearStrip, dowel, spigot |  |
<!-- style-ladder:end -->

## Site

<!-- style-site:start (generated, do not edit) -->
| Knob | Value | Unit and use |
|---|---|---|
| `tokens.size.grid` | 12 | px, sheet grid minor pitch, canvas and page (SF12) |
| `tokens.size.gridMajor` | 5 | count, minor squares per major line |
| `tokens.size.maxWidth` | 1280 | px, page content width |
| `tokens.size.cardMin` | 290 | px, minimum card width in the library grid |
| `tokens.size.gap` | 20 | px, card grid and mechanism layout gap |
| `tokens.size.headerPadY` | 30 | px, header vertical padding |
| `tokens.size.headerPadX` | 22 | px, header horizontal padding |
| `tokens.size.barPad` | 9 | px, sticky bar row padding |
| `tokens.size.side` | 330 | px, mechanism page side column |
| `tokens.size.gutter` | 16 | px, phone side gutter (SS9) |
| `tokens.size.play` | 38 | px, play button diameter, the one round control |
| `tokens.size.marker` | 30 | px, explanation marker diameter |
| `tokens.size.bpWide` | 1000 | px, mechanism layout drops to one column below this |
| `tokens.size.bpPhone` | 640 | px, phone layout below this |
| `tokens.size.focusOffset` | 3 | px, focus outline offset (SS10) |
| `tokens.size.mark` | 44 | px, side of the faded mark at the foot of every page |
| `tokens.size.transition` | 0.2 | s, colour and border transitions (SS11) |
| `tokens.size.stage` | `16 / 10` | aspect ratio of the stage |
| `tokens.size.stagePhone` | `4 / 3` | stage under bpPhone, and the card drawing field |
<!-- style-site:end -->

## Forge (hidden sheet)

The unlock, the moment and the living effects of SS14; the colours are the `forge` columns above.

<!-- style-forge:start (generated, do not edit) -->
| Knob | Value | Unit and use |
|---|---|---|
| `forge.unlock.holdDelay` | 1 | s, a hold on the sheet switch before the cog starts to fill (a shorter press is a plain switch) |
| `forge.unlock.holdFill` | 2 | s, the cog filling with brass, ring and half-disc, in one sweep; at full the moment plays |
| `forge.unlock.holdSlop` | 10 | px, a finger that moves further than this is scrolling, not holding |
| `forge.unlock.glintVisit` | 3 | count, the page load on which the cog glints once, as a hint, while Forge is still locked |
| `forge.unlock.glint` | 1.4 | s, the glint |
| `forge.unlock.clicks` | 16 | count, one per law |
| `forge.unlock.resetAfter` | 4 | s, a pause this long between clicks starts the count again |
| `forge.unlock.moment` | 1.5 | s, the whole unlock moment |
| `forge.unlock.switchAt` | 0.55 | s into the moment, the sheet turns to Forge under the noise |
| `forge.unlock.flickers` | [0.12, 0.42] | s into the moment, the two brightness dips |
| `forge.unlock.flickerLength` | 0.07 | s, one dip |
| `forge.unlock.flickerDepth` | 0.4 | 0..1, alpha of the background colour over the page at a dip |
| `forge.unlock.noise` | 0.5 | 0..1, alpha of the noise burst at its height, settling to the living grain |
| `forge.unlock.tear` | 34 | px, the widest sideways tear of a band of the page |
| `forge.unlock.split` | 5 | px, the widest red and blue split |
| `forge.unlock.glow` | 0.9 | s, the furnace glow coming up at the end |
| `forge.unlock.fade` | 0.4 | s, the whole moment under reduced motion: a plain fade |
| `forge.page.grain.alpha` | 0.085 | 0..1 noise (overlay blend), px noise tile, steps per s |
| `forge.page.grain.tile` | 160 | 0..1 noise (overlay blend), px noise tile, steps per s |
| `forge.page.grain.fps` | 12 | 0..1 noise (overlay blend), px noise tile, steps per s |
| `forge.page.scanlines.alpha` | 0.07 | 0..1 of each colour, px, s |
| `forge.page.scanlines.pitch` | 3 | 0..1 of each colour, px, s |
| `forge.page.scanlines.drift` | 6 | 0..1 of each colour, px, s |
| `forge.page.roll.alpha` | 0.05 | 0..1 of the accent, px, s: a soft band rolling down the screen |
| `forge.page.roll.height` | 160 | 0..1 of the accent, px, s: a soft band rolling down the screen |
| `forge.page.roll.period` | 13 | 0..1 of the accent, px, s: a soft band rolling down the screen |
| `forge.page.aberration.shift` | 0.6 | px, px at a glitch pulse, 0..1: text fringed warm and cool |
| `forge.page.aberration.pulse` | 1.8 | px, px at a glitch pulse, 0..1: text fringed warm and cool |
| `forge.page.aberration.alpha` | 0.4 | px, px at a glitch pulse, 0..1: text fringed warm and cool |
| `forge.page.vignette.alpha` | 0.5 | 0..1 of bg in the corners, fraction of the half-diagonal where it begins |
| `forge.page.vignette.start` | 0.55 | 0..1 of bg in the corners, fraction of the half-diagonal where it begins |
| `forge.page.glow.alpha` | 0.12 | 0..1 of the accent, px, 0..1 at its faintest, s per breath |
| `forge.page.glow.size` | 150 | 0..1 of the accent, px, 0..1 at its faintest, s per breath |
| `forge.page.glow.low` | 0.7 | 0..1 of the accent, px, 0..1 at its faintest, s per breath |
| `forge.page.glow.period` | 4.6 | 0..1 of the accent, px, 0..1 at its faintest, s per breath |
| `forge.page.flicker.depth` | 0.04 | 0..1 of bg at the deepest, s for one slow irregular cycle |
| `forge.page.flicker.period` | 7.3 | 0..1 of bg at the deepest, s for one slow irregular cycle |
| `forge.page.blips.every` | [3, 8] | s, s, px, 0..1 |
| `forge.page.blips.length` | 0.09 | s, s, px, 0..1 |
| `forge.page.blips.height` | [24, 90] | s, s, px, 0..1 |
| `forge.page.blips.depth` | 0.07 | s, s, px, 0..1 |
| `forge.page.glitch.every` | [20, 40] | s, s, count, px, deg |
| `forge.page.glitch.length` | 0.18 | s, s, count, px, deg |
| `forge.page.glitch.bands` | 3 | s, s, count, px, deg |
| `forge.page.glitch.height` | [3, 22] | s, s, count, px, deg |
| `forge.page.glitch.hue` | 28 | s, s, count, px, deg |
| `forge.canvas.grain` | 0.05 | 0..1, noise added to every pixel |
| `forge.canvas.chroma` | 1.1 | px, red and blue pulled apart, always |
| `forge.canvas.wobble` | 0.7 | px, how much the split swells and shrinks down the rows |
| `forge.canvas.wobbleRows` | 37 | px, rows per swell |
| `forge.canvas.blip` | 0.35 | 0..1, a blip's strength on the drawing (a glitch pulse is 1) |
| `forge.canvas.glitchChroma` | 4 | px, at a glitch pulse |
| `forge.canvas.tear` | 12 | px, the shift of a torn band at a glitch pulse |
| `forge.canvas.band` | 7 | px, height of a band that may tear |
| `forge.canvas.tornShare` | 0.22 | 0..1, share of the bands torn at a pulse |
<!-- style-forge:end -->

---

# Part VII. Verification (SQ)

| Id | Check | Pass |
|---|---|---|
| SQ1 | Literal scan: a colour (`#…`, `rgb(`) or a font family string outside `src/style` and the generated CSS | No hits in renderer, site code, component CSS or records (pattern tiles may build `rgba()` strings from token values) |
| SQ2 | Look match | The four pilots, side by side with the hand-off proposal at plan, an isometric view and side view in both sheets, read as the same style and overall look to the eye. Not pixel for pixel. |
| SQ3 | One-knob test | Changing `tokens.themes.dark.accent` changes the input ring, paths, forces, play button, kicker, sheet numbers and focus ring together, and nothing else. Changing `draft.lines.plateTop` changes every mechanism. |
| SQ4 | Theme switch | Every visible card and the stage redraw in the new theme with no stale cached paper, patterns or thumbnails. |
| SQ5 | Headless | Checks, clearance, packaging and audit generation run in Node (style must not need the DOM); the bench, shots and snapshots draw in local Chrome. |
| SQ6 | Records clean | No style values in `src/mechanisms` (standard L1). |
| SQ7 | Phone width | 375 px wide: no horizontal scroll, 16 px gutters, stage 4:3, controls wrap. |
| SQ8 | Contrast | Body and secondary text pass SF5 on both sheets. |
| SQ9 | Snapshots | Visual snapshots of every mechanism at its default view and three more in both sheets match our own baselines; baselines are regenerated once, when the look is final. |
| SQ10 | Depth | A renderer test: with the principle parts selected, no depth bias or draw-order trick is in use; the peeled composite equals a reference ray-cast on a fixture scene of overlapping translucent solids. |
| SQ11 | Views | Every named view, every section and detail view the records declare, and full explode render without clipping, on both sheets; the default view of each mechanism is the one its record names. |
| SQ12 | Phone | The bench page for a measured build reports setup (decode, tessellate, edges, GPU) and frame times per view on a mid-range phone; targets are flags, not gates (standard R10). |

---

## Changelog

- **3.7 (2026-10-23).** Forge is unlocked by holding the sheet switch, with hints around the site (a glint, the console,
  a sealed search for its lore, a line on the 404 page), and lives more while it is on (split scanlines, a rolling
  band, fringed text, blips, a breathing glow, a wider swelling colour split on the drawing). The Motive force line
  leaves the title block (SS14).
- **3.6 (2026-10-23).** The hidden Forge sheet (SS14): a third palette in the tokens, unlocked on the library's title
  block, with its unlock moment and living effects on the page and the drawing; the switch steps through three sheets
  once it is unlocked (SS7). Part VI gains the Forge columns and its knobs.
- **3.5 (2026-10-23).** The set code is ST (sheet ST-07; SS1, SD10), and the library search finds a sheet by its number.
  The sheet frame carries a microprint between its borders and the title block a DATE cell, the mechanism's origin as
  an Imperial date; the block is a little wider to hold it (SD10). The paused input ring breathes (SD5). A sheet wears
  a Recovered badge for its first 7 days (SF2, SS1, SS5).
- **3.4 (2026-10-22).** Cut-over: the 2.5D renderer is gone and the 3D stamp leaves the title block and the library
  cards; no page or card marks its engine [SS13, SITE]. The knobs only the 2.5D renderer and build read leave Part VI
  (the stamp, `draft.gpu`, the centreline and dimension tilt limits, the plan and default tilts, the axial and spin
  overlay knobs, `form.base`, `form.fasteners`, the drawn thread pitch floor), and rung C no longer lists the slice
  silhouettes, an effect the depth renderer never had [SD18, STYLE].
- **3.3 (2026-10-22).** The sheet switch shows one cog, turned 180° on Blueprint and as drawn on Drafting, in place of the
  sun and moon; its name and tooltip read "Switch to Blueprint" / "Switch to Drafting" (SS7).
- **3.2 (2026-10-22).** The library's bar has a Sort button beside Filters with a menu of orders, New by default,
  kept in the address (`?sort=`) and returned to New by clearing the filters; an empty search says "No pattern
  found" (SS2, SS3). A missing address gets a 404 page, sheet ST-404 (SS8).
- **3.1 (2026-10-22).** A second link role surface, `link2`, tells two link sets of the same role apart by pattern
  (the Schmidt coupling) [SD25, STYLE].
- **3.0 (2026-10-20).** Restated for true 3D parts, a depth-buffer renderer and a free orthographic camera. SP10, SD1,
  SD11 and the view names of SD10 (turntable orbit snapping to PLAN, FRONT, SIDE, ISOMETRIC, DIMETRIC, AUX ⟂ joint,
  VIEW az/el) [SP10, SD10, SD11, STYLE]. The depth buffer replaces slicing: SD1, SD3 (visible and hidden edges by depth,
  fractional occlusion kept), SD4 (patterns on faces within a set angle of the view), SD2 (see-through on every face in
  view), SF10 [SD1 to SD4, SF10, STYLE]. Centrelines along joint axes, dimensions in named views, explode along each
  axis with trail lines, performance as a GPU-first rule [SD6, SD8, SD12, SD17, STYLE]. New: the principle always reads
  (SP12), section views, detail views, phantom positions, construction overlays, ghost traces, teaching traces and
  ticks, pattern variants, highlights, the time map [SP12, SD19 to SD27, STYLE], the transition stamp [SS13, SITE], and
  the depth, view and phone checks [SQ10 to SQ12, STYLE].
- **2.4 (2026-10-19).** The sheet switch is one icon button (SS7); the library's bar is one row on a phone, a
  mechanism page shows the switch beside its name and a compact name bar once scrolled, and the library is returned
  to as it was left (SS3).
- **2.3 (2026-10-18).** The solids are drawn with WebGL2 (SD17); cards draw at dial A-B, sharp at full pixel ratio
  with wall shading, and thumbnails are committed images redrawn when what they are drawn from changes (SD16); the
  bench, shots and snapshots draw in local Chrome (SQ5).
- **2.2 (2026-10-18).** Mechanism page (SS5): tags leave the side column for a full-width band above the
  explanation, and tags and the at-a-glance family, input, output and level link to the library filtered by them
  (SS3).
- **2.1 (2026-10-17).** Part VI generated from the style files [STYLE]; the page grid alphas are `--grid-1` and
  `--grid-2` (`--grid` is the grid colour) [STYLE].
- **2.0 (2026-10-17).** Rewritten for the rebuilt engine: glow scheme removed; style files renamed and `detail.ts`
  added (SA, SD18); the hand-off's known gaps (duplicated palettes, red warn, font strings and literals in code,
  overlay colours) are now requirements, not gaps; real pages and pre-rendered thumbnails (SS1, SS8, SD16);
  self-hosted fonts (SF7); SP11 added; look match by eye (SQ2).
- **1.0 (2026-10-16).** The hand-off style reference for the drafting proposal.
