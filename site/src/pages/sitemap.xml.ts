// The sitemap: the library and every mechanism page, as absolute URLs under the base. The 404 page is left out.
import type { APIRoute } from "astro";
import { SHEETS } from "../data";
import { absolute } from "../seo";
import { url } from "../url";

export const GET: APIRoute = ({ site }) => {
  const pages = [url("/"), ...SHEETS.map((s) => url(`/mechanisms/${s.id}/`))];
  const body = pages.map((p) => `  <url><loc>${absolute(p, site)}</loc></url>`).join("\n");
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`, {
    headers: { "content-type": "application/xml" },
  });
};
