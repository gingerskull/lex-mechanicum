// A kit per joint type (A21): its block, its hardware rule, its explode axis, its see-through zone and its detail rungs.
import { afterAll, describe, expect, it } from "vitest";
import { buildWithContext } from "../../src/builder/build";
import type { BuildCtx } from "../../src/builder/ctx";
import { KITS, rungsOf } from "../../src/builder/kits";
import { rules } from "../../src/builder/registry";
import { KIT_IDS, type KitId } from "../../src/builder/sites";
import { BLOCKS } from "../../src/kin";
import { v3 } from "../../src/kin/math";
import { fixtureRecord } from "./fixtures";

const ctxs: BuildCtx[] = [];
afterAll(() => ctxs.forEach((c) => c.dispose()));

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
    J8: "kin:beltDrive", J9: "kin:crossedMesh", J10: "kin:universalJoint", J11: "lead-screw", J12: "kin:chainDrive", J13: "kin:flexureHinge",
    pallet: "kin:escapement", "fork-pin": "kin:fork", "pawl-tooth": "kin:ratchet", "pin-lobe": "kin:pinLobe", "tongue-slot": "kin:tongueSlot",
    "ring-hub": "kin:ringHub", "ring-rollers": "kin:ringRollers", "strap-sheave": "kin:rope", "groove-cam": "kin:grooveCam", "cross-pin": "universal-joint", trunnion: "oscillating-cylinder", "piston-bore": "oscillating-cylinder",
  };
  for (const id of KIT_IDS) {
    it(`${id}: builds its joint, with an axis, a zone and a note`, async () => {
      const { ctx, assembly } = await buildWithContext(fixtureRecord(FIX[id]));
      ctxs.push(ctx);
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
