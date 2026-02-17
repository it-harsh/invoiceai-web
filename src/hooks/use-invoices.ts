"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { InvoiceResponse, Page } from "@/types/api";

export function useInvoices(filters: Record<string, string> = {}) {
  return useQuery({
    queryKey: ["invoices", filters],
    queryFn: () =>
      api.get<Page<InvoiceResponse>>("/invoices", filters),
  });
}

export function useInvoice(id: string) {
  return useQuery({
    queryKey: ["invoices", id],
    queryFn: () => api.get<InvoiceResponse>(`/invoices/${id}`),
    enabled: !!id,
  });
}

export function useUploadUrl() {
  return useMutation({
    mutationFn: (data: { fileName: string; fileType: string; fileSize: number }) =>
      api.post<{ uploadUrl: string; fileKey: string }>("/invoices/upload-url", data),
  });
}

export function useCreateInvoice() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { fileKey: string; fileName: string; fileSize: number; fileType: string }) =>
      api.post<InvoiceResponse>("/invoices", data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["invoices"] });
    },
  });
}
