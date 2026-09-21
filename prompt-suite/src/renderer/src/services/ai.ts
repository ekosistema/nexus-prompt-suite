import { invoke } from '@tauri-apps/api/core';
import { generateText } from 'ai';
import type { ModelMessage } from '@ai-sdk/provider-utils';
import { createNexusModel } from './aiSdkModel';
import { safeLog } from '../lib/utils';

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
    docs_url: string;
}

export interface AIRequest {
    provider: string;
    endpoint: string;
    model: string;
    messages: Message[];
    temperature: number;
    numCtx: number;
    stream?: boolean;
}

export const aiService = {
    async generate(request: AIRequest): Promise<string> {
        // La API key nunca viaja al renderer: se resuelve siempre en Rust
        // (keyring). Preferimos el SDK mientras sea posible y caemos al camino
        // clásico de invoke si algo falla.
        if (!request.stream) {
            try {
                return await this.generateWithSDK(request);
            } catch (error) {
                safeLog('warn', 'AI SDK path failed, falling back to invoke:', error);
            }
        }

        try {
            const invokeFn = request.stream ? 'call_ai_stream' : 'call_ai';
            const response = await invoke(invokeFn, {
                provider: request.provider,
                endpoint: request.endpoint,
                model: request.model,
                messages: request.messages,
                temperature: request.temperature,
                numCtx: request.numCtx,
            }) as string;
            
            return response;
        } catch (error) {
            safeLog('error', 'AI Service Error:', error);
            throw new Error(typeof error === 'string' ? error : 'Failed to generate AI response');
        }
    },

    /**
     * Genera texto usando el Vercel AI SDK con un modelo custom que transporta
     * cada llamada por los comandos Rust (call_ai / call_ai_stream). La apiKey
     * se resuelve exclusivamente en Rust vía keyring.
     */
    async generateWithSDK(request: AIRequest): Promise<string> {
        try {
            const system = request.messages
                .filter((m) => m.role === 'system')
                .map((m) => m.content)
                .join('\n\n');

            const messages = request.messages
                .filter((m) => m.role !== 'system')
                .map((m) => ({ role: m.role, content: m.content }) as ModelMessage);

            const model = createNexusModel({
                provider: request.provider,
                endpoint: request.endpoint,
                model: request.model,
                temperature: request.temperature,
                numCtx: request.numCtx,
            });

            const { text } = await generateText({
                model,
                system: system.length > 0 ? system : undefined,
                messages,
                temperature: request.temperature,
                maxRetries: 0,
            });

            return text;
        } catch (error) {
            safeLog('error', 'AI SDK Service Error:', error);
            throw new Error(typeof error === 'string' ? error : 'Failed to generate AI response');
        }
    },

    async listOllamaModels(endpoint: string): Promise<string[]> {
        try {
            const models = await invoke('list_ollama_models', { endpoint }) as string[];
            return models;
        } catch (error) {
            safeLog('error', 'Ollama model list error:', error);
            throw new Error(typeof error === 'string' ? error : 'Failed to connect to Ollama');
        }
    },

    async listProviderModels(provider: string, endpoint: string, apiKey?: string): Promise<string[]> {
        try {
            const models = await invoke('list_provider_models', { provider, endpoint, apiKey }) as string[];
            return models;
        } catch (error) {
            safeLog('error', 'Provider model list error:', error);
            throw new Error(typeof error === 'string' ? error : `Failed to list models for ${provider}`);
        }
    },

    async getAvailableProviders(): Promise<ProviderInfo[]> {
        try {
            const providers = await invoke('get_available_providers') as ProviderInfo[];
            return providers;
        } catch (error) {
            safeLog('error', 'Get providers error:', error);
            return [];
        }
    },

    async saveProviderApiKey(provider: string, key: string): Promise<boolean> {
        try {
            return await invoke('save_provider_api_key', { provider, key }) as boolean;
        } catch (error) {
            safeLog('error', 'Save provider key error');
            throw new Error('Failed to save API key');
        }
    },

    async hasProviderApiKey(provider: string): Promise<boolean> {
        try {
            return await invoke('has_provider_api_key', { provider }) as boolean;
        } catch (error) {
            safeLog('error', 'Has provider key error');
            return false;
        }
    }
};
