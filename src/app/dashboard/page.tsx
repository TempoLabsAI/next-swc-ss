import DashboardNavbar from "@/components/dashboard-navbar";
import { createClient } from "../../../supabase/server";
import { InfoIcon, UserCircle } from "lucide-react";
import { redirect } from "next/navigation";
import { SubscriptionCheck } from "@/components/subscription-check";
import dynamic from "next/dynamic";

// Dynamically import client components
const IncomeExpenses = dynamic(
  () => import("@/components/dashboard/income-expenses"),
  {
    ssr: false,
    loading: () => (
      <div className="h-64 bg-gray-100 rounded-xl animate-pulse"></div>
    ),
  },
);

const SpendingAnalytics = dynamic(
  () => import("@/components/dashboard/spending-analytics"),
  {
    ssr: false,
    loading: () => (
      <div className="h-96 bg-gray-100 rounded-xl animate-pulse"></div>
    ),
  },
);

const BudgetTracking = dynamic(
  () => import("@/components/dashboard/budget-tracking"),
  {
    ssr: false,
    loading: () => (
      <div className="h-96 bg-gray-100 rounded-xl animate-pulse"></div>
    ),
  },
);

export default async function Dashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <SubscriptionCheck>
      <DashboardNavbar />
      <main className="w-full">
        <div className="container mx-auto px-4 py-8 flex flex-col gap-8">
          {/* Header Section */}
          <header className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold">Financial Dashboard</h1>
            <div className="bg-secondary/50 text-sm p-3 px-4 rounded-lg text-muted-foreground flex gap-2 items-center">
              <InfoIcon size="14" />
              <span>Welcome to your personal finance management dashboard</span>
            </div>
          </header>

          {/* Income vs Expenses Section */}
          <IncomeExpenses />

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Spending Analytics */}
            <SpendingAnalytics />

            {/* Budget Tracking */}
            <BudgetTracking />
          </div>

          {/* User Profile Section */}
          <section className="bg-card rounded-xl p-6 border shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <UserCircle size={48} className="text-primary" />
              <div>
                <h2 className="font-semibold text-xl">User Profile</h2>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <div className="bg-muted/50 rounded-lg p-4 overflow-hidden">
              <pre className="text-xs font-mono max-h-48 overflow-auto">
                {JSON.stringify(user, null, 2)}
              </pre>
            </div>
          </section>
        </div>
      </main>
    </SubscriptionCheck>
  );
}
