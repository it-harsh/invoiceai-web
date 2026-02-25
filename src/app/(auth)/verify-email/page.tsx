"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { FileText, CheckCircle, XCircle, Mail, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ROUTES, API_ROUTES } from "@/lib/constants";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<
    "idle" | "verifying" | "success" | "error"
  >(token ? "verifying" : "idle");
  const [message, setMessage] = useState("");
  const [resending, setResending] = useState(false);
  const [resendMessage, setResendMessage] = useState("");

  useEffect(() => {
    if (!token) return;

    fetch(API_ROUTES.auth.verifyEmail, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (res.ok) {
          setStatus("success");
          setMessage(data.message || "Email verified successfully!");
        } else {
          setStatus("error");
          setMessage(
            data.message || "Verification failed. The link may be expired."
          );
        }
      })
      .catch(() => {
        setStatus("error");
        setMessage("Something went wrong. Please try again.");
      });
  }, [token]);

  async function handleResend() {
    setResending(true);
    setResendMessage("");

    try {
      const meRes = await fetch("/api/auth/me");
      if (!meRes.ok) {
        setResendMessage("Please log in first to resend verification.");
        return;
      }
      const meData = await meRes.json();

      const res = await fetch(API_ROUTES.auth.resendVerification, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: meData.user.email }),
      });

      const data = await res.json();
      setResendMessage(
        data.message || "If your email is registered, a new link has been sent."
      );
    } catch {
      setResendMessage("Something went wrong. Please try again.");
    } finally {
      setResending(false);
    }
  }

  // Token verification mode
  if (token) {
    return (
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex size-10 items-center justify-center rounded-lg bg-primary">
            <FileText className="size-5 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl">Email Verification</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          {status === "verifying" && (
            <>
              <Loader2 className="size-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">
                Verifying your email...
              </p>
            </>
          )}

          {status === "success" && (
            <>
              <CheckCircle className="size-12 text-green-500" />
              <p className="text-center text-sm font-medium text-green-700">
                {message}
              </p>
              <Button asChild className="w-full">
                <Link href={ROUTES.dashboard}>Go to Dashboard</Link>
              </Button>
            </>
          )}

          {status === "error" && (
            <>
              <XCircle className="size-12 text-destructive" />
              <p className="text-center text-sm font-medium text-destructive">
                {message}
              </p>
              <div className="flex w-full flex-col gap-2">
                <Button variant="outline" asChild className="w-full">
                  <Link href={ROUTES.login}>Back to Login</Link>
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    );
  }

  // "Check your inbox" mode (no token)
  return (
    <Card>
      <CardHeader className="text-center">
        <div className="mx-auto mb-2 flex size-10 items-center justify-center rounded-lg bg-primary">
          <Mail className="size-5 text-primary-foreground" />
        </div>
        <CardTitle className="text-2xl">Check your email</CardTitle>
        <CardDescription>
          We&apos;ve sent a verification link to your email address. Click the
          link to verify your account.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="rounded-md bg-muted p-4 text-center text-sm text-muted-foreground">
          Didn&apos;t receive the email? Check your spam folder or click below
          to resend.
        </div>

        <Button
          variant="outline"
          className="w-full"
          onClick={handleResend}
          disabled={resending}
        >
          {resending ? "Sending..." : "Resend verification email"}
        </Button>

        {resendMessage && (
          <p className="text-center text-sm text-muted-foreground">
            {resendMessage}
          </p>
        )}

        <p className="text-center text-sm text-muted-foreground">
          <Link
            href={ROUTES.login}
            className="font-medium text-primary hover:underline"
          >
            Back to Login
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <Loader2 className="size-8 animate-spin text-primary" />
          </CardContent>
        </Card>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
