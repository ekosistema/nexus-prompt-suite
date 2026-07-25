import { Bot, Server, Clock, Zap } from 'lucide-react';
import { cn } from '../../lib/utils';

interface LLMStatusIndicatorProps {
    isThinking: boolean;
    elapsedMs: number;
    provider: string;
    model: string;
    estimatedTokens?: number;
}

export function LLMStatusIndicator({ isThinking, elapsedMs, provider, model, estimatedTokens }: LLMStatusIndicatorProps) {
    const elapsedSec = Math.floor(elapsedMs / 1000);
    const elapsedMin = Math.floor(elapsedSec / 60);
    const remainingSec = elapsedSec % 60;
    const timeStr = elapsedMin > 0
        ? `${elapsedMin}m ${remainingSec}s`
        : `${remainingSec}s`;

    const getPhaseLabel = () => {
        if (!isThinking) return null;
        if (elapsedSec < 2) return 'Conectando...';
        if (elapsedSec < 10) return 'Procesando...';
        if (elapsedSec < 30) return 'Generando respuesta...';
        return 'Finalizando...';
    };

    const getProgressPercent = () => {
        if (!isThinking) return 0;
        if (elapsedSec < 2) return 10;
        if (elapsedSec < 10) return 25 + (elapsedSec - 2) * 2;
        if (elapsedSec < 30) return 40 + (elapsedSec - 10) * 2;
        return Math.min(95, 80 + (elapsedSec - 30));
    };

    if (!isThinking) return null;

    return (
        <div className="bg-card/80 border border-primary/30 rounded-xl p-4 shadow-lg backdrop-blur-sm">
            {/* Status Header */}
            <div className="flex items-center gap-3 mb-3">
                <div className="relative">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                        <Bot size={16} className="text-primary animate-pulse" />
                    </div>
                    <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-primary rounded-full animate-ping" />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-primary">{getPhaseLabel()}</span>
                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                            <Clock size={10} />
                            <span>{timeStr}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-0.5">
                        <Server size={10} />
                        <span className="truncate">{provider}</span>
                        <span className="opacity-50">|</span>
                        <Zap size={10} />
                        <span className="truncate font-mono">{model}</span>
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="relative h-1.5 bg-secondary rounded-full overflow-hidden">
                <div
                    className="h-full bg-gradient-to-r from-primary via-primary/80 to-primary/60 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${getProgressPercent()}%` }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
            </div>

            {/* Token Estimate */}
            {estimatedTokens && estimatedTokens > 0 && (
                <div className="mt-2 text-[10px] text-muted-foreground text-right">
                    ~{estimatedTokens} tokens estimados
                </div>
            )}
        </div>
    );
}
