// What the site tells search engines and link previews: the verification and analytics codes (one value each; empty
// renders nothing), the IndexNow key, absolute URLs and the structured data (schema.org JSON-LD) of the library and
// the mechanism pages.
import { APP } from "./data";

/** Search Console's HTML-tag verification: the meta tag's content value. */
export const GOOGLE_SITE_VERIFICATION = "quVYIJA7luAEI_yssbCObuVQDQC1H-6W0sVWjaShIBk";
/** GoatCounter's site code (<code>.goatcounter.com): cookie-free page counts, production builds only. */
export const GOATCOUNTER = "lexmechanicum";
/** IndexNow's key, public by design: served as /<key>.txt under the base and sent with each deploy's URLs. */
export const INDEXNOW_KEY = "3e4be7d8cc3f34d5a647fe350b7edf8d";

/** The licence of the content: the catalogue, the documents and the drawings. */
export const CONTENT_LICENSE = "https://creativecommons.org/licenses/by-sa/4.0/";

/** The absolute URL of a site-absolute path that already carries the base (url() or Astro.url.pathname). */
export const absolute = (path: string, site: URL | undefined) => new URL(path, site).href;

/** Lex Mechanicum as an organisation: the author and publisher of every page. */
const org = (home: string) => ({ "@type": "Organization", name: APP, url: home, logo: `${home}apple-touch-icon.png` });

/** The library's structured data: the site and who makes it. */
export function siteLd(home: string, description: string) {
  return [
    { "@context": "https://schema.org", "@type": "WebSite", name: APP, alternateName: "Mechanism Library", url: home, description, inLanguage: "en", publisher: org(home) },
    { "@context": "https://schema.org", ...org(home) },
  ];
}

/** A mechanism page's structured data: a free interactive learning resource. */
export function mechanismLd(o: { name: string; description: string; url: string; image: string; level: string; home: string; keywords: string[] }) {
  return {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: o.name,
    description: o.description,
    url: o.url,
    image: o.image,
    inLanguage: "en",
    isAccessibleForFree: true,
    educationalLevel: o.level,
    learningResourceType: "Interactive simulation",
    keywords: o.keywords.join(", "),
    license: CONTENT_LICENSE,
    author: org(o.home),
    publisher: org(o.home),
    isPartOf: { "@type": "WebSite", name: APP, url: o.home },
  };
}

/** JSON for a <script type="application/ld+json">: "<" escaped so no text in it can close the script. */
export const ldJson = (data: unknown) => JSON.stringify(data).replace(/</g, "\\u003c");
