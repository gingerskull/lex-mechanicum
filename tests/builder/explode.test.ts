// The explode rule (E1 to E10) on real builds: rigid units move as one, a pressed part goes with the part it sits in, a
// support takes its hardware with it while the main parts come apart one by one, the structure lifts off the base while a
// moving body slides along its axis, and at full explode the parts stand apart.
import { afterAll, describe, expect, it } from "vitest";
import { buildWithContext, type Assembly } from "../../src/builder/build";
import type { BuildCtx } from "../../src/builder/ctx";
import { mat4 } from "../../src/solids/frame";
import { tessellate } from "../../src/solids/tessellate";
import type { Solid3 } from "../../src/solids/types";
import { FORM } from "../../src/style/form";
import { fixtureRecord } from "./fixtures";

const built = new Map<string, Promise<{ ctx: BuildCtx; assembly: Assembly }>>();
const build = (name: string) => {
  if (!built.has(name)) built.set(name, buildWithContext(fixtureRecord(name)));
  return built.get(name)!;
};
afterAll(async () => {
  for (const p of built.values()) (await p).ctx.dispose();
});

type Box = [number, number, number, number, number, number];
function boxOf(s: Solid3, shift: [number, number, number] = [0, 0, 0]): Box {
  const pos = s.mesh?.pos ?? tessellate({ outer: s.profile.outer, holes: [] }, s.op).pos;
  const m = mat4(s.frame);
  const b: Box = [Infinity, Infinity, Infinity, -Infinity, -Infinity, -Infinity];
  for (let i = 0; i < pos.length; i += 3) {
    const x = pos[i]!, y = pos[i + 1]!, z = pos[i + 2]!;
    const p = [m[0]! * x + m[4]! * y + m[8]! * z + m[12]!, m[1]! * x + m[5]! * y + m[9]! * z + m[13]!, m[2]! * x + m[6]! * y + m[10]! * z + m[14]!];
    for (let k = 0; k < 3; k++) {
      b[k] = Math.min(b[k]!, p[k]! + shift[k]!);
      b[k + 3] = Math.max(b[k + 3]!, p[k]! + shift[k]!);
    }
  }
  return b;
}
const exploded = (s: Solid3): [number, number, number] => {
  const a = s.exAxis ?? [0, 0, 0];
  const d = s.ex * FORM.explode.gap;
  return [a[0] * d, a[1] * d, a[2] * d];
};
const overlap = (p: Box, q: Box, tol = 0.6) => [0, 1, 2].every((k) => Math.min(p[k + 3]!, q[k + 3]!) - Math.max(p[k]!, q[k]!) > tol);
const moveKey = (s: Solid3) => `${s.ex}|${(s.exAxis ?? []).join(",")}`;

describe("the explode (E1 to E10)", () => {
  for (const id of ["four-bar", "bevel-gears"])
    it(`${id}: a group moves as one, and a bearing goes with the housing it is pressed into (E1, E2, E5)`, async () => {
      const { assembly } = await build(id);
      const byGroup = new Map<string, Set<string>>();
      for (const s of assembly.solids) if (s.group) byGroup.set(s.group, (byGroup.get(s.group) ?? new Set()).add(moveKey(s)));
      for (const [g, keys] of byGroup) expect(keys.size, g).toBe(1);
      const housings = assembly.solids.filter((s) => s.kind === "housing" && s.body === "ground");
      for (const b of assembly.solids.filter((s) => s.kind === "bearing" && s.body === "ground")) {
        const host = housings.find((h) => b.id.startsWith(h.id));
        if (host) expect(moveKey(b), b.id).toBe(moveKey(host));
      }
    });

  it("lifts the structure off the base, slides a moving body along its axis away from the middle, and leaves the base where it is (E8, E10)", async () => {
    const { assembly } = await build("bevel-gears");
    const S = (id: string) => assembly.solids.find((s) => s.id === id)!;
    expect(S("base").ex).toBe(0);
    expect(S("O1-pb-b0").exAxis).toEqual([0, 0, 1]);
    // the pinion shaft sits left of the middle and leaves to the left, along its own axis
    const pin = S("O1-axle");
    expect(pin.exAxis![0]).toBeLessThan(-0.99);
    expect(pin.ex).toBeGreaterThan(0);
  });

  it("moves a support block with its bearings, screws and dowels, and comes apart main part by main part", async () => {
    const bevel = (await build("bevel-gears")).assembly.solids;
    const S = (id: string) => bevel.find((s) => s.id === id)!;
    for (const id of ["O1-pb-b0-brg", "O1-pb-b0-sc0", "O1-pb-b0-sc0-sh", "O1-pb-b0-dw0"]) expect(moveKey(S(id)), id).toBe(moveKey(S("O1-pb-b0")));
    // the links of the four-bar each go their own way
    const fb = (await build("four-bar")).assembly.solids.filter((s) => s.kind === "part" && s.body !== "ground");
    expect(new Set(fb.map(moveKey)).size).toBe(fb.length);
  });

  for (const id of ["four-bar", "bevel-gears"])
    it(`${id}: at full explode the parts stand apart, where as assembled they sit inside one another (E9)`, async () => {
      const { assembly } = await build(id);
      const S = assembly.solids;
      const B0 = S.map((s) => boxOf(s));
      const B1 = S.map((s) => boxOf(s, exploded(s)));
      let before = 0;
      const after: string[] = [];
      for (let i = 0; i < S.length; i++)
        for (let j = i + 1; j < S.length; j++) {
          if (moveKey(S[i]!) === moveKey(S[j]!)) continue;
          if (overlap(B0[i]!, B0[j]!)) before++;
          if (overlap(B1[i]!, B1[j]!)) after.push(`${S[i]!.id} x ${S[j]!.id}`);
        }
      expect(before).toBeGreaterThan(40);
      // boxes are coarse (a diagonal link's box covers posts it never touches), so a few pairs may stay
      expect(after.length, after.join("; ")).toBeLessThanOrEqual(8);
    });
});
