import type { FormField } from '../../components/ui/DynamicForm';

type Lang = 'es' | 'en';

// Quita emojis/símbolos iniciales de una etiqueta ("📦 Librería" → "Librería").
const clean = (s: string) => s.replace(/^[^\p{L}\p{N}]+/u, '').trim();

// Etiqueta legible de una opción de un campo (en vez de insertar el id interno en el prompt).
export function optionLabel(fields: FormField[], fieldId: string, value: unknown, lang: Lang): string {
    const field = fields.find(f => f.id === fieldId);
    const opt = field?.options?.find(o => o.value === value);
    return opt ? clean(opt.label[lang]) : String(value ?? '');
}

export function optionLabels(fields: FormField[], fieldId: string, values: unknown, lang: Lang): string[] {
    return (Array.isArray(values) ? values : []).map(v => optionLabel(fields, fieldId, v, lang));
}
