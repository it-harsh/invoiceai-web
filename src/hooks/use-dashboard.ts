"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type {
  DashboardSummary,
  SpendByCategory,
  MonthlyTrend,
  TopVendors,
} from "@/types/api";

export function useDashboardSummary(period = "current_month") {
  return useQuery({
    queryKey: ["dashboard", "summary", period],
    queryFn: () =>
      api.get<DashboardSummary>("/dashboard/summary", { period }),
  });
}

export function useSpendByCategory(period = "current_month") {
  return useQuery({
    queryKey: ["dashboard", "spend-by-category", period],
    queryFn: () =>
      api.get<SpendByCategory>("/dashboard/spend-by-category", { period }),
  });
}

export function useMonthlyTrend() {
  return useQuery({
    queryKey: ["dashboard", "monthly-trend"],
    queryFn: () => api.get<MonthlyTrend>("/dashboard/monthly-trend"),
  });
}

export function useTopVendors(limit = 10) {
  return useQuery({
    queryKey: ["dashboard", "top-vendors", limit],
    queryFn: () =>
      api.get<TopVendors>("/dashboard/top-vendors", {
        limit: limit.toString(),
      }),
  });
}
