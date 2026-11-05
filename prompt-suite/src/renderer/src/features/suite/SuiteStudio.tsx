import { useEffect } from 'react';
import { useSessionState } from '../../hooks/useSessionState';
import { DynamicForm } from '../../components/ui/DynamicForm';
import { studioFields } from './formSchemas';
import { optionLabel } from './fieldUtils';
import { t } from '../../lib/i18n';

interface SuiteStudioProps {
    onGenerate: (prompt: string) => void;
    lang: 'es' | 'en';
    onRegisterGenerate?: (fn: () => void) => void;
    onInvalid?: (msg: string) => void;
}

type L2 = { es: string; en: string };

// Cada perfil define quién escribe y con qué voz (sustituye al antiguo campo "Tono").
const PROFILES: Record<string, { role: L2; voice: L2 }> = {
    expert: { role: { es: 'Experto en la Materia', en: 'Subject Matter Expert' }, voice: { es: 'técnico, denso y preciso', en: 'technical, dense and precise' } },
    student: { role: { es: 'Mentor Académico Riguroso', en: 'Rigorous Academic Mentor' }, voice: { es: 'didáctico, estructurado y crítico; cita principios teóricos y fomenta el pensamiento crítico', en: 'didactic, structured and critical; cite theoretical principles and foster critical thinking' } },
    creative: { role: { es: 'Director de Arte / Visionario', en: 'Art Director / Visionary' }, voice: { es: 'conceptual, estético y evocador', en: 'conceptual, aesthetic and evocative' } },
    executive: { role: { es: 'Consultor de Estrategia', en: 'Strategy Consultant' }, voice: { es: 'ejecutivo, conciso y orientado al ROI', en: 'executive, concise and ROI-oriented' } },
    beginner: { role: { es: 'Tutor Paciente', en: 'Patient Tutor' }, voice: { es: 'simple y amigable; explica desde cero con analogías y sin jerga', en: 'simple and friendly; explain from scratch with analogies and no jargon' } },
    developer: { role: { es: 'Senior Engineer / Tech Lead', en: 'Senior Engineer / Tech Lead' }, voice: { es: 'técnico y práctico, con ejemplos de código', en: 'technical and practical, with code examples' } },
};

// Cada marco indica CÓMO razonar y hasta dónde detallar (no es solo una etiqueta).
const FRAMES: Record<string, L2> = {
    first_principles: {
        es: 'Descompón el tema en sus verdades fundamentales y reconstruye la explicación desde ahí, sin dar nada por supuesto. Detalle alto en los fundamentos; omite lo accesorio.',
        en: 'Break the topic down into its fundamental truths and rebuild the explanation from there, assuming nothing. High detail on fundamentals; skip the incidental.',
    },
    feynman: {
        es: 'Explica como a alguien que parte de cero: lenguaje simple, una idea por párrafo y analogías cotidianas. Detecta y rellena los huecos de comprensión; cierra con un resumen en 3 frases.',
        en: 'Explain as if to someone starting from zero: simple language, one idea per paragraph and everyday analogies. Spot and fill comprehension gaps; close with a 3-sentence recap.',
    },
    critical_thinking: {
        es: 'Examina las afirmaciones con rigor: presenta evidencias y contraargumentos, señala supuestos y sesgos, y distingue hechos de opiniones. Profundidad alta en el análisis; termina con una conclusión matizada.',
        en: 'Examine claims rigorously: present evidence and counterarguments, flag assumptions and biases, and separate facts from opinions. High depth in the analysis; end with a nuanced conclusion.',
    },
    pareto: {
        es: 'Aplica el principio 80/20: identifica el 20 % de ideas que aporta el 80 % del valor y desarróllalo a fondo. Resume brevemente el resto y prioriza acciones por impacto.',
        en: 'Apply the 80/20 principle: identify the 20% of ideas that deliver 80% of the value and develop them in depth. Summarize the rest briefly and prioritize actions by impact.',
    },
    analogy: {
        es: 'Explica mediante analogías y comparaciones con otros dominios, indicando en cada caso dónde la analogía funciona y dónde deja de hacerlo. Detalle medio, con ejemplos memorables.',
        en: 'Explain through analogies and comparisons with other domains, stating in each case where the analogy holds and where it breaks. Medium detail, with memorable examples.',
    },
    systems_thinking: {
        es: 'Mapea los componentes, sus relaciones, bucles de retroalimentación y efectos de segundo orden. Detalle alto en las interacciones; incluye un resumen del sistema completo.',
        en: 'Map the components, their relationships, feedback loops and second-order effects. High detail on the interactions; include an overview of the whole system.',
    },
};

const WORDS: Record<string, L2> = {
    short: { es: '500-800 palabras', en: '500-800 words' },
    medium: { es: '1000-2000 palabras', en: '1000-2000 words' },
    long: { es: '2000-5000 palabras', en: '2000-5000 words' },
};

export function SuiteStudio({ onGenerate, lang, onRegisterGenerate, onInvalid }: SuiteStudioProps) {
    const [values, setValues] = useSessionState<Record<string, any>>('suite.studio', {
        topic: '',
        profile: 'expert',
        frame: 'first_principles',
        format: 'report',
        wordCount: 'medium',
        seoKeywords: [],
        ctaGoal: 'none',
    });

    const L = (es: string, en: string) => (lang === 'es' ? es : en);

    const handleChange = (id: string, value: any) => {
        setValues(prev => ({ ...prev, [id]: value }));
    };

    const handleGenerate = () => {
        if (!values.topic?.trim()) {
            onInvalid?.(t('validation.required', lang).replace('{{field}}', t('studio.topic', lang)));
            return;
        }

        const profile = PROFILES[values.profile] || PROFILES.expert;
        const format = optionLabel(studioFields, 'format', values.format, lang);
        const frameName = optionLabel(studioFields, 'frame', values.frame, lang);
        const frame = (FRAMES[values.frame] || FRAMES.first_principles)[lang];
        const words = (WORDS[values.wordCount] || WORDS.medium)[lang];
        const keywords: string[] = Array.isArray(values.seoKeywords) ? values.seoKeywords : [];
        const hasCta = values.ctaGoal && values.ctaGoal !== 'none';
        const cta = hasCta ? optionLabel(studioFields, 'ctaGoal', values.ctaGoal, lang) : '';

        const prompt = L(
            `### ROL
Actúa como **${profile.role.es}**.

### TAREA
Escribe un contenido en formato **${format}** sobre: **${values.topic.trim()}**.
Extensión objetivo: ${words}.

### ESTILO
- **Voz:** ${profile.voice.es}.
- **Marco mental (${frameName}):** ${frame}
- Prioriza la profundidad sobre la amplitud y evita explicaciones superficiales.
- No inventes datos, cifras ni citas: si necesitas una fuente, márcalo como [FALTA: fuente].
${keywords.length ? `\n### SEO\nIncluye de forma natural estas keywords: ${keywords.join(', ')}.\n` : ''}${hasCta ? `\n### LLAMADA A LA ACCIÓN\nCierra con un CTA claro y persuasivo orientado a: ${cta}.\n` : ''}
### FORMATO DE SALIDA
Markdown estructurado, adecuado para un(a) ${format}.

IDIOMA DE SALIDA: ESPAÑOL.`,
            `### ROLE
Act as **${profile.role.en}**.

### TASK
Write content in **${format}** format about: **${values.topic.trim()}**.
Target length: ${words}.

### STYLE
- **Voice:** ${profile.voice.en}.
- **Mental framework (${frameName}):** ${frame}
- Prioritize depth over breadth and avoid superficial explanations.
- Do not invent data, figures or quotes: if you need a source, mark it as [MISSING: source].
${keywords.length ? `\n### SEO\nNaturally include these keywords: ${keywords.join(', ')}.\n` : ''}${hasCta ? `\n### CALL TO ACTION\nClose with a clear, persuasive CTA aimed at: ${cta}.\n` : ''}
### OUTPUT FORMAT
Structured Markdown, suitable for a ${format}.

OUTPUT LANGUAGE: ENGLISH.`
        );

        onGenerate(prompt.trim());
    };

    useEffect(() => {
        onRegisterGenerate?.(handleGenerate);
    }, [handleGenerate, onRegisterGenerate]);

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            <DynamicForm fields={studioFields} values={values} onChange={handleChange} lang={lang} />

            <div className="bg-purple-900/20 border border-purple-500/30 rounded-md p-3">
                <p className="text-xs text-purple-400">{t('studio.tip', lang)}</p>
            </div>
        </div>
    );
}
