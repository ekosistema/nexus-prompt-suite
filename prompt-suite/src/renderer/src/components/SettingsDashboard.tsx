import { useState, useCallback, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { t } from '../lib/i18n';
import { cn, safeLog } from '../lib/utils';
import { aiService } from '../services/ai';
import { RefreshCw, Zap, Eye, EyeOff, Globe, Cpu, Thermometer, Database, Shield, Key, Server } from 'lucide-react';

export function SettingsDashboard(): JSX.Element {
    const { lang, setLang, settings, setSettings, providers, availableModels, isLoadingModels, refreshModels } = useApp();
    const [modelsError, setModelsError] = useState<string | null>(null);
    const [showApiKey, setShowApiKey] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [localApiKey, setLocalApiKey] = useState('');
    const [keySaved, setKeySaved] = useState(false);

    const currentProvider = providers.find(p => p.id === settings.aiProvider);

    useEffect(() => {
        setKeySaved(settings.hasApiKey);
        setLocalApiKey('');
        setShowApiKey(false);
    }, [settings.aiProvider, settings.hasApiKey]);

    const updateSetting = <K extends keyof typeof settings>(key: K, value: (typeof settings)[K]) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    const handleSaveApiKey = async () => {
        if (!localApiKey.trim()) return;
        try {
            await aiService.saveProviderApiKey(settings.aiProvider, localApiKey.trim());
            setSettings(prev => ({ ...prev, hasApiKey: true }));
            setLocalApiKey('');
            setKeySaved(true);
            setTimeout(() => setKeySaved(false), 2000);
        } catch (err) {
            safeLog('error', 'Failed to save API key:', err);
        }
    };

    const handleClearApiKey = async () => {
        try {
            await aiService.saveProviderApiKey(settings.aiProvider, '');
            setSettings(prev => ({ ...prev, hasApiKey: false }));
            setLocalApiKey('');
            setKeySaved(false);
        } catch (err) {
            safeLog('error', 'Failed to clear API key:', err);
        }
    };

    const handleProviderChange = async (providerId: string) => {
        const provider = providers.find(p => p.id === providerId);
        if (!provider) return;

        const storedKey = await aiService.getProviderApiKey(providerId);

        setSettings(prev => ({
            ...prev,
            aiProvider: providerId,
            endpoint: provider.default_url,
            model: provider.default_models[0] || '',
            hasApiKey: !!storedKey,
        }));
    };

    const fetchModels = useCallback(async () => {
        setRefreshing(true);
        setModelsError(null);
        try {
            await refreshModels();
        } catch (err: any) {
            setModelsError(err.message || t('settings.ollama_error', lang as any) || 'Cannot connect');
        } finally {
            setRefreshing(false);
        }
    }, [refreshModels]);

    useEffect(() => {
        if (currentProvider && currentProvider.models_endpoint !== '' && currentProvider.default_models.length === 0) {
            fetchModels();
        }
    }, [settings.aiProvider]);

    const inputClass = "w-full bg-secondary/40 border border-input rounded-md px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 transition-all";
    const labelClass = "text-sm font-medium mb-1.5 block opacity-85";

    return (
        <div className="h-full overflow-y-auto pr-2 pb-6">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold tracking-tight">{t('settings.title', lang)}</h1>
                <p className="text-sm text-muted-foreground mt-1">{t('settings.desc', lang)}</p>
            </div>

            {/* FullHD Grid Layout */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                {/* Left Column */}
                <div className="space-y-5">
                    {/* Language */}
                    <section className="bg-card/50 border border-border rounded-xl p-5 shadow-sm hover:border-primary/20 transition-colors">
                        <h2 className="font-semibold text-base flex items-center gap-2 mb-4">
                            <Globe size={18} className="text-primary" />
                            {t('settings.lang', lang)}
                        </h2>
                        
                        <div className="grid grid-cols-2 gap-3">
                            <label 
                                className={`relative flex cursor-pointer rounded-lg border-2 p-4 outline-none transition-all focus-within:ring-2 focus-within:ring-primary/40 ${lang === 'en' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}
                            >
                                <input 
                                    type="radio" 
                                    name="app-lang" 
                                    value="en"
                                    checked={lang === 'en'}
                                    onChange={() => setLang('en')}
                                    className="sr-only" 
                                />
                                <div>
                                    <div className="font-bold">English</div>
                                    <div className="text-xs text-muted-foreground mt-0.5">United States</div>
                                </div>
                            </label>

                            <label 
                                className={`relative flex cursor-pointer rounded-lg border-2 p-4 outline-none transition-all focus-within:ring-2 focus-within:ring-primary/40 ${lang === 'es' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}
                            >
                                <input 
                                    type="radio" 
                                    name="app-lang" 
                                    value="es"
                                    checked={lang === 'es'}
                                    onChange={() => setLang('es')}
                                    className="sr-only" 
                                />
                                <div>
                                    <div className="font-bold">Español</div>
                                    <div className="text-xs text-muted-foreground mt-0.5">España / Latam</div>
                                </div>
                            </label>
                        </div>
                    </section>

                    {/* AI Provider */}
                    <section className="bg-card/50 border border-border rounded-xl p-5 shadow-sm hover:border-primary/20 transition-colors">
                        <h2 className="font-semibold text-base flex items-center gap-2 mb-4">
                            <Cpu size={18} className="text-primary" />
                            {t('settings.ai_backend', lang)}
                        </h2>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label htmlFor="ai-provider" className={labelClass}>{t('settings.provider', lang)}</label>
                                <select
                                    id="ai-provider"
                                    className={inputClass}
                                    value={settings.aiProvider}
                                    onChange={(e) => handleProviderChange(e.target.value)}
                                >
                                    {providers.map(p => (
                                        <option key={p.id} value={p.id}>{p.icon} {p.name} ({p.cost_tier})</option>
                                    ))}
                                </select>
                                {currentProvider && (
                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                        {currentProvider.description}
                                    </p>
                                )}
                            </div>

                            {currentProvider && (
                                <div className="space-y-4 border-t border-border pt-4">
                                    <div className="space-y-2">
                                        <label htmlFor="provider-endpoint" className={labelClass}>
                                            <Server size={14} className="inline mr-1.5 opacity-60" />
                                            {t('settings.ollama_endpoint', lang)}
                                        </label>
                                        <input
                                            id="provider-endpoint"
                                            type="url"
                                            className={inputClass + ' font-mono text-xs'}
                                            value={settings.endpoint}
                                            onChange={(e) => updateSetting('endpoint', e.target.value)}
                                            placeholder={currentProvider.default_url}
                                        />
                                    </div>

                                    {(currentProvider.needs_api_key || currentProvider.supports_api_key) && (
                                        <div className="space-y-2">
                                            <label htmlFor="provider-key" className={labelClass}>
                                                <Key size={14} className="inline mr-1.5 opacity-60" />
                                                {t('settings.api_key', lang)}{currentProvider.supports_api_key && !currentProvider.needs_api_key && ' (opcional)'}
                                                {settings.hasApiKey && (
                                                    <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-green-500/10 text-green-400 border border-green-500/30">
                                                        Guardada
                                                    </span>
                                                )}
                                            </label>
                                            {!settings.hasApiKey ? (
                                                <div className="relative">
                                                    <input
                                                        id="provider-key"
                                                        type={showApiKey ? 'text' : 'password'}
                                                        className={inputClass + ' font-mono pr-10'}
                                                        value={localApiKey}
                                                        onChange={(e) => setLocalApiKey(e.target.value)}
                                                        placeholder="sk-..."
                                                        autoComplete="off"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowApiKey(!showApiKey)}
                                                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground transition-colors"
                                                    >
                                                        {showApiKey ? <EyeOff size={14} /> : <Eye size={14} />}
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2 p-2.5 rounded-md bg-green-500/5 border border-green-500/20">
                                                    <span className="text-xs text-green-400 flex-1">
                                                        Clave almacenada de forma segura en el keychain del sistema
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={handleClearApiKey}
                                                        className="text-xs px-2 py-1 rounded bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                                                    >
                                                        Eliminar
                                                    </button>
                                                </div>
                                            )}
                                            {!settings.hasApiKey && localApiKey.trim() && (
                                                <button
                                                    type="button"
                                                    onClick={handleSaveApiKey}
                                                    className="w-full mt-1.5 flex items-center justify-center gap-1.5 py-1.5 rounded-md bg-primary/10 hover:bg-primary/20 text-primary text-xs font-medium border border-primary/30 transition-all"
                                                >
                                                    <Key size={12} />
                                                    {keySaved ? 'Guardada' : 'Guardar en keychain'}
                                                </button>
                                            )}
                                            {currentProvider.docs_url && (
                                                <p className="text-xs text-muted-foreground leading-relaxed mt-1.5">
                                                    {t('settings.get_key', lang)}{' '}
                                                    <a href={currentProvider.docs_url} target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-4">
                                                        {currentProvider.docs_url.replace(/^https?:\/\//, '')}
                                                    </a>
                                                </p>
                                            )}
                                            {currentProvider.id === 'ollama' && (
                                                <p className="text-xs text-muted-foreground leading-relaxed mt-1.5">
                                                    🖥️ Ollama debe estar instalado y corriendo. Ejecuta `ollama serve` en tu terminal.
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <label htmlFor="provider-model" className={labelClass}>{t('settings.model', lang)}</label>
                                            {currentProvider.models_endpoint !== '' && (
                                                <button
                                                    type="button"
                                                    onClick={fetchModels}
                                                    disabled={refreshing}
                                                    className="text-xs px-2.5 py-1.5 rounded-md bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 transition-all disabled:opacity-50 flex items-center gap-1.5 font-medium"
                                                >
                                                    {refreshing ? (
                                                        <>
                                                            <RefreshCw size={12} className="animate-spin" />
                                                            {t('settings.connecting', lang)}
                                                        </>
                                                    ) : (
                                                        <>{t('settings.refresh', lang)}</>
                                                    )}
                                                </button>
                                            )}
                                        </div>

                                        {modelsError && (
                                            <div role="alert" className="text-xs text-destructive bg-destructive/10 border border-destructive/30 rounded-md px-3 py-2.5 leading-relaxed">
                                                ⚠️ {modelsError}
                                                <span className="ml-1 text-muted-foreground">— Using default models.</span>
                                            </div>
                                        )}

                                        {availableModels.length > 0 ? (
                                            <select
                                                id="provider-model"
                                                className={inputClass}
                                                value={settings.model}
                                                onChange={(e) => updateSetting('model', e.target.value)}
                                            >
                                                {availableModels.map((m) => (
                                                    <option key={m} value={m}>{m}</option>
                                                ))}
                                            </select>
                                        ) : (
                                            <input
                                                id="provider-model"
                                                type="text"
                                                className={inputClass}
                                                value={settings.model}
                                                onChange={(e) => updateSetting('model', e.target.value)}
                                                placeholder={currentProvider.default_models[0] || 'model-name'}
                                            />
                                        )}

                                        {settings.aiProvider === 'openrouter' && (
                                            <p className="text-xs text-muted-foreground leading-relaxed mt-1.5">
                                                {t('settings.browse_models', lang)}{' '}
                                                <a href="https://openrouter.ai/models" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-4">
                                                    openrouter.ai/models
                                                </a>
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>
                </div>

                {/* Right Column */}
                <div className="space-y-5">
                    {/* Generation Parameters */}
                    <section className="bg-card/50 border border-border rounded-xl p-5 shadow-sm hover:border-primary/20 transition-colors">
                        <h2 className="font-semibold text-base flex items-center gap-2 mb-4">
                            <Zap size={18} className="text-primary" />
                            {t('settings.generation', lang) || 'Generation Parameters'}
                        </h2>

                        <div className="space-y-5">
                            {/* Streaming */}
                            <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                                <label htmlFor="streaming-toggle" className="text-sm font-medium flex items-center gap-2">
                                    <Zap size={14} className="text-primary" />
                                    {t('settings.streaming', lang)}
                                </label>
                                <button
                                    id="streaming-toggle"
                                    type="button"
                                    role="switch"
                                    aria-checked={settings.streaming}
                                    onClick={() => updateSetting('streaming', !settings.streaming)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${settings.streaming ? 'bg-primary' : 'bg-secondary'}`}
                                >
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.streaming ? 'translate-x-6' : 'translate-x-1'}`} />
                                </button>
                            </div>

                            {/* Temperature */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label htmlFor="temperature-slider" className="text-sm font-medium flex items-center gap-2">
                                        <Thermometer size={14} className="opacity-60" />
                                        {t('settings.temperature', lang)}
                                    </label>
                                    <span className="text-sm font-mono font-bold bg-secondary/50 px-2.5 py-0.5 rounded" aria-hidden="true">{settings.temperature}</span>
                                </div>
                                <input
                                    id="temperature-slider"
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.05"
                                    className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-shadow"
                                    value={settings.temperature}
                                    onChange={(e) => updateSetting('temperature', parseFloat(e.target.value))}
                                />
                                <div className="flex justify-between text-[10px] text-muted-foreground">
                                    <span>Precise</span>
                                    <span>Creative</span>
                                </div>
                            </div>

                            {/* Context Size */}
                            {(currentProvider?.is_openai_compat && settings.aiProvider !== 'ollama') || settings.aiProvider === 'ollama' ? (
                                <div className="space-y-2">
                                    <label htmlFor="context-size" className="text-sm font-medium flex items-center gap-2">
                                        <Database size={14} className="opacity-60" />
                                        {t('settings.context_size', lang)}
                                    </label>
                                    <input
                                        id="context-size"
                                        type="number"
                                        className={inputClass + ' font-mono'}
                                        value={settings.numCtx}
                                        onChange={(e) => updateSetting('numCtx', parseInt(e.target.value))}
                                        placeholder="4096"
                                        min="512"
                                        max="131072"
                                    />
                                    <p className="text-[10px] text-muted-foreground leading-tight">{t('settings.context_hint', lang)}</p>
                                </div>
                            ) : null}
                        </div>
                    </section>

                    {/* Connection Status */}
                    <section className="bg-card/50 border border-border rounded-xl p-5 shadow-sm hover:border-primary/20 transition-colors">
                        <h2 className="font-semibold text-base flex items-center gap-2 mb-4">
                            <Shield size={18} className="text-primary" />
                            Connection Status
                        </h2>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                                <div>
                                    <div className="text-sm font-medium">Provider</div>
                                    <div className="text-xs text-muted-foreground">{currentProvider?.name || settings.aiProvider}</div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className={cn(
                                        "w-2 h-2 rounded-full",
                                        settings.endpoint ? "bg-green-500" : "bg-yellow-500"
                                    )} />
                                    <span className="text-xs text-muted-foreground">{settings.endpoint ? 'Configured' : 'Not set'}</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                                <div>
                                    <div className="text-sm font-medium">Model</div>
                                    <div className="text-xs text-muted-foreground font-mono">{settings.model || 'Not set'}</div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className={cn(
                                        "w-2 h-2 rounded-full",
                                        settings.model ? "bg-green-500" : "bg-yellow-500"
                                    )} />
                                    <span className="text-xs text-muted-foreground">{settings.model ? 'Selected' : 'Default'}</span>
                                </div>
                            </div>

                            {(currentProvider?.needs_api_key || currentProvider?.supports_api_key) && (
                                <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                                    <div>
                                        <div className="text-sm font-medium">API Key</div>
                                        <div className="text-xs text-muted-foreground font-mono">
                                            {settings.hasApiKey ? 'Stored in keychain' : 'Not set'}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className={cn(
                                            "w-2 h-2 rounded-full",
                                            settings.hasApiKey ? "bg-green-500" : (currentProvider?.needs_api_key ? "bg-red-500" : "bg-yellow-500")
                                        )} />
                                        <span className="text-xs text-muted-foreground">
                                            {settings.hasApiKey ? 'Stored in keychain' : (currentProvider?.needs_api_key ? 'Required' : 'Optional')}
                                        </span>
                                    </div>
                                </div>
                            )}
                            {!currentProvider?.needs_api_key && !currentProvider?.supports_api_key && (
                                <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                                    <div>
                                        <div className="text-sm font-medium">Local Server</div>
                                        <div className="text-xs text-muted-foreground font-mono">{settings.endpoint || currentProvider?.default_url}</div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                                        <span className="text-xs text-muted-foreground">Local</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
