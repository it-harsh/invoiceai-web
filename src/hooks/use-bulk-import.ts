"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { BulkCreateExpenseResponse } from "@/types/api";

export function useBulkImportExpenses() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { expenses: Record<string, unknown>[] }) =>
      api.post<BulkCreateExpenseResponse>("/expenses/bulk", data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["expenses"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
      qc.invalidateQueries({ queryKey: ["vendors"] });
    },
  });
}
