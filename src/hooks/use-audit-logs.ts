"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { AuditLogResponse, Page } from "@/types/api";

interface AuditLogFilters {
  page?: string;
  size?: string;
  entityType?: string;
  dateFrom?: string;
  dateTo?: string;
}

export function useAuditLogs(filters: AuditLogFilters = {}) {
  return useQuery({
    queryKey: ["audit-logs", filters],
    queryFn: () =>
      api.get<Page<AuditLogResponse>>("/audit-logs", filters as Record<string, string>),
  });
}
