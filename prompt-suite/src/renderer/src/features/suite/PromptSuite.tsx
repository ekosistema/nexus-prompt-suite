import { useState, useCallback, useEffect, useRef } from 'react';
import { cn } from '../../lib/utils';
import { sanitizeAIOutput, safeLog } from '../../lib/utils';
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
import { Message } from '../../services/ai';
import { t } from '../../lib/i18n';
import { Sparkles, Terminal, Copy, Check, FileText, Settings2, PanelLeft, PanelRight, Columns } from 'lucide-react';
import { ChatView } from './ChatView';
import { SuiteOutputPanel } from './SuiteOutputPanel';

export type SuiteTab = 'genesis' | 'dev' | 'studio' | 'social' | 'audit' | 'templates' | 'chat';

interface PromptSuiteProps {
    activeTab: SuiteTab;
    lang: string;
    onTabChange: (tab: any) => void;
    pendingPrompt: string | null;
    onClearPending: () => void;
    onExecuteInChat: (prompt: string) => void;
}

const PROMPT_ARCHITECT_SYSTEM = (lang: string) => `You are an Advanced Prompt Architect.
Your SOLE PURPOSE is to rewrite and optimize the user's DRAFT prompt into a professional, precise, and highly effective instructions for an LLM.
Best practices to apply:
- Chain of Thought (ask the model to think step by step).
- Clear role definitions and constraints.
- Markdown structure for readability.
- Variable placeholders if appropriate.

IMPORTANT CONSTRAINTS FOR THE GENERATED PROMPT:
1. OUTPUT LANGUAGE: You MUST provide the improved prompt in ${lang === 'es' ? 'SPANISH' : 'ENGLISH'}.
2. NO FILLER IN GENERATED PROMPT: Ensure the instructions you write STRICTLY FORBID the target LLM from using introductory or concluding conversational filler (e.g., "Sure!", "Let me help you with that", "I will assume the role of..."). The target LLM should provide ONLY the raw result.

IMPORTANT: Your own output MUST BE ONLY the improved prompt itself. Do not include conversational filler like "Here is your improved prompt" or "I have optimized it".
If the input is a specific task (like 'Write a README'), do NOT write the README. Instead, write a HIGHLY DETAILED PROMPT that would tell another AI how to write that README perfectly.`;

type ViewMode = 'form' | 'prompt' | 'split';

const GENERATE_BTN_WIDTH = 'min-w-[280px] w-auto';
const GENERATE_BTN_HEIGHT = 'h-11';

export function PromptSuite(props: PromptSuiteProps) {
    const {
        activeTab,
        lang,
        onTabChange,
        pendingPrompt,
        onClearPending,
        onExecuteInChat
    } = props;

    const { settings, providers } = useApp();

    const {
        prompt: staticPrompt,
        isGenerating: isGeneratingPrompt,
        error: promptError,
        generate,
        reset: resetPrompt
    } = usePromptGenerator();

    const {
        result: aiResult,
        messages: aiMessages,
        isThinking,
        elapsedMs,
        error: aiError,
        runInference,
        setMessages,
        resetInference
    } = useAIInference();

    const [copied, setCopied] = useState(false);
    const [autoExecute, setAutoExecute] = useState(true);
    const [refinementText, setRefinementText] = useState('');
    const [viewMode, setViewMode] = useState<ViewMode>('form');
    const generateFnRef = useRef<(() => void) | null>(null);

    useEffect(() => {
        if (activeTab === 'chat' && pendingPrompt) {
            runInference(pendingPrompt, false);
            onClearPending();
        }
    }, [activeTab, pendingPrompt, runInference, onClearPending]);

    useEffect(() => {
        if (!pendingPrompt) {
            resetInference();
            resetPrompt();
            setRefinementText('');
        }
        setViewMode('form');
    }, [activeTab]);

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

    const handleTriggerGenerate = useCallback(() => {
        if (generateFnRef.current) {
            generateFnRef.current();
        }
    }, []);

    const handleCopy = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(displayResult);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            safeLog('error', 'Copy failed');
        }
    }, [displayResult]);

    const handleRunAI = async () => {
        if (!staticPrompt) return;
        const systemPrompt = activeTab !== 'chat' ? PROMPT_ARCHITECT_SYSTEM(lang) : undefined;
        await runInference(staticPrompt, false, systemPrompt);
    };

    const handleGenerateStatic = async (p: string) => {
        resetInference();
        generate(p);
        if (autoExecute) {
            const systemPrompt = activeTab !== 'chat' ? PROMPT_ARCHITECT_SYSTEM(lang) : undefined;
            await runInference(p, false, systemPrompt);
        }
        setViewMode('split');
    };

    const handleRefine = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!refinementText.trim() || isThinking) return;
        const textToSubmit = refinementText;
        setRefinementText('');
        await runInference(textToSubmit, true);
    };

    const handleChatSend = async (input: string) => {
        await runInference(input, false);
    };

    const suiteLang = lang as 'es' | 'en';
    const isChatTab = activeTab === 'chat';
    const hasPrompt = staticPrompt.length > 0;

    const tabIcons: Record<string, React.ReactNode> = {
        genesis: <Sparkles size={16} />,
        dev: <Terminal size={16} />,
        audit: <Terminal size={16} />,
        studio: <Terminal size={16} />,
        social: <Terminal size={16} />,
        templates: <Terminal size={16} />,
    };

    const tabColors: Record<string, string> = {
        genesis: 'amber',
        dev: 'blue',
        audit: 'sky',
        studio: 'purple',
        social: 'pink',
        templates: 'emerald',
    };

    const colorMap: Record<string, { bg: string; text: string; hover: string; border: string }> = {
        amber: { bg: 'bg-amber-500', text: 'text-amber-400', hover: 'hover:bg-amber-500/10', border: 'border-amber-500/30' },
        blue: { bg: 'bg-blue-500', text: 'text-blue-400', hover: 'hover:bg-blue-500/10', border: 'border-blue-500/30' },
        sky: { bg: 'bg-sky-500', text: 'text-sky-400', hover: 'hover:bg-sky-500/10', border: 'border-sky-500/30' },
        purple: { bg: 'bg-purple-500', text: 'text-purple-400', hover: 'hover:bg-purple-500/10', border: 'border-purple-500/30' },
        pink: { bg: 'bg-pink-500', text: 'text-pink-400', hover: 'hover:bg-pink-500/10', border: 'border-pink-500/30' },
        emerald: { bg: 'bg-emerald-500', text: 'text-emerald-400', hover: 'hover:bg-emerald-500/10', border: 'border-emerald-500/30' },
    };

    const currentColor = colorMap[tabColors[activeTab]] || colorMap.amber;

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

    if (isChatTab) {
        return (
            <ChatView
                messages={aiMessages}
                isThinking={isThinking}
                isLoading={isLoading}
                elapsedMs={elapsedMs}
                error={aiError}
                providerName={providerName}
                model={settings.model}
                onSendMessage={handleChatSend}
                onCopy={handleCopy}
                copied={copied}
                suiteLang={suiteLang}
            />
        );
    }

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
                        "text-gray-900 hover:opacity-90 active:scale-[0.98]"
                    )}
                >
                    {tabIcons[activeTab]}
                    <span className="whitespace-nowrap">{t(`${activeTab}.btn` as any, suiteLang) || 'Generate'}</span>
                </button>

                <div className="flex items-center bg-secondary/50 border border-border rounded-lg p-0.5 gap-0.5 h-8">
                    <button
                        onClick={() => setViewMode('form')}
                        className={cn(
                            "flex items-center gap-1 px-2.5 rounded-md text-xs font-medium transition-all h-full",
                            viewMode === 'form' ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <Settings2 size={12} />
                        <span className="hidden sm:inline">Form</span>
                    </button>
                    <button
                        onClick={() => setViewMode('prompt')}
                        className={cn(
                            "flex items-center gap-1 px-2.5 rounded-md text-xs font-medium transition-all h-full",
                            viewMode === 'prompt' ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <FileText size={12} />
                        <span className="hidden sm:inline">Prompt</span>
                    </button>
                    <button
                        onClick={() => setViewMode('split')}
                        className={cn(
                            "hidden xl:flex items-center gap-1 px-2.5 rounded-md text-xs font-medium transition-all h-full",
                            viewMode === 'split' ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <Columns size={12} />
                        <span className="hidden sm:inline">Split</span>
                    </button>
                </div>

                {hasPrompt && (
                    <button
                        onClick={handleCopy}
                        className={cn(
                            "flex items-center gap-2 px-3 h-8 rounded-lg text-xs font-bold transition-all border shrink-0",
                            copied ? "bg-green-600/20 border-green-600/30 text-green-400" : "bg-secondary/50 border-border text-muted-foreground hover:text-foreground hover:bg-secondary"
                        )}
                    >
                        {copied ? <Check size={14} /> : <Copy size={14} />}
                        <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy'}</span>
                    </button>
                )}

                {activeTab !== 'templates' && (
                    <button
                        onClick={() => setAutoExecute(!autoExecute)}
                        className={cn(
                            "flex items-center gap-1.5 px-3 h-8 rounded-full border text-xs transition-all shrink-0",
                            autoExecute ? "bg-primary/10 border-primary/30 text-primary" : "bg-secondary/50 border-border text-muted-foreground"
                        )}
                    >
                        <Sparkles size={12} />
                        <span className="hidden sm:inline">{autoExecute ? "AI: ON" : "AI: OFF"}</span>
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
                            aiResult={aiResult}
                            displayResult={displayResult}
                            staticPrompt={staticPrompt}
                            activeError={activeError}
                            isThinking={isThinking}
                            isLoading={isLoading}
                            onRunAI={handleRunAI}
                            onExecuteInChat={onExecuteInChat}
                            onRefine={handleRefine}
                            refinementText={refinementText}
                            setRefinementText={setRefinementText}
                            showRefine={aiMessages.length > 0 || isThinking}
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
                                aiResult={aiResult}
                                displayResult={displayResult}
                                staticPrompt={staticPrompt}
                                activeError={activeError}
                                isThinking={isThinking}
                                isLoading={isLoading}
                                onRunAI={handleRunAI}
                                onExecuteInChat={onExecuteInChat}
                                onRefine={handleRefine}
                                refinementText={refinementText}
                                setRefinementText={setRefinementText}
                                showRefine={aiMessages.length > 0 || isThinking}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
