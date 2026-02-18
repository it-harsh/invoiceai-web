export const ROUTES = {
  home: "/",
  login: "/login",
  register: "/register",
  dashboard: "/dashboard",
  expenses: "/expenses",
  invoices: "/invoices",
  settings: {
    profile: "/settings/profile",
    organization: "/settings/organization",
    categories: "/settings/categories",
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
