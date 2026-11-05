import { useEffect } from 'react';
import { useSessionState } from '../../hooks/useSessionState';
import { DynamicForm } from '../../components/ui/DynamicForm';
import { genesisFields } from './formSchemas';
import { optionLabel } from './fieldUtils';
import { t } from '../../lib/i18n';

interface SuiteGenesisProps {
    onGenerate: (prompt: string) => void;
    lang: 'es' | 'en';
    onRegisterGenerate?: (fn: () => void) => void;
    onInvalid?: (msg: string) => void;
}

const DEFINITIONS: Record<string, { es: string; en: string }> = {
    scamper: { es: 'Sustituir, Combinar, Adaptar, Modificar, Poner en otro uso, Eliminar, Reordenar.', en: 'Substitute, Combine, Adapt, Modify, Put to other use, Eliminate, Rearrange.' },
    mashup: { es: 'Combinar dos conceptos o industrias opuestas para crear algo nuevo.', en: 'Combine two opposing concepts or industries to create something new.' },
    first_principles: { es: 'Descomponer el problema en verdades fundamentales y construir desde ahí.', en: 'Break the problem down to fundamental truths and build up from there.' },
    blue_ocean: { es: 'Crear un nuevo espacio de mercado donde la competencia sea irrelevante.', en: 'Create a new market space where competition is irrelevant.' },
    worst_idea: { es: 'Imaginar ideas terribles para invertirlas en soluciones brillantes.', en: 'Imagine terrible ideas to invert them into brilliant solutions.' },
    six_thinking_hats: { es: 'Analizar desde 6 perspectivas: hechos, emociones, riesgos, beneficios, creatividad, proceso.', en: 'Analyze from 6 perspectives: facts, emotions, risks, benefits, creativity, process.' },
    lateral_thinking: { es: 'Resolver problemas mediante enfoques indirectos y creativos.', en: 'Solve problems through indirect and creative approaches.' },
};

export function SuiteGenesis({ onGenerate, lang, onRegisterGenerate, onInvalid }: SuiteGenesisProps) {
    const [values, setValues] = useSessionState<Record<string, any>>('suite.genesis', {
        objective: '',
        technique: 'scamper',
        audience: 'general',
        context: '',
        num_ideas: '5',
    });

    const L = (es: string, en: string) => (lang === 'es' ? es : en);

    const handleGenerate = () => {
        if (!values.objective?.trim()) {
            onInvalid?.(t('validation.required', lang).replace('{{field}}', t('genesis.objective', lang)));
            return;
        }

        const n = values.num_ideas || '5';
        const technique = optionLabel(genesisFields, 'technique', values.technique, lang);
        const definition = (DEFINITIONS[values.technique] || DEFINITIONS.scamper)[lang];
        const audience = optionLabel(genesisFields, 'audience', values.audience, lang);
        const context = values.context?.trim();

        const prompt = L(
            `### ROL
Actúa como un **Consultor de Innovación y Estratega Creativo**.

### CONTEXTO
Sesión de brainstorming para: **${values.objective.trim()}**.${context ? `\n${context}` : ''}

### TAREA
Aplica la técnica **${technique}** para generar ${n} conceptos accionables.
Definición de la técnica: ${definition}

### RESTRICCIONES
- **Público objetivo:** ${audience}
- Evita las ideas genéricas: cada concepto debe ser concreto y distinto de los demás.

### FORMATO DE SALIDA
1. **Divergencia (${n} conceptos):** una línea por idea, aplicando la técnica.
2. **Convergencia:** elige el concepto con más probabilidad de éxito y justifícalo.
3. **One-pager del concepto elegido:** nombre, elevator pitch (1 frase), por qué destaca y primeros 3 pasos para prototiparlo.

IDIOMA DE SALIDA: ESPAÑOL.`,
            `### ROLE
Act as an **Innovation Consultant & Creative Strategist**.

### CONTEXT
Brainstorming session for: **${values.objective.trim()}**.${context ? `\n${context}` : ''}

### TASK
Apply the **${technique}** technique to generate ${n} actionable concepts.
Technique definition: ${definition}

### CONSTRAINTS
- **Target audience:** ${audience}
- Avoid generic ideas: each concept must be concrete and distinct from the others.

### OUTPUT FORMAT
1. **Divergence (${n} concepts):** one line per idea, applying the technique.
2. **Convergence:** pick the concept most likely to succeed and justify it.
3. **One-pager for the chosen concept:** name, elevator pitch (1 sentence), why it stands out, and the first 3 steps to prototype it.

OUTPUT LANGUAGE: ENGLISH.`
        );

        onGenerate(prompt.trim());
    };

    useEffect(() => {
        onRegisterGenerate?.(handleGenerate);
    }, [handleGenerate, onRegisterGenerate]);

    const handleChange = (id: string, value: any) => {
        setValues(prev => ({ ...prev, [id]: value }));
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            <DynamicForm fields={genesisFields} values={values} onChange={handleChange} lang={lang} />

            {values.objective?.trim() && (
                <div className="rounded-md bg-amber-900/10 border border-amber-800/30 p-3 text-xs text-amber-200/70 leading-relaxed">
                    <strong>{t('genesis.hint.technique', lang)}</strong> {DEFINITIONS[values.technique]?.[lang]}
                </div>
            )}
        </div>
    );
}
