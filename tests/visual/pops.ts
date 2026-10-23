// Pop-in detection on a frame sequence (style SQ11): a frame that differs from its neighbours in a way smooth motion
// cannot explain. Each frame is turned to blurred luminance; the measure at frame k is the summed second difference
// |f[k+1] - 2 f[k] + f[k-1]|, which stays small while things move steadily and jumps where something appears, vanishes
// or changes weight in one step. A spike is a measure well above those a few frames either side.
import { PNG } from "pngjs";

/** Blurred luminance of a PNG, 0..255 per pixel (two 3 x 3 box passes). */
export function luma(png: Buffer): { w: number; h: number; v: Float32Array } {
  const p = PNG.sync.read(png);
  const { width: w, height: h, data } = p;
  let a = new Float32Array(w * h);
  for (let i = 0; i < w * h; i++) a[i] = 0.299 * data[i * 4]! + 0.587 * data[i * 4 + 1]! + 0.114 * data[i * 4 + 2]!;
  for (let pass = 0; pass < 2; pass++) {
    const b = new Float32Array(w * h);
    for (let y = 0; y < h; y++)
      for (let x = 0; x < w; x++) {
        let s = 0, n = 0;
        for (let dy = -1; dy <= 1; dy++)
          for (let dx = -1; dx <= 1; dx++) {
            const xx = x + dx, yy = y + dy;
            if (xx < 0 || yy < 0 || xx >= w || yy >= h) continue;
            s += a[yy * w + xx]!;
            n++;
          }
        b[y * w + x] = s / n;
      }
    a = b;
  }
  return { w, h, v: a };
}

/** Side of the square tiles a frame is measured in, px: a pop is local, so it stands out in its tile. */
export const TILE = 40;

/**
 * The second-difference measure of each inner frame (index 1 to n - 2) in each tile, in grey levels: out[t][k - 1] for
 * tile t at frame k.
 */
export function tileBends(frames: Float32Array[], w: number, h: number): number[][] {
  const tx = Math.ceil(w / TILE), ty = Math.ceil(h / TILE);
  const out: number[][] = Array.from({ length: tx * ty }, () => []);
  for (let k = 1; k + 1 < frames.length; k++) {
    const a = frames[k - 1]!, b = frames[k]!, c = frames[k + 1]!;
    const sums = new Float64Array(tx * ty);
    for (let y = 0; y < h; y++)
      for (let x = 0; x < w; x++) {
        const i = y * w + x;
        sums[Math.floor(y / TILE) * tx + Math.floor(x / TILE)]! += Math.abs(c[i]! - 2 * b[i]! + a[i]!);
      }
    sums.forEach((v, t) => out[t]!.push(v));
  }
  return out;
}

/** The worst tile spikes of a sequence: frame, tile, its measure and the median of its measure 3 and 4 frames away. */
export function tileSpikes(m: number[][], ratio = 4, floor = 400): { frame: number; tile: number; value: number; around: number }[] {
  const out: { frame: number; tile: number; value: number; around: number }[] = [];
  m.forEach((series, t) => {
    for (const s of spikes(series, ratio, floor)) out.push({ frame: s.frame, tile: t, value: s.value, around: s.around });
  });
  return out.sort((a, b) => b.value / Math.max(1, b.around) - a.value / Math.max(1, a.around));
}

/** The second-difference measure of each inner frame (index 1 to n - 2), in thousands of grey levels. */
export function bends(frames: Float32Array[]): number[] {
  const out: number[] = [];
  for (let k = 1; k + 1 < frames.length; k++) {
    const a = frames[k - 1]!, b = frames[k]!, c = frames[k + 1]!;
    let s = 0;
    for (let i = 0; i < b.length; i++) s += Math.abs(c[i]! - 2 * b[i]! + a[i]!);
    out.push(s / 1000);
  }
  return out;
}

/** Frames (by index into the sequence) whose measure is over `ratio` times the median of those 3 and 4 frames away. */
export function spikes(m: number[], ratio = 3, floor = 5): { frame: number; value: number; around: number }[] {
  const out: { frame: number; value: number; around: number }[] = [];
  m.forEach((v, i) => {
    const nb = [i - 4, i - 3, i + 3, i + 4].filter((j) => j >= 0 && j < m.length).map((j) => m[j]!).sort((x, y) => x - y);
    const around = nb.length ? (nb[(nb.length - 1) >> 1]! + nb[nb.length >> 1]!) / 2 : 0;
    if (v > ratio * Math.max(around, floor)) out.push({ frame: i + 1, value: Math.round(v), around: Math.round(around) });
  });
  return out;
}
