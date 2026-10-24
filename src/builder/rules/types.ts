// The builder's rule contract (standard 5.1): one module per rule, run in registry order on the shared context, each with
// a fixture the registry test builds and checks it fired on.
import type { BuildCtx } from "../ctx";

export interface Rule {
  id: string;
  tier: "AUTO";
  /** The standard requirement ids this rule serves. */
  ids: string[];
  /** The catalogue record whose build exercises this rule; the registry test checks the rule fires on it. */
  fixture: string;
  applies(ctx: BuildCtx): boolean;
  apply(ctx: BuildCtx): void;
  /** Runs after every rule has run (the base outline needs everything on the base). */
  after?(ctx: BuildCtx): void;
  /** Runs once the build is complete: after the polish, with the bodies' own parts joined (the explode needs them all). */
  last?(ctx: BuildCtx): void;
}
