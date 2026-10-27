// Every rule has a fixture: a record whose build makes the rule fire (A21), and the registry serves every AUTO requirement
// of the standard, which is what the generated AUTO table in the standard is made from. A kit per joint type (A21): its
// block, its hardware rule, its explode axis, its see-through zone and its detail rungs. The rules and the kits share
// their fixtures, so they share one build of each.
import { readFileSync } from "node:fs";
import { afterAll, describe, expect, it } from "vitest";
import { buildWithContext, type Assembly } from "../../src/builder/build";
import type { BuildCtx } from "../../src/builder/ctx";
import { KITS, rungsOf } from "../../src/builder/kits";
import { autoTable, rules } from "../../src/builder/registry";
import { KIT_IDS, type KitId } from "../../src/builder/sites";
import { BLOCKS } from "../../src/kin";
import { v3 } from "../../src/kin/math";
import { fixtureRecord } from "./fixtures";

const built = new Map<string, Promise<{ ctx: BuildCtx; assembly: Assembly }>>();
const build = (name: string) => {
  if (!built.has(name)) built.set(name, buildWithContext(fixtureRecord(name)));
  return built.get(name)!;
};
afterAll(async () => {
  for (const p of built.values()) (await p).ctx.dispose();
});

describe("rule registry", () => {
  it("has unique rule ids, every rule AUTO, every rule with a fixture", () => {
    expect(new Set(rules.map((r) => r.id)).size).toBe(rules.length);
    for (const r of rules) {
      expect(r.tier).toBe("AUTO");
      expect(r.fixture, r.id).toBeTruthy();
    }
  });

  it("serves every AUTO requirement id of the standard", () => {
    const text = readFileSync(new URL("../../docs/mechanism-standard.md", import.meta.url), "utf8");
    const sections = [/^### 5\.1 /m, /^### 5b\. /m, /^### 6\.1 /m, /^## 7\. /m, /^## 8\. /m];
    const ids: string[] = [];
    for (const re of sections) {
      const start = text.search(re);
      expect(start, String(re)).toBeGreaterThan(0);
      const rest = text.slice(text.indexOf("\n", start) + 1);
      const end = rest.search(/^#{2,3} /m);
      for (const line of (end > 0 ? rest.slice(0, end) : rest).split("\n")) {
        const cells = line.split("|").map((c) => c.trim());
        const id = cells[1] ?? "";
        if (!/^[A-Z]{1,2}\d+$/.test(id)) continue;
        if (id.startsWith("J") || cells.slice(2).some((c) => /\bAUTO\b/.test(c))) ids.push(id);
      }
    }
    const served = new Set(autoTable().flatMap((r) => r.ids));
    expect([...new Set(ids)].filter((id) => !served.has(id))).toEqual([]);
  });
});

describe("rule fixtures", () => {
  for (const r of rules) {
    it(`${r.id} fires on ${r.fixture}`, async () => {
      const { ctx } = await build(r.fixture);
      expect(r.applies(ctx), `${r.id} applies`).toBe(true);
      expect(ctx.fired[r.id]?.length ?? 0, `${r.id} fired`).toBeGreaterThan(0);
    });
  }
});

describe("joint kits", () => {
  it("has a kit for every kind the classification can give, with a block, a rule and rungs", () => {
    expect(Object.keys(KITS).sort()).toEqual([...KIT_IDS].sort());
    for (const k of Object.values(KITS)) {
      expect(k.blocks.length, k.id).toBeGreaterThan(0);
      for (const b of k.blocks) expect(Object.keys(BLOCKS), `${k.id} block ${b}`).toContain(b);
      expect(rules.map((r) => r.id), `${k.id} rule`).toContain(k.rule);
      expect(rungsOf(k).length, `${k.id} rungs`).toBeGreaterThan(0);
    }
  });

  // each kit on a record that has its joint kind: the zone, the axis and the engineering note
  const FIX: Record<KitId, string> = {
    J1: "four-bar", J2: "four-bar", J3: "four-bar", J4: "kin:geneva", J5: "kin:sliderCrank", J6: "kin:gearPair", J7: "kin:camFollower",
    J8: "kin:beltDrive", J9: "kin:crossedMesh", J10: "kin:universalJoint", J11: "lead-screw", J12: "chain-drive", "ball-cage": "ball-disc-integrator", J13: "kin:flexureHinge",
    pallet: "kin:escapement", "fork-pin": "kin:fork", "pawl-tooth": "kin:ratchet", "pin-lobe": "kin:pinLobe", "tongue-slot": "kin:tongueSlot",
    "ring-hub": "kin:ringHub", "ring-rollers": "kin:ringRollers", "strap-sheave": "kin:rope", "groove-cam": "kin:grooveCam", "cross-pin": "universal-joint", trunnion: "oscillating-cylinder", "piston-bore": "oscillating-cylinder", "eccentric": "eccentric-sheave", die: "walschaerts-valve-gear", hub: "whitworth", "ball-socket": "swash-plate", slipper: "swash-plate", "sphere-fit": "rzeppa-cv-joint",
    "ring-carrier": "internal-gear-pair",
    "eccentric-bearing": "cycloidal-drive",
    "pin-ring": "cycloidal-drive",
    "pin-hole": "cycloidal-drive",
    "spider-pin": "differential",
    "oblique-journal": "wobble-box",
    "leg-bore": "hobsons-joint",
  };
  for (const id of KIT_IDS) {
    it(`${id}: builds its joint, with an axis, a zone and a note`, async () => {
      const { ctx, assembly } = await build(FIX[id]);
      const js = ctx.joints.filter((j) => j.kit === id);
      expect(js.length, `a ${id} joint in ${FIX[id]}`).toBeGreaterThan(0);
      for (const j of js) {
        const a = KITS[id].explodeAxis(ctx, j);
        expect(v3.len(a)).toBeCloseTo(1, 6);
        const z = KITS[id].zones(ctx, j);
        expect(z.length).toBeGreaterThan(0);
        expect(z[0]!.r).toBeGreaterThan(0);
      }
      expect(assembly.notes.some((n) => n.kit === id), `a note for ${id}`).toBe(true);
    });
  }
});
