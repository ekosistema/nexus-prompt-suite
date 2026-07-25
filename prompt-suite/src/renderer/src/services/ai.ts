import { invoke } from '@tauri-apps/api/core';

export interface Message {
    role: string;
    content: string;
}

export interface ProviderInfo {
    id: string;
    name: string;
    icon: string;
    default_url: string;
    default_models: string[];
    needs_api_key: boolean;
    supports_api_key: boolean;
    keyring_suffix: string;
    api_path: string;
    models_endpoint: string;
    is_openai_compat: boolean;
    description: string;
    cost_tier: string;
}

export interface AIRequest {
    provider: string;
    endpoint: string;
    model: string;
    messages: Message[];
    temperature: number;
    numCtx: number;
    apiKey?: string;
    stream?: boolean;
}

export const aiService = {
    async generate(request: AIRequest): Promise<string> {
        try {
            const invokeFn = request.stream ? 'call_ai_stream' : 'call_ai';
            const response = await invoke(invokeFn, {
                provider: request.provider,
                endpoint: request.endpoint,
                model: request.model,
                messages: request.messages,
                temperature: request.temperature,
                numCtx: request.numCtx,
                apiKey: request.apiKey
            }) as string;
            
            return response;
        } catch (error) {
            console.error('AI Service Error:', error);
            throw new Error(typeof error === 'string' ? error : 'Failed to generate AI response');
        }
    },

    async listOllamaModels(endpoint: string): Promise<string[]> {
        try {
            const models = await invoke('list_ollama_models', { endpoint }) as string[];
            return models;
        } catch (error) {
            console.error('Ollama model list error:', error);
            throw new Error(typeof error === 'string' ? error : 'Failed to connect to Ollama');
        }
    },

    async listProviderModels(provider: string, endpoint: string, apiKey?: string): Promise<string[]> {
        try {
            const models = await invoke('list_provider_models', { provider, endpoint, apiKey }) as string[];
            return models;
        } catch (error) {
            console.error('Provider model list error:', error);
            throw new Error(typeof error === 'string' ? error : `Failed to list models for ${provider}`);
        }
    },

    async getAvailableProviders(): Promise<ProviderInfo[]> {
        try {
            const providers = await invoke('get_available_providers') as ProviderInfo[];
            return providers;
        } catch (error) {
            console.error('Get providers error:', error);
            return [];
        }
    },

    async saveProviderApiKey(provider: string, key: string): Promise<boolean> {
        try {
            return await invoke('save_provider_api_key', { provider, key }) as boolean;
        } catch (error) {
            console.error('Save provider key error:', error);
            throw new Error(typeof error === 'string' ? error : 'Failed to save API key');
        }
    },

    async getProviderApiKey(provider: string): Promise<string> {
        try {
            return await invoke('get_provider_api_key', { provider }) as string;
        } catch (error) {
            console.error('Get provider key error:', error);
            return '';
        }
    }
};
