"use client";

import { useState, useCallback } from "react";
import { useInvoices, useUploadUrl, useCreateInvoice } from "@/hooks/use-invoices";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Upload, FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";

function statusVariant(status: string) {
  switch (status) {
    case "EXTRACTED": return "default" as const;
    case "PROCESSING": return "secondary" as const;
    case "FAILED": return "destructive" as const;
    default: return "outline" as const;
  }
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / 1048576).toFixed(1) + " MB";
}

export default function InvoicesPage() {
  const [page, setPage] = useState(0);
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  const { data, isLoading } = useInvoices({ page: page.toString(), size: "20" });
  const uploadUrl = useUploadUrl();
  const createInvoice = useCreateInvoice();

  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      // Step 1: Get presigned URL
      const { uploadUrl: presignedUrl, fileKey } = await uploadUrl.mutateAsync({
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
      });

      // Step 2: Upload to R2
      await fetch(presignedUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });

      // Step 3: Register invoice
      await createInvoice.mutateAsync({
        fileKey,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
      });

      toast.success("Invoice uploaded! AI is processing it...");
      setOpen(false);
    } catch {
      toast.error("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }, [uploadUrl, createInvoice]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Invoices</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Upload Invoice
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Invoice</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                {uploading ? (
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">
                      Uploading and processing...
                    </p>
                  </div>
                ) : (
                  <label className="cursor-pointer flex flex-col items-center gap-2">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <p className="text-sm font-medium">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PDF, PNG, JPEG, WebP (max 10MB)
                    </p>
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.png,.jpg,.jpeg,.webp"
                      onChange={handleFileUpload}
                    />
                  </label>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>File</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Uploaded By</TableHead>
              <TableHead>Expense</TableHead>
              <TableHead>Date</TableHead>
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
                  No invoices yet. Upload your first invoice!
                </TableCell>
              </TableRow>
            ) : (
              data?.content?.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{invoice.fileName}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{formatBytes(invoice.fileSize)}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant(invoice.status)}>
                      {invoice.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    {invoice.uploadedBy?.fullName || "-"}
                  </TableCell>
                  <TableCell className="text-sm">
                    {invoice.expense ? (
                      <span>
                        {invoice.expense.vendorName} —{" "}
                        {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(invoice.expense.amount)}
                      </span>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell className="text-sm">
                    {new Date(invoice.createdAt).toLocaleDateString()}
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
            Showing {data.content.length} of {data.totalElements} invoices
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
