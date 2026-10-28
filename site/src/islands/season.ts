// A mechanism page's seasonal parts (P14), decided by the visitor's local date when the page is viewed: a library page's
// links to the seasonal mechanisms that name it as related show only while each is listed, and the section with them
// only while one does; a seasonal mechanism's own page, out of its listing window, shows the placard with the day it
// comes back in place of the stage and the plot (the stage island does not start then). Without scripting the links stay
// hidden and the stage stays.
import { decodeWindows, listedOn, localDay, longDate, returnsOn } from "../season";

const today = localDay(new Date());

for (const sec of document.querySelectorAll<HTMLElement>("[data-seasonlinks]")) {
  const items = [...sec.querySelectorAll<HTMLElement>("li")];
  for (const li of items) if (li.dataset.season !== undefined) li.hidden = !listedOn(decodeWindows(li.dataset.season), today);
  sec.hidden = items.every((li) => li.hidden);
}

const box = document.querySelector<HTMLElement>(".stagebox[data-season]");
const placard = document.getElementById("placard");
const windows = decodeWindows(box?.dataset.season);
if (box && placard && !listedOn(windows, today)) {
  const back = returnsOn(windows, today);
  const returns = document.getElementById("returns");
  if (returns && back) returns.textContent = ` on ${longDate(back)}`;
  box.hidden = true;
  for (const plot of document.querySelectorAll<HTMLElement>(".panel.plot")) plot.hidden = true;
  placard.hidden = false;
}
