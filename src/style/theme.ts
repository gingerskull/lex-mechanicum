// Theme resolution for the renderer (SA7): token hex values become rgb triples, resolved per frame so a change to
// TOKENS (live tuning, SA6) shows on the next redraw. The only place outside the tokens that builds colour strings.

import type { FontSpec } from "./draft";
import { COLOR_NAMES, TOKENS, type ColorName, type ThemeKey } from "./tokens";

export type RGB = readonly [number, number, number];

export type ResolvedTheme = Record<ColorName, RGB> & {
  key: ThemeKey;
  dark: boolean;
  name: string;
  patternGain: number; // 0..1
  grain: number; // 0..1
};

/** "#RRGGBB" or "#RGB" to an rgb triple. */
export function hexToRgb(hex: string): RGB {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? [...h].map((c) => c + c).join("") : h;
  if (!/^[0-9a-f]{6}$/i.test(full)) throw new Error(`not a hex colour: ${hex}`);
  const n = parseInt(full, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function theme(key: ThemeKey): ResolvedTheme {
  const t = TOKENS.themes[key];
  const colours = Object.fromEntries(COLOR_NAMES.map((c) => [c, hexToRgb(t[c])])) as Record<ColorName, RGB>;
  return { ...colours, key, dark: key === "dark", name: t.name, patternGain: t.patternGain, grain: t.grain };
}

/** A CSS colour string for a resolved colour at alpha a (0..1). */
export function rgba(c: RGB, a = 1): string {
  return `rgba(${c[0]},${c[1]},${c[2]},${+a.toFixed(4)})`;
}

/** A canvas font string from a font spec (SF8). */
export function font(f: FontSpec): string {
  return `${f.weight} ${TOKENS.type.size[f.size]}px ${TOKENS.type[f.family]}`;
}
