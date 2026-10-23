// The SVG filters of the Forge sheet (SS14), written into every page's head at build time from the tokens: `forge-tone`
// recolours the Blueprint thumbnails and stills into Forge's paper and ink (Forge has no images of its own), and
// `forge-glitch` tears bands of the page sideways and splits red from blue during the unlock moment (islands/forge.ts
// drives its numbers).
import { TOKENS } from "../../src/style/tokens";

const channels = (hex: string): [number, number, number] => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255) as [number, number, number];
const luma = ([r, g, b]: [number, number, number]) => 0.2126 * r + 0.7152 * g + 0.0722 * b;
const n = (x: number) => String(+x.toFixed(4));

/** Each channel of Forge as a straight line through Blueprint's lightness: its paper to Forge's paper, its ink to Forge's ink. */
function tone(): string {
  const from = TOKENS.themes.dark;
  const to = TOKENS.themes.forge;
  const lp = luma(channels(from.paper));
  const li = luma(channels(from.ink));
  const [p, i] = [channels(to.paper), channels(to.ink)];
  const fn = (name: string, c: number) => {
    const slope = (i[c]! - p[c]!) / (li - lp);
    return `<feFunc${name} type="linear" slope="${n(slope)}" intercept="${n(p[c]! - slope * lp)}"/>`;
  };
  const row = "0.2126 0.7152 0.0722 0 0";
  return `<filter id="forge-tone" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="${row} ${row} ${row} 0 0 0 1 0"/><feComponentTransfer>${fn("R", 0)}${fn("G", 1)}${fn("B", 2)}</feComponentTransfer></filter>`;
}

/** Bands of rows shifted sideways by noise that is constant along a row, then red and blue pulled apart; all at rest. */
const glitch = () =>
  '<filter id="forge-glitch" x="0" y="0" width="1" height="1" color-interpolation-filters="sRGB">' +
  '<feTurbulence id="forge-turb" type="fractalNoise" baseFrequency="0.00001 0.045" numOctaves="1" seed="3" result="n"/>' +
  '<feComponentTransfer in="n" result="b"><feFuncR type="discrete" tableValues="0.5 0.5 0 0.5 0.5 1 0.5 0.5 0.15 0.5"/><feFuncG type="discrete" tableValues="0.5"/></feComponentTransfer>' +
  '<feDisplacementMap id="forge-tear" in="SourceGraphic" in2="b" scale="0" xChannelSelector="R" yChannelSelector="G" result="t"/>' +
  '<feColorMatrix in="t" type="matrix" values="1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0" result="r"/>' +
  '<feOffset id="forge-red" in="r" dx="0" result="ro"/>' +
  '<feColorMatrix in="t" type="matrix" values="0 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0" result="gb"/>' +
  '<feOffset id="forge-blue" in="gb" dx="0" result="gbo"/>' +
  '<feBlend in="ro" in2="gbo" mode="screen"/>' +
  "</filter>";

export const FORGE_FILTERS = `<svg class="forge-defs" width="0" height="0" aria-hidden="true" focusable="false">${tone()}${glitch()}</svg>`;
