// A drawing session per canvas (one stage, one card, one screenshot): the package unpacked once, the paper, lines layer
// and slice caches, and the last view, so draw() redraws only when u, the view or the theme changed.
import { indexParts, type PartIndex } from "../assemble/pose";
import type { MechanismModel, Solved } from "../model/types";
import type { Package } from "../package/format";
import { makeCard, sizeCard, type CanvasFactory, type CanvasLike, type Card } from "./canvas";
import { ladder } from "./detail";
import { drawFrame, type DrawView } from "./draft";
import type { SliceCache } from "./slices";
import { prepare, type Prepared } from "./world";

export interface Session {
  card: Card;
  pkg: Package;
  model: MechanismModel;
  parts: PartIndex;
  prepared: Prepared[];
  cache: {
    paper: { c?: CanvasLike; key?: string };
    lines: { c?: CanvasLike };
    slices: { last?: SliceCache };
  };
  /** Draws the frame for phase u and the view; skips the work when nothing changed. Returns the solution at u. */
  draw(u: number, view: DrawView): Solved;
  /** Resizes the canvas (CSS px and device pixel ratio). The next draw redraws. */
  resize(w: number, h: number, dpr: number): void;
  /** Solids drawn in the last frame. */
  drawn: number;
}

export interface SessionOptions {
  factory: CanvasFactory;
  w: number;
  h: number;
  dpr?: number;
}

export function createSession(canvas: CanvasLike, pkg: Package, model: MechanismModel, o: SessionOptions): Session {
  const card = makeCard(canvas, o.factory);
  const dpr = o.dpr ?? 1;
  sizeCard(card, o.w, o.h, dpr);
  let last = "";
  let lastS: Solved | null = null;
  let full = dpr;
  const sess: Session = {
    card,
    pkg,
    model,
    parts: indexParts(model),
    prepared: prepare(pkg),
    cache: { paper: {}, lines: {}, slices: {} },
    drawn: 0,
    draw(u, view) {
      const key = `${u}|${JSON.stringify(view)}|${card.cw}x${card.ch}`;
      if (key === last && lastS) return lastS;
      // DL-C caps the pixel ratio at 1 while it is dropped
      const want = ladder(view.detail, view).effect("fullDpr") ? full : 1;
      if (want !== card.dpr) sizeCard(card, card.w, card.h, want);
      const r = drawFrame(sess, u, view);
      sess.drawn = r.drawn;
      last = `${u}|${JSON.stringify(view)}|${card.cw}x${card.ch}`;
      lastS = r.s;
      return r.s;
    },
    resize(w, h, d) {
      full = d;
      sizeCard(card, w, h, d);
      last = "";
    },
  };
  return sess;
}
