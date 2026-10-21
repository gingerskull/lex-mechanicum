// Which mechanisms the site draws with the v3 engine while both engines are on the branch (S5, SS13). A mechanism whose
// audit is at standard 3.0 or later is drawn from its record and its package v2. SITE_V3 (a comma list of ids, or "all")
// lets a build put 2.5D mechanisms on the v3 stage too, lifted from their packages: how the stage is tried and tested
// before the pilots are rebuilt. Such a preview stage carries the stamp; the library keeps the committed 2.5D thumbnails.
// Build time only (Node): the pages and the asset step read it, the browser gets the answer as data attributes.
import { engineOf } from "../../src/checks/engine";

const preview = (): Set<string> | "all" => {
  const v = (process.env.SITE_V3 ?? "").trim();
  return v === "all" ? "all" : new Set(v.split(",").map((x) => x.trim()).filter(Boolean));
};

/** True when the stage and the card of `id` use the v3 renderer and carry the 3D stamp. */
export function drawnBy3(id: string): boolean {
  const p = preview();
  return engineOf(id) === "v3" || p === "all" || p.has(id);
}

/** True when the thumbnails of `id` are committed 3D drawings (the mechanism itself is on engine v3). */
export const thumbsFrom3 = (id: string): boolean => engineOf(id) === "v3";
