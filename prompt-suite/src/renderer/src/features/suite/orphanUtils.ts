import { findOrphanVars } from '../../lib/promptValidators';

// Combina las variables huérfanas del prompt estático y de la salida optimizada por la IA.
// findOrphanVars ya excluye LANG_OUTPUT; esta unión deduplica preservando el orden de aparición.
export function collectOrphanVars(staticPrompt: string, aiResult?: string | null): string[] {
    const orphans = findOrphanVars(staticPrompt);
    for (const v of findOrphanVars(aiResult || '')) {
        if (!orphans.includes(v)) {
            orphans.push(v);
        }
    }
    return orphans;
}