import { useState, useCallback } from 'react';

// Guarda el prompt base compuesto por cada módulo (disponible al instante, sin IA).
export function usePromptGenerator() {
    const [prompt, setPrompt] = useState('');
    const [isGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const generate = useCallback((generatedPrompt: string) => {
        setError(null);
        setPrompt(generatedPrompt);
    }, []);

    const reset = useCallback(() => {
        setPrompt('');
        setError(null);
    }, []);

    return { prompt, isGenerating, error, generate, reset };
}
