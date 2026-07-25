import { useState, useCallback, useRef, useEffect } from 'react';
import { aiService, AIRequest, Message } from '../services/ai';
import { useApp } from '../contexts/AppContext';

export function useAIInference() {
    const { settings } = useApp();
    const [messages, setMessages] = useState<Message[]>([]);
    const [isThinking, setIsThinking] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [elapsedMs, setElapsedMs] = useState(0);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const startTimeRef = useRef<number>(0);

    useEffect(() => {
        if (isThinking) {
            startTimeRef.current = Date.now();
            timerRef.current = setInterval(() => {
                setElapsedMs(Date.now() - startTimeRef.current);
            }, 100);
        } else {
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isThinking]);

    const runInference = useCallback(async (prompt: string, isRefinement = false, systemPrompt?: string) => {
        setIsThinking(true);
        setError(null);
        setElapsedMs(0);
        
        try {
            let newMessages: Message[] = [];
            
            if (isRefinement) {
                newMessages = [...messages, { role: 'user', content: prompt }];
            } else {
                if (systemPrompt) {
                    newMessages.push({ role: 'system', content: systemPrompt });
                }
                newMessages.push({ role: 'user', content: prompt });
            }

            const request: AIRequest = {
                provider: settings.aiProvider,
                endpoint: settings.endpoint,
                model: settings.model,
                messages: newMessages,
                temperature: settings.temperature,
                numCtx: settings.numCtx,
                apiKey: settings.apiKey,
                stream: settings.streaming,
            };

            const response = await aiService.generate(request);
            
            setMessages([...newMessages, { role: 'assistant', content: response }]);
            return response;
        } catch (err) {
            const msg = err instanceof Error ? err.message : 'AI Inference failed';
            setError(msg);
            return null;
        } finally {
            setIsThinking(false);
        }
    }, [settings, messages]);

    const resetInference = useCallback(() => {
        setMessages([]);
        setError(null);
        setIsThinking(false);
        setElapsedMs(0);
    }, []);

    const lastResult = messages.findLast((m: Message) => m.role === 'assistant')?.content || '';

    const generateTitle = async (msgs: Message[]): Promise<string> => {
        try {
            const lastMsg = msgs[msgs.length - 1].content;
            const titlePrompt = `Summarize this conversation into a VERY short (3-5 words) descriptive title. Respond ONLY with the title. No quotes.
            Conversation snippet: ${lastMsg.slice(0, 100)}`;

            return await aiService.generate({
                provider: settings.aiProvider,
                endpoint: settings.endpoint,
                model: settings.model,
                messages: [{ role: 'user', content: titlePrompt }],
                temperature: 0.3,
                numCtx: settings.numCtx,
                apiKey: settings.apiKey,
                stream: false,
            });
        } catch (err) {
            console.error('Title generation failed', err);
            return 'New Chat';
        }
    };

    return {
        result: lastResult,
        messages,
        setMessages,
        generateTitle,
        isThinking,
        elapsedMs,
        error,
        runInference,
        resetInference
    };
}
