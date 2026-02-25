export const ROUTES = {
  home: "/",
  login: "/login",
  register: "/register",
  dashboard: "/dashboard",
  expenses: "/expenses",
  invoices: "/invoices",
  vendors: "/vendors",
  recurring: "/recurring-expenses",
  reports: {
    taxSummary: "/reports/tax-summary",
  },
  settings: {
    profile: "/settings/profile",
    organization: "/settings/organization",
    categories: "/settings/categories",
    policies: "/settings/policies",
    budgets: "/settings/budgets",
    auditLogs: "/settings/audit-logs",
    billing: "/settings/billing",
    members: "/settings/members",
  },
  pricing: "/pricing",
} as const;

export const API_ROUTES = {
  auth: {
    login: "/api/auth/login",
    register: "/api/auth/register",
    refresh: "/api/auth/refresh",
    logout: "/api/auth/logout",
    me: "/api/auth/me",
  },
  expenses: "/api/expenses",
  invoices: "/api/invoices",
  categories: "/api/categories",
  organizations: "/api/organizations",
  vendors: "/api/vendors",
  auditLogs: "/api/audit-logs",
  policies: "/api/policies",
  budgets: "/api/budgets",
  recurringExpenses: "/api/recurring-expenses",
  reports: {
    taxSummary: "/api/reports/tax-summary",
  },
  dashboard: {
    summary: "/api/dashboard/summary",
    spendByCategory: "/api/dashboard/spend-by-category",
    monthlyTrend: "/api/dashboard/monthly-trend",
    topVendors: "/api/dashboard/top-vendors",
  },
  assistant: {
    chat: "/api/assistant/chat",
  },
} as const;
