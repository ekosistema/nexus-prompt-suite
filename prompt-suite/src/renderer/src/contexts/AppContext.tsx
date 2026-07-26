import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Lang } from '../lib/i18n';
import { invoke } from '@tauri-apps/api/core';
import { aiService, ProviderInfo } from '../services/ai';
import { safeLog } from '../lib/utils';

export interface Settings {
    lang: Lang;
    aiProvider: string;
    endpoint: string;
    model: string;
    temperature: number;
    numCtx: number;
    hasApiKey: boolean;
    streaming: boolean;
    ollamaUrl?: string;
    ollamaModel?: string;
    openaiModel?: string;
    openrouterModel?: string;
}

interface AppContextType {
    lang: Lang;
    setLang: (lang: Lang) => void;
    settings: Settings;
    setSettings: (updater: Settings | ((prev: Settings) => Settings)) => Promise<void>;
    isLoadingSettings: boolean;
    providers: ProviderInfo[];
    isLoadingProviders: boolean;
    availableModels: string[];
    isLoadingModels: boolean;
    refreshModels: () => Promise<void>;
}

const AppContext = createContext<AppContextType | null>(null);

interface AppProviderProps {
    children: ReactNode;
}

function migrateLegacySettings(loaded: Record<string, unknown>): Partial<Settings> {
    const provider = (loaded.aiProvider as string) || 'ollama';
    
    // Migrate legacy provider names
    let normalizedProvider = provider;
    
    // Resolve endpoint
    let endpoint = (loaded.endpoint as string) || '';
    if (!endpoint && loaded.ollamaUrl) {
        endpoint = loaded.ollamaUrl as string;
    }
    
    // Resolve model based on provider
    let model = (loaded.model as string) || '';
    if (!model) {
        if (provider === 'ollama' && loaded.ollamaModel) {
            model = loaded.ollamaModel as string;
        } else if (provider === 'openai' && loaded.openaiModel) {
            model = loaded.openaiModel as string;
        } else if (provider === 'openrouter' && loaded.openrouterModel) {
            model = loaded.openrouterModel as string;
        }
    }

    return {
        aiProvider: normalizedProvider,
        endpoint,
        model,
    };
}

export function AppProvider({ children }: AppProviderProps) {
    const [settings, setSettingsState] = useState<Settings>({
        lang: 'es',
        aiProvider: 'ollama',
        endpoint: 'http://localhost:11434',
        model: 'llama3',
        temperature: 0.7,
        numCtx: 4096,
        hasApiKey: false,
        streaming: true,
    });
    const [isLoadingSettings, setIsLoadingSettings] = useState(true);
    const [providers, setProviders] = useState<ProviderInfo[]>([]);
    const [isLoadingProviders, setIsLoadingProviders] = useState(true);
    const [availableModels, setAvailableModels] = useState<string[]>([]);
    const [isLoadingModels, setIsLoadingModels] = useState(false);

    // Load providers on mount
    useEffect(() => {
        const loadProviders = async () => {
            try {
                const loadedProviders = await aiService.getAvailableProviders();
                setProviders(loadedProviders);
            } catch (err) {
                safeLog('error', 'Failed to load providers');
            } finally {
                setIsLoadingProviders(false);
            }
        };
        loadProviders();
    }, []);

    // Load settings on mount
    useEffect(() => {
        const loadSettings = async () => {
            try {
                setIsLoadingSettings(true);
                const loadedSettings = await invoke('get_settings') as Record<string, unknown>;
                
                const migration = migrateLegacySettings(loadedSettings);
                
                const secureApiKey = await aiService.getProviderApiKey(
                    (loadedSettings.aiProvider as string) || 'ollama'
                );

                setSettingsState({
                    lang: (loadedSettings.lang as Lang) || 'es',
                    aiProvider: migration.aiProvider || 'ollama',
                    endpoint: migration.endpoint || 'http://localhost:11434',
                    model: migration.model || 'llama3',
                    temperature: (loadedSettings.temperature as number) ?? 0.7,
                    numCtx: (loadedSettings.numCtx as number) || 4096,
                    hasApiKey: !!secureApiKey,
                    streaming: (loadedSettings.streaming as boolean) ?? true,
                    ollamaUrl: loadedSettings.ollamaUrl as string | undefined,
                    ollamaModel: loadedSettings.ollamaModel as string | undefined,
                    openaiModel: loadedSettings.openaiModel as string | undefined,
                    openrouterModel: loadedSettings.openrouterModel as string | undefined,
                });
            } catch (err) {
                safeLog('error', 'Failed to load settings');
            } finally {
                setIsLoadingSettings(false);
            }
        };
        loadSettings();
    }, []);

    // Refresh models when provider, endpoint, or apiKey changes
    useEffect(() => {
        refreshModels();
    }, [settings.aiProvider, settings.endpoint, settings.hasApiKey]);

    const refreshModels = async () => {
        const provider = providers.find(p => p.id === settings.aiProvider);
        if (!provider) return;

        // For providers that don't need a key and have no models endpoint, skip
        if (provider.models_endpoint === '' && provider.default_models.length > 0) {
            setAvailableModels(provider.default_models);
            return;
        }

        setIsLoadingModels(true);
        try {
            const models = await aiService.listProviderModels(
                settings.aiProvider,
                settings.endpoint,
                undefined
            );
            setAvailableModels(models.length > 0 ? models : provider.default_models);
            
            // Auto-select first model if current model is not in the list
            if (models.length > 0 && !models.includes(settings.model)) {
                setSettingsState(prev => ({ ...prev, model: models[0] }));
            }
        } catch (err) {
            safeLog('error', 'Failed to load models');
            setAvailableModels(provider.default_models);
        } finally {
            setIsLoadingModels(false);
        }
    };

    const setLang = async (newLang: Lang) => {
        setSettings(prev => ({ ...prev, lang: newLang }));
    };

    const setSettings = async (updater: Settings | ((prev: Settings) => Settings)) => {
        const newSettings = typeof updater === 'function'
            ? (updater as (prev: Settings) => Settings)(settings)
            : updater;

        setSettingsState(newSettings);
        try {
            await invoke('save_settings', { settings: newSettings });
        } catch (err) {
            safeLog('error', 'Failed to save settings');
        }
    };

    const value: AppContextType = {
        lang: settings.lang,
        setLang,
        settings,
        setSettings,
        isLoadingSettings,
        providers,
        isLoadingProviders,
        availableModels,
        isLoadingModels,
        refreshModels,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextType {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within AppProvider');
    }
    return context;
}
