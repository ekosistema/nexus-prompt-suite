import { useRef } from 'react';
import { cn } from '../../lib/utils';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
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
}: SuiteOutputPanelProps) {
    const outputRef = useRef<HTMLDivElement>(null);

    const title = aiResult ? 'Optimized Prompt' : 'Generated Prompt';
    const emptyTitle = 'Esperando resultado';
    const emptyDesc = aiResult
        ? 'El prompt optimizado aparecerá aquí cuando el Architect termine.'
        : 'El prompt optimizado aparecerá aquí.';

    return (
        <div className="bg-zinc-950 border border-border rounded-xl shadow-lg flex flex-col overflow-hidden flex-1">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/5 shrink-0">
                <span className="text-xs font-mono text-muted-foreground uppercase">{title}</span>
                <div className="flex gap-2">
                    <button
                        onClick={onRunAI}
                        disabled={!staticPrompt || isThinking}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-all text-xs font-bold disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        <Play size={12} />
                        {aiResult ? 'Re-run Architect' : 'Run Architect'}
                    </button>
                    {onExecuteInChat && (
                        <button
                            onClick={() => onExecuteInChat(displayResult)}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-all text-xs font-bold"
                        >
                            <Play size={12} />
                            Execute in Chat
                        </button>
                    )}
                </div>
            </div>

            <div className="flex-1 min-h-0 p-4 overflow-y-auto relative" ref={outputRef}>
                {isLoading && !aiResult && (
                    <div className="absolute inset-0 flex items-center justify-center bg-zinc-950/80 backdrop-blur-sm z-10">
                        <LoadingSpinner size="md" label={isThinking ? 'AI is thinking...' : 'Generating prompt...'} />
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
                        <span>AI is typing...</span>
                    </div>
                )}
            </div>

            {showRefine && onRefine && refinementText !== undefined && setRefinementText && (
                <div className="p-4 border-t border-white/10 bg-white/5 shrink-0">
                    <form onSubmit={onRefine} className="relative flex items-center gap-2">
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
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
