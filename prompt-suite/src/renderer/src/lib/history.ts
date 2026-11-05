export interface PromptVersion {
    label: string;   // 'v1', 'v2'… (la versión base no se guarda aquí)
    text: string;
}

export interface HistoryEntry {
    id: string;
    module: string;                      // genesis | dev | audit | studio | social | templates
    title: string;
    createdAt: number;
    updatedAt: number;
    favorite: boolean;
    basePrompt: string;                  // prompt compuesto por el formulario (sin IA)
    versions: PromptVersion[];           // resultados de IA / refinados
    activeVersion: number;               // -1 = base
    snapshot: Record<string, unknown>;   // estado del formulario para poder reabrirlo
    model?: string;
}

export const HISTORY_KEY = 'prompt_history';

const isRecord = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v);

// Valida un JSON importado y devuelve solo las entradas con forma correcta (nunca confía en el fichero).
export function parseImport(raw: unknown): HistoryEntry[] {
    const list = isRecord(raw) && Array.isArray(raw.entries) ? raw.entries : Array.isArray(raw) ? raw : [];
    const out: HistoryEntry[] = [];
    for (const item of list) {
        if (!isRecord(item)) continue;
        if (typeof item.id !== 'string' || typeof item.module !== 'string' || typeof item.basePrompt !== 'string') continue;
        const versions = Array.isArray(item.versions)
            ? item.versions.filter((v): v is PromptVersion => isRecord(v) && typeof v.label === 'string' && typeof v.text === 'string')
            : [];
        const active = typeof item.activeVersion === 'number' && item.activeVersion >= -1 && item.activeVersion < versions.length ? item.activeVersion : -1;
        const now = Date.now();
        out.push({
            id: item.id,
            module: item.module,
            title: typeof item.title === 'string' ? item.title : item.basePrompt.slice(0, 60),
            createdAt: typeof item.createdAt === 'number' ? item.createdAt : now,
            updatedAt: typeof item.updatedAt === 'number' ? item.updatedAt : now,
            favorite: item.favorite === true,
            basePrompt: item.basePrompt,
            versions,
            activeVersion: active,
            snapshot: isRecord(item.snapshot) ? item.snapshot : {},
            model: typeof item.model === 'string' ? item.model : undefined,
        });
    }
    return out;
}
export const MAX_HISTORY = 100;

export function currentText(e: Pick<HistoryEntry, 'basePrompt' | 'versions' | 'activeVersion'>): string {
    return e.versions[e.activeVersion]?.text ?? e.basePrompt;
}

// Mantiene los favoritos siempre y recorta lo más antiguo hasta MAX_HISTORY.
export function pruneHistory(entries: HistoryEntry[], max = MAX_HISTORY): HistoryEntry[] {
    const sorted = [...entries].sort((a, b) => b.updatedAt - a.updatedAt);
    if (sorted.length <= max) return sorted;
    const keep = new Set<string>(sorted.filter(e => e.favorite).map(e => e.id));
    for (const e of sorted) {
        if (keep.size >= max) break;
        keep.add(e.id);
    }
    return sorted.filter(e => keep.has(e.id));
}

export function upsertEntry(entries: HistoryEntry[], entry: HistoryEntry): HistoryEntry[] {
    const exists = entries.some(e => e.id === entry.id);
    const next = exists ? entries.map(e => (e.id === entry.id ? entry : e)) : [entry, ...entries];
    return pruneHistory(next);
}

const TITLE_FIELDS = ['objective', 'topic', 'repoUrl', 'projectName', 'name', 'requirements'];

export function deriveTitle(snapshot: Record<string, unknown>, prompt: string, fallback: string): string {
    for (const v of Object.values(snapshot)) {
        if (v && typeof v === 'object' && !Array.isArray(v)) {
            for (const f of TITLE_FIELDS) {
                const val = (v as Record<string, unknown>)[f];
                if (typeof val === 'string' && val.trim()) return clip(val);
            }
        }
    }
    const firstLine = prompt.split('\n').map(l => l.replace(/^[#*\s]+/, '').trim()).find(l => l.length > 3);
    return clip(firstLine || fallback);
}

function clip(s: string, n = 70): string {
    const one = s.replace(/\s+/g, ' ').trim();
    return one.length > n ? one.slice(0, n - 1) + '…' : one;
}
