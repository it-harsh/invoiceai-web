"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { RecurringExpenseResponse } from "@/types/api";

export function useRecurringExpenses() {
  return useQuery({
    queryKey: ["recurring-expenses"],
    queryFn: () => api.get<RecurringExpenseResponse[]>("/recurring-expenses"),
  });
}

export function useCreateRecurringExpense() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      api.post<RecurringExpenseResponse>("/recurring-expenses", data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["recurring-expenses"] });
    },
  });
}

export function useDeleteRecurringExpense() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.del(`/recurring-expenses/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["recurring-expenses"] });
    },
  });
}
