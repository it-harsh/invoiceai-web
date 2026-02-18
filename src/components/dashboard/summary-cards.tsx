"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DollarSign, Receipt, TrendingUp, Tag } from "lucide-react";
import { useDashboardSummary } from "@/hooks/use-dashboard";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function SummaryCards() {
  const { data, isLoading } = useDashboardSummary();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: "Total Spend",
      value: formatCurrency(data?.totalSpend || 0),
      change: data?.vsLastPeriod?.totalSpendChange,
      icon: DollarSign,
    },
    {
      title: "Expenses",
      value: data?.expenseCount?.toString() || "0",
      change: data?.vsLastPeriod?.expenseCountChange,
      icon: Receipt,
    },
    {
      title: "Average Expense",
      value: formatCurrency(data?.averageExpense || 0),
      icon: TrendingUp,
    },
    {
      title: "Top Category",
      value: data?.topCategory?.name || "N/A",
      subtitle: data?.topCategory
        ? formatCurrency(data.topCategory.amount)
        : undefined,
      icon: Tag,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <card.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            {card.change !== undefined && (
              <p
                className={`text-xs mt-1 ${
                  card.change >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                }`}
              >
                {card.change >= 0 ? "+" : ""}
                {card.change}% from last period
              </p>
            )}
            {card.subtitle && (
              <p className="text-xs text-muted-foreground mt-1">
                {card.subtitle}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
