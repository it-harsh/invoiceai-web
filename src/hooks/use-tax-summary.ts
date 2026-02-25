"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { TaxSummaryResponse } from "@/types/api";

export function useTaxSummary(dateFrom: string, dateTo: string) {
  return useQuery({
    queryKey: ["tax-summary", dateFrom, dateTo],
    queryFn: () =>
      api.get<TaxSummaryResponse>("/reports/tax-summary", { dateFrom, dateTo }),
    enabled: !!dateFrom && !!dateTo,
  });
}
