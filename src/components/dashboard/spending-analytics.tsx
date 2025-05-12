"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createClient } from "../../../supabase/client";
import { CalendarIcon, TagIcon } from "lucide-react";

type Transaction = {
  id: string;
  description: string;
  amount: number;
  category: string;
  transaction_date: string;
  transaction_type: "income" | "expense";
};

type CategoryTotal = {
  category: string;
  total: number;
  color: string;
};

// Define colors for different categories
const categoryColors: Record<string, string> = {
  housing: "#4C51BF", // indigo
  food: "#38A169", // green
  transportation: "#ED8936", // orange
  utilities: "#667EEA", // indigo
  entertainment: "#F56565", // red
  healthcare: "#9F7AEA", // purple
  shopping: "#ED64A6", // pink
  travel: "#48BB78", // green
  education: "#4299E1", // blue
  personal: "#ECC94B", // yellow
  other: "#A0AEC0", // gray
};

// Get a color for a category, with fallback
const getCategoryColor = (category: string): string => {
  return categoryColors[category.toLowerCase()] || "#A0AEC0";
};

export default function SpendingAnalytics() {
  const supabase = createClient();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categoryTotals, setCategoryTotals] = useState<CategoryTotal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      setIsLoading(true);

      try {
        // Get the current date
        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastDayOfMonth = new Date(
          now.getFullYear(),
          now.getMonth() + 1,
          0,
        );

        // Format dates for Supabase query
        const startDate = firstDayOfMonth.toISOString();
        const endDate = lastDayOfMonth.toISOString();

        // Fetch expense transactions for the current month
        const { data, error } = await supabase
          .from("transactions")
          .select("*")
          .eq("transaction_type", "expense")
          .gte("transaction_date", startDate)
          .lte("transaction_date", endDate)
          .order("transaction_date", { ascending: false });

        if (error) throw error;

        if (data && data.length > 0) {
          setTransactions(data as Transaction[]);

          // Calculate totals by category
          const categoryMap = new Map<string, number>();
          data.forEach((transaction: Transaction) => {
            const currentTotal = categoryMap.get(transaction.category) || 0;
            categoryMap.set(
              transaction.category,
              currentTotal +
                parseFloat(transaction.amount as unknown as string),
            );
          });

          // Convert map to array and sort by total (descending)
          const categoryArray: CategoryTotal[] = Array.from(
            categoryMap.entries(),
          ).map(([category, total]) => ({
            category,
            total,
            color: getCategoryColor(category),
          }));

          categoryArray.sort((a, b) => b.total - a.total);
          setCategoryTotals(categoryArray);
        } else {
          // Use sample data if no transactions found
          const sampleTransactions = [
            {
              id: "1",
              description: "Rent",
              amount: 1200,
              category: "Housing",
              transaction_date: new Date().toISOString(),
              transaction_type: "expense" as const,
            },
            {
              id: "2",
              description: "Groceries",
              amount: 250,
              category: "Food",
              transaction_date: new Date().toISOString(),
              transaction_type: "expense" as const,
            },
            {
              id: "3",
              description: "Gas",
              amount: 60,
              category: "Transportation",
              transaction_date: new Date().toISOString(),
              transaction_type: "expense" as const,
            },
            {
              id: "4",
              description: "Internet",
              amount: 80,
              category: "Utilities",
              transaction_date: new Date().toISOString(),
              transaction_type: "expense" as const,
            },
            {
              id: "5",
              description: "Movie tickets",
              amount: 30,
              category: "Entertainment",
              transaction_date: new Date().toISOString(),
              transaction_type: "expense" as const,
            },
          ];

          setTransactions(sampleTransactions);

          // Calculate sample category totals
          const sampleCategoryTotals = [
            {
              category: "Housing",
              total: 1200,
              color: getCategoryColor("housing"),
            },
            { category: "Food", total: 250, color: getCategoryColor("food") },
            {
              category: "Transportation",
              total: 60,
              color: getCategoryColor("transportation"),
            },
            {
              category: "Utilities",
              total: 80,
              color: getCategoryColor("utilities"),
            },
            {
              category: "Entertainment",
              total: 30,
              color: getCategoryColor("entertainment"),
            },
          ];

          setCategoryTotals(sampleCategoryTotals);
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
        // Use sample data in case of error
        const sampleTransactions = [
          {
            id: "1",
            description: "Rent",
            amount: 1200,
            category: "Housing",
            transaction_date: new Date().toISOString(),
            transaction_type: "expense" as const,
          },
          {
            id: "2",
            description: "Groceries",
            amount: 250,
            category: "Food",
            transaction_date: new Date().toISOString(),
            transaction_type: "expense" as const,
          },
          {
            id: "3",
            description: "Gas",
            amount: 60,
            category: "Transportation",
            transaction_date: new Date().toISOString(),
            transaction_type: "expense" as const,
          },
          {
            id: "4",
            description: "Internet",
            amount: 80,
            category: "Utilities",
            transaction_date: new Date().toISOString(),
            transaction_type: "expense" as const,
          },
          {
            id: "5",
            description: "Movie tickets",
            amount: 30,
            category: "Entertainment",
            transaction_date: new Date().toISOString(),
            transaction_type: "expense" as const,
          },
        ];

        setTransactions(sampleTransactions);

        // Calculate sample category totals
        const sampleCategoryTotals = [
          {
            category: "Housing",
            total: 1200,
            color: getCategoryColor("housing"),
          },
          { category: "Food", total: 250, color: getCategoryColor("food") },
          {
            category: "Transportation",
            total: 60,
            color: getCategoryColor("transportation"),
          },
          {
            category: "Utilities",
            total: 80,
            color: getCategoryColor("utilities"),
          },
          {
            category: "Entertainment",
            total: 30,
            color: getCategoryColor("entertainment"),
          },
        ];

        setCategoryTotals(sampleCategoryTotals);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [supabase]);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  // Calculate total expenses
  const totalExpenses = categoryTotals.reduce(
    (sum, category) => sum + category.total,
    0,
  );

  return (
    <Card className="w-full bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          Spending Analytics
        </CardTitle>
        <CardDescription>Monthly spending by category</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pie Chart */}
          <div className="flex flex-col items-center justify-center">
            {isLoading ? (
              <div className="h-64 w-64 rounded-full bg-gray-100 flex items-center justify-center">
                <p className="text-gray-500">Loading...</p>
              </div>
            ) : (
              <div className="relative h-64 w-64">
                <svg viewBox="0 0 100 100" className="h-full w-full">
                  {categoryTotals.length > 0 ? (
                    renderPieChart(categoryTotals, totalExpenses)
                  ) : (
                    <circle cx="50" cy="50" r="40" fill="#e2e8f0" />
                  )}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-sm font-medium text-gray-500">
                    Total
                  </span>
                  <span className="text-xl font-bold">
                    {formatCurrency(totalExpenses)}
                  </span>
                </div>
              </div>
            )}

            {/* Legend */}
            <div className="mt-4 grid grid-cols-2 gap-2 w-full">
              {categoryTotals.map((category) => (
                <div key={category.category} className="flex items-center">
                  <div
                    className="h-3 w-3 rounded-full mr-2"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="text-xs font-medium truncate">
                    {category.category}
                  </span>
                  <span className="text-xs text-gray-500 ml-1">
                    {((category.total / totalExpenses) * 100).toFixed(0)}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Transactions */}
          <div>
            <h3 className="font-medium mb-3">Recent Transactions</h3>
            <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
              {isLoading ? (
                <p className="text-gray-500">Loading transactions...</p>
              ) : transactions.length > 0 ? (
                transactions.slice(0, 5).map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center">
                      <div
                        className="h-8 w-8 rounded-full flex items-center justify-center mr-3"
                        style={{
                          backgroundColor:
                            getCategoryColor(transaction.category) + "20",
                        }}
                      >
                        <TagIcon
                          className="h-4 w-4"
                          style={{
                            color: getCategoryColor(transaction.category),
                          }}
                        />
                      </div>
                      <div>
                        <p className="font-medium text-sm">
                          {transaction.description}
                        </p>
                        <div className="flex items-center text-xs text-gray-500">
                          <CalendarIcon className="h-3 w-3 mr-1" />
                          <span>
                            {formatDate(transaction.transaction_date)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="font-semibold">
                      {formatCurrency(transaction.amount)}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No transactions found</p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Function to render pie chart segments
function renderPieChart(categories: CategoryTotal[], total: number) {
  let currentAngle = 0;
  return categories.map((category, index) => {
    const percentage = category.total / total;
    const startAngle = currentAngle;
    const endAngle = currentAngle + percentage * 360;
    currentAngle = endAngle;

    const x1 = 50 + 40 * Math.cos((startAngle * Math.PI) / 180);
    const y1 = 50 + 40 * Math.sin((startAngle * Math.PI) / 180);
    const x2 = 50 + 40 * Math.cos((endAngle * Math.PI) / 180);
    const y2 = 50 + 40 * Math.sin((endAngle * Math.PI) / 180);

    const largeArcFlag = percentage > 0.5 ? 1 : 0;

    const pathData = [
      `M 50 50`,
      `L ${x1} ${y1}`,
      `A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      `Z`,
    ].join(" ");

    return <path key={index} d={pathData} fill={category.color} />;
  });
}
