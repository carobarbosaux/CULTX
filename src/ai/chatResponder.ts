/**
 * chatResponder.ts — Deterministic mock chat AI response function.
 *
 * Pure synchronous function: same (userMessage.length + messageCount) % pool.length
 * always yields the same response index. No external calls, no async.
 *
 * Profile depth adaptation:
 *  - Academic / Cultural professional → appends "Contexto académico:" paragraph with mock citation
 *  - Student → appends study-oriented follow-up prompt
 *  - General / null → no appendage
 *
 * Callers simulate the async delay with setTimeout before calling this function.
 */

export interface ChatResponseInput {
  userMessage: string;
  articleContext: string | null;
  profileType: string | null;
  /** Number of messages in the conversation so far (before this exchange). */
  messageCount: number;
}

// ────────────────────────────────────────────────────────────────────────────────
// Response pool — 9 pre-written Spanish responses covering key cultural themes
// Index 8 is the article-context-aware fallback.
// ────────────────────────────────────────────────────────────────────────────────

const RESPONSE_POOL: string[] = [
  // 0 — Muralism (Rivera, Orozco, Siqueiros)
  "Mexican muralism is perhaps the most influential artistic movement of the 20th century in Latin America. Diego Rivera, José Clemente Orozco, and David Alfaro Siqueiros transformed public building walls into visual epics of popular identity. Their bet was radical: art should not be in museums but in the streets, accessible to everyone.",

  // 1 — Architecture (UNAM, Barragán, Legorreta)
  "20th-century Mexican architecture achieved something rare: creating its own language between modernity and tradition. Luis Barragán introduced silence and color as building materials. His use of earth-toned, fuchsia, and intense yellow walls is inseparable from the light of the Mexican highlands. The UNAM campus, declared a World Heritage Site, takes that dialogue even further, with murals integrated into the structure itself.",

  // 2 — Pre-Hispanic cultures (Maya, Aztec, Zapotec)
  "Mexico's pre-Hispanic cultures were not monolithic but an archipelago of civilizations. The Maya developed a calendar system of astonishing astronomical precision; the Zapotecs at Monte Albán created one of the continent's first urban centers; the Mexica built Tenochtitlan on a lake — one of the largest cities in the world in the 15th century. Each left layers of meaning that still structure contemporary Mexican culture.",

  // 3 — Mexican cinema (Buñuel, Cuarón, del Toro)
  "Mexico has one of the richest cinematic traditions in the Spanish-speaking world. Luis Buñuel chose Mexico as his second home and shot some of his surrealist masterpieces there. Decades later, Alfonso Cuarón, Guillermo del Toro, and Iñárritu reinvented global auteur cinema from a deeply Mexican sensibility — proving that the local and the universal are not opposites.",

  // 4 — Music and regional traditions (son jarocho, norteño, cumbia)
  "Mexican popular music is a mosaic of regions and eras. Son jarocho from the Gulf coast, with its collective footwork on the fandango platform, is as much ritual as celebration. Norteño music from the border north tells stories of migration and resistance with accordion and bajo sexto. Cumbia arrived from Colombia and was reinvented in working-class neighborhoods until it became entirely Mexican. Each genre is a sonic archive of collective experiences.",

  // 5 — Contemporary Mexican art
  "Contemporary Mexican art is experiencing a moment of ferment. Artists like Gabriel Orozco and Damián Ortega have spent decades engaging with major international circuits without abandoning a critical eye on everyday Mexican life. At the same time, a new generation of indigenous women artists and community collectives is reshaping who has the right to produce and define 'national culture'.",

  // 6 — Mexican literature (Paz, Fuentes, Poniatowska, Rulfo)
  "20th-century Mexican literature gave the world voices that are now global references. Octavio Paz explored national identity with almost archaeological lucidity in 'The Labyrinth of Solitude'. Juan Rulfo achieved something unrepeatable: condensing the epic of the Revolution into two slim books that remain inexhaustible. Elena Poniatowska turned journalism into literature by giving voice to the silenced. Carlos Fuentes connected Mexico with Europe and Latin America in an unprecedented intellectual conversation.",

  // 7 — Folk art and crafts
  "Mexican folk art is one of the country's most vibrant and threatened heritages. From Oaxacan alebrijes to Talavera ceramics from Puebla, from Zapotec textiles to Guerrero masks, each piece condenses generations of technical and cosmological knowledge. The risk is twofold: industrialization that cheapens and empties meaning, and appropriation that removes pieces from their context without giving back to their communities.",

  // 8 — Contextual fallback (uses articleContext)
  "", // Overwritten dynamically in getChatResponse when articleContext is set
];

// ────────────────────────────────────────────────────────────────────────────────
// Academic context appendage
// ────────────────────────────────────────────────────────────────────────────────

const ACADEMIC_APPENDAGES: string[] = [
  "\n\nAcademic context: This phenomenon has been studied by García Canclini within the framework of Latin American hybrid cultures (1989). His analysis suggests that peripheral modernity in Mexico generates unique cultural forms that cannot be reduced to Eurocentric categories.",
  "\n\nAcademic context: Bonfil Batalla in 'México profundo' (1987) argues that Mesoamerican civilization did not disappear with the Conquest but survives as an active cultural substrate, in permanent tension with the Western modernization project.",
  "\n\nAcademic context: Roger Bartra in 'The Cage of Melancholy' (1987) deconstructs the myths of Mexican national character, showing how the 'archetypal Mexican' is in reality an ideological construction of post-revolutionary elites.",
  "\n\nAcademic context: Monsiváis exhaustively documented how 20th-century Mexican urban popular culture constituted a space of resistance and identity negotiation against the hegemony of the post-revolutionary state ('Rituals of Chaos', 1995).",
];

// ────────────────────────────────────────────────────────────────────────────────
// getChatResponse — Main export
// ────────────────────────────────────────────────────────────────────────────────

/**
 * Returns a deterministic chat AI response string.
 *
 * Selection index: (userMessage.length + messageCount) % RESPONSE_POOL.length
 * This ensures variety across a conversation (messageCount grows) while remaining
 * fully deterministic (same inputs always produce the same output).
 */
export function getChatResponse(input: ChatResponseInput): string {
  const { userMessage, articleContext, profileType, messageCount } = input;

  // Determine response pool index deterministically
  const poolSize = RESPONSE_POOL.length;
  const index = (userMessage.length + messageCount) % poolSize;

  let response: string;

  if (index === 8 || (articleContext && index >= poolSize - 1)) {
    // Contextual fallback — reference the article title directly
    if (articleContext) {
      response = `On «${articleContext}»: this topic reflects one of the richest tensions in contemporary Mexican culture — the negotiation between local identity and global narrative. There are historical, aesthetic, and political layers worth unpacking. Would you like to explore a specific angle?`;
    } else {
      // Fallback when there is no article context and index happens to be 8
      response = RESPONSE_POOL[0];
    }
  } else {
    response = RESPONSE_POOL[index];
  }

  // ── Profile depth adaptation ────────────────────────────────────────────────

  const isAcademic =
    profileType === "Academic" || profileType === "Cultural professional";
  const isStudent = profileType === "Student";

  if (isAcademic) {
    // Select academic appendage deterministically
    const appendageIndex = (userMessage.length + messageCount) % ACADEMIC_APPENDAGES.length;
    response += ACADEMIC_APPENDAGES[appendageIndex];
  } else if (isStudent) {
    response +=
      "\n\nWould you like me to go deeper on any aspect for your research?";
  }

  return response;
}
