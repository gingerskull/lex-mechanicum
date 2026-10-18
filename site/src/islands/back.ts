// "All mechanisms" on a mechanism page works as a way back to the library as the visitor left it: Back in the browser's
// history when they came straight from it (the browser keeps the scroll and the page), otherwise the library with its
// last filters and search, scrolled to where they were.
import { isLibrary, markReturn, readLibrary } from "../library";

const link = document.getElementById("back") as HTMLAnchorElement | null;
const lib = readLibrary();
// a new tab or a copied link gets the filtered library too
if (link && lib) link.href = lib.href;
link?.addEventListener("click", (e) => {
  if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  if (document.referrer && isLibrary(document.referrer) && history.length > 1) {
    e.preventDefault();
    history.back();
    return;
  }
  if (lib) markReturn();
});
