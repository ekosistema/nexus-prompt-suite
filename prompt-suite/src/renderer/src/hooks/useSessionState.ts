import { useState, useCallback, Dispatch, SetStateAction } from 'react';

// Cache en memoria que sobrevive al desmontaje de los componentes (cambio de vista
// Form/Prompt/Split o de módulo). Se vacía al recargar la aplicación.
const store = new Map<string, unknown>();

export function getSessionValue<T>(key: string): T | undefined {
    return store.get(key) as T | undefined;
}

export function setSessionValue(key: string, value: unknown): void {
    store.set(key, value);
}

export function useSessionState<T>(key: string, initial: T): [T, Dispatch<SetStateAction<T>>] {
    const [value, setValue] = useState<T>(() => (store.has(key) ? (store.get(key) as T) : initial));

    const set: Dispatch<SetStateAction<T>> = useCallback((next) => {
        setValue(prev => {
            const resolved = typeof next === 'function' ? (next as (p: T) => T)(prev) : next;
            store.set(key, resolved);
            return resolved;
        });
    }, [key]);

    return [value, set];
}
