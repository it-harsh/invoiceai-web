import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Building2,
  CheckCircle,
  Cpu,
  Download,
  FileText,
  Shield,
  Sparkles,
  Star,
  Tags,
  Upload,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ROUTES } from "@/lib/constants";

/* ──────────────────── DATA ──────────────────── */

const stats = [
  { value: "500+", label: "Businesses" },
  { value: "50K+", label: "Invoices Processed" },
  { value: "99.2%", label: "AI Accuracy" },
  { value: "<5s", label: "Processing Time" },
];

const features = [
  {
    icon: Sparkles,
    title: "AI-Powered Extraction",
    description:
      "Upload any invoice and our AI instantly extracts vendor names, amounts, dates, tax info, and line items with 99%+ accuracy.",
  },
  {
    icon: BarChart3,
    title: "Real-Time Dashboard",
    description:
      "Beautiful charts and analytics give you instant visibility into spending trends, top categories, and month-over-month comparisons.",
  },
  {
    icon: Tags,
    title: "Smart Categorization",
    description:
      "Expenses are automatically categorized by AI. Create custom categories to match your business workflow perfectly.",
  },
  {
    icon: Building2,
    title: "Multi-Organization",
    description:
      "Manage expenses across multiple businesses or departments from a single account with role-based access control.",
  },
  {
    icon: Download,
    title: "One-Click Export",
    description:
      "Export your expense data to CSV anytime for seamless integration with your accounting software or tax preparation.",
  },
  {
    icon: Shield,
    title: "Bank-Grade Security",
    description:
      "End-to-end encryption, secure cloud storage on Cloudflare R2, and httpOnly JWT tokens keep your financial data safe.",
  },
];

const steps = [
  {
    icon: Upload,
    step: "01",
    title: "Upload Your Invoice",
    description:
      "Drag and drop your invoices in PDF, PNG, or JPEG format. We support receipts, bills, and purchase orders of any layout.",
  },
  {
    icon: Cpu,
    step: "02",
    title: "AI Extracts the Data",
    description:
      "Our AI reads every line of your invoice and extracts vendor, amount, date, tax, and line items in seconds — zero manual entry.",
  },
  {
    icon: CheckCircle,
    step: "03",
    title: "Review & Track",
    description:
      "Review extracted data, approve or reject expenses, and watch your dashboard update in real-time with spending insights.",
  },
];

const testimonials = [
  {
    quote:
      "InvoiceAI saved our accounting team 15 hours per week. The AI extraction is incredibly accurate and keeps getting better.",
    name: "Sarah Chen",
    role: "CFO",
    company: "TechStart Inc.",
  },
  {
    quote:
      "We switched from manual spreadsheets to InvoiceAI and never looked back. The dashboard insights are game-changing for our budgeting.",
    name: "Marcus Johnson",
    role: "Operations Manager",
    company: "GreenLeaf Co.",
  },
  {
    quote:
      "The multi-org feature is perfect for our agency. We manage 12 client accounts from one dashboard with full visibility.",
    name: "Priya Patel",
    role: "Founder",
    company: "Nexus Digital",
  },
];

const pricingPlans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for freelancers and small teams getting started.",
    features: [
      "50 invoices per month",
      "AI-powered extraction",
      "Basic dashboard",
      "1 organization",
      "Email support",
    ],
    cta: "Get Started",
    variant: "outline" as const,
    popular: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "per month",
    description: "For growing businesses that need more power and flexibility.",
    features: [
      "Unlimited invoices",
      "Advanced AI extraction",
      "Full analytics dashboard",
      "5 organizations",
      "Priority support",
      "CSV & PDF export",
      "Custom categories",
    ],
    cta: "Start Free Trial",
    variant: "default" as const,
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "per month",
    description: "For large teams with advanced security and compliance needs.",
    features: [
      "Everything in Pro",
      "Unlimited organizations",
      "Custom AI models",
      "API access",
      "Dedicated account manager",
      "SSO & SAML",
      "99.9% SLA",
    ],
    cta: "Contact Sales",
    variant: "outline" as const,
    popular: false,
  },
];

/* ──────────────────── PAGE ──────────────────── */

export default function LandingPage() {
  return (
    <>
      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-grid opacity-40" />
        <div className="absolute left-1/2 top-0 -z-10 -translate-x-1/2">
          <div className="h-[600px] w-[600px] rounded-full bg-primary/5 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 pb-24 pt-20 sm:px-6 sm:pb-32 sm:pt-28 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="secondary" className="mb-6 px-4 py-1.5 text-sm font-medium">
              <Zap className="mr-1.5 size-3.5" />
              AI-Powered Invoice Processing
            </Badge>

            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Stop Wasting Hours on{" "}
              <span className="text-gradient">Manual Invoice Processing</span>
            </h1>

            <p className="mt-6 text-lg leading-relaxed text-muted-foreground sm:text-xl">
              Upload invoices, let AI extract the data, and gain real-time insights into your
              business spending. Save hours on manual data entry and never lose track of an expense
              again.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" className="h-12 px-8 text-base" asChild>
                <Link href={ROUTES.register}>
                  Get Started Free
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="h-12 px-8 text-base" asChild>
                <a href="#how-it-works">See How It Works</a>
              </Button>
            </div>

            <p className="mt-4 text-sm text-muted-foreground">
              No credit card required &middot; Free plan available
            </p>
          </div>

          {/* Stats */}
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-2 gap-6 sm:grid-cols-4 sm:gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold text-primary sm:text-4xl">{stat.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Dashboard Preview */}
          <div className="relative mx-auto mt-20 max-w-5xl">
            <div className="glow-indigo absolute -inset-4 rounded-2xl" />
            <div className="relative overflow-hidden rounded-xl border bg-card shadow-2xl">
              {/* Title bar */}
              <div className="flex items-center gap-2 border-b bg-muted/50 px-4 py-3">
                <div className="size-3 rounded-full bg-red-400" />
                <div className="size-3 rounded-full bg-yellow-400" />
                <div className="size-3 rounded-full bg-green-400" />
                <span className="ml-4 text-xs text-muted-foreground">
                  app.invoiceai.com/dashboard
                </span>
              </div>

              {/* Mock Dashboard Content */}
              <div className="p-6">
                {/* Summary Cards Row */}
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  {[
                    { label: "Total Spend", value: "$24,563", change: "+12.5%" },
                    { label: "Invoices", value: "142", change: "+8.3%" },
                    { label: "Avg. Expense", value: "$173", change: "-3.2%" },
                    { label: "Top Category", value: "Software", change: "" },
                  ].map((card) => (
                    <div
                      key={card.label}
                      className="rounded-lg border bg-background p-4"
                    >
                      <p className="text-xs text-muted-foreground">{card.label}</p>
                      <p className="mt-1 text-xl font-bold">{card.value}</p>
                      {card.change && (
                        <p
                          className={`mt-0.5 text-xs ${card.change.startsWith("+") ? "text-green-600 dark:text-green-400" : "text-red-500 dark:text-red-400"}`}
                        >
                          {card.change} vs last month
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                {/* Charts Row */}
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {/* Spend by Category - Pie chart mock */}
                  <div className="rounded-lg border bg-background p-4">
                    <p className="mb-4 text-sm font-medium">Spend by Category</p>
                    <div className="flex items-center justify-center gap-8">
                      <div className="relative size-32">
                        <svg viewBox="0 0 36 36" className="size-32 -rotate-90">
                          <circle
                            cx="18"
                            cy="18"
                            r="14"
                            fill="none"
                            stroke="currentColor"
                            className="text-primary/20"
                            strokeWidth="4"
                          />
                          <circle
                            cx="18"
                            cy="18"
                            r="14"
                            fill="none"
                            stroke="currentColor"
                            className="text-primary"
                            strokeWidth="4"
                            strokeDasharray="35 65"
                            strokeLinecap="round"
                          />
                          <circle
                            cx="18"
                            cy="18"
                            r="14"
                            fill="none"
                            stroke="currentColor"
                            className="text-chart-2"
                            strokeWidth="4"
                            strokeDasharray="25 75"
                            strokeDashoffset="-35"
                            strokeLinecap="round"
                          />
                          <circle
                            cx="18"
                            cy="18"
                            r="14"
                            fill="none"
                            stroke="currentColor"
                            className="text-chart-4"
                            strokeWidth="4"
                            strokeDasharray="20 80"
                            strokeDashoffset="-60"
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>
                      <div className="space-y-2 text-xs">
                        <div className="flex items-center gap-2">
                          <div className="size-2.5 rounded-full bg-primary" />
                          <span className="text-muted-foreground">Software 35%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="size-2.5 rounded-full bg-chart-2" />
                          <span className="text-muted-foreground">Marketing 25%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="size-2.5 rounded-full bg-chart-4" />
                          <span className="text-muted-foreground">Office 20%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="size-2.5 rounded-full bg-muted-foreground/30" />
                          <span className="text-muted-foreground">Other 20%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Monthly Trend - Bar chart mock */}
                  <div className="rounded-lg border bg-background p-4">
                    <p className="mb-4 text-sm font-medium">Monthly Trend</p>
                    <div className="flex h-32 items-end gap-2">
                      {[40, 55, 45, 70, 60, 85, 75, 90, 65, 80, 95, 88].map((h, i) => (
                        <div key={i} className="flex flex-1 flex-col items-center gap-1">
                          <div
                            className="w-full rounded-t bg-primary/80 transition-all hover:bg-primary"
                            style={{ height: `${h}%` }}
                          />
                          <span className="text-[9px] text-muted-foreground">
                            {["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"][i]}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Recent expenses table mock */}
                <div className="mt-6 rounded-lg border bg-background">
                  <div className="border-b px-4 py-3">
                    <p className="text-sm font-medium">Recent Expenses</p>
                  </div>
                  <div className="divide-y">
                    {[
                      {
                        vendor: "AWS",
                        category: "Cloud",
                        amount: "$2,340",
                        status: "Approved",
                        statusColor: "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950",
                      },
                      {
                        vendor: "Figma",
                        category: "Software",
                        amount: "$180",
                        status: "Needs Review",
                        statusColor: "text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-950",
                      },
                      {
                        vendor: "Google Ads",
                        category: "Marketing",
                        amount: "$1,450",
                        status: "Approved",
                        statusColor: "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950",
                      },
                    ].map((row) => (
                      <div
                        key={row.vendor}
                        className="flex items-center justify-between px-4 py-3 text-sm"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex size-8 items-center justify-center rounded-full bg-muted text-xs font-medium">
                            {row.vendor[0]}
                          </div>
                          <div>
                            <p className="font-medium">{row.vendor}</p>
                            <p className="text-xs text-muted-foreground">{row.category}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-medium">{row.amount}</span>
                          <span
                            className={`rounded-full px-2 py-0.5 text-xs font-medium ${row.statusColor}`}
                          >
                            {row.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── TRUSTED BY ─── */}
      <section className="border-y bg-muted/30 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="mb-8 text-center text-sm font-medium text-muted-foreground">
            TRUSTED BY TEAMS AT COMPANIES WORLDWIDE
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
            {["Acme Corp", "TechStart", "GreenLeaf", "Nexus Digital", "CloudBase", "FinanceIQ"].map(
              (name) => (
                <span key={name} className="text-lg font-bold tracking-tight text-muted-foreground/50">
                  {name}
                </span>
              )
            )}
          </div>
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section id="features" className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="secondary" className="mb-4 px-4 py-1.5 text-sm font-medium">
              Features
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need to manage expenses
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              From invoice upload to spending insights, InvoiceAI handles it all so you can focus on
              growing your business.
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card
                key={feature.title}
                className="group relative overflow-hidden transition-shadow hover:shadow-lg"
              >
                <CardContent className="p-6">
                  <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <feature.icon className="size-6" />
                  </div>
                  <h3 className="text-lg font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section id="how-it-works" className="border-y bg-muted/30 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="secondary" className="mb-4 px-4 py-1.5 text-sm font-medium">
              How It Works
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Three steps to automated expense tracking
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Get from invoice upload to spending insight in under a minute.
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-4xl gap-8 md:grid-cols-3">
            {steps.map((step) => (
              <div key={step.step} className="relative text-center">
                <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
                  <step.icon className="size-7" />
                </div>
                <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-primary">
                  Step {step.step}
                </span>
                <h3 className="text-xl font-semibold">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="secondary" className="mb-4 px-4 py-1.5 text-sm font-medium">
              Testimonials
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Loved by finance teams everywhere
            </h2>
          </div>

          <div className="mx-auto mt-16 grid max-w-5xl gap-8 md:grid-cols-3">
            {testimonials.map((t) => (
              <Card key={t.name} className="relative">
                <CardContent className="p-6">
                  <div className="mb-4 flex gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className="size-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="mt-6 flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                      {t.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{t.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {t.role}, {t.company}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PRICING ─── */}
      <section id="pricing" className="border-t bg-muted/30 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="secondary" className="mb-4 px-4 py-1.5 text-sm font-medium">
              Pricing
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Simple, transparent pricing
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Start free. Upgrade when you need more power.
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-5xl gap-8 md:grid-cols-3">
            {pricingPlans.map((plan) => (
              <Card
                key={plan.name}
                className={`relative flex flex-col ${plan.popular ? "border-primary shadow-lg ring-1 ring-primary" : ""}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="px-3 py-1 text-xs">Most Popular</Badge>
                  </div>
                )}
                <CardContent className="flex flex-1 flex-col p-6">
                  <h3 className="text-lg font-semibold">{plan.name}</h3>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    {plan.period !== "forever" && (
                      <span className="text-sm text-muted-foreground">/{plan.period.replace("per ", "")}</span>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>

                  <ul className="mt-8 flex-1 space-y-3">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="mt-0.5 size-4 shrink-0 text-primary" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    variant={plan.variant}
                    className="mt-8 w-full"
                    asChild
                  >
                    <Link href={ROUTES.register}>{plan.cta}</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="relative overflow-hidden py-24">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2">
          <div className="h-[400px] w-[400px] rounded-full bg-primary/5 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <FileText className="mx-auto mb-6 size-12 text-primary" />
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to automate your invoice processing?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Join 500+ businesses saving time and money with InvoiceAI. Get started in under 2
            minutes.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" className="h-12 px-8 text-base" asChild>
              <Link href={ROUTES.register}>
                Get Started Free
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            No credit card required &middot; Setup in under 2 minutes
          </p>
        </div>
      </section>
    </>
  );
}
