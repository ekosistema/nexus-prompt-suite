export interface PromptTemplate {
    id: string;
    category: string;
    icon: string;
    title: { es: string; en: string };
    description: { es: string; en: string };
    prompt: { es: string; en: string };
    tags: string[];
}

export const promptTemplates: PromptTemplate[] = [
    // DevOps
    {
        id: 'dockerfile_optimized',
        category: 'devops',
        icon: '🐳',
        title: { es: 'Dockerfile Optimizado', en: 'Optimized Dockerfile' },
        description: { es: 'Genera un Dockerfile multi-stage con buenas prácticas de seguridad y tamaño mínimo.', en: 'Generate a multi-stage Dockerfile with security best practices and minimal size.' },
        prompt: {
            es: `Actúa como un **Senior DevOps Engineer** especializado en containerización.

Crea un Dockerfile **multi-stage** optimizado para una aplicación con las siguientes características:
- **Lenguaje/Framework:** {{LANG}}
- **Tipo de app:** {{APP_TYPE}}

REQUISITOS:
1. Usa multi-stage builds para minimizar el tamaño final de la imagen.
2. Implementa .dockerignore efectivo (lista los archivos a excluir).
3. Usa distroless o Alpine como imagen base para producción.
4. Ejecuta como usuario no-root (security best practice).
5. Incluye healthcheck.
6. Optimiza el orden de las instrucciones para maximizar el cache de Docker.
7. Incluye comentarios explicando cada decisión.

FORMATO DE SALIDA:
- Dockerfile completo con comentarios
- .dockerignore recomendado
- Comandos de build y run
- Explicación de las optimizaciones aplicadas

IDIOMA: {{LANG_OUTPUT}}`,
            en: `Act as a **Senior DevOps Engineer** specializing in containerization.

Create an optimized **multi-stage** Dockerfile for an application with these characteristics:
- **Language/Framework:** {{LANG}}
- **App type:** {{APP_TYPE}}

REQUIREMENTS:
1. Use multi-stage builds to minimize final image size.
2. Implement an effective .dockerignore (list files to exclude).
3. Use distroless or Alpine as production base image.
4. Run as non-root user (security best practice).
5. Include healthcheck.
6. Optimize instruction ordering to maximize Docker cache.
7. Include comments explaining each decision.

OUTPUT FORMAT:
- Complete Dockerfile with comments
- Recommended .dockerignore
- Build and run commands
- Explanation of optimizations applied

LANGUAGE: {{LANG_OUTPUT}}`
        },
        tags: ['docker', 'containers', 'devops', 'security']
    },
    {
        id: 'github_actions_pipeline',
        category: 'devops',
        icon: '⚙️',
        title: { es: 'Pipeline CI/CD GitHub Actions', en: 'GitHub Actions CI/CD Pipeline' },
        description: { es: 'Genera un workflow completo de CI/CD con lint, test, build y deploy.', en: 'Generate a complete CI/CD workflow with lint, test, build, and deploy.' },
        prompt: {
            es: `Actúa como un **Senior DevOps Engineer**.

Crea un workflow de **GitHub Actions** completo para un proyecto con:
- **Lenguaje:** {{LANG}}
- **Framework:** {{FRAMEWORK}}

EL WORKFLOW DEBE INCLUIR:
1. **Lint**: Verificación de estilo de código
2. **Type Check**: Verificación de tipos (si aplica)
3. **Unit Tests**: Con coverage report
4. **Build**: Compilación del proyecto
5. **Security Scan**: Dependabot o similar
6. **Deploy**: Despliegue automático en main (o manual con approval)

REQUISITOS:
- Usa caching de dependencias para acelerar builds
- Matrix de pruebas si es multi-plataforma
- Variables de entorno seguras (secrets)
- Notificaciones de estado
- Badge de status para el README

FORMATO: Archivo .github/workflows/ci.yml completo con comentarios explicativos.
IDIOMA: {{LANG_OUTPUT}}`,
            en: `Act as a **Senior DevOps Engineer**.

Create a complete **GitHub Actions** workflow for a project with:
- **Language:** {{LANG}}
- **Framework:** {{FRAMEWORK}}

THE WORKFLOW MUST INCLUDE:
1. **Lint**: Code style verification
2. **Type Check**: Type verification (if applicable)
3. **Unit Tests**: With coverage report
4. **Build**: Project compilation
5. **Security Scan**: Dependabot or similar
6. **Deploy**: Automatic deploy on main (or manual with approval)

REQUIREMENTS:
- Use dependency caching to speed up builds
- Test matrix if multi-platform
- Secure environment variables (secrets)
- Status notifications
- Status badge for README

FORMAT: Complete .github/workflows/ci.yml file with explanatory comments.
LANGUAGE: {{LANG_OUTPUT}}`
        },
        tags: ['ci-cd', 'github-actions', 'devops', 'automation']
    },
    {
        id: 'terraform_module',
        category: 'devops',
        icon: '🏗️',
        title: { es: 'Módulo Terraform', en: 'Terraform Module' },
        description: { es: 'Genera un módulo de Terraform reutilizable con variables, outputs y good practices.', en: 'Generate a reusable Terraform module with variables, outputs, and best practices.' },
        prompt: {
            es: `Actúa como un **Senior Cloud Infrastructure Engineer**.

Crea un **módulo de Terraform** reutilizable para:
- **Recurso:** {{RESOURCE}}
- **Cloud Provider:** {{CLOUD}}

REQUISITOS:
1. Variables con descriptions, types, y defaults
2. Outputs documentados
3. Tags consistentes
4. Lifecycle rules (prevent_destroy, create_before_destroy)
5. Validaciones de variables
6. README con ejemplos de uso
7. Version pinning de providers

FORMATO: main.tf, variables.tf, outputs.tf, README.md
IDIOMA: {{LANG_OUTPUT}}`,
            en: `Act as a **Senior Cloud Infrastructure Engineer**.

Create a reusable **Terraform module** for:
- **Resource:** {{RESOURCE}}
- **Cloud Provider:** {{CLOUD}}

REQUIREMENTS:
1. Variables with descriptions, types, and defaults
2. Documented outputs
3. Consistent tagging
4. Lifecycle rules (prevent_destroy, create_before_destroy)
5. Variable validations
6. README with usage examples
7. Provider version pinning

FORMAT: main.tf, variables.tf, outputs.tf, README.md
LANGUAGE: {{LANG_OUTPUT}}`
        },
        tags: ['terraform', 'iac', 'cloud', 'infrastructure']
    },
    // Security
    {
        id: 'threat_model',
        category: 'security',
        icon: '🛡️',
        title: { es: 'Modelo de Amenazas (STRIDE)', en: 'Threat Model (STRIDE)' },
        description: { es: 'Genera un modelo de amenazas usando el framework STRIDE para una aplicación.', en: 'Generate a threat model using the STRIDE framework for an application.' },
        prompt: {
            es: `Actúa como un **Senior Security Architect**.

Realiza un **modelo de amenazas STRIDE** para:
- **Aplicación:** {{APP_NAME}}
- **Tipo:** {{APP_TYPE}}
- **Arquitectura:** {{ARCHITECTURE}}

ANÁLISIS STRIDE:
1. **Spoofing**: ¿Quién puede impersonar a quién?
2. **Tampering**: ¿Dónde se pueden modificar datos?
3. **Repudiation**: ¿Qué acciones no se pueden auditar?
4. **Information Disclosure**: ¿Qué datos están expuestos?
5. **Denial of Service**: ¿Qué vectores de DoS existen?
6. **Elevation of Privilege**: ¿Cómo se puede escalar privilegios?

ENTREGABLE:
- Diagrama de flujo de datos (descripción textual)
- Tabla de amenazas con: componente, amenaza, mitigación, prioridad
- Recomendaciones de seguridad priorizadas
- Checklist de hardening

IDIOMA: {{LANG_OUTPUT}}`,
            en: `Act as a **Senior Security Architect**.

Perform a **STRIDE threat model** for:
- **Application:** {{APP_NAME}}
- **Type:** {{APP_TYPE}}
- **Architecture:** {{ARCHITECTURE}}

STRIDE ANALYSIS:
1. **Spoofing**: Who can impersonate whom?
2. **Tampering**: Where can data be modified?
3. **Repudiation**: What actions cannot be audited?
4. **Information Disclosure**: What data is exposed?
5. **Denial of Service**: What DoS vectors exist?
6. **Elevation of Privilege**: How can privileges be escalated?

DELIVERABLE:
- Data flow diagram (textual description)
- Threat table with: component, threat, mitigation, priority
- Prioritized security recommendations
- Hardening checklist

LANGUAGE: {{LANG_OUTPUT}}`
        },
        tags: ['security', 'threat-model', 'stride', 'architecture']
    },
    {
        id: 'security_checklist',
        category: 'security',
        icon: '📋',
        title: { es: 'Security Checklist por Lenguaje', en: 'Language-Specific Security Checklist' },
        description: { es: 'Genera un checklist de seguridad específico para un lenguaje de programación.', en: 'Generate a language-specific security checklist.' },
        prompt: {
            es: `Actúa como un **Application Security Engineer**.

Crea un **Security Checklist** exhaustivo para aplicaciones en **{{LANG}}**.

CATEGORÍAS:
1. **Input Validation**: Sanitización, validación de tipos, SQL injection, XSS
2. **Authentication & Authorization**: Session management, JWT, OAuth, RBAC
3. **Data Protection**: Encryption at rest/in transit, secrets management
4. **Dependencies**: Vulnerability scanning, supply chain security
5. **Error Handling**: Information leakage, stack traces, logging
6. **Configuration**: Environment variables, hardcoded secrets, defaults
7. **API Security**: Rate limiting, CORS, CSRF, input size limits

FORMATO: Checklist con items marcables, nivel de criticidad (Crítico/Alto/Medio), y ejemplos de código vulnerable vs seguro.
IDIOMA: {{LANG_OUTPUT}}`,
            en: `Act as an **Application Security Engineer**.

Create a comprehensive **Security Checklist** for **{{LANG}}** applications.

CATEGORIES:
1. **Input Validation**: Sanitization, type validation, SQL injection, XSS
2. **Authentication & Authorization**: Session management, JWT, OAuth, RBAC
3. **Data Protection**: Encryption at rest/in transit, secrets management
4. **Dependencies**: Vulnerability scanning, supply chain security
5. **Error Handling**: Information leakage, stack traces, logging
6. **Configuration**: Environment variables, hardcoded secrets, defaults
7. **API Security**: Rate limiting, CORS, CSRF, input size limits

FORMAT: Checklist with checkable items, severity level (Critical/High/Medium), and vulnerable vs secure code examples.
LANGUAGE: {{LANG_OUTPUT}}`
        },
        tags: ['security', 'checklist', 'best-practices', 'code-review']
    },
    // Writing
    {
        id: 'technical_blog',
        category: 'writing',
        icon: '📝',
        title: { es: 'Artículo Técnico para Blog', en: 'Technical Blog Post' },
        description: { es: 'Genera un artículo técnico completo con código, explicaciones y estructura profesional.', en: 'Generate a complete technical article with code, explanations, and professional structure.' },
        prompt: {
            es: `Actúa como un **Technical Writer Senior** con experiencia en desarrollo de software.

Escribe un **artículo técnico** sobre:
- **Tema:** {{TOPIC}}
- **Audiencia:** {{AUDIENCE}}
- **Nivel:** {{LEVEL}}

ESTRUCTURA:
1. **Título atractivo** (SEO-optimized)
2. **Introducción** (hook + problema que resuelve)
3. **Contexto** (por qué importa, antecedentes)
4. **Desarrollo técnico** con ejemplos de código
5. **Comparativas** (pros/contras, alternativas)
6. **Best Practices** (lecciones aprendidas)
7. **Conclusión** (resumen + siguiente paso)
8. **TL;DR** al inicio

REQUISITOS:
- Código con syntax highlighting
- Diagramas descritos en texto (Mermaid si aplica)
- Links a documentación oficial
- SEO: meta description, keywords, slug sugerido
- Lectura estimada en minutos

IDIOMA: {{LANG_OUTPUT}}`,
            en: `Act as a **Senior Technical Writer** with software development experience.

Write a **technical article** about:
- **Topic:** {{TOPIC}}
- **Audience:** {{AUDIENCE}}
- **Level:** {{LEVEL}}

STRUCTURE:
1. **Catchy title** (SEO-optimized)
2. **Introduction** (hook + problem it solves)
3. **Context** (why it matters, background)
4. **Technical development** with code examples
5. **Comparisons** (pros/cons, alternatives)
6. **Best Practices** (lessons learned)
7. **Conclusion** (summary + next step)
8. **TL;DR** at the beginning

REQUIREMENTS:
- Code with syntax highlighting
- Diagrams described in text (Mermaid if applicable)
- Links to official documentation
- SEO: meta description, keywords, suggested slug
- Estimated reading time in minutes

LANGUAGE: {{LANG_OUTPUT}}`
        },
        tags: ['writing', 'blog', 'technical', 'seo']
    },
    {
        id: 'api_documentation',
        category: 'writing',
        icon: '📚',
        title: { es: 'Documentación de API', en: 'API Documentation' },
        description: { es: 'Genera documentación completa de API con endpoints, ejemplos y guías de uso.', en: 'Generate complete API documentation with endpoints, examples, and usage guides.' },
        prompt: {
            es: `Actúa como un **Technical Writer especializado en APIs**.

Crea la **documentación** para una API con:
- **Nombre:** {{API_NAME}}
- **Tipo:** REST / GraphQL / gRPC
- **Base URL:** {{BASE_URL}}

SECCIONES:
1. **Overview**: Qué hace la API, casos de uso
2. **Authentication**: Cómo autenticarse (API keys, OAuth, JWT)
3. **Endpoints**: Para cada endpoint:
   - Método y path
   - Descripción
   - Request headers
   - Request body (schema)
   - Response (200, 400, 401, 404, 500)
   - Ejemplos curl
4. **Rate Limiting**: Límites y headers
5. **Error Codes**: Tabla completa de errores
6. **SDK/Client Examples**: En {{LANG}}
7. **Changelog**: Versiones recientes

FORMATO: Markdown con OpenAPI spec si aplica.
IDIOMA: {{LANG_OUTPUT}}`,
            en: `Act as an **API-focused Technical Writer**.

Create **documentation** for an API with:
- **Name:** {{API_NAME}}
- **Type:** REST / GraphQL / gRPC
- **Base URL:** {{BASE_URL}}

SECTIONS:
1. **Overview**: What the API does, use cases
2. **Authentication**: How to authenticate (API keys, OAuth, JWT)
3. **Endpoints**: For each endpoint:
   - Method and path
   - Description
   - Request headers
   - Request body (schema)
   - Response (200, 400, 401, 404, 500)
   - curl examples
4. **Rate Limiting**: Limits and headers
5. **Error Codes**: Complete error table
6. **SDK/Client Examples**: In {{LANG}}
7. **Changelog**: Recent versions

FORMAT: Markdown with OpenAPI spec if applicable.
LANGUAGE: {{LANG_OUTPUT}}`
        },
        tags: ['api', 'documentation', 'rest', 'developer-experience']
    },
    {
        id: 'release_notes',
        category: 'writing',
        icon: '🚀',
        title: { es: 'Release Notes Profesionales', en: 'Professional Release Notes' },
        description: { es: 'Genera release notes estructuradas con changelog, breaking changes y migración.', en: 'Generate structured release notes with changelog, breaking changes, and migration guide.' },
        prompt: {
            es: `Actúa como un **Product Manager técnico**.

Escribe las **Release Notes** para la versión {{VERSION}} de {{PRODUCT}}.

ESTRUCTURA:
1. **Header**: Versión, fecha, highlight del release
2. **Breaking Changes**: Con guía de migración paso a paso
3. **New Features**: Con screenshots descritos y beneficios
4. **Improvements**: Optimizaciones y mejoras UX
5. **Bug Fixes**: Con links a issues si aplica
6. **Deprecations**: Qué se elimina y cuándo
7. **Known Issues**: Problemas conocidos y workarounds
8. **Upgrade Guide**: Pasos para actualizar

TONO: Profesional pero accesible. Celebratorio pero honesto.
FORMATO: Markdown con emojis para categorías.
IDIOMA: {{LANG_OUTPUT}}`,
            en: `Act as a **Technical Product Manager**.

Write **Release Notes** for version {{VERSION}} of {{PRODUCT}}.

STRUCTURE:
1. **Header**: Version, date, release highlight
2. **Breaking Changes**: With step-by-step migration guide
3. **New Features**: With described screenshots and benefits
4. **Improvements**: Optimizations and UX enhancements
5. **Bug Fixes**: With issue links if applicable
6. **Deprecations**: What's being removed and when
7. **Known Issues**: Known problems and workarounds
8. **Upgrade Guide**: Steps to update

TONE: Professional but accessible. Celebratory but honest.
FORMAT: Markdown with emojis for categories.
LANGUAGE: {{LANG_OUTPUT}}`
        },
        tags: ['release-notes', 'product', 'changelog', 'communication']
    },
    // Business
    {
        id: 'prd',
        category: 'business',
        icon: '📄',
        title: { es: 'Product Requirements Document (PRD)', en: 'Product Requirements Document (PRD)' },
        description: { es: 'Genera un PRD completo con problema, solución, métricas y roadmap.', en: 'Generate a complete PRD with problem, solution, metrics, and roadmap.' },
        prompt: {
            es: `Actúa como un **Senior Product Manager**.

Crea un **Product Requirements Document (PRD)** para:
- **Producto:** {{PRODUCT_NAME}}
- **Problema:** {{PROBLEM}}
- **Audiencia:** {{TARGET_USERS}}

SECCIONES:
1. **Problem Statement**: Qué problema resolvemos y por qué ahora
2. **Target Users**: Personas, jobs-to-be-done
3. **Success Metrics**: North Star metric, KPIs, OKRs
4. **Solution Overview**: Propuesta de valor, user stories principales
5. **Requirements**:
   - Funcionales (must-have, should-have, nice-to-have)
   - No funcionales (performance, security, accessibility)
6. **User Flows**: Descripción paso a paso de los flujos clave
7. **Technical Considerations**: Arquitectura, dependencias, riesgos
8. **Go-to-Market**: Lanzamiento, comunicación, rollout plan
9. **Timeline**: Fases estimadas con milestones
10. **Open Questions**: Decisiones pendientes

FORMATO: Documento estructurado en Markdown.
IDIOMA: {{LANG_OUTPUT}}`,
            en: `Act as a **Senior Product Manager**.

Create a **Product Requirements Document (PRD)** for:
- **Product:** {{PRODUCT_NAME}}
- **Problem:** {{PROBLEM}}
- **Target Users:** {{TARGET_USERS}}

SECTIONS:
1. **Problem Statement**: What problem we solve and why now
2. **Target Users**: Personas, jobs-to-be-done
3. **Success Metrics**: North Star metric, KPIs, OKRs
4. **Solution Overview**: Value proposition, main user stories
5. **Requirements**:
   - Functional (must-have, should-have, nice-to-have)
   - Non-functional (performance, security, accessibility)
6. **User Flows**: Step-by-step description of key flows
7. **Technical Considerations**: Architecture, dependencies, risks
8. **Go-to-Market**: Launch, communication, rollout plan
9. **Timeline**: Estimated phases with milestones
10. **Open Questions**: Pending decisions

FORMAT: Structured Markdown document.
LANGUAGE: {{LANG_OUTPUT}}`
        },
        tags: ['prd', 'product', 'requirements', 'planning']
    },
    {
        id: 'adr',
        category: 'business',
        icon: '🏛️',
        title: { es: 'Architecture Decision Record (ADR)', en: 'Architecture Decision Record (ADR)' },
        description: { es: 'Genera un ADR con contexto, decisiones, alternativas y consecuencias.', en: 'Generate an ADR with context, decisions, alternatives, and consequences.' },
        prompt: {
            es: `Actúa como un **Principal Software Architect**.

Crea un **Architecture Decision Record (ADR)** para:
- **Decisión:** {{DECISION}}
- **Contexto:** {{CONTEXT}}

FORMATO ADR (Nygard style):
1. **Title**: Decision title
2. **Status**: Proposed | Accepted | Deprecated | Superseded
3. **Context**: Situación actual, fuerzas que influyen, restricciones
4. **Decision**: Qué decidimos y por qué
5. **Alternatives Consideradas**:
   - Opción A: pros, contras, por qué se rechazó
   - Opción B: pros, contras, por qué se rechazó
6. **Consequences**: Impacto positivo y negativo de la decisión
7. **Compliance**: Cómo verificar que se cumple la decisión
8. **Notes**: Links, referencias, personas involucradas

TONO: Técnico, objetivo, sin ambigüedades.
IDIOMA: {{LANG_OUTPUT}}`,
            en: `Act as a **Principal Software Architect**.

Create an **Architecture Decision Record (ADR)** for:
- **Decision:** {{DECISION}}
- **Context:** {{CONTEXT}}

ADR FORMAT (Nygard style):
1. **Title**: Decision title
2. **Status**: Proposed | Accepted | Deprecated | Superseded
3. **Context**: Current situation, influencing forces, constraints
4. **Decision**: What we decided and why
5. **Alternatives Considered**:
   - Option A: pros, cons, why rejected
   - Option B: pros, cons, why rejected
6. **Consequences**: Positive and negative impact of the decision
7. **Compliance**: How to verify the decision is followed
8. **Notes**: Links, references, people involved

TONE: Technical, objective, unambiguous.
LANGUAGE: {{LANG_OUTPUT}}`
        },
        tags: ['adr', 'architecture', 'decisions', 'documentation']
    },
    {
        id: 'technical_spec',
        category: 'business',
        icon: '🔬',
        title: { es: 'Especificación Técnica', en: 'Technical Specification' },
        description: { es: 'Genera una especificación técnica detallada para un feature o sistema.', en: 'Generate a detailed technical specification for a feature or system.' },
        prompt: {
            es: `Actúa como un **Staff Engineer**.

Crea una **Especificación Técnica** para:
- **Feature/Sistema:** {{FEATURE}}
- **Contexto:** {{CONTEXT}}

SECCIONES:
1. **Overview**: Qué se va a construir y por qué
2. **Goals & Non-Goals**: Qué está dentro y fuera del scope
3. **System Design**:
   - Diagrama de arquitectura (descripción textual)
   - Componentes y responsabilidades
   - Flujos de datos
4. **API Design**: Endpoints, schemas, contratos
5. **Data Model**: Tablas, relaciones, índices
6. **State Management**: Cómo se maneja el estado
7. **Error Handling**: Estrategia de errores y retries
8. **Performance**: Benchmarks esperados, límites
9. **Security**: Auth, authorization, data protection
10. **Testing Strategy**: Unit, integration, E2E, load
11. **Rollout Plan**: Feature flags, canary, monitoring
12. **Migration**: Si aplica, plan de migración de datos

FORMATO: Documento técnico en Markdown.
IDIOMA: {{LANG_OUTPUT}}`,
            en: `Act as a **Staff Engineer**.

Create a **Technical Specification** for:
- **Feature/System:** {{FEATURE}}
- **Context:** {{CONTEXT}}

SECTIONS:
1. **Overview**: What will be built and why
2. **Goals & Non-Goals**: What's in and out of scope
3. **System Design**:
   - Architecture diagram (textual description)
   - Components and responsibilities
   - Data flows
4. **API Design**: Endpoints, schemas, contracts
5. **Data Model**: Tables, relationships, indexes
6. **State Management**: How state is handled
7. **Error Handling**: Error strategy and retries
8. **Performance**: Expected benchmarks, limits
9. **Security**: Auth, authorization, data protection
10. **Testing Strategy**: Unit, integration, E2E, load
11. **Rollout Plan**: Feature flags, canary, monitoring
12. **Migration**: If applicable, data migration plan

FORMAT: Technical document in Markdown.
LANGUAGE: {{LANG_OUTPUT}}`
        },
        tags: ['spec', 'technical', 'design', 'engineering']
    },
    // DevOps - More
    {
        id: 'k8s_deployment',
        category: 'devops',
        icon: '☸️',
        title: { es: 'Deployment Kubernetes', en: 'Kubernetes Deployment' },
        description: { es: 'Genera manifests de K8s con Deployment, Service, Ingress, HPA y ConfigMap.', en: 'Generate K8s manifests with Deployment, Service, Ingress, HPA, and ConfigMap.' },
        prompt: {
            es: `Actúa como un **Senior Kubernetes Engineer**.

Crea los manifests de Kubernetes para:
- **Aplicación:** {{APP_NAME}}
- **Tipo:** {{APP_TYPE}}
- **Puerto:** {{PORT}}

MANIFESTS REQUERIDOS:
1. **Deployment** con replicas, resources (requests/limits), probes (liveness, readiness, startup), securityContext (non-root)
2. **Service** (ClusterIP o LoadBalancer)
3. **Ingress** con TLS y annotations
4. **HorizontalPodAutoscaler** con métricas CPU/memory
5. **ConfigMap** para configuración
6. **Secret** template (con placeholders)

REQUISITOS:
- Usa apiVersion: apps/v1
- Labels consistentes (app.kubernetes.io/*)
- PodDisruptionBudget
- Resource quotas
- Comentarios explicativos

FORMATO: YAML separado por --- con comentarios.
IDIOMA: {{LANG_OUTPUT}}`,
            en: `Act as a **Senior Kubernetes Engineer**.

Create Kubernetes manifests for:
- **Application:** {{APP_NAME}}
- **Type:** {{APP_TYPE}}
- **Port:** {{PORT}}

REQUIRED MANIFESTS:
1. **Deployment** with replicas, resources (requests/limits), probes (liveness, readiness, startup), securityContext (non-root)
2. **Service** (ClusterIP or LoadBalancer)
3. **Ingress** with TLS and annotations
4. **HorizontalPodAutoscaler** with CPU/memory metrics
5. **ConfigMap** for configuration
6. **Secret** template (with placeholders)

REQUIREMENTS:
- Use apiVersion: apps/v1
- Consistent labels (app.kubernetes.io/*)
- PodDisruptionBudget
- Resource quotas
- Explanatory comments

FORMAT: YAML separated by --- with comments.
LANGUAGE: {{LANG_OUTPUT}}`
        },
        tags: ['kubernetes', 'k8s', 'devops', 'cloud', 'manifests']
    },
    {
        id: 'nginx_config',
        category: 'devops',
        icon: '🌐',
        title: { es: 'Configuración Nginx Production', en: 'Production Nginx Configuration' },
        description: { es: 'Genera una configuración de Nginx optimizada para producción con SSL, caching y seguridad.', en: 'Generate a production-optimized Nginx config with SSL, caching, and security.' },
        prompt: {
            es: `Actúa como un **Senior SysAdmin & Web Performance Engineer**.

Crea una configuración de **Nginx** para producción:
- **Dominio:** {{DOMAIN}}
- **Backend:** {{BACKEND_URL}}
- **Tipo de app:** {{APP_TYPE}}

INCLUYE:
1. SSL/TLS con certificados (placeholders para Let's Encrypt)
2. HTTP → HTTPS redirect
3. Gzip/Brotli compression
4. Cache headers para assets estáticos
5. Security headers (HSTS, X-Frame-Options, CSP, X-Content-Type-Options)
6. Rate limiting
7. Proxy settings optimizados (timeouts, buffers, keepalive)
8. Logging configurado
9. Health check endpoint

FORMATO: nginx.conf completo con comentarios.
IDIOMA: {{LANG_OUTPUT}}`,
            en: `Act as a **Senior SysAdmin & Web Performance Engineer**.

Create a **Nginx** production configuration:
- **Domain:** {{DOMAIN}}
- **Backend:** {{BACKEND_URL}}
- **App type:** {{APP_TYPE}}

INCLUDE:
1. SSL/TLS with certificates (placeholders for Let's Encrypt)
2. HTTP → HTTPS redirect
3. Gzip/Brotli compression
4. Cache headers for static assets
5. Security headers (HSTS, X-Frame-Options, CSP, X-Content-Type-Options)
6. Rate limiting
7. Optimized proxy settings (timeouts, buffers, keepalive)
8. Configured logging
9. Health check endpoint

FORMAT: Complete nginx.conf with comments.
LANGUAGE: {{LANG_OUTPUT}}`
        },
        tags: ['nginx', 'web-server', 'devops', 'ssl', 'performance']
    },
    // Security - More
    {
        id: 'pentest_plan',
        category: 'security',
        icon: '🔓',
        title: { es: 'Plan de Penetration Testing', en: 'Penetration Testing Plan' },
        description: { es: 'Genera un plan de pentest estructurado con fases, herramientas y reportes.', en: 'Generate a structured pentest plan with phases, tools, and reporting.' },
        prompt: {
            es: `Actúa como un **Senior Penetration Tester (OSCP/OSWE)**.

Crea un **Plan de Penetration Testing** para:
- **Aplicación:** {{APP_NAME}}
- **Tipo:** {{APP_TYPE}}
- **Scope:** {{SCOPE}}

FASES DEL PENTEST:
1. **Reconnaissance**: OSINT, subdomain enumeration, tech stack detection
2. **Scanning**: Port scanning, vulnerability scanning, web application scanning
3. **Exploitation**: Authentication bypass, injection attacks, file upload, SSRF, etc.
4. **Post-Exploitation**: Privilege escalation, lateral movement, data exfiltration
5. **Reporting**: Executive summary, technical findings, risk scoring, remediation

ENTREGABLES:
- Metodología (OWASP Top 10, PTES, NIST)
- Herramientas recomendadas por fase
- Matriz de riesgos
- Template de reporte
- Timeline estimado

IDIOMA: {{LANG_OUTPUT}}`,
            en: `Act as a **Senior Penetration Tester (OSCP/OSWE)**.

Create a **Penetration Testing Plan** for:
- **Application:** {{APP_NAME}}
- **Type:** {{APP_TYPE}}
- **Scope:** {{SCOPE}}

PENTEST PHASES:
1. **Reconnaissance**: OSINT, subdomain enumeration, tech stack detection
2. **Scanning**: Port scanning, vulnerability scanning, web application scanning
3. **Exploitation**: Authentication bypass, injection attacks, file upload, SSRF, etc.
4. **Post-Exploitation**: Privilege escalation, lateral movement, data exfiltration
5. **Reporting**: Executive summary, technical findings, risk scoring, remediation

DELIVERABLES:
- Methodology (OWASP Top 10, PTES, NIST)
- Recommended tools per phase
- Risk matrix
- Report template
- Estimated timeline

LANGUAGE: {{LANG_OUTPUT}}`
        },
        tags: ['pentest', 'security', 'offensive', 'owasp', 'testing']
    },
    {
        id: 'incident_response',
        category: 'security',
        icon: '🚨',
        title: { es: 'Plan de Respuesta a Incidentes', en: 'Incident Response Plan' },
        description: { es: 'Genera un playbook de respuesta a incidentes de seguridad con roles y procedimientos.', en: 'Generate a security incident response playbook with roles and procedures.' },
        prompt: {
            es: `Actúa como un **Incident Response Lead (GCIH)** y **CISO**.

Crea un **Plan de Respuesta a Incidentes** para:
- **Organización:** {{ORG}}
- **Tipo de infraestructura:** {{INFRASTRUCTURE}}

FASES (NIST SP 800-61):
1. **Preparation**: Team, tools, communication plan, training
2. **Detection & Analysis**: Alert sources, triage process, severity classification
3. **Containment**: Short-term and long-term containment strategies
4. **Eradication**: Root cause removal, system hardening
5. **Recovery**: System restoration, monitoring, validation
6. **Post-Incident**: Lessons learned, report, process improvement

INCLUYE:
- Roles y responsabilidades (IR Lead, Comms, Legal, Tech)
- Matriz de severidad (P1-P4)
- Templates de comunicación
- Escalation paths
- Checklist de forense digital

IDIOMA: {{LANG_OUTPUT}}`,
            en: `Act as an **Incident Response Lead (GCIH)** and **CISO**.

Create an **Incident Response Plan** for:
- **Organization:** {{ORG}}
- **Infrastructure type:** {{INFRASTRUCTURE}}

PHASES (NIST SP 800-61):
1. **Preparation**: Team, tools, communication plan, training
2. **Detection & Analysis**: Alert sources, triage process, severity classification
3. **Containment**: Short-term and long-term containment strategies
4. **Eradication**: Root cause removal, system hardening
5. **Recovery**: System restoration, monitoring, validation
6. **Post-Incident**: Lessons learned, report, process improvement

INCLUDE:
- Roles and responsibilities (IR Lead, Comms, Legal, Tech)
- Severity matrix (P1-P4)
- Communication templates
- Escalation paths
- Digital forensics checklist

LANGUAGE: {{LANG_OUTPUT}}`
        },
        tags: ['incident-response', 'security', 'nist', 'ciso', 'forensics']
    },
    // Writing - More
    {
        id: 'readme_professional',
        category: 'writing',
        icon: '📖',
        title: { es: 'README Profesional para GitHub', en: 'Professional GitHub README' },
        description: { es: 'Genera un README.md completo con badges, instalación, uso, contribución y licencia.', en: 'Generate a complete README.md with badges, installation, usage, contribution, and license.' },
        prompt: {
            es: `Actúa como un **Developer Experience (DX) Engineer**.

Crea un **README.md profesional** para:
- **Proyecto:** {{PROJECT_NAME}}
- **Descripción:** {{DESCRIPTION}}
- **Lenguaje:** {{LANG}}
- **Framework:** {{FRAMEWORK}}

SECCIONES:
1. **Header**: Logo, título, badges (build, coverage, version, license)
2. **About**: Descripción concisa con features en bullet points
3. **Screenshots**: Placeholders con descripción
4. **Quick Start**: Instalación y uso en 3 pasos
5. **Installation**: Prerrequisitos, pasos detallados, variables de entorno
6. **Usage**: Ejemplos de código, comandos, configuración
7. **Project Structure**: Árbol de archivos explicado
8. **API Reference**: Endpoints principales (si aplica)
9. **Contributing**: Guidelines, commit convention, PR template
10. **Testing**: Cómo correr tests
11. **License**: Tipo de licencia
12. **Credits**: Agradecimientos y referencias

FORMATO: Markdown con emojis, badges de shields.io, y Mermaid diagrams.
IDIOMA: {{LANG_OUTPUT}}`,
            en: `Act as a **Developer Experience (DX) Engineer**.

Create a **professional README.md** for:
- **Project:** {{PROJECT_NAME}}
- **Description:** {{DESCRIPTION}}
- **Language:** {{LANG}}
- **Framework:** {{FRAMEWORK}}

SECTIONS:
1. **Header**: Logo, title, badges (build, coverage, version, license)
2. **About**: Concise description with bullet point features
3. **Screenshots**: Placeholders with descriptions
4. **Quick Start**: Installation and usage in 3 steps
5. **Installation**: Prerequisites, detailed steps, environment variables
6. **Usage**: Code examples, commands, configuration
7. **Project Structure**: Explained file tree
8. **API Reference**: Main endpoints (if applicable)
9. **Contributing**: Guidelines, commit convention, PR template
10. **Testing**: How to run tests
11. **License**: License type
12. **Credits**: Acknowledgments and references

FORMAT: Markdown with emojis, shields.io badges, and Mermaid diagrams.
LANGUAGE: {{LANG_OUTPUT}}`
        },
        tags: ['readme', 'documentation', 'github', 'dx', 'open-source']
    },
    {
        id: 'changelog_generator',
        category: 'writing',
        icon: '📋',
        title: { es: 'CHANGELOG con Conventional Commits', en: 'CHANGELOG with Conventional Commits' },
        description: { es: 'Genera un CHANGELOG.md siguiendo Conventional Commits y Keep a Changelog.', en: 'Generate a CHANGELOG.md following Conventional Commits and Keep a Changelog.' },
        prompt: {
            es: `Actúa como un **Release Engineer**.

Crea un template de **CHANGELOG.md** siguiendo:
- **Formato:** Keep a Changelog
- **Commits:** Conventional Commits (feat, fix, docs, style, refactor, test, chore)
- **Versión:** {{VERSION}}

ESTRUCTURA:
1. Header con versión y fecha
2. Categorías: Added, Changed, Deprecated, Removed, Fixed, Security
3. Links a commits/issues
4. Template para futuras versiones
5. Instrucciones de uso con conventional commits

INCLUYE:
- Ejemplo con datos ficticios realistas
- Script de generación automática (bash o node)
- Integración con GitHub Actions

IDIOMA: {{LANG_OUTPUT}}`,
            en: `Act as a **Release Engineer**.

Create a **CHANGELOG.md** template following:
- **Format:** Keep a Changelog
- **Commits:** Conventional Commits (feat, fix, docs, style, refactor, test, chore)
- **Version:** {{VERSION}}

STRUCTURE:
1. Header with version and date
2. Categories: Added, Changed, Deprecated, Removed, Fixed, Security
3. Links to commits/issues
4. Template for future versions
5. Usage instructions with conventional commits

INCLUDE:
- Example with realistic dummy data
- Auto-generation script (bash or node)
- GitHub Actions integration

LANGUAGE: {{LANG_OUTPUT}}`
        },
        tags: ['changelog', 'conventional-commits', 'release', 'devops', 'documentation']
    },
    // Business - More
    {
        id: 'retrospective_template',
        category: 'business',
        icon: '🔄',
        title: { es: 'Sprint Retrospective Template', en: 'Sprint Retrospective Template' },
        description: { es: 'Genera una plantilla de retrospectiva ágil con múltiples formatos y action items.', en: 'Generate an agile retrospective template with multiple formats and action items.' },
        prompt: {
            es: `Actúa como un **Agile Coach & Scrum Master**.

Crea una **plantilla de Sprint Retrospective** para:
- **Equipo:** {{TEAM}}
- **Sprint:** {{SPRINT_NUMBER}}
- **Duración:** {{DURATION}}

FORMATOS (elige el mejor o incluye varios):
1. **Start/Stop/Continue**: Simple y efectivo
2. **Mad/Sad/Glad**: Emocional
3. **4Ls (Liked, Learned, Lacked, Longed for)**: Reflexivo
4. **Sailboat**: Visual y metafórico
5. **Starfish (Keep, Stop, Start, More, Less)**: Accionable

INCLUYE:
- Icebreaker activity
- Time-boxed agenda
- Voting mechanism
- Action items template con owner y deadline
- Metrics del sprint (velocity, burndown, bugs)
- Follow-up checklist

FORMATO: Markdown con tablas y checkboxes.
IDIOMA: {{LANG_OUTPUT}}`,
            en: `Act as an **Agile Coach & Scrum Master**.

Create a **Sprint Retrospective template** for:
- **Team:** {{TEAM}}
- **Sprint:** {{SPRINT_NUMBER}}
- **Duration:** {{DURATION}}

FORMATS (choose the best or include several):
1. **Start/Stop/Continue**: Simple and effective
2. **Mad/Sad/Glad**: Emotional
3. **4Ls (Liked, Learned, Lacked, Longed for)**: Reflective
4. **Sailboat**: Visual and metaphorical
5. **Starfish (Keep, Stop, Start, More, Less)**: Actionable

INCLUDE:
- Icebreaker activity
- Time-boxed agenda
- Voting mechanism
- Action items template with owner and deadline
- Sprint metrics (velocity, burndown, bugs)
- Follow-up checklist

FORMAT: Markdown with tables and checkboxes.
LANGUAGE: {{LANG_OUTPUT}}`
        },
        tags: ['agile', 'scrum', 'retrospective', 'team', 'process']
    },
    {
        id: 'stakeholder_update',
        category: 'business',
        icon: '📢',
        title: { es: 'Update para Stakeholders', en: 'Stakeholder Update' },
        description: { es: 'Genera un reporte de progreso ejecutivo para stakeholders con métricas y riesgos.', en: 'Generate an executive progress report for stakeholders with metrics and risks.' },
        prompt: {
            es: `Actúa como un **Technical Program Manager**.

Crea un **Stakeholder Update** para:
- **Proyecto:** {{PROJECT}}
- **Período:** {{PERIOD}}
- **Audiencia:** {{AUDIENCE}}

ESTRUCTURA:
1. **Executive Summary**: 3-5 líneas con estado general (🟢🟡🔴)
2. **Key Achievements**: Logros del período con métricas
3. **Progress by Workstream**: Tabla con % completado por área
4. **Risks & Blockers**: Con impacto, probabilidad y mitigación
5. **Budget & Timeline**: vs plan original
6. **Next Period Plan**: Prioridades y milestones
7. **Decisions Needed**: Qué necesita aprobación de stakeholders
8. **Appendix**: Métricas detalladas, gráficos descritos

TONO: Ejecutivo, conciso, data-driven. Sin jerga técnica innecesaria.
FORMATO: Markdown con tablas y emojis de estado.
IDIOMA: {{LANG_OUTPUT}}`,
            en: `Act as a **Technical Program Manager**.

Create a **Stakeholder Update** for:
- **Project:** {{PROJECT}}
- **Period:** {{PERIOD}}
- **Audience:** {{AUDIENCE}}

STRUCTURE:
1. **Executive Summary**: 3-5 lines with overall status (🟢🟡🔴)
2. **Key Achievements**: Period achievements with metrics
3. **Progress by Workstream**: Table with % completion by area
4. **Risks & Blockers**: With impact, probability, and mitigation
5. **Budget & Timeline**: vs original plan
6. **Next Period Plan**: Priorities and milestones
7. **Decisions Needed**: What needs stakeholder approval
8. **Appendix**: Detailed metrics, described charts

TONE: Executive, concise, data-driven. No unnecessary technical jargon.
FORMAT: Markdown with tables and status emojis.
LANGUAGE: {{LANG_OUTPUT}}`
        },
        tags: ['stakeholder', 'report', 'management', 'executive', 'communication']
    },

    // ─── DevOps Extended ─────────────────────────────────────────────────────

    {
        id: 'docker_compose_multi',
        category: 'devops',
        icon: '📦',
        title: { es: 'Docker Compose Multi-Service', en: 'Multi-Service Docker Compose' },
        description: { es: 'Entorno de desarrollo completo con múltiples servicios, redes y volúmenes.', en: 'Complete development environment with multiple services, networks, and volumes.' },
        prompt: {
            es: `Actúa como un **Senior DevOps Engineer**.

Crea un **docker-compose.yml** completo para:
- **App principal:** {{APP_TYPE}}
- **Servicios adicionales:** {{SERVICES}}
- **Base de datos:** {{DB}}

REQUISITOS:
1. Multi-service con app, db, cache, y worker si aplica
2. Networks separados (frontend, backend)
3. Volumes persistentes para datos
4. Health checks por servicio
5. Environment variables con .env
6. Restart policies
7. Resource limits (mem/cpu)
8. Development vs production profiles

FORMATO: docker-compose.yml + .env.example + README con comandos.
IDIOMA: {{LANG_OUTPUT}}`,
            en: `Act as a **Senior DevOps Engineer**.

Create a complete **docker-compose.yml** for:
- **Main app:** {{APP_TYPE}}
- **Additional services:** {{SERVICES}}
- **Database:** {{DB}}

REQUIREMENTS:
1. Multi-service with app, db, cache, and worker if applicable
2. Separate networks (frontend, backend)
3. Persistent volumes for data
4. Health checks per service
5. Environment variables with .env
6. Restart policies
7. Resource limits (mem/cpu)
8. Development vs production profiles

FORMAT: docker-compose.yml + .env.example + README with commands.
LANGUAGE: {{LANG_OUTPUT}}`
        },
        tags: ['docker', 'compose', 'devops', 'development', 'multi-service']
    },
    {
        id: 'gitops_argocd',
        category: 'devops',
        icon: '🔄',
        title: { es: 'GitOps con ArgoCD', en: 'GitOps with ArgoCD' },
        description: { es: 'Configuración de ArgoCD para despliegue declarativo con App-of-Apps.', en: 'ArgoCD configuration for declarative deployment with App-of-Apps.' },
        prompt: {
            es: `Actúa como un **Senior Platform Engineer** experto en GitOps.

Configura **ArgoCD** para:
- **Cluster:** {{CLUSTER}}
- **Repositorio git:** {{REPO}}
- **Environments:** {{ENV}}

INCLUYE:
1. ArgoCD Application CRD (App-of-Apps pattern)
2. ApplicationSet para multi-environment
3. Sync policies (auto vs manual)
4. Sync waves y hooks
5. RBAC para equipos
6. Notification config (Slack, email)
7. Health checks custom
8. Rollback strategy

FORMATO: YAML manifests + README de uso.
IDIOMA: {{LANG_OUTPUT}}`,
            en: `Act as a **Senior Platform Engineer** expert in GitOps.

Configure **ArgoCD** for:
- **Cluster:** {{CLUSTER}}
- **Git repo:** {{REPO}}
- **Environments:** {{ENV}}

INCLUDE:
1. ArgoCD Application CRD (App-of-Apps pattern)
2. ApplicationSet for multi-environment
3. Sync policies (auto vs manual)
4. Sync waves and hooks
5. RBAC for teams
6. Notification config (Slack, email)
7. Custom health checks
8. Rollback strategy

FORMAT: YAML manifests + usage README.
LANGUAGE: {{LANG_OUTPUT}}`
        },
        tags: ['gitops', 'argocd', 'kubernetes', 'devops', 'cd']
    },
    {
        id: 'monitoring_stack',
        category: 'devops',
        icon: '📊',
        title: { es: 'Monitoring Stack (Prometheus + Grafana)', en: 'Monitoring Stack (Prometheus + Grafana)' },
        description: { es: 'Configuración completa de observabilidad con alertas y dashboards.', en: 'Complete observability setup with alerts and dashboards.' },
        prompt: {
            es: `Actúa como un **Senior SRE**.

Configura un **Monitoring Stack** para:
- **App:** {{APP_TYPE}}
- **Métricas clave:** {{METRICS}}
- **Alertas:** {{ALERTS}}

INCLUYE:
1. Prometheus config con scrape targets y recording rules
2. Grafana dashboards JSON (app, infra, business)
3. Alertmanager con routing y receivers (Slack, PagerDuty, email)
4. Exporters necesarios (node, app, db)
5. ServiceMonitor CRDs (si K8s)
6. Alert rules con severity y runbooks
7. Retention y storage config
8. docker-compose o Helm values

FORMATO: Configs completos + guía de dashboards.
IDIOMA: {{LANG_OUTPUT}}`,
            en: `Act as a **Senior SRE**.

Configure a **Monitoring Stack** for:
- **App:** {{APP_TYPE}}
- **Key metrics:** {{METRICS}}
- **Alerts:** {{ALERTS}}

INCLUDE:
1. Prometheus config with scrape targets and recording rules
2. Grafana dashboards JSON (app, infra, business)
3. Alertmanager with routing and receivers (Slack, PagerDuty, email)
4. Required exporters (node, app, db)
5. ServiceMonitor CRDs (if K8s)
6. Alert rules with severity and runbooks
7. Retention and storage config
8. docker-compose or Helm values

FORMAT: Complete configs + dashboard guide.
LANGUAGE: {{LANG_OUTPUT}}`
        },
        tags: ['monitoring', 'prometheus', 'grafana', 'sre', 'observability']
    },
    {
        id: 'disaster_recovery',
        category: 'devops',
        icon: '🛟',
        title: { es: 'Disaster Recovery Plan', en: 'Disaster Recovery Plan' },
        description: { es: 'Plan de recuperación ante desastres con RTO/RPO, backups y failover.', en: 'Disaster recovery plan with RTO/RPO, backups, and failover.' },
        prompt: {
            es: `Actúa como un **Senior Infrastructure Architect**.

Crea un **Disaster Recovery Plan** para:
- **Infraestructura:** {{INFRA}}
- **RTO objetivo:** {{RTO}}
- **RPO objetivo:** {{RPO}}

INCLUYE:
1. Business Impact Analysis (BIA)
2. Estrategia de backups (full, incremental, differential)
3. Plan de failover automático y manual
4. Runbook paso a paso de recuperación
5. Testing schedule y drills
6. Comunicación de crisis
7. Matriz de priorización de servicios
8. Costos estimados de DR

FORMATO: Documento estructurado con checklists.
IDIOMA: {{LANG_OUTPUT}}`,
            en: `Act as a **Senior Infrastructure Architect**.

Create a **Disaster Recovery Plan** for:
- **Infrastructure:** {{INFRA}}
- **Target RTO:** {{RTO}}
- **Target RPO:** {{RPO}}

INCLUDE:
1. Business Impact Analysis (BIA)
2. Backup strategy (full, incremental, differential)
3. Automatic and manual failover plan
4. Step-by-step recovery runbook
5. Testing schedule and drills
6. Crisis communication
7. Service prioritization matrix
8. Estimated DR costs

FORMAT: Structured document with checklists.
LANGUAGE: {{LANG_OUTPUT}}`
        },
        tags: ['disaster-recovery', 'backup', 'failover', 'infrastructure', 'rto', 'rpo']
    },
    {
        id: 'cloud_cost_optimization',
        category: 'devops',
        icon: '💰',
        title: { es: 'Cloud Cost Optimization (FinOps)', en: 'Cloud Cost Optimization (FinOps)' },
        description: { es: 'Análisis de costos cloud con recomendaciones de ahorro FinOps.', en: 'Cloud cost analysis with FinOps savings recommendations.' },
        prompt: {
            es: `Actúa como un **FinOps Engineer**.

Crea un **Plan de Optimización de Costos** para:
- **Cloud Provider:** {{CLOUD}}
- **Servicios en uso:** {{SERVICES}}
- **Budget mensual:** {{BUDGET}}

ANÁLISIS:
1. Right-sizing de instancias
2. Reserved Instances / Savings Plans
3. Spot/Preemptible instances
4. Storage lifecycle policies
5. Data transfer optimization
6. Idle resource detection
7. Auto-scaling config
8. Tagging strategy para cost allocation

ENTREGABLE: Reporte con ahorros estimados por categoría y plan de implementación.
IDIOMA: {{LANG_OUTPUT}}`,
            en: `Act as a **FinOps Engineer**.

Create a **Cost Optimization Plan** for:
- **Cloud Provider:** {{CLOUD}}
- **Services in use:** {{SERVICES}}
- **Monthly budget:** {{BUDGET}}

ANALYSIS:
1. Instance right-sizing
2. Reserved Instances / Savings Plans
3. Spot/Preemptible instances
4. Storage lifecycle policies
5. Data transfer optimization
6. Idle resource detection
7. Auto-scaling config
8. Tagging strategy for cost allocation

DELIVERABLE: Report with estimated savings per category and implementation plan.
LANGUAGE: {{LANG_OUTPUT}}`
        },
        tags: ['finops', 'cost-optimization', 'cloud', 'aws', 'azure', 'gcp']
    },
    {
        id: 'gitlab_cicd',
        category: 'devops',
        icon: '🐙',
        title: { es: 'Pipeline CI/CD GitLab', en: 'GitLab CI/CD Pipeline' },
        description: { es: 'Pipeline completo para GitLab con stages, caching y artifacts.', en: 'Complete pipeline for GitLab with stages, caching, and artifacts.' },
        prompt: {
            es: `Actúa como un **Senior DevOps Engineer**.

Crea un **.gitlab-ci.yml** para:
- **Lenguaje:** {{LANG}}
- **Framework:** {{FRAMEWORK}}
- **Target de deploy:** {{DEPLOY}}

INCLUYE:
1. Stages: lint → test → build → security → deploy
2. Caching de dependencias
3. Artifacts entre stages
4. Manual approval para producción
5. Environment-specific variables
6. Docker-in-Docker si aplica
7. Merge request pipelines
8. Scheduled pipelines

FORMATO: .gitlab-ci.yml completo con comentarios.
IDIOMA: {{LANG_OUTPUT}}`,
            en: `Act as a **Senior DevOps Engineer**.

Create a **.gitlab-ci.yml** for:
- **Language:** {{LANG}}
- **Framework:** {{FRAMEWORK}}
- **Deploy target:** {{DEPLOY}}

INCLUDE:
1. Stages: lint → test → build → security → deploy
2. Dependency caching
3. Artifacts between stages
4. Manual approval for production
5. Environment-specific variables
6. Docker-in-Docker if applicable
7. Merge request pipelines
8. Scheduled pipelines

FORMAT: Complete .gitlab-ci.yml with comments.
LANGUAGE: {{LANG_OUTPUT}}`
        },
        tags: ['gitlab', 'ci-cd', 'devops', 'automation', 'pipeline']
    },
    {
        id: 'ansible_playbook',
        category: 'devops',
        icon: '🔧',
        title: { es: 'Ansible Playbook', en: 'Ansible Playbook' },
        description: { es: 'Automatización de configuración de servidores con roles y vars.', en: 'Server configuration automation with roles and vars.' },
        prompt: {
            es: `Actúa como un **Senior SysAdmin** experto en Ansible.

Crea un **Ansible Playbook** para:
- **OS:** {{OS}}
- **Servicios a configurar:** {{SERVICES}}
- **Configuración específica:** {{CONFIG}}

INCLUYE:
1. Playbook principal con roles
2. Roles con tasks, handlers, templates, vars
3. Inventory file (dev/staging/prod)
4. Vault para secrets
5. Idempotent tasks
6. Error handling y retries
7. Tags para ejecución parcial
8. README con uso

FORMATO: Estructura de roles completa.
IDIOMA: {{LANG_OUTPUT}}`,
            en: `Act as a **Senior SysAdmin** expert in Ansible.

Create an **Ansible Playbook** for:
- **OS:** {{OS}}
- **Services to configure:** {{SERVICES}}
- **Specific config:** {{CONFIG}}

INCLUDE:
1. Main playbook with roles
2. Roles with tasks, handlers, templates, vars
3. Inventory file (dev/staging/prod)
4. Vault for secrets
5. Idempotent tasks
6. Error handling and retries
7. Tags for partial execution
8. README with usage

FORMAT: Complete role structure.
LANGUAGE: {{LANG_OUTPUT}}`
        },
        tags: ['ansible', 'automation', 'sysadmin', 'configuration', 'infrastructure']
    },
    {
        id: 'database_migration',
        category: 'devops',
        icon: '🗄️',
        title: { es: 'Database Migration Plan', en: 'Database Migration Plan' },
        description: { es: 'Estrategia de migración de base de datos con zero-downtime.', en: 'Database migration strategy with zero-downtime.' },
        prompt: {
            es: `Actúa como un **Senior DBA & Data Engineer**.

Crea un **Plan de Migración de Base de Datos** para:
- **Origen:** {{DB_SOURCE}}
- **Destino:** {{DB_TARGET}}
- **Tamaño estimado:** {{SIZE}}

INCLUYE:
1. Assessment de compatibilidad
2. Estrategia de migración (online vs offline)
3. Schema migration scripts
4. Data migration con validación
5. Zero-downtime strategy (dual-write, CDC)
6. Rollback plan
7. Testing de integridad
8. Performance post-migración

FORMATO: Plan detallado con scripts y timeline.
IDIOMA: {{LANG_OUTPUT}}`,
            en: `Act as a **Senior DBA & Data Engineer**.

Create a **Database Migration Plan** for:
- **Source:** {{DB_SOURCE}}
- **Target:** {{DB_TARGET}}
- **Estimated size:** {{SIZE}}

INCLUDE:
1. Compatibility assessment
2. Migration strategy (online vs offline)
3. Schema migration scripts
4. Data migration with validation
5. Zero-downtime strategy (dual-write, CDC)
6. Rollback plan
7. Integrity testing
8. Post-migration performance

FORMAT: Detailed plan with scripts and timeline.
LANGUAGE: {{LANG_OUTPUT}}`
        },
        tags: ['database', 'migration', 'dba', 'zero-downtime', 'data']
    },
    {
        id: 'cdn_edge_config',
        category: 'devops',
        icon: '🌐',
        title: { es: 'CDN + Edge Configuration', en: 'CDN + Edge Configuration' },
        description: { es: 'Configuración CDN con caching, WAF y edge functions.', en: 'CDN configuration with caching, WAF, and edge functions.' },
        prompt: {
            es: `Actúa como un **Senior Edge/CDN Engineer**.

Configura una **CDN** para:
- **Proveedor:** {{CDN}}
- **Dominio:** {{DOMAIN}}
- **Origin:** {{ORIGIN}}

INCLUYE:
1. Cache rules por path y content type
2. WAF rules y rate limiting
3. Edge functions (redirects, rewrites, auth)
4. SSL/TLS config
5. Compression (Brotli, Gzip)
6. Image optimization
7. Custom error pages
8. Monitoring y analytics

FORMATO: Config completa + guía de deployment.
IDIOMA: {{LANG_OUTPUT}}`,
            en: `Act as a **Senior Edge/CDN Engineer**.

Configure a **CDN** for:
- **Provider:** {{CDN}}
- **Domain:** {{DOMAIN}}
- **Origin:** {{ORIGIN}}

INCLUDE:
1. Cache rules by path and content type
2. WAF rules and rate limiting
3. Edge functions (redirects, rewrites, auth)
4. SSL/TLS config
5. Compression (Brotli, Gzip)
6. Image optimization
7. Custom error pages
8. Monitoring and analytics

FORMAT: Complete config + deployment guide.
LANGUAGE: {{LANG_OUTPUT}}`
        },
        tags: ['cdn', 'edge', 'cloudflare', 'waf', 'caching', 'performance']
    },
    {
        id: 'infra_runbook',
        category: 'devops',
        icon: '📋',
        title: { es: 'Infrastructure Runbook', en: 'Infrastructure Runbook' },
        description: { es: 'Procedimientos operacionales para infraestructura.', en: 'Operational procedures for infrastructure.' },
        prompt: {
            es: `Actúa como un **Senior SRE**.

Crea un **Infrastructure Runbook** para:
- **Infraestructura:** {{INFRA}}
- **Escenarios comunes:** {{SCENARIOS}}
- **Herramientas:** {{TOOLS}}

INCLUYE:
1. Procedimientos de escalado
2. Recovery de servicios caídos
3. Rotación de certificados
4. Backup y restore procedures
5. Debug de performance issues
6. Incident response flow
7. Contact list y escalation
8. Post-incident checklist

FORMATO: Runbook con pasos numerados y comandos copy-paste.
IDIOMA: {{LANG_OUTPUT}}`,
            en: `Act as a **Senior SRE**.

Create an **Infrastructure Runbook** for:
- **Infrastructure:** {{INFRA}}
- **Common scenarios:** {{SCENARIOS}}
- **Tools:** {{TOOLS}}

INCLUDE:
1. Scaling procedures
2. Service crash recovery
3. Certificate rotation
4. Backup and restore procedures
5. Performance issue debugging
6. Incident response flow
7. Contact list and escalation
8. Post-incident checklist

FORMAT: Runbook with numbered steps and copy-paste commands.
LANGUAGE: {{LANG_OUTPUT}}`
        },
        tags: ['runbook', 'sre', 'operations', 'infrastructure', 'procedures']
    },

    // ─── Security Extended ────────────────────────────────────────────────────

    {
        id: 'privacy_impact_assessment',
        category: 'security',
        icon: '🔐',
        title: { es: 'Privacy Impact Assessment (GDPR/LGPD)', en: 'Privacy Impact Assessment (GDPR/LGPD)' },
        description: { es: 'Evaluación de impacto en privacidad con mapeo de datos y lawful basis.', en: 'Privacy impact assessment with data mapping and lawful basis.' },
        prompt: {
            es: `Actúa como un **Data Protection Officer (DPO)**.

Realiza un **Privacy Impact Assessment (PIA/DPIA)** para:
- **Aplicación:** {{APP}}
- **Tipos de datos:** {{DATA_TYPES}}
- **Jurisdicción:** {{JURISDICTION}}

ANÁLISIS:
1. Data mapping (qué datos, dónde, por qué, quién accede)
2. Lawful basis para cada procesamiento
3. Data retention policies
4. Data subject rights (access, deletion, portability)
5. Cross-border data transfers
6. Third-party processor assessment
7. Risk assessment con mitigaciones
8. Compliance checklist (GDPR/LGPD/CCPA)

FORMATO: Documento formal con tablas y recomendaciones.
IDIOMA: {{LANG_OUTPUT}}`,
            en: `Act as a **Data Protection Officer (DPO)**.

Perform a **Privacy Impact Assessment (PIA/DPIA)** for:
- **Application:** {{APP}}
- **Data types:** {{DATA_TYPES}}
- **Jurisdiction:** {{JURISDICTION}}

ANALYSIS:
1. Data mapping (what data, where, why, who accesses)
2. Lawful basis for each processing
3. Data retention policies
4. Data subject rights (access, deletion, portability)
5. Cross-border data transfers
6. Third-party processor assessment
7. Risk assessment with mitigations
8. Compliance checklist (GDPR/LGPD/CCPA)

FORMAT: Formal document with tables and recommendations.
LANGUAGE: {{LANG_OUTPUT}}`
        },
        tags: ['privacy', 'gdpr', 'lgpd', 'compliance', 'dpo', 'data-protection']
    },
    {
        id: 'secrets_management',
        category: 'security',
        icon: '🗝️',
        title: { es: 'Secrets Management Plan', en: 'Secrets Management Plan' },
        description: { es: 'Estrategia de gestión de secretos con Vault, rotación y auditoría.', en: 'Secrets management strategy with Vault, rotation, and auditing.' },
        prompt: {
            es: `Actúa como un **Security Engineer** especializado en secrets management.

Diseña un **Plan de Gestión de Secretos** para:
- **Infraestructura:** {{INFRA}}
- **Tipos de secretos:** {{SECRETS}}
- **Política de rotación:** {{ROTATION}}

INCLUYE:
1. HashiCorp Vault o AWS Secrets Manager config
2. Secret types classification (API keys, DB creds, certs, tokens)
3. Rotation automation
4. Access control y audit logging
5. Secret injection en CI/CD
6. Emergency break-glass procedures
7. Secret scanning en repos (git-secrets, gitleaks)
8. Migration de hardcoded secrets

FORMATO: Arquitectura + configs + runbooks.
IDIOMA: {{LANG_OUTPUT}}`,
            en: `Act as a **Security Engineer** specializing in secrets management.

Design a **Secrets Management Plan** for:
- **Infrastructure:** {{INFRA}}
- **Secret types:** {{SECRETS}}
- **Rotation policy:** {{ROTATION}}

INCLUDE:
1. HashiCorp Vault or AWS Secrets Manager config
2. Secret types classification (API keys, DB creds, certs, tokens)
3. Rotation automation
4. Access control and audit logging
5. Secret injection in CI/CD
6. Emergency break-glass procedures
7. Secret scanning in repos (git-secrets, gitleaks)
8. Migration from hardcoded secrets

FORMAT: Architecture + configs + runbooks.
LANGUAGE: {{LANG_OUTPUT}}`
        },
        tags: ['secrets', 'vault', 'security', 'rotation', 'credentials']
    },
    {
        id: 'zero_trust_architecture',
        category: 'security',
        icon: '🏗️',
        title: { es: 'Zero Trust Architecture Design', en: 'Zero Trust Architecture Design' },
        description: { es: 'Diseño de arquitectura Zero Trust con identidad, red y datos.', en: 'Zero Trust architecture design with identity, network, and data.' },
        prompt: {
            es: `Actúa como un **Zero Trust Security Architect**.

Diseña una **Arquitectura Zero Trust** para:
- **Tamaño de organización:** {{ORG_SIZE}}
- **Infraestructura:** {{INFRA}}
- **Requisitos de compliance:** {{COMPLIANCE}}

PILARES:
1. Identity (MFA, SSO, conditional access, PAM)
2. Device (MDM, endpoint security, compliance checks)
3. Network (micro-segmentation, ZTNA, SDP)
4. Application (API gateway, WAF, service mesh)
5. Data (classification, encryption, DLP)
6. Visibility & Analytics (SIEM, UEBA, logging)
7. Automation & Orchestration (SOAR)
8. Implementation roadmap por fases

FORMATO: Documento de arquitectura con diagramas descritos.
IDIOMA: {{LANG_OUTPUT}}`,
            en: `Act as a **Zero Trust Security Architect**.

Design a **Zero Trust Architecture** for:
- **Organization size:** {{ORG_SIZE}}
- **Infrastructure:** {{INFRA}}
- **Compliance requirements:** {{COMPLIANCE}}

PILLARS:
1. Identity (MFA, SSO, conditional access, PAM)
2. Device (MDM, endpoint security, compliance checks)
3. Network (micro-segmentation, ZTNA, SDP)
4. Application (API gateway, WAF, service mesh)
5. Data (classification, encryption, DLP)
6. Visibility & Analytics (SIEM, UEBA, logging)
7. Automation & Orchestration (SOAR)
8. Phased implementation roadmap

FORMAT: Architecture document with described diagrams.
LANGUAGE: {{LANG_OUTPUT}}`
        },
        tags: ['zero-trust', 'architecture', 'security', 'identity', 'network']
    },
    {
        id: 'soc2_readiness',
        category: 'security',
        icon: '✅',
        title: { es: 'SOC 2 Readiness Checklist', en: 'SOC 2 Readiness Checklist' },
        description: { es: 'Checklist de preparación para auditoría SOC 2 Type II.', en: 'Readiness checklist for SOC 2 Type II audit.' },
        prompt: {
            es: `Actúa como un **SOC 2 Compliance Consultant**.

Crea un **SOC 2 Readiness Checklist** para:
- **Organización:** {{ORG}}
- **Scope:** {{SCOPE}}
- **Timeline:** {{TIMELINE}}

TRUST SERVICE CRITERIA:
1. Security (Common Criteria)
2. Availability
3. Processing Integrity
4. Confidentiality
5. Privacy

PARA CADA CRITERIO:
- Controles requeridos
- Evidencia necesaria
- Gap analysis template
- Remediation plan
- Owner asignado

FORMATO: Checklist con tablas y timeline.
IDIOMA: {{LANG_OUTPUT}}`,
            en: `Act as a **SOC 2 Compliance Consultant**.

Create a **SOC 2 Readiness Checklist** for:
- **Organization:** {{ORG}}
- **Scope:** {{SCOPE}}
- **Timeline:** {{TIMELINE}}

TRUST SERVICE CRITERIA:
1. Security (Common Criteria)
2. Availability
3. Processing Integrity
4. Confidentiality
5. Privacy

FOR EACH CRITERION:
- Required controls
- Evidence needed
- Gap analysis template
- Remediation plan
- Assigned owner

FORMAT: Checklist with tables and timeline.
LANGUAGE: {{LANG_OUTPUT}}`
        },
        tags: ['soc2', 'compliance', 'audit', 'security', 'trust']
    },
    {
        id: 'bug_bounty_program',
        category: 'security',
        icon: '🐛',
        title: { es: 'Bug Bounty Program', en: 'Bug Bounty Program' },
        description: { es: 'Programa de bug bounty con scope, reglas, rewards y triage.', en: 'Bug bounty program with scope, rules, rewards, and triage.' },
        prompt: {
            es: `Actúa como un **Application Security Lead**.

Diseña un **Bug Bounty Program** para:
- **Aplicación:** {{APP}}
- **Scope:** {{SCOPE}}
- **Budget:** {{BUDGET}}

INCLUYE:
1. Scope definition (in/out of scope)
2. Reward tiers por severidad
3. Rules of engagement
4. Submission guidelines
5. Triage process y SLAs
6. Safe harbor policy
7. Hall of Fame
8. Programa de divulgación responsable

FORMATO: Documento de programa completo.
IDIOMA: {{LANG_OUTPUT}}`,
            en: `Act as an **Application Security Lead**.

Design a **Bug Bounty Program** for:
- **Application:** {{APP}}
- **Scope:** {{SCOPE}}
- **Budget:** {{BUDGET}}

INCLUDE:
1. Scope definition (in/out of scope)
2. Reward tiers by severity
3. Rules of engagement
4. Submission guidelines
5. Triage process and SLAs
6. Safe harbor policy
7. Hall of Fame
8. Responsible disclosure program

FORMAT: Complete program document.
LANGUAGE: {{LANG_OUTPUT}}`
        },
        tags: ['bug-bounty', 'security', 'vulnerability', 'disclosure', 'rewards']
    },
    {
        id: 'api_security_audit',
        category: 'security',
        icon: '🌐',
        title: { es: 'API Security Audit', en: 'API Security Audit' },
        description: { es: 'Revisión de endpoints con auth, rate limiting, input validation.', en: 'Endpoint review with auth, rate limiting, input validation.' },
        prompt: {
            es: `Actúa como un **API Security Specialist**.

Realiza un **API Security Audit** para:
- **API:** {{API_URL}}
- **Framework:** {{FRAMEWORK}}
- **Scope:** {{SCOPE}}

CHECKLIST:
1. Authentication (JWT, OAuth, API keys)
2. Authorization (RBAC, ABAC, IDOR)
3. Input validation (SQLi, XSS, injection)
4. Rate limiting y throttling
5. CORS configuration
6. Error handling (info leakage)
7. Data exposure (over-fetching, PII)
8. Logging y monitoring

FORMATO: Reporte con hallazgos, severidad y remediation.
IDIOMA: {{LANG_OUTPUT}}`,
            en: `Act as an **API Security Specialist**.

Perform an **API Security Audit** for:
- **API:** {{API_URL}}
- **Framework:** {{FRAMEWORK}}
- **Scope:** {{SCOPE}}

CHECKLIST:
1. Authentication (JWT, OAuth, API keys)
2. Authorization (RBAC, ABAC, IDOR)
3. Input validation (SQLi, XSS, injection)
4. Rate limiting and throttling
5. CORS configuration
6. Error handling (info leakage)
7. Data exposure (over-fetching, PII)
8. Logging and monitoring

FORMAT: Report with findings, severity, and remediation.
LANGUAGE: {{LANG_OUTPUT}}`
        },
        tags: ['api', 'security', 'audit', 'authentication', 'authorization']
    },
    {
        id: 'mobile_security_audit',
        category: 'security',
        icon: '📱',
        title: { es: 'Mobile Security Audit', en: 'Mobile Security Audit' },
        description: { es: 'Revisión de seguridad mobile con storage, network y permissions.', en: 'Mobile security review with storage, network, and permissions.' },
        prompt: {
            es: `Actúa como un **Mobile Security Engineer**.

Realiza un **Mobile Security Audit** para:
- **Plataforma:** {{PLATFORM}}
- **Framework:** {{FRAMEWORK}}
- **Scope:** {{SCOPE}}

CHECKLIST OWASP MASVS:
1. Storage (keychain/keystore, SQLite, files)
2. Crypto (algorithms, key management)
3. Auth (biometrics, session, tokens)
4. Network (TLS pinning, cert validation)
5. Platform interaction (permissions, intents)
6. Code quality (obfuscation, debugging)
7. Resilience (root/jailbreak detection, tampering)
8. Privacy (data collection, consent)

FORMATO: Reporte con hallazgos y remediation.
IDIOMA: {{LANG_OUTPUT}}`,
            en: `Act as a **Mobile Security Engineer**.

Perform a **Mobile Security Audit** for:
- **Platform:** {{PLATFORM}}
- **Framework:** {{FRAMEWORK}}
- **Scope:** {{SCOPE}}

OWASP MASVS CHECKLIST:
1. Storage (keychain/keystore, SQLite, files)
2. Crypto (algorithms, key management)
3. Auth (biometrics, session, tokens)
4. Network (TLS pinning, cert validation)
5. Platform interaction (permissions, intents)
6. Code quality (obfuscation, debugging)
7. Resilience (root/jailbreak detection, tampering)
8. Privacy (data collection, consent)

FORMAT: Report with findings and remediation.
LANGUAGE: {{LANG_OUTPUT}}`
        },
        tags: ['mobile', 'security', 'audit', 'owasp', 'masvs']
    },
    {
        id: 'cloud_infra_audit',
        category: 'security',
        icon: '☁️',
        title: { es: 'Cloud Infrastructure Audit', en: 'Cloud Infrastructure Audit' },
        description: { es: 'Revisión de cloud config con IAM, networking y encryption.', en: 'Cloud config review with IAM, networking, and encryption.' },
        prompt: {
            es: `Actúa como un **Cloud Security Engineer**.

Realiza un **Cloud Infrastructure Audit** para:
- **Cloud Provider:** {{CLOUD}}
- **Servicios:** {{SERVICES}}
- **Compliance:** {{COMPLIANCE}}

CHECKLIST:
1. IAM (least privilege, MFA, roles, policies)
2. Networking (security groups, NACLs, VPC)
3. Storage (encryption, public access, versioning)
4. Compute (hardening, patching, monitoring)
5. Database (encryption, backups, access)
6. Logging (CloudTrail, audit logs, retention)
7. Compliance (CIS Benchmarks, Well-Architected)
8. Cost anomalies como indicador de compromiso

FORMATO: Reporte con scoring y remediation prioritizada.
IDIOMA: {{LANG_OUTPUT}}`,
            en: `Act as a **Cloud Security Engineer**.

Perform a **Cloud Infrastructure Audit** for:
- **Cloud Provider:** {{CLOUD}}
- **Services:** {{SERVICES}}
- **Compliance:** {{COMPLIANCE}}

CHECKLIST:
1. IAM (least privilege, MFA, roles, policies)
2. Networking (security groups, NACLs, VPC)
3. Storage (encryption, public access, versioning)
4. Compute (hardening, patching, monitoring)
5. Database (encryption, backups, access)
6. Logging (CloudTrail, audit logs, retention)
7. Compliance (CIS Benchmarks, Well-Architected)
8. Cost anomalies as compromise indicator

FORMAT: Report with scoring and prioritized remediation.
LANGUAGE: {{LANG_OUTPUT}}`
        },
        tags: ['cloud', 'security', 'audit', 'iam', 'compliance']
    },

    // ─── Writing Extended ─────────────────────────────────────────────────────

    {
        id: 'developer_onboarding',
        category: 'writing',
        icon: '🚪',
        title: { es: 'Developer Onboarding Guide', en: 'Developer Onboarding Guide' },
        description: { es: 'Guía de onboarding para nuevos desarrolladores con setup y primeros pasos.', en: 'Onboarding guide for new developers with setup and first steps.' },
        prompt: {
            es: `Actúa como un **Engineering Manager**.

Crea una **Developer Onboarding Guide** para:
- **Proyecto:** {{PROJECT}}
- **Stack:** {{STACK}}
- **Equipo:** {{TEAM}}

SECCIONES:
1. Welcome & team intro
2. Development environment setup (paso a paso)
3. Project structure walkthrough
4. First task (good first issue)
5. Code review process
6. CI/CD overview
7. Communication channels y rituals
8. Resources y documentación

FORMATO: Markdown con checklists y comandos copy-paste.
IDIOMA: {{LANG_OUTPUT}}`,
            en: `Act as an **Engineering Manager**.

Create a **Developer Onboarding Guide** for:
- **Project:** {{PROJECT}}
- **Stack:** {{STACK}}
- **Team:** {{TEAM}}

SECTIONS:
1. Welcome & team intro
2. Development environment setup (step by step)
3. Project structure walkthrough
4. First task (good first issue)
5. Code review process
6. CI/CD overview
7. Communication channels and rituals
8. Resources and documentation

FORMAT: Markdown with checklists and copy-paste commands.
LANGUAGE: {{LANG_OUTPUT}}`
        },
        tags: ['onboarding', 'developer', 'guide', 'setup', 'team']
    },
    {
        id: 'operational_runbook',
        category: 'writing',
        icon: '📖',
        title: { es: 'Runbook Operacional', en: 'Operational Runbook' },
        description: { es: 'Procedimientos operacionales para incidentes y mantenimiento.', en: 'Operational procedures for incidents and maintenance.' },
        prompt: {
            es: `Actúa como un **Senior SRE**.

Crea un **Runbook Operacional** para:
- **Sistema:** {{SYSTEM}}
- **Escenarios:** {{SCENARIOS}}
- **Herramientas:** {{TOOLS}}

INCLUYE:
1. Service overview y dependencias
2. Common incidents y resolución
3. Maintenance procedures
4. Escalation paths
5. Contact list
6. Monitoring dashboards
7. Backup/restore procedures
8. Post-incident review template

FORMATO: Runbook con pasos numerados.
IDIOMA: {{LANG_OUTPUT}}`,
            en: `Act as a **Senior SRE**.

Create an **Operational Runbook** for:
- **System:** {{SYSTEM}}
- **Scenarios:** {{SCENARIOS}}
- **Tools:** {{TOOLS}}

INCLUDE:
1. Service overview and dependencies
2. Common incidents and resolution
3. Maintenance procedures
4. Escalation paths
5. Contact list
6. Monitoring dashboards
7. Backup/restore procedures
8. Post-incident review template

FORMAT: Runbook with numbered steps.
LANGUAGE: {{LANG_OUTPUT}}`
        },
        tags: ['runbook', 'operations', 'sre', 'incidents', 'maintenance']
    },
    {
        id: 'api_migration_guide',
        category: 'writing',
        icon: '🔄',
        title: { es: 'API Migration Guide (v1→v2)', en: 'API Migration Guide (v1→v2)' },
        description: { es: 'Guía de migración de API con breaking changes y ejemplos.', en: 'API migration guide with breaking changes and examples.' },
        prompt: {
            es: `Actúa como un **API Platform Engineer**.

Crea una **API Migration Guide** para:
- **API:** {{API}}
- **Versiones:** {{VERSIONS}}
- **Fecha de deprecación:** {{DEPRECATION}}

INCLUYE:
1. Overview de cambios (breaking vs non-breaking)
2. Breaking changes detallados con ejemplos before/after
3. Deprecation timeline
4. Código de migración por lenguaje
5. FAQ y troubleshooting
6. Support channels
7. Backwards compatibility notes
8. Automated migration tools si existen

FORMATO: Markdown con tablas comparativas y snippets.
IDIOMA: {{LANG_OUTPUT}}`,
            en: `Act as an **API Platform Engineer**.

Create an **API Migration Guide** for:
- **API:** {{API}}
- **Versions:** {{VERSIONS}}
- **Deprecation date:** {{DEPRECATION}}

INCLUDE:
1. Changes overview (breaking vs non-breaking)
2. Detailed breaking changes with before/after examples
3. Deprecation timeline
4. Migration code per language
5. FAQ and troubleshooting
6. Support channels
7. Backwards compatibility notes
8. Automated migration tools if available

FORMAT: Markdown with comparison tables and snippets.
LANGUAGE: {{LANG_OUTPUT}}`
        },
        tags: ['api', 'migration', 'breaking-changes', 'deprecation', 'developer-experience']
    },
    {
        id: 'incident_postmortem',
        category: 'writing',
        icon: '🔍',
        title: { es: 'Postmortem de Incidente', en: 'Incident Postmortem' },
        description: { es: 'Reporte de postmortem blameless con timeline, root cause y action items.', en: 'Blameless postmortem report with timeline, root cause, and action items.' },
        prompt: {
            es: `Actúa como un **Incident Commander**.

Escribe un **Postmortem de Incidente** para:
- **Incidente:** {{INCIDENT}}
- **Impacto:** {{IMPACT}}
- **Timeline:** {{TIMELINE}}

SECCIONES:
1. Summary (qué pasó, impacto, duración)
2. Timeline detallada (detección → respuesta → resolución)
3. Root cause analysis (5 Whys)
4. What went well
5. What went wrong
6. Where we got lucky
7. Action items con owner y deadline
8. Lessons learned

TONO: Blameless, objetivo, orientado a mejora.
FORMATO: Markdown con tablas.
IDIOMA: {{LANG_OUTPUT}}`,
            en: `Act as an **Incident Commander**.

Write an **Incident Postmortem** for:
- **Incident:** {{INCIDENT}}
- **Impact:** {{IMPACT}}
- **Timeline:** {{TIMELINE}}

SECTIONS:
1. Summary (what happened, impact, duration)
2. Detailed timeline (detection → response → resolution)
3. Root cause analysis (5 Whys)
4. What went well
5. What went wrong
6. Where we got lucky
7. Action items with owner and deadline
8. Lessons learned

TONE: Blameless, objective, improvement-oriented.
FORMAT: Markdown with tables.
LANGUAGE: {{LANG_OUTPUT}}`
        },
        tags: ['postmortem', 'incident', 'blameless', 'root-cause', 'sre']
    },
    {
        id: 'contributing_guide',
        category: 'writing',
        icon: '🤝',
        title: { es: 'CONTRIBUTING.md', en: 'CONTRIBUTING.md' },
        description: { es: 'Guidelines de contribución para proyectos open source.', en: 'Contribution guidelines for open source projects.' },
        prompt: {
            es: `Actúa como un **Open Source Maintainer**.

Crea un **CONTRIBUTING.md** para:
- **Proyecto:** {{PROJECT}}
- **Lenguaje:** {{LANGUAGE}}
- **Convenciones:** {{CONVENTIONS}}

SECCIONES:
1. Welcome y code of conduct
2. How to contribute (issues, PRs, discussions)
3. Development setup
4. Coding standards y style guide
5. Commit message convention
6. Testing requirements
7. PR process y review checklist
8. Release process

FORMATO: Markdown con emojis y ejemplos.
IDIOMA: {{LANG_OUTPUT}}`,
            en: `Act as an **Open Source Maintainer**.

Create a **CONTRIBUTING.md** for:
- **Project:** {{PROJECT}}
- **Language:** {{LANGUAGE}}
- **Conventions:** {{CONVENTIONS}}

SECTIONS:
1. Welcome and code of conduct
2. How to contribute (issues, PRs, discussions)
3. Development setup
4. Coding standards and style guide
5. Commit message convention
6. Testing requirements
7. PR process and review checklist
8. Release process

FORMAT: Markdown with emojis and examples.
LANGUAGE: {{LANG_OUTPUT}}`
        },
        tags: ['contributing', 'open-source', 'guidelines', 'community', 'github']
    },
    {
        id: 'architecture_overview',
        category: 'writing',
        icon: '🏗️',
        title: { es: 'Architecture Overview Document', en: 'Architecture Overview Document' },
        description: { es: 'Documento de arquitectura de alto nivel con diagramas y decisiones.', en: 'High-level architecture document with diagrams and decisions.' },
        prompt: {
            es: `Actúa como un **Principal Software Architect**.

Crea un **Architecture Overview Document** para:
- **Sistema:** {{SYSTEM}}
- **Componentes:** {{COMPONENTS}}
- **Audiencia:** {{AUDIENCE}}

SECCIONES:
1. System context y scope
2. Architecture principles
3. Component diagram (descripción textual)
4. Data flow
5. Technology decisions con justificación
6. Non-functional requirements
7. Scalability y resilience
8. Security considerations
9. Deployment topology
10. Future evolution

FORMATO: Documento técnico con Mermaid diagrams.
IDIOMA: {{LANG_OUTPUT}}`,
            en: `Act as a **Principal Software Architect**.

Create an **Architecture Overview Document** for:
- **System:** {{SYSTEM}}
- **Components:** {{COMPONENTS}}
- **Audience:** {{AUDIENCE}}

SECTIONS:
1. System context and scope
2. Architecture principles
3. Component diagram (textual description)
4. Data flow
5. Technology decisions with justification
6. Non-functional requirements
7. Scalability and resilience
8. Security considerations
9. Deployment topology
10. Future evolution

FORMAT: Technical document with Mermaid diagrams.
LANGUAGE: {{LANG_OUTPUT}}`
        },
        tags: ['architecture', 'overview', 'design', 'documentation', 'system']
    },
    {
        id: 'decision_log',
        category: 'writing',
        icon: '📋',
        title: { es: 'Decision Log (Lightweight ADR)', en: 'Decision Log (Lightweight ADR)' },
        description: { es: 'Registro ligero de decisiones técnicas con contexto y estado.', en: 'Lightweight technical decision log with context and status.' },
        prompt: {
            es: `Actúa como un **Tech Lead**.

Crea un **Decision Log** para:
- **Proyecto:** {{PROJECT}}
- **Decisión:** {{DECISION}}
- **Estado:** {{STATUS}}

FORMATO por decisión:
1. **ID**: DEC-001
2. **Título**: Decisión tomada
3. **Estado**: Proposed | Accepted | Deprecated | Superseded
4. **Contexto**: Por qué necesitamos decidir
5. **Decisión**: Qué decidimos
6. **Consecuencias**: Impacto positivo y negativo
7. **Alternativas**: Qué más consideramos
8. **Fecha y autores**

INCLUYE: Template + 3 ejemplos realistas.
IDIOMA: {{LANG_OUTPUT}}`,
            en: `Act as a **Tech Lead**.

Create a **Decision Log** for:
- **Project:** {{PROJECT}}
- **Decision:** {{DECISION}}
- **Status:** {{STATUS}}

FORMAT per decision:
1. **ID**: DEC-001
2. **Title**: Decision made
3. **Status**: Proposed | Accepted | Deprecated | Superseded
4. **Context**: Why we need to decide
5. **Decision**: What we decided
6. **Consequences**: Positive and negative impact
7. **Alternatives**: What else we considered
8. **Date and authors**

INCLUDE: Template + 3 realistic examples.
LANGUAGE: {{LANG_OUTPUT}}`
        },
        tags: ['decisions', 'adr', 'log', 'technical', 'documentation']
    },
    {
        id: 'email_sequence',
        category: 'writing',
        icon: '📧',
        title: { es: 'Email Marketing Sequence', en: 'Email Marketing Sequence' },
        description: { es: 'Secuencia de emails con onboarding, nurture y re-engagement.', en: 'Email sequence with onboarding, nurture, and re-engagement.' },
        prompt: {
            es: `Actúa como un **Email Marketing Strategist**.

Crea una **Email Sequence** para:
- **Producto:** {{PRODUCT}}
- **Audiencia:** {{AUDIENCE}}
- **Objetivo:** {{GOAL}}

SECUENCIA:
1. Welcome email (día 0)
2. Value delivery (día 2)
3. Social proof (día 5)
4. Soft CTA (día 8)
5. Hard CTA (día 12)
6. Re-engagement (día 21)

POR EMAIL:
- Subject line (3 variantes)
- Preview text
- Body copy
- CTA
- Personalización tokens

FORMATO: Email copy completo con notas estratégicas.
IDIOMA: {{LANG_OUTPUT}}`,
            en: `Act as an **Email Marketing Strategist**.

Create an **Email Sequence** for:
- **Product:** {{PRODUCT}}
- **Audience:** {{AUDIENCE}}
- **Goal:** {{GOAL}}

SEQUENCE:
1. Welcome email (day 0)
2. Value delivery (day 2)
3. Social proof (day 5)
4. Soft CTA (day 8)
5. Hard CTA (day 12)
6. Re-engagement (day 21)

PER EMAIL:
- Subject line (3 variants)
- Preview text
- Body copy
- CTA
- Personalization tokens

FORMAT: Complete email copy with strategic notes.
LANGUAGE: {{LANG_OUTPUT}}`
        },
        tags: ['email', 'marketing', 'sequence', 'copywriting', 'conversion']
    },
    {
        id: 'landing_page_copy',
        category: 'writing',
        icon: '🎯',
        title: { es: 'Landing Page Copy', en: 'Landing Page Copy' },
        description: { es: 'Copy de landing page con hook, beneficios, social proof y CTA.', en: 'Landing page copy with hook, benefits, social proof, and CTA.' },
        prompt: {
            es: `Actúa como un **Conversion Copywriter**.

Escribe el **Copy de Landing Page** para:
- **Producto:** {{PRODUCT}}
- **Audiencia:** {{AUDIENCE}}
- **CTA Goal:** {{CTA_GOAL}}

SECCIONES:
1. Hero (headline + subheadline + CTA)
2. Problem agitation
3. Solution presentation
4. Key benefits (3-5)
5. Social proof (testimonials, logos, metrics)
6. How it works (3 pasos)
7. FAQ (objeciones comunes)
8. Final CTA

REQUISITOS: Copy persuasivo, scannable, orientado a conversión.
FORMATO: Markdown con notas de diseño.
IDIOMA: {{LANG_OUTPUT}}`,
            en: `Act as a **Conversion Copywriter**.

Write the **Landing Page Copy** for:
- **Product:** {{PRODUCT}}
- **Audience:** {{AUDIENCE}}
- **CTA Goal:** {{CTA_GOAL}}

SECTIONS:
1. Hero (headline + subheadline + CTA)
2. Problem agitation
3. Solution presentation
4. Key benefits (3-5)
5. Social proof (testimonials, logos, metrics)
6. How it works (3 steps)
7. FAQ (common objections)
8. Final CTA

REQUIREMENTS: Persuasive copy, scannable, conversion-oriented.
FORMAT: Markdown with design notes.
LANGUAGE: {{LANG_OUTPUT}}`
        },
        tags: ['landing-page', 'copywriting', 'conversion', 'marketing', 'persuasion']
    },
    {
        id: 'seo_content_brief',
        category: 'writing',
        icon: '🔍',
        title: { es: 'SEO Content Brief', en: 'SEO Content Brief' },
        description: { es: 'Brief de contenido optimizado para SEO con keywords y estructura.', en: 'SEO-optimized content brief with keywords and structure.' },
        prompt: {
            es: `Actúa como un **SEO Content Strategist**.

Crea un **SEO Content Brief** para:
- **Tema:** {{TOPIC}}
- **Keywords objetivo:** {{KEYWORDS}}
- **Competidores:** {{COMPETITORS}}

INCLUYE:
1. Target keyword + secondary keywords
2. Search intent analysis
3. Suggested title (SEO-optimized)
4. Meta description
5. URL slug
6. Content outline con H2/H3
7. Word count recommendation
8. Internal linking suggestions
9. Featured snippet optimization
10. Schema markup suggestions

FORMATO: Brief estructurado con tablas.
IDIOMA: {{LANG_OUTPUT}}`,
            en: `Act as an **SEO Content Strategist**.

Create an **SEO Content Brief** for:
- **Topic:** {{TOPIC}}
- **Target keywords:** {{KEYWORDS}}
- **Competitors:** {{COMPETITORS}}

INCLUDE:
1. Target keyword + secondary keywords
2. Search intent analysis
3. Suggested title (SEO-optimized)
4. Meta description
5. URL slug
6. Content outline with H2/H3
7. Word count recommendation
8. Internal linking suggestions
9. Featured snippet optimization
10. Schema markup suggestions

FORMAT: Structured brief with tables.
LANGUAGE: {{LANG_OUTPUT}}`
        },
        tags: ['seo', 'content', 'brief', 'keywords', 'structure']
    },

    // ─── Business Extended ────────────────────────────────────────────────────

    {
        id: 'user_story_map',
        category: 'business',
        icon: '🗺️',
        title: { es: 'User Story Map', en: 'User Story Map' },
        description: { es: 'Mapeo visual de user stories con backbone, épicas y slicing.', en: 'Visual user story mapping with backbone, epics, and slicing.' },
        prompt: {
            es: `Actúa como un **Senior Product Manager**.

Crea un **User Story Map** para:
- **Producto:** {{PRODUCT}}
- **Usuarios:** {{USERS}}
- **Releases:** {{RELEASES}}

INCLUYE:
1. Backbone (actividades principales del usuario)
2. Tasks bajo cada actividad
3. User stories detalladas con formato "Como [rol], quiero [acción] para [beneficio]"
4. Release slicing (v1 MVP, v2, v3)
5. Priorización (Must/Should/Could)
6. Acceptance criteria por story
7. Dependencies entre stories
8. Estimación de esfuerzo (T-shirt sizes)

FORMATO: Tabla markdown con niveles jerárquicos.
IDIOMA: {{LANG_OUTPUT}}`,
            en: `Act as a **Senior Product Manager**.

Create a **User Story Map** for:
- **Product:** {{PRODUCT}}
- **Users:** {{USERS}}
- **Releases:** {{RELEASES}}

INCLUDE:
1. Backbone (main user activities)
2. Tasks under each activity
3. Detailed user stories with "As [role], I want [action] to [benefit]"
4. Release slicing (v1 MVP, v2, v3)
5. Prioritization (Must/Should/Could)
6. Acceptance criteria per story
7. Dependencies between stories
8. Effort estimation (T-shirt sizes)

FORMAT: Markdown table with hierarchical levels.
LANGUAGE: {{LANG_OUTPUT}}`
        },
        tags: ['user-stories', 'mapping', 'agile', 'product', 'backlog']
    },
    {
        id: 'competitor_matrix',
        category: 'business',
        icon: '⚖️',
        title: { es: 'Competitor Feature Matrix', en: 'Competitor Feature Matrix' },
        description: { es: 'Matriz comparativa de features con competidores.', en: 'Feature comparison matrix with competitors.' },
        prompt: {
            es: `Actúa como un **Product Strategist**.

Crea una **Competitor Feature Matrix** para:
- **Producto:** {{PRODUCT}}
- **Competidores:** {{COMPETITORS}}
- **Features a comparar:** {{FEATURES}}

INCLUYE:
1. Tabla comparativa con checkmarks
2. Feature gap analysis
3. Pricing comparison
4. Target audience comparison
5. SWOT por competidor
6. Unique value proposition de nuestro producto
7. Feature prioritization recommendation
8. Market positioning map

FORMATO: Tablas markdown + análisis estratégico.
IDIOMA: {{LANG_OUTPUT}}`,
            en: `Act as a **Product Strategist**.

Create a **Competitor Feature Matrix** for:
- **Product:** {{PRODUCT}}
- **Competitors:** {{COMPETITORS}}
- **Features to compare:** {{FEATURES}}

INCLUDE:
1. Comparison table with checkmarks
2. Feature gap analysis
3. Pricing comparison
4. Target audience comparison
5. SWOT per competitor
6. Our product's unique value proposition
7. Feature prioritization recommendation
8. Market positioning map

FORMAT: Markdown tables + strategic analysis.
LANGUAGE: {{LANG_OUTPUT}}`
        },
        tags: ['competitor', 'matrix', 'analysis', 'strategy', 'features']
    },
    {
        id: 'risk_register',
        category: 'business',
        icon: '⚠️',
        title: { es: 'Risk Register', en: 'Risk Register' },
        description: { es: 'Registro de riesgos con probabilidad, impacto y mitigación.', en: 'Risk register with probability, impact, and mitigation.' },
        prompt: {
            es: `Actúa como un **Project Risk Manager**.

Crea un **Risk Register** para:
- **Proyecto:** {{PROJECT}}
- **Riesgos identificados:** {{RISKS}}
- **Plan de mitigación:** {{MITIGATION}}

INCLUYE:
1. Risk ID y descripción
2. Categoría (técnico, negocio, externo, organizacional)
3. Probabilidad (1-5)
4. Impacto (1-5)
5. Risk score (P × I)
6. Owner asignado
7. Mitigation strategy
8. Contingency plan
9. Status (open, monitoring, closed)
10. Review date

FORMATO: Tabla con heatmap de riesgos.
IDIOMA: {{LANG_OUTPUT}}`,
            en: `Act as a **Project Risk Manager**.

Create a **Risk Register** for:
- **Project:** {{PROJECT}}
- **Identified risks:** {{RISKS}}
- **Mitigation plan:** {{MITIGATION}}

INCLUDE:
1. Risk ID and description
2. Category (technical, business, external, organizational)
3. Probability (1-5)
4. Impact (1-5)
5. Risk score (P × I)
6. Assigned owner
7. Mitigation strategy
8. Contingency plan
9. Status (open, monitoring, closed)
10. Review date

FORMAT: Table with risk heatmap.
LANGUAGE: {{LANG_OUTPUT}}`
        },
        tags: ['risk', 'register', 'management', 'project', 'mitigation']
    },
    {
        id: 'okr_template',
        category: 'business',
        icon: '🎯',
        title: { es: 'OKR Template', en: 'OKR Template' },
        description: { es: 'Objetivos y Key Results con métricas y checkpoints.', en: 'Objectives and Key Results with metrics and checkpoints.' },
        prompt: {
            es: `Actúa como un **OKR Coach**.

Crea un **OKR Template** para:
- **Equipo:** {{TEAM}}
- **Quarter:** {{QUARTER}}
- **Objetivos:** {{OBJECTIVES}}

INCLUYE:
1. 3-5 Objectives (inspiracionales, cualitativos)
2. 3-5 Key Results por objetivo (medibles, cuantitativos)
3. Baseline y target por KR
4. Initiatives para cada KR
5. Owner por KR
6. Checkpoint schedule (weekly/biweekly)
7. Confidence scoring (1-10)
8. Retrospective template

FORMATO: Tabla con progress tracking.
IDIOMA: {{LANG_OUTPUT}}`,
            en: `Act as an **OKR Coach**.

Create an **OKR Template** for:
- **Team:** {{TEAM}}
- **Quarter:** {{QUARTER}}
- **Objectives:** {{OBJECTIVES}}

INCLUDE:
1. 3-5 Objectives (inspirational, qualitative)
2. 3-5 Key Results per objective (measurable, quantitative)
3. Baseline and target per KR
4. Initiatives for each KR
5. Owner per KR
6. Checkpoint schedule (weekly/biweekly)
7. Confidence scoring (1-10)
8. Retrospective template

FORMAT: Table with progress tracking.
LANGUAGE: {{LANG_OUTPUT}}`
        },
        tags: ['okr', 'goals', 'metrics', 'quarterly', 'tracking']
    },
    {
        id: 'tech_debt_register',
        category: 'business',
        icon: '📚',
        title: { es: 'Technical Debt Register', en: 'Technical Debt Register' },
        description: { es: 'Registro de deuda técnica con priorización y plan de pago.', en: 'Technical debt register with prioritization and paydown plan.' },
        prompt: {
            es: `Actúa como un **Engineering Manager**.

Crea un **Technical Debt Register** para:
- **Proyecto:** {{PROJECT}}
- **Items de deuda:** {{DEBT}}
- **Prioridad:** {{PRIORITY}}

INCLUYE:
1. Debt ID y descripción
2. Tipo (code, design, test, infra, docs)
3. Impacto (bajo, medio, alto, crítico)
4. Esfuerzo de remediation (S/M/L/XL)
5. Root cause
6. Business impact
7. Remediation plan
8. Target sprint/quarter
9. Owner
10. Status

FORMATO: Tabla con plan de paydown por sprint.
IDIOMA: {{LANG_OUTPUT}}`,
            en: `Act as an **Engineering Manager**.

Create a **Technical Debt Register** for:
- **Project:** {{PROJECT}}
- **Debt items:** {{DEBT}}
- **Priority:** {{PRIORITY}}

INCLUDE:
1. Debt ID and description
2. Type (code, design, test, infra, docs)
3. Impact (low, medium, high, critical)
4. Remediation effort (S/M/L/XL)
5. Root cause
6. Business impact
7. Remediation plan
8. Target sprint/quarter
9. Owner
10. Status

FORMAT: Table with paydown plan per sprint.
LANGUAGE: {{LANG_OUTPUT}}`
        },
        tags: ['tech-debt', 'register', 'engineering', 'prioritization', 'quality']
    },
    {
        id: 'gtm_plan',
        category: 'business',
        icon: '🚀',
        title: { es: 'Go-to-Market Plan', en: 'Go-to-Market Plan' },
        description: { es: 'Plan de lanzamiento con canales, messaging y timeline.', en: 'Launch plan with channels, messaging, and timeline.' },
        prompt: {
            es: `Actúa como un **GTM Strategist**.

Crea un **Go-to-Market Plan** para:
- **Producto:** {{PRODUCT}}
- **Mercado:** {{MARKET}}
- **Fecha de lanzamiento:** {{LAUNCH_DATE}}

INCLUYE:
1. Target market y buyer personas
2. Value proposition y messaging
3. Pricing strategy
4. Channel strategy (paid, organic, partnerships)
5. Launch timeline (pre-launch, launch, post-launch)
6. Sales enablement materials
7. Marketing campaigns plan
8. Success metrics y KPIs
9. Budget allocation
10. Risk mitigation

FORMATO: Plan estratégico con timeline.
IDIOMA: {{LANG_OUTPUT}}`,
            en: `Act as a **GTM Strategist**.

Create a **Go-to-Market Plan** for:
- **Product:** {{PRODUCT}}
- **Market:** {{MARKET}}
- **Launch date:** {{LAUNCH_DATE}}

INCLUDE:
1. Target market and buyer personas
2. Value proposition and messaging
3. Pricing strategy
4. Channel strategy (paid, organic, partnerships)
5. Launch timeline (pre-launch, launch, post-launch)
6. Sales enablement materials
7. Marketing campaigns plan
8. Success metrics and KPIs
9. Budget allocation
10. Risk mitigation

FORMAT: Strategic plan with timeline.
LANGUAGE: {{LANG_OUTPUT}}`
        },
        tags: ['gtm', 'launch', 'marketing', 'strategy', 'sales']
    },
    {
        id: 'sprint_planning',
        category: 'business',
        icon: '📅',
        title: { es: 'Sprint Planning Template', en: 'Sprint Planning Template' },
        description: { es: 'Template de sprint con capacity, stories y goals.', en: 'Sprint template with capacity, stories, and goals.' },
        prompt: {
            es: `Actúa como un **Scrum Master**.

Crea un **Sprint Planning Template** para:
- **Equipo:** {{TEAM}}
- **Sprint:** {{SPRINT}}
- **Capacity:** {{CAPACITY}}

INCLUYE:
1. Sprint goal
2. Team capacity (vacaciones, holidays)
3. Velocity history
4. Selected user stories con story points
5. Task breakdown por story
6. Definition of Ready / Done
7. Risk y dependencies
8. Sprint burndown chart template

FORMATO: Template con tablas y checklist.
IDIOMA: {{LANG_OUTPUT}}`,
            en: `Act as a **Scrum Master**.

Create a **Sprint Planning Template** for:
- **Team:** {{TEAM}}
- **Sprint:** {{SPRINT}}
- **Capacity:** {{CAPACITY}}

INCLUDE:
1. Sprint goal
2. Team capacity (vacations, holidays)
3. Velocity history
4. Selected user stories with story points
5. Task breakdown per story
6. Definition of Ready / Done
7. Risks and dependencies
8. Sprint burndown chart template

FORMAT: Template with tables and checklist.
LANGUAGE: {{LANG_OUTPUT}}`
        },
        tags: ['sprint', 'planning', 'scrum', 'agile', 'capacity']
    },
    {
        id: 'stakeholder_comm_plan',
        category: 'business',
        icon: '📢',
        title: { es: 'Stakeholder Communication Plan', en: 'Stakeholder Communication Plan' },
        description: { es: 'Plan de comunicación con frecuencia, canales y formatos.', en: 'Communication plan with frequency, channels, and formats.' },
        prompt: {
            es: `Actúa como un **Program Manager**.

Crea un **Stakeholder Communication Plan** para:
- **Proyecto:** {{PROJECT}}
- **Stakeholders:** {{STAKEHOLDERS}}
- **Frecuencia:** {{FREQUENCY}}

INCLUYE:
1. Stakeholder mapping (power/interest matrix)
2. Communication channels por stakeholder
3. Frequency y format (weekly report, monthly review, ad-hoc)
4. Content template por tipo de comunicación
5. Escalation paths
6. Feedback mechanism
7. Communication calendar
8. Success metrics para comunicación

FORMATO: Matriz con templates de comunicación.
IDIOMA: {{LANG_OUTPUT}}`,
            en: `Act as a **Program Manager**.

Create a **Stakeholder Communication Plan** for:
- **Project:** {{PROJECT}}
- **Stakeholders:** {{STAKEHOLDERS}}
- **Frequency:** {{FREQUENCY}}

INCLUDE:
1. Stakeholder mapping (power/interest matrix)
2. Communication channels per stakeholder
3. Frequency and format (weekly report, monthly review, ad-hoc)
4. Content template per communication type
5. Escalation paths
6. Feedback mechanism
7. Communication calendar
8. Communication success metrics

FORMAT: Matrix with communication templates.
LANGUAGE: {{LANG_OUTPUT}}`
        },
        tags: ['communication', 'stakeholders', 'plan', 'management', 'reporting']
    },

    // ─── Social Media ─────────────────────────────────────────────────────────

    {
        id: 'twitter_thread',
        category: 'social',
        icon: '🧵',
        title: { es: 'Hilo Viral en X/Twitter', en: 'Viral X/Twitter Thread' },
        description: { es: 'Thread de 8-12 tweets con hook, desarrollo y CTA.', en: '8-12 tweet thread with hook, development, and CTA.' },
        prompt: {
            es: `Actúa como un **Twitter Growth Strategist**.

Crea un **Hilo Viral en X/Twitter** para:
- **Tema:** {{TOPIC}}
- **Audiencia:** {{AUDIENCE}}
- **Tipo de hook:** {{HOOK_TYPE}}
- **CTA:** {{CTA}}

ESTRUCTURA:
1. Tweet 1: Hook irresistible (curiosity gap, contrarian, o story)
2. Tweets 2-7: Desarrollo con valor, datos, ejemplos
3. Tweet 8-10: Insights clave y takeaways
4. Tweet final: CTA + request de engagement

REGLAS:
- Máximo 280 chars por tweet
- Líneas cortas y scannable
- Emojis estratégicos
- Numeración (1/10, 2/10...)
- Espacios entre párrafos

FORMATO: Thread completo con notas de estrategia.
IDIOMA: {{LANG_OUTPUT}}`,
            en: `Act as a **Twitter Growth Strategist**.

Create a **Viral X/Twitter Thread** for:
- **Topic:** {{TOPIC}}
- **Audience:** {{AUDIENCE}}
- **Hook type:** {{HOOK_TYPE}}
- **CTA:** {{CTA}}

STRUCTURE:
1. Tweet 1: Irresistible hook (curiosity gap, contrarian, or story)
2. Tweets 2-7: Development with value, data, examples
3. Tweets 8-10: Key insights and takeaways
4. Final tweet: CTA + engagement request

RULES:
- Max 280 chars per tweet
- Short, scannable lines
- Strategic emojis
- Numbering (1/10, 2/10...)
- Spacing between paragraphs

FORMAT: Complete thread with strategy notes.
LANGUAGE: {{LANG_OUTPUT}}`
        },
        tags: ['twitter', 'thread', 'viral', 'social-media', 'engagement']
    },
    {
        id: 'instagram_carousel',
        category: 'social',
        icon: '📸',
        title: { es: 'Carrusel de Instagram', en: 'Instagram Carousel' },
        description: { es: 'Estructura de 8-10 slides con copy y dirección visual.', en: '8-10 slide structure with copy and visual direction.' },
        prompt: {
            es: `Actúa como un **Instagram Content Strategist**.

Crea un **Carrusel de Instagram** para:
- **Tema:** {{TOPIC}}
- **Objetivo:** {{GOAL}}
- **Estilo visual:** {{VISUAL_STYLE}}
- **Audiencia:** {{AUDIENCE}}

ESTRUCTURA (8-10 slides):
1. Slide 1: Hook visual + título impactante
2. Slide 2: Contexto/problema
3. Slides 3-7: Contenido valor (1 idea por slide)
4. Slide 8: Resumen/key takeaways
5. Slide 9: CTA (save, share, comment)
6. Slide 10: Brand slide

POR SLIDE:
- Copy del texto
- Dirección visual (colores, elementos, layout)
- Tipografía sugerida

FORMATO: Slide-by-slide con copy + brief visual.
IDIOMA: {{LANG_OUTPUT}}`,
            en: `Act as an **Instagram Content Strategist**.

Create an **Instagram Carousel** for:
- **Topic:** {{TOPIC}}
- **Goal:** {{GOAL}}
- **Visual style:** {{VISUAL_STYLE}}
- **Audience:** {{AUDIENCE}}

STRUCTURE (8-10 slides):
1. Slide 1: Visual hook + impactful title
2. Slide 2: Context/problem
3. Slides 3-7: Value content (1 idea per slide)
4. Slide 8: Summary/key takeaways
5. Slide 9: CTA (save, share, comment)
6. Slide 10: Brand slide

PER SLIDE:
- Text copy
- Visual direction (colors, elements, layout)
- Suggested typography

FORMAT: Slide-by-slide with copy + visual brief.
LANGUAGE: {{LANG_OUTPUT}}`
        },
        tags: ['instagram', 'carousel', 'social-media', 'visual', 'content']
    },
    {
        id: 'tiktok_reel_script',
        category: 'social',
        icon: '🎬',
        title: { es: 'Guion de TikTok/Reel', en: 'TikTok/Reel Script' },
        description: { es: 'Guion de 30-60s con hook visual, desarrollo y CTA.', en: '30-60s script with visual hook, development, and CTA.' },
        prompt: {
            es: `Actúa como un **Short-Form Video Strategist**.

Crea un **Guion de TikTok/Reel** para:
- **Tema:** {{TOPIC}}
- **Trend:** {{TREND}}
- **Duración:** {{DURATION}}
- **Estilo:** {{STYLE}}

ESTRUCTURA:
1. **Hook (0-3s)**: Visual + verbal que detiene el scroll
2. **Setup (3-8s)**: Contexto rápido
3. **Value (8-45s)**: Contenido principal con cortes dinámicos
4. **CTA (45-60s)**: Call to action natural

INCLUYE:
- Script palabra por palabra
- Indicaciones visuales por segmento
- Timing de cortes
- Sugerencia de audio/trend
- Texto en pantalla (captions)
- Hashtags recomendados

FORMATO: Guion con timestamps y notas de producción.
IDIOMA: {{LANG_OUTPUT}}`,
            en: `Act as a **Short-Form Video Strategist**.

Create a **TikTok/Reel Script** for:
- **Topic:** {{TOPIC}}
- **Trend:** {{TREND}}
- **Duration:** {{DURATION}}
- **Style:** {{STYLE}}

STRUCTURE:
1. **Hook (0-3s)**: Visual + verbal that stops the scroll
2. **Setup (3-8s)**: Quick context
3. **Value (8-45s)**: Main content with dynamic cuts
4. **CTA (45-60s)**: Natural call to action

INCLUDE:
- Word-for-word script
- Visual directions per segment
- Cut timing
- Audio/trend suggestion
- On-screen text (captions)
- Recommended hashtags

FORMAT: Script with timestamps and production notes.
LANGUAGE: {{LANG_OUTPUT}}`
        },
        tags: ['tiktok', 'reels', 'video', 'script', 'short-form']
    },
    {
        id: 'linkedin_post',
        category: 'social',
        icon: '💼',
        title: { es: 'Post LinkedIn Thought Leadership', en: 'LinkedIn Thought Leadership Post' },
        description: { es: 'Post largo con storytelling profesional y engagement.', en: 'Long-form post with professional storytelling and engagement.' },
        prompt: {
            es: `Actúa como un **LinkedIn Growth Expert**.

Crea un **Post de LinkedIn Thought Leadership** para:
- **Tema:** {{TOPIC}}
- **Industria:** {{INDUSTRY}}
- **Posición:** {{POSITION}}
- **CTA:** {{CTA}}

ESTRUCTURA:
1. **Hook (primera línea)**: Contrarian, story, o dato impactante
2. **Contexto**: Experiencia personal o caso real
3. **Insights**: 3-5 puntos de valor con formato scannable
4. **Lección**: Takeaway principal
5. **CTA**: Pregunta para generar comentarios

REGLAS:
- Líneas cortas (máx 2 líneas)
- Espacios entre párrafos
- Sin hashtags en el cuerpo (máx 3 al final)
- Tono profesional pero auténtico
- Máximo 3000 caracteres

FORMATO: Post completo con notas de estrategia.
IDIOMA: {{LANG_OUTPUT}}`,
            en: `Act as a **LinkedIn Growth Expert**.

Create a **LinkedIn Thought Leadership Post** for:
- **Topic:** {{TOPIC}}
- **Industry:** {{INDUSTRY}}
- **Position:** {{POSITION}}
- **CTA:** {{CTA}}

STRUCTURE:
1. **Hook (first line)**: Contrarian, story, or impactful data
2. **Context**: Personal experience or real case
3. **Insights**: 3-5 value points with scannable format
4. **Lesson**: Main takeaway
5. **CTA**: Question to generate comments

RULES:
- Short lines (max 2 lines)
- Spacing between paragraphs
- No hashtags in body (max 3 at end)
- Professional but authentic tone
- Max 3000 characters

FORMAT: Complete post with strategy notes.
LANGUAGE: {{LANG_OUTPUT}}`
        },
        tags: ['linkedin', 'thought-leadership', 'professional', 'engagement', 'b2b']
    },
    {
        id: 'content_calendar',
        category: 'social',
        icon: '📅',
        title: { es: 'Calendario de Contenido Semanal', en: 'Weekly Content Calendar' },
        description: { es: 'Plan de 7 días multi-plataforma con horarios y formatos.', en: '7-day multi-platform plan with schedules and formats.' },
        prompt: {
            es: `Actúa como un **Social Media Manager**.

Crea un **Calendario de Contenido Semanal** para:
- **Marca:** {{BRAND}}
- **Plataformas:** {{PLATFORMS}}
- **Pilares de contenido:** {{PILLARS}}
- **Objetivo:** {{GOAL}}

INCLUYE:
1. Lunes a Domingo con contenido por día
2. Plataforma específica por post
3. Tipo de contenido (educativo, entretenimiento, promocional, UGC)
4. Copy sugerido por post
5. Mejor horario de publicación
6. Hashtags por plataforma
7. Visual brief por post
8. Métricas a trackear

FORMATO: Tabla semanal con detalles por día.
IDIOMA: {{LANG_OUTPUT}}`,
            en: `Act as a **Social Media Manager**.

Create a **Weekly Content Calendar** for:
- **Brand:** {{BRAND}}
- **Platforms:** {{PLATFORMS}}
- **Content pillars:** {{PILLARS}}
- **Goal:** {{GOAL}}

INCLUDE:
1. Monday to Sunday with content per day
2. Specific platform per post
3. Content type (educational, entertainment, promotional, UGC)
4. Suggested copy per post
5. Best posting time
6. Hashtags per platform
7. Visual brief per post
8. Metrics to track

FORMAT: Weekly table with daily details.
LANGUAGE: {{LANG_OUTPUT}}`
        },
        tags: ['calendar', 'content', 'planning', 'social-media', 'schedule']
    },
    {
        id: 'launch_campaign',
        category: 'social',
        icon: '🎯',
        title: { es: 'Campaña de Lanzamiento en Redes', en: 'Social Media Launch Campaign' },
        description: { es: 'Estrategia de 2 semanas pre/durante/post lanzamiento.', en: '2-week pre/during/post launch strategy.' },
        prompt: {
            es: `Actúa como un **Launch Campaign Strategist**.

Crea una **Campaña de Lanzamiento** para:
- **Producto:** {{PRODUCT}}
- **Plataformas:** {{PLATFORMS}}
- **Fecha:** {{DATE}}
- **Budget:** {{BUDGET}}

FASES:
1. **Pre-launch (7 días)**: Teasers, countdown, behind-the-scenes
2. **Launch day**: Announcement, live event, influencer posts
3. **Post-launch (7 días)**: Social proof, testimonials, UGC, retargeting

POR FASE:
- Contenido por día
- Copy y creative brief
- Paid ads strategy
- Influencer coordination
- Engagement tactics
- Métricas y KPIs

FORMATO: Plan detallado con timeline.
IDIOMA: {{LANG_OUTPUT}}`,
            en: `Act as a **Launch Campaign Strategist**.

Create a **Launch Campaign** for:
- **Product:** {{PRODUCT}}
- **Platforms:** {{PLATFORMS}}
- **Date:** {{DATE}}
- **Budget:** {{BUDGET}}

PHASES:
1. **Pre-launch (7 days)**: Teasers, countdown, behind-the-scenes
2. **Launch day**: Announcement, live event, influencer posts
3. **Post-launch (7 days)**: Social proof, testimonials, UGC, retargeting

PER PHASE:
- Daily content
- Copy and creative brief
- Paid ads strategy
- Influencer coordination
- Engagement tactics
- Metrics and KPIs

FORMAT: Detailed plan with timeline.
LANGUAGE: {{LANG_OUTPUT}}`
        },
        tags: ['launch', 'campaign', 'social-media', 'product', 'marketing']
    },
    {
        id: 'social_competitor_analysis',
        category: 'social',
        icon: '📊',
        title: { es: 'Análisis de Competencia en Social', en: 'Social Competitor Analysis' },
        description: { es: 'Comparativa de estrategia social con métricas y gaps.', en: 'Social strategy comparison with metrics and gaps.' },
        prompt: {
            es: `Actúa como un **Social Media Analyst**.

Realiza un **Análisis de Competencia en Social** para:
- **Marca:** {{BRAND}}
- **Competidores:** {{COMPETITORS}}
- **Plataformas:** {{PLATFORMS}}

ANÁLISIS:
1. Presencia por plataforma (seguidores, engagement rate)
2. Tipo de contenido más performante
3. Frecuencia de publicación
4. Tono y voz de marca
5. Hashtag strategy
6. Influencer partnerships
7. Paid ads presence
8. Gaps y oportunidades para nuestra marca

FORMATO: Reporte con tablas comparativas y recomendaciones.
IDIOMA: {{LANG_OUTPUT}}`,
            en: `Act as a **Social Media Analyst**.

Perform a **Social Competitor Analysis** for:
- **Brand:** {{BRAND}}
- **Competitors:** {{COMPETITORS}}
- **Platforms:** {{PLATFORMS}}

ANALYSIS:
1. Presence per platform (followers, engagement rate)
2. Best-performing content type
3. Posting frequency
4. Brand tone and voice
5. Hashtag strategy
6. Influencer partnerships
7. Paid ads presence
8. Gaps and opportunities for our brand

FORMAT: Report with comparison tables and recommendations.
LANGUAGE: {{LANG_OUTPUT}}`
        },
        tags: ['competitor', 'analysis', 'social-media', 'metrics', 'strategy']
    },
    {
        id: 'hashtag_strategy',
        category: 'social',
        icon: '🔥',
        title: { es: 'Estrategia de Hashtags', en: 'Hashtag Strategy' },
        description: { es: 'Set de hashtags por plataforma con volumen y competencia.', en: 'Hashtag set per platform with volume and competition.' },
        prompt: {
            es: `Actúa como un **Social Media SEO Specialist**.

Crea una **Estrategia de Hashtags** para:
- **Tema:** {{TOPIC}}
- **Plataforma:** {{PLATFORM}}
- **Nicho:** {{NICHE}}
- **Idioma:** {{LANGUAGE}}

INCLUYE:
1. Hashtags de alto volumen (1M+)
2. Hashtags de medio volumen (100K-1M)
3. Hashtags de bajo volumen (10K-100K)
4. Hashtags de nicho (<10K)
5. Hashtags de marca
6. Hashtags trending relacionados
7. Sets rotativos para evitar shadowban
8. Platform-specific recommendations

FORMATO: Tabla categorizada con volumen estimado.
IDIOMA: {{LANG_OUTPUT}}`,
            en: `Act as a **Social Media SEO Specialist**.

Create a **Hashtag Strategy** for:
- **Topic:** {{TOPIC}}
- **Platform:** {{PLATFORM}}
- **Niche:** {{NICHE}}
- **Language:** {{LANGUAGE}}

INCLUDE:
1. High volume hashtags (1M+)
2. Medium volume hashtags (100K-1M)
3. Low volume hashtags (10K-100K)
4. Niche hashtags (<10K)
5. Brand hashtags
6. Related trending hashtags
7. Rotating sets to avoid shadowban
8. Platform-specific recommendations

FORMAT: Categorized table with estimated volume.
LANGUAGE: {{LANG_OUTPUT}}`
        },
        tags: ['hashtags', 'seo', 'social-media', 'discovery', 'reach']
    },
    {
        id: 'youtube_script',
        category: 'social',
        icon: '🎥',
        title: { es: 'Guion de YouTube', en: 'YouTube Script' },
        description: { es: 'Guion completo con intro, desarrollo, CTAs y end screen.', en: 'Complete script with intro, development, CTAs, and end screen.' },
        prompt: {
            es: `Actúa como un **YouTube Content Strategist**.

Crea un **Guion de YouTube** para:
- **Tema:** {{TOPIC}}
- **Duración:** {{DURATION}}
- **Estilo:** {{STYLE}}
- **CTA:** {{CTA}}

ESTRUCTURA:
1. **Hook (0-15s)**: Gancho visual + verbal
2. **Intro (15-30s)**: Qué van a aprender + por qué importa
3. **Desarrollo**: Contenido principal con timestamps
4. **CTA intermedio**: Subscribe/like reminder
5. **Conclusión**: Resumen + CTA final
6. **End screen**: Video recomendado + subscribe

INCLUYE:
- Script palabra por palabra
- Indicaciones de B-roll
- Timestamps sugeridos
- Título optimizado SEO
- Descripción con keywords
- Tags recomendados

FORMATO: Guion con timestamps y notas de producción.
IDIOMA: {{LANG_OUTPUT}}`,
            en: `Act as a **YouTube Content Strategist**.

Create a **YouTube Script** for:
- **Topic:** {{TOPIC}}
- **Duration:** {{DURATION}}
- **Style:** {{STYLE}}
- **CTA:** {{CTA}}

STRUCTURE:
1. **Hook (0-15s)**: Visual + verbal hook
2. **Intro (15-30s)**: What they'll learn + why it matters
3. **Development**: Main content with timestamps
4. **Mid CTA**: Subscribe/like reminder
5. **Conclusion**: Summary + final CTA
6. **End screen**: Recommended video + subscribe

INCLUDE:
- Word-for-word script
- B-roll directions
- Suggested timestamps
- SEO-optimized title
- Description with keywords
- Recommended tags

FORMAT: Script with timestamps and production notes.
LANGUAGE: {{LANG_OUTPUT}}`
        },
        tags: ['youtube', 'script', 'video', 'seo', 'content']
    },
    {
        id: 'social_ad_copy',
        category: 'social',
        icon: '📢',
        title: { es: 'Facebook/Instagram Ad Copy', en: 'Facebook/Instagram Ad Copy' },
        description: { es: 'Copy de anuncio con variantes A/B y targeting.', en: 'Ad copy with A/B variants and targeting.' },
        prompt: {
            es: `Actúa como un **Paid Social Copywriter**.

Crea **Ad Copy para Facebook/Instagram** para:
- **Producto:** {{PRODUCT}}
- **Audiencia:** {{AUDIENCE}}
- **Objetivo:** {{GOAL}}
- **Budget:** {{BUDGET}}

INCLUYE:
1. 3 variantes de primary text (corto, medio, largo)
2. 3 variantes de headline
3. 2 variantes de description
4. 3 creative concepts (visual direction)
5. A/B testing plan
6. Targeting recommendations
7. Budget allocation strategy
8. KPI benchmarks

REGLAS:
- Primary text: máximo 125 chars (visible sin "see more")
- Headline: máximo 40 chars
- Description: máximo 30 chars

FORMATO: Copy completo con notas de campaña.
IDIOMA: {{LANG_OUTPUT}}`,
            en: `Act as a **Paid Social Copywriter**.

Create **Facebook/Instagram Ad Copy** for:
- **Product:** {{PRODUCT}}
- **Audience:** {{AUDIENCE}}
- **Goal:** {{GOAL}}
- **Budget:** {{BUDGET}}

INCLUDE:
1. 3 primary text variants (short, medium, long)
2. 3 headline variants
3. 2 description variants
4. 3 creative concepts (visual direction)
5. A/B testing plan
6. Targeting recommendations
7. Budget allocation strategy
8. KPI benchmarks

RULES:
- Primary text: max 125 chars (visible without "see more")
- Headline: max 40 chars
- Description: max 30 chars

FORMAT: Complete copy with campaign notes.
LANGUAGE: {{LANG_OUTPUT}}`
        },
        tags: ['ads', 'facebook', 'instagram', 'paid', 'copywriting']
    },
    {
        id: 'social_media_audit',
        category: 'social',
        icon: '📋',
        title: { es: 'Social Media Audit', en: 'Social Media Audit' },
        description: { es: 'Auditoría completa de presencia social con métricas.', en: 'Complete social presence audit with metrics.' },
        prompt: {
            es: `Actúa como un **Social Media Auditor**.

Realiza un **Social Media Audit** para:
- **Marca:** {{BRAND}}
- **Plataformas:** {{PLATFORMS}}
- **Período:** {{PERIOD}}

ANÁLISIS:
1. Perfil optimization (bio, foto, link, highlights)
2. Consistencia de branding
3. Content performance por tipo
4. Engagement rate trends
5. Audience demographics
6. Posting frequency analysis
7. Competitor benchmarking
8. Recommendations y action plan

FORMATO: Reporte con métricas y plan de acción.
IDIOMA: {{LANG_OUTPUT}}`,
            en: `Act as a **Social Media Auditor**.

Perform a **Social Media Audit** for:
- **Brand:** {{BRAND}}
- **Platforms:** {{PLATFORMS}}
- **Period:** {{PERIOD}}

ANALYSIS:
1. Profile optimization (bio, photo, link, highlights)
2. Branding consistency
3. Content performance by type
4. Engagement rate trends
5. Audience demographics
6. Posting frequency analysis
7. Competitor benchmarking
8. Recommendations and action plan

FORMAT: Report with metrics and action plan.
LANGUAGE: {{LANG_OUTPUT}}`
        },
        tags: ['audit', 'social-media', 'metrics', 'analysis', 'optimization']
    },
    {
        id: 'influencer_outreach',
        category: 'social',
        icon: '🤝',
        title: { es: 'Influencer Outreach Template', en: 'Influencer Outreach Template' },
        description: { es: 'Template de outreach a influencers con propuesta.', en: 'Influencer outreach template with proposal.' },
        prompt: {
            es: `Actúa como un **Influencer Marketing Manager**.

Crea un **Influencer Outreach Template** para:
- **Marca:** {{BRAND}}
- **Influencer:** {{INFLUENCER}}
- **Campaña:** {{CAMPAIGN}}
- **Budget:** {{BUDGET}}

INCLUYE:
1. Email/DM de outreach personalizado
2. Propuesta de colaboración
3. Deliverables esperados
4. Compensation structure
5. Timeline y deadlines
6. Brand guidelines
7. Approval process
8. Follow-up sequence

FORMATO: Templates listos para usar.
IDIOMA: {{LANG_OUTPUT}}`,
            en: `Act as an **Influencer Marketing Manager**.

Create an **Influencer Outreach Template** for:
- **Brand:** {{BRAND}}
- **Influencer:** {{INFLUENCER}}
- **Campaign:** {{CAMPAIGN}}
- **Budget:** {{BUDGET}}

INCLUDE:
1. Personalized outreach email/DM
2. Collaboration proposal
3. Expected deliverables
4. Compensation structure
5. Timeline and deadlines
6. Brand guidelines
7. Approval process
8. Follow-up sequence

FORMAT: Ready-to-use templates.
LANGUAGE: {{LANG_OUTPUT}}`
        },
        tags: ['influencer', 'outreach', 'collaboration', 'partnership', 'marketing']
    },

    // ─── Creative ─────────────────────────────────────────────────────────────

    {
        id: 'branding_session',
        category: 'creative',
        icon: '🎨',
        title: { es: 'Sesión de Branding', en: 'Branding Session' },
        description: { es: 'Ideación de identidad de marca con naming, valores y personalidad.', en: 'Brand identity ideation with naming, values, and personality.' },
        prompt: {
            es: `Actúa como un **Senior Brand Strategist**.

Conduce una **Sesión de Branding** para:
- **Empresa:** {{COMPANY}}
- **Sector:** {{SECTOR}}
- **Audiencia:** {{AUDIENCE}}
- **Técnica:** {{TECHNIQUE}}

ENTREGABLES:
1. Brand purpose y visión
2. Brand values (3-5)
3. Brand personality (archetype)
4. Brand voice y tone guidelines
5. Naming options (10+ con análisis)
6. Tagline options (5+)
7. Brand story
8. Visual direction brief (colores, tipografía, estilo)

FORMATO: Documento de brand strategy completo.
IDIOMA: {{LANG_OUTPUT}}`,
            en: `Act as a **Senior Brand Strategist**.

Conduct a **Branding Session** for:
- **Company:** {{COMPANY}}
- **Sector:** {{SECTOR}}
- **Audience:** {{AUDIENCE}}
- **Technique:** {{TECHNIQUE}}

DELIVERABLES:
1. Brand purpose and vision
2. Brand values (3-5)
3. Brand personality (archetype)
4. Brand voice and tone guidelines
5. Naming options (10+ with analysis)
6. Tagline options (5+)
7. Brand story
8. Visual direction brief (colors, typography, style)

FORMAT: Complete brand strategy document.
LANGUAGE: {{LANG_OUTPUT}}`
        },
        tags: ['branding', 'identity', 'naming', 'strategy', 'creative']
    },
    {
        id: 'product_ideation',
        category: 'creative',
        icon: '🚀',
        title: { es: 'Lluvia de Ideas de Producto', en: 'Product Ideation' },
        description: { es: 'Generación de conceptos de producto con SCAMPER.', en: 'Product concept generation with SCAMPER.' },
        prompt: {
            es: `Actúa como un **Product Innovation Lead**.

Realiza una **Lluvia de Ideas de Producto** para:
- **Sector:** {{SECTOR}}
- **Problema:** {{PROBLEM}}
- **Técnica:** {{TECHNIQUE}}
- **Restricción:** {{CONSTRAINT}}

PROCESO:
1. Define el problema claramente
2. Aplica la técnica de ideación
3. Genera 15-20 conceptos
4. Evalúa cada concepto (viabilidad, impacto, originalidad)
5. Selecciona top 3
6. Desarrolla cada top concept (value prop, features, monetization)
7. Crea un one-pager por concepto

FORMATO: Documento con conceptos evaluados.
IDIOMA: {{LANG_OUTPUT}}`,
            en: `Act as a **Product Innovation Lead**.

Perform a **Product Ideation Session** for:
- **Sector:** {{SECTOR}}
- **Problem:** {{PROBLEM}}
- **Technique:** {{TECHNIQUE}}
- **Constraint:** {{CONSTRAINT}}

PROCESS:
1. Define the problem clearly
2. Apply the ideation technique
3. Generate 15-20 concepts
4. Evaluate each concept (feasibility, impact, originality)
5. Select top 3
6. Develop each top concept (value prop, features, monetization)
7. Create a one-pager per concept

FORMAT: Document with evaluated concepts.
LANGUAGE: {{LANG_OUTPUT}}`
        },
        tags: ['product', 'ideation', 'innovation', 'scamper', 'concepts']
    },
    {
        id: 'music_concept',
        category: 'creative',
        icon: '🎵',
        title: { es: 'Concepto de Proyecto Musical', en: 'Music Project Concept' },
        description: { es: 'Ideación de álbum/single con concepto, mood y narrativa.', en: 'Album/single ideation with concept, mood, and narrative.' },
        prompt: {
            es: `Actúa como un **Creative Director Musical**.

Crea un **Concepto de Proyecto Musical** para:
- **Género:** {{GENRE}}
- **Tema:** {{THEME}}
- **Mood:** {{MOOD}}
- **Audiencia:** {{AUDIENCE}}

ENTREGABLES:
1. Concepto central del álbum/single
2. Narrative arc y storyline
3. Track listing con descripciones
4. Mood board descriptivo
5. Visual direction (cover art, music video)
6. Marketing angles
7. Influencias y referencias
8. Release strategy

FORMATO: Documento creativo con dirección artística.
IDIOMA: {{LANG_OUTPUT}}`,
            en: `Act as a **Music Creative Director**.

Create a **Music Project Concept** for:
- **Genre:** {{GENRE}}
- **Theme:** {{THEME}}
- **Mood:** {{MOOD}}
- **Audience:** {{AUDIENCE}}

DELIVERABLES:
1. Central album/single concept
2. Narrative arc and storyline
3. Track listing with descriptions
4. Descriptive mood board
5. Visual direction (cover art, music video)
6. Marketing angles
7. Influences and references
8. Release strategy

FORMAT: Creative document with art direction.
LANGUAGE: {{LANG_OUTPUT}}`
        },
        tags: ['music', 'album', 'concept', 'creative', 'art-direction']
    },
    {
        id: 'game_concept',
        category: 'creative',
        icon: '🎮',
        title: { es: 'Concepto de Videojuego', en: 'Video Game Concept' },
        description: { es: 'Game concept con mecánicas, mundo, loop y monetización.', en: 'Game concept with mechanics, world, loop, and monetization.' },
        prompt: {
            es: `Actúa como un **Game Design Director**.

Crea un **Concepto de Videojuego** para:
- **Género:** {{GENRE}}
- **Plataforma:** {{PLATFORM}}
- **Audiencia:** {{AUDIENCE}}
- **Técnica:** {{TECHNIQUE}}

ENTREGABLES:
1. High concept (elevator pitch)
2. Core gameplay loop
3. Mecánicas principales
4. World building y lore
5. Progression system
6. Monetization strategy
7. Art direction
8. Technical requirements

FORMATO: Game design document (lightweight).
IDIOMA: {{LANG_OUTPUT}}`,
            en: `Act as a **Game Design Director**.

Create a **Video Game Concept** for:
- **Genre:** {{GENRE}}
- **Platform:** {{PLATFORM}}
- **Audience:** {{AUDIENCE}}
- **Technique:** {{TECHNIQUE}}

DELIVERABLES:
1. High concept (elevator pitch)
2. Core gameplay loop
3. Core mechanics
4. World building and lore
5. Progression system
6. Monetization strategy
7. Art direction
8. Technical requirements

FORMAT: Lightweight game design document.
LANGUAGE: {{LANG_OUTPUT}}`
        },
        tags: ['game', 'design', 'concept', 'mechanics', 'gdd']
    },
    {
        id: 'business_model_canvas',
        category: 'creative',
        icon: '🏢',
        title: { es: 'Modelo de Negocio Canvas', en: 'Business Model Canvas' },
        description: { es: 'Canvas completo con propuesta de valor y revenue streams.', en: 'Complete canvas with value proposition and revenue streams.' },
        prompt: {
            es: `Actúa como un **Business Strategy Consultant**.

Crea un **Business Model Canvas** para:
- **Sector:** {{SECTOR}}
- **Problema:** {{PROBLEM}}
- **Técnica:** {{TECHNIQUE}}
- **Recursos:** {{RESOURCES}}

9 BLOQUES:
1. Customer Segments
2. Value Propositions
3. Channels
4. Customer Relationships
5. Revenue Streams
6. Key Resources
7. Key Activities
8. Key Partnerships
9. Cost Structure

INCLUYE: Canvas completo + análisis + recomendaciones estratégicas.
FORMATO: Tabla + análisis detallado.
IDIOMA: {{LANG_OUTPUT}}`,
            en: `Act as a **Business Strategy Consultant**.

Create a **Business Model Canvas** for:
- **Sector:** {{SECTOR}}
- **Problem:** {{PROBLEM}}
- **Technique:** {{TECHNIQUE}}
- **Resources:** {{RESOURCES}}

9 BLOCKS:
1. Customer Segments
2. Value Propositions
3. Channels
4. Customer Relationships
5. Revenue Streams
6. Key Resources
7. Key Activities
8. Key Partnerships
9. Cost Structure

INCLUDE: Complete canvas + analysis + strategic recommendations.
FORMAT: Table + detailed analysis.
LANGUAGE: {{LANG_OUTPUT}}`
        },
        tags: ['business', 'canvas', 'model', 'strategy', 'startup']
    },
    {
        id: 'creative_campaign_360',
        category: 'creative',
        icon: '🎭',
        title: { es: 'Campaña Creativa 360°', en: '360° Creative Campaign' },
        description: { es: 'Concepto multi-canal con idea central y activations.', en: 'Multi-channel concept with central idea and activations.' },
        prompt: {
            es: `Actúa como un **Creative Director de Agencia**.

Crea una **Campaña Creativa 360°** para:
- **Marca:** {{BRAND}}
- **Objetivo:** {{GOAL}}
- **Audiencia:** {{AUDIENCE}}
- **Budget:** {{BUDGET}}

ENTREGABLES:
1. Big Idea (concepto central)
2. Key visual description
3. Tagline
4. Activations por canal (OOH, digital, social, PR, experiential)
5. Timeline de campaña
6. Budget allocation
7. KPIs y measurement
8. Risk assessment

FORMATO: Brief creativo completo con mood board descriptivo.
IDIOMA: {{LANG_OUTPUT}}`,
            en: `Act as an **Agency Creative Director**.

Create a **360° Creative Campaign** for:
- **Brand:** {{BRAND}}
- **Goal:** {{GOAL}}
- **Audience:** {{AUDIENCE}}
- **Budget:** {{BUDGET}}

DELIVERABLES:
1. Big Idea (central concept)
2. Key visual description
3. Tagline
4. Activations per channel (OOH, digital, social, PR, experiential)
5. Campaign timeline
6. Budget allocation
7. KPIs and measurement
8. Risk assessment

FORMAT: Complete creative brief with descriptive mood board.
LANGUAGE: {{LANG_OUTPUT}}`
        },
        tags: ['campaign', 'creative', '360', 'advertising', 'agency']
    },
    {
        id: 'naming_tagline',
        category: 'creative',
        icon: '✏️',
        title: { es: 'Naming & Tagline', en: 'Naming & Tagline' },
        description: { es: 'Generación de nombres y slogans con análisis semántico.', en: 'Name and slogan generation with semantic analysis.' },
        prompt: {
            es: `Actúa como un **Naming Specialist**.

Genera **Naming & Tagline** para:
- **Empresa:** {{COMPANY}}
- **Sector:** {{SECTOR}}
- **Valores:** {{VALUES}}
- **Idioma:** {{LANGUAGE}}

ENTREGABLES:
1. 20+ opciones de naming con:
   - Significado/etimología
   - Disponibilidad de dominio (.com)
   - Análisis fonético
   - Asociaciones culturales
2. 10+ taglines por nombre top
3. Filtro por criterios (corto, memorable, único)
4. Top 3 recomendados con justificación

FORMATO: Tabla con análisis por opción.
IDIOMA: {{LANG_OUTPUT}}`,
            en: `Act as a **Naming Specialist**.

Generate **Naming & Tagline** for:
- **Company:** {{COMPANY}}
- **Sector:** {{SECTOR}}
- **Values:** {{VALUES}}
- **Language:** {{LANGUAGE}}

DELIVERABLES:
1. 20+ naming options with:
   - Meaning/etymology
   - Domain availability (.com)
   - Phonetic analysis
   - Cultural associations
2. 10+ taglines per top name
3. Filter by criteria (short, memorable, unique)
4. Top 3 recommended with justification

FORMAT: Table with analysis per option.
LANGUAGE: {{LANG_OUTPUT}}`
        },
        tags: ['naming', 'tagline', 'branding', 'semantics', 'identity']
    },
    {
        id: 'mood_board_brief',
        category: 'creative',
        icon: '🎨',
        title: { es: 'Visual Mood Board Brief', en: 'Visual Mood Board Brief' },
        description: { es: 'Brief para mood board con paleta, tipografía y estilo.', en: 'Mood board brief with palette, typography, and style.' },
        prompt: {
            es: `Actúa como un **Art Director**.

Crea un **Visual Mood Board Brief** para:
- **Marca:** {{BRAND}}
- **Estilo:** {{STYLE}}
- **Audiencia:** {{AUDIENCE}}
- **Emoción:** {{EMOTION}}

ENTREGABLES:
1. Color palette (primary, secondary, accent) con hex codes
2. Typography pairing (heading, body, accent)
3. Visual style references (descriptivas)
4. Photography direction
5. Iconography style
6. Layout patterns
7. Do's and Don'ts
8. AI image prompts para generar referencias

FORMATO: Brief visual completo con descripciones detalladas.
IDIOMA: {{LANG_OUTPUT}}`,
            en: `Act as an **Art Director**.

Create a **Visual Mood Board Brief** for:
- **Brand:** {{BRAND}}
- **Style:** {{STYLE}}
- **Audience:** {{AUDIENCE}}
- **Emotion:** {{EMOTION}}

DELIVERABLES:
1. Color palette (primary, secondary, accent) with hex codes
2. Typography pairing (heading, body, accent)
3. Visual style references (descriptive)
4. Photography direction
5. Iconography style
6. Layout patterns
7. Do's and Don'ts
8. AI image prompts for generating references

FORMAT: Complete visual brief with detailed descriptions.
LANGUAGE: {{LANG_OUTPUT}}`
        },
        tags: ['mood-board', 'visual', 'art-direction', 'design', 'palette']
    },
    {
        id: 'storytelling_framework',
        category: 'creative',
        icon: '📖',
        title: { es: 'Storytelling Framework', en: 'Storytelling Framework' },
        description: { es: 'Estructura narrativa con arco, personajes y mensaje.', en: 'Narrative structure with arc, characters, and message.' },
        prompt: {
            es: `Actúa como un **Storytelling Strategist**.

Crea un **Storytelling Framework** para:
- **Tema:** {{THEME}}
- **Audiencia:** {{AUDIENCE}}
- **Formato:** {{FORMAT}}
- **Emoción:** {{EMOTION}}

ESTRUCTURA:
1. Protagonista (quién)
2. Conflicto (qué obstáculo)
3. Journey (cómo lo supera)
4. Transformación (qué cambia)
5. Mensaje (qué aprendemos)
6. Call to action (qué hacer ahora)

INCLUYE:
- Arco narrativo completo
- Emotional beats
- Key moments
- Adaptación por formato (video, texto, presentación)

FORMATO: Framework con ejemplos aplicados.
IDIOMA: {{LANG_OUTPUT}}`,
            en: `Act as a **Storytelling Strategist**.

Create a **Storytelling Framework** for:
- **Theme:** {{THEME}}
- **Audience:** {{AUDIENCE}}
- **Format:** {{FORMAT}}
- **Emotion:** {{EMOTION}}

STRUCTURE:
1. Protagonist (who)
2. Conflict (what obstacle)
3. Journey (how they overcome it)
4. Transformation (what changes)
5. Message (what we learn)
6. Call to action (what to do now)

INCLUDE:
- Complete narrative arc
- Emotional beats
- Key moments
- Adaptation per format (video, text, presentation)

FORMAT: Framework with applied examples.
LANGUAGE: {{LANG_OUTPUT}}`
        },
        tags: ['storytelling', 'narrative', 'framework', 'creative', 'emotion']
    },
    {
        id: 'creative_block_breaker',
        category: 'creative',
        icon: '💡',
        title: { es: 'Creative Block Breaker', en: 'Creative Block Breaker' },
        description: { es: 'Técnicas para desbloquear creatividad con prompts.', en: 'Techniques to unblock creativity with prompts.' },
        prompt: {
            es: `Actúa como un **Creative Coach**.

Genera un **Creative Block Breaker** para:
- **Disciplina:** {{DISCIPLINE}}
- **Problema:** {{PROBLEM}}
- **Técnica:** {{TECHNIQUE}}

INCLUYE:
1. 10 prompts creativos específicos
2. 5 ejercicios de warm-up
3. 3 técnicas de ideación (SCAMPER, random word, reverse thinking)
4. 1 ejercicio de cambio de perspectiva
5. 1 ejercicio de constraints
6. Playlist sugerida para creative flow
7. Environment tips

FORMATO: Guía práctica con ejercicios paso a paso.
IDIOMA: {{LANG_OUTPUT}}`,
            en: `Act as a **Creative Coach**.

Generate a **Creative Block Breaker** for:
- **Discipline:** {{DISCIPLINE}}
- **Problem:** {{PROBLEM}}
- **Technique:** {{TECHNIQUE}}

INCLUDE:
1. 10 discipline-specific creative prompts
2. 5 warm-up exercises
3. 3 ideation techniques (SCAMPER, random word, reverse thinking)
4. 1 perspective shift exercise
5. 1 constraint exercise
6. Suggested playlist for creative flow
7. Environment tips

FORMAT: Practical guide with step-by-step exercises.
LANGUAGE: {{LANG_OUTPUT}}`
        },
        tags: ['creative-block', 'prompts', 'exercises', 'coaching', 'inspiration']
    },

    // ─── Content ──────────────────────────────────────────────────────────────

    {
        id: 'seo_blog_post',
        category: 'content',
        icon: '📄',
        title: { es: 'Artículo de Blog SEO', en: 'SEO Blog Post' },
        description: { es: 'Post largo optimizado para SEO con meta, estructura y keywords.', en: 'Long-form post optimized for SEO with meta, structure, and keywords.' },
        prompt: {
            es: `Actúa como un **SEO Content Writer**.

Escribe un **Artículo de Blog SEO** para:
- **Tema:** {{TOPIC}}
- **Keyword principal:** {{KEYWORD}}
- **Audiencia:** {{AUDIENCE}}
- **Extensión:** {{LENGTH}}

INCLUYE:
1. SEO title (60 chars max)
2. Meta description (155 chars max)
3. URL slug
4. H1, H2, H3 structure
5. Contenido completo (1500-3000 palabras)
6. Internal linking suggestions
7. Image alt text suggestions
8. FAQ section (para featured snippet)
9. Schema markup suggestion

REQUISITOS: Keyword density 1-2%, readability score alto, EEAT.
FORMATO: Markdown completo con notas SEO.
IDIOMA: {{LANG_OUTPUT}}`,
            en: `Act as an **SEO Content Writer**.

Write an **SEO Blog Post** for:
- **Topic:** {{TOPIC}}
- **Main keyword:** {{KEYWORD}}
- **Audience:** {{AUDIENCE}}
- **Length:** {{LENGTH}}

INCLUDE:
1. SEO title (60 chars max)
2. Meta description (155 chars max)
3. URL slug
4. H1, H2, H3 structure
5. Full content (1500-3000 words)
6. Internal linking suggestions
7. Image alt text suggestions
8. FAQ section (for featured snippet)
9. Schema markup suggestion

REQUIREMENTS: Keyword density 1-2%, high readability score, EEAT.
FORMAT: Complete Markdown with SEO notes.
LANGUAGE: {{LANG_OUTPUT}}`
        },
        tags: ['blog', 'seo', 'content', 'writing', 'keywords']
    },
    {
        id: 'newsletter',
        category: 'content',
        icon: '📧',
        title: { es: 'Newsletter de Valor', en: 'Value Newsletter' },
        description: { es: 'Newsletter con storytelling, insights y CTA.', en: 'Newsletter with storytelling, insights, and CTA.' },
        prompt: {
            es: `Actúa como un **Newsletter Strategist**.

Escribe una **Newsletter de Valor** para:
- **Tema:** {{TOPIC}}
- **Audiencia:** {{AUDIENCE}}
- **Tono:** {{TONE}}
- **CTA:** {{CTA}}

ESTRUCTURA:
1. Subject line (3 variantes)
2. Preview text
3. Hook/Opening (personal story o dato impactante)
4. Main insight/lesson (valor central)
5. Supporting points (2-3)
6. Actionable takeaway
7. CTA natural
8. P.S. con bonus

REQUISITOS: Conversacional, scannable, valor primero.
FORMATO: Email completo con notas estratégicas.
IDIOMA: {{LANG_OUTPUT}}`,
            en: `Act as a **Newsletter Strategist**.

Write a **Value Newsletter** for:
- **Topic:** {{TOPIC}}
- **Audience:** {{AUDIENCE}}
- **Tone:** {{TONE}}
- **CTA:** {{CTA}}

STRUCTURE:
1. Subject line (3 variants)
2. Preview text
3. Hook/Opening (personal story or impactful data)
4. Main insight/lesson (core value)
5. Supporting points (2-3)
6. Actionable takeaway
7. Natural CTA
8. P.S. with bonus

REQUIREMENTS: Conversational, scannable, value-first.
FORMAT: Complete email with strategic notes.
LANGUAGE: {{LANG_OUTPUT}}`
        },
        tags: ['newsletter', 'email', 'content', 'storytelling', 'value']
    },
    {
        id: 'podcast_script',
        category: 'content',
        icon: '🎙️',
        title: { es: 'Guion de Podcast', en: 'Podcast Script' },
        description: { es: 'Guion completo con intro, segmentos, preguntas y cierre.', en: 'Complete script with intro, segments, questions, and close.' },
        prompt: {
            es: `Actúa como un **Podcast Producer**.

Crea un **Guion de Podcast** para:
- **Tema:** {{TOPIC}}
- **Formato:** {{FORMAT}}
- **Duración:** {{DURATION}}
- **Invitado:** {{GUEST}}

ESTRUCTURA:
1. Intro (30s): Hook + tema + presentación
2. Segmento 1: Contexto y setup
3. Segmento 2: Deep dive / entrevista
4. Segmento 3: Insights y takeaways
5. Outro: Resumen + CTA + credits

INCLUYE:
- Script palabra por palabra para host
- Preguntas para invitado
- Timestamps
- Sound effect cues
- Show notes
- Episode title options

FORMATO: Guion con timestamps y notas de producción.
IDIOMA: {{LANG_OUTPUT}}`,
            en: `Act as a **Podcast Producer**.

Create a **Podcast Script** for:
- **Topic:** {{TOPIC}}
- **Format:** {{FORMAT}}
- **Duration:** {{DURATION}}
- **Guest:** {{GUEST}}

STRUCTURE:
1. Intro (30s): Hook + topic + introduction
2. Segment 1: Context and setup
3. Segment 2: Deep dive / interview
4. Segment 3: Insights and takeaways
5. Outro: Summary + CTA + credits

INCLUDE:
- Word-for-word host script
- Guest questions
- Timestamps
- Sound effect cues
- Show notes
- Episode title options

FORMAT: Script with timestamps and production notes.
LANGUAGE: {{LANG_OUTPUT}}`
        },
        tags: ['podcast', 'script', 'audio', 'interview', 'production']
    },
    {
        id: 'whitepaper',
        category: 'content',
        icon: '📊',
        title: { es: 'Whitepaper / Informe Técnico', en: 'Whitepaper / Technical Report' },
        description: { es: 'Documento largo con datos, análisis y conclusiones.', en: 'Long-form document with data, analysis, and conclusions.' },
        prompt: {
            es: `Actúa como un **Technical Research Writer**.

Escribe un **Whitepaper** para:
- **Tema:** {{TOPIC}}
- **Audiencia:** {{AUDIENCE}}
- **Extensión:** {{LENGTH}}
- **Datos:** {{DATA}}

ESTRUCTURA:
1. Executive Summary
2. Problem Statement
3. Methodology
4. Findings/Analysis
5. Case Studies
6. Recommendations
7. Conclusion
8. References

REQUISITOS: Data-driven, citations, charts descritos, tono profesional.
FORMATO: Documento largo con secciones numeradas.
IDIOMA: {{LANG_OUTPUT}}`,
            en: `Act as a **Technical Research Writer**.

Write a **Whitepaper** for:
- **Topic:** {{TOPIC}}
- **Audience:** {{AUDIENCE}}
- **Length:** {{LENGTH}}
- **Data:** {{DATA}}

STRUCTURE:
1. Executive Summary
2. Problem Statement
3. Methodology
4. Findings/Analysis
5. Case Studies
6. Recommendations
7. Conclusion
8. References

REQUIREMENTS: Data-driven, citations, described charts, professional tone.
FORMAT: Long document with numbered sections.
LANGUAGE: {{LANG_OUTPUT}}`
        },
        tags: ['whitepaper', 'report', 'research', 'data', 'technical']
    },
    {
        id: 'online_course',
        category: 'content',
        icon: '🎓',
        title: { es: 'Curso Online / Syllabus', en: 'Online Course / Syllabus' },
        description: { es: 'Estructura de curso con módulos, lecciones y evaluaciones.', en: 'Course structure with modules, lessons, and assessments.' },
        prompt: {
            es: `Actúa como un **Instructional Designer**.

Crea un **Curso Online** para:
- **Tema:** {{TOPIC}}
- **Nivel:** {{LEVEL}}
- **Duración:** {{DURATION}}
- **Formato:** {{FORMAT}}

ESTRUCTURA:
1. Course overview y learning objectives
2. Módulos (4-8) con:
   - Título y descripción
   - Lecciones (3-5 por módulo)
   - Duración estimada
   - Recursos
3. Evaluaciones por módulo
4. Proyecto final
5. Certificate requirements
6. Prerequisites

FORMATO: Syllabus completo con tabla de contenidos.
IDIOMA: {{LANG_OUTPUT}}`,
            en: `Act as an **Instructional Designer**.

Create an **Online Course** for:
- **Topic:** {{TOPIC}}
- **Level:** {{LEVEL}}
- **Duration:** {{DURATION}}
- **Format:** {{FORMAT}}

STRUCTURE:
1. Course overview and learning objectives
2. Modules (4-8) with:
   - Title and description
   - Lessons (3-5 per module)
   - Estimated duration
   - Resources
3. Assessments per module
4. Final project
5. Certificate requirements
6. Prerequisites

FORMAT: Complete syllabus with table of contents.
LANGUAGE: {{LANG_OUTPUT}}`
        },
        tags: ['course', 'syllabus', 'education', 'learning', 'instructional']
    },
    {
        id: 'case_study',
        category: 'content',
        icon: '📋',
        title: { es: 'Case Study / Caso de Éxito', en: 'Case Study / Success Story' },
        description: { es: 'Historia de cliente con problema, solución y resultados.', en: 'Customer story with problem, solution, and results.' },
        prompt: {
            es: `Actúa como un **Case Study Writer**.

Escribe un **Case Study** para:
- **Cliente:** {{CLIENT}}
- **Problema:** {{PROBLEM}}
- **Solución:** {{SOLUTION}}
- **Resultados:** {{RESULTS}}

ESTRUCTURA:
1. Title (result-focused)
2. Executive Summary
3. Client background
4. The Challenge
5. The Solution
6. Implementation
7. Results (con métricas)
8. Client quote
9. Key takeaways
10. CTA

REQUISITOS: Data-driven, storytelling, métricas cuantificables.
FORMATO: Documento con secciones claras.
IDIOMA: {{LANG_OUTPUT}}`,
            en: `Act as a **Case Study Writer**.

Write a **Case Study** for:
- **Client:** {{CLIENT}}
- **Problem:** {{PROBLEM}}
- **Solution:** {{SOLUTION}}
- **Results:** {{RESULTS}}

STRUCTURE:
1. Title (result-focused)
2. Executive Summary
3. Client background
4. The Challenge
5. The Solution
6. Implementation
7. Results (with metrics)
8. Client quote
9. Key takeaways
10. CTA

REQUIREMENTS: Data-driven, storytelling, quantifiable metrics.
FORMAT: Document with clear sections.
LANGUAGE: {{LANG_OUTPUT}}`
        },
        tags: ['case-study', 'success', 'client', 'results', 'storytelling']
    },
    {
        id: 'presentation_script',
        category: 'content',
        icon: '🎤',
        title: { es: 'Guion de Presentación', en: 'Presentation Script' },
        description: { es: 'Presentación con narrativa, slides y speaker notes.', en: 'Presentation with narrative, slides, and speaker notes.' },
        prompt: {
            es: `Actúa como un **Presentation Coach**.

Crea un **Guion de Presentación** para:
- **Tema:** {{TOPIC}}
- **Audiencia:** {{AUDIENCE}}
- **Duración:** {{DURATION}}
- **Objetivo:** {{GOAL}}

ESTRUCTURA:
1. Opening (hook + agenda)
2. Problem/Context
3. Main points (3-5) con datos y ejemplos
4. Solution/Recommendation
5. Call to action
6. Q&A prep

POR SLIDE:
- Título del slide
- Contenido visual sugerido
- Speaker notes (word-for-word)
- Tiempo estimado

FORMATO: Slide-by-slide con speaker notes.
IDIOMA: {{LANG_OUTPUT}}`,
            en: `Act as a **Presentation Coach**.

Create a **Presentation Script** for:
- **Topic:** {{TOPIC}}
- **Audience:** {{AUDIENCE}}
- **Duration:** {{DURATION}}
- **Goal:** {{GOAL}}

STRUCTURE:
1. Opening (hook + agenda)
2. Problem/Context
3. Main points (3-5) with data and examples
4. Solution/Recommendation
5. Call to action
6. Q&A prep

PER SLIDE:
- Slide title
- Suggested visual content
- Speaker notes (word-for-word)
- Estimated time

FORMAT: Slide-by-slide with speaker notes.
LANGUAGE: {{LANG_OUTPUT}}`
        },
        tags: ['presentation', 'script', 'speaking', 'slides', 'keynote']
    },
    {
        id: 'ebook_guide',
        category: 'content',
        icon: '📝',
        title: { es: 'Guía / Ebook', en: 'Guide / Ebook' },
        description: { es: 'Ebook con capítulos, ejercicios y recursos.', en: 'Ebook with chapters, exercises, and resources.' },
        prompt: {
            es: `Actúa como un **Book Editor & Content Strategist**.

Crea un **Ebook** para:
- **Tema:** {{TOPIC}}
- **Audiencia:** {{AUDIENCE}}
- **Extensión:** {{LENGTH}}
- **Estilo:** {{STYLE}}

ESTRUCTURA:
1. Title y subtitle
2. Table of contents
3. Introduction
4. Capítulos (5-8) con:
   - Título
   - Contenido completo
   - Ejercicios prácticos
   - Key takeaways
5. Conclusion
6. Resources y further reading
7. About the author

REQUISITOS: Accionable, bien estructurado, valor denso.
FORMATO: Documento largo con capítulos numerados.
IDIOMA: {{LANG_OUTPUT}}`,
            en: `Act as a **Book Editor & Content Strategist**.

Create an **Ebook** for:
- **Topic:** {{TOPIC}}
- **Audience:** {{AUDIENCE}}
- **Length:** {{LENGTH}}
- **Style:** {{STYLE}}

STRUCTURE:
1. Title and subtitle
2. Table of contents
3. Introduction
4. Chapters (5-8) with:
   - Title
   - Full content
   - Practical exercises
   - Key takeaways
5. Conclusion
6. Resources and further reading
7. About the author

REQUIREMENTS: Actionable, well-structured, dense value.
FORMAT: Long document with numbered chapters.
LANGUAGE: {{LANG_OUTPUT}}`
        },
        tags: ['ebook', 'guide', 'book', 'content', 'education']
    },
    {
        id: 'video_tutorial_script',
        category: 'content',
        icon: '📹',
        title: { es: 'Guion de Video Tutorial', en: 'Video Tutorial Script' },
        description: { es: 'Tutorial paso a paso con timestamps y recursos.', en: 'Step-by-step tutorial with timestamps and resources.' },
        prompt: {
            es: `Actúa como un **Technical Video Producer**.

Crea un **Guion de Video Tutorial** para:
- **Tema:** {{TOPIC}}
- **Nivel:** {{LEVEL}}
- **Duración:** {{DURATION}}
- **Herramientas:** {{TOOLS}}

ESTRUCTURA:
1. Intro (15-30s): Qué van a aprender
2. Prerequisites y setup
3. Step-by-step tutorial con timestamps
4. Common pitfalls y troubleshooting
5. Recap y next steps
6. CTA

POR SEGMENTO:
- Timestamp
- Lo que se muestra en pantalla
- Narración word-for-word
- Notas de edición

FORMATO: Guion con timestamps y notas de producción.
IDIOMA: {{LANG_OUTPUT}}`,
            en: `Act as a **Technical Video Producer**.

Create a **Video Tutorial Script** for:
- **Topic:** {{TOPIC}}
- **Level:** {{LEVEL}}
- **Duration:** {{DURATION}}
- **Tools:** {{TOOLS}}

STRUCTURE:
1. Intro (15-30s): What they'll learn
2. Prerequisites and setup
3. Step-by-step tutorial with timestamps
4. Common pitfalls and troubleshooting
5. Recap and next steps
6. CTA

PER SEGMENT:
- Timestamp
- What's shown on screen
- Word-for-word narration
- Editing notes

FORMAT: Script with timestamps and production notes.
LANGUAGE: {{LANG_OUTPUT}}`
        },
        tags: ['tutorial', 'video', 'script', 'how-to', 'education']
    },
    {
        id: 'press_release',
        category: 'content',
        icon: '📰',
        title: { es: 'Press Release', en: 'Press Release' },
        description: { es: 'Nota de prensa con headline, quotes, boilerplate.', en: 'Press release with headline, quotes, and boilerplate.' },
        prompt: {
            es: `Actúa como un **PR Specialist**.

Escribe un **Press Release** para:
- **Empresa:** {{COMPANY}}
- **Noticia:** {{NEWS}}
- **Audiencia:** {{AUDIENCE}}
- **Fecha:** {{DATE}}

ESTRUCTURA:
1. FOR IMMEDIATE RELEASE
2. Headline (impactante, <100 chars)
3. Subheadline
4. Dateline (city, date)
5. Lead paragraph (who, what, when, where, why)
6. Body paragraphs (details, context)
7. Quote from executive
8. Boilerplate
9. Media contact
10. ### (end mark)

REQUISITOS: AP style, objective tone, newsworthy.
FORMATO: Press release estándar.
IDIOMA: {{LANG_OUTPUT}}`,
            en: `Act as a **PR Specialist**.

Write a **Press Release** for:
- **Company:** {{COMPANY}}
- **News:** {{NEWS}}
- **Audience:** {{AUDIENCE}}
- **Date:** {{DATE}}

STRUCTURE:
1. FOR IMMEDIATE RELEASE
2. Headline (impactful, <100 chars)
3. Subheadline
4. Dateline (city, date)
5. Lead paragraph (who, what, when, where, why)
6. Body paragraphs (details, context)
7. Quote from executive
8. Boilerplate
9. Media contact
10. ### (end mark)

REQUIREMENTS: AP style, objective tone, newsworthy.
FORMAT: Standard press release.
LANGUAGE: {{LANG_OUTPUT}}`
        },
        tags: ['press-release', 'pr', 'announcement', 'media', 'news']
    },
];


export interface DevConfig {
    rol: string;
    arch: string[];
    focus: string;
}

export const dev_config: Record<string, DevConfig> = {
    web_app: { rol: "Staff Full Stack Engineer", arch: ["Clean Architecture", "Vertical Slice", "Micro-Frontends"], focus: "Core Web Vitals, A11y, Scalability" },
    desktop_app: { rol: "Senior Desktop Application Engineer", arch: ["Electron (Main/Renderer separation)", "Tauri (Rust Backend)", "Flutter Desktop", "Native (Swift/C#)"], focus: "Memory Management, Native APIs Integration, Updater Strategy, Offline-first" },
    mobile_app: { rol: "Principal Mobile Engineer", arch: ["MVVM + Coordinator", "TCA (Composable)", "Clean + Bloc"], focus: "Frame Drop Analysis, Battery Performance" },
    devops: { rol: "Senior DevOps & Cloud Architect", arch: ["Immutable Infrastructure", "GitOps (ArgoCD)", "Serverless Event-Driven"], focus: "High Availability, Disaster Recovery, IaC (Terraform/Ansible)" },
    backend_api: { rol: "Backend Lead", arch: ["Event-Driven Microservices", "CQRS", "Modular Monolith"], focus: "Idempotency, CAP Theorem Tradeoffs" },
    multimedia: { rol: "Creative Technologist Lead", arch: ["Node-Based Dataflow", "ECS (Entity Component)", "Compute Shader Pipeline"], focus: "GPU Optimization, Stable 60fps, Low Latency" },
    data_science: { rol: "MLOps Engineer", arch: ["Feature Store", "Federated Learning"], focus: "Data Drift, Reproducibility" }
};

export const studio_profiles: Record<string, { role: { es: string; en: string }; tone: { es: string; en: string } }> = {
    expert: {
        role: { es: "Experto en la Materia (SME)", en: "Subject Matter Expert (SME)" },
        tone: { es: "Técnico, denso y preciso", en: "Technical, dense, and precise" }
    },
    student: {
        role: { es: "Mentor Académico Riguroso", en: "Rigorous Academic Mentor" },
        tone: { es: "Didáctico, estructurado y crítico (Nivel Universitario)", en: "Didactic, structured, and critical (University Level)" }
    },
    creative: {
        role: { es: "Director de Arte / Visionario", en: "Art Director / Visionary" },
        tone: { es: "Conceptual, estético y metafórico", en: "Conceptual, aesthetic, and metaphorical" }
    },
    executive: {
        role: { es: "Consultor de Estrategia", en: "Strategy Consultant" },
        tone: { es: "Ejecutivo, conciso y orientado al ROI", en: "Executive, concise, and ROI-oriented" }
    }
};

export const social_config: Record<string, { rol: string; ratio: string }> = {
    instagram: { rol: "Creative Visual Director", ratio: "--ar 4:5" },
    tiktok: { rol: "Viral Content Strategist", ratio: "--ar 9:16" },
    youtube: { rol: "Multimedia Producer", ratio: "--ar 16:9" },
    twitter: { rol: "Tech & Art Influencer", ratio: "--ar 16:9" },
    linkedin: { rol: "Industry Thought Leader", ratio: "--ar 4:5" },
    facebook: { rol: "Digital Marketing Manager", ratio: "--ar 1:1" }
};

export const social_formats: Record<string, { group: string; label: { es: string; en: string } }[]> = {
    instagram: [
        { group: "🎵", label: { es: "Visualizer para Audio (Reel)", en: "Audio Visualizer (Reel)" } },
        { group: "🎵", label: { es: "Anuncio de Lanzamiento (Single/EP)", en: "Release Announcement (Single/EP)" } },
        { group: "🚀", label: { es: "Showcase UI/UX (Carousel)", en: "UI/UX Showcase (Carousel)" } },
        { group: "🚀", label: { es: "Feature Highlight", en: "Feature Highlight" } },
        { group: "🎨", label: { es: "Process Video (Generative Art)", en: "Process Video (Generative Art)" } },
        { group: "🎨", label: { es: "Render Final (Estático)", en: "Final Render (Static)" } }
    ],
    tiktok: [
        { group: "🚀", label: { es: "App Hack / Hidden Feature", en: "App Hack / Hidden Feature" } },
        { group: "🎵", label: { es: "Behind the Song", en: "Behind the Song" } },
        { group: "🎨", label: { es: "Live Coding Session", en: "Live Coding Session" } },
        { group: "⚡", label: { es: "Trend Adaptation", en: "Trend Adaptation" } }
    ],
    twitter: [
        { group: "🚀", label: { es: "Launch Thread (Build in Public)", en: "Launch Thread (Build in Public)" } },
        { group: "🎨", label: { es: "Daily Render / WIP", en: "Daily Render / WIP" } },
        { group: "🔧", label: { es: "Architecture Deep Dive", en: "Architecture Deep Dive" } }
    ],
    youtube: [
        { group: "🎵", label: { es: "Official Lyric Video", en: "Official Lyric Video" } },
        { group: "🚀", label: { es: "App Trailer / Promo", en: "App Trailer / Promo" } },
        { group: "🎓", label: { es: "Tutorial Técnico / Breakdown", en: "Technical Tutorial / Breakdown" } }
    ],
    linkedin: [
        { group: "🚀", label: { es: "Case Study (Problem/Solution)", en: "Case Study (Problem/Solution)" } },
        { group: "💡", label: { es: "Industry Insight", en: "Industry Insight" } }
    ],
    facebook: [
        { group: "📢", label: { es: "Direct Response Ad", en: "Direct Response Ad" } },
        { group: "📅", label: { es: "Event Invitation", en: "Event Invitation" } }
    ]
};
