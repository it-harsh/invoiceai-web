"use client";

import { Sparkles } from "lucide-react";

const SUGGESTIONS = [
  "How much did I spend this month?",
  "What's my biggest expense category?",
  "Compare this month to last month",
  "Which vendors am I spending the most on?",
  "How many expenses are pending review?",
];

interface Props {
  onSelect: (question: string) => void;
}

export function SuggestedQuestions({ onSelect }: Props) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 px-2">
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Sparkles className="h-6 w-6 text-primary" />
        </div>
        <h3 className="font-semibold">AI Expense Assistant</h3>
        <p className="text-sm text-muted-foreground max-w-xs">
          Ask me anything about your expenses, spending trends, or categories.
        </p>
      </div>
      <div className="flex flex-col gap-2 w-full">
        {SUGGESTIONS.map((q) => (
          <button
            key={q}
            onClick={() => onSelect(q)}
            className="text-left text-sm rounded-lg border px-3 py-2 hover:bg-muted transition-colors"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}
