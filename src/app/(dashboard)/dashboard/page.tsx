"use client";

import { SummaryCards } from "@/components/dashboard/summary-cards";
import { SpendByCategoryChart } from "@/components/dashboard/spend-by-category-chart";
import { MonthlyTrendChart } from "@/components/dashboard/monthly-trend-chart";
import { BudgetProgress } from "@/components/dashboard/budget-progress";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <SummaryCards />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SpendByCategoryChart />
        <MonthlyTrendChart />
      </div>
      <BudgetProgress />
    </div>
  );
}
