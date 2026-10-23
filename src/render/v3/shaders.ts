// The GLSL of the 3D drafting renderer (style Part IV). Three programs, one frame:
//
//   peel       The faces toward the viewer drawn K times; pass k keeps the nearest surface behind layer k-1 (depth peeling),
//              so each pixel gets its K nearest surfaces in order: premultiplied colour (paper at its opacity, role tint
//              and pattern registered to the part, stepped wall shade), and a meta texel (occlusion, opacity, solid id).
//   composite  The layers front to back into one premultiplied image; with a section on, the cut faces get their outline.
//   line       Every edge as an analytic quad. At each pixel the layers nearer than the edge say how covered it is: nothing
//              in front, a bold line; covered, a thin dashed line seen through the papers in front, plus the bold line at
//              what the occluders let through (SD3).
//
// Depth order comes from the depth buffer alone: no depth bias, no draw order (SD1, T17). Style numbers are baked into
// the source from DRAFT, so a change to the style files shows on the next page load or `STYLE` redraw.
import { DRAFT } from "../../style/draft";

const L = DRAFT.lines;
const WS = DRAFT.fill.wallShade;
const fl = (x: number) => (Number.isInteger(x) ? `${x}.0` : String(x));

/** The pattern layers sampled per role, and texels per solid in the solid table (src/render/v3/scene.ts ST). */
export const TEXELS = 8;
/** Texels per row of the solid table. */
export const TABLE_W = 1024;

const COMMON = /* glsl */ `#version 300 es
precision highp float;
precision highp int;
precision highp sampler2D;
uniform sampler2D uSolids;
uniform vec2 uSize;
uniform vec3 uRight, uUp, uEye;
uniform float uS, uOx, uOy, uD0, uD1;
// a section plane: what has dot(n, p) + d > 0 is cut away (n = 0: none)
uniform vec4 uClip;
bool cutAway(vec3 w) { return dot(uClip.xyz, uClip.xyz) > 0.0 && dot(uClip.xyz, w) + uClip.w > 0.0; }
vec4 solidT(int i, int k) { int t = i * ${TEXELS} + k; return texelFetch(uSolids, ivec2(t % ${TABLE_W}, t / ${TABLE_W}), 0); }
vec3 toWorld(int i, vec3 p) {
  vec4 r0 = solidT(i, 0), r1 = solidT(i, 1), r2 = solidT(i, 2);
  return vec3(dot(r0.xyz, p) + r0.w, dot(r1.xyz, p) + r1.w, dot(r2.xyz, p) + r2.w);
}
vec3 dirWorld(int i, vec3 n) {
  vec4 r0 = solidT(i, 0), r1 = solidT(i, 1), r2 = solidT(i, 2);
  return vec3(dot(r0.xyz, n), dot(r1.xyz, n), dot(r2.xyz, n));
}
// screen px (y down) and depth toward the viewer, mm
vec3 screen(vec3 w) { return vec3(uOx + uS * dot(w, uRight), uOy - uS * dot(w, uUp), dot(w, uEye)); }
vec4 clipOf(vec3 p) { return vec4(p.x / uSize.x * 2.0 - 1.0, 1.0 - p.y / uSize.y * 2.0, 1.0 - 2.0 * (p.z - uD0) / (uD1 - uD0), 1.0); }
// the outward screen normal of a world normal (y down), for the wall shade buckets
vec2 screenN(vec3 n) {
  vec2 q = vec2(dot(n, uRight), -dot(n, uUp));
  float l = length(q);
  return l > 1e-6 ? q / l : vec2(0.0);
}
`;

export const PEEL_VERT = COMMON + /* glsl */ `
in vec3 aPos;
in vec3 aNrm;
in vec2 aMeta;
out vec2 vLocal;
out vec3 vN;
out vec3 vW;
flat out int vSolid;
flat out int vTag;
void main() {
  int i = int(aMeta.x + 0.5);
  if (solidT(i, 6).y > 0.5) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); vSolid = 0; vTag = 0; vLocal = vec2(0.0); vN = vec3(0.0, 0.0, 1.0); vW = vec3(0.0); return; }
  vSolid = i;
  vTag = int(aMeta.y + 0.5);
  vLocal = aPos.xy;
  float kx = solidT(i, 6).z;
  vN = normalize(dirWorld(i, vec3(aNrm.x / (kx * kx), aNrm.y, aNrm.z)));
  vW = toWorld(i, aPos);
  gl_Position = clipOf(screen(vW));
}
`;

export const PEEL_FRAG = COMMON + /* glsl */ `
precision highp sampler2DArray;
uniform sampler2D uPrev;
uniform int uLayer;
uniform sampler2DArray uPat;
uniform vec3 uInk, uPaper;
uniform float uSteps, uShade, uPatGain, uMinStep, uPatOff, uHatch, uHatchW, uCapA, uHatchA;
in vec2 vLocal;
in vec3 vN;
in vec3 vW;
flat in int vSolid;
flat in int vTag;
layout(location = 0) out vec4 oC;
layout(location = 1) out vec4 oM;
float bucket(vec2 n) {
  return clamp(floor(((dot(n, vec2(${fl(WS.light[0])}, ${fl(WS.light[1])})) + 1.0) * (uSteps - 1.0)) / 2.0 + 0.5), 0.0, uSteps - 1.0);
}
void main() {
  vec3 n = normalize(vN);
  float f = dot(n, uEye);
  bool section = dot(uClip.xyz, uClip.xyz) > 0.0;
  if (section && cutAway(vW)) discard;
  // with a section, back faces are kept: one seen with no front face of its solid before it is the cut face (the
  // composite and line passes decide that from the layer order)
  bool back = f <= 1e-4;
  if (back && !section) discard;
  if (uLayer > 0 && gl_FragCoord.z <= texelFetch(uPrev, ivec2(gl_FragCoord.xy), 0).r + 1e-7) discard;
  if (back) {
    // the cut face: paper, and 45-degree section hatching on the sheet (SD19)
    float h = mod(gl_FragCoord.x + gl_FragCoord.y, uHatch) < uHatchW ? uHatchA : 0.0;
    vec3 col = uPaper * uCapA;
    float al = uCapA;
    col = uInk * h + col * (1.0 - h);
    al = h + al * (1.0 - h);
    oC = vec4(col, al);
    oM = vec4(1.0, al, float(vSolid & 255) / 255.0, float((vSolid >> 8) | 128) / 255.0);
    return;
  }
  vec4 a = solidT(vSolid, 3); // face, wall, occ, wallOcc
  vec4 b = solidT(vSolid, 4); // tint, pattern alpha, pattern layer, pattern step mm
  vec4 c = solidT(vSolid, 5); // faint factor, base, plate, see-through
  float fa = c.x;
  vec3 col;
  float al;
  float occ;
  if (vTag == 0) {
    col = uPaper * a.x * fa;
    al = a.x * fa;
    float tn = b.x * fa;
    col = uInk * tn + col * (1.0 - tn);
    al = tn + al * (1.0 - tn);
    if (b.y > 0.0 && f >= uPatOff) {
      float p = b.y * uPatGain * fa * texture(uPat, vec3(vLocal / max(uMinStep, b.w), b.z)).a;
      col = uInk * p + col * (1.0 - p);
      al = p + al * (1.0 - p);
    }
    occ = a.z;
  } else {
    float i = bucket(screenN(n));
    bool hole = vTag == 2;
    float from = hole ? ${fl(WS.hole.from)} : ${fl(WS.outer.from)};
    float span = hole ? ${fl(WS.hole.span)} : ${fl(WS.outer.span)};
    float s = uShade * (from + span * i / max(1.0, uSteps - 1.0)) * fa;
    float wa = hole ? 0.0 : a.y * fa;
    col = uInk * s + uPaper * wa * (1.0 - s);
    al = s + wa * (1.0 - s);
    occ = hole ? 0.0 : a.w;
  }
  oC = vec4(col, al);
  oM = vec4(occ, al, float(vSolid & 255) / 255.0, float(vSolid >> 8) / 255.0);
}
`;

export const QUAD_VERT = /* glsl */ `#version 300 es
void main() {
  vec2 p = vec2(gl_VertexID == 1 ? 3.0 : -1.0, gl_VertexID == 2 ? 3.0 : -1.0);
  gl_Position = vec4(p, 0.0, 1.0);
}
`;

// The composite. A layer is a cut face when its meta says back face; it counts only where no front face of its solid came
// before it, and only the first cut face of a pixel counts: a cut face never shows through another cut part (SD19).
export const COMP_FRAG = /* glsl */ `#version 300 es
precision highp float;
uniform sampler2D uC0, uC1, uC2, uC3, uN0, uN1, uN2, uN3;
uniform int uK;
uniform vec3 uInk;
uniform float uOutline, uOutlineA, uSection;
out vec4 o;
vec4 colorAt(int k, ivec2 q) {
  if (k == 0) return texelFetch(uC0, q, 0);
  if (k == 1) return texelFetch(uC1, q, 0);
  if (k == 2) return texelFetch(uC2, q, 0);
  return texelFetch(uC3, q, 0);
}
vec4 metaAt(int k, ivec2 q) {
  if (k == 0) return texelFetch(uN0, q, 0);
  if (k == 1) return texelFetch(uN1, q, 0);
  if (k == 2) return texelFetch(uN2, q, 0);
  return texelFetch(uN3, q, 0);
}
// the solid whose cut face is the first one at this pixel, or -1 (only meaningful with a section on)
int cutSolid(ivec2 q) {
  int seen[4];
  for (int k = 0; k < 4; k++) {
    if (k >= uK) break;
    vec4 m = metaAt(k, q);
    if (m.y <= 0.0 && m.z <= 0.0 && m.w <= 0.0) { seen[k] = -2; continue; }
    int hi = int(m.w * 255.0 + 0.5);
    int sid = int(m.z * 255.0 + 0.5) + 256 * (hi & 127);
    seen[k] = sid;
    if (hi >= 128) {
      bool inside = false;
      for (int j = 0; j < 4; j++) if (j < k && seen[j] == sid) inside = true;
      if (!inside) return sid;
    }
  }
  return -1;
}
void main() {
  ivec2 q = ivec2(gl_FragCoord.xy);
  vec4 acc = vec4(0.0);
  int seen[4];
  bool cutDone = false;
  for (int k = 0; k < 4; k++) {
    if (k >= uK) break;
    vec4 m = metaAt(k, q);
    int hi = int(m.w * 255.0 + 0.5);
    int sid = int(m.z * 255.0 + 0.5) + 256 * (hi & 127);
    seen[k] = sid;
    if (hi >= 128) {
      bool inside = false;
      for (int j = 0; j < 4; j++) if (j < k && seen[j] == sid) inside = true;
      if (inside || cutDone) continue;
      cutDone = true;
    }
    acc += (1.0 - acc.a) * colorAt(k, q);
  }
  if (uSection > 0.5) {
    int here = cutSolid(q);
    if (here >= 0) {
      int r = int(uOutline);
      bool edge = false;
      for (int d = 0; d < 4; d++) {
        ivec2 o2 = d == 0 ? ivec2(r, 0) : d == 1 ? ivec2(-r, 0) : d == 2 ? ivec2(0, r) : ivec2(0, -r);
        if (cutSolid(q + o2) != here) edge = true;
      }
      if (edge) acc = vec4(uInk * uOutlineA, uOutlineA) + acc * (1.0 - uOutlineA);
    }
  }
  o = acc;
}
`;

const markKinds = 16;

export const LINE_VERT = COMMON + /* glsl */ `
uniform float uDpr;
uniform int uMarkMask;
uniform vec2 uMark[${markKinds}]; // width px, alpha per mark kind
uniform vec2 uBaseGain;           // marks and chamfer alpha factors on the base plate
in vec4 aA;  // a.xyz, cumA
in vec4 aB;  // b.xyz, cumB
in vec4 aN1; // n1.xyz, kind
in vec4 aN2; // n2.xyz, flags
in vec2 aSol; // solid, mark kind
out vec2 vCap;
out float vDist;
out vec3 vWl;
flat out vec2 vSeg;
flat out vec4 vStyle; // bold width px, bold alpha, hidden width px, hidden alpha
flat out int vSolidL;
flat out int vRing;
void main() {
  int i = int(aSol.x + 0.5);
  int mark = int(aSol.y + 0.5);
  vSolidL = i;
  int kind = int(aN1.w + 0.5);
  vRing = kind == 4 ? 1 : 0;
  vec4 c = solidT(i, 5); // faint, base, plate, see
  vec4 w = solidT(i, 6); // top width, hidden, kx
  float fa = c.x;
  bool base = c.y > 0.5, plate = c.z > 0.5;
  vec3 N1 = normalize(dirWorld(i, vec3(aN1.x / (w.z * w.z), aN1.y, aN1.z)));
  vec3 N2 = normalize(dirWorld(i, vec3(aN2.x / (w.z * w.z), aN2.y, aN2.z)));
  float f1 = dot(N1, uEye);
  float f2 = dot(N2, uEye);
  float bw = 0.0, ba = 0.0, hw = 0.0, ha = 0.0;
  if (w.y > 0.5) { ba = 0.0; }
  else if (kind == 4) {
    bw = ${fl(L.accentRing.width)}; ba = ${fl(L.accentRing.alpha)}; hw = bw; ha = ${fl(L.accentRing.hiddenAlpha)};
  } else if (kind == 0) {
    // a cap's outline: the cap toward the viewer is the top face; the far cap's outline is a plate's bottom outline
    if (f1 > 1e-4) { bw = w.x; ba = 1.0; hw = bw * ${fl(L.hidden.width)}; ha = ${fl(L.hidden.alpha)}; }
    else if (plate) { bw = ${fl(L.plateBottom)}; ba = ${fl(L.bottomAlpha)}; hw = bw * ${fl(L.hidden.width)}; ha = ba * ${fl(L.hidden.alpha)}; }
    else if (f2 > 1e-4) { bw = ${fl(L.edge)}; ba = ${fl(L.edgeAlpha)}; }
  } else if (kind == 1) {
    if (f1 > 1e-4 || f2 > 1e-4) { bw = ${fl(L.silhouette)}; ba = ${fl(L.silhouetteAlpha)}; }
  } else if (kind == 2) {
    if ((f1 > 1e-4) != (f2 > 1e-4)) { bw = ${fl(L.silhouette)}; ba = ${fl(L.silhouetteAlpha)}; }
  } else if (kind == 3) {
    if (f1 > 1e-4 && ((uMarkMask >> mark) & 1) == 1) { bw = uMark[mark].x; ba = uMark[mark].y * (base ? (mark == 1 ? uBaseGain.y : uBaseGain.x) : 1.0); }
  }
  vStyle = vec4(bw * uDpr, ba * fa, hw * uDpr, ha * fa);
  if (ba <= 0.0) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); vCap = vec2(0.0); vDist = 0.0; vWl = vec3(0.0); vSeg = vec2(0.0); return; }
  vec3 A = screen(toWorld(i, aA.xyz)) * vec3(uDpr, uDpr, 1.0);
  vec3 B = screen(toWorld(i, aB.xyz)) * vec3(uDpr, uDpr, 1.0);
  vec2 e = B.xy - A.xy;
  float Lp = length(e);
  vec2 dir = Lp > 1e-6 ? e / Lp : vec2(1.0, 0.0);
  vec2 nr = vec2(-dir.y, dir.x);
  float h = max(bw * uDpr, 1.0) * 0.5 + 1.0;
  int v = gl_VertexID;
  bool end = v == 1 || v == 2 || v == 4;
  float side = (v == 2 || v == 4 || v == 5) ? 1.0 : -1.0;
  vec2 p = (end ? B.xy + dir * h : A.xy - dir * h) + nr * side * h;
  vCap = vec2(end ? Lp + h : -h, side * h);
  vSeg = vec2(Lp, h);
  // dashes run on the ring's length, scaled to this segment's length on screen
  float L3 = max(1e-6, aB.w - aA.w);
  float k = Lp / L3;
  vDist = aA.w * k / uDpr + vCap.x / uDpr;
  vWl = toWorld(i, end ? aB.xyz : aA.xyz);
  gl_Position = clipOf(vec3(p / uDpr, end ? B.z : A.z));
}
`;

export const LINE_FRAG = /* glsl */ `#version 300 es
precision highp float;
precision highp sampler2D;
uniform sampler2D uD0t, uD1t, uD2t, uD3t, uM0, uM1, uM2, uM3;
uniform int uK;
uniform vec3 uInk, uAccent;
uniform float uDash0, uDash1, uEps, uEpsOwn, uHidden;
uniform float uRing; // the input ring's strength, 0..1
uniform vec4 uClip;
in vec2 vCap;
in float vDist;
in vec3 vWl;
flat in vec2 vSeg;
flat in vec4 vStyle;
flat in int vSolidL;
flat in int vRing;
out vec4 o;
void main() {
  // distance from the segment (round caps), for analytic antialiasing
  float dx = vCap.x < 0.0 ? -vCap.x : vCap.x > vSeg.x ? vCap.x - vSeg.x : 0.0;
  float r = length(vec2(dx, vCap.y));
  ivec2 q = ivec2(gl_FragCoord.xy);
  float z = gl_FragCoord.z;
  if (dot(uClip.xyz, uClip.xyz) > 0.0 && dot(uClip.xyz, vWl) + uClip.w > 0.0) discard;
  float D[4];
  vec4 M[4];
  D[0] = texelFetch(uD0t, q, 0).r; D[1] = texelFetch(uD1t, q, 0).r; D[2] = texelFetch(uD2t, q, 0).r; D[3] = texelFetch(uD3t, q, 0).r;
  M[0] = texelFetch(uM0, q, 0); M[1] = texelFetch(uM1, q, 0); M[2] = texelFetch(uM2, q, 0); M[3] = texelFetch(uM3, q, 0);
  float tOcc = 1.0, tFill = 1.0;
  bool covered = false;
  int sids[4];
  bool cutDone = false;
  for (int k = 0; k < 4; k++) {
    if (k >= uK || D[k] >= 1.0) break;
    int hi = int(M[k].w * 255.0 + 0.5);
    int sid = int(M[k].z * 255.0 + 0.5) + 256 * (hi & 127);
    sids[k] = sid;
    if (hi >= 128) {
      // a back face: the cut face of its solid only where no front face of it came before, and only the first of the pixel
      bool inside = false;
      for (int j = 0; j < 4; j++) if (j < k && sids[j] == sid) inside = true;
      if (inside || cutDone) continue;
      cutDone = true;
    }
    float eps = sid == vSolidL ? uEpsOwn : uEps;
    if (D[k] >= z - eps) break;
    covered = true;
    tOcc *= 1.0 - M[k].x;
    tFill *= 1.0 - M[k].y;
  }
  float bw = vStyle.x * 0.5;
  float aBold = vStyle.y * clamp(bw + 0.5 - r, 0.0, 1.0) * (bw < 0.5 ? bw * 2.0 : 1.0);
  vec3 ink = vRing == 1 ? uAccent : uInk;
  vec4 c = vec4(0.0);
  if (covered && uHidden > 0.5 && vStyle.w > 0.0) {
    float hw = vStyle.z * 0.5;
    float on = vRing == 1 ? 1.0 : (mod(vDist, uDash0 + uDash1) <= uDash0 ? 1.0 : 0.0);
    float aH = vStyle.w * (vRing == 1 ? 1.0 : tFill) * on * clamp(hw + 0.5 - r, 0.0, 1.0) * (hw < 0.5 ? hw * 2.0 : 1.0);
    c = vec4(ink * aH, aH);
  }
  float b = aBold * (covered ? tOcc : 1.0);
  c = vec4(ink * b, b) + c * (1.0 - b);
  if (vRing == 1) c *= uRing;
  if (c.a <= 0.0) discard;
  o = c;
}
`;
