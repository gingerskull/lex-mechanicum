// A pool of child processes for the per-mechanism work of the tools (conformance, the site assets, clearance, the
// thumbnails' fingerprints): each mechanism's build is independent and single-threaded, and Manifold starts in well under
// 0.1 s in a new process. Child processes, not worker threads, which measured slower. A big build reaches about 2.1 GB, so
// the pool is capped by memory as well as by the cores; MDB_JOBS sets its size (1 runs everything in this process).
import { fork, type ChildProcess } from "node:child_process";
import { availableParallelism, totalmem } from "node:os";
import { fileURLToPath, pathToFileURL } from "node:url";

/** Memory one child may reach, bytes. */
const PER_JOB = 2.2e9;
/** A child past this resident size is replaced after its task: Manifold's heap grows and never shrinks. */
const RECYCLE = 3e9;

/** How many children for n tasks: MDB_JOBS when set, else the cores and as many as most of the memory holds. */
export function poolSize(n: number): number {
  const env = Number(process.env.MDB_JOBS);
  const cap = env > 0 ? env : Math.min(availableParallelism(), Math.floor((totalmem() * 0.8) / PER_JOB));
  return Math.max(1, Math.min(n, cap));
}

interface Reply {
  i: number;
  ok: boolean;
  value?: unknown;
  error?: string;
  rss: number;
}

/**
 * Calls the export `fn` of `module` (a path or file URL) once per item, in child processes, and gives the results in item
 * order; `each` sees every result as soon as it and all before it are in. A failed task fails the pool.
 */
export async function runPool<T, R>(module: string, fn: string, items: T[], o: { jobs?: number; each?: (r: R, i: number) => void } = {}): Promise<R[]> {
  if (!items.length) return [];
  const url = module.startsWith("file:") ? module : pathToFileURL(module).href;
  const jobs = o.jobs ?? poolSize(items.length);
  const out = new Array<R>(items.length);
  const done = new Array<boolean>(items.length).fill(false);
  let flushed = 0;
  const flush = () => {
    while (flushed < items.length && done[flushed]) o.each?.(out[flushed]!, flushed++);
  };
  if (jobs <= 1) {
    const f = (await import(url))[fn] as (x: T) => Promise<R>;
    for (let i = 0; i < items.length; i++) {
      out[i] = await f(items[i]!);
      done[i] = true;
      flush();
    }
    return out;
  }
  const worker = fileURLToPath(new URL("./pool-worker.ts", import.meta.url));
  const live = new Set<ChildProcess>();
  let next = 0;
  try {
    await new Promise<void>((resolve, reject) => {
      let running = 0;
      let failed = false;
      const fail = (e: Error) => {
        if (failed) return;
        failed = true;
        reject(e);
      };
      const start = () => {
        const child = fork(worker, [], { serialization: "advanced", stdio: ["ignore", "inherit", "inherit", "ipc"] });
        live.add(child);
        let task = -1;
        const give = () => {
          if (failed || next >= items.length) {
            live.delete(child);
            child.kill();
            if (--running === 0 && !failed) resolve();
            return;
          }
          task = next++;
          child.send({ i: task, url, fn, arg: items[task] });
        };
        child.on("message", (m: Reply) => {
          if (!m.ok) return fail(new Error(m.error));
          out[m.i] = m.value as R;
          done[m.i] = true;
          task = -1;
          try {
            flush();
          } catch (e) {
            return fail(e as Error);
          }
          if (m.rss > RECYCLE && next < items.length) {
            live.delete(child);
            child.kill();
            start();
          } else give();
        });
        child.on("exit", (code) => {
          if (task >= 0) fail(new Error(`a pool process stopped (${code}) on item ${task}`));
        });
        give();
      };
      running = Math.min(jobs, items.length);
      for (let k = 0; k < running; k++) start();
    });
  } finally {
    for (const c of live) c.kill();
  }
  return out;
}
