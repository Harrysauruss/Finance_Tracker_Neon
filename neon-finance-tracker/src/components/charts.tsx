"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart,
  Pie,
  Label,
  Cell,
  ResponsiveContainer,
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useMemo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ChartProps {
  incomeTotal: number;
  expenseTotal: number;
  incomePieChartData: Array<{ name: string; value: number }>;
  expensePieChartData: Array<{ name: string; value: number }>;
  COLORS: string[];
  monthlyData: Array<{
    month: string;
    income: number;
    expenses: number;
  }>;
}

export function DashboardCharts({ 
  incomeTotal, 
  expenseTotal, 
  incomePieChartData: allIncomePieChartData,
  expensePieChartData: allExpensePieChartData,
  COLORS,
  monthlyData 
}: ChartProps) {
  const [timeframe, setTimeframe] = useState<"monthly" | "yearly">("monthly");
  const [selectedMonth, setSelectedMonth] = useState<string>(
    monthlyData[0]?.month || ""
  );

  const chartData = useMemo(() => {
    if (timeframe === "yearly") {
      return [{
        month: "Total",
        income: incomeTotal,
        expenses: expenseTotal
      }];
    }
    return monthlyData;
  }, [timeframe, monthlyData, incomeTotal, expenseTotal]);

  const incomePieChartData = useMemo(() => {
    if (timeframe === "yearly") {
      return allIncomePieChartData;
    }
    const monthData = monthlyData.find(data => data.month === selectedMonth);
    if (!monthData) return [];
    
    const monthlyTotal = monthData.income;
    return allIncomePieChartData.map(category => ({
      ...category,
      value: (category.value / incomeTotal) * monthlyTotal
    }));
  }, [timeframe, selectedMonth, allIncomePieChartData, monthlyData, incomeTotal]);

  const expensePieChartData = useMemo(() => {
    if (timeframe === "yearly") {
      return allExpensePieChartData;
    }
    const monthData = monthlyData.find(data => data.month === selectedMonth);
    if (!monthData) return [];
    
    const monthlyTotal = monthData.expenses;
    return allExpensePieChartData.map(category => ({
      ...category,
      value: (category.value / expenseTotal) * monthlyTotal
    }));
  }, [timeframe, selectedMonth, allExpensePieChartData, monthlyData, expenseTotal]);

  const chartConfig: ChartConfig = {
    income: {
      label: "Income",
      color: "#22c55e",
    },
    expenses: {
      label: "Expenses",
      color: "#ef4444",
    },
  };

  return (
    <div className="mt-8 flex flex-col gap-4">
      <Card className="w-full min-h-[400px]">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Income vs Expenses</CardTitle>
          <Select
            defaultValue={timeframe}
            onValueChange={(value) => setTimeframe(value as "monthly" | "yearly")}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent className="h-[400px] pt-4">
          <ChartContainer
            config={chartConfig}
            className="w-full h-full"
          >
              <BarChart data={chartData}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false}
                  tickFormatter={(value) => `$${value}`}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent />}
                />
                <Bar 
                  dataKey="income"
                  fill="#22c55e"
                  stroke=""
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  dataKey="expenses"
                  fill="#ef4444"
                  stroke=""
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="w-full min-h-[400px] overflow-hidden">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle>Income by Category</CardTitle>
            <div className="flex flex-wrap items-center gap-2">
              {timeframe === "monthly" && (
                <Select
                  value={selectedMonth}
                  onValueChange={setSelectedMonth}
                >
                  <SelectTrigger className="w-[160px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {monthlyData.map((data) => (
                      <SelectItem key={data.month} value={data.month}>
                        {data.month}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              <Select
                defaultValue={timeframe}
                onValueChange={(value) => setTimeframe(value as "monthly" | "yearly")}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="h-[350px] pt-4">
            <div className="h-full w-full max-w-full">
              <ChartContainer
                config={chartConfig}
                className="w-full h-full"
              >
                <ResponsiveContainer width="99%" height="100%">
                  <PieChart>
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent />}
                    />
                    <Pie
                      key={`income-pie-${timeframe}-${selectedMonth}`}
                      data={incomePieChartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius="45%"
                      outerRadius="80%"
                      strokeWidth={10}
                      paddingAngle={2}
                    >
                      {incomePieChartData.map((entry, index) => (
                        <Cell 
                          key={`cell-${entry.name}-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                      <Label
                        content={({ viewBox }) => {
                          if (!viewBox || !("cx" in viewBox)) return null;
                          const total = incomePieChartData.reduce((sum, item) => sum + item.value, 0);
                          return (
                            <>
                              <text
                                x={viewBox.cx}
                                y={viewBox.cy ? viewBox.cy - 10 : 0}
                                textAnchor="middle"
                                className="fill-foreground text-lg font-bold"
                              >
                                {total.toLocaleString()}
                              </text>
                              <text
                                x={viewBox.cx}
                                y={viewBox.cy ? viewBox.cy + 10 : 0}
                                textAnchor="middle"
                                className="fill-muted-foreground text-sm"
                              >
                                Total Income
                              </text>
                            </>
                          );
                        }}
                      />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
        <Card className="w-full min-h-[400px] overflow-hidden">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle>Expenses by Category</CardTitle>
            <div className="flex flex-wrap items-center gap-2">
              {timeframe === "monthly" && (
                <Select
                  value={selectedMonth}
                  onValueChange={setSelectedMonth}
                >
                  <SelectTrigger className="w-[160px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {monthlyData.map((data) => (
                      <SelectItem key={data.month} value={data.month}>
                        {data.month}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              <Select
                defaultValue={timeframe}
                onValueChange={(value) => setTimeframe(value as "monthly" | "yearly")}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="h-[350px] pt-4">
            <div className="h-full w-full max-w-full">
              <ChartContainer
                config={chartConfig}
                className="w-full h-full"
              >
                <ResponsiveContainer width="99%" height="100%">
                  <PieChart>
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent />}
                    />
                    <Pie
                      key={`expense-pie-${timeframe}-${selectedMonth}`}
                      data={expensePieChartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius="45%"
                      outerRadius="80%"
                      strokeWidth={10}
                      paddingAngle={2}
                    >
                      {expensePieChartData.map((entry, index) => (
                        <Cell 
                          key={`cell-${entry.name}-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                      <Label
                        content={({ viewBox }) => {
                          if (!viewBox || !("cx" in viewBox)) return null;
                          const total = expensePieChartData.reduce((sum, item) => sum + item.value, 0);
                          return (
                            <>
                              <text
                                x={viewBox.cx}
                                y={viewBox?.cy ? viewBox.cy - 10 : 0}
                                textAnchor="middle"
                                className="fill-foreground text-lg font-bold"
                              >
                                {total.toLocaleString()}
                              </text>
                              <text
                                x={viewBox.cx}
                                y={viewBox?.cy ? viewBox.cy + 10 : 0}
                                textAnchor="middle"
                                className="fill-muted-foreground text-sm"
                              >
                                Total Expenses
                              </text>
                            </>
                          );
                        }}
                      />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 