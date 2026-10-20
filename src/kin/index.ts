// Kinematic block library and K1 verifier (standard 3.0, section 3).
//
// A record's `kin` block is composed here from closed-form blocks. `new Kinematics(kin).pose(u, controls)` solves every
// body for the cycle phase u; `verifyK1(kin)` checks every declared joint in 3D over the cycle. The block functions in
// ./blocks are pure and usable on their own.
export { Kinematics, BranchTable } from "./compose";
export { verifyK1, K1_TOL, type K1Report, type K1Options } from "./verify";
export { evalExpr } from "./expr";
export { timeMap, type TimeMapSpec } from "./timemap";
export { KinError, type BlockCtx } from "./ctx";
export { BLOCKS } from "./registry";
export { jointResidual, stepResidual, resolveJoint, type ResolvedJoint } from "./residual";
export { solveNumeric } from "./numeric";
export * from "./types";
export * from "./math";
export * from "./blocks/linkage";
export * from "./blocks/spatial";
export * from "./blocks/gears";
export * from "./blocks/cam";
export * from "./blocks/members";
export * from "./blocks/timed";
