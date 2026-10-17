import type { CatalogRecord } from "../../src/catalog/schema";

/** A minimal record that passes validation; tests change one thing at a time. */
export function record(id: string, over: Partial<CatalogRecord> = {}): CatalogRecord {
  return {
    id,
    name: id,
    family: "Linkage",
    level: "Basic",
    summary: "s",
    motion: { input: "Rotary", output: "Oscillating", label: "", output_character: ["Reciprocating"], axes: "Parallel", plane: "Planar" },
    ratio: { kind: "None", class: "n/a", typical: "" },
    dof: 1,
    backdrivable: "Yes",
    tags: { function: ["Motion conversion"], property: ["Grashof"], application: ["Education"] },
    explain: { motion: "", forces: "", benefits: "", limits: "" },
    build: { ground: "", input: "", output: "", members: [], joints: [], params: [] },
    references: [
      { title: "r1", url: "https://example.org/r1", kind: "wikipedia" },
      { title: "r2", url: "https://example.org/r2", kind: "textbook" },
    ],
    media: [{ title: "v", url: "https://example.org/v", kind: "video" }],
    real_world: [
      { product: "p1", use: "u", url: "https://example.org/p1", kind: "product" },
      { product: "p2", use: "u", url: "https://example.org/p2", kind: "product" },
    ],
    related: [],
    ...over,
  };
}
