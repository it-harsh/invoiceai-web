"use client";

import { useBudgetProgress } from "@/hooks/use-budgets";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
}

function statusColor(status: string) {
  switch (status) {
    case "EXCEEDED": return "bg-red-500";
    case "WARNING": return "bg-amber-500";
    default: return "bg-green-500";
  }
}

function statusText(status: string) {
  switch (status) {
    case "EXCEEDED": return "text-red-600 dark:text-red-400";
    case "WARNING": return "text-amber-600 dark:text-amber-400";
    default: return "text-green-600 dark:text-green-400";
  }
}

export function BudgetProgress() {
  const { data, isLoading } = useBudgetProgress();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">Budget Progress</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  const items = [
    ...(data?.overall ? [data.overall] : []),
    ...(data?.byCategory || []),
  ];

  if (items.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground">Budget Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((item) => (
          <div key={item.budgetId}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium">{item.categoryName}</span>
              <span className={cn("text-sm font-medium", statusText(item.status))}>
                {item.percentage.toFixed(0)}%
              </span>
            </div>
            <div className="h-2 rounded-full bg-muted">
              <div
                className={cn("h-2 rounded-full transition-all", statusColor(item.status))}
                style={{ width: `${Math.min(item.percentage, 100)}%` }}
              />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-xs text-muted-foreground">
                {formatCurrency(item.actualSpend)}
              </span>
              <span className="text-xs text-muted-foreground">
                {formatCurrency(item.monthlyLimit)}
              </span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
