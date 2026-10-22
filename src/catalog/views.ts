// Generated human views of the catalogue: one CSV row per mechanism, and a Markdown master document.
import { VOCABULARIES, type CatalogRecord, type Link } from "./schema";

const join = (a: readonly unknown[] | undefined) => (a ?? []).join("; ");
const quote = (s: unknown) => `"${String(s ?? "").replace(/"/g, '""')}"`;

const CSV_COLUMNS: [string, (r: CatalogRecord) => unknown][] = [
  ["id", (r) => r.id],
  ["name", (r) => r.name],
  ["family", (r) => r.family],
  ["level", (r) => r.level],
  ["input", (r) => r.motion.input],
  ["output", (r) => r.motion.output],
  ["output_character", (r) => join(r.motion.output_character)],
  ["axes", (r) => r.motion.axes],
  ["plane", (r) => r.motion.plane],
  ["ratio_kind", (r) => r.ratio.kind],
  ["ratio_class", (r) => r.ratio.class],
  ["ratio_typical", (r) => r.ratio.typical],
  ["dof", (r) => r.dof],
  ["links", (r) => r.topology?.links],
  ["backdrivable", (r) => r.backdrivable],
  ["function", (r) => join(r.tags.function)],
  ["property", (r) => join(r.tags.property)],
  ["application", (r) => join(r.tags.application)],
  ["keywords", (r) => join(r.tags.keywords)],
  ["summary", (r) => r.summary],
  ["origin", (r) => r.origin?.date],
  ["origin_precision", (r) => r.origin?.precision],
  ["first_reference", (r) => r.references[0]?.url],
  ["first_video", (r) => r.media.find((m) => m.kind === "video")?.url],
  ["real_world", (r) => (r.real_world ?? []).map((x) => `${x.product}: ${x.url}`).join(" | ")],
];

export function toCsv(records: CatalogRecord[]): string {
  const head = CSV_COLUMNS.map(([name]) => name).join(",");
  const rows = records.map((r) => CSV_COLUMNS.map(([, get]) => quote(get(r))).join(","));
  return [head, ...rows].join("\n") + "\n";
}

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9 -]/g, "").trim().replace(/\s+/g, "-");
const anchor = (r: CatalogRecord) => `[${r.name}](#${slug(r.name)})`;
const link = (x: Link<string>) => `[${x.title}](${x.url}) (${x.kind})`;

type Facet = [heading: string, field: string, about: string, values: readonly string[], get: (r: CatalogRecord) => string[]];

const FACETS: Facet[] = [
  ["Family", "family", "What kind of mechanism it is.", VOCABULARIES.family, (r) => [r.family]],
  [
    "Level",
    "level",
    "How hard it is to understand. Basic: one idea, few parts. Intermediate: a ratio, a special geometry or a second " +
      "idea. Advanced: many links, spatial, or subtle math.",
    VOCABULARIES.level,
    (r) => [r.level],
  ],
  [
    "Output character",
    "motion.output_character",
    "How the output moves over a cycle (several allowed).",
    VOCABULARIES.character,
    (r) => r.motion.output_character,
  ],
  [
    "Axis relation",
    "motion.axes",
    "How the output axis sits relative to the input. Rotary-to-in-plane: linear output in the plane of rotation " +
      "(slider-crank). Rotary-to-along-axis: linear output along the shaft (lead screw).",
    VOCABULARIES.axes,
    (r) => [r.motion.axes],
  ],
  [
    "Plane",
    "motion.plane",
    "Planar mechanisms draw cleanly in the side view; spatial ones need the tilted view.",
    VOCABULARIES.plane,
    (r) => [r.motion.plane],
  ],
  ["Ratio kind", "ratio.kind", "What the mechanism does to speed, force or size.", VOCABULARIES.ratioKind, (r) => [r.ratio.kind]],
  [
    "Ratio class",
    "ratio.class",
    "How big the ratio is. The typical range is in ratio.typical.",
    VOCABULARIES.ratioClass,
    (r) => [r.ratio.class],
  ],
  ["Function", "tags.function", "The job it does.", VOCABULARIES.function, (r) => r.tags.function],
  ["Property", "tags.property", "Qualities a designer filters on.", VOCABULARIES.property, (r) => r.tags.property],
  ["Application", "tags.application", "Industries and products where it is used.", VOCABULARIES.application, (r) => r.tags.application],
];

function counts(records: CatalogRecord[], get: (r: CatalogRecord) => string[]) {
  const m = new Map<string, number>();
  for (const r of records) for (const v of get(r)) m.set(v, (m.get(v) ?? 0) + 1);
  return m;
}

function entry(r: CatalogRecord, byId: Map<string, CatalogRecord>): string[] {
  const L: string[] = [`### ${r.name}`, ""];
  if (r.aka?.length) L.push(`*Also called: ${r.aka.join(", ")}*`, "");
  const t = r.topology;
  L.push(
    r.summary,
    "",
    "| | |",
    "|---|---|",
    `| id | \`${r.id}\` |`,
    `| Family · Level | ${r.family} · ${r.level} |`,
    `| Motion | ${r.motion.label} (${r.motion.output_character.join(", ")}) |`,
    `| Axes · Plane | ${r.motion.axes} · ${r.motion.plane} |`,
    `| Ratio | ${r.ratio.kind}, ${r.ratio.class}: ${r.ratio.typical} |`,
    `| DOF · Topology | ${r.dof} · ${t ? `${t.links} links, ${t.revolute} R, ${t.prismatic} P, ${t.higher_pairs} higher` : "?"}${t?.notes ? ` (${t.notes})` : ""} |`,
    `| Backdrivable | ${r.backdrivable} |`,
    `| Function | ${r.tags.function.join(", ")} |`,
    `| Property | ${r.tags.property.join(", ")} |`,
    `| Application | ${r.tags.application.join(", ")} |`,
    `| Keywords | ${(r.tags.keywords ?? []).join(", ")} |`,
    `| Origin | ${r.origin ? `${r.origin.date} (${r.origin.precision}): ${r.origin.note}` : "?"} |`,
    "",
  );
  const e = r.explain;
  L.push(`**How it moves.** ${e.motion}`, "", `**Forces.** ${e.forces}`, "", `**Why use it.** ${e.benefits}`, "", `**Limits.** ${e.limits}`, "");

  if (r.real_world?.length || r.examples?.length) {
    L.push("**In the real world**", "");
    for (const x of r.real_world ?? [])
      L.push(`- **[${x.product}](${x.url})**${x.maker ? ` (${x.maker})` : ""}: ${x.use} (video)${x.note ? ` *(${x.note})*` : ""}`);
    const named = (r.real_world ?? []).map((x) => x.product.toLowerCase()).join(" ");
    for (const x of r.examples ?? []) if (!named.includes(x.use.toLowerCase())) L.push(`- ${x.use}: ${x.detail}`);
    L.push("");
  }

  const b = r.build;
  L.push("**Build spec**", "", `- Ground: ${b.ground}`, `- Input: ${b.input}`, `- Output: ${b.output}`);
  if (b.members?.length) L.push(`- Members: ${b.members.map((m) => `\`${m.id}\` (${m.role}) ${m.def}`).join("; ")}`);
  if (b.joints?.length) L.push(`- Joints: ${b.joints.map((j) => `${j.id} ${j.type} (${(j.between ?? []).join("–")})`).join("; ")}`);
  if (b.params?.length)
    L.push(
      `- Default parameters: ${b.params
        .map((p) => `${p.name} = ${p.value}${p.unit && p.unit !== "-" ? " " + p.unit : ""}${p.note ? ` (${p.note})` : ""}`)
        .join("; ")}`,
    );
  if (b.defining_relations) L.push(`- Defining relations: ${b.defining_relations}`);
  if (b.range) L.push(`- Range: ${b.range}`);
  L.push(`- Overlays: ${(b.overlays ?? []).join(", ")}${b.plot ? `; plot: ${b.plot}` : ""}`);
  if (b.notes) L.push(`- Animator notes: ${b.notes}`);
  L.push("");

  if (r.references.length) L.push(`**References**: ${r.references.map(link).join(" · ")}`, "");
  const real = r.media.filter((x) => x.kind === "photos" || x.kind === "video");
  const demos = r.media.filter((x) => !(x.kind === "photos" || x.kind === "video"));
  if (real.length) L.push(`**Photos and video**: ${real.map(link).join(" · ")}`, "");
  if (demos.length) L.push(`**Animations and demos**: ${demos.map(link).join(" · ")}`, "");
  const related = r.related.map((id) => byId.get(id)).filter((x) => x !== undefined);
  if (related.length) L.push(`**Related**: ${related.map(anchor).join(", ")}`, "");
  L.push("---", "");
  return L;
}

/** The Markdown master document. Records are expected in catalogue order (family, level, name). */
export function toMarkdown(records: CatalogRecord[]): string {
  const byId = new Map(records.map((r) => [r.id, r]));
  const families = VOCABULARIES.family.filter((f) => records.some((r) => r.family === f));
  const L: string[] = [
    "# Mechanism catalogue",
    "",
    `${records.length} mechanisms, each with tags, an explanation, the geometry needed to build it, real-world uses, ` +
      "references and photo and video links. Generated from `data/catalog/mechanisms.json` by `npm run catalog`; " +
      "edit the sources in `data/catalog/sources/`, not this file.",
    "",
    "## Contents",
    "",
    "1. [Tagging system](#tagging-system)",
    "2. [Index by family](#index-by-family)",
    "3. [Find by motion](#find-by-motion)",
    "4. [Mechanisms](#mechanisms)",
    "",
    "## Tagging system",
    "",
    "Every mechanism carries facets (one value each) and tag groups (several values each), all from fixed " +
      "vocabularies so filters never split on spelling. The vocabularies are in `data/catalog/record-spec.md`.",
    "",
  ];

  const ins = counts(records, (r) => [r.motion.input]);
  const outs = counts(records, (r) => [r.motion.output]);
  L.push(
    "### Input motion / Output motion",
    "",
    "Fields `motion.input`, `motion.output`. Linear: a slider moving to and fro or one way. Straight line: a linkage " +
      "point drawing a straight line with no slide. Path: a point tracing a curve that is the product. Helical: " +
      "screw motion. The label is \"Input → Output\".",
    "",
    VOCABULARIES.motion.map((v) => `\`${v}\` (in ${ins.get(v) ?? 0}, out ${outs.get(v) ?? 0})`).join(" · "),
    "",
  );
  for (const [heading, field, about, values, get] of FACETS) {
    const c = counts(records, get);
    L.push(`### ${heading}`, "", `Field \`${field}\`. ${about}`, "", values.map((v) => `\`${v}\` (${c.get(v) ?? 0})`).join(" · "), "");
  }

  L.push("## Index by family", "");
  for (const f of families) {
    const rs = records.filter((r) => r.family === f);
    L.push(`### ${f} (${rs.length})`, "", "| Mechanism | Level | Motion | Ratio |", "|---|---|---|---|");
    for (const r of rs)
      L.push(`| ${anchor(r)} | ${r.level} | ${r.motion.label} | ${r.ratio.class === "n/a" ? r.ratio.kind : r.ratio.class} |`);
    L.push("");
  }

  const inputs = VOCABULARIES.motion.filter((m) => ins.has(m));
  const outputs = VOCABULARIES.motion.filter((m) => outs.has(m));
  L.push("## Find by motion", "", "Rows are input motion, columns output motion.", "");
  L.push(`| Input \\ Output | ${outputs.join(" | ")} |`, `|---|${outputs.map(() => "---").join("|")}|`);
  for (const i of inputs) {
    const cells = outputs.map((o) =>
      records
        .filter((r) => r.motion.input === i && r.motion.output === o)
        .map(anchor)
        .join(", "),
    );
    L.push(`| **${i}** | ${cells.join(" | ")} |`);
  }
  L.push("", "## Mechanisms", "");
  for (const r of records) L.push(...entry(r, byId));
  return L.join("\n");
}
