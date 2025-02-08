"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Transaction } from "@/utils/csvParser"
import { isWithinInterval, parse, format } from "date-fns"
import { DashboardCharts } from "@/components/DashboardCharts"

interface OverviewTabProps {
  transactions: Transaction[]
  dateRange: { from: Date | undefined; to: Date | undefined }
  isDropdownOpen: boolean
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

export default function OverviewTab({ transactions, dateRange, isDropdownOpen }: OverviewTabProps) {
  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const transactionDate = parse(transaction.Date, "yyyy-MM-dd", new Date())
      if (dateRange.from && dateRange.to) {
        return isWithinInterval(transactionDate, { start: dateRange.from, end: dateRange.to })
      }
      return true
    })
  }, [transactions, dateRange.from, dateRange.to])

  const totalBalance = filteredTransactions.reduce((sum, transaction) => sum + transaction.Amount, 0)
  const incomeTotal = filteredTransactions.filter((t) => t.Amount > 0).reduce((sum, t) => sum + t.Amount, 0)
  const expenseTotal = filteredTransactions.filter((t) => t.Amount < 0).reduce((sum, t) => sum + Math.abs(t.Amount), 0)

  const monthlyData = useMemo(() => {
    const data: Record<string, { income: number; expenses: number }> = {}
    filteredTransactions.forEach((transaction) => {
      const date = parse(transaction.Date, "yyyy-MM-dd", new Date())
      const monthKey = format(date, "yyyy-MM")
      if (!data[monthKey]) {
        data[monthKey] = { income: 0, expenses: 0 }
      }
      if (transaction.Amount > 0) {
        data[monthKey].income += transaction.Amount
      } else {
        data[monthKey].expenses += Math.abs(transaction.Amount)
      }
    })
    return Object.entries(data).map(([month, values]) => ({
      month,
      income: values.income,
      expenses: values.expenses,
    }))
  }, [filteredTransactions])

  const incomePieChartData = useMemo(() => {
    const data: Record<string, number> = {}
    filteredTransactions
      .filter((t) => t.Amount > 0)
      .forEach((transaction) => {
        const category = transaction.Category || "Uncategorized"
        data[category] = (data[category] || 0) + transaction.Amount
      })
    return Object.entries(data).map(([name, value]) => ({ name, value }))
  }, [filteredTransactions])

  const expensePieChartData = useMemo(() => {
    const data: Record<string, number> = {}
    filteredTransactions
      .filter((t) => t.Amount < 0)
      .forEach((transaction) => {
        const category = transaction.Category || "Uncategorized"
        data[category] = (data[category] || 0) + Math.abs(transaction.Amount)
      })
    return Object.entries(data).map(([name, value]) => ({ name, value }))
  }, [filteredTransactions])

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalBalance.toFixed(2)}.-</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Income</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">{incomeTotal.toFixed(2)}.-</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">{expenseTotal.toFixed(2)}.-</p>
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
        isDropdownOpen={isDropdownOpen}
      />
    </div>
  )
}

