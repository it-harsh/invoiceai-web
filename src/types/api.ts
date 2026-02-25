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
  isDuplicate: boolean;
  duplicateOfId: string | null;
  policyViolations: { policyId: string; policyName: string; message: string }[] | null;
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

export interface ChatMessageEntry {
  role: "user" | "assistant";
  content: string;
}

export interface AssistantChatRequest {
  message: string;
  history: ChatMessageEntry[];
}

export interface AssistantChatResponse {
  reply: string;
}

// --- New feature types ---

export interface VendorResponse {
  id: string;
  name: string;
  defaultCategory: { id: string; name: string; color: string } | null;
  expenseCount: number;
  totalAmount: number;
  lastExpenseDate: string | null;
}

export interface AuditLogResponse {
  id: string;
  user: { id: string; fullName: string } | null;
  entityType: string;
  entityId: string;
  action: string;
  changes: string | null;
  ipAddress: string | null;
  createdAt: string;
}

export interface TaxSummaryResponse {
  totalTax: number;
  byCategory: { categoryName: string; taxAmount: number }[];
  byVendor: { vendorName: string; taxAmount: number }[];
}

export interface PolicyResponse {
  id: string;
  name: string;
  ruleType: string;
  category: { id: string; name: string } | null;
  thresholdAmount: number | null;
  requiredField: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface PolicyViolationResponse {
  id: string;
  expenseId: string;
  vendorName: string;
  expenseAmount: number;
  policyName: string;
  violationMessage: string;
  createdAt: string;
}

export interface BudgetResponse {
  id: string;
  category: { id: string; name: string; color: string } | null;
  monthlyLimit: number;
  alertAt80: boolean;
  alertAt100: boolean;
  isActive: boolean;
  createdAt: string;
}

export interface BudgetProgressResponse {
  overall: BudgetProgressItem | null;
  byCategory: BudgetProgressItem[];
}

export interface BudgetProgressItem {
  budgetId: string;
  categoryName: string;
  categoryColor: string | null;
  monthlyLimit: number;
  actualSpend: number;
  percentage: number;
  status: "OK" | "WARNING" | "EXCEEDED";
}

export interface RecurringExpenseResponse {
  id: string;
  vendorName: string;
  amount: number;
  currency: string;
  taxAmount: number;
  description: string | null;
  category: { id: string; name: string; color: string } | null;
  frequency: string;
  nextDueDate: string;
  lastCreatedAt: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface BulkCreateExpenseResponse {
  total: number;
  created: number;
  duplicates: number;
  expenses: ExpenseResponse[];
  errors: { index: number; message: string }[];
}
