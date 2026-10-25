// IndexNow's key file (/<key>.txt under the base, holding the key): it proves the URLs a deploy submits are ours
// (.github/workflows/pages.yml).
import type { APIRoute } from "astro";
import { INDEXNOW_KEY } from "../seo";

export const getStaticPaths = () => [{ params: { indexnow: INDEXNOW_KEY } }];
export const GET: APIRoute = () => new Response(INDEXNOW_KEY, { headers: { "content-type": "text/plain" } });
