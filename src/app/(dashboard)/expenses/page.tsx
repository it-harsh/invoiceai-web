"use client";

import { useState } from "react";
import { useExpenses, useApproveExpense, useRejectExpense, useCreateExpense } from "@/hooks/use-expenses";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Check, X, Search, Download, Plus } from "lucide-react";
import { toast } from "sonner";
import type { Category } from "@/types/api";

function formatCurrency(amount: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
}

function statusVariant(status: string) {
  switch (status) {
    case "APPROVED": return "default" as const;
    case "REJECTED": return "destructive" as const;
    default: return "secondary" as const;
  }
}

export default function ExpensesPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("");
  const [page, setPage] = useState(0);
  const [addOpen, setAddOpen] = useState(false);
  const [vendor, setVendor] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const { data, isLoading } = useExpenses({
    search: search || undefined,
    status: status || undefined,
    page: page.toString(),
    size: "20",
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => api.get<Category[]>("/categories"),
  });

  const approve = useApproveExpense();
  const reject = useRejectExpense();
  const createExpense = useCreateExpense();

  function handleApprove(id: string) {
    approve.mutate(id, {
      onSuccess: () => toast.success("Expense approved"),
      onError: () => toast.error("Failed to approve"),
    });
  }

  function handleReject(id: string) {
    reject.mutate(
      { id, reason: "Rejected by reviewer" },
      {
        onSuccess: () => toast.success("Expense rejected"),
        onError: () => toast.error("Failed to reject"),
      }
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Expenses</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <a href="/api/expenses/export" download>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </a>
          </Button>
          <Dialog open={addOpen} onOpenChange={setAddOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Expense
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Manual Expense</DialogTitle>
              </DialogHeader>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  createExpense.mutate(
                    {
                      vendorName: vendor,
                      amount: parseFloat(amount),
                      date,
                      description: description || undefined,
                      categoryId: categoryId || undefined,
                      currency: "USD",
                    },
                    {
                      onSuccess: () => {
                        toast.success("Expense added");
                        setAddOpen(false);
                        setVendor("");
                        setAmount("");
                        setDescription("");
                        setCategoryId("");
                      },
                      onError: () => toast.error("Failed to add expense"),
                    }
                  );
                }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="vendor">Vendor Name</Label>
                  <Input id="vendor" value={vendor} onChange={(e) => setVendor(e.target.value)} placeholder="e.g. Amazon" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount ($)</Label>
                    <Input id="amount" type="number" step="0.01" min="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={categoryId} onValueChange={setCategoryId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
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
                  <Label htmlFor="desc">Description (optional)</Label>
                  <Textarea id="desc" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What was this expense for?" />
                </div>
                <Button type="submit" className="w-full" disabled={createExpense.isPending}>
                  {createExpense.isPending ? "Adding..." : "Add Expense"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search vendor, description..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            className="pl-9"
          />
        </div>
        <Select value={status} onValueChange={(v) => { setStatus(v === "ALL" ? "" : v); setPage(0); }}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All statuses</SelectItem>
            <SelectItem value="NEEDS_REVIEW">Needs Review</SelectItem>
            <SelectItem value="APPROVED">Approved</SelectItem>
            <SelectItem value="REJECTED">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Confidence</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 7 }).map((_, j) => (
                    <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                  ))}
                </TableRow>
              ))
            ) : data?.content?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No expenses found
                </TableCell>
              </TableRow>
            ) : (
              data?.content?.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell className="text-sm">{expense.date}</TableCell>
                  <TableCell className="font-medium">{expense.vendorName}</TableCell>
                  <TableCell>
                    {expense.category && (
                      <div className="flex items-center gap-2">
                        <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: expense.category.color }} />
                        <span className="text-sm">{expense.category.name}</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {formatCurrency(expense.amount, expense.currency)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariant(expense.status)}>
                      {expense.status.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {expense.aiConfidence != null && (
                      <span className="text-sm text-muted-foreground">
                        {(expense.aiConfidence * 100).toFixed(0)}%
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {expense.status === "NEEDS_REVIEW" && (
                      <div className="flex justify-end gap-1">
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-green-600" onClick={() => handleApprove(expense.id)}>
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-red-600" onClick={() => handleReject(expense.id)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {data.content.length} of {data.totalElements} expenses
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(page - 1)}>
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled={page >= data.totalPages - 1} onClick={() => setPage(page + 1)}>
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
