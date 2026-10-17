// STYLE: the one place every look value lives (style Part II). In the browser it is also globalThis.STYLE, so values
// can be tried in the console and applied with a redraw (SA6).

import { DETAIL } from "./detail";
import { DRAFT } from "./draft";
import { FORM } from "./form";
import { TOKENS } from "./tokens";

export const STYLE = { tokens: TOKENS, form: FORM, draft: DRAFT, detail: DETAIL };

if ("document" in globalThis) (globalThis as { STYLE?: typeof STYLE }).STYLE = STYLE;

export * from "./detail";
export * from "./draft";
export * from "./form";
export * from "./kinds";
export * from "./theme";
export * from "./tokens";
