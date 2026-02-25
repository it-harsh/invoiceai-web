"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { PolicyResponse, PolicyViolationResponse, Page } from "@/types/api";

export function usePolicies() {
  return useQuery({
    queryKey: ["policies"],
    queryFn: () => api.get<PolicyResponse[]>("/policies"),
  });
}

export function useCreatePolicy() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      api.post<PolicyResponse>("/policies", data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["policies"] });
    },
  });
}

export function useUpdatePolicy() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      api.patch<PolicyResponse>(`/policies/${id}`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["policies"] });
    },
  });
}

export function useDeletePolicy() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.del(`/policies/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["policies"] });
    },
  });
}

export function usePolicyViolations(filters: { page?: string; size?: string } = {}) {
  return useQuery({
    queryKey: ["policy-violations", filters],
    queryFn: () =>
      api.get<Page<PolicyViolationResponse>>("/policies/violations", filters as Record<string, string>),
  });
}
