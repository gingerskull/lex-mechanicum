import { writeFileSync } from "node:fs";
import { generateAudit3 } from "../src/audit/generate3";
const t = performance.now();
const text = await generateAudit3(process.argv[2]!, { existing: null, date: "2026-10-21", profile: "ci" });
writeFileSync(process.argv[3]!, text);
console.log("ms", performance.now() - t);
