import { useRef } from 'react';
import { cn } from '../../lib/utils';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { t } from '../../lib/i18n';
import { Sparkles, Play, Bot } from 'lucide-react';

interface SuiteOutputPanelProps {
    aiResult: string;
    displayResult: string;
    staticPrompt: string;
    activeError: string | null;
    isThinking: boolean;
    isLoading: boolean;
    onRunAI: () => void;
    onExecuteInChat?: (prompt: string) => void;
    onRefine?: (e?: React.FormEvent) => void;
    refinementText?: string;
    setRefinementText?: (text: string) => void;
    showRefine?: boolean;
    lang: 'es' | 'en';
}

export function SuiteOutputPanel({
    aiResult,
    displayResult,
    staticPrompt,
    activeError,
    isThinking,
    isLoading,
    onRunAI,
    onExecuteInChat,
    onRefine,
    refinementText,
    setRefinementText,
    showRefine,
    lang,
}: SuiteOutputPanelProps) {
    const outputRef = useRef<HTMLDivElement>(null);

    const title = aiResult ? t('output.optimized', lang) : t('output.generated', lang);
    const emptyTitle = t('output.waiting', lang);
    const emptyDesc = aiResult
        ? t('output.waiting_desc_done', lang)
        : t('output.waiting_desc', lang);

    return (
        <div className="bg-background border border-border rounded-xl shadow-lg flex flex-col overflow-hidden flex-1">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/5 shrink-0">
                <span className="text-xs font-mono text-muted-foreground uppercase">{title}</span>
                <div className="flex gap-2">
                    <button
                        onClick={onRunAI}
                        disabled={!staticPrompt || isThinking}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-all text-xs font-bold disabled:opacity-30 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    >
                        <Play size={12} />
                        {aiResult ? t('output.re_run_architect', lang) : t('output.run_architect', lang)}
                    </button>
                    {onExecuteInChat && (
                        <button
                            onClick={() => onExecuteInChat(displayResult)}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-all text-xs font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                        >
                            <Play size={12} />
                            {t('output.execute_chat', lang)}
                        </button>
                    )}
                </div>
            </div>

            <div className="flex-1 min-h-0 p-4 overflow-y-auto relative" ref={outputRef}>
                {isLoading && !aiResult && (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10">
                        <LoadingSpinner size="md" label={isThinking ? t('output.thinking', lang) : t('output.generating_prompt', lang)} />
                    </div>
                )}

                {activeError && (
                    <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-md text-destructive text-sm mb-4" role="alert">
                        <strong>{t('output.error', lang)}</strong> {activeError}
                    </div>
                )}

                {!aiResult ? (
                    <div className="flex flex-col items-center justify-center h-full text-center p-8 opacity-40">
                        <Sparkles size={48} className="mb-4 text-primary" />
                        <h3 className="text-lg font-bold mb-2">{emptyTitle}</h3>
                        <p className="text-sm">{emptyDesc}</p>
                    </div>
                ) : (
                    <pre className="whitespace-pre-wrap font-mono text-sm text-zinc-300 bg-zinc-900/50 p-4 rounded-lg border border-white/5">
                        {displayResult}
                    </pre>
                )}

                {isThinking && (
                    <div className="flex items-center gap-2 text-muted-foreground animate-pulse text-xs mt-4">
                        <Bot size={14} />
                        <span>{t('output.typing', lang)}</span>
                    </div>
                )}
            </div>

            {showRefine && onRefine && refinementText !== undefined && setRefinementText && (
                <div className="p-4 border-t border-white/10 bg-white/5 shrink-0">
                    <form onSubmit={onRefine} className="relative flex items-center gap-2">
                        <input
                            type="text"
                            className="flex-1 bg-input/40 border border-input rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring/60 transition-all placeholder:text-muted-foreground/60"
                            placeholder={t('output.refine_placeholder', lang)}
                            value={refinementText}
                            onChange={(e) => setRefinementText(e.target.value)}
                            disabled={isThinking}
                        />
                        <button
                            type="submit"
                            disabled={!refinementText.trim() || isThinking}
                            className="p-2.5 bg-primary text-primary-foreground rounded-full hover:opacity-90 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
