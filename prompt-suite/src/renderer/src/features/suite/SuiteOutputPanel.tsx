import { useState, useEffect } from 'react';
import { cn } from '../../lib/utils';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { t } from '../../lib/i18n';
import { Copy, Check, Download, Sparkles, RefreshCw, ClipboardList, Maximize2, X, AlertTriangle, Zap, Pencil, Send } from 'lucide-react';

interface SuiteOutputPanelProps {
    staticPrompt: string;      // prompt base compuesto por el formulario
    displayResult: string;     // texto a mostrar/copiar: versión activa (IA o base)
    usingAI: boolean;          // true si displayResult proviene de la IA
    aiRequested: boolean;      // true si el usuario pidió optimizar con IA
    activeError: string | null;
    isThinking: boolean;
    isLoading: boolean;
    onRegenerate?: () => void; // re-ejecuta la optimización IA sobre el prompt base
    lang: 'es' | 'en';
    orphanVars?: string[];     // variables sin rellenar detectadas en el prompt generado
    versionLabels: string[];   // etiquetas de las versiones de IA (v1, v2…)
    versionIdx: number;        // -1 = base
    onSelectVersion: (idx: number) => void;
    onRefine: (instruction: string) => void;
    onEdit: (text: string) => void;
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

const CHIPS = ['refine.shorter', 'refine.detailed', 'refine.technical', 'refine.examples', 'refine.formal', 'refine.casual', 'refine.translate'];

export function SuiteOutputPanel({
    staticPrompt,
    displayResult,
    usingAI,
    aiRequested,
    activeError,
    isThinking,
    isLoading,
    onRegenerate,
    lang,
    orphanVars = [],
    versionLabels,
    versionIdx,
    onSelectVersion,
    onRefine,
    onEdit,
}: SuiteOutputPanelProps) {
    const [copied, setCopied] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState('');
    const [instruction, setInstruction] = useState('');

    const copyText = displayResult || staticPrompt;
    const hasResult = displayResult.length > 0;
    const title = usingAI ? t('output.optimized', lang) : (hasResult ? t('output.base', lang) : t('output.generated', lang));

    // Al cambiar de versión se cancela cualquier edición en curso.
    useEffect(() => { setEditing(false); }, [versionIdx, staticPrompt]);

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

    const startEdit = () => { setDraft(copyText); setEditing(true); };
    const saveEdit = () => {
        if (draft.trim() && draft !== copyText) onEdit(draft);
        setEditing(false);
    };

    const submitRefine = (text: string) => {
        const value = text.trim();
        if (!value || isThinking) return;
        onRefine(value);
        setInstruction('');
    };

    const versionBtn = (active: boolean) => cn(
        "px-2.5 py-1 rounded-md text-xs font-mono border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60",
        active ? "bg-primary/20 border-primary/50 text-primary font-bold" : "bg-secondary/40 border-border text-muted-foreground hover:text-foreground"
    );

    return (
        <div className="bg-background border border-border rounded-xl shadow-lg flex flex-col overflow-hidden flex-1">
            <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 border-b border-white/10 bg-white/5 shrink-0">
                <span className="text-xs font-mono text-muted-foreground uppercase flex items-center gap-2">
                    <ClipboardList size={14} />
                    {title}
                    {hasResult && (
                        <span className={cn(
                            "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold normal-case border",
                            usingAI ? "bg-primary/15 text-primary border-primary/40" : "bg-emerald-500/15 text-emerald-300 border-emerald-500/40"
                        )}>
                            {usingAI ? <Sparkles size={10} /> : <Zap size={10} />}
                            {usingAI ? t('mode.ai', lang) : t('mode.noai', lang)}
                        </span>
                    )}
                </span>
                <div className="flex items-center gap-2">
                    {hasResult && !editing && (
                        <button
                            onClick={startEdit}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary transition-all text-xs font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
                        >
                            <Pencil size={12} />
                            {t('output.edit', lang)}
                        </button>
                    )}
                    {onRegenerate && hasResult && aiRequested && (
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
            </div>

            {hasResult && versionLabels.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 px-4 py-2 border-b border-white/5 shrink-0" role="tablist" aria-label={t('output.versions', lang)}>
                    <span className="text-[10px] uppercase text-muted-foreground mr-1">{t('output.versions', lang)}</span>
                    <button role="tab" aria-selected={versionIdx === -1} onClick={() => onSelectVersion(-1)} className={versionBtn(versionIdx === -1)}>
                        {t('output.version.base', lang)}
                    </button>
                    {versionLabels.map((label, i) => (
                        <button key={label} role="tab" aria-selected={versionIdx === i} onClick={() => onSelectVersion(i)} className={versionBtn(versionIdx === i)}>
                            {label}
                        </button>
                    ))}
                </div>
            )}

            <div className="flex-1 min-h-0 p-4 overflow-y-auto relative">
                {isLoading && !hasResult && (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10">
                        <LoadingSpinner size="md" label={isThinking ? t('output.thinking', lang) : t('output.generating_prompt', lang)} />
                    </div>
                )}

                {activeError && (
                    <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-md text-destructive text-sm mb-4" role="alert">
                        <strong>{t('output.error', lang)}</strong> {activeError}
                        {hasResult && !usingAI && <p className="mt-1 text-xs opacity-80">{t('output.ai_failed', lang)}</p>}
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
                ) : editing ? (
                    <div className="flex flex-col gap-2 h-full min-h-[240px]">
                        <textarea
                            value={draft}
                            onChange={(e) => setDraft(e.target.value)}
                            aria-label={t('output.edit', lang)}
                            className="flex-1 min-h-[220px] w-full resize-none font-mono text-sm text-zinc-200 bg-zinc-900/70 p-4 rounded-lg border border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                        />
                        <div className="flex gap-2">
                            <button onClick={saveEdit} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-bold hover:opacity-90">
                                {t('output.edit.save', lang)}
                            </button>
                            <button onClick={() => setEditing(false)} className="px-4 py-2 rounded-lg border border-border bg-secondary/50 text-xs font-bold text-muted-foreground hover:text-foreground">
                                {t('output.edit.cancel', lang)}
                            </button>
                        </div>
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

            {hasResult && !editing && (
                <div className="shrink-0 px-4 pb-3 space-y-2 border-t border-white/5 pt-3">
                    <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] uppercase text-muted-foreground mr-1">{t('refine.title', lang)}</span>
                        {CHIPS.map(key => (
                            <button
                                key={key}
                                disabled={isThinking}
                                onClick={() => submitRefine(t(key, lang))}
                                className="px-2.5 py-1 rounded-full text-xs border border-border bg-secondary/40 text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
                            >
                                {t(key, lang)}
                            </button>
                        ))}
                    </div>
                    <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); submitRefine(instruction); }}>
                        <input
                            value={instruction}
                            onChange={(e) => setInstruction(e.target.value)}
                            placeholder={t('refine.placeholder', lang)}
                            aria-label={t('refine.title', lang)}
                            className="flex-1 bg-secondary/40 border border-input rounded-md px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                        />
                        <button
                            type="submit"
                            disabled={isThinking || !instruction.trim()}
                            className="flex items-center gap-1.5 px-4 rounded-md bg-primary/15 text-primary border border-primary/40 text-xs font-bold hover:bg-primary/25 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            <Send size={13} />
                            {t('refine.apply', lang)}
                        </button>
                    </form>
                </div>
            )}

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
                                aria-label={t('output.close', lang)}
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
