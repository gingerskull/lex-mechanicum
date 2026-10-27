// Judging an audit sheet's open rows (standard 1, step 6): the rows the generator leaves `?` need a judgement, written
// into the sheet itself. A judgement sets a row's status and adds its note after the generated evidence, so the tiers
// and what the tools found stay in front of it; the generator keeps judged rows when it regenerates the sheet. The
// tool-decided rows (TOOL_DECIDED) are never judged: the generator writes them again on every run.
import { AUTO_FILLED, TOOL_DECIDED } from "./generate3";
import { escapeCell, section, summaryLine, tableRows } from "./sheet";

export const VERDICTS = ["PASS", "FAIL", "N/A"] as const;
export type Verdict = (typeof VERDICTS)[number];

export interface Judgement {
  row: string;
  status: Verdict;
  note: string;
}

/** Why a judgement cannot be written to a sheet, null when it can. */
export function refusal(text: string, j: Judgement): string | null {
  if (!(VERDICTS as readonly string[]).includes(j.status)) return `${j.row}: "${j.status}" is not one of ${VERDICTS.join(", ")}`;
  if (!j.note.trim()) return `${j.row}: a judgement needs a note saying why`;
  if (TOOL_DECIDED.has(j.row)) return `${j.row}: decided by the tools on every run, never judged`;
  if (!tableRows(section(text, "Requirements") ?? "").some((r) => r[0] === j.row)) return `${j.row}: no such row in the sheet`;
  return null;
}

/** The sheet with the judgements written into its Requirements rows and its Summary line counted again. */
export function judgeSheet(text: string, js: Judgement[]): string {
  for (const j of js) {
    const why = refusal(text, j);
    if (why) throw new Error(why);
  }
  const start = text.indexOf("\n## Requirements\n");
  if (start < 0) throw new Error("no Requirements section");
  const end = text.indexOf("\n## ", start + 1);
  const by = new Map(js.map((j) => [j.row, j]));
  const table = text
    .slice(start, end)
    .split("\n")
    .map((line) => {
      const c = tableRows(line)[0];
      const j = c && by.get(c[0]!);
      if (!j) return line;
      // what the generator wrote stays in front: its tiers and evidence, without an earlier fill note
      const generated = (c[2] ?? "").replace(/\\\|/g, "|").split(" · ").filter((p) => !p.startsWith(AUTO_FILLED)).join(" · ");
      return `| ${j.row} | ${j.status} | ${escapeCell([generated, j.note].filter(Boolean).join(" · "))} |`;
    })
    .join("\n");
  const out = text.slice(0, start) + table + text.slice(end);
  return out.replace(/^PASS \d+ · FAIL \d+ · N\/A \d+ · open: .*$/m, summaryLine(tableRows(section(out, "Requirements") ?? "")));
}

/** The rows of a sheet still unjudged: id and evidence. */
export function openRows(text: string): string[][] {
  return tableRows(section(text, "Requirements") ?? "").filter((r) => r[1] === "?");
}
