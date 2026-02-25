"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { FileText, CheckCircle } from "lucide-react";
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
import type { ForgotPasswordFormData } from "@/lib/validations";

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>();

  async function onSubmit(data: ForgotPasswordFormData) {
    setError("");

    try {
      const res = await fetch(API_ROUTES.auth.forgotPassword, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const result = await res.json();
        setError(result.message || "Something went wrong.");
        return;
      }

      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    }
  }

  if (submitted) {
    return (
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex size-10 items-center justify-center rounded-lg bg-primary">
            <CheckCircle className="size-5 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl">Check your email</CardTitle>
          <CardDescription>
            If an account exists with that email, we&apos;ve sent a password
            reset link.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="rounded-md bg-muted p-4 text-center text-sm text-muted-foreground">
            The link will expire in 1 hour. Check your spam folder if you
            don&apos;t see it.
          </div>
          <Button variant="outline" asChild className="w-full">
            <Link href={ROUTES.login}>Back to Login</Link>
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
        <CardTitle className="text-2xl">Forgot password?</CardTitle>
        <CardDescription>
          Enter your email and we&apos;ll send you a reset link.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="flex flex-col gap-6">
          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && (
              <p className="text-sm text-destructive">
                {errors.email.message}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Sending..." : "Send reset link"}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Remember your password?{" "}
            <Link
              href={ROUTES.login}
              className="font-medium text-primary hover:underline"
            >
              Sign in
            </Link>
          </p>
        </CardContent>
      </form>
    </Card>
  );
}
