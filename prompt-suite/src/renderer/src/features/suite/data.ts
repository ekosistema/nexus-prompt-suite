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
            es: `Actúa como un **Senior DevOps Engineer** especializado en containerización segura y eficiente.

Tu objetivo es producir un Dockerfile **multi-stage** listo para producción para una {{APP_TYPE}} desarrollada con {{LANG}}. El resultado debe ser reproducible, mínimo en tamaño y seguro por defecto.

**Contexto de la aplicación:**
- **Lenguaje/Framework:** {{LANG}}
- **Tipo de aplicación:** {{APP_TYPE}}
- **Puerto de exposición:** {{CONTAINER_PORT}}

**PASOS:**
1. Justifica la elección de imagen base (build y runtime) indicando versión concreta.
2. Diseña stages de build y runtime separados para reducir el tamaño final de la imagen.
3. Configura la ejecución como usuario **non-root** por defecto.
4. Añade un 'HEALTHCHECK' acorde al tipo de aplicación.
5. Ordena las instrucciones para maximizar el aprovechamiento del cache de capas.
6. Documenta cada decisión con comentarios breves y accionables.
7. Proporciona un '.dockerignore' mínimo y eficaz para el contexto de la app.

**FORMATO DE SALIDA:**
- Dockerfile completo con comentarios.
- '.dockerignore' recomendado.
- Comandos de build y run con el puerto {{CONTAINER_PORT}}.
- Checklist de las optimizaciones aplicadas.

IDIOMA: {{LANG_OUTPUT}}`,
            en: `Act as a **Senior DevOps Engineer** specialized in secure, efficient containerization.

Your goal is to produce a production-ready **multi-stage** Dockerfile for a {{APP_TYPE}} built with {{LANG}}. The result must be reproducible, minimal in size, and secure by default.

**Application context:**
- **Language/Framework:** {{LANG}}
- **Application type:** {{APP_TYPE}}
- **Exposed port:** {{CONTAINER_PORT}}

**STEPS:**
1. Justify the base image choice (build and runtime) with a pinned version.
2. Separate build and runtime stages to minimize final image size.
3. Run as a **non-root** user by default.
4. Add a 'HEALTHCHECK' suited to the application type.
5. Order instructions to maximize Docker layer caching.
6. Document every decision with brief, actionable comments.
7. Provide an effective, minimal '.dockerignore' for the app context.

**OUTPUT FORMAT:**
- Complete Dockerfile with comments.
- Recommended '.dockerignore'.
- Build and run commands using port {{CONTAINER_PORT}}.
- Checklist of the optimizations applied.

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
            es: `Actúa como un **Senior DevOps Engineer** experto en CI/CD con GitHub Actions.

Tu objetivo es generar un workflow completo de GitHub Actions para un proyecto en {{LANG}} (framework {{FRAMEWORK}}) que lleve el código desde lint hasta el despliegue automatizado en {{DEPLOY}}.

**Contexto del proyecto:**
- **Lenguaje:** {{LANG}}
- **Framework:** {{FRAMEWORK}}
- **Destino de despliegue:** {{DEPLOY}}

**PASOS Y REQUISITOS:**
1. Job de **lint** con el linter estándar del ecosistema.
2. Job de **unit tests** con generación de coverage.
3. Job de **build** que valide la compilación del proyecto.
4. **Security scan** con las acciones recomendadas y config.
5. Job de **deploy** disparado en 'main' (manual mediante 'workflow_dispatch' o approval).
6. Cache de dependencias para acelerar los jobs.
7. Configuración de secrets como variables de entorno cifradas.
8. Notificación de estado y badge de status para el README.

**FORMATO DE SALIDA:**
- Archivo '.github/workflows/ci.yml' completo con comentarios.
- Resumen de los secrets y variables de entorno requeridos.
- Instrucciones para activar el badge de status.

IDIOMA: {{LANG_OUTPUT}}`,
            en: `Act as a **Senior DevOps Engineer** experienced in GitHub Actions CI/CD.

Your goal is to generate a complete GitHub Actions workflow for a {{LANG}} project ({{FRAMEWORK}} framework) that takes code from lint to automated deployment on {{DEPLOY}}.

**Project context:**
- **Language:** {{LANG}}
- **Framework:** {{FRAMEWORK}}
- **Deploy target:** {{DEPLOY}}

**STEPS AND REQUIREMENTS:**
1. **Lint** job using the ecosystem's standard linter.
2. **Unit tests** job with coverage reporting.
3. **Build** job that validates project compilation.
4. **Security scan** with recommended actions and config.
5. **Deploy** job triggered on 'main' (manual via 'workflow_dispatch' or approval).
6. Dependency caching to speed up jobs.
7. Secrets configured as encrypted environment variables.
8. Status notification and status badge for the README.

**OUTPUT FORMAT:**
- Complete '.github/workflows/ci.yml' file with comments.
- Summary of required secrets and environment variables.
- Instructions to enable the status badge.

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
            es: `Actúa como un **Senior Cloud Infrastructure Engineer** especializado en IaC con Terraform.

Tu objetivo es generar un **módulo de Terraform** reutilizable para provisionar el recurso '{{RESOURCE}}' en {{CLOUD}}, con buenas prácticas de versionado, validación y documentación.

**Contexto del módulo:**
- **Recurso a provisionar:** {{RESOURCE}}
- **Proveedor Cloud:** {{CLOUD}}

**PASOS Y REQUISITOS:**
1. Declara variables con 'description', 'type', 'validation' y defaults sensatos.
2. Define outputs documentados para consumo desde otros módulos.
3. Aplica etiquetado (tags) consistente y configurable.
4. Usa 'lifecycle' rules ('prevent_destroy', 'create_before_destroy') donde aplique.
5. Fija la versión del proveedor y del terraform requerido.
6. Incluye un README con ejemplo completo de uso.

**FORMATO DE SALIDA:**
- 'variables.tf', 'outputs.tf' y 'main.tf' completos.
- 'versions.tf' con version pinning.
- 'README.md' con ejemplo de invocación.

IDIOMA: {{LANG_OUTPUT}}`,
            en: `Act as a **Senior Cloud Infrastructure Engineer** specialized in Terraform IaC.

Your goal is to generate a reusable **Terraform module** to provision the '{{RESOURCE}}' resource on {{CLOUD}}, following best practices for versioning, validation, and documentation.

**Module context:**
- **Resource to provision:** {{RESOURCE}}
- **Cloud provider:** {{CLOUD}}

**STEPS AND REQUIREMENTS:**
1. Declare variables with 'description', 'type', 'validation', and sensible defaults.
2. Define documented outputs for consumption by other modules.
3. Apply consistent, configurable tagging.
4. Use 'lifecycle' rules ('prevent_destroy', 'create_before_destroy') where applicable.
5. Pin the provider version and required Terraform version.
6. Include a README with a complete usage example.

**OUTPUT FORMAT:**
- Complete 'variables.tf', 'outputs.tf', and 'main.tf'.
- 'versions.tf' with version pinning.
- 'README.md' with an invocation example.

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
            es: `Actúa como un **Senior Security Architect** con experiencia en análisis de amenazas.

Realiza un **modelo de amenazas STRIDE** exhaustivo para {{APP_NAME}}, una {{APP_TYPE}} con arquitectura {{ARCHITECTURE}}. Tu análisis debe traducirse en mitigaciones accionables y priorizadas.

**Contexto del sistema:**
- **Aplicación:** {{APP_NAME}}
- **Tipo:** {{APP_TYPE}}
- **Arquitectura:** {{ARCHITECTURE}}

**ANÁLISIS STRIDE (por cada categoría):**
1. **Spoofing**: identifica vectores de suplantación y sus controles.
2. **Tampering**: mapea dónde puede alterarse la información.
3. **Repudiation**: detecta acciones sin auditoría ni no-repudio.
4. **Information Disclosure**: enumera datos expuestos y superficies de fuga.
5. **Denial of Service**: analiza vectores de indisponibilidad y abuso de recursos.
6. **Elevation of Privilege**: traza caminos de escalada de privilegios.

**FORMATO DE SALIDA:**
- Descripción textual del flujo de datos (actores, procesos, almacenes).
- Tabla de amenazas: componente, amenaza, impacto, probabilidad, mitigación y prioridad.
- Lista priorizada de recomendaciones de seguridad.
- Checklist de hardening específico para {{APP_TYPE}}.

IDIOMA: {{LANG_OUTPUT}}`,
            en: `Act as a **Senior Security Architect** experienced in threat analysis.

Perform an exhaustive **STRIDE threat model** for {{APP_NAME}}, a {{APP_TYPE}} with a {{ARCHITECTURE}} architecture. Your analysis must translate into actionable, prioritized mitigations.

**System context:**
- **Application:** {{APP_NAME}}
- **Type:** {{APP_TYPE}}
- **Architecture:** {{ARCHITECTURE}}

**STRIDE ANALYSIS (for each category):**
1. **Spoofing**: identify impersonation vectors and their controls.
2. **Tampering**: map where information can be altered.
3. **Repudiation**: detect actions without auditability or non-repudiation.
4. **Information Disclosure**: enumerate exposed data and leak surfaces.
5. **Denial of Service**: analyze unavailability vectors and resource abuse.
6. **Elevation of Privilege**: trace privilege escalation paths.

**OUTPUT FORMAT:**
- Textual data flow description (actors, processes, data stores).
- Threat table: component, threat, impact, likelihood, mitigation, and priority.
- Prioritized list of security recommendations.
- Hardening checklist specific to {{APP_TYPE}}.

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
            es: `Actúa como un **Application Security Engineer** senior.

Genera un **Security Checklist** accionable y específico para aplicaciones **{{LANG}}** de tipo {{APP_TYPE}}. Cada ítem debe permitir auditar el código de forma concreta.

**Contexto:**
- **Lenguaje:** {{LANG}}
- **Tipo de aplicación:** {{APP_TYPE}}

**CATEGORÍAS A CUBRIR:**
1. **Input Validation**: sanitización, tipos, SQL injection, XSS.
2. **Authentication & Authorization**: sesiones, JWT/OAuth, RBAC.
3. **Data Protection**: cifrado en reposo/tránsito, secretos.
4. **Dependencies**: escaneo de vulnerabilidades y supply chain.
5. **Error Handling**: fuga de información, stack traces, logging.
6. **Configuration**: variables de entorno, secretos hardcodeados, defaults inseguros.
7. **API Security**: rate limiting, CORS, CSRF, límites de tamaño.

**FORMATO DE SALIDA:**
- Checklist con ítems marcables.
- Nivel de criticidad (Crítico/Alto/Medio) por ítem.
- Ejemplo **vulnerable vs seguro** en {{LANG}} para cada punto clave.

IDIOMA: {{LANG_OUTPUT}}`,
            en: `Act as a **Senior Application Security Engineer**.

Generate an actionable, specific **Security Checklist** for **{{LANG}}** applications of type {{APP_TYPE}}. Each item must allow concrete code auditing.

**Context:**
- **Language:** {{LANG}}
- **Application type:** {{APP_TYPE}}

**CATEGORIES TO COVER:**
1. **Input Validation**: sanitization, types, SQL injection, XSS.
2. **Authentication & Authorization**: sessions, JWT/OAuth, RBAC.
3. **Data Protection**: encryption at rest/in transit, secrets.
4. **Dependencies**: vulnerability scanning and supply chain.
5. **Error Handling**: information leakage, stack traces, logging.
6. **Configuration**: environment variables, hardcoded secrets, unsafe defaults.
7. **API Security**: rate limiting, CORS, CSRF, size limits.

**OUTPUT FORMAT:**
- Checklist with checkable items.
- Severity level (Critical/High/Medium) per item.
- **Vulnerable vs secure** example in {{LANG}} for each key point.

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
            es: `Actúa como un **Technical Writer Senior** con experiencia en desarrollo de software y SEO técnico.

Escribe un **artículo técnico** completo sobre **{{TOPIC}}**, orientado a la keyword **{{HEADLINE_KEYWORD}}** y dirigido a una audiencia de nivel **{{AUDIENCE_LEVEL}}**.

**Contexto del artículo:**
- **Tema:** {{TOPIC}}
- **Keyword principal del titular:** {{HEADLINE_KEYWORD}}
- **Nivel de la audiencia:** {{AUDIENCE_LEVEL}}

**PASOS:**
1. Propón 3 títulos SEO-optimizados usando la keyword.
2. Redacta un TL;DR al inicio y una introducción con hook y problema.
3. Desarrolla el contenido técnico con ejemplos de código correctos y explicados.
4. Incluye una sección de mejores prácticas y errores comunes.
5. Cierra con conclusión, siguiente paso y llamada a la acción.
6. Aporta meta description, keywords y slug sugerido (150/160 chars).

**FORMATO DE SALIDA:**
- Artículo completo en Markdown con headings jerárquicos.
- Código con lenguaje especificado.
- Meta y slug al final del documento.
- Tiempo estimado de lectura.

IDIOMA: {{LANG_OUTPUT}}`,
            en: `Act as a **Senior Technical Writer** with software development and technical SEO experience.

Write a complete **technical article** about **{{TOPIC}}**, targeting the keyword **{{HEADLINE_KEYWORD}}** and aimed at a **{{AUDIENCE_LEVEL}}** audience.

**Article context:**
- **Topic:** {{TOPIC}}
- **Main headline keyword:** {{HEADLINE_KEYWORD}}
- **Audience level:** {{AUDIENCE_LEVEL}}

**STEPS:**
1. Propose 3 SEO-optimized titles using the keyword.
2. Draft a TL;DR at the top and an introduction with a hook and problem.
3. Develop the technical content with correct, explained code examples.
4. Include a best practices and common mistakes section.
5. Close with a conclusion, next step, and call to action.
6. Provide meta description, keywords, and suggested slug.

**OUTPUT FORMAT:**
- Complete article in Markdown with hierarchical headings.
- Code with specified language.
- Meta and slug at the end of the document.
- Estimated reading time.

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
            es: `Actúa como un **Technical Writer** especializado en documentación de APIs.

Genera la **documentación completa** de {{API_NAME}}, una API del tipo **{{API_TYPE}}** servida desde **{{BASE_URL}}**. Debe ser útil para desarrolladores nuevos y para integradores experimentados.

**Contexto de la API:**
- **Nombre:** {{API_NAME}}
- **Tipo:** {{API_TYPE}}
- **Base URL:** {{BASE_URL}}

**SECCIONES OBLIGATORIAS:**
1. **Overview**: propósito, casos de uso y términos clave.
2. **Authentication**: método (API keys, OAuth, JWT) y pasos para obtener credenciales.
3. **Endpoints**: para cada entrega, método, path, headers, body (schema), respuestas (200/400/401/404/500) y ejemplo 'curl'.
4. **Rate Limiting**: límites y headers asociados.
5. **Error Codes**: tabla completa de errores con descripción y resolución.
6. **Client Examples**: snippet de uso en un lenguaje común.

**FORMATO DE SALIDA:**
- Markdown estructurado con la OpenAPI/Swagger spec embebida si aplica.
- Ejemplos 'curl' reales construidos sobre **{{BASE_URL}}**.

IDIOMA: {{LANG_OUTPUT}}`,
            en: `Act as a **Technical Writer** specialized in API documentation.

Generate the **complete documentation** for {{API_NAME}}, a **{{API_TYPE}}** API served from **{{BASE_URL}}**. It must be useful for new developers and experienced integrators alike.

**API context:**
- **Name:** {{API_NAME}}
- **Type:** {{API_TYPE}}
- **Base URL:** {{BASE_URL}}

**REQUIRED SECTIONS:**
1. **Overview**: purpose, use cases, and key terms.
2. **Authentication**: method (API keys, OAuth, JWT) and steps to obtain credentials.
3. **Endpoints**: per endpoint, method, path, headers, body (schema), responses (200/400/401/404/500), and a 'curl' example.
4. **Rate Limiting**: limits and associated headers.
5. **Error Codes**: complete error table with description and resolution.
6. **Client Examples**: usage snippet in a common language.

**OUTPUT FORMAT:**
- Structured Markdown with the OpenAPI/Swagger spec embedded if applicable.
- Real 'curl' examples built against **{{BASE_URL}}**.

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
            es: `Actúa como un **Technical Product Manager** con foco en comunicación de producto.

Redacta las **Release Notes** de la versión **{{VERSION}}** de **{{PRODUCT}}**, orientadas a que usuarios técnicos y stakeholders entiendan el impacto del lanzamiento de un vistazo.

**Contexto:**
- **Versión:** {{VERSION}}
- **Producto:** {{PRODUCT}}

**ESTRUCTURA:**
1. **Header**: versión, fecha estimada y highlight del release.
2. **Breaking Changes**: lista con guía de migración paso a paso.
3. **New Features**: beneficios y casos de uso de cada feature.
4. **Improvements**: optimizaciones y cambios de UX.
5. **Bug Fixes**: agrupados por área de impacto.
6. **Deprecations**: qué se retira y cuándo, con alternativa.
7. **Known Issues**: problemas conocidos con workarounds.
8. **Upgrade Guide**: pasos concretos para actualizar a {{VERSION}}.

**FORMATO DE SALIDA:**
- Markdown con emojis por categoría y secciones claramente numeradas.
- Tono profesional y accesible, celebratorio pero honesto.

IDIOMA: {{LANG_OUTPUT}}`,
            en: `Act as a **Technical Product Manager** focused on product communication.

Draft the **Release Notes** for version **{{VERSION}}** of **{{PRODUCT}}**, aimed at letting technical users and stakeholders grasp the launch impact at a glance.

**Context:**
- **Version:** {{VERSION}}
- **Product:** {{PRODUCT}}

**STRUCTURE:**
1. **Header**: version, estimated date, and release highlight.
2. **Breaking Changes**: list with step-by-step migration guide.
3. **New Features**: benefits and use cases of each feature.
4. **Improvements**: optimizations and UX changes.
5. **Bug Fixes**: grouped by impact area.
6. **Deprecations**: what is being removed and when, with alternatives.
7. **Known Issues**: known problems with workarounds.
8. **Upgrade Guide**: concrete steps to upgrade to {{VERSION}}.

**OUTPUT FORMAT:**
- Markdown with emojis per category and clearly numbered sections.
- Professional yet accessible tone, celebratory but honest.

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
            es: `Actúa como un **Senior Product Manager** con experiencia en productos digitales.

Redacta un **Product Requirements Document (PRD)** completo para **{{PRODUCT_NAME}}**, que resuelve **{{PROBLEM}}** para **{{TARGET_USERS}}**. El documento debe servir para alinear a producto, ingeniería y negocio.

**Contexto:**
- **Producto:** {{PRODUCT_NAME}}
- **Problema:** {{PROBLEM}}
- **Usuarios objetivo:** {{TARGET_USERS}}

**SECCIONES OBLIGATORIAS:**
1. **Problem Statement**: problema, contexto y por qué ahora.
2. **Target Users**: perfiles, jobs-to-be-done y escenarios.
3. **Success Metrics**: North Star, KPIs y OKRs relacionados.
4. **Solution Overview**: propuesta de valor y user stories principales.
5. **Requirements**: funcionales (Must/Should/Could) y no funcionales.
6. **User Flows**: paso a paso de los flujos críticos.
7. **Technical Considerations**: arquitectura, dependencias y riesgos.
8. **Go-to-Market**: lanzamiento y rollout.
9. **Timeline**: fases con milestones.
10. **Open Questions**: decisiones pendientes.

**FORMATO DE SALIDA:**
- Documento Markdown estructurado con las 10 secciones completas.

IDIOMA: {{LANG_OUTPUT}}`,
            en: `Act as a **Senior Product Manager** experienced in digital products.

Draft a complete **Product Requirements Document (PRD)** for **{{PRODUCT_NAME}}**, which solves **{{PROBLEM}}** for **{{TARGET_USERS}}**. The document must align product, engineering, and business.

**Context:**
- **Product:** {{PRODUCT_NAME}}
- **Problem:** {{PROBLEM}}
- **Target users:** {{TARGET_USERS}}

**REQUIRED SECTIONS:**
1. **Problem Statement**: problem, context, and why now.
2. **Target Users**: profiles, jobs-to-be-done, and scenarios.
3. **Success Metrics**: North Star, KPIs, and related OKRs.
4. **Solution Overview**: value proposition and main user stories.
5. **Requirements**: functional (Must/Should/Could) and non-functional.
6. **User Flows**: step-by-step critical flows.
7. **Technical Considerations**: architecture, dependencies, and risks.
8. **Go-to-Market**: launch and rollout.
9. **Timeline**: phases with milestones.
10. **Open Questions**: pending decisions.

**OUTPUT FORMAT:**
- Structured Markdown document with all 10 sections complete.

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
            es: `Actúa como un **Principal Software Architect** orientado a decisiones técnicas trazables.

Redacta un **Architecture Decision Record (ADR)** que documente la decisión **{{DECISION}}**, dejando el contexto **{{CONTEXT}}** y las consecuencias claramente registrados para futuras revisiones.

**Contexto de la decisión:**
- **Decisión:** {{DECISION}}
- **Contexto:** {{CONTEXT}}

**ESTRUCTURA (formato Nygard):**
1. **Title**: título descriptivo de la decisión.
2. **Status**: Proposed | Accepted | Deprecated | Superseded (justifica).
3. **Context**: situación actual, fuerzas y restricciones relevantes.
4. **Decision**: qué se decide y por qué se selecciona esta opción.
5. **Alternatives Considered**: para cada alternativa, pros, contras y motivo de rechazo.
6. **Consequences**: impacto positivo y negativo, incluidos trade-offs.
7. **Compliance**: criterios y forma de verificar que se respeta la decisión.
8. **Notes**: referencias, links y personas implicadas.

**FORMATO DE SALIDA:**
- ADR completo en Markdown, tono técnico, objetivo y sin ambigüedades.

IDIOMA: {{LANG_OUTPUT}}`,
            en: `Act as a **Principal Software Architect** focused on traceable technical decisions.

Draft an **Architecture Decision Record (ADR)** documenting the decision **{{DECISION}}**, clearly recording the context **{{CONTEXT}}** and consequences for future reviews.

**Decision context:**
- **Decision:** {{DECISION}}
- **Context:** {{CONTEXT}}

**STRUCTURE (Nygard format):**
1. **Title**: descriptive decision title.
2. **Status**: Proposed | Accepted | Deprecated | Superseded (justify it).
3. **Context**: current situation, relevant forces, and constraints.
4. **Decision**: what is decided and why this option was selected.
5. **Alternatives Considered**: per alternative, pros, cons, and rejection reason.
6. **Consequences**: positive and negative impact, including trade-offs.
7. **Compliance**: criteria and how to verify the decision is respected.
8. **Notes**: references, links, and people involved.

**OUTPUT FORMAT:**
- Complete ADR in Markdown, technical, objective, and unambiguous.

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
            es: `Actúa como un **Staff Engineer** responsable de diseños técnicos claros y ejecutables.

Escribe una **Especificación Técnica** para **{{FEATURE}}**, con contexto **{{CONTEXT}}** y sobre el stack **{{TECH_STACK}}**. El documento debe permitir a cualquier ingeniero implementar sin ambigüedades.

**Contexto:**
- **Feature/Sistema:** {{FEATURE}}
- **Contexto:** {{CONTEXT}}
- **Stack tecnológico:** {{TECH_STACK}}

**SECCIONES OBLIGATORIAS:**
1. **Overview**: qué se construye y por qué.
2. **Goals & Non-Goals**: alcance y fuera de alcance.
3. **System Design**: arquitectura (descripción textual), componentes y flujos de datos.
4. **API Design**: endpoints, schemas y contratos.
5. **Data Model**: entidades, relaciones e índices.
6. **Error Handling**: estrategia de errores y retries.
7. **Performance**: benchmarks esperados, límites y latencia objetivo.
8. **Security**: autenticación, autorización y protección de datos.
9. **Testing Strategy**: unit, integration, E2E y load.
10. **Rollout Plan**: feature flags, canary y monitorización.
11. **Migration**: plan de migración si aplica.

**FORMATO DE SALIDA:**
- Documento Markdown con todas las secciones numeradas y consistentes con {{TECH_STACK}}.

IDIOMA: {{LANG_OUTPUT}}`,
            en: `Act as a **Staff Engineer** responsible for clear, executable technical designs.

Write a **Technical Specification** for **{{FEATURE}}**, with context **{{CONTEXT}}**, on the **{{TECH_STACK}}** stack. The document must let any engineer implement without ambiguity.

**Context:**
- **Feature/System:** {{FEATURE}}
- **Context:** {{CONTEXT}}
- **Tech stack:** {{TECH_STACK}}

**REQUIRED SECTIONS:**
1. **Overview**: what will be built and why.
2. **Goals & Non-Goals**: in and out of scope.
3. **System Design**: architecture (textual description), components, and data flows.
4. **API Design**: endpoints, schemas, and contracts.
5. **Data Model**: entities, relationships, and indexes.
6. **Error Handling**: error and retry strategy.
7. **Performance**: expected benchmarks, limits, and target latency.
8. **Security**: authentication, authorization, and data protection.
9. **Testing Strategy**: unit, integration, E2E, and load.
10. **Rollout Plan**: feature flags, canary, and monitoring.
11. **Migration**: migration plan if applicable.

**OUTPUT FORMAT:**
- Markdown document with all sections numbered and consistent with {{TECH_STACK}}.

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
            es: `Actúa como un **Senior Kubernetes Engineer** especializado en workloads seguros.

Genera los manifests de Kubernetes para desplegar **{{APP_NAME}}** ({{APP_TYPE}}) expuesta en el puerto **{{CONTAINER_PORT}}**, con alta disponibilidad y buenas prácticas de seguridad.

**Contexto:**
- **Aplicación:** {{APP_NAME}}
- **Tipo:** {{APP_TYPE}}
- **Puerto del contenedor:** {{CONTAINER_PORT}}

**MANIFESTS Y REQUISITOS:**
1. **Deployment**: replicas, requests/limits, liveness/readiness/startup probes y 'securityContext' non-root.
2. **Service** (ClusterIP o LoadBalancer) con targetPort {{CONTAINER_PORT}}.
3. **Ingress** con TLS y annotations básicas.
4. **HorizontalPodAutoscaler** basado en CPU/memoria.
5. **ConfigMap** y plantilla de **Secret** (con placeholders).
6. Labels estándar 'app.kubernetes.io/*' en todos los objetos.
7. **PodDisruptionBudget** y comentarios explicativos.

**FORMATO DE SALIDA:**
- YAML único separado por '---' con todos los manifests y comentarios.

IDIOMA: {{LANG_OUTPUT}}`,
            en: `Act as a **Senior Kubernetes Engineer** specialized in secure workloads.

Generate the Kubernetes manifests to deploy **{{APP_NAME}}** (a {{APP_TYPE}}) exposed on port **{{CONTAINER_PORT}}**, with high availability and security best practices.

**Context:**
- **Application:** {{APP_NAME}}
- **Type:** {{APP_TYPE}}
- **Container port:** {{CONTAINER_PORT}}

**MANIFESTS AND REQUIREMENTS:**
1. **Deployment**: replicas, requests/limits, liveness/readiness/startup probes, and non-root 'securityContext'.
2. **Service** (ClusterIP or LoadBalancer) with targetPort {{CONTAINER_PORT}}.
3. **Ingress** with TLS and basic annotations.
4. **HorizontalPodAutoscaler** based on CPU/memory.
5. **ConfigMap** and a **Secret** template (with placeholders).
6. Standard 'app.kubernetes.io/*' labels on all objects.
7. **PodDisruptionBudget** and explanatory comments.

**OUTPUT FORMAT:**
- Single YAML separated by '---' with all manifests and comments.

LANGUAGE: {{LANG_OUTPUT}}`
        },
        tags: ['kubernetes', 'k8s', 'devops', 'cloud', 'manifests']
    },
    // Security - More
    {
        id: 'pentest_plan',
        category: 'security',
        icon: '🔓',
        title: { es: 'Plan de Penetration Testing', en: 'Penetration Testing Plan' },
        description: { es: 'Genera un plan de pentest estructurado con fases, herramientas y reportes.', en: 'Generate a structured pentest plan with phases, tools, and reporting.' },
        prompt: {
            es: `Actúa como un **Senior Penetration Tester** con certificaciones OSCP/OSWE y ética profesional.

Diseña un **Plan de Penetration Testing** estructurado para **{{APP_NAME}}**, una {{APP_TYPE}}, limitado al alcance **{{SCOPE}}**. El plan debe ser accionable, legalmente correcto y trazable.

**Contexto:**
- **Aplicación:** {{APP_NAME}}
- **Tipo:** {{APP_TYPE}}
- **Alcance autorizado:** {{SCOPE}}

**FASES DEL PENTEST:**
1. **Reconnaissance**: OSINT, enumeración de subdominios y detección de stack.
2. **Scanning**: escaneo de puertos, vulnerabilidades y web application scanning.
3. **Exploitation**: auth bypass, injection, file upload, SSRF y similares.
4. **Post-Exploitation**: escalada de privilegios, movimiento lateral y extracción controlada de datos.
5. **Reporting**: resumen ejecutivo, hallazgos técnicos y remediación priorizada.

**FORMATO DE SALIDA:**
- Metodología elegida (OWASP Top 10, PTES, NIST) con justificación.
- Herramientas recomendadas por fase.
- Matriz de riesgos con scoring.
- Template de reporte y timeline estimado.

IDIOMA: {{LANG_OUTPUT}}`,
            en: `Act as a **Senior Penetration Tester** with OSCP/OSWE certifications and professional ethics.

Design a structured **Penetration Testing Plan** for **{{APP_NAME}}**, a {{APP_TYPE}}, limited to the **{{SCOPE}}** scope. The plan must be actionable, legally sound, and traceable.

**Context:**
- **Application:** {{APP_NAME}}
- **Type:** {{APP_TYPE}}
- **Authorized scope:** {{SCOPE}}

**PENTEST PHASES:**
1. **Reconnaissance**: OSINT, subdomain enumeration, and stack detection.
2. **Scanning**: port scanning, vulnerability scanning, and web application scanning.
3. **Exploitation**: auth bypass, injection, file upload, SSRF, and similar.
4. **Post-Exploitation**: privilege escalation, lateral movement, and controlled data exfiltration.
5. **Reporting**: executive summary, technical findings, and prioritized remediation.

**OUTPUT FORMAT:**
- Chosen methodology (OWASP Top 10, PTES, NIST) with justification.
- Recommended tools per phase.
- Risk matrix with scoring.
- Report template and estimated timeline.

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
            es: `Actúa como un **Incident Response Lead (GCIH)** con visión de **CISO**.

Crea un **Plan de Respuesta a Incidentes** para **{{ORGANIZATION}}**, adaptado a su infraestructura **{{INFRASTRUCTURE}}**. El plan debe permitir al equipo contener y recuperar incidentes sin fricción ni ambigüedad.

**Contexto:**
- **Organización:** {{ORGANIZATION}}
- **Tipo de infraestructura:** {{INFRASTRUCTURE}}

**FASES (NIST SP 800-61):**
1. **Preparation**: equipo, herramientas, plan de comunicación y entrenamiento.
2. **Detection & Analysis**: fuentes de alerta, triage y clasificación de severidad.
3. **Containment**: estrategias de contención a corto y largo plazo.
4. **Eradication**: eliminación de causa raíz y hardening.
5. **Recovery**: restauración, monitoreo y validación.
6. **Post-Incident**: lecciones aprendidas, reporte y mejora continua.

**FORMATO DE SALIDA:**
- Roles y responsabilidades (IR Lead, Comms, Legal, Tech).
- Matriz de severidad (P1-P4) con SLAs.
- Templates de comunicación y paths de escalado.
- Checklist de forense digital aplicable a {{INFRASTRUCTURE}}.

IDIOMA: {{LANG_OUTPUT}}`,
            en: `Act as an **Incident Response Lead (GCIH)** with a **CISO** mindset.

Create an **Incident Response Plan** for **{{ORGANIZATION}}**, tailored to its **{{INFRASTRUCTURE}}** infrastructure. The plan must let the team contain and recover incidents without friction or ambiguity.

**Context:**
- **Organization:** {{ORGANIZATION}}
- **Infrastructure type:** {{INFRASTRUCTURE}}

**PHASES (NIST SP 800-61):**
1. **Preparation**: team, tools, communication plan, and training.
2. **Detection & Analysis**: alert sources, triage, and severity classification.
3. **Containment**: short- and long-term containment strategies.
4. **Eradication**: root cause removal and hardening.
5. **Recovery**: restoration, monitoring, and validation.
6. **Post-Incident**: lessons learned, report, and continuous improvement.

**OUTPUT FORMAT:**
- Roles and responsibilities (IR Lead, Comms, Legal, Tech).
- Severity matrix (P1-P4) with SLAs.
- Communication templates and escalation paths.
- Digital forensics checklist applicable to {{INFRASTRUCTURE}}.

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

Redacta un **README.md profesional** para el proyecto **{{PROJECT_NAME}}**: **{{DESCRIPTION}}**, construido con **{{TECH_STACK}}**. El README debe reducir la fricción de onboarding de cualquier nueva persona contribuidora.

**Contexto:**
- **Proyecto:** {{PROJECT_NAME}}
- **Descripción:** {{DESCRIPTION}}
- **Stack tecnológico:** {{TECH_STACK}}

**SECCIONES:**
1. Header con título y badges (build, coverage, version, license).
2. **About** con features en bullets.
3. **Quick Start** funcional en 3 pasos.
4. **Installation**: prerrequisitos y variables de entorno.
5. **Usage**: ejemplos de código y comandos clave.
6. Estructura de carpetas explicada.
7. **Contributing** con convención de commits.
8. **Testing** con comandos reales.
9. Licencia y créditos.

**FORMATO DE SALIDA:**
- Markdown con badges shields.io y diagrams Mermaid donde aporten.
- Todos los comandos coherentes con {{TECH_STACK}}.

IDIOMA: {{LANG_OUTPUT}}`,
            en: `Act as a **Developer Experience (DX) Engineer**.

Draft a **professional README.md** for the project **{{PROJECT_NAME}}**: **{{DESCRIPTION}}**, built on **{{TECH_STACK}}**. The README must reduce onboarding friction for any new contributor.

**Context:**
- **Project:** {{PROJECT_NAME}}
- **Description:** {{DESCRIPTION}}
- **Tech stack:** {{TECH_STACK}}

**SECTIONS:**
1. Header with title and badges (build, coverage, version, license).
2. **About** with feature bullets.
3. Working **Quick Start** in 3 steps.
4. **Installation**: prerequisites and environment variables.
5. **Usage**: code examples and key commands.
6. Explained folder structure.
7. **Contributing** with commit convention.
8. **Testing** with real commands.
9. License and credits.

**OUTPUT FORMAT:**
- Markdown with shields.io badges and Mermaid diagrams where useful.
- All commands consistent with {{TECH_STACK}}.

LANGUAGE: {{LANG_OUTPUT}}`
        },
        tags: ['readme', 'documentation', 'github', 'dx', 'open-source']
    },
    // Business - More
    // ─── DevOps Extended ─────────────────────────────────────────────────────

    {
        id: 'docker_compose_multi',
        category: 'devops',
        icon: '📦',
        title: { es: 'Docker Compose Multi-Service', en: 'Multi-Service Docker Compose' },
        description: { es: 'Entorno de desarrollo completo con múltiples servicios, redes y volúmenes.', en: 'Complete development environment with multiple services, networks, and volumes.' },
        prompt: {
            es: `Actúa como un **Senior DevOps Engineer** enfocado en entornos de desarrollo local reproducibles.

Crea un **docker-compose.yml** completo para un entorno de **{{APP_TYPE}}** que incluye los servicios adicionales **{{SERVICES}}** y usa **{{DATABASE}}** como base de datos.

**Contexto:**
- **App principal:** {{APP_TYPE}}
- **Servicios adicionales:** {{SERVICES}}
- **Base de datos:** {{DATABASE}}

**REQUISITOS:**
1. Multi-service con app, db, cache y worker si aplica.
2. Redes separadas para frontend y backend.
3. Volúmenes persistentes para datos de {{DATABASE}} y otros estados.
4. Health checks por servicio.
5. Variables de entorno centralizadas en '.env'.
6. Restart policies y límites de recursos (mem/cpu).
7. Perfiles development y production con overrides.

**FORMATO DE SALIDA:**
- 'docker-compose.yml' completo con comentarios.
- '.env.example' con todas las variables.
- README con comandos de uso (up, logs, down).

IDIOMA: {{LANG_OUTPUT}}`,
            en: `Act as a **Senior DevOps Engineer** focused on reproducible local development environments.

Create a complete **docker-compose.yml** for a **{{APP_TYPE}}** environment that includes the additional services **{{SERVICES}}** and uses **{{DATABASE}}** as the database.

**Context:**
- **Main app:** {{APP_TYPE}}
- **Additional services:** {{SERVICES}}
- **Database:** {{DATABASE}}

**REQUIREMENTS:**
1. Multi-service with app, db, cache, and worker if applicable.
2. Separate frontend and backend networks.
3. Persistent volumes for {{DATABASE}} data and other state.
4. Health checks per service.
5. Environment variables centralized in '.env'.
6. Restart policies and resource limits (mem/cpu).
7. Development and production profiles with overrides.

**OUTPUT FORMAT:**
- Complete 'docker-compose.yml' with comments.
- '.env.example' with all variables.
- README with usage commands (up, logs, down).

LANGUAGE: {{LANG_OUTPUT}}`
        },
        tags: ['docker', 'compose', 'devops', 'development', 'multi-service']
    },
    {
        id: 'monitoring_stack',
        category: 'devops',
        icon: '📊',
        title: { es: 'Monitoring Stack (Prometheus + Grafana)', en: 'Monitoring Stack (Prometheus + Grafana)' },
        description: { es: 'Configuración completa de observabilidad con alertas y dashboards.', en: 'Complete observability setup with alerts and dashboards.' },
        prompt: {
            es: `Actúa como un **Senior SRE** responsable de observabilidad accionable.

Diseña un **Monitoring Stack (Prometheus + Grafana)** para una **{{APP_TYPE}}**, centrado en las métricas **{{METRICS}}** y con condiciones de alerta **{{ALERTS}}**.

**Contexto:**
- **App:** {{APP_TYPE}}
- **Métricas clave:** {{METRICS}}
- **Condiciones de alerta:** {{ALERTS}}

**REQUISITOS:**
1. Config de Prometheus: scrape targets y recording rules para {{METRICS}}.
2. Dashboards de Grafana (app, infra, business) en formato JSON.
3. Alertmanager con routing y receivers (Slack, PagerDuty, email).
4. Exporters necesarios (node, app, db).
5. Alert rules con severidad y runbooks por condición.
6. Retención y configuración de storage.
7. Entrega como docker-compose o Helm values.

**FORMATO DE SALIDA:**
- Configs completas (prometheus.yml, alert rules, alertmanager) con comentarios.
- JSON de dashboards y guía de uso.

IDIOMA: {{LANG_OUTPUT}}`,
            en: `Act as a **Senior SRE** responsible for actionable observability.

Design a **Monitoring Stack (Prometheus + Grafana)** for a **{{APP_TYPE}}**, focused on the key metrics **{{METRICS}}** and with alert conditions **{{ALERTS}}**.

**Context:**
- **App:** {{APP_TYPE}}
- **Key metrics:** {{METRICS}}
- **Alert conditions:** {{ALERTS}}

**REQUIREMENTS:**
1. Prometheus config: scrape targets and recording rules for {{METRICS}}.
2. Grafana dashboards (app, infra, business) in JSON format.
3. Alertmanager with routing and receivers (Slack, PagerDuty, email).
4. Required exporters (node, app, db).
5. Alert rules with severity and runbooks per condition.
6. Retention and storage configuration.
7. Delivered as docker-compose or Helm values.

**OUTPUT FORMAT:**
- Complete configs (prometheus.yml, alert rules, alertmanager) with comments.
- Dashboard JSON and usage guide.

LANGUAGE: {{LANG_OUTPUT}}`
        },
        tags: ['monitoring', 'prometheus', 'grafana', 'sre', 'observability']
    },
// ─── Security Extended ────────────────────────────────────────────────────
{
        id: 'secrets_management',
        category: 'security',
        icon: '🗝️',
        title: { es: 'Secrets Management Plan', en: 'Secrets Management Plan' },
        description: { es: 'Estrategia de gestión de secretos con Vault, rotación y auditoría.', en: 'Secrets management strategy with Vault, rotation, and auditing.' },
        prompt: {
            es: `Actúa como un **Security Engineer** especializado en gestión de secretos.

Diseña un **Plan de Gestión de Secretos** para la infraestructura **{{INFRA}}**, cubriendo los tipos de secretos **{{SECRETS}}** con una política de rotación **{{ROTATION}}**.

**Contexto:**
- **Infraestructura:** {{INFRA}}
- **Tipos de secretos:** {{SECRETS}}
- **Política de rotación:** {{ROTATION}}

**REQUISITOS:**
1. Selección y configuración de la herramienta (Vault, AWS Secrets Manager o similar).
2. Clasificación de secretos y modelo de acceso con mínimo privilegio.
3. Automatización de rotación según {{ROTATION}}.
4. Auditoría y logging de acceso.
5. Inyección de secretos en CI/CD de forma segura.
6. Procedimiento break-glass de emergencia.
7. Escaneo de secretos en repositorios (gitleaks, git-secrets).
8. Plan de migración desde secretos hardcodeados.

**FORMATO DE SALIDA:**
- Arquitectura del flujo de secretos.
- Configs y policies listas para usar.
- Runbooks de rotación, acceso y emergencia.

IDIOMA: {{LANG_OUTPUT}}`,
            en: `Act as a **Security Engineer** specialized in secrets management.

Design a **Secrets Management Plan** for the **{{INFRA}}** infrastructure, covering the secret types **{{SECRETS}}** with a **{{ROTATION}}** rotation policy.

**Context:**
- **Infrastructure:** {{INFRA}}
- **Secret types:** {{SECRETS}}
- **Rotation policy:** {{ROTATION}}

**REQUIREMENTS:**
1. Tool selection and configuration (Vault, AWS Secrets Manager, or similar).
2. Secret classification and least-privilege access model.
3. Rotation automation according to {{ROTATION}}.
4. Access auditing and logging.
5. Secure secret injection in CI/CD.
6. Emergency break-glass procedure.
7. Secret scanning in repositories (gitleaks, git-secrets).
8. Migration plan from hardcoded secrets.

**OUTPUT FORMAT:**
- Secrets flow architecture.
- Ready-to-use configs and policies.
- Runbooks for rotation, access, and emergencies.

LANGUAGE: {{LANG_OUTPUT}}`
        },
        tags: ['secrets', 'vault', 'security', 'rotation', 'credentials']
    },
    {
        id: 'api_security_audit',
        category: 'security',
        icon: '🌐',
        title: { es: 'API Security Audit', en: 'API Security Audit' },
        description: { es: 'Revisión de endpoints con auth, rate limiting, input validation.', en: 'Endpoint review with auth, rate limiting, input validation.' },
        prompt: {
            es: `Actúa como un **API Security Specialist** con metodología OWASP API Security.

Realiza un **API Security Audit** de la API **{{API_URL}}**, construida con **{{FRAMEWORK}}**, dentro del alcance **{{SCOPE}}**.

**Contexto:**
- **API:** {{API_URL}}
- **Framework:** {{FRAMEWORK}}
- **Alcance:** {{SCOPE}}

**CHECKLIST A EVALUAR:**
1. **Authentication**: robustez de JWT/OAuth/API keys.
2. **Authorization**: RBAC/ABAC y prevención de IDOR.
3. **Input validation**: SQLi, XSS e inyecciones.
4. **Rate limiting** y throttling.
5. **CORS** y políticas de origen.
6. **Error handling**: fuga de información en respuestas.
7. **Data exposure**: over-fetching y exposición de PII.
8. **Logging y monitoring** de actividad sensible.

**FORMATO DE SALIDA:**
- Reporte con hallazgos por área, severidad y pasos de remediación.
- Ejemplo de request maliciosa vs segura por hallazgo relevante.

IDIOMA: {{LANG_OUTPUT}}`,
            en: `Act as an **API Security Specialist** with an OWASP API Security methodology.

Perform an **API Security Audit** of the **{{API_URL}}** API, built with **{{FRAMEWORK}}**, within the **{{SCOPE}}** scope.

**Context:**
- **API:** {{API_URL}}
- **Framework:** {{FRAMEWORK}}
- **Scope:** {{SCOPE}}

**CHECKLIST TO EVALUATE:**
1. **Authentication**: robustness of JWT/OAuth/API keys.
2. **Authorization**: RBAC/ABAC and IDOR prevention.
3. **Input validation**: SQLi, XSS, and injections.
4. **Rate limiting** and throttling.
5. **CORS** and origin policies.
6. **Error handling**: information leakage in responses.
7. **Data exposure**: over-fetching and PII exposure.
8. **Logging and monitoring** of sensitive activity.

**OUTPUT FORMAT:**
- Report with findings per area, severity, and remediation steps.
- Malicious vs secure request example per relevant finding.

LANGUAGE: {{LANG_OUTPUT}}`
        },
        tags: ['api', 'security', 'audit', 'authentication', 'authorization']
    },
    // ─── Writing Extended ─────────────────────────────────────────────────────

    {
        id: 'incident_postmortem',
        category: 'writing',
        icon: '🔍',
        title: { es: 'Postmortem de Incidente', en: 'Incident Postmortem' },
        description: { es: 'Reporte de postmortem blameless con timeline, root cause y action items.', en: 'Blameless postmortem report with timeline, root cause, and action items.' },
        prompt: {
            es: `Actúa como un **Incident Commander** que lidera la cultura blameless en su organización.

Escribe un **Postmortem de Incidente** para el incidente **{{INCIDENT}}**, cuyo impacto fue **{{IMPACT}}**, usando la línea temporal **{{TIMELINE}}** como base.

**Contexto:**
- **Incidente:** {{INCIDENT}}
- **Impacto:** {{IMPACT}}
- **Timeline:** {{TIMELINE}}

**SECCIONES OBLIGATORIAS:**
1. **Summary**: qué pasó, impacto y duración.
2. **Timeline** detallada: detección → respuesta → resolución.
3. **Root Cause Analysis**: análisis con los 5 Whys.
4. **What went well**.
5. **What went wrong**.
6. **Where we got lucky**.
7. **Action items**: con owner y deadline.
8. **Lessons learned** y recomendaciones.

**FORMATO DE SALIDA:**
- Markdown con tablas, tono blameless y orientado a mejora continua.

IDIOMA: {{LANG_OUTPUT}}`,
            en: `Act as an **Incident Commander** driving a blameless culture in your organization.

Write an **Incident Postmortem** for the incident **{{INCIDENT}}**, whose impact was **{{IMPACT}}**, using the **{{TIMELINE}}** timeline as a basis.

**Context:**
- **Incident:** {{INCIDENT}}
- **Impact:** {{IMPACT}}
- **Timeline:** {{TIMELINE}}

**REQUIRED SECTIONS:**
1. **Summary**: what happened, impact, and duration.
2. Detailed **Timeline**: detection → response → resolution.
3. **Root Cause Analysis**: analysis using the 5 Whys.
4. **What went well**.
5. **What went wrong**.
6. **Where we got lucky**.
7. **Action items**: with owner and deadline.
8. **Lessons learned** and recommendations.

**OUTPUT FORMAT:**
- Markdown with tables, blameless tone, and continuous improvement focus.

LANGUAGE: {{LANG_OUTPUT}}`
        },
        tags: ['postmortem', 'incident', 'blameless', 'root-cause', 'sre']
    },
    {
        id: 'landing_page_copy',
        category: 'writing',
        icon: '🎯',
        title: { es: 'Landing Page Copy', en: 'Landing Page Copy' },
        description: { es: 'Copy de landing page con hook, beneficios, social proof y CTA.', en: 'Landing page copy with hook, benefits, social proof, and CTA.' },
        prompt: {
            es: `Actúa como un **Conversion Copywriter** con experiencia en landing pages de alto rendimiento.

Redacta el **Copy de Landing Page** para **{{PRODUCT}}**, dirigido a **{{AUDIENCE}}**, con el objetivo de conversión **{{CTA_GOAL}}**.

**Contexto:**
- **Producto:** {{PRODUCT}}
- **Audiencia:** {{AUDIENCE}}
- **Objetivo del CTA:** {{CTA_GOAL}}

**SECCIONES:**
1. **Hero**: headline + subheadline + CTA principal.
2. **Problem agitation**: dolor del usuario agudizado.
3. **Solution**: presentación clara de {{PRODUCT}}.
4. **Key benefits** (3-5).
5. **Social proof**: testimonios, logos o métricas.
6. **How it works** en 3 pasos.
7. **FAQ** con objeciones comunes.
8. **Final CTA** orientado a {{CTA_GOAL}}.

**FORMATO DE SALIDA:**
- Copy completo en Markdown con notas de diseño por sección.
- Copy persuasivo, scannable y orientado a conversión.

IDIOMA: {{LANG_OUTPUT}}`,
            en: `Act as a **Conversion Copywriter** experienced in high-performance landing pages.

Draft the **Landing Page Copy** for **{{PRODUCT}}**, aimed at **{{AUDIENCE}}**, with the conversion goal of **{{CTA_GOAL}}**.

**Context:**
- **Product:** {{PRODUCT}}
- **Audience:** {{AUDIENCE}}
- **CTA goal:** {{CTA_GOAL}}

**SECTIONS:**
1. **Hero**: headline + subheadline + main CTA.
2. **Problem agitation**: escalate the user's pain.
3. **Solution**: clear presentation of {{PRODUCT}}.
4. **Key benefits** (3-5).
5. **Social proof**: testimonials, logos, or metrics.
6. **How it works** in 3 steps.
7. **FAQ** covering common objections.
8. **Final CTA** aimed at {{CTA_GOAL}}.

**OUTPUT FORMAT:**
- Complete copy in Markdown with design notes per section.
- Persuasive, scannable, conversion-oriented copy.

LANGUAGE: {{LANG_OUTPUT}}`
        },
        tags: ['landing-page', 'copywriting', 'conversion', 'marketing', 'persuasion']
    },
    // ─── Business Extended ────────────────────────────────────────────────────

    {
        id: 'user_story_map',
        category: 'business',
        icon: '🗺️',
        title: { es: 'User Story Map', en: 'User Story Map' },
        description: { es: 'Mapeo visual de user stories con backbone, épicas y slicing.', en: 'Visual user story mapping with backbone, epics, and slicing.' },
        prompt: {
            es: `Actúa como un **Senior Product Manager** especializado en discovery y planning ágil.

Crea un **User Story Map** para **{{PRODUCT}}**, pensado para los usuarios **{{USERS}}** y las releases **{{RELEASES}}**.

**Contexto:**
- **Producto:** {{PRODUCT}}
- **Usuarios/roles:** {{USERS}}
- **Enfoque de releases:** {{RELEASES}}

**REQUISITOS:**
1. Backbone con las actividades principales de {{USERS}}.
2. Tasks bajo cada actividad.
3. User stories en formato "Como [rol], quiero [acción] para [beneficio]".
4. Release slicing y priorización (Must/Should/Could).
5. Acceptance criteria por story.
6. Dependencias entre stories.
7. Estimación de esfuerzo (T-shirt sizes).

**FORMATO DE SALIDA:**
- Tabla Markdown jerárquica (backbone → tasks → stories).

IDIOMA: {{LANG_OUTPUT}}`,
            en: `Act as a **Senior Product Manager** specialized in discovery and agile planning.

Create a **User Story Map** for **{{PRODUCT}}**, designed for the users **{{USERS}}** and the releases **{{RELEASES}}**.

**Context:**
- **Product:** {{PRODUCT}}
- **Users/roles:** {{USERS}}
- **Release approach:** {{RELEASES}}

**REQUIREMENTS:**
1. Backbone with the main activities of {{USERS}}.
2. Tasks under each activity.
3. User stories in "As [role], I want [action] to [benefit]" format.
4. Release slicing and prioritization (Must/Should/Could).
5. Acceptance criteria per story.
6. Dependencies between stories.
7. Effort estimation (T-shirt sizes).

**OUTPUT FORMAT:**
- Hierarchical Markdown table (backbone → tasks → stories).

LANGUAGE: {{LANG_OUTPUT}}`
        },
        tags: ['user-stories', 'mapping', 'agile', 'product', 'backlog']
    },
    {
        id: 'okr_template',
        category: 'business',
        icon: '🎯',
        title: { es: 'OKR Template', en: 'OKR Template' },
        description: { es: 'Objetivos y Key Results con métricas y checkpoints.', en: 'Objectives and Key Results with metrics and checkpoints.' },
        prompt: {
            es: `Actúa como un **OKR Coach** con método y pragmatismo.

Crea un **OKR Template** para el equipo **{{TEAM}}** para el quarter **{{QUARTER}}**, a partir de los objetivos **{{OBJECTIVES}}**.

**Contexto:**
- **Equipo:** {{TEAM}}
- **Quarter:** {{QUARTER}}
- **Objetivos planteados:** {{OBJECTIVES}}

**REQUISITOS:**
1. 3-5 Objectives inspiradores y cualitativos.
2. 2-5 Key Results medibles por objetivo.
3. Baseline y target por cada Key Result.
4. Initiatives concretas por Key Result.
5. Owner asignado por Key Result.
6. Calendario de checkpoints y confidence scoring (1-10).
7. Template de retrospective.

**FORMATO DE SALIDA:**
- Tabla Markdown con columnas de progress tracking.
- Notas de método para mantener el foco en {{OBJECTIVES}}.

IDIOMA: {{LANG_OUTPUT}}`,
            en: `Act as an **OKR Coach** with method and pragmatism.

Create an **OKR Template** for the **{{TEAM}}** team for the **{{QUARTER}}** quarter, based on the objectives **{{OBJECTIVES}}**.

**Context:**
- **Team:** {{TEAM}}
- **Quarter:** {{QUARTER}}
- **Proposed objectives:** {{OBJECTIVES}}

**REQUIREMENTS:**
1. 3-5 inspirational, qualitative objectives.
2. 2-5 measurable key results per objective.
3. Baseline and target per key result.
4. Concrete initiatives per key result.
5. Owner assigned per key result.
6. Checkpoint schedule and confidence scoring (1-10).
7. Retrospective template.

**OUTPUT FORMAT:**
- Markdown table with progress tracking columns.
- Method notes to stay focused on {{OBJECTIVES}}.

LANGUAGE: {{LANG_OUTPUT}}`
        },
        tags: ['okr', 'goals', 'metrics', 'quarterly', 'tracking']
    },
    {
        id: 'gtm_plan',
        category: 'business',
        icon: '🚀',
        title: { es: 'Go-to-Market Plan', en: 'Go-to-Market Plan' },
        description: { es: 'Plan de lanzamiento con canales, messaging y timeline.', en: 'Launch plan with channels, messaging, and timeline.' },
        prompt: {
            es: `Actúa como un **GTM Strategist** con experiencia en lanzamientos de producto.

Crea un **Go-to-Market Plan** completo para **{{PRODUCT}}** en el mercado **{{MARKET}}**, con fecha de lanzamiento objetivo **{{LAUNCH_DATE}}**.

**Contexto:**
- **Producto:** {{PRODUCT}}
- **Mercado:** {{MARKET}}
- **Fecha de lanzamiento:** {{LAUNCH_DATE}}

**REQUISITOS:**
1. Análisis del mercado y buyer personas.
2. Value proposition y messaging por segmento.
3. Pricing strategy.
4. Estrategia de canales (paid, organic, partnerships).
5. Timeline de lanzamiento: pre-launch, launch y post-launch para {{LAUNCH_DATE}}.
6. Sales enablement materials.
7. Plan de campañas de marketing.
8. Métricas de éxito y KPIs.
9. Budget allocation y risk mitigation.

**FORMATO DE SALIDA:**
- Plan estratégico en Markdown con timeline y owner por iniciativa.

IDIOMA: {{LANG_OUTPUT}}`,
            en: `Act as a **GTM Strategist** experienced in product launches.

Create a complete **Go-to-Market Plan** for **{{PRODUCT}}** in the **{{MARKET}}** market, with a target launch date of **{{LAUNCH_DATE}}**.

**Context:**
- **Product:** {{PRODUCT}}
- **Market:** {{MARKET}}
- **Launch date:** {{LAUNCH_DATE}}

**REQUIREMENTS:**
1. Market analysis and buyer personas.
2. Value proposition and messaging per segment.
3. Pricing strategy.
4. Channel strategy (paid, organic, partnerships).
5. Launch timeline: pre-launch, launch, and post-launch for {{LAUNCH_DATE}}.
6. Sales enablement materials.
7. Marketing campaigns plan.
8. Success metrics and KPIs.
9. Budget allocation and risk mitigation.

**OUTPUT FORMAT:**
- Strategic plan in Markdown with timeline and owner per initiative.

LANGUAGE: {{LANG_OUTPUT}}`
        },
        tags: ['gtm', 'launch', 'marketing', 'strategy', 'sales']
    },
    // ─── Social Media ─────────────────────────────────────────────────────────

    {
        id: 'twitter_thread',
        category: 'social',
        icon: '🧵',
        title: { es: 'Hilo Viral en X/Twitter', en: 'Viral X/Twitter Thread' },
        description: { es: 'Thread de 8-12 tweets con hook, desarrollo y CTA.', en: '8-12 tweet thread with hook, development, and CTA.' },
        prompt: {
            es: `Actúa como un **Twitter Growth Strategist** con enfoque en contenido de alto engagement.

Crea un **Hilo Viral en X/Twitter** sobre **{{TOPIC}}** para **{{AUDIENCE}}**, con un hook de tipo **{{HOOK_TYPE}}** y cierre con **{{CTA_MESSAGE}}**.

**Contexto:**
- **Tema:** {{TOPIC}}
- **Audiencia:** {{AUDIENCE}}
- **Tipo de hook:** {{HOOK_TYPE}}
- **CTA de cierre:** {{CTA_MESSAGE}}

**ESTRUCTURA:**
1. Tweet 1: hook potente (curiosity gap, contrarian o story).
2. Tweets 2-7: desarrollo con valor, datos y ejemplos.
3. Tweets 8-10: insights y takeaways.
4. Tweet final: CTA ({{CTA_MESSAGE}}) + request de engagement.

**REGLAS:**
- Máx. 280 caracteres por tweet.
- Líneas cortas y scannable.
- Numeración (1/10, 2/10...) y espacios entre párrafos.

**FORMATO DE SALIDA:**
- Thread completo numerado con notas de estrategia por tweet.

IDIOMA: {{LANG_OUTPUT}}`,
            en: `Act as a **Twitter Growth Strategist** focused on high-engagement content.

Create a **Viral X/Twitter Thread** about **{{TOPIC}}** for **{{AUDIENCE}}**, with a **{{HOOK_TYPE}}** hook and a closing **{{CTA_MESSAGE}}**.

**Context:**
- **Topic:** {{TOPIC}}
- **Audience:** {{AUDIENCE}}
- **Hook type:** {{HOOK_TYPE}}
- **Closing CTA:** {{CTA_MESSAGE}}

**STRUCTURE:**
1. Tweet 1: strong hook (curiosity gap, contrarian, or story).
2. Tweets 2-7: development with value, data, and examples.
3. Tweets 8-10: insights and takeaways.
4. Final tweet: CTA ({{CTA_MESSAGE}}) + engagement request.

**RULES:**
- Max. 280 characters per tweet.
- Short, scannable lines.
- Numbering (1/10, 2/10...) and paragraph spacing.

**OUTPUT FORMAT:**
- Complete numbered thread with strategy notes per tweet.

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
            es: `Actúa como un **Instagram Content Strategist** con dominio visual y de copy.

Diseña un **Carrusel de Instagram** de 8-10 slides sobre **{{TOPIC}}**, con objetivo **{{GOAL}}**, estilo visual **{{VISUAL_STYLE}}** y dirigido a **{{AUDIENCE}}**.

**Contexto:**
- **Tema:** {{TOPIC}}
- **Objetivo:** {{GOAL}}
- **Estilo visual:** {{VISUAL_STYLE}}
- **Audiencia:** {{AUDIENCE}}

**ESTRUCTURA:**
1. Slide 1: hook visual + título impactante.
2. Slide 2: contexto/problema.
3. Slides 3-7: una idea de valor por slide.
4. Slide 8: resumen y takeaways.
5. Slide 9: CTA (save, share, comment).
6. Slide 10: slide de marca.

**POR SLIDE, ENTREGA:**
- Copy del texto.
- Brief visual (colores, elementos, layout) coherente con {{VISUAL_STYLE}}.
- Tipografía sugerida.

**FORMATO DE SALIDA:**
- Desglose slide-by-slide con copy + brief visual.

IDIOMA: {{LANG_OUTPUT}}`,
            en: `Act as an **Instagram Content Strategist** with visual and copy expertise.

Design an 8-10 slide **Instagram Carousel** about **{{TOPIC}}**, with the goal of **{{GOAL}}**, the visual style **{{VISUAL_STYLE}}**, aimed at **{{AUDIENCE}}**.

**Context:**
- **Topic:** {{TOPIC}}
- **Goal:** {{GOAL}}
- **Visual style:** {{VISUAL_STYLE}}
- **Audience:** {{AUDIENCE}}

**STRUCTURE:**
1. Slide 1: visual hook + impactful title.
2. Slide 2: context/problem.
3. Slides 3-7: one value idea per slide.
4. Slide 8: summary and takeaways.
5. Slide 9: CTA (save, share, comment).
6. Slide 10: brand slide.

**PER SLIDE, DELIVER:**
- Text copy.
- Visual brief (colors, elements, layout) consistent with {{VISUAL_STYLE}}.
- Suggested typography.

**OUTPUT FORMAT:**
- Slide-by-slide breakdown with copy + visual brief.

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
            es: `Actúa como un **Short-Form Video Strategist** experto en TikTok y Reels.

Escribe el **Guion de TikTok/Reel** sobre **{{TOPIC}}**, de **{{DURATION}}** de duración y en estilo **{{STYLE}}**. El guion debe maximizar retención en los primeros 3 segundos.

**Contexto:**
- **Tema:** {{TOPIC}}
- **Duración:** {{DURATION}}
- **Estilo:** {{STYLE}}

**ESTRUCTURA POR TIMESTAMPS:**
1. **Hook (0-3s)**: visual + verbal que detenga el scroll.
2. **Setup (3-8s)**: contexto rápido y promesa.
3. **Value (8s-...)**: contenido principal con cortes dinámicos.
4. **CTA (últimos 5s)**: acción natural.

**INCLUYE:**
- Script palabra por palabra.
- Indicaciones visuales por segmento.
- Timing de cortes.
- Sugerencia de audio/trend según {{STYLE}}.
- Texto en pantalla (captions).
- Hashtags recomendados.

**FORMATO DE SALIDA:**
- Guion con timestamps y notas de producción.

IDIOMA: {{LANG_OUTPUT}}`,
            en: `Act as a **Short-Form Video Strategist** expert in TikTok and Reels.

Write the **TikTok/Reel Script** about **{{TOPIC}}**, **{{DURATION}}** long, in a **{{STYLE}}** style. The script must maximize retention in the first 3 seconds.

**Context:**
- **Topic:** {{TOPIC}}
- **Duration:** {{DURATION}}
- **Style:** {{STYLE}}

**STRUCTURE WITH TIMESTAMPS:**
1. **Hook (0-3s)**: visual + verbal that stops the scroll.
2. **Setup (3-8s)**: quick context and promise.
3. **Value (8s-...)**: main content with dynamic cuts.
4. **CTA (last 5s)**: natural call to action.

**INCLUDE:**
- Word-for-word script.
- Visual directions per segment.
- Cut timing.
- Audio/trend suggestion per {{STYLE}}.
- On-screen text (captions).
- Recommended hashtags.

**OUTPUT FORMAT:**
- Script with timestamps and production notes.

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
