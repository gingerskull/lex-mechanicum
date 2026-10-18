// Whether the browser draws with WebGL2, asked before the engine loads: without it the stage shows a still and the cards
// keep their images. The test context is let go at once; the engine makes the page's one context when it draws.
let known: boolean | null = null;

export function hasWebGL2(): boolean {
  if (known !== null) return known;
  try {
    const gl = document.createElement("canvas").getContext("webgl2");
    known = !!gl;
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
  } catch {
    known = false;
  }
  return known;
}
