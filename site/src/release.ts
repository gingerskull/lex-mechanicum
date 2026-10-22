// The footer's release line (SS12): the laws the library is drawn under (the sixteen laws of the mechanism
// standard), the release's codename and the version. The release step (tools/release.ts) writes the codenames into
// data/codenames.json by minor version; a release whose minor has no codename, as every one before the first, shows
// the version alone.
import pkg from "../../package.json";
import CODENAMES from "../../data/codenames.json";

/** `drawn under XVI laws · Graia · 0.37.0`, or `drawn under XVI laws · 0.36.0` without a codename. */
export const releaseLine = (version: string, codename?: string): string =>
  ["drawn under XVI laws", codename, version].filter(Boolean).join(" · ");

/** The codename of the minor release `version` belongs to (`0.37.2` → the name of 0.37), if it has one. */
export const codenameOf = (version: string, names: Record<string, string> = CODENAMES): string | undefined =>
  names[version.split(".").slice(0, 2).join(".")];

export const RELEASE_LINE = releaseLine(pkg.version, codenameOf(pkg.version));
