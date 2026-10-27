// A roller chain anchored at one end round a sprocket on a moving carrier (J12, a stroke doubler; declared as `belt`
// strands with `strand: true`, solved by the strand block). Each chain is an open length of links: its held end pinned
// to an anchor bolt in a block on the base, its other end to an anchor bolt in a bracket on the body it draws. Seen from
// the carrier the chain's path never changes shape (both strands run straight from the sprocket, the wrap is a fixed
// half of the seat circle), so its rollers, pins and plates are conveyed along that path in the carrier's frame by the
// chain's travel past the carrier (D9), and each anchor's end of the chain keeps to its anchor. A sprocket with two such
// chains is built with two tooth rows on one hub, one row per chain. The bolts' nuts set each chain's length (F7); the
// chain is greased (F8).
import { TAU, arcPts, circle, roundRect, roundedPoly, type Vec2 } from "../core/geom";
import { sprocketOutline, sprocketR } from "../core/flex";
import { H } from "../hardware/primitives";
import { v3, type Vec3 } from "../kin/math";
import type { KinJoint } from "../kin/types";
import { along, distOf, type ConveyPath } from "../solids/convey";
import type { Solid3 } from "../solids/types";
import type { BuildCtx } from "./ctx";
import type { Frame } from "./frames";
import { Local, titleOf } from "./lib";

const num = (v: unknown, d: number): number => (typeof v === "number" && Number.isFinite(v) ? v : d);
const UP: Vec3 = [0, 0, 1];
const rec = (j: KinJoint) => j as unknown as Record<string, unknown>;

/** ISO 606 08B proportions, as the closed chain of src/builder/flexible.ts draws them. */
const RW = 7.75;
const PT = 1.6;
const PIN = 4.45;
const PLATE_R = 5.9;
/** The anchor bolt (M8), its tongue the width of an inner link so the chain's end outer plates take it on their pin. */
const BOLT = 8;
const TONGUE = 2 * (RW / 2 + 0.1 + PT) - 0.3;

interface Chain {
  held: KinJoint;
  run: KinJoint;
  row: number;
  wrap: 1 | -1;
}

/** The chains of the record: each held strand with the running strand of its row. */
function chainsOf(ctx: BuildCtx): Chain[] {
  const strands = ctx.kin.joints.filter((j) => j.type === "belt" && !!rec(j).strand);
  const out: Chain[] = [];
  for (const held of strands.filter((j) => rec(j).ends)) {
    const row = num(rec(held).row, 0);
    const run = strands.find((j) => j !== held && !rec(j).ends && j.a === held.a && num(rec(j).row, 0) === row);
    if (!run) {
      ctx.issues.push(`${held.id}: no running strand in row ${row} for this held strand`);
      continue;
    }
    out.push({ held, run, row, wrap: num(rec(held).wrap, 1) >= 0 ? 1 : -1 });
  }
  return out;
}

/** The value the strand step gives for the chain's travel past its carrier (out.travel), and that step's carrier. */
function stepOf(ctx: BuildCtx, held: string): { key: string; carrier: string } | null {
  const st = ctx.kin.solve.find((q) => q.block === "strand" && q.in?.held !== undefined);
  const o = st?.out;
  const key = o && typeof o === "object" && !Array.isArray(o) ? o.travel : undefined;
  const carrier = st?.in?.carrier;
  void held;
  return typeof key === "string" && typeof carrier === "string" ? { key, carrier } : null;
}

export function buildStrands(ctx: BuildCtx): void {
  if (!ctx.base) return;
  const chains = chainsOf(ctx);
  if (!chains.length) return;
  const step = stepOf(ctx, chains[0]!.held.id);
  if (!step) {
    ctx.issues.push(`${chains[0]!.held.id}: no strand step names the chain's travel (out.travel): its links are not built`);
    return;
  }
  const spr = chains[0]!.held.a;
  const g = ctx.geoms.get(spr);
  const ext = ctx.extent(spr);
  const part = ctx.parts.get(spr);
  if (!g || !ext || !part) return;
  const sh = g.shape;
  const z = num(sh.z, 12);
  const p = num(sh.pitch, 12.7);
  const d1 = num(sh.roller, 8.5);
  const rows = num(sh.rows, 1);
  const rowPitch = num(sh.rowPitch, 15.5);
  const R = sprocketR(z, p);
  const c: Vec2 = [g.frame.o[0], g.frame.o[1]];
  const w0 = ext.w0 + ext.frame.o[2];
  const rowZ = (k: number) => w0 + RW / 2 - 0.375 + k * rowPitch;
  const out: Solid3[] = [];
  // the sprocket: a hub under the chains' plates, a tooth row per chain, a seat at the strands' tangent points
  const hubR = R - PLATE_R - 1.2;
  const a0 = -Math.PI / 2;
  const fa = Math.atan2(part.frame.x[1], part.frame.x[0]);
  const bore = part.profile.holes;
  part.profile = { outer: circle(hubR, 0, 0, 96), holes: bore };
  part.name = `Sprocket ISO 606 08B, ${z} teeth, ${rows > 1 ? `${rows} rows ${rowPitch} mm apart on one hub` : "simplex"}`;
  part.marks.push({ kind: "index", pts: [[(hubR - 7) * Math.cos(a0 - fa), (hubR - 7) * Math.sin(a0 - fa)], [(hubR - 1.5) * Math.cos(a0 - fa), (hubR - 1.5) * Math.sin(a0 - fa)]] });
  const Ls = new Local({ o: [c[0], c[1], 0], x: [1, 0, 0], z: UP }, { joints: [chains[0]!.held.id] });
  for (let k = 0; k < rows; k++) {
    const zc = rowZ(k);
    const t = H.solid(`${spr}-row${k}`, { name: k ? "" : `Tooth rows, ${rows}, of the sprocket`, kind: "pulley", role: part.role, mat: part.mat ?? "Steel C45, teeth induction hardened", outer: sprocketOutline(z, p, d1, a0, "min"), holes: [circle(hubR - 0.05, 0, 0, 96).reverse()], z0: zc - 3.5, z1: zc + 3.5, body: spr, group: `${spr}-sprocket`, ...(k ? { qty: 0 } : {}) });
    Ls.add(t);
  }
  out.push(...Ls.out());
  const anchors: string[] = [];
  const adjust: string[] = [];
  const notes: string[] = [];
  for (const ch of chains) {
    const r = rec(ch.held);
    const N = num(r.links, 21);
    const ends = (r.ends as string[] | undefined) ?? [];
    const G = ctx.S.refPts.get(ends[0] ?? "") ?? null;
    const E = ctx.S.refPts.get(ends[1] ?? "") ?? null;
    if (!G || !E) {
      ctx.issues.push(`${ch.held.id}: the chain's ends ${ends.join(", ")} are not named points`);
      continue;
    }
    const zc = rowZ(ch.row);
    const yH = c[1] - R;
    const yR = c[1] + R;
    // the lengths from each end to the sprocket's tangent points, in links: whole numbers so a roller meets the seats
    const lh = Math.abs(G[0] - c[0]) / p;
    const lr = Math.abs(E[0] - c[0]) / p;
    const wrapL = z / 2;
    if (Math.abs(lh - Math.round(lh)) > 1e-3 || Math.abs(lr - Math.round(lr)) > 1e-3 || Math.abs(Math.round(lh) + Math.round(lr) + wrapL - N) > 1e-6)
      ctx.issues.push(`${ch.held.id}: the chain's ends lie ${lh.toFixed(3)} and ${lr.toFixed(3)} links from the sprocket and it wraps ${wrapL}; the record says ${N} links`);
    const EXT = 60;
    // the path, ccw round the sprocket seen from +z: chain A (wrap +1) from the held end along under the sprocket, round
    // its +x half and back over it to the drawn end; chain B (wrap -1) from the drawn end over the sprocket, round its -x
    // half and under it to the held end. Each straight runs EXT past its end, so the links never reach the closing line.
    const sx = ch.wrap; // the side the strands leave toward is -wrap
    const first: [Vec2, Vec2] = ch.wrap > 0 ? [[G[0] - EXT, yH], [c[0], yH]] : [[E[0] + EXT, yR], [c[0], yR]];
    const arc = ch.wrap > 0 ? arcPts(c[0], c[1], R, -Math.PI / 2, Math.PI / 2, Math.PI / 180) : arcPts(c[0], c[1], R, Math.PI / 2, (3 * Math.PI) / 2, Math.PI / 180);
    const last: [Vec2, Vec2] = ch.wrap > 0 ? [[c[0], yR], [E[0] - EXT, yR]] : [[c[0], yH], [G[0] + EXT, yH]];
    const pts2: Vec2[] = [first[0], ...arc, last[1]];
    const L1 = Math.abs(first[1][0] - first[0][0]);
    const L2 = Math.abs(last[1][0] - last[0][0]);
    let arcLen = 0;
    for (let i = 1; i < arc.length; i++) arcLen += Math.hypot(arc[i]![0] - arc[i - 1]![0], arc[i]![1] - arc[i - 1]![1]);
    const cArc = wrapL * p;
    const total = L1 + cArc + L2;
    const path: ConveyPath = { pts: pts2.map(([x, y]): Vec3 => [x, y, zc]), key: step.key, carrier: step.carrier, up: UP, map: { c: [0, L1, L1 + cArc, total, total + 1], d: [0, L1, L1 + arcLen, L1 + arcLen + L2, L1 + arcLen + L2 + Math.hypot(last[1][0] - first[0][0], last[1][1] - first[0][1])] } };
    void sx;
    const id = ch.held.id.replace(/^held-/, "chain-");
    const mat = "Steel, case hardened";
    const inner0 = zc + RW / 2 + 0.1;
    const outer0 = inner0 + PT + 0.1;
    const plate = () => ({ outer: roundedPoly([[0, 0], [p, 0]], PLATE_R), holes: [circle(PIN / 2 + 0.05, 0, 0, 20).reverse(), circle(PIN / 2 + 0.05, p, 0, 20).reverse()] });
    const s0 = (k: number) => EXT + k * p;
    const body = step.carrier;
    for (let k = 0; k <= N; k++) {
      const q = along(path, distOf(path, s0(k)));
      const fr = { o: q.o, x: q.t, z: UP };
      // the end positions carry the anchor bolts' tongues, not rollers
      if (k > 0 && k < N) out.push({ id: `${id}-roller${k}`, name: k > 1 ? "" : `Roller Ø${d1}, ${N - 1} in the chain (ISO 606 08B)`, role: "hw", kind: "roller", body, frame: { ...fr, o: [q.o[0], q.o[1], zc - RW / 2] }, profile: { outer: circle(d1 / 2, 0, 0, 28), holes: [circle(PIN / 2 + 0.03, 0, 0, 20).reverse()] }, op: { op: "extrude", h: RW, steps: 1 }, marks: [], ex: 0, joints: [ch.held.id], detail: "never", flags: {}, mat, convey: { path, s0: s0(k) }, group: `${id}` });
      out.push({ id: `${id}-pin${k}`, name: k ? "" : `Pin Ø${PIN}, riveted, ${N + 1} in the chain`, role: "hw", kind: "shaft", body, frame: { ...fr, o: [q.o[0], q.o[1], zc - (outer0 + PT - zc) - 0.3] }, profile: { outer: circle(PIN / 2, 0, 0, 20), holes: [] }, op: { op: "extrude", h: 2 * (outer0 + PT - zc) + 0.6, steps: 1 }, marks: [], ex: 0, joints: [ch.held.id], detail: "never", flags: {}, mat, convey: { path, s0: s0(k) }, group: `${id}` });
      if (k === N) break;
      // outer plates on the even links, so both end links are outer pairs on the anchors' tongues
      const zp = k % 2 ? inner0 : outer0;
      const nx = along(path, distOf(path, s0(k + 1))).o;
      for (const [n, zz] of [[0, zp], [1, 2 * zc - zp - PT]] as const)
        out.push({ id: `${id}-plate${k}-${n}`, name: k > 1 || n ? "" : k % 2 ? "Inner link plates" : `Outer link plates, ${(N + 1) / 2} pairs in the chain`, role: "hw", kind: "plate", body, frame: { o: [q.o[0], q.o[1], zz], x: v3.unit(v3.sub(nx, q.o)), z: UP }, profile: plate(), op: { op: "extrude", h: PT, steps: 1 }, marks: [], ex: 0, joints: [ch.held.id], detail: "never", flags: {}, mat, convey: { path, s0: s0(k), s1: s0(k + 1) }, group: `${id}` });
    }
    // the two anchors: the held end's in a block on the base, the drawn end's in a bracket on the drawn body
    const held = anchor(ctx, `${id}-anchor0`, [G[0], G[1]], c[0], zc, "ground", ch.held.id, out, `${titleOf(id)}'s held end`);
    const drawn = anchor(ctx, `${id}-anchor1`, [E[0], E[1]], c[0], zc, ch.run.b, ch.run.id, out, `${titleOf(id)}'s drawn end`);
    anchors.push(held.block, drawn.block);
    adjust.push(held.bolt, drawn.bolt);
    notes.push(`${titleOf(id)}: ${N} links of ISO 606 08B roller chain in row ${ch.row + 1} of the sprocket, wrapping its ${ch.wrap > 0 ? "+x" : "-x"} half; ${Math.round(lh)} links from the held end to the sprocket and ${Math.round(lr)} from the drawn end, so a roller sits in a seat at both tangent points.`);
  }
  ctx.add(out);
  for (const ch of chains) {
    ctx.note({
      id: ch.held.id,
      kit: "J12",
      at: ctx.S.joints.get(ch.held.id)!.at,
      title: `J12 · ${titleOf(ch.held.id)}`,
      note: `${notes.join(" ")} Seen from the carrier each chain's path keeps its shape, so its rollers, pins and plates are carried along it by the chain's travel past the carrier, and the held end stands still while the drawn end moves twice the carrier. Each end is an outer link pair pinned to the tongue of an M8 anchor bolt; the bolt passes a block (on the base) or a bracket (on the output) with a nyloc nut either side, which sets the chain's length and takes up its stretch, the two chains drawn tight against each other (F7, M13). The blocks and brackets are screwed and dowelled (F1, A11). Greased (F8).`,
      badge: ["whole number of links to each seat", "ok"],
      serves: { F1: anchors, F7: adjust, F8: [] },
    });
    ctx.note({ id: ch.run.id, kit: "J12", at: ctx.S.joints.get(ch.run.id)!.at, title: `J12 · ${titleOf(ch.run.id)}`, note: `${titleOf(ch.run.id)}: the running strand of the chain in row ${ch.row + 1}, from the sprocket to its anchor on the ${ch.run.b}; built with the held strand (${ch.held.id}).`, badge: ["built with its chain", "ok"], serves: {} });
  }
}

/**
 * An anchor at a chain's end (pin at `at`, the chain leaving toward the sprocket at x `toward`): an M8 anchor bolt whose
 * tongue sits between the end link's outer plates on their pin, its shank running away from the sprocket through an
 * upright with a nyloc nut either side. On the ground the upright stands on a foot screwed and dowelled to the base; on
 * a moving body it is a bracket whose foot is screwed and dowelled to that body's top face, its arm reaching over to
 * the chain's line.
 */
function anchor(ctx: BuildCtx, id: string, at: Vec2, toward: number, zc: number, body: string, joint: string, out: Solid3[], what: string): { block: string; bolt: string } {
  const s = at[0] < toward ? -1 : 1; // the way away from the sprocket
  const bt = ctx.base!.top;
  // along the bolt: the tongue's far end, the inner nut, the upright, the outer nut and the shank's end, from the pin
  const tip = 12;
  const nutM = 6.5;
  const up0 = tip + nutM + 1;
  const up1 = up0 + 10;
  const end = up1 + nutM + 6;
  const X = (d: number) => at[0] + s * d;
  // the tongue (flat, in the chain's plane) and the shank along x: one bolt
  const T = new Local({ o: [at[0], at[1], 0], x: [s, 0, 0], z: UP }, { joints: [joint] });
  T.add(H.solid(`${id}-tongue`, { name: `Chain anchor bolt M${BOLT}, its tongue on the end link's pin`, kind: "part", role: "hw", mat: "Steel 8.8, zinc plated", outer: roundedPoly([[0, 0], [tip - PLATE_R, 0]], PLATE_R), holes: [circle(PIN / 2 + 0.05, 0, 0, 20).reverse()], z0: zc - TONGUE / 2, z1: zc + TONGUE / 2, body, group: `${id}-bolt` }));
  out.push(...T.out());
  // the bolt's frame: z along it, away from the sprocket; x chosen so the profile's second axis is world z
  const B = new Local({ o: [at[0], at[1], zc], x: [0, s, 0], z: [s, 0, 0] }, { joints: [joint] });
  B.add(H.shaft(`${id}-shank`, { d: BOLT, z0: tip - 1, z1: end, thread: { M: BOLT, z0: tip + 1, z1: end } }, { name: "", body, group: `${id}-bolt` }));
  // nyloc nuts, the inner one against the upright's face, the outer one locking it (M13)
  B.add(H.nut(`${id}-nut0`, BOLT, { z0: up0 - nutM - 0.5, z1: up0 - 0.5, body, name: `Nyloc nut M${BOLT} (DIN 985), both sides of the anchor`, qty: 2 }));
  B.add(H.nut(`${id}-nut1`, BOLT, { z0: up1 + 0.5, z1: up1 + 0.5 + nutM, body, name: "", qty: 0 }));
  // the upright, bored for the shank: on the ground a block on its foot, on a moving body a bracket reaching across
  const onGround = body === "ground";
  const bodyTop = onGround ? bt : topOf(ctx, body);
  const half = 10;
  let up: Vec2[];
  let footY: [number, number];
  if (onGround) {
    up = roundRect(-half, bt + 5 - zc, half, 9, 1.5);
    footY = [at[1] - 13, at[1] + 13];
  } else {
    // the bracket's foot on the body's top beyond its slide's keeper, its arm over to the chain's line
    const e = ctx.extent(body);
    const far = e ? farEdge(ctx, body, at[1]) : at[1] + 30;
    const f0 = far - Math.sign(far - at[1]) * 14;
    const fy0 = Math.min(f0, far - Math.sign(far - at[1]) * 2);
    const fy1 = Math.max(f0, far - Math.sign(far - at[1]) * 2);
    footY = [fy0, fy1];
    const armLo = -8;
    const armHi = 8;
    const yIn = -half;
    const yOut = Math.max(fy1, fy0) - at[1];
    const yFoot0 = Math.min(fy0, fy1) - at[1];
    // (in the bolt's frame the profile's first axis is s times world y, so the outline is mirrored for s = -1)
    // an arm round the bolt reaching over from an upright on the foot; where the chain runs low the arm stands on the foot
    const ftop = bodyTop + 5 - zc;
    up = ftop < armLo ? [[yIn, armLo], [yFoot0, armLo], [yFoot0, ftop], [yOut, ftop], [yOut, armHi], [yIn, armHi]] : [[yIn, ftop], [yOut, ftop], [yOut, armHi], [yIn, armHi]];
    up = up.map(([u, v]): Vec2 => [s * u, v]);
    if (s < 0) up.reverse();
  }
  B.add(H.solid(`${id}-upright`, { name: onGround ? "Chain anchor block, its foot screwed and dowelled to the base" : "Chain anchor bracket, its foot screwed and dowelled to the output", kind: "bracket", role: "ground", mat: "Steel C45", outer: up, holes: [circle(BOLT / 2 + 0.2, 0, 0, 28).reverse()], z0: up0, z1: up1, body, group: `${id}-block` }));
  out.push(...B.out());
  // the foot: a plate on the base (or the body's top) under the upright, two screws and two dowels (F1, A11)
  const F: Frame = { o: [X((up0 + up1) / 2), 0, 0], x: [1, 0, 0], z: UP };
  const Lf = new Local(F, { joints: [joint] });
  const fx = 9;
  Lf.add(H.plate(`${id}-foot`, roundRect(-fx, footY[0], fx, footY[1], 2), { name: "", kind: "bracket", role: "ground", mat: "Steel C45", z0: bodyTop, z1: bodyTop + 5, body, group: `${id}-block` }));
  const ym = (footY[0] + footY[1]) / 2;
  const dy = (footY[1] - footY[0]) / 2 - 4.2;
  for (const [k, y] of [[0, ym - dy], [1, ym + dy]] as const) {
    Lf.add(H.screw(`${id}-sc${k}`, "socket", 4, onGround ? 12 : 10, { at: [-4.5, y, 0], face: bodyTop + 5, dir: -1, body, ...(k ? { name: "", qty: 0 } : { qty: 2 }) }));
    Lf.add(H.dowel(`${id}-dw${k}`, 3, { at: [4.5, y, 0], z0: bodyTop - 4, z1: bodyTop + 5, body, ...(k ? { name: "", qty: 0 } : { qty: 2, name: `Dowel pin Ø3 h6, ${what}'s ${onGround ? "block to the base" : "bracket to the output"}` }) }));
  }
  out.push(...Lf.out());
  return { block: `${id}-upright`, bolt: `${id}-nut0` };
}

/** The world z of a body's top face. */
function topOf(ctx: BuildCtx, body: string): number {
  const e = ctx.extent(body);
  if (!e) return ctx.base!.top;
  const part = ctx.parts.get(body);
  const h = part && part.op.op === "extrude" ? part.op.h : e.w1 - e.w0;
  return e.frame.o[2] + e.w0 + h;
}

/** The far edge (world y) of a body's part from the line y = y0: the side away from the chain. */
function farEdge(ctx: BuildCtx, body: string, y0: number): number {
  const part = ctx.parts.get(body);
  if (!part) return y0 + 30;
  const fy = v3.cross(part.frame.z, part.frame.x);
  const ys = part.profile.outer.map(([x, y]) => part.frame.o[1] + x * part.frame.x[1] + y * fy[1]);
  const lo = Math.min(...ys);
  const hi = Math.max(...ys);
  return Math.abs(hi - y0) > Math.abs(lo - y0) ? hi : lo;
}

void TAU;
