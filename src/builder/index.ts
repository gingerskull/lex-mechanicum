// The hardware builder of engine v3 (standard 5.1): joint kits, the axial stack builder with its support selector, the
// support router and the placement solver, built on the kinematic library (src/kin) and the 3D solids (src/solids).
export { buildAssembly, buildWithContext, type Assembly } from "./build";
export { createCtx, type BuildCtx, type BuildOpts, type JointNote, type RecordLike, type RouteLog } from "./ctx";
export { applyPolish, polishApi, type Polish, type PolishApi } from "./polish";
export { autoTable, rules, runRules } from "./registry";
export { solvePlacement, type Placement } from "./placer";
export { axialStack, selectSupport, type StackResult, type StackSpec, type SupportKind } from "./stack";
export { routeBridge, clearance } from "./router";
export { KIT_IDS, type KitId } from "./sites";
