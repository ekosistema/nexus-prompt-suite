import { useState, useCallback, useEffect, useRef } from 'react';
import { cn } from '../../lib/utils';
import { SuiteDev } from './SuiteDev';
import { SuiteStudio } from './SuiteStudio';
import { SuiteSocial } from './SuiteSocial';
import { SuiteGenesis } from './SuiteGenesis';
import { SuiteAudit } from './SuiteAudit';
import { SuiteTemplates } from './SuiteTemplates';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { LLMStatusIndicator } from '../../components/ui/LLMStatusIndicator';
import { usePromptGenerator } from '../../hooks/usePromptGenerator';
import { useAIInference } from '../../hooks/useAIInference';
import { useApp } from '../../contexts/AppContext';
import { Message } from '../../services/ai';
import { t } from '../../lib/i18n';
import { Sparkles, Terminal, Copy, Check, Bot, Send, MessageSquare, Play, Trash2, Plus, FileText, Settings2, PanelLeft, PanelRight, Columns } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

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

interface ChatHistoryItem {
    id: string;
    title: string;
    messages: Message[];
    date: number;
}

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
        generateTitle: hookGenerateTitle,
        resetInference
    } = useAIInference();

    const [history, setHistory] = useState<ChatHistoryItem[]>(() => {
        const saved = localStorage.getItem('chat_history');
        return saved ? JSON.parse(saved) : [];
    });

    const [currentChatId, setCurrentChatId] = useState<string | null>(null);

    useEffect(() => {
        localStorage.setItem('chat_history', JSON.stringify(history));
    }, [history]);

    useEffect(() => {
        if (activeTab === 'chat' && pendingPrompt) {
            setCurrentChatId(null);
            runInference(pendingPrompt, false);
            onClearPending();
        }
    }, [activeTab, pendingPrompt, runInference, onClearPending]);

    useEffect(() => {
        if (activeTab === 'chat' && aiMessages.length > 1 && !isThinking) {
            setHistory(prev => {
                const existingIndex = prev.findIndex(h => h.id === currentChatId);
                const chatId = currentChatId || Date.now().toString();
                
                const newItem: ChatHistoryItem = {
                    id: chatId,
                    title: prev[existingIndex]?.title || 'New Chat...',
                    messages: aiMessages,
                    date: Date.now()
                };

                if (aiMessages.length === (aiMessages[0].role === 'system' ? 3 : 2) && (!prev[existingIndex] || prev[existingIndex].title === 'New Chat...')) {
                    hookGenerateTitle(aiMessages).then(newTitle => {
                        if (newTitle) {
                            setHistory(h => h.map(item => item.id === chatId ? { ...item, title: newTitle } : item));
                        }
                    });
                }

                if (existingIndex >= 0) {
                    const newHistory = [...prev];
                    newHistory[existingIndex] = newItem;
                    return newHistory;
                } else {
                    if (!currentChatId) setCurrentChatId(newItem.id);
                    return [newItem, ...prev];
                }
            });
        }
    }, [aiMessages, activeTab, isThinking]);

    const loadHistoryItem = (item: ChatHistoryItem) => {
        setCurrentChatId(item.id);
        setMessages(item.messages);
    };

    const startNewChat = () => {
        setCurrentChatId(null);
        resetInference();
    };

    useEffect(() => {
        if (!pendingPrompt) {
            resetInference();
            resetPrompt();
            setRefinementText('');
        }
        setViewMode('form');
    }, [activeTab]);

    const [copied, setCopied] = useState(false);
    const [autoExecute, setAutoExecute] = useState(true);
    const [refinementText, setRefinementText] = useState('');
    const [viewMode, setViewMode] = useState<ViewMode>('form');
    const [chatInput, setChatInput] = useState('');
    const outputRef = useRef<HTMLDivElement>(null);
    const generateFnRef = useRef<(() => void) | null>(null);

    const stripMarkdownFences = (text: string): string => {
        return text
            .replace(/^```(?:markdown|md)?\s*\n/, '')
            .replace(/\n```\s*$/, '');
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
            const textToCopy = displayResult;
            await navigator.clipboard.writeText(textToCopy);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Copy failed');
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

    const handleChatSend = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!chatInput.trim() || isThinking) return;
        const input = chatInput;
        setChatInput('');
        if (!currentChatId) setCurrentChatId(null);
        await runInference(input, false);
    };

    const deleteHistoryItem = (id: string) => {
        setHistory(history.filter(item => item.id !== id));
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

    // ─── Chat Tab Layout ──────────────────────────────────────────
    if (isChatTab) {
        return (
            <div className="flex flex-col h-full gap-4">
                {/* Chat Top Bar */}
                <div className="flex items-center gap-3 shrink-0">
                    <button
                        onClick={startNewChat}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-500 text-gray-900 font-bold text-sm hover:opacity-90 transition-all shadow-lg"
                    >
                        <Plus size={16} />
                        {t('chat.new', suiteLang) || 'New Chat'}
                    </button>

                    <div className="flex-1" />

                    {aiMessages.length > 1 && (
                        <button
                            onClick={handleCopy}
                            className={cn(
                                "flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all border",
                                copied ? "bg-green-600/20 border-green-600/30 text-green-400" : "bg-secondary/50 border-border text-muted-foreground hover:text-foreground"
                            )}
                        >
                            {copied ? <Check size={14} /> : <Copy size={14} />}
                            {copied ? 'Copied!' : 'Copy'}
                        </button>
                    )}
                </div>

                {/* LLM Status Indicator */}
                <LLMStatusIndicator
                    isThinking={isThinking}
                    elapsedMs={elapsedMs}
                    provider={providerName}
                    model={settings.model}
                    estimatedTokens={estimatedTokens}
                />

                {/* Chat Main Area - 3 columns on FullHD */}
                <div className="flex-1 min-h-0 grid grid-cols-1 xl:grid-cols-[280px_1fr_360px] gap-4">
                    {/* Left: History Panel */}
                    <div className="hidden xl:flex flex-col bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                        <div className="p-3 border-b border-border">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Historial</span>
                        </div>
                        <div className="flex-1 overflow-y-auto p-2 space-y-1">
                            {history.length === 0 ? (
                                <p className="text-[11px] text-center text-muted-foreground py-8">No hay chats recientes</p>
                            ) : (
                                history.map(item => (
                                    <div 
                                        key={item.id} 
                                        onClick={() => loadHistoryItem(item)}
                                        className={cn(
                                            "group flex items-center gap-2 p-2.5 rounded-lg cursor-pointer transition-all",
                                            currentChatId === item.id ? "bg-primary/20 border border-primary/30" : "hover:bg-secondary/50 border border-transparent"
                                        )}
                                    >
                                        <MessageSquare size={14} className={cn("shrink-0", currentChatId === item.id ? "text-primary" : "text-muted-foreground")} />
                                        <span className="text-xs truncate flex-1">{item.title}</span>
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); deleteHistoryItem(item.id); }}
                                            className="opacity-0 group-hover:opacity-100 p-1 hover:text-destructive transition-all"
                                        >
                                            <Trash2 size={12} />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Center: Chat Messages */}
                    <div className="flex flex-col bg-zinc-950 border border-border rounded-xl shadow-lg overflow-hidden xl:col-span-1">
                        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/5 shrink-0">
                            <span className="text-xs font-mono text-muted-foreground uppercase">Chat Local</span>
                            <span className="text-[10px] text-muted-foreground/60">{aiMessages.filter(m => m.role !== 'system').length} messages</span>
                        </div>

                        <div className="flex-1 p-4 overflow-y-auto" ref={outputRef}>
                            {isLoading && !aiResult && (
                                <div className="flex items-center justify-center h-full">
                                    <LoadingSpinner size="md" label={isThinking ? "AI is thinking..." : "Generating..."} />
                                </div>
                            )}

                            {activeError && (
                                <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-md text-destructive text-sm mb-4" role="alert">
                                    <strong>Error:</strong> {activeError}
                                </div>
                            )}

                            {aiMessages.length === 0 && !isThinking ? (
                                <div className="flex flex-col items-center justify-center h-full text-center p-8 opacity-40">
                                    <MessageSquare size={48} className="mb-4 text-primary" />
                                    <h3 className="text-lg font-bold mb-2">Nueva Conversación</h3>
                                    <p className="text-sm">Escribe algo abajo para comenzar a hablar con el modelo local.</p>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-4">
                                    {aiMessages.map((msg, i) => {
                                        if (msg.role === 'system') return null;
                                        const isFirstUserMsg = !aiMessages.slice(0, i).some(m => m.role === 'user');
                                        if (msg.role === 'user' && isFirstUserMsg) return null;
                                        
                                        return (
                                            <div key={i} className={cn("flex", msg.role === 'user' ? "justify-end" : "justify-start")}>
                                                <div className={cn(
                                                    "max-w-[80%] rounded-2xl p-4 shadow-xl",
                                                    msg.role === 'user' 
                                                        ? "bg-primary/20 border border-primary/30 text-white" 
                                                        : "bg-white/5 border border-white/10 prose prose-sm prose-invert max-w-none"
                                                )}>
                                                    {msg.role === 'user' ? (
                                                        <p className="text-sm font-medium">{msg.content}</p>
                                                    ) : (
                                                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                    
                                    {isThinking && (
                                        <div className="flex items-center gap-2 text-muted-foreground animate-pulse text-xs">
                                            <Bot size={14} />
                                            <span>AI is typing...</span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="p-4 border-t border-white/10 bg-white/5 shrink-0">
                            <form onSubmit={handleChatSend} className="flex items-center gap-2">
                                <input
                                    type="text"
                                    className="flex-1 bg-zinc-900 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-zinc-600"
                                    placeholder="Escribe un mensaje..."
                                    value={chatInput}
                                    onChange={(e) => setChatInput(e.target.value)}
                                    disabled={isThinking}
                                />
                                <button
                                    type="submit"
                                    disabled={!chatInput.trim() || isThinking}
                                    className="p-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
                                >
                                    <Send size={18} />
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Right: Prompt Preview (FullHD only) */}
                    <div className="hidden xl:flex flex-col bg-zinc-950 border border-border rounded-xl shadow-lg overflow-hidden">
                        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/5 shrink-0">
                            <span className="text-xs font-mono text-muted-foreground uppercase">
                                {aiResult ? 'Optimized Prompt' : 'Prompt Preview'}
                            </span>
                            {aiResult && (
                                <button
                                    onClick={handleCopy}
                                    className="flex items-center gap-1.5 px-2 py-1 rounded bg-white/5 text-muted-foreground hover:text-foreground transition-colors text-[10px]"
                                >
                                    {copied ? <Check size={10} /> : <Copy size={10} />}
                                    {copied ? 'Copied' : 'Copy'}
                                </button>
                            )}
                        </div>

                            <div className="flex-1 min-h-0 p-4 overflow-y-auto">
                                {aiResult ? (
                                    <pre className="whitespace-pre-wrap font-mono text-xs text-zinc-300 leading-relaxed">
                                        {displayResult}
                                    </pre>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-center opacity-40">
                                    <FileText size={32} className="mb-3 text-muted-foreground" />
                                    <p className="text-xs text-muted-foreground">El prompt optimizado aparecerá aquí</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ─── Suite Tabs Layout ────────────────────────────────────────
    return (
        <div className="flex flex-col h-full gap-4">
            {/* TOP BAR - Fixed height, no wrapping */}
            <div className="flex items-center gap-3 shrink-0 h-10">
                {/* Generate Button - FIXED dimensions across all tabs */}
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

                {/* View Mode Toggle */}
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

                {/* Copy Button */}
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

                {/* AI Mode Toggle */}
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

            {/* LLM Status Indicator */}
            <LLMStatusIndicator
                isThinking={isThinking}
                elapsedMs={elapsedMs}
                provider={providerName}
                model={settings.model}
                estimatedTokens={estimatedTokens}
            />

            {/* MAIN CONTENT AREA */}
            <div className="flex-1 min-h-0">
                {/* Form Only View */}
                {viewMode === 'form' && (
                    <div className="h-full overflow-y-auto pr-2 pb-4">
                        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
                            {renderFormContent()}
                        </div>
                    </div>
                )}

                {/* Prompt Only View */}
                {viewMode === 'prompt' && (
                    <div className="h-full bg-zinc-950 border border-border rounded-xl shadow-lg flex flex-col overflow-hidden">
                        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/5 shrink-0">
                            <span className="text-xs font-mono text-muted-foreground uppercase">
                                {aiResult ? 'Optimized Prompt' : 'Generated Prompt'}
                            </span>
                            <div className="flex gap-2">
                                <button
                                    onClick={handleRunAI}
                                    disabled={!staticPrompt || isThinking}
                                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-all text-xs font-bold disabled:opacity-30 disabled:cursor-not-allowed"
                                >
                                    <Play size={12} />
                                    {aiResult ? 'Re-run Architect' : 'Run Architect'}
                                </button>
                                <button
                                    onClick={() => onExecuteInChat(displayResult)}
                                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-all text-xs font-bold"
                                >
                                    <Play size={12} />
                                    Execute in Chat
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 min-h-0 p-4 overflow-y-auto relative" ref={outputRef}>
                            {isLoading && !aiResult && (
                                <div className="absolute inset-0 flex items-center justify-center bg-zinc-950/80 backdrop-blur-sm z-10">
                                    <LoadingSpinner size="md" label={isThinking ? "AI is thinking..." : "Generating prompt..."} />
                                </div>
                            )}

                            {activeError && (
                                <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-md text-destructive text-sm mb-4" role="alert">
                                    <strong>Error:</strong> {activeError}
                                </div>
                            )}

                            {!aiResult ? (
                                <div className="flex flex-col items-center justify-center h-full text-center p-8 opacity-40">
                                    <Sparkles size={48} className="mb-4 text-primary" />
                                    <h3 className="text-lg font-bold mb-2">Esperando resultado</h3>
                                    <p className="text-sm">El prompt optimizado aparecerá aquí cuando el Architect termine.</p>
                                </div>
                            ) : (
                                <pre className="whitespace-pre-wrap font-mono text-sm text-zinc-300 bg-zinc-900/50 p-4 rounded-lg border border-white/5">
                                    {displayResult}
                                </pre>
                            )}

                            {isThinking && (
                                <div className="flex items-center gap-2 text-muted-foreground animate-pulse text-xs mt-4">
                                    <Bot size={14} />
                                    <span>AI is typing...</span>
                                </div>
                            )}
                        </div>

                        {(aiMessages.length > 0 || isThinking) && (
                            <div className="p-4 border-t border-white/10 bg-white/5 shrink-0">
                                <form onSubmit={handleRefine} className="relative flex items-center gap-2">
                                    <input
                                        type="text"
                                        className="flex-1 bg-zinc-900 border border-white/10 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-zinc-600"
                                        placeholder="Refinar prompt..."
                                        value={refinementText}
                                        onChange={(e) => setRefinementText(e.target.value)}
                                        disabled={isThinking}
                                    />
                                    <button
                                        type="submit"
                                        disabled={!refinementText.trim() || isThinking}
                                        className="p-2.5 bg-primary text-primary-foreground rounded-full hover:opacity-90 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
                                    >
                                        <Send size={18} />
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                )}

                {/* Split View (FullHD+) */}
                {viewMode === 'split' && (
                    <div className="h-full grid grid-cols-1 xl:grid-cols-2 gap-4">
                        <div className="overflow-y-auto pr-2 pb-4">
                            <div className="bg-card border border-border rounded-xl p-5 shadow-sm h-full">
                                {renderFormContent()}
                            </div>
                        </div>

                        <div className="flex flex-col gap-4 min-h-0 overflow-hidden">
                            <div className="bg-zinc-950 border border-border rounded-xl shadow-lg flex flex-col overflow-hidden flex-1">
                                <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/5 shrink-0">
                                    <span className="text-xs font-mono text-muted-foreground uppercase">
                                        {aiResult ? 'Optimized Prompt' : 'Generated Prompt'}
                                    </span>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleRunAI}
                                            disabled={!staticPrompt || isThinking}
                                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-all text-xs font-bold disabled:opacity-30 disabled:cursor-not-allowed"
                                        >
                                            <Play size={12} />
                                            {aiResult ? 'Re-run Architect' : 'Run Architect'}
                                        </button>
                                        <button
                                            onClick={() => onExecuteInChat(displayResult)}

                                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-all text-xs font-bold"
                                        >
                                            <Play size={12} />
                                            Execute in Chat
                                        </button>
                                    </div>
                                </div>

                                <div className="flex-1 min-h-0 p-4 overflow-y-auto relative" ref={outputRef}>
                                    {isLoading && !aiResult && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-zinc-950/80 backdrop-blur-sm z-10">
                                            <LoadingSpinner size="md" label={isThinking ? "AI is thinking..." : "Generating prompt..."} />
                                        </div>
                                    )}

                                    {activeError && (
                                        <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-md text-destructive text-sm mb-4" role="alert">
                                            <strong>Error:</strong> {activeError}
                                        </div>
                                    )}

                                    {!aiResult ? (
                                        <div className="flex flex-col items-center justify-center h-full text-center p-8 opacity-40">
                                            <Sparkles size={48} className="mb-4 text-primary" />
                                            <h3 className="text-lg font-bold mb-2">Esperando resultado</h3>
                                            <p className="text-sm">El prompt optimizado aparecerá aquí cuando el Architect termine.</p>
                                        </div>
                                    ) : (
                                        <pre className="whitespace-pre-wrap font-mono text-sm text-zinc-300 bg-zinc-900/50 p-4 rounded-lg border border-white/5">
                                            {displayResult}
                                        </pre>
                                    )}
                                    {isThinking && (
                                        <div className="flex items-center gap-2 text-muted-foreground animate-pulse text-xs mt-4">
                                            <Bot size={14} />
                                            <span>AI is typing...</span>
                                        </div>
                                    )}
                                </div>

                                {(aiMessages.length > 0 || isThinking) && (
                                    <div className="p-4 border-t border-white/10 bg-white/5 shrink-0">
                                        <form onSubmit={handleRefine} className="relative flex items-center gap-2">
                                            <input
                                                type="text"
                                                className="flex-1 bg-zinc-900 border border-white/10 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-zinc-600"
                                                placeholder="Refinar prompt..."
                                                value={refinementText}
                                                onChange={(e) => setRefinementText(e.target.value)}
                                                disabled={isThinking}
                                            />
                                            <button
                                                type="submit"
                                                disabled={!refinementText.trim() || isThinking}
                                                className="p-2.5 bg-primary text-primary-foreground rounded-full hover:opacity-90 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
                                            >
                                                <Send size={18} />
                                            </button>
                                        </form>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
