import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateText } from 'ai';
import { invoke } from '@tauri-apps/api/core';
import { createNexusModel } from './aiSdkModel';

vi.mock('@tauri-apps/api/core', () => {
    class ChannelMock<T = unknown> {
        id = 0;
        onmessage: (response: T) => void = () => {};
    }
    return {
        invoke: vi.fn(),
        Channel: ChannelMock,
    };
});

const mockedInvoke = invoke as unknown as ReturnType<typeof vi.fn>;

describe('aiSdkModel (Vercel AI SDK -> Rust)', () => {
    beforeEach(() => {
        mockedInvoke.mockReset();
        mockedInvoke.mockResolvedValue('Respuesta desde el backend Rust');
    });

    it('no envía apiKey al comando Rust (la clave jamás vive en el renderer)', async () => {
        const model = createNexusModel({
            provider: 'openai',
            endpoint: 'https://api.openai.com',
            model: 'gpt-4o',
            temperature: 0.5,
            numCtx: 8192,
        });

        const { text } = await generateText({
            model,
            messages: [{ role: 'user', content: 'Hola' }],
            temperature: 0.5,
            maxRetries: 0,
        });

        expect(text).toBe('Respuesta desde el backend Rust');
        expect(mockedInvoke).toHaveBeenCalledTimes(1);

        const [command, args] = mockedInvoke.mock.calls[0];
        expect(command).toBe('call_ai');
        expect('apiKey' in args).toBe(false);
        expect(args.provider).toBe('openai');
        expect(args.endpoint).toBe('https://api.openai.com');
        expect(args.model).toBe('gpt-4o');
        expect(args.numCtx).toBe(8192);
        expect(args.temperature).toBe(0.5);
        expect(args.messages).toEqual([{ role: 'user', content: 'Hola' }]);
    });

    it('convierte el system a rol system y respeta un assistant previo', async () => {
        const model = createNexusModel({
            provider: 'ollama',
            endpoint: 'http://localhost:11434',
            model: 'llama3',
            numCtx: 4096,
        });

        await generateText({
            model,
            system: 'Eres un asistente.',
            messages: [
                { role: 'user', content: '¿Quién eres?' },
                { role: 'assistant', content: 'Un asistente.' },
                { role: 'user', content: 'Gracias.' },
            ],
            maxRetries: 0,
        });

        const [, args] = mockedInvoke.mock.calls[0];
        expect('apiKey' in args).toBe(false);
        expect(args.messages).toEqual([
            { role: 'system', content: 'Eres un asistente.' },
            { role: 'user', content: '¿Quién eres?' },
            { role: 'assistant', content: 'Un asistente.' },
            { role: 'user', content: 'Gracias.' },
        ]);
    });

    it('doStream emite deltas incrementales vía Channel de stream_ai', async () => {
        let capturedChannel: { onmessage?: (msg: { type: string; delta?: string }) => void } | undefined;

        mockedInvoke.mockImplementation(async (_cmd: string, args: Record<string, unknown>) => {
            capturedChannel = args.onToken as typeof capturedChannel;
            return undefined;
        });

        const model = createNexusModel({
            provider: 'openrouter',
            endpoint: 'https://openrouter.ai/api/v1',
            model: 'anthropic/claude-3.5-sonnet',
            temperature: 0.2,
            numCtx: 128000,
        });

        const { stream } = await model.doStream({
            prompt: [{ role: 'user', content: [{ type: 'text', text: 'Cuéntame' }] }],
        });

        expect(mockedInvoke).toHaveBeenCalledTimes(1);
        const [command, args] = mockedInvoke.mock.calls[0];
        expect(command).toBe('stream_ai');
        expect('apiKey' in args).toBe(false);
        expect(args.onToken).toBeDefined();
        expect(typeof args.onToken.onmessage).toBe('function');

        expect(capturedChannel).toBeDefined();
        expect(capturedChannel!.onmessage).toBeDefined();

        capturedChannel!.onmessage?.({ type: 'token', delta: 'Hola ' });
        capturedChannel!.onmessage?.({ type: 'token', delta: 'mundo' });
        capturedChannel!.onmessage?.({ type: 'done' });

        const parts: Array<{ type: string; delta?: string }> = [];
        const reader = stream.getReader();
        for (;;) {
            const { done, value } = await reader.read();
            if (done) break;
            parts.push(value as { type: string; delta?: string });
        }

        const deltas = parts.filter((p) => p.type === 'text-delta').map((p) => p.delta);
        expect(deltas.join('')).toBe('Hola mundo');
        expect(parts.some((p) => p.type === 'finish')).toBe(true);
    });
});