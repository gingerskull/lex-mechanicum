// The Forge sheet's lore (SS14): the words that open the sealed search state, and the hint phrases that point at the cog,
// one picked at random wherever a hint shows (the sealed search, the 404 page).

/** The whole query must be one of these, after `normal`: Mechanicus terms, places, people, and the forge-world release names. */
export const LORE_WORDS: readonly string[] = [
  // the Cult Mechanicus
  "omnissiah", "machine god", "deus mechanicus", "machine spirit", "motive force", "mechanicus", "adeptus mechanicus",
  "cult mechanicus", "lex mechanicum", "the flesh is weak", "praise the omnissiah", "quest for knowledge",
  // places and things
  "mars", "red planet", "forge world", "forge", "noosphere", "binharic", "cogitator", "archeotech",
  "dark age of technology", "standard template construct", "stc", "sacred unguent", "rite of activation",
  "litany of ignition",
  // people
  "tech priest", "techpriest", "enginseer", "magos", "fabricator general", "skitarii", "servitor", "mechadendrite",
  // the release codenames, every one a forge world (data/release-names.json)
  "graia", "lucius", "metalica", "ryza", "stygies", "triplex phall", "agripinaa", "gryphonne", "voss",
];

/** Lowercase, anything that is not a letter or a digit as one space, trimmed: "Tech-Priest " reads "tech priest". */
export const normal = (q: string): string => q.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

const WORDS = new Set(LORE_WORDS.map(normal));

/** Whether a search is a lore word. */
export const isLore = (q: string): boolean => WORDS.has(normal(q));

/** What the hints say, in the archive's voice: hold the cog. */
export const HINTS: readonly string[] = [
  "The flesh is weak, the hand is patient. Lay it on the cog and wait.",
  "From the moment I understood the weakness of my click, it disgusted me. I learned to hold.",
  "Knowledge is power; patience is its key. The cog answers a steady hand.",
  "There is no truth in a quick tap. The machine spirit stirs for those who hold.",
  "Sixteen laws, one cog. Hold it until the motive force rises.",
  "The forge sleeps behind the sheet. A hand on the cog, a breath, and it wakes.",
  "Praise the cog. Turn it not. Hold it.",
];

/** One hint, picked by `r` in 0..1 (Math.random by default). */
export const pickHint = (r: number = Math.random()): string => HINTS[Math.min(HINTS.length - 1, Math.floor(r * HINTS.length))]!;
