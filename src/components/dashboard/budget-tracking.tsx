"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createClient } from "../../../supabase/client";
import { AlertCircleIcon, PlusIcon } from "lucide-react";

type Budget = {
  id: string;
  category: string;
  amount: number;
  period: string;
  start_date: string;
  end_date?: string;
  spent?: number;
  percentage?: number;
};

export default function BudgetTracking() {
  const supabase = createClient();
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newBudget, setNewBudget] = useState<{
    category: string;
    amount: string;
    period: string;
  }>({
    category: "",
    amount: "",
    period: "monthly",
  });

  useEffect(() => {
    const fetchBudgets = async () => {
      setIsLoading(true);

      try {
        // Fetch user's budgets
        const { data: budgetsData, error: budgetsError } = await supabase
          .from("budgets")
          .select("*");

        if (budgetsError) throw budgetsError;

        if (budgetsData && budgetsData.length > 0) {
          // Get the current date
          const now = new Date();
          const firstDayOfMonth = new Date(
            now.getFullYear(),
            now.getMonth(),
            1,
          );
          const lastDayOfMonth = new Date(
            now.getFullYear(),
            now.getMonth() + 1,
            0,
          );

          // Format dates for Supabase query
          const startDate = firstDayOfMonth.toISOString();
          const endDate = lastDayOfMonth.toISOString();

          // For each budget, calculate how much has been spent
          const budgetsWithSpending = await Promise.all(
            budgetsData.map(async (budget: Budget) => {
              // Fetch transactions for this category and period
              const { data: transactionsData, error: transactionsError } =
                await supabase
                  .from("transactions")
                  .select("amount")
                  .eq("category", budget.category)
                  .eq("transaction_type", "expense")
                  .gte("transaction_date", startDate)
                  .lte("transaction_date", endDate);

              if (transactionsError) throw transactionsError;

              // Calculate total spent
              const spent =
                transactionsData?.reduce(
                  (sum, transaction) =>
                    sum + parseFloat(transaction.amount as unknown as string),
                  0,
                ) || 0;

              // Calculate percentage of budget used
              const percentage = Math.min(
                Math.round(
                  (spent / parseFloat(budget.amount as unknown as string)) *
                    100,
                ),
                100,
              );

              return {
                ...budget,
                spent,
                percentage,
              };
            }),
          );

          setBudgets(budgetsWithSpending);
        } else {
          // Use sample data if no budgets found
          const sampleBudgets = [
            {
              id: "1",
              category: "Housing",
              amount: 1500,
              period: "monthly",
              start_date: new Date().toISOString(),
              spent: 1200,
              percentage: 80,
            },
            {
              id: "2",
              category: "Food",
              amount: 600,
              period: "monthly",
              start_date: new Date().toISOString(),
              spent: 450,
              percentage: 75,
            },
            {
              id: "3",
              category: "Transportation",
              amount: 300,
              period: "monthly",
              start_date: new Date().toISOString(),
              spent: 180,
              percentage: 60,
            },
            {
              id: "4",
              category: "Entertainment",
              amount: 200,
              period: "monthly",
              start_date: new Date().toISOString(),
              spent: 220,
              percentage: 110,
            },
          ];

          setBudgets(sampleBudgets);
        }
      } catch (error) {
        console.error("Error fetching budgets:", error);
        // Use sample data in case of error
        const sampleBudgets = [
          {
            id: "1",
            category: "Housing",
            amount: 1500,
            period: "monthly",
            start_date: new Date().toISOString(),
            spent: 1200,
            percentage: 80,
          },
          {
            id: "2",
            category: "Food",
            amount: 600,
            period: "monthly",
            start_date: new Date().toISOString(),
            spent: 450,
            percentage: 75,
          },
          {
            id: "3",
            category: "Transportation",
            amount: 300,
            period: "monthly",
            start_date: new Date().toISOString(),
            spent: 180,
            percentage: 60,
          },
          {
            id: "4",
            category: "Entertainment",
            amount: 200,
            period: "monthly",
            start_date: new Date().toISOString(),
            spent: 220,
            percentage: 110,
          },
        ];

        setBudgets(sampleBudgets);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBudgets();
  }, [supabase]);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewBudget({ ...newBudget, [name]: value });
  };

  // Handle period selection
  const handlePeriodChange = (value: string) => {
    setNewBudget({ ...newBudget, period: value });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newBudget.category || !newBudget.amount) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      const { data, error } = await supabase.from("budgets").insert([
        {
          category: newBudget.category,
          amount: parseFloat(newBudget.amount),
          period: newBudget.period,
          start_date: new Date().toISOString(),
        },
      ]);

      if (error) throw error;

      // Close dialog and refresh budgets
      setIsDialogOpen(false);
      setNewBudget({ category: "", amount: "", period: "monthly" });

      // Refresh budgets list
      const fetchBudgets = async () => {
        const { data: budgetsData, error: budgetsError } = await supabase
          .from("budgets")
          .select("*");

        if (budgetsError) throw budgetsError;

        if (budgetsData) {
          setBudgets(budgetsData);
        }
      };

      fetchBudgets();
    } catch (error) {
      console.error("Error creating budget:", error);
      alert("Failed to create budget. Please try again.");
    }
  };

  // Get progress color based on percentage
  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return "bg-red-500";
    if (percentage >= 75) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <Card className="w-full bg-white shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl font-semibold">
            Budget Tracking
          </CardTitle>
          <CardDescription>
            Monitor your spending against budget limits
          </CardDescription>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1">
              <PlusIcon className="h-4 w-4" />
              <span>Add Budget</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Budget</DialogTitle>
              <DialogDescription>
                Set up a new budget to track your spending in a specific
                category.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    name="category"
                    placeholder="e.g., Housing, Food, Transportation"
                    value={newBudget.category}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="amount">Budget Amount</Label>
                  <Input
                    id="amount"
                    name="amount"
                    type="number"
                    placeholder="0.00"
                    value={newBudget.amount}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="period">Period</Label>
                  <Select
                    value={newBudget.period}
                    onValueChange={handlePeriodChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Create Budget</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8">Loading budgets...</div>
        ) : budgets.length > 0 ? (
          <div className="space-y-6">
            {budgets.map((budget) => (
              <div key={budget.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{budget.category}</h3>
                    <p className="text-sm text-gray-500">
                      {formatCurrency(budget.spent || 0)} of{" "}
                      {formatCurrency(budget.amount)}
                    </p>
                  </div>
                  <span className="text-sm font-medium">
                    {budget.percentage}%
                  </span>
                </div>
                <Progress
                  value={budget.percentage}
                  className="h-2"
                  indicatorClassName={getProgressColor(budget.percentage || 0)}
                />

                {/* Alert for budgets over 90% */}
                {budget.percentage && budget.percentage >= 90 && (
                  <Alert variant="destructive" className="mt-2 py-2">
                    <AlertCircleIcon className="h-4 w-4" />
                    <AlertTitle className="text-sm font-medium">
                      Budget Alert
                    </AlertTitle>
                    <AlertDescription className="text-xs">
                      You've used {budget.percentage}% of your {budget.category}{" "}
                      budget.
                    </AlertDescription>
                  </Alert>
                )}

                {/* Warning for budgets over 75% */}
                {budget.percentage &&
                  budget.percentage >= 75 &&
                  budget.percentage < 90 && (
                    <Alert
                      variant="warning"
                      className="mt-2 py-2 bg-yellow-50 border-yellow-200 text-yellow-800"
                    >
                      <AlertCircleIcon className="h-4 w-4 text-yellow-600" />
                      <AlertTitle className="text-sm font-medium">
                        Budget Warning
                      </AlertTitle>
                      <AlertDescription className="text-xs">
                        You're approaching your {budget.category} budget limit.
                      </AlertDescription>
                    </Alert>
                  )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">
              No budgets found. Create your first budget to start tracking.
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t pt-4 text-xs text-gray-500">
        <p>Budgets reset at the beginning of each period.</p>
      </CardFooter>
    </Card>
  );
}
