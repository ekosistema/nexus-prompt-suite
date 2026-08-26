import { useState, useRef, useEffect, ReactNode } from 'react';
import { cn } from '../../lib/utils';
import { sanitizeAIOutput } from '../../lib/utils';
import { Message } from '../../services/ai';
import { t } from '../../lib/i18n';
import { secureGetItem, secureSetItem } from '../../lib/secureStorage';
import { Plus, Copy, Check, MessageSquare, Trash2, Bot, Send, FileText } from 'lucide-react';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { LLMStatusIndicator } from '../../components/ui/LLMStatusIndicator';
import ReactMarkdown from 'react-markdown';

interface ChatHistoryItem {
    id: string;
    title: string;
    messages: Message[];
    date: number;
}

interface ChatViewProps {
    messages: Message[];
    isThinking: boolean;
    isLoading: boolean;
    elapsedMs: number;
    error: string | null;
    providerName: string;
    model: string;
    onSendMessage: (input: string) => Promise<void>;
    onCopy: () => void;
    copied: boolean;
    suiteLang: 'es' | 'en';
    onSelectHistory: (messages: Message[]) => void;
}

export function ChatView({
    messages,
    isThinking,
    isLoading,
    elapsedMs,
    error,
    providerName,
    model,
    onSendMessage,
    onCopy,
    copied,
    suiteLang,
    onSelectHistory,
}: ChatViewProps) {
    const [chatInput, setChatInput] = useState('');
    const [history, setHistory] = useState<ChatHistoryItem[]>([]);
    const [historyLoaded, setHistoryLoaded] = useState(false);
    const [currentChatId, setCurrentChatId] = useState<string | null>(null);
    const outputRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        secureGetItem<ChatHistoryItem[]>('chat_history').then(data => {
            if (data) setHistory(data);
            setHistoryLoaded(true);
        });
    }, []);

    useEffect(() => {
        if (historyLoaded && history.length > 0) {
            secureSetItem('chat_history', history);
        }
    }, [history, historyLoaded]);

    const loadHistoryItem = (item: ChatHistoryItem) => {
        setCurrentChatId(item.id);
        onSelectHistory(item.messages);
    };

    const startNewChat = () => {
        setCurrentChatId(null);
        onSelectHistory([]);
    };

    const deleteHistoryItem = (id: string) => {
        setHistory(history.filter(item => item.id !== id));
    };

    const handleChatSend = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!chatInput.trim() || isThinking) return;
        const input = chatInput;
        setChatInput('');
        if (!currentChatId) setCurrentChatId(null);
        await onSendMessage(input);
    };

    const estimatedTokens = messages.length > 0
        ? Math.ceil(messages.reduce((sum, m) => sum + m.content.length, 0) / 4)
        : 0;

    return (
        <div className="flex flex-col h-full gap-4">
            <div className="flex items-center gap-3 shrink-0">
                <button
                    onClick={startNewChat}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-500 text-gray-900 font-bold text-sm hover:opacity-90 transition-all shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                    <Plus size={16} />
                    {t('chat.new', suiteLang) || 'New Chat'}
                </button>
                <div className="flex-1" />
                {messages.length > 1 && (
                    <button
                        onClick={onCopy}
                        className={cn(
                            "flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all border",
                            copied ? "bg-green-600/20 border-green-600/30 text-green-400" : "bg-secondary/50 border-border text-muted-foreground hover:text-foreground"
                        )}
                    >
                        {copied ? <Check size={14} /> : <Copy size={14} />}
                        {copied ? t('chat.copied', suiteLang) : t('chat.copy', suiteLang)}
                    </button>
                )}
            </div>

            <LLMStatusIndicator
                isThinking={isThinking}
                elapsedMs={elapsedMs}
                provider={providerName}
                model={model}
                estimatedTokens={estimatedTokens}
            />

            <div className="flex-1 min-h-0 grid grid-cols-1 xl:grid-cols-[280px_1fr_360px] gap-4">
                <div className="hidden xl:flex flex-col bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                    <div className="p-3 border-b border-border">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{t('chat.history', suiteLang)}</span>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 space-y-1">
                        {history.length === 0 ? (
                            <p className="text-[11px] text-center text-muted-foreground py-8">{t('chat.no_recent', suiteLang)}</p>
                        ) : (
                            history.map(item => (
                                <div
                                    key={item.id}
                                    onClick={() => loadHistoryItem(item)}
                                    className={cn(
                                        "group flex items-center gap-2 p-2.5 rounded-lg cursor-pointer transition-all",
                                        currentChatId === item.id ? "bg-primary/20 border border-primary/30" : "hover:bg-secondary/50 border border-transparent"
                                    )}
                                >
                                    <MessageSquare size={14} className={cn("shrink-0", currentChatId === item.id ? "text-primary" : "text-muted-foreground")} />
                                    <span className="text-xs truncate flex-1">{item.title}</span>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); deleteHistoryItem(item.id); }}
                                        className="opacity-0 group-hover:opacity-100 p-1 hover:text-destructive transition-all"
                                    >
                                        <Trash2 size={12} />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="flex flex-col bg-background border border-border rounded-xl shadow-lg overflow-hidden xl:col-span-1">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/5 shrink-0">
                        <span className="text-xs font-mono text-muted-foreground uppercase">{t('nav.chat', suiteLang)}</span>
                        <span className="text-[10px] text-muted-foreground/60">{messages.filter(m => m.role !== 'system').length} {t('chat.messages', suiteLang)}</span>
                    </div>

                    <div className="flex-1 p-4 overflow-y-auto" ref={outputRef}>
                        {isLoading && (
                            <div className="flex items-center justify-center h-full">
                                <LoadingSpinner size="md" label={isThinking ? t('chat.thinking', suiteLang) : t('chat.generating', suiteLang)} />
                            </div>
                        )}

                        {error && (
                            <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-md text-destructive text-sm mb-4" role="alert">
                                <strong>{t('chat.error', suiteLang)}</strong> {error}
                            </div>
                        )}

                        {messages.length === 0 && !isThinking ? (
                            <div className="flex flex-col items-center justify-center h-full text-center p-8 opacity-40">
                                <MessageSquare size={48} className="mb-4 text-primary" />
                                <h3 className="text-lg font-bold mb-2">{t('chat.new_conversation', suiteLang)}</h3>
                                <p className="text-sm">{t('chat.start_hint', suiteLang)}</p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-4">
                                {messages.map((msg, i) => {
                                    if (msg.role === 'system') return null;
                                    const isFirstUserMsg = !messages.slice(0, i).some(m => m.role === 'user');
                                    if (msg.role === 'user' && isFirstUserMsg) return null;

                                    return (
                                        <div key={i} className={cn("flex", msg.role === 'user' ? "justify-end" : "justify-start")}>
                                            <div className={cn(
                                                "max-w-[80%] rounded-2xl p-4 shadow-xl",
                                                msg.role === 'user'
                                                    ? "bg-primary/20 border border-primary/30 text-white"
                                                    : "bg-white/5 border border-white/10 prose prose-sm prose-invert max-w-none"
                                            )}>
                                                {msg.role === 'user' ? (
                                                    <p className="text-sm font-medium">{msg.content}</p>
                                                ) : (
                                                    <ReactMarkdown>{sanitizeAIOutput(msg.content)}</ReactMarkdown>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}

                                {isThinking && (
                                    <div className="flex items-center gap-2 text-muted-foreground animate-pulse text-xs">
                                        <Bot size={14} />
                                        <span>{t('chat.typing', suiteLang)}</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="p-4 border-t border-white/10 bg-white/5 shrink-0">
                        <form onSubmit={handleChatSend} className="flex items-center gap-2">
                            <input
                                type="text"
                                className="flex-1 bg-input/40 border border-input rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring/60 transition-all placeholder:text-muted-foreground/60"
                                placeholder={t('chat.placeholder', suiteLang)}
                                value={chatInput}
                                onChange={(e) => setChatInput(e.target.value)}
                                disabled={isThinking}
                            />
                            <button
                                type="submit"
                                disabled={!chatInput.trim() || isThinking}
                                className="p-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                            >
                                <Send size={18} />
                            </button>
                        </form>
                    </div>
                </div>

                <div className="hidden xl:flex flex-col bg-background border border-border rounded-xl shadow-lg overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/5 shrink-0">
                        <span className="text-xs font-mono text-muted-foreground uppercase">{t('chat.prompt_preview', suiteLang)}</span>
                        {messages.length > 0 && (
                            <button
                                onClick={onCopy}
                                className="flex items-center gap-1.5 px-2 py-1 rounded bg-white/5 text-muted-foreground hover:text-foreground transition-colors text-[10px]"
                            >
                                {copied ? <Check size={10} /> : <Copy size={10} />}
                                {copied ? t('chat.copied', suiteLang) : t('chat.copy', suiteLang)}
                            </button>
                        )}
                    </div>

                    <div className="flex-1 min-h-0 p-4 overflow-y-auto">
                        {messages.filter(m => m.role !== 'system').length > 0 ? (
                            <pre className="whitespace-pre-wrap font-mono text-xs text-zinc-300 leading-relaxed">
                                {messages.filter(m => m.role !== 'system').map(m => `[${m.role}] ${m.content}\n\n`).join('')}
                            </pre>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-center opacity-40">
                                <FileText size={32} className="mb-3 text-muted-foreground" />
                                <p className="text-xs text-muted-foreground">{t('chat.optimized_here', suiteLang)}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
