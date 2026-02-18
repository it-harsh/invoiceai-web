"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { AssistantChatPanel } from "./assistant-chat-panel";

export function AssistantChatButton() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <Button
        onClick={() => setOpen(true)}
        size="lg"
        className="fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full shadow-lg"
        aria-label="Open AI Assistant"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md p-0 gap-0"
        showCloseButton={false}
      >
        <AssistantChatPanel onClose={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}
