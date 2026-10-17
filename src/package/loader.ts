// Loading a package: from a URL in the browser, from a file in Node (tools, tests, screenshots).
import { decode, type Package } from "./format";

/** Fetches and decodes an `.mxp` package. */
export async function loadPackage(url: string | URL): Promise<Package> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`package ${String(url)}: HTTP ${res.status}`);
  return await decode(new Uint8Array(await res.arrayBuffer()));
}

/** Reads and decodes an `.mxp` package from disk (Node). */
export async function readPackage(path: string): Promise<Package> {
  // a computed specifier keeps browser bundlers from resolving the Node module
  const fs = "node:fs/promises";
  const { readFile } = (await import(/* @vite-ignore */ fs)) as typeof import("node:fs/promises");
  return await decode(new Uint8Array(await readFile(path)));
}
