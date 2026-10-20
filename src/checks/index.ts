// The 3D checks (standard 3.0): A15 in 3D, A12 and M6 on 3D solids, the record's K checks and claim table (T9), SOLID.
export { CLASH_TOL, clearance3, type AllowFinding, type Clash3, type ClashReport, type Placer } from "./clash3";
export { clampCheck3, edgeCheck3 } from "./clamp3";
export { checkClaims, type Claim, type ClaimResult } from "./claims";
export { allIds, auditedStandard, engineOf, isKnown, loadV3, V3_STANDARD, type Engine } from "./engine";
export { checkRecord, formatRecordReport, type RecordFinding, type RecordReport } from "./record";
export { cacheKey, check3d, clashLines, PROFILES, unnecessaryLines, type Profile3, type Result3 } from "./run";
export { legacySource, legacySourceOf, recordSource, type CheckSource } from "./source";
