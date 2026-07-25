import { useState, useEffect } from 'react';
import { DynamicForm } from '../../components/ui/DynamicForm';
import { socialFields } from './formSchemas';
import { t } from '../../lib/i18n';
import { Zap } from 'lucide-react';

interface SuiteSocialProps {
    onGenerate: (prompt: string) => void;
    lang: 'es' | 'en';
    onRegisterGenerate?: (fn: () => void) => void;
}

export function SuiteSocial({ onGenerate, lang, onRegisterGenerate }: SuiteSocialProps) {
    const [values, setValues] = useState<Record<string, any>>({
        platform: 'linkedin',
        topic: '',
        audience: '',
        hookType: 'curiosity',
        engagementGoal: 'comments',
        psychTrigger: 'social_proof',
        framework: 'storytelling',
        tone: 'professional',
        contentLength: 'medium',
        includeHashtags: true,
        hashtagCount: '5',
        abVariants: false,
        includeVisualBrief: true,
        seriesMode: false,
        culturalContext: 'us',
        visualStyle: 'photo',
        visualElements: '',
    });

    const handleChange = (id: string, value: any) => {
        setValues(prev => ({ ...prev, [id]: value }));
    };

    const handleGenerate = () => {
        if (!values.topic?.trim()) return;

        const hookTemplates: Record<string, { es: string; en: string }> = {
            curiosity: { es: 'Usa un Curiosity Gap: deja un vacío de información que el lector DEBE llenar. Ejemplo: "Probé [X] durante 30 días. Esto es lo que pasó."', en: 'Use a Curiosity Gap: leave an information void the reader MUST fill. Example: "I tried [X] for 30 days. Here\'s what happened."' },
            story: { es: 'Usa un Story Hook: narrativa que crea inversión emocional. Ejemplo: "Hace 3 años estaba [estado malo]. Hoy [estado bueno]."', en: 'Use a Story Hook: narrative that creates emotional investment. Example: "3 years ago I was [bad state]. Today I [good state]."' },
            value: { es: 'Usa Value-First: promete utilidad inmediata. Ejemplo: "Cómo [resultado] en [tiempo corto] (paso a paso):"', en: 'Use Value-First: promise immediate utility. Example: "How to [outcome] in [short time] (step by step):"' },
            contrarian: { es: 'Usa un Contrarian Hook: desafía suposiciones. Ejemplo: "[Opinión popular] está mal. Aquí por qué."', en: 'Use a Contrarian Hook: challenge assumptions. Example: "[Popular opinion] is wrong. Here\'s why."' },
            emotional: { es: 'Usa un Emotional Hook: conecta con una emoción fuerte. Ejemplo: "Si estás cansado de [dolor], esto es para ti."', en: 'Use an Emotional Hook: connect to a strong feeling. Example: "If you\'re tired of [pain], this is for you."' },
            hot_take: { es: 'Usa un Hot Take: opinión fuerte y directa. Ejemplo: "Opinión impopular: [postura audaz]"', en: 'Use a Hot Take: strong, direct opinion. Example: "Unpopular opinion: [bold stance]"' },
        };

        const psychLabels: Record<string, { es: string; en: string }> = {
            social_proof: { es: 'Social Proof (otros lo hacen, así que debería importarme)', en: 'Social Proof (others do it, so I should care)' },
            scarcity: { es: 'Scarcity / FOMO (lo limitado es más valioso)', en: 'Scarcity / FOMO (limited is more valuable)' },
            authority: { es: 'Authority (confío en expertos)', en: 'Authority (I trust experts)' },
            reciprocity: { es: 'Reciprocity (me diste valor, te debo)', en: 'Reciprocity (you gave value, I owe you)' },
            identity: { es: 'Identity / In-Group (somos del mismo grupo)', en: 'Identity / In-Group (we\'re the same group)' },
            loss_aversion: { es: 'Loss Aversion (perder duele más que ganar)', en: 'Loss Aversion (losing hurts more than winning)' },
        };

        const culturalLabels: Record<string, string> = {
            us: 'US / Canada',
            europe: 'Western Europe',
            latam: 'Latin America',
            east_asia: 'East Asia',
            nordics: 'Nordics',
            middle_east: 'Middle East',
        };

        const hook = hookTemplates[values.hookType] || hookTemplates.curiosity;
        const psych = psychLabels[values.psychTrigger] || psychLabels.social_proof;

        let hashtagsSection = '';
        if (values.includeHashtags) {
            hashtagsSection = lang === 'es'
                ? `\n### HASHTAGS\nIncluye ${values.hashtagCount} hashtags relevantes y optimizados para la plataforma.`
                : `\n### HASHTAGS\nInclude ${values.hashtagCount} relevant, platform-optimized hashtags.`;
        }

        let abSection = '';
        if (values.abVariants) {
            abSection = lang === 'es'
                ? `\n### VARIANTES A/B\nGenera 3 versiones diferentes del post con distintos hooks para testing A/B.`
                : `\n### A/B VARIANTS\nGenerate 3 different versions of the post with different hooks for A/B testing.`;
        }

        let visualSection = '';
        if (values.includeVisualBrief) {
            visualSection = lang === 'es'
                ? `\n### DIRECCIÓN DE ARTE\nIncluye un brief visual para la imagen/video acompañante:\n- Estilo: ${values.visualStyle}\n- Elementos clave: ${values.visualElements || values.topic}\n- Formato optimizado para ${values.platform}`
                : `\n### ART DIRECTION\nInclude a visual brief for the accompanying image/video:\n- Style: ${values.visualStyle}\n- Key elements: ${values.visualElements || values.topic}\n- Format optimized for ${values.platform}`;
        }

        let seriesSection = '';
        if (values.seriesMode) {
            seriesSection = lang === 'es'
                ? `\n### MODO SERIE\nEste es parte de una serie. Marca claramente el número (ej: 1/5, 2/5) y crea un hilo coherente.`
                : `\n### SERIES MODE\nThis is part of a series. Clearly mark the number (e.g., 1/5, 2/5) and create a coherent thread.`;
        }

        if (lang === 'es') {
            const prompt = `Actúa como un **Estratega de Marketing Digital y Director Creativo** especializado en ${values.platform}.

🚀 MISIÓN:
Crear contenido de alto impacto para **${values.platform.toUpperCase()}**.
- **Tema:** ${values.topic}
- **Audiencia:** ${values.audience || "General"}
- **Longitud:** ${values.contentLength}
- **Contexto Cultural:** ${culturalLabels[values.culturalContext] || 'US / Canada'}
${seriesSection}

🪝 HOOK (Tipo: ${values.hookType}):
${hook.es}
El hook debe detener el scroll en los primeros 1-3 segundos (video) o primera línea (texto).

🧠 PSICOLOGÍA DE PERSUASIÓN (Trigger: ${values.psychTrigger}):
${psych.es}
Aplica este trigger psicológico de forma auténtica, no manipulativa.

📐 FRAMEWORK PERSUASIVO: ${values.framework.toUpperCase()}
Usa este marco mental para estructurar el copy.

🎭 MOOD / TONO: **${values.tone}**

📝 INSTRUCCIONES DE COPYWRITING:
1. **El Hook:** Debe detener el scroll. Usa la técnica de ${values.hookType}.
2. **El Cuerpo:** Desarrolla la narrativa. Conecta con la audiencia.
3. **El CTA:** Claro pero no agresivo. Optimizado para: ${values.engagementGoal}.
4. **Tono:** ${values.tone}. Profesional pero apasionado. Autoridad creativa.
${hashtagsSection}${abSection}${visualSection}
IDIOMA DE SALIDA: ESPAÑOL.

--------------------------------------------------

🎨 DIRECCIÓN DE ARTE (Prompt para IA de Imagen):
"/imagine prompt: ${values.visualElements || values.topic} visualized as ${values.visualStyle} composition optimized for ${values.platform}. High contrast, emotional impact. --v 6.0"`.trim();

            onGenerate(prompt);
        } else {
            const prompt = `Act as a **Digital Marketing Strategist & Creative Director** specializing in ${values.platform}.

🚀 MISSION:
Create high-impact content for **${values.platform.toUpperCase()}**.
- **Topic:** ${values.topic}
- **Audience:** ${values.audience || "General"}
- **Length:** ${values.contentLength}
- **Cultural Context:** ${culturalLabels[values.culturalContext] || 'US / Canada'}
${seriesSection}

🪝 HOOK (Type: ${values.hookType}):
${hook.en}
The hook must stop the scroll in the first 1-3 seconds (video) or first line (text).

🧠 PERSUASION PSYCHOLOGY (Trigger: ${values.psychTrigger}):
${psych.en}
Apply this psychological trigger authentically, not manipulatively.

📐 PERSUASIVE FRAMEWORK: ${values.framework.toUpperCase()}
Use this mental framework to structure the copy.

🎭 MOOD / TONE: **${values.tone}**

📝 COPYWRITING INSTRUCTIONS:
1. **The Hook:** Must stop the scroll. Use the ${values.hookType} technique.
2. **The Body:** Develop the narrative. Connect with the audience.
3. **The CTA:** Clear but not aggressive. Optimized for: ${values.engagementGoal}.
4. **Tone:** ${values.tone}. Professional yet passionate. Creative authority.
${hashtagsSection}${abSection}${visualSection}
OUTPUT LANGUAGE: ENGLISH.

--------------------------------------------------

🎨 ART DIRECTION (AI Image Prompt):
"/imagine prompt: ${values.visualElements || values.topic} visualized as ${values.visualStyle} composition optimized for ${values.platform}. High contrast, emotional impact. --v 6.0"`.trim();

            onGenerate(prompt);
        }
    };

    useEffect(() => {
        onRegisterGenerate?.(handleGenerate);
    }, [handleGenerate, onRegisterGenerate]);

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            <DynamicForm
                fields={socialFields}
                values={values}
                onChange={handleChange}
                lang={lang}
            />
        </div>
    );
}
