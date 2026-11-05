// Maccabee eight-night indexer on engine v3: the exceptions to the builder (standard 5.2, R7).
// - J5, T12: the carriage slides on a way and a keeper lip on the see-through back plate, held into mesh by the pinion,
//   as the catalogue entry's build has it (named in the record's `teaching.exceptions`). The slide rule stands its rails on
//   risers from the base, which for a rack in an upright plane puts them in front of the works, through the menorah's
//   stems; its rails, risers, way, keeper, gib, wipers and nipple are not built.
// - M10: the seasonal scenery (P14) is made as a menorah and its stand, not as machine parts: the menorah, the shamash
//   holder and the fretwork crest in brass, the candles in wax, the flames gilt, the plinth in walnut, the dreidels in
//   boxwood and the gelt struck in gilt brass. The rules' defaults name steel and aluminium.
import type { Polish } from "../../builder";

export const polish: Polish = (A) => {
  A.drop(/^Sc-/);
  const mat = (f: RegExp, m: string) => A.find(f).forEach((s) => A.set(s.id, { mat: m }));
  mat(/^(menorah(-(?!candle|wick|cheek).*)?|carriage-(?!sh(Candle|Band|Flame)).*|backplate-screen)$/, "Brass, cast, chased and polished");
  mat(/^(menorah-candle|carriage-sh(Candle|Band))/, "Beeswax, ivory, fluted");
  mat(/^(f\d(-.*)?|carriage-shFlame.*)$/, "Brass, gilt and engraved");
  mat(/^plinth(-(?!dreidel|gelt).*)?$/, "Walnut, carved and oiled");
  mat(/^plinth-dreidel/, "Boxwood, turned and carved");
  mat(/^plinth-gelt/, "Brass, gilt, struck");
  A.note({
    id: "Sc", kit: "J5", at: A.ctx.S.joints.get("Sc")!.at, title: "J5 · Sc",
    note: "Sc: the carriage's rack rides on the back plate's way, a keeper lip before it, and the pinion holds its teeth down into mesh; it lifts out over the lip for the yearly return.",
    serves: { F1: ["backplate-way", "backplate-lip"], F7: ["backplate-lip"] },
  });
};
