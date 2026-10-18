// Role surfaces (SD4): one tile per pattern and ink; the GPU pass maps it onto a top face through the part's pose, so
// the pattern rides with the part and foreshortens with the tilt. The paper tooth is a seeded noise tile, the same on
// every run.
import { DRAFT, type PatternKind } from "../style/draft";
import { rgba as paint, type RGB } from "../style/theme";
import type { Card, CanvasLike } from "./canvas";

const P = DRAFT.pattern;
const tiles = new Map<string, CanvasLike>();

export function tile(card: Card, type: PatternKind, ink: RGB): CanvasLike {
  const key = `${type}:${ink.join()}`;
  const hit = tiles.get(key);
  if (hit) return hit;
  const T = P.tile;
  const c = card.f.canvas(T, T);
  const x = c.getContext("2d")!;
  const C = paint(ink, 1);
  x.fillStyle = C;
  x.strokeStyle = C;
  x.lineCap = "round";
  const h = T / 2;
  if (type === "dots") {
    const g = x.createRadialGradient(h, h, 0, h, h, P.dotRadius);
    g.addColorStop(0, C);
    g.addColorStop(P.dotMid[0], paint(ink, P.dotMid[1]));
    g.addColorStop(1, paint(ink, 0));
    x.fillStyle = g;
    x.fillRect(0, 0, T, T);
  } else if (type === "hatch" || type === "cross") {
    x.lineWidth = P.lineWidth;
    x.beginPath();
    for (const o of [-T, 0, T]) {
      x.moveTo(o, T);
      x.lineTo(o + T, 0);
      if (type === "cross") {
        x.moveTo(o, 0);
        x.lineTo(o + T, T);
      }
    }
    x.stroke();
  } else if (type === "dash") {
    x.lineWidth = P.lineWidth;
    x.beginPath();
    for (const [a, b, y] of P.dashes) {
      x.moveTo(a, y);
      x.lineTo(b, y);
    }
    x.stroke();
  }
  tiles.set(key, c);
  return c;
}

let noiseTile: CanvasLike | null = null;

/** A seeded noise tile for the paper tooth (same pixels on every run, so snapshots are stable). */
export function noise(card: Card): CanvasLike {
  if (noiseTile) return noiseTile;
  const n = DRAFT.paper.grainTile;
  const c = card.f.canvas(n, n);
  const x = c.getContext("2d")!;
  const d = x.createImageData(n, n);
  let seed = 1;
  for (let i = 0; i < d.data.length; i += 4) {
    seed = (seed * 16807) % 2147483647;
    const v = (seed / 2147483647) * 255;
    d.data[i] = d.data[i + 1] = d.data[i + 2] = v;
    d.data[i + 3] = 255;
  }
  x.putImageData(d, 0, 0);
  noiseTile = c;
  return c;
}
