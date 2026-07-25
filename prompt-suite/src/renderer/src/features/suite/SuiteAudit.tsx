import { useState, useEffect } from 'react';
import { DynamicForm } from '../../components/ui/DynamicForm';
import { auditFields } from './formSchemas';
import { t } from '../../lib/i18n';
import { ShieldCheck } from 'lucide-react';

interface SuiteAuditProps {
    onGenerate: (prompt: string) => void;
    lang: 'es' | 'en';
    onRegisterGenerate?: (fn: () => void) => void;
}

export function SuiteAudit({ onGenerate, lang, onRegisterGenerate }: SuiteAuditProps) {
    const [values, setValues] = useState<Record<string, any>>({
        inputMode: 'url',
        repoUrl: '',
        codeInput: '',
        language: 'auto',
        artifactType: 'library',
        scanTypes: ['owasp', 'input_validation', 'auth'],
        severity: 'critical_high',
        compliance: 'none',
        includeFixes: true,
        falsePositiveFilter: true,
        reportFormat: 'full',
    });

    const handleChange = (id: string, value: any) => {
        setValues(prev => ({ ...prev, [id]: value }));
    };

    const handleGenerate = () => {
        const target = values.inputMode === 'url' ? values.repoUrl : values.codeInput;
        if (!target?.trim() && values.inputMode === 'url') return;

        const langLabels: Record<string, string> = {
            auto: 'Auto-detect',
            typescript: 'TypeScript / JavaScript',
            python: 'Python',
            rust: 'Rust',
            go: 'Go',
            java: 'Java / Kotlin',
            csharp: 'C# / .NET',
            php: 'PHP',
            ruby: 'Ruby',
        };

        const artifactLabels: Record<string, { es: string; en: string }> = {
            library: { es: 'Librería / SDK / Framework', en: 'Library / SDK / Framework' },
            cli: { es: 'CLI Script / Herramienta Terminal', en: 'CLI Script / Terminal Tool' },
            gui: { es: 'Aplicación GUI (Web/Desktop)', en: 'GUI Application (Web/Desktop)' },
            api: { es: 'API / Microservicio', en: 'API / Microservice' },
            mobile: { es: 'Aplicación Móvil', en: 'Mobile Application' },
            infra: { es: 'Infraestructura (Terraform/K8s)', en: 'Infrastructure (Terraform/K8s)' },
        };

        const severityLabels: Record<string, { es: string; en: string }> = {
            critical: { es: 'Solo Críticos', en: 'Critical Only' },
            critical_high: { es: 'Críticos + Altos', en: 'Critical + High' },
            all: { es: 'Todos', en: 'All Severities' },
        };

        const complianceLabels: Record<string, string> = {
            none: 'Ninguno',
            soc2: 'SOC 2',
            iso27001: 'ISO 27001',
            pci_dss: 'PCI DSS',
            hipaa: 'HIPAA',
            gdpr: 'GDPR',
        };

        const scanList = (values.scanTypes || []).map((s: string) => s.replace(/_/g, ' ')).join(', ') || 'General';

        const targetRef = values.inputMode === 'url'
            ? `URL: ${values.repoUrl}`
            : `Código proporcionado directamente`;

        if (lang === 'es') {
            const prompt = `Actúa como un **Lead Software Architect & Auditor de Seguridad Senior**.

### TEMA: Auditoría de ${artifactLabels[values.artifactType]?.es || values.artifactType}
${targetRef}
**Lenguaje:** ${langLabels[values.language] || 'Auto-detect'}

### TU TAREA
Analiza el código proporcionado y genera un informe crítico centrado en **seguridad y calidad**.

### TIPOS DE SCAN
${scanList}

### CRITERIOS DE EVALUACIÓN
1. **Severidad:** ${severityLabels[values.severity]?.es || 'Todos'}
2. **Compliance:** ${complianceLabels[values.compliance] || 'Ninguno'}
3. **Lenguaje:** ${langLabels[values.language] || 'Auto-detect'}

### ESTRUCTURA DEL INFORME
1. **Resumen Ejecutivo:** ¿Para qué sirve esto y cuál es el risk level general?
2. **Hallazgos de Seguridad:**
   - Vulnerabilidades detectadas con severidad (Critical/High/Medium/Low)
   - OWASP Top 10 aplicable
   - Secretos expuestos o hardcodeados
   - Input validation gaps
3. **Calidad del Código:**
   - Patrones de diseño detectados
   - Code smells y anti-patterns
   - Complejidad ciclomática aparente
4. **Dependencias:**
   - ¿Tiene dependencias obsoletas o vulnerables?
   - Supply chain risks
5. **${values.includeFixes ? 'Código Corregido:' : 'Recomendaciones:'}**
   ${values.includeFixes ? 'Muestra ejemplos de código corregido para cada hallazgo crítico.' : 'Lista de acciones recomendadas priorizadas.'}
${values.falsePositiveFilter ? `\n### FILTRO DE FALSOS POSITIVOS\nMarca explícitamente los hallazgos que podrían ser falsos positivos con una explicación de por qué.` : ''}

### FORMATO DE SALIDA: ${values.reportFormat === 'executive' ? 'Executive Summary (conciso, para stakeholders)' : values.reportFormat === 'technical' ? 'Technical Deep Dive (detallado, para engineers)' : values.reportFormat === 'checklist' ? 'Checklist con items marcables' : 'Full Report (Executive + Technical)'}

IDIOMA DE SALIDA: ESPAÑOL.`.trim();

            onGenerate(prompt);
        } else {
            const prompt = `Act as a **Lead Software Architect & Senior Security Auditor**.

### TOPIC: ${artifactLabels[values.artifactType]?.en || values.artifactType} Audit
${targetRef}
**Language:** ${langLabels[values.language] || 'Auto-detect'}

### YOUR TASK
Analyze the provided code and generate a critical report focused on **security and quality**.

### SCAN TYPES
${scanList}

### EVALUATION CRITERIA
1. **Severity:** ${severityLabels[values.severity]?.en || 'All'}
2. **Compliance:** ${complianceLabels[values.compliance] || 'None'}
3. **Language:** ${langLabels[values.language] || 'Auto-detect'}

### REPORT STRUCTURE
1. **Executive Summary:** What is this for and what's the overall risk level?
2. **Security Findings:**
   - Detected vulnerabilities with severity (Critical/High/Medium/Low)
   - Applicable OWASP Top 10
   - Exposed or hardcoded secrets
   - Input validation gaps
3. **Code Quality:**
   - Design patterns detected
   - Code smells and anti-patterns
   - Apparent cyclomatic complexity
4. **Dependencies:**
   - Does it have obsolete or vulnerable dependencies?
   - Supply chain risks
5. **${values.includeFixes ? 'Fixed Code:' : 'Recommendations:'}**
   ${values.includeFixes ? 'Show corrected code examples for each critical finding.' : 'Prioritized list of recommended actions.'}
${values.falsePositiveFilter ? `\n### FALSE POSITIVE FILTER\nExplicitly flag findings that could be false positives with an explanation of why.` : ''}

### OUTPUT FORMAT: ${values.reportFormat === 'executive' ? 'Executive Summary (concise, for stakeholders)' : values.reportFormat === 'technical' ? 'Technical Deep Dive (detailed, for engineers)' : values.reportFormat === 'checklist' ? 'Checklist with checkable items' : 'Full Report (Executive + Technical)'}

OUTPUT LANGUAGE: ENGLISH.`.trim();

            onGenerate(prompt);
        }
    };

    useEffect(() => {
        onRegisterGenerate?.(handleGenerate);
    }, [handleGenerate, onRegisterGenerate]);

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            <DynamicForm
                fields={auditFields}
                values={values}
                onChange={handleChange}
                lang={lang}
            />

            <div className="rounded-md bg-sky-900/10 border border-sky-800/30 p-4 text-xs text-sky-200/70 leading-relaxed">
                <p>
                    {t('audit.tip', lang)}
                </p>
            </div>
        </div>
    );
}
