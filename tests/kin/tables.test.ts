// The branch tables a record's meta file carries (R9): taken by a fresh Kinematics, they give the very poses it would
// have tracked itself, at the record's own setting and at each ghost trace's.
import { describe, expect, it } from "vitest";
import { recordById } from "../../src/catalog";
import { Kinematics } from "../../src/kin";
import type { Kin } from "../../src/kin/types";
import { allIds } from "../../src/mechanisms";
import { metaOf } from "../../tools/meta";

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
