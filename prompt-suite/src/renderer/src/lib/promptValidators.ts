// Detecta placeholders sin sustituir `{{NOMBRE}}` (EXCLUYE LANG_OUTPUT si se usa).
export function findOrphanVars(prompt: string): string[] {
    const vars = new Set<string>();
    const regex = /\{\{([A-Za-z0-9_]+)\}\}/g;
    let match: RegExpExecArray | null;
    while ((match = regex.exec(prompt)) !== null) {
        if (match[1] !== 'LANG_OUTPUT') {
            vars.add(match[1]);
        }
    }
    return Array.from(vars);
}