// Simulations the timed blocks run once per spec (an escapement stepped through its cycle, a star wheel snapped by its
// jumper, a verge's crown against its flags): seconds of work on a phone, so the site's build runs them and ships the
// results in the meta file (R9), and the page takes them before its first pose. A result is numbers, arrays of numbers
// and typed arrays. A key rounds its numbers, so a browser whose trigonometry differs in the last place (another engine)
// still finds the entry the build made.

export type SimResult = Record<string, unknown>;

const store = new Map<string, SimResult>();
/** The keys asked for while a record's meta file is made (simTrack). */
let touched: Set<string> | null = null;

/** The key of a simulation: its kind and its inputs, numbers rounded to a millionth. */
export function simKey(kind: string, inputs: unknown): string {
  return `${kind}:${JSON.stringify(inputs, (_k, v: unknown) => (typeof v === "number" ? (Number.isFinite(v) ? Math.round(v * 1e6) / 1e6 : String(v)) : v))}`;
}

/** The result for `key`, made by `make` the first time. */
export function simulated<T extends SimResult>(key: string, make: () => T): T {
  touched?.add(key);
  let r = store.get(key);
  if (!r) {
    r = make();
    store.set(key, r);
  }
  return r as T;
}

/** Empties the store (a test that wants a page's first pose, fresh). */
export function resetSims(): void {
  store.clear();
}

/** Starts noting the keys the blocks ask for; the function it returns stops and gives them. */
export function simTrack(): () => string[] {
  const mine = new Set<string>();
  touched = mine;
  return () => {
    if (touched === mine) touched = null;
    return [...mine];
  };
}

type Packed = { f64: string } | { dq: string; q: number } | unknown;

/** An array this long or longer ships as its steps, rounded to `QUANTUM` (exact to the drawing, and it packs tight). */
const LONG = 2048;
const QUANTUM = 1e-6;

const toB64 = (a: ArrayBufferView): string => {
  const b = new Uint8Array(a.buffer, a.byteOffset, a.byteLength);
  let s = "";
  for (let i = 0; i < b.length; i += 0x8000) s += String.fromCharCode(...b.subarray(i, i + 0x8000));
  return btoa(s);
};
const bytesOf = (s: string): ArrayBuffer => {
  const bin = atob(s);
  const b = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) b[i] = bin.charCodeAt(i);
  return b.buffer;
};
/** A long array as the steps between its values, each value rounded to q (so the rounding never adds up). */
const pack = (a: Float64Array): Packed => {
  if (a.length < LONG) return { f64: toB64(a) };
  const d = new Int32Array(a.length);
  let prev = 0;
  for (let i = 0; i < a.length; i++) {
    const v = Math.round(a[i]! / QUANTUM);
    d[i] = v - prev;
    prev = v;
  }
  return { dq: toB64(d), q: QUANTUM };
};
const unpack = (v: Packed): unknown => {
  if (!v || typeof v !== "object") return v;
  if ("f64" in v) return new Float64Array(bytesOf((v as { f64: string }).f64));
  if ("dq" in v) {
    const { dq, q } = v as { dq: string; q: number };
    const d = new Int32Array(bytesOf(dq));
    const out = new Float64Array(d.length);
    let acc = 0;
    for (let i = 0; i < d.length; i++) {
      acc += d[i]!;
      out[i] = acc * q;
    }
    return out;
  }
  return v;
};

/** The entries of `keys` as plain data for a JSON file: typed arrays as the base64 of their bytes, exact. */
export function exportSims(keys: string[]): Record<string, Record<string, Packed>> {
  const out: Record<string, Record<string, Packed>> = {};
  for (const k of keys) {
    const r = store.get(k);
    if (!r) continue;
    // a result that holds code is not shipped (the page makes it again)
    if (Object.values(r).some((v) => typeof v === "function")) continue;
    const e: Record<string, Packed> = {};
    for (const [f, v] of Object.entries(r)) e[f] = v instanceof Float64Array ? pack(v) : v;
    out[k] = e;
  }
  return out;
}

/** Takes entries `exportSims` made, so the blocks find their results and do not simulate again. */
export function importSims(data: Record<string, Record<string, Packed>> | undefined): void {
  for (const [k, e] of Object.entries(data ?? {})) {
    if (store.has(k)) continue;
    const r: SimResult = {};
    for (const [f, v] of Object.entries(e)) r[f] = unpack(v);
    store.set(k, r);
  }
}
