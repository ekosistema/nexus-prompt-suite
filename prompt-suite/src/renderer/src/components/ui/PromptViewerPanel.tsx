import { useState, useCallback } from 'react';
import { Copy, Check, FileText, Bot, ChevronDown, ChevronUp, EyeOff } from 'lucide-react';
import { cn } from '../../lib/utils';

type PromptVersion = 'original' | 'optimized';

interface PromptViewerPanelProps {
    staticPrompt: string;
    aiResult: string;
    hasAIResult: boolean;
    isThinking: boolean;
}

export function PromptViewerPanel({ staticPrompt, aiResult, hasAIResult, isThinking }: PromptViewerPanelProps) {
    const [version, setVersion] = useState<PromptVersion>('original');
    const [copied, setCopied] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

    const activePrompt = version === 'optimized' && hasAIResult ? aiResult : staticPrompt;

    const handleCopy = useCallback(async () => {
        await navigator.clipboard.writeText(activePrompt);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }, [activePrompt]);

    const wordCount = activePrompt.trim() ? activePrompt.trim().split(/\s+/).length : 0;
    const charCount = activePrompt.length;

    if (!staticPrompt && !aiResult) return null;

    return (
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-secondary/30">
                <div className="flex items-center gap-2">
                    <FileText size={16} className="text-primary" />
                    <span className="text-sm font-semibold">Prompt Viewer</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex items-center bg-secondary/50 rounded-lg p-0.5 gap-0.5">
                        <button
                            onClick={() => setVersion('original')}
                            className={cn(
                                "flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-all",
                                version === 'original' ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <FileText size={12} />
                            Original
                        </button>
                        <button
                            onClick={() => setVersion('optimized')}
                            disabled={!hasAIResult}
                            className={cn(
                                "flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-all",
                                version === 'optimized' ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
                                !hasAIResult && "opacity-40 cursor-not-allowed"
                            )}
                        >
                            <Bot size={12} />
                            Optimized
                        </button>
                    </div>
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all"
                    >
                        {isCollapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
                    </button>
                </div>
            </div>

            {!isCollapsed && (
                <>
                    <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-secondary/20 text-[10px] text-muted-foreground">
                        <div className="flex items-center gap-3">
                            <span>{wordCount} words</span>
                            <span>{charCount} chars</span>
                        </div>
                        <button
                            onClick={handleCopy}
                            disabled={!activePrompt}
                            className={cn(
                                "flex items-center gap-1.5 px-2 py-1 rounded transition-all",
                                copied
                                    ? "bg-green-600/20 text-green-400"
                                    : "hover:bg-secondary/50 hover:text-foreground"
                            )}
                        >
                            {copied ? <Check size={12} /> : <Copy size={12} />}
                            {copied ? 'Copied!' : 'Copy'}
                        </button>
                    </div>

                    <div className="p-4 max-h-96 overflow-y-auto">
                        {isThinking && version === 'optimized' && !hasAIResult ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <Bot size={32} className="text-primary animate-pulse mb-3" />
                                <p className="text-sm text-muted-foreground">Generating optimized prompt...</p>
                            </div>
                        ) : activePrompt ? (
                            version === 'original' ? (
                                <pre className="whitespace-pre-wrap font-mono text-xs text-zinc-300 leading-relaxed">
                                    {activePrompt}
                                </pre>
                            ) : (
                                <div className="prose prose-sm prose-invert max-w-none">
                                    <pre className="whitespace-pre-wrap font-mono text-xs text-emerald-300 leading-relaxed bg-emerald-950/20 p-4 rounded-lg border border-emerald-500/20">
                                        {activePrompt}
                                    </pre>
                                </div>
                            )
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-center opacity-40">
                                <EyeOff size={24} className="mb-2" />
                                <p className="text-xs text-muted-foreground">
                                    {version === 'optimized' ? 'Run Architect to see the optimized version' : 'No prompt generated yet'}
                                </p>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
