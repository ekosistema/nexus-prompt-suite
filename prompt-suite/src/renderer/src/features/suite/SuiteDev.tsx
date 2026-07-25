import { useState, useMemo, useEffect } from 'react';
import { DynamicForm } from '../../components/ui/DynamicForm';
import { devFields } from './formSchemas';
import { t } from '../../lib/i18n';
import { Terminal } from 'lucide-react';

interface SuiteDevProps {
    onGenerate: (prompt: string) => void;
    lang: 'es' | 'en';
    onRegisterGenerate?: (fn: () => void) => void;
}

const ARCH_OPTIONS: Record<string, string[]> = {
    web_app: ['Clean Architecture', 'Vertical Slice', 'Micro-Frontends', 'DDD', 'MVC'],
    desktop_app: ['Electron (Main/Renderer)', 'Tauri (Rust Backend)', 'Flutter Desktop', 'Native (Swift/C#)', 'Clean Architecture'],
    mobile_app: ['MVVM + Coordinator', 'TCA (Composable)', 'Clean + Bloc', 'DDD'],
    devops: ['Immutable Infrastructure', 'GitOps (ArgoCD)', 'Serverless Event-Driven', 'Microservices'],
    backend_api: ['Event-Driven Microservices', 'CQRS', 'Modular Monolith', 'DDD', 'Clean Architecture'],
    multimedia: ['Node-Based Dataflow', 'ECS (Entity Component)', 'Compute Shader Pipeline'],
    data_science: ['Feature Store', 'Federated Learning', 'Pipeline Architecture'],
    cli_tool: ['Plugin Architecture', 'Command Pattern', 'Clean Architecture'],
    game: ['ECS (Entity Component System)', 'MVC for Games', 'Component-Based'],
};

export function SuiteDev({ onGenerate, lang, onRegisterGenerate }: SuiteDevProps) {
    const [values, setValues] = useState<Record<string, any>>({
        projectType: 'web_app',
        arch: 'clean_architecture',
        focus: 'balanced',
        techStack: '',
        requirements: '',
        database: 'none',
        apiType: 'rest',
        deployment: 'local',
        security: false,
        testingStrategy: 'unit',
        qualityGates: [],
        style: 'native',
        level: 'prod',
        outputGranularity: 'full',
        dependencies: '',
    });

    const archOptions = useMemo(() => {
        const projectArchs = ARCH_OPTIONS[values.projectType] || ARCH_OPTIONS.web_app;
        return projectArchs.map(a => ({ value: a.toLowerCase().replace(/[^a-z0-9]/g, '_'), label: { es: a, en: a } }));
    }, [values.projectType]);

    const handleChange = (id: string, value: any) => {
        setValues(prev => {
            const newValues = { ...prev, [id]: value };
            if (id === 'projectType') {
                const projectArchs = ARCH_OPTIONS[value] || ARCH_OPTIONS.web_app;
                newValues.arch = projectArchs[0]?.toLowerCase().replace(/[^a-z0-9]/g, '_') || 'clean_architecture';
            }
            return newValues;
        });
    };

    const handleGenerate = () => {
        const focusLabels: Record<string, { es: string; en: string }> = {
            balanced: { es: 'Equilibrada (Velocidad de desarrollo vs Calidad)', en: 'Balanced (Dev Speed vs Quality)' },
            performance: { es: 'Rendimiento Extremo (O(n), Memoria, GPU)', en: 'Extreme Performance (O(n), Memory, GPU)' },
            security: { es: 'Seguridad (Zero Trust, OWASP, SAST)', en: 'Security (Zero Trust, OWASP, SAST)' },
            scalability: { es: 'Escalabilidad Horizontal', en: 'Horizontal Scalability' },
            maintainability: { es: 'Mantenibilidad y Calidad de Código (Clean Code)', en: 'Maintainability & Code Quality (Clean Code)' },
            accessibility: { es: 'Accesibilidad (WCAG 2.1 AA)', en: 'Accessibility (WCAG 2.1 AA)' },
        };

        const focusPrompt = focusLabels[values.focus] || focusLabels.balanced;

        const dbLabels: Record<string, string> = {
            none: 'Sin base de datos',
            postgresql: 'PostgreSQL',
            mysql: 'MySQL / MariaDB',
            sqlite: 'SQLite',
            mongodb: 'MongoDB',
            redis: 'Redis',
            supabase: 'Supabase',
        };

        const apiLabels: Record<string, string> = {
            rest: 'REST',
            graphql: 'GraphQL',
            grpc: 'gRPC',
            trpc: 'tRPC',
            websocket: 'WebSocket',
            none: 'Sin API',
        };

        const deployLabels: Record<string, string> = {
            local: 'Local / Development',
            docker: 'Docker',
            kubernetes: 'Kubernetes',
            serverless_aws: 'Serverless (AWS Lambda)',
            serverless_gcp: 'Serverless (GCP Cloud Functions)',
            vps: 'VPS / Bare Metal',
            vercel: 'Vercel / Netlify',
        };

        const testingLabels: Record<string, string> = {
            none: 'Sin tests',
            unit: 'Unit Tests',
            unit_integration: 'Unit + Integration',
            tdd: 'Full TDD',
            bdd: 'BDD (Cucumber/Gherkin)',
            property: 'Property-based Testing',
        };

        const granularityLabels: Record<string, { es: string; en: string }> = {
            full: { es: 'Full Codebase', en: 'Full Codebase' },
            core: { es: 'Core Module Only', en: 'Core Module Only' },
            architecture: { es: 'Architecture Diagram + Key Files', en: 'Architecture Diagram + Key Files' },
            scaffold: { es: 'Scaffold Only', en: 'Scaffold Only' },
        };

        let stackInstruction = '';
        if (lang === 'es') {
            stackInstruction = values.techStack.trim() === ""
                ? `> **🧠 CTO DECISION:** Elige el stack óptimo para ${values.focus}.`
                : `> **🛠️ STACK:** ${values.techStack}.`;
        } else {
            stackInstruction = values.techStack.trim() === ""
                ? `> **🧠 CTO DECISION:** Choose the optimal stack for ${values.focus}.`
                : `> **🛠️ STACK:** ${values.techStack}.`;
        }

        let securitySection = '';
        if (values.security) {
            securitySection = lang === 'es'
                ? `\n### SEGURIDAD (CRÍTICO)
- Implementa SAST (Static Application Security Testing) en CI.
- Escanea dependencias con SCA (Software Composition Analysis).
- Aplica OWASP Top 10 como checklist de seguridad.
- Genera un Threat Model básico (STRIDE).
- No hardcodear secrets. Usa variables de entorno o secret manager.
- Implementa input validation en todos los endpoints.
- Usa HTTPS/TLS para toda comunicación.`
                : `\n### SECURITY (CRITICAL)
- Implement SAST (Static Application Security Testing) in CI.
- Scan dependencies with SCA (Software Composition Analysis).
- Apply OWASP Top 10 as a security checklist.
- Generate a basic Threat Model (STRIDE).
- No hardcoded secrets. Use environment variables or secret manager.
- Implement input validation on all endpoints.
- Use HTTPS/TLS for all communication.`;
        }

        let qualitySection = '';
        if (values.qualityGates && values.qualityGates.length > 0) {
            const gates = values.qualityGates.join(', ');
            qualitySection = lang === 'es'
                ? `\n### QUALITY GATES
Implementa los siguientes quality gates: ${gates}.`
                : `\n### QUALITY GATES
Implement the following quality gates: ${gates}.`;
        }

        if (lang === 'es') {
            const prompt = `Actúa como un **Staff Engineer** especializado en ${values.projectType.replace(/_/g, ' ')}.

PROYECTO: **${t(`dev.type.${values.projectType}` as any, 'es').toUpperCase()}**
CONTEXTO TÉCNICO: ${values.projectType}

ESTRATEGIA TÉCNICA:
- **Prioridad:** ${focusPrompt.es}
- **Arquitectura:** ${values.arch.replace(/_/g, ' ')}
- **Base de Datos:** ${dbLabels[values.database] || 'No especificada'}
- **API:** ${apiLabels[values.apiType] || 'No especificada'}
- **Deployment:** ${deployLabels[values.deployment] || 'No especificado'}
- **Testing:** ${testingLabels[values.testingStrategy] || 'No especificado'}
- **Requisitos:** ${values.requirements || "No especificados, asume los estándar para este tipo de proyecto."}
- **Estilo UI/UX:** ${values.style}
- **Granularidad:** ${granularityLabels[values.outputGranularity]?.es || 'Full Codebase'}
${values.dependencies ? `- **Dependencias:** ${values.dependencies}` : ''}
${stackInstruction}
${securitySection}${qualitySection}
IDIOMA DE SALIDA: ESPAÑOL (Usa terminología técnica en inglés donde sea estándar).

PASOS DE RESPUESTA:
1. **ANÁLISIS DE ARQUITECTURA**: Justifica la elección. Define módulos, bounded contexts y flujo de datos.
2. **IMPLEMENTACIÓN (${t(`dev.level.${values.level}` as any, 'es').toUpperCase()})**: Código profesional con manejo de errores, patrones de diseño y type safety.
3. **INFRAESTRUCTURA/DEPLOY**: Estrategia de CI/CD, Docker/K8s manifests o configuración de deployment.

Empieza por el Análisis:`.trim();

            onGenerate(prompt);
        } else {
            const prompt = `Act as a **Staff Engineer** specializing in ${values.projectType.replace(/_/g, ' ')}.

PROJECT: **${t(`dev.type.${values.projectType}` as any, 'en').toUpperCase()}**
TECHNICAL CONTEXT: ${values.projectType}

TECHNICAL STRATEGY:
- **Priority:** ${focusPrompt.en}
- **Architecture:** ${values.arch.replace(/_/g, ' ')}
- **Database:** ${dbLabels[values.database] || 'Not specified'}
- **API:** ${apiLabels[values.apiType] || 'Not specified'}
- **Deployment:** ${deployLabels[values.deployment] || 'Not specified'}
- **Testing:** ${testingLabels[values.testingStrategy] || 'Not specified'}
- **Requirements:** ${values.requirements || "Not specified, assume standard for this project type."}
- **Preferred UI/UX Style:** ${values.style}
- **Granularity:** ${granularityLabels[values.outputGranularity]?.en || 'Full Codebase'}
${values.dependencies ? `- **Dependencies:** ${values.dependencies}` : ''}
${stackInstruction}
${securitySection}${qualitySection}
OUTPUT LANGUAGE: ENGLISH (Use standard technical terminology).

RESPONSE STEPS:
1. **ARCHITECTURE ANALYSIS**: Justify the choice. Define modules, bounded contexts, and data flow.
2. **IMPLEMENTATION (${t(`dev.level.${values.level}` as any, 'en').toUpperCase()})**: Professional code with error handling, design patterns, and type safety.
3. **INFRASTRUCTURE/DEPLOY**: CI/CD strategy, Docker/K8s manifests, or deployment configuration.

Start with the Analysis:`.trim();

            onGenerate(prompt);
        }
    };

    useEffect(() => {
        onRegisterGenerate?.(handleGenerate);
    }, [handleGenerate, onRegisterGenerate]);

    const dynamicArchFields = useMemo(() => {
        return devFields.map(f => {
            if (f.id === 'arch') {
                return { ...f, options: archOptions };
            }
            return f;
        });
    }, [archOptions]);

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            <DynamicForm
                fields={dynamicArchFields}
                values={values}
                onChange={handleChange}
                lang={lang}
            />
        </div>
    );
}
