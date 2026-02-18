"use client";

import { useState, useRef, useEffect } from "react";
import { X, Send, Sparkles, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SheetTitle } from "@/components/ui/sheet";
import { ChatMessage } from "./chat-message";
import { ChatTypingIndicator } from "./chat-typing-indicator";
import { SuggestedQuestions } from "./suggested-questions";
import { useSendChatMessage } from "@/hooks/use-assistant";
import type { ChatMessageEntry } from "@/types/api";

interface Props {
  onClose: () => void;
}

export function AssistantChatPanel({ onClose }: Props) {
  const [messages, setMessages] = useState<ChatMessageEntry[]>([]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const mutation = useSendChatMessage();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, mutation.isPending]);

  function handleSend(text?: string) {
    const messageText = text || input.trim();
    if (!messageText || mutation.isPending) return;

    const userMessage: ChatMessageEntry = { role: "user", content: messageText };
    const updatedHistory = [...messages];
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    mutation.mutate(
      { message: messageText, history: updatedHistory },
      {
        onSuccess: (data) => {
          setMessages((prev) => [
            ...prev,
            { role: "assistant", content: data.reply },
          ]);
        },
        onError: () => {
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content:
                "Sorry, I couldn't process your request. Please try again.",
            },
          ]);
        },
      }
    );
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleReset() {
    setMessages([]);
    setInput("");
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <SheetTitle>AI Assistant</SheetTitle>
        </div>
        <div className="flex items-center gap-1">
          {messages.length > 0 ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              aria-label="Reset conversation"
              className="h-8 w-8 p-0"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          ) : null}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            aria-label="Close"
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <SuggestedQuestions onSelect={handleSend} />
        ) : (
          <>
            {messages.map((msg, i) => (
              <ChatMessage key={i} role={msg.role} content={msg.content} />
            ))}
            {mutation.isPending ? <ChatTypingIndicator /> : null}
          </>
        )}
      </div>

      <div className="border-t p-3">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about your expenses..."
            className="min-h-10 max-h-32 resize-none"
            disabled={mutation.isPending}
          />
          <Button
            onClick={() => handleSend()}
            size="icon"
            disabled={!input.trim() || mutation.isPending}
            aria-label="Send message"
            className="shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
