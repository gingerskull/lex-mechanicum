// The branch tables a record's meta file carries (R9): taken by a fresh Kinematics, they give the very poses it would
// have tracked itself, at the record's own setting and at each ghost trace's.
import { describe, expect, it } from "vitest";
import { recordById } from "../../src/catalog";
import { Kinematics } from "../../src/kin";
import type { Kin } from "../../src/kin/types";
import { allIds } from "../../src/mechanisms";
import { metaOf } from "../../tools/meta";
import { importSims, resetSims } from "../../src/kin/sims";

describe("branch tables in the meta file", () => {
  const withTables = allIds().filter((id) => metaOf(id, recordById(id)).tables?.length);

  it("are carried by the records that track a closure", () => {
    expect(withTables).toContain("walschaerts-valve-gear");
  });

  for (const id of withTables)
    it(`${id}: the tables it ships give the poses it would track itself`, () => {
      const meta = metaOf(id, recordById(id));
      const own = new Kinematics(meta.kin as unknown as Kin);
      const fed = new Kinematics(meta.kin as unknown as Kin);
      for (const t of meta.tables!) fed.useBranchTables(t.blocks, t.controls);
      for (const t of meta.tables!)
        for (let i = 0; i < 24; i++) {
          const u = (i / 24) * Math.PI * 2 + 0.013;
          const a = own.pose(u, t.controls), b = fed.pose(u, t.controls);
          for (const [p, v] of a.points) expect(b.points.get(p), `${p} at ${u}`).toEqual(v);
        }
    });
});

describe("timed blocks' simulations in the meta file", () => {
  for (const id of ["anchor-escapement", "lever-escapement", "star-wheel", "verge-escapement"])
    it(`${id}: a page that takes them poses at once, and as it would have simulated`, () => {
      const meta = metaOf(id, recordById(id));
      expect(Object.keys(meta.sims ?? {}).length, id).toBeGreaterThan(0);
      const own = new Kinematics(meta.kin as unknown as Kin);
      const want = [0.3, 1.7, 4.2].map((u) => own.pose(u).points);
      // a fresh page: nothing simulated yet, the meta file's results taken
      resetSims();
      importSims(JSON.parse(JSON.stringify(meta.sims)));
      const fed = new Kinematics(meta.kin as unknown as Kin);
      const t0 = performance.now();
      const got = [0.3, 1.7, 4.2].map((u) => fed.pose(u).points);
      expect(performance.now() - t0).toBeLessThan(200);
      // exact where the arrays ship whole; long ones ship to a millionth, which no drawing can show
      got.forEach((pts, k) => {
        for (const [p, v] of want[k]!) v.forEach((x, i) => expect(pts.get(p)![i]!, p).toBeCloseTo(x, 3));
      });
    });
});
