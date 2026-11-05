import type { PromptTemplate } from './data';

// Plantillas añadidas/fusionadas en la Fase 3. Estructura común:
// Rol → Objetivo → Contexto → Pasos → Formato de salida → Idioma.
export const newTemplates: PromptTemplate[] = [
    // ─── Programación ────────────────────────────────────────────────────────
    {
        id: 'code_review',
        category: 'coding',
        icon: '🔎',
        title: { es: 'Revisión de Código', en: 'Code Review' },
        description: { es: 'Revisión crítica de un fragmento de código con hallazgos priorizados y propuestas de arreglo.', en: 'Critical review of a code snippet with prioritized findings and suggested fixes.' },
        prompt: {
            es: `Actúa como un **Senior Software Engineer** que hace code reviews rigurosas pero constructivas.

Revisa el siguiente código en **{{LANG}}**, poniendo el foco en **{{FOCUS_AREA}}**.

**Código a revisar:**
{{CODE}}

**PASOS:**
1. Resume en 2 líneas qué hace el código y su intención.
2. Detecta bugs, riesgos y malas prácticas, ordenados por severidad (Crítico / Alto / Medio / Bajo).
3. Para cada hallazgo indica la línea o fragmento afectado, por qué importa y cómo arreglarlo.
4. Propón una versión corregida de las partes más importantes.
5. Termina con un veredicto: aprobar, aprobar con cambios o rechazar.

**FORMATO DE SALIDA:**
- Resumen, tabla de hallazgos (severidad, ubicación, problema, arreglo) y código corregido en bloques con lenguaje.
- No inventes contexto que no esté en el código: si falta información, dilo.

IDIOMA: {{LANG_OUTPUT}}`,
            en: `Act as a **Senior Software Engineer** who performs rigorous but constructive code reviews.

Review the following **{{LANG}}** code, focusing on **{{FOCUS_AREA}}**.

**Code to review:**
{{CODE}}

**STEPS:**
1. Summarize in 2 lines what the code does and its intent.
2. Detect bugs, risks and bad practices, ordered by severity (Critical / High / Medium / Low).
3. For each finding give the affected line or snippet, why it matters and how to fix it.
4. Propose a corrected version of the most important parts.
5. Finish with a verdict: approve, approve with changes, or reject.

**OUTPUT FORMAT:**
- Summary, findings table (severity, location, problem, fix) and corrected code in fenced blocks with language.
- Do not invent context that is not in the code: if information is missing, say so.

LANGUAGE: {{LANG_OUTPUT}}`
        },
        tags: ['code', 'review', 'quality', 'refactor']
    },
    {
        id: 'debug_error',
        category: 'coding',
        icon: '🐞',
        title: { es: 'Depurar un Error', en: 'Debug an Error' },
        description: { es: 'Diagnóstico paso a paso de un error a partir del mensaje y el código relacionado.', en: 'Step-by-step diagnosis of an error from its message and related code.' },
        prompt: {
            es: `Actúa como un **Staff Engineer** experto en depuración sistemática.

Ayúdame a diagnosticar un error en **{{LANG}}**. No adivines: razona a partir de la evidencia.

**Mensaje de error / stack trace:**
{{ERROR_MESSAGE}}

**Código relacionado:**
{{CODE_CONTEXT}}

**Comportamiento esperado:** {{EXPECTED_BEHAVIOR}}

**PASOS:**
1. Explica con palabras simples qué significa el error.
2. Lista las 3 causas más probables ordenadas por probabilidad, con la evidencia que apoya cada una.
3. Indica qué comprobación rápida (log, test, comando) confirma o descarta cada causa.
4. Propón el arreglo para la causa más probable, con el código corregido.
5. Sugiere cómo evitar que este tipo de error vuelva a aparecer.

**FORMATO DE SALIDA:**
- Diagnóstico, tabla causa/evidencia/comprobación, arreglo propuesto y prevención.
- Si falta información para concluir, di exactamente qué dato necesitas.

IDIOMA: {{LANG_OUTPUT}}`,
            en: `Act as a **Staff Engineer** expert in systematic debugging.

Help me diagnose an error in **{{LANG}}**. Do not guess: reason from the evidence.

**Error message / stack trace:**
{{ERROR_MESSAGE}}

**Related code:**
{{CODE_CONTEXT}}

**Expected behavior:** {{EXPECTED_BEHAVIOR}}

**STEPS:**
1. Explain in plain words what the error means.
2. List the 3 most likely causes ordered by probability, with the evidence supporting each.
3. State which quick check (log, test, command) confirms or rules out each cause.
4. Propose the fix for the most likely cause, with corrected code.
5. Suggest how to prevent this kind of error from coming back.

**OUTPUT FORMAT:**
- Diagnosis, cause/evidence/check table, proposed fix and prevention.
- If information is missing to conclude, state exactly what you need.

LANGUAGE: {{LANG_OUTPUT}}`
        },
        tags: ['debug', 'errors', 'troubleshooting', 'code']
    },
    {
        id: 'write_tests',
        category: 'coding',
        icon: '🧪',
        title: { es: 'Escribir Tests', en: 'Write Tests' },
        description: { es: 'Genera una batería de tests con casos normales, límite y de error para un código dado.', en: 'Generate a test suite with normal, edge and error cases for a given piece of code.' },
        prompt: {
            es: `Actúa como un **QA Automation Engineer** especializado en testing de {{LANG}}.

Escribe tests con **{{TEST_FRAMEWORK}}** para el siguiente código.

**Código a testear:**
{{CODE}}

**PASOS:**
1. Identifica el comportamiento público que debe verificarse y las dependencias a simular (mocks).
2. Define casos: camino feliz, casos límite, entradas inválidas y errores esperados.
3. Escribe los tests con nombres descriptivos y estructura Arrange-Act-Assert.
4. Evita tests frágiles: no dependas de orden, tiempo ni estado compartido.
5. Indica qué casos quedan sin cubrir y por qué.

**FORMATO DE SALIDA:**
- Archivo(s) de test completos y ejecutables, con el comando para correrlos.
- Tabla breve de casos cubiertos y casos pendientes.

IDIOMA: {{LANG_OUTPUT}}`,
            en: `Act as a **QA Automation Engineer** specialized in {{LANG}} testing.

Write tests with **{{TEST_FRAMEWORK}}** for the following code.

**Code to test:**
{{CODE}}

**STEPS:**
1. Identify the public behavior to verify and the dependencies to mock.
2. Define cases: happy path, edge cases, invalid inputs and expected errors.
3. Write the tests with descriptive names and Arrange-Act-Assert structure.
4. Avoid brittle tests: do not rely on order, time or shared state.
5. State which cases remain uncovered and why.

**OUTPUT FORMAT:**
- Complete, runnable test file(s), with the command to run them.
- Short table of covered and pending cases.

LANGUAGE: {{LANG_OUTPUT}}`
        },
        tags: ['testing', 'qa', 'unit-tests', 'code']
    },
    {
        id: 'refactor_code',
        category: 'coding',
        icon: '♻️',
        title: { es: 'Refactorizar Código', en: 'Refactor Code' },
        description: { es: 'Refactor guiado manteniendo el comportamiento, con explicación de cada cambio.', en: 'Guided refactor that preserves behavior, with an explanation of each change.' },
        prompt: {
            es: `Actúa como un **Principal Engineer** experto en refactorización segura de {{LANG}}.

Refactoriza el siguiente código con el objetivo de **{{REFACTOR_GOAL}}**, **sin cambiar su comportamiento observable**.

**Código original:**
{{CODE}}

**PASOS:**
1. Describe los problemas del código actual relacionados con el objetivo.
2. Propón un plan de cambios pequeños y ordenados (cada uno verificable).
3. Entrega el código refactorizado completo.
4. Explica cada cambio y el beneficio que aporta.
5. Señala riesgos de regresión y los tests que deberían ejecutarse para validar.

**FORMATO DE SALIDA:**
- Problemas detectados, plan, código final en bloque con lenguaje, lista de cambios y riesgos.
- No añadas funcionalidades nuevas ni dependencias sin justificarlas.

IDIOMA: {{LANG_OUTPUT}}`,
            en: `Act as a **Principal Engineer** expert in safe {{LANG}} refactoring.

Refactor the following code aiming for **{{REFACTOR_GOAL}}**, **without changing its observable behavior**.

**Original code:**
{{CODE}}

**STEPS:**
1. Describe the problems of the current code related to the goal.
2. Propose a plan of small, ordered changes (each verifiable).
3. Deliver the complete refactored code.
4. Explain each change and the benefit it brings.
5. Point out regression risks and the tests that should run to validate.

**OUTPUT FORMAT:**
- Detected problems, plan, final code in a fenced block with language, change list and risks.
- Do not add new features or dependencies without justifying them.

LANGUAGE: {{LANG_OUTPUT}}`
        },
        tags: ['refactor', 'clean-code', 'maintainability', 'code']
    },
    // ─── Seguridad (fusión de checklist + auditoría de API) ──────────────────
    {
        id: 'security_audit',
        category: 'security',
        icon: '🛡️',
        title: { es: 'Auditoría de Seguridad', en: 'Security Audit' },
        description: { es: 'Auditoría de seguridad de una API, aplicación web, código o infraestructura, con hallazgos y remediación.', en: 'Security audit of an API, web app, source code or infrastructure, with findings and remediation.' },
        prompt: {
            es: `Actúa como un **Application Security Specialist** con metodología OWASP (ASVS / API Security / Top 10).

Realiza una **auditoría de seguridad** de tipo **{{AUDIT_TYPE}}** sobre **{{TARGET}}**, construido con **{{TECH_STACK}}**, dentro del alcance **{{SCOPE}}**.

**Contexto:**
- **Objetivo:** {{TARGET}}
- **Tecnologías:** {{TECH_STACK}}
- **Alcance:** {{SCOPE}}

**ÁREAS A EVALUAR:**
1. **Autenticación y sesiones** (JWT/OAuth/API keys, caducidad, rotación).
2. **Autorización** (RBAC/ABAC, IDOR, escalada de privilegios).
3. **Validación de entrada** (inyecciones, XSS, deserialización, subida de ficheros).
4. **Protección de datos** (cifrado en tránsito y reposo, secretos, PII).
5. **Configuración** (CORS, cabeceras, defaults inseguros, rate limiting).
6. **Dependencias y cadena de suministro.**
7. **Errores, logging y monitorización** (fuga de información, trazabilidad).

**FORMATO DE SALIDA:**
- Resumen ejecutivo con el riesgo global.
- Tabla de hallazgos: área, severidad (Crítico/Alto/Medio/Bajo), evidencia, impacto y remediación.
- Ejemplo vulnerable vs seguro en {{TECH_STACK}} para los hallazgos más relevantes.
- Checklist de verificación marcable.
- Limítate al alcance indicado; no asumas acceso que no se te haya descrito.

IDIOMA: {{LANG_OUTPUT}}`,
            en: `Act as an **Application Security Specialist** following OWASP methodology (ASVS / API Security / Top 10).

Perform a **{{AUDIT_TYPE}}** **security audit** of **{{TARGET}}**, built with **{{TECH_STACK}}**, within the **{{SCOPE}}** scope.

**Context:**
- **Target:** {{TARGET}}
- **Technologies:** {{TECH_STACK}}
- **Scope:** {{SCOPE}}

**AREAS TO EVALUATE:**
1. **Authentication and sessions** (JWT/OAuth/API keys, expiry, rotation).
2. **Authorization** (RBAC/ABAC, IDOR, privilege escalation).
3. **Input validation** (injection, XSS, deserialization, file upload).
4. **Data protection** (encryption in transit and at rest, secrets, PII).
5. **Configuration** (CORS, headers, insecure defaults, rate limiting).
6. **Dependencies and supply chain.**
7. **Errors, logging and monitoring** (information leakage, traceability).

**OUTPUT FORMAT:**
- Executive summary with overall risk.
- Findings table: area, severity (Critical/High/Medium/Low), evidence, impact and remediation.
- Vulnerable vs secure example in {{TECH_STACK}} for the most relevant findings.
- Checkable verification checklist.
- Stay within the stated scope; do not assume access that was not described.

LANGUAGE: {{LANG_OUTPUT}}`
        },
        tags: ['security', 'audit', 'owasp', 'api', 'checklist']
    },
    // ─── Escritura (fusiones) ────────────────────────────────────────────────
    {
        id: 'blog_article',
        category: 'writing',
        icon: '📝',
        title: { es: 'Artículo de Blog', en: 'Blog Article' },
        description: { es: 'Artículo completo (técnico, divulgativo o SEO) con títulos, estructura y metadatos.', en: 'Complete article (technical, explanatory or SEO) with titles, structure and metadata.' },
        prompt: {
            es: `Actúa como un **Editor y Redactor Senior** especializado en contenido {{ARTICLE_TYPE}} y SEO.

Escribe un **artículo** sobre **{{TOPIC}}**, orientado a la keyword **{{KEYWORD}}** y dirigido a una audiencia de nivel **{{AUDIENCE_LEVEL}}**.

**Contexto:**
- **Tema:** {{TOPIC}}
- **Keyword principal:** {{KEYWORD}}
- **Tipo de artículo:** {{ARTICLE_TYPE}}
- **Nivel de la audiencia:** {{AUDIENCE_LEVEL}}

**PASOS:**
1. Propón 3 títulos optimizados para SEO que incluyan la keyword.
2. Redacta un resumen inicial (TL;DR) y una introducción con gancho y problema.
3. Desarrolla el contenido con subtítulos claros; si es técnico, incluye ejemplos de código correctos y explicados.
4. Añade una sección de buenas prácticas y errores comunes.
5. Cierra con conclusión, siguiente paso y llamada a la acción.
6. Aporta meta description (máx. 160 caracteres), keywords secundarias y slug.

**FORMATO DE SALIDA:**
- Artículo en Markdown con encabezados jerárquicos, metadatos al final y tiempo de lectura estimado.
- No inventes datos, cifras ni citas: si necesitas una fuente, márcalo como [FALTA: fuente].

IDIOMA: {{LANG_OUTPUT}}`,
            en: `Act as a **Senior Editor and Writer** specialized in {{ARTICLE_TYPE}} content and SEO.

Write an **article** about **{{TOPIC}}**, targeting the keyword **{{KEYWORD}}** and aimed at a **{{AUDIENCE_LEVEL}}** audience.

**Context:**
- **Topic:** {{TOPIC}}
- **Main keyword:** {{KEYWORD}}
- **Article type:** {{ARTICLE_TYPE}}
- **Audience level:** {{AUDIENCE_LEVEL}}

**STEPS:**
1. Propose 3 SEO-optimized titles that include the keyword.
2. Write a TL;DR and an introduction with a hook and problem.
3. Develop the content with clear subheadings; if technical, include correct, explained code examples.
4. Add a best practices and common mistakes section.
5. Close with a conclusion, next step and call to action.
6. Provide a meta description (max 160 characters), secondary keywords and slug.

**OUTPUT FORMAT:**
- Markdown article with hierarchical headings, metadata at the end and estimated reading time.
- Do not invent data, figures or quotes: if you need a source, mark it as [MISSING: source].

LANGUAGE: {{LANG_OUTPUT}}`
        },
        tags: ['blog', 'seo', 'writing', 'technical']
    },
    {
        id: 'av_script',
        category: 'writing',
        icon: '🎙️',
        title: { es: 'Guion de Audio / Vídeo', en: 'Audio / Video Script' },
        description: { es: 'Guion para podcast o vídeo con gancho, estructura por bloques y cierre con llamada a la acción.', en: 'Podcast or video script with a hook, block structure and a call-to-action close.' },
        prompt: {
            es: `Actúa como un **Guionista y Productor de Contenido** especializado en {{AV_FORMAT}}.

Escribe el **guion** de un episodio sobre **{{TOPIC}}**, de unos **{{DURATION_MIN}} minutos**, para una audiencia de **{{AUDIENCE}}**.

**Contexto:**
- **Formato:** {{AV_FORMAT}}
- **Tema:** {{TOPIC}}
- **Duración objetivo:** {{DURATION_MIN}} minutos
- **Audiencia:** {{AUDIENCE}}

**PASOS:**
1. Propón 3 títulos y un gancho para los primeros 15 segundos.
2. Estructura el episodio en bloques con tiempo estimado por bloque.
3. Redacta el guion completo en tono hablado, con transiciones naturales.
4. Incluye indicaciones de producción (recursos visuales, música, cortes o pausas).
5. Cierra con resumen, llamada a la acción y adelanto del siguiente episodio.

**FORMATO DE SALIDA:**
- Tabla de bloques (tiempo, contenido, recurso) y guion completo.
- Descripción para publicar y 5 etiquetas.

IDIOMA: {{LANG_OUTPUT}}`,
            en: `Act as a **Scriptwriter and Content Producer** specialized in {{AV_FORMAT}}.

Write the **script** for an episode about **{{TOPIC}}**, around **{{DURATION_MIN}} minutes** long, for an audience of **{{AUDIENCE}}**.

**Context:**
- **Format:** {{AV_FORMAT}}
- **Topic:** {{TOPIC}}
- **Target duration:** {{DURATION_MIN}} minutes
- **Audience:** {{AUDIENCE}}

**STEPS:**
1. Propose 3 titles and a hook for the first 15 seconds.
2. Structure the episode into blocks with an estimated time per block.
3. Write the full script in a spoken tone, with natural transitions.
4. Include production notes (visuals, music, cuts or pauses).
5. Close with a recap, a call to action and a teaser for the next episode.

**OUTPUT FORMAT:**
- Block table (time, content, asset) and full script.
- Publishing description and 5 tags.

LANGUAGE: {{LANG_OUTPUT}}`
        },
        tags: ['podcast', 'youtube', 'script', 'video']
    },
    // ─── Redes sociales (fusión de 4 plantillas por plataforma) ──────────────
    {
        id: 'social_post',
        category: 'social',
        icon: '📣',
        title: { es: 'Publicación para Redes', en: 'Social Media Post' },
        description: { es: 'Contenido adaptado al formato nativo de cada plataforma (hilo, carrusel, guion corto o post).', en: 'Content adapted to each platform’s native format (thread, carousel, short-form script or post).' },
        prompt: {
            es: `Actúa como un **Social Media Strategist** que domina el formato nativo de cada plataforma.

Crea una publicación para **{{POST_PLATFORM}}** sobre **{{TOPIC}}**, con el objetivo de **{{POST_GOAL}}**, en tono **{{POST_TONE}}** y dirigida a **{{AUDIENCE}}**.

**Adaptación por plataforma (aplica solo la que corresponda):**
- **X / Twitter:** hilo de 5-8 posts, el primero como gancho, máx. 280 caracteres por post.
- **Instagram:** carrusel de 6-9 diapositivas con texto breve por diapositiva, más caption y hashtags.
- **TikTok / Reels:** guion de 30-45 s con gancho en los primeros 3 s, escenas y texto en pantalla.
- **LinkedIn:** post de 120-200 palabras con primera línea fuerte, párrafos cortos y pregunta final.

**PASOS:**
1. Propón 3 ganchos alternativos y elige el mejor justificando por qué.
2. Desarrolla el contenido completo en el formato de la plataforma.
3. Añade una llamada a la acción alineada con {{POST_GOAL}}.
4. Sugiere el mejor momento de publicación y una idea de recurso visual.

**FORMATO DE SALIDA:**
- Contenido listo para copiar y pegar, separado por post/diapositiva/escena.
- No inventes estadísticas ni testimonios.

IDIOMA: {{LANG_OUTPUT}}`,
            en: `Act as a **Social Media Strategist** who masters each platform’s native format.

Create a post for **{{POST_PLATFORM}}** about **{{TOPIC}}**, aiming to **{{POST_GOAL}}**, in a **{{POST_TONE}}** tone and aimed at **{{AUDIENCE}}**.

**Platform adaptation (apply only the relevant one):**
- **X / Twitter:** thread of 5-8 posts, the first one as the hook, max 280 characters per post.
- **Instagram:** carousel of 6-9 slides with short text per slide, plus caption and hashtags.
- **TikTok / Reels:** 30-45 s script with a hook in the first 3 s, scenes and on-screen text.
- **LinkedIn:** 120-200 word post with a strong first line, short paragraphs and a closing question.

**STEPS:**
1. Propose 3 alternative hooks and pick the best, explaining why.
2. Develop the full content in the platform’s format.
3. Add a call to action aligned with {{POST_GOAL}}.
4. Suggest the best posting time and a visual asset idea.

**OUTPUT FORMAT:**
- Copy-and-paste-ready content, separated by post/slide/scene.
- Do not invent statistics or testimonials.

LANGUAGE: {{LANG_OUTPUT}}`
        },
        tags: ['social', 'twitter', 'instagram', 'tiktok', 'linkedin']
    },
    // ─── Productividad ───────────────────────────────────────────────────────
    {
        id: 'professional_email',
        category: 'productivity',
        icon: '✉️',
        title: { es: 'Email Profesional', en: 'Professional Email' },
        description: { es: 'Redacta un email claro y efectivo, con asunto y tono adecuados al destinatario.', en: 'Write a clear, effective email with the right subject line and tone for the recipient.' },
        prompt: {
            es: `Actúa como un **Asistente de Comunicación Ejecutiva**.

Redacta un email dirigido a **{{RECIPIENT}}** con el objetivo de: **{{EMAIL_GOAL}}**. Tono: **{{EMAIL_TONE}}**.

**PASOS:**
1. Propón 3 asuntos claros y específicos.
2. Redacta el cuerpo: contexto en una frase, petición o mensaje principal, detalles necesarios y siguiente paso con fecha si aplica.
3. Mantenlo breve (máx. 150 palabras) y fácil de leer en el móvil.
4. Ofrece una versión más corta de 3 líneas.

**FORMATO DE SALIDA:**
- Asuntos, email completo y versión corta, listos para copiar.
- No inventes hechos, fechas ni cifras: si falta un dato, márcalo como [FALTA: dato].

IDIOMA: {{LANG_OUTPUT}}`,
            en: `Act as an **Executive Communication Assistant**.

Write an email addressed to **{{RECIPIENT}}** with the goal of: **{{EMAIL_GOAL}}**. Tone: **{{EMAIL_TONE}}**.

**STEPS:**
1. Propose 3 clear, specific subject lines.
2. Write the body: context in one sentence, main request or message, necessary details and next step with a date if applicable.
3. Keep it short (max 150 words) and easy to read on mobile.
4. Offer a shorter 3-line version.

**OUTPUT FORMAT:**
- Subjects, full email and short version, ready to copy.
- Do not invent facts, dates or figures: if data is missing, mark it as [MISSING: data].

LANGUAGE: {{LANG_OUTPUT}}`
        },
        tags: ['email', 'communication', 'work']
    },
    {
        id: 'summarize_document',
        category: 'productivity',
        icon: '📑',
        title: { es: 'Resumir un Documento', en: 'Summarize a Document' },
        description: { es: 'Resumen fiel de un texto con ideas clave, datos importantes y acciones.', en: 'Faithful summary of a text with key ideas, important data and actions.' },
        prompt: {
            es: `Actúa como un **Analista de Información** que resume con precisión y sin inventar nada.

Resume el siguiente documento para **{{AUDIENCE}}**, con una extensión **{{SUMMARY_LENGTH}}**.

**Documento:**
{{DOCUMENT}}

**PASOS:**
1. Resume la idea central en 2-3 frases.
2. Lista las ideas clave en viñetas, en orden de importancia.
3. Extrae cifras, fechas, nombres y decisiones relevantes tal como aparecen.
4. Identifica acciones pendientes o conclusiones, si las hay.
5. Señala lo que el documento NO aclara o deja ambiguo.

**FORMATO DE SALIDA:**
- Resumen, ideas clave, datos, acciones y puntos ambiguos.
- Usa solo información del documento; no añadas conocimiento externo.

IDIOMA: {{LANG_OUTPUT}}`,
            en: `Act as an **Information Analyst** who summarizes accurately and invents nothing.

Summarize the following document for **{{AUDIENCE}}**, with a **{{SUMMARY_LENGTH}}** length.

**Document:**
{{DOCUMENT}}

**STEPS:**
1. Summarize the central idea in 2-3 sentences.
2. List the key ideas as bullets, in order of importance.
3. Extract relevant figures, dates, names and decisions exactly as they appear.
4. Identify pending actions or conclusions, if any.
5. Point out what the document does NOT clarify or leaves ambiguous.

**OUTPUT FORMAT:**
- Summary, key ideas, data, actions and ambiguous points.
- Use only information from the document; do not add outside knowledge.

LANGUAGE: {{LANG_OUTPUT}}`
        },
        tags: ['summary', 'analysis', 'reading']
    },
    {
        id: 'meeting_minutes',
        category: 'productivity',
        icon: '🗒️',
        title: { es: 'Acta de Reunión y Tareas', en: 'Meeting Minutes & Tasks' },
        description: { es: 'Convierte notas sueltas de una reunión en acta, decisiones y tareas con responsable.', en: 'Turn loose meeting notes into minutes, decisions and tasks with owners.' },
        prompt: {
            es: `Actúa como un **Project Manager** que transforma notas desordenadas en actas accionables.

Convierte estas notas de la reunión **{{MEETING_TOPIC}}** en un acta clara.

**Notas:**
{{NOTES}}

**PASOS:**
1. Resume el objetivo y el resultado de la reunión en 3 líneas.
2. Lista las decisiones tomadas.
3. Extrae las tareas: qué, responsable y fecha límite (si no aparecen, márcalas como [FALTA: responsable] o [FALTA: fecha]).
4. Anota los temas abiertos y los riesgos mencionados.
5. Redacta un mensaje corto de seguimiento para enviar a los asistentes.

**FORMATO DE SALIDA:**
- Acta en Markdown con tabla de tareas (tarea, responsable, fecha, estado).
- No inventes responsables ni fechas que no estén en las notas.

IDIOMA: {{LANG_OUTPUT}}`,
            en: `Act as a **Project Manager** who turns messy notes into actionable minutes.

Convert these notes from the **{{MEETING_TOPIC}}** meeting into clear minutes.

**Notes:**
{{NOTES}}

**STEPS:**
1. Summarize the meeting’s goal and outcome in 3 lines.
2. List the decisions made.
3. Extract the tasks: what, owner and due date (if missing, mark them as [MISSING: owner] or [MISSING: date]).
4. Note open topics and risks mentioned.
5. Write a short follow-up message to send to attendees.

**OUTPUT FORMAT:**
- Markdown minutes with a task table (task, owner, date, status).
- Do not invent owners or dates that are not in the notes.

LANGUAGE: {{LANG_OUTPUT}}`
        },
        tags: ['meetings', 'minutes', 'tasks', 'productivity']
    },
    {
        id: 'extract_json',
        category: 'productivity',
        icon: '🧾',
        title: { es: 'Extraer Datos a JSON', en: 'Extract Data to JSON' },
        description: { es: 'Extrae campos concretos de un texto y los devuelve como JSON válido.', en: 'Extract specific fields from a text and return them as valid JSON.' },
        prompt: {
            es: `Actúa como un **Ingeniero de Datos** especializado en extracción de información de texto no estructurado.

Extrae del siguiente texto los campos indicados y devuélvelos como **JSON válido**.

**Campos a extraer:**
{{FIELDS}}

**Texto fuente:**
{{SOURCE_TEXT}}

**REGLAS:**
1. Usa exactamente los nombres de campo indicados.
2. Si un dato no aparece en el texto, usa null; nunca lo inventes.
3. Conserva números y fechas tal como están (normaliza fechas a ISO 8601 si es posible).
4. Si hay varios elementos, devuelve un array de objetos.

**FORMATO DE SALIDA:**
- Solo un bloque de código JSON válido, sin texto adicional.
- Después del bloque, una lista breve de campos dudosos o ambiguos.

IDIOMA: {{LANG_OUTPUT}}`,
            en: `Act as a **Data Engineer** specialized in extracting information from unstructured text.

Extract the indicated fields from the following text and return them as **valid JSON**.

**Fields to extract:**
{{FIELDS}}

**Source text:**
{{SOURCE_TEXT}}

**RULES:**
1. Use exactly the field names provided.
2. If a value does not appear in the text, use null; never invent it.
3. Keep numbers and dates as they are (normalize dates to ISO 8601 when possible).
4. If there are several items, return an array of objects.

**OUTPUT FORMAT:**
- Only one valid JSON code block, with no extra text.
- After the block, a short list of doubtful or ambiguous fields.

LANGUAGE: {{LANG_OUTPUT}}`
        },
        tags: ['json', 'extraction', 'data', 'structured-output']
    },
    {
        id: 'compare_options',
        category: 'productivity',
        icon: '⚖️',
        title: { es: 'Comparar Opciones para Decidir', en: 'Compare Options to Decide' },
        description: { es: 'Compara alternativas con criterios ponderados y recomienda una con sus riesgos.', en: 'Compare alternatives with weighted criteria and recommend one along with its risks.' },
        prompt: {
            es: `Actúa como un **Consultor de Decisiones** que razona con criterios explícitos.

Ayúdame a decidir entre estas opciones:
{{OPTIONS}}

**Contexto de la decisión:** {{CONTEXT}}
**Criterios que me importan:** {{CRITERIA}}

**PASOS:**
1. Reformula la decisión en una frase y confirma las opciones.
2. Asigna un peso (1-5) a cada criterio según el contexto y justifícalo.
3. Evalúa cada opción en cada criterio (1-5) con una razón breve.
4. Calcula la puntuación ponderada y muestra la tabla.
5. Recomienda una opción, indica los riesgos principales y qué cambiaría tu recomendación.

**FORMATO DE SALIDA:**
- Tabla comparativa, ranking, recomendación y riesgos.
- Si faltan datos para evaluar, dilo en lugar de suponerlos.

IDIOMA: {{LANG_OUTPUT}}`,
            en: `Act as a **Decision Consultant** who reasons with explicit criteria.

Help me decide between these options:
{{OPTIONS}}

**Decision context:** {{CONTEXT}}
**Criteria that matter to me:** {{CRITERIA}}

**STEPS:**
1. Restate the decision in one sentence and confirm the options.
2. Assign a weight (1-5) to each criterion based on the context and justify it.
3. Score each option on each criterion (1-5) with a brief reason.
4. Compute the weighted score and show the table.
5. Recommend one option, state the main risks and what would change your recommendation.

**OUTPUT FORMAT:**
- Comparison table, ranking, recommendation and risks.
- If data is missing to evaluate, say so instead of assuming it.

LANGUAGE: {{LANG_OUTPUT}}`
        },
        tags: ['decision', 'comparison', 'analysis']
    },
    {
        id: 'study_plan',
        category: 'productivity',
        icon: '🎓',
        title: { es: 'Plan de Estudio', en: 'Study Plan' },
        description: { es: 'Plan semanal realista para aprender un tema, con práctica y revisiones.', en: 'Realistic weekly plan to learn a topic, with practice and reviews.' },
        prompt: {
            es: `Actúa como un **Tutor Académico** experto en aprendizaje efectivo (práctica activa y repaso espaciado).

Diseña un **plan de estudio** para aprender **{{STUDY_TOPIC}}**, partiendo de un nivel **{{CURRENT_LEVEL}}**, durante **{{WEEKS}} semanas** con **{{HOURS_PER_WEEK}} horas** por semana.

**PASOS:**
1. Define el objetivo final medible y los prerrequisitos.
2. Divide el contenido en bloques semanales ordenados de lo básico a lo avanzado.
3. Para cada semana: temas, ejercicios prácticos y un mini-proyecto o test de comprobación.
4. Incluye sesiones de repaso espaciado y un hito de evaluación a mitad del plan.
5. Sugiere recursos de tipos variados (sin inventar títulos concretos: si dudas, descríbelos por tipo).
6. Añade consejos para mantener la constancia y ajustar el plan si te retrasas.

**FORMATO DE SALIDA:**
- Tabla semana a semana (temas, práctica, entregable, horas) y checklist de progreso.

IDIOMA: {{LANG_OUTPUT}}`,
            en: `Act as an **Academic Tutor** expert in effective learning (active practice and spaced repetition).

Design a **study plan** to learn **{{STUDY_TOPIC}}**, starting from a **{{CURRENT_LEVEL}}** level, over **{{WEEKS}} weeks** with **{{HOURS_PER_WEEK}} hours** per week.

**STEPS:**
1. Define the measurable end goal and the prerequisites.
2. Split the content into weekly blocks ordered from basic to advanced.
3. For each week: topics, practical exercises and a mini-project or check test.
4. Include spaced review sessions and an evaluation milestone halfway through.
5. Suggest varied resource types (do not invent specific titles: if unsure, describe them by type).
6. Add tips to stay consistent and to adjust the plan if you fall behind.

**OUTPUT FORMAT:**
- Week-by-week table (topics, practice, deliverable, hours) and a progress checklist.

LANGUAGE: {{LANG_OUTPUT}}`
        },
        tags: ['study', 'learning', 'planning', 'education']
    },
    {
        id: 'improve_prompt',
        category: 'productivity',
        icon: '✨',
        title: { es: 'Mejora mi Prompt', en: 'Improve My Prompt' },
        description: { es: 'Analiza un prompt tuyo, detecta sus debilidades y entrega una versión mejorada.', en: 'Analyze a prompt of yours, spot its weaknesses and deliver an improved version.' },
        prompt: {
            es: `Actúa como un **Prompt Engineer** experto en diseñar instrucciones claras para modelos de lenguaje.

Analiza y mejora este prompt, pensado para **{{TARGET_MODEL}}**.

**Prompt original:**
{{DRAFT_PROMPT}}

**PASOS:**
1. Resume qué intenta lograr el prompt y para quién es su resultado.
2. Detecta debilidades: ambigüedades, falta de contexto, de formato de salida, de restricciones o de criterios de calidad.
3. Entrega una versión mejorada con rol, objetivo, contexto, pasos, formato de salida y restricciones.
4. Explica brevemente cada cambio importante.
5. Lista las preguntas que deberías responder para afinarlo todavía más.

**FORMATO DE SALIDA:**
- Diagnóstico breve, prompt mejorado en un bloque de código listo para copiar y lista de cambios.
- Conserva la intención original; no añadas requisitos que no estén implícitos. Si falta un dato, usa [FALTA: dato].

IDIOMA: {{LANG_OUTPUT}}`,
            en: `Act as a **Prompt Engineer** expert in designing clear instructions for language models.

Analyze and improve this prompt, intended for **{{TARGET_MODEL}}**.

**Original prompt:**
{{DRAFT_PROMPT}}

**STEPS:**
1. Summarize what the prompt tries to achieve and who the result is for.
2. Detect weaknesses: ambiguities, missing context, output format, constraints or quality criteria.
3. Deliver an improved version with role, goal, context, steps, output format and constraints.
4. Briefly explain each important change.
5. List the questions you should answer to refine it even further.

**OUTPUT FORMAT:**
- Short diagnosis, improved prompt in a copy-ready code block and a change list.
- Preserve the original intent; do not add requirements that are not implicit. If data is missing, use [MISSING: data].

LANGUAGE: {{LANG_OUTPUT}}`
        },
        tags: ['prompt-engineering', 'meta-prompt', 'improvement']
    },
];
