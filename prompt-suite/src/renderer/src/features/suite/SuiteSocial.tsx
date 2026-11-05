import { useEffect } from 'react';
import { useSessionState } from '../../hooks/useSessionState';
import { DynamicForm } from '../../components/ui/DynamicForm';
import { socialFields } from './formSchemas';
import { optionLabel } from './fieldUtils';
import { t } from '../../lib/i18n';

interface SuiteSocialProps {
    onGenerate: (prompt: string) => void;
    lang: 'es' | 'en';
    onRegisterGenerate?: (fn: () => void) => void;
    onInvalid?: (msg: string) => void;
}

type L2 = { es: string; en: string };

const HOOKS: Record<string, L2> = {
    curiosity: { es: 'Curiosity Gap: deja un vacío de información que el lector necesita llenar.', en: 'Curiosity Gap: leave an information void the reader needs to fill.' },
    story: { es: 'Story Hook: una narrativa que crea inversión emocional desde la primera línea.', en: 'Story Hook: a narrative that creates emotional investment from the first line.' },
    value: { es: 'Value-First: promete una utilidad inmediata y concreta.', en: 'Value-First: promise an immediate, concrete benefit.' },
    contrarian: { es: 'Contrarian Hook: desafía una suposición popular.', en: 'Contrarian Hook: challenge a popular assumption.' },
    emotional: { es: 'Emotional Hook: conecta con una emoción fuerte del lector.', en: 'Emotional Hook: connect with a strong emotion of the reader.' },
    hot_take: { es: 'Hot Take: una opinión fuerte y directa.', en: 'Hot Take: a strong, direct opinion.' },
};

export function SuiteSocial({ onGenerate, lang, onRegisterGenerate, onInvalid }: SuiteSocialProps) {
    const [values, setValues] = useSessionState<Record<string, any>>('suite.social', {
        platform: 'linkedin',
        topic: '',
        audience: '',
        hookType: 'curiosity',
        engagementGoal: 'comments',
        framework: 'storytelling',
        tone: 'professional',
    });

    const L = (es: string, en: string) => (lang === 'es' ? es : en);

    const handleChange = (id: string, value: any) => {
        setValues(prev => ({ ...prev, [id]: value }));
    };

    const handleGenerate = () => {
        if (!values.topic?.trim()) {
            onInvalid?.(t('validation.required', lang).replace('{{field}}', t('social.topic', lang)));
            return;
        }

        const platform = optionLabel(socialFields, 'platform', values.platform, lang);
        const goal = optionLabel(socialFields, 'engagementGoal', values.engagementGoal, lang);
        const framework = optionLabel(socialFields, 'framework', values.framework, lang);
        const tone = optionLabel(socialFields, 'tone', values.tone, lang);
        const hookName = optionLabel(socialFields, 'hookType', values.hookType, lang);
        const hook = (HOOKS[values.hookType] || HOOKS.curiosity)[lang];
        const audience = values.audience?.trim() || L('público general', 'general audience');

        const prompt = L(
            `Actúa como un **Estratega de Redes Sociales** que domina el formato nativo de **${platform}**.

### MISIÓN
Crea una publicación para **${platform}** sobre: **${values.topic.trim()}**.
- **Audiencia:** ${audience}
- **Tono:** ${tone}
- **Objetivo de interacción:** ${goal}

### ESTRUCTURA
1. **Gancho** (${hookName}): ${hook} Debe frenar el scroll en la primera línea o los primeros 3 segundos.
2. **Cuerpo:** estructúralo con el marco **${framework}** y conecta con la audiencia.
3. **Cierre (CTA):** claro y no agresivo, orientado a: ${goal}.
4. Si la plataforma lo aprovecha, añade hashtags relevantes y una idea de recurso visual.

Usa el formato y la longitud típicos de ${platform}. No inventes estadísticas ni testimonios.

IDIOMA DE SALIDA: ESPAÑOL.`,
            `Act as a **Social Media Strategist** who masters the native format of **${platform}**.

### MISSION
Create a post for **${platform}** about: **${values.topic.trim()}**.
- **Audience:** ${audience}
- **Tone:** ${tone}
- **Engagement goal:** ${goal}

### STRUCTURE
1. **Hook** (${hookName}): ${hook} It must stop the scroll on the first line or the first 3 seconds.
2. **Body:** structure it with the **${framework}** framework and connect with the audience.
3. **Close (CTA):** clear and not pushy, aimed at: ${goal}.
4. If the platform benefits from it, add relevant hashtags and a visual asset idea.

Use the typical format and length of ${platform}. Do not invent statistics or testimonials.

OUTPUT LANGUAGE: ENGLISH.`
        );

        onGenerate(prompt.trim());
    };

    useEffect(() => {
        onRegisterGenerate?.(handleGenerate);
    }, [handleGenerate, onRegisterGenerate]);

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            <DynamicForm fields={socialFields} values={values} onChange={handleChange} lang={lang} />
        </div>
    );
}
