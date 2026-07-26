import { useMemo, KeyboardEvent } from 'react';
import { open } from '@tauri-apps/plugin-shell';
import { Settings, Lightbulb, Terminal, ShieldCheck, BookOpen, Share2, MessageSquare, Library, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';
import { t, Lang } from '../lib/i18n';

import logo from '../../favicon.png';

export type NavItem = 'genesis' | 'dev' | 'audit' | 'studio' | 'social' | 'templates' | 'chat' | 'settings';
 
interface SidebarProps {
    current: NavItem;
    onChange: (item: NavItem) => void;
    lang: Lang;
    collapsed: boolean;
    onToggleCollapse: () => void;
}
 
export function Sidebar({ current, onChange, lang, collapsed, onToggleCollapse }: SidebarProps) {
    const menu = useMemo(() => [
        { id: 'genesis' as const, label: t('nav.genesis', lang), icon: Lightbulb, color: 'amber' },
        { id: 'dev' as const, label: t('nav.dev', lang), icon: Terminal, color: 'blue' },
        { id: 'audit' as const, label: t('nav.audit', lang), icon: ShieldCheck, color: 'sky' },
        { id: 'studio' as const, label: t('nav.studio', lang), icon: BookOpen, color: 'purple' },
        { id: 'social' as const, label: t('nav.social', lang), icon: Share2, color: 'pink' },
        { id: 'templates' as const, label: t('nav.templates', lang), icon: Library, color: 'emerald' },
        { id: 'chat' as const, label: 'Chat Local', icon: MessageSquare, color: 'indigo' },
    ], [lang]);

    const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>, item: NavItem) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onChange(item);
        }
    };

    return (
        <aside
            role="navigation"
            aria-label="Main navigation"
            data-tauri-drag-region
            className={cn(
                "bg-card/50 border-r border-border h-full flex flex-col backdrop-blur-xl z-20 transition-all duration-300",
                collapsed ? "w-14 pt-10 px-2" : "w-64 pt-12 px-3"
            )}
        >
            <div className={cn("mb-10 flex flex-col items-center", collapsed && "mb-6")}>
                <img 
                    src={logo} 
                    alt="App Logo" 
                    className={cn(
                        "rounded-none shadow-none grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300",
                        collapsed ? "w-8 h-8" : "w-14 h-14"
                    )}
                />
            </div>

            {!collapsed && (
                <div className="mb-4 px-4">
                    <h2 className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-[0.2em]">Workspace</h2>
                </div>
            )}

            <nav aria-label="Workspace sections" className={cn("-mx-3 flex-1", collapsed && "-mx-2")}>
                {menu.map((item) => {
                    const Icon = item.icon;
                    const isActive = current === item.id;

                    const colorClasses = {
                        amber: isActive ? 'bg-amber-600 text-white' : 'text-muted-foreground hover:bg-amber-600/10 hover:text-amber-400',
                        blue: isActive ? 'bg-blue-600 text-white' : 'text-muted-foreground hover:bg-blue-600/10 hover:text-blue-400',
                        sky: isActive ? 'bg-sky-600 text-white' : 'text-muted-foreground hover:bg-sky-600/10 hover:text-sky-400',
                        purple: isActive ? 'bg-purple-600 text-white' : 'text-muted-foreground hover:bg-purple-600/10 hover:text-purple-400',
                        pink: isActive ? 'bg-pink-600 text-white' : 'text-muted-foreground hover:bg-pink-600/10 hover:text-pink-400',
                        emerald: isActive ? 'bg-emerald-600 text-white' : 'text-muted-foreground hover:bg-emerald-600/10 hover:text-emerald-400',
                        indigo: isActive ? 'bg-indigo-600 text-white' : 'text-muted-foreground hover:bg-indigo-600/10 hover:text-indigo-400',
                    };

                    return (
                        <button
                            key={item.id}
                            onClick={() => onChange(item.id)}
                            onKeyDown={(e) => handleKeyDown(e, item.id)}
                            aria-current={isActive ? 'page' : undefined}
                            title={collapsed ? item.label : undefined}
                            className={cn(
                                "flex items-center transition-all duration-200 w-full",
                                collapsed
                                    ? "justify-center px-0 py-2.5"
                                    : "gap-3 px-6 py-2.5",
                                "text-sm font-medium",
                                colorClasses[item.color as keyof typeof colorClasses]
                            )}
                        >
                            <Icon size={18} aria-hidden="true" />
                            {!collapsed && item.label}
                        </button>
                    )
                })}
            </nav>

            <div className={cn("border-t border-border/50", collapsed ? "mx-0 mt-auto pt-3" : "-mx-3 mt-auto pt-4")}>
                <button
                    onClick={() => onChange('settings')}
                    onKeyDown={(e) => handleKeyDown(e, 'settings')}
                    aria-current={current === 'settings' ? 'page' : undefined}
                    title={collapsed ? t('nav.settings', lang) : undefined}
                    className={cn(
                        "flex items-center font-medium transition-all duration-200 w-full",
                        collapsed
                            ? "justify-center px-0 py-2.5 mb-2"
                            : "gap-3 px-6 py-2.5 mb-4",
                        "text-sm",
                        current === 'settings'
                            ? "bg-gray-600 text-white"
                            : "text-muted-foreground hover:bg-gray-600/10 hover:text-gray-400"
                    )}
                >
                    <Settings size={18} aria-hidden="true" />
                    {!collapsed && t('nav.settings', lang)}
                </button>

                {!collapsed && (
                    <>
                        <div className="border-t border-border/50 pt-4 px-3 pb-4">
                            <p className="text-[10px] text-muted-foreground text-center leading-relaxed" role="contentinfo">
                                Nexus Prompt Suite v1.0.1
                                <br />
                                <button
                                    onClick={() => open('https://celerolab.com?utm_source=nexus-prompt-suite&utm_medium=desktop-app&utm_campaign=credits')}
                                    className="opacity-50 hover:opacity-100 transition-opacity underline underline-offset-2 cursor-pointer bg-transparent border-none p-0 m-0 font-inherit"
                                >
                                    {t('nav.credits', lang)}
                                </button>
                            </p>
                        </div>
                    </>
                )}
            </div>

            <button
                onClick={onToggleCollapse}
                className={cn(
                    "absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-card border border-border flex items-center justify-center hover:bg-secondary transition-colors z-30",
                    "text-muted-foreground hover:text-foreground"
                )}
                aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
                {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
            </button>
        </aside>
    );
}
