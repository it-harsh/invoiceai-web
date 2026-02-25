"use client";

import { useState } from "react";
import { useBudgets, useCreateBudget, useDeleteBudget } from "@/hooks/use-budgets";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { Category } from "@/types/api";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
}

export default function BudgetsPage() {
  const [open, setOpen] = useState(false);
  const [categoryId, setCategoryId] = useState("overall");
  const [monthlyLimit, setMonthlyLimit] = useState("");

  const { data: budgets, isLoading } = useBudgets();
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => api.get<Category[]>("/categories"),
  });

  const createBudget = useCreateBudget();
  const deleteBudget = useDeleteBudget();

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    createBudget.mutate(
      {
        categoryId: categoryId === "overall" ? undefined : categoryId,
        monthlyLimit: parseFloat(monthlyLimit),
      },
      {
        onSuccess: () => {
          toast.success("Budget created");
          setOpen(false);
          setCategoryId("overall");
          setMonthlyLimit("");
        },
        onError: () => toast.error("Failed to create budget"),
      }
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Budgets</h1>
          <p className="text-muted-foreground text-sm">
            Set monthly spending limits — get alerts at 80% and 100%
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Budget
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New Budget</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2">
                <Label>Scope</Label>
                <Select value={categoryId} onValueChange={setCategoryId}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="overall">Overall (all categories)</SelectItem>
                    {categories?.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        <div className="flex items-center gap-2">
                          <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                          {cat.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Monthly Limit ($)</Label>
                <Input type="number" step="1" min="1" value={monthlyLimit} onChange={(e) => setMonthlyLimit(e.target.value)} placeholder="5000" required />
              </div>
              <Button type="submit" className="w-full" disabled={createBudget.isPending}>
                {createBudget.isPending ? "Creating..." : "Create Budget"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Scope</TableHead>
              <TableHead className="text-right">Monthly Limit</TableHead>
              <TableHead>Alert 80%</TableHead>
              <TableHead>Alert 100%</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 6 }).map((_, j) => (
                    <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                  ))}
                </TableRow>
              ))
            ) : budgets?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No budgets defined</TableCell>
              </TableRow>
            ) : (
              budgets?.map((budget) => (
                <TableRow key={budget.id}>
                  <TableCell className="font-medium">
                    {budget.category ? (
                      <div className="flex items-center gap-2">
                        <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: budget.category.color }} />
                        {budget.category.name}
                      </div>
                    ) : "Overall"}
                  </TableCell>
                  <TableCell className="text-right font-mono">{formatCurrency(budget.monthlyLimit)}</TableCell>
                  <TableCell>{budget.alertAt80 ? "Yes" : "No"}</TableCell>
                  <TableCell>{budget.alertAt100 ? "Yes" : "No"}</TableCell>
                  <TableCell>
                    <Badge variant={budget.isActive ? "default" : "secondary"}>
                      {budget.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-destructive"
                      onClick={() => deleteBudget.mutate(budget.id, {
                        onSuccess: () => toast.success("Budget deleted"),
                        onError: () => toast.error("Failed to delete"),
                      })}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
