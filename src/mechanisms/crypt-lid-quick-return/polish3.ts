// Nosferatu crypt-lid quick-return on engine v3: the exceptions to the builder (standard 5.2, R7).
// - M10: the themed scenery of a seasonal mechanism (P14) is made as a carved wooden toy, not as machine parts: the
//   coffin, its turned legs and the lid in walnut, the linings and the mattress in quilted satin, the figurine in
//   carved and painted lime wood, the lid's bump stop in neoprene. The rules' defaults name steel and aluminium.
// - E2, E9: the carved pieces are glued to the part they decorate, so each prop comes off as one: the coffin with its
//   walls, panels, linings and mattress (its legs and their screws stay the rules'), the lid with its panel, bat, lining,
//   cheek and arm, and the figurine with its pieces. Each piece would otherwise explode as a part of its own.
import type { Polish } from "../../builder";

export const polish: Polish = (A) => {
  const mat = (f: RegExp, m: string) => A.find(f).forEach((s) => A.set(s.id, { mat: m }));
  mat(/^coffin(-(wall|rim|column|panel|handle)\d*(-\d|-bar)?\d*)?$/, "Walnut, carved and oiled");
  mat(/^coffin-post\d$/, "Walnut, turned and oiled");
  mat(/^coffin-(lining\d|mattress)$/, "Satin over horsehair, quilted");
  mat(/^coffin-(thigh|shoe)[LR]$/, "Lime wood, carved and painted");
  mat(/^coffin-bump$/, "Neoprene 60 Shore A");
  mat(/^lever-lid(-panel|-bat)?$/, "Walnut, carved and oiled");
  mat(/^lever-lid-lining$/, "Satin over horsehair, quilted");
  mat(/^occupant-(cape|collar|body|head|arm|fore|hand|medallion)/, "Lime wood, carved and painted");
  const group = (f: RegExp, g: string) => A.find(f).forEach((s) => A.set(s.id, { group: g }));
  group(/^coffin(-(?!post).*)?$/, "coffin-prop");
  group(/^lever-lid/, "lid-prop");
  group(/^occupant-(cape|collar|body|head|arm|fore|hand|medallion)/, "figure-prop");
};
