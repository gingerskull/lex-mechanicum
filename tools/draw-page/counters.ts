// Draw counters for the browser bench: calls on every 2D context and path, counted by wrapping the prototypes.
// The same on every run and every machine, unlike frame times.
export const counts: Record<string, number> = {};
let on = true;

export function resetCounts(): void {
  for (const k of Object.keys(counts)) delete counts[k];
}

/** Counting costs a little: the timed frames run with it off. */
export function countDraws(v: boolean): void {
  on = v;
}

function wrap(proto: object, names: string[], tag: string) {
  const P = proto as Record<string, (...a: unknown[]) => unknown>;
  for (const n of names) {
    const f = P[n];
    if (typeof f !== "function") continue;
    P[n] = function (this: unknown, ...a: unknown[]) {
      if (on) counts[`${tag}${n}`] = (counts[`${tag}${n}`] ?? 0) + 1;
      return f.apply(this, a);
    };
  }
}

wrap(CanvasRenderingContext2D.prototype, ["fill", "stroke", "clip", "drawImage", "fillRect", "lineTo", "moveTo", "fillText"], "");
wrap(Path2D.prototype, ["lineTo", "moveTo", "addPath"], "path.");
