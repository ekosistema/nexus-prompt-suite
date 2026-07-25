import { useState, useEffect } from 'react';
import { DynamicForm } from '../../components/ui/DynamicForm';
import { genesisFields } from './formSchemas';
import { t } from '../../lib/i18n';
import { Lightbulb } from 'lucide-react';

interface SuiteGenesisProps {
    onGenerate: (prompt: string) => void;
    lang: 'es' | 'en';
    onRegisterGenerate?: (fn: () => void) => void;
}

export function SuiteGenesis({ onGenerate, lang, onRegisterGenerate }: SuiteGenesisProps) {
    const [values, setValues] = useState<Record<string, any>>({
        objective: '',
        technique: 'scamper',
        audience: 'general',
        restriction: '',
        context: '',
        prompting_mode: 'direct',
        output_format: 'markdown',
        tone: 50,
        num_ideas: '5',
        few_shot: '',
        chain_mode: false,
    });

    const DEFINITIONS: Record<string, { es: string; en: string }> = {
        scamper: { es: "Sustituir, Combinar, Adaptar, Modificar, Poner en otro uso, Eliminar, Reordenar.", en: "Substitute, Combine, Adapt, Modify, Put to other use, Eliminate, Rearrange." },
        mashup: { es: "Combinar dos conceptos o industrias opuestas para crear algo nuevo.", en: "Combine two opposing concepts or industries to create something new." },
        first_principles: { es: "Descomponer el problema en verdades fundamentales y construir desde ahí.", en: "Break the problem down to fundamental truths and build up from there." },
        blue_ocean: { es: "Crear un nuevo espacio de mercado donde la competencia sea irrelevante.", en: "Create a new market space where competition is irrelevant." },
        worst_idea: { es: "Imaginar ideas terribles para invertirlas en soluciones brillantes.", en: "Imagine terrible ideas to invert them into brilliant solutions." },
        six_thinking_hats: { es: "Analizar desde 6 perspectivas: hechos, emociones, riesgos, beneficios, creatividad, proceso.", en: "Analyze from 6 perspectives: facts, emotions, risks, benefits, creativity, process." },
        lateral_thinking: { es: "Resolver problemas mediante enfoques indirectos y creativos.", en: "Solve problems through indirect and creative approaches." },
    };

    const PROMPTING_MODES: Record<string, { es: string; en: string }> = {
        direct: { es: "", en: "" },
        cot: { es: "\n### REASONING\nPiensa paso a paso. Explica tu razonamiento antes de dar la respuesta final.", en: "\n### REASONING\nThink step by step. Explain your reasoning before giving the final answer." },
        zero_shot_cot: { es: "\n### REASONING\nPiensa paso a paso.", en: "\n### REASONING\nLet's think step by step." },
        tree_of_thought: { es: "\n### REASONING\nExplora al menos 3 caminos de pensamiento diferentes. Evalúa cada uno y selecciona el mejor.", en: "\n### REASONING\nExplore at least 3 different thought paths. Evaluate each and select the best one." },
    };

    const getToneDescription = (tone: number): string => {
        if (tone <= 20) return lang === 'es' ? 'Técnico, preciso, formal' : 'Technical, precise, formal';
        if (tone <= 40) return lang === 'es' ? 'Profesional con toques creativos' : 'Professional with creative touches';
        if (tone <= 60) return lang === 'es' ? 'Balance entre técnica y creatividad' : 'Balance between technique and creativity';
        if (tone <= 80) return lang === 'es' ? 'Creativo con base técnica' : 'Creative with technical foundation';
        return lang === 'es' ? 'Altamente creativo, visionario, metafórico' : 'Highly creative, visionary, metaphorical';
    };

    const handleGenerate = () => {
        if (!values.objective?.trim()) return;

        const def = DEFINITIONS[values.technique] || DEFINITIONS.scamper;
        const mode = PROMPTING_MODES[values.prompting_mode] || PROMPTING_MODES.direct;
        const numIdeas = values.num_ideas || '5';

        const toneDesc = getToneDescription(values.tone);
        const outputFormat = values.output_format === 'json' ? 'JSON' :
            values.output_format === 'table' ? 'Markdown table' :
                values.output_format === 'list' ? 'Bullet list' :
                    values.output_format === 'yaml' ? 'YAML' : 'Structured Markdown';

        let fewShotSection = '';
        if (values.few_shot?.trim()) {
            fewShotSection = lang === 'es'
                ? `\n### EJEMPLOS (Few-Shot)\n${values.few_shot}`
                : `\n### EXAMPLES (Few-Shot)\n${values.few_shot}`;
        }

        let contextSection = '';
        if (values.context?.trim()) {
            contextSection = lang === 'es'
                ? `\n### CONTEXTO ADICIONAL\n${values.context}`
                : `\n### ADDITIONAL CONTEXT\n${values.context}`;
        }

        let chainSection = '';
        if (values.chain_mode) {
            chainSection = lang === 'es'
                ? `\n### MODO CADENA\nGenera la respuesta en 3 fases:\n1. **Ideación**: Genera ${numIdeas} conceptos usando la técnica.\n2. **Evaluación**: Evalúa cada concepto con criterios de viabilidad, impacto y originalidad.\n3. **Plan de Acción**: Para el concepto ganador, crea un plan de ejecución con los primeros 5 pasos.`
                : `\n### CHAIN MODE\nGenerate the response in 3 phases:\n1. **Ideation**: Generate ${numIdeas} concepts using the technique.\n2. **Evaluation**: Evaluate each concept on feasibility, impact, and originality.\n3. **Action Plan**: For the winning concept, create an execution plan with the first 5 steps.`;
        }

        if (lang === 'es') {
            const prompt = `### ROL
Actúa como un **Consultor de Innovación Radical y Estratega Creativo**.

### CONTEXTO
Estamos en una sesión de brainstorming para: **${values.objective}**.
El objetivo es generar ideas disruptivas que desafíen el status quo.
${contextSection}

### TAREA
Aplica la técnica **${values.technique.toUpperCase().replace(/_/g, ' ')}** para generar ${numIdeas} conceptos accionables.
Definición: ${def.es}
${mode.es}

### RESTRICCIONES
- **Público Objetivo:** ${values.audience}
- **Restricción:** ${values.restriction || "Ninguna"}
- **Tono:** ${toneDesc}
- **Reglas:** Nada de ideas genéricas. Piensa lateralmente.
- **Formato de Salida:** ${outputFormat}
- **Número de Ideas:** ${numIdeas}
${fewShotSection}${chainSection}
IDIOMA DE SALIDA: ESPAÑOL.

### FORMATO DE SALIDA
1. **Fase de Divergencia (${numIdeas} Conceptos):** Ideas breves y rápidas aplicando la técnica.
2. **Convergencia (El Diamante):** Selecciona la idea con mayor probabilidad de éxito.
3. **Concepto "One-Pager":**
    - **Nombre del Producto/Obra**
    - **Elevator Pitch** (1 frase)
    - **El Factor "Wow"** (¿Por qué detiene el scroll?)
    - **Ruta de Ejecución** (Primeros 3 pasos para prototipar)`.trim();

            onGenerate(prompt);
        } else {
            const prompt = `### ROLE
Act as a **Radical Innovation Consultant & Creative Strategist**.

### CONTEXT
We are in a brainstorming session for: **${values.objective}**.
The goal is to generate disruptive ideas that challenge the status quo.
${contextSection}

### TASK
Apply the **${values.technique.toUpperCase().replace(/_/g, ' ')}** technique to generate ${numIdeas} actionable concepts.
Definition: ${def.en}
${mode.en}

### CONSTRAINTS
- **Target Audience:** ${values.audience}
- **Restriction:** ${values.restriction || "None"}
- **Tone:** ${toneDesc}
- **Rules:** No generic ideas. Think laterally.
- **Output Format:** ${outputFormat}
- **Number of Ideas:** ${numIdeas}
${fewShotSection}${chainSection}
OUTPUT LANGUAGE: ENGLISH.

### OUTPUT FORMAT
1. **Divergence Phase (${numIdeas} Concepts):** Brief, rapid-fire ideas applying the technique.
2. **Convergence (The Diamond):** Select the single most promising concept.
3. **Concept "One-Pager":**
    - **Product/Work Name**
    - **Elevator Pitch** (1 sentence)
    - **The "Wow" Factor** (Why it stops the scroll?)
    - **Execution Path** (First 3 steps to prototype)`.trim();

            onGenerate(prompt);
        }
    };

    useEffect(() => {
        onRegisterGenerate?.(handleGenerate);
    }, [handleGenerate, onRegisterGenerate]);

    const handleChange = (id: string, value: any) => {
        setValues(prev => ({ ...prev, [id]: value }));
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            <DynamicForm
                fields={genesisFields}
                values={values}
                onChange={handleChange}
                lang={lang}
            />

            {values.objective?.trim() && (
                <div className="rounded-md bg-amber-900/10 border border-amber-800/30 p-3 text-xs text-amber-200/70 leading-relaxed">
                    <strong>Técnica:</strong> {DEFINITIONS[values.technique]?.[lang]}
                    <br />
                    <strong>Tono:</strong> {getToneDescription(values.tone)}
                </div>
            )}
        </div>
    );
}
