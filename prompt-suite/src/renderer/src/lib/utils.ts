import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import DOMPurify from "dompurify"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

function redactSensitive(str: string): string {
    return str
        .replace(/(sk-[a-zA-Z0-9_-]{20,})/g, '[API_KEY_REDACTED]')
        .replace(/(AIza[0-9A-Za-z_-]{35})/g, '[API_KEY_REDACTED]')
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

export function sanitizeAIOutput(text: string): string {
    return DOMPurify.sanitize(text, {
        ALLOWED_TAGS: [
            'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
            'p', 'br', 'hr',
            'ul', 'ol', 'li',
            'strong', 'em', 'b', 'i', 'u', 's', 'del',
            'a', 'img',
            'code', 'pre',
            'blockquote',
            'table', 'thead', 'tbody', 'tr', 'th', 'td',
            'span', 'div',
        ],
        ALLOWED_ATTR: [
            'href', 'target', 'rel', 'title',
            'src', 'alt', 'width', 'height',
            'class', 'id',
        ],
        ALLOW_DATA_ATTR: false,
        ALLOWED_URI_REGEXP: /^(?:(?:https?|ftp|mailto|tel):|[^a-z]|[a-z+.-]+(?:[^a-z+.-:]|$))/i,
    })
}
