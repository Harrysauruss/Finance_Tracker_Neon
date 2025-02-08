"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Transaction } from "@/utils/csvParser"
import { isWithinInterval, parse } from "date-fns"

interface TransactionsTabProps {
  transactions: Transaction[]
  dateRange: { from: Date | undefined; to: Date | undefined }
}

export default function TransactionsTab({ transactions, dateRange }: TransactionsTabProps) {
  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const transactionDate = parse(transaction.Date, "yyyy-MM-dd", new Date())
      if (dateRange.from && dateRange.to) {
        return isWithinInterval(transactionDate, { start: dateRange.from, end: dateRange.to })
      }
      return true
    })
  }, [transactions, dateRange.from, dateRange.to])

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((transaction, index) => (
                <TableRow key={index}>
                  <TableCell>{transaction.Date}</TableCell>
                  <TableCell
                    className={
                      transaction.Amount >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                    }
                  >
                    {transaction.Amount.toFixed(2)}.-
                  </TableCell>
                  <TableCell>{transaction.Description}</TableCell>
                  <TableCell>{transaction.Category || "Uncategorized"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

