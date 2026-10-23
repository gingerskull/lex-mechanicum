// One child of the pool (tools/pool.ts): runs the tasks it is sent, one at a time, and answers each with its result.
interface Task {
  i: number;
  url: string;
  fn: string;
  arg: unknown;
}

// a pool that stops (its tool failed or was stopped) takes its children with it
process.on("disconnect", () => process.exit(0));

process.on("message", async (t: Task) => {
  const rss = () => process.memoryUsage().rss;
  try {
    const f = (await import(t.url))[t.fn] as (x: unknown) => Promise<unknown>;
    const value = await f(t.arg);
    process.send!({ i: t.i, ok: true, value, rss: rss() });
  } catch (e) {
    process.send!({ i: t.i, ok: false, error: e instanceof Error ? (e.stack ?? e.message) : String(e), rss: rss() });
  }
});
