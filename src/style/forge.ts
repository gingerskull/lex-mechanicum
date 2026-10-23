// FORGE: the hidden third sheet (LM-12, style SS14). Its colours are the `forge` theme of the tokens; this file holds how it
// is unlocked, the unlock moment, and the strength and timing of its living effects on the page and on the drawing.
// Safety (SS14): nothing flashes more than 3 times a second (the moment's two dips are 0.3 s apart; a blip is one event 3 s
// or more from the next, a glitch pulse 20 s or more); under reduced motion the moment is a plain fade and the effects
// hold still.
// Units: s for times, px for sizes, alphas and strengths 0..1.

export const FORGE = {
  // The unlock: clicks on the library title block's Rev cell, then the moment, remembered for the visitor.
  unlock: {
    holdDelay: 1, // s, a hold on the sheet switch before the cog starts to fill (a shorter press is a plain switch)
    holdFill: 2, // s, the cog filling with brass, ring and half-disc, in one sweep; at full the moment plays
    holdSlop: 10, // px, a finger that moves further than this is scrolling, not holding
    glintVisit: 3, // count, the page load on which the cog glints once, as a hint, while Forge is still locked
    glint: 1.4, // s, the glint
    clicks: 16, // count, one per law
    resetAfter: 4, // s, a pause this long between clicks starts the count again
    moment: 1.5, // s, the whole unlock moment
    switchAt: 0.55, // s into the moment, the sheet turns to Forge under the noise
    flickers: [0.12, 0.42] as const, // s into the moment, the two brightness dips
    flickerLength: 0.07, // s, one dip
    flickerDepth: 0.4, // 0..1, alpha of the background colour over the page at a dip
    noise: 0.5, // 0..1, alpha of the noise burst at its height, settling to the living grain
    tear: 34, // px, the widest sideways tear of a band of the page
    split: 5, // px, the widest red and blue split
    glow: 0.9, // s, the furnace glow coming up at the end
    fade: 0.4, // s, the whole moment under reduced motion: a plain fade
  },
  // On the page while Forge is the sheet: fixed layers over everything that never take a click.
  page: {
    grain: { alpha: 0.085, tile: 160, fps: 12 }, // 0..1 noise (overlay blend), px noise tile, steps per s
    // scanlines split into a warm and a cool row (grid and vel tokens), drifting down one pitch per `drift` s
    scanlines: { alpha: 0.07, pitch: 3, drift: 6 }, // 0..1 of each colour, px, s
    roll: { alpha: 0.05, height: 160, period: 13 }, // 0..1 of the accent, px, s: a soft band rolling down the screen
    aberration: { shift: 0.6, pulse: 1.8, alpha: 0.4 }, // px, px at a glitch pulse, 0..1: text fringed warm and cool
    vignette: { alpha: 0.5, start: 0.55 }, // 0..1 of bg in the corners, fraction of the half-diagonal where it begins
    glow: { alpha: 0.12, size: 150, low: 0.7, period: 4.6 }, // 0..1 of the accent, px, 0..1 at its faintest, s per breath
    flicker: { depth: 0.04, period: 7.3 }, // 0..1 of bg at the deepest, s for one slow irregular cycle
    // small flickers here and there: a strip of the page brightens or dims for a moment, or a thin line tears across
    blips: { every: [3, 8] as const, length: 0.09, height: [24, 90] as const, depth: 0.07 }, // s, s, px, 0..1
    glitch: { every: [20, 40] as const, length: 0.18, bands: 3, height: [3, 22] as const, hue: 28 }, // s, s, count, px, deg
  },
  // On the drawing (WebGL2): a post-process over the finished frame, drawn with the paper grain (rung A) and dropped
  // with it, so it is the first thing to go when the device cannot keep up.
  canvas: {
    grain: 0.05, // 0..1, noise added to every pixel
    chroma: 1.1, // px, red and blue pulled apart, always
    wobble: 0.7, // px, how much the split swells and shrinks down the rows
    wobbleRows: 37, // px, rows per swell
    blip: 0.35, // 0..1, a blip's strength on the drawing (a glitch pulse is 1)
    glitchChroma: 4, // px, at a glitch pulse
    tear: 12, // px, the shift of a torn band at a glitch pulse
    band: 7, // px, height of a band that may tear
    tornShare: 0.22, // 0..1, share of the bands torn at a pulse
  },
} as const;

export type Forge = typeof FORGE;
