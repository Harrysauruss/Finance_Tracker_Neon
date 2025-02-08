"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import type { Transaction } from "@/utils/csvParser"
import { isWithinInterval, parse } from "date-fns"

interface GroupedByCategoryTabProps {
  transactions: Transaction[]
  dateRange: { from: Date | undefined; to: Date | undefined }
}

export default function GroupedByCategoryTab({ transactions, dateRange }: GroupedByCategoryTabProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const transactionDate = parse(transaction.Date, "yyyy-MM-dd", new Date())
      if (dateRange.from && dateRange.to) {
        return isWithinInterval(transactionDate, { start: dateRange.from, end: dateRange.to })
      }
      return true
    })
  }, [transactions, dateRange.from, dateRange.to])

  const groupedTransactions = useMemo(() => {
    return filteredTransactions.reduce(
      (acc, transaction) => {
        const category = transaction.Category || "Uncategorized"
        if (!acc[category]) {
          acc[category] = []
        }
        acc[category].push(transaction)
        return acc
      },
      {} as Record<string, Transaction[]>,
    )
  }, [filteredTransactions])

  const categoryOptions = useMemo(() => {
    return Object.keys(groupedTransactions).sort()
  }, [groupedTransactions])

  const selectedTransactions = selectedCategory ? groupedTransactions[selectedCategory] : []
  const selectedTotal = selectedTransactions.reduce((sum, t) => sum + t.Amount, 0)

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Transactions by Category</CardTitle>
          <CardDescription>Select a category to view details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4 mb-4">
            <Select value={selectedCategory || ""} onValueChange={(value) => setSelectedCategory(value)}>
              <SelectTrigger className="w-[300px]">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map((option) => {
                  const transactions = groupedTransactions[option]
                  const total = transactions.reduce((sum, t) => sum + t.Amount, 0)
                  return (
                    <SelectItem key={option} value={option}>
                      <div className="flex justify-between items-center w-full">
                        <span className="truncate mr-2">{option}</span>
                        <span
                          className={`font-semibold ${total >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
                        >
                          {total.toFixed(2)}.-
                        </span>
                      </div>
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => setSelectedCategory(null)}>
              Clear Selection
            </Button>
          </div>
          {selectedCategory ? (
            <div>
              <h3 className="text-xl font-bold mb-2">{selectedCategory}</h3>
              <p className="font-semibold mb-2">Total: {selectedTotal.toFixed(2)}.-</p>
              <ScrollArea className="h-[300px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedTransactions.map((transaction, index) => (
                      <TableRow key={index}>
                        <TableCell>{transaction.Date}</TableCell>
                        <TableCell
                          className={
                            transaction.Amount >= 0
                              ? "text-green-600 dark:text-green-400"
                              : "text-red-600 dark:text-red-400"
                          }
                        >
                          {transaction.Amount.toFixed(2)}.-
                        </TableCell>
                        <TableCell>{transaction.Description}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </div>
          ) : (
            <p>Please select a category to view details.</p>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Category Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] pr-4">
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(groupedTransactions).map(([category, transactions]) => {
                const total = transactions.reduce((sum, t) => sum + t.Amount, 0)
                return (
                  <div key={category} className="flex justify-between items-center p-2 bg-muted rounded-md">
                    <span className="font-medium truncate mr-2">{category}</span>
                    <span
                      className={`font-semibold ${total >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
                    >
                      {total.toFixed(2)}.-
                    </span>
                  </div>
                )
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}

