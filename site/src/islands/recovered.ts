// Shows the Recovered badge (LM-17) on what was added in the last days: every `[data-recovered]` element is built hidden
// and shown here when its sheet's `added` date is recent at the time of viewing. Without scripting it stays hidden.
import { isRecovered } from "../recovered";

const now = new Date();
for (const el of document.querySelectorAll<HTMLElement>("[data-recovered]")) if (isRecovered(el.dataset.recovered, now)) el.hidden = false;
