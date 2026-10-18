# Style reference (blueprint / drafting)

```
version: 2.2
date: 2026-10-18
supersedes: 1.0 (the hand-off style reference of 2026-10-16)
```

The master reference for how the library **looks**: the mechanism drawings and the site around them. Parts I to V
are the rules and the architecture; Part VI holds the reference values the style files start from; Part VII the
checks. What a mechanism **is** (parts, assembly, detail, roles, accent flag, detail ladder) is in
`docs/mechanism-standard.md`; its section 9 holds the few look rules a mechanism build depends on. This document owns
everything else about the look.

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
| SP9 | **Correct depth, always.** Nothing paints in front of what it sits behind, at any tilt or explode. An effect that breaks depth order is wrong whatever it looks like. |
| SP10 | **Pseudo-2D only.** Top view to side elevation by tilt, no sideways shear, no free 3D orbit. |
| SP11 | **Richness is drawn, not styled.** Mechanical detail comes from real solids (the standard, section 6); the style never adds detail of its own and never hides what the build has, except through the detail ladder (SD18). |

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
| SA2 | **Tokens are TypeScript, CSS is generated.** The renderer runs headless in Node, so it cannot read CSS. The site's `tokens.css` is generated from the tokens at build time (`:root` and `:root[data-theme="light"]` blocks, plus derived ink tiers). Never the other way round: no `getComputedStyle` in a renderer. |
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
| SF2 | **Accent use is reserved.** On drawings: the input shaft ring, the traced paths and the comet, force arrows, the highlighted joint callout. On the page: the kicker line, sheet numbers, the play button, card hover corner ticks, focus rings, the active-filter badge, explanation markers, the scrubber. Nothing else. |
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
| SF10 | **One line hierarchy** for the whole drawing, thick to thin: plate top outline → base outline → other top outlines → plate bottom outline and silhouettes → hidden lines → centrelines, dimensions, marks, chamfers, threads. The page reuses the idea: `--line-2` for frames, `--line` for internal rules, dashed for secondary separators. |
| SF11 | **Spacing has a floor.** Any pattern, thread or repeated mark is drawn at its real size or at the px floor, whichever is coarser, so nothing turns to grey mush on thumbnails. A detail under about 1 mm on screen becomes one mark or nothing. |
| SF12 | **The grid** is the drafting sheet: a 12 px minor square with every 5th line major, centred on the drawing. The page background uses the same pitch, derived from one token. |

---

# Part IV. The mechanism drawing (SD)

A record supplies geometry, `role`, `kind`, `marks`, `accent`, detail rungs; the renderer decides the rest.

## Paint order of one frame

1. **Paper:** radial gradient paper → paper edge, then the grid (cached per theme and size).
2. **Construction lines** of the base plate (loose touch, SD9), under everything.
3. **Solids, slice by slice**, sorted by slice top, then inset parts first, then depth along the view ray, then
   bottom z. For each slice: side walls (paper fill, then a light ink shade stepped by wall facing; walls inside
   holes darker); plate bottom outline before its own top face; top face paper fill at the surface's opacity, on
   the top slice the role tint and pattern; threads on visible shank walls; silhouettes down the walls on every
   slice; on the top slice chamfer lines, marks, the bold top outline, the base's second pencil pass, the accent
   ring, joint-head positions; bottom edges of non-plates.
4. **Lines layer composited** over the frame (SD3).
5. **Chain centrelines** through joint heads (tilt < 60°).
6. **Dimensions** of the base plate (detail stage only).
7. **Paper tooth** over the drawing.
8. **Traced paths** and comet, joint highlight callout.
9. **Sheet frame**, zone marks, title block (detail stage only), including the detail dial position.
10. **Overlays:** forces, velocity, angles, labels.

## Requirements

| Id | Requirement |
|---|---|
| SD1 | **Depth order is sacred.** Solids are sliced at every overlapping z boundary and painted far to near; a new effect is inserted into this order, never layered over the finished frame unless it is an annotation (steps 5 to 10). |
| SD2 | **Surfaces are paper.** Every solid is filled with the paper colour at a set opacity (plates, others, base, walls). Plates hide more than small hardware. The base plate is the most transparent so the underside (motor, housings, cabling) still reads, and it lets a tenth of the lines under it through. A solid the build marks see-through (it hides a working zone, standard L5) covers once, at its top face, at half opacity (its paper and its occlusion halved), so the zone reads through it. |
| SD3 | **Hidden lines by construction.** Every edge is drawn twice: bold and solid on a separate lines layer, and thin and dashed on the frame. Each later surface erases the lines layer where it covers, by its occlusion value. An edge seen directly is bold; the same edge seen through a part is dashed. Fine detail (chamfers, threads, engraving) lives only on the lines layer, so it disappears behind parts instead of turning into dashes. The dashed copy is drawn only for edges that can be covered (the renderer tests against occluder bounds). |
| SD4 | **Roles by surface, not colour.** Each role has a pattern registered to the part's pose (it moves, rotates and foreshortens with the part): driver fine stipple, link sparse soft dots, output hatching, ground soft dashes, base a faint dot grid, bearing cross-hatch, hardware plain with a light tint, trace in the accent. Patterns only on top faces, never on walls. |
| SD5 | **One accent in the drawing:** the ring round the input shaft, the traced paths and comet, force arrows, the highlight callout. A second accent use needs a reason written here. |
| SD6 | **Chain centrelines** (long dash, short dash) through every joint head, overshooting a little; hidden above 60° tilt and when the drawing is too small to read them. |
| SD7 | **Traced paths** are a fine dotted accent line at the trace height; the first path gets the comet (tapering trail, open circle at the current point). The base plate keeps the path engraved as a mark (that is form, not overlay). |
| SD8 | **Dimensions:** overall base-plate width and depth in mm, with extension lines, gaps and filled arrowheads, labels on a paper knock-out. Detail stage only, when the base is shown and the view is not near edge-on. Depth is labelled true size even when foreshortened. |
| SD9 | **Loose touches, the complete list:** (a) construction lines along the base plate's straight edges, running past the rounded corners; (b) a second, slightly offset pencil pass round the base outline. Nothing else is loose; a third needs a decision issue. |
| SD10 | **Sheet frame on the detail stage:** double border, zone ticks with numbers across and letters down, a title block bottom right (TITLE, DWG number, SCALE computed from the projection, VIEW: PLAN ≤ 8°, ELEVATION ≥ 80°, else TILT n°, SHEET n/N, DETAIL FULL or the rung). Thumbnails get no frame, no title block, no dimensions. |
| SD11 | **View:** tilt 0° (true orthographic plan) to 88° (side elevation), no sideways shear, parallel lines stay parallel. Patterns foreshorten with tilt and switch off near edge-on. |
| SD12 | **Explode is a view state, not a style.** It uses form's rigid explode; the drawing rules apply unchanged to exploded parts. |
| SD13 | **Supporting hardware reads quieter.** Motor internals are faint; hardware has no pattern; the base is the faintest surface. Brackets and tall parts still get full outlines and silhouettes. |
| SD14 | **Overlays use the sheet's colours:** forces in accent (warn when out of range), velocity in `vel`, angles in ink, labels in mono on a paper panel with an ink hairline. Overlays never change the drawing beneath. |
| SD15 | **Output plot** (detail side panel) is drawn on the sheet: ink grid dashed, curve in ink, current point in accent, mono labels. |
| SD16 | **Thumbnails and the detail stage share one renderer and one style.** The only differences are the annotation set (SD8, SD10) and scale-dependent switches (SF11, SD6). Never a second thumbnail style. Thumbnails are rendered to images at build time by the same renderer. |
| SD17 | **Performance is part of the style.** Paper and pattern tiles are cached per theme and size; outlines are cached paths drawn through transforms; slicing is recomputed only when the view's z arrangement changes; nothing draws unless u, view or theme changed; no per-frame blur. A new effect that costs per-frame passes is measured with the bench before it lands. |
| SD18 | **The detail ladder** (standard 9b) is the only way the drawing drops anything. Render effects sit in the ladder at the rung their noticeability earns: paper grain in the first rung, wall shading and inner-slice silhouettes and the DPR cap in the third, role patterns in the sixth, hidden lines in the seventh. The order is data in `src/style/detail.ts`. |

---

# Part V. The site (SS)

The page is a **drawing set**: a gridded sheet (blueprint when dark, drafting paper when light). Each mechanism is a
numbered sheet with a title block; the header carries the set's own title block; controls look like drafting
instruments' labels, not app widgets. Square corners, hairline rules, condensed technical lettering, one accent.

| Id | Requirement |
|---|---|
| SS1 | **Library grid:** cards in an auto-fill grid (min 290 px, 20 px gap). A card is a sheet: the drawing in a framed field (4:3, a pre-rendered image until hover) with a title block under it: name (display, uppercase) and sheet number (mono, accent) on the first row, family · motion · level meta row, two-line summary, dashed tags. Hover: ink border plus accent corner ticks at two opposite corners, and the drawing animates. |
| SS2 | **Header:** kicker (mono, accent), large condensed uppercase title, short intro, and a set title block (mono grid of label/value cells). Search field and the Filters button in the same row. |
| SS3 | **Sticky bar:** segmented controls (theme Blueprint / Drafting) and the Filters button; translucent paper with blur, hairline top and bottom. Filters hidden behind the button; facets open as chip rows in a scrollable panel. The library takes `?<facet>=<value>` and `?q=<words>` from the address, so a page can link to a filtered set. |
| SS4 | **Controls:** segmented buttons and chips are square, hairline, mono uppercase; pressed = ink fill with paper text. Tags are dashed outlines, solid on hover. The play button is the one round control (accent outline, fills on hover). Range inputs use `accent-color` (accent for the scrubber, ink for view sliders). |
| SS5 | **Mechanism page order:** crumbs (back, prev / next), header (meta with sheet number, title, summary), the stage (drawing sheet, 16:10, 4:3 on phones) with controls (play, scrubber, speed, tilt, explode, detail pin) and overlay chips whose legend swatch uses the overlay's own token and dash style; side panels (at a glance including the drive, its family, input, output and level linking to the library filtered by them; output plot); tags in a full-width band, one column per group (function, property, application, keywords), each tag linking to the library filtered or searched by it; explanation (numbered accent markers: motion, forces, benefits, limits, where you'll find it, in the real world); references, photos and video, animations. No parts list, no "how it is built", no joint sections. |
| SS6 | **Panels:** paper fill, hairline frame, a mono uppercase header strip with a rule under it; fact lists as label/value rows with dashed separators. |
| SS7 | **Theme switch** is a site-wide segmented control, remembered per visitor (local storage, wrapped in try/catch), defaulting to the visitor's light/dark preference. Switching redraws every visible canvas and the page in one step. |
| SS8 | **Real pages:** one static page per mechanism at `/mechanisms/<id>/`, prev and next from the catalogue order, the library at `/`. The engine loads only on the mechanism page or on card hover. |
| SS9 | **Responsive:** works at phone width with a 16 px side gutter (respecting safe areas) and no horizontal scroll; the mechanism layout drops to one column under 1000 px; the set title block hides under 640 px. |
| SS10 | **Accessibility:** visible focus (dashed accent outline, 3 px offset); all controls are buttons with `aria-pressed` / `aria-expanded`; `prefers-reduced-motion` stops transitions and autoplay; contrast per SF5. |
| SS11 | **Motion on the page is minimal:** short colour and border transitions (≤ .2 s). The only continuous motion is the mechanisms themselves. |
| SS12 | **No colour or font literals in CSS** outside the generated tokens block. Component CSS uses `var(--…)` and `color-mix()` of tokens. The version shows in the footer. |

---

# Part VI. Reference values

The values the style files hold, generated from `src/style` by `tools/style-table.ts` (`npm run check` fails when
these tables drift). Edit the style files, never this part. Units and uses come from the comments in the source
(SA9). The values started from the hand-off's drafting proposal (its code of 16 Oct 2026, with the amber warn
applied) and are tuned there.

## Theme palettes (tokens)

<!-- style-palettes:start (generated, do not edit) -->
| Token | Blueprint (dark) | Drafting (light) | Use |
|---|---|---|---|
| `bg` | `#0F1A26` | `#ECE9E0` | page background outside sheets |
| `paper` | `#142130` | `#F3F1EA` | sheets, cards, panels, surface fill on drawings |
| `paperEdge` | `#0C151F` | `#E6E2D6` | outer stop of the drawing's paper gradient |
| `ink` | `#E6EDF5` | `#1C2636` | all lines, patterns, text |
| `grid` | `#A9BCD2` | `#5B8BC4` | sheet grid, used at low alpha |
| `accent` | `#F29A6B` | `#D4472B` | input ring, traced paths, forces, the page's few highlights (SF2, SD5) |
| `accentInk` | `#1A0E06` | `#FFF7F2` | text on an accent fill |
| `vel` | `#9CCFE0` | `#2B6CB0` | velocity overlay |
| `warn` | `#FFC46B` | `#A8620B` | amber: out-of-range forces and angles, single-shear badge |
| `ok` | `#9FE8C8` | `#1F7A55` | double-shear badge |
| `patternGain` | 1 | 0.8 | 0..1 |
| `grain` | 0.035 | 0.05 | 0..1, overlay blend (draft.paper.grainBlend) |
<!-- style-palettes:end -->

Derived page tiers: alpha of ink (the grid tiers: alpha of `grid`), turned into colour-mixes in `tokens.css`.

<!-- style-tiers:start (generated, do not edit) -->
| Tier | Dark | Light | Use |
|---|---|---|---|
| `--body` | 0.82 | 0.84 | body text |
| `--muted` | 0.62 | 0.64 | secondary text |
| `--faint` | 0.42 | 0.45 | labels only (SF5) |
| `--line` | 0.2 | 0.2 | internal rules |
| `--line-2` | 0.38 | 0.42 | frames |
| `--surface` | 0.035 | 0.025 | faint panel fill |
| `--surface-2` | 0.08 | 0.06 | hover / pressed panel fill |
| `--grid-1` | 0.06 | 0.08 | page grid, alpha of `grid` |
| `--grid-2` | 0.11 | 0.15 | page grid, alpha of `grid` |
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
| `draft.paper.grainBlend` | `overlay` / `multiply` | composite operation of the paper tooth per sheet |
| `draft.grid.minorAlpha` | 0.07 | 0..1 |
| `draft.grid.majorAlpha` | 0.14 | 0..1 |
| `draft.grid.minorWidth` | 0.5 | px |
| `draft.grid.majorWidth` | 0.8 | px |
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
| `draft.centre.maxTilt` | 60 | degrees, hidden at and above this tilt |
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
| `draft.dims.minCos` | 0.2 | dimensions drawn only when cos(tilt) is above this |
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
| `draft.sheet.titleBlock` | true |  |
| `draft.sheet.titleMinCanvas` | 420 | px, title block only on canvases wider than this |
| `draft.sheet.titleMaxW` | 250 | px, block width cap |
| `draft.sheet.titleWFrac` | 0.4 | fraction of canvas width, block width otherwise |
| `draft.sheet.titleRow` | 15 | px, row height (3 rows) |
| `draft.sheet.titleSplit` | 0.62 | fraction of block width where the second column starts |
| `draft.sheet.titlePaper` | 0.92 | 0..1, paper alpha of the block |
| `draft.sheet.titleRule.width` | 0.8 | px, 0..1 |
| `draft.sheet.titleRule.alpha` | 0.6 | px, 0..1 |
| `draft.sheet.titleKeyAlpha` | 0.5 | 0..1 |
| `draft.sheet.titleValueAlpha` | 0.9 | 0..1 |
| `draft.sheet.titleKeyX` | 4 | px, key inset |
| `draft.sheet.titleKeyY` | 5 | px, key baseline from the row top |
| `draft.sheet.titleValueX` | 40 | px, value inset |
| `draft.sheet.titleValueMargin` | 44 | px, value truncated to the cell width less this |
| `draft.sheet.planTilt` | 8 | degrees, VIEW reads PLAN at or below this |
| `draft.sheet.elevationTilt` | 80 | degrees, VIEW reads ELEVATION at or above this; also the side view of the detail ladder |
| `draft.sheet.defaultTilt` | 28 | degrees, the view when none is given |
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
| `draft.overlays.arrowSmall` | 9 | px, axial and spin arrowheads |
| `draft.overlays.arrowDim` | 7 | px, dimension arrowheads |
| `draft.overlays.arrowAngle` | 0.42 | radians, arrowhead half-angle |
| `draft.overlays.axialDash` | [5, 4] | px |
| `draft.overlays.axialOvershoot` | 14 | px past each end |
| `draft.overlays.angleR` | 22 | mm, default angle arc radius |
| `draft.overlays.spinR` | 24 | mm, default spin arc radius |
| `draft.overlays.angleGuide.width` | 1 | px, 0..1, px, factor on radius |
| `draft.overlays.angleGuide.alpha` | 0.55 | px, 0..1, px, factor on radius |
| `draft.overlays.angleGuide.dash` | [3, 3] | px, 0..1, px, factor on radius |
| `draft.overlays.angleGuide.reach` | 1.5 | px, 0..1, px, factor on radius |
| `draft.overlays.angleArc` | 1.8 | px |
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
| `form.base.cornerR` | 12 | mm, plan corner radius of every base plate (true circular arcs) |
| `form.base.margin` | 16 | mm, clearance from the swept envelope to the plate edge |
| `form.base.footR` | 6.5 | mm, rubber foot radius; feet sit on the corner-arc centres |
| `form.base.mountHoleR` | 2.8 | mm, counterbored mounting hole radius at each corner centre |
| `form.chamfer.scale` | 1.5 | factor |
| `form.chamfer.plate` | 0.8 | mm |
| `form.chamfer.standoff` | 0.6 | mm |
| `form.chamfer.washer` | 0.35 | mm |
| `form.chamfer.tube` | 0.5 | mm |
| `form.chamfer.head` | 0.45 | mm |
| `form.chamfer.button` | 0.6 | mm |
| `form.chamfer.csk` | 0 | mm, countersunk heads get none |
| `form.thread.show` | true | helix lines on threaded shanks |
| `form.thread.minPitchPx` | 2.4 | CSS px, drawn pitch floor: real pitch or this, whichever is coarser |
| `form.thread.pitch` | function (see source) | mm, ISO coarse pitch for Ø d mm |
| `form.fasteners.shanks` | true | every screw head gets its threaded shank into the part it fastens (stage 3) |
| `form.fasteners.holes` | true | every plate a shank passes gets a clearance hole, tapped where it ends |
| `form.fasteners.clearance` | 0.3 | mm, radial clearance of a through hole |
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
| C | Wall shading, inner-slice silhouettes, full pixel ratio | effects: wallShade, innerSilhouettes, fullDpr |  |
| D | Stack hardware inside a joint | kinds: spacer, washer, thrustWasher, waveWasher, sleeve, shim, circlipInternal | whenExplode: draw |
| E | Service and sensing parts, timing marks | kinds: nipple, felt, wiper, flag, sensor, terminalBlock, cableClip, lead; marks: oilSink, timing |  |
| F | Role surface patterns | effects: rolePatterns |  |
| G | Hidden lines | effects: hiddenLines |  |
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
| `tokens.size.transition` | 0.2 | s, colour and border transitions (SS11) |
| `tokens.size.stage` | `16 / 10` | aspect ratio of the stage |
| `tokens.size.stagePhone` | `4 / 3` | stage under bpPhone, and the card drawing field |
<!-- style-site:end -->

---

# Part VII. Verification (SQ)

| Id | Check | Pass |
|---|---|---|
| SQ1 | Literal scan: a colour (`#…`, `rgb(`) or a font family string outside `src/style` and the generated CSS | No hits in renderer, site code, component CSS or records (pattern tiles may build `rgba()` strings from token values) |
| SQ2 | Look match | The four mechanisms, side by side with the hand-off proposal at plan, 28° and side view in both sheets, read as the same style and overall look to the eye. Not pixel for pixel. |
| SQ3 | One-knob test | Changing `tokens.themes.dark.accent` changes the input ring, paths, forces, play button, kicker, sheet numbers and focus ring together, and nothing else. Changing `draft.lines.plateTop` changes every mechanism. |
| SQ4 | Theme switch | Every visible card and the stage redraw in the new theme with no stale cached paper, patterns or thumbnails. |
| SQ5 | Headless | Checks, clearance, packaging, audit generation and bench run in Node (style must not need the DOM). |
| SQ6 | Records clean | No style values in `src/mechanisms` (standard L1). |
| SQ7 | Phone width | 375 px wide: no horizontal scroll, 16 px gutters, stage 4:3, controls wrap. |
| SQ8 | Contrast | Body and secondary text pass SF5 on both sheets. |
| SQ9 | Snapshots | Visual snapshots of every mechanism at four views in both sheets match our own baselines; baselines are regenerated once, when the look is final. |

---

## Changelog

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
