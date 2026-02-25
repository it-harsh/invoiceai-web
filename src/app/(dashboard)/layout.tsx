"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { useAuthStore } from "@/lib/store";
import { ROUTES } from "@/lib/constants";
import { AssistantChatButton } from "@/components/assistant/assistant-chat-button";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, setAuth } = useAuthStore();
  const [loading, setLoading] = useState(!user);

  useEffect(() => {
    if (user) return;

    fetch("/api/auth/me")
      .then((res) => {
        if (!res.ok) throw new Error("Not authenticated");
        return res.json();
      })
      .then((data) => {
        // Redirect unverified users to verify-email page
        if (!data.user.emailVerified) {
          router.push(ROUTES.verifyEmail);
          return;
        }
        setAuth(data.user, data.organizations);
      })
      .catch(() => {
        router.push(ROUTES.login);
      })
      .finally(() => setLoading(false));
  }, [user, setAuth, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6">{children}</main>
      </div>
      <AssistantChatButton />
    </div>
  );
}
