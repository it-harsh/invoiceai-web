"use client";

import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { AssistantChatResponse, AssistantChatRequest } from "@/types/api";

export function useSendChatMessage() {
  return useMutation({
    mutationFn: (data: AssistantChatRequest) =>
      api.post<AssistantChatResponse>("/assistant/chat", data),
  });
}
