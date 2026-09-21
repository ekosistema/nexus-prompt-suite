import { Sparkles, Terminal, ShieldCheck, BookOpen, Share2, Library, Settings } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type NavItemId = 'genesis' | 'dev' | 'audit' | 'studio' | 'social' | 'templates' | 'settings';

export interface NavConfigItem {
    id: NavItemId;
    labelKey: string;
    icon: LucideIcon;
    hue: string;
}

export const NAV_ITEMS: NavConfigItem[] = [
    { id: 'genesis', labelKey: 'nav.genesis', icon: Sparkles, hue: 'amber' },
    { id: 'dev', labelKey: 'nav.dev', icon: Terminal, hue: 'blue' },
    { id: 'audit', labelKey: 'nav.audit', icon: ShieldCheck, hue: 'sky' },
    { id: 'studio', labelKey: 'nav.studio', icon: BookOpen, hue: 'purple' },
    { id: 'social', labelKey: 'nav.social', icon: Share2, hue: 'pink' },
    { id: 'templates', labelKey: 'nav.templates', icon: Library, hue: 'emerald' },
    { id: 'settings', labelKey: 'nav.settings', icon: Settings, hue: 'gray' },
];

export interface ModuleColorClasses {
    bg: string;
    text: string;
    hover: string;
    border: string;
}

export const MODULE_COLORS: Record<string, ModuleColorClasses> = {
    amber: { bg: 'bg-amber-500', text: 'text-amber-400', hover: 'hover:bg-amber-500/10', border: 'border-amber-500/30' },
    blue: { bg: 'bg-blue-500', text: 'text-blue-400', hover: 'hover:bg-blue-500/10', border: 'border-blue-500/30' },
    sky: { bg: 'bg-sky-500', text: 'text-sky-400', hover: 'hover:bg-sky-500/10', border: 'border-sky-500/30' },
    purple: { bg: 'bg-purple-500', text: 'text-purple-400', hover: 'hover:bg-purple-500/10', border: 'border-purple-500/30' },
    pink: { bg: 'bg-pink-500', text: 'text-pink-400', hover: 'hover:bg-pink-500/10', border: 'border-pink-500/30' },
    emerald: { bg: 'bg-emerald-500', text: 'text-emerald-400', hover: 'hover:bg-emerald-500/10', border: 'border-emerald-500/30' },
};
