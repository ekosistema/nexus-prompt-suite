import { useState, useMemo } from 'react';
import { DB, CategoryKey } from './data';
import { cn } from '../../lib/utils';
import { Copy, Check, Terminal, Palette, BookOpen } from 'lucide-react';

export function PromptMatrix() {
    const [category, setCategory] = useState<CategoryKey>('multimedia');
    const [formatIndex, setFormatIndex] = useState(0);
    const [moodIndex, setMoodIndex] = useState(0);
    const [topic, setTopic] = useState('');
    const [extra, setExtra] = useState('');
    const [copied, setCopied] = useState(false);

    const currentData = DB[category];
    const currentFormat = currentData.formats[formatIndex];
    const currentMood = currentData.moods[moodIndex];

    // Logic: Generate Prompt
    const generatedPrompt = useMemo(() => {
        if (!currentFormat || !currentMood) return '';

        const topicText = topic.trim() || "[INSERTA TU TEMA AQUÍ]";

        // CASE 1: IMAGE GENERATION (MidJourney, etc)
        if (category === 'multimedia' && currentFormat.id === 'gen_art') {
            // Structure: [Subject] + [Environment] + [Style] + [Lighting] + [Specs]
            const subject = topicText;
            const env = "cinematic setting";
            const style = currentMood.label;
            const lighting = "volumetric lighting, dramatic atmosphere";
            const specs = "8k, high detail, unreal engine 5 render";

            return `/imagine prompt: ${subject} -- ${env} -- ${style} -- ${lighting} -- ${specs} --ar 16:9 --v 6.0`;
        }

        // CASE 2: TEXT/CODE GENERATION (LLM)
        let promptText = `### ROLE
Act as a **${currentFormat.role}**.

### CONTEXT
We are exploring the topic: **${topicText}**.
Mood/Tone: **${currentMood.label}** (${currentMood.text})

### TASK
Execute the following format: **${currentFormat.name}**.

### CONTENT BODY
${currentFormat.structure
                .replace(/\[TEMA\]/g, topicText.toUpperCase())
                .replace(/\[MOOD_TONE\]/g, currentMood.text)
                .replace(/\[MOOD_VISUAL\]/g, currentMood.text)
                .replace(/\[MOOD_HOOK\]/g, currentMood.text)
                .replace(/\[MOOD_CODE\]/g, currentMood.text)
            }`;

        if (extra.trim()) {
            promptText += `\n\n### CONSTRAINTS & EXTRAS\n- ${extra.trim()}`;
        }

        return promptText;
    }, [category, formatIndex, moodIndex, topic, extra, currentFormat, currentMood]);

    const handleCopy = () => {
        navigator.clipboard.writeText(generatedPrompt);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const categories: { id: CategoryKey; label: string; icon: any }[] = [
        { id: 'multimedia', label: 'Multimedia & Art', icon: Palette },
        { id: 'notebook', label: 'NotebookLM & Edu', icon: BookOpen },
        { id: 'dev', label: 'Software & DevOps', icon: Terminal },
    ];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
            {/* LEFT: Configuration */}
            <div className="lg:col-span-7 flex flex-col gap-4 overflow-y-auto pr-2 pb-2">

                {/* Category Tabs */}
                <div className="flex gap-2 p-1 bg-secondary/30 rounded-lg">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => { setCategory(cat.id); setFormatIndex(0); setMoodIndex(0); }}
                            className={cn(
                                "flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-md transition-all",
                                category === cat.id
                                    ? "bg-background shadow-sm text-foreground"
                                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                            )}
                        >
                            <cat.icon size={16} />
                            {cat.label}
                        </button>
                    ))}
                </div>

                {/* Form Controls */}
                <div className="bg-card border border-border rounded-xl p-5 space-y-6 shadow-sm">
                    <h3 className="text-lg font-semibold tracking-tight">Configuration</h3>

                    <div className="space-y-3">
                        <label className="text-sm font-medium text-muted-foreground">1. Format / Objective</label>
                        <select
                            className="w-full bg-input/40 border border-input rounded-md h-9 px-3 text-sm focus-visible:outline-none focus-visible:ring-2 ring-ring/60 ring-offset-2 ring-offset-background transition-all select"
                            value={formatIndex}
                            onChange={(e) => setFormatIndex(Number(e.target.value))}
                        >
                            {currentData.formats.map((fmt, idx) => (
                                <option key={fmt.id} value={idx}>{fmt.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-medium text-muted-foreground">2. Mood & Style</label>
                        <div className="flex flex-wrap gap-2">
                            {currentData.moods.map((mood, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setMoodIndex(idx)}
                                    className={cn(
                                        "px-4 py-1.5 rounded-full text-xs font-medium border transition-all",
                                        moodIndex === idx
                                            ? "bg-primary text-primary-foreground border-primary"
                                            : "bg-background border-border text-muted-foreground hover:border-primary/50"
                                    )}
                                >
                                    {mood.label}
                                </button>
                            ))}
                        </div>
                        <p className="text-xs text-muted-foreground italic pl-1">{currentMood.text}</p>
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-medium text-muted-foreground">3. Topic / Context</label>
                        <input
                            type="text"
                            placeholder="Ex: Microservices, Cyberpunk City, Rome History..."
                            className="w-full bg-secondary/50 border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-medium text-muted-foreground">Additional Details (Optional)</label>
                        <textarea
                            rows={3}
                            placeholder="Specific constraints, technologies, target audience..."
                            className="w-full bg-secondary/50 border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                            value={extra}
                            onChange={(e) => setExtra(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* RIGHT: Output */}
            <div className="lg:col-span-5 flex flex-col h-full overflow-hidden bg-zinc-950 border border-border rounded-xl shadow-lg relative">
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/5">
                    <span className="text-xs font-mono text-muted-foreground uppercase">Generated Prompt</span>
                    <button
                        onClick={handleCopy}
                        className={cn(
                            "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all",
                            copied ? "bg-green-500/20 text-green-400" : "bg-primary text-primary-foreground hover:opacity-90"
                        )}
                    >
                        {copied ? <Check size={14} /> : <Copy size={14} />}
                        {copied ? 'Copied' : 'Copy'}
                    </button>
                </div>

                <div className="flex-1 p-4 overflow-y-auto">
                    <pre className="font-mono text-sm text-zinc-300 whitespace-pre-wrap leading-relaxed">
                        {generatedPrompt}
                    </pre>
                </div>
            </div>
        </div>
    );
}
