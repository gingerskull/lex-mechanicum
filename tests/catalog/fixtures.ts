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
      { product: "p1", use: "u", url: "https://www.youtube.com/watch?v=aaaaaaaaaa1" },
      { product: "p2", use: "u", url: "https://youtu.be/aaaaaaaaaa2" },
    ],
    related: [],
    origin: { date: "1900-01-01", precision: "day", note: "n" },
    ...over,
  };
}

/** A minimal seasonal record (standard P14) that passes validation: a season block, two images, no links. */
export function seasonal(id: string, over: Partial<CatalogRecord> = {}): CatalogRecord {
  return record(id, {
    references: [],
    media: [],
    real_world: [],
    season: {
      occasion: "Halloween",
      date_rule: "fixed, 31 October",
      duty: "Commercial",
      dates: [
        { start: "2026-10-31", end: "2026-10-31" },
        { start: "2027-10-31", end: "2027-10-31" },
      ],
    },
    images: [
      { prompt: "p1", alt: "a1", file: `${id}-1.webp` },
      { prompt: "p2", alt: "a2", file: "" },
    ],
    ...over,
  });
}

/** A record as a seasonal source file writes it: no references, media or real_world keys at all. */
export function withoutLinks(r: CatalogRecord): CatalogRecord {
  const out: Partial<CatalogRecord> = { ...r };
  delete out.references;
  delete out.media;
  delete out.real_world;
  return out as CatalogRecord;
}
