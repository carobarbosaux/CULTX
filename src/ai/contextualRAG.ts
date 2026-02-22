/**
 * contextualRAG.ts — Deterministic mock contextual AI response function.
 *
 * Pure function: same selectedText length => same response index => same output.
 * No external calls, no async, no real AI libraries.
 *
 * depthLabel is "Academic" for Academic or Cultural professional profile types;
 * otherwise "General". Academic variant appends a simulated reference citation.
 */

export interface ContextualResponse {
  explanation: string;
  depthLabel: "General" | "Academic";
  relatedLinks: Array<{ title: string; id: string }>;
}

// Pre-written cultural responses about Mexican art/history/culture (5 variants).
// Selected deterministically by: selectedText.length % 5
const CULTURAL_EXPLANATIONS: string[] = [
  "Mexican muralism emerged as a response to the Revolution of 1910, seeking to create a public art accessible to all citizens. Artists like Diego Rivera and José Clemente Orozco transformed the walls of public buildings into epic narratives of national identity.",

  "Pre-Hispanic architecture in Mexico reflects a profound astronomical understanding. Temples were aligned to capture the equinoxes, turning each building into an instrument for measuring sacred time.",

  "Street theater in Mexico has roots in colonial 'pastorelas' and indigenous ritual dances. This hybrid tradition remains alive in community festivals where the sacred and the festive intertwine.",

  "Talavera ceramics from Puebla have been a UNESCO Intangible Cultural Heritage since 2019. The double-fired enamel technique was brought by Spanish artisans in the 16th century and fused with local traditions.",

  "Son jarocho is much more than music: it is a system of social gathering called 'fandango'. The wooden platforms where dancers stomp are not a stage but a communal space where everyone participates.",
];

// Simulated academic reference appended for Academic / Cultural professional profiles.
const ACADEMIC_REFERENCE =
  "\n\nReferences: [Simulated source] Florescano, E. (2006). *Images of the Homeland*. Mexico: Taurus.";

// Static related article links referenced in the data layer.
const RELATED_LINKS: Array<{ title: string; id: string }> = [
  { title: "Muralism and national identity", id: "articulo-muralismo-rivera" },
  { title: "Talavera: living heritage of Puebla", id: "articulo-talavera-puebla" },
];

/**
 * Returns a deterministic contextual AI response for the selected article text.
 *
 * @param selectedText - The text the user highlighted in the article.
 * @param profileType  - The user's profile type string from UserProfile, or null.
 */
export function getContextualResponse(
  selectedText: string,
  profileType: string | null
): ContextualResponse {
  // Determine depth label based on profile type.
  const isAcademic =
    profileType === "Academic" || profileType === "Cultural professional";
  const depthLabel: "General" | "Academic" = isAcademic ? "Academic" : "General";

  // Pick explanation deterministically from selectedText.length.
  const index = selectedText.length % 5;
  const baseExplanation = CULTURAL_EXPLANATIONS[index];

  // Append academic reference if applicable.
  const explanation = isAcademic
    ? baseExplanation + ACADEMIC_REFERENCE
    : baseExplanation;

  return {
    explanation,
    depthLabel,
    relatedLinks: RELATED_LINKS,
  };
}
