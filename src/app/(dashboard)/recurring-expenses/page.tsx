"use client";

import { useState } from "react";
import { useRecurringExpenses, useCreateRecurringExpense, useDeleteRecurringExpense } from "@/hooks/use-recurring-expenses";
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
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { Category } from "@/types/api";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
}

export default function RecurringExpensesPage() {
  const [open, setOpen] = useState(false);
  const [vendor, setVendor] = useState("");
  const [amount, setAmount] = useState("");
  const [frequency, setFrequency] = useState("MONTHLY");
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");

  const { data: recurring, isLoading } = useRecurringExpenses();
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => api.get<Category[]>("/categories"),
  });

  const createRecurring = useCreateRecurringExpense();
  const deleteRecurring = useDeleteRecurringExpense();

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    createRecurring.mutate(
      {
        vendorName: vendor,
        amount: parseFloat(amount),
        frequency,
        startDate,
        categoryId: categoryId || undefined,
        description: description || undefined,
        currency: "USD",
      },
      {
        onSuccess: () => {
          toast.success("Recurring expense created");
          setOpen(false);
          setVendor("");
          setAmount("");
          setDescription("");
          setCategoryId("");
        },
        onError: () => toast.error("Failed to create"),
      }
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Recurring Expenses</h1>
          <p className="text-muted-foreground text-sm">
            Auto-created expenses on a schedule — processed daily at 1 AM UTC
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Recurring
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New Recurring Expense</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2">
                <Label>Vendor Name</Label>
                <Input value={vendor} onChange={(e) => setVendor(e.target.value)} placeholder="e.g. Slack" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Amount ($)</Label>
                  <Input type="number" step="0.01" min="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="29.99" required />
                </div>
                <div className="space-y-2">
                  <Label>Frequency</Label>
                  <Select value={frequency} onValueChange={setFrequency}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="WEEKLY">Weekly</SelectItem>
                      <SelectItem value="MONTHLY">Monthly</SelectItem>
                      <SelectItem value="QUARTERLY">Quarterly</SelectItem>
                      <SelectItem value="YEARLY">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={categoryId} onValueChange={setCategoryId}>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
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
                <Label>Description (optional)</Label>
                <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Monthly subscription" />
              </div>
              <Button type="submit" className="w-full" disabled={createRecurring.isPending}>
                {createRecurring.isPending ? "Creating..." : "Create Recurring Expense"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Vendor</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Frequency</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Next Due</TableHead>
              <TableHead>Last Created</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 8 }).map((_, j) => (
                    <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                  ))}
                </TableRow>
              ))
            ) : recurring?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">No recurring expenses</TableCell>
              </TableRow>
            ) : (
              recurring?.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.vendorName}</TableCell>
                  <TableCell className="text-right font-mono">{formatCurrency(item.amount)}</TableCell>
                  <TableCell className="text-sm">{item.frequency}</TableCell>
                  <TableCell>
                    {item.category ? (
                      <div className="flex items-center gap-2">
                        <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.category.color }} />
                        <span className="text-sm">{item.category.name}</span>
                      </div>
                    ) : null}
                  </TableCell>
                  <TableCell className="text-sm">{item.nextDueDate}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {item.lastCreatedAt ? new Date(item.lastCreatedAt).toLocaleDateString() : "Never"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={item.isActive ? "default" : "secondary"}>
                      {item.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-destructive"
                      onClick={() => deleteRecurring.mutate(item.id, {
                        onSuccess: () => toast.success("Deleted"),
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
