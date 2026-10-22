import { KIN_VOCAB, TEACHING_VOCAB, type Kin, type Teaching } from "./kin";
import type { CatalogRecord } from "./schema";

type Obj = Record<string, unknown>;
const isObj = (x: unknown): x is Obj => typeof x === "object" && x !== null && !Array.isArray(x);
const isNum = (x: unknown): x is number => typeof x === "number" && Number.isFinite(x);
const isStr = (x: unknown): x is string => typeof x === "string" && x.length > 0;
const arr = (x: unknown): unknown[] => (Array.isArray(x) ? x : []);

/** Degrees of freedom a joint leaves between its two bodies, planar (3 per free body) and spatial (6). */
const FREEDOM: Record<"Planar" | "Spatial", Record<string, number>> = {
  Planar: {
    revolute: 1, prismatic: 1, screw: 1, flexure: 1, "pin-in-slot": 2, "gear-mesh": 2, "cam-contact": 2, belt: 2, rolling: 2,
  },
  Spatial: {
    revolute: 1, prismatic: 1, screw: 1, flexure: 1, cylindrical: 2, universal: 2, spherical: 3, planar: 3,
    "pin-in-slot": 5, "gear-mesh": 5, "cam-contact": 5, belt: 5, rolling: 5,
  },
};

/** Mobility from bodies and joints (Gruebler / Kutzbach): 3 (planar) or 6 (spatial) per free body minus what each joint removes. */
export function mobility(kin: Kin, plane: "Planar" | "Spatial"): number | undefined {
  const per = plane === "Planar" ? 3 : 6;
  // a body no joint reaches is fixed where it stands (a port face, a fixed plate): it is part of the ground
  const joined = new Set(kin.joints.flatMap((j) => [j.a, j.b]));
  let m = per * (kin.bodies.filter((b) => b.id !== "ground" && joined.has(b.id)).length);
  for (const j of kin.joints) {
    const f = FREEDOM[plane][j.type];
    if (f === undefined) return undefined;
    m -= per - f;
  }
  return m;
}

const VIEW_VERTICES = /^VIEW -?\d+(\.\d+)? -?\d+(\.\d+)?$/;

/** Checks the `kin` and `teaching` blocks of one record against the record spec. Returns lines, `<id>: <what>`. */
/** The functions a parameter expression may call (src/kin/expr.ts). */
const EXPR_FNS = new Set(["sin", "cos", "tan", "sqrt", "abs"]);

export function validateKinTeaching(r: CatalogRecord, opts: { required: boolean }): string[] {
  const problems: string[] = [];
  const say = (what: string) => problems.push(`${r.id}: ${what}`);
  const kin = (r as { kin?: Kin }).kin;
  const teaching = (r as { teaching?: Teaching }).teaching;

  if (kin === undefined || teaching === undefined) {
    if (opts.required || kin !== undefined || teaching !== undefined) {
      if (kin === undefined) say("kin block missing");
      if (teaching === undefined) say("teaching block missing");
    }
    if (kin === undefined || teaching === undefined) return problems;
  }
  if (!isObj(kin) || !isObj(teaching)) return [...problems, `${r.id}: kin and teaching must be objects`];

  // ---- kin ----------------------------------------------------------------------------------------------------
  const lists = ["bodies", "joints", "params", "design", "drivers", "solve", "points", "outputs"] as const;
  for (const l of lists) if (!Array.isArray(kin[l])) say(`kin.${l} must be an array`);
  if (problems.length) return problems;

  const ids = (name: string, list: unknown[]) => {
    const seen = new Set<string>();
    for (const x of list) {
      const id = isObj(x) ? x.id : undefined;
      if (!isStr(id)) say(`${name}: an entry has no id`);
      else if (seen.has(id)) say(`${name}: duplicate id ${id}`);
      else seen.add(id);
    }
    return seen;
  };
  const bodies = ids("kin.bodies", kin.bodies);
  const joints = ids("kin.joints", kin.joints);
  const params = ids("kin.params", kin.params);
  const design = ids("kin.design", kin.design);
  const drivers = ids("kin.drivers", kin.drivers);
  const points = ids("kin.points", kin.points);
  const outputs = ids("kin.outputs", kin.outputs);
  ids("kin.solve", kin.solve);

  if (!bodies.has("ground")) say("kin.bodies has no `ground` body");
  for (const b of kin.bodies) {
    if (!KIN_VOCAB.bodyRole.includes(b.role)) say(`body ${b.id}: role "${String(b.role)}" not in vocabulary`);
    if (!isObj(b.shape) || !KIN_VOCAB.shape.includes(b.shape.type)) say(`body ${b.id}: shape.type "${String((b.shape as Obj | undefined)?.type)}" not in vocabulary`);
    else if (b.shape.type === "custom") {
      if (!KIN_VOCAB.customOp.includes(b.shape.op as never)) say(`body ${b.id}: custom shape needs op in ${KIN_VOCAB.customOp.join("/")}`);
      if (b.shape.profile === undefined) say(`body ${b.id}: custom shape needs a profile`);
    }
    if (b.at?.joint !== undefined && !joints.has(b.at.joint)) say(`body ${b.id}: at.joint ${b.at.joint} is not a joint`);
    if (b.at?.point !== undefined && !points.has(b.at.point)) say(`body ${b.id}: at.point ${b.at.point} is not a point`);
  }

  for (const j of kin.joints) {
    if (!KIN_VOCAB.joint.includes(j.type)) say(`joint ${j.id}: type "${String(j.type)}" not in vocabulary`);
    for (const end of ["a", "b"] as const) if (!bodies.has(j[end])) say(`joint ${j.id}: ${end} "${String(j[end])}" is not a body`);
    if (j.at === undefined) say(`joint ${j.id}: no origin (at)`);
    const needsAxis = !["spherical", "planar", "gear-mesh", "cam-contact", "belt", "rolling", "pin-in-slot"].includes(j.type);
    // a component may be a parameter expression ("cos(beta)"), as a position's may (src/kin/expr.ts)
    if (needsAxis && !(Array.isArray(j.axis) && j.axis.length === 3 && j.axis.every((x) => isNum(x) || isStr(x)))) say(`joint ${j.id}: axis must be [x, y, z]`);
    if (j.type === "belt" && !KIN_VOCAB.flexible.includes(j.flexible as never)) say(`joint ${j.id}: belt joint needs flexible in ${KIN_VOCAB.flexible.join("/")}`);
    if (j.limits !== undefined && !(Array.isArray(j.limits) && j.limits.length === 2 && j.limits.every(isNum) && j.limits[0] <= j.limits[1])) say(`joint ${j.id}: limits must be [lo, hi]`);
  }

  for (const p of kin.params) {
    if (!isNum(p.value) || !isNum(p.min) || !isNum(p.max)) say(`param ${p.id}: value, min and max must be numbers`);
    else if (p.value < p.min || p.value > p.max) say(`param ${p.id}: value ${p.value} outside [${p.min}, ${p.max}]`);
    if (!isStr(p.unit)) say(`param ${p.id}: no unit`);
  }
  const options = new Set<string>();
  for (const d of kin.design) {
    if (!Array.isArray(d.options) || d.options.length < 2) say(`design ${d.id}: needs at least two options`);
    else {
      for (const o of d.options) options.add(String(o));
      if (!d.options.includes(d.value)) say(`design ${d.id}: value ${String(d.value)} is not one of its options`);
    }
  }

  const driverJoints = new Set<string>();
  for (const d of kin.drivers) {
    if (!KIN_VOCAB.driver.includes(d.kind)) say(`driver ${d.id}: kind "${String(d.kind)}" not in vocabulary`);
    if (d.kind === "select") {
      if (!Array.isArray(d.options) || d.options.length < 2) say(`driver ${d.id}: a selector needs named options`);
      continue;
    }
    if (d.joint === undefined || !joints.has(d.joint)) say(`driver ${d.id}: joint "${String(d.joint)}" is not a joint`);
    else driverJoints.add(d.joint);
    if (!(Array.isArray(d.range) && d.range.length === 2 && d.range.every(isNum) && d.range[0] < d.range[1])) say(`driver ${d.id}: range must be [lo, hi]`);
    else if (isNum(d.default) && (d.default < d.range[0] || d.default > d.range[1])) say(`driver ${d.id}: default ${d.default} outside its range`);
    if (d.kind === "oscillating" && !(isNum(d.lo) && isNum(d.hi) && d.lo < d.hi)) say(`driver ${d.id}: an oscillating driver gives lo and hi`);
  }
  if (!kin.drivers.length) say("kin.drivers is empty");

  // names a solve block or a point may read: bodies, joints, params, design choices, drivers, earlier outs
  const known = new Set<string>([...bodies, ...joints, ...params, ...design, ...drivers, ...points]);
  const claimed = new Map<string, string>();
  const claim = (jointId: string, by: string) => {
    if (!joints.has(jointId)) return say(`${by}: joint "${jointId}" is not a joint`);
    const prev = claimed.get(jointId);
    if (prev !== undefined) say(`joint ${jointId} belongs to two blocks (${prev} and ${by})`);
    claimed.set(jointId, by);
  };
  const resolveIn = (v: unknown, by: string, key: string) => {
    if (Array.isArray(v)) return v.forEach((x) => resolveIn(x, by, key));
    if (isObj(v)) return Object.values(v).forEach((x) => resolveIn(x, by, key));
    if (isNum(v) || typeof v === "boolean") return;
    // a block's option (slider-dyad kind "rpr", five-bar mode "ik") names no input
    if (key === "kind" || key === "mode" || key === "form" || key === "shape") return;
    // a parameter expression (src/kin/expr.ts) is fine when every name in it is known
    if (isStr(v) && /[-+*/^() ]/.test(v) && (v.match(/[A-Za-z_][A-Za-z0-9_]*/g) ?? []).every((n) => known.has(n) || EXPR_FNS.has(n))) return;
    if (!isStr(v) || !known.has(v)) say(`solve ${by}: in.${key} "${String(v)}" is not a body, point, param, joint, driver or earlier out`);
  };
  // what the blocks produce: a construction point (a crossing of two lines) may be traced and read like a named point
  const made = new Set<string>();
  for (const s of kin.solve) {
    const by = s.id;
    if (!KIN_VOCAB.block.includes(s.block as never) && !/^new:[a-z][a-z0-9-]*$/.test(String(s.block))) {
      say(`solve ${by}: block "${String(s.block)}" is not in the library (name a proposed block as "new:<name>")`);
    }
    if (!isObj(s.in)) say(`solve ${by}: in must be an object`);
    else for (const [k, v] of Object.entries(s.in)) resolveIn(v, by, k);
    // a name, a list of names, or the block's keyed outputs ({ angle: "gear-turn" }, as src/kin/registry reads them)
    const outs = typeof s.out === "string" ? [s.out] : isObj(s.out) && !Array.isArray(s.out) ? Object.values(s.out) : arr(s.out);
    if (!outs.length || !outs.every(isStr)) say(`solve ${by}: out must name what the block produces`);
    for (const o of outs as string[]) {
      known.add(o);
      made.add(o);
    }
    if (s.branch !== undefined && !design.has(s.branch) && !options.has(s.branch)) say(`solve ${by}: branch "${s.branch}" is not a design choice or one of its options`);
    for (const j of arr(s.joints) as string[]) claim(j, `solve ${by}`);
  }
  if (kin.fallback !== null) {
    if (!isObj(kin.fallback) || kin.fallback.numeric !== true) say("kin.fallback must be null or { numeric: true, loops }");
    else for (const j of arr(kin.fallback.joints) as string[]) claim(j, "fallback");
  }
  for (const j of kin.joints) {
    if (!claimed.has(j.id) && !driverJoints.has(j.id)) say(`joint ${j.id} belongs to no solve block, fallback or driver`);
    if (claimed.has(j.id) && driverJoints.has(j.id)) say(`joint ${j.id} is driven and also claimed by ${claimed.get(j.id)}`);
  }

  for (const p of kin.points) {
    if (!bodies.has(p.body)) say(`point ${p.id}: body "${String(p.body)}" is not a body`);
    // a coordinate may be an expression of the params, as a joint's position may (a pen a control moves along its rod)
    if (!(Array.isArray(p.local) && p.local.length >= 2 && p.local.every((c) => isNum(c) || isStr(c)))) say(`point ${p.id}: local must be [x, y, z]`);
  }
  for (const o of kin.outputs) {
    if (!KIN_VOCAB.output.includes(o.kind)) say(`output ${o.id}: kind "${String(o.kind)}" not in vocabulary`);
    // an angle output may read a driver's own value (absolute, in the driver's units)
    if (!bodies.has(o.of) && !points.has(o.of) && !joints.has(o.of) && !made.has(o.of) && !(o.kind === "angle" && drivers.has(o.of))) say(`output ${o.id}: of "${String(o.of)}" is not a body, point, joint or (for an angle) driver`);
  }

  // mobility (K11)
  const plane = r.motion?.plane;
  const m = plane === "Planar" || plane === "Spatial" ? mobility(kin, plane) : undefined;
  if (m === undefined) say(`mobility not countable (unknown joint type for a ${String(plane)} mechanism)`);
  else if (m !== r.dof && !/overconstrained|mobility/i.test(r.topology?.notes ?? "")) {
    say(`mobility counted from kin is ${m} but dof is ${r.dof} (say "overconstrained" in topology.notes if that is why)`);
  }

  // ---- teaching -------------------------------------------------------------------------------------------------
  const t = teaching;
  const rv = t.review;
  if (!isObj(rv)) say("teaching.review missing");
  else {
    if (!TEACHING_VOCAB.verdict.includes(rv.verdict)) say(`teaching.review.verdict "${String(rv.verdict)}" not in keep/tweak/rethink`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(rv.date))) say("teaching.review.date must be YYYY-MM-DD");
    if (!isStr(rv.note)) say("teaching.review.note missing");
  }

  const pointish = (name: string, v: unknown, where: string) => {
    if (!isStr(v) || !(points.has(v) || joints.has(v) || bodies.has(v) || made.has(v))) say(`${where}: ${name} "${String(v)}" is not a named point, joint or body`);
  };

  if (!Array.isArray(t.principle) || !t.principle.length) say("teaching.principle must list the principle bodies and points (T3)");
  for (const p of arr(t.principle) as Obj[]) {
    if (isStr(p.body)) {
      if (!bodies.has(p.body)) say(`teaching.principle: body "${p.body}" is not a body`);
    } else if (isStr(p.point)) pointish("point", p.point, "teaching.principle");
    else say("teaching.principle entry needs body or point");
  }

  const controlIds = ids("teaching.controls", arr(t.controls));
  const controlled = new Set<string>();
  for (const c of arr(t.controls) as Obj[]) {
    if (!TEACHING_VOCAB.control.includes(c.kind as never)) {
      say(`control ${String(c.id)}: kind "${String(c.kind)}" not in vocabulary`);
      continue;
    }
    const kind = c.kind as string;
    const ref = c[kind];
    const set = kind === "param" ? params : kind === "design" ? design : drivers;
    if (!isStr(ref) || !set.has(ref)) say(`control ${String(c.id)}: ${kind} "${String(ref)}" is not a ${kind === "param" || kind === "design" ? kind : "driver"} of kin`);
    else controlled.add(ref);
  }
  // a driver the cycle sets through a block (a path the tip follows) is the scrubber itself: no control of its own
  for (const d of kin.drivers) if (!controlled.has(d.id) && !isObj((d as { cycle?: unknown }).cycle)) say(`driver ${d.id} has no control (T14)`);

  ids("teaching.traces", arr(t.traces));
  for (const tr of arr(t.traces) as Obj[]) {
    pointish("point", tr.point, `trace ${String(tr.id)}`);
    if (tr.ticks !== undefined && !(isObj(tr.ticks) && isNum(tr.ticks.every) && tr.ticks.every > 0)) say(`trace ${String(tr.id)}: ticks.every must be a positive number`);
    for (const g of arr(tr.ghosts) as Obj[]) {
      const c = g.control;
      if (!isStr(c) || !(controlIds.has(c) || params.has(c) || design.has(c) || drivers.has(c))) say(`trace ${String(tr.id)}: ghost control "${String(c)}" is not a control`);
      else if (params.has(c) && isNum(g.value)) {
        const p = kin.params.find((x) => x.id === c)!;
        if (g.value < p.min || g.value > p.max) say(`trace ${String(tr.id)}: ghost value ${g.value} outside the range of ${c}`);
      }
    }
  }
  const comets = arr(t.traces).filter((x) => isObj(x) && x.comet === true).length;
  if (arr(t.traces).length && comets > 1) say("only the first trace gets the comet");

  ids("teaching.overlays", arr(t.overlays));
  const OVERLAY_POINTS = ["from", "to", "at", "center", "through", "point", "a", "b"];
  for (const o of arr(t.overlays) as Obj[]) {
    if (!TEACHING_VOCAB.overlay.includes(o.kind as never)) say(`overlay ${String(o.id)}: kind "${String(o.kind)}" not in vocabulary`);
    for (const k of OVERLAY_POINTS) if (o[k] !== undefined) pointish(k, o[k], `overlay ${String(o.id)}`);
    for (const p of arr(o.points)) pointish("points", p, `overlay ${String(o.id)}`);
    if (o.label !== undefined && !isStr(o.label)) say(`overlay ${String(o.id)}: label must be text`);
  }

  const v = t.view;
  if (!isStr(v)) say("teaching.view missing (T7)");
  else if (!TEACHING_VOCAB.viewName.includes(v as never) && !VIEW_VERTICES.test(v) && !(v.startsWith("AUX ") && joints.has(v.slice(4)))) {
    say(`teaching.view "${v}" is not PLAN/FRONT/SIDE/ISOMETRIC/DIMETRIC, "AUX <joint>" or "VIEW az el"`);
  }

  ids("teaching.views", arr(t.views));
  for (const w of arr(t.views) as Obj[]) {
    if (!TEACHING_VOCAB.viewKind.includes(w.kind as never)) say(`view ${String(w.id)}: kind "${String(w.kind)}" not section or detail`);
    if (w.kind === "section" && !(isObj(w.plane) && Array.isArray(w.plane.origin) && Array.isArray(w.plane.normal))) say(`view ${String(w.id)}: a section needs plane {origin, normal}`);
    if (w.kind === "detail" && !(Array.isArray(w.center) && isNum(w.scale))) say(`view ${String(w.id)}: a detail needs center and scale`);
    for (const h of arr(w.highlight)) {
      const name = String(h);
      const base = name.split(".")[0]!;
      if (!(bodies.has(base) || points.has(base) || joints.has(base))) say(`view ${String(w.id)}: highlight "${name}" is not a body, point or joint (use body.feature for a feature of a body)`);
    }
  }

  if (t.timeMap !== undefined) {
    const tm = t.timeMap;
    if (!isStr(tm.feature) || !isNum(tm.slow) || tm.slow <= 0 || !(Array.isArray(tm.span) && tm.span.length === 2 && tm.span.every(isNum))) {
      say("teaching.timeMap needs feature, slow > 0 and span [from, to]");
    }
  }

  const plots = Array.isArray(t.plot) ? t.plot : [t.plot];
  if (!plots.length || !plots.every(isObj)) say("teaching.plot missing (P10)");
  for (const p of plots as Obj[]) {
    if (!isObj(p)) continue;
    for (const k of ["x", "y"]) {
      const ref = p[k];
      if (!isStr(ref) || !(outputs.has(ref) || drivers.has(ref))) say(`teaching.plot.${k} "${String(ref)}" is not an output or a driver`);
    }
    if (!isStr(p.label)) say("teaching.plot needs a label");
  }

  if (!Array.isArray(t.claims)) say("teaching.claims must be an array");
  for (const c of arr(t.claims) as Obj[]) {
    if (!isStr(c.text)) say("a claim has no text");
    if (!isStr(c.output) || !outputs.has(c.output)) say(`claim "${String(c.text)}": output "${String(c.output)}" is not in kin.outputs`);
    if (!TEACHING_VOCAB.stat.includes(c.stat as never)) say(`claim "${String(c.text)}": stat "${String(c.stat)}" not in vocabulary`);
    if (!isNum(c.value)) say(`claim "${String(c.text)}": value must be a number`);
    if (!isNum(c.tol) || c.tol < 0) say(`claim "${String(c.text)}": tol must be a number >= 0`);
  }
  if (!Array.isArray(t.exceptions)) say("teaching.exceptions must be an array");
  for (const e of arr(t.exceptions) as Obj[]) if (!isStr(e.reason)) say("an exception needs a reason (T12)");

  return problems;
}

/** Retired v2 build fields are rejected at record_version 3. */
export function validateRetired(r: CatalogRecord): string[] {
  const b = r.build as unknown as Obj | undefined;
  const retired = ["members", "joints", "input", "output", "params", "range", "overlays", "plot"];
  return b ? retired.filter((k) => b[k] !== undefined).map((k) => `${r.id}: build.${k} is retired in record v3`) : [];
}
