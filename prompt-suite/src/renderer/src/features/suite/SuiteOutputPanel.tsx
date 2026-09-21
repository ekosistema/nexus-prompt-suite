import { useState } from 'react';
import { cn } from '../../lib/utils';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { t } from '../../lib/i18n';
import { Copy, Check, Download, Sparkles, RefreshCw, ClipboardList, Maximize2, X, AlertTriangle } from 'lucide-react';

interface SuiteOutputPanelProps {
    staticPrompt: string;      // prompt bruto compuesto (fallback mientras carga)
    displayResult: string;     // prompt optimizado por la IA (texto a copiar)
    activeError: string | null;
    isThinking: boolean;
    isLoading: boolean;
    onRegenerate?: () => void; // re-ejecuta la personalizacion IA
    lang: 'es' | 'en';
    orphanVars?: string[];     // variables sin rellenar detectadas en el prompt generado
}

function downloadAsFile(content: string): void {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `prompt_${new Date().getTime()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
}

export function SuiteOutputPanel({
    staticPrompt,
    displayResult,
    activeError,
    isThinking,
    isLoading,
    onRegenerate,
    lang,
    orphanVars = [],
}: SuiteOutputPanelProps) {
    const [copied, setCopied] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);

    const copyText = displayResult || staticPrompt;
    const hasResult = displayResult.length > 0;
    const title = hasResult ? t('output.optimized', lang) : t('output.generated', lang);

    const handleCopy = async () => {
        if (!copyText) return;
        try {
            await navigator.clipboard.writeText(copyText);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            setCopied(false);
        }
    };

    return (
        <div className="bg-background border border-border rounded-xl shadow-lg flex flex-col overflow-hidden flex-1">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/5 shrink-0">
                <span className="text-xs font-mono text-muted-foreground uppercase flex items-center gap-2">
                    <ClipboardList size={14} />
                    {title}
                </span>
                {onRegenerate && hasResult && (
                    <button
                        onClick={onRegenerate}
                        disabled={isThinking}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-all text-xs font-bold disabled:opacity-30 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    >
                        <RefreshCw size={12} className={isThinking ? 'animate-spin' : ''} />
                        {t('output.regenerate', lang)}
                    </button>
                )}
            </div>

            <div className="flex-1 min-h-0 p-4 overflow-y-auto relative">
                {isLoading && !displayResult && (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10">
                        <LoadingSpinner size="md" label={isThinking ? t('output.thinking', lang) : t('output.generating_prompt', lang)} />
                    </div>
                )}

                {activeError && (
                    <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-md text-destructive text-sm mb-4" role="alert">
                        <strong>{t('output.error', lang)}</strong> {activeError}
                    </div>
                )}

                {orphanVars.length > 0 && (
                    <div className="p-3 bg-amber-500/10 border border-amber-400/40 rounded-md mb-4" role="alert">
                        <div className="flex items-center gap-2 font-bold text-amber-300 text-sm">
                            <AlertTriangle size={16} className="shrink-0" />
                            <span>{t('output.orphan.title', lang)}</span>
                        </div>
                        <p className="mt-1 text-amber-200 text-sm">
                            {t('output.orphan.count', lang).replace('{{n}}', String(orphanVars.length))}
                        </p>
                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                            {orphanVars.map(v => (
                                <code key={v} className="px-1.5 py-0.5 rounded bg-amber-500/20 border border-amber-400/30 font-mono text-xs text-amber-100">
                                    {`{{${v}}}`}
                                </code>
                            ))}
                        </div>
                        <p className="mt-1.5 text-xs text-amber-200/80">
                            {t('output.orphan.hint', lang)}
                        </p>
                    </div>
                )}

                {!hasResult ? (
                    <div className="flex flex-col items-center justify-center h-full text-center p-8 opacity-40">
                        <Sparkles size={48} className="mb-4 text-primary" />
                        <h3 className="text-lg font-bold mb-2">{t('output.waiting', lang)}</h3>
                        <p className="text-sm">{t('output.waiting_desc', lang)}</p>
                    </div>
                ) : (
                    <pre className="whitespace-pre-wrap font-mono text-sm text-zinc-300 bg-zinc-900/50 p-4 rounded-lg border border-white/5">
                        {displayResult}
                    </pre>
                )}

                {isThinking && hasResult && (
                    <div className="flex items-center gap-2 text-muted-foreground animate-pulse text-xs mt-4">
                        <Sparkles size={14} />
                        <span>{t('output.typing', lang)}</span>
                    </div>
                )}
            </div>

            {hasResult && (
                <div className="flex flex-wrap items-center gap-2 shrink-0 px-4 pb-4 pt-0">
                    <button
                        onClick={handleCopy}
                        className={cn(
                            "flex items-center gap-2 px-5 py-3 rounded-lg font-bold text-sm transition-all shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60",
                            copied
                                ? "bg-emerald-600/20 border border-emerald-600/30 text-emerald-400"
                                : "bg-emerald-600 text-emerald-50 hover:opacity-90 active:scale-[0.98]"
                        )}
                    >
                        {copied ? <Check size={16} /> : <Copy size={16} />}
                        {copied ? t('suite.copied', lang) : t('output.copyPrompt', lang)}
                    </button>
                    <button
                        onClick={() => downloadAsFile(copyText)}
                        className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-bold transition-all border border-border bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
                    >
                        <Download size={15} />
                        {t('output.download', lang)}
                    </button>
                    <button
                        onClick={() => setModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-bold transition-all border border-border bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
                    >
                        <Maximize2 size={15} />
                        {t('output.viewFull', lang)}
                    </button>
                </div>
            )}

            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={() => setModalOpen(false)} role="dialog" aria-modal="true">
                    <div className="w-full max-w-4xl h-[85vh] flex flex-col rounded-xl border border-white/10 shadow-2xl bg-background" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 shrink-0">
                            <span className="text-sm font-mono uppercase text-zinc-200 flex items-center gap-2">
                                <ClipboardList size={16} />
                                {title}
                            </span>
                            <button
                                onClick={() => setModalOpen(false)}
                                className="p-2 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-white/10 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
                                aria-label={t('output.viewFull', lang)}
                            >
                                <X size={18} />
                            </button>
                        </div>
                        <div className="flex-1 min-h-0 p-5">
                            <pre className="whitespace-pre-wrap font-mono text-sm text-zinc-200 overflow-y-auto flex-1 h-full p-5 bg-zinc-900/70 rounded-lg border border-white/10">
                                {copyText}
                            </pre>
                        </div>
                        <div className="flex items-center gap-2 shrink-0 px-5 pb-5 pt-0">
                            <button
                                onClick={handleCopy}
                                className={cn(
                                    "flex items-center gap-2 px-5 py-3 rounded-lg font-bold text-sm transition-all shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60",
                                    copied
                                        ? "bg-emerald-600/20 border border-emerald-600/30 text-emerald-400"
                                        : "bg-emerald-600 text-emerald-50 hover:opacity-90 active:scale-[0.98]"
                                )}
                            >
                                {copied ? <Check size={16} /> : <Copy size={16} />}
                                {copied ? t('suite.copied', lang) : t('output.copyPrompt', lang)}
                            </button>
                            <button
                                onClick={() => downloadAsFile(copyText)}
                                className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-bold transition-all border border-border bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
                            >
                                <Download size={15} />
                                {t('output.download', lang)}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}