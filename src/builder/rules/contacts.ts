// The joint kits for contacts (A21): pin in a slot (J4), slide (J5), gear mesh (J6), cam (J7), belt and flexible member
// (J8, J12), crossed mesh (J9), screw (J11), compliant joint (J13), and the kinds the audits found missing: pallet
// contact, fork and pin, pawl and tooth, pin and lobe, tongue in slot, ring on hub, ring on rollers, strap on sheave,
// groove cam. Each builds its canonical hardware in the contact's own frame from the declared joint.
// Each kind's kits are in a file of their own under ./contacts (the kit form in ./contacts/kit); a kind adds its rules
// here with one line, in its place in the order. J11 is src/builder/screws.ts, J13 src/builder/compliant.ts.
import type { Rule } from "./types";
import { ECCENTRIC_KITS } from "./contacts/eccentric";
import { DIE_KITS } from "./contacts/die";
import { HUB_KITS } from "./contacts/hub";
import { MESH_KITS } from "./contacts/mesh";
import { SLOT_KITS } from "./contacts/slot";
import { SLIDE_KITS } from "./contacts/slide";
import { CAM_KITS } from "./contacts/cam";
import { ESCAPEMENT_KITS } from "./contacts/escapement";
import { PAWL_KITS } from "./contacts/pawl";
import { TONGUE_KITS } from "./contacts/tongue";
import { RING_KITS } from "./contacts/ring";
import { FLEXIBLE_KITS } from "./contacts/flexible";
import { WOBBLE_KITS } from "./contacts/wobble";

export const contactRules: Rule[] = [
  ...ECCENTRIC_KITS,
  ...DIE_KITS,
  ...HUB_KITS,
  ...MESH_KITS,
  ...SLOT_KITS,
  ...SLIDE_KITS,
  ...CAM_KITS,
  ...ESCAPEMENT_KITS,
  ...PAWL_KITS,
  ...TONGUE_KITS,
  ...RING_KITS,
  ...FLEXIBLE_KITS,
  ...WOBBLE_KITS,
];
