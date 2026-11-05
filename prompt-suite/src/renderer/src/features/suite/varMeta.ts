type L = { es: string; en: string };
type Opts = { es: string[]; en: string[] };

export interface VarMeta {
    label?: L;
    type?: 'text' | 'textarea' | 'select';
    options?: Opts;          // solo para type 'select'; el valor insertado es el texto mostrado
    suggestions?: string[];  // sugerencias para texto libre (datalist)
    example?: L;             // se usa como placeholder y en "Rellenar con ejemplos"
}

const l = (es: string, en: string = es): L => ({ es, en });
const sel = (es: string[], en: string[]): Pick<VarMeta, 'type' | 'options'> => ({ type: 'select', options: { es, en } });
const area = (): Pick<VarMeta, 'type'> => ({ type: 'textarea' });

// Metadatos por nombre de variable (compartidos por todas las plantillas).
// La explicación larga ("why") sigue en VAR_HELP; aquí van tipo de campo, opciones y ejemplos.
export const VAR_META: Record<string, VarMeta> = {
    // Generales
    LANG: { suggestions: ['TypeScript', 'Python', 'Rust', 'Go', 'Java', 'C#', 'PHP', 'JavaScript', 'Kotlin', 'Swift'], example: l('TypeScript') },
    FRAMEWORK: { suggestions: ['React', 'Next.js', 'Django', 'FastAPI', 'Spring Boot', 'Express', 'Laravel', '.NET'], example: l('FastAPI') },
    APP_TYPE: { suggestions: ['API REST', 'Aplicación web', 'Microservicio', 'CLI', 'Aplicación móvil', 'Aplicación de escritorio'], example: l('API REST', 'REST API') },
    APP_NAME: { example: l('Mi App') },
    TECH_STACK: { suggestions: ['React + Node + PostgreSQL', 'Django + PostgreSQL', 'Rust + Tauri', 'Next.js + Prisma'], example: l('React + Node + PostgreSQL') },
    ARCHITECTURE: { suggestions: ['Monolito', 'Microservicios', 'Serverless', 'Event-driven'], example: l('Microservicios', 'Microservices') },
    INFRASTRUCTURE: { suggestions: ['Cloud', 'On-premise', 'Híbrida'], example: l('Cloud (AWS)') },
    DATABASE: { suggestions: ['PostgreSQL', 'MySQL', 'MongoDB', 'SQLite', 'Redis'], example: l('PostgreSQL') },
    DEPLOY: { suggestions: ['Kubernetes', 'AWS ECS', 'Vercel', 'Fly.io', 'VPS con Docker'], example: l('Kubernetes') },
    CLOUD: { ...sel(['AWS', 'Azure', 'GCP', 'OCI'], ['AWS', 'Azure', 'GCP', 'OCI']) },
    API_TYPE: { ...sel(['REST', 'GraphQL', 'gRPC', 'WebSocket'], ['REST', 'GraphQL', 'gRPC', 'WebSocket']) },
    CONTAINER_PORT: { example: l('8080') },
    BASE_URL: { example: l('https://api.ejemplo.com/v1', 'https://api.example.com/v1') },
    VERSION: { example: l('1.4.0') },
    ROTATION: { suggestions: ['30 días', '90 días', 'Automática en cada despliegue'], example: l('90 días', '90 days') },
    SCOPE: { ...area(), example: l('api.ejemplo.com y su panel de administración', 'api.example.com and its admin panel') },
    CONTEXT: { ...area(), example: l('Equipo de 5 personas, lanzamiento en 3 meses', '5-person team, launching in 3 months') },
    PROBLEM: { ...area(), example: l('Los clientes tardan demasiado en completar el alta', 'Customers take too long to complete sign-up') },
    DESCRIPTION: { ...area(), example: l('Herramienta para generar prompts reutilizables', 'Tool to generate reusable prompts') },
    TIMELINE: { ...area(), example: l('10:02 alerta, 10:15 diagnóstico, 11:00 mitigado', '10:02 alert, 10:15 diagnosis, 11:00 mitigated') },
    IMPACT: { ...area(), example: l('30 min sin servicio para el 20 % de usuarios', '30 min of downtime for 20% of users') },
    TOPIC: { example: l('Cómo optimizar consultas SQL', 'How to optimize SQL queries') },
    AUDIENCE: { example: l('Desarrolladores junior', 'Junior developers') },

    // Programación
    CODE: { ...area(), label: l('Código', 'Code') },
    CODE_CONTEXT: { ...area(), label: l('Código relacionado', 'Related code') },
    ERROR_MESSAGE: { ...area(), label: l('Mensaje de error o stack trace', 'Error message or stack trace') },
    EXPECTED_BEHAVIOR: { label: l('Comportamiento esperado', 'Expected behavior'), example: l('Debería devolver la lista ordenada', 'It should return the sorted list') },
    FOCUS_AREA: { label: l('Enfoque de la revisión', 'Review focus'), ...sel(['General', 'Seguridad', 'Rendimiento', 'Legibilidad y mantenimiento', 'Cobertura de tests'], ['General', 'Security', 'Performance', 'Readability and maintainability', 'Test coverage']) },
    TEST_FRAMEWORK: { label: l('Framework de tests', 'Test framework'), suggestions: ['Vitest', 'Jest', 'pytest', 'JUnit', 'Go test', 'cargo test'], example: l('Vitest') },
    REFACTOR_GOAL: { label: l('Objetivo del refactor', 'Refactor goal'), suggestions: ['Mejorar la legibilidad', 'Reducir duplicación', 'Mejorar el rendimiento', 'Facilitar los tests'], example: l('Mejorar la legibilidad', 'Improve readability') },

    // Seguridad
    AUDIT_TYPE: { label: l('Tipo de auditoría', 'Audit type'), ...sel(['API', 'Aplicación web', 'Código fuente', 'Infraestructura'], ['API', 'Web application', 'Source code', 'Infrastructure']) },
    TARGET: { label: l('Objetivo a auditar', 'Audit target'), example: l('API de pagos (https://api.ejemplo.com)', 'Payments API (https://api.example.com)') },
    AUTHORIZATION: { label: l('Autorización y reglas de enfrentamiento', 'Authorization and rules of engagement'), ...area(), example: l('Contrato firmado con el cliente, ventana 1-15 de marzo, sin ataques de denegación de servicio', 'Signed client contract, 1-15 March window, no denial-of-service attacks') },

    // Escritura y contenido
    ARTICLE_TYPE: { label: l('Tipo de artículo', 'Article type'), ...sel(['Técnico', 'Divulgativo', 'Tutorial paso a paso', 'Opinión', 'Orientado a SEO'], ['Technical', 'Explanatory', 'Step-by-step tutorial', 'Opinion', 'SEO-focused']) },
    KEYWORD: { label: l('Keyword principal', 'Main keyword'), example: l('optimizar consultas SQL', 'optimize SQL queries') },
    AUDIENCE_LEVEL: { label: l('Nivel de la audiencia', 'Audience level'), ...sel(['Principiante', 'Intermedio', 'Avanzado'], ['Beginner', 'Intermediate', 'Advanced']) },
    AV_FORMAT: { label: l('Formato', 'Format'), ...sel(['Podcast', 'Vídeo de YouTube', 'Vídeo corto'], ['Podcast', 'YouTube video', 'Short video']) },
    DURATION_MIN: { label: l('Duración (minutos)', 'Duration (minutes)'), example: l('10') },

    // Redes
    POST_PLATFORM: { label: l('Plataforma', 'Platform'), ...sel(['X / Twitter', 'Instagram', 'TikTok / Reels', 'LinkedIn'], ['X / Twitter', 'Instagram', 'TikTok / Reels', 'LinkedIn']) },
    POST_GOAL: { label: l('Objetivo de la publicación', 'Post goal'), ...sel(['Educar', 'Vender', 'Entretener', 'Generar comunidad'], ['Educate', 'Sell', 'Entertain', 'Build community']) },
    POST_TONE: { label: l('Tono', 'Tone'), ...sel(['Cercano', 'Profesional', 'Divertido', 'Inspirador'], ['Friendly', 'Professional', 'Fun', 'Inspiring']) },

    // Productividad
    RECIPIENT: { label: l('Destinatario', 'Recipient'), example: l('Mi jefa, Laura', 'My manager, Laura') },
    EMAIL_GOAL: { label: l('Objetivo del email', 'Email goal'), ...area(), example: l('Pedir una ampliación de plazo de una semana', 'Ask for a one-week deadline extension') },
    EMAIL_TONE: { label: l('Tono', 'Tone'), ...sel(['Formal', 'Cordial', 'Directo', 'Cercano'], ['Formal', 'Cordial', 'Direct', 'Friendly']) },
    DOCUMENT: { label: l('Documento', 'Document'), ...area() },
    SUMMARY_LENGTH: { label: l('Extensión del resumen', 'Summary length'), ...sel(['Muy breve (3 líneas)', 'Media (1 página)', 'Detallada'], ['Very short (3 lines)', 'Medium (1 page)', 'Detailed']) },
    MEETING_TOPIC: { label: l('Tema de la reunión', 'Meeting topic'), example: l('Planificación del sprint 12', 'Sprint 12 planning') },
    NOTES: { label: l('Notas', 'Notes'), ...area() },
    FIELDS: { label: l('Campos a extraer', 'Fields to extract'), ...area(), example: l('nombre, email, fecha_pedido, importe_total', 'name, email, order_date, total_amount') },
    SOURCE_TEXT: { label: l('Texto fuente', 'Source text'), ...area() },
    OPTIONS: { label: l('Opciones a comparar', 'Options to compare'), ...area(), example: l('A) Comprar licencia\nB) Construirlo nosotros\nC) Usar open source', 'A) Buy a license\nB) Build it ourselves\nC) Use open source') },
    CRITERIA: { label: l('Criterios', 'Criteria'), ...area(), example: l('coste, tiempo, riesgo, mantenimiento', 'cost, time, risk, maintenance') },
    STUDY_TOPIC: { label: l('Tema a aprender', 'Topic to learn'), example: l('SQL para análisis de datos', 'SQL for data analysis') },
    CURRENT_LEVEL: { label: l('Nivel actual', 'Current level'), ...sel(['Desde cero', 'Básico', 'Intermedio', 'Avanzado'], ['From scratch', 'Basic', 'Intermediate', 'Advanced']) },
    WEEKS: { label: l('Semanas', 'Weeks'), example: l('8') },
    HOURS_PER_WEEK: { label: l('Horas por semana', 'Hours per week'), example: l('5') },
    DRAFT_PROMPT: { label: l('Tu prompt', 'Your prompt'), ...area(), example: l('Escribe un correo para un cliente enfadado', 'Write an email for an angry customer') },
    TARGET_MODEL: { label: l('Modelo de destino', 'Target model'), suggestions: ['ChatGPT', 'Claude', 'Gemini', 'Llama', 'Un modelo local'], example: l('Claude') },
};

export function getVarMeta(name: string): VarMeta {
    return VAR_META[name] ?? {};
}
