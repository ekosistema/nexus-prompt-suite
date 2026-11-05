import { useState, useEffect, useRef, useCallback } from 'react';
import { secureGetItem, secureSetItem } from '../lib/secureStorage';
import { HistoryEntry, HISTORY_KEY, upsertEntry, pruneHistory } from '../lib/history';
import { safeLog } from '../lib/utils';

export function useHistory() {
    const [entries, setEntries] = useState<HistoryEntry[]>([]);
    const loaded = useRef(false);

    useEffect(() => {
        secureGetItem<HistoryEntry[]>(HISTORY_KEY)
            .then(data => { if (Array.isArray(data)) setEntries(prev => (prev.length ? prev : data)); })
            .catch(() => safeLog('warn', 'History load failed'))
            .finally(() => { loaded.current = true; });
    }, []);

    // Solo se persiste tras la carga inicial para no pisar el historial guardado con [].
    useEffect(() => {
        if (!loaded.current) return;
        secureSetItem(HISTORY_KEY, entries).catch(() => safeLog('error', 'History save failed'));
    }, [entries]);

    const save = useCallback((entry: HistoryEntry) => setEntries(prev => upsertEntry(prev, entry)), []);
    const remove = useCallback((id: string) => setEntries(prev => prev.filter(e => e.id !== id)), []);
    const toggleFavorite = useCallback((id: string) =>
        setEntries(prev => prev.map(e => (e.id === id ? { ...e, favorite: !e.favorite } : e))), []);
    const clearNonFavorites = useCallback(() => setEntries(prev => prev.filter(e => e.favorite)), []);

    const importEntries = useCallback((incoming: HistoryEntry[]) =>
        setEntries(prev => {
            const byId = new Map(prev.map(e => [e.id, e]));
            for (const e of incoming) byId.set(e.id, e);
            return pruneHistory([...byId.values()]);
        }), []);

    return { entries, save, remove, toggleFavorite, clearNonFavorites, importEntries };
}
