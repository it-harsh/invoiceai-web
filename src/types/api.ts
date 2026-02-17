export interface User {
  id: string;
  email: string;
  fullName: string;
  avatarUrl: string | null;
  emailVerified: boolean;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  plan: string;
  role: string;
}

export interface AuthResponse {
  user: User;
  organizations: Organization[];
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string | null;
  isDefault: boolean;
}

export interface InvoiceResponse {
  id: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  status: "UPLOADED" | "PROCESSING" | "EXTRACTED" | "FAILED";
  uploadedBy: { id: string; fullName: string } | null;
  expense: { id: string; vendorName: string; amount: number } | null;
  errorMessage: string | null;
  createdAt: string;
}

export interface ExpenseResponse {
  id: string;
  vendorName: string;
  amount: number;
  currency: string;
  taxAmount: number;
  date: string;
  description: string | null;
  category: { id: string; name: string; color: string } | null;
  status: "NEEDS_REVIEW" | "APPROVED" | "REJECTED";
  aiConfidence: number | null;
  invoice: { id: string; fileName: string } | null;
  lineItems: LineItem[] | null;
  createdAt: string;
}

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface DashboardSummary {
  totalSpend: number;
  expenseCount: number;
  averageExpense: number;
  topCategory: { name: string; amount: number } | null;
  vsLastPeriod: {
    totalSpendChange: number;
    expenseCountChange: number;
  };
}

export interface SpendByCategory {
  categories: {
    name: string;
    color: string;
    amount: number;
    percentage: number;
  }[];
}

export interface MonthlyTrend {
  months: {
    month: string;
    amount: number;
    count: number;
  }[];
}

export interface TopVendors {
  vendors: {
    name: string;
    amount: number;
    count: number;
  }[];
}

export interface Page<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface ApiError {
  error: string;
  message: string;
  details?: Record<string, string>;
}
