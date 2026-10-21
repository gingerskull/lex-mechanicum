// Geometry primitives shared by every part and mechanism. World units are millimetres, y up; angles in radians.
/** A point or vector in millimetres. */
export type Vec2 = [number, number];
/** A rigid placement: x, y in millimetres and angle in radians. */
export type Pose = [number, number, number];

export const TAU = Math.PI * 2;
export const D2R = Math.PI / 180;

export const polar = (r: number, a: number, cx = 0, cy = 0): Vec2 => [cx + r * Math.cos(a), cy + r * Math.sin(a)];
export const clamp = (v: number, a: number, b: number): number => Math.max(a, Math.min(b, v));
/** Angle wrapped to [-π, π). */
export const wrap = (a: number): number => {
  a = (a + Math.PI) % TAU;
  if (a < 0) a += TAU;
  return a - Math.PI;
};
export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

/** Points on an arc from a0 to a1, both ends included, at most `step` apart in angle. */
export function arcPts(cx: number, cy: number, r: number, a0: number, a1: number, step = Math.PI / 20): Vec2[] {
  const n = Math.max(1, Math.ceil(Math.abs(a1 - a0) / step));
  const p: Vec2[] = [];
  for (let i = 0; i <= n; i++) p.push(polar(r, a0 + ((a1 - a0) * i) / n, cx, cy));
  return p;
}

/** Closed circle outline, counter-clockwise; the default point count grows with the radius. */
export function circle(r: number, cx = 0, cy = 0, n?: number): Vec2[] {
  const k = n ?? clamp(Math.round(r * 1.4), 18, 64);
  const p: Vec2[] = [];
  for (let i = 0; i < k; i++) p.push(polar(r, (i / k) * TAU, cx, cy));
  return p;
}

/** Signed area, positive for counter-clockwise outlines. */
export function area(p: Vec2[]): number {
  let s = 0;
  for (let i = 0; i < p.length; i++) {
    const a = p[i]!;
    const b = p[(i + 1) % p.length]!;
    s += a[0] * b[1] - b[0] * a[1];
  }
  return s / 2;
}

/** Convex hull of discs of radius r centred on pts (pts convex, in order): the outline plate-like parts are cut from. */
export function roundedPoly(pts: Vec2[], r: number): Vec2[] {
  if (pts.length > 2 && area(pts) < 0) pts = pts.slice().reverse();
  const n = pts.length;
  const out: Vec2[] = [];
  for (let i = 0; i < n; i++) {
    const p = pts[(i - 1 + n) % n]!;
    const c = pts[i]!;
    const q = pts[(i + 1) % n]!;
    const n1 = Math.atan2(c[1] - p[1], c[0] - p[0]) - Math.PI / 2;
    let n2 = Math.atan2(q[1] - c[1], q[0] - c[0]) - Math.PI / 2;
    while (n2 < n1 - 1e-9) n2 += TAU;
    out.push(...arcPts(c[0], c[1], r, n1, n2, Math.PI / 14));
  }
  return out;
}

/** Stadium from (0, 0) to (L, 0), width w. */
export const capsule = (L: number, w: number): Vec2[] => roundedPoly([[0, 0], [L, 0]], w / 2);
export const roundRect = (x0: number, y0: number, x1: number, y1: number, r: number): Vec2[] =>
  roundedPoly([[x0 + r, y0 + r], [x1 - r, y0 + r], [x1 - r, y1 - r], [x0 + r, y1 - r]], r);
/** Stadium slot along y = const from x0 to x1, half-width h. */
export const slot = (x0: number, x1: number, y: number, h: number): Vec2[] => roundedPoly([[x0, y], [x1, y]], h);
/** D-bore: a circle with a flat at x = 0.68 r. */
export const dBore = (r: number): Vec2[] => circle(r, 0, 0, 28).map(([x, y]): Vec2 => [Math.min(x, r * 0.68), y]);
export const ring = (r: number, x = 0, y = 0): Vec2[] => circle(r, x, y, 48);

/** Continuous-corner rectangle (superellipse corners). */
export function squircle(x0: number, y0: number, x1: number, y1: number, r: number): Vec2[] {
  r = Math.min(r, (x1 - x0) / 2, (y1 - y0) / 2);
  const pts: Vec2[] = [];
  const corners: [number, number, number][] = [
    [x1 - r, y0 + r, -Math.PI / 2],
    [x1 - r, y1 - r, 0],
    [x0 + r, y1 - r, Math.PI / 2],
    [x0 + r, y0 + r, Math.PI],
  ];
  for (const [cx, cy, a0] of corners)
    for (let i = 0; i <= 14; i++) {
      const t = a0 + ((i / 14) * Math.PI) / 2;
      const c = Math.cos(t);
      const s = Math.sin(t);
      pts.push([cx + r * Math.sign(c) * Math.pow(Math.abs(c), 0.62), cy + r * Math.sign(s) * Math.pow(Math.abs(s), 0.62)]);
    }
  return pts;
}

/**
 * Involute gear outline, 20° pressure angle. Tooth k is centred on angle k·2π/z. ad and de are the addendum and
 * dedendum in modules; teeth(k) false leaves tooth k out (a root arc instead).
 */
export function gearOutline(z: number, m: number, ad = 1, de = 1.25, teeth?: (k: number) => boolean): Vec2[] {
  const rp = (m * z) / 2;
  const ra = rp + ad * m;
  const rf = rp - de * m;
  const rb = rp * Math.cos(20 * D2R);
  const inv = (a: number) => Math.tan(a) - a;
  const ip = inv(20 * D2R);
  const psi = (r: number) => Math.max(0.004, Math.PI / (2 * z) + ip - inv(Math.acos(rb / Math.max(r, rb))));
  const pts: Vec2[] = [];
  const N = 5;
  for (let k = 0; k < z; k++) {
    const c = (k * TAU) / z;
    if (!teeth || teeth(k)) {
      for (let i = 0; i <= N; i++) {
        const r = rf + ((ra - rf) * i) / N;
        pts.push(polar(r, c - psi(r)));
      }
      for (let i = N; i >= 0; i--) {
        const r = rf + ((ra - rf) * i) / N;
        pts.push(polar(r, c + psi(r)));
      }
    } else pts.push(...arcPts(0, 0, rf, c - psi(rf), c + psi(rf), Math.PI / 30));
    const a0 = c + psi(rf);
    const a1 = c + TAU / z - psi(rf);
    for (let i = 1; i < 4; i++) pts.push(polar(rf, a0 + ((a1 - a0) * i) / 4));
  }
  return pts;
}

/**
 * A straight rack, 20° flanks: pitch line on y = 0, tips at +ad·m, roots at -de·m, its back at y = -h, from x0 to x1.
 * Tooth centres at x = shift + k·πm.
 */
export function rackOutline(m: number, x0: number, x1: number, h: number, shift = 0, ad = 1, de = 1.25): Vec2[] {
  const p = Math.PI * m;
  const t = Math.tan(20 * D2R);
  const half = (y: number) => p / 4 - y * t;
  const pts: Vec2[] = [[x1, -h], [x0, -h]];
  const k0 = Math.ceil((x0 - shift + half(-de * m)) / p);
  const k1 = Math.floor((x1 - shift - half(-de * m)) / p);
  pts.push([x0, -de * m]);
  for (let k = k0; k <= k1; k++) {
    const c = shift + k * p;
    pts.push([c - half(-de * m), -de * m], [c - half(ad * m), ad * m], [c + half(ad * m), ad * m], [c + half(-de * m), -de * m]);
  }
  pts.push([x1, -de * m]);
  // counter-clockwise, as every outer ring
  return pts.reverse();
}

/** Link outline with boss radii r0 at (0, 0) and r1 at (L, 0), joined by outer tangents (D1). */
export function taper(L: number, r0: number, r1: number, n = 40): Vec2[] {
  const a = Math.acos((r0 - r1) / L);
  const pts: Vec2[] = [];
  for (let i = 0; i <= n / 2; i++) pts.push(polar(r1, -a + (2 * a * i) / (n / 2), L, 0));
  for (let i = 0; i <= n; i++) pts.push(polar(r0, a + ((TAU - 2 * a) * i) / n));
  return pts;
}

/** Local points placed by a pose. */
export const xf = (pts: Vec2[], [x, y, a]: Pose): Vec2[] => {
  const c = Math.cos(a);
  const s = Math.sin(a);
  return pts.map(([px, py]): Vec2 => [x + px * c - py * s, y + px * s + py * c]);
};

/** A local pose composed onto a parent pose. */
export const xfPose = (pose: Pose, local: Pose): Pose => {
  const [x, y] = xf([[local[0], local[1]]], pose)[0]!;
  return [x, y, pose[2] + local[2]];
};

/** [x0, y0, x1, y1]. */
export function bbox(pts: Vec2[]): [number, number, number, number] {
  let x0 = Infinity;
  let y0 = Infinity;
  let x1 = -Infinity;
  let y1 = -Infinity;
  for (const [x, y] of pts) {
    if (x < x0) x0 = x;
    if (x > x1) x1 = x;
    if (y < y0) y0 = y;
    if (y > y1) y1 = y;
  }
  return [x0, y0, x1, y1];
}

/** Outline offset by d along its outward normals (d < 0 shrinks); near-duplicate points are dropped first. */
export function offsetPoly(P: Vec2[], d: number): Vec2[] {
  P = P.filter((p, i) => {
    const q = P[(i - 1 + P.length) % P.length]!;
    return Math.hypot(p[0] - q[0], p[1] - q[1]) > 0.05;
  });
  const n = P.length;
  const sg = area(P) > 0 ? 1 : -1;
  const N: Vec2[] = [];
  for (let i = 0; i < n; i++) {
    const a = P[i]!;
    const b = P[(i + 1) % n]!;
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    const L = Math.hypot(dx, dy) || 1;
    N.push([(sg * dy) / L, (-sg * dx) / L]);
  }
  return P.map((p, i): Vec2 => {
    const e1 = N[(i - 1 + n) % n]!;
    const e2 = N[i]!;
    let vx = e1[0] + e2[0];
    let vy = e1[1] + e2[1];
    const L = Math.hypot(vx, vy) || 1;
    vx /= L;
    vy /= L;
    const k = d / Math.max(0.5, vx * e2[0] + vy * e2[1]);
    return [p[0] + vx * k, p[1] + vy * k];
  });
}
