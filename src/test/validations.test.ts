import { describe, it, expect } from "vitest";
import {
  loginSchema,
  registerSchema,
  expenseSchema,
  categorySchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "@/lib/validations";

describe("loginSchema", () => {
  it("accepts valid credentials", () => {
    const result = loginSchema.safeParse({
      email: "user@example.com",
      password: "secret",
    });
    expect(result.success).toBe(true);
  });

  it("rejects an invalid email", () => {
    const result = loginSchema.safeParse({
      email: "not-an-email",
      password: "secret",
    });
    expect(result.success).toBe(false);
  });

  it("rejects an empty password", () => {
    const result = loginSchema.safeParse({
      email: "user@example.com",
      password: "",
    });
    expect(result.success).toBe(false);
  });
});

describe("registerSchema", () => {
  const valid = {
    email: "user@example.com",
    password: "password123",
    fullName: "Jane Doe",
    organizationName: "Acme Corp",
  };

  it("accepts valid registration data", () => {
    expect(registerSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects a password shorter than 8 characters", () => {
    const result = registerSchema.safeParse({ ...valid, password: "short" });
    expect(result.success).toBe(false);
  });

  it("rejects a fullName shorter than 2 characters", () => {
    const result = registerSchema.safeParse({ ...valid, fullName: "A" });
    expect(result.success).toBe(false);
  });

  it("rejects an organizationName shorter than 2 characters", () => {
    const result = registerSchema.safeParse({
      ...valid,
      organizationName: "X",
    });
    expect(result.success).toBe(false);
  });
});

describe("expenseSchema", () => {
  const valid = {
    vendorName: "Office Supplies Co",
    amount: 99.99,
    date: "2024-01-15",
  };

  it("accepts valid expense data", () => {
    expect(expenseSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects a non-positive amount", () => {
    const result = expenseSchema.safeParse({ ...valid, amount: -10 });
    expect(result.success).toBe(false);
  });

  it("rejects a zero amount", () => {
    const result = expenseSchema.safeParse({ ...valid, amount: 0 });
    expect(result.success).toBe(false);
  });

  it("rejects an empty vendor name", () => {
    const result = expenseSchema.safeParse({ ...valid, vendorName: "" });
    expect(result.success).toBe(false);
  });

  it("rejects a missing date", () => {
    const result = expenseSchema.safeParse({ ...valid, date: "" });
    expect(result.success).toBe(false);
  });

  it("defaults currency to USD", () => {
    const result = expenseSchema.safeParse(valid);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.currency).toBe("USD");
    }
  });
});

describe("categorySchema", () => {
  it("accepts a valid category with all fields", () => {
    const result = categorySchema.safeParse({
      name: "Travel",
      color: "#FF5733",
      icon: "plane",
    });
    expect(result.success).toBe(true);
  });

  it("accepts a category with only the required name", () => {
    expect(categorySchema.safeParse({ name: "Travel" }).success).toBe(true);
  });

  it("rejects a name shorter than 2 characters", () => {
    const result = categorySchema.safeParse({ name: "A" });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid hex color", () => {
    const result = categorySchema.safeParse({
      name: "Travel",
      color: "red",
    });
    expect(result.success).toBe(false);
  });
});

describe("forgotPasswordSchema", () => {
  it("accepts a valid email", () => {
    expect(
      forgotPasswordSchema.safeParse({ email: "user@example.com" }).success
    ).toBe(true);
  });

  it("rejects an invalid email", () => {
    expect(
      forgotPasswordSchema.safeParse({ email: "bad-email" }).success
    ).toBe(false);
  });
});

describe("resetPasswordSchema", () => {
  it("accepts matching passwords of sufficient length", () => {
    const result = resetPasswordSchema.safeParse({
      newPassword: "NewPass123",
      confirmPassword: "NewPass123",
    });
    expect(result.success).toBe(true);
  });

  it("rejects a password shorter than 8 characters", () => {
    const result = resetPasswordSchema.safeParse({
      newPassword: "short",
      confirmPassword: "short",
    });
    expect(result.success).toBe(false);
  });

  it("rejects non-matching passwords", () => {
    const result = resetPasswordSchema.safeParse({
      newPassword: "NewPass123",
      confirmPassword: "Different123",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const paths = result.error.issues.map((i) => i.path.join("."));
      expect(paths).toContain("confirmPassword");
    }
  });
});
