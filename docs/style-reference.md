# Style reference (blueprint / drafting)

```
version: 2.0
date: 2026-10-17
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
| SD2 | **Surfaces are paper.** Every solid is filled with the paper colour at a set opacity (plates, others, base, walls). Plates hide more than small hardware. The base plate is the most transparent so the underside (motor, housings, cabling) still reads. |
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
| SS3 | **Sticky bar:** segmented controls (theme Blueprint / Drafting) and the Filters button; translucent paper with blur, hairline top and bottom. Filters hidden behind the button; facets open as chip rows in a scrollable panel. |
| SS4 | **Controls:** segmented buttons and chips are square, hairline, mono uppercase; pressed = ink fill with paper text. Tags are dashed outlines, solid on hover. The play button is the one round control (accent outline, fills on hover). Range inputs use `accent-color` (accent for the scrubber, ink for view sliders). |
| SS5 | **Mechanism page order:** crumbs (back, prev / next), header (meta with sheet number, title, summary), the stage (drawing sheet, 16:10, 4:3 on phones) with controls (play, scrubber, speed, tilt, explode, detail pin) and overlay chips whose legend swatch uses the overlay's own token and dash style; side panels (at a glance including the drive, output plot, tags by group); explanation (numbered accent markers: motion, forces, benefits, limits, where you'll find it, in the real world); references, photos and video, animations. No parts list, no "how it is built", no joint sections. |
| SS6 | **Panels:** paper fill, hairline frame, a mono uppercase header strip with a rule under it; fact lists as label/value rows with dashed separators. |
| SS7 | **Theme switch** is a site-wide segmented control, remembered per visitor (local storage, wrapped in try/catch), defaulting to the visitor's light/dark preference. Switching redraws every visible canvas and the page in one step. |
| SS8 | **Real pages:** one static page per mechanism at `/mechanisms/<id>/`, prev and next from the catalogue order, the library at `/`. The engine loads only on the mechanism page or on card hover. |
| SS9 | **Responsive:** works at phone width with a 16 px side gutter (respecting safe areas) and no horizontal scroll; the mechanism layout drops to one column under 1000 px; the set title block hides under 640 px. |
| SS10 | **Accessibility:** visible focus (dashed accent outline, 3 px offset); all controls are buttons with `aria-pressed` / `aria-expanded`; `prefers-reduced-motion` stops transitions and autoplay; contrast per SF5. |
| SS11 | **Motion on the page is minimal:** short colour and border transitions (≤ .2 s). The only continuous motion is the mechanisms themselves. |
| SS12 | **No colour or font literals in CSS** outside the generated tokens block. Component CSS uses `var(--…)` and `color-mix()` of tokens. The version shows in the footer. |

---

# Part VI. Reference values

The values the style files start from, taken from the hand-off's drafting proposal (its code of 16 Oct 2026, with
the amber warn applied). After the style files exist they are the source of truth and this part is updated to match.

## Theme palettes (tokens)

| Token | Blueprint (dark) | Drafting (light) | Use |
|---|---|---|---|
| `bg` | `#0F1A26` | `#ECE9E0` | page background outside sheets |
| `paper` | `#142130` | `#F3F1EA` | sheets, cards, panels, surface fill on drawings |
| `paperEdge` | `#0C151F` | `#E6E2D6` | outer stop of the drawing's paper gradient |
| `ink` | `#E6EDF5` | `#1C2636` | all lines, patterns, text |
| `grid` | `#A9BCD2` | `#5B8BC4` | sheet grid (used at low alpha) |
| `accent` | `#F29A6B` | `#D4472B` | SF2 / SD5 |
| `accentInk` | `#1A0E06` | `#FFF7F2` | text on an accent fill |
| `vel` | `#9CCFE0` | `#2B6CB0` | velocity overlay |
| `warn` | `#FFC46B` | `#A8620B` | out-of-range forces and angles, single-shear badge (amber) |
| `ok` | `#9FE8C8` | `#1F7A55` | double-shear badge |
| `patternGain` | 1 | .8 | multiplies role-pattern alpha |
| `grain` | .035 (overlay blend) | .05 (multiply blend) | paper tooth |

Derived ink tiers (alpha of ink), computed in the build step: `--body` .82 / .84, `--muted` .62 / .64, `--faint`
.42 / .45, `--line` .2, `--line-2` .38 / .42, `--surface` .035 / .025, `--surface-2` .08 / .06. Page grid alpha
`--grid` .06 / .08, `--grid-2` .11 / .15.

## Type

| Token | Value |
|---|---|
| `display` | "IBM Plex Sans Condensed", "Arial Narrow", system-ui, sans-serif (500, 600, 700) |
| `body` | "IBM Plex Sans", "Helvetica Neue", system-ui, sans-serif (400, 500, 600), 15 px / 1.55 |
| `mono` | "IBM Plex Mono", ui-monospace, Menlo, monospace (400, 500, 600) |
| Canvas sizes | title-block key 7 px / value 8.5 px, zone marks 8.5 px, dimensions 10 px, highlight callout 9.5 px, overlay labels 10 to 11 px, plot labels 10 px |

## Drawing

Lines (CSS px; alpha 0..1):

| Knob | Value | Knob | Value |
|---|---|---|---|
| plate top | 1.7 | other top | 1.1 |
| base top | 1.5 | plate bottom | .9 at alpha .75 |
| silhouette | .8 at .8 | non-plate bottom edge | .7 at .7 |
| chamfer | .45 at .5 | marks | .6 at .55 |
| thread | .5 at .45 | hidden | dash [3, 2.4], width × .75, alpha × .85 |
| centreline | dash [9, 2.5, 1.5, 2.5], .6 at .5, overshoot 6 | accent ring | 1.8, radius .62 × head |

Fills (paper opacity): plate .64, other .8, base .42, wall .55, wall shade .045 stepped by facing; occlusion of
the lines layer: plate 1, other .85.

Role patterns (step in mm, never under the 2.2 px floor):

| Role | Pattern | Step | Alpha | Tint |
|---|---|---|---|---|
| driver | dots | 1.3 | .55 | .05 |
| link | dots | 2.4 | .34 | 0 |
| output | hatch | 2.1 | .30 | .03 |
| ground | dash | 3.2 | .24 | 0 |
| base | dots | 4.0 | .18 | 0 |
| bearing | cross | .9 | .22 | .06 |
| hw | none | | | .12 |
| trace | none | | | .2 |

Other: grid minor 12 px, major every 5, alphas .07 / .14; sketch overshoot 14 px, alpha .32, width .55, double
offset .7 at .3; path dash [1.5, 3.5], width 1, alpha .55, comet 2.6, comet head radius 2.6 stroke 1.2; dims offset
18, gap 3, ext 5, alpha .6, width .7, arrowhead 7 px; sheet inset 10, zones on, title block on (≥ 420 px wide, block
≤ 250 px, rows 15 px); highlight callout circle r 18, dash [4, 3], width 1.3, leader 13 / 30 / 52 px; pattern off
below cos(tilt) .15; centreline cut-off 60° tilt and scale .8.

Form values the drawing depends on: base corner radius 12 mm, margin 16, foot radius 6.5, mounting hole 2.8;
chamfer scale 1.5 (plate .8, standoff .6, washer .35, tube .5, head .45, button .6, csk 0); thread shown, pitch floor
2.4 px, ISO coarse pitch table; fasteners shanks + holes, clearance .3 mm; explode rigid, gap 11 mm per level,
clear .5.

## Site

Max width 1280 px; card grid min 290 px, gap 20; header padding 30 / 22; bar row padding 9; mechanism layout
`1fr 330px`, gap 20; stage 16:10 (4:3 under 640 px); breakpoints 1000 px and 640 px; corners 0 everywhere except
the round play button (38 px) and explanation markers (30 px); hover transitions .2 s.

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

- **2.0 (2026-10-17).** Rewritten for the rebuilt engine: glow scheme removed; style files renamed and `detail.ts`
  added (SA, SD18); the hand-off's known gaps (duplicated palettes, red warn, font strings and literals in code,
  overlay colours) are now requirements, not gaps; real pages and pre-rendered thumbnails (SS1, SS8, SD16);
  self-hosted fonts (SF7); SP11 added; look match by eye (SQ2).
- **1.0 (2026-10-16).** The hand-off style reference for the drafting proposal.
