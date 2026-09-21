import { useState, useCallback, useEffect, useRef } from 'react';
import { cn } from '../../lib/utils';
import { sanitizeAIOutput, safeLog } from '../../lib/utils';
import { collectOrphanVars } from './orphanUtils';
import { SuiteDev } from './SuiteDev';
import { SuiteStudio } from './SuiteStudio';
import { SuiteSocial } from './SuiteSocial';
import { SuiteGenesis } from './SuiteGenesis';
import { SuiteAudit } from './SuiteAudit';
import { SuiteTemplates } from './SuiteTemplates';
import { LLMStatusIndicator } from '../../components/ui/LLMStatusIndicator';
import { usePromptGenerator } from '../../hooks/usePromptGenerator';
import { useAIInference } from '../../hooks/useAIInference';
import { useApp } from '../../contexts/AppContext';
import { t } from '../../lib/i18n';
import { Copy, Check, FileText, Settings2, Columns } from 'lucide-react';
import { NAV_ITEMS, MODULE_COLORS } from './navConfig';
import { SuiteOutputPanel } from './SuiteOutputPanel';

export type SuiteTab = 'genesis' | 'dev' | 'studio' | 'social' | 'audit' | 'templates';

interface PromptSuiteProps {
    activeTab: SuiteTab;
    lang: string;
    onTabChange: (tab: any) => void;
}

type ViewMode = 'form' | 'prompt' | 'split';

const PROMPT_ARCHITECT_SYSTEM = (lang: string) => `You are an Advanced Prompt Architect. Reescribe el draft del usuario en un prompt profesional, preciso y altamente efectivo para otro LLM.
- Devuelve SOLO el prompt mejorado, sin relleno (no digas "Aquí tienes tu prompt", ni "He optimizado tu prompt").
- Aplica Chain of Thought (pide razonar paso a paso).
- Define rol claro, restricciones y estructura Markdown.
- ${lang === 'es'
        ? 'Usa SIEMPRE los valores concretos proporcionados por el usuario. PROHIBIDO inventar placeholders con doble llave ({{...}}). Si falta un dato, márcalo con [FALTA: ...] en el idioma de salida.'
        : 'Always use the concrete values provided by the user. FORBIDDEN to invent placeholders with double braces ({{...}}). If a value is missing, mark it with [MISSING: ...] in the output language.'}
- Idioma: ${lang === 'es' ? 'español' : 'inglés'}.

IMPORTANTE: Tu SALIDA debe ser el prompt mejorado (instrucciones para otra IA), NUNCA ejecutes la tarea del usuario.
Si el input es una tarea concreta (p.ej. "escribe un README"), NO escribas el README: escribe un PROMPT detallado que le diga a otra IA cómo escribir ese README perfectamente.`;

const GENERATE_BTN_WIDTH = 'min-w-[280px] w-auto';
const GENERATE_BTN_HEIGHT = 'h-11';

export function PromptSuite(props: PromptSuiteProps) {
    const {
        activeTab,
        lang,
        onTabChange
    } = props;

    const {
        prompt: staticPrompt,
        isGenerating: isGeneratingPrompt,
        error: promptError,
        generate,
        reset: resetPrompt
    } = usePromptGenerator();

    const { settings, providers } = useApp();

    const {
        result: aiResult,
        isThinking,
        elapsedMs,
        error: aiError,
        runInference,
        resetInference
    } = useAIInference();

    const [copied, setCopied] = useState(false);
    const [viewMode, setViewMode] = useState<ViewMode>('form');
    const [orphanVars, setOrphanVars] = useState<string[]>([]);
    const generateFnRef = useRef<(() => void) | null>(null);

    const stripMarkdownFences = (text: string): string => {
        return sanitizeAIOutput(text
            .replace(/^```(?:markdown|md)?\s*\n/, '')
            .replace(/\n```\s*$/, ''));
    };

    const displayResult = aiResult ? stripMarkdownFences(aiResult) : '';
    const activeError = aiError || promptError;
    const isLoading = isGeneratingPrompt || isThinking;

    const currentProvider = providers.find(p => p.id === settings.aiProvider);
    const providerName = currentProvider?.name || settings.aiProvider;
    const estimatedTokens = displayResult ? Math.ceil(displayResult.length / 4) : 0;

    useEffect(() => {
        resetPrompt();
        setViewMode('form');
        setOrphanVars([]);
    }, [activeTab]);

    const handleTriggerGenerate = useCallback(() => {
        if (generateFnRef.current) {
            generateFnRef.current();
        }
    }, []);

    const detectOrphans = (p: string, aiText?: string | null): void => {
        setOrphanVars(collectOrphanVars(p, aiText));
    };

    const handleCopy = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(displayResult);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            safeLog('error', 'Copy failed');
        }
    }, [displayResult]);

    const handleRunAI = useCallback(async () => {
        if (!staticPrompt) return;
        const response = await runInference(staticPrompt, false, PROMPT_ARCHITECT_SYSTEM(lang));
        detectOrphans(staticPrompt, response);
    }, [staticPrompt, lang, runInference]);

    const handleGenerateStatic = async (p: string) => {
        resetInference();
        generate(p);
        detectOrphans(p);
        const response = await runInference(p, false, PROMPT_ARCHITECT_SYSTEM(lang));
        detectOrphans(p, response);
        setViewMode('split');
    };

    const suiteLang = lang as 'es' | 'en';
    const hasPrompt = staticPrompt.length > 0;

    const currentNavItem = NAV_ITEMS.find(item => item.id === activeTab) || NAV_ITEMS[0];
    const CurrentTabIcon = currentNavItem.icon;
    const currentColor = MODULE_COLORS[currentNavItem.hue] || MODULE_COLORS.amber;

    const renderFormContent = () => {
        const registerGenerate = (fn: () => void) => {
            generateFnRef.current = fn;
        };

        switch (activeTab) {
            case 'genesis': return <SuiteGenesis onGenerate={handleGenerateStatic} lang={suiteLang} onRegisterGenerate={registerGenerate} />;
            case 'dev': return <SuiteDev onGenerate={handleGenerateStatic} lang={suiteLang} onRegisterGenerate={registerGenerate} />;
            case 'audit': return <SuiteAudit onGenerate={handleGenerateStatic} lang={suiteLang} onRegisterGenerate={registerGenerate} />;
            case 'studio': return <SuiteStudio onGenerate={handleGenerateStatic} lang={suiteLang} onRegisterGenerate={registerGenerate} />;
            case 'social': return <SuiteSocial onGenerate={handleGenerateStatic} lang={suiteLang} onRegisterGenerate={registerGenerate} />;
            case 'templates': return <SuiteTemplates onGenerate={handleGenerateStatic} lang={suiteLang} onRegisterGenerate={registerGenerate} />;
            default: return null;
        }
    };

    return (
        <div className="flex flex-col h-full gap-4">
            <div className="flex items-center gap-3 shrink-0 h-10">
                <button
                    onClick={handleTriggerGenerate}
                    className={cn(
                        GENERATE_BTN_WIDTH,
                        GENERATE_BTN_HEIGHT,
                        "flex items-center justify-center gap-2.5 px-5 rounded-lg font-bold text-sm transition-all shadow-lg shrink-0",
                        currentColor.bg,
                        "text-gray-900 hover:opacity-90 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    )}
                >
                    {CurrentTabIcon && <CurrentTabIcon size={16} />}
                    <span className="whitespace-nowrap">{t(`${activeTab}.btn` as any, suiteLang) || 'Generate'}</span>
                </button>

                <div className="flex items-center bg-secondary/50 border border-border rounded-lg p-0.5 gap-0.5 h-8">
                    <button
                        onClick={() => setViewMode('form')}
                        className={cn(
                            "flex items-center gap-1 px-2.5 rounded-md text-xs font-medium transition-all h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60",
                            viewMode === 'form' ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <Settings2 size={12} />
                        <span className="hidden sm:inline">Form</span>
                    </button>
                    <button
                        onClick={() => setViewMode('prompt')}
                        className={cn(
                            "flex items-center gap-1 px-2.5 rounded-md text-xs font-medium transition-all h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60",
                            viewMode === 'prompt' ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <FileText size={12} />
                        <span className="hidden sm:inline">Prompt</span>
                    </button>
                    <button
                        onClick={() => setViewMode('split')}
                        className={cn(
                            "hidden xl:flex items-center gap-1 px-2.5 rounded-md text-xs font-medium transition-all h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60",
                            viewMode === 'split' ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <Columns size={12} />
                        <span className="hidden sm:inline">Split</span>
                    </button>
                </div>

                {hasPrompt && displayResult && (
                    <button
                        onClick={handleCopy}
                        className={cn(
                            "flex items-center gap-2 px-3 h-8 rounded-lg text-xs font-bold transition-all border shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60",
                            copied ? "bg-green-600/20 border-green-600/30 text-green-400" : "bg-secondary/50 border-border text-muted-foreground hover:text-foreground hover:bg-secondary"
                        )}
                    >
                        {copied ? <Check size={14} /> : <Copy size={14} />}
                        <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy'}</span>
                    </button>
                )}

                <div className="flex-1" />
            </div>

            <LLMStatusIndicator
                isThinking={isThinking}
                elapsedMs={elapsedMs}
                provider={providerName}
                model={settings.model}
                estimatedTokens={estimatedTokens}
            />

            <div className="flex-1 min-h-0">
                {viewMode === 'form' && (
                    <div className="h-full overflow-y-auto pr-2 pb-4">
                        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
                            {renderFormContent()}
                        </div>
                    </div>
                )}

                {viewMode === 'prompt' && (
                    <div className="h-full">
                        <SuiteOutputPanel
                            staticPrompt={staticPrompt}
                            displayResult={displayResult}
                            activeError={activeError}
                            isThinking={isThinking}
                            isLoading={isLoading}
                            onRegenerate={handleRunAI}
                            lang={suiteLang}
                            orphanVars={orphanVars}
                        />
                    </div>
                )}

                {viewMode === 'split' && (
                    <div className="h-full grid grid-cols-1 xl:grid-cols-2 gap-4">
                        <div className="overflow-y-auto pr-2 pb-4">
                            <div className="bg-card border border-border rounded-xl p-5 shadow-sm h-full">
                                {renderFormContent()}
                            </div>
                        </div>

                        <div className="flex flex-col gap-4 min-h-0 overflow-hidden">
                            <SuiteOutputPanel
                                staticPrompt={staticPrompt}
                                displayResult={displayResult}
                                activeError={activeError}
                                isThinking={isThinking}
                                isLoading={isLoading}
                                onRegenerate={handleRunAI}
                                lang={suiteLang}
                                orphanVars={orphanVars}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}