export interface Format {
    id: string;
    name: string;
    role: string;
    structure: string;
}

export interface Mood {
    label: string;
    text: string;
}

export interface CategoryData {
    color: string;
    formats: Format[];
    moods: Mood[];
}

export type CategoryKey = 'multimedia' | 'notebook' | 'dev';

export const DB: Record<CategoryKey, CategoryData> = {
    multimedia: {
        color: '#db2777', // Pink-600
        formats: [
            { id: 'gen_art', name: 'Arte Generativo (p5.js / Processing)', role: 'Creative Technologist', structure: 'Crea un sketch artístico con estas características:\n- Tema: [TEMA]\n- Estilo: [MOOD_VISUAL]\n- Técnicas: Sistemas de partículas, ruido Perlin, shaders GLSL.\n- Comentarios: Explica la matemática detrás del efecto.' },
            { id: 'shader', name: 'Shader GLSL / Visuales Reactivos', role: 'Graphics Programmer', structure: 'Escribe un fragment shader (GLSL) para:\n- Efecto: [TEMA]\n- Vibe: [MOOD_VISUAL]\n- Input: Uniforms de tiempo y resolución.\n- Optimización: Código eficiente para render en tiempo real.' },
            { id: 'td_patch', name: 'TouchDesigner / MaxMSP Patch', role: 'Interactive Media Artist', structure: 'Describe un sistema de nudos/parches para:\n- Objetivo: [TEMA]\n- Flujo de datos: CHOPs/TOPs para audio-reactividad.\n- Estilo: [MOOD_VISUAL].\n- Hardware: Inputs MIDI/OSC.' },
            { id: 'im_filter', name: 'Filtro AR (Spark AR / Lens Studio)', role: 'AR Developer', structure: 'Diseña un filtro de Realidad Aumentada:\n- Concepto: [TEMA]\n- Interacción: Tap to change, face tracker.\n- Assets: Modelos 3D low-poly estilo [MOOD_VISUAL].\n- Scripting: Lógica JS para animación.' }
        ],
        moods: [
            { label: 'Cyberpunk', text: 'Neon, Glitch, High Contrast, Dark, Futuristic' },
            { label: 'Organic', text: 'Nature, Soft, Flowing, Fractals, Biomimicry' },
            { label: 'Minimal', text: 'Clean, Geometric, Black & White, Bauhaus, Structured' },
            { label: 'Chaos', text: 'Noise, Distortion, Randomness, Entropy, Glitch Art' }
        ]
    },
    notebook: {
        color: '#10b981', // Emerald-500
        formats: [
            { id: 'podcast', name: 'Guion Podcast (NotebookLM Style)', role: 'Host de Podcast Profesional', structure: 'Genera un guion de conversación natural entre dos hosts (Host A y Host B):\n- Tema: [TEMA]\n- Objetivo: [MOOD_HOOK]\n- Estilo: Conversacional, interrumpido, dinámico, "Aha! moments".\n- Estructura: Intro enganchante -> Deep Dive -> Analogía clave -> Cierre reflexivo.' },
            { id: 'summary', name: 'Resumen Ejecutivo', role: 'Analista Senior', structure: 'Crea un resumen de alto nivel para ejecutivos:\n- Tema: [TEMA]\n- Tono: [MOOD_TONE]\n- Formato: Bullet points, Negritas en insights clave, Next Steps accionables.' },
            { id: 'explainer', name: 'Explicación "Like me 5"', role: 'Divulgador Científico', structure: 'Explica este concepto complejo de forma simple:\n- Concepto: [TEMA]\n- Analogía Principal: [MOOD_CODE] (Usa una metáfora cotidiana).\n- Tono: Curioso, accesible, divertido.\n- Resultado: Que un niño pueda entenderlo.' },
            { id: 'debate', name: 'Debate Contradictorio', role: 'Moderador de Debate', structure: 'Simula un debate entre dos puntos de vista opuestos sobre:\n- Tópico: [TEMA]\n- Perspectiva A: Optimista/Pro.\n- Perspectiva B: Escéptica/Contra ([MOOD_TONE]).\n- Conclusión: Síntesis balanceada.' }
        ],
        moods: [
            { label: 'Curioso', text: 'Entusiasta, preguntas constantes, asombro, descubrimiento' },
            { label: 'Crítico', text: 'Analítico, escéptico, buscando fallos, riguroso' },
            { label: 'Inspirador', text: 'Visionario, emotivo, motivacional, "Big Picture"' },
            { label: 'Académico', text: 'Formal, cita fuentes, estructurado, denso' }
        ]
    },
    dev: {
        color: '#3b82f6', // Blue-500
        formats: [
            { id: 'arch', name: 'Diseño de Arquitectura', role: 'Software Architect', structure: 'Diseña la arquitectura para:\n- Sistema: [TEMA]\n- Patrón: [MOOD_CODE] (Microservicios, Monolito, Serverless).\n- Diagrama: Mermaid Chart o ASCII flow.\n- Stack: Sugerencia de tecnologías.' },
            { id: 'code_refactor', name: 'Refactorización & Clean Code', role: 'Senior Developer', structure: 'Analiza este snippet (asume código genérico del tema [TEMA]) y refactorízalo:\n- Objetivo: Mejorar legibilidad y performance.\n- Principios: SOLID, DRY.\n- Estilo: [MOOD_CODE].' },
            { id: 'api_design', name: 'Diseño API RESTful', role: 'Backend Lead', structure: 'Diseña los endpoints para una API de:\n- Recurso: [TEMA]\n- Estándar: OpenAPI / Swagger.\n- Seguridad: JWT, Rate Limiting.\n- Respuestas: JSON Examples.' },
            { id: 'unit_test', name: 'Test Unitarios', role: 'QA Automation Engineer', structure: 'Escribe tests unitarios para una función que gestiona [TEMA]:\n- Framework: Jest/PyTest.\n- Casos: Happy Path, Edge Cases, Error Handling.\n- Cobertura: 100% de ramas lógicas.' }
        ],
        moods: [
            { label: 'Modern', text: 'Serverless, React, Rust, Edge Computing' },
            { label: 'Enterprise', text: 'Java, Spring Boot, Robust, Scalable, ACID' },
            { label: 'Legacy', text: 'Cobol, PHP 5, Maintenance, Refactor needed' },
            { label: 'Hacker', text: 'Python Scripts, Bash, Security, Pentesting' }
        ]
    }
};
