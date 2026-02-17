import { create } from "zustand";
import type { User, Organization } from "@/types/api";

interface AuthState {
  user: User | null;
  organizations: Organization[];
  currentOrgId: string | null;
  setAuth: (user: User, organizations: Organization[]) => void;
  setCurrentOrg: (orgId: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  organizations: [],
  currentOrgId: null,
  setAuth: (user, organizations) =>
    set({
      user,
      organizations,
      currentOrgId: organizations[0]?.id || null,
    }),
  setCurrentOrg: (orgId) => set({ currentOrgId: orgId }),
  logout: () =>
    set({ user: null, organizations: [], currentOrgId: null }),
}));
