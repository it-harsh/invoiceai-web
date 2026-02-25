"use client";

import { useState } from "react";
import { useVendors, useUpdateVendor } from "@/hooks/use-vendors";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
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
import { Pencil } from "lucide-react";
import { toast } from "sonner";
import type { Category } from "@/types/api";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
}

export default function VendorsPage() {
  const [page, setPage] = useState(0);
  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState("");
  const [editCategoryId, setEditCategoryId] = useState("");

  const { data, isLoading } = useVendors({ page: page.toString(), size: "20" });
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => api.get<Category[]>("/categories"),
  });
  const updateVendor = useUpdateVendor();

  function openEdit(vendorId: string, currentCategoryId: string | null) {
    setEditId(vendorId);
    setEditCategoryId(currentCategoryId || "");
    setEditOpen(true);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Vendor Directory</h1>
        <p className="text-muted-foreground text-sm">
          Auto-maintained from your expenses — set default categories per vendor
        </p>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Vendor</TableHead>
              <TableHead>Default Category</TableHead>
              <TableHead className="text-right">Expenses</TableHead>
              <TableHead className="text-right">Total Spend</TableHead>
              <TableHead>Last Expense</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 6 }).map((_, j) => (
                    <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                  ))}
                </TableRow>
              ))
            ) : data?.content?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No vendors yet — create expenses to auto-populate
                </TableCell>
              </TableRow>
            ) : (
              data?.content?.map((vendor) => (
                <TableRow key={vendor.id}>
                  <TableCell className="font-medium">{vendor.name}</TableCell>
                  <TableCell>
                    {vendor.defaultCategory ? (
                      <div className="flex items-center gap-2">
                        <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: vendor.defaultCategory.color }} />
                        <span className="text-sm">{vendor.defaultCategory.name}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">None</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">{vendor.expenseCount}</TableCell>
                  <TableCell className="text-right font-mono">{formatCurrency(vendor.totalAmount)}</TableCell>
                  <TableCell className="text-sm">{vendor.lastExpenseDate || "—"}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
                      onClick={() => openEdit(vendor.id, vendor.defaultCategory?.id || null)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
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
            Showing {data.content.length} of {data.totalElements} vendors
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(page - 1)}>Previous</Button>
            <Button variant="outline" size="sm" disabled={page >= data.totalPages - 1} onClick={() => setPage(page + 1)}>Next</Button>
          </div>
        </div>
      )}

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Default Category</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              updateVendor.mutate(
                { id: editId, data: { defaultCategoryId: editCategoryId } },
                {
                  onSuccess: () => { toast.success("Vendor updated"); setEditOpen(false); },
                  onError: () => toast.error("Failed to update vendor"),
                }
              );
            }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label>Default Category</Label>
              <Select value={editCategoryId} onValueChange={setEditCategoryId}>
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
            <Button type="submit" className="w-full" disabled={updateVendor.isPending}>
              {updateVendor.isPending ? "Saving..." : "Save"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
