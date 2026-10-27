// A contact's joint kit and the rule that builds it at every joint of its kind (A21): the kit builds its canonical
// hardware in the contact's own frame from the declared joint, the rule notes and badges what it built. With the helpers
// the kits share: a body's part or the ground, the base's top under a contact, the track roller's bearing.
import { BEARINGS } from "../../../hardware/tables";
import type { BuildCtx, JointNote } from "../../ctx";
import { type Contact, contactOf, localAt } from "../../contact";
import { Local, titleOf } from "../../lib";
import type { JointInfo, KitId } from "../../sites";
import type { Rule } from "../types";

export interface KitBuild {
  (ctx: BuildCtx, c: Contact, L: Local): { serves?: Record<string, string[]>; note: string; badge?: [string, "ok" | "warn"] } | void;
}

interface KitDef {
  id: string;
  ids: string[];
  fixture: string;
  kits: KitId[];
  build: KitBuild;
  /** Joints of the kit another rule builds. */
  skip?: (ji: JointInfo, ctx: BuildCtx) => boolean;
}

export const bodyOf = (ctx: BuildCtx, id: string): string => (ctx.parts.has(id) ? id : "ground");
export const partId = (ctx: BuildCtx, id: string): string | undefined => ctx.parts.get(id)?.id;

/** Local z of the top of the base under a contact, or null when the base is not under the stack axis. */
export const baseZ = (ctx: BuildCtx, c: Contact): number => (ctx.base ? ctx.base.top - c.frame.o[2] : -4);

export function contactRule(def: KitDef): Rule {
  return {
    id: def.id,
    tier: "AUTO",
    ids: def.ids,
    fixture: def.fixture,
    applies: (ctx) => ctx.joints.some((j) => def.kits.includes(j.kit) && !def.skip?.(j, ctx)),
    apply(ctx) {
      for (const ji of ctx.joints.filter((j) => def.kits.includes(j.kit) && !def.skip?.(j, ctx))) {
        const c = contactOf(ctx, ji);
        if (!c) {
          ctx.issues.push(`joint ${ji.id}: no body of it is stacked, kit ${ji.kit} not built`);
          continue;
        }
        const L = localAt(ctx, c);
        const r = def.build(ctx, c, L);
        const solids = L.out();
        if (solids.length) ctx.add(solids);
        const note: JointNote = {
          id: ji.id,
          kit: ji.kit,
          at: ji.at,
          title: `${ji.kit} · ${titleOf(ji.id)}`,
          note: r?.note ?? `${titleOf(ji.id)}: ${ji.kit} built from the declared joint.`,
          serves: r?.serves ?? {},
          // the kit built the joint's hardware: its badge says so unless the kit gave its own
          badge: r?.badge ?? (solids.length ? [`${ji.kit} built`, "ok"] : [`${ji.kit}: nothing built`, "warn"]),
        };
        ctx.note(note);
        (ctx.fired[def.id] ??= []).push(ji.id);
      }
    },
  };
}

export const ROLLER = BEARINGS.find((b) => b.name === "625")!;
