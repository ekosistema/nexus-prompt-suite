import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { ChevronDown, X, Plus, Check } from 'lucide-react';
import { cn } from '../../lib/utils';

export type FieldType = 'text' | 'textarea' | 'select' | 'multiselect' | 'toggle' | 'slider' | 'tags' | 'radio-group';

export interface FormFieldOption {
    value: string;
    label: { es: string; en: string };
    description?: { es: string; en: string };
}

export interface FormField {
    id: string;
    type: FieldType;
    label: { es: string; en: string };
    placeholder?: { es: string; en: string };
    helperText?: { es: string; en: string };
    options?: FormFieldOption[];
    required?: boolean;
    defaultValue?: string | boolean | number | string[];
    min?: number;
    max?: number;
    step?: number;
    visible?: (values: Record<string, any>) => boolean;
    dependsOn?: string;
    section?: string;
    icon?: string;
}

interface DynamicFormProps {
    fields: FormField[];
    values: Record<string, any>;
    onChange: (id: string, value: any) => void;
    lang: 'es' | 'en';
}

export function DynamicForm({ fields, values, onChange, lang }: DynamicFormProps) {
    const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({});
    const [tagInputs, setTagInputs] = useState<Record<string, string>>({});
    const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});
    const containerRef = useRef<HTMLDivElement>(null);

    const visibleFields = useMemo(() => {
        return fields.filter(f => {
            if (f.visible) return f.visible(values);
            return true;
        });
    }, [fields, values]);

    const sections = useMemo(() => {
        const sectionMap = new Map<string, FormField[]>();
        for (const field of visibleFields) {
            const section = field.section || '_default';
            if (!sectionMap.has(section)) sectionMap.set(section, []);
            sectionMap.get(section)!.push(field);
        }
        return sectionMap;
    }, [visibleFields]);

    const toggleDropdown = useCallback((id: string) => {
        setOpenDropdowns(prev => {
            const isCurrentlyOpen = prev[id];
            if (isCurrentlyOpen) {
                return { ...prev, [id]: false };
            }
            const next: Record<string, boolean> = {};
            for (const key of Object.keys(prev)) {
                next[key] = false;
            }
            next[id] = true;
            return next;
        });
    }, []);

    const closeAllDropdowns = useCallback(() => {
        setOpenDropdowns({});
    }, []);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const hasOpen = Object.values(openDropdowns).some(Boolean);
            if (!hasOpen) return;
            const closest = target.closest('[data-dropdown-wrapper]');
            if (!closest) {
                closeAllDropdowns();
            }
        };
        document.addEventListener('mousedown', handleClickOutside, true);
        return () => document.removeEventListener('mousedown', handleClickOutside, true);
    }, [openDropdowns, closeAllDropdowns]);

    const toggleSection = (sectionKey: string) => {
        setCollapsedSections(prev => ({
            ...prev,
            [sectionKey]: !prev[sectionKey]
        }));
    };

    const addTag = (fieldId: string) => {
        const tag = tagInputs[fieldId]?.trim();
        if (!tag) return;
        const currentTags = (values[fieldId] as string[]) || [];
        if (!currentTags.includes(tag)) {
            onChange(fieldId, [...currentTags, tag]);
        }
        setTagInputs(prev => ({ ...prev, [fieldId]: '' }));
    };

    const removeTag = (fieldId: string, tag: string) => {
        const currentTags = (values[fieldId] as string[]) || [];
        onChange(fieldId, currentTags.filter(t => t !== tag));
    };

    const renderField = (field: FormField) => {
        const value = values[field.id] ?? field.defaultValue;

        switch (field.type) {
            case 'text':
                return (
                    <input
                        type="text"
                        className="w-full bg-secondary/40 border border-input rounded-md px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                        placeholder={field.placeholder?.[lang]}
                        value={value || ''}
                        onChange={(e) => onChange(field.id, e.target.value)}
                    />
                );

            case 'textarea':
                return (
                    <textarea
                        className="w-full bg-secondary/40 border border-input rounded-md px-3 py-2 text-sm resize-y min-h-[80px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                        placeholder={field.placeholder?.[lang]}
                        value={value || ''}
                        onChange={(e) => onChange(field.id, e.target.value)}
                        rows={4}
                    />
                );

            case 'select': {
                const isOpen = openDropdowns[field.id] || false;
                return (
                    <div className="relative" data-dropdown-wrapper>
                        <button
                            type="button"
                            onClick={() => toggleDropdown(field.id)}
                            className={cn(
                                "w-full bg-secondary/40 border rounded-md px-3 py-2 text-sm text-left flex items-center justify-between hover:bg-secondary/60 transition-colors",
                                isOpen ? "border-primary/50 ring-1 ring-primary/30" : "border-input"
                            )}
                        >
                            <span className={value ? 'text-foreground' : 'text-muted-foreground'}>
                                {value ? field.options?.find(o => o.value === value)?.label[lang] : field.placeholder?.[lang] || 'Select...'}
                            </span>
                            <ChevronDown size={14} className={cn("text-muted-foreground shrink-0 transition-transform duration-200", isOpen && "rotate-180")} />
                        </button>
                        {isOpen && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-xl z-[100] max-h-48 overflow-y-auto">
                                {field.options?.map(opt => (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        onClick={() => { onChange(field.id, opt.value); closeAllDropdowns(); }}
                                        className="w-full text-left px-3 py-2 text-sm hover:bg-secondary/50 transition-colors flex items-center gap-2"
                                    >
                                        {value === opt.value && <Check size={12} className="text-primary shrink-0" />}
                                        <span>{opt.label[lang]}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                );
            }

            case 'multiselect': {
                const selectedValues = (value as string[]) || [];
                const isOpen = openDropdowns[field.id] || false;
                return (
                    <div className="relative" data-dropdown-wrapper>
                        <button
                            type="button"
                            onClick={() => toggleDropdown(field.id)}
                            className={cn(
                                "w-full bg-secondary/40 border rounded-md px-3 py-2 text-sm text-left flex items-center justify-between hover:bg-secondary/60 transition-colors min-h-[36px]",
                                isOpen ? "border-primary/50 ring-1 ring-primary/30" : "border-input"
                            )}
                        >
                            <span className={selectedValues.length > 0 ? 'text-foreground' : 'text-muted-foreground'}>
                                {selectedValues.length > 0
                                    ? selectedValues.map(v => field.options?.find(o => o.value === v)?.label[lang]).filter(Boolean).join(', ')
                                    : field.placeholder?.[lang] || 'Select...'}
                            </span>
                            <ChevronDown size={14} className={cn("text-muted-foreground shrink-0 transition-transform duration-200", isOpen && "rotate-180")} />
                        </button>
                        {isOpen && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-xl z-[100] max-h-48 overflow-y-auto">
                                {field.options?.map(opt => {
                                    const isSelected = selectedValues.includes(opt.value);
                                    return (
                                        <button
                                            key={opt.value}
                                            type="button"
                                            onClick={() => {
                                                const newVal = isSelected
                                                    ? selectedValues.filter(v => v !== opt.value)
                                                    : [...selectedValues, opt.value];
                                                onChange(field.id, newVal);
                                            }}
                                            className="w-full text-left px-3 py-2 text-sm hover:bg-secondary/50 transition-colors flex items-center gap-2"
                                        >
                                            <div className={cn("w-4 h-4 rounded border flex items-center justify-center shrink-0", isSelected ? "bg-primary border-primary" : "border-input")}>
                                                {isSelected && <Check size={10} className="text-primary-foreground" />}
                                            </div>
                                            <span>{opt.label[lang]}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                );
            }

            case 'toggle':
                return (
                    <button
                        type="button"
                        role="switch"
                        aria-checked={!!value}
                        onClick={() => onChange(field.id, !value)}
                        className={cn(
                            "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                            value ? 'bg-primary' : 'bg-secondary'
                        )}
                    >
                        <span className={cn("inline-block h-4 w-4 transform rounded-full bg-white transition-transform", value ? 'translate-x-6' : 'translate-x-1')} />
                    </button>
                );

            case 'slider':
                return (
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-muted-foreground font-mono">{value}</span>
                        </div>
                        <input
                            type="range"
                            min={field.min ?? 0}
                            max={field.max ?? 100}
                            step={field.step ?? 1}
                            value={value ?? field.defaultValue ?? 50}
                            onChange={(e) => onChange(field.id, parseFloat(e.target.value))}
                            className="w-full h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                    </div>
                );

            case 'tags':
                const tags = (value as string[]) || [];
                return (
                    <div className="space-y-2">
                        <div className="flex flex-wrap gap-1.5">
                            {tags.map(tag => (
                                <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-primary/10 text-primary text-xs border border-primary/20">
                                    {tag}
                                    <button type="button" onClick={() => removeTag(field.id, tag)} className="hover:text-destructive transition-colors">
                                        <X size={10} />
                                    </button>
                                </span>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                className="flex-1 bg-secondary/40 border border-input rounded-md px-3 py-1.5 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                                placeholder={field.placeholder?.[lang] || 'Add tag...'}
                                value={tagInputs[field.id] || ''}
                                onChange={(e) => setTagInputs(prev => ({ ...prev, [field.id]: e.target.value }))}
                                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(field.id); } }}
                            />
                            <button
                                type="button"
                                onClick={() => addTag(field.id)}
                                className="p-1.5 rounded-md bg-secondary/50 hover:bg-secondary border border-border transition-colors"
                            >
                                <Plus size={14} />
                            </button>
                        </div>
                    </div>
                );

            case 'radio-group':
                return (
                    <div className="grid grid-cols-2 gap-2">
                        {field.options?.map(opt => {
                            const isSelected = value === opt.value;
                            return (
                                <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => onChange(field.id, opt.value)}
                                    className={cn(
                                        "relative flex cursor-pointer rounded-lg border-2 p-3 outline-none transition-all focus-within:ring-2 focus-within:ring-primary/40",
                                        isSelected ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                                    )}
                                >
                                    <div>
                                        <div className="font-medium text-sm">{opt.label[lang]}</div>
                                        {opt.description && <div className="text-[10px] text-muted-foreground mt-0.5">{opt.description[lang]}</div>}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="space-y-6" ref={containerRef}>
            {Array.from(sections.entries()).map(([sectionKey, sectionFields]) => (
                <div key={sectionKey} className="space-y-4">
                    {sectionKey !== '_default' && (
                        <button
                            type="button"
                            onClick={() => toggleSection(sectionKey)}
                            className="flex items-center gap-2 w-full text-left group"
                        >
                            <ChevronDown
                                size={14}
                                className={cn(
                                    "text-muted-foreground shrink-0 transition-transform duration-200",
                                    collapsedSections[sectionKey] ? "-rotate-90" : "rotate-0"
                                )}
                            />
                            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider group-hover:text-foreground transition-colors">
                                {sectionKey}
                            </h3>
                            <span className="text-[10px] text-muted-foreground/50 ml-auto">
                                {collapsedSections[sectionKey] ? sectionFields.length + ' campos' : ''}
                            </span>
                        </button>
                    )}
                    {!collapsedSections[sectionKey] && sectionFields.map(field => (
                        <div key={field.id} className="space-y-1.5">
                            <label className="text-xs font-medium opacity-80 flex items-center gap-2">
                                {field.icon && <span>{field.icon}</span>}
                                {field.label[lang]}
                                {field.required && <span className="text-destructive">*</span>}
                            </label>
                            {renderField(field)}
                            {field.helperText && (
                                <p className="text-[11px] text-muted-foreground/80 leading-relaxed">
                                    {field.helperText[lang]}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}
