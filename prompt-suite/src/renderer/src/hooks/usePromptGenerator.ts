import { useState, useCallback } from 'react';

export interface PromptGeneratorState {
    prompt: string;
    isGenerating: boolean;
    error: string | null;
}

export interface PromptGeneratorConfig {
    [key: string]: any;
}

export function usePromptGenerator() {
    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const generate = useCallback((generatedPrompt: string) => {
        setIsGenerating(true);
        setError(null);

        try {
            // Simulate async generation (in case we add API calls later)
            setTimeout(() => {
                setPrompt(generatedPrompt);
                setIsGenerating(false);
            }, 100);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
            setIsGenerating(false);
        }
    }, []);

    const reset = useCallback(() => {
        setPrompt('');
        setError(null);
        setIsGenerating(false);
    }, []);

    const copyToClipboard = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(prompt);
            return true;
        } catch (err) {
            setError('Failed to copy to clipboard');
            return false;
        }
    }, [prompt]);

    const downloadAsFile = useCallback(() => {
        try {
            const blob = new Blob([prompt], { type: 'text/plain' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `prompt_${new Date().getTime()}.txt`;
            link.click();
            URL.revokeObjectURL(link.href);
            return true;
        } catch (err) {
            setError('Failed to download file');
            return false;
        }
    }, [prompt]);

    return {
        prompt,
        isGenerating,
        error,
        generate,
        reset,
        copyToClipboard,
        downloadAsFile
    };
}
