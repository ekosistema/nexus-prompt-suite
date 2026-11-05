import { useMemo, useEffect } from 'react';
import { useSessionState } from '../../hooks/useSessionState';
import { DynamicForm } from '../../components/ui/DynamicForm';
import { devFields } from './formSchemas';
import { optionLabel } from './fieldUtils';

interface SuiteDevProps {
    onGenerate: (prompt: string) => void;
    lang: 'es' | 'en';
    onRegisterGenerate?: (fn: () => void) => void;
    onInvalid?: (msg: string) => void;
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

const archValue = (a: string) => a.toLowerCase().replace(/[^a-z0-9]/g, '_');

export function SuiteDev({ onGenerate, lang, onRegisterGenerate }: SuiteDevProps) {
    const [values, setValues] = useSessionState<Record<string, any>>('suite.dev', {
        projectType: 'web_app',
        arch: 'clean_architecture',
        techStack: '',
        requirements: '',
        database: 'none',
        deployment: 'local',
        security: false,
    });

    const L = (es: string, en: string) => (lang === 'es' ? es : en);

    const archOptions = useMemo(() => {
        const archs = ARCH_OPTIONS[values.projectType] || ARCH_OPTIONS.web_app;
        return archs.map(a => ({ value: archValue(a), label: { es: a, en: a } }));
    }, [values.projectType]);

    const handleChange = (id: string, value: any) => {
        setValues(prev => {
            const next = { ...prev, [id]: value };
            if (id === 'projectType') {
                const archs = ARCH_OPTIONS[value] || ARCH_OPTIONS.web_app;
                next.arch = archValue(archs[0] ?? 'clean_architecture');
            }
            return next;
        });
    };

    const handleGenerate = () => {
        const projectType = optionLabel(devFields, 'projectType', values.projectType, lang);
        const archName = (ARCH_OPTIONS[values.projectType] || []).find(a => archValue(a) === values.arch) ?? values.arch.replace(/_/g, ' ');
        const database = optionLabel(devFields, 'database', values.database, lang);
        const deployment = optionLabel(devFields, 'deployment', values.deployment, lang);
        const requirements = values.requirements?.trim();
        const stack = values.techStack?.trim();

        const securitySection = values.security
            ? L(`
### SEGURIDAD
- SAST y escaneo de dependencias (SCA) en CI.
- OWASP Top 10 como checklist y un Threat Model básico (STRIDE).
- Nada de secretos en el código: variables de entorno o gestor de secretos.
- Validación de entrada en todos los endpoints y TLS en toda comunicación.
`, `
### SECURITY
- SAST and dependency scanning (SCA) in CI.
- OWASP Top 10 as a checklist and a basic Threat Model (STRIDE).
- No secrets in code: environment variables or a secrets manager.
- Input validation on every endpoint and TLS for all communication.
`)
            : '';

        const prompt = L(
            `Actúa como un **Staff Engineer** especializado en ${projectType}.

### PROYECTO
- **Tipo:** ${projectType}
- **Arquitectura:** ${archName}
- **Stack:** ${stack || 'a tu criterio: elige el más adecuado y justifícalo'}
- **Base de datos:** ${database}
- **Despliegue:** ${deployment}
- **Requisitos:** ${requirements || 'no especificados; asume los estándar para este tipo de proyecto y dilo explícitamente'}
${securitySection}
### PASOS
1. **Análisis de arquitectura:** justifica las decisiones y define módulos y flujo de datos.
2. **Implementación:** código profesional con manejo de errores, tipado y tests básicos.
3. **Despliegue:** CI/CD y configuración para ${deployment}.

IDIOMA DE SALIDA: ESPAÑOL (términos técnicos estándar en inglés).

Empieza por el análisis.`,
            `Act as a **Staff Engineer** specialized in ${projectType}.

### PROJECT
- **Type:** ${projectType}
- **Architecture:** ${archName}
- **Stack:** ${stack || 'your call: pick the most suitable one and justify it'}
- **Database:** ${database}
- **Deployment:** ${deployment}
- **Requirements:** ${requirements || 'not specified; assume the standard ones for this project type and say so explicitly'}
${securitySection}
### STEPS
1. **Architecture analysis:** justify decisions and define modules and data flow.
2. **Implementation:** professional code with error handling, typing and basic tests.
3. **Deployment:** CI/CD and configuration for ${deployment}.

OUTPUT LANGUAGE: ENGLISH (standard technical terminology).

Start with the analysis.`
        );

        onGenerate(prompt.trim());
    };

    useEffect(() => {
        onRegisterGenerate?.(handleGenerate);
    }, [handleGenerate, onRegisterGenerate]);

    const fields = useMemo(
        () => devFields.map(f => (f.id === 'arch' ? { ...f, options: archOptions } : f)),
        [archOptions]
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            <DynamicForm fields={fields} values={values} onChange={handleChange} lang={lang} />
        </div>
    );
}
