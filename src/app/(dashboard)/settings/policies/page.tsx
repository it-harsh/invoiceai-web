"use client";

import { useState } from "react";
import { usePolicies, useCreatePolicy, useDeletePolicy, useUpdatePolicy, usePolicyViolations } from "@/hooks/use-policies";
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
import { Plus, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import { toast } from "sonner";
import type { Category } from "@/types/api";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
}

export default function PoliciesPage() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [ruleType, setRuleType] = useState("MAX_AMOUNT_PER_EXPENSE");
  const [categoryId, setCategoryId] = useState("");
  const [threshold, setThreshold] = useState("");
  const [requiredField, setRequiredField] = useState("");
  const [violationPage, setViolationPage] = useState(0);

  const { data: policies, isLoading } = usePolicies();
  const { data: violations, isLoading: violationsLoading } = usePolicyViolations({
    page: violationPage.toString(),
    size: "10",
  });
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => api.get<Category[]>("/categories"),
  });

  const createPolicy = useCreatePolicy();
  const deletePolicy = useDeletePolicy();
  const updatePolicy = useUpdatePolicy();

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    createPolicy.mutate(
      {
        name,
        ruleType,
        categoryId: categoryId || undefined,
        thresholdAmount: threshold ? parseFloat(threshold) : undefined,
        requiredField: ruleType === "REQUIRED_FIELD" ? requiredField : undefined,
      },
      {
        onSuccess: () => {
          toast.success("Policy created");
          setOpen(false);
          setName("");
          setThreshold("");
          setRequiredField("");
          setCategoryId("");
        },
        onError: () => toast.error("Failed to create policy"),
      }
    );
  }

  function toggleActive(id: string, currentActive: boolean) {
    updatePolicy.mutate(
      { id, data: { isActive: !currentActive } },
      {
        onSuccess: () => toast.success(currentActive ? "Policy disabled" : "Policy enabled"),
        onError: () => toast.error("Failed to update policy"),
      }
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Expense Policies</h1>
          <p className="text-muted-foreground text-sm">
            Define rules to flag expenses that violate spending limits
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Policy
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New Policy</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Max travel expense" required />
              </div>
              <div className="space-y-2">
                <Label>Rule Type</Label>
                <Select value={ruleType} onValueChange={setRuleType}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MAX_AMOUNT_PER_EXPENSE">Max Amount Per Expense</SelectItem>
                    <SelectItem value="MAX_AMOUNT_PER_CATEGORY_MONTHLY">Max Category Monthly</SelectItem>
                    <SelectItem value="REQUIRED_FIELD">Required Field</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {ruleType !== "REQUIRED_FIELD" && (
                <div className="space-y-2">
                  <Label>Threshold ($)</Label>
                  <Input type="number" step="0.01" min="0.01" value={threshold} onChange={(e) => setThreshold(e.target.value)} placeholder="500.00" required />
                </div>
              )}
              {ruleType === "REQUIRED_FIELD" && (
                <div className="space-y-2">
                  <Label>Required Field</Label>
                  <Select value={requiredField} onValueChange={setRequiredField}>
                    <SelectTrigger><SelectValue placeholder="Select field" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="description">Description</SelectItem>
                      <SelectItem value="category">Category</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="space-y-2">
                <Label>Category (optional)</Label>
                <Select value={categoryId} onValueChange={setCategoryId}>
                  <SelectTrigger><SelectValue placeholder="All categories" /></SelectTrigger>
                  <SelectContent>
                    {categories?.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full" disabled={createPolicy.isPending}>
                {createPolicy.isPending ? "Creating..." : "Create Policy"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Rule Type</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Threshold</TableHead>
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
            ) : policies?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No policies defined</TableCell>
              </TableRow>
            ) : (
              policies?.map((policy) => (
                <TableRow key={policy.id}>
                  <TableCell className="font-medium">{policy.name}</TableCell>
                  <TableCell className="text-sm">{policy.ruleType.replace(/_/g, " ")}</TableCell>
                  <TableCell className="text-sm">{policy.category?.name || "All"}</TableCell>
                  <TableCell className="text-right font-mono">
                    {policy.thresholdAmount ? formatCurrency(policy.thresholdAmount) : policy.requiredField || "—"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={policy.isActive ? "default" : "secondary"}>
                      {policy.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => toggleActive(policy.id, policy.isActive)}>
                        {policy.isActive ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-destructive"
                        onClick={() => deletePolicy.mutate(policy.id, {
                          onSuccess: () => toast.success("Policy deleted"),
                          onError: () => toast.error("Failed to delete"),
                        })}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-3">Recent Violations</h2>
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Policy</TableHead>
                <TableHead>Violation</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {violationsLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 5 }).map((_, j) => (
                      <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                    ))}
                  </TableRow>
                ))
              ) : violations?.content?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">No violations</TableCell>
                </TableRow>
              ) : (
                violations?.content?.map((v) => (
                  <TableRow key={v.id}>
                    <TableCell className="text-sm whitespace-nowrap">{new Date(v.createdAt).toLocaleString()}</TableCell>
                    <TableCell className="font-medium">{v.vendorName}</TableCell>
                    <TableCell className="text-right font-mono">{formatCurrency(v.expenseAmount)}</TableCell>
                    <TableCell className="text-sm">{v.policyName}</TableCell>
                    <TableCell className="text-sm text-destructive">{v.violationMessage}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        {violations && violations.totalPages > 1 && (
          <div className="flex justify-end gap-2 mt-3">
            <Button variant="outline" size="sm" disabled={violationPage === 0} onClick={() => setViolationPage(violationPage - 1)}>Previous</Button>
            <Button variant="outline" size="sm" disabled={violationPage >= violations.totalPages - 1} onClick={() => setViolationPage(violationPage + 1)}>Next</Button>
          </div>
        )}
      </div>
    </div>
  );
}
