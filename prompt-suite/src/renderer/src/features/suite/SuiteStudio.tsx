import { useState, useEffect } from 'react';
import { DynamicForm } from '../../components/ui/DynamicForm';
import { studioFields } from './formSchemas';
import { t } from '../../lib/i18n';
import { BookOpen } from 'lucide-react';

interface SuiteStudioProps {
    onGenerate: (prompt: string) => void;
    lang: 'es' | 'en';
    onRegisterGenerate?: (fn: () => void) => void;
}

export function SuiteStudio({ onGenerate, lang, onRegisterGenerate }: SuiteStudioProps) {
    const [values, setValues] = useState<Record<string, any>>({
        topic: '',
        profile: 'expert',
        funnelStage: 'awareness',
        contentPillar: '',
        frame: 'first_principles',
        format: 'report',
        wordCount: 'medium',
        seoKeywords: [],
        ctaGoal: 'none',
        tone: 'professional',
        includeData: true,
        repurposing: [],
        structuredOutput: false,
    });

    const handleChange = (id: string, value: any) => {
        setValues(prev => ({ ...prev, [id]: value }));
    };

    const handleGenerate = () => {
        if (!values.topic?.trim()) return;

        const profileLabels: Record<string, { role: { es: string; en: string }; tone: { es: string; en: string } }> = {
            expert: { role: { es: 'Experto en la Materia (SME)', en: 'Subject Matter Expert (SME)' }, tone: { es: 'Técnico, denso y preciso', en: 'Technical, dense, and precise' } },
            student: { role: { es: 'Mentor Académico Riguroso', en: 'Rigorous Academic Mentor' }, tone: { es: 'Didáctico, estructurado y crítico (Nivel Universitario)', en: 'Didactic, structured, and critical (University Level)' } },
            creative: { role: { es: 'Director de Arte / Visionario', en: 'Art Director / Visionary' }, tone: { es: 'Conceptual, estético y metafórico', en: 'Conceptual, aesthetic, and metaphorical' } },
            executive: { role: { es: 'Consultor de Estrategia', en: 'Strategy Consultant' }, tone: { es: 'Ejecutivo, conciso y orientado al ROI', en: 'Executive, concise, and ROI-oriented' } },
            beginner: { role: { es: 'Tutor Paciente y Accesible', en: 'Patient and Accessible Tutor' }, tone: { es: 'Simple, amigable, sin jerga', en: 'Simple, friendly, no jargon' } },
            developer: { role: { es: 'Senior Engineer / Tech Lead', en: 'Senior Engineer / Tech Lead' }, tone: { es: 'Técnico, práctico, con ejemplos de código', en: 'Technical, practical, with code examples' } },
        };

        const funnelLabels: Record<string, { es: string; en: string }> = {
            awareness: { es: 'TOFU - Conciencia (atraer audiencia nueva)', en: 'TOFU - Awareness (attract new audience)' },
            consideration: { es: 'MOFU - Consideración (educar y nutrir)', en: 'MOFU - Consideration (educate and nurture)' },
            decision: { es: 'BOFU - Decisión (convertir)', en: 'BOFU - Decision (convert)' },
            retention: { es: 'Retención (fidelizar)', en: 'Retention (retain)' },
        };

        const wordCountLabels: Record<string, { es: string; en: string }> = {
            short: { es: '500-800 palabras', en: '500-800 words' },
            medium: { es: '1000-2000 palabras', en: '1000-2000 words' },
            long: { es: '2000-5000 palabras', en: '2000-5000 words' },
            custom: { es: 'Personalizado', en: 'Custom' },
        };

        const ctaLabels: Record<string, { es: string; en: string }> = {
            none: { es: 'Sin CTA', en: 'No CTA' },
            newsletter: { es: 'Newsletter Signup', en: 'Newsletter Signup' },
            demo: { es: 'Product Demo', en: 'Product Demo' },
            download: { es: 'Download / Lead Magnet', en: 'Download / Lead Magnet' },
            share: { es: 'Share / Repost', en: 'Share / Repost' },
            purchase: { es: 'Purchase / Subscribe', en: 'Purchase / Subscribe' },
        };

        const prof = profileLabels[values.profile] || profileLabels.expert;
        const funnel = funnelLabels[values.funnelStage] || funnelLabels.awareness;
        const wc = wordCountLabels[values.wordCount] || wordCountLabels.medium;
        const cta = ctaLabels[values.ctaGoal] || ctaLabels.none;

        let extraInstruction = '';
        if (lang === 'es') {
            if (values.profile === 'student') {
                extraInstruction = "Usa un enfoque académico riguroso. Cita principios teóricos, evita simplificaciones excesivas y fomenta el pensamiento crítico.";
            } else if (values.profile === 'creative') {
                extraInstruction = "Enfócate en la narrativa, la estética y la innovación conceptual. Usa lenguaje evocador.";
            } else if (values.profile === 'beginner') {
                extraInstruction = "Explica todo desde cero. Usa analogías simples. Evita jerga técnica o explícala cuando sea necesaria.";
            }
        } else {
            if (values.profile === 'student') {
                extraInstruction = "Use a rigorous academic approach. Cite theoretical principles, avoid oversimplification, and foster critical thinking.";
            } else if (values.profile === 'creative') {
                extraInstruction = "Focus on narrative, aesthetics, and conceptual innovation. Use evocative language.";
            } else if (values.profile === 'beginner') {
                extraInstruction = "Explain everything from scratch. Use simple analogies. Avoid technical jargon or explain it when necessary.";
            }
        }

        let seoSection = '';
        if (values.seoKeywords && values.seoKeywords.length > 0) {
            const keywords = values.seoKeywords.join(', ');
            seoSection = lang === 'es'
                ? `\n### SEO KEYWORDS\nIncluye naturalmente estas keywords en el contenido: ${keywords}.`
                : `\n### SEO KEYWORDS\nNaturally include these keywords in the content: ${keywords}.`;
        }

        let ctaSection = '';
        if (values.ctaGoal !== 'none') {
            ctaSection = lang === 'es'
                ? `\n### CALL TO ACTION\nEl objetivo del CTA es: ${cta.es}. Incluye un CTA claro y persuasivo al final del contenido.`
                : `\n### CALL TO ACTION\nThe CTA goal is: ${cta.en}. Include a clear, persuasive CTA at the end of the content.`;
        }

        let dataSection = '';
        if (values.includeData) {
            dataSection = lang === 'es'
                ? `\n### DATOS Y ESTADÍSTICAS\nIncluye estadísticas, datos de soporte y referencias a fuentes confiables donde sea relevante.`
                : `\n### DATA AND STATISTICS\nInclude statistics, supporting data, and references to credible sources where relevant.`;
        }

        let repurposingSection = '';
        if (values.repurposing && values.repurposing.length > 0) {
            const versions = values.repurposing.map((v: string) => {
                const labels: Record<string, string> = {
                    linkedin: 'LinkedIn Post',
                    twitter_thread: 'Twitter Thread',
                    email: 'Email Newsletter',
                    instagram_carousel: 'Instagram Carousel',
                    tiktok_script: 'TikTok/Reel Script',
                };
                return labels[v] || v;
            }).join(', ');
            repurposingSection = lang === 'es'
                ? `\n### REPURPOSING\nDespués del contenido principal, genera versiones adaptadas para: ${versions}.`
                : `\n### REPURPOSING\nAfter the main content, generate adapted versions for: ${versions}.`;
        }

        if (lang === 'es') {
            const prompt = `### ROL
Actúa como **${prof.role.es}**.

### CONTEXTO
Tema: "**${values.topic.trim()}**"
Perfil de Audiencia: **${t(`studio.prof.${values.profile}` as any, 'es').toUpperCase()}**
Etapa del Funnel: **${funnel.es}**
Marco Mental: **${t(`studio.frame.${values.frame}` as any, 'es').toUpperCase()}**
Pilar de Contenido: **${values.contentPillar || 'No especificado'}**
${seoSection}${dataSection}${ctaSection}${repurposingSection}

### TAREA
Genera contenido en formato **${t(`studio.fmt.${values.format}` as any, 'es').toUpperCase()}** que sea intelectualmente riguroso y atractivo.
Extensión objetivo: ${wc.es}.

### RESTRICCIONES Y ESTÁNDARES
- **Tono:** ${values.tone}.
- **Instrucción Especial:** ${extraInstruction}
- **Profundidad:** Prioriza la profundidad sobre la amplitud. Evita explicaciones superficiales.
- **Precisión:** Cero alucinaciones. Cita principios o lógica donde aplique.
- **Funnel Stage:** El contenido debe estar optimizado para ${funnel.es}.
${values.structuredOutput ? '- **Formato:** Devuelve el contenido como JSON estructurado con campos: title, sections[], metadata{}, cta.' : ''}
IDIOMA DE SALIDA: ESPAÑOL.

### FORMATO DE SALIDA
Proporciona el contenido en formato markdown estructurado para un **${t(`studio.fmt.${values.format}` as any, 'es')}**.`.trim();

            onGenerate(prompt);
        } else {
            const prompt = `### ROLE
Act as **${prof.role.en}**.

### CONTEXT
Topic: "**${values.topic.trim()}**"
Target Audience Profile: **${t(`studio.prof.${values.profile}` as any, 'en').toUpperCase()}**
Funnel Stage: **${funnel.en}**
Mental Framework: **${t(`studio.frame.${values.frame}` as any, 'en').toUpperCase()}**
Content Pillar: **${values.contentPillar || 'Not specified'}**
${seoSection}${dataSection}${ctaSection}${repurposingSection}

### TASK
Generate **${t(`studio.fmt.${values.format}` as any, 'en').toUpperCase()}** content that is intellectually rigorous and engaging.
Target length: ${wc.en}.

### CONSTRAINTS & QUALITY STANDARDS
- **Tone:** ${values.tone}.
- **Instruction:** ${extraInstruction}
- **Depth:** Prioritize depth over breadth. Avoid superficial explanations.
- **Accuracy:** Zero hallucinations. Cite principles or logic where applicable.
- **Funnel Stage:** Content should be optimized for ${funnel.en}.
${values.structuredOutput ? '- **Format:** Return the content as structured JSON with fields: title, sections[], metadata{}, cta.' : ''}
OUTPUT LANGUAGE: ENGLISH.

### OUTPUT FORMAT
Provide the content in a structured markdown format suitable for a **${t(`studio.fmt.${values.format}` as any, 'en')}**.`.trim();

            onGenerate(prompt);
        }
    };

    useEffect(() => {
        onRegisterGenerate?.(handleGenerate);
    }, [handleGenerate, onRegisterGenerate]);

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            <DynamicForm
                fields={studioFields}
                values={values}
                onChange={handleChange}
                lang={lang}
            />

            <div className="bg-purple-900/20 border border-purple-500/30 rounded-md p-3">
                <p className="text-xs text-purple-400">
                    {t('studio.tip', lang)}
                </p>
            </div>
        </div>
    );
}
