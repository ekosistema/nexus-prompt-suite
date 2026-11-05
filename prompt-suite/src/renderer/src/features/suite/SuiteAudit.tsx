import { useEffect } from 'react';
import { useSessionState } from '../../hooks/useSessionState';
import { DynamicForm } from '../../components/ui/DynamicForm';
import { auditFields } from './formSchemas';
import { optionLabel, optionLabels } from './fieldUtils';
import { t } from '../../lib/i18n';

interface SuiteAuditProps {
    onGenerate: (prompt: string) => void;
    lang: 'es' | 'en';
    onRegisterGenerate?: (fn: () => void) => void;
    onInvalid?: (msg: string) => void;
}

export function SuiteAudit({ onGenerate, lang, onRegisterGenerate, onInvalid }: SuiteAuditProps) {
    const [values, setValues] = useSessionState<Record<string, any>>('suite.audit', {
        inputMode: 'url',
        repoUrl: '',
        codeInput: '',
        language: 'auto',
        artifactType: 'library',
        scanTypes: ['owasp', 'input_validation', 'auth'],
        compliance: 'none',
    });

    const L = (es: string, en: string) => (lang === 'es' ? es : en);

    const handleChange = (id: string, value: any) => {
        setValues(prev => ({ ...prev, [id]: value }));
    };

    const handleGenerate = () => {
        const isUrl = values.inputMode === 'url';
        const target = (isUrl ? values.repoUrl : values.codeInput)?.trim();
        if (!target) {
            onInvalid?.(t('validation.required', lang).replace('{{field}}', t(isUrl ? 'audit.url' : 'audit.code', lang)));
            return;
        }

        const artifact = optionLabel(auditFields, 'artifactType', values.artifactType, lang);
        const language = optionLabel(auditFields, 'language', values.language, lang);
        const scans = optionLabels(auditFields, 'scanTypes', values.scanTypes, lang).join(', ') || L('General', 'General');
        const compliance = values.compliance && values.compliance !== 'none'
            ? optionLabel(auditFields, 'compliance', values.compliance, lang)
            : '';

        // En modo pegado el código DEBE ir dentro del prompt (antes solo se mencionaba).
        const source = isUrl
            ? L(`**Repositorio:** ${target}\nSi no puedes acceder a la URL, dilo y pide el código en lugar de suponer su contenido.`,
                `**Repository:** ${target}\nIf you cannot access the URL, say so and ask for the code instead of guessing its content.`)
            : `\`\`\`\n${target}\n\`\`\``;

        const prompt = L(
            `Actúa como un **Auditor de Seguridad y Calidad de Software Senior**.

### OBJETIVO
Auditoría de: **${artifact}** · Lenguaje: **${language}**
${source}

### ALCANCE
- **Áreas a revisar:** ${scans}
${compliance ? `- **Marco de cumplimiento:** ${compliance}\n` : ''}
### INFORME
1. **Resumen ejecutivo:** qué hace el código y el nivel de riesgo global.
2. **Hallazgos de seguridad:** tabla con severidad (Crítico/Alto/Medio/Bajo), ubicación, impacto y arreglo. Marca los posibles falsos positivos y explica por qué.
3. **Calidad del código:** code smells, anti-patrones y complejidad.
4. **Dependencias:** versiones obsoletas o vulnerables y riesgos de cadena de suministro.
5. **Código corregido** para cada hallazgo crítico o alto.

Basa cada hallazgo en el código real; si algo no se puede verificar con lo aportado, indícalo.

IDIOMA DE SALIDA: ESPAÑOL.`,
            `Act as a **Senior Software Security & Quality Auditor**.

### TARGET
Audit of: **${artifact}** · Language: **${language}**
${source}

### SCOPE
- **Areas to review:** ${scans}
${compliance ? `- **Compliance framework:** ${compliance}\n` : ''}
### REPORT
1. **Executive summary:** what the code does and the overall risk level.
2. **Security findings:** table with severity (Critical/High/Medium/Low), location, impact and fix. Flag possible false positives and explain why.
3. **Code quality:** code smells, anti-patterns and complexity.
4. **Dependencies:** outdated or vulnerable versions and supply chain risks.
5. **Corrected code** for every critical or high finding.

Base every finding on the actual code; if something cannot be verified from what was provided, say so.

OUTPUT LANGUAGE: ENGLISH.`
        );

        onGenerate(prompt.trim());
    };

    useEffect(() => {
        onRegisterGenerate?.(handleGenerate);
    }, [handleGenerate, onRegisterGenerate]);

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            <DynamicForm fields={auditFields} values={values} onChange={handleChange} lang={lang} />

            <div className="rounded-md bg-sky-900/10 border border-sky-800/30 p-4 text-xs text-sky-200/70 leading-relaxed">
                <p>{t('audit.tip', lang)}</p>
            </div>
        </div>
    );
}
