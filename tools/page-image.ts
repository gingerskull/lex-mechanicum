// Browser-side image helpers shared by the drawing pages of both renderers (tools/draw-page, tools/draw3-page): compare two
// images and lay images out on a sheet. Used through the pages by tools/chrome.ts and tools/chrome3.ts.

/** Pixels of two images (data URLs, same size) whose channels differ by more than `tolerance` of 255. */
export async function differ(a: string, b: string, tolerance: number): Promise<number> {
  const px = async (u: string) => {
    const img = new Image();
    img.src = u;
    await img.decode();
    const c = document.createElement("canvas");
    c.width = img.naturalWidth;
    c.height = img.naturalHeight;
    const x = c.getContext("2d", { willReadFrequently: true })!;
    x.drawImage(img, 0, 0);
    return x.getImageData(0, 0, c.width, c.height).data;
  };
  const [A, B] = await Promise.all([px(a), px(b)]);
  if (A.length !== B.length) return Infinity;
  let n = 0;
  for (let i = 0; i < A.length; i += 4)
    if (Math.max(Math.abs(A[i]! - B[i]!), Math.abs(A[i + 1]! - B[i + 1]!), Math.abs(A[i + 2]! - B[i + 2]!), Math.abs(A[i + 3]! - B[i + 3]!)) > tolerance * 255) n++;
  return n;
}

/** Lays images out on a white sheet: one row per row, labels above, each cell scaled to w x h. Returns a PNG data URL. */
export async function compose(g: { w: number; h: number; pad: number; columns: string[]; rows: { label: string; cells: (string | null)[] }[] }): Promise<string> {
  const c = document.createElement("canvas");
  const n = Math.max(...g.rows.map((r) => r.cells.length), g.columns.length);
  c.width = g.pad + n * (g.w + 6);
  c.height = g.pad + g.rows.length * (g.h + g.pad);
  const x = c.getContext("2d")!;
  x.fillStyle = "white";
  x.fillRect(0, 0, c.width, c.height);
  x.fillStyle = "black";
  x.font = "16px sans-serif";
  g.columns.forEach((t, i) => x.fillText(t, g.pad + i * (g.w + 6) + 4, 20));
  for (const [k, r] of g.rows.entries()) {
    const y = g.pad + k * (g.h + g.pad);
    x.fillStyle = "black";
    x.fillText(r.label, g.pad + 4, y + 18);
    for (const [i, url] of r.cells.entries()) {
      if (!url) continue;
      const img = new Image();
      img.src = url;
      await img.decode();
      x.drawImage(img, g.pad + i * (g.w + 6), y + g.pad - 4, g.w, g.h);
    }
  }
  return c.toDataURL("image/png");
}
