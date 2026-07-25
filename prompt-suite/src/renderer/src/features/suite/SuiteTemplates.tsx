import { useState, useMemo, useEffect } from 'react';
import { promptTemplates, PromptTemplate } from './data';
import { t } from '../../lib/i18n';
import { Search, BookOpen, Zap, Shield, FileText, Settings, Code, Plus, Trash2, Save, Edit3, X, Info } from 'lucide-react';

interface CustomTemplate {
    id: string;
    title: string;
    description: string;
    prompt: string;
    category: string;
    icon: string;
    tags: string[];
    createdAt: number;
}

interface UnifiedTemplate {
    id: string;
    title: { es: string; en: string };
    description: { es: string; en: string };
    prompt: { es: string; en: string };
    category: string;
    icon: string;
    tags: string[];
    isCustom: boolean;
}

interface SuiteTemplatesProps {
    onGenerate: (prompt: string) => void;
    lang: 'es' | 'en';
    onRegisterGenerate?: (fn: () => void) => void;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
    devops: <Settings size={14} />,
    security: <Shield size={14} />,
    writing: <FileText size={14} />,
    business: <BookOpen size={14} />,
    custom: <Edit3 size={14} />,
};

const CATEGORY_COLORS: Record<string, string> = {
    devops: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    security: 'bg-red-500/10 text-red-400 border-red-500/30',
    writing: 'bg-green-500/10 text-green-400 border-green-500/30',
    business: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    custom: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
};

const ICON_OPTIONS = ['🚀', '💻', '🛡️', '📝', '🎨', '📊', '🔧', '⚡', '🧠', '📦', '🏗️', '🔬', '📋', '🏛️', '🐳', '⚙️', '📚', '💡', '🎯', '🔑'];

interface VarHelp {
    label: { es: string; en: string };
    why: { es: string; en: string };
}

const VAR_HELP: Record<string, VarHelp> = {
    LANG: {
        label: { es: 'Lenguaje o Framework', en: 'Language or Framework' },
        why: { es: 'Determina la sintaxis, ecosistema de librerías y convenciones del código generado. Es la base sobre la que se construye toda la plantilla.', en: 'Determines syntax, library ecosystem, and conventions of the generated code. The foundation the entire template builds upon.' },
    },
    APP_TYPE: {
        label: { es: 'Tipo de Aplicación', en: 'Application Type' },
        why: { es: 'Define la naturaleza del software: API REST, CLI, web app, microservicio, etc. Esto condiciona la arquitectura, patrones de diseño y herramientas recomendadas.', en: 'Defines the nature of the software: REST API, CLI, web app, microservice, etc. This conditions the architecture, design patterns, and recommended tools.' },
    },
    APP_NAME: {
        label: { es: 'Nombre de la Aplicación', en: 'Application Name' },
        why: { es: 'Identifica el proyecto en configuraciones, nombres de servicios, rutas y referencias. Un buen nombre da contexto inmediato al lector del documento generado.', en: 'Identifies the project in configurations, service names, paths, and references. A good name gives immediate context to the reader of the generated document.' },
    },
    FRAMEWORK: {
        label: { es: 'Framework Específico', en: 'Specific Framework' },
        why: { es: 'Define el marco de trabajo concreto (React, Django, FastAPI, etc.). Permite que la plantilla use comandos, convenciones y configuraciones específicas del ecosistema.', en: 'Defines the concrete framework (React, Django, FastAPI, etc.). Allows the template to use ecosystem-specific commands, conventions, and configurations.' },
    },
    ARCHITECTURE: {
        label: { es: 'Arquitectura del Sistema', en: 'System Architecture' },
        why: { es: 'Describe cómo se estructuran los componentes: monolito, microservicios, serverless, event-driven. Determina los vectores de ataque y las defensas a analizar.', en: 'Describes how components are structured: monolith, microservices, serverless, event-driven. Determines attack vectors and defenses to analyze.' },
    },
    RESOURCE: {
        label: { es: 'Recurso a Provisionar', en: 'Resource to Provision' },
        why: { es: 'Qué recurso cloud se va a crear con Terraform: VPC, EKS cluster, RDS instance, S3 bucket, etc. Cada recurso tiene sus propias configuraciones y buenas prácticas.', en: 'Which cloud resource to create with Terraform: VPC, EKS cluster, RDS instance, S3 bucket, etc. Each resource has its own configurations and best practices.' },
    },
    CLOUD: {
        label: { es: 'Proveedor Cloud', en: 'Cloud Provider' },
        why: { es: 'AWS, Azure, GCP u OCI. Cada proveedor tiene APIs, servicios y configuraciones diferentes. La plantilla se adapta al ecosistema del proveedor elegido.', en: 'AWS, Azure, GCP, or OCI. Each provider has different APIs, services, and configurations. The template adapts to the chosen provider ecosystem.' },
    },
    TOPIC: {
        label: { es: 'Tema del Artículo', en: 'Article Topic' },
        why: { es: 'El asunto central sobre el que gira el contenido. Debe ser específico y accionable para que el artículo tenga foco y profundidad técnica.', en: 'The central subject the content revolves around. Should be specific and actionable so the article has focus and technical depth.' },
    },
    AUDIENCE: {
        label: { es: 'Audiencia Objetivo', en: 'Target Audience' },
        why: { es: 'Define el nivel técnico y el contexto de quien leerá el contenido: developers junior, CTOs, DevOps engineers. Determina el tono, vocabulario y profundidad.', en: 'Defines the technical level and context of who will read the content: junior developers, CTOs, DevOps engineers. Determines tone, vocabulary, and depth.' },
    },
    LEVEL: {
        label: { es: 'Nivel de Profundidad', en: 'Depth Level' },
        why: { es: 'Principiante, intermedio o avanzado. Controla cuánto contexto se asume y la complejidad de los ejemplos y explicaciones.', en: 'Beginner, intermediate, or advanced. Controls how much context is assumed and the complexity of examples and explanations.' },
    },
    PRODUCT_NAME: {
        label: { es: 'Nombre del Producto', en: 'Product Name' },
        why: { es: 'El nombre con el que se identificará el producto en todo el documento. Debe ser claro y memorable para stakeholders y el equipo.', en: 'The name that will identify the product throughout the document. Should be clear and memorable for stakeholders and the team.' },
    },
    PROBLEM: {
        label: { es: 'Problema a Resolver', en: 'Problem to Solve' },
        why: { es: 'Define el dolor o necesidad del usuario que el producto aborda. Es el corazón del PRD: sin un problema claro, no hay solución válida.', en: 'Defines the user pain or need the product addresses. The heart of the PRD: without a clear problem, there is no valid solution.' },
    },
    TARGET_USERS: {
        label: { es: 'Usuarios Objetivo', en: 'Target Users' },
        why: { es: 'Para quién se construye el producto. Conocer el perfil del usuario permite priorizar funcionalidades y diseñar la experiencia adecuada.', en: 'Who the product is being built for. Knowing the user profile allows prioritizing features and designing the right experience.' },
    },
    DECISION: {
        label: { es: 'Decisión Arquitectónica', en: 'Architectural Decision' },
        why: { es: 'La elección técnica concreta que se está documentando: usar PostgreSQL sobre MongoDB, adoptar event-driven, elegir Kubernetes. Debe ser una decisión con impacto significativo.', en: 'The concrete technical choice being documented: use PostgreSQL over MongoDB, adopt event-driven, choose Kubernetes. Should be a decision with significant impact.' },
    },
    CONTEXT: {
        label: { es: 'Contexto del Proyecto', en: 'Project Context' },
        why: { es: 'El entorno, restricciones y motivaciones que rodean la decisión o especificación. Sin contexto, las decisiones técnicas carecen de justificación.', en: 'The environment, constraints, and motivations surrounding the decision or specification. Without context, technical decisions lack justification.' },
    },
    FEATURE: {
        label: { es: 'Feature o Sistema', en: 'Feature or System' },
        why: { es: 'Qué funcionalidad o componente se va a diseñar. Debe ser concreto y acotado para que la especificación sea accionable y no un documento infinito.', en: 'What functionality or component will be designed. Should be concrete and bounded so the specification is actionable and not an infinite document.' },
    },
    API_NAME: {
        label: { es: 'Nombre de la API', en: 'API Name' },
        why: { es: 'Identifica la API en la documentación y en el ecosistema de servicios. Un nombre descriptivo ayuda a los desarrolladores a encontrar y entender el recurso.', en: 'Identifies the API in documentation and the service ecosystem. A descriptive name helps developers find and understand the resource.' },
    },
    BASE_URL: {
        label: { es: 'URL Base', en: 'Base URL' },
        why: { es: 'El endpoint raíz desde donde se sirve la API. Todos los paths de la documentación se construyen relativos a esta URL.', en: 'The root endpoint where the API is served. All documentation paths are built relative to this URL.' },
    },
    PRODUCT: {
        label: { es: 'Producto', en: 'Product' },
        why: { es: 'El nombre del producto o proyecto para el que se generan las notas de versión o el reporte. Da identidad y contexto al documento.', en: 'The name of the product or project for which release notes or reports are generated. Gives identity and context to the document.' },
    },
    VERSION: {
        label: { es: 'Versión', en: 'Version' },
        why: { es: 'El número de versión siguiendo semver (MAJOR.MINOR.PATCH). Comunica la magnitud del cambio: breaking, feature, o fix.', en: 'The version number following semver (MAJOR.MINOR.PATCH). Communicates the magnitude of change: breaking, feature, or fix.' },
    },
    PROJECT_NAME: {
        label: { es: 'Nombre del Proyecto', en: 'Project Name' },
        why: { es: 'El nombre público del repositorio o proyecto open-source. Aparece en badges, headers y referencias del README.', en: 'The public name of the repository or open-source project. Appears in badges, headers, and README references.' },
    },
    DESCRIPTION: {
        label: { es: 'Descripción del Proyecto', en: 'Project Description' },
        why: { es: 'Explica en una frase qué hace el proyecto y por qué existe. Es lo primero que lee un visitante del repositorio.', en: 'Explains in one sentence what the project does and why it exists. The first thing a repository visitor reads.' },
    },
    DOMAIN: {
        label: { es: 'Dominio', en: 'Domain' },
        why: { es: 'El nombre de dominio donde se sirve la aplicación. Necesario para configurar SSL, virtual hosts y redirecciones.', en: 'The domain name where the application is served. Needed to configure SSL, virtual hosts, and redirects.' },
    },
    BACKEND_URL: {
        label: { es: 'URL del Backend', en: 'Backend URL' },
        why: { es: 'La dirección interna del servidor de aplicación al que Nginx hará proxy. Define el upstream en la configuración de reverse proxy.', en: 'The internal address of the application server Nginx will proxy to. Defines the upstream in the reverse proxy configuration.' },
    },
    SCOPE: {
        label: { es: 'Alcance del Pentest', en: 'Pentest Scope' },
        why: { es: 'Define los límites de la prueba: qué sistemas, URLs y rangos IP están dentro del test. Evita pruebas no autorizadas y enfoca el esfuerzo.', en: 'Defines test boundaries: which systems, URLs, and IP ranges are in scope. Prevents unauthorized testing and focuses effort.' },
    },
    TEAM: {
        label: { es: 'Nombre del Equipo', en: 'Team Name' },
        why: { es: 'Identifica al equipo en la retrospectiva. Personaliza el documento y las action items para el contexto del equipo.', en: 'Identifies the team in the retrospective. Personalizes the document and action items for the team context.' },
    },
    SPRINT_NUMBER: {
        label: { es: 'Número de Sprint', en: 'Sprint Number' },
        why: { es: 'El identificador del sprint que se está retrospectivando. Permite tracking histórico y comparación entre sprints.', en: 'The sprint identifier being retrospectived. Enables historical tracking and comparison between sprints.' },
    },
    DURATION: {
        label: { es: 'Duración del Sprint', en: 'Sprint Duration' },
        why: { es: 'Cuánto duró el sprint (1, 2, 4 semanas). Influye en la cantidad de trabajo analizado y el timeboxing de la retrospectiva.', en: 'How long the sprint lasted (1, 2, 4 weeks). Influences the amount of work analyzed and the retrospective timeboxing.' },
    },
    PROJECT: {
        label: { es: 'Nombre del Proyecto', en: 'Project Name' },
        why: { es: 'El proyecto sobre el que se reporta a stakeholders. Contextualiza el reporte dentro del portfolio de iniciativas.', en: 'The project being reported to stakeholders. Contextualizes the report within the initiative portfolio.' },
    },
    PERIOD: {
        label: { es: 'Período del Reporte', en: 'Reporting Period' },
        why: { es: 'El intervalo de tiempo que cubre el update: semanal, quincenal, mensual. Establece el marco temporal de los logros y métricas.', en: 'The time interval covered by the update: weekly, biweekly, monthly. Establishes the time frame for achievements and metrics.' },
    },
    ORG: {
        label: { es: 'Organización', en: 'Organization' },
        why: { es: 'El nombre de la empresa o equipo que implementa el plan. Adapta el tono, los roles y los procedimientos al contexto organizacional.', en: 'The name of the company or team implementing the plan. Adapts tone, roles, and procedures to the organizational context.' },
    },
    INFRASTRUCTURE: {
        label: { es: 'Tipo de Infraestructura', en: 'Infrastructure Type' },
        why: { es: 'Cloud, on-premise, híbrida. Determina los controles, herramientas y procedimientos de respuesta aplicables.', en: 'Cloud, on-premise, hybrid. Determines applicable controls, tools, and response procedures.' },
    },
    INFRA: {
        label: { es: 'Infraestructura', en: 'Infrastructure' },
        why: { es: 'Describe el entorno técnico a proteger: cloud provider, servicios críticos, topología de red. Es la base para dimensionar el plan de recuperación.', en: 'Describes the technical environment to protect: cloud provider, critical services, network topology. The basis for sizing the recovery plan.' },
    },
    SERVICES: {
        label: { es: 'Servicios Involucrados', en: 'Involved Services' },
        why: { es: 'Lista los servicios que forman parte del stack: PostgreSQL, Redis, RabbitMQ, etc. Define qué componentes necesitan configuración y monitoreo.', en: 'Lists the services that are part of the stack: PostgreSQL, Redis, RabbitMQ, etc. Defines which components need configuration and monitoring.' },
    },
    DB: {
        label: { es: 'Base de Datos', en: 'Database' },
        why: { es: 'El motor de base de datos: PostgreSQL, MySQL, MongoDB. Determina volúmenes, puertos, health checks y configuración de persistencia.', en: 'The database engine: PostgreSQL, MySQL, MongoDB. Determines volumes, ports, health checks, and persistence configuration.' },
    },
    METRICS: {
        label: { es: 'Métricas Clave', en: 'Key Metrics' },
        why: { es: 'Qué indicadores son críticos para tu aplicación: latencia, error rate, throughput, saturación. Definen qué se monitorea y qué dispara alertas.', en: 'Which indicators are critical for your application: latency, error rate, throughput, saturation. Define what is monitored and what triggers alerts.' },
    },
    ALERTS: {
        label: { es: 'Condiciones de Alerta', en: 'Alert Conditions' },
        why: { es: 'Los umbrales y situaciones que deben generar notificaciones. Determinan la configuración de Alertmanager y los canales de notificación.', en: 'The thresholds and situations that should generate notifications. Determine Alertmanager configuration and notification channels.' },
    },
    RTO: {
        label: { es: 'Recovery Time Objective', en: 'Recovery Time Objective' },
        why: { es: 'Tiempo máximo aceptable para recuperar el servicio tras un desastre. Define la urgencia y el tipo de estrategia de recuperación necesaria.', en: 'Maximum acceptable time to recover service after a disaster. Defines the urgency and type of recovery strategy needed.' },
    },
    RPO: {
        label: { es: 'Recovery Point Objective', en: 'Recovery Point Objective' },
        why: { es: 'Cantidad máxima de datos que se puede perder medida en tiempo. Determina la frecuencia de backups y la estrategia de replicación.', en: 'Maximum amount of data that can be lost measured in time. Determines backup frequency and replication strategy.' },
    },
    BUDGET: {
        label: { es: 'Presupuesto Mensual', en: 'Monthly Budget' },
        why: { es: 'El gasto objetivo mensual en cloud. Sirve como referencia para identificar sobrecostes y priorizar recomendaciones de ahorro.', en: 'The target monthly cloud spend. Serves as a reference to identify overspend and prioritize savings recommendations.' },
    },
    CLUSTER: {
        label: { es: 'Nombre del Cluster', en: 'Cluster Name' },
        why: { es: 'Identifica el cluster Kubernetes donde se despliega ArgoCD. Necesario para configurar el contexto y los destinos de despliegue.', en: 'Identifies the Kubernetes cluster where ArgoCD is deployed. Needed to configure context and deployment destinations.' },
    },
    REPO: {
        label: { es: 'Repositorio Git', en: 'Git Repository' },
        why: { es: 'La URL del repositorio que contiene los manifests de Kubernetes. Es la fuente de verdad para GitOps.', en: 'The URL of the repository containing Kubernetes manifests. The source of truth for GitOps.' },
    },
    ENV: {
        label: { es: 'Entornos', en: 'Environments' },
        why: { es: 'Los entornos a gestionar: dev, staging, production. Define la estrategia de promoción y los ApplicationSets necesarios.', en: 'The environments to manage: dev, staging, production. Defines the promotion strategy and required ApplicationSets.' },
    },
    DEPLOY: {
        label: { es: 'Target de Deploy', en: 'Deploy Target' },
        why: { es: 'Dónde se despliega la aplicación: Kubernetes, EC2, Vercel, S3. Determina los comandos y configuraciones de la etapa de deploy.', en: 'Where the application is deployed: Kubernetes, EC2, Vercel, S3. Determines deploy stage commands and configurations.' },
    },
    PORT: {
        label: { es: 'Puerto de la Aplicación', en: 'Application Port' },
        why: { es: 'El puerto en el que escucha la aplicación dentro del contenedor. Necesario para configurar Services, health checks y network policies.', en: 'The port the application listens on inside the container. Needed to configure Services, health checks, and network policies.' },
    },
    OS: {
        label: { es: 'Sistema Operativo', en: 'Operating System' },
        why: { es: 'El SO objetivo del playbook: Ubuntu, Rocky Linux, Debian. Determina el package manager, paths y servicios disponibles.', en: 'The target OS for the playbook: Ubuntu, Rocky Linux, Debian. Determines the package manager, paths, and available services.' },
    },
    CONFIG: {
        label: { es: 'Configuración Específica', en: 'Specific Configuration' },
        why: { es: 'Detalles concretos de lo que se necesita configurar: usuarios, firewalls, paquetes específicos. Permite que el playbook sea preciso y útil.', en: 'Concrete details of what needs to be configured: users, firewalls, specific packages. Allows the playbook to be precise and useful.' },
    },
    DB_SOURCE: {
        label: { es: 'Base de Datos Origen', en: 'Source Database' },
        why: { es: 'La base de datos desde la que se migra: versión, engine, tamaño. Define los pasos de extracción y las herramientas de exportación.', en: 'The database being migrated from: version, engine, size. Defines extraction steps and export tools.' },
    },
    DB_TARGET: {
        label: { es: 'Base de Datos Destino', en: 'Target Database' },
        why: { es: 'La base de datos a la que se migra. Puede ser una versión más reciente u otro engine completamente. Determina transformaciones y validaciones.', en: 'The database being migrated to. May be a newer version or a completely different engine. Determines transformations and validations.' },
    },
    SIZE: {
        label: { es: 'Tamaño Estimado', en: 'Estimated Size' },
        why: { es: 'El volumen de datos a migrar (GB/TB). Influye en la estrategia: dump directo, replicación, CDC. Determina tiempos y riesgos.', en: 'The data volume to migrate (GB/TB). Influences strategy: direct dump, replication, CDC. Determines timing and risks.' },
    },
};

export function SuiteTemplates({ onGenerate, lang, onRegisterGenerate }: SuiteTemplatesProps) {
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [selectedTemplate, setSelectedTemplate] = useState<UnifiedTemplate | null>(null);
    const [customVars, setCustomVars] = useState<Record<string, string>>({});
    const [customTemplates, setCustomTemplates] = useState<CustomTemplate[]>([]);
    const [isCreating, setIsCreating] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState<CustomTemplate | null>(null);

    const [newTitle, setNewTitle] = useState('');
    const [newDesc, setNewDesc] = useState('');
    const [newPrompt, setNewPrompt] = useState('');
    const [newCategory, setNewCategory] = useState('custom');
    const [newIcon, setNewIcon] = useState('🚀');
    const [newTags, setNewTags] = useState('');
    const [showIconPicker, setShowIconPicker] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('custom_templates');
        if (saved) {
            try {
                setCustomTemplates(JSON.parse(saved));
            } catch { /* ignore */ }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('custom_templates', JSON.stringify(customTemplates));
    }, [customTemplates]);

    const allTemplates = useMemo((): UnifiedTemplate[] => {
        const builtin: UnifiedTemplate[] = promptTemplates.map(t => ({ ...t, isCustom: false }));
        const custom: UnifiedTemplate[] = customTemplates.map(t => ({
            id: t.id,
            title: { es: t.title, en: t.title },
            description: { es: t.description, en: t.description },
            prompt: { es: t.prompt, en: t.prompt },
            category: t.category,
            icon: t.icon,
            tags: t.tags,
            isCustom: true,
        }));
        return [...builtin, ...custom];
    }, [customTemplates]);

    const categories = useMemo(() => {
        const cats = new Set(allTemplates.map(t => t.category));
        return ['all', ...Array.from(cats)];
    }, [allTemplates]);

    const filteredTemplates = useMemo(() => {
        return allTemplates.filter(template => {
            const matchesSearch = search === '' ||
                template.title[lang].toLowerCase().includes(search.toLowerCase()) ||
                template.description[lang].toLowerCase().includes(search.toLowerCase()) ||
                template.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()));
            
            const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
            
            return matchesSearch && matchesCategory;
        });
    }, [search, selectedCategory, lang, allTemplates]);

    const fillTemplate = (template: UnifiedTemplate): string => {
        let prompt = template.prompt[lang];
        
        const varRegex = /\{\{(\w+)\}\}/g;
        let match;
        const usedVars = new Set<string>();
        
        while ((match = varRegex.exec(prompt)) !== null) {
            usedVars.add(match[1]);
        }

        for (const varName of usedVars) {
            const value = customVars[varName] || `[${varName}]`;
            prompt = prompt.replace(new RegExp(`\\{\\{${varName}\\}\\}`, 'g'), value);
        }

        prompt = prompt.replace(/\{\{LANG_OUTPUT\}\}/g, lang === 'es' ? 'ESPAÑOL' : 'ENGLISH');

        return prompt;
    };

    const handleUseTemplate = (template: UnifiedTemplate) => {
        setSelectedTemplate(template);
        setCustomVars({});
    };

    const handleExecute = () => {
        if (!selectedTemplate) return;
        const filledPrompt = fillTemplate(selectedTemplate);
        onGenerate(filledPrompt);
        setSelectedTemplate(null);
        setCustomVars({});
    };

    useEffect(() => {
        onRegisterGenerate?.(handleExecute);
    }, [handleExecute, onRegisterGenerate]);

    const handleSaveCustom = () => {
        if (!newTitle.trim() || !newPrompt.trim()) return;

        const template: CustomTemplate = {
            id: editingTemplate ? editingTemplate.id : `custom_${Date.now()}`,
            title: newTitle.trim(),
            description: newDesc.trim(),
            prompt: newPrompt.trim(),
            category: newCategory,
            icon: newIcon,
            tags: newTags.split(',').map(t => t.trim()).filter(Boolean),
            createdAt: editingTemplate ? editingTemplate.createdAt : Date.now(),
        };

        if (editingTemplate) {
            setCustomTemplates(prev => prev.map(t => t.id === editingTemplate.id ? template : t));
        } else {
            setCustomTemplates(prev => [...prev, template]);
        }

        resetForm();
    };

    const handleEditCustom = (template: CustomTemplate) => {
        setEditingTemplate(template);
        setNewTitle(template.title);
        setNewDesc(template.description);
        setNewPrompt(template.prompt);
        setNewCategory(template.category);
        setNewIcon(template.icon);
        setNewTags(template.tags.join(', '));
        setIsCreating(true);
    };

    const handleDeleteCustom = (id: string) => {
        setCustomTemplates(prev => prev.filter(t => t.id !== id));
    };

    const resetForm = () => {
        setIsCreating(false);
        setEditingTemplate(null);
        setNewTitle('');
        setNewDesc('');
        setNewPrompt('');
        setNewCategory('custom');
        setNewIcon('🚀');
        setNewTags('');
        setShowIconPicker(false);
    };

    const extractVariables = (text: string): string[] => {
        const regex = /\{\{(\w+)\}\}/g;
        const vars = new Set<string>();
        let match;
        while ((match = regex.exec(text)) !== null) {
            if (match[1] !== 'LANG_OUTPUT') vars.add(match[1]);
        }
        return Array.from(vars);
    };

    // Template detail view
    if (selectedTemplate) {
        const usedVars = extractVariables(selectedTemplate.prompt[lang]);

        return (
            <div className="space-y-5 animate-in fade-in duration-300">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => { setSelectedTemplate(null); setCustomVars({}); }}
                        className="text-xs px-3 py-1.5 rounded-md bg-secondary/50 hover:bg-secondary border border-border transition-all"
                    >
                        ← {t('templates.back', lang)}
                    </button>
                    <span className="text-xl">{selectedTemplate.icon}</span>
                    <h2 className="text-lg font-bold">{selectedTemplate.title[lang]}</h2>
                </div>

                <p className="text-sm text-muted-foreground">{selectedTemplate.description[lang]}</p>

                {usedVars.length > 0 && (
                    <div className="space-y-1">
                        <h3 className="text-sm font-bold flex items-center gap-2 mb-3">
                            <Info size={14} className="text-primary" />
                            {lang === 'es' ? 'Entiende las Variables' : 'Understanding the Variables'}
                        </h3>
                        <p className="text-xs text-muted-foreground mb-4">
                            {lang === 'es'
                                ? 'Cada variable tiene un propósito específico. Completa los valores para personalizar la plantilla a tu contexto.'
                                : 'Each variable has a specific purpose. Fill in the values to personalize the template to your context.'}
                        </p>
                        <div className="grid grid-cols-1 gap-4">
                            {usedVars.map(varName => {
                                const help = VAR_HELP[varName];
                                return (
                                    <div key={varName} className="bg-card/50 border border-border rounded-xl p-4 space-y-2.5">
                                        <div>
                                            <span className="text-sm font-mono font-bold text-primary">
                                                {`{{${varName}}}`}
                                            </span>
                                            {help && (
                                                <span className="text-sm text-muted-foreground ml-2">
                                                    — {help.label[lang]}
                                                </span>
                                            )}
                                        </div>
                                        {help && (
                                            <p className="text-xs text-muted-foreground leading-relaxed">
                                                {help.why[lang]}
                                            </p>
                                        )}
                                        <input
                                            type="text"
                                            className="w-full bg-secondary/40 border border-input rounded-md px-3 py-2 text-sm font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                                            placeholder={lang === 'es' ? 'Escribe tu valor aquí...' : 'Enter your value here...'}
                                            value={customVars[varName] || ''}
                                            onChange={(e) => setCustomVars({ ...customVars, [varName]: e.target.value })}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                <button
                    onClick={handleExecute}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-bold transition-all text-sm"
                >
                    <Zap size={16} />
                    {t('templates.use', lang)}
                </button>
            </div>
        );
    }

    // Create/Edit custom template form
    if (isCreating) {
        const vars = extractVariables(newPrompt);

        return (
            <div className="space-y-5 animate-in fade-in duration-300">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold flex items-center gap-2">
                        <Edit3 size={18} className="text-amber-400" />
                        {editingTemplate ? t('templates.edit', lang) : t('templates.create', lang)}
                    </h2>
                    <button onClick={resetForm} className="p-1.5 hover:bg-secondary rounded-md transition-colors">
                        <X size={16} />
                    </button>
                </div>

                <div className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium opacity-80">{t('templates.ct.title', lang)}</label>
                        <input
                            type="text"
                            className="w-full bg-secondary/40 border border-input rounded-md px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                            placeholder={lang === 'es' ? 'Nombre de la plantilla' : 'Template name'}
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-medium opacity-80">{t('templates.ct.desc', lang)}</label>
                        <input
                            type="text"
                            className="w-full bg-secondary/40 border border-input rounded-md px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                            placeholder={lang === 'es' ? 'Descripción breve' : 'Brief description'}
                            value={newDesc}
                            onChange={(e) => setNewDesc(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium opacity-80">{t('templates.ct.category', lang)}</label>
                            <div className="relative">
                                <select
                                    className="w-full bg-secondary/40 border border-input rounded-md px-3 py-2 text-sm appearance-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                                    value={newCategory}
                                    onChange={(e) => setNewCategory(e.target.value)}
                                >
                                    <option value="custom">{t('templates.cat.custom', lang)}</option>
                                    <option value="devops">DevOps</option>
                                    <option value="security">{t('templates.cat.security', lang)}</option>
                                    <option value="writing">{t('templates.cat.writing', lang)}</option>
                                    <option value="business">{t('templates.cat.business', lang)}</option>
                                </select>
                                <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2">
                                    <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-medium opacity-80">{t('templates.ct.icon', lang)}</label>
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setShowIconPicker(!showIconPicker)}
                                    className="w-full bg-secondary/40 border border-input rounded-md px-3 py-2 text-lg text-left hover:bg-secondary/60 transition-colors"
                                >
                                    {newIcon}
                                </button>
                                {showIconPicker && (
                                    <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg p-2 grid grid-cols-5 gap-1 z-50 shadow-xl">
                                        {ICON_OPTIONS.map(icon => (
                                            <button
                                                key={icon}
                                                onClick={() => { setNewIcon(icon); setShowIconPicker(false); }}
                                                className="text-lg p-1.5 hover:bg-secondary rounded transition-colors"
                                            >
                                                {icon}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-medium opacity-80">{t('templates.ct.tags', lang)}</label>
                        <input
                            type="text"
                            className="w-full bg-secondary/40 border border-input rounded-md px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                            placeholder={lang === 'es' ? 'tag1, tag2, tag3' : 'tag1, tag2, tag3'}
                            value={newTags}
                            onChange={(e) => setNewTags(e.target.value)}
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-medium opacity-80">{t('templates.ct.prompt', lang)}</label>
                        <textarea
                            className="w-full bg-secondary/40 border border-input rounded-md px-3 py-2 text-sm font-mono resize-y min-h-[200px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                            placeholder={lang === 'es' ? 'Escribe tu prompt aquí. Usa {{VARIABLE}} para campos dinámicos.' : 'Write your prompt here. Use {{VARIABLE}} for dynamic fields.'}
                            value={newPrompt}
                            onChange={(e) => setNewPrompt(e.target.value)}
                        />
                    </div>

                    {vars.length > 0 && (
                        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
                            <p className="text-xs text-amber-300">
                                <strong>{t('templates.ct.vars_detected', lang)}:</strong> {vars.join(', ')}
                            </p>
                        </div>
                    )}
                </div>

                <button
                    onClick={handleSaveCustom}
                    disabled={!newTitle.trim() || !newPrompt.trim()}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed text-gray-900 font-bold transition-all text-sm"
                >
                    <Save size={16} />
                    {editingTemplate ? t('templates.ct.save_edit', lang) : t('templates.ct.save', lang)}
                </button>
            </div>
        );
    }

    // Main gallery view
    return (
        <div className="space-y-5 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                    <h2 className="text-lg font-bold flex items-center gap-2">
                        <BookOpen size={18} className="text-primary" />
                        {t('templates.title', lang)}
                    </h2>
                    <p className="text-xs text-muted-foreground">{t('templates.desc', lang)}</p>
                </div>
                <button
                    onClick={() => setIsCreating(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20 transition-all text-xs font-medium"
                >
                    <Plus size={14} />
                    {t('templates.add_custom', lang)}
                </button>
            </div>

            <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                    type="text"
                    className="w-full bg-secondary/40 border border-input rounded-md pl-9 pr-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                    placeholder={t('templates.search', lang)}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`text-xs px-3 py-1.5 rounded-full border transition-all flex items-center gap-1.5 ${
                            selectedCategory === cat
                                ? 'bg-primary/20 border-primary/40 text-primary'
                                : 'bg-secondary/30 border-border text-muted-foreground hover:border-primary/30'
                        }`}
                    >
                        {cat !== 'all' && CATEGORY_ICONS[cat]}
                        {cat === 'all' ? t('templates.all', lang) : t(`templates.cat.${cat}`, lang)}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredTemplates.map(template => {
                    const isCustom = (template as any).isCustom;
                    const customTpl = isCustom ? customTemplates.find(c => c.id === template.id) : null;

                    return (
                        <div
                            key={template.id}
                            className="group bg-card/50 border border-border rounded-xl p-4 hover:border-primary/40 hover:bg-card transition-all relative"
                        >
                            {isCustom && (
                                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleEditCustom(customTpl!); }}
                                        className="p-1 hover:bg-secondary rounded text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        <Edit3 size={12} />
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleDeleteCustom(customTpl!.id); }}
                                        className="p-1 hover:bg-destructive/20 rounded text-muted-foreground hover:text-destructive transition-colors"
                                    >
                                        <Trash2 size={12} />
                                    </button>
                                </div>
                            )}
                            <button
                                onClick={() => handleUseTemplate(template)}
                                className="text-left w-full"
                            >
                                <div className="flex items-start gap-3">
                                    <span className="text-2xl">{template.icon}</span>
                                    <div className="flex-1 min-w-0 pr-12">
                                        <h3 className="text-sm font-bold group-hover:text-primary transition-colors truncate">
                                            {template.title[lang]}
                                        </h3>
                                        <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                                            {template.description[lang]}
                                        </p>
                                        <div className="flex flex-wrap gap-1 mt-2">
                                            {template.tags.slice(0, 3).map(tag => (
                                                <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-secondary/50 text-muted-foreground">
                                                    {tag}
                                                </span>
                                            ))}
                                            {isCustom && (
                                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                                    {t('templates.custom_badge', lang)}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </button>
                        </div>
                    );
                })}
            </div>

            {filteredTemplates.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                    <Search size={32} className="mx-auto mb-3 opacity-30" />
                    <p className="text-sm">{t('templates.no_results', lang)}</p>
                </div>
            )}
        </div>
    );
}
