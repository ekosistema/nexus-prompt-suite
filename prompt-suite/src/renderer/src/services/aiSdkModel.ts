import { invoke, Channel } from '@tauri-apps/api/core';
import type {
    LanguageModelV2,
    LanguageModelV2CallOptions,
    LanguageModelV2Prompt,
} from '@ai-sdk/provider';

/**
 * Mensaje plano alineado con el contrato Rust de `call_ai` / `call_ai_stream`
 * (src-tauri/src/ai/types.rs -> struct Message { role, content }).
 */
export interface NexusBackendMessage {
    role: string;
    content: string;
}

/** Parámetros para construir un modelo Vercel AI SDK conectado al backend Rust. */
export interface NexusModelParams {
    provider: string;
    endpoint: string;
    model: string;
    temperature?: number;
    numCtx?: number;
}

/**
 * NOTA SOBRE STREAMING INCREMENTAL:
 * `doStream` usa el comando `stream_ai` (src-tauri/src/lib.rs) con un `Channel`
 * de Tauri 2. El canal se pasa como argumento (`onToken`) y Rust emite cada
 * token incremental con `{"type":"token","delta": ...}`, cerrando con
 * `{"type":"done"}` al terminar. La apiKey se resuelve en Rust (keyring), nunca
 * viaja al renderer. Los providers sin streaming (p. ej. Anthropic/Gemini)
 * decrecen a `call_ai` y entregan el texto completo en un único token.
 */

const FINISH_REASON_STOP = 'stop';

function toBackendMessages(prompt: LanguageModelV2Prompt): NexusBackendMessage[] {
    return prompt.map((message) => {
        if (typeof message.content === 'string') {
            return { role: message.role, content: message.content };
        }
        const chunks: string[] = [];
        for (const part of message.content) {
            if (part.type === 'text' && part.text.length > 0) {
                chunks.push(part.text);
            }
        }
        return { role: message.role, content: chunks.join('\n') };
    });
}

function buildPayload(
    params: NexusModelParams,
    options: LanguageModelV2CallOptions,
): Record<string, unknown> {
    return {
        provider: params.provider,
        endpoint: params.endpoint,
        model: params.model,
        messages: toBackendMessages(options.prompt),
        temperature: options.temperature ?? params.temperature ?? 0.7,
        numCtx: params.numCtx ?? 4096,
    };
}

/**
 * Crea un modelo compatible con `LanguageModelV2` del Vercel AI SDK cuyo
 * transporte SIEMPRE pasa por los comandos Rust vía `invoke()`.
 *
 * Seguridad: el objeto de modelo NO contiene apiKey y el payload no incluye
 * ningún campo de clave. El keyring se resuelve exclusivamente en Rust
 * (`resolve_api_key`); el valor jamás viaja al renderer.
 */
export function createNexusModel(params: NexusModelParams): LanguageModelV2 {
    const model: LanguageModelV2 = {
        specificationVersion: 'v2',
        provider: 'nexus',
        modelId: params.model,
        supportedUrls: {},

        async doGenerate(options) {
            const payload = buildPayload(params, options);
            const text = await invoke('call_ai', payload) as string;

            return {
                content: [{ type: 'text', text }],
                finishReason: FINISH_REASON_STOP,
                usage: {
                    inputTokens: undefined,
                    outputTokens: undefined,
                    totalTokens: undefined,
                },
                warnings: [],
                request: { body: payload },
            };
        },

        async doStream(options) {
            const payload = buildPayload(params, options);
            const id = `nexus-${params.model}-${Date.now()}`;

            const channel = new Channel<{ type: string; delta?: string }>();
            const loadPromise = invoke('stream_ai', {
                ...payload,
                onToken: channel,
            });

            const stream = new ReadableStream<import('@ai-sdk/provider').LanguageModelV2StreamPart>({
                start(controller) {
                    controller.enqueue({ type: 'stream-start', warnings: [] });
                    controller.enqueue({ type: 'text-start', id });

                    channel.onmessage = (msg) => {
                        if (msg.type === 'token') {
                            controller.enqueue({ type: 'text-delta', id, delta: msg.delta ?? '' });
                        } else if (msg.type === 'done') {
                            controller.enqueue({ type: 'text-end', id });
                            controller.enqueue({
                                type: 'finish',
                                usage: {
                                    inputTokens: undefined,
                                    outputTokens: undefined,
                                    totalTokens: undefined,
                                },
                                finishReason: FINISH_REASON_STOP,
                            });
                            controller.close();
                        }
                    };

                    loadPromise.catch((err: unknown) => controller.error(err));
                },
            });

            return { stream, request: { body: payload } };
        },
    };

    return model;
}