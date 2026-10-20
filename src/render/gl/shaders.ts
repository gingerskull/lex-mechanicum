// The shaders of the GPU solids pass. One attribute-less instanced draw per target: instance i finds its chunk (a range
// of items drawn in one mode, the GPU form of one fill or stroke) by binary search in the chunk table, then its item and
// its slice. Each chunk carries an op number written as depth with depth test GREATER, so a fill or stroke covers a
// sample once (as Canvas 2D does) and later ops still paint over earlier ones. Strokes are quads with round caps, so a
// ring's segments meet in round joins; their dashes run on the projected length (plan.ts phases).
import { FACING } from "../slices";

export const MODE = { wall: 1, wallErase: 2, holeWall: 3, face: 4, faceErase: 5, line: 6, silhouette: 7, bottom: 8, screen: 9 } as const;

/** Item and chunk tables: three texels per entry, 341 entries per 1023-texel row. */
export const ROW = 1023;
export const PER_ROW = 341;
/** Slice table: two texels per slice, 512 per row. Hole table: one texel per hole. Dash table: one float per texel. */
export const SROW = 1024;
export const OPS = 1048576;

const f = (x: number) => (Number.isInteger(x) ? `${x}.0` : String(x));

export const VERT = /* glsl */ `#version 300 es
precision highp float;
precision highp int;
precision highp sampler2D;
uniform sampler2D uItems;
uniform sampler2D uChunks;
uniform sampler2D uSlices;
uniform sampler2D uDash;
uniform int uNChunks;
uniform int uLines;
uniform vec2 uSize;
uniform float uS, uCt, uSt, uOx, uOy;
uniform vec3 uInk, uPaper, uAccent;
uniform float uShade, uSteps;
out vec4 vColor;
out vec2 vLocal;
out float vDist;
out vec2 vCap;
flat out vec2 vSeg;
flat out int vMode;
flat out int vHole;
flat out float vDashed;
flat out vec4 vFace;
flat out vec2 vPat;

vec4 itemT(int i, int k) { int t = i * 3 + k; return texelFetch(uItems, ivec2(t % ${ROW}, t / ${ROW}), 0); }
vec4 chunkT(int c, int k) { int t = c * 3 + k; return texelFetch(uChunks, ivec2(t % ${ROW}, t / ${ROW}), 0); }
vec4 sliceT(int s, int k) { int t = s * 2 + k; return texelFetch(uSlices, ivec2(t % ${SROW}, t / ${SROW}), 0); }
float dashT(int i) { return texelFetch(uDash, ivec2(i % ${SROW}, i / ${SROW}), 0).r; }
vec2 proj(vec2 w, float z) { return vec2(uOx + uS * w.x, uOy - uS * (w.y * uCt + z * uSt)); }
// the slice's axis (0 z, 1 x, 2 y; src/core/axis.ts): a point (p, q) of the solid's plane at a along the axis
int axis;
vec2 projA(vec2 w, float a) {
  if (axis == 1) return vec2(uOx + uS * a, uOy - uS * (w.x * uCt + w.y * uSt));
  if (axis == 2) return vec2(uOx + uS * w.x, uOy - uS * (a * uCt + w.y * uSt));
  return proj(w, a);
}

vec4 pose;
vec2 world(vec2 l) { return pose.xy + vec2(pose.z * l.x - pose.w * l.y, pose.w * l.x + pose.z * l.y); }
float depthOf(float op) { return op / ${OPS}.0 * 2.0 - 1.0; }
void out2(vec2 p, float op) { gl_Position = vec4(p.x / uSize.x * 2.0 - 1.0, 1.0 - p.y / uSize.y * 2.0, depthOf(op), 1.0); }
void cull() { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); }

// screen normal of a projected edge and whether its wall faces the viewer (slices.ts wallsOf, FACING)
bool faces(vec2 A, vec2 B, float sg, vec2 d, out vec2 n) {
  vec2 e = B - A;
  float L = length(e);
  if (L == 0.0) L = 1.0;
  n = vec2(sg * e.y, -sg * e.x) / L;
  return dot(n, d) > ${f(FACING.eps)};
}
float bucket(vec2 n) {
  return clamp(floor(((dot(n, vec2(${f(FACING.light[0])}, ${f(FACING.light[1])})) + 1.0) * (uSteps - 1.0)) / 2.0 + 0.5), 0.0, uSteps - 1.0);
}

vec4 lineColour(float alpha, float channel) {
  if (uLines == 1) return channel < 0.5 ? vec4(alpha, 0.0, 0.0, alpha) : vec4(0.0, alpha, 0.0, alpha);
  return vec4((channel < 0.5 ? uInk : uAccent) * alpha, alpha);
}

// a stroke segment as a quad reaching half the width past each end, where the fragment shader rounds it; v is the
// vertex 0..5, phase the dash phase at A in CSS px
void segment(vec2 A, vec2 B, float w, float phase, int v, float op) {
  vec2 e = B - A;
  float L = length(e);
  vec2 dir = L > 1e-6 ? e / L : vec2(1.0, 0.0);
  vec2 nr = vec2(-dir.y, dir.x);
  float h = max(w, 0.0) * 0.5;
  bool end = v == 1 || v == 2 || v == 4;
  float side = (v == 2 || v == 4 || v == 5) ? 1.0 : -1.0;
  vec2 p = (end ? B + dir * h : A - dir * h) + nr * side * h;
  vCap = vec2(end ? L + h : -h, side * h);
  vSeg = vec2(L, h);
  vDist = phase + vCap.x;
  out2(p, op);
}

void main() {
  int id = gl_InstanceID;
  int v = gl_VertexID;
  int lo = 0;
  int hi = uNChunks - 1;
  while (lo < hi) {
    int mid = (lo + hi + 1) >> 1;
    if (int(chunkT(mid, 0).x) <= id) lo = mid; else hi = mid - 1;
  }
  vec4 c0 = chunkT(lo, 0);
  vec4 c1 = chunkT(lo, 1);
  vec4 c2 = chunkT(lo, 2);
  int item = int(c0.y) + id - int(c0.x);
  int sl = int(c0.z);
  int mode = int(c0.w);
  float op = c1.x;
  vMode = mode;
  vHole = -1;
  vDashed = 0.0;
  vDist = 0.0;
  vCap = vec2(0.0);
  vSeg = vec2(0.0);
  vLocal = vec2(0.0);
  vFace = vec4(0.0);
  vPat = vec2(0.0);
  vec4 t0 = itemT(item, 0);
  vec4 t1 = itemT(item, 1);
  vec4 t2 = itemT(item, 2);
  if (mode == ${MODE.screen}) {
    vColor = lineColour(c1.z, c2.x);
    segment(t1.xy, t1.zw, c1.y, 0.0, v, op);
    return;
  }
  pose = sliceT(sl, 0);
  vec4 s1 = sliceT(sl, 1);
  // the far end (z0) and the near end (top) of the slice along its axis; for z and x the top, for y the low y
  float z0 = s1.x;
  float top = s1.y;
  axis = int(s1.w + 0.5);
  float fa = s1.z;
  vec2 d = axis == 1 ? vec2(uS * (z0 - top), 0.0) : axis == 2 ? vec2(0.0, uS * (top - z0) * uCt) : vec2(0.0, uS * (top - z0) * uSt);
  if (mode == ${MODE.wall} || mode == ${MODE.wallErase} || mode == ${MODE.holeWall}) {
    bool hole = t0.y >= 0.0;
    float sg = hole ? t0.x : -t0.x;
    vec2 A = projA(world(t1.xy), top);
    vec2 B = projA(world(t1.zw), top);
    vec2 n;
    if (!faces(A, B, sg, d, n)) { cull(); return; }
    float i = bucket(n);
    if (mode == ${MODE.wallErase}) vColor = vec4(0.0, 0.0, 0.0, c1.y * fa);
    else if (mode == ${MODE.holeWall}) {
      float s = uShade * (c1.w + c2.x * i / max(1.0, uSteps - 1.0)) * fa;
      vColor = vec4(uInk * s, s);
      vHole = int(t0.y);
    } else {
      float wa = c1.y * fa;
      float s = c1.z > 0.5 ? uShade * (c1.w + c2.x * i / max(1.0, uSteps - 1.0)) * fa : 0.0;
      vColor = vec4(uInk * s + uPaper * wa * (1.0 - s), s + wa * (1.0 - s));
    }
    // the quad's points in the top plane, in local mm, for clipping hole walls to their hole
    float D = axis == 2 ? (top - z0) * uCt / max(uSt, 1e-3) : (top - z0) * uSt / max(uCt, 1e-3);
    vec2 lift = D * vec2(pose.w, pose.z);
    vec2 P; vec2 L;
    if (v == 0 || v == 3) { P = A; L = t1.xy; }
    else if (v == 1) { P = B; L = t1.zw; }
    else if (v == 2 || v == 4) { P = B + d; L = t1.zw - lift; }
    else { P = A + d; L = t1.xy - lift; }
    vLocal = L;
    out2(P, op);
    return;
  }
  if (mode == ${MODE.face} || mode == ${MODE.faceErase}) {
    vec2 L = v == 0 ? t1.xy : v == 1 ? t1.zw : t2.xy;
    vLocal = L;
    if (mode == ${MODE.faceErase}) vColor = vec4(0.0, 0.0, 0.0, c1.y * fa);
    else {
      vFace = vec4(c1.y * fa, c1.z * fa, c1.w * fa, c2.x);
      vPat = vec2(c2.y, 0.0);
      vColor = vec4(0.0);
    }
    out2(projA(world(L), top), op);
    return;
  }
  if (mode == ${MODE.line}) {
    // c2.y: 0 for a solid line, else 1 + the first entry of the chunk's dash phases
    float phase = 0.0;
    if (c2.y > 0.5) {
      vDashed = 1.0;
      phase = dashT(int(c2.y) - 1 + id - int(c0.x));
    }
    vColor = lineColour(c1.w * fa, c2.x);
    vec2 off = c2.zw;
    segment(projA(world(t1.xy), c1.y) + off, projA(world(t1.zw), c1.y) + off, c1.z, phase, v, op);
    return;
  }
  if (mode == ${MODE.silhouette}) {
    float sg = -t0.x;
    vec2 Pp = projA(world(t1.xy), top);
    vec2 Pc = projA(world(t1.zw), top);
    vec2 Pn = projA(world(t2.xy), top);
    vec2 n;
    bool a = faces(Pp, Pc, sg, d, n);
    bool b = faces(Pc, Pn, sg, d, n);
    if (a == b) { cull(); return; }
    vColor = lineColour(c1.z * fa, 0.0);
    segment(Pc, Pc + d, c1.y, 0.0, v, op);
    return;
  }
  if (mode == ${MODE.bottom}) {
    float sg = -t0.x;
    vec2 A = projA(world(t1.xy), top);
    vec2 B = projA(world(t1.zw), top);
    vec2 n;
    if (!faces(A, B, sg, d, n)) { cull(); return; }
    vColor = lineColour(c1.z * fa, 0.0);
    segment(A + d, B + d, c1.y, 0.0, v, op);
    return;
  }
  cull();
}
`;

export const FRAG = /* glsl */ `#version 300 es
precision highp float;
precision highp int;
precision highp sampler2D;
precision highp sampler2DArray;
uniform sampler2D uItems;
uniform sampler2D uHoles;
uniform sampler2DArray uPat;
uniform vec3 uInk, uPaper;
uniform float uDash0, uDash1;
in vec4 vColor;
in vec2 vLocal;
in float vDist;
in vec2 vCap;
flat in vec2 vSeg;
flat in int vMode;
flat in int vHole;
flat in float vDashed;
flat in vec4 vFace;
flat in vec2 vPat;
out vec4 o;

vec4 itemT(int i, int k) { int t = i * 3 + k; return texelFetch(uItems, ivec2(t % ${ROW}, t / ${ROW}), 0); }

void main() {
  if (vMode == ${MODE.holeWall}) {
    vec4 h = texelFetch(uHoles, ivec2(vHole % ${SROW}, vHole / ${SROW}), 0);
    int s = int(h.x);
    int n = int(h.y);
    bool inside = false;
    for (int k = 0; k < n; k++) {
      vec4 t = itemT(s + k, 1);
      vec2 a = t.xy;
      vec2 b = t.zw;
      if ((a.y > vLocal.y) != (b.y > vLocal.y) && vLocal.x < (b.x - a.x) * (vLocal.y - a.y) / (b.y - a.y) + a.x) inside = !inside;
    }
    if (!inside) discard;
  }
  if (vMode == ${MODE.face}) {
    // paper, then tint, then the role pattern, each source-over: one premultiplied colour
    vec3 c = uPaper * vFace.x;
    float a = vFace.x;
    c = uInk * vFace.y + c * (1.0 - vFace.y);
    a = vFace.y + a * (1.0 - vFace.y);
    if (vFace.z > 0.0) {
      float p = vFace.z * texture(uPat, vec3(vLocal * vPat.x, vFace.w)).a;
      c = uInk * p + c * (1.0 - p);
      a = p + a * (1.0 - p);
    }
    o = vec4(c, a);
    return;
  }
  if (vMode >= ${MODE.line}) {
    // round caps: past either end, only within half the width of the end point (a hairline keeps its square end)
    float r = max(vSeg.y, 0.35);
    if (vCap.x < 0.0 && length(vCap) > r) discard;
    if (vCap.x > vSeg.x && length(vec2(vCap.x - vSeg.x, vCap.y)) > r) discard;
  }
  if (vDashed > 0.5 && mod(vDist, uDash0 + uDash1) > uDash0) discard;
  o = vColor;
}
`;

export const QUAD_VERT = /* glsl */ `#version 300 es
uniform vec2 uUv;
out vec2 vUv;
void main() {
  vec2 p = vec2(gl_VertexID == 1 ? 3.0 : -1.0, gl_VertexID == 2 ? 3.0 : -1.0);
  vUv = (p * 0.5 + 0.5) * uUv;
  gl_Position = vec4(p, 0.0, 1.0);
}
`;

export const QUAD_FRAG = /* glsl */ `#version 300 es
precision highp float;
uniform sampler2D uTex;
uniform int uLinesLayer;
uniform vec3 uInk, uAccent;
in vec2 vUv;
out vec4 o;
void main() {
  vec4 t = texture(uTex, vUv);
  if (uLinesLayer == 1) o = vec4(uInk * t.r + uAccent * t.g, clamp(t.r + t.g, 0.0, 1.0));
  else o = t;
}
`;
