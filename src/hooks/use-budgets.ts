"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { BudgetResponse, BudgetProgressResponse } from "@/types/api";

export function useBudgets() {
  return useQuery({
    queryKey: ["budgets"],
    queryFn: () => api.get<BudgetResponse[]>("/budgets"),
  });
}

export function useCreateBudget() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      api.post<BudgetResponse>("/budgets", data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["budgets"] });
      qc.invalidateQueries({ queryKey: ["budget-progress"] });
    },
  });
}

export function useUpdateBudget() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      api.patch<BudgetResponse>(`/budgets/${id}`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["budgets"] });
      qc.invalidateQueries({ queryKey: ["budget-progress"] });
    },
  });
}

export function useDeleteBudget() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.del(`/budgets/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["budgets"] });
      qc.invalidateQueries({ queryKey: ["budget-progress"] });
    },
  });
}

export function useBudgetProgress() {
  return useQuery({
    queryKey: ["budget-progress"],
    queryFn: () => api.get<BudgetProgressResponse>("/budgets/progress"),
  });
}
