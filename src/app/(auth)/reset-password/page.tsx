"use client";

import { Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { FileText, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ROUTES, API_ROUTES } from "@/lib/constants";
import type { ResetPasswordFormData } from "@/lib/validations";

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"form" | "success" | "error">("form");
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>();

  async function onSubmit(data: ResetPasswordFormData) {
    setError("");

    if (data.newPassword !== data.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const res = await fetch(API_ROUTES.auth.resetPassword, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          newPassword: data.newPassword,
        }),
      });

      if (!res.ok) {
        const result = await res.json();
        if (
          result.message?.includes("expired") ||
          result.message?.includes("Invalid")
        ) {
          setStatus("error");
          setError(result.message);
        } else {
          setError(result.message || "Something went wrong.");
        }
        return;
      }

      setStatus("success");
    } catch {
      setError("Something went wrong. Please try again.");
    }
  }

  if (!token) {
    return (
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex size-10 items-center justify-center rounded-lg bg-destructive">
            <XCircle className="size-5 text-destructive-foreground" />
          </div>
          <CardTitle className="text-2xl">Invalid link</CardTitle>
          <CardDescription>
            This password reset link is invalid or missing a token.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" asChild className="w-full">
            <Link href={ROUTES.forgotPassword}>Request a new link</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (status === "success") {
    return (
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex size-10 items-center justify-center rounded-lg bg-primary">
            <CheckCircle className="size-5 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl">Password reset!</CardTitle>
          <CardDescription>
            Your password has been updated. You can now sign in with your new
            password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full">
            <Link href={ROUTES.login}>Go to Login</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (status === "error") {
    return (
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex size-10 items-center justify-center rounded-lg bg-destructive">
            <XCircle className="size-5 text-destructive-foreground" />
          </div>
          <CardTitle className="text-2xl">Link expired</CardTitle>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" asChild className="w-full">
            <Link href={ROUTES.forgotPassword}>Request a new link</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <div className="mx-auto mb-2 flex size-10 items-center justify-center rounded-lg bg-primary">
          <FileText className="size-5 text-primary-foreground" />
        </div>
        <CardTitle className="text-2xl">Reset your password</CardTitle>
        <CardDescription>Enter your new password below.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="flex flex-col gap-6">
          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="Min 8 characters"
                {...register("newPassword", {
                  required: "Password is required",
                  minLength: { value: 8, message: "Min 8 characters" },
                })}
              />
              {errors.newPassword && (
                <p className="text-sm text-destructive">
                  {errors.newPassword.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Re-enter your password"
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                })}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-destructive">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Resetting..." : "Reset password"}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            <Link
              href={ROUTES.login}
              className="font-medium text-primary hover:underline"
            >
              Back to Login
            </Link>
          </p>
        </CardContent>
      </form>
    </Card>
  );
}

export default function ResetPasswordPage() {
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
      <ResetPasswordContent />
    </Suspense>
  );
}
