import { useState, useCallback, useEffect, useRef } from 'react';
import { cn } from '../../lib/utils';
import { stripMarkdownFences, safeLog } from '../../lib/utils';
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
import { Copy, Check, FileText, Settings2, Columns, Sparkles, AlertCircle, Zap, History } from 'lucide-react';
import { useHistory } from '../../hooks/useHistory';
import { getSessionValue, setSessionValue } from '../../hooks/useSessionState';
import { HistoryEntry, PromptVersion, currentText, deriveTitle } from '../../lib/history';
import { HistoryPanel } from './HistoryPanel';
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

const REFINE_SYSTEM = (lang: string) => `You are a Prompt Editor. You receive an existing PROMPT and an INSTRUCTION describing a change.
- Apply the instruction to the prompt and return ONLY the full revised prompt, with no preface or commentary.
- Keep everything the instruction does not touch (role, constraints, concrete values, structure).
- Never invent {{placeholders}}; keep the concrete values already present. If something is missing, mark it with ${lang === 'es' ? '[FALTA: ...]' : '[MISSING: ...]'}.
- Keep the prompt's current language unless the instruction asks to translate it.
- NEVER execute the task the prompt describes: your output is still a prompt for another AI.`;

const SNAPSHOT_KEYS: Record<string, string[]> = {
    genesis: ['suite.genesis'],
    dev: ['suite.dev'],
    audit: ['suite.audit'],
    studio: ['suite.studio'],
    social: ['suite.social'],
    templates: ['templates.selectedId', 'templates.vars'],
};

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
        isThinking,
        elapsedMs,
        error: aiError,
        runInference,
        resetInference
    } = useAIInference();

    const [copied, setCopied] = useState(false);
    const [viewMode, setViewMode] = useState<ViewMode>('form');
    const [orphanVars, setOrphanVars] = useState<string[]>([]);
    const [notice, setNotice] = useState<string | null>(null);
    const [aiOptimize, setAiOptimize] = useState<boolean>(() => {
        try { return localStorage.getItem('nexus.aiOptimize') !== '0'; } catch { return true; }
    });
    const generateFnRef = useRef<(() => void) | null>(null);

    // Versiones de IA (v1 = optimización, siguientes = refinados/ediciones) y vínculo con el historial.
    const [versions, setVersions] = useState<PromptVersion[]>([]);
    const [versionIdx, setVersionIdx] = useState(-1);
    const [entryId, setEntryId] = useState<string | null>(null);
    const [formVersion, setFormVersion] = useState(0);
    const [historyOpen, setHistoryOpen] = useState(false);
    const versionsRef = useRef<PromptVersion[]>([]);
    const metaRef = useRef<{ title: string; createdAt: number; snapshot: Record<string, unknown> }>({ title: '', createdAt: 0, snapshot: {} });
    const restoreRef = useRef<HistoryEntry | null>(null);
    const history = useHistory();
    const entriesRef = useRef<HistoryEntry[]>([]);
    entriesRef.current = history.entries;

    const updateVersions = (next: PromptVersion[], idx: number) => {
        versionsRef.current = next;
        setVersions(next);
        setVersionIdx(idx);
    };
    const addVersion = (text: string) => {
        const next = [...versionsRef.current, { label: `v${versionsRef.current.length + 1}`, text }];
        updateVersions(next, next.length - 1);
    };

    const aiText = versions[versionIdx]?.text ?? '';
    // Si la IA no responde (o está desactivada) se muestra el prompt base.
    const displayResult = aiText || staticPrompt;
    const usingAI = versionIdx >= 0 && aiText.length > 0;
    const activeError = aiError || promptError;
    const isLoading = isGeneratingPrompt || isThinking;

    const currentProvider = providers.find(p => p.id === settings.aiProvider);
    const providerName = currentProvider?.name || settings.aiProvider;
    const estimatedTokens = displayResult ? Math.ceil(displayResult.length / 4) : 0;

    useEffect(() => {
        resetPrompt();
        resetInference();
        setViewMode('form');
        setOrphanVars([]);
        setNotice(null);
        updateVersions([], -1);
        setEntryId(null);
        if (restoreRef.current) {
            applyRestore(restoreRef.current);
            restoreRef.current = null;
        }
    }, [activeTab]);

    // Guarda/actualiza la entrada del historial (con debounce para no cifrar en cada tecla al editar).
    useEffect(() => {
        if (!entryId || !staticPrompt || isThinking) return;
        const id = setTimeout(() => {
            const prev = entriesRef.current.find(e => e.id === entryId);
            history.save({
                id: entryId,
                module: activeTab,
                title: metaRef.current.title,
                createdAt: metaRef.current.createdAt,
                updatedAt: Date.now(),
                favorite: prev?.favorite ?? false,
                basePrompt: staticPrompt,
                versions,
                activeVersion: versionIdx,
                snapshot: metaRef.current.snapshot,
                model: settings.model,
            });
        }, 600);
        return () => clearTimeout(id);
    }, [entryId, staticPrompt, versions, versionIdx, isThinking]);

    useEffect(() => {
        if (!notice) return;
        const id = setTimeout(() => setNotice(null), 4000);
        return () => clearTimeout(id);
    }, [notice]);

    const toggleAiOptimize = useCallback(() => {
        setAiOptimize(prev => {
            const next = !prev;
            try { localStorage.setItem('nexus.aiOptimize', next ? '1' : '0'); } catch { /* ignore */ }
            return next;
        });
    }, []);

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

    const runAI = async (base: string, userMsg: string, system: string) => {
        const response = await runInference(userMsg, false, system);
        if (!response) return;
        const clean = stripMarkdownFences(response);
        addVersion(clean);
        detectOrphans(base, clean);
    };

    const handleRunAI = useCallback(async () => {
        if (!staticPrompt) return;
        await runAI(staticPrompt, staticPrompt, PROMPT_ARCHITECT_SYSTEM(lang));
    }, [staticPrompt, lang, runInference]);

    const handleRefine = async (instruction: string) => {
        const base = currentText({ basePrompt: staticPrompt, versions, activeVersion: versionIdx });
        const userMsg = `PROMPT:\n${base}\n\nINSTRUCTION:\n${instruction}`;
        await runAI(staticPrompt, userMsg, REFINE_SYSTEM(lang));
    };

    const handleEdit = (text: string) => {
        if (versionIdx < 0) {
            addVersion(text);
        } else {
            updateVersions(versionsRef.current.map((v, i) => (i === versionIdx ? { ...v, text } : v)), versionIdx);
        }
        detectOrphans(staticPrompt, text);
    };

    const captureSnapshot = (): Record<string, unknown> => {
        const snap: Record<string, unknown> = {};
        for (const key of SNAPSHOT_KEYS[activeTab] ?? []) {
            const v = getSessionValue<unknown>(key);
            if (v !== undefined) snap[key] = v;
        }
        return snap;
    };

    const handleGenerateStatic = async (p: string) => {
        setNotice(null);
        resetInference();
        updateVersions([], -1);
        generate(p);
        detectOrphans(p);
        setViewMode('split');
        const snapshot = captureSnapshot();
        const id = `h_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
        metaRef.current = { title: deriveTitle(snapshot, p, t(`nav.${activeTab}`, suiteLang)), createdAt: Date.now(), snapshot };
        setEntryId(id);
        if (!aiOptimize) return;
        await runAI(p, p, PROMPT_ARCHITECT_SYSTEM(lang));
    };

    // Restaura una entrada del historial: formulario + prompt + versiones.
    const applyRestore = (e: HistoryEntry) => {
        resetInference();
        generate(e.basePrompt);
        updateVersions(e.versions, e.activeVersion);
        metaRef.current = { title: e.title, createdAt: e.createdAt, snapshot: e.snapshot };
        setEntryId(e.id);
        setOrphanVars(collectOrphanVars(e.basePrompt, e.versions[e.activeVersion]?.text));
        setViewMode('split');
    };

    const handleReopen = (e: HistoryEntry) => {
        Object.entries(e.snapshot).forEach(([k, v]) => setSessionValue(k, v));
        setFormVersion(v => v + 1);
        if (e.module === activeTab) {
            applyRestore(e);
        } else {
            restoreRef.current = e;
            onTabChange(e.module);
        }
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
        const onInvalid = (msg: string) => setNotice(msg);

        switch (activeTab) {
            case 'genesis': return <SuiteGenesis key={formVersion} onGenerate={handleGenerateStatic} lang={suiteLang} onRegisterGenerate={registerGenerate} onInvalid={onInvalid} />;
            case 'dev': return <SuiteDev key={formVersion} onGenerate={handleGenerateStatic} lang={suiteLang} onRegisterGenerate={registerGenerate} onInvalid={onInvalid} />;
            case 'audit': return <SuiteAudit key={formVersion} onGenerate={handleGenerateStatic} lang={suiteLang} onRegisterGenerate={registerGenerate} onInvalid={onInvalid} />;
            case 'studio': return <SuiteStudio key={formVersion} onGenerate={handleGenerateStatic} lang={suiteLang} onRegisterGenerate={registerGenerate} onInvalid={onInvalid} />;
            case 'social': return <SuiteSocial key={formVersion} onGenerate={handleGenerateStatic} lang={suiteLang} onRegisterGenerate={registerGenerate} onInvalid={onInvalid} />;
            case 'templates': return <SuiteTemplates key={formVersion} onGenerate={handleGenerateStatic} lang={suiteLang} onRegisterGenerate={registerGenerate} onInvalid={onInvalid} />;
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
                        <span className="hidden sm:inline">{t('suite.view.form', suiteLang)}</span>
                    </button>
                    <button
                        onClick={() => setViewMode('prompt')}
                        className={cn(
                            "flex items-center gap-1 px-2.5 rounded-md text-xs font-medium transition-all h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60",
                            viewMode === 'prompt' ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <FileText size={12} />
                        <span className="hidden sm:inline">{t('suite.view.prompt', suiteLang)}</span>
                    </button>
                    <button
                        onClick={() => setViewMode('split')}
                        className={cn(
                            "hidden xl:flex items-center gap-1 px-2.5 rounded-md text-xs font-medium transition-all h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60",
                            viewMode === 'split' ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <Columns size={12} />
                        <span className="hidden sm:inline">{t('suite.view.split', suiteLang)}</span>
                    </button>
                </div>

                {hasPrompt && displayResult && !isLoading && (
                    <button
                        onClick={handleCopy}
                        className={cn(
                            "flex items-center gap-2 px-3 h-8 rounded-lg text-xs font-bold transition-all border shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60",
                            copied ? "bg-green-600/20 border-green-600/30 text-green-400" : "bg-secondary/50 border-border text-muted-foreground hover:text-foreground hover:bg-secondary"
                        )}
                    >
                        {copied ? <Check size={14} /> : <Copy size={14} />}
                        <span className="hidden sm:inline">{copied ? t('suite.copied', suiteLang) : t('suite.copy', suiteLang)}</span>
                    </button>
                )}

                <div className="flex-1" />

                <button
                    type="button"
                    onClick={() => setHistoryOpen(true)}
                    className="flex items-center gap-2 px-3 h-8 rounded-lg text-xs font-bold border border-border bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary shrink-0 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
                >
                    <History size={14} />
                    <span className="hidden sm:inline">{t('history.title', suiteLang)}</span>
                    {history.entries.length > 0 && (
                        <span className="px-1.5 rounded-full bg-primary/20 text-primary text-[10px]">{history.entries.length}</span>
                    )}
                </button>

                <span className="hidden 2xl:inline text-xs text-muted-foreground max-w-[220px] leading-tight">
                    {aiOptimize ? t('mode.ai.desc', suiteLang).replace('{{model}}', settings.model) : t('mode.noai.desc', suiteLang)}
                </span>

                <div role="radiogroup" aria-label={t('mode.label', suiteLang)} className="flex items-center rounded-lg border-2 border-border bg-background p-0.5 gap-0.5 h-9 shrink-0">
                    <button
                        type="button"
                        role="radio"
                        aria-checked={aiOptimize}
                        onClick={() => !aiOptimize && toggleAiOptimize()}
                        title={t('mode.ai.desc', suiteLang).replace('{{model}}', settings.model)}
                        className={cn(
                            "flex items-center gap-1.5 px-3 h-full rounded-md text-xs font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60",
                            aiOptimize ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                        )}
                    >
                        <Sparkles size={13} />
                        {t('mode.ai', suiteLang)}
                    </button>
                    <button
                        type="button"
                        role="radio"
                        aria-checked={!aiOptimize}
                        onClick={() => aiOptimize && toggleAiOptimize()}
                        title={t('mode.noai.desc', suiteLang)}
                        className={cn(
                            "flex items-center gap-1.5 px-3 h-full rounded-md text-xs font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60",
                            !aiOptimize ? "bg-emerald-600 text-white shadow" : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                        )}
                    >
                        <Zap size={13} />
                        {t('mode.noai', suiteLang)}
                    </button>
                </div>
            </div>

            {notice && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-amber-400/40 bg-amber-500/10 text-amber-200 text-sm shrink-0" role="alert">
                    <AlertCircle size={14} className="shrink-0" />
                    {notice}
                </div>
            )}

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
                            usingAI={usingAI}
                            aiRequested={aiOptimize}
                            activeError={activeError}
                            isThinking={isThinking}
                            isLoading={isLoading}
                            onRegenerate={handleRunAI}
                            lang={suiteLang}
                            orphanVars={orphanVars}
                            versionLabels={versions.map(v => v.label)}
                            versionIdx={versionIdx}
                            onSelectVersion={setVersionIdx}
                            onRefine={handleRefine}
                            onEdit={handleEdit}
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
                                usingAI={usingAI}
                                aiRequested={aiOptimize}
                                activeError={activeError}
                                isThinking={isThinking}
                                isLoading={isLoading}
                                onRegenerate={handleRunAI}
                                lang={suiteLang}
                                orphanVars={orphanVars}
                                versionLabels={versions.map(v => v.label)}
                                versionIdx={versionIdx}
                                onSelectVersion={setVersionIdx}
                                onRefine={handleRefine}
                                onEdit={handleEdit}
                            />
                        </div>
                    </div>
                )}
            </div>
            <HistoryPanel
                open={historyOpen}
                lang={suiteLang}
                entries={history.entries}
                onClose={() => setHistoryOpen(false)}
                onReopen={handleReopen}
                onToggleFavorite={history.toggleFavorite}
                onRemove={history.remove}
                onClearAll={history.clearNonFavorites}
                onImport={history.importEntries}
            />
        </div>
    );
}