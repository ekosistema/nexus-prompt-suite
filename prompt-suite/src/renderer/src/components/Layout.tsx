import { ReactNode } from 'react';
import { Sidebar, NavItem } from './Sidebar';
import { Lang } from '../lib/i18n';

interface LayoutProps {
    children: ReactNode;
    currentTab: NavItem;
    onTabChange: (tab: NavItem) => void;
    lang: Lang;
    sidebarCollapsed: boolean;
    onToggleSidebar: () => void;
}

export function Layout({ children, currentTab, onTabChange, lang, sidebarCollapsed, onToggleSidebar }: LayoutProps) {
    return (
        <div className="flex h-screen w-full bg-background text-foreground overflow-hidden">
            <Sidebar
                current={currentTab}
                onChange={onTabChange}
                lang={lang}
                collapsed={sidebarCollapsed}
                onToggleCollapse={onToggleSidebar}
            />

            <main
                role="main"
                aria-label="Main content"
                className="flex-1 w-full h-full overflow-hidden relative"
            >
                <div className="w-full h-full p-4 sm:p-5 md:p-6 lg:p-8 xl:p-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {children}
                </div>
            </main>
        </div>
    );
}
