"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useSpendByCategory } from "@/hooks/use-dashboard";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

export function SpendByCategoryChart() {
  const { data, isLoading } = useSpendByCategory();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Spend by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  const categories = data?.categories || [];

  if (categories.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Spend by Category</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64 text-muted-foreground">
          No expense data yet
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Spend by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categories}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                dataKey="amount"
                nameKey="name"
              >
                {categories.map((cat, i) => (
                  <Cell key={i} fill={cat.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) =>
                  new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(Number(value))
                }
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-wrap gap-3 mt-4">
          {categories.map((cat) => (
            <div key={cat.name} className="flex items-center gap-2 text-sm">
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: cat.color }}
              />
              <span className="text-muted-foreground">
                {cat.name} ({cat.percentage}%)
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
