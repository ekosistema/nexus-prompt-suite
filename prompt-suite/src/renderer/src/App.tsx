import { useState, lazy, Suspense, useEffect, useCallback } from 'react'
import { AppProvider, useApp } from './contexts/AppContext'
import { Layout } from './components/Layout'
import { NavItem } from './components/Sidebar'
import { PromptSuite, SuiteTab } from './features/suite/PromptSuite'
import { LoadingSpinner } from './components/ui/LoadingSpinner'
import { SettingsDashboard } from './components/SettingsDashboard'

function AppContent(): JSX.Element {
    const [tab, setTab] = useState<NavItem>('genesis')
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
    const { lang, isLoadingSettings } = useApp()

    const isSuiteTab = (t: NavItem): t is SuiteTab => {
        return ['genesis', 'dev', 'audit', 'studio', 'social', 'templates'].includes(t);
    }

    if (isLoadingSettings) {
        return (
            <div className="flex h-screen w-full bg-background items-center justify-center">
                <LoadingSpinner size="lg" label="Loading settings..." />
            </div>
        )
    }

    const inputClass = "w-full bg-secondary/50 border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all";
    const labelClass = "text-sm font-medium";

    return (
        <Layout
            currentTab={tab}
            onTabChange={setTab}
            lang={lang}
            sidebarCollapsed={sidebarCollapsed}
            onToggleSidebar={() => setSidebarCollapsed(prev => !prev)}
        >
            {isSuiteTab(tab) && (
                <Suspense fallback={
                    <div className="flex items-center justify-center h-full">
                        <LoadingSpinner size="lg" label="Loading workspace..." />
                    </div>
                }>
                    <PromptSuite 
                        activeTab={tab} 
                        lang={lang} 
                        onTabChange={setTab} 
                    />
                </Suspense>
            )}

            {tab === 'settings' && (
                <SettingsDashboard />
            )}
        </Layout>
    )
}

function App(): JSX.Element {
    return (
        <AppProvider>
            <AppContent />
        </AppProvider>
    )
}

export default App
