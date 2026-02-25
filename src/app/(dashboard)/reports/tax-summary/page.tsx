"use client";

import { useState } from "react";
import { useTaxSummary } from "@/hooks/use-tax-summary";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { DollarSign } from "lucide-react";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
}

export default function TaxSummaryPage() {
  const now = new Date();
  const [dateFrom, setDateFrom] = useState(
    new Date(now.getFullYear(), 0, 1).toISOString().split("T")[0]
  );
  const [dateTo, setDateTo] = useState(now.toISOString().split("T")[0]);

  const { data, isLoading } = useTaxSummary(dateFrom, dateTo);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Tax Summary</h1>
        <p className="text-muted-foreground text-sm">
          Tax breakdown by category and vendor for approved expenses
        </p>
      </div>

      <div className="flex gap-3 items-end">
        <div className="space-y-1">
          <Label className="text-xs">From</Label>
          <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="w-40" />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">To</Label>
          <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="w-40" />
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Tax</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-8 w-32" />
          ) : (
            <div className="text-2xl font-bold">{formatCurrency(data?.totalTax ?? 0)}</div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg font-semibold mb-3">By Category</h2>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Tax Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                    </TableRow>
                  ))
                ) : data?.byCategory?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center py-6 text-muted-foreground">No data</TableCell>
                  </TableRow>
                ) : (
                  data?.byCategory?.map((item, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">{item.categoryName}</TableCell>
                      <TableCell className="text-right font-mono">{formatCurrency(item.taxAmount)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-3">By Vendor</h2>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vendor</TableHead>
                  <TableHead className="text-right">Tax Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                    </TableRow>
                  ))
                ) : data?.byVendor?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center py-6 text-muted-foreground">No data</TableCell>
                  </TableRow>
                ) : (
                  data?.byVendor?.map((item, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">{item.vendorName}</TableCell>
                      <TableCell className="text-right font-mono">{formatCurrency(item.taxAmount)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
