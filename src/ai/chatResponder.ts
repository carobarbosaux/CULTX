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
  // 0 — Muralismo (Rivera, Orozco, Siqueiros)
  "El muralismo mexicano es quizás el movimiento artístico más influyente del siglo XX en América Latina. Diego Rivera, José Clemente Orozco y David Alfaro Siqueiros transformaron paredes de edificios públicos en epopeyas visuales de identidad popular. Su apuesta era radical: el arte no debía estar en los museos sino en las calles, accesible a todos.",

  // 1 — Arquitectura (UNAM, Barragán, Legorreta)
  "La arquitectura mexicana del siglo XX logró algo poco común: crear un lenguaje propio entre la modernidad y la tradición. Luis Barragán introdujo el silencio y el color como materiales de construcción. Su uso de muros en tonos tierra, fucsia y amarillo intenso es inseparable de la luz del altiplano mexicano. El campus de la UNAM, declarado Patrimonio de la Humanidad, lleva ese diálogo aún más lejos, con murales integrados a la estructura misma.",

  // 2 — Culturas prehispánicas (Maya, Aztec, Zapotec)
  "Las culturas prehispánicas de México no fueron monolíticas sino un archipiélago de civilizaciones. Los mayas desarrollaron un sistema calendárico de asombrosa precisión astronómica; los zapotecas en Monte Albán crearon uno de los primeros centros urbanos del continente; los mexicas construyeron Tenochtitlan sobre un lago, una de las ciudades más grandes del mundo en el siglo XV. Cada una dejó capas de significado que aún estructuran la cultura mexicana contemporánea.",

  // 3 — Cine mexicano (Buñuel, Cuarón, del Toro)
  "México tiene una de las tradiciones cinematográficas más ricas del mundo hispanohablante. Luis Buñuel eligió México como segundo hogar y aquí rodó algunas de sus obras maestras del surrealismo. Décadas después, Alfonso Cuarón, Guillermo del Toro e Iñárritu reinventaron el cine de autor global desde una sensibilidad profundamente mexicana — demostrando que lo local y lo universal no son opuestos.",

  // 4 — Música y tradiciones regionales (son jarocho, norteño, cumbia)
  "La música popular mexicana es un mosaico de regiones y tiempos. El son jarocho del Golfo, con su zapateado colectivo en la tarima del fandango, es tanto ritual como fiesta. La música norteña del norte fronterizo cuenta historias de migración y resistencia con acordeón y bajo sexto. La cumbia llegó desde Colombia y se reinventó en los barrios populares hasta volverse completamente mexicana. Cada género es un archivo sonoro de experiencias colectivas.",

  // 5 — Arte contemporáneo mexicano
  "El arte contemporáneo mexicano vive un momento de ebullición. Artistas como Gabriel Orozco y Damián Ortega llevan décadas dialogando con los grandes circuitos internacionales sin abandonar una mirada crítica sobre lo cotidiano mexicano. Al mismo tiempo, una nueva generación de creadoras indígenas y colectivos comunitarios está reconfigurando quién tiene derecho a producir y definir la 'cultura nacional'.",

  // 6 — Literatura mexicana (Paz, Fuentes, Poniatowska, Rulfo)
  "La literatura mexicana del siglo XX dio al mundo voces que son hoy referencias globales. Octavio Paz exploró la identidad nacional con una lucidez casi arqueológica en 'El laberinto de la soledad'. Juan Rulfo logró algo irrepetible: condensar la épica de la Revolución en dos libros delgados que siguen siendo inagotables. Elena Poniatowska convirtió el periodismo en literatura al dar voz a los silenciados. Carlos Fuentes conectó Mexico con Europa y América Latina en una conversación intelectual sin precedente.",

  // 7 — Arte popular y artesanía
  "El arte popular mexicano es uno de los patrimonios más vivos y amenazados del país. Desde los alebrijes oaxaqueños hasta la cerámica Talavera de Puebla, desde los textiles zapotecos hasta las máscaras guerrerenses, cada pieza condensa generaciones de conocimiento técnico y cosmológico. El riesgo es doble: la industrialización que abarata y vacía de sentido, y la apropiación que saca las piezas de su contexto sin retribuir a sus comunidades.",

  // 8 — Contextual fallback (uses articleContext)
  "", // Overwritten dynamically in getChatResponse when articleContext is set
];

// ────────────────────────────────────────────────────────────────────────────────
// Academic context appendage
// ────────────────────────────────────────────────────────────────────────────────

const ACADEMIC_APPENDAGES: string[] = [
  "\n\nContexto académico: Este fenómeno ha sido estudiado por García Canclini en el marco de las culturas híbridas latinoamericanas (1989). Su análisis sugiere que la modernidad periférica en México genera formas culturales únicas que no pueden reducirse a categorías eurocentristas.",
  "\n\nContexto académico: Bonfil Batalla en 'México profundo' (1987) argumenta que la civilización mesoamericana no desapareció con la Conquista sino que sobrevive como sustrato cultural activo, en tensión permanente con el proyecto de modernización occidental.",
  "\n\nContexto académico: Roger Bartra en 'La jaula de la melancolía' (1987) deconstruye los mitos del carácter nacional mexicano, mostrando cómo el 'mexicano arquetípico' es en realidad una construcción ideológica de las élites posrevolucionarias.",
  "\n\nContexto académico: Monsiváis documentó exhaustivamente cómo la cultura popular urbana mexicana del siglo XX constituyó un espacio de resistencia y negociación identitaria frente a la hegemonía del Estado posrevolucionario ('Los rituales del caos', 1995).",
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
      response = `Sobre «${articleContext}»: este tema refleja una de las tensiones más ricas de la cultura mexicana contemporánea — la negociación entre identidad local y narrativa global. Hay capas históricas, estéticas y políticas que vale la pena desenredar. ¿Quieres que exploremos algún ángulo específico?`;
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
      "\n\n¿Te gustaría que profundizara en algún aspecto para tu investigación?";
  }

  return response;
}
