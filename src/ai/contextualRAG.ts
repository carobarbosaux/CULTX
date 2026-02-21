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
  "El muralismo mexicano emergió como respuesta a la Revolución de 1910, buscando crear un arte público accesible para todos los ciudadanos. Artistas como Diego Rivera y José Clemente Orozco transformaron paredes de edificios públicos en narrativas épicas de identidad nacional.",

  "La arquitectura prehispánica en México refleja una profunda comprensión astronómica. Los templos estaban alineados para capturar los equinoccios, convirtiendo cada edificio en un instrumento de medición del tiempo sagrado.",

  "El teatro de calle en México tiene raíces en los 'pastorelas' coloniales y las danzas rituales indígenas. Esta tradición híbrida sigue viva en festivales comunitarios donde lo sagrado y lo festivo se entrelazan.",

  "La cerámica de Talavera de Puebla es Patrimonio Cultural Inmaterial de la UNESCO desde 2019. Su técnica de esmalte en dos cocciones fue traída por artesanos españoles en el siglo XVI y fusionada con tradiciones locales.",

  "El son jarocho es mucho más que música: es un sistema de convivencia social llamado 'fandango'. Las tarimas donde se zapatea no son escenario sino espacio comunitario donde todos participan.",
];

// Simulated academic reference appended for Academic / Cultural professional profiles.
const ACADEMIC_REFERENCE =
  "\n\nReferencias: [Fuente simulada] Florescano, E. (2006). *Imágenes de la patria*. México: Taurus.";

// Static related article links referenced in the data layer.
const RELATED_LINKS: Array<{ title: string; id: string }> = [
  { title: "El muralismo y la identidad nacional", id: "articulo-muralismo-rivera" },
  { title: "Talavera: patrimonio vivo de Puebla", id: "articulo-talavera-puebla" },
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
