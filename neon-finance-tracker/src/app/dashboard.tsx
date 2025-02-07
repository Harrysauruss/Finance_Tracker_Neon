"use client";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { parseCSV, ParsedCSVResult, Transaction } from "@/utils/csvParser";
import { isWithinInterval, parse, format } from "date-fns";
import { useMemo, useState } from "react";
import { DashboardCharts } from "@/components/charts";

export default function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const result: ParsedCSVResult = await parseCSV(file);
      setTransactions(result.transactions);
      setDateRange({
        from: result.earliestDate || undefined,
        to: result.latestDate || undefined,
      });
    }
  };

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const transactionDate = parse(transaction.Date, "yyyy-MM-dd", new Date());
      if (dateRange.from && dateRange.to) {
        return isWithinInterval(transactionDate, {
          start: dateRange.from,
          end: dateRange.to,
        });
      }
      return true;
    });
  }, [transactions, dateRange.from, dateRange.to]);

  const totalBalance = filteredTransactions.reduce(
    (sum, transaction) => sum + transaction.Amount,
    0
  );
  const incomeTotal = filteredTransactions
    .filter((t) => t.Amount > 0)
    .reduce((sum, t) => sum + t.Amount, 0);
  const expenseTotal = filteredTransactions
    .filter((t) => t.Amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.Amount), 0);

  const expenseCategoryData = filteredTransactions
    .filter(t => t.Amount < 0)
    .reduce((acc, transaction) => {
      const category = transaction.Category || "Uncategorized";
      acc[category] = (acc[category] || 0) + Math.abs(transaction.Amount);
      return acc;
    }, {} as Record<string, number>);

  const incomeCategoryData = filteredTransactions
    .filter(t => t.Amount > 0)
    .reduce((acc, transaction) => {
      const category = transaction.Category || "Uncategorized";
      acc[category] = (acc[category] || 0) + transaction.Amount;
      return acc;
    }, {} as Record<string, number>);

  const expensePieChartData = Object.entries(expenseCategoryData).map(([name, value]) => ({
    name,
    value,
  }));

  const incomePieChartData = Object.entries(incomeCategoryData).map(([name, value]) => ({
    name,
    value,
  }));


  const monthlyData = useMemo(() => {
    const monthlyTotals = filteredTransactions.reduce((acc, transaction) => {
      const date = parse(transaction.Date, "yyyy-MM-dd", new Date());
      const monthKey = format(date, "MMM yyyy");
      
      if (!acc[monthKey]) {
        acc[monthKey] = { income: 0, expenses: 0 };
      }
      
      if (transaction.Amount > 0) {
        acc[monthKey].income += transaction.Amount;
      } else {
        acc[monthKey].expenses += Math.abs(transaction.Amount);
      }
      
      return acc;
    }, {} as Record<string, { income: number; expenses: number }>);

    return Object.entries(monthlyTotals)
      .map(([month, totals]) => ({
        month,
        income: totals.income,
        expenses: totals.expenses,
      }))
      .sort((a, b) => {
        const dateA = parse(a.month, "MMM yyyy", new Date());
        const dateB = parse(b.month, "MMM yyyy", new Date());
        return dateA.getTime() - dateB.getTime();
      });
  }, [filteredTransactions]);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Banking Dashboard</h1>
        <ThemeSwitcher />
      </div>
      <div className="mb-4">
        <Label htmlFor="csv-upload">Upload CSV</Label>
        <Input
          id="csv-upload"
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
        />
      </div>
      <div className="mb-4">
        <Label>Select Date Range</Label>
        <DatePickerWithRange date={dateRange} setDate={setDateRange} />
      </div>
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="groupedByCategory">
            Grouped by Category
          </TabsTrigger>
          <TabsTrigger value="groupedByDescription">
            Grouped by Description
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Total Balance</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{totalBalance.toFixed(2)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Total Income</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {incomeTotal.toFixed(2)}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Total Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {expenseTotal.toFixed(2)}
                </p>
              </CardContent>
            </Card>
          </div>
          <DashboardCharts
            incomeTotal={incomeTotal}
            expenseTotal={expenseTotal}
            incomePieChartData={incomePieChartData}
            expensePieChartData={expensePieChartData}
            COLORS={COLORS}
            monthlyData={monthlyData}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
