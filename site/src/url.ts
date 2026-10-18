/// <reference types="astro/client" />
// Site-absolute URLs under the deploy base (SITE_BASE, "/" locally, "/mechanism-database/" on GitHub Pages).
// Every link and asset path the pages and islands write goes through here.
const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

/** `path` starts with "/": `url("/thumbs/x.webp")` → "/mechanism-database/thumbs/x.webp" on Pages. */
export const url = (path: string) => BASE + path;
