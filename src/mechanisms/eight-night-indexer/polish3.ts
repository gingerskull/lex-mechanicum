// Maccabee eight-night indexer on engine v3: the exceptions to the builder (standard 5.2, R7).
// - J5, T12: the carriage slides on a way and a keeper lip on the see-through back plate, held into mesh by the pinion,
//   and the shamash's slider on the menorah's own rail under the bar (both named in the record's `teaching.exceptions`).
//   The slide rule stands its rails on risers from the base, which for these would stand in front of the works and the
//   menorah; their rails, risers, way, keeper, gib, wipers and nipple are not built.
// - M10: the seasonal scenery (P14) is made as a menorah and its stand, not as machine parts: the menorah, the shamash's
//   slider and the fretwork crest in brass, the candles in wax, the flames gilt, the plinth in walnut, the dreidels in
//   boxwood, the gelt struck in gilt brass and the shamash's tape in spring steel. The rules name steel and aluminium.
import type { Polish } from "../../builder";

export const polish: Polish = (A) => {
  A.drop(/^S[cs]-/);
  const mat = (f: RegExp, m: string) => A.find(f).forEach((s) => A.set(s.id, { mat: m }));
  mat(/^(menorah(-(?!candle|wick|cheek|tape|pin).*)?|slider(-(?!sh(Candle|Band|Flame)).*)?|backplate-screen)$/, "Brass, cast, chased and polished");
  mat(/^(menorah-candle|slider-sh(Candle|Band))/, "Beeswax, ivory, fluted");
  mat(/^(f\d(-.*)?|slider-shFlame.*)$/, "Brass, gilt and engraved");
  mat(/^menorah-tape/, "Spring steel tape 2.5 x 0.3, hardened");
  mat(/^plinth(-(?!dreidel|gelt|pin).*)?$/, "Walnut, carved and oiled");
  mat(/^plinth-dreidel/, "Boxwood, turned and carved");
  mat(/^plinth-gelt/, "Brass, gilt, struck");
  const notes: [string, string, string, Record<string, string[]>][] = [
    ["Sc", "the carriage's rack rides on the back plate's way, a keeper lip before it, and the pinion holds its teeth down into mesh; it lifts out over the lip for the yearly return.", "held into mesh by the pinion", { F1: ["backplate-way", "backplate-lip"], F7: ["backplate-lip"] }],
    ["Ss", "the shamash's slider rides the rail under the bar's front, its lip under the rail and its tongue over it into the bar's channel, clamped to the tape.", "guided on the menorah's rail", { F1: ["menorah-rail"], F7: ["slider", "slider-tongue"] }],
  ];
  for (const [id, note, badge, serves] of notes) A.note({ id, kit: "J5", at: A.ctx.S.joints.get(id)!.at, title: `J5 · ${id}`, note: `${id}: ${note}`, badge: [badge, "ok"], serves });
};
