import { useMemo, useRef, useState } from 'react';
import { cn } from '../../lib/utils';
import { t } from '../../lib/i18n';
import { HistoryEntry, currentText, parseImport } from '../../lib/history';
import { NAV_ITEMS } from './navConfig';
import { X, Search, Star, Trash2, Copy, RotateCcw, Check, Sparkles, Zap, History, Download, Upload } from 'lucide-react';

interface HistoryPanelProps {
    open: boolean;
    lang: 'es' | 'en';
    entries: HistoryEntry[];
    onClose: () => void;
    onReopen: (entry: HistoryEntry) => void;
    onToggleFavorite: (id: string) => void;
    onRemove: (id: string) => void;
    onClearAll: () => void;
    onImport: (entries: HistoryEntry[]) => void;
}

function formatDate(ts: number, lang: string): string {
    return new Date(ts).toLocaleString(lang === 'es' ? 'es-ES' : 'en-US', { dateStyle: 'short', timeStyle: 'short' });
}

export function HistoryPanel({ open, lang, entries, onClose, onReopen, onToggleFavorite, onRemove, onClearAll, onImport }: HistoryPanelProps) {
    const [query, setQuery] = useState('');
    const [onlyFav, setOnlyFav] = useState(false);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [confirmClear, setConfirmClear] = useState(false);
    const [importMsg, setImportMsg] = useState<string | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);

    const exportJson = () => {
        const blob = new Blob([JSON.stringify({ version: 1, entries }, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `nexus-history-${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const importJson = async (file: File | undefined) => {
        if (!file) return;
        try {
            const parsed = parseImport(JSON.parse(await file.text()));
            if (parsed.length === 0) throw new Error('empty');
            onImport(parsed);
            setImportMsg(t('history.import_ok', lang).replace('{{n}}', String(parsed.length)));
        } catch {
            setImportMsg(t('history.import_error', lang));
        }
        if (fileRef.current) fileRef.current.value = '';
        setTimeout(() => setImportMsg(null), 4000);
    };

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        return entries.filter(e =>
            (!onlyFav || e.favorite) &&
            (!q || e.title.toLowerCase().includes(q) || currentText(e).toLowerCase().includes(q))
        );
    }, [entries, query, onlyFav]);

    if (!open) return null;

    const moduleLabel = (id: string) => {
        const item = NAV_ITEMS.find(n => n.id === id);
        return item ? t(item.labelKey, lang) : id;
    };

    const copy = async (e: HistoryEntry) => {
        try {
            await navigator.clipboard.writeText(currentText(e));
            setCopiedId(e.id);
            setTimeout(() => setCopiedId(null), 1500);
        } catch { /* clipboard no disponible */ }
    };

    return (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm" onClick={onClose} role="dialog" aria-modal="true" aria-label={t('history.title', lang)}>
            <aside className="w-full max-w-md h-full bg-background border-l border-border shadow-2xl flex flex-col" onClick={(ev) => ev.stopPropagation()}>
                <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
                    <h2 className="text-base font-bold flex items-center gap-2"><History size={16} />{t('history.title', lang)}</h2>
                    <button onClick={onClose} aria-label={t('output.close', lang)} className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary">
                        <X size={18} />
                    </button>
                </div>

                <div className="px-5 py-3 space-y-2 border-b border-border shrink-0">
                    <div className="relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder={t('history.search', lang)}
                            className="w-full bg-secondary/40 border border-input rounded-md pl-9 pr-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => setOnlyFav(v => !v)}
                            aria-pressed={onlyFav}
                            className={cn("flex items-center gap-1.5 px-3 py-1 rounded-full text-xs border transition-all",
                                onlyFav ? "bg-amber-500/15 border-amber-400/50 text-amber-300" : "bg-secondary/40 border-border text-muted-foreground hover:text-foreground")}
                        >
                            <Star size={12} className={onlyFav ? 'fill-amber-300' : ''} />
                            {t('history.favorites', lang)}
                        </button>
                        {entries.some(e => !e.favorite) && (
                            confirmClear ? (
                                <span className="flex items-center gap-2 text-xs">
                                    <button onClick={() => { onClearAll(); setConfirmClear(false); }} className="text-destructive font-bold hover:underline">{t('history.clear_confirm', lang)}</button>
                                    <button onClick={() => setConfirmClear(false)} className="text-muted-foreground hover:text-foreground">{t('output.edit.cancel', lang)}</button>
                                </span>
                            ) : (
                                <button onClick={() => setConfirmClear(true)} className="text-xs text-muted-foreground hover:text-destructive">{t('history.clear', lang)}</button>
                            )
                        )}
                    </div>
                </div>

                <div className="px-5 py-2 border-b border-border shrink-0 flex items-center gap-2 text-xs">
                    <button onClick={exportJson} disabled={entries.length === 0} className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-border bg-secondary/40 text-muted-foreground hover:text-foreground disabled:opacity-40">
                        <Download size={12} />{t('history.export', lang)}
                    </button>
                    <button onClick={() => fileRef.current?.click()} className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-border bg-secondary/40 text-muted-foreground hover:text-foreground">
                        <Upload size={12} />{t('history.import', lang)}
                    </button>
                    <input ref={fileRef} type="file" accept="application/json,.json" className="hidden" onChange={(e) => importJson(e.target.files?.[0])} />
                    {importMsg && <span className="text-muted-foreground" role="status">{importMsg}</span>}
                </div>

                <div className="flex-1 overflow-y-auto px-5 py-3 space-y-2">
                    {filtered.length === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-12">{t(entries.length === 0 ? 'history.empty' : 'empty.noResults.title', lang)}</p>
                    )}
                    {filtered.map(e => {
                        const usedAI = e.activeVersion >= 0;
                        return (
                            <div key={e.id} className="bg-card/50 border border-border rounded-xl p-3 space-y-2 hover:border-primary/40 transition-all">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold truncate">{e.title}</p>
                                        <p className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-1.5 flex-wrap">
                                            <span>{moduleLabel(e.module)}</span>·<span>{formatDate(e.updatedAt, lang)}</span>
                                            <span className={cn("inline-flex items-center gap-1 px-1.5 rounded-full border text-[10px] font-bold",
                                                usedAI ? "bg-primary/15 text-primary border-primary/40" : "bg-emerald-500/15 text-emerald-300 border-emerald-500/40")}>
                                                {usedAI ? <Sparkles size={9} /> : <Zap size={9} />}
                                                {usedAI ? t('mode.ai', lang) : t('mode.noai', lang)}
                                            </span>
                                        </p>
                                    </div>
                                    <button onClick={() => onToggleFavorite(e.id)} aria-pressed={e.favorite} aria-label={t('history.favorites', lang)} className="p-1 shrink-0 text-muted-foreground hover:text-amber-300">
                                        <Star size={15} className={e.favorite ? 'fill-amber-300 text-amber-300' : ''} />
                                    </button>
                                </div>
                                <p className="text-xs text-muted-foreground line-clamp-2 font-mono">{currentText(e)}</p>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => { onReopen(e); onClose(); }} className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary/15 text-primary border border-primary/40 text-xs font-bold hover:bg-primary/25">
                                        <RotateCcw size={12} />{t('history.reopen', lang)}
                                    </button>
                                    <button onClick={() => copy(e)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border bg-secondary/50 text-xs font-bold text-muted-foreground hover:text-foreground">
                                        {copiedId === e.id ? <Check size={12} /> : <Copy size={12} />}{copiedId === e.id ? t('suite.copied', lang) : t('suite.copy', lang)}
                                    </button>
                                    <button onClick={() => onRemove(e.id)} aria-label={t('history.delete', lang)} className="ml-auto p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </aside>
        </div>
    );
}
