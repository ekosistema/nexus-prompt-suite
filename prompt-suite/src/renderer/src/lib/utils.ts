import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

function redactSensitive(str: string): string {
    return str
        .replace(/(sk-[a-zA-Z0-9_-]{20,})/g, '[API_KEY_REDACTED]')
        .replace(/(AIza[0-9A-Za-z_-]{35})/g, '[API_KEY_REDACTED]')
        .replace(/\b(gsk_|tgp_v1_|sk-ant-|sk-or-)[A-Za-z0-9_-]{16,}/g, '[API_KEY_REDACTED]')
        .replace(/(x-goog-api-key:\s*)[^\s,;]+/gi, '$1[KEY_REDACTED]')
        .replace(/(Bearer\s+)[^\s,;]+/gi, '$1[TOKEN_REDACTED]')
        .replace(/(x-api-key:\s*)[^\s,;]+/gi, '$1[KEY_REDACTED]')
        .replace(/("key"\s*:\s*")[^"]+/gi, '$1[API_KEY_REDACTED]')
        .replace(/("api_key"\s*:\s*")[^"]+/gi, '$1[API_KEY_REDACTED]')
        .replace(/("apiKey"\s*:\s*")[^"]+/gi, '$1[API_KEY_REDACTED]')
}

function sanitizeArg(arg: unknown): unknown {
    if (typeof arg === 'string') {
        return redactSensitive(arg)
    }
    if (arg instanceof Error) {
        return new Error(redactSensitive(arg.message))
    }
    if (typeof arg === 'object' && arg !== null) {
        try {
            const serialized = JSON.stringify(arg)
            const redacted = redactSensitive(serialized)
            return JSON.parse(redacted)
        } catch {
            return '[Object - could not sanitize]'
        }
    }
    return arg
}

export function safeLog(level: 'log' | 'error' | 'warn', ...args: unknown[]): void {
    if (typeof console === 'undefined') return
    const sanitized = args.map(sanitizeArg)
    console[level](...sanitized)
}

// La salida de la IA se muestra siempre como TEXTO (React escapa el contenido), no como HTML.
// Pasarla por un sanitizador HTML corrompía los prompts: convertía "<" y "&" en entidades y
// eliminaba etiquetas legítimas como <instrucciones>. Solo se quitan las vallas de código externas.
export function stripMarkdownFences(text: string): string {
    return text
        .replace(/^```(?:markdown|md)?[ \t]*\r?\n/, '')
        .replace(/\r?\n```[ \t]*$/, '')
}
