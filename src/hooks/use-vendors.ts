"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { VendorResponse, Page } from "@/types/api";

interface VendorFilters {
  page?: string;
  size?: string;
}

export function useVendors(filters: VendorFilters = {}) {
  return useQuery({
    queryKey: ["vendors", filters],
    queryFn: () =>
      api.get<Page<VendorResponse>>("/vendors", filters as Record<string, string>),
  });
}

export function useUpdateVendor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { defaultCategoryId: string } }) =>
      api.patch<VendorResponse>(`/vendors/${id}`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["vendors"] });
    },
  });
}
