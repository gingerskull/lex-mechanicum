// robots.txt: everything may be crawled, and the sitemap's address. Crawlers read it only at a host's root, so under
// GitHub Pages' /lex-mechanicum/ it is a pointer for people and tools; it takes effect if the site moves to its own domain.
import type { APIRoute } from "astro";
import { absolute } from "../seo";
import { url } from "../url";

export const GET: APIRoute = ({ site }) => new Response(`User-agent: *\nAllow: /\n\nSitemap: ${absolute(url("/sitemap.xml"), site)}\n`, { headers: { "content-type": "text/plain" } });
